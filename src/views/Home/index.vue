<script lang="ts" setup>
import { ref } from 'vue'
import ArticleList from './components/ArticleList.vue'
import LikeDoctor from './components/LikeDoctor.vue'
import { useConsultStore } from '@/stores'
import { ConsultType } from '@/enum'

const active = ref(1)
const consultStore = useConsultStore()
</script>

<template>
  <div class="home-page">
    <div class="home-header">
      <div class="con">
        <h1>优医</h1>
        <div class="search">
          <cp-icon name="home-search"></cp-icon>
          搜一搜：疾病/症状/医生/健康知识
        </div>
      </div>
    </div>
    <div class="home-navs">
      <van-row>
        <van-col span="8">
          <router-link to="/" class="nav">
            <cp-icon name="home-doctor"></cp-icon>
            <p class="title">问医生</p>
            <p class="desc">按科室查问医生</p>
          </router-link>
        </van-col>
        <van-col span="8">
          <router-link
            to="/consult/fast"
            class="nav"
            @click="consultStore.setType(ConsultType.Fast)"
          >
            <cp-icon name="home-graphic"></cp-icon>
            <p class="title">极速问诊</p>
            <p class="desc">20s医生极速回复</p>
          </router-link>
        </van-col>
        <van-col span="8">
          <router-link to="/" class="nav">
            <cp-icon name="home-prescribe"></cp-icon>
            <p class="title">开药门诊</p>
            <p class="desc">线上买药更方便</p>
          </router-link>
        </van-col>
      </van-row>
      <van-row>
        <van-col span="6">
          <router-link to="/" class="nav min">
            <cp-icon name="home-order"></cp-icon>
            <p class="title">药品订单</p>
          </router-link>
        </van-col>
        <van-col span="6">
          <router-link to="/" class="nav min">
            <cp-icon name="home-docs"></cp-icon>
            <p class="title">健康档案</p>
          </router-link>
        </van-col>
        <van-col span="6">
          <router-link to="/" class="nav min">
            <cp-icon name="home-rp"></cp-icon>
            <p class="title">我的处方</p>
          </router-link>
        </van-col>
        <van-col span="6">
          <router-link to="/" class="nav min">
            <cp-icon name="home-find"></cp-icon>
            <p class="title">疾病查询</p>
          </router-link>
        </van-col>
      </van-row>
    </div>
    <div class="home-banner">
      <van-swipe :autoplay="3000" lazy-render indicator-color="#fff">
        <van-swipe-item>
          <img src="@/assets/ad.png" alt="" />
        </van-swipe-item>
        <van-swipe-item>
          <img src="@/assets/img/6.png" alt="" />
        </van-swipe-item>
        <van-swipe-item>
          <img src="@/assets/img/7.png" alt="" />
        </van-swipe-item>
        <van-swipe-item>
          <img src="@/assets/ad.png" alt="" />
        </van-swipe-item>
        <van-swipe-item>
          <img src="@/assets/img/5.png" alt="" />
        </van-swipe-item>
        <van-swipe-item>
          <img src="@/assets/img/1.png" alt="" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <van-tabs sticky v-model:active="active">
      <van-tab title="关注">
        <like-doctor />
        <article-list type="like" />
      </van-tab>
      <van-tab title="推荐">
        <article-list type="recommend" />
      </van-tab>
      <van-tab title="减脂">
        <article-list type="fatReduction" />
      </van-tab>
      <van-tab title="饮食">
        <article-list type="food" />
      </van-tab>
    </van-tabs>
  </div>
</template>

<style lang="scss" scoped>
.home-page {
  padding-bottom: 50px;
  .home-header {
    height: 90px;
    background: linear-gradient(180deg, rgba(62, 206, 197, 0.85), #26bcc6);
    border-bottom-left-radius: 150px 20px;
    border-bottom-right-radius: 150px 20px;
    .con {
      padding: 0 15px;
      h1 {
        font-size: 18px;
        color: #fff;
        font-weight: normal;
        padding: 20px 0;
        padding-left: 5px;
        line-height: 1;
      }
      .search {
        height: 40px;
        border-radius: 20px;
        box-shadow: 0px 15px 22px -7px rgba(224, 236, 250, 0.8);
        background-color: #fff;
        display: flex;
        align-items: center;
        padding: 0 20px;
        color: var(--cp-dark);
        font-size: 13px;
        .cp-icon {
          font-size: 16px;
          margin-right: 5px;
        }
      }
    }
  }
  .home-navs {
    padding: 20px 15px 0 15px;
    .nav {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px 0;
      .cp-icon {
        font-size: 48px;
      }
      .title {
        font-weight: 500;
        margin-top: 5px;
        color: var(--cp-text1);
      }
      .desc {
        font-size: 11px;
        color: var(--cp-tag);
        margin-top: 2px;
      }
      &.min {
        .cp-icon {
          font-size: 31px;
        }
        .title {
          font-size: 13px;
          color: var(--cp-text2);
          font-weight: normal;
        }
      }
    }
  }
  .home-banner {
    padding: 10px 15px;
    height: 100px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
