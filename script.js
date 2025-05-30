let pacientes = [];
let editandoIndex = null;

function cadastrarPaciente() {
  const nome = document.getElementById("nome").value.trim();
  const cpf = document.getElementById("cpf").value.trim();
  const nascimento = document.getElementById("nascimento").value;
  const sexo = document.querySelector('input[name="sexo"]:checked')?.value;
  const sintomas = document.getElementById("sintomas").value.trim();
  const diagnostico = document.getElementById("diagnostico").value.trim();

  if (!nome || !cpf || !nascimento || !sexo || !sintomas || !diagnostico) {
    alert("Preencha todos os campos.");
    return;
  }

  const paciente = { nome, cpf, nascimento, sexo, sintomas, diagnostico };

  if (editandoIndex !== null) {
    pacientes[editandoIndex] = paciente;
    editandoIndex = null;
  } else {
    pacientes.push(paciente);
  }

  limparFormulario();
  listarPacientes();
}

function listarPacientes(filtro = "") {
  const lista = document.getElementById("lista-pacientes");
  lista.innerHTML = "";

  pacientes.forEach((p, index) => {
    if (p.nome.toLowerCase().includes(filtro.toLowerCase())) {
      const item = document.createElement("div");
      item.className = "paciente-card";
      item.innerHTML = `
        <p><strong>${p.nome}</strong> - ${calcularIdade(p.nascimento)} anos</p>
        <button onclick="verDetalhes(${index})">Ver Detalhes</button>
        <button onclick="editarPaciente(${index})">Editar</button>
        <button onclick="excluirPaciente(${index})">Excluir</button>
      `;
      lista.appendChild(item);
    }
  });
}

function excluirPaciente(index) {
  if (confirm("Deseja realmente excluir este paciente?")) {
    pacientes.splice(index, 1);
    limparFormulario(); // limpa o formulário após excluir
    listarPacientes();
  }
}

function editarPaciente(index) {
  const p = pacientes[index];
  document.getElementById("nome").value = p.nome;
  document.getElementById("cpf").value = p.cpf; // agora permite editar o CPF
  document.getElementById("nascimento").value = p.nascimento;
  document.querySelector(`input[name="sexo"][value="${p.sexo}"]`).checked = true;
  document.getElementById("sintomas").value = p.sintomas;
  document.getElementById("diagnostico").value = p.diagnostico;
  editandoIndex = index;
}

function limparFormulario() {
  document.getElementById("formulario").reset();
  editandoIndex = null;
}

function calcularIdade(dataNascimento) {
  const nascimento = new Date(dataNascimento);
  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
}

function verDetalhes(index) {
  const p = pacientes[index];
  alert(
    `Nome: ${p.nome}\nCPF: ${p.cpf}\nNascimento: ${p.nascimento}\nSexo: ${p.sexo}\nSintomas: ${p.sintomas}\nDiagnóstico: ${p.diagnostico}`
  );
}

document.getElementById("formulario").addEventListener("submit", function (e) {
  e.preventDefault();
  cadastrarPaciente();
});

document.getElementById("busca").addEventListener("input", function () {
  listarPacientes(this.value);
});
