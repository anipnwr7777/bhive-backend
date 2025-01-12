const { Model } = require('objection');

class Investment extends Model {
  static get tableName() {
    return 'investments';
  }
}

module.exports = Investment;
