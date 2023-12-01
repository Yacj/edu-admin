import type { RouteRecordRaw } from 'vue-router'

function Layout() {
  return import('@/layouts/index.vue')
}
const routes: RouteRecordRaw = {
  path: '/dashboard',
  name: 'dashboard',
  redirect: '/dashboard/index',
  component: Layout,
  meta: {
    title: '控制台',
    icon: 'clarity:dashboard-outline-badged',
  },
  children: [
    {
      path: 'index',
      name: 'dashboardIndex',
      component: () => import('@/views/dashboard/index.vue'),
      meta: {
        title: '控制台',
        sidebar: false,
        breadcrumb: false,
        activeMenu: '/dashboard',
      },
    },
  ],
}

export default routes
