--Criação da tabela Usuario
CREATE TABLE Usuario (
    cpf VARCHAR PRIMARY KEY,
    data_nascimento DATE,
    nome_usuario VARCHAR,
    Senha VARCHAR
);

--Criação da tabela Locador
-- locador_cpf = chave estrangeira e primária
CREATE TABLE Locador (
    locador_cpf VARCHAR PRIMARY KEY, 
    FOREIGN KEY (locador_cpf) REFERENCES Usuario (cpf)
);

--Criação da tabela Inquilino
-- inquilino_cpf = chave estrangeira e primária
CREATE TABLE Inquilino (
    inquilino_cpf VARCHAR PRIMARY KEY,
    estuda BOOLEAN,
    trabalha BOOLEAN,
    genero VARCHAR,
    FOREIGN KEY (inquilino_cpf) REFERENCES Usuario (cpf)
);

--Criação da tabela Imovel
CREATE TABLE Imovel (
    id_imovel SERIAL PRIMARY KEY,
    nome_imovel VARCHAR,
    locador_cpf VARCHAR,
    regras_convivencia VARCHAR,
    publico VARCHAR,
    endereco_rua VARCHAR,
    endereco_bairro VARCHAR,
    endereco_numero INTEGER,
    endereco_cidade VARCHAR,
    endereco_estado VARCHAR,
    endereco_pais VARCHAR,
    id_tipo INTEGER,
    endereco_cep VARCHAR,
    endereco_complemento VARCHAR
);

--Criação da tabela Tipo (tipo do imóvel)
CREATE TABLE Tipo (
    id_tipo SERIAL PRIMARY KEY,
    nome_tipo VARCHAR
);

--Criação da tabela Unidade_moradia
CREATE TABLE Unidade_moradia (
    id_um SERIAL PRIMARY KEY,
    nome_um VARCHAR,
    preco_aluguel DECIMAL(10, 2),
    disponivel BOOLEAN,
    completo BOOLEAN,
    descricao VARCHAR,
    id_imovel INTEGER,
    id_categoria_um INTEGER
);

--Criação da tabela Categoria_um (da unidade de moradia)
CREATE TABLE Categoria_um (
    categoria_da_um VARCHAR,
    id_categoria_um SERIAL PRIMARY KEY
);

--Criação da tabela Despesa
CREATE TABLE Despesa (
    id_despesa SERIAL PRIMARY KEY,
    preco DECIMAL(10, 2),
    descricao VARCHAR,
    pontual BOOLEAN,
    id_imovel INTEGER,
    id_categoria INTEGER,
    id_pagamento INTEGER,
    data DATE
);

--Criação da tabela Categoria (da despesa)
CREATE TABLE Categoria (
    id_categoria SERIAL PRIMARY KEY,
    nome_categoria VARCHAR
);

--Criação da tabela Imagens
CREATE TABLE Imagens (
    foto VARCHAR PRIMARY KEY,
    id_um INTEGER
);

--Criação da tabela Contrato
CREATE TABLE Contrato (
    id_contrato SERIAL PRIMARY KEY,
    pdf VARCHAR,
    preco DECIMAL(10, 2),
    data_fim DATE,
    data_inicio DATE,
    contrato_ativo BOOLEAN,
    id_um INTEGER,
    inquilino_cpf VARCHAR
);

--Criação da tabela Pagamento
CREATE TABLE Pagamento (
    id_pagamento SERIAL PRIMARY KEY,
    ano_referencia INTEGER,
    mes_referencia VARCHAR,
    data_pagamento DATE,
    pdf VARCHAR,
    pago BOOLEAN,
    id_contrato INTEGER
);

--Criação da tabela Chat
CREATE TABLE Chat (
    id_chat SERIAL PRIMARY KEY,
    nome_chat VARCHAR,
    foto VARCHAR
);

--Criação da tabela Mensagem
CREATE TABLE Mensagem (
    id_mensagem SERIAL PRIMARY KEY,
    texto VARCHAR,
    id_chat INTEGER,
    cpf_usuario_autor VARCHAR,
    data_mensagem DATE
);

