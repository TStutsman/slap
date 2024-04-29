from app.models import db, Workspace, environment, SCHEMA
from sqlalchemy.sql import text

def seed_workspaces():
    aa = Workspace(
        id = 1,
        name = 'App Academy',
        icon_url = 'https://emoji.slack-edge.com/T03GU501J/appacademy/e0819e0d50ec9775.png'
    )

    db.session.add(aa)
    db.session.commit()

def undo_workspaces():
    if environment == 'production':
        db.session.execute(f'TRUNCATE table {SCHEMA}.workspaces RESTART IDENTITY CASCADE;')
    else:
        db.session.execute(text('DELETE FROM workspaces'))

    db.session.commit()