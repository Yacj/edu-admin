import request from '@/api'
export interface LoginForm {
  UserName: string
  Pwd: string
  Code: string
  Sign: string
}
const userService = {
  login: (params: LoginForm) => {
    return request.post('/User/login', params, 'yh')
  },
  setcode_verificat: (params?: any) => {
    return request.get('/User/setcode_verificat', params, 'yh')
  },
}

export default userService
