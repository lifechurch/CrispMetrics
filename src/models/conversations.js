const Sequelize = require('sequelize');

class Conversations {
  constructor(CrispClient, sequelize) {
    console.log('Converstaions !!!');
    this.CrispClient = CrispClient;
    this.sequelize = sequelize;
  }

  async sync() {
    this._dataModel = this._getDataModel();
    await this._dataModel.sync({
      force: true
    });

    await this._dataModel.create({
      session_id: 'session1',
      website_id: 'church metrics',
      created_at: 'yesterday',
      updated_at: 'today'
    });
  }

  _getDataModel() {
    return this.sequelize.define('conversation', {
      session_id: {
        type: Sequelize.STRING
      },
      website_id: {
        type: Sequelize.STRING
      },
      created_at: {
        type: Sequelize.STRING
      },
      updated_at: {
        type: Sequelize.STRING
      }
    });
  }
}

module.exports = Conversations;