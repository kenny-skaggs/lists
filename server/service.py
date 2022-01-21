
items = [
    {'id': 1, 'text': 'one', 'isNeeded': False, 'locations': ['costco'], 'notes': '', },
    {'id': 2, 'text': 'two', 'isNeeded': True, 'locations': ['costco'], 'notes': '', },
    {'id': 3, 'text': 'three', 'isNeeded': False, 'locations': ['costco'], 'notes': '', },
    {'id': 4, 'text': 'four', 'isNeeded': False, 'locations': ['costco'], 'notes': '', },
    {'id': 5, 'text': 'five', 'isNeeded': False, 'locations': ['costco'], 'notes': '', },
]


class Storage:
    @classmethod
    def load_items(cls):
        return items

    @classmethod
    def upsert_item(cls, item):
        try:
            updated_item = next(match for match in items if match['id'] == item['id'])
            updated_item.update(item)
        except StopIteration:
            items.append(item)
