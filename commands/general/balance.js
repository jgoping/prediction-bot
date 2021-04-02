const getBalance = async (msg, _args, model, _predictions) => {
  try {
    const points = await model.getPoints(msg.author.id);
    msg.reply(`you currently have ${points} points.`);
  } catch {
    msg.reply('it appears you have not registered, so you do not have a balance.');
  }
}

module.exports = {
  name: '!balance',
  description: 'Check the amount of points a user has',
  execute: getBalance
};
