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
      return res.status(422).send({ message: "iD do livro inválido" });
    }
    try {
      const livroASerEmprestado = await livros.findById(idDoLivro);
      if (!livroASerEmprestado) {
        return res.status(404).send({ message: "Livro não encontrado" });
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
        return res.status(422).send({ message: "digite o email" });
      }
      if (!senha) {
        return res.status(422).send({ message: "digite a senha" });
      }

      const senhaCerta = await bcrypt.compare(
        `${senha}`,
        `${responsavel.senha}`
      );
      if (!senhaCerta) {
        return res.status(422).send({ message: "Senha inválida" });
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
}

export default responsaveisController;
