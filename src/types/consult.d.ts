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
