import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import ProductsView from '../views/ProductsView.vue'
import PlaceholderView from '../views/PlaceholderView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        { path: '', redirect: '/products' },
        { path: 'dashboard', name: 'dashboard', component: PlaceholderView, props: { title: 'Dashboard' } },
        { path: 'products', name: 'products', component: ProductsView },
        { path: 'add-products', name: 'add-products', component: () => import('../views/AddProductView.vue') },
        { path: 'orders', name: 'orders', component: PlaceholderView, props: { title: 'Orders' } },
        { path: 'stockmanagement', name: 'stockmanagement', component: PlaceholderView, props: { title: 'Stock Management' } },
        { path: 'deliveries', name: 'deliveries', component: PlaceholderView, props: { title: 'Deliveries' } },
        { path: 'reviews', name: 'reviews', component: PlaceholderView, props: { title: 'Reviews' } },
        { path: 'profile', name: 'profile', component: PlaceholderView, props: { title: 'Business Profile' } },
      ],
    },
  ],
})

export default router
