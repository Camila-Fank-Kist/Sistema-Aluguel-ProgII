const model = require("../models");
const { Op } = require("sequelize");

// Função para listar todas as unidades (público geral) com filtros opcionais
<<<<<<< HEAD
const listarTodasAsUnidadesPublicoGeral = async (
  filtros_um,
  intervalo_preco_um,
  nome_um,
  filtros_imovel
) => {
  if (nome_um) {
    filtros_um.nome_um = {
      [Op.iLike]: `%${nome_um}%`,
    };
  }

  if (intervalo_preco_um.preco_min || intervalo_preco_um.preco_max) {
    filtros_um.preco_aluguel = {}; // não estamos passando um valor exato para preco_aluguel, mas sim um intervalo, então não tem como colocarmos um valor simples em preco_aluguel (como um float ou algo do tipo)
    // precisamos passar para o campo preco_aluguel 2 valores diferentes, que são as regras (preço mínimo e preço máximo), e para isso precisamos transformar preco_aluguel em um objeto (para passar esses dois valores para o mesmo campo).
=======
const listarTodasAsUnidadesPublicoGeral = async (filtros_um, intervalo_preco_um, nome_um, filtros_imovel) => {
  
  if (nome_um) {
    filtros_um.nome_um = {
      [Op.iLike]: `%${nome_um}%`
    };
  }
  
  if (intervalo_preco_um.preco_min || intervalo_preco_um.preco_max) {
    filtros_um.preco_aluguel = {}; // não estamos passando um valor exato para preco_aluguel, mas sim um intervalo, então não tem como colocarmos um valor simples em preco_aluguel (como um float ou algo do tipo)
    // precisamos passar para o campo preco_aluguel 2 valores diferentes, que são as regras (preço mínimo e preço máximo), e para isso precisamos transformar preco_aluguel em um objeto (para passar esses dois valores para o mesmo campo). 
>>>>>>> c68eebaa42fed46e4f809f6e4965c9aa14fca47d
    // [Op.gte] é a chave e intervalo_preco_um.preco_min é o valor associado a essa chave no objeto; [Op.lte] é a chave e intervalo_preco_um.preco_max é o valor associado a essa chave no objeto. Daí com isso o sequelize monta a requisição SQL.
    if (intervalo_preco_um.preco_min) {
      filtros_um.preco_aluguel[Op.gte] = intervalo_preco_um.preco_min;
    }
    if (intervalo_preco_um.preco_max) {
      filtros_um.preco_aluguel[Op.lte] = intervalo_preco_um.preco_max;
    }
  }

  return await model.Unidade_moradia.findAll({
    where: filtros_um,
    include: [
      {
        model: model.Imovel,
<<<<<<< HEAD
        where: filtros_imovel,
      },
    ],
  });
};

const listarUnidadesDoLocador = async (locador_cpf, filtros, nome_um) => {
  // o que define quem é quem na passagem de parâmetros é a ordem

  if (nome_um) {
    filtros.nome_um = {
      [Op.iLike]: `%${nome_um}%`,
    };
  }

  return await model.Unidade_moradia.findAll({
    where: filtros,
    include: [
      {
        model: model.Imovel,
        where: { locador_cpf: locador_cpf },
      },
    ],
  });
};

const obterUnidadePorId = async (id) => {
  return await model.Unidade_moradia.findByPk(id, {
    include: [
      {
        model: model.Imovel,
      },
    ],
  });
};

const obterCategoriaPorId = async (id_categoria_um) => {
  return await model.Categoria_um.findByPk(id_categoria_um);
};

const criarUnidade = async (unidade) => {
  return await model.Unidade_moradia.create(unidade);
=======
        where: filtros_imovel
      }
    ],
  });

};

const listarUnidadesDoLocador = async (locador_cpf, filtros, nome_um) => { // o que define quem é quem na passagem de parâmetros é a ordem

	if (nome_um) {
    filtros.nome_um = {
      [Op.iLike]: `%${nome_um}%`
    };
  }

	return await model.Unidade_moradia.findAll({
		where: filtros,
		include: [
			{
				model: model.Imovel,
				where: { locador_cpf: locador_cpf },
			},
		],
	});
};

const obterUnidadePorId = async (id) => {
	return await model.Unidade_moradia.findByPk(
    id, 
    {
      include: [
        {
          model: model.Imovel,
        },
      ],
    });
};

const obterCategoriaPorId = async (id_categoria_um) => {
	return await model.Categoria_um.findByPk(id_categoria_um);
};

const criarUnidade = async (unidade) => {
	return await model.Unidade_moradia.create(unidade);
>>>>>>> c68eebaa42fed46e4f809f6e4965c9aa14fca47d
};

const atualizarUnidade = async (unidade) => {
  try {
    await model.Unidade_moradia.update(unidade, { where: { id: unidade.id } });
    return await model.Unidade_moradia.findByPk(unidade.id);
  } catch (error) {
    throw error;
  }
};

const deletarUnidade = async (id) => {
  try {
    await model.Unidade_moradia.destroy({ where: { id: id } });
  } catch (error) {
    throw error;
  }
};

module.exports = {
<<<<<<< HEAD
  listarTodasAsUnidadesPublicoGeral,
  listarUnidadesDoLocador,
  obterUnidadePorId,
  obterCategoriaPorId,
  criarUnidade,
  atualizarUnidade,
  deletarUnidade,
=======
	listarTodasAsUnidadesPublicoGeral,
	listarUnidadesDoLocador,
	obterUnidadePorId,
	obterCategoriaPorId,
	criarUnidade,
	atualizarUnidade,
	deletarUnidade,
>>>>>>> c68eebaa42fed46e4f809f6e4965c9aa14fca47d
};
