//atua no cadstro do usuário
import axios from "axios";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useState } from "react";

export default function CadastroUsuario({ opcao, onClick }) {
  const [nome, setNome] = useState("");
  const [cpf, setCPF] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [senha, setSenha] = useState("");
  const [genero, setGenero] = useState("");
  const [trabalha, setTrabalha] = useState("");
  const [estuda, setEstuda] = useState("");

  function cancelarCadastro() {
    //limpa os campos
    setNome("");
    setCPF("");
    setDataNascimento("");
    setSenha("");
    setTrabalha("");
    setEstuda("");
    setGenero("");
    if (onClick) onClick(); //para voltar para a tela login
  }

  const enviarCadastro = async () => {
    //realiza o cadstro do usuário
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
      if (onClick) onClick(); //para voltar para a tela login
    } catch (error) {
      //em caso de erro
      console.error("Erro ao cadastrar usuário:", error);
    }
  };

  return opcao == "locador" ? ( //se opcao foi marcada como locador
    <Box //design do Material UI das caixinhas de resposta
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
          //abaixo é o formato para colocar a data, de forma que dd/mm/aaaa não fique embolado com Data de Nascimento na legenda da caixinha
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          value={dataNascimento}
          onChange={(event) => {
            setDataNascimento(event.target.value);
          }}
        />
        <TextField
          required
          id="outlined-required"
          type="password" //assim para ao colocar a senha não aparecer o que a pessoa escreveu
          label="Senha"
          value={senha}
          onChange={(event) => {
            setSenha(event.target.value);
          }}
        />
      </form>
      <Button
        variant="contained"
        onClick={enviarCadastro} //envia os dados para enviaCadastro
        disabled={
          //se alguma das caixinhas está vazia, o usuário não pode clicar para prosseguir
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
        onClick={cancelarCadastro} //envia os dados para cancelarCadastro
      >
        Cancelar
      </Button>
    </Box>
  ) : (
    //se opcao é um inquilino
    <Box //design das caixinhas de resposta do Material UI
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
          slotProps={{
            //abaixo é o formato para colocar a data, de forma que dd/mm/aaaa não fique embolado com Data de Nascimento na legenda da caixinha
            inputLabel: {
              shrink: true,
            },
          }}
          value={dataNascimento}
          type="date"
          onChange={(event) => {
            setDataNascimento(event.target.value);
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
        {/*abaixo há as caixinhas, que ao serem clicadas, o usuário escolhe uma resposta - sim ou não. Os formatos foram pegos do Material UI*/}
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-label">Trabalha *</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={trabalha}
            label="Trabalha"
            onChange={(event) => {
              setTrabalha(event.target.value);
            }} //formato pego do modelo do Material
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
