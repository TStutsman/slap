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

@channels.get('/<int:id>/messages')
@login_required
def get_channel_messages(id):
    """
    Returns all messages for a channel if the user can view the channel
    """
    channel = Channel.query.filter_by(id = id).first()

    # Check if the user has access to the channel
    if channel not in current_user.channels:
        return {'errors' : {'message': 'Unauthorized'}}, 401

    # return dict and list for normalized redux state shape
    by_id = { message.id: message.to_dict() for message in channel.messages }
    all_ids = [ message.id for message in channel.messages ]
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

    # adds the channel to 'channels' and to 'user_channels'
    current_user.channels.append(new_channel)

    db.session.commit()

    return new_channel.to_dict(), 201

@channels.put('/<int:id>')
@login_required
def edit_channel(id):
    """
    Applies edits to a Channel based off the input from the user through ChannelForm and the channel id
    passed in the url
    """
    to_update = Channel.query.get(id)

    if to_update == None:
        return {'message': "Couldn't find selected channel"}, 404
    
    form = ChannelForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if not form.validate_on_submit():
        return form.errors, 400
    
    to_update.name = form.name.data
    to_update.description = form.description.data
    to_update.private = form.private.data

    db.session.commit()
    return to_update.to_dict()

@channels.delete('/<int:id>')
@login_required
def remove_channel(id):
    """
    Removes a Channel based off the channel id passed in the url
    Sends the deleted channel on success
    """
    to_delete = Channel.query.get(id)
    deleted = to_delete.to_dict()

    if to_delete == None:
        return {'message': "Couldn't find selected channel"}, 404
    
    db.session.delete(to_delete)
    db.session.commit()

    return deleted