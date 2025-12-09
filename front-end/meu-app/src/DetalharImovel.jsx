//mostra todas as informações do imóvel e deleta ele
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import * as React from "react";

export default function detalharImovel({ handleLogout }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    //abre o alerta de exclusão do imóvel
    setOpen(true);
  };

  const handleClose = () => {
    //fecha o alerta de exclusão do imóvel
    setOpen(false);
  };
  const location = useLocation(); //pega o imóvel com todas as suas informações enviadas de outro componente para serem usadas aqui
  const navigate = useNavigate(); //serve para navegar para outro endereço
  const { imovel_detalhar: imovel, cpf } = location.state || {};

  //camila, aqui é contigo
  function adicionarUM() {
    try {
      navigate(`/imovel/`);
    } catch {
      console.log("Falha no botão de inserção da unidade de moradia");
    }
  }

  function editarImovel() {
    //usado para enviar ir pro endereço de atualização com
    try {
      navigate(`/imovel/${imovel.locador_cpf}/${imovel.id}/editar`, {
        state: {
          //state serve para enviar os dados para InsercaoImovel
          cpf,
          number: 2, //number diferencia se está sendo atualizado ou adicionado um imóvel
          imovel,
        },
      });
      console.log("Imóvel editado com sucesso!");
    } catch {
      //em caso de erro
      console.log("Falha no botão de detalhes do imóvel");
    }
  }

  async function deletarImovel() {
    //usado para deletar
    try {
      const response = await axios.delete(
        `http://localhost:3002/imovel/${imovel.id}/excluir`
      );
      navigate(`/imovel/${imovel.cpf}`); //retorna para a tela com todos os imóveis exibidos
      console.log("Imóvel excluído");
    } catch (error) {
      //em caso de erro
      console.log("Erro ao excluir imóvel:", error);
    }
  }

  return (
    <>
      <AppBar //formatação da barra verde
        position="static"
        sx={{
          backgroundColor: "#89c56eff",
          paddingY: 2,
          width: "100%",
        }}
      >
        {/* nome do sistema*/}
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Sua casa, sua vida
          </Typography>

          {/* botões na barra verde*/}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<AddCircleIcon />}
              sx={{ color: "#fff", borderColor: "#fff" }}
              onClick={() => navigate(criandoImoveis)}
            >
              Adicionar Imóvel
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
              {/* exibição de todos os detalhes do imóvel*/}
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
              {/* mensagem de alerta*/}
              <DialogTitle id="alert-dialog-title">
                {"Deseja excluir esse imóvel?"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Depois de excluir, não é possível revertê-lo
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={deletarImovel}>Sim</Button>
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
        onClick={() => navigate("/imovel/:cpf")} //retorna para tela com todos os imóveis
      >
        Voltar
      </Button>
    </>
  );
}
