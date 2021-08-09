const formularioBusca = document.getElementById("formularioBusca");
const formularioCadastro = document.getElementById("formularioCadastro");
const formularioObservacao = document.getElementById("formularioObservacao");
const formularioObservacaoEdicao = document.getElementById(
  "formularioObservacaoEdicao"
);
const pagina = window.location.pathname;
const socket = io();

localStorage.setItem("numeroImagemPre", 0);
localStorage.setItem("limitePre", 0);
localStorage.setItem("limitePos", 0);
localStorage.setItem("numeroImagemPos", 0);
localStorage.setItem("houveExclusaoPre", 0);
localStorage.setItem("houveExclusaoPos", 0);

//Acessar ordem
function AcessarOrdem() {
  let numeroOrdem = localStorage.getItem("numeroOrdem");
  window.location = "ordem.html" + "?numero=" + numeroOrdem;
}

//Buscar ordem
if (pagina == "/index.html") {
  formularioBusca.addEventListener("submit", function (evento) {
    evento.preventDefault();
    let numeroDigitado = evento.target.elements.numeroBusca.value;
    if (
      String(numeroDigitado).length == 0 ||
      String(numeroDigitado).length > 4 ||
      numeroDigitado <= 0
    ) {
      document.getElementById("PopUpErroBuscaIntervalo").style.display = "flex";
    } else {
      localStorage.setItem("numeroOrdem", numeroDigitado);
      socket.emit("busca", numeroDigitado);
    }
  });
  socket.on("sucessoBusca", function (sucessoBusca) {
    if (sucessoBusca) {
      numeroOrdem = localStorage.getItem("numeroOrdem");
      AcessarOrdem();
    } else {
      document.getElementById("PopUpErroBusca").style.display = "flex";
    }
  });
}

//Cadastrar ordem buscada
function CadastrarOrdemBuscada() {
  let numeroBuscado = localStorage.getItem("numeroOrdem");
  socket.emit("cadastro", numeroBuscado);
  socket.on("sucessoCadastro", function () {
    AcessarOrdem();
  });
}

//Cadastrar ordem
if (pagina == "/cadastro-ordem.html") {
  formularioCadastro.addEventListener("submit", function (evento) {
    evento.preventDefault();
    let numeroDigitado = evento.target.elements.numeroCadastro.value;
    if (String(numeroDigitado).length == 0 || numeroDigitado <= 0) {
      document.getElementById("PopUpErroBuscaIntervalo").style.display = "flex";
    } else if (String(numeroDigitado).length > 4) {
      document.getElementById("PopUpErroBuscaIntervalo").style.display = "flex";
    } else {
      localStorage.setItem("numeroOrdem", numeroDigitado);
      socket.emit("cadastro", numeroDigitado);
    }
  });
  socket.on("sucessoCadastro", function (sucessoCadastro) {
    if (sucessoCadastro) {
      document.getElementById("PopUpCadastro").style.display = "flex";
    } else {
      document.getElementById("PopUpErroCadastroExiste").style.display = "flex";
    }
  });
}

if (pagina !== "/ordem.html") {
  localStorage.setItem("statusObservacao", "desatualizada");
}

