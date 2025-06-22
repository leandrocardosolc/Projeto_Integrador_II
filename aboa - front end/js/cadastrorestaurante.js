// js/cadastrorestaurante.js

document.addEventListener('DOMContentLoaded', () => {
    // Adiciona o listener para o formulário de cadastro de restaurante
    const signupForm = document.getElementById('restaurant-signup-form'); // Seleciona o formulário pelo ID
    if (signupForm) { // Verifica se o formulário existe na página atual
        signupForm.addEventListener('submit', handleRestaurantSignup);
    }

    // --- Funções de formatação e validação (movidas do HTML para este arquivo) ---
    // Listener para formatar CNPJ enquanto o usuário digita
    document.getElementById('cnpj').addEventListener('input', function(e) {
        let value = e.target.value;
        value = value.replace(/\D/g, ''); // Remove tudo que não é dígito
        if (value.length > 14) value = value.substring(0, 14);
        if (value.length > 12) value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/, '$1.$2.$3/$4-$5');
        else if (value.length > 8) value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d*).*/, '$1.$2.$3/$4');
        else if (value.length > 5) value = value.replace(/^(\d{2})(\d{3})(\d*).*/, '$1.$2.$3');
        else if (value.length > 2) value = value.replace(/^(\d{2})(\d*).*/, '$1.$2');
        e.target.value = value;
    });

    // Listener para formatar CEP enquanto o usuário digita
    document.getElementById('cep').addEventListener('input', function(e) {
        let value = e.target.value;
        value = value.replace(/\D/g, ''); // Remove tudo que não é dígito
        if (value.length > 8) value = value.substring(0, 8);
        if (value.length > 5) value = value.replace(/^(\d{5})(\d*).*/, '$1-$2');
        e.target.value = value;
    });

    // Listener para formatar telefone enquanto o usuário digita
    document.getElementById('telefone').addEventListener('input', function(e) {
        let value = e.target.value;
        value = value.replace(/\D/g, ''); // Remove tudo que não é dígito
        if (value.length > 11) value = value.substring(0, 11);
        if (value.length > 10) value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
        else if (value.length > 6) value = value.replace(/^(\d{2})(\d{4})(\d*).*/, '($1) $2-$3');
        else if (value.length > 2) value = value.replace(/^(\d{2})(\d*).*/, '($1) $2');
        e.target.value = value;
    });
    
    // Gerenciar estado da inscrição estadual (isento/não isento)
    document.getElementById('isento-ie').addEventListener('change', function() {
        const inscricaoEstadualInput = document.getElementById('inscricao-estadual');
        if (this.checked) {
            inscricaoEstadualInput.value = 'ISENTO';
            inscricaoEstadualInput.disabled = true;
        } else {
            inscricaoEstadualInput.value = '';
            inscricaoEstadualInput.disabled = false;
        }
    });

    // Consulta de CEP via API ViaCEP (no evento blur)
    document.getElementById('cep').addEventListener('blur', async function() {
        const cep = this.value.replace(/\D/g, '');
        if (cep.length !== 8) return;
        
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            if (!data.erro) {
                document.getElementById('logradouro').value = data.logradouro; // ID 'logradouro'
                document.getElementById('bairro').value = data.bairro;
                document.getElementById('cidade').value = data.localidade;
                document.getElementById('estado').value = data.uf;
                document.getElementById('numero').focus(); // Focar no campo número
            } else {
                alert('CEP não encontrado.');
            }
        } catch (error) {
            console.error('Erro ao consultar CEP:', error);
            alert('Erro ao consultar CEP. Tente novamente.');
        }
    });
});

// --- Funções de Validação (Mantenha-as aqui ou em um arquivo de utils) ---

function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, '');
    if (cnpj.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(cnpj)) return false; // Elimina CNPJs com todos os dígitos iguais
    
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0)) return false;
    
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1)) return false;
    
    return true;
}

function validarCEP(cep) {
    cep = cep.replace(/\D/g, '');
    return cep.length === 8;
}

