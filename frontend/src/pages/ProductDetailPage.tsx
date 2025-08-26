import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api'
import { useCart } from '@/contexts/CartContext'
import { useToast } from '@/hooks/use-toast'

export default function ProductDetailPage() {
  const { id } = useParams()
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const { toast } = useToast()

  const { data: productResp, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.getProduct(String(id)),
    enabled: !!id,
  })
  const product = (productResp?.data as any) || null

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity)
      toast({
        title: 'Товар добавлен в корзину',
        description: `${product.name} (${quantity} шт.) добавлен в корзину`,
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Завантаження...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Товар не найден</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Изображение */}
        <div className="aspect-square overflow-hidden rounded-lg">
          <img
            src={product.imageUrl || '/placeholder-product.jpg'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Информация о товаре */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <div className="text-3xl font-bold">
                            {new Intl.NumberFormat('uk-UA', {
                  style: 'currency',
                  currency: 'UAH',
                }).format(product.price)}
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
                              <span className="text-sm text-muted-foreground">Кількість:</span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <Input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-20 text-center"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                >
                  +
                </Button>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              В наличии: {product.stock} шт.
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full"
              size="lg"
            >
              {product.stock === 0 ? 'Нет в наличии' : 'Добавить в корзину'}
            </Button>
          </div>

          {/* Дополнительная информация */}
          <Card>
            <CardHeader>
              <CardTitle>Характеристики</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {product.brand && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Бренд:</span>
                  <span>{product.brand}</span>
                </div>
              )}
              {product.model && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Модель:</span>
                  <span>{product.model}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Категория:</span>
                <span>{product.category?.name}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
