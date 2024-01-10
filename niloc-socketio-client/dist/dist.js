var D = Object.defineProperty;
var $ = (s, e, t) => e in s ? D(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var l = (s, e, t) => ($(s, typeof e != "symbol" ? e + "" : e, t), t);
var _;
((s) => {
  const e = Object.freeze({
    type: 0
    /* All */
  }), t = Object.freeze({
    type: 1
    /* Broadcast */
  }), r = Object.freeze({
    type: 3
    /* Host */
  });
  function i() {
    return e;
  }
  s.all = i;
  function n() {
    return t;
  }
  s.broadcast = n;
  function a() {
    return r;
  }
  s.host = a;
  function h(o) {
    return { type: 2, id: o };
  }
  s.to = h;
  function u(o) {
    return { type: 4, get: o };
  }
  s.dynamic = u;
  function I(o) {
    return o.host ? a() : h(o.userId);
  }
  s.fromIdentity = I;
  function O(o, d, f) {
    return f.address.type === 1 || f.address.type === 0 || d.type === 0 ? !0 : d.type === 1 ? f.id !== o : d.type === 3 ? f.address.type === 3 : (d.type === 4 ? d.get() : d.id) === f.id;
  }
  s.match = O;
  function b(o) {
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
  s.toString = b;
  function x(o) {
    return o === "*" ? i() : o === "#" ? n() : o === "host" ? a() : o.startsWith(":") ? h(o.slice(1)) : null;
  }
  s.parse = x;
})(_ || (_ = {}));
class k {
  constructor(e, t = _.fromIdentity(e)) {
    this.identity = e, this.address = t;
  }
  get id() {
    return this.identity.userId;
  }
  get host() {
    return this.identity.host;
  }
}
var j = Object.defineProperty, P = (s, e, t) => e in s ? j(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, y = (s, e, t) => (P(s, typeof e != "symbol" ? e + "" : e, t), t);
class g {
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
var m;
((s) => {
  function e(t, r) {
    const i = [], n = new g();
    t.addListener((a) => {
      const [h, u] = a.data;
      n.emit(h.toString(), { ...a, data: u });
    });
    for (let a = 0; a < r; a++)
      i.push({
        post: (h, u) => {
          t.post(h, [a, u]);
        },
        addListener: (h) => {
          n.on(a.toString(), h);
        },
        removeListener: (h) => {
          n.off(a.toString(), h);
        }
      });
    return i;
  }
  s.split = e;
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
var w = /* @__PURE__ */ ((s) => (s[s.All = 0] = "All", s[s.Host = 1] = "Host", s[s.Owner = 2] = "Owner", s))(w || {});
((s) => {
  function e(t, r) {
    switch (t.authority) {
      case 0:
        return !0;
      case 1:
        return r.host;
      case 2:
        return r.userId === t.id;
    }
    return !1;
  }
  s.allows = e;
})(w || (w = {}));
class v {
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
    this._indent = 0, this._string = "", this._line = new v();
  }
  write(e) {
    this._line.write(e);
  }
  writeLine(e) {
    this._line.write(e), this.nextLine();
  }
  nextLine() {
    this._string += this._line.toString(this._indent) + `
`, this._line = new v();
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
class c extends g {
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
    const r = [...e];
    for (const i of r)
      i.on("change", t);
    return () => {
      for (const i of r)
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
class q extends c {
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
class R extends q {
  readValue(e) {
    this.value = e.readBoolean();
  }
  writeValue(e) {
    e.writeBoolean(this.value);
  }
}
function M(s) {
  return function(e, t) {
    const r = "$" + t, i = Symbol(t);
    Object.defineProperty(e, t, {
      get() {
        return this[r].get();
      },
      set(n) {
        this[r].set(n);
      }
    }), Object.defineProperty(e, r, {
      get() {
        let n = this[i];
        return n || (n = s(), this[i] = n), n;
      },
      enumerable: !0
    });
  };
}
function A(s = !1) {
  return M(() => new R(s));
}
var z = Object.defineProperty, F = Object.getOwnPropertyDescriptor, E = (s, e, t, r) => {
  for (var i = r > 1 ? void 0 : r ? F(e, t) : e, n = s.length - 1, a; n >= 0; n--)
    (a = s[n]) && (i = (r ? a(e, t, i) : a(i)) || i);
  return r && i && z(e, t, i), i;
};
class N extends g {
  constructor(e) {
    super(), this.authority = w.All, this._fields = null, this._registerMap = /* @__PURE__ */ new Map(), this._onDeletedChange = () => {
      this.deleted && (this.emit("delete"), this.onDelete(), this.changeRequester.delete(), this.removeAllListeners());
    }, this.id = e, this.register("deleted", this._onDeletedChange);
  }
  static __init(e, t) {
    e.changeRequester = t.changeRequester, e.model = t.model;
    for (const r of e.fields())
      c.__init(r, t);
    e.onInit();
  }
  static toString(e) {
    const t = new S();
    return this.writeString(e, t), t.toString();
  }
  static writeString(e, t) {
    t.writeLine(`${e.constructor.name}: ${e.id} {`), t.startIndent();
    for (const r of e.fields())
      c.writeString(r, t);
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
      if (c.isDirty(t))
        return !0;
    return !1;
  }
  static getDirtyFields(e) {
    const t = [];
    for (const r of e.fields())
      c.isDirty(r) && t.push(r);
    return t;
  }
  fields() {
    return this._fields || (this._fields = this._initFields()), this._fields;
  }
  read(e) {
    for (const t of this.fields())
      c.read(t, e);
  }
  write(e) {
    for (const t of this.fields())
      c.write(t, e);
  }
  send() {
    this.changeRequester.send();
  }
  registerAll(e) {
    if (this._registerMap.has(e))
      return;
    const t = c.register(this.fields(), e);
    this._registerMap.set(e, t);
  }
  unregisterAll(e) {
    this._registerMap.has(e) && (this._registerMap.get(e)(), this._registerMap.delete(e));
  }
  register(e, t) {
    const r = this[e];
    if (r && r instanceof c) {
      r.on("change", t);
      return;
    }
    const i = `$${e}`, n = this[i];
    if (n && n instanceof c) {
      n.on("change", t);
      return;
    }
    throw new Error(`Field ${e} does not exist on type ${this.constructor.name}`);
  }
  unregister(e, t) {
    const r = this[e];
    if (r && r instanceof c) {
      r.off("change", t);
      return;
    }
    const i = `$${e}`, n = this[i];
    if (n && n instanceof c) {
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
      const r = this[t];
      r instanceof c && (c.setIndex(r, e.length), e.push(r));
    }
    return e;
  }
}
E([
  A(!1)
], N.prototype, "deleted", 2);
var L;
((s) => {
  function e(t, r) {
    return { id: t, args: r };
  }
  s.make = e;
})(L || (L = {}));
class V extends k {
  constructor(t, r) {
    super(t, _.broadcast());
    l(this, "_emitter", new g());
    l(this, "_socket");
    l(this, "_onMessage", (t, r) => {
      if (typeof t == "number" && typeof r == "string")
        try {
          const i = JSON.parse(r);
          if (typeof i != "object")
            return;
          this._emitter.emit("message", { channel: t, message: i });
        } catch (i) {
          console.error("Error while parsing message", i);
        }
    });
    this._socket = r, this._socket.on("message", this._onMessage);
  }
  send(t, r) {
    this._socket.send(t, JSON.stringify(r));
  }
  addListener(t) {
    this._emitter.on("message", t);
  }
  removeListener(t) {
    this._emitter.off("message", t);
  }
}
class B extends g {
  constructor(t, r) {
    super();
    l(this, "_serverPeer");
    l(this, "_identity");
    this._identity = t, this._serverPeer = new V(new p("SERVER"), r), this._serverPeer.addListener(({ channel: i, message: n }) => {
      this.emit("message", {
        peerId: this._serverPeer.id,
        channel: i,
        message: n
      });
    });
  }
  identity() {
    return this._identity;
  }
  *peers() {
    yield this._serverPeer;
  }
}
export {
  B as SocketIONetwork
};
