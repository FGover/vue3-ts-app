import type { ConsultType } from '@/enum'
import type { ConsultIllness, PartialConsultRecord } from '@/types/consult'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConsultStore = defineStore(
  'cp-consult',
  () => {
    // 问诊信息
    const consultInfo = ref<PartialConsultRecord>({})
    // 记录问诊类型
    const setType = (type: ConsultType) => {
      consultInfo.value.type = type
    }
    // 记录问诊级别
    const setIllnessType = (type: 0 | 1) => {
      consultInfo.value.illnessType = type
    }
    // 记录科室
    const setDep = (depId: string) => {
      consultInfo.value.depId = depId
    }
    // 记录病情
    const setIllness = (illness: ConsultIllness) => {
      consultInfo.value.illnessDesc = illness.illnessDesc
      consultInfo.value.illnessTime = illness.illnessTime
      consultInfo.value.pictures = illness.pictures
      consultInfo.value.consultFlag = illness.consultFlag
    }

    return { consultInfo, setType, setIllnessType, setDep, setIllness }
  },
  { persist: true }
)
