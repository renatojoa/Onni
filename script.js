// Default product image
const DEFAULT_PRODUCT_IMAGE =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download-japQzoFSzfLJdQBuxq6rFrzntKOXlr.jpeg"

// Video carousel configuration
const videos = [
  "videos/hero-video.mp4",
  "videos/hero-video.mp4", // Usando o mesmo vídeo duas vezes como exemplo
]

let currentVideoIndex = 0

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
let currentPixOrder = null

// Video carousel functions
function initializeVideoCarousel() {
  const video = document.getElementById("main-video")
  const progressDots = document.querySelectorAll(".progress-dot")

  if (!video || !progressDots.length) return

  // Handle video end event
  video.addEventListener("ended", () => {
    nextVideo()
  })

  // Handle progress dot clicks
  progressDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      switchToVideo(index)
    })
  })

  // Start first video
  switchToVideo(0)
}

function switchToVideo(index) {
  const video = document.getElementById("main-video")
  const progressDots = document.querySelectorAll(".progress-dot")

  if (!video || !progressDots.length || index >= videos.length) return

  currentVideoIndex = index

  // Update video source
  video.src = videos[currentVideoIndex]
  video.load()
  video.play().catch(console.error)

  // Update progress indicators
  progressDots.forEach((dot, i) => {
    if (i === currentVideoIndex) {
      dot.classList.add("active")
    } else {
      dot.classList.remove("active")
    }
  })
}

function nextVideo() {
  const nextIndex = (currentVideoIndex + 1) % videos.length
  switchToVideo(nextIndex)
}

// Generate QR Code
function generateQRCode(pixContent) {
  const qrCodeContainer = document.querySelector(".pix-qr-code");
  if (!qrCodeContainer) return;

  // Clear previous content
  qrCodeContainer.innerHTML = "";

  // Create canvas for QR Code
  const canvas = document.createElement("canvas");
  qrCodeContainer.appendChild(canvas);

  // Generate QR Code
  QRCode.toCanvas(canvas, pixContent, {
    width: 200,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  }, (error) => {
    if (error) {
      console.error("Error generating QR Code:", error);
      qrCodeContainer.innerHTML = `
        <div class="qr-placeholder">
          <i data-lucide="qr-code"></i>
          <p>Escaneie com seu app do banco</p>
        </div>
      `;
      lucide.createIcons();
    }
  });
}

// Generate order ID
function generateOrderId() {
  const timestamp = Date.now().toString()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `ON${timestamp.slice(-6)}${random}`
}

// Generate PIX code
function generatePixCode(orderId, amount) {
  const pixKey = "81997979854"
  const merchantName = "ACESSORIOS ONNI"
  const merchantCity = "RECIFE"
  const txId = orderId

  return `00020126580014BR.GOV.BCB.PIX0136${pixKey}0208${txId}5204000053039865802BR5913${merchantName}6005${merchantCity}62070503***6304`
}

// Save order
function saveOrder(orderId, product, type) {
  const order = {
    id: orderId,
    productId: product.id,
    productName: product.name,
    price: product.price,
    timestamp: Date.now(),
    status: "pending",
    pixCode: type === "pix" ? generatePixCode(orderId, product.price) : "",
  }

  const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]")
  existingOrders.push(order)
  localStorage.setItem("orders", JSON.stringify(existingOrders))

  return order
}

