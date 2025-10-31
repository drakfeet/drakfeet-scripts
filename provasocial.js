<!-- 
===========================================================
🔥 DRAK FEET | PROVA SOCIAL GLOBAL v3.5
Autor: DrakFeet + ChatGPT
-----------------------------------------------------------
💎 Atualizações:
 - 40 frases neutras realistas
 - Mantido layout, segurança e estrutura original
===========================================================
-->

<style>
/* ============================================================
🎨 ESTILO GLOBAL - PROVA SOCIAL
=========================================================== */
.drak-social-proof {
  width: 100%;
  background: linear-gradient(180deg, #fff 0%, #f9f9f9 100%);
  padding: 50px 20px;
  margin: 60px 0;
  border-radius: 14px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  position: relative;
  font-family: 'Inter', Arial, sans-serif;
  z-index: 1;
}

#related-products + .drak-social-proof,
.drak-social-proof + #related-products {
  margin-bottom: 30px !important;
  margin-top: 30px !important;
}

.drak-social-proof .social-proof-title {
  text-align: center;
  font-size: 1.9rem;
  font-weight: 800;
  color: #111;
  margin-bottom: 30px;
  letter-spacing: -0.5px;
}

.drak-social-proof .social-proof-carousel {
  display: flex;
  gap: 20px;
  overflow-x: hidden;
  align-items: flex-start;
  padding: 5px;
}

.drak-social-proof .social-proof-item {
  flex: 0 0 auto;
  width: 170px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 10px;
}

.drak-social-proof .social-proof-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.drak-social-proof img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 10px;
  border: 2px solid #fff;
}

.drak-social-proof .client-handle {
  margin-top: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  color: #111;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.drak-social-proof .client-quote {
  font-size: 0.85rem;
  color: #555;
  font-style: italic;
  margin-top: 4px;
}

