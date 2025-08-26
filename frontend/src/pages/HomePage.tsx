import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Music, Guitar, Piano, Drum } from 'lucide-react'

const categories = [
  {
    name: 'Гітари',
    description: 'Акустичні та електрогітари',
    icon: Guitar,
    href: '/products?category=1',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
  },
  {
    name: 'Клавішні',
    description: 'Піаніно, синтезатори, MIDI-клавіатури',
    icon: Piano,
    href: '/products?category=2',
    image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400'
  },
  {
    name: 'Ударні',
    description: 'Барабани, перкусія, тарілки',
    icon: Drum,
    href: '/products?category=3',
    image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400'
  },
  {
    name: 'Духові',
    description: 'Саксофони, труби, флейти',
    icon: Music,
    href: '/products?category=4',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400'
  },
  {
    name: 'Струнні',
    description: 'Скрипки, віолончелі, контрабаси',
    icon: Music,
    href: '/products?category=5',
    image: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=400'
  }
]

export default function HomePage() {
  const { user } = useAuth()
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 to-secondary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <Music className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Ласкаво просимо до{' '}
              <span className="text-primary">Music Shop</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Відкрийте для себе світ якісних музичних інструментів. 
              Від початківців до професіоналів — у нас є все для створення музики.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" className="text-lg px-8 py-6">
                  Переглянути товари
                </Button>
              </Link>
              {!user && (
                <Link to="/register">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                    Зареєструватися
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold">Категорії інструментів</h2>
          <p className="text-muted-foreground text-lg">
            Оберіть категорію, яка вас цікавить
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category.name} to={category.href}>
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <category.icon className="h-6 w-6 text-primary" />
                    <CardTitle>{category.name}</CardTitle>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">Чому обирають нас</h2>
            <p className="text-muted-foreground text-lg">
              Ми пропонуємо найкращі умови для придбання музичних інструментів
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Music className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Якісні інструменти</h3>
              <p className="text-muted-foreground">Працюємо лише з перевіреними виробниками та гарантуємо якість кожного інструмента</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Music className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Швидка доставка</h3>
              <p className="text-muted-foreground">Доставляємо по всій країні з дбайливою упаковкою та страховкою</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Music className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Підтримка 24/7</h3>
              <p className="text-muted-foreground">Наша команда завжди готова допомогти з вибором та відповісти на ваші запитання</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
