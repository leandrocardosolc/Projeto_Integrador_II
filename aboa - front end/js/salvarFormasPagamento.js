function salvarFormasPagamento() {
    const selects = document.querySelectorAll('.payment-select');
    const resultado = {};

    selects.forEach(select => {
        const metodo = select.getAttribute('data-label');
        const valor = select.value;
        resultado[metodo] = valor;
    });

    // Exemplo: aqui você pode fazer um fetch() para enviar ao backend
    console.log('Dados salvos:', resultado);
    alert('Formas de pagamento atualizadas com sucesso!');
}
