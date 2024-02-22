import type {
  ArticleListPagination,
  ArticleListParams,
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
