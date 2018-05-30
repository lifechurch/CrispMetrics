const Config = require('./Config.js');

const Sequelize = require('sequelize');
const Crisp = require('node-crisp-api');

const Conversations = require('./models/conversations');

let sequelize;
let crisp = new Crisp();

async function processSite(site) {
  console.log('Saw', site.name, 'with id:', site.id);

  // let ops = await crisp.websiteOperators.getList(site.id);// - Need admin account to get this probably
  // console.log(ops);

  let settings = await crisp.websiteSettings.get(site.id);
  writeObject(settings, `dist/${site.id}-settings.json`);
  console.log(`Settings for ${site.name}: ${settings}`);
}

async function processConversations(site) {
  let conversations = await crisp.websiteConversations.getList(site.id, 0);
  writeObject(conversations, `dist/${site.id}-conversations.json`);
  console.log('Conversations:', conversations);   
}

async function loadConfig() {
  try {
    return await (new Config()).getValues();
  } catch (e) {
    console.error('ERROR: Encountered trying to load the config:', e);
    process.exit(1);
  }
}

async function authenticateCrisp(config) {
  try {
    await crisp.authenticate(config.auth.identifier, config.auth.key);
  } catch (e) {
    console.error('ERROR: Encountered trying to authenticate the Crisp API:', e);
    process.exit(1);
  }
}

async function connectToDB(config) {
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

async function processCrispData() {
  try {
    let myProfile = await crisp.userProfile.get();
    writeObject(myProfile, 'dist/myProfile.json');
    console.log("Hello:", myProfile.first_name);

    let websites = await crisp.userWebsites.get();
    writeObject(websites, 'dist/websites.json');
    console.log('Websites:', websites);
    
    for(let site of websites) {
      await processSite(site);
      await processConversations(site);
    }

    console.log('Finished.');
    process.exit(0);
  } catch (e) {
    console.error('ERROR: Encountered an Error while calling the API:', e);
  }
}

async function main() {
  let config = await loadConfig();

  console.log('Authenticating with Crisp...');
  await authenticateCrisp(config);

  console.log('Connecting to the DB...');
  await connectToDB(config);

  // console.log('Going to get some data...');
  // await processCrispData();

  console.log('Processing Conversations');
  let conversations = new Conversations(crisp, sequelize);
  await conversations.sync();

  process.exit(0);
}

main();