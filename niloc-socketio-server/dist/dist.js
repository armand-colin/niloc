var b = Object.defineProperty;
var k = (i, e, t) => e in i ? b(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t;
var d = (i, e, t) => (k(i, typeof e != "symbol" ? e + "" : e, t), t);
var p;
((i) => {
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
  function r() {
    return e;
  }
  i.all = r;
  function n() {
    return t;
  }
  i.broadcast = n;
  function o() {
    return s;
  }
  i.host = o;
  function h(c) {
    return { type: 2, id: c };
  }
  i.to = h;
  function f(c) {
    return { type: 4, get: c };
  }
  i.dynamic = f;
  function O(c) {
    return c.host ? o() : h(c.userId);
  }
  i.fromIdentity = O;
  function I(c, l, g) {
    return g.address.type === 1 || g.address.type === 0 || l.type === 0 ? !0 : l.type === 1 ? g.id !== c : l.type === 3 ? g.address.type === 3 : (l.type === 4 ? l.get() : l.id) === g.id;
  }
  i.match = I;
  function x(c) {
    switch (c.type) {
      case 0:
        return "*";
      case 1:
        return "#";
      case 2:
        return `:${c.id}`;
      case 4:
        return `:${c.get()}`;
      case 3:
        return "host";
      default:
        return "?";
    }
  }
  i.toString = x;
  function D(c) {
    return c === "*" ? r() : c === "#" ? n() : c === "host" ? o() : c.startsWith(":") ? h(c.slice(1)) : null;
  }
  i.parse = D;
})(p || (p = {}));
class $ {
  constructor(e, t = p.fromIdentity(e)) {
    this.identity = e, this.address = t;
  }
  get id() {
    return this.identity.userId;
  }
  get host() {
    return this.identity.host;
  }
}
var E = Object.defineProperty, j = (i, e, t) => e in i ? E(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t, y = (i, e, t) => (j(i, typeof e != "symbol" ? e + "" : e, t), t);
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
var m;
((i) => {
  function e(t, s) {
    const r = [], n = new u();
    t.addListener((o) => {
      const [h, f] = o.data;
      n.emit(h.toString(), { ...o, data: f });
    });
    for (let o = 0; o < s; o++)
      r.push({
        post: (h, f) => {
          t.post(h, [o, f]);
        },
        addListener: (h) => {
          n.on(o.toString(), h);
        },
        removeListener: (h) => {
          n.off(o.toString(), h);
        }
      });
    return r;
  }
  i.split = e;
})(m || (m = {}));
class _ {
  static deserialize(e) {
    return new _(e.userId, e.host);
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
var w = /* @__PURE__ */ ((i) => (i[i.All = 0] = "All", i[i.Host = 1] = "Host", i[i.Owner = 2] = "Owner", i))(w || {});
((i) => {
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
  i.allows = e;
})(w || (w = {}));
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
class v {
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
class a extends u {
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
    const t = new v();
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
    for (const r of s)
      r.on("change", t);
    return () => {
      for (const r of s)
        r.off("change", t);
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
class q extends a {
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
class M extends q {
  readValue(e) {
    this.value = e.readBoolean();
  }
  writeValue(e) {
    e.writeBoolean(this.value);
  }
}
function R(i) {
  return function(e, t) {
    const s = "$" + t, r = Symbol(t);
    Object.defineProperty(e, t, {
      get() {
        return this[s].get();
      },
      set(n) {
        this[s].set(n);
      }
    }), Object.defineProperty(e, s, {
      get() {
        let n = this[r];
        return n || (n = i(), this[r] = n), n;
      },
      enumerable: !0
    });
  };
}
function A(i = !1) {
  return R(() => new M(i));
}
var z = Object.defineProperty, F = Object.getOwnPropertyDescriptor, P = (i, e, t, s) => {
  for (var r = s > 1 ? void 0 : s ? F(e, t) : e, n = i.length - 1, o; n >= 0; n--)
    (o = i[n]) && (r = (s ? o(e, t, r) : o(r)) || r);
  return s && r && z(e, t, r), r;
};
class N extends u {
  constructor(e) {
    super(), this.authority = w.All, this._fields = null, this._registerMap = /* @__PURE__ */ new Map(), this._onDeletedChange = () => {
      this.deleted && (this.emit("delete"), this.onDelete(), this.changeRequester.delete(), this.removeAllListeners());
    }, this.id = e, this.register("deleted", this._onDeletedChange);
  }
  static __init(e, t) {
    e.changeRequester = t.changeRequester, e.model = t.model;
    for (const s of e.fields())
      a.__init(s, t);
    e.onInit();
  }
  static toString(e) {
    const t = new v();
    return this.writeString(e, t), t.toString();
  }
  static writeString(e, t) {
    t.writeLine(`${e.constructor.name}: ${e.id} {`), t.startIndent();
    for (const s of e.fields())
      a.writeString(s, t);
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
      if (a.isDirty(t))
        return !0;
    return !1;
  }
  static getDirtyFields(e) {
    const t = [];
    for (const s of e.fields())
      a.isDirty(s) && t.push(s);
    return t;
  }
  fields() {
    return this._fields || (this._fields = this._initFields()), this._fields;
  }
  read(e) {
    for (const t of this.fields())
      a.read(t, e);
  }
  write(e) {
    for (const t of this.fields())
      a.write(t, e);
  }
  send() {
    this.changeRequester.send();
  }
  registerAll(e) {
    if (this._registerMap.has(e))
      return;
    const t = a.register(this.fields(), e);
    this._registerMap.set(e, t);
  }
  unregisterAll(e) {
    this._registerMap.has(e) && (this._registerMap.get(e)(), this._registerMap.delete(e));
  }
  register(e, t) {
    const s = this[e];
    if (s && s instanceof a) {
      s.on("change", t);
      return;
    }
    const r = `$${e}`, n = this[r];
    if (n && n instanceof a) {
      n.on("change", t);
      return;
    }
    throw new Error(`Field ${e} does not exist on type ${this.constructor.name}`);
  }
  unregister(e, t) {
    const s = this[e];
    if (s && s instanceof a) {
      s.off("change", t);
      return;
    }
    const r = `$${e}`, n = this[r];
    if (n && n instanceof a) {
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
      s instanceof a && (a.setIndex(s, e.length), e.push(s));
    }
    return e;
  }
}
P([
  A(!1)
], N.prototype, "deleted", 2);
var S;
((i) => {
  function e(t, s) {
    return { id: t, args: s };
  }
  i.make = e;
})(S || (S = {}));
class V extends $ {
  constructor(t, s) {
    super(t);
    d(this, "_emitter", new u());
    d(this, "_socketIOEmitter", new u());
    d(this, "_socket");
    d(this, "_onMessage", (t, s) => {
      if (typeof t == "number" && typeof s == "string")
        try {
          const r = JSON.parse(s);
          if (!r)
            return;
          this._emitter.emit("message", { channel: t, message: r });
        } catch (r) {
          console.error(`Error receiving network message (${this.id})`, r);
        }
    });
    this._socket = s, s.on("message", this._onMessage), s.on("disconnect", () => {
      this.destroy(), this._socketIOEmitter.emit("disconnect");
    });
  }
  get socketIOEmitter() {
    return this._socketIOEmitter;
  }
  send(t, s) {
    this._socket.send(t, JSON.stringify(s));
  }
  addListener(t) {
    this._emitter.on("message", t);
  }
  removeListener(t) {
    this._emitter.off("message", t);
  }
  destroy() {
    this._socket.removeAllListeners();
  }
}
class B extends u {
  constructor(t) {
    super();
    d(this, "_peers", /* @__PURE__ */ new Map());
    d(this, "_identity");
    this._identity = new _("SERVER", (t == null ? void 0 : t.host) ?? !1);
  }
  identity() {
    return this._identity;
  }
  peers() {
    return this._peers.values();
  }
  addSocket(t, s, r) {
    if (this._peers.has(s))
      return;
    const n = new V(new _(s, r), t);
    n.socketIOEmitter.on("disconnect", () => {
      this._peers.get(s) === n && this._peers.delete(s);
    }), n.addListener((o) => {
      this.emit("message", { peerId: s, ...o });
    }), this._peers.set(s, n);
  }
}
export {
  B as SocketIONetwork
};
