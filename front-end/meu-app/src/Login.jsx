import React, { useState } from "react";
//import PropTypes from "prop-types";
import axios from "axios";

import {
  Alert,
  Box,
  Button,
  Snackbar,
  Stack,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import CadastroUsuario from "./CadastroUsuario";
import Imovel from "./Imovel";

export default function Login({ handleLogin }) {
  const [username, setUsername] = React.useState("");
  const [passwd, setPasswd] = React.useState("");
  const [openMessage, setOpenMessage] = React.useState(false);
  const [messageText, setMessageText] = React.useState("");
  const [messageSeverity, setMessageSeverity] = React.useState("success");
  const [mostrarPergunta, setMostrarPergunta] = useState(false);
  const [opcao, setOpcao] = useState("");
  const [mostrarCadastro, setMostrarCadastro] = useState(false);
  const [telaImoveis, setTelaImoveis] = useState(false);
  const [telaLogin, setTelaLogin] = useState(true);

  async function enviaLogin(event) {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:3002/login", {
        username: username,
        password: passwd,
      });
      if (response.status >= 200 && response.status < 300) {
        // Salva o token JWT na sessão
        localStorage.setItem("token", response.data.token);
        // seta o estado do login caso tudo deu certo, passando o username
        handleLogin(true, {
          cpf: username,
          tipo_usuario: response.data.tipo_usuario,
        });
      } else {
        // falha
        console.error("Falha na autenticação");
        setOpenMessage(true);
        setMessageText("Falha na autenticação!");
        setMessageSeverity("error");
      }
    } catch (error) {
      console.log(error);
      setOpenMessage(true);
      setMessageText("Falha ao logar usuário!");
      setMessageSeverity("error");
    }
  }

  function cancelaLogin() {
    if (username !== "" || passwd !== "") {
      setUsername("");
      setPasswd("");
    }
    setOpenMessage(true);
    setMessageText("Login cancelado!");
    setMessageSeverity("warning");
  }

  function handleCloseMessage(_, reason) {
    if (reason === "clickaway") {
      return;
    }
    setOpenMessage(false);
  }

  return (
    <Box style={{ maxWidth: "300px" }}>
      {mostrarPergunta == true &&
      mostrarCadastro == false &&
      telaImoveis == false &&
      telaLogin == false ? (
        <FormControl>
          <FormLabel id="demo-row-radio-buttons-group-label">
            O que você deseja fazer?
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={opcao}
            onChange={(event) => setOpcao(event.target.value)}
          >
            <FormControlLabel
              value="inquilino"
              control={<Radio />}
              label="Estou a procura de moradia"
            />
            <FormControlLabel
              value="locador"
              control={<Radio />}
              label="Quero cadastrar meus imóveis"
            />
            <Button
              variant="contained"
              align-items="center"
              justify-content="center"
              style={{
                maxWidth: "100px",
                minWidth: "100px",
              }}
              color="primary"
              onClick={() => {
                setMostrarCadastro(true);
                setMostrarPergunta(false);
                setTelaImoveis(false);
                setTelaLogin(false);
              }}
            >
              Próximo
            </Button>
          </RadioGroup>
        </FormControl>
      ) : mostrarCadastro == true &&
        mostrarPergunta == false &&
        telaImoveis == false &&
        telaLogin == false ? (
        <CadastroUsuario opcao={opcao} />
      ) : mostrarCadastro == false &&
        mostrarPergunta == false &&
        telaImoveis == false &&
        telaLogin == true ? (
        //se chegou aqui, é porque o usuário quer entrar no sistema
        <Stack spacing={2}>
          <Stack spacing={2}>
            <TextField
              required
              id="username-input"
              label="CPF: "
              size="small"
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
              }}
            />
            <TextField
              required
              id="passwd-input"
              label="Senha: "
              type="password"
              size="small"
              value={passwd}
              onChange={(event) => {
                setPasswd(event.target.value);
              }}
            />
          </Stack>
          <Stack direction="row" spacing={3}>
            <Button
              variant="contained"
              style={{
                maxWidth: "100px",
                minWidth: "100px",
              }}
              color="primary"
              onClick={() => {
                enviaLogin;
                setTelaImoveis(true);
                setMostrarCadastro(false);
                setMostrarPergunta(false);
                setTelaLogin(false);
              }}
            >
              Entrar
            </Button>
            <Button
              variant="outlined"
              style={{
                maxWidth: "100px",
                minWidth: "100px",
              }}
              color="error"
              onClick={cancelaLogin}
            >
              Cancelar
            </Button>
          </Stack>
          <p>Não tem login? Cadastre-se no sistema</p>
          <Box>
            <Button
              variant="contained"
              align-items="center"
              justify-content="center"
              style={{
                maxWidth: "100px",
                minWidth: "100px",
              }}
              color="primary"
              onClick={() => {
                setMostrarPergunta(true);
                setMostrarCadastro(false);
                setTelaImoveis(false);
                setTelaLogin(false);
              }}
            >
              Cadastrar
            </Button>
          </Box>

          <Snackbar
            open={openMessage}
            autoHideDuration={6000}
            onClose={handleCloseMessage}
          >
            <Alert severity={messageSeverity} onClose={handleCloseMessage}>
              {messageText}
            </Alert>
          </Snackbar>
        </Stack>
      ) : (
        <Imovel />
      )}
    </Box>
  );
}

// Login.propTypes = {
// 	setToken: PropTypes.func.isRequired,
// };
