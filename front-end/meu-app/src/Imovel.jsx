import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  CardActionArea,
  TextField,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid"; //porque é um pacote específico pra esse

import { useState, useEffect } from "react";

function InsercaoImovel({
  novo_nome_imovel,
  novo_regras_convivencia,
  novo_publico,
  novo_endereco_rua,
  novo_endereco_numero,
  novo_endereco_bairro,
  novo_endereco_cidade,
  novo_endereco_estado,
  novo_endereco_pais,
  novo_endereco_complemento,
  novo_endereco_cep,
  novo_id_tipo,
  number,
}) {
  return (
    <form>
      <TextField
        label="Nome do Imóvel"
        fullWidth
        value={novo_nome_imovel}
        onChange={(e) => setNovo_nome_imovel(e.target.value)}
      />
      <TextField
        label="Regras de convivência"
        fullWidth
        value={novo_regras_convivencia}
        onChange={(e) => setNovoregras_convivencia(e.target.value)}
      />
      <TextField
        label="Público"
        fullWidth
        value={novo_publico}
        onChange={(e) => setNovo_publico(e.target.value)}
      />
      <TextField
        label="Rua"
        fullWidth
        value={novo_endereco_rua}
        onChange={(e) => setNovo_endereco_rua(e.target.value)}
      />
      <TextField
        label="Número"
        fullWidth
        value={novo_endereco_numero}
        onChange={(e) => setNovo_endereco_numero(e.target.value)}
      />
      <TextField
        label="Bairro"
        fullWidth
        value={novo_endereco_bairro}
        onChange={(e) => setNovo_endereco_bairro(e.target.value)}
      />
      <TextField
        label="Complemento"
        fullWidth
        value={novo_endereco_complemento}
        onChange={(e) => setNovo_endereco_complemento(e.target.value)}
      />
      <TextField
        label="CEP"
        fullWidth
        value={novo_endereco_cep}
        onChange={(e) => setNovo_endereco_cep(e.target.value)}
      />
      <TextField
        label="Cidade"
        fullWidth
        value={novo_endereco_cidade}
        onChange={(e) => setNovo_endereco_cidade(e.target.value)}
      />
      <TextField
        label="Estado"
        fullWidth
        value={novo_endereco_estado}
        onChange={(e) => setNovo_endereco_estado(e.target.value)}
      />
      <TextField
        label="País"
        fullWidth
        value={novo_endereco_pais}
        onChange={(e) => setNovo_endereco_pais(e.target.value)}
      />
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <InputLabel id="demo-select-small-label">Tipo</InputLabel>
        <Select
          labelId="demo-select-small-label"
          id="demo-select-small"
          value={novo_id_tipo}
          label="Tipo"
          onChange={(e) => setNovo_id_tipo(e.target.value)}
        >
          <MenuItem value="">
            <em>Apartamento</em>
          </MenuItem>
          <MenuItem value={10}>Kitnet</MenuItem>
          <MenuItem value={20}>Casa</MenuItem>
          <MenuItem value={30}>Pensão</MenuItem>
        </Select>
      </FormControl>
      <button variant="contained">
        {/*onClick={proximaFuncao}*/}
        {number === 1 ? "Cadastrar" : "Modificar"}
      </button>
    </form>
  );
}

