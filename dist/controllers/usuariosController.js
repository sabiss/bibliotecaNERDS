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
const bcrypt_1 = __importDefault(require("bcrypt"));
class usuarioController {
}
_a = usuarioController;
usuarioController.verificaExistenciaDeUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const usuario = yield Usuario_js_1.default.findOne({ email: email });
    return usuario;
});
usuarioController.cadastrarUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield _a.verificaExistenciaDeUsuario(req, res)) {
        return res
            .status(422)
            .send({ message: "Este email já está sendo usado" });
    }
    const { email, senha, nome } = req.body;
    const salt = yield bcrypt_1.default.genSalt();
    const senhaHash = yield bcrypt_1.default.hash(senha, salt); //criando hash da senha para depois ser traduzida para senha normal e comparada
    const novoUsuario = new Usuario_js_1.default({
        nome,
        email,
        senhaHash,
    });
    try {
        yield novoUsuario.save();
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
            return res.status(404).send({ message: "Usuário não encontrado" });
        }
        return res.status(200).send({ message: "Usuário deletado com sucesso" });
    }
    catch (error) {
        return res.status(500).send(`Erro ao deletar usuário - ${error}`);
    }
});
usuarioController.logarNoSistema = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, senha } = req.body;
    const usuario = yield _a.verificaExistenciaDeUsuario(req, res);
    if (!usuario) {
        return res.status(404).send({ message: "usuário não encontrado" });
    }
    const senhaCerta = yield bcrypt_1.default.compare(senha, usuario.senhaHash);
    if (!senhaCerta) {
        return res.status(422).send({ message: "senha inválida" });
    }
});
exports.default = usuarioController;
