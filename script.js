// Seletores
const telaInicio = document.getElementById("tela-inicio");
const telaJogo = document.getElementById("tela-jogo");

const nomeJogador1Input = document.getElementById("nome-jogador-1");
const nomeJogador2Input = document.getElementById("nome-jogador-2");
const checkboxIA = document.getElementById("checkbox-ia");
const dificuldadeContainer = document.getElementById("dificuldade-container");
const dificuldadeSelect = document.getElementById("dificuldade-select");

const botaoComecar = document.getElementById("botao-comecar");
const botaoVoltar = document.getElementById("botao-voltar");
const botaoJogarNovamente = document.getElementById("botao-jogar-novamente");

const mensagem = document.getElementById("mensagem");
const tabuleiroElementos = document.querySelectorAll(".celula");

// Variáveis do jogo
let jogador1 = "";
let jogador2 = "";
let contraIA = false;
let dificuldade = "facil";

let simboloJogador = "X";
let simboloBot = "O";
let turno = simboloJogador;

let tabuleiro = ["", "", "", "", "", "", "", "", ""];

// Atualiza estado do botão começar e campo jogador 2
function atualizaEstadoBotao() {
  const nome1Ok = nomeJogador1Input.value.trim() !== "";
  const jogarContraIA = checkboxIA.checked;
  const nome2Ok = jogarContraIA || nomeJogador2Input.value.trim() !== "";
  botaoComecar.disabled = !(nome1Ok && nome2Ok);

  if (jogarContraIA) {
    nomeJogador2Input.value = "";
    nomeJogador2Input.disabled = true;
    dificuldadeContainer.style.display = "block";
  } else {
    nomeJogador2Input.disabled = false;
    dificuldadeContainer.style.display = "none";
  }
}

// Event listeners para atualização do botão começar
nomeJogador1Input.addEventListener("input", atualizaEstadoBotao);
nomeJogador2Input.addEventListener("input", atualizaEstadoBotao);
checkboxIA.addEventListener("change", atualizaEstadoBotao);

// Função para resetar o tabuleiro e habilitar as células
function resetarTabuleiro() {
  tabuleiro = ["", "", "", "", "", "", "", "", ""];
  tabuleiroElementos.forEach(celula => {
    celula.textContent = "";
    celula.style.pointerEvents = "auto";
  });
  turno = simboloJogador;
}

// Atualiza visual do tabuleiro
function atualizarTabuleiro() {
  tabuleiro.forEach((val, idx) => {
    tabuleiroElementos[idx].textContent = val;
  });
}

// Mostrar mensagem na tela
function mostrarMensagem(texto) {
  mensagem.textContent = texto;
}

// Evento do botão começar
botaoComecar.addEventListener("click", () => {
  jogador1 = nomeJogador1Input.value.trim();
  if (checkboxIA.checked) {
    contraIA = true;
    jogador2 = "Computador";
    dificuldade = dificuldadeSelect.value;
  } else {
    contraIA = false;
    jogador2 = nomeJogador2Input.value.trim();
  }

  simboloJogador = "X";
  simboloBot = "O";
  turno = simboloJogador;

  telaInicio.style.display = "none";
  telaJogo.style.display = "block";

  mostrarMensagem(`Vez de ${jogador1} (${simboloJogador})`);
  resetarTabuleiro();
  atualizarTabuleiro();
  atualizaEstadoBotao();
});

// Evento para voltar para a tela inicial
botaoVoltar.addEventListener("click", () => {
  telaJogo.style.display = "none";
  telaInicio.style.display = "block";
  mostrarMensagem("");
  resetarTabuleiro();
  atualizaEstadoBotao();
});

// Evento para jogar novamente (resetar jogo)
botaoJogarNovamente.addEventListener("click", () => {
  mostrarMensagem(`Vez de ${jogador1} (${simboloJogador})`);
  resetarTabuleiro();
  atualizarTabuleiro();
  turno = simboloJogador;
});

// Função do clique nas células
tabuleiroElementos.forEach(celula => {
  celula.addEventListener("click", () => {
    const indice = parseInt(celula.dataset.index);
    jogar(indice);
  });
});

function jogar(indice) {
  if (tabuleiro[indice] !== "") return;

  // No PvP, turno pode ser X ou O, sem restrição
  // No contra IA, o jogador humano só joga no turno do X (simboloJogador)
  if (contraIA && turno !== simboloJogador) return;

  tabuleiro[indice] = turno;
  atualizarTabuleiro();

  if (verificaVitoria()) {
    mostrarMensagem((turno === simboloJogador ? jogador1 : jogador2) + " venceu! 🎉");
    bloquearTabuleiro();
    return;
  } else if (verificaEmpate()) {
    mostrarMensagem("Empate!");
    bloquearTabuleiro();
    return;
  }

  // Trocar turno
  if (contraIA) {
    turno = simboloBot;
    mostrarMensagem(`Vez de ${jogador2} (${simboloBot})`);

    setTimeout(() => {
      jogadaIA();
      atualizarTabuleiro();

      if (verificaVitoria()) {
        mostrarMensagem(`${jogador2} venceu! 🎉`);
        bloquearTabuleiro();
      } else if (verificaEmpate()) {
        mostrarMensagem("Empate!");
        bloquearTabuleiro();
      } else {
        turno = simboloJogador;
        mostrarMensagem(`Vez de ${jogador1} (${simboloJogador})`);
      }
    }, 500);

  } else {
    // PvP troca turno
    turno = turno === "X" ? "O" : "X";
    mostrarMensagem(`Vez de ${turno === simboloJogador ? jogador1 : jogador2} (${turno})`);
  }
}


