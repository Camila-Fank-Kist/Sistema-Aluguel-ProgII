"use strict";

module.exports = (sequelize, DataTypes) => {
  const Locador = sequelize.define(
    "Locador",
    {
      //itens necessários
      cpf: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      data_nascimento: DataTypes.STRING,
      nome: DataTypes.STRING,
      senha: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: "locador",
      schema: "public",
      freezeTableName: true,
      timestamps: false,
    }
  );

  Locador.associate = function (models) {
    Locador.hasMany(models.Imovel, {
      foreignKey: "locador_cpf",
      sourceKey: "cpf",
    });
  };

  return Locador;
};
