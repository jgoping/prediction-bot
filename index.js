const Discord = require('discord.js');
const config = require('./config.json');
const Model = require('./models/mysql').model;

const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const model = new Model();

const botCommands = require('./commands');
const adminCommands = ['!close', '!question', '!refund', '!result'];

const predictions = {open: false, yes: [], no: []};

Object.keys(botCommands).map(key => {
  bot.commands.set(botCommands[key].name, botCommands[key]);
});

bot.on('message', async (msg) => { 
  if (msg.author.bot) return;
  
  const args = msg.content.split(/ +/);
  const command = args.shift().toLowerCase();

  if (!bot.commands.has(command)) return;
  
  if (adminCommands.includes(command) && !config.MOD_LIST.includes(msg.author.id)) {
    msg.reply('you are not authorized to execute this command.');
    return;
  }

  try {
    bot.commands.get(command).execute(msg, args, model, predictions);
  } catch (error) {
    console.error(error);
    msg.reply('There was an error trying to execute that command.');
  }
});

bot.login(config.BOT_TOKEN);
