//Finalizar filtro e barra de pesquisa
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  CardActionArea,
  Box,
  AppBar,
  Button,
  Toolbar,
  CardActions,
  TextField,
  IconButton,
  InputBase,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { styled, alpha } from "@mui/material/styles";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";

export default function Imovel({ handleLogout }) {
  const navigate = useNavigate();
  const [imovel, setImovel] = useState([]);
  const [selecaoFiltro, setSelecaoFiltro] = useState("");
  const [barraPesquisa, setBarraPesquisa] = useState("");
  const cpf = localStorage.getItem("cpf"); // garante que pega o CPF logado

  const tiposDeImovel = {
    1: "Kitnet",
    2: "Casa",
    3: "Pensão",
    4: "Apartamento",
  };

  const filtro_publico = [
    { title: "Feminino" },
    { title: "Masculino" },
    { title: "Familiar" },
    { title: "Estudantes" },
    { title: "Casal" },
    { title: "Solteiros" },
  ];

  const imoveisFiltrados = selecaoFiltro;
  imoveisFiltrados
    ? imovel.filter((item) => item.publico === selecaoFiltro)
    : "Categoria não encontrada";

  //verificando se o que foi escrito na barra de pesquisa existe
  const imovelPesquisado = imovel.filter((item) =>
    item.nome_imovel.toLowerCase().includes(barraPesquisa.toLowerCase())
  );

  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "400px",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  }));

  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "#ffffff",
    fontWeight: "bold", // NEGRITO
    width: "400px",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),

      "&::placeholder": {
        color: "#ffffff",
        opacity: 0.8,
        fontWeight: "bold",
      },

      [theme.breakpoints.up("sm")]: {
        width: "120ch",
        "&:focus": {
          width: "200ch",
        },
      },
    },
  }));

  const filterOptions = createFilterOptions({
    matchFrom: "start",
    stringify: (option) => option.title,
  });

  useEffect(() => {
    buscarImovel();
  }, []);

  const buscarImovel = async () => {
    try {
      const request = await axios.get("http://localhost:3002/imovel/" + cpf);
      setImovel(request.data);
      console.log("resposta:", request); // Debug
      console.log("dados:", request.data); // Debug
    } catch (error) {
      console.log(error);
    }
  };

  function criandoImoveis() {
    try {
      navigate("/imovel/", {
        state: { cpf, number: 1, alerta: "Imóvel cadastrado com sucesso!" },
      });
      console.log("mimi");
      console.log(cpf);
    } catch {
      console.log("Falha no botão de criação de imóvel");
    }
  }

  function detalhandoImoveis(imovel_detalhar) {
    try {
      navigate(`/imovel/${imovel_detalhar.locador_cpf}/${imovel_detalhar.id}`, {
        state: { imovel_detalhar, cpf },
      });
      console.log("toto");
      console.log(cpf);
    } catch {
      console.log("Falha no botão de detalhação de imóvel");
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

          <Box sx={{ mx: 3 }}>
            <Autocomplete
              options={filtro_publico}
              getOptionLabel={(option) => option.title}
              filterOptions={filterOptions}
              sx={{ width: 300 }}
              onChange={(event, newValue) => {
                setSelecaoFiltro(newValue ? newValue.title : "");
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Público"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "white", // cor padrão
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "white", //cor de Público
                    },
                  }}
                />
              )}
            />
          </Box>

          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Nome do Imóvel"
                inputProps={{ "aria-label": "search" }}
                value={barraPesquisa}
                onChange={(e) => setBarraPesquisa(e.target.value)}
              />
            </Search>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<AddCircleIcon />}
              sx={{ color: "#fff", borderColor: "#fff" }}
              onClick={criandoImoveis}
            >
              Adicionar Imóvel
            </Button>

            <Button variant="outlined" color="error" onClick={handleLogout}>
              Sair
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      {/*Lista de Imóveis*/}

      {/* Lista de imóveis */}
      {!imovel || imovel.length === 0 ? (
        <Typography variant="h6" sx={{ mt: 3, textAlign: "center" }}>
          Nenhum imóvel cadastrado ainda.
        </Typography>
      ) : (
        <Box sx={{ p: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
          {imovel.map((item) => (
            <Card key={item.id} sx={{ width: 300 }}>
              <CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="h5">
                    {item.nome_imovel}
                  </Typography>

                  <Typography variant="body2" color="textSecondary">
                    Rua: {item.endereco_rua}
                    <br />
                    Número: {item.endereco_numero}
                    <br />
                    Bairro: {item.endereco_bairro}
                    <br />
                    Cidade: {item.endereco_cidade}
                    <br />
                    Tipo: {tiposDeImovel[item.id_tipo]}
                  </Typography>
                </CardContent>
              </CardActionArea>

              <CardActions>
                <Button size="small" onClick={() => detalhandoImoveis(item)}>
                  Detalhar
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
    </>
  );
}
