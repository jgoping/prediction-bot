module.exports = {
  name: '!result',
  description: 'Submit the result of the prediction',
  execute(msg, args, db, predictions) {
    const validOutcomes = ['yes', 'no'];
    if (args.length < 1) {
      msg.reply('please specify an outcome.');
      return;
    }

    const outcome = args[0].toLowerCase();

    if (!validOutcomes.includes(outcome.toLowerCase())) {
      msg.reply('please specify yes or no as an outcome.');
      return;
    }

    predictions[outcome].forEach(prediction => {
      const pointsQuery = `SELECT username, points FROM users WHERE id = ${prediction.id}`;

      db.query(pointsQuery, (err, result) => {
        if (err) throw err;

        const username = result[0].username;
        const points = result[0].points;
        const newBalance = points + (prediction.amount*2);

        const rewardQuery = `UPDATE users SET points = ${newBalance} WHERE id = ${prediction.id};`
        db.query(rewardQuery, (err, _) => {
          if (err) throw err;
          msg.channel.send(`${username} has won and now has ${newBalance} points!`);
        });
      });
    });
  }
};