export default function Imovel() {
  const [imovel, setImovel] = useState([]);
  const [novo_nome_imovel, setNovo_nome_imovel] = useState("");
  const [novo_regras_convivencia, setNovoregras_convivencia] = useState("");
  const [novo_publico, setNovo_publico] = useState("");
  const [novo_endereco_rua, setNovo_endereco_rua] = useState("");
  const [novo_endereco_bairro, setNovo_endereco_bairro] = useState("");
  const [novo_endereco_numero, setNovo_endereco_numero] = useState("");
  const [novo_endereco_cidade, setNovo_endereco_cidade] = useState("");
  const [novo_endereco_estado, setNovo_endereco_estado] = useState("");
  const [novo_endereco_pais, setNovo_endereco_pais] = useState("");
  const [novo_endereco_cep, setNovo_endereco_cep] = useState("");
  const [novo_endereco_complemento, setNovo_endereco_complemento] =
    useState("");
  const [novo_id_tipo, setNovo_id_tipo] = useState([]);
  const [number, setnumber] = useState("");
  const [id_imovel, setid_imovel] = useState("");
  //const [proximaFuncao, setproximaFuncao] = useState("");

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

  useEffect(() => {
    buscarImovel();
  }, []);

  const buscarImovel = async () => {
    try {
      const request = await axios.get("http://localhost:3002/imovel/todos");
      setImovel(request.data.imovel);
    } catch (error) {
      console.log(error);
    }
  };

  function mostrarImoveis() {
    buscarImovel();
    return (
      <Card sx={{ maxWidth: 345 }}>
        <CardActionArea>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Pensão das flores
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Rua: {imovel.rua}; Número: {imovel.numero}; Bairro:{" "}
              {imovel.bairro}; Cidade: {imovel.cidade}; Estado: {imovel.estado};
              País:{imovel.pais}; Tipo: {imovel.id_tipo};
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }

  function detalharImovel() {
    return (
      <Card sx={{ maxWidth: 345 }}>
        <CardActionArea>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Pensão das flores
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Rua: {imovel.endereco_rua}; Número: {imovel.endereco_numero};
              Bairro: {imovel.endereco_bairro}; Cidade: {imovel.endereco_cidade}
              ; Estado: {imovel.endereco_estado}; País:{imovel.endereco_pais};
              CEP: {imovel.endereco_cep}; Complemento:{" "}
              {imovel.endereco_complemento}Tipo: {imovel.id_tipo}; Regras de
              Convivência: {imovel.regras_convivencia}; Público:{" "}
              {imovel.publico}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }

  async function criarImovel() {
    try {
      const response = await axios.post("http://localhost:3002/imovel/", {
        //link do post no Insomnia
        //insere no backend os dados do novo cursos cadatrado, como foi feito no Insomnia
        nome_imovel: novo_nome_imovel,
        regras_convivencia: novo_regras_convivencia,
        publico: novo_publico,
        endereco_rua: novo_endereco_rua,
        endereco_numero: novo_endereco_numero,
        endereco_bairro: novo_endereco_bairro,
        endereco_cidade: novo_endereco_cidade,
        endereco_estado: novo_endereco_estado,
        endereco_pais: novo_endereco_pais,
        endereco_cep: novo_endereco_cep,
        endereco_complemento: novo_endereco_complemento,
      });
      //console.log(response.data);

      // Limpar os campos inseridos com o novo imóvel na tela
      setNovo_nome_imovel("");
      setNovoregras_convivencia("");
      setNovo_endereco_numero("");
      setNovo_endereco_rua("");
      setNovo_publico("");
      setNovo_endereco_bairro("");
      setNovo_endereco_cep("");
      setNovo_endereco_complemento("");
      setNovo_endereco_cidade("");
      setNovo_endereco_estado("");
      setNovo_endereco_pais("");
      setNovo_id_tipo("");
    } catch (error) {
      //em caso de erro
      console.log("Erro ao inserir curso:", error);
    }
  }

  async function editarImovel() {
    try {
      const response = await axios.put(
        "http://localhost:3002/imovel/" + id_imovel, //o programa entende que se trata de um texto + variável
        {
          //link do Insomnia para o put
          //inserindo no backend a modificação recebida
          nome_imovel: novo_nome_imovel,
          regras_convivencia: novo_regras_convivencia,
          publico: novo_publico,
          endereco_rua: novo_endereco_rua,
          endereco_numero: novo_endereco_numero,
          endereco_bairro: novo_endereco_bairro,
          endereco_cidade: novo_endereco_cidade,
          endereco_estado: novo_endereco_estado,
          endereco_pais: novo_endereco_pais,
          endereco_cep: novo_endereco_cep,
          endereco_complemento: novo_endereco_complemento,
        }
      );
      // Limpar os campos inseridos com o novo imóvel na tela
      setNovo_nome_imovel("");
      setNovoregras_convivencia("");
      setNovo_endereco_numero("");
      setNovo_endereco_rua("");
      setNovo_publico("");
      setNovo_endereco_bairro("");
      setNovo_endereco_cep("");
      setNovo_endereco_complemento("");
      setNovo_endereco_cidade("");
      setNovo_endereco_estado("");
      setNovo_endereco_pais("");
      setNovo_id_tipo("");
    } catch (error) {
      //em caso de erro
      console.log("Erro ao modificar imóvel:", error);
    }
  }

  async function deletarImovel() {
    try {
      const response = await axios.delete(
        "http://localhost:3002/imovel/" + id_imovel //o programa entende que se trata de um texto + variável //link do Insomnia para o delete
      );
      // Limpar o campo de inserção do id do curso na tela
      setid_imovel("");
    } catch (error) {
      //em caso de erro
      console.log("Erro ao excluir imóvel:", error);
    }
  }

  return (
    <Box sx={{ height: 400, width: 1000 }}>
      <DataGrid rows={imovel} columns={columns} />
      <Box>
        <Button variant="contained">Criar Imóvel</Button>{" "}
        {
          <InsercaoImovel
            number={1}
            novo_nome_imovel={novo_nome_imovel}
            novo_regras_convivencia={novo_regras_convivencia}
            novo_publico={novo_publico}
            novo_endereco_rua={novo_endereco_rua}
            novo_endereco_bairro={novo_endereco_bairro}
            novo_endereco_numero={novo_endereco_numero}
            novo_endereco_cidade={novo_endereco_cidade}
            novo_endereco_estado={novo_endereco_estado}
            novo_endereco_pais={novo_endereco_pais}
            novo_endereco_cep={novo_endereco_cep}
            novo_endereco_complemento={novo_endereco_complemento}
            novo_id_tipo={novo_id_tipo}
            //proximaFuncao={criarImovel}
          />
        }
      </Box>
      <Button variant="contained">Deletar imóvel</Button>
    </Box>
  );
}
