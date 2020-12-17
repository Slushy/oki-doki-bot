# Oki-Doki-Bot
Discord bot to send insults because why not.

# Features
- When you type `@<bot> plz` it will respond with an insult
- Starts a cron job to message a group of users (according to **USER_IDS** set in environment) an insult according to job schedule

# Development
Just add `.env` file with **TOKEN**=\<bot-token>, **CHANNEL**=\<channel-id>, **USER_IDS**=\<ids,separated,by,comma>

**CHANNEL** and **USER_IDS** are only used for the cron job.

For development you should create your own private bot via https://discord.com/developers/applications and set **TOKEN**=\<your bot token>. The only permissions your private bot needs is "Send Messages". To be able to find a user's id or a channel id (for setting **USER_IDS** or **CHANNEL**) you'll need to enable developer mode in discord: App Settings => Appearance => Developer Mode. Then you'll be able to right click on any user or channel and copy the id.

## Deployment
It will automatically deploy when you push to master

