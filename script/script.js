/**
 * Chave da API da NASA (APOD)
 * @constant {string}
 */
const API_KEY = "qx9vYPhAh3Sy2UwzBCrcarUeQGhri7dJrjl6wuLf";

/**
 * URL base da API APOD da NASA
 * @constant {string}
 */
const API_URL = "https://api.nasa.gov/planetary/apod";

/**
 * Textos para internacionalização (PT / EN)
 * @type {Object}
 */
const textos = {
  pt: {
    titulo: "🌌 Explorador Espacial",
    descricao: "Busque imagens do espaço usando a API oficial da NASA",
    buscar: "Buscar imagem por data",
    label: "Selecione uma data:",
    botao: "Buscar",
    tabela: "Consultas salvas",
    carregando: "Carregando...",
    erro: "Data inválida ou erro ao buscar dados.",
    video: "Este conteúdo é um vídeo",
    confirmarExcluir: "Deseja excluir esta consulta?",
    confirmarLimpar: "Deseja apagar todo o histórico?"
  },
  en: {
    titulo: "🌌 Space Explorer",
    descricao: "Search space images using NASA's official API",
    buscar: "Search image by date",
    label: "Select a date:",
    botao: "Search",
    tabela: "Saved searches",
    carregando: "Loading...",
    erro: "Invalid date or error fetching data.",
    video: "This content is a video",
    confirmarExcluir: "Delete this search?",
    confirmarLimpar: "Clear all history?"
  }
};

/**
 * Elementos do DOM
 */
const form = document.getElementById("formBusca");
const dia = document.getElementById("dia");
const mes = document.getElementById("mes");
const ano = document.getElementById("ano");
const resultado = document.getElementById("resultado");
const tabela = document.getElementById("tabela");

/**
 * Altera o idioma da interface
 * @param {string} id - Código do idioma (pt ou en)
 * @returns {void}
 */
function mudarIdioma(id) {
  document.getElementById("titulo").innerText = textos[id].titulo;
  document.getElementById("descricao").innerText = textos[id].descricao;
  document.getElementById("tituloBusca").innerText = textos[id].buscar;
  document.getElementById("labelData").innerText = textos[id].label;
  document.getElementById("btnBuscar").innerText = textos[id].botao;
  document.getElementById("tituloTabela").innerText = textos[id].tabela;
  localStorage.setItem("idioma", id);
}

/**
 * Evento de envio do formulário
 */
form.addEventListener("submit", e => {
  e.preventDefault();
  const data = montarData();
  if (data) buscarImagem(data);
});

/**
 * Monta a data no formato YYYY-MM-DD a partir dos campos DD/MM/AAAA
 * @returns {string|null} Data formatada ou null se inválida
 */
function montarData() {
  if (dia.value.length !== 2 || mes.value.length !== 2 || ano.value.length !== 4) {
    resultado.innerHTML = "<p style='color:#f87171;'>Data inválida.</p>";
    return null;
  }
  return `${ano.value}-${mes.value}-${dia.value}`;
}

/**
 * Busca a imagem na API da NASA
 * @param {string} data - Data no formato YYYY-MM-DD
 * @returns {Promise<void>}
 */
async function buscarImagem(data) {
  const idioma = localStorage.getItem("idioma") || "pt";
  resultado.innerHTML = `<p>${textos[idioma].carregando}</p>`;

  try {
    const res = await fetch(`${API_URL}?api_key=${API_KEY}&date=${data}`);
    const dados = await res.json();

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

    salvarConsulta(dados);
    carregarTabela();
  } catch (erro) {
    resultado.innerHTML = `<p style="color:#f87171;">${textos[idioma].erro}</p>`;
  }
}

/**
 * Salva a consulta no localStorage
 * @param {Object} dados - Dados retornados pela API
 * @returns {void}
 */
function salvarConsulta(dados) {
  const lista = JSON.parse(localStorage.getItem("nasa")) || [];
  if (lista.some(item => item.data === dados.date)) return;

  lista.push({
    titulo: dados.title,
    data: dados.date,
    tipo: dados.media_type
  });

  localStorage.setItem("nasa", JSON.stringify(lista));
}

/**
 * Carrega a tabela de consultas salvas
 * @returns {void}
 */
function carregarTabela() {
  tabela.innerHTML = "";
  const lista = JSON.parse(localStorage.getItem("nasa")) || [];

  lista.forEach((item, i) => {
    tabela.innerHTML += `
      <tr>
        <td>${item.titulo}</td>
        <td>${item.data}</td>
        <td>${item.tipo}</td>
        <td>
          <button class="excluir" onclick="excluir(${i})">Excluir</button>
        </td>
      </tr>
    `;
  });
}

/**
 * Exclui uma consulta individualmente
 * @param {number} indice - Índice do item no array
 * @returns {void}
 */
function excluir(indice) {
  const idioma = localStorage.getItem("idioma") || "pt";
  if (!confirm(textos[idioma].confirmarExcluir)) return;

  const lista = JSON.parse(localStorage.getItem("nasa")) || [];
  lista.splice(indice, 1);
  localStorage.setItem("nasa", JSON.stringify(lista));
  carregarTabela();
}

/**
 * Limpa todo o histórico salvo no localStorage
 * @returns {void}
 */
function limparHistorico() {
  const idioma = localStorage.getItem("idioma") || "pt";
  if (!confirm(textos[idioma].confirmarLimpar)) return;

  localStorage.removeItem("nasa");
  carregarTabela();
}

/**
 * Inicialização da aplicação
 */
mudarIdioma(localStorage.getItem("idioma") || "pt");
carregarTabela();
``