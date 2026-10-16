/* =========================================
   NoorKit — Text Style: Gradient (v3)
   بدون زر تشغيل — تفعيل تلقائي
   ========================================= */

NoorTextStyles.register("gradient", {
  label: "تدرج",
  icon: "◐",
  order: 3,

  ensure() {
    if (!NoorState.design.text.gradient) {
      NoorState.design.text.gradient = {
        enabled: false,
        color1: "#c9a227",
        color2: "#ffffff",
        angle: 90,
      };
    }
    return NoorState.design.text.gradient;
  },

  PRESETS: [
    { name: "ذهبي",  c1: "#c9a227", c2: "#ffffff" },
    { name: "نار",   c1: "#f59e0b", c2: "#b91c1c" },
    { name: "سماء",  c1: "#0891b2", c2: "#7c3aed" },
    { name: "زمرد",  c1: "#0d8b5f", c2: "#c9a227" },
    { name: "غروب",  c1: "#be185d", c2: "#f59e0b" },
    { name: "فضي",   c1: "#e8e8e8", c2: "#888888" },
  ],

  render() {
    const s = this.ensure();

    const presetsHTML = this.PRESETS.map(
      (p) => `
        <button class="ts-gradient-preset" data-ts-grad-c1="${p.c1}" data-ts-grad-c2="${p.c2}" title="${p.name}">
          <span style="background:linear-gradient(135deg, ${p.c1} 0%, ${p.c2} 100%);"></span>
        </button>
      `
    ).join("");

    return `
      <div class="nk-row">
        <span class="nk-row-label">تدرجات جاهزة</span>
      </div>
      <div class="ts-gradient-presets">${presetsHTML}</div>

      <div class="nk-row" style="margin-top:10px;">
        <span class="nk-row-label">اللون الأول</span>
        <div class="nk-color-picker-btn" style="background:${s.color1};" data-ts-grad-picker1></div>
      </div>

      <div class="nk-row">
        <span class="nk-row-label">اللون الثاني</span>
        <div class="nk-color-picker-btn" style="background:${s.color2};" data-ts-grad-picker2></div>
      </div>

      <div class="nk-row">
        <span class="nk-row-label">الزاوية</span>
        <span class="nk-row-value" id="ts-grad-angle-val">${s.angle}°</span>
      </div>
      <input type="range" class="ts-slider" id="ts-grad-angle" min="0" max="360" value="${s.angle}" style="width:100%;" />
    `;
  },

  bind() {
    const s = this.ensure();

    /* التدرجات الجاهزة */
    document.querySelectorAll("[data-ts-grad-c1]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        s.color1 = btn.dataset.tsGradC1;
        s.color2 = btn.dataset.tsGradC2;
        s.enabled = true;

        const p1 = document.querySelector("[data-ts-grad-picker1]");
        const p2 = document.querySelector("[data-ts-grad-picker2]");
        if (p1) p1.style.background = s.color1;
        if (p2) p2.style.background = s.color2;

        NoorState.pushHistory();
        await NoorRenderer.render();
      });
    });

    /* اللون الأول */
    document.querySelector("[data-ts-grad-picker1]")?.addEventListener("click", () => {
      NoorTextStyles.openColorPicker(s.color1, async (c) => {
        s.color1 = c;
        s.enabled = true;
        const p1 = document.querySelector("[data-ts-grad-picker1]");
        if (p1) p1.style.background = c;
        NoorState.pushHistory();
        await NoorRenderer.render();
      });
    });

    /* اللون الثاني */
    document.querySelector("[data-ts-grad-picker2]")?.addEventListener("click", () => {
      NoorTextStyles.openColorPicker(s.color2, async (c) => {
        s.color2 = c;
        s.enabled = true;
        const p2 = document.querySelector("[data-ts-grad-picker2]");
        if (p2) p2.style.background = c;
        NoorState.pushHistory();
        await NoorRenderer.render();
      });
    });

    /* الزاوية */
    const angle = document.getElementById("ts-grad-angle");
    const angleVal = document.getElementById("ts-grad-angle-val");
    angle?.addEventListener("input", async () => {
      s.angle = parseInt(angle.value);
      if (angleVal) angleVal.textContent = s.angle + "°";
      s.enabled = true;
      await NoorRenderer.render();
    });
    angle?.addEventListener("change", () => NoorState.pushHistory());
  },
});
