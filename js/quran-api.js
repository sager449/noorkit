/* =========================================
   NoorKit — Quran API Client
   Uses alquran.cloud public API
   ========================================= */

const QuranAPI = {
  BASE: "https://api.alquran.cloud/v1",
  cache: new Map(),

  /* ---------- Get list of surahs ---------- */
  async getSurahs() {
    const key = "surahs";
    if (this.cache.has(key)) return this.cache.get(key);

    try {
      const res = await fetch(`${this.BASE}/surah`);
      const data = await res.json();
      if (data.code !== 200) throw new Error("API error");

      const surahs = data.data.map((s) => ({
        number: s.number,
        name: s.name,
        nameArabic: s.name,
        englishName: s.englishName,
        englishNameTranslation: s.englishNameTranslation,
        versesCount: s.numberOfAyahs,
        revelationType: s.revelationType,
      }));

      this.cache.set(key, surahs);
      return surahs;
    } catch (err) {
      console.error("getSurahs failed:", err);
      return this.getSurahsFallback();
    }
  },

  /* ---------- Get surah with all ayahs ---------- */
  async getSurah(number, edition = "quran-uthmani") {
    const key = `surah_${number}_${edition}`;
    if (this.cache.has(key)) return this.cache.get(key);

    try {
      const res = await fetch(`${this.BASE}/surah/${number}/${edition}`);
      const data = await res.json();
      if (data.code !== 200) throw new Error("API error");

      const result = {
        number: data.data.number,
        name: data.data.name,
        englishName: data.data.englishName,
        ayahs: data.data.ayahs.map((a) => ({
          number: a.numberInSurah,
          text: a.text,
          juz: a.juz,
          page: a.page,
        })),
      };

      this.cache.set(key, result);
      return result;
    } catch (err) {
      console.error("getSurah failed:", err);
      return null;
    }
  },

  /* ---------- Get specific ayah ---------- */
  async getAyah(surah, ayah, edition = "quran-uthmani") {
    try {
      const res = await fetch(`${this.BASE}/ayah/${surah}:${ayah}/${edition}`);
      const data = await res.json();
      if (data.code !== 200) throw new Error("API error");
      return data.data.text;
    } catch (err) {
      console.error("getAyah failed:", err);
      return null;
    }
  },

  /* ---------- Get translation ---------- */
  async getTranslation(surah, ayah, lang = "ar") {
    const editions = {
      ar: "ar.muyassar",
      en: "en.sahih",
      fr: "fr.hamidullah",
      es: "es.cortes",
      ur: "ur.jalandhry",
      id: "id.indonesian",
      tr: "tr.diyanet",
      ru: "ru.kuliev",
    };
    const edition = editions[lang] || editions.en;
    return this.getAyah(surah, ayah, edition);
  },

  /* ---------- Fallback: minimal surah list ---------- */
  getSurahsFallback() {
    return [
      { number: 1, name: "الفاتحة", englishName: "Al-Fatihah", versesCount: 7, revelationType: "Meccan" },
      { number: 2, name: "البقرة", englishName: "Al-Baqarah", versesCount: 286, revelationType: "Medinan" },
      { number: 3, name: "آل عمران", englishName: "Ali 'Imran", versesCount: 200, revelationType: "Medinan" },
      { number: 4, name: "النساء", englishName: "An-Nisa", versesCount: 176, revelationType: "Medinan" },
      { number: 5, name: "المائدة", englishName: "Al-Ma'idah", versesCount: 120, revelationType: "Medinan" },
      { number: 112, name: "الإخلاص", englishName: "Al-Ikhlas", versesCount: 4, revelationType: "Meccan" },
      { number: 113, name: "الفلق", englishName: "Al-Falaq", versesCount: 5, revelationType: "Meccan" },
      { number: 114, name: "الناس", englishName: "An-Nas", versesCount: 6, revelationType: "Meccan" },
    ];
  },

  clearCache() {
    this.cache.clear();
  },
};
/* =========================================
   NoorKit — Quran UI Helpers
   Functions to populate selectors
   ========================================= */

const QuranUI = {
  surahsCache: null,

  /* ---------- Populate surah dropdown ---------- */
  async populateSurahSelect(selectEl) {
    if (!selectEl) return;

    selectEl.innerHTML = '<option value="">-- اختر السورة --</option>';

    const surahs = await QuranAPI.getSurahs();
    this.surahsCache = surahs;

    surahs.forEach((s) => {
      const opt = document.createElement("option");
      opt.value = s.number;
      opt.textContent = `${s.number}. ${s.name} (${s.versesCount} آية)`;
      selectEl.appendChild(opt);
    });
  },

  /* ---------- Populate ayah dropdown ---------- */
  async populateAyahSelect(surahNumber, ayahSelect) {
    if (!ayahSelect) return;

    ayahSelect.innerHTML = '<option value="">-- اختر الآية --</option>';

    if (!surahNumber) return;

    const surah = this.surahsCache?.find((s) => s.number === parseInt(surahNumber));
    if (!surah) return;

    for (let i = 1; i <= surah.versesCount; i++) {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = `الآية ${i}`;
      ayahSelect.appendChild(opt);
    }
  },

  /* ---------- Load ayah text ---------- */
  async loadAyahText(surah, ayah) {
    if (!surah || !ayah) return "";
    const text = await QuranAPI.getAyah(surah, ayah);
    return text || "";
  },

  /* ---------- Load translation ---------- */
  async loadTranslation(surah, ayah, lang) {
    if (!surah || !ayah) return "";
    const text = await QuranAPI.getTranslation(surah, ayah, lang);
    return text || "";
  },
};
