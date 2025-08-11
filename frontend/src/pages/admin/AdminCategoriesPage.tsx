import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

type CategoryForm = { name: string; description?: string; imageUrl?: string }

export default function AdminCategoriesPage() {
  const { toast } = useToast()
  const { data: categoriesResp, refetch } = useQuery({ queryKey: ['admin-categories'], queryFn: () => api.getCategories() })
  const categories = (categoriesResp?.data as any[]) || []

  const [form, setForm] = useState<CategoryForm>({ name: '', description: '', imageUrl: '' })
  const [editingId, setEditingId] = useState<number | null>(null)

  const reset = () => {
    setForm({ name: '', description: '', imageUrl: '' })
    setEditingId(null)
  }

  const createMutation = useMutation({
    mutationFn: async (payload: CategoryForm) => api.createCategory(payload),
    onSuccess: () => {
      toast({ title: 'Категорію створено' })
      reset()
      refetch()
    },
  })
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: CategoryForm }) => api.updateCategory(String(id), data),
    onSuccess: () => {
      toast({ title: 'Категорію оновлено' })
      reset()
      refetch()
    },
  })
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => api.deleteCategory(String(id)),
    onSuccess: () => {
      toast({ title: 'Категорію видалено' })
      refetch()
    },
  })

  const onSubmit = () => {
    const payload: CategoryForm = { name: form.name, description: form.description || undefined, imageUrl: form.imageUrl || undefined }
    if (editingId) updateMutation.mutate({ id: editingId, data: payload })
    else createMutation.mutate(payload)
  }

  const startEdit = (c: any) => {
    setEditingId(c.id)
    setForm({ name: c.name || '', description: c.description || '', imageUrl: c.imageUrl || '' })
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold">Управління категоріями</h1>
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? 'Редагувати категорію' : 'Нова категорія'}</CardTitle>
          <CardDescription>Створюйте та редагуйте категорії</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input placeholder="Назва" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="Посилання на зображення" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          <Input placeholder="Опис" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="md:col-span-3 flex gap-2">
            <Button onClick={onSubmit}>{editingId ? 'Зберегти' : 'Створити'}</Button>
            {editingId && (
              <Button variant="outline" onClick={reset}>
                Скасувати
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c: any) => (
          <Card key={c.id}>
            <CardHeader>
              <CardTitle>{c.name}</CardTitle>
              <CardDescription>{c.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button variant="outline" onClick={() => startEdit(c)}>
                Редагувати
              </Button>
              <Button variant="destructive" onClick={() => deleteMutation.mutate(c.id)}>
                Видалити
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


