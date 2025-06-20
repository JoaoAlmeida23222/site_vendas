
require("dotenv").config();



module.exports = {
  development: {
    client: "pg",  
    connection: {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "pierre",  
      password: process.env.DB_PASSWORD || "benfica2002",
      database: process.env.DB_NAME || "my_shop_db",
      port: process.env.DB_PORT || 5432,
    },
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },
};

