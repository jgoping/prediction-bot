const mysql = require('mysql');
const util = require('util');

class MySQLModel {
  constructor() {
    this.db = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'XXXXXXXX',
      database: 'predictions'
    });

    this.query = util.promisify(this.db.query).bind(this.db);
  }

  async getPoints(id) {
    const query = `SELECT points FROM users WHERE id = ${id}`;
    const data = await this.query(query);

    if (data.length !== 1) {
      throw new Error('Invalid ID');
    }

    return data[0].points;
  }

  async setPoints(id, balance) {
    const query = `UPDATE users SET points = ${balance} WHERE id = ${id};`
    await this.query(query);
  }

  async getLeaderboard() {
    const query = `SELECT username, points FROM users ORDER BY points DESC`;
    const data = await this.query(query);

    return data;
  }

  async setUser(id, username, balance) {
    const query = `INSERT INTO users VALUES (${id}, '${username}', ${balance})`;
    await this.query(query);
  }
};

module.exports = {
  model: MySQLModel
}
