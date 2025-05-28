const form = document.getElementById("patient-form");
const list = document.getElementById("patient-list");
const searchInput = document.getElementById("search");

// Lista de pacientes
let pacientes = [];
let cpfEmEdicao = null; // Armazena o CPF do paciente que está sendo editado

function calcularIdade(dataNascimento) {
  const nascimento = new Date(dataNascimento);
  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();
  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) idade--;
  return idade;
}

function validarCPF(cpf) {
  return /^\d{11}$/.test(cpf);
}

// Renderiza os cartões dos pacientes
function renderizarPacientes(filtro = "") {
  list.innerHTML = "";
  const filtrados = pacientes.filter(p => p.nome.toLowerCase().includes(filtro.toLowerCase()));

  filtrados.forEach(p => {
    const div = document.createElement("div");
    div.className = "patient-card";
    div.innerHTML = `
      <strong>${p.nome}</strong> - ${calcularIdade(p.nascimento)} anos<br>
      <button onclick="mostrarDetalhes('${p.cpf}')">Ver Detalhes</button>
      <button onclick="prepararEdicao('${p.cpf}')">Editar</button>
      <button onclick="excluirPaciente('${p.cpf}')">Excluir</button>
    `;
    list.appendChild(div);
  });
}

// Mostra dados em alerta
function mostrarDetalhes(cpf) {
  const p = pacientes.find(p => p.cpf === cpf);
  if (p) {
    alert(
      `Nome: ${p.nome}\nNascimento: ${p.nascimento} (${calcularIdade(p.nascimento)} anos)\nCPF: ${p.cpf}\nSexo: ${p.sexo}\nSintomas: ${p.sintomas}\nDiagnóstico: ${p.diagnostico}`
    );
  }
}

// Preenche o formulário com os dados para editar
function prepararEdicao(cpf) {
  const p = pacientes.find(p => p.cpf === cpf);
  if (p) {
    document.getElementById("nome").value = p.nome;
    document.getElementById("nascimento").value = p.nascimento;
    document.getElementById("cpf").value = p.cpf;
    document.getElementById("cpf").disabled = true; // CPF não pode ser editado
    document.querySelector(`input[name='sexo'][value='${p.sexo}']`).checked = true;
    document.getElementById("sintomas").value = p.sintomas;
    document.getElementById("diagnostico").value = p.diagnostico;
    cpfEmEdicao = cpf;
  }
}

// Remove um paciente
function excluirPaciente(cpf) {
  if (confirm("Tem certeza que deseja excluir este paciente?")) {
    pacientes = pacientes.filter(p => p.cpf !== cpf);
    renderizarPacientes();
  }
}

// Submissão do formulário
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const nascimento = document.getElementById("nascimento").value;
  const cpf = document.getElementById("cpf").value.trim();
  const sexo = document.querySelector("input[name='sexo']:checked")?.value;
  const sintomas = document.getElementById("sintomas").value.trim();
  const diagnostico = document.getElementById("diagnostico").value.trim();

  if (!validarCPF(cpf)) {
    alert("CPF deve conter exatamente 11 números.");
    return;
  }

  if (cpfEmEdicao) {
    // Atualiza paciente existente
    const index = pacientes.findIndex(p => p.cpf === cpfEmEdicao);
    pacientes[index] = { ...pacientes[index], nome, nascimento, sexo, sintomas, diagnostico };
    cpfEmEdicao = null;
    document.getElementById("cpf").disabled = false;
  } else {
    // Cadastra novo paciente
    if (pacientes.some(p => p.cpf === cpf)) {
      alert("CPF já cadastrado.");
      return;
    }
    pacientes.push({ nome, nascimento, cpf, sexo, sintomas, diagnostico });
  }

  form.reset();
  renderizarPacientes();
});

// Busca por nome
searchInput.addEventListener("input", () => {
  renderizarPacientes(searchInput.value);
});

// Render inicial
renderizarPacientes();
