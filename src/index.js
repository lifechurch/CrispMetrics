const fs = require('fs');
const util = require('util');
const moment = require('moment');

const Config = require('./Config.js');

const Sequelize = require('sequelize');
const Crisp = require('node-crisp-api');

const Conversations = require('./models/conversations');

let config;
let sequelize;
let CrispClient = new Crisp();

async function processSite(site) {
  console.log('Saw', site.name, 'with id:', site.id);

  // let ops = await CrispClient.websiteOperators.getList(site.id);// - Need admin account to get this probably
  // console.log(ops);

  let settings = await CrispClient.websiteSettings.get(site.id);
  writeObject(settings, `dist/${site.id}-settings.json`);
  console.log(`Settings for ${site.name}: ${settings}`);
}

async function processConversations(site) {
  let conversations = await CrispClient.websiteConversations.getList(site.id, 0);
  writeObject(conversations, `dist/${site.id}-conversations.json`);
  console.log('Conversations:', conversations);   
}

async function authenticateCrisp() {
  try {
    config = await (new Config()).getValues();
  } catch (e) {
    console.error('ERROR: Encountered trying to load the config:', e);
    process.exit(1);
  }

  try {
    await CrispClient.authenticate(config.auth.identifier, config.auth.key);
  } catch (e) {
    console.error('ERROR: Encountered trying to authenticate the Crisp API:', e);
    process.exit(1);
  }
}

async function connectToDB() {
  try {
    sequelize = new Sequelize('postgres://postgres:example@localhost:5432/postgres');
    await sequelize.authenticate();
  } catch (e) {
    console.error('ERROR: Encountered trying to open the DB for Sequelize:', e);
    process.exit(1);
  }  
}

async function main() {
  try {
    let myProfile = await CrispClient.userProfile.get();
    writeObject(myProfile, 'dist/myProfile.json');
    console.log("Hello:", myProfile.first_name);



    let websites = await CrispClient.userWebsites.get();
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

//calculate response time between created at vs updated at times
function calcResponseTime(){
  //created at time
  var a = moment(1512597259585);
  //udpated at time
  var b = moment(1512598047037);
  var difference = moment.duration(b.diff(a));
  difference = difference.asMinutes();
  console.log('minutes difference ' + difference);
}

function writeObject(obj, fileName) {
  fs.writeFileSync(fileName, JSON.stringify(obj, null, '\t'), 'utf-8');  
}

authenticateCrisp();
connectToDB();
// main();
calcResponseTime();

let conversations = new Conversations(CrispClient, sequelize);
conversations.sync();
