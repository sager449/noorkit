/* =========================================
   NoorKit — Text Style: Glow (v3)
   بدون زر تشغيل — تفعيل تلقائي
   ========================================= */

NoorTextStyles.register("glow", {
  label: "توهج",
  icon: "✦",
  order: 4,

  ensure() {
    if (!NoorState.design.text.glow) {
      NoorState.design.text.glow = {
        enabled: false,
        color: "#c9a227",
        intensity: 15,
      };
    }
    return NoorState.design.text.glow;
  },

  COLORS: [
    "#c9a227", "#ffffff", "#f59e0b", "#7c3aed",
    "#0891b2", "#0d8b5f", "#b91c1c", "#be185d",
    "#1e40af", "#78350f", "#78716c", "#000000",
  ],

  render() {
    const s = this.ensure();

    const colorsHTML = this.COLORS.map(
      (c) =>
        `<button class="nk-color-dot ${s.color === c ? "active" : ""}" data-ts-glow-color="${c}" style="background:${c};"></button>`
    ).join("");

    return `
      <div class="nk-row">
        <span class="nk-row-label">اللون</span>
      </div>

      <div class="nk-color-row">
        <button class="nk-color-picker-btn" data-ts-glow-picker></button>
        <div class="nk-color-scroll">${colorsHTML}</div>
      </div>

      <div class="nk-row" style="margin-top:8px;">
        <span class="nk-row-label">القوة</span>
        <span class="nk-row-value" id="ts-glow-int-val">${s.intensity}</span>
      </div>
      <input type="range" class="ts-slider" id="ts-glow-int" min="2" max="40" value="${s.intensity}" style="width:100%;" />
    `;
  },

  bind() {
    const s = this.ensure();

    const setColor = async (color) => {
      s.color = color;
      s.enabled = true;
      NoorTextStyles.updateDotActive("glow", color);
      NoorState.pushHistory();
      await NoorRenderer.render();
    };

    document.querySelectorAll("[data-ts-glow-color]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const color = btn.dataset.tsGlowColor;
        if (s.color === color && s.enabled) {
          s.enabled = false;
          document.querySelectorAll("[data-ts-glow-color]").forEach((b) =>
            b.classList.remove("active")
          );
          NoorState.pushHistory();
          await NoorRenderer.render();
          return;
        }
        await setColor(color);
      });
    });

    document.querySelector("[data-ts-glow-picker]")?.addEventListener("click", () => {
      NoorTextStyles.openColorPicker(s.color, async (c) => {
        await setColor(c);
      });
    });

    const intensity = document.getElementById("ts-glow-int");
    const intensityVal = document.getElementById("ts-glow-int-val");
    intensity?.addEventListener("input", async () => {
      s.intensity = parseInt(intensity.value);
      if (intensityVal) intensityVal.textContent = s.intensity;
      s.enabled = true;
      await NoorRenderer.render();
    });
    intensity?.addEventListener("change", () => NoorState.pushHistory());
  },
});
