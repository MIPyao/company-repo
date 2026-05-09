<template>
  <div class="customer-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>客户列表</span>
        </div>
      </template>

      <el-table :data="customers" style="width: 100%">
        <el-table-column prop="companyName" label="公司名称" />
        <el-table-column prop="contactName" label="联系人" width="120" />
        <el-table-column prop="phone" label="电话" width="150" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="customerLevel" label="等级" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'">
              {{ row.status === 'active' ? '活跃' : '停用' }}
            </el-tag>
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
        @current-change="loadCustomers"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

interface Customer {
  id: string
  companyName: string
  contactName: string
  phone?: string
  email: string
  customerLevel: string
  status: string
  createdAt: string
}

const customers = ref<Customer[]>([])
const page = ref(1)
const limit = ref(20)
const total = ref(0)

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('zh-CN')
}

const loadCustomers = async () => {
  try {
    const res = await axios.get('/api/customers', {
      params: { page: page.value, limit: limit.value }
    })
    if (res.data.success) {
      customers.value = res.data.data
      total.value = res.data.pagination.total
    }
  } catch (error) {
    console.error('加载客户失败', error)
  }
}

onMounted(() => {
  loadCustomers()
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
