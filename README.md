# Sistema de Aluguel desenvolvido para Web
Este projeto é um sistema de aluguel desenvolvido no Projeto Integrador do curso de Ciência da Computação juntamente com as disicplinas de Engenharia de Software, Banco de Dados I e Programação II

# Autoras 
- Camila Fank Kist
- Maria Fernanda Fernandes Costa

# Tecnologias
- React
- JavaScript
- JSX
- HTML

# Bibliotecas instaladas para execução do código:
## Back-end:
- axios
- bcrypt
- cors
- express
- passport
- cls-hooked
- express-session
- jsonwebtoken
- passport-local
- pg-hstore
- pg
- prettier
- sequelize
  
## Front-end:
- @emotion/react
- @emotion/styled
- @eslint/js
- @mui/icons-material
- @mui/material
- @mui/x-data-grid
- @mui/x-date-pickers
- @types/react-dom
- @types/react
- @vitejs/plugin-react
- axios
- eslint-plugin-react-hooks
- eslint-plugin-react-refresh
- eslint
- globals
- passport-local
- react-dom
- react-router-dom
- react
- vite

# Comandos para funcionamento do código:
## Back-end:
- abra o terminal e acesse a pasta back-end
- digite o comando "nodemon server.js"
- quando aparecer a frase "Servidor está rodando na porta 3002" significa que o back-end está funcionando

## Front-end:
- abra o terminal e acesse a pasta front-end
- dogite o comando "mpm run dev"
- copie o link no seu navegador e acesse o sistema

# Funcionamento do sistema
O sistema foi desenvolvido tanto para pessoas que procuram uma moradia por aluguel quanto para aqueles que procuram anunciar seus imóveis disponíveis para locação. 
Nesse sentido, o sistema foi pensado de forma a facilitar a comunicação entre ambos os usuários. Nesse trabalho, foram desenvolvidas apenas as telas principais, como Login, Cadastro do Usuário, Imóvel, Unidade de Moradia e Contrato.

**Para fazer uso do sistema é necessário instalar as bibliotecas acima!**

A princípio, a tela de login é a primeira do sistema. Nela, o usuário deve inserir seu CPF e senha cadastrados no sistema, mas caso ainda não tenha cadastro, deve clicar no botão Cadastrar, marcar se está em busca de moradia ou se 
pretende alugar um imóvel e informar seus dados pessoais requisitados.
O sistema retornará a tela de login, na qual o usuário já cadastrado deve inserir seu CPF e senha corretamente.
Se ele marcou que pretende alugar seu(s) imóvel(is), após logar no sistema, aparecerá a tela de imóveis, a qual exibe todos os imóveis do usuário cadastrados no sistema. Nesse contexto, o locador tem a liberdade de cadastrar um novo 
imóvel, atualizar os dados de um imóvel e excluir um imóvel.
Mas se o usuário marcou que está em busca de uma moradia, após logar no sistema, aparecerá a(s) unidade(s) de moradia alugada(s) pelo usuário, na qual ele consegue acessar para verificar os dados do imóvel e o contrato com o locador. 
