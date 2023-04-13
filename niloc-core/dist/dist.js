var g = Object.defineProperty;
var w = (s, e, t) => e in s ? g(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var o = (s, e, t) => (w(s, typeof e != "symbol" ? e + "" : e, t), t);
var a;
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
  function n(i, h) {
    return i.type === 0 || h.type === 0 ? !0 : i.id === h.id;
  }
  s.match = n;
  function u(i) {
    switch (i.type) {
      case 0:
        return "*";
      case 1:
        return `:${i.id}`;
      default:
        return "?";
    }
  }
  s.toString = u;
  function c(i) {
    return i === "*" ? t() : i.startsWith(":") ? r(i.slice(1)) : null;
  }
  s.parse = c;
})(a || (a = {}));
var R = Object.defineProperty, v = (s, e, t) => e in s ? R(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, m = (s, e, t) => (v(s, typeof e != "symbol" ? e + "" : e, t), t);
class l {
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
class y {
  constructor(e, t) {
    o(this, "_address");
    o(this, "_emitter");
    o(this, "_id");
    this.network = t, this._id = e, this._address = a.to(e), this._emitter = new l(), t.emitter().on("message", ({ peerId: r, channel: n, message: u }) => this._onMessage(r, n, u));
  }
  emitter() {
    return this._emitter;
  }
  send(e, t, r) {
    const n = {
      originId: this._id,
      address: e,
      data: r
    };
    for (const u of this.network.peers())
      a.match(e, u.address()) && u.send(t, n);
  }
  id() {
    return this._id;
  }
  _onMessage(e, t, r) {
    a.match(r.address, this._address) && this._emitter.emit("message", { message: r, channel: t });
    for (const n of this.network.peers())
      n.id() !== e && a.match(r.address, n.address()) && n.send(t, r);
  }
}
let E = (s = 21) => crypto.getRandomValues(new Uint8Array(s)).reduce((e, t) => (t &= 63, t < 36 ? e += t.toString(36) : t < 62 ? e += (t - 26).toString(36).toUpperCase() : t > 62 ? e += "-" : e += "_", e), "");
function C(s) {
  try {
    const e = s();
    return Promise.resolve(e);
  } catch (e) {
    return Promise.reject(e);
  }
}
var _;
((s) => {
  function e(n, u, c) {
    return { type: 0, id: n, name: u, data: c };
  }
  s.request = e;
  function t(n, u) {
    return { type: 1, id: n, data: u };
  }
  s.response = t;
  function r(n, u) {
    return { type: 2, id: n, reason: u };
  }
  s.error = r;
})(_ || (_ = {}));
class P {
  constructor() {
    o(this, "_emitter", new l());
    o(this, "_handlers", {});
    o(this, "_resultEmitter", new l());
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
    const n = E(), u = _.request(n, e, r);
    return new Promise((c, i) => {
      let h = setTimeout(() => {
        h = null, this._resultEmitter.emit(n, { type: 2, data: "Timed out" });
      }, 2e4);
      this._resultEmitter.once(n, ({ type: p, data: d }) => {
        h && clearTimeout(h), p === 2 ? i(d) : p === 1 && c(d);
      }), this._emitter.emit("message", { targetId: t, message: u });
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
    const { id: r, name: n, data: u } = e, c = this._handlers[n];
    if (!c) {
      console.error(`Received unhandled RPC request '${n}', originated from ${t}`);
      const i = _.error(r, `Unhandled RPC by the receiver ${n}`);
      this._emitter.emit("message", { targetId: t, message: i });
      return;
    }
    C(() => c({ data: u, originId: t })).then((i) => {
      const h = _.response(r, i);
      this._emitter.emit("message", { targetId: t, message: h });
    }).catch((i) => {
      console.error(`Error while handling RPC '${n}':`, i);
      const h = _.error(r, "Receiver got an error while responding");
      this._emitter.emit("message", { targetId: t, message: h });
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
class S {
  constructor() {
    o(this, "_inputListener", null);
    o(this, "_outputListeners", /* @__PURE__ */ new Set());
  }
  postOutput(...e) {
    for (const t of this._outputListeners)
      t(...e);
  }
  addOutputListener(e) {
    this._outputListeners.add(e);
  }
  removeOutputListener(e) {
    this._outputListeners.delete(e);
  }
  postInput(...e) {
    var t;
    (t = this._inputListener) == null || t.call(this, ...e);
  }
  setInputListener(e) {
    this._inputListener = e;
  }
}
class O {
  constructor(e) {
    o(this, "_channel");
    o(this, "_mpsc", new S());
    o(this, "_input");
    o(this, "_output");
    this._channel = e, this._input = {
      post: (t, r) => this._mpsc.postInput(t, r),
      addListener: (t) => this._mpsc.addOutputListener(t),
      removeListener: (t) => this._mpsc.removeOutputListener(t)
    }, this._output = {
      post: (t) => this._mpsc.postOutput(t),
      setListener: (t) => this._mpsc.setInputListener(t)
    };
  }
  channel() {
    return this._channel;
  }
  input() {
    return this._input;
  }
  output() {
    return this._output;
  }
}
var L = /* @__PURE__ */ ((s) => (s[s.Data = 0] = "Data", s[s.RPC = 1] = "RPC", s))(L || {});
const I = Object.keys(L).length / 2, f = (s) => s + I;
class q {
  constructor(e, t) {
    o(this, "_rpc");
    o(this, "_emitter", new l());
    o(this, "_channels", {});
    o(this, "router");
    this.id = e, this.network = t, this.router = new y(e, t), this.router.emitter().on("message", ({ message: r, channel: n }) => this._onMessage(r, n)), this._rpc = new P(), this._rpc.emitter().on("message", ({ targetId: r, message: n }) => {
      this.router.send(a.to(r), 1, n);
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
  channel(e) {
    const t = f(e);
    return this._channels[t] || (this._channels[t] = this._createChannel(e)), this._channels[t].input();
  }
  _createChannel(e) {
    const t = new O(e);
    return t.output().setListener((r, n) => {
      this.router.send(r, f(e), n);
    }), t;
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
    this._channels[t] && this._channels[t].output().post(e);
  }
}
export {
  a as Address,
  q as Application,
  y as Router
};
