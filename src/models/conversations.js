const Model = require('./model');
const moment = require('moment');

class Conversations extends Model {
  constructor(crisp, sequelize, site) {
    super(crisp, sequelize);
    this.site = site;
    this.users = {};
  }

  async sync() {
    await super.sync();

    try {
      console.log(`Looping ${this.site}`);

      let i = 1;
      let conversations = await this.crisp.websiteConversations.getList(this.site, 0);

      while(conversations.length > 0) {
        conversations = await this.crisp.websiteConversations.getList(this.site, i);
        this._writeObject(conversations, `dist/${this.site}-conversations-${i}.json`);

        console.log(`Page ${i} has ${conversations.length} conversations`);

        await this._iterateConversations(this.site, conversations);
        i++;
      }
    } catch(e) {
      console.error('ERROR: Unable to get conversations from websites:', e);
    }
  }

  getUsers() {
    return this.users;
  }

  async _iterateConversations(site, conversations) {
    this._writeObject(conversations, `dist/${site}-conversations.json`);

    console.log(`Found ${conversations.length} conversation(s)`);

    for(let conversation of conversations) {
      let operator = '';
      if(conversation.compose) {
        operator = Object.keys(conversation.compose.operator)[0];
        this.users[operator] = conversation.compose.operator[operator].user;
      }

      await this._dataModel.findOrCreate({
        where: {
          session_id: conversation.session_id
        },
        defaults: {
          session_id: conversation.session_id,
          website_id: conversation.website_id,
          created_at: conversation.created_at,
          updated_at: conversation.updated_at,
          operator: operator,
          state: conversation.state
        }
      });
      
      // console.log(`Elapsed time for ${conversation.session_id} is ${this._calcTimeElapsed(conversation.created_at, conversation.updated_at)} minute(s)`);
      // await this._getConversationMessages(conversation.website_id, conversation.session_id);
    }
  }

    // TODO: Convert this into a Messages class to iterate and store the messages for later analysis
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
      },
      operator: {
        type: this.Sequelize.STRING
      },
      state: {
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