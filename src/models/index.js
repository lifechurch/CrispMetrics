const Sequelize = require('sequelize');
// const User = require('./User');

const sequelize = new Sequelize('postgres://postgres:example@localhost:5432/postgres');

const User = sequelize.define('user', {
  user_id: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  first_name: {
    type: Sequelize.STRING
  },
  last_name: {
    type: Sequelize.STRING
  },
  avatar: {
    type: Sequelize.STRING
  }
});

async function main() {
  try {
    await sequelize.authenticate();

    await User.sync({force: true});

    await User.create({
      user_id: '12345',
      first_name: 'Adam',
      last_name: 'Freeman',
      email: 'shavenyaknz@gmail.com',
      avatar: ''
    });

    await User.create({
      user_id: '23456',
      first_name: 'Some',
      last_name: 'dude',
      email: 'thatdude@gmail.com',
      avatar: ''
    });

    let users = await User.findAll();

    console.log( users );
    process.exit(0);
  } catch(e) {
   console.error(e); 
  }
}

main();