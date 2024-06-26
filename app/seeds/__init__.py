from flask.cli import AppGroup
from .users import seed_users, undo_users
from .workspaces import seed_workspaces, undo_workspaces
from .channels import seed_channels, undo_channels
from .messages import seed_messages, undo_messages
from .user_channels import seed_user_channels, undo_user_channels
from .user_workspaces import seed_user_workspaces, undo_user_workspaces

from app.models.db import environment

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo 
        # command, which will  truncate all tables prefixed with 
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_messages()
        undo_user_channels()
        undo_channels()
        undo_user_workspaces()
        undo_workspaces()
        undo_users()
    seed_users()
    seed_workspaces()
    seed_user_workspaces()
    seed_channels()
    seed_user_channels()
    seed_messages()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_messages()
    undo_user_channels()
    undo_channels()
    undo_user_workspaces()
    undo_workspaces()
    undo_users()
    # Add other undo functions here
