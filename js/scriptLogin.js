document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    
    // Simulação de autenticação
    if (username === 'admin' && password === 'admin') {
        errorMessage.style.display = 'none';
        // Redirecionar para a página home.html
        window.location.href = '../html/home.html';
    } else {
        errorMessage.textContent = 'Usuário ou senha incorretos';
        errorMessage.style.display = 'block';
    }
});
