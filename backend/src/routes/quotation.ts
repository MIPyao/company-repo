import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { z } from 'zod'
import { NotFoundError, BadRequestError } from '../utils/error-handler'
import { paperclip } from '../utils/paperclip-client'

const createQuotationSchema = z.object({
  inquiryId: z.string().uuid(),
  discountAmount: z.number().min(0).optional(),
  validUntil: z.string().optional()
})

const updateQuotationSchema = z.object({
  discountAmount: z.number().min(0).optional(),
  validUntil: z.string().optional()
})

export default async function quotationRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  // 基于询价单生成报价单
  fastify.post('/from-inquiry/:inquiryId', async (request, reply) => {
    try {
      const { inquiryId } = request.params as any

      // 查询询价单
      const inquiry = await (fastify as any).prisma.inquiry.findUnique({
        where: { id: inquiryId },
        include: {
          customer: true,
          items: { include: { product: true } }
        }
      })

      if (!inquiry) throw new NotFoundError('Inquiry not found')
      if (inquiry.status !== 'quoted') {
        throw new BadRequestError('Inquiry must be in quoted status')
      }

      // 生成报价单编号
      const quotationNo = `QUO-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Date.now().toString(36).toUpperCase()}`

      // 计算金额
      const totalAmount = inquiry.totalAmount || 0
      const discountAmount = 0
      const finalAmount = totalAmount - discountAmount

      // 创建报价单
      const quotation = await (fastify as any).prisma.quotation.create({
        data: {
          quotationNo,
          inquiryId: inquiry.id,
          customerId: inquiry.customerId,
          totalAmount,
          discountAmount,
          finalAmount,
          items: {
            create: inquiry.items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              subtotal: item.subtotal
            }))
          }
        },
        include: {
          customer: true,
          inquiry: { include: { items: { include: { product: true } } }
        }
      })

      // 在 Paperclip 更新 Issue 状态
      if (inquiry.paperclipIssueId) {
        try {
          await paperclip.updateIssue(
            inquiry.paperclipIssueId,
            { status: 'in_review', comment: `报价单已生成：${quotationNo}` }
          )
        } catch (err) {
          fastify.log.warn('Failed to update Paperclip issue:', err)
        }
      }

      return { success: true, data: quotation }
    } catch (error: any) {
      const status = error.statusCode || 400
      reply.status(status).send({ success: false, error: error.message })
    }
  })

  // 报价单列表
  fastify.get('/', async (request, reply) => {
    try {
      const { page = '1', limit = '20', status, customerId } = request.query as any
      const where: any = {}
      if (status) where.status = status
      if (customerId) where.customerId = customerId

      const [quotations, total] = await Promise.all([
        (fastify as any).prisma.quotation.findMany({
          where,
          include: { customer: true, inquiry: true },
          orderBy: { createdAt: 'desc' },
          skip: (parseInt(page) - 1) * parseInt(limit),
          take: parseInt(limit)
        }),
        (fastify as any).prisma.quotation.count({ where })
      ])

      return {
        success: true,
        data: quotations,
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

  // 报价单详情
  fastify.get('/:id', async (request, reply) => {
    try {
      const { id } = request.params as any
      const quotation = await (fastify as any).prisma.quotation.findUnique({
        where: { id },
        include: {
          customer: true,
          inquiry: { include: { items: { include: { product: true } } }
        }
      })

      if (!quotation) throw new NotFoundError('Quotation not found')
      return { success: true, data: quotation }
    } catch (error: any) {
      const status = error.statusCode || 500
      reply.status(status).send({ success: false, error: error.message })
    }
  })

  // 更新报价单
  fastify.patch('/:id', async (request, reply) => {
    try {
      const { id } = request.params as any
      const data = updateQuotationSchema.parse(request.body)

      const quotation = await (fastify as any).prisma.quotation.update({
        where: { id },
        data: {
          ...data,
          validUntil: data.validUntil ? new Date(data.validUntil) : undefined
        }
      })

      return { success: true, data: quotation }
    } catch (error: any) {
      reply.status(400).send({ success: false, error: error.message })
    }
  })

  // 发送报价单（邮件）
  fastify.post('/:id/send', async (request, reply) => {
    try {
      const { id } = request.params as any
      const quotation = await (fastify as any).prisma.quotation.findUnique({
        where: { id },
        include: { customer: true }
      })

      if (!quotation) throw new NotFoundError('Quotation not found')

      // TODO: 实际邮件发送逻辑
      // await sendEmail({ ... })

      // 更新状态为已发送
      await (fastify as any).prisma.quotation.update({
        where: { id },
        data: { status: 'sent' }
      })

      return { success: true, message: 'Quotation sent successfully' }
    } catch (error: any) {
      const status = error.statusCode || 500
      reply.status(status).send({ success: false, error: error.message })
    }
  })

  // 报价转订单
  fastify.post('/:id/convert-to-order', async (request, reply) => {
    try {
      const { id } = request.params as any

      const quotation = await (fastify as any).prisma.quotation.findUnique({
        where: { id },
        include: { customer: true }
      })

      if (!quotation) throw new NotFoundError('Quotation not found')
      if (quotation.status !== 'accepted') {
        throw new BadRequestError('Quotation must be accepted before converting')
      }

      const orderNo = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Date.now().toString(36).toUpperCase()}`

      const order = await (fastify as any).prisma.order.create({
        data: {
          orderNo,
          quotationId: quotation.id,
          customerId: quotation.customerId,
          totalAmount: quotation.finalAmount
        }
      })

      return { success: true, data: order }
    } catch (error: any) {
      const status = error.statusCode || 400
      reply.status(status).send({ success: false, error: error.message })
    }
  })
}
