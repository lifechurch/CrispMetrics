const Config = require('./Config.js');
const Crisp = require('node-crisp-api');

let config;
let CrispClient = new Crisp();

async function processSite(site) {
  console.log('Saw', site.name, 'with id:', site.id);

  // CrispClient.websiteOperators.getList(site.id); - Need admin account to get this probably

  let settings = await CrispClient.websiteSettings.get(site.id);
  console.log(`Settings for ${site.name}: ${settings}`);
}

async function processConversations(site) {
  let conversations = await CrispClient.websiteConversations.getList(site.id, 0);
  console.log('Conversations:', conversations);   
}

async function main() {
  try {
    config = await (new Config()).getValues();
  } catch (e) {
    console.error('ERROR: Encountered trying to load the config:', e);
    process.exit(1);
  }

  try {
    await CrispClient.authenticate(config.auth.identifier, config.auth.key);

    let myProfile = await CrispClient.userProfile.get();

    console.log("Hello:", myProfile.first_name);

    let websites = await CrispClient.userWebsites.get();
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

main();