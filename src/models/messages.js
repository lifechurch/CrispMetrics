const Model = require('./model');

class Messages extends Model {
  constructor(crisp, sequelize, messages) {
    super(crisp, sequelize);
    this.messages = messages;
  }

  async sync(websiteId, sessionId) {
    await super.sync();

    try {
      this._writeObject(messages, `dist/conversations/${websiteId}-${sessionId}-messages.json`);
    } catch(e) {
      console.error('ERROR: Unable to get users:', e);
    }
  }

  // _getDataModel() {
  //   return this.sequelize.define('users', {
  //     user_id: {
  //       type: this.Sequelize.STRING
  //     },
  //     nickname: {
  //       type: this.Sequelize.STRING
  //     }
  //   });
  // }
}

module.exports = Messages;