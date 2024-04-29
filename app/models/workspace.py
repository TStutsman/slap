from .db import db, environment, SCHEMA

class Workspace(db.Model):
    __tablename__ = 'workspaces'

    if environment == 'production':
        __table_args__ = { 'schema': SCHEMA }

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    icon_url = db.Column(db.String(255), nullable=False)

    channels = db.relationship('Channel', back_populates='workspace')
    # users = db.relationship('User', secondary=add_prefix_for_prod('user_workspaces'), back_populates='workspaces')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'icon_url': self.icon_url
        }