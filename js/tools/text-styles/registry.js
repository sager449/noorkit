/* =========================================
   NoorKit — Text Styles Registry (v3)
   50+ لون + إدارة الدوائر
   ========================================= */

window.NoorTextStyles = {
  styles: {},
  currentTab: null,

  /* ═══ 56 لوناً مميزاً ═══ */
  COLOR_PALETTE: [
    /* ⚫ رمادي */
    "#000000", "#1a1a1a", "#2a2a2a", "#3a3a3a",
    "#555555", "#78716c", "#888888", "#b0b0b0",
    "#d4d4d4", "#ffffff",

    /* 🟡 ذهبي / أصفر */
    "#c9a227", "#d4af37", "#e6c34a", "#f0d878",
    "#fff8d0", "#f59e0b", "#fbbf24", "#fcd34d",

    /* 🟠 برتقالي / نار */
    "#ea580c", "#f97316", "#fb923c", "#fdba74",
    "#b91c1c", "#dc2626", "#ef4444", "#f87171",
    "#7c1d00", "#c2410c",

    /* 🟤 بني */
    "#78350f", "#a16207", "#b45309", "#92400e",
    "#8b4513", "#a0522d",

    /* 🟢 أخضر */
    "#0d8b5f", "#059669", "#10b981", "#34d399",
    "#65a30d", "#84cc16", "#4ade80", "#166534",

    /* 🔵 أزرق */
    "#1e40af", "#2563eb", "#3b82f6", "#60a5fa",
    "#0891b2", "#06b6d4", "#22d3ee", "#0e7490",

    /* 🟣 بنفسجي */
    "#7c3aed", "#8b5cf6", "#a855f7", "#c084fc",
    "#6366f1", "#818cf8", "#a78bfa", "#4c1d95",

    /* 🩷 وردي */
    "#be185d", "#db2777", "#ec4899", "#f472b6",
    "#e11d48", "#f43f5e", "#fb7185", "#fda4af",
  ],

  register(id, config) {
    this.styles[id] = config;
  },

  get(id) {
    return this.styles[id];
  },

  getAll() {
    return Object.values(this.styles).sort(
      (a, b) => (a.order || 99) - (b.order || 99)
    );
  },

  renderTabs() {
    const list = this.getAll();
    if (list.length === 0) {
      return "<p style='color:#888;text-align:center;padding:20px;'>لا توجد أنماط</p>";
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

  renderContent(id) {
    const style = this.get(id);
    if (!style) return "<p style='color:#888;padding:20px;'>الأداة غير متاحة</p>";
    if (typeof style.render === "function") return style.render();
    return "";
  },

  bindContent(id) {
    const style = this.get(id);
    if (style && typeof style.bind === "function") {
      style.bind();
    }
  },

  refresh() {
    if (this.currentTab) {
      const content = document.getElementById("ts-content");
      if (content) {
        content.innerHTML = this.renderContent(this.currentTab);
        this.bindContent(this.currentTab);
      }
    }
  },

  updateDotActive(styleId, color) {
    const key = `ts${styleId.charAt(0).toUpperCase() + styleId.slice(1)}Color`;
    document.querySelectorAll(`[data-ts-${styleId}-color]`).forEach((b) => {
      b.classList.toggle("active", b.dataset[key] === color);
    });
  },

  /* ─────────────────────────────────────
     منتقي اللون
     ───────────────────────────────────── */
  openColorPicker(initialColor, onConfirm) {
    let modal = document.getElementById("nk-iro-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "nk-iro-modal";
      modal.className = "nk-iro-modal";
      modal.hidden = true;
      modal.innerHTML = `
        <div class="nk-iro-body">
          <div id="nk-iro-picker"></div>
        </div>
        <div class="nk-iro-footer">
          <button class="nk-iro-btn nk-iro-cancel" id="nk-iro-cancel">✕</button>
          <button class="nk-iro-btn nk-iro-confirm" id="nk-iro-confirm">✓</button>
        </div>
      `;
      document.body.appendChild(modal);
      document.getElementById("nk-iro-cancel")?.addEventListener("click", () => {
        modal.hidden = true;
      });
    }

    let currentColor = initialColor || "#ffffff";
    modal.hidden = false;

    setTimeout(() => {
      const container = document.getElementById("nk-iro-picker");
      if (!container || typeof iro === "undefined") return;
      container.innerHTML = "";

      const picker = new iro.ColorPicker(container, {
        width: Math.min(window.innerWidth - 80, 260),
        color: currentColor,
        borderWidth: 0,
        layoutDirection: "horizontal",
        layout: [
          { component: iro.ui.Wheel },
          { component: iro.ui.Slider, options: { sliderType: "value" } },
        ],
      });

      picker.on("color:change", (color) => {
        currentColor = color.hexString;
      });

      const confirmBtn = document.getElementById("nk-iro-confirm");
      if (confirmBtn) {
        const newBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);
        newBtn.addEventListener("click", async () => {
          modal.hidden = true;
          if (typeof onConfirm === "function") await onConfirm(currentColor);
        });
      }
    }, 20);
  },
};
