var w = Object.defineProperty;
var y = (i, e, s) => e in i ? w(i, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : i[e] = s;
var c = (i, e, s) => (y(i, typeof e != "symbol" ? e + "" : e, s), s);
class v {
  constructor() {
    c(this, "_listeners", {});
    c(this, "_onceListeners", {});
  }
  on(e, s) {
    this._listeners[e] || (this._listeners[e] = /* @__PURE__ */ new Set()), this._listeners[e].add(s);
  }
  off(e, s) {
    this._listeners[e] && (this._listeners[e].delete(s), this._listeners[e].size === 0 && delete this._listeners[e]);
  }
  once(e, s) {
    this._onceListeners[e] || (this._onceListeners[e] = /* @__PURE__ */ new Set()), this._onceListeners[e].add(s);
  }
  offOnce(e, s) {
    this._onceListeners[e] && (this._onceListeners[e].delete(s), this._onceListeners[e].size === 0 && delete this._onceListeners[e]);
  }
  emit(e, s) {
    if (this._listeners[e])
      for (const t of [...this._listeners[e]])
        t(s);
    if (this._onceListeners[e]) {
      for (const t of [...this._onceListeners[e]])
        t(s);
      delete this._onceListeners[e];
    }
  }
  removeAllListeners() {
    this._listeners = {}, this._onceListeners = {};
  }
}
class U {
  constructor() {
    c(this, "_types", /* @__PURE__ */ new Map());
    c(this, "_history", []);
    c(this, "_lockEmitter", new v());
    c(this, "_locked", !1);
  }
  get(e) {
    return this._get(e);
  }
  set(e, s) {
    this._types.set(e, s);
  }
  lock() {
    if (this._locked)
      throw new Error("Trying to lock provider althrough it has already been locked.");
    this._locked = !0;
  }
  unlock() {
    if (!this._locked)
      throw new Error("Trying to unlock provider althrough it has not been locked.");
    this._locked = !1;
  }
  async _waitForRelease() {
    if (this._locked)
      return new Promise((e) => {
        const s = () => {
          this._lockEmitter.off("unlock", s), e();
        };
        this._lockEmitter.on("unlock", s);
      });
  }
  async getAsync(e) {
    if (await this._waitForRelease(), this._types.has(e))
      return this._types.get(e);
    this._addToHistory(e);
    const s = await e.asyncConstructor(this);
    return this._types.set(e, s), this._removeFromHistory(e), s;
  }
  _addToHistory(e) {
    if (this._history.includes(e)) {
      const s = this._history.map((t) => t.name).join(" -> ");
      throw new Error(`Circular dependency detected for ${e.name}: ${s}`);
    }
    this._history.push(e);
  }
  _removeFromHistory(e) {
    const s = this._history.indexOf(e);
    s > -1 && this._history.splice(s, 1);
  }
  _get(e) {
    if (this._types.has(e))
      return this._types.get(e);
    this._addToHistory(e);
    const s = new e(this);
    return this._types.set(e, s), this._removeFromHistory(e), s;
  }
}
class h {
  constructor(e) {
    c(this, "_iterable");
    this._iterable = e;
  }
  static from(e) {
    return new h(e);
  }
  static range(e) {
    return new h(k(e));
  }
  static zip(...e) {
    return new h(L(e));
  }
  static enumerate(e) {
    return new h(b(e));
  }
  filter(e) {
    return new h(g(this._iterable, e));
  }
  map(e) {
    return new h(p(this._iterable, e));
  }
  enumerate() {
    return new h(b(this._iterable));
  }
  collect() {
    return Array.from(this._iterable);
  }
  [Symbol.iterator]() {
    return this._iterable[Symbol.iterator]();
  }
}
function* g(i, e) {
  for (const s of i)
    e(s) && (yield s);
}
function* p(i, e) {
  for (const s of i)
    yield e(s);
}
function* k(i) {
  for (let e = 0; e < i; e++)
    yield e;
}
function* L(i) {
  const e = new Array(i.length).fill(null), s = i.map((t) => t[Symbol.iterator]());
  for (; ; ) {
    for (let t = 0; t < i.length; t++) {
      const n = s[t].next();
      if (n.done)
        return;
      e[t] = n.value;
    }
    yield e;
  }
}
function* b(i) {
  let e = 0;
  const s = new Array(2).fill(null);
  for (const t of i)
    s[0] = e, s[1] = t, yield s, e++;
}
var d;
((i) => {
  function e(r) {
    return {
      map(n) {
        return r(n);
      },
      event(n, o) {
        o(r(n));
      }
    };
  }
  i.map = e, i.toString = e((r) => r.toString());
  function s(r) {
    let n = null;
    return {
      map(o) {
        return o;
      },
      event(o, l) {
        n !== null && clearTimeout(n), n = setTimeout(() => l(o), r, void 0);
      }
    };
  }
  i.debounce = s;
  function t(r) {
    let n = 0 - r, o = null;
    return {
      map(l) {
        return l;
      },
      event(l, _) {
        if (o !== null) {
          o.value = l;
          return;
        }
        const f = Date.now();
        if (n + r < f) {
          n = f, _(l);
          return;
        }
        o = {
          value: l,
          timeout: setTimeout(() => {
            const m = o === null ? l : o.value;
            o = null, n = Date.now(), _(m);
          }, r, void 0)
        };
      }
    };
  }
  i.throttle = t;
})(d || (d = {}));
((i) => {
  ((e) => {
    function s(t, r) {
      return {
        map(n) {
          return r.map(t.map(n));
        },
        event(n, o) {
          t.event(n, (l) => r.event(l, o));
        }
      };
    }
    e.chain = s;
  })(i.Utils || (i.Utils = {}));
})(d || (d = {}));
class a {
  constructor(e, s) {
    c(this, "_value");
    c(this, "_subscribers", []);
    c(this, "_dispatching", !1);
    c(this, "_pendingUnsubscribers", []);
    c(this, "_destroyed", !1);
    c(this, "_onDestroy");
    this._value = e, this._onDestroy = s;
  }
  get value() {
    return this._value;
  }
  set value(e) {
    if (this._destroyed) {
      console.warn("Observable has been destroyed");
      return;
    }
    e !== this._value && (this._value = e, this.dispatch());
  }
  async next() {
    return new Promise((e) => {
      const s = this.subscribe((t) => {
        this.unsubscribe(s), e(t);
      }, !1);
    });
  }
  dispatch() {
    this._dispatching = !0;
    for (const e of this._subscribers)
      e(this._value);
    for (this._dispatching = !1; this._pendingUnsubscribers.length > 0; ) {
      const e = this._pendingUnsubscribers.pop(), s = this._subscribers.indexOf(e);
      s > -1 && this._subscribers.splice(s, 1);
    }
  }
  subscribe(e, s = !0) {
    return this._subscribers.push(e), s && e(this._value), e;
  }
  unsubscribe(e) {
    if (this._dispatching) {
      this._pendingUnsubscribers.push(e);
      return;
    }
    const s = this._subscribers.indexOf(e);
    s > -1 && this._subscribers.splice(s, 1);
  }
  map(e) {
    const s = new a(e(this._value));
    return this.subscribe((t) => s.value = e(t)), s;
  }
  pipe(e) {
    return new a.Pipe(this, e);
  }
  destroy() {
    var e;
    this._destroyed || (this._subscribers = [], this._pendingUnsubscribers = [], this._destroyed = !0, (e = this._onDestroy) == null || e.call(this));
  }
}
((i) => {
  class e {
    constructor(t, r) {
      this._observable = t, this._transformer = r;
    }
    pipe(t) {
      const r = d.Utils.chain(this._transformer, t);
      return new e(this._observable, r);
    }
    observable() {
      const t = (n) => {
        this._transformer.event(
          n,
          (o) => r.value = o
        );
      }, r = new i(
        this._transformer.map(this._observable.value),
        () => this._observable.unsubscribe(t)
      );
      return this._observable.subscribe(t, !1), r;
    }
  }
  i.Pipe = e;
})(a || (a = {}));
((i) => {
  function e(t) {
    const r = new i(void 0);
    return t.then((n) => r.value = n), r;
  }
  i.fromPromise = e;
  function s(t) {
    const r = setInterval(() => n.value++, t, void 0), n = new i(
      0,
      () => clearInterval(r)
    );
    return n;
  }
  i.interval = s;
})(a || (a = {}));
class u {
  constructor(e) {
    this.milliseconds = e;
  }
  static split(e) {
    const s = (e == null ? void 0 : e.milliseconds) ?? 0, t = (e == null ? void 0 : e.seconds) ?? 0, r = (e == null ? void 0 : e.minutes) ?? 0, n = (e == null ? void 0 : e.hours) ?? 0, o = (e == null ? void 0 : e.days) ?? 0;
    return new u(
      s + t * 1e3 + r * 1e3 * 60 + n * 1e3 * 60 * 60 + o * 1e3 * 60 * 60 * 24
    );
  }
  static milliseconds(e) {
    return new u(e);
  }
  static seconds(e) {
    return new u(e * 1e3);
  }
  static minutes(e) {
    return new u(e * 60 * 1e3);
  }
  static hours(e) {
    return new u(e * 60 * 60 * 1e3);
  }
  static days(e) {
    return new u(e * 24 * 60 * 60 * 1e3);
  }
  get seconds() {
    return this.milliseconds / 1e3;
  }
  get minutes() {
    return this.milliseconds / (1e3 * 60);
  }
  get hours() {
    return this.milliseconds / (1e3 * 60 * 60);
  }
  get days() {
    return this.milliseconds / (1e3 * 60 * 60 * 24);
  }
  split() {
    let e = this.milliseconds;
    const s = e % 1e3;
    e = (e - s) / 1e3;
    const t = e % 60;
    e = (e - t) / 60;
    const r = e % 60;
    e = (e - r) / 60;
    const n = e % 24;
    return e = (e - n) / 24, {
      milliseconds: s,
      seconds: t,
      minutes: r,
      hours: n,
      days: e
    };
  }
  add(e) {
    return new u(this.milliseconds + e.milliseconds);
  }
  subtract(e) {
    return new u(this.milliseconds - e.milliseconds);
  }
  equals(e) {
    return this.milliseconds === e.milliseconds;
  }
}
export {
  u as Duration,
  v as Emitter,
  h as Iter,
  a as Observable,
  U as Provider,
  d as Transformer
};
