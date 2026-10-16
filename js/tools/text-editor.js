/* =========================================
   NoorKit — Tool: Text Editor (v7)
   لوحة حركة مصححة + منتقي لون موحد
   ========================================= */

window.NoorTextEditor = {
  active: false,

  COLORS: [
    "#000000", "#ffffff", "#c9a227", "#7c3aed",
    "#1e40af", "#b91c1c", "#0d8b5f", "#f59e0b",
    "#78350f", "#be185d", "#0891b2", "#78716c",
  ],

  init() {
    const canvas = document.getElementById("main-canvas");
    if (!canvas) return;

    canvas.addEventListener("click", (e) => {
      const rect = canvas.getBoundingClientRect();
      const scale = NoorRenderer.previewScale;
      const x = (e.clientX - rect.left) / scale;
      const y = (e.clientY - rect.top) / scale;

      if (this.hitTestText(x, y)) {
        this.open();
      } else {
        this.close();
      }
    });
  },

  hitTestText(x, y) {
    const d = NoorState.design;
    if (!d.ayah.text) return false;

    const padding = Math.round(d.width * 0.1);
    const maxW = d.width - padding * 2;
    const cy = d.ayah.y || d.height / 2;

    const canvas = document.getElementById("main-canvas");
    const ctx = canvas.getContext("2d");
    const font = NoorFonts.get(d.text.fontId);
    ctx.font = `400 ${d.text.size}px ${font.family}`;
    const lines = NoorRenderer.wrapText(ctx, d.ayah.text, maxW);
    const lineHeight = d.text.size * (d.text.lineHeight || 1.8);
    const totalH = lines.length * lineHeight;
    const startY = cy - totalH / 2;

    return (
      x >= padding &&
      x <= d.width - padding &&
      y >= startY &&
      y <= startY + totalH
    );
  },

  open() {
    this.active = true;
    if (typeof NoorToolbar !== "undefined") {
      NoorToolbar.selectPrimary("ayah");
    }
  },

  close() {
    this.active = false;
    if (typeof NoorToolbar !== "undefined") {
      NoorToolbar.activePrimary = null;
      NoorToolbar.activeSecondary = null;
      const bar = document.getElementById("nk-toolbar-primary");
      if (bar) {
        bar.querySelectorAll(".nk-tool-btn").forEach((b) => b.classList.remove("active"));
      }
      NoorToolbar.hideSecondary();
      NoorToolbar.closeMiniSheet();
    }
  },

  renderToolContent(toolId) {
    const d = NoorState.design;

    /* ═══ الخط ═══ */
    if (toolId === "font") {
      return `
        <div class="te-fonts" id="te-font-grid">
          ${NoorFonts.renderOptions(d.text.fontId)}
        </div>
      `;
    }

    /* ═══ الحجم ═══ */
    if (toolId === "size") {
      return `
        <div class="te-size-full">
          <div class="te-size-row">
            <button class="te-size-btn-lg" data-te-action="minus">−</button>
            <input type="number" class="te-size-num" id="te-size-num" min="10" max="999" value="${d.text.size}" />
            <button class="te-size-btn-lg" data-te-action="plus">+</button>
          </div>
          <input type="range" class="te-size-slider" id="te-size-slider" min="10" max="999" value="${d.text.size}" />
        </div>
      `;
    }

    /* ═══ اللون ═══ */
    if (toolId === "color") {
      const swatches = this.COLORS.map(
        (c) =>
          `<button class="nk-color-dot ${d.text.color === c ? "active" : ""}" data-te-color="${c}" style="background:${c};"></button>`
      ).join("");
      return `
        <div class="nk-row">
          <span class="nk-row-label">اللون</span>
        </div>
        <div class="nk-color-row">
          <button class="nk-color-picker-btn" data-te-color-picker></button>
          <div class="nk-color-scroll">${swatches}</div>
        </div>
      `;
    }

    /* ═══ المحاذاة ═══ */
    if (toolId === "align") {
      return `
        <div class="te-align-group">
          <button class="te-align-btn ${d.text.align === "right" ? "active" : ""}" data-te-align="right">يمين</button>
          <button class="te-align-btn ${d.text.align === "center" ? "active" : ""}" data-te-align="center">وسط</button>
          <button class="te-align-btn ${d.text.align === "left" ? "active" : ""}" data-te-align="left">يسار</button>
        </div>
      `;
    }

    /* ═══ الحركة (مصححة) ═══ */
    if (toolId === "move") {
      const rotation = d.ayah.rotation || 0;
      return `
        <div class="te-move-grid">

          <!-- الأسهم -->
          <div class="te-move-col">
            <div class="te-move-label">الحركة</div>
            <div class="te-arrows-grid">
              <div></div>
              <button class="te-arrow-btn" data-te-move="up">↑</button>
              <div></div>
              <button class="te-arrow-btn" data-te-move="left">←</button>
              <button class="te-arrow-btn" data-te-move="center">⊙</button>
              <button class="te-arrow-btn" data-te-move="right">→</button>
              <div></div>
              <button class="te-arrow-btn" data-te-move="down">↓</button>
              <div></div>
            </div>
          </div>

          <!-- التدوير -->
          <div class="te-move-col">
            <div class="te-move-label">التدوير</div>
            <div class="te-rotate-row">
              <button class="te-rotate-btn" data-te-rotate="-15">−</button>
              <input type="number" class="te-rotate-num" id="te-rotate-num" value="${rotation}" min="-360" max="360" />
              <button class="te-rotate-btn" data-te-rotate="15">+</button>
            </div>
            <button class="te-rotate-reset" data-te-rotate="reset">إعادة الصفر</button>
          </div>

        </div>
      `;
    }

    return "";
  },

  bindToolContent(toolId) {
    const content = document.getElementById("nk-mini-content");
    if (!content) return;

    /* ═══ الخط ═══ */
    if (toolId === "font") {
      content.querySelectorAll(".font-option").forEach((btn) => {
        btn.addEventListener("click", async () => {
          content.querySelectorAll(".font-option").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          NoorState.design.text.fontId = btn.dataset.font;
          NoorState.pushHistory();
          await NoorRenderer.render();
        });
      });
    }

    /* ═══ الحجم ═══ */
    if (toolId === "size") {
      const slider = document.getElementById("te-size-slider");
      const num = document.getElementById("te-size-num");

      const updateSize = async (val) => {
        const clamped = Math.max(10, Math.min(999, parseInt(val) || 64));
        NoorState.design.text.size = clamped;
        if (slider) slider.value = clamped;
        if (num) num.value = clamped;
        await NoorRenderer.render();
      };

      slider?.addEventListener("input", () => updateSize(slider.value));
      num?.addEventListener("change", async () => {
        await updateSize(num.value);
        NoorState.pushHistory();
      });

      content.querySelectorAll("[data-te-action]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const current = NoorState.design.text.size || 64;
          const step = current < 100 ? 4 : current < 300 ? 10 : 20;
          const next = btn.dataset.teAction === "plus" ? current + step : current - step;
          await updateSize(next);
          NoorState.pushHistory();
        });
      });
    }

    /* ═══ اللون ═══ */
    if (toolId === "color") {
      const setColor = async (color) => {
        NoorState.design.text.color = color;
        NoorTextStyles.updateDotActive("te", color);
        NoorState.pushHistory();
        await NoorRenderer.render();
      };

      content.querySelectorAll("[data-te-color]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          content.querySelectorAll("[data-te-color]").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          await setColor(btn.dataset.teColor);
        });
      });

      content.querySelector("[data-te-color-picker]")?.addEventListener("click", () => {
        NoorTextStyles.openColorPicker(NoorState.design.text.color, async (c) => {
          await setColor(c);
        });
      });
    }

    /* ═══ المحاذاة ═══ */
    if (toolId === "align") {
      content.querySelectorAll("[data-te-align]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          content.querySelectorAll("[data-te-align]").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          NoorState.design.text.align = btn.dataset.teAlign;
          NoorState.pushHistory();
          await NoorRenderer.render();
        });
      });
    }

    /* ═══ الحركة ═══ */
    if (toolId === "move") {
      const step = 20;
      const d = NoorState.design;

      content.querySelectorAll("[data-te-move]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const dir = btn.dataset.teMove;
          if (dir === "up") d.ayah.y = (d.ayah.y || d.height / 2) - step;
          if (dir === "down") d.ayah.y = (d.ayah.y || d.height / 2) + step;
          if (dir === "left") d.ayah.x = (d.ayah.x || d.width / 2) - step;
          if (dir === "right") d.ayah.x = (d.ayah.x || d.width / 2) + step;
          if (dir === "center") {
            d.ayah.x = d.width / 2;
            d.ayah.y = d.height / 2;
          }
          NoorState.pushHistory();
          await NoorRenderer.render();
        });
      });

      const rotNum = document.getElementById("te-rotate-num");

      const setRotation = async (val) => {
        const clamped = Math.max(-360, Math.min(360, parseInt(val) || 0));
        d.ayah.rotation = clamped;
        if (rotNum) rotNum.value = clamped;
        await NoorRenderer.render();
      };

      content.querySelectorAll("[data-te-rotate]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const action = btn.dataset.teRotate;
          if (action === "reset") {
            await setRotation(0);
          } else {
            const current = d.ayah.rotation || 0;
            await setRotation(current + parseInt(action));
          }
          NoorState.pushHistory();
        });
      });

      rotNum?.addEventListener("change", async () => {
        await setRotation(rotNum.value);
        NoorState.pushHistory();
      });
    }
  },
};

document.addEventListener("DOMContentLoaded", () => {
  if (
    typeof NoorRenderer !== "undefined" &&
    typeof NoorTextEditor !== "undefined"
  ) {
    NoorTextEditor.init();
  }
});
