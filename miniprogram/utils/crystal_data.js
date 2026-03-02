/**
 * 水晶数据库
 * 共 36 种水晶，按五行分类
 *
 * 字段说明：
 *   id            — 唯一标识
 *   name          — 水晶名称
 *   element       — 主五行（用于分类展示）
 *   elements      — 所有适用五行（跨类推荐时使用）
 *   keywords      — 能量关键词数组
 *   elementDesc   — 五行属性描述（含兼属说明）
 *   suitableFor   — 适合人群
 *   chakra        — 对应脉轮
 *   chakraEffects — 脉轮功效列表（频率支持 / 情绪辅助 / 能量陪伴，不夸大疗效）
 *   image         — 图片路径（需将素材放至 miniprogram/images/crystals/<五行>/）
 *
 * 注：黄阿塞 / 金发晶 属土金双性，element 主归土，elements 含 ['土','金']
 */

const CRYSTAL_DATA = [

  // ============================================================
  // 🔥 火 — 9 种
  // ============================================================

  {
    id: 'rose-quartz',
    name: '粉水晶',
    element: '火',
    elements: ['火'],
    keywords: ['爱的频率', '情感疗愈', '温柔', '心轮舒展', '自我接纳'],
    elementDesc: '偏火（心之温热）\n兼具少量土性（包容滋养）',
    suitableFor: '感情不顺、内心封闭、需要情绪陪伴与自我接纳的人',
    chakra: '心轮',
    chakraEffects: [
      '辅助软化心防，支持接纳自我的情绪频率',
      '营造温柔平和的能量场',
      '陪伴情感疗愈的过程',
    ],
    image: '/images/crystals/火/粉水晶珠子特写.png',
  },

  {
    id: 'red-strawberry-quartz',
    name: '红草莓晶',
    element: '火',
    elements: ['火'],
    keywords: ['活力', '热情', '行动频率', '生命力', '积极能量'],
    elementDesc: '纯火（阳火激发）',
    suitableFor: '行动力不足、情绪消沉、需要能量陪伴与活力支持的人',
    chakra: '根轮 / 心轮',
    chakraEffects: [
      '支持行动力与积极情绪的频率',
      '辅助增强对生活的热情感知',
      '营造充满活力的能量氛围',
    ],
    image: '/images/crystals/火/红草莓晶珠子特写.png',
  },

  {
    id: 'red-liuli',
    name: '红香灰琉璃',
    element: '火',
    elements: ['火'],
    keywords: ['守护', '辟邪', '热情', '意志频率', '转化能量'],
    elementDesc: '偏火（炼制之火，含香灰加持）',
    suitableFor: '需要守护陪伴、精神不振、意志力需要支撑的人',
    chakra: '根轮 / 腹轮',
    chakraEffects: [
      '辅助净化周边能量场',
      '支持意志力与热情的情绪频率',
      '提供守护感的能量陪伴',
    ],
    image: '/images/crystals/火/红香灰琉璃.png',
  },

  {
    id: 'red-carnelian',
    name: '红玉髓',
    element: '火',
    elements: ['火'],
    keywords: ['勇气', '创造力', '活力', '自信频率', '果断'],
    elementDesc: '纯火（烈火之性）',
    suitableFor: '优柔寡断、缺乏自信、创造力受阻的人',
    chakra: '腹轮 / 根轮',
    chakraEffects: [
      '支持创造力与热情的能量频率',
      '辅助勇气与自信的情绪状态',
      '陪伴行动力的唤醒过程',
    ],
    image: '/images/crystals/火/红玉髓珠子特写.png',
  },

  {
    id: 'sunstone',
    name: '太阳石',
    element: '火',
    elements: ['火'],
    keywords: ['喜悦', '丰盛频率', '个人魅力', '光明', '正向能量'],
    elementDesc: '纯火（太阳之光火）\n兼具少量金性（光泽内蕴）',
    suitableFor: '情绪低落、缺乏动力、需要正向能量陪伴的人',
    chakra: '太阳神经丛轮 / 腹轮',
    chakraEffects: [
      '支持积极喜悦的情绪频率',
      '辅助个人魅力与领导感知的能量场',
      '陪伴走出低迷期的能量转换',
    ],
    image: '/images/crystals/火/太阳石珠子特写.png',
  },

  {
    id: 'uruguayan-amethyst',
    name: '乌拉圭紫水晶',
    element: '火',
    elements: ['火'],
    keywords: ['直觉', '清醒', '情绪净化', '精神专注', '高频陪伴'],
    elementDesc: '偏火（灵性之火）\n兼具少量水性（情绪流动）',
    suitableFor: '情绪容易焦躁、思绪混乱、想提升专注力与灵感的人',
    chakra: '顶轮 / 眉心轮',
    chakraEffects: [
      '支持直觉与清醒感知的能量频率',
      '辅助情绪净化与专注状态',
      '陪伴精神场的稳定',
    ],
    image: '/images/crystals/火/乌拉圭紫水晶珠子特写.png',
  },

  {
    id: 'kunzite',
    name: '紫锂辉',
    element: '火',
    elements: ['火'],
    keywords: ['温柔之爱', '心轮疗愈', '情感平静', '灵性频率', '内在温暖'],
    elementDesc: '偏火（温柔灵性之火）\n兼具少量水性（情感流动）',
    suitableFor: '内心创伤深、情感脆弱、需要温柔能量陪伴的人',
    chakra: '心轮 / 顶轮',
    chakraEffects: [
      '支持情感疗愈过程的温柔频率',
      '辅助心轮开放与内在温暖感知',
      '陪伴灵性成长与宁静',
    ],
    image: '/images/crystals/火/紫锂辉珠子特写.png',
  },

  {
    id: 'purple-fluorite',
    name: '紫莹石',
    element: '火',
    elements: ['火'],
    keywords: ['净化', '专注', '思维秩序', '空间频率', '清明'],
    elementDesc: '偏火（灵火净化）\n兼具金性（肃穆清净）',
    suitableFor: '思维散乱、注意力不集中、工作效率低下的人',
    chakra: '眉心轮 / 顶轮',
    chakraEffects: [
      '支持空间与气场的净化频率',
      '辅助专注力与清晰思维的情绪状态',
      '陪伴思维秩序的恢复',
    ],
    image: '/images/crystals/火/紫莹石单珠特写.png',
  },

  {
    id: 'purple-chalcedony',
    name: '紫玉髓',
    element: '火',
    elements: ['火'],
    keywords: ['直觉', '安抚', '灵感频率', '内在宁静', '温和陪伴'],
    elementDesc: '偏火（柔和灵火）\n兼具少量水性（安抚情绪）',
    suitableFor: '焦虑敏感、直觉受阻、需要情绪稳定与内心平和的人',
    chakra: '眉心轮 / 喉轮',
    chakraEffects: [
      '支持情绪安抚与平和的能量频率',
      '辅助直觉与灵感的感知状态',
      '陪伴内心走向持续平和',
    ],
    image: '/images/crystals/火/紫玉髓珠子特写.png',
  },

  // ============================================================
  // ✨ 金 — 5 种（黄阿塞 / 金发晶 归于土，兼属金）
  // ============================================================

  {
    id: 'white-agate',
    name: '白阿塞',
    element: '金',
    elements: ['金'],
    keywords: ['纯净', '清明', '新生频率', '平静', '净化'],
    elementDesc: '纯金（清净之金）',
    suitableFor: '杂念过多、心绪不宁、需要情绪净化与重新出发的人',
    chakra: '顶轮 / 眉心轮',
    chakraEffects: [
      '支持思维与气场净化的频率',
      '辅助内心宁静与清醒的情绪状态',
      '陪伴明辨力的提升',
    ],
    image: '/images/crystals/金/白阿塞珠子特写.png',
  },

  {
    id: 'clear-quartz',
    name: '白水晶',
    element: '金',
    elements: ['金'],
    keywords: ['能量放大', '清晰频率', '净化', '意念支持', '通用之石'],
    elementDesc: '纯金（至纯透明之气）',
    suitableFor: '所有人；尤其需要净化气场、放大意念频率的人',
    chakra: '所有脉轮（尤其顶轮）',
    chakraEffects: [
      '辅助放大与净化全身能量场的频率',
      '支持与其他水晶的协同能量',
      '陪伴意念清晰化的过程',
    ],
    image: '/images/crystals/金/白水晶珠子特写.png',
  },

  {
    id: 'white-liuli',
    name: '白香灰琉璃',
    element: '金',
    elements: ['金'],
    keywords: ['洁净', '守护', '辟邪', '安神频率', '神圣陪伴'],
    elementDesc: '纯金（殿堂净气，含香灰加持）',
    suitableFor: '需要守护陪伴、气场混乱、频繁接触负能量的人',
    chakra: '顶轮 / 眉心轮',
    chakraEffects: [
      '支持气场净化与守护感的能量频率',
      '辅助安神与平静的情绪状态',
      '提供神圣加持的能量陪伴',
    ],
    image: '/images/crystals/金/白香灰琉璃.png',
  },

  {
    id: 'himalayan-quartz',
    name: '喜马拉雅水晶',
    element: '金',
    elements: ['金'],
    keywords: ['高频陪伴', '灵性连接', '纯粹', '冥想频率', '神圣守护'],
    elementDesc: '纯金（山岳灵气，极地纯净之力）',
    suitableFor: '冥想修行者、需要提升能量感知、寻求灵性成长的人',
    chakra: '顶轮 / 灵魂之星轮',
    chakraEffects: [
      '支持高频冥想与灵性感知的能量频率',
      '辅助深层意识净化的过程',
      '陪伴灵性成长之路',
    ],
    image: '/images/crystals/金/喜马拉雅水晶珠子特写.png',
  },

  {
    id: 'silver-sheen-stone',
    name: '银耀石',
    element: '金',
    elements: ['金'],
    keywords: ['直觉频率', '内在转化', '守护', '神秘感知', '蜕变陪伴'],
    elementDesc: '偏金（月华银光，内蕴幻变）\n兼具少量水性（灵性流动）',
    suitableFor: '直觉迟钝、处于人生转变期、需要守护陪伴的人',
    chakra: '眉心轮 / 喉轮',
    chakraEffects: [
      '支持直觉与内在感知的能量频率',
      '辅助人生转变期的情绪稳定',
      '陪伴内在蜕变与更新的过程',
    ],
    image: '/images/crystals/金/银耀石珠子特写.png',
  },

  // ============================================================
  // 🌿 木 — 6 种
  // ============================================================

  {
    id: 'aventurine',
    name: '东陵玉',
    element: '木',
    elements: ['木'],
    keywords: ['生长频率', '顺畅', '新生', '开放', '积极流动'],
    elementDesc: '纯木（生木之气，自然生机）',
    suitableFor: '发展受阻、情绪固化、需要顺畅能量陪伴的人',
    chakra: '心轮',
    chakraEffects: [
      '支持生长与顺畅发展的能量频率',
      '辅助对新事物开放的情绪状态',
      '陪伴各方面流动与前进',
    ],
    image: '/images/crystals/木/东陵玉珠子特写.png',
  },

  {
    id: 'malachite',
    name: '孔雀石',
    element: '木',
    elements: ['木'],
    keywords: ['蜕变', '守护', '情感疗愈', '净化频率', '内在成长'],
    elementDesc: '纯木（生旺之木，蓬勃生命力）',
    suitableFor: '正在经历人生转变、需要内在成长与情绪清理的人',
    chakra: '心轮 / 太阳神经丛轮',
    chakraEffects: [
      '支持内在转化过程的能量频率',
      '辅助情绪净化与自我更新',
      '陪伴面对变化时的情绪勇气',
    ],
    image: '/images/crystals/木/孔雀石珠子特写.png',
  },

  {
    id: 'blue-chalcedony',
    name: '蓝玉髓',
    element: '木',
    elements: ['木'],
    keywords: ['沟通频率', '平和', '表达', '温柔', '人际和谐'],
    elementDesc: '偏木（春木之性，向上舒展）\n兼具少量水性（沟通流动）',
    suitableFor: '沟通障碍、表达困难、渴望平和人际关系的人',
    chakra: '喉轮 / 心轮',
    chakraEffects: [
      '支持顺畅表达的能量频率',
      '辅助平和沟通的情绪状态',
      '陪伴人际和谐的建立',
    ],
    image: '/images/crystals/木/蓝玉髓珠子特写.png',
  },

  {
    id: 'green-strawberry-quartz',
    name: '绿草莓晶',
    element: '木',
    elements: ['木'],
    keywords: ['疗愈', '生长', '爱的频率', '活力', '自然连接'],
    elementDesc: '纯木（生发之木，疗愈之力）',
    suitableFor: '心轮堵塞、与自然失连、需要疗愈能量陪伴的人',
    chakra: '心轮 / 上心轮',
    chakraEffects: [
      '支持心轮疗愈过程的能量频率',
      '辅助内在生长感知的情绪状态',
      '陪伴与自然重新连接',
    ],
    image: '/images/crystals/木/绿草莓晶珠子特写.png',
  },

  {
    id: 'green-liuli',
    name: '绿香灰琉璃',
    element: '木',
    elements: ['木'],
    keywords: ['生机', '繁盛频率', '健康能量', '守护', '木火交融'],
    elementDesc: '纯木（炼制之木，含香灰加持）',
    suitableFor: '身心活力不足、发展受阻、需要守护与能量陪伴的人',
    chakra: '心轮 / 太阳神经丛轮',
    chakraEffects: [
      '支持生命活力与健康感知的能量频率',
      '辅助事业能量场的稳定',
      '提供守护感的能量陪伴',
    ],
    image: '/images/crystals/木/绿香灰琉璃.png',
  },

  {
    id: 'green-chalcedony',
    name: '绿玉髓',
    element: '木',
    elements: ['木'],
    keywords: ['滋养', '平衡', '情绪愈合', '善意', '安宁频率'],
    elementDesc: '纯木（润木，温和滋养）',
    suitableFor: '过度疲劳、身心失衡、需要温和情绪陪伴的人',
    chakra: '心轮',
    chakraEffects: [
      '支持身心平衡的温和能量频率',
      '辅助情绪疗愈与自我善待',
      '陪伴走向安宁的过程',
    ],
    image: '/images/crystals/木/绿玉髓珠子特写.png',
  },

  // ============================================================
  // 💧 水 — 9 种
  // ============================================================

  {
    id: 'aquamarine',
    name: '海蓝宝',
    element: '水',
    elements: ['水'],
    keywords: ['勇气频率', '清晰', '真实', '平静', '表达陪伴'],
    elementDesc: '纯水（海洋之水，辽阔清澈）',
    suitableFor: '缺乏表达勇气、思维混乱、需要找到内心真实声音的人',
    chakra: '喉轮 / 心轮',
    chakraEffects: [
      '支持沟通勇气与表达清晰的能量频率',
      '辅助内心平静的情绪状态',
      '陪伴真实自我表达的过程',
    ],
    image: '/images/crystals/水/海蓝宝珠子特写.png',
  },

  {
    id: 'black-rutilated-quartz',
    name: '黑发晶',
    element: '水',
    elements: ['水'],
    keywords: ['防护频率', '接地', '净化', '能量屏蔽', '稳定'],
    elementDesc: '纯水（玄水，黑色发丝内蕴力量）\n兼具土性（强力接地）',
    suitableFor: '负能量积累过多、容易被外界干扰、需要稳定能量陪伴的人',
    chakra: '根轮 / 顶轮',
    chakraEffects: [
      '支持能量防护与气场稳定的频率',
      '辅助接地与自我中心化的情绪状态',
      '陪伴深层气场净化',
    ],
    image: '/images/crystals/水/黑发晶珠子特写.png',
  },

  {
    id: 'black-onyx',
    name: '黑玛瑙',
    element: '水',
    elements: ['水'],
    keywords: ['力量频率', '自控', '防护', '稳定', '内聚'],
    elementDesc: '纯水（玄武之水，内聚力量）',
    suitableFor: '意志力需要支撑、容易受外界干扰、需要稳定自我的人',
    chakra: '根轮',
    chakraEffects: [
      '支持意志力与自控感的能量频率',
      '辅助稳定情绪与内在定力',
      '陪伴自我中心化的过程',
    ],
    image: '/images/crystals/水/黑玛瑙珠子特写.png',
  },

  {
    id: 'black-liuli',
    name: '黑香灰琉璃',
    element: '水',
    elements: ['水'],
    keywords: ['辟邪', '守护频率', '结界', '净化', '深层陪伴'],
    elementDesc: '纯水（玄冥之气，含香灰加持）',
    suitableFor: '需要强力守护陪伴、气场脆弱、频繁接触负能量的人',
    chakra: '根轮 / 海底轮',
    chakraEffects: [
      '支持守护与结界感知的能量频率',
      '辅助深层气场净化',
      '提供稳定守护感的能量陪伴',
    ],
    image: '/images/crystals/水/黑香灰琉璃.png',
  },

  {
    id: 'obsidian',
    name: '黑曜石',
    element: '水',
    elements: ['水'],
    keywords: ['自省', '净化频率', '接地', '真相感知', '深层清理'],
    elementDesc: '纯水（火山玄水，地心凝炼）',
    suitableFor: '需要深度自省、清理情绪积累、寻求内在真实的人',
    chakra: '根轮 / 海底轮',
    chakraEffects: [
      '支持深层自省与情绪清理的频率',
      '辅助接地与自我觉察的状态',
      '陪伴旧模式松动与内在更新',
    ],
    image: '/images/crystals/水/黑曜石珠子特写.png',
  },

  {
    id: 'jin-yun-stone',
    name: '金运石',
    element: '水',
    elements: ['水'],
    keywords: ['流动频率', '磁场感知', '蓄能', '稳中前进', '机遇意识'],
    elementDesc: '偏水（金水交汇，能量流动）\n兼具少量金性（聚敛收藏）',
    suitableFor: '发展节奏不稳、需要磁场能量支持、希望稳中求进的人',
    chakra: '太阳神经丛轮 / 根轮',
    chakraEffects: [
      '支持流动与稳定并存的能量频率',
      '辅助个人磁场感知的清晰',
      '陪伴发展势头的稳定',
    ],
    image: '/images/crystals/水/金运石珠子特写.png',
  },

  {
    id: 'blue-tigers-eye',
    name: '蓝虎眼石',
    element: '水',
    elements: ['水'],
    keywords: ['洞察频率', '冷静', '深邃', '内观', '智慧感知'],
    elementDesc: '偏水（静水深流，沉稳内力）\n兼具少量木性（洞见生发）',
    suitableFor: '容易冲动、判断力需要支撑、需要冷静能量陪伴的人',
    chakra: '眉心轮 / 喉轮',
    chakraEffects: [
      '支持洞察力与冷静判断的能量频率',
      '辅助思维稳定与内观状态',
      '陪伴深邃智慧感知的发展',
    ],
    image: '/images/crystals/水/蓝虎眼石珠子特写.png',
  },

  {
    id: 'kyanite',
    name: '蓝晶石',
    element: '水',
    elements: ['水'],
    keywords: ['脉轮平衡', '真实表达', '清明频率', '自净', '自我感知'],
    elementDesc: '纯水（清流贯通，自净之石）',
    suitableFor: '沟通不畅、自我表达困难、脉轮感知失衡的人',
    chakra: '喉轮 / 眉心轮 / 顶轮',
    chakraEffects: [
      '支持脉轮自然平衡的能量频率',
      '辅助真实清晰表达的情绪状态',
      '无需额外净化，自然维持能量清洁',
    ],
    image: '/images/crystals/水/蓝晶石珠子特写.png',
  },

  {
    id: 'moonstone',
    name: '月光石',
    element: '水',
    elements: ['水'],
    keywords: ['直觉频率', '月之能量', '内在力量', '新开始', '情绪平衡'],
    elementDesc: '纯水（月华之水，阴柔之力）\n兼具少量金性（清辉内敛）',
    suitableFor: '直觉感知不足、情绪波动大、想开启新篇章的人',
    chakra: '顶轮 / 眉心轮 / 腹轮',
    chakraEffects: [
      '支持直觉与内在感知的能量频率',
      '辅助情绪平衡的状态',
      '陪伴新开始与内在力量的唤醒',
    ],
    image: '/images/crystals/水/月光石珠子特写.png',
  },

  // ============================================================
  // 🌾 土 — 7 种（含黄阿塞 / 金发晶，兼属金）
  // ============================================================

  {
    id: 'pietersite',
    name: '彼得石',
    element: '土',
    elements: ['土'],
    keywords: ['意志频率', '内视', '突破感知', '灵性洞见', '转化'],
    elementDesc: '偏土（变动之土，风暴之力）\n兼具水性（深层流动）与火性（激发突破）',
    suitableFor: '思维固化、需要突破自我局限、寻求内在转化的人',
    chakra: '太阳神经丛轮 / 眉心轮',
    chakraEffects: [
      '支持意志力与内在突破的能量频率',
      '辅助灵性洞见与自我觉察',
      '陪伴固有模式松动与更新',
    ],
    image: '/images/crystals/土/彼得石珠子特写.png',
  },

  {
    id: 'smoky-quartz',
    name: '茶水晶',
    element: '土',
    elements: ['土'],
    keywords: ['接地频率', '解压', '低频净化', '情绪平稳', '根基稳定'],
    elementDesc: '偏土（沉土安稳）\n兼具少量水性（玄色流动）',
    suitableFor: '压力过大、负面情绪积累、需要接地气与放松陪伴的人',
    chakra: '根轮 / 海底轮',
    chakraEffects: [
      '支持接地与根基稳定的能量频率',
      '辅助压力释放与情绪平稳',
      '陪伴身心回归稳定的过程',
    ],
    image: '/images/crystals/土/茶水晶珠子特写.png',
  },

  {
    id: 'yellow-agate',
    name: '黄阿塞',
    element: '土',
    elements: ['土', '金'],
    keywords: ['自信频率', '稳定', '清晰感知', '踏实', '内在力量'],
    elementDesc: '兼具土金（土中蕴金，稳中生威）',
    suitableFor: '自信心需要支撑、思维混乱、需要踏实能量陪伴的人',
    chakra: '太阳神经丛轮 / 腹轮',
    chakraEffects: [
      '支持自信与稳定感知的能量频率',
      '辅助清晰决策的情绪状态',
      '陪伴踏实行动基础的建立',
    ],
    image: '/images/crystals/土/黄阿塞珠子特写.png',
  },

  {
    id: 'golden-tigers-eye',
    name: '黄虎眼石',
    element: '土',
    elements: ['土'],
    keywords: ['自信频率', '专注', '洞察', '行动力', '丰盛感知'],
    elementDesc: '纯土（厚土蕴金，虎之威望）\n兼具少量金性（金光敛聚）',
    suitableFor: '缺乏自信、目标模糊、需要行动力能量支撑的人',
    chakra: '太阳神经丛轮 / 腹轮',
    chakraEffects: [
      '支持自信与个人威望感知的能量频率',
      '辅助专注力与行动力的情绪状态',
      '陪伴丰盛感知与目标清晰',
    ],
    image: '/images/crystals/土/黄虎眼石珠子特写.png',
  },

  {
    id: 'yellow-liuli',
    name: '黄香灰琉璃',
    element: '土',
    elements: ['土'],
    keywords: ['稳固频率', '祈福', '佛性加持', '地气滋养', '平安陪伴'],
    elementDesc: '纯土（厚土蕴金，含香灰加持）',
    suitableFor: '根基不稳、需要踏实发展支撑、寻求平安守护的人',
    chakra: '太阳神经丛轮 / 根轮',
    chakraEffects: [
      '支持根基稳固与踏实感知的能量频率',
      '辅助平和安定的情绪状态',
      '提供平安祝福的能量陪伴',
    ],
    image: '/images/crystals/土/黄香灰琉璃.png',
  },

  {
    id: 'yellow-chalcedony',
    name: '黄玉髓',
    element: '土',
    elements: ['土'],
    keywords: ['乐观频率', '温暖', '生命活力', '阳光感知', '情绪陪伴'],
    elementDesc: '偏土（暖土之性）\n兼具少量火性（温暖激发）',
    suitableFor: '情绪低落、活力不足、需要温暖能量陪伴的人',
    chakra: '太阳神经丛轮 / 腹轮',
    chakraEffects: [
      '支持乐观积极的情绪能量频率',
      '辅助生命热情的感知与唤醒',
      '陪伴走出情绪低谷的过程',
    ],
    image: '/images/crystals/土/黄玉髓珠子特写.png',
  },

  {
    id: 'gold-rutilated-quartz',
    name: '金发晶',
    element: '土',
    elements: ['土', '金'],
    keywords: ['阳气频率', '事业能量', '领导力感知', '行动力', '内在充盈'],
    elementDesc: '兼具土金（土旺生金，金针内蕴）',
    suitableFor: '事业能量低迷、需要领导力支撑、希望增强个人气场的人',
    chakra: '太阳神经丛轮 / 根轮',
    chakraEffects: [
      '支持阳气充盈与事业能量场的频率',
      '辅助领导力与执行力的情绪状态',
      '陪伴个人气场与行动力的稳固',
    ],
    image: '/images/crystals/土/金发晶珠子特写.png',
  },

];

// ============================================================
// 工具函数
// ============================================================

/**
 * 按五行筛选水晶（含兼属）
 * @param {string} element - '木'|'火'|'土'|'金'|'水'
 * @returns {Array}
 */
function getCrystalsByElement(element) {
  return CRYSTAL_DATA.filter(c => c.elements.includes(element));
}

/**
 * 按 ID 获取单颗水晶
 * @param {string} id
 * @returns {Object|null}
 */
function getCrystalById(id) {
  return CRYSTAL_DATA.find(c => c.id === id) || null;
}

/**
 * 按名称获取水晶
 * @param {string} name
 * @returns {Object|null}
 */
function getCrystalByName(name) {
  return CRYSTAL_DATA.find(c => c.name === name) || null;
}

module.exports = {
  CRYSTAL_DATA,
  getCrystalsByElement,
  getCrystalById,
  getCrystalByName,
};
