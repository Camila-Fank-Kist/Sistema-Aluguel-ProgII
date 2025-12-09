"use strict";

module.exports = (sequelize, DataTypes) => {
  const Contrato = sequelize.define(
    "Contrato",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "id_contrato",
      },
      pdf: DataTypes.STRING,
      preco: DataTypes.DECIMAL(10, 2),
      data_fim: DataTypes.DATE,
      data_inicio: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW, // ATENÇÃO
      },
      contrato_ativo: DataTypes.BOOLEAN,
      id_um: DataTypes.INTEGER,
      inquilino_cpf: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: "contrato",
      schema: "public",
      freezeTableName: true,
      timestamps: false,
    }
  );

  Contrato.associate = function (models) {
    // um contrato pertence a uma unidade de moradia
    Contrato.belongsTo(models.Unidade_moradia, {
      foreignKey: "id_um", // coluna nessa tabela que aponta para Unidade_moradia
      sourceKey: "id", // chave primária na tabela Unidade_moradia que é referenciada pela chave estrangeira dessa tabela
      as: "Unidade_moradia", // defini pois vinha com um nome estranho (m no final: Unidade_moradiam)
    });
    // um contrato pertence a um inquilino (usuario)
    Contrato.belongsTo(models.Inquilino, {
      foreignKey: "inquilino_cpf",
      sourceKey: "cpf",
    });
  };
  return Contrato;
};
