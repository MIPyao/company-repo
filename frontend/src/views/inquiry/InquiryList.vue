<template>
  <div class="inquiry-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>询价单列表</span>
          <el-button type="primary" @click="$router.push('/inquiries/create')">
            创建询价单
          </el-button>
        </div>
      </template>

      <el-table :data="inquiries" style="width: 100%">
        <el-table-column prop="inquiryNo" label="询价单号" width="180" />
        <el-table-column prop="customer.companyName" label="客户" width="200" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)">{{ statusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="totalAmount" label="总金额" width="120">
          <template #default="{ row }">
            ¥{{ row.totalAmount?.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="priority" label="优先级" width="100" />
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button type="primary" link @click="$router.push(`/inquiries/${row.id}`)">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="page"
        :page-size="limit"
        :total="total"
        layout="total, prev, pager, next"
        @current-change="loadInquiries"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

interface Inquiry {
  id: string
  inquiryNo: string
  status: string
  totalAmount?: number
  priority: string
  createdAt: string
  customer: { companyName: string }
}

const inquiries = ref<Inquiry[]>([])
const page = ref(1)
const limit = ref(20)
const total = ref(0)

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

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('zh-CN')
}

const loadInquiries = async () => {
  try {
    const res = await axios.get('/api/inquiries', {
      params: { page: page.value, limit: limit.value }
    })
    if (res.data.success) {
      inquiries.value = res.data.data
      total.value = res.data.pagination.total
    }
  } catch (error) {
    ElMessage.error('加载询价单失败')
  }
}

onMounted(() => {
  loadInquiries()
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
