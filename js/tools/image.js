/* =========================================
   NoorKit — Tool: Image
   أداة إضافة الصور والرموز
   ========================================= */

NoorTools.register("image", {
  render() {
    return `
      <h3 class="panel-title">إضافة صورة</h3>

      <div class="panel-row">
        <button class="panel-btn" id="pick-image-btn">📷 اختر صورة من جهازك</button>
      </div>
      <input type="file" id="image-picker" accept="image/*" hidden />

      <div class="panel-row">
        <label class="panel-label">رموز جاهزة</label>
        <div class="bg-grid" id="image-templates">
          <button class="bg-item" data-image-tpl="allah"><span class="bg-item-color" style="background:#7c3aed;color:#fff;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:800;">الله</span></button>
          <button class="bg-item" data-image-tpl="muhammad"><span class="bg-item-color" style="background:#7c3aed;color:#fff;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;">محمد</span></button>
          <button class="bg-item" data-image-tpl="bismillah"><span class="bg-item-color" style="background:#c9a227;color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;">﷽</span></button>
          <button class="bg-item" data-image-tpl="star"><span class="bg-item-color" style="background:#1e40af;color:#fff;display:flex;align-items:center;justify-content:center;font-size:22px;">★</span></button>
        </div>
      </div>
    `;
  },

  bind() {
    const pickBtn = document.getElementById("pick-image-btn");
    const picker = document.getElementById("image-picker");

    pickBtn?.addEventListener("click", () => picker?.click());

    picker?.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = async () => {
          const d = NoorState.design;
          const maxW = d.width * 0.6;
          const ratio = img.height / img.width;
          const w = Math.min(maxW, img.width);
          const h = w * ratio;
          if (!d.images) d.images = [];
          d.images.push({
            id: "img_" + Date.now(),
            src: ev.target.result,
            x: (d.width - w) / 2,
            y: (d.height - h) / 2,
            width: w,
            height: h,
            rotation: 0,
          });
          NoorState.pushHistory();
          await NoorRenderer.render();
          window.showToast?.("تم إضافة الصورة");
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });

    document.querySelectorAll("[data-image-tpl]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const tpl = btn.dataset.imageTpl;
        const d = NoorState.design;
        const texts = { allah: "الله", muhammad: "محمد", bismillah: "﷽", star: "★" };
        if (!d.stickers) d.stickers = [];
        d.stickers.push({
          id: "stk_" + Date.now(),
          text: texts[tpl] || "★",
          x: d.width / 2,
          y: d.height / 2,
          size: 120,
          color: "#7c3aed",
          rotation: 0,
        });
        NoorState.pushHistory();
        await NoorRenderer.render();
        window.showToast?.("تم إضافة العنصر");
      });
    });
  },
});
