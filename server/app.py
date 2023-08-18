import time

from dotenv import load_dotenv
from flask import Flask
from flask_socketio import emit, send, SocketIO

load_dotenv()

from service import Storage
from tool_kit.external import Environment
import view_models



app = Flask(__name__)
app.config['DEBUG'] = True

socket_io = SocketIO(app, cors_allowed_origins='*')


@socket_io.on('load_item_list')
def on_load_item_list():
    serializer = view_models.ItemSerializer(many=True)
    item_list = Storage.load_item_list()
    return serializer.dump(item_list)


@socket_io.on('load_item')
def on_load_item(item_id):
    item = Storage.load_item(item_id)
    return item.to_dict()


@socket_io.on('load_locations')
def on_load_locations():
    serializer = view_models.LocationSerializer(many=True)
    location_list = Storage.load_locations()
    return serializer.dump(location_list)


@socket_io.on('upsert_location')
def on_upsert_location(location_json):
    serializer = view_models.LocationSerializer()
    location = serializer.load(location_json)
    location_id = Storage.upsert_location(location)
    return location_id


@socket_io.on('upsert_item')
def on_upsert_item(item_json):
    serializer = view_models.ItemSerializer()
    item = serializer.load(item_json)
    item_id = Storage.upsert_item(item)
    send(item_id)


@socket_io.on('need_item')
def on_need_item(item_id):
    Storage.mark_item_needed(item_id=item_id)
    socket_io.emit('addItem', item_id, include_self=False)


@socket_io.on('do_not_need_item')
def on_dont_need_item(item_id):
    Storage.mark_item_not_needed(item_id=item_id)
    socket_io.emit('removeItem', item_id, include_self=False)

@socket_io.on('search')
def on_search(search_text):
    results = Storage.search_items(search_text)
    serializer = view_models.ItemSerializer(many=True)
    return serializer.dump(results)


if __name__ == '__main__':
    socket_io.run(app, debug=Environment.is_dev())
