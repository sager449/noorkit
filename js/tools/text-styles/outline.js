/* =========================================
   NoorKit — Text Style: Outline
   حدود النص (Stroke)
   ========================================= */

NoorTextStyles.register("outline", {
  label: "حدود",
  icon: "◎",
  order: 2,

  /* ─────────────────────────────────────
     ضمان وجود الإعدادات
     ───────────────────────────────────── */
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

  /* ─────────────────────────────────────
     الألوان الجاهزة
     ───────────────────────────────────── */
  COLORS: [
    "#ffffff",
    "#000000",
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
        `<button class="ts-color-dot ${s.color === c ? "active" : ""}" data-ts-outline-color="${c}" style="background:${c};"></button>`
    ).join("");

    return `
      <div class="ts-row">
        <label class="ts-label">التشغيل</label>
        <div class="ts-toggle">
          <button class="ts-toggle-btn ${s.enabled ? "active" : ""}" data-ts-outline-toggle="on">تشغيل</button>
          <button class="ts-toggle-btn ${!s.enabled ? "active" : ""}" data-ts-outline-toggle="off">إيقاف</button>
        </div>
      </div>

      <div class="ts-row">
        <label class="ts-label">اللون</label>
        <div class="ts-colors">
          ${colorsHTML}
        </div>
      </div>

      <div class="ts-row">
        <label class="ts-label">السماكة <span class="ts-value" id="ts-outline-width-val">${s.width}</span></label>
        <input type="range" class="ts-slider" id="ts-outline-width" min="1" max="12" value="${s.width}" />
      </div>
    `;
  },

  /* ─────────────────────────────────────
     ربط الأحداث
     ───────────────────────────────────── */
  bind() {
    const s = this.ensure();

    /* تشغيل / إيقاف */
    document.querySelectorAll("[data-ts-outline-toggle]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        s.enabled = btn.dataset.tsOutlineToggle === "on";
        document.querySelectorAll("[data-ts-outline-toggle]").forEach((b) =>
          b.classList.remove("active")
        );
        btn.classList.add("active");
        NoorState.pushHistory();
        await NoorRenderer.render();
      });
    });

    /* اللون */
    document.querySelectorAll("[data-ts-outline-color]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        s.color = btn.dataset.tsOutlineColor;
        document.querySelectorAll("[data-ts-outline-color]").forEach((b) =>
          b.classList.remove("active")
        );
        btn.classList.add("active");
        s.enabled = true;
        NoorState.pushHistory();
        await NoorRenderer.render();
      });
    });

    /* السماكة */
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
