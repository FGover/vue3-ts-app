import type {
  ArticleListPagination,
  ArticleListParams,
  DoctorListPagination,
  FollowType,
  PageParams
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
