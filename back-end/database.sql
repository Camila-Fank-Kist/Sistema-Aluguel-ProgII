--Criação da tabela Locador
-- locador_cpf = chave estrangeira e primária
CREATE TABLE Locador (
    cpf VARCHAR PRIMARY KEY,
    data_nascimento DATE,
    nome VARCHAR,
    senha VARCHAR
);

--Criação da tabela Inquilino
-- inquilino_cpf = chave estrangeira e primária
CREATE TABLE Inquilino (
    cpf VARCHAR PRIMARY KEY,
    data_nascimento DATE,
    nome VARCHAR,
    senha VARCHAR,
    estuda BOOLEAN,
    trabalha BOOLEAN,
    genero VARCHAR
);

--Criação da tabela Imovel
CREATE TABLE Imovel (
    id SERIAL PRIMARY KEY,
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

create table permissao
(
  id bigint  NOT NULL,
  descricao varchar NOT NULL,
  PRIMARY KEY (id)
);

create table locador_permissao
(
  cpf varchar NOT NULL,
  id_permissao bigint NOT NULL,
  PRIMARY KEY (cpf, id_permissao),
  CONSTRAINT FK_usuario_permissao_usuario FOREIGN KEY (cpf) REFERENCES locador (cpf),
  CONSTRAINT FK_usuario_permissao_permissao FOREIGN KEY (id_permissao) REFERENCES permissao (id)
);

create table inquilino_permissao
(
  cpf varchar NOT NULL,
  id_permissao bigint NOT NULL,
  PRIMARY KEY (cpf, id_permissao),
  CONSTRAINT FK_usuario_permissao_usuario FOREIGN KEY (cpf) REFERENCES inquilino (cpf),
  CONSTRAINT FK_usuario_permissao_permissao FOREIGN KEY (id_permissao) REFERENCES permissao (id)
);

 
ALTER TABLE Imovel ADD CONSTRAINT fk_locador_cpf
    FOREIGN KEY (locador_cpf)
    REFERENCES Locador (cpf);

ALTER TABLE Imovel ADD CONSTRAINT fk_id_tipo
    FOREIGN KEY (id_tipo)
    REFERENCES Tipo (id_tipo);

 
ALTER TABLE Unidade_moradia ADD CONSTRAINT fk_id_imovel
    FOREIGN KEY (id_imovel)
    REFERENCES Imovel (id);

ALTER TABLE Unidade_moradia ADD CONSTRAINT fk_categoria_da_um
    FOREIGN KEY (id_categoria_um)
    REFERENCES Categoria_um (id_categoria_um);
 
 
ALTER TABLE Imagens ADD CONSTRAINT fk_um
    FOREIGN KEY (id_um)
    REFERENCES Unidade_moradia (id_um);
 
ALTER TABLE Contrato ADD CONSTRAINT fk_inquilino
    FOREIGN KEY (inquilino_cpf)
    REFERENCES Inquilino (cpf);

ALTER TABLE Contrato ADD CONSTRAINT fk_um
    FOREIGN KEY (id_um)
    REFERENCES Unidade_moradia (id_um);

INSERT INTO Locador (cpf, data_nascimento, nome, senha) VALUES 
('111.111.111-11', '1987-10-10', 'João da Silva', '1234'),
('222.222.222-22', '1964-08-25', 'Mariana Vieira', '5678');


INSERT INTO Inquilino (cpf, data_nascimento, nome, senha, estuda, trabalha, genero)
VALUES ('333.333.333-33', '2004-05-18', 'Lucas Silva Souza', 'senha', true, true, 'masculino');


INSERT INTO Tipo (nome_tipo) VALUES
('Apartamento'),
('Pensão'),
('Kitnet'),
('Casa');

INSERT INTO Imovel (nome_imovel, locador_cpf, regras_convivencia, publico, endereco_rua, endereco_bairro, endereco_numero, endereco_cidade, endereco_estado, endereco_pais, id_tipo, endereco_cep, endereco_complemento) VALUES
('Pensão das Flores', '111.111.111-11', 'Não fumar. Não fazer barulho após as 22h.', 'Apenas mulheres', 'Rua das Flores', 'Centro', 100, 'Chapecó', 'SC', 'Brasil', 2, '89800-000', 'Perto da universidade'),
('Edifício Central', '222.222.222-22', 'Permitido animais de pequeno porte.', 'Todos', 'Avenida Principal', 'Efapi', 2020, 'Chapecó', 'SC', 'Brasil', 1, '89801-123', 'Bloco A');

INSERT INTO permissao (id, descricao) VALUES (1, 'TELA_LOCADOR');
INSERT INTO permissao (id, descricao) VALUES (2, 'TELA_INQUILINO') ;

INSERT INTO locador_permissao (cpf, id_permissao) VALUES ('111.111.111-11', 1);

INSERT INTO inquilino_permissao (cpf, id_permissao) VALUES ('333.333.333-33', 2);
