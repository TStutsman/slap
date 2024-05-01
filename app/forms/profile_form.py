from flask_wtf import FlaskForm
# from flask_wtf.file import FileField, FileAllowed
from wtforms import StringField
from wtforms.validators import Length
# from app.aws import ALLOWED_EXTENSIONS

def print_emoji_test(form, field):
    if len(field.data) > 1:
        print(field.data, '==== This emoji is more than one character ====')

class ProfileForm(FlaskForm):
    statusEmoji = StringField(validators=[
        Length(max=1, message='Only one status emoji allowed'),
        print_emoji_test
    ])

    statusString = StringField(validators=[
        Length(max=255, message='Status cannot be longer than 255 characters')
    ])

    # after AWS setup
    # profile_photo = FileField(validators=[
    #     FileAllowed(ALLOWED_EXTENSIONS)
    # ])