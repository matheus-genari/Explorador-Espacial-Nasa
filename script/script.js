const form = document.getElementById("form-data");
const resultado = document.getElementById("resultado");
const tabela = document.getElementById("tabela-consultas");

const API_KEY = "DEMO_KEY";

// =========================
// FORMATAR DATA PARA BR
// =========================
function formatarDataBR(dataISO) {
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

// =========================
// CARREGAR HISTÓRICO
// =========================
function carregarHistorico() {
  tabela.innerHTML = "";

  const consultas = JSON.parse(localStorage.getItem("consultas")) || [];

  consultas.forEach((consulta, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${formatarDataBR(consulta.data)}</td>
      <td>${consulta.titulo}</td>
      <td>
        <button onclick="excluirConsulta(${index})">❌</button>
      </td>
    `;

    tabela.appendChild(tr);
  });
}

// =========================
// EXCLUIR CONSULTA
// =========================
function excluirConsulta(index) {
  const consultas = JSON.parse(localStorage.getItem("consultas")) || [];
  consultas.splice(index, 1);
  localStorage.setItem("consultas", JSON.stringify(consultas));

  Swal.fire({
    icon: "success",
    title: "Consulta excluída!",
    text: "O registro foi removido com sucesso.",
    confirmButtonColor: "#0b3d91"
  });

  carregarHistorico();
}

// =========================
// BUSCAR DADOS DA NASA
// =========================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const dia = document.getElementById("dia").value.padStart(2, "0");
  const mes = document.getElementById("mes").value.padStart(2, "0");
  const ano = document.getElementById("ano").value;

  const dataSelecionada = `${ano}-${mes}-${dia}`;

  const hoje = new Date().toISOString().split("T")[0];
  if (dataSelecionada > hoje) {
    Swal.fire({
      icon: "error",
      title: "Data inválida",
      text: "Não é permitido selecionar datas futuras."
    });
    return;
  }

  const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${dataSelecionada}`;

  try {
    const resposta = await fetch(url);
    const dados = await resposta.json();

    resultado.innerHTML = `
      <h2>${dados.title}</h2>
      <p>${dados.explanation}</p>
      ${
        dados.media_type === "image"
          ? `<img src="${dados.url}" alt="${dados.title}">`
          : `<iframe src="${dados.url}" frameborder="0"></iframe>`
      }
    `;

    salvarConsulta(dataSelecionada, dados.title);

  } catch (erro) {
    Swal.fire({
      icon: "error",
      title: "Erro",
      text: "Não foi possível buscar os dados da NASA."
    });
  }
});

// =========================
// SALVAR CONSULTA
// =========================
function salvarConsulta(data, titulo) {
  const consultas = JSON.parse(localStorage.getItem("consultas")) || [];
  consultas.push({ data, titulo });
  localStorage.setItem("consultas", JSON.stringify(consultas));

  carregarHistorico();
}

// =========================
// INICIALIZAÇÃO
// =========================
carregarHistorico();