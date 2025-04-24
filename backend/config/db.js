require("dotenv").config();
const knex = require("knex");


console.log("DB PASSWORD:", process.env.DB_PASSWORD);


const db = knex({
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  },
});

module.exports = db;
