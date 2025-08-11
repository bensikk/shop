import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { User, LogOut, Package } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

export default function UserMenu() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="ghost" size="icon" aria-label="Аккаунт">
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="min-w-[200px] rounded-md border bg-popover p-2 shadow-md">
        <div className="px-2 py-1.5 text-sm text-muted-foreground">
          {user?.email}
        </div>
        <DropdownMenu.Separator className="my-1 h-px bg-border" />
        <DropdownMenu.Item asChild>
          <Link to="/profile" className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-accent">
          <User className="h-4 w-4" /> Профіль
          </Link>
        </DropdownMenu.Item>
        <DropdownMenu.Item asChild>
          <Link to="/orders" className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-accent">
            <Package className="h-4 w-4" /> Мої замовлення
          </Link>
        </DropdownMenu.Item>
        <DropdownMenu.Separator className="my-1 h-px bg-border" />
        <DropdownMenu.Item asChild>
          <button onClick={handleLogout} className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-red-600 hover:bg-accent">
            <LogOut className="h-4 w-4" /> Вийти
          </button>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
