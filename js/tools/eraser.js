/* =========================================
   NoorKit — Tool: Eraser
   أداة مسح العناصر
   ========================================= */

NoorTools.register("eraser", {
  render() {
    return `
      <h3 class="panel-title">مسح عنصر</h3>
      <p class="panel-note">
        اضغط على أي عنصر (نص، صورة، رمز) لحذفه.
      </p>
      <div class="panel-row" id="eraser-targets">
        <label class="panel-label">العناصر الحالية</label>
        <div id="eraser-list"></div>
      </div>
    `;
  },

  bind() {
    const list = document.getElementById("eraser-list");
    if (!list) return;

    const d = NoorState.design;
    const items = [];

    if (d.images && d.images.length > 0) {
      d.images.forEach((img, idx) => items.push({ type: "image", id: img.id, name: `صورة #${idx + 1}` }));
    }
    if (d.stickers && d.stickers.length > 0) {
      d.stickers.forEach((stk, idx) => items.push({ type: "sticker", id: stk.id, name: stk.text }));
    }

    if (items.length === 0) {
      list.innerHTML = '<p class="panel-note">لا توجد عناصر إضافية</p>';
      return;
    }

    list.innerHTML = items.map((it) => `
      <button class="toggle-btn" data-erase-id="${it.id}" style="width:100%;margin-bottom:6px;justify-content:space-between;display:flex;">
        <span>${it.name}</span>
        <span>🗑️</span>
      </button>
    `).join("");

    list.querySelectorAll("[data-erase-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.eraseId;
        if (d.images) d.images = d.images.filter((i) => i.id !== id);
        if (d.stickers) d.stickers = d.stickers.filter((s) => s.id !== id);
        NoorState.pushHistory();
        NoorRenderer.debouncedRender();
        NoorPanels.refresh();
        window.showToast?.("تم الحذف");
      });
    });
  },
});
