
from flask import Flask
from flask_socketio import send, SocketIO

from service import Storage


app = Flask(__name__)
app.config['DEBUG'] = True

socket_io = SocketIO(app, cors_allowed_origins='*')


@socket_io.on('load_items')
def on_load_items():
    return Storage.load_items()


@socket_io.on('upsert_item')
def on_upsert_item(item):
    Storage.upsert_item(item)


@app.route('/')
def index():
    return 'bob'


if __name__ == '__main__':
    socket_io.run(app)
