-- Criação do banco de dados
CREATE DATABASE Aboa;


\c Aboa;

-- Tabela Cliente
CREATE TABLE Cliente (
    ID_Cliente SERIAL PRIMARY KEY,
    Nome VARCHAR (120),
    Endereco VARCHAR (155),
    Telefone VARCHAR (14),
    Email VARCHAR (100)
);

-- Tabela Favorito
CREATE TABLE Favorito (
    idFavorito SERIAL PRIMARY KEY,
    Cliente_ID_Cliente INTEGER REFERENCES Cliente(ID_Cliente)
);

-- Tabela Avaliacao
CREATE TABLE Avaliacao (
    idAvaliacao SERIAL PRIMARY KEY,
    Cliente_ID_Cliente INTEGER REFERENCES Cliente(ID_Cliente),
    DataAvaliacao TIMESTAMP,
    Nota DOUBLE PRECISION,
    Comentario VARCHAR (500)
);

-- Tabela HistoricoAvaliacao
CREATE TABLE HistoricoAvaliacao (
    idHistoricoAvaliacao SERIAL PRIMARY KEY,
    Avaliacao_idAvaliacao INTEGER REFERENCES Avaliacao(idAvaliacao)
);

-- Tabela Restaurante
CREATE TABLE Restaurante (
    idRestaurante SERIAL PRIMARY KEY,
    HistoricoAvaliacao_idHistoricoAvaliacao INTEGER REFERENCES HistoricoAvaliacao(idHistoricoAvaliacao),
    Preferencia_Comida_idPreferencia_Comida INTEGER,
    Favorito_idFavorito INTEGER REFERENCES Favorito(idFavorito),
    NomeSocial VARCHAR (155),
    Capacidade INT,
    Distancia GEOMETRY,
    Endereco_RT VARCHAR (155),
    Telefone_RT VARCHAR (42)
);

-- Tabela Categoria
CREATE TABLE Categoria (
    idCategoria SERIAL PRIMARY KEY,
    Restaurante_idRestaurante INTEGER REFERENCES Restaurante(idRestaurante),
    NomeCategoria VARCHAR (120)
);

-- Tabela Forma_Pagamento
CREATE TABLE Forma_Pagamento (
    idForma_Pagamento SERIAL PRIMARY KEY,
    Restaurante_idRestaurante INTEGER REFERENCES Restaurante(idRestaurante),
    NomeFormaPagamento VARCHAR (120)
);

-- Tabela Cardapio
CREATE TABLE Cardapio (
    idCardapio SERIAL PRIMARY KEY,
    Restaurante_idRestaurante INTEGER REFERENCES Restaurante(idRestaurante),
    Preco DOUBLE PRECISION,
    CategoriaCardapio VARCHAR,
    Item_Descricao VARCHAR,
    Item_Nome VARCHAR
);

-- Tabela Busca
CREATE TABLE Busca (
    idBusca SERIAL PRIMARY KEY,
    Cliente_ID_Cliente INTEGER REFERENCES Cliente(ID_Cliente),
    DataHora TIMESTAMP,
    Termo_Busca VARCHAR
);

-- Tabela Preferencia_Comida
CREATE TABLE Preferencia_Comida (
    idPreferencia_Comida SERIAL PRIMARY KEY,
    Busca_idBusca INTEGER REFERENCES Busca(idBusca),
    Preferencia_Comida VARCHAR,
    Preferencia_Bebida VARCHAR,
    Preferencia_Momento VARCHAR
);

-- Adiciona a FK de Preferencia_Comida na tabela Restaurante
ALTER TABLE Restaurante
    ADD CONSTRAINT fk_preferencia_comida
    FOREIGN KEY (Preferencia_Comida_idPreferencia_Comida) REFERENCES Preferencia_Comida(idPreferencia_Comida);
