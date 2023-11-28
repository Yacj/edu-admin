<script setup lang="ts">
import { LockOutlined, MobileOutlined, QrcodeOutlined, SafetyOutlined, UserOutlined } from '@ant-design/icons-vue'
import LoginCode from '@/views/login/components/LoginCode.vue'
import Captcha from '@/components/Captcha/Captcha.vue'
import userService from '@/api/modules/user.ts'
import storageUtil from '@/utils/storage.ts'
import useUserStore from '@/store/modules/user.ts'
import cryptoData from '@/utils/crypto.ts'

const loginType = ref('form')
const userStore = useUserStore()
const loginForm = reactive({
  UserName: storageUtil.getItem('account') || '',
  Pwd: '',
  remember: !!storageUtil.getItem('account'),
  Code: '',
  Sign: '',
})
const captchaCode = ref('')
const rules = {
  UserName: [
    {
      required: true,
      message: '请输入用户名',
    },
  ],
  Pwd: [
    {
      required: true,
      message: '请输入密码',
    },
  ],
  Code: [
    {
      required: true,
      message: '请输入验证码',
    },
  ],
}
onMounted(() => {
  getCaptchaCode()
})
function getCaptchaCode() {
  userService.setcode_verificat().then((res) => {
    const {
      Code,
      Sign,
    } = res.Data
    captchaCode.value = Code
    loginForm.Sign = Sign
  })
}
function handleChangeLoginType() {
  loginType.value = loginType.value === 'form' ? 'code' : 'form'
  getCaptchaCode()
}
function handleSubmitLogin(values: any) {
  const formData = {
    ...values,
    Sign: loginForm.Sign,
  }
  formData.Pwd = cryptoData.encrypt(formData.Pwd)
  userStore.login(formData).then((res) => {
    window.console.log(res)
  }).catch((err) => {
    window.console.error('login error', err)
    getCaptchaCode()
  })
}
</script>

<template>
  <div
    class="relative overflow-hidden rounded-lg bg-cover bg-no-repeat p-12 login-bg"
  >
    <div class="h-full flex justify-end items-center">
      <a-card class="min-h-[350px] w-[420px] mr-10">
        <a-tooltip placement="left" color="blue">
          <template #title>
            {{ loginType === 'form' ? '扫码登录' : '其他方式登录' }}
          </template>
          <div class="absolute top-0 right-0">
            <div class="overflow-hidden rounded-tr-[9px]">
              <div class="code-tips" @click="handleChangeLoginType">
                <QrcodeOutlined v-if="loginType === 'form'" class="text-5xl code-tips-icon" />
                <MobileOutlined v-else class="text-5xl code-tips-icon" />
              </div>
            </div>
          </div>
        </a-tooltip>
        <template v-if="loginType === 'form'">
          <div>
            <h3 class="text-xl font-bold">
              密码登陆
            </h3>
          </div>
          <a-form
            :model="loginForm" class="mt-10"
            :rules="rules"
            @finish="handleSubmitLogin"
          >
            <a-form-item name="UserName">
              <a-input
                v-model:value="loginForm.UserName"
                placeholder="请输入用户名"
                size="large"
              >
                <template #prefix>
                  <UserOutlined />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item name="Pwd">
              <a-input-password
                v-model:value="loginForm.Pwd"
                placeholder="请输入密码"
                size="large"
              >
                <template #prefix>
                  <LockOutlined />
                </template>
              </a-input-password>
            </a-form-item>
            <a-form-item name="Code">
              <div class="flex">
                <a-input
                  v-model:value="loginForm.Code"
                  placeholder="请输入验证码"
                  size="large"
                  class="flex-1 mr-2"
                >
                  <template #prefix>
                    <SafetyOutlined />
                  </template>
                </a-input>
                <Captcha :code="captchaCode" />
              </div>
            </a-form-item>
            <a-form-item class="justify-between">
              <a-checkbox v-model:checked="loginForm.remember">
                记住账户
              </a-checkbox>
            </a-form-item>
            <a-form-item>
              <a-button
                type="primary"
                block
                size="large"
                html-type="submit"
              >
                登录
              </a-button>
            </a-form-item>
          </a-form>
        </template>
        <LoginCode v-if="loginType === 'code'" />
      </a-card>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-bg{
  background: url(../../assets/images/login-bg.png) repeat;
  height: calc(100vh - 120px);
}
.login-box-wrap{
  min-height: 537px;
  padding-left: 80px;
}
.code-tips{
  width: 64px;
  height: 64px;
  transform: skewY(45deg);
  transform-origin: top right;
  cursor: pointer;
  border-top-right-radius: 10px;
  overflow: hidden;
  background: rgba(120,86,255,.1);
  .code-tips-icon{
    position: relative;
    transform: skewY(315deg);
    color: rgba(var(--ui-primary));
    left: 6px;
    top: 40px;
  }
}
</style>
