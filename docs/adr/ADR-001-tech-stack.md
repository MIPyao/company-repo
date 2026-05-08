# ADR-001: 核心技术栈选型

日期: 2026-05-09
状态: 已采纳
作者: CTO (a83dcf07-81be-46b5-863d-e6b31207a2b2)

## 上下文

MIPYAO作为一家zero person company（零人公司），需要建立高效、自动化、AI-first的技术栈。公司目前仅有1位创始工程师（CTO），需要选择能够最大化个人生产力的技术栈。

关键约束：
- 团队规模：1人（CTO），未来可能扩展
- 战略：AI-first（AI辅助开发）
- 成本：低预算，追求性价比
- 效率：快速迭代，最小可行产品（MVP）优先

## 决策

我们选择以下核心技术栈：

### 主语言
- **TypeScript** - 主要开发语言，类型安全，生态丰富
- **JavaScript (Node.js)** - 运行时，前后端统一语言
- **Python** - 辅助语言，用于AI/ML相关任务（按需使用）

### 前端技术栈
- **框架**: Vue 3 (Composition API + `<script setup>`)
- **构建工具**: Vite
- **状态管理**: Pinia (Vue 3官方推荐)
- **路由**: Vue Router 4
- **UI组件库**: Element Plus (企业级应用) 或 Naive UI (轻量级)
- **样式**: Tailwind CSS (实用优先) + SCSS (按需)

### 后端技术栈
- **运行时**: Node.js 18.x / 20.x LTS
- **框架**: Express.js (轻量级) 或 Fastify (高性能)
- **API风格**: RESTful API (主流) + 考虑 tRPC (TypeScript全栈类型安全)
- **认证**: JWT + OAuth2 (按需)

### 数据库
- **主数据库**: PostgreSQL (关系型，功能强大，开源免费)
- **缓存**: Redis (按需)
- **ORM**: Prisma (TypeScript优先) 或 Drizzle ORM (轻量级)

### 部署与基础设施
- **版本控制**: Git + GitHub
- **CI/CD**: GitHub Actions (已配置)
- **部署平台**: Vercel (前端) + Railway / Render (后端) 或自托管 (低成本)
- **容器化**: Docker + Docker Compose (可选，本地开发环境)
- **监控**: 基本健康检查 + 日志

### 开发工具链
- **包管理**: pnpm (速度快，磁盘空间效率高)
- **代码规范**: ESLint + Prettier (已配置)
- **测试**: Vitest (单元测试) + Playwright (E2E测试)
- **Git钩子**: Husky + lint-staged
- **提交规范**: Conventional Commits

## 后果

### 积极影响
1. **前后端统一语言** - 降低上下文切换成本
2. **TypeScript类型安全** - 减少运行时错误，AI辅助开发更友好
3. **Vue 3生态成熟** - 中文文档完善，适合国内团队
4. **PostgreSQL功能全面** - 支持JSON、全文搜索，扩展性强
5. **GitHub Actions免费** - 公共仓库免费，私有仓库有免费额度
6. **AI辅助开发友好** - TypeScript + Vue 3有大量训练数据

### 潜在风险
1. **技术栈偏重JavaScript生态** - 对于CPU密集型任务可能不如Go/Rust
2. **初期配置成本** - 需要设置多个工具链
3. **未来扩展挑战** - 团队扩大后可能需要引入更多专业化工具

### 缓解措施
- 使用脚手架工具快速初始化项目
- 建立清晰的文档和最佳实践
- 定期评估技术栈是否满足业务需求

## 合规说明

本决策符合MIPYAO公司的以下原则：
- ✅ **AI-first战略** - TypeScript/Vue 3对AI辅助开发友好
- ✅ **低成本** - 开源工具为主，托管平台有免费层
- ✅ **高效率** - 统一语言，丰富生态，快速开发
- ✅ **可扩展** - 模块化架构，主流技术栈，易于招聘

## 相关决策
- [ADR-002: 前端框架选型](./ADR-002-frontend-framework.md)
- [ADR-003: 后端框架选型](./ADR-003-backend-framework.md)
- [ADR-004: 数据库选型](./ADR-004-database-selection.md)
- [ADR-005: 部署策略](./ADR-005-deployment-strategy.md)

## 更新记录
- 2026-05-09: 初始版本，CTO决策采纳
