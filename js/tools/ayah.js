/* =========================================
   NoorKit — Tool: Ayah
   أداة الآية
   ========================================= */

NoorTools.register("ayah", {
  render() {
    const d = NoorState.design;
    const font = NoorFonts.get(d.text.fontId);
    return `
      <h3 class="panel-title">الآية</h3>

      <div class="panel-row">
        <label class="panel-label">السورة</label>
        <select class="select-input" id="surah-select"><option value="">-- اختر السورة --</option></select>
      </div>

      <div class="panel-row">
        <label class="panel-label">الآية</label>
        <select class="select-input" id="ayah-select" disabled><option value="">-- اختر السورة أولًا --</option></select>
      </div>

      <button class="action-btn" id="open-font-panel">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="4 7 4 4 20 4 20 7"></polyline>
          <line x1="9" y1="20" x2="15" y2="20"></line>
          <line x1="12" y1="4" x2="12" y2="20"></line>
        </svg>
        الخط: ${font.name}
      </button>

      <div class="panel-row" style="margin-top: 12px;">
        <label class="panel-label">حجم الخط</label>
        <div class="size-control">
          <button class="size-btn" data-size-action="minus" aria-label="تصغير">−</button>
          <input type="range" class="size-slider" id="font-size" min="24" max="140" value="${d.text.size}" />
          <button class="size-btn" data-size-action="plus" aria-label="تكبير">+</button>
          <input type="number" class="size-number" id="font-size-number" min="24" max="140" value="${d.text.size}" />
        </div>
      </div>

      <div class="panel-row">
        <label class="panel-label">لون النص</label>
        <div class="color-options" id="text-color-options">
          ${["#1a1a1a","#ffffff","#c9a227","#0d8b5f","#1e40af","#b91c1c","#7c3aed","#f59e0b","#be185d","#0891b2"].map((c) => `<button class="color-swatch ${d.text.color === c ? "active" : ""}" data-color="${c}" style="background:${c};${c === "#ffffff" ? "border:2px solid #e5e5e5;" : ""}"></button>`).join("")}
        </div>
      </div>

      <button class="action-btn" id="open-extra-options">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
        خيارات إضافية
      </button>
    `;
  },

  renderFontSubPanel() {
    const d = NoorState.design;
    return `
      <div class="sub-panel-header">
        <span class="sub-panel-title">اختر الخط</span>
        <button class="sub-panel-close" id="sub-panel-close" aria-label="إغلاق">×</button>
      </div>

      <div class="font-grid" id="font-grid">
        ${NoorFonts.renderOptions(d.text.fontId)}
      </div>
    `;
  },

  renderExtraSubPanel() {
    const d = NoorState.design;
    return `
      <div class="sub-panel-header">
        <span class="sub-panel-title">خيارات إضافية</span>
        <button class="sub-panel-close" id="sub-panel-close" aria-label="إغلاق">×</button>
      </div>

      <div class="switch-row" data-switch="showSurahName">
        <span class="switch-row-label">
          <svg class="switch-row-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 7V4h16v3"></path>
            <path d="M9 20h6"></path>
            <path d="M12 4v16"></path>
          </svg>
          عنوان الآية (اسم السورة)
        </span>
        <div class="switch ${d.ayah.showSurahName ? "active" : ""}"></div>
      </div>

      <div class="switch-row" data-switch="showBismillah">
        <span class="switch-row-label">
          <svg class="switch-row-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2L15.09 8.26 22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
          </svg>
          البسملة (﷽)
        </span>
        <div class="switch ${d.ayah.showBismillah ? "active" : ""}"></div>
      </div>

      <div class="switch-row" data-switch="showIstiadha">
        <span class="switch-row-label">
          <svg class="switch-row-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 6v6l4 2"></path>
          </svg>
          أعوذ بالله (الاستعاذة)
        </span>
        <div class="switch ${d.ayah.showIstiadha ? "active" : ""}"></div>
      </div>

      <div class="switch-row" data-switch="decorNumber">
        <span class="switch-row-label">
          <svg class="switch-row-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          رقم الآية داخل زخرفة
        </span>
        <div class="switch ${d.ayah.decorNumber ? "active" : ""}"></div>
      </div>

      <div class="panel-row" style="margin-top: 16px;">
        <label class="panel-label">زخارف إضافية</label>
        <div class="bg-grid" id="ayah-decorations">
          ${(typeof NoorDecorations !== "undefined" ? NoorDecorations.list : []).slice(0, 12).map((deco) => `<button class="bg-item" data-deco-id="${deco.id}" title="${deco.name}"><span class="bg-item-color" style="display:flex;align-items:center;justify-content:center;font-size:22px;font-family:'Amiri',serif;color:${deco.color || "#c9a227"};">${deco.symbol || "◆"}</span></button>`).join("")}
        </div>
      </div>
    `;
  },

  updateSizeUI() {
    const val = NoorState.design.text.size;
    const slider = document.getElementById("font-size");
    const numberInput = document.getElementById("font-size-number");
    if (slider) slider.value = val;
    if (numberInput) numberInput.value = val;
  },

  async setSize(value) {
    const clamped = Math.max(24, Math.min(140, parseInt(value) || 64));
    NoorState.design.text.size = clamped;
    this.updateSizeUI();
    await NoorRenderer.render();
  },

  async bind() {
    const surahSel = document.getElementById("surah-select");
    const ayahSel = document.getElementById("ayah-select");

    await QuranUI.populateSurahSelect(surahSel);

    const d = NoorState.design;
    if (d.ayah.surah) {
      surahSel.value = d.ayah.surah;
      await QuranUI.populateAyahSelect(d.ayah.surah, ayahSel);
      ayahSel.disabled = false;
      if (d.ayah.ayahNumber) ayahSel.value = d.ayah.ayahNumber;
    }

    surahSel?.addEventListener("change", async () => {
      const val = surahSel.value;
      if (!val) {
        ayahSel.innerHTML = '<option value="">-- اختر السورة أولًا --</option>';
        ayahSel.disabled = true;
        return;
      }
      await QuranUI.populateAyahSelect(val, ayahSel);
      ayahSel.disabled = false;
      NoorState.design.ayah.surah = parseInt(val);
      NoorState.design.ayah.surahName = QuranUI.surahsCache?.find((s) => s.number === parseInt(val))?.name || "";
      await NoorRenderer.render();
    });

    ayahSel?.addEventListener("change", async () => {
      const surah = surahSel.value;
      const ayah = ayahSel.value;
      if (!surah || !ayah) return;
      try {
        const text = await QuranUI.loadAyahText(surah, ayah);
        if (text) {
          NoorState.design.ayah.text = text;
          NoorState.design.ayah.ayahNumber = parseInt(ayah);
          NoorState.design.ayah.surahName = QuranUI.surahsCache?.find((s) => s.number === parseInt(surah))?.name || "";
          NoorState.pushHistory();
          await NoorRenderer.render();
          window.showToast?.("تم اختيار الآية " + ayah);
        }
      } catch (e) {
        window.showToast?.("تعذر تحميل الآية");
      }
    });

    document.querySelectorAll("#text-color-options .color-swatch").forEach((btn) => {
      btn.addEventListener("click", async () => {
        document.querySelectorAll("#text-color-options .color-swatch").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        NoorState.design.text.color = btn.dataset.color;
        NoorState.pushHistory();
        await NoorRenderer.render();
      });
    });

    document.getElementById("open-font-panel")?.addEventListener("click", () => {
      this.openSubPanel("font");
    });

    // Slider
    const sizeSlider = document.getElementById("font-size");
    sizeSlider?.addEventListener("input", () => {
      NoorState.design.text.size = parseInt(sizeSlider.value);
      const numberInput = document.getElementById("font-size-number");
      if (numberInput) numberInput.value = sizeSlider.value;
      NoorRenderer.render();
    });

    // Number input
    const sizeNumber = document.getElementById("font-size-number");
    sizeNumber?.addEventListener("change", async () => {
      await this.setSize(sizeNumber.value);
      NoorState.pushHistory();
    });

    // Plus / Minus buttons
    document.querySelectorAll(".size-btn[data-size-action]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const action = btn.dataset.sizeAction;
        const current = NoorState.design.text.size || 64;
        const step = 4;
        const next = action === "plus" ? current + step : current - step;
        await this.setSize(next);
        NoorState.pushHistory();
      });
    });

    document.getElementById("open-extra-options")?.addEventListener("click", () => {
      this.openSubPanel("extra");
    });
  },

  openSubPanel(type) {
    let subPanel = document.getElementById("sub-panel");
    if (!subPanel) {
      subPanel = document.createElement("div");
      subPanel.id = "sub-panel";
      subPanel.className = "sub-panel";
      document.body.appendChild(subPanel);
    }
    subPanel.innerHTML = type === "font" ? this.renderFontSubPanel() : this.renderExtraSubPanel();
    subPanel.hidden = false;
    if (type === "font") this.bindFontSubPanel();
    else this.bindExtraSubPanel();
  },

  closeSubPanel() {
    const subPanel = document.getElementById("sub-panel");
    if (subPanel) subPanel.hidden = true;
  },

  bindFontSubPanel() {
    document.getElementById("sub-panel-close")?.addEventListener("click", () => {
      this.closeSubPanel();
    });

    document.querySelectorAll("#sub-panel #font-grid .font-option").forEach((btn) => {
      btn.addEventListener("click", async () => {
        document.querySelectorAll("#sub-panel #font-grid .font-option").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        NoorState.design.text.fontId = btn.dataset.font;
        NoorState.pushHistory();
        await NoorRenderer.render();
        window.showToast?.("تم تغيير الخط");
      });
    });
  },

  bindExtraSubPanel() {
    document.getElementById("sub-panel-close")?.addEventListener("click", () => {
      this.closeSubPanel();
    });

    document.querySelectorAll("#sub-panel .switch-row").forEach((row) => {
      row.addEventListener("click", async () => {
        const key = row.dataset.switch;
        const d = NoorState.design;
        d.ayah[key] = !d.ayah[key];
        row.querySelector(".switch")?.classList.toggle("active");
        NoorState.pushHistory();
        await NoorRenderer.render();
      });
    });

    document.querySelectorAll("#sub-panel [data-deco-id]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.decoId;
        const d = NoorState.design;
        if (!d.decorations) d.decorations = [];
        const def = NoorDecorations.get(id);
        if (!def) return;
        d.decorations.push({
          id: id,
          x: d.width / 2,
          y: d.height - 100,
          size: def.size || 60,
          color: def.color || "#c9a227",
          rotation: 0,
        });
        NoorState.pushHistory();
        await NoorRenderer.render();
        window.showToast?.("تم إضافة الزخرفة");
      });
    });
  },

  escape(str) {
    return String(str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  },
});
