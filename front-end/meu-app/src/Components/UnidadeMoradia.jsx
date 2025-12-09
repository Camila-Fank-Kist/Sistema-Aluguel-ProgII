import { useState, useEffect } from "react";
import axios from "axios";
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ListAltIcon from '@mui/icons-material/ListAlt';
import Stack from '@mui/material/Stack';
import { Box, Typography, TextField, MenuItem, Select, FormControl, InputLabel, Chip, Switch, FormControlLabel } from '@mui/material';

export default function UnidadeMoradia({ tipoUsuario }) {
    
    // tipoUsuario pode ser "locador", "inquilino" ou "publico"
    const isLocador = (tipoUsuario === "locador") ? true : false;
    const isPublico = (tipoUsuario === "publico" || tipoUsuario === "inquilino") ? true : false;

    const [unidades, setUnidades] = useState([]);
    const [unidadeSelecionada, setUnidadeSelecionada] = useState(null);
    const [contratosDaUnidade, setContratosDaUnidade] = useState([]);

    // id da unidade:
    const [id__unidade, setId__unidade] = useState("");
    // estados do formulário:
    const [nome_um__unidade, setNome_um__unidade] = useState("");
    const [preco_aluguel__unidade, setPreco_aluguel__unidade] = useState("");
    const [descricao__unidade, setDescricao__unidade] = useState("");
    const [id_imovel__unidade, setId_imovel__unidade] = useState("");
    const [id_categoria_um__unidade, setId_categoria_um__unidade] = useState("");
    const [completo__unidade, setCompleto__unidade] = useState(false);
    
    
    // para controlar se estamos editando ou criando:
    const [editando, setEditando] = useState(false);
    // para controlar o que mostrar na tela:
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [mostrarDetalhes, setMostrarDetalhes] = useState(false);
    const [mostrarContratos, setMostrarContratos] = useState(false); // AAA

    // para guardar os valores dos filtros 
    const [filtroDisponivel, setFiltroDisponivel] = useState("");
    const [filtroIdImovel, setFiltroIdImovel] = useState("");
    const [filtroIdCategoria, setFiltroIdCategoria] = useState("");
    const [filtroNome, setFiltroNome] = useState("");
    const [filtroPrecoMin, setFiltroPrecoMin] = useState("");
    const [filtroPrecoMax, setFiltroPrecoMax] = useState("");
    const [filtroCidade, setFiltroCidade] = useState("");
    const [filtroPublico, setFiltroPublico] = useState("");

    const [categorias, setCategorias] = useState([]);

    const publicosAlvo = ["Feminino", "Masculino", "Familiar", "Estudantes"];

    const pegarToken = () => localStorage.getItem("token");

    const buscarCategorias = async () => {
        try {
            const response = await axios.get("http://localhost:3002/unidade-moradia/categorias");
            setCategorias(response.data);
        } catch (error) {
            console.log("Erro ao buscar categorias:", error);
        }
    };

    // :)
    const buscarUnidades = async () => {
        try {
            const token = pegarToken();
            const url = isLocador 
                ? "http://localhost:3002/unidade-moradia/locador" 
                : "http://localhost:3002/unidade-moradia/publico-geral";

            const filtros = {};

            // filtros pra todos
            if (filtroDisponivel !== "") {
                filtros.disponivel = filtroDisponivel;
            }
            if (filtroNome) {
                filtros.nome_um = filtroNome;
            }

            // filtros pra locador
            if (isLocador) {
                if (filtroIdImovel) {
                    filtros.id_imovel = filtroIdImovel;
                }
                if (filtroIdCategoria) {
                    filtros.id_categoria_um = filtroIdCategoria;
                }
            } else {
                // filtros para público geral/inquilino
                if (filtroIdCategoria) filtros.id_categoria_um = filtroIdCategoria;
                if (filtroPrecoMin) filtros.preco_min = filtroPrecoMin;
                if (filtroPrecoMax) filtros.preco_max = filtroPrecoMax;
                if (filtroCidade) filtros.cidade = filtroCidade;
                if (filtroPublico) filtros.publico = filtroPublico;
            }

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
                params: filtros
            });

            console.log("Unidades:", response.data);
            setUnidades(response.data);

        } catch (error) {
            console.log("Erro (buscar unidades):", error);
        }
    };

    // :)
    const buscarUnidadePorId = async (id) => {
        try {
            const response = await axios.get(`http://localhost:3002/unidade-moradia/${id}`);
            console.log("Unidade:", response.data);
            setUnidadeSelecionada(response.data);
            setMostrarDetalhes(true);
            setMostrarContratos(false);
        } catch (error) {
            console.log("Erro (buscar unidade):", error);
        }
    };

    // :)
    const buscarContratosDaUnidade = async (id) => {
        try {
            const token = pegarToken();
            const response = await axios.get(`http://localhost:3002/unidade-moradia/${id}/contratos`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Contratos da unidade:", response.data);
            setContratosDaUnidade(response.data);
            setMostrarContratos(true);
        } catch (error) {
            console.log("Erro (buscar contratos):", error);
        }
    };

    // :)
    const cadastrarUnidade = async () => {
        try {
            const token = pegarToken();
            const response = await axios.post("http://localhost:3002/unidade-moradia", {
                nome_um: nome_um__unidade,
                preco_aluguel: preco_aluguel__unidade,
                descricao: descricao__unidade,
                id_imovel: id_imovel__unidade,
                id_categoria_um: id_categoria_um__unidade,
                completo: completo__unidade,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Unidade criada:", response.data);
            buscarUnidades();
            limparESairDoFormulario();
        } catch (error) {
            console.log("Erro ao criar unidade:", error);
        }
    };

    // :)
    const atualizarUnidade = async () => {
        try {
            const token = pegarToken();
            const response = await axios.put(`http://localhost:3002/unidade-moradia/${id__unidade}`, {
                nome_um: nome_um__unidade,
                preco_aluguel: preco_aluguel__unidade,
                descricao: descricao__unidade,
                id_imovel: id_imovel__unidade,
                id_categoria_um: id_categoria_um__unidade,
                completo: completo__unidade,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Unidade atualizada:", response.data);
            buscarUnidades();
            limparESairDoFormulario();
        } catch (error) {
            console.log("Erro (atualizar unidade):", error);
        }
    };

    // :)
    const mudarDisponibilidade = async (id) => {
        try {
            const token = pegarToken();
            const response = await axios.patch(`http://localhost:3002/unidade-moradia/${id}/disponivel`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Disponibilidade alterada:", response.data);
            buscarUnidades();
            // se estiver nos detalhes, atualiza também
            if (mostrarDetalhes && unidadeSelecionada?.id === id) {
                buscarUnidadePorId(id);
            }
        } catch (error) {
            console.log("Erro ao mudar disponibilidade:", error);
        }
    };

    // :)
    const deletarUnidade = async (id) => {
        if (!window.confirm("Tem certeza que deseja remover esta unidade?")) {
            return;
        }
        try {
            const token = pegarToken();
            const response = await axios.delete(`http://localhost:3002/unidade-moradia/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Unidade deletada:", response.data);
            buscarUnidades();
            if (mostrarDetalhes) {
                voltarParaALista();
            }
        } catch (error) {
            console.log("Erro ao deletar unidade:", error);
        }
    };


    const editarUnidade = (unidade) => {
        // estados do formulário:
        setId__unidade(unidade.id);
        setNome_um__unidade(unidade.nome_um);
        setPreco_aluguel__unidade(unidade.preco_aluguel);
        setDescricao__unidade(unidade.descricao || "");
        setId_imovel__unidade(unidade.id_imovel);
        setId_categoria_um__unidade(unidade.id_categoria_um || "");
        setCompleto__unidade(unidade.completo || false);
        // exibição tela:
        setEditando(true);
        setMostrarFormulario(true);
        setMostrarDetalhes(false);
    };

    const limparESairDoFormulario = () => {
        setId__unidade("");
        setNome_um__unidade("");
        setPreco_aluguel__unidade("");
        setDescricao__unidade("");
        setId_imovel__unidade("");
        setId_categoria_um__unidade("");
        setCompleto__unidade(false);
        // exibição tela:
        setEditando(false);
        setMostrarFormulario(false);
    };

    const abrirFormularioParaCriarNovo = () => {
        setMostrarFormulario(true);
        setMostrarDetalhes(false);
        setMostrarContratos(false);
    };

    const voltarParaALista = () => {
        setMostrarDetalhes(false);
        setMostrarFormulario(false);
        setMostrarContratos(false);
        
        setUnidadeSelecionada(null);
        setContratosDaUnidade([]);
    };


     useEffect(() => 
        {
            buscarUnidades();
            buscarCategorias(); // aqui já coloquei pra buscar as categorias ao carregar o componente
        }, 
        []
    );

    
    return (
        <>

            {/* TELA - lista de unidades */}
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
                            {isLocador ? "Suas Unidades de Moradia" : "Unidades de Moradia Disponíveis"}
                        </Typography>
                        {isLocador && (
                            <Button variant="contained" size="large" onClick={abrirFormularioParaCriarNovo} sx={{ mt: { xs: 2, sm: 0 }, width: { xs: '100%', sm: 'auto' }, backgroundColor: '#89c56e', color: '#fff', '&:hover': { backgroundColor: '#6ea04b' } }}>
                                Criar nova unidade
                            </Button>
                        )}
                    </Box>

                    {/* filtros */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Disponibilidade</InputLabel>
                            <Select
                                value={filtroDisponivel}
                                label="Disponibilidade"
                                onChange={(e) => setFiltroDisponivel(e.target.value)}
                            >
                                <MenuItem value="">Todas</MenuItem>
                                <MenuItem value="true">Disponíveis</MenuItem>
                                <MenuItem value="false">Indisponíveis</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Categoria</InputLabel>
                            <Select
                                value={filtroIdCategoria}
                                label="Categoria"
                                onChange={(e) => setFiltroIdCategoria(e.target.value)}
                            >
                                <MenuItem value="">Todas</MenuItem>
                                {categorias.map((categoria) => (
                                    <MenuItem key={categoria.id} value={categoria.id}>
                                        {categoria.nome ?? categoria.categoria_da_um}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            size="small"
                            label="Nome da Unidade"
                            value={filtroNome}
                            onChange={(e) => setFiltroNome(e.target.value)}
                            sx={{ width: 180 }}
                        />

                        {isLocador && (
                            <TextField
                                size="small"
                                label="ID do Imóvel"
                                type="number"
                                value={filtroIdImovel}
                                onChange={(e) => setFiltroIdImovel(e.target.value)}
                                sx={{ width: 120 }}
                            />
                        )}

                        {isPublico && (
                            <>
                                <TextField
                                    size="small"
                                    label="Preço Mín"
                                    type="number"
                                    value={filtroPrecoMin}
                                    onChange={(e) => setFiltroPrecoMin(e.target.value)}
                                    sx={{ width: 100 }}
                                />
                                <TextField
                                    size="small"
                                    label="Preço Máx"
                                    type="number"
                                    value={filtroPrecoMax}
                                    onChange={(e) => setFiltroPrecoMax(e.target.value)}
                                    sx={{ width: 100 }}
                                />
                                <TextField
                                    size="small"
                                    label="Cidade"
                                    value={filtroCidade}
                                    onChange={(e) => setFiltroCidade(e.target.value)}
                                    sx={{ width: 150 }}
                                />
                                <FormControl size="small" sx={{ minWidth: 130 }}>
                                    <InputLabel>Público</InputLabel>
                                    <Select
                                        value={filtroPublico}
                                        label="Público"
                                        onChange={(e) => setFiltroPublico(e.target.value)}
                                    >
                                        <MenuItem value="">Todos</MenuItem>
                                        {publicosAlvo.map((p) => (
                                            <MenuItem key={p} value={p}>{p}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </>
                        )}

                        <Button variant="outlined" onClick={buscarUnidades} sx={{ width: { xs: '100%', sm: 'auto' }, color: '#89c56e', borderColor: '#89c56e', '&:hover': { backgroundColor: 'rgba(137,197,110,0.08)' } }}>
                            Filtrar
                        </Button>
                    </Box>

                    {/* Lista de unidades */}
                    <Stack spacing={2}>
                        {unidades.length === 0 ? (
                            <Typography color="text.secondary">Nenhuma unidade encontrada.</Typography>
                        ) : (
                            unidades.map((unidade) => (
                                <Box 
                                        key={unidade.id} 
                                        sx={{ 
                                            p: 2, 
                                            border: '1px solid #e0e0e0', 
                                            borderRadius: 2,
                                            display: 'flex',
                                            flexDirection: { xs: 'column', sm: 'row' },
                                            justifyContent: { xs: 'flex-start', sm: 'space-between' },
                                            alignItems: { xs: 'flex-start', sm: 'center' },
                                            backgroundColor: unidade.disponivel ? '#fff' : '#f5f5f5',
                                            opacity: unidade.disponivel ? 1 : 0.7
                                        }}
                                    >
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {unidade.nome_um}
                                        </Typography>
                                        
                                        <Typography variant="body2" color="text.secondary">
                                            {(() => {
                                                if (!categorias || categorias.length === 0) return "N/A";
                                                const cat = categorias.find((c) => {
                                                    const cid = c.id;
                                                    return cid === unidade.id_categoria_um || String(cid) === String(unidade.id_categoria_um);
                                                });
                                                return cat ? (cat.nome ?? cat.categoria_da_um ?? "N/A") : "N/A";
                                            })()} | R$ {unidade.preco_aluguel}/mês
                                        </Typography>
                                        {unidade.Imovel && (
                                            <Typography variant="body2" color="text.secondary">
                                                {unidade.Imovel.nome_imovel} - {unidade.Imovel.endereco_cidade}
                                            </Typography>
                                        )}
                                        <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                                            <Chip 
                                                label={unidade.disponivel ? "Disponível" : "Indisponível"} 
                                                color={unidade.disponivel ? "success" : "default"}
                                                size="small"
                                            />
                                            {unidade.completo && (
                                                <Chip label="Unidade completa" size="small" sx={{ backgroundColor: '#89c56e', color: '#fff' }} />
                                            )}
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' }, width: { xs: '100%', sm: 'auto' }, mt: { xs: 2, sm: 0 } }}>
                                        <Button 
                                            variant="outlined" 
                                            startIcon={<VisibilityIcon />} 
                                            onClick={() => buscarUnidadePorId(unidade.id)}
                                            sx={{ color: '#89c56e', borderColor: '#89c56e', '&:hover': { backgroundColor: 'rgba(137,197,110,0.08)' } }}
                                        >
                                            Detalhes
                                        </Button>
                                        {isLocador && (
                                            <>
                                                <Button 
                                                    variant="contained" 
                                                    startIcon={<EditSquareIcon />} 
                                                    onClick={() => editarUnidade(unidade)}
                                                    sx={{ backgroundColor: '#89c56e', color: '#fff', '&:hover': { backgroundColor: '#6ea04b' } }}
                                                >
                                                    Editar
                                                </Button>
                                                <Button 
                                                    variant="outlined"
                                                    color={unidade.disponivel ? "warning" : "success"}
                                                    startIcon={unidade.disponivel ? <ToggleOffIcon /> : <ToggleOnIcon />}
                                                    onClick={() => mudarDisponibilidade(unidade.id)}
                                                >
                                                    {unidade.disponivel ? "Indisponibilizar" : "Disponibilizar"}
                                                </Button>
                                                <Button 
                                                    variant="outlined" 
                                                    color="error"
                                                    startIcon={<DeleteIcon />} 
                                                    onClick={() => deletarUnidade(unidade.id)}
                                                >
                                                    Remover
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

            {/* TELA - detalhes da unidade */}
            {mostrarDetalhes && unidadeSelecionada && (
                <>
                    <Box sx={{ mb: 3 }}>
                        <Button variant="text" onClick={voltarParaALista} sx={{ width: { xs: '100%', sm: 'auto' }, color: '#89c56e' }}>
                            Voltar para a lista
                        </Button>
                    </Box>

                    <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
                        {unidadeSelecionada.nome_um}
                    </Typography>

                    <Box sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, mb: 3 }}>
                        <Stack spacing={2}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Chip 
                                    label={unidadeSelecionada.disponivel ? "Disponível" : "Indisponível"} 
                                    color={unidadeSelecionada.disponivel ? "success" : "default"}
                                />
                                {unidadeSelecionada.completo && (
                                    <Chip label="Unidade completa" color="info" />
                                )}
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">Preço do Aluguel</Typography>
                                <Typography variant="h5">R$ {unidadeSelecionada.preco_aluguel}/mês</Typography>
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">Categoria</Typography>
                                <Typography>{(() => {
                                    if (!categorias || categorias.length === 0) return "N/A";
                                    const cat = categorias.find((c) => {
                                        const cid = c.id;
                                        return cid === unidadeSelecionada.id_categoria_um || String(cid) === String(unidadeSelecionada.id_categoria_um);
                                    });
                                    return cat ? (cat.nome ?? cat.categoria_da_um ?? "N/A") : "N/A";
                                })()}</Typography>
                            </Box>

                            {unidadeSelecionada.descricao && (
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Descrição</Typography>
                                    <Typography>{unidadeSelecionada.descricao}</Typography>
                                </Box>
                            )}

                            {unidadeSelecionada.Imovel && (
                                <>
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">Imóvel</Typography>
                                        <Typography>{unidadeSelecionada.Imovel.nome_imovel}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">Endereço</Typography>
                                        <Typography>
                                            {unidadeSelecionada.Imovel.endereco_rua}, {unidadeSelecionada.Imovel.endereco_numero}
                                            {unidadeSelecionada.Imovel.endereco_bairro && ` - ${unidadeSelecionada.Imovel.endereco_bairro}`}
                                            {unidadeSelecionada.Imovel.endereco_cidade && `, ${unidadeSelecionada.Imovel.endereco_cidade}`}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">Público Alvo</Typography>
                                        <Typography>{unidadeSelecionada.Imovel.publico || "Não especificado"}</Typography>
                                    </Box>
                                </>
                            )}
                        </Stack>
                    </Box>

                    {/* botões de ação (só pro locador) */}
                    {isLocador && (
                        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, mt: 2, width: '100%' }}>
                            <Button 
                                variant="contained" 
                                startIcon={<EditSquareIcon />} 
                                onClick={() => editarUnidade(unidadeSelecionada)}
                                sx={{ width: { xs: '100%', sm: 'auto' }, backgroundColor: '#89c56e', color: '#fff', '&:hover': { backgroundColor: '#6ea04b' } }}
                            >
                                Editar Unidade
                            </Button>
                            <Button 
                                variant="outlined"
                                color={unidadeSelecionada.disponivel ? "warning" : "success"}
                                startIcon={unidadeSelecionada.disponivel ? <ToggleOffIcon /> : <ToggleOnIcon />}
                                onClick={() => mudarDisponibilidade(unidadeSelecionada.id)}
                                sx={{ width: { xs: '100%', sm: 'auto' } }}
                            >
                                {unidadeSelecionada.disponivel ? "Indisponibilizar" : "Disponibilizar"}
                            </Button>
                            <Button 
                                variant="outlined" 
                                startIcon={<ListAltIcon />}
                                onClick={() => buscarContratosDaUnidade(unidadeSelecionada.id)}
                                sx={{ width: { xs: '100%', sm: 'auto' }, color: '#89c56e', borderColor: '#89c56e', '&:hover': { backgroundColor: 'rgba(137,197,110,0.08)' } }}
                            >
                                Ver Contratos
                            </Button>
                            <Button 
                                variant="outlined" 
                                color="error"
                                startIcon={<DeleteIcon />} 
                                onClick={() => deletarUnidade(unidadeSelecionada.id)}
                                sx={{ width: { xs: '100%', sm: 'auto' } }}
                            >
                                Remover Unidade
                            </Button>
                        </Box>
                    )}
                </>
            )}

            {/* lista de contratos da unidade */}
            {mostrarContratos && unidadeSelecionada && (
                <>
                    <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 3, mt: 5 }}>
                        Contratos da Unidade: {unidadeSelecionada.nome_um}
                    </Typography>

                    <Stack spacing={2}>
                        {contratosDaUnidade.length === 0 ? (
                            <Typography color="text.secondary">Nenhum contrato encontrado para esta unidade.</Typography>
                        ) : (
                            contratosDaUnidade.map((contrato) => (
                                <Box 
                                    key={contrato.id} 
                                    sx={{ 
                                        p: 2, 
                                        border: '1px solid #e0e0e0', 
                                        borderRadius: 2,
                                        backgroundColor: contrato.contrato_ativo ? '#fff' : '#f5f5f5'
                                    }}
                                >
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        Contrato #{contrato.id}
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
                            ))
                        )}
                    </Stack>
                </>
            )}

            {/* TELA - formulário de criação/edição */}
            {mostrarFormulario && isLocador && (
                <>
                    <Box sx={{ mb: 3 }}>
                        <Button variant="text" onClick={limparESairDoFormulario} sx={{ width: { xs: '100%', sm: 'auto' }, color: '#89c56e' }}>
                            Voltar para a lista
                        </Button>
                    </Box>

                    <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
                        {editando ? "Editar Unidade de Moradia" : "Criar Nova Unidade de Moradia"}
                    </Typography>

                    <Box sx={{ maxWidth: 500 }}>
                        <Stack spacing={3}>
                            {/* Nome da Unidade */}
                            <TextField
                                label="Nome da Unidade *"
                                value={nome_um__unidade}
                                onChange={(e) => setNome_um__unidade(e.target.value)}
                                placeholder="Ex: Quarto 101, Kitnet A"
                                fullWidth
                            />

                            {/* Preço do Aluguel */}
                            <TextField
                                label="Preço do Aluguel *"
                                type="number"
                                value={preco_aluguel__unidade}
                                onChange={(e) => setPreco_aluguel__unidade(e.target.value)}
                                placeholder="0.00"
                                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                                fullWidth
                            />

                            {/* Imóvel: inserir ID manualmente */}
                            <TextField
                                label="ID do Imóvel *"
                                type="number"
                                value={id_imovel__unidade}
                                onChange={(e) => setId_imovel__unidade(e.target.value)}
                                placeholder="Digite o ID do imóvel"
                                fullWidth
                            />

                            {/* Categoria */}
                            <FormControl fullWidth>
                                <InputLabel>Categoria</InputLabel>
                                <Select
                                    value={id_categoria_um__unidade}
                                    label="Categoria"
                                    onChange={(e) => setId_categoria_um__unidade(e.target.value)}
                                >
                                    <MenuItem value="">Nenhuma</MenuItem>
                                    {categorias.map((cat) => (
                                        <MenuItem key={cat.id} value={cat.id}>
                                            {cat.nome}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Descrição */}
                            <TextField
                                label="Descrição"
                                value={descricao__unidade}
                                onChange={(e) => setDescricao__unidade(e.target.value)}
                                placeholder="Descrição da unidade..."
                                multiline
                                rows={3}
                                fullWidth
                            />

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={completo__unidade}
                                        onChange={(e) => setCompleto__unidade(e.target.checked)}
                                    />
                                }
                                label="Unidade completa"
                            />

                            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                <Button 
                                    variant="contained" 
                                    onClick={editando ? atualizarUnidade : cadastrarUnidade}
                                    disabled={!nome_um__unidade || !preco_aluguel__unidade || !id_imovel__unidade}
                                    sx={{ width: { xs: '100%', sm: 'auto' }, backgroundColor: '#89c56e', color: '#fff', '&:hover': { backgroundColor: '#6ea04b' } }}
                                >
                                    {editando ? "Atualizar" : "Criar Unidade"}
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
