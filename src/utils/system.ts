// 获取状态栏高度
const SYSTEM_INFO = uni.getSystemInfoSync();
export const getStatusBarHeight = () => SYSTEM_INFO.statusBarHeight || 15;

// 计算胶囊按钮的高度
export const getTitleBarHeight = () => {
  const menuButtonInfo = uni.getMenuButtonBoundingClientRect
    ? uni.getMenuButtonBoundingClientRect()
    : null;
  if (menuButtonInfo) {
    const { top, height } = uni.getMenuButtonBoundingClientRect();
    return height + (top - getStatusBarHeight()) * 2;
  } else {
    return 40;
  }
};

// 计算需要填充的高度
export const getPaddingTop = () => getStatusBarHeight() + getTitleBarHeight();

// 适配今日头条
export const getLeftMargin = () => {
  // #ifdef  MP-TOUTIAO
  let {
    leftIcon: { left, width },
  } = tt.getCustomButtonBoundingClientRect();
  return left + width;
  // #endif
  // #ifndef MP-TOUTIAO
  return 0;
  // #endif
};

// 获取图片信息
export const getImageInfo = (path: string, callback: any) => {
  uni.getImageInfo({
    src: path,
    success: (res) => {
      let temPath = res.path;
      callback(temPath);
    },
  });
};

// 保存图像
export const saveImage = (temPath: string) => {
  uni.saveImageToPhotosAlbum({
    filePath: temPath,
    success: () => {
      uni.showToast({
        title: "保存成功",
        icon: "none",
      });
    },
    fail: (err) => {
      if (err.errMsg === "saveImageToPhotosAlbum:fail cancel") {
        uni.showToast({
          title: "保存失败",
          icon: "none",
        });
        return;
      }
      if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
        // 授权函数
        requestAuthorization();
      }
    },
    complete: () => {
      uni.hideLoading();
    },
  });
};

export const requestAuthorization = () => {
  // 掉用授权
  uni.showModal({
    title: "授权提示",
    content: "需要授权保存相册",
    success: (res) => {
      if (res.confirm) {
        uni.openSetting({
          success: (setting) => {
            console.log(setting);
            if (setting.authSetting["scope.writePhotosAlbum"]) {
              uni.showToast({
                title: "获取授权成功",
                icon: "none",
              });
            } else {
              uni.showToast({
                title: "获取权限失败",
                icon: "none",
              });
            }
          },
        });
      }
    },
  });
};

// 返回首页
export const backHome = () => {
  uni.showModal({
    title: "提示",
    content: "参数有误",
    showCancel: false,
    success: (res) => {
      if (res.confirm) {
        uni.switchTab({
          url: "/pages/index/index",
        });
      }
    },
  });
};
