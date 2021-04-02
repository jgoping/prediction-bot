const result = async (msg, args, model, predictions) => {
  const validOutcomes = ['yes', 'no'];
  if (args.length < 1) {
    msg.reply('please specify an outcome.');
    return;
  }

  const outcome = args[0].toLowerCase();

  if (!validOutcomes.includes(outcome.toLowerCase())) {
    msg.reply('please specify yes or no as an outcome.');
    return;
  }

  msg.channel.send(`The prediction result is: ${outcome}!`);

  for (const prediction of predictions[outcome]) {
    const user = await model.getUser(prediction.id);
    const newBalance = user.points + (prediction.amount*2);

    await model.setPoints(prediction.id, newBalance);
    msg.channel.send(`${user.username} has won and now has ${newBalance} points!`);
  }
}

module.exports = {
  name: '!result',
  description: 'Submit the result of the prediction',
  execute: result
};
