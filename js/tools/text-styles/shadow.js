/* =========================================
   NoorKit — Text Style: Shadow
   ظل النص — مع Toggle Switch
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
      };
    }
    return NoorState.design.text.shadow;
  },

  COLORS: [
    "#000000", "#ffffff", "#c9a227", "#7c3aed",
    "#1e40af", "#b91c1c", "#0d8b5f", "#f59e0b",
  ],

  render() {
    const s = this.ensure();

    const colorsHTML = this.COLORS.map(
      (c) =>
        `<button class="ts-color-dot ${s.color === c ? "active" : ""}" data-ts-shadow-color="${c}" style="background:${c};"></button>`
    ).join("");

    return `
      <div class="nk-row">
        <span class="nk-row-label">التشغيل</span>
        <label class="nk-toggle">
          <input type="checkbox" class="nk-toggle-input" id="ts-shadow-toggle" ${s.enabled ? "checked" : ""} />
          <span class="nk-toggle-switch"></span>
        </label>
      </div>

      <div class="nk-row" style="flex-direction:column;align-items:stretch;">
        <span class="nk-row-label" style="margin-bottom:6px;">اللون</span>
        <div class="ts-colors">${colorsHTML}</div>
      </div>

      <div class="nk-row">
        <span class="nk-row-label">الضبابية</span>
        <span class="nk-row-value" id="ts-shadow-blur-val">${s.blur}</span>
      </div>
      <input type="range" class="ts-slider" id="ts-shadow-blur" min="0" max="40" value="${s.blur}" style="width:100%;margin-bottom:12px;" />

      <div class="nk-row">
        <span class="nk-row-label">إزاحة أفقية</span>
        <span class="nk-row-value" id="ts-shadow-x-val">${s.x}</span>
      </div>
      <input type="range" class="ts-slider" id="ts-shadow-x" min="-30" max="30" value="${s.x}" style="width:100%;margin-bottom:12px;" />

      <div class="nk-row">
        <span class="nk-row-label">إزاحة رأسية</span>
        <span class="nk-row-value" id="ts-shadow-y-val">${s.y}</span>
      </div>
      <input type="range" class="ts-slider" id="ts-shadow-y" min="-30" max="30" value="${s.y}" style="width:100%;" />
    `;
  },

  bind() {
    const s = this.ensure();

    /* ── التفعيل ── */
    const toggle = document.getElementById("ts-shadow-toggle");
    toggle?.addEventListener("change", async () => {
      s.enabled = toggle.checked;
      NoorState.pushHistory();
      await NoorRenderer.render();
    });

    /* ── اللون ── */
    document.querySelectorAll("[data-ts-shadow-color]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        s.color = btn.dataset.tsShadowColor;
        document.querySelectorAll("[data-ts-shadow-color]").forEach((b) =>
          b.classList.remove("active")
        );
        btn.classList.add("active");
        s.enabled = true;
        if (toggle) toggle.checked = true;
        NoorState.pushHistory();
        await NoorRenderer.render();
      });
    });

    /* ── الضبابية ── */
    const blur = document.getElementById("ts-shadow-blur");
    const blurVal = document.getElementById("ts-shadow-blur-val");
    blur?.addEventListener("input", async () => {
      s.blur = parseInt(blur.value);
      if (blurVal) blurVal.textContent = s.blur;
      s.enabled = true;
      if (toggle) toggle.checked = true;
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
      if (toggle) toggle.checked = true;
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
      if (toggle) toggle.checked = true;
      await NoorRenderer.render();
    });
    y?.addEventListener("change", () => NoorState.pushHistory());
  },
});
