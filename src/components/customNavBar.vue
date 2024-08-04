<template>
  <view class="layout">
    <view class="navBar">
      <view
        class="statusBar"
        :style="{ height: getStatusBarHeight() + 'px' }"
      ></view>
      <view
        class="titleBar"
        :style="{
          height: getTitleBarHeight() + 'px',
          marginLeft: getLeftMargin(),
        }"
      >
        <view class="title">{{ title }}</view>
        <view class="search">
          <uni-icons class="icon" type="search" color="#888" size="18">
          </uni-icons>
          <view class="text">搜索</view>
        </view>
      </view>
    </view>
    <view class="fill" :style="{ height: getPaddingTop() + 'px' }"> </view>
  </view>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import {
  getStatusBarHeight,
  getTitleBarHeight,
  getPaddingTop,
  getLeftMargin,
} from "../utils/system";
defineProps({
  title: {
    type: String,
    default: "",
  },
});
</script>
<style lang="scss" scoped>
.layout {
  .navBar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 10;
    background: linear-gradient(to bottom, transparent, #fff 400rpx),
      linear-gradient(to right, #beecd8 20%, #f4e2d8);
    .statusBar {
    }
    .titleBar {
      display: flex;
      padding: 0 30rpx;
      align-items: center;
      .title {
        font-size: 22px;
        font-weight: 700;
        color: $text-font-color-1;
      }
      .search {
        width: 220rpx;
        height: 50rpx;
        border-radius: 60rpx;
        background: rgba(255, 255, 255, 0.4);
        border: 1px solid#fff;
        margin-left: 30rpx;
        color: #999;
        font-size: 28rpx;
        display: flex;
        align-items: center;
        .icon {
          padding-left: 5rpx;
        }
        .text {
          padding-left: 10rpx;
          // justify-content: center;
        }
      }
    }
  }
}
</style>
