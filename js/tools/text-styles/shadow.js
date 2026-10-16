/* =========================================
   NoorKit — Text Style: Shadow (v2)
   12 لون + شفافية + بدون toggle
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
      <div class="nk-row" style="flex-direction:column;align-items:stretch;">
        <span class="nk-row-label" style="margin-bottom:6px;">اللون</span>
        <div class="nk-color-scroll">${colorsHTML}</div>

        <div class="nk-color-picker">
          <div class="nk-color-preview" style="background:${s.color};">
            <input type="color" id="ts-shadow-picker" value="${s.color}" />
          </div>
          <input type="text" class="nk-color-hex" id="ts-shadow-hex" value="${s.color.toUpperCase()}" maxlength="7" />
        </div>
      </div>

      <div class="nk-row">
        <span class="nk-row-label">الشفافية</span>
        <span class="nk-row-value" id="ts-shadow-op-val">${s.opacity}%</span>
      </div>
      <input type="range" class="ts-slider" id="ts-shadow-op" min="0" max="100" value="${s.opacity}" style="width:100%;margin-bottom:10px;" />

      <div class="nk-row">
        <span class="nk-row-label">الضبابية</span>
        <span class="nk-row-value" id="ts-shadow-blur-val">${s.blur}</span>
      </div>
      <input type="range" class="ts-slider" id="ts-shadow-blur" min="0" max="40" value="${s.blur}" style="width:100%;margin-bottom:10px;" />

      <div class="nk-row">
        <span class="nk-row-label">إزاحة أفقية</span>
        <span class="nk-row-value" id="ts-shadow-x-val">${s.x}</span>
      </div>
      <input type="range" class="ts-slider" id="ts-shadow-x" min="-30" max="30" value="${s.x}" style="width:100%;margin-bottom:10px;" />

      <div class="nk-row">
        <span class="nk-row-label">إزاحة رأسية</span>
        <span class="nk-row-value" id="ts-shadow-y-val">${s.y}</span>
      </div>
      <input type="range" class="ts-slider" id="ts-shadow-y" min="-30" max="30" value="${s.y}" style="width:100%;" />
    `;
  },

  bind() {
    const s = this.ensure();

    /* ── اختيار اللون (مع إمكانية إلغاء التفعيل) ── */
    document.querySelectorAll("[data-ts-shadow-color]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const color = btn.dataset.tsShadowColor;

        /* إذا نفس اللون → إلغاء التفعيل */
        if (s.color === color && s.enabled) {
          s.enabled = false;
          document.querySelectorAll("[data-ts-shadow-color]").forEach((b) =>
            b.classList.remove("active")
          );
          NoorState.pushHistory();
          await NoorRenderer.render();
          return;
        }

        s.color = color;
        s.enabled = true;

        document.querySelectorAll("[data-ts-shadow-color]").forEach((b) =>
          b.classList.remove("active")
        );
        btn.classList.add("active");

        const preview = document.querySelector(".nk-color-preview");
        const picker = document.getElementById("ts-shadow-picker");
        const hex = document.getElementById("ts-shadow-hex");
        if (preview) preview.style.background = color;
        if (picker) picker.value = color;
        if (hex) hex.value = color.toUpperCase();

        NoorState.pushHistory();
        await NoorRenderer.render();
      });
    });

    /* ── منتقي اللون (input color) ── */
    const picker = document.getElementById("ts-shadow-picker");
    picker?.addEventListener("input", async () => {
      s.color = picker.value;
      s.enabled = true;
      const preview = document.querySelector(".nk-color-preview");
      const hex = document.getElementById("ts-shadow-hex");
      if (preview) preview.style.background = s.color;
      if (hex) hex.value = s.color.toUpperCase();
      document.querySelectorAll("[data-ts-shadow-color]").forEach((b) =>
        b.classList.remove("active")
      );
      await NoorRenderer.render();
    });
    picker?.addEventListener("change", () => NoorState.pushHistory());

    /* ── حقل HEX ── */
    const hex = document.getElementById("ts-shadow-hex");
    hex?.addEventListener("change", async () => {
      let val = hex.value.trim();
      if (!val.startsWith("#")) val = "#" + val;
      if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
        s.color = val.toUpperCase();
        s.enabled = true;
        const preview = document.querySelector(".nk-color-preview");
        const p = document.getElementById("ts-shadow-picker");
        if (preview) preview.style.background = s.color;
        if (p) p.value = s.color;
        hex.value = s.color;
        document.querySelectorAll("[data-ts-shadow-color]").forEach((b) =>
          b.classList.remove("active")
        );
        NoorState.pushHistory();
        await NoorRenderer.render();
      } else {
        hex.value = s.color.toUpperCase();
      }
    });

    /* ── الشفافية ── */
    const op = document.getElementById("ts-shadow-op");
    const opVal = document.getElementById("ts-shadow-op-val");
    op?.addEventListener("input", async () => {
      s.opacity = parseInt(op.value);
      if (opVal) opVal.textContent = s.opacity + "%";
      s.enabled = true;
      await NoorRenderer.render();
    });
    op?.addEventListener("change", () => NoorState.pushHistory());

    /* ── الضبابية ── */
    const blur = document.getElementById("ts-shadow-blur");
    const blurVal = document.getElementById("ts-shadow-blur-val");
    blur?.addEventListener("input", async () => {
      s.blur = parseInt(blur.value);
      if (blurVal) blurVal.textContent = s.blur;
      s.enabled = true;
      await NoorRenderer.render();
    });
    blur?.addEventListener("change", () => NoorState.pushHistory());

    /* ── إزاحة X ── */
    const x = document.getElementById("ts-shadow-x");
    const xVal = document.getElementById("ts-shadow-x-val");
    x?.addEventListener("input", async () => {
      s.x = parseInt(x.value);
      if (xVal) xVal.textContent = s.x;
      s.enabled = true;
      await NoorRenderer.render();
    });
    x?.addEventListener("change", () => NoorState.pushHistory());

    /* ── إزاحة Y ── */
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
