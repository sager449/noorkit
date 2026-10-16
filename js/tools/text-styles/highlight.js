/* =========================================
   NoorKit — Text Style: Highlight (v2)
   12 لون + شفافية + بدون toggle
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
        opacity: 100,
      };
    }
    if (typeof NoorState.design.text.highlight.opacity !== "number") {
      NoorState.design.text.highlight.opacity = 100;
    }
    return NoorState.design.text.highlight;
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
        `<button class="nk-color-dot ${s.color === c ? "active" : ""}" data-ts-hl-color="${c}" style="background:${c};"></button>`
    ).join("");

    return `
      <div class="nk-row" style="flex-direction:column;align-items:stretch;">
        <span class="nk-row-label" style="margin-bottom:6px;">اللون</span>
        <div class="nk-color-scroll">${colorsHTML}</div>

        <div class="nk-color-picker">
          <div class="nk-color-preview" style="background:${s.color};">
            <input type="color" id="ts-hl-picker" value="${s.color}" />
          </div>
          <input type="text" class="nk-color-hex" id="ts-hl-hex" value="${s.color.toUpperCase()}" maxlength="7" />
        </div>
      </div>

      <div class="nk-row">
        <span class="nk-row-label">الشفافية</span>
        <span class="nk-row-value" id="ts-hl-op-val">${s.opacity}%</span>
      </div>
      <input type="range" class="ts-slider" id="ts-hl-op" min="0" max="100" value="${s.opacity}" style="width:100%;margin-bottom:10px;" />

      <div class="nk-row">
        <span class="nk-row-label">الحشو</span>
        <span class="nk-row-value" id="ts-hl-pad-val">${s.padding}</span>
      </div>
      <input type="range" class="ts-slider" id="ts-hl-pad" min="0" max="40" value="${s.padding}" style="width:100%;margin-bottom:10px;" />

      <div class="nk-row">
        <span class="nk-row-label">الاستدارة</span>
        <span class="nk-row-value" id="ts-hl-radius-val">${s.radius}</span>
      </div>
      <input type="range" class="ts-slider" id="ts-hl-radius" min="0" max="30" value="${s.radius}" style="width:100%;" />
    `;
  },

  bind() {
    const s = this.ensure();

    document.querySelectorAll("[data-ts-hl-color]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const color = btn.dataset.tsHlColor;

        if (s.color === color && s.enabled) {
          s.enabled = false;
          document.querySelectorAll("[data-ts-hl-color]").forEach((b) =>
            b.classList.remove("active")
          );
          NoorState.pushHistory();
          await NoorRenderer.render();
          return;
        }

        s.color = color;
        s.enabled = true;

        document.querySelectorAll("[data-ts-hl-color]").forEach((b) =>
          b.classList.remove("active")
        );
        btn.classList.add("active");

        const preview = document.querySelector(".nk-color-preview");
        const picker = document.getElementById("ts-hl-picker");
        const hex = document.getElementById("ts-hl-hex");
        if (preview) preview.style.background = color;
        if (picker) picker.value = color;
        if (hex) hex.value = color.toUpperCase();

        NoorState.pushHistory();
        await NoorRenderer.render();
      });
    });

    const picker = document.getElementById("ts-hl-picker");
    picker?.addEventListener("input", async () => {
      s.color = picker.value;
      s.enabled = true;
      const preview = document.querySelector(".nk-color-preview");
      const hex = document.getElementById("ts-hl-hex");
      if (preview) preview.style.background = s.color;
      if (hex) hex.value = s.color.toUpperCase();
      document.querySelectorAll("[data-ts-hl-color]").forEach((b) =>
        b.classList.remove("active")
      );
      await NoorRenderer.render();
    });
    picker?.addEventListener("change", () => NoorState.pushHistory());

    const hex = document.getElementById("ts-hl-hex");
    hex?.addEventListener("change", async () => {
      let val = hex.value.trim();
      if (!val.startsWith("#")) val = "#" + val;
      if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
        s.color = val.toUpperCase();
        s.enabled = true;
        const preview = document.querySelector(".nk-color-preview");
        const p = document.getElementById("ts-hl-picker");
        if (preview) preview.style.background = s.color;
        if (p) p.value = s.color;
        hex.value = s.color;
        document.querySelectorAll("[data-ts-hl-color]").forEach((b) =>
          b.classList.remove("active")
        );
        NoorState.pushHistory();
        await NoorRenderer.render();
      } else {
        hex.value = s.color.toUpperCase();
      }
    });

    const op = document.getElementById("ts-hl-op");
    const opVal = document.getElementById("ts-hl-op-val");
    op?.addEventListener("input", async () => {
      s.opacity = parseInt(op.value);
      if (opVal) opVal.textContent = s.opacity + "%";
      s.enabled = true;
      await NoorRenderer.render();
    });
    op?.addEventListener("change", () => NoorState.pushHistory());

    const pad = document.getElementById("ts-hl-pad");
    const padVal = document.getElementById("ts-hl-pad-val");
    pad?.addEventListener("input", async () => {
      s.padding = parseInt(pad.value);
      if (padVal) padVal.textContent = s.padding;
      s.enabled = true;
      await NoorRenderer.render();
    });
    pad?.addEventListener("change", () => NoorState.pushHistory());

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
