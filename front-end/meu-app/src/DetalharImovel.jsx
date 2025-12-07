import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  CardActionArea,
  TextField,
  Box,
  AppBar,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Toolbar,
  CardActions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid"; //porque é um pacote específico pra esse
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useState, useEffect } from "react";
import * as React from "react";
import Imovel from "./Imovel";

export default function detalharImovel({ handleLogout }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const location = useLocation();
  const navigate = useNavigate();
  const { imovel_detalhar: imovel, cpf } = location.state || {};

  //camila, aqui é contigo
  function adicionarUM() {
    try {
      navigate(`/imovel/`);
      //console.log("toto");
      //console.log(cpf);
    } catch {
      console.log("Falha no botão de inserção da unidade de moradia");
    }
  }

  function editarImovel() {
    try {
      navigate(`/imovel/${imovel.locador_cpf}/${imovel.id}/editar`, {
        state: {
          cpf,
          number: 2,
          imovel,
          alerta: "Imóvel atualizado com sucesso!",
        },
      });
      console.log("toto");
      console.log(cpf);
    } catch {
      console.log("Falha no botão de detalhes do imóvel");
    }
  }

  async function deletarImovel() {
    try {
      const response = await axios.delete(
        `http://localhost:3002/imovel/${imovel.id}/excluir`
      );
      alert("Imóvel excluído com sucesso!");
      navigate(`/imovel/${imovel.cpf}`);
      console.log("Imóvel excluído");
    } catch (error) {
      //em caso de erro
      console.log("Erro ao excluir imóvel:", error);
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

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<AddCircleIcon />}
              sx={{ color: "#fff", borderColor: "#fff" }}
              onClick={() => navigate(criandoImoveis)}
            >
              Adicionar Imóvel
            </Button>
            <Button variant="outlined" color="error" onClick={handleLogout}>
              Sair
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Card sx={{ maxWidth: 345 }}>
        <CardActionArea>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {imovel.nome_imovel}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Rua: {imovel.endereco_rua}
              <br /> Número: {imovel.endereco_numero}
              <br /> Bairro:
              {imovel.endereco_bairro}
              <br /> Cidade: {imovel.endereco_cidade}
              <br />
              Estado: {imovel.endereco_estado}
              <br /> País:{imovel.endereco_pais}
              <br />
              CEP: {imovel.endereco_cep}
              <br /> Complemento:
              {imovel.endereco_complemento}
              <br />
              Tipo: {imovel.id_tipo}
              <br /> Regras de Convivência:
              {imovel.regras_convivencia}
              <br /> Público: {imovel.publico}
              <br />
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size="small" color="primary" onClick={adicionarUM}>
            Adicionar Unidade de Moradia
          </Button>
        </CardActions>
        <CardActions>
          <Button size="small" color="primary" onClick={editarImovel}>
            Editar
          </Button>
        </CardActions>
        <CardActions>
          <React.Fragment>
            <Button size="small" color="primary" onClick={handleClickOpen}>
              Excluir
            </Button>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Deseja excluir esse imóvel?"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Depois de excluir, não é possível revertê-lo
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={deletarImovel} autoFocus>
                  Sim
                </Button>
                <Button onClick={handleClose}>Não</Button>
              </DialogActions>
            </Dialog>
          </React.Fragment>
        </CardActions>
      </Card>
      <Button
        variant="contained"
        size="small"
        color="primary"
        onClick={() => navigate("/imovel/:cpf")}
      >
        Voltar
      </Button>
    </>
  );
}
