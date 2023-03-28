var n = Object.defineProperty;
var o = (i, s, e) => s in i ? n(i, s, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[s] = e;
var r = (i, s, e) => (o(i, typeof s != "symbol" ? s + "" : s, e), e);
class _ {
  constructor() {
    r(this, "_listeners", {});
    r(this, "_onceListeners", {});
  }
  on(s, e) {
    this._listeners[s] || (this._listeners[s] = /* @__PURE__ */ new Set()), this._listeners[s].add(e);
  }
  off(s, e) {
    this._listeners[s] && (this._listeners[s].delete(e), this._listeners[s].size === 0 && delete this._listeners[s]);
  }
  once(s, e) {
    this._onceListeners[s] || (this._onceListeners[s] = /* @__PURE__ */ new Set()), this._onceListeners[s].add(e);
  }
  offOnce(s, e) {
    this._onceListeners[s] && (this._onceListeners[s].delete(e), this._onceListeners[s].size === 0 && delete this._onceListeners[s]);
  }
  emit(s, e) {
    if (this._listeners[s])
      for (const t of [...this._listeners[s]])
        t(e);
    if (this._onceListeners[s]) {
      for (const t of [...this._onceListeners[s]])
        t(e);
      delete this._onceListeners[s];
    }
  }
  removeAllListeners() {
    this._listeners = {}, this._onceListeners = {};
  }
}
export {
  _ as Emitter
};
