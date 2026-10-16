/* =========================================
   NoorKit — Text Style: Opacity (v2)
   شفافية النص
   ========================================= */

NoorTextStyles.register("opacity", {
  label: "شفافية",
  icon: "◑",
  order: 5,

  ensure() {
    if (typeof NoorState.design.text.opacity !== "number") {
      NoorState.design.text.opacity = 100;
    }
    return NoorState.design.text.opacity;
  },

  QUICK: [25, 50, 75, 100],

  render() {
    const val = this.ensure();

    const quickHTML = this.QUICK.map(
      (v) =>
        `<button class="ts-quick-btn ${val === v ? "active" : ""}" data-ts-opacity-quick="${v}">${v}%</button>`
    ).join("");

    return `
      <div class="nk-row">
        <span class="nk-row-label">الشفافية</span>
        <span class="nk-row-value" id="ts-opacity-val">${val}%</span>
      </div>
      <input type="range" class="ts-slider" id="ts-opacity-slider" min="0" max="100" value="${val}" style="width:100%;margin-bottom:10px;" />

      <div class="nk-row">
        <span class="nk-row-label">قيم سريعة</span>
      </div>
      <div class="ts-quick-group">${quickHTML}</div>
    `;
  },

  bind() {
    const slider = document.getElementById("ts-opacity-slider");
    const valEl = document.getElementById("ts-opacity-val");

    slider?.addEventListener("input", async () => {
      const v = parseInt(slider.value);
      NoorState.design.text.opacity = v;
      if (valEl) valEl.textContent = v + "%";

      document.querySelectorAll("[data-ts-opacity-quick]").forEach((b) =>
        b.classList.toggle("active", parseInt(b.dataset.tsOpacityQuick) === v)
      );

      await NoorRenderer.render();
    });

    slider?.addEventListener("change", () => NoorState.pushHistory());

    document.querySelectorAll("[data-ts-opacity-quick]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const v = parseInt(btn.dataset.tsOpacityQuick);
        NoorState.design.text.opacity = v;

        if (slider) slider.value = v;
        if (valEl) valEl.textContent = v + "%";

        document.querySelectorAll("[data-ts-opacity-quick]").forEach((b) =>
          b.classList.remove("active")
        );
        btn.classList.add("active");

        NoorState.pushHistory();
        await NoorRenderer.render();
      });
    });
  },
});
