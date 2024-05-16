from app.models import db, UserWorkspace, environment, SCHEMA
from sqlalchemy.sql import text

def seed_user_workspaces():
    for user_id in range(1,6):
        user_workspace = UserWorkspace(user_id=user_id, workspace_id=1)
        db.session.add(user_workspace)
    
    db.session.commit()


def undo_user_workspaces():
    if environment == 'production':
        db.session.execute(f'TRUNCATE table {SCHEMA}.user_workspaces RESTART IDENTITY CASCADE;')
    else:
        db.session.execute(text('DELETE FROM user_workspaces'))

    db.session.commit()