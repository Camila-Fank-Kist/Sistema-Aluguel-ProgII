const express = require("express");
const cors = require("cors");
const imovelRouter = require("./controllers/imovel-controller");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3002;
app.listen(PORT, () => console.log(`Servidor está rodando na porta ${PORT}.`));

app.use("/imovel", imovelRouter);
