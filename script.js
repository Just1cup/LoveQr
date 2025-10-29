document.getElementById("preview").addEventListener("click", () => {
  const nome1 = document.getElementById("nome1").value.trim();
  const nome2 = document.getElementById("nome2").value.trim();
  const mensagem = document.getElementById("mensagem").value.trim();
  const foto = document.getElementById("fotoCasal").files[0];
  const previewContainer = document.getElementById("previewContainer");

  previewContainer.innerHTML = ""; 

  if (!nome1 || !nome2 || !mensagem) {
    alert("Por favor, preencha todos os campos antes de ver a prévia 💞");
    return;
  }


  const card = document.createElement("div");
  card.className = "preview-card";

  const title = document.createElement("h2");
  title.textContent = `${nome1} 💖 ${nome2}`;

  const message = document.createElement("p");
  message.textContent = mensagem;

  card.appendChild(title);
  card.appendChild(message);

  if (foto) {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(foto);
    img.alt = "Foto do casal";
    img.className = "preview-img";
    card.appendChild(img);
  }

  previewContainer.appendChild(card);
});
