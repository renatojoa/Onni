// Admin credentials (SHA-256 hashes)
const ADMIN_CREDENTIALS = {
  // Example: username "admin" and password "secret123" (CHANGE THESE!)
  username: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918", // hash of "admin"
  password: "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f", // hash of "secret123"
}

const SESSION_DURATION = 2 * 60 * 60 * 1000 // 2 hours
const MAX_LOGIN_ATTEMPTS = 3
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes

let products = JSON.parse(localStorage.getItem("admin_products")) || [
  {
    id: "1",
    name: "Colar Dourado Elegante",
    price: 89.9,
    image: "https://via.placeholder.com/400x400/d97706/ffffff?text=Colar+Elegante",
    category: "Colares",
    type: "Semijoias",
    color: "Dourado",
    occasion: "Festa",
    size: "Médio",
    material: "Folheado a Ouro",
    featured: true,
    sales: 156,
    description: "Colar elegante folheado a ouro, perfeito para ocasiões especiais.",
  },
  {
    id: "2",
    name: "Brincos Pérola Clássicos",
    price: 45.9,
    image: "https://via.placeholder.com/400x400/78716c/ffffff?text=Brincos+Pérola",
    category: "Brincos",
    type: "Semijoias",
    color: "Branco",
    occasion: "Casual",
    size: "Pequeno",
    material: "Pérola Sintética",
    featured: true,
    sales: 203,
    description: "Brincos clássicos de pérola, ideais para o dia a dia.",
  },
]

let editingProductId = null

// Initialize admin panel
document.addEventListener("DOMContentLoaded", () => {
  checkAuthentication()
  initializeLoginForm()
})

// Check if user is authenticated
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
}

// Show admin panel
function showAdminPanel() {
  document.getElementById("login-form").style.display = "none"
  document.getElementById("admin-panel").style.display = "block"
  updateStatistics()
  renderProducts()
}

// Initialize login form
function initializeLoginForm() {
  const loginForm = document.getElementById("admin-login")
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin)
  }

  checkLockoutStatus()
}

// Check lockout status
function checkLockoutStatus() {
  const lockoutEnd = localStorage.getItem("admin_lockout")
  if (lockoutEnd) {
    const lockoutEndTime = Number.parseInt(lockoutEnd)
    if (Date.now() < lockoutEndTime) {
      const remainingTime = Math.ceil((lockoutEndTime - Date.now()) / 1000 / 60)
      showError(
        `Muitas tentativas falhadas. Acesso bloqueado por ${remainingTime} minuto${remainingTime !== 1 ? "s" : ""}.`,
      )
      disableLoginForm(true)

      const timer = setInterval(() => {
        if (Date.now() >= lockoutEndTime) {
          localStorage.removeItem("admin_lockout")
          disableLoginForm(false)
          hideError()
          clearInterval(timer)
        }
      }, 1000)
    } else {
      localStorage.removeItem("admin_lockout")
    }
  }
}

// Generate SHA-256 hash
async function generateHash(text) {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

// Handle login
async function handleLogin(e) {
  e.preventDefault()

  const username = document.getElementById("username").value
  const password = document.getElementById("password").value
  const loginBtn = document.getElementById("login-btn")

  // Check if locked out
  const lockoutEnd = localStorage.getItem("admin_lockout")
  if (lockoutEnd && Date.now() < Number.parseInt(lockoutEnd)) {
    showError("Muitas tentativas falhadas. Tente novamente mais tarde.")
    return
  }

  loginBtn.textContent = "Verificando..."
  loginBtn.disabled = true

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
        showError("Muitas tentativas falhadas. Acesso bloqueado por 15 minutos.")
        disableLoginForm(true)
      } else {
        showError(`Credenciais inválidas. Tentativas restantes: ${MAX_LOGIN_ATTEMPTS - attempts}`)
      }
    }
  } catch (error) {
    showError("Erro interno. Tente novamente.")
  }

  loginBtn.textContent = "Entrar"
  loginBtn.disabled = false
}

// Show error message
function showError(message) {
  const errorDiv = document.getElementById("login-error")
  if (errorDiv) {
    errorDiv.textContent = message
    errorDiv.style.display = "block"
  }
}

// Hide error message
function hideError() {
  const errorDiv = document.getElementById("login-error")
  if (errorDiv) {
    errorDiv.style.display = "none"
  }
}

// Disable/enable login form
function disableLoginForm(disabled) {
  const username = document.getElementById("username")
  const password = document.getElementById("password")
  const loginBtn = document.getElementById("login-btn")

  if (username) username.disabled = disabled
  if (password) password.disabled = disabled
  if (loginBtn) {
    loginBtn.disabled = disabled
    loginBtn.textContent = disabled ? "Bloqueado" : "Entrar"
  }
}

// Toggle password visibility
function togglePassword() {
  const passwordInput = document.getElementById("password")
  const passwordIcon = document.getElementById("password-icon")

  if (passwordInput.type === "password") {
    passwordInput.type = "text"
    passwordIcon.className = "fas fa-eye-slash"
  } else {
    passwordInput.type = "password"
    passwordIcon.className = "fas fa-eye"
  }
}

// Logout
function logout() {
  localStorage.removeItem("admin_session")
  localStorage.removeItem("login_attempts")
  showLoginForm()
}

