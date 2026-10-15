/* =========================================
   NoorKit — Tool: Ayah
   أداة الآية (مبسّطة)
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

    document.getElementById("open-font-panel")?.addEventListener("click", () => {
      this.openSubPanel();
    });
  },

  openSubPanel() {
    let subPanel = document.getElementById("sub-panel");
    if (!subPanel) {
      subPanel = document.createElement("div");
      subPanel.id = "sub-panel";
      subPanel.className = "sub-panel";
      document.body.appendChild(subPanel);
    }
    subPanel.innerHTML = this.renderFontSubPanel();
    subPanel.hidden = false;
    this.bindFontSubPanel();
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

        const font = NoorFonts.get(btn.dataset.font);
        const fontBtn = document.getElementById("open-font-panel");
        if (fontBtn) {
          fontBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="4 7 4 4 20 4 20 7"></polyline>
              <line x1="9" y1="20" x2="15" y2="20"></line>
              <line x1="12" y1="4" x2="12" y2="20"></line>
            </svg>
            الخط: ${font.name}
          `;
        }

        window.showToast?.("تم تغيير الخط");
      });
    });
  },

  escape(str) {
    return String(str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  },
});
