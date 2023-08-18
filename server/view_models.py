from dataclasses import dataclass
from typing import List

from marshmallow import Schema, fields, post_load


@dataclass
class Item:
    name: str
    is_needed: bool = None
    locations: List[str] = None
    id: int = None
    notes: str = ''


class ItemSerializer(Schema):
    id = fields.Int()
    name = fields.Str()
    is_needed = fields.Bool(data_key='isNeeded')
    locations = fields.List(fields.Int())

    @post_load
    def make_item(self, data, **_):
        return Item(**data)


@dataclass
class Location:
    name: str
    color: str
    id: int = None


class LocationSerializer(Schema):
    id = fields.Int()
    name = fields.Str()
    color = fields.Str()

    @post_load
    def make_item(self, data, **_):
        return Location(**data)
