// js/contarestaurante.js

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar carregamento de dados do restaurante e configurar listeners
    loadRestaurantDataAndSetupListeners();

    // Adiciona listeners para os botões "Editar perfil" e "Visualizar como Cliente"
    const editarPerfilBtn = document.querySelector('.profile-section .btn-primary');
    if (editarPerfilBtn) {
        editarPerfilBtn.addEventListener('click', () => alert('Funcionalidade "Editar perfil do restaurante" a ser implementada.'));
    }
    const visualizarClienteBtn = document.querySelector('.profile-section .btn-outline');
    if (visualizarClienteBtn) {
        visualizarClienteBtn.addEventListener('click', () => {
            const restauranteId = localStorage.getItem('restauranteId');
            if (restauranteId) {
                window.location.href = `cardapio.html?restaurante_id=${restauranteId}`;
            } else {
                alert('ID do restaurante não disponível para visualizar como cliente. Faça o login do restaurante.');
            }
        });
    }

    // Adiciona listeners para os botões "Salvar Horários" e "Salvar Formas de Pagamento"
    const salvarHorariosBtn = document.querySelector('#horario-form .action-btn-inline');
    if (salvarHorariosBtn) {
        salvarHorariosBtn.addEventListener('click', (event) => {
            event.preventDefault();
            alert('Funcionalidade "Salvar Horários" a ser implementada.');
        });
    }

    const salvarPagamentosBtn = document.querySelector('.info-section h3.section-title button.action-btn-inline');
    if (salvarPagamentosBtn) {
        salvarPagamentosBtn.addEventListener('click', () => alert('Funcionalidade "Salvar Formas de Pagamento" a ser implementada.'));
    }

    // Image upload and preview listeners
    

    // =========================================================
    // DELEGAÇÃO DE EVENTOS PARA BOTÕES DO CARDÁPIO (MAIS ROBUSTO)
    // Isso garante que listeners funcionem mesmo para elementos adicionados dinamicamente.
    // =========================================================
    document.addEventListener('click', (event) => {
        // Botão "+ Adicionar Item" na seção do cardápio
        if (event.target.matches('#menu-section .btn-primary')) {
            console.log("Clique detectado no botão '+ Adicionar Item' via delegação.");
            openModal();
        }
        // Botões "Editar" item
        else if (event.target.matches('.edit-item-btn')) {
            console.log("Clique detectado no botão 'Editar Item' via delegação.");
            const item = JSON.parse(event.target.dataset.item);
            openModal(item);
        }
        // Botões "Excluir" item
        else if (event.target.matches('.delete-item-btn')) {
            console.log("Clique detectado no botão 'Excluir Item' via delegação.");
            const itemNameElement = event.target.closest('.menu-item').querySelector('.menu-item-name');
            const itemName = itemNameElement ? itemNameElement.textContent : 'este item';
            if (confirm(`Tem certeza que deseja excluir ${itemName}?`)) {
                deleteMenuItem(event.target.dataset.id);
            }
        }
    });

}); // Fim de DOMContentLoaded

// Função principal para carregar dados do restaurante e configurar a página
async function loadRestaurantDataAndSetupListeners() {
    try {
        const restaurantData = await fetchRestaurantData();
        if (restaurantData) {
            displayRestaurantData(restaurantData);
            localStorage.setItem('restauranteId', restaurantData.id);

            // Agora, busca e renderiza os itens do cardápio diretamente
            const menuItems = await fetchRestaurantMenuItems(restaurantData.id);
            renderRestaurantMenuItems(menuItems);
        }
    } catch (error) {
        console.error('Erro ao carregar dados do restaurante:', error);
        alert('Não foi possível carregar as informações do restaurante. Tente novamente mais tarde.');
        displayStaticRestaurantData();
    }
}

// =========================================================
// FUNÇÕES AUXILIARES PARA DADOS DO RESTAURANTE (IMPLEMENTAÇÕES COMPLETAS)
// =========================================================

