<script>
/*
🌈 Faixa Neon — DrakFeet Black Friday | Versão Premium (v11)
------------------------------------------------------------------
✅ Não sobrepõe header ou slider
✅ Texto neon com sombra
✅ Troca automática de textos
✅ Preenchimento 100% da largura
✅ Performance otimizada
*/

document.addEventListener("DOMContentLoaded", () => {
  console.group("💜 [DrakFeet] Faixa Black Friday — Neon Premium (v11)");

  // ===== Configurações =====
  const duracaoAnimacaoBase = 8000;
  const ciclosParaTrocar = 3;
  const textos = [
    "🔥 Black Friday DrakFeet — Use o cupom BLACKPIX e ganhe até 25% OFF 🔥",
    "🚀 Frete grátis em todos os pedidos acima de R$399!",
    "👟 Garanta já seu Tênis com 25% de desconto!",
  ];
  let indiceTexto = 0;
  let contadorCiclos = 0;

  // ===== Estilos =====
  const styleId = "faixa-blackfriday-v11";
  if (!document.getElementById(styleId)) {
    const styleTag = document.createElement("style");
    styleTag.id = styleId;
    styleTag.textContent = `
      .faixa-blackfriday {
        width: 100%;
        font-family: 'Poppins', sans-serif;
        font-weight: 600;
        overflow: hidden;
        padding: 14px 0;
        background-color: #111017;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .faixa-viewport {
        width: 100%;
        overflow: hidden;
        position: relative;
      }

      .faixa-track {
        display: flex;
        align-items: center;
        will-change: transform;
      }

      .faixa-item {
        white-space: nowrap;
        padding: 0 40px;
        font-size: 1.05rem;
        text-transform: uppercase;
        color: #fff;
        letter-spacing: 1px;
        user-select: none;
        flex: 0 0 auto;
        text-shadow: 
          0 0 4px #6e33d4,
          0 0 10px #6e33d4,
          0 0 20px #6e33d4;
      }

      @keyframes textoRolando {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }

      @media (max-width: 768px) {
        .faixa-item { padding: 0 24px; font-size: 0.95rem; }
      }
    `;
    document.head.appendChild(styleTag);
  }

  // ===== Criação da faixa =====
  const faixa = document.createElement("div");
  faixa.className = "faixa-blackfriday";
  faixa.setAttribute("role", "banner");
  faixa.setAttribute("aria-label", "Promoção Black Friday DrakFeet");

  const viewport = document.createElement("div");
  viewport.className = "faixa-viewport";
  faixa.appendChild(viewport);

  // ===== Inserção antes do header =====
  const header = document.querySelector("header");
  if (header?.parentNode) {
    header.parentNode.insertBefore(faixa, header);
    console.log("📍 Faixa inserida acima do header, sem sobreposição.");
  } else {
    document.body.prepend(faixa);
    console.warn("⚠️ Header não encontrado, faixa adicionada no topo.");
  }

  // ===== Funções utilitárias =====
  function calcularRepeticoes(text) {
    const temp = document.createElement("span");
    temp.style.visibility = "hidden";
    temp.style.whiteSpace = "nowrap";
    temp.style.fontFamily = "Poppins, sans-serif";
    temp.style.fontWeight = "600";
    temp.style.fontSize = "1.05rem";
    temp.textContent = text;
    document.body.appendChild(temp);
    const textWidth = temp.offsetWidth;
    document.body.removeChild(temp);

    const viewportWidth = viewport.offsetWidth;
    let repeticoes = Math.ceil((viewportWidth * 2) / textWidth);
    repeticoes = Math.max(repeticoes, 8);
    return repeticoes;
  }

  function buildTrack(text) {
    const oldTrack = viewport.querySelector(".faixa-track");
    if (oldTrack) oldTrack.remove();

    const track = document.createElement("div");
    track.className = "faixa-track";

    const repeticoes = calcularRepeticoes(text);
    for (let i = 0; i < repeticoes * 2; i++) {
      const item = document.createElement("div");
      item.className = "faixa-item";
      item.textContent = text;
      track.appendChild(item);
    }

    track.style.animation = `textoRolando ${duracaoAnimacaoBase}ms linear infinite`;
    viewport.appendChild(track);
    return track;
  }

  // ===== Inicializa faixa =====
  let currentTrack = buildTrack(textos[indiceTexto]);

  // ===== Troca automática de textos =====
  setInterval(() => {
    contadorCiclos++;
    if (contadorCiclos >= ciclosParaTrocar) {
      contadorCiclos = 0;
      indiceTexto = (indiceTexto + 1) % textos.length;
      currentTrack = buildTrack(textos[indiceTexto]);
    }
  }, duracaoAnimacaoBase);

  console.log("✅ Faixa Neon ativa (v11) — sem sobreposição do header ou slider.");
  console.groupEnd();
});
</script>

<script>
/**
 * 🔍 Rastreio — DrakFeet
 * Redireciona automaticamente (3s) para o site dos Correios
 * Copia o código e exibe aviso antes de sair
 */

