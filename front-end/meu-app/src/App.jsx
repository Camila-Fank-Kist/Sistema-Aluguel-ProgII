import { useState, useEffect } from "react";
import "./App.css";
import { Button, Grid, Stack, Box, Typography } from "@mui/material";
import axios from "axios";
import Login from "./Login";
import Imovel from "./Imovel";
import { Routes, Route } from "react-router-dom";

//import Contrato from "./Contrato";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userCPF, setUserCPF] = useState("");
  const [usuario, setUsuario] = useState(null);
  const [permissoes, setPermissoes] = useState([]);

  useEffect(() => {
    // Verifica se há token no localStorage ao carregar
    const token = localStorage.getItem("token");
    if (token) {
      // Tenta decodificar o token para obter o cpf do usuário
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.username) {
          setUserCPF(payload.username);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Erro ao decodificar token:", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const buscarPermissoesPorCPF = async (cpf) => {
    try {
      const token = localStorage.getItem("token");
      let response = await axios.get(
        `http://localhost:3002/locador_permissao/locador/${cpf}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response === null) {
        response = await axios.get(
          `http://localhost:3002/inquilino_permissao/inquilino/${cpf}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      console.log(response.data.permissoes);
      setPermissoes(response.data.permissoes);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = (success, username = null) => {
    if (success) {
      // Se o username foi passado, usa ele, senão tenta decodificar do token
      if (username) {
        setUserCPF(username);
        setUsuario(username);
        setIsLoggedIn(true);
      } else {
        /*try {
          const token = localStorage.getItem("token");
          if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
            if (payload.username) {
              setUserCPF(payload.username);
            }
          }
        } catch (error) {
          console.error("Erro ao decodificar token:", error);
        }*/
        setIsLoggedIn(false);
        setUsuario(null);
        localStorage.removeItem("token");
      }
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      setUserCPF("");
      localStorage.removeItem("token");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserCPF("");
    setPermissoes([]);
    localStorage.removeItem("token");
  };

  const podeVisualizarImoveis = permissoes.some(
    (permissao) => permissao.Permissao.descricao === "TELA_LOCADOR"
  );

  // Se não estiver logado, mostra a tela de login
  if (!isLoggedIn) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Stack spacing={2} alignItems="center">
          <Typography variant="h4" component="h1">
            Login
          </Typography>
          <Login handleLogin={handleLogin} />
        </Stack>
      </Box>
    );
  }
  if (isLoggedIn && usuario) {
    return usuario.tipo_usuario === "locador" ? <Imovel /> : <Contrato />;
  }

  useEffect(() => {
    // Busca permissões quando o usuário estiver logado e tiver cpf
    if (isLoggedIn && userCPF) {
      buscarPermissoesPorCPF(userCPF);
    }
  }, [isLoggedIn, userCPF]);
  // Se estiver logado, mostra o conteúdo principal
  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Stack spacing={2}>
          <Stack spacing={2} direction="row" alignItems="center">
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Usuário: {userCPF}
            </Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={handleLogout}
              style={{ width: "150px" }}
            >
              Logout
            </Button>
          </Stack>
          <Stack>{podeVisualizarImoveis && <Imovel />}</Stack>
        </Stack>
      </Grid>
    </Grid>
  );
}
