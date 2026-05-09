<template>
  <div class="order-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>订单列表</span>
        </div>
      </template>

      <el-table :data="orders" style="width: 100%">
        <el-table-column prop="orderNo" label="订单号" width="180" />
        <el-table-column prop="customer.companyName" label="客户" width="200" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)">{{ statusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="订单金额" width="120">
          <template #default="{ row }">
            ¥{{ row.totalAmount?.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="deliveryDate" label="交付日期" width="120">
          <template #default="{ row }">
            {{ formatDate(row.deliveryDate) }}
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
        @current-change="loadOrders"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

interface Order {
  id: string;
  orderNo: string;
  status: string;
  totalAmount?: number;
  deliveryDate?: string;
  createdAt: string;
  customer?: { companyName: string };
}

const orders = ref<Order[]>([])
const page = ref(1)
const limit = ref(20)
const total = ref(0)

const statusType = (status: string) => {
  const map: Record<string, string> = {
    pending: 'warning',
    confirmed: '',
    producing: 'warning',
    shipped: 'success',
    completed: 'success',
    cancelled: 'danger'
  }
  return map[status] || 'info'
}

const statusText = (status: string) => {
  const map: Record<string, string> = {
    pending: '待确认',
    confirmed: '已确认',
    producing: '生产中',
    shipped: '已发货',
    completed: '已完成',
    cancelled: '已取消'
  }
  return map[status] || status
}

const formatDate = (date?: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN')
}

const loadOrders = async () => {
  try {
    const res = await axios.get('/api/orders', {
      params: { page: page.value, limit: limit.value }
    })
    if (res.data.success) {
      orders.value = res.data.data
      total.value = res.data.pagination.total
    }
  } catch (error) {
    console.error('加载订单失败', error)
  }
}

onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>