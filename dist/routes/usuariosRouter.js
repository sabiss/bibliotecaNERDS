"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const usuariosController_js_1 = __importDefault(require("../controllers/usuariosController.js"));
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router
    .get("/usuarios", usuariosController_js_1.default.listarUsuarios)
    .post("/usuarios", usuariosController_js_1.default.cadastrarUsuario)
    .delete("/usuarios/:id", usuariosController_js_1.default.deletarUsuario);
exports.default = router;
