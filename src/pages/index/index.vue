<template>
  <view class="homeLayout pageBg">
    <CustomNavBar :title="'推荐'"></CustomNavBar>
    <view class="banner" v-if="bannerList.length">
      <swiper
        indicator-dots="true"
        indicator-color="rgba(255, 255, 255, 0.5)"
        indicator-active-color="#ffff"
        autoplay="true"
        circular
      >
        <swiper-item v-for="item in bannerList" :key="item._id">
          <image
            :src="item.picurl"
            mode="aspectFill"
            @click="toPage(item.url, item.type, item.appid)"
          ></image>
        </swiper-item>
      </swiper>
    </view>
    <view class="notice">
      <view class="left">
        <uni-icons type="sound-filled" size="20"></uni-icons>
        <text class="text">公告</text>
      </view>
      <view class="center">
        <swiper
          vertical
          autoplay="true"
          interval="1500"
          duration="300"
          circular="true"
        >
          <swiper-item v-for="(item, index) in 4" :key="index">
            欢迎来到我的小程序
          </swiper-item>
        </swiper>
      </view>
      <view class="right">
        <uni-icons
          type="forward"
          size="20"
          color="$brand-theme-color"
        ></uni-icons>
      </view>
    </view>

    <view class="select">
      <common-title>
        <template #name>每日推荐</template>
        <template #custom>
          <view class="date">
            <uni-icons type="calendar" size="30"></uni-icons>
            <view class="text">
              <uni-dateformat :date="Date.now()" format="dd日"></uni-dateformat>
            </view>
          </view>
        </template>
      </common-title>
      <view class="content">
        <scroll-view scroll-x>
          <view
            @click="goPreview(item._id)"
            class="box"
            v-for="item in recommendList"
            :key="item._id"
          >
            <image :src="item.smallPicurl" mode="aspectFill" />
          </view>
        </scroll-view>
      </view>
    </view>
    <view class="theme">
      <common-title>
        <template #name>专题精选</template>
        <template #custom>
          <navigator
            class="more"
            url="/pages/classify/classify"
            open-type="reLaunch"
          >
            More+
          </navigator>
        </template>
      </common-title>
      <view class="content">
        <them-item
          v-for="item in themeList"
          :key="item._id"
          :item="item"
        ></them-item>
        <them-item :isMore="true"></them-item>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import commonTitle from "@/components/Common-title.vue";
import themItem from "@/components/Them-item.vue";
import CustomNavBar from "@/components/customNavBar.vue";
import { apiGetBanner, apiGetClassify, apiGetDayRandom } from "@/api/api";
import { onLoad, onShareAppMessage, onShareTimeline } from "@dcloudio/uni-app";

const bannerList = ref<any>([]);
const recommendList = ref<any>([]);
const themeList = ref<any>([]);
// 去往预览页面
const goPreview = (id: string) => {
  // 将recommendList 缓存
  uni.setStorageSync("classList", recommendList.value);
  uni.navigateTo({
    url: `/pages/preview/preview?id=${id}`,
  });
};

// 去往分类页
const toPage = (url: string, type: string, id: String) => {
  // 跳转到其他小程序
  if (type === "minProgram") {
    wx.navigateToMiniProgram({
      target: "miniProgram",
      appId: id,
      url: url,
    });
  }
  uni.navigateTo({
    url: `/pages/classList/classList?${url}`,
  });
};

// 获取首页轮播
const getBanner = async () => {
  const res: any = await apiGetBanner();
  bannerList.value = res.data;
};

// 获取每日推荐
const getRecommend = async () => {
  const res: any = await apiGetDayRandom();
  recommendList.value = res.data;
};

// 获取专题精选
const getTheme = async () => {
  const res: any = await apiGetClassify({
    select: true,
  });
  themeList.value = res.data;
};
onLoad(() => {
  getBanner();
  getRecommend();
  getTheme();
});

// 分享给好友
onShareAppMessage(() => {
  return {
    title: "壁纸",
    path: "/pages/index/index",
  };
});

// 分享给朋友圈
onShareTimeline(() => {
  return {
    title: "壁纸",
  };
});
</script>
<style lang="scss" scoped>
.homeLayout {
  .banner {
    width: 750rpx;
    padding: 30rpx 0;
    swiper {
      width: 750rpx;
      height: 340rpx;
      swiper-item {
        width: 100%;
        height: 100%;
        padding: 0 30rpx;
        image {
          width: 100%;
          height: 100%;
          border-radius: 10rpx;
        }
      }
    }
  }
  .notice {
    display: flex;
    width: 690rpx;
    height: 80rpx;
    background-color: #f9f9f9;
    line-height: 80rpx;
    margin: 0 auto;
    border-radius: 80rpx;
    .left {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 140rpx;
      :deep() {
        .uni-icons {
          color: $brand-theme-color !important;
        }
      }

      .text {
        color: $brand-theme-color;
        font-weight: 600;
        font-size: 28rpx;
      }
    }
    .center {
      flex: 1;
      swiper {
        height: 100%;
        &-item {
          height: 100%;
          font-size: 30rpx;
          color: #666;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
    .right {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 140rpx;
      width: 70rpx;
    }
  }
  .select {
    padding-top: 50rpx;
    .content {
      width: 720rpx;
      margin-left: 30rpx;
      margin-top: 30rpx;
      scroll-view {
        white-space: nowrap;
        .box {
          display: inline-block;
          width: 200rpx;
          height: 430rpx;
          margin-left: 15rpx;
          image {
            height: 100%;
            width: 100%;
          }
        }
        .box:last-child {
          margin-right: 30rpx;
        }
      }
    }
    .date {
      display: flex;
      align-items: center;
      color: $brand-theme-color;
      :deep() {
        .uni-icons {
          color: $brand-theme-color !important;
        }
      }
      .text {
        margin-left: 5rpx;
      }
    }
  }
  .theme {
    padding: 50rpx 0rpx;
    .more {
      font-size: 32rpx;
      color: #888;
    }
    .content {
      margin-top: 30rpx;
      padding: 0 30rpx;
      display: grid;
      gap: 15rpx;
      grid-template-columns: repeat(3, 1fr);
    }
  }
}
</style>
