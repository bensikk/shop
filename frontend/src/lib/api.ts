const API_BASE_URL = '/api'

interface ApiResponse<T> {
  data?: T
  error?: string
}

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    
    const token = localStorage.getItem('token')
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (token) {
      ;(headers as any).Authorization = `Bearer ${token}`
    }

    try {
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers,
        body: options.body,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Помилка HTTP! статус: ${response.status}`)
      }

      const data = await response.json()
      return { data }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Невідома помилка' }
    }
  }

  // Auth endpoints
  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async register(userData: { email: string; password: string; firstName?: string; lastName?: string }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  // Products endpoints
  async getProducts(params?: Record<string, string | number | undefined>) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          searchParams.append(key, String(value))
        }
      })
    }
    const queryString = searchParams.toString()
    return this.request(`/products${queryString ? `?${queryString}` : ''}`)
  }

  async getProduct(id: string) {
    return this.request(`/products/${id}`)
  }

  // Categories endpoints
  async getCategories() {
    return this.request('/categories')
  }

  async getCategory(id: string) {
    return this.request(`/categories/${id}`)
  }

  // Orders endpoints
  async createOrder(orderData: any) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
  }

  async getOrders() {
    return this.request('/orders')
  }

  async getOrder(id: string) {
    return this.request(`/orders/${id}`)
  }

  // Admin endpoints
  async createProduct(productData: any) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    })
  }

  async updateProduct(id: string, productData: any) {
    return this.request(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(productData),
    })
  }

  async deleteProduct(id: string) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    })
  }

  async createCategory(categoryData: any) {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    })
  }

  async updateCategory(id: string, categoryData: any) {
    return this.request(`/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(categoryData),
    })
  }

  async deleteCategory(id: string) {
    return this.request(`/categories/${id}`, {
      method: 'DELETE',
    })
  }

  async getAllOrders() {
    return this.request('/orders/admin')
  }

  async updateOrderStatus(id: string, status: string) {
    return this.request(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  }

  async deleteOrder(id: string) {
    return this.request(`/orders/${id}`, {
      method: 'DELETE',
    })
  }
}

export const api = new ApiClient(API_BASE_URL)
