console.log("🚀 script.js carregado");

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM pronto");

  const nome1 = document.getElementById("nome1");
  const nome2 = document.getElementById("nome2");
  const msg = document.getElementById("mensagem");
  const foto = document.getElementById("fotoCasal");
  const btnPreview = document.getElementById("preview");
  const btnGerar = document.getElementById("gerar");
  const qrcodeDiv = document.getElementById("qrcode");

  const previewImg = document.getElementById("previewImg");
  const previewText = document.getElementById("previewText");
  const previewNomes = document.getElementById("previewNomes");
  const previewMensagem = document.getElementById("previewMensagem");

  // 📸 Exibir preview da foto imediatamente
  foto.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      previewImg.src = ev.target.result;
      previewImg.style.display = "block";
      console.log("📸 Foto carregada no preview");
    };
    reader.readAsDataURL(file);
  });

  // 💞 Ver Prévia — mostra imagem + texto
  btnPreview.addEventListener("click", () => {
    if (!nome1.value || !nome2.value || !msg.value) {
      alert("Preencha todos os campos para ver a prévia 💕");
      return;
    }

    previewNomes.textContent = `${nome1.value} 💕 ${nome2.value}`;
    previewMensagem.textContent = msg.value;

    previewText.style.display = "block";
    previewImg.style.display = previewImg.src ? "block" : "none";

    console.log("✨ Prévia exibida com sucesso!");
  });

  // 💘 Gerar QR Code
  btnGerar.addEventListener("click", () => {
    console.log("💞 Botão GERAR clicado");

    if (!nome1.value || !nome2.value || !msg.value) {
      alert("Preencha todos os campos!");
      return;
    }

    const id = Date.now();
    const dados = {
      nome1: nome1.value,
      nome2: nome2.value,
      mensagem: msg.value,
      foto: previewImg.src || null
    };
    localStorage.setItem(`historia-${id}`, JSON.stringify(dados));

    const base = window.location.origin + window.location.pathname.replace("index.html", "");
    const url = `${base}historia.html?id=${id}`;
    console.log("🔗 URL final:", url);

    qrcodeDiv.innerHTML = "";
    qrcodeDiv.style.display = "flex";
    qrcodeDiv.style.justifyContent = "center";
    qrcodeDiv.style.alignItems = "center";
    qrcodeDiv.style.background = "#fff";
    qrcodeDiv.style.padding = "10px";
    qrcodeDiv.style.borderRadius = "12px";
    qrcodeDiv.style.minHeight = "220px";

    if (typeof QRCode === "undefined") {
      console.error("⚠️ Biblioteca QRCode.js não carregada!");
      qrcodeDiv.textContent = "Erro: QRCode.js não encontrada";
      return;
    }

    new QRCode(qrcodeDiv, {
      text: url,
      width: 200,
      height: 200,
      colorDark: "#e91e63",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });

    const link = document.createElement("a");
    link.href = url;
    link.textContent = "Ver história 💕";
    link.target = "_blank";
    link.style.display = "block";
    link.style.textAlign = "center";
    link.style.marginTop = "10px";
    qrcodeDiv.appendChild(link);

    console.log("✅ QR code gerado com sucesso");
  });
});
