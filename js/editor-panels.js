/* =========================================
   NoorKit — Editor Panels
   ========================================= */

const NoorPanels = {
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
        <select class="select-input" id="surah-select">
          <option value="">-- اختر السورة --</option>
        </select>
      </div>

      <div class="panel-row">
        <label class="panel-label">الآية</label>
        <select class="select-input" id="ayah-select" disabled>
          <option value="">-- اختر السورة أولًا --</option>
        </select>
      </div>

      <div class="panel-row">
        <label class="panel-label">الخط</label>
        <div class="font-grid" id="font-grid">
          ${NoorFonts.renderOptions(d.text.fontId)}
        </div>
      </div>

      <div class="panel-row">
        <label class="panel-label">حجم الخط: <output id="size-value">${d.text.size}</output>px</label>
        <input type="range" class="size-slider" id="font-size" min="24" max="140" value="${d.text.size}" />
      </div>

      <div class="panel-row">
        <label class="panel-label">لون النص</label>
        <div class="color-options" id="text-color-options">
          ${["#1a1a1a","#ffffff","#c9a227","#0d8b5f","#1e40af","#b91c1c","#7c3aed","#f59e0b","#be185d","#0891b2"].map((c) => `
            <button class="color-swatch ${d.text.color === c ? "active" : ""}" data-color="${c}" style="background:${c};${c === "#ffffff" ? "border:2px solid #e5e5e5;" : ""}"></button>
          `).join("")}
        </div>
      </div>

      <div class="panel-row">
        <label class="panel-label">أو اكتب يدويًا</label>
        <textarea class="textarea-input" id="ayah-text" dir="rtl" placeholder="اكتب النص هنا...">${this.escape(d.ayah.text)}</textarea>
      </div>

      <button class="panel-btn" id="apply-ayah-btn">تطبيق</button>
    `;
  },

  renderImagePanel() {
    return `
      <h3 class="panel-title">إضافة صورة</h3>

      <div class="panel-row">
        <button class="panel-btn" id="pick-image-btn">📷 اختر صورة من جهازك</button>
      </div>

      <p class="panel-note">
        الصورة ستُضاف على التصميم.
      </p>

      <input type="file" id="image-picker" accept="image/*" hidden />

      <div class="panel-row">
        <label class="panel-label">رموز جاهزة</label>
        <div class="bg-grid" id="image-templates">
          <button class="bg-item" data-image-tpl="allah"><span class="bg-item-color" style="background:#0d8b5f;color:#fff;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800;">الله</span></button>
          <button class="bg-item" data-image-tpl="muhammad"><span class="bg-item-color" style="background:#0d8b5f;color:#fff;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:800;">محمد</span></button>
          <button class="bg-item" data-image-tpl="bismillah"><span class="bg-item-color" style="background:#c9a227;color:#fff;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;">﷽</span></button>
          <button class="bg-item" data-image-tpl="star"><span class="bg-item-color" style="background:#1e40af;color:#fff;display:flex;align-items:center;justify-content:center;font-size:24px;">★</span></button>
        </div>
      </div>
    `;
  },

  renderFontPanel() {
    const d = NoorState.design;
    return `
      <h3 class="panel-title">الخط</h3>
      <div class="panel-row">
        <label class="panel-label">اختر الخط</label>
        <div class="font-grid" id="font-grid">
          ${NoorFonts.renderOptions(d.text.fontId)}
        </div>
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

  renderTextColorPanel() {
    const d = NoorState.design;
    const colors = ["#1a1a1a","#ffffff","#c9a227","#f5ede0","#0d8b5f","#1e40af","#b91c1c","#7c3aed","#78350f","#be185d"];
    return `
      <h3 class="panel-title">لون النص</h3>
      <div class="panel-row">
        <label class="panel-label">اختر اللون</label>
        <div class="color-options" id="text-color-options">
          ${colors.map((c) => `<button class="color-swatch ${d.text.color === c ? "active" : ""}" data-color="${c}" style="background:${c};${c === "#ffffff" ? "border:2px solid #e5e5e5;" : ""}"></button>`).join("")}
        </div>
      </div>
    `;
  },

  renderBackgroundPanel() {
    const d = NoorState.design;
    const colorItems = NoorBackgrounds.solidColors.map((c) => `<button class="bg-item ${d.background.type === "solid" && d.background.value === c.color ? "active" : ""}" data-bg-type="solid" data-bg-value="${c.color}" title="${c.name}"><span class="bg-item-color" style="background:${c.color};"></span></button>`).join("");
    const gradientItems = NoorBackgrounds.gradients.map((g) => `<button class="bg-item ${d.background.type === "gradient" && d.background.value === g.css ? "active" : ""}" data-bg-type="gradient" data-bg-value="${this.escape(g.css)}" title="${g.name}"><span class="bg-item-color" style="background:${g.css};"></span></button>`).join("");
    const categoryItems = NoorBackgrounds.categories.map((c) => `<button class="bg-item" data-bg-category="${c.id}" title="${c.name}"><span class="bg-item-color" style="background:var(--cream);display:flex;align-items:center;justify-content:center;font-size:28px;">${c.icon}</span><span class="bg-item-label">${c.name}</span></button>`).join("");
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
    const colors = ["#c9a227", "#0d8b5f", "#1a1a1a", "#ffffff", "#78350f", "#1e40af"];
    return `
      <h3 class="panel-title">الإطار</h3>
      <div class="panel-row"><label class="panel-label">النوع</label><div class="frame-grid" id="frame-types">
        ${frames.map((f) => `<button class="frame-item ${d.frame.type === f.id ? "active" : ""}" data-frame="${f.id}" title="${f.name}">${f.id === "none" ? '<span style="font-size:12px;color:var(--muted);">بدون</span>' : `<span class="frame-preview ${f.id}"></span>`}</button>`).join("")}
      </div></div>
      <div class="panel-row"><label class="panel-label">اللون</label><div class="color-options" id="frame-colors">
        ${colors.map((c) => `<button class="color-swatch ${d.frame.color === c ? "active" : ""}" data-color="${c}" style="background:${c};${c === "#ffffff" ? "border:2px solid #e5e5e5;" : ""}"></button>`).join("")}
      </div></div>
      <div class="panel-row"><label class="panel-label">السماكة: <output id="frame-thick-value">${d.frame.thickness}</output>px</label><input type="range" class="size-slider" id="frame-thickness" min="2" max="20" value="${d.frame.thickness}" /></div>
    `;
  },

  renderTranslationPanel() {
    const d = NoorState.design;
    const langs = [{ id: "en", name: "English" },{ id: "fr", name: "Français" },{ id: "es", name: "Español" },{ id: "ur", name: "اردو" },{ id: "id", name: "Indonesia" },{ id: "tr", name: "Türkçe" },{ id: "ru", name: "Русский" }];
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
