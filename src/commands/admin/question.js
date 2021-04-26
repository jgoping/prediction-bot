const openPredictions = async (msg, args, _model, state) => {
  if (state.isLive()) {
    msg.reply('there is already a live prediction. To start a new one, first give a result or refund to end the current one.');
    return;
  }

  const question = args.join(' ');
  msg.channel.send(`Predictions opened! ${question}`);

  state.openPredictions();
}

module.exports = {
  name: '!question',
  description: 'Ask a question to predict on',
  adminRequired: true,
  execute: openPredictions
};
