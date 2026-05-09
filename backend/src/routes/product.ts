import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { z } from 'zod'
import { NotFoundError, BadRequestError } from '../utils/error-handler'

const createProductSchema = z.object({
  name: z.string().min(1),
  model: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  unitPrice: z.number().positive(),
  costPrice: z.number().positive().optional(),
  stockStatus: z.enum(['in_stock', 'out_of_stock', 'pre_order']).optional(),
  isActive: z.boolean().optional()
})

const createCategorySchema = z.object({
  name: z.string().min(1),
  parentId: z.string().uuid().optional(),
  level: z.number().int().min(1).optional(),
  sortOrder: z.number().int().optional()
})

export default async function productRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  // 创建产品
  fastify.post('/', async (request, reply) => {
    try {
      const data = createProductSchema.parse(request.body)

      // 验证分类是否存在
      if (data.categoryId) {
        const category = await (fastify as any).prisma.productCategory.findUnique({
          where: { id: data.categoryId }
        })
        if (!category) throw new BadRequestError('Category not found')
      }

      const product = await (fastify as any).prisma.product.create({
        data,
        include: { category: true }
      })
      return { success: true, data: product }
    } catch (error: any) {
      const status = error.statusCode || 400
      reply.status(status).send({ success: false, error: error.message })
    }
  })

  // 产品列表（分页 + 筛选）
  fastify.get('/', async (request, reply) => {
    try {
      const {
        page = '1',
        limit = '20',
        search,
        categoryId,
        isActive
      } = request.query as any

      const where: any = {}
      if (search) {
        where.OR = [
          { name: { contains: search } },
          { model: { contains: search } },
          { description: { contains: search } }
        ]
      }
      if (categoryId) where.categoryId = categoryId
      if (isActive !== undefined) where.isActive = isActive === 'true'

      const [products, total] = await Promise.all([
        (fastify as any).prisma.product.findMany({
          where,
          include: { category: true },
          orderBy: { createdAt: 'desc' },
          skip: (parseInt(page) - 1) * parseInt(limit),
          take: parseInt(limit)
        }),
        (fastify as any).prisma.product.count({ where })
      ])

      return {
        success: true,
        data: products,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    } catch (error: any) {
      reply.status(500).send({ success: false, error: error.message })
    }
  })

  // 产品详情
  fastify.get('/:id', async (request, reply) => {
    try {
      const { id } = request.params as any
      const product = await (fastify as any).prisma.product.findUnique({
        where: { id },
        include: { category: true }
      })

      if (!product) throw new NotFoundError('Product not found')
      return { success: true, data: product }
    } catch (error: any) {
      const status = error.statusCode || 500
      reply.status(status).send({ success: false, error: error.message })
    }
  })

  // 更新产品
  fastify.patch('/:id', async (request, reply) => {
    try {
      const { id } = request.params as any
      const data = createProductSchema.partial().parse(request.body)

      if (data.categoryId) {
        const category = await (fastify as any).prisma.productCategory.findUnique({
          where: { id: data.categoryId }
        })
        if (!category) throw new BadRequestError('Category not found')
      }

      const product = await (fastify as any).prisma.product.update({
        where: { id },
        data,
        include: { category: true }
      })
      return { success: true, data: product }
    } catch (error: any) {
      const status = error.statusCode || 400
      reply.status(status).send({ success: false, error: error.message })
    }
  })

  // 删除产品
  fastify.delete('/:id', async (request, reply) => {
    try {
      const { id } = request.params as any

      const product = await (fastify as any).prisma.product.findUnique({
        where: { id },
        include: { inquiryItems: true }
      })
      if (!product) throw new NotFoundError('Product not found')

      // 检查是否有关联的询价单
      if (product.inquiryItems.length > 0) {
        throw new BadRequestError('Cannot delete product that is referenced in inquiries')
      }

      await (fastify as any).prisma.product.delete({
        where: { id }
      })

      return { success: true, message: 'Product deleted successfully' }
    } catch (error: any) {
      const status = error.statusCode || 400
      reply.status(status).send({ success: false, error: error.message })
    }
  })

  // 产品分类树
  fastify.get('/categories/tree', async (request, reply) => {
    try {
      const categories = await (fastify as any).prisma.productCategory.findMany({
        orderBy: [{ level: 'asc' }, { sortOrder: 'asc' }]
      })

      // 构建树形结构
      const categoryMap = new Map()
      const roots: any[] = []

      categories.forEach((cat: any) => {
        categoryMap.set(cat.id, { ...cat, children: [] })
      })

      categories.forEach((cat: any) => {
        if (cat.parentId) {
          const parent = categoryMap.get(cat.parentId)
          if (parent) parent.children.push(categoryMap.get(cat.id))
        } else {
          roots.push(categoryMap.get(cat.id))
        }
      })

      return { success: true, data: roots }
    } catch (error: any) {
      reply.status(500).send({ success: false, error: error.message })
    }
  })

  // 创建产品分类
  fastify.post('/categories', async (request, reply) => {
    try {
      const data = createCategorySchema.parse(request.body)

      // 如果有父分类，验证并设置level
      if (data.parentId) {
        const parent = await (fastify as any).prisma.productCategory.findUnique({
          where: { id: data.parentId }
        })
        if (!parent) throw new BadRequestError('Parent category not found')
        data.level = (parent.level || 0) + 1
      }

      const category = await (fastify as any).prisma.productCategory.create({
        data
      })
      return { success: true, data: category }
    } catch (error: any) {
      const status = error.statusCode || 400
      reply.status(status).send({ success: false, error: error.message })
    }
  })

  // 更新产品分类
  fastify.patch('/categories/:id', async (request, reply) => {
    try {
      const { id } = request.params as any
      const data = createCategorySchema.partial().parse(request.body)

      const category = await (fastify as any).prisma.productCategory.update({
        where: { id },
        data
      })
      return { success: true, data: category }
    } catch (error: any) {
      const status = error.statusCode || 400
      reply.status(status).send({ success: false, error: error.message })
    }
  })

  // 删除产品分类
  fastify.delete('/categories/:id', async (request, reply) => {
    try {
      const { id } = request.params as any

      // 检查是否有子分类
      const children = await (fastify as any).prisma.productCategory.findMany({
        where: { parentId: id }
      })
      if (children.length > 0) {
        throw new BadRequestError('Cannot delete category with child categories')
      }

      // 检查是否有关联的产品
      const products = await (fastify as any).prisma.product.findMany({
        where: { categoryId: id }
      })
      if (products.length > 0) {
        throw new BadRequestError('Cannot delete category with associated products')
      }

      await (fastify as any).prisma.productCategory.delete({
        where: { id }
      })

      return { success: true, message: 'Category deleted successfully' }
    } catch (error: any) {
      const status = error.statusCode || 400
      reply.status(status).send({ success: false, error: error.message })
    }
  })
}
