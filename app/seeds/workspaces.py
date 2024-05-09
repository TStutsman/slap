from app.models import db, Workspace, environment, SCHEMA
from sqlalchemy.sql import text

def seed_workspaces():
    aa = Workspace(
        id = 1,
        name = 'App Academy',
        icon_url = 'https://slap-messaging-image-bucket.s3.us-east-2.amazonaws.com/aa_icon.png'
    )

    db.session.add(aa)
    db.session.commit()

def undo_workspaces():
    if environment == 'production':
        db.session.execute(f'TRUNCATE table {SCHEMA}.workspaces RESTART IDENTITY CASCADE;')
    else:
        db.session.execute(text('DELETE FROM workspaces'))

    db.session.commit()