var q = Object.defineProperty;
var x = (s, e, t) => e in s ? q(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var l = (s, e, t) => (x(s, typeof e != "symbol" ? e + "" : e, t), t);
var R = Object.defineProperty, H = (s, e, t) => e in s ? R(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, o = (s, e, t) => (H(s, typeof e != "symbol" ? e + "" : e, t), t), b;
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
  function r(h) {
    return { type: 1, id: h };
  }
  s.to = r;
  function c(h, f) {
    return h.type === 0 || f.address().type === 0 ? !0 : h.type === 2 ? f.address().type === 2 : h.id === f.id();
  }
  s.match = c;
  function d(h) {
    switch (h.type) {
      case 0:
        return "*";
      case 1:
        return `:${h.id}`;
      case 2:
        return "host";
      default:
        return "?";
    }
  }
  s.toString = d;
  function u(h) {
    return h === "*" ? i() : h === "host" ? n() : h.startsWith(":") ? r(h.slice(1)) : null;
  }
  s.parse = u;
})(b || (b = {}));
var k = Object.defineProperty, C = (s, e, t) => e in s ? k(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, m = (s, e, t) => (C(s, typeof e != "symbol" ? e + "" : e, t), t);
class g {
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
var w;
((s) => {
  function e(t, i) {
    const n = [], r = new g();
    t.addListener((c) => {
      const [d, u] = c.data;
      r.emit(d.toString(), { ...c, data: u });
    });
    for (let c = 0; c < i; c++)
      n.push({
        post: (d, u) => {
          t.post(d, [c, u]);
        },
        addListener: (d) => {
          r.on(c.toString(), d);
        },
        removeListener: (d) => {
          r.off(c.toString(), d);
        }
      });
    return n;
  }
  s.split = e;
})(w || (w = {}));
var j;
((s) => {
  function e() {
    return (n, r) => r.host;
  }
  s.host = e;
  function t() {
    return (n, r) => n.id() === r.userId;
  }
  s.own = t;
  function i(n, r, c) {
    return n === !0 || n(r, c);
  }
  s.allows = i;
})(j || (j = {}));
class p {
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
class O {
  constructor() {
    o(this, "_indent", 0), o(this, "_string", ""), o(this, "_line", new p());
  }
  write(e) {
    this._line.write(e);
  }
  writeLine(e) {
    this._line.write(e), this.nextLine();
  }
  nextLine() {
    this._string += this._line.toString(this._indent) + `
`, this._line = new p();
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
    o(this, "_index", -1), o(this, "_changeRequester", null), o(this, "_emitter", new g());
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
    const t = new O();
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
class _ {
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
    const t = new O();
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
var v;
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
})(v || (v = {}));
var y;
((s) => {
  function e(t, i, n) {
    return {
      type: t,
      create: (r) => new i(r, t),
      authority: n ?? !0
    };
  }
  s.create = e;
})(y || (y = {}));
class M extends a {
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
class P extends a {
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
    _.setModelHandle(this._object, e);
  }
  onChangeRequester(e) {
    _.setChangeRequester(this._object, {
      change: (t) => {
        this._changes.push(t), e.change(this.index()), this.emitter().emit("changed");
      }
    });
  }
  toString(e) {
    _.write(this._object, e);
  }
}
class N extends a {
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
    e.write("ref "), this._object ? _.write(this._object, e) : e.writeLine(`${this._objectId} (null)`);
  }
}
class J extends a {
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
var S;
((s) => {
  function e(r) {
    return new M(r);
  }
  s.any = e;
  function t(r) {
    return new N(r);
  }
  s.ref = t;
  function i(r) {
    return new P(r);
  }
  s.object = i;
  function n() {
    return new J();
  }
  s.refSet = n;
})(S || (S = {}));
var I;
((s) => {
  function e(i) {
    return { type: "connected", userId: i };
  }
  s.connected = e;
  function t(i) {
    return { type: "disconnected", userId: i };
  }
  s.disconnected = t;
})(I || (I = {}));
var L;
((s) => {
  function e(n, r, c) {
    return { type: 0, id: n, name: r, args: c };
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
})(L || (L = {}));
class E {
  constructor(e, t) {
    l(this, "_id");
    l(this, "_address");
    l(this, "_emitter", new g());
    l(this, "_socket");
    l(this, "_onMessage", (e, t) => {
      if (typeof e == "number" && typeof t == "string")
        try {
          const i = JSON.parse(t);
          if (typeof i != "object")
            return;
          this._emitter.emit("message", { channel: e, message: i });
        } catch (i) {
          console.error("Error while parsing message", i);
        }
    });
    this._id = e, this._socket = t, this._address = b.broadcast(), this._socket.on("message", this._onMessage);
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
class F {
  constructor(e) {
    l(this, "_emitter", new g());
    l(this, "_serverPeer");
    this._serverPeer = new E("SERVER", e), this._serverPeer.emitter().on("message", ({ channel: t, message: i }) => {
      this._emitter.emit("message", {
        peerId: this._serverPeer.id(),
        channel: t,
        message: i
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
  F as SocketIONetwork
};
