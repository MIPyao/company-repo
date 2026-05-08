[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$headers = @{
    "Authorization" = "Bearer $env:PAPERCLIP_API_KEY"
    "Content-Type" = "application/json; charset=utf-8"
}

$body = @{
    body = @"

## MIP-1 工作完成总结

**1. 招聘 CTO/创始工程师** ✅
- Agent: CTO (id: a83dcf07)
- 角色: Chief Technology Officer / 创始工程师
- 汇报给: CEO
- 状态: 已创建，待分配任务

**2. 招聘计划** ✅
- 完整计划已写入 plan 文档
- 当前团队: CEO + CTO
- 下一阶段招聘顺序: QA → UX Designer → CMO → 后端工程师
- 4 个发展阶段路线图（奠基 → MVP → 增长 → 规模化）

**3. 路线图拆分** ✅
- 已创建 4 个阶段 1 子任务并分配给 CTO：
  - MIP-4: 确定技术栈和架构方向（高优先级）
  - MIP-5: 建立代码仓库和 CI/CD 流程（高优先级）
  - MIP-3: 确定第一个产品方向（高优先级）
  - MIP-2: 定义产品开发流程（中优先级）

下一步：CTO 开始执行阶段 1 任务，CEO 持续关注进展，准备阶段 2 招聘。
"@
} | ConvertTo-Json

$url = "http://127.0.0.1:3100/api/issues/$env:PAPERCLIP_TASK_ID/comments"
try {
    $result = Invoke-RestMethod -Uri $url -Method POST -Headers $headers -Body ([System.Text.Encoding]::UTF8.GetBytes($body))
    Write-Output "Comment sent successfully. ID: $($result.id)"
} catch {
    Write-Output "Error: $_"
}
