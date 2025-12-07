const unidadeRepository = require("../repositories/unidade_moradia-repository");
const contratoRepository = require("../repositories/contrato-repository");
const imovelRepository = require("../repositories/imovel-repository");

// o Express pega tudo o que vem depois do ? na URL e coloca dentro de req.query
// exemplo: URL que o usuário digita: http://site.com/unidades?disponivel=true&id_imovel=50&cidade=Chapeco&quartos=3
// daí o express pega tudo depois do ?, separa pelo símbolo "&" e cria o objeto req.query.
// obs.: os valores em req.query são sempre strings

// :)
const listaUnidadesLocador = async (req, res) => {
  try {
    const locador_cpf = req.user.cpf; // pegando o cpf do locador autenticado

    const filtros = {}; // objeto para armazenar os filtros => inicia vazio

    if (req.query.disponivel) {
      filtros.disponivel = (req.query.disponivel === 'true') ? true : false;
    }
    if (req.query.id_imovel) {
      filtros.id_imovel = parseInt(req.query.id_imovel);
    }
    if (req.query.id_categoria_um) {
      filtros.id_categoria_um = parseInt(req.query.id_categoria_um);
    }
    // if (req.query.nome_um) {
    //   filtros.nome_um = req.query.nome_um;
    // }

    const unidades_locador = await unidadeRepository.listarUnidadesDoLocador(locador_cpf, filtros, req.query.nome_um);
    // se tentar passar uma variavel que não existe, passa undefined
    // se tentat passar um objeto vazio, passa {}

    return res.status(200).json(unidades_locador);
    
  } catch (error) {
    console.error("Erro ao listar unidades do locador:", error);
    return res.sendStatus(500);
  }
};

// :)
// tinha pensado em fazer para aparecer só as unidades disponíveis para o inquilino, mas daí pensei que fosse mais legal deixar as unidades não disponíveis desabilitadas no front
const listaTodasAsUnidadesPublicoGeral = async (req, res) => {
  try {
    const filtros_um = {};
    const intervalo_preco_um = {};
    const filtros_imovel = {};

    if (req.query.disponivel) {
      filtros_um.disponivel = (req.query.disponivel === 'true') ? true : false;
    }
    if (req.query.id_categoria_um) {
      filtros_um.id_categoria_um = parseInt(req.query.id_categoria_um);
    }

    if (req.query.preco_min) {
      intervalo_preco_um.preco_min = parseFloat(req.query.preco_min);
    }
    if (req.query.preco_max) {
      intervalo_preco_um.preco_max = parseFloat(req.query.preco_max);
    }

    // if (req.query.nome_um) {
    //   filtros_um.nome_um = req.query.nome_um;
    // }
    if (req.query.cidade) {
      filtros_imovel.endereco_cidade = req.query.cidade;
    }
    if (req.query.publico) {
      filtros_imovel.publico = req.query.publico;
    }

    const unidades = await unidadeRepository.listarTodasAsUnidadesPublicoGeral(filtros_um, intervalo_preco_um, req.query.nome_um, filtros_imovel);

    return res.status(200).json(unidades);
    
  } catch (error) {
    console.error("Erro ao listar todas as unidades:", error);
    return res.sendStatus(500);
  }
};


// :)
// (NÃO): obs.: tratar para só retornar a unidade de moradia se ela pertencer ao locador ou inquilino autenticado. Se ela existir mas não pertencer a ele, retornar 404 e uma mensagem "Unidade não encontrada dentre suas unidades."
// na real acho que não, pois essa rota pode ser usada pelo público geral também, para ver detalhes de uma unidade. daí o que muda é no front, que se o usuário for um locador autenticado, ele vê mais detalhes (botões de editar, excluir, etc.), e se for público geral, vê só os detalhes básicos.
const retornaUnidadePorId = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const unidade = await unidadeRepository.obterUnidadePorId(id);
    if (unidade) {
			res.status(200).json(unidade);
		} else {
			res.status(404).json({ message: "Unidade de moradia não encontrada." });
		}
  } catch (error) {
    console.error("Erro ao buscar unidade de moradia:", error);
    res.sendStatus(500);
  }
};

// :)
// :) obs1.: garantir que a unidade criada pertença a um imóvel que exista e que sejs do locador autenticado
// obs2.: deve ser permitido o usuário selecionar o imóvel, mas também deve ser possível pegar automaticamente o imóvel, se for criar uma unidade a partir de um imóvel. Mas daí acho que basta enviar o id_imovel no body mesmo, pra usar essa mesma rota
// extras:
  // :) não permitir preço negativo
  // :) verificar se id_categoria_um existe
