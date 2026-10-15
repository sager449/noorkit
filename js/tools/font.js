/* =========================================
   NoorKit — Tool: Font
   أداة اختيار الخط
   ========================================= */

NoorTools.register("font", {
  render() {
    const d = NoorState.design;
    return `
      <h3 class="panel-title">الخط</h3>
      <div class="panel-row">
        <label class="panel-label">اختر الخط</label>
        <div class="font-grid" id="font-grid">${NoorFonts.renderOptions(d.text.fontId)}</div>
      </div>
      <div class="panel-row">
        <label class="panel-label">حجم الخط: <output id="size-value">${d.text.size}</output>px</label>
        <input type="range" class="size-slider" id="font-size" min="24" max="140" value="${d.text.size}" />
      </div>
      <div class="panel-row">
        <label class="panel-label">محاذاة النص</label>
        <div class="toggle-group" id="align-group">
          <button class="toggle-btn ${d.text.align === "right" ? "active" : ""}" data-align="right">يمين</button>
          <button class="toggle-btn ${d.text.align === "center" ? "active" : ""}" data-align="center">وسط</button>
          <button class="toggle-btn ${d.text.align === "left" ? "active" : ""}" data-align="left">يسار</button>
        </div>
      </div>
      <div class="panel-row">
        <label class="panel-label">الظل</label>
        <div class="toggle-group" id="shadow-group">
          <button class="toggle-btn ${d.text.shadow ? "active" : ""}" data-shadow="on">تشغيل</button>
          <button class="toggle-btn ${!d.text.shadow ? "active" : ""}" data-shadow="off">إيقاف</button>
        </div>
      </div>
    `;
  },

  bind() {
    document.querySelectorAll("#font-grid .font-option").forEach((btn) => {
      btn.addEventListener("click", async () => {
        document.querySelectorAll("#font-grid .font-option").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        NoorState.design.text.fontId = btn.dataset.font;
        NoorState.pushHistory();
        await NoorRenderer.render();
      });
    });

    const sizeInput = document.getElementById("font-size");
    const sizeOut = document.getElementById("size-value");
    sizeInput?.addEventListener("input", () => {
      NoorState.design.text.size = parseInt(sizeInput.value);
      if (sizeOut) sizeOut.textContent = sizeInput.value;
      NoorRenderer.render();
    });

    document.querySelectorAll("#align-group .toggle-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        document.querySelectorAll("#align-group .toggle-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        NoorState.design.text.align = btn.dataset.align;
        NoorState.pushHistory();
        await NoorRenderer.render();
      });
    });

    document.querySelectorAll("#shadow-group .toggle-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        document.querySelectorAll("#shadow-group .toggle-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        NoorState.design.text.shadow = btn.dataset.shadow === "on";
        NoorState.pushHistory();
        await NoorRenderer.render();
      });
    });
  },
});
