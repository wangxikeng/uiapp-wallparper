<template>
  <view class="classList">
    <view class="loadingLayout" v-if="!imageList.length && !flag">
      <uni-load-more status="loading"></uni-load-more>
    </view>
    <view class="content">
      <navigator
        :url="`/pages/preview/preview?id=${item._id}`"
        class="item"
        v-for="item in imageList"
        :key="item._id"
      >
        <image :src="item.smallPicurl" mode="aspectFill" />
      </navigator>
    </view>

    <view class="loadingLayout" v-if="imageList.length || flag">
      <uni-load-more :status="flag ? 'noMore' : 'loading'"></uni-load-more>
    </view>
    <view class="safe-area-inset-bottom"></view>
  </view>
</template>

<script lang="ts" setup>
import { apiGetClassList, apiGetHistoryList } from "@/api/api";
import { backHome } from "@/utils/system";
import {
  onLoad,
  onReachBottom,
  onShareAppMessage,
  onShareTimeline,
  onUnload,
} from "@dcloudio/uni-app";
import { ref } from "vue";

// 获取图片详情
const imageList = ref<any>([]);

// 请求标准
const flag = ref<Boolean>(false);
// 定义data 参数
const queryParams: any = {
  pageNum: 1,
  pageSize: 12,
};

// 记录页面名称
let pageName = "";
// 获取图片详情
const getImageList = async () => {
  let res: any;
  if (queryParams.classid) {
    console.log(queryParams.type);
    res = await apiGetClassList(queryParams);
  }
  if (queryParams.type) {
    res = await apiGetHistoryList(queryParams);
  }
  // 将新老数据拼接起来
  imageList.value = [...imageList.value, ...res.data];
  uni.setStorageSync("classList", imageList.value);
  // 判断是否还有数据
  if (queryParams.pageSize > res.data.length) flag.value = true;
};

onLoad((props) => {
  const { id, name, type } = props as any;

  // // 参数有误状态
  // if (!id || !type) {
  //   backHome();
  //   return;
  // }
  if (id) queryParams.classid = id;
  if (type) queryParams.type = type;

  pageName = name;

  getImageList();
  // 请求数据
  uni.setNavigationBarTitle({
    title: name,
  });
});

// 触底刷新
onReachBottom(() => {
  if (flag.value) return;
  queryParams.pageNum++;
  getImageList();
});

onShareAppMessage(() => {
  return {
    title: pageName,
    path: `pages/classList/classList?id=${queryParams.classid}&name=${pageName}`,
  };
});
// 页面在卸载时触发
onUnload(() => {
  uni.removeStorageSync("classList");
});
</script>

<style lang="scss" scoped>
.classList {
  .content {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5rpx;
    padding: 5rpx;
    .item {
      height: 440rpx;
      image {
        height: 100%;
        width: 100%;
        display: block;
      }
    }
  }
}
</style>
