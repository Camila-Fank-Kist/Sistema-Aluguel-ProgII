import axios from "axios";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export default function Locador() {
  const [locador, setLocador] = useState([]);

  const columns = [
    { field: "cpf", headerName: "CPF", width: 100 },
    { field: "nome_usuario", headerName: "Nome do Usuário", width: 500 },
    { field: "data_nascimento", headerName: "Data de Nascimento", width: 400 },
    { field: "senha", headerName: "Senha", width: 400 },
  ];

  const buscarLocador = async () => {
    try {
      const request = await axios.get("http://localhost:3002/locador/todos");
      setLocador(request.data.locador);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    buscarLocador();
  }, []);

  return (
    <Box sx={{ height: 400, width: 1000 }}>
      <DataGrid rows={locador} columns={columns} />
    </Box>
  );
}
