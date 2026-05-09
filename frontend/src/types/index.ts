export interface Customer {
  id: string
  companyName: string
  contactName: string
  phone?: string
  email: string
  address?: string
  industry?: string
  customerLevel: string
  status: string
  inquiries?: Inquiry[]
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: string
  name: string
  model?: string
  description?: string
  categoryId?: string
  category?: ProductCategory
  unitPrice: number
  costPrice?: number
  stockStatus: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductCategory {
  id: string
  name: string
  parentId?: string
  level: number
  sortOrder: number
  children?: ProductCategory[]
  products?: Product[]
}

export interface Inquiry {
  id: string
  inquiryNo: string
  customerId: string
  customer?: Customer
  status: string
  expectedDate?: string
  priority: string
  assignedTo?: string
  totalAmount?: number
  remark?: string
  paperclipIssueId?: string
  items?: InquiryItem[]
  quotation?: Quotation
  createdAt: string
  updatedAt: string
}

export interface InquiryItem {
  id: string
  inquiryId: string
  productId: string
  product?: Product
  quantity: number
  unitPrice?: number
  subtotal?: number
  remark?: string
}

export interface Quotation {
  id: string
  quotationNo: string
  inquiryId: string
  inquiry?: Inquiry
  customerId: string
  customer?: Customer
  status: string
  totalAmount: number
  discountAmount: number
  finalAmount: number
  validUntil?: string
  pdfUrl?: string
  paperclipIssueId?: string
  order?: Order
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: string
  orderNo: string
  quotationId?: string
  quotation?: Quotation
  customerId: string
  customer?: Customer
  status: string
  totalAmount: number
  deliveryDate?: string
  paperclipIssueId?: string
  createdAt: string
  updatedAt: string
}