// Update statistics
function updateStatistics() {
  const totalProducts = products.length
  const featuredProducts = products.filter((p) => p.featured).length
  const totalSales = products.reduce((sum, p) => sum + (p.sales || 0), 0)
  const totalRevenue = products.reduce((sum, p) => sum + p.price * (p.sales || 0), 0)

  document.getElementById("total-products").textContent = totalProducts
  document.getElementById("featured-products").textContent = featuredProducts
  document.getElementById("total-sales").textContent = totalSales
  document.getElementById("total-revenue").textContent = `R$ ${totalRevenue.toFixed(2).replace(".", ",")}`
  document.getElementById("total-revenue").classList.add("gradient")
}

// Show add product form
function showAddProduct() {
  editingProductId = null
  document.getElementById("form-title").textContent = "Adicionar Novo Produto"
  document.getElementById("form-icon").className = "fas fa-plus"
  document.getElementById("product-form").reset()
  document.getElementById("product-form-container").style.display = "block"
  document.getElementById("product-form-container").scrollIntoView({ behavior: "smooth" })
}

// Hide product form
function hideProductForm() {
  document.getElementById("product-form-container").style.display = "none"
  editingProductId = null
}

// Show edit product form
function editProduct(productId) {
  const product = products.find((p) => p.id === productId)
  if (!product) return

  editingProductId = productId
  document.getElementById("form-title").textContent = "Editar Produto"
  document.getElementById("form-icon").className = "fas fa-edit"

  // Fill form with product data
  document.getElementById("product-name").value = product.name
  document.getElementById("product-price").value = product.price
  document.getElementById("product-description").value = product.description || ""
  document.getElementById("product-type").value = product.type
  document.getElementById("product-category").value = product.category
  document.getElementById("product-color").value = product.color
  document.getElementById("product-size").value = product.size
  document.getElementById("product-material").value = product.material
  document.getElementById("product-occasion").value = product.occasion
  document.getElementById("product-image").value = product.image
  document.getElementById("product-featured").checked = product.featured

  document.getElementById("product-form-container").style.display = "block"
  document.getElementById("product-form-container").scrollIntoView({ behavior: "smooth" })
}

// Delete product
function deleteProduct(productId) {
  if (confirm("Tem certeza que deseja excluir este produto?")) {
    products = products.filter((p) => p.id !== productId)
    saveProducts()
    updateStatistics()
    renderProducts()
  }
}

// Handle product form submission
document.addEventListener("DOMContentLoaded", () => {
  const productForm = document.getElementById("product-form")
  if (productForm) {
    productForm.addEventListener("submit", handleProductSubmit)
  }
})

// Handle product form submit
function handleProductSubmit(e) {
  e.preventDefault()

  const formData = {
    name: document.getElementById("product-name").value,
    price: Number.parseFloat(document.getElementById("product-price").value),
    description: document.getElementById("product-description").value,
    type: document.getElementById("product-type").value,
    category: document.getElementById("product-category").value,
    color: document.getElementById("product-color").value,
    size: document.getElementById("product-size").value,
    material: document.getElementById("product-material").value,
    occasion: document.getElementById("product-occasion").value,
    image:
      document.getElementById("product-image").value ||
      `https://via.placeholder.com/400x400/d97706/ffffff?text=${encodeURIComponent(document.getElementById("product-name").value)}`,
    featured: document.getElementById("product-featured").checked,
  }

  if (editingProductId) {
    // Update existing product
    const productIndex = products.findIndex((p) => p.id === editingProductId)
    if (productIndex !== -1) {
      products[productIndex] = { ...products[productIndex], ...formData }
    }
  } else {
    // Add new product
    const newProduct = {
      id: Date.now().toString(),
      sales: 0,
      ...formData,
    }
    products.push(newProduct)
  }

  saveProducts()
  updateStatistics()
  renderProducts()
  hideProductForm()
}

// Save products to localStorage
function saveProducts() {
  localStorage.setItem("admin_products", JSON.stringify(products))
}

// Render products
function renderProducts() {
  const container = document.getElementById("admin-products")
  const noProducts = document.getElementById("admin-no-products")

  if (!container || !noProducts) return

  if (products.length === 0) {
    container.style.display = "none"
    noProducts.style.display = "block"
  } else {
    container.style.display = "grid"
    noProducts.style.display = "none"
    container.innerHTML = products.map((product) => createAdminProductCard(product)).join("")
  }
}

// Create admin product card
function createAdminProductCard(product) {
  return `
        <div class="admin-product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${product.featured ? '<div class="product-badge"><i class="fas fa-crown"></i> Destaque</div>' : ""}
                <div class="product-type-badge">${product.type}</div>
            </div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">R$ ${product.price.toFixed(2).replace(".", ",")}</p>
            <div class="product-tags">
                <span class="product-tag">${product.category}</span>
                <span class="product-tag">${product.color}</span>
                <span class="product-tag">${product.material}</span>
            </div>
            <div class="product-info">
                <small>Vendas: ${product.sales || 0}</small>
            </div>
            <div class="product-actions">
                <button class="btn btn-edit" onclick="editProduct('${product.id}')">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-delete" onclick="deleteProduct('${product.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `
}

// Initialize admin panel when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Check authentication status
  checkAuthentication()
})
