const { Sequelize } = require('sequelize');
require('dotenv').config();

const db = new Sequelize(process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASS, 
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'mysql',
      define: {
        timestamps: false
      },
      pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
      },
      operatorAliases: false
});

const dbConetion = async () => {

    try {
        await db.authenticate();
        console.log('Data Base Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}

module.exports = {
    dbConetion,
    db
}