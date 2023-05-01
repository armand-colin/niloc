var g = Object.defineProperty;
var v = (s, e, t) => e in s ? g(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var o = (s, e, t) => (v(s, typeof e != "symbol" ? e + "" : e, t), t);
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
  function n() {
    return t;
  }
  s.host = n;
  function _(i) {
    return { type: 1, id: i };
  }
  s.to = _;
  function f(i, y, a) {
    return i.type === 0 || a.type === 0 ? !0 : i.type === 2 ? a.type === 2 : i.id === y;
  }
  s.match = f;
  function m(i) {
    switch (i.type) {
      case 0:
        return "*";
      case 1:
        return `:${i.id}`;
      case 2:
        return "host";
      default:
        return "?";
    }
  }
  s.toString = m;
  function p(i) {
    return i === "*" ? r() : i === "host" ? n() : i.startsWith(":") ? _(i.slice(1)) : null;
  }
  s.parse = p;
})(c || (c = {}));
var d;
((s) => {
  function e(t) {
    return {
      emitter() {
        return t.emitter;
      },
      get: t.get,
      requestObject(r, n) {
        return t.objectsEmitter.on(r, n), n(t.get(r)), {
          destroy() {
            t.objectsEmitter.off(r, n);
          }
        };
      }
    };
  }
  s.make = e;
})(d || (d = {}));
var h;
((s) => {
  function e(t, r) {
    return {
      type: t,
      create: (n) => new r(n, t)
    };
  }
  s.create = e;
})(h || (h = {}));
var L = Object.defineProperty, b = (s, e, t) => e in s ? L(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, u = (s, e, t) => (b(s, typeof e != "symbol" ? e + "" : e, t), t);
class l {
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
}
class w {
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
    this._id = e, this._socket = t, this._address = c.broadcast(), this._socket.on("message", this._onMessage);
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
  constructor(e, t, r = !1) {
    o(this, "_id");
    o(this, "_address");
    o(this, "_emitter", new l());
    o(this, "_serverPeer");
    this._id = e, this._address = r ? c.host() : c.to(e), this._serverPeer = new w("SERVER", t), this._serverPeer.emitter().on("message", ({ channel: n, message: _ }) => {
      this._emitter.emit("message", {
        peerId: this._serverPeer.id(),
        channel: n,
        message: _
      });
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
  *peers() {
    yield this._serverPeer;
  }
}
export {
  O as SocketIONetwork
};
