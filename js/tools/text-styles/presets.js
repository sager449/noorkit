/* =========================================
   NoorKit — Text Style: Presets (v2)
   14 تأثير جاهز
   ========================================= */

NoorTextStyles.register("presets", {
  label: "جاهزة",
  icon: "★",
  order: 8,

  LIST: [
    {
      id: "classic",
      name: "كلاسيكي",
      preview: "linear-gradient(135deg, #1a1a1a, #4a4a4a)",
      apply: (t) => {
        t.color = "#1a1a1a";
        t.shadow = { enabled: false, color: "#000", blur: 8, x: 0, y: 4, opacity: 100 };
        t.outline = { enabled: false, color: "#fff", width: 2 };
        t.glow = { enabled: false, color: "#c9a227", intensity: 15 };
        t.gradient = { enabled: false, color1: "#c9a227", color2: "#fff", angle: 90 };
        t.highlight = { enabled: false, color: "#c9a227", padding: 12, radius: 8, opacity: 100 };
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
        t.shadow = { enabled: true, color: "#7a5a00", blur: 6, x: 0, y: 2, opacity: 100 };
        t.outline = { enabled: false, color: "#fff", width: 2 };
        t.glow = { enabled: false, color: "#c9a227", intensity: 15 };
        t.highlight = { enabled: false, color: "#c9a227", padding: 12, radius: 8, opacity: 100 };
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
        t.shadow = { enabled: true, color: "#7c3aed", blur: 12, x: 0, y: 0, opacity: 100 };
        t.outline = { enabled: false, color: "#fff", width: 2 };
        t.gradient = { enabled: false, color1: "#c9a227", color2: "#fff", angle: 90 };
        t.highlight = { enabled: false, color: "#c9a227", padding: 12, radius: 8, opacity: 100 };
        t.opacity = 100;
      },
    },
    {
      id: "soft-shadow",
      name: "ظل ناعم",
      preview: "linear-gradient(135deg, #888, #333)",
      apply: (t) => {
        t.color = "#1a1a1a";
        t.shadow = { enabled: true, color: "#000", blur: 14, x: 0, y: 6, opacity: 60 };
        t.outline = { enabled: false, color: "#fff", width: 2 };
        t.glow = { enabled: false, color: "#c9a227", intensity: 15 };
        t.gradient = { enabled: false, color1: "#c9a227", color2: "#fff", angle: 90 };
        t.highlight = { enabled: false, color: "#c9a227", padding: 12, radius: 8, opacity: 100 };
        t.opacity = 100;
      },
    },
    {
      id: "highlight-yellow",
      name: "تظليل",
      preview: "linear-gradient(135deg, #fff8d0, #c9a227)",
      apply: (t) => {
        t.color = "#1a1a1a";
        t.highlight = { enabled: true, color: "#fff8d0", padding: 14, radius: 10, opacity: 100 };
        t.shadow = { enabled: false, color: "#000", blur: 8, x: 0, y: 4, opacity: 100 };
        t.outline = { enabled: false, color: "#fff", width: 2 };
        t.glow = { enabled: false, color: "#c9a227", intensity: 15 };
        t.gradient = { enabled: false, color1: "#c9a227", color2: "#fff", angle: 90 };
        t.opacity = 100;
      },
    },
    {
      id: "outline-white",
      name: "محدد",
      preview: "linear-gradient(135deg, #000, #fff)",
      apply: (t) => {
        t.color = "#1a1a1a";
        t.outline = { enabled: true, color: "#ffffff", width: 3 };
        t.shadow = { enabled: true, color: "#000", blur: 8, x: 0, y: 3, opacity: 100 };
        t.glow = { enabled: false, color: "#c9a227", intensity: 15 };
        t.gradient = { enabled: false, color1: "#c9a227", color2: "#fff", angle: 90 };
        t.highlight = { enabled: false, color: "#c9a227", padding: 12, radius: 8, opacity: 100 };
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
        t.shadow = { enabled: true, color: "#7c1d00", blur: 10, x: 0, y: 4, opacity: 100 };
        t.glow = { enabled: true, color: "#f59e0b", intensity: 12 };
        t.outline = { enabled: false, color: "#fff", width: 2 };
        t.highlight = { enabled: false, color: "#c9a227", padding: 12, radius: 8, opacity: 100 };
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
        t.shadow = { enabled: false, color: "#000", blur: 8, x: 0, y: 4, opacity: 100 };
        t.outline = { enabled: false, color: "#fff", width: 2 };
        t.glow = { enabled: false, color: "#c9a227", intensity: 15 };
        t.gradient = { enabled: false, color1: "#c9a227", color2: "#fff", angle: 90 };
        t.highlight = { enabled: false, color: "#c9a227", padding: 12, radius: 8, opacity: 100 };
      },
    },
    {
      id: "emerald",
      name: "زمرد",
      preview: "linear-gradient(135deg, #0d8b5f, #c9a227)",
      apply: (t) => {
        t.color = "#0d8b5f";
        t.gradient = { enabled: true, color1: "#0d8b5f", color2: "#c9a227", angle: 90 };
        t.shadow = { enabled: true, color: "#043d2a", blur: 8, x: 0, y: 3, opacity: 100 };
        t.outline = { enabled: false, color: "#fff", width: 2 };
        t.glow = { enabled: false, color: "#0d8b5f", intensity: 15 };
        t.highlight = { enabled: false, color: "#c9a227", padding: 12, radius: 8, opacity: 100 };
        t.opacity = 100;
      },
    },
    {
      id: "sunset",
      name: "غروب",
      preview: "linear-gradient(135deg, #be185d, #f59e0b)",
      apply: (t) => {
        t.color = "#be185d";
        t.gradient = { enabled: true, color1: "#be185d", color2: "#f59e0b", angle: 90 };
        t.shadow = { enabled: true, color: "#4a0420", blur: 10, x: 0, y: 4, opacity: 100 };
        t.outline = { enabled: false, color: "#fff", width: 2 };
        t.glow = { enabled: false, color: "#be185d", intensity: 15 };
        t.highlight = { enabled: false, color: "#c9a227", padding: 12, radius: 8, opacity: 100 };
        t.opacity = 100;
      },
    },
    {
      id: "silver",
      name: "فضي",
      preview: "linear-gradient(135deg, #e8e8e8, #888)",
      apply: (t) => {
        t.color = "#888888";
        t.gradient = { enabled: true, color1: "#e8e8e8", color2: "#888888", angle: 90 };
        t.shadow = { enabled: true, color: "#000", blur: 6, x: 0, y: 2, opacity: 60 };
        t.outline = { enabled: false, color: "#fff", width: 2 };
        t.glow = { enabled: false, color: "#c9a227", intensity: 15 };
        t.highlight = { enabled: false, color: "#c9a227", padding: 12, radius: 8, opacity: 100 };
        t.opacity = 100;
      },
    },
    {
      id: "sky",
      name: "سماء",
      preview: "linear-gradient(135deg, #0891b2, #7c3aed)",
      apply: (t) => {
        t.color = "#0891b2";
        t.gradient = { enabled: true, color1: "#0891b2", color2: "#7c3aed", angle: 90 };
        t.shadow = { enabled: true, color: "#052e3f", blur: 8, x: 0, y: 4, opacity: 100 };
        t.outline = { enabled: false, color: "#fff", width: 2 };
        t.glow = { enabled: false, color: "#0891b2", intensity: 15 };
        t.highlight = { enabled: false, color: "#c9a227", padding: 12, radius: 8, opacity: 100 };
        t.opacity = 100;
      },
    },
    {
      id: "rose",
      name: "وردي",
      preview: "linear-gradient(135deg, #be185d, #ffffff)",
      apply: (t) => {
        t.color = "#be185d";
        t.gradient = { enabled: true, color1: "#be185d", color2: "#ffffff", angle: 90 };
        t.shadow = { enabled: true, color: "#4a0420", blur: 8, x: 0, y: 3, opacity: 100 };
        t.outline = { enabled: false, color: "#fff", width: 2 };
        t.glow = { enabled: false, color: "#be185d", intensity: 15 };
        t.highlight = { enabled: false, color: "#c9a227", padding: 12, radius: 8, opacity: 100 };
        t.opacity = 100;
      },
    },
    {
      id: "black-gold",
      name: "أسود ذهبي",
      preview: "linear-gradient(135deg, #000, #c9a227)",
      apply: (t) => {
        t.color = "#c9a227";
        t.gradient = { enabled: true, color1: "#000000", color2: "#c9a227", angle: 90 };
        t.shadow = { enabled: true, color: "#000", blur: 10, x: 0, y: 3, opacity: 80 };
        t.outline = { enabled: false, color: "#fff", width: 2 };
        t.glow = { enabled: false, color: "#c9a227", intensity: 15 };
        t.highlight = { enabled: false, color: "#c9a227", padding: 12, radius: 8, opacity: 100 };
        t.opacity = 100;
      },
    },
  ],

  ensure() {
    const t = NoorState.design.text;
    if (typeof t.opacity !== "number") t.opacity = 100;
    if (typeof t.lineHeight !== "number") t.lineHeight = 1.8;
    if (!t.shadow) t.shadow = { enabled: false, color: "#000", blur: 8, x: 0, y: 4, opacity: 100 };
    if (!t.outline) t.outline = { enabled: false, color: "#fff", width: 2 };
    if (!t.glow) t.glow = { enabled: false, color: "#c9a227", intensity: 15 };
    if (!t.gradient) t.gradient = { enabled: false, color1: "#c9a227", color2: "#fff", angle: 90 };
    if (!t.highlight) t.highlight = { enabled: false, color: "#c9a227", padding: 12, radius: 8, opacity: 100 };
  },

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
      <div class="nk-row">
        <span class="nk-row-label">${this.LIST.length} تأثير جاهز</span>
      </div>
      <div class="ts-presets-grid">${cardsHTML}</div>
    `;
  },

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
