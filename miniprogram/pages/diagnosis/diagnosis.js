// pages/diagnosis/diagnosis.js
const { diagnose, ELEMENT_META } = require('../../utils/bazi');

// 时辰列表（供 picker 显示）
const HOUR_RANGE = [
  '子时 (23:00-00:59)',
  '丑时 (01:00-02:59)',
  '寅时 (03:00-04:59)',
  '卯时 (05:00-06:59)',
  '辰时 (07:00-08:59)',
  '巳时 (09:00-10:59)',
  '午时 (11:00-12:59)',
  '未时 (13:00-14:59)',
  '申时 (15:00-16:59)',
  '酉时 (17:00-18:59)',
  '戌时 (19:00-20:59)',
  '亥时 (21:00-22:59)',
];

// 时辰索引 -> 代表小时
const HOUR_IDX_TO_HOUR = [23, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21];

// 元素颜色表
const ELEMENT_COLORS = {
  '木': '#4CAF50',
  '火': '#FF5722',
  '土': '#FF9800',
  '金': '#FFC107',
  '水': '#2196F3',
};

function buildYearRange() {
  const years = [];
  const currentYear = new Date().getFullYear();
  for (let y = 1920; y <= currentYear; y++) years.push(String(y));
  return years;
}

function buildMonthRange() {
  return Array.from({ length: 12 }, (_, i) => `${i + 1}`);
}

function buildDayRange(year, month) {
  const days = new Date(year, month, 0).getDate(); // month 是 1-indexed
  return Array.from({ length: days }, (_, i) => `${i + 1}`);
}

