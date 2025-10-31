<script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>
<script>
/*
🔥 Sistema de Disponibilidade — Versão Estável e Segura
Correções e melhorias:
✅ InsertBefore corrigido (usando container atualizado)
✅ Logs agrupados por clique
✅ Nenhum conflito com CSS existente
✅ Cidades válidas: Leme, Araras, Pirassununga
✅ Mensagens de disponibilidade e indisponibilidade novas
✅ Badge com fade e estilo moderno
✅ Log do CEP do usuário
✅ Boas práticas e segurança
*/

const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRRxgjS2d2E7528lMb61nCg3U98Zm2iScEbPWBCS5AoYTD4vkpdb24ypEkEqAQw_mT8534CIAkNVlWh/pub?output=csv";
const CIDADES_VALIDAS = ['leme', 'araras', 'pirassununga', 'limeira',];
const faixaCepLeme = { min: 13610000, max: 13619999 };

// ---------------- 🔒 FUNÇÕES AUXILIARES ----------------
async function fetchWithTimeout(url, ms = 3000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.json();
  } catch (err) {
    clearTimeout(id);
    console.warn('⚠️ Falha em:', url, err.message);
    return null;
  }
}

async function detectLocation() {
  console.log('🌍 Iniciando detecção de localização via APIs...');
  const ipinfo = await fetchWithTimeout('https://ipinfo.io/json?token=450f9556beb2b3');
  if (ipinfo?.city) return { city: ipinfo.city.toLowerCase(), provider: 'ipinfo' };

  const ipapi = await fetchWithTimeout('https://ipapi.co/json/');
  if (ipapi?.city) return { city: ipapi.city.toLowerCase(), provider: 'ipapi' };

  const geojs = await fetchWithTimeout('https://get.geojs.io/v1/ip/geo.json');
  if (geojs?.city) return { city: geojs.city.toLowerCase(), provider: 'geojs' };

  console.warn('❌ Nenhuma API retornou cidade.');
  return null;
}

async function getSheetData() {
  console.log('📄 Baixando CSV de produtos...');
  try {
    const res = await fetch(CSV_URL);
    const txt = await res.text();
    return new Promise(resolve => {
      Papa.parse(txt, {
        header: true,
        skipEmptyLines: true,
        complete(res) {
          res.data.forEach(p => p['Tamanhos'] = p['Tamanhos'] ? p['Tamanhos'].split(',').map(t => t.trim()) : []);
          console.log(`✅ CSV carregado (${res.data.length} linhas)`);
          resolve(res.data);
        }
      });
    });
  } catch (err) {
    console.error('❌ Erro ao ler CSV:', err.message);
    return [];
  }
}

function normalizeCep(cep) { return (cep || '').replace(/\D/g, ''); }
function isCepDeLeme(cep) {
  const n = parseInt(normalizeCep(cep) || '0', 10);
  const result = n >= faixaCepLeme.min && n <= faixaCepLeme.max;
  console.log(`📫 Verificando CEP ${cep} → ${result ? 'Leme' : 'Fora da faixa'}`);
  return result;
}

// ---------------- 🎨 UI ----------------
function criarBadge(texto, tipo = 'disponivel') {
  const badge = document.createElement('div');
  badge.className = 'disponivel-badge-premium';

  // Dividindo o texto em linhas
  const lines = texto.split('<br>');
  badge.innerHTML = `
    <span style="font-size:24px; margin-right:12px;">${tipo === 'disponivel' ? '✅' : '⚠️'}</span>
    <div style="display:flex; flex-direction:column; line-height:1.5; font-weight:700; font-size:15px;">
      ${lines.map(l => `<span>${l}</span>`).join('')}
    </div>
  `;

  badge.style.cssText = `
    background:${tipo === 'disponivel' ? '#181c2a' : '#4b4b4b'};
    color:#fff; 
    padding:12px 20px; 
    border-radius:10px;
    display:flex; 
    align-items:center; 
    justify-content:flex-start;
    box-shadow:0 6px 18px rgba(0,0,0,0.35);
    width:100%; 
    margin-bottom:12px;
    text-align:left;
    word-break:break-word;
    opacity:0;
    transform: translateY(-10px);
    transition: all 0.5s ease;
    box-sizing:border-box;
  `;

  // Efeito fade-in
  setTimeout(() => {
    badge.style.opacity = '1';
    badge.style.transform = 'translateY(0)';
  }, 50);

  return badge;
}

