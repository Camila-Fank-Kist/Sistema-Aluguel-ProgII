import { useState, useEffect } from "react";
//import "./App.css";
import { Button, Grid, Stack, Box, Typography } from "@mui/material";
import axios from "axios";
import Login from "./Login";
import Imovel from "./Imovel";
import { Routes, Route, Navigate } from "react-router-dom";
import DetalharImovel from "./DetalharImovel";
import SalvarImovel from "./SalvarImovel";
import CadastroUsuario from "./CadastroUsuario";
//import Contrato from "./Contrato";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userCPF, setUserCPF] = useState("");
  const [usuario, setUsuario] = useState(null);
  const [permissoes, setPermissoes] = useState([]);

  console.log("Estado atual - isLoggedIn:", isLoggedIn, "userCPF:", userCPF);

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

  useEffect(() => {
    // Busca permissões quando o usuário estiver logado e tiver cpf
    if (isLoggedIn && userCPF) {
      buscarPermissoesPorCPF(userCPF);
    }
  }, [isLoggedIn, userCPF]);
  // Se estiver logado, mostra o conteúdo principal

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
        setUserCPF(username.cpf);
        setUsuario(username);
        setIsLoggedIn(true);
      } else {
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
        setIsLoggedIn(false);
        setUserCPF("");
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
    setUsuario(null);

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
          <Login handleLogin={handleLogin} />
        </Stack>
      </Box>
    );
  }
  /*if (isLoggedIn && usuario) {//camila, quando voce mexer, descomente isso
    return usuario.tipo_usuario === "locador" ? <Imovel /> : <Contrato />;
  }*/

  return (
    <Routes>
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
    </Routes>
  );
}

{
  /*     <Route path="/imovel/:cpf" element={<Imovel />} />
      <Route path="/imovel/" element={<SalvarImovel />} />
      <Route path="/imovel/:cpf/:id" element={<DetalharImovel />} />
      <Route path="/imovel/:cpf/:id/editar" element={<SalvarImovel />} />
      <Route path="/" element={<Imovel handleLogout={handleLogout} />} />
      <Route path="/" element={<SalvarImovel handleLogout={handleLogout} />} />
      <Route
        path="/"
        element={<DetalharImovel handleLogout={handleLogout} />}
      />*/
}
