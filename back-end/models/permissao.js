"use strict";

module.exports = (sequelize, DataTypes) => {
  const Permissao = sequelize.define(
    "Permissao",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
      },
      descricao: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "permissao",
      schema: "public",
      freezeTableName: true,
      timestamps: false,
    }
  );

  Permissao.associate = function (models) {
    Permissao.belongsToMany(models.Locador, {
      through: models.UsuarioPermissao,
      foreignKey: "id_permissao",
      otherKey: "cpf", //uso para entrada o cpf do usuário
    });

    Permissao.belongsToMany(models.Inquilino, {
      through: models.UsuarioPermissao,
      foreignKey: "id_permissao",
      otherKey: "cpf", //uso para entrada o cpf do usuário
    });
  };

  return Permissao;
};
