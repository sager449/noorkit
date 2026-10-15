/* =========================================
   NoorKit — Tool: Decor
   أداة الزخرفة (البسملة + زخرفة الأسفل)
   ========================================= */

NoorTools.register("decor", {
  render() {
    const d = NoorState.design;
    return `
      <h3 class="panel-title">الزخرفة</h3>

      <div class="panel-row">
        <label class="panel-label">البسملة في الأعلى (﷽)</label>
        <div class="toggle-group" id="decor-top-group">
          <button class="toggle-btn ${d.decor.top ? "active" : ""}" data-decor="top-on">تشغيل</button>
          <button class="toggle-btn ${!d.decor.top ? "active" : ""}" data-decor="top-off">إيقاف</button>
        </div>
      </div>

      <div class="panel-row">
        <label class="panel-label">زخرفة في الأسفل (❁ ❁ ❁)</label>
        <div class="toggle-group" id="decor-bottom-group">
          <button class="toggle-btn ${d.decor.bottom ? "active" : ""}" data-decor="bottom-on">تشغيل</button>
          <button class="toggle-btn ${!d.decor.bottom ? "active" : ""}" data-decor="bottom-off">إيقاف</button>
        </div>
      </div>
    `;
  },

  bind() {
    document.querySelectorAll("#decor-top-group [data-decor]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        document.querySelectorAll("#decor-top-group [data-decor]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        NoorState.design.decor.top = btn.dataset.decor === "top-on";
        NoorState.pushHistory();
        await NoorRenderer.render();
      });
    });

    document.querySelectorAll("#decor-bottom-group [data-decor]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        document.querySelectorAll("#decor-bottom-group [data-decor]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        NoorState.design.decor.bottom = btn.dataset.decor === "bottom-on";
        NoorState.pushHistory();
        await NoorRenderer.render();
      });
    });
  },
});
