import { followOrUnfollow, getPrescriptionPic, cancelOrder, deleteOrder } from '@/services/consult'
import type { FollowType, ConsultOrderItem } from '@/types/consult'
import { OrderStatus } from '@/enum'
import { showToast, showImagePreview, showSuccessToast, showFailToast } from 'vant'
import { ref } from 'vue'

export const useFollow = (type: FollowType = 'doc') => {
  const loading = ref(false)
  const follow = async (item: { id: string; likeFlag: 0 | 1 }) => {
    loading.value = true
    try {
      await followOrUnfollow(item.id, type)
      item.likeFlag = item.likeFlag === 1 ? 0 : 1
      item.likeFlag === 1 ? showToast('关注成功') : showToast('取消关注')
    } finally {
      loading.value = false
    }
  }
  return { loading, follow }
}

export const useShowPrescription = () => {
  const onShowPre = async (id: string) => {
    if (id) {
      const { data: res } = await getPrescriptionPic(id)
      showImagePreview([res.url])
    }
  }
  return { onShowPre }
}

export const useCancelOrder = () => {
  // 取消订单
  const loading = ref(false)
  const cancelConsultOrder = async (item: ConsultOrderItem) => {
    try {
      loading.value = true
      await cancelOrder(item.id)
      item.status = OrderStatus.ConsultCancel
      item.statusValue = '已取消'
      showSuccessToast('取消问诊成功')
    } catch {
      showFailToast('取消问诊失败')
    } finally {
      loading.value = false
    }
  }
  return { cancelConsultOrder, loading }
}

export const useDeleteOrder = (cb: () => void) => {
  const loading = ref(false)
  const deleteConsultOrder = async (item: ConsultOrderItem) => {
    try {
      loading.value = true
      await deleteOrder(item.id)
      showSuccessToast('删除成功')
      cb & cb()
    } catch {
      showFailToast('删除失败')
    } finally {
      loading.value = false
    }
  }
  return { loading, deleteConsultOrder }
}
