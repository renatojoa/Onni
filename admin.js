// Admin authentication and management

// Hash credentials (change these!)
const ADMIN_CREDENTIALS = {
  username: "ef63d97825c0d5fe735fc3f0254b5de102027381579333528bb5101f0734e024", // hash of "admin"
  password: "09c97767a8412fb6263a8daaedd018c30eea7903c72541f2b70fd6b2b7c150c8", // hash of "secret123"
}

const SESSION_DURATION = 2 * 60 * 60 * 1000 // 2 hours
const MAX_LOGIN_ATTEMPTS = 3
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes

// Products data (same as main site but stored in localStorage)
let adminProducts = []

// Authentication state
let isAuthenticated = false
let currentEditingProduct = null

// SHA-256 hash function
async function generateHash(text) {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

// Password toggle
function togglePassword() {
  const passwordInput = document.getElementById("password")
  const passwordIcon = document.getElementById("password-icon")

  if (passwordInput.type === "password") {
    passwordInput.type = "text"
    passwordIcon.setAttribute("data-lucide", "eye-off")
  } else {
    passwordInput.type = "password"
    passwordIcon.setAttribute("data-lucide", "eye")
  }
  // Assuming lucide is imported or declared elsewhere
  const lucide = window.lucide // Example declaration
  if (lucide && lucide.createIcons) {
    lucide.createIcons()
  }
}

// Check authentication status
function checkAuthentication() {
  const sessionData = localStorage.getItem("admin_session")
  if (sessionData) {
    try {
      const session = JSON.parse(sessionData)
      if (session.authenticated && Date.now() < session.expires) {
        showAdminPanel()
        return
      } else {
        localStorage.removeItem("admin_session")
      }
    } catch (error) {
      localStorage.removeItem("admin_session")
    }
  }
  showLoginForm()
}

// Show login form
function showLoginForm() {
  document.getElementById("login-form").style.display = "flex"
  document.getElementById("admin-panel").style.display = "none"
  isAuthenticated = false

  // Check for lockout
  const lockoutEnd = localStorage.getItem("admin_lockout")
  if (lockoutEnd) {
    const lockoutEndTime = Number.parseInt(lockoutEnd)
    if (Date.now() < lockoutEndTime) {
      const loginBtn = document.getElementById("login-btn")
      const errorDiv = document.getElementById("login-error")

      loginBtn.disabled = true
      loginBtn.textContent = "Bloqueado"

      const remainingTime = Math.ceil((lockoutEndTime - Date.now()) / 1000 / 60)
      errorDiv.textContent = `Muitas tentativas falhadas. Tente novamente em ${remainingTime} minuto${remainingTime !== 1 ? "s" : ""}`
      errorDiv.style.display = "block"

      // Update countdown
      const countdown = setInterval(() => {
        const remaining = Math.ceil((lockoutEndTime - Date.now()) / 1000 / 60)
        if (remaining <= 0) {
          clearInterval(countdown)
          localStorage.removeItem("admin_lockout")
          loginBtn.disabled = false
          loginBtn.textContent = "Entrar"
          errorDiv.style.display = "none"
        } else {
          errorDiv.textContent = `Muitas tentativas falhadas. Tente novamente em ${remaining} minuto${remaining !== 1 ? "s" : ""}`
        }
      }, 1000)

      return
    } else {
      localStorage.removeItem("admin_lockout")
    }
  }
}

// Show admin panel
function showAdminPanel() {
  document.getElementById("login-form").style.display = "none"
  document.getElementById("admin-panel").style.display = "block"
  isAuthenticated = true

  loadProducts()
  updateStatistics()
  renderProducts()
}

// Handle login
async function handleLogin(event) {
  event.preventDefault()

  const username = document.getElementById("username").value
  const password = document.getElementById("password").value
  const errorDiv = document.getElementById("login-error")
  const loginBtn = document.getElementById("login-btn")

  // Check if locked out
  const lockoutEnd = localStorage.getItem("admin_lockout")
  if (lockoutEnd && Date.now() < Number.parseInt(lockoutEnd)) {
    return
  }

  loginBtn.disabled = true
  loginBtn.textContent = "Verificando..."
  errorDiv.style.display = "none"

  try {
    const usernameHash = await generateHash(username.toLowerCase().trim())
    const passwordHash = await generateHash(password)

    if (usernameHash === ADMIN_CREDENTIALS.username && passwordHash === ADMIN_CREDENTIALS.password) {
      // Login successful
      const sessionData = {
        authenticated: true,
        timestamp: Date.now(),
        expires: Date.now() + SESSION_DURATION,
      }

      localStorage.setItem("admin_session", JSON.stringify(sessionData))
      localStorage.removeItem("login_attempts")
      localStorage.removeItem("admin_lockout")

      showAdminPanel()
    } else {
      // Login failed
      const attempts = Number.parseInt(localStorage.getItem("login_attempts") || "0") + 1
      localStorage.setItem("login_attempts", attempts.toString())

      if (attempts >= MAX_LOGIN_ATTEMPTS) {
        const lockoutEnd = Date.now() + LOCKOUT_DURATION
        localStorage.setItem("admin_lockout", lockoutEnd.toString())
        errorDiv.textContent = "Muitas tentativas falhadas. Acesso bloqueado por 15 minutos."
        loginBtn.textContent = "Bloqueado"
        showLoginForm()
        return
      } else {
        errorDiv.textContent = `Credenciais inválidas. Tentativas restantes: ${MAX_LOGIN_ATTEMPTS - attempts}`
      }

      errorDiv.style.display = "block"
    }
  } catch (error) {
    errorDiv.textContent = "Erro interno. Tente novamente."
    errorDiv.style.display = "block"
  }

  if (loginBtn.textContent !== "Bloqueado") {
    loginBtn.disabled = false
    loginBtn.textContent = "Entrar"
  }
}

// Logout
function logout() {
  localStorage.removeItem("admin_session")
  localStorage.removeItem("login_attempts")
  showLoginForm()

  // Clear form
  document.getElementById("username").value = ""
  document.getElementById("password").value = ""
}

// Load products from localStorage
function loadProducts() {
  const saved = localStorage.getItem("admin_products")
  if (saved) {
    try {
      adminProducts = JSON.parse(saved)
    } catch (error) {
      adminProducts = []
    }
  } else {
    // Initialize with some sample products
    adminProducts = [
      {
        id: Date.now().toString(),
        name: "Colar Dourado Elegante",
        price: 89.9,
        image: "https://via.placeholder.com/400x400?text=Colar+Elegante",
        type: "Semijoias",
        category: "Colares",
        color: "Dourado",
        material: "Folheado a Ouro",
        featured: true,
        sales: 156,
        description: "Colar elegante folheado a ouro, perfeito para ocasiões especiais.",
      },
    ]
    saveProducts()
  }
}

// Save products to localStorage
function saveProducts() {
  localStorage.setItem("admin_products", JSON.stringify(adminProducts))
}

// Update statistics
function updateStatistics() {
  const totalProducts = adminProducts.length
  const featuredProducts = adminProducts.filter((p) => p.featured).length
  const totalSales = adminProducts.reduce((sum, p) => sum + (p.sales || 0), 0)
  const totalRevenue = adminProducts.reduce((sum, p) => sum + p.price * (p.sales || 0), 0)

  document.getElementById("total-products").textContent = totalProducts
  document.getElementById("featured-products").textContent = featuredProducts
  document.getElementById("total-sales").textContent = totalSales
  document.getElementById("total-revenue").textContent = `R$ ${totalRevenue.toFixed(2).replace(".", ",")}`
}

// Show add product form
function showAddProduct() {
  currentEditingProduct = null
  document.getElementById("form-title").textContent = "Adicionar Novo Produto"
  document.getElementById("form-icon").setAttribute("data-lucide", "plus")
  document.getElementById("product-form").reset()
  document.getElementById("product-form-section").style.display = "block"
  // Assuming lucide is imported or declared elsewhere
  const lucide = window.lucide // Example declaration
  if (lucide && lucide.createIcons) {
    lucide.createIcons()
  }
}

// Show edit product form
function showEditProduct(productId) {
  const product = adminProducts.find((p) => p.id === productId)
  if (!product) return

  currentEditingProduct = product
  document.getElementById("form-title").textContent = "Editar Produto"
  document.getElementById("form-icon").setAttribute("data-lucide", "edit")

  // Fill form with product data
  document.getElementById("product-name").value = product.name
  document.getElementById("product-price").value = product.price
  document.getElementById("product-description").value = product.description || ""
  document.getElementById("product-type").value = product.type
  document.getElementById("product-category").value = product.category
  document.getElementById("product-color").value = product.color
  document.getElementById("product-material").value = product.material
  document.getElementById("product-image").value = product.image
  document.getElementById("product-featured").checked = product.featured

  document.getElementById("product-form-section").style.display = "block"
  // Assuming lucide is imported or declared elsewhere
  const lucide = window.lucide // Example declaration
  if (lucide && lucide.createIcons) {
    lucide.createIcons()
  }
}

// Cancel form
function cancelForm() {
  document.getElementById("product-form-section").style.display = "none"
  currentEditingProduct = null
}

// Handle form submission
function handleProductForm(event) {
  event.preventDefault()

  const formData = new FormData(event.target)
  const productData = {
    name: formData.get("name"),
    price: Number.parseFloat(formData.get("price")),
    description: formData.get("description"),
    type: formData.get("type"),
    category: formData.get("category"),
    color: formData.get("color"),
    material: formData.get("material"),
    image: formData.get("image") || "https://via.placeholder.com/400x400?text=Produto",
    featured: formData.has("featured"),
  }

  if (currentEditingProduct) {
    // Update existing product
    const index = adminProducts.findIndex((p) => p.id === currentEditingProduct.id)
    if (index !== -1) {
      adminProducts[index] = { ...currentEditingProduct, ...productData }
    }
  } else {
    // Add new product
    const newProduct = {
      id: Date.now().toString(),
      sales: 0,
      ...productData,
    }
    adminProducts.push(newProduct)
  }

  saveProducts()
  updateStatistics()
  renderProducts()
  cancelForm()
}

// Delete product
function deleteProduct(productId) {
  if (confirm("Tem certeza que deseja excluir este produto?")) {
    adminProducts = adminProducts.filter((p) => p.id !== productId)
    saveProducts()
    updateStatistics()
    renderProducts()
  }
}

// Create admin product card HTML
function createAdminProductCard(product) {
  return `
        <div class="admin-product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
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
            </div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">R$ ${product.price.toFixed(2).replace(".", ",")}</p>
            <div class="product-tags">
                <span class="product-tag">${product.category}</span>
                <span class="product-tag">${product.type}</span>
                <span class="product-tag">${product.material}</span>
            </div>
            <div class="product-info">
                <span>Vendas: ${product.sales || 0}</span>
            </div>
            <div class="admin-product-actions">
                <button class="btn btn-outline" onclick="showEditProduct('${product.id}')">
                    <i data-lucide="edit"></i>
                    Editar
                </button>
                <button class="btn" style="background: rgba(239, 68, 68, 0.2); border-color: rgba(239, 68, 68, 0.3); color: #fca5a5;" onclick="deleteProduct('${product.id}')">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        </div>
    `
}

// Render products in admin panel
function renderProducts() {
  const gridContainer = document.getElementById("admin-products-grid")
  const noProducts = document.getElementById("no-products")

  if (!gridContainer || !noProducts) return

  if (adminProducts.length === 0) {
    gridContainer.style.display = "none"
    noProducts.style.display = "block"
  } else {
    gridContainer.style.display = "grid"
    noProducts.style.display = "none"
    gridContainer.innerHTML = adminProducts.map(createAdminProductCard).join("")
    // Assuming lucide is imported or declared elsewhere
    const lucide = window.lucide // Example declaration
    if (lucide && lucide.createIcons) {
      lucide.createIcons()
    }
  }
}

// Initialize admin panel
function initializeAdmin() {
  // Setup login form
  const loginForm = document.getElementById("admin-login-form")
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin)
  }

  // Setup product form
  const productForm = document.getElementById("product-form")
  if (productForm) {
    productForm.addEventListener("submit", handleProductForm)
  }

  // Check authentication status
  checkAuthentication()

  // Session timeout warning
  setInterval(() => {
    const sessionData = localStorage.getItem("admin_session")
    if (sessionData && isAuthenticated) {
      try {
        const session = JSON.parse(sessionData)
        const timeLeft = session.expires - Date.now()

        // Warn when 5 minutes left
        if (timeLeft < 5 * 60 * 1000 && timeLeft > 4 * 60 * 1000) {
          alert("Sua sessão expirará em 5 minutos. Salve seu trabalho!")
        }

        // Auto logout when expired
        if (timeLeft <= 0) {
          alert("Sua sessão expirou. Faça login novamente.")
          logout()
        }
      } catch (error) {
        logout()
      }
    }
  }, 60000) // Check every minute
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeAdmin)
