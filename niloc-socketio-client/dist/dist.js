var p = Object.defineProperty;
var y = (r, e, t) => e in r ? p(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var o = (r, e, t) => (y(r, typeof e != "symbol" ? e + "" : e, t), t);
var g = Object.defineProperty, b = (r, e, t) => e in r ? g(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, h = (r, e, t) => (b(r, typeof e != "symbol" ? e + "" : e, t), t);
class m {
  constructor() {
    h(this, "_listeners", {}), h(this, "_onceListeners", {});
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
  function s(n) {
    return { type: 1, id: n };
  }
  r.to = s;
  function i(n, d) {
    return n.type === 0 || d.type === 0 ? !0 : n.id === d.id;
  }
  r.match = i;
  function c(n) {
    switch (n.type) {
      case 0:
        return "*";
      case 1:
        return `:${n.id}`;
      default:
        return "?";
    }
  }
  r.toString = c;
  function _(n) {
    return n === "*" ? t() : n.startsWith(":") ? s(n.slice(1)) : null;
  }
  r.parse = _;
})(a || (a = {}));
var u;
((r) => {
  function e(i, c, _) {
    return { type: 0, id: i, name: c, data: _ };
  }
  r.request = e;
  function t(i, c) {
    return { type: 1, id: i, data: c };
  }
  r.response = t;
  function s(i, c) {
    return { type: 2, id: i, reason: c };
  }
  r.error = s;
})(u || (u = {}));
var l;
((r) => {
  function e(t) {
    return {
      emitter() {
        return t.emitter;
      },
      get: t.get,
      requestObject(s, i) {
        return t.objectsEmitter.on(s, i), i(t.get(s)), {
          destroy() {
            t.objectsEmitter.off(s, i);
          }
        };
      }
    };
  }
  r.make = e;
})(l || (l = {}));
var f;
((r) => {
  function e(t, s) {
    return {
      type: t,
      create: (i) => new s(i, t)
    };
  }
  r.create = e;
})(f || (f = {}));
class L {
  constructor(e, t) {
    o(this, "_id");
    o(this, "_address");
    o(this, "_emitter", new m());
    o(this, "_socket");
    o(this, "_onMessage", (e, t) => {
      if (console.log("recv", e, t), typeof e == "number" && typeof t == "string")
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
class w {
  constructor(e, t) {
    o(this, "_id");
    o(this, "_emitter", new m());
    o(this, "_peer");
    this._id = e, this._peer = new L("HOST", t), this._peer.emitter().on("message", ({ channel: s, message: i }) => {
      console.log("NETWORK:message", s, i), this._emitter.emit("message", {
        peerId: this._peer.id(),
        channel: s,
        message: i
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
