import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify'
import jwt from 'jsonwebtoken'

export interface AuthUser {
  id: string
  email: string
  role: string
}

declare module 'fastify' {
  interface FastifyRequest {
    user: AuthUser
  }
}

export const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const authHeader = request.headers.authorization
    if (!authHeader) {
      return reply.status(401).send({ success: false, error: 'Missing authorization header' })
    }

    const token = authHeader.replace('Bearer ', '')
    const secret = process.env.JWT_SECRET || 'dev-secret-change-in-production'

    const decoded = jwt.verify(token, secret) as AuthUser
    request.user = decoded
  } catch (error) {
    return reply.status(401).send({ success: false, error: 'Invalid or expired token' })
  }
}

export const generateToken = (user: AuthUser): string => {
  const secret = process.env.JWT_SECRET || 'dev-secret-change-in-production'
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d'
  return jwt.sign(user, secret, { expiresIn } as any)
}
