import axios, { type Method } from 'axios'
import { useUserStore } from '@/stores'
import { showToast } from 'vant'
import router from '@/router'

const httpInstance = axios.create({
  baseURL: 'https://consult-api.itheima.net/',
  timeout: 10000
})

httpInstance.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.user?.token) {
      config.headers.Authorization = `Bearer ${userStore.user.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

httpInstance.interceptors.response.use(
  (response) => {
    if (response.data.code !== 10000) {
      // 错误提示
      showToast(response.data.message)
      // 返回错误的promise
      return Promise.reject(response.data)
    }
    return response.data
  },
  (error) => {
    // 处理401错误
    if (error.response.status === 401) {
      // 清除本地用户信息
      const userStore = useUserStore()
      userStore.delUser()
      // 跳转到登陆页面
      router.push({ path: '/login', query: { returnUrl: router.currentRoute.value.fullPath } })
    }
    return Promise.reject(error)
  }
)

export default httpInstance

// 定义数据类型
type Data<T> = {
  code: number
  message: string
  data: T
}

// 封装请求方法
export const request = <T>(url: string, method: Method = 'GET', submitData?: object) => {
  // 把自定义响应数据类型放第二个参数，第一个没意义
  return httpInstance.request<any, Data<T>>({
    url,
    method,
    [method.toUpperCase() === 'GET' ? 'params' : 'data']: submitData
  })
}
