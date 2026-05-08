# 开发工具指南

本指南为MIPYAO技术团队提供开发工具配置和使用说明，确保开发环境一致性和高效性。

## 工具概览

| 工具类别 | 工具名称 | 用途 | 配置文件 |
|---------|---------|------|----------|
| 包管理 | pnpm | 快速、节省磁盘空间的包管理器 | `package.json` |
| 代码规范 | ESLint | JavaScript/TypeScript代码检查 | `.eslintrc.js` |
| 代码格式化 | Prettier | 统一代码风格 | `.prettierrc` |
| Git钩子 | Husky + lint-staged | 提交前自动检查 | `.husky/`, `.lintstagedrc` |
| 提交规范 | Commitizen + Conventional Commits | 标准化提交信息 | `.commitlintrc.json` |
| 测试框架 | Vitest | 单元测试（与Vite集成） | `vitest.config.ts` |
| E2E测试 | Playwright | 端到端测试 | `playwright.config.ts` |
| 构建工具 | Vite | 前端构建工具 | `vite.config.ts` |
| 类型检查 | TypeScript | 静态类型检查 | `tsconfig.json` |
| ORM | Prisma | 数据库ORM和迁移 | `prisma/schema.prisma` |
| 版本控制 | Git | 代码版本管理 | `.gitignore` |
| CI/CD | GitHub Actions | 自动化流水线 | `.github/workflows/` |

## 环境设置

### 1. 安装Node.js和pnpm

```bash
# 安装Node.js 20.x LTS (推荐使用nvm)
# Windows: 从 https://nodejs.org 下载安装

# 安装pnpm
npm install -g pnpm

# 验证安装
node --version  # 应显示 v20.x.x
pnpm --version   # 应显示 8.x.x 或更高
```

### 2. 项目初始化

```bash
# 克隆仓库
git clone https://github.com/mipyao/company-repo.git
cd company-repo

# 安装依赖
pnpm install

# 初始化Git钩子
pnpm prepare
```

### 3. 配置文件说明

#### `.eslintrc.js` (已存在)
```javascript
module.exports = {
  root: true,
  env: { browser: true, node: true, es2021: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'vue'],
  rules: {
    // 自定义规则
  },
};
```

#### `.prettierrc` (已存在)
```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

#### 建议添加的配置文件

**`tsconfig.json`**:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "jsx": "preserve",
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.vue", "tests/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

**`.lintstagedrc.json`**:
```json
{
  "*.{js,jsx,ts,tsx,vue}": ["eslint --fix", "prettier --write"],
  "*.{css,scss,vue}": ["prettier --write"],
  "*.md": ["prettier --write"]
}
```

**`.husky/pre-commit`**:
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm lint-staged
```

## 常用命令

### 开发命令
```bash
pnpm dev          # 启动开发服务器
pnpm build        # 构建生产版本
pnpm preview      # 预览生产构建
pnpm test         # 运行测试
pnpm test:ui      # 测试UI界面
pnpm type-check   # TypeScript类型检查
pnpm lint         # ESLint检查
pnpm lint:fix     # ESLint自动修复
pnpm format       # Prettier格式化
```

### 数据库命令
```bash
pnpm prisma:generate   # 生成Prisma Client
pnpm prisma:migrate    # 创建和应用迁移
pnpm prisma:studio     # 打开Prisma Studio
pnpm prisma:seed       # 种子数据
```

### Git提交
```bash
# 使用Commitizen交互式提交
pnpm commit

# 或直接提交（会触发lint-staged检查）
git commit -m "feat: 添加新功能"
```

## IDE配置

### VS Code推荐扩展
- Vue Language Features (Volar)
- TypeScript Vue Plugin (Volar)
- ESLint
- Prettier
- Prisma
- GitLens

### VS Code设置 (`.vscode/settings.json`)
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.preferTypeOnlyAutoImports": true,
  "vue.insertion?: true
}
```

## 故障排查

### pnpm安装慢
```bash
# 设置国内镜像
pnpm config set registry https://registry.npmmirror.com
```

### Prisma生成失败
```bash
# 确保数据库URL已设置
export DATABASE_URL="postgresql://..."
pnpm prisma generate
```

### ESLint找不到Vue解析器
```bash
pnpm add -D vue-eslint-parser
```

## 更新记录
- 2026-05-09: 初始版本，CTO创建
