module.exports = {
  name: '!balance',
  description: 'Check the amount of points a user has',
  execute(msg, _, db) {
    const pointsQuery = `SELECT points FROM users WHERE id = ${msg.author.id}`;

    db.query(pointsQuery, (err, result) => {
      if (err) throw err;

      if (result.length !== 1) {
        msg.reply('it appears you have not registered, so you do not have a balance.');
      } else {
        const points = result[0].points;
        msg.reply(`you currently have ${points} points.`);
      }
    });
  }
};
