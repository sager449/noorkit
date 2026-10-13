/* =========================================
   NoorKit — Canvas Renderer
   يرسم التصميم على Canvas
   ========================================= */

const NoorRenderer = {
  canvas: null,
  ctx: null,
  previewScale: 1,

  /* ---------- Init ---------- */
  init(canvasEl) {
    this.canvas = canvasEl;
    this.ctx = canvasEl.getContext("2d");
    this.resize();
    window.addEventListener("resize", () => {
      this.resize();
      this.render();
    });
  },

  /* ---------- Resize canvas to fit screen ---------- */
  resize() {
    if (!this.canvas || !NoorState.design) return;

    const d = NoorState.design;
    const wrapper = document.getElementById("canvas-wrapper");
    const availW = (wrapper?.clientWidth || window.innerWidth) - 32;
    const availH = window.innerHeight - 220;

    const scaleW = availW / d.width;
    const scaleH = availH / d.height;
    this.previewScale = Math.min(scaleW, scaleH, 1);

    // High-DPI support
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = d.width * dpr;
    this.canvas.height = d.height * dpr;
    this.canvas.style.width = (d.width * this.previewScale) + "px";
    this.canvas.style.height = (d.height * this.previewScale) + "px";

    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  },

  /* ---------- Main render ---------- */
  async render() {
    if (!this.ctx || !NoorState.design) return;

    const d = NoorState.design;
    const ctx = this.ctx;

    // Clear
    ctx.clearRect(0, 0, d.width, d.height);

    // 1. Background
    await this.drawBackground(d);

    // 2. Ayah text
    this.drawAyah(d);
     // 2.5. Images & Stickers
this.drawImages(d);
this.drawStickers(d);
     

    // 3. Translation
    if (d.translation.enabled && d.translation.text) {
      this.drawTranslation(d);
    }

    // 4. Frame
    this.drawFrame(d);

    // 5. Decorations
    this.drawDecor(d);
  },

  /* ---------- Draw background ---------- */
  async drawBackground(d) {
    const ctx = this.ctx;
    const bg = d.background;

    if (bg.type === "solid") {
      ctx.fillStyle = bg.value || "#f5ede0";
      ctx.fillRect(0, 0, d.width, d.height);
      return;
    }

    if (bg.type === "gradient") {
      const gradient = this.parseGradient(bg.value, d.width, d.height);
      ctx.fillStyle = gradient || "#f5ede0";
      ctx.fillRect(0, 0, d.width, d.height);
      return;
    }

    if (bg.type === "image" && bg.imageUrl) {
      const img = await this.loadImage(bg.imageUrl);
      if (img) {
        // Cover fit
        const ratio = Math.max(d.width / img.width, d.height / img.height);
        const w = img.width * ratio;
        const h = img.height * ratio;
        const x = (d.width - w) / 2;
        const y = (d.height - h) / 2;
        ctx.drawImage(img, x, y, w, h);
      } else {
        ctx.fillStyle = "#f5ede0";
        ctx.fillRect(0, 0, d.width, d.height);
      }
      return;
    }
  },

  /* ---------- Parse CSS gradient ---------- */
  parseGradient(css, w, h) {
    try {
      const match = css.match(/linear-gradient\((\d+)deg,\s*(.+)\)/);
      if (!match) return null;
      const angle = parseInt(match[1]);
      const stops = match[2].split(",").map((s) => s.trim());
      const rad = (angle - 90) * (Math.PI / 180);
      const x1 = w / 2 - Math.cos(rad) * w / 2;
      const y1 = h / 2 - Math.sin(rad) * h / 2;
      const x2 = w / 2 + Math.cos(rad) * w / 2;
      const y2 = h / 2 + Math.sin(rad) * h / 2;
      const grad = this.ctx.createLinearGradient(x1, y1, x2, y2);
      stops.forEach((stop) => {
        const parts = stop.split(/\s+(?=\d+%)/);
        grad.addColorStop(parseFloat(parts[1]) / 100 || 0, parts[0]);
      });
      return grad;
    } catch (e) {
      return null;
    }
  },

  /* ---------- Load image helper ---------- */
  loadImage(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  },

  /* ---------- Draw Ayah text ---------- */
  drawAyah(d) {
    const ctx = this.ctx;
    const font = NoorFonts.get(d.text.fontId);
    const text = d.ayah.text || "";

    if (!text) return;

    ctx.save();

    // Layout
    const padding = Math.round(d.width * 0.1);
    const maxW = d.width - padding * 2;
    const cy = d.height / 2;

    // Font
    ctx.font = `400 ${d.text.size}px ${font.family}`;
    ctx.textAlign = d.text.align || "center";
    ctx.textBaseline = "middle";
    ctx.direction = "rtl";

    // Shadow
    if (d.text.shadow) {
      ctx.shadowColor = d.text.shadowColor;
      ctx.shadowBlur = d.text.shadowBlur;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 2;
    }

    // Wrap lines
    const lines = this.wrapText(ctx, text, maxW);
    const lineHeight = d.text.size * (d.text.lineHeight || 1.8);
    const totalH = lines.length * lineHeight;
    const startY = cy - totalH / 2 + lineHeight / 2;

    // Color
    ctx.fillStyle = d.text.color || "#1a1a1a";

    // X position
    let x = d.width / 2;
    if (d.text.align === "right") x = d.width - padding;
    if (d.text.align === "left") x = padding;

    // Draw
    lines.forEach((line, i) => {
      ctx.fillText(line, x, startY + i * lineHeight);
    });

    ctx.restore();
  },

  /* ---------- Wrap text to fit width ---------- */
  wrapText(ctx, text, maxWidth) {
    const paragraphs = text.split("\n");
    const lines = [];

    paragraphs.forEach((para) => {
      if (!para.trim()) {
        lines.push("");
        return;
      }
      const words = para.split(/\s+/);
      let current = "";

      words.forEach((word) => {
        const test = current ? current + " " + word : word;
        if (ctx.measureText(test).width > maxWidth && current) {
          lines.push(current);
          current = word;
        } else {
          current = test;
        }
      });

      if (current) lines.push(current);
    });

    return lines;
  },
   /* ---------- Draw Images ---------- */
drawImages(d) {
  if (!d.images || d.images.length === 0) return;
  const ctx = this.ctx;
  for (const img of d.images) {
    const image = new Image();
    image.onload = () => {
      ctx.drawImage(image, img.x, img.y, img.width, img.height);
    };
    image.src = img.src;
  }
},

/* ---------- Draw Stickers (text) ---------- */
drawStickers(d) {
  if (!d.stickers || d.stickers.length === 0) return;
  const ctx = this.ctx;
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const stk of d.stickers) {
    ctx.font = `700 ${stk.size}px 'Amiri', serif`;
    ctx.fillStyle = stk.color || "#0d8b5f";
    ctx.fillText(stk.text, stk.x, stk.y);
  }
  ctx.restore();
},
   

  /* ---------- Draw translation ---------- */
  drawTranslation(d) {
    const ctx = this.ctx;
    const tr = d.translation;
    if (!tr.text) return;

    ctx.save();

    const font = NoorFonts.get(tr.fontId);
    ctx.font = `400 ${tr.size}px ${font.family}`;
    ctx.fillStyle = tr.color || "#4a4a4a";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.direction = "ltr";

    const padding = Math.round(d.width * 0.1);
    const maxW = d.width - padding * 2;
    const lines = this.wrapText(ctx, tr.text, maxW);
    const lineHeight = tr.size * 1.5;

    // Position: below ayah
    const ayahFont = NoorFonts.get(d.text.fontId);
    ctx.font = `400 ${d.text.size}px ${ayahFont.family}`;
    const ayahLines = this.wrapText(ctx, d.ayah.text, maxW);
    const ayahHeight = ayahLines.length * d.text.size * (d.text.lineHeight || 1.8);
    const ayahBottom = d.height / 2 + ayahHeight / 2;

    const startY = ayahBottom + 40;

    ctx.font = `400 ${tr.size}px ${font.family}`;
    lines.forEach((line, i) => {
      ctx.fillText(line, d.width / 2, startY + i * lineHeight);
    });

    ctx.restore();
  },

  /* ---------- Draw frame ---------- */
  drawFrame(d) {
    if (d.frame.type === "none") return;

    const ctx = this.ctx;
    const pad = Math.round(d.width * 0.05);
    const thick = d.frame.thickness;

    ctx.save();
    ctx.strokeStyle = d.frame.color;
    ctx.lineWidth = thick;

    if (d.frame.type === "simple") {
      ctx.strokeRect(pad, pad, d.width - pad * 2, d.height - pad * 2);
    } else if (d.frame.type === "double") {
      ctx.strokeRect(pad, pad, d.width - pad * 2, d.height - pad * 2);
      ctx.strokeRect(pad + 12, pad + 12, d.width - (pad + 12) * 2, d.height - (pad + 12) * 2);
    } else if (d.frame.type === "ornate") {
      ctx.lineWidth = thick + 1;
      ctx.strokeRect(pad, pad, d.width - pad * 2, d.height - pad * 2);
      // Corner ornaments
      const cs = 30;
      const corners = [
        [pad, pad], [d.width - pad, pad],
        [pad, d.height - pad], [d.width - pad, d.height - pad],
      ];
      corners.forEach(([cx, cy]) => {
        ctx.beginPath();
        ctx.arc(cx, cy, cs / 2, 0, Math.PI * 2);
        ctx.stroke();
      });
    }

    ctx.restore();
  },

  /* ---------- Draw decorations --------- */
  drawDecor(d) {
    const ctx = this.ctx;
    const gold = "#c9a227";

    if (d.decor.top) {
      ctx.save();
      ctx.fillStyle = gold;
      ctx.font = `400 40px 'Amiri', serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText("﷽", d.width / 2, Math.round(d.height * 0.04));
      ctx.restore();
    }

    if (d.decor.bottom) {
      ctx.save();
      ctx.fillStyle = gold;
      ctx.font = `400 30px 'Amiri', serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText("❁ ❁ ❁", d.width / 2, d.height - Math.round(d.height * 0.04));
      ctx.restore();
    }
  },
};
/* =========================================
   NoorKit — Canvas Renderer (Part 2)
   Helpers: fonts, export, toast
   ========================================= */

