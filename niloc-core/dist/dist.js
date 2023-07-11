var k = Object.defineProperty;
var q = (o, t, e) => t in o ? k(o, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : o[t] = e;
var r = (o, t, e) => (q(o, typeof t != "symbol" ? t + "" : t, e), e);
var u;
((o) => {
  const t = {
    type: 0
    /* Broadcast */
  }, e = {
    type: 2
    /* Host */
  };
  function s() {
    return t;
  }
  o.broadcast = s;
  function n() {
    return e;
  }
  o.host = n;
  function i(a) {
    return { type: 1, id: a };
  }
  o.to = i;
  function c(a, f) {
    return a.type === 0 || f.address().type === 0 ? !0 : a.type === 2 ? f.address().type === 2 : a.id === f.id();
  }
  o.match = c;
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
  o.toString = h;
  function l(a) {
    return a === "*" ? s() : a === "host" ? n() : a.startsWith(":") ? i(a.slice(1)) : null;
  }
  o.parse = l;
})(u || (u = {}));
class x {
  constructor() {
    r(this, "_inputListener", null);
    r(this, "_outputListeners", /* @__PURE__ */ new Set());
  }
  postOutput(...t) {
    for (const e of this._outputListeners)
      e(...t);
  }
  addOutputListener(t) {
    this._outputListeners.add(t);
  }
  removeOutputListener(t) {
    this._outputListeners.delete(t);
  }
  postInput(...t) {
    var e;
    (e = this._inputListener) == null || e.call(this, ...t);
  }
  setInputListener(t) {
    this._inputListener = t;
  }
}
class H {
  constructor(t) {
    r(this, "_channel");
    r(this, "_mpsc", new x());
    r(this, "_input");
    r(this, "_output");
    this._channel = t, this._input = {
      post: (e, s) => this._mpsc.postInput(e, s),
      addListener: (e) => this._mpsc.addOutputListener(e),
      removeListener: (e) => this._mpsc.removeOutputListener(e)
    }, this._output = {
      post: (e) => this._mpsc.postOutput(e),
      setListener: (e) => this._mpsc.setInputListener(e)
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
class M {
  constructor(t, e) {
    r(this, "host");
    r(this, "userId");
    this.host = e, this.userId = t;
  }
}
class W {
  constructor(t) {
    r(this, "_id");
    r(this, "_address");
    r(this, "_self");
    r(this, "_context");
    r(this, "_channels", {});
    r(this, "network");
    this._id = t.id, this._address = t.host ? u.host() : u.to(t.id), this._context = new M(t.id, t.host ?? !1), this._self = {
      id: () => this._id,
      address: () => this._address,
      send: (e, s) => {
        this._onMessage(this._id, e, s);
      }
    }, this.network = t.network, this.network.emitter().on("message", ({ peerId: e, channel: s, message: n }) => this._onMessage(e, s, n));
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
  channel(t) {
    return this._channels[t] || (this._channels[t] = this._createChannel(t)), this._channels[t].input();
  }
  context() {
    return this._context;
  }
  _onMessage(t, e, s) {
    u.match(s.address, this._self) && this._channels[e] && this._channels[e].output().post(s);
    for (const n of this.network.peers())
      n.id() !== t && u.match(s.address, n) && n.send(e, s);
  }
  _createChannel(t) {
    const e = new H(t);
    return e.output().setListener((s, n) => {
      this._send(s, t, n);
    }), e;
  }
  _send(t, e, s) {
    const n = {
      originId: this._id,
      address: t,
      data: s
    };
    for (const i of this.network.peers())
      u.match(t, i) && i.send(e, n);
  }
}
var E = Object.defineProperty, F = (o, t, e) => t in o ? E(o, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : o[t] = e, S = (o, t, e) => (F(o, typeof t != "symbol" ? t + "" : t, e), e);
class b {
  constructor() {
    S(this, "_listeners", {}), S(this, "_onceListeners", {});
  }
  on(t, e) {
    this._listeners[t] || (this._listeners[t] = /* @__PURE__ */ new Set()), this._listeners[t].add(e);
  }
  off(t, e) {
    this._listeners[t] && (this._listeners[t].delete(e), this._listeners[t].size === 0 && delete this._listeners[t]);
  }
  once(t, e) {
    this._onceListeners[t] || (this._onceListeners[t] = /* @__PURE__ */ new Set()), this._onceListeners[t].add(e);
  }
  offOnce(t, e) {
    this._onceListeners[t] && (this._onceListeners[t].delete(e), this._onceListeners[t].size === 0 && delete this._onceListeners[t]);
  }
  emit(t, e) {
    if (this._listeners[t])
      for (const s of [...this._listeners[t]])
        s(e);
    if (this._onceListeners[t]) {
      for (const s of [...this._onceListeners[t]])
        s(e);
      delete this._onceListeners[t];
    }
  }
  removeAllListeners() {
    this._listeners = {}, this._onceListeners = {};
  }
}
var I;
((o) => {
  function t(e, s) {
    const n = [], i = new b();
    e.addListener((c) => {
      const [h, l] = c.data;
      i.emit(h.toString(), { ...c, data: l });
    });
    for (let c = 0; c < s; c++)
      n.push({
        post: (h, l) => {
          e.post(h, [c, l]);
        },
        addListener: (h) => {
          i.on(c.toString(), h);
        },
        removeListener: (h) => {
          i.off(c.toString(), h);
        }
      });
    return n;
  }
  o.split = t;
})(I || (I = {}));
var w;
((o) => {
  function t() {
    return (n, i) => i.host;
  }
  o.host = t;
  function e() {
    return (n, i) => n.id() === i.userId;
  }
  o.own = e;
  function s(n, i, c) {
    return n === !0 || n(i, c);
  }
  o.allows = s;
})(w || (w = {}));
class C {
  constructor() {
    r(this, "_string", "");
  }
  write(t) {
    this._string += t;
  }
  toString(t) {
    return "  ".repeat(t) + this._string;
  }
}
class v {
  constructor() {
    r(this, "_indent", 0);
    r(this, "_string", "");
    r(this, "_line", new C());
  }
  write(t) {
    this._line.write(t);
  }
  writeLine(t) {
    this._line.write(t), this.nextLine();
  }
  nextLine() {
    this._string += this._line.toString(this._indent) + `
`, this._line = new C();
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
class _ {
  constructor() {
    r(this, "_index", -1);
    r(this, "_changeRequester", null);
    r(this, "_emitter", new b());
  }
  static setIndex(t, e) {
    t._index = e;
  }
  static setChangeRequester(t, e) {
    t._changeRequester = e, t.onChangeRequester(e);
  }
  static setModelHandle(t, e) {
    t.onModelHandle(e);
  }
  static toString(t) {
    const e = new v();
    return this.write(t, e), e.toString();
  }
  static write(t, e) {
    t.toString(e);
  }
  index() {
    return this._index;
  }
  emitter() {
    return this._emitter;
  }
  readChange(t) {
    this.read(t);
  }
  writeChange(t) {
    this.write(t);
  }
  changed() {
    var t;
    (t = this._changeRequester) == null || t.change(this._index), this._emitter.emit("changed");
  }
  onChangeRequester(t) {
  }
  onModelHandle(t) {
  }
  toString(t) {
    t.writeLine("???");
  }
}
class p {
  constructor(t, e) {
    r(this, "_id");
    r(this, "_type");
    r(this, "_fields", null);
    this._id = t, this._type = e;
  }
  static setChangeRequester(t, e) {
    for (const s of t.fields())
      _.setChangeRequester(s, e);
  }
  static setModelHandle(t, e) {
    for (const s of t.fields())
      _.setModelHandle(s, e);
  }
  static toString(t) {
    const e = new v();
    return this.write(t, e), e.toString();
  }
  static write(t, e) {
    e.writeLine(`${t.type()}: ${t.id()} {`), e.startIndent();
    for (const s of t.fields())
      _.write(s, e);
    e.endIndent(), e.writeLine("}");
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
  read(t) {
    for (const e of this.fields())
      e.read(t);
  }
  write(t) {
    for (const e of this.fields())
      e.write(t);
  }
  _initFields() {
    const t = [];
    for (const e in this) {
      const s = this[e];
      s instanceof _ && (_.setIndex(s, t.length), t.push(s));
    }
    return t;
  }
}
let O = (o = 21) => crypto.getRandomValues(new Uint8Array(o)).reduce((t, e) => (e &= 63, e < 36 ? t += e.toString(36) : e < 62 ? t += (e - 26).toString(36).toUpperCase() : e > 62 ? t += "-" : t += "_", t), "");
var m;
((o) => {
  function t(e) {
    return {
      emitter() {
        return e.emitter;
      },
      get: e.get,
      requestObject(n, i) {
        return e.objectsEmitter.on(n, i), i(e.get(n)), {
          destroy() {
            e.objectsEmitter.off(n, i);
          }
        };
      }
    };
  }
  o.make = t;
})(m || (m = {}));
class P {
  constructor() {
    r(this, "_changes", /* @__PURE__ */ new Map());
    r(this, "_syncs", /* @__PURE__ */ new Set());
  }
  change(t, e) {
    if (this._syncs.has(t))
      return;
    let s = this._changes.get(t);
    s || (s = [], this._changes.set(t, s)), !s.includes(e) && s.push(e);
  }
  sync(t) {
    this._syncs.add(t), this._changes.delete(t);
  }
  *changes() {
    const t = { objectId: "", fields: [] };
    for (const [e, s] of this._changes)
      t.objectId = e, t.fields = s, yield t;
    this._changes.clear();
  }
  *syncs() {
    for (const t of this._syncs)
      yield t;
    this._syncs.clear();
  }
}
class $ {
  constructor() {
    r(this, "_buffer", []);
    r(this, "_cursor", 0);
  }
  feed(t) {
    this._buffer = t, this._cursor = 0;
  }
  cursor() {
    return this._cursor;
  }
  setCursor(t) {
    this._cursor = t;
  }
  skip(t) {
    this._cursor += t;
  }
  empty() {
    return this._cursor >= this._buffer.length;
  }
  readJSON() {
    const t = this._buffer[this._cursor];
    this._cursor++;
    try {
      return JSON.parse(t);
    } catch (e) {
      return console.error("Failed to parse JSON", e), null;
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
class J {
  constructor() {
    r(this, "_buffer", []);
    r(this, "_cursor", -1);
  }
  collect() {
    const t = this._buffer;
    return this._buffer = [], t;
  }
  cursor() {
    return this._cursor === -1 ? this._buffer.length : this._cursor;
  }
  setCursor(t) {
    t === this._buffer.length && (t = -1), this._cursor = t;
  }
  resume() {
    this.setCursor(-1);
  }
  _write(t) {
    this._cursor === -1 ? this._buffer.push(t) : this._buffer[this._cursor++] = t;
  }
  writeJSON(t) {
    this._write(JSON.stringify(t));
  }
  writeString(t) {
    this._write(t);
  }
  writeInt(t) {
    this._write(t.toString(36));
  }
  writeFloat(t) {
    this._write(t.toString());
  }
  writeBoolean(t) {
    this._write(t ? "1" : "0");
  }
}
class D {
  constructor(t) {
    r(this, "_channel");
    r(this, "_context");
    r(this, "_emitter", new b());
    r(this, "_objectsEmitter", new b());
    r(this, "_templates", /* @__PURE__ */ new Map());
    r(this, "_objects", /* @__PURE__ */ new Map());
    r(this, "_handle");
    r(this, "_changeQueue", new P());
    r(this, "_reader", new $());
    r(this, "_writer", new J());
    r(this, "_plugins", []);
    r(this, "_onMessage", (t) => {
      switch (t.data.type) {
        case "sync": {
          this._onSync(t.data.changes);
          break;
        }
        case "change": {
          this._onChange(t.data.changes);
          break;
        }
      }
    });
    this._channel = t.channel, this._channel.addListener(this._onMessage), this._context = t.context, this._handle = m.make({
      emitter: this._emitter,
      objectsEmitter: this._objectsEmitter,
      get: (e) => this.get(e)
    });
  }
  emitter() {
    return this._emitter;
  }
  plugin(t) {
    this._plugins.push(t);
  }
  register(t) {
    this._templates.set(t.type, t);
  }
  instantiate(t, e) {
    const s = e ?? O(), n = this._create(t, s);
    return this._changeQueue.sync(s), n;
  }
  tick() {
    const t = this._collectSyncs(), e = this._collectChanges();
    t.length > 0 && this._channel.post(u.broadcast(), { type: "sync", changes: t }), e.length > 0 && this._channel.post(u.broadcast(), { type: "change", changes: e });
  }
  syncTo(t) {
    const e = this._collectGlobalSyncs();
    e.length > 0 && this._channel.post(t, { type: "sync", changes: e });
  }
  get(t) {
    return this._objects.get(t) ?? null;
  }
  getAll() {
    return [...this._objects.values()];
  }
  _create(t, e) {
    var n;
    const s = t.create(e);
    p.setChangeRequester(s, this._makeChangeRequester(e)), p.setModelHandle(s, this._handle), this._objects.set(e, s);
    for (const i of this._plugins)
      (n = i.beforeCreate) == null || n.call(i, s);
    return this._emitter.emit("created", s), this._objectsEmitter.emit(e, s), s;
  }
  _makeChangeRequester(t) {
    return {
      change: (e) => this._onChangeRequest(t, e)
    };
  }
  _onChangeRequest(t, e) {
    this._changeQueue.change(t, e);
  }
  _collectGlobalSyncs() {
    return this._collectSyncsForObjects(this._objects.keys());
  }
  _collectSyncs() {
    return this._collectSyncsForObjects(this._changeQueue.syncs());
  }
  _collectSyncsForObjects(t) {
    const e = this._writer;
    for (const s of t) {
      const n = this._objects.get(s);
      if (!n)
        continue;
      const i = this._templates.get(n.type());
      i && w.allows(i.authority, n, this._context) && (e.writeString(n.id()), e.writeString(n.type()), n.write(e));
    }
    return e.collect();
  }
  _collectChanges() {
    const t = this._writer;
    for (const { objectId: e, fields: s } of this._changeQueue.changes()) {
      const n = this._objects.get(e);
      if (!n)
        continue;
      const i = this._templates.get(n.type());
      if (!i || !w.allows(i.authority, n, this._context))
        continue;
      t.writeString(e), t.writeInt(s.length);
      const c = t.cursor();
      t.writeInt(0);
      for (const l of s) {
        const a = n.fields()[l];
        t.writeInt(l), a.writeChange(t);
      }
      const h = t.cursor();
      t.setCursor(c), t.writeInt(h - c - 1), t.resume();
    }
    return t.collect();
  }
  _onSync(t) {
    const e = this._reader;
    for (e.feed(t); !e.empty(); ) {
      const s = e.readString(), n = e.readString();
      let i = this._objects.get(s);
      if (i) {
        i.read(e);
        continue;
      }
      const c = this._templates.get(n);
      if (!c) {
        console.error("Could not create object with type", n);
        return;
      }
      i = this._create(c, s), i.read(e);
    }
  }
  _onChange(t) {
    const e = this._reader;
    for (e.feed(t); !e.empty(); ) {
      const s = e.readString(), n = e.readInt(), i = e.readInt(), c = this._objects.get(s);
      if (!c) {
        e.skip(i);
        continue;
      }
      for (let h = 0; h < n; h++) {
        const l = e.readInt();
        c.fields()[l].readChange(e);
      }
    }
  }
}
var L;
((o) => {
  function t(e, s, n) {
    return {
      type: e,
      create: (i) => new s(i, e),
      authority: n ?? !0
    };
  }
  o.create = t;
})(L || (L = {}));
class N extends _ {
  constructor(e) {
    super();
    r(this, "_value");
    this._value = e;
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
class T extends _ {
  constructor(e, s) {
    super();
    r(this, "_object");
    r(this, "_changes", []);
    this._object = e.create(s ?? "sub");
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
    const s = e.readInt();
    for (let n = 0; n < s; n++) {
      const i = e.readInt();
      this._object.fields()[i].readChange(e);
    }
    this.emitter().emit("changed");
  }
  writeChange(e) {
    const s = this._changes.length;
    e.writeInt(s);
    for (const n of this._changes)
      e.writeInt(n), this._object.fields()[n].writeChange(e);
    this._changes = [];
  }
  onModelHandle(e) {
    p.setModelHandle(this._object, e);
  }
  onChangeRequester(e) {
    p.setChangeRequester(this._object, {
      change: (s) => {
        this._changes.push(s), e.change(this.index()), this.emitter().emit("changed");
      }
    });
  }
  toString(e) {
    p.write(this._object, e);
  }
}
class Q extends _ {
  constructor(e) {
    super();
    r(this, "_objectId");
    r(this, "_object", null);
    r(this, "_modelHandle", null);
    r(this, "_objectRequest", null);
    this._objectId = e;
  }
  read(e) {
    const s = e.readJSON();
    s !== this._objectId && (this._setObjectId(s), this.emitter().emit("changed"));
  }
  write(e) {
    e.writeJSON(this._objectId);
  }
  set(e) {
    const s = (e == null ? void 0 : e.id()) ?? null;
    s !== this._objectId && (this._setObjectId(s), this.changed());
  }
  get() {
    return this._object;
  }
  _setObjectId(e) {
    var s, n;
    (s = this._objectRequest) == null || s.destroy(), this._objectId = e, this._object = null, e ? this._objectRequest = ((n = this._modelHandle) == null ? void 0 : n.requestObject(e, (i) => {
      this._object = i;
    })) ?? null : this._objectRequest = null, this.emitter().emit("changed");
  }
  onModelHandle(e) {
    this._modelHandle = e, this._objectId && this._setObjectId(this._objectId);
  }
  toString(e) {
    e.write("ref "), this._object ? p.write(this._object, e) : e.writeLine(`${this._objectId} (null)`);
  }
}
class z extends _ {
  constructor() {
    super(...arguments);
    r(this, "_objects", /* @__PURE__ */ new Map());
    r(this, "_modelHandle", null);
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
    var n;
    const s = e.readInt();
    this._objects.clear();
    for (let i = 0; i < s; i++) {
      const c = e.readString();
      this._objects.set(c, ((n = this._modelHandle) == null ? void 0 : n.get(c)) ?? null);
    }
    this.emitter().emit("changed");
  }
  write(e) {
    e.writeInt(this._objects.size);
    for (const s of this._objects.keys())
      e.writeString(s);
  }
  onModelHandle(e) {
    this._modelHandle = e, this._modelHandle.emitter().on("created", (s) => {
      const n = s.id();
      this._objects.has(n) && this._objects.set(n, s), this.emitter().emit("changed");
    });
  }
}
var R;
((o) => {
  function t(i) {
    return new N(i);
  }
  o.any = t;
  function e(i) {
    return new Q(i);
  }
  o.ref = e;
  function s(i) {
    return new T(i);
  }
  o.object = s;
  function n() {
    return new z();
  }
  o.refSet = n;
})(R || (R = {}));
class d {
  constructor(t, e) {
    r(this, "_callback");
    r(this, "_callHandler", null);
    r(this, "address");
    this._callback = e, this.address = t;
  }
  static setCallHandler(t, e) {
    t._callHandler = e;
  }
  static host(t) {
    return new d(u.host(), t);
  }
  static target(t, e) {
    return new d(u.to(t), e);
  }
  // Called by the RPC Handler to execute the real code
  static call(t, e) {
    try {
      const s = t._callback(...e);
      return s instanceof Promise ? s : Promise.resolve(s);
    } catch (s) {
      return Promise.reject(s);
    }
  }
  call(...t) {
    return this._callHandler === null ? Promise.reject("Trying to call RPC without initialization") : this._callHandler.call(this.address, t);
  }
}
var g;
((o) => {
  function t(n, i, c) {
    return { type: 0, id: n, name: i, args: c };
  }
  o.request = t;
  function e(n, i) {
    return { type: 1, id: n, result: i };
  }
  o.response = e;
  function s(n, i) {
    return { type: 2, id: n, reason: i };
  }
  o.error = s;
})(g || (g = {}));
class B {
  constructor(t, e) {
    r(this, "_self");
    r(this, "_channel");
    r(this, "_rpcs", {});
    r(this, "_resultEmitter", new b());
    r(this, "_onMessage", (t) => {
      const e = t.data, s = t.originId;
      switch (e.type) {
        case 0: {
          this._onRequest(e, s);
          break;
        }
        case 1: {
          this._onResponse(e);
          break;
        }
        case 2: {
          this._onError(e);
          break;
        }
      }
    });
    this._self = t, this._channel = e, this._channel.addListener(this._onMessage);
  }
  register(t, e) {
    if (this._rpcs[e]) {
      console.error("Trying to register rpc twice:", e);
      return;
    }
    this._rpcs[e] = t, d.setCallHandler(t, this._makeCallHandler(t, e));
  }
  infuse(t, e) {
    for (const s in t)
      t[s] instanceof d && this.register(t[s], `${e}.${s}`);
  }
  _makeCallHandler(t, e) {
    return {
      call: (n, i) => {
        if (u.match(n, this._self))
          return d.call(t, i);
        const c = O(), h = g.request(c, e, i);
        return new Promise((l, a) => {
          let f = setTimeout(() => {
            f = null, this._resultEmitter.emit(c, { type: 2, data: "Timed out" });
          }, 2e4);
          this._resultEmitter.once(c, ({ type: y, data: j }) => {
            f && clearTimeout(f), y === 2 ? a(j) : y === 1 && l(j);
          }), this._channel.post(n, h);
        });
      }
    };
  }
  _onRequest(t, e) {
    const { id: s, name: n, args: i } = t, c = this._rpcs[n];
    if (!c) {
      console.error(`Received unhandled RPC request '${n}', originated from ${e}`);
      const h = g.error(s, `Unhandled RPC by the receiver ${n}`);
      this._channel.post(u.to(e), h);
      return;
    }
    d.call(c, i).then((h) => {
      const l = g.response(s, h);
      this._channel.post(u.to(e), l);
    }).catch((h) => {
      console.error(`Error while handling RPC '${n}':`, h);
      const l = g.error(s, "Receiver got an error while responding");
      this._channel.post(u.to(e), l);
    });
  }
  _onResponse(t) {
    const { id: e, result: s } = t;
    this._resultEmitter.emit(e, { type: 1, data: s });
  }
  _onError(t) {
    const { id: e, reason: s } = t;
    this._resultEmitter.emit(e, { type: 2, data: s });
  }
}
class G {
  constructor(t, e) {
    r(this, "_handler");
    this._handler = new B(t, e);
  }
  beforeCreate(t) {
    let e = 0;
    for (const s in t) {
      const n = t[s];
      n instanceof d && this._handler.register(n, `${t.id()}.${e++}`);
    }
  }
}
export {
  u as Address,
  N as AnyField,
  w as Authority,
  I as Channel,
  M as Context,
  b as Emitter,
  _ as Field,
  D as Model,
  d as RPC,
  B as RPCHandler,
  G as RPCPlugin,
  W as Router,
  p as SyncObject,
  T as SyncObjectField,
  Q as SyncObjectRefField,
  z as SyncObjectRefSetField,
  L as Template,
  R as field
};
