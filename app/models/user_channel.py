from .db import db, environment, SCHEMA, add_prefix_for_prod

class UserChannel(db.Model):
    __tablename__ = 'user_channels'

    if environment == 'production':
        __table_args__ = { 'schema': SCHEMA }

    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id'), ondelete='CASCADE'), primary_key=True)
    channel_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('channels.id'), ondelete='CASCADE'), primary_key=True)
    starred = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            'userId': self.user_id,
            'channelId': self.channel_id,
            'starred': self.starred
        }