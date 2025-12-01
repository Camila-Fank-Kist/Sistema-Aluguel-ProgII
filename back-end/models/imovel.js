"use strict";

module.exports = (sequelize, DataTypes) => {
  const Imovel = sequelize.define(
    "Imovel",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      regras_convivencia: DataTypes.STRING,
      publico: DataTypes.STRING,
      endereco_rua: DataTypes.STRING,
      endereco_bairro: DataTypes.STRING,
      endereco_numero: DataTypes.INTEGER,
      endereco_cidade: DataTypes.STRING,
      endereco_estado: DataTypes.STRING,
      endereco_pais: DataTypes.STRING,
      endereco_cep: DataTypes.STRING,
      endereco_complemento: DataTypes.STRING,
      id_tipo: DataTypes.INTEGER, //no banco de dados, aqui recebo o id do tipo do imóvel
      locador_cpf: DataTypes.STRING,
      nome_imovel: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: "imovel",
      schema: "public",
      freezeTableName: true,
      timestamps: false,
    }
  );

  Imovel.associate = function (models) {
    //isso é para quando tenho uma tela que necessita de informações de outra tela. Como não tenho uma tela específica para tipo, não insiro ele aqui
    Imovel.belongsTo(models.Locador, {
      foreignKey: "locador_cpf",
      targetKey: "cpf",
      //sourceKey: "cpf",
    });
  };

  return Imovel;
};
