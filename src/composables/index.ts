import { followOrUnfollow } from '@/services/consult'
import type { FollowType } from '@/types/consult'
import { showToast } from 'vant'
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
