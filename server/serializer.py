from caseconverter import camelcase, snakecase
import json
import jsonpickle
from jsonpickle.util import importable_name


def encode(obj):
    pickle_result = json.loads(jsonpickle.encode(obj, unpicklable=False))
    return {camelcase(field_name): value for field_name, value in pickle_result.items()}


def decode(obj_json, cls):
    object_dict = {snakecase(field_name): value for field_name, value in obj_json.items()}
    pickle_str = json.dumps({
        'py/object': importable_name(cls),
        **object_dict
    })
    return jsonpickle.decode(pickle_str)
