import { useNavigate } from 'react-router-dom'
import { Trash2, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { api } from '@/lib/api'

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleCheckout = async () => {
    if (!user) {
      toast({ title: 'Потрібна авторизація', description: 'Увійдіть, щоб оформити замовлення' })
      navigate('/login')
      return
    }

    if (items.length === 0) {
      toast({ title: 'Кошик порожній', description: 'Додайте товари до кошика' })
      return
    }

    try {
      const orderPayload = {
        items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
      }
      const response = await api.createOrder(orderPayload)
      if (response.error) {
        throw new Error(response.error)
      }

      toast({ title: 'Замовлення оформлено', description: 'Дякуємо за покупку!' })
      clearCart()
      navigate('/orders')
    } catch (e: any) {
      toast({ title: 'Помилка оформлення', description: e?.message || 'Спробуйте пізніше', variant: 'destructive' })
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Кошик порожній</h1>
          <p className="text-muted-foreground mb-6">Додайте товари до кошика, щоб оформити замовлення</p>
          <Button onClick={() => navigate('/products')}>
            Перейти до товарів
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Кошик</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Список товаров */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.imageUrl || '/placeholder-product.jpg'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-muted-foreground text-sm">
                      {new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH' }).format(item.price)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

                      {/* Разом */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Разом</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Товары ({items.length}):</span>
                <span>
                  {new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH' }).format(getTotalPrice())}
                </span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Разом:</span>
                  <span>
                   {new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH' }).format(getTotalPrice())}
                  </span>
                </div>
              </div>
              <Button onClick={handleCheckout} className="w-full" size="lg">
                Оформити замовлення
              </Button>
              <Button
                variant="outline"
                onClick={clearCart}
                className="w-full"
              >
                Очистити кошик
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
