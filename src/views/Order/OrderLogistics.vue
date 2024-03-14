<script lang="ts" setup>
import { getLogisticsAPI } from '@/services/order'
import type { Logistics } from '@/types/order'
import AMapLoader from '@amap/amap-jsapi-loader'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { Location } from '@/types/order'
import endImg from '@/assets/end.png'
import startImg from '@/assets/start.png'
import carImg from '@/assets/car.png'
const route = useRoute()

const logistics = ref<Logistics>()
onMounted(async () => {
  const { data: res } = await getLogisticsAPI(route.params.id as string)
  logistics.value = res
  // 初始化地图
  initMap()
})

window._AMapSecurityConfig = {
  securityJsCode: '4b0eec16be30c24d7aacdd34a261d3dd'
}

const initMap = () => {
  AMapLoader.load({
    key: '83c938f7feafc50c66b4f2dffbb4ae61', // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0' // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
  }).then((AMap) => {
    const map = new AMap.Map('map', {
      //设置地图的显示样式
      mapStyle: 'amap://styles/fresh',
      // 缩放比例
      zoom: 12
    })
    AMap.plugin('AMap.Driving', function () {
      // 初始化Driving对象
      const driving = new AMap.Driving({
        map: map,
        hideMarkers: true // 隐藏起点和终点标记
      })
      // 根据起终点坐标规划驾车路线
      const list = [...logistics.value.logisticsInfo]
      // 标记函数
      const createMark = (img: string, point?: Location, width = 25, height = 30) => {
        const icon = new AMap.Icon({
          size: new AMap.Size(width, height),
          image: img,
          imageSize: new AMap.Size(width, height)
        })
        const marker = new AMap.Marker({
          position: [point?.longitude, point?.latitude],
          icon: icon,
          offset: new AMap.Pixel(-width / 2, -height)
        })
        return marker
      }
      const start = list.shift()
      map.add(createMark(startImg, start))
      const end = list.pop()
      map.add(createMark(endImg, end))
      driving.search(
        [start?.longitude, start?.latitude],
        [end?.longitude, end?.latitude],
        {
          waypoints: list.map((item) => [item.longitude, item.latitude])
        },
        () => {
          const car = logistics.value?.currentLocationInfo
          map.add(createMark(carImg, car, 33, 20))
          // 3s后定位到中间进行缩放
          setTimeout(() => {
            map.setFitView([car])
            map.setZoom(10)
          }, 3000)
        }
      )
    })
  })
}
</script>

<template>
  <div class="order-logistics">
    <div id="map">
      <div class="title">
        <van-icon name="arrow-left" @click="$router.back()"></van-icon>
        <span>{{ logistics?.statusValue }}</span>
        <van-icon name="service"></van-icon>
      </div>
      <div class="current">
        <p class="status">订单派送中 预计{{ logistics?.estimatedTime }}送达</p>
        <p class="predict">
          <span>{{ logistics?.name }}</span>
          <span>{{ logistics?.awbNo }}</span>
        </p>
      </div>
    </div>
    <div class="logistics">
      <p class="title">物流详情</p>
      <van-steps direction="vertical" :active="0">
        <van-step v-for="i in logistics?.list" :key="i.id">
          <p class="status">{{ i.statusValue }}</p>
          <p class="content">{{ i.content }}</p>
          <p class="time">{{ i.createTime }}</p>
        </van-step>
      </van-steps>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.order-logistics {
  --van-step-icon-size: 18px;
  --van-step-circle-size: 10px;
  #map {
    height: 450px;
    background-color: var(--cp-bg);
    overflow: hidden;
    position: relative;
    .title {
      background-color: #fff;
      height: 46px;
      width: 355px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      padding: 0 15px;
      font-size: 16px;
      position: absolute;
      left: 10px;
      top: 10px;
      box-sizing: border-box;
      box-shadow: 0px 0px 22px 0px rgba(229, 229, 229, 0.5);
      z-index: 999;
      span {
        flex: 1;
        text-align: center;
      }
      .van-icon {
        font-size: 18px;
        color: #666;
        &:last-child {
          color: var(--cp-primary);
        }
      }
    }
    .current {
      width: 355px;
      height: 80px;
      border-radius: 4px;
      background-color: #fff;
      box-sizing: border-box;
      padding: 15px;
      position: absolute;
      left: 10px;
      bottom: 10px;
      box-shadow: 0px 0px 22px 0px rgba(229, 229, 229, 0.5);
      z-index: 999;
      .status {
        font-size: 15px;
        line-height: 26px;
      }
      .predict {
        color: var(--cp-tip);
        font-size: 13px;
        margin-top: 5px;
        span {
          padding-right: 10px;
        }
      }
    }
  }
  .logistics {
    padding: 0 10px 20px;
    .title {
      font-size: 16px;
      padding: 15px 5px 5px;
    }
    .van-steps {
      :deep(.van-step) {
        &::after {
          display: none !important;
        }
      }
    }
    .status {
      font-size: 15px;
      color: var(--cp-text3);
      margin-bottom: 4px;
    }
    .content {
      font-size: 13px;
      color: var(--cp-tip);
      margin-bottom: 4px;
    }
    .time {
      font-size: 13px;
      color: var(--cp-tag);
    }
  }
}
</style>
