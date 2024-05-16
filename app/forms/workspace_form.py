from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed, FileRequired
from wtforms import StringField
from wtforms.validators import DataRequired, Length
from app.aws import ALLOWED_EXTENSIONS

class WorkspaceForm(FlaskForm):
    name = StringField(validators=[
        DataRequired(),
        Length(max=100, message='Workspace name cannot be longer than 100 characters')
    ])
    icon = FileField(validators=[
        FileRequired(),
        FileAllowed(ALLOWED_EXTENSIONS)
    ])