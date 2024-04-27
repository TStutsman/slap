from .socket import socketio
from flask_socketio import emit, send
from app.models import db, Message
from flask_login import current_user
from flask import session

@socketio.on('connect')
def handle_connection():
    print('Connected!', current_user, session.keys())

@socketio.on('disconnect')
def handle_disconnection():
    print('Disconnected!', current_user, session.keys())

@socketio.on('load_messages')
def send_message_history(channel_id):
    messages = Message.query.filter_by(channel_id=channel_id).all()
    message_history = [ message.to_dict() for message in sorted(messages, key=lambda message: message.updated_at) ]
    emit('load_messages', message_history)

@socketio.on('new_message')
def new_message(message):
    new_message = Message(
        author_id = message['authorId'],
        channel_id = message['channelId'],
        content = message['content']
    )

    db.session.add(new_message)
    db.session.commit()
    print(new_message.to_dict())
    emit('message_broadcast', new_message.to_dict(), broadcast=True)

@socketio.on('edit_message')
def update_message(message):
    updated_message = Message.query.get(message['id'])

    if updated_message == None:
        print('Couldnt find the message')

    updated_message.content = message['content']

    db.session.commit()
    print(updated_message.to_dict())
    emit('update_broadcast', updated_message.to_dict(), broadcast=True)
