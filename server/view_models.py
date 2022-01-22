from dataclasses import dataclass, field
from typing import List


@dataclass
class Item:
    id: int
    text: str
    is_needed: bool
    locations: List[str]
    notes: str = ''

    def to_dict(self):
        return {
            'id': self.id,
            'text': self.text,
            'isNeeded': self.is_needed,
            'locations': self.locations
        }

    @classmethod
    def from_dict(cls, item_dict):
        return Item(
            id=item_dict['id'],
            text=item_dict['text'],
            is_needed=item_dict['isNeeded'],
            locations=item_dict['locations']
        )