.drak-social-proof .social-proof-cta {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.drak-social-proof .social-proof-cta a {
  text-decoration: none;
  background: #000;
  color: #fff;
  padding: 12px 28px;
  border-radius: 8px;
  font-weight: 700;
  transition: background 0.3s ease, transform 0.3s ease;
  font-size: 0.95rem;
  letter-spacing: 0.3px;
}

.drak-social-proof .social-proof-cta a:hover {
  background: #222;
  transform: translateY(-2px);
}

/* 📱 Responsividade */
@media (max-width: 900px) {
  .drak-social-proof .social-proof-item { width: 140px; }
  .drak-social-proof img { height: 150px; }
}
@media (max-width: 600px) {
  .drak-social-proof .social-proof-title { font-size: 1.5rem; }
  .drak-social-proof .social-proof-item { width: 120px; }
  .drak-social-proof img { height: 120px; }
  .drak-social-proof .client-handle { font-size: 0.8rem; }
}
</style>

<script>
/* ============================================================
🧠 DRAK FEET | PROVA SOCIAL GLOBAL v3.5
=========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  console.log("🟢 [DrakFeet] Prova Social v3.5 iniciando...");

  const instagramHighlightLink = "https://www.instagram.com/stories/highlights/18012984067820510/";

  // 👥 Lista de clientes + imagens
  const clientes = [
    { img: "https://i.imgur.com/Oo66XAD.jpg", handle: "_wagner_fernando_" },
    { img: "https://i.imgur.com/yedBlVD.jpg", handle: "ale_amaral.019" },
    { img: "https://i.imgur.com/tNycrqz.jpg", handle: "anacarolinacarvalho_17" },
    { img: "https://i.imgur.com/aJNIzKh.jpg", handle: "anacarolinacarvalho_17" },
    { img: "https://i.imgur.com/zuCCDyy.jpg", handle: "ananda3m" },
    { img: "https://i.imgur.com/YfQkyBs.jpg", handle: "be.araujo00" },
    { img: "https://i.imgur.com/SST3jY0.jpg", handle: "beatriz_gab1" },
    { img: "https://i.imgur.com/0xCxTaA.jpg", handle: "bebee.dixx" },
    { img: "https://i.imgur.com/Lp0JAB2.jpg", handle: "caiotexeira_" },
    { img: "https://i.imgur.com/KTOsQmS.jpg", handle: "caiotexeira_" },
    { img: "https://i.imgur.com/NxkpsbE.jpg", handle: "denasabino" },
    { img: "https://i.imgur.com/EhLEkMM.jpg", handle: "gabrieleroverssi" },
    { img: "https://i.imgur.com/XDIqTHy.jpg", handle: "lany.frts" },
    { img: "https://i.imgur.com/5p0c2qU.jpg", handle: "melmonyk" },
    { img: "https://i.imgur.com/BozcjrC.jpg", handle: "r4amos_kauan" },
    { img: "https://i.imgur.com/uPnWWaz.jpg", handle: "vitor_gaion" },
    { img: "https://i.imgur.com/UkWAsIn.jpg", handle: "vitorteixeira.01" },
    { img: "https://i.imgur.com/YlAHT8S.jpg", handle: "vtzz_46" },
  ];

  // 💬 40 Frases neutras e realistas
  const frases = [
    "Chegou antes do prazo, muito satisfeito!",
    "Produto exatamente como nas fotos.",
    "Excelente qualidade, valeu cada centavo!",
    "Entrega rápida e bem embalada.",
    "Super confortável, uso todos os dias.",
    "Atendimento nota 10, recomendo demais.",
    "Experiência de compra impecável.",
    "A cor é ainda mais bonita pessoalmente!",
    "Comprei e já quero outro modelo.",
    "Chegou tudo certinho, top demais!",
    "Qualidade surpreendente pelo preço.",
    "A loja é super confiável, recomendo.",
    "O tênis é leve e muito confortável.",
    "Fiquei impressionado com o acabamento.",
    "Tudo perfeito do início ao fim.",
    "Ótima experiência, voltarei a comprar.",
    "Chegou bem antes do esperado!",
    "Produto top e de excelente qualidade.",
    "Atendimento rápido e eficiente.",
    "Compra segura e envio rápido.",
    "Design incrível, realmente chama atenção.",
    "Perfeito para o dia a dia.",
    "Veio muito bem embalado, parabéns!",
    "Melhor compra que fiz esse mês.",
    "Produto fiel à descrição do site.",
    "Entrega super rápida e sem problema.",
    "O conforto é sensacional!",
    "Material premium, recomendo muito.",
    "Comprei com receio e amei o resultado.",
    "Tudo certo com o pedido, obrigado!",
    "Produto 100% perfeito, podem confiar.",
    "Já é o terceiro que compro, excelente.",
    "Superou todas as expectativas.",
    "Fácil de comprar e chegou direitinho.",
    "A loja mandou tudo perfeito.",
    "Produto de alta qualidade e ótimo preço.",
    "Valeu cada centavo investido.",
    "Muito satisfeito com a compra!",
    "Serviço impecável, entrega rápida.",
    "Ficou perfeito no pé, muito bom mesmo!"
  ];

  // 🌀 Função de embaralhar
  const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);

  // 🎯 Atribui frases únicas (sem repetição)
  const assignUniqueQuotes = (clients) => {
    const frasesRandom = shuffleArray([...frases]);
    return clients.map((c, i) => ({
      ...c,
      frase: frasesRandom[i % frasesRandom.length],
    }));
  };

  // 🔨 Cria o HTML principal
  const createSocialProofHTML = () => {
    const randomized = shuffleArray(assignUniqueQuotes(clientes));
    const duplicated = [...randomized, ...shuffleArray(randomized)];

    const itemsHTML = duplicated.map(c => `
      <div class="social-proof-item">
        <img src="${c.img}" alt="@${c.handle}">
        <p class="client-handle">@${c.handle}</p>
        <p class="client-quote">"${c.frase}"</p>
      </div>
    `).join("");

    return `
      <section class="drak-social-proof">
        <h2 class="social-proof-title">Quem usa Drak Feet, recomenda 👟🔥</h2>
        <div class="social-proof-carousel">${itemsHTML}</div>
        <div class="social-proof-cta">
          <a href="${instagramHighlightLink}" target="_blank" rel="noopener">Ver todos os feedbacks →</a>
        </div>
      </section>
    `;
  };

  // 🚀 Inserção única (antes do #related-products ou footer)
  const insertSocialProof = () => {
    if (document.querySelector(".drak-social-proof")) {
      console.log("⚠️ [DrakFeet] Prova Social já existe. Evitando duplicação.");
      return;
    }

    const related = document.querySelector("#related-products");
    const footer = document.querySelector("footer");

    if (related) {
      related.insertAdjacentHTML("beforebegin", createSocialProofHTML());
      console.log("✅ [DrakFeet] Prova social adicionada antes do #related-products.");
    } else if (footer) {
      footer.insertAdjacentHTML("beforebegin", createSocialProofHTML());
      console.log("✅ [DrakFeet] Prova social adicionada acima do footer.");
    } else {
      console.warn("⚠️ [DrakFeet] Nenhum local encontrado para inserção.");
    }

    initCarousel();
  };

  // 🎠 Rolagem automática contínua
  const initCarousel = () => {
    const carousel = document.querySelector(".social-proof-carousel");
    if (!carousel) return;

    let scrollSpeed = 0.7;
    let isPaused = false;

    function autoScroll() {
      if (!isPaused) carousel.scrollLeft += scrollSpeed;
      if (carousel.scrollLeft >= carousel.scrollWidth / 2) carousel.scrollLeft = 0;
      requestAnimationFrame(autoScroll);
    }

    carousel.addEventListener("mouseenter", () => (isPaused = true));
    carousel.addEventListener("mouseleave", () => (isPaused = false));

    console.log("🎠 [DrakFeet] Carrossel ativo e rolando suavemente.");
    autoScroll();
  };

  insertSocialProof();
});
</script>
