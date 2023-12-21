import fs from "fs";
import fotos from "../models/Foto";
import administradores from "../models/Administrador";
import responsaveis from "../models/Responsavel";
import mongoose from "mongoose";
import path from "path";

class FotosController {
  static criarFoto = async (req, res) => {
    const file = req.file;
    const foto = new fotos({
      nome: file.filename,
      src: file.path,
    });

    console.log(file);

    try {
      await foto.save();
      return res.json(foto.id);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Erro ao salvar a imagem.", erro: err });
    }
  };
  static removerFoto = async (req, res) => {
    const id = req.params.id;
    try {
      const foto = await fotos.findById(id);
      if (!foto) {
        return res.status(404).json({ message: "Imagem não encontrada" });
      }
      const caminhoCompleto = path.join("uploads", foto.nome);

      if (!fs.existsSync(caminhoCompleto)) {
        //verifica se essa foto antiga existe na pasta
        return res.status(403).json({
          message:
            "Sua Foto de Perfil Antiga Não Foi Encontrada Para Realizar A Troca",
        });
      }

      await fs.promises.unlink(foto.src);
      await foto.deleteOne();
      return res.json({ message: "Imagem removida com sucesso" });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Erro ao remover a imagem", erro: err });
    }
  };
  static getFoto = async (req, res) => {
    const id = req.params.id;

    if (!id) {
      return res.status(400).send({ message: "Requisição sem id da imagem" });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ message: "ID de foto inválido" });
    }
    try {
      const foto = await fotos.findById(id);

      if (!foto) {
        return res.status(404).send({ message: "Foto não encontrada" });
      }
      return res.json(foto);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Erro ao buscar as imagens.", erro: err });
    }
  };
  static atualizarFoto = async (req, res) => {
    const { idUsuario, idFoto } = req.body;

    if (!idUsuario) {
      return res
        .status(400)
        .send({ message: "informe o destinatário da foto" });
    } else if (!idFoto) {
      return res.status(400).send({ message: "informe o endereço da foto" });
    } else if (!mongoose.Types.ObjectId.isValid(idFoto)) {
      return res
        .status(400)
        .send({ message: "Essa imagem não existe no banco de dados" });
    }

    let destinatarioComFotoAtualizada;

    try {
      destinatarioComFotoAtualizada = await administradores.findByIdAndUpdate(
        { _id: idUsuario },
        { $set: { fotoPerfil: idFoto } },
        { new: true }
      );
      if (!destinatarioComFotoAtualizada) {
        destinatarioComFotoAtualizada = await responsaveis.findByIdAndUpdate(
          { _id: idUsuario },
          { $set: { fotoPerfil: idFoto } },
          { new: true }
        );
      }

      if (!destinatarioComFotoAtualizada) {
        return res.status(404).send({ message: "Usuário não encontrado" });
      } else {
        return res.status(200).send({ message: "Foto Atualizada com Sucesso" });
      }
    } catch (error) {
      return res
        .status(500)
        .send({ message: "Erro ao atualizar foto", erro: error });
    }
  };
}

export default FotosController;
