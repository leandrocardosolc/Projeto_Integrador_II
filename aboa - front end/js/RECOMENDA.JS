/**
 * recomenda.js - Script para a página de recomendações de restaurantes
 *
 * Este script é responsável por:
 * 1. Capturar parâmetros de busca da URL
 * 2. Fazer requisição à API Django do back-end
 * 3. Preencher dinamicamente os resultados na página
 */

document.addEventListener('DOMContentLoaded', () => {
  // Configuração inicial da página - mostrar indicadores de carregamento
  exibirCarregando();

  // Obter o parâmetro de busca da URL
  const params = new URLSearchParams(window.location.search);
  const busca = params.get('busca');

  if (!busca) {
    alert('Nenhum termo de busca foi informado.');
    return;
  }

  // URL base deve ser ajustada conforme a configuração do seu back-end
  const API_BASE_URL = 'http://localhost:8080'; // Removido o '/api'

  // Correção do template literal para console.log e fetch
  const urlCompletaDaBusca = `${API_BASE_URL}/api/recomendacoes/?busca=${encodeURIComponent(busca)}`;
  console.log('URL da busca:', urlCompletaDaBusca);

  fetch(urlCompletaDaBusca) // Usa a URL corretamente construída
    .then(res => {
      if (!res.ok) throw new Error('Erro ao buscar dados');
      return res.json();
    })
    .then(data => {
      // Preencher os dados na página
      preencherRecomendacaoPrincipal(data.recomendacao_principal);
      preencherOutrasRecomendacoes(data.outras_recomendacoes);
    })
    .catch(err => {
      console.error('Erro:', err);
      exibirErro();
      alert('Falha ao carregar as recomendações.');
    });
});

// Função para exibir estado de carregamento
function exibirCarregando() {
  // Estado já configurado no HTML com textos "Carregando..."
  console.log('Carregando dados de restaurantes...');
}

// Função para exibir erro caso a API falhe
function exibirErro() {
  document.querySelector('.restaurant-name').textContent = "Erro ao carregar";
  document.querySelector('.restaurant-description').textContent =
    "Não foi possível obter recomendações no momento. Tente novamente mais tarde.";

  const cards = document.querySelectorAll('.cards-container .card');
  cards.forEach(card => {
    card.querySelector('.card-title').textContent = "Indisponível";
    card.querySelector('.card-description').textContent = "Não foi possível carregar esta recomendação";
    card.querySelector('.star-rating').textContent = "⚠️";
  });
}

// Função para preencher a recomendação principal
function preencherRecomendacaoPrincipal(info) {
  if (!info) {
    document.querySelector('.restaurant-name').textContent = "Sem recomendações";
    document.querySelector('.restaurant-description').textContent =
      "Não encontramos recomendações para sua busca.";
    return;
  }

  document.querySelector('.restaurant-name').textContent = info.nome;
  document.querySelector('.restaurant-description').textContent = info.descricao;

  if (info.imagem) {
    const imgElement = document.querySelector('.restaurant-image img');
    imgElement.src = info.imagem;
    imgElement.alt = `Imagem de ${info.nome}`;
  }

  const botoes = document.querySelectorAll('.action-buttons .btn'); // AQUI 'botoes' é DEFINIDO

  // Lógica para o primeiro botão (Ver Cardápio)
  if (botoes[0]) { // Verifica se o primeiro botão existe no DOM
    if (info.estabelecimento_id) {
      botoes[0].href = `cardapio.html?restaurante_id=${info.estabelecimento_id}`;
      botoes[0].classList.remove('disabled'); // Garante que não esteja desabilitado
    } else {
      botoes[0].href = '#';
      botoes[0].classList.add('disabled'); // Desabilita se não tiver ID
    }
  }

  // Lógica para o segundo botão (Ir pra lá)
  if (botoes[1]) { // Verifica se o segundo botão existe no DOM
    if (info.link_mapa) {
      botoes[1].href = info.link_mapa;
      botoes[1].classList.remove('disabled'); // Garante que não esteja desabilitado
    } else {
      botoes[1].href = '#';
      botoes[1].classList.add('disabled'); // Desabilita se não tiver link
    }
  }
}
// Função para preencher outras recomendações
function preencherOutrasRecomendacoes(lista) {
  if (!lista || lista.length === 0) {
    const container = document.querySelector('.cards-container');
    container.innerHTML = '<p class="sem-resultados">Não encontramos outras recomendações para sua busca.</p>';
    return;
  }

  const cards = document.querySelectorAll('.cards-container .card');
  const maxCards = Math.min(cards.length, lista.length);

  for (let i = 0; i < maxCards; i++) {
    const card = cards[i];
    const rec = lista[i];

    if (rec.imagem) {
      const imgElement = card.querySelector('.card-image img');
      imgElement.src = rec.imagem;
      imgElement.alt = `Imagem de ${rec.nome}`;
    }

    card.querySelector('.card-title').textContent = rec.nome;
    card.querySelector('.card-description').textContent = rec.descricao;
    card.querySelector('.star-rating').textContent = gerarEstrelas(rec.avaliacao);

    const btnElement = card.querySelector('.card-btn');
    if (btnElement && rec.link) {
      btnElement.href = rec.link;
    }
  }

  // Se tivermos menos recomendações que cards, escondemos os cards extras
  for (let i = maxCards; i < cards.length; i++) {
    cards[i].style.display = 'none';
  }
}

// Função para gerar estrelas baseado na avaliação
function gerarEstrelas(nota) {
  if (!nota && nota !== 0) return '⚠️';

  const notaNum = parseFloat(nota);
  if (isNaN(notaNum)) return '⚠️';

  const cheias = Math.floor(notaNum);
  const estrelas = '★'.repeat(cheias) + '☆'.repeat(5 - cheias);
  return estrelas;
}