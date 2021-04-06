const openPredictions = async (msg, args, _model, state) => {
  const question = args.join(' ');
  msg.channel.send(`Predictions opened! ${question}`);

  state.openPredictions();
  state.yes = [];
  state.no = [];
}

module.exports = {
  name: '!question',
  description: 'Ask a question to predict on',
  execute: openPredictions
};
