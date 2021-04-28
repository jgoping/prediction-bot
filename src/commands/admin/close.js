const closePredictions = (msg, _args, _model, state) => {
  state.closePredictions()
  msg.channel.send(`Prediction submissions closed! Please wait for the result.`);
}

module.exports = {
  name: '!close',
  description: 'Close the predictions and wait for result',
  adminRequired: true,
  execute: closePredictions
};
