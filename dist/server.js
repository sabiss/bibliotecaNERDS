"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = __importDefault(require("./app.js"));
const porta = process.env.PORT;
app_js_1.default.listen(porta, () => {
    console.log(`Iniciando porta http://localhost:${porta}`);
});
