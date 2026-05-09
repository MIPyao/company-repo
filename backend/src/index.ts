import Fastify from 'fastify'
import cors from '@fastify/cors'
import { PrismaClient } from '@prisma/client'
import inquiryRoutes from './routes/inquiry'
import customerRoutes from './routes/customer'
import productRoutes from './routes/product'
import quotationRoutes from './routes/quotation'
import orderRoutes from './routes/order'
import { errorHandler } from './utils/error-handler'
import { paperclipClient } from './utils/paperclip-client'

// 初始化 Fastify 实例
const fastify = Fastify({
  logger: true
})

// 初始化 Prisma 客户端
export const prisma = new PrismaClient()

// 初始化 Paperclip 客户端
export const paperclip = paperclipClient({
  apiUrl: process.env.PAPERCLIP_API_URL || 'https://api.paperclip.io',
  apiKey: process.env.PAPERCLIP_API_KEY || ''
})

// 注册插件
fastify.register(cors, {
  origin: true, // 允许所有来源（生产环境应配置具体域名）
  credentials: true
})

// 注册路由
fastify.register(inquiryRoutes, { prefix: '/api/inquiries' })
fastify.register(customerRoutes, { prefix: '/api/customers' })
fastify.register(productRoutes, { prefix: '/api/products' })
fastify.register(quotationRoutes, { prefix: '/api/quotations' })
fastify.register(orderRoutes, { prefix: '/api/orders' })

// 健康检查
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})

// 错误处理
fastify.setErrorHandler(errorHandler)

// 启动服务器
const start = async () => {
  try {
    const port = process.env.PORT ? parseInt(process.env.PORT) : 3000
    const host = process.env.HOST || '0.0.0.0'

    await fastify.listen({ port, host })
    console.log(`Server listening on ${host}:${port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
