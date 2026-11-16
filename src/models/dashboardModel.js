var database = require("../database/config");

function jogadoresPorPosicao() {
    var instrucaoSql = `
        SELECT p.nome AS posicao, COUNT(u.id) AS total
        FROM posicao p
        LEFT JOIN usuario u ON u.fk_posicao = p.id
        GROUP BY p.id, p.nome
        ORDER BY p.id;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function ultimosCadastros() {
    var instrucaoSql = `
        SELECT SUBSTRING_INDEX(u.nome, ' ', 1) AS nome, p.nome AS posicao
        FROM usuario u
        JOIN posicao p ON p.id = u.fk_posicao
        ORDER BY u.id DESC
        LIMIT 5;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function novosUltimos7Dias() {
    var instrucaoSql = `
        SELECT COUNT(*) AS novos FROM usuario WHERE criado_em >= NOW() - INTERVAL 7 DAY;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    jogadoresPorPosicao,
    ultimosCadastros,
    novosUltimos7Dias
};
