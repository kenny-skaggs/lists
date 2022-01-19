
from flask import Flask
from flask_socketio import SocketIO


app = Flask(__name__)
app.config['DEBUG'] = True

socket_io = SocketIO(app, cors_allowed_origins='*')


@socket_io.on('json')
def handle_json(json):
    print('received json:', json)

@app.route('/')
def index():
    return 'bob'


if __name__ == '__main__':
    socket_io.run(app)
