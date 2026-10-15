/* =========================================
   NoorKit — Text Style: Gradient
   تدرج لوني للنص
   ========================================= */

NoorTextStyles.register("gradient", {
  label: "تدرج",
  icon: "◐",
  order: 3,

  /* ─────────────────────────────────────
     ضمان وجود الإعدادات
     ───────────────────────────────────── */
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

  /* ─────────────────────────────────────
     التدرجات الجاهزة
     ───────────────────────────────────── */
  PRESETS: [
    { name: "ذهبي",     c1: "#c9a227", c2: "#ffffff" },
    { name: "نار",      c1: "#f59e0b", c2: "#b91c1c" },
    { name: "سماء",     c1: "#0891b2", c2: "#7c3aed" },
    { name: "زمرد",     c1: "#0d8b5f", c2: "#c9a227" },
    { name: "غروب",     c1: "#be185d", c2: "#f59e0b" },
    { name: "فضي",      c1: "#e8e8e8", c2: "#888888" },
  ],

  /* ─────────────────────────────────────
     بناء الواجهة
     ───────────────────────────────────── */
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
      <div class="ts-row">
        <label class="ts-label">التشغيل</label>
        <div class="ts-toggle">
          <button class="ts-toggle-btn ${s.enabled ? "active" : ""}" data-ts-grad-toggle="on">تشغيل</button>
          <button class="ts-toggle-btn ${!s.enabled ? "active" : ""}" data-ts-grad-toggle="off">إيقاف</button>
        </div>
      </div>

      <div class="ts-row">
        <label class="ts-label">تدرجات جاهزة</label>
        <div class="ts-gradient-presets">
          ${presetsHTML}
        </div>
      </div>

      <div class="ts-row">
        <label class="ts-label">اللون الأول</label>
        <div class="ts-color-pick">
          <input type="color" class="ts-color-input" id="ts-grad-c1" value="${s.color1}" />
          <span class="ts-color-code">${s.color1}</span>
        </div>
      </div>

      <div class="ts-row">
        <label class="ts-label">اللون الثاني</label>
        <div class="ts-color-pick">
          <input type="color" class="ts-color-input" id="ts-grad-c2" value="${s.color2}" />
          <span class="ts-color-code">${s.color2}</span>
        </div>
      </div>

      <div class="ts-row">
        <label class="ts-label">الزاوية <span class="ts-value" id="ts-grad-angle-val">${s.angle}°</span></label>
        <input type="range" class="ts-slider" id="ts-grad-angle" min="0" max="360" value="${s.angle}" />
      </div>
    `;
  },

  /* ─────────────────────────────────────
     ربط الأحداث
     ───────────────────────────────────── */
  bind() {
    const s = this.ensure();

    /* تشغيل / إيقاف */
    document.querySelectorAll("[data-ts-grad-toggle]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        s.enabled = btn.dataset.tsGradToggle === "on";
        document.querySelectorAll("[data-ts-grad-toggle]").forEach((b) =>
          b.classList.remove("active")
        );
        btn.classList.add("active");
        NoorState.pushHistory();
        await NoorRenderer.render();
      });
    });

    /* التدرجات الجاهزة */
    document.querySelectorAll("[data-ts-grad-c1]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        s.color1 = btn.dataset.tsGradC1;
        s.color2 = btn.dataset.tsGradC2;
        s.enabled = true;

        const c1 = document.getElementById("ts-grad-c1");
        const c2 = document.getElementById("ts-grad-c2");
        if (c1) c1.value = s.color1;
        if (c2) c2.value = s.color2;

        NoorState.pushHistory();
        await NoorRenderer.render();
      });
    });

    /* اللون الأول */
    const c1 = document.getElementById("ts-grad-c1");
    c1?.addEventListener("input", async () => {
      s.color1 = c1.value;
      s.enabled = true;
      await NoorRenderer.render();
    });
    c1?.addEventListener("change", () => NoorState.pushHistory());

    /* اللون الثاني */
    const c2 = document.getElementById("ts-grad-c2");
    c2?.addEventListener("input", async () => {
      s.color2 = c2.value;
      s.enabled = true;
      await NoorRenderer.render();
    });
    c2?.addEventListener("change", () => NoorState.pushHistory());

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
