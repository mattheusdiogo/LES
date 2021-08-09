const express = require("express");
const app = express();
const http = require("http");
const socketio = require("socket.io");
const bodyParser = require("body-parser");
const path = require("path");
const Ordem = require("../models/Ordem");
//const Imagem = require("../models/Imagem");
//const { Op } = require("sequelize");
const server = http.createServer(app);
const io = socketio(server);

server.listen(1234);

// body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// rotas
app.set("views", path.join(__dirname, "../../dist"));
app.use(express.static(path.join(__dirname, "../../dist")));
app.use("/", express.static(__dirname + "../../dist/index"));
app.use("/", express.static(__dirname + "../../dist/cadastro-Ordem"));
app.use("/", express.static(__dirname + "../../dist/Ordem"));
app.use("/", express.static(__dirname + "../../dist/resultados-busca"));

io.on("connection", (socket) => {
  console.log("[SERVER-SIDE] Socket conectado:", socket.id);
  //Busca
  socket.on("busca", (numeroDigitado) => {
    BuscarOrdem(numeroDigitado);
  });
  //Cadastro
  socket.on("cadastro", (numeroDigitado) => {
    CadastrarOrdem(numeroDigitado);
  });
  //Exclusão
  socket.on("exclusao", (numeroOrdem) => {
    ExluirOrdem(numeroOrdem);
  });
  socket.on("conferirObservacao", (numeroOrdem) => {
    ConferirObservacao(numeroOrdem);
  });
  socket.on("alteracaoObservacao", (novaObservacao, numeroOrdem) => {
    AlterarObservacao(novaObservacao, numeroOrdem);
  });
  socket.on("adicaoImagemPre", async (imagem) => {
    const buffer = Buffer.from(imagem, "base64");
    console.log(buffer.length);
    io.emit("imagemVolta", imagem);
  });
});

// funções database
async function BuscarOrdem(numeroOrdemDigitado) {
  const cadastrado = await Ordem.count({
    where: {
      numeroOrdem: numeroOrdemDigitado,
    },
  });
  if (cadastrado) {
    io.emit("sucessoBusca", true);
  } else {
    io.emit("sucessoBusca", false);
  }
}

function CadastrarOrdem(numeroOrdemDigitado) {
  if (
    Ordem.findAll({
      where: { numeroOrdem: numeroOrdemDigitado },
    })
  ) {
    Ordem.create({
      numeroOrdem: numeroOrdemDigitado,
    })
      .then(() => {
        console.log("[CADASTRO] Ordem cadastrada com sucesso!");
        io.emit("sucessoCadastro", true);
      })
      .catch((erro) => {
        console.log(
          "[CADASTRO] Erro: Não foi possível cadastrar a Ordem: " + erro
        );
        io.emit("sucessoCadastro", false);
      });
  } else {
    console.log("[CADASTRO] Erro: Ordem já existe");
    io.emit("sucessoCadastro", false);
  }
}

function ExluirOrdem(numeroOrdemDigitado) {
  Ordem.destroy({ where: { numeroOrdem: numeroOrdemDigitado } })
    .then(() => {
      console.log("[EXCLUSÃO] Ordem removida com sucesso!");
      io.emit("sucessoExclusao", true);
    })
    .catch((erro) => {
      console.log("[EXCLUSÃO] Erro: Não foi possível exluir a ordem: " + erro);
      io.emit("sucessoExclusao", false);
    });
}

async function AlterarObservacao(novaObservacao, numeroOrdem) {
  await Ordem.update(
    { observacaoOrdem: novaObservacao },
    {
      where: {
        numeroOrdem: numeroOrdem,
      },
    }
  )
    .then(() => {
      console.log("[OBSERVAÇÃO] Observação atualizada com sucesso!");
      io.emit("resultadoAlteracaoObservacao", true);
    })
    .catch((erro) => {
      console.log(
        "[OBSERVAÇÃO] Erro: Não foi possível atualizar a observação: " + erro
      );
      io.emit("resultadoAlteracaoObservacao", false);
    });
}

async function ConferirObservacao(numeroOrdem) {
  const ordem = await Ordem.findOne({
    where: {
      numeroOrdem: numeroOrdem,
    },
  });
  if (ordem.observacaoOrdem !== null) {
    io.emit("temObservacao", ordem.observacaoOrdem);
  } else {
    io.emit("temObservacao", null);
  }
}
