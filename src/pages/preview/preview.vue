<template>
  <view class="preview" v-if="classItem">
    <swiper circular="true" :current="currentIndex" @change="changePage">
      <swiper-item v-for="(item, index) in classList" :key="item._id">
        <image
          v-if="readImages.includes(index)"
          @click="maskChange"
          :src="item.picUrl"
          mode="aspectFill"
        />
      </swiper-item>
    </swiper>
    <view class="mask" v-show="maskState">
      <!-- #ifndef  MP-TOUTIAO -->
      <view
        class="goBack"
        @click="goBack"
        :style="{
          top: getStatusBarHeight() + 'px',
        }"
      >
        <uni-icons type="back" color="#fff" size="20"></uni-icons>
      </view>
      <!-- #endif -->
      <view class="count"
        >{{ currentIndex + 1 }} / {{ classList.length }}
      </view>
      <view class="time">
        <uni-dateformat :date="Date.now()" format="hh:mm"> </uni-dateformat
      ></view>
      <view class="date">
        <uni-dateformat :date="Date.now()" format="MM月dd日"> </uni-dateformat>
      </view>
      <view class="footer">
        <view class="box" @click="clickInfo">
          <uni-icons type="info" size="28"></uni-icons>
          <view class="text">信息</view>
        </view>
        <view class="box" @click="clickScore">
          <uni-icons type="star" size="28"></uni-icons>
          <view class="text">{{ classItem.userScore || classItem.score }}</view>
        </view>
        <view class="box" @click="clickDownLoad">
          <uni-icons type="download" size="28"></uni-icons>
          <view class="text">下载</view>
        </view>
      </view>
    </view>
    <uni-popup ref="infoPopup" type="bottom" :safe-area="false">
      <view class="infoPopup">
        <view class="popHeader">
          <view></view>
          <view class="title">壁纸信息</view>
          <view class="close" @click="clickInfoClose">
            <uni-icons type="closeempty" size="20"></uni-icons>
          </view>
        </view>
        <scroll-view scroll-y>
          <view class="content">
            <view class="row">
              <view class="label">壁纸ID : </view>
              <text selectable class="value"> {{ classItem._id }}</text>
            </view>
            <view class="row">
              <view class="label">发布者 :</view>
              <text selectable class="value"> {{ classItem.nickname }}</text>
            </view>
            <view class="row">
              <view class="label">评分 : </view>
              <view class="value roteBox">
                <uni-rate readonly="true" :value="classItem.score" size="16" />
                <text class="score">{{ classItem.score }}</text>
              </view>
            </view>
            <view class="row">
              <view class="label">摘要 : </view>
              <view class="value"> {{ classItem.description }}</view>
            </view>
            <view class="row">
              <view class="label">标签 : </view>
              <view class="value tabs">
                <view class="tab" v-for="item in classItem.tabs" :key="item">{{
                  item
                }}</view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </uni-popup>
    <uni-popup ref="rotePopup" type="center" :is-mask-click="false">
      <view class="scorePopup">
        <view class="popHeader">
          <view></view>
          <view class="title">{{ flag ? "已经评过分了~" : "壁纸评分" }}</view>
          <view class="close" @click="clickScoreClose">
            <uni-icons type="closeempty" size="20"></uni-icons>
          </view>
        </view>
        <view class="content">
          <uni-rate
            allow-half
            v-model="useScore"
            size="20"
            :disabled="flag"
            disabled-color="#FFC93C"
          />
          <text class="text">{{ useScore }}分</text>
        </view>
        <view class="footer">
          <button @click="submit" size="mini" plain :disabled="flag">
            {{ flag ? "已评分" : "确认评分" }}
          </button>
        </view>
      </view>
    </uni-popup>
  </view>
  <view class="safe-area-inset-bottom"></view>
</template>

