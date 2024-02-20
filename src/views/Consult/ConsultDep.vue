<script lang="ts" setup>
import { getAllDep } from '@/services/consult'
import { useConsultStore } from '@/stores'
import type { MainDepList } from '@/types/consult'
import { ref, onMounted, computed } from 'vue'
const active = ref(0)
const consultStore = useConsultStore()

const allDep = ref<MainDepList>([])
onMounted(async () => {
  const { data: res } = await getAllDep()
  allDep.value = res
})
// 二级科室
const subDep = computed(() => {
  return allDep.value[active.value]?.child || []
})
</script>

<template>
  <div class="consult-dep-page">
    <cp-nav-bar title="选择科室" />
    <div class="wrapper">
      <van-sidebar v-model="active">
        <van-sidebar-item :title="item.name" v-for="item in allDep" :key="item.id" />
      </van-sidebar>
      <div class="sub-dep">
        <router-link
          to="/consult/illness"
          v-for="item in subDep"
          :key="item.id"
          @click="consultStore.setDep(item.id)"
        >
          {{ item.name }}</router-link
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  height: calc(100vh - 46px);
  overflow: hidden;
  display: flex;
  .van-sidebar {
    width: 114px;
    &-item {
      padding: 14px;
      color: var(--cp-tag);
      &--select {
        color: var(--cp-main);
        font-weight: normal;
        &::before {
          width: 2px;
          height: 52px;
        }
      }
    }
  }
  .sub-dep {
    flex: 1;
    height: 100%;
    overflow-y: auto;
    a {
      display: block;
      padding: 14px 30px;
      color: var(--cp-dark);
      border-bottom: 1px solid var(--cp-bg);
    }
  }
}
</style>
