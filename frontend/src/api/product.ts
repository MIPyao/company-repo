import axios from 'axios'
import type { Product, ProductCategory } from '@/types'

export interface ProductQuery {
  page?: number
  limit?: number
  search?: string
  categoryId?: string
  isActive?: boolean
}

export const productApi = {
  list: async (params?: ProductQuery) => {
    const res = await axios.get('/api/products', { params })
    return res.data
  },

  get: async (id: string) => {
    const res = await axios.get(`/api/products/${id}`)
    return res.data
  },

  create: async (data: Partial<Product>) => {
    const res = await axios.post('/api/products', data)
    return res.data
  },

  update: async (id: string, data: Partial<Product>) => {
    const res = await axios.patch(`/api/products/${id}`, data)
    return res.data
  },

  delete: async (id: string) => {
    const res = await axios.delete(`/api/products/${id}`)
    return res.data
  },

  getCategories: async () => {
    const res = await axios.get('/api/products/categories/tree')
    return res.data
  },

  createCategory: async (data: Partial<ProductCategory>) => {
    const res = await axios.post('/api/products/categories', data)
    return res.data
  }
}
