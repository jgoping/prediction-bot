module.exports = {
  name: '!close',
  description: 'Close the predictions and wait for result',
  execute(msg, _args, _db, predictions) {
    predictions.open = false;
    msg.channel.send(`Prediction submissions closed! Please wait for the result.`);
  }
};
