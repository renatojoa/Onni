"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Save, X, BarChart3, Package, Star, TrendingUp, Crown, Gem } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
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
  rating: number
  description?: string
}

// Mock data - same as homepage
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
    rating: 4.8,
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
    rating: 4.9,
    description: "Brincos clássicos de pérola, ideais para o dia a dia.",
  },
]

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<Partial<Product>>({})

  const categories = ["Colares", "Brincos", "Pulseiras", "Anéis", "Conjuntos"]
  const colors = ["Dourado", "Prata", "Branco", "Preto", "Multicolor", "Rosa"]
  const occasions = ["Casual", "Festa", "Trabalho", "Noivado", "Casamento"]
  const materials = ["Folheado a Ouro", "Prata 925", "Aço Inoxidável", "Pérola Sintética", "Cristal"]
  const sizes = ["Pequeno", "Médio", "Grande", "Ajustável", "Variados", "Único"]

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
        rating: 0,
        description: formData.description || "",
      }
      setProducts((prev) => [...prev, newProduct])
      setIsAddingProduct(false)
    }
    setFormData({})
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setFormData(product)
  }

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const totalRevenue = products.reduce((sum, p) => sum + p.price * p.sales, 0)
  const avgRating = products.reduce((sum, p) => sum + p.rating, 0) / products.length || 0

  const ProductForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-200 font-medium">
            Nome do Produto
          </Label>
          <Input
            id="name"
            value={formData.name || ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Nome do produto"
            className="bg-gray-800/50 border-gray-600/30 text-gray-100 placeholder-gray-400/60 focus:border-amber-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price" className="text-gray-200 font-medium">
            Preço (R$)
          </Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price || ""}
            onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value))}
            placeholder="0.00"
            className="bg-gray-800/50 border-gray-600/30 text-gray-100 placeholder-gray-400/60 focus:border-amber-400"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-gray-200 font-medium">
          Descrição
        </Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Descrição detalhada do produto"
          rows={4}
          className="bg-gray-800/50 border-gray-600/30 text-gray-100 placeholder-gray-400/60 focus:border-amber-400"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="category" className="text-gray-200 font-medium">
            Categoria
          </Label>
          <Select value={formData.category || ""} onValueChange={(value) => handleInputChange("category", value)}>
            <SelectTrigger className="bg-gray-800/50 border-gray-600/30 text-gray-100">
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {categories.map((category) => (
                <SelectItem key={category} value={category} className="text-gray-100 focus:bg-gray-700">
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="color" className="text-gray-200 font-medium">
            Cor
          </Label>
          <Select value={formData.color || ""} onValueChange={(value) => handleInputChange("color", value)}>
            <SelectTrigger className="bg-gray-800/50 border-gray-600/30 text-gray-100">
              <SelectValue placeholder="Selecione a cor" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {colors.map((color) => (
                <SelectItem key={color} value={color} className="text-gray-100 focus:bg-gray-700">
                  {color}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="occasion" className="text-gray-200 font-medium">
            Ocasião
          </Label>
          <Select value={formData.occasion || ""} onValueChange={(value) => handleInputChange("occasion", value)}>
            <SelectTrigger className="bg-gray-800/50 border-gray-600/30 text-gray-100">
              <SelectValue placeholder="Selecione a ocasião" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {occasions.map((occasion) => (
                <SelectItem key={occasion} value={occasion} className="text-gray-100 focus:bg-gray-700">
                  {occasion}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="size" className="text-gray-200 font-medium">
            Tamanho
          </Label>
          <Select value={formData.size || ""} onValueChange={(value) => handleInputChange("size", value)}>
            <SelectTrigger className="bg-gray-800/50 border-gray-600/30 text-gray-100">
              <SelectValue placeholder="Selecione o tamanho" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {sizes.map((size) => (
                <SelectItem key={size} value={size} className="text-gray-100 focus:bg-gray-700">
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="material" className="text-gray-200 font-medium">
          Material
        </Label>
        <Select value={formData.material || ""} onValueChange={(value) => handleInputChange("material", value)}>
          <SelectTrigger className="bg-gray-800/50 border-gray-600/30 text-gray-100">
            <SelectValue placeholder="Selecione o material" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            {materials.map((material) => (
              <SelectItem key={material} value={material} className="text-gray-100 focus:bg-gray-700">
                {material}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image" className="text-gray-200 font-medium">
          URL da Imagem
        </Label>
        <Input
          id="image"
          value={formData.image || ""}
          onChange={(e) => handleInputChange("image", e.target.value)}
          placeholder="URL da imagem do produto"
          className="bg-gray-800/50 border-gray-600/30 text-gray-100 placeholder-gray-400/60 focus:border-amber-400"
        />
      </div>

      <div className="flex items-center space-x-3 p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
        <Switch
          id="featured"
          checked={formData.featured || false}
          onCheckedChange={(checked) => handleInputChange("featured", checked)}
          className="data-[state=checked]:bg-amber-500"
        />
        <Label htmlFor="featured" className="text-gray-200 font-medium flex items-center">
          <Crown className="h-4 w-4 mr-2 text-amber-400" />
          Produto em Destaque
        </Label>
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          onClick={handleSaveProduct}
          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 flex-1"
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
          className="border-gray-600/30 text-gray-300 hover:bg-gray-800/30"
        >
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header */}
      <header className="bg-gradient-to-r from-black/95 to-gray-900/95 backdrop-blur-md border-b border-gray-700/30 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
                    Painel Administrativo
                  </h1>
                  <p className="text-gray-400 text-sm">Acessórios Onni</p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setIsAddingProduct(true)}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Produto
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-300">Total de Produtos</CardTitle>
                <Package className="h-5 w-5 text-amber-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-100">{products.length}</div>
              <p className="text-gray-400 text-xs mt-1">produtos cadastrados</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-300">Produtos em Destaque</CardTitle>
                <Crown className="h-5 w-5 text-amber-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-100">{products.filter((p) => p.featured).length}</div>
              <p className="text-gray-400 text-xs mt-1">em destaque</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-300">Total de Vendas</CardTitle>
                <TrendingUp className="h-5 w-5 text-amber-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-100">{products.reduce((sum, p) => sum + p.sales, 0)}</div>
              <p className="text-gray-400 text-xs mt-1">unidades vendidas</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-300">Avaliação Média</CardTitle>
                <Star className="h-5 w-5 text-amber-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-100">{avgRating.toFixed(1)}</div>
              <p className="text-gray-400 text-xs mt-1">de 5.0 estrelas</p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Card */}
        <Card className="mb-8 bg-gradient-to-r from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-gray-200">Receita Total</CardTitle>
                  <p className="text-gray-400 text-sm">Baseada nas vendas registradas</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  R$ {totalRevenue.toFixed(2).replace(".", ",")}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Add Product Form */}
        {isAddingProduct && (
          <Card className="mb-8 bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/30">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Plus className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-gray-200">Adicionar Novo Produto</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ProductForm />
            </CardContent>
          </Card>
        )}

        {/* Edit Product Form */}
        {editingProduct && (
          <Card className="mb-8 bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/30">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Edit className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-gray-200">Editar Produto</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ProductForm />
            </CardContent>
          </Card>
        )}

        {/* Products List */}
        <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/30">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Gem className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-gray-200">Produtos Cadastrados</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="bg-gradient-to-br from-gray-700/20 to-gray-800/20 border border-gray-600/30 hover:border-amber-500/40 transition-all duration-300"
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
                        <Badge className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                          <Crown className="h-3 w-3 mr-1" />
                          Destaque
                        </Badge>
                      )}
                    </div>

                    <h3 className="font-bold text-gray-100 mb-2 leading-tight">{product.name}</h3>
                    <p className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-3">
                      R$ {product.price.toFixed(2).replace(".", ",")}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      <Badge variant="secondary" className="bg-gray-700/30 text-amber-300 border-gray-600/30 text-xs">
                        {product.category}
                      </Badge>
                      <Badge variant="secondary" className="bg-gray-700/30 text-amber-300 border-gray-600/30 text-xs">
                        {product.color}
                      </Badge>
                      <Badge variant="secondary" className="bg-gray-700/30 text-amber-300 border-gray-600/30 text-xs">
                        {product.material}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <span>Vendas: {product.sales}</span>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 mr-1 fill-current text-amber-400" />
                        {product.rating}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditProduct(product)}
                        className="flex-1 border-gray-600/30 text-gray-300 hover:bg-gray-800/30"
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
                <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-2xl p-12 border border-gray-700/30 max-w-md mx-auto">
                  <Package className="h-16 w-16 text-gray-400/50 mx-auto mb-4" />
                  <p className="text-gray-300 text-lg font-medium mb-2">Nenhum produto cadastrado</p>
                  <p className="text-gray-400 text-sm mb-6">Comece adicionando seu primeiro produto</p>
                  <Button
                    onClick={() => setIsAddingProduct(true)}
                    className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Primeiro Produto
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
