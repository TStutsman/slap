from flask_socketio import Namespace, emit
from app.models import db, Channel, User
from app.forms import ChannelForm

class ChannelNamespace(Namespace):

    def on_channel_update(self, channel_id):
        """
        Gets channel data and broadcasts it to all users
        """
        channel = Channel.query.get(channel_id)

        if channel == None:
            print("Couldn't find the channel")
            return

        emit('channel_broadcast', channel.to_dict(), broadcast=True)

    def on_delete_channel(self, channel_id):
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
        
        emit('channel_deleted', deleted, broadcast=True)