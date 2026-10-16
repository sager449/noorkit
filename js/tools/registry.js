/* =========================================
   NoorKit — Tools Registry
   سجل الأدوات الخارجية
   ========================================= */

window.NoorTools = {
  tools: {},

  register(id, config) {
    this.tools[id] = config;
  },

  has(id) {
    return !!this.tools[id];
  },

  get(id) {
    return this.tools[id];
  },

  render(id) {
    const tool = this.tools[id];
    if (tool && typeof tool.render === "function") {
      return tool.render();
    }
    return "<p class='panel-note'>الأداة غير متاحة</p>";
  },

  bind(id) {
    const tool = this.tools[id];
    if (tool && typeof tool.bind === "function") {
      tool.bind();
    }
  },
};
