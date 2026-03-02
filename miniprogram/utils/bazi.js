/**
 * 八字五行诊断算法
 * 实现 PRD v1.0 - Section 3.1 描述的核心逻辑
 *
 * 计算流程：
 * 1. 公历日期 -> 八字四柱（年/月/日/时）
 * 2. 八字 8 个字 -> 五行数组
 * 3. Step1: 数量法强弱判定
 * 4. Step2: 相邻生克打分法（均衡时）
 * 5. 输出推荐五行和诊断报告
 */

// ============================================================
// 基础数据表
// ============================================================

/** 天干（10个） */
const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

/** 地支（12个） */
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

/** 天干 -> 五行 */
const STEM_ELEMENT = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水',
};

/** 地支 -> 五行 */
const BRANCH_ELEMENT = {
  '子': '水', '丑': '土',
  '寅': '木', '卯': '木',
  '辰': '土', '巳': '火',
  '午': '火', '未': '土',
  '申': '金', '酉': '金',
  '戌': '土', '亥': '水',
};

/** 五行相生顺序（生者 -> 被生者） */
const GENERATES = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };

/** 五行相克顺序（克者 -> 被克者） */
const OVERCOMES = { '木': '土', '土': '水', '水': '火', '火': '金', '金': '木' };

/** 忌神 -> 推荐（泄耗逻辑：忌X则推X所生之物） */
const AVOID_TO_RECOMMEND = {
  '木': '火',
  '火': '土',
  '土': '金',
  '金': '水',
  '水': '木',
};

/** 五行对应颜色和关键词（用于UI展示） */
const ELEMENT_META = {
  '木': { color: '#4CAF50', emoji: '🌿', desc: '生机、成长、仁爱' },
  '火': { color: '#FF5722', emoji: '🔥', desc: '热情、活力、礼仪' },
  '土': { color: '#FF9800', emoji: '🌾', desc: '稳重、信念、包容' },
  '金': { color: '#FFC107', emoji: '✨', desc: '肃穆、清洁、义气' },
  '水': { color: '#2196F3', emoji: '💧', desc: '智慧、流动、灵感' },
};

// ============================================================
// 节气近似日期表（每月节气约在几号，精度 ±1天，适用 1900-2100年）
// 对应月份：1月=小寒 2月=立春 3月=惊蛰 ... 12月=大雪
// ============================================================
const JIEQI_DAY = [6, 4, 6, 5, 6, 6, 7, 7, 8, 8, 7, 7];
//                Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec

// ============================================================
// 四柱计算
// ============================================================

/**
 * 计算儒略日数（JDN）from 公历日期
 * 用于精确计算日柱天干地支
 */
function getJDN(year, month, day) {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

/**
 * 立春修正：立春（约2月4日）前，年柱归属上一年
 */
function getEffectiveYear(year, month, day) {
  if (month < 2 || (month === 2 && day < JIEQI_DAY[1])) {
    return year - 1;
  }
  return year;
}

/**
 * 节气修正：每月节气前，月支归属上月
 * 返回月支 branchIdx（子=0, 丑=1, 寅=2, ...）
 */
function getMonthBranchIdx(month, day) {
  const jieqiDay = JIEQI_DAY[month - 1];
  if (day < jieqiDay) {
    const prev = month - 1 === 0 ? 12 : month - 1;
    return prev % 12;
  }
  return month % 12;
}

/**
 * 年柱：参照 1984年 = 甲子年，立春前归上一年
 */
function getYearPillar(year, month, day) {
  const effYear = getEffectiveYear(year, month, day);
  const stemIdx = ((effYear - 1984) % 10 + 10) % 10;
  const branchIdx = ((effYear - 1984) % 12 + 12) % 12;
  return {
    stem: STEMS[stemIdx],
    branch: BRANCHES[branchIdx],
    stemIdx,
    branchIdx,
  };
}

/**
 * 月柱
 * 月支：由节气确定（getMonthBranchIdx）
 * 月干：五虎遁年起月
 *   甲/己年 → 寅月起丙(2)  乙/庚年 → 寅月起戊(4)
 *   丙/辛年 → 寅月起庚(6)  丁/壬年 → 寅月起壬(8)
 *   戊/癸年 → 寅月起甲(0)
 */
function getMonthPillar(month, day, yearStemIdx) {
  const branchIdx = getMonthBranchIdx(month, day);
  const monthStemStartMap = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0];
  const monthStemStart = monthStemStartMap[yearStemIdx];
  const chineseMonthOffset = (branchIdx - 2 + 12) % 12;
  const stemIdx = (monthStemStart + chineseMonthOffset) % 10;

  return {
    stem: STEMS[stemIdx],
    branch: BRANCHES[branchIdx],
    stemIdx,
    branchIdx,
  };
}

