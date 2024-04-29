from app.models import db, Message, environment, SCHEMA
from sqlalchemy.sql import text

def seed_messages():
    messages = {
        Message(
            author_id=2,
            channel_id=1,
            content='hmm which cohorts my fav 🤔',
        ), 
        Message(
            author_id=3,
            channel_id=1,
            content='hold on just a second, I have to take care of my dogs',
        ),
        Message(
            author_id=4,
            channel_id=1,
            content='yeahhhh, I dont like want to give yall strikes, but shanner... hes devious',
        ),
        Message(
            author_id=5,
            channel_id=1,
            content='Otieff is the real villian in this module',
        )
    }

    for message in messages:
        db.session.add(message)

    db.session.commit()


def undo_messages():
    if environment == 'production':
        db.session.execute(f'TRUNCATE table {SCHEMA}.messages RESTART IDENTITY CASCADE;')
    else:
        db.session.execute(text('DELETE FROM messages'))

    db.session.commit()