if (pagina == "/ordem.html") {
  let numeroOrdem = localStorage.getItem("numeroOrdem");
  let observacao = localStorage.getItem("observacao");
  let statusObservacao = localStorage.getItem("statusObservacao");
  document.getElementById("conteudoObservacao").innerHTML = observacao;
  document.getElementById("TituloOrdem").innerHTML = "ordem #" + numeroOrdem;
  socket.emit("conferirObservacao", numeroOrdem);
  if (statusObservacao == "atualizada" && observacao == null) {
    document.getElementById("LinkOrdem").innerHTML = "adicionar observação";
  }
  //Imagens
  let inputImagemPre = document.getElementById("enviarImagemPre");
  inputImagemPre.addEventListener("change", function () {
    if (!this.files[0].name.match(/.(jpg|jpeg|png)$/i)) {
      document.getElementById("PopUpErroFormatoImagem").style.display = "flex";
    } else {
      let numeroImagemPre = localStorage.getItem("numeroImagemPre");
      CriarItemImagem(0);
      var imagemPre = "imagemPre" + String(++numeroImagemPre);
      var imagem = this.files[0];
      if (imagem) {
        const leitor = new FileReader();
        leitor.addEventListener("load", function () {
          document.getElementById(imagemPre).setAttribute("src", this.result);
        });
        leitor.readAsDataURL(imagem);
      }
    }
  });
  let inputImagemPos = document.getElementById("enviarImagemPos");
  inputImagemPos.addEventListener("change", function () {
    if (!this.files[0].name.match(/.(jpg|jpeg|png)$/i)) {
      document.getElementById("PopUpErroFormatoImagem").style.display = "flex";
    } else {
      let numeroImagemPos = localStorage.getItem("numeroImagemPos");
      CriarItemImagem(1);
      var imagemPos = "imagemPos" + String(++numeroImagemPos);
      var imagem = this.files[0];
      if (imagem) {
        const leitor = new FileReader();
        leitor.addEventListener("load", function () {
          document.getElementById(imagemPos).setAttribute("src", this.result);
        });
        leitor.readAsDataURL(imagem);
      }
    }
  });
  //Alteração/Cadastro observação
  formularioObservacao.addEventListener("submit", function (evento) {
    evento.preventDefault();
    let numeroOrdem = localStorage.getItem("numeroOrdem");
    let novaObservacao = evento.target.elements.inputObservacao.value;
    if (novaObservacao.length > 255) {
      document.getElementById("PopUpObservacaoVazia").style.display = "none";
      document.getElementById("PopUpErroEdicaoObservacao").style.display =
        "flex";
    } else if (novaObservacao.length <= 0) {
      localStorage.removeItem("observacao");
      socket.emit("alteracaoObservacao", null, numeroOrdem);
    } else {
      localStorage.setItem("statusObservacao", "desatualizada");
      socket.emit("alteracaoObservacao", novaObservacao, numeroOrdem);
    }
  });
  formularioObservacaoEdicao.addEventListener("submit", function (evento) {
    evento.preventDefault();
    let numeroOrdem = localStorage.getItem("numeroOrdem");
    let novaObservacao = evento.target.elements.inputObservacao.value;
    localStorage.setItem("observacao", novaObservacao);
    if (novaObservacao.length > 255) {
      document.getElementById("PopUpEdicaoObservacao").style.display = "none";
      document.getElementById("PopUpErroEdicaoObservacao").style.display =
        "flex";
    } else if (novaObservacao.length <= 0) {
      localStorage.removeItem("observacao");
      socket.emit("alteracaoObservacao", null, numeroOrdem);
    } else {
      localStorage.removeItem("observacao");
      localStorage.setItem("statusObservacao", "desatualizada");
      socket.emit("alteracaoObservacao", novaObservacao, numeroOrdem);
    }
  });
  socket.on("resultadoAlteracaoObservacao", function (sucessoAlteracao) {
    if (sucessoAlteracao) {
      location.reload();
    } else {
      document.getElementById("PopUpEdicaoObservacao").style.display = "none";
      document.getElementById("PopUpErroEdicaoObservacao").style.display =
        "flex";
    }
  });
  socket.on("sucessoCadastro", function (sucessoCadastro) {
    if (sucessoCadastro) {
      document.getElementById("PopUpCadastro").style.display = "flex";
    } else {
      document.getElementById("PopUpErroCadastroExiste").style.display = "flex";
    }
  });
  socket.on("sucessoExclusao", function (sucessoExclusao) {
    if (sucessoExclusao) {
      paraIndex();
    } else {
      document.getElementById("PopUpErroExclusaoOrdem").style.display = "flex";
    }
  });
  socket.on("temObservacao", function (temObservacao) {
    let statusObservacao = localStorage.getItem("statusObservacao");
    if (temObservacao !== null) {
      localStorage.setItem("observacao", temObservacao);
    } else {
      localStorage.removeItem("observacao");
    }
    let statusObservacao = localStorage.getItem("statusObservacao");
    if (statusObservacao == "desatualizada") {
      localStorage.setItem("statusObservacao", "atualizada");
      location.reload();
    }
  });
  socket.on("imagemVolta", function (buffer) {
    var image = new Image();
    image = "data:image/png;base64," + buffer;
    document.getElementById("imagemPopUp").setAttribute("src", image);
  });
}

