var dashboardModel = require("../models/dashboardModel");

function responder(promessa, res) {
    promessa
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("Houve um erro ao buscar os dados do dashboard! Erro: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function jogadoresPorPosicao(req, res) {
    responder(dashboardModel.jogadoresPorPosicao(), res);
}

function ultimosCadastros(req, res) {
    responder(dashboardModel.ultimosCadastros(), res);
}

function novosUltimos7Dias(req, res) {
    responder(dashboardModel.novosUltimos7Dias(), res);
}

module.exports = {
    jogadoresPorPosicao,
    ultimosCadastros,
    novosUltimos7Dias
};
