# Slap

## Live Site

- https://slap-xxyr.onrender.com


Slap, a full-stack application inspired by Slack, is a messaging service where teams can communicate in a variety of channels.

## Author
 * Teagan Stutsman
   * https://github.com/TStutsman

## Database Schema Design

![db-schema](https://github.com/TStutsman/slap/blob/readme-images/db_schema.png)

## Get Started

**Prerequisites**
- NPM
- A version of Node.js >= 14 on your local machine
- Python 3.9
- PostgreSQL or SQLite3 in dev environment
- An AWS S3 bucket

**Installation**
- Clone the repo
- Install dependencies ``` pipenv install --dev -r dev-requirements.txt && pipenv install -r requirements.txt```
- `cd react-app` and run `npm install`
- Create a **.env** file based on the example with proper settings for your development environment
- Setup a PostgreSQL database, user, and password and make sure they match your **.env** file.
- Get into your pipenv, migrate your database, seed your database, and run your app

   ```bash
   pipenv shell
   ```

   ```bash
   flask db upgrade
   ```

   ```bash
   flask seed all
   ```

   ```bash
   python run.py

- Create your AWS user and bucket:
    - Create a bucket: (https://s3.console.aws.amazon.com/s3/home?region=us-east-1)
    - Navigate to ( https://console.aws.amazon.com/iam/home?#/users) to create a user with `Programmatic access`.
    - Set up a security policy for your user: 'Attach existing policies directly' => 'Create Policy'
    - Click the `JSON` tab and set a policy.
- Now update your **.env** with your `S3_BUCKET`, `S3_KEY`, `S3_SECRET`
- Fire up your servers: `python run.py` in root and `npm run dev` in `react-app`

## Features
1. **Authentication**
   - New account creation, log in, and log out functionalities.
   - Guest/demo login option for trying out the site.
   - Users must be logged in to access channels and messages.
2. **Channels**
   - Users can create new channels.
   - Users can view existing channels.
   - Creators can update or delete their own channels.
3. **Messages**
   - Users can write a new message.
   - Users can view the messages in each channel they occupy.
   - Users can update or delete messages they have written.
3. **Reactions**
   - Users can choose emojis to react to a message.
   - Users can view the reactions to all the messages in each channel they are in.
   - Users can increment existing emoji, and remove their reactions.
3. **Workspaces**
   - Users can create new workspaces.
   - Users can view the channels in workspaces they are in.
   - Users can update or delete workspaces they have created.

## Authentication
Slap provides a user-friendly authentication system allowing users to sign up for new accounts, log in, log out, and use a guest/demo login option for exploring the application without creating an account.

## Channels
Logged-in users can browse through channels that other users, and themselves have created. Logged-in users can create new product channels, edit their channels' names or descriptions, and delete their own, or leave channels they don't need. Logged-in users can view public channels to find new channels they want to join.

## Messages
The messaging feature allows logged-in users to communicate within channels to other users who have joined that channel. Logged-in users can also edit messages they've written, view other users' messages, and delete their own messages if necessary.

## Reactions
Logged-in users can let other users know how they feel about messages using reactions. Logged-in users can also remove reactions they reacted, view other users' reactions, and increment reactions other users have already reacted.

## Workspaces
Logged-in users can create workspaces for groups and topics, so that all the channels created in that workspace are related. Logged-in users can also edit workspaces they created, and delete their created workspaces they no longer need.

# Stack
 * React: https://react.dev/
 * Redux: https://redux.js.org/
 * Flask: https://flask.palletsprojects.com/en/2.3.x/
 * Flask SocketIO: https://flask-socketio.readthedocs.io/en/latest/
 * SocketIO: https://socket.io/
 * WTForms: https://wtforms.readthedocs.io/en/3.0.x/
 * SQAlchemy: https://www.sqlalchemy.org/
 * PostgreSQL: https://postgresql.org/
