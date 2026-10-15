/* =========================================
   NoorKit — Tool: Text Editor (Dark Compact)
   لوحة تحرير نص مظلمة ومضغوطة
   ========================================= */

window.NoorTextEditor = {
  active: false,
  sheetEl: null,
  colorPicker: null,
  tempColor: "#1a1a1a",
  currentTab: null,

  /* ─────────────────────────────────────
     الألوان الجاهزة
     ───────────────────────────────────── */
  COLORS: [
    "#000000", "#ffffff", "#c9a227", "#0d8b5f",
    "#1e40af", "#b91c1c", "#7c3aed", "#f59e0b",
    "#be185d", "#0891b2",
  ],

  /* ─────────────────────────────────────
     الأدوات (الصف السفلي الديناميكي)
     ───────────────────────────────────── */
  TOOLS: {
    default: [
      { id: "font",  icon: "🅰", label: "الخط" },
      { id: "size",  icon: "↕", label: "الحجم" },
      { id: "color", icon: "🎨", label: "اللون" },
      { id: "align", icon: "☰", label: "المحاذاة" },
      { id: "move",  icon: "✥", label: "حركة" },
    ],
  },

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

    return (
      x >= padding &&
      x <= d.width - padding &&
      y >= startY &&
      y <= startY + totalH
    );
  },

  /* ─────────────────────────────────────
     بناء الحاوية مرة واحدة
     ───────────────────────────────────── */
  buildSheet() {
    if (document.getElementById("te-sheet")) return;

    const sheet = document.createElement("div");
    sheet.id = "te-sheet";
    sheet.className = "te-sheet-dark";
    sheet.setAttribute("aria-hidden", "true");
    document.body.appendChild(sheet);

    this.sheetEl = sheet;
  },

  /* ─────────────────────────────────────
     توليد المحتوى الكامل
     ───────────────────────────────────── */
  renderContent() {
    const d = NoorState.design;

    return `
      <!-- ═══ الرأس ═══ -->
      <div class="te-dark-header">
        <button class="te-dark-close" id="te-close" aria-label="إغلاق">✕</button>
        <span class="te-dark-title">تحرير النص</span>
        <span class="te-dark-spacer"></span>
      </div>

      <!-- ═══ الصف العلوي: الأزرار العامة ═══ -->
      <div class="te-dark-toprow">
        <button class="te-dark-action" id="te-edit-text">
          <span class="te-dark-action-label">تعديل</span>
        </button>

        <button class="te-dark-icon-btn" id="te-delete" title="حذف">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
            <path d="M10 11v6M14 11v6"></path>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
          </svg>
        </button>

        <button class="te-dark-icon-btn" id="te-duplicate" title="نسخ">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>

        <button class="te-dark-action te-dark-action-toggle" id="te-brush-toggle">
          <span class="te-dark-action-label">فرشاة</span>
          <span class="te-dark-action-caret">▾</span>
        </button>

        <button class="te-dark-icon-btn" id="te-open-styles" title="الأنماط المتقدمة">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"></path>
          </svg>
        </button>

        <div class="te-dark-size">
          <button class="te-dark-size-btn" data-te-size="minus">−</button>
          <input type="number" class="te-dark-size-input" id="te-quick-size" value="${d.text.size}" min="10" max="999" />
          <button class="te-dark-size-btn" data-te-size="plus">+</button>
        </div>
      </div>

      <!-- ═══ الصف السفلي: الأدوات الديناميكية ═══ -->
      <div class="te-dark-tabs" id="te-dark-tabs">
        ${this.renderTabs("default")}
      </div>

      <!-- ═══ منطقة المحتوى ═══ -->
      <div class="te-dark-content" id="te-dark-content" hidden></div>

      <!-- ═══ زر التأكيد ═══ -->
      <div class="te-dark-footer">
        <button class="te-dark-confirm" id="te-confirm" aria-label="تأكيد">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </button>
      </div>
    `;
  },
   
/* ─────────────────────────────────────
   توليد الأيقونات حسب الأداة
   ───────────────────────────────────── */
