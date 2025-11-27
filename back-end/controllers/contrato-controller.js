// dúvida:

const express = require("express");
const contratoService = require("../services/contrato-service");

const contratoRouter = express.Router();

// rota só pro locador:
// POST /contrato - Criar novo contrato
contratoRouter.post("/", contratoService.criarContrato); // lembrar que ao criar um contrato, tem que mudar o campo "disponivel" da unidade de moradia
// e se a unidade já estiver ocupada, não pode criar o contrato

// rota para os dois:
// GET /contrato - Listar todos os contratos 
contratoRouter.get("/", contratoService.listarTodosOsContratos);
// para o inquilino, listar todos os contratos dele (onde inquilino_cpf é o cpf do inquilino)
// para o locador, listar todos os contratos das unidades de moradia dos imóveis que ele possui
// dúvida: ou fazemos assim?:
    // contratoRouter.get("/:id_usuario", contratoService.listarTodosOsContratos);
    // pergunto isso pois todas as operações que vamos fazer aqui, vai ser para um locador específico (ou para um inquilino específico). Sendo assim, tem que ter o id do locador (ou do inquilino) (ou do usuario) nas rotas? Ou não precisa e isso é feito automaticamente com a autenticação (ou seja, mesmo que a gente faça o get só com "/", ele vai saber que é do locador ou do inquilino específico que está logado? Ou temos que especificar na rota?)? 
// outra dúvida: além disso, fazemos tudo isso nessa mesma rota ("/" ou "/:id_usuario"), e daí dentro da rota verificamos se é locador ou inquilino? ou criamos rotas duplicadas específicas para locador e inquilino, tipo:?
    // assim para o locador:
        // GET /contrato/locador/:cpf_locador - Listar contratos de um locador (proprietário)
        // contratoRouter.get("/locador/:cpf_locador", contratoService.listarContratosPorLocador);
    // e assim para o inquilino:
        // GET /contrato/inquilino/:cpf_inquilino - Listar contratos de um inquilino
        // contratoRouter.get("/inquilino/:cpf_inquilino", contratoService.listarContratosPorInquilino);

// PUT /contrato/:id - Atualizar contrato
contratoRouter.put("/:id", contratoService.atualizarContrato); 
// dúvida: a gente pode alterar "contrato_ativo" no update? ou tem que criar uma rota específica para encerrar o contrato?
// se puder alterar no update (acho que assim é melhor, né? ou não?):
    // lembrar que se o locador for alterar os campos "data_fim" e/ou "contrato_ativo", tem que mudar também o campo "disponivel" da unidade de moradia
    // e não pode atualizar contrato_ativo de false para true em uma unidade que já está ocupada
// daí se formos criar uma rota específica para encerrar o contrato, seria tipo assim?:
    // POST /contrato/:id/encerrar - Encerrar contrato
    // contratoRouter.post("/:id/encerrar", contratoService.encerrarContrato);

// dúvidas:
// vamos deixar alterar a data_inicio?  
// uma vez que o contrato for encerrado, não vai ser possível reativar ele nem fazer qualquer alteração, certo? Ou tem que permitir?

// DELETE /contrato/:id - Remover contrato
// contratoRouter.delete("/:id", contratoService.deletarContrato);
// dúvida: não vamos deixar excluir, certo? Ou precisamos deixar excluir?

// GET /contrato/:id - Detalhar contrato por id
contratoRouter.get("/:id", contratoService.retornarContratoPorId);


// uma dúvida: se formos permitir buscar os contratos por FILTROS, temos que criar um get para cada filtro? ou é tudo no mesmo get geral ("/"), e daí só mudamos os parâmetros que passamos para a função de listagem?
// ex de rota específica:
// GET /contrato/ativos - Listar contratos ativos
// contratoRouter.get("/ativos", contratoService.listarContratosAtivos);


// GET /contrato/unidade/:id_unidade - Listar os contratos de uma unidade de moradia
contratoRouter.get("/unidade/:id_unidade", contratoService.listarContratosPorUnidade);
// dúvida: essa rota para pegar os contratos de uma unidade específica, colocamos aqui mesmo? ou colocamos em unidade_moradia-controller?
// mesma dúvida para pegar as unidades de moradia do imóvel: colocamos em imovel-controller ou aqui?

// GET /contrato/inquilino/:id_inquilino - Listar os contratos de um inquilino do locador
contratoRouter.get("/inquilino/:id_inquilino", contratoService.listarContratosPorInquilino);
// dúvida:
// pensei nisso para aparecer para o locador todos os contratos que um inquilino específico tem com um locador
// daí essa rota seria só para o locador
// ou seria talvez?:
    // GET /contrato/locador/:cpf_locador/inquilino/:id_inquilino - Listar contratos de um inquilino específico de um locador específico
    // contratoRouter.get("/locador/:cpf_locador/inquilino/:id_inquilino", contratoService.listarContratosPorInquilino);


module.exports = contratoRouter;