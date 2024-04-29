from app.models import db, Channel, environment, SCHEMA
from sqlalchemy.sql import text

def seed_channels():
    channels = {
       Channel(
            workspace_id = 1,
            creator_id = 2,
            name = 'general',
            description = 'This channel is for team-wide communication and announcements. All team members are in this channel.'
        ),
        Channel(
            workspace_id = 1,
            creator_id = 2,
            name = 'help-requests',
            description = "For technical issues! Ask for help or aid in answering a question! For non-technical issues, students should send a message to: help@appacademy.io"
        ),
        Channel(
            workspace_id = 1,
            creator_id = 2,
            name = 'wins',
            description = ""
        ),
        Channel(
            workspace_id = 1,
            creator_id = 2,
            name = '2023-11-27-lecture-questions',
            description = ""
        ),
        Channel(
            workspace_id = 1,
            creator_id = 2,
            name = '2023-11-27-online',
            description = ""
        ),
    }

    for channel in channels:
        db.session.add(channel)
    db.session.commit()


# Unseed all channels
def undo_channels():
    if environment == 'production':
        db.session.execute(f'TRUNCATE table {SCHEMA}.channels RESTART IDENTITY CASCADE;')
    else:
        db.session.execute(text('DELETE FROM channels'))
    
    db.session.commit()
    