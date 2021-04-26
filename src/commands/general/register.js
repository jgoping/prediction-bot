const config = require('../../../config.json');

const register = async (msg, _args, model, _state) => {
  const userExists = await model.isRegistered(msg.author.id)

  if (userExists) {
    msg.reply('it appears you have already registered!');
  } else {
    await model.setUser(msg.author.id, msg.author.username, config.INITIAL_BALANCE);
    msg.reply(`thanks for registering! You will start with ${config.INITIAL_BALANCE} points!`);
  }
}

module.exports = {
  name: '!register',
  description: 'Registers a user',
  adminRequired: false,
  execute: register
};
