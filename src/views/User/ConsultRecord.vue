<script lang="ts" setup>
import { ConsultType } from '@/enum'
import ConsultList from './components/ConsultList.vue'
</script>

<template>
  <cp-nav-bar title="问诊记录"></cp-nav-bar>
  <div class="consult-record">
    <van-tabs sticky>
      <van-tab title="极速问诊"><consult-list :type="ConsultType.Fast" /></van-tab>
      <van-tab title="找医生"><consult-list :type="ConsultType.Doctor" /></van-tab>
      <van-tab title="开药问诊"><consult-list :type="ConsultType.Medication" /></van-tab>
    </van-tabs>
  </div>
</template>

<style lang="scss" scoped>
.consult-record {
  padding-top: 46px;
  background-color: var(--cp-bg);
  min-height: calc(100vh - 46px);
}
</style>
