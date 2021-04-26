const Discord = require('discord.js');
const config = require('../config.json');
const Model = require('./models/mysql').model;
const State = require('./state').state;

const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const model = new Model();

const botCommands = require('./commands');

const state = new State();

Object.keys(botCommands).map(key => {
  bot.commands.set(botCommands[key].name, botCommands[key]);
});

bot.on('message', async (msg) => { 
  if (msg.author.bot) return;
  
  const args = msg.content.split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!bot.commands.has(commandName)) return;

  const command = bot.commands.get(commandName);
  
  if (command.adminRequired && !config.MOD_LIST.includes(msg.author.id)) {
    msg.reply('you are not authorized to execute this command.');
    return;
  }

  try {
    command.execute(msg, args, model, state);
  } catch (error) {
    console.error(error);
    msg.reply('There was an error trying to execute that command.');
  }
});

bot.login(config.BOT_TOKEN);
