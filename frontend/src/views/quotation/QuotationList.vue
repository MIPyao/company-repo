<template>
  <div class="quotation-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>报价单列表</span>
        </div>
      </template>

      <el-table :data="quotations" style="width: 100%">
        <el-table-column prop="quotationNo" label="报价单号" width="180" />
        <el-table-column prop="customer.companyName" label="客户" width="200" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)">{{ statusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="总金额" width="120">
          <template #default="{ row }">
            ¥{{ row.finalAmount?.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="validUntil" label="有效期至" width="120">
          <template #default="{ row }">
            {{ formatDate(row.validUntil) }}
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="page"
        :page-size="limit"
        :total="total"
        layout="total, prev, pager, next"
        @current-change="loadQuotations"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

interface Quotation {
  id: string;
  quotationNo: string;
  status: string;
  finalAmount?: number;
  validUntil?: string;
  createdAt: string;
  customer?: { companyName: string };
}

const quotations = ref<Quotation[]>([])
const page = ref(1)
const limit = ref(20)
const total = ref(0)

const statusType = (status: string) => {
  const map: Record<string, string> = {
    draft: 'info',
    sent: '',
    accepted: 'success',
    rejected: 'danger',
    expired: 'warning'
  }
  return map[status] || 'info'
}

const statusText = (status: string) => {
  const map: Record<string, string> = {
    draft: '草稿',
    sent: '已发送',
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

const loadQuotations = async () => {
  try {
    const res = await axios.get('/api/quotations', {
      params: { page: page.value, limit: limit.value }
    })
    if (res.data.success) {
      quotations.value = res.data.data
      total.value = res.data.pagination.total
    }
  } catch (error) {
    console.error('加载报价单失败', error)
  }
}

onMounted(() => {
  loadQuotations()
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>