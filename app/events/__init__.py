from .message import socketio
from flask_socketio import emit
from flask_login import current_user

@socketio.on('connect')
def handle_connection():
    print(' === A user connected === ', current_user)

@socketio.on('disconnect')
def handle_disconnection():
    print(' === A user disconnected === ')