import mongoose from "mongoose";

const emprestimoSchema = new mongoose.Schema({
  idUsuario: {
    type: mongoose.Schema.ObjectId,
    ref: "usuarios",
    required: true,
  },
  idLivro: {
    type: mongoose.Schema.ObjectId,
    ref: "livros",
    required: true,
  },
  numeroDaCopia: { type: String, required: true },
  dataEmprestimo: { type: String, default: Date.now },
  dataDevolucao: { type: String, required: true },
  emprestimoAtivo: { type: Boolean, default: true },
});

const emprestimos = mongoose.model("emprestimos", emprestimoSchema);

export default emprestimos;