const criaUnidade = async (req, res) => {
  try {
    const { nome_um, preco_aluguel, descricao, id_imovel, id_categoria_um, completo } = req.body; // não passamos "disponivel" no body pq ao criar uma unidade, ela sempre começa como disponível
    
    if (!nome_um || preco_aluguel === undefined || !id_imovel) { // caso o preço seja 0
      return res.status(400).json({ message: "Nome da unidade, preço do aluguel e imóvel são obrigatórios." });
    }

    // verificando se o preço é negativo
    if (preco_aluguel < 0) {
      return res.status(400).json({ message: 'O preço do aluguel não pode ser negativo' });
    }

    const imovel = await imovelRepository.obterImovelPorId(id_imovel);
    // verificando se o imóvel existe:
    if (!imovel) {
      return res.status(404).json({ message: 'Imóvel não encontrado' });
    }
    // verificando se o imóvel pertence ao locador autenticado:
    if (imovel.locador_cpf != req.user.cpf) { // !==
      return res.status(403).json({ message: 'Sem permissão para criar unidade nesse imóvel' });
    }

    // verificando se id_categoria_um existe (se for informado)
    if (id_categoria_um) {
      const categoria = await unidadeRepository.obterCategoriaPorId(id_categoria_um); // coloquei essa função no repositório de unidade_moradia mesmo, pq não fizemos os arquivos pra categoria_um
      if (!categoria) {
        return res.status(404).json({ message: 'Categoria não encontrada' });
      }
    }
    
    const unidade_criada = await unidadeRepository.criarUnidade({ 
      nome_um, 
      preco_aluguel, 
      descricao: descricao || null, 
      id_imovel, 
      id_categoria_um: id_categoria_um || null, 
      completo: !!completo, 
      disponivel: true 
    });

    return res.status(201).json(unidade_criada);

  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

// :)
const uploadFoto = async (req, res) => {
  return res.status(500).json({ message: 'Upload de foto não implementado' });
};

// :)
const atualizaUnidade = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nome_um, preco_aluguel, descricao, completo } = req.body;
    let { id_imovel, id_categoria_um } = req.body;

    if (id_imovel) id_imovel = parseInt(id_imovel);
    if (id_categoria_um) id_categoria_um = parseInt(id_categoria_um);

    // para caso o usuário apague um campo obrigatório
    if (!nome_um || preco_aluguel === undefined || !id_imovel) {
      return res.status(400).json({ message: "Nome da unidade, preço do aluguel e imóvel são obrigatórios." });
    }

    // verificando se o preço é negativo
    if (preco_aluguel < 0) {
      return res.status(400).json({ message: 'O preço do aluguel não pode ser negativo' });
    }

    // verificando se a unidade existe => mudei para já trazer o Imovel junto
    // achar a unidade serve só pra verificar se ela existe e se pertence ao locador autenticado
    // obs.: movi para o início a verificação da existência da unidade, para em seguida verificar se a unidade pertece ao locador autenticado
    const unidade = await unidadeRepository.obterUnidadePorId(id);
    if (!unidade) {
      return res.status(404).json({ message: 'Unidade de moradia não encontrada.' });
    }
    // verificando se a unidade pertence ao locador autenticado
    if (unidade.Imovel?.locador_cpf !== req.user.cpf) { // descobri que se colocar ?  depois de Imovel, aí não dá erro se Imovel for null ou undefined (não devia ser, mas só pra garantir)
      return res.status(403).json({ message: 'Sem permissão para atualizar essa unidade' });
    }

    // se estiver alterando o imóvel, temos que verificar se o novo imóvel pertence ao locador autenticado
    if (id_imovel != unidade.id_imovel) { // !==
      const novoImovel = await imovelRepository.obterImovelPorId(id_imovel);
      if (!novoImovel) {
        return res.status(404).json({ message: 'Imóvel não encontrado' });
      }
      if (novoImovel.locador_cpf !== req.user.cpf) {
        return res.status(403).json({ message: 'Sem permissão para mover a unidade para esse imóvel' });
      }
    }

    // verificando se id_categoria_um existe (se for informado)
    if (id_categoria_um) {
      const categoria = await unidadeRepository.obterCategoriaPorId(id_categoria_um);
      if (!categoria) {
        return res.status(404).json({ message: 'Categoria não encontrada' });
      }
    }

    const unidade_atualizada = await unidadeRepository.atualizarUnidade({ 
        id,  
        nome_um, 
        preco_aluguel, 
        descricao, 
        id_imovel, 
        id_categoria_um, 
        completo 
      }
    );
    
    // if (unidade_atualizada) {
    //   return res.status(200).json(unidade_atualizada);
    // } else {
    //   return res.status(404).json({ message: 'Unidade de moradia não encontrada.' });
    // }
    return res.status(200).json(unidade_atualizada);

  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

const mudaDisponibilidade = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const locador_cpf = req.user.cpf;

    // verificando se a unidade existe
    const unidade = await unidadeRepository.obterUnidadePorId(id);
    if (!unidade) {
      return res.status(404).json({ message: "Unidade não encontrada" });
    }

    // verificando se a unidade pertence ao locador autenticado
    // const imovel = await imovelRepository.obterImovelPorId(unidade.id_imovel);
    // if (imovel.locador_cpf !== locador_cpf) {
    //   return res.status(403).json({ message: "Sem permissão para alterar a disponibilidade dessa unidade" });
    // }
    if (unidade.Imovel.locador_cpf !== locador_cpf) { // fiz pra unidade já vir com Imovel incluído
      return res.status(403).json({ message: "Sem permissão para alterar a disponibilidade dessa unidade" });
    }
    
    if (unidade.disponivel === false) {
      // verificando se existe contrato ativo associado à unidade
      const tem_contrato_ativo = await contratoRepository.existeContratoAtivoNaUnidade(id);
      if (tem_contrato_ativo) {
        return res.status(409).json({ message: "Não é possível disponibilizar a unidade, pois existe um contrato ativo associado a ela." });
      }
    }
    
    const unidade_atualizada = await unidadeRepository.atualizarUnidade({
      id,
      nome_um: unidade.nome_um,
      preco_aluguel: unidade.preco_aluguel,
      descricao: unidade.descricao,
      id_imovel: unidade.id_imovel,
      id_categoria_um: unidade.id_categoria_um,
      completo: unidade.completo,
      disponivel: !unidade.disponivel // só esse muda
    });

    return res.status(200).json(unidade_atualizada);

  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

// :)
const deletaUnidade = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const locador_cpf = req.user.cpf;
    
    // verificando se a unidade existe (já vem com Imovel incluído)
    const unidade = await unidadeRepository.obterUnidadePorId(id);
    if (!unidade) {
      return res.status(404).json({ message: 'Unidade não encontrada' });
    }

    // verificando se a unidade pertence ao locador autenticado
    // verificando se o imóvel da unidade pertence ao locador autenticado => temos que fazer assim pq a unidade não tem locador_cpf
    // const imovel = await imovelRepository.obterImovelPorId(unidade.id_imovel);
    // if (imovel.locador_cpf !== locador_cpf) {
    //   return res.status(403).json({ message: 'Sem permissão para deletar essa unidade' });
    // }
    if (unidade.Imovel.locador_cpf !== locador_cpf) {
      return res.status(403).json({ message: 'Sem permissão para deletar essa unidade' });
    }

    await unidadeRepository.deletarUnidade(id);
    
    return res.status(200).json({ message: 'Unidade removida com sucesso', unidade: unidade }); // se a função executar sem lançar erro, é pq deletou com sucesso // se algo der errado, cai no catch
    
  } catch (error) {
    // Erro de restrição de chave estrangeira (contratos associados)
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(409).json({ 
        message: "Não é possível deletar esta unidade, pois ela possui contratos associados",
        error: "Integridade referencial violada"
      });
    }
    console.error("Erro ao deletar unidade:", error);
    return res.status(500).json({ message: "Erro ao deletar unidade" });
  }
};

// :)
const listaContratosDaUnidade = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const locador_cpf = req.user.cpf;

    // verificando se a unidade existe
    const unidade = await unidadeRepository.obterUnidadePorId(id);
    if (!unidade) {
      return res.status(404).json({ message: 'Unidade não encontrada' });
    }

    // verificando se a unidade pertence ao locador autenticado
    // const imovel = await imovelRepository.obterImovelPorId(unidade.id_imovel);
    // if (imovel.locador_cpf !== locador_cpf) {
    //   return res.status(403).json({ message: 'Sem permissão para visualizar os contratos dessa unidade' });
    // }
     if (unidade.Imovel.locador_cpf !== locador_cpf) {
      return res.status(403).json({ message: 'Sem permissão para visualizar os contratos dessa unidade' });
    }

    const result = await contratoRepository.listarContratosDaUnidade(id);

    return res.status(200).json(result);

  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

module.exports = {
  listaUnidadesLocador,
  listaTodasAsUnidadesPublicoGeral,
  retornaUnidadePorId,
  criaUnidade,
  uploadFoto,
  atualizaUnidade,
  mudaDisponibilidade,
  deletaUnidade,
  listaContratosDaUnidade,
};
