var R = Object.defineProperty;
var O = (r, t, e) => t in r ? R(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var i = (r, t, e) => (O(r, typeof t != "symbol" ? t + "" : t, e), e);
var l;
((r) => {
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
  r.broadcast = s;
  function n() {
    return e;
  }
  r.host = n;
  function c(a) {
    return { type: 1, id: a };
  }
  r.to = c;
  function o(a, p, b) {
    return a.type === 0 || b.type === 0 ? !0 : a.type === 2 ? b.type === 2 : a.id === p;
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
  function _(a) {
    return a === "*" ? s() : a === "host" ? n() : a.startsWith(":") ? c(a.slice(1)) : null;
  }
  r.parse = _;
})(l || (l = {}));
class k {
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
class q {
  constructor(t) {
    i(this, "_channel");
    i(this, "_mpsc", new k());
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
class J {
  constructor(t) {
    i(this, "_channels", {});
    this.network = t, t.emitter().on("message", ({ peerId: e, channel: s, message: n }) => this._onMessage(e, s, n));
  }
  channel(t) {
    return this._channels[t] || (this._channels[t] = this._createChannel(t)), this._channels[t].input();
  }
  _onMessage(t, e, s) {
    l.match(s.address, this.network.id(), this.network.address()) && this._channels[e] && this._channels[e].output().post(s);
    for (const n of this.network.peers())
      n.id() !== t && l.match(s.address, n.id(), n.address()) && n.send(e, s);
  }
  _createChannel(t) {
    const e = new q(t);
    return e.output().setListener((s, n) => {
      this._send(s, t, n);
    }), e;
  }
  _send(t, e, s) {
    const n = {
      originId: this.network.id(),
      address: t,
      data: s
    };
    for (const c of this.network.peers())
      l.match(t, c.id(), c.address()) && c.send(e, n);
  }
}
class y {
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
class C {
  constructor() {
    i(this, "_indent", 0);
    i(this, "_string", "");
    i(this, "_line", new y());
  }
  write(t) {
    this._line.write(t);
  }
  writeLine(t) {
    this._line.write(t), this.nextLine();
  }
  nextLine() {
    this._string += this._line.toString(this._indent) + `
`, this._line = new y();
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
var v = Object.defineProperty, H = (r, t, e) => t in r ? v(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e, S = (r, t, e) => (H(r, typeof t != "symbol" ? t + "" : t, e), e);
class m {
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
class u {
  constructor() {
    i(this, "_index", -1);
    i(this, "_changeRequester", null);
    i(this, "_emitter", new m());
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
    const e = new C();
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
class g {
  constructor(t, e) {
    i(this, "_id");
    i(this, "_type");
    i(this, "_fields", null);
    this._id = t, this._type = e;
  }
  static setChangeRequester(t, e) {
    for (const s of t.fields())
      u.setChangeRequester(s, e);
  }
  static setModelHandle(t, e) {
    for (const s of t.fields())
      u.setModelHandle(s, e);
  }
  static toString(t) {
    const e = new C();
    return this.write(t, e), e.toString();
  }
  static write(t, e) {
    e.writeLine(`${t.type()}: ${t.id()} {`), e.startIndent();
    for (const s of t.fields())
      u.write(s, e);
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
      s instanceof u && (u.setIndex(s, t.length), t.push(s));
    }
    return t;
  }
}
let L = (r = 21) => crypto.getRandomValues(new Uint8Array(r)).reduce((t, e) => (e &= 63, e < 36 ? t += e.toString(36) : e < 62 ? t += (e - 26).toString(36).toUpperCase() : e > 62 ? t += "-" : t += "_", t), "");
var w;
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
})(w || (w = {}));
class M {
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
class x {
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
class F {
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
class N {
  constructor(t) {
    i(this, "_channel");
    i(this, "_emitter", new m());
    i(this, "_objectsEmitter", new m());
    i(this, "_templates", /* @__PURE__ */ new Map());
    i(this, "_objects", /* @__PURE__ */ new Map());
    i(this, "_handle");
    i(this, "_changeQueue", new M());
    i(this, "_reader", new x());
    i(this, "_writer", new F());
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
    this._channel = t.channel, this._channel.addListener(this._onMessage), this._handle = w.make({
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
    const s = e ?? L(), n = this._create(t, s);
    return this._changeQueue.sync(s), n;
  }
  tick() {
    const t = this._collectSyncs(), e = this._collectChanges();
    t.length > 0 && this._channel.post(l.broadcast(), { type: "sync", changes: t }), e.length > 0 && this._channel.post(l.broadcast(), { type: "change", changes: e });
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
    g.setChangeRequester(s, this._makeChangeRequester(e)), g.setModelHandle(s, this._handle), this._objects.set(e, s);
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
      for (const h of s) {
        const _ = n.fields()[h];
        t.writeInt(h), _.writeChange(t);
      }
      const o = t.cursor();
      t.setCursor(c), t.writeInt(o - c - 1), t.resume();
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
      const o = this._templates.get(n);
      if (!o) {
        console.error("Could not create object with type", n);
        return;
      }
      c = this._create(o, s), c.read(e);
    }
  }
  _onChange(t) {
    const e = this._reader;
    for (e.feed(t); !e.empty(); ) {
      const s = e.readString(), n = e.readInt(), c = e.readInt(), o = this._objects.get(s);
      if (!o) {
        e.skip(c);
        continue;
      }
      for (let h = 0; h < n; h++) {
        const _ = e.readInt();
        o.fields()[_].readChange(e);
      }
    }
  }
}
var I;
((r) => {
  function t(e, s) {
    return {
      type: e,
      create: (n) => new s(n, e)
    };
  }
  r.create = t;
})(I || (I = {}));
class $ extends u {
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
class T extends u {
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
    g.setModelHandle(this._object, e);
  }
  onChangeRequester(e) {
    g.setChangeRequester(this._object, {
      change: (s) => {
        this._changes.push(s), e.change(this.index()), this.emitter().emit("changed");
      }
    });
  }
  toString(e) {
    g.write(this._object, e);
  }
}
class Q extends u {
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
    e.write("ref "), this._object ? g.write(this._object, e) : e.writeLine(`${this._objectId} (null)`);
  }
}
class z extends u {
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
      const o = e.readString();
      this._objects.set(o, ((n = this._modelHandle) == null ? void 0 : n.get(o)) ?? null);
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
class d {
  constructor(t, e) {
    i(this, "_callback");
    i(this, "_callHandler", null);
    i(this, "address");
    this._callback = e, this.address = t;
  }
  static setCallHandler(t, e) {
    t._callHandler = e;
  }
  static host(t) {
    return new d(l.host(), t);
  }
  static target(t, e) {
    return new d(l.to(t), e);
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
var f;
((r) => {
  function t(n, c, o) {
    return { type: 0, id: n, name: c, args: o };
  }
  r.request = t;
  function e(n, c) {
    return { type: 1, id: n, result: c };
  }
  r.response = e;
  function s(n, c) {
    return { type: 2, id: n, reason: c };
  }
  r.error = s;
})(f || (f = {}));
class E {
  constructor(t, e, s) {
    i(this, "_id");
    i(this, "_address");
    i(this, "_channel");
    i(this, "_rpcs", {});
    i(this, "_resultEmitter", new m());
    i(this, "_onMessage", (t) => {
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
    this._id = t, this._address = e, this._channel = s, this._channel.addListener(this._onMessage);
  }
  register(t, e) {
    if (this._rpcs[e]) {
      console.error("Trying to register rpc twice:", e);
      return;
    }
    this._rpcs[e] = t, d.setCallHandler(t, this._makeCallHandler(t, e));
  }
  _makeCallHandler(t, e) {
    return {
      call: (n, c) => {
        if (l.match(n, this._id, this._address))
          return d.call(t, c);
        const o = L(), h = f.request(o, e, c);
        return new Promise((_, a) => {
          let p = setTimeout(() => {
            p = null, this._resultEmitter.emit(o, { type: 2, data: "Timed out" });
          }, 2e4);
          this._resultEmitter.once(o, ({ type: b, data: j }) => {
            p && clearTimeout(p), b === 2 ? a(j) : b === 1 && _(j);
          }), this._channel.post(n, h);
        });
      }
    };
  }
  _onRequest(t, e) {
    const { id: s, name: n, args: c } = t, o = this._rpcs[n];
    if (!o) {
      console.error(`Received unhandled RPC request '${n}', originated from ${e}`);
      const h = f.error(s, `Unhandled RPC by the receiver ${n}`);
      this._channel.post(l.to(e), h);
      return;
    }
    d.call(o, c).then((h) => {
      const _ = f.response(s, h);
      this._channel.post(l.to(e), _);
    }).catch((h) => {
      console.error(`Error while handling RPC '${n}':`, h);
      const _ = f.error(s, "Receiver got an error while responding");
      this._channel.post(l.to(e), _);
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
class B {
  constructor(t, e, s) {
    i(this, "_handler");
    this._handler = new E(t, e, s);
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
  l as Address,
  $ as AnyField,
  u as Field,
  N as Model,
  d as RPC,
  E as RPCHandler,
  B as RPCPlugin,
  J as Router,
  g as SyncObject,
  T as SyncObjectField,
  Q as SyncObjectRefField,
  z as SyncObjectRefSetField,
  I as Template
};
