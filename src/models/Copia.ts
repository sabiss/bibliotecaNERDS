import mongoose, { Schema } from "mongoose";
import ferramentas from "../funcoesAuxiliares/ferramentas";

const copiaSchema = new mongoose.Schema({
  idLivro: { type: mongoose.Schema.ObjectId, ref: "livros", required: true },
  codigoDeIdentificacao: { type: Number },
  emprestado: { type: Boolean, default: false },
});

copiaSchema.pre("save", async function (next) {
  this.codigoDeIdentificacao = await ferramentas.gerarCodigoParaCopias();
  next();
});

const copias = mongoose.model("Copias", copiaSchema);

export default copias;