--Criação da tabela Usuario_chat
CREATE TABLE Usuario_chat (
    id_chat INTEGER,
    cpf_usuario VARCHAR,
    PRIMARY KEY (id_chat, cpf_usuario)
);
 
ALTER TABLE Imovel ADD CONSTRAINT fk_locador_cpf
    FOREIGN KEY (locador_cpf)
    REFERENCES Locador (locador_cpf);

ALTER TABLE Imovel ADD CONSTRAINT fk_id_tipo
    FOREIGN KEY (id_tipo)
    REFERENCES Tipo (id_tipo);

 
ALTER TABLE Unidade_moradia ADD CONSTRAINT fk_id_imovel
    FOREIGN KEY (id_imovel)
    REFERENCES Imovel (id_imovel);

ALTER TABLE Unidade_moradia ADD CONSTRAINT fk_categoria_da_um
    FOREIGN KEY (id_categoria_um)
    REFERENCES Categoria_um (id_categoria_um);
 
ALTER TABLE Despesa ADD CONSTRAINT fk_id_categoria
    FOREIGN KEY (id_categoria)
    REFERENCES Categoria (id_categoria);

ALTER TABLE Despesa ADD CONSTRAINT fk_id_pagamento
    FOREIGN KEY (id_pagamento)
    REFERENCES Pagamento (id_pagamento);

ALTER TABLE Despesa ADD CONSTRAINT fk_imovel
    FOREIGN KEY (id_imovel)
    REFERENCES Imovel (id_imovel);
 
ALTER TABLE Imagens ADD CONSTRAINT fk_um
    FOREIGN KEY (id_um)
    REFERENCES Unidade_moradia (id_um);
 
ALTER TABLE Contrato ADD CONSTRAINT fk_inquilino
    FOREIGN KEY (inquilino_cpf)
    REFERENCES Inquilino (inquilino_cpf);

ALTER TABLE Contrato ADD CONSTRAINT fk_um
    FOREIGN KEY (id_um)
    REFERENCES Unidade_moradia (id_um);
 
ALTER TABLE Pagamento ADD CONSTRAINT fk_contrato
    FOREIGN KEY (id_contrato)
    REFERENCES Contrato (id_contrato);
 
ALTER TABLE Mensagem ADD CONSTRAINT fk_chat
    FOREIGN KEY (id_chat)
    REFERENCES Chat (id_chat);

ALTER TABLE Mensagem ADD CONSTRAINT fk_usuario_autor
    FOREIGN KEY (cpf_usuario_autor)
    REFERENCES Usuario (cpf);
 
ALTER TABLE Usuario_chat ADD CONSTRAINT fk_chat
    FOREIGN KEY (id_chat)
    REFERENCES Chat (id_chat);

ALTER TABLE Usuario_chat ADD CONSTRAINT fk_usuario
    FOREIGN KEY (cpf_usuario) 
    REFERENCES Usuario (cpf);



INSERT INTO Tipo (nome_tipo) VALUES
('Apartamento'),
('Pensão'),
('Kitnet'),
('Casa');

INSERT INTO Imovel (nome_imovel, locador_cpf, regras_convivencia, publico, endereco_rua, endereco_bairro, endereco_numero, endereco_cidade, endereco_estado, endereco_pais, id_tipo, endereco_cep, endereco_complemento) VALUES
('Pensão das Flores', '11122233344', 'Não fumar. Não fazer barulho após as 22h.', 'Apenas mulheres', 'Rua das Flores', 'Centro', 100, 'Chapecó', 'SC', 'Brasil', 2, '89800-000', 'Perto da universidade'),
('Edifício Central', '12312312312', 'Permitido animais de pequeno porte.', 'Todos', 'Avenida Principal', 'Efapi', 2020, 'Chapecó', 'SC', 'Brasil', 1, '89801-123', 'Bloco A');
