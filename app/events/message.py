from .socket import socketio
from flask_socketio import emit, join_room, leave_room
from app.models import db, Message
from flask_login import current_user
from flask import session

@socketio.on('connect')
def handle_connection():
    print('A user connected')

@socketio.on('disconnect')
def handle_disconnection():
    print('A user disconnected')

@socketio.on('join_channel')
def user_join_channel(channel_id):
    join_room(channel_id)
    messages = Message.query.filter_by(channel_id=channel_id).all()
    by_id = { message.id:message.to_dict() for message in messages }
    ordered_ids = [ message.id for message in messages ]
    emit('load_messages', { 'byId': by_id, 'order': ordered_ids })

@socketio.on('leave_channel')
def user_leave_channel(channel_id):
    leave_room(channel_id)

# @socketio.on('load_messages')
# def send_message_history(channel_id):
#     messages = Message.query.filter_by(channel_id=channel_id).all()
#     by_id = { message.id:message.to_dict() for message in messages }
#     ordered_ids = [ message.id for message in messages ]
#     emit('load_messages', { 'byId': by_id, 'order': ordered_ids })

@socketio.on('new_message')
def new_message(message):
    new_message = Message(
        author_id = message['authorId'],
        channel_id = message['channelId'],
        content = message['content']
    )

    db.session.add(new_message)
    db.session.commit()
    emit('message_broadcast', new_message.to_dict(), to=message['channelId'])

@socketio.on('edit_message')
def update_message(message):
    updated_message = Message.query.get(message['id'])

    if updated_message == None:
        print('Couldnt find the message')

    channel_id = updated_message.channel_id
    updated_message.content = message['content']

    db.session.commit()
    emit('update_broadcast', updated_message.to_dict(), to=channel_id)

@socketio.on('delete_message')
def delete_message(messageId):
    to_delete = Message.query.get(messageId)

    if delete_message == None:
        print('Couldnt find the message')

    channel_id = to_delete.channel_id

    db.session.delete(to_delete)
    db.session.commit()
    emit('delete_broadcast', messageId, to=channel_id)
