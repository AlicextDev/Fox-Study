document.addEventListener('DOMContentLoaded', () => {
    // Seleciona as telas de autenticação
    const welcomeScreen = document.getElementById('welcome-screen');
    const loginScreen = document.getElementById('login-screen');
    const registerScreen = document.getElementById('register-screen');

    // Botões e Links
    const showLoginBtn = document.getElementById('show-login-btn');
    const showRegisterBtn = document.getElementById('show-register-btn');
    const goToRegisterLink = document.getElementById('go-to-register');
    const goToLoginLink = document.getElementById('go-to-login');
    
    // Formulários
    const loginForm = loginScreen.querySelector('form');
    const registerForm = registerScreen.querySelector('form');

    // Função para esconder todas as telas de autenticação
    function hideAllScreens() {
        welcomeScreen.classList.add('hidden');
        loginScreen.classList.add('hidden');
        registerScreen.classList.add('hidden');
    }

    // Função para mostrar uma tela de autenticação específica
    function showScreen(screen) {
        hideAllScreens();
        screen.classList.remove('hidden');
    }

    // Navegação entre as telas de autenticação
    showLoginBtn.addEventListener('click', () => showScreen(loginScreen));
    showRegisterBtn.addEventListener('click', () => showScreen(registerScreen));
    goToRegisterLink.addEventListener('click', (e) => { e.preventDefault(); showScreen(registerScreen); });
    goToLoginLink.addEventListener('click', (e) => { e.preventDefault(); showScreen(loginScreen); });

    
    // Função para redirecionar para a página principal do app
    function enterApp(e) {
        e.preventDefault(); // Impede o envio real do formulário
        window.location.href = 'app.html'; // Redireciona para a nova página
    }

    // Adiciona o evento de entrar no app aos formulários
    loginForm.addEventListener('submit', enterApp);
    registerForm.addEventListener('submit', enterApp);
});