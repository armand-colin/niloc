var I = Object.defineProperty;
var C = (i, t, e) => t in i ? I(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[t] = e;
var r = (i, t, e) => (C(i, typeof t != "symbol" ? t + "" : t, e), e);
var u;
((i) => {
  const t = {
    type: 0
    /* Broadcast */
  };
  function e() {
    return t;
  }
  i.broadcast = e;
  function s(c) {
    return { type: 1, id: c };
  }
  i.to = s;
  function n(c, a) {
    return c.type === 0 || a.type === 0 ? !0 : c.id === a.id;
  }
  i.match = n;
  function o(c) {
    switch (c.type) {
      case 0:
        return "*";
      case 1:
        return `:${c.id}`;
      default:
        return "?";
    }
  }
  i.toString = o;
  function h(c) {
    return c === "*" ? e() : c.startsWith(":") ? s(c.slice(1)) : null;
  }
  i.parse = h;
})(u || (u = {}));
var L = Object.defineProperty, R = (i, t, e) => t in i ? L(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[t] = e, m = (i, t, e) => (R(i, typeof t != "symbol" ? t + "" : t, e), e);
class f {
  constructor() {
    m(this, "_listeners", {}), m(this, "_onceListeners", {});
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
class O {
  constructor(t, e) {
    r(this, "_address");
    r(this, "_emitter");
    r(this, "_id");
    this.network = e, this._id = t, this._address = u.to(t), this._emitter = new f(), e.emitter().on("message", ({ peerId: s, channel: n, message: o }) => this._onMessage(s, n, o));
  }
  emitter() {
    return this._emitter;
  }
  send(t, e, s) {
    const n = {
      originId: this._id,
      address: t,
      data: s
    };
    console.log("ROUTER:send", n);
    for (const o of this.network.peers())
      console.log("ROUTER:test", o.id()), u.match(t, o.address()) && (console.log("ROUTER:match"), o.send(e, n));
  }
  id() {
    return this._id;
  }
  _onMessage(t, e, s) {
    u.match(s.address, this._address) && this._emitter.emit("message", { message: s, channel: e });
    for (const n of this.network.peers())
      n.id() !== t && u.match(s.address, n.address()) && n.send(e, s);
  }
}
let y = (i = 21) => crypto.getRandomValues(new Uint8Array(i)).reduce((t, e) => (e &= 63, e < 36 ? t += e.toString(36) : e < 62 ? t += (e - 26).toString(36).toUpperCase() : e > 62 ? t += "-" : t += "_", t), "");
function q(i) {
  try {
    const t = i();
    return Promise.resolve(t);
  } catch (t) {
    return Promise.reject(t);
  }
}
var l;
((i) => {
  function t(n, o, h) {
    return { type: 0, id: n, name: o, data: h };
  }
  i.request = t;
  function e(n, o) {
    return { type: 1, id: n, data: o };
  }
  i.response = e;
  function s(n, o) {
    return { type: 2, id: n, reason: o };
  }
  i.error = s;
})(l || (l = {}));
class v {
  constructor() {
    r(this, "_emitter", new f());
    r(this, "_handlers", {});
    r(this, "_resultEmitter", new f());
  }
  emitter() {
    return this._emitter;
  }
  handle(t, e) {
    if (this._handlers[t]) {
      console.error(`Cannot handle the same RPC multiple times (${t})`);
      return;
    }
    this._handlers[t] = e;
  }
  request(t, e, s) {
    const n = y(), o = l.request(n, t, s);
    return new Promise((h, c) => {
      let a = setTimeout(() => {
        a = null, this._resultEmitter.emit(n, { type: 2, data: "Timed out" });
      }, 2e4);
      this._resultEmitter.once(n, ({ type: p, data: b }) => {
        a && clearTimeout(a), p === 2 ? c(b) : p === 1 && h(b);
      }), this._emitter.emit("message", { targetId: e, message: o });
    });
  }
  post(t) {
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
  }
  _onRequest(t, e) {
    const { id: s, name: n, data: o } = t, h = this._handlers[n];
    if (!h) {
      console.error(`Received unhandled RPC request '${n}', originated from ${e}`);
      const c = l.error(s, `Unhandled RPC by the receiver ${n}`);
      this._emitter.emit("message", { targetId: e, message: c });
      return;
    }
    q(() => h({ data: o, originId: e })).then((c) => {
      const a = l.response(s, c);
      this._emitter.emit("message", { targetId: e, message: a });
    }).catch((c) => {
      console.error(`Error while handling RPC '${n}':`, c);
      const a = l.error(s, "Receiver got an error while responding");
      this._emitter.emit("message", { targetId: e, message: a });
    });
  }
  _onResponse(t) {
    const { id: e, data: s } = t;
    this._resultEmitter.emit(e, { type: 1, data: s });
  }
  _onError(t) {
    const { id: e, reason: s } = t;
    this._resultEmitter.emit(e, { type: 2, data: s });
  }
}
class M {
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
class k {
  constructor(t) {
    r(this, "_channel");
    r(this, "_mpsc", new M());
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
class N {
  constructor(t, e) {
    r(this, "_rpc");
    r(this, "_channels", {});
    r(this, "router");
    this.id = t, this.network = e, this.router = new O(t, e), this.router.emitter().on("message", ({ message: s, channel: n }) => this._onMessage(s, n)), this._rpc = new v();
  }
  rpc() {
    return this._rpc;
  }
  channel(t) {
    return this._channels[t] || (this._channels[t] = this._createChannel(t)), this._channels[t].input();
  }
  _createChannel(t) {
    const e = new k(t);
    return e.output().setListener((s, n) => {
      this.router.send(s, t, n);
    }), e;
  }
  _onMessage(t, e) {
    console.log("APPLICATION:message", e, t), this._channels[e] && this._channels[e].output().post(t);
  }
}
class w {
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
class S {
  constructor() {
    r(this, "_indent", 0);
    r(this, "_string", "");
    r(this, "_line", new w());
  }
  write(t) {
    this._line.write(t);
  }
  writeLine(t) {
    this._line.write(t), this.nextLine();
  }
  nextLine() {
    this._string += this._line.toString(this._indent) + `
`, this._line = new w();
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
    const e = new S();
    return this.write(t, e), e.toString();
  }
  static write(t, e) {
    t.toString(e);
  }
  index() {
    return this._index;
  }
  readChange(t) {
    this.read(t);
  }
  writeChange(t) {
    this.write(t);
  }
  changed() {
    var t;
    (t = this._changeRequester) == null || t.change(this._index);
  }
  onChangeRequester(t) {
  }
  onModelHandle(t) {
  }
  toString(t) {
    t.writeLine("???");
  }
}
class d {
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
    const e = new S();
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
var g;
((i) => {
  function t(e) {
    return {
      emitter() {
        return e.emitter;
      },
      get: e.get,
      requestObject(n, o) {
        return e.objectsEmitter.on(n, o), o(e.get(n)), {
          destroy() {
            e.objectsEmitter.off(n, o);
          }
        };
      }
    };
  }
  i.make = t;
})(g || (g = {}));
class x {
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
class H {
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
class E {
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
class P {
  constructor(t) {
    r(this, "_channel");
    r(this, "_emitter", new f());
    r(this, "_objectsEmitter", new f());
    r(this, "_templates", /* @__PURE__ */ new Map());
    r(this, "_objects", /* @__PURE__ */ new Map());
    r(this, "_handle");
    r(this, "_changeQueue", new x());
    r(this, "_reader", new H());
    r(this, "_writer", new E());
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
    this._channel = t.channel, this._channel.addListener(this._onMessage), this._handle = g.make({
      emitter: this._emitter,
      objectsEmitter: this._objectsEmitter,
      get: (e) => this.get(e)
    });
  }
  emitter() {
    return this._emitter;
  }
  register(t) {
    this._templates.set(t.type, t);
  }
  instantiate(t, e) {
    const s = e ?? y(), n = this._create(t, s);
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
    const s = t.create(e);
    return d.setChangeRequester(s, this._makeChangeRequester(e)), d.setModelHandle(s, this._handle), this._objects.set(e, s), this._emitter.emit("created", s), this._objectsEmitter.emit(e, s), s;
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
      const o = t.cursor();
      t.writeInt(0);
      for (const c of s) {
        const a = n.fields()[c];
        t.writeInt(c), a.writeChange(t);
      }
      const h = t.cursor();
      t.setCursor(o), t.writeInt(h - o - 1), t.resume();
    }
    return t.collect();
  }
  _onSync(t) {
    const e = this._reader;
    for (e.feed(t); !e.empty(); ) {
      const s = e.readString(), n = e.readString();
      let o = this._objects.get(s);
      if (o) {
        o.read(e);
        continue;
      }
      const h = this._templates.get(n);
      if (!h) {
        console.error("Could not create object with type", n);
        return;
      }
      o = this._create(h, s), o.read(e);
    }
  }
  _onChange(t) {
    const e = this._reader;
    for (e.feed(t); !e.empty(); ) {
      const s = e.readString(), n = e.readInt(), o = e.readInt(), h = this._objects.get(s);
      if (!h) {
        e.skip(o);
        continue;
      }
      for (let c = 0; c < n; c++) {
        const a = e.readInt();
        h.fields()[a].readChange(e);
      }
    }
  }
}
var j;
((i) => {
  function t(e, s) {
    return {
      type: e,
      create: (n) => new s(n, e)
    };
  }
  i.create = t;
})(j || (j = {}));
class J extends _ {
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
    this._value = e.readJSON();
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
    this._object.read(e);
  }
  write(e) {
    this._object.write(e);
  }
  readChange(e) {
    const s = e.readInt();
    for (let n = 0; n < s; n++) {
      const o = e.readInt();
      this._object.fields()[o].readChange(e);
    }
  }
  writeChange(e) {
    const s = this._changes.length;
    e.writeInt(s);
    for (const n of this._changes)
      e.writeInt(n), this._object.fields()[n].writeChange(e);
    this._changes = [];
  }
  onModelHandle(e) {
    d.setModelHandle(this._object, e);
  }
  onChangeRequester(e) {
    d.setChangeRequester(this._object, {
      change: (s) => {
        this._changes.push(s), e.change(this.index());
      }
    });
  }
  toString(e) {
    d.write(this._object, e);
  }
}
class $ extends _ {
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
    s !== this._objectId && this._setObjectId(s);
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
    (s = this._objectRequest) == null || s.destroy(), this._objectId = e, this._object = null, e ? this._objectRequest = ((n = this._modelHandle) == null ? void 0 : n.requestObject(e, (o) => {
      this._object = o;
    })) ?? null : this._objectRequest = null;
  }
  onModelHandle(e) {
    this._modelHandle = e, this._objectId && this._setObjectId(this._objectId);
  }
  toString(e) {
    e.write("ref "), this._object ? d.write(this._object, e) : e.writeLine(`${this._objectId} (null)`);
  }
}
class A extends _ {
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
    for (let o = 0; o < s; o++) {
      const h = e.readString();
      this._objects.set(h, ((n = this._modelHandle) == null ? void 0 : n.get(h)) ?? null);
    }
  }
  write(e) {
    e.writeInt(this._objects.size);
    for (const s of this._objects.keys())
      e.writeString(s);
  }
  onModelHandle(e) {
    this._modelHandle = e, this._modelHandle.emitter().on("created", (s) => {
      const n = s.id();
      this._objects.has(n) && this._objects.set(n, s);
    });
  }
}
export {
  u as Address,
  J as AnyField,
  N as Application,
  _ as Field,
  P as Model,
  O as Router,
  d as SyncObject,
  T as SyncObjectField,
  $ as SyncObjectRefField,
  A as SyncObjectRefSetField,
  j as Template
};
