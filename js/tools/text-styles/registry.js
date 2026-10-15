/* =========================================
   NoorKit — Text Styles Registry
   سجل الأنماط المتقدمة للنص
   ========================================= */

window.NoorTextStyles = {
  styles: {},
  currentTab: null,

  /* ─────────────────────────────────────
     تسجيل نمط جديد
     ───────────────────────────────────── */
  register(id, config) {
    this.styles[id] = config;
  },

  /* ─────────────────────────────────────
     الحصول على نمط
     ───────────────────────────────────── */
  get(id) {
    return this.styles[id];
  },

  /* ─────────────────────────────────────
     الحصول على كل الأنماط
     ───────────────────────────────────── */
  getAll() {
    return Object.values(this.styles).sort(
      (a, b) => (a.order || 99) - (b.order || 99)
    );
  },

  /* ─────────────────────────────────────
     توليد صف التبويبات (الأيقونات)
     ───────────────────────────────────── */
  renderTabs() {
    const list = this.getAll();
    if (list.length === 0) {
      return "<p style='color:#888;text-align:center;padding:20px;'>لا توجد أنماط مسجلة</p>";
    }

    return list
      .map((s) => {
        const isActive = this.currentTab === s.id ? "active" : "";
        return `
          <button class="ts-tab ${isActive}" data-ts-tab="${s.id}">
            <span class="ts-tab-icon">${s.icon || "◆"}</span>
            <span class="ts-tab-label">${s.label || s.id}</span>
          </button>
        `;
      })
      .join("");
  },

  /* ─────────────────────────────────────
     توليد محتوى الأداة الحالية
     ───────────────────────────────────── */
  renderContent(id) {
    const style = this.get(id);
    if (!style) {
      return "<p style='color:#888;text-align:center;padding:20px;'>الأداة غير متاحة</p>";
    }
    if (typeof style.render === "function") {
      return style.render();
    }
    return "";
  },

  /* ─────────────────────────────────────
     ربط أحداث الأداة الحالية
     ───────────────────────────────────── */
  bindContent(id) {
    const style = this.get(id);
    if (style && typeof style.bind === "function") {
      style.bind();
    }
  },

  /* ─────────────────────────────────────
     تحديث الأداة الحالية (عند تغيير أي قيمة)
     ───────────────────────────────────── */
  refresh() {
    if (this.currentTab) {
      const content = document.getElementById("ts-content");
      if (content) {
        content.innerHTML = this.renderContent(this.currentTab);
        this.bindContent(this.currentTab);
      }
    }
  },
};
