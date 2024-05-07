from flask_socketio import Namespace, emit
from app.models import db, Channel

class ChannelNamespace(Namespace):

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