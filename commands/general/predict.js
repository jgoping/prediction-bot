const config = require('../../config.json');

module.exports = {
  name: '!predict',
  description: 'Use points to make a prediction',
  execute(msg, args, db, predictions) {
    if (!predictions.open) {
      msg.reply('predictions are closed at the moment.');
      return;
    }

    const validOutcomes = ['yes', 'no'];
    if (args.length < 1) {
      msg.reply('please specify an outcome.');
      return;
    } else if (args.length < 2) {
      msg.reply('please specify how many points you will bet.');
      return;
    }

    const outcome = args[0].toLowerCase();
    const bet = parseInt(args[1]);

    if (!validOutcomes.includes(outcome.toLowerCase())) {
      msg.reply('please specify yes or no as an outcome.');
      return;
    } else if (isNaN(bet)) {
      msg.reply('please provide an integer for how many points you will bet.');
      return;
    } else if (bet <= 0) {
      msg.reply('please enter a positive number.');
      return;
    } else if (bet > config.MAX_BET) {
      msg.reply(`max bet size is ${config.MAX_BET}.`);
      return;
    }

    const pointsQuery = `SELECT points FROM users WHERE id = ${msg.author.id}`;
    db.query(pointsQuery, (err, result) => {
      if (err) throw err;

      if (result.length !== 1) {
        msg.reply('it appears you have not registered, so you cannot make a prediction.');
        return;
      }
      
      const balance = result[0].points;
      if (bet > balance) {
        msg.reply(`you do not have enough points to make this bet. You have ${balance} points.`);
        return;
      }

      const newBalance = balance - bet;

      const updateQuery = `UPDATE users SET points = ${newBalance} WHERE id = ${msg.author.id};`;

      predictions[outcome].push({id: msg.author.id, amount: bet});

      db.query(updateQuery, (err, _) => {
        if (err) throw err;
        msg.reply(`you have successfully spent ${bet} points on ${outcome}. Your new balance is ${newBalance}.`);
      });
    });
  }
};
