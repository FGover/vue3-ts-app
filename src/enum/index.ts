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

// 消息类型
export enum MessageType {
  // 文字聊天
  MsgText = 1,
  // 消息聊天
  MsgImage = 4,
  // 患者信息
  CardPat = 21,
  // 处方信息
  CardPre = 22,
  // 未评价信息
  CardEvaForm = 23,
  // 已评价信息
  CardEva = 24,
  // 通用通知
  Notify = 31,
  // 温馨提示
  NotiyfTip = 32,
  // 取消提示
  NotifyCancel = 33
}

// 处方状态
export enum PrescriptionStatus {
  // 未付款
  NotPayment = 1,
  // 已付款
  Payment,
  // 已失效
  Invalid
}

// 订单状态
export enum OrderStatus {
  // 1. 问诊订单
  // 未支付
  ConsultPay = 1,
  // 待接诊
  ConsultWait = 2,
  // 问诊中
  ConsultChat = 3,
  // 问诊完成
  ConsultComplete = 4,
  // 取消问诊
  ConsultCancel = 5,
  // 2. 药品订单
  // 待支付
  MedicinePay = 10,
  // 待发货
  MedicineSend = 11,
  // 待收货
  MedicineTake = 12,
  // 已完成
  MedicineComplete = 13,
  // 已取消
  MedicineCancel = 14
}

// 物流状态
export enum ExpressStatus {
  // 已发货
  Delivered = 1,
  // 已揽件
  Received = 2,
  // 运输中
  Transit = 3,
  // 派送中
  Delivery = 4,
  // 已签收
  Signed = 5
}
