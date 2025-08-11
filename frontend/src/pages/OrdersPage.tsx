import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/api'

const statusLabels = {
  PENDING: 'Очікує підтвердження',
  CONFIRMED: 'Підтверджено',
  SHIPPED: 'Відправлено',
  DELIVERED: 'Доставлено',
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
}

export default function OrdersPage() {
  const { data: ordersResp, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => api.getOrders(),
  })
  const orders = (ordersResp?.data as any[]) || []

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Завантаження...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Мої замовлення</h1>
      
      {orders?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">У вас поки немає замовлень</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders?.map((order: any) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                                          <CardTitle>Замовлення #{order.id}</CardTitle>
                    <CardDescription>
                      {new Date(order.createdAt).toLocaleDateString('uk-UA')}
                    </CardDescription>
                  </div>
                  <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                    {statusLabels[order.status as keyof typeof statusLabels]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.orderItems.map((item: any) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <img
                        src={item.product.imageUrl || '/placeholder-product.jpg'}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Кількість: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                                            {new Intl.NumberFormat('uk-UA', {
                    style: 'currency',
                    currency: 'UAH',
                  }).format(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold text-lg">
                                              <span>Разом:</span>
                      <span>
                                        {new Intl.NumberFormat('uk-UA', {
                  style: 'currency',
                  currency: 'UAH',
                }).format(order.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
