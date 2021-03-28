const Discord = require('discord.js');
const config = require('./config.json');
const mysql = require('mysql');


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'XXXXXXXX',
  database: 'predictions'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const botCommands = require('./commands');
const adminCommands = ['!close', '!question', '!refund', '!result'];
const modList = ['XXXXXXXX', 'XXXXXXXX']; // Input Discord user IDs

const predictions = {open: false, yes: [], no: []};

Object.keys(botCommands).map(key => {
  bot.commands.set(botCommands[key].name, botCommands[key]);
});

bot.on('message', async (msg) => { 
  if (msg.author.bot) return;
  
  const args = msg.content.split(/ +/);
  const command = args.shift().toLowerCase();

  if (!bot.commands.has(command)) return;

  if (adminCommands.includes(command) && !modList.includes(msg.author.id)) {
    msg.reply('you are not authorized to execute this command.');
    return;
  }

  try {
    bot.commands.get(command).execute(msg, args, db, predictions);
  } catch (error) {
    console.error(error);
    msg.reply('There was an error trying to execute that command.');
  }
});

bot.login(config.BOT_TOKEN);
