<script lang="ts" setup>
import { IllnessTime } from '@/enum'
import { uploadImage } from '@/services/consult'
import { useConsultStore } from '@/stores'
import type { ConsultIllness, ImgList } from '@/types/consult'
import { showToast } from 'vant'
import type { UploaderAfterRead, UploaderFileListItem } from 'vant/lib/uploader/types'
import { onMounted } from 'vue'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const timeOptions = [
  { label: '一周内', value: IllnessTime.Week, msg: '请填写患病时间信息' },
  { label: '一月内', value: IllnessTime.Month, msg: '请填写患病时间信息' },
  { label: '半年内', value: IllnessTime.HalfYear, msg: '请填写患病时间信息' },
  { label: '超过半年', value: IllnessTime.More, msg: '请填写患病时间信息' }
]
const flagOptions = [
  { label: '就诊过', value: 1, msg: '请填写是否就诊信息' },
  { label: '没就诊过', value: 0, msg: '请填写是否就诊信息' }
]

const form = ref<ConsultIllness>({
  illnessDesc: '',
  illnessTime: 1,
  consultFlag: 0,
  pictures: []
})

// 上传图片
const fileList = ref<ImgList>([])
const afterRead: UploaderAfterRead = (item) => {
  console.log(item)
  if (Array.isArray(item)) {
    item.forEach((v) => {
      v.status = 'uploading'
      v.message = '上传中...'
      if (!v.file) return
      uploadImage(v.file)
        .then((res) => {
          v.status = 'done'
          v.message = '上传完成'
          v.url = res.data.url
          form.value.pictures?.push(res.data)
        })
        .catch(() => {
          v.status = 'failed'
          v.message = '上传失败'
        })
    })
  } else {
    if (!item.file) return
    item.status = 'uploading'
    item.message = '上传中...'
    uploadImage(item.file)
      .then((res) => {
        item.status = 'done'
        item.message = '上传完成'
        item.url = res.data.url
        form.value.pictures?.push(res.data)
      })
      .catch(() => {
        item.status = 'failed'
        item.message = '上传失败'
      })
  }
}
// 删除图片
const delImg = (item: UploaderFileListItem) => {
  form.value.pictures = form.value.pictures?.filter((v) => v.url !== item.url)
}

const active = ref(false)
// 监听form表单数据是否全部填写完成 激活按钮
watch(
  form,
  (newValue) => {
    if (
      newValue.illnessDesc &&
      (newValue.consultFlag === 0 || newValue.consultFlag === 1) &&
      (newValue.illnessTime === 1 ||
        newValue.illnessTime === 2 ||
        newValue.illnessTime === 3 ||
        newValue.illnessTime === 4)
    ) {
      active.value = true
    } else {
      active.value = false
    }
  },
  { deep: true }
)
// 计算属性也可以监听
// const active = computed(() => {
//   return (
//     form.value.illnessDesc &&
//     form.value.consultFlag !== undefined &&
//     form.value.illnessTime !== undefined
//   )
// })

const consultStore = useConsultStore()

// 校验表单
const next = () => {
  if (!active.value) return showToast('请填写完整信息')
  if (!form.value.illnessDesc) return showToast('请输入病情描述')
  if (!form.value.consultFlag === undefined) return showToast('请选择是否就诊')
  if (form.value.illnessTime === undefined) return showToast('请选择就诊时间')
  // 校验通过
  consultStore.setIllness(form.value)
  router.push('/user/patient?isChange=1')
}

// 数据回显
onMounted(() => {
  if (consultStore.consultInfo.illnessDesc) {
    const { illnessDesc, pictures, consultFlag, illnessTime } = consultStore.consultInfo
    form.value = { illnessDesc, pictures, consultFlag, illnessTime }
    fileList.value = pictures || []
  }
})
</script>

<template>
  <cp-nav-bar title="图文问诊"></cp-nav-bar>
  <div class="consult-illness-page">
    <div class="illness-tip van-hairline--bottom">
      <img src="@/assets/avatar-doctor.svg" alt="" />
      <div class="info">
        <p class="tit">在线医生</p>
        <p class="tip">请描述你的疾病或症状、是否用药、就诊经历，需要我听过什么样的帮助</p>
        <p class="safe">
          <cp-icon name="consult-safe"></cp-icon>
          <span>内容仅医生可见</span>
        </p>
      </div>
    </div>
    <div class="illness-form">
      <van-field
        v-model="form.illnessDesc"
        type="textarea"
        rows="3"
        placeholder="请详细描述您病情，病情描述不能为空"
      />
      <div class="item">
        <p>本次患病多久了？</p>
        <cp-radio-btn v-model="form.illnessTime" :options="timeOptions"></cp-radio-btn>
      </div>
      <div class="item">
        <p>此次病情是否去医院就诊过？</p>
        <cp-radio-btn v-model="form.consultFlag" :options="flagOptions"></cp-radio-btn>
      </div>
      <div class="illness-img">
        <van-uploader
          multiple
          max-count="9"
          :max-size="2 * 1024 * 1024"
          upload-icon="photo-o"
          upload-text="上传图片"
          v-model="fileList"
          :after-read="afterRead"
          @delete="delImg"
        />
        <p class="tip" v-if="!fileList.length">上传内容仅医生可见,最多9张图,最大2MB</p>
      </div>
    </div>
    <van-button @click="next" :class="{ disabled: !active }" block round>下一步</van-button>
  </div>
</template>

<style lang="scss" scoped>
.consult-illness-page {
  padding: 15px;
  .illness-tip {
    display: flex;
    img {
      width: 52px;
      height: 52px;
      border-radius: 4px;
      overflow: hidden;
      margin-top: 10px;
    }
    .info {
      padding-left: 12px;
      flex: 1;
      .tit {
        font-size: 15px;
        margin-bottom: 5px;
        font-weight: bold;
      }
      .tip {
        padding: 12px;
        background: var(--cp-bg);
        color: var(--cp-text3);
        font-size: 13px;
        margin-bottom: 10px;
      }
      .safe {
        font-size: 10px;
        color: var(--cp-text3);
        display: flex;
        align-items: center;
        span {
          margin-left: 3px;
        }
      }
    }
  }
  .illness-form {
    padding: 15px 2px;
    .van-field {
      padding: 0;
      &::after {
        border-bottom: none;
      }
    }
    .item {
      p {
        color: var(--cp-text3);
        padding: 15px 0;
      }
    }
  }
  .illness-img {
    padding-top: 10px;
    margin-bottom: 40px;
    display: flex;
    align-items: center;
    .tip {
      font-size: 12px;
      color: var(--cp-tip);
    }
    ::v-deep() {
      .van-uploader {
        &__preview {
          &-delete {
            position: absolute;
            top: -5px;
            right: -5px;
            border-radius: 50%;
            background-color: var(--cp-primary);
            width: 17px;
            height: 17px;
            &-icon {
              position: absolute;
              top: 2.6px;
              right: 2.8px;
              transform: scale(0.9 translate(-22%, 22%));
            }
          }
          &-image {
            border-radius: 8px;
            overflow: hidden;
          }
        }
        &__upload {
          border-radius: 8px;
        }
        &__upload-icon {
          color: var(--cp-text3);
        }
      }
    }
  }
  .van-button {
    font-size: 16px;
    margin-bottom: 30px;
    background: var(--cp-primary);
    color: #fff;
    &.disabled {
      opacity: 1;
      background: #fafafa;
      color: #d9dbde;
      border: #fafafa;
    }
  }
}
</style>
