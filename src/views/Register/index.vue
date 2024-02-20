<script lang="ts" setup>
const images = [
  'https://img2.baidu.com/it/u=268838489,1455995713&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=500',
  'https://img1.baidu.com/it/u=1852645145,2821258143&fm=253&fmt=auto&app=120&f=JPEG?w=799&h=500',
  'https://i0.hdslb.com/bfs/archive/fb9b0983a85f76ee897e9bc14463bd4c50078177.jpg',
  ''
]
</script>

<template>
  <div class="register-page">
    <cp-nav-bar title="私人影院注册"></cp-nav-bar>
    <van-swipe :autoplay="3000" lazy-render>
      <van-swipe-item v-for="image in images" :key="image">
        <img :src="image" />
      </van-swipe-item>
    </van-swipe>
    <van-grid :border="false" :column-num="2">
      <van-grid-item>
        <img src="../../assets/img/1.png" alt="" />
      </van-grid-item>
      <van-grid-item>
        <img src="../../assets/img/2.png" alt="" />
      </van-grid-item>
      <van-grid-item>
        <img src="../../assets/img/3.png" alt="" />
      </van-grid-item>
      <van-grid-item>
        <img src="../../assets/img/4.png" alt="" />
      </van-grid-item>
      <van-grid-item>
        <img src="../../assets/img/5.png" alt="" />
      </van-grid-item>
      <van-grid-item>
        <img src="../../assets/img/1.png" alt="" />
      </van-grid-item>
      <van-grid-item>
        <img src="../../assets/img/6.png" alt="" />
      </van-grid-item>
      <van-grid-item>
        <img src="../../assets/img/7.png" alt="" />
      </van-grid-item>
      <van-grid-item>
        <img src="../../assets/img/5.png" alt="" />
      </van-grid-item>
      <van-grid-item>
        <img src="../../assets/img/2.png" alt="" />
      </van-grid-item>
    </van-grid>
  </div>
</template>

<style lang="scss" scoped>
h3 {
  margin-top: 5px;
  text-align: center;
}
img {
  width: 100%;
  height: 100%;
}
</style>
