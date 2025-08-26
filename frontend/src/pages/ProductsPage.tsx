import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatPrice } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api'
import { useCart } from '@/contexts/CartContext'
import { useToast } from '@/hooks/use-toast'
import { Link } from 'react-router-dom'

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [minPriceInput, setMinPriceInput] = useState('')
  const [maxPriceInput, setMaxPriceInput] = useState('')

  // Дебаунс значений цены, чтобы запрос уходил после паузы ввода
  const [debounceTimer, setDebounceTimer] = useState<any>(null)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const handlePriceChange = (setterInput: (v: string) => void, setterQuery: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setterInput(value)
    if (debounceTimer) clearTimeout(debounceTimer)
    const t = setTimeout(() => setterQuery(value), 500)
    setDebounceTimer(t)
  }
  const { addToCart } = useCart()
  const { toast } = useToast()

  const { data: productsResp, isLoading } = useQuery({
    queryKey: ['products', { search, category, minPrice, maxPrice }],
    queryFn: () => api.getProducts({ search, categoryId: category, minPrice, maxPrice }),
  })

  const { data: categoriesResp } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.getCategories(),
  })

  const products = (productsResp?.data as any[]) || []
  const categories = (categoriesResp?.data as any[]) || []

  const handleAddToCart = (product: any) => {
    addToCart(product, 1)
    toast({
      title: 'Товар добавлен в корзину',
      description: `${product.name} добавлен в корзину`,
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Завантаження...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Музичні інструменти</h1>
        
        {/* Фильтры */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Пошук товарів..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          >
            <option value="">Усі категорії</option>
            {categories?.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          
            <Input
              placeholder="Мін. ціна"
              type="number"
              value={minPriceInput}
              onChange={handlePriceChange(setMinPriceInput, setMinPrice)}
            />
          
            <Input
              placeholder="Макс. ціна"
              type="number"
              value={maxPriceInput}
              onChange={handlePriceChange(setMaxPriceInput, setMaxPrice)}
            />
        </div>
      </div>

      {/* Список товаров */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products?.map((product: any) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-square overflow-hidden">
              <img
                src={product.imageUrl || '/placeholder-product.jpg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">
                <Link to={`/products/${product.id}`} className="hover:underline">
                  {product.name}
                </Link>
              </CardTitle>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
                <span className="text-sm text-muted-foreground">В наявності: {product.stock}</span>
              </div>
              <Button
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === 0}
                className="w-full"
              >
                {product.stock === 0 ? 'Немає в наявності' : 'У кошик'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {products?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Товари не знайдено</p>
        </div>
      )}
    </div>
  )
}
