const database = require("./database");

const Ordem = database.sequelize.define(
  "Ordem",
  {
    numeroOrdem: {
      type: database.Sequelize.INTEGER,
      primaryKey: true,
    },
    observacaoOrdem: {
      type: database.Sequelize.STRING,
    },
    /*ordemRemovida: {
      type: database.Sequelize.TINYINT(1),
    },*/
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

//Cria a tabela
//Ordem.sync({ force: false });

module.exports = Ordem;
