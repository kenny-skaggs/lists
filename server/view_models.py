from dataclasses import dataclass
from typing import List


@dataclass
class Item:
    id: int
    text: str
    is_needed: bool
    locations: List[str]
    notes: str = ''


@dataclass
class Location:
    id: int
    name: str
    color: str
