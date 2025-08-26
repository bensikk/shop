import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'

export default function ProfilePage() {
  const { user, logout } = useAuth()

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Завантаження...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Профіль</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Інформація про користувача</CardTitle>
            <CardDescription>
              Ваші особисті дані та налаштування облікового запису
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Ім'я</label>
                <p className="text-lg">{user.firstName || 'Не вказано'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Прізвище</label>
                <p className="text-lg">{user.lastName || 'Не вказано'}</p>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-lg">{user.email}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Роль</label>
              <p className="text-lg capitalize">{user.role.toLowerCase()}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Дата реєстрації</label>
              <p className="text-lg">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('uk-UA') : 'Не вказано'}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          <Button variant="outline" onClick={logout}>
            Вийти з облікового запису
          </Button>
        </div>
      </div>
    </div>
  )
}
