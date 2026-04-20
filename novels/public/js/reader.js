// ── Reader: font size controls ──

const Reader = {
  _size: parseInt(localStorage.getItem("tarhuala-font-size") || "11", 10),

  getSize() {
    return this._size;
  },

  setSize(val) {
    this._size = Math.max(8, Math.min(22, val));
    localStorage.setItem("tarhuala-font-size", this._size);
    this._apply();
  },

  increase() {
    this.setSize(this._size + 1);
  },

  decrease() {
    this.setSize(this._size - 1);
  },

  _apply() {
    const body = document.querySelector(".reader-body");
    if (body) body.style.fontSize = this._size + "pt";

    const label = document.querySelector(".reader-bar__font-label");
    if (label) label.textContent = this._size + "pt";
  },

  init() {
    this._apply();
  },
};
