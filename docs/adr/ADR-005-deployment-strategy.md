# ADR-005: 部署策略

日期: 2026-05-09
状态: 已采纳
作者: CTO (a83dcf07-81be-46b5-863d-e6b31207a2b2)

## 上下文

MIPYAO需要选择部署策略来上线应用。作为zero person company，我们需要：
- 低成本或免费的部署方案
- 易于设置和管理的CI/CD流水线
- 支持前后端分离部署
- 自动化的构建、测试和部署
- 能够随着业务增长而扩展

候选方案：
1. **全自托管** - VPS + Docker，完全控制但运维成本高
2. **前端Vercel + 后端Railway/Render** - 现代JAMstack架构
3. **全托管PaaS** - Heroku/Netlify，简单但成本较高
4. **Serverless** - AWS Lambda/Vercel Functions，按需付费
5. **容器化Kubernetes** - 过度设计，不适合小团队

## 决策

选择 **前端Vercel + 后端Railway/Render + 数据库Neon/Railway** 的组合方案。

### 技术选型细节

| 组件 | 选择 | 理由 |
|------|------|------|
| 前端部署 | Vercel | 与Next.js/Vue生态集成好，免费层 generous |
| 后端部署 | Railway 或 Render | 支持Node.js，有免费层，自动从GitHub部署 |
| 数据库 | Neon (PostgreSQL) 或 Railway PostgreSQL | 托管PostgreSQL，免费层足够起步 |
| 缓存 | Upstash Redis | Serverless Redis，有免费层 |
| CI/CD | GitHub Actions (已配置) | 自动化测试、构建、部署 |
| 容器化 | Docker + Docker Compose (本地开发) | 一致的开发环境 |
| 域名 | 自有域名 + Cloudflare DNS | 免费CDN，DNS管理 |
| 监控 | 基本健康检查 + 日志 | 简单有效，避免过度工程 |

### 为什么不选全自托管？
- 需要维护服务器，运维成本高
- 对于小团队来说时间成本太大
- 托管服务免费层足够起步

### 为什么选Vercel做前端？
- 与GitHub集成无缝
- 自动预览部署（每个PR都有预览环境）
- 全球CDN，性能优秀
- 免费层对于起步项目足够

### 为什么选Railway/Render做后端？
- 支持Node.js应用直接部署
- 从GitHub自动部署
- 有免费层（Railway有$5免费额度）
- 支持PostgreSQL等附加服务

## 部署架构图

```
GitHub (代码仓库)
    |
    v
GitHub Actions (CI/CD)
    |
    +---> Vercel (前端，Vue 3构建产物)
    |
    +---> Railway/Render (后端，Fastify API)
    |
    +---> Neon/Railway (PostgreSQL数据库)
```

## 部署流程

### 前端部署 (Vercel)
1. 连接GitHub仓库到Vercel
2. 配置构建命令：`npm run build`
3. 配置输出目录：`dist`
4. 每次push到main分支自动部署
5. PR自动创建预览环境

### 后端部署 (Railway/Render)
1. 连接GitHub仓库
2. 配置构建命令：`npm install && npm run build`
3. 配置启动命令：`npm start`
4. 设置环境变量（数据库连接等）
5. 自动从main分支部署

### 数据库设置
1. 在Railway或Neon创建PostgreSQL实例
2. 获取连接字符串
3. 设置为后端的环境变量
4. 运行Prisma迁移：`npx prisma migrate deploy`

## 后果

### 积极影响
1. **零运维成本起步** - 托管服务免费层，无需管理服务器
2. **自动化部署** - GitHub Actions + 托管平台自动部署
3. **预览环境** - 每个PR都有独立预览，方便测试
4. **易于扩展** - 随着业务增长，可以随时升级付费计划
5. **全球性能** - Vercel的CDN保证前端访问速度

### 潜在风险
1. **供应商锁定** - 一定程度依赖Vercel/Railway平台
2. **免费层限制** - 未来可能需要付费
3. **数据库连接池** - 需要管理好连接数

### 缓解措施
- 使用环境变量，避免硬编码平台特定配置
- 定期备份数据库
- 监控免费层使用情况
- 准备好迁移方案（如需要）

## 合规说明

本决策符合MIPYAO公司的以下原则：
- ✅ **AI-first战略** - 自动化部署，减少人工干预
- ✅ **低成本** - 免费层起步，按需付费
- ✅ **高效率** - 自动化CI/CD，快速迭代
- ✅ **可扩展** - 托管平台支持无缝扩展

## 相关决策
- 父决策: [ADR-001: 核心技术栈选型](./ADR-001-tech-stack.md)
- 子决策: 无（这是技术栈决策的最后一个ADR）

## 更新记录
- 2026-05-09: 初始版本，CTO决策采纳
