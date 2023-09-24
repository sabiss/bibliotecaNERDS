"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const Usuario_js_1 = __importDefault(require("../models/Usuario.js"));
const mongoose_1 = __importDefault(require("mongoose"));
class usuarioController {
}
_a = usuarioController;
usuarioController.cadastrarUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usuario = new Usuario_js_1.default(req.body);
    try {
        yield usuario.save();
        res.status(201).send({ message: "Usuário Criado com Sucesso" });
    }
    catch (error) {
        res.status(500).send({
            message: `Erro ao salvar usuário no Banco - ${error}`,
        });
    }
});
usuarioController.listarUsuarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listaUsuarios = yield Usuario_js_1.default.find();
        res.status(200).json(listaUsuarios);
    }
    catch (error) {
        res.status(500).send({
            message: `Erro ao buscar lista de usuários no banco - ${error}`,
        });
    }
});
usuarioController.deletarUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID de usuário inválido" });
    }
    try {
        const erro = yield Usuario_js_1.default.findByIdAndDelete(id);
        if (!erro) {
            res
                .status(200)
                .send({ message: "usuário deletado com sucesso" + erro });
        }
        else {
            res.status(404).send({ message: `usuário não encontrado - ${erro}` });
        }
    }
    catch (erro) {
        res.status(500).send(`Usuário não encontrado - ${erro}`);
    }
});
exports.default = usuarioController;
