import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/inquiries'
    },
    {
      path: '/inquiries',
      name: 'InquiryList',
      component: () => import('@/views/inquiry/InquiryList.vue'),
      meta: { title: '询价单列表' }
    },
    {
      path: '/inquiries/create',
      name: 'CreateInquiry',
      component: () => import('@/views/inquiry/InquiryCreate.vue'),
      meta: { title: '创建询价单' }
    },
    {
      path: '/inquiries/:id',
      name: 'InquiryDetail',
      component: () => import('@/views/inquiry/InquiryDetail.vue'),
      meta: { title: '询价单详情' }
    },
    {
      path: '/customers',
      name: 'CustomerList',
      component: () => import('@/views/customer/CustomerList.vue'),
      meta: { title: '客户列表' }
    },
    {
      path: '/products',
      name: 'ProductList',
      component: () => import('@/views/product/ProductList.vue'),
      meta: { title: '产品列表' }
    },
    {
      path: '/quotations',
      name: 'QuotationList',
      component: () => import('@/views/quotation/QuotationList.vue'),
      meta: { title: '报价单列表' }
    },
    {
      path: '/orders',
      name: 'OrderList',
      component: () => import('@/views/order/OrderList.vue'),
      meta: { title: '订单列表' }
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title as string || 'MIPYAO 产品询价系统'
  next()
})

export default router
