from flask_login import current_user
from flask_socketio import SocketIO
from .message import MessageNamespace
from .channel import ChannelNamespace

socketio = SocketIO(logger=True, engineio_logger=True)

socketio.on_namespace(MessageNamespace('/messages'))
socketio.on_namespace(ChannelNamespace('/channels'))

@socketio.on('connect')
def handle_connection():
    print(' === A user connected === ', current_user)

@socketio.on('disconnect')
def handle_disconnection():
    print(' === A user disconnected === ')