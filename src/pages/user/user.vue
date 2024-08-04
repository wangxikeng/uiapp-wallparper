<template>
  <view class="userLayout pageBg" v-if="userInfo">
    <view :style="{ height: getPaddingTop() + 'px' }"></view>
    <view class="userInfo">
      <view class="avatar">
        <image src="../../../common/images/avatar.jpg" mode="aspectFill" />
      </view>
      <view class="ip"> {{ userInfo.IP }}</view>
      <view class="address" v-if="userInfo.address">
        来自于: {{ userInfo.address.province }} -
        {{ userInfo.address.city }}</view
      >
    </view>
    <view class="section">
      <view class="list">
        <view @click="toPage('download', '我的下载')" class="row">
          <view class="left">
            <uni-icons type="download-filled" size="20"></uni-icons>
            <view class="text"> 我的下载</view>
          </view>
          <view class="right">
            <view class="text"> {{ userInfo.downloadSize }}</view>
            <uni-icons type="forward" size="15" color="#aaa"></uni-icons>
          </view>
        </view>
        <view @click="toPage('score', '我的评分')" class="row">
          <view class="left">
            <uni-icons type="star-filled" size="20"></uni-icons>
            <view class="text"> 我的评分</view>
          </view>
          <view class="right">
            <view class="text"> {{ userInfo.scoreSize }}</view>
            <uni-icons type="forward" size="15" color="#aaa"></uni-icons>
          </view>
        </view>
        <view class="row">
          <view class="left">
            <uni-icons type="chatboxes-filled" size="20"></uni-icons>
            <view class="text"> 联系客服</view>
          </view>
          <view class="right">
            <view class="text"> 333</view>
            <uni-icons type="forward" size="15" color="#aaa"></uni-icons>
          </view>
          <!--#ifdef MP-->
          <button open-type="contact">联系客服</button>
          <!--#endif-->
          <!--#ifndef MP-->
          <button @click="clickContact">拨打电话</button>
          <!--#endif-->
        </view>
      </view>
    </view>
    <view class="section">
      <view class="list">
        <view class="row">
          <view class="left">
            <uni-icons type="notification-filled" size="20"></uni-icons>
            <view class="text"> 订阅更新</view>
          </view>
          <view class="right">
            <view class="text"> 333</view>
            <uni-icons type="forward" size="15" color="#aaa"></uni-icons>
          </view>
        </view>
        <view class="row">
          <view class="left">
            <uni-icons type="flag-filled" size="20"></uni-icons>
            <view class="text"> 常见问题</view>
          </view>
          <view class="right">
            <view class="text"> 333</view>
            <uni-icons type="forward" size="15" color="#aaa"></uni-icons>
          </view>
        </view>
      </view>
    </view>
  </view>
  <view class="loadingLayout" v-else>
    <view :style="{ height: getPaddingTop() + 'px' }"></view>
    <uni-load-more status="loading"></uni-load-more>
  </view>
</template>

<script lang="ts" setup>
import { apiUserInfo } from "@/api/api";
import { getStatusBarHeight, getPaddingTop } from "@/utils/system";
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";

const userInfo = ref<any>();
const clickContact = () => {
  uni.makePhoneCall({
    phoneNumber: "123456789",
  });
};

// 获取个人信息
const getUserInfo = async () => {
  const res: any = await apiUserInfo();
  userInfo.value = res.data;
};
onLoad(() => {
  getUserInfo();
});

// 跳转页面
const toPage = (type: string, name: string) => {
  uni.reLaunch({
    url: `/pages/classList/classList?name=${name}&type=${type}`,
  });
};
</script>

<style lang="scss" scoped>
.userLayout {
  .userInfo {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 50rpx 0rpx;
    .avatar {
      width: 160rpx;
      height: 160rpx;
      border-radius: 50%;
      overflow: hidden;
      image {
        height: 100%;
        width: 100%;
      }
    }
    .ip {
      font-size: 44rpx;
      color: #333;
      padding: 20rpx 0rpx 5rpx;
    }
    .address {
      font-size: 28rpx;
      color: #aaa;
    }
  }
  .section {
    width: 690rpx;
    margin: 50rpx auto;
    border: 1px solid #eee;
    border-radius: 20rpx;
    box-shadow: 0 0 30rpx rgba(0, 0, 0, 0.05);
    .list {
      .row {
        position: relative;
        height: 100rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 30rpx;
        background-color: #fff;
        border-bottom: 1px solid #eee;
        :deep() {
          .uni-icons {
            color: $brand-theme-color !important;
          }
        }
        &:last-child {
          border-bottom: none;
        }
        .left {
          display: flex;
          align-items: center;
          .text {
            padding-left: 20rpx;
            color: #666;
          }
        }
        .right {
          display: flex;
          align-items: center;
          .text {
            font-size: 23rpx;
            color: $text-font-color-1;
          }
        }
        button {
          position: absolute;
          top: 0;
          left: 0;
          height: 100rpx;
          width: 100%;
          opacity: 0;
        }
      }
    }
  }
}
</style>
