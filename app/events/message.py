from flask_socketio import Namespace, send, emit, join_room, leave_room, close_room
from app.models import db, Message

class MessageNamespace(Namespace):

    # Events for joining and leaving channels =================

    def on_join_channel(self, channel_id):
        print('user joined channel', channel_id)
        join_room(channel_id)
        messages = Message.query.filter_by(channel_id=channel_id).all()
        by_id = { message.id:message.to_dict() for message in messages }
        ordered_ids = [ message.id for message in messages ]
        emit('load_messages', { 'byId': by_id, 'order': ordered_ids })

    def on_leave_channel(self, channel_id):
        leave_room(channel_id)

    def on_close_channel(self, channel_id):
        close_room(channel_id)

    # ---------------------------------------------------------


    # Events for message CRUD =================================

    def on_new_message(self, message):
        new_message = Message(
        author_id = message['authorId'],
        channel_id = message['channelId'],
        content = message['content']
        )

        db.session.add(new_message)
        db.session.commit()
        emit('message_broadcast', new_message.to_dict(), to=message['channelId'])

    def on_edit_message(self, message):
        updated_message = Message.query.get(message['id'])

        if updated_message == None:
            print(' === Couldnt find the message === ')
            return

        channel_id = updated_message.channel_id
        updated_message.content = message['content']

        db.session.commit()
        
        room = str(channel_id)
        emit('updated_broadcast', updated_message.to_dict(), to=room)

    def on_delete_message(self, message_id):
        to_delete = Message.query.get(message_id)

        if to_delete == None:
            print(' === Couldnt find the message ===')
            return

        channel_id = to_delete.channel_id

        db.session.delete(to_delete)
        db.session.commit()

        room = str(channel_id)
        emit('deleted_broadcast', message_id, to=room)