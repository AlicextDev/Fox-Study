document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:3000/api/usuario';

    // Telas
    const welcomeScreen = document.getElementById('welcome-screen');
    const loginScreen = document.getElementById('login-screen');
    const registerScreen = document.getElementById('register-screen');

    // Botões e links
    const showLoginBtn = document.getElementById('show-login-btn');
    const showRegisterBtn = document.getElementById('show-register-btn');
    const goToRegisterLink = document.getElementById('go-to-register');
    const goToLoginLink = document.getElementById('go-to-login');

    // Formulários
    const loginForm = loginScreen.querySelector('form');
    const registerForm = registerScreen.querySelector('form');

    // ---- Funções auxiliares ----
    function hideAllScreens() {
        welcomeScreen.classList.add('hidden');
        loginScreen.classList.add('hidden');
        registerScreen.classList.add('hidden');
    }

    function showScreen(screen) {
        hideAllScreens();
        screen.classList.remove('hidden');
    }

    showLoginBtn.addEventListener('click', () => showScreen(loginScreen));
    showRegisterBtn.addEventListener('click', () => showScreen(registerScreen));
    goToRegisterLink.addEventListener('click', (e) => { e.preventDefault(); showScreen(registerScreen); });
    goToLoginLink.addEventListener('click', (e) => { e.preventDefault(); showScreen(loginScreen); });

    // ---- CADASTRO ----
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nome = document.getElementById('register-name').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const senha = document.getElementById('register-password').value.trim();

        if (!nome || !email || !senha) {
            alert('Preencha todos os campos!');
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, senha })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Usuário cadastrado com sucesso!');
                showScreen(loginScreen);
            } else {
                alert(data.error || 'Erro ao cadastrar usuário.');
            }
        } catch (error) {
            console.error('Erro de conexão:', error);
            alert('Erro ao conectar com o servidor.');
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const senha = document.getElementById('login-password').value.trim();

        if (!email || !senha) {
            alert('Informe e-mail e senha!');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            });

            const data = await response.json();

            if (response.ok) {
                // Armazena o token JWT
                localStorage.setItem('token', data.token);
                alert('Login realizado com sucesso!');
                window.location.href = 'app.html';
            } else {
                alert(data.error || 'Erro ao fazer login.');
            }
        } catch (error) {
            console.error('Erro de conexão:', error);
            alert('Erro ao conectar com o servidor.');
        }
    });
});
