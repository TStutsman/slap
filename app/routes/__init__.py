from flask import Blueprint
from .user_routes import user
from .auth_routes import auth
from .channel_routes import channels

api = Blueprint('api', __name__)

api.register_blueprint(user, url_prefix='/users')
api.register_blueprint(auth, url_prefix='/auth')
api.register_blueprint(channels, url_prefix='/channels')

