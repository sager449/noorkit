/* =========================================
   NoorKit — Quran Tools
   البسملة + الاستعاذة + رقم الآية
   ========================================= */

window.NoorQuranTools = {
  BASMALA: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
  ISTIADHA: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",

  addBasmala() {
    const d = NoorState.design;
    const current = d.ayah.text || "";
    if (current.includes(this.BASMALA)) {
      window.showToast?.("البسملة موجودة مسبقاً");
      return;
    }
    d.ayah.text = current ? this.BASMALA + "\n\n" + current : this.BASMALA;
    NoorState.pushHistory();
    NoorRenderer.render();
    window.showToast?.("تمت إضافة البسملة");
  },

  addIstiadha() {
    const d = NoorState.design;
    const current = d.ayah.text || "";
    if (current.includes(this.ISTIADHA)) {
      window.showToast?.("الاستعاذة موجودة مسبقاً");
      return;
    }
    d.ayah.text = current ? this.ISTIADHA + "\n\n" + current : this.ISTIADHA;
    NoorState.pushHistory();
    NoorRenderer.render();
    window.showToast?.("تمت إضافة الاستعاذة");
  },

  setAyahNumber(num) {
    const d = NoorState.design;
    if (!d.ayah) d.ayah = {};
    d.ayah.decorNumber = true;
    d.ayah.ayahNumber = this.toArabicNum(num);
    NoorState.pushHistory();
    NoorRenderer.render();
    window.showToast?.(`رقم الآية: ${num}`);
  },

  removeAyahNumber() {
    NoorState.design.ayah.decorNumber = false;
    NoorState.pushHistory();
    NoorRenderer.render();
    window.showToast?.("تم إزالة رقم الآية");
  },

  toArabicNum(num) {
    const digits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return String(num).split("").map((d) => digits[parseInt(d)] || d).join("");
  },
};
