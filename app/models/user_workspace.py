from .db import db, environment, SCHEMA, add_prefix_for_prod

class UserWorkspace(db.Model):
    __tablename__ = 'user_workspaces'

    if environment == 'production':
        __table_args__ = { 'schema': SCHEMA }

    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id'), ondelete='CASCADE'), primary_key=True)
    workspace_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('workspaces.id'), ondelete='CASCADE'), primary_key=True)