# Meu Vôlei

Projeto individual SPTECH. Arquitetura (igual ao web-data-viz):
`public/` (front) -> `src/routes` -> `src/controllers` -> `src/models` -> `src/database/config.js` -> MySQL.

## Como rodar
1. Execute `src/database/script-tabelas.sql` no MySQL.
2. Em `.env.dev`, preencha `DB_USER` e `DB_PASSWORD`.
3. `npm install` e depois `npm start`.
4. Abra http://localhost:3333

Rotas: `POST /usuarios/cadastrar`, `POST /usuarios/autenticar`, `GET /dashboard/jogadoresPorPosicao`.
