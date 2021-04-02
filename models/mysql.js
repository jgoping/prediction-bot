const config = require('../config.json');

const mysql = require('mysql');
const util = require('util');

class MySQLModel {
  constructor() {
    this.db = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: config.DB_PASSWORD,
      database: 'predictions'
    });

    this.db.connect((err) => {
      if (err) throw err;
      console.log('Connected to MySQL');
    });

    this.query = util.promisify(this.db.query).bind(this.db);
  }

  async isRegistered(id) {
    const query = `SELECT id FROM users WHERE id = ${id}`;
    const data = await this.query(query);

    return data.length > 0;
  }

  async getUser(id) {
    const query = `SELECT username, points FROM users WHERE id = ${id}`;
    const data = await this.query(query);

    if (data.length !== 1) {
      throw new Error('Invalid ID');
    }

    return data[0];
  }

  async setUser(id, username, balance) {
    const query = `INSERT INTO users VALUES (${id}, '${username}', ${balance})`;
    await this.query(query);
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
};

module.exports = {
  model: MySQLModel
}
