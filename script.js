// Default product image
const DEFAULT_PRODUCT_IMAGE =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download-japQzoFSzfLJdQBuxq6rFrzntKOXlr.jpeg"

// Products data with updated images
const products = [
  // Joias
  {
    id: "1",
    name: "Anel Ouro 18k Solitário",
    price: 1299.9,
    image: DEFAULT_PRODUCT_IMAGE,
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
    image: DEFAULT_PRODUCT_IMAGE,
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
    image: DEFAULT_PRODUCT_IMAGE,
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
    image: DEFAULT_PRODUCT_IMAGE,
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
    image: DEFAULT_PRODUCT_IMAGE,
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
    image: DEFAULT_PRODUCT_IMAGE,
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
    image: DEFAULT_PRODUCT_IMAGE,
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
    image: DEFAULT_PRODUCT_IMAGE,
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
    image: DEFAULT_PRODUCT_IMAGE,
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

// Filter state
let filteredProducts = [...products]

// WhatsApp function
function openWhatsApp(product) {
  const message = `Olá! Tenho interesse no produto: ${product.name} - R$ ${product.price.toFixed(2).replace(".", ",")}`
  const whatsappUrl = `https://wa.me/5581979798540?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, "_blank")
}

// Load products from localStorage (shared with admin)
function loadProductsFromStorage() {
  const saved = localStorage.getItem("admin_products")
  if (saved) {
    try {
      const adminProducts = JSON.parse(saved)
      // Update global products array
      Object.assign(products, adminProducts)
      products.length = adminProducts.length
      return adminProducts
    } catch (error) {
      console.error("Error loading products:", error)
    }
  }
  return products
}

// Sync products periodically
function startProductSync() {
  setInterval(() => {
    const loadedProducts = loadProductsFromStorage()
    if (loadedProducts.length !== products.length) {
      // Re-initialize page with new products
      Object.assign(products, loadedProducts)
      products.length = loadedProducts.length
      filteredProducts = [...products]

      // Re-setup carousels
      const joias = products.filter((p) => p.type === "Joias")
      const semijoias = products.filter((p) => p.type === "Semijoias")
      const bijuterias = products.filter((p) => p.type === "Bijuterias")

      setupCarousel("joias-carousel", "joias-prev", "joias-next", joias)
      setupCarousel("semijoias-carousel", "semijoias-prev", "semijoias-next", semijoias)
      setupCarousel("bijuterias-carousel", "bijuterias-prev", "bijuterias-next", bijuterias)

      // Re-render products
      renderProducts()
    }
  }, 3000) // Check every 3 seconds
}

// Video controls
function setupVideoControls() {
  const video = document.getElementById("hero-video")
  const playBtn = document.getElementById("video-play-btn")
  const playIcon = document.getElementById("video-play-icon")
  const playText = document.getElementById("video-play-text")

  if (!video || !playBtn) return

  playBtn.addEventListener("click", () => {
    if (video.paused) {
      video.play()
      playIcon.setAttribute("data-lucide", "pause")
      playText.textContent = "Pausar"
    } else {
      video.pause()
      playIcon.setAttribute("data-lucide", "play")
      playText.textContent = "Reproduzir"
    }

    // Refresh icons
    if (typeof lucide !== "undefined" && lucide.createIcons) {
      lucide.createIcons()
    }
  })

  // Update button state based on video events
  video.addEventListener("play", () => {
    playIcon.setAttribute("data-lucide", "pause")
    playText.textContent = "Pausar"
    if (typeof lucide !== "undefined" && lucide.createIcons) {
      lucide.createIcons()
    }
  })

  video.addEventListener("pause", () => {
    playIcon.setAttribute("data-lucide", "play")
    playText.textContent = "Reproduzir"
    if (typeof lucide !== "undefined" && lucide.createIcons) {
      lucide.createIcons()
    }
  })
}

// Create product card HTML with improved image handling
function createProductCard(product) {
  const productImage = product.image || DEFAULT_PRODUCT_IMAGE

  return `
        <div class="product-card" onclick="openWhatsApp(${JSON.stringify(product).replace(/"/g, "&quot;")})">
            <div class="product-image">
                <img src="${productImage}" alt="${product.name}" loading="lazy" onerror="this.src='${DEFAULT_PRODUCT_IMAGE}'">
                ${
                  product.featured
                    ? `
                    <div class="product-badge">
                        <i data-lucide="crown"></i>
                        Destaque
                    </div>
                `
                    : ""
                }
                <div class="product-type-badge">${product.type}</div>
            </div>
            <h4 class="product-name">${product.name}</h4>
            <p class="product-price">R$ ${product.price.toFixed(2).replace(".", ",")}</p>
            <div class="product-tags">
                <span class="product-tag">${product.material}</span>
                <span class="product-tag">${product.size}</span>
            </div>
            <button class="product-btn">
                <i data-lucide="message-circle"></i>
                Desejo Comprar
            </button>
        </div>
    `
}

// Populate carousel
function populateCarousel(containerId, products) {
  const container = document.getElementById(containerId)
  if (!container) return

  container.innerHTML = products.map(createProductCard).join("")
}

// Carousel functionality
function setupCarousel(carouselId, prevBtnId, nextBtnId, products) {
  const prevBtn = document.getElementById(prevBtnId)
  const nextBtn = document.getElementById(nextBtnId)
  let currentIndex = 0
  const itemsPerView = 4

  function updateCarousel() {
    const visibleProducts = products.slice(currentIndex, currentIndex + itemsPerView)
    populateCarousel(carouselId, visibleProducts)

    // Update button states
    prevBtn.disabled = currentIndex === 0
    nextBtn.disabled = currentIndex + itemsPerView >= products.length
  }

  prevBtn?.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex = Math.max(0, currentIndex - itemsPerView)
      updateCarousel()
    }
  })

  nextBtn?.addEventListener("click", () => {
    if (currentIndex + itemsPerView < products.length) {
      currentIndex = Math.min(products.length - itemsPerView, currentIndex + itemsPerView)
      updateCarousel()
    }
  })

  // Initial load
  updateCarousel()
}

// Filter products
function filterProducts() {
  const searchTerm = document.getElementById("search-input")?.value.toLowerCase() || ""
  const typeFilter = document.getElementById("type-filter")?.value || "all"
  const categoryFilter = document.getElementById("category-filter")?.value || "all"
  const colorFilter = document.getElementById("color-filter")?.value || "all"

  filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.type.toLowerCase().includes(searchTerm)

    const matchesType = typeFilter === "all" || product.type === typeFilter
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    const matchesColor = colorFilter === "all" || product.color === colorFilter

    return matchesSearch && matchesType && matchesCategory && matchesColor
  })

  renderProducts()
}

// Render filtered products
function renderProducts() {
  const gridContainer = document.getElementById("products-grid")
  const noResults = document.getElementById("no-results")

  if (!gridContainer || !noResults) return

  if (filteredProducts.length === 0) {
    gridContainer.style.display = "none"
    noResults.style.display = "block"
  } else {
    gridContainer.style.display = "grid"
    noResults.style.display = "none"
    gridContainer.innerHTML = filteredProducts.map(createProductCard).join("")
  }
}

// Initialize page
function initializePage() {
  // Load products from localStorage first
  const loadedProducts = loadProductsFromStorage()
  if (loadedProducts && loadedProducts.length > 0) {
    Object.assign(products, loadedProducts)
    products.length = loadedProducts.length
    filteredProducts = [...products]
  }

  // Setup carousels
  const joias = products.filter((p) => p.type === "Joias")
  const semijoias = products.filter((p) => p.type === "Semijoias")
  const bijuterias = products.filter((p) => p.type === "Bijuterias")

  setupCarousel("joias-carousel", "joias-prev", "joias-next", joias)
  setupCarousel("semijoias-carousel", "semijoias-prev", "semijoias-next", semijoias)
  setupCarousel("bijuterias-carousel", "bijuterias-prev", "bijuterias-next", bijuterias)

  // Setup video controls
  setupVideoControls()

  // Start product synchronization
  startProductSync()

  // Setup filters
  const searchInput = document.getElementById("search-input")
  const typeFilter = document.getElementById("type-filter")
  const categoryFilter = document.getElementById("category-filter")
  const colorFilter = document.getElementById("color-filter")

  searchInput?.addEventListener("input", filterProducts)
  typeFilter?.addEventListener("change", filterProducts)
  categoryFilter?.addEventListener("change", filterProducts)
  colorFilter?.addEventListener("change", filterProducts)

  // Initial render
  renderProducts()

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Listen for storage changes (when admin updates products)
  window.addEventListener("storage", (e) => {
    if (e.key === "admin_products") {
      setTimeout(() => {
        location.reload() // Reload page to show new products
      }, 1000)
    }
  })
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initializePage)

// Declare lucide variable
const lucide = {
  createIcons: () => {
    // Placeholder for lucide.createIcons functionality
    console.log("Lucide icons created")
  },
}
