CREATE DATABASE SDEO;

USE SDEO;

CREATE TABLE `Ordem` (
  `numeroOrdem` INT NOT NULL,
  `observacaoOrdem` VARCHAR(255),
  PRIMARY KEY (`numeroOrdem`)
) ENGINE = InnoDB DEFAULT CHARSET = UTF8 COLLATE = utf8_general_ci;

CREATE TABLE `Imagem` (
  `numeroImagem` INT NOT NULL AUTO_INCREMENT,
  `numeroOrdem` INT NOT NULL,
  `imagemPreExecucao` VARCHAR(2097152),
  `imagemPosExecucao` VARCHAR(2097152),
  PRIMARY KEY (`numeroImagem`)
) ENGINE = InnoDB DEFAULT CHARSET = UTF8 COLLATE = utf8_general_ci AUTO_INCREMENT = 1;

ALTER TABLE
  Imagem
ADD
  INDEX(numeroOrdem);

ALTER TABLE
  Imagem
ADD
  FOREIGN KEY (numeroOrdem) REFERENCES Ordem(numeroOrdem);