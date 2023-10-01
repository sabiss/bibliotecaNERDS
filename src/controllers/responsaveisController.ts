import mongoose from "mongoose";
import bcrypt from "bcrypt";
import livros from "../models/Livro";
import responsaveis from "../models/Responsavel";
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
      return res.status(500).send({ message: "Erro ao cadastrar livro" });
    }
  };
  static realizarEmprestimoDeLivro = async (req, res) => {
    const idDoLivro = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(idDoLivro)) {
      return res.status(400).send({ message: "iD do livro inválido" });
    }
    try {
      const livroASerEmprestado = await livros.findById(idDoLivro);

      if (!livroASerEmprestado) {
        return res.status(404).send({ message: "Livro não encontrado" });
      }
      if ((livroASerEmprestado.quantidade = 0)) {
        return res
          .status(422)
          .send({ message: "Não há mais cópias disponíveis para emprestimo" });
      }
      await livros.findByIdAndUpdate(idDoLivro, {
        quantidade: (livroASerEmprestado.quantidade -= 1),
      });

      return res.status(200).send({
        message: `Livro "${livroASerEmprestado.titulo}" emprestado com sucesso`,
      });
    } catch (err) {
      return res
        .status(500)
        .send({ message: "erro ao fazer empréstimo de livro" });
    }
  };
  static logarNoSistema = async (req, res) => {
    const { email, senha } = req.body;
    try {
      const responsavel = await responsaveis.findOne({ email: email });
      //testes para saber exstência dos dados de login
      if (!responsavel) {
        return res.status(404).send({ message: "usuário não encontrado" });
      }
      if (!email) {
        return res.status(400).send({ message: "digite o email" });
      }
      if (!senha) {
        return res.status(400).send({ message: "digite a senha" });
      }

      const senhaCerta = await bcrypt.compare(
        `${senha}`,
        `${responsavel.senha}`
      );
      if (!senhaCerta) {
        return res.status(400).send({ message: "Senha inválida" });
      }
      const token = jwt.sign(
        //payload chave e header
        {
          id: responsavel._id,
        },
        `${process.env.APP_SECRET}`,
        {
          expiresIn: "1h",
        }
      );
      return res.status(200).send({ message: `seu token - ${token}` });
    } catch (erro) {
      res.status(500).send({ message: "Erro ao realizar login" });
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
  static deletarLivro = async (req, res) => {
    const id = req.params.iD;
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
