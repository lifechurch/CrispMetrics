const Model = require('./model');
const moment = require('moment');

class Conversations extends Model {
  constructor(crisp, sequelize, site) {
    super(crisp, sequelize);
    this.site = site;
  }

  async sync() {
    await super.sync();

    try {
      console.log(`Looping ${this.site}`);
      for(let i = 0; i < 10; i++) {
        console.log('Get list');
        let conversations = await this.crisp.websiteConversations.getList(this.site, 0);
        console.log(`Conversations: ${conversations.length}`);
        this._writeObject(conversations, `dist/${this.site}-conversations-${i}.json`);
        return await this._iterateConversations(this.site, conversations);
      }
    } catch(e) {
      console.error('ERROR: Unable to get conversations from websites:', e);
    }
  }

  async _iterateConversations(site, conversations) {
    this._writeObject(conversations, `dist/${site}-conversations.json`);

    console.log(`Found ${conversations.length} conversation(s)`);

    for(let conversation of conversations) {
      await this._dataModel.create({
        session_id: conversation.session_id,
        website_id: conversation.website_id,
        created_at: conversation.created_at,
        updated_at: conversation.updated_at
      });
      console.log(`Elapsed time for ${conversation.session_id} is ${this._calcTimeElapsed(conversation.created_at, conversation.updated_at)} minute(s)`);
      await this._getConversationMessages(conversation.website_id, conversation.session_id);
    }
  }

  async _getConversationMessages(websiteId, sessionId) {
    try {
      let messages = await this.crisp.websiteConversations.getMessages(websiteId, sessionId);
      this._writeObject(messages, `dist/conversations/${websiteId}-${sessionId}-messages.json`);
    } catch(e) {
      console.error
    }
  }

  _getDataModel() {
    return this.sequelize.define('conversation', {
      session_id: {
        type: this.Sequelize.STRING
      },
      website_id: {
        type: this.Sequelize.STRING
      },
      created_at: {
        type: this.Sequelize.STRING
      },
      updated_at: {
        type: this.Sequelize.STRING
      }
    });
  }

  _calcTimeElapsed(start, end){
    let a = moment(start);
    let b = moment(end);

    let difference = moment.duration(b.diff(a));

    return difference.asMinutes();
  }
}

module.exports = Conversations;