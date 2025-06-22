/**
 * main.js - Script principal para todas as páginas do aplicativo ABOA
 * 
 * Este script é responsável por:
 * 1. Funcionalidades comuns a todas as páginas
 * 2. Inicialização geral da aplicação
 * 3. Manipulação do menu de navegação
 */

document.addEventListener('DOMContentLoaded', () => {
    inicializarNavegacao();
    configurarTemaClaro();
    detectarMobileDevice();
});

/**
 * Inicializa a navegação da aplicação
 */
function inicializarNavegacao() {
    // Menu móvel (hamburger) - para responsividade
    const menuHamburger = document.querySelector('.menu-hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuHamburger && navLinks) {
        menuHamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
    
    // Destaque para página atual no menu
    const paginaAtual = window.location.pathname.split('/').pop();
    const links = document.querySelectorAll('.nav-links a');
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === paginaAtual || (paginaAtual === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

/**
 * Configura o tema claro/escuro (se implementado)
 */
function configurarTemaClaro() {
    const btnTema = document.querySelector('#btn-tema');
    
    if (btnTema) {
        // Verificar preferência salva
        const temaEscuro = localStorage.getItem('tema-escuro') === 'true';
        
        // Aplicar tema inicial
        if (temaEscuro) {
            document.body.classList.add('tema-escuro');
            btnTema.textContent = '☀️';
        } else {
            btnTema.textContent = '🌙';
        }
        
        // Alternar tema ao clicar
        btnTema.addEventListener('click', () => {
            document.body.classList.toggle('tema-escuro');
            const novoTemaEscuro = document.body.classList.contains('tema-escuro');
            
            localStorage.setItem('tema-escuro', novoTemaEscuro);
            btnTema.textContent = novoTemaEscuro ? '☀️' : '🌙';
        });
    }
}

/**
 * Detecta se o dispositivo é móvel e ajusta a interface
 */
function detectarMobileDevice() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        document.body.classList.add('dispositivo-movel');
    }
}

/**
 * Função auxiliar para formatar valores como preços
 * @param {number} valor - Valor a ser formatado
 * @returns {string} - Valor formatado como moeda
 */
function formatarPreco(valor) {
    return new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
    }).format(valor);
}

/**
 * Função auxiliar para formatar datas
 * @param {string|Date} data - Data a ser formatada
 * @returns {string} - Data formatada
 */
function formatarData(data) {
    const dataObj = new Date(data);
    return dataObj.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
    });
}