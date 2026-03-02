// pages/index/index.js
const { ELEMENT_META } = require('../../utils/bazi');

// 每日能量签内容库
const DAILY_SIGNS = {
  '木': [
    '今日木气生发，适合启动新计划、种下心中的种子。绿色能量为你护航，行动即是最好的祈愿。',
    '林木之气环绕，创意与灵感如春风般涌来。今日适合记录想法、与自然亲近。',
  ],
  '火': [
    '今日火气旺盛，热情与行动力达到峰值。把握时机，大胆表达，你的光芒无可阻挡。',
    '红色能量燃烧，是突破瓶颈的绝佳时机。相信直觉，全力以赴，结果往往超乎想象。',
  ],
  '土': [
    '今日土气稳厚，适合沉淀、整理与规划。大地之母的能量为你托底，脚踏实地即能走得长远。',
    '黄色能量凝聚，财运与信任度提升。适合处理重要事务、建立长期关系。',
  ],
  '金': [
    '今日金气清肃，直觉敏锐，洞察力超群。适合做决策、清理旧事、开启新的思维格局。',
    '白色能量净化场域，适合冥想、整理空间与内心。清净之中，答案自然浮现。',
  ],
  '水': [
    '今日水气流动，智慧与灵感如泉涌出。适合学习、创作与深度思考，让思绪随意流淌。',
    '蓝色能量深邃，适合内省与沟通。真诚的表达将为你打开意想不到的门。',
  ],
};

const ELEMENT_CRYSTALS = {
  '木': '绿幽灵水晶',
  '火': '石榴石',
  '土': '黄水晶',
  '金': '白水晶',
  '水': '海蓝宝',
};

const ELEMENTS = ['木', '火', '土', '金', '水'];

Page({
  data: {
    todayDate: '',
    dailySign: {
      element: '木',
      elementEmoji: '🌿',
      content: '',
      crystal: '',
    },
  },

  onLoad() {
    this.setTodayDate();
    this.refreshDailySign();
  },

  setTodayDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    const weekday = weekdays[now.getDay()];
    this.setData({
      todayDate: `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')} 星期${weekday}`,
    });
  },

  refreshDailySign() {
    // 基于当日日期种子选取能量（保证同一天相同结果）
    const now = new Date();
    const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
    const elementIdx = seed % 5;
    const element = ELEMENTS[elementIdx];
    const meta = ELEMENT_META[element] || { emoji: '✨' };
    const signs = DAILY_SIGNS[element] || ['今日能量平和，顺势而为即是最好的安排。'];
    const signIdx = (seed >> 1) % signs.length;

    this.setData({
      dailySign: {
        element,
        elementEmoji: meta.emoji,
        content: signs[signIdx],
        crystal: ELEMENT_CRYSTALS[element] || '白水晶',
      },
    });
  },

  goToDiagnosis() {
    wx.switchTab({
      url: '/pages/diagnosis/diagnosis',
    });
  },

  goToDiy() {
    wx.switchTab({
      url: '/pages/diy/diy',
    });
  },

  goToChakra() {
    // 脉轮定制 - 暂时跳转到诊断页，后续单独实现
    wx.showToast({
      title: '脉轮定制即将上线',
      icon: 'none',
      duration: 2000,
    });
  },
});
