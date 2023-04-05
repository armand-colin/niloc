var f = Object.defineProperty;
var p = (s, e, t) => e in s ? f(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var o = (s, e, t) => (p(s, typeof e != "symbol" ? e + "" : e, t), t);
var m = Object.defineProperty, y = (s, e, t) => e in s ? m(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, d = (s, e, t) => (y(s, typeof e != "symbol" ? e + "" : e, t), t);
let l = class {
  constructor() {
    d(this, "_listeners", {}), d(this, "_onceListeners", {});
  }
  on(e, t) {
    this._listeners[e] || (this._listeners[e] = /* @__PURE__ */ new Set()), this._listeners[e].add(t);
  }
  off(e, t) {
    this._listeners[e] && (this._listeners[e].delete(t), this._listeners[e].size === 0 && delete this._listeners[e]);
  }
  once(e, t) {
    this._onceListeners[e] || (this._onceListeners[e] = /* @__PURE__ */ new Set()), this._onceListeners[e].add(t);
  }
  offOnce(e, t) {
    this._onceListeners[e] && (this._onceListeners[e].delete(t), this._onceListeners[e].size === 0 && delete this._onceListeners[e]);
  }
  emit(e, t) {
    if (this._listeners[e])
      for (const r of [...this._listeners[e]])
        r(t);
    if (this._onceListeners[e]) {
      for (const r of [...this._onceListeners[e]])
        r(t);
      delete this._onceListeners[e];
    }
  }
  removeAllListeners() {
    this._listeners = {}, this._onceListeners = {};
  }
};
var h;
((s) => {
  const e = {
    type: 0
    /* Broadcast */
  };
  function t() {
    return e;
  }
  s.broadcast = t;
  function r(i) {
    return { type: 1, id: i };
  }
  s.to = r;
  function n(i, a) {
    return i.type === 0 || a.type === 0 ? !0 : i.id === a.id;
  }
  s.match = n;
  function c(i) {
    switch (i.type) {
      case 0:
        return "*";
      case 1:
        return `:${i.id}`;
      default:
        return "?";
    }
  }
  s.toString = c;
  function _(i) {
    return i === "*" ? t() : i.startsWith(":") ? r(i.slice(1)) : null;
  }
  s.parse = _;
})(h || (h = {}));
var u;
((s) => {
  function e(n, c, _) {
    return { type: 0, id: n, name: c, data: _ };
  }
  s.request = e;
  function t(n, c) {
    return { type: 1, id: n, data: c };
  }
  s.response = t;
  function r(n, c) {
    return { type: 2, id: n, reason: c };
  }
  s.error = r;
})(u || (u = {}));
class g {
  constructor(e, t) {
    o(this, "_id");
    o(this, "_address");
    o(this, "_emitter", new l());
    o(this, "_socket");
    o(this, "_onMessage", (e, t) => {
      if (typeof e == "number" && typeof t == "string")
        try {
          const r = JSON.parse(t);
          if (typeof r != "object")
            return;
          this._emitter.emit("message", { channel: e, message: r });
        } catch (r) {
          console.error("Error while parsing message", r);
        }
    });
    this._id = e, this._socket = t, this._address = h.broadcast(), this._socket.on("message", this._onMessage);
  }
  id() {
    return this._id;
  }
  address() {
    return this._address;
  }
  emitter() {
    return this._emitter;
  }
  send(e, t) {
    this._socket.send(e, JSON.stringify(t));
  }
}
class w {
  constructor(e, t) {
    o(this, "_id");
    o(this, "_emitter", new l());
    o(this, "_peer");
    this._id = e, this._peer = new g("HOST", t), this._peer.emitter().on("message", ({ channel: r, message: n }) => {
      this._emitter.emit("message", {
        peerId: this._peer.id(),
        channel: r,
        message: n
      });
    });
  }
  id() {
    return this._id;
  }
  emitter() {
    return this._emitter;
  }
  *peers() {
    yield this._peer;
  }
}
export {
  w as SocketIONetwork
};
