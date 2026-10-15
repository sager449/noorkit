/* =========================================
   NoorKit — Tool: Text Editor
   لوحة تحرير النص عند الضغط على Canvas
   ========================================= */

window.NoorTextEditor = {
  active: false,
  colorPicker: null,
  tempColor: "#1a1a1a",

  init() {
    const canvas = document.getElementById("main-canvas");
    if (!canvas) return;

    canvas.addEventListener("click", (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / NoorRenderer.previewScale;
      const y = (e.clientY - rect.top) / NoorRenderer.previewScale;

      const d = NoorState.design;
      const padding = Math.round(d.width * 0.1);
      const maxW = d.width - padding * 2;
      const cy = d.height / 2;

      const ctx = canvas.getContext("2d");
      const font = NoorFonts.get(d.text.fontId);
      ctx.font = `400 ${d.text.size}px ${font.family}`;
      const lines = NoorRenderer.wrapText(ctx, d.ayah.text, maxW);
      const lineHeight = d.text.size * (d.text.lineHeight || 1.8);
      const totalH = lines.length * lineHeight;
      const startY = cy - totalH / 2;

      if (x >= padding && x <= d.width - padding &&
          y >= startY && y <= startY + totalH) {
        this.open();
      } else {
        this.close();
      }
    });
  },

  open() {
    this.active = true;
    let panel = document.getElementById("text-editor-panel");
    if (!panel) {
      panel = document.createElement("div");
      panel.id = "text-editor-panel";
      panel.className = "sub-panel";
      document.body.appendChild(panel);
    }

    const d = NoorState.design;
    const font = NoorFonts.get(d.text.fontId);

    panel.innerHTML = `
      <div class="sub-panel-header">
        <span class="sub-panel-title">تحرير النص</span>
        <button class="sub-panel-close" id="text-editor-close" aria-label="إغلاق">×</button>
      </div>

      <div class="panel-row">
        <label class="panel-label">حجم الخط</label>
        <div class="size-control">
          <button class="size-btn" data-te-action="minus">−</button>
          <input type="range" class="size-slider" id="te-size" min="10" max="999" value="${d.text.size}" />
          <button class="size-btn" data-te-action="plus">+</button>
          <input type="number" class="size-number" id="te-size-number" min="10" max="999" value="${d.text.size}" />
        </div>
      </div>

      <div class="panel-row">
        <label class="panel-label">لون النص</label>
        <div class="color-options" id="te-colors">
          ${["#1a1a1a","#ffffff","#c9a227","#0d8b5f","#1e40af","#b91c1c","#7c3aed","#f59e0b","#be185d","#0891b2"].map((c) => `<button class="color-swatch ${d.text.color === c ? "active" : ""}" data-te-color="${c}" style="background:${c};${c === "#ffffff" ? "border:2px solid #e5e5e5;" : ""}"></button>`).join("")}
          <button class="color-custom-btn" id="te-color-custom" title="لون مخصص"></button>
        </div>
      </div>

      <div class="panel-row">
        <button class="action-btn" id="te-delete" style="background:#fee;border-color:#fcc;color:#b91c1c;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
          </svg>
          حذف النص
        </button>
      </div>
    `;

    panel.hidden = false;
    this.bind(panel);
  },

  close() {
    this.active = false;
    const panel = document.getElementById("text-editor-panel");
    if (panel) panel.hidden = true;
    const colorModal = document.getElementById("color-picker-modal");
    if (colorModal) colorModal.hidden = true;
  },

  bind(panel) {
    document.getElementById("text-editor-close")?.addEventListener("click", () => this.close());

    const sizeSlider = document.getElementById("te-size");
    const sizeNumber = document.getElementById("te-size-number");

    const updateSize = async (val) => {
      const clamped = Math.max(10, Math.min(999, parseInt(val) || 64));
      NoorState.design.text.size = clamped;
      if (sizeSlider) sizeSlider.value = clamped;
      if (sizeNumber) sizeNumber.value = clamped;
      await NoorRenderer.render();
    };

    sizeSlider?.addEventListener("input", () => updateSize(sizeSlider.value));
    sizeNumber?.addEventListener("change", async () => {
      await updateSize(sizeNumber.value);
      NoorState.pushHistory();
    });

    panel.querySelectorAll("[data-te-action]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const action = btn.dataset.teAction;
        const current = NoorState.design.text.size || 64;
        const step = current < 100 ? 4 : current < 300 ? 10 : 20;
        const next = action === "plus" ? current + step : current - step;
        await updateSize(next);
        NoorState.pushHistory();
      });
    });

    panel.querySelectorAll("[data-te-color]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        panel.querySelectorAll("[data-te-color]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        NoorState.design.text.color = btn.dataset.teColor;
        NoorState.pushHistory();
        await NoorRenderer.render();
      });
    });

    document.getElementById("te-color-custom")?.addEventListener("click", () => {
      this.openColorPicker();
    });

    document.getElementById("te-delete")?.addEventListener("click", () => {
      NoorState.design.ayah.text = "";
      NoorState.pushHistory();
      NoorRenderer.render();
      this.close();
      window.showToast?.("تم حذف النص");
    });
  },

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

      const panel = document.getElementById("text-editor-panel");
      if (panel) {
        panel.querySelectorAll("[data-te-color]").forEach((b) => b.classList.remove("active"));
      }

      window.showToast?.("تم تطبيق اللون");
    });
  },
};

/* تشغيل تلقائي عند تحميل الصفحة */
document.addEventListener("DOMContentLoaded", () => {
  if (typeof NoorRenderer !== "undefined" && typeof NoorTextEditor !== "undefined") {
    NoorTextEditor.init();
  }
});
