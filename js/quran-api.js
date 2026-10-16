/* =========================================
   NoorKit — Quran Panel
   لوحة اختيار السورة والآية
   ========================================= */

window.NoorQuranPanel = {
  surahSelect: null,
  ayahSelect: null,
  basmalaCheck: null,
  istiadhaCheck: null,
  ayahNumCheck: null,

  /* ─────────────────────────────────────
     البناء
     ───────────────────────────────────── */
  render() {
    const d = NoorState.design;

    return `
      <div style="padding: 12px; display: flex; flex-direction: column; gap: 12px;">

        <!-- السورة -->
        <div>
          <label style="color:#b0b0b0;font-size:12px;display:block;margin-bottom:6px;">السورة</label>
          <select id="quran-surah" style="width:100%;padding:10px 12px;background:#2a2a2a;border:none;color:#fff;font-size:14px;font-weight:600;font-family:inherit;box-sizing:border-box;">
            <option value="">-- اختر السورة --</option>
          </select>
        </div>

        <!-- الآية -->
        <div>
          <label style="color:#b0b0b0;font-size:12px;display:block;margin-bottom:6px;">الآية</label>
          <select id="quran-ayah" disabled style="width:100%;padding:10px 12px;background:#2a2a2a;border:none;color:#fff;font-size:14px;font-weight:600;font-family:inherit;box-sizing:border-box;">
            <option value="">-- اختر السورة أولاً --</option>
          </select>
        </div>

        <!-- الخيارات -->
        <div style="display:flex;flex-direction:column;gap:8px;padding-top:6px;border-top:1px solid #2a2a2a;">

          <label style="display:flex;align-items:center;gap:8px;color:#e8e8e8;font-size:13px;font-weight:600;cursor:pointer;">
            <input type="checkbox" id="quran-basmala" style="width:18px;height:18px;accent-color:#ffffff;" />
            <span>إضافة البسملة في البداية</span>
          </label>

          <label style="display:flex;align-items:center;gap:8px;color:#e8e8e8;font-size:13px;font-weight:600;cursor:pointer;">
            <input type="checkbox" id="quran-istiadha" style="width:18px;height:18px;accent-color:#ffffff;" />
            <span>إضافة الاستعاذة في البداية</span>
          </label>

          <label style="display:flex;align-items:center;gap:8px;color:#e8e8e8;font-size:13px;font-weight:600;cursor:pointer;">
            <input type="checkbox" id="quran-ayahnum" checked style="width:18px;height:18px;accent-color:#ffffff;" />
            <span>إضافة رقم الآية (﴿١﴾)</span>
          </label>

        </div>

      </div>
    `;
  },

  /* ─────────────────────────────────────
     ربط الأحداث
     ───────────────────────────────────── */
  async bind() {
    this.surahSelect = document.getElementById("quran-surah");
    this.ayahSelect = document.getElementById("quran-ayah");
    this.basmalaCheck = document.getElementById("quran-basmala");
    this.istiadhaCheck = document.getElementById("quran-istiadha");
    this.ayahNumCheck = document.getElementById("quran-ayahnum");

    if (!this.surahSelect || !this.ayahSelect) return;

    /* تحميل السور */
    try {
      await QuranUI.populateSurahSelect(this.surahSelect);
    } catch (e) {
      console.error("فشل تحميل السور:", e);
      this.surahSelect.innerHTML = '<option value="">-- تعذر التحميل --</option>';
      return;
    }

    /* استرجاع الحالة السابقة */
    const d = NoorState.design;
    if (d.ayah.surah) {
      this.surahSelect.value = d.ayah.surah;
      await QuranUI.populateAyahSelect(d.ayah.surah, this.ayahSelect);
      this.ayahSelect.disabled = false;
      if (d.ayah.ayahNumber) {
        this.ayahSelect.value = d.ayah.ayahNumber;
      }
    }

    /* تغيير السورة */
    this.surahSelect.addEventListener("change", async () => {
      const val = this.surahSelect.value;
      if (!val) {
        this.ayahSelect.innerHTML = '<option value="">-- اختر السورة أولاً --</option>';
        this.ayahSelect.disabled = true;
        return;
      }
      await QuranUI.populateAyahSelect(val, this.ayahSelect);
      this.ayahSelect.disabled = false;
    });

    /* تغيير الآية → إضافة مباشرة */
    this.ayahSelect.addEventListener("change", async () => {
      const surah = this.surahSelect.value;
      const ayah = this.ayahSelect.value;
      if (!surah || !ayah) return;

      await this.addAyah(surah, ayah);
    });

    /* تغيير الخيارات */
    this.basmalaCheck?.addEventListener("change", () => {
      NoorState.design.ayah._includeBasmala = this.basmalaCheck.checked;
    });

    this.istiadhaCheck?.addEventListener("change", () => {
      NoorState.design.ayah._includeIstiadha = this.istiadhaCheck.checked;
    });

    this.ayahNumCheck?.addEventListener("change", async () => {
      const d = NoorState.design;
      d.ayah.decorNumber = this.ayahNumCheck.checked;

      if (d.ayah.decorNumber && d.ayah.ayahNumber) {
        d.ayah.ayahNumber = NoorQuranTools.toArabicNum(d.ayah.ayahNumber);
      }

      NoorState.pushHistory();
      await NoorRenderer.render();
    });
  },

  /* ─────────────────────────────────────
     إضافة الآية للتصميم
     ───────────────────────────────────── */
  async addAyah(surah, ayah) {
    try {
      const text = await QuranUI.loadAyahText(surah, ayah);
      if (!text) {
        window.showToast?.("تعذر تحميل الآية");
        return;
      }

      const d = NoorState.design;

      /* بناء النص النهائي */
      let finalText = "";

      if (this.istiadhaCheck?.checked) {
        finalText += NoorQuranTools.ISTIADHA + "\n\n";
      }

      if (this.basmalaCheck?.checked) {
        finalText += NoorQuranTools.BASMALA + "\n\n";
      }

      finalText += text;

      /* رقم الآية (عربي) */
      if (this.ayahNumCheck?.checked) {
        d.ayah.decorNumber = true;
        d.ayah.ayahNumber = NoorQuranTools.toArabicNum(ayah);
      } else {
        d.ayah.decorNumber = false;
      }

      /* تحديث الحالة */
      d.ayah.text = finalText;
      d.ayah.surah = parseInt(surah);
      d.ayah.surahNumber = parseInt(ayah);
      d.ayah.surahName = QuranUI.surahsCache?.find(
        (s) => s.number === parseInt(surah)
      )?.name || "";

      NoorState.pushHistory();
      await NoorRenderer.render();

      window.showToast?.(
        `${d.ayah.surahName} — الآية ${ayah}`
      );
    } catch (e) {
      console.error("addAyah failed:", e);
      window.showToast?.("تعذر إضافة الآية");
    }
  },
};
