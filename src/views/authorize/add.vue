<script setup lang="ts">
const stepLit = [
  {
    title: '选择机构',
  },
  {
    title: '授权时间',
  },
  {
    title: '授权资源',
  },
]
</script>

<template>
  <div class="container mx-auto flex-center wh-full mt-10">
    <a-card class="w-full">
      <a-steps
        :items="stepLit"
      />
    </a-card>
  </div>
</template>

<style scoped></style>
