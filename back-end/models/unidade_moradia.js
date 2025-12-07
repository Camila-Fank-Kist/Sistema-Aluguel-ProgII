"use strict";

module.exports = (sequelize, DataTypes) => {
<<<<<<< HEAD
  // definindo o modelo Unidade_moradia que o Sequelize vai usar para traduzir as operações para comandos SQL para o banco de dados
  const Unidade_moradia = sequelize.define(
    "Unidade_moradia", // nome do modelo dentro do código js
    // definição das colunas da tabela no banco de dados:
    {
      // no js, esse campo vai se chamar "id", mas no banco de dados ele é "id_um"
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "id_um",
      },
      nome_um: DataTypes.STRING,
      preco_aluguel: DataTypes.DECIMAL(10, 2),
      disponivel: DataTypes.BOOLEAN,
      completo: DataTypes.BOOLEAN,
      descricao: DataTypes.STRING,
      id_imovel: DataTypes.INTEGER,
      id_categoria_um: DataTypes.INTEGER,
    },
    {
      sequelize,
      tableName: "unidade_moradia", // nome da tabela no banco de dados
      schema: "public",
      freezeTableName: true,
      timestamps: false, // diz para o Sequelize NÃO criar automaticamente as colunas 'createdAt' e 'updatedAt'
    }
  );

  // essa função define os relacionamentos entre as tabelas
  Unidade_moradia.associate = function (models) {
    // uma unidade pertence a um imovel
    Unidade_moradia.belongsTo(models.Imovel, {
      foreignKey: "id_imovel", // chave estrangeira nessa tabela que referencia o imovel
      sourceKey: "id", // chave primária na tabela Imovel que é referenciada pela chave estrangeira
    });
    // uma unidade de moradia pode ter muitos contratos ao longo do tempo (não vários contratos ativos ao mesmo tempo)
    Unidade_moradia.hasMany(models.Contrato, {
      foreignKey: "id_um", // chave estrangeira na tabela Contrato que referencia essa tabela
      sourceKey: "id", // chave primária nessa tabela que é referenciada pela chave estrangeira
    });
  };

  return Unidade_moradia;
};
=======
	// definindo o modelo Unidade_moradia que o Sequelize vai usar para traduzir as operações para comandos SQL para o banco de dados
	const Unidade_moradia = sequelize.define( 
		"Unidade_moradia", // nome do modelo dentro do código js
		// definição das colunas da tabela no banco de dados:
		{
			// no js, esse campo vai se chamar "id", mas no banco de dados ele é "id_um"
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				field: 'id_um',
			},
			nome_um: DataTypes.STRING,
			preco_aluguel: DataTypes.DECIMAL(10, 2),
			disponivel: DataTypes.BOOLEAN,
			completo: DataTypes.BOOLEAN,
			descricao: DataTypes.STRING,
			id_imovel: DataTypes.INTEGER,
			id_categoria_um: DataTypes.INTEGER,
		},
		{
			sequelize,
			tableName: "unidade_moradia", // nome da tabela no banco de dados
			schema: "public",
			freezeTableName: true,
			timestamps: false, // diz para o Sequelize NÃO criar automaticamente as colunas 'createdAt' e 'updatedAt'
		}
	);

	// essa função define os relacionamentos entre as tabelas
	Unidade_moradia.associate = function (models) {
		// uma unidade pertence a um imovel
		Unidade_moradia.belongsTo(models.Imovel, {
			foreignKey: "id_imovel", // chave estrangeira nessa tabela que referencia o imovel
			sourceKey: "id", // chave primária na tabela Imovel que é referenciada pela chave estrangeira
		});
		// uma unidade de moradia pode ter muitos contratos ao longo do tempo (não vários contratos ativos ao mesmo tempo)
		Unidade_moradia.hasMany(models.Contrato, {
			foreignKey: "id_um", // chave estrangeira na tabela Contrato que referencia essa tabela
			sourceKey: "id", // chave primária nessa tabela que é referenciada pela chave estrangeira
		});
	};

	return Unidade_moradia;
};

>>>>>>> c68eebaa42fed46e4f809f6e4965c9aa14fca47d
