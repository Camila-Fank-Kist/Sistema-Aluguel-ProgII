//mostra todos os imóveis cadatrados
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
import { useMemo } from "react";
import { styled, alpha } from "@mui/material/styles";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";

//foram colocadas fora de Imovel, pois quando estavam dentro, ao digitar uma letra, o cursor mudava de foco
const Search = styled("div")(({ theme }) => ({
  //estilização da caixa da barra de pesquisa pego no Material UI
  position: "relative", //posição
  borderRadius: theme.shape.borderRadius, //borda
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    //cor de fundo
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0, //margem esquerda
  width: "400px", //largura
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  //ícone da lupa da caixa da barra de pesquisa pego no Material UI
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  //campo de busca do nome do imóvel na caixa da barra de pesquisa pego no Material UI
  color: "#ffffff",
  fontWeight: "bold", // NEGRITO
  width: "400px",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
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

export default function Imovel({ handleLogout }) {
  const navigate = useNavigate();
  const [imovel, setImovel] = useState([]);
  const [selecaoFiltro, setSelecaoFiltro] = useState("");
  const [barraPesquisa, setBarraPesquisa] = useState("");
  const cpf = localStorage.getItem("cpf"); // pega o CPF logado

  const tiposDeImovel = {
    //para a visualização dos dados básicos
    1: "Kitnet",
    2: "Casa",
    3: "Pensão",
    4: "Apartamento",
  };

  const filtro_publico = [
    //opções do filtro. pego do material ui
    { title: "Feminino" },
    { title: "Masculino" },
    { title: "Familiar" },
    { title: "Estudantes" },
    { title: "Casal" },
    { title: "Solteiros" },
  ];

  const filterOptions = createFilterOptions({
    matchFrom: "start",
    stringify: (option) => option.title, //filtra as opções de imóvel
  });

  useEffect(() => {
    //cada vez que a tela é carregada, carrega os imoveis cadatrados
    buscarImovel();
  }, []);

  const buscarImovel = async () => {
    //exibe todos os imoveis cadastrados
    try {
      const request = await axios.get("http://localhost:3002/imovel/" + cpf);
      setImovel(request.data);
      console.log("Exibindo imóveis");
    } catch (error) {
      console.log(error);
    }
  };

  function criandoImoveis() {
    //adiciona novos imóveis
    try {
      navigate("/imovel/", {
        state: { cpf, number: 1, alerta: "Imóvel cadastrado com sucesso!" }, //vai para outra tela
      });
      console.log("Imóvel adicionado");
    } catch {
      console.log("Falha no botão de criação de imóvel");
    }
  }

  function detalhandoImoveis(imovel_detalhar) {
    //mostra todas as informações do imóvel
    try {
      navigate(`/imovel/${imovel_detalhar.locador_cpf}/${imovel_detalhar.id}`, {
        state: { imovel_detalhar, cpf },
      }); //vai para outra tela
      console.log("Exibindo todas as informações do imóvel");
    } catch {
      console.log("Falha no botão de detalhação de imóvel");
    }
  }

  const imoveisFiltrados = useMemo(() => {
    //useMemo faz com que, conforme eu escrevo na berra de pesquisa, vai filtrando os imóveis, sem o cursor sair do foco
    let resultado = imovel; //let pq pode mudar

    // Filtro por público
    if (selecaoFiltro) {
      resultado = resultado.filter((item) => item.publico === selecaoFiltro);
    }

    // Filtro por barra de pesquisa
    if (barraPesquisa) {
      resultado = resultado.filter((item) =>
        item.nome_imovel.toLowerCase().includes(barraPesquisa.toLowerCase())
      );
    }

    return resultado;
  }, [imovel, selecaoFiltro, barraPesquisa]);

  return (
    <>
      <AppBar //modelando barra verde
        position="static"
        sx={{
          backgroundColor: "#89c56eff",
          paddingY: 2,
          width: "100%",
        }}
      >
        {/*nome do sistema*/}
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Sua casa, sua vida
          </Typography>

          {/*filtro*/}
          <Box sx={{ mx: 3 }}>
            <Autocomplete
              options={filtro_publico}
              getOptionLabel={(option) => option.title}
              filterOptions={filterOptions}
              sx={{ width: 300 }}
              value={
                //filtrando o que foi selecionado
                filtro_publico.find((event) => event.title === selecaoFiltro) ||
                null
              }
              onChange={(event, newValue) => {
                //event fica por ser assinatura padrão
                setSelecaoFiltro(newValue ? newValue.title : "");
              }}
              //modelando o design do filtro
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

          {/*barra de pesquisa, inserção da palavra*/}
          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Nome do Imóvel"
                inputProps={{ "aria-label": "search" }}
                value={barraPesquisa}
                onChange={(event) => setBarraPesquisa(event.target.value)}
              />
            </Search>
          </Box>

          {/*botão para adicionar Imóvel*/}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<AddCircleIcon />}
              sx={{ color: "#fff", borderColor: "#fff" }}
              onClick={criandoImoveis}
            >
              Adicionar Imóvel
            </Button>
            {/*botão pra sair do sistema*/}

            <Button variant="outlined" color="error" onClick={handleLogout}>
              Sair
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Lista de imóveis todos*/}
      {!imoveisFiltrados || imoveisFiltrados.length === 0 ? (
        <Typography variant="h6" sx={{ mt: 3, textAlign: "center" }}>
          {imovel.length === 0
            ? "Nenhum imóvel cadastrado ainda."
            : "Nenhum imóvel encontrado com o filtro aplicado"}
        </Typography>
      ) : (
        //cartão para aparecer as informações dos imoveis
        <Box sx={{ p: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
          {imoveisFiltrados.map((item) => (
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
