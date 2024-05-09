from flask import Blueprint
from .user_routes import users_routes
from .auth_routes import auth
from .channel_routes import channels
from .workspace_routes import workspaces

api = Blueprint('api', __name__)

api.register_blueprint(users_routes, url_prefix='/users')
api.register_blueprint(auth, url_prefix='/auth')
api.register_blueprint(channels, url_prefix='/channels')
api.register_blueprint(workspaces, url_prefix='/workspaces')