<script lang="ts" setup>
import { onLoad, onShareAppMessage } from "@dcloudio/uni-app";
import {
  backHome,
  getImageInfo,
  getStatusBarHeight,
  saveImage,
} from "../../utils/system";
import { ref } from "vue";
import { apiDetailWall, apiGetSetupScore, apiWriteDownload } from "@/api/api";

const infoPopup = ref();
const rotePopup = ref();
const maskState = ref(true);
const classList = ref<any>([]);
const currentId = ref(0);
const readImages = ref<any>([]);
const classItem = ref<any>({});
// 当前的索引值
const currentIndex = ref<any>(0);

// 评分标志
const flag = ref<boolean>(false);
// 评分
const useScore = ref(0);
// 从缓存中获取数据
const getStoreInfo = uni.getStorageSync("classList") || [];

// 修改图片地址
classList.value = getStoreInfo.map((item: any) => {
  return {
    ...item,
    picUrl: item.smallPicurl.replace("_small.webp", ".jpg"),
  };
});

const clickInfo = () => {
  infoPopup.value.open();
};

const clickInfoClose = () => {
  infoPopup.value.close();
};
const maskChange = () => {
  maskState.value = !maskState.value;
};

// 评分弹窗
const clickScore = () => {
  if (classItem.value.userScore) {
    flag.value = true;
    useScore.value = classItem.value.userScore;
  }
  rotePopup.value.open();
};

// 关闭弹窗
const clickScoreClose = () => {
  useScore.value = 0;
  // 恢复默认值
  flag.value = false;
  rotePopup.value.close();
};

// 确认评分
const submit = async () => {
  uni.showLoading({
    title: "评分中...",
  });
  const res: any = await apiGetSetupScore({
    classid: classItem.value.classid,
    wallId: classItem.value._id,
    userScore: useScore.value,
  });
  if (res.errCode === 0) {
    uni.showToast({
      title: "评分成功",
      icon: "success",
    });
    uni.hideLoading();
    flag.value = true;
    // 将评分存储下来
    classList.value[currentIndex.value].userScore = useScore.value;
    uni.setStorageSync("classList", classList.value);
    clickScoreClose();
  } else {
    uni.showToast({
      title: "评分失败",
      icon: "error",
    });
  }
};

// 点击下载
const clickDownLoad = async () => {
  // 适配H5
  // #ifdef H5
  uni.showModal({
    content: "请长按保存壁纸",
    showCancel: false,
  });
  // #endif

  // #ifndef H5
  try {
    uni.showLoading({
      title: "下载中",
      mask: true,
    });
    const res: any = await apiWriteDownload({
      classid: classItem.value.classid,
      wallId: classItem.value._id,
    });
    if (res.errCode != 0) throw res;
    getImageInfo(classItem.value.picUrl, saveImage);
  } catch {
    uni.hideLoading();
  }
  // #endif
};
// 返回上一页
const goBack = () => {
  uni.navigateBack({
    fail: () => {
      uni.reLaunch({
        url: "/pages/index/index",
      });
    },
  });
};

// 滑动翻页
const changePage = (e: any) => {
  classItem.value = classList.value[currentIndex.value];
  currentIndex.value = e.detail.current;

  // 优化图片加载性能
  ImageCache();
};

onLoad(async (props) => {
  let { id, type } = props as any;
  if (!id) {
    backHome();
    return;
  }
  currentId.value = id;
  // 从分享页进来的逻辑
  if (type === "share") {
    const res: any = await apiDetailWall({
      id: currentId.value,
    });
    // 修改图片地址
    classList.value = res.data.map((item: any) => {
      return {
        ...item,
        picUrl: item.smallPicurl.replace("_small.webp", ".jpg"),
      };
    });
  }

  // 从数组中获取某一项
  currentIndex.value = classList.value.findIndex((item: any) => {
    return item._id === id;
  });
  classItem.value = classList.value[currentIndex.value];
  // 优化图片加载性能
  ImageCache();
});

