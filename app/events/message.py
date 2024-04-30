from .channel import socketio
from flask_socketio import emit, join_room, leave_room
from app.models import db, Message, Channel
from flask_login import current_user


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
        print(' === Couldnt find the message === ')

    channel_id = updated_message.channel_id
    updated_message.content = message['content']

    db.session.commit()
    emit('update_broadcast', updated_message.to_dict(), to=channel_id)

@socketio.on('delete_message')
def delete_message(messageId):
    to_delete = Message.query.get(messageId)

    if delete_message == None:
        print(' === Couldnt find the message ===')
        return

    channel_id = to_delete.channel_id

    db.session.delete(to_delete)
    db.session.commit()
    emit('delete_broadcast', messageId, to=channel_id)