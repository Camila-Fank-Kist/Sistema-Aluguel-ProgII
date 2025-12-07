"use strict";

module.exports = (sequelize, DataTypes) => {
  const LocadorPermissao = sequelize.define(
    "LocadorPermissao",
    {
      cpf: {
        type: DataTypes.STRING,
        primaryKey: true,
        references: {
          model: "locador",
          key: "cpf",
        },
      },
      id_permissao: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        references: {
          model: "permissoes",
          key: "id",
        },
      },
    },
    {
      sequelize,
      tableName: "locador_permissao",
      schema: "public",
      freezeTableName: true,
      timestamps: false,
    }
  );

  LocadorPermissao.associate = function (models) {
    LocadorPermissao.belongsTo(models.Locador, {
      foreignKey: "cpf",
      targetKey: "cpf",
    });

    LocadorPermissao.belongsTo(models.Permissao, {
      foreignKey: "id_permissao",
      targetKey: "id",
      as: "Permissao",
    });
  };

  return LocadorPermissao;
};
