/* =========================================
   NoorKit — Tool: Frame
   أداة الإطار
   ========================================= */

NoorTools.register("frame", {
  frames: [
    { id: "none", name: "بدون" },
    { id: "simple", name: "بسيط" },
    { id: "double", name: "مزدوج" },
    { id: "ornate", name: "مزخرف" }
  ],

  colors: ["#c9a227", "#7c3aed", "#1a1a1a", "#ffffff", "#78350f", "#1e40af"],

  render() {
    const d = NoorState.design;
    return `
      <h3 class="panel-title">الإطار</h3>

      <div class="panel-row">
        <label class="panel-label">النوع</label>
        <div class="frame-grid" id="frame-types">
          ${this.frames.map((f) =>
            `<button class="frame-item ${d.frame.type === f.id ? "active" : ""}" data-frame="${f.id}" title="${f.name}">${f.id === "none" ? '<span style="font-size:11px;color:var(--muted);">بدون</span>' : `<span class="frame-preview ${f.id}"></span>`}</button>`
          ).join("")}
        </div>
      </div>

      <div class="panel-row">
        <label class="panel-label">اللون</label>
        <div class="color-options" id="frame-colors">
          ${this.colors.map((c) =>
            `<button class="color-swatch ${d.frame.color === c ? "active" : ""}" data-color="${c}" style="background:${c};${c === "#ffffff" ? "border:2px solid #e5e5e5;" : ""}"></button>`
          ).join("")}
        </div>
      </div>

      <div class="panel-row">
        <label class="panel-label">السماكة: <output id="frame-thick-value">${d.frame.thickness}</output>px</label>
        <input type="range" class="size-slider" id="frame-thickness" min="2" max="20" value="${d.frame.thickness}" />
      </div>
    `;
  },

  bind() {
    document.querySelectorAll("#frame-types .frame-item").forEach((btn) => {
      btn.addEventListener("click", async () => {
        document.querySelectorAll("#frame-types .frame-item").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        NoorState.design.frame.type = btn.dataset.frame;
        NoorState.pushHistory();
        await NoorRenderer.render();
      });
    });

    document.querySelectorAll("#frame-colors .color-swatch").forEach((btn) => {
      btn.addEventListener("click", async () => {
        document.querySelectorAll("#frame-colors .color-swatch").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        NoorState.design.frame.color = btn.dataset.color;
        NoorState.pushHistory();
        await NoorRenderer.render();
      });
    });

    const thickInput = document.getElementById("frame-thickness");
    const thickOut = document.getElementById("frame-thick-value");
    thickInput?.addEventListener("input", () => {
      NoorState.design.frame.thickness = parseInt(thickInput.value);
      if (thickOut) thickOut.textContent = thickInput.value;
      NoorRenderer.render();
    });
  },
});
