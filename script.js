/**
 * SPA COMPLETA - ONG ESPERANÇA VIVA
 */

// ==========================================
// 1. CAMADA DE DADOS & PERSISTÊNCIA (localStorage)
// ==========================================
const STORAGE_KEY = 'ong_esperanca_viva_voluntarios';

const storageService = {
  obterVoluntarios() {
    const dados = localStorage.getItem(STORAGE_KEY);
    try {
      return dados ? JSON.parse(dados) : [];
    } catch (e) {
      console.error('Erro ao ler localStorage:', e);
      return [];
    }
  },

  salvarVoluntario(novoVoluntario) {
    const lista = this.obterVoluntarios();
    const registro = {
      id: Date.now(),
      ...novoVoluntario,
      dataCadastro: new Date().toLocaleDateString('pt-BR')
    };
    lista.push(registro);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    return registro;
  }
};

// ==========================================
// 2. MÓDULO DE VALIDAÇÕES (RegEx)
// ==========================================
const validadores = {
  nome: (v) => v.trim().length >= 3 || 'Nome deve ter no mínimo 3 caracteres.',
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Insira um e-mail válido.',
  cpf: (v) => /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(v) || 'Informe um CPF no formato 000.000.000-00.',
  telefone: (v) => /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(v) || 'Informe um telefone válido.'
};

function validarCampo(input) {
  const campo = input.name;
  const valor = input.value;
  const regra = validadores[campo];
  
  if (!regra) return true;

  const resultado = regra(valor);
  const parent = input.parentElement;
  let errorSpan = parent.querySelector('.msg-erro');

  if (!errorSpan) {
    errorSpan = document.createElement('span');
    errorSpan.className = 'msg-erro';
    parent.appendChild(errorSpan);
  }

  if (resultado !== true) {
    input.classList.add('input-erro');
    input.classList.remove('input-sucesso');
    errorSpan.textContent = resultado;
    return false;
  } else {
    input.classList.remove('input-erro');
    input.classList.add('input-sucesso');
    errorSpan.textContent = '';
    return true;
  }
}

// ==========================================
// 3. VISÕES DA APLICAÇÃO (Views com Imagens Dinâmicas)
// ==========================================

// View: Início (Com Banner Hero)
function homeView() {
  return `
    <section class="hero-section">
      <div class="hero-image-container">
        <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80" alt="Voluntários trabalhando" class="hero-img" />
      </div>
      <div class="hero-content">
        <h2>Transformando Vidas Através da Solidariedade</h2>
        <p>A ONG Esperança Viva atua no desenvolvimento comunitário, apoio alimentar e inclusão social. Seja um agente de mudança na nossa comunidade.</p>
        <button class="btn" onclick="location.hash='#cadastro'">Seja um Voluntário</button>
      </div>
    </section>
  `;
}

// View: Projetos (Com Cards e Imagens de Capa)
function projetosView() {
  const projetos = [
    { 
      id: 1, 
      titulo: 'Ação Alimentar Esperança', 
      status: 'Inscrições Abertas', 
      desc: 'Distribuição mensal de cestas básicas e refeições para famílias em situação de vulnerabilidade.',
      imagem: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=500&q=80' 
    },
    { 
      id: 2, 
      titulo: 'Inclusão Digital para Jovens', 
      status: 'Em Andamento', 
      desc: 'Oficinas de informática básica e programação para estudantes da rede pública de ensino.',
      imagem: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=500&q=80' 
    },
    { 
      id: 3, 
      titulo: 'Oficinas Culturais e Esporte', 
      status: 'Inscrições Abertas', 
      desc: 'Atividades recreativas, música e modalidades esportivas para crianças no contra-turno escolar.',
      imagem: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=500&q=80' 
    }
  ];

  const cardsHTML = projetos.map(p => `
    <article class="project-card">
      <div class="project-img-wrapper">
        <img src="${p.imagem}" alt="${p.titulo}" class="project-img" />
        <span class="badge">${p.status}</span>
      </div>
      <div class="project-info">
        <h3>${p.titulo}</h3>
        <p>${p.desc}</p>
        <button class="btn btn-secondary" onclick="location.hash='#cadastro'">Participar</button>
      </div>
    </article>
  `).join('');

  return `
    <section>
      <h2>Nossos Projetos Sociais</h2>
      <p class="section-desc">Conheça as frentes de atuação da ONG Esperança Viva e saiba como colaborar.</p>
      <div class="projects-grid">
        ${cardsHTML}
      </div>
    </section>
  `;
}

