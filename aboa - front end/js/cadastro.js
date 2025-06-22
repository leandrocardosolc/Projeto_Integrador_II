// js/cadastro.js

document.addEventListener('DOMContentLoaded', () => {
    // Adiciona o listener para o formulário de cadastro
    const cadastroForm = document.querySelector('.main-container form'); // Seleciona o formulário principal da página de cadastro
    if (cadastroForm) { // Verifica se este formulário existe na página atual
        cadastroForm.addEventListener('submit', handleCadastroSubmit);
    }
});

// Função para lidar com o envio do formulário de cadastro
async function handleCadastroSubmit(event) {
    event.preventDefault(); // Impede o envio padrão do formulário (recarregar a página)

    // 1. Obter os valores dos campos do formulário
    const nomeCompleto = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();
    const confirmarSenha = document.getElementById('confirmar-senha').value.trim();
    const termosAceitos = document.getElementById('termos').checked;

    // 2. Realizar validações básicas no frontend
    if (!nomeCompleto || !email || !senha || !confirmarSenha) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem. Por favor, digite novamente.');
        return;
    }

    if (!termosAceitos) {
        alert('Você deve concordar com os Termos de Uso e Política de Privacidade.');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, insira um endereço de e-mail válido.');
        return;
    }

    // 3. Criar o objeto de dados a ser enviado para a API
    const userData = {
        nomeCompleto: nomeCompleto,
        email: email,
        senha: senha
    };

    // 4. Enviar os dados para a API
    try {
        const response = await fetch('http://localhost:8080/api/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        // 5. Lidar com a resposta da API
        if (response.ok) {
            const responseData = await response.json();
            alert('Cadastro realizado com sucesso!');
            console.log('Usuário cadastrado:', responseData);
            window.location.href = 'login.html'; // Redirecionar para a página de login
        } else {
            const errorData = await response.json();
            alert(`Erro no cadastro: ${errorData.message || 'Ocorreu um erro inesperado.'}`);
            console.error('Erro no cadastro:', response.status, errorData);
        }
    } catch (error) {
        alert('Não foi possível conectar ao servidor. Verifique sua conexão ou tente novamente mais tarde.');
        console.error('Erro de rede ou ao processar requisição:', error);
    }
}