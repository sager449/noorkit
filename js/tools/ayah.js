/* =========================================
   NoorKit — Tool: Ayah
   أداة الآية (السورة + الآية + الخط + اللون + الزخارف)
   ========================================= */

NoorTools.register("ayah", {
  render() {
    const d = NoorState.design;
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

      <div class="panel-row">
        <label class="panel-label">أو اكتب يدويًا</label>
        <textarea class="textarea-input" id="ayah-text" dir="rtl" placeholder="اكتب النص هنا...">${this.escape(d.ayah.text)}</textarea>
      </div>

      <div class="panel-row">
        <label class="panel-label">الخط</label>
        <div class="font-grid" id="font-grid">${NoorFonts.renderOptions(d.text.fontId)}</div>
      </div>

      <div class="panel-row">
        <label class="panel-label">حجم الخط: <output id="size-value">${d.text.size}</output>px</label>
        <input type="range" class="size-slider" id="font-size" min="24" max="140" value="${d.text.size}" />
      </div>

      <div class="panel-row">
        <label class="panel-label">لون النص</label>
        <div class="color-options" id="text-color-options">
          ${["#1a1a1a","#ffffff","#c9a227","#0d8b5f","#1e40af","#b91c1c","#7c3aed","#f59e0b","#be185d","#0891b2"].map((c) => `<button class="color-swatch ${d.text.color === c ? "active" : ""}" data-color="${c}" style="background:${c};${c === "#ffffff" ? "border:2px solid #e5e5e5;" : ""}"></button>`).join("")}
        </div>
      </div>

      <div class="panel-row">
        <label class="panel-label">عنوان الآية (اسم السورة)</label>
        <div class="toggle-group" id="surah-name-group">
          <button class="toggle-btn ${d.ayah.showSurahName ? "active" : ""}" data-surah-name="on">إظهار</button>
          <button class="toggle-btn ${!d.ayah.showSurahName ? "active" : ""}" data-surah-name="off">إخفاء</button>
        </div>
      </div>

      <div class="panel-row">
        <label class="panel-label">البسملة (﷽)</label>
        <div class="toggle-group" id="bismillah-group">
          <button class="toggle-btn ${d.ayah.showBismillah ? "active" : ""}" data-bismillah="on">إظهار</button>
          <button class="toggle-btn ${!d.ayah.showBismillah ? "active" : ""}" data-bismillah="off">إخفاء</button>
        </div>
      </div>

      <div class="panel-row">
        <label class="panel-label">أعوذ بالله (الاستعاذة)</label>
        <div class="toggle-group" id="istiadha-group">
          <button class="toggle-btn ${d.ayah.showIstiadha ? "active" : ""}" data-istiadha="on">إظهار</button>
          <button class="toggle-btn ${!d.ayah.showIstiadha ? "active" : ""}" data-istiadha="off">إخفاء</button>
        </div>
      </div>

      <div class="panel-row">
        <label class="panel-label">رقم الآية داخل زخرفة</label>
        <div class="toggle-group" id="ayah-num-group">
          <button class="toggle-btn ${d.ayah.decorNumber ? "active" : ""}" data-ayah-num="on">إظهار</button>
          <button class="toggle-btn ${!d.ayah.decorNumber ? "active" : ""}" data-ayah-num="off">إخفاء</button>
        </div>
      </div>

      <div class="panel-row">
        <label class="panel-label">زخارف إضافية</label>
        <div class="bg-grid" id="ayah-decorations">
          ${(typeof NoorDecorations !== "undefined" ? NoorDecorations.list : []).slice(0, 12).map((deco) => `<button class="bg-item" data-deco-id="${deco.id}" title="${deco.name}"><span class="bg-item-color" style="display:flex;align-items:center;justify-content:center;font-size:22px;font-family:'Amiri',serif;color:${deco.color || "#c9a227"};">${deco.symbol || "◆"}</span></button>`).join("")}
        </div>
      </div>
    `;
  },

  escape(str) {
    return String(str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  },
});
/* =========================================
   NoorKit — Tool: Ayah
   أداة الآية
   ========================================= */

NoorTools.register("ayah", {
  render() {
    const d = NoorState.design;
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

      <div class="panel-row">
        <label class="panel-label">أو اكتب يدويًا</label>
        <textarea class="textarea-input" id="ayah-text" dir="rtl" placeholder="اكتب النص هنا...">${this.escape(d.ayah.text)}</textarea>
      </div>

      <div class="panel-row">
        <label class="panel-label">الخط</label>
        <div class="font-grid" id="font-grid">${NoorFonts.renderOptions(d.text.fontId)}</div>
      </div>

      <div class="panel-row">
        <label class="panel-label">حجم الخط: <output id="size-value">${d.text.size}</output>px</label>
        <input type="range" class="size-slider" id="font-size" min="24" max="140" value="${d.text.size}" />
      </div>

      <div class="panel-row">
        <label class="panel-label">لون النص</label>
        <div class="color-options" id="text-color-options">
          ${["#1a1a1a","#ffffff","#c9a227","#0d8b5f","#1e40af","#b91c1c","#7c3aed","#f59e0b","#be185d","#0891b2"].map((c) => `<button class="color-swatch ${d.text.color === c ? "active" : ""}" data-color="${c}" style="background:${c};${c === "#ffffff" ? "border:2px solid #e5e5e5;" : ""}"></button>`).join("")}
        </div>
      </div>

      <div class="panel-row">
        <label class="panel-label">عنوان الآية (اسم السورة)</label>
        <div class="toggle-group" id="surah-name-group">
          <button class="toggle-btn ${d.ayah.showSurahName ? "active" : ""}" data-surah-name="on">إظهار</button>
          <button class="toggle-btn ${!d.ayah.showSurahName ? "active" : ""}" data-surah-name="off">إخفاء</button>
        </div>
      </div>

      <div class="panel-row">
        <label class="panel-label">البسملة (﷽)</label>
        <div class="toggle-group" id="bismillah-group">
          <button class="toggle-btn ${d.ayah.showBismillah ? "active" : ""}" data-bismillah="on">إظهار</button>
          <button class="toggle-btn ${!d.ayah.showBismillah ? "active" : ""}" data-bismillah="off">إخفاء</button>
        </div>
      </div>

      <div class="panel-row">
        <label class="panel-label">أعوذ بالله (الاستعاذة)</label>
        <div class="toggle-group" id="istiadha-group">
          <button class="toggle-btn ${d.ayah.showIstiadha ? "active" : ""}" data-istiadha="on">إظهار</button>
          <button class="toggle-btn ${!d.ayah.showIstiadha ? "active" : ""}" data-istiadha="off">إخفاء</button>
        </div>
      </div>

      <div class="panel-row">
        <label class="panel-label">رقم الآية داخل زخرفة</label>
        <div class="toggle-group" id="ayah-num-group">
          <button class="toggle-btn ${d.ayah.decorNumber ? "active" : ""}" data-ayah-num="on">إظهار</button>
          <button class="toggle-btn ${!d.ayah.decorNumber ? "active" : ""}" data-ayah-num="off">إخفاء</button>
        </div>
      </div>

      <div class="panel-row">
        <label class="panel-label">زخارف إضافية</label>
        <div class="bg-grid" id="ayah-decorations">
          ${(typeof NoorDecorations !== "undefined" ? NoorDecorations.list : []).slice(0, 12).map((deco) => `<button class="bg-item" data-deco-id="${deco.id}" title="${deco.name}"><span class="bg-item-color" style="display:flex;align-items:center;justify-content:center;font-size:22px;font-family:'Amiri',serif;color:${deco.color || "#c9a227"};">${deco.symbol || "◆"}</span></button>`).join("")}
        </div>
      </div>
    `;
  },

  async bind() {
    const surahSel = document.getElementById("surah-select");
    const ayahSel = document.getElementById("ayah-select");
    const textArea = document.getElementById("ayah-text");

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
          textArea.value = text;
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

    textArea?.addEventListener("input", () => {
      NoorState.design.ayah.text = textArea.value;
      NoorRenderer.render();
    });

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

    document.querySelectorAll("#text-color-options .color-swatch").forEach((btn) => {
      btn.addEventListener("click", async () => {
        document.querySelectorAll("#text-color-options .color-swatch").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        NoorState.design.text.color = btn.dataset.color;
        NoorState.pushHistory();
        await NoorRenderer.render();
      });
    });

    document.querySelectorAll("#surah-name-group [data-surah-name]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        document.querySelectorAll("#surah-name-group [data-surah-name]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        NoorState.design.ayah.showSurahName = btn.dataset.surahName === "on";
        NoorState.pushHistory();
        await NoorRenderer.render();
      });
    });

    document.querySelectorAll("#bismillah-group [data-bismillah]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        document.querySelectorAll("#bismillah-group [data-bismillah]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        NoorState.design.ayah.showBismillah = btn.dataset.bismillah === "on";
        NoorState.pushHistory();
        await NoorRenderer.render();
      });
    });

    document.querySelectorAll("#istiadha-group [data-istiadha]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        document.querySelectorAll("#istiadha-group [data-istiadha]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        NoorState.design.ayah.showIstiadha = btn.dataset.istiadha === "on";
        NoorState.pushHistory();
        await NoorRenderer.render();
      });
    });

    document.querySelectorAll("#ayah-num-group [data-ayah-num]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        document.querySelectorAll("#ayah-num-group [data-ayah-num]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        NoorState.design.ayah.decorNumber = btn.dataset.ayahNum === "on";
        NoorState.pushHistory();
        await NoorRenderer.render();
      });
    });

    document.querySelectorAll("[data-deco-id]").forEach((btn) => {
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