// READ: Busca os dados do perfil do restaurante logado na API
async function fetchRestaurantData() {
    const headers = {
        'Content-Type': 'application/json'
    };

    const response = await fetch(`http://localhost:8080/api/restaurantes/me`, { // Endpoint para buscar o perfil do restaurante logado
        method: 'GET',
        headers: headers,
        credentials: 'include'
    });

    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            alert('Sessão expirada ou não autorizada. Por favor, faça login como restaurante novamente.');
            window.location.href = 'login.html';
        }
        throw new Error(`Erro ao buscar dados do restaurante: ${response.statusText}`);
    }
    return await response.json();
}

// Função para exibir os dados do restaurante na interface
function displayRestaurantData(restaurant) {
    // Seção de perfil
    const profileSection = document.querySelector('.profile-section');
    const restaurantNameElement = profileSection.querySelector('.user-name');
    const restaurantEmailElement = profileSection.querySelector('.user-email');
    const restaurantSinceElement = profileSection.querySelector('.user-since');
    const profilePhotoImg = profileSection.querySelector('.profile-photo img');

    if (restaurantNameElement) restaurantNameElement.textContent = restaurant.nomeFantasia || 'Nome do Restaurante';
    if (restaurantEmailElement) restaurantEmailElement.textContent = restaurant.email || 'email@restaurante.com';
    if (restaurantSinceElement) restaurantSinceElement.textContent = `Estabelecimento desde ${restaurant.dataCadastro || 'não informado'}`;
    if (profilePhotoImg && restaurant.logoUrl) {
        profilePhotoImg.src = restaurant.logoUrl;
    } else if (profilePhotoImg && restaurant.coverImageUrl) {
        profilePhotoImg.src = restaurant.coverImageUrl;
    } else {
        profilePhotoImg.src = 'imgs/Food.png';
    }

    // Informações de Contato
    document.getElementById('nome-fantasia').textContent = restaurant.nomeFantasia || '';
    document.getElementById('razao-social').textContent = restaurant.razaoSocial || '';
    document.getElementById('cnpj').textContent = formatCnpj(restaurant.cnpj) || '';
    document.getElementById('inscricao-estadual').textContent = restaurant.inscricaoEstadual || '(Não possui)';
    document.getElementById('email-contato').textContent = restaurant.email || '';
    document.getElementById('telefone').textContent = formatPhone(restaurant.telefone) || '';
    document.getElementById('ramo-atividade').textContent = restaurant.ramoAtividade || '';

    // Concatena o endereço completo do objeto endereco
    const endereco = restaurant.endereco;
    if (endereco) {
        document.getElementById('endereco-completo').innerHTML =
            `${endereco.logradouro || ''}, ${endereco.numero || ''}${endereco.complemento ? ', ' + endereco.complemento : ''}<br>` +
            `${endereco.bairro || ''} - ${endereco.cidade || ''}, ${endereco.estado || ''}<br>` +
            `CEP: ${formatCep(endereco.cep) || ''}`;
    } else {
        document.getElementById('endereco-completo').textContent = '(Endereço não informado)';
    }

    document.getElementById('descricao').textContent = restaurant.descricao || '(Sem descrição)';
}

