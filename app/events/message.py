from flask_socketio import Namespace, emit, join_room, leave_room, close_room
from app.models import db, Message, Reaction, User, UserReaction

class MessageNamespace(Namespace):

    # Events for joining and leaving channels =================

    def on_join_channel(self, channel_id):
        print('user joined channel', channel_id)
        join_room(channel_id)
        messages = Message.query.filter_by(channel_id=channel_id).all()
        messages_by_id = { message.id:message.to_dict() for message in messages }
        ordered_ids = [ message.id for message in messages ]

        reactions_by_id = {}
        reactions_all_ids = []
        for message in messages:
            for reaction in message.reactions:
                reactions_by_id[reaction.id] = reaction.to_dict()
                reactions_all_ids.append(reaction.id)

        emit('load_messages', { 'byId': messages_by_id, 'order': ordered_ids })
        emit('load_reactions', { 'byId': reactions_by_id, 'allIds': reactions_all_ids })

    def on_leave_channel(self, channel_id):
        leave_room(channel_id)

    def on_close_channel(self, channel_id):
        close_room(channel_id)

    # ---------------------------------------------------------


    # Events for message CRUD =================================

    def on_new_message(self, message):
        new_message = Message(
        author_id = message['authorId'],
        channel_id = message['channelId'],
        content = message['content']
        )

        db.session.add(new_message)
        db.session.commit()
        
        print(type(message['channelId']), message['channelId'])
        emit('message_broadcast', new_message.to_dict(), to=message['channelId'])

    def on_edit_message(self, message):
        updated_message = Message.query.get(message['id'])

        if updated_message == None:
            print(' === Couldnt find the message === ')
            return

        channel_id = updated_message.channel_id
        updated_message.content = message['content']

        db.session.commit()

        print(type(channel_id), channel_id)
        emit('updated_broadcast', updated_message.to_dict(), to=channel_id)

    def on_delete_message(self, message_id):
        to_delete = Message.query.get(message_id)

        if to_delete == None:
            print(' === Couldnt find the message ===')
            return

        channel_id = to_delete.channel_id

        db.session.delete(to_delete)
        db.session.commit()

        print(type(channel_id), channel_id)
        emit('deleted_broadcast', message_id, to=channel_id)


    # Events for Reaction CRUD

    def on_new_reaction(self, reaction):
        message = Message.query.get(reaction['messageId'])
        reacting_user = User.query.get(reaction['userId'])

        if message == None:
            print(" === Couldn't find message === ")
            return
        
        # Check if this has been reacted before and increment
        current_emojis = { reaction.emoji: reaction for reaction in message.reactions }
        print("REACTION", reaction, "CURRENT EMOJIS", current_emojis)
        if str(reaction['emoji']) in current_emojis:
            reaction_to_increment = current_emojis[str(reaction['emoji'])]
            reaction_to_increment.quantity += 1
            db.session.commit()

            emit('reaction_update', reaction_to_increment.to_dict(), to=message.channel_id)
            return

        # New emoji to react
        new_reaction = Reaction(
            emoji = reaction['emoji'],
            quantity = 1
        )
        new_reaction.users.append(reacting_user)
        message.reactions.append(new_reaction)
        db.session.commit()

        # send to both reactions and message state in front end
        emit('reaction_broadcast', new_reaction.to_dict(), to=message.channel_id)
        emit('updated_broadcast', message.to_dict(), to=message.channel_id)

    def on_reaction_increment(self, reaction):
        reaction_to_increment = Reaction.query.get(reaction['id'])
        reacting_user = User.query.get(reaction['userId'])
        message = Message.query.get(reaction['messageId'])

        if reaction_to_increment == None or reacting_user == None or message == None:
            print(" === Couldn't find reaction, message, or user === ")
            return
        
        # Add reaction to user's reactions and Reaction's users
        reacting_user.reactions.append(reaction_to_increment)

        # Increment the quantity of the reaction
        reaction_to_increment.quantity += 1

        # Commit db session changes
        db.session.commit()

        emit('reaction_update', reaction_to_increment.to_dict(), to=message.channel_id)

    def on_reaction_decrement(self, reaction):
        reaction_to_decrement = Reaction.query.get(reaction['id'])
        reacting_user = User.query.get(reaction['userId'])
        message = Message.query.get(reaction['messageId'])

        if reaction_to_decrement == None or reacting_user == None or message == None:
            print(" === Couldn't find reaction, message, or user === ")
            return
        
        user_reaction = UserReaction.query.filter_by(user_id = reacting_user.id, reaction_id = reaction_to_decrement.id).first()

        # Remove reaction-user relationship
        db.session.delete(user_reaction)

        # If the quantity is already only 1, remove the reaction from the message
        if reaction_to_decrement.quantity < 2:
            db.session.delete(reaction_to_decrement)
            db.session.commit()

            emit('reaction_update', reaction_to_decrement.to_dict(), to=message.channel_id)
            emit('updated_broadcast', message.to_dict(), to=message.channel_id)

        else:
            # Decrement reaction quantity
            reaction_to_decrement.quantity -= 1

            db.session.commit()
            emit('reaction_update', reaction_to_decrement.to_dict(), to=message.channel_id)