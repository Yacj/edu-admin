<script setup lang="ts">
import { useFullscreen } from '@vueuse/core'
import { LoginOutlined, UserOutlined } from '@ant-design/icons-vue'
import { Modal } from 'ant-design-vue'
import eventBus from '@/utils/eventBus'
import useSettingsStore from '@/store/modules/settings'
import useUserStore from '@/store/modules/user'

defineOptions({
  name: 'Tools',
})

const router = useRouter()

const settingsStore = useSettingsStore()
const userStore = useUserStore()

const mainPage = useMainPage()
const { isFullscreen, toggle } = useFullscreen()

function toggleColorScheme(event: MouseEvent) {
  const { startViewTransition } = useViewTransition(() => {
    settingsStore.setColorScheme(settingsStore.settings.app.colorScheme === 'dark' ? 'light' : 'dark')
  })
  startViewTransition()?.ready.then(() => {
    const x = event.clientX
    const y = event.clientY
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    )
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ]
    document.documentElement.animate(
      {
        clipPath: settingsStore.settings.app.colorScheme !== 'dark' ? clipPath : clipPath.reverse(),
      },
      {
        duration: 300,
        easing: 'ease-out',
        pseudoElement: settingsStore.settings.app.colorScheme !== 'dark' ? '::view-transition-new(root)' : '::view-transition-old(root)',
      },
    )
  })
}

const avatarError = ref(false)
watch(() => userStore.userInfo.HeadImg, () => {
  if (avatarError.value) {
    avatarError.value = false
  }
})

function handleLogout() {
  Modal.confirm({
    title: '提示',
    content: '确定要退出登录吗？',
    onOk: () => {
      userStore.logout()
    },
  })
}
</script>

<template>
  <div class="tools flex items-center gap-4 px-4 whitespace-nowrap">
    <span v-if="settingsStore.settings.navSearch.enable && settingsStore.mode === 'pc'" class="group inline-flex items-center gap-1 px-2 py-1.5 rounded-2 text-dark dark:text-white bg-stone-1 dark:bg-stone-9 ring-inset ring-stone-3 dark:ring-stone-7 hover:ring-1 cursor-pointer transition" @click="eventBus.emit('global-search-toggle')">
      <SvgIcon name="ri:search-line" />
      <span class="text-sm text-stone-5 group-hover:text-dark dark:group-hover:text-white transition">搜索</span>
      <HKbd v-if="settingsStore.settings.navSearch.enableHotkeys" class="ml-2">{{ settingsStore.os === 'mac' ? '⌥' : 'Alt' }} S</HKbd>
    </span>
    <div class="flex items-center empty:hidden">
      <span v-if="settingsStore.settings.navSearch.enable && settingsStore.mode === 'mobile'" class="item" @click="eventBus.emit('global-search-toggle')">
        <SvgIcon name="ri:search-line" />
      </span>
      <span v-if="settingsStore.mode === 'pc' && settingsStore.settings.toolbar.enableFullscreen" class="item" @click="toggle">
        <SvgIcon :name="isFullscreen ? 'ri:fullscreen-exit-line' : 'ri:fullscreen-line'" />
      </span>
      <span v-if="settingsStore.settings.toolbar.enablePageReload" class="item" @click="mainPage.reload()">
        <SvgIcon name="iconoir:refresh-double" />
      </span>
      <span v-if="settingsStore.settings.toolbar.enableColorScheme" class="item" @click="toggleColorScheme">
        <SvgIcon :name="settingsStore.settings.app.colorScheme === 'light' ? 'ri:sun-line' : 'ri:moon-line'" />
      </span>
    </div>
    <a-dropdown placement="bottom">
      <template #overlay>
        <a-menu>
          <a-menu-item class="flex-center">
            <UserOutlined class="mr-1" />
            个人信息
          </a-menu-item>
          <a-menu-item class="flex-center" @click="handleLogout">
            <LoginOutlined class="mr-1" />
            退出登录
          </a-menu-item>
        </a-menu>
      </template>
      <div flex-center gap-1 cursor-pointer>
        <img v-if="userStore.userInfo.HeadImg && !avatarError" alt="avatar" :src="userStore.userInfo.HeadImg" :onerror="() => (avatarError = true)" class="w-[24px] h-[24px] rounded-full">
        <SvgIcon v-else name="carbon:user-avatar-filled-alt" :size="24" class="text-gray-400" />
        {{ userStore.userInfo.UserName }}
        <SvgIcon name="ep:caret-bottom" />
      </div>
    </a-dropdown>
  </div>
</template>

<style lang="scss" scoped>
.item {
  --at-apply: flex px-2 py-1 cursor-pointer;
}
</style>
