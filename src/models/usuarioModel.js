var database = require("../database/config");

function autenticar(email, senha) {
    var instrucaoSql = `
        SELECT u.id, u.nome, u.email, p.nome AS posicao
        FROM usuario u
        JOIN posicao p ON p.id = u.fk_posicao
        WHERE u.email = '${email}' AND u.senha = '${senha}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrar(nome, email, senha, posicao) {
    var instrucaoSql = `
        INSERT INTO usuario (nome, email, senha, fk_posicao) VALUES ('${nome}', '${email}', '${senha}', '${posicao}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    autenticar,
    cadastrar
};
