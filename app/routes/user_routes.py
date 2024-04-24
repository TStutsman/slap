from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import User

user = Blueprint('users', __name__)


@user.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user.route('/<int:id>')
@login_required
def get_user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()