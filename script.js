/* script.js - versão de debug com logs robustos.
   Cole exatamente este arquivo e faça deploy no GitHub Pages.
*/

console.log("script.js carregado ✅");

// checar se QRCode está definido
if (typeof QRCode === "undefined") {
  console.error("Biblioteca QRCode NÃO está definida. Verifique se qrcode.min.js foi carregado antes de script.js.");
} else {
  console.log("QRCode está disponível ✅");
}

// referencia elementos - se algum for null, logamos
const btnPreview = document.getElementById("preview");
const btnGerar = document.getElementById("gerar");
const nome1Input = document.getElementById("nome1");
const nome2Input = document.getElementById("nome2");
const mensagemInput = document.getElementById("mensagem");
const fotoInput = document.getElementById("fotoCasal");
const previewContainer = document.getElementById("previewContainer");
const qrContainer = document.getElementById("qrcode");

console.log("Elementos encontrados:",
  {btnPreview, btnGerar, nome1Input, nome2Input, mensagemInput, fotoInput, previewContainer, qrContainer}
);

if (!btnPreview || !btnGerar) {
  console.error("Um dos botões (preview/gerar) não foi encontrado no DOM. Verifique IDs no HTML.");
}

// função utilitária para criar URL base pública (funciona com GitHub Pages)
function getBaseUrl() {
  // exemplo: https://seu-usuario.github.io/repositorio/
  const href = window.location.href;
  const pathname = window.location.pathname;
  // Se o pathname terminar com '/', base é origin + pathname
  if (pathname.endsWith("/")) return window.location.origin + pathname;
  // senão, remove o arquivo final (index.html) e retorna
  return window.location.origin + pathname.replace(/[^/]*$/, "");
}

// Evento de preview
btnPreview && btnPreview.addEventListener("click", () => {
  console.log("Botão Preview clicado");
  previewContainer.innerHTML = ""; // limpa

  const nome1 = nome1Input.value.trim();
  const nome2 = nome2Input.value.trim();
  const mensagem = mensagemInput.value.trim();

  if (!nome1 || !nome2 || !mensagem) {
    alert("Preencha Nome 1, Nome 2 e Mensagem antes da prévia 💞");
    console.warn("Campos faltando para preview");
    return;
  }

  const card = document.createElement("div");
  card.className = "preview-card";
  card.style = "padding:12px;border-radius:10px;background:#fff;box-shadow:0 6px 18px rgba(0,0,0,0.06);text-align:center;";

  const h = document.createElement("h3");
  h.textContent = `${nome1} 💖 ${nome2}`;
  const p = document.createElement("p");
  p.textContent = mensagem;

  card.appendChild(h);
  card.appendChild(p);

  if (fotoInput && fotoInput.files && fotoInput.files[0]) {
    const file = fotoInput.files[0];
    const img = document.createElement("img");
    img.style = "width:100%;border-radius:8px;margin-top:8px;object-fit:cover;max-height:260px;";
    img.alt = "Foto do casal";

    // mostra URL.createObjectURL imediatamente e libera depois
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      console.log("Imagem do preview carregada (objectURL)");
    };
    card.appendChild(img);
  } else {
    const span = document.createElement("small");
    span.textContent = "Nenhuma foto enviada (opcional)";
    span.style = "display:block;margin-top:8px;color:#b23b3b";
    card.appendChild(span);
  }

  previewContainer.appendChild(card);
});

// Evento de gerar QR
btnGerar && btnGerar.addEventListener("click", () => {
  console.log("Botão Gerar clicado");

  const nome1 = nome1Input.value.trim();
  const nome2 = nome2Input.value.trim();
  const mensagem = mensagemInput.value.trim();

  if (!nome1 || !nome2 || !mensagem) {
    alert("Preencha Nome 1, Nome 2 e Mensagem antes de gerar o QR 💘");
    console.warn("Campos faltando para gerar QR");
    return;
  }

  // montamos objeto de dados
  const dados = { nome1, nome2, mensagem };

  // se houver foto, a convertemos para base64 (async via FileReader)
  if (fotoInput && fotoInput.files && fotoInput.files[0]) {
    const file = fotoInput.files[0];
    console.log("Arquivo encontrado para salvar:", file.name, file.size, "bytes");

    const reader = new FileReader();
    reader.onload = function(e) {
      dados.foto = e.target.result; // base64
      console.log("Imagem convertida para base64 (tamanho chars):", dados.foto.length);
      salvarEGerar(dados);
    };
    reader.onerror = function(err) {
      console.error("Erro ao converter imagem:", err);
      alert("Erro ao processar a imagem. Veja console.");
    };
    reader.readAsDataURL(file);
  } else {
    console.log("Sem imagem. Prosseguindo sem foto.");
    salvarEGerar(dados);
  }
});

function salvarEGerar(dados) {
  try {
    const id = Date.now().toString();
    const key = `historia-${id}`;
    localStorage.setItem(key, JSON.stringify(dados));
    console.log("Dados salvos em localStorage com chave:", key);

    // cria URL para historia.html
    const base = getBaseUrl();
    const url = `${base}historia.html?id=${id}`;
    console.log("URL gerada para QR:", url);

    // limpa e cria QR
    if (!qrContainer) {
      console.error("#qrcode não encontrado no DOM");
      alert("Elemento #qrcode não encontrado. Verifique HTML.");
      return;
    }
    qrContainer.innerHTML = "";

    if (typeof QRCode === "undefined") {
      console.error("QRCode indefinido ao tentar criar o QR.");
      alert("Biblioteca QRCode não carregada. Verifique inclusion scripts.");
      return;
    }

    // instancia QR
    new QRCode(qrContainer, {
      text: url,
      width: 200,
      height: 200,
      correctLevel: QRCode.CorrectLevel.H
    });

    // adiciona link abaixo do QR para teste
    const a = document.createElement("a");
    a.href = url;
    a.textContent = "Abrir link (teste)";
    a.target = "_blank";
    a.style = "display:block;margin-top:8px;color:#b23b3b;";
    qrContainer.appendChild(a);

    alert("QR Code gerado! Teste escaneando ou clicando no link abaixo do QR.");
  } catch (e) {
    console.error("Erro ao salvar/gerar QR:", e);
    alert("Erro inesperado. Veja console para detalhes.");
  }
}
