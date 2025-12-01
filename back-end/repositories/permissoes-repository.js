const model = require("../models");

// Função para obter todas as permissões
const obterTodasPermissoes = async () => {
	return await model.Permissao.findAll();
};

// Função para obter permissão por ID
const obterPermissaoPorId = async (permissao) => {
	return await model.Permissoes.findByPk(permissao.id);
};

// Função para criar uma nova permissão
const criarPermissao = async (permissao) => {
	await model.Permissoes.create(permissao);
	return permissao;
};

// Função para atualizar uma permissão
const atualizarPermissao = async (permissao) => {
	try {
		// Atualizar a permissão
		await model.Permissoes.update(permissao, { where: { id: permissao.id } });

		// Retornar a permissão atualizada
		return await model.Permissoes.findByPk(permissao.id);
	} catch (error) {
		throw error;
	}
};

// Função para deletar uma permissão
const deletarPermissao = async (permissao) => {
	try {
		// Deletar a permissão
		await model.Permissoes.destroy({ where: { id: permissao.id } });
		return permissao;
	} catch (error) {
		throw error;
	}
};

module.exports = {
	obterTodasPermissoes,
	obterPermissaoPorId,
	criarPermissao,
	atualizarPermissao,
	deletarPermissao,
};
