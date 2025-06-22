// js/login.js

document.addEventListener('DOMContentLoaded', () => {
    // Adiciona o listener para o formulário de login
    const loginForm = document.querySelector('.circle-section form'); // Seleciona o formulário de login
    if (loginForm) { // Verifica se estamos na página de login
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
});

// Função para lidar com o envio do formulário de login
async function handleLoginSubmit(event) {
    event.preventDefault(); // Impede o envio padrão do formulário (recarregar a página)

    // 1. Obter os valores dos campos do formulário
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('password').value.trim(); // ID do campo senha é 'password'

    // 2. Realizar validações básicas no frontend
    if (!email || !senha) {
        alert('Por favor, preencha todos os campos (email e senha).');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, insira um endereço de e-mail válido.');
        return;
    }

    // 3. Criar os dados para o formato x-www-form-urlencoded
    // O backend espera 'username' e 'password'
    const formData = new URLSearchParams();
    formData.append('username', email); // O email é o username no seu backend
    formData.append('password', senha); // A senha é o password no seu backend

    // 4. Definir a URL da API de login
    const loginApiUrl = 'http://localhost:8080/api/auth/login-process'; // Endpoint de login do seu backend

    try {
        const response = await fetch(loginApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded' // Este é o formato que seu backend espera
            },
            body: formData.toString(), // Converte URLSearchParams para string para o corpo
            credentials: 'include' // IMPORTANTE: Para que o navegador envie e receba cookies de sessão
        });

        // 5. Lidar com a resposta da API
        if (response.ok) { // Status 2xx (200 OK)
            const responseData = await response.json(); // Sua API agora retorna {"message": "...", "roles": "..."}
            
            alert(responseData.message || 'Login realizado com sucesso!');
            console.log('Resposta do Login:', responseData);

            // --- Lógica de redirecionamento condicional baseada nos papéis ---
            if (responseData.roles && responseData.roles.includes('ROLE_RESTAURANT_OWNER')) { // Verifica se tem o papel de dono de restaurante
                window.location.href = 'contarestaurante.html'; // Redireciona para a página do restaurante
            } else {
                window.location.href = 'contausuario.html'; // Redireciona para a página de usuário padrão
            }
            // --- Fim da lógica de redirecionamento condicional ---
            
        } else if (response.status === 401) { // 401 Unauthorized (credenciais inválidas)
            const errorData = await response.json().catch(() => ({})); // Tenta ler o corpo do erro
            alert(errorData.message || 'E-mail ou senha incorretos. Por favor, tente novamente.');
            console.error('Erro de autenticação:', response.status, errorData);
        } else {
            // Outros erros (ex: 400 Bad Request, 500 Internal Server Error)
            const errorData = await response.json().catch(() => ({}));
            alert(`Erro no login: ${errorData.message || 'Ocorreu um erro inesperado.'}`);
            console.error('Erro no login:', response.status, errorData);
        }
    } catch (error) {
        // Lidar com erros de rede ou outros problemas durante a requisição
        alert('Não foi possível conectar ao servidor. Verifique sua conexão ou tente novamente mais tarde.');
        console.error('Erro de rede ou ao processar requisição:', error);
    }
}