# MIPYAO 技术栈总结

> CTO确认的公司核心技术栈架构功能文档
> 创建日期: 2026-05-09
> 作者: CTO (a83dcf07-81be-46b5-863d-e6b31207a2b2)
> 状态: ✅ 已确认

## 概览

MIPYAO作为zero person company（零人公司），采用AI-first战略，选择的技术栈以**高效率、低成本、易扩展**为核心原则。

## 核心技术栈

### 开发语言
- **TypeScript** - 主开发语言（类型安全，AI辅助友好）
- **JavaScript (Node.js)** - 运行时环境
- **Python** - 辅助语言（AI/ML任务按需使用）

### 前端技术栈
| 组件 | 技术选型 | 版本/说明 |
|------|---------|-----------|
| 框架 | Vue 3 | Composition API + `<script setup>` |
| 构建工具 | Vite | 很速热更新，现代构建 |
| 状态管理 | Pinia | Vue 3官方推荐 |
| 路由 | Vue Router 4 | 官方路由库 |
| UI组件库 | Element Plus | 企业级组件库 |
| 样式 | Tailwind CSS + SCSS | 实用优先 + 预处理 |
| 类型检查 | TypeScript 5.x | 严格模式 |

### 后端技术栈
| 组件 | 技术选型 | 版本/说明 |
|------|---------|-----------|
| 运行时 | Node.js | 18.x / 20.x LTS |
| 框架 | Fastify | 高性能，插件架构 |
| API风格 | RESTful API | 主流标准 |
| 备选方案 | tRPC | 类型安全API（按需） |
| 认证 | JWT + bcrypt | 无状态认证 |
| 验证 | Fastify内置 + Zod | JSON Schema验证 |

### 数据库
| 组件 | 技术选型 | 说明 |
|------|---------|------|
| 主数据库 | PostgreSQL 15+ | 功能强大，开源免费 |
| 缓存 | Redis | 按需使用，会话存储 |
| ORM | Prisma | TypeScript优先，迁移管理 |
| 连接池 | pgBouncer | 生产环境（可选） |

### 部署与基础设施
| 组件 | 技术选型 | 说明 |
|------|---------|------|
| 版本控制 | Git + GitHub | 代码托管 |
| CI/CD | GitHub Actions | 已配置流水线 |
| 前端部署 | Vercel | 全球CDN，自动部署 |
| 后端部署 | Railway / Render | 托管服务，有免费层 |
| 数据库托管 | Neon / Railway PostgreSQL | 托管PostgreSQL |
| 容器化 | Docker + Docker Compose | 本地开发环境 |
| 监控 | 健康检查 + 日志 | 基本监控 |

### 开发工具链
| 工具 | 用途 | 配置文件 |
|------|------|----------|
| 包管理 | pnpm | `package.json` |
| 代码规范 | ESLint | `.eslintrc.js` (已配置) |
| 代码格式化 | Prettier | `.prettierrc` (已配置) |
| Git钩子 | Husky + lint-staged | `.husky/`, `.lintstagedrc` |
| 提交规范 | Conventional Commits | `.commitlintrc.json` |
| 测试框架 | Vitest | 单元测试 |
| E2E测试 | Playwright | 端到端测试 |
| 类型检查 | TypeScript | `tsconfig.json` |

## 架构决策记录 (ADR)

所有技术选型均有对应的架构决策记录：

1. [ADR-001: 核心技术栈选型](./adr/ADR-001-tech-stack.md) - 总体技术方向
2. [ADR-002: 前端框架选型](./adr/ADR-002-frontend-framework.md) - Vue 3决策
3. [ADR-003: 后端框架选型](./adr/ADR-003-backend-framework.md) - Fastify决策
4. [ADR-004: 数据库选型](./adr/ADR-004-database-selection.md) - PostgreSQL决策
5. [ADR-005: 部署策略](./adr/ADR-005-deployment-strategy.md) - 部署方案决策

## 合规确认

本技术栈符合MIPYAO公司原则：

- ✅ **AI-first战略** - TypeScript全栈，丰富训练数据，AI辅助开发友好
- ✅ **低成本** - 开源工具为主，托管服务有免费层
- ✅ **高效率** - 统一语言，丰富生态，快速开发
- ✅ **可扩展** - 主流技术栈，易于招聘和扩展

## 当前项目状态

### 已实现
- ✅ GitHub Actions CI/CD流水线 (`.github/workflows/ci.yml`)
- ✅ ESLint配置 (`.eslintrc.js`)
- ✅ Prettier配置 (`.prettierrc`)
- ✅ Git忽略规则 (`.gitignore`)
- ✅ README文档 (`README.md`)

### 待实现（下一步）
- [ ] 初始化Vue 3 + Vite前端项目
- [ ] 初始化Fastify后端项目
- [ ] 配置Prisma + PostgreSQL
- [ ] 设置Husky + lint-staged
- [ ] 配置Vercel部署
- [ ] 配置Railway/Render部署

## 开发指南

详细开发工具配置和使用说明请参考：
- [开发工具指南](./guides/development-tools.md)
- [ADR目录](./adr/README.md)

## 更新记录

- 2026-05-09: 初始版本，CTO确认所有技术栈选型
- 创建5个ADR文档，覆盖所有关键技术决策
- 创建开发工具指南文档
