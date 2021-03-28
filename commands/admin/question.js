module.exports = {
  name: '!question',
  description: 'Ask a question to predict on',
  execute(msg, args, _db, predictions) {
    const question = args.join(' ');
    msg.channel.send(`Prediction started! ${question}`);

    predictions.open = true;
    predictions.yes = [];
    predictions.no = [];
  }
};
