import { defineStore } from 'pinia'
import router from '@/router'
import storageUtil from '@/utils/storage.ts'

const WITHOUT_TAG_PATHS = ['/404', '/login']
interface addTag {
  title: any
  name: string | symbol | null | undefined
  path: string
}
const useNavTabStore = defineStore({
  id: 'navTab',
  state: () => ({
    tags: storageUtil.getItem('tags') || [],
    activeTag: storageUtil.getItem('activeTag') || '',
  }),
  getters: {
    activeIndex() {
      const tags: any = this.tags
      return tags.findIndex((item: any) => item.path === this.activeTag)
    },
  },
  actions: {
    setActiveTag(path: string) {
      this.activeTag = path
      storageUtil.setItem('activeTag', path)
    },
    setTags(tags: any) {
      this.tags = tags
      storageUtil.setItem('tags', tags)
    },
    addTag(tag: addTag) {
      this.setActiveTag(tag.path)
      if (WITHOUT_TAG_PATHS.includes(tag.path) || this.tags.some((item: any) => item.path === tag.path)) { return }
      this.setTags([...this.tags, tag])
    },
    removeTag(path: string) {
      if (path === this.activeTag) {
        if (this.activeIndex > 0) {
          router.push(this.tags[this.activeIndex - 1].path)
        }
        else {
          router.push(this.tags[this.activeIndex + 1].path)
        }
      }
      this.setTags(this.tags.filter((tag: addTag) => tag.path !== path))
    },
    removeOther(curPath: string) {
      const path = curPath || this.activeTag
      this.setTags(this.tags.filter((tag: addTag) => tag.path === path))
      if (path !== this.activeTag) {
        router.push(this.tags[this.tags.length - 1].path)
      }
    },
    removeLeft(curPath: string) {
      const curIndex = this.tags.findIndex((item: any) => item.path === curPath)
      const filterTags = this.tags.filter((item: any, index: number) => index >= curIndex)
      this.setTags(filterTags)
      if (!filterTags.find((item: any) => item.path === this.activeTag)) {
        router.push(filterTags[filterTags.length - 1].path)
      }
    },
    removeRight(curPath: string) {
      const curIndex = this.tags.findIndex((item: any) => item.path === curPath)
      const filterTags = this.tags.filter((item: any, index: number) => index <= curIndex)
      this.setTags(filterTags)
      if (!filterTags.find((item: any) => item.path === this.activeTag)) {
        router.push(filterTags[filterTags.length - 1].path)
      }
    },
    resetTags() {
      this.setTags([])
      this.setActiveTag('')
    },
  },
})
export default useNavTabStore
