import mongoose from "mongoose";
import bcrypt from "bcrypt";
import livros from "../models/Livro";
import responsaveis from "../models/Responsavel";
import emprestimos from "../models/Emprestimo";
import jwt from "jsonwebtoken";

class responsaveisController {
  static cadastrarLivro = async (req, res) => {
    //não vou colocar os testes para garantir que todos os atributos de um livro venham na requisição POIS no front esses campos vão ser OBRIGATÓRIOS no forms

    const novoLivro = new livros(req.body);

    try {
      await novoLivro.save();

      return res
        .status(201)
        .send({ message: "Novo livro cadastrado com Sucesso!" });
    } catch (err) {
      return res
        .status(500)
        .send({ message: `Erro ao cadastrar livro - ${err}` });
    }
  };
  static realizarEmprestimoDeLivro = async (req, res) => {
    const { idLivro, idUsuario } = req.body;

    if (!mongoose.Types.ObjectId.isValid(idLivro)) {
      return res.status(400).send({ message: "iD do livro inválido" });
    }
    if (!mongoose.Types.ObjectId.isValid(idUsuario)) {
      return res.status(400).send({ message: "iD do usuário inválido" });
    }

    const livroASerEmprestado = await livros.findById(idLivro);
    const emprestimosJaFeitos = await emprestimos.countDocuments({
      idLivro: idLivro,
    });
    console.log(emprestimosJaFeitos);

    if (!livroASerEmprestado) {
      return res.status(404).send({ message: "Livro não encontrado" });
    }

    const emprestimoRepetido = await emprestimos.countDocuments({
      idLivro: idLivro,
      idUsuario: idUsuario,
    });

    if (emprestimoRepetido) {
      return res
        .status(500)
        .send({ message: "Esse usuário ja pegou este livro emprestado" });
    }
    if (emprestimosJaFeitos < livroASerEmprestado.quantidade) {
      //verifica se ainda há cópias disponíveis
      const dataAtual = new Date();
      const dia = dataAtual.getDate();
      const mes = dataAtual.getMonth();
      const ano = dataAtual.getFullYear();
      const dataEmprestimo = `${dia}/${mes}/${ano}`;
      const dataDevolucao = `${dia}/${mes + 1}/${ano}`;

      const novoEmprestimo = new emprestimos({
        idUsuario,
        idLivro,
        dataEmprestimo,
        dataDevolucao,
      });
      try {
        await novoEmprestimo.save();
        return res
          .status(201)
          .send({ message: "Empréstimo realizado com sucesso!" });
      } catch (err) {
        return res
          .status(500)
          .send({ message: `Erro ao realizar emprésimo -  ${err}` });
      }
    }
  };
  static listarLivros = async (req, res) => {
    try {
      const lista = await livros.find();

      if (lista.length == 0) {
        return res.status(200).send({ message: "Não há livros cadastrados" });
      }
      res.status(200).json(lista);
    } catch (err) {
      return res
        .status(500)
        .send({ message: `Erro ao buscar livros para listagem - ${err}` });
    }
  };
  static listarEmprestimos = async (req, res) => {
    try {
      const listaDeEmprestimos = await emprestimos
        .find()
        .populate("idUsuario")
        .populate("idLivro");
      if (listaDeEmprestimos.length == 0) {
        res.status(200).send({ message: "Não há empréstimos realizados" });
      }
      return res.status(200).json(listaDeEmprestimos);
    } catch (err) {
      return res
        .status(500)
        .send({ message: `Erro ao listar empréstimo já feitos - ${err}` });
    }
  };
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
}

export default responsaveisController;
