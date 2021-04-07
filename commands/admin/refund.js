const refund = async (msg, _args, model, state) => {
  if (!state.isOpen()) {
    msg.reply('predictions are closed at the moment.');
    return;
  }

  msg.channel.send('The prediction is cancelled and the points have been refunded.');
  state.closePredictions();

  const predictions = state.getPredictions();
  
  for (const prediction of predictions) {
    const points = await model.getPoints(prediction.id);
    const newBalance = points + prediction.amount;
    
    await model.setPoints(prediction.id, newBalance);
  };

  state.clearPredictions();
}

module.exports = {
  name: '!refund',
  description: 'Refund the points in the current prediction',
  adminRequired: true,
  execute: refund
};
