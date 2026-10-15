/* =========================================
   NoorKit — Text Style: Shadow
   ظل النص
   ========================================= */

NoorTextStyles.register("shadow", {
  label: "ظل",
  icon: "☁",
  order: 1,

  /* ─────────────────────────────────────
     ضمان وجود الإعدادات
     ───────────────────────────────────── */
  ensure() {
    if (!NoorState.design.text.shadow) {
      NoorState.design.text.shadow = {
        enabled: false,
        color: "#000000",
        blur: 8,
        x: 0,
        y: 4,
      };
    }
    return NoorState.design.text.shadow;
  },

  /* ─────────────────────────────────────
     الألوان الجاهزة
     ───────────────────────────────────── */
  COLORS: [
    "#000000",
    "#ffffff",
    "#c9a227",
    "#7c3aed",
    "#1e40af",
    "#b91c1c",
  ],

  /* ─────────────────────────────────────
     بناء الواجهة
     ───────────────────────────────────── */
  render() {
    const s = this.ensure();

    const colorsHTML = this.COLORS.map(
      (c) =>
        `<button class="ts-color-dot ${s.color === c ? "active" : ""}" data-ts-shadow-color="${c}" style="background:${c};"></button>`
    ).join("");

    return `
      <div class="ts-row">
        <label class="ts-label">التشغيل</label>
        <div class="ts-toggle">
          <button class="ts-toggle-btn ${s.enabled ? "active" : ""}" data-ts-shadow-toggle="on">تشغيل</button>
          <button class="ts-toggle-btn ${!s.enabled ? "active" : ""}" data-ts-shadow-toggle="off">إيقاف</button>
        </div>
      </div>

      <div class="ts-row">
        <label class="ts-label">اللون</label>
        <div class="ts-colors">
          ${colorsHTML}
        </div>
      </div>

      <div class="ts-row">
        <label class="ts-label">الضبابية <span class="ts-value" id="ts-shadow-blur-val">${s.blur}</span></label>
        <input type="range" class="ts-slider" id="ts-shadow-blur" min="0" max="40" value="${s.blur}" />
      </div>

      <div class="ts-row">
        <label class="ts-label">إزاحة أفقية <span class="ts-value" id="ts-shadow-x-val">${s.x}</span></label>
        <input type="range" class="ts-slider" id="ts-shadow-x" min="-30" max="30" value="${s.x}" />
      </div>

      <div class="ts-row">
        <label class="ts-label">إزاحة رأسية <span class="ts-value" id="ts-shadow-y-val">${s.y}</span></label>
        <input type="range" class="ts-slider" id="ts-shadow-y" min="-30" max="30" value="${s.y}" />
      </div>
    `;
  },

  /* ─────────────────────────────────────
     ربط الأحداث
     ───────────────────────────────────── */
  bind() {
    const s = this.ensure();

    /* تشغيل / إيقاف */
    document.querySelectorAll("[data-ts-shadow-toggle]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        s.enabled = btn.dataset.tsShadowToggle === "on";
        document.querySelectorAll("[data-ts-shadow-toggle]").forEach((b) =>
          b.classList.remove("active")
        );
        btn.classList.add("active");
        NoorState.pushHistory();
        await NoorRenderer.render();
      });
    });

    /* اللون */
    document.querySelectorAll("[data-ts-shadow-color]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        s.color = btn.dataset.tsShadowColor;
        document.querySelectorAll("[data-ts-shadow-color]").forEach((b) =>
          b.classList.remove("active")
        );
        btn.classList.add("active");
        s.enabled = true;
        NoorState.pushHistory();
        await NoorRenderer.render();
      });
    });

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
