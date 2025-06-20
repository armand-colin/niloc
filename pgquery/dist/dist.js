class h {
  constructor(t) {
    this._mark = t;
  }
}
((i) => {
  i.Number = new i(0), i.String = new i(""), i.Date = new i(new globalThis.Date());
})(h || (h = {}));
class w extends _ {
  constructor(t, s) {
    super(t, s, "AND");
  }
}
class $ extends _ {
  constructor(t, s) {
    super(t, s, "OR");
  }
}
var b;
const y = Symbol("Statement.symbol");
b = y;
class d {
  constructor() {
    this[b] = !0;
  }
  or(t) {
    return new $(this, t);
  }
  and(t) {
    return new w(this, t);
  }
}
class _ extends d {
  constructor(t, s, n) {
    super(), this.a = t, this.b = s, this.op = n;
  }
  string() {
    return `${this.a.string()} ${this.op} ${this.b.string()}`;
  }
  visit(t) {
    this.a.visit(t), this.b.visit(t);
  }
}
class B extends _ {
  constructor(t, s) {
    super(t, s, "=");
  }
}
class S {
  constructor(t, s) {
    this.column = t, this.value = s;
  }
  visit(t) {
    this.column.visit(t), this.value.visit(t);
  }
  string() {
    return `${this.column.string()} LIKE % | ${this.value.string()} | %`;
  }
}
class e {
  constructor(t) {
    this.value = t, this.index = 0;
  }
  string() {
    return "$" + this.index;
  }
  visit(t) {
    this.index > 0 || (this.index = t.index, t.index++, t.params.push(this.value));
  }
}
((i) => {
  function t(s) {
    return s instanceof i ? s : new i(s);
  }
  i.from = t;
})(e || (e = {}));
var a;
((i) => {
  i.__name = Symbol("Table.name");
  function t(n) {
    return n[i.__name];
  }
  i.name = t;
  function s(n, l) {
    const r = {
      [i.__name]: n
    };
    for (const o in l) {
      const x = l[o], p = new c(r, o, x);
      r[o] = p;
    }
    return r;
  }
  i.create = s;
})(a || (a = {}));
class g extends d {
  constructor(t, s) {
    super(), this.column = t, this.set = s;
  }
  visit(t) {
    this.column.visit(t), this.set.visit(t);
  }
  string() {
    return `${this.column.string()} IN (${this.set.string()})`;
  }
}
class j {
  constructor(t) {
    this._values = t.map((s) => e.from(s));
  }
  visit(t) {
    for (const s of this._values)
      s.visit(t);
  }
  string() {
    return this._values.map((t) => t.string()).join(", ");
  }
}
class c {
  constructor(t, s, n) {
    this.table = t, this.name = s, this.type = n;
  }
  definition() {
    return this.string();
  }
  equals(t) {
    const s = t instanceof c ? t : new e(t);
    return new B(this, s);
  }
  string() {
    return `${a.name(this.table)}.${this.name}`;
  }
  visit(t) {
  }
  like(t) {
    return t instanceof e || (t = new e(t)), new S(this, t);
  }
  as(t) {
    return new E(t, this);
  }
  in(t) {
    return Array.isArray(t) ? new g(this, new j(t)) : new g(this, t);
  }
}
class E extends c {
  constructor(t, s) {
    super(
      s.table,
      t,
      s.type
    ), this._column = s;
  }
  definition() {
    return `${this._column.definition()} AS ${this.name}`;
  }
  string() {
    return this.name;
  }
  visit(t) {
    this._column.visit(t);
  }
}
class O extends c {
  constructor(t) {
    super(t.table, "count", f.number), this._column = t;
  }
  definition() {
    return `COUNT(${this._column.string()})`;
  }
  string() {
    return this.name;
  }
  visit(t) {
    this._column.visit(t);
  }
}
class A {
  constructor(t, s, n) {
    this.table = t, this.a = s, this.b = n;
  }
  visit(t) {
    this.a.visit(t), this.b.visit(t);
  }
  string() {
    return `JOIN ${a.name(this.table)} ON ${this.a.string()} = ${this.b.string()}`;
  }
}
var u;
((i) => {
  i.__columns = Symbol("Query.columns");
})(u || (u = {}));
class D {
  constructor(t) {
    this.statement = t;
  }
  string() {
    return `WHERE ${this.statement.string()}`;
  }
  visit(t) {
    this.statement.visit(t);
  }
}
var v;
class m extends (v = d, u.__columns, v) {
  constructor(t) {
    super(), this.data = t, this._orderBy = null, this._offset = null, this._limit = null, this[u.__columns] = t.columns;
  }
  string() {
    let s = `SELECT ${this[u.__columns].map((n) => n.definition()).join(", ")} FROM ${a.name(this.data.table)}`;
    for (const n of this.data.joins)
      s += `
` + n.string();
    return this.data.where && (s += `
` + this.data.where.string()), this._orderBy && (s += `
ORDER BY ${this._orderBy.column.string()} ${this._orderBy.order}`), this._limit && (s += `
LIMIT ${this._limit.string()}`), this._offset && (s += `
OFFSET ${this._offset.string()}`), s;
  }
  visit(t) {
    for (const s of this.data.joins)
      s.visit(t);
    this.data.where && this.data.where.visit(t), this._orderBy && this._orderBy.column.visit(t), this._offset instanceof e && this._offset.visit(t), this._limit instanceof e && this._limit.visit(t);
  }
  join(t) {
    return {
      on: (s, n) => new m({
        ...this.data,
        joins: [...this.data.joins, new A(t, s, n)]
      })
    };
  }
  where(t) {
    return new m({
      ...this.data,
      where: new D(t)
    });
  }
  orderBy(t) {
    return this._orderBy = { column: t, order: "ASC" }, this;
  }
  orderByDesc(t) {
    return this._orderBy = { column: t, order: "DESC" }, this;
  }
  limit(t) {
    return this._limit = e.from(t), this;
  }
  offset(t) {
    return this._offset = e.from(t), this;
  }
}
var f;
((i) => {
  function t(...r) {
    return {
      from(o) {
        return new m({
          table: o,
          columns: r,
          joins: [],
          where: null
        });
      }
    };
  }
  i.select = t;
  function s(r, o) {
    return new $(r, o);
  }
  i.or = s;
  function n(r, o) {
    return new w(r, o);
  }
  i.and = n;
  function l(r) {
    return new O(r);
  }
  i.count = l, i.string = h.String, i.date = h.Date, i.number = h.Number;
})(f || (f = {}));
export {
  f as query
};
