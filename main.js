/*
🔥 DRAK FEET | MAIN SCRIPT v1.0
------------------------------------------------------------
📦 Repositório: https://github.com/drakfeet/drakfeet-scripts
🚀 Objetivo: Carregar todos os módulos externos via jsDelivr CDN
🧠 Boas práticas: defer + logs + segurança + carregamento dinâmico
------------------------------------------------------------
*/

(function () {
  console.log("🚀 DRAK FEET | MAIN inicializado!");

  // Lista de scripts públicos hospedados no GitHub
  const scripts = [
    "https://cdn.jsdelivr.net/gh/drakfeet/drakfeet-scripts/contador.js",
    "https://cdn.jsdelivr.net/gh/drakfeet/drakfeet-scripts/faixaneon.js",
    "https://cdn.jsdelivr.net/gh/drakfeet/drakfeet-scripts/notifications.js",
    "https://cdn.jsdelivr.net/gh/drakfeet/drakfeet-scripts/prontaentrega.js",
    "https://cdn.jsdelivr.net/gh/drakfeet/drakfeet-scripts/provasocial.js",
    "https://cdn.jsdelivr.net/gh/drakfeet/drakfeet-scripts/removetext.js",
  ];

  // Função para carregar os scripts de forma segura e ordenada
  const loadScripts = () => {
    scripts.forEach((src) => {
      const script = document.createElement("script");
      script.src = src + `?v=${Date.now()}`; // garante atualização instantânea (sem cache)
      script.defer = true;
      script.onload = () => console.log(`✅ [DRAK FEET] ${src.split("/").pop()} carregado com sucesso!`);
      script.onerror = () => console.warn(`⚠️ [DRAK FEET] Falha ao carregar: ${src}`);
      document.body.appendChild(script);
    });
  };

  // Garante que o DOM esteja pronto antes de injetar os scripts
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadScripts);
  } else {
    loadScripts();
  }
})();