Page({
  data: {
    calendarType: 'solar',

    yearRange: buildYearRange(),
    monthRange: buildMonthRange(),
    dayRange: buildDayRange(1990, 1),
    hourRange: HOUR_RANGE,

    birthYear: 1990,
    birthMonth: 1,
    birthDay: 1,
    yearIdx: 70,   // 1990 - 1920
    monthIdx: 0,
    dayIdx: 0,
    hourIdx: 6,    // 默认午时

    unknownHour: false,
    isLoading: false,

    result: null,
    pillarsDisplay: [],
    elementCounts: [],
    mainElementMeta: {},
    assistElementMeta: {},
  },

  onLoad() {
    // 默认设置为今年
    const now = new Date();
    const currentYear = now.getFullYear();
    const yearIdx = currentYear - 1920;
    this.setData({
      birthYear: currentYear,
      yearIdx: Math.min(Math.max(yearIdx, 0), buildYearRange().length - 1),
    });
  },

  switchCalendar(e) {
    this.setData({ calendarType: e.currentTarget.dataset.type });
  },

  onYearChange(e) {
    const idx = Number(e.detail.value);
    const year = 1920 + idx;
    const dayRange = buildDayRange(year, this.data.birthMonth);
    this.setData({
      yearIdx: idx,
      birthYear: year,
      dayRange,
      dayIdx: Math.min(this.data.dayIdx, dayRange.length - 1),
      birthDay: Math.min(this.data.birthDay, dayRange.length),
    });
  },

  onMonthChange(e) {
    const idx = Number(e.detail.value);
    const month = idx + 1;
    const dayRange = buildDayRange(this.data.birthYear, month);
    this.setData({
      monthIdx: idx,
      birthMonth: month,
      dayRange,
      dayIdx: Math.min(this.data.dayIdx, dayRange.length - 1),
      birthDay: Math.min(this.data.birthDay, dayRange.length),
    });
  },

  onDayChange(e) {
    const idx = Number(e.detail.value);
    this.setData({ dayIdx: idx, birthDay: idx + 1 });
  },

  onHourChange(e) {
    this.setData({ hourIdx: Number(e.detail.value) });
  },

  toggleUnknownHour() {
    const unknownHour = !this.data.unknownHour;
    this.setData({
      unknownHour,
      hourIdx: unknownHour ? 6 : this.data.hourIdx, // 正午=午时(idx=6)
    });
  },

  onCalculate() {
    this.setData({ isLoading: true });

    // 获取输入
    const { birthYear, birthMonth, birthDay, hourIdx, unknownHour } = this.data;
    const hour = unknownHour ? 12 : HOUR_IDX_TO_HOUR[hourIdx];

    // 短暂延迟以显示 loading 状态
    setTimeout(() => {
      try {
        const result = diagnose(birthYear, birthMonth, birthDay, hour);

        // ======================================================
        // 控制台输出 - 方便调试验证
        // ======================================================
        console.log('========= 八字五行推算结果 =========');
        console.log(`输入: ${birthYear}年${birthMonth}月${birthDay}日 ${hour}时`);
        console.log(`四柱: ${result.baZiString}`);
        console.log(`八字: [${result.baZiChars.join(', ')}]`);
        console.log(`五行: [${result.fiveElements.join(', ')}]`);
        console.log('五行统计:', result.counts);
        console.log(`判定方法: ${result.method}`);
        console.log(`方法详情: ${result.methodDetail}`);
        console.log(`忌神: ${result.avoidElement}`);
        console.log(`调运灵宝 (主推): ${result.mainElement} 属性水晶`);
        console.log(`辅运灵宝 (日主): ${result.assistElement} 属性水晶`);
        console.log('诊断报告:', result.diagnosisReport);
        console.log('====================================');

        // 构建四柱展示数据
        const { yearPillar, monthPillar, dayPillar, hourPillar } = result.pillars;
        const STEM_EL = require('../../utils/bazi').STEM_ELEMENT;
        const BRANCH_EL = require('../../utils/bazi').BRANCH_ELEMENT;

        const pillarsDisplay = [
          {
            label: '年', stem: yearPillar.stem, branch: yearPillar.branch,
            stemElement: STEM_EL[yearPillar.stem],
            branchElement: BRANCH_EL[yearPillar.branch],
            elementColor: ELEMENT_COLORS[STEM_EL[yearPillar.stem]],
            branchElementColor: ELEMENT_COLORS[BRANCH_EL[yearPillar.branch]],
          },
          {
            label: '月', stem: monthPillar.stem, branch: monthPillar.branch,
            stemElement: STEM_EL[monthPillar.stem],
            branchElement: BRANCH_EL[monthPillar.branch],
            elementColor: ELEMENT_COLORS[STEM_EL[monthPillar.stem]],
            branchElementColor: ELEMENT_COLORS[BRANCH_EL[monthPillar.branch]],
          },
          {
            label: '日', stem: dayPillar.stem, branch: dayPillar.branch,
            stemElement: STEM_EL[dayPillar.stem],
            branchElement: BRANCH_EL[dayPillar.branch],
            elementColor: ELEMENT_COLORS[STEM_EL[dayPillar.stem]],
            branchElementColor: ELEMENT_COLORS[BRANCH_EL[dayPillar.branch]],
          },
          {
            label: '时', stem: hourPillar.stem, branch: hourPillar.branch,
            stemElement: STEM_EL[hourPillar.stem],
            branchElement: BRANCH_EL[hourPillar.branch],
            elementColor: ELEMENT_COLORS[STEM_EL[hourPillar.stem]],
            branchElementColor: ELEMENT_COLORS[BRANCH_EL[hourPillar.branch]],
          },
        ];

        // 构建五行分布数据
        const total = result.fiveElements.length || 1;
        const elementCounts = ['木', '火', '土', '金', '水'].map(name => {
          const count = result.counts[name] || 0;
          const meta = ELEMENT_META[name] || {};
          return {
            name,
            count,
            emoji: meta.emoji || '·',
            color: ELEMENT_COLORS[name] || '#ccc',
            percent: Math.round((count / total) * 100),
          };
        });

        this.setData({
          result,
          pillarsDisplay,
          elementCounts,
          mainElementMeta: {
            ...ELEMENT_META[result.mainElement],
            color: ELEMENT_COLORS[result.mainElement],
          },
          assistElementMeta: {
            ...ELEMENT_META[result.assistElement],
            color: ELEMENT_COLORS[result.assistElement],
          },
          isLoading: false,
        });

        // 存储到全局，供推荐页使用
        const app = getApp();
        app.globalData = app.globalData || {};
        app.globalData.diagnosisResult = result;

      } catch (err) {
        console.error('推算失败:', err);
        this.setData({ isLoading: false });
        wx.showToast({ title: '推算出错，请重试', icon: 'none' });
      }
    }, 600);
  },

  goToRecommendation() {
    wx.navigateTo({
      url: '/pages/recommendation/recommendation',
    });
  },
});
