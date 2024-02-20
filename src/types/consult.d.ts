import { ConsultType, IllnessTime } from '@/enum'

// 文章信息类型
export type ArticleInfo = {
  id: string
  title: string
  // 封面
  coverUrl: string[]
  // 标签
  topic: string
  // 收藏数
  collectionNumber: number
  // 评论数
  commentNumber: number
  // 医生头像
  creatorAvatar: string
  // 医生名称
  creatorName: string
  // 医生医院
  creatorHospatalName: string
  // 关注文章
  likeFlag: 0 | 1
  // 内容
  content: string
  // 医生科室
  creatorDep: string
  // 医生职称
  creatorTitles: string
  // 医生Id
  creatorId: string
}

// 文章列表
export type ArticleList = ArticleInfo[]

// 文章列表带分页
export type ArticleListPagination = {
  pageTotal: number
  total: number
  rows: ArticleList
}

// props类型 推荐 | 减脂 | 健康饮食 | like关注医生文章
export type ArticleType = 'recommend' | 'fatReduction' | 'food' | 'like'

export type PageParams = {
  current: number
  pageSize: number
}

// 文章列表查询参数
export type ArticleListParams = PageParams & {
  type: ArticleType
}

// 医生类型
export type Doctor = {
  id: string
  name: string
  avatar: string
  consultationNum: number
  depName: string
  // 医院等级
  gradeName: string
  hosiptalName: string
  // 未登录默认返回0 登录是 0未关注 1已关注
  likeFlag: 0 | 1
  major: string
  // 职称
  positionalTitles: string
  score: number
  // 接诊费用
  serviceFee: number
}

// 医生列表
export type DoctorList = Doctor[]

// 医生分页数据
export type DoctorListPagination = {
  pageTotal: number
  total: number
  rows: DoctorList
}

// 关注类型：百科话题 | 百科文章 | 医生 | 疾病
export type FollowType = 'topic' | 'knowledge' | 'doc' | 'disease'

// 图片类型
export type Image = {
  id: string
  url: string
}

// 问诊记录
export type ConsultRecord = {
  id: string
  // 问诊类型
  type: ConsultType
  // 快速问诊类型： 0普通 1三甲
  illnessType: 0 | 1
  depId: string
  illnessDesc: string
  illnessTime: IllnessTime
  // 是否就诊过：0未就诊过 1就诊过
  consultFlag: 0 | 1
  // 图片数组
  pictures: Image[]
  // 患者Id
  patientId: string
  // 优惠券Id
  couponId: string
}

// Partial<T> 把对象的所有属性转成可选
export type PartialConsultRecord = Partial<ConsultRecord>
// Required<T> 把对象的所有属性转成必选
// type RequiredConsultRecord = Required<ConsultRecord>

// 二级科室
export type SubDep = {
  id: string
  name: string
}

// 一级科室
export type MainDep = SubDep & {
  child: SubDep[]
}
export type MainDepList = MainDep[]
