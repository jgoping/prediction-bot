const Discord = require('discord.js');
const config = require('./config.json');

const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const botCommands = require('./commands');

console.log(botCommands);
Object.keys(botCommands).map(key => {
  bot.commands.set(botCommands[key].name, botCommands[key]);
});

bot.on('message', async (msg) => { 
  if (msg.author.bot) return;
  
  const args = msg.content.split(/ +/);
  const command = args.shift().toLowerCase();

  if (!bot.commands.has(command)) return;

  try {
    bot.commands.get(command).execute(msg, args);
  } catch {
    console.error(error);
    msg.reply('There was an error trying to execute that command.');
  }
});

bot.login(config.BOT_TOKEN);
