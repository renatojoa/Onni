"use client"

import { useState, useEffect } from "react"
import {
  Heart,
  ShoppingBag,
  MessageCircle,
  Search,
  Filter,
  Sparkles,
  Crown,
  Gem,
  ChevronLeft,
  ChevronRight,
  Instagram,
  QrCode,
  Copy,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"
import Link from "next/link"

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  type: "Joias" | "Semijoias" | "Bijuterias"
  color: string
  occasion: string
  size: string
  material: string
  featured: boolean
  sales: number
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

// Mock data - expanded with new categories
const mockProducts: Product[] = [
  // Joias
  {
    id: "1",
    name: "Anel Ouro 18k Solitário",
    price: 1299.9,
    image: "/placeholder.svg?height=400&width=400&text=Anel+Ouro+18k",
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
    image: "/placeholder.svg?height=400&width=400&text=Colar+Diamante",
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
    image: "/placeholder.svg?height=400&width=400&text=Brincos+Pérola",
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
    image: "/placeholder.svg?height=400&width=400&text=Colar+Semijoia",
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
    image: "/placeholder.svg?height=400&width=400&text=Brincos+Prata",
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
    image: "/placeholder.svg?height=400&width=400&text=Pulseira+Elegante",
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
    image: "/placeholder.svg?height=400&width=400&text=Conjunto+Bijuteria",
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
    image: "/placeholder.svg?height=400&width=400&text=Choker+Minimalista",
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
    image: "/placeholder.svg?height=400&width=400&text=Brincos+Coloridos",
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

// Generate order ID
function generateOrderId(): string {
  const timestamp = Date.now().toString()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `ON${timestamp.slice(-6)}${random}`
}

// Generate PIX code
function generatePixCode(orderId: string, amount: number): string {
  // Simplified PIX code generation (in real implementation, use proper PIX library)
  const pixKey = "81979798540" // Phone number
  const merchantName = "ACESSORIOS ONNI"
  const merchantCity = "RECIFE"
  const txId = orderId

  // This is a simplified version - in production, use proper PIX EMV QR Code generation
  return `00020126580014BR.GOV.BCB.PIX0136${pixKey}0208${txId}5204000053039865802BR5913${merchantName}6005${merchantCity}62070503***6304`
}

// PIX Modal Component
function PixModal({
  isOpen,
  onClose,
  product,
  orderId,
}: {
  isOpen: boolean
  onClose: () => void
  product: Product | null
  orderId: string
}) {
  const [copied, setCopied] = useState(false)

  if (!product) return null

  const pixCode = generatePixCode(orderId, product.price)

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gradient-to-br from-stone-800/95 to-stone-900/95 backdrop-blur-md border border-stone-700/50">
        <DialogHeader>
          <DialogTitle className="text-center text-amber-200 text-xl font-bold flex items-center justify-center gap-2">
            <QrCode className="h-6 w-6" />
            Pagamento PIX
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Info */}
          <div className="text-center">
            <h3 className="font-semibold text-stone-100 mb-2">{product.name}</h3>
            <p className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
              R$ {product.price.toFixed(2).replace(".", ",")}
            </p>
            <p className="text-stone-400 text-sm mt-1">Pedido: {orderId}</p>
          </div>

          {/* QR Code Placeholder */}
          <div className="bg-white p-4 rounded-xl mx-auto w-64 h-64 flex items-center justify-center">
            <div className="text-center">
              <QrCode className="h-24 w-24 text-stone-800 mx-auto mb-4" />
              <p className="text-stone-800 text-sm font-medium">Escaneie com seu app do banco</p>
            </div>
          </div>

          {/* PIX Code */}
          <div className="space-y-3">
            <p className="text-stone-300 text-sm text-center">Ou copie o código PIX:</p>
            <div className="bg-stone-700/30 p-3 rounded-lg border border-stone-600/30">
              <p className="text-stone-200 text-xs font-mono break-all">{pixCode}</p>
            </div>
            <Button
              onClick={copyPixCode}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar Código PIX
                </>
              )}
            </Button>
          </div>

          {/* Instructions */}
          <div className="bg-stone-800/30 p-4 rounded-lg border border-stone-700/30">
            <h4 className="text-amber-300 font-semibold mb-2 text-sm">Instruções:</h4>
            <ul className="text-stone-300 text-xs space-y-1">
              <li>• Abra o app do seu banco</li>
              <li>• Escolha a opção PIX</li>
              <li>• Escaneie o QR Code ou cole o código</li>
              <li>• Confirme o pagamento</li>
              <li>• Envie o comprovante via WhatsApp</li>
            </ul>
          </div>

          {/* WhatsApp Button */}
          <Button
            onClick={() => {
              const message = `Olá! Realizei o pagamento PIX do pedido ${orderId} - ${product.name}. Segue o comprovante:`
              const whatsappUrl = `https://wa.me/5581979798540?text=${encodeURIComponent(message)}`
              window.open(whatsappUrl, "_blank")
            }}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Enviar Comprovante
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Carousel Component
function ProductCarousel({ products, title }: { products: Product[]; title: string }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [currentOrderId, setCurrentOrderId] = useState("")
  const [showPixModal, setShowPixModal] = useState(false)
  const itemsPerView = 4

  // Don't render if no products
  if (products.length === 0) {
    return null
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + itemsPerView >= products.length ? 0 : prev + itemsPerView))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? Math.max(0, products.length - itemsPerView) : Math.max(0, prev - itemsPerView),
    )
  }

  const handleWhatsAppClick = (product: Product) => {
    const orderId = generateOrderId()
    saveOrder(orderId, product, "whatsapp")

    const message = `Olá! Tenho interesse no produto: ${product.name} - R$ ${product.price.toFixed(2).replace(".", ",")} (Pedido: ${orderId})`
    const whatsappUrl = `https://wa.me/5581979798540?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const handlePixClick = (product: Product) => {
    const orderId = generateOrderId()
    saveOrder(orderId, product, "pix")

    setSelectedProduct(product)
    setCurrentOrderId(orderId)
    setShowPixModal(true)
  }

  const saveOrder = (orderId: string, product: Product, type: "whatsapp" | "pix") => {
    const order: Order = {
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
  }

  const visibleProducts = products.slice(currentIndex, currentIndex + itemsPerView)

  return (
    <>
      <div className="mb-20">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-bold text-amber-100">{title}</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="border-amber-600/30 text-amber-300 hover:bg-amber-800/20 bg-transparent"
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="border-amber-600/30 text-amber-300 hover:bg-amber-800/20 bg-transparent"
              disabled={currentIndex + itemsPerView >= products.length}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleProducts.map((product) => (
            <Card
              key={product.id}
              className="group bg-gradient-to-br from-stone-800/20 to-amber-900/20 backdrop-blur-sm border border-stone-700/30 hover:border-amber-600/50 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/10 transform hover:scale-105"
            >
              <CardContent className="p-6">
                <div className="relative mb-6 overflow-hidden rounded-xl">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {product.featured && (
                    <Badge className="absolute top-3 left-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white border-0">
                      <Crown className="h-3 w-3 mr-1" />
                      Destaque
                    </Badge>
                  )}
                </div>

                <h4 className="font-bold text-stone-100 mb-3 leading-tight">{product.name}</h4>

                <p className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent mb-4">
                  R$ {product.price.toFixed(2).replace(".", ",")}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary" className="bg-stone-700/30 text-amber-300 border-stone-600/30 text-xs">
                    {product.material}
                  </Badge>
                  <Badge variant="secondary" className="bg-stone-700/30 text-amber-300 border-stone-600/30 text-xs">
                    {product.size}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={() => handlePixClick(product)}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    Pagar com PIX
                  </Button>

                  <Button
                    onClick={() => handleWhatsAppClick(product)}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Falar no WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <PixModal
        isOpen={showPixModal}
        onClose={() => setShowPixModal(false)}
        product={selectedProduct}
        orderId={currentOrderId}
      />
    </>
  )
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedColor, setSelectedColor] = useState("all")
  const [selectedOccasion, setSelectedOccasion] = useState("all")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [currentOrderId, setCurrentOrderId] = useState("")
  const [showPixModal, setShowPixModal] = useState(false)

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))]
  const types = ["all", ...Array.from(new Set(products.map((p) => p.type)))]
  const colors = ["all", ...Array.from(new Set(products.map((p) => p.color)))]
  const occasions = ["all", ...Array.from(new Set(products.map((p) => p.occasion)))]

  const featuredProducts = products.filter((p) => p.featured).sort((a, b) => b.sales - a.sales)
  const joias = products.filter((p) => p.type === "Joias")
  const semijoias = products.filter((p) => p.type === "Semijoias")
  const bijuterias = products.filter((p) => p.type === "Bijuterias")

  const loadProductsFromStorage = () => {
    const saved = localStorage.getItem("admin_products")
    if (saved) {
      try {
        const adminProducts = JSON.parse(saved)
        return adminProducts
      } catch (error) {
        console.error("Error loading products:", error)
      }
    }
    return mockProducts
  }

  useEffect(() => {
    // Load products from localStorage on component mount
    const loadedProducts = loadProductsFromStorage()
    setProducts(loadedProducts)
    setFilteredProducts(loadedProducts)
  }, [])

  useEffect(() => {
    let filtered = products

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.type.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((p) => p.type === selectedType)
    }

    if (selectedColor !== "all") {
      filtered = filtered.filter((p) => p.color === selectedColor)
    }

    if (selectedOccasion !== "all") {
      filtered = filtered.filter((p) => p.occasion === selectedOccasion)
    }

    setFilteredProducts(filtered)
  }, [searchTerm, selectedCategory, selectedType, selectedColor, selectedOccasion, products])

  const handleWhatsAppClick = (product: Product) => {
    const orderId = generateOrderId()
    saveOrder(orderId, product, "whatsapp")

    const message = `Olá! Tenho interesse no produto: ${product.name} - R$ ${product.price.toFixed(2).replace(".", ",")} (Pedido: ${orderId})`
    const whatsappUrl = `https://wa.me/5581979798540?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const handlePixClick = (product: Product) => {
    const orderId = generateOrderId()
    saveOrder(orderId, product, "pix")

    setSelectedProduct(product)
    setCurrentOrderId(orderId)
    setShowPixModal(true)
  }

  const saveOrder = (orderId: string, product: Product, type: "whatsapp" | "pix") => {
    const order: Order = {
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
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900 relative">
      {/* Background Video */}
      <div className="fixed inset-0 z-0">
        <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
          <source src="/videos/hero-video.mp4" type="video/mp4" />
        </video>
        {/* Video Overlay with gradient transparency */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/95 via-stone-900/60 to-stone-900/95"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/80 via-transparent to-stone-900/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-gradient-to-r from-stone-900/95 to-stone-800/95 backdrop-blur-md border-b border-stone-700/30 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Image
                  src="/images/logo.png"
                  alt="Acessórios Onni"
                  width={140}
                  height={70}
                  className="h-14 w-auto brightness-110 contrast-125"
                />
              </div>
              <nav className="hidden md:flex items-center space-x-8">
                <Link
                  href="/"
                  className="text-amber-200 hover:text-amber-300 font-medium transition-colors duration-300 relative group"
                >
                  Início
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link
                  href="/products"
                  className="text-amber-200 hover:text-amber-300 font-medium transition-colors duration-300 relative group"
                >
                  Produtos
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link
                  href="/about"
                  className="text-amber-200 hover:text-amber-300 font-medium transition-colors duration-300 relative group"
                >
                  Sobre
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link
                  href="/contact"
                  className="text-amber-200 hover:text-amber-300 font-medium transition-colors duration-300 relative group"
                >
                  Contato
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </nav>
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.open("https://www.instagram.com/onniacessorios/", "_blank")}
                  className="text-amber-200 hover:text-amber-300 hover:bg-stone-800/50 transition-all duration-300"
                >
                  <Instagram className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-amber-200 hover:text-amber-300 hover:bg-stone-800/50 transition-all duration-300"
                >
                  <Heart className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-amber-200 hover:text-amber-300 hover:bg-stone-800/50 transition-all duration-300"
                >
                  <ShoppingBag className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative py-32 overflow-hidden">
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="h-8 w-8 text-amber-300 mr-3 animate-pulse" />
              <Crown className="h-10 w-10 text-amber-400" />
              <Sparkles className="h-8 w-8 text-amber-300 ml-3 animate-pulse" />
            </div>

            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-amber-200 via-amber-100 to-stone-200 bg-clip-text text-transparent mb-6 leading-tight">
              Acessórios Onni
            </h1>

            <p className="text-xl md:text-2xl text-amber-200/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Semijoias que refletem uma elegância atemporal
              <span className="block mt-2 text-amber-300/80">e enaltecem cada detalhe com sofisticação</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-10 py-4 text-lg font-semibold shadow-2xl hover:shadow-amber-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <Gem className="h-5 w-5 mr-2" />
                Ver Coleção Exclusiva
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.open("https://www.instagram.com/onniacessorios/", "_blank")}
                className="border-2 border-amber-300/50 text-amber-200 hover:bg-amber-300/10 px-10 py-4 text-lg backdrop-blur-sm transition-all duration-300 bg-transparent"
              >
                <Instagram className="h-5 w-5 mr-2" />
                Siga no Instagram
              </Button>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>

        {/* Video Section - Substitui a seção do Instagram */}
        <section className="py-20 bg-gradient-to-br from-stone-900/90 via-amber-900/90 to-stone-800/90 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-200 to-stone-200 bg-clip-text text-transparent mb-4">
                Nossa Coleção em Destaque
              </h2>
              <p className="text-stone-300 text-lg">Veja de perto a qualidade e elegância de nossos acessórios</p>
            </div>

            <div className="max-w-4xl mx-auto relative">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <video className="w-full h-[400px] md:h-[500px] object-cover" autoPlay loop muted playsInline>
                  <source src="/videos/hero-video.mp4" type="video/mp4" />
                  Seu navegador não suporta vídeo HTML5.
                </video>

                {/* Video Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-stone-900/30"></div>

                {/* Video Corner Badge */}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-600/90 to-amber-700/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-semibold">
                  <Sparkles className="h-4 w-4 inline mr-2" />
                  Coleção 2024
                </div>
              </div>

              {/* Call to Action Buttons Below Video */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                <Button
                  size="lg"
                  onClick={() => window.open("https://www.instagram.com/onniacessorios/", "_blank")}
                  className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  <Instagram className="h-5 w-5 mr-2" />
                  @onniacessorios
                </Button>

                <Button
                  size="lg"
                  onClick={() =>
                    window.open(
                      "https://wa.me/5581979798540?text=Olá! Gostaria de conhecer mais sobre a coleção!",
                      "_blank",
                    )
                  }
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Fale Conosco
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>

        {/* Product Categories Carousels - Only show categories with products */}
        <section className="py-24 bg-gradient-to-br from-amber-900/80 via-stone-800/80 to-amber-800/80 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-200 to-stone-200 bg-clip-text text-transparent mb-4">
                Nossas Coleções
              </h2>
              <p className="text-amber-300/80 text-lg">Descubra a categoria perfeita para cada ocasião</p>
            </div>

            {/* Only render carousels for categories that have products */}
            {joias.length > 0 && <ProductCarousel products={joias} title="💎 Joias" />}
            {semijoias.length > 0 && <ProductCarousel products={semijoias} title="✨ Semijoias" />}
            {bijuterias.length > 0 && <ProductCarousel products={bijuterias} title="🌟 Bijuterias" />}

            {/* Show message if no products in any category */}
            {joias.length === 0 && semijoias.length === 0 && bijuterias.length === 0 && (
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-stone-800/30 to-stone-700/30 backdrop-blur-sm rounded-2xl p-12 border border-stone-600/40 max-w-md mx-auto">
                  <Gem className="h-16 w-16 text-amber-400/50 mx-auto mb-4" />
                  <p className="text-stone-300 text-lg font-medium mb-2">Produtos em breve</p>
                  <p className="text-stone-400 text-sm">Nossa coleção está sendo preparada especialmente para você</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>

        {/* Filters and Products */}
        <section className="py-24 bg-gradient-to-br from-stone-900/90 via-stone-800/90 to-stone-900/90 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-300 to-stone-300 bg-clip-text text-transparent mb-4">
                Coleção Completa
              </h2>
              <p className="text-stone-300 text-lg">Encontre a peça perfeita que combina com seu estilo único</p>
            </div>

            {/* Only show filters and products if there are products */}
            {products.length > 0 ? (
              <>
                {/* Search and Filters */}
                <div className="mb-12">
                  <div className="bg-gradient-to-r from-stone-800/40 to-stone-700/40 backdrop-blur-sm rounded-2xl p-6 border border-stone-600/30">
                    <div className="flex flex-col lg:flex-row gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-amber-400" />
                        <Input
                          type="text"
                          placeholder="Buscar produtos..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-12 bg-stone-700/30 border-stone-600/40 text-stone-100 placeholder-stone-400/60 focus:border-amber-400 focus:ring-amber-400/20 h-12"
                        />
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Select value={selectedType} onValueChange={setSelectedType}>
                          <SelectTrigger className="w-36 bg-stone-700/30 border-stone-600/40 text-stone-100 h-12">
                            <Filter className="h-4 w-4 mr-2 text-amber-400" />
                            <SelectValue placeholder="Tipo" />
                          </SelectTrigger>
                          <SelectContent className="bg-stone-800 border-stone-700">
                            {types.map((type) => (
                              <SelectItem key={type} value={type} className="text-stone-100 focus:bg-stone-700">
                                {type === "all" ? "Todos os Tipos" : type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger className="w-40 bg-stone-700/30 border-stone-600/40 text-stone-100 h-12">
                            <SelectValue placeholder="Categoria" />
                          </SelectTrigger>
                          <SelectContent className="bg-stone-800 border-stone-700">
                            {categories.map((category) => (
                              <SelectItem key={category} value={category} className="text-stone-100 focus:bg-stone-700">
                                {category === "all" ? "Todas Categorias" : category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select value={selectedColor} onValueChange={setSelectedColor}>
                          <SelectTrigger className="w-32 bg-stone-700/30 border-stone-600/40 text-stone-100 h-12">
                            <SelectValue placeholder="Cor" />
                          </SelectTrigger>
                          <SelectContent className="bg-stone-800 border-stone-700">
                            {colors.map((color) => (
                              <SelectItem key={color} value={color} className="text-stone-100 focus:bg-stone-700">
                                {color === "all" ? "Todas Cores" : color}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select value={selectedOccasion} onValueChange={setSelectedOccasion}>
                          <SelectTrigger className="w-36 bg-stone-700/30 border-stone-600/40 text-stone-100 h-12">
                            <SelectValue placeholder="Ocasião" />
                          </SelectTrigger>
                          <SelectContent className="bg-stone-800 border-stone-700">
                            {occasions.map((occasion) => (
                              <SelectItem key={occasion} value={occasion} className="text-stone-100 focus:bg-stone-700">
                                {occasion === "all" ? "Todas Ocasiões" : occasion}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="group bg-gradient-to-br from-stone-800/20 to-stone-700/20 backdrop-blur-sm border border-stone-600/30 hover:border-amber-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/10 transform hover:scale-105"
                    >
                      <CardContent className="p-6">
                        <div className="relative mb-6 overflow-hidden rounded-xl">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            width={400}
                            height={400}
                            className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                          {product.featured && (
                            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white border-0">
                              <Crown className="h-3 w-3 mr-1" />
                              Destaque
                            </Badge>
                          )}

                          <Badge className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-sm text-amber-200 border-0 text-xs">
                            {product.type}
                          </Badge>
                        </div>

                        <h3 className="font-bold text-stone-100 mb-3 leading-tight">{product.name}</h3>

                        <p className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent mb-4">
                          R$ {product.price.toFixed(2).replace(".", ",")}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge
                            variant="secondary"
                            className="bg-stone-700/30 text-amber-300 border-stone-600/30 text-xs"
                          >
                            {product.material}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="bg-stone-700/30 text-amber-300 border-stone-600/30 text-xs"
                          >
                            {product.size}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <Button
                            onClick={() => handlePixClick(product)}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
                          >
                            <QrCode className="h-4 w-4 mr-2" />
                            Pagar com PIX
                          </Button>

                          <Button
                            onClick={() => handleWhatsAppClick(product)}
                            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105"
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Falar no WhatsApp
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-16">
                    <div className="bg-gradient-to-br from-stone-800/30 to-stone-700/30 backdrop-blur-sm rounded-2xl p-12 border border-stone-600/40 max-w-md mx-auto">
                      <Search className="h-16 w-16 text-amber-400/50 mx-auto mb-4" />
                      <p className="text-stone-300 text-lg font-medium">Nenhum produto encontrado</p>
                      <p className="text-stone-400 text-sm mt-2">Tente ajustar os filtros de busca</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-stone-800/30 to-stone-700/30 backdrop-blur-sm rounded-2xl p-12 border border-stone-600/40 max-w-md mx-auto">
                  <Gem className="h-16 w-16 text-amber-400/50 mx-auto mb-4" />
                  <p className="text-stone-300 text-lg font-medium mb-2">Produtos em breve</p>
                  <p className="text-stone-400 text-sm">Nossa coleção está sendo preparada especialmente para você</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>

        {/* Footer */}
        <footer className="bg-gradient-to-b from-stone-900/95 to-stone-800/95 backdrop-blur-md border-t border-stone-700/30">
          <div className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-6">
                <Image
                  src="/images/logo.png"
                  alt="Acessórios Onni"
                  width={160}
                  height={80}
                  className="h-16 w-auto brightness-110"
                />
                <p className="text-stone-300 leading-relaxed max-w-sm">
                  Acessórios exclusivos para mulheres que valorizam elegância, qualidade e sofisticação em cada detalhe.
                </p>
                <div className="flex space-x-4">
                  <div
                    onClick={() => window.open("https://www.instagram.com/onniacessorios/", "_blank")}
                    className="w-10 h-10 bg-pink-600/20 rounded-full flex items-center justify-center hover:bg-pink-600/40 transition-colors cursor-pointer"
                  >
                    <Instagram className="h-5 w-5 text-pink-400" />
                  </div>
                  <div className="w-10 h-10 bg-green-600/20 rounded-full flex items-center justify-center hover:bg-green-600/40 transition-colors cursor-pointer">
                    <MessageCircle className="h-5 w-5 text-green-400" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="font-bold text-amber-200 text-lg">Contato Direto</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center">
                      <MessageCircle className="h-4 w-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-amber-300 font-medium">WhatsApp</p>
                      <p className="text-stone-400 text-sm">+55 81 9797-9854</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-amber-600/20 rounded-lg flex items-center justify-center">
                      <span className="text-amber-400 text-xs font-bold">@</span>
                    </div>
                    <div>
                      <p className="text-amber-300 font-medium">Email</p>
                      <p className="text-stone-400 text-sm">contato@acessoriosonni.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div
                      onClick={() => window.open("https://www.instagram.com/onniacessorios/", "_blank")}
                      className="w-8 h-8 bg-pink-600/20 rounded-lg flex items-center justify-center cursor-pointer hover:bg-pink-600/40 transition-colors"
                    >
                      <Instagram className="h-4 w-4 text-pink-400" />
                    </div>
                    <div>
                      <p className="text-amber-300 font-medium">Instagram</p>
                      <p className="text-stone-400 text-sm">@onniacessorios</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="font-bold text-amber-200 text-lg">Informações</h3>
                <ul className="space-y-3">
                  {[
                    "Política de Privacidade",
                    "Termos de Uso",
                    "Trocas e Devoluções",
                    "Frete e Entrega",
                    "Garantia de Qualidade",
                  ].map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-stone-300 hover:text-amber-200 transition-colors duration-300 text-sm"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-stone-700/30 mt-12 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <p className="text-stone-400 text-sm">&copy; 2024 Acessórios Onni. Todos os direitos reservados.</p>
                <div className="flex items-center space-x-4 text-stone-400 text-sm">
                  <span>Desenvolvido com</span>
                  <Heart className="h-4 w-4 text-red-400 fill-current" />
                  <span>para você</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* PIX Modal */}
      <PixModal
        isOpen={showPixModal}
        onClose={() => setShowPixModal(false)}
        product={selectedProduct}
        orderId={currentOrderId}
      />
    </div>
  )
}
