// pages/diy/diy.js
const { getCrystalById, getAllCrystals } = require('../../utils/crystal-db');

// ─── 常量 ────────────────────────────────────────────────
const MAX_BEADS = 16;

// ─── 五行映射 ────────────────────────────────────────────
const ELEMENT_CN_TO_KEY = {
  '木': 'Wood', '火': 'Fire', '土': 'Earth', '金': 'Metal', '水': 'Water',
};
const ELEMENT_KEYWORDS = {
  Wood:  '向上、生发、扩张、连接',
  Fire:  '热情、表达、曝光、突破',
  Earth: '沉稳、积累、守成、现实',
  Metal: '收敛、规则、逻辑、断舍离',
  Water: '流动、深层情绪、直觉、内观',
};

Page({
  data: {
    beadDiameterMm: 10,
    maxBeads: MAX_BEADS,
    currentBeads: [],    // [{ id, name, image }]
    hasDiagnosis: false,
    mainElement: '',
    assistElement: '',
    elementGroups: [],
    showDetail: false,
    detailCrystal: null,
    showWristGuide: false,
    wristSizeCm: '',
  },

  // ══ 生命周期 ═══════════════════════════════════════════

  onLoad() {
    const all    = getAllCrystals();
    const app    = getApp();
    const result = app.globalData && app.globalData.diagnosisResult;

    let hasDiagnosis  = false;
    let mainElement   = '';
    let assistElement = '';
    let elementGroups = [];

    if (result) {
      hasDiagnosis  = true;
      mainElement   = result.mainElement;
      assistElement = result.assistElement;
      const mainKey   = ELEMENT_CN_TO_KEY[mainElement]   || mainElement;
      const assistKey = ELEMENT_CN_TO_KEY[assistElement] || assistElement;
      elementGroups = [
        {
          key:             mainKey,
          roleLabel:       '调运主石',
          elementKeywords: ELEMENT_KEYWORDS[mainKey] || '',
          crystals:        all.filter(c => c.element === mainKey),
        },
        {
          key:             assistKey,
          roleLabel:       '调运辅石',
          elementKeywords: ELEMENT_KEYWORDS[assistKey] || '',
          crystals:        all.filter(c => c.element === assistKey),
        },
      ];
    }

    this.setData({ hasDiagnosis, mainElement, assistElement, elementGroups });
  },

  onReady() {
    this._initCanvas();
  },

  // ══ Canvas 初始化 ══════════════════════════════════════

  _initCanvas() {
    wx.createSelectorQuery()
      .select('#braceletCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0] || !res[0].node) {
          console.error('[DIY] canvas 节点未找到');
          return;
        }

        const canvas = res[0].node;
        const ctx    = canvas.getContext('2d');
        const dpr    = wx.getSystemInfoSync().pixelRatio;
        const W      = res[0].width;
        const H      = res[0].height;

        canvas.width  = W * dpr;
        canvas.height = H * dpr;
        ctx.scale(dpr, dpr);

        this._canvas   = canvas;
        this._ctx      = ctx;
        this._W        = W;
        this._H        = H;
        this._imgCache = {};  // 持久图片缓存：路径 → Image 对象

        // 初始渲染：空手链
        this.renderBracelet();

        // 缓存 canvas 和回收箱的屏幕坐标，供触摸换算使用
        this._cacheRects();
      });
  },

  // 缓存 canvas 与回收箱的屏幕 boundingClientRect
  _cacheRects() {
    wx.createSelectorQuery()
      .select('#braceletCanvas').boundingClientRect()
      .select('#trashBin').boundingClientRect()
      .exec((res) => {
        this._canvasRect = res[0] || null;
        this._trashRect  = res[1] || null;
      });
  },

  // clientX/Y（viewport 坐标）→ canvas 逻辑坐标
  _clientToCanvas(clientX, clientY) {
    if (!this._canvasRect) return { x: clientX, y: clientY };
    return {
      x: clientX - this._canvasRect.left,
      y: clientY - this._canvasRect.top,
    };
  },

  // 判断坐标是否落在回收箱区域
  _isInTrashBin(clientX, clientY) {
    if (!this._trashRect) return false;
    const { left, right, top, bottom } = this._trashRect;
    return clientX >= left && clientX <= right && clientY >= top && clientY <= bottom;
  },

  // ══ 核心渲染 ═══════════════════════════════════════════

  /**
   * 渲染手链
   * @param {Array} [beads] 可选：传入拖拽临时数组；不传则读 currentBeads
   */
  renderBracelet(beads) {
    const ctx = this._ctx;
    const W   = this._W;
    const H   = this._H;
    if (!ctx || !W) return;

    const list = beads !== undefined ? beads : this.data.currentBeads;
    const { n, cx, cy, R, beadSize } = this._layout(list);

    // 清空 → 画虚线圆环
    ctx.clearRect(0, 0, W, H);
    this._drawRing(ctx, cx, cy, R);

    if (n === 0) return;

    // 全部图片已缓存 → 同步绘制（拖拽时保证流畅）
    const allCached = list.every(b => !b.image || this._imgCache[b.image]);
    if (allCached) {
      this._paint(ctx, list, n, cx, cy, R, beadSize);
      return;
    }

    // 有未缓存图片 → 异步加载后绘制
    this._loadImages(list).then(() => {
      const current = this._dragBeads !== undefined ? this._dragBeads : this.data.currentBeads;
      const l2 = this._layout(current);
      ctx.clearRect(0, 0, W, H);
      this._drawRing(ctx, l2.cx, l2.cy, l2.R);
      if (l2.n > 0) this._paint(ctx, current, l2.n, l2.cx, l2.cy, l2.R, l2.beadSize);
    });
  },

  // 由珠子数组计算布局参数（圆心、半径、珠子尺寸）
  _layout(list) {
    const n  = list.length;
    const cx = this._W / 2;
    const cy = this._H / 2;
    const R  = this._W * 0.38;
    const chord    = n > 1 ? 2 * R * Math.sin(Math.PI / n) : R * 0.9;
    const beadSize = Math.min(chord * 0.92, R * 0.52);
    return { n, cx, cy, R, beadSize };
  },

  // 异步加载并缓存图片
  _loadImages(list) {
    const promises = list.map(bead => {
      if (!bead.image)               return Promise.resolve(null);
      if (this._imgCache[bead.image]) return Promise.resolve(this._imgCache[bead.image]);
      return new Promise(resolve => {
        const img   = this._canvas.createImage();
        img.onload  = () => { this._imgCache[bead.image] = img; resolve(img); };
        img.onerror = () => resolve(null);
        img.src = bead.image;
      });
    });
    return Promise.all(promises);
  },

  // 同步绘制所有珠子（图片已在 _imgCache 中）
  _paint(ctx, list, n, cx, cy, R, beadSize) {
    list.forEach((bead, i) => {
      const angle  = (2 * Math.PI / n) * i - Math.PI / 2;  // 从 12 点顺时针
      const beadCx = cx + R * Math.cos(angle);
      const beadCy = cy + R * Math.sin(angle);
      const img    = bead.image ? this._imgCache[bead.image] : null;
      // 拖拽中的珠子给金色高亮边框
      const isActive = this._dragging && this._dragging.beadIndex === i;

      if (img) {
        this._drawBeadImage(ctx, img, beadCx, beadCy, beadSize, isActive);
      } else {
        this._drawBeadFallback(ctx, beadCx, beadCy, beadSize);
      }
    });
  },

  // ══ 触摸事件：拖拽重排 & 拖拽删除 ═════════════════════

  onCanvasTouchStart(e) {
    const touch = e.touches && e.touches[0];
    if (!touch) return;

    const { x, y } = this._clientToCanvas(touch.clientX, touch.clientY);
    const beads    = this.data.currentBeads;
    const { n, cx, cy, R, beadSize } = this._layout(beads);
    if (n === 0) return;

    const hitR = beadSize / 2 + 12;  // 稍大的命中区，便于手指操作

    for (let i = 0; i < n; i++) {
      const angle  = (2 * Math.PI / n) * i - Math.PI / 2;
      const beadCx = cx + R * Math.cos(angle);
      const beadCy = cy + R * Math.sin(angle);
      const dist   = Math.sqrt((x - beadCx) ** 2 + (y - beadCy) ** 2);

      if (dist <= hitR) {
        // 命中第 i 颗珠子，开始拖拽
        this._dragBeads  = beads.slice();   // 拖拽工作副本
        this._dragging   = { beadIndex: i };
        break;
      }
    }
  },

  onCanvasTouchMove(e) {
    if (!this._dragging) return;

    const touch = e.touches && e.touches[0];
    if (!touch) return;

    const { x, y } = this._clientToCanvas(touch.clientX, touch.clientY);
    const n  = this._dragBeads.length;
    const cx = this._W / 2;
    const cy = this._H / 2;
    const R  = this._W * 0.38;

    // 手指相对圆心的角度 → 映射为目标 Index
    const fingerAngle = Math.atan2(y - cy, x - cx);

    // 归一化：以 12 点（-π/2）为起点，顺时针 0 → 2π
    let norm = fingerAngle + Math.PI / 2;
    if (norm < 0) norm += 2 * Math.PI;

    const newIndex = Math.round(norm / (2 * Math.PI / n)) % n;

    if (newIndex !== this._dragging.beadIndex) {
      // 将珠子从旧位置移到新位置（"换座"）
      const arr    = this._dragBeads.slice();
      const [moved] = arr.splice(this._dragging.beadIndex, 1);
      arr.splice(newIndex, 0, moved);

      this._dragBeads          = arr;
      this._dragging.beadIndex = newIndex;
    }

    // 保存最后触摸位置（touchend 时可能读不到 clientX/Y）
    this._lastClient = { x: touch.clientX, y: touch.clientY };

    // 从拖拽副本实时渲染（不触发 setData，保证流畅）
    this.renderBracelet(this._dragBeads);
  },

  onCanvasTouchEnd(e) {
    if (!this._dragging) return;

    const changedTouch = e.changedTouches && e.changedTouches[0];
    const client = changedTouch
      ? { x: changedTouch.clientX, y: changedTouch.clientY }
      : this._lastClient;

    let finalBeads = (this._dragBeads || this.data.currentBeads).slice();

    if (client && this._isInTrashBin(client.x, client.y)) {
      // 拖入回收箱 → 删除该珠子
      finalBeads.splice(this._dragging.beadIndex, 1);
    }
    // 否则保留拖拽后的排列（已通过换座完成）

    // 清理拖拽状态
    this._dragging  = null;
    this._dragBeads = undefined;

    // 提交到 data 并终态渲染
    this.setData({ currentBeads: finalBeads, wristSizeCm: this._calcWristSize(finalBeads) });
    this.renderBracelet(finalBeads);
  },

  // ══ 珠子列表操作 ══════════════════════════════════════

  // 点击列表 → 添加一颗
  onCrystalSelect(e) {
    const id      = e.currentTarget.dataset.id;
    const crystal = id ? getCrystalById(Number(id)) : null;
    if (!crystal) return;

    const current = this.data.currentBeads;
    if (current.length >= MAX_BEADS) {
      wx.showToast({ title: '手链已满 ' + MAX_BEADS + ' 颗', icon: 'none', duration: 1500 });
      return;
    }

    const newBeads = current.concat([{
      id:     crystal.id,
      name:   crystal.name,
      image:  crystal.image_url,
      sizeMm: crystal.size_mm || 10,
    }]);
    this.setData({ currentBeads: newBeads, wristSizeCm: this._calcWristSize(newBeads) });
    this.renderBracelet(newBeads);
  },

  // 回收箱按钮 → 清空手链
  clearSelection() {
    this.setData({ currentBeads: [], wristSizeCm: '' });
    this.renderBracelet([]);
  },

  // 计算手围（珠子直径总和 - 10mm，转换为 cm）
  _calcWristSize(beads) {
    if (!beads || beads.length === 0) return '';
    const totalMm = beads.reduce((sum, b) => sum + (b.sizeMm || 10), 0) - 10;
    return (totalMm / 10).toFixed(1) + ' cm';
  },

  // 提交订单
  onConfirmDesign() {
    const beads = this.data.currentBeads;
    if (beads.length === 0) {
      wx.showToast({ title: '请先添加珠子', icon: 'none', duration: 1500 });
      return;
    }
    const app = getApp();
    app.globalData.diyOrder = { beads, wristSizeCm: this.data.wristSizeCm };
    wx.setStorageSync('diyOrder', { beads, wristSizeCm: this.data.wristSizeCm });
    wx.navigateTo({ url: '/pages/order/confirm' });
  },

  // ══ 详情弹窗 ══════════════════════════════════════════

  onDetailTap(e) {
    const crystal = getCrystalById(Number(e.currentTarget.dataset.id));
    if (!crystal) return;
    this.setData({ showDetail: true, detailCrystal: crystal });
  },

  onCloseDetail() {
    this.setData({ showDetail: false, detailCrystal: null });
  },

  // ══ 手围测量弹窗 ══════════════════════════════════════

  openWristGuide() {
    this.setData({ showWristGuide: true });
  },

  closeWristGuide() {
    this.setData({ showWristGuide: false });
  },

  noop() {},

  // ══ 私有绘制方法 ══════════════════════════════════════

  // 虚线圆环（穿绳轨道）
  _drawRing(ctx, cx, cy, R) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(196, 160, 106, 0.40)';
    ctx.lineWidth   = 2.5;
    ctx.setLineDash([10, 8]);
    ctx.stroke();
    ctx.restore();
  },

  // 圆形裁剪珠子图片，拖拽中高亮金边
  _drawBeadImage(ctx, img, cx, cy, size, isActive) {
    const r = size / 2;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage(img, cx - r, cy - r, size, size);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.strokeStyle = isActive ? 'rgba(212, 175, 55, 0.90)' : 'rgba(0,0,0,0.10)';
    ctx.lineWidth   = isActive ? 3 : 1;
    ctx.stroke();
    ctx.restore();
  },

  // 图片加载失败时的占位圆
  _drawBeadFallback(ctx, cx, cy, size) {
    const r = size / 2;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.fillStyle   = '#C8A882';
    ctx.globalAlpha = 0.5;
    ctx.fill();
    ctx.restore();
  },
});
