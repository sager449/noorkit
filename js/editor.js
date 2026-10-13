/* =========================================
   NoorKit — Editor Main
   يربط كل شيء ببعضه
   ========================================= */

(function () {
  "use strict";

  let autoSaveTimer = null;

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", init);

  async function init() {
    try {
      // 1. Preload fonts
      NoorFonts.loadAll();

      // 2. Init state
      NoorState.reset(1080, 1080);

      // 3. Init renderer
      const canvas = document.getElementById("main-canvas");
      NoorRenderer.init(canvas);

      // 4. Wait for fonts to load
      await NoorRenderer.preloadFonts();

      // 5. First render
      await NoorRenderer.render();

      // 6. Setup UI
      setupHeader();
      setupToolbar();
      setupPanelClose();

      // 7. Restore saved design if exists
      await restoreLastDesign();

      // 8. Push initial history
      NoorState.pushHistory();

      window.showToast?.("مرحبًا بك في نور كيت");
    } catch (err) {
      console.error("Editor init failed:", err);
    }
  }

  /* ---------- Header buttons ---------- */
  function setupHeader() {
    document.getElementById("undo-btn")?.addEventListener("click", async () => {
      if (NoorState.undo()) {
        await NoorRenderer.render();
        window.showToast?.("تم التراجع");
      }
    });

    document.getElementById("redo-btn")?.addEventListener("click", async () => {
      if (NoorState.redo()) {
        await NoorRenderer.render();
        window.showToast?.("تم الإعادة");
      }
    });

    document.getElementById("save-btn")?.addEventListener("click", () => {
      saveDesign(true);
    });

    document.getElementById("export-btn")?.addEventListener("click", exportDesign);

    document.getElementById("size-btn")?.addEventListener("click", openSizePicker);

    document.getElementById("design-title")?.addEventListener("input", () => {
      scheduleAutoSave();
    });
  }

  /* ---------- Toolbar buttons ---------- */
  function setupToolbar() {
    document.querySelectorAll(".tool-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tool = btn.dataset.tool;
        if (NoorPanels.activeTool === tool) {
          NoorPanels.close();
          btn.classList.remove("active");
          return;
        }
        document.querySelectorAll(".tool-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        NoorPanels.open(tool);
      });
    });
  }

  /* ---------- Panel close ---------- */
  function setupPanelClose() {
    document.getElementById("panel-close")?.addEventListener("click", () => {
      NoorPanels.close();
      document.querySelectorAll(".tool-btn").forEach((b) => b.classList.remove("active"));
    });
  }

  /* ---------- Auto save ---------- */
  function scheduleAutoSave() {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => saveDesign(false), 800);
  }

  /* ---------- Save design ---------- */
  async function saveDesign(showMsg) {
    try {
      const title = document.getElementById("design-title")?.value.trim() || "تصميم بدون عنوان";
      NoorState.design.title = title;

      if (typeof saveDesign === "function") {
        await saveDesign(NoorState.design);
      } else if (typeof NoorDB !== "undefined") {
        await NoorDB.save(NoorState.design);
      }

      if (showMsg) window.showToast?.("تم الحفظ");
    } catch (err) {
      console.error("Save failed:", err);
      if (showMsg) window.showToast?.("تعذر الحفظ");
    }
  }

  /* ---------- Export design ---------- */
  async function exportDesign() {
    try {
      window.showToast?.("جاري التصدير...");
      await NoorState.design && await NoorRenderer.export();
      window.showToast?.("تم التصدير");
    } catch (err) {
      console.error("Export failed:", err);
      window.showToast?.("تعذر التصدير");
    }
  }
    /* ---------- Size picker (bottom sheet) ---------- */
  function openSizePicker() {
    const panel = document.getElementById("tool-panel");
    const content = document.getElementById("panel-content");
    if (!panel || !content) return;

    const sizes = [
      { id: "square",    name: "مربع",            w: 1080, h: 1080, desc: "إنستغرام، فيسبوك" },
      { id: "portrait",  name: "عمودي",           w: 1080, h: 1350, desc: "إنستغرام Portrait" },
      { id: "story",     name: "ستوري",           w: 1080, h: 1920, desc: "ستوري، تيك توك" },
      { id: "phone",     name: "خلفية جوال",      w: 1080, h: 2340, desc: "خلفيات الجوال" },
      { id: "twitter",   name: "تويتر",           w: 1200, h: 675,  desc: "منشور تويتر" },
      { id: "youtube",   name: "يوتيوب",          w: 1280, h: 720,  desc: "Thumbnail" },
      { id: "a4",        name: "A4 للطباعة",      w: 2480, h: 3508, desc: "طباعة عالية الدقة" },
    ];

    content.innerHTML = `
      <h3 class="panel-title">حجم التصميم</h3>
      <div class="toggle-group" id="size-list" style="grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));">
        ${sizes.map((s) => `
          <button class="toggle-btn" data-size-id="${s.id}" data-w="${s.w}" data-h="${s.h}" style="padding:16px 10px;flex-direction:column;gap:4px;display:flex;">
            <strong style="font-size:14px;">${s.name}</strong>
            <span style="font-size:11px;opacity:0.7;">${s.w}×${s.h}</span>
            <span style="font-size:10px;opacity:0.5;">${s.desc}</span>
          </button>
        `).join("")}
      </div>
    `;

    panel.hidden = false;

    content.querySelectorAll("[data-size-id]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const w = parseInt(btn.dataset.w);
        const h = parseInt(btn.dataset.h);
        NoorState.design.width = w;
        NoorState.design.height = h;
        NoorState.pushHistory();
        NoorRenderer.resize();
        await NoorRenderer.render();
        NoorPanels.close();
        document.querySelectorAll(".tool-btn").forEach((b) => b.classList.remove("active"));
        window.showToast?.(`تم تغيير الحجم إلى ${w}×${h}`);
      });
    });

    // Highlight current size
    content.querySelectorAll("[data-size-id]").forEach((btn) => {
      if (parseInt(btn.dataset.w) === NoorState.design.width && parseInt(btn.dataset.h) === NoorState.design.height) {
        btn.classList.add("active");
      }
    });
  }

  /* ---------- Restore last design from IndexedDB ---------- */
  async function restoreLastDesign() {
    try {
      let record = null;

      if (typeof NoorDB !== "undefined" && NoorDB.getLast) {
        record = await NoorDB.getLast();
      } else if (typeof getLastDesign === "function") {
        record = await getLastDesign();
      }

      if (record && record.design) {
        NoorState.load(record);
        const titleInput = document.getElementById("design-title");
        if (titleInput) titleInput.value = record.design.title || "تصميم بدون عنوان";
        await NoorRenderer.resize();
        await NoorRenderer.render();
      }
    } catch (err) {
      console.warn("No saved design found:", err);
    }
  }

  /* ---------- Keyboard shortcuts ---------- */
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
      e.preventDefault();
      document.getElementById("undo-btn")?.click();
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.shiftKey && e.key === "Z"))) {
      e.preventDefault();
      document.getElementById("redo-btn")?.click();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      document.getElementById("save-btn")?.click();
    }
    if (e.key === "Escape") {
      NoorPanels.close();
      document.querySelectorAll(".tool-btn").forEach((b) => b.classList.remove("active"));
    }
  });

})();
