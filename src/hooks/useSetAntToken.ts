import { theme } from 'ant-design-vue'
import type { GlobalToken } from 'ant-design-vue/es/theme'
import {createSharedComposable} from "@vueuse/core";

function canUseDom() {
  return !!(typeof window !== 'undefined' && window.document && window.document.createElement)
}
const useSetAntdToken = createSharedComposable(() => {
  const { token: antdToken } = theme.useToken()
  const token = ref<GlobalToken>(antdToken.value)
  let styleDom: HTMLStyleElement | null = null
  const prefixCls = '--ant-'
  const registerTokenToCSSVar = (globalToken: GlobalToken) => {
    const variables: Record<string, any> = {}
    if (!globalToken) {
      return
    }
    for (const key in globalToken) {
      const val = globalToken[key as keyof GlobalToken]
      if (val) {
        const variableKey = key.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')
        variables[`${prefixCls}${variableKey}`] = val
      }
    }
    const cssList = Object.keys(variables).map(key => `${key}: ${variables[key]};`)
    if (canUseDom()) {
      styleDom = styleDom || document.createElement('style')
      styleDom.innerHTML = `:root {${cssList.join('\n')}}`
      if (styleDom && !document.body.contains(styleDom)) {
        document.body.appendChild(styleDom)
      }
      token.value = globalToken
    }
  }
  return {
    token,
    registerTokenToCSSVar,
  }
})

export default useSetAntdToken
