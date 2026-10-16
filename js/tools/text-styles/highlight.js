/* =========================================
   NoorKit — Text Style: Highlight
   خلفية النص — مع Toggle Switch
   ========================================= */

NoorTextStyles.register("highlight", {
  label: "خلفية",
  icon: "▬",
  order: 6,

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

  COLORS: [
    "#c9a227", "#ffffff", "#000000", "#f59e0b",
    "#7c3aed", "#1e40af", "#0d8b5f", "#b91c1c",
    "#be185d", "#0891b2",
  ],

  render() {
    const s = this.ensure();

    const colorsHTML = this.COLORS.map(
      (c) =>
        `<button class="ts-color-dot ${s.color === c ? "active" : ""}" data-ts-hl-color="${c}" style="background:${c};"></button>`
    ).join("");

    return `
      <div class="nk-row">
        <span class="nk-row-label">التشغيل</span>
        <label class="nk-toggle">
          <input type="checkbox" class="nk-toggle-input" id="ts-hl-toggle" ${s.enabled ? "checked" : ""} />
          <span class="nk-toggle-switch"></span>
        </label>
      </div>

      <div class="nk-row" style="flex-direction:column;align-items:stretch;">
        <span class="nk-row-label" style="margin-bottom:6px;">اللون</span>
        <div class="ts-colors">${colorsHTML}</div>
      </div>

      <div class="nk-row">
        <span class="nk-row-label">الحشو</span>
        <span class="nk-row-value" id="ts-hl-pad-val">${s.padding}</span>
      </div>
      <input type="range" class="ts-slider" id="ts-hl-pad" min="0" max="40" value="${s.padding}" style="width:100%;margin-bottom:12px;" />

      <div class="nk-row">
        <span class="nk-row-label">الاستدارة</span>
        <span class="nk-row-value" id="ts-hl-radius-val">${s.radius}</span>
      </div>
      <input type="range" class="ts-slider" id="ts-hl-radius" min="0" max="30" value="${s.radius}" style="width:100%;" />
    `;
  },

  bind() {
    const s = this.ensure();

    const toggle = document.getElementById("ts-hl-toggle");
    toggle?.addEventListener("change", async () => {
      s.enabled = toggle.checked;
      NoorState.pushHistory();
      await NoorRenderer.render();
    });

    document.querySelectorAll("[data-ts-hl-color]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        s.color = btn.dataset.tsHlColor;
        document.querySelectorAll("[data-ts-hl-color]").forEach((b) =>
          b.classList.remove("active")
        );
        btn.classList.add("active");
        s.enabled = true;
        if (toggle) toggle.checked = true;
        NoorState.pushHistory();
        await NoorRenderer.render();
      });
    });

    const pad = document.getElementById("ts-hl-pad");
    const padVal = document.getElementById("ts-hl-pad-val");
    pad?.addEventListener("input", async () => {
      s.padding = parseInt(pad.value);
      if (padVal) padVal.textContent = s.padding;
      s.enabled = true;
      if (toggle) toggle.checked = true;
      await NoorRenderer.render();
    });
    pad?.addEventListener("change", () => NoorState.pushHistory());

    const radius = document.getElementById("ts-hl-radius");
    const radiusVal = document.getElementById("ts-hl-radius-val");
    radius?.addEventListener("input", async () => {
      s.radius = parseInt(radius.value);
      if (radiusVal) radiusVal.textContent = s.radius;
      s.enabled = true;
      if (toggle) toggle.checked = true;
      await NoorRenderer.render();
    });
    radius?.addEventListener("change", () => NoorState.pushHistory());
  },
});
