document.getElementById('resetPasswordForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const newPassword = document.getElementById('newPassword').value;

    fetch('https://6670d7410900b5f8724bbd7f.mockapi.io/login/credenciais', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usuario: username, senha: newPassword })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('success-message').innerText = 'Senha alterada com sucesso!';
        document.getElementById('success-message').style.display = 'block';
        document.getElementById('error-message').style.display = 'none';
    })
    .catch(error => {
        document.getElementById('error-message').innerText = 'Erro ao alterar a senha. Tente novamente.';
        document.getElementById('error-message').style.display = 'block';
        document.getElementById('success-message').style.display = 'none';
    });
});
