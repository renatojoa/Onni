// Mock product data
const products = [
  // Joias
  {
    id: "1",
    name: "Anel Ouro 18k Solitário",
    price: 1299.9,
    image: "https://via.placeholder.com/400x400/d97706/ffffff?text=Anel+Ouro+18k",
    category: "Anéis",
    type: "Joias",
    color: "Dourado",
    occasion: "Noivado",
    size: "Variados",
    material: "Ouro 18k",
    featured: true,
    sales: 45,
  },
  {
    id: "2",
    name: "Colar Ouro Branco Diamante",
    price: 2199.9,
    image: "https://via.placeholder.com/400x400/78716c/ffffff?text=Colar+Diamante",
    category: "Colares",
    type: "Joias",
    color: "Branco",
    occasion: "Festa",
    size: "Médio",
    material: "Ouro Branco 18k",
    featured: true,
    sales: 23,
  },
  {
    id: "3",
    name: "Brincos Ouro Pérola Natural",
    price: 899.9,
    image: "https://via.placeholder.com/400x400/d97706/ffffff?text=Brincos+Pérola",
    category: "Brincos",
    type: "Joias",
    color: "Dourado",
    occasion: "Casamento",
    size: "Médio",
    material: "Ouro 18k + Pérola",
    featured: false,
    sales: 67,
  },
  // Semijoias
  {
    id: "4",
    name: "Colar Folheado Cristal",
    price: 189.9,
    image: "https://via.placeholder.com/400x400/c2410c/ffffff?text=Colar+Semijoia",
    category: "Colares",
    type: "Semijoias",
    color: "Dourado",
    occasion: "Festa",
    size: "Médio",
    material: "Folheado a Ouro",
    featured: true,
    sales: 156,
  },
  {
    id: "5",
    name: "Brincos Prata 925 Zircônia",
    price: 129.9,
    image: "https://via.placeholder.com/400x400/78716c/ffffff?text=Brincos+Prata",
    category: "Brincos",
    type: "Semijoias",
    color: "Prata",
    occasion: "Casual",
    size: "Pequeno",
    material: "Prata 925",
    featured: true,
    sales: 203,
  },
  {
    id: "6",
    name: "Pulseira Folheada Elegante",
    price: 149.9,
    image: "https://via.placeholder.com/400x400/d97706/ffffff?text=Pulseira+Elegante",
    category: "Pulseiras",
    type: "Semijoias",
    color: "Dourado",
    occasion: "Festa",
    size: "Ajustável",
    material: "Folheado a Ouro",
    featured: false,
    sales: 89,
  },
  // Bijuterias
  {
    id: "7",
    name: "Conjunto Festa Dourado",
    price: 79.9,
    image: "https://via.placeholder.com/400x400/c2410c/ffffff?text=Conjunto+Bijuteria",
    category: "Conjuntos",
    type: "Bijuterias",
    color: "Dourado",
    occasion: "Festa",
    size: "Único",
    material: "Liga Metálica",
    featured: true,
    sales: 134,
  },
  {
    id: "8",
    name: "Choker Minimalista",
    price: 39.9,
    image: "https://via.placeholder.com/400x400/78716c/ffffff?text=Choker+Minimalista",
    category: "Colares",
    type: "Bijuterias",
    color: "Dourado",
    occasion: "Casual",
    size: "Ajustável",
    material: "Aço Inoxidável",
    featured: false,
    sales: 167,
  },
  {
    id: "9",
    name: "Brincos Cristais Coloridos",
    price: 49.9,
    image: "https://via.placeholder.com/400x400/d97706/ffffff?text=Brincos+Coloridos",
    category: "Brincos",
    type: "Bijuterias",
    color: "Multicolor",
    occasion: "Festa",
    size: "Médio",
    material: "Cristal Sintético",
    featured: false,
    sales: 98,
  },
]

// Carousel state
const carouselState = {
  joias: { currentIndex: 0, itemsPerView: 4 },
  semijoias: { currentIndex: 0, itemsPerView: 4 },
  bijuterias: { currentIndex: 0, itemsPerView: 4 },
}

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  initializeCarousels()
  initializeFilters()
  renderAllProducts()
})

// Initialize carousels
function initializeCarousels() {
  const joias = products.filter((p) => p.type === "Joias")
  const semijoias = products.filter((p) => p.type === "Semijoias")
  const bijuterias = products.filter((p) => p.type === "Bijuterias")

  renderCarousel("joias", joias)
  renderCarousel("semijoias", semijoias)
  renderCarousel("bijuterias", bijuterias)
}

// Render carousel
function renderCarousel(type, products) {
  const container = document.getElementById(`${type}-products`)
  if (!container) return

  const state = carouselState[type]
  const visibleProducts = products.slice(state.currentIndex, state.currentIndex + state.itemsPerView)

  container.innerHTML = visibleProducts.map((product) => createProductCard(product)).join("")

  // Update carousel controls
  updateCarouselControls(type, products.length)
}

// Update carousel controls
function updateCarouselControls(type, totalProducts) {
  const state = carouselState[type]
  const prevBtn = document.querySelector(`[onclick="prevSlide('${type}')"]`)
  const nextBtn = document.querySelector(`[onclick="nextSlide('${type}')"]`)

  if (prevBtn) prevBtn.disabled = state.currentIndex === 0
  if (nextBtn) nextBtn.disabled = state.currentIndex + state.itemsPerView >= totalProducts
}

