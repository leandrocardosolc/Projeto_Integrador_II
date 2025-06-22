// js/contausuario.js

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar carregamento de dados do usuário e configurar listeners
    loadUserDataAndSetupListeners();

    // Adiciona listeners para os botões de editar perfil (se aplicável)
    const editarPerfilBtn = document.querySelector('.profile-section .btn-primary'); // Seleciona o botão de editar perfil
    if (editarPerfilBtn) {
        editarPerfilBtn.addEventListener('click', () => alert('Funcionalidade "Editar perfil" a ser implementada.'));
    }

    // Adiciona listeners para os toggles de notificação
    document.querySelectorAll('.toggle-switch input[type="checkbox"]').forEach(toggle => {
        toggle.addEventListener('change', handleNotificationToggleChange);
    });

    // Adiciona listener para o botão "Alterar Senha"
    const alterarSenhaBtn = document.querySelector('.info-section .info-item button.btn-outline');
    if (alterarSenhaBtn) {
        alterarSenhaBtn.addEventListener('click', () => alert('Funcionalidade "Alterar Senha" a ser implementada.'));
    }

    // Adiciona listeners para os botões de editar/excluir endereços e pagamentos
    // Estes serão criados dinamicamente ao carregar os dados
});

// Função principal para carregar dados do usuário e configurar a página
async function loadUserDataAndSetupListeners() {
    try {
        const userData = await fetchUserData(); // Chama fetchUserData para obter os dados do usuário
        if (userData) {
            displayUserData(userData); // Exibe os dados do usuário na interface
            // Você pode descomentar e implementar a renderização de endereços e pagamentos quando tiver os dados no backend
            // renderUserAddresses(userData.enderecos || []); 
            // renderPaymentMethods(userData.formasPagamento || []);
        }
    } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error); // Loga o erro
        alert('Não foi possível carregar suas informações. Tente novamente mais tarde.');
        displayStaticUserData(); // Exibe dados estáticos em caso de erro da API
    }
}

// =========================================================
// FUNÇÕES AUXILIARES PARA DADOS DO USUÁRIO
// =========================================================

// Função para buscar dados do usuário logado na API
async function fetchUserData() {
    // O navegador envia os cookies de sessão automaticamente para a mesma origem,
    // mas 'credentials: include' é explicitamente necessário para requisições cross-origin (portas diferentes no localhost).
    const headers = {
        'Content-Type': 'application/json'
    };
    
    const response = await fetch(`http://localhost:8080/api/usuarios/me`, { // Endpoint para buscar o perfil do usuário logado
        method: 'GET',
        headers: headers,
        credentials: 'include' // <<--- ESTA É A ADIÇÃO CRÍTICA AQUI!
    });

    if (!response.ok) {
        if (response.status === 401 || response.status === 403) { // Se não autenticado ou proibido
            alert('Sessão expirada ou não autorizada. Por favor, faça login novamente.');
            window.location.href = 'login.html'; // Redireciona para a página de login
        }
        throw new Error(`Erro ao buscar dados do usuário: ${response.statusText}`); // Lança erro para ser capturado no catch
    }
    return await response.json(); // Retorna os dados do perfil em JSON
}

// Função para exibir os dados do usuário na interface (mantida igual)
function displayUserData(user) {
    const userNameElement = document.querySelector('.profile-section .user-name'); // Seleciona o nome do usuário
    const userEmailElement = document.querySelector('.profile-section .user-email'); // Seleciona o email do usuário
    
    if (userNameElement) userNameElement.textContent = user.nomeCompleto || 'Usuário Desconhecido';
    if (userEmailElement) userEmailElement.textContent = user.email || 'email@desconhecido.com';

    const nomeCompletoInfo = document.querySelector('.info-section .info-grid .info-item:nth-child(1) .info-value');
    const emailInfo = document.querySelector('.info-section .info-grid .info-item:nth-child(2) .info-value');
    const telefoneInfo = document.querySelector('.info-section .info-grid .info-item:nth-child(3) .info-value');
    const dataNascimentoInfo = document.querySelector('.info-section .info-grid .info-item:nth-child(4) .info-value');
    const cpfInfo = document.querySelector('.info-section .info-grid .info-item:nth-child(5) .info-value');
    const generoInfo = document.querySelector('.info-section .info-grid .info-item:nth-child(6) .info-value');

    if (nomeCompletoInfo) nomeCompletoInfo.textContent = user.nomeCompleto || '';
    if (emailInfo) emailInfo.textContent = user.email || '';
    if (telefoneInfo) telefoneInfo.textContent = user.telefone || '(Não informado)';
    if (dataNascimentoInfo) dataNascimentoInfo.textContent = user.dataNascimento ? formatDate(user.dataNascimento) : '(Não informado)';
    if (cpfInfo) cpfInfo.textContent = user.cpf ? formatCpf(user.cpf) : '(Não informado)';
    if (generoInfo) generoInfo.textContent = user.genero || '(Não informado)';

    const profilePhotoImg = document.querySelector('.profile-section .profile-photo img'); // Seleciona a imagem do perfil
    if (profilePhotoImg && user.profileImageUrl) {
        profilePhotoImg.src = user.profileImageUrl;
    }
}

