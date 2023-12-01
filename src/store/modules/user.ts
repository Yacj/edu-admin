import useRouteStore from './route'
import useMenuStore from './menu'
import router from '@/router'
import type {LoginForm} from '@/api/modules/user'
import userService from '@/api/modules/user'
import {deepClone} from '@/utils'
import storageUtil from '@/utils/storage.ts'

const useUserStore = defineStore(
  // 唯一ID
  'user',
  () => {
    const routeStore = useRouteStore()
    const menuStore = useMenuStore()

    const account = ref(storageUtil.getItem('account') ?? '')
    const token = ref(storageUtil.getItem('token') ?? '')
    const failure_time = ref(storageUtil.getItem('failure_time') ?? '')
    const userInfo = ref(storageUtil.getItem('userInfo') ?? '')
    const permissions = ref<string[]>([])

    const isLogin = computed(() => {
      let retn = false
      if (token.value) {
        if (new Date().getTime() < Number.parseInt(failure_time.value) * 1000) {
          retn = true
        }
      }
      return retn
    })

    // 登录
    function login(data: LoginForm) {
      return new Promise((resolve, reject) => {
        userService.login(data)
          .then((res) => {
            const UserInfo = deepClone(res.Data)

            const failed = Math.ceil(new Date().getTime() / 1000) + 24 * 60 * 60

            token.value = UserInfo.UserToken
            storageUtil.setItem('token', UserInfo.UserToken)
            delete UserInfo.UserToken

            account.value = data.UserName
            storageUtil.setItem('account', data.UserName)

            userInfo.value = UserInfo
            storageUtil.setItem('userInfo', UserInfo)

            failure_time.value = failed
            storageUtil.setItem('failure_time', failed)

            resolve(true);
          })
          .catch((error) => {
            reject(error);
          });
      });
    }

    // 登出
    async function logout(redirect = router.currentRoute.value.fullPath) {
      localStorage.removeItem('account')
      localStorage.removeItem('token')
      localStorage.removeItem('failure_time')
      localStorage.removeItem('avatar')
      account.value = ''
      token.value = ''
      failure_time.value = ''
      permissions.value = []
      routeStore.removeRoutes()
      menuStore.setActived(0)
      router.push({
        name: 'login',
        query: {
          ...(router.currentRoute.value.path !== '/' && router.currentRoute.value.name !== 'login' && {redirect}),
        },
      })
    }

    // 获取权限
    async function getPermissions() {
      const permissions = [
        'permission.browse',
        'permission.create',
        'permission.edit',
        'permission.remove',
      ]
      return permissions
    }

    // 修改密码
    async function editPassword(data: {
      password: string
      newpassword: string
    }) {
      return ''
    }

    return {
      account,
      token,
      permissions,
      isLogin,
      login,
      logout,
      getPermissions,
      editPassword,
      userInfo
    }
  },
)

export default useUserStore
