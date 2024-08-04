<template>
  <view class="themItem">
    <navigator
      :url="`/pages/classList/classList?id=${item._id}&name=${item.name}`"
      class="box"
      v-if="!props.isMore"
    >
      <image class="pic" :src="item.picurl" mode="aspectFill" />
      <view class="mask"> {{ item.name }} </view>
      <view class="tab"> {{ formatTime(item.updateTime) }} </view>
    </navigator>
    <navigator
      url="/pages/classify/classify"
      open-type="reLaunch"
      class="box more"
      v-if="props.isMore"
    >
      <image class="pic" src="../../common/images/more.jpg" mode="aspectFill" />
      <view class="mask">
        <uni-icons type="more-filled" size="34" color="#ffff"> </uni-icons>
        <text>更多</text>
      </view>
    </navigator>
  </view>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";
dayjs.extend(relativeTime);
// 设置 dayjs 使用中文本地化
dayjs.locale("zh-cn");

// 格式化的时间
const formatTime = (time: string) => {
  return dayjs(time).fromNow();
};
const props = defineProps({
  isMore: {
    type: Boolean,
    default: false,
  },
  picUrl: {
    type: String,
    default: "../../common/images/preview2.jpg",
  },
  item: {
    type: Object,
    default: () => {
      return {
        name: "默认名称",
        picurl: "",
        updateTime: "",
      };
    },
  },
});
</script>
<style lang="scss" scoped>
.themItem {
  .box {
    height: 340rpx;
    border-radius: 10rpx;
    overflow: hidden;
    position: relative;
    .pic {
      width: 100%;
      height: 100%;
    }
    .mask {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 70rpx;
      background: rgb(0, 0, 0, 0.2);
      color: #fff;
      font-weight: 600;
      font-size: 30rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10rpx);
    }
    .tab {
      position: absolute;
      top: 0;
      left: 0;
      color: #fff;
      padding: 6rpx 4rpx;
      border-radius: 0 0 20rpx 0;
      font-size: 20rpx;
      background: rgb(250, 129, 90, 0.7);
      backdrop-filter: blur(10rpx);
      transform: scale(0.8);
      transform-origin: left top;
    }
  }
  .box.more {
    .mask {
      flex-direction: column;
      height: 100%;
      width: 100%;
      .text {
        font-size: 28rpx;
      }
    }
  }
}
</style>
