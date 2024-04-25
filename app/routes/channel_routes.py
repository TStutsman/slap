from flask import Blueprint
from flask_login import login_required, current_user
from app.models import User

channels = Blueprint('channels', __name__)

@channels.get('/')
@login_required
def get_user_channels():
    """
    Returns all channels the user can join or has joined
    """
    by_id = { channel.id: channel.to_dict() for channel in current_user.channels }
    all_ids = [ channel.id for channel in current_user.channels ]
    return { 
        "byId": by_id, 
        "allIds": all_ids
    }

@channels.post('/')
@login_required
def create_new_channel():
    """
    Creates a new Channel based off the input from the user through ChannelForm
    """
    pass

@channels.put('/<int:id>')
@login_required
def edit_channel(id):
    """
    Applies edits to a Channel based off the input from the user through ChannelForm and the channel id
    passed in the url
    """
    pass

@channels.delete('/<int:id>')
@login_required
def remove_channel(id):
    """
    Removes a Channel based off the channel id passed in the url
    """
    pass