//Acessar observação
function AcessarObservacao() {
  let observacao = localStorage.getItem("observacao");
  if (observacao == null) {
    document.getElementById("PopUpObservacaoVazia").style.display = "flex";
  } else {
    document.getElementById("PopUpObservacaoPreenchida").style.display = "flex";
  }
}

//Alterar observação
function ExibirConfirmacaoAlteracaoObservacao() {
  document.getElementById("PopUpEdicaoObservacao").style.display = "none";
  document.getElementById("PopUpConfirmacaoAlteracao").style.display = "flex";
}

//Confirma alterações na observação
function ConfirmarEdicaoObservacao() {
  let novaObservacao = evento.target.elements.inputObservacao.value;
  if (novaObservacao.length > 255) {
    document.getElementById("PopUpEdicaoObservacao").style.display = "none";
    document.getElementById("PopUpErroEdicaoObservacao").style.display = "flex";
  } else {
    let numeroOrdem = localStorage.getItem("numeroOrdem");
    localStorage.removeItem("observacao");
    socket.emit("alteracaoObservacao", novaObservacao, numeroOrdem);
  }
}

//Remover ordem
function ExibirConfirmacaoExclusaoOrdem() {
  document.getElementById("PopUpExclusao").style.display = "flex";
}

function ExcluirOrdem() {
  let numeroOrdem = localStorage.getItem("numeroOrdem");
  socket.emit("exclusao", numeroOrdem);
}

//Imagens
function CriarItemImagem(tipo) {
  if (tipo) {
    let numeroImagemPos = localStorage.getItem("numeroImagemPos");
    let limitePos = localStorage.getItem("limitePos");
    if (limitePos < 8) {
      if (limitePos == 7) {
        document.getElementById("inputImagemPosExecucao").style.display =
          "none";
      }
      localStorage.setItem("numeroImagemPos", ++numeroImagemPos);
      localStorage.setItem("limitePos", ++limitePos);
      let pictureBorder = document.createElement("div");
      let removeIconDiv = document.createElement("div");
      let imagem = document.createElement("img");
      let removeIcon = document.createElement("i");
      pictureBorder.className = "system__order-details__image-grid__picture";
      removeIconDiv.className =
        "system__order-details__image-grid__picture__remove";
      imagem.setAttribute("id", "imagemPos" + String(numeroImagemPos));
      let idImagem = "imagemPosQuadro" + String(numeroImagemPos);
      imagem.addEventListener("click", function (evento) {
        AmpliarImagem("imagemPos" + String(numeroImagemPos));
        evento.preventDefault();
      });
      removeIconDiv.addEventListener("click", function (evento) {
        RemoverImagem(idImagem, 1, false);
        evento.preventDefault();
      });
      pictureBorder.setAttribute(
        "id",
        "imagemPosQuadro" + String(numeroImagemPos)
      );
      removeIcon.className = "fas";
      removeIcon.classList.add("fa-times");
      removeIconDiv.appendChild(removeIcon);
      pictureBorder.appendChild(removeIconDiv);
      pictureBorder.appendChild(imagem);
      document.querySelector(".posExecucao").appendChild(pictureBorder);
    } else {
      console.log("imagemPos lotada");
    }
  } else {
    let numeroImagemPre = localStorage.getItem("numeroImagemPre");
    let limitePre = localStorage.getItem("limitePre");
    if (limitePre < 8) {
      if (limitePre == 7) {
        document.getElementById("inputImagemPreExecucao").style.display =
          "none";
      }
      localStorage.setItem("numeroImagemPre", ++numeroImagemPre);
      localStorage.setItem("limitePre", ++limitePre);
      let pictureBorder = document.createElement("div");
      let removeIconDiv = document.createElement("div");
      let imagem = document.createElement("img");
      let removeIcon = document.createElement("i");
      removeIconDiv.className =
        "system__order-details__image-grid__picture__remove";
      imagem.setAttribute("id", "imagemPre" + String(numeroImagemPre));
      let idImagem = "imagemPreQuadro" + String(numeroImagemPre);
      pictureBorder.className = "system__order-details__image-grid__picture";
      imagem.addEventListener("click", function (evento) {
        AmpliarImagem("imagemPre" + String(numeroImagemPre));
        evento.preventDefault();
      });
      removeIconDiv.addEventListener("click", function (evento) {
        RemoverImagem(idImagem, 0, 0);
        evento.preventDefault();
      });
      pictureBorder.setAttribute(
        "id",
        "imagemPreQuadro" + String(numeroImagemPre)
      );
      removeIcon.className = "fas";
      removeIcon.classList.add("fa-times");
      removeIconDiv.appendChild(removeIcon);
      pictureBorder.appendChild(removeIconDiv);
      pictureBorder.appendChild(imagem);
      document.querySelector(".preExecucao").appendChild(pictureBorder);
    } else {
      console.log("imagemPre lotada");
    }
  }
}

