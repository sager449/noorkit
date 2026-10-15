/* =========================================
   NoorKit — Text Styles Panel
   نافذة الأنماط المتقدمة (Bottom Sheet)
   ========================================= */

window.NoorTextStylesPanel = {
  sheetEl: null,
  isOpen: false,

  /* ─────────────────────────────────────
     بناء الحاوية مرة واحدة
     ───────────────────────────────────── */
  build() {
    if (document.getElementById("ts-sheet")) return;

    const sheet = document.createElement("div");
    sheet.id = "ts-sheet";
    sheet.className = "ts-sheet";
    sheet.setAttribute("aria-hidden", "true");
    sheet.innerHTML = `
      <div class="ts-handle"></div>

      <div class="ts-header">
        <button class="ts-close" id="ts-close" aria-label="إغلاق">✕</button>
        <span class="ts-title">الأنماط المتقدمة</span>
        <span class="ts-spacer"></span>
      </div>

      <div class="ts-tabs" id="ts-tabs"></div>

      <div class="ts-content" id="ts-content"></div>
    `;

    document.body.appendChild(sheet);
    this.sheetEl = sheet;

    document.getElementById("ts-close")?.addEventListener("click", () => {
      this.close();
    });
  },

  /* ─────────────────────────────────────
     فتح النافذة
     ───────────────────────────────────── */
  open() {
    if (!this.sheetEl) this.build();
    if (!this.sheetEl) return;

    // ① أغلق لوحة تحرير النص (لتجنب التراكب)
    if (
      typeof NoorTextEditor !== "undefined" &&
      NoorTextEditor.active &&
      typeof NoorTextEditor.close === "function"
    ) {
      NoorTextEditor.close();
    }

    // ② بناء التبويبات
    const tabs = document.getElementById("ts-tabs");
    if (tabs) {
      tabs.innerHTML = NoorTextStyles.renderTabs();
    }

    // ③ تفعيل أول أداة افتراضياً
    const first = NoorTextStyles.getAll()[0];
    if (first && !NoorTextStyles.currentTab) {
      NoorTextStyles.currentTab = first.id;
    }

    // ④ بناء المحتوى
    this.renderCurrent();

    // ⑤ ربط التبويبات
    this.bindTabs();

    // ⑥ فتح النافذة
    this.sheetEl.classList.add("open");
    this.sheetEl.setAttribute("aria-hidden", "false");
    this.isOpen = true;

    // ⑦ رفع الـ canvas
    this.shiftCanvas(true);
  },

  /* ─────────────────────────────────────
     إغلاق النافذة
     ───────────────────────────────────── */
  close() {
    if (!this.sheetEl) return;
    this.sheetEl.classList.remove("open");
    this.sheetEl.setAttribute("aria-hidden", "true");
    this.isOpen = false;

    // إرجاع الـ canvas لمكانه
    this.shiftCanvas(false);
  },

  /* ─────────────────────────────────────
     رفع/إرجاع الـ canvas
     ───────────────────────────────────── */
  shiftCanvas(up) {
    const wrapper =
      document.querySelector(".canvas-wrapper") ||
      document.getElementById("canvas-wrapper");
    if (!wrapper) return;

    if (up) {
      wrapper.classList.add("canvas-shifted");
    } else {
      wrapper.classList.remove("canvas-shifted");
    }
  },

  /* ─────────────────────────────────────
     عرض الأداة الحالية
     ───────────────────────────────────── */
  renderCurrent() {
    const content = document.getElementById("ts-content");
    const tabs = document.getElementById("ts-tabs");
    if (!content || !tabs) return;

    const current = NoorTextStyles.currentTab;
    if (!current) {
      content.innerHTML =
        "<p style='color:#888;text-align:center;padding:20px;'>اختر أداة</p>";
      return;
    }

    // فعّل التبويب
    tabs.querySelectorAll(".ts-tab").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tsTab === current);
    });

    // محتوى
    content.innerHTML = NoorTextStyles.renderContent(current);
    NoorTextStyles.bindContent(current);
  },

  /* ─────────────────────────────────────
     ربط التبويبات
     ───────────────────────────────────── */
  bindTabs() {
    const tabs = document.getElementById("ts-tabs");
    if (!tabs) return;

    tabs.querySelectorAll(".ts-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.tsTab;
        if (!id) return;

        NoorTextStyles.currentTab = id;
        this.renderCurrent();
      });
    });
  },
};

/* ─────────────────────────────────────
   تشغيل تلقائي
   ───────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  if (typeof NoorTextStylesPanel !== "undefined") {
    NoorTextStylesPanel.build();
  }
});
