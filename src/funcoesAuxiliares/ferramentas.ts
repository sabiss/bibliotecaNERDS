import usuarios from "../models/Usuario";
import responsaveis from "../models/Responsavel";
import administradores from "../models/Administrador";

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
      return res
        .status(500)
        .send({ message: "Erro ao buscar existência de email no sistema" });
    }
  };
}
export default ferramentas;
