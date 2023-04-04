var p = Object.defineProperty;
var g = (s, e, t) => e in s ? p(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var a = (s, e, t) => (g(s, typeof e != "symbol" ? e + "" : e, t), t);
var u;
((s) => {
  const e = {
    type: 0
    /* Broadcast */
  };
  function t() {
    return e;
  }
  s.broadcast = t;
  function r(n) {
    return { type: 1, id: n };
  }
  s.to = r;
  function i(n, c) {
    return n.type === 0 || c.type === 0 ? !0 : n.id === c.id;
  }
  s.match = i;
  function o(n) {
    switch (n.type) {
      case 0:
        return "*";
      case 1:
        return `:${n.id}`;
      default:
        return "?";
    }
  }
  s.toString = o;
  function h(n) {
    return n === "*" ? t() : n.startsWith(":") ? r(n.slice(1)) : null;
  }
  s.parse = h;
})(u || (u = {}));
var w = Object.defineProperty, y = (s, e, t) => e in s ? w(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, f = (s, e, t) => (y(s, typeof e != "symbol" ? e + "" : e, t), t);
class l {
  constructor() {
    f(this, "_listeners", {}), f(this, "_onceListeners", {});
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
class L {
  constructor(e, t) {
    a(this, "_address");
    a(this, "_emitter");
    a(this, "_id");
    this.network = t, this._id = e, this._address = u.to(e), this._emitter = new l(), t.emitter().on("message", ({ peerId: r, channel: i, message: o }) => this._onMessage(r, i, o));
  }
  emitter() {
    return this._emitter;
  }
  send(e, t, r) {
    const i = {
      originId: this._id,
      address: e,
      data: r
    };
    for (const o of this.network.peers())
      u.match(e, o.address()) && o.send(t, i);
  }
  id() {
    return this._id;
  }
  _onMessage(e, t, r) {
    u.match(r.address, this._address) && this._emitter.emit("message", { message: r, channel: t });
    for (const i of this.network.peers())
      i.id() !== e && u.match(r.address, i.address()) && i.send(t, r);
  }
}
let R = (s = 21) => crypto.getRandomValues(new Uint8Array(s)).reduce((e, t) => (t &= 63, t < 36 ? e += t.toString(36) : t < 62 ? e += (t - 26).toString(36).toUpperCase() : t > 62 ? e += "-" : e += "_", e), "");
function v(s) {
  try {
    const e = s();
    return Promise.resolve(e);
  } catch (e) {
    return Promise.reject(e);
  }
}
var _;
((s) => {
  function e(i, o, h) {
    return { type: 0, id: i, name: o, data: h };
  }
  s.request = e;
  function t(i, o) {
    return { type: 1, id: i, data: o };
  }
  s.response = t;
  function r(i, o) {
    return { type: 2, id: i, reason: o };
  }
  s.error = r;
})(_ || (_ = {}));
class E {
  constructor() {
    a(this, "_emitter", new l());
    a(this, "_handlers", {});
    a(this, "_resultEmitter", new l());
  }
  emitter() {
    return this._emitter;
  }
  handle(e, t) {
    if (this._handlers[e]) {
      console.error(`Cannot handle the same RPC multiple times (${e})`);
      return;
    }
    this._handlers[e] = t;
  }
  request(e, t, r) {
    const i = R(), o = _.request(i, e, r);
    return new Promise((h, n) => {
      let c = setTimeout(() => {
        c = null, this._resultEmitter.emit(i, { type: 2, data: "Timed out" });
      }, 2e4);
      this._resultEmitter.once(i, ({ type: m, data: d }) => {
        c && clearTimeout(c), m === 2 ? n(d) : m === 1 && h(d);
      }), this._emitter.emit("message", { targetId: t, message: o });
    });
  }
  post(e) {
    const t = e.data, r = e.originId;
    switch (t.type) {
      case 0: {
        this._onRequest(t, r);
        break;
      }
      case 1: {
        this._onResponse(t);
        break;
      }
      case 2: {
        this._onError(t);
        break;
      }
    }
  }
  _onRequest(e, t) {
    const { id: r, name: i, data: o } = e, h = this._handlers[i];
    if (!h) {
      console.error(`Received unhandled RPC request '${i}', originated from ${t}`);
      const n = _.error(r, `Unhandled RPC by the receiver ${i}`);
      this._emitter.emit("message", { targetId: t, message: n });
      return;
    }
    v(() => h({ data: o, originId: t })).then((n) => {
      const c = _.response(r, n);
      this._emitter.emit("message", { targetId: t, message: c });
    }).catch((n) => {
      console.error(`Error while handling RPC '${i}':`, n);
      const c = _.error(r, "Receiver got an error while responding");
      this._emitter.emit("message", { targetId: t, message: c });
    });
  }
  _onResponse(e) {
    const { id: t, data: r } = e;
    this._resultEmitter.emit(t, { type: 1, data: r });
  }
  _onError(e) {
    const { id: t, reason: r } = e;
    this._resultEmitter.emit(t, { type: 2, data: r });
  }
}
class q {
  constructor(e, t) {
    a(this, "_rpc");
    a(this, "_emitter", new l());
    a(this, "router");
    this.id = e, this.network = t, this.router = new L(e, t), this.router.emitter().on("message", ({ message: r, channel: i }) => this._onMessage(r, i)), this._rpc = new E(), this._rpc.emitter().on("message", ({ targetId: r, message: i }) => {
      this.router.send(u.to(r), 1, i);
    });
  }
  rpc() {
    return this._rpc;
  }
  emitter() {
    return this._emitter;
  }
  send(e, t) {
    this.router.send(e, 0, t);
  }
  _onMessage(e, t) {
    if (t === 0) {
      this._emitter.emit("message", e);
      return;
    }
    if (t === 1) {
      this._rpc.post(e);
      return;
    }
  }
}
export {
  u as Address,
  q as Application,
  L as Router
};
