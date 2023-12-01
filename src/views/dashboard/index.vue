<script setup lang="ts">
import manageService from '@/api/modules/manage.ts'

const panelTotalList = ref([])
const totalLoading = ref(false)
onMounted(() => {
  getDashBoardData()
})

function getDashBoardData() {
  totalLoading.value = true
  manageService.total().then((res): void => {
    window.console.log(res)
    panelTotalList.value = res.Data
    totalLoading.value = false
  })
}
</script>

<template>
  <div class="p-3 space-y-3">
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-5">
      <a-card v-for="item in panelTotalList" :key="item.Value" :loading="totalLoading" :body-style="{ padding: '20px 24px 8px' }">
        <div class="color-[var(--ant-color-text-secondary)] text-sm">
          {{ item.Name }}
        </div>
        <div class="total mt-1">
          <a-statistic :value="item.Value" />
        </div>
      </a-card>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
      <a-card title="机构用户占比" :head-style="{ border: 'none' }">
        1
      </a-card>
      <a-card title="学科实训占比" :head-style="{ border: 'none' }">
        1
      </a-card>
      <a-card title="成果作品" :head-style="{ border: 'none' }">
        1
      </a-card>
      <a-card title="实习报告" :head-style="{ border: 'none' }">
        1
      </a-card>
    </div>
  </div>
</template>

<style scoped>

</style>
