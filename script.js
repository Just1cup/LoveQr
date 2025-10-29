console.log("🚀 script.js carregado");

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM pronto");

  const btn = document.getElementById("gerar");
  const nome1 = document.getElementById("nome1");
  const nome2 = document.getElementById("nome2");
  const msg = document.getElementById("mensagem");
  const foto = document.getElementById("fotoCasal");
  const preview = document.getElementById("preview");
  const qrcodeDiv = document.getElementById("qrcode");

  if (!btn) return console.error("❌ Botão não encontrado.");

  foto.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      preview.src = ev.target.result;
      preview.style.display = "block";
      console.log("📸 Preview carregado");
    };
    reader.readAsDataURL(file);
  });

  btn.addEventListener("click", () => {
    console.log("💞 Botão clicado");

    if (!nome1.value || !nome2.value || !msg.value) {
      alert("Preencha todos os campos!");
      return;
    }

    const id = Date.now();
    const dados = {
      nome1: nome1.value,
      nome2: nome2.value,
      mensagem: msg.value,
      foto: preview.src || null
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
