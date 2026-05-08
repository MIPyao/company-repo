# 贡献指南

感谢您考虑为 MIPYAO 公司代码仓库做出贡献！

## 开发流程

### 1. Fork 和克隆

```bash
# Fork 本仓库后，克隆您的 fork
git clone https://github.com/<your-username>/company-repo.git
cd company-repo

# 添加上游仓库
git remote add upstream https://github.com/mipyao/company-repo.git
```

### 2. 安装依赖

```bash
npm install
```

### 3. 创建功能分支

```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/your-bug-fix
```

### 4. 开发和测试

```bash
# 运行代码检查
npm run lint

# 自动修复格式问题
npm run lint:fix
npm run format

# 运行测试
npm test

# 构建项目
npm run build
```

### 5. 提交代码

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```bash
git add .
git commit -m "feat: 添加新功能"
git commit -m "fix: 修复某个 bug"
git commit -m "docs: 更新文档"
git commit -m "chore: 更新依赖"
```

### 6. 推送并创建 PR

```bash
git push origin feature/your-feature-name
# 然后在 GitHub 上创建 Pull Request
```

## 代码规范

### ESLint

- 所有代码必须通过 ESLint 检查
- 运行 `npm run lint` 检查代码
- 运行 `npm run lint:fix` 自动修复问题

### Prettier

- 代码格式化使用 Prettier
- 运行 `npm run format` 格式化所有文件

### 提交信息规范

| 类型     | 说明                       |
| -------- | -------------------------- |
| feat     | 新功能                     |
| fix      | Bug 修复                   |
| docs     | 文档更新                   |
| style    | 代码格式（不影响功能）     |
| refactor | 重构（既不是新功能也不是修复） |
| test     | 测试相关                   |
| chore    | 构建工具、依赖管理等       |

## 测试要求

- 所有新功能必须包含单元测试
- 测试文件放在 `tests/` 目录
- 测试文件命名：`*.test.js` 或 `*.spec.js`
- 运行 `npm test` 确保所有测试通过

## Pull Request 指南

1. PR 标题遵循 Conventional Commits 规范
2. 填写 PR 模板中的所有信息
3. 确保 CI/CD 检查全部通过
4. 至少请求一位审查者
5. 处理所有代码审查意见

## 问题反馈

- 发现 Bug？请创建 Issue 并附上复现步骤
- 有新功能建议？创建 Issue 并描述需求

## 行为准则

请尊重所有贡献者，保持专业和友好的沟通氛围。
