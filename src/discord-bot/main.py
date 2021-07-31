import os
import discord
import requests
import json
import redis
    
audit_log_webhook = os.getenv('AUDIT_LOG_WEBHOOK')
def audit_log(message):
    print(message)
    response = requests.post(audit_log_webhook, json={"content":message})

superadmins = [263514891766202369]
blacklist = [871031295252263034]

test_commands = ['/log', '/reaction', '/mail', '/delete', '/mail']
superadmin_commands = test_commands + ['/delete', '/mail']

client = discord.Client()

# @client.event
# async def on_socket_raw_receive(message):
#     print('on socket raw receive')
#     print(message)

@client.event
async def on_ready():
    print('We have logged in as {0.user}'.format(client))

@client.event
async def on_raw_reaction_add(payload):
    print('on raw reaction add')
    print(payload)

@client.event
async def on_raw_reaction_remove(payload):
    print('on raw reaction remove')
    print(payload)

@client.event
async def on_message(message):
    # print(f'message.channel:{message.channel}')
    # print(f'message.channel.name:{message.channel.name}')
    # print(f'message.channel.id:{message.channel.id}')
    # print(f'client.user:{client.user}')
    # print(f'client.user.id:{client.user.id}')
    # print(f'message.author:{message.author}')
    # print(f'message.author.id:{message.author.id}')
    # print(f'message.reference:{message.reference}')
    if message.author.id == client.user.id:
        return

    if message.author.id in blacklist:
        return

    if message.content[0] != '/':
        return

    if message.content.startswith('/hello'):
        await message.channel.send('Hello!')
        return

    if message.content in test_commands and message.channel.name != 'test':
        await message.reply('you must be in a channel named "test" for test commands')
        return

    if message.content in superadmin_commands and message.author.id not in superadmins:
        await message.reply('you must be a superadmin')
        return

    audit_log(f'superadmin running command {message.content}')

    if message.content.startswith('/log'):
        messages = await message.channel.history().flatten()
        for msg in messages:
            print(f'{msg.author} said: {msg.content} with reactions {msg.reactions}')
            for reaction in msg.reactions:
                print(client.get_emoji(reaction))

    if message.content.startswith('/react'):
        messages = await message.channel.history().flatten()
        for msg in messages:
            emoji = '\N{Hundred Points Symbol}'
            await msg.add_reaction(emoji)

    if message.content.startswith('/delete'):
        audit_log(f'started deleting messages in {message.channel.name}')
        messages = await message.channel.history().flatten()
        for msg in messages:
            await msg.delete()
        audit_log(f'finished deleting messages in {message.channel.name}')

    if message.content.startswith('/mail'):
        await message.reply('fetching your mail')

@client.event
async def on_message_edit(before, after):
    fmt = f'**{before.author}** edited their message:\n{before.content} -> {after.content}'
    audit_log(fmt)

@client.event
async def on_message_delete(message):
    fmt = f'{message.author} has deleted the message: {message.content}'
    audit_log(fmt)

token = os.getenv('TOKEN')
if token:
    permissions = 259309698240
    client_id = os.getenv('CLIENT_ID')
    bot_invite = f'https://discordapp.com/oauth2/authorize?&client_id={client_id}&scope=bot&permissions={permissions}'
    print(bot_invite)
    client.run(os.getenv('TOKEN'))
else:
    print('token not found')
