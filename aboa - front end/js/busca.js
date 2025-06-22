/**
 * busca.js - Script para a funcionalidade de busca
 * Controla a captura do termo de busca e navegação para a página de resultados
 */
document.addEventListener('DOMContentLoaded', () => {
  const botaoBusca = document.getElementById('btnBusca');
  const campoBusca = document.getElementById('campoBusca');

  if (botaoBusca && campoBusca) {
    // Adiciona evento de clique ao botão de busca
    botaoBusca.addEventListener('click', () => {
      realizarBusca();
    });

    // Adiciona evento de tecla Enter no campo de busca
    campoBusca.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        realizarBusca();
      }
    });
  }

  /**
   * Função para realizar a busca com o valor do campo
   */
  function realizarBusca() {
    const valorBusca = campoBusca.value.trim();
    if (valorBusca) {
      const encodedBusca = encodeURIComponent(valorBusca);
      window.location.href = `recomenda.html?busca=${encodedBusca}`;
    } else {
      alert('Por favor, informe uma cidade, categoria ou tipo de comida para buscar.');
    }
  }
});