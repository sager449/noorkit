/* =========================================
   NoorKit — Text Style: Line Height (v2)
   تباعد الأسطر
   ========================================= */

NoorTextStyles.register("line-height", {
  label: "تباعد",
  icon: "☰",
  order: 7,

  ensure() {
    if (typeof NoorState.design.text.lineHeight !== "number") {
      NoorState.design.text.lineHeight = 1.8;
    }
    return NoorState.design.text.lineHeight;
  },

  QUICK: [1.2, 1.5, 1.8, 2.2, 2.8],

  render() {
    const val = this.ensure();

    const quickHTML = this.QUICK.map(
      (v) =>
        `<button class="ts-quick-btn ${Math.abs(val - v) < 0.05 ? "active" : ""}" data-ts-lh-quick="${v}">${v}</button>`
    ).join("");

    return `
      <div class="nk-row">
        <span class="nk-row-label">تباعد الأسطر</span>
        <span class="nk-row-value" id="ts-lh-val">${val.toFixed(1)}</span>
      </div>
      <input type="range" class="ts-slider" id="ts-lh-slider" min="1" max="3" step="0.1" value="${val}" style="width:100%;margin-bottom:10px;" />

      <div class="nk-row">
        <span class="nk-row-label">قيم سريعة</span>
      </div>
      <div class="ts-quick-group">${quickHTML}</div>
    `;
  },

  bind() {
    const slider = document.getElementById("ts-lh-slider");
    const valEl = document.getElementById("ts-lh-val");

    slider?.addEventListener("input", async () => {
      const v = parseFloat(slider.value);
      NoorState.design.text.lineHeight = v;
      if (valEl) valEl.textContent = v.toFixed(1);

      document.querySelectorAll("[data-ts-lh-quick]").forEach((b) =>
        b.classList.toggle(
          "active",
          Math.abs(parseFloat(b.dataset.tsLhQuick) - v) < 0.05
        )
      );

      await NoorRenderer.render();
    });

    slider?.addEventListener("change", () => NoorState.pushHistory());

    document.querySelectorAll("[data-ts-lh-quick]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const v = parseFloat(btn.dataset.tsLhQuick);
        NoorState.design.text.lineHeight = v;

        if (slider) slider.value = v;
        if (valEl) valEl.textContent = v.toFixed(1);

        document.querySelectorAll("[data-ts-lh-quick]").forEach((b) =>
          b.classList.remove("active")
        );
        btn.classList.add("active");

        NoorState.pushHistory();
        await NoorRenderer.render();
      });
    });
  },
});
