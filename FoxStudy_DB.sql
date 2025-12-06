CREATE DATABASE FoxStudy_DB;
USE FoxStudy_DB;
drop database FoxStudy_DB;


CREATE TABLE Usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);
CREATE TABLE Materia (
    id_materia INT PRIMARY KEY AUTO_INCREMENT,
    nome_materia VARCHAR(100) NOT NULL,
    tipo_materia VARCHAR(100) NOT NULL,
    usuario_id INT,
    progresso INT DEFAULT 0,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id_usuario)
);
CREATE TABLE Flashcard (
    id_flashcard INT PRIMARY KEY AUTO_INCREMENT,
    pergunta TEXT NOT NULL,
    resposta TEXT NOT NULL,
    materia_id INT NOT NULL,
    FOREIGN KEY (materia_id) REFERENCES Materia(id_materia) ON DELETE CASCADE
);
ALTER TABLE Usuario
ADD COLUMN preferencia_tema VARCHAR(50) DEFAULT 'default';
SELECT * FROM Usuario;
SELECT * FROM Materia;