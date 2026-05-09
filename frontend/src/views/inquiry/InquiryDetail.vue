<template>
  <div class="inquiry-detail">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>询价单详情</span>
          <el-button @click="$router.back()">返回</el-button>
        </div>
      </template>

      <div v-if="inquiry">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="询价单号">{{ inquiry.inquiryNo }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="statusType(inquiry.status)">{{ statusText(inquiry.status) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="客户">{{ inquiry.customer?.companyName }}</el-descriptions-item>
          <el-descriptions-item label="优先级">{{ inquiry.priority }}</el-descriptions-item>
          <el-descriptions-item label="总金额">¥{{ inquiry.totalAmount?.toFixed(2) }}</el-descriptions-item>
          <el-descriptions-item label="期望交付">{{ formatDate(inquiry.expectedDate) }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ formatDate(inquiry.createdAt) }}</el-descriptions-item>
          <el-descriptions-item label="备注">{{ inquiry.remark || '-' }}</el-descriptions-item>
        </el-descriptions>

        <el-divider>产品列表</el-divider>

        <el-table :data="inquiry.items" style="width: 100%">
          <el-table-column prop="product.name" label="产品名称" />
          <el-table-column prop="quantity" label="数量" width="100" />
          <el-table-column label="单价" width="120">
            <template #default="{ row }">
              ¥{{ row.unitPrice?.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column label="小计" width="120">
            <template #default="{ row }">
              ¥{{ row.subtotal?.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" />
        </el-table>

        <el-divider>操作</el-divider>

        <el-button
          v-if="inquiry.status === 'pending'"
          type="primary"
          @click="updateStatus('processing')"
        >
          开始处理
        </el-button>
        <el-button
          v-if="inquiry.status === 'processing'"
          type="success"
          @click="updateStatus('quoted')"
        >
          已报价
        </el-button>
      </div>
      <el-empty v-else description="加载中..." />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from 'axios'

interface Inquiry {
  id: string
  inquiryNo: string
  status: string
  totalAmount?: number
  priority: string
  expectedDate?: string
  createdAt: string
  remark?: string
  customer?: { companyName: string }
  items?: Array<{
    product: { name: string }
    quantity: number
    unitPrice?: number
    subtotal?: number
    remark?: string
  }>
}

const route = useRoute()
const router = useRouter()
const inquiry = ref<Inquiry>()

const statusType = (status: string) => {
  const map: Record<string, string> = {
    pending: 'warning',
    processing: '',
    quoted: 'success',
    accepted: 'success',
    rejected: 'danger',
    expired: 'info'
  }
  return map[status] || 'info'
}

const statusText = (status: string) => {
  const map: Record<string, string> = {
    pending: '待处理',
    processing: '处理中',
    quoted: '已报价',
    accepted: '已接受',
    rejected: '已拒绝',
    expired: '已过期'
  }
  return map[status] || status
}

const formatDate = (date?: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN')
}

const loadInquiry = async () => {
  try {
    const res = await axios.get(`/api/inquiries/${route.params.id}`)
    if (res.data.success) {
      inquiry.value = res.data.data
    }
  } catch (error) {
    ElMessage.error('加载询价单失败')
  }
}

const updateStatus = async (status: string) => {
  try {
    const res = await axios.patch(`/api/inquiries/${route.params.id}/status`, { status })
    if (res.data.success) {
      ElMessage.success('状态更新成功')
      await loadInquiry()
    }
  } catch (error) {
    ElMessage.error('状态更新失败')
  }
}

onMounted(() => {
  loadInquiry()
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
