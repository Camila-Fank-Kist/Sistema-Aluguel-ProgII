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



INSERT INTO Usuario (cpf, data_nascimento, nome_usuario, Senha) VALUES
('11122233344', '1990-05-15', 'locador_dono', 'senha_segura_123'),
('55566677788', '2000-10-20', 'inquilino_maria', 'senha_maria_456'),
('99988877766', '1998-02-01', 'inquilino_joao', 'senha_joao_789'),
('12312312312', '1985-01-30', 'locador_adm', 'senha_adm_101');

INSERT INTO Tipo (nome_tipo) VALUES
('Apartamento'),
('Pensão'),
('Kitnet'),
('Casa');

INSERT INTO Categoria (nome_categoria) VALUES
('Água'),
('Luz'),
('Internet'),
('Manutenção'),
('IPTU');

INSERT INTO Categoria_um (categoria_da_um) VALUES
('Quarto Individual'),
('Quarto Compartilhado'),
('Apartamento 2 Quartos'),
('Kitnet Mobiliada');

INSERT INTO Chat (nome_chat, foto) VALUES
('Grupo - Pensão Flores', 'url_foto_grupo_1.png'),
('Negociação - Apto 101', NULL);



INSERT INTO Locador (locador_cpf) VALUES
('11122233344'),
('12312312312');

INSERT INTO Inquilino (inquilino_cpf, estuda, trabalha, genero) VALUES
('55566677788', TRUE, TRUE, 'Feminino'),
('99988877766', FALSE, TRUE, 'Masculino');



INSERT INTO Imovel (nome_imovel, locador_cpf, regras_convivencia, publico, endereco_rua, endereco_bairro, endereco_numero, endereco_cidade, endereco_estado, endereco_pais, id_tipo, endereco_cep, endereco_complemento) VALUES
('Pensão das Flores', '11122233344', 'Não fumar. Não fazer barulho após as 22h.', 'Apenas mulheres', 'Rua das Flores', 'Centro', 100, 'Chapecó', 'SC', 'Brasil', 2, '89800-000', 'Perto da universidade'),
('Edifício Central', '12312312312', 'Permitido animais de pequeno porte.', 'Todos', 'Avenida Principal', 'Efapi', 2020, 'Chapecó', 'SC', 'Brasil', 1, '89801-123', 'Bloco A');



INSERT INTO Unidade_moradia (nome_um, preco_aluguel, disponivel, completo, descricao, id_imovel, id_categoria_um) VALUES
('Quarto 01', 800.00, TRUE, FALSE, 'Quarto individual mobiliado com banheiro compartilhado.', 1, 1),
('Quarto 02', 750.00, FALSE, FALSE, 'Quarto individual menor, sem mobília.', 1, 1),
('Apartamento 101', 1500.00, TRUE, TRUE, 'Apartamento completo com 2 quartos e sacada.', 2, 3);



INSERT INTO Imagens (foto, id_um) VALUES
('url_foto_quarto1_cama.png', 1),
('url_foto_quarto1_banheiro.png', 1),
('url_foto_apto3_sala.png', 3),
('url_foto_apto3_cozinha.png', 3);


INSERT INTO Contrato (pdf, preco, data_fim, data_inicio, contrato_ativo, id_um, inquilino_cpf) VALUES
('url_contrato_maria.pdf', 750.00, '2026-11-17', '2025-11-18', TRUE, 2, '55566677788'),
('url_contrato_joao.pdf', 1500.00, '2026-05-01', '2025-05-01', TRUE, 3, '99988877766');



INSERT INTO Pagamento (ano_referencia, mes_referencia, data_pagamento, pdf, pago, id_contrato) VALUES
(2025, 'Novembro', '2025-11-10', 'url_comprovante_maria_nov.pdf', TRUE, 1),
(2025, 'Novembro', '2025-11-05', 'url_comprovante_joao_nov.pdf', TRUE, 2);



INSERT INTO Despesa (preco, descricao, pontual, id_imovel, id_categoria, id_pagamento, data) VALUES
(120.50, 'Conta de água da Pensão', FALSE, 1, 1, 1, '2025-11-15'),
(300.00, 'Conta de luz da Pensão', FALSE, 1, 2, 1, '2025-11-16'),
(80.00, 'Taxa de condomínio Apto', FALSE, 2, 5, 2, '2025-11-10');



INSERT INTO Usuario_chat (id_chat, cpf_usuario) VALUES
(1, '11122233344'), -- Locador no 'Grupo - Pensão Flores'
(1, '55566677788'), -- Inquilina Maria no 'Grupo - Pensão Flores'
(2, '11122233344'), -- Locador na 'Negociação - Apto 101'
(2, '99988877766'); -- Inquilino João na 'Negociação - Apto 101'

INSERT INTO Mensagem (texto, id_chat, cpf_usuario_autor, data_mensagem) VALUES
('Olá pessoal, bem-vindos ao grupo da pensão!', 1, '11122233344', '2025-11-18'),
('Oi! Obrigada!', 1, '55566677788', '2025-11-18'),
('Olá, tenho interesse no apartamento. Está disponível?', 2, '99988877766', '2025-04-20');