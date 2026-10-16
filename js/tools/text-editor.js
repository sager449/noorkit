/* =========================================
   NoorKit — Tool: Text Editor (v3)
   محرر نص مبسط — يعتمد على NoorToolbar
   ========================================= */

window.NoorTextEditor = {
  active: false,
  colorPicker: null,
  tempColor: "#1a1a1a",

  /* ─── الألوان الجاهزة ─── */
  COLORS: [
    "#000000", "#ffffff", "#c9a227", "#0d8b5f",
    "#1e40af", "#b91c1c", "#7c3aed", "#f59e0b",
    "#be185d", "#0891b2",
  ],

  /* ─────────────────────────────────────
     التهيئة
     ───────────────────────────────────── */
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

  /* ─────────────────────────────────────
     اختبار الضغط على النص
     ───────────────────────────────────── */
  hitTestText(x, y) {
    const d = NoorState.design;
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

    return (
      x >= padding &&
      x <= d.width - padding &&
      y >= startY &&
      y <= startY + totalH
    );
  },

  /* ─────────────────────────────────────
     فتح — يُفعّل شريط النص
     ───────────────────────────────────── */
  open() {
    this.active = true;
    if (typeof NoorToolbar !== "undefined") {
      NoorToolbar.selectPrimary("ayah");
    }
  },

  /* ─────────────────────────────────────
     إغلاق
     ───────────────────────────────────── */
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

  /* ─────────────────────────────────────
     محتوى الأدوات الأساسية
     (يُستدعى من NoorToolbar.openMiniSheet)
     ───────────────────────────────────── */
  renderToolContent(toolId) {
    const d = NoorState.design;

    if (toolId === "font") {
      return `
        <div class="te-fonts" id="te-font-grid">
          ${NoorFonts.renderOptions(d.text.fontId)}
        </div>
      `;
    }

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

    if (toolId === "color") {
      const swatches = this.COLORS.map(
        (c) =>
          `<button class="te-color-dot ${d.text.color === c ? "active" : ""}" data-te-color="${c}" style="background:${c};"></button>`
      ).join("");
      return `
        <div class="te-colors">
          ${swatches}
          <button class="te-color-custom" id="te-color-custom" title="لون مخصص"></button>
        </div>
      `;
    }

    if (toolId === "align") {
      return `
        <div class="te-align-group">
          <button class="te-align-btn ${d.text.align === "right" ? "active" : ""}" data-te-align="right">يمين</button>
          <button class="te-align-btn ${d.text.align === "center" ? "active" : ""}" data-te-align="center">وسط</button>
          <button class="te-align-btn ${d.text.align === "left" ? "active" : ""}" data-te-align="left">يسار</button>
        </div>
      `;
    }

    if (toolId === "move") {
      return `
        <div class="te-move">
          <button class="te-move-btn" data-te-move="up">↑</button>
          <div class="te-move-mid">
            <button class="te-move-btn" data-te-move="left">←</button>
            <button class="te-move-btn" data-te-move="center">⊙</button>
            <button class="te-move-btn" data-te-move="right">→</button>
          </div>
          <button class="te-move-btn" data-te-move="down">↓</button>
        </div>
      `;
    }

    return "";
  },

  /* ─────────────────────────────────────
     ربط أحداث محتوى الأدوات الأساسية
     ───────────────────────────────────── */
  bindToolContent(toolId) {
    const content = document.getElementById("nk-mini-content");
    if (!content) return;

    /* ── الخط ── */
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

    /* ── الحجم ── */
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

    /* ── اللون ── */
    if (toolId === "color") {
      content.querySelectorAll("[data-te-color]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          content.querySelectorAll("[data-te-color]").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          NoorState.design.text.color = btn.dataset.teColor;
          NoorState.pushHistory();
          await NoorRenderer.render();
        });
      });

      document.getElementById("te-color-custom")?.addEventListener("click", () => {
        this.openColorPicker();
      });
    }

    /* ── المحاذاة ── */
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

    /* ── الحركة ── */
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
    }
  },
     /* ─────────────────────────────────────
     منتقي الألوان
     ───────────────────────────────────── */
  openColorPicker() {
    let modal = document.getElementById("color-picker-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "color-picker-modal";
      modal.className = "color-picker-modal";
      document.body.appendChild(modal);
    }

    this.tempColor = NoorState.design.text.color || "#1a1a1a";

    modal.innerHTML = `
      <div class="color-picker-inner">
        <div class="color-picker-title">اختر لونًا</div>
        <div class="color-picker-body">
          <div id="iro-picker"></div>
        </div>
        <div class="color-picker-footer">
          <button class="color-picker-cancel" id="cp-cancel">إلغاء</button>
          <button class="color-picker-confirm" id="cp-confirm">تطبيق</button>
        </div>
      </div>
    `;

    modal.hidden = false;

    setTimeout(() => {
      const container = document.getElementById("iro-picker");
      if (!container || typeof iro === "undefined") return;

      this.colorPicker = new iro.ColorPicker(container, {
        width: 220,
        color: this.tempColor,
        borderWidth: 0,
        layoutDirection: "horizontal",
        layout: [
          { component: iro.ui.Wheel },
          { component: iro.ui.Slider, options: { sliderType: "value" } },
        ],
      });

      this.colorPicker.on("color:change", (color) => {
        this.tempColor = color.hexString;
      });
    }, 50);

    document.getElementById("cp-cancel")?.addEventListener("click", () => {
      modal.hidden = true;
    });

    document.getElementById("cp-confirm")?.addEventListener("click", async () => {
      NoorState.design.text.color = this.tempColor;
      NoorState.pushHistory();
      await NoorRenderer.render();
      modal.hidden = true;
      window.showToast?.("تم تطبيق اللون");
    });
  },
};

/* ─────────────────────────────────────
   تشغيل تلقائي
   ───────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  if (
    typeof NoorRenderer !== "undefined" &&
    typeof NoorTextEditor !== "undefined"
  ) {
    NoorTextEditor.init();
  }
});
