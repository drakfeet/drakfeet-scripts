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
