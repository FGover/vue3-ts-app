<script lang="ts" setup>
import EvaluateCard from './EvaluateCard.vue'
import { IllnessTime, MessageType } from '@/enum'
import { useUserStore } from '@/stores'
import type { ImgList } from '@/types/consult'
import type { Message } from '@/types/room'
import { timeOptions, flagOptions } from '@/utils/consult'
import { showImagePreview, showToast } from 'vant'
import dayjs from 'dayjs'
import { getPrescriptionPic } from '@/services/consult'

const userStore = useUserStore()

const getIllnessTimeText = (time: IllnessTime) => {
  return timeOptions.find((item) => item.value === time)?.label
}
const getFlagText = (flag: 0 | 1) => {
  return flagOptions.find((item) => item.value === flag)?.label
}

// 预览图片
const onPreviewImage = (images?: ImgList) => {
  if (images && images.length) showImagePreview(images.map((item) => item.url))
  else showToast('暂无图片')
}

const onShowPre = async (id: string) => {
  if (id) {
    const { data: res } = await getPrescriptionPic(id)
    showImagePreview([res.url])
  }
}

const previewImage = (url: string) => {
  showImagePreview([url])
}

// 时间格式
const formatTime = (time: string) => {
  return dayjs(time).format('HH:mm')
}
defineProps<{
  item: Message
}>()
</script>

<template>
  <div class="msg-page">
    <!-- 患者消息卡片 -->
    <div class="msg-illness" v-if="item.msgType === MessageType.CardPat">
      <div class="patient van-hairline--bottom">
        <p>
          {{ item.msg.consultRecord.patientInfo.name }}
          {{ item.msg.consultRecord.patientInfo.genderValue }}
          {{ item.msg.consultRecord.patientInfo.age }}岁
        </p>
        <p v-if="item.msg.consultRecord">
          {{ getIllnessTimeText(item.msg.consultRecord.illnessTime) }}
          {{ getFlagText(item.msg.consultRecord.consultFlag) }}
        </p>
      </div>
      <van-row>
        <van-col span="6">病情描述</van-col>
        <van-col span="18">{{ item.msg.consultRecord.illnessDesc }}</van-col>
        <van-col span="6">图片</van-col>
        <van-col span="18" @click="onPreviewImage(item.msg.consultRecord.pictures)"
          >点击查看</van-col
        >
      </van-row>
    </div>
    <!-- 通知：通用 -->
    <div class="msg-tip" v-if="item.msgType === MessageType.Notify">
      <div class="content">
        <span>{{ item.msg.content }}</span>
      </div>
    </div>
    <!-- 温馨提示 -->
    <div class="msg-tip" v-if="item.msgType === MessageType.NotiyfTip">
      <div class="content">
        <span class="green">温馨提示：</span>
        <span>{{ item.msg.content }}</span>
      </div>
    </div>
    <!-- 通知 结束 -->
    <div class="msg-tip" v-if="item.msgType === MessageType.NotifyCancel">
      <div class="content">
        <span>{{ item.msg.content }}</span>
      </div>
    </div>
    <!-- 发送文字 -->
    <div
      class="msg-send-to"
      v-if="item.msgType === MessageType.MsgText && item.from === userStore.user?.id"
    >
      <div class="content">
        <div class="time">{{ formatTime(item.createTime) }}</div>
        <div class="txt">{{ item.msg.content }}</div>
      </div>
      <van-image :src="item.fromAvatar"></van-image>
    </div>
    <!-- 发送图片 -->
    <div
      class="msg-send-to"
      v-if="item.msgType === MessageType.MsgImage && item.from === userStore.user?.id"
    >
      <div class="content" v-if="item.msg.picture">
        <div class="time">{{ formatTime(item.createTime) }}</div>
        <van-image
          fit="cover"
          :src="item.msg.picture?.url"
          @click="previewImage(item.msg.picture?.url)"
        ></van-image>
      </div>
      <van-image :src="item.fromAvatar"></van-image>
    </div>
    <!-- 接收文字 -->
    <div
      class="msg-send-from"
      v-if="item.msgType === MessageType.MsgText && userStore.user?.id !== item.from"
    >
      <van-image :src="item.fromAvatar"></van-image>
      <div class="content">
        <div class="time">{{ formatTime(item.createTime) }}</div>
        <div class="txt">{{ item.msg.content }}</div>
      </div>
    </div>
    <!-- 接收图片 -->
    <div
      class="msg-send-from"
      v-if="item.msgType === MessageType.MsgImage && item.from !== userStore.user?.id"
    >
      <van-image :src="item.fromAvatar"></van-image>
      <div class="content" v-if="item.msg.picture">
        <div class="time">{{ formatTime(item.createTime) }}</div>
        <van-image
          fit="cover"
          :src="item.msg.picture?.url"
          @click="previewImage(item.msg.picture?.url)"
        ></van-image>
      </div>
    </div>
    <!-- 处方卡片 -->
    <div class="msg-card" v-if="item.msgType === MessageType.CardPre">
      <div class="content" v-if="item.msg.prescription">
        <div class="head van-hairline--bottom">
          <div class="head-tit">
            <h3>电子处方</h3>
            <p class="icon" @click="onShowPre(item.msg.prescription?.id)">
              原始处方<van-icon name="arrow" />
            </p>
          </div>
          <p class="info">
            {{ item.msg.prescription?.name }}
            {{ item.msg.prescription?.gender === 1 ? '男' : '女' }}
            {{ item.msg.prescription?.age }}岁
            {{ item.msg.prescription?.diagnosis }}
          </p>
          <p class="time">开放时间：{{ item.msg.prescription?.createTime }}</p>
        </div>
        <div class="body">
          <div class="body-item" v-for="i in item.msg.prescription?.medicines" :key="i.id">
            <div class="drug">
              <p>{{ i.name }}{{ i.specs }}</p>
              <p>{{ i.usageDosag }}</p>
            </div>
            <div class="num">x{{ i.quantity }}</div>
          </div>
        </div>
      </div>
      <div class="foot">
        <span>购买药品</span>
      </div>
    </div>
    <!-- 评价卡片 -->
    <div
      class="msg-comment"
      v-if="item.msgType === MessageType.CardEva || item.msgType === MessageType.CardEvaForm"
    >
      <evaluate-card :evaluateDoc="item.msg.evaluateDoc" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/msg.scss';
</style>
