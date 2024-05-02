from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import db, User
from app.forms import ProfileForm, ImageForm
from ..aws import unique_filename, s3_remove_file, s3_upload_file

users_routes = Blueprint('users', __name__)


@users_routes.route('/')
@login_required
def get_all_users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    all_users = User.query.all()
    by_id = { user.id: user.to_dict() for user in all_users }
    all_ids = [ user.id for user in all_users ]
    return {
        "byId": by_id,
        "allIds": all_ids
    }


@users_routes.route('/<int:id>')
@login_required
def get_user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()

@users_routes.put('/current')
@login_required
def update_profile():
    """
    Update a users profile status
    """
    form = ProfileForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if not form.validate_on_submit():
        return { 'errors': form.errors }, 400
    
    current_user.status_string = form.statusString.data
    current_user.status_emoji = form.statusEmoji.data

    db.session.commit()

    return current_user.to_dict()

@users_routes.post('/current/profilePhoto')
@login_required
def update_profile_photo():
    """
    Update a users profile photo
    """
    form = ImageForm()
    form.csrf_token.data = request.cookies['csrf_token']

    if not form.validate_on_submit():
        return { 'errors': form.errors }, 400
    
    new_photo = form.image.data
    # Give the image a unique filename
    new_photo.filename = unique_filename(new_photo.filename)
    # Upload to aws, and store in url
    response = s3_upload_file(new_photo)

    # If there was an aws upload error
    # Print to terminal for now, return generic 500 error
    if 'errors' in response:
        print(response)
        return { 'errors': 'Something went wrong. Please try again' }, 500
    
    # save the old photo url for deletion
    old_photo = current_user.profile_photo_url

    # update the profile_photo_url and persist in db
    current_user.profile_photo_url = response['url']
    db.session.commit()
    
    # Check if they already had a profile photo
    if old_photo:
        deleted = s3_remove_file(old_photo)

        # if the file fails to be deleted
        # print to terminal for now
        if not deleted['status']:
            print(deleted['errors'])

    # Return the entire user
    return current_user.to_dict()