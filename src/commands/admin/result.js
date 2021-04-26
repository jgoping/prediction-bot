const result = async (msg, args, model, state) => {
  if (!state.isLive()) {
    msg.reply('there is no live prediction at the moment.');
    return;
  }
  
  if (args.length < 1) {
    msg.reply('please specify an outcome.');
    return;
  }

  const outcome = args[0].toLowerCase();

  let predictions;
  try {
    predictions = state.getPredictions(outcome);
  } catch (error) {
    msg.reply(error.message);
    return;
  }

  msg.channel.send(`The prediction result is: ${outcome}!`);

  state.closePredictions();

  for (const prediction of predictions) {
    const user = await model.getUser(prediction.id);
    const newBalance = user.points + (prediction.amount*2);

    await model.setPoints(prediction.id, newBalance);
    msg.channel.send(`${user.username} has won and now has ${newBalance} points!`);
  }

  state.clearPredictions();
}

module.exports = {
  name: '!result',
  description: 'Submit the result of the prediction',
  adminRequired: true,
  execute: result
};
