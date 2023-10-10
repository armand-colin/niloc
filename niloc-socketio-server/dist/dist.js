var C = Object.defineProperty;
var R = (i, e, t) => e in i ? C(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t;
var u = (i, e, t) => (R(i, typeof e != "symbol" ? e + "" : e, t), t);
var H = Object.defineProperty, N = (i, e, t) => e in i ? H(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t, o = (i, e, t) => (N(i, typeof e != "symbol" ? e + "" : e, t), t), b;
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
  function n() {
    return e;
  }
  i.all = n;
  function r() {
    return t;
  }
  i.broadcast = r;
  function h() {
    return s;
  }
  i.host = h;
  function c(a) {
    return { type: 2, id: a };
  }
  i.to = c;
  function d(a) {
    return { type: 4, get: a };
  }
  i.dynamic = d;
  function k(a, _, g) {
    return g.address().type === 1 || g.address().type === 0 || _.type === 0 ? !0 : _.type === 1 ? g.id() !== a : _.type === 3 ? g.address().type === 3 : (_.type === 4 ? _.get() : _.id) === g.id();
  }
  i.match = k;
  function x(a) {
    switch (a.type) {
      case 0:
        return "*";
      case 1:
        return "#";
      case 2:
        return `:${a.id}`;
      case 4:
        return `:${a.get()}`;
      case 3:
        return "host";
      default:
        return "?";
    }
  }
  i.toString = x;
  function q(a) {
    return a === "*" ? n() : a === "#" ? r() : a === "host" ? h() : a.startsWith(":") ? c(a.slice(1)) : null;
  }
  i.parse = q;
})(b || (b = {}));
var M = Object.defineProperty, J = (i, e, t) => e in i ? M(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t, w = (i, e, t) => (J(i, typeof e != "symbol" ? e + "" : e, t), t);
class f {
  constructor() {
    w(this, "_listeners", {}), w(this, "_onceListeners", {});
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
    const n = [], r = new f();
    t.addListener((h) => {
      const [c, d] = h.data;
      r.emit(c.toString(), { ...h, data: d });
    });
    for (let h = 0; h < s; h++)
      n.push({
        post: (c, d) => {
          t.post(c, [h, d]);
        },
        addListener: (c) => {
          r.on(h.toString(), c);
        },
        removeListener: (c) => {
          r.off(h.toString(), c);
        }
      });
    return n;
  }
  i.split = e;
})(m || (m = {}));
var v;
((i) => {
  function e() {
    return (n, r) => r.host;
  }
  i.host = e;
  function t() {
    return (n, r) => n.id() === r.userId;
  }
  i.own = t;
  function s(n, r, h) {
    return n === !0 || n(r, h);
  }
  i.allows = s;
})(v || (v = {}));
class j {
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
class L {
  constructor() {
    o(this, "_indent", 0), o(this, "_string", ""), o(this, "_line", new j());
  }
  write(e) {
    this._line.write(e);
  }
  writeLine(e) {
    this._line.write(e), this.nextLine();
  }
  nextLine() {
    this._string += this._line.toString(this._indent) + `
`, this._line = new j();
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
class l {
  constructor() {
    o(this, "_index", -1), o(this, "_changeRequester", null), o(this, "_emitter", new f());
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
    const t = new L();
    return this.write(e, t), t.toString();
  }
  static write(e, t) {
    e.toString(t);
  }
  static register(e, t) {
    const s = [...e];
    for (const n of s)
      n.emitter().on("changed", t);
    return () => {
      for (const n of s)
        n.emitter().off("changed", t);
    };
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
  clearChange() {
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
class p {
  constructor(e, t) {
    o(this, "_id"), o(this, "_type"), o(this, "_fields", null), o(this, "_changeRequester"), this._id = e, this._type = t;
  }
  static __setChangeRequester(e, t) {
    e._changeRequester = t;
    for (const s of e.fields())
      l.setChangeRequester(s, t);
  }
  static __setModelHandle(e, t) {
    for (const s of e.fields())
      l.setModelHandle(s, t);
  }
  static toString(e) {
    const t = new L();
    return this.write(e, t), t.toString();
  }
  static write(e, t) {
    t.writeLine(`${e.type()}: ${e.id()} {`), t.startIndent();
    for (const s of e.fields())
      l.write(s, t);
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
  send() {
    this._changeRequester.send();
  }
  register(e) {
    return l.register(this.fields(), e);
  }
  _initFields() {
    const e = [];
    for (const t in this) {
      const s = this[t];
      s instanceof l && (l.setIndex(s, e.length), e.push(s));
    }
    return e;
  }
}
var y;
((i) => {
  function e(t) {
    return {
      emitter() {
        return t.emitter;
      },
      context() {
        return t.context;
      },
      syncTo: t.syncTo,
      get: t.get,
      requestObject(s, n) {
        return t.objectsEmitter.on(s, n), n(t.get(s)), {
          destroy() {
            t.objectsEmitter.off(s, n);
          }
        };
      }
    };
  }
  i.make = e;
})(y || (y = {}));
var I;
((i) => {
  function e(t, s, n) {
    return {
      type: t,
      create: (r) => new s(r, t),
      authority: n ?? !0
    };
  }
  i.create = e;
})(I || (I = {}));
class E extends l {
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
class z {
  constructor() {
    o(this, "_changes", []);
  }
  get last() {
    return this._changes[this._changes.length - 1];
  }
  *_reverse() {
    for (let e = this._changes.length - 1; e > -1; e--)
      yield this._changes[e];
  }
  push(...e) {
    const t = this.last;
    if (t && t.type === 0) {
      t.values.push(...e);
      return;
    }
    this._changes.push({ type: 0, values: e });
  }
  pop() {
    const e = this.last;
    if (e) {
      if (e.type === 0) {
        this._changes.pop();
        return;
      }
      if (e.type === 1) {
        e.n++;
        return;
      }
    }
    this._changes.push({ type: 1, n: 1 });
  }
  set(e, t) {
    for (const s of this._reverse()) {
      if (s.type !== 2)
        break;
      if (s.index === e) {
        s.value = t;
        return;
      }
    }
    this._changes.push({ type: 2, index: e, value: t });
  }
  clear() {
    this._changes = [], this._changes.push({
      type: 3
      /* Clear */
    });
  }
  write(e) {
    e.writeInt(this._changes.length);
    for (const t of this._changes)
      switch (e.writeInt(t.type), t.type) {
        case 0:
          e.writeInt(t.values.length);
          for (const s of t.values)
            e.writeJSON(s);
          break;
        case 1:
          e.writeInt(t.n);
          break;
        case 2:
          e.writeInt(t.index), e.writeJSON(t.value);
          break;
      }
  }
  read(e, t) {
    const s = e.readInt();
    for (let n = 0; n < s; n++)
      switch (e.readInt()) {
        case 0:
          const r = e.readInt();
          for (let d = 0; d < r; d++)
            t.push(e.readJSON());
          break;
        case 1:
          const h = e.readInt();
          for (let d = 0; d < h; d++)
            t.pop();
          break;
        case 2:
          const c = e.readInt();
          t[c] = e.readJSON();
          break;
        case 3:
          t.splice(0, t.length);
          break;
      }
  }
  reset() {
    this._changes = [];
  }
}
class $ extends l {
  constructor(e) {
    super(), o(this, "_value"), o(this, "_changes", new z()), this._value = e;
  }
  get() {
    return this._value;
  }
  push(...e) {
    this._value.push(...e), this._changes.push(...e), this.changed();
  }
  pop() {
    const e = this._value.pop();
    return e && (this._changes.pop(), this.changed()), e ?? null;
  }
  set(e) {
    this._value = e, this._changes.clear(), this._changes.push(...e), this.changed();
  }
  setAt(e, t) {
    if (e < 0 || e >= this._value.length)
      throw new Error("Index out of range");
    this._value[e] = t, this._changes.set(e, t), this.changed();
  }
  clear() {
    this._value.length !== 0 && (this._value = [], this._changes.clear(), this.changed());
  }
  read(e) {
    this._value = e.readJSON(), this.emitter().emit("changed");
  }
  write(e) {
    e.writeJSON(this._value);
  }
  readChange(e) {
    this._changes.read(e, this._value), this.changed();
  }
  writeChange(e) {
    this._changes.write(e);
  }
  clearChange() {
    this._changes.reset();
  }
}
class A extends l {
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
    for (let s = 0; s < t; s++) {
      const n = e.readInt();
      this._object.fields()[n].readChange(e);
    }
    this.emitter().emit("changed");
  }
  writeChange(e) {
    const t = this._changes.length;
    e.writeInt(t);
    for (const s of this._changes)
      e.writeInt(s), this._object.fields()[s].writeChange(e);
  }
  clearChange() {
    for (const e of this._changes)
      this._object.fields()[e].clearChange();
    this._changes = [];
  }
  onModelHandle(e) {
    p.__setModelHandle(this._object, e);
  }
  onChangeRequester(e) {
    p.__setChangeRequester(this._object, {
      change: (t) => {
        this._changes.push(t), e.change(this.index()), this.emitter().emit("changed");
      },
      send: () => {
        e.send();
      }
    });
  }
  toString(e) {
    p.write(this._object, e);
  }
}
class F extends l {
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
    var t, s;
    (t = this._objectRequest) == null || t.destroy(), this._objectId = e, this._object = null, e ? this._objectRequest = ((s = this._modelHandle) == null ? void 0 : s.requestObject(e, (n) => {
      this._object = n;
    })) ?? null : this._objectRequest = null, this.emitter().emit("changed");
  }
  onModelHandle(e) {
    this._modelHandle = e, this._objectId && this._setObjectId(this._objectId);
  }
  toString(e) {
    e.write("ref "), this._object ? p.write(this._object, e) : e.writeLine(`${this._objectId} (null)`);
  }
}
class P extends l {
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
    const s = e.readInt();
    this._objects.clear();
    for (let n = 0; n < s; n++) {
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
      const s = t.id();
      this._objects.has(s) && this._objects.set(s, t), this.emitter().emit("changed");
    });
  }
}
var S;
((i) => {
  function e(h) {
    return new E(h);
  }
  i.any = e;
  function t(h) {
    return new $(h);
  }
  i.array = t;
  function s(h) {
    return new F(h);
  }
  i.ref = s;
  function n(h) {
    return new A(h);
  }
  i.object = n;
  function r() {
    return new P();
  }
  i.refSet = r;
})(S || (S = {}));
var O;
((i) => {
  function e(t, s) {
    return { id: t, args: s };
  }
  i.make = e;
})(O || (O = {}));
class T {
  constructor(e, t, s) {
    u(this, "_id");
    u(this, "_address");
    u(this, "_emitter", new f());
    u(this, "_socketIOEmitter", new f());
    u(this, "_socket");
    u(this, "_onMessage", (e, t) => {
      if (typeof e == "number" && typeof t == "string")
        try {
          const s = JSON.parse(t);
          if (!s)
            return;
          this._emitter.emit("message", { channel: e, message: s });
        } catch (s) {
          console.error(`Error receiving network message (${this._id})`, s);
        }
    });
    this._id = t, this._address = s ? b.host() : b.to(t), this._socket = e, e.on("message", this._onMessage), e.on("disconnect", () => {
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
class B {
  constructor() {
    u(this, "_peers", /* @__PURE__ */ new Map());
    u(this, "_emitter", new f());
  }
  peers() {
    return this._peers.values();
  }
  emitter() {
    return this._emitter;
  }
  addSocket(e, t, s) {
    if (this._peers.has(t))
      return;
    const n = new T(e, t, s);
    n.socketIOEmitter().on("disconnect", () => {
      this._peers.get(t) === n && this._peers.delete(t);
    }), n.emitter().on("message", (r) => {
      this._emitter.emit("message", { peerId: t, ...r });
    }), this._peers.set(t, n);
  }
}
export {
  B as SocketIONetwork
};