const ImageCache = () => {
  // 优化图片加载性能
  readImages.value.push(
    currentIndex.value,
    currentIndex.value <= 0
      ? classList.value.length - 1
      : currentIndex.value - 1,

    currentIndex.value >= classList.value.length - 1
      ? 0
      : currentIndex.value + 1
  );
  // 数组去重
  readImages.value = [...new Set(readImages.value)];
};
// 分享给好友
onShareAppMessage(() => {
  return {
    title: "壁纸",
    path: `/pages/preview/preview?id=${classItem.value._id}&type=share`,
  };
});
</script>

<style lang="scss" scoped>
.preview {
  position: relative;
  width: 100%;
  height: 100vh;
  swiper {
    width: 100%;
    height: 100%;
    image {
      width: 100%;
      height: 100%;
    }
  }
  .mask {
    & > view {
      position: absolute;
      left: 0;
      width: fit-content;
      margin: auto;
      color: #fff;
      right: 0;
    }
    .goBack {
      width: 38px;
      height: 38px;
      background: rgba(0, 0, 0, 0.5);
      left: 30rpx;
      top: 0;
      margin-left: 0;
      border-radius: 100px;
      backdrop-filter: blur(10rpx);
      border: 1rpx solid rgba(255, 255, 255, 0.3);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .count {
    top: 10vh;
    font-size: 28rpx;
    border-radius: 40rpx;
    padding: 8rpx 29rpx;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(1rpx);
  }
  .time {
    top: calc(10vh + 80rpx);
    font-size: 140rpx;
    font-weight: 100;
    line-height: 1em;
    text-shadow: 0 4rpx rgb(0, 0, 0, 0.3);
  }
  .date {
    top: calc(10vh + 230rpx);
    font-size: 34rpx;
    text-shadow: 0 2rpx rgb(0, 0, 0, 0.3);
  }
  .footer {
    background-color: rgba(255, 255, 255, 0.8);
    bottom: 10vh;
    width: 65vw !important;
    height: 120rpx;
    border-radius: 120rpx;
    color: #000;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-shadow: 0 2rpx rgb(0, 0, 0, 0.1);
    backdrop-filter: blur(10rpx);
    .box {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rpx 12rpx;
      .text {
        font-size: 26rpx;
        color: $text-font-color-2;
      }
    }
  }
}
.popHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title {
    color: $text-font-color-2;
    font-size: 26rpx;
  }
  .close {
    padding: 6rpx;
  }
}
.infoPopup {
  background-color: #fff;
  padding: 30rpx;
  border-radius: 30rpx 30rpx 0 0;
  overflow: hidden;
}
scroll-view {
  max-height: 60vh;
  .content {
    .row {
      display: flex;
      padding: 16rpx 0;
      font-size: 32rpx;
      line-height: 1.7em;
      .label {
        color: $text-font-color-3;
        padding-right: 10rpx;
        width: 140rpx;
        text-align: right;
        font-size: 30rpx;
      }
      .value {
        flex: 1;
        width: 0;
      }
      .roteBox {
        display: flex;
        align-items: center;
        .score {
          font-size: 26rpx;
          color: $text-font-color-2;
          padding-left: 20rpx;
        }
      }
      .tabs {
        display: flex;
        flex-wrap: wrap;
        font-size: 20rpx;
        color: $brand-theme-color;
        .tab {
          padding: 10rpx 20rpx;
          border-radius: 40rpx;
          line-height: 2em;
          margin: 0 10rpx 10rpx 0;
          border: 1rpx solid $brand-theme-color;
        }
      }
    }
  }
}
.scorePopup {
  background-color: #fff;
  padding: 30rpx;
  width: 70vw;
  border-radius: 30rpx;
  .content {
    padding: 30rpx 0;
    display: flex;
    align-items: center;
    justify-content: center;
    .text {
      padding-left: 10rpx;
      width: 80rpx;
      color: #ffca3e;
      line-height: 1em;
      text-align: right;
    }
  }
  .footer {
    padding: 10rpx 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
