# Git 分支策略

本文档定义 MIPYAO 公司代码仓库的分支管理策略和工作流规范。

## 分支模型

我们采用 **GitHub Flow** 简化分支模型，适合持续交付场景。

### 主要分支

| 分支 | 用途 | 保护规则 |
|------|------|----------|
| `main` | 生产环境对应代码，始终保持可发布状态 | 需要 PR 审查，通过 CI 后方可合并 |
| `develop` | 集成开发分支，新功能合并到此分支进行集成测试 | 需要 CI 通过 |

### 支持分支

| 分支类型 | 命名格式 | 用途 | 生命周期 |
|----------|----------|------|----------|
| 功能分支 | `feature/简短描述` | 开发新功能 | 合并后删除 |
| 修复分支 | `fix/简短描述` | 修复 bug | 合并后删除 |
| 热修复分支 | `hotfix/简短描述` | 生产环境紧急修复 | 合并后删除 |
| 发布分支 | `release/v版本号` | 版本发布准备 | 合并后删除 |
| 文档分支 | `docs/简短描述` | 文档更新 | 合并后删除 |
| 重构分支 | `refactor/简短描述` | 代码重构 | 合并后删除 |

## 工作流程

### 1. 开发新功能

```bash
# 从 develop 分支创建功能分支
git checkout develop
git pull origin develop
git checkout -b feature/user-authentication

# 开发并提交
git add .
git commit -m "feat: 添加用户认证功能"

# 推送到远程
git push origin feature/user-authentication

# 在 GitHub 上创建 Pull Request 到 develop 分支
```

### 2. 代码审查与合并

1. 开发者创建 PR（Pull Request）到 `develop` 分支
2. CI/CD 流水线自动运行测试和代码检查
3. 至少一名团队成员进行代码审查
4. 审查通过后，使用 **Squash Merge** 合并到 `develop`
5. 删除功能分支（远程和本地）

### 3. 发布流程

```bash
# 从 develop 创建发布分支
git checkout develop
git pull origin develop
git checkout -b release/v1.1.0

# 进行发布前的最后调整（版本号、CHANGELOG等）
git add .
git commit -m "chore: 准备发布 v1.1.0"

# 合并到 main 和 develop
git checkout main
git merge release/v1.1.0
git tag v1.1.0
git push origin main --tags

git checkout develop
git merge release/v1.1.0
git push origin develop

# 删除发布分支
git branch -d release/v1.1.0
git push origin --delete release/v1.1.0
```

### 4. 热修复流程

```bash
# 从 main 创建热修复分支
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug-fix

# 修复并提交
git add .
git commit -m "fix: 修复关键bug"

# 合并到 main 和 develop
git checkout main
git merge hotfix/critical-bug-fix
git tag v1.0.1
git push origin main --tags

git checkout develop
git merge hotfix/critical-bug-fix
git push origin develop

# 删除热修复分支
git branch -d hotfix/critical-bug-fix
git push origin --delete hotfix/critical-bug-fix
```

## 提交信息规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<类型>[可选的作用域]: <描述>

[可选的正文]

[可选的脚注]
```

### 类型说明

| 类型 | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat: 添加用户登录功能` |
| `fix` | Bug 修复 | `fix: 修复登录页面样式问题` |
| `docs` | 文档更新 | `docs: 更新 API 文档` |
| `style` | 代码格式（不影响功能） | `style: 格式化代码` |
| `refactor` | 重构（不是新功能也不是修复） | `refactor: 重构用户服务层` |
| `perf` | 性能优化 | `perf: 优化数据库查询` |
| `test` | 测试相关 | `test: 添加用户模块单元测试` |
| `chore` | 构建过程或辅助工具变动 | `chore: 更新依赖包版本` |
| `ci` | CI 配置文件和脚本变动 | `ci: 更新 GitHub Actions 配置` |
| `build` | 构建系统或外部依赖的更改 | `build: 升级 webpack 到 v5` |

## 分支保护规则

### main 分支

- [x] 禁止直接 push
- [x] 需要通过 PR 合并
- [x] 需要至少 1 个审查通过
- [x] 需要 CI/CD 流水线通过
- [x] 需要提交信息符合规范

### develop 分支

- [x] 禁止直接 push
- [x] 需要通过 PR 合并
- [x] 需要 CI/CD 流水线通过
- [x] 建议进行代码审查

## 代码审查检查清单

审查者应检查以下项目：

- [ ] 代码功能符合需求
- [ ] 代码逻辑清晰，易于理解
- [ ] 已添加适当的错误处理
- [ ] 已添加单元测试（如适用）
- [ ] 代码符合 ESLint 和 Prettier 规范
- [ ] 没有硬编码的敏感信息（密码、密钥等）
- [ ] 提交信息符合 Conventional Commits 规范
- [ ] 没有引入明显的安全漏洞

## 冲突解决

当 PR 出现合并冲突时：

```bash
# 切换到功能分支
git checkout feature/my-feature

# 从目标分支合并最新代码
git merge develop

# 解决冲突后
git add .
git commit -m "chore: 解决合并冲突"
git push origin feature/my-feature
```

## 常见问题

### Q: 功能分支应该存在多久？
**A:** 尽量保持短期（1-3天），长期分支应拆分为多个小功能分支。

### Q: 可以同时开启多个 PR 吗？
**A:** 可以，但应注意 PR 之间的依赖关系，避免冲突。

### Q: 如何回滚已经合并的代码？
**A:** 在 `main` 分支上 revert 对应的 commit，然后创建新的 PR：

```bash
git checkout main
git revert <commit-hash>
git push origin main
```

## 更新记录

- 2026-05-09: 初始版本，CTO 创建
