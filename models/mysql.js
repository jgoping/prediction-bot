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
};

module.exports = {
  model: MySQLModel
}
