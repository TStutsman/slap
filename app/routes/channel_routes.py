from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import db, Channel
from app.forms import ChannelForm

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
    form = ChannelForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if not form.validate_on_submit():
        return form.errors, 400

    new_channel = Channel(
        workspace_id = 1,
        creator_id = current_user.id,
        name = form.name.data,
        description = form.description.data,
        private = form.private.data
    )

    db.session.add(new_channel)
    db.session.commit()
    db.session.refresh(new_channel)

    print(new_channel.to_dict())
    return new_channel.to_dict(), 201

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