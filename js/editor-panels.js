/* =========================================
   NoorKit — Panels Manager
   يدير فتح/إغلاق اللوحات فقط
   ========================================= */

window.NoorPanels = {
  activeTool: null,

  open(tool) {
    this.activeTool = tool;
    const panel = document.getElementById("tool-panel");
    const content = document.getElementById("panel-content");
    if (!panel || !content) return;

    if (typeof NoorTools !== "undefined" && NoorTools.has(tool)) {
      content.innerHTML = NoorTools.render(tool);
      panel.hidden = false;
      NoorTools.bind(tool);
    }
  },

  close() {
    const panel = document.getElementById("tool-panel");
    if (panel) panel.hidden = true;
    this.activeTool = null;
  },

  refresh() {
    if (this.activeTool) this.open(this.activeTool);
  },
};
