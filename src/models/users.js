const Model = require('./model');

class Users extends Model {
  constructor(crisp, sequelize, users) {
    super(crisp, sequelize);
    this.users = users;
  }

  async sync() {
    await super.sync();

    try {
      for(let key of Object.keys(this.users)) {
        let user = this.users[key];

        this._writeObject(user, `dist/${user.user_id}-users.json`);

        await this._dataModel.create({
          user_id: user.user_id,
          nickname: user.nickname,
        });
        console.log(`User ${user.nickname} has id ${user.user_id}`);

      }
    } catch(e) {
      console.error('ERROR: Unable to get users:', e);
    }
  }

  _getDataModel() {
    return this.sequelize.define('users', {
      user_id: {
        type: this.Sequelize.STRING
      },
      nickname: {
        type: this.Sequelize.STRING
      }
    });
  }
}

module.exports = Users;