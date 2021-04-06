const openPredictions = async (msg, args, _model, state) => {
  if (state.isOpen()) {
    msg.reply('predictions are already open. To start a new question, first give a result or refund to end the current one.');
    return;
  }

  const question = args.join(' ');
  msg.channel.send(`Predictions opened! ${question}`);

  state.openPredictions();
}

module.exports = {
  name: '!question',
  description: 'Ask a question to predict on',
  execute: openPredictions
};
