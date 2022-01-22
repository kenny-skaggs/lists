from datetime import datetime

import sqlalchemy as sa
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

BaseModel = declarative_base()


class Item(BaseModel):
    __tablename__ = 'items'
    id = sa.Column(sa.Integer, primary_key=True)
    name = sa.Column(sa.String(300), nullable=False)
    location_refs = relationship('ItemLocation', back_populates='item', cascade='all, delete-orphan')


class Location(BaseModel):
    __tablename__ = 'location'
    id = sa.Column(sa.Integer, primary_key=True)
    name = sa.Column(sa.String(200), nullable=False)


class ItemLocation(BaseModel):
    __tablename__ = 'item_location'
    id = sa.Column(sa.Integer, primary_key=True)
    location_id = sa.Column(sa.Integer, sa.ForeignKey(Location.id), nullable=False)
    item_id = sa.Column(sa.Integer, sa.ForeignKey(Item.id), nullable=False)

    location = relationship(Location, backref='item_refs')
    item = relationship(Item, back_populates='location_refs')


class ItemNeeded(BaseModel):
    __tablename__ = 'item_needed'
    id = sa.Column(sa.Integer, primary_key=True)
    item_id = sa.Column(sa.Integer, sa.ForeignKey(Item.id), nullable=False)
    needed_time = sa.Column(sa.DateTime, nullable=False, default=datetime.utcnow())
    cleared_time = sa.Column(sa.DateTime)

    item = relationship(Item, backref='needed_refs')

