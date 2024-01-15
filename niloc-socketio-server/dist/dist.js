var O = Object.defineProperty;
var $ = (r, e, t) => e in r ? O(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var f = (r, e, t) => ($(r, typeof e != "symbol" ? e + "" : e, t), t);
var w;
((r) => {
  const e = Object.freeze({
    type: 0
    /* All */
  }), t = Object.freeze({
    type: 1
    /* Broadcast */
  }), s = Object.freeze({
    type: 3
    /* Host */
  });
  function i() {
    return e;
  }
  r.all = i;
  function n() {
    return t;
  }
  r.broadcast = n;
  function c() {
    return s;
  }
  r.host = c;
  function a(o) {
    return { type: 2, id: o };
  }
  r.to = a;
  function l(o) {
    return { type: 4, get: o };
  }
  r.dynamic = l;
  function x(o) {
    return o.host ? c() : a(o.userId);
  }
  r.fromIdentity = x;
  function b(o, d, _) {
    return d.type === 0 ? !0 : d.type === 1 ? _.userId !== o : d.type === 3 ? _.host : (d.type === 4 ? d.get() : d.id) === _.userId;
  }
  r.match = b;
  function I(o) {
    switch (o.type) {
      case 0:
        return "*";
      case 1:
        return "#";
      case 2:
        return `:${o.id}`;
      case 4:
        return `:${o.get()}`;
      case 3:
        return "host";
      default:
        return "?";
    }
  }
  r.toString = I;
  function D(o) {
    return o === "*" ? i() : o === "#" ? n() : o === "host" ? c() : o.startsWith(":") ? a(o.slice(1)) : null;
  }
  r.parse = D;
})(w || (w = {}));
var k = Object.defineProperty, j = (r, e, t) => e in r ? k(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, y = (r, e, t) => (j(r, typeof e != "symbol" ? e + "" : e, t), t);
class u {
  constructor() {
    y(this, "_listeners", {}), y(this, "_onceListeners", {});
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
class q extends u {
  send(e, t, s) {
    for (const i of this.peers())
      i.identity.userId !== s && i.match(t.address, s) && i.send(e, t);
  }
  connect(e) {
    e.on("message", ({ channel: t, message: s }) => {
      this.emit("message", {
        peerId: e.identity.userId,
        channel: t,
        message: s
      });
    });
  }
}
class A extends u {
  constructor(e) {
    super(), this.identity = e, this._closed = !1;
  }
  get closed() {
    return this._closed;
  }
  match(e, t) {
    return w.match(t, e, this.identity);
  }
  destroy() {
    this._closed || (this._closed = !0, this.emit("destroy", this), this.removeAllListeners());
  }
}
var m;
((r) => {
  function e(t, s) {
    const i = [], n = new u();
    t.addListener((c) => {
      const [a, l] = c.data;
      n.emit(a.toString(), { ...c, data: l });
    });
    for (let c = 0; c < s; c++)
      i.push({
        post: (a, l) => {
          t.post(a, [c, l]);
        },
        addListener: (a) => {
          n.on(c.toString(), a);
        },
        removeListener: (a) => {
          n.off(c.toString(), a);
        }
      });
    return i;
  }
  r.split = e;
})(m || (m = {}));
class p {
  static deserialize(e) {
    return new p(e.userId, e.host);
  }
  constructor(e, t = !1) {
    this.host = t, this.userId = e;
  }
  serialize() {
    return {
      userId: this.userId,
      host: this.host
    };
  }
}
var g = /* @__PURE__ */ ((r) => (r[r.All = 0] = "All", r[r.Host = 1] = "Host", r[r.Owner = 2] = "Owner", r))(g || {});
((r) => {
  function e(t, s) {
    switch (t.authority) {
      case 0:
        return !0;
      case 1:
        return s.host;
      case 2:
        return s.userId === t.id;
    }
    return !1;
  }
  r.allows = e;
})(g || (g = {}));
class L {
  constructor() {
    this._string = "";
  }
  write(e) {
    this._string += e;
  }
  toString(e) {
    return "  ".repeat(e) + this._string;
  }
}
class S {
  constructor() {
    this._indent = 0, this._string = "", this._line = new L();
  }
  write(e) {
    this._line.write(e);
  }
  writeLine(e) {
    this._line.write(e), this.nextLine();
  }
  nextLine() {
    this._string += this._line.toString(this._indent) + `
`, this._line = new L();
  }
  startIndent() {
    this._indent++;
  }
  endIndent() {
    this._indent--;
  }
  toString() {
    return this.nextLine(), this._string;
  }
}
class h extends u {
  constructor() {
    super(...arguments), this._index = -1, this.dirty = !1;
  }
  static setIndex(e, t) {
    e._index = t;
  }
  static __init(e, t) {
    e.changeRequester = t.changeRequester, e.model = t.model, e.onInit();
  }
  static toString(e) {
    const t = new S();
    return this.writeString(e, t), t.toString();
  }
  static isDirty(e) {
    return e.dirty;
  }
  static writeString(e, t) {
    e.toString(t);
  }
  static write(e, t) {
    e.write(t);
  }
  static read(e, t) {
    e.read(t);
  }
  static writeDelta(e, t) {
    e.writeDelta(t);
  }
  static readDelta(e, t) {
    e.readDelta(t);
  }
  static resetDelta(e) {
    e.resetDelta(), e.dirty = !1;
  }
  static register(e, t) {
    const s = [...e];
    for (const i of s)
      i.on("change", t);
    return () => {
      for (const i of s)
        i.off("change", t);
    };
  }
  get index() {
    return this._index;
  }
  readDelta(e) {
    this.read(e);
  }
  writeDelta(e) {
    this.write(e);
  }
  resetDelta() {
  }
  changed() {
    var e;
    this.dirty = !0, (e = this.changeRequester) == null || e.change(this._index), this.emit("change", this.get());
  }
  // Method called once field is initialized
  onInit() {
  }
  toString(e) {
    e.writeLine("???");
  }
}
class M extends h {
  constructor(e) {
    super(), this.value = e;
  }
  get() {
    return this.value;
  }
  set(e) {
    this.equals(this.value, e) || (this.value = e, this.changed());
  }
  read(e) {
    this.readValue(e), this.emit("change", this.get());
  }
  write(e) {
    e.writeJSON(this.value);
  }
  equals(e, t) {
    return e === t;
  }
  toString(e) {
    switch (typeof this.value) {
      case "function":
        e.writeLine("[Function]");
        break;
      case "object":
        e.write(JSON.stringify(this.value));
        break;
      default:
        e.writeLine("" + this.value);
        break;
    }
  }
}
class z extends M {
  readValue(e) {
    this.value = e.readBoolean();
  }
  writeValue(e) {
    e.writeBoolean(this.value);
  }
}
function R(r) {
  return function(e, t) {
    const s = "$" + t, i = Symbol(t);
    Object.defineProperty(e, t, {
      get() {
        return this[s].get();
      },
      set(n) {
        this[s].set(n);
      }
    }), Object.defineProperty(e, s, {
      get() {
        let n = this[i];
        return n || (n = r(), this[i] = n), n;
      },
      enumerable: !0
    });
  };
}
function F(r = !1) {
  return R(() => new z(r));
}
var N = Object.defineProperty, P = Object.getOwnPropertyDescriptor, J = (r, e, t, s) => {
  for (var i = s > 1 ? void 0 : s ? P(e, t) : e, n = r.length - 1, c; n >= 0; n--)
    (c = r[n]) && (i = (s ? c(e, t, i) : c(i)) || i);
  return s && i && N(e, t, i), i;
};
class C extends u {
  constructor(e) {
    super(), this.authority = g.All, this._fields = null, this._registerMap = /* @__PURE__ */ new Map(), this._onDeletedChange = () => {
      this.deleted && (this.emit("delete"), this.onDelete(), this.changeRequester.delete(), this.removeAllListeners());
    }, this.id = e, this.register("deleted", this._onDeletedChange);
  }
  static __init(e, t) {
    e.changeRequester = t.changeRequester, e.model = t.model;
    for (const s of e.fields())
      h.__init(s, t);
    e.onInit();
  }
  static toString(e) {
    const t = new S();
    return this.writeString(e, t), t.toString();
  }
  static writeString(e, t) {
    t.writeLine(`${e.constructor.name}: ${e.id} {`), t.startIndent();
    for (const s of e.fields())
      h.writeString(s, t);
    t.endIndent(), t.writeLine("}");
  }
  static write(e, t) {
    e.write(t);
  }
  static read(e, t) {
    e.read(t);
  }
  static isDirty(e) {
    for (const t of e.fields())
      if (h.isDirty(t))
        return !0;
    return !1;
  }
  static getDirtyFields(e) {
    const t = [];
    for (const s of e.fields())
      h.isDirty(s) && t.push(s);
    return t;
  }
  fields() {
    return this._fields || (this._fields = this._initFields()), this._fields;
  }
  read(e) {
    for (const t of this.fields())
      h.read(t, e);
  }
  write(e) {
    for (const t of this.fields())
      h.write(t, e);
  }
  send() {
    this.changeRequester.send();
  }
  registerAll(e) {
    if (this._registerMap.has(e))
      return;
    const t = h.register(this.fields(), e);
    this._registerMap.set(e, t);
  }
  unregisterAll(e) {
    this._registerMap.has(e) && (this._registerMap.get(e)(), this._registerMap.delete(e));
  }
  register(e, t) {
    const s = this[e];
    if (s && s instanceof h) {
      s.on("change", t);
      return;
    }
    const i = `$${e}`, n = this[i];
    if (n && n instanceof h) {
      n.on("change", t);
      return;
    }
    throw new Error(`Field ${e} does not exist on type ${this.constructor.name}`);
  }
  unregister(e, t) {
    const s = this[e];
    if (s && s instanceof h) {
      s.off("change", t);
      return;
    }
    const i = `$${e}`, n = this[i];
    if (n && n instanceof h) {
      n.off("change", t);
      return;
    }
    throw new Error(`Field ${e} does not exist on type ${this.constructor.name}`);
  }
  delete() {
    this.deleted || (this.deleted = !0);
  }
  // Method called when the object is created and everything is setup
  onInit() {
  }
  onDelete() {
  }
  _initFields() {
    const e = [];
    for (const t in this) {
      const s = this[t];
      s instanceof h && (h.setIndex(s, e.length), e.push(s));
    }
    return e;
  }
}
J([
  F(!1)
], C.prototype, "deleted", 2);
var v;
((r) => {
  function e(t, s) {
    return { id: t, args: s };
  }
  r.make = e;
})(v || (v = {}));
class B extends A {
  constructor(t, s) {
    super(t);
    f(this, "_socket");
    f(this, "_onMessage", (t, s) => {
      if (typeof t == "number" && typeof s == "string")
        try {
          const i = JSON.parse(s);
          if (!i)
            return;
          this.emit("message", { channel: t, message: i });
        } catch (i) {
          console.error(`Error receiving network message (${this.identity.userId})`, i);
        }
    });
    this._socket = s, s.on("message", this._onMessage), s.on("disconnect", () => this.destroy());
  }
  send(t, s) {
    this._socket.send(t, JSON.stringify(s));
  }
  destroy() {
    super.destroy(), this._socket.removeAllListeners();
  }
}
class V extends q {
  constructor() {
    super(...arguments);
    f(this, "_peers", /* @__PURE__ */ new Map());
  }
  peers() {
    return this._peers.values();
  }
  addSocket(t, s, i) {
    if (this._peers.has(s))
      return;
    const n = new B(new p(s, i), t);
    n.on("destroy", () => {
      this._peers.get(s) === n && this._peers.delete(s);
    }), this._peers.set(s, n), this.connect(n);
  }
}
export {
  V as SocketIONetwork
};
