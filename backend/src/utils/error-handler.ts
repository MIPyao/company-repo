import { FastifyRequest, FastifyReply, FastifyError } from 'fastify'

export interface AppError extends Error {
  statusCode?: number
  validation?: any
}

export const errorHandler = (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const statusCode = error.statusCode || 500
  const response: any = {
    success: false,
    error: error.message || 'Internal Server Error'
  }

  // 处理验证错误
  if (error.validation) {
    response.errors = error.validation
    response.error = 'Validation failed'
  }

  // Log error
  if (statusCode >= 500) {
    request.log.error(error)
  }

  reply.status(statusCode).send(response)
}

// 自定义错误类
export class NotFoundError extends Error {
  statusCode = 404
  constructor(message: string = 'Resource not found') {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class BadRequestError extends Error {
  statusCode = 400
  constructor(message: string = 'Bad request') {
    super(message)
    this.name = 'BadRequestError'
  }
}

export class UnauthorizedError extends Error {
  statusCode = 401
  constructor(message: string = 'Unauthorized') {
    super(message)
    this.name = 'UnauthorizedError'
  }
}