function AmpliarImagem(idImagem) {
  let imagem = document.getElementById(idImagem).src;
  let imagemPopUp = document.getElementById("imagemPopUp");
  imagemPopUp.setAttribute("src", imagem);
  document.getElementById("PopUpImagem").style.display = "flex";
  let downloadImagem = imagem.replace(
    /^data:image\/[^;]+/,
    "data:application/octet-stream"
  );
  document
    .getElementById("botaoBaixarImagem")
    .setAttribute("href", downloadImagem);
}

function RemoverImagem(idImagem, tipo, confirmou) {
  if (confirmou) {
    if (tipo == 1) {
      localStorage.setItem("houveExclusaoPos", true);
      document.getElementById(idImagem).remove();
      let limitePos = localStorage.getItem("limitePos");
      localStorage.setItem("limitePos", --limitePos);
      localStorage.setItem("primeiraVez", true);
      if (limitePos == 7 || eraOito) {
        ExibirBotaoAdicaoImagem(tipo);
        var eraOito = false;
      }
    } else {
      let limitePre = localStorage.getItem("limitePre");
      localStorage.setItem("limitePre", --limitePre);
      localStorage.setItem("houveExclusaoPre", true);
      document.getElementById(idImagem).remove();
      localStorage.setItem("primeiraVez", true);
      if (limitePre == 7 || eraOito) {
        ExibirBotaoAdicaoImagem(tipo);
        var eraOito = false;
      }
    }
  } else {
    localStorage.setItem("idImagem", idImagem);
    localStorage.setItem("imagemPos", tipo);
    document.getElementById("PopUpExclusaoImagem").style.display = "flex";
  }
}

function ExibirBotaoAdicaoImagem(tipo) {
  let primeiraVez = localStorage.getItem("primeiraVez");
  if (tipo == 1) {
    document.getElementById("inputImagemPosExecucao").style.display = "block";
  } else {
    document.getElementById("inputImagemPreExecucao").style.display = "block";
  }
  if (primeiraVez) {
    localStorage.removeItem("primeiraVez");
    //setTimeout(ExibirBotaoAdicaoImagem, 16);
  }
}

function ConfirmarRemocaoImagem() {
  let imagemPos = localStorage.getItem("imagemPos");
  let idImagem = localStorage.getItem("idImagem");
  RemoverImagem(idImagem, imagemPos, true);
  fecharPopUp();
  localStorage.removeItem("imagemPos");
  localStorage.removeItem("idImagem");
}

window.addEventListener("keydown", function (event) {
  if (event.key !== undefined) {
    if (event.key == "Enter") {
      document.activeElement.click();
    }
    if (event.key == "Escape") {
      fecharPopUp();
    }
    if (event.key == "F1") {
      event.preventDefault();
      abrirPainelAjuda();
    }
  }
});

var isPainelAjudaAberto = false;
var guiaAberto = "nenhum";

function paraIndex() {
  window.location = "index.html";
}

function paraCadastroOrdem() {
  window.location = "cadastro-ordem.html";
}

