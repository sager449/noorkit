/* =========================================
   NoorKit — Editor Main
   ========================================= */

(function () {
  "use strict";

  let autoSaveTimer = null;
  const AUTO_SAVE = false;

  document.addEventListener("DOMContentLoaded", init);

  async function init() {
    try {
      NoorFonts.loadAll();
      NoorState.reset(1080, 1080);

      const canvas = document.getElementById("main-canvas");
      NoorRenderer.init(canvas);

      await NoorRenderer.preloadFonts();
      await NoorRenderer.render();

      setupHeader();
      setupToolbar();
      setupPanelClose();

      NoorState.pushHistory();

      window.showToast?.("مرحبًا بك في نور كيت");
    } catch (err) {
      console.error("Editor init failed:", err);
    }
  }

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
      saveDesignNow(true);
    });

    document.getElementById("export-btn")?.addEventListener("click", exportDesign);

    document.getElementById("size-btn")?.addEventListener("click", openSizePicker);

    document.getElementById("design-title")?.addEventListener("input", () => {
      if (AUTO_SAVE) scheduleAutoSave();
    });
  }

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

  function setupPanelClose() {
    document.getElementById("panel-close")?.addEventListener("click", () => {
      NoorPanels.close();
      document.querySelectorAll(".tool-btn").forEach((b) => b.classList.remove("active"));
    });
  }

  function scheduleAutoSave() {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => saveDesignNow(false), 800);
  }

  async function saveDesignNow(showMsg) {
    try {
      const title = document.getElementById("design-title")?.value.trim() || "تصميم بدون عنوان";
      NoorState.design.title = title;

      if (typeof NoorDB !== "undefined" && NoorDB.save) {
        await NoorDB.save(NoorState.design);
      }

      if (showMsg) window.showToast?.("تم الحفظ");
    } catch (err) {
      console.error("Save failed:", err);
      if (showMsg) window.showToast?.("تعذر الحفظ");
    }
  }

  async function exportDesign() {
    try {
      window.showToast?.("جاري التصدير...");
      await NoorRenderer.export();
      window.showToast?.("تم التصدير");
    } catch (err) {
      console.error("Export failed:", err);
      window.showToast?.("تعذر التصدير");
    }
  }

  function openSizePicker() {
    const panel = document.getElementById("tool-panel");
    const content = document.getElementById("panel-content");
    if (!panel || !content) return;

    const sizes = [
      { id: "square",   name: "مربع",       w: 1080, h: 1080, desc: "إنستغرام، فيسبوك" },
      { id: "portrait", name: "عمودي",      w: 1080, h: 1350, desc: "إنستغرام Portrait" },
      { id: "story",    name: "ستوري",      w: 1080, h: 1920, desc: "ستوري، تيك توك" },
      { id: "phone",    name: "خلفية جوال", w: 1080, h: 2340, desc: "خلفيات الجوال" },
      { id: "twitter",  name: "تويتر",      w: 1200, h: 675,  desc: "منشور تويتر" },
      { id: "youtube",  name: "يوتيوب",     w: 1280, h: 720,  desc: "Thumbnail" },
      { id: "a4",       name: "A4 للطباعة", w: 2480, h: 3508, desc: "طباعة عالية الدقة" },
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
      if (parseInt(btn.dataset.w) === NoorState.design.width && parseInt(btn.dataset.h) === NoorState.design.height) {
        btn.classList.add("active");
      }
      btn.addEventListener("click", async () => {
        NoorState.design.width = parseInt(btn.dataset.w);
        NoorState.design.height = parseInt(btn.dataset.h);
        NoorState.pushHistory();
        NoorRenderer.resize();
        await NoorRenderer.render();
        NoorPanels.close();
        document.querySelectorAll(".tool-btn").forEach((b) => b.classList.remove("active"));
        window.showToast?.(`تم تغيير الحجم إلى ${btn.dataset.w}×${btn.dataset.h}`);
      });
    });
  }

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
