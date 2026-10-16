/* =========================================
   NoorKit — Text Style: Outline (v3)
   بدون زر تشغيل — تفعيل تلقائي
   ========================================= */

NoorTextStyles.register("outline", {
  label: "حدود",
  icon: "◎",
  order: 2,

  ensure() {
    if (!NoorState.design.text.outline) {
      NoorState.design.text.outline = {
        enabled: false,
        color: "#ffffff",
        width: 2,
      };
    }
    return NoorState.design.text.outline;
  },

  COLORS: [
    "#ffffff", "#000000", "#c9a227", "#7c3aed",
    "#1e40af", "#b91c1c", "#0d8b5f", "#f59e0b",
    "#78350f", "#be185d", "#0891b2", "#78716c",
  ],

  render() {
    const s = this.ensure();

    const colorsHTML = this.COLORS.map(
      (c) =>
        `<button class="nk-color-dot ${s.color === c ? "active" : ""}" data-ts-outline-color="${c}" style="background:${c};"></button>`
    ).join("");

    return `
      <div class="nk-row">
        <span class="nk-row-label">اللون</span>
      </div>

      <div class="nk-color-row">
        <button class="nk-color-picker-btn" data-ts-outline-picker></button>
        <div class="nk-color-scroll">${colorsHTML}</div>
      </div>

      <div class="nk-row" style="margin-top:8px;">
        <span class="nk-row-label">السماكة</span>
        <span class="nk-row-value" id="ts-outline-width-val">${s.width}</span>
      </div>
      <input type="range" class="ts-slider" id="ts-outline-width" min="1" max="12" value="${s.width}" style="width:100%;" />
    `;
  },

  bind() {
    const s = this.ensure();

    const setColor = async (color) => {
      s.color = color;
      s.enabled = true;
      NoorTextStyles.updateDotActive("outline", color);
      NoorState.pushHistory();
      await NoorRenderer.render();
    };

    document.querySelectorAll("[data-ts-outline-color]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const color = btn.dataset.tsOutlineColor;
        if (s.color === color && s.enabled) {
          s.enabled = false;
          document.querySelectorAll("[data-ts-outline-color]").forEach((b) =>
            b.classList.remove("active")
          );
          NoorState.pushHistory();
          await NoorRenderer.render();
          return;
        }
        await setColor(color);
      });
    });

    document.querySelector("[data-ts-outline-picker]")?.addEventListener("click", () => {
      NoorTextStyles.openColorPicker(s.color, async (c) => {
        await setColor(c);
      });
    });

    const width = document.getElementById("ts-outline-width");
    const widthVal = document.getElementById("ts-outline-width-val");
    width?.addEventListener("input", async () => {
      s.width = parseInt(width.value);
      if (widthVal) widthVal.textContent = s.width;
      s.enabled = true;
      await NoorRenderer.render();
    });
    width?.addEventListener("change", () => NoorState.pushHistory());
  },
});
