/* =========================================
   NoorKit — Text Style: Highlight
   خلفية ملوّنة خلف النص
   ========================================= */

NoorTextStyles.register("highlight", {
  label: "خلفية",
  icon: "▬",
  order: 6,

  /* ─────────────────────────────────────
     ضمان وجود الإعدادات
     ───────────────────────────────────── */
  ensure() {
    if (!NoorState.design.text.highlight) {
      NoorState.design.text.highlight = {
        enabled: false,
        color: "#c9a227",
        padding: 12,
        radius: 8,
      };
    }
    return NoorState.design.text.highlight;
  },

  /* ─────────────────────────────────────
     الألوان الجاهزة
     ───────────────────────────────────── */
  COLORS: [
    "#c9a227",
    "#ffffff",
    "#000000",
    "#f59e0b",
    "#7c3aed",
    "#1e40af",
    "#0d8b5f",
    "#b91c1c",
    "#be185d",
    "#0891b2",
  ],

  /* ─────────────────────────────────────
     بناء الواجهة
     ───────────────────────────────────── */
  render() {
    const s = this.ensure();

    const colorsHTML = this.COLORS.map(
      (c) =>
        `<button class="ts-color-dot ${s.color === c ? "active" : ""}" data-ts-hl-color="${c}" style="background:${c};"></button>`
    ).join("");

    return `
      <div class="ts-row">
        <label class="ts-label">التشغيل</label>
        <div class="ts-toggle">
          <button class="ts-toggle-btn ${s.enabled ? "active" : ""}" data-ts-hl-toggle="on">تشغيل</button>
          <button class="ts-toggle-btn ${!s.enabled ? "active" : ""}" data-ts-hl-toggle="off">إيقاف</button>
        </div>
      </div>

      <div class="ts-row">
        <label class="ts-label">اللون</label>
        <div class="ts-colors">
          ${colorsHTML}
        </div>
      </div>

      <div class="ts-row">
        <label class="ts-label">الحشو <span class="ts-value" id="ts-hl-pad-val">${s.padding}</span></label>
        <input type="range" class="ts-slider" id="ts-hl-pad" min="0" max="40" value="${s.padding}" />
      </div>

      <div class="ts-row">
        <label class="ts-label">الاستدارة <span class="ts-value" id="ts-hl-radius-val">${s.radius}</span></label>
        <input type="range" class="ts-slider" id="ts-hl-radius" min="0" max="30" value="${s.radius}" />
      </div>
    `;
  },

  /* ─────────────────────────────────────
     ربط الأحداث
     ───────────────────────────────────── */
  bind() {
    const s = this.ensure();

    /* تشغيل / إيقاف */
    document.querySelectorAll("[data-ts-hl-toggle]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        s.enabled = btn.dataset.tsHlToggle === "on";
        document.querySelectorAll("[data-ts-hl-toggle]").forEach((b) =>
          b.classList.remove("active")
        );
        btn.classList.add("active");
        NoorState.pushHistory();
        await NoorRenderer.render();
      });
    });

    /* اللون */
    document.querySelectorAll("[data-ts-hl-color]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        s.color = btn.dataset.tsHlColor;
        document.querySelectorAll("[data-ts-hl-color]").forEach((b) =>
          b.classList.remove("active")
        );
        btn.classList.add("active");
        s.enabled = true;
        NoorState.pushHistory();
        await NoorRenderer.render();
      });
    });

    /* الحشو */
    const pad = document.getElementById("ts-hl-pad");
    const padVal = document.getElementById("ts-hl-pad-val");
    pad?.addEventListener("input", async () => {
      s.padding = parseInt(pad.value);
      if (padVal) padVal.textContent = s.padding;
      s.enabled = true;
      await NoorRenderer.render();
    });
    pad?.addEventListener("change", () => NoorState.pushHistory());

    /* الاستدارة */
    const radius = document.getElementById("ts-hl-radius");
    const radiusVal = document.getElementById("ts-hl-radius-val");
    radius?.addEventListener("input", async () => {
      s.radius = parseInt(radius.value);
      if (radiusVal) radiusVal.textContent = s.radius;
      s.enabled = true;
      await NoorRenderer.render();
    });
    radius?.addEventListener("change", () => NoorState.pushHistory());
  },
});