/**
 * 日柱
 * 参照：JDN 2415021（1900-01-01）= 甲戌日（stem=0, branch=10）
 */
function getDayPillar(year, month, day) {
  const jdn = getJDN(year, month, day);
  const diff = jdn - 2415021;
  const stemIdx = ((diff % 10) + 10) % 10;
  const branchIdx = ((diff + 10) % 12 + 12) % 12;
  return {
    stem: STEMS[stemIdx],
    branch: BRANCHES[branchIdx],
    stemIdx,
    branchIdx,
  };
}

/**
 * 时柱
 * 时支：子(0)=23-01, 丑(1)=01-03, 寅(2)=03-05, ...
 * 时干：由日干组决定
 */
function getHourPillar(hour, dayStemIdx) {
  // 时支：hour 23 -> 子(0), hour 0 -> 子(0), hour 1-2 -> 丑(1), ...
  let branchIdx;
  if (hour === 23) {
    branchIdx = 0;
  } else {
    branchIdx = Math.floor((hour + 1) / 2) % 12;
  }

  // 时干起点（五鼠遁年起月）
  // 甲/己日 -> 子时从甲(0)
  // 乙/庚日 -> 子时从丙(2)
  // 丙/辛日 -> 子时从戊(4)
  // 丁/壬日 -> 子时从庚(6)
  // 戊/癸日 -> 子时从壬(8)
  const hourStemStartMap = [0, 2, 4, 6, 8, 0, 2, 4, 6, 8];
  const hourStemStart = hourStemStartMap[dayStemIdx];
  const stemIdx = (hourStemStart + branchIdx) % 10;

  return {
    stem: STEMS[stemIdx],
    branch: BRANCHES[branchIdx],
    stemIdx,
    branchIdx,
  };
}

// ============================================================
// 核心对外接口
// ============================================================

/**
 * 获取八字四柱
 * @param {number} year  - 公历年
 * @param {number} month - 公历月 (1-12)
 * @param {number} day   - 公历日
 * @param {number} hour  - 时辰（小时, 0-23）
 * @returns {{ yearPillar, monthPillar, dayPillar, hourPillar, baZiChars }}
 */
function getBaZi(year, month, day, hour) {
  const yearPillar = getYearPillar(year, month, day);
  const monthPillar = getMonthPillar(month, day, yearPillar.stemIdx);
  const dayPillar = getDayPillar(year, month, day);
  const hourPillar = getHourPillar(hour, dayPillar.stemIdx);

  // 八字字符数组（顺序：年干、年支、月干、月支、日干、日支、时干、时支）
  const baZiChars = [
    yearPillar.stem, yearPillar.branch,
    monthPillar.stem, monthPillar.branch,
    dayPillar.stem, dayPillar.branch,
    hourPillar.stem, hourPillar.branch,
  ];

  return { yearPillar, monthPillar, dayPillar, hourPillar, baZiChars };
}

/**
 * 将八字字符数组转换为五行数组
 * @param {string[]} baZiChars - 8个汉字
 * @returns {string[]} 8个五行元素
 */
