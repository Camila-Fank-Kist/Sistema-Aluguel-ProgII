--Criação da tabela locador
-- locador_cpf = chave estrangeira e primária
CREATE TABLE locador (
    cpf VARCHAR PRIMARY KEY,
    data_nascimento DATE,
    nome VARCHAR,
    senha VARCHAR
);

--Criação da tabela inquilino
-- inquilino_cpf = chave estrangeira e primária
CREATE TABLE inquilino (
    cpf VARCHAR PRIMARY KEY,
    data_nascimento DATE,
    nome VARCHAR,
    senha VARCHAR,
    estuda BOOLEAN,
    trabalha BOOLEAN,
    genero VARCHAR
);

--Criação da tabela imovel
CREATE TABLE imovel (
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

--Criação da tabela tipo (tipo do imóvel)
CREATE TABLE tipo (
    id_tipo SERIAL PRIMARY KEY,
    nome_tipo VARCHAR
);

--Criação da tabela unidade_moradia
CREATE TABLE unidade_moradia (
    id_um SERIAL PRIMARY KEY,
    nome_um VARCHAR,
    preco_aluguel DECIMAL(10, 2),
    disponivel BOOLEAN,
    completo BOOLEAN,
    descricao VARCHAR,
    id_imovel INTEGER,
    id_categoria_um INTEGER
);

--Criação da tabela categoria_um (da unidade de moradia)
CREATE TABLE categoria_um (
    categoria_da_um VARCHAR,
    id_categoria_um SERIAL PRIMARY KEY
);


--Criação da tabela imagens
CREATE TABLE imagens (
    foto VARCHAR PRIMARY KEY,
    id_um INTEGER
);

--Criação da tabela contrato
CREATE TABLE contrato (
    id_contrato SERIAL PRIMARY KEY,
    pdf VARCHAR,
    preco DECIMAL(10, 2),
    data_fim DATE,
    data_inicio DATE,
    contrato_ativo BOOLEAN,
    id_um INTEGER,
    inquilino_cpf VARCHAR
);

-- fazendo o service de contrato, percebi uma inconsistência no que havíamos feito até agora
-- tive que criar uma nova tabela (contrato_inquilino), senão ia quebrar ou com o que a gente tinha pensado (de que uma unidade de moradia pode ter vários inquilinos), ou com a lógica de verificar se a unidade está disponível, porque:
-- se uma unidade pudesse ter vários contratos, não daria pra fazer uma verificação simples de disponibilidade (verificar se existe um contrato ativo na unidade). A unidade teria que ficar disponível enquanto houvessem vagas na unidade ou se o locador colocasse ela como indisponível.
-- então, pra manter a lógica simples de disponibilidade (uma unidade só pode ter um contrato ativo por vez), e ao mesmo tempo permitir que uma unidade tenha vários inquilinos (contratos), criei essa tabela intermediária contrato_inquilino, que relaciona os contratos com os inquilinos
-- mas daí conversando com uma pessoa, descobri que geralmente é só uma pessoa que assina o contrato, mesmo que sejam várias pessoa que vão morar na mesma "unidade de moradia". Dessa forma, decidi não criar essa tabela que relaciona contrato com inquilino, e achei melhor criar uma tabela "moradores", por exemplo, que vai listar todas as pessoas que moram na unidade de moradia. Daí além de ser mais parecido com o mundo real, achei que ia ficar mais simples e organizado.
CREATE TABLE moradores (
    id_morador SERIAL PRIMARY KEY,
    nome VARCHAR NOT NULL,
    cpf VARCHAR, 
    data_nascimento DATE,
    id_contrato INTEGER NOT NULL,
    CONSTRAINT FK_id_contrato FOREIGN KEY (id_contrato) REFERENCES contrato (id_contrato)
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

 
ALTER TABLE imovel ADD CONSTRAINT fk_locador_cpf
    FOREIGN KEY (locador_cpf)
    REFERENCES locador (cpf);

ALTER TABLE imovel ADD CONSTRAINT fk_id_tipo
    FOREIGN KEY (id_tipo)
    REFERENCES tipo (id_tipo);

 
ALTER TABLE unidade_moradia ADD CONSTRAINT fk_id_imovel
    FOREIGN KEY (id_imovel)
    REFERENCES imovel (id);

ALTER TABLE unidade_moradia ADD CONSTRAINT fk_categoria_da_um
    FOREIGN KEY (id_categoria_um)
    REFERENCES categoria_um (id_categoria_um);
 
 
ALTER TABLE imagens ADD CONSTRAINT fk_um
    FOREIGN KEY (id_um)
    REFERENCES unidade_moradia (id_um);
 
ALTER TABLE contrato ADD CONSTRAINT fk_inquilino
    FOREIGN KEY (inquilino_cpf)
    REFERENCES inquilino (cpf);

ALTER TABLE contrato ADD CONSTRAINT fk_um
    FOREIGN KEY (id_um)
    REFERENCES unidade_moradia (id_um);

INSERT INTO locador (cpf, data_nascimento, nome, senha) VALUES 
('111.111.111-11', '1987-10-10', 'João da Silva', '1234'),
('222.222.222-22', '1964-08-25', 'Mariana Vieira', '5678');


INSERT INTO inquilino (cpf, data_nascimento, nome, senha, estuda, trabalha, genero)
VALUES ('333.333.333-33', '2004-05-18', 'Lucas Silva Souza', 'senha', true, true, 'masculino');


INSERT INTO tipo (nome_tipo) VALUES
('Apartamento'),
('Pensão'),
('Kitnet'),
('Casa');

INSERT INTO imovel (nome_imovel, locador_cpf, regras_convivencia, publico, endereco_rua, endereco_bairro, endereco_numero, endereco_cidade, endereco_estado, endereco_pais, id_tipo, endereco_cep, endereco_complemento) VALUES
('Pensão das Flores', '111.111.111-11', 'Não fumar. Não fazer barulho após as 22h.', 'Apenas mulheres', 'Rua das Flores', 'Centro', 100, 'Chapecó', 'SC', 'Brasil', 2, '89800-000', 'Perto da universidade'),
('Edifício Central', '222.222.222-22', 'Permitido animais de pequeno porte.', 'Todos', 'Avenida Principal', 'Efapi', 2020, 'Chapecó', 'SC', 'Brasil', 1, '89801-123', 'Bloco A');

INSERT INTO permissao (id, descricao) VALUES (1, 'TELA_LOCADOR');
INSERT INTO permissao (id, descricao) VALUES (2, 'TELA_INQUILINO') ;

INSERT INTO locador_permissao (cpf, id_permissao) VALUES ('111.111.111-11', 1);

INSERT INTO inquilino_permissao (cpf, id_permissao) VALUES ('333.333.333-33', 2);


INSERT INTO categoria_um (categoria_da_um) VALUES ('Quarto'), ('Apartamento'), ('Casa'), ('Kitnet'), ('Studio');

INSERT INTO contrato (pdf, preco, data_fim, data_inicio, contrato_ativo, id_um, inquilino_cpf) VALUES
('contrato_001.pdf', 800.00, '2025-12-31', '2025-01-01', true, 3, '22233344455'),
('contrato_002.pdf', 1200.00, '2025-06-30', '2024-07-01', false, 4, '33344455566'),
('contrato_003.pdf', 800.00, '2025-12-31', '2025-01-01', false, 3, '22233344455'),
('contrato_004.pdf', 800.00, '2025-12-31', '2025-01-01', false, 3, '22233344455'),
-- ('contrato_003.pdf', 950.00, '2026-03-15', '2025-03-15', true, 5, '44455566677'),
-- ('contrato_004.pdf', 1500.00, '2024-12-31', '2024-01-01', false, 6, '55566677788'),
-- ('contrato_005.pdf', 700.00, '2026-01-31', '2025-02-01', true, 7, '66677788899');
