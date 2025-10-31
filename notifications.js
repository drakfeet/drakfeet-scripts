<!-- =============================================
     FAKE SALES NOTIFIER — v6 (Slide, localStorage, stats, listas ampliadas)
     -------------------------------------------------
     - Slide L→R ao entrar; volta L ao sair
     - Notificação menor (menos sobreposição do WhatsApp)
     - Duração menor e intervalo maior entre notificações
     - Evita repetir nomes (localStorage) por X minutos
     - Badge/relatório no console com estatísticas
     - Listas de nomes e cidades ampliadas (fontes citadas)
     - Boas práticas, comentários e logs detalhados
============================================= -->

<!-- Dependência: PapaParse (defer para garantir disponível antes do init) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js" defer></script>

<script defer>
document.addEventListener("DOMContentLoaded", () => {
  console.log("FSN: DOM carregado — iniciando módulo v6...");

  /* ========== CONFIGURAÇÃO ========== */
  const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQb_mtaN6rd1ygFm8JXXFh8x8aK1baiS79AtRGbFO6mmYHJ_A4om_qsgO4e8R2TWOXwpdLc6bGltEJ7/pub?output=csv";

  // Tempo em milissegundos — ajustados conforme pedido:
  const NOTIF_DURATION_MS = 8_000;    // 8s de exibição (reduzido)
  const NOTIF_INTERVAL_MS = 35_000;   // 35s entre notificações (maior intervalo)
  const MAX_STACK = 3;                // máximo de notificações simultâneas
  const STYLE_ID = "fsn-styles-v6";

  // Config localStorage para evitar repetição de nomes
  const RECENT_NAMES_KEY = "fsn_recent_names_v6"; // chave no localStorage
  const RECENT_NAMES_MAX = 40;                    // guarda até N nomes recentes
  const AVOID_REPEAT_MINUTES = 60;                // evita repetir por X minutos

  /* ========== Estado/estatísticas ======== */
  let PRODUCTS = [];            // produtos carregados do CSV (fallback se vazio)
  let notifIntervalId = null;
  let activeNotifs = 0;
  const stats = {
    shownCount: 0,
    productsRead: 0,
    repeatedAvoided: 0
  };

  /* ========== Listas ampliadas (nomes + cidades + estados) ==========
     Fontes usadas para compor/ampliar listas: Wikipedia/IBGE/Exame & artigos
     (citadas no final da resposta). As listas abaixo são estáticas para
     performance (evita fetch a cada emissão).
  */
  const NAMES = [
    // mistura de nomes masculinos e femininos populares e comuns no Brasil
    "Miguel","Arthur","Heitor","Helena","Alice","Theo","Júlia","Gael","Laura","Davi",
    "Luiza","Gabriel","Bernardo","Sophia","Samuel","Isabella","Rafael","Beatriz","Matheus","Pedro",
    "Mariana","Lucas","Ana","Fernanda","João","Clara","Isabela","Carlos","Sofia","Gustavo",
    "Bianca","Mateus","Laura","Murilo","Daniela","Vitor","Camila","Thiago","Paula","Igor",
    "Bruna","Eduardo","Marcela","Felipe","Priscila","Ricardo","Leonardo","Guilherme","Diego","Vítor",
    "Renata","Roberto","Daniel","Claudio","Emanuel","Valentina","Camila","Lorena","Otávio","André",
    "Rodrigo","Sergio","Vivian","Raquel","Enzo","Cecília","Breno","Catarina","Luan","Mário",
    "Nina","Iara","Elias","Leandro","Carolina","Helio","Fábio","Amanda","Jonas","Elisa"
  ];

  const CITIES = [
    // lista ampliada com cidades brasileiras populares (capitais + cidades grandes)
    { city: "São Paulo", state: "SP" }, { city: "Rio de Janeiro", state: "RJ" },
    { city: "Brasília", state: "DF" }, { city: "Salvador", state: "BA" },
    { city: "Fortaleza", state: "CE" }, { city: "Belo Horizonte", state: "MG" },
    { city: "Manaus", state: "AM" }, { city: "Curitiba", state: "PR" },
    { city: "Recife", state: "PE" }, { city: "Porto Alegre", state: "RS" },
    { city: "Goiânia", state: "GO" }, { city: "Belém", state: "PA" },
    { city: "Guarulhos", state: "SP" }, { city: "São Bernardo do Campo", state: "SP" },
    { city: "Niterói", state: "RJ" }, { city: "Campinas", state: "SP" },
    { city: "São José dos Campos", state: "SP" }, { city: "Ribeirão Preto", state: "SP" },
    { city: "Jundiaí", state: "SP" }, { city: "Piracicaba", state: "SP" },
    { city: "Santos", state: "SP" }, { city: "Sorocaba", state: "SP" },
    { city: "Uberlândia", state: "MG" }, { city: "Londrina", state: "PR" },
    { city: "Maceió", state: "AL" }, { city: "Teresina", state: "PI" },
    { city: "Cuiabá", state: "MT" }, { city: "Campo Grande", state: "MS" },
    { city: "São Luís", state: "MA" }, { city: "João Pessoa", state: "PB" },
    { city: "Aracaju", state: "SE" }, { city: "Vitória", state: "ES" },
    { city: "Bauru", state: "SP" }, { city: "Volta Redonda", state: "RJ" },
    { city: "Franca", state: "SP" }, { city: "Pelotas", state: "RS" },
    { city: "Vitória da Conquista", state: "BA" }, { city: "Caxias do Sul", state: "RS" },
    { city: "Campina Grande", state: "PB" }, { city: "Petrolina", state: "PE" }
  ];

  // Pequena utilidade: embaralhador Fisher-Yates
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* ========== Helpers de localStorage para evitar repetição ==========
     Guardamos um array de objetos: { name: "...", ts: 167..., expiresAt: 167... }
  */
  function loadRecentNames() {
    try {
      const raw = localStorage.getItem(RECENT_NAMES_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      // filtra expirados
      const now = Date.now();
      const valid = parsed.filter(item => item && item.expiresAt && item.expiresAt > now);
      // persistir limpeza
      localStorage.setItem(RECENT_NAMES_KEY, JSON.stringify(valid.slice(0, RECENT_NAMES_MAX)));
      return valid;
    } catch (e) {
      console.warn("FSN: falha ao ler recent names do localStorage", e);
      return [];
    }
  }

  function saveRecentName(name) {
    try {
      const list = loadRecentNames();
      const expiresAt = Date.now() + AVOID_REPEAT_MINUTES * 60_000;
      list.unshift({ name, ts: Date.now(), expiresAt });
      // limitar e salvar
      localStorage.setItem(RECENT_NAMES_KEY, JSON.stringify(list.slice(0, RECENT_NAMES_MAX)));
    } catch (e) {
      console.warn("FSN: falha ao salvar recent name", e);
    }
  }

  function isNameRecent(name) {
    const list = loadRecentNames();
    return list.some(item => item.name === name);
  }

  /* ========== Injecta estilos (reduzidos para evitar sobrepor WhatsApp) ========== */
  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .fsn-container {
        position: fixed;
        left: 12px;
        bottom: 18px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: flex-start;
        z-index: 12000;
        pointer-events: none;
        max-width: 320px;
        width: calc(100vw - 44px);
      }

      .fsn-notif {
        pointer-events: auto;
        display: flex;
        align-items: center;
        gap: 10px;
        background: linear-gradient(90deg, rgba(22,24,30,0.98), rgba(32,34,40,0.98));
        color: #fff;
        border-radius: 10px;
        padding: 10px;
        box-shadow: 0 6px 20px rgba(7,8,10,0.38);
        transform-origin: left center;
        opacity: 0;
        transform: translateX(-22px); /* inicia à esquerda */
        transition: transform 320ms cubic-bezier(.2,.9,.2,1), opacity 320ms ease;
        font-family: system-ui, -apple-system, "Segoe UI", Roboto;
        font-size: 13px; /* menor para ocupar menos espaço */
        min-width: 220px;
      }

      .fsn-notif.show { opacity: 1; transform: translateX(0); } /* slide para dentro (L->R) */

      .fsn-icon {
        min-width: 40px; height: 40px;
        border-radius: 8px;
        display:flex; align-items:center; justify-content:center;
        font-size:18px;
        background: linear-gradient(135deg,#00c6ff,#0072ff);
        flex-shrink:0;
      }

      .fsn-body { flex:1; display:flex; flex-direction:column; gap:3px; min-width:0; }
      .fsn-line1 { font-weight:700; font-size:13px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
      .fsn-line2 { font-size:12px; opacity:0.9; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

      .fsn-progress { height:4px; background: rgba(255,255,255,0.08); border-radius:4px; overflow:hidden; margin-top:6px; }
      .fsn-progress > .bar { height:100%; width:100%; background: linear-gradient(90deg,#00d4ff,#0066ff); transform-origin:left; transform:scaleX(1); transition:transform linear; }

      .fsn-close { background:transparent; border:0; color:#fff; cursor:pointer; font-size:13px; padding:6px; margin-left:6px; opacity:0.9; }
      .fsn-close:hover { opacity:1; }

      /* Mobile: deixar espaço pro botão do WhatsApp à direita (não ocupar a tela toda) */
      @media (max-width:480px) {
        .fsn-container { left: 8px; bottom: 10px; max-width: 78vw; } /* reserva ~22% à direita */
        .fsn-icon { width:36px; height:36px; font-size:16px; border-radius:6px; }
        .fsn-notif { padding:9px; border-radius:8px; font-size:12px; }
      }
    `;
    document.head.appendChild(style);
    console.log("FSN: estilos v6 injetados.");
  }

  /* ========== Container ========= */
  function ensureContainer() {
    let el = document.querySelector(".fsn-container");
    if (!el) {
      el = document.createElement("div");
      el.className = "fsn-container";
      document.body.appendChild(el);
      console.log("FSN: container criado no DOM.");
    }
    return el;
  }

  /* ========== CSV loader (com PapaParse) ========== */
  async function loadProductsFromCsv(url) {
    console.log("FSN: carregando CSV de:", url);
    try {
      const res = await fetch(url, { cache: "no-cache" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();

      return await new Promise(resolve => {
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete(results) {
            // normaliza chaves e extrai nome do produto de colunas possíveis
            const rows = results.data.map(r => {
              const norm = {};
              Object.keys(r).forEach(k => norm[k.trim()] = r[k]);
              const name = (norm["Nome dos Produtos"] || norm["Nome Do Produto"] || norm["Nome"] || norm["nome"] || norm["name"] || norm["Produto"] || "").toString().trim();
              return name || null;
            }).filter(Boolean);
            console.log(`FSN: CSV parseado → ${rows.length} produtos encontrados.`);
            stats.productsRead = rows.length;
            resolve(rows);
          },
          error(err) {
            console.error("FSN: erro ao parsear CSV:", err);
            resolve([]);
          }
        });
      });
    } catch (err) {
      console.error("FSN: falha ao carregar CSV:", err);
      return [];
    }
  }

  /* ========== Show Notification (slide L->R) ========= */
  function showNotification({ customerName, city, state, productName, duration = NOTIF_DURATION_MS }) {
    const container = ensureContainer();

    if (activeNotifs >= MAX_STACK) {
      console.log("FSN: limite simultâneo atingido — descartando notificação.");
      return null;
    }

    // Criar elementos
    const notif = document.createElement("div");
    notif.className = "fsn-notif";

    const icon = document.createElement("div");
    icon.className = "fsn-icon";
    icon.textContent = "🔔";

    const body = document.createElement("div");
    body.className = "fsn-body";
    const line1 = document.createElement("div");
    line1.className = "fsn-line1";
    line1.textContent = `${customerName} (${city}, ${state}) comprou`;
    const line2 = document.createElement("div");
    line2.className = "fsn-line2";
    line2.textContent = productName;

    const progressWrap = document.createElement("div");
    progressWrap.className = "fsn-progress";
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.transform = "scaleX(1)";
    progressWrap.appendChild(bar);

    const closeBtn = document.createElement("button");
    closeBtn.className = "fsn-close";
    closeBtn.textContent = "✕";
    closeBtn.title = "Fechar notificação";

    body.append(line1, line2, progressWrap);
    notif.append(icon, body, closeBtn);

    // Inserir e animar (slide L->R)
    const before = Array.from(container.children); // snapshot para FLIP se necessário (opcional)
    container.insertBefore(notif, container.firstChild);

    // Forçar frame para aplicar transição (aparecer)
    requestAnimationFrame(() => {
      notif.classList.add("show"); // transforma translateX(0) e opacity 1 (slide in)
    });

    // Progress bar animada
    bar.style.transition = `transform ${duration}ms linear`;
    setTimeout(() => { bar.style.transform = "scaleX(0)"; }, 40);

    activeNotifs++;
    stats.shownCount++;
    console.log(`FSN: notificação exibida → ${customerName} / ${productName} (${city}-${state}). Ativas: ${activeNotifs}`);

    // Remoção automática (desliza para a esquerda ao desaparecer)
    const autoRemove = setTimeout(() => {
      // anima slide out para a esquerda
      notif.style.transition = "transform 260ms ease, opacity 260ms ease";
      notif.style.transform = "translateX(-22px)";
      notif.style.opacity = "0";
      setTimeout(() => {
        if (notif && notif.parentNode) notif.remove();
        activeNotifs = Math.max(0, activeNotifs - 1);
        console.log(`FSN: notificação removida automaticamente. Ativas: ${activeNotifs}`);
      }, 300);
    }, duration);

    // fechar manual
    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      clearTimeout(autoRemove);
      // anima slide out para a esquerda
      notif.style.transition = "transform 260ms ease, opacity 260ms ease";
      notif.style.transform = "translateX(-22px)";
      notif.style.opacity = "0";
      setTimeout(() => {
        if (notif && notif.parentNode) notif.remove();
        activeNotifs = Math.max(0, activeNotifs - 1);
        console.log(`FSN: notificação removida manualmente. Ativas: ${activeNotifs}`);
      }, 300);
    });

    // atualizar badge de estatísticas no console
    logStats();

    return { element: notif, cancel: () => { clearTimeout(autoRemove); if (notif && notif.parentNode) notif.remove(); activeNotifs = Math.max(0, activeNotifs - 1); } };
  }

  /* ========== Seleção de nome/local sem repetição imediata ==========
     Tenta selecionar um nome que não esteja no recent list (localStorage).
     Se não encontrar em X tentativas, aceita o próximo disponível (evita bloqueio).
  */
  function pickNameAvoidingRecent() {
    const attempts = 12; // número de tentativas antes de ceder
    const shuffled = shuffle(NAMES);
    for (let i = 0; i < Math.min(attempts, shuffled.length); i++) {
      const candidate = shuffled[i];
      if (!isNameRecent(candidate)) {
        // marca como usado e retorna
        saveRecentName(candidate);
        return candidate;
      } else {
        stats.repeatedAvoided++;
      }
    }
    // se não achou um não-recent, pega o primeiro (força utilização)
    const fallback = shuffled[0];
    saveRecentName(fallback);
    return fallback;
  }

  /* ========== Loop emissor principal ========= */
  function startNotifications(products) {
    const pool = products?.length ? products : [
      "Tênis Demo 1","Tênis Demo 2","Tênis Demo 3","Tênis Demo 4",
      "Tênis Demo 5","Tênis Demo 6","Tênis Demo 7","Tênis Demo 8"
    ];
    PRODUCTS = pool.slice();
    console.log(`FSN: iniciando loop com ${pool.length} produtos.`);

    const emit = () => {
      const name = pickNameAvoidingRecent();
      const place = sample(CITIES);
      const product = sample(pool);
      showNotification({ customerName: name, city: place.city, state: place.state, productName: product });
    };

    // primeira imediata e depois agendamento
    emit();
    notifIntervalId = setInterval(emit, NOTIF_INTERVAL_MS);
    console.log(`FSN: agendado emissão a cada ${NOTIF_INTERVAL_MS}ms.`);
  }

  /* ========== Estatísticas no console (badge simples) ========= */
  function logStats() {
    try {
      const badge = {
        "FSN: notificações mostradas": stats.shownCount,
        "FSN: produtos lidos do CSV": stats.productsRead,
        "FSN: repetições evitadas (contagem)": stats.repeatedAvoided,
        "FSN: nomes recentes guardados (localStorage)": loadRecentNames().length
      };
      // usa groupCollapsed para não poluir demais o console
      console.groupCollapsed("%cFSN — Estatísticas", "color: #0ff; font-weight:700;");
      console.table(badge);
      console.groupEnd();
    } catch (e) {
      console.log("FSN: erro ao logar estatísticas:", e);
    }
  }

  /* ========== Inicialização segura ========= */
  (async function initFSN() {
    console.log("FSN: inicializando (v6)...");
    injectStyles();
    ensureContainer();

    const products = await loadProductsFromCsv(CSV_URL);
    if (!products.length) {
      console.warn("FSN: CSV vazio ou falhou — usando fallback interno.");
    } else {
      console.log("FSN: exemplo de produtos carregados:", products.slice(0,6));
    }
    // registra quantos produtos foram lidos em stats
    stats.productsRead = products.length;

    startNotifications(products);

    // log inicial das stats
    logStats();

    console.log(`FSN: iniciado (duração=${NOTIF_DURATION_MS}ms, intervalo=${NOTIF_INTERVAL_MS}ms).`);
  })();

  /* ========== API pública ======== */
  window.FSN_stop = function() {
    if (notifIntervalId) clearInterval(notifIntervalId);
    notifIntervalId = null;
    console.log("FSN: loop parado via API pública.");
    logStats();
  };
  window.FSN_start = function() {
    if (notifIntervalId) return console.log("FSN: já em execução.");
    startNotifications(PRODUCTS);
    console.log("FSN: loop iniciado via API pública.");
  };

  /* ========== Utilitários pequenos adicionais ========= */
  function sample(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

});
</script>
