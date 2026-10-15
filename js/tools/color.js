/* =========================================
   NoorKit — Tool: Text Color
   أداة لون النص
   ========================================= */

NoorTools.register("text-color", {
  colors: [
    "#1a1a1a", "#ffffff", "#c9a227", "#f5ede0",
    "#0d8b5f", "#1e40af", "#b91c1c", "#7c3aed",
    "#78350f", "#be185d"
  ],

  render() {
    const d = NoorState.design;
    return `
      <h3 class="panel-title">لون النص</h3>
      <div class="panel-row">
        <label class="panel-label">اختر اللون</label>
        <div class="color-options" id="text-color-options">
          ${this.colors.map((c) => `<button class="color-swatch ${d.text.color === c ? "active" : ""}" data-color="${c}" style="background:${c};${c === "#ffffff" ? "border:2px solid #e5e5e5;" : ""}"></button>`).join("")}
        </div>
      </div>
    `;
  },

  bind() {
    document.querySelectorAll("#text-color-options .color-swatch").forEach((btn) => {
      btn.addEventListener("click", async () => {
        document.querySelectorAll("#text-color-options .color-swatch").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        NoorState.design.text.color = btn.dataset.color;
        NoorState.pushHistory();
        await NoorRenderer.render();
      });
    });
  },
});
