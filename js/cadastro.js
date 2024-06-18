document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    
    // Verificação simples para uma senha forte
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        errorMessage.textContent = 'A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial.';
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';
        return;
    }

    // Envio dos dados para a API
    fetch('https://6670d7410900b5f8724bbd7f.mockapi.io/login/credenciais', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            usuario: username,
            senha: password,
            email: email,
            nome: fullName
        })
    })
    .then(response => response.json())
    .then(() => {
        successMessage.textContent = 'Cadastro realizado com sucesso! Redirecionando para a página de login...';
        successMessage.style.display = 'block';
        errorMessage.style.display = 'none';
        setTimeout(() => {
            window.location.href = '../html/login.html';
        }, 2000);
    })
    .catch(error => {
        console.error('Erro ao cadastrar:', error);
        errorMessage.textContent = 'Erro ao cadastrar. Tente novamente mais tarde.';
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';
    });
});
