/* =========================================
   NoorKit — Tool: Background
   أداة الخلفية
   ========================================= */

NoorTools.register("background", {
  render() {
    const d = NoorState.design;

    const colorItems = NoorBackgrounds.solidColors.map((c) =>
      `<button class="bg-item ${d.background.type === "solid" && d.background.value === c.color ? "active" : ""}" data-bg-type="solid" data-bg-value="${c.color}" title="${c.name}"><span class="bg-item-color" style="background:${c.color};"></span></button>`
    ).join("");

    const gradientItems = NoorBackgrounds.gradients.map((g) =>
      `<button class="bg-item ${d.background.type === "gradient" && d.background.value === g.css ? "active" : ""}" data-bg-type="gradient" data-bg-value="${this.escape(g.css)}" title="${g.name}"><span class="bg-item-color" style="background:${g.css};"></span></button>`
    ).join("");

    const categoryItems = NoorBackgrounds.categories.map((c) =>
      `<button class="bg-item" data-bg-category="${c.id}" title="${c.name}"><span class="bg-item-color" style="background:var(--cream);display:flex;align-items:center;justify-content:center;font-size:24px;">${c.icon}</span><span class="bg-item-label">${c.name}</span></button>`
    ).join("");

    return `
      <h3 class="panel-title">الخلفية</h3>
      <div class="panel-row"><label class="panel-label">ألوان</label><div class="bg-grid">${colorItems}</div></div>
      <div class="panel-row"><label class="panel-label">تدرجات</label><div class="bg-grid">${gradientItems}</div></div>
      <div class="panel-row"><label class="panel-label">صور طبيعية</label><div class="bg-grid">${categoryItems}</div><p class="panel-note" id="bg-note" hidden>جاري تحميل الصورة...</p></div>
    `;
  },

  bind() {
    document.querySelectorAll(".bg-item[data-bg-type]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        document.querySelectorAll(".bg-item").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        NoorState.design.background.type = btn.dataset.bgType;
        NoorState.design.background.value = btn.dataset.bgValue;
        NoorState.design.background.imageUrl = null;
        NoorState.pushHistory();
        await NoorRenderer.render();
      });
    });

    document.querySelectorAll(".bg-item[data-bg-category]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        document.querySelectorAll(".bg-item").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const catId = btn.dataset.bgCategory;
        const d = NoorState.design;
        const url = NoorBackgrounds.getRandomFromCategory(catId, d.width, d.height);
        if (url) {
          const note = document.getElementById("bg-note");
          if (note) note.hidden = false;
          NoorState.design.background.type = "image";
          NoorState.design.background.imageUrl = url;
          await NoorRenderer.render();
          if (note) note.hidden = true;
          NoorState.pushHistory();
        }
      });
    });
  },

  escape(str) {
    return String(str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  },
});
