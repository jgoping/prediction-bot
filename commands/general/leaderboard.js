module.exports = {
  name: '!leaderboard',
  description: 'See the top-scoring users',
  execute(msg, _, db) {
    const leaderboardQuery = `SELECT username, points FROM users ORDER BY points DESC`;

    db.query(leaderboardQuery, (err, result) => {
      if (err) throw err;
      let output = 'Leaderboard:';

      result.forEach(user => {
        output += `\n${user.username}: ${user.points}`;
      });
      msg.channel.send(output);
    });
  }
};
