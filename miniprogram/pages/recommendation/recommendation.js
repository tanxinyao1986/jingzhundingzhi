// pages/recommendation/recommendation.js
const { getCrystalsByElement } = require('../../utils/crystal-db');

const ELEMENT_COLORS = {
  '木': '#4CAF50', '火': '#FF5722', '土': '#FF9800', '金': '#FFC107', '水': '#2196F3',
};
const ELEMENT_EMOJIS = {
  '木': '🌿', '火': '🔥', '土': '🌾', '金': '✨', '水': '💧',
};

Page({
  data: {
    mainElement: '',
    assistElement: '',
    mainElementColor: '#D4AF37',
    mainElementEmoji: '✨',
    mainCrystals: [],
    assistCrystals: [],
  },

  onLoad() {
    const app = getApp();
    const result = app.globalData && app.globalData.diagnosisResult;

    if (!result) {
      wx.showToast({ title: '请先完成八字诊断', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }

    const { mainElement, assistElement } = result;
    const mainCrystals = getCrystalsByElement(mainElement);
    const assistCrystals = getCrystalsByElement(assistElement).filter(
      c => !mainCrystals.find(m => m.id === c.id)
    );

    this.setData({
      mainElement,
      assistElement,
      mainElementColor: ELEMENT_COLORS[mainElement] || '#D4AF37',
      mainElementEmoji: ELEMENT_EMOJIS[mainElement] || '✨',
      mainCrystals: mainCrystals.slice(0, 3),
      assistCrystals: assistCrystals.slice(0, 2),
    });
  },

  onCrystalTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/crystal-detail/crystal-detail?id=${id}` });
  },

  goToDiy() {
    wx.switchTab({ url: '/pages/diy/diy' });
  },
});
