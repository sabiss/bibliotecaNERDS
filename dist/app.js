"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dbconnect_js_1 = __importDefault(require("./config/dbconnect.js"));
const index_js_1 = __importDefault(require("./routes/index.js"));
const app = (0, express_1.default)();
dbconnect_js_1.default.on("error", console.log.bind(console, "erro na conexão com o MongoDB"));
dbconnect_js_1.default.once("open", () => {
    console.log("Banco conectado");
});
app.use(express_1.default.json());
(0, index_js_1.default)(app);
exports.default = app;
