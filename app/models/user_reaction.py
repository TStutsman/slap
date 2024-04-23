from .db import db, environment, SCHEMA, add_prefix_for_prod

class UserReaction(db.Model):
    __tablename__ = 'user_reactions'

    if environment == 'production':
        __table_args__ = { 'schema': SCHEMA }

    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id'), ondelete='CASCADE'), primary_key=True)
    reaction_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('reactions.id'), ondelete='CASCADE'), primary_key=True)