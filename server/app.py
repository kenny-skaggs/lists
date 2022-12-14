
from dotenv import load_dotenv
from flask import Flask
from flask_socketio import send, SocketIO

from service import Storage
from tool_kit.external import Environment
import view_models


load_dotenv()

app = Flask(__name__)
app.config['DEBUG'] = True

socket_io = SocketIO(app, cors_allowed_origins='*')


@socket_io.on('load_items')
def on_load_items():
    return [item.to_dict() for item in Storage.load_items()]


@socket_io.on('load_locations')
def on_load_locations():
    return Storage.load_locations()


@socket_io.on('save_locations')
def on_save_locations(location_list_json):
    location_list = [
        view_models.Location(
            id=location_json['id'],
            name=location_json['name'],
            color=location_json['color']
        )
        for location_json in location_list_json
    ]
    Storage.update_locations(location_list)


@socket_io.on('upsert_item')
def on_upsert_item(item_json):
    item = view_models.Item.from_dict(item_json)
    success_bool, error_msg = Storage.upsert_item(item)
    send({
        'saved': success_bool,
        'message': error_msg
    })


@socket_io.on('need_item')
def on_need_item(item_id):
    Storage.mark_item_needed(item_id=item_id)


@socket_io.on('do_not_need_item')
def on_dont_need_item(item_id):
    Storage.mark_item_not_needed(item_id=item_id)


if __name__ == '__main__':
    socket_io.run(app, debug=Environment.is_dev())
