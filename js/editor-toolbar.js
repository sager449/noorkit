/* =========================================
   NoorKit — Editor Toolbar System (v6)
   ========================================= */

window.NoorToolbar = {
  activePrimary: null,
  activeSecondary: null,
  lifted: false,
  containerEl: null,
  miniSheetEl: null,

  PRIMARY_TOOLS: [
    { id: "ayah", label: "الآية", svg: `<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>` },
    { id: "image", label: "صورة", svg: `<rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline>` },
    { id: "background", label: "خلفية", svg: `<rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline>` },
    { id: "frame", label: "إطار", svg: `<rect x="3" y="3" width="18" height="18" rx="2"></rect><rect x="7" y="7" width="10" height="10" rx="1"></rect>` },
    { id: "translation", label: "ترجمة", svg: `<circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>` },
    { id: "decor", label: "زخرفة", svg: `<path d="M12 2L15.09 8.26 22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>` },
    { id: "eraser", label: "مسح", svg: `<path d="M20 20H7L3 16a1 1 0 0 1 0-1.4L14.6 3a1 1 0 0 1 1.4 0L21 8a1 1 0 0 1 0 1.4L10.4 20"></path><line x1="18" y1="13" x2="6" y2="13"></line>` },
  ],

  SECONDARY_TOOLS: {
    ayah: [
      { id: "quran",       label: "القرآن", svg: `<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>` },
      { id: "font",        label: "خط",     svg: `<polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line>` },
      { id: "size",        label: "حجم",    svg: `<path d="M21 3H3v18h18V3z"></path><path d="M9 9h6v6H9z"></path>` },
      { id: "color",       label: "لون",    svg: `<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>` },
      { id: "align",       label: "محاذاة", svg: `<line x1="3" y1="6" x2="21" y2="6"></line><line x1="6" y1="12" x2="18" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line>` },
      { id: "move",        label: "حركة",   svg: `<polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line>` },
      { id: "shadow",      label: "ظل",     svg: `<circle cx="12" cy="12" r="9"></circle><path d="M12 3v18"></path>` },
      { id: "outline",     label: "حدود",   svg: `<circle cx="12" cy="12" r="9"></circle><circle cx="12" cy="12" r="5"></circle>` },
      { id: "gradient",    label: "تدرج",   svg: `<circle cx="12" cy="12" r="9"></circle><path d="M12 3a9 9 0 0 0 0 18"></path>` },
      { id: "glow",        label: "توهج",   svg: `<circle cx="12" cy="12" r="4"></circle><line x1="12" y1="2" x2="12" y2="5"></line><line x1="12" y1="19" x2="12" y2="22"></line><line x1="2" y1="12" x2="5" y2="12"></line><line x1="19" y1="12" x2="22" y2="12"></line>` },
      { id: "opacity",     label: "شفافية", svg: `<circle cx="12" cy="12" r="9" opacity="0.4"></circle><circle cx="12" cy="12" r="5"></circle>` },
      { id: "highlight",   label: "خلفية",  svg: `<rect x="3" y="6" width="18" height="12" rx="2"></rect>` },
      { id: "line-height", label: "تباعد",  svg: `<line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line>` },
      { id: "presets",     label: "جاهزة",  svg: `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>` },
      { id: "basmala",     label: "بسملة",  svg: `<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>` },
      { id: "istiadha",    label: "استعاذة", svg: `<path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path>` },
      { id: "ayahnum",     label: "رقم الآية", svg: `<circle cx="12" cy="12" r="9"></circle><text x="12" y="16" text-anchor="middle" font-size="10" fill="currentColor" stroke="none">١</text>` },
    ],
  },

  init() {
    this.build();
    this.bindLift();
    window.addEventListener("resize", () => {
      if (this.miniSheetEl?.classList.contains("open")) {
        this.positionMiniSheet();
      }
    });
  },

  build() {
    if (document.getElementById("nk-toolbars")) return;

    const container = document.createElement("div");
    container.id = "nk-toolbars";
    container.className = "nk-toolbars";
    container.innerHTML = `
      <div class="nk-toolbar-secondary" id="nk-toolbar-secondary"></div>
      <div class="nk-toolbar-primary" id="nk-toolbar-primary"></div>
      <div class="nk-lift-bar" id="nk-lift-bar">
        <div class="nk-lift-handle"></div>
      </div>
    `;

    document.body.appendChild(container);
    this.containerEl = container;

    this.renderPrimary();
  },

  renderPrimary() {
    const bar = document.getElementById("nk-toolbar-primary");
    if (!bar) return;

    bar.innerHTML = this.PRIMARY_TOOLS.map((tool) => `
      <button class="nk-tool-btn" data-nk-primary="${tool.id}">
        <svg viewBox="0 0 24 24">${tool.svg}</svg>
        <span class="nk-tool-label">${tool.label}</span>
      </button>
    `).join("");

    bar.querySelectorAll("[data-nk-primary]").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.selectPrimary(btn.dataset.nkPrimary);
      });
    });
  },

  selectPrimary(id) {
    const bar = document.getElementById("nk-toolbar-primary");
    if (!bar) return;

    if (this.activePrimary === id) {
      this.activePrimary = null;
      this.activeSecondary = null;
      bar.querySelectorAll(".nk-tool-btn").forEach((b) => b.classList.remove("active"));
      this.hideSecondary();
      this.closeMiniSheet();
      return;
    }

    this.activePrimary = id;
    this.activeSecondary = null;

    bar.querySelectorAll(".nk-tool-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.nkPrimary === id);
    });

    const secondary = this.SECONDARY_TOOLS[id];
    if (secondary && secondary.length > 0) {
      this.renderSecondary(id);
      this.showSecondary();
    } else {
      this.hideSecondary();
    }

    this.closeMiniSheet();
  },

  renderSecondary(primaryId) {
    const bar = document.getElementById("nk-toolbar-secondary");
    if (!bar) return;

    const tools = this.SECONDARY_TOOLS[primaryId] || [];

    bar.innerHTML = tools.map((tool) => `
      <button class="nk-tool-btn" data-nk-secondary="${tool.id}">
        <svg viewBox="0 0 24 24">${tool.svg}</svg>
        <span class="nk-tool-label">${tool.label}</span>
      </button>
    `).join("");

    bar.querySelectorAll("[data-nk-secondary]").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.selectSecondary(btn.dataset.nkSecondary);
      });
    });
  },

  showSecondary() {
    const bar = document.getElementById("nk-toolbar-secondary");
    if (bar) bar.classList.add("active");
  },

  hideSecondary() {
    const bar = document.getElementById("nk-toolbar-secondary");
    if (bar) {
      bar.classList.remove("active");
      bar.innerHTML = "";
    }
  },

  selectSecondary(id) {
    const bar = document.getElementById("nk-toolbar-secondary");
    if (!bar) return;

    if (this.activeSecondary === id) {
      this.activeSecondary = null;
      bar.querySelectorAll(".nk-tool-btn").forEach((b) => b.classList.remove("active"));
      this.closeMiniSheet();
      return;
    }

    this.activeSecondary = id;

    bar.querySelectorAll(".nk-tool-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.nkSecondary === id);
    });

    this.openMiniSheet(id);
  },

  buildMiniSheet() {
    if (document.getElementById("nk-mini-sheet")) return;

    const sheet = document.createElement("div");
    sheet.id = "nk-mini-sheet";
    sheet.className = "nk-mini-sheet";
    sheet.setAttribute("aria-hidden", "true");
    sheet.innerHTML = `
      <div class="nk-mini-header">
        <button class="nk-mini-close" id="nk-mini-close">✕</button>
        <span class="nk-mini-title" id="nk-mini-title">خيارات</span>
        <span class="nk-mini-spacer"></span>
      </div>
      <div class="nk-mini-content" id="nk-mini-content"></div>
    `;

    document.body.appendChild(sheet);
    this.miniSheetEl = sheet;

    document.getElementById("nk-mini-close")?.addEventListener("click", () => {
      this.activeSecondary = null;
      const bar = document.getElementById("nk-toolbar-secondary");
      if (bar) {
        bar.querySelectorAll(".nk-tool-btn").forEach((b) => b.classList.remove("active"));
      }
      this.closeMiniSheet();
    });
  },

  openMiniSheet(toolId) {
    if (!this.miniSheetEl) this.buildMiniSheet();
    if (!this.miniSheetEl) return;

    const content = document.getElementById("nk-mini-content");
    const title = document.getElementById("nk-mini-title");
    if (!content) return;

    const allTools = Object.values(this.SECONDARY_TOOLS).flat();
    const toolDef = allTools.find((t) => t.id === toolId);
    if (title && toolDef) title.textContent = toolDef.label;

    let html = "";

    if (toolId === "quran" && typeof NoorQuranPanel !== "undefined") {
      html = NoorQuranPanel.render();
    } else if (typeof NoorTextStyles !== "undefined" && NoorTextStyles.get(toolId)) {
      html = NoorTextStyles.renderContent(toolId);
    } else if (typeof NoorTextEditor !== "undefined") {
      html = NoorTextEditor.renderToolContent(toolId);
    }

    content.innerHTML = html;

    if (toolId === "quran" && typeof NoorQuranPanel !== "undefined") {
      NoorQuranPanel.bind();
    } else if (typeof NoorTextStyles !== "undefined" && NoorTextStyles.get(toolId)) {
      NoorTextStyles.bindContent(toolId);
    } else if (typeof NoorTextEditor !== "undefined") {
      NoorTextEditor.bindToolContent(toolId);
    }

    this.positionMiniSheet();

    const editorMain = document.querySelector(".editor-main");
    if (editorMain) editorMain.classList.add("mini-open");

    this.miniSheetEl.classList.add("open");
    this.miniSheetEl.setAttribute("aria-hidden", "false");
  },

  positionMiniSheet() {
    if (!this.miniSheetEl || !this.containerEl) return;
    const rect = this.containerEl.getBoundingClientRect();
    const barsHeight = window.innerHeight - rect.top;
    this.miniSheetEl.style.bottom = barsHeight + "px";
  },

  closeMiniSheet() {
    if (!this.miniSheetEl) return;
    this.miniSheetEl.classList.remove("open");
    this.miniSheetEl.setAttribute("aria-hidden", "true");

    const editorMain = document.querySelector(".editor-main");
    if (editorMain) editorMain.classList.remove("mini-open");
  },

  bindLift() {
    document.getElementById("nk-lift-bar")?.addEventListener("click", () => {
      this.lifted = !this.lifted;
      this.containerEl?.classList.toggle("lifted", this.lifted);
    });
  },
};

document.addEventListener("DOMContentLoaded", () => {
  if (typeof NoorToolbar !== "undefined") {
    NoorToolbar.init();
  }
});
