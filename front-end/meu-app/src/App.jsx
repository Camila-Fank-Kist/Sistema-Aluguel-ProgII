import { useState, useEffect } from "react";
//import "./App.css";
import { Button, Grid, Stack, Box, Typography, createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import axios from "axios";
import Login from "./Login";
import Imovel from "./Imovel";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import DetalharImovel from "./DetalharImovel";
import SalvarImovel from "./SalvarImovel";
import CadastroUsuario from "./CadastroUsuario";
import Contrato from "./Components/Contrato";
import UnidadeMoradia from "./Components/UnidadeMoradia";

export default function App() {

  const theme = createTheme({
    palette: {
      primary: { main: '#89c56e' },
      secondary: { main: '#6ea04b' }
    }
  });

  // estado pra controlar se o usuário está logado ou não:
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // estados para guardar informações do usuário logado:
  const [userCPF, setUserCPF] = useState("");
  const [usuario, setUsuario] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(""); // "locador" ou "inquilino"

  // permissões do usuário:
  const [permissoes, setPermissoes] = useState([]);

  console.log("Estado atual - isLoggedIn:", isLoggedIn, "; userCPF:", userCPF, "; tipoUsuario:", tipoUsuario);

  useEffect(() => {
    // Verifica se há token no localStorage ao carregar
    const token = localStorage.getItem("token");
    if (token) {
      // Tenta decodificar o token para obter o cpf do usuário
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.username) {
          // Se conseguiu decodificar, atualiza o estado do usuário
          setUserCPF(payload.username);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Erro ao decodificar token:", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  async function buscarPermissoesPorCPF(cpf) {
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
  }


  useEffect(() => {
    // Busca permissões quando o usuário estiver logado e tiver cpf
    if (isLoggedIn && userCPF) {
      buscarPermissoesPorCPF(userCPF);
    }
  }, [isLoggedIn, userCPF]);
  // Se estiver logado, mostra o conteúdo principal

  

  const handleLogin = (success, username = null) => {
    if (success) {
      // Se o username foi passado, usa ele
      if (username) {
        setUserCPF(username.cpf);
        setUsuario(username);
        setTipoUsuario(username.tipo_usuario);
        // setIsLoggedIn(true);
      } else { // senão, tenta decodificar o token para obter o cpf
        try {
          const token = localStorage.getItem("token");
          if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
            if (payload.username) {
              setUserCPF(payload.username);
            }
          }
        } catch (error) {
          console.error("Erro ao decodificar token:", error);
        }
        // setIsLoggedIn(false);
        // setUserCPF("");
        // setUsuario(null);
        // setTipoUsuario("");
        // localStorage.removeItem("token");
      }
      // marca como logado:
      setIsLoggedIn(true);
    } else { // se success=false (falhou o login):
      setIsLoggedIn(false);
      setUserCPF("");
      setTipoUsuario("");
      localStorage.removeItem("token");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserCPF("");
    setUsuario(null);
    setTipoUsuario("");
    setPermissoes([]);
    localStorage.removeItem("token");
  };

  // verificando se é locador ou inquilino
  const isLocador = (tipoUsuario === "locador") ? true : false;
  const isInquilino = (tipoUsuario === "inquilino") ? true : false;

  // token usado por alguns componentes quando passado por prop
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const podeVisualizarImoveis = permissoes.some(
    (permissao) => permissao.Permissao.descricao === "TELA_LOCADOR"
  );

  // Se não estiver logado, mostra a tela de login
  if (!isLoggedIn) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <Stack spacing={2} alignItems="center">
            <Login handleLogin={handleLogin} />
          </Stack>
        </Box>
      </ThemeProvider>
    );
  }

  // Se estiver logado, mostra o conteúdo principal (locador ou inquilino)
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Button variant="text" color="primary" onClick={() => navigate('/')}>Home</Button>
          {isInquilino ? (
            <Button variant="text" color="primary" onClick={() => navigate('/inquilino')}>Contratos</Button>
          ) : (
            <Button variant="text" color="primary" onClick={() => navigate('/contratos')}>Contratos</Button>
          )}
          <Button variant="text" color="primary" onClick={() => navigate('/unidades')}>Unidades</Button>
        </Box>
        <Button variant="outlined" color="error" onClick={handleLogout}>Logout</Button>
      </Box>

      <Routes>
      <Route
        path="/inquilino"
        element={
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">Olá, {usuario?.nome || userCPF}</Typography>
              <Button variant="outlined" color="error" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
            <Contrato tipoUsuario="inquilino" />
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>Buscar Unidades de Moradia</Typography>
              <UnidadeMoradia tipoUsuario="inquilino" />
            </Box>
          </Box>
        }
      />

      <Route path="/" element={<Imovel handleLogout={handleLogout} />} />
      <Route
        path="/novoUsuario"
        element={<CadastroUsuario handleLogout={handleLogout} />}
      />
      <Route
        path="/novoUsuario"
        element={<CadastroUsuario handleLogout={handleLogout} />}
      />
      <Route
        path="/imovel/:cpf"
        element={<Imovel handleLogout={handleLogout} />}
      />
      <Route
        path="/imovel/"
        element={<SalvarImovel handleLogout={handleLogout} />}
      />
      <Route
        path="/imovel/:cpf/:id"
        element={<DetalharImovel handleLogout={handleLogout} />}
      />
      <Route
        path="/imovel/:cpf/:id/editar"
        element={<SalvarImovel handleLogout={handleLogout} />}
      />
      
      <Route
        path="/unidades"
        element={
          <Box sx={{ p: 3 }}>
            <UnidadeMoradia tipoUsuario="locador" />
          </Box>
        }
      />
      <Route
        path="/contratos"
        element={
          <Box sx={{ p: 3 }}>
            <Contrato tipoUsuario="locador" />
          </Box>
        }
      />

      {/* Redireciona para a rota correta baseado no tipo de usuário */}
      <Route
        path="*"
        element={
          isInquilino ? <Navigate to="/inquilino" replace /> : <Navigate to="/" replace />
        }
      />
    </Routes>
      </Box>
    </ThemeProvider>
  );
}
