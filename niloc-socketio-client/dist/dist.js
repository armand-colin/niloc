var g = Object.defineProperty;
var v = (s, e, t) => e in s ? g(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var c = (s, e, t) => (v(s, typeof e != "symbol" ? e + "" : e, t), t);
var b = Object.defineProperty, L = (s, e, t) => e in s ? b(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, a = (s, e, t) => (L(s, typeof e != "symbol" ? e + "" : e, t), t);
class m {
  constructor() {
    a(this, "_listeners", {}), a(this, "_onceListeners", {});
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
var u;
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
  function o(n) {
    return { type: 1, id: n };
  }
  s.to = o;
  function _(n, h) {
    return n.type === 0 || h.address().type === 0 ? !0 : n.type === 2 ? h.address().type === 2 : n.id === h.id();
  }
  s.match = _;
  function p(n) {
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
  s.toString = p;
  function y(n) {
    return n === "*" ? r() : n === "host" ? i() : n.startsWith(":") ? o(n.slice(1)) : null;
  }
  s.parse = y;
})(u || (u = {}));
var d;
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
})(d || (d = {}));
var f;
((s) => {
  function e(t, r) {
    return {
      type: t,
      create: (i) => new r(i, t)
    };
  }
  s.create = e;
})(f || (f = {}));
var l;
((s) => {
  function e(i, o, _) {
    return { type: 0, id: i, name: o, args: _ };
  }
  s.request = e;
  function t(i, o) {
    return { type: 1, id: i, result: o };
  }
  s.response = t;
  function r(i, o) {
    return { type: 2, id: i, reason: o };
  }
  s.error = r;
})(l || (l = {}));
class w {
  constructor(e, t) {
    c(this, "_id");
    c(this, "_address");
    c(this, "_emitter", new m());
    c(this, "_socket");
    c(this, "_onMessage", (e, t) => {
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
    this._id = e, this._socket = t, this._address = u.broadcast(), this._socket.on("message", this._onMessage);
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
  constructor(e) {
    c(this, "_emitter", new m());
    c(this, "_serverPeer");
    this._serverPeer = new w("SERVER", e), this._serverPeer.emitter().on("message", ({ channel: t, message: r }) => {
      this._emitter.emit("message", {
        peerId: this._serverPeer.id(),
        channel: t,
        message: r
      });
    });
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
