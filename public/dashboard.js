if (sessionStorage.NOME_USUARIO == undefined) location.href = 'login.html';

const $ = id => document.getElementById(id);
const CORES = ['#ff7a1a', '#1e6fd9', '#0b1d3a', '#16a34a', '#e9a94d'];
const minhaPosicao = sessionStorage.POSICAO_USUARIO;

$('nome').textContent = sessionStorage.NOME_USUARIO.split(' ')[0];
$('ola').textContent = 'Você joga como ' + minhaPosicao + '. Veja como está a comunidade do Meu Vôlei.';
$('sair').onclick = () => { sessionStorage.clear(); location.href = 'login.html'; };

async function buscar(rota) {
  const resp = await fetch(rota);
  if (!resp.ok) throw new Error(rota);
  return resp.json();
}

function criar(tag, classe, texto) {
  const e = document.createElement(tag);
  if (classe) e.className = classe;
  if (texto !== undefined) e.textContent = texto;
  return e;
}

function desenharPosicoes(dados) {
  let soma = 0, maior = dados[0], minha = null;
  for (let i = 0; i < dados.length; i++) {
    soma += dados[i].total;
    if (dados[i].total > maior.total) maior = dados[i];
    if (dados[i].posicao === minhaPosicao) minha = dados[i];
  }
  const pct = valor => (soma > 0 ? Math.round((valor / soma) * 100) : 0);

  $('total').textContent = soma;
  $('donutTotal').textContent = soma;
  $('maisComum').textContent = soma > 0 ? maior.posicao : '-';
  $('minhaPct').textContent = (minha ? pct(minha.total) : 0) + '%';
  $('minhaLabel').textContent = 'dos jogadores jogam como ' + minhaPosicao;

  let acumulado = 0;
  const fatias = [];
  const legenda = $('legenda');
  legenda.innerHTML = '';
  for (let i = 0; i < dados.length; i++) {
    const cor = CORES[i % CORES.length];
    const parte = soma > 0 ? (dados[i].total / soma) * 100 : 0;
    fatias.push(cor + ' ' + acumulado + '% ' + (acumulado + parte) + '%');
    acumulado += parte;

    const li = criar('li', dados[i].posicao === minhaPosicao ? 'eu' : '');
    const bolinha = criar('i');
    bolinha.style.background = cor;
    li.append(bolinha, criar('span', 'nome', dados[i].posicao), criar('span', 'valor', dados[i].total + ' (' + pct(dados[i].total) + '%)'));
    legenda.appendChild(li);
  }
  $('donut').style.background = soma > 0 ? 'conic-gradient(' + fatias.join(',') + ')' : '#e5e7eb';
}

function desenharRecentes(lista) {
  const ul = $('recentes');
  ul.innerHTML = '';
  if (lista.length === 0) {
    ul.appendChild(criar('li', 'vazio', 'Ainda não há cadastros.'));
    return;
  }
  for (let i = 0; i < lista.length; i++) {
    const li = criar('li');
    const avatar = criar('span', 'avatar', lista[i].nome.charAt(0).toUpperCase());
    const texto = criar('span', 'quem');
    texto.append(criar('b', '', lista[i].nome), criar('small', '', lista[i].posicao));
    li.append(avatar, texto);
    ul.appendChild(li);
  }
}

async function carregar() {
  const [posicoes, recentes, novos] = await Promise.allSettled([
    buscar('/dashboard/jogadoresPorPosicao'),
    buscar('/dashboard/ultimosCadastros'),
    buscar('/dashboard/novosUltimos7Dias')
  ]);

  if (posicoes.status === 'fulfilled') desenharPosicoes(posicoes.value);
  else console.error('Erro em jogadoresPorPosicao:', posicoes.reason);

  if (recentes.status === 'fulfilled') desenharRecentes(recentes.value);
  else {
    console.error('Erro em ultimosCadastros:', recentes.reason);
    $('recentes').innerHTML = '';
    $('recentes').appendChild(criar('li', 'vazio', 'Não foi possível carregar os cadastros.'));
  }

  if (novos.status === 'fulfilled') $('novos').textContent = novos.value[0].novos;
  else {
    console.error('Erro em novosUltimos7Dias:', novos.reason);
    $('novos').textContent = '-';
  }

  if (posicoes.status === 'rejected') {
    $('msg').textContent = 'Não foi possível carregar os dados. O servidor está ligado e reiniciado com a versão nova?';
    $('msg').className = 'msg falha';
  }
}
carregar();
