const fs = require('fs');
const util = require('util');

const Sequelize = require('sequelize');

class Model {
  constructor(crisp, sequelize) {
    this.crisp = crisp;
    this.sequelize = sequelize;

    this.Sequelize = Sequelize;

    this._dataModel = this._getDataModel();
  }

  async sync() {
    await this._dataModel.sync({
      force: process.env.FLUSH_DB || false
    });
  }

  async getAll(criteria) {
    return await this._dataModel.findAll(criteria);
  }

  _getDataModel() {
    console.log('Implement the datamodel');
  }

  _writeObject(obj, fileName) {
    fs.writeFileSync(fileName, JSON.stringify(obj, null, '\t'), 'utf-8');
  }
}

module.exports = Model;