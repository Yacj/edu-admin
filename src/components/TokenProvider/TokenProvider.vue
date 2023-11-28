<script setup lang="ts">
import { theme } from 'ant-design-vue'
import useSetAntdToken from "@/hooks/useSetAntToken";
const { token } = theme.useToken()
const { registerTokenToCSSVar } = useSetAntdToken()
watchEffect(() => {
  registerTokenToCSSVar(token.value)
})
</script>

<template>
  <slot />
</template>
