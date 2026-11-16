// var ambiente_processo = 'producao';
var ambiente_processo = 'desenvolvimento';

var caminho_env = ambiente_processo === 'producao' ? '.env' : '.env.dev';
// Operador ternário: condição ? valor_se_verdadeiro : valor_se_falso

require("dotenv").config({ path: caminho_env });

var express = require("express");
var cors = require("cors");
var path = require("path");
var PORTA_APP = process.env.APP_PORT;
var HOST_APP = process.env.APP_HOST;

var app = express();

var usuarioRouter = require("./src/routes/usuarios");
var dashboardRouter = require("./src/routes/dashboard");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.use("/usuarios", usuarioRouter);
app.use("/dashboard", dashboardRouter);

app.listen(PORTA_APP, function () {
    console.log(`
    Servidor do Meu Vôlei rodando! Acesse: http://${HOST_APP}:${PORTA_APP}
    Ambiente: .:${process.env.AMBIENTE_PROCESSO}:.
    Se .:desenvolvimento:. você está se conectando ao banco local.
    Se .:producao:. você está se conectando ao banco remoto (VM).
    Para alterar o ambiente, comente ou descomente as linhas 1 ou 2 do 'app.js'.
    `);
});
