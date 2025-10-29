document.getElementById("gerar").addEventListener("click", () => {
  const nome1 = document.getElementById("nome1").value.trim();
  const nome2 = document.getElementById("nome2").value.trim();
  const mensagem = document.getElementById("mensagem").value.trim();
  const fotoInput = document.getElementById("fotoCasal");

  if (!nome1 || !nome2 || !mensagem) {
    alert("Preencha tudo, meu cupido 💘");
    return;
  }

  const dados = { nome1, nome2, mensagem };

  if (fotoInput.files && fotoInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      dados.foto = e.target.result;
      salvarEGerar(dados);
    };
    reader.readAsDataURL(fotoInput.files[0]);
  } else {
    salvarEGerar(dados);
  }
});

function salvarEGerar(dados) {
  const id = Date.now();
  localStorage.setItem(`historia-${id}`, JSON.stringify(dados));

  const baseUrl = window.location.origin + window.location.pathname.replace("index.html", "");
  const url = `${baseUrl}historia.html?id=${id}`;

  const qrContainer = document.getElementById("qrcode");
  qrContainer.innerHTML = "";
  new QRCode(qrContainer, {
    text: url,
    width: 180,
    height: 180
  });

  alert("QR Code criado! Escaneie para ver sua história 💞");
}
