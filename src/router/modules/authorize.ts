function Layout() {
  return import('@/layouts/index.vue')
}
const router = [
  {
    path: '/authorize',
    name: 'authorize',
    redirect: '/authorize/index',
    component: Layout,
    meta: {
      title: '授权管理',
      icon: 'lock',
    },
    children: [
      {
        path: 'index',
        name: 'authorizeIndex',
        component: () => import('@/views/authorize/index.vue'),
        meta: {
          title: '授权管理',
          icon: 'lock',
          sidebar: false,
          breadcrumb: false,
          activeMenu: '/authorize',
        },
      },
    ],
  },
  {
    path: '/authorize/add',
    name: 'authorizeAdd',
    component: Layout,
    meta: {
      title: '新增授权',
      icon: 'lock',
    },
    children: [
      {
        path: '',
        name: 'authorizeAddIndex',
        component: () => import('@/views/authorize/add.vue'),
        meta: {
          title: '新增授权',
          icon: 'lock',
          sidebar: false,
          breadcrumb: false,
        },
      },
    ],
  },
]

export default router