/* ---------- Preload all fonts before render ---------- */
NoorRenderer.preloadFonts = async function () {
  if (!document.fonts) return;
  const loads = [];
  NoorFonts.list.forEach((f) => {
    try {
      loads.push(document.fonts.load(`400 64px ${f.family}`));
    } catch (e) { /* skip */ }
  });
  try {
    await Promise.all(loads);
  } catch (e) { /* ignore */ }
};

/* ---------- Export canvas to PNG ---------- */
NoorRenderer.export = async function () {
  if (!this.canvas) return;

  // Ensure fonts are loaded
  await this.preloadFonts();

  // Create a high-res export canvas
  const d = NoorState.design;
  const exportCanvas = document.createElement("canvas");
  const exportScale = 2; // 2x resolution
  exportCanvas.width = d.width * exportScale;
  exportCanvas.height = d.height * exportScale;

  const exportCtx = exportCanvas.getContext("2d");
  exportCtx.scale(exportScale, exportScale);

  // Temporarily swap context for rendering
  const originalCanvas = this.canvas;
  const originalCtx = this.ctx;
  this.canvas = exportCanvas;
  this.ctx = exportCtx;

  // Render at full size
  await this.render();

  // Restore original
  this.canvas = originalCanvas;
  this.ctx = originalCtx;

  // Trigger download
  return new Promise((resolve) => {
    exportCanvas.toBlob((blob) => {
      if (!blob) { resolve(null); return; }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const safeTitle = (d.title || "noor-design").replace(/[\\/:*?"<>|]+/g, "-");
      a.href = url;
      a.download = `${safeTitle}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      resolve(blob);
    }, "image/png", 1.0);
  });
};

/* ---------- Show toast ---------- */
window.showToast = function (message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.showToast._timer);
  window.showToast._timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
};

/* ---------- Debounced render ---------- */
NoorRenderer.debouncedRender = (function () {
  let timer = null;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
      NoorRenderer.render();
    }, 80);
  };
})();
