var g = Object.defineProperty;
var L = (s, e, t) => e in s ? g(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var o = (s, e, t) => (L(s, typeof e != "symbol" ? e + "" : e, t), t);
var c;
((s) => {
  const e = {
    type: 0
    /* Broadcast */
  }, t = {
    type: 2
    /* Host */
  };
  function r() {
    return e;
  }
  s.broadcast = r;
  function i() {
    return t;
  }
  s.host = i;
  function _(n) {
    return { type: 1, id: n };
  }
  s.to = _;
  function l(n, y, a) {
    return n.type === 0 || a.type === 0 ? !0 : n.type === 2 ? a.type === 2 : n.id === y;
  }
  s.match = l;
  function f(n) {
    switch (n.type) {
      case 0:
        return "*";
      case 1:
        return `:${n.id}`;
      case 2:
        return "host";
      default:
        return "?";
    }
  }
  s.toString = f;
  function p(n) {
    return n === "*" ? r() : n === "host" ? i() : n.startsWith(":") ? _(n.slice(1)) : null;
  }
  s.parse = p;
})(c || (c = {}));
var u;
((s) => {
  function e(t) {
    return {
      emitter() {
        return t.emitter;
      },
      get: t.get,
      requestObject(r, i) {
        return t.objectsEmitter.on(r, i), i(t.get(r)), {
          destroy() {
            t.objectsEmitter.off(r, i);
          }
        };
      }
    };
  }
  s.make = e;
})(u || (u = {}));
var d;
((s) => {
  function e(t, r) {
    return {
      type: t,
      create: (i) => new r(i, t)
    };
  }
  s.create = e;
})(d || (d = {}));
var k = Object.defineProperty, O = (s, e, t) => e in s ? k(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, m = (s, e, t) => (O(s, typeof e != "symbol" ? e + "" : e, t), t);
class h {
  constructor() {
    m(this, "_listeners", {}), m(this, "_onceListeners", {});
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
}
class w {
  constructor(e, t, r) {
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
    this._id = t, this._address = r ? c.host() : c.to(t), this._socket = e, e.on("message", this._onMessage), e.on("disconnect", () => {
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
  constructor(e) {
    o(this, "_address");
    o(this, "_peers", /* @__PURE__ */ new Map());
    o(this, "_emitter", new h());
    this._address = e ? c.host() : c.to("SERVER");
  }
  id() {
    return "SERVER";
  }
  address() {
    return this._address;
  }
  peers() {
    return this._peers.values();
  }
  emitter() {
    return this._emitter;
  }
  addSocket(e, t, r) {
    if (this._peers.has(t))
      return;
    const i = new w(e, t, r);
    i.socketIOEmitter().on("disconnect", () => {
      this._peers.get(t) === i && this._peers.delete(t);
    }), i.emitter().on("message", (_) => {
      this._emitter.emit("message", { peerId: t, ..._ });
    }), this._peers.set(t, i);
  }
}
export {
  v as SocketIONetwork
};
