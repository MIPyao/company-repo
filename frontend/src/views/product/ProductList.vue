<template>
  <div class="product-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>产品列表</span>
        </div>
      </template>

      <el-table :data="products" style="width: 100%">
        <el-table-column prop="name" label="产品名称" />
        <el-table-column prop="model" label="型号" width="150" />
        <el-table-column prop="category.name" label="分类" width="150" />
        <el-table-column label="单价" width="120">
          <template #default="{ row }">
            ¥{{ row.unitPrice?.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="成本价" width="120">
          <template #default="{ row }">
            ¥{{ row.costPrice?.toFixed(2) || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="stockStatus" label="库存状态" width="120">
          <template #default="{ row }">
            <el-tag :type="row.stockStatus === 'in_stock' ? 'success' : 'warning'">
              {{ row.stockStatus === 'in_stock' ? '有货' : row.stockStatus === 'out_of_stock' ? '缺货' : '预售' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isActive" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.isActive ? 'success' : 'info'">
              {{ row.isActive ? '上架' : '下架' }}
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
        @current-change="loadProducts"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

interface Product {
  id: string
  name: string
  model?: string
  category?: { name: string }
  unitPrice: number
  costPrice?: number
  stockStatus: string
  isActive: boolean
  createdAt: string
}

const products = ref<Product[]>([])
const page = ref(1)
const limit = ref(20)
const total = ref(0)

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('zh-CN')
}

const loadProducts = async () => {
  try {
    const res = await axios.get('/api/products', {
      params: { page: page.value, limit: limit.value, isActive: undefined }
    })
    if (res.data.success) {
      products.value = res.data.data
      total.value = res.data.pagination.total
    }
  } catch (error) {
    console.error('加载产品失败', error)
  }
}

onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