function abrirPainelAjuda() {
  if (isPainelAjudaAberto) {
    if (guiaAberto !== "nenhum") {
      if (guiaAberto == "consulta") {
        document.getElementById("AjudaConsulta").style.display = "none";
      } else if (guiaAberto == "cadastro") {
        document.getElementById("AjudaCadastro").style.display = "none";
      } else if (guiaAberto == "alteracao") {
        document.getElementById("AjudaAlteracao").style.display = "none";
      } else if (guiaAberto == "adicaoImagem") {
        document.getElementById("AjudaAdicaoImagem").style.display = "none";
      } else if (guiaAberto == "remocaoImagem") {
        document.getElementById("AjudaRemocaoImagem").style.display = "none";
      } else if (guiaAberto == "extra") {
        document.getElementById("AjudaExtra").style.display = "none";
      }
      document.querySelector(".modal-ajuda__content__items").style.display =
        "block";
      guiaAberto = "nenhum";
      isPainelAjudaAberto = true;
    } else {
      document.querySelector(".modal-ajuda").style.display = "none";
      isPainelAjudaAberto = false;
    }
  } else {
    document.querySelector(".modal-ajuda").style.display = "flex";
    document.querySelector(".modal-ajuda__content__items").style.display =
      "block";
    isPainelAjudaAberto = true;
  }
}

function abrirItemAjuda(item) {
  document.querySelector(".modal-ajuda__content__items").style.display = "none";
  if (item == "consulta") {
    document.getElementById("AjudaConsulta").style.display = "block";
    guiaAberto = "consulta";
  } else if (item == "cadastro") {
    document.getElementById("AjudaCadastro").style.display = "block";
    guiaAberto = "cadastro";
  } else if (item == "alteracao") {
    document.getElementById("AjudaAlteracao").style.display = "block";
    guiaAberto = "alteracao";
  } else if (item == "adicaoImagem") {
    document.getElementById("AjudaAdicaoImagem").style.display = "block";
    guiaAberto = "adicaoImagem";
  } else if (item == "remocaoImagem") {
    document.getElementById("AjudaRemocaoImagem").style.display = "block";
    guiaAberto = "remocaoImagem";
  } else if (item == "extra") {
    document.getElementById("AjudaExtra").style.display = "block";
    guiaAberto = "extra";
  }
}

function fecharPopUp() {
  if (isPainelAjudaAberto) {
    document.querySelector(".modal-ajuda").style.display = "none";
    if (guiaAberto == "consulta") {
      document.getElementById("AjudaConsulta").style.display = "none";
    } else if (guiaAberto == "cadastro") {
      document.getElementById("AjudaCadastro").style.display = "none";
    } else if (guiaAberto == "alteracao") {
      document.getElementById("AjudaAlteracao").style.display = "none";
    } else if (guiaAberto == "adicaoImagem") {
      document.getElementById("AjudaAdicaoImagem").style.display = "none";
    } else if (guiaAberto == "remocaoImagem") {
      document.getElementById("AjudaRemocaoImagem").style.display = "none";
    } else if (guiaAberto == "extra") {
      document.getElementById("AjudaExtra").style.display = "none";
    }
    isPainelAjudaAberto = false;
    guiaAberto = "nenhum";
  }
  if (pagina == "/cadastro-ordem.html") {
    document.getElementById("PopUpCadastro").style.display = "none";
    document.getElementById("PopUpErroCadastroExiste").style.display = "none";
    document.getElementById("PopUpErroBuscaIntervalo").style.display = "none";
  }
  if (pagina == "/index.html" || pagina == "/resultados-busca.html") {
    document.getElementById("PopUpErroBusca").style.display = "none";
    document.getElementById("PopUpErroBuscaIntervalo").style.display = "none";
  }
  if (pagina == "/ordem.html") {
    document.getElementById("PopUpExclusao").style.display = "none";
    document.getElementById("PopUpObservacaoVazia").style.display = "none";
    document.getElementById("PopUpErroFormatoImagem").style.display = "none";
    document.getElementById("PopUpObservacaoPreenchida").style.display = "none";
    document.getElementById("PopUpEdicaoObservacao").style.display = "none";
    document.getElementById("PopUpConfirmacaoAlteracao").style.display = "none";
    document.getElementById("PopUpExclusaoImagem").style.display = "none";
    document.getElementById("PopUpImagem").style.display = "none";
    document.getElementById("PopUpErroEdicaoObservacao").style.display = "none";
  }
}

function AbrirPopUpCadastro() {
  document.getElementById("PopUpCadastro").style.display = "flex";
}

function AbrirPopUpEdicaoObservacao() {
  let observacao = localStorage.getItem("observacao");
  document.getElementById("PopUpObservacaoPreenchida").style.display = "none";
  document.getElementById("PopUpEdicaoObservacao").style.display = "flex";
  document.querySelector(".observacao-preenchida").value = observacao;
}
