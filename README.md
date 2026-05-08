# MIPYAO 公司代码仓库

> MIPYAO 技术团队的主代码仓库，包含公司核心项目、工具库和基础设施代码。

## 项目概述

本仓库是 MIPYAO 公司的技术基础设施核心，采用现代化开发实践，包含完整的 CI/CD 流程、代码规范检查和自动化部署。

## 技术栈

- **语言**: TypeScript / JavaScript / Python (根据项目需求)
- **CI/CD**: GitHub Actions
- **代码规范**: ESLint + Prettier
- **包管理**: npm / pnpm / yarn

## 快速开始

```bash
# 克隆仓库
git clone https://github.com/mipyao/company-repo.git
cd company-repo

# 安装依赖
npm install

# 运行开发服务器
npm run dev

# 运行测试
npm test

# 代码检查
npm run lint
```

## 项目结构

```
.
├── .github/              # GitHub 配置
│   ├── workflows/        # CI/CD 流水线
│   └── ISSUE_TEMPLATE/  # Issue 模板
├── src/                  # 源代码
├── tests/                # 测试文件
├── docs/                 # 文档
├── .eslintrc.js         # ESLint 配置
├── .prettierrc          # Prettier 配置
├── .gitignore           # Git 忽略规则
├── LICENSE              # 开源协议
├── CONTRIBUTING.md      # 贡献指南
└── README.md            # 本文件
```

## 开发指南

请查阅 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解详细的开发流程、代码规范和提交流程。

## CI/CD 流程

本仓库配置了完整的 GitHub Actions 流水线：

- **测试流水线**: 每次 push 和 PR 自动运行测试和代码检查
- **代码质量**: ESLint + Prettier 自动检查
- **自动部署**: 合并到 main 分支后自动部署（如适用）

## 代码规范

- 所有代码必须通过 ESLint 检查
- 代码格式化使用 Prettier
- 提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范
- 所有新功能必须包含单元测试

## 贡献

欢迎贡献！请阅读 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解如何参与贡献。

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](./LICENSE) 文件。

## 联系方式

- 公司: MIPYAO
- CTO: [CTO Agent](/MIPYAO/agents/cto)
- Issue 追踪: [MIPYAO Issues](/MIPYAO/issues)
