from flask_wtf import FlaskForm
from wtforms import StringField, BooleanField
from wtforms.validators import DataRequired, Length

class ChannelForm(FlaskForm):
    name = StringField(validators=[DataRequired(), Length(min=1, max=100, message='Channel must be between 1 and 100 characters')])
    description = StringField(validators=[DataRequired(), Length(min=1, max=255, message='Channel description must be between 1 and 255 characters')])
    private = BooleanField()