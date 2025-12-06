document.addEventListener('DOMContentLoaded', () => {
    // URL da nossa API back-end
    const API_URL = 'http://localhost:5000';

    // --- Seletores de Elementos ---
    const materiasScreen = document.getElementById('materias-screen');
    const createMateriaScreen = document.getElementById('create-materia-screen');
    const configScreen = document.getElementById('config-screen');
    const allAppScreens = [materiasScreen, createMateriaScreen, configScreen];

    const navMaterias = document.getElementById('nav-materias');
    const navConfig = document.getElementById('nav-config');
    const allNavLinks = [navMaterias, navConfig];

    const showCreateMateriaBtn = document.getElementById('show-create-materia-btn');
    const cancelCreateMateriaBtn = document.getElementById('cancel-create-materia-btn');
    
    // Container onde os cards serão inseridos
    const subjectsGridContainer = document.getElementById('subjects-grid-container');

    // --- Funções da Aplicação ---

    // Função para buscar as matérias na API e exibi-las
    async function carregarMaterias() {
        try {
            const response = await fetch(`${API_URL}/materias`);
            if (!response.ok) {
                throw new Error('Erro ao buscar matérias');
            }
            const materias = await response.json();

            // Limpa o container antes de adicionar os novos cards
            subjectsGridContainer.innerHTML = '';

            if (materias.length === 0) {
                subjectsGridContainer.innerHTML = '<p>Você ainda não tem nenhuma matéria. Que tal criar uma?</p>';
                return;
            }

            // Cria um card para cada matéria recebida
            materias.forEach(materia => {
                const card = document.createElement('div');
                card.className = `subject-card color-${materia.cor || 'blue'}`; // Usa a cor do DB ou azul como padrão
                
                card.innerHTML = `
                    <div class="card-header">
                        <i data-feather="book"></i>
                        <i data-feather="more-horizontal"></i>
                    </div>
                    <div class="card-body">${materia.nome}</div>
                    <div class="card-footer">
                        <div class="progress-bar">
                            <div class="progress" style="width: ${materia.progresso || 0}%;"></div>
                        </div>
                        <span>${materia.progresso || 0}%</span>
                    </div>
                `;
                subjectsGridContainer.appendChild(card);
            });

            // ATIVA OS ÍCONES DEPOIS DE CRIAR OS CARDS
            feather.replace();

        } catch (error) {
            console.error('Falha ao carregar matérias:', error);
            subjectsGridContainer.innerHTML = '<p>Não foi possível carregar suas matérias. Tente novamente mais tarde.</p>';
        }
    }

    // Função para mostrar uma tela do app e esconder as outras
    function showAppScreen(screenToShow) {
        allAppScreens.forEach(screen => screen.classList.add('hidden'));
        screenToShow.classList.remove('hidden');
    }
    
    // Função para marcar o link ativo na navegação
    function setActiveNav(linkToActivate) {
        allNavLinks.forEach(link => link.classList.remove('active'));
        linkToActivate.classList.add('active');
    }

    // --- Event Listeners ---
    navMaterias.addEventListener('click', (e) => {
        e.preventDefault();
        showAppScreen(materiasScreen);
        setActiveNav(navMaterias);
        carregarMaterias(); // Recarrega as matérias ao voltar para a tela
    });

    navConfig.addEventListener('click', (e) => {
        e.preventDefault();
        showAppScreen(configScreen);
        setActiveNav(navConfig);
    });

    showCreateMateriaBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showAppScreen(createMateriaScreen);
    });

    cancelCreateMateriaBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showAppScreen(materiasScreen);
    });
    
    // --- Inicialização ---
    // Carrega as matérias assim que a página é aberta
    carregarMaterias();
});
