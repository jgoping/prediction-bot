module.exports = {
  name: '!register',
  description: 'Registers a user',
  execute(msg, _, db) {
    const existsQuery = `SELECT id FROM users WHERE id = ${msg.author.id}`;

    db.query(existsQuery, (err, result) => {
      if (err) throw err;
      const userExists = result.length > 0;

      if (userExists) {
        msg.reply('it appears you have already registered!');
      } else {
        const insertQuery = `INSERT INTO users VALUES (${msg.author.id}, '${msg.author.username}', 300)`;
        db.query(insertQuery, (err) => {
          if (err) throw err;
        });
        msg.reply('thanks for registering! You will start with 300 points!');
      }
    });
  }
};
