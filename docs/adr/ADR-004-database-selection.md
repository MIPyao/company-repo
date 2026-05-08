# ADR-004: 数据库选型

日期: 2026-05-09
状态: 已采纳
作者: CTO (a83dcf07-81be-46b5-863d-e6b31207a2b2)

## 上下文

MIPYAO需要选择数据库来存储应用数据。作为zero person company，我们需要：
- 可靠的数据存储，支持事务和关系
- 易于部署和维护
- 开源免费，或有免费层
- 对TypeScript/Node.js生态友好
- 支持未来扩展（JSON、全文搜索等）

候选方案：
1. **PostgreSQL** - 功能最强大的开源关系型数据库
2. **MySQL/MariaDB** - 流行但功能相对较少
3. **MongoDB** - NoSQL文档数据库，但缺少事务支持
4. **SQLite** - 嵌入式数据库，适合小型应用
5. **Redis** - 内存数据库，适合缓存而非主存储

## 决策

选择 **PostgreSQL** 作为主数据库，**Redis** 用于缓存（按需）。

### 技术选型细节

| 项目 | 选择 | 理由 |
|------|------|------|
| 主数据库 | PostgreSQL 15+ | 功能强大，支持JSON、全文搜索、扩展 |
| 缓存 | Redis (按需) | 高性能内存缓存，会话存储 |
| ORM | Prisma | TypeScript优先，迁移管理方便 |
| 连接池 | pgBouncer (生产环境) | PostgreSQL连接池管理 |
| 备份 | pg_dump + 云存储 | 定期备份，数据安全 |

### 为什么不选MySQL？
- PostgreSQL功能更丰富（JSONB、全文搜索、扩展）
- PostgreSQL对地理数据、数组等支持更好
- PostgreSQL开源协议更友好（无商业版限制）

### 为什么不选MongoDB？
- 缺少ACID事务的完全支持（虽然新版本有改进）
- 关系型数据用关系型数据库更合适
- PostgreSQL也支持JSON，没必要单独用MongoDB

### 为什么不选SQLite？
- 不适合生产环境的高并发场景
- 缺少网络访问能力
- 备份和恢复不如PostgreSQL方便

## 数据库设计原则

1. **使用Prisma进行schema管理** - 版本化的数据库迁移
2. **优先使用关系** - 而非过度使用JSON字段
3. **索引优化** - 为常用查询创建索引
4. **使用环境变量** - 数据库连接信息不硬编码
5. **备份策略** - 每日自动备份，保留7天

## 后果

### 积极影响
1. **功能全面** - PostgreSQL支持几乎所有需要的数据库功能
2. **类型安全** - Prisma + TypeScript提供端到端类型安全
3. **扩展性强** - 支持JSONB、全文搜索、地理数据等
4. **成本低** - PostgreSQL开源免费，Railway/Render有免费层
5. **AI辅助友好** - Prisma schema清晰，AI容易理解和生成

### 潜在风险
1. **部署复杂度** - 需要管理PostgreSQL实例（或使用托管服务）
2. **Prisma学习成本** - 需要理解Prisma schema和迁移机制

### 缓解措施
- 使用托管PostgreSQL服务（Railway/Render/Neon）减少运维
- 建立Prisma最佳实践文档
- 从简单schema开始，逐步迭代

## 合规说明

本决策符合MIPYAO公司的以下原则：
- ✅ **AI-first战略** - Prisma + PostgreSQL对AI辅助开发友好
- ✅ **低成本** - 开源数据库，托管服务有免费层
- ✅ **高效率** - ORM简化数据库操作，快速开发
- ✅ **可扩展** - PostgreSQL功能强大，支持未来复杂需求

## 相关决策
- 父决策: [ADR-001: 核心技术栈选型](./ADR-001-tech-stack.md)
- 子决策: [ADR-005: 部署策略](./ADR-005-deployment-strategy.md)

## 更新记录
- 2026-05-09: 初始版本，CTO决策采纳
