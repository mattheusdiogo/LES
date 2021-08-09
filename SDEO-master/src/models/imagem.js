const database = require("./database");
const ordem = require("./Ordem");

const Imagem = database.sequelize.define(
  "Imagem",
  {
    numeroImagem: {
      type: database.Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    numeroOrdem: {
      type: database.Sequelize.INTEGER,
      model: "Ordem",
      key: "numeroOrdem",
      unique: true,
    },
    imagemPreExecucao: {
      type: database.Sequelize.STRING,
    },
    imagemPosExecucao: {
      type: database.Sequelize.STRING,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);
ordem.hasMany(Imagem, { foreignkey: "numeroOrdem" });

//Cria a tabela
//Imagem.sync({ force: false });

module.exports = Imagem;
