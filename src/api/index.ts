import type {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import axios from 'axios'
import { message } from 'ant-design-vue'
import useUserStore from '@/store/modules/user.ts'

// 自定义 Axios 请求配置，包含额外选项
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  hideLoading?: boolean
  requestBaseUrl?: string
}

// 自定义内部 Axios 请求配置，包含额外选项
interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  requestBaseUrl?: string
}

// 基础响应结构
interface BaseResponse<T = any> {
  code: number
  Data: T
  message: string
  Status: number
}

// 根据环境和代理设置确定基础 URL
const yqUrl = (import.meta.env.DEV && import.meta.env.VITE_OPEN_PROXY === 'true')
  ? '/yq'
  : import.meta.env.VITE_APP_API_BASEURL
const yhUrl = (import.meta.env.DEV && import.meta.env.VITE_OPEN_PROXY === 'true')
  ? '/yh'
  : import.meta.env.VITE_APP_API_YH_BASEURL
const wlUrl = (import.meta.env.DEV && import.meta.env.VITE_OPEN_PROXY === 'true')
  ? '/wl'
  : import.meta.env.VITE_APP_API_WL_BASEURL
const yjUrl = (import.meta.env.DEV && import.meta.env.VITE_OPEN_PROXY === 'true')
  ? '/yj'
  : import.meta.env.VITE_APP_API_YJ_BASEURL

// 创建 Axios 实例
const service = axios.create({
  baseURL: yqUrl,
  timeout: 1000 * 60,
  responseType: 'json',
})

// Axios 请求拦截器
service.interceptors.request.use(
  (config: CustomInternalAxiosRequestConfig) => {
    const userStore = useUserStore()
    const configBaseUrl = config.requestBaseUrl
    const token = userStore.token

    // 根据请求的基础 URL 设置不同的 baseURL
    switch (configBaseUrl) {
      case 'yh':
        config.baseURL = yhUrl
        break
      case 'wl':
        config.baseURL = wlUrl
        break
      case 'yj':
        config.baseURL = yjUrl
        break
      default:
        config.baseURL = yqUrl
    }

    // 如果存在用户令牌，将其添加到请求头
    if (token) {
      config.headers!.Authorization = `${token}`
    }

    return config
  },
  (error) => {
    const errorMessage = error.message || '请求错误'
    return Promise.reject(errorMessage)
  },
)

// Axios 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<BaseResponse>) => {
    const code = response.status

    // 如果状态码不是 200，则拒绝 Promise
    if (typeof code !== 'undefined' && code !== 200) {
      return Promise.reject(new Error('Error'))
    }

    // 如果返回的状态不是 200，则显示错误消息并拒绝 Promise
    if (response.data.Status !== 200) {
      message.error(response.data.Data || '请求错误')
      return Promise.reject(new Error('Http Error'))
    }

    // 否则，解析响应数据并返回 Promise
    return Promise.resolve(response)
  },
  (error) => {
    const errorMessage = error.message || '请求错误'
    return Promise.reject(errorMessage)
  },
)

// 请求封装对象
const request = {
  /**
   * 发送 GET 请求
   *
   * @param {string} url - 请求的 URL
   * @param {object} data - 请求参数
   * @param {string} requestBaseUrl - 请求的基础 URL
   * @returns {Promise<T>} - Promise 对象，包含请求结果
   */
  get<T = any>(url: string, data?: any, requestBaseUrl?: string): Promise<T> {
    return request.request('GET', url, { params: data }, requestBaseUrl)
  },

  /**
   * 发送 POST 请求
   *
   * @param {string} url - 请求的 URL
   * @param {object} data - 请求参数
   * @param {string} requestBaseUrl - 请求的基础 URL
   * @returns {Promise<T>} - Promise 对象，包含请求结果
   */
  post<T = any>(url: string, data?: any, requestBaseUrl?: string): Promise<T> {
    return request.request('POST', url, { data }, requestBaseUrl)
  },

  /**
   * 发送上传文件的请求
   *
   * @param {string} url - 请求的 URL
   * @param {object} data - 请求参数
   * @param {string} requestBaseUrl - 请求的基础 URL
   * @returns {Promise<T>} - Promise 对象，包含请求结果
   */
  upload<T = any>(url: string, data?: any, requestBaseUrl?: string): Promise<T> {
    const headers = { 'Content-Type': 'multipart/form-data' }
    return request.request<T>('POST', url, { data, headers, requestBaseUrl })
  },

  /**
   * 发送通用请求
   *
   * @param {string} method - 请求方法（GET、POST 等）
   * @param {string} url - 请求的 URL
   * @param {object} data - 请求参数
   * @param {string} requestBaseUrl - 请求的基础 URL
   * @returns {Promise<T>} - Promise 对象，包含请求结果
   */
  request<T = any>(
        method = 'GET',
        url: string,
        data?: any,
        requestBaseUrl?: string,
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      service({ method, url, ...data, requestBaseUrl })
        .then((res) => {
          resolve(res.data as T)
        })
        .catch((e: Error | AxiosError) => {
          reject(e)
        })
    })
  },
}

export default request