// Carousel navigation
function nextSlide(type) {
  const typeProducts = products.filter((p) => p.type.toLowerCase() === type.toLowerCase())
  const state = carouselState[type]

  if (state.currentIndex + state.itemsPerView < typeProducts.length) {
    state.currentIndex += state.itemsPerView
    renderCarousel(type, typeProducts)
  }
}

function prevSlide(type) {
  const typeProducts = products.filter((p) => p.type.toLowerCase() === type.toLowerCase())
  const state = carouselState[type]

  if (state.currentIndex > 0) {
    state.currentIndex = Math.max(0, state.currentIndex - state.itemsPerView)
    renderCarousel(type, typeProducts)
  }
}

// Create product card HTML
function createProductCard(product) {
  return `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${product.featured ? '<div class="product-badge"><i class="fas fa-crown"></i> Destaque</div>' : ""}
                <div class="product-type-badge">${product.type}</div>
            </div>
            <h4 class="product-name">${product.name}</h4>
            <p class="product-price">R$ ${product.price.toFixed(2).replace(".", ",")}</p>
            <div class="product-tags">
                <span class="product-tag">${product.material}</span>
                <span class="product-tag">${product.size}</span>
            </div>
            <button class="product-buy-btn" onclick="buyProduct('${product.id}')">
                <i class="fab fa-whatsapp"></i>
                Desejo Comprar
            </button>
        </div>
    `
}

// Initialize filters
function initializeFilters() {
  const searchInput = document.getElementById("search-input")
  const typeFilter = document.getElementById("type-filter")
  const categoryFilter = document.getElementById("category-filter")
  const colorFilter = document.getElementById("color-filter")

  if (searchInput) searchInput.addEventListener("input", filterProducts)
  if (typeFilter) typeFilter.addEventListener("change", filterProducts)
  if (categoryFilter) categoryFilter.addEventListener("change", filterProducts)
  if (colorFilter) colorFilter.addEventListener("change", filterProducts)
}

// Filter products
function filterProducts() {
  const searchTerm = document.getElementById("search-input")?.value.toLowerCase() || ""
  const typeFilter = document.getElementById("type-filter")?.value || "all"
  const categoryFilter = document.getElementById("category-filter")?.value || "all"
  const colorFilter = document.getElementById("color-filter")?.value || "all"

  const filtered = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.type.toLowerCase().includes(searchTerm)

    const matchesType = typeFilter === "all" || product.type === typeFilter
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    const matchesColor = colorFilter === "all" || product.color === colorFilter

    return matchesSearch && matchesType && matchesCategory && matchesColor
  })

  renderFilteredProducts(filtered)
}

// Render all products
function renderAllProducts() {
  renderFilteredProducts(products)
}

// Render filtered products
function renderFilteredProducts(filteredProducts) {
  const container = document.getElementById("all-products")
  const noProducts = document.getElementById("no-products")

  if (!container || !noProducts) return

  if (filteredProducts.length === 0) {
    container.style.display = "none"
    noProducts.style.display = "block"
  } else {
    container.style.display = "grid"
    noProducts.style.display = "none"
    container.innerHTML = filteredProducts.map((product) => createProductCard(product)).join("")
  }
}

// Buy product (WhatsApp integration)
function buyProduct(productId) {
  const product = products.find((p) => p.id === productId)
  if (!product) return

  const message = `Olá! Tenho interesse no produto: ${product.name} - R$ ${product.price.toFixed(2).replace(".", ",")}`
  const whatsappUrl = `https://wa.me/5581979798540?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, "_blank")
}

// Open Instagram
function openInstagram() {
  window.open("https://www.instagram.com/onniacessorios/", "_blank")
}

// Open WhatsApp
function openWhatsApp() {
  const message = "Olá! Gostaria de saber mais sobre os produtos da Acessórios Onni."
  const whatsappUrl = `https://wa.me/5581979798540?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, "_blank")
}

// Smooth scrolling for navigation links
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault()
    const targetId = this.getAttribute("href")
    const targetSection = document.querySelector(targetId)

    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })

      // Update active nav link
      document.querySelectorAll(".nav-link").forEach((l) => l.classList.remove("active"))
      this.classList.add("active")
    }
  })
})

// Update active nav link on scroll
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section[id]")
  const navLinks = document.querySelectorAll(".nav-link")

  let current = ""
  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.clientHeight
    if (window.pageYOffset >= sectionTop - 200) {
      current = section.getAttribute("id")
    }
  })

  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active")
    }
  })
})

// Responsive carousel adjustment
function adjustCarouselForScreen() {
  const screenWidth = window.innerWidth
  let itemsPerView = 4

  if (screenWidth < 768) {
    itemsPerView = 1
  } else if (screenWidth < 1024) {
    itemsPerView = 2
  }

  // Update all carousel states
  Object.keys(carouselState).forEach((type) => {
    carouselState[type].itemsPerView = itemsPerView
    carouselState[type].currentIndex = 0 // Reset to beginning
  })

  // Re-render carousels
  initializeCarousels()
}

// Listen for window resize
window.addEventListener("resize", adjustCarouselForScreen)

// Initialize responsive carousel on load
adjustCarouselForScreen()
