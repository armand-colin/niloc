var o = Object.defineProperty;
var _ = (i, s, e) => s in i ? o(i, s, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[s] = e;
var r = (i, s, e) => (_(i, typeof s != "symbol" ? s + "" : s, e), e);
class l {
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
class f {
  constructor() {
    r(this, "_types", /* @__PURE__ */ new Map());
    r(this, "_history", []);
  }
  get(s) {
    return this._get(s);
  }
  set(s, e) {
    this._types.set(s, e);
  }
  _get(s, e = []) {
    if (!this._types.has(s)) {
      if (this._history.includes(s)) {
        const n = e.map((h) => h.name).join(" -> ");
        throw new Error(`Circular dependency detected for ${s.name}: ${n}`);
      }
      this._history.push(s);
      const t = new s(this);
      return this._types.set(s, t), this._history.pop(), t;
    }
    return this._types.get(s);
  }
}
export {
  l as Emitter,
  f as Provider
};
