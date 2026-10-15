/* =========================================
   NoorKit — Tool: Ayah
   أداة الآية (مبسّطة جدًا)
   ========================================= */

NoorTools.register("ayah", {
  render() {
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
  },
});
