import mongoose from "mongoose";

const emprestimoSchema = new mongoose.Schema({
  nomeUsuario: {
    type: String,
    required: true,
  },
  tituloLivro: { type: String, required: true },
  cpf: { type: String, required: true},
  numeroDaCopia: { type: String, required: true },
  dataEmprestimo: { type: String, default: Date.now },
  dataDevolucao: { type: String, required: true },
  emprestimoAtivo: { type: Boolean, default: true },
});

const emprestimos = mongoose.model("emprestimos", emprestimoSchema);

export default emprestimos;
