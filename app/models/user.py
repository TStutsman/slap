from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(255))
    last_name = db.Column(db.String(255))
    status_emoji = db.Column(db.String(10))
    status_string = db.Column(db.String(255))
    theme = db.Column(db.String(20))
    phone = db.Column(db.String(20))
    profile_photo_url = db.Column(db.String(255))

    workspaces = db.relationship('Workspace', secondary=add_prefix_for_prod('user_workspaces'), back_populates='users')
    channels = db.relationship('Channel', secondary=add_prefix_for_prod('user_channels'), back_populates='users')
    messages = db.relationship('Message', back_populates='author')
    reactions = db.relationship('Reaction', secondary=add_prefix_for_prod('user_reactions'), back_populates='users')

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'firstName': self.first_name,
            'lastName': self.last_name,
            'statusEmoji': self.status_emoji,
            'statusString': self.status_string,
            'theme': self.theme,
            'phone': self.phone,
            'profilePhotoUrl': self.profile_photo_url
        }
