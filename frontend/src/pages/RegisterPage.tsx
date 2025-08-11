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

const registerSchema = z.object({
  email: z.string().email('Введіть коректний email'),
  password: z.string().min(6, 'Пароль має містити мінімум 6 символів'),
  firstName: z.string().min(2, 'Імʼя має містити мінімум 2 символи'),
  lastName: z.string().min(2, 'Прізвище має містити мінімум 2 символи'),
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterForm) => {
    const ok = await registerUser({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
    })
    if (ok) {
      toast({ title: 'Реєстрація успішна', description: 'Ласкаво просимо!' })
      navigate('/')
    } else {
      toast({ title: 'Помилка реєстрації', description: 'Не вдалося зареєструватися', variant: 'destructive' })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Реєстрація</CardTitle>
            <CardDescription>Створіть акаунт для доступу до кабінету</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Input
                  {...register('firstName')}
                  placeholder="Імʼя"
                  className={errors.firstName ? 'border-red-500' : ''}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <Input
                  {...register('lastName')}
                  placeholder="Прізвище"
                  className={errors.lastName ? 'border-red-500' : ''}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                )}
              </div>

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
                {isSubmitting ? 'Реєстрація...' : 'Зареєструватися'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Вже є акаунт?{' '}
                <Link to="/login" className="text-primary hover:underline">Увійти</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