// WhatsApp function
function openWhatsApp(product) {
  const orderId = generateOrderId()
  saveOrder(orderId, product, "whatsapp")

  const message = `Olá! Tenho interesse no produto: ${product.name} - R$ ${product.price.toFixed(2).replace(".", ",")} (Pedido: ${orderId})`
  const whatsappUrl = `https://wa.me/5581997979854?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, "_blank")
}

// PIX function
// PIX function
function openPixModal(product) {
  const orderId = generateOrderId();
  const order = saveOrder(orderId, product, "pix");
  currentPixOrder = order;

  // Update modal content
  document.getElementById("pix-product-name").textContent = product.name;
  document.getElementById("pix-product-price").textContent = `R$ ${product.price.toFixed(2).replace(".", ",")}`;
  document.getElementById("pix-order-id").textContent = `Pedido: ${orderId}`;
  document.getElementById("pix-code").textContent = order.pixCode;

  // Show modal
  document.getElementById("pix-modal").style.display = "flex";

  // Generate QR Code
  generateQRCode(order.pixCode);
}

// Close PIX modal
function closePixModal() {
  document.getElementById("pix-modal").style.display = "none"
  currentPixOrder = null
}

// Copy PIX code
function copyPixCode() {
  const pixCode = document.getElementById("pix-code").textContent
  navigator.clipboard.writeText(pixCode).then(() => {
    const button = event.target.closest("button")
    const originalText = button.innerHTML
    button.innerHTML = '<i data-lucide="check"></i> Copiado!'

    setTimeout(() => {
      button.innerHTML = originalText
      lucide.createIcons()
    }, 2000)

    lucide.createIcons()
  })
}

// Send PIX receipt
function sendPixReceipt() {
  if (!currentPixOrder) return

  const message = `Olá! Realizei o pagamento PIX do pedido ${currentPixOrder.id} - ${currentPixOrder.productName}. Segue o comprovante:`
  const whatsappUrl = `https://wa.me/5581997979854?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, "_blank")
}

// Load products from localStorage (shared with admin)
function loadProductsFromStorage() {
  const saved = localStorage.getItem("admin_products")
  if (saved) {
    try {
      const adminProducts = JSON.parse(saved)
      Object.assign(products, adminProducts)
      products.length = adminProducts.length
      return adminProducts
    } catch (error) {
      console.error("Error loading products:", error)
    }
  }
  return products
}

// Show/hide category sections based on available products
function updateCategorySections() {
  const joias = products.filter((p) => p.type === "Joias")
  const semijoias = products.filter((p) => p.type === "Semijoias")
  const bijuterias = products.filter((p) => p.type === "Bijuterias")

  // Show/hide sections based on product availability
  const joiasSection = document.getElementById("joias-section")
  const semijoisasSection = document.getElementById("semijoias-section")
  const bijuteriasSection = document.getElementById("bijuterias-section")
  const noProductsCategories = document.getElementById("no-products-categories")

  if (joiasSection) {
    joiasSection.style.display = joias.length > 0 ? "block" : "none"
  }
  if (semijoisasSection) {
    semijoisasSection.style.display = semijoias.length > 0 ? "block" : "none"
  }
  if (bijuteriasSection) {
    bijuteriasSection.style.display = bijuterias.length > 0 ? "block" : "none"
  }

  // Show no products message if no categories have products
  if (noProductsCategories) {
    const hasAnyProducts = joias.length > 0 || semijoias.length > 0 || bijuterias.length > 0
    noProductsCategories.style.display = hasAnyProducts ? "none" : "block"
  }
}

// Show/hide products section based on available products
function updateProductsSection() {
  const filtersSection = document.getElementById("filters-section")
  const productsGrid = document.getElementById("products-grid")
  const noProductsMain = document.getElementById("no-products-main")

  if (products.length > 0) {
    if (filtersSection) filtersSection.style.display = "block"
    if (productsGrid) productsGrid.style.display = "grid"
    if (noProductsMain) noProductsMain.style.display = "none"
  } else {
    if (filtersSection) filtersSection.style.display = "none"
    if (productsGrid) productsGrid.style.display = "none"
    if (noProductsMain) noProductsMain.style.display = "block"
  }
}

