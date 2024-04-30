from flask_wtf import FlaskForm
# from flask_wtf.file import FileField, FileAllowed
from wtforms import StringField
from wtforms.validators import Length
# from app.aws import ALLOWED_EXTENSIONS

class ProfileForm(FlaskForm):
    status_emoji = StringField(validators=[
        Length(max=10, message='Only one status emoji allowed')
    ])

    status_string = StringField(validators=[
        Length(max=255, message='Status cannot be longer than 255 characters')
    ])

    # after AWS setup
    # profile_photo = FileField(validators=[
    #     FileAllowed(ALLOWED_EXTENSIONS)
    # ])