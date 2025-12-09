"use strict";

module.exports = (sequelize, DataTypes) => {
  const Categoria_um = sequelize.define(
    "Categoria_um",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_categoria_um',
      },
      categoria_da_um: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: "categoria_um",
      schema: "public",
      freezeTableName: true,
      timestamps: false,
    }
  );

  Categoria_um.associate = function (models) {
    Categoria_um.hasMany(models.Unidade_moradia, {
      foreignKey: "id_categoria_um",
      sourceKey: "id",
    });
  };

  return Categoria_um;
};