// Sync products periodically
function startProductSync() {
  setInterval(() => {
    const loadedProducts = loadProductsFromStorage()
    if (loadedProducts.length !== products.length) {
      Object.assign(products, loadedProducts)
      products.length = loadedProducts.length
      filteredProducts = [...products]

      // Update category sections visibility
      updateCategorySections()
      updateProductsSection()

      // Re-setup carousels only for categories with products
      const joias = products.filter((p) => p.type === "Joias")
      const semijoias = products.filter((p) => p.type === "Semijoias")
      const bijuterias = products.filter((p) => p.type === "Bijuterias")

      if (joias.length > 0) {
        setupCarousel("joias-carousel", "joias-prev", "joias-next", joias)
      }
      if (semijoias.length > 0) {
        setupCarousel("semijoias-carousel", "semijoias-prev", "semijoias-next", semijoias)
      }
      if (bijuterias.length > 0) {
        setupCarousel("bijuterias-carousel", "bijuterias-prev", "bijuterias-next", bijuterias)
      }

      renderProducts()
    }
  }, 3000)
}

// Create product card HTML with PIX and WhatsApp buttons
function createProductCard(product) {
  const productImage = product.image || DEFAULT_PRODUCT_IMAGE

  return `
    <div class="product-card">
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
      <div class="product-buttons">
        <button class="product-btn btn-pix" onclick="openPixModal(${JSON.stringify(product).replace(/"/g, "&quot;")})">
          <i data-lucide="qr-code"></i>
          Pagar com PIX
        </button>
        <button class="product-btn btn-whatsapp" onclick="openWhatsApp(${JSON.stringify(product).replace(/"/g, "&quot;")})">
          <i data-lucide="message-circle"></i>
          Falar no WhatsApp
        </button>
      </div>
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

  if (filteredProducts.length === 0 && products.length > 0) {
    gridContainer.style.display = "none"
    noResults.style.display = "block"
  } else if (products.length > 0) {
    gridContainer.style.display = "grid"
    noResults.style.display = "none"
    gridContainer.innerHTML = filteredProducts.map(createProductCard).join("")
  }
}

// Initialize page
function initializePage() {
  const loadedProducts = loadProductsFromStorage()
  if (loadedProducts && loadedProducts.length > 0) {
    Object.assign(products, loadedProducts)
    products.length = loadedProducts.length
    filteredProducts = [...products]
  }

  // Initialize video carousel
  initializeVideoCarousel()

  // Update sections visibility based on available products
  updateCategorySections()
  updateProductsSection()

  // Setup carousels only for categories with products
  const joias = products.filter((p) => p.type === "Joias")
  const semijoias = products.filter((p) => p.type === "Semijoias")
  const bijuterias = products.filter((p) => p.type === "Bijuterias")

  if (joias.length > 0) {
    setupCarousel("joias-carousel", "joias-prev", "joias-next", joias)
  }
  if (semijoias.length > 0) {
    setupCarousel("semijoias-carousel", "semijoias-prev", "semijoias-next", semijoias)
  }
  if (bijuterias.length > 0) {
    setupCarousel("bijuterias-carousel", "bijuterias-prev", "bijuterias-next", bijuterias)
  }

  startProductSync()

  const searchInput = document.getElementById("search-input")
  const typeFilter = document.getElementById("type-filter")
  const categoryFilter = document.getElementById("category-filter")
  const colorFilter = document.getElementById("color-filter")

  searchInput?.addEventListener("input", filterProducts)
  typeFilter?.addEventListener("change", filterProducts)
  categoryFilter?.addEventListener("change", filterProducts)
  colorFilter?.addEventListener("change", filterProducts)

  renderProducts()

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

  // Close modal when clicking outside
  document.getElementById("pix-modal")?.addEventListener("click", (e) => {
    if (e.target.id === "pix-modal") {
      closePixModal()
    }
  })

  window.addEventListener("storage", (e) => {
    if (e.key === "admin_products") {
      setTimeout(() => {
        location.reload()
      }, 1000)
    }
  })
}

document.addEventListener("DOMContentLoaded", initializePage)

const lucide = {
  createIcons: () => {
    console.log("Lucide icons created")
  },
}
