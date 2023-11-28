<script setup lang="ts">
const navId = ref(5)
const navList = ref([
  {
    name: '产品介绍',
    id: 1,
    path: '/login/introduce',
  },
  {
    name: '使用帮助',
    id: 2,
    path: '/login/help',
  },
  {
    name: '关于我们',
    id: 3,
    path: '',
  },
  {
    name: '关注我们',
    id: 4,
    path: '/login/follow',
  },
  {
    name: '用户登录',
    id: 5,
    path: '/login/form',
  },
])
const router = useRouter()
function handleClick(id: number, path: string) {
  if (id === 3) {
    window.open('http://www.eduyq.net/', '_blank', ''
    + 'width=900,'
    + 'height=800,'
    + 'menubar=no,'
    + 'toolbar=no, '
    + 'status=no,'
    + 'scrollbars=yes',
    )
  }
  else {
    router.push(path)
  }
}
</script>

<template>
  <header
    class="text-gray-600 body-font shadow-md"
  >
    <div class="login-container mx-auto flex flex-wrap px-5 py-2 flex-col md:flex-row items-center">
      <a class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0 dark:bg-white-900">
        <img src="../../assets/images/login-logo.png" alt="" class="w-38">
      </a>
      <nav class="md:ml-auto flex flex-wrap items-center text-base justify-center">
        <div
          v-for="item in navList" :key="item.id"
          class="mr-5 hover:text-gray-900 cursor-pointer text-base dark:text-gray-400"
          :class="{
            active: item.path === $route.path,
          }"
          @click="handleClick(item.id, item.path)"
        >
          {{ item.name }}
        </div>
      </nav>
    </div>
  </header>
  <router-view />
  <footer class="w-full text-center mt-7 text-stone-400 text-base">
    <p> Copyright © 2020-2022 北京云桥链科技有限公司 All Rights Reserved</p>
  </footer>
</template>

<style scoped>
.active{
  color:rgba(var(--ui-primary));
}
</style>
