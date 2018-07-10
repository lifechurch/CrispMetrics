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
    console.log('Super sync');
    await this._dataModel.sync({
      force: true
    });
  }

  async getAll() {
    await this.sync();
    return await this._dataModel.findAll();  
  }

  _getDataModel() {
    console.log('Implement the datamodel');
  }

  _writeObject(obj, fileName) {
    fs.writeFileSync(fileName, JSON.stringify(obj, null, '\t'), 'utf-8');
  }
}

module.exports = Model;