function getFiveElements(baZiChars) {
  return baZiChars.map((char, idx) => {
    // 0,2,4,6 是天干；1,3,5,7 是地支
    if (idx % 2 === 0) {
      return STEM_ELEMENT[char] || '未知';
    } else {
      return BRANCH_ELEMENT[char] || '未知';
    }
  });
}

/**
 * 统计五行个数
 */
function countElements(elements) {
  const counts = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 };
  elements.forEach(e => { if (counts[e] !== undefined) counts[e]++; });
  return counts;
}

/**
 * Step1: 数量法强弱判定
 * 若任何五行 >= 3，则该五行为强忌神
 * 若两个五行同时 >= 3，取通关五行（两者相生之中间环节）
 * @returns {{ found: boolean, avoidElement: string|null, twoStrong: string[]|null }}
 */
function step1_CountMethod(counts) {
  const strongElements = Object.keys(counts).filter(e => counts[e] >= 3);

  if (strongElements.length === 0) {
    return { found: false, avoidElement: null };
  }

  if (strongElements.length === 1) {
    return { found: true, avoidElement: strongElements[0] };
  }

  // 两个五行都 >= 3，取通关五行（两者相生的中间产物）
  // 例：木强+火强 -> 木生火，火生土 -> 推土（通关）
  const [elA, elB] = strongElements.slice(0, 2);
  // elA 生 elB 的情况：通关为 elB 所生
  if (GENERATES[elA] === elB) {
    return { found: true, avoidElement: null, twoStrong: strongElements, throughElement: GENERATES[elB] };
  } else if (GENERATES[elB] === elA) {
    return { found: true, avoidElement: null, twoStrong: strongElements, throughElement: GENERATES[elA] };
  } else {
    // 没有直接相生关系，取得分最高的
    return { found: true, avoidElement: elA };
  }
}

/**
 * Step2: 相邻生克打分法（用于均衡八字）
 * @returns {{ scores: object, weakestAvoidElement: string }}
 */
function step2_ScoreMethod(elements) {
  const scores = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 };

  for (let i = 0; i < elements.length - 1; i++) {
    const A = elements[i];
    const B = elements[i + 1];

    if (GENERATES[A] === B) {
      // A 生 B：B 受生得 +2，A 泄出 -1
      scores[B] += 2;
      scores[A] -= 1;
    } else if (OVERCOMES[A] === B) {
      // A 克 B：A 克出 -1，B 受克 -2
      scores[A] -= 1;
      scores[B] -= 2;
    }
    // 相同五行：不变
  }

  // 得分最高的为局中力量最强 -> 弱忌神
  let maxScore = -Infinity;
  let avoidElement = '木';
  for (const [el, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      avoidElement = el;
    }
  }

  return { scores, avoidElement };
}

/**
 * 主诊断函数 - 实现 PRD 3.1 完整逻辑
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @param {number} hour
 * @returns {DiagnosisResult}
 */
