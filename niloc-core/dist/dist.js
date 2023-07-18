var R = Object.defineProperty;
var q = (r, e, t) => e in r ? R(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var i = (r, e, t) => (q(r, typeof e != "symbol" ? e + "" : e, t), t);
var _;
((r) => {
  const e = {
    type: 0
    /* Broadcast */
  }, t = {
    type: 2
    /* Host */
  };
  function s() {
    return e;
  }
  r.broadcast = s;
  function n() {
    return t;
  }
  r.host = n;
  function c(a) {
    return { type: 1, id: a };
  }
  r.to = c;
  function o(a, f) {
    return a.type === 0 || f.address().type === 0 ? !0 : a.type === 2 ? f.address().type === 2 : a.id === f.id();
  }
  r.match = o;
  function h(a) {
    switch (a.type) {
      case 0:
        return "*";
      case 1:
        return `:${a.id}`;
      case 2:
        return "host";
      default:
        return "?";
    }
  }
  r.toString = h;
  function l(a) {
    return a === "*" ? s() : a === "host" ? n() : a.startsWith(":") ? c(a.slice(1)) : null;
  }
  r.parse = l;
})(_ || (_ = {}));
class H {
  constructor() {
    i(this, "_inputListener", null);
    i(this, "_outputListeners", /* @__PURE__ */ new Set());
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
class M {
  constructor(e) {
    i(this, "_channel");
    i(this, "_mpsc", new H());
    i(this, "_input");
    i(this, "_output");
    this._channel = e, this._input = {
      post: (t, s) => this._mpsc.postInput(t, s),
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
class E {
  constructor(e, t) {
    i(this, "host");
    i(this, "userId");
    this.host = t, this.userId = e;
  }
}
class K {
  constructor(e) {
    i(this, "_id");
    i(this, "_address");
    i(this, "_self");
    i(this, "_context");
    i(this, "_channels", {});
    i(this, "network");
    this._id = e.id, this._address = e.host ? _.host() : _.to(e.id), this._context = new E(e.id, e.host ?? !1), this._self = {
      id: () => this._id,
      address: () => this._address,
      send: (t, s) => {
        this._onMessage(this._id, t, s);
      }
    }, this.network = e.network, this.network.emitter().on("message", ({ peerId: t, channel: s, message: n }) => this._onMessage(t, s, n));
  }
  /**
   * @returns peerId of the router
   */
  id() {
    return this._id;
  }
  /**
   * @returns address of the router
   */
  address() {
    return this._address;
  }
  /**
   * Gives a peer representing this router. This could be useful to test is an address matches a router for example.
   * 
   * @example
   * ```ts
   * Address.match(address, router.self())
   * ```
   */
  self() {
    return this._self;
  }
  /**
   * Get a channel by index, creating it if needed. This will then be usefull to send / retrieve data from the network
   * @param channel index of the desired channel
   * @example
   * ```ts
   * // Getting channel 0
   * const channel = router.channel<string>(0)
   * channel.post(Address.to("friend"), "Hello world")
   * ```
   */
  channel(e) {
    return this._channels[e] || (this._channels[e] = this._createChannel(e)), this._channels[e].input();
  }
  context() {
    return this._context;
  }
  _onMessage(e, t, s) {
    _.match(s.address, this._self) && this._channels[t] && this._channels[t].output().post(s);
    for (const n of this.network.peers())
      n.id() !== e && _.match(s.address, n) && n.send(t, s);
  }
  _createChannel(e) {
    const t = new M(e);
    return t.output().setListener((s, n) => {
      this._send(s, e, n);
    }), t;
  }
  _send(e, t, s) {
    const n = {
      originId: this._id,
      address: e,
      data: s
    };
    for (const c of this.network.peers())
      _.match(e, c) && c.send(t, n);
  }
}
var F = Object.defineProperty, J = (r, e, t) => e in r ? F(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, I = (r, e, t) => (J(r, typeof e != "symbol" ? e + "" : e, t), t);
class g {
  constructor() {
    I(this, "_listeners", {}), I(this, "_onceListeners", {});
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
var v;
((r) => {
  function e(t, s) {
    const n = [], c = new g();
    t.addListener((o) => {
      const [h, l] = o.data;
      c.emit(h.toString(), { ...o, data: l });
    });
    for (let o = 0; o < s; o++)
      n.push({
        post: (h, l) => {
          t.post(h, [o, l]);
        },
        addListener: (h) => {
          c.on(o.toString(), h);
        },
        removeListener: (h) => {
          c.off(o.toString(), h);
        }
      });
    return n;
  }
  r.split = e;
})(v || (v = {}));
var w;
((r) => {
  function e() {
    return (n, c) => c.host;
  }
  r.host = e;
  function t() {
    return (n, c) => n.id() === c.userId;
  }
  r.own = t;
  function s(n, c, o) {
    return n === !0 || n(c, o);
  }
  r.allows = s;
})(w || (w = {}));
class L {
  constructor() {
    i(this, "_string", "");
  }
  write(e) {
    this._string += e;
  }
  toString(e) {
    return "  ".repeat(e) + this._string;
  }
}
class k {
  constructor() {
    i(this, "_indent", 0);
    i(this, "_string", "");
    i(this, "_line", new L());
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
class u {
  constructor() {
    i(this, "_index", -1);
    i(this, "_changeRequester", null);
    i(this, "_emitter", new g());
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
    const t = new k();
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
class m {
  constructor(e, t) {
    i(this, "_id");
    i(this, "_type");
    i(this, "_fields", null);
    this._id = e, this._type = t;
  }
  static setChangeRequester(e, t) {
    for (const s of e.fields())
      u.setChangeRequester(s, t);
  }
  static setModelHandle(e, t) {
    for (const s of e.fields())
      u.setModelHandle(s, t);
  }
  static toString(e) {
    const t = new k();
    return this.write(e, t), t.toString();
  }
  static write(e, t) {
    t.writeLine(`${e.type()}: ${e.id()} {`), t.startIndent();
    for (const s of e.fields())
      u.write(s, t);
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
      const s = this[t];
      s instanceof u && (u.setIndex(s, e.length), e.push(s));
    }
    return e;
  }
}
let x = (r = 21) => crypto.getRandomValues(new Uint8Array(r)).reduce((e, t) => (t &= 63, t < 36 ? e += t.toString(36) : t < 62 ? e += (t - 26).toString(36).toUpperCase() : t > 62 ? e += "-" : e += "_", e), "");
var b;
((r) => {
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
      requestObject(n, c) {
        return t.objectsEmitter.on(n, c), c(t.get(n)), {
          destroy() {
            t.objectsEmitter.off(n, c);
          }
        };
      }
    };
  }
  r.make = e;
})(b || (b = {}));
class N {
  constructor() {
    i(this, "_changes", /* @__PURE__ */ new Map());
    i(this, "_syncs", /* @__PURE__ */ new Set());
  }
  change(e, t) {
    if (this._syncs.has(e))
      return;
    let s = this._changes.get(e);
    s || (s = [], this._changes.set(e, s)), !s.includes(t) && s.push(t);
  }
  sync(e) {
    this._syncs.add(e), this._changes.delete(e);
  }
  *changes() {
    const e = { objectId: "", fields: [] };
    for (const [t, s] of this._changes)
      e.objectId = t, e.fields = s, yield e;
    this._changes.clear();
  }
  *syncs() {
    for (const e of this._syncs)
      yield e;
    this._syncs.clear();
  }
}
class T {
  constructor() {
    i(this, "_buffer", []);
    i(this, "_cursor", 0);
  }
  feed(e) {
    this._buffer = e, this._cursor = 0;
  }
  cursor() {
    return this._cursor;
  }
  setCursor(e) {
    this._cursor = e;
  }
  skip(e) {
    this._cursor += e;
  }
  empty() {
    return this._cursor >= this._buffer.length;
  }
  readJSON() {
    const e = this._buffer[this._cursor];
    this._cursor++;
    try {
      return JSON.parse(e);
    } catch (t) {
      return console.error("Failed to parse JSON", t), null;
    }
  }
  readString() {
    return this._buffer[this._cursor++];
  }
  readFloat() {
    return parseFloat(this._buffer[this._cursor++]);
  }
  readInt() {
    return parseInt(this._buffer[this._cursor++], 36);
  }
  readBoolean() {
    return this._buffer[this._cursor++] === "1";
  }
}
class P {
  constructor() {
    i(this, "_buffer", []);
    i(this, "_cursor", -1);
  }
  collect() {
    const e = this._buffer;
    return this._buffer = [], e;
  }
  cursor() {
    return this._cursor === -1 ? this._buffer.length : this._cursor;
  }
  setCursor(e) {
    e === this._buffer.length && (e = -1), this._cursor = e;
  }
  resume() {
    this.setCursor(-1);
  }
  _write(e) {
    this._cursor === -1 ? this._buffer.push(e) : this._buffer[this._cursor++] = e;
  }
  writeJSON(e) {
    this._write(JSON.stringify(e));
  }
  writeString(e) {
    this._write(e);
  }
  writeInt(e) {
    this._write(e.toString(36));
  }
  writeFloat(e) {
    this._write(e.toString());
  }
  writeBoolean(e) {
    this._write(e ? "1" : "0");
  }
}
class $ {
  constructor(e) {
    i(this, "_channel");
    i(this, "_context");
    i(this, "_emitter", new g());
    i(this, "_objectsEmitter", new g());
    i(this, "_templates", /* @__PURE__ */ new Map());
    i(this, "_objects", /* @__PURE__ */ new Map());
    i(this, "_handle");
    i(this, "_changeQueue", new N());
    i(this, "_reader", new T());
    i(this, "_writer", new P());
    i(this, "_plugins", []);
    i(this, "_onMessage", (e) => {
      switch (e.data.type) {
        case "sync": {
          this._onSync(e.data.changes);
          break;
        }
        case "change": {
          this._onChange(e.data.changes);
          break;
        }
      }
    });
    this._channel = e.channel, this._channel.addListener(this._onMessage), this._context = e.context, this._handle = b.make({
      emitter: this._emitter,
      objectsEmitter: this._objectsEmitter,
      context: this._context,
      syncTo: (t) => this.syncTo(t),
      get: (t) => this.get(t)
    });
  }
  emitter() {
    return this._emitter;
  }
  plugin(e) {
    var t;
    this._plugins.push(e), (t = e.init) == null || t.call(e, this._handle);
  }
  register(e) {
    this._templates.set(e.type, e);
  }
  instantiate(e, t) {
    const s = t ?? x(), n = this._create(e, s);
    return this._changeQueue.sync(s), n;
  }
  tick() {
    const e = this._collectSyncs(), t = this._collectChanges();
    e.length > 0 && this._channel.post(_.broadcast(), { type: "sync", changes: e }), t.length > 0 && this._channel.post(_.broadcast(), { type: "change", changes: t });
  }
  syncTo(e) {
    const t = this._collectGlobalSyncs();
    t.length > 0 && this._channel.post(e, { type: "sync", changes: t });
  }
  get(e) {
    return this._objects.get(e) ?? null;
  }
  getAll() {
    return [...this._objects.values()];
  }
  _create(e, t) {
    var n;
    const s = e.create(t);
    m.setChangeRequester(s, this._makeChangeRequester(t)), m.setModelHandle(s, this._handle), this._objects.set(t, s);
    for (const c of this._plugins)
      (n = c.beforeCreate) == null || n.call(c, s);
    return this._emitter.emit("created", s), this._objectsEmitter.emit(t, s), s;
  }
  _makeChangeRequester(e) {
    return {
      change: (t) => this._onChangeRequest(e, t)
    };
  }
  _onChangeRequest(e, t) {
    this._changeQueue.change(e, t);
  }
  _collectGlobalSyncs() {
    return this._collectSyncsForObjects(this._objects.keys());
  }
  _collectSyncs() {
    return this._collectSyncsForObjects(this._changeQueue.syncs());
  }
  _collectSyncsForObjects(e) {
    const t = this._writer;
    for (const s of e) {
      const n = this._objects.get(s);
      if (!n)
        continue;
      const c = this._templates.get(n.type());
      c && w.allows(c.authority, n, this._context) && (t.writeString(n.id()), t.writeString(n.type()), n.write(t));
    }
    return t.collect();
  }
  _collectChanges() {
    const e = this._writer;
    for (const { objectId: t, fields: s } of this._changeQueue.changes()) {
      const n = this._objects.get(t);
      if (!n)
        continue;
      const c = this._templates.get(n.type());
      if (!c || !w.allows(c.authority, n, this._context))
        continue;
      e.writeString(t), e.writeInt(s.length);
      const o = e.cursor();
      e.writeInt(0);
      for (const l of s) {
        const a = n.fields()[l];
        e.writeInt(l), a.writeChange(e), a.clearChange();
      }
      const h = e.cursor();
      e.setCursor(o), e.writeInt(h - o - 1), e.resume();
    }
    return e.collect();
  }
  _onSync(e) {
    const t = this._reader;
    for (t.feed(e); !t.empty(); ) {
      const s = t.readString(), n = t.readString();
      let c = this._objects.get(s);
      if (c) {
        c.read(t);
        continue;
      }
      const o = this._templates.get(n);
      if (!o) {
        console.error("Could not create object with type", n);
        return;
      }
      c = this._create(o, s), c.read(t);
    }
  }
  _onChange(e) {
    const t = this._reader;
    for (t.feed(e); !t.empty(); ) {
      const s = t.readString(), n = t.readInt(), c = t.readInt(), o = this._objects.get(s);
      if (!o) {
        t.skip(c);
        continue;
      }
      for (let h = 0; h < n; h++) {
        const l = t.readInt();
        o.fields()[l].readChange(t);
      }
    }
  }
}
var y;
((r) => {
  function e(t, s, n) {
    return {
      type: t,
      create: (c) => new s(c, t),
      authority: n ?? !0
    };
  }
  r.create = e;
})(y || (y = {}));
class Q extends u {
  constructor(t) {
    super();
    i(this, "_value");
    this._value = t;
  }
  get() {
    return this._value;
  }
  set(t) {
    this._value = t, this.changed();
  }
  read(t) {
    this._value = t.readJSON(), this.emitter().emit("changed");
  }
  write(t) {
    t.writeJSON(this._value);
  }
  toString(t) {
    switch (typeof this._value) {
      case "function":
        t.writeLine("[Function]");
        break;
      case "object":
        t.write(JSON.stringify(this._value));
        break;
      default:
        t.writeLine("" + this._value);
        break;
    }
  }
}
class U {
  constructor() {
    i(this, "_changes", []);
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
          const o = e.readInt();
          for (let a = 0; a < o; a++)
            t.push(e.readJSON());
          break;
        case 1:
          const h = e.readInt();
          for (let a = 0; a < h; a++)
            t.pop();
          break;
        case 2:
          const l = e.readInt();
          t[l] = e.readJSON();
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
class z extends u {
  constructor(t) {
    super();
    i(this, "_value");
    i(this, "_changes", new U());
    this._value = t;
  }
  get() {
    return this._value;
  }
  push(...t) {
    this._value.push(...t), this._changes.push(...t), this.changed();
  }
  pop() {
    const t = this._value.pop();
    return t && (this._changes.pop(), this.changed()), t ?? null;
  }
  set(t) {
    this._value = t, this._changes.clear(), this._changes.push(...t), this.changed();
  }
  setAt(t, s) {
    if (t < 0 || t >= this._value.length)
      throw new Error("Index out of range");
    this._value[t] = s, this._changes.set(t, s), this.changed();
  }
  clear() {
    this._value.length !== 0 && (this._value = [], this._changes.clear(), this.changed());
  }
  read(t) {
    this._value = t.readJSON(), this.emitter().emit("changed");
  }
  write(t) {
    t.writeJSON(this._value);
  }
  readChange(t) {
    this._changes.read(t, this._value), this.changed();
  }
  writeChange(t) {
    this._changes.write(t);
  }
  clearChange() {
    this._changes.reset();
  }
}
class D extends u {
  constructor(t, s) {
    super();
    i(this, "_object");
    i(this, "_changes", []);
    this._object = t.create(s ?? "sub");
  }
  get() {
    return this._object;
  }
  read(t) {
    this._object.read(t), this.emitter().emit("changed");
  }
  write(t) {
    this._object.write(t);
  }
  readChange(t) {
    const s = t.readInt();
    for (let n = 0; n < s; n++) {
      const c = t.readInt();
      this._object.fields()[c].readChange(t);
    }
    this.emitter().emit("changed");
  }
  writeChange(t) {
    const s = this._changes.length;
    t.writeInt(s);
    for (const n of this._changes)
      t.writeInt(n), this._object.fields()[n].writeChange(t);
  }
  clearChange() {
    for (const t of this._changes)
      this._object.fields()[t].clearChange();
    this._changes = [];
  }
  onModelHandle(t) {
    m.setModelHandle(this._object, t);
  }
  onChangeRequester(t) {
    m.setChangeRequester(this._object, {
      change: (s) => {
        this._changes.push(s), t.change(this.index()), this.emitter().emit("changed");
      }
    });
  }
  toString(t) {
    m.write(this._object, t);
  }
}
class A extends u {
  constructor(t) {
    super();
    i(this, "_objectId");
    i(this, "_object", null);
    i(this, "_modelHandle", null);
    i(this, "_objectRequest", null);
    this._objectId = t;
  }
  read(t) {
    const s = t.readJSON();
    s !== this._objectId && (this._setObjectId(s), this.emitter().emit("changed"));
  }
  write(t) {
    t.writeJSON(this._objectId);
  }
  set(t) {
    const s = (t == null ? void 0 : t.id()) ?? null;
    s !== this._objectId && (this._setObjectId(s), this.changed());
  }
  get() {
    return this._object;
  }
  _setObjectId(t) {
    var s, n;
    (s = this._objectRequest) == null || s.destroy(), this._objectId = t, this._object = null, t ? this._objectRequest = ((n = this._modelHandle) == null ? void 0 : n.requestObject(t, (c) => {
      this._object = c;
    })) ?? null : this._objectRequest = null, this.emitter().emit("changed");
  }
  onModelHandle(t) {
    this._modelHandle = t, this._objectId && this._setObjectId(this._objectId);
  }
  toString(t) {
    t.write("ref "), this._object ? m.write(this._object, t) : t.writeLine(`${this._objectId} (null)`);
  }
}
class B extends u {
  constructor() {
    super(...arguments);
    i(this, "_objects", /* @__PURE__ */ new Map());
    i(this, "_modelHandle", null);
  }
  add(t) {
    this._objects.set(t.id(), t), this.changed();
  }
  remove(t) {
    this._objects.delete(t.id()), this.changed();
  }
  has(t) {
    return this._objects.has(t.id());
  }
  *values() {
    for (const t of this._objects.values())
      t !== null && (yield t);
  }
  read(t) {
    var n;
    const s = t.readInt();
    this._objects.clear();
    for (let c = 0; c < s; c++) {
      const o = t.readString();
      this._objects.set(o, ((n = this._modelHandle) == null ? void 0 : n.get(o)) ?? null);
    }
    this.emitter().emit("changed");
  }
  write(t) {
    t.writeInt(this._objects.size);
    for (const s of this._objects.keys())
      t.writeString(s);
  }
  onModelHandle(t) {
    this._modelHandle = t, this._modelHandle.emitter().on("created", (s) => {
      const n = s.id();
      this._objects.has(n) && this._objects.set(n, s), this.emitter().emit("changed");
    });
  }
}
var O;
((r) => {
  function e(o) {
    return new Q(o);
  }
  r.any = e;
  function t(o) {
    return new z(o);
  }
  r.array = t;
  function s(o) {
    return new A(o);
  }
  r.ref = s;
  function n(o) {
    return new D(o);
  }
  r.object = n;
  function c() {
    return new B();
  }
  r.refSet = c;
})(O || (O = {}));
class W {
  constructor(e) {
    i(this, "_model", null);
    i(this, "_onConnected", (e) => {
      this._model && this._model.syncTo(_.to(e));
    });
    i(this, "_onSync", () => {
      this._model && this._model.syncTo(_.broadcast());
    });
    e.emitter().on("connected", this._onConnected), e.emitter().on("sync", this._onSync);
  }
  init(e) {
    this._model = e;
  }
}
class X {
  constructor(e) {
    i(this, "_connectionList");
    i(this, "_model");
    i(this, "_emitter", new g());
    i(this, "_user");
    i(this, "_users", []);
    i(this, "_onUserCreated", (e) => {
      this._connectionList.isConnected(e.id()) && !this._users.includes(e) && (this._users.push(e), this._emitter.emit("usersChanged", this.users()));
    });
    i(this, "_onConnected", (e) => {
      if (e === this._user.id() || this._users.some((s) => s.id() === e))
        return;
      const t = this._model.get(e);
      t && (this._users.push(t), this._emitter.emit("usersChanged", this.users()));
    });
    i(this, "_onDisconnected", (e) => {
      if (e === this._user.id())
        return;
      const t = this._users.findIndex((s) => s.id() === e);
      t < 0 || (this._users.splice(t, 1), this._emitter.emit("usersChanged", this.users()));
    });
    this._connectionList = e.connectionList, this._model = new $({
      channel: e.channel,
      context: e.context
    });
    const t = y.create("user", e.factory, w.own());
    this._model.register(t), this._model.plugin(new W(e.connectionList)), this._user = this._model.instantiate(t, e.context.userId), e.connectionList.emitter().on("connected", this._onConnected), e.connectionList.emitter().on("disconnected", this._onDisconnected), this._model.emitter().on("created", (s) => this._onUserCreated(s));
  }
  user() {
    return this._user;
  }
  users() {
    return [...this._users];
  }
  emitter() {
    return this._emitter;
  }
  /*
   * Has to be called whenever the user has changed
  */
  tick() {
    this._model.tick();
  }
}
class j {
  constructor(e, t) {
    i(this, "_isOwner");
    i(this, "_channel");
    i(this, "_users", /* @__PURE__ */ new Set());
    i(this, "_emitter", new g());
    i(this, "_onMessage", (e) => {
      switch (e.data.type) {
        case "connected": {
          if (this._isOwner || this._users.has(e.data.userId))
            return;
          this._connected(e.data.userId);
          break;
        }
        case "disconnected": {
          if (this._isOwner || !this._users.has(e.data.userId))
            return;
          this._disconnected(e.data.userId);
          break;
        }
        case "sync": {
          if (this._isOwner)
            return;
          this._sync(e.data.userIds);
        }
      }
    });
    this._isOwner = e, this._channel = t, this._channel.addListener(this._onMessage);
  }
  static owner(e) {
    return new j(!0, e);
  }
  static client(e) {
    return new j(!1, e);
  }
  emitter() {
    return this._emitter;
  }
  users() {
    return this._users.values();
  }
  isConnected(e) {
    return this._users.has(e);
  }
  connected(e) {
    this._users.has(e) || (this._connected(e), this._isOwner && (this._channel.post(_.broadcast(), { type: "connected", userId: e }), this._channel.post(_.to(e), {
      type: "sync",
      userIds: [...this._users]
    })));
  }
  disconnected(e) {
    this._users.has(e) && (this._disconnected(e), this._isOwner && this._channel.post(_.broadcast(), { type: "disconnected", userId: e }));
  }
  _connected(e) {
    this._users.add(e), this._emitter.emit("connected", e);
  }
  _disconnected(e) {
    this._users.delete(e), this._emitter.emit("disconnected", e);
  }
  _sync(e) {
    for (const t of [...this._users])
      e.includes(t) || this._disconnected(t);
    for (const t of e)
      this._users.has(t) || this._connected(t);
    this._emitter.emit("sync");
  }
}
class d {
  constructor(e, t) {
    i(this, "_callback");
    i(this, "_callHandler", null);
    i(this, "address");
    this._callback = t, this.address = e;
  }
  static setCallHandler(e, t) {
    e._callHandler = t;
  }
  static host(e) {
    return new d(_.host(), e);
  }
  static target(e, t) {
    return new d(_.to(e), t);
  }
  // Called by the RPC Handler to execute the real code
  static call(e, t) {
    try {
      const s = e._callback(...t);
      return s instanceof Promise ? s : Promise.resolve(s);
    } catch (s) {
      return Promise.reject(s);
    }
  }
  call(...e) {
    return this._callHandler === null ? Promise.reject("Trying to call RPC without initialization") : this._callHandler.call(this.address, e);
  }
}
var p;
((r) => {
  function e(n, c, o) {
    return { type: 0, id: n, name: c, args: o };
  }
  r.request = e;
  function t(n, c) {
    return { type: 1, id: n, result: c };
  }
  r.response = t;
  function s(n, c) {
    return { type: 2, id: n, reason: c };
  }
  r.error = s;
})(p || (p = {}));
class G {
  constructor(e, t) {
    i(this, "_self");
    i(this, "_channel");
    i(this, "_rpcs", {});
    i(this, "_resultEmitter", new g());
    i(this, "_onMessage", (e) => {
      const t = e.data, s = e.originId;
      switch (t.type) {
        case 0: {
          this._onRequest(t, s);
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
    });
    this._self = e, this._channel = t, this._channel.addListener(this._onMessage);
  }
  register(e, t) {
    if (this._rpcs[t]) {
      console.error("Trying to register rpc twice:", t);
      return;
    }
    this._rpcs[t] = e, d.setCallHandler(e, this._makeCallHandler(e, t));
  }
  infuse(e, t) {
    for (const s in e)
      e[s] instanceof d && this.register(e[s], `${t}.${s}`);
  }
  _makeCallHandler(e, t) {
    return {
      call: (n, c) => {
        if (_.match(n, this._self))
          return d.call(e, c);
        const o = x(), h = p.request(o, t, c);
        return new Promise((l, a) => {
          let f = setTimeout(() => {
            f = null, this._resultEmitter.emit(o, { type: 2, data: "Timed out" });
          }, 2e4);
          this._resultEmitter.once(o, ({ type: S, data: C }) => {
            f && clearTimeout(f), S === 2 ? a(C) : S === 1 && l(C);
          }), this._channel.post(n, h);
        });
      }
    };
  }
  _onRequest(e, t) {
    const { id: s, name: n, args: c } = e, o = this._rpcs[n];
    if (!o) {
      console.error(`Received unhandled RPC request '${n}', originated from ${t}`);
      const h = p.error(s, `Unhandled RPC by the receiver ${n}`);
      this._channel.post(_.to(t), h);
      return;
    }
    d.call(o, c).then((h) => {
      const l = p.response(s, h);
      this._channel.post(_.to(t), l);
    }).catch((h) => {
      console.error(`Error while handling RPC '${n}':`, h);
      const l = p.error(s, "Receiver got an error while responding");
      this._channel.post(_.to(t), l);
    });
  }
  _onResponse(e) {
    const { id: t, result: s } = e;
    this._resultEmitter.emit(t, { type: 1, data: s });
  }
  _onError(e) {
    const { id: t, reason: s } = e;
    this._resultEmitter.emit(t, { type: 2, data: s });
  }
}
class Y {
  constructor(e, t) {
    i(this, "_handler");
    this._handler = new G(e, t);
  }
  beforeCreate(e) {
    let t = 0;
    for (const s in e) {
      const n = e[s];
      n instanceof d && this._handler.register(n, `${e.id()}.${t++}`);
    }
  }
}
export {
  _ as Address,
  Q as AnyField,
  z as ArrayField,
  w as Authority,
  v as Channel,
  j as ConnectionList,
  W as ConnectionPlugin,
  E as Context,
  g as Emitter,
  u as Field,
  $ as Model,
  X as Presence,
  d as RPC,
  G as RPCHandler,
  Y as RPCPlugin,
  K as Router,
  m as SyncObject,
  D as SyncObjectField,
  A as SyncObjectRefField,
  B as SyncObjectRefSetField,
  y as Template,
  O as field
};
