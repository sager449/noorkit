/* =========================================
   NoorKit — Arabic Fonts Registry
   قائمة الخطوط العربية المتاحة
   ========================================= */

const NoorFonts = {
  list: [
    {
      id: "amiri",
      name: "أميري",
      nameEn: "Amiri",
      family: "'Amiri', serif",
      googleName: "Amiri:wght@400;700",
      description: "خط نسخي كلاسيكي — مناسب للآيات",
      preview: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    },
    {
      id: "scheherazade",
      name: "شهرزاد",
      nameEn: "Scheherazade New",
      family: "'Scheherazade New', serif",
      googleName: "Scheherazade+New:wght@400;700",
      description: "خط نسخي واضح — مناسب للقراءة",
      preview: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    },
    {
      id: "lateef",
      name: "لطيف",
      nameEn: "Lateef",
      family: "'Lateef', serif",
      googleName: "Lateef:wght@400;700",
      description: "خط نسخي أنيق — للآيات الطويلة",
      preview: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    },
    {
      id: "reem-kufi",
      name: "ريم كوفي",
      nameEn: "Reem Kufi",
      family: "'Reem Kufi', sans-serif",
      googleName: "Reem+Kufi:wght@400;500;600;700",
      description: "خط كوفي هندسي — عصري",
      preview: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    },
    {
      id: "aref-ruqaa",
      name: "عارف رقعة",
      nameEn: "Aref Ruqaa",
      family: "'Aref Ruqaa', serif",
      googleName: "Aref+Ruqaa:wght@400;700",
      description: "خط رقعة — كلاسيكي",
      preview: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    },
    {
      id: "cairo",
      name: "القاهرة",
      nameEn: "Cairo",
      family: "'Cairo', sans-serif",
      googleName: "Cairo:wght@400;600;700;900",
      description: "خط حديث — للترجمة والعنوان",
      preview: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    },
    {
      id: "tajawal",
      name: "تجوال",
      nameEn: "Tajawal",
      family: "'Tajawal', sans-serif",
      googleName: "Tajawal:wght@400;500;700;900",
      description: "خط حديث نظيف — للترجمة",
      preview: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    },
  ],

  /* ---------- Get font by ID ---------- */
  get(id) {
    return this.list.find((f) => f.id === id) || this.list[0];
  },

  /* ---------- Get default font ---------- */
  getDefault() {
    return this.list[0];
  },

  /* ---------- Load all Google fonts dynamically ---------- */
  loadAll() {
    const families = this.list.map((f) => f.googleName).join("&family=");
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
    document.head.appendChild(link);
  },

  /* ---------- Generate font options HTML ---------- */
  renderOptions(selectedId) {
    return this.list
      .map(
        (f) => `
      <button class="font-option ${f.id === selectedId ? "active" : ""}" data-font="${f.id}" style="font-family:${f.family};">
        <span class="font-option-name">${f.name}</span>
        <span class="font-option-preview" style="font-family:${f.family};">${f.preview}</span>
      </button>
    `
      )
      .join("");
  },
};
