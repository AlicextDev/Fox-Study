document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:3000/api'; 
    
    // --- Autenticação ---
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Sessão expirada. Por favor, faça login novamente.');
        window.location.href = 'index.html'; 
        return;
    }

    const authHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // --- Elementos da DOM ---
    // Telas
    const materiasScreen = document.getElementById('materias-screen');
    const createMateriaScreen = document.getElementById('create-materia-screen');
    const configScreen = document.getElementById('config-screen');
    const flashcardsScreen = document.getElementById('flashcards-screen');
    const pomodoroScreen = document.getElementById('pomodoro-screen'); // NOVO

    // Array de todas as telas para navegação
    const allAppScreens = [materiasScreen, createMateriaScreen, configScreen, flashcardsScreen, pomodoroScreen];

    // Menu Lateral
    const navMaterias = document.getElementById('nav-materias');
    const navConfig = document.getElementById('nav-config');
    const navPomodoro = document.getElementById('nav-pomodoro'); // NOVO
    
    const allNavLinks = [navMaterias, navConfig, navPomodoro];

    // Botões e Inputs
    const showCreateMateriaBtn = document.getElementById('show-create-materia-btn');
    const cancelCreateMateriaBtn = document.getElementById('cancel-create-materia-btn');
    const saveMateriaBtn = document.getElementById('save-materia-btn');
    const materiasGrid = materiasScreen.querySelector('.subjects-grid');
    const inputNomeMateria = document.getElementById('input-nome-materia');
    const inputTipoMateria = document.getElementById('select-tipo-materia');
    
    // Flashcards Elements
    const flashcardsContainer = document.getElementById('flashcards-container');
    const backToMateriasBtn = document.getElementById('back-to-materias-btn');
    const toggleCreateCardBtn = document.getElementById('toggle-create-card-btn');
    const createCardArea = document.getElementById('create-card-area');
    const inputPergunta = document.getElementById('input-pergunta');
    const inputResposta = document.getElementById('input-resposta');
    const saveCardBtn = document.getElementById('save-card-btn');
    const flashcardTitle = document.getElementById('flashcard-title');
    let materiaAtualId = null; 

    // Config Elements
    const configNome = document.getElementById('config-nome');
    const configEmail = document.getElementById('config-email');
    const configSaveBtn = document.getElementById('config-save-perfil');
    const configAparenciaPanel = document.getElementById('config-aparencia-panel');

    // Pomodoro Elements (NOVO)
    const timerDisplay = document.getElementById('timer-display');
    const startTimerBtn = document.getElementById('start-timer-btn');
    const pauseTimerBtn = document.getElementById('pause-timer-btn');
    const resetTimerBtn = document.getElementById('reset-timer-btn');
    const modeBtns = document.querySelectorAll('.mode-btn');
    
    // Variáveis Pomodoro
    let timerInterval = null;
    let timeLeft = 25 * 60; // Começa com 25 min em segundos
    let isRunning = false;

    const cores = ['#518CAC', '#B7CB98', '#799554', '#ED6830', '#3a6a8a'];

    // ---- Funções de Navegação ----
    function showAppScreen(screenToShow) {
        allAppScreens.forEach(screen => screen.classList.add('hidden'));
        screenToShow.classList.remove('hidden');
    }

    function setActiveNav(linkToActivate) {
        allNavLinks.forEach(link => link.classList.remove('active'));
        if(linkToActivate) linkToActivate.classList.add('active');
    }

    // Listeners do Menu Lateral
    navMaterias.addEventListener('click', (e) => {
        e.preventDefault();
        showAppScreen(materiasScreen);
        setActiveNav(navMaterias);
        carregarMaterias();
    });

    navConfig.addEventListener('click', (e) => {
        e.preventDefault();
        showAppScreen(configScreen);
        setActiveNav(navConfig);
        carregarConfiguracoes();
    });

    // Listener para a tela Pomodoro
    navPomodoro.addEventListener('click', (e) => {
        e.preventDefault();
        showAppScreen(pomodoroScreen);
        setActiveNav(navPomodoro);
    });

    // --- LÓGICA DO POMODORO (NOVO) ---

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        // Formata 05:09
        const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        timerDisplay.textContent = formattedTime;
        
        // Atualiza o título da aba navegador (opcional, legal para foco)
        if (isRunning) document.title = `(${formattedTime}) FoxStudy`;
        else document.title = 'FoxStudy';
    }

    function startTimer() {
        if (isRunning) return;
        
        isRunning = true;
        startTimerBtn.classList.add('hidden');
        pauseTimerBtn.classList.remove('hidden');

        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                isRunning = false;
                playAlarm(); // Toca som
                alert("Tempo esgotado! Bom trabalho.");
                resetUI();
            }
        }, 1000);
    }

    function pauseTimer() {
        clearInterval(timerInterval);
        isRunning = false;
        startTimerBtn.classList.remove('hidden');
        pauseTimerBtn.classList.add('hidden');
    }

    function resetTimer() {
        pauseTimer();
        // Pega o tempo do botão ativo
        const activeMode = document.querySelector('.mode-btn.active');
        const minutes = parseInt(activeMode.dataset.time);
        timeLeft = minutes * 60;
        updateTimerDisplay();
    }

    function resetUI() {
        startTimerBtn.classList.remove('hidden');
        pauseTimerBtn.classList.add('hidden');
    }

    // Som de alarme simples (Bip do navegador)
    function playAlarm() {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1); // Toca por 1 segundo
    }

    // Event Listeners do Pomodoro
    startTimerBtn.addEventListener('click', startTimer);
    pauseTimerBtn.addEventListener('click', pauseTimer);
    resetTimerBtn.addEventListener('click', resetTimer);

    modeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Troca a classe active
            modeBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            // Reseta o tempo baseado no botão clicado
            const minutes = parseInt(e.target.dataset.time);
            timeLeft = minutes * 60;
            
            pauseTimer(); // Para se estiver rodando
            updateTimerDisplay();
        });
    });

    // --- LÓGICA DE MATÉRIAS ---
    showCreateMateriaBtn.addEventListener('click', () => showAppScreen(createMateriaScreen));
    cancelCreateMateriaBtn.addEventListener('click', () => showAppScreen(materiasScreen));

    saveMateriaBtn.addEventListener('click', async () => {
        const nome = inputNomeMateria.value.trim();
        const tipo = inputTipoMateria.value;
        
        if (!nome || tipo === 'Tipo') return alert('Preencha todos os campos');

        try {
            const res = await fetch(`${API_URL}/materia`, {
                method: 'POST', 
                headers: authHeaders,
                body: JSON.stringify({ nome_materia: nome, tipo_materia: tipo })
            });
            if (res.ok) {
                alert('Matéria criada!');
                inputNomeMateria.value = '';
                inputTipoMateria.selectedIndex = 0;
                showAppScreen(materiasScreen);
                carregarMaterias();
            } else {
                const data = await res.json();
                alert(data.error || 'Erro ao criar matéria');
            }
        } catch (err) { console.error('Erro ao salvar matéria:', err); }
    });

    async function carregarMaterias() {
        materiasGrid.innerHTML = '<p>Carregando...</p>';
        try {
            const res = await fetch(`${API_URL}/materia`, { method: 'GET', headers: authHeaders });
            const data = await res.json();
            
            materiasGrid.innerHTML = '';
            if (res.ok && Array.isArray(data)) {
                if (data.length === 0) {
                    materiasGrid.innerHTML = '<p>Nenhuma matéria encontrada. Clique em "Criar Matéria" para começar!</p>';
                    return;
                }

                data.forEach((m, index) => {
                    const cor = cores[index % cores.length];
                    const card = document.createElement('div');
                    card.className = 'subject-card';
                    card.style.backgroundColor = cor;
                    card.style.cursor = 'pointer';
                    
                    card.onclick = () => abrirFlashcards(m.id_materia, m.nome_materia);

                    card.innerHTML = `
                        <div class="card-header"><i data-feather="book"></i></div>
                        <div class="card-body">${m.nome_materia}</div>
                        <div class="card-footer">
                            <span>Ver Cards</span> <i data-feather="arrow-right" style="width:16px"></i>
                        </div>
                    `;
                    materiasGrid.appendChild(card);
                });
                if(window.feather) feather.replace();
            }
        } catch (err) { console.error('Erro ao carregar matérias:', err); }
    }

    // --- LÓGICA DE FLASHCARDS ---
    function abrirFlashcards(id, nome) {
        materiaAtualId = id;
        flashcardTitle.textContent = nome;
        showAppScreen(flashcardsScreen);
        createCardArea.classList.add('hidden');
        carregarListaFlashcards(id);
    }

    backToMateriasBtn.addEventListener('click', () => {
        materiaAtualId = null;
        showAppScreen(materiasScreen);
    });

    toggleCreateCardBtn.addEventListener('click', () => {
        createCardArea.classList.toggle('hidden');
    });

    async function carregarListaFlashcards(idMateria) {
        flashcardsContainer.innerHTML = '<p>Carregando cards...</p>';
        try {
            const res = await fetch(`${API_URL}/usuario/flashcards/${idMateria}`, { headers: authHeaders });
            
            if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);

            const data = await res.json();
            flashcardsContainer.innerHTML = '';

            if (data.length === 0) {
                flashcardsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align:center; opacity: 0.7;">Nenhum flashcard criado para esta matéria.</p>';
                return;
            }

            data.forEach(card => {
                const el = document.createElement('div');
                el.className = 'flip-card';
                el.innerHTML = `
                    <div class="flip-card-inner">
                        <div class="flip-card-front">
                            <p>${card.pergunta}</p>
                        </div>
                        <div class="flip-card-back">
                            <p>${card.resposta}</p>
                        </div>
                    </div>
                `;
                el.addEventListener('click', () => el.classList.toggle('flipped'));
                flashcardsContainer.appendChild(el);
            });
        } catch (err) { console.error('Erro ao carregar flashcards:', err); }
    }

    saveCardBtn.addEventListener('click', async () => {
        const pergunta = inputPergunta.value.trim();
        const resposta = inputResposta.value.trim();

        if(!pergunta || !resposta) return alert('Preencha frente e verso!');

        try {
            const res = await fetch(`${API_URL}/usuario/flashcards`, {
                method: 'POST', 
                headers: authHeaders,
                body: JSON.stringify({ 
                    pergunta, 
                    resposta, 
                    materia_id: materiaAtualId
                })
            });
            if(res.ok) {
                inputPergunta.value = '';
                inputResposta.value = '';
                createCardArea.classList.add('hidden');
                carregarListaFlashcards(materiaAtualId);
            } else {
                alert('Erro ao salvar card.');
            }
        } catch(err) { console.error('Erro ao salvar flashcard:', err); }
    });

    // --- LÓGICA DE PERFIL ---
    async function carregarConfiguracoes() {
        try {
            const res = await fetch(`${API_URL}/usuario/perfil`, { headers: authHeaders });
            const data = await res.json();
            if (res.ok) {
                configNome.value = data.nome;
                configEmail.value = data.email;
                aplicarTema(data.preferencia_tema);
            }
        } catch (err) { console.error('Erro ao carregar perfil:', err); }
    }

    configSaveBtn.addEventListener('click', async () => {
        try {
            await fetch(`${API_URL}/usuario/perfil`, {
                method: 'PUT', 
                headers: authHeaders,
                body: JSON.stringify({ 
                    nome: configNome.value.trim(), 
                    email: configEmail.value.trim() 
                })
            });
            alert('Perfil atualizado!');
        } catch (err) { alert('Erro ao atualizar perfil.'); }
    });

    configAparenciaPanel.addEventListener('click', async (e) => {
        if (e.target.classList.contains('theme-btn')) {
            const tema = e.target.dataset.theme;
            aplicarTema(tema);
            try {
                await fetch(`${API_URL}/usuario/aparencia`, {
                    method: 'PUT', 
                    headers: authHeaders,
                    body: JSON.stringify({ tema })
                });
            } catch (err) { console.error('Erro ao salvar tema:', err); }
        }
    });

    function aplicarTema(tema) {
        document.body.className = tema || 'light';
    }

    // Inicia
    carregarMaterias();
    carregarConfiguracoes();
    updateTimerDisplay();
});