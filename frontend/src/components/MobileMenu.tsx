import { useAuth } from '@/contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { X, User, Package, LogOut, Music, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'

type Props = {
  open: boolean
  onClose: () => void
}

export default function MobileMenu({ open, onClose }: Props) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const handleLogout = () => {
    logout()
    onClose()
    navigate('/')
  }

  return (
    <div
      className={`fixed inset-0 z-50 transition ${open ? 'visible opacity-100' : 'invisible opacity-0'} bg-black/40 md:hidden`}
      onClick={onClose}
    >
      <nav
        className={`absolute right-0 top-0 h-full w-80 max-w-[80%] bg-background shadow-xl transition-transform ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Music className="h-6 w-6 text-primary" /> Music Shop
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Закрити меню">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 space-y-2">
          <Link to="/" onClick={onClose} className="block rounded px-3 py-2 hover:bg-accent">
            Головна
          </Link>
          <Link to="/products" onClick={onClose} className="block rounded px-3 py-2 hover:bg-accent">
            Товари
          </Link>
          {user?.role === 'ADMIN' && (
            <Link to="/admin" onClick={onClose} className="block rounded px-3 py-2 hover:bg-accent">
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Адмін панель</span>
            </Link>
          )}

          <div className="my-3 h-px bg-border" />

          {user ? (
            <>
              <Link to="/profile" onClick={onClose} className="block rounded px-3 py-2 hover:bg-accent">
                <span className="inline-flex items-center gap-2"><User className="h-4 w-4" /> Профіль</span>
              </Link>
              <Link to="/orders" onClick={onClose} className="block rounded px-3 py-2 hover:bg-accent">
                <span className="inline-flex items-center gap-2"><Package className="h-4 w-4" /> Мої замовлення</span>
              </Link>
              <button onClick={handleLogout} className="w-full text-left rounded px-3 py-2 hover:bg-accent text-red-600 inline-flex items-center gap-2">
                <LogOut className="h-4 w-4" /> Вийти
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link to="/login" onClick={onClose}><Button variant="outline" className="w-full">Увійти</Button></Link>
              <Link to="/register" onClick={onClose}><Button className="w-full">Реєстрація</Button></Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}


