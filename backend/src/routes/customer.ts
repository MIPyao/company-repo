import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { z } from 'zod'
import { NotFoundError, BadRequestError } from '../utils/error-handler'

const createCustomerSchema = z.object({
  companyName: z.string().min(1),
  contactName: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email(),
  address: z.string().optional(),
  industry: z.string().optional(),
  customerLevel: z.enum(['regular', 'vip', 'enterprise']).optional()
})

export default async function customerRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  // 创建客户
  fastify.post('/', async (request, reply) => {
    try {
      const data = createCustomerSchema.parse(request.body)
      const existing = await (fastify as any).prisma.customer.findUnique({
        where: { email: data.email }
      })
      if (existing) {
        throw new BadRequestError('Customer with this email already exists')
      }

      const customer = await (fastify as any).prisma.customer.create({
        data
      })
      return { success: true, data: customer }
    } catch (error: any) {
      if (error instanceof BadRequestError) {
        reply.status(error.statusCode).send({ success: false, error: error.message })
      } else {
        reply.status(400).send({ success: false, error: error.message })
      }
    }
  })

  // 客户列表（分页）
  fastify.get('/', async (request, reply) => {
    try {
      const { page = '1', limit = '20', search, status } = request.query as any
      const where: any = {}
      if (search) {
        where.OR = [
          { companyName: { contains: search } },
          { contactName: { contains: search } },
          { email: { contains: search } }
        ]
      }
      if (status) where.status = status

      const [customers, total] = await Promise.all([
        (fastify as any).prisma.customer.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip: (parseInt(page) - 1) * parseInt(limit),
          take: parseInt(limit)
        }),
        (fastify as any).prisma.customer.count({ where })
      ])

      return {
        success: true,
        data: customers,
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

  // 客户详情
  fastify.get('/:id', async (request, reply) => {
    try {
      const { id } = request.params as any
      const customer = await (fastify as any).prisma.customer.findUnique({
        where: { id },
        include: {
          inquiries: {
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: { items: { include: { product: true } }
          }
        }
      })

      if (!customer) throw new NotFoundError('Customer not found')
      return { success: true, data: customer }
    } catch (error: any) {
      const status = error.statusCode || 500
      reply.status(status).send({ success: false, error: error.message })
    }
  })

  // 更新客户
  fastify.patch('/:id', async (request, reply) => {
    try {
      const { id } = request.params as any
      const data = createCustomerSchema.partial().parse(request.body)

      if (data.email) {
        const existing = await (fastify as any).prisma.customer.findUnique({
          where: { email: data.email }
        })
        if (existing && existing.id !== id) {
          throw new BadRequestError('Email already in use by another customer')
        }
      }

      const customer = await (fastify as any).prisma.customer.update({
        where: { id },
        data
      })
      return { success: true, data: customer }
    } catch (error: any) {
      const status = error.statusCode || 400
      reply.status(status).send({ success: false, error: error.message })
    }
  })

  // 删除客户（软删除）
  fastify.delete('/:id', async (request, reply) => {
    try {
      const { id } = request.params as any

      const customer = await (fastify as any).prisma.customer.findUnique({
        where: { id }
      })
      if (!customer) throw new NotFoundError('Customer not found')

      // 检查是否有活跃的询价单
      const activeInquiries = await (fastify as any).prisma.inquiry.count({
        where: { customerId: id, status: { notIn: ['accepted', 'rejected', 'expired'] } }
      })
      if (activeInquiries > 0) {
        throw new BadRequestError('Cannot delete customer with active inquiries')
      }

      // 软删除：更新状态为 inactive
      await (fastify as any).prisma.customer.update({
        where: { id },
        data: { status: 'inactive' }
      })

      return { success: true, message: 'Customer deleted successfully' }
    } catch (error: any) {
      const status = error.statusCode || 400
      reply.status(status).send({ success: false, error: error.message })
    }
  })
}
