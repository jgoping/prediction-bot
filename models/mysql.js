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
  };

  async getPoints(id) {
    const pointsQuery = `SELECT points FROM users WHERE id = ${id}`;
    const data = await this.query(pointsQuery);

    if (data.length !== 1) {
      throw new Error('Invalid ID');
    }

    return data[0].points;
  };
};

module.exports = {
  model: MySQLModel
}
