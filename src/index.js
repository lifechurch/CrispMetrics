const Config = require('./Config.js');

const Sequelize = require('sequelize');
const Crisp = require('node-crisp-api');

const Conversations = require('./models/conversations');
const Websites = require('./models/websites');

let sequelize;
let crisp = new Crisp();

async function _loadConfig() {
  try {
    return await (new Config()).getValues();
  } catch (e) {
    console.error('ERROR: Encountered trying to load the config:', e);
    process.exit(1);
  }
}

async function _authenticateCrisp(config) {
  try {
    await crisp.authenticate(config.auth.identifier, config.auth.key);
  } catch (e) {
    console.error('ERROR: Encountered trying to authenticate the Crisp API:', e);
    process.exit(1);
  }
}

async function _connectToDB(config) {
  try {
    let connectString = `postgres://${config.db.user}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.name}`;
    console.log(`Connect on ${connectString}`);
    sequelize = new Sequelize(connectString, {
      logging: false // Set to true to debug SQL queries
    });
    await sequelize.authenticate();
    console.log('Connected to DB');
  } catch (e) {
    console.error('ERROR: Encountered trying to open the DB for Sequelize:', e);
    process.exit(1);
  }  
}

async function main() {
  let config = await _loadConfig();

  console.log('Authenticating with Crisp...');
  await _authenticateCrisp(config);

  console.log('Connecting to the DB...');
  await _connectToDB(config);

  // Start processing data
  console.log('Processing Websites');
  let websites = new Websites(crisp, sequelize);
  await websites.sync();

  for(let site of await websites.getAll()) {
    console.log(`Gonna look at ${site.website_id}`);
    let conversations = new Conversations(crisp, sequelize, site.website_id);
    // let allConvos = await conversations.getAll();
    // console.log(allConvos);
    // console.log(`Looping ${site.id}`);
    for(let conversation of await conversations.getAll()) {
      // console.log('Get list');
      // let conversations = await this.crisp.websiteConversations.getList(site.id, 0);
      // console.log(`Conversations: ${conversations.length}`);
      console.log(conversation);
      this._writeObject(conversation, `dist/${site}-conversation-.json`);
      // await this._iterateConversations(site, conversations);
    }
  }

  process.exit(0);
}

main();