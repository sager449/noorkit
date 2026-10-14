/* =========================================
   NoorKit — Ayah Decorations
   زخارف الآيات
   ========================================= */

window.NoorDecorations = {
  list: [
    // أرقام الآيات
    { id: "num-gold",   type: "number", color: "#c9a227", name: "رقم ذهبي" },
    { id: "num-green",  type: "number", color: "#0d8b5f", name: "رقم أخضر" },
    { id: "num-purple", type: "number", color: "#7c3aed", name: "رقم بنفسجي" },
    { id: "num-black",  type: "number", color: "#1a1a1a", name: "رقم أسود" },
    { id: "num-white",  type: "number", color: "#ffffff", name: "رقم أبيض" },
    { id: "num-blue",   type: "number", color: "#1e40af", name: "رقم أزرق" },

    // زخرفة البسملة
    { id: "bismillah",  type: "text", symbol: "﷽", size: 80, name: "البسملة" },

    // أقواس مزخرفة
    { id: "bracket-star", type: "text", symbol: "﴾﴿", size: 100, name: "أقواس" },

    // نجوم إسلامية
    { id: "star-8",     type: "text", symbol: "✵", size: 60, name: "نجمة 8" },
    { id: "star-5",     type: "text", symbol: "★", size: 60, name: "نجمة" },
    { id: "star-ornament", type: "text", symbol: "❁", size: 60, name: "زهرة" },
    { id: "star-diamond", type: "text", symbol: "◆", size: 50, name: "معيّن" },
    { id: "star-crescent", type: "text", symbol: "☪", size: 70, name: "هلال" },

    // فاصل
    { id: "divider-1", type: "text", symbol: "﴿ ۞ ﴾", size: 50, name: "فاصل" },
  ],

  /* ---------- رسم رقم آية داخل زخرفة ---------- */
  drawAyahNumber(ctx, number, x, y, size, color) {
    if (!ctx) return;
    const radius = size;

    ctx.save();

    // خلفية الدائرة (زخرفة)
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    // إطار
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, radius - 4, 0, Math.PI * 2);
    ctx.stroke();

    // الرقم
    ctx.fillStyle = "#ffffff";
    ctx.font = `700 ${size}px 'Cairo', sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.direction = "rtl";
    ctx.fillText(number, x, y);

    ctx.restore();
  },

  /* ---------- رسم زخرفة ---------- */
  drawDecoration(ctx, deco, x, y, size) {
    if (!ctx || !deco) return;
    ctx.save();
    ctx.fillStyle = deco.color || "#c9a227";
    ctx.font = `400 ${size}px 'Amiri', serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(deco.symbol, x, y);
    ctx.restore();
  },

  get(id) {
    return this.list.find((d) => d.id === id);
  },
};
