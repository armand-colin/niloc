var p = Object.defineProperty;
var y = (r, e, t) => e in r ? p(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var o = (r, e, t) => (y(r, typeof e != "symbol" ? e + "" : e, t), t);
var g = Object.defineProperty, L = (r, e, t) => e in r ? g(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, d = (r, e, t) => (L(r, typeof e != "symbol" ? e + "" : e, t), t);
class u {
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
}
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
var l;
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
})(l || (l = {}));
var m;
((r) => {
  function e(t) {
    return {
      emitter() {
        return t.emitter;
      },
      get: t.get,
      requestObject(s, n) {
        return t.objectsEmitter.on(s, n), n(t.get(s)), {
          destroy() {
            t.objectsEmitter.off(s, n);
          }
        };
      }
    };
  }
  r.make = e;
})(m || (m = {}));
var f;
((r) => {
  function e(t, s) {
    return {
      type: t,
      create: (n) => new s(n, t)
    };
  }
  r.create = e;
})(f || (f = {}));
class O {
  constructor(e, t) {
    o(this, "_id");
    o(this, "_address");
    o(this, "_emitter", new u());
    o(this, "_socketIOEmitter", new u());
    o(this, "_socket");
    o(this, "_onMessage", (e, t) => {
      if (console.log("recv message", e, t), typeof e == "number" && typeof t == "string")
        try {
          const s = JSON.parse(t);
          if (!s)
            return;
          this._emitter.emit("message", { channel: e, message: s });
        } catch (s) {
          console.error(`Error receiving network message (${this._id})`, s);
        }
    });
    this._id = e, this._address = a.to(e), this._socket = t, t.on("message", this._onMessage), t.on("disconnect", () => {
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
class v {
  constructor() {
    o(this, "_peers", /* @__PURE__ */ new Map());
    o(this, "_emitter", new u());
  }
  addSocket(e) {
    const t = e.handshake.query.peerId;
    if (this._peers.has(t))
      return;
    const s = new O(t, e);
    s.socketIOEmitter().on("disconnect", () => {
      this._peers.get(t) === s && this._peers.delete(t);
    }), s.emitter().on("message", (n) => {
      this._emitter.emit("message", { peerId: t, ...n });
    }), this._peers.set(t, s);
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
  v as SocketIONetwork
};
