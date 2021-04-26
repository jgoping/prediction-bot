# prediction-bot
This is a Discord bot to run predictions, inspired by the Twitch prediction system. When added to a server, mods can begin a prediction with the !question command. Users in the server can predict with their points, and a mod can pay-out when the result is given. Users will double their predicted points if they are correct.

This bot is written in Node.js with the discord.js module.

## Commands

The commands available are split into two groups: those that anyone can perform (participating in the predictions), and those that only the moderators can perform (running the predictions).
### General Commands
| Command      | Arguments                    | Description                                                    |
|--------------|------------------------------|----------------------------------------------------------------|
| !register    |                              | Registers a user                                               |
| !predict     | [yes/no] [amount to predict] | Predict specified amount of points on yes/no                   |
| !balance     |                              | View your balance                                              |
| !leaderboard |                              | View all registered users balances, sorted in decreasing order |

### Moderator Commands
| Command   | Arguments           | Description                                 |
|-----------|---------------------|---------------------------------------------|
| !question | [question sentence] | Ask a question to predict on                |
| !close    |                     | Close the predictions and wait for result   |
| !result   | [yes/no]            | Submit the result of the prediction         |
| !refund   |                     | Refund the points in the current prediction |

## How to set up
To add this to your local discord server, there are a few steps:
1. Create the Discord bot. For instructions to do this, [click here](https://github.com/jgoping/discord-voiceflow-bot#readme) and refer to the "Discord Setup" section. The bot token needs to be set in the `BOT_TOKEN` field of `config.json`.
2. Create a MySQL database. The password needs to be set in the `DB_PASSWORD` field of `config.json`, and the other fields can be set in the constructor of the class in `models/mysql.js`.
3. Set the Discord ID of the moderators in the `MOD_LIST` field of `config.json`. For instructions to find a user's Discord ID, [click here](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-).
4. Clone this repo, run `npm install`, then run the program with `node index.js`.

## Config file options
In `config.json`, there are some properties that must be set as part of the set up process:
| Property        | Default Value | Description                               |
|-----------------|---------------|-------------------------------------------|
| BOT_TOKEN       |               | Token of the Discord bot to connect to    |
| DB_PASSWORD     |               | Password to connect to the MySQL Database |
| INITIAL_BALANCE | 300           | Balance a user gets when they register    |
| MAX_BET         | 250000        | The maximum bet size                      |
| MOD_LIST        |               | List containing Discord IDs of moderators |
