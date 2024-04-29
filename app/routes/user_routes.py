from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import User

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
