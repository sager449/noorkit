/* =========================================
   NoorKit — Tool: Background (ورقة)
   8 أدوات: لون، تدرج، صورة، نقش، إضاءة، ضباب، HDR، فينيت
   ========================================= */

NoorTools.register("background", {
  render() {
    return "<p style='padding:20px;color:#888;'>استخدم الشريط العلوي للأدوات</p>";
  },

  bind() {},
});

/* ═══════════════════════════════════════════════
   أدوات الورقة — تُدار من الشريط العلوي
   ═══════════════════════════════════════════════ */

window.NoorPaper = {
  /* ─────────────────────────────────────
     ضمان وجود الإعدادات
     ───────────────────────────────────── */
  ensure() {
    const b = NoorState.design.background;
    if (!b.type) b.type = "solid";
    if (!b.value) b.value = "#f5ede0";
    if (!b.pattern) b.pattern = "none";
    if (!b.lighting) b.lighting = { enabled: false, angle: 135, intensity: 30 };
    if (!b.fog) b.fog = { enabled: false, intensity: 20, color: "#ffffff" };
    if (!b.hdr) b.hdr = { enabled: false, contrast: 20, saturation: 20 };
    if (!b.vignette) b.vignette = { enabled: false, intensity: 40, softness: 60 };
  },

  /* ═══ 56 لون ═══ */
  COLORS: [
    "#000000", "#1a1a1a", "#2a2a2a", "#3a3a3a",
    "#555555", "#78716c", "#888888", "#b0b0b0",
    "#d4d4d4", "#ffffff",
    "#c9a227", "#d4af37", "#e6c34a", "#f0d878",
    "#fff8d0", "#f59e0b", "#fbbf24", "#fcd34d",
    "#ea580c", "#f97316", "#fb923c", "#fdba74",
    "#b91c1c", "#dc2626", "#ef4444", "#f87171",
    "#7c1d00", "#c2410c",
    "#78350f", "#a16207", "#b45309", "#92400e",
    "#8b4513", "#a0522d",
    "#0d8b5f", "#059669", "#10b981", "#34d399",
    "#65a30d", "#84cc16", "#4ade80", "#166534",
    "#1e40af", "#2563eb", "#3b82f6", "#60a5fa",
    "#0891b2", "#06b6d4", "#22d3ee", "#0e7490",
    "#7c3aed", "#8b5cf6", "#a855f7", "#c084fc",
    "#6366f1", "#818cf8", "#a78bfa", "#4c1d95",
    "#be185d", "#db2777", "#ec4899", "#f472b6",
    "#e11d48", "#f43f5e", "#fb7185", "#fda4af",
    "#f5ede0", "#faf5eb", "#e8dcc0", "#d4c5a0",
  ],

  /* ═══ 12 تدرج جاهز ═══ */
  GRADIENTS: [
    { name: "ذهبي",   css: "linear-gradient(135deg, #c9a227 0%, #fff8d0 100%)" },
    { name: "نار",    css: "linear-gradient(135deg, #f59e0b 0%, #b91c1c 100%)" },
    { name: "سماء",   css: "linear-gradient(135deg, #0891b2 0%, #7c3aed 100%)" },
    { name: "زمرد",   css: "linear-gradient(135deg, #0d8b5f 0%, #c9a227 100%)" },
    { name: "غروب",   css: "linear-gradient(135deg, #be185d 0%, #f59e0b 100%)" },
    { name: "فضي",    css: "linear-gradient(135deg, #e8e8e8 0%, #888888 100%)" },
    { name: "وردي",   css: "linear-gradient(135deg, #fda4af 0%, #be185d 100%)" },
    { name: "كريمي",  css: "linear-gradient(135deg, #f5ede0 0%, #d4c5a0 100%)" },
    { name: "ليلي",   css: "linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)" },
    { name: "زمردي",  css: "linear-gradient(135deg, #0d8b5f 0%, #0891b2 100%)" },
    { name: "بنفسجي", css: "linear-gradient(135deg, #4c1d95 0%, #c084fc 100%)" },
    { name: "ذهبي غامق", css: "linear-gradient(135deg, #78350f 0%, #c9a227 100%)" },
  ],

  /* ═══ 8 نقوش إسلامية (CSS) ═══ */
  PATTERNS: [
    {
      id: "none",
      name: "بدون",
      style: "",
    },
    {
      id: "arabesque",
      name: "عربي",
      style: `background-image: radial-gradient(circle at 20% 30%, rgba(201,162,39,0.08) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(201,162,39,0.08) 0%, transparent 40%);`,
    },
    {
      id: "geometric",
      name: "هندسي",
      style: `background-image: linear-gradient(45deg, rgba(201,162,39,0.05) 25%, transparent 25%), linear-gradient(-45deg, rgba(201,162,39,0.05) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(201,162,39,0.05) 75%), linear-gradient(-45deg, transparent 75%, rgba(201,162,39,0.05) 75%); background-size: 40px 40px;`,
    },
    {
      id: "diamond",
      name: "معينات",
      style: `background-image: linear-gradient(45deg, rgba(201,162,39,0.06) 25%, transparent 25%, transparent 75%, rgba(201,162,39,0.06) 75%), linear-gradient(45deg, rgba(201,162,39,0.06) 25%, transparent 25%, transparent 75%, rgba(201,162,39,0.06) 75%); background-size: 30px 30px; background-position: 0 0, 15px 15px;`,
    },
    {
      id: "stripes",
      name: "خطوط",
      style: `background-image: repeating-linear-gradient(45deg, rgba(201,162,39,0.04) 0px, rgba(201,162,39,0.04) 2px, transparent 2px, transparent 12px);`,
    },
    {
      id: "dots",
      name: "نقاط",
      style: `background-image: radial-gradient(rgba(201,162,39,0.15) 1px, transparent 1.5px); background-size: 20px 20px;`,
    },
    {
      id: "grid",
      name: "شبكة",
      style: `background-image: linear-gradient(rgba(201,162,39,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,0.06) 1px, transparent 1px); background-size: 30px 30px;`,
    },
    {
      id: "waves",
      name: "أمواج",
      style: `background-image: repeating-linear-gradient(0deg, rgba(201,162,39,0.05) 0px, rgba(201,162,39,0.05) 1px, transparent 1px, transparent 20px);`,
    },
  ],

  /* ─────────────────────────────────────
     محتوى كل أداة
     ───────────────────────────────────── */
  renderToolContent(toolId) {
    this.ensure();
    const b = NoorState.design.background;

    /* ═══ لون ═══ */
    if (toolId === "paper-color") {
      const dots = this.COLORS.map(
        (c) => `<button class="nk-color-dot ${b.type === "solid" && b.value === c ? "active" : ""}" data-paper-color="${c}" style="background:${c};"></button>`
      ).join("");
      return `
        <div class="nk-row"><span class="nk-row-label">اللون</span></div>
        <div class="nk-color-row">
          <button class="nk-color-picker-btn" data-paper-color-picker></button>
          <div class="nk-color-scroll">${dots}</div>
        </div>
      `;
    }

    /* ═══ تدرج ═══ */
    if (toolId === "paper-gradient") {
      const grads = this.GRADIENTS.map(
        (g) => `<button class="ts-gradient-preset ${b.type === "gradient" && b.value === g.css ? "active" : ""}" data-paper-grad="${this.escape(g.css)}" title="${g.name}"><span style="background:${g.css};"></span></button>`
      ).join("");
      return `
        <div class="nk-row"><span class="nk-row-label">تدرجات جاهزة</span></div>
        <div class="ts-gradient-presets">${grads}</div>
      `;
    }

    /* ═══ نقش ═══ */
    if (toolId === "paper-pattern") {
      const pats = this.PATTERNS.map(
        (p) => `<button class="ts-preset-card ${b.pattern === p.id ? "active" : ""}" data-paper-pattern="${p.id}"><span class="ts-preset-preview" style="background:#2a2a2a;${p.style}"></span><span class="ts-preset-name">${p.name}</span></button>`
      ).join("");
      return `
        <div class="nk-row"><span class="nk-row-label">النقش</span></div>
        <div class="ts-presets-grid">${pats}</div>
      `;
    }

    /* ═══ إضاءة ═══ */
    if (toolId === "paper-lighting") {
      const l = b.lighting;
      return `
        <div class="nk-row"><span class="nk-row-label">الزاوية</span><span class="nk-row-value" id="paper-light-angle-val">${l.angle}°</span></div>
        <input type="range" class="ts-slider" id="paper-light-angle" min="0" max="360" value="${l.angle}" style="width:100%;margin-bottom:10px;" />

        <div class="nk-row"><span class="nk-row-label">القوة</span><span class="nk-row-value" id="paper-light-int-val">${l.intensity}</span></div>
        <input type="range" class="ts-slider" id="paper-light-int" min="0" max="100" value="${l.intensity}" style="width:100%;" />
      `;
    }

    /* ═══ ضباب ═══ */
    if (toolId === "paper-fog") {
      const f = b.fog;
      return `
        <div class="nk-row"><span class="nk-row-label">القوة</span><span class="nk-row-value" id="paper-fog-int-val">${f.intensity}</span></div>
        <input type="range" class="ts-slider" id="paper-fog-int" min="0" max="100" value="${f.intensity}" style="width:100%;" />
      `;
    }

    /* ═══ HDR ═══ */
    if (toolId === "paper-hdr") {
      const h = b.hdr;
      return `
        <div class="nk-row"><span class="nk-row-label">التباين</span><span class="nk-row-value" id="paper-hdr-contrast-val">${h.contrast}</span></div>
        <input type="range" class="ts-slider" id="paper-hdr-contrast" min="0" max="100" value="${h.contrast}" style="width:100%;margin-bottom:10px;" />

        <div class="nk-row"><span class="nk-row-label">التشبع</span><span class="nk-row-value" id="paper-hdr-sat-val">${h.saturation}</span></div>
        <input type="range" class="ts-slider" id="paper-hdr-sat" min="0" max="100" value="${h.saturation}" style="width:100%;" />
      `;
    }

    /* ═══ فينيت ═══ */
    if (toolId === "paper-vignette") {
      const v = b.vignette;
      return `
        <div class="nk-row"><span class="nk-row-label">القوة</span><span class="nk-row-value" id="paper-vin-int-val">${v.intensity}</span></div>
        <input type="range" class="ts-slider" id="paper-vin-int" min="0" max="100" value="${v.intensity}" style="width:100%;margin-bottom:10px;" />

        <div class="nk-row"><span class="nk-row-label">النعومة</span><span class="nk-row-value" id="paper-vin-soft-val">${v.softness}</span></div>
        <input type="range" class="ts-slider" id="paper-vin-soft" min="0" max="100" value="${v.softness}" style="width:100%;" />
      `;
    }

    /* ═══ صورة ═══ */
    if (toolId === "paper-image") {
      return `
        <div class="nk-row"><span class="nk-row-label">رفع صورة</span></div>
        <input type="file" id="paper-image-upload" accept="image/*" style="width:100%;padding:10px;background:#2a2a2a;color:#ccc;border:none;font-family:inherit;" />
        <p style="color:#888;font-size:11px;text-align:center;padding:10px 0;">أو استخدم صوراً من مكتبة الورق</p>
        <button id="paper-image-random" style="width:100%;padding:12px;background:#ffffff;color:#111;border:none;font-weight:700;cursor:pointer;font-family:inherit;">صورة عشوائية</button>
      `;
    }

    return "";
  },

  /* ─────────────────────────────────────
     ربط أحداث كل أداة
     ───────────────────────────────────── */
  bindToolContent(toolId) {
    this.ensure();
    const b = NoorState.design.background;

    /* ═══ لون ═══ */
    if (toolId === "paper-color") {
      document.querySelectorAll("[data-paper-color]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          b.type = "solid";
          b.value = btn.dataset.paperColor;
          b.imageUrl = null;
          NoorState.pushHistory();
          await NoorRenderer.render();
        });
      });

      document.querySelector("[data-paper-color-picker]")?.addEventListener("click", () => {
        NoorTextStyles.openColorPicker(b.value || "#f5ede0", async (c) => {
          b.type = "solid";
          b.value = c;
          b.imageUrl = null;
          NoorState.pushHistory();
          await NoorRenderer.render();
        });
      });
    }

    /* ═══ تدرج ═══ */
    if (toolId === "paper-gradient") {
      document.querySelectorAll("[data-paper-grad]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          b.type = "gradient";
          b.value = btn.dataset.paperGrad;
          b.imageUrl = null;
          NoorState.pushHistory();
          await NoorRenderer.render();
        });
      });
    }

    /* ═══ نقش ═══ */
    if (toolId === "paper-pattern") {
      document.querySelectorAll("[data-paper-pattern]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          b.pattern = btn.dataset.paperPattern;
          NoorState.pushHistory();
          await NoorRenderer.render();
        });
      });
    }

    /* ═══ إضاءة ═══ */
    if (toolId === "paper-lighting") {
      const angle = document.getElementById("paper-light-angle");
      const angleVal = document.getElementById("paper-light-angle-val");
      const int = document.getElementById("paper-light-int");
      const intVal = document.getElementById("paper-light-int-val");

      angle?.addEventListener("input", async () => {
        b.lighting.angle = parseInt(angle.value);
        b.lighting.enabled = true;
        if (angleVal) angleVal.textContent = b.lighting.angle + "°";
        await NoorRenderer.render();
      });
      angle?.addEventListener("change", () => NoorState.pushHistory());

      int?.addEventListener("input", async () => {
        b.lighting.intensity = parseInt(int.value);
        b.lighting.enabled = true;
        if (intVal) intVal.textContent = b.lighting.intensity;
        await NoorRenderer.render();
      });
      int?.addEventListener("change", () => NoorState.pushHistory());
    }

    /* ═══ ضباب ═══ */
    if (toolId === "paper-fog") {
      const int = document.getElementById("paper-fog-int");
      const intVal = document.getElementById("paper-fog-int-val");
      int?.addEventListener("input", async () => {
        b.fog.intensity = parseInt(int.value);
        b.fog.enabled = true;
        if (intVal) intVal.textContent = b.fog.intensity;
        await NoorRenderer.render();
      });
      int?.addEventListener("change", () => NoorState.pushHistory());
    }

    /* ═══ HDR ═══ */
    if (toolId === "paper-hdr") {
      const c = document.getElementById("paper-hdr-contrast");
      const cVal = document.getElementById("paper-hdr-contrast-val");
      const s = document.getElementById("paper-hdr-sat");
      const sVal = document.getElementById("paper-hdr-sat-val");

      c?.addEventListener("input", async () => {
        b.hdr.contrast = parseInt(c.value);
        b.hdr.enabled = true;
        if (cVal) cVal.textContent = b.hdr.contrast;
        await NoorRenderer.render();
      });
      c?.addEventListener("change", () => NoorState.pushHistory());

      s?.addEventListener("input", async () => {
        b.hdr.saturation = parseInt(s.value);
        b.hdr.enabled = true;
        if (sVal) sVal.textContent = b.hdr.saturation;
        await NoorRenderer.render();
      });
      s?.addEventListener("change", () => NoorState.pushHistory());
    }

    /* ═══ فينيت ═══ */
    if (toolId === "paper-vignette") {
      const int = document.getElementById("paper-vin-int");
      const intVal = document.getElementById("paper-vin-int-val");
      const soft = document.getElementById("paper-vin-soft");
      const softVal = document.getElementById("paper-vin-soft-val");

      int?.addEventListener("input", async () => {
        b.vignette.intensity = parseInt(int.value);
        b.vignette.enabled = true;
        if (intVal) intVal.textContent = b.vignette.intensity;
        await NoorRenderer.render();
      });
      int?.addEventListener("change", () => NoorState.pushHistory());

      soft?.addEventListener("input", async () => {
        b.vignette.softness = parseInt(soft.value);
        b.vignette.enabled = true;
        if (softVal) softVal.textContent = b.vignette.softness;
        await NoorRenderer.render();
      });
      soft?.addEventListener("change", () => NoorState.pushHistory());
    }

    /* ═══ صورة ═══ */
    if (toolId === "paper-image") {
      const upload = document.getElementById("paper-image-upload");
      upload?.addEventListener("change", async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async () => {
          b.type = "image";
          b.imageUrl = reader.result;
          NoorState.pushHistory();
          await NoorRenderer.render();
          window.showToast?.("تم تحميل الصورة");
        };
        reader.readAsDataURL(file);
      });

      document.getElementById("paper-image-random")?.addEventListener("click", async () => {
        if (typeof NoorBackgrounds === "undefined") return;
        const url = NoorBackgrounds.getRandomFromCategory("nature", NoorState.design.width, NoorState.design.height);
        if (url) {
          b.type = "image";
          b.imageUrl = url;
          NoorState.pushHistory();
          await NoorRenderer.render();
        }
      });
    }
  },

  escape(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  },
};
