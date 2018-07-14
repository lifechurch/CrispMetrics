const Model = require('./model');

class Websites extends Model {
  constructor(crisp, sequelize) {
    super(crisp, sequelize);
  }

  async sync() {
    let websites;
    await super.sync();

    try{
      websites = await this.crisp.userWebsites.get();
      this._writeObject(websites, 'dist/websites.json');
    } catch(e) {
      console.error('ERROR: Unable to get Websites:', e);
      return null;
    }

    try {
      for(let site of websites) {
        let settings = await this.crisp.websiteSettings.get(site.id)

        this._writeObject(settings, `dist/${site.id}-settings.json`);

        await this._dataModel.create({
          website_id: site.id,
          name: site.name,
          domain: site.domain,
          logo: site.logo
        });
        console.log(`Website ${site.name} has id ${site.id}`);

        // Getting not_allowed here
        // let operators = await this.crisp.websiteOperators.getList(site.id);
        // console.log(operators);
        // this._writeObject(operators, `dist/${site.id}-operators.json`);
      }
    } catch(e) {
      console.error('ERROR: Unable to get websites:', e);
    }
  }

  _getDataModel() {
    return this.sequelize.define('website', {
      website_id: {
        type: this.Sequelize.STRING
      },
      name: {
        type: this.Sequelize.STRING
      },
      domain: {
        type: this.Sequelize.STRING
      },
      logo: {
        type: this.Sequelize.STRING
      }
    });
  }
}

module.exports = Websites;