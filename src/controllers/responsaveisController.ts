import mongoose from "mongoose";
import livros from "../models/Livro";
import emprestimos from "../models/Emprestimo";
import copias from "../models/Copia";
import usuarios from "../models/Usuario";

class responsaveisController {
  static cadastrarLivro = async (req, res) => {
    const novoLivro = new livros(req.body);

    try {
      const isbnEmUso = await livros.findOne({ isbn: req.body.isbn });
      const livroExiste = await livros.findOne({ titulo: req.body.titulo });

      if (isbnEmUso) {
        return res
          .status(400)
          .send({ message: "Já há um livro cadastrado com esse isbn" });
      } else if (livroExiste) {
        return res
          .status(400)
          .send({ message: "Já há um livro cadastrado com esse título" });
      }
      await novoLivro.save();
      const numeroDaCopiaCriada = (await this.adicionarCopiaDeLivro(req, res))
        .numero; //quando crio um livro automaticamente ele já tem uma cópia
      console.log(numeroDaCopiaCriada);
      return res.status(201).send({
        message: `Novo livro de código ${numeroDaCopiaCriada} cadastrado com Sucesso!`,
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
      return res.status(404).send({ message: "usuário não encontrado" });
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
      return res.status(200).send({
        message: "Essa cópia já foi emprestada e não está mais disponível",
      });
    }

    const emprestimoRepetido = await emprestimos.findOne({
      usuario: usuario._id,
      livro: livro._id,
      emprestimoAtivo: true,
    });

    if (emprestimoRepetido) {
      return res
        .status(200)
        .send({ message: "Este Usuário já está livro emprestado" });
    }
    const { dataEmprestimo, dataDevolucao } = req.body;
    try {
      const emprestimo = new emprestimos({
        usuario: usuario._id,
        livro: livro._id,
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
        .find({ emprestimoAtivo: true })
        .populate({ path: "usuario", select: "-senha" })
        .populate("livro");
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
        .populate({ path: "usuario", select: "-senha" })
        .populate("livro");
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
    const { titulo } = req.body;
    const livro = await livros.findOne({ titulo: titulo });
    if (!livro) {
      return res.status(404).send({ message: "Livro não encontrado" });
    }

    try {
      const copia = new copias({ idLivro: livro._id });

      await copia.save();

      return res.status(200).send({
        message: `Cópia criada com sucesso`,
        numero: copia.codigoDeIdentificacao,
      });
    } catch (err) {
      return res.status(500).send({ message: `Erro ao criar cópia - ${err}` });
    }
  };

  static listarTotais = async (req, res) => {
    try {
      const totalEmprestimoAtivos = await emprestimos.countDocuments({
        emprestimoAtivo: true,
      });
      //ainda vou fazer totalLivrosAtrasados
      const totalLivrosCadastrados = await livros.countDocuments();
      const totalEmprestimos = await emprestimos.countDocuments();

      return res.status(200).send({
        totalEmprestimoAtivos: totalEmprestimoAtivos,
        totalLivrosCadastrados: totalLivrosCadastrados,
        totalEmprestados: totalEmprestimos,
      });
    } catch (err) {
      return res.status(500).send({
        message: `Erro ao preencher quantidades de livros e empréstimos - ${err}`,
      });
    }
  };
  static listarCopias = async (req, res) => {
    const { id } = req.body;
    try {
      const lista = await copias.find({ idLivro: id }).populate("idLivro");
      return res.status(200).json(lista);
    } catch (err) {
      return res
        .status(404)
        .send({ message: `Cópias não encontradas para esse livro` });
    }
  };
}

export default responsaveisController;
