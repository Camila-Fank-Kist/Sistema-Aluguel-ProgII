const { Sequelize } = require("sequelize");

const cls = require("cls-hooked");
const transactionNamespace = cls.createNamespace("transaction_namespace");

Sequelize.useCLS(transactionNamespace);

const sequelize = new Sequelize({
  host: "localhost",
  port: "5432",
  database: "sistema-aluguel", //usei assim no meu notbook
  username: "postgres", //usei assim no meu notbook
  password: "postgres.cfk", //padrão no computador da UFFS
  schema: "public",
  dialect: "postgres",
  freezeTableName: false,
  syncOnAssociation: false,
  logging: console.log,
  define: {
    freezeTableName: true,
    timestamps: false,
  },
});

module.exports = sequelize;
