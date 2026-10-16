/* =========================================
   NoorKit — Text Style: Highlight (v3)
   دوائر صغيرة + منتقي في المقدمة + بدون HEX
   ========================================= */

NoorTextStyles.register("highlight", {
  label: "خلفية",
  icon: "▬",
  order: 6,

  ensure() {
    if (!NoorState.design.text.highlight) {
      NoorState.design.text.highlight = {
        enabled: false,
        color: "#c9a227",
        padding: 12,
        radius: 8,
        opacity: 100,
      };
    }
    if (typeof NoorState.design.text.highlight.opacity !== "number") {
      NoorState.design.text.highlight.opacity = 100;
    }
    return NoorState.design.text.highlight;
  },

  COLORS: [
    "#000000", "#ffffff", "#c9a227", "#7c3aed",
    "#1e40af", "#b91c1c", "#0d8b5f", "#f59e0b",
    "#78350f", "#be185d", "#0891b2", "#78716c",
  ],

  render() {
    const s = this.ensure();

    const colorsHTML = this.COLORS.map(
      (c) =>
        `<button class="nk-color-dot ${s.color === c ? "active" : ""}" data-ts-highlight-color="${c}" style="background:${c};"></button>`
    ).join("");

    return `
      <div class="nk-row">
        <span class="nk-row-label">اللون</span>
      </div>

      <div class="nk-color-row">
        <button class="nk-color-picker-btn" data-ts-highlight-picker></button>
        <div class="nk-color-scroll">${colorsHTML}</div>
      </div>

      <div class="nk-row" style="margin-top:8px;">
        <span class="nk-row-label">الشفافية</span>
        <span class="nk-row-value" id="ts-highlight-op-val">${s.opacity}%</span>
      </div>
      <input type="range" class="ts-slider" id="ts-highlight-op" min="0" max="100" value="${s.opacity}" style="width:100%;margin-bottom:8px;" />

      <div class="nk-row">
        <span class="nk-row-label">الحشو</span>
        <span class="nk-row-value" id="ts-highlight-pad-val">${s.padding}</span>
      </div>
      <input type="range" class="ts-slider" id="ts-highlight-pad" min="0" max="40" value="${s.padding}" style="width:100%;margin-bottom:8px;" />

      <div class="nk-row">
        <span class="nk-row-label">الاستدارة</span>
        <span class="nk-row-value" id="ts-highlight-radius-val">${s.radius}</span>
      </div>
      <input type="range" class="ts-slider" id="ts-highlight-radius" min="0" max="30" value="${s.radius}" style="width:100%;" />
    `;
  },

  bind() {
    const s = this.ensure();

    const setColor = async (color) => {
      s.color = color;
      s.enabled = true;
      NoorTextStyles.updateDotActive("highlight", color);
      NoorState.pushHistory();
      await NoorRenderer.render();
    };

    /* الألوان */
    document.querySelectorAll("[data-ts-highlight-color]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const color = btn.dataset.tsHighlightColor;
        if (s.color === color && s.enabled) {
          s.enabled = false;
          document.querySelectorAll("[data-ts-highlight-color]").forEach((b) =>
            b.classList.remove("active")
          );
          NoorState.pushHistory();
          await NoorRenderer.render();
          return;
        }
        await setColor(color);
      });
    });

    /* منتقي اللون */
    document.querySelector("[data-ts-highlight-picker]")?.addEventListener("click", () => {
      NoorTextStyles.openColorPicker(s.color, async (newColor) => {
        await setColor(newColor);
      });
    });

    /* الشفافية */
    const op = document.getElementById("ts-highlight-op");
    const opVal = document.getElementById("ts-highlight-op-val");
    op?.addEventListener("input", async () => {
      s.opacity = parseInt(op.value);
      if (opVal) opVal.textContent = s.opacity + "%";
      s.enabled = true;
      await NoorRenderer.render();
    });
    op?.addEventListener("change", () => NoorState.pushHistory());

    /* الحشو */
    const pad = document.getElementById("ts-highlight-pad");
    const padVal = document.getElementById("ts-highlight-pad-val");
    pad?.addEventListener("input", async () => {
      s.padding = parseInt(pad.value);
      if (padVal) padVal.textContent = s.padding;
      s.enabled = true;
      await NoorRenderer.render();
    });
    pad?.addEventListener("change", () => NoorState.pushHistory());

    /* الاستدارة */
    const radius = document.getElementById("ts-highlight-radius");
    const radiusVal = document.getElementById("ts-highlight-radius-val");
    radius?.addEventListener("input", async () => {
      s.radius = parseInt(radius.value);
      if (radiusVal) radiusVal.textContent = s.radius;
      s.enabled = true;
      await NoorRenderer.render();
    });
    radius?.addEventListener("change", () => NoorState.pushHistory());
  },
});
