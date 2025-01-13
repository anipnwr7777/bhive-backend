const { Model } = require('objection');

class Credential extends Model {
  static get tableName() {
    return 'credentials';
  }
}

module.exports = Credential;