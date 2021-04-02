const closePrediction = async (msg, _args, _model, predictions) => {
  predictions.open = false;
  msg.channel.send(`Prediction submissions closed! Please wait for the result.`);
}

module.exports = {
  name: '!close',
  description: 'Close the predictions and wait for result',
  execute: closePrediction
};
