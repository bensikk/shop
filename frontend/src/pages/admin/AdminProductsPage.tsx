import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

type NewProduct = {
  name: string
  description: string
  price: number
  stock: number
  brand?: string
  model?: string
  imageUrl?: string
  categoryId: number
}

export default function AdminProductsPage() {
  const { toast } = useToast()

  const { data: productsResp, refetch: refetchProducts } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => api.getProducts(),
  })
  const products = (productsResp?.data as any[]) || []

  const { data: categoriesResp} = useQuery({
    queryKey: ['admin-categories-for-products'],
    queryFn: () => api.getCategories(),
  })
  const categories = (categoriesResp?.data as any[]) || []

  const [form, setForm] = useState<NewProduct>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    brand: '',
    model: '',
    imageUrl: '',
    categoryId: 0,
  })
  const [file, setFile] = useState<File | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)

  const resetForm = () => {
    setForm({ name: '', description: '', price: 0, stock: 0, brand: '', model: '', imageUrl: '', categoryId: 0 })
    setEditingId(null)
  }

  const createMutation = useMutation({
    mutationFn: async (payload: NewProduct) => {
      return api.createProduct(payload)
    },
    onSuccess: () => {
      toast({ title: 'Товар створено' })
      resetForm()
      refetchProducts()
    },
    onError: (e: any) => toast({ title: 'Помилка створення товару', description: e?.message || 'Спробуйте пізніше', variant: 'destructive' }),
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<NewProduct> }) => {
      return api.updateProduct(String(id), data)
    },
    onSuccess: () => {
      toast({ title: 'Товар оновлено' })
      resetForm()
      refetchProducts()
    },
    onError: (e: any) => toast({ title: 'Помилка оновлення товару', description: e?.message || 'Спробуйте пізніше', variant: 'destructive' }),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => api.deleteProduct(String(id)),
    onSuccess: () => {
      toast({ title: 'Товар видалено' })
      refetchProducts()
    },
    onError: (e: any) => toast({ title: 'Помилка видалення', description: e?.message || 'Спробуйте пізніше', variant: 'destructive' }),
  })

  const onSubmit = async () => {
    if (!form.name || !form.description || !form.categoryId) {
      toast({ title: 'Заповніть обов\'язкові поля', variant: 'destructive' })
      return
    }
    const payload: NewProduct = {
      name: form.name,
      description: form.description,
      price: Number(form.price) || 0,
      stock: Number(form.stock) || 0,
      brand: form.brand || undefined,
      model: form.model || undefined,
      imageUrl: form.imageUrl || undefined,
      categoryId: Number(form.categoryId),
    }
    // Якщо вибрано файл — завантажуємо, отримуємо посилання і підставляємо
    if (file) {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/uploads', { method: 'POST', body: formData })
      if (res.ok) {
        const data = await res.json()
        payload.imageUrl = data.url
      }
    }
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const startEdit = (p: any) => {
    setEditingId(p.id)
    setForm({
      name: p.name || '',
      description: p.description || '',
      price: Number(p.price) || 0,
      stock: Number(p.stock) || 0,
      brand: p.brand || '',
      model: p.model || '',
      imageUrl: p.imageUrl || '',
      categoryId: Number(p.categoryId) || 0,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold">Управління товарами</h1>

      <Card>
        <CardHeader>
          <CardTitle>{editingId ? 'Редагувати товар' : 'Новий товар'}</CardTitle>
          <CardDescription>Заповніть поля і натисніть «Створити/Зберегти»</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Назва</label>
            <Input placeholder="Напр.: Fender Stratocaster" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Бренд</label>
            <Input placeholder="Напр.: Fender" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Модель</label>
            <Input placeholder="Напр.: 214ce" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Ціна, грн</label>
            <Input placeholder="0" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            <p className="text-xs text-muted-foreground">Вкажіть роздрібну ціну у гривнях</p>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Залишок, шт</label>
            <Input placeholder="0" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
            <p className="text-xs text-muted-foreground">Кількість на складі</p>
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-sm font-medium">Зображення товару</label>
            <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
              <Input
                placeholder="Посилання на зображення (необовʼязково)"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="md:w-2/3"
              />
              <label>
                <Button type="button" variant="outline" className="whitespace-nowrap">
                  Додати зображення
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  style={{ display: 'none' }}
                />
              </label>
              {file && (
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="h-12 w-12 object-cover rounded border ml-2"
                />
              )}
              {!file && form.imageUrl && (
                <img
                  src={form.imageUrl}
                  alt="preview"
                  className="h-12 w-12 object-cover rounded border ml-2"
                />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Можна вказати посилання або завантажити файл
            </p>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Категорія</label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value={0}>Оберіть категорію</option>
              {categories.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-sm font-medium">Опис</label>
            <Input placeholder="Короткий опис товару" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="flex gap-2 md:col-span-2">
            <Button onClick={onSubmit}>{editingId ? 'Зберегти' : 'Створити'}</Button>
            {editingId && (
              <Button variant="outline" onClick={resetForm}>
                Скасувати
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {products.map((p: any) => (
          <Card key={p.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{p.name}</CardTitle>
                  <CardDescription>
                    {p.brand ? `${p.brand} ` : ''}
                    {p.model ? p.model : ''} • Категорія: {p.category?.name || p.categoryId}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => startEdit(p)}>
                    Редагувати
                  </Button>
                  <Button variant="destructive" onClick={() => deleteMutation.mutate(p.id)}>
                    Видалити
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold">
                  {new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH' }).format(p.price)}
                </div>
                <div className="text-sm text-muted-foreground">Залишок: {p.stock}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


