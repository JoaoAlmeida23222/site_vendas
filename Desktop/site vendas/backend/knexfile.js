require("dotenv").config();

module.exports = {
  development: {
    client: "pg",  // Aqui deve estar "pg" para PostgreSQL
    connection: {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "pierre",  // Use "pierre" se criou esse usuário
      password: process.env.DB_PASS || "benfica2002",
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

