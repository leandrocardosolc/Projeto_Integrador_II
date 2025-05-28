// cardapio.js - Script para carregar dados do cardápio do banco PostgreSQL

console.log('DEBUG: cardapio.js - Arquivo carregado.');

document.addEventListener('DOMContentLoaded', () => {
    // Inicialização
    loadMenuData();
    setupEventListeners();
});

// Obter o ID do restaurante da URL
function getRestauranteId() {
    const urlParams = new URLSearchParams(window.location.search);
    const restauranteId = urlParams.get('restaurante_id');
    
    if (!restauranteId) {
        console.warn('ID do restaurante não especificado na URL. Usando valor padrão 1.');
        return 1; // Valor padrão para desenvolvimento, ajuste conforme sua necessidade
    }
    
    return restauranteId;
}

// **NOVA ORDEM: Funções auxiliares definidas primeiro**

// Função para buscar detalhes do restaurante
async function fetchRestaurantDetails(restauranteId) {
    try {
       
        const response = await fetch(`http://localhost:8080/api/restaurantes/${restauranteId}`);
        if (!response.ok) {
            if (response.status === 404) {
                console.warn(`Restaurante com ID ${restauranteId} não encontrado.`);
                return null;
            }
            throw new Error(`Erro ao buscar detalhes do restaurante: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erro em fetchRestaurantDetails:', error);
        return null;
    }
}

// Função para renderizar o nome do restaurante no HTML
function renderRestaurantName(restaurante) {
    const restaurantNameElement = document.querySelector('.restaurant-name');
    if (restaurantNameElement && restaurante && restaurante.nomeFantasia) {
        restaurantNameElement.textContent = restaurante.nomeFantasia;
    } else {
        console.warn('Nome do restaurante não pôde ser atualizado. Usando nome estático ou padrão.');
    }
}

// Buscar itens do cardápio do banco de dados
async function fetchMenuItems(restauranteId) {
    // A URL deve apontar para o seu endpoint Spring Boot que retorna os itens do cardápio
    let url = `http://localhost:8080/api/cardapio?restaurante_id=${restauranteId}`;
    
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Erro ao buscar itens do cardápio: ${response.statusText}`);
    }
    return await response.json();
}

// Extrair categorias dos itens do cardápio de forma dinâmica
function extractCategoriesFromItems(items) {
    const categoriesMap = new Map();
    
    categoriesMap.set('all', { id: 'all', title: "Todos", filterName: "Todos" });

    items.forEach(item => {
        if (item.categoria) { 
            const categoryName = item.categoria;
            if (!categoriesMap.has(categoryName)) {
                categoriesMap.set(categoryName, {
                    id: categoryName,
                    title: categoryName,
                    filterName: categoryName
                });
            }
        }
    });

    const categoriesArray = Array.from(categoriesMap.values());
    
    categoriesArray.sort((a, b) => {
        if (a.id === 'all') return -1;
        if (b.id === 'all') return 1;
        return a.title.localeCompare(b.title);
    });

    return categoriesArray;
}

// Renderizar as seções de categoria na página HTML
function renderCategories(categories) {
    const menuContainer = document.querySelector('.menu-container');
    menuContainer.innerHTML = '';
    
    const categoriesToRender = categories.filter(cat => cat.id !== 'all');

    categoriesToRender.forEach(category => {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'menu-category';
        categoryElement.innerHTML = `
            <h2 class="category-title">${category.title}</h2>
            <div class="menu-items" id="category-${category.id}"></div>
        `;
        menuContainer.appendChild(categoryElement);
    });
}

// Renderizar itens do menu agrupados por categoria
function renderMenuItems(categories, menuItems) {
    const categorizedItems = {};
    
    categories.forEach(cat => {
        if (cat.id !== 'all') {
            categorizedItems[cat.id] = [];
        }
    });

    menuItems.forEach(item => {
        if (item.categoria && categorizedItems[item.categoria]) {
            categorizedItems[item.categoria].push(item);
        } else {
            console.warn(`Item '${item.nome}' não pôde ser categorizado ou sua categoria '${item.categoria}' é desconhecida.`);
        }
    });
    
    categories.forEach(category => {
        if (category.id === 'all') return;

        const categoryItemsContainer = document.getElementById(`category-${category.id}`);
        if (!categoryItemsContainer) {
            console.warn(`Contêiner HTML para categoria '${category.title}' (ID: ${category.id}) não encontrado.`);
            return;
        }
        categoryItemsContainer.innerHTML = '';

        const itemsToRender = categorizedItems[category.id] || [];

        if (itemsToRender.length === 0) {
            categoryItemsContainer.innerHTML = '<p class="no-items">Nenhum item disponível nesta categoria.</p>';
        } else {
            itemsToRender.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = `menu-item ${item.disponivel === false ? 'unavailable' : ''}`;
                itemElement.innerHTML = `
                  
                    <div class="item-header">
                        <div class="item-title">${item.nome}</div>
                        <div class="item-price">R$ ${item.preco.toFixed(2).replace('.', ',')}</div>
                    </div>
                    <div class="item-description">${item.descricao || ''}</div>
                   
                `;
                categoryItemsContainer.appendChild(itemElement);
            });
        }
    });
}

// Configurar filtros de categoria (botões no topo)
function setupFilters(categories) {
    const filterGroup = document.querySelector('.filter-group');
    filterGroup.innerHTML = '';
    
    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'filter-button';
        if (category.id === 'all') {
            button.classList.add('active');
        }
        button.textContent = category.filterName || category.title;
        button.dataset.categoryId = category.id;
        filterGroup.appendChild(button);
    });
}

// Funções utilitárias para feedback visual
function showLoading() {
    let loader = document.querySelector('.menu-loader');
    if (!loader) {
        loader = document.createElement('div');
        loader.className = 'menu-loader';
        loader.innerHTML = '<div class="spinner"></div><p>Carregando...</p>';
        document.querySelector('.container').appendChild(loader);
    } else {
        loader.style.display = 'flex';
    }
}

function hideLoading() {
    const loader = document.querySelector('.menu-loader');
    if (loader) {
        loader.style.display = 'none';
    }
}

function showErrorMessage(message) {
    let errorDiv = document.querySelector('.error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message message-error';
        document.querySelector('.container').appendChild(errorDiv);
    }
    
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

function showNoResults() {
    const menuContainer = document.querySelector('.menu-container');
    
    let noResults = document.querySelector('.no-results');
    if (!noResults) {
        noResults = document.createElement('div');
        noResults.className = 'no-results message-info';
        noResults.innerHTML = '<p>Nenhum item encontrado com o termo pesquisado.</p>';
        menuContainer.appendChild(noResults);
    } else {
        noResults.style.display = 'block';
    }
    document.querySelectorAll('.menu-category').forEach(cat => {
        cat.style.display = 'none';
    });
}


// **Função principal para carregar os dados do cardápio**
async function loadMenuData() {
    try {
        showLoading();
        
        const restauranteId = getRestauranteId();
        
        // 1. Buscar os detalhes do restaurante (agora fetchRestaurantDetails está definida)
        const restauranteDetails = await fetchRestaurantDetails(restauranteId);
        renderRestaurantName(restauranteDetails); // Atualizar o nome do restaurante na página
        
        // 2. Continuar com a busca e renderização dos itens do cardápio
        const menuItems = await fetchMenuItems(restauranteId);
        const categories = extractCategoriesFromItems(menuItems);
        
        renderCategories(categories);
        renderMenuItems(categories, menuItems);
        setupFilters(categories);
        
        hideLoading();
    } catch (error) {
        console.error('Erro ao carregar dados do cardápio:', error);
        showErrorMessage('Não foi possível carregar o cardápio. Por favor, tente novamente mais tarde.');
        hideLoading();
    }
}


// Configurar listeners de eventos para filtros e busca
function setupEventListeners() {
    document.querySelector('.filter-group').addEventListener('click', async (event) => {
        if (!event.target.classList.contains('filter-button')) return;
        
        document.querySelectorAll('.filter-button').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        
        const categoryId = event.target.dataset.categoryId;
        await filterItems(categoryId);
    });
    
    const searchInput = document.querySelector('.search-input');
    let debounceTimeout;
    
    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(async () => {
            const searchTerm = searchInput.value.trim().toLowerCase();
            await searchItems(searchTerm);
        }, 300);
    });

    const backButton = document.querySelector('.edit-button');
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.history.back();
        });
    }
}

// Filtrar itens por categoria (controla o que é exibido)
async function filterItems(selectedCategoryId) {
    try {
        showLoading();
        
        const restauranteId = getRestauranteId();
        const menuItems = await fetchMenuItems(restauranteId);
        const categories = extractCategoriesFromItems(menuItems);

        renderCategories(categories);
        
        let itemsToDisplay = [];
        if (selectedCategoryId === 'all') {
            itemsToDisplay = menuItems;
        } else {
            itemsToDisplay = menuItems.filter(item => String(item.categoria) === String(selectedCategoryId));
        }

        renderMenuItems(categories, itemsToDisplay);
        
        document.querySelectorAll('.menu-category').forEach(catElement => {
            const categoryIdInHtml = catElement.querySelector('.menu-items').id.replace('category-', '');
            if (selectedCategoryId === 'all') {
                const categoryHasItems = itemsToDisplay.some(item => String(item.categoria) === String(categoryIdInHtml));
                catElement.style.display = categoryHasItems ? 'block' : 'none';
            } else {
                catElement.style.display = (String(categoryIdInHtml) === String(selectedCategoryId)) ? 'block' : 'none';
            }
        });

        if (itemsToDisplay.length === 0 && selectedCategoryId !== 'all') {
             const container = document.querySelector('.container');
             let noItemsMessage = container.querySelector('.no-items-in-category');
             if (!noItemsMessage) {
                 noItemsMessage = document.createElement('p');
                 noItemsMessage.className = 'no-items-in-category message-info';
                 container.appendChild(noItemsMessage);
             }
             noItemsMessage.textContent = `Nenhum item encontrado na categoria "${selectedCategoryId}".`;
             noItemsMessage.style.display = 'block';
        } else {
             const noItemsMessage = document.querySelector('.no-items-in-category');
             if (noItemsMessage) noItemsMessage.style.display = 'none';
        }
        
        hideLoading();
    } catch (error) {
        console.error('Erro ao filtrar itens:', error);
        showErrorMessage('Erro ao filtrar os itens. Por favor, tente novamente.');
        hideLoading();
    }
}

// Buscar itens por texto
async function searchItems(searchTerm) {
    try {
        if (!searchTerm) {
            const activeCategory = document.querySelector('.filter-button.active').dataset.categoryId;
            await filterItems(activeCategory);
            return;
        }
        
        showLoading();
        
        const restauranteId = getRestauranteId();
        const response = await fetch(`http://localhost:8080/api/cardapio?restaurante_id=${restauranteId}`);
        if (!response.ok) {
            throw new Error(`Erro na busca: ${response.statusText}`);
        }
        
        const allItems = await response.json();
        
        const searchResults = allItems.filter(item => {
            const nome = (item.nome || '').toLowerCase();
            const descricao = (item.descricao || '').toLowerCase();
            const categoria = (item.categoria || '').toLowerCase();
            
            return nome.includes(searchTerm) || descricao.includes(searchTerm) || categoria.includes(searchTerm);
        });
        
        const categories = extractCategoriesFromItems(allItems);
        renderCategories(categories);
        renderMenuItems(categories, searchResults);

        document.querySelectorAll('.menu-category').forEach(catElement => {
            const categoryIdInHtml = catElement.querySelector('.menu-items').id.replace('category-', '');
            const hasItemsInThisCategory = searchResults.some(item => String(item.categoria) === String(categoryIdInHtml));
            catElement.style.display = hasItemsInThisCategory ? 'block' : 'none';
        });
        
        if (searchResults.length === 0) {
            showNoResults();
        } else {
            const noResults = document.querySelector('.no-results');
            if (noResults) noResults.style.display = 'none';
        }
        
        hideLoading();
    } catch (error) {
        console.error('Erro ao buscar itens:', error);
        showErrorMessage('Erro ao buscar os itens. Por favor, tente novamente.');
        hideLoading();
    }
}