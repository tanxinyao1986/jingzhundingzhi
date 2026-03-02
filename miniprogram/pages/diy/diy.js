// pages/diy/diy.js

// ─── 手链参数 ──────────────────────────────────────────────
const WRIST_CM        = 15;    // 手围（厘米）
const BEAD_DIAMETER_MM = 10;   // 默认珠子直径（毫米）

// 实际手链长度 = 手围 + 1cm（佩戴余量），单位 mm
const ACTUAL_LENGTH_MM = (WRIST_CM + 1) * 10;

// 珠子数量：实际长度 ÷ 珠径，四舍五入
const BEAD_COUNT = Math.round(ACTUAL_LENGTH_MM / BEAD_DIAMETER_MM); // = 16

// ─── 测试数据：全用红玉髓 ────────────────────────────────────
const TEST_BEADS = Array.from({ length: BEAD_COUNT }, () => ({
  name: '红玉髓',
  image: '/images/crystals/火/红玉髓珠子特写.png',
}));

// ─── 样式常量 ─────────────────────────────────────────────
const CORD_COLOR    = '#C4A06A'; // 手绳颜色（金棕色）
const CORD_WIDTH    = 3;         // 手绳线宽（逻辑像素）

// ─── Page ─────────────────────────────────────────────────
Page({
  data: {
    wristCm: WRIST_CM,
    beadDiameterMm: BEAD_DIAMETER_MM,
    actualLengthCm: (WRIST_CM + 1),
    beadCount: BEAD_COUNT,
    isLoading: true,
  },

  onReady() {
    this.initCanvas();
  },

  // ── 初始化 Canvas ──────────────────────────────────────
  initCanvas() {
    const query = wx.createSelectorQuery();
    query.select('#braceletCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0] || !res[0].node) {
          console.error('[DIY] canvas 节点未找到');
          return;
        }

        const canvas = res[0].node;
        const ctx    = canvas.getContext('2d');

        // 处理高分辨率屏幕
        const dpr = wx.getSystemInfoSync().pixelRatio;
        const logicW = res[0].width;
        const logicH = res[0].height;
        canvas.width  = logicW * dpr;
        canvas.height = logicH * dpr;
        ctx.scale(dpr, dpr);

        this.drawBracelet(canvas, ctx, TEST_BEADS, logicW, logicH);
      });
  },

  // ── 核心绘制函数 ───────────────────────────────────────
  /**
   * drawBracelet — 将珠子数组绘制成圆形手链
   * @param {Canvas}     canvas  - Canvas 2D 节点
   * @param {RenderingContext} ctx - 2D 上下文
   * @param {Array}      beads   - 珠子数组 [{ name, image }]
   * @param {number}     width   - Canvas 逻辑宽度（px）
   * @param {number}     height  - Canvas 逻辑高度（px）
   */
  drawBracelet(canvas, ctx, beads, width, height) {
    const n  = beads.length;
    const cx = width  / 2;
    const cy = height / 2;

    // 珠心圆半径：让 n 颗珠子恰好铺满圆周
    // 圆周 = n × beadSize，故 R = (n × beadSize) / (2π)
    // 反过来：先定 R = 38% 半宽，再算 beadSize
    const R        = width * 0.38;
    // 相邻珠心之间的弦长（直线距离），这才是珠子直径的精确上限
    // 再乘以 1.12 让珠子略微重叠，消除图片边缘高光造成的视觉缝隙
    const chord    = 2 * R * Math.sin(Math.PI / n);
    const beadSize = chord * 1.12;

    // ① 先绘手绳（在珠子下层）
    this._drawCord(ctx, cx, cy, R);

    // ② 预加载所有图片（相同路径共享同一 Promise，避免重复加载）
    const imgCache  = {};
    const promises  = beads.map(bead => {
      if (!imgCache[bead.image]) {
        imgCache[bead.image] = new Promise(resolve => {
          const img = canvas.createImage();
          img.onload  = () => resolve(img);
          img.onerror = () => {
            console.warn('[DIY] 图片加载失败:', bead.image);
            resolve(null);
          };
          img.src = bead.image;
        });
      }
      return imgCache[bead.image];
    });

    Promise.all(promises).then(images => {
      // 清除加载占位，重绘
      ctx.clearRect(0, 0, width, height);
      this._drawCord(ctx, cx, cy, R);

      // ③ 逐颗绘制珠子，从 12 点钟方向（-π/2）顺时针排列
      images.forEach((img, i) => {
        const angle    = (2 * Math.PI / n) * i - Math.PI / 2;
        const beadCx   = cx + R * Math.cos(angle);
        const beadCy   = cy + R * Math.sin(angle);

        if (img) {
          this._drawBeadImage(ctx, img, beadCx, beadCy, beadSize);
        } else {
          this._drawBeadFallback(ctx, beadCx, beadCy, beadSize);
        }
      });

      this.setData({ isLoading: false });
    });
  },

  // ── 私有：绘制手绳 ─────────────────────────────────────
  _drawCord(ctx, cx, cy, R) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, 2 * Math.PI);
    ctx.strokeStyle = CORD_COLOR;
    ctx.lineWidth   = CORD_WIDTH;
    ctx.globalAlpha = 0.7;
    ctx.stroke();
    ctx.restore();
  },

  // ── 私有：将图片裁成圆形后绘制 ────────────────────────
  _drawBeadImage(ctx, img, cx, cy, size) {
    const r = size / 2;
    ctx.save();

    // 圆形裁剪路径
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.clip();

    // 绘制图片（居中）
    ctx.drawImage(img, cx - r, cy - r, size, size);

    // 边缘细描边，让珠子轮廓更清晰
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(0,0,0,0.12)';
    ctx.lineWidth   = 1;
    ctx.stroke();

    ctx.restore();
  },

  // ── 私有：图片加载失败时的占位圆 ──────────────────────
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
