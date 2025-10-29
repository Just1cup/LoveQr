function carregarHistoria() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    document.body.innerHTML = "<h1>História não encontrada 💔</h1>";
    return;
  }

  const dados = JSON.parse(localStorage.getItem(`historia-${id}`));
  if (!dados) {
    document.body.innerHTML = "<h1>História não encontrada 💔</h1>";
    return;
  }

  const conteudo = `
    <div class="preview-card">
      <div class="foto-container">
        <img src="${dados.imagemBase64}" class="foto-casal">
        <img src="molduras/${dados.moldura}" class="moldura">
      </div>
      <h2>${dados.nome1} 💞 ${dados.nome2}</h2>
      <p>${dados.mensagem}</p>
    </div>
  `;

  document.getElementById("conteudo").innerHTML = conteudo;
}

carregarHistoria();
