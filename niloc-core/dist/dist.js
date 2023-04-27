var j = Object.defineProperty;
var m = (r, t, e) => t in r ? j(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var i = (r, t, e) => (m(r, typeof t != "symbol" ? t + "" : t, e), e);
var _;
((r) => {
  const t = {
    type: 0
    /* Broadcast */
  };
  function e() {
    return t;
  }
  r.broadcast = e;
  function s(o) {
    return { type: 1, id: o };
  }
  r.to = s;
  function n(o, u) {
    return o.type === 0 || u.type === 0 ? !0 : o.id === u.id;
  }
  r.match = n;
  function c(o) {
    switch (o.type) {
      case 0:
        return "*";
      case 1:
        return `:${o.id}`;
      default:
        return "?";
    }
  }
  r.toString = c;
  function h(o) {
    return o === "*" ? e() : o.startsWith(":") ? s(o.slice(1)) : null;
  }
  r.parse = h;
})(_ || (_ = {}));
class y {
  constructor() {
    i(this, "_inputListener", null);
    i(this, "_outputListeners", /* @__PURE__ */ new Set());
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
class S {
  constructor(t) {
    i(this, "_channel");
    i(this, "_mpsc", new y());
    i(this, "_input");
    i(this, "_output");
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
    i(this, "_id");
    i(this, "_address");
    i(this, "_channels", {});
    this.network = e, this._id = t, this._address = _.to(t), e.emitter().on("message", ({ peerId: s, channel: n, message: c }) => this._onMessage(s, n, c));
  }
  id() {
    return this._id;
  }
  channel(t) {
    return this._channels[t] || (this._channels[t] = this._createChannel(t)), this._channels[t].input();
  }
  _onMessage(t, e, s) {
    _.match(s.address, this._address) && this._channels[e] && this._channels[e].output().post(s);
    for (const n of this.network.peers())
      n.id() !== t && _.match(s.address, n.address()) && n.send(e, s);
  }
  _createChannel(t) {
    const e = new S(t);
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
    for (const c of this.network.peers())
      _.match(t, c.address()) && c.send(e, n);
  }
}
class g {
  constructor() {
    i(this, "_string", "");
  }
  write(t) {
    this._string += t;
  }
  toString(t) {
    return "  ".repeat(t) + this._string;
  }
}
class w {
  constructor() {
    i(this, "_indent", 0);
    i(this, "_string", "");
    i(this, "_line", new g());
  }
  write(t) {
    this._line.write(t);
  }
  writeLine(t) {
    this._line.write(t), this.nextLine();
  }
  nextLine() {
    this._string += this._line.toString(this._indent) + `
`, this._line = new g();
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
var I = Object.defineProperty, L = (r, t, e) => t in r ? I(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e, b = (r, t, e) => (L(r, typeof t != "symbol" ? t + "" : t, e), e);
class d {
  constructor() {
    b(this, "_listeners", {}), b(this, "_onceListeners", {});
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
class a {
  constructor() {
    i(this, "_index", -1);
    i(this, "_changeRequester", null);
    i(this, "_emitter", new d());
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
    const e = new w();
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
class l {
  constructor(t, e) {
    i(this, "_id");
    i(this, "_type");
    i(this, "_fields", null);
    this._id = t, this._type = e;
  }
  static setChangeRequester(t, e) {
    for (const s of t.fields())
      a.setChangeRequester(s, e);
  }
  static setModelHandle(t, e) {
    for (const s of t.fields())
      a.setModelHandle(s, e);
  }
  static toString(t) {
    const e = new w();
    return this.write(t, e), e.toString();
  }
  static write(t, e) {
    e.writeLine(`${t.type()}: ${t.id()} {`), e.startIndent();
    for (const s of t.fields())
      a.write(s, e);
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
      s instanceof a && (a.setIndex(s, t.length), t.push(s));
    }
    return t;
  }
}
let C = (r = 21) => crypto.getRandomValues(new Uint8Array(r)).reduce((t, e) => (e &= 63, e < 36 ? t += e.toString(36) : e < 62 ? t += (e - 26).toString(36).toUpperCase() : e > 62 ? t += "-" : t += "_", t), "");
var f;
((r) => {
  function t(e) {
    return {
      emitter() {
        return e.emitter;
      },
      get: e.get,
      requestObject(n, c) {
        return e.objectsEmitter.on(n, c), c(e.get(n)), {
          destroy() {
            e.objectsEmitter.off(n, c);
          }
        };
      }
    };
  }
  r.make = t;
})(f || (f = {}));
class O {
  constructor() {
    i(this, "_changes", /* @__PURE__ */ new Map());
    i(this, "_syncs", /* @__PURE__ */ new Set());
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
class R {
  constructor() {
    i(this, "_buffer", []);
    i(this, "_cursor", 0);
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
class v {
  constructor() {
    i(this, "_buffer", []);
    i(this, "_cursor", -1);
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
class x {
  constructor(t) {
    i(this, "_channel");
    i(this, "_emitter", new d());
    i(this, "_objectsEmitter", new d());
    i(this, "_templates", /* @__PURE__ */ new Map());
    i(this, "_objects", /* @__PURE__ */ new Map());
    i(this, "_handle");
    i(this, "_changeQueue", new O());
    i(this, "_reader", new R());
    i(this, "_writer", new v());
    i(this, "_plugins", []);
    i(this, "_onMessage", (t) => {
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
    this._channel = t.channel, this._channel.addListener(this._onMessage), this._handle = f.make({
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
    const s = e ?? C(), n = this._create(t, s);
    return this._changeQueue.sync(s), n;
  }
  tick() {
    const t = this._collectSyncs(), e = this._collectChanges();
    t.length > 0 && this._channel.post(_.broadcast(), { type: "sync", changes: t }), e.length > 0 && this._channel.post(_.broadcast(), { type: "change", changes: e });
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
    l.setChangeRequester(s, this._makeChangeRequester(e)), l.setModelHandle(s, this._handle), this._objects.set(e, s);
    for (const c of this._plugins)
      (n = c.beforeCreate) == null || n.call(c, s);
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
    return this._connectSyncsForObjects(this._objects.keys());
  }
  _collectSyncs() {
    return this._connectSyncsForObjects(this._changeQueue.syncs());
  }
  _connectSyncsForObjects(t) {
    const e = this._writer;
    for (const s of t) {
      const n = this._objects.get(s);
      n && (e.writeString(n.id()), e.writeString(n.type()), n.write(e));
    }
    return e.collect();
  }
  _collectChanges() {
    const t = this._writer;
    for (const { objectId: e, fields: s } of this._changeQueue.changes()) {
      const n = this._objects.get(e);
      if (!n)
        continue;
      t.writeString(e), t.writeInt(s.length);
      const c = t.cursor();
      t.writeInt(0);
      for (const o of s) {
        const u = n.fields()[o];
        t.writeInt(o), u.writeChange(t);
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
      let c = this._objects.get(s);
      if (c) {
        c.read(e);
        continue;
      }
      const h = this._templates.get(n);
      if (!h) {
        console.error("Could not create object with type", n);
        return;
      }
      c = this._create(h, s), c.read(e);
    }
  }
  _onChange(t) {
    const e = this._reader;
    for (e.feed(t); !e.empty(); ) {
      const s = e.readString(), n = e.readInt(), c = e.readInt(), h = this._objects.get(s);
      if (!h) {
        e.skip(c);
        continue;
      }
      for (let o = 0; o < n; o++) {
        const u = e.readInt();
        h.fields()[u].readChange(e);
      }
    }
  }
}
var p;
((r) => {
  function t(e, s) {
    return {
      type: e,
      create: (n) => new s(n, e)
    };
  }
  r.create = t;
})(p || (p = {}));
class k extends a {
  constructor(e) {
    super();
    i(this, "_value");
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
class H extends a {
  constructor(e, s) {
    super();
    i(this, "_object");
    i(this, "_changes", []);
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
      const c = e.readInt();
      this._object.fields()[c].readChange(e);
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
    l.setModelHandle(this._object, e);
  }
  onChangeRequester(e) {
    l.setChangeRequester(this._object, {
      change: (s) => {
        this._changes.push(s), e.change(this.index()), this.emitter().emit("changed");
      }
    });
  }
  toString(e) {
    l.write(this._object, e);
  }
}
class F extends a {
  constructor(e) {
    super();
    i(this, "_objectId");
    i(this, "_object", null);
    i(this, "_modelHandle", null);
    i(this, "_objectRequest", null);
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
    (s = this._objectRequest) == null || s.destroy(), this._objectId = e, this._object = null, e ? this._objectRequest = ((n = this._modelHandle) == null ? void 0 : n.requestObject(e, (c) => {
      this._object = c;
    })) ?? null : this._objectRequest = null, this.emitter().emit("changed");
  }
  onModelHandle(e) {
    this._modelHandle = e, this._objectId && this._setObjectId(this._objectId);
  }
  toString(e) {
    e.write("ref "), this._object ? l.write(this._object, e) : e.writeLine(`${this._objectId} (null)`);
  }
}
class J extends a {
  constructor() {
    super(...arguments);
    i(this, "_objects", /* @__PURE__ */ new Map());
    i(this, "_modelHandle", null);
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
    for (let c = 0; c < s; c++) {
      const h = e.readString();
      this._objects.set(h, ((n = this._modelHandle) == null ? void 0 : n.get(h)) ?? null);
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
export {
  _ as Address,
  k as AnyField,
  a as Field,
  x as Model,
  M as Router,
  l as SyncObject,
  H as SyncObjectField,
  F as SyncObjectRefField,
  J as SyncObjectRefSetField,
  p as Template
};
