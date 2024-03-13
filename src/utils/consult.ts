import { IllnessTime } from '@/enum'

const timeOptions = [
  { label: '一周内', value: IllnessTime.Week, msg: '请填写患病时间信息' },
  { label: '一月内', value: IllnessTime.Month, msg: '请填写患病时间信息' },
  { label: '半年内', value: IllnessTime.HalfYear, msg: '请填写患病时间信息' },
  { label: '超过半年', value: IllnessTime.More, msg: '请填写患病时间信息' }
]
const flagOptions = [
  { label: '就诊过', value: 1, msg: '请填写是否就诊信息' },
  { label: '没就诊过', value: 0, msg: '请填写是否就诊信息' }
]

const getIllnessTimeText = (time: IllnessTime) => {
  return timeOptions.find((item) => item.value === time)?.label
}
const getFlagText = (flag: 0 | 1) => {
  return flagOptions.find((item) => item.value === flag)?.label
}

export { timeOptions, flagOptions, getIllnessTimeText, getFlagText }
