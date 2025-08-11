import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

const loginSchema = z.object({
  email: z.string().email('Введіть коректний email'),
  password: z.string().min(6, 'Пароль має містити мінімум 6 символів'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    const ok = await login(data.email, data.password)
    if (ok) {
      toast({ title: 'Успішний вхід', description: 'Ласкаво просимо!' })
      navigate('/')
    } else {
      toast({ title: 'Помилка входу', description: 'Невірний email або пароль', variant: 'destructive' })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Вхід до системи</CardTitle>
            <CardDescription>Увійдіть у свій акаунт для доступу до кабінету</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Input
                  {...register('email')}
                  type="email"
                  placeholder="Email"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Input
                  {...register('password')}
                  type="password"
                  placeholder="Пароль"
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Вхід...' : 'Увійти'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Немає акаунта?{' '}
                <Link to="/register" className="text-primary hover:underline">Зареєструватися</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
