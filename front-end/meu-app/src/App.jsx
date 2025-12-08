//atua na verificação de permissões
import { useState, useEffect } from "react";
import { Stack, Box } from "@mui/material";
import axios from "axios";
import Login from "./Login";
import Imovel from "./Imovel";
import { Routes, Route } from "react-router-dom";
import DetalharImovel from "./DetalharImovel";
import SalvarImovel from "./SalvarImovel";
import CadastroUsuario from "./CadastroUsuario";
//import Contrato from "./Contrato"; //camila, quando voce mexer, descomente

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userCPF, setUserCPF] = useState("");
  const [permissoes, setPermissoes] = useState([]);

  useEffect(() => {
    // Verifica se há token no localStorage ao carregar
    const token = localStorage.getItem("token");
    if (token) {
      // Tenta decodificar o token para obter o cpf do usuário
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.username) {
          setUserCPF(payload.username); //pega o cpf (username) do token decodificado
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

  const buscarPermissoesPorCPF = async (cpf) => {
    try {
      //busca de locador
      const token = localStorage.getItem("token");
      let response = await axios.get(
        `http://localhost:3002/locador_permissao/locador/${cpf}`,
        {
          headers: {
            //envia o token
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data.permissoes); //imprime no console
      setPermissoes(response.data.permissoes);
    } catch {
      //se não está em locador, procura em inquilino
      response = await axios.get(
        `http://localhost:3002/inquilino_permissao/inquilino/${cpf}`,
        {
          headers: {
            //armazena o token
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.permissoes); //imprime no console
    }
  };

  const handleLogin = (success, username = null) => {
    //quando o usuário coloca o cpf e senha no login, o programa vem aqui
    if (success) {
      // Se o username (cpf) foi passado, usa ele
      if (username) {
        setUserCPF(username.cpf);
        setIsLoggedIn(true);
      } else {
        try {
          const token = localStorage.getItem("token"); //guarda "token"
          if (token) {
            const payload = JSON.parse(atob(token.split(".")[1])); //pode por header,informação do usuario eassinatura em payload, mas aqui ele pega username //HEADER.USERNAME.SIGNATURE
            if (payload.username) {
              setUserCPF(payload.username); //recebe o cpf do usuário
            }
          }
        } catch (error) {
          //em caso de erro
          console.error("Erro ao decodificar token:", error);
        }
      }

      setIsLoggedIn(true); //se foi bem sucedido o login
    } else {
      //se não ocorreu login
      setIsLoggedIn(false);
      setUserCPF("");
      localStorage.removeItem("token");
    }
  };

  const handleLogout = () => {
    //para quando o usuário clica em Sair, ou seja, volta pra tela de login
    setIsLoggedIn(false);
    setUserCPF("");

    setPermissoes([]);
    localStorage.removeItem("token");
  };

  /*const podeVisualizarImoveis = permissoes.some(
    (permissao) => permissao.Permissao.descricao === "TELA_LOCADOR"
  );

  const podeVisualizarContrato = permissoes.some(
    (permissao) => permissao.Permissao.descricao === "TELA_INQUILINO"
  );*/

  // Se não estiver logado, mostra a tela de login
  if (!isLoggedIn) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center" //display e justifyContent junto com esse faz ficar no meio
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
    //retorna as rotas das telas (endereços) que serão usados no sistema
    //path é o endereçamento
    //element é o componente que vai aparecer na tela (renderizado) e handleLogout é passado como prop na função
    <Routes>
      <Route path="/" element={<Imovel handleLogout={handleLogout} />} />
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
