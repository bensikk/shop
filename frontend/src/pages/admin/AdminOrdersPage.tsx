import { useQuery, useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { api } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

const STATUS_OPTIONS = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const

const STATUS_LABELS = {
  PENDING: 'Очікує підтвердження',
  CONFIRMED: 'Підтверджено',
  SHIPPED: 'Відправлено',
  DELIVERED: 'Доставлено',
  CANCELLED: 'Скасовано',
}

export default function AdminOrdersPage() {
  const { toast } = useToast()

  const { data: ordersResp, isLoading, refetch } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => api.getAllOrders(),
  })
  const orders = (ordersResp?.data as any[]) || []

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const resp = await api.updateOrderStatus(String(id), status)
      if (resp.error) throw new Error(resp.error)
      return resp
    },
    onSuccess: () => {
      toast({ title: 'Статус оновлено' })
      refetch()
    },
    onError: (e: any) => toast({ title: 'Помилка оновлення', description: e?.message || 'Спробуйте пізніше', variant: 'destructive' }),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const resp = await api.deleteOrder(String(id))
      if (resp.error) throw new Error(resp.error)
      return resp
    },
    onSuccess: () => {
      toast({ title: 'Замовлення видалено' })
      refetch()
    },
    onError: (e: any) => toast({ title: 'Помилка видалення', description: e?.message || 'Спробуйте пізніше', variant: 'destructive' }),
  })

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Завантаження...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Управління замовленнями</h1>

      {orders.length === 0 && <p className="text-muted-foreground">Замовлень поки немає</p>}

      {orders.map((order: any) => (
        <Card key={order.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Замовлення #{order.id}</CardTitle>
                <CardDescription>
                  Клієнт: {order.user?.email} • від {new Date(order.createdAt).toLocaleString('uk-UA')}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <select
                  defaultValue={order.status}
                  onChange={(e) => statusMutation.mutate({ id: order.id, status: e.target.value })}
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  disabled={statusMutation.isPending}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (window.confirm('Ви впевнені, що хочете видалити це замовлення?')) {
                      deleteMutation.mutate(order.id)
                    }
                  }}
                  disabled={deleteMutation.isPending}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                >
                  {deleteMutation.isPending ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {order.orderItems.map((item: any) => (
              <div key={item.id} className="flex items-center gap-3">
                <img src={item.product?.imageUrl || '/placeholder-product.jpg'} alt="" className="w-12 h-12 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-medium">{item.product?.name}</div>
                  <div className="text-sm text-muted-foreground">Кількість: {item.quantity}</div>
                </div>
                <div className="font-medium">
                  {new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH' }).format(item.price)}
                </div>
              </div>
            ))}
            <div className="border-t pt-3 flex justify-between font-semibold">
              <span>Разом</span>
              <span>{new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH' }).format(order.total)}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


