import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { authenticate } from '../middlewares/auth'
import { paperclip } from '../utils/paperclip-client'

const createInquirySchema = z.object({
  customerId: z.string().uuid(),
  expectedDate: z.string().optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).optional(),
  remark: z.string().optional(),
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive(),
    remark: z.string().optional()
  }))
})

const updateStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'quoted', 'accepted', 'rejected', 'expired'])
})

export default async function inquiryRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  // 创建询价单
  fastify.post('/', {
    preHandler: [authenticate],
    schema: {
      body: {
        type: 'object',
        required: ['customerId', 'items'],
        properties: {
          customerId: { type: 'string' },
          expectedDate: { type: 'string' },
          priority: { type: 'string' },
          remark: { type: 'string' },
          items: { type: 'array' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const userId = (request as any).user.id
      const data = createInquirySchema.parse(request.body)

      // 生成询价单编号
      const inquiryNo = `INQ-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Date.now().toString(36).toUpperCase()}`

      // 计算总金额
      const items = await Promise.all(data.items.map(async (item: any) => {
        const product = await (fastify as any).prisma.product.findUnique({
          where: { id: item.productId }
        })
        if (!product) throw new Error(`Product ${item.productId} not found`)
        return {
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: product.unitPrice,
          subtotal: product.unitPrice * item.quantity,
          remark: item.remark
        }
      }))

      const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0)

      // 创建询价单
      const inquiry = await (fastify as any).prisma.inquiry.create({
        data: {
          inquiryNo,
          customerId: data.customerId,
          expectedDate: data.expectedDate ? new Date(data.expectedDate) : undefined,
          priority: data.priority,
          remark: data.remark,
          totalAmount,
          items: {
            create: items
          }
        },
        include: { customer: true, items: { include: { product: true } } }
      })

      // 在 Paperclip 创建 Issue
      try {
        const issue = await paperclip.createIssue({
          title: `询价单 - ${inquiry.customer.companyName} - ${inquiryNo}`,
          description: `客户：${inquiry.customer.companyName}\n产品：${inquiry.items.map((i: any) => `${i.product.name} x${i.quantity}`).join(', ')}\n期望交付：${data.expectedDate || '未指定'}`,
          status: 'todo',
          priority: 'medium',
          parentId: 'MIP-2'
        })

        await (fastify as any).prisma.inquiry.update({
          where: { id: inquiry.id },
          data: { paperclipIssueId: issue.identifier || issue.id }
        })
      } catch (err) {
        fastify.log.warn('Failed to create Paperclip issue:', err)
      }

      return { success: true, data: inquiry }
    } catch (error: any) {
      reply.status(400).send({ success: false, error: error.message })
    }
  })

  // 查询询价单列表
  fastify.get('/', {
    preHandler: [authenticate]
  }, async (request, reply) => {
    try {
      const { status, customerId, page = '1', limit = '20' } = request.query as any
      const where: any = {}
      if (status) where.status = status
      if (customerId) where.customerId = customerId

      const [inquiries, total] = await Promise.all([
        (fastify as any).prisma.inquiry.findMany({
          where,
          include: { customer: true, items: { include: { product: true } } },
          orderBy: { createdAt: 'desc' },
          skip: (parseInt(page) - 1) * parseInt(limit),
          take: parseInt(limit)
        }),
        (fastify as any).prisma.inquiry.count({ where })
      ])

      return {
        success: true,
        data: inquiries,
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

  // 获取询价单详情
  fastify.get('/:id', {
    preHandler: [authenticate]
  }, async (request, reply) => {
    try {
      const { id } = request.params as any
      const inquiry = await (fastify as any).prisma.inquiry.findUnique({
        where: { id },
        include: { customer: true, items: { include: { product: true } } }
      })

      if (!inquiry) {
        return reply.status(404).send({ success: false, error: 'Inquiry not found' })
      }

      return { success: true, data: inquiry }
    } catch (error: any) {
      reply.status(500).send({ success: false, error: error.message })
    }
  })

  // 更新询价单状态
  fastify.patch('/:id/status', {
    preHandler: [authenticate]
  }, async (request, reply) => {
    try {
      const { id } = request.params as any
      const data = updateStatusSchema.parse(request.body)

      const inquiry = await (fastify as any).prisma.inquiry.update({
        where: { id },
        data: { status: data.status },
        include: { customer: true }
      })

      // 同步到 Paperclip
      if (inquiry.paperclipIssueId) {
        try {
          const statusMap: Record<string, string> = {
            pending: 'todo',
            processing: 'in_progress',
            quoted: 'in_review',
            accepted: 'done',
            rejected: 'done',
            expired: 'done'
          }
          await paperclip.updateIssue(inquiry.paperclipIssueId, {
            status: statusMap[data.status] || 'todo',
            comment: `询价单状态更新为：${data.status}`
          })
        } catch (err) {
          fastify.log.warn('Failed to update Paperclip issue:', err)
        }
      }

      return { success: true, data: inquiry }
    } catch (error: any) {
      reply.status(400).send({ success: false, error: error.message })
    }
  })
}