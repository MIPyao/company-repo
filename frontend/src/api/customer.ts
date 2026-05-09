import axios from 'axios'
import type { Customer } from '@/types'

export interface CustomerQuery {
  page?: number
  limit?: number
  search?: string
  status?: string
}

export const customerApi = {
  list: async (params?: CustomerQuery) => {
    const res = await axios.get('/api/customers', { params })
    return res.data
  },

  get: async (id: string) => {
    const res = await axios.get(`/api/customers/${id}`)
    return res.data
  },

  create: async (data: Partial<Customer>) => {
    const res = await axios.post('/api/customers', data)
    return res.data
  },

  update: async (id: string, data: Partial<Customer>) => {
    const res = await axios.patch(`/api/customers/${id}`, data)
    return res.data
  },

  delete: async (id: string) => {
    const res = await axios.delete(`/api/customers/${id}`)
    return res.data
  }
}
