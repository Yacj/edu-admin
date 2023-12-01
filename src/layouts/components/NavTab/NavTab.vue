<script setup>
import {
  CloseOutlined,
  MinusOutlined,
  ReloadOutlined,
  VerticalLeftOutlined,
  VerticalRightOutlined,
} from '@ant-design/icons-vue'
import ScrollX from '@/components/ScrollX/ScrollX.vue'
import useNavTabStore from '@/store/modules/navTab'

const navStore = useNavTabStore()
const scrollXRef = ref(null)
const tabRefs = ref([])
const route = useRoute()
const router = useRouter()
const currentPath = ref('')
function handleTagClick(path) {
  navStore.setActiveTag(path)
  router.push(path)
}
function handleContextMenu(tagItem) {
  currentPath.value = tagItem.path
}

function handleMenuClick(val) {
  const index = +val
  switch (index) {
    case 1:
      console.log('121')
      break
    case 2:
      navStore.removeTag(currentPath.value)
      break
    case 3:
      navStore.removeOther(currentPath.value)
      break
    case 4:
      navStore.removeLeft(currentPath.value)
      break
    case 5:
      navStore.removeRight(currentPath.value)
  }
}

watch(
  () => route.path,
  () => {
    const {
      name,
      fullPath: path,
    } = route
    const title = route.meta?.title
    navStore.addTag({
      name,
      path,
      title,
    })
  },
  { immediate: true },
)

watch(
  () => navStore.activeIndex,
  async (activeIndex) => {
    await nextTick()
    const activeTabElement = tabRefs.value[activeIndex]?.$el
    if (!activeTabElement) {
      return
    }
    const {
      offsetLeft: x,
      offsetWidth: width,
    } = activeTabElement
    scrollXRef.value?.handleScroll(x + width, width)
  },

  { immediate: true },
)
</script>

<template>
  <div
    class="h-[var(--g-toolbar-height)] mt-[var(--g-toolbar-height)]"
  />
  <div
    class="!fixed z-50 w-full top-[var(--g-toolbar-height)]"
    :style="{
      transition: 'background-color 0.3s ease 0s, min-width 0.3s ease 0s, max-width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) 0s',
    }"
  >
    <ScrollX
      ref="scrollXRef"
      class="tags h-13 dark:bg-[#18181c] dark:text-white dark:text-opacity-82 bg-white text-[#333639]"
    >
      <a-tabs
        :active-key="navStore.activeTag"
        class="w-full pt-5"
        :tab-bar-gutter="5"
        @update:active-key="handleTagClick"
      >
        <a-tab-pane
          v-for="tag in navStore.tags" :key="tag.path"
        >
          <template #tab>
            <a-dropdown :trigger="['contextmenu']">
              <div @contextmenu.prevent="handleContextMenu(tag)">
                {{ tag.title }}
                <button v-if="navStore.tags.length > 1" class="ant-tabs-tab-remove" style="margin: 0;" @click.stop="navStore.removeTag(tag.path)">
                  <CloseOutlined class="!ml-2" />
                </button>
                <button v-if="navStore.activeTag === tag.path" class="ant-tabs-tab-remove" style="margin: 0;" @click.stop="handleMenuClick('1')">
                  <ReloadOutlined class="!ml-2" />
                </button>
              </div>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="1" :disabled="currentPath !== navStore.activeTag" @click="handleMenuClick('1')">
                    <div class="flex-center">
                      <ReloadOutlined class="mr-2 text-base" />
                      重新加载
                    </div>
                  </a-menu-item>
                  <a-menu-item key="3" :disabled="navStore.tags.length <= 1" @click="handleMenuClick('3')">
                    <div class="flex-center">
                      <MinusOutlined class="mr-2 text-base" />
                      关闭其他
                    </div>
                  </a-menu-item>
                  <a-menu-item
                    key="4" :disabled=" navStore.tags.length <= 1 || currentPath === navStore.tags[0].path"
                    @click="handleMenuClick('4')"
                  >
                    <div class="flex-center">
                      <VerticalLeftOutlined class="mr-2 text-base" />
                      关闭左侧
                    </div>
                  </a-menu-item>
                  <a-menu-item
                    key="5"
                    :disabled="navStore.tags.length <= 1 || currentPath === navStore.tags[navStore.tags.length - 1].path"
                    @click="handleMenuClick('5')"
                  >
                    <div class="flex-center">
                      <VerticalRightOutlined class="mr-2 text-base" />
                      关闭右侧
                    </div>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
        </a-tab-pane>
      </a-tabs>
    </ScrollX>
  </div>
</template>

<style lang="scss" scoped>
:deep(.ant-tag) {
  font-size: 14px;
  line-height: 27px;
}
.tags{
  border-color: var(--border-color-base) !important;
}
</style>
