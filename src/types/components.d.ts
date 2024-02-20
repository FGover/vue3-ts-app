import CpNavBar from '@/components/CpNavBar.vue'
import CpIcon from '@/components/CpIcon.vue'
import TabBar from '@/components/TabBar.vue'
import CpRadioBtn from '@/components/CpRadioBtn.vue'

declare module 'vue' {
  interface GlobalComponents {
    // 添加组件类型
    CpNavBar: typeof CpNavBar
    CpIcon: typeof CpIcon
    TabBar: typeof TabBar
    CpRadioBtn: typeof CpRadioBtn
  }
}
