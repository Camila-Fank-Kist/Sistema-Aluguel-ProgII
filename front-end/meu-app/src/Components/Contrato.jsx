import { useState, useEffect } from "react";
import axios from "axios";
import Button from '@mui/material/Button';
// import DeleteIcon from '@mui/icons-material/Delete';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Stack from '@mui/material/Stack';
import { Box, Typography, TextField, MenuItem, Select, FormControl, InputLabel, Chip } from '@mui/material';

export default function Contrato({ tipoUsuario }) {

    // para controlar o que vai ser mostrado e chamado:
    const isLocador = (tipoUsuario === "locador") ? true : false;
    // const isInquilino = tipoUsuario === "inquilino";

    // vai armazenar o get dos cursos:
    const [contratos, setContratos] = useState([]);
    // vai armazenar o contrato que retorna de obterContratoPorId:
    const [contratoSelecionado, setContratoSelecionado] = useState(null);

    // para identificar qual contrato está sendo editado na edição:
    const [id__contrato, setId__contrato] = useState("");
    // estados do formulário:
    const [id_um__contrato, setId_um__contrato] = useState("");
    const [inquilino_cpf__contrato, setInquilino_cpf__contrato] = useState("");
    const [preco__contrato, setPreco__contrato] = useState("");
    const [pdf__contrato, setPdf__contrato] = useState("");

    const [unidadesDisponiveis, setUnidadesDisponiveis] = useState([]);

    // pra selecionar no filtro:
    const [unidadesParaFiltro, setUnidadesParaFiltro] = useState([]);

    // para controlar se estamos editando ou criando:
    const [editando, setEditando] = useState(false);

    // para controlar o que vai ser mostrado na tela (lista, detalhes ou formulário):
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [mostrarDetalhes, setMostrarDetalhes] = useState(false);

    // guardam os valores dos filtros: 
    const [filtroContratoAtivo, setFiltroContratoAtivo] = useState(""); // "" é considerado false no js
    const [filtroIdUm, setFiltroIdUm] = useState("");
    const [filtroInquilinoCpf, setFiltroInquilinoCpf] = useState("");


    // função para ser mais simples pegar o token do localStorage (que é o token do usuário logado):
    const pegarToken = () => { 
        return localStorage.getItem("token"); 
    };

    // :)
    const buscarContratos = async () => {
        try {
            const token = pegarToken();
            const url = isLocador ? "http://localhost:3002/contrato/locador" : "http://localhost:3002/contrato/inquilino"; // inicialmente tinha pensado em criar botões diferentes para isso, mas achei mais simples fazer assim depois

            const filtros = {};

            if (filtroContratoAtivo !== "") { // se o usuario são tiver selecionado nada, ou tiver selecionado a opção "todos", NÃO entra no if // não dá pra colocar só if (filtroContratoAtivo), pq se o valor for "false", não entra no if tbm
                filtros.contrato_ativo = filtroContratoAtivo;
            }
            if (filtroIdUm) {
                filtros.id_um = filtroIdUm;
            }
            if (filtroInquilinoCpf && isLocador) {
                filtros.inquilino_cpf = filtroInquilinoCpf;
            }

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }, 
                params: filtros // o axios transforma o objeto na string do QUERY automaticamente
            });

            console.log("Contratos:", response.data);
            setContratos(response.data);

        } catch (error) {
            console.log("Erro (contratos):", error);
        }
    };

    // :)
    const buscarContratoPorId = async (id) => {
        try {
            const token = pegarToken();
            const response = await axios.get(`http://localhost:3002/contrato/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Contrato: ", response.data);
            setContratoSelecionado(response.data);
            setMostrarDetalhes(true);
        } catch (error) {
            console.log("Erro (buscar contrato):", error);
            // erros específicos tratados e enviados pelo service:
            if (error.response?.status === 403) {
                console.log("Sem permissão para visualizar esse contrato.");
            } else if (error.response?.status === 404) {
                console.log("Contrato não encontrado.");
            }
        }
    };

    // :)
    const buscarUnidadesDisponiveisParaFormulario = async (unidadeDoContratoQueTaSendoEditado = null) => {
        try {
            const token = pegarToken();
            const response = await axios.get("http://localhost:3002/unidade-moradia/locador?disponivel=true", {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            let listaUnidadesDisponiveis = response.data;

            // para quando estiver editando um contrato, incluir a unidade do contrato que está sendo editado
            if (unidadeDoContratoQueTaSendoEditado) {
                listaUnidadesDisponiveis.push(unidadeDoContratoQueTaSendoEditado);
            }

            console.log("Unidades disponíveis:", listaUnidadesDisponiveis);
            setUnidadesDisponiveis(listaUnidadesDisponiveis);

        } catch (error) {
            console.log("Erro (buscar unidades):", error);
        }
    };

    // :)
    const buscarUnidadesParaFiltro = async () => {
        try {
            const token = pegarToken();
            const response = await axios.get("http://localhost:3002/unidade-moradia/locador", {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Unidades pro filtro:", response.data);
            setUnidadesParaFiltro(response.data);
        } catch (error) {
            console.log("Erro (unidades de moradia pro filtro): ", error);
        }
    };

    // :)
    const cadastrarContrato = async () => {
        try {
            const token = pegarToken();
            const response = await axios.post("http://localhost:3002/contrato", {
                id_um: id_um__contrato,
                inquilino_cpf: inquilino_cpf__contrato,
                preco: preco__contrato,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Contrato criado:", response.data);
            buscarContratos();
            limparESairDoFormulario();
        } catch (error) {
            console.log("Erro (cadastrar contrato):", error);
            if (error.response?.status === 400) {
                if (error.response.data.message == "Unidade de moradia, inquilino e preço são obrigatórios.") {
                    console.log("Unidade de moradia, inquilino e preço são obrigatórios.");
                } else if (error.response.data.message == "Unidade de moradia não está disponível para locação.") {
                    console.log("Unidade de moradia não está disponível para locação.");
                }
            } 
            else if (error.response?.status === 404) {
                if (error.response.data.message == "Unidade de moradia não encontrada.") {
                    console.log("Unidade de moradia não encontrada.");
                } else if (error.response.data.message == "Inquilino não encontrado.") {
                    console.log("Inquilino não encontrado.");
                }
            }
            else if (error.response?.status === 403) {
                console.log("Sem permissão para criar contrato nessa unidade.");
            }
            else if (error.response?.status === 409) {
                console.log("Não é possível criar um contrato nessa unidade, pois a unidade está indisponível.");
            }
        }
    };

    // :)
    const atualizarContrato = async () => {
        try {
            const token = pegarToken();
            const response = await axios.put(`http://localhost:3002/contrato/${id__contrato}`, {
                id_um: id_um__contrato,
                inquilino_cpf: inquilino_cpf__contrato,
                preco: preco__contrato,
                pdf: pdf__contrato || null,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Contrato atualizado:", response.data);
            buscarContratos();
            limparESairDoFormulario();
        } catch (error) {
            console.log("Erro (atualizar contrato):", error);
            if (error.response?.status === 400) {
                if (error.response.data.message == "Unidade de moradia, inquilino e preço são obrigatórios.") {
                    console.log("Unidade de moradia, inquilino e preço são obrigatórios.");
                } else if (error.response.data.message == "O preço não pode ser negativo.") {
                    console.log("O preço não pode ser negativo.");
                }
            }
            else if (error.response?.status === 404) {
                if (error.response.data.message == "Contrato não encontrado.") {
                    console.log("Contrato não encontrado.");
                } else if (error.response.data.message == "Novo inquilino não encontrado.") {
                    console.log("Novo inquilino não encontrado.");
                } else if (error.response.data.message == "Nova unidade de moradia não encontrada.") {
                    console.log("Nova unidade de moradia não encontrada.");
                }
            }
            else if (error.response?.status === 403) {
                if (error.response.data.message == "Sem permissão para atualizar esse contrato.") {
                    console.log("Sem permissão para atualizar esse contrato.");
                } else if (error.response.data.message == "Sem permissão para mover o contrato para essa unidade.") {
                    console.log("Sem permissão para mover o contrato para essa unidade.");
                }
            }
            else if (error.response?.status === 409) {
                if (error.response.data.message == "Não é possível atualizar um contrato encerrado.") {
                    console.log("Não é possível atualizar um contrato encerrado.");
                } else if (error.response.data.message == "A nova unidade está indisponível.") {
                    console.log("A nova unidade está indisponível.");
                }
            }
        }
    };

    // :)
    const encerrarContrato = async (id) => {
        if (!window.confirm("Tem certeza que deseja encerrar este contrato? Esta ação não pode ser desfeita.")) {
            return;
        }
        try {
            const token = pegarToken();
            const response = await axios.post(`http://localhost:3002/contrato/${id}/encerrar`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Contrato encerrado:", response.data);
            buscarContratos();
            setMostrarDetalhes(false);
        } catch (error) {
            console.log("Erro (encerrar contrato):", error);
            if (error.response?.status === 404) {
                console.log("Contrato não encontrado.");
            }
            else if (error.response?.status === 403) {
                console.log("Sem permissão para encerrar este contrato.");
            }
            else if (error.response?.status === 409) {
                console.log("Este contrato já está encerrado.");
            }
        }
    };


    const editarContrato = (contrato) => {
        // colocando os atributos do contrato selecionado nos estados do formulário:
        setId__contrato(contrato.id);
        setId_um__contrato(contrato.id_um);
        setInquilino_cpf__contrato(contrato.inquilino_cpf);
        setPreco__contrato(contrato.preco);
        setPdf__contrato(contrato.pdf);

        // carregar as unidades disponíveis, incluindo a unidade atual do contrato:
        buscarUnidadesDisponiveisParaFormulario(contrato.Unidade_moradia);

        // abrindo o formulário de edição:
        setEditando(true);
        setMostrarFormulario(true);
        setMostrarDetalhes(false);
    };

    const limparESairDoFormulario = () => {
        setId__contrato("");
        setId_um__contrato("");
        setInquilino_cpf__contrato("");
        setPreco__contrato("");
        setPdf__contrato("");
        setEditando(false);
        setMostrarFormulario(false);
    };

    const abrirFormularioParaCriarNovo = () => {
        setMostrarFormulario(true);
        setMostrarDetalhes(false);
        buscarUnidadesDisponiveisParaFormulario();
    };

    const voltarParaALista = () => {
        setMostrarDetalhes(false);
        setMostrarFormulario(false);
    };


    useEffect(() =>
        {
            buscarContratos();
            if (isLocador) buscarUnidadesParaFiltro();
        }, 
        []
    );


    return (
        <>

            {/* TELA - lista de contratos */}
            {!mostrarFormulario && !mostrarDetalhes && (
                <>
                    <Box sx={{ 
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        mb: 3
                    }}>
                        <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
                            {isLocador ? "Contratos das suas Unidades" : "Seus Contratos"}
                        </Typography>
                        {isLocador && (
                            <Button variant="contained" size="large" onClick={abrirFormularioParaCriarNovo} sx={{ mt: { xs: 2, sm: 0 }, width: { xs: '100%', sm: 'auto' }, backgroundColor: '#89c56e', color: '#fff', '&:hover': { backgroundColor: '#6ea04b' } }}>
                                Criar novo contrato
                            </Button>
                        )}
                    </Box>

                    {/* filtros */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={filtroContratoAtivo}
                                label="Status"
                                onChange={(e) => setFiltroContratoAtivo(e.target.value)}
                            >
                                <MenuItem value="">Todos</MenuItem>
                                <MenuItem value="true">Ativos</MenuItem>
                                <MenuItem value="false">Encerrados</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl size="small" sx={{ minWidth: 200 }}>
                            <InputLabel>Unidade</InputLabel>
                            <Select
                                value={filtroIdUm}
                                label="Unidade"
                                onChange={(e) => setFiltroIdUm(e.target.value)}
                            >
                                <MenuItem value="">Todas</MenuItem>
                                {unidadesParaFiltro.map((u) => (
                                    <MenuItem key={u.id} value={u.id}>
                                        {u.nome_um} (ID: {u.id})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {isLocador && (
                            <TextField
                                size="small"
                                label="CPF do Inquilino"
                                value={filtroInquilinoCpf}
                                onChange={(e) => setFiltroInquilinoCpf(e.target.value)}
                                sx={{ width: 180 }}
                            />
                        )}

                        <Button variant="outlined" onClick={buscarContratos} sx={{ width: { xs: '100%', sm: 'auto' }, color: '#89c56e', borderColor: '#89c56e', '&:hover': { backgroundColor: 'rgba(137,197,110,0.08)' } }}>
                            Filtrar
                        </Button>
                    </Box>

                    {/* lista de contratos */}
                    <Stack spacing={2}>
                        {contratos.length === 0 ? (
                            <Typography color="text.secondary">Nenhum contrato encontrado.</Typography>
                        ) : (
                            contratos.map((contrato) => (
                                <Box 
                                    key={contrato.id} 
                                    sx={{ 
                                        p: 2, 
                                        border: '1px solid #e0e0e0', 
                                        borderRadius: 2,
                                        display: 'flex',
                                        flexDirection: { xs: 'column', sm: 'row' },
                                        justifyContent: { xs: 'flex-start', sm: 'space-between' },
                                        alignItems: { xs: 'flex-start', sm: 'center' },
                                        backgroundColor: contrato.contrato_ativo ? '#fff' : '#f5f5f5'
                                    }}
                                >
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            Contrato - {contrato.Unidade_moradia?.nome_um || `Unidade ${contrato.id_um}`}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Inquilino: {contrato.inquilino_cpf} | Preço: R$ {contrato.preco}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Início: {contrato.data_inicio} {(contrato.data_fim) ? `| Fim: ${contrato.data_fim}` : "| Vigente"}
                                        </Typography>
                                        <Chip 
                                            label={contrato.contrato_ativo ? "Ativo" : "Encerrado"} 
                                            color={contrato.contrato_ativo ? "success" : "default"}
                                            size="small"
                                            sx={{ mt: 1 }}
                                        />
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' }, width: { xs: '100%', sm: 'auto' }, mt: { xs: 2, sm: 0 } }}>
                                        <Button 
                                            variant="outlined" 
                                            startIcon={<VisibilityIcon />} 
                                            onClick={() => buscarContratoPorId(contrato.id)}
                                            sx={{ color: '#89c56e', borderColor: '#89c56e', '&:hover': { backgroundColor: 'rgba(137,197,110,0.08)' } }}
                                        >
                                            Detalhes
                                        </Button>
                                        {isLocador && contrato.contrato_ativo && (
                                            <>
                                                <Button 
                                                    variant="contained" 
                                                    startIcon={<EditSquareIcon />} 
                                                    onClick={() => editarContrato(contrato)}
                                                    sx={{ backgroundColor: '#89c56e', color: '#fff', '&:hover': { backgroundColor: '#6ea04b' } }}
                                                >
                                                    Editar
                                                </Button>
                                                <Button 
                                                    variant="outlined" 
                                                    color="error"
                                                    startIcon={<CancelIcon />} 
                                                    onClick={() => encerrarContrato(contrato.id)}
                                                >
                                                    Encerrar
                                                </Button>
                                            </>
                                        )}
                                    </Box>
                                </Box>
                            ))
                        )}
                    </Stack>
                </>
            )}

            {/* TELA - detalhes do contrato */}
            {mostrarDetalhes && contratoSelecionado && (
                <>
                    <Box sx={{ mb: 3 }}>
                        <Button variant="text" onClick={voltarParaALista} sx={{ color: '#89c56e' }}>
                            Voltar para lista
                        </Button>
                    </Box>

                    <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
                        Detalhes do Contrato #{contratoSelecionado.id}
                    </Typography>

                    <Box sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, mb: 3 }}>
                        <Stack spacing={2}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                                <Chip 
                                    label={contratoSelecionado.contrato_ativo ? "Ativo" : "Encerrado"} 
                                    color={contratoSelecionado.contrato_ativo ? "success" : "default"}
                                />
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">Unidade de Moradia</Typography>
                                <Typography>{contratoSelecionado.Unidade_moradia?.nome_um || `ID: ${contratoSelecionado.id_um}`}</Typography>
                            </Box>

                            {contratoSelecionado.Unidade_moradia?.Imovel && (
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Imóvel</Typography>
                                    <Typography>
                                        {contratoSelecionado.Unidade_moradia.Imovel.nome_imovel} - 
                                        {contratoSelecionado.Unidade_moradia.Imovel.endereco_rua}, 
                                        {contratoSelecionado.Unidade_moradia.Imovel.endereco_numero}
                                    </Typography>
                                </Box>
                            )}

                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">Inquilino</Typography>
                                <Typography>
                                    {contratoSelecionado.Inquilino?.nome || contratoSelecionado.inquilino_cpf}
                                    {contratoSelecionado.Inquilino && ` (CPF: ${contratoSelecionado.inquilino_cpf})`}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">Preço do Aluguel</Typography>
                                <Typography>R$ {contratoSelecionado.preco}</Typography>
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">Data de Início</Typography>
                                <Typography>{contratoSelecionado.data_inicio}</Typography>
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">Data de Fim</Typography>
                                <Typography>{(contratoSelecionado.data_fim) ? contratoSelecionado.data_fim : "Vigente"}</Typography>
                            </Box>

                            {contratoSelecionado.pdf && (
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">PDF do Contrato</Typography>
                                    <Typography>{contratoSelecionado.pdf}</Typography>
                                </Box>
                            )}
                        </Stack>
                    </Box>

                    {/* Botões de ação (só para locador e contrato ativo) */}
                    {isLocador && contratoSelecionado.contrato_ativo && (
                        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, mt: 2 }}>
                            <Button 
                                variant="contained" 
                                startIcon={<EditSquareIcon />} 
                                onClick={() => editarContrato(contratoSelecionado)}
                                fullWidth={false}
                                sx={{ backgroundColor: '#89c56e', color: '#fff', '&:hover': { backgroundColor: '#6ea04b' } }}
                            >
                                Editar Contrato
                            </Button>
                            <Button 
                                variant="outlined" 
                                color="error"
                                startIcon={<CancelIcon />} 
                                onClick={() => encerrarContrato(contratoSelecionado.id)}
                                fullWidth={false}
                            >
                                Encerrar Contrato
                            </Button>
                        </Box>
                    )}
                </>
            )}

            {/* TELA - formulário de criação/edição */}
            {mostrarFormulario && isLocador && (
                <>
                    <Box sx={{ mb: 3 }}>
                        <Button variant="text" onClick={limparESairDoFormulario} sx={{ color: '#89c56e' }}>
                            Voltar para lista
                        </Button>
                    </Box>

                    <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
                        {editando ? "Editar Contrato" : "Criar Novo Contrato"}
                    </Typography>

                    <Box sx={{ maxWidth: 500 }}>
                        <Stack spacing={3}>
                            {/* Unidade de Moradia */}
                            <FormControl fullWidth>
                                <InputLabel>Unidade de Moradia *</InputLabel>
                                <Select
                                    value={id_um__contrato}
                                    label="Unidade de Moradia *"
                                    onChange={(e) => setId_um__contrato(e.target.value)}
                                >
                                    {unidadesDisponiveis.map((unidade) => (
                                        <MenuItem key={unidade.id} value={unidade.id}>
                                            {unidade.nome_um} (ID: {unidade.id}) - R$ {unidade.preco_aluguel}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* CPF do Inquilino */}
                            <TextField
                                label="CPF do Inquilino *"
                                value={inquilino_cpf__contrato}
                                onChange={(e) => setInquilino_cpf__contrato(e.target.value)}
                                placeholder="Digite o CPF do inquilino"
                                fullWidth
                            />

                            {/* Preço */}
                            <TextField
                                label="Preço do Aluguel *"
                                type="number"
                                value={preco__contrato}
                                onChange={(e) => setPreco__contrato(e.target.value)}
                                placeholder="0.00"
                                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                                fullWidth
                            />

                            {/* PDF (só na edição) */}
                            {editando && (
                                <TextField
                                    label="Link do PDF do Contrato"
                                    value={pdf__contrato}
                                    onChange={(e) => setPdf__contrato(e.target.value)}
                                    placeholder="URL do PDF"
                                    fullWidth
                                />
                            )}

                            {/* Botões */}
                            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                <Button 
                                        variant="contained" 
                                        onClick={editando ? atualizarContrato : cadastrarContrato}
                                        disabled={!id_um__contrato || !inquilino_cpf__contrato || !preco__contrato}
                                        sx={{ width: { xs: '100%', sm: 'auto' }, backgroundColor: '#89c56e', color: '#fff', '&:hover': { backgroundColor: '#6ea04b' } }}
                                    >
                                        {editando ? "Atualizar" : "Criar Contrato"}
                                    </Button>
                                    <Button variant="outlined" onClick={limparESairDoFormulario} sx={{ width: { xs: '100%', sm: 'auto' }, color: '#89c56e', borderColor: '#89c56e', '&:hover': { backgroundColor: 'rgba(137,197,110,0.08)' } }}>
                                        Cancelar
                                    </Button>
                            </Box>
                        </Stack>
                    </Box>
                </>
            )}
        </>
    );
}