// Bloqueia tabuleiro ao final do jogo
function bloquearTabuleiro() {
  tabuleiroElementos.forEach(celula => {
    celula.style.pointerEvents = "none";
  });
}

// Verifica vitória
function verificaVitoria() {
  const combosVitoria = [
    [0,1,2], [3,4,5], [6,7,8], // linhas
    [0,3,6], [1,4,7], [2,5,8], // colunas
    [0,4,8], [2,4,6]           // diagonais
  ];

  return combosVitoria.some(comb => {
    const [a,b,c] = comb;
    return tabuleiro[a] && tabuleiro[a] === tabuleiro[b] && tabuleiro[a] === tabuleiro[c];
  });
}

// Verifica empate
function verificaEmpate() {
  return tabuleiro.every(celula => celula !== "");
}

// IA - Jogada fácil (aleatória)
function jogadaFacil() {
  const indicesLivres = tabuleiro
    .map((val, idx) => val === "" ? idx : null)
    .filter(val => val !== null);

  const jogada = indicesLivres[Math.floor(Math.random() * indicesLivres.length)];
  tabuleiro[jogada] = simboloBot;
}

// IA - Jogada médio (tenta bloquear vitória do jogador)
function jogadaMedio() {
  // Tenta ganhar
  if (tentaGanharOuBloquear(simboloBot)) return;

  // Tenta bloquear jogador
  if (tentaGanharOuBloquear(simboloJogador)) return;

  // Senão joga fácil
  jogadaFacil();
}

// IA - Jogada difícil (minimax)
function jogadaDificil() {
  const melhorMovimento = minimax(tabuleiro, simboloBot).indice;
  tabuleiro[melhorMovimento] = simboloBot;
}

// Função para tentar ganhar ou bloquear (usada no médio)
function tentaGanharOuBloquear(simbolo) {
  const combosVitoria = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  for (const combo of combosVitoria) {
    const [a,b,c] = combo;
    const valores = [tabuleiro[a], tabuleiro[b], tabuleiro[c]];
    if (valores.filter(v => v === simbolo).length === 2 && valores.includes("")) {
      const indiceVazio = combo[valores.indexOf("")];
      tabuleiro[indiceVazio] = simboloBot;
      return true;
    }
  }
  return false;
}

// Função principal de jogada IA
function jogadaIA() {
  switch(dificuldade) {
    case "facil":
      jogadaFacil();
      break;
    case "medio":
      jogadaMedio();
      break;
    case "dificil":
      jogadaDificil();
      break;
  }
}

// Minimax (algoritmo para IA difícil)
function minimax(novoTabuleiro, jogadorAtual) {
  const jogadorMax = simboloBot;
  const jogadorMin = simboloJogador;

  const vencedor = checarVencedor(novoTabuleiro);
  if (vencedor === jogadorMax) return { pontuacao: 10 };
  if (vencedor === jogadorMin) return { pontuacao: -10 };
  if (novoTabuleiro.every(celula => celula !== "")) return { pontuacao: 0 };

  const movimentos = [];

  for (let i = 0; i < novoTabuleiro.length; i++) {
    if (novoTabuleiro[i] === "") {
      const movimento = {};
      movimento.indice = i;
      novoTabuleiro[i] = jogadorAtual;

      if (jogadorAtual === jogadorMax) {
        const resultado = minimax(novoTabuleiro, jogadorMin);
        movimento.pontuacao = resultado.pontuacao;
      } else {
        const resultado = minimax(novoTabuleiro, jogadorMax);
        movimento.pontuacao = resultado.pontuacao;
      }

      novoTabuleiro[i] = "";
      movimentos.push(movimento);
    }
  }

  let melhorMovimento;
  if (jogadorAtual === jogadorMax) {
    let maiorPontuacao = -Infinity;
    for (const mov of movimentos) {
      if (mov.pontuacao > maiorPontuacao) {
        maiorPontuacao = mov.pontuacao;
        melhorMovimento = mov;
      }
    }
  } else {
    let menorPontuacao = Infinity;
    for (const mov of movimentos) {
      if (mov.pontuacao < menorPontuacao) {
        menorPontuacao = mov.pontuacao;
        melhorMovimento = mov;
      }
    }
  }

  return melhorMovimento;
}

// Função para checar vencedor (minimax)
function checarVencedor(tab) {
  const combosVitoria = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  for (const combo of combosVitoria) {
    const [a,b,c] = combo;
    if (tab[a] && tab[a] === tab[b] && tab[a] === tab[c]) {
      return tab[a];
    }
  }
  return null;
}
