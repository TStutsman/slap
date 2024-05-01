from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError, Length
import re
from app.models import User


def user_exists(form, field):
    # Checking if user exists
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError('Email address is already in use.')


def username_exists(form, field):
    # Checking if username is already in use
    username = field.data
    user = User.query.filter(User.username == username).first()
    if user:
        raise ValidationError('Username is already in use.')
    
# Checks if the provided email follows the format
# "[all chars not '@'] 
# then '@'
# then [all chars not '@']
# then '.' 
# and lastly [all chars not '@' or '.']"
def is_email(form, field):
    if not re.search('^[^@]+@[^@]+\.[^@\.]+$', field.data):
        raise ValidationError('Must provide a real email')

class SignUpForm(FlaskForm):

    username = StringField(validators=[
        DataRequired(), 
        username_exists,
        Length(max=40, message='Username must be 40 characters or less')
    ])

    email = StringField( validators=[
        DataRequired(),
        user_exists, 
        is_email,
        Length(max=255, message='Email must be 255 characters or less')
    ])

    password = StringField(validators=[
        DataRequired(), 
        Length(min=8, message='Password must be at least 8 characters')
    ])

    firstName = StringField(validators=[
        DataRequired(),
        Length(max=255, message='First Name must be 255 characters or less')
    ])

    lastName = StringField(validators=[
        DataRequired(),
        Length(max=255, message='Last Name must be 255 characters or less')
    ])