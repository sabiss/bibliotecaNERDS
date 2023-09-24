"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes = (app) => {
    //pega a instância do express que é o app
    app.use(
    //outras rotas que serão USE(u)das
    express_1.default.json());
};
exports.default = routes;
