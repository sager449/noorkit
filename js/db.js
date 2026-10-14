/* =========================================
   NoorKit — IndexedDB Layer
   ========================================= */

window.NoorDB = {
  DB_NAME: "noorkit",
  VERSION: 1,
  STORE: "designs",
  _db: null,

  async open() {
    if (this._db) return this._db;
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.DB_NAME, this.VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(this.STORE)) {
          const store = db.createObjectStore(this.STORE, { keyPath: "id" });
          store.createIndex("updatedAt", "updatedAt", { unique: false });
        }
      };
      req.onsuccess = () => {
        this._db = req.result;
        resolve(this._db);
      };
      req.onerror = () => reject(req.error);
    });
  },

  async save(design) {
    const db = await this.open();
    const record = {
      id: design.id || "design_" + Date.now(),
      design: JSON.parse(JSON.stringify(design)),
      updatedAt: Date.now(),
    };
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.STORE, "readwrite");
      const store = tx.objectStore(this.STORE);
      const req = store.put(record);
      req.onsuccess = () => resolve(record);
      req.onerror = () => reject(req.error);
    });
  },

  async getLast() {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.STORE, "readonly");
      const store = tx.objectStore(this.STORE);
      const idx = store.index("updatedAt");
      const req = idx.openCursor(null, "prev");
      req.onsuccess = () => {
        const cursor = req.result;
        resolve(cursor ? cursor.value : null);
      };
      req.onerror = () => reject(req.error);
    });
  },

  async getAll() {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.STORE, "readonly");
      const store = tx.objectStore(this.STORE);
      const req = store.getAll();
      req.onsuccess = () => {
        const list = req.result || [];
        list.sort((a, b) => b.updatedAt - a.updatedAt);
        resolve(list);
      };
      req.onerror = () => reject(req.error);
    });
  },

  async delete(id) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.STORE, "readwrite");
      const store = tx.objectStore(this.STORE);
      const req = store.delete(id);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  },
};
