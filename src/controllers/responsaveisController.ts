import mongoose from "mongoose";
import livros from "../models/Livro";
import emprestimos from "../models/Emprestimo";
import copias from "../models/Copia";

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
    const { idLivro, idUsuario, numeroDaCopia } = req.body;

    if (!mongoose.Types.ObjectId.isValid(idLivro)) {
      return res.status(400).send({ message: "iD do livro inválido" });
    }
    if (!mongoose.Types.ObjectId.isValid(idUsuario)) {
      return res.status(400).send({ message: "iD do usuário inválido" });
    }

    const livroASerEmprestado = await livros.findById(idLivro);

    if (!livroASerEmprestado) {
      return res.status(404).send({ message: "Livro não encontrado" });
    }

    const emprestimoRepetido = await emprestimos.countDocuments({
      idLivro: idLivro,
      idUsuario: idUsuario,
      emprestimoAtivo: true,
    });

    if (emprestimoRepetido) {
      return res
        .status(500)
        .send({ message: "Esse usuário ja pegou este livro emprestado" });
    }
    const aCopiaEDesteLivro = await copias.find({
      idLivro: idLivro,
      codigoDeIdentificacao: numeroDaCopia,
    });

    if (aCopiaEDesteLivro.length <= 0) {
      return res.status(500).send({ message: "Esta cópia não é deste livro" });
    }

    const copiasDisponiveis = await copias.countDocuments({
      idLivro: idLivro,
      codigoDeIdentificacao: numeroDaCopia,
      emprestado: false,
    });

    if (copiasDisponiveis) {
      //verifica se ainda há cópias disponíveis
      const { dataEmprestimo, dataDevolucao } = req.body;
      const novoEmprestimo = new emprestimos({
        idUsuario,
        idLivro,
        dataEmprestimo,
        dataDevolucao,
        numeroDaCopia: numeroDaCopia,
      });

      try {
        await copias.findOneAndUpdate(
          //cópia emprestada
          { codigoDeIdentificacao: numeroDaCopia },
          { emprestado: true }
        );
        await novoEmprestimo.save(); //emprestimo feito
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
  static registrarDevolucaoDeLivro = async (req, res) => {
    const { idLivro, idUsuario, numeroDaCopia } = req.body;

    if (!mongoose.Types.ObjectId.isValid(idLivro)) {
      return res.status(400).send({ message: "iD do livro inválido" });
    }
    if (!mongoose.Types.ObjectId.isValid(idUsuario)) {
      return res.status(400).send({ message: "iD do usuário inválido" });
    }

    try {
      await emprestimos.findOneAndUpdate(
        { idLivro: idLivro, idUsuario: idUsuario, emprestimoAtivo: true },
        { emprestimoAtivo: false }
      );
      await copias.findOneAndUpdate(
        { codigoDeIdentificacao: numeroDaCopia },
        { emprestado: false }
      );
      return res
        .status(200)
        .send({ message: `Devolução registrada com sucesso!` });
    } catch (err) {
      return res
        .status(500)
        .send({ message: `Erro ao registrar devolução - ${err}` });
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
  static listarEmprestimosAtivos = async (req, res) => {
    try {
      const listaDeEmprestimos = await emprestimos
        .find({ emprestado: true })
        .populate({ path: "idUsuario", select: "-senha" })
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
  static listasTodosOsEmprestimos = async (req, res) => {
    try {
      const listaDeEmprestimos = await emprestimos
        .find()
        .populate({ path: "idUsuario", select: "-senha" })
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
  static adicionarCopiaDeLivro = async (req, res) => {
    const { idLivro } = req.body;
    if (!mongoose.Types.ObjectId.isValid(idLivro)) {
      return res.status(500).send({ message: "Este ID de livro não é válido" });
    }
    try {
      const copia = new copias({ idLivro });

      await copia.save();

      return res.status(200).send({ message: `Cópia criada com sucesso` });
    } catch (err) {
      return res.status(500).send({ message: `Erro ao criar cópia - ${err}` });
    }
  };

  static listarTotais = async (req, res) => {
    try {
      const totalLivrosAtivos = await livros.countDocuments({
        emprestado: true,
      });
      //ainda vou fazer totalLivrosAtrasados
      const totalLivrosCadastrador = await livros.countDocuments();
      const totalEmprestimos = await emprestimos.countDocuments();
      return res.status(200).send({
        totalLivrosAtivos: totalLivrosAtivos,
        totalLivrosCadastrador: totalLivrosCadastrador,
        totalEmprestados: totalEmprestimos,
      });
    } catch (err) {
      return res.status(500).send({
        message: `Erro ao consultar total de empréstimos ativos - ${err}`,
      });
    }
  };
  static listarCopias = async (req, res) => {
    const { id } = req.body;
    try {
      const lista = await copias.findOne({ idLivro: id }).populate("idLivro");
      return res.status(200).json(lista);
    } catch (err) {
      return res
        .status(404)
        .send({ message: `Cópias não encontradas para esse livro` });
    }
  };
}

export default responsaveisController;
