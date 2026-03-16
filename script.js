const WHATSAPP_NUMBER = "2385888880";
const SALES_PAGE = "./planos.html";

const products = [
  {
    id: 1,
    name: "Redmi Turbo 3 (12GB + 256GB)",
    category: "smartphones",
    price: 52900,
    badge: "Performance",
    description: "Smartphone focado em velocidade, multitarefa e jogos com ótima fluidez no dia a dia.",
    image: "./assets/products/Redmi Turbo 3 (12GB + 256GB).webp",
  },
  {
    id: 2,
    name: "Motorola Razr 60",
    category: "smartphones",
    price: 129900,
    badge: "Premium",
    description: "Modelo dobrável com design moderno, tela externa útil e experiência premium.",
    image: "./assets/products/Motorola Razr 60.webp",
  },
  {
    id: 3,
    name: "Redmi Note 13",
    category: "smartphones",
    price: 33900,
    badge: "Equilíbrio",
    description: "Boa opção para uso diário, com bateria durável e bom desempenho geral.",
    image: "./assets/products/Redmi Note 13.webp",
  },
  {
    id: 4,
    name: "Realme V60S",
    category: "smartphones",
    price: 28900,
    badge: "Custo-benefício",
    description: "Modelo acessível para quem busca conectividade e desempenho estável.",
    image: "./assets/products/Realme V60S.webp",
  },
  {
    id: 5,
    name: "Redmi Note 12 5G",
    category: "smartphones",
    price: 30900,
    badge: "5G",
    description: "Conectividade 5G com tela fluida e ótima autonomia para rotina intensa.",
    image: "./assets/products/Redmi Note 12 5G.webp",
  },
  {
    id: 6,
    name: "Redmi 13C",
    category: "smartphones",
    price: 21900,
    badge: "Entrada",
    description: "Opção de entrada confiável para uso diário, estudos e redes sociais.",
    image: "./assets/products/Redmi 13C.webp",
  },
  {
    id: 7,
    name: "TV SAST 32 Polegadas",
    category: "tv-home",
    price: 28900,
    badge: "Casa",
    description: "Televisor compacto para sala ou quarto, com imagem clara e uso prático.",
    image: "./assets/products/TV SAST 32 Polegadas.webp",
  },
  {
    id: 8,
    name: "M02 Gimbal",
    category: "acessorios",
    price: 13900,
    badge: "Criadores",
    description: "Estabilizador para vídeos mais suaves em gravações com smartphone.",
    image: "./assets/products/M02 Gimbal.webp",
  },
  {
    id: 9,
    name: "Impressora Canon Pixma G3411",
    category: "informatica",
    price: 35900,
    badge: "Escritório",
    description: "Multifuncional com tanque de tinta, ideal para casa e pequenos negócios.",
    image: "./assets/products/Impressora Canon Pixma G3411.webp",
  },
  {
    id: 10,
    name: "Lenovo Laptop 82H2",
    category: "informatica",
    price: 74900,
    badge: "Produtividade",
    description: "Notebook para trabalho e estudo com bom desempenho e portabilidade.",
    image: "./assets/products/Lenovo Laptop 82H2.webp",
  },
  {
    id: 11,
    name: "Lenovo Legion R7000 AHP9",
    category: "informatica",
    price: 169900,
    badge: "Gamer",
    description: "Notebook de alta performance para gaming, edição e tarefas pesadas.",
    image: "./assets/products/Lenovo Legion R7000 AHP9.webp",
  },
];

const categoryMeta = {
  all: { label: "Todos", description: "Todos os produtos" },
  smartphones: { label: "Smartphones", description: "Modelos de entrada a premium" },
  informatica: { label: "Informática", description: "Laptops e impressão" },
  "tv-home": { label: "TV & Casa", description: "Entretenimento e utilidades" },
  acessorios: { label: "Acessórios", description: "Criação e conectividade" },
};

let currentCategory = "all";
let currentSort = "featured";
let currentSearch = "";

const el = {
  year: document.getElementById("year"),
  productsGrid: document.getElementById("productsGrid"),
  filterButtons: document.getElementById("filterButtons"),
  categoryGrid: document.getElementById("categoryGrid"),
  searchInput: document.getElementById("searchInput"),
  sortSelect: document.getElementById("sortSelect"),
  resultLine: document.getElementById("resultLine"),
  statProducts: document.getElementById("statProducts"),
  productModal: document.getElementById("productModal"),
  modalContent: document.getElementById("modalContent"),
  waTop: document.getElementById("waTop"),
  waBottom: document.getElementById("waBottom"),
  waFloat: document.getElementById("waFloat"),
  waHighlight: document.getElementById("waHighlight"),
};

