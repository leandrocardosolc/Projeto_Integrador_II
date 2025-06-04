-- Criação do banco de dados
CREATE DATABASE Aboa;

-- Tabela Cliente
CREATE TABLE Cliente (
    ID_Cliente SERIAL PRIMARY KEY,
    Nome VARCHAR (120),
    Telefone VARCHAR (14),
    Email VARCHAR (100),
    SenhaRash TEXT,
	LogBusca TIMESTAMP,
    TermoBusca VARCHAR (100)
);

-- Tabela Cadastro
CREATE TABLE Cadastro (
    idCadastro SERIAL PRIMARY KEY,
    Rua VARCHAR (100),
    Cep INTEGER,
    Bairro VARCHAR (30),
    Cidade VARCHAR (50),
    Numero INTEGER,
    NomeSocial VARCHAR (100),
    InscricaoEstadual VARCHAR (100),
	CNPJ VARCHAR (100)
	
);

-- Tabela Avaliacao
CREATE TABLE Avaliacao (
    idAvaliacao SERIAL PRIMARY KEY,
    Cliente_ID_Cliente INTEGER REFERENCES Cliente(ID_Cliente),
    DataAvaliacao TIMESTAMP,
    Nota DOUBLE PRECISION,
    ComentarioAvaliacao VARCHAR (500)
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
    Cadastro_IdCadastro INTEGER REFERENCES Cadastro(IdCadastro),
	LatitudeLongitude GEOMETRY
);

-- Tabela Categoria
CREATE TABLE Categoria (
    idCategoria SERIAL PRIMARY KEY,
    Restaurante_idRestaurante INTEGER REFERENCES Restaurante(idRestaurante),
    Categoria VARCHAR (120),
    DescricaoCategoria VARCHAR (50)
);

-- Tabela Forma_Pagamento
CREATE TABLE Forma_Pagamento (
    idForma_Pagamento SERIAL PRIMARY KEY,
    Restaurante_idRestaurante INTEGER REFERENCES Restaurante(idRestaurante),
    FormaPagamento VARCHAR (120)
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

-- Tabela de Auditoria
CREATE TABLE Auditoria_Cardapio (
    idAuditoria SERIAL PRIMARY KEY,
    Operacao VARCHAR(10),              -- 'DELETE' ou 'UPDATE'
    idCardapio INTEGER,
    Restaurante_idRestaurante INTEGER,
    Preco DOUBLE PRECISION,
    CategoriaCardapio VARCHAR,
    Item_Descricao VARCHAR,
    Item_Nome VARCHAR,
    DataHoraOperacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

---------------------------------------------------------------------------

-- DELETE

CREATE OR REPLACE FUNCTION audita_delete_cardapio()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO Auditoria_Cardapio (
        Operacao, idCardapio, Restaurante_idRestaurante, Preco,
        CategoriaCardapio, Item_Descricao, Item_Nome
    )
    VALUES (
        'DELETE', OLD.idCardapio, OLD.Restaurante_idRestaurante, OLD.Preco,
        OLD.CategoriaCardapio, OLD.Item_Descricao, OLD.Item_Nome
    );
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- UPDATE
CREATE OR REPLACE FUNCTION audita_update_cardapio()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO Auditoria_Cardapio (
        Operacao, idCardapio, Restaurante_idRestaurante, Preco,
        CategoriaCardapio, Item_Descricao, Item_Nome
    )
    VALUES (
        'UPDATE', OLD.idCardapio, OLD.Restaurante_idRestaurante, OLD.Preco,
        OLD.CategoriaCardapio, OLD.Item_Descricao, OLD.Item_Nome
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--------------------------------------------------------------------

-- Trigger para DELETE
CREATE TRIGGER trg_auditoria_delete_cardapio
BEFORE DELETE ON Cardapio
FOR EACH ROW EXECUTE FUNCTION audita_delete_cardapio();

-- Trigger para UPDATE
CREATE TRIGGER trg_auditoria_update_cardapio
BEFORE UPDATE ON Cardapio
FOR EACH ROW EXECUTE FUNCTION audita_update_cardapio();

------------------------------------------------------------------------------

-- DOMAIN para CNPJ: formato numérico com 14 dígitos
CREATE DOMAIN dom_cnpj AS VARCHAR(14)
CHECK (VALUE ~ '^\d{14}$');

-- DOMAIN para Inscrição Estadual: até 12 caracteres alfanuméricos
CREATE DOMAIN dom_inscricao_estadual AS VARCHAR(12)
CHECK (VALUE ~ '^[A-Za-z0-9]{1,12}$');

-- DOMAIN para Cidade: somente 'Cotia'
CREATE DOMAIN dom_cidade_cotia AS VARCHAR(50)
CHECK (LOWER(VALUE) = 'cotia');

ALTER TABLE Cadastro
    ALTER COLUMN CNPJ TYPE dom_cnpj;

-- Aplicar dom_inscricao_estadual em Cadastro.InscricaoEstadual
ALTER TABLE Cadastro
    ALTER COLUMN InscricaoEstadual TYPE dom_inscricao_estadual;

-- Aplicar dom_cidade_cotia em Cadastro.Cidade
ALTER TABLE Cadastro
    ALTER COLUMN Cidade TYPE dom_cidade_cotia;


----------------------------------------------------

SELECT * FROM Restaurante;

INSERT INTO Cardapio (Restaurante_idRestaurante, Preco, CategoriaCardapio, Item_Descricao, Item_Nome)
VALUES (1, 29.90, 'Bebida', 'Refrigerante lata', 'Coca-Cola');

UPDATE Cardapio
SET Preco = 31.90
WHERE Item_Nome = 'Coca-Cola';

SELECT * FROM Auditoria_Cardapio;

-----------------------------------------------------

-- Inserir registro de teste
INSERT INTO Cardapio (Restaurante_idRestaurante, Preco, CategoriaCardapio, Item_Descricao, Item_Nome)
VALUES (1, 25.50, 'Bebidas', 'Refrigerante lata 350ml', 'Coca-Cola');

-- Deletar o registro inserido
DELETE FROM Cardapio WHERE idCardapio = (SELECT MAX(idCardapio) FROM Cardapio);

-- Ver auditoria para DELETE
SELECT * FROM Auditoria_Cardapio WHERE Operacao = 'DELETE' ORDER BY DataHoraOperacao DESC;



	