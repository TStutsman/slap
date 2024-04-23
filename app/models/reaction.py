from .db import db, environment, SCHEMA, add_prefix_for_prod

class Reaction(db.Model):
    __tablename__ = 'reactions'

    if environment == 'production':
        __table_args__ = { 'schema': SCHEMA }

    id = db.Column(db.Integer, primary_key=True)
    message_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('messages.id'), ondelete='CASCADE'))
    emoji = db.Column(db.String(10), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)

    message = db.relationship('Message', back_populates='reactions')

    users = db.relationship('User', secondary='user_reactions', back_populates='reactions')

    def to_dict(self):
        return {
            'id': self.id,
            'messageId': self.message_id,
            'emoji': self.emoji,
            'quantity': self.quantity
        }