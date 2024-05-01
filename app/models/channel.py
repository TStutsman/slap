from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Channel(db.Model):
    __tablename__ = 'channels'

    if environment == 'production':
        __table_args__ = { 'schema': SCHEMA }
    
    id = db.Column(db.Integer, primary_key=True)
    workspace_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('workspaces.id'), ondelete='CASCADE'))
    creator_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id'), ondelete='CASCADE'))
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.String(255), nullable=False)
    private = db.Column(db.String(20), nullable=False, default=True)
    created_at = db.Column(db.Date, nullable=False, default=datetime.now())

    workspace = db.relationship('Workspace', back_populates='channels')
    messages = db.relationship('Message', back_populates='channel')
    users = db.relationship('User', secondary=add_prefix_for_prod('user_channels'), back_populates='channels')

    def to_dict(self):
        return {
            'id': self.id,
            'workspaceId': self.workspace_id,
            'creatorId': self.creator_id,
            'name': self.name,
            'description': self.description,
            'private': bool(self.private),
            'createdAt': self.created_at.strftime('%B %d, %Y'),
            'numUsers': len(self.users)
        }