/* =========================================
   NoorKit — Tool: Element Editor
   أداة تحرير العناصر
   ========================================= */

NoorTools.register("element-editor", {
  selectedId: null,

  render() {
    const d = NoorState.design;
    const items = [];

    if (d.images && d.images.length > 0) {
      d.images.forEach((img, i) => items.push({ type: "image", id: img.id, name: `صورة #${i + 1}` }));
    }
    if (d.stickers && d.stickers.length > 0) {
      d.stickers.forEach((stk, i) => items.push({ type: "sticker", id: stk.id, name: stk.text || `رمز #${i + 1}` }));
    }

    return `
      <h3 class="panel-title">تحرير العناصر</h3>

      <p class="panel-note">
        اختر عنصرًا لتعديله:
      </p>

      <div class="panel-row" id="ee-list">
        ${items.length === 0 
          ? '<p class="panel-note">لا توجد عناصر مضافة</p>' 
          : items.map((it) => `<button class="toggle-btn" data-ee-id="${it.id}" style="width:100%;margin-bottom:6px;justify-content:space-between;display:flex;"><span>${it.name}</span><span>✏️</span></button>`).join("")
        }
      </div>

      <div id="ee-controls" hidden>
        <div class="panel-row">
          <label class="panel-label">الحجم</label>
          <input type="range" class="size-slider" id="ee-size" min="20" max="400" value="120" />
        </div>
        <div class="panel-row">
          <label class="panel-label">الدوران</label>
          <input type="range" class="size-slider" id="ee-rotate" min="-180" max="180" value="0" />
        </div>
        <div class="panel-row">
          <button class="panel-btn secondary" id="ee-forward">إلى الأمام ▲</button>
        </div>
        <div class="panel-row">
          <button class="panel-btn secondary" id="ee-backward">إلى الخلف ▼</button>
        </div>
        <div class="panel-row">
          <button class="panel-btn" id="ee-delete" style="background:#b91c1c;">حذف العنصر</button>
        </div>
      </div>
    `;
  },

  bind() {
    const d = NoorState.design;
    const list = document.getElementById("ee-list");
    const controls = document.getElementById("ee-controls");
    if (!list) return;

    list.querySelectorAll("[data-ee-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.selectedId = btn.dataset.eeId;
        controls.hidden = false;
        this.loadControls(this.selectedId);
        list.querySelectorAll("[data-ee-id]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });

    document.getElementById("ee-delete")?.addEventListener("click", () => {
      if (!this.selectedId) return;
      const d = NoorState.design;
      if (d.images) d.images = d.images.filter((i) => i.id !== this.selectedId);
      if (d.stickers) d.stickers = d.stickers.filter((s) => s.id !== this.selectedId);
      this.selectedId = null;
      NoorState.pushHistory();
      NoorRenderer.debouncedRender();
      NoorPanels.refresh();
      window.showToast?.("تم الحذف");
    });
  },

  loadControls(id) {
    const d = NoorState.design;
    const img = d.images?.find((i) => i.id === id);
    const stk = d.stickers?.find((s) => s.id === id);

    const size = document.getElementById("ee-size");
    const rotate = document.getElementById("ee-rotate");

    if (img) {
      size.value = img.width;
      rotate.value = img.rotation || 0;
    } else if (stk) {
      size.value = stk.size;
      rotate.value = stk.rotation || 0;
    }

    size?.addEventListener("input", () => {
      const val = parseInt(size.value);
      const d = NoorState.design;
      const img = d.images?.find((i) => i.id === id);
      const stk = d.stickers?.find((s) => s.id === id);
      if (img) img.width = val;
      if (stk) stk.size = val;
      NoorRenderer.debouncedRender();
    });

    rotate?.addEventListener("input", () => {
      const val = parseInt(rotate.value);
      const d = NoorState.design;
      const img = d.images?.find((i) => i.id === id);
      const stk = d.stickers?.find((s) => s.id === id);
      if (img) img.rotation = val;
      if (stk) stk.rotation = val;
      NoorRenderer.debouncedRender();
    });

    document.getElementById("ee-forward")?.addEventListener("click", () => {
      const d = NoorState.design;
      const arr = d.images || d.stickers;
      const idx = arr.findIndex((x) => x.id === id);
      if (idx > -1 && idx < arr.length - 1) {
        [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
        NoorRenderer.debouncedRender();
      }
    });

    document.getElementById("ee-backward")?.addEventListener("click", () => {
      const d = NoorState.design;
      const arr = d.images || d.stickers;
      const idx = arr.findIndex((x) => x.id === id);
      if (idx > 0) {
        [arr[idx], arr[idx - 1]] = [arr[idx - 1], arr[idx]];
        NoorRenderer.debouncedRender();
      }
    });
  },
});
