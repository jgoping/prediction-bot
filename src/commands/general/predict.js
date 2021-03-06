const config = require('../../../config.json');

const makePrediction = async (msg, args, model, state) => {
  if (!state.isOpen()) {
    msg.reply('predictions are closed at the moment.');
    return;
  }

  if (args.length < 1) {
    msg.reply('please specify an outcome.');
    return;
  } else if (args.length < 2) {
    msg.reply('please specify how many points you will bet.');
    return;
  }

  const outcome = args[0].toLowerCase();
  const bet = parseInt(args[1]);
  
  if (isNaN(bet)) {
    msg.reply('please provide an integer for how many points you will bet.');
    return;
  } else if (bet <= 0) {
    msg.reply('please enter a positive number.');
    return;
  } else if (bet > config.MAX_BET) {
    msg.reply(`max bet size is ${config.MAX_BET}.`);
    return;
  }

  let balance;
  try {
    balance = await model.getPoints(msg.author.id);
  } catch {
    msg.reply('it appears you have not registered, so you cannot make a prediction.');
    return;
  }

  if (bet > balance) {
    msg.reply(`you do not have enough points to make this bet. You have ${balance} points.`);
    return;
  }

  try {
    state.addPrediction(msg.author.id, outcome, bet);
  } catch (error) {
    msg.reply(error.message);
    return;
  }

  const newBalance = balance - bet;
  
  await model.setPoints(msg.author.id, newBalance);
  msg.reply(`you have successfully spent ${bet} points on ${outcome}. Your new balance is ${newBalance}.`);
}

module.exports = {
  name: '!predict',
  description: 'Use points to make a prediction',
  adminRequired: false,
  execute: makePrediction
};