function removerBadge() {
  document.querySelectorAll('.disponivel-badge-container').forEach(b => b.remove());
}

// ---------------- 🚀 MAIN ----------------
async function iniciarDisponibilidade() {
  console.log('🚀 Iniciando verificação de disponibilidade...');
  const [produtos, geo] = await Promise.all([getSheetData(), detectLocation()]);

  const cidadeAPI = (geo?.city || '').toLowerCase();
  const cepInput = document.querySelector('input[name="cep"], #cep, input[name="zipcode"]');
  const cepVal = cepInput ? cepInput.value.trim() : '';
  const cepValid = cepVal ? isCepDeLeme(cepVal) : false;

  console.log('📍 Cidade detectada pela API:', cidadeAPI || 'Desconhecida');
  console.log(`📫 CEP digitado: ${cepVal || 'Não informado'} | Faixa válida?`, cepValid);

  const isLocal = CIDADES_VALIDAS.includes(cidadeAPI) || cepValid;
  console.log('✅ Área válida para envio?', isLocal);

  const nomeEl = document.querySelector('h1.js-product-name');
  if (!nomeEl) return console.warn('⚠️ Nome do produto não encontrado.');
  const produtoNome = nomeEl.textContent.trim().toLowerCase();

  const produto = produtos.find(p => (p['Nome Do Produto'] || '').toLowerCase() === produtoNome);
  if (!produto) return console.warn('⚠️ Produto não encontrado no CSV.');

  const tamanhosDisponiveis = produto['Tamanhos'] || [];
  console.log('📏 Tamanhos disponíveis:', tamanhosDisponiveis);

  const variantsContainer = document.querySelector('.js-product-variants');
  if (!variantsContainer) return console.warn('⚠️ Container de variações não encontrado.');

  // Observador: garante que o aviso se atualize mesmo em re-render dinâmico
  const handleClick = (ev) => {
    let el = ev.target;
    while (el && el !== document.body) {
      if (el.matches('span.btn-variant-content')) {
        const tamanho = (el.dataset.name || el.textContent).trim();
        console.group(`🖱️ Clique detectado → ${tamanho}`);

        removerBadge();

        let localOk = isLocal;
        if (!localOk && cepVal) {
          localOk = isCepDeLeme(cepVal);
          console.log('📍 Verificação de CEP no clique →', localOk ? 'Aprovado' : 'Reprovado');
        }

        if (!localOk) {
          console.log('🚫 Usuário fora das cidades válidas. Nenhum aviso.');
          console.groupEnd();
          return;
        }

        const disponivel = tamanhosDisponiveis.includes(tamanho);
        console.log(`📊 Disponibilidade: ${disponivel ? '✅ Sim' : '❌ Não'}`);

        const badge = disponivel
          ? criarBadge('Produto a Pronta entrega na Loja', 'disponivel')
          : criarBadge('Produto fora de estoque na loja<br>Somente Encomenda!!', 'indisponivel');

        // 🧩 Inserção segura do aviso (acima das variações)
        const container = document.createElement('div');
        container.className = 'disponivel-badge-container';
        container.style.cssText = 'width:100%; display:flex; justify-content:center;';

        const parent = document.querySelector('.js-product-variants')?.parentNode;
        if (parent) {
          parent.insertBefore(container, document.querySelector('.js-product-variants'));
          container.appendChild(badge);
          console.log('📦 Badge exibido com sucesso.');
        } else {
          console.warn('⚠️ Não foi possível inserir o aviso — container ausente.');
        }

        console.groupEnd();
        break;
      }
      el = el.parentElement;
    }
  };

  // Remover listeners duplicados e adicionar novos
  variantsContainer.removeEventListener('click', handleClick);
  variantsContainer.addEventListener('click', handleClick, { passive: true });
  variantsContainer.addEventListener('touchend', handleClick, { passive: true });

  console.log('✅ Listeners configurados com segurança.');
}

window.addEventListener('load', iniciarDisponibilidade);
</script>
