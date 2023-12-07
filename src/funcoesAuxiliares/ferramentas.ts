import { AtrasoInfo } from "../entities/ferramentas";
import usuarios from "../models/Usuario";
import responsaveis from "../models/Responsavel";
import administradores from "../models/Administrador";
import copias from "../models/Copia";

class ferramentas {
  static verificarUsoDeEmail = async (req, res) => {
    const { email } = req.body;

    try {
      const existeEmUsers = await usuarios.findOne({ email: email });
      const existeEmAdms = await administradores.findOne({ email: email });
      const existeResponsavel = await responsaveis.findOne({ email: email });

      if (existeEmUsers || existeEmAdms || existeResponsavel) {
        return existeEmAdms || existeEmUsers || existeResponsavel;
      }

      return false;
    } catch (err) {
      return res.status(500).send({
        message: `Erro ao buscar existência de email no sistema - ${err}`,
      });
    }
  };
  static gerarCodigoParaCopias = async () => {
    let paddedNumber;
    let existe;

    do {
      const randomNumber = Math.floor(Math.random() * 100000);
      paddedNumber = randomNumber.toString().padStart(5, "0");

      existe = await copias.find({
        codigoDeIdentificacao: paddedNumber,
      });
    } while (existe.length > 0); //vai gerando ate o número não existir no banco

    return paddedNumber;
  };
  static indicarAtraso(dataEmprestimo, dataDevolucao): AtrasoInfo {
    const devolucao: Date = new Date(dataDevolucao);
    const emprestimo: Date = new Date(dataEmprestimo);
    const agora: Date = new Date();

    const diasDeAtraso: number =
      (agora.getTime() - devolucao.getTime()) / (1000 * 60 * 60 * 24);

    if (diasDeAtraso > 0) {
      const atraso: number = Math.floor(diasDeAtraso) - 1;
      return { atrasado: true, atraso };
    } else {
      return { atrasado: false };
    }
  }
}
export default ferramentas;
