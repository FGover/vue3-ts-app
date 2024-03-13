import type {
  ArticleListPagination,
  ArticleListParams,
  ConsultOrderItem,
  ConsultOrderListParams,
  ConsultOrderListRes,
  ConsultOrderPrePayInfo,
  ConsultOrderPrePayParams,
  DoctorListPagination,
  FollowType,
  Image,
  MainDepList,
  PageParams,
  PartialConsultRecord
} from '@/types/consult'
import { request } from '@/utils/request'

// 获取文章列表
export const getArticleList = (params: ArticleListParams) =>
  request<ArticleListPagination>('patient/home/knowledge', 'GET', params)

// 获取医生列表
export const getDoctorList = (params: PageParams) =>
  request<DoctorListPagination>('home/page/doc', 'GET', params)

// 关注或取消关注
export const followOrUnfollow = (id: string, type: FollowType) =>
  request('like', 'POST', { id, type })

// 获取科室信息
export const getAllDep = () => request<MainDepList>('dep/all')

// 上传图片
export const uploadImage = (file: File) => {
  const fd = new FormData()
  fd.append('image', file)
  return request<Image>('upload', 'POST', fd)
}

// 预支付信息
export const getConsultOrderPrePayInfo = (params: Partial<ConsultOrderPrePayParams>) =>
  request<ConsultOrderPrePayInfo>('patient/consult/order/pre', 'GET', params)

// 生成订单
export const createConsultOrder = (data: PartialConsultRecord) =>
  request<{ id: string }>('patient/consult/order', 'POST', data)

// 获取支付订单跳转地址
export const getConsultPayOrderUrl = (params: {
  paymentMethod: 0 | 1
  orderId: string
  payCallback: string
}) => request<{ payUrl: string }>('patient/consult/pay', 'POST', params)

// 获取问诊订单详情
export const getConsultOrderDetail = (orderId: string) =>
  request<ConsultOrderItem>('patient/consult/order/detail', 'GET', { orderId })

// 获取处方信息
export const getPrescriptionPic = (id: string) =>
  request<{ url: string }>(`patient/consult/prescription/${id}`)

// 评价
export const evaluateConsultOrder = (data: {
  docId: string
  orderId: string
  score: number
  content: string
  anonymousFlag: 0 | 1
}) => request<{ id: string }>('patient/order/evaluate', 'POST', data)

// 获取问诊订单数据
export const getConsultOrderData = (params: ConsultOrderListParams) =>
  request<ConsultOrderListRes>('patient/consult/order/list', 'GET', params)

// 取消订单
export const cancelOrder = (id: string) => request(`patient/order/cancel/${id}`, 'PUT')

// 删除订单
export const deleteOrder = (id: string) => request(`patient/order/${id}`, 'DELETE')
