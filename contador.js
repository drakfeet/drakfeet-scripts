<script>
(function(){
  "use strict";
  console.log("%cPromoV5: inicializando contador de promoção com ajustes de margem e estoque","color:#FF8C42;font-weight:bold;");

  /* ===================================================
     CONFIGURAÇÕES GERAIS
     =================================================== */
  const DURATION_SECONDS = 10 * 60;          // Duração total: 10 minutos
  const INITIAL_UNITS = 12;                  // Unidades iniciais (aumentadas)
  const DECREMENT_INTERVAL_SECONDS = 75;     // Intervalo (em segundos) para reduzir unidades
  const PATH_KEY = encodeURIComponent(location.pathname || "default");
  const STORAGE_END_KEY = "promo_endtime_" + PATH_KEY;
  const STORAGE_UNITS_KEY = "promo_units_" + PATH_KEY;
  const SELECTOR = ".js-product-variants";   // Elemento base para inserir o contador

  /* ===================================================
     ESTILOS DINÂMICOS
     =================================================== */
  const style = document.createElement("style");
  style.textContent = `
    .promo-countdown {
      box-sizing: border-box;
      margin: 10px 0; /* margem superior e inferior ajustada */
      padding: 14px 16px;
      background: #181C2A;
      border: 1.5px solid #2A3145;
      border-radius: 10px;
      color: #f5f5f5;
      font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, Arial;
      max-width: 100%;
      width: 100%;
      box-shadow: 0 4px 22px rgba(0,0,0,0.25);
      transition: all 0.3s ease;
    }

    .promo-countdown__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .promo-countdown__badge {
      background: linear-gradient(90deg, #FF8C42, #FF3D3D);
      color: #fff;
      font-weight: 700;
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 13px;
      letter-spacing: 0.4px;
    }

    .promo-countdown__title {
      font-size: 14px;
      font-weight: 600;
      color: #FF8C42;
    }

    .promo-countdown__timer {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: 1px;
      margin-bottom: 6px;
      color: #fff;
      text-align: center;
      transition: all 0.4s ease;
    }

    .promo-countdown__timer--pulse {
      animation: pulse 1s infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); color: #fff; }
      50% { transform: scale(1.1); color: #FF3D3D; }
    }

    .promo-countdown__remaining {
      text-align: center;
      font-size: 13px;
      color: #ccc;
    }

    .promo-countdown__units {
      color: #FF8C42;
      font-weight: 800;
      margin: 0 4px;
    }

    .promo-countdown__progress {
      height: 6px;
      background: rgba(255, 255, 255, 0.12);
      border-radius: 6px;
      overflow: hidden;
      margin-top: 10px;
      position: relative;
    }

    .promo-countdown__progress > .bar {
      height: 100%;
      width: 100%;
      background: linear-gradient(90deg, #FF8C42, #FF3D3D);
      transform-origin: left;
      transform: scaleX(1);
      transition: transform 1s linear, box-shadow 0.5s ease;
    }

    .promo-countdown__progress--glow .bar {
      box-shadow: 0 0 10px 3px #FF3D3D;
    }

    .promo-countdown--hidden { opacity: 0; transform: translateY(10px); transition: all 300ms ease; }
    .promo-countdown--visible { opacity: 1; transform: translateY(0); transition: all 300ms ease; }

    @media (max-width: 600px) {
      .promo-countdown {
        max-width: 80vw;
        padding: 12px 14px;
        border-radius: 10px;
        font-size: 12px;
      }
      .promo-countdown__timer { font-size: 20px; }
      .promo-countdown__badge { font-size: 12px; padding: 5px 8px; }
    }
  `;
  document.head.appendChild(style);

  /* ===================================================
     FUNÇÕES AUXILIARES
     =================================================== */
  const nowMs = () => Date.now();
  const safeNumber = (v,f=0)=>isNaN(parseInt(v))?f:parseInt(v);
  const formatMMSS = s=>{
    const m=Math.floor(s/60), sec=s%60;
    return `${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
  };

  /* ===================================================
     INSERÇÃO DO CONTADOR NO DOM
     =================================================== */
  const variantsEl = document.querySelector(SELECTOR);
  if (!variantsEl) {
    console.warn("PromoV5: elemento base não encontrado (.js-product-variants)");
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.id = "promoCountdownV5";
  wrapper.className = "promo-countdown promo-countdown--hidden";
  wrapper.innerHTML = `
    <div class="promo-countdown__header">
      <div class="promo-countdown__badge">OFERTA RELÂMPAGO</div>
      <div class="promo-countdown__title">Tempo limitado!</div>
    </div>
    <div class="promo-countdown__timer" id="promoCountdownTimerV5">10:00</div>
    <div class="promo-countdown__remaining">
      Restam <span class="promo-countdown__units" id="promoUnitsRemainingV5">${INITIAL_UNITS}</span> unidades disponíveis
    </div>
    <div class="promo-countdown__progress" id="promoProgressV5"><div class="bar"></div></div>
  `;
  variantsEl.parentNode.insertBefore(wrapper, variantsEl.nextSibling);

  requestAnimationFrame(()=>{
    wrapper.classList.remove("promo-countdown--hidden");
    wrapper.classList.add("promo-countdown--visible");
  });

  console.log("PromoV5: elemento contador inserido com sucesso");

  /* ===================================================
     ESTADO LOCAL (localStorage)
     =================================================== */
  const loadState = ()=>{
    try{
      return {
        end: safeNumber(localStorage.getItem(STORAGE_END_KEY)),
        units: safeNumber(localStorage.getItem(STORAGE_UNITS_KEY), INITIAL_UNITS)
      };
    } catch(e) {
      console.warn("PromoV5: falha ao carregar estado", e);
      return { end: 0, units: INITIAL_UNITS };
    }
  };

  const saveState = (end, units)=>{
    try{
      localStorage.setItem(STORAGE_END_KEY, end);
      localStorage.setItem(STORAGE_UNITS_KEY, units);
    } catch(e) {
      console.warn("PromoV5: falha ao salvar estado", e);
    }
  };

  const clearState = ()=>{
    try{
      localStorage.removeItem(STORAGE_END_KEY);
      localStorage.removeItem(STORAGE_UNITS_KEY);
    } catch(e){}
  };

  /* ===================================================
     LÓGICA PRINCIPAL
     =================================================== */
  let endTime=0, units=INITIAL_UNITS, timerInt, decInt;
  (function init(){
    const state = loadState(), now = nowMs();
    if (state.end && state.end > now) {
      endTime = state.end;
      units = state.units;
      console.log("PromoV5: estado recuperado do localStorage", { endTime, units });
    } else {
      endTime = now + DURATION_SECONDS * 1000;
      units = INITIAL_UNITS;
      saveState(endTime, units);
      console.log("PromoV5: novo contador iniciado", { endTime, units });
    }
    updateUI();
    startIntervals();
  })();

  function updateUI(){
    const now = nowMs();
    const remain = Math.max(0, Math.ceil((endTime - now)/1000));
    const pct = Math.max(0, Math.min(1, (endTime - now)/(DURATION_SECONDS*1000)));
    const timerEl = document.getElementById("promoCountdownTimerV5");
    const unitsEl = document.getElementById("promoUnitsRemainingV5");
    const barEl = document.querySelector("#promoProgressV5 .bar");
    const progressEl = document.getElementById("promoProgressV5");

    timerEl.textContent = formatMMSS(remain);
    unitsEl.textContent = units;

    if (remain <= 60) timerEl.classList.add("promo-countdown__timer--pulse");
    else timerEl.classList.remove("promo-countdown__timer--pulse");

    if (units <= 2) progressEl.classList.add("promo-countdown__progress--glow");
    else progressEl.classList.remove("promo-countdown__progress--glow");

    barEl.style.transform = `scaleX(${pct})`;

    if (remain <= 0) endBehavior();
  }

  function endBehavior(){
    clearInterval(timerInt);
    clearInterval(decInt);
    wrapper.querySelector(".promo-countdown__title").textContent = "Tempo esgotado";
    document.getElementById("promoCountdownTimerV5").textContent = "00:00";
    document.getElementById("promoUnitsRemainingV5").textContent = "0";
    wrapper.style.opacity = "0.8";
    wrapper.style.borderColor = "#555";
    clearState();
    console.log("%cPromoV5: promoção encerrada.","color:#FF3D3D;font-weight:bold;");
  }

  function startIntervals(){
    timerInt = setInterval(updateUI, 1000);
    decInt = setInterval(()=>{
      if (units > 1) {
        units--;
        saveState(endTime, units);
        updateUI();
        console.log("PromoV5: unidades atualizadas ->", units);
      } else {
        clearInterval(decInt);
      }
    }, DECREMENT_INTERVAL_SECONDS * 1000);
  }

})();
</script>
