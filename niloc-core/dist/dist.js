var o;
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
  function n() {
    return e;
  }
  r.all = n;
  function i() {
    return t;
  }
  r.broadcast = i;
  function c() {
    return s;
  }
  r.host = c;
  function h(a) {
    return { type: 2, id: a };
  }
  r.to = h;
  function l(a) {
    return { type: 4, get: a };
  }
  r.dynamic = l;
  function _(a, m, b) {
    return b.address().type === 1 || b.address().type === 0 || m.type === 0 ? !0 : m.type === 1 ? b.id() !== a : m.type === 3 ? b.address().type === 3 : (m.type === 4 ? m.get() : m.id) === b.id();
  }
  r.match = _;
  function k(a) {
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
  r.toString = k;
  function x(a) {
    return a === "*" ? n() : a === "#" ? i() : a === "host" ? c() : a.startsWith(":") ? h(a.slice(1)) : null;
  }
  r.parse = x;
})(o || (o = {}));
class H {
  constructor() {
    this._inputListener = null, this._outputListeners = /* @__PURE__ */ new Set();
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
class R {
  constructor(e) {
    this._mpsc = new H(), this._channel = e, this._input = {
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
class q {
  constructor(e, t) {
    this.host = t, this.userId = e;
  }
}
class re {
  constructor(e) {
    this._channels = {}, this._id = e.id, this._relay = e.relay ?? !1, this._address = e.host ? o.host() : o.to(e.id), this._context = new q(e.id, e.host ?? !1), this._self = {
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
    if (o.match(e, s.address, this._self) && this._receive(t, s), !!this._relay)
      for (const n of this.network.peers())
        n.id() !== e && o.match(e, s.address, n) && n.send(t, s);
  }
  _receive(e, t) {
    this._channels[e] && this._channels[e].output().post(t);
  }
  _createChannel(e) {
    const t = new R(e);
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
    for (const i of this.network.peers())
      o.match(this._id, e, i) && i.send(t, n);
    o.match(this._id, e, this._self) && this._receive(t, n);
  }
}
var M = Object.defineProperty, F = (r, e, t) => e in r ? M(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, C = (r, e, t) => (F(r, typeof e != "symbol" ? e + "" : e, t), t);
class f {
  constructor() {
    C(this, "_listeners", {}), C(this, "_onceListeners", {});
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
var O;
((r) => {
  function e(t, s) {
    const n = [], i = new f();
    t.addListener((c) => {
      const [h, l] = c.data;
      i.emit(h.toString(), { ...c, data: l });
    });
    for (let c = 0; c < s; c++)
      n.push({
        post: (h, l) => {
          t.post(h, [c, l]);
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
  r.split = e;
})(O || (O = {}));
var g = /* @__PURE__ */ ((r) => (r[r.All = 0] = "All", r[r.Host = 1] = "Host", r[r.Owner = 2] = "Owner", r))(g || {});
((r) => {
  function e(t, s) {
    switch (t.authority) {
      case 0:
        return !0;
      case 1:
        return s.host;
      case 2:
        return s.userId === t.id();
    }
    return !1;
  }
  r.allows = e;
})(g || (g = {}));
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
class I {
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
class u {
  constructor() {
    this._index = -1, this._changeRequester = null, this._emitter = new f();
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
    const t = new I();
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
class L extends u {
  constructor(e) {
    super(), this.value = e;
  }
  get() {
    return this.value;
  }
  set(e) {
    this.value = e, this.changed();
  }
  read(e) {
    this.readValue(e), this.emitter().emit("changed");
  }
  write(e) {
    e.writeJSON(this.value);
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
class T extends L {
  readValue(e) {
    this.value = e.readBoolean();
  }
  writeValue(e) {
    e.writeBoolean(this.value);
  }
}
class p {
  constructor(e) {
    this._fields = null, this.authority = g.All, this.deleted = new T(!1), this._onDeletedChanged = () => {
      this.deleted.get() && (this._changeRequester.delete(), this.deleted.emitter().on("changed", this._onDeletedChanged.bind(this)));
    }, this._id = e, this.deleted.emitter().on("changed", this._onDeletedChanged.bind(this));
  }
  static __setChangeRequester(e, t) {
    e._changeRequester = t;
    for (const s of e.fields())
      u.setChangeRequester(s, t);
  }
  static __setModelHandle(e, t) {
    for (const s of e.fields())
      u.setModelHandle(s, t);
  }
  static toString(e) {
    const t = new I();
    return this.write(e, t), t.toString();
  }
  static write(e, t) {
    t.writeLine(`${e.constructor.name}: ${e.id()} {`), t.startIndent();
    for (const s of e.fields())
      u.write(s, t);
    t.endIndent(), t.writeLine("}");
  }
  id() {
    return this._id;
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
    return u.register(this.fields(), e);
  }
  delete() {
    this.deleted.get() || (this.deleted.set(!0), this._changeRequester.send(), this._changeRequester.delete());
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
let J = (r = 21) => crypto.getRandomValues(new Uint8Array(r)).reduce((e, t) => (t &= 63, t < 36 ? e += t.toString(36) : t < 62 ? e += (t - 26).toString(36).toUpperCase() : t > 62 ? e += "-" : e += "_", e), "");
var y;
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
      requestObject(n, i) {
        return t.objectsEmitter.on(n, i), i(t.get(n)), {
          destroy() {
            t.objectsEmitter.off(n, i);
          }
        };
      },
      changeQueue() {
        return t.changeQueue;
      },
      send: t.send
    };
  }
  r.make = e;
})(y || (y = {}));
class N {
  constructor() {
    this._changes = /* @__PURE__ */ new Map(), this._syncs = /* @__PURE__ */ new Set(), this._emitter = new f();
  }
  emitter() {
    return this._emitter;
  }
  needsSend() {
    return this._syncs.size > 0 || this._changes.size > 0;
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
  changeForObject(e) {
    const t = this._changes.get(e);
    return this._changes.delete(e), t ?? null;
  }
}
class P {
  constructor() {
    this._buffer = [], this._cursor = 0;
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
class $ {
  constructor() {
    this._buffer = [], this._cursor = -1;
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
class Q {
  constructor() {
    this._templates = /* @__PURE__ */ new Map(), this._reverseTemplates = /* @__PURE__ */ new Map();
  }
  register(e, t) {
    t = t ?? e.name, this._templates.set(t, e), this._reverseTemplates.set(e, t);
  }
  getTypeId(e) {
    return this._reverseTemplates.get(e.constructor) ?? null;
  }
  getType(e) {
    return this._templates.get(e) ?? null;
  }
}
class E {
  constructor(e) {
    this._emitter = new f(), this._objectsEmitter = new f(), this._typesHandler = new Q(), this._objects = /* @__PURE__ */ new Map(), this._changeQueue = new N(), this._reader = new P(), this._writer = new $(), this._plugins = [], this._onMessage = (t) => {
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
    }, this._channel = e.channel, this._channel.addListener(this._onMessage), this._context = e.context, this._handle = y.make({
      emitter: this._emitter,
      objectsEmitter: this._objectsEmitter,
      context: this._context,
      syncTo: (t) => this.syncTo(t),
      get: (t) => this.get(t),
      changeQueue: this._changeQueue,
      send: () => this.send()
    });
  }
  emitter() {
    return this._emitter;
  }
  plugin(e) {
    var t;
    this._plugins.push(e), (t = e.init) == null || t.call(e, this._handle);
  }
  register(e, t) {
    this._typesHandler.register(e, t);
  }
  instantiate(e, t) {
    const s = t ?? J(), n = this._create(e, s);
    return this._changeQueue.sync(s), n;
  }
  send(e) {
    let t, s;
    e !== void 0 ? (t = this._collectSyncsForObjects([e]), s = this._collectChangesForObjects([{ objectId: e, fields: this._changeQueue.changeForObject(e) ?? [] }])) : (t = this._collectSyncs(), s = this._collectChanges()), t.length > 0 && this._channel.post(o.broadcast(), { type: "sync", changes: t }), s.length > 0 && this._channel.post(o.broadcast(), { type: "change", changes: s });
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
    const s = new e(t);
    p.__setChangeRequester(s, this._makeChangeRequester(t)), p.__setModelHandle(s, this._handle), this._objects.set(t, s);
    for (const i of this._plugins)
      (n = i.beforeCreate) == null || n.call(i, s);
    return this._emitter.emit("created", s), this._objectsEmitter.emit(t, s), s;
  }
  _makeChangeRequester(e) {
    return {
      change: (t) => this._onChangeRequest(e, t),
      send: () => this.send(e),
      delete: () => this._delete(e)
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
      const i = this._typesHandler.getTypeId(n);
      i !== null && g.allows(n, this._context) && (t.writeString(n.id()), t.writeString(i), n.write(t));
    }
    return t.collect();
  }
  _collectChanges() {
    return this._collectChangesForObjects(this._changeQueue.changes());
  }
  _collectChangesForObjects(e) {
    const t = this._writer;
    for (const { objectId: s, fields: n } of e) {
      const i = this._objects.get(s);
      if (!i || !g.allows(i, this._context))
        continue;
      t.writeString(s), t.writeInt(n.length);
      const c = t.cursor();
      t.writeInt(0);
      for (const l of n) {
        const _ = i.fields()[l];
        t.writeInt(l), _.writeChange(t), _.clearChange();
      }
      const h = t.cursor();
      t.setCursor(c), t.writeInt(h - c - 1), t.resume();
    }
    return t.collect();
  }
  _delete(e) {
    this._objects.has(e) && (this._objects.delete(e), this._emitter.emit("deleted", e), this._objectsEmitter.emit(e, null));
  }
  _onSync(e) {
    const t = this._reader;
    for (t.feed(e); !t.empty(); ) {
      const s = t.readString(), n = t.readString();
      let i = this._objects.get(s);
      if (i) {
        i.read(t);
        continue;
      }
      const c = this._typesHandler.getType(n);
      if (!c) {
        console.error("Could not create object with type", n);
        return;
      }
      i = this._create(c, s), i.read(t);
    }
  }
  _onChange(e) {
    const t = this._reader;
    for (t.feed(e); !t.empty(); ) {
      const s = t.readString(), n = t.readInt(), i = t.readInt(), c = this._objects.get(s);
      if (!c) {
        t.skip(i);
        continue;
      }
      for (let h = 0; h < n; h++) {
        const l = t.readInt();
        c.fields()[l].readChange(t);
      }
    }
  }
}
class z extends L {
  readValue(e) {
    this.value = e.readJSON();
  }
  writeValue(e) {
    e.writeJSON(this.value);
  }
}
class D {
  constructor() {
    this._changes = [];
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
          const c = e.readInt();
          for (let _ = 0; _ < c; _++)
            t.push(e.readJSON());
          break;
        case 1:
          const h = e.readInt();
          for (let _ = 0; _ < h; _++)
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
class ce extends u {
  constructor(e) {
    super(), this._changes = new D(), this._value = e;
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
class V extends u {
  constructor(e, t) {
    super(), this._changes = [], this._object = new e(t ?? "sub");
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
      },
      delete: () => {
        console.error("SyncObjectField: delete is not supported, as it cannot be null for its parent object. This is an undefined behaviour.");
      }
    });
  }
  toString(e) {
    p.write(this._object, e);
  }
}
class B extends u {
  constructor(e) {
    super(), this._object = null, this._modelHandle = null, this._objectRequest = null, this._objectId = e;
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
class he extends u {
  constructor() {
    super(...arguments), this._objects = /* @__PURE__ */ new Map(), this._modelHandle = null;
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
    var s;
    const t = e.readInt();
    this._objects.clear();
    for (let n = 0; n < t; n++) {
      const i = e.readString();
      this._objects.set(i, ((s = this._modelHandle) == null ? void 0 : s.get(i)) ?? null);
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
class U {
  constructor(e) {
    this._model = null, this._onConnected = (t) => {
      this._model && this._model.syncTo(o.to(t));
    }, this._onSync = () => {
      this._model && this._model.syncTo(o.broadcast());
    }, e.emitter().on("connected", this._onConnected), e.emitter().on("sync", this._onSync);
  }
  init(e) {
    this._model = e;
  }
}
class W {
  beforeCreate(e) {
    e.authority = g.Owner;
  }
}
class oe {
  constructor(e) {
    this._emitter = new f(), this._others = [], this._onUserCreated = (t) => {
      this._connectionList.isConnected(t.id()) && !this._others.includes(t) && (this._others.push(t), this._emitter.emit("changed", this.users()), this._emitter.emit("connected", t));
    }, this._onConnected = (t) => {
      if (t === this._user.id() || this._others.some((n) => n.id() === t))
        return;
      const s = this._model.get(t);
      s && (this._others.push(s), this._emitter.emit("changed", this.users()), this._emitter.emit("connected", s));
    }, this._onDisconnected = (t) => {
      if (t === this._user.id())
        return;
      const s = this._others.findIndex((n) => n.id() === t);
      s < 0 || (this._others.splice(s, 1), this._emitter.emit("changed", this.users()), this._emitter.emit("disconnected", t));
    }, this._connectionList = e.connectionList, this._model = new E({
      channel: e.channel,
      context: e.context
    }), this._model.register(e.type, "user"), this._model.plugin(new U(e.connectionList)), this._model.plugin(new W()), this._user = this._model.instantiate(e.type, e.context.userId), e.connectionList.emitter().on("connected", this._onConnected), e.connectionList.emitter().on("disconnected", this._onDisconnected), this._model.emitter().on("created", (t) => this._onUserCreated(t));
    for (const t of this._connectionList.users())
      this._onConnected(t);
  }
  user() {
    return this._user;
  }
  users() {
    return [this._user, ...this._others];
  }
  others() {
    return [...this._others];
  }
  emitter() {
    return this._emitter;
  }
  /*
   * Has to be called whenever the user has changed
  */
  send() {
    this._model.send();
  }
  register(e) {
    const t = {};
    for (const i of [this._user, ...this._others])
      t[i.id()] = i.register(e);
    function s(i) {
      t[i.id()] = i.register(e);
    }
    function n(i) {
      const c = t[i];
      c && (c(), delete t[i]);
    }
    return this.emitter().on("connected", s), this.emitter().on("disconnected", n), () => {
      this.emitter().off("connected", s), this.emitter().off("disconnected", n);
      for (const i of Object.values(t))
        i();
    };
  }
}
class j {
  constructor(e, t) {
    this._users = /* @__PURE__ */ new Set(), this._emitter = new f(), this._onMessage = (s) => {
      switch (s.data.type) {
        case "connected": {
          if (this._isOwner || this._users.has(s.data.userId))
            return;
          this._connected(s.data.userId);
          break;
        }
        case "disconnected": {
          if (this._isOwner || !this._users.has(s.data.userId))
            return;
          this._disconnected(s.data.userId);
          break;
        }
        case "sync": {
          if (this._isOwner)
            return;
          this._sync(s.data.userIds);
        }
      }
    }, this._isOwner = e, this._channel = t, this._channel.addListener(this._onMessage);
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
    this._users.has(e) || (this._connected(e), this._isOwner && (this._channel.post(o.broadcast(), { type: "connected", userId: e }), this._channel.post(o.to(e), {
      type: "sync",
      userIds: [...this._users]
    })));
  }
  disconnected(e) {
    this._users.has(e) && (this._disconnected(e), this._isOwner && this._channel.post(o.broadcast(), { type: "disconnected", userId: e }));
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
    this._callHandler = null, this._callback = t, this.address = e;
  }
  static setCallHandler(e, t) {
    e._callHandler = t;
  }
  static host(e) {
    return new d(o.host(), e);
  }
  static target(e, t) {
    return new d(o.to(e), t);
  }
  static broadcast(e) {
    return new d(o.broadcast(), e);
  }
  static all(e) {
    return new d(o.all(), e);
  }
  static dynamic(e, t) {
    return new d(o.dynamic(e), t);
  }
  // Called by the RPC Handler to execute the real code
  static call(e, t) {
    try {
      e._callback(...t);
    } catch (s) {
      console.error("Error while executing RPC:", s);
    }
  }
  call(...e) {
    if (this._callHandler === null)
      throw new Error("Trying to call RPC without initialization");
    return this._callHandler.call(this.address, e);
  }
}
var S;
((r) => {
  function e(t, s) {
    return { id: t, args: s };
  }
  r.make = e;
})(S || (S = {}));
class A {
  constructor(e, t) {
    this._rpcs = {}, this._onMessage = (s) => {
      const n = s.data, i = s.originId;
      o.match(s.originId, s.address, this._self) && this._onRequest(n, i);
    }, this._self = e, this._channel = t, this._channel.addListener(this._onMessage);
  }
  register(e, t) {
    if (this._rpcs[t]) {
      console.error("Trying to register rpc twice:", t);
      return;
    }
    this._rpcs[t] = e, d.setCallHandler(e, this._makeCallHandler(t));
  }
  infuse(e, t) {
    for (const s in e)
      e[s] instanceof d && this.register(e[s], `${t}.${s}`);
  }
  _makeCallHandler(e) {
    return {
      call: (s, n) => {
        const i = S.make(e, n);
        this._channel.post(s, i);
      }
    };
  }
  _onRequest(e, t) {
    const { id: s, args: n } = e, i = this._rpcs[s];
    if (!i) {
      console.error(`Received unhandled RPC request '${s}', originated from ${t}`);
      return;
    }
    d.call(i, n);
  }
}
class ae {
  constructor(e, t) {
    this._handler = new A(e, t);
  }
  beforeCreate(e) {
    let t = 0;
    for (const s in e) {
      const n = e[s];
      n instanceof d && this._handler.register(n, `${e.id()}.${t++}`);
    }
  }
}
const G = {
  frequency: 100,
  tolerance: 3
};
class le {
  constructor(e) {
    this._interval = null, this._uselessTicks = 0, this._needsSend = () => {
      this._interval === null && (this._interval = setInterval(this._send, this._options.frequency, void 0));
    }, this._send = () => {
      if (!this._modelHandle.changeQueue().needsSend()) {
        this._uselessTicks++, this._uselessTicks >= this._options.tolerance && (clearInterval(this._interval), this._interval = null, this._uselessTicks = 0);
        return;
      }
      this._modelHandle.send();
    }, this._options = { ...G, ...e };
  }
  init(e) {
    this._modelHandle = e, e.changeQueue().emitter().on("needsSend", this._needsSend), e.changeQueue().needsSend() && this._needsSend();
  }
}
function X(r) {
  return function(e, t) {
    const s = "$" + t, n = Symbol(t);
    Object.defineProperty(e, t, {
      get() {
        return this[s].get();
      },
      set(i) {
        this[s].set(i);
      }
    }), Object.defineProperty(e, s, {
      get() {
        let i = this[n];
        return i || (i = new z(r), this[n] = i), i;
      },
      enumerable: !0
    });
  };
}
function Y(r) {
  return function(e, t) {
    const s = "$" + t, n = Symbol(t);
    Object.defineProperty(e, t, {
      get() {
        return this[s].get();
      }
    }), Object.defineProperty(e, s, {
      get() {
        let i = this[n];
        return i || (i = new V(r), this[n] = i), i;
      },
      enumerable: !0
    });
  };
}
function Z(r) {
  return function(e, t) {
    const s = "$" + t, n = Symbol(t);
    Object.defineProperty(e, t, {
      get() {
        return this[s].get();
      },
      set(i) {
        this[s].set(i);
      }
    }), Object.defineProperty(e, s, {
      get() {
        let i = this[n];
        return i || (i = new B(r), this[n] = i), i;
      },
      enumerable: !0
    });
  };
}
const ue = {
  any: X,
  syncObject: Y,
  syncObjectRef: Z
};
function w(r) {
  return function(e, t, s) {
    const n = "$" + t, i = Symbol(t), c = s.value;
    s.value = function(...h) {
      this[n].call(...h);
    }, Object.defineProperty(e, n, {
      get() {
        let h = this[i];
        return h || (h = new d(r(this), c.bind(this)), h.call = h.call.bind(h), this[i] = h), h;
      },
      enumerable: !0
    });
  };
}
function K() {
  return w(o.host);
}
function ee() {
  return w(o.all);
}
function te() {
  return w(o.broadcast);
}
function se() {
  return w((r) => o.to(r.id()));
}
function ne(r) {
  return w(() => o.dynamic(r));
}
const de = {
  host: K,
  all: ee,
  broadcast: te,
  owner: se,
  dynamic: ne
};
export {
  o as Address,
  z as AnyField,
  ce as ArrayField,
  g as Authority,
  O as Channel,
  j as ConnectionList,
  U as ConnectionPlugin,
  q as Context,
  f as Emitter,
  u as Field,
  E as Model,
  oe as Presence,
  d as RPC,
  A as RPCHandler,
  ae as RPCPlugin,
  re as Router,
  le as SendLoopPlugin,
  p as SyncObject,
  V as SyncObjectField,
  B as SyncObjectRefField,
  he as SyncObjectRefSetField,
  ue as field,
  de as rpc
};
