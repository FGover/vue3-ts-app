<script setup lang="ts">
import type { ArticleList, ArticleListParams, ArticleType } from '@/types/consult'
import ArticleCard from './ArticleCard.vue'
import { ref } from 'vue'
import { getArticleList } from '@/services/consult'

const props = defineProps<{
  type: ArticleType
}>()

const loading = ref(false)
const finished = ref(false)
// 数据列表
const list = ref<ArticleList>([])
// 查询参数
const params = ref<ArticleListParams>({
  type: props.type,
  current: 1,
  pageSize: 5
})

const onLoad = async () => {
  const { data: res } = await getArticleList(params.value)
  list.value.push(...res.rows)
  // 判断是否加载完毕
  if (params.value.current >= res.pageTotal) {
    finished.value = true
  } else {
    params.value.current++
  }
  loading.value = false
}
</script>

<template>
  <div class="article-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <article-card v-for="item in list" :key="item.id" :item="item"></article-card>
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.article-list {
  padding: 0 15px;
}
</style>
