
from flask import Flask
from flask_socketio import send, SocketIO

from service import Storage
import view_models


app = Flask(__name__)
app.config['DEBUG'] = True

socket_io = SocketIO(app, cors_allowed_origins='*')


@socket_io.on('load_items')
def on_load_items():
    return [item.to_dict() for item in Storage.load_items()]


@socket_io.on('load_locations')
def on_load_items():
    return Storage.load_locations()


@socket_io.on('upsert_item')
def on_upsert_item(item_json):
    item = view_models.Item.from_dict(item_json)
    Storage.upsert_item(item)


@socket_io.on('need_item')
def on_need_item(item_id):
    Storage.mark_item_needed(item_id=item_id)


@socket_io.on('do_not_need_item')
def on_dont_need_item(item_id):
    Storage.mark_item_not_needed(item_id=item_id)


if __name__ == '__main__':
    socket_io.run(app)
