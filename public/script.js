const PAPEIS = [
  { id: 'levantador', nome: 'Levantador', sigla: 'Lev', inicio: 1 },
  { id: 'ponteiro1', nome: 'Ponteiro 1', sigla: 'P1', inicio: 2 },
  { id: 'central1', nome: 'Central 1', sigla: 'C1', inicio: 3 },
  { id: 'oposto', nome: 'Oposto', sigla: 'Op', inicio: 4 },
  { id: 'ponteiro2', nome: 'Ponteiro 2', sigla: 'P2', inicio: 5 },
  { id: 'central2', nome: 'Central 2', sigla: 'C2', inicio: 6 },
  { id: 'libero', nome: 'Líbero', sigla: 'Lib', inicio: null }
];

const COORDS = {
  4: [17, 22], 3: [50, 22], 2: [83, 22],
  5: [17, 78], 6: [50, 78], 1: [83, 78]
};

const PROXIMA = { 1: 6, 6: 5, 5: 4, 4: 3, 3: 2, 2: 1 };

const FUNCAO_ZONA = {
  1: 'fundo direito: é de onde se saca e se defende a diagonal.',
  2: 'frente direita: ataque pela direita e bloqueio.',
  3: 'frente central: ataque rápido pelo meio e bloqueio.',
  4: 'frente esquerda: principal zona de ataque pela ponta.',
  5: 'fundo esquerdo: defesa e recepção.',
  6: 'fundo central: defesa e cobertura da quadra.'
};

const quadra = document.getElementById('quadra');
const opcoes = document.getElementById('opcoes');
const info = document.getElementById('info');
const btnRodar = document.getElementById('rodar');
const btnReiniciar = document.getElementById('reiniciar');

let escolhido = null;
let ocupado = false;
let rotacao = 0;
const zonas = {};
const elementos = {};

PAPEIS.forEach(p => {
  const b = document.createElement('button');
  b.textContent = p.nome;
  b.onclick = () => escolher(p.id, b);
  opcoes.appendChild(b);

  const el = document.createElement('div');
  el.className = 'jogador' + (p.id === 'libero' ? ' libero' : '');
  el.textContent = p.sigla;
  quadra.appendChild(el);
  elementos[p.id] = el;
});

function reiniciarZonas() {
  PAPEIS.forEach(p => { if (p.inicio) zonas[p.id] = p.inicio; });
  rotacao = 0;
}

const BANCO = [50, 113.5];
const bancoTxt = document.getElementById('bancoTxt');

function centralDoFundo() {
  return [1, 5, 6].includes(zonas.central1) ? 'central1' : 'central2';
}

function liberoDentro() {
  return zonas[centralDoFundo()] !== 1;
}

function zonaDoLibero() {
  return zonas[centralDoFundo()];
}

function nomeDoPapel(id) {
  return PAPEIS.find(p => p.id === id).nome;
}

function atualizarBanco(nome) {
  bancoTxt.textContent = 'Banco: ' + nome;
}

function desenhar() {
  const cf = centralDoFundo();
  const dentro = liberoDentro();
  PAPEIS.forEach(p => {
    const el = elementos[p.id];
    let pos;
    if (p.id === 'libero') pos = dentro ? COORDS[zonas[cf]] : BANCO;
    else if (p.id === cf && dentro) pos = BANCO;
    else pos = COORDS[zonas[p.id]];
    mover(el, pos);
    el.style.opacity = 1;
    el.classList.toggle('voce', p.id === escolhido);
  });
  atualizarBanco(dentro ? nomeDoPapel(cf) : 'Líbero');
  atualizarInfo();
}

function atualizarInfo() {
  if (!escolhido) {
    info.textContent = 'Escolha uma posição para começar.';
    return;
  }
  const papel = PAPEIS.find(p => p.id === escolhido);
  let texto;
  if (escolhido === 'libero') {
    if (liberoDentro()) {
      texto = `Você é o <b>Líbero</b> e está na <b>zona ${zonaDoLibero()}</b>, no lugar do central que está no fundo da quadra. Você nunca joga na frente.`;
    } else {
      texto = 'Você é o <b>Líbero</b> e está no <b>banco</b>. Nesta rotação o central está na zona 1 para sacar, então os dois centrais estão em quadra. Depois do saque, você entra no lugar dele.';
    }
  } else {
    const z = zonas[escolhido];
    const proxima = PROXIMA[z];
    const central = escolhido === 'central1' || escolhido === 'central2';
    if (central && escolhido === centralDoFundo() && liberoDentro()) {
      texto = `Rotação <b>${rotacao + 1}</b> de 6. Você é <b>${papel.nome}</b> e está no <b>banco</b>: enquanto está no fundo (zona ${z}), o líbero joga no seu lugar. Você volta à quadra quando chegar na frente.`;
    } else {
      texto = `Rotação <b>${rotacao + 1}</b> de 6. Você é <b>${papel.nome}</b> e está na <b>zona ${z}</b>, ${FUNCAO_ZONA[z]}<br>Ao rodar, você vai para a <b>zona ${proxima}</b>.`;
      if (z === 1) texto += '<br>Atenção: na zona 1 você faz o saque.';
      if (central && z === 1) texto += ' Os dois centrais estão em quadra e o líbero fica no banco.';
    }
  }
  info.innerHTML = texto;
}

function escolher(id, botao) {
  escolhido = id;
  [...opcoes.children].forEach(b => b.classList.remove('on'));
  botao.classList.add('on');
  desenhar();
}