function formatCVE(value) {
  const number = new Intl.NumberFormat("pt-CV", { maximumFractionDigits: 0 }).format(value);
  return `${number} ECV`;
}

function buildWhatsAppLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function baseWhatsAppMessage() {
  return "Olá Lucas Digital! Quero informações sobre os produtos disponíveis em São Vicente (Mindelo).";
}

function renderCategories() {
  const counts = products.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  const cards = ["smartphones", "informatica", "tv-home", "acessorios"]
    .map(
      (key) => `
    <article class="category-card">
      <h3>${categoryMeta[key].label}</h3>
      <p class="category-meta">${counts[key] || 0} produtos • ${categoryMeta[key].description}</p>
    </article>
  `
    )
    .join("");

  el.categoryGrid.innerHTML = cards;
}

function renderFilterButtons() {
  const keys = ["all", "smartphones", "informatica", "tv-home", "acessorios"];
  el.filterButtons.innerHTML = keys
    .map(
      (key) => `
    <button class="filter-btn ${currentCategory === key ? "active" : ""}" data-category="${key}">${categoryMeta[key].label}</button>
  `
    )
    .join("");

  el.filterButtons.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentCategory = btn.dataset.category;
      renderFilterButtons();
      renderProducts();
    });
  });
}

function getFilteredProducts() {
  let list = products.filter((item) => {
    const categoryMatch = currentCategory === "all" || item.category === currentCategory;
    const searchMatch =
      item.name.toLowerCase().includes(currentSearch) || item.description.toLowerCase().includes(currentSearch);
    return categoryMatch && searchMatch;
  });

  if (currentSort === "price-asc") list = list.sort((a, b) => a.price - b.price);
  if (currentSort === "price-desc") list = list.sort((a, b) => b.price - a.price);
  if (currentSort === "name-asc") list = list.sort((a, b) => a.name.localeCompare(b.name, "pt"));

  return list;
}

function renderProducts() {
  const list = getFilteredProducts();
  el.resultLine.textContent = `${list.length} produto(s) encontrado(s).`;

  if (!list.length) {
    el.productsGrid.innerHTML = `
      <article class="product-card"><p>Nenhum item encontrado. Tente outro termo ou filtro.</p></article>
    `;
    return;
  }

  el.productsGrid.innerHTML = list
    .map(
      (item) => `
    <article class="product-card">
      <div class="product-thumb">
        <img class="product-image" src="${item.image}" alt="${item.name}" loading="lazy" decoding="async" />
        <span class="product-badge">${item.badge}</span>
      </div>
      <div class="product-name">${item.name}</div>
      <div class="product-meta">${categoryMeta[item.category].label}</div>
      <div class="product-price">${formatCVE(item.price)}</div>
      <div class="product-actions">
        <button class="btn-light" data-view="${item.id}">Ver detalhes</button>
        <a class="btn btn-solid" href="${SALES_PAGE}">Ver planos do marketplace</a>
      </div>
    </article>
  `
    )
    .join("");

  el.productsGrid.querySelectorAll("[data-view]").forEach((btn) => {
    btn.addEventListener("click", () => openModal(Number(btn.dataset.view)));
  });
}

function openModal(id) {
  const item = products.find((p) => p.id === id);
  if (!item) return;

  el.modalContent.innerHTML = `
    <div class="modal-grid">
      <div class="modal-image-wrap">
        <img class="modal-image" src="${item.image}" alt="${item.name}" loading="lazy" decoding="async" />
      </div>
      <h3>${item.name}</h3>
      <p class="muted">${categoryMeta[item.category].label}</p>
      <p>${item.description}</p>
      <div class="modal-price">${formatCVE(item.price)}</div>
      <a class="btn btn-solid" href="${SALES_PAGE}">Ver planos do marketplace</a>
    </div>
  `;

  el.productModal.showModal();
}

function setupWhatsAppLinks() {
  const base = buildWhatsAppLink(baseWhatsAppMessage());
  el.waTop.href = base;
  el.waBottom.href = base;
  el.waHighlight.href = buildWhatsAppLink("Olá Lucas Digital! Quero mais detalhes do Lenovo Legion R7000 AHP9 (169.900 ECV).");
  el.waFloat.addEventListener("click", () => window.open(base, "_blank", "noopener"));
}

function init() {
  el.year.textContent = new Date().getFullYear();
  el.statProducts.textContent = products.length;

  renderCategories();
  renderFilterButtons();
  renderProducts();
  setupWhatsAppLinks();

  el.searchInput.addEventListener("input", (e) => {
    currentSearch = e.target.value.trim().toLowerCase();
    renderProducts();
  });

  el.sortSelect.addEventListener("change", (e) => {
    currentSort = e.target.value;
    renderProducts();
  });
}

init();







