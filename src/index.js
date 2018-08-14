const Config = require('./Config.js');

const Sequelize = require('sequelize');
const Crisp = require('node-crisp-api');

const Conversations = require('./models/conversations');
const Websites = require('./models/websites');
const Users = require('./models/users');

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
    sequelize = new Sequelize(config.db.name, null, null, {
      host: 'localhost',
      dialect: 'sqlite',
      logging: false,
      storage: './dist/crisp-db.sqlite'
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

  let _users = {};

  for(let site of await websites.getAll()) {
    console.log(`Gonna look at ${site.website_id}`);
    let conversations = new Conversations(crisp, sequelize, site.website_id);
    await conversations.sync();

    _users = Object.assign(_users, conversations.getUsers());
  }

  let users = new Users(crisp, sequelize, _users);
  await users.sync();
  process.exit(0);
}

main();