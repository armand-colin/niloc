var L = Object.defineProperty;
var O = (s, e, t) => e in s ? L(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var h = (s, e, t) => (O(s, typeof e != "symbol" ? e + "" : e, t), t);
var k = Object.defineProperty, q = (s, e, t) => e in s ? k(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, o = (s, e, t) => (q(s, typeof e != "symbol" ? e + "" : e, t), t), _;
((s) => {
  const e = {
    type: 0
    /* Broadcast */
  }, t = {
    type: 2
    /* Host */
  };
  function i() {
    return e;
  }
  s.broadcast = i;
  function n() {
    return t;
  }
  s.host = n;
  function r(c) {
    return { type: 1, id: c };
  }
  s.to = r;
  function d(c, g) {
    return c.type === 0 || g.address().type === 0 ? !0 : c.type === 2 ? g.address().type === 2 : c.id === g.id();
  }
  s.match = d;
  function I(c) {
    switch (c.type) {
      case 0:
        return "*";
      case 1:
        return `:${c.id}`;
      case 2:
        return "host";
      default:
        return "?";
    }
  }
  s.toString = I;
  function S(c) {
    return c === "*" ? i() : c === "host" ? n() : c.startsWith(":") ? r(c.slice(1)) : null;
  }
  s.parse = S;
})(_ || (_ = {}));
var f;
((s) => {
  function e() {
    return (n, r) => r.host;
  }
  s.host = e;
  function t() {
    return (n, r) => n.id() === r.userId;
  }
  s.own = t;
  function i(n, r, d) {
    return n === !0 || n(r, d);
  }
  s.allows = i;
})(f || (f = {}));
class m {
  constructor() {
    o(this, "_string", "");
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
    o(this, "_indent", 0), o(this, "_string", ""), o(this, "_line", new m());
  }
  write(e) {
    this._line.write(e);
  }
  writeLine(e) {
    this._line.write(e), this.nextLine();
  }
  nextLine() {
    this._string += this._line.toString(this._indent) + `
`, this._line = new m();
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
class a {
  constructor() {
    o(this, "_index", -1), o(this, "_changeRequester", null), o(this, "_emitter", new u());
  }
  static setIndex(e, t) {
    e._index = t;
  }
  static setChangeRequester(e, t) {
    e._changeRequester = t, e.onChangeRequester(t);
  }
  static setModelHandle(e, t) {
    e.onModelHandle(t);
  }
  static toString(e) {
    const t = new v();
    return this.write(e, t), t.toString();
  }
  static write(e, t) {
    e.toString(t);
  }
  index() {
    return this._index;
  }
  emitter() {
    return this._emitter;
  }
  readChange(e) {
    this.read(e);
  }
  writeChange(e) {
    this.write(e);
  }
  changed() {
    var e;
    (e = this._changeRequester) == null || e.change(this._index), this._emitter.emit("changed");
  }
  onChangeRequester(e) {
  }
  onModelHandle(e) {
  }
  toString(e) {
    e.writeLine("???");
  }
}
class l {
  constructor(e, t) {
    o(this, "_id"), o(this, "_type"), o(this, "_fields", null), this._id = e, this._type = t;
  }
  static setChangeRequester(e, t) {
    for (const i of e.fields())
      a.setChangeRequester(i, t);
  }
  static setModelHandle(e, t) {
    for (const i of e.fields())
      a.setModelHandle(i, t);
  }
  static toString(e) {
    const t = new v();
    return this.write(e, t), t.toString();
  }
  static write(e, t) {
    t.writeLine(`${e.type()}: ${e.id()} {`), t.startIndent();
    for (const i of e.fields())
      a.write(i, t);
    t.endIndent(), t.writeLine("}");
  }
  id() {
    return this._id;
  }
  type() {
    return this._type;
  }
  fields() {
    return this._fields || (this._fields = this._initFields()), this._fields;
  }
  read(e) {
    for (const t of this.fields())
      t.read(e);
  }
  write(e) {
    for (const t of this.fields())
      t.write(e);
  }
  _initFields() {
    const e = [];
    for (const t in this) {
      const i = this[t];
      i instanceof a && (a.setIndex(i, e.length), e.push(i));
    }
    return e;
  }
}
var b;
((s) => {
  function e(t) {
    return {
      emitter() {
        return t.emitter;
      },
      get: t.get,
      requestObject(i, n) {
        return t.objectsEmitter.on(i, n), n(t.get(i)), {
          destroy() {
            t.objectsEmitter.off(i, n);
          }
        };
      }
    };
  }
  s.make = e;
})(b || (b = {}));
var w;
((s) => {
  function e(t, i, n) {
    return {
      type: t,
      create: (r) => new i(r, t),
      authority: n ?? !0
    };
  }
  s.create = e;
})(w || (w = {}));
class x extends a {
  constructor(e) {
    super(), o(this, "_value"), this._value = e;
  }
  get() {
    return this._value;
  }
  set(e) {
    this._value = e, this.changed();
  }
  read(e) {
    this._value = e.readJSON(), this.emitter().emit("changed");
  }
  write(e) {
    e.writeJSON(this._value);
  }
  toString(e) {
    switch (typeof this._value) {
      case "function":
        e.writeLine("[Function]");
        break;
      case "object":
        e.write(JSON.stringify(this._value));
        break;
      default:
        e.writeLine("" + this._value);
        break;
    }
  }
}
class H extends a {
  constructor(e, t) {
    super(), o(this, "_object"), o(this, "_changes", []), this._object = e.create(t ?? "sub");
  }
  get() {
    return this._object;
  }
  read(e) {
    this._object.read(e), this.emitter().emit("changed");
  }
  write(e) {
    this._object.write(e);
  }
  readChange(e) {
    const t = e.readInt();
    for (let i = 0; i < t; i++) {
      const n = e.readInt();
      this._object.fields()[n].readChange(e);
    }
    this.emitter().emit("changed");
  }
  writeChange(e) {
    const t = this._changes.length;
    e.writeInt(t);
    for (const i of this._changes)
      e.writeInt(i), this._object.fields()[i].writeChange(e);
    this._changes = [];
  }
  onModelHandle(e) {
    l.setModelHandle(this._object, e);
  }
  onChangeRequester(e) {
    l.setChangeRequester(this._object, {
      change: (t) => {
        this._changes.push(t), e.change(this.index()), this.emitter().emit("changed");
      }
    });
  }
  toString(e) {
    l.write(this._object, e);
  }
}
class R extends a {
  constructor(e) {
    super(), o(this, "_objectId"), o(this, "_object", null), o(this, "_modelHandle", null), o(this, "_objectRequest", null), this._objectId = e;
  }
  read(e) {
    const t = e.readJSON();
    t !== this._objectId && (this._setObjectId(t), this.emitter().emit("changed"));
  }
  write(e) {
    e.writeJSON(this._objectId);
  }
  set(e) {
    const t = (e == null ? void 0 : e.id()) ?? null;
    t !== this._objectId && (this._setObjectId(t), this.changed());
  }
  get() {
    return this._object;
  }
  _setObjectId(e) {
    var t, i;
    (t = this._objectRequest) == null || t.destroy(), this._objectId = e, this._object = null, e ? this._objectRequest = ((i = this._modelHandle) == null ? void 0 : i.requestObject(e, (n) => {
      this._object = n;
    })) ?? null : this._objectRequest = null, this.emitter().emit("changed");
  }
  onModelHandle(e) {
    this._modelHandle = e, this._objectId && this._setObjectId(this._objectId);
  }
  toString(e) {
    e.write("ref "), this._object ? l.write(this._object, e) : e.writeLine(`${this._objectId} (null)`);
  }
}
class C extends a {
  constructor() {
    super(...arguments), o(this, "_objects", /* @__PURE__ */ new Map()), o(this, "_modelHandle", null);
  }
  add(e) {
    this._objects.set(e.id(), e), this.changed();
  }
  remove(e) {
    this._objects.delete(e.id()), this.changed();
  }
  has(e) {
    return this._objects.has(e.id());
  }
  *values() {
    for (const e of this._objects.values())
      e !== null && (yield e);
  }
  read(e) {
    var t;
    const i = e.readInt();
    this._objects.clear();
    for (let n = 0; n < i; n++) {
      const r = e.readString();
      this._objects.set(r, ((t = this._modelHandle) == null ? void 0 : t.get(r)) ?? null);
    }
    this.emitter().emit("changed");
  }
  write(e) {
    e.writeInt(this._objects.size);
    for (const t of this._objects.keys())
      e.writeString(t);
  }
  onModelHandle(e) {
    this._modelHandle = e, this._modelHandle.emitter().on("created", (t) => {
      const i = t.id();
      this._objects.has(i) && this._objects.set(i, t), this.emitter().emit("changed");
    });
  }
}
var j;
((s) => {
  function e(r) {
    return new x(r);
  }
  s.any = e;
  function t(r) {
    return new R(r);
  }
  s.ref = t;
  function i(r) {
    return new H(r);
  }
  s.object = i;
  function n() {
    return new C();
  }
  s.refSet = n;
})(j || (j = {}));
var p;
((s) => {
  function e(n, r, d) {
    return { type: 0, id: n, name: r, args: d };
  }
  s.request = e;
  function t(n, r) {
    return { type: 1, id: n, result: r };
  }
  s.response = t;
  function i(n, r) {
    return { type: 2, id: n, reason: r };
  }
  s.error = i;
})(p || (p = {}));
var M = Object.defineProperty, N = (s, e, t) => e in s ? M(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, y = (s, e, t) => (N(s, typeof e != "symbol" ? e + "" : e, t), t);
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
      for (const i of [...this._listeners[e]])
        i(t);
    if (this._onceListeners[e]) {
      for (const i of [...this._onceListeners[e]])
        i(t);
      delete this._onceListeners[e];
    }
  }
  removeAllListeners() {
    this._listeners = {}, this._onceListeners = {};
  }
}
class E {
  constructor(e, t, i) {
    h(this, "_id");
    h(this, "_address");
    h(this, "_emitter", new u());
    h(this, "_socketIOEmitter", new u());
    h(this, "_socket");
    h(this, "_onMessage", (e, t) => {
      if (typeof e == "number" && typeof t == "string")
        try {
          const i = JSON.parse(t);
          if (!i)
            return;
          this._emitter.emit("message", { channel: e, message: i });
        } catch (i) {
          console.error(`Error receiving network message (${this._id})`, i);
        }
    });
    this._id = t, this._address = i ? _.host() : _.to(t), this._socket = e, e.on("message", this._onMessage), e.on("disconnect", () => {
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
class $ {
  constructor() {
    h(this, "_peers", /* @__PURE__ */ new Map());
    h(this, "_emitter", new u());
  }
  peers() {
    return this._peers.values();
  }
  emitter() {
    return this._emitter;
  }
  addSocket(e, t, i) {
    if (this._peers.has(t))
      return;
    const n = new E(e, t, i);
    n.socketIOEmitter().on("disconnect", () => {
      this._peers.get(t) === n && this._peers.delete(t);
    }), n.emitter().on("message", (r) => {
      this._emitter.emit("message", { peerId: t, ...r });
    }), this._peers.set(t, n);
  }
}
export {
  $ as SocketIONetwork
};
