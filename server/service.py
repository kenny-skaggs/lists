from datetime import datetime
from typing import Dict, List

from sqlalchemy.orm import contains_eager, Session

import models
from tool_kit.external import Database, Environment
import view_models


class Storage:
    _db_manager = None

    @classmethod
    def _get_db_manager(cls):
        if cls._db_manager is None:
            cls._db_manager = Database(use_ssl_tunnel=Environment.is_dev())
        return cls._db_manager

    @classmethod
    def load_items(cls):
        with cls._get_db_manager().get_new_session() as session:
            db_items = (
                session.query(models.Item)
                .join(models.Item.location_refs)
                .join(models.ItemLocation.location)
                .options(
                    contains_eager(models.Item.location_refs, models.ItemLocation.location)
                )
            ).all()

            needed_items = (
                session.query(models.ItemNeeded.item_id)
                .filter(models.ItemNeeded.cleared_time.is_(None))
            ).all()
            needed_item_ids = {needed_item.item_id for needed_item in needed_items}

        view_items = []
        for item in db_items:
            location_names = [location_ref.location.name for location_ref in item.location_refs]
            view_items.append(view_models.Item(
                id=item.id,
                text=item.name,
                is_needed=item.id in needed_item_ids,
                locations=location_names
            ))
        return view_items

    @classmethod
    def load_locations(cls) -> List[str]:
        with cls._get_db_manager().get_new_session() as session:
            locations = session.query(models.Location).all()
        return [
            {
                'id': location.id,
                'name': location.name,
                'color': location.color
            }
            for location in locations
        ]

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
        if not view_item.locations:
            return False, 'need to have at least 1 location'

        with cls._get_db_manager().get_new_session() as session:
            item = session.query(models.Item).get(view_item.id)
            if item is None:
                item = models.Item()
                session.add(item)
                session.add(models.ItemNeeded(item=item))

            item.name = view_item.text

            item.location_refs = []
            location_name_map = cls._build_locations_map(session=session)
            for location_name in view_item.locations:
                location_obj = location_name_map[location_name]
                item.location_refs.append(models.ItemLocation(location=location_obj))

        return True, None

    @classmethod
    def _build_locations_map(cls, session: Session) -> Dict[str, models.Location]:
        locations = session.query(models.Location).all()
        return {location.name: location for location in locations}
