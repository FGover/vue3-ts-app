<script lang="ts" setup>
import type { ConsultType } from '@/enum'
import ConsultItem from './ConsultItem.vue'
import type { ConsultOrderItem, ConsultOrderListParams } from '@/types/consult'
import { getConsultOrderData } from '@/services/consult'
import { ref } from 'vue'
const props = defineProps<{
  type: ConsultType
}>()
const params = ref<ConsultOrderListParams>({
  type: props.type,
  current: 1,
  pageSize: 5
})

const loading = ref(false)
const finished = ref(false)
const list = ref<ConsultOrderItem[]>([])
const onLoad = async () => {
  const { data: res } = await getConsultOrderData(params.value)
  list.value.push(...res.rows)
  if (params.value.current < res.pageTotal) {
    params.value.current++
  } else {
    finished.value = true
  }
  loading.value = false
}

// 删除订单
const onDelete = (id: string) => {
  list.value = list.value.filter((item) => item.id !== id)
  // 如果删除订单 没数据了
  if (!list.value.length) {
    onLoad()
  }
}
</script>

<template>
  <div class="consult-List">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <consult-item
        @on-delete="onDelete"
        v-for="item in list"
        :key="item.id"
        :item="item"
      ></consult-item>
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.consult-list {
  padding: 10px 15px;
}
</style>
