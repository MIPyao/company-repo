<template>
  <div class="inquiry-create">
    <el-card>
      <template #header>
        <span>创建询价单</span>
      </template>

      <el-form :model="form" label-width="120px">
        <el-form-item label="客户" required>
          <el-select v-model="form.customerId" placeholder="选择客户" filterable>
            <el-option
              v-for="c in customers"
              :key="c.id"
              :label="c.companyName"
              :value="c.id"
            />
          </el-select>
          <el-button type="primary" link @click="showCustomerDialog = true">
            新建客户
          </el-button>
        </el-form-item>

        <el-form-item label="期望交付日期">
          <el-date-picker
            v-model="form.expectedDate"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>

        <el-form-item label="优先级">
          <el-select v-model="form.priority">
            <el-option label="低" value="low" />
            <el-option label="普通" value="normal" />
            <el-option label="高" value="high" />
            <el-option label="紧急" value="urgent" />
          </el-select>
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="3" />
        </el-form-item>

        <el-divider>产品列表</el-divider>

        <div v-for="(item, index) in form.items" :key="index" class="product-item">
          <el-form-item :label="'产品 ' + (index + 1)">
            <el-select v-model="item.productId" placeholder="选择产品" filterable>
              <el-option
                v-for="p in products"
                :key="p.id"
                :label="`${p.name} (¥${p.unitPrice})`"
                :value="p.id"
              />
            </el-select>
            <el-input-number v-model="item.quantity" :min="1" />
            <el-button type="danger" @click="removeItem(index)">删除</el-button>
          </el-form-item>
        </div>

        <el-button @click="addItem">添加产品</el-button>

        <el-form-item>
          <el-button type="primary" @click="submit">提交询价单</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 新建客户对话框 -->
    <el-dialog v-model="showCustomerDialog" title="新建客户">
      <el-form :model="customerForm" label-width="120px">
        <el-form-item label="公司名称" required>
          <el-input v-model="customerForm.companyName" />
        </el-form-item>
        <el-form-item label="联系人" required>
          <el-input v-model="customerForm.contactName" />
        </el-form-item>
        <el-form-item label="邮箱" required>
          <el-input v-model="customerForm.email" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="customerForm.phone" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCustomerDialog = false">取消</el-button>
        <el-button type="primary" @click="createCustomer">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const router = useRouter()

const form = reactive({
  customerId: '',
  expectedDate: '',
  priority: 'normal',
  remark: '',
  items: [{ productId: '', quantity: 1, remark: '' }]
})

const customers = ref<any[]>([])
const products = ref<any[]>([])
const showCustomerDialog = ref(false)
const customerForm = reactive({
  companyName: '',
  contactName: '',
  email: '',
  phone: ''
})

const loadCustomers = async () => {
  const res = await axios.get('/api/customers')
  if (res.data.success) customers.value = res.data.data
}

const loadProducts = async () => {
  const res = await axios.get('/api/products')
  if (res.data.success) products.value = res.data.data
}

const addItem = () => {
  form.items.push({ productId: '', quantity: 1, remark: '' })
}

const removeItem = (index: number) => {
  form.items.splice(index, 1)
}

const createCustomer = async () => {
  try {
    const res = await axios.post('/api/customers', customerForm)
    if (res.data.success) {
      ElMessage.success('客户创建成功')
      showCustomerDialog.value = false
      await loadCustomers()
      form.customerId = res.data.data.id
    }
  } catch (error) {
    ElMessage.error('创建客户失败')
  }
}

const submit = async () => {
  try {
    const res = await axios.post('/api/inquiries', form)
    if (res.data.success) {
      ElMessage.success('询价单创建成功')
      router.push(`/inquiries/${res.data.data.id}`)
    }
  } catch (error) {
    ElMessage.error('创建询价单失败')
  }
}

onMounted(() => {
  loadCustomers()
  loadProducts()
})
</script>

<style scoped>
.product-item {
  margin-bottom: 10px;
}
</style>
