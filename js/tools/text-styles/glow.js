/* =========================================
   NoorKit — Text Style: Glow
   توهج خلف النص
   ========================================= */

NoorTextStyles.register("glow", {
  label: "توهج",
  icon: "✦",
  order: 4,

  /* ─────────────────────────────────────
     ضمان وجود الإعدادات
     ───────────────────────────────────── */
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

  /* ─────────────────────────────────────
     الألوان الجاهزة
     ───────────────────────────────────── */
  COLORS: [
    "#c9a227",
    "#ffffff",
    "#f59e0b",
    "#7c3aed",
    "#0891b2",
    "#0d8b5f",
    "#b91c1c",
    "#be185d",
  ],

  /* ─────────────────────────────────────
     بناء الواجهة
     ───────────────────────────────────── */
  render() {
    const s = this.ensure();

    const colorsHTML = this.COLORS.map(
      (c) =>
        `<button class="ts-color-dot ${s.color === c ? "active" : ""}" data-ts-glow-color="${c}" style="background:${c};"></button>`
    ).join("");

    return `
      <div class="ts-row">
        <label class="ts-label">التشغيل</label>
        <div class="ts-toggle">
          <button class="ts-toggle-btn ${s.enabled ? "active" : ""}" data-ts-glow-toggle="on">تشغيل</button>
          <button class="ts-toggle-btn ${!s.enabled ? "active" : ""}" data-ts-glow-toggle="off">إيقاف</button>
        </div>
      </div>

      <div class="ts-row">
        <label class="ts-label">اللون</label>
        <div class="ts-colors">
          ${colorsHTML}
        </div>
      </div>

      <div class="ts-row">
        <label class="ts-label">القوة <span class="ts-value" id="ts-glow-int-val">${s.intensity}</span></label>
        <input type="range" class="ts-slider" id="ts-glow-int" min="2" max="40" value="${s.intensity}" />
      </div>
    `;
  },

  /* ─────────────────────────────────────
     ربط الأحداث
     ───────────────────────────────────── */
  bind() {
    const s = this.ensure();

    /* تشغيل / إيقاف */
    document.querySelectorAll("[data-ts-glow-toggle]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        s.enabled = btn.dataset.tsGlowToggle === "on";
        document.querySelectorAll("[data-ts-glow-toggle]").forEach((b) =>
          b.classList.remove("active")
        );
        btn.classList.add("active");
        NoorState.pushHistory();
        await NoorRenderer.render();
      });
    });

    /* اللون */
    document.querySelectorAll("[data-ts-glow-color]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        s.color = btn.dataset.tsGlowColor;
        document.querySelectorAll("[data-ts-glow-color]").forEach((b) =>
          b.classList.remove("active")
        );
        btn.classList.add("active");
        s.enabled = true;
        NoorState.pushHistory();
        await NoorRenderer.render();
      });
    });

    /* القوة */
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