// --- Função principal para lidar com o envio do formulário de cadastro de restaurante ---
async function handleRestaurantSignup(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // 1. Coletar dados do formulário
    const razaoSocial = document.getElementById('razao-social').value.trim();
    const nomeFantasia = document.getElementById('nome-fantasia').value.trim();
    const cnpj = document.getElementById('cnpj').value.trim();
    let inscricaoEstadual = document.getElementById('inscricao-estadual').value.trim();
    const isentoIE = document.getElementById('isento-ie').checked;
    if (isentoIE) inscricaoEstadual = 'ISENTO'; // Garante que é 'ISENTO' se a checkbox estiver marcada
    const ramoAtividade = document.getElementById('ramo-atividade').value; // Valor do select
    
    const cep = document.getElementById('cep').value.trim();
    const logradouro = document.getElementById('logradouro').value.trim(); // ID 'logradouro'
    const numero = document.getElementById('numero').value.trim();
    const complemento = document.getElementById('complemento').value.trim();
    const bairro = document.getElementById('bairro').value.trim();
    const cidade = document.getElementById('cidade').value.trim();
    const estado = document.getElementById('estado').value; // Valor do select
    const telefone = document.getElementById('telefone').value.trim();
    const emailEstabelecimento = document.getElementById('email-estabelecimento').value.trim(); // Novo campo
    const logoUrl = document.getElementById('logo-url').value.trim(); // Novo campo
    const coverImageUrl = document.getElementById('cover-image-url').value.trim(); // Novo campo
    const descricaoEstabelecimento = document.getElementById('descricao-estabelecimento').value.trim(); // Novo campo
    const linkMapa = document.getElementById('link-mapa').value.trim(); // Novo campo


    const termsAccepted = document.getElementById('terms').checked; // Checkbox de termos

    // 2. Validações frontend (com os novos campos e IDs)
    if (!razaoSocial || !nomeFantasia || !cnpj || !ramoAtividade ||
        !cep || !logradouro || !numero || !bairro || !cidade || !estado || !telefone ||
        !emailEstabelecimento || !termsAccepted) { // Termos de uso também são obrigatórios
        alert('Por favor, preencha todos os campos obrigatórios e aceite os termos de uso.');
        return;
    }

    if (!validarCNPJ(cnpj)) {
        alert('CNPJ inválido! Por favor, verifique o número informado.');
        return;
    }

    if (!validarCEP(cep)) {
        alert('CEP inválido! Por favor, verifique o número informado.');
        return;
    }
    
    // Opcional: Validação de formato de e-mail do estabelecimento
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailEstabelecimento)) {
        alert('Por favor, insira um endereço de e-mail válido para o estabelecimento.');
        return;
    }

    // 3. Montar o objeto de dados a ser enviado para a API (RestauranteDTO)
    // A estrutura deve corresponder ao que seu RestauranteDTO e o backend esperam.
    const restaurantData = {
        nomeFantasia: nomeFantasia,
        razaoSocial: razaoSocial,
        cnpj: cnpj,
        inscricaoEstadual: inscricaoEstadual,
        email: emailEstabelecimento, // E-mail do estabelecimento
        telefone: telefone,
        ramoAtividade: ramoAtividade,
        descricao: descricaoEstabelecimento,
        linkMapa: linkMapa,
        logoUrl: logoUrl,
        // Garante que seja null se o campo estiver vazio para não enviar string vazia
        // e evitar problemas com validações de URL no backend.
        coverImageUrl: coverImageUrl === '' ? null : coverImageUrl, 
        
        endereco: { // Objeto Endereco aninhado
            cep: cep,
            logradouro: logradouro,
            numero: numero,
            complemento: complemento,
            bairro: bairro,
            cidade: cidade,
            estado: estado
        }
        // OBS: Se você tem um campo 'usuarioProprietarioId' no RestauranteDTO e no backend,
        // ele seria preenchido automaticamente no serviço do Spring Boot
        // com o ID do usuário logado, como discutimos.
    };

    // 4. Enviar os dados para a API (POST /api/restaurantes)
    // Esta requisição PRECISA de autenticação (usuário logado).
    try {
        const response = await fetch('http://localhost:8080/api/restaurantes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // IMPORTANTE: Para que o navegador envie cookies de sessão
            body: JSON.stringify(restaurantData)
        });

        // 5. Lidar com a resposta da API
        if (response.ok || response.status === 201) { // 201 Created é o esperado para POST
            const responseData = await response.json();
            alert('Cadastro de restaurante realizado com sucesso!');
            console.log('Restaurante cadastrado:', responseData);
            // Redirecionar para a página do perfil do restaurante após o cadastro
            window.location.href = 'contarestaurante.html'; 
        } else if (response.status === 401 || response.status === 403) {
            // 401 Unauthorized / 403 Forbidden: Usuário não autenticado ou sem permissão
            alert('Você precisa estar logado e ter permissão para cadastrar um restaurante. Faça login como proprietário.');
            window.location.href = 'login.html'; // Redireciona para login
        } else if (response.status === 400) { // Bad Request: Erro de validação no backend
            const errorData = await response.json().catch(() => ({}));
            alert(`Erro de validação: ${errorData.message || 'Dados inválidos ou incompletos.'}`);
            console.error('Erro de validação:', response.status, errorData);
        } else if (response.status === 409) { // Conflict: CNPJ ou e-mail já cadastrado
            const errorData = await response.json().catch(() => ({}));
            alert(`Erro no cadastro: ${errorData.message || 'Restaurante com CNPJ ou E-mail já cadastrado.'}`);
            console.error('Erro de conflito:', response.status, errorData);
        } else { // Outros erros
            const errorData = await response.json().catch(() => ({}));
            alert(`Erro no cadastro do restaurante: ${errorData.message || 'Ocorreu um erro inesperado no servidor.'}`);
            console.error('Erro no cadastro do restaurante:', response.status, errorData);
        }
    } catch (error) {
        // Lidar com erros de rede ou outros problemas durante a requisição
        alert('Não foi possível conectar ao servidor. Verifique sua conexão ou tente novamente mais tarde.');
        console.error('Erro de rede ou ao processar requisição:', error);
    }
}