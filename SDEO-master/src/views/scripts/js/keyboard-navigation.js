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
