import axios from "axios";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useState } from "react";

export default function CadastroUsuario({ opcao, voltar }) {
  const [nome, setNome] = useState("");
  const [cpf, setCPF] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [senha, setSenha] = useState("");
  const [genero, setGenero] = useState("");
  const [trabalha, setTrabalha] = useState("");
  const [estuda, setEstuda] = useState("");

  function cancelarCadastro() {
    setNome("");
    setCPF("");
    setDataNascimento("");
    setSenha("");
    setTrabalha("");
    setEstuda("");
    setGenero("");
    voltar();
  }

  const enviarCadastro = async () => {
    try {
      await axios.post("http://localhost:3002/novoUsuario", {
        nome,
        cpf,
        senha,
        data_nascimento: dataNascimento,
        genero,
        trabalha,
        estuda,
        opcao,
      });
      console.log("Usuário cadastrado com sucesso!");
      voltar();

      // Recarrega a página para voltar ao login
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
    }
  };

  return opcao == "locador" ? (
    <Box
      //component="form"
      sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
      noValidate
      autoComplete="off"
    >
      <form>
        <TextField
          required
          id="outlined-required"
          label="Nome"
          value={nome}
          onChange={(event) => {
            setNome(event.target.value);
          }}
        />
        <TextField
          required
          id="outlined-required"
          label="CPF (digite com . e -"
          value={cpf}
          onChange={(event) => {
            setCPF(event.target.value);
          }}
        />
        <TextField
          required
          id="outlined-required"
          label="Data de Nascimento"
          type="date"
          value={dataNascimento}
          onChange={(event) => {
            setDataNascimento(event.target.value);
          }}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          required
          id="outlined-required"
          type="password" //mudei
          label="Senha"
          value={senha}
          onChange={(event) => {
            setSenha(event.target.value);
          }}
        />
      </form>
      <Button
        variant="contained"
        onClick={enviarCadastro}
        disabled={
          nome === "" || cpf === "" || dataNascimento === "" || senha === ""
        }
      >
        Enviar
      </Button>
      <Button
        variant="outlined"
        style={{
          maxWidth: "100px",
          minWidth: "100px",
        }}
        color="error"
        onClick={cancelarCadastro}
      >
        Cancelar
      </Button>
    </Box>
  ) : (
    <Box
      //component="form"
      sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
      noValidate
      autoComplete="off"
    >
      <form>
        <TextField
          required
          id="outlined-required"
          label="Nome"
          value={nome}
          onChange={(event) => {
            setNome(event.target.value);
          }}
        />
        <TextField
          required
          id="outlined-required"
          label="CPF"
          value={cpf}
          onChange={(event) => {
            setCPF(event.target.value);
          }}
        />
        <TextField
          required
          id="outlined-required"
          label="Data de Nascimento"
          value={dataNascimento}
          type="date"
          onChange={(event) => {
            setDataNascimento(event.target.value);
          }}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <p>
          Caso você também seja um locador no sistema, suas senhas deverão ser
          diferentes
        </p>
        <TextField
          required
          id="outlined-required"
          label="Senha"
          value={senha}
          onChange={(event) => {
            setSenha(event.target.value);
          }}
        />
        <TextField
          required
          id="outlined-required"
          label="Gênero"
          value={genero}
          onChange={(event) => {
            setGenero(event.target.value);
          }}
        />
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-label">Trabalha *</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={trabalha}
            label="Trabalha"
            onChange={(event) => {
              setTrabalha(event.target.value);
            }}
          >
            <MenuItem value={true}>Sim</MenuItem>
            <MenuItem value={false}>Não</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-label">Estuda *</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={estuda}
            label="Estuda"
            onChange={(event) => {
              setEstuda(event.target.value);
            }}
          >
            <MenuItem value={true}>Sim</MenuItem>
            <MenuItem value={false}>Não</MenuItem>
          </Select>
        </FormControl>
      </form>
      <Button
        variant="contained"
        onClick={enviarCadastro}
        disabled={
          //aqui é estritamente igual pois, se deixar somente igual, trabalha e estuda só vão aceitar se for true
          nome === "" ||
          cpf === "" ||
          dataNascimento === "" ||
          senha === "" ||
          genero === "" ||
          trabalha === "" ||
          estuda === ""
        }
      >
        Enviar
      </Button>
      <Button
        variant="outlined"
        style={{
          maxWidth: "100px",
          minWidth: "100px",
        }}
        color="error"
        onClick={cancelarCadastro}
      >
        Cancelar
      </Button>
    </Box>
  );
}
