const loginForm = document.getElementById("form-login");
const agendaForm = document.getElementById("form-agenda");
const agendaContainer = document.getElementById("agenda");
const agendaSection = document.getElementById("agenda-container");
const loginSection = document.getElementById("login-container");
const logoutBtn = document.getElementById("logout");
const userDisplay = document.getElementById("usuario-logado");

let usuarioAtual = null;
let dadosAgenda = {};

function getAgendaStorageKey(email) {
  return `agenda_${email}`;
}

function carregarAgenda(email) {
  const data = localStorage.getItem(getAgendaStorageKey(email));
  dadosAgenda = data ? JSON.parse(data) : {};
}

function salvarAgenda() {
  if (usuarioAtual) {
    localStorage.setItem(getAgendaStorageKey(usuarioAtual), JSON.stringify(dadosAgenda));
  }
}

function renderAgenda() {
  agendaContainer.innerHTML = "";
  const diasDaSemana = [
    "Segunda-feira", "Terça-feira", "Quarta-feira",
    "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"
  ];

  diasDaSemana.forEach(dia => {
    const diaDiv = document.createElement("div");
    diaDiv.classList.add("dia");

    const titulo = document.createElement("h2");
    titulo.textContent = dia;
    diaDiv.appendChild(titulo);

    const eventos = dadosAgenda[dia] || [];

    eventos.forEach((evento, index) => {
      const eventoDiv = document.createElement("div");
      eventoDiv.classList.add("evento");
      eventoDiv.innerHTML = `
        <p><strong>${evento.horario} - ${evento.tipo}:</strong> ${evento.mensagem}</p>
        <button class="edit">Editar</button>
        <button class="delete">Excluir</button>
      `;

      eventoDiv.querySelector(".edit").addEventListener("click", () => {
        const novaMensagem = prompt("Editar mensagem:", evento.mensagem);
        if (novaMensagem !== null) {
          dadosAgenda[dia][index].mensagem = novaMensagem;
          salvarAgenda();
          renderAgenda();
        }
      });

      eventoDiv.querySelector(".delete").addEventListener("click", () => {
        dadosAgenda[dia].splice(index, 1);
        salvarAgenda();
        renderAgenda();
      });

      diaDiv.appendChild(eventoDiv);
    });

    agendaContainer.appendChild(diaDiv);
  });
}

agendaForm.addEventListener("submit", e => {
  e.preventDefault();
  const dia = document.getElementById("dia").value;
  const horario = document.getElementById("horario").value;
  const tipo = document.getElementById("tipo").value;
  const mensagem = document.getElementById("mensagem").value;

  if (!dadosAgenda[dia]) {
    dadosAgenda[dia] = [];
  }

  dadosAgenda[dia].push({ horario, tipo, mensagem });
  agendaForm.reset();
  salvarAgenda();
  renderAgenda();
});

loginForm.addEventListener("submit", e => {
  e.preventDefault();
  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const senha = document.getElementById("senha").value;

  if (email && senha && nome) {
    usuarioAtual = email;

    // Salvar nome no localStorage (caso seja novo usuário)
    const chaveNome = `usuario_nome_${email}`;
    localStorage.setItem(chaveNome, nome);

    carregarAgenda(usuarioAtual);

    loginSection.style.display = "none";
    agendaSection.style.display = "block";

    userDisplay.textContent = nome;

    renderAgenda();
  }
});

logoutBtn.addEventListener("click",() => {
  usuarioAtual = null;
  
  //mostrar tela de login e esconde agenda
  loginSection.style.display = "block";
  agendaSection.style.display = "none";
  userDisplay.textContent ="";

  // Limpar os campos do formulário de login
  document.getElementById("nome").value = "";
  document.getElementById("email").value = "";
  document.getElementById("senha").value = "";
});

