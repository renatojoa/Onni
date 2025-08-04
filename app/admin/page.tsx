"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  BarChart3,
  Package,
  Crown,
  Gem,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  QrCode,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  color: string
  occasion: string
  size: string
  material: string
  featured: boolean
  sales: number
  description?: string
}

interface Order {
  id: string
  productId: string
  productName: string
  price: number
  timestamp: number
  status: "pending" | "paid" | "cancelled"
  pixCode: string
}

// Hash das credenciais (SHA-256) - NÃO são as credenciais reais!
// Para gerar: use um gerador SHA-256 online com suas credenciais
const ADMIN_CREDENTIALS = {
  // Exemplo: usuário "admin" e senha "onni2024" (MUDE ESTAS!)
  username: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918", // hash de "admin"
  password: "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f", // hash de "secret123"
}

const SESSION_DURATION = 2 * 60 * 60 * 1000 // 2 horas em milliseconds
const MAX_LOGIN_ATTEMPTS = 3
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutos

// Função para gerar hash SHA-256
async function generateHash(text: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

// Componente de Login
function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockoutTime, setLockoutTime] = useState<number | null>(null)

  useEffect(() => {
    // Verificar se há lockout ativo
    const lockoutEnd = localStorage.getItem("admin_lockout")
    if (lockoutEnd) {
      const lockoutEndTime = Number.parseInt(lockoutEnd)
      if (Date.now() < lockoutEndTime) {
        setIsLocked(true)
        setLockoutTime(lockoutEndTime)

        const timer = setInterval(() => {
          if (Date.now() >= lockoutEndTime) {
            setIsLocked(false)
            setLockoutTime(null)
            localStorage.removeItem("admin_lockout")
            clearInterval(timer)
          }
        }, 1000)

        return () => clearInterval(timer)
      } else {
        localStorage.removeItem("admin_lockout")
      }
    }

    // Recuperar tentativas de login
    const savedAttempts = localStorage.getItem("login_attempts")
    if (savedAttempts) {
      setAttempts(Number.parseInt(savedAttempts))
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isLocked) {
      setError("Muitas tentativas falhadas. Tente novamente mais tarde.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const usernameHash = await generateHash(username.toLowerCase().trim())
      const passwordHash = await generateHash(password)

      if (usernameHash === ADMIN_CREDENTIALS.username && passwordHash === ADMIN_CREDENTIALS.password) {
        // Login bem-sucedido
        const sessionData = {
          authenticated: true,
          timestamp: Date.now(),
          expires: Date.now() + SESSION_DURATION,
        }

        localStorage.setItem("admin_session", JSON.stringify(sessionData))
        localStorage.removeItem("login_attempts")
        localStorage.removeItem("admin_lockout")

        onLogin()
      } else {
        // Login falhado
        const newAttempts = attempts + 1
        setAttempts(newAttempts)
        localStorage.setItem("login_attempts", newAttempts.toString())

        if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
          const lockoutEnd = Date.now() + LOCKOUT_DURATION
          localStorage.setItem("admin_lockout", lockoutEnd.toString())
          setIsLocked(true)
          setLockoutTime(lockoutEnd)
          setError(`Muitas tentativas falhadas. Acesso bloqueado por 15 minutos.`)
        } else {
          setError(`Credenciais inválidas. Tentativas restantes: ${MAX_LOGIN_ATTEMPTS - newAttempts}`)
        }
      }
    } catch (error) {
      setError("Erro interno. Tente novamente.")
    }

    setIsLoading(false)
  }

  const getRemainingLockoutTime = () => {
    if (!lockoutTime) return ""
    const remaining = Math.ceil((lockoutTime - Date.now()) / 1000 / 60)
    return `${remaining} minuto${remaining !== 1 ? "s" : ""}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gradient-to-br from-stone-800/40 to-stone-900/40 backdrop-blur-sm border border-stone-700/30">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-amber-300 to-amber-400 bg-clip-text text-transparent">
            Painel Administrativo
          </CardTitle>
          <p className="text-stone-400 text-sm">Acessórios Onni</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-stone-200 font-medium">
                Usuário
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite seu usuário"
                className="bg-stone-700/30 border-stone-600/40 text-stone-100 placeholder-stone-400/60 focus:border-amber-400"
                disabled={isLocked || isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-stone-200 font-medium">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="bg-stone-700/30 border-stone-600/40 text-stone-100 placeholder-stone-400/60 focus:border-amber-400 pr-12"
                  disabled={isLocked || isLoading}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-stone-400 hover:text-stone-200"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLocked || isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {error && (
              <Alert className="border-red-500/30 bg-red-500/10">
                <AlertDescription className="text-red-400 text-sm">
                  {error}
                  {isLocked && lockoutTime && (
                    <div className="mt-2 text-xs">Tempo restante: {getRemainingLockoutTime()}</div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-3 shadow-lg transition-all duration-300"
              disabled={isLocked || isLoading}
            >
              {isLoading ? "Verificando..." : isLocked ? "Bloqueado" : "Entrar"}
            </Button>
          </form>

          <div className="mt-8 p-4 bg-stone-800/30 rounded-lg border border-stone-700/30">
            <h4 className="text-stone-300 font-medium mb-2 text-sm">🔒 Segurança:</h4>
            <ul className="text-stone-400 text-xs space-y-1">
              <li>• Sessão expira em 2 horas</li>
              <li>• Máximo 3 tentativas de login</li>
              <li>• Bloqueio de 15min após tentativas falhadas</li>
              <li>• Credenciais criptografadas</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Mock data - same as before
const initialProducts: Product[] = [
  {
    id: "1",
    name: "Colar Dourado Elegante",
    price: 89.9,
    image: "/placeholder.svg?height=400&width=400",
    category: "Colares",
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
    image: "/placeholder.svg?height=400&width=400",
    category: "Brincos",
    color: "Branco",
    occasion: "Casual",
    size: "Pequeno",
    material: "Pérola Sintética",
    featured: true,
    sales: 203,
    description: "Brincos clássicos de pérola, ideais para o dia a dia.",
  },
]

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [orders, setOrders] = useState<Order[]>([])
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<Partial<Product>>({})

  const categories = ["Colares", "Brincos", "Pulseiras", "Anéis", "Conjuntos"]
  const colors = ["Dourado", "Prata", "Branco", "Preto", "Multicolor", "Rosa"]
  const occasions = ["Casual", "Festa", "Trabalho", "Noivado", "Casamento"]
  const materials = ["Folheado a Ouro", "Prata 925", "Aço Inoxidável", "Pérola Sintética", "Cristal"]
  const sizes = ["Pequeno", "Médio", "Grande", "Ajustável", "Variados", "Único"]

  useEffect(() => {
    // Verificar se há sessão válida
    const sessionData = localStorage.getItem("admin_session")
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData)
        if (session.authenticated && Date.now() < session.expires) {
          setIsAuthenticated(true)
          loadOrders()
        } else {
          localStorage.removeItem("admin_session")
        }
      } catch (error) {
        localStorage.removeItem("admin_session")
      }
    }
    setIsLoading(false)
  }, [])

  const loadOrders = () => {
    const savedOrders = localStorage.getItem("orders")
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders))
      } catch (error) {
        console.error("Error loading orders:", error)
      }
    }
  }

  const handleLogin = () => {
    setIsAuthenticated(true)
    loadOrders()
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_session")
    localStorage.removeItem("login_attempts")
    setIsAuthenticated(false)
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveProduct = () => {
    if (editingProduct) {
      // Update existing product
      setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? { ...editingProduct, ...formData } : p)))
      setEditingProduct(null)
    } else {
      // Add new product
      const newProduct: Product = {
        id: Date.now().toString(),
        name: formData.name || "",
        price: formData.price || 0,
        image: formData.image || "/placeholder.svg?height=400&width=400",
        category: formData.category || "",
        color: formData.color || "",
        occasion: formData.occasion || "",
        size: formData.size || "",
        material: formData.material || "",
        featured: formData.featured || false,
        sales: 0,
        description: formData.description || "",
      }
      setProducts((prev) => [...prev, newProduct])
      setIsAddingProduct(false)
    }
    setFormData({})

    // Save to localStorage
    const updatedProducts = editingProduct
      ? products.map((p) => (p.id === editingProduct.id ? { ...editingProduct, ...formData } : p))
      : [
          ...products,
          {
            id: Date.now().toString(),
            name: formData.name || "",
            price: formData.price || 0,
            image: formData.image || "/placeholder.svg?height=400&width=400",
            category: formData.category || "",
            color: formData.color || "",
            occasion: formData.occasion || "",
            size: formData.size || "",
            material: formData.material || "",
            featured: formData.featured || false,
            sales: 0,
            description: formData.description || "",
          },
        ]

    localStorage.setItem("admin_products", JSON.stringify(updatedProducts))
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setFormData(product)
  }

  const handleDeleteProduct = (id: string) => {
    const updatedProducts = products.filter((p) => p.id !== id)
    setProducts(updatedProducts)
    localStorage.setItem("admin_products", JSON.stringify(updatedProducts))
  }

  const updateOrderStatus = (orderId: string, status: "pending" | "paid" | "cancelled") => {
    const updatedOrders = orders.map((order) => (order.id === orderId ? { ...order, status } : order))
    setOrders(updatedOrders)
    localStorage.setItem("orders", JSON.stringify(updatedOrders))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const totalRevenue = products.reduce((sum, p) => sum + p.price * p.sales, 0)
  const totalOrders = orders.length
  const paidOrders = orders.filter((o) => o.status === "paid").length
  const pendingOrders = orders.filter((o) => o.status === "pending").length

  const ProductForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-stone-200 font-medium">
            Nome do Produto
          </Label>
          <Input
            id="name"
            value={formData.name || ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Nome do produto"
            className="bg-stone-700/30 border-stone-600/40 text-stone-100 placeholder-stone-400/60 focus:border-amber-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price" className="text-stone-200 font-medium">
            Preço (R$)
          </Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price || ""}
            onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value))}
            placeholder="0.00"
            className="bg-stone-700/30 border-stone-600/40 text-stone-100 placeholder-stone-400/60 focus:border-amber-400"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-stone-200 font-medium">
          Descrição
        </Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Descrição detalhada do produto"
          rows={4}
          className="bg-stone-700/30 border-stone-600/40 text-stone-100 placeholder-stone-400/60 focus:border-amber-400"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="category" className="text-stone-200 font-medium">
            Categoria
          </Label>
          <Select value={formData.category || ""} onValueChange={(value) => handleInputChange("category", value)}>
            <SelectTrigger className="bg-stone-700/30 border-stone-600/40 text-stone-100">
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent className="bg-stone-800 border-stone-700">
              {categories.map((category) => (
                <SelectItem key={category} value={category} className="text-stone-100 focus:bg-stone-700">
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="color" className="text-stone-200 font-medium">
            Cor
          </Label>
          <Select value={formData.color || ""} onValueChange={(value) => handleInputChange("color", value)}>
            <SelectTrigger className="bg-stone-700/30 border-stone-600/40 text-stone-100">
              <SelectValue placeholder="Selecione a cor" />
            </SelectTrigger>
            <SelectContent className="bg-stone-800 border-stone-700">
              {colors.map((color) => (
                <SelectItem key={color} value={color} className="text-stone-100 focus:bg-stone-700">
                  {color}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="occasion" className="text-stone-200 font-medium">
            Ocasião
          </Label>
          <Select value={formData.occasion || ""} onValueChange={(value) => handleInputChange("occasion", value)}>
            <SelectTrigger className="bg-stone-700/30 border-stone-600/40 text-stone-100">
              <SelectValue placeholder="Selecione a ocasião" />
            </SelectTrigger>
            <SelectContent className="bg-stone-800 border-stone-700">
              {occasions.map((occasion) => (
                <SelectItem key={occasion} value={occasion} className="text-stone-100 focus:bg-stone-700">
                  {occasion}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="size" className="text-stone-200 font-medium">
            Tamanho
          </Label>
          <Select value={formData.size || ""} onValueChange={(value) => handleInputChange("size", value)}>
            <SelectTrigger className="bg-stone-700/30 border-stone-600/40 text-stone-100">
              <SelectValue placeholder="Selecione o tamanho" />
            </SelectTrigger>
            <SelectContent className="bg-stone-800 border-stone-700">
              {sizes.map((size) => (
                <SelectItem key={size} value={size} className="text-stone-100 focus:bg-stone-700">
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="material" className="text-stone-200 font-medium">
          Material
        </Label>
        <Select value={formData.material || ""} onValueChange={(value) => handleInputChange("material", value)}>
          <SelectTrigger className="bg-stone-700/30 border-stone-600/40 text-stone-100">
            <SelectValue placeholder="Selecione o material" />
          </SelectTrigger>
          <SelectContent className="bg-stone-800 border-stone-700">
            {materials.map((material) => (
              <SelectItem key={material} value={material} className="text-stone-100 focus:bg-stone-700">
                {material}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image" className="text-stone-200 font-medium">
          URL da Imagem
        </Label>
        <Input
          id="image"
          value={formData.image || ""}
          onChange={(e) => handleInputChange("image", e.target.value)}
          placeholder="URL da imagem do produto"
          className="bg-stone-700/30 border-stone-600/40 text-stone-100 placeholder-stone-400/60 focus:border-amber-400"
        />
      </div>

      <div className="flex items-center space-x-3 p-4 bg-stone-800/30 rounded-xl border border-stone-700/30">
        <Switch
          id="featured"
          checked={formData.featured || false}
          onCheckedChange={(checked) => handleInputChange("featured", checked)}
          className="data-[state=checked]:bg-amber-500"
        />
        <Label htmlFor="featured" className="text-stone-200 font-medium flex items-center">
          <Crown className="h-4 w-4 mr-2 text-amber-400" />
          Produto em Destaque
        </Label>
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          onClick={handleSaveProduct}
          className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 flex-1"
        >
          <Save className="h-4 w-4 mr-2" />
          Salvar Produto
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setIsAddingProduct(false)
            setEditingProduct(null)
            setFormData({})
          }}
          className="border-stone-600/30 text-stone-300 hover:bg-stone-800/30"
        >
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <p className="text-stone-400">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-stone-900/95 to-stone-800/95 backdrop-blur-md border-b border-stone-700/30 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl flex items-center justify-center">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-300 to-amber-400 bg-clip-text text-transparent">
                    Painel Administrativo
                  </h1>
                  <p className="text-stone-400 text-sm">Acessórios Onni</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setIsAddingProduct(true)}
                className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Produto
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-stone-600/30 text-stone-300 hover:bg-stone-800/30 bg-transparent"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-stone-800/40 to-stone-900/40 backdrop-blur-sm border border-stone-700/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-stone-300">Total de Produtos</CardTitle>
                <Package className="h-5 w-5 text-amber-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-stone-100">{products.length}</div>
              <p className="text-stone-400 text-xs mt-1">produtos cadastrados</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-stone-800/40 to-stone-900/40 backdrop-blur-sm border border-stone-700/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-stone-300">Total de Pedidos</CardTitle>
                <ShoppingCart className="h-5 w-5 text-amber-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-stone-100">{totalOrders}</div>
              <p className="text-stone-400 text-xs mt-1">pedidos realizados</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-stone-800/40 to-stone-900/40 backdrop-blur-sm border border-stone-700/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-stone-300">Pedidos Pendentes</CardTitle>
                <Clock className="h-5 w-5 text-amber-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-stone-100">{pendingOrders}</div>
              <p className="text-stone-400 text-xs mt-1">aguardando pagamento</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-stone-800/40 to-stone-900/40 backdrop-blur-sm border border-stone-700/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-stone-300">Receita Total</CardTitle>
                <BarChart3 className="h-5 w-5 text-amber-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
                R$ {totalRevenue.toFixed(2).replace(".", ",")}
              </div>
              <p className="text-stone-400 text-xs mt-1">receita estimada</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="bg-stone-800/40 border border-stone-700/30">
            <TabsTrigger
              value="products"
              className="data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-300"
            >
              <Package className="h-4 w-4 mr-2" />
              Produtos
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-300"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Pedidos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            {/* Add Product Form */}
            {isAddingProduct && (
              <Card className="bg-gradient-to-br from-stone-800/40 to-stone-900/40 backdrop-blur-sm border border-stone-700/30">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-700 rounded-lg flex items-center justify-center">
                      <Plus className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-stone-200">Adicionar Novo Produto</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ProductForm />
                </CardContent>
              </Card>
            )}

            {/* Edit Product Form */}
            {editingProduct && (
              <Card className="bg-gradient-to-br from-stone-800/40 to-stone-900/40 backdrop-blur-sm border border-stone-700/30">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-700 rounded-lg flex items-center justify-center">
                      <Edit className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-stone-200">Editar Produto</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ProductForm />
                </CardContent>
              </Card>
            )}

            {/* Products List */}
            <Card className="bg-gradient-to-br from-stone-800/40 to-stone-900/40 backdrop-blur-sm border border-stone-700/30">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-700 rounded-lg flex items-center justify-center">
                    <Gem className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-stone-200">Produtos Cadastrados</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Card
                      key={product.id}
                      className="bg-gradient-to-br from-stone-700/20 to-stone-800/20 border border-stone-600/30 hover:border-amber-500/40 transition-all duration-300"
                    >
                      <CardContent className="p-5">
                        <div className="relative mb-4 overflow-hidden rounded-lg">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            width={400}
                            height={250}
                            className="w-full h-40 object-cover"
                          />
                          {product.featured && (
                            <Badge className="absolute top-2 left-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white border-0">
                              <Crown className="h-3 w-3 mr-1" />
                              Destaque
                            </Badge>
                          )}
                        </div>

                        <h3 className="font-bold text-stone-100 mb-2 leading-tight">{product.name}</h3>
                        <p className="text-xl font-bold bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent mb-3">
                          R$ {product.price.toFixed(2).replace(".", ",")}
                        </p>

                        <div className="flex flex-wrap gap-1 mb-3">
                          <Badge
                            variant="secondary"
                            className="bg-stone-700/30 text-amber-300 border-stone-600/30 text-xs"
                          >
                            {product.category}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="bg-stone-700/30 text-amber-300 border-stone-600/30 text-xs"
                          >
                            {product.color}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="bg-stone-700/30 text-amber-300 border-stone-600/30 text-xs"
                          >
                            {product.material}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between text-sm text-stone-400 mb-4">
                          <span>Vendas: {product.sales}</span>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditProduct(product)}
                            className="flex-1 border-stone-600/30 text-stone-300 hover:bg-stone-800/30"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="bg-red-600/20 border-red-500/30 text-red-400 hover:bg-red-600/30"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {products.length === 0 && (
                  <div className="text-center py-16">
                    <div className="bg-gradient-to-br from-stone-800/30 to-stone-900/30 backdrop-blur-sm rounded-2xl p-12 border border-stone-700/30 max-w-md mx-auto">
                      <Package className="h-16 w-16 text-stone-400/50 mx-auto mb-4" />
                      <p className="text-stone-300 text-lg font-medium mb-2">Nenhum produto cadastrado</p>
                      <p className="text-stone-400 text-sm mb-6">Comece adicionando seu primeiro produto</p>
                      <Button
                        onClick={() => setIsAddingProduct(true)}
                        className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Primeiro Produto
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            {/* Orders List */}
            <Card className="bg-gradient-to-br from-stone-800/40 to-stone-900/40 backdrop-blur-sm border border-stone-700/30">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-700 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-stone-200">Pedidos Recebidos</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders
                      .sort((a, b) => b.timestamp - a.timestamp)
                      .map((order) => (
                        <Card
                          key={order.id}
                          className="bg-gradient-to-br from-stone-700/20 to-stone-800/20 border border-stone-600/30"
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-bold text-stone-100">Pedido #{order.id}</h3>
                                  <Badge className={`${getStatusColor(order.status)} border text-xs`}>
                                    {getStatusIcon(order.status)}
                                    <span className="ml-1">
                                      {order.status === "pending"
                                        ? "Pendente"
                                        : order.status === "paid"
                                          ? "Pago"
                                          : "Cancelado"}
                                    </span>
                                  </Badge>
                                </div>
                                <p className="text-stone-300 font-medium">{order.productName}</p>
                                <p className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
                                  R$ {order.price.toFixed(2).replace(".", ",")}
                                </p>
                                <p className="text-stone-400 text-sm mt-2">
                                  {new Date(order.timestamp).toLocaleString("pt-BR")}
                                </p>
                              </div>

                              <div className="flex gap-2">
                                {order.status === "pending" && (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={() => updateOrderStatus(order.id, "paid")}
                                      className="bg-green-600/20 border-green-500/30 text-green-400 hover:bg-green-600/30"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Marcar como Pago
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => updateOrderStatus(order.id, "cancelled")}
                                      className="bg-red-600/20 border-red-500/30 text-red-400 hover:bg-red-600/30"
                                    >
                                      <XCircle className="h-4 w-4 mr-1" />
                                      Cancelar
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>

                            {order.pixCode && (
                              <div className="mt-4 p-3 bg-stone-800/30 rounded-lg border border-stone-700/30">
                                <div className="flex items-center gap-2 mb-2">
                                  <QrCode className="h-4 w-4 text-amber-400" />
                                  <span className="text-stone-300 text-sm font-medium">Código PIX:</span>
                                </div>
                                <p className="text-stone-400 text-xs font-mono break-all">{order.pixCode}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="bg-gradient-to-br from-stone-800/30 to-stone-900/30 backdrop-blur-sm rounded-2xl p-12 border border-stone-700/30 max-w-md mx-auto">
                      <ShoppingCart className="h-16 w-16 text-stone-400/50 mx-auto mb-4" />
                      <p className="text-stone-300 text-lg font-medium mb-2">Nenhum pedido recebido</p>
                      <p className="text-stone-400 text-sm">
                        Os pedidos aparecerão aqui quando os clientes fizerem compras
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}