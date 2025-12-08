"use strict";

module.exports = (sequelize, DataTypes) => {
  const Inquilino = sequelize.define(
    "Inquilino",
    {
      //itens necessários
      cpf: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      data_nascimento: DataTypes.STRING,
      nome: DataTypes.STRING,
      senha: DataTypes.STRING,
      estuda: DataTypes.BOOLEAN,
      trabalha: DataTypes.BOOLEAN,
      genero: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: "inquilino",
      schema: "public",
      freezeTableName: true,
      timestamps: false,
    }
  );

  return Inquilino;
};
