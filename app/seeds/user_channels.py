from app.models import db, UserChannel, environment, SCHEMA
from sqlalchemy.sql import text

def seed_user_channels():
    for user_id in range(1,6):
        for channel_id in range(1,6):
            user_channel = UserChannel(user_id=user_id, channel_id=channel_id)
            db.session.add(user_channel)
    
    db.session.commit()


def undo_user_channels():
    if environment == 'production':
        db.session.execute(f'TRUNCATE table {SCHEMA}.user_channels RESTART IDENTITY CASCADE;')
    else:
        db.session.execute(text('DELETE FROM user_channels'))

    db.session.commit()