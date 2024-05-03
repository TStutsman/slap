from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text

users = [
    User(
        username='Demo', 
        email='demo@aa.io', 
        password='password',
        first_name='Demo',
        last_name ='User',
        status_emoji='✅',
        status_string='Active',
        theme='dark'
    ),
    User(
        username='lbraurson', 
        email='lbraurson@aa.io', 
        password='module1',
        first_name='Landon',
        last_name="Braurson",
        status_emoji='🎡',
        status_string='Active',
        theme='dark',
        profile_photo_url='https://slap-messaging-image-bucket.s3.us-east-2.amazonaws.com/spiderman.jpeg'
    ),
    User(
        username='wshilkey',
        email='wshilkey@aa.io',
        password='module2',
        first_name='Wane',
        last_name="Shilkey",
        status_emoji='🐶',
        status_string='Hip-Hop Adjacent',
        theme='dark',
        profile_photo_url='https://slap-messaging-image-bucket.s3.us-east-2.amazonaws.com/hiphop90.png'
    ),
    User(
        username='ogeono',
        email='ogeono@aa.io',
        password='module3',
        first_name='Otieffrey',
        last_name="Geono",
        status_emoji='🖋️',
        status_string='Drawing an API',
        theme='dark',
        profile_photo_url='https://slap-messaging-image-bucket.s3.us-east-2.amazonaws.com/gamerdog.jpeg'
    ),
    User(
        username='staw',
        email='staw@aa.io',
        password='module3',
        first_name='Shanner',
        last_name="Taw",
        status_emoji='🤓',
        status_string='At my other job',
        theme='dark',
        profile_photo_url='https://slap-messaging-image-bucket.s3.us-east-2.amazonaws.com/hacker.png'
    )
]

# Adds a demo user, you can add other users here if you want
def seed_users():

    for user in users:
        db.session.add(user)
        
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))
        
    db.session.commit()
