<template>
  <view class="classLayout pageBg">
    <CustomNavBar :title="'分类'"></CustomNavBar>
    <view class="classify">
      <themItem
        v-for="item in classifyList"
        :item="item"
        :key="item._id"
      ></themItem>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { apiGetClassify } from "@/api/api";
import themItem from "@/components/Them-item.vue";
import CustomNavBar from "@/components/customNavBar.vue";
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";

// 分类数组
const classifyList = ref<any>([]);
// 获取专题精选
const getTheme = async () => {
  const res: any = await apiGetClassify({
    pageSize: 20,
  });
  classifyList.value = res.data;
};
onLoad(() => {
  getTheme();
});
</script>

<style lang="scss" scoped>
.classify {
  padding: 30rpx;
  display: grid;
  gap: 15rpx;
  grid-template-columns: repeat(3, 1fr);
}
</style>
