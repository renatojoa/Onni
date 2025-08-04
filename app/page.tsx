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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

// Carousel Component
function ProductCarousel({ products, title }: { products: Product[]; title: string }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerView = 4

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + itemsPerView >= products.length ? 0 : prev + itemsPerView))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? Math.max(0, products.length - itemsPerView) : Math.max(0, prev - itemsPerView),
    )
  }

  const handleWhatsAppClick = (product: Product) => {
    const message = `Olá! Tenho interesse no produto: ${product.name} - R$ ${product.price.toFixed(2).replace(".", ",")}`
    const whatsappUrl = `https://wa.me/81979798540?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const visibleProducts = products.slice(currentIndex, currentIndex + itemsPerView)

  return (
    <div className="mb-16">
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

              <Button
                onClick={() => handleWhatsAppClick(product)}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Desejo Comprar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
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

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))]
  const types = ["all", ...Array.from(new Set(products.map((p) => p.type)))]
  const colors = ["all", ...Array.from(new Set(products.map((p) => p.color)))]
  const occasions = ["all", ...Array.from(new Set(products.map((p) => p.occasion)))]

  const featuredProducts = products.filter((p) => p.featured).sort((a, b) => b.sales - a.sales)
  const joias = products.filter((p) => p.type === "Joias")
  const semijoias = products.filter((p) => p.type === "Semijoias")
  const bijuterias = products.filter((p) => p.type === "Bijuterias")

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
    const message = `Olá! Tenho interesse no produto: ${product.name} - R$ ${product.price.toFixed(2).replace(".", ",")}`
    const whatsappUrl = `https://wa.me/81979798540?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900">
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
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-amber-800 via-amber-700 to-stone-700">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/20 to-stone-800/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-stone-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-amber-300/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

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

      {/* Instagram Section */}
      <section className="py-16 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Instagram className="h-8 w-8 text-pink-400 mr-3" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-amber-400 bg-clip-text text-transparent">
                Siga-nos no Instagram
              </h2>
              <Instagram className="h-8 w-8 text-pink-400 ml-3" />
            </div>
            <p className="text-stone-300 text-lg mb-8">
              Acompanhe nossas novidades, tendências e inspirações diárias no @onniacessorios
            </p>
            <Button
              size="lg"
              onClick={() => window.open("https://www.instagram.com/onniacessorios/", "_blank")}
              className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <Instagram className="h-5 w-5 mr-2" />
              @onniacessorios
            </Button>
          </div>
        </div>
      </section>

      {/* Product Categories Carousels */}
      <section className="py-20 bg-gradient-to-br from-amber-900/80 via-stone-800/80 to-amber-800/80">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-200 to-stone-200 bg-clip-text text-transparent mb-4">
              Nossas Coleções
            </h2>
            <p className="text-amber-300/80 text-lg">Descubra a categoria perfeita para cada ocasião</p>
          </div>

          <ProductCarousel products={joias} title="💎 Joias" />
          <ProductCarousel products={semijoias} title="✨ Semijoias" />
          <ProductCarousel products={bijuterias} title="🌟 Bijuterias" />
        </div>
      </section>

      {/* Filters and Products */}
      <section className="py-20 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-300 to-stone-300 bg-clip-text text-transparent mb-4">
              Coleção Completa
            </h2>
            <p className="text-stone-300 text-lg">Encontre a peça perfeita que combina com seu estilo único</p>
          </div>

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
                    <Badge variant="secondary" className="bg-stone-700/30 text-amber-300 border-stone-600/30 text-xs">
                      {product.material}
                    </Badge>
                    <Badge variant="secondary" className="bg-stone-700/30 text-amber-300 border-stone-600/30 text-xs">
                      {product.size}
                    </Badge>
                  </div>

                  <Button
                    onClick={() => handleWhatsAppClick(product)}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Desejo Comprar
                  </Button>
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
        </div>
      </section>

      {/* PIX Payment Section */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-br from-amber-800 via-amber-700 to-stone-700">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/30 to-stone-800/30"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-20 w-40 h-40 bg-amber-400/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-56 h-56 bg-stone-400/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-200 to-stone-200 bg-clip-text text-transparent mb-6">
              Pagamento Instantâneo
            </h2>
            <p className="text-amber-300/80 text-lg mb-12 max-w-2xl mx-auto">
              Pague com PIX e receba seu produto mais rapidamente! Processo seguro e instantâneo.
            </p>

            <div className="bg-gradient-to-br from-stone-800/30 to-amber-800/30 backdrop-blur-sm p-10 rounded-3xl border border-stone-700/30 max-w-lg mx-auto shadow-2xl">
              <div className="w-64 h-64 bg-gradient-to-br from-stone-700/30 to-amber-700/30 mx-auto mb-6 rounded-2xl flex items-center justify-center border border-stone-600/30">
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-400/20 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <Gem className="h-8 w-8 text-amber-400" />
                  </div>
                  <p className="text-amber-300/70 text-sm leading-relaxed">
                    QR Code PIX
                    <br />
                    <span className="text-xs text-amber-400/60">Será gerado após seleção do produto</span>
                  </p>
                </div>
              </div>
              <p className="text-amber-300/80 text-sm leading-relaxed">
                Escaneie o código QR com seu app do banco para pagar via PIX de forma segura e instantânea
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-stone-900 to-stone-800 border-t border-stone-700/30">
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
                    <a href="#" className="text-stone-300 hover:text-amber-200 transition-colors duration-300 text-sm">
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
  )
}
