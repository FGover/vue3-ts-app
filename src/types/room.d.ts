import { MessageType, PrescriptionStatus } from '@/enum/index'
import { Image, Consult } from '@/types/consult'
import type { Patient } from './user'

// 药品类型
export type Medical = {
  id: string
  name: string
  amount: string
  avatar: string
  specs: string
  // 用量
  usageDosag: string
  // 数量
  quantity: string
  // 1是处方
  prescriptionFlag: 0 | 1
}

// 处方类型
export type Prescription = {
  id: string
  orderId: string
  createTime: string
  // 患者名称
  name: string
  recordId: string
  // 0女 1男
  gender: 0 | 1
  age: number
  // 诊断信息
  diagnosis: string
  // 处方状态
  status: PrescriptionStatus
  // 药品清单
  medicines: Medical[]
}

// 评价类型
export type EvaluateDoc = {
  id?: string
  score?: number
  content?: string
  createTime?: string
  creator?: string
}

// 消息类型
export type Message = {
  id: string
  msgType: MessageType
  from?: string
  fromAvatar?: string
  to?: string
  toAvatar?: string
  createTime: string
  msg: {
    content?: string
    picture?: Image
    // 问诊记录，患者信息
    consultRecord?: Consult & {
      patientInfo: Patient
    }
    // 处方信息
    prescription?: Prescription
    // 评价信息
    evaluateDoc?: EvaluateDoc
  }
}

// 消息分组类型
export type MessageGroup = {
  // 分组消息最早时间
  createTime: string
  items: Message[]
  orderId: string
  // 会话id
  sid: string
}
