var p = Object.defineProperty;
var m = (r, e, t) => e in r ? p(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var o = (r, e, t) => (m(r, typeof e != "symbol" ? e + "" : e, t), t);
var y = Object.defineProperty, g = (r, e, t) => e in r ? y(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, d = (r, e, t) => (g(r, typeof e != "symbol" ? e + "" : e, t), t);
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
      for (const s of [...this._listeners[e]])
        s(t);
    if (this._onceListeners[e]) {
      for (const s of [...this._onceListeners[e]])
        s(t);
      delete this._onceListeners[e];
    }
  }
  removeAllListeners() {
    this._listeners = {}, this._onceListeners = {};
  }
};
var a;
((r) => {
  const e = {
    type: 0
    /* Broadcast */
  };
  function t() {
    return e;
  }
  r.broadcast = t;
  function s(i) {
    return { type: 1, id: i };
  }
  r.to = s;
  function n(i, h) {
    return i.type === 0 || h.type === 0 ? !0 : i.id === h.id;
  }
  r.match = n;
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
  r.toString = c;
  function _(i) {
    return i === "*" ? t() : i.startsWith(":") ? s(i.slice(1)) : null;
  }
  r.parse = _;
})(a || (a = {}));
var u;
((r) => {
  function e(n, c, _) {
    return { type: 0, id: n, name: c, data: _ };
  }
  r.request = e;
  function t(n, c) {
    return { type: 1, id: n, data: c };
  }
  r.response = t;
  function s(n, c) {
    return { type: 2, id: n, reason: c };
  }
  r.error = s;
})(u || (u = {}));
var f = /* @__PURE__ */ ((r) => (r[r.Data = 0] = "Data", r[r.RPC = 1] = "RPC", r))(f || {});
Object.keys(f).length / 2;
class L {
  constructor(e, t) {
    o(this, "_id");
    o(this, "_address");
    o(this, "_emitter", new l());
    o(this, "_socket");
    o(this, "_onMessage", (e, t) => {
      if (typeof e == "number" && typeof t == "string")
        try {
          const s = JSON.parse(t);
          if (typeof s != "object")
            return;
          this._emitter.emit("message", { channel: e, message: s });
        } catch (s) {
          console.error("Error while parsing message", s);
        }
    });
    this._id = e, this._socket = t, this._address = a.broadcast(), this._socket.on("message", this._onMessage);
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
class O {
  constructor(e, t) {
    o(this, "_id");
    o(this, "_emitter", new l());
    o(this, "_peer");
    this._id = e, this._peer = new L("HOST", t), this._peer.emitter().on("message", ({ channel: s, message: n }) => {
      this._emitter.emit("message", {
        peerId: this._peer.id(),
        channel: s,
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
  O as SocketIONetwork
};