function diagnose(year, month, day, hour) {
  // === 第一步：计算八字 ===
  const { yearPillar, monthPillar, dayPillar, hourPillar, baZiChars } = getBaZi(year, month, day, hour);

  // === 第二步：转换五行 ===
  const fiveElements = getFiveElements(baZiChars);
  const counts = countElements(fiveElements);

  // === 第三步：日主（日干所属五行）- 辅运灵宝 ===
  const assistElement = STEM_ELEMENT[dayPillar.stem];

  // === 第四步：判定忌神 ===
  let avoidElement = null;
  let method = '';
  let methodDetail = '';
  let throughElement = null;

  const step1Result = step1_CountMethod(counts);

  if (step1Result.found) {
    if (step1Result.throughElement) {
      // 双强通关
      avoidElement = step1Result.throughElement;
      method = '双强通关法';
      methodDetail = `${step1Result.twoStrong.join('、')}五行均偏旺（各≥3），取通关五行：${avoidElement}`;
    } else {
      avoidElement = step1Result.avoidElement;
      method = '数量强弱法';
      methodDetail = `${avoidElement}五行数量达${counts[avoidElement]}个，偏旺为忌神`;
    }
  } else {
    // Step2：相邻生克打分法
    const step2Result = step2_ScoreMethod(fiveElements);
    avoidElement = step2Result.avoidElement;
    method = '生克打分法';
    methodDetail = `五行均衡，${avoidElement}在生克交互中局中力量最强（得分：${step2Result.scores[avoidElement]}），为弱忌神`;
  }

  // === 第五步：推荐五行（泄耗忌神） ===
  const mainElement = AVOID_TO_RECOMMEND[avoidElement];

  // === 第六步：生成诊断报告 ===
  const elementMeta = ELEMENT_META[avoidElement] || {};
  const mainMeta = ELEMENT_META[mainElement] || {};
  const assistMeta = ELEMENT_META[assistElement] || {};

  const diagnosisReport = generateReport({
    avoidElement, mainElement, assistElement,
    counts, method, yearPillar, monthPillar, dayPillar, hourPillar,
  });

  return {
    // 八字信息
    baZiChars,
    baZiString: `${yearPillar.stem}${yearPillar.branch}年 ${monthPillar.stem}${monthPillar.branch}月 ${dayPillar.stem}${dayPillar.branch}日 ${hourPillar.stem}${hourPillar.branch}时`,
    pillars: { yearPillar, monthPillar, dayPillar, hourPillar },

    // 五行分析
    fiveElements,
    counts,

    // 核心推荐
    avoidElement,     // 忌神
    mainElement,      // 调运灵宝（主推）
    assistElement,    // 辅运灵宝（日主）

    // 判断方法
    method,
    methodDetail,

    // 文案
    diagnosisReport,

    // 元数据
    elementMeta: {
      avoid: ELEMENT_META[avoidElement],
      main: ELEMENT_META[mainElement],
      assist: ELEMENT_META[assistElement],
    },
  };
}

/**
 * 生成诊断文案报告
 */
function generateReport({ avoidElement, mainElement, assistElement, counts, method, dayPillar }) {
  const avoidVerb = { '木': '旺盛', '火': '炎热', '土': '厚重', '金': '肃杀', '水': '泛滥' };
  const mainAction = { '木': '生发木气', '火': '引导热能', '土': '沉淀厚实', '金': '收敛净化', '水': '滋润流动' };

  const elementToNature = {
    '木': '生机蓬勃', '火': '热情涌动', '土': '沉稳厚重',
    '金': '清冽锋锐', '水': '灵动深邃',
  };

  const recommendDesc = {
    '木': '土属性',
    '火': '土属性',
    '土': '金属性',
    '金': '水属性',
    '水': '木属性',
  };

  const dayElement = STEM_ELEMENT[dayPillar.stem];
  const dayDesc = elementToNature[dayElement] || '';

  return `您的命盘中，日主「${dayPillar.stem}」属${dayElement}，${dayDesc}之气为您的本命能量。` +
    `八字局中${avoidElement}能量${avoidVerb[avoidElement] || '偏强'}，` +
    `建议以${mainElement}属性水晶来疏通泄耗${avoidElement}气，平衡整体能量场。` +
    `✦ 调运灵宝（主石）：${mainElement}属性水晶，以${mainAction[mainElement] || '调和五行'}。` +
    `✦ 辅运灵宝（副石）：${assistElement}属性水晶，强化日主本命能量。` +
    `\n⚠️ 能量辅助，非医疗建议。`;
}

// ============================================================
// 导出
// ============================================================

module.exports = {
  getBaZi,
  getFiveElements,
  diagnose,
  ELEMENT_META,
  STEMS,
  BRANCHES,
  STEM_ELEMENT,
  BRANCH_ELEMENT,
  GENERATES,
  OVERCOMES,
  AVOID_TO_RECOMMEND,
};
