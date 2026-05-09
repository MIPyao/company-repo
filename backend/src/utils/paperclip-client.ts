import fetch from 'node-fetch' // 或使用 axios
import { PrismaClient } from '@prisma/client'

export interface PaperclipClientConfig {
  apiUrl: string
  apiKey: string
  companyId?: string
}

export class PaperclipClient {
  private apiUrl: string
  private apiKey: string
  private companyId?: string

  constructor(config: PaperclipClientConfig) {
    this.apiUrl = config.apiUrl.replace(/\/$/, '')
    this.apiKey = config.apiKey
    this.companyId = config.companyId
  }

  private async request(
    method: string,
    path: string,
    data?: any,
    runId?: string
  ) {
    const url = `${this.apiUrl}${path}`
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    }
    if (runId) {
      headers['X-Paperclip-Run-Id'] = runId
    }

    const response = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(`Paperclip API error: ${response.status} ${JSON.stringify(error)}`)
    }

    return response.json()
  }

  // 创建 Issue
  async createIssue(data: {
    title: string
    description?: string
    status?: string
    priority?: string
    parentId?: string
    assigneeAgentId?: string
  }) {
    return this.request('POST', `/api/companies/${this.companyId}/issues`, data)
  }

  // 更新 Issue
  async updateIssue(issueId: string, data: {
    status?: string
    comment?: string
    title?: string
    assigneeAgentId?: string
  }, runId?: string) {
    return this.request('PATCH', `/api/issues/${issueId}`, data, runId)
  }

  // 添加评论
  async addComment(issueId: string, body: string, runId?: string) {
    return this.request('POST', `/api/issues/${issueId}/comments`, { body }, runId)
  }

  // 上传附件
  async uploadAttachment(issueId: string, file: { name: string; content: string; type: string }) {
    const FormData = (await import('formdata-node')).FormData
    const form = new FormData()
    form.append('file', new Blob([Buffer.from(file.content)], { type: file.type }), file.name)

    const url = `${this.apiUrl}/api/companies/${this.companyId}/issues/${issueId}/attachments`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: form as any
    })

    return response.json()
  }
}

// 导出默认实例（延迟初始化）
let _client: PaperclipClient | null = null

export const paperclipClient = (config?: PaperclipClientConfig): PaperclipClient => {
  if (!_client) {
    _client = new PaperclipClient(config || {
      apiUrl: process.env.PAPERCLIP_API_URL || 'https://api.paperclip.io',
      apiKey: process.env.PAPERCLIP_API_KEY || '',
      companyId: process.env.PAPERCLIP_COMPANY_ID
    })
  }
  return _client
}
