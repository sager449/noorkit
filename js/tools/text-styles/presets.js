/* =========================================
   NoorKit — Text Style: Presets
   تأثيرات جاهزة (بضغطة واحدة)
   ========================================= */

NoorTextStyles.register("presets", {
  label: "جاهزة",
  icon: "★",
  order: 8,

  /* ─────────────────────────────────────
     التأثيرات الجاهزة
     ───────────────────────────────────── */
  LIST: [
    {
      id: "classic",
      name: "كلاسيكي",
      preview: "#111111",
      apply: (t) => {
        t.color = "#111111";
        t.shadow = { enabled: false, color: "#000000", blur: 8, x: 0, y: 4 };
        t.outline = { enabled: false, color: "#ffffff", width: 2 };
        t.glow = { enabled: false, color: "#c9a227", intensity: 15 };
        t.highlight = { enabled: false, color: "#c9a227", padding: 12, radius: 8 };
        t.gradient = { enabled: false, color1: "#c9a227", color2: "#ffffff", angle: 90 };
        t.opacity = 100;
      },
    },
    {
      id: "gold",
      name: "ذهبي",
      preview: "linear-gradient(135deg, #c9a227, #fff8d0, #c9a227)",
      apply: (t) => {
        t.color = "#c9a227";
        t.gradient = { enabled: true, color1: "#c9a227", color2: "#fff8d0", angle: 90 };
        t.shadow = { enabled: true, color: "#7a5a00", blur: 6, x: 0, y: 2 };
        t.outline = { enabled: false, color: "#ffffff", width: 2 };
        t.glow = { enabled: false, color: "#c9a227", intensity: 15 };
        t.highlight = { enabled: false, color: "#c9a227", padding: 12, radius: 8 };
        t.opacity = 100;
      },
    },
    {
      id: "neon",
      name: "نيون",
      preview: "linear-gradient(135deg, #7c3aed, #0891b2)",
      apply: (t) => {
        t.color = "#ffffff";
        t.glow = { enabled: true, color: "#7c3aed", intensity: 22 };
        t.shadow = { enabled: true, color: "#7c3aed", blur: 12, x: 0, y: 0 };
        t.outline = { enabled: false, color: "#ffffff", width: 2 };
        t.gradient = { enabled: false, color1: "#c9a227", color2: "#ffffff", angle: 90 };
        t.highlight = { enabled: false, color: "#c9a227", padding: 12, radius: 8 };
        t.opacity = 100;
      },
    },
    {
      id: "soft-shadow",
      name: "ظل ناعم",
      preview: "#111111",
      apply: (t) => {
        t.color = "#111111";
        t.shadow = { enabled: true, color: "#000000", blur: 14, x: 0, y: 6 };
        t.outline = { enabled: false, color: "#ffffff", width: 2 };
        t.glow = { enabled: false, color: "#c9a227", intensity: 15 };
        t.gradient = { enabled: false, color1: "#c9a227", color2: "#ffffff", angle: 90 };
        t.highlight = { enabled: false, color: "#c9a227", padding: 12, radius: 8 };
        t.opacity = 100;
      },
    },
    {
      id: "highlight",
      name: "تظليل",
      preview: "linear-gradient(135deg, #fff, #c9a227)",
      apply: (t) => {
        t.color = "#111111";
        t.highlight = { enabled: true, color: "#fff8d0", padding: 14, radius: 10 };
        t.shadow = { enabled: false, color: "#000000", blur: 8, x: 0, y: 4 };
        t.outline = { enabled: false, color: "#ffffff", width: 2 };
        t.glow = { enabled: false, color: "#c9a227", intensity: 15 };
        t.gradient = { enabled: false, color1: "#c9a227", color2: "#ffffff", angle: 90 };
        t.opacity = 100;
      },
    },
    {
      id: "outline-white",
      name: "محدد",
      preview: "linear-gradient(135deg, #000, #fff)",
      apply: (t) => {
        t.color = "#111111";
        t.outline = { enabled: true, color: "#ffffff", width: 3 };
        t.shadow = { enabled: true, color: "#000000", blur: 8, x: 0, y: 3 };
        t.glow = { enabled: false, color: "#c9a227", intensity: 15 };
        t.gradient = { enabled: false, color1: "#c9a227", color2: "#ffffff", angle: 90 };
        t.highlight = { enabled: false, color: "#c9a227", padding: 12, radius: 8 };
        t.opacity = 100;
      },
    },
    {
      id: "fire",
      name: "ناري",
      preview: "linear-gradient(135deg, #f59e0b, #b91c1c)",
      apply: (t) => {
        t.color = "#f59e0b";
        t.gradient = { enabled: true, color1: "#f59e0b", color2: "#b91c1c", angle: 90 };
        t.shadow = { enabled: true, color: "#7c1d00", blur: 10, x: 0, y: 4 };
        t.glow = { enabled: true, color: "#f59e0b", intensity: 12 };
        t.outline = { enabled: false, color: "#ffffff", width: 2 };
        t.highlight = { enabled: false, color: "#c9a227", padding: 12, radius: 8 };
        t.opacity = 100;
      },
    },
    {
      id: "faded",
      name: "خافت",
      preview: "linear-gradient(135deg, #888, #ccc)",
      apply: (t) => {
        t.color = "#666666";
        t.opacity = 55;
        t.shadow = { enabled: false, color: "#000000", blur: 8, x: 0, y: 4 };
        t.outline = { enabled: false, color: "#ffffff", width: 2 };
        t.glow = { enabled: false, color: "#c9a227", intensity: 15 };
        t.gradient = { enabled: false, color1: "#c9a227", color2: "#ffffff", angle: 90 };
        t.highlight = { enabled: false, color: "#c9a227", padding: 12, radius: 8 };
      },
    },
  ],

  /* ─────────────────────────────────────
     ضمان وجود الإعدادات
     ───────────────────────────────────── */
  ensure() {
    const t = NoorState.design.text;

    if (typeof t.opacity !== "number") t.opacity = 100;
    if (typeof t.lineHeight !== "number") t.lineHeight = 1.8;

    if (!t.shadow) t.shadow = { enabled: false, color: "#000000", blur: 8, x: 0, y: 4 };
    if (!t.outline) t.outline = { enabled: false, color: "#ffffff", width: 2 };
    if (!t.glow) t.glow = { enabled: false, color: "#c9a227", intensity: 15 };
    if (!t.gradient) t.gradient = { enabled: false, color1: "#c9a227", color2: "#ffffff", angle: 90 };
    if (!t.highlight) t.highlight = { enabled: false, color: "#c9a227", padding: 12, radius: 8 };
  },

  /* ─────────────────────────────────────
     بناء الواجهة
     ───────────────────────────────────── */
  render() {
    this.ensure();

    const cardsHTML = this.LIST.map(
      (p) => `
        <button class="ts-preset-card" data-ts-preset="${p.id}">
          <span class="ts-preset-preview" style="background:${p.preview};"></span>
          <span class="ts-preset-name">${p.name}</span>
        </button>
      `
    ).join("");

    return `
      <div class="ts-row">
        <label class="ts-label">اختر تأثيراً جاهزاً</label>
      </div>
      <div class="ts-presets-grid">
        ${cardsHTML}
      </div>
    `;
  },

  /* ─────────────────────────────────────
     ربط الأحداث
     ───────────────────────────────────── */
  bind() {
    document.querySelectorAll("[data-ts-preset]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.tsPreset;
        const preset = this.LIST.find((p) => p.id === id);
        if (!preset) return;

        preset.apply(NoorState.design.text);

        NoorState.pushHistory();
        await NoorRenderer.render();

        window.showToast?.(`تم تطبيق: ${preset.name}`);
      });
    });
  },
});
