import { setupLayouts } from 'virtual:meta-layouts'
import generatedRoutes from 'virtual:generated-pages'
import type { RouteRecordRaw } from 'vue-router'
import MultilevelMenuExample from './modules/multilevel.menu.example'
import type { Route } from '#/global'
import useSettingsStore from '@/store/modules/settings'

// 固定路由（默认路由）
const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    redirect: '/login/form',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
    },
    children: [
      {
        path: 'form',
        name: 'loginForm',
        component: () => import('@/views/login/form.vue'),
        meta: {
          title: '登录',
        },
      },
      {
        path: 'introduce',
        name: 'LoginIntroduce',
        component: () => import('@/views/login/introduce.vue'),
        meta: {
          title: '介绍',
        },
      },
      {
        path: 'help',
        name: 'LoginHelp',
        component: () => import('@/views/login/help.vue'),
        meta: {
          title: '帮助',
        },
      },
      {
        path: 'follow',
        name: 'LoginFollow',
        component: () => import('@/views/login/follow.vue'),
        meta: {
          title: '关注',
        },
      },
    ],
  },
  {
    path: '/:all(.*)*',
    name: 'notFound',
    component: () => import('@/views/[...all].vue'),
    meta: {
      title: '找不到页面',
    },
  },
]

// 系统路由
const systemRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/index.vue'),
    meta: {
      title: () => useSettingsStore().settings.home.title,
      breadcrumb: false,
    },
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/index.vue'),
        meta: {
          title: () => useSettingsStore().settings.home.title,
          icon: 'ant-design:home-twotone',
          breadcrumb: false,
        },
      },
      {
        path: 'reload',
        name: 'reload',
        component: () => import('@/views/reload.vue'),
        meta: {
          title: '重新加载',
          breadcrumb: false,
        },
      },
    ],
  },
]

// 动态路由（异步路由、导航栏路由）
const asyncRoutes: Route.recordMainRaw[] = [
  {
    meta: {
      title: '演示',
      icon: 'uim:box',
    },
    children: [
      MultilevelMenuExample,
    ],
  },
]

const constantRoutesByFilesystem = generatedRoutes.filter((item) => {
  return item.meta?.enabled !== false && item.meta?.constant === true
})

const asyncRoutesByFilesystem = setupLayouts(generatedRoutes.filter((item) => {
  return item.meta?.enabled !== false && item.meta?.constant !== true && item.meta?.layout !== false
}))

export {
  constantRoutes,
  systemRoutes,
  asyncRoutes,
  constantRoutesByFilesystem,
  asyncRoutesByFilesystem,
}
