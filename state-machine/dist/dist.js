var o = Object.defineProperty;
var l = (e, t, s) => t in e ? o(e, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : e[t] = s;
var r = (e, t, s) => (l(e, typeof t != "symbol" ? t + "" : t, s), s);
class c {
  constructor() {
    r(this, "_listeners", {});
    r(this, "_onceListeners", {});
  }
  on(t, s) {
    this._listeners[t] || (this._listeners[t] = /* @__PURE__ */ new Set()), this._listeners[t].add(s);
  }
  off(t, s) {
    this._listeners[t] && (this._listeners[t].delete(s), this._listeners[t].size === 0 && delete this._listeners[t]);
  }
  once(t, s) {
    this._onceListeners[t] || (this._onceListeners[t] = /* @__PURE__ */ new Set()), this._onceListeners[t].add(s);
  }
  offOnce(t, s) {
    this._onceListeners[t] && (this._onceListeners[t].delete(s), this._onceListeners[t].size === 0 && delete this._onceListeners[t]);
  }
  emit(t, s) {
    if (this._listeners[t])
      for (const i of [...this._listeners[t]])
        i(s);
    if (this._onceListeners[t]) {
      for (const i of [...this._onceListeners[t]])
        i(s);
      delete this._onceListeners[t];
    }
  }
  removeAllListeners() {
    this._listeners = {}, this._onceListeners = {};
  }
}
class d {
  constructor(t, s, i) {
    r(this, "_state");
    r(this, "_data");
    r(this, "_handlers");
    r(this, "_emitter", new c());
    this._state = t, this._data = s, this._handlers = i;
  }
  state() {
    return this._state;
  }
  data() {
    return { ...this._data };
  }
  emitter() {
    return this._emitter;
  }
  event(t) {
    this._handlers[this._state].onEvent(t, this.data(), this);
  }
  transition(t) {
    this._state !== void 0 && this._handlers[this._state].onLeave(), this._state = t, this._handlers[t].onEnter(this.data(), this), this._emitter.emit("state", this.state());
  }
  setData(t) {
    return this._data = { ...this._data, ...t }, this._emitter.emit("data", this.data()), this._data;
  }
}
var _;
((e) => {
  function t() {
    const s = {};
    let i = null, h = null;
    return {
      state(a) {
        return i = a, this;
      },
      data(a) {
        return h = a, this;
      },
      handle(a, n) {
        return n.onEnter || (n.onEnter = () => {
        }), n.onEvent || (n.onEvent = () => {
        }), n.onLeave || (n.onLeave = () => {
        }), s[a] = n, this;
      },
      build() {
        return new d(i, h, s);
      }
    };
  }
  e.create = t;
})(_ || (_ = {}));
export {
  d as StateMachine,
  _ as StateMachineBuilder
};
