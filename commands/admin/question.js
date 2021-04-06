const startPrediction = async (msg, args, _model, state) => {
  const question = args.join(' ');
  msg.channel.send(`Prediction started! ${question}`);

  state.open = true;
  state.yes = [];
  state.no = [];
}

module.exports = {
  name: '!question',
  description: 'Ask a question to predict on',
  execute: startPrediction
};
