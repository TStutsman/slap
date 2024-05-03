from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Message(db.Model):
    __tablename__ = 'messages'

    if environment == 'production':
        __table_args__ = { 'schema': SCHEMA }

    id = db.Column(db.Integer, primary_key=True)
    author_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id'), ondelete='CASCADE'))
    channel_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('channels.id'), ondelete='CASCADE'))
    content = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    author = db.relationship('User', back_populates='messages')
    channel = db.relationship('Channel', back_populates='messages')

    reactions = db.relationship('Reaction', back_populates='message')

    def to_dict(self):
        return {
            'id': self.id,
            'authorId': self.author_id,
            'channelId': self.channel_id,
            'content': self.content,
            'createdAt': self.created_at.strftime('%B %-d, %Y at %-I:%M'),
            'updatedAt': self.updated_at.strftime('%B %-d, %Y at %-I:%M')
        }