btnRodar.onclick = () => {
  if (ocupado) return;
  if (!escolhido) {
    info.textContent = 'Primeiro escolha a posição em que você joga.';
    return;
  }
  Object.keys(zonas).forEach(id => { zonas[id] = PROXIMA[zonas[id]]; });
  rotacao = (rotacao + 1) % 6;
  desenhar();
};

btnReiniciar.onclick = () => {
  if (ocupado) return;
  reiniciarZonas();
  desenhar();
};

reiniciarZonas();
desenhar();

const btnSimular = document.getElementById('simular');
const bola = document.createElement('div');
bola.className = 'bola';
quadra.appendChild(bola);

const esperar = ms => new Promise(r => setTimeout(r, ms));
const sortear = lista => lista[Math.floor(Math.random() * lista.length)];

function mover(el, [x, y]) {
  el.style.left = x + '%';
  el.style.top = y + '%';
}

function colocarBola([x, y]) {
  bola.style.transition = 'none';
  mover(bola, [x, y]);
  bola.style.opacity = 1;
  bola.offsetWidth;
  bola.style.transition = '';
}

function zonaDe(id) {
  return id === 'libero' ? zonaDoLibero() : zonas[id];
}

const noFundo = id => [1, 5, 6].includes(zonas[id]);

function formacao() {
  const f = {};
  f.levantador = [68, 17];
  f.oposto = noFundo('oposto') ? [88, 76] : [88, 22];
  ['ponteiro1', 'ponteiro2'].forEach(id => { f[id] = noFundo(id) ? [52, 78] : [12, 22]; });
  ['central1', 'central2'].forEach(id => { f[id] = noFundo(id) ? BANCO : [46, 22]; });
  f.libero = [15, 76];
  return f;
}

function descricaoFormacao(id) {
  const fundo = noFundo(id);
  if (id === 'levantador') return 'vai para a rede, entre o meio e a direita, para levantar a bola';
  if (id === 'oposto') return fundo ? 'fica no fundo à direita, defendendo e pronto para atacar por trás' : 'vai para a direita da rede para atacar';
  if (id === 'ponteiro1' || id === 'ponteiro2') return fundo ? 'fica no fundo, no meio da quadra, para receber e defender' : 'vai para a esquerda da rede para atacar e bloquear';
  if (id === 'central1' || id === 'central2') return fundo ? 'vai para o banco e o líbero entra no seu lugar' : 'vai para o meio da rede para bloquear e atacar bolas rápidas';
  return 'fica no fundo à esquerda, na defesa e na recepção';
}

function linhaVoce(ator) {
  if (escolhido === ator) return '👉 Essa ação é sua!';
  return `Enquanto a bola está em jogo, você ${descricaoFormacao(escolhido)}.`;
}

function mostrar(titulo, texto, ator) {
  info.innerHTML = `<b>${titulo}</b><br>${texto}<br>${linhaVoce(ator)}`;
}

function travar(valor) {
  ocupado = valor;
  [btnRodar, btnSimular, btnReiniciar].forEach(b => { b.disabled = valor; });
}

async function simular() {
  if (!escolhido) {
    info.textContent = 'Primeiro escolha a posição em que você joga.';
    return;
  }
  if (ocupado) return;
  travar(true);
  desenhar();

  const nome = id => PAPEIS.find(p => p.id === id).nome;
  const f = formacao();
  const receptores = ['libero', 'ponteiro1', 'ponteiro2'].filter(id => id === 'libero' || noFundo(id));
  const receptor = sortear(receptores);
  const atacantes = ['ponteiro1', 'ponteiro2', 'central1', 'central2', 'oposto'].filter(id => f[id] && f[id][1] < 40);
  const atacante = sortear(atacantes);

  colocarBola([30, -12]);
  mostrar('1. Saque e formação', 'O time de lá saca. Assim que a bola sai, ninguém fica parado: todos deixam as posições da rotação e vão para as posições de jogo.', null);
  PAPEIS.forEach(p => mover(elementos[p.id], f[p.id]));
  atualizarBanco(nomeDoPapel(centralDoFundo()));
  await esperar(1800);

  mover(bola, f[receptor]);
  elementos[receptor].classList.add('acao');
  mostrar('2. Recepção', `${nome(receptor)} recebe o saque e passa a bola para a rede.`, receptor);
  await esperar(1500);

  mover(bola, f.levantador);
  elementos[receptor].classList.remove('acao');
  elementos.levantador.classList.add('acao');
  mostrar('3. Levantamento', 'O levantador já está na rede e levanta a bola para o atacante.', 'levantador');
  await esperar(1500);

  const ax = f[atacante][0];
  elementos.levantador.classList.remove('acao');
  elementos[atacante].classList.add('acao', 'salto');
  mover(elementos[atacante], [ax, 14]);
  mover(bola, [ax, 14]);
  mostrar('4. Ataque', `${nome(atacante)} salta e ataca a bola.`, atacante);
  await esperar(1400);

  mover(bola, [100 - ax, -12]);
  mostrar('5. Bola do outro lado', 'O ataque passa pela rede e o time de lá tenta defender. Se a bola cair, é ponto!', null);
  await esperar(1800);

  Object.values(elementos).forEach(el => el.classList.remove('acao', 'salto'));
  bola.style.opacity = 0;
  info.innerHTML = '<b>Fim da jogada</b><br>Todos voltam para as posições da rotação, prontos para o próximo saque.';
  desenhar();
  await esperar(1000);
  atualizarInfo();
  travar(false);
}

btnSimular.onclick = simular;
