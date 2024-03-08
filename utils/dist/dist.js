var p = Object.defineProperty;
var m = (s, e, t) => e in s ? p(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var u = (s, e, t) => (m(s, typeof e != "symbol" ? e + "" : e, t), t);
class U {
  constructor() {
    u(this, "_listeners", {});
    u(this, "_onceListeners", {});
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
      for (const i of [...this._listeners[e]])
        i(t);
    if (this._onceListeners[e]) {
      for (const i of [...this._onceListeners[e]])
        i(t);
      delete this._onceListeners[e];
    }
  }
  removeAllListeners() {
    this._listeners = {}, this._onceListeners = {};
  }
}
class x {
  constructor() {
    u(this, "_types", /* @__PURE__ */ new Map());
    u(this, "_history", []);
  }
  get(e) {
    return this._get(e);
  }
  set(e, t) {
    this._types.set(e, t);
  }
  _get(e, t = []) {
    if (!this._types.has(e)) {
      if (this._history.includes(e)) {
        const r = t.map((n) => n.name).join(" -> ");
        throw new Error(`Circular dependency detected for ${e.name}: ${r}`);
      }
      this._history.push(e);
      const i = new e(this);
      return this._types.set(e, i), this._history.pop(), i;
    }
    return this._types.get(e);
  }
}
class c {
  constructor(e) {
    u(this, "_iterable");
    this._iterable = e;
  }
  static from(e) {
    return new c(e);
  }
  static range(e) {
    return new c(y(e));
  }
  static zip(...e) {
    return new c(g(e));
  }
  static enumerate(e) {
    return new c(b(e));
  }
  filter(e) {
    return new c(v(this._iterable, e));
  }
  map(e) {
    return new c(w(this._iterable, e));
  }
  enumerate() {
    return new c(b(this._iterable));
  }
  collect() {
    return Array.from(this._iterable);
  }
  [Symbol.iterator]() {
    return this._iterable[Symbol.iterator]();
  }
}
function* v(s, e) {
  for (const t of s)
    e(t) && (yield t);
}
function* w(s, e) {
  for (const t of s)
    yield e(t);
}
function* y(s) {
  for (let e = 0; e < s; e++)
    yield e;
}
function* g(s) {
  const e = new Array(s.length).fill(null), t = s.map((i) => i[Symbol.iterator]());
  for (; ; ) {
    for (let i = 0; i < s.length; i++) {
      const n = t[i].next();
      if (n.done)
        return;
      e[i] = n.value;
    }
    yield e;
  }
}
function* b(s) {
  let e = 0;
  const t = new Array(2).fill(null);
  for (const i of s)
    t[0] = e, t[1] = i, yield t, e++;
}
var a;
((s) => {
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
  s.map = e, s.toString = e((r) => r.toString());
  function t(r) {
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
  s.debounce = t;
  function i(r) {
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
            const d = o === null ? l : o.value;
            o = null, n = Date.now(), _(d);
          }, r, void 0)
        };
      }
    };
  }
  s.throttle = i;
})(a || (a = {}));
((s) => {
  ((e) => {
    function t(i, r) {
      return {
        map(n) {
          return r.map(i.map(n));
        },
        event(n, o) {
          i.event(n, (l) => r.event(l, o));
        }
      };
    }
    e.chain = t;
  })(s.Utils || (s.Utils = {}));
})(a || (a = {}));
class h {
  constructor(e, t) {
    u(this, "_value");
    u(this, "_subscribers", []);
    u(this, "_dispatching", !1);
    u(this, "_pendingUnsubscribers", []);
    u(this, "_destroyed", !1);
    u(this, "_onDestroy");
    this._value = e, this._onDestroy = t;
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
      const t = this.subscribe((i) => {
        this.unsubscribe(t), e(i);
      }, !1);
    });
  }
  dispatch() {
    this._dispatching = !0;
    for (const e of this._subscribers)
      e(this._value);
    for (this._dispatching = !1; this._pendingUnsubscribers.length > 0; ) {
      const e = this._pendingUnsubscribers.pop(), t = this._subscribers.indexOf(e);
      t > -1 && this._subscribers.splice(t, 1);
    }
  }
  subscribe(e, t = !0) {
    return this._subscribers.push(e), t && e(this._value), e;
  }
  unsubscribe(e) {
    if (this._dispatching) {
      this._pendingUnsubscribers.push(e);
      return;
    }
    const t = this._subscribers.indexOf(e);
    t > -1 && this._subscribers.splice(t, 1);
  }
  map(e) {
    const t = new h(e(this._value));
    return this.subscribe((i) => t.value = e(i)), t;
  }
  pipe(e) {
    return new h.Pipe(this, e);
  }
  destroy() {
    var e;
    this._destroyed || (this._subscribers = [], this._pendingUnsubscribers = [], this._destroyed = !0, (e = this._onDestroy) == null || e.call(this));
  }
}
((s) => {
  class e {
    constructor(i, r) {
      this._observable = i, this._transformer = r;
    }
    pipe(i) {
      const r = a.Utils.chain(this._transformer, i);
      return new e(this._observable, r);
    }
    observable() {
      const i = (n) => {
        this._transformer.event(
          n,
          (o) => r.value = o
        );
      }, r = new s(
        this._transformer.map(this._observable.value),
        () => this._observable.unsubscribe(i)
      );
      return this._observable.subscribe(i, !1), r;
    }
  }
  s.Pipe = e;
})(h || (h = {}));
((s) => {
  function e(i) {
    const r = new s(void 0);
    return i.then((n) => r.value = n), r;
  }
  s.fromPromise = e;
  function t(i) {
    const r = setInterval(() => n.value++, i, void 0), n = new s(
      0,
      () => clearInterval(r)
    );
    return n;
  }
  s.interval = t;
})(h || (h = {}));
export {
  U as Emitter,
  c as Iter,
  h as Observable,
  x as Provider,
  a as Transformer
};
