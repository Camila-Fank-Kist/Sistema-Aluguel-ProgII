"use strict";

module.exports = (sequelize, DataTypes) => {
  const InquilinoPermissao = sequelize.define(
    "InquilinoPermissao",
    {
      //itens necessários
      cpf: {
        type: DataTypes.STRING,
        primaryKey: true,
        references: {
          model: "inquilino",
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
      tableName: "inquilino_permissao",
      schema: "public",
      freezeTableName: true,
      timestamps: false,
    }
  );

  InquilinoPermissao.associate = function (models) {
    InquilinoPermissao.belongsTo(models.Inquilino, {
      foreignKey: "cpf",
      targetKey: "cpf",
    });

    InquilinoPermissao.belongsTo(models.Permissao, {
      foreignKey: "id_permissao",
      targetKey: "id",
      as: "Permissao",
    });
  };

  return InquilinoPermissao;
};
