/* =========================================
   NoorKit — Tool: Background (ورقة) v2
   مع تعديلات: سطر واحد للتدرجات + نقوش أفقية + وضوح/شفافية
   ========================================= */

NoorTools.register("background", {
  render() {
    return "<p style='padding:20px;color:#888;'>استخدم الشريط العلوي</p>";
  },
  bind() {},
});

window.NoorPaper = {
  ensure() {
    const b = NoorState.design.background;
    if (!b.type) b.type = "solid";
    if (!b.value) b.value = "#f5ede0";
    if (!b.pattern) b.pattern = "none";
    if (!b.lighting) b.lighting = { enabled: false, angle: 135, intensity: 30 };
    if (!b.fog) b.fog = { enabled: false, intensity: 20 };
    if (!b.hdr) b.hdr = { enabled: false, contrast: 20, saturation: 20 };
    if (!b.vignette) b.vignette = { enabled: false, intensity: 40, softness: 60 };
    if (!b.imageSettings) b.imageSettings = { opacity: 100, brightness: 100, blur: 0 };
    return b;
  },

  COLORS: [
    "#000000","#1a1a1a","#2a2a2a","#3a3a3a","#555555","#78716c","#888888","#b0b0b0","#d4d4d4","#ffffff",
    "#c9a227","#d4af37","#e6c34a","#f0d878","#fff8d0","#f59e0b","#fbbf24","#fcd34d",
    "#ea580c","#f97316","#fb923c","#fdba74","#b91c1c","#dc2626","#ef4444","#f87171","#7c1d00","#c2410c",
    "#78350f","#a16207","#b45309","#92400e","#8b4513","#a0522d",
    "#0d8b5f","#059669","#10b981","#34d399","#65a30d","#84cc16","#4ade80","#166534",
    "#1e40af","#2563eb","#3b82f6","#60a5fa","#0891b2","#06b6d4","#22d3ee","#0e7490",
    "#7c3aed","#8b5cf6","#a855f7","#c084fc","#6366f1","#818cf8","#a78bfa","#4c1d95",
    "#be185d","#db2777","#ec4899","#f472b6","#e11d48","#f43f5e","#fb7185","#fda4af",
    "#f5ede0","#faf5eb","#e8dcc0","#d4c5a0",
  ],

  GRADIENTS: [
    { name: "ذهبي",       css: "linear-gradient(135deg, #c9a227 0%, #fff8d0 100%)" },
    { name: "نار",        css: "linear-gradient(135deg, #f59e0b 0%, #b91c1c 100%)" },
    { name: "سماء",       css: "linear-gradient(135deg, #0891b2 0%, #7c3aed 100%)" },
    { name: "زمرد",       css: "linear-gradient(135deg, #0d8b5f 0%, #c9a227 100%)" },
    { name: "غروب",       css: "linear-gradient(135deg, #be185d 0%, #f59e0b 100%)" },
    { name: "فضي",        css: "linear-gradient(135deg, #e8e8e8 0%, #888888 100%)" },
    { name: "وردي",       css: "linear-gradient(135deg, #fda4af 0%, #be185d 100%)" },
    { name: "كريمي",      css: "linear-gradient(135deg, #f5ede0 0%, #d4c5a0 100%)" },
    { name: "ليلي",       css: "linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)" },
    { name: "زمردي",      css: "linear-gradient(135deg, #0d8b5f 0%, #0891b2 100%)" },
    { name: "بنفسجي",     css: "linear-gradient(135deg, #4c1d95 0%, #c084fc 100%)" },
    { name: "ذهبي غامق",  css: "linear-gradient(135deg, #78350f 0%, #c9a227 100%)" },
  ],

  PATTERNS: [
    { id: "none",       name: "بدون" },
    { id: "arabesque",  name: "عربي" },
    { id: "geometric",  name: "هندسي" },
    { id: "diamond",    name: "معينات" },
    { id: "stripes",    name: "خطوط" },
    { id: "dots",       name: "نقاط" },
    { id: "grid",       name: "شبكة" },
    { id: "waves",      name: "أمواج" },
  ],

  /* ═══ محتوى كل أداة ═══ */
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

    /* ═══ تدرج (سطر واحد قابل للتمرير) ═══ */
    if (toolId === "paper-gradient") {
      const grads = this.GRADIENTS.map(
        (g) => `<button class="nk-grad-chip ${b.type === "gradient" && b.value === g.css ? "active" : ""}" data-paper-grad="${this.escape(g.css)}"><span style="background:${g.css};"></span></button>`
      ).join("");
      return `
        <div class="nk-row"><span class="nk-row-label">تدرجات</span></div>
        <div class="nk-grad-row">${grads}</div>
      `;
    }

    /* ═══ نقش (سطر واحد قابل للتمرير) ═══ */
    if (toolId === "paper-pattern") {
      const pats = this.PATTERNS.map((p) => {
        let previewStyle = "background:#1f1f1f;";
        if (p.id === "dots") previewStyle += "background-image:radial-gradient(#c9a227 1px,transparent 1.5px);background-size:10px 10px;";
        if (p.id === "grid") previewStyle += "background-image:linear-gradient(#c9a22755 1px,transparent 1px),linear-gradient(90deg,#c9a22755 1px,transparent 1px);background-size:10px 10px;";
        if (p.id === "stripes") previewStyle += "background-image:repeating-linear-gradient(45deg,#c9a22755 0,#c9a22755 1px,transparent 1px,transparent 6px);";
        if (p.id === "diamond") previewStyle += "background-image:linear-gradient(45deg,#c9a22755 25%,transparent 25%),linear-gradient(-45deg,#c9a22755 25%,transparent 25%);background-size:12px 12px;";
        if (p.id === "geometric") previewStyle += "background-image:linear-gradient(45deg,#c9a22755 25%,transparent 25%,transparent 75%,#c9a22755 75%);background-size:12px 12px;";
        if (p.id === "arabesque") previewStyle += "background-image:radial-gradient(circle,#c9a22755 2px,transparent 3px);background-size:12px 12px;";
        if (p.id === "waves") previewStyle += "background-image:repeating-linear-gradient(0deg,#c9a22755 0,#c9a22755 1px,transparent 1px,transparent 6px);";
        return `<button class="nk-pattern-chip ${b.pattern === p.id ? "active" : ""}" data-paper-pattern="${p.id}"><span style="${previewStyle}"></span><small>${p.name}</small></button>`;
      }).join("");
      return `
        <div class="nk-row"><span class="nk-row-label">النقوش</span></div>
        <div class="nk-pattern-row">${pats}</div>
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
      const s = b.imageSettings;
      return `
        <div class="nk-row"><span class="nk-row-label">الشفافية</span><span class="nk-row-value" id="paper-img-op-val">${s.opacity}%</span></div>
        <input type="range" class="ts-slider" id="paper-img-op" min="0" max="100" value="${s.opacity}" style="width:100%;margin-bottom:8px;" />

        <div class="nk-row"><span class="nk-row-label">الوضوح</span><span class="nk-row-value" id="paper-img-br-val">${s.brightness}%</span></div>
        <input type="range" class="ts-slider" id="paper-img-br" min="0" max="200" value="${s.brightness}" style="width:100%;margin-bottom:8px;" />

        <div class="nk-row"><span class="nk-row-label">الضبابية</span><span class="nk-row-value" id="paper-img-blur-val">${s.blur}</span></div>
        <input type="range" class="ts-slider" id="paper-img-blur" min="0" max="20" value="${s.blur}" style="width:100%;margin-bottom:12px;" />

        <div style="display:flex;gap:6px;">
          <button id="paper-image-upload-btn" style="flex:1;padding:12px;background:#ffffff;color:#111;border:none;font-weight:700;cursor:pointer;font-family:inherit;font-size:13px;">اختيار صورة</button>
          <button id="paper-image-random" style="flex:1;padding:12px;background:#2a2a2a;color:#fff;border:none;font-weight:700;cursor:pointer;font-family:inherit;font-size:13px;">جلب من الإنترنت</button>
        </div>
        <input type="file" id="paper-image-upload" accept="image/*" style="display:none;" />
      `;
    }

    return "";
  },

  /* ═══ ربط الأحداث ═══ */
  bindToolContent(toolId) {
    this.ensure();
    const b = NoorState.design.background;

    if (toolId === "paper-color") {
      document.querySelectorAll("[data-paper-color]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          b.type = "solid"; b.value = btn.dataset.paperColor; b.imageUrl = null;
          NoorState.pushHistory(); await NoorRenderer.render();
        });
      });
      document.querySelector("[data-paper-color-picker]")?.addEventListener("click", () => {
        NoorTextStyles.openColorPicker(b.value || "#f5ede0", async (c) => {
          b.type = "solid"; b.value = c; b.imageUrl = null;
          NoorState.pushHistory(); await NoorRenderer.render();
        });
      });
    }

    if (toolId === "paper-gradient") {
      document.querySelectorAll("[data-paper-grad]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          b.type = "gradient"; b.value = btn.dataset.paperGrad; b.imageUrl = null;
          NoorState.pushHistory(); await NoorRenderer.render();
        });
      });
    }

    if (toolId === "paper-pattern") {
      document.querySelectorAll("[data-paper-pattern]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          b.pattern = btn.dataset.paperPattern;
          NoorState.pushHistory(); await NoorRenderer.render();
        });
      });
    }

    if (toolId === "paper-lighting") {
      const angle = document.getElementById("paper-light-angle");
      const angleVal = document.getElementById("paper-light-angle-val");
      const int = document.getElementById("paper-light-int");
      const intVal = document.getElementById("paper-light-int-val");

      angle?.addEventListener("input", () => {
        b.lighting.angle = parseInt(angle.value);
        b.lighting.enabled = true;
        if (angleVal) angleVal.textContent = b.lighting.angle + "°";
        NoorRenderer.debouncedRender();
      });
      angle?.addEventListener("change", () => NoorState.pushHistory());

      int?.addEventListener("input", () => {
        b.lighting.intensity = parseInt(int.value);
        b.lighting.enabled = true;
        if (intVal) intVal.textContent = b.lighting.intensity;
        NoorRenderer.debouncedRender();
      });
      int?.addEventListener("change", () => NoorState.pushHistory());
    }

    if (toolId === "paper-fog") {
      const int = document.getElementById("paper-fog-int");
      const intVal = document.getElementById("paper-fog-int-val");
      int?.addEventListener("input", () => {
        b.fog.intensity = parseInt(int.value);
        b.fog.enabled = true;
        if (intVal) intVal.textContent = b.fog.intensity;
        NoorRenderer.debouncedRender();
      });
      int?.addEventListener("change", () => NoorState.pushHistory());
    }

    if (toolId === "paper-hdr") {
      const c = document.getElementById("paper-hdr-contrast");
      const cVal = document.getElementById("paper-hdr-contrast-val");
      const s = document.getElementById("paper-hdr-sat");
      const sVal = document.getElementById("paper-hdr-sat-val");

      c?.addEventListener("input", () => {
        b.hdr.contrast = parseInt(c.value);
        b.hdr.enabled = true;
        if (cVal) cVal.textContent = b.hdr.contrast;
        NoorRenderer.debouncedRender();
      });
      c?.addEventListener("change", () => NoorState.pushHistory());

      s?.addEventListener("input", () => {
        b.hdr.saturation = parseInt(s.value);
        b.hdr.enabled = true;
        if (sVal) sVal.textContent = b.hdr.saturation;
        NoorRenderer.debouncedRender();
      });
      s?.addEventListener("change", () => NoorState.pushHistory());
    }

    if (toolId === "paper-vignette") {
      const int = document.getElementById("paper-vin-int");
      const intVal = document.getElementById("paper-vin-int-val");
      const soft = document.getElementById("paper-vin-soft");
      const softVal = document.getElementById("paper-vin-soft-val");

      int?.addEventListener("input", () => {
        b.vignette.intensity = parseInt(int.value);
        b.vignette.enabled = true;
        if (intVal) intVal.textContent = b.vignette.intensity;
        NoorRenderer.debouncedRender();
      });
      int?.addEventListener("change", () => NoorState.pushHistory());

      soft?.addEventListener("input", () => {
        b.vignette.softness = parseInt(soft.value);
        b.vignette.enabled = true;
        if (softVal) softVal.textContent = b.vignette.softness;
        NoorRenderer.debouncedRender();
      });
      soft?.addEventListener("change", () => NoorState.pushHistory());
    }

    if (toolId === "paper-image") {
      const upload = document.getElementById("paper-image-upload");
      const uploadBtn = document.getElementById("paper-image-upload-btn");

      uploadBtn?.addEventListener("click", () => upload?.click());
      upload?.addEventListener("change", (e) => {
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

      const op = document.getElementById("paper-img-op");
      const opVal = document.getElementById("paper-img-op-val");
      const br = document.getElementById("paper-img-br");
      const brVal = document.getElementById("paper-img-br-val");
      const blur = document.getElementById("paper-img-blur");
      const blurVal = document.getElementById("paper-img-blur-val");

      op?.addEventListener("input", () => {
        b.imageSettings.opacity = parseInt(op.value);
        if (opVal) opVal.textContent = b.imageSettings.opacity + "%";
        NoorRenderer.debouncedRender();
      });
      op?.addEventListener("change", () => NoorState.pushHistory());

      br?.addEventListener("input", () => {
        b.imageSettings.brightness = parseInt(br.value);
        if (brVal) brVal.textContent = b.imageSettings.brightness + "%";
        NoorRenderer.debouncedRender();
      });
      br?.addEventListener("change", () => NoorState.pushHistory());

      blur?.addEventListener("input", () => {
        b.imageSettings.blur = parseInt(blur.value);
        if (blurVal) blurVal.textContent = b.imageSettings.blur;
        NoorRenderer.debouncedRender();
      });
      blur?.addEventListener("change", () => NoorState.pushHistory());
    }
  },

  escape(str) {
    return String(str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  },
};
