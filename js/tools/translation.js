/* =========================================
   NoorKit — Tool: Translation
   أداة الترجمة
   ========================================= */

NoorTools.register("translation", {
  langs: [
    { id: "en", name: "English" },
    { id: "fr", name: "Français" },
    { id: "es", name: "Español" },
    { id: "ur", name: "اردو" },
    { id: "id", name: "Indonesia" },
    { id: "tr", name: "Türkçe" },
    { id: "ru", name: "Русский" }
  ],

  render() {
    const d = NoorState.design;
    return `
      <h3 class="panel-title">الترجمة</h3>

      <div class="panel-row">
        <label class="panel-label">تشغيل الترجمة</label>
        <div class="toggle-group" id="trans-toggle-group">
          <button class="toggle-btn ${d.translation.enabled ? "active" : ""}" data-trans="on">تشغيل</button>
          <button class="toggle-btn ${!d.translation.enabled ? "active" : ""}" data-trans="off">إيقاف</button>
        </div>
      </div>

      <div class="panel-row">
        <label class="panel-label">اللغة</label>
        <div class="lang-grid" id="lang-grid">
          ${this.langs.map((l) =>
            `<button class="lang-btn ${d.translation.lang === l.id ? "active" : ""}" data-lang="${l.id}">${l.name}</button>`
          ).join("")}
        </div>
      </div>

      <div class="panel-row">
        <label class="panel-label">أو اكتب الترجمة يدويًا</label>
        <textarea class="textarea-input" id="translation-text" dir="ltr" placeholder="Translation...">${this.escape(d.translation.text)}</textarea>
      </div>

      <div class="panel-row">
        <label class="panel-label">حجم الترجمة: <output id="trans-size-value">${d.translation.size}</output>px</label>
        <input type="range" class="size-slider" id="trans-size" min="14" max="60" value="${d.translation.size}" />
      </div>
    `;
  },

  bind() {
    document.querySelectorAll("#trans-toggle-group [data-trans]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        document.querySelectorAll("#trans-toggle-group [data-trans]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        NoorState.design.translation.enabled = btn.dataset.trans === "on";
        NoorState.pushHistory();
        await NoorRenderer.render();
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
            d.translation.enabled = true;
            NoorState.pushHistory();
            await NoorRenderer.render();
            NoorPanels.refresh();
            window.showToast?.("تم تحميل الترجمة");
          }
        }
      });
    });

    document.getElementById("translation-text")?.addEventListener("input", (e) => {
      NoorState.design.translation.text = e.target.value;
      NoorRenderer.render();
    });

    const transSize = document.getElementById("trans-size");
    const transOut = document.getElementById("trans-size-value");
    transSize?.addEventListener("input", () => {
      NoorState.design.translation.size = parseInt(transSize.value);
      if (transOut) transOut.textContent = transSize.value;
      NoorRenderer.render();
    });
  },

  escape(str) {
    return String(str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  },
});
