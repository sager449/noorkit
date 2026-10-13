/* =========================================
   NoorKit — Backgrounds Registry
   Uses Unsplash Source + Curated colors
   ========================================= */

const NoorBackgrounds = {
  /* ---------- Curated Unsplash search terms ---------- */
  categories: [
    { id: "mountains",  name: "جبال",   query: "mountains,landscape",  icon: "🏔️" },
    { id: "desert",     name: "صحراء",  query: "desert,dunes",         icon: "🏜️" },
    { id: "sea",        name: "بحر",    query: "ocean,sea,sunset",     icon: "🌊" },
    { id: "forest",     name: "غابة",   query: "forest,trees",         icon: "🌲" },
    { id: "sky",        name: "سماء",   query: "sky,clouds,stars",     icon: "🌌" },
    { id: "mosque",     name: "مسجد",   query: "mosque,islamic",       icon: "🕌" },
    { id: "flowers",    name: "زهور",   query: "flowers,bloom",        icon: "🌸" },
    { id: "abstract",   name: "مجردة",  query: "abstract,texture",     icon: "🎨" },
  ],

  /* ---------- Curated solid colors ---------- */
  solidColors: [
    { id: "cream",     color: "#f5ede0", name: "كريمي" },
    { id: "sand",      color: "#e8d5b7", name: "رملي" },
    { id: "dark",      color: "#1a1a1a", name: "أسود" },
    { id: "deep-green", color: "#0d3b2e", name: "أخضر داكن" },
    { id: "navy",      color: "#1e3a5f", name: "كحلي" },
    { id: "maroon",    color: "#5c1a1a", name: "عنابي" },
    { id: "purple",    color: "#3d1e5c", name: "بنفسجي" },
    { id: "teal",      color: "#0d5c5c", name: "أزرق مخضر" },
    { id: "brown",     color: "#3d2818", name: "بني" },
    { id: "gray",      color: "#4a4a4a", name: "رمادي" },
    { id: "white",     color: "#ffffff", name: "أبيض" },
    { id: "gold",      color: "#c9a227", name: "ذهبي" },
  ],

  /* ---------- Curated gradients ---------- */
  gradients: [
    { id: "sunset",   name: "غروب",   css: "linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)" },
    { id: "night",    name: "ليل",    css: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)" },
    { id: "dawn",     name: "فجر",    css: "linear-gradient(135deg, #f5a89c 0%, #f7d9a0 50%, #a1c4fd 100%)" },
    { id: "emerald",  name: "زمرد",   css: "linear-gradient(135deg, #0d3b2e 0%, #1a5c47 50%, #0d8b5f 100%)" },
    { id: "gold",     name: "ذهبي",   css: "linear-gradient(135deg, #8b6914 0%, #c9a227 50%, #f4d35e 100%)" },
    { id: "rose",     name: "وردي",   css: "linear-gradient(135deg, #5c1a1a 0%, #8b4a4a 50%, #d4a5a5 100%)" },
    { id: "ocean",    name: "محيط",   css: "linear-gradient(135deg, #0c2d48 0%, #145374 50%, #5588a3 100%)" },
    { id: "purple",   name: "بنفسج",  css: "linear-gradient(135deg, #2d1b4e 0%, #5c3d8c 50%, #9d7ce8 100%)" },
  ],

  /* ---------- Build Unsplash image URL ---------- */
  getImageUrl(query, width = 1080, height = 1080) {
    return `https://source.unsplash.com/${width}x${height}/?${encodeURIComponent(query)}&sig=${Math.random()}`;
  },

  /* ---------- Get random image from category ---------- */
  getRandomFromCategory(categoryId, width, height) {
    const cat = this.categories.find((c) => c.id === categoryId);
    if (!cat) return null;
    return this.getImageUrl(cat.query, width, height);
  },

  /* ---------- Get gradient by ID ---------- */
  getGradient(id) {
    return this.gradients.find((g) => g.id === id);
  },

  /* ---------- Get solid color by ID ---------- */
  getSolid(id) {
    return this.solidColors.find((c) => c.id === id);
  },
};
