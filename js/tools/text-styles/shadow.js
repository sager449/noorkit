/* =========================================
   NoorKit — Text Style: Shadow (v3)
   دوائر صغيرة + منتقي في المقدمة + بدون HEX
   ========================================= */

NoorTextStyles.register("shadow", {
  label: "ظل",
  icon: "☁",
  order: 1,

  ensure() {
    if (!NoorState.design.text.shadow) {
      NoorState.design.text.shadow = {
        enabled: false,
        color: "#000000",
        blur: 8,
        x: 0,
        y: 4,
        opacity: 100,
      };
    }
    if (typeof NoorState.design.text.shadow.opacity !== "number") {
      NoorState.design.text.shadow.opacity = 100;
    }
    return NoorState.design.text.shadow;
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
        `<button class="nk-color-dot ${s.color === c ? "active" : ""}" data-ts-shadow-color="${c}" style="background:${c};"></button>`
    ).join("");

    return `
      <div class="nk-row">
        <span class="nk-row-label">اللون</span>
      </div>

      <div class="nk-color-row">
        <button class="nk-color-picker-btn" data-ts-shadow-picker></button>
        <div class="nk-color-scroll">${colorsHTML}</div>
      </div>

      <div class="nk-row" style="margin-top:8px;">
        <span class="nk-row-label">الشفافية</span>
        <span class="nk-row-value" id="ts-shadow-op-val">${s.opacity}%</span>
      </div>
      <input type="range" class="ts-slider" id="ts-shadow-op" min="0" max="100" value="${s.opacity}" style="width:100%;margin-bottom:8px;" />

      <div class="nk-row">
        <span class="nk-row-label">الضبابية</span>
        <span class="nk-row-value" id="ts-shadow-blur-val">${s.blur}</span>
      </div>
      <input type="range" class="ts-slider" id="ts-shadow-blur" min="0" max="40" value="${s.blur}" style="width:100%;margin-bottom:8px;" />

      <div class="nk-row">
        <span class="nk-row-label">إزاحة أفقية</span>
        <span class="nk-row-value" id="ts-shadow-x-val">${s.x}</span>
      </div>
      <input type="range" class="ts-slider" id="ts-shadow-x" min="-30" max="30" value="${s.x}" style="width:100%;margin-bottom:8px;" />

      <div class="nk-row">
        <span class="nk-row-label">إزاحة رأسية</span>
        <span class="nk-row-value" id="ts-shadow-y-val">${s.y}</span>
      </div>
      <input type="range" class="ts-slider" id="ts-shadow-y" min="-30" max="30" value="${s.y}" style="width:100%;" />
    `;
  },

  bind() {
    const s = this.ensure();

    const setColor = async (color) => {
      s.color = color;
      s.enabled = true;
      NoorTextStyles.updateDotActive("shadow", color);
      NoorState.pushHistory();
      await NoorRenderer.render();
    };

    /* الألوان */
    document.querySelectorAll("[data-ts-shadow-color]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const color = btn.dataset.tsShadowColor;
        /* نفس اللون → إلغاء */
        if (s.color === color && s.enabled) {
          s.enabled = false;
          document.querySelectorAll("[data-ts-shadow-color]").forEach((b) =>
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
    document.querySelector("[data-ts-shadow-picker]")?.addEventListener("click", () => {
      NoorTextStyles.openColorPicker(s.color, async (newColor) => {
        await setColor(newColor);
      });
    });

    /* الشفافية */
    const op = document.getElementById("ts-shadow-op");
    const opVal = document.getElementById("ts-shadow-op-val");
    op?.addEventListener("input", async () => {
      s.opacity = parseInt(op.value);
      if (opVal) opVal.textContent = s.opacity + "%";
      s.enabled = true;
      await NoorRenderer.render();
    });
    op?.addEventListener("change", () => NoorState.pushHistory());

    /* الضبابية */
    const blur = document.getElementById("ts-shadow-blur");
    const blurVal = document.getElementById("ts-shadow-blur-val");
    blur?.addEventListener("input", async () => {
      s.blur = parseInt(blur.value);
      if (blurVal) blurVal.textContent = s.blur;
      s.enabled = true;
      await NoorRenderer.render();
    });
    blur?.addEventListener("change", () => NoorState.pushHistory());

    /* إزاحة X */
    const x = document.getElementById("ts-shadow-x");
    const xVal = document.getElementById("ts-shadow-x-val");
    x?.addEventListener("input", async () => {
      s.x = parseInt(x.value);
      if (xVal) xVal.textContent = s.x;
      s.enabled = true;
      await NoorRenderer.render();
    });
    x?.addEventListener("change", () => NoorState.pushHistory());

    /* إزاحة Y */
    const y = document.getElementById("ts-shadow-y");
    const yVal = document.getElementById("ts-shadow-y-val");
    y?.addEventListener("input", async () => {
      s.y = parseInt(y.value);
      if (yVal) yVal.textContent = s.y;
      s.enabled = true;
      await NoorRenderer.render();
    });
    y?.addEventListener("change", () => NoorState.pushHistory());
  },
});
