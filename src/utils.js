const messageHandler = async (bot, msg, model, state, modList) => {
  if (msg.author.bot) return;
  
  const args = msg.content.split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!bot.commands.has(commandName)) return;

  const command = bot.commands.get(commandName);
  if (command.adminRequired && !modList.includes(msg.author.id)) {
    msg.reply('you are not authorized to execute this command.');
    return;
  }

  try {
    await command.execute(msg, args, model, state);
  } catch (error) {
    console.error(error);
    msg.reply('There was an error trying to execute that command.');
  }
};

module.exports = {
  messageHandler
};
