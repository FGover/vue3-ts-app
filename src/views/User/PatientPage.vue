<script lang="ts" setup>
import { getPatientList, addPatient, updatePatient, delPatient } from '@/services/user'
import type { PatientList, Patient } from '@/types/user'
import { nameRules, idCardRules } from '@/utils/rules'
import { showConfirmDialog, type FormInstance, showSuccessToast } from 'vant'
import { computed } from 'vue'
import { onMounted, ref } from 'vue'

const patientList = ref<PatientList>([])
const getPatient = async () => {
  const { data: res } = await getPatientList()
  patientList.value = res
}

// const count = ref(10)

const options = [
  { label: '男', value: 1 },
  { label: '女', value: 0 }
]

const show = ref(false)
const showPopup = (item?: Patient) => {
  if (item) {
    const { id, name, idCard, gender, defaultFlag } = item
    patient.value = { id, name, idCard, gender, defaultFlag }
  } else {
    // form.value?.resetValidation()
    patient.value = { ...initPatient }
  }
  show.value = true
}

// 初始化表单数据
const initPatient: Patient = {
  name: '',
  idCard: '',
  gender: 1,
  defaultFlag: 0
}

const patient = ref<Patient>({ ...initPatient })
// 支持复选框
const defaultFlag = computed({
  get: () => (patient.value.defaultFlag === 1 ? true : false),
  set: (val) => (patient.value.defaultFlag = val ? 1 : 0)
})

const form = ref<FormInstance>()
const onSubmit = async () => {
  // 表单校验
  await form.value?.validate()
  // 性别校验 身份证倒数第二位 0女 1男
  const gender = Number(patient.value.idCard.slice(-2, -1)) % 2
  if (gender !== patient.value.gender) {
    showConfirmDialog({
      title: '温馨提示',
      message: '填写的性别和身份证上的不一致，请确认'
    })
      .then(async () => {
        // 提交表单
        patient.value.id ? await updatePatient(patient.value) : await addPatient(patient.value)
        show.value = false
        getPatient()
        showSuccessToast(patient.value.id ? '编辑成功' : '添加成功')
      })
      .catch(() => {
        // 取消
      })
  } else {
    // 提交表单
    patient.value.id ? await updatePatient(patient.value) : await addPatient(patient.value)
    show.value = false
    getPatient()
    showSuccessToast(patient.value.id ? '编辑成功' : '添加成功')
  }
}

const deletePatient = () => {
  showConfirmDialog({
    title: '温馨提示',
    message: '确定删除该就诊人吗？'
  })
    .then(async () => {
      await delPatient(patient.value.id!)
      show.value = false
      getPatient()
      showSuccessToast('删除成功')
    })
    .catch(() => {
      // 取消
    })
}

onMounted(() => {
  getPatient()
})
</script>

<template>
  <div class="patient-page">
    <cp-nav-bar title="家庭档案"></cp-nav-bar>
    <div class="patient-list">
      <div class="patient-item" v-for="item in patientList" :key="item.id">
        <div class="info">
          <div class="info_tp">
            <span class="name">{{ item.name }}</span>
            <span class="id">{{ item.id?.replace(/^(.{6}).+(.{4})$/, '$1********$2') }}</span>
          </div>
          <div class="info_bm">
            <span>{{ item.genderValue }}</span>
            <span>{{ item.age }}岁</span>
          </div>
        </div>
        <div class="icon">
          <cp-icon name="user-edit" @click="showPopup(item)"></cp-icon>
        </div>
        <div class="tag" v-if="item.defaultFlag">默认</div>
      </div>
      <div class="patient-add" v-if="patientList.length < 6" @click="showPopup()">
        <cp-icon name="user-add"></cp-icon>
        <p>添加患者</p>
      </div>
      <div class="patient-tip">最多可添加6人</div>
      <!-- 弹层组件 -->
      <van-popup v-model:show="show" position="right" :style="{ width: '100%', height: '100%' }">
        <cp-nav-bar
          :title="patient.id ? '编辑患者' : '添加患者'"
          rightText="保存"
          :back="() => (show = false)"
          @click-right="onSubmit"
        ></cp-nav-bar>
        <van-form autocomplete="off" ref="form">
          <van-field
            v-model="patient.name"
            :rules="nameRules"
            label="真实姓名"
            placeholder="请输入真实姓名"
            clearable
          ></van-field>
          <!-- 测试号：110101198203195893 -->
          <van-field
            v-model="patient.idCard"
            :rules="idCardRules"
            label="身份证号"
            placeholder="请输入身份证号"
            clearable
          ></van-field>
          <van-field label="性别" class="pb4">
            <template #input>
              <cp-radio-btn v-model="patient.gender" :options="options"></cp-radio-btn>
            </template>
          </van-field>
          <van-field label="默认就诊人">
            <template #input>
              <van-checkbox v-model="defaultFlag" :icon-size="18" round></van-checkbox>
            </template>
          </van-field>
          <van-action-bar>
            <van-action-bar-button type="primary" text="删除" @click="deletePatient" />
          </van-action-bar>
        </van-form>
      </van-popup>
      <!-- 测试按钮 -->
      <!-- <cp-radio-btn :model-value="count" @update:model-value="count = $event"></cp-radio-btn> -->
      <!-- 第一种写法 -->
      <!-- <cp-radio-btn v-model="count"></cp-radio-btn> -->
      <!-- 第二种写法 -->
      <!-- <cp-radio-btn v-model:count="count"></cp-radio-btn> -->
      <!-- <cp-radio-btn
        :options="options"
        :modelValue="gender"
        @update:modelValue="gender = $event"
      ></cp-radio-btn> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.patient-page {
  padding: 0 0 80px;
  .patient-list {
    padding: 15px;
    .patient-item {
      position: relative;
      background-color: var(--cp-bg);
      padding: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 8px;
      margin-bottom: 15px;
      border: 1px solid var(--cp-bg);
      transition: all 0.3s;
      .info {
        display: flex;
        flex-direction: column;
        span {
          color: var(--cp-tip);
          margin-right: 20px;
          line-height: 30px;
          &.name {
            display: inline-block;
            width: 80px;
            font-size: 16px;
            color: var(--cp-text1);
            margin-right: 0;
          }
          &.id {
            display: inline-block;
            width: 180px;
            color: var(--cp-text2);
          }
        }
      }
      .icon {
        color: var(--cp-tag);
        width: 20px;
        text-align: center;
      }
      .tag {
        position: absolute;
        right: 60px;
        top: 21px;
        width: 30px;
        height: 16px;
        font-size: 10px;
        color: #fff;
        background-color: var(--cp-primary);
        border-radius: 3px;
        text-align: center;
      }
      &.selected {
        border-color: var(--cp-primary);
        background-color: var(--cp-plain);
        .icon {
          color: var(--cp-primary);
        }
      }
    }
    .patient-add {
      background-color: var(--cp-bg);
      color: var(--cp-primary);
      text-align: center;
      padding: 15px 0;
      border-radius: 8px;
      .cp-icon {
        font-size: 24px;
      }
    }
    .patient-tip {
      color: var(--cp-tag);
      padding: 12px 0;
    }
    .van-action-bar {
      padding: 0 10px;
      margin-bottom: 10px;
    }
  }
}
</style>
