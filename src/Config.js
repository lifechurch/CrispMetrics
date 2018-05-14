const fs = require('fs');

class Config {
  constructor() {
    
  }

  getValues() {
    let self = this;

    return new Promise( (resolve, reject) => {
      fs.readFile('./config.json', 'utf8', function (err, data) {
        if (err) {
          reject(err);
        }

        try {
          self.config = JSON.parse(data);
          resolve(self.config);  
        } catch(e) {
          reject(e);
        }
      });
      
    });
  }
}

module.exports = Config;