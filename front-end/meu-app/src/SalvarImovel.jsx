//Atua tanto na edição quanto na adição de um imóvel
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Typography,
  TextField,
  Box,
  AppBar,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Toolbar,
  Alert,
  Snackbar,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import React, { useState } from "react";

function InsercaoImovel({
  nome_imovel,
  setNome_imovel,
  regras_convivencia,
  setRegras_convivencia,
  publico,
  setPublico,
  endereco_rua,
  setEndereco_rua,
  endereco_numero,
  setEndereco_numero,
  endereco_bairro,
  setEndereco_bairro,
  endereco_cidade,
  setEndereco_cidade,
  endereco_estado,
  setEndereco_estado,
  endereco_pais,
  setEndereco_pais,
  endereco_complemento,
  setEndereco_complemento,
  endereco_cep,
  setEndereco_cep,
  id_tipo,
  setId_tipo,
  proximaFuncao,
}) {
  const navigate = useNavigate();
  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <TextField
        label="Nome do Imóvel"
        fullWidth
        value={nome_imovel}
        onChange={(e) => setNome_imovel(e.target.value)}
      />
      <TextField
        label="Regras de convivência"
        fullWidth
        value={regras_convivencia}
        onChange={(e) => setRegras_convivencia(e.target.value)}
      />
      <TextField
        label="Público"
        fullWidth
        value={publico}
        onChange={(e) => setPublico(e.target.value)}
      />
      <TextField
        label="Rua"
        fullWidth
        value={endereco_rua}
        onChange={(e) => setEndereco_rua(e.target.value)}
      />
      <TextField
        label="Número"
        fullWidth
        value={endereco_numero}
        onChange={(e) => setEndereco_numero(e.target.value)}
      />
      <TextField
        label="Bairro"
        fullWidth
        value={endereco_bairro}
        onChange={(e) => setEndereco_bairro(e.target.value)}
      />
      <TextField
        label="Complemento"
        fullWidth
        value={endereco_complemento}
        onChange={(e) => setEndereco_complemento(e.target.value)}
      />
      <TextField
        label="CEP"
        fullWidth
        value={endereco_cep}
        onChange={(e) => setEndereco_cep(e.target.value)}
      />
      <TextField
        label="Cidade"
        fullWidth
        value={endereco_cidade}
        onChange={(e) => setEndereco_cidade(e.target.value)}
      />
      <TextField
        label="Estado"
        fullWidth
        value={endereco_estado}
        onChange={(e) => setEndereco_estado(e.target.value)}
      />
      <TextField
        label="País"
        fullWidth
        value={endereco_pais}
        onChange={(e) => setEndereco_pais(e.target.value)}
      />
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <InputLabel id="demo-select-small-label">Tipo</InputLabel>
        <Select
          labelId="demo-select-small-label"
          id="demo-select-small"
          value={id_tipo}
          label="Tipo"
          onChange={(e) => setId_tipo(e.target.value)}
        >
          <MenuItem value=""></MenuItem>
          <MenuItem value={1}>Kitnet</MenuItem>
          <MenuItem value={2}>Casa</MenuItem>
          <MenuItem value={3}>Pensão</MenuItem>
          <MenuItem value={4}>Apartamento</MenuItem>
        </Select>
      </FormControl>
      <Box sx={{ mt: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          variant="contained"
          type="button"
          onClick={proximaFuncao}
          disabled={
            nome_imovel === "" ||
            regras_convivencia === "" ||
            publico === "" ||
            endereco_rua === "" ||
            endereco_bairro === "" ||
            endereco_numero === "" ||
            endereco_complemento === "" ||
            endereco_cep === "" ||
            endereco_cidade === "" ||
            endereco_estado === "" ||
            endereco_pais === "" ||
            id_tipo === ""
          }
        >
          Salvar
        </Button>
        <Button variant="contained" type="button" onClick={() => navigate(-1)}>
          Cancelar
        </Button>
      </Box>
    </form>
  );
}

export default function SalvarImovel({ handleLogout }) {
  //Funções para as mensagens de atualização e cadastro do imóvel

  const navigate = useNavigate();
  const location = useLocation();
  const imovel = location.state?.imovel;

  const [nome_imovel, setNome_imovel] = useState(imovel?.nome_imovel || "");
  const [regras_convivencia, setRegras_convivencia] = useState(
    imovel?.regras_convivencia || ""
  );
  const [publico, setPublico] = useState(imovel?.publico || "");
  const [endereco_rua, setEndereco_rua] = useState(imovel?.endereco_rua || "");
  const [endereco_bairro, setEndereco_bairro] = useState(
    imovel?.endereco_bairro || ""
  );
  const [endereco_numero, setEndereco_numero] = useState(
    imovel?.endereco_numero || ""
  );
  const [endereco_cidade, setEndereco_cidade] = useState(
    imovel?.endereco_cidade || ""
  );
  const [endereco_estado, setEndereco_estado] = useState(
    imovel?.endereco_estado || ""
  );
  const [endereco_pais, setEndereco_pais] = useState(
    imovel?.endereco_pais || ""
  );
  const [endereco_cep, setEndereco_cep] = useState(imovel?.endereco_cep || "");
  const [endereco_complemento, setEndereco_complemento] = useState(
    imovel?.endereco_complemento || ""
  );
  const [id_tipo, setId_tipo] = useState(imovel?.id_tipo || "");
  const id_imovel = useState(imovel?.id || "");

  const cpf = location.state?.cpf || localStorage.getItem("cpf");
  const number = location.state?.number || localStorage.getItem("number");

  console.log("bla");
  console.log(cpf);

  const columns = [
    { field: "id", headerName: "id", width: 100 },
    {
      field: "regras_convivencia",
      headerName: "Regras de Convivência",
      width: 500,
    },
    { field: "publico", headerName: "Público", width: 400 },
    { field: "endereco_rua", headerName: "Rua do imóvel", width: 400 },
    { field: "endereco_bairro", headerName: "Bairro do imóvel", width: 400 },
    { field: "endereco_numero", headerName: "Número do imóvel", width: 400 },
    { field: "endereco_cidade", headerName: "Cidade do imóvel", width: 400 },
    { field: "endereco_estado", headerName: "Estado do imóvel", width: 400 },
    { field: "endereco_pais", headerName: "País do imóvel", width: 400 },
    { field: "endereco_cep", headerName: "CEP do imóvel", width: 400 },
    { field: "endereco_complemento", headerName: "Complemento", width: 400 },
    { field: "id_tipo", headerName: "Tipo do imóvel", width: 400 },
    {
      field: "locador_cpf",
      headerName: "CPF do locador do imóvel",
      width: 400,
    },
    { field: "nome_imovel", headerName: "Nome do imóvel", width: 400 },
  ];

  async function criarImovel() {
    try {
      const response = await axios.post("http://localhost:3002/imovel/", {
        //link do post no Insomnia
        //insere no backend os dados do novo cursos cadatrado, como foi feito no Insomnia
        nome_imovel: nome_imovel,
        regras_convivencia: regras_convivencia,
        publico: publico,
        endereco_rua: endereco_rua,
        endereco_numero: endereco_numero,
        endereco_bairro: endereco_bairro,
        endereco_cidade: endereco_cidade,
        endereco_estado: endereco_estado,
        endereco_pais: endereco_pais,
        endereco_cep: endereco_cep,
        endereco_complemento: endereco_complemento,
        id_tipo: id_tipo,
        locador_cpf: cpf,
      });
      //console.log(response.data);

      // Limpar os campos inseridos com o novo imóvel na tela
      setNome_imovel("");
      setRegras_convivencia("");
      setEndereco_numero("");
      setEndereco_rua("");
      setPublico("");
      setEndereco_bairro("");
      setEndereco_cep("");
      setEndereco_complemento("");
      setEndereco_cidade("");
      setEndereco_estado("");
      setEndereco_pais("");
      setId_tipo("");
      navigate("/imovel/:cpf"); // Volta para a lista
      return;
    } catch (error) {
      //em caso de erro
      console.log("Erro ao inserir imóvel:", error);
    }
  }

  async function editarImovel() {
    console.log("veio");
    console.log(id_imovel);
    try {
      const response = await axios.put(
        `http://localhost:3002/imovel/${cpf}/${id_imovel}/editar`, //o programa entende que se trata de um texto + variável
        {
          //link do Insomnia para o put
          //inserindo no backend a modificação recebida
          nome_imovel: nome_imovel,
          regras_convivencia: regras_convivencia,
          publico: publico,
          endereco_rua: endereco_rua,
          endereco_numero: endereco_numero,
          endereco_bairro: endereco_bairro,
          endereco_cidade: endereco_cidade,
          endereco_estado: endereco_estado,
          endereco_pais: endereco_pais,
          endereco_cep: endereco_cep,
          endereco_complemento: endereco_complemento,
          id_tipo: id_tipo,
        }
      );
      navigate("/imovel/:cpf/:id", {
        state: {
          imovel_detalhar: response.data, // Dados atualizados do backend
          cpf,
        },
        replace: true, // Substitui a entrada no histórico
      }); // Volta para a lista
    } catch (error) {
      //em caso de erro
      console.log("Erro ao modificar imóvel:", error);
    }
  }

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#89c56eff",
          paddingY: 2,
          width: "100%",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Sua casa, sua vida
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<AddCircleIcon />}
              sx={{ color: "#fff", borderColor: "#fff" }}
              onClick={() => navigate("/imovel/")}
            >
              Adicionar Imóvel
            </Button>

            <Button variant="outlined" color="error" onClick={handleLogout}>
              Sair
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      {number == 1 ? (
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Cadastrar Imóvel
          </Typography>
          <InsercaoImovel
            nome_imovel={nome_imovel}
            setNome_imovel={setNome_imovel}
            regras_convivencia={regras_convivencia}
            setRegras_convivencia={setRegras_convivencia}
            publico={publico}
            setPublico={setPublico}
            endereco_rua={endereco_rua}
            setEndereco_rua={setEndereco_rua}
            endereco_numero={endereco_numero}
            setEndereco_numero={setEndereco_numero}
            endereco_bairro={endereco_bairro}
            setEndereco_bairro={setEndereco_bairro}
            endereco_cidade={endereco_cidade}
            setEndereco_cidade={setEndereco_cidade}
            endereco_estado={endereco_estado}
            setEndereco_estado={setEndereco_estado}
            endereco_pais={endereco_pais}
            setEndereco_pais={setEndereco_pais}
            endereco_cep={endereco_cep}
            setEndereco_cep={setEndereco_cep}
            endereco_complemento={endereco_complemento}
            setEndereco_complemento={setEndereco_complemento}
            id_tipo={id_tipo}
            setId_tipo={setId_tipo}
            proximaFuncao={criarImovel}
          />
        </Box>
      ) : (
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Modificar Imóvel
          </Typography>

          <InsercaoImovel
            nome_imovel={nome_imovel}
            setNome_imovel={setNome_imovel}
            regras_convivencia={regras_convivencia}
            setRegras_convivencia={setRegras_convivencia}
            publico={publico}
            setPublico={setPublico}
            endereco_rua={endereco_rua}
            setEndereco_rua={setEndereco_rua}
            endereco_numero={endereco_numero}
            setEndereco_numero={setEndereco_numero}
            endereco_bairro={endereco_bairro}
            setEndereco_bairro={setEndereco_bairro}
            endereco_cidade={endereco_cidade}
            setEndereco_cidade={setEndereco_cidade}
            endereco_estado={endereco_estado}
            setEndereco_estado={setEndereco_estado}
            endereco_pais={endereco_pais}
            setEndereco_pais={setEndereco_pais}
            endereco_cep={endereco_cep}
            setEndereco_cep={setEndereco_cep}
            endereco_complemento={endereco_complemento}
            setEndereco_complemento={setEndereco_complemento}
            id_tipo={id_tipo}
            setId_tipo={setId_tipo}
            proximaFuncao={editarImovel}
          />
        </Box>
      )}
      ;
    </>
  );
}
