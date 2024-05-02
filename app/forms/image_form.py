from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed
from ..aws import ALLOWED_EXTENSIONS

class ImageForm(FlaskForm):
    image = FileField(validators=[FileAllowed(ALLOWED_EXTENSIONS)])