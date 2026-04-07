# 🌌 Explorador Espacial – API da NASA

Projeto desenvolvido para a disciplina **Programação para a Internet** do curso de **Gestão da Tecnologia da Informação** – **FATEC Itu**.

---

## 📌 Sobre o projeto

O **Explorador Espacial** é uma aplicação web desenvolvida em JavaScript que consome uma **API externa (API oficial da NASA – APOD)** para exibir imagens astronômicas do dia.

O usuário pode buscar imagens do espaço por data, visualizar informações detalhadas e salvar automaticamente suas consultas no navegador utilizando **LocalStorage**. As consultas salvas são exibidas em uma tabela dinâmica, permitindo também a remoção individual dos registros.

---

## 🚀 Tecnologias utilizadas

- **HTML5** – Estrutura da aplicação  
- **CSS3** – Estilização e layout responsivo  
- **JavaScript (ES6)** – Lógica da aplicação  
- **API da NASA (APOD)** – Fonte dos dados astronômicos  
- **LocalStorage** – Persistência de dados no navegador  

---

## 🔎 Funcionalidades

- Buscar imagem do espaço por data  
- Exibir título, data, explicação e imagem do dia  
- Validação de datas (data mínima e não permitir datas futuras)  
- Salvar automaticamente as consultas realizadas  
- Exibir histórico de consultas em tabela  
- Excluir consultas salvas individualmente  

---

## ▶️ Como executar o projeto

1. Baixe ou clone este repositório  
2. Abra a pasta do projeto  
3. Abra o arquivo **index.html** em um navegador web moderno  

---

## 🔑 Chave da API da NASA

Para que o projeto funcione corretamente, é necessário gerar uma chave gratuita da API da NASA:

👉 https://api.nasa.gov/

Após gerar a chave:

1. Abra o arquivo **script.js**
2. Localize a linha abaixo:
   ```js
   const API_KEY = "qx9vYPhAh3Sy2UwzBCrcarUeQGhri7dJrjl6wuLf";