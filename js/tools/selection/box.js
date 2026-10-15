/* =========================================
   NoorKit — Selection: Box
   مربع التحديد للعناصر
   ========================================= */

window.NoorSelection = {
  active: null, // { type, id, node, x, y, width, height }

  init() {
    const stage = document.getElementById("canvas-stage");
    const canvas = document.getElementById("main-canvas");
    if (!canvas) return;

    // الضغط على Canvas
    canvas.addEventListener("click", (e) => this.handleCanvasClick(e));
    canvas.addEventListener("touchstart", (e) => this.handleCanvasClick(e), { passive: false });
  },

  handleCanvasClick(e) {
    const canvas = document.getElementById("main-canvas");
    const rect = canvas.getBoundingClientRect();
    const scale = NoorRenderer.previewScale;

    let clientX, clientY;
    if (e.touches) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = (clientX - rect.left) / scale;
    const y = (clientY - rect.top) / scale;

    const d = NoorState.design;

    // 1. التحقق من النص
    if (this.hitTestText(x, y, d)) {
      this.showTextBox();
      return;
    }

    // 2. التحقق من الصور والرموز
    for (const img of d.images || []) {
      if (this.hitTestRect(x, y, img)) {
        this.showImageBox(img, "image");
        return;
      }
    }

    for (const stk of d.stickers || []) {
      if (this.hitTestSticker(x, y, stk)) {
        this.showStickerBox(stk);
        return;
      }
    }

    // 3. لا شيء
    this.hide();
  },

  hitTestText(x, y, d) {
    if (!d.ayah.text) return false;
    const padding = Math.round(d.width * 0.1);
    const maxW = d.width - padding * 2;
    const cy = d.height / 2;

    const canvas = document.getElementById("main-canvas");
    const ctx = canvas.getContext("2d");
    const font = NoorFonts.get(d.text.fontId);
    ctx.font = `400 ${d.text.size}px ${font.family}`;
    const lines = NoorRenderer.wrapText(ctx, d.ayah.text, maxW);
    const lineHeight = d.text.size * (d.text.lineHeight || 1.8);
    const totalH = lines.length * lineHeight;
    const startY = cy - totalH / 2;

    return x >= padding && x <= d.width - padding &&
           y >= startY && y <= startY + totalH;
  },

  hitTestRect(x, y, rect) {
    return x >= rect.x && x <= rect.x + rect.width &&
           y >= rect.y && y <= rect.y + rect.height;
  },

  hitTestSticker(x, y, stk) {
    const half = (stk.size || 60) / 2;
    return x >= stk.x - half && x <= stk.x + half &&
           y >= stk.y - half && y <= stk.y + half;
  },

  showTextBox() {
    const d = NoorState.design;
    const padding = Math.round(d.width * 0.1);
    const maxW = d.width - padding * 2;

    const canvas = document.getElementById("main-canvas");
    const ctx = canvas.getContext("2d");
    const font = NoorFonts.get(d.text.fontId);
    ctx.font = `400 ${d.text.size}px ${font.family}`;
    const lines = NoorRenderer.wrapText(ctx, d.ayah.text, maxW);
    const lineHeight = d.text.size * (d.text.lineHeight || 1.8);
    const totalH = lines.length * lineHeight;

    this.draw({
      type: "text",
      x: padding,
      y: d.height / 2 - totalH / 2,
      width: maxW,
      height: totalH,
    });
  },

  showImageBox(img, type) {
    this.draw({
      type: type,
      id: img.id,
      x: img.x,
      y: img.y,
      width: img.width,
      height: img.height,
      ref: img,
    });
  },

  showStickerBox(stk) {
    const half = (stk.size || 60) / 2;
    this.draw({
      type: "sticker",
      id: stk.id,
      x: stk.x - half,
      y: stk.y - half,
      width: stk.size,
      height: stk.size,
      ref: stk,
    });
  },

  draw({ type, id, x, y, width, height, ref }) {
    this.hide();

    const stage = document.getElementById("canvas-stage");
    const scale = NoorRenderer.previewScale;

    const box = document.createElement("div");
    box.className = "selection-box";
    box.style.left = (x * scale) + "px";
    box.style.top = (y * scale) + "px";
    box.style.width = (width * scale) + "px";
    box.style.height = (height * scale) + "px";

    box.innerHTML = `
      <button class="selection-handle handle-delete" data-action="delete" title="حذف">×</button>
      <button class="selection-handle handle-rotate" data-action="rotate" title="تدوير">↻</button>
      <button class="selection-handle handle-resize" data-action="resize" title="تكبير">⤢</button>
      <div class="selection-edge edge-top"></div>
      <div class="selection-edge edge-bottom"></div>
      <div class="selection-edge edge-left"></div>
      <div class="selection-edge edge-right"></div>
    `;

    stage.appendChild(box);

    this.active = { type, id, node: box, x, y, width, height, ref };

    // الأحداث
    box.querySelector('[data-action="delete"]')?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.deleteSelected();
    });

    box.querySelector('[data-action="rotate"]')?.addEventListener("click", (e) => {
      e.stopPropagation();
      window.showToast?.("التدوير — قريبًا");
    });

    box.querySelector('[data-action="resize"]')?.addEventListener("click", (e) => {
      e.stopPropagation();
      window.showToast?.("التكبير — قريبًا");
    });
  },

  hide() {
    document.querySelectorAll(".selection-box").forEach((b) => b.remove());
    this.active = null;
  },

  deleteSelected() {
    if (!this.active) return;
    const d = NoorState.design;

    if (this.active.type === "text") {
      d.ayah.text = "";
    } else if (this.active.type === "image" && this.active.id) {
      d.images = (d.images || []).filter((i) => i.id !== this.active.id);
    } else if (this.active.type === "sticker" && this.active.id) {
      d.stickers = (d.stickers || []).filter((s) => s.id !== this.active.id);
    }

    NoorState.pushHistory();
    NoorRenderer.render();
    this.hide();
    window.showToast?.("تم الحذف");
  },
};

document.addEventListener("DOMContentLoaded", () => {
  if (typeof NoorSelection !== "undefined") {
    setTimeout(() => NoorSelection.init(), 500);
  }
});