// Função para exibir dados estáticos caso a API não funcione ou não haja login
function displayStaticUserData() {
    const userNameElement = document.querySelector('.profile-section .user-name');
    const userEmailElement = document.querySelector('.profile-section .user-email');
    if (userNameElement) userNameElement.textContent = "Maria Silva";
    if (userEmailElement) userEmailElement.textContent = "maria.silva@email.com";
    
    const nomeCompletoInfo = document.querySelector('.info-section .info-grid .info-item:nth-child(1) .info-value');
    const emailInfo = document.querySelector('.info-section .info-grid .info-item:nth-child(2) .info-value');
    const telefoneInfo = document.querySelector('.info-section .info-grid .info-item:nth-child(3) .info-value');
    const dataNascimentoInfo = document.querySelector('.info-section .info-grid .info-item:nth-child(4) .info-value');
    const cpfInfo = document.querySelector('.info-section .info-grid .info-item:nth-child(5) .info-value');
    const generoInfo = document.querySelector('.info-section .info-grid .info-item:nth-child(6) .info-value');

    if (nomeCompletoInfo) nomeCompletoInfo.textContent = "Maria Oliveira Silva";
    if (emailInfo) emailInfo.textContent = "maria.silva@email.com";
    if (telefoneInfo) telefoneInfo.textContent = "(11) 98765-4321";
    if (dataNascimentoInfo) dataNascimentoInfo.textContent = "15/05/1990";
    if (cpfInfo) cpfInfo.textContent = "***.***.***-**";
    if (generoInfo) generoInfo.textContent = "Feminino";
}

// Funções de formatação (mantidas iguais)
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function formatCpf(cpf) {
    if (!cpf) return '';
    return '***.***.***-**';
}


// =========================================================
// FUNÇÕES AUXILIARES PARA ENDEREÇOS E PAGAMENTOS (Esqueleto, sem JWT)
// =========================================================

function renderUserAddresses(addresses) {
    const addressesContainer = document.querySelector('.info-section .address-card').parentNode;
    addressesContainer.innerHTML = '';

    if (addresses.length === 0) {
        addressesContainer.innerHTML = '<p class="no-items">Nenhum endereço cadastrado.</p>';
        return;
    }

    addresses.forEach(address => {
        const addressCard = document.createElement('div');
        addressCard.className = `address-card ${address.isDefault ? 'default' : ''}`;
        addressCard.innerHTML = `
            <div class="address-type">
                <span>${address.tipo || 'Endereço'} ${address.isDefault ? '<span class="default-badge">Padrão</span>' : ''}</span>
                <div class="address-actions">
                    <button data-id="${address.id}" class="action-btn edit-address-btn">Editar</button>
                    <button data-id="${address.id}" class="action-btn delete-address-btn">Excluir</button>
                    ${!address.isDefault ? `<button data-id="${address.id}" class="action-btn set-default-address-btn">Definir como padrão</button>` : ''}
                </div>
            </div>
            <div class="address-details">
                ${address.logradouro}, ${address.numero}${address.complemento ? ', ' + address.complemento : ''}<br>
                ${address.bairro} - ${address.cidade}, ${address.estado}<br>
                CEP: ${address.cep}<br>
                ${address.referencia ? `Referência: ${address.referencia}` : ''}
            </div>
        `;
        addressesContainer.appendChild(addressCard);
    });

    addressesContainer.querySelectorAll('.edit-address-btn').forEach(btn => btn.addEventListener('click', (e) => alert(`Editar endereço ${e.target.dataset.id}`)));
    addressesContainer.querySelectorAll('.delete-address-btn').forEach(btn => btn.addEventListener('click', (e) => confirm('Tem certeza que deseja excluir este endereço?') && deleteAddress(e.target.dataset.id)));
    addressesContainer.querySelectorAll('.set-default-address-btn').forEach(btn => btn.addEventListener('click', (e) => alert(`Definir como padrão: ${e.target.dataset.id}`)));
}

