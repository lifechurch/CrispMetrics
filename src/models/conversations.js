const fs = require('fs');
const util = require('util');

const moment = require('moment');
const Sequelize = require('sequelize');

class Conversations {
  constructor(crisp, sequelize) {
    this.crisp = crisp;
    this.sequelize = sequelize;
  }

  async sync() {
    this._dataModel = this._getDataModel();
    await this._dataModel.sync({
      force: true
    });

    let websites = await this._getWebsites();

    try {
      for(let site of websites) {
        let conversations = await this.crisp.websiteConversations.getList(site.id, 0);
        this._writeObject(conversations, `dist/${site.id}-conversations.json`);

        console.log(`Found ${conversations.length} conversation(s)`);

        for(let conversation of conversations) {
          await this._dataModel.create({
            session_id: conversation.session_id,
            website_id: conversation.website_id,
            created_at: conversation.created_at,
            updated_at: conversation.updated_at
          });
          console.log(`Elapsed time for ${conversation.session_id} is ${this._calcTimeElapsed(conversation.created_at, conversation.updated_at)} minute(s)`);
        }
      }
    } catch(e) {
      console.error('ERROR: Unable to get conversations from websites:', e);
    }
  }

  async _getWebsites() {
    try{
      let websites = await this.crisp.userWebsites.get();
      this._writeObject(websites, 'dist/websites.json');
      return websites;
    } catch(e) {
      console.error('ERROR: Unable to get Websites:', e);
      return null;
    }
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

  _writeObject(obj, fileName) {
    fs.writeFileSync(fileName, JSON.stringify(obj, null, '\t'), 'utf-8');
  }

  _calcTimeElapsed(start, end){
    let a = moment(start);
    let b = moment(end);

    let difference = moment.duration(b.diff(a));

    return difference.asMinutes();
  }
}

module.exports = Conversations;