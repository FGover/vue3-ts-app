import type { AddressItem, Logistics, OrderDetail, OrderPre } from '@/types/order'
import { request } from '@/utils/request'

export const getMedicalOrderPre = (params: { prescriptionId: string }) =>
  request<OrderPre>('patient/medicine/order/pre', 'GET', params)

export const getAddressList = () => request<AddressItem[]>('patient/order/address')

// 创建订单
export const createMedicalOrder = (data: { id: string; addressId: string; couponId?: string }) =>
  request<{ id: string }>('patient/medicine/order', 'POST', data)

// 订单详情
export const getMedicalOrderDetail = (id: string) =>
  request<OrderDetail>(`patient/medicine/order/detail/${id}`)

// 获取物流信息
export const getLogisticsAPI = (id: string) => request<Logistics>(`patient/order/${id}/logistics`)
