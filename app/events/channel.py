from .socket import socketio
from flask_socketio import emit, join_room, leave_room
from app.models import db, Message, Channel

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

@socketio.on('delete_channel')
def delete_channel(channel_id):
    """
    Removes a Channel based off the channel id passed in the url
    Sends the deleted channel on success
    """
    to_delete = Channel.query.get(channel_id)

    if to_delete == None:
        print(" === Couldn't find selected channel === ")
        return
    
    deleted = to_delete.to_dict()
    
    db.session.delete(to_delete)
    db.session.commit()
    
    emit('channel_deleted', deleted, to=channel_id)