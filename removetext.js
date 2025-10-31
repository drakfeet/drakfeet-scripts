<script>
document.addEventListener("DOMContentLoaded", function() {
  // Seleciona o container principal da promoção
  const promoContainer = document.querySelector('.js-product-promo-container[data-store="product-promotion-info"]');
  
  if (promoContainer) {
    // Seleciona todos os parágrafos dentro do container
    const paragraphs = promoContainer.querySelectorAll("p.mb-0");
    
    paragraphs.forEach(p => {
      const text = p.textContent.trim();

      // Verifica se o texto contém os trechos que queremos remover
      if (
        text.includes("Válido para este produto e todos da categoria") ||
        text.includes("Nesta promoção você pode combinar este produto")
      ) {
        p.remove(); // Remove apenas esses textos
      }
    });
  }
});
</script>
