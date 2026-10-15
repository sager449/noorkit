/* =========================================
   NoorKit — Tool: Text Editor (Bottom Sheet)
   لوحة تحرير النص — تنزلق من الأسفل
   ========================================= */

window.NoorTextEditor = {
  active: false,
  sheetEl: null,
  colorPicker: null,
  tempColor: "#1a1a1a",

  /* ─────────────────────────────────────
     الألوان الجاهزة
     ───────────────────────────────────── */
  COLORS: [
    "#1a1a1a", "#ffffff", "#c9a227", "#0d8b5f",
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

    this.buildSheet();
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

    return x >= padding && x <= d.width - padding &&
           y >= startY && y <= startY + totalH;
  },

  /* ─────────────────────────────────────
     بناء الـ Sheet مرة واحدة
     ───────────────────────────────────── */
  buildSheet() {
    if (document.getElementById("text-editor-sheet")) return;

    const sheet = document.createElement("div");
    sheet.id = "text-editor-sheet";
    sheet.className = "te-sheet";
    sheet.setAttribute("aria-hidden", "true");
    document.body.appendChild(sheet);

    this.sheetEl = sheet;
  },

  /* ─────────────────────────────────────
     توليد المحتوى
     ───────────────────────────────────── */
  renderContent() {
    const d = NoorState.design;
    const fontOptions = NoorFonts.renderOptions(d.text.fontId);
    const colorsHTML = this.COLORS.map(
      (c) =>
        `<button class="te-color-dot ${d.text.color === c ? "active" : ""}" data-te-color="${c}" style="background:${c};"></button>`
    ).join("");

    return `
      <div class="te-handle"></div>

      <div class="te-header">
        <button class="te-close" id="te-close" aria-label="إغلاق">✕</button>
        <span class="te-title">تحرير النص</span>
        <span class="te-spacer"></span>
      </div>

      <div class="te-cards" id="te-cards">

        <!-- بطاقة الخط -->
        <div class="te-card te-card-font">
          <div class="te-card-label">الخط</div>
          <div class="te-card-body te-fonts" id="te-font-grid">
            ${fontOptions}
          </div>
        </div>

        <!-- بطاقة الحجم -->
        <div class="te-card">
          <div class="te-card-label">حجم الخط</div>
          <div class="te-card-body">
            <div class="te-size-row">
              <button class="te-size-btn" data-te-action="minus">−</button>
              <input type="number" class="te-size-num" id="te-size-num" min="10" max="999" value="${d.text.size}" />
              <button class="te-size-btn" data-te-action="plus">+</button>
            </div>
            <input type="range" class="te-size-slider" id="te-size-slider" min="10" max="999" value="${d.text.size}" />
          </div>
        </div>

        <!-- بطاقة اللون -->
        <div class="te-card">
          <div class="te-card-label">لون النص</div>
          <div class="te-card-body">
            <div class="te-colors" id="te-colors">
              ${colorsHTML}
              <button class="te-color-custom" id="te-color-custom" title="لون مخصص"></button>
            </div>
          </div>
        </div>

        <!-- بطاقة المحاذاة -->
        <div class="te-card">
          <div class="te-card-label">المحاذاة</div>
          <div class="te-card-body">
            <div class="te-align-group" id="te-align-group">
              <button class="te-align-btn ${d.text.align === "right" ? "active" : ""}" data-te-align="right">يمين</button>
              <button class="te-align-btn ${d.text.align === "center" ? "active" : ""}" data-te-align="center">وسط</button>
              <button class="te-align-btn ${d.text.align === "left" ? "active" : ""}" data-te-align="left">يسار</button>
            </div>
          </div>
        </div>

        <!-- بطاقة الحذف -->
        <div class="te-card te-card-danger">
          <div class="te-card-label">حذف</div>
          <div class="te-card-body">
            <button class="te-delete-btn" id="te-delete">
              <span>🗑</span>
              <span>حذف النص</span>
            </button>
          </div>
        </div>

      </div>
    `;
  },

  /* ─────────────────────────────────────
     فتح اللوحة
     ───────────────────────────────────── */
  open() {
    if (!this.sheetEl) this.buildSheet();
    if (!this.sheetEl) return;

    this.sheetEl.innerHTML = this.renderContent();
    this.sheetEl.classList.add("open");
    this.sheetEl.setAttribute("aria-hidden", "false");
    this.active = true;

    this.bind();
  },

  /* ─────────────────────────────────────
     إغلاق اللوحة
     ───────────────────────────────────── */
  close() {
    if (!this.sheetEl) return;
    this.sheetEl.classList.remove("open");
    this.sheetEl.setAttribute("aria-hidden", "true");
    this.active = false;

    const modal = document.getElementById("color-picker-modal");
    if (modal) modal.hidden = true;
  },
     /* ─────────────────────────────────────
     ربط الأحداث
     ───────────────────────────────────── */
  bind() {
    const sheet = this.sheetEl;
    if (!sheet) return;

    /* إغلاق */
    document.getElementById("te-close")?.addEventListener("click", () => this.close());

    /* الخط */
    sheet.querySelectorAll("#te-font-grid .font-option").forEach((btn) => {
      btn.addEventListener("click", async () => {
        sheet.querySelectorAll("#te-font-grid .font-option").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        NoorState.design.text.fontId = btn.dataset.font;
        NoorState.pushHistory();
        await NoorRenderer.render();
      });
    });

    /* الحجم */
    const sizeSlider = document.getElementById("te-size-slider");
    const sizeNum = document.getElementById("te-size-num");

    const updateSize = async (val) => {
      const clamped = Math.max(10, Math.min(999, parseInt(val) || 64));
      NoorState.design.text.size = clamped;
      if (sizeSlider) sizeSlider.value = clamped;
      if (sizeNum) sizeNum.value = clamped;
      await NoorRenderer.render();
    };

    sizeSlider?.addEventListener("input", () => updateSize(sizeSlider.value));
    sizeNum?.addEventListener("change", async () => {
      await updateSize(sizeNum.value);
      NoorState.pushHistory();
    });

    sheet.querySelectorAll("[data-te-action]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const action = btn.dataset.teAction;
        const current = NoorState.design.text.size || 64;
        const step = current < 100 ? 4 : current < 300 ? 10 : 20;
        const next = action === "plus" ? current + step : current - step;
        await updateSize(next);
        NoorState.pushHistory();
      });
    });

    /* اللون */
    sheet.querySelectorAll("[data-te-color]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        sheet.querySelectorAll("[data-te-color]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        NoorState.design.text.color = btn.dataset.teColor;
        NoorState.pushHistory();
        await NoorRenderer.render();
      });
    });

    document.getElementById("te-color-custom")?.addEventListener("click", () => {
      this.openColorPicker();
    });

    /* المحاذاة */
    sheet.querySelectorAll("[data-te-align]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        sheet.querySelectorAll("[data-te-align]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        NoorState.design.text.align = btn.dataset.teAlign;
        NoorState.pushHistory();
        await NoorRenderer.render();
      });
    });

    /* حذف */
    document.getElementById("te-delete")?.addEventListener("click", () => {
      NoorState.design.ayah.text = "";
      NoorState.pushHistory();
      NoorRenderer.render();
      this.close();
      window.showToast?.("تم حذف النص");
    });
  },

  /* ─────────────────────────────────────
     منتقي الألوان (iro.js)
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

      const sheet = document.getElementById("text-editor-sheet");
      if (sheet) {
        sheet.querySelectorAll("[data-te-color]").forEach((b) => b.classList.remove("active"));
      }

      window.showToast?.("تم تطبيق اللون");
    });
  },
};

/* ─────────────────────────────────────
   تشغيل تلقائي
   ───────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  if (typeof NoorRenderer !== "undefined" && typeof NoorTextEditor !== "undefined") {
    NoorTextEditor.init();
  }
});
