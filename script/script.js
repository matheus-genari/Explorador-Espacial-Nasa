// =====================
// CONFIGURAÇÃO DA API
// =====================
const API_KEY = "qx9vYPhAh3Sy2UwzBCrcarUeQGhri7dJrjl6wuLf";
const API_URL = "https://api.nasa.gov/planetary/apod";

// =====================
// TRADUÇÕES
// =====================
const textos = {
  pt: {
    titulo: "🌌 Explorador Espacial",
    descricao: "Busque imagens do espaço usando a API oficial da NASA",
    buscar: "Buscar imagem por data",
    label: "Selecione uma data:",
    botao: "Buscar",
    tabela: "Consultas salvas",
    carregando: "Carregando...",
    confirmar: "Tem certeza que deseja excluir esta consulta?",
    video: "Este conteúdo é um vídeo"
  },
  en: {
    titulo: "🌌 Space Explorer",
    descricao: "Search space images using NASA's official API",
    buscar: "Search image by date",
    label: "Select a date:",
    botao: "Search",
    tabela: "Saved searches",
    carregando: "Loading...",
    confirmar: "Are you sure you want to delete this search?",
    video: "This content is a video"
  }
};

// =====================
// ELEMENTOS DOM
// =====================
const form = document.getElementById("formBusca");
const dataInput = document.getElementById("data");
const resultado = document.getElementById("resultado");
const tabela = document.getElementById("tabela");

// =====================
// IDIOMA
// =====================
function mudarIdioma(idioma) {
  document.getElementById("titulo").innerText = textos[idioma].titulo;
  document.getElementById("descricao").innerText = textos[idioma].descricao;
  document.getElementById("tituloBusca").innerText = textos[idioma].buscar;
  document.getElementById("labelData").innerText = textos[idioma].label;
  document.getElementById("btnBuscar").innerText = textos[idioma].botao;
  document.getElementById("tituloTabela").innerText = textos[idioma].tabela;

  localStorage.setItem("idioma", idioma);
}

// =====================
// EVENTO FORM
// =====================
form.addEventListener("submit", (e) => {
  e.preventDefault();
  buscarImagem(dataInput.value);
});

// =====================
// BUSCAR IMAGEM
// =====================
async function buscarImagem(data) {
  const idioma = localStorage.getItem("idioma") || "pt";
  resultado.innerHTML = `<p>${textos[idioma].carregando}</p>`;

  const response = await fetch(`${API_URL}?api_key=${API_KEY}&date=${data}`);
  const dados = await response.json();

  mostrarResultado(dados, idioma);
  salvarConsulta(dados);
  carregarTabela();
}

// =====================
// MOSTRAR RESULTADO
// =====================
function mostrarResultado(dados, idioma) {
  if (dados.media_type === "image") {
    resultado.innerHTML = `
      <h2>${dados.title}</h2>
      <p>${dados.explanation}</p>
      <img src="${dados.url}" alt="${dados.title}">
    `;
  } else {
    resultado.innerHTML = `
      <h2>${dados.title}</h2>
      <p>${textos[idioma].video}</p>
      <a href="${dados.url}" target="_blank">Abrir vídeo</a>
    `;
  }
}

// =====================
// LOCAL STORAGE
// =====================
function salvarConsulta(dados) {
  let lista = JSON.parse(localStorage.getItem("nasa")) || [];
  if (lista.some(item => item.data === dados.date)) return;

  lista.push({
    titulo: dados.title,
    data: dados.date,
    tipo: dados.media_type
  });

  localStorage.setItem("nasa", JSON.stringify(lista));
}

// =====================
// TABELA
// =====================
function carregarTabela() {
  tabela.innerHTML = "";
  const lista = JSON.parse(localStorage.getItem("nasa")) || [];

  lista.forEach((item, index) => {
    tabela.innerHTML += `
      <tr>
        <td>${item.titulo}</td>
        <td>${item.data}</td>
        <td>${item.tipo}</td>
        <td><button class="excluir" onclick="excluirItem(${index})">Excluir</button></td>
      </tr>
    `;
  });
}

// =====================
// EXCLUIR COM CONFIRMAÇÃO
// =====================
function excluirItem(index) {
  const idioma = localStorage.getItem("idioma") || "pt";
  if (!confirm(textos[idioma].confirmar)) return;

  let lista = JSON.parse(localStorage.getItem("nasa")) || [];
  lista.splice(index, 1);
  localStorage.setItem("nasa", JSON.stringify(lista));
  carregarTabela();
}

// =====================
// INICIALIZAÇÃO
// =====================
const idiomaInicial = localStorage.getItem("idioma") || "pt";
mudarIdioma(idiomaInicial);
carregarTabela();