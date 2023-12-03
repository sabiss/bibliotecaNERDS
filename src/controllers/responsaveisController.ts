import { AtrasoInfo } from "../interfaces/ferramentas";
import { EmprestimoAtrasado } from "../interfaces/emprestimoAtrasado";
import { Emprestimo } from "../interfaces/emprestimo";
import mongoose from "mongoose";
import livros from "../models/Livro";
import emprestimos from "../models/Emprestimo";
import copias from "../models/Copia";
import usuarios from "../models/Usuario";
import ferramentas from "../funcoesAuxiliares/ferramentas";

class responsaveisController {
  static cadastrarLivro = async (req, res) => {
    const novoLivro = new livros(req.body);
    try {
      const isbnEmUso = await livros.findOne({ isbn: req.body.isbn });
      const livroExiste = await livros.findOne({ titulo: req.body.titulo });

      if (isbnEmUso) {
        console.log("isbn")
        return res
          .status(400)
          .send({ message: "Já há um livro cadastrado com esse isbn" });
      } else if (livroExiste) {
        return res
          .status(400)
          .send({ message: "Já há um livro cadastrado com esse título" });
      }

      await novoLivro.save();
      return res.status(201).send({
        message: `Novo livro criado com Sucesso!`,
      });
    } catch (err) {
      return res
        .status(500)
        .send({ message: `Erro ao cadastrar livro - ${err}` });
    }
  };
  static realizarEmprestimoDeLivro = async (req, res) => {
    const { tituloDoLivro, cpf, numeroDaCopia } = req.body;

    const livro = await livros.findOne({ titulo: tituloDoLivro });
    if (!livro) {
      return res.status(404).send({ message: "Livro não encontrado" });
    }
    const usuario = await usuarios.findOne({ cpf: cpf });
    if (!usuario) {
      return res.status(404).send({ message: "Nenhum usuário cadastrado possui esse CPF" });
    }

    const copiaParaEmprestar = await copias.findOne({
      idLivro: livro._id,
      codigoDeIdentificacao: numeroDaCopia,
    });

    if (!copiaParaEmprestar) {
      return res
        .status(404)
        .send({ message: "cópia não encontrada ou não pertence a este livro" });
    }
    if (copiaParaEmprestar.emprestado == true) {
      return res.status(400).send({
        message: "Essa cópia já foi emprestada e não está mais disponível",
      });
    }

    const emprestimoRepetido = await emprestimos.findOne({
      nomeUsuario: usuario.nome,
      tituloLivro: livro.titulo,
      emprestimoAtivo: true,
    });

    if (emprestimoRepetido) {
      return res
        .status(400)
        .send({ message: "Este Usuário já está livro emprestado" });
    }
    const { dataEmprestimo, dataDevolucao } = req.body;

    if(!dataDevolucao || !dataEmprestimo){
      res.status(400).send({message: "Informe as duas datas"})
    }
    try {
      const emprestimo = new emprestimos({
        nomeUsuario: usuario.nome,
        cpf: usuario.cpf,
        tituloLivro: livro.titulo,
        numeroDaCopia: numeroDaCopia,
        dataEmprestimo,
        dataDevolucao,
      });
      await emprestimo.save();
      await copiaParaEmprestar.updateOne({ emprestado: true });
      return res.status(200).send({ message: "Livro emprestado com sucesso" });
    } catch (err) {
      return res
        .status(500)
        .send({ message: `Erro ao realizar empréstimo - ${err}` });
    }
  };
  static registrarDevolucaoDeLivro = async (req, res) => {
    const { nomeLivro, cpf, numeroDaCopia } = req.body;

    const livro = await livros.findOne({ titulo: nomeLivro });
    const usuario = await usuarios.findOne({ cpf: cpf });

    if (!livro) {
      return res.status(404).send({ message: "Livro não encontrado" });
    }
    if (!usuario) {
      return res.status(404).send({ message: "Usuário não encontrado" });
    }

    const copiaEmprestada = await copias.findOne({
      codigoDeIdentificacao: numeroDaCopia,
      emprestado: true,
    });

    if (!copiaEmprestada) {
      return res
        .status(404)
        .send({ message: "Essa cópia não existe ou não foi emprestada" });
    }
    const emprestimo = await emprestimos.findOne({
      livro: livro._id,
      usuario: usuario._id,
      numeroDaCopia: numeroDaCopia,
      emprestimoAtivo: true,
    });

    if (!emprestimo) {
      return res.status(404).send({ message: "Este empréstimo não existe" });
    }

    try {
      await emprestimo.updateOne({ $set: { emprestimoAtivo: false } });
      await copiaEmprestada.updateOne({ $set: { emprestado: false } });

      return res.status(200).send({ message: "livro devolvido" });
    } catch (err) {
      return res
        .status(500)
        .send({ message: `Erro ao registrar devolução - ${err}` });
    }
  };
  static listarLivros = async (req, res) => {
    try {
      const lista = await livros.find();

      res.status(200).json(lista);//mesmo que dê zero quero que retorne
    } catch (err) {
      return res
        .status(500)
        .send({ message: `Erro ao buscar livros para listagem`, erro: err });
    }
  };
  static listarEmprestimosAtivos = async (req, res) => {
    try {
      const listaDeEmprestimos = await emprestimos.find({ emprestimoAtivo: true })
      return res.status(200).json(listaDeEmprestimos);
    } catch (err) {
      return res
        .status(500)
        .send({ message: `Erro ao listar empréstimo já feitos`, erro: err });
    }
  };
  static listasTodosOsEmprestimos = async (req, res) => {
    try {
      const listaDeEmprestimos = await emprestimos.find()
      return res.status(200).json(listaDeEmprestimos);
    } catch (err) {
      return res
        .status(500)
        .send({ message: `Erro ao listar empréstimo já feitos - ${err}` });
    }
  };
  static listarEmprestimosAtrasados = async (req, res)=>{
    try{
      const emprestimosAtivos: Emprestimo[] = await emprestimos.find({emprestimoAtivo: true})
      
      const listaAtrasados: EmprestimoAtrasado[] = []
  
      for(let emprestimo of emprestimosAtivos){
        const estaAtrasado: AtrasoInfo = ferramentas.indicarAtraso(emprestimo.dataEmprestimo, emprestimo.dataDevolucao)
  
        if(estaAtrasado.atrasado === true){
          const emprestimoAtrasado: EmprestimoAtrasado = {emprestimo, atraso: estaAtrasado.atraso}
          listaAtrasados.push(emprestimoAtrasado)
        }
      }
      return res.status(200).send(listaAtrasados)
    }catch(err){
      res.status(500).send({message: "Erro ao listar empréstimos atrasados", erro: err})
    }
  }
  static deletarLivro = async (req, res) => {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID de livro inválido" });
    }

