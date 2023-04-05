var m = Object.defineProperty;
var f = (s, e, t) => e in s ? m(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var o = (s, e, t) => (f(s, typeof e != "symbol" ? e + "" : e, t), t);
var p = Object.defineProperty, y = (s, e, t) => e in s ? p(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, u = (s, e, t) => (y(s, typeof e != "symbol" ? e + "" : e, t), t);
let h = class {
  constructor() {
    u(this, "_listeners", {}), u(this, "_onceListeners", {});
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
var d;
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
})(d || (d = {}));
var l;
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
})(l || (l = {}));
class g {
  constructor(e, t) {
    o(this, "_id");
    o(this, "_address");
    o(this, "_emitter", new h());
    o(this, "_socketIOEmitter", new h());
    o(this, "_socket");
    o(this, "_onMessage", (e, t) => {
      if (typeof e == "number" && typeof t == "string")
        try {
          const r = JSON.parse(t);
          if (!r)
            return;
          this._emitter.emit("message", { channel: e, message: r });
        } catch (r) {
          console.error(`Error receiving network message (${this._id})`, r);
        }
    });
    this._id = e, this._address = d.to(e), this._socket = t, t.on("message", this._onMessage), t.on("disconnect", () => {
      this.destroy(), this._socketIOEmitter.emit("disconnect");
    });
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
  socketIOEmitter() {
    return this._socketIOEmitter;
  }
  send(e, t) {
    this._socket.send(e, JSON.stringify(t));
  }
  destroy() {
    this._socket.removeAllListeners();
  }
}
class k {
  constructor() {
    o(this, "_peers", /* @__PURE__ */ new Map());
    o(this, "_emitter", new h());
  }
  addSocket(e) {
    const t = e.handshake.query.id;
    if (this._peers.has(t))
      return;
    const r = new g(t, e);
    r.socketIOEmitter().on("disconnect", () => {
      this._peers.get(t) === r && this._peers.delete(t);
    }), r.emitter().on("message", (n) => {
      this._emitter.emit("message", { peerId: t, ...n });
    }), this._peers.set(t, r);
  }
  id() {
    return "HOST";
  }
  peers() {
    return this._peers.values();
  }
  emitter() {
    return this._emitter;
  }
}
export {
  k as SocketIONetwork
};
