"use strict";

module.exports = (sequelize, DataTypes) => {
  const Cadastro = sequelize.define(
    "Cadastro",
    {
      cpf: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      data_nascimento: DataTypes.STRING,
      nome_usuario: DataTypes.STRING,
      senha: DataTypes.STRING,
      locador: DataTypes.BOOLEAN,
      estuda: DataTypes.BOOLEAN,
      trabalha: DataTypes.BOOLEAN,
      genero: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      tableName: "cadastro",
      schema: "public",
      freezeTableName: true,
      timestamps: false,
    }
  );

  Cadastro.associate = function (models) {
    Cadastro.hasMany(models.Imovel, {
      foreignKey: "locador_cpf",
      sourceKey: "cpf",
    });
  };

  return Cadastro;
};
