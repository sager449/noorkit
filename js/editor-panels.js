/* =========================================
   NoorKit — Editor Panels
   ========================================= */

window.NoorPanels = {
  activeTool: null,

  open(tool) {
    this.activeTool = tool;
    const panel = document.getElementById("tool-panel");
    const content = document.getElementById("panel-content");
    if (!panel || !content) return;

    if (tool === "ayah") content.innerHTML = this.renderAyahPanel();
    else if (tool === "image") content.innerHTML = this.renderImagePanel();
    else if (tool === "font") content.innerHTML = this.renderFontPanel();
    else if (tool === "text-color") content.innerHTML = this.renderTextColorPanel();
    else if (tool === "background") content.innerHTML = this.renderBackgroundPanel();
    else if (tool === "frame") content.innerHTML = this.renderFramePanel();
    else if (tool === "translation") content.innerHTML = this.renderTranslationPanel();
    else if (tool === "decor") content.innerHTML = this.renderDecorPanel();
    else if (typeof NoorTools !== "undefined" && NoorTools.has(tool)) content.innerHTML = NoorTools.render(tool);

    panel.hidden = false;
    this.bind(tool);
  },

  close() {
    const panel = document.getElementById("tool-panel");
    if (panel) panel.hidden = true;
    this.activeTool = null;
  },

  refresh() {
    if (this.activeTool) this.open(this.activeTool);
  },

  renderAyahPanel() {
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
  <div class="toggle-group" id="show-surah-name">
    <button class="toggle-btn ${d.ayah.showSurahName ? "active" : ""}" data-surah-name="on">إظهار</button>
    <button class="toggle-btn ${!d.ayah.showSurahName ? "active" : ""}" data-surah-name="off">إخفاء</button>
  </div>
</div>

<div class="panel-row">
  <label class="panel-label">البسملة (﷽)</label>
  <div class="toggle-group" id="show-bismillah">
    <button class="toggle-btn ${d.ayah.showBismillah ? "active" : ""}" data-bismillah="on">إظهار</button>
    <button class="toggle-btn ${!d.ayah.showBismillah ? "active" : ""}" data-bismillah="off">إخفاء</button>
  </div>
</div>

<div class="panel-row">
  <label class="panel-label">أعوذ بالله (الاستعاذة)</label>
  <div class="toggle-group" id="show-istiadha">
    <button class="toggle-btn ${d.ayah.showIstiadha ? "active" : ""}" data-istiadha="on">إظهار</button>
    <button class="toggle-btn ${!d.ayah.showIstiadha ? "active" : ""}" data-istiadha="off">إخفاء</button>
  </div>
</div>

<div class="panel-row">
  <label class="panel-label">رقم الآية داخل زخرفة</label>
  <div class="toggle-group" id="show-ayah-num">
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
   renderImagePanel() {
  return `
    <h3 class="panel-title">إضافة صورة</h3>
    <div class="panel-row"><button class="panel-btn" id="pick-image-btn">📷 اختر صورة من جهازك</button></div>
    <input type="file" id="image-picker" accept="image/*" hidden />
    <div class="panel-row">
      <label class="panel-label">رموز جاهزة</label>
      <div class="bg-grid" id="image-templates">
        <button class="bg-item" data-image-tpl="allah"><span class="bg-item-color" style="background:#7c3aed;color:#fff;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:800;">الله</span></button>
        <button class="bg-item" data-image-tpl="muhammad"><span class="bg-item-color" style="background:#7c3aed;color:#fff;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;">محمد</span></button>
        <button class="bg-item" data-image-tpl="bismillah"><span class="bg-item-color" style="background:#c9a227;color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;">﷽</span></button>
        <button class="bg-item" data-image-tpl="star"><span class="bg-item-color" style="background:#1e40af;color:#fff;display:flex;align-items:center;justify-content:center;font-size:22px;">★</span></button>
      </div>
    </div>
  `;
},

renderFontPanel() {
  const d = NoorState.design;
  return `
    <h3 class="panel-title">الخط</h3>
    <div class="panel-row"><label class="panel-label">اختر الخط</label><div class="font-grid" id="font-grid">${NoorFonts.renderOptions(d.text.fontId)}</div></div>
    <div class="panel-row"><label class="panel-label">حجم الخط: <output id="size-value">${d.text.size}</output>px</label><input type="range" class="size-slider" id="font-size" min="24" max="140" value="${d.text.size}" /></div>
    <div class="panel-row"><label class="panel-label">محاذاة النص</label><div class="toggle-group" id="align-group">
      <button class="toggle-btn ${d.text.align === "right" ? "active" : ""}" data-align="right">يمين</button>
      <button class="toggle-btn ${d.text.align === "center" ? "active" : ""}" data-align="center">وسط</button>
      <button class="toggle-btn ${d.text.align === "left" ? "active" : ""}" data-align="left">يسار</button>
    </div></div>
    <div class="panel-row"><label class="panel-label">الظل</label><div class="toggle-group" id="shadow-group">
      <button class="toggle-btn ${d.text.shadow ? "active" : ""}" data-shadow="on">تشغيل</button>
      <button class="toggle-btn ${!d.text.shadow ? "active" : ""}" data-shadow="off">إيقاف</button>
    </div></div>
  `;
},

renderTextColorPanel() {
  const d = NoorState.design;
  const colors = ["#1a1a1a","#ffffff","#c9a227","#f5ede0","#0d8b5f","#1e40af","#b91c1c","#7c3aed","#78350f","#be185d"];
  return `
    <h3 class="panel-title">لون النص</h3>
    <div class="panel-row"><label class="panel-label">اختر اللون</label><div class="color-options" id="text-color-options">
      ${colors.map((c) => `<button class="color-swatch ${d.text.color === c ? "active" : ""}" data-color="${c}" style="background:${c};${c === "#ffffff" ? "border:2px solid #e5e5e5;" : ""}"></button>`).join("")}
    </div></div>
  `;
},
  
  renderBackgroundPanel() {
    const d = NoorState.design;
    const colorItems = NoorBackgrounds.solidColors.map((c) => `<button class="bg-item ${d.background.type === "solid" && d.background.value === c.color ? "active" : ""}" data-bg-type="solid" data-bg-value="${c.color}" title="${c.name}"><span class="bg-item-color" style="background:${c.color};"></span></button>`).join("");
    const gradientItems = NoorBackgrounds.gradients.map((g) => `<button class="bg-item ${d.background.type === "gradient" && d.background.value === g.css ? "active" : ""}" data-bg-type="gradient" data-bg-value="${this.escape(g.css)}" title="${g.name}"><span class="bg-item-color" style="background:${g.css};"></span></button>`).join("");
    const categoryItems = NoorBackgrounds.categories.map((c) => `<button class="bg-item" data-bg-category="${c.id}" title="${c.name}"><span class="bg-item-color" style="background:var(--cream);display:flex;align-items:center;justify-content:center;font-size:24px;">${c.icon}</span><span class="bg-item-label">${c.name}</span></button>`).join("");
    return `
      <h3 class="panel-title">الخلفية</h3>
      <div class="panel-row"><label class="panel-label">ألوان</label><div class="bg-grid">${colorItems}</div></div>
      <div class="panel-row"><label class="panel-label">تدرجات</label><div class="bg-grid">${gradientItems}</div></div>
      <div class="panel-row"><label class="panel-label">صور طبيعية</label><div class="bg-grid">${categoryItems}</div><p class="panel-note" id="bg-note" hidden>جاري تحميل الصورة...</p></div>
    `;
  },

  renderFramePanel() {
    const d = NoorState.design;
    const frames = [{ id: "none", name: "بدون" },{ id: "simple", name: "بسيط" },{ id: "double", name: "مزدوج" },{ id: "ornate", name: "مزخرف" }];
    const colors = ["#c9a227", "#7c3aed", "#1a1a1a", "#ffffff", "#78350f", "#1e40af"];
    return `
      <h3 class="panel-title">الإطار</h3>
      <div class="panel-row"><label class="panel-label">النوع</label><div class="frame-grid" id="frame-types">
        ${frames.map((f) => `<button class="frame-item ${d.frame.type === f.id ? "active" : ""}" data-frame="${f.id}" title="${f.name}">${f.id === "none" ? '<span style="font-size:11px;color:var(--muted);">بدون</span>' : `<span class="frame-preview ${f.id}"></span>`}</button>`).join("")}
      </div></div>
      <div class="panel-row"><label class="panel-label">اللون</label><div class="color-options" id="frame-colors">
        ${colors.map((c) => `<button class="color-swatch ${d.frame.color === c ? "active" : ""}" data-color="${c}" style="background:${c};${c === "#ffffff" ? "border:2px solid #e5e5e5;" : ""}"></button>`).join("")}
      </div></div>
      <div class="panel-row"><label class="panel-label">السماكة: <output id="frame-thick-value">${d.frame.thickness}</output>px</label><input type="range" class="size-slider" id="frame-thickness" min="2" max="20" value="${d.frame.thickness}" /></div>
    `;
  },

  renderTranslationPanel() {
    const d = NoorState.design;
    const langs = [
      { id: "en", name: "English" },
      { id: "fr", name: "Français" },
      { id: "es", name: "Español" },
      { id: "ur", name: "اردو" },
      { id: "id", name: "Indonesia" },
      { id: "tr", name: "Türkçe" },
      { id: "ru", name: "Русский" }
    ];
    return `
      <h3 class="panel-title">الترجمة</h3>
      <div class="panel-row"><label class="panel-label">تشغيل</label><div class="toggle-group">
        <button class="toggle-btn ${d.translation.enabled ? "active" : ""}" data-trans="on">تشغيل</button>
        <button class="toggle-btn ${!d.translation.enabled ? "active" : ""}" data-trans="off">إيقاف</button>
      </div></div>
      <div class="panel-row"><label class="panel-label">اللغة</label><div class="lang-grid" id="lang-grid">
        ${langs.map((l) => `<button class="lang-btn ${d.translation.lang === l.id ? "active" : ""}" data-lang="${l.id}">${l.name}</button>`).join("")}
      </div></div>
      <div class="panel-row"><label class="panel-label">أو اكتب الترجمة يدويًا</label><textarea class="textarea-input" id="translation-text" dir="ltr" placeholder="Translation...">${this.escape(d.translation.text)}</textarea></div>
      <div class="panel-row"><label class="panel-label">حجم الترجمة: <output id="trans-size-value">${d.translation.size}</output>px</label><input type="range" class="size-slider" id="trans-size" min="14" max="60" value="${d.translation.size}" /></div>
    `;
  },

  renderDecorPanel() {
    const d = NoorState.design;
    return `
      <h3 class="panel-title">الزخرفة</h3>
      <div class="panel-row"><label class="panel-label">البسملة في الأعلى (﷽)</label><div class="toggle-group">
        <button class="toggle-btn ${d.decor.top ? "active" : ""}" data-decor="top-on">تشغيل</button>
        <button class="toggle-btn ${!d.decor.top ? "active" : ""}" data-decor="top-off">إيقاف</button>
      </div></div>
      <div class="panel-row"><label class="panel-label">زخرفة في الأسفل (❁ ❁ ❁)</label><div class="toggle-group">
        <button class="toggle-btn ${d.decor.bottom ? "active" : ""}" data-decor="bottom-on">تشغيل</button>
        <button class="toggle-btn ${!d.decor.bottom ? "active" : ""}" data-decor="bottom-off">إيقاف</button>
      </div></div>
    `;
  },

  escape(str) {
    return String(str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  },
};

/* =========================================
   Event Binding
   ========================================= */

window.NoorPanels.bind = async function (tool) {

  if (tool === "ayah") {
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
      NoorRenderer.debouncedRender();
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
          NoorState.pushHistory();
          NoorRenderer.debouncedRender();
        }
      } catch (e) {
        window.showToast?.("تعذر تحميل الآية");
      }
    });

    textArea?.addEventListener("input", () => {
      NoorState.design.ayah.text = textArea.value;
      NoorRenderer.debouncedRender();
    });
    textArea?.addEventListener("change", () => NoorState.pushHistory());

    document.querySelectorAll("#font-grid .font-option").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("#font-grid .font-option").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        NoorState.design.text.fontId = btn.dataset.font;
        NoorState.pushHistory();
        NoorRenderer.debouncedRender();
      });
    });

    const sizeInput = document.getElementById("font-size");
    const sizeOut = document.getElementById("size-value");
    sizeInput?.addEventListener("input", () => {
      NoorState.design.text.size = parseInt(sizeInput.value);
      if (sizeOut) sizeOut.textContent = sizeInput.value;
      NoorRenderer.debouncedRender();
    });
    sizeInput?.addEventListener("change", () => NoorState.pushHistory());

    document.querySelectorAll("#text-color-options .color-swatch").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("#text-color-options .color-swatch").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        NoorState.design.text.color = btn.dataset.color;
        NoorState.pushHistory();
        NoorRenderer.debouncedRender();
      });
    });
  }
  
if (tool === "image") {
  const pickBtn = document.getElementById("pick-image-btn");
  const picker = document.getElementById("image-picker");

  pickBtn?.addEventListener("click", () => picker?.click());

  picker?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const d = NoorState.design;
        const maxW = d.width * 0.6;
        const ratio = img.height / img.width;
        const w = Math.min(maxW, img.width);
        const h = w * ratio;
        if (!d.images) d.images = [];
        d.images.push({
          id: "img_" + Date.now(),
          src: ev.target.result,
          x: (d.width - w) / 2,
          y: (d.height - h) / 2,
          width: w,
          height: h,
          rotation: 0,
        });
        NoorState.pushHistory();
        NoorRenderer.debouncedRender();
        window.showToast?.("تم إضافة الصورة");
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });

  document.querySelectorAll("[data-image-tpl]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tpl = btn.dataset.imageTpl;
      const d = NoorState.design;
      const texts = { allah: "الله", muhammad: "محمد", bismillah: "﷽", star: "★" };
      if (!d.stickers) d.stickers = [];
      d.stickers.push({
        id: "stk_" + Date.now(),
        text: texts[tpl] || "★",
        x: d.width / 2,
        y: d.height / 2,
        size: 120,
        color: "#7c3aed",
        rotation: 0,
      });
      NoorState.pushHistory();
      NoorRenderer.debouncedRender();
      window.showToast?.("تم إضافة العنصر");
    });
  });
}

if (tool === "font") {
  document.querySelectorAll("#font-grid .font-option").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#font-grid .font-option").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      NoorState.design.text.fontId = btn.dataset.font;
      NoorState.pushHistory();
      NoorRenderer.debouncedRender();
    });
  });

  const sizeInput = document.getElementById("font-size");
  const sizeOut = document.getElementById("size-value");
  sizeInput?.addEventListener("input", () => {
    NoorState.design.text.size = parseInt(sizeInput.value);
    if (sizeOut) sizeOut.textContent = sizeInput.value;
    NoorRenderer.debouncedRender();
  });
  sizeInput?.addEventListener("change", () => NoorState.pushHistory());

  document.querySelectorAll("#align-group .toggle-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#align-group .toggle-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      NoorState.design.text.align = btn.dataset.align;
      NoorState.pushHistory();
      NoorRenderer.debouncedRender();
    });
  });

  document.querySelectorAll("#shadow-group .toggle-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#shadow-group .toggle-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      NoorState.design.text.shadow = btn.dataset.shadow === "on";
      NoorState.pushHistory();
      NoorRenderer.debouncedRender();
    });
  });
}

if (tool === "text-color") {
  document.querySelectorAll("#text-color-options .color-swatch").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#text-color-options .color-swatch").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      NoorState.design.text.color = btn.dataset.color;
      NoorState.pushHistory();
      NoorRenderer.debouncedRender();
    });
  });
   
document.querySelectorAll("[data-surah-name]").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-surah-name]").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    NoorState.design.ayah.showSurahName = btn.dataset.surahName === "on";
    NoorRenderer.debouncedRender();
  });
});

document.querySelectorAll("[data-bismillah]").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-bismillah]").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    NoorState.design.ayah.showBismillah = btn.dataset.bismillah === "on";
    NoorRenderer.debouncedRender();
  });
});

document.querySelectorAll("[data-istiadha]").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-istiadha]").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    NoorState.design.ayah.showIstiadha = btn.dataset.istiadha === "on";
    NoorRenderer.debouncedRender();
  });
});

document.querySelectorAll("[data-ayah-num]").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-ayah-num]").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    NoorState.design.ayah.decorNumber = btn.dataset.ayahNum === "on";
    NoorRenderer.debouncedRender();
  });
});

document.querySelectorAll("[data-deco-id]").forEach((btn) => {
  btn.addEventListener("click", () => {
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
    NoorRenderer.debouncedRender();
    window.showToast?.("تم إضافة الزخرفة");
  });
});
          }
  
  if (tool === "background") {
    document.querySelectorAll(".bg-item[data-bg-type]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".bg-item").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        NoorState.design.background.type = btn.dataset.bgType;
        NoorState.design.background.value = btn.dataset.bgValue;
        NoorState.design.background.imageUrl = null;
        NoorState.pushHistory();
        NoorRenderer.debouncedRender();
      });
    });

    document.querySelectorAll(".bg-item[data-bg-category]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".bg-item").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const catId = btn.dataset.bgCategory;
        const d = NoorState.design;
        const url = NoorBackgrounds.getRandomFromCategory(catId, d.width, d.height);
        if (url) {
          const note = document.getElementById("bg-note");
          if (note) note.hidden = false;
          NoorState.design.background.type = "image";
          NoorState.design.background.imageUrl = url;
          NoorRenderer.render().then(() => {
            if (note) note.hidden = true;
            NoorState.pushHistory();
          });
        }
      });
    });
  }

  if (tool === "frame") {
    document.querySelectorAll("#frame-types .frame-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("#frame-types .frame-item").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        NoorState.design.frame.type = btn.dataset.frame;
        NoorState.pushHistory();
        NoorRenderer.debouncedRender();
      });
    });

    document.querySelectorAll("#frame-colors .color-swatch").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("#frame-colors .color-swatch").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        NoorState.design.frame.color = btn.dataset.color;
        NoorState.pushHistory();
        NoorRenderer.debouncedRender();
      });
    });

    const thickInput = document.getElementById("frame-thickness");
    const thickOut = document.getElementById("frame-thick-value");
    thickInput?.addEventListener("input", () => {
      NoorState.design.frame.thickness = parseInt(thickInput.value);
      if (thickOut) thickOut.textContent = thickInput.value;
      NoorRenderer.debouncedRender();
    });
    thickInput?.addEventListener("change", () => NoorState.pushHistory());
  }

  if (tool === "translation") {
    document.querySelectorAll("[data-trans]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-trans]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        NoorState.design.translation.enabled = btn.dataset.trans === "on";
        NoorState.pushHistory();
        NoorRenderer.debouncedRender();
      });
    });

    document.querySelectorAll("#lang-grid .lang-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        document.querySelectorAll("#lang-grid .lang-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const lang = btn.dataset.lang;
        NoorState.design.translation.lang = lang;
        const d = NoorState.design;
        if (d.ayah.surah && d.ayah.ayahNumber) {
          window.showToast?.("جاري تحميل الترجمة...");
          const text = await QuranUI.loadTranslation(d.ayah.surah, d.ayah.ayahNumber, lang);
          if (text) {
            d.translation.text = text;
            NoorState.pushHistory();
            NoorRenderer.debouncedRender();
            NoorPanels.refresh();
          }
        }
      });
    });

    document.getElementById("translation-text")?.addEventListener("input", (e) => {
      NoorState.design.translation.text = e.target.value;
      NoorRenderer.debouncedRender();
    });

    const transSize = document.getElementById("trans-size");
    const transOut = document.getElementById("trans-size-value");
    transSize?.addEventListener("input", () => {
      NoorState.design.translation.size = parseInt(transSize.value);
      if (transOut) transOut.textContent = transSize.value;
      NoorRenderer.debouncedRender();
    });
    transSize?.addEventListener("change", () => NoorState.pushHistory());
  }

  if (tool === "decor") {
    document.querySelectorAll("[data-decor]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const val = btn.dataset.decor;
        if (val === "top-on") NoorState.design.decor.top = true;
        if (val === "top-off") NoorState.design.decor.top = false;
        if (val === "bottom-on") NoorState.design.decor.bottom = true;
        if (val === "bottom-off") NoorState.design.decor.bottom = false;
        NoorState.pushHistory();
        NoorRenderer.debouncedRender();
        NoorPanels.refresh();
      });
    });
  }

  if (typeof NoorTools !== "undefined" && NoorTools.has(tool)) {
    NoorTools.bind(tool);
    return;
  }
};
