var H = Object.defineProperty;
var M = (c, e, t) => e in c ? H(c, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : c[e] = t;
var i = (c, e, t) => (M(c, typeof e != "symbol" ? e + "" : e, t), t);
var o;
((c) => {
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
  c.all = n;
  function r() {
    return t;
  }
  c.broadcast = r;
  function h() {
    return s;
  }
  c.host = h;
  function a(_) {
    return { type: 2, id: _ };
  }
  c.to = a;
  function l(_) {
    return { type: 4, get: _ };
  }
  c.dynamic = l;
  function d(_, g, w) {
    return w.address().type === 1 || w.address().type === 0 || g.type === 0 ? !0 : g.type === 1 ? w.id() !== _ : g.type === 3 ? w.address().type === 3 : (g.type === 4 ? g.get() : g.id) === w.id();
  }
  c.match = d;
  function y(_) {
    switch (_.type) {
      case 0:
        return "*";
      case 1:
        return "#";
      case 2:
        return `:${_.id}`;
      case 4:
        return `:${_.get()}`;
      case 3:
        return "host";
      default:
        return "?";
    }
  }
  c.toString = y;
  function R(_) {
    return _ === "*" ? n() : _ === "#" ? r() : _ === "host" ? h() : _.startsWith(":") ? a(_.slice(1)) : null;
  }
  c.parse = R;
})(o || (o = {}));
class q {
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
class F {
  constructor(e) {
    i(this, "_channel");
    i(this, "_mpsc", new q());
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
class J {
  constructor(e, t) {
    i(this, "host");
    i(this, "userId");
    this.host = t, this.userId = e;
  }
}
class Z {
  constructor(e) {
    i(this, "_id");
    i(this, "_relay");
    i(this, "_address");
    i(this, "_self");
    i(this, "_context");
    i(this, "_channels", {});
    i(this, "network");
    this._id = e.id, this._relay = e.relay ?? !1, this._address = e.host ? o.host() : o.to(e.id), this._context = new J(e.id, e.host ?? !1), this._self = {
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
    const t = new F(e);
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
    for (const r of this.network.peers())
      o.match(this._id, e, r) && r.send(t, n);
    o.match(this._id, e, this._self) && this._receive(t, n);
  }
}
var N = Object.defineProperty, T = (c, e, t) => e in c ? N(c, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : c[e] = t, O = (c, e, t) => (T(c, typeof e != "symbol" ? e + "" : e, t), t);
class m {
  constructor() {
    O(this, "_listeners", {}), O(this, "_onceListeners", {});
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
var L;
((c) => {
  function e(t, s) {
    const n = [], r = new m();
    t.addListener((h) => {
      const [a, l] = h.data;
      r.emit(a.toString(), { ...h, data: l });
    });
    for (let h = 0; h < s; h++)
      n.push({
        post: (a, l) => {
          t.post(a, [h, l]);
        },
        addListener: (a) => {
          r.on(h.toString(), a);
        },
        removeListener: (a) => {
          r.off(h.toString(), a);
        }
      });
    return n;
  }
  c.split = e;
})(L || (L = {}));
var b;
((c) => {
  function e() {
    return (n, r) => r.host;
  }
  c.host = e;
  function t() {
    return (n, r) => n.id() === r.userId;
  }
  c.own = t;
  function s(n, r, h) {
    return n === !0 || n(r, h);
  }
  c.allows = s;
})(b || (b = {}));
class v {
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
    i(this, "_line", new v());
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
    i(this, "_index", -1);
    i(this, "_changeRequester", null);
    i(this, "_emitter", new m());
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
    i(this, "_id");
    i(this, "_type");
    i(this, "_fields", null);
    i(this, "_changeRequester");
    this._id = e, this._type = t;
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
  send() {
    this._changeRequester.send();
  }
  register(e) {
    return u.register(this.fields(), e);
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
let $ = (c = 21) => crypto.getRandomValues(new Uint8Array(c)).reduce((e, t) => (t &= 63, t < 36 ? e += t.toString(36) : t < 62 ? e += (t - 26).toString(36).toUpperCase() : t > 62 ? e += "-" : e += "_", e), "");
var j;
((c) => {
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
      requestObject(n, r) {
        return t.objectsEmitter.on(n, r), r(t.get(n)), {
          destroy() {
            t.objectsEmitter.off(n, r);
          }
        };
      }
    };
  }
  c.make = e;
})(j || (j = {}));
class E {
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
  changeForObject(e) {
    const t = this._changes.get(e);
    return this._changes.delete(e), t ?? null;
  }
}
class z {
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
class Q {
  constructor(e) {
    i(this, "_channel");
    i(this, "_context");
    i(this, "_emitter", new m());
    i(this, "_objectsEmitter", new m());
    i(this, "_templates", /* @__PURE__ */ new Map());
    i(this, "_objects", /* @__PURE__ */ new Map());
    i(this, "_handle");
    i(this, "_changeQueue", new E());
    i(this, "_reader", new z());
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
    this._channel = e.channel, this._channel.addListener(this._onMessage), this._context = e.context, this._handle = j.make({
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
    const s = t ?? $(), n = this._create(e, s);
    return this._changeQueue.sync(s), n;
  }
  send() {
    const e = this._collectSyncs(), t = this._collectChanges();
    e.length > 0 && this._channel.post(o.broadcast(), { type: "sync", changes: e }), t.length > 0 && this._channel.post(o.broadcast(), { type: "change", changes: t });
  }
  sendObject(e) {
    const t = this._collectSyncsForObjects([e]), s = this._changeQueue.changeForObject(e), n = s ? this._collectChangesForObjects([{ objectId: e, fields: s }]) : [];
    t.length > 0 && this._channel.post(o.broadcast(), { type: "sync", changes: t }), n.length > 0 && this._channel.post(o.broadcast(), { type: "change", changes: n });
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
    p.__setChangeRequester(s, this._makeChangeRequester(t)), p.__setModelHandle(s, this._handle), this._objects.set(t, s);
    for (const r of this._plugins)
      (n = r.beforeCreate) == null || n.call(r, s);
    return this._emitter.emit("created", s), this._objectsEmitter.emit(t, s), s;
  }
  _makeChangeRequester(e) {
    return {
      change: (t) => this._onChangeRequest(e, t),
      send: () => this.sendObject(e)
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
      const r = this._templates.get(n.type());
      r && b.allows(r.authority, n, this._context) && (t.writeString(n.id()), t.writeString(n.type()), n.write(t));
    }
    return t.collect();
  }
  _collectChanges() {
    return this._collectChangesForObjects(this._changeQueue.changes());
  }
  _collectChangesForObjects(e) {
    const t = this._writer;
    for (const { objectId: s, fields: n } of e) {
      const r = this._objects.get(s);
      if (!r)
        continue;
      const h = this._templates.get(r.type());
      if (!h || !b.allows(h.authority, r, this._context))
        continue;
      t.writeString(s), t.writeInt(n.length);
      const a = t.cursor();
      t.writeInt(0);
      for (const d of n) {
        const y = r.fields()[d];
        t.writeInt(d), y.writeChange(t), y.clearChange();
      }
      const l = t.cursor();
      t.setCursor(a), t.writeInt(l - a - 1), t.resume();
    }
    return t.collect();
  }
  _onSync(e) {
    const t = this._reader;
    for (t.feed(e); !t.empty(); ) {
      const s = t.readString(), n = t.readString();
      let r = this._objects.get(s);
      if (r) {
        r.read(t);
        continue;
      }
      const h = this._templates.get(n);
      if (!h) {
        console.error("Could not create object with type", n);
        return;
      }
      r = this._create(h, s), r.read(t);
    }
  }
  _onChange(e) {
    const t = this._reader;
    for (t.feed(e); !t.empty(); ) {
      const s = t.readString(), n = t.readInt(), r = t.readInt(), h = this._objects.get(s);
      if (!h) {
        t.skip(r);
        continue;
      }
      for (let a = 0; a < n; a++) {
        const l = t.readInt();
        h.fields()[l].readChange(t);
      }
    }
  }
}
var S;
((c) => {
  function e(t, s, n) {
    return {
      type: t,
      create: (r) => new s(r, t),
      authority: n ?? !0
    };
  }
  c.create = e;
})(S || (S = {}));
class D extends u {
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
          const h = e.readInt();
          for (let d = 0; d < h; d++)
            t.push(e.readJSON());
          break;
        case 1:
          const a = e.readInt();
          for (let d = 0; d < a; d++)
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
class B extends u {
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
class W extends u {
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
      const r = t.readInt();
      this._object.fields()[r].readChange(t);
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
    p.__setModelHandle(this._object, t);
  }
  onChangeRequester(t) {
    p.__setChangeRequester(this._object, {
      change: (s) => {
        this._changes.push(s), t.change(this.index()), this.emitter().emit("changed");
      },
      send: () => {
        t.send();
      }
    });
  }
  toString(t) {
    p.write(this._object, t);
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
    (s = this._objectRequest) == null || s.destroy(), this._objectId = t, this._object = null, t ? this._objectRequest = ((n = this._modelHandle) == null ? void 0 : n.requestObject(t, (r) => {
      this._object = r;
    })) ?? null : this._objectRequest = null, this.emitter().emit("changed");
  }
  onModelHandle(t) {
    this._modelHandle = t, this._objectId && this._setObjectId(this._objectId);
  }
  toString(t) {
    t.write("ref "), this._object ? p.write(this._object, t) : t.writeLine(`${this._objectId} (null)`);
  }
}
class G extends u {
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
    for (let r = 0; r < s; r++) {
      const h = t.readString();
      this._objects.set(h, ((n = this._modelHandle) == null ? void 0 : n.get(h)) ?? null);
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
var x;
((c) => {
  function e(h) {
    return new D(h);
  }
  c.any = e;
  function t(h) {
    return new B(h);
  }
  c.array = t;
  function s(h) {
    return new A(h);
  }
  c.ref = s;
  function n(h) {
    return new W(h);
  }
  c.object = n;
  function r() {
    return new G();
  }
  c.refSet = r;
})(x || (x = {}));
class V {
  constructor(e) {
    i(this, "_model", null);
    i(this, "_onConnected", (e) => {
      this._model && this._model.syncTo(o.to(e));
    });
    i(this, "_onSync", () => {
      this._model && this._model.syncTo(o.broadcast());
    });
    e.emitter().on("connected", this._onConnected), e.emitter().on("sync", this._onSync);
  }
  init(e) {
    this._model = e;
  }
}
class ee {
  constructor(e) {
    i(this, "_connectionList");
    i(this, "_model");
    i(this, "_emitter", new m());
    i(this, "_user");
    i(this, "_others", []);
    i(this, "_onUserCreated", (e) => {
      this._connectionList.isConnected(e.id()) && !this._others.includes(e) && (this._others.push(e), this._emitter.emit("changed", this.users()), this._emitter.emit("connected", e));
    });
    i(this, "_onConnected", (e) => {
      if (e === this._user.id() || this._others.some((s) => s.id() === e))
        return;
      const t = this._model.get(e);
      t && (this._others.push(t), this._emitter.emit("changed", this.users()), this._emitter.emit("connected", t));
    });
    i(this, "_onDisconnected", (e) => {
      if (e === this._user.id())
        return;
      const t = this._others.findIndex((s) => s.id() === e);
      t < 0 || (this._others.splice(t, 1), this._emitter.emit("changed", this.users()), this._emitter.emit("disconnected", e));
    });
    this._connectionList = e.connectionList, this._model = new Q({
      channel: e.channel,
      context: e.context
    });
    const t = S.create("user", e.factory, b.own());
    this._model.register(t), this._model.plugin(new V(e.connectionList)), this._user = this._model.instantiate(t, e.context.userId), e.connectionList.emitter().on("connected", this._onConnected), e.connectionList.emitter().on("disconnected", this._onDisconnected), this._model.emitter().on("created", (s) => this._onUserCreated(s));
    for (const s of this._connectionList.users())
      this._onConnected(s);
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
    for (const r of [this._user, ...this._others])
      t[r.id()] = r.register(e);
    function s(r) {
      t[r.id()] = r.register(e);
    }
    function n(r) {
      const h = t[r];
      h && (h(), delete t[r]);
    }
    return this.emitter().on("connected", s), this.emitter().on("disconnected", n), () => {
      this.emitter().off("connected", s), this.emitter().off("disconnected", n);
      for (const r of Object.values(t))
        r();
    };
  }
}
class C {
  constructor(e, t) {
    i(this, "_isOwner");
    i(this, "_channel");
    i(this, "_users", /* @__PURE__ */ new Set());
    i(this, "_emitter", new m());
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
    return new C(!0, e);
  }
  static client(e) {
    return new C(!1, e);
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
class f {
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
    return new f(o.host(), e);
  }
  static target(e, t) {
    return new f(o.to(e), t);
  }
  static broadcast(e) {
    return new f(o.broadcast(), e);
  }
  static all(e) {
    return new f(o.all(), e);
  }
  static dynamic(e, t) {
    return new f(o.dynamic(e), t);
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
var I;
((c) => {
  function e(t, s) {
    return { id: t, args: s };
  }
  c.make = e;
})(I || (I = {}));
class K {
  constructor(e, t) {
    i(this, "_self");
    i(this, "_channel");
    i(this, "_rpcs", {});
    i(this, "_onMessage", (e) => {
      const t = e.data, s = e.originId;
      o.match(e.originId, e.address, this._self) && this._onRequest(t, s);
    });
    this._self = e, this._channel = t, this._channel.addListener(this._onMessage);
  }
  register(e, t) {
    if (this._rpcs[t]) {
      console.error("Trying to register rpc twice:", t);
      return;
    }
    this._rpcs[t] = e, f.setCallHandler(e, this._makeCallHandler(t));
  }
  infuse(e, t) {
    for (const s in e)
      e[s] instanceof f && this.register(e[s], `${t}.${s}`);
  }
  _makeCallHandler(e) {
    return {
      call: (s, n) => {
        const r = I.make(e, n);
        this._channel.post(s, r);
      }
    };
  }
  _onRequest(e, t) {
    const { id: s, args: n } = e, r = this._rpcs[s];
    if (!r) {
      console.error(`Received unhandled RPC request '${s}', originated from ${t}`);
      return;
    }
    f.call(r, n);
  }
}
class te {
  constructor(e, t) {
    i(this, "_handler");
    this._handler = new K(e, t);
  }
  beforeCreate(e) {
    let t = 0;
    for (const s in e) {
      const n = e[s];
      n instanceof f && this._handler.register(n, `${e.id()}.${t++}`);
    }
  }
}
export {
  o as Address,
  D as AnyField,
  B as ArrayField,
  b as Authority,
  L as Channel,
  C as ConnectionList,
  V as ConnectionPlugin,
  J as Context,
  m as Emitter,
  u as Field,
  Q as Model,
  ee as Presence,
  f as RPC,
  K as RPCHandler,
  te as RPCPlugin,
  Z as Router,
  p as SyncObject,
  W as SyncObjectField,
  A as SyncObjectRefField,
  G as SyncObjectRefSetField,
  S as Template,
  x as field
};
