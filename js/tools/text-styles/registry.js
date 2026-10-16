/* =========================================
   NoorKit — Text Styles Registry (v2)
   + منتقي لون موحد + إدارة الدوائر المحددة
   ========================================= */

window.NoorTextStyles = {
  styles: {},
  currentTab: null,

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

  /* ─────────────────────────────────────
     إدارة الدوائر المحددة
     ───────────────────────────────────── */
  updateDotActive(styleId, color) {
    const key = `ts${styleId.charAt(0).toUpperCase() + styleId.slice(1)}Color`;
    document.querySelectorAll(`[data-ts-${styleId}-color]`).forEach((b) => {
      b.classList.toggle("active", b.dataset[key] === color);
    });
  },

  /* ─────────────────────────────────────
     منتقي اللون الموحد (iro.js)
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
          if (typeof onConfirm === "function") {
            await onConfirm(currentColor);
          }
        });
      }
    }, 20);
  },
};