renderTabs(toolId) {
  const list = this.TOOLS[toolId] || this.TOOLS["default"];

  return list
    .map((t) => {
      let svgIcon = "";

      if (t.id === "font") {
        svgIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>`;
      } else if (t.id === "size") {
        svgIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 3H3v18h18V3z"></path><path d="M9 9h6v6H9z"></path></svg>`;
      } else if (t.id === "color") {
        svgIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path></svg>`;
      } else if (t.id === "align") {
        svgIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="6" y1="12" x2="18" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
      } else if (t.id === "move") {
        svgIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line></svg>`;
      }

      const isActive = this.currentTab === t.id ? "active" : "";

      return `
        <button class="te-dark-tab ${isActive}" data-te-tab="${t.id}">
          <span class="te-dark-tab-icon">${svgIcon}</span>
          <span class="te-dark-tab-label">${t.label}</span>
        </button>
      `;
    })
    .join("");
},

/* ─────────────────────────────────────
   محتوى كل أداة
   ───────────────────────────────────── */
renderToolContent(toolId) {
  const d = NoorState.design;

  if (toolId === "font") {
    return `
      <div class="te-dark-fonts" id="te-font-grid">
        ${NoorFonts.renderOptions(d.text.fontId)}
      </div>
    `;
  }

  if (toolId === "size") {
    return `
      <div class="te-dark-size-full">
        <div class="te-dark-size-row">
          <button class="te-dark-size-btn-lg" data-te-action="minus">−</button>
          <input type="number" class="te-dark-size-num" id="te-size-num" min="10" max="999" value="${d.text.size}" />
          <button class="te-dark-size-btn-lg" data-te-action="plus">+</button>
        </div>
        <input type="range" class="te-dark-size-slider" id="te-size-slider" min="10" max="999" value="${d.text.size}" />
      </div>
    `;
  }

  if (toolId === "color") {
    const swatches = this.COLORS.map(
      (c) =>
        `<button class="te-dark-color-dot ${d.text.color === c ? "active" : ""}" data-te-color="${c}" style="background:${c};"></button>`
    ).join("");
    return `
      <div class="te-dark-colors" id="te-colors">
        ${swatches}
        <button class="te-dark-color-custom" id="te-color-custom" title="لون مخصص"></button>
      </div>
    `;
  }

  if (toolId === "align") {
    return `
      <div class="te-dark-align" id="te-align-group">
        <button class="te-dark-align-btn ${d.text.align === "right" ? "active" : ""}" data-te-align="right">يمين</button>
        <button class="te-dark-align-btn ${d.text.align === "center" ? "active" : ""}" data-te-align="center">وسط</button>
        <button class="te-dark-align-btn ${d.text.align === "left" ? "active" : ""}" data-te-align="left">يسار</button>
      </div>
    `;
  }

  if (toolId === "move") {
    return `
      <div class="te-dark-move">
        <button class="te-dark-move-btn" data-te-move="up">↑</button>
        <div class="te-dark-move-mid">
          <button class="te-dark-move-btn" data-te-move="left">←</button>
          <button class="te-dark-move-btn" data-te-move="center">⊙</button>
          <button class="te-dark-move-btn" data-te-move="right">→</button>
        </div>
        <button class="te-dark-move-btn" data-te-move="down">↓</button>
      </div>
    `;
  }

  return "";
},

/* ─────────────────────────────────────
   فتح اللوحة
   ───────────────────────────────────── */
open() {
  if (!this.sheetEl) this.buildSheet();
  if (!this.sheetEl) return;

  this.currentTab = null;
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
  this.currentTab = null;

  const modal = document.getElementById("color-picker-modal");
  if (modal) modal.hidden = true;
},

/* ─────────────────────────────────────
   عرض أداة معينة
   ───────────────────────────────────── */
showTool(toolId) {
  const content = document.getElementById("te-dark-content");
  const tabs = document.getElementById("te-dark-tabs");
  if (!content || !tabs) return;

  if (this.currentTab === toolId) {
    this.currentTab = null;
    content.hidden = true;
    content.innerHTML = "";
    tabs.querySelectorAll(".te-dark-tab").forEach((b) =>
      b.classList.remove("active")
    );
    return;
  }

  this.currentTab = toolId;
  tabs.querySelectorAll(".te-dark-tab").forEach((b) => {
    b.classList.toggle("active", b.dataset.teTab === toolId);
  });

  content.innerHTML = this.renderToolContent(toolId);
  content.hidden = false;

  this.bindToolContent(toolId);
},
   
/* ─────────────────────────────────────
   ربط الأحداث العامة
   ───────────────────────────────────── */
