// 枚举：一组可选的常量(number值是默认从0开始，也可以是string)

// 问诊类型
export enum ConsultType {
  // 找医生
  Doctor = 1,
  // 快速问诊
  Fast = 2,
  // 开药问诊
  Medication = 3
}

// 患病时间，可以从1自增
export enum IllnessTime {
  // 一周内
  Week = 1,
  // 一个月
  Month,
  // 半年
  HalfYear,
  // 半年以上
  More
}
