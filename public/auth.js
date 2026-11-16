const $ = id => document.getElementById(id);

function erro(campo, texto) {
  $('erro-' + campo).textContent = texto;
  return texto === '';
}

function validarNome(nome) {
  return erro('nome', nome.trim().length >= 3 ? '' : 'Digite seu nome (mínimo 3 letras).');
}

function validarEmail(email) {
  const arroba = email.indexOf('@');
  const ponto = email.lastIndexOf('.');
  const ok = arroba > 0 && ponto > arroba + 1 && ponto < email.length - 1 && !email.includes(' ');
  return erro('email', ok ? '' : 'Digite um e-mail válido, como nome@email.com.');
}

function validarSenha(senha) {
  let maiusculas = 0, minusculas = 0, numeros = 0;
  for (let i = 0; i < senha.length; i++) {
    const c = senha[i];
    if (c >= 'A' && c <= 'Z') maiusculas++;
    else if (c >= 'a' && c <= 'z') minusculas++;
    else if (c >= '0' && c <= '9') numeros++;
  }
  const ok = senha.length >= 8 && maiusculas > 0 && minusculas > 0 && numeros > 0;
  return erro('senha', ok ? '' : 'A senha precisa de 8+ caracteres, com maiúscula, minúscula e número.');
}

function validarConfirmacao(senha, confirmar) {
  return erro('confirmar', senha === confirmar ? '' : 'As senhas não são iguais.');
}

function validarPosicao(valor) {
  return erro('posicao', valor !== '' ? '' : 'Escolha a sua posição.');
}

function mensagem(texto, ok) {
  $('msg').textContent = texto;
  $('msg').className = 'msg ' + (ok ? 'ok' : 'falha');
}

// Front -> fetch -> API (Express) -> MySQL
async function enviar(rota, dados) {
  try {
    const resp = await fetch(rota, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    const texto = await resp.text();
    let corpo;
    try { corpo = JSON.parse(texto); } catch (e) { corpo = texto; }
    return { ok: resp.ok, corpo: corpo };
  } catch (e) {
    return { ok: false, corpo: 'Não foi possível falar com o servidor. Ele está ligado?' };
  }
}

function textoDeErro(corpo, padrao) {
  return typeof corpo === 'string' && corpo !== '' ? corpo : padrao;
}

if ($('enviar')) {
  $('enviar').onclick = async () => {
    const nome = $('nome').value, email = $('email').value, posicao = $('posicao').value;
    const senha = $('senha').value, confirmar = $('confirmar').value;
    // & (e não &&) para mostrar todos os erros de uma vez
    const valido = validarNome(nome) & validarEmail(email) & validarPosicao(posicao) &
                   validarSenha(senha) & validarConfirmacao(senha, confirmar);
    if (!valido) return;
    const r = await enviar('/usuarios/cadastrar', {
      nomeServer: nome, emailServer: email, senhaServer: senha, posicaoServer: posicao
    });
    if (r.ok) {
      mensagem('Conta criada! Redirecionando para o login...', true);
      setTimeout(() => { location.href = 'login.html'; }, 1500);
    } else {
      const duplicado = typeof r.corpo === 'string' && r.corpo.includes('Duplicate');
      mensagem(duplicado ? 'Este e-mail já está cadastrado.' : textoDeErro(r.corpo, 'Erro ao cadastrar.'), false);
    }
  };
}

if ($('entrar')) {
  $('entrar').onclick = async () => {
    const email = $('email').value, senha = $('senha').value;
    const valido = validarEmail(email) & erro('senha', senha !== '' ? '' : 'Digite sua senha.');
    if (!valido) return;
    const r = await enviar('/usuarios/autenticar', { emailServer: email, senhaServer: senha });
    if (r.ok) {
      sessionStorage.EMAIL_USUARIO = r.corpo.email;
      sessionStorage.NOME_USUARIO = r.corpo.nome;
      sessionStorage.ID_USUARIO = r.corpo.id;
      sessionStorage.POSICAO_USUARIO = r.corpo.posicao;
      location.href = 'dashboard.html';
    } else mensagem(textoDeErro(r.corpo, 'Erro ao entrar.'), false);
  };
}
