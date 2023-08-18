from datetime import datetime
from typing import Dict, List

from sqlalchemy.orm import contains_eager, Session

import models
from tool_kit.external import DatabaseConnection
import view_models


class Storage:
    _db_manager = None

    @classmethod
    def _get_db_manager(cls):
        if cls._db_manager is None:
            cls._db_manager = DatabaseConnection()
        return cls._db_manager

    @classmethod
    def load_item(cls, item_id):
        with cls._get_db_manager().get_new_session() as session:
            db_item = cls._build_item_query(session).filter(
                models.Item.id == item_id
            ).one()

        return cls._build_item_view_model(db_item)


    @classmethod
    def load_item_list(cls):
        with cls._get_db_manager().get_new_session() as session:
            db_items = (
                cls._build_item_query(session)
                .join(models.ItemNeeded)
                .filter(models.ItemNeeded.cleared_time.is_(None))
            ).all()

        view_items = []
        for db_item in db_items:
            view_model = cls._build_item_view_model(db_item)
            view_model.is_needed = True
            view_items.append(view_model)
            
        return view_items

    @classmethod
    def load_locations(cls) -> List[str]:
        with cls._get_db_manager().get_new_session() as session:
            locations = session.query(models.Location).all()
        return [cls._build_location_view_model(location) for location in locations]

    @classmethod
    def mark_item_needed(cls, item_id):
        with cls._get_db_manager().get_new_session() as session:
            session.add(models.ItemNeeded(item_id=item_id))

    @classmethod
    def mark_item_not_needed(cls, item_id):
        with cls._get_db_manager().get_new_session() as session:
            session.query(models.ItemNeeded).filter(
                models.ItemNeeded.item_id == item_id
            ).update({
                models.ItemNeeded.cleared_time: datetime.utcnow()
            })

    @classmethod
    def upsert_item(cls, view_item: view_models.Item):
        with cls._get_db_manager().get_new_session() as session:
            if view_item.id is None:
                item = models.Item()
                session.add(item)
                session.add(models.ItemNeeded(item=item))
            else:
                item = session.query(models.Item).get(view_item.id)

            item.name = view_item.name

            item.location_refs = [
                models.ItemLocation(location_id=location_id)
                for location_id in view_item.locations
            ]

        return item.id
    
    @classmethod
    def upsert_location(cls, view_location: view_models.Location):
        with cls._get_db_manager().get_new_session() as session:
            if view_location.id is None:
                location = models.Location()
                session.add(location)
            else:
                location = session.query(models.Location).get(view_location.id)

            location.name = view_location.name
            location.color = view_location.color

        return location.id

    @classmethod
    def update_locations(cls, location_list: List[view_models.Location]):
        with cls._get_db_manager().get_new_session() as session:
            db_location_list = session.query(models.Location).all()
            for db_location in db_location_list:
                updated_location = cls._find_location(location_list=location_list, location_id=db_location.id)
                if updated_location is None:
                    session.delete(db_location)
                else:
                    cls._update_location(db_location=db_location, client_location=updated_location)

    @classmethod
    def search_items(cls, search_text: str):
        with cls._get_db_manager().get_new_session() as session:
            item_list = cls._build_item_query(session).filter(
                models.Item.name.ilike(f'%{search_text}%')
            ).all()

        return [cls._build_item_view_model(db_item) for db_item in item_list]

    @classmethod
    def _find_location(cls, location_list: List[view_models.Location], location_id):
        for location in location_list:
            if location.id == location_id:
                return location

        return None

    @classmethod
    def _update_location(cls, db_location: models.Location, client_location: view_models.Location):
        db_location.name = client_location.name
        db_location.color = client_location.color

    @classmethod
    def _build_locations_map(cls, session: Session) -> Dict[str, models.Location]:
        locations = session.query(models.Location).all()
        return {location.name: location for location in locations}

    @classmethod
    def _build_item_query(cls, session):
        return (
            session.query(models.Item)
            .outerjoin(models.Item.location_refs)
            .outerjoin(models.ItemLocation.location)
            .options(
                contains_eager(models.Item.location_refs, models.ItemLocation.location)
            )
        )

    @classmethod
    def _build_item_view_model(cls, db_item: models.Item):
        return view_models.Item(
            id=db_item.id,
            name=db_item.name,
            is_needed=False,
            locations=[location_ref.location_id for location_ref in db_item.location_refs]
        )
    
    @classmethod
    def _build_location_view_model(cls, db_location: models.Location):
        return view_models.Location(
            id=db_location.id,
            name=db_location.name,
            color=db_location.color
        )
    