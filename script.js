console.log("script.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM ready");

  const nome1 = document.getElementById("nome1");
  const nome2 = document.getElementById("nome2");
  const msg = document.getElementById("mensagem");
  const foto = document.getElementById("fotoCasal");
  const previewBtn = document.getElementById("preview");
  const previewContainer = document.getElementById("previewContainer");
  const gerarBtn = document.getElementById("gerar");
  const qrcodeDiv = document.getElementById("qrcode");

  let uploadedImageURL = null;

  // Upload image to Imgur
  async function uploadToImgur(file) {
    const clientId = "YOUR_IMGUR_CLIENT_ID"; // 👈 replace this
    const formData = new FormData();
    formData.append("image", file);

    console.log("📤 Uploading image to Imgur...");

    const response = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: { Authorization: `Client-ID ${clientId}` },
      body: formData,
    });

    const data = await response.json();
    if (data.success) {
      console.log("✅ Image uploaded:", data.data.link);
      return data.data.link;
    } else {
      console.error("❌ Imgur upload failed:", data);
      alert("Falha ao enviar imagem 😢");
      return null;
    }
  }

  // When user selects image
  foto.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Upload to Imgur
    uploadedImageURL = await uploadToImgur(file);

    // Show temporary preview
    const reader = new FileReader();
    reader.onload = (ev) => {
      previewContainer.innerHTML = `<img src="${ev.target.result}" style="max-width:200px; border-radius:12px;">`;
    };
    reader.readAsDataURL(file);
  });

  // Show preview
  previewBtn.addEventListener("click", () => {
    console.log("💞 Preview button clicked");

    if (!nome1.value || !nome2.value || !msg.value) {
      alert("Preencha todos os campos!");
      return;
    }

    previewContainer.innerHTML = `
      <div style="text-align:center; padding:10px;">
        <h3>${nome1.value} 💖 ${nome2.value}</h3>
        <p>${msg.value}</p>
        ${
          uploadedImageURL
            ? `<img src="${uploadedImageURL}" style="max-width:200px; border-radius:12px; margin-top:10px;">`
            : "<p style='color:#888;'>Nenhuma imagem enviada ainda</p>"
        }
      </div>
    `;
    console.log("✅ Preview displayed");
  });

  // Generate QR code
  gerarBtn.addEventListener("click", () => {
    console.log("✨ Generate button clicked");

    if (!nome1.value || !nome2.value || !msg.value) {
      alert("Preencha todos os campos!");
      return;
    }

    const id = Date.now();
    const dados = {
      nome1: nome1.value,
      nome2: nome2.value,
      mensagem: msg.value,
      foto: uploadedImageURL,
    };

    localStorage.setItem(`historia-${id}`, JSON.stringify(dados));

    const base = window.location.origin + window.location.pathname.replace("index.html", "");
    const url = `${base}historia.html?id=${id}`;
    console.log("🔗 Final URL:", url);

    qrcodeDiv.innerHTML = "";
    qrcodeDiv.style.display = "flex";
    qrcodeDiv.style.justifyContent = "center";
    qrcodeDiv.style.alignItems = "center";
    qrcodeDiv.style.flexDirection = "column";

    if (typeof QRCode === "undefined") {
      console.error("⚠️ QRCode.js not loaded!");
      qrcodeDiv.textContent = "Erro: QRCode.js não encontrada";
      return;
    }

    new QRCode(qrcodeDiv, {
      text: url,
      width: 200,
      height: 200,
      colorDark: "#e91e63",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });

    const link = document.createElement("a");
    link.href = url;
    link.textContent = "Ver história 💕";
    link.target = "_blank";
    link.style.marginTop = "10px";
    qrcodeDiv.appendChild(link);

    console.log("✅ QR code generated successfully");
  });
});
