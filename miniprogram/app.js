// app.js - 水晶能量手链小程序
App({
  onLaunch() {
    // 全局数据
    this.globalData = {
      // 八字诊断结果（诊断页计算后存储，推荐页/DIY页读取）
      diagnosisResult: null,
      // 用户信息
      userInfo: null,
    };
  },

  globalData: {
    diagnosisResult: null,
    userInfo: null,
  },
});
