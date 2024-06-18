document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    
    // Chamada à API para verificar as credenciais
    fetch('https://6670d7410900b5f8724bbd7f.mockapi.io/login/credenciais')
        .then(response => response.json())
        .then(credentials => {
            // Verifica se as credenciais correspondem
            const user = credentials.find(user => user.usuario === username && user.senha === password);
            
            if (user) {
                errorMessage.style.display = 'none';
                // Redirecionar para a página home.html
                window.location.href = '../html/home.html';
            } else {
                errorMessage.textContent = 'Usuário ou senha incorretos';
                errorMessage.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Erro ao verificar credenciais:', error);
            errorMessage.textContent = 'Erro ao verificar credenciais. Tente novamente mais tarde.';
            errorMessage.style.display = 'block';
        });
});
