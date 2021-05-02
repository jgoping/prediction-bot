const Discord = require('discord.js');
const config = require('../config.json');
const Model = require('./models/mysql').model;
const State = require('./state').state;

const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const model = new Model();

const botCommands = require('./commands');
const { messageHandler } = require('./utils');

const state = new State();

Object.keys(botCommands).map(key => {
  bot.commands.set(botCommands[key].name, botCommands[key]);
});

bot.on('message', async (msg) => { 
  messageHandler(bot, msg, model, state, config.MOD_LIST);
});

bot.login(config.BOT_TOKEN);
