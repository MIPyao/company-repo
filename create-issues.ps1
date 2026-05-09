[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$headers = @{
    "Authorization" = "Bearer $env:PAPERCLIP_API_KEY"
    "Content-Type" = "application/json; charset=utf-8"
}
$companyId = $env:PAPERCLIP_COMPANY_ID
$parentId = $env:PAPERCLIP_TASK_ID
$projectId = "7d6147d7-1a2e-49b6-8d71-a30ec16b5863"
$goalId = "d92ad6a3-f9d5-4269-8f2a-0dcd38b2e4cf"
$assigneeId = "a83dcf07-81be-46b5-863d-e6b31207a2b2"

$issues = @(
    @{
        title = "确定技术栈和架构方向"
        description = "作为 CTO，确定公司的技术栈和整体架构方向。`n`n交付物：`n- 技术栈选型文档（前端、后端、数据库、基础设施）`n- 架构决策记录（ADR）`n- 开发环境搭建指南`n`n考虑因素：`n- 团队规模（目前 1 名工程师）`n- AI-first 战略`n- 快速迭代能力`n- 成本效益"
        priority = "high"
    },
    @{
        title = "建立代码仓库和 CI/CD 流程"
        description = "建立公司的代码仓库和持续集成/持续部署流程。`n`n交付物：`n- Git 仓库（GitHub/GitLab）`n- CI/CD 流水线配置`n- 代码规范和 linting 配置`n- 分支策略文档`n- README 和贡献指南"
        priority = "high"
    },
    @{
        title = "确定第一个产品方向"
        description = "与 CEO 协作，确定公司的第一个产品方向。`n`n交付物：`n- 产品需求文档（PRD）`n- 用户画像和痛点分析`n- 竞品分析`n- MVP 功能范围定义`n- 成功指标定义`n`n背景：公司目标是 AI in all！，需要找到第一个有价值的切入点。"
        priority = "high"
    },
    @{
        title = "定义产品开发流程"
        description = "建立从设计到发布的产品开发流程。`n`n交付物：`n- 产品开发工作流文档`n- 设计 → 开发 → 测试 → 发布的每个阶段定义`n- 代码审查流程`n- 发布检查清单`n- 与 Paperclip 任务系统的集成方式"
        priority = "medium"
    }
)

foreach ($issue in $issues) {
    $body = @{
        title = $issue.title
        description = $issue.description
        assigneeAgentId = $assigneeId
        parentId = $parentId
        projectId = $projectId
        goalId = $goalId
        priority = $issue.priority
        status = "todo"
    } | ConvertTo-Json

    $url = "http://127.0.0.1:3100/api/companies/$companyId/issues"
    try {
        $result = Invoke-RestMethod -Uri $url -Method POST -Headers $headers -Body ([System.Text.Encoding]::UTF8.GetBytes($body))
        Write-Output "Created: $($result.identifier) - $($result.title)"
    } catch {
        Write-Output "Error creating '$($issue.title)': $_"
    }
}
