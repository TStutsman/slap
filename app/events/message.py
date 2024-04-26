from .socket import socketio
from flask_socketio import emit
from app.models import db, Message
from flask_login import current_user

@socketio.on('connect')
def handle_connection():
    print('Connected!', current_user)

@socketio.on('new_message')
def new_message(message):
    new_message = Message(
        author_id = current_user.id,
        channel_id = message['channelId'],
        content = message['content']
    )

    db.session.add(new_message)
    db.commit()
    print(message)
    emit('message_broadcast', new_message)
