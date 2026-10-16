/* =========================================
   NoorKit — Text Style: Glow
   توهج النص — مع Toggle Switch
   ========================================= */

NoorTextStyles.register("glow", {
  label: "توهج",
  icon: "✦",
  order: 4,

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

  COLORS: [
    "#c9a227", "#ffffff", "#f59e0b", "#7c3aed",
    "#0891b2", "#0d8b5f", "#b91c1c", "#be185d",
  ],

  render() {
    const s = this.ensure();

    const colorsHTML = this.COLORS.map(
      (c) =>
        `<button class="ts-color-dot ${s.color === c ? "active" : ""}" data-ts-glow-color="${c}" style="background:${c};"></button>`
    ).join("");

    return `
      <div class="nk-row">
        <span class="nk-row-label">التشغيل</span>
        <label class="nk-toggle">
          <input type="checkbox" class="nk-toggle-input" id="ts-glow-toggle" ${s.enabled ? "checked" : ""} />
          <span class="nk-toggle-switch"></span>
        </label>
      </div>

      <div class="nk-row" style="flex-direction:column;align-items:stretch;">
        <span class="nk-row-label" style="margin-bottom:6px;">اللون</span>
        <div class="ts-colors">${colorsHTML}</div>
      </div>

      <div class="nk-row">
        <span class="nk-row-label">القوة</span>
        <span class="nk-row-value" id="ts-glow-int-val">${s.intensity}</span>
      </div>
      <input type="range" class="ts-slider" id="ts-glow-int" min="2" max="40" value="${s.intensity}" style="width:100%;" />
    `;
  },

  bind() {
    const s = this.ensure();

    const toggle = document.getElementById("ts-glow-toggle");
    toggle?.addEventListener("change", async () => {
      s.enabled = toggle.checked;
      NoorState.pushHistory();
      await NoorRenderer.render();
    });

    document.querySelectorAll("[data-ts-glow-color]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        s.color = btn.dataset.tsGlowColor;
        document.querySelectorAll("[data-ts-glow-color]").forEach((b) =>
          b.classList.remove("active")
        );
        btn.classList.add("active");
        s.enabled = true;
        if (toggle) toggle.checked = true;
        NoorState.pushHistory();
        await NoorRenderer.render();
      });
    });

    const intensity = document.getElementById("ts-glow-int");
    const intensityVal = document.getElementById("ts-glow-int-val");
    intensity?.addEventListener("input", async () => {
      s.intensity = parseInt(intensity.value);
      if (intensityVal) intensityVal.textContent = s.intensity;
      s.enabled = true;
      if (toggle) toggle.checked = true;
      await NoorRenderer.render();
    });
    intensity?.addEventListener("change", () => NoorState.pushHistory());
  },
});
