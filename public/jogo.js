// Mini jogo: a energia (estamina) diminui a cada jogada, como a energia do Luffy nas batalhas.
const META = 15;
const ENERGIA_MAXIMA = 100;
const RECUPERACAO = 60;

// vetor com as jogadas: quanto custam e quantos pontos dão
const ACOES = [
  { nome: 'Saque',  emoji: '🏐', custo: 20, pontos: 1 },
  { nome: 'Defesa', emoji: '🛡️', custo: 35, pontos: 2 },
  { nome: 'Ataque', emoji: '💥', custo: 50, pontos: 3 }
];

const $ = id => document.getElementById(id);
let energia, pontos, isotonicos, historico, fim;

// menor custo entre as jogadas (usa repetição)
function menorCusto() {
  let menor = ACOES[0].custo;
  for (let i = 1; i < ACOES.length; i++) {
    if (ACOES[i].custo < menor) menor = ACOES[i].custo;
  }
  return menor;
}

function criarBotoes() {
  for (let i = 0; i < ACOES.length; i++) {
    const botao = document.createElement('button');
    botao.className = 'btn j-acao';
    botao.innerHTML = ACOES[i].emoji + ' ' + ACOES[i].nome + '<small>-' + ACOES[i].custo + ' energia · +' + ACOES[i].pontos + ' pt</small>';
    botao.onclick = () => jogar(i);
    $('acoes').appendChild(botao);
  }
}

function mensagem(texto, tipo) {
  $('msg').textContent = texto;
  $('msg').className = 'j-msg ' + tipo;
}

function registrar(texto) {
  historico.unshift(texto);
  if (historico.length > 5) historico.pop();
}

function atualizar() {
  $('energiaTxt').textContent = energia;
  $('pontosTxt').textContent = pontos + ' / ' + META;
  $('isoTxt').textContent = isotonicos;

  const barra = $('barra');
  barra.style.width = energia + '%';
  if (energia > 50) barra.className = 'j-barra boa';
  else if (energia > 20) barra.className = 'j-barra media';
  else barra.className = 'j-barra baixa';

  const botoes = document.querySelectorAll('.j-acao');
  for (let i = 0; i < botoes.length; i++) {
    botoes[i].disabled = fim || energia < ACOES[i].custo;
  }
  $('beber').disabled = fim || isotonicos === 0 || energia === ENERGIA_MAXIMA;

  const lista = $('historico');
  lista.innerHTML = '';
  for (let i = 0; i < historico.length; i++) {
    const li = document.createElement('li');
    li.textContent = historico[i];
    lista.appendChild(li);
  }
}

function verificarFim() {
  if (pontos >= META) {
    fim = true;
    mensagem('🎉 Vitória! Você fez ' + pontos + ' pontos e ainda tinha ' + energia + ' de energia.', 'ok');
  } else if (energia < menorCusto() && isotonicos === 0) {
    fim = true;
    mensagem('😮‍💨 Sem fôlego e sem isotônicos! Você fez ' + pontos + ' de ' + META + ' pontos.', 'falha');
  }
}

function jogar(indice) {
  if (fim) return;
  const acao = ACOES[indice];
  energia -= acao.custo;
  pontos += acao.pontos;
  registrar(acao.emoji + ' ' + acao.nome + ': -' + acao.custo + ' de energia, +' + acao.pontos + ' ponto(s)');
  mensagem(acao.nome + ' feito! Energia restante: ' + energia + '.', 'info');
  verificarFim();
  atualizar();
}

function beber() {
  if (fim || isotonicos === 0) return;
  const antes = energia;
  energia = Math.min(ENERGIA_MAXIMA, energia + RECUPERACAO);
  isotonicos--;
  registrar('🥤 Isotônico: +' + (energia - antes) + ' de energia');
  mensagem('Você bebeu um isotônico. Restam ' + isotonicos + '.', 'info');
  atualizar();
}

function reiniciar() {
  energia = ENERGIA_MAXIMA;
  pontos = 0;
  isotonicos = 3;
  historico = [];
  fim = false;
  mensagem('Escolha uma jogada para começar!', 'info');
  atualizar();
}

criarBotoes();
$('beber').onclick = beber;
$('reiniciar').onclick = reiniciar;
reiniciar();
