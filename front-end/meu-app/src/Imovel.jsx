import axios from "axios";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export default function Imovel() {
  const [imovel, setImovel] = useState([]);

  const columns = [
    { field: "id", headerName: "id", width: 100 },
    {
      field: "regras_convivencia",
      headerName: "Regras de Convivência",
      width: 500,
    },
    { field: "publico", headerName: "Público", width: 400 },
    { field: "endereco_rua", headerName: "Rua do imóvel", width: 400 },
    { field: "endereco_bairro", headerName: "Bairro do imóvel", width: 400 },
    { field: "endereco_numero", headerName: "Número do imóvel", width: 400 },
    { field: "endereco_cidade", headerName: "Cidade do imóvel", width: 400 },
    { field: "endereco_estado", headerName: "Estado do imóvel", width: 400 },
    { field: "endereco_pais", headerName: "País do imóvel", width: 400 },
    { field: "endereco_cep", headerName: "CEP do imóvel", width: 400 },
    { field: "endereco_complemento", headerName: "Complemento", width: 400 },
    { field: "id_tipo", headerName: "Tipo do imóvel", width: 400 },
    {
      field: "locador_cpf",
      headerName: "CPF do locador do imóvel",
      width: 400,
    },
    { field: "nome_imovel", headerName: "Nome do imóvel", width: 400 },
  ];

  const buscarImovel = async () => {
    try {
      const request = await axios.get("http://localhost:3002/imovel/todos");
      setImovel(request.data.imovel);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    buscarImovel();
  }, []);

  return (
    <Box sx={{ height: 400, width: 1000 }}>
      <DataGrid rows={imovel} columns={columns} />
    </Box>
  );
}