bind() {
  const sheet = this.sheetEl;
  if (!sheet) return;

  /* ═══ إغلاق ═══ */
  document.getElementById("te-close")?.addEventListener("click", () => this.close());

  /* ═══ تأكيد ═══ */
  document.getElementById("te-confirm")?.addEventListener("click", () => this.close());

  /* ═══ حذف ═══ */
  document.getElementById("te-delete")?.addEventListener("click", () => {
    NoorState.design.ayah.text = "";
    NoorState.pushHistory();
    NoorRenderer.render();
    this.close();
    window.showToast?.("تم حذف النص");
  });

  /* ═══ نسخ ═══ */
  document.getElementById("te-duplicate")?.addEventListener("click", () => {
    window.showToast?.("النسخ — قريباً");
  });

  /* ═══ تعديل النص ═══ */
  document.getElementById("te-edit-text")?.addEventListener("click", () => {
    const current = NoorState.design.ayah.text || "";
    const newText = prompt("عدّل النص:", current);
    if (newText !== null && newText !== current) {
      NoorState.design.ayah.text = newText;
      NoorState.pushHistory();
      NoorRenderer.render();
    }
  });

  /* ═══ فرشاة ═══ */
  document.getElementById("te-brush-toggle")?.addEventListener("click", () => {
    window.showToast?.("الفرشاة — قريباً");
  });

  /* ═══ ✨ زر الأنماط المتقدمة ═══ */
  document.getElementById("te-open-styles")?.addEventListener("click", () => {
    if (typeof NoorTextStylesPanel !== "undefined") {
      NoorTextStylesPanel.open();
    } else {
      window.showToast?.("الأنماط المتقدمة غير متوفرة");
    }
  });

  /* ═══ الحجم السريع (الصف العلوي) ═══ */
  const quickSize = document.getElementById("te-quick-size");
  quickSize?.addEventListener("change", async () => {
    const val = Math.max(10, Math.min(999, parseInt(quickSize.value) || 64));
    NoorState.design.text.size = val;
    quickSize.value = val;
    NoorState.pushHistory();
    await NoorRenderer.render();
  });

  sheet.querySelectorAll("[data-te-size]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const current = NoorState.design.text.size || 64;
      const step = current < 100 ? 4 : current < 300 ? 10 : 20;
      const next =
        btn.dataset.teSize === "plus" ? current + step : current - step;
      const clamped = Math.max(10, Math.min(999, next));
      NoorState.design.text.size = clamped;
      if (quickSize) quickSize.value = clamped;
      NoorState.pushHistory();
      await NoorRenderer.render();
    });
  });

  /* ═══ التبويبات (الصف السفلي) ═══ */
  sheet.querySelectorAll(".te-dark-tab").forEach((btn) => {
    btn.addEventListener("click", () => this.showTool(btn.dataset.teTab));
  });
},

/* ─────────────────────────────────────
   ربط أحداث محتوى الأداة
   ───────────────────────────────────── */
bindToolContent(toolId) {
  const content = document.getElementById("te-dark-content");
  if (!content) return;

  /* ── الخط ── */
  if (toolId === "font") {
    content.querySelectorAll(".font-option").forEach((btn) => {
      btn.addEventListener("click", async () => {
        content
          .querySelectorAll(".font-option")
          .forEach((b) => b.classList.remove("active"));
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
    const quickSize = document.getElementById("te-quick-size");

    const updateSize = async (val) => {
      const clamped = Math.max(10, Math.min(999, parseInt(val) || 64));
      NoorState.design.text.size = clamped;
      if (slider) slider.value = clamped;
      if (num) num.value = clamped;
      if (quickSize) quickSize.value = clamped;
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
        const next =
          btn.dataset.teAction === "plus" ? current + step : current - step;
        await updateSize(next);
        NoorState.pushHistory();
      });
    });
  }

  /* ── اللون ── */
  if (toolId === "color") {
    content.querySelectorAll("[data-te-color]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        content
          .querySelectorAll("[data-te-color]")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        NoorState.design.text.color = btn.dataset.teColor;
        NoorState.pushHistory();
        await NoorRenderer.render();
      });
    });

    document
      .getElementById("te-color-custom")
      ?.addEventListener("click", () => {
        this.openColorPicker();
      });
  }

  /* ── المحاذاة ── */
  if (toolId === "align") {
    content.querySelectorAll("[data-te-align]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        content
          .querySelectorAll("[data-te-align]")
          .forEach((b) => b.classList.remove("active"));
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