// View: Cadastro de Voluntário
function cadastroView() {
  const voluntarios = storageService.obterVoluntarios();
  
  const tabelaHTML = voluntarios.length ? `
    <table class="data-table">
      <thead>
        <tr>
          <th>Nome</th>
          <th>E-mail</th>
          <th>CPF</th>
          <th>Data</th>
        </tr>
      </thead>
      <tbody>
        ${voluntarios.map(v => `
          <tr>
            <td>${v.nome}</td>
            <td>${v.email}</td>
            <td>${v.cpf}</td>
            <td>${v.dataCadastro}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  ` : '<p class="empty-msg">Nenhum voluntário cadastrado até o momento.</p>';

  return `
    <section class="form-section">
      <div class="form-header">
        <h2>Faça Parte da Nossa Equipe</h2>
        <p class="section-desc">Preencha os seus dados abaixo para se registrar como voluntário da ONG Esperança Viva.</p>
      </div>

      <form id="form-voluntario" class="custom-form">
        <div class="form-group">
          <label for="nome">Nome Completo:</label>
          <input type="text" id="nome" name="nome" placeholder="Ex: João da Silva">
        </div>

        <div class="form-group">
          <label for="email">E-mail de Contato:</label>
          <input type="email" id="email" name="email" placeholder="nome@exemplo.com">
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="cpf">CPF:</label>
            <input type="text" id="cpf" name="cpf" placeholder="000.000.000-00">
          </div>

          <div class="form-group">
            <label for="telefone">Telefone / WhatsApp:</label>
            <input type="text" id="telefone" name="telefone" placeholder="(77) 99999-9999">
          </div>
        </div>

        <button type="submit" class="btn btn-block">
          Confirmar Cadastro
        </button>
      </form>

      <hr class="divider">
      
      <div class="registered-section">
        <h3>Voluntários Cadastrados (localStorage)</h3>
        ${tabelaHTML}
      </div>
    </section>
  `;
}

// ==========================================
// 4. ROTEADOR SPA (Hash Router)
// ==========================================
const rotas = {
  '#inicio': homeView,
  '#projetos': projetosView,
  '#cadastro': cadastroView
};

function navegar() {
  const hash = window.location.hash || '#inicio';
  const renderView = rotas[hash] || homeView;
  
  const appContainer = document.getElementById('app');
  appContainer.innerHTML = renderView();

  if (hash === '#cadastro') {
    inicializarFormulario();
  }
}

// ==========================================
// 5. EVENTOS E DELEGAÇÃO
// ==========================================
function inicializarFormulario() {
  const form = document.getElementById('form-voluntario');
  if (!form) return;

  // Validação em tempo real (evento input)
  form.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => validarCampo(input));
  });

  // Evento de submissão
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const inputs = form.querySelectorAll('input');
    let formularioValido = true;

    inputs.forEach(input => {
      if (!validarCampo(input)) {
        formularioValido = false;
      }
    });

    if (!formularioValido) {
      alert('Por favor, preencha corretamente todos os campos do formulário.');
      return;
    }

    const dados = {
      nome: form.nome.value,
      email: form.email.value,
      cpf: form.cpf.value,
      telefone: form.telefone.value
    };

    storageService.salvarVoluntario(dados);
    alert('Cadastro realizado com sucesso!');
    navegar(); // Atualiza a view para exibir a tabela com o novo registro
  });
}

// Escutas Globais de Navegação
window.addEventListener('hashchange', navegar);
window.addEventListener('DOMContentLoaded', navegar);

// Execução Inicial
navegar();
