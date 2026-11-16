-- Modelo lógico
--   posicao (id PK, nome, sigla)
--   usuario (id PK, nome, email UNIQUE, senha, fk_posicao FK -> posicao.id)
-- Relacionamento: uma posição tem vários usuários (1:N).

CREATE DATABASE IF NOT EXISTS meu_volei;
USE meu_volei;

CREATE TABLE posicao (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(30) NOT NULL,
  sigla VARCHAR(5) NOT NULL
);

CREATE TABLE usuario (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(80) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  senha VARCHAR(100) NOT NULL,
  fk_posicao INT NOT NULL,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_usuario_posicao FOREIGN KEY (fk_posicao) REFERENCES posicao(id)
);

-- Inserção
INSERT INTO posicao (nome, sigla) VALUES
  ('Levantador','Lev'), ('Ponteiro','Pon'), ('Central','Cen'), ('Oposto','Op'), ('Líbero','Lib');

-- Consultas
SELECT * FROM usuario;
SELECT u.nome, u.email, p.nome AS posicao FROM usuario u JOIN posicao p ON p.id = u.fk_posicao;
SELECT p.nome AS posicao, COUNT(u.id) AS total
  FROM posicao p LEFT JOIN usuario u ON u.fk_posicao = p.id
  GROUP BY p.id, p.nome ORDER BY p.id;

-- Se a sua tabela usuario foi criada SEM a coluna criado_em, rode uma vez:
-- ALTER TABLE usuario ADD COLUMN criado_em DATETIME DEFAULT CURRENT_TIMESTAMP;
