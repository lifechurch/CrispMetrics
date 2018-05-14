const Config = require('./Config.js');
const Crisp = require('node-crisp-api');

let config;
let CrispClient = new Crisp();

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
    
    let site = websites[0];
    let settings = await CrispClient.websiteSettings.get(site.id);
    console.log(`Settings for ${site.name}: ${settings}`);

    let converstaions = await CrispClient.websiteConversations.getList(site.id, 0);
    console.log('Conversations:', converstaions);

    console.log('Finished.');
  } catch (e) {
    console.error('ERROR: Encountered an Error while calling the API:', e);
  }
}

main();