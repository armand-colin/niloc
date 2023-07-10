var k = Object.defineProperty;
var v = (o, e, t) => e in o ? k(o, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : o[e] = t;
var i = (o, e, t) => (v(o, typeof e != "symbol" ? e + "" : e, t), t);
var a;
((o) => {
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
  o.broadcast = s;
  function n() {
    return t;
  }
  o.host = n;
  function r(h) {
    return { type: 1, id: h };
  }
  o.to = r;
  function c(h, f) {
    return h.type === 0 || f.address().type === 0 ? !0 : h.type === 2 ? f.address().type === 2 : h.id === f.id();
  }
  o.match = c;
  function l(h) {
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
  o.toString = l;
  function u(h) {
    return h === "*" ? s() : h === "host" ? n() : h.startsWith(":") ? r(h.slice(1)) : null;
  }
  o.parse = u;
})(a || (a = {}));
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
class x {
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
class H {
  constructor(e, t) {
    i(this, "host");
    i(this, "userId");
    this.host = t, this.userId = e;
  }
}
class U {
  constructor(e) {
    i(this, "_id");
    i(this, "_address");
    i(this, "_self");
    i(this, "_context");
    i(this, "_channels", {});
    i(this, "network");
    this._id = e.id, this._address = e.host ? a.host() : a.to(e.id), this._context = new H(e.id, e.host ?? !1), this._self = {
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
    a.match(s.address, this._self) && this._channels[t] && this._channels[t].output().post(s);
    for (const n of this.network.peers())
      n.id() !== e && a.match(s.address, n) && n.send(t, s);
  }
  _createChannel(e) {
    const t = new x(e);
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
      a.match(e, r) && r.send(t, n);
  }
}
var b;
((o) => {
  function e() {
    return (n, r) => r.host;
  }
  o.host = e;
  function t() {
    return (n, r) => n.id() === r.userId;
  }
  o.own = t;
  function s(n, r, c) {
    return n === !0 || n(r, c);
  }
  o.allows = s;
})(b || (b = {}));
class S {
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
class R {
  constructor() {
    i(this, "_indent", 0);
    i(this, "_string", "");
    i(this, "_line", new S());
  }
  write(e) {
    this._line.write(e);
  }
  writeLine(e) {
    this._line.write(e), this.nextLine();
  }
  nextLine() {
    this._string += this._line.toString(this._indent) + `
`, this._line = new S();
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
    i(this, "_index", -1);
    i(this, "_changeRequester", null);
    i(this, "_emitter", new w());
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
    const t = new R();
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
class p {
  constructor(e, t) {
    i(this, "_id");
    i(this, "_type");
    i(this, "_fields", null);
    this._id = e, this._type = t;
  }
  static setChangeRequester(e, t) {
    for (const s of e.fields())
      _.setChangeRequester(s, t);
  }
  static setModelHandle(e, t) {
    for (const s of e.fields())
      _.setModelHandle(s, t);
  }
  static toString(e) {
    const t = new R();
    return this.write(e, t), t.toString();
  }
  static write(e, t) {
    t.writeLine(`${e.type()}: ${e.id()} {`), t.startIndent();
    for (const s of e.fields())
      _.write(s, t);
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
      s instanceof _ && (_.setIndex(s, e.length), e.push(s));
    }
    return e;
  }
}
let O = (o = 21) => crypto.getRandomValues(new Uint8Array(o)).reduce((e, t) => (t &= 63, t < 36 ? e += t.toString(36) : t < 62 ? e += (t - 26).toString(36).toUpperCase() : t > 62 ? e += "-" : e += "_", e), "");
var m;
((o) => {
  function e(t) {
    return {
      emitter() {
        return t.emitter;
      },
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
  o.make = e;
})(m || (m = {}));
class M {
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
class E {
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
class F {
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
class W {
  constructor(e) {
    i(this, "_channel");
    i(this, "_context");
    i(this, "_emitter", new w());
    i(this, "_objectsEmitter", new w());
    i(this, "_templates", /* @__PURE__ */ new Map());
    i(this, "_objects", /* @__PURE__ */ new Map());
    i(this, "_handle");
    i(this, "_changeQueue", new M());
    i(this, "_reader", new E());
    i(this, "_writer", new F());
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
    this._channel = e.channel, this._channel.addListener(this._onMessage), this._context = e.context, this._handle = m.make({
      emitter: this._emitter,
      objectsEmitter: this._objectsEmitter,
      get: (t) => this.get(t)
    });
  }
  emitter() {
    return this._emitter;
  }
  plugin(e) {
    this._plugins.push(e);
  }
  register(e) {
    this._templates.set(e.type, e);
  }
  instantiate(e, t) {
    const s = t ?? O(), n = this._create(e, s);
    return this._changeQueue.sync(s), n;
  }
  tick() {
    const e = this._collectSyncs(), t = this._collectChanges();
    e.length > 0 && this._channel.post(a.broadcast(), { type: "sync", changes: e }), t.length > 0 && this._channel.post(a.broadcast(), { type: "change", changes: t });
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
    p.setChangeRequester(s, this._makeChangeRequester(t)), p.setModelHandle(s, this._handle), this._objects.set(t, s);
    for (const r of this._plugins)
      (n = r.beforeCreate) == null || n.call(r, s);
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
      const r = this._templates.get(n.type());
      r && b.allows(r.authority, n, this._context) && (t.writeString(n.id()), t.writeString(n.type()), n.write(t));
    }
    return t.collect();
  }
  _collectChanges() {
    const e = this._writer;
    for (const { objectId: t, fields: s } of this._changeQueue.changes()) {
      const n = this._objects.get(t);
      if (!n)
        continue;
      const r = this._templates.get(n.type());
      if (!r || !b.allows(r.authority, n, this._context))
        continue;
      e.writeString(t), e.writeInt(s.length);
      const c = e.cursor();
      e.writeInt(0);
      for (const u of s) {
        const h = n.fields()[u];
        e.writeInt(u), h.writeChange(e);
      }
      const l = e.cursor();
      e.setCursor(c), e.writeInt(l - c - 1), e.resume();
    }
    return e.collect();
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
      const c = this._templates.get(n);
      if (!c) {
        console.error("Could not create object with type", n);
        return;
      }
      r = this._create(c, s), r.read(t);
    }
  }
  _onChange(e) {
    const t = this._reader;
    for (t.feed(e); !t.empty(); ) {
      const s = t.readString(), n = t.readInt(), r = t.readInt(), c = this._objects.get(s);
      if (!c) {
        t.skip(r);
        continue;
      }
      for (let l = 0; l < n; l++) {
        const u = t.readInt();
        c.fields()[u].readChange(t);
      }
    }
  }
}
var I;
((o) => {
  function e(t, s, n) {
    return {
      type: t,
      create: (r) => new s(r, t),
      authority: n ?? !0
    };
  }
  o.create = e;
})(I || (I = {}));
class P extends _ {
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
class $ extends _ {
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
    this._changes = [];
  }
  onModelHandle(t) {
    p.setModelHandle(this._object, t);
  }
  onChangeRequester(t) {
    p.setChangeRequester(this._object, {
      change: (s) => {
        this._changes.push(s), t.change(this.index()), this.emitter().emit("changed");
      }
    });
  }
  toString(t) {
    p.write(this._object, t);
  }
}
class J extends _ {
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
class N extends _ {
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
      const c = t.readString();
      this._objects.set(c, ((n = this._modelHandle) == null ? void 0 : n.get(c)) ?? null);
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
var C;
((o) => {
  function e(r) {
    return new P(r);
  }
  o.any = e;
  function t(r) {
    return new J(r);
  }
  o.ref = t;
  function s(r) {
    return new $(r);
  }
  o.object = s;
  function n() {
    return new N();
  }
  o.refSet = n;
})(C || (C = {}));
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
    return new d(a.host(), e);
  }
  static target(e, t) {
    return new d(a.to(e), t);
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
var g;
((o) => {
  function e(n, r, c) {
    return { type: 0, id: n, name: r, args: c };
  }
  o.request = e;
  function t(n, r) {
    return { type: 1, id: n, result: r };
  }
  o.response = t;
  function s(n, r) {
    return { type: 2, id: n, reason: r };
  }
  o.error = s;
})(g || (g = {}));
class T {
  constructor(e, t) {
    i(this, "_self");
    i(this, "_channel");
    i(this, "_rpcs", {});
    i(this, "_resultEmitter", new w());
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
      call: (n, r) => {
        if (a.match(n, this._self))
          return d.call(e, r);
        const c = O(), l = g.request(c, t, r);
        return new Promise((u, h) => {
          let f = setTimeout(() => {
            f = null, this._resultEmitter.emit(c, { type: 2, data: "Timed out" });
          }, 2e4);
          this._resultEmitter.once(c, ({ type: y, data: j }) => {
            f && clearTimeout(f), y === 2 ? h(j) : y === 1 && u(j);
          }), this._channel.post(n, l);
        });
      }
    };
  }
  _onRequest(e, t) {
    const { id: s, name: n, args: r } = e, c = this._rpcs[n];
    if (!c) {
      console.error(`Received unhandled RPC request '${n}', originated from ${t}`);
      const l = g.error(s, `Unhandled RPC by the receiver ${n}`);
      this._channel.post(a.to(t), l);
      return;
    }
    d.call(c, r).then((l) => {
      const u = g.response(s, l);
      this._channel.post(a.to(t), u);
    }).catch((l) => {
      console.error(`Error while handling RPC '${n}':`, l);
      const u = g.error(s, "Receiver got an error while responding");
      this._channel.post(a.to(t), u);
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
class D {
  constructor(e, t) {
    i(this, "_handler");
    this._handler = new T(e, t);
  }
  beforeCreate(e) {
    let t = 0;
    for (const s in e) {
      const n = e[s];
      n instanceof d && this._handler.register(n, `${e.id()}.${t++}`);
    }
  }
}
var Q = Object.defineProperty, z = (o, e, t) => e in o ? Q(o, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : o[e] = t, L = (o, e, t) => (z(o, typeof e != "symbol" ? e + "" : e, t), t);
class w {
  constructor() {
    L(this, "_listeners", {}), L(this, "_onceListeners", {});
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
export {
  a as Address,
  P as AnyField,
  b as Authority,
  H as Context,
  w as Emitter,
  _ as Field,
  W as Model,
  d as RPC,
  T as RPCHandler,
  D as RPCPlugin,
  U as Router,
  p as SyncObject,
  $ as SyncObjectField,
  J as SyncObjectRefField,
  N as SyncObjectRefSetField,
  I as Template,
  C as field
};
