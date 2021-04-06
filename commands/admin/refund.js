const refund = async (msg, _args, model, state) => {
  if (!state.isOpen()) {
    msg.reply('predictions are closed at the moment.');
    return;
  }
  
  const validOutcomes = ['yes', 'no'];

  msg.channel.send('The prediction is cancelled and the points have been refunded.');
  state.closePredictions();
  
  for (const outcome of validOutcomes) {
    for (const prediction of state[outcome]) {
      const points = await model.getPoints(prediction.id);
      const newBalance = points + prediction.amount;
      
      await model.setPoints(prediction.id, newBalance);
    };
  };

  state.clearPredictions();
}

module.exports = {
  name: '!refund',
  description: 'Refund the points in the current prediction',
  execute: refund
};
