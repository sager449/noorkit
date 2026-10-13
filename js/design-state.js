/* =========================================
   NoorKit — Design State
   Holds the design data + history
   ========================================= */

const NoorState = {
  design: {
    id: null,
    title: "تصميم بدون عنوان",
    width: 1080,
    height: 1080,

    background: {
      type: "solid",
      value: "#f5ede0",
      imageUrl: null,
    },

    ayah: {
      surah: null,
      ayahNumber: null,
      surahName: "",
      text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      showBismillah: false,
    },

    text: {
      fontId: "amiri",
      size: 64,
      color: "#1a1a1a",
      lineHeight: 1.8,
      align: "center",
      shadow: false,
      shadowColor: "#000000",
      shadowBlur: 8,
    },

    translation: {
      enabled: false,
      lang: "en",
      text: "",
      fontId: "cairo",
      size: 28,
      color: "#4a4a4a",
    },

    frame: {
      type: "none",
      color: "#c9a227",
      thickness: 4,
    },

    decor: {
      top: false,
      bottom: false,
    },
  },

  history: [],
  historyIndex: -1,

  /* ---------- Save snapshot to history ---------- */
  pushHistory() {
    const snapshot = JSON.parse(JSON.stringify(this.design));
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push(snapshot);
    if (this.history.length > 40) this.history.shift();
    this.historyIndex = this.history.length - 1;
    this.updateUndoButtons();
  },

  /* ---------- Undo ---------- */
  undo() {
    if (this.historyIndex <= 0) return false;
    this.historyIndex--;
    this.design = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
    this.updateUndoButtons();
    return true;
  },

  /* ---------- Redo ---------- */
  redo() {
    if (this.historyIndex >= this.history.length - 1) return false;
    this.historyIndex++;
    this.design = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
    this.updateUndoButtons();
    return true;
  },

  /* ---------- Enable / disable undo buttons ---------- */
  updateUndoButtons() {
    const undoBtn = document.getElementById("undo-btn");
    const redoBtn = document.getElementById("redo-btn");
    if (undoBtn) undoBtn.disabled = this.historyIndex <= 0;
    if (redoBtn) redoBtn.disabled = this.historyIndex >= this.history.length - 1;
  },

  /* ---------- Update single property by path ---------- */
  set(path, value) {
    const keys = path.split(".");
    let obj = this.design;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!obj[keys[i]]) obj[keys[i]] = {};
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
  },

  /* ---------- Get property by path ---------- */
  get(path) {
    const keys = path.split(".");
    let obj = this.design;
    for (const key of keys) {
      if (obj == null) return null;
      obj = obj[key];
    }
    return obj;
  },

  /* ---------- Load design from saved record ---------- */
  load(record) {
    if (!record || !record.design) return false;
    this.design = JSON.parse(JSON.stringify(record.design));
    this.history = [JSON.parse(JSON.stringify(this.design))];
    this.historyIndex = 0;
    this.updateUndoButtons();
    return true;
  },

  /* ---------- Reset to new design ---------- */
  reset(width = 1080, height = 1080) {
    this.design = {
      id: "design_" + Date.now(),
      title: "تصميم بدون عنوان",
      width,
      height,
      background: { type: "solid", value: "#f5ede0", imageUrl: null },
      ayah: {
        surah: null,
        ayahNumber: null,
        surahName: "",
        text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        showBismillah: false,
      },
      text: {
        fontId: "amiri",
        size: 64,
        color: "#1a1a1a",
        lineHeight: 1.8,
        align: "center",
        shadow: false,
        shadowColor: "#000000",
        shadowBlur: 8,
      },
      translation: {
        enabled: false,
        lang: "en",
        text: "",
        fontId: "cairo",
        size: 28,
        color: "#4a4a4a",
      },
      frame: { type: "none", color: "#c9a227", thickness: 4 },
      decor: { top: false, bottom: false },
    };
    this.history = [JSON.parse(JSON.stringify(this.design))];
    this.historyIndex = 0;
    this.updateUndoButtons();
  },
};
