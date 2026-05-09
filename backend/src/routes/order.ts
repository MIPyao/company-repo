import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { z } from 'zod'
import { NotFoundError, BadRequestError } from '../utils/error-handler'

const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'producing', 'shipped', 'completed', 'cancelled']),
  reason: z.string().optional()
})

export default async function orderRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  // 订单列表
  fastify.get('/', async (request, reply) => {
    try {
      const { page = '1', limit = '20', status, customerId } = request.query as any
      const where: any = {}
      if (status) where.status = status
      if (customerId) where.customerId = customerId

      const [orders, total] = await Promise.all([
        (fastify as any).prisma.order.findMany({
          where,
          include: { customer: true, quotation: true },
          orderBy: { createdAt: 'desc' },
          skip: (parseInt(page) - 1) * parseInt(limit),
          take: parseInt(limit)
        }),
        (fastify as any).prisma.order.count({ where })
      ])

      return {
        success: true,
        data: orders,
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

  // 订单详情
  fastify.get('/:id', async (request, reply) => {
    try {
      const { id } = request.params as any
      const order = await (fastify as any).prisma.order.findUnique({
        where: { id },
        include: {
          customer: true,
          quotation: { include: { inquiry: { include: { items: true } } }
        }
      })

      if (!order) throw new NotFoundError('Order not found')
      return { success: true, data: order }
    } catch (error: any) {
      const status = error.statusCode || 500
      reply.status(status).send({ success: false, error: error.message })
    }
  })

  // 更新订单状态
  fastify.patch('/:id/status', async (request, reply) => {
    try {
      const { id } = request.params as any
      const data = updateOrderStatusSchema.parse(request.body)

      const order = await (fastify as any).prisma.order.update({
        where: { id },
        data: { status: data.status },
        include: { customer: true, quotation: true }
      })

      // 如果取消订单，需要填写原因
      if (data.status === 'cancelled' && !data.reason) {
        throw new BadRequestError('Cancellation reason is required')
      }

      return { success: true, data: order }
    } catch (error: any) {
      const status = error.statusCode || 400
      reply.status(status).send({ success: false, error: error.message })
    }
  })

  // 更新交付日期
  fastify.patch('/:id/delivery-date', async (request, reply) => {
    try {
      const { id } = request.params as any
      const { deliveryDate } = request.body as any

      if (!deliveryDate) {
        throw new BadRequestError('Delivery date is required')
      }

      const order = await (fastify as any).prisma.order.update({
        where: { id },
        data: { deliveryDate: new Date(deliveryDate) }
      })

      return { success: true, data: order }
    } catch (error: any) {
      const status = error.statusCode || 400
      reply.status(status).send({ success: false, error: error.message })
    }
  })
}
