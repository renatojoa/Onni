"use client"

import { useState, useEffect } from "react"
import { Heart, ShoppingBag, Star, MessageCircle, Search, Filter, Sparkles, Crown, Gem } from "lucide-react"
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
  color: string
  occasion: string
  size: string
  material: string
  featured: boolean
  sales: number
  rating: number
}

// Mock data - in production, this would come from your backend
const mockProducts: Product[] = [
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
    rating: 4.8,
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
    rating: 4.9,
  },
  {
    id: "3",
    name: "Pulseira Cristais Coloridos",
    price: 67.9,
    image: "/placeholder.svg?height=400&width=400",
    category: "Pulseiras",
    color: "Multicolor",
    occasion: "Festa",
    size: "Ajustável",
    material: "Cristal",
    featured: false,
    sales: 89,
    rating: 4.6,
  },
  {
    id: "4",
    name: "Anel Solitário Prata",
    price: 129.9,
    image: "/placeholder.svg?height=400&width=400",
    category: "Anéis",
    color: "Prata",
    occasion: "Noivado",
    size: "Variados",
    material: "Prata 925",
    featured: true,
    sales: 78,
    rating: 4.7,
  },
  {
    id: "5",
    name: "Conjunto Festa Dourado",
    price: 199.9,
    image: "/placeholder.svg?height=400&width=400",
    category: "Conjuntos",
    color: "Dourado",
    occasion: "Festa",
    size: "Único",
    material: "Folheado a Ouro",
    featured: true,
    sales: 134,
    rating: 4.9,
  },
  {
    id: "6",
    name: "Choker Minimalista",
    price: 39.9,
    image: "/placeholder.svg?height=400&width=400",
    category: "Colares",
    color: "Dourado",
    occasion: "Casual",
    size: "Ajustável",
    material: "Aço Inoxidável",
    featured: false,
    sales: 167,
    rating: 4.5,
  },
]

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedColor, setSelectedColor] = useState("all")
  const [selectedOccasion, setSelectedOccasion] = useState("all")

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))]
  const colors = ["all", ...Array.from(new Set(products.map((p) => p.color)))]
  const occasions = ["all", ...Array.from(new Set(products.map((p) => p.occasion)))]

  const featuredProducts = products.filter((p) => p.featured).sort((a, b) => b.sales - a.sales)

  useEffect(() => {
    let filtered = products

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    if (selectedColor !== "all") {
      filtered = filtered.filter((p) => p.color === selectedColor)
    }

    if (selectedOccasion !== "all") {
      filtered = filtered.filter((p) => p.occasion === selectedOccasion)
    }

    setFilteredProducts(filtered)
  }, [searchTerm, selectedCategory, selectedColor, selectedOccasion, products])

  const handleWhatsAppClick = (product: Product) => {
    const message = `Olá! Tenho interesse no produto: ${product.name} - R$ ${product.price.toFixed(2).replace(".", ",")}`
    const whatsappUrl = `https://wa.me/5581979798540?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header - Seção Escura */}
      <header className="bg-gradient-to-r from-black/95 to-gray-900/95 backdrop-blur-md border-b border-gray-700/30 sticky top-0 z-50">
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
                className="text-amber-200 hover:text-amber-300 hover:bg-gray-800/50 transition-all duration-300"
              >
                <Heart className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-amber-200 hover:text-amber-300 hover:bg-gray-800/50 transition-all duration-300"
              >
                <ShoppingBag className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Seção Âmbar/Dourada */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-amber-900 via-orange-800 to-amber-800">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/20 to-orange-800/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-orange-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-amber-300/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="h-8 w-8 text-amber-300 mr-3 animate-pulse" />
            <Crown className="h-10 w-10 text-amber-400" />
            <Sparkles className="h-8 w-8 text-amber-300 ml-3 animate-pulse" />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-amber-200 via-amber-100 to-orange-200 bg-clip-text text-transparent mb-6 leading-tight">
            Acessórios Onni
          </h1>

          <p className="text-xl md:text-2xl text-amber-200/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Descubra nossa coleção exclusiva de bijuterias e semi-joias.
            <span className="block mt-2 text-amber-300/80">
              Elegância e sofisticação para todos os momentos especiais.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-10 py-4 text-lg font-semibold shadow-2xl hover:shadow-amber-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <Gem className="h-5 w-5 mr-2" />
              Ver Coleção Exclusiva
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-amber-300/50 text-amber-200 hover:bg-amber-300/10 px-10 py-4 text-lg backdrop-blur-sm transition-all duration-300 bg-transparent"
            >
              Produtos em Destaque
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products - Seção Escura */}
      <section className="py-20 relative bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/30 to-transparent"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400"></div>
              <Star className="h-6 w-6 text-amber-400 mx-4" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400"></div>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent mb-4">
              Mais Vendidos
            </h2>
            <p className="text-gray-300 text-lg">Os favoritos absolutos das nossas clientes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.slice(0, 4).map((product, index) => (
              <Card
                key={product.id}
                className="group bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/30 hover:border-amber-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/10 transform hover:scale-105"
              >
                <CardContent className="p-6">
                  <div className="relative mb-6 overflow-hidden rounded-xl">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <Badge className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      {product.rating}
                    </Badge>

                    <div className="absolute top-3 right-3 bg-gray-900/80 backdrop-blur-sm text-amber-200 px-2 py-1 rounded-full text-xs font-medium">
                      #{index + 1} Mais Vendido
                    </div>
                  </div>

                  <h3 className="font-bold text-gray-100 mb-3 text-lg leading-tight">{product.name}</h3>

                  <div className="flex items-center justify-between mb-4">
                    <p className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                      R$ {product.price.toFixed(2).replace(".", ",")}
                    </p>
                    <div className="text-amber-400/70 text-sm">{product.sales} vendas</div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className="bg-gray-700/50 text-amber-300 border-gray-600/30 text-xs">
                      {product.category}
                    </Badge>
                    <Badge variant="secondary" className="bg-gray-700/50 text-amber-300 border-gray-600/30 text-xs">
                      {product.color}
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
      </section>

      {/* Filters and Products - Seção Âmbar/Dourada */}
      <section className="py-20 bg-gradient-to-br from-amber-950/80 via-orange-900/80 to-amber-900/80">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent mb-4">
              Coleção Completa
            </h2>
            <p className="text-amber-300/80 text-lg">Encontre a peça perfeita que combina com seu estilo único</p>
          </div>

          {/* Search and Filters */}
          <div className="mb-12">
            <div className="bg-gradient-to-r from-amber-900/40 to-orange-900/40 backdrop-blur-sm rounded-2xl p-6 border border-amber-700/30">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-amber-400" />
                  <Input
                    type="text"
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 bg-amber-800/30 border-amber-600/40 text-amber-100 placeholder-amber-400/60 focus:border-amber-400 focus:ring-amber-400/20 h-12"
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-40 bg-amber-800/30 border-amber-600/40 text-amber-100 h-12">
                      <Filter className="h-4 w-4 mr-2 text-amber-400" />
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent className="bg-amber-900 border-amber-700">
                      {categories.map((category) => (
                        <SelectItem key={category} value={category} className="text-amber-100 focus:bg-amber-800">
                          {category === "all" ? "Todas Categorias" : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedColor} onValueChange={setSelectedColor}>
                    <SelectTrigger className="w-32 bg-amber-800/30 border-amber-600/40 text-amber-100 h-12">
                      <SelectValue placeholder="Cor" />
                    </SelectTrigger>
                    <SelectContent className="bg-amber-900 border-amber-700">
                      {colors.map((color) => (
                        <SelectItem key={color} value={color} className="text-amber-100 focus:bg-amber-800">
                          {color === "all" ? "Todas Cores" : color}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedOccasion} onValueChange={setSelectedOccasion}>
                    <SelectTrigger className="w-36 bg-amber-800/30 border-amber-600/40 text-amber-100 h-12">
                      <SelectValue placeholder="Ocasião" />
                    </SelectTrigger>
                    <SelectContent className="bg-amber-900 border-amber-700">
                      {occasions.map((occasion) => (
                        <SelectItem key={occasion} value={occasion} className="text-amber-100 focus:bg-amber-800">
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
                className="group bg-gradient-to-br from-amber-800/20 to-orange-800/20 backdrop-blur-sm border border-amber-700/30 hover:border-amber-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/10 transform hover:scale-105"
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
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {product.featured && (
                      <Badge className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                        <Crown className="h-3 w-3 mr-1" />
                        Destaque
                      </Badge>
                    )}
                  </div>

                  <h3 className="font-bold text-amber-100 mb-3 leading-tight">{product.name}</h3>

                  <p className="text-2xl font-bold bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent mb-4">
                    R$ {product.price.toFixed(2).replace(".", ",")}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className="bg-amber-700/30 text-amber-300 border-amber-600/30 text-xs">
                      {product.material}
                    </Badge>
                    <Badge variant="secondary" className="bg-amber-700/30 text-amber-300 border-amber-600/30 text-xs">
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
              <div className="bg-gradient-to-br from-amber-800/30 to-orange-800/30 backdrop-blur-sm rounded-2xl p-12 border border-amber-700/40 max-w-md mx-auto">
                <Search className="h-16 w-16 text-amber-400/50 mx-auto mb-4" />
                <p className="text-amber-300 text-lg font-medium">Nenhum produto encontrado</p>
                <p className="text-amber-400/70 text-sm mt-2">Tente ajustar os filtros de busca</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* PIX Payment Section - Seção Escura */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/30 to-black/30"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-20 w-40 h-40 bg-amber-400/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-56 h-56 bg-orange-400/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent mb-6">
              Pagamento Instantâneo
            </h2>
            <p className="text-gray-300 text-lg mb-12 max-w-2xl mx-auto">
              Pague com PIX e receba seu produto mais rapidamente! Processo seguro e instantâneo.
            </p>

            <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm p-10 rounded-3xl border border-gray-700/30 max-w-lg mx-auto shadow-2xl">
              <div className="w-64 h-64 bg-gradient-to-br from-gray-700/30 to-gray-800/30 mx-auto mb-6 rounded-2xl flex items-center justify-center border border-gray-600/30">
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-400/20 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <Gem className="h-8 w-8 text-amber-400" />
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    QR Code PIX
                    <br />
                    <span className="text-xs text-amber-400/60">Será gerado após seleção do produto</span>
                  </p>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Escaneie o código QR com seu app do banco para pagar via PIX de forma segura e instantânea
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Seção Âmbar/Dourada */}
      <footer className="bg-gradient-to-b from-amber-950 to-amber-900 border-t border-amber-800/30">
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
              <p className="text-amber-300/80 leading-relaxed max-w-sm">
                Acessórios exclusivos para mulheres que valorizam elegância, qualidade e sofisticação em cada detalhe.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-amber-700/30 rounded-full flex items-center justify-center hover:bg-amber-600/40 transition-colors cursor-pointer">
                  <span className="text-amber-300 text-sm font-bold">IG</span>
                </div>
                <div className="w-10 h-10 bg-amber-700/30 rounded-full flex items-center justify-center hover:bg-amber-600/40 transition-colors cursor-pointer">
                  <MessageCircle className="h-5 w-5 text-amber-300" />
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
                    <p className="text-amber-400/80 text-sm">+55 81 9797-9854</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-amber-600/20 rounded-lg flex items-center justify-center">
                    <span className="text-amber-400 text-xs font-bold">@</span>
                  </div>
                  <div>
                    <p className="text-amber-300 font-medium">Email</p>
                    <p className="text-amber-400/80 text-sm">contato@acessoriosonni.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-pink-600/20 rounded-lg flex items-center justify-center">
                    <span className="text-pink-400 text-xs font-bold">IG</span>
                  </div>
                  <div>
                    <p className="text-amber-300 font-medium">Instagram</p>
                    <p className="text-amber-400/80 text-sm">@acessoriosonni</p>
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
                      className="text-amber-300/80 hover:text-amber-200 transition-colors duration-300 text-sm"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-amber-800/30 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-amber-400/70 text-sm">&copy; 2024 Acessórios Onni. Todos os direitos reservados.</p>
              <div className="flex items-center space-x-4 text-amber-400/70 text-sm">
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