    try {
      await livros.findByIdAndDelete(id);
      return res.status(200).send({ message: "Livro deletado com sucesso" });
    } catch (err) {
      return res
        .status(404)
        .send({ message: `Erro ao deletar livro - ${err}` });
    }
  };
  static adicionarCopiaDeLivro = async (req, res) => {
    const { titulo } = req.body;
    console.log(titulo)
    const livro = await livros.findOne({ titulo: titulo });

    if (!livro) {
      return res.status(404).send({ message: "Livro não encontrado" });
    }

    try {
      const copia = new copias({ idLivro: livro._id });
      await copia.save();

      return res.status(201).send({numero: copia.codigoDeIdentificacao});
    } catch (err) {
      return res.status(500).send({message: "Erro ao criar cópia do livro", erro: err})
    }
  };
  static listarCopias = async (req, res) => {
    const id = req.params.id;
    try {
      const lista = await copias.find({ idLivro: id }).populate("idLivro");
      return res.status(200).json(lista);
    } catch (err) {
      return res
        .status(404)
        .send({ message: `Cópias não encontradas para esse livro` });
    }
  };
  static buscarLivro = async(req, res)=>{
    const palavraChave = req.query.palavra
    try{
      const livrosEncontrados = await livros.find({ titulo: { $regex: new RegExp(palavraChave, 'i') } });
      res.status(200).send(livrosEncontrados)
    }catch(err){
      res.status(500).send({message: "Erro ao listar livros com título semelhante", erro: err})
    }
  }
}

export default responsaveisController;
