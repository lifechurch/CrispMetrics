const Config = require('./Config.js');
const Crisp = require('node-crisp-api');

let config;
let CrispClient = new Crisp();

function main() {
  let cf = new Config();

  cf.getValues().then( (config) => config )
  .then( (config) => CrispClient.authenticate(config.auth.identifier, config.auth.key) )
  .then( (cc) => CrispClient.userProfile.get())
  .then( (profile) => CrispClient.userWebsites.get() )
  .then( (websites) => {
    console.log(`Can see ${websites.length} git diff
    sites`);
    let sites = websites.map(iterateSites);
    return websites[0];
  })
  // NOTE: I think you need soe kind of admin rights to get operators
  // .then( (site) => {
  //   console.log('Site:', site.name);
  //   return CrispClient.websiteOperators.getList(site.id);
  // }).then( (peeps) => console.log('Peeps:', peeps ) )
  .then( (site) => {
    console.log('Name:', site.name);
    return CrispClient.websiteConversations.getList(site.id, 0);
  }).then ( (page1) => console.log('Convos:', page1) )
  .then( () => {
    // All done, finish up
    console.log('Done !');
    process.exit();
  }).catch(function (e) {
    console.error('ERROR: Encountered trying to do something:', e);
    process.exit(1);
  });
}

function iterateSites(site) {
  console.log('Saw', site.name, 'with id:', site.id);
  return site.id;
}

main();