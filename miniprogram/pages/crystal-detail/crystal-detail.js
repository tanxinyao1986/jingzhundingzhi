// pages/crystal-detail/crystal-detail.js
const { getCrystalById } = require('../../utils/crystal-db');

const ELEMENT_COLORS = {
  '木': '#4CAF50',
  '火': '#FF5722',
  '土': '#FF9800',
  '金': '#FFC107',
  '水': '#2196F3',
};

const ELEMENT_EMOJIS = {
  '木': '🌿',
  '火': '🔥',
  '土': '🌾',
  '金': '✨',
  '水': '💧',
};

Page({
  data: {
    crystal: null,
    elementColor: '#D4AF37',
    elementEmoji: '✨',
  },

  onLoad(options) {
    const id = Number(options.id);
    if (!id) {
      wx.showToast({ title: '水晶信息缺失', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1200);
      return;
    }

    const crystal = getCrystalById(id);
    if (!crystal) {
      wx.showToast({ title: '未找到该水晶', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1200);
      return;
    }

    this.setData({
      crystal,
      elementColor: ELEMENT_COLORS[crystal.elementCN] || '#D4AF37',
      elementEmoji: ELEMENT_EMOJIS[crystal.elementCN] || '✨',
    });
  },
});
