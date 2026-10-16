/* =========================================
   NoorKit — Text Style: Outline
   حدود النص — مع Toggle Switch
   ========================================= */

NoorTextStyles.register("outline", {
  label: "حدود",
  icon: "◎",
  order: 2,

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

  COLORS: [
    "#ffffff", "#000000", "#c9a227", "#7c3aed",
    "#1e40af", "#b91c1c", "#0d8b5f", "#f59e0b",
  ],

  render() {
    const s = this.ensure();

    const colorsHTML = this.COLORS.map(
      (c) =>
        `<button class="ts-color-dot ${s.color === c ? "active" : ""}" data-ts-outline-color="${c}" style="background:${c};"></button>`
    ).join("");

    return `
      <div class="nk-row">
        <span class="nk-row-label">التشغيل</span>
        <label class="nk-toggle">
          <input type="checkbox" class="nk-toggle-input" id="ts-outline-toggle" ${s.enabled ? "checked" : ""} />
          <span class="nk-toggle-switch"></span>
        </label>
      </div>

      <div class="nk-row" style="flex-direction:column;align-items:stretch;">
        <span class="nk-row-label" style="margin-bottom:6px;">اللون</span>
        <div class="ts-colors">${colorsHTML}</div>
      </div>

      <div class="nk-row">
        <span class="nk-row-label">السماكة</span>
        <span class="nk-row-value" id="ts-outline-width-val">${s.width}</span>
      </div>
      <input type="range" class="ts-slider" id="ts-outline-width" min="1" max="12" value="${s.width}" style="width:100%;" />
    `;
  },

  bind() {
    const s = this.ensure();

    const toggle = document.getElementById("ts-outline-toggle");
    toggle?.addEventListener("change", async () => {
      s.enabled = toggle.checked;
      NoorState.pushHistory();
      await NoorRenderer.render();
    });

    document.querySelectorAll("[data-ts-outline-color]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        s.color = btn.dataset.tsOutlineColor;
        document.querySelectorAll("[data-ts-outline-color]").forEach((b) =>
          b.classList.remove("active")
        );
        btn.classList.add("active");
        s.enabled = true;
        if (toggle) toggle.checked = true;
        NoorState.pushHistory();
        await NoorRenderer.render();
      });
    });

    const width = document.getElementById("ts-outline-width");
    const widthVal = document.getElementById("ts-outline-width-val");
    width?.addEventListener("input", async () => {
      s.width = parseInt(width.value);
      if (widthVal) widthVal.textContent = s.width;
      s.enabled = true;
      if (toggle) toggle.checked = true;
      await NoorRenderer.render();
    });
    width?.addEventListener("change", () => NoorState.pushHistory());
  },
});
