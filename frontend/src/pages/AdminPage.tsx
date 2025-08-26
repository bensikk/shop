import { Link, Routes, Route, Navigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Package, ShoppingCart, Settings } from 'lucide-react'
import AdminOrdersPage from '@/pages/admin/AdminOrdersPage'
import AdminProductsPage from '@/pages/admin/AdminProductsPage'
import AdminCategoriesPage from '@/pages/admin/AdminCategoriesPage'

export default function AdminPage() {
  const adminSections = [
    {
      title: 'Управління товарами',
      description: 'Додавання, редагування та видалення товарів',
      icon: Package,
      href: '/admin/products',
    },
    {
      title: 'Управління категоріями',
      description: 'Створення та редагування категорій',
      icon: Settings,
      href: '/admin/categories',
    },
    {
      title: 'Управління замовленнями',
      description: 'Перегляд та обробка замовлень клієнтів',
      icon: ShoppingCart,
      href: '/admin/orders',
    },
    // Пункт пользователей удалён по запросу
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Панель адміністратора</h1>
      <Routes>
        <Route
          path="/"
          element={
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {adminSections.map((section) => {
                const Icon = section.icon
                return (
                  <Card key={section.title} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <Icon className="h-8 w-8 text-primary" />
                        <div>
                          <CardTitle>{section.title}</CardTitle>
                          <CardDescription>{section.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button asChild className="w-full">
                        <Link to={section.href}>Перейти</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          }
        />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </div>
  )
}
