from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import db, Workspace, Channel, UserWorkspace
from app.forms import WorkspaceForm, ChannelForm
from app.aws import unique_filename, s3_upload_file

workspaces = Blueprint('workspaces', __name__)

@workspaces.get('/current')
@login_required
def get_user_workspaces():
    """
    Returns all the workspaces for the current user
    """
    by_id = { workspace.id: workspace.to_dict() for workspace in current_user.workspaces }
    all_ids = [ workspace.id for workspace in current_user.workspaces ]

    return {
        'byId': by_id,
        'allIds': all_ids
    }

@workspaces.get('/<int:id>/channels')
@login_required
def get_workspace_channels(id):
    """
    Returns all the channels in a given workspace
    """
    if id not in [ workspace.id for workspace in current_user.workspaces ]:
        return { 'error': 'Unauthorized' }, 401

    workspace = Workspace.query.get(id)

    by_id = { channel.id: channel.to_dict() for channel in workspace.channels }
    all_ids = [ channel.id for channel in workspace.channels ]
    joined = [ channel.id for channel in workspace.channels if channel in current_user.channels ]

    return {
        'byId': by_id,
        'allIds': all_ids,
        'joined': joined
    }

@workspaces.post('/<int:id>/channels')
@login_required
def create_new_channel(id):
    """
    Creates a new Channel based off the input from the user through ChannelForm
    """
    form = ChannelForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if not form.validate_on_submit():
        return { 'errors': form.errors }, 400

    new_channel = Channel(
        workspace_id = id,
        creator_id = current_user.id,
        name = form.name.data,
        description = form.description.data,
        private = form.private.data
    )

    # adds the channel to 'channels' and to 'user_channels'
    current_user.channels.append(new_channel)

    db.session.commit()

    return new_channel.to_dict(), 201

@workspaces.get('/<int:id>/join')
@login_required
def add_user_to_workspace(id):
    """
    Adds a user to an existing workspace
    """
    workspace = Workspace.query.get(id)

    current_user.workspaces.append(workspace)
    db.session.commit()

    return workspace.to_dict(), 200

@workspaces.get('/<int:id>/leave')
@login_required
def remove_user_from_workspace(id):
    """
    Removes a user from a workspace
    """
    user_workspace = UserWorkspace.query.filter_by(user_id=current_user.id, workspace_id=id)

    if user_workspace == None:
        return { 'errors': "User couldn't be found in that workspace" }, 404

    db.session.delete(user_workspace)
    db.session.commit()

    workspace = Workspace.query.get(id)

    return workspace.to_dict(), 200

@workspaces.post('/')
@login_required
def create_new_workspace():
    """
    Creates a new workspace, and adds the current user to it
    """
    form = WorkspaceForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if not form.validate_on_submit():
        return { 'errors': form.errors }, 400
    
    # workspace passes validation
    icon = form.icon.data
    icon.filename = unique_filename(icon.filename)

    upload = s3_upload_file(icon)

    if 'errors' in upload:
        print(upload['errors'])
        return

    workspace = Workspace(
        creator_id = current_user.id,
        name = form.name.data,
        icon_url = upload['url']
    )

    # adds the workspace to the session and the user's workspaces
    current_user.workspaces.append(workspace)

    # commits the session to the database
    db.session.commit()

    # return successfully created workspace dictionary
    return workspace.to_dict(), 201

@workspaces.put('/<int:id>')
@login_required
def edit_workspace(id):
    """
    Updates a workspaces name
    """
    new_name = request.form['name']

    if len(new_name) < 1 or len(new_name) > 100:
        return { 'errors': { 'name': 'Name must be between 1 and 100 characters'} }, 400
    
    # Query the db for the workspace
    workspace = Workspace.query.get(id)

    if workspace == None:
        return { 'server': 'No workspace found for that id'}, 404

    # Update the name in the session
    workspace.name = new_name

    # Commit the session to the db
    db.session.commit()

    # Return successfully updated workspace
    return workspace.to_dict()

@workspaces.delete('/<int:id>')
@login_required
def delete_workspace(id):
    """
    Permanently deletes a workspace
    """
    workspace = Workspace.query.get(id)

    if workspace == None:
        return { 'server': 'No workspace found for that id'}, 404
    
    if workspace.creator_id != current_user.id:
        return { 'errors': 'Unauthorized' }, 401
    
    db.session.delete(workspace)
    db.session.commit()

    return workspace.to_dict()