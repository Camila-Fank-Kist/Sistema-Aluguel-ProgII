// Root app: theme, auth state, routes
import { useState, useEffect } from "react";
import {
  Button,
  Stack,
  Box,
  Typography,
  createTheme,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
import axios from "axios";
import Login from "./Login";
import Imovel from "./Imovel";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import DetalharImovel from "./DetalharImovel";
import SalvarImovel from "./SalvarImovel";
import CadastroUsuario from "./CadastroUsuario";
import Contrato from "./Components/Contrato";
import UnidadeMoradia from "./Components/UnidadeMoradia";

const theme = createTheme({
  palette: {
    primary: { main: "#89c56e" },
    secondary: { main: "#6ea04b" },
  },
});

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userCPF, setUserCPF] = useState("");
  const [usuario, setUsuario] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [permissoes, setPermissoes] = useState([]);

  const navigate = useNavigate();

  // On mount: decode token if present (schedule setState to avoid synchronous update warning)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload) {
        // schedule to avoid setState-in-effect warning
        setTimeout(() => {
          if (payload.username) setUserCPF(payload.username);
          if (payload.tipo_usuario) setTipoUsuario(payload.tipo_usuario);
          setIsLoggedIn(true);
        }, 0);
      }
    } catch (err) {
      console.error("Erro ao decodificar token:", err);
      localStorage.removeItem("token");
    }
  }, []);

  // Fetch permissions for the decoded userCPF
  useEffect(() => {
    if (!isLoggedIn || !userCPF) return;
    let mounted = true;
    const buscarPermissoesPorCPF = async (cpf) => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          `http://localhost:3002/locador_permissao/locador/${cpf}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (mounted) setPermissoes(res.data.permissoes || []);
      } catch (err) {
        try {
          const res2 = await axios.get(
            `http://localhost:3002/inquilino_permissao/inquilino/${cpf}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (mounted) setPermissoes(res2.data.permissoes || []);
        } catch (err2) {
          console.warn("Permissões não encontradas para CPF:", cpf);
          if (mounted) setPermissoes([]);
        }
      }
    };
    buscarPermissoesPorCPF(userCPF);
    return () => {
      mounted = false;
    };
  }, [isLoggedIn, userCPF]);

  const handleLogin = (success, userData = null) => {
    if (!success) {
      // login failed
      setIsLoggedIn(false);
      setUserCPF("");
      setUsuario(null);
      setTipoUsuario("");
      localStorage.removeItem("token");
      return;
    }

    // success
    if (userData) {
      setUsuario(userData);
      setTipoUsuario(userData.tipo_usuario || "");
      if (userData.cpf) setUserCPF(userData.cpf);
      setIsLoggedIn(true);
      return;
    }

    // If no userData provided, try decode token
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload?.username) setUserCPF(payload.username);
        if (payload?.tipo_usuario) setTipoUsuario(payload.tipo_usuario);
      } catch (err) {
        console.error("Erro ao decodificar token no login:", err);
      }
    }
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserCPF("");
    setUsuario(null);
    setTipoUsuario("");
    setPermissoes([]);
    localStorage.removeItem("token");
    navigate("/");
  };

  const isInquilino = tipoUsuario === "inquilino";

  // If not logged, show login centered
  if (!isLoggedIn) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <Stack spacing={2} alignItems="center">
            <Login handleLogin={handleLogin} />
          </Stack>
        </Box>
      </ThemeProvider>
    );
  }

  // Main app when logged in
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Box>
            <Button variant="text" color="primary" onClick={() => navigate("/")}>Home</Button>
            {isInquilino ? (
              <Button variant="text" color="primary" onClick={() => navigate("/inquilino")}>Contratos</Button>
            ) : (
              <Button variant="text" color="primary" onClick={() => navigate("/contratos")}>Contratos</Button>
            )}
            <Button variant="text" color="primary" onClick={() => navigate("/unidades")}>Unidades</Button>
          </Box>
          <Button variant="outlined" color="error" onClick={handleLogout}>Logout</Button>
        </Box>

        <Routes>
          <Route path="/inquilino" element={
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              </Box>
              <Contrato tipoUsuario={tipoUsuario || "inquilino"} />
            </Box>
          } />

          <Route path="/" element={<Imovel handleLogout={handleLogout} />} />
          <Route path="/novoUsuario" element={<CadastroUsuario handleLogout={handleLogout} />} />
          <Route path="/imovel/:cpf" element={<Imovel handleLogout={handleLogout} />} />
          <Route path="/imovel/" element={<SalvarImovel handleLogout={handleLogout} />} />
          <Route path="/imovel/:cpf/:id" element={<DetalharImovel handleLogout={handleLogout} />} />
          <Route path="/imovel/:cpf/:id/editar" element={<SalvarImovel handleLogout={handleLogout} />} />

          <Route path="/unidades" element={<Box sx={{ p: 3 }}><UnidadeMoradia tipoUsuario={tipoUsuario || "publico"} /></Box>} />
          <Route path="/contratos" element={<Box sx={{ p: 3 }}><Contrato tipoUsuario={tipoUsuario || "locador"} /></Box>} />

          <Route path="*" element={isInquilino ? <Navigate to="/inquilino" replace /> : <Navigate to="/" replace />} />
        </Routes>
      </Box>
    </ThemeProvider>
  );
}
