var express = require("express");
var router = express.Router();

var dashboardController = require("../controllers/dashboardController");

router.get("/jogadoresPorPosicao", function (req, res) {
    dashboardController.jogadoresPorPosicao(req, res);
});

router.get("/ultimosCadastros", function (req, res) {
    dashboardController.ultimosCadastros(req, res);
});

router.get("/novosUltimos7Dias", function (req, res) {
    dashboardController.novosUltimos7Dias(req, res);
});

module.exports = router;
