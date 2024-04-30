from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import db, User
from app.forms import ProfileForm

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
    Update a users profile status, theme, phone, or photo
    """
    form = ProfileForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if not form.validate_on_submit():
        return { 'errors': form.errors }, 400
    
    current_user.status_string = form.status_string.data
    current_user.status_emoji = form.status_emoji.data

    db.session.commit()

    return current_user.to_dict()