// Função para exibir dados estáticos caso a API não funcione ou não haja login
function displayStaticRestaurantData() {
    const profileSection = document.querySelector('.profile-section');
    const restaurantNameElement = profileSection.querySelector('.user-name');
    const restaurantEmailElement = profileSection.querySelector('.user-email');
    const restaurantSinceElement = profileSection.querySelector('.user-since');
    const profilePhotoImg = profileSection.querySelector('.profile-photo img');

    if (restaurantNameElement) restaurantNameElement.textContent = "Burger Place";
    if (restaurantEmailElement) restaurantEmailElement.textContent = "contato@burgerplace.com";
    if (restaurantSinceElement) restaurantSinceElement.textContent = "Estabelecimento desde janeiro de 2020";
    if (profilePhotoImg) profilePhotoImg.src = "imgs/Food.png";

    document.getElementById('nome-fantasia').textContent = "Burger Place";
    document.getElementById('razao-social').textContent = "Burger Place S.A.";
    document.getElementById('cnpj').textContent = "12.345.678/0001-90";
    document.getElementById('inscricao-estadual').textContent = "Isento";
    document.getElementById('email-contato').textContent = "contato@burgerplace.com";
    document.getElementById('telefone').textContent = "(11) 98765-4321";
    document.getElementById('ramo-atividade').textContent = "Hamburgueria";
    document.getElementById('endereco-completo').innerHTML = "Av. Paulista, 1000, Sala 1<br>Centro - São Paulo, SP<br>CEP: 01000-000";
    document.getElementById('descricao').textContent = "Os melhores hambúrgueres artesanais da cidade.";

    const semanaInput = document.querySelector('#horario-form input[name="semana"]');
    if (semanaInput) semanaInput.value = "11:00 às 23:00";
    const sabadoInput = document.querySelector('#horario-form input[name="sabado"]');
    if (sabadoInput) sabadoInput.value = "11:00 às 00:00";
    const domingoInput = document.querySelector('#horario-form input[name="domingo"]');
    if (domingoInput) domingoInput.value = "12:00 às 22:00";
    const feriadosInput = document.querySelector('#horario-form input[name="feriados"]');
    if (feriadosInput) feriadosInput.value = "12:00 às 22:00";
}

// =========================================================
// FUNÇÕES DE FORMATAÇÃO
// =========================================================
function formatCnpj(cnpj) {
    if (!cnpj) return '';
    cnpj = cnpj.replace(/\D/g, '');
    if (cnpj.length === 14) {
        return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
    }
    return cnpj;
}

function formatPhone(phone) {
    if (!phone) return '';
    phone = phone.replace(/\D/g, '');
    if (phone.length === 11) {
        return phone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (phone.length === 10) {
        return phone.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    }
    return phone;
}

function formatCep(cep) {
    if (!cep) return '';
    cep = cep.replace(/\D/g, '');
    if (cep.length === 8) {
        return cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
    }
    return cep;
}


// =========================================================
// FUNÇÕES CRUD PARA ITENS DO CARDÁPIO
// =========================================================

async function fetchRestaurantMenuItems(restauranteId) {
    try {
        const response = await fetch(`http://localhost:8080/api/cardapio?restaurante_id=${restauranteId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                alert('Sessão expirada ou não autorizada para carregar cardápio. Faça login novamente.');
                window.location.href = 'login.html';
            }
            throw new Error(`Erro ao buscar itens do cardápio: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erro de conexão ao buscar itens do cardápio:', error);
        alert('Não foi possível conectar ao servidor para carregar o cardápio.');
        return [];
    }
}

async function saveMenuItem(itemData, isNewItem) {
    const restauranteId = localStorage.getItem('restauranteId');
    if (!restauranteId) {
        alert('ID do restaurante não encontrado. Impossível salvar item.');
        return;
    }
    itemData.restauranteId = parseInt(restauranteId);

    const url = isNewItem ? 'http://localhost:8080/api/cardapio' : `http://localhost:8080/api/cardapio/${itemData.id}`;
    const method = isNewItem ? 'POST' : 'PUT';

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(itemData)
        });

        if (response.ok || response.status === 201) {
            alert(`Item ${isNewItem ? 'adicionado' : 'atualizado'} com sucesso!`);
            closeModal();
            loadRestaurantDataAndSetupListeners();
        } else if (response.status === 401 || response.status === 403) {
            alert('Você não tem permissão para adicionar/atualizar itens. Faça login como proprietário.');
            window.location.href = 'login.html';
        } else if (response.status === 400) {
            const errorData = await response.json().catch(() => ({}));
            alert(`Erro de validação: ${errorData.message || 'Dados do item inválidos.'}`);
            console.error('Erro de validação:', response.status, errorData);
        } else {
            const errorData = await response.json().catch(() => ({}));
            alert(`Erro ao salvar item: ${errorData.message || 'Ocorreu um erro inesperado.'}`);
            console.error('Erro ao salvar item:', response.status, errorData);
        }
    } catch (error) {
        console.error('Erro de conexão ao salvar item:', error);
        alert('Não foi possível conectar ao servidor para salvar o item.');
    } finally {
        const saveLoading = document.getElementById('saveLoading');
        const saveText = document.getElementById('saveText');
        const saveBtn = document.getElementById('saveBtn');
        if (saveLoading) saveLoading.style.display = 'none';
        if (saveText) saveText.style.display = 'inline';
        if (saveBtn) saveBtn.disabled = false;
    }
}

async function deleteMenuItem(itemId) {
    try {
        const response = await fetch(`http://localhost:8080/api/cardapio/${itemId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (response.ok || response.status === 204) {
            alert('Item excluído com sucesso!');
            loadRestaurantDataAndSetupListeners();
        } else if (response.status === 401 || response.status === 403) {
            alert('Você não tem permissão para excluir itens. Faça login como proprietário.');
            window.location.href = 'login.html';
        } else if (response.status === 404) {
            alert('Item não encontrado para exclusão.');
        } else {
            const errorData = await response.json().catch(() => ({}));
            alert(`Erro ao excluir item: ${errorData.message || 'Ocorreu um erro inesperado.'}`);
            console.error('Erro ao excluir item:', response.status, errorData);
        }
    } catch (error) {
        console.error('Erro de conexão ao excluir item:', error);
        alert('Não foi possível conectar ao servidor para excluir o item.');
    }
}

function renderRestaurantMenuItems(menuItems) {
    let menuGridContainer = document.getElementById('restaurant-menu-items');

    if (!menuGridContainer) {
        console.error("Container de itens do cardápio 'restaurant-menu-items' não encontrado no HTML.");
        return;
    }

    menuGridContainer.innerHTML = '';

    if (menuItems.length === 0) {
        menuGridContainer.innerHTML = '<p class="no-items">Nenhum item no cardápio. Adicione um!</p>';
        return;
    }

    menuItems.forEach(item => {
        const menuItemElement = document.createElement('div');
        menuItemElement.className = 'menu-item';
        menuItemElement.innerHTML = `
           
            <div class="menu-item-info">
                <div class="menu-item-name">${item.nome}</div>
                <div class="menu-item-description">${item.descricao || ''}</div>
                <div class="menu-item-price">R$ ${item.preco.toFixed(2).replace('.', ',')}</div>
                <div class="menu-actions">
                    <button class="action-btn edit-item-btn" data-id="${item.id}" data-item='${JSON.stringify(item)}'>Editar</button>
                    <button class="action-btn delete-item-btn" data-id="${item.id}">Excluir</button>
                </div>
            </div>
        `;
        menuGridContainer.appendChild(menuItemElement);
    });
}

// =========================================================
// FUNÇÕES PARA MODAL DE ADIÇÃO/EDIÇÃO DE ITEM
// =========================================================

let currentEditingItem = null;

function openModal(item = null) {
    const modal = document.getElementById('itemModal');
    console.log("1. Elemento modal:", modal);
    const form = document.getElementById('itemForm');
    console.log("2. Elemento form:", form);
    const modalTitle = document.getElementById('modalTitle');
    console.log("3. Elemento modalTitle:", modalTitle);
    const saveText = document.getElementById('saveText');
    console.log("4. Elemento saveText:", saveText);
    const imagePreview = document.getElementById('imagePreview');
    console.log("5. Elemento imagePreview:", imagePreview);
    const previewImg = document.getElementById('previewImg');
    console.log("6. Elemento previewImg:", previewImg);
    const imageUpload = document.getElementById('imageUpload');
    console.log("7. Elemento imageUpload:", imageUpload);


    if (!modal || !form || !modalTitle || !saveText || !imagePreview || !previewImg || !imageUpload) {
        console.error("ERRO: Um ou mais elementos do modal não foram encontrados. Verifique a estrutura do contarestaurante.html. Detalhes acima.");
        return; // Retorna para evitar erros se elementos essenciais não forem encontrados
    }

    form.reset();
    imagePreview.style.display = 'none';
    imageUpload.style.display = 'block';
    previewImg.src = '';
    document.getElementById('itemImage').value = '';
    currentEditingItem = item;

    if (item) {
        modalTitle.textContent = 'Editar Item do Cardápio';
        saveText.textContent = 'Salvar Alterações';
        document.getElementById('itemName').value = item.nome;
        document.getElementById('itemDescription').value = item.descricao;
        document.getElementById('itemPrice').value = item.preco.toFixed(2);
        document.getElementById('itemCategory').value = item.categoria;
        document.getElementById('itemAvailable').checked = item.disponivel;

        if (item.imageUrl) {
            previewImg.src = item.imageUrl;
            imagePreview.style.display = 'block';
            imageUpload.style.display = 'none';
        }
    } else {
        modalTitle.textContent = 'Adicionar Item ao Cardápio';
        saveText.textContent = 'Salvar Item';
        document.getElementById('itemAvailable').checked = true;
    }

    modal.style.display = 'flex'; // Isso torna o elemento flexível
    modal.classList.add('active'); // <--- ADICIONADO: Isso torna ele visível via CSS!
    console.log("8. Modal display set to flex and 'active' class added."); // DEPURACAO ATUALIZADA
}

function closeModal() {
    const modal = document.getElementById('itemModal');
    const form = document.getElementById('itemForm');
    
    const previewImg = document.getElementById('previewImg');
   

    if (modal) {
        modal.classList.remove('active'); // <--- ADICIONADO: Remove a classe 'active' ao fechar
        // Um pequeno delay pode ser útil se você tiver uma transição de saída no CSS
        // setTimeout(() => {
        //     modal.style.display = 'none';
        // }, 300); // 300ms, por exemplo, se a transição for de 0.3s
        modal.style.display = 'none'; // Isso oculta o elemento flexível imediatamente após remover a classe active
    }
    if (form) form.reset();
    currentEditingItem = null;
   
    if (previewImg) previewImg.src = '';
   
}

async function handleSave() {
    const form = document.getElementById('itemForm');
    const formData = new FormData(form);

    const itemName = formData.get('nome');
    const itemPrice = parseFloat(formData.get('preco'));
    const itemCategory = formData.get('categoria');

    if (!itemName || itemName.trim() === '') {
        alert('O nome do item é obrigatório.');
        return;
    }
    if (isNaN(itemPrice) || itemPrice <= 0) {
        alert('O preço do item deve ser um número positivo.');
        return;
    }
    if (!itemCategory || itemCategory.trim() === '') {
        alert('A categoria do item é obrigatória.');
        return;
    }

    const itemData = {
        nome: itemName,
        descricao: formData.get('descricao'),
        preco: itemPrice,
        categoria: itemCategory,
        disponivel: formData.get('disponivel') === 'on'
    };

    if (currentEditingItem) {
        itemData.id = currentEditingItem.id;
        
    }

  

    const saveLoading = document.getElementById('saveLoading');
    const saveText = document.getElementById('saveText');
    const saveBtn = document.getElementById('saveBtn');
    if (saveLoading) saveLoading.style.display = 'inline';
    if (saveText) saveText.style.display = 'none';
    if (saveBtn) saveBtn.disabled = true;

    await saveMenuItem(itemData, currentEditingItem === null);
}


