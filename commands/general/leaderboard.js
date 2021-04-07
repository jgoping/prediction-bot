const getLeaderboard = async (msg, _args, model, _state) => {
  let output = 'Leaderboard:';

  const leaderboard = await model.getLeaderboard();
  leaderboard.forEach(user => {
    output += `\n${user.username}: ${user.points}`;
  });

  msg.channel.send(output);
}

module.exports = {
  name: '!leaderboard',
  description: 'See the top-scoring users',
  adminRequired: false,
  execute: getLeaderboard,
};
