const form = document.getElementById('form-agenda');
const agendaContainer = document.getElementById('agenda');

let dadosAgenda = JSON.parse(localStorage.getItem('agenda')) || {};

// Renderiza a agenda
function renderAgenda() {
  agendaContainer.innerHTML = '';
  const diasDaSemana = [
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
    "Domingo"
  ];

  diasDaSemana.forEach(dia => {
    const diaDiv = document.createElement('div');
    diaDiv.classList.add('dia');

    const titulo = document.createElement('h2');
    titulo.textContent = dia;
    diaDiv.appendChild(titulo);

    const eventos = dadosAgenda[dia] || [];

    eventos.forEach((evento, index) => {
      const eventoDiv = document.createElement('div');
      eventoDiv.classList.add('evento');

      eventoDiv.innerHTML = `
        <p><strong>${evento.horario} - ${evento.tipo}:</strong> ${evento.mensagem}</p>
        <button class="edit">Editar</button>
        <button class="delete">Excluir</button>
      `;

      // Editar evento
      eventoDiv.querySelector('.edit').addEventListener('click', () => {
        const novaMensagem = prompt("Editar mensagem:", evento.mensagem);
        if (novaMensagem !== null) {
          dadosAgenda[dia][index].mensagem = novaMensagem;
          salvarEAtualizar();
        }
      });

      // Excluir evento
      eventoDiv.querySelector('.delete').addEventListener('click', () => {
        dadosAgenda[dia].splice(index, 1);
        salvarEAtualizar();
      });

      diaDiv.appendChild(eventoDiv);
    });

    agendaContainer.appendChild(diaDiv);
  });
}

// Salva e atualiza
function salvarEAtualizar() {
  localStorage.setItem('agenda', JSON.stringify(dadosAgenda));
  renderAgenda();
}

// Adiciona novo evento
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const dia = document.getElementById('dia').value;
  const horario = document.getElementById('horario').value;
  const tipo = document.getElementById('tipo').value;
  const mensagem = document.getElementById('mensagem').value;

  if (!dadosAgenda[dia]) {
    dadosAgenda[dia] = [];
  }

  dadosAgenda[dia].push({ horario, tipo, mensagem });
  form.reset();
  salvarEAtualizar();
});

// Inicia
renderAgenda();
