const Sequelize = require("sequelize");

const sequelize = new Sequelize("SDEO", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = {
  Sequelize: Sequelize,
  sequelize: sequelize,
};

sequelize
  .authenticate()
  .then(function () {
    console.log("[DATABASE] Conectado com sucesso!");
  })
  .catch(function (erro) {
    console.log("[DATABASE] Erro: " + erro);
  });