async function deleteAddress(addressId) {
    try {
        const response = await fetch(`http://localhost:8080/api/enderecos/${addressId}`, {
            method: 'DELETE',
            credentials: 'include' // Adicionado para garantir o envio de cookies
        });
        if (response.ok) {
            alert('Endereço excluído com sucesso!');
            loadUserDataAndSetupListeners();
        } else {
            const errorData = await response.json().catch(() => ({}));
            alert(`Erro ao excluir endereço: ${errorData.message || 'Ocorreu um erro.'}`);
        }
    } catch (error) {
        console.error('Erro na exclusão do endereço:', error);
        alert('Erro de conexão ao excluir endereço.');
    }
}


function renderPaymentMethods(payments) {
    const paymentsContainer = document.querySelector('.info-section .payment-methods');
    paymentsContainer.innerHTML = '';

    if (payments.length === 0) {
        paymentsContainer.innerHTML = '<p class="no-items">Nenhuma forma de pagamento cadastrada.</p>';
        return;
    }

    payments.forEach(payment => {
        const paymentCard = document.createElement('div');
        paymentCard.className = 'payment-card';
        paymentCard.innerHTML = `
            <div class="card-type">
                <strong>${payment.type || 'Cartão'}</strong>
                <div class="address-actions">
                    <button data-id="${payment.id}" class="action-btn delete-payment-btn">Excluir</button>
                </div>
            </div>
            <div class="card-number">•••• •••• •••• ${payment.lastFourDigits || 'XXXX'}</div>
            <div class="card-info">Válido até ${payment.expiryDate || 'MM/AA'}</div>
        `;
        paymentsContainer.appendChild(paymentCard);
    });

    paymentsContainer.querySelectorAll('.delete-payment-btn').forEach(btn => btn.addEventListener('click', (e) => confirm('Tem certeza que deseja excluir esta forma de pagamento?') && deletePaymentMethod(e.target.dataset.id)));
}

async function deletePaymentMethod(paymentId) {
    try {
        const response = await fetch(`http://localhost:8080/api/pagamentos/${paymentId}`, {
            method: 'DELETE',
            credentials: 'include' // Adicionado para garantir o envio de cookies
        });
        if (response.ok) {
            alert('Forma de pagamento excluída com sucesso!');
            loadUserDataAndSetupListeners();
        } else {
            const errorData = await response.json().catch(() => ({}));
            alert(`Erro ao excluir forma de pagamento: ${errorData.message || 'Ocorreu um erro.'}`);
        }
    } catch (error) {
        console.error('Erro na exclusão da forma de pagamento:', error);
        alert('Erro de conexão ao excluir forma de pagamento.');
    }
}

// =========================================================
// FUNÇÕES AUXILIARES PARA NOTIFICAÇÕES E ABAS
// =========================================================

function handleNotificationToggleChange(event) {
    const toggle = event.target;
    const preferenceLabel = toggle.closest('.notification-preference').querySelector('.info-label').textContent;
    const isChecked = toggle.checked;

    console.log(`Preferencia de notificação "${preferenceLabel}" alterada para: ${isChecked}`);
    // Aqui você enviaria a alteração para a API do backend
    alert(`Preferência de "${preferenceLabel}" ${isChecked ? 'ativada' : 'desativada'}. (Esta é uma simulação)`);
}

document.querySelectorAll('.tabs .tab').forEach(tab => {
    tab.addEventListener('click', (event) => {
        document.querySelectorAll('.tabs .tab').forEach(t => t.classList.remove('active'));
        event.target.classList.add('active');
        console.log(`Aba clicada: ${event.target.textContent}`);
        alert(`Funcionalidade de abas para "${event.target.textContent}" a ser implementada.`);
    });
});