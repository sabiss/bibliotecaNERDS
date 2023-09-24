"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
const senha = process.env.db_senha;
const user = process.env.db_user;
mongoose_1.default.connect(`mongodb+srv://${user}:${senha}@bibliotecanerds.wht7vis.mongodb.net/?retryWrites=true&w=majority`);
let conexaoComDataBase = mongoose_1.default.connection;
exports.default = conexaoComDataBase;
