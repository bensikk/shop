import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Music, Menu } from 'lucide-react'
import { useState } from 'react'
import MobileMenu from '@/components/MobileMenu'
import UserMenu from '@/components/UserMenu'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { user } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { getTotalItems } = useCart()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Music className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Music Shop</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Головна
              </Link>
              <Link
                to="/products"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/products') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Товари
              </Link>
              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive('/admin') ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  Адмін панель
                </Link>
              )}
            </nav>

            {/* Mobile burger */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)} aria-label="Відкрити меню">
                <Menu className="h-6 w-6" />
              </Button>
            </div>

            {/* User actions */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Cart */}
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="h-5 w-5" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </Button>
              </Link>

              {/* User menu */}
              {user ? (
                <UserMenu />
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login">
                    <Button variant="ghost">Увійти</Button>
                  </Link>
                  <Link to="/register">
                    <Button>Реєстрація</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      {/* Mobile menu */}
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Music Shop</h3>
              <p className="text-muted-foreground">
                Кращі музичні інструменти для професіоналів і аматорів
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Категорії</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/products" className="hover:text-primary">Гітари</Link></li>
                <li><Link to="/products" className="hover:text-primary">Клавішні</Link></li>
                <li><Link to="/products" className="hover:text-primary">Ударні</Link></li>
                <li><Link to="/products" className="hover:text-primary">Духові</Link></li>
              </ul>
            </div>  
            <div>
              <h3 className="text-lg font-semibold mb-4">Контакти</h3>
              <p className="text-muted-foreground">
                Email: info@musicshop.com<br />
                Телефон: +380 (99) 123-45-67
              </p>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Music Shop. Всі права захищені.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
