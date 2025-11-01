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
