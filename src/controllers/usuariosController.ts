import usuarios from "../models/Usuario";
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class usuarioController {
  static verificaExistenciaDeUsuario = async (req, res) => {
    const { email } = req.body;
    const usuario = await usuarios.findOne({ email: email });
    if (usuario) {
      return usuario;
    }
    return false;
  };
}

export default usuarioController;
