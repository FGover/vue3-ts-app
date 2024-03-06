<script lang="ts" setup>
import RoomStatus from './components/RoomStatus.vue'
import RoomAction from './components/RoomAction.vue'
import RoomMessage from './components/RoomMessage.vue'
import { io, Socket } from 'socket.io-client'
import { onMounted, onUnmounted, ref, nextTick, provide } from 'vue'
import { baseURL } from '@/utils/request'
import { useUserStore } from '@/stores'
import { useRoute } from 'vue-router'
import type { Message, MessageGroup } from '@/types/room'
import { MessageType, OrderStatus } from '@/enum'
import type { ConsultOrderItem, Image } from '@/types/consult'
import { getConsultOrderDetail } from '@/services/consult'
import dayjs from 'dayjs'
import { showToast } from 'vant'

const consult = ref<ConsultOrderItem>()
const loadConsult = async () => {
  const { data: res } = await getConsultOrderDetail(route.query.orderId as string)
  consult.value = res
}

// 向Card组件传递数据
provide('consult', consult)
// 修改评价信息
const completeEva = (score: number) => {
  const item = MsgList.value.find((item) => item.msgType === MessageType.CardEvaForm)
  if (item) {
    item.msg.evaluateDoc = { score }
    item.msgType = MessageType.CardEva
  }
}
provide('completeEva', completeEva)

const userStore = useUserStore()
const route = useRoute()
let socket: Socket
const MsgList = ref<Message[]>([])
const initalMag = ref(true)

// 建立WebSocket连接
onMounted(() => {
  loadConsult()
  socket = io(baseURL, {
    auth: {
      token: `Bearer ${userStore.user?.token}`
    },
    query: {
      orderId: route.query.orderId
    }
  })
  socket.on('connect', () => {
    console.log('WebSocket连接已建立')
  })
  socket.on('disconnect', () => {
    console.log('WebSocket连接已断开')
  })
  socket.on('error', () => {
    console.log('WebSocket连接发生错误')
  })
  // 获取初始聊天记录   解构赋值
  socket.on('chatMsgList', ({ data }: { data: MessageGroup[] }) => {
    const arr: Message[] = []
    data.forEach((item, i) => {
      // 记录每一段消息的最早时间
      if (i === 0) {
        time.value = item.createTime
      }
      arr.push({
        msgType: MessageType.Notify,
        msg: {
          content: item.createTime
        },
        createTime: item.createTime,
        id: item.createTime
      })
      arr.push(...item.items)
    })
    MsgList.value.unshift(...arr)
    loading.value = false
    if (!arr.length) return showToast('没有更多聊天记录了')
    if (initalMag.value) {
      socket.emit('updateMsgStatus', arr[arr.length - 1].id)
      // 刷新滚动最新消息
      nextTick(() => {
        window.scrollTo(0, document.body.scrollHeight)
        initalMag.value = false
      })
    }
  })
  // 监听订单状态变化
  socket.on('statusChange', () => loadConsult())
  // 监听更新聊天信息
  socket.on('receiveChatMsg', async (e) => {
    socket.emit('updateMsgStatus', e.id)
    MsgList.value.push(e)
    await nextTick()
    window.scrollTo(0, document.body.scrollHeight)
  })
})

// 发送文字
const onSendText = (text: string) => {
  socket.emit('sendChatMsg', {
    from: userStore.user?.id,
    to: consult.value?.docInfo?.id,
    msgType: MessageType.MsgText,
    msg: {
      content: text
    }
  })
}
// 发送图片
const onSendImage = (image: Image) => {
  socket.emit('sendChatMsg', {
    from: userStore.user?.id,
    to: consult.value?.docInfo?.id,
    msgType: MessageType.MsgImage,
    msg: {
      picture: image
    }
  })
}

// 下拉刷新
const loading = ref(false)
const time = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
const onRefresh = () => {
  socket.emit('getChatMsgList', 20, time.value, consult.value?.id)
}

// 组件卸载断开连接
onUnmounted(() => {
  socket.close()
})
</script>

<template>
  <div class="room-page">
    <div class="room-head">
      <cp-nav-bar title="问诊室" />
      <room-status :status="consult?.status" :countdown="consult?.countdown" />
    </div>
    <div class="room-content">
      <van-pull-refresh v-model="loading" @refresh="onRefresh">
        <room-message v-for="item in MsgList" :key="item.id" :item="item" />
      </van-pull-refresh>
    </div>
    <room-action
      @send-text="onSendText"
      @send-image="onSendImage"
      :disabled="consult?.status !== OrderStatus.ConsultChat"
    />
  </div>
</template>

<style lang="scss" scoped>
.room-head {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
}
.room-content {
  padding-top: 110px;
  padding-bottom: 60px;
  min-height: 100vh;
  background-color: var(--cp-bg);
  box-sizing: border-box;
  .van-pull-refresh {
    width: 100%;
    min-height: calc(100vh - 150px);
  }
}
</style>
