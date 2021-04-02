const refund = async (msg, _args, model, predictions) => {
  const validOutcomes = ['yes', 'no'];

  msg.channel.send('The prediction is cancelled and the points have been refunded.');
  predictions.open = false;
  
  for (const outcome of validOutcomes) {
    for (const prediction of predictions[outcome]) {
      const points = await model.getPoints(prediction.id);
      const newBalance = points + prediction.amount;
      
      await model.setPoints(prediction.id, newBalance);
    };
  };
}

module.exports = {
  name: '!refund',
  description: 'Refund the points in the current prediction',
  execute: refund
};