document.addEventListener("DOMContentLoaded", function() {
  const root = document.getElementById("rastreio-root");
  if (!root) {
    console.error("[RASTREIO] Elemento #rastreio-root não encontrado.");
    return;
  }

  const container = document.createElement("div");
  container.className = "rastreio-container";

  const title = document.createElement("h2");
  title.textContent = "🔍 Rastreie seu Pedido";
  container.appendChild(title);

  const inputArea = document.createElement("div");
  inputArea.className = "input-area";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Digite o código (ex: AA123456789BR)";
  inputArea.appendChild(input);

  const btn = document.createElement("button");
  btn.textContent = "Rastrear";
  inputArea.appendChild(btn);

  container.appendChild(inputArea);

  const resultado = document.createElement("div");
  resultado.id = "resultado";
  container.appendChild(resultado);

  // ===== CSS =====
  const style = document.createElement("style");
  style.textContent = `
    .rastreio-container {
      background: #fff;
      padding: 40px 30px;
      border-radius: 16px;
      max-width: 600px;
      margin: 50px auto;
      width: 100%;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      text-align: center;
      font-family: "Poppins", sans-serif;
      color: #333;
    }
    .rastreio-container h2 { font-size: 24px; margin-bottom: 20px; color: #1e2a3a; }
    .input-area { display:flex; justify-content:center; gap:10px; flex-wrap:wrap; margin-bottom:16px; }
    .input-area input {
      flex:1; min-width:250px; padding:12px 14px; border:2px solid #ccc; border-radius:10px; font-size:16px; outline:none;
    }
    .input-area input:focus { border-color:#2d72d9; }
    .input-area button {
      background:#2d72d9; color:#fff; border:none; padding:12px 20px; border-radius:10px; cursor:pointer; transition:0.2s;
    }
    .input-area button:hover { background:#1a57b8; }
    .erro { background:#ffe6e6; color:#b20000; padding:12px; border-radius:8px; margin-top:12px; font-size:14px; }
    .resultado-box {
      margin-top:16px; background:#f8faff; border:1px solid #d0e2ff; border-radius:12px; padding:18px; text-align:center;
    }
    .resultado-box code {
      display:inline-block; padding:6px 10px; background:#eef4ff; border-radius:8px; font-family:monospace; color:#2d72d9;
      margin-top:8px;
    }
    .resultado-controls { margin-top:12px; display:flex; gap:10px; justify-content:center; flex-wrap:wrap; }
    .resultado-controls button {
      background:#2d72d9; color:#fff; text-decoration:none; padding:10px 14px; border-radius:8px; border:none; cursor:pointer;
    }
    .resultado-controls button.secondary { background:#6c757d; }
    .countdown { font-weight:700; color:#1e2a3a; margin-top:8px; display:block; }
    @media(max-width:480px){
      .rastreio-container{padding:25px 20px;}
      .input-area input{min-width:100%;}
      .input-area button{width:100%;}
    }
  `;
  document.head.appendChild(style);

  // ===== Lógica =====
  let redirectTimer = null;
  let countdownInterval = null;

  function limparTimers() {
    clearTimeout(redirectTimer);
    clearInterval(countdownInterval);
  }

  async function rastrear() {
    const codigo = input.value.trim().toUpperCase();
    resultado.innerHTML = "";
    limparTimers();

    if (!codigo || codigo.length < 8) {
      resultado.innerHTML = '<div class="erro">⚠️ Digite um código de rastreio válido.</div>';
      return;
    }

    const correiosUrl = "https://rastreamento.correios.com.br/app/index.php";

    // Copiar código
    let copied = false;
    try {
      await navigator.clipboard.writeText(codigo);
      copied = true;
    } catch {
      copied = false;
    }

    resultado.innerHTML = `
      <div class="resultado-box">
        <div>🔗 Código preparado para rastreio:</div>
        <code>${codigo}</code>
        <div style="margin-top:8px;color:${copied ? '#155724' : '#856404'}">
          ${copied ? '✅ Código copiado para a área de transferência.' : '⚠️ Copie manualmente o código acima.'}
        </div>
        <div class="countdown">Você será redirecionado ao site dos Correios em <span id="segundos">3</span> segundos...</div>
        <div class="resultado-controls">
          <button id="abrirAgora">Abrir agora</button>
          <button id="cancelar" class="secondary">Cancelar</button>
        </div>
      </div>
    `;

    let segundos = 3;
    const segEl = document.getElementById("segundos");

    countdownInterval = setInterval(() => {
      segundos--;
      if (segEl) segEl.textContent = segundos;
      if (segundos <= 0) clearInterval(countdownInterval);
    }, 1000);

    // Redirecionar automaticamente (mesma aba)
    redirectTimer = setTimeout(() => {
      window.location.href = correiosUrl;
    }, 3000);

    // Botões
    document.getElementById("abrirAgora").addEventListener("click", () => {
      limparTimers();
      window.location.href = correiosUrl;
    });

    document.getElementById("cancelar").addEventListener("click", () => {
      limparTimers();
      resultado.innerHTML = `<div class="resultado-box"><div style="color:#1e2a3a">🚫 Redirecionamento cancelado.<br><br>O código é: <code>${codigo}</code></div></div>`;
    });
  }

  btn.addEventListener("click", rastrear);
  input.addEventListener("keypress", (e) => { if (e.key === "Enter") rastrear(); });

  root.appendChild(container);
});
</script>
