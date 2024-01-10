(function(d,a){typeof exports=="object"&&typeof module<"u"?a(exports):typeof define=="function"&&define.amd?define(["exports"],a):(d=typeof globalThis<"u"?globalThis:d||self,a(d.dist={}))})(this,function(d){"use strict";var J=Object.defineProperty;var T=(d,a,u)=>a in d?J(d,a,{enumerable:!0,configurable:!0,writable:!0,value:u}):d[a]=u;var f=(d,a,u)=>(T(d,typeof a!="symbol"?a+"":a,u),u);var a;(i=>{const e=Object.freeze({type:0}),t=Object.freeze({type:1}),s=Object.freeze({type:3});function r(){return e}i.all=r;function n(){return t}i.broadcast=n;function o(){return s}i.host=o;function l(c){return{type:2,id:c}}i.to=l;function w(c){return{type:4,get:c}}i.dynamic=w;function F(c){return c.host?o():l(c.userId)}i.fromIdentity=F;function P(c,_,p){return p.address.type===1||p.address.type===0||_.type===0?!0:_.type===1?p.id!==c:_.type===3?p.address.type===3:(_.type===4?_.get():_.id)===p.id}i.match=P;function N(c){switch(c.type){case 0:return"*";case 1:return"#";case 2:return`:${c.id}`;case 4:return`:${c.get()}`;case 3:return"host";default:return"?"}}i.toString=N;function V(c){return c==="*"?r():c==="#"?n():c==="host"?o():c.startsWith(":")?l(c.slice(1)):null}i.parse=V})(a||(a={}));class u{constructor(e,t=a.fromIdentity(e)){this.identity=e,this.address=t}get id(){return this.identity.userId}get host(){return this.identity.host}}var b=Object.defineProperty,x=(i,e,t)=>e in i?b(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,S=(i,e,t)=>(x(i,typeof e!="symbol"?e+"":e,t),t);class g{constructor(){S(this,"_listeners",{}),S(this,"_onceListeners",{})}on(e,t){this._listeners[e]||(this._listeners[e]=new Set),this._listeners[e].add(t)}off(e,t){this._listeners[e]&&(this._listeners[e].delete(t),this._listeners[e].size===0&&delete this._listeners[e])}once(e,t){this._onceListeners[e]||(this._onceListeners[e]=new Set),this._onceListeners[e].add(t)}offOnce(e,t){this._onceListeners[e]&&(this._onceListeners[e].delete(t),this._onceListeners[e].size===0&&delete this._onceListeners[e])}emit(e,t){if(this._listeners[e])for(const s of[...this._listeners[e]])s(t);if(this._onceListeners[e]){for(const s of[...this._onceListeners[e]])s(t);delete this._onceListeners[e]}}removeAllListeners(){this._listeners={},this._onceListeners={}}}var L;(i=>{function e(t,s){const r=[],n=new g;t.addListener(o=>{const[l,w]=o.data;n.emit(l.toString(),{...o,data:w})});for(let o=0;o<s;o++)r.push({post:(l,w)=>{t.post(l,[o,w])},addListener:l=>{n.on(o.toString(),l)},removeListener:l=>{n.off(o.toString(),l)}});return r}i.split=e})(L||(L={}));class y{static deserialize(e){return new y(e.userId,e.host)}constructor(e,t=!1){this.host=t,this.userId=e}serialize(){return{userId:this.userId,host:this.host}}}var m=(i=>(i[i.All=0]="All",i[i.Host=1]="Host",i[i.Owner=2]="Owner",i))(m||{});(i=>{function e(t,s){switch(t.authority){case 0:return!0;case 1:return s.host;case 2:return s.userId===t.id}return!1}i.allows=e})(m||(m={}));class v{constructor(){this._string=""}write(e){this._string+=e}toString(e){return"  ".repeat(e)+this._string}}class O{constructor(){this._indent=0,this._string="",this._line=new v}write(e){this._line.write(e)}writeLine(e){this._line.write(e),this.nextLine()}nextLine(){this._string+=this._line.toString(this._indent)+`
`,this._line=new v}startIndent(){this._indent++}endIndent(){this._indent--}toString(){return this.nextLine(),this._string}}class h extends g{constructor(){super(...arguments),this._index=-1,this.dirty=!1}static setIndex(e,t){e._index=t}static __init(e,t){e.changeRequester=t.changeRequester,e.model=t.model,e.onInit()}static toString(e){const t=new O;return this.writeString(e,t),t.toString()}static isDirty(e){return e.dirty}static writeString(e,t){e.toString(t)}static write(e,t){e.write(t)}static read(e,t){e.read(t)}static writeDelta(e,t){e.writeDelta(t)}static readDelta(e,t){e.readDelta(t)}static resetDelta(e){e.resetDelta(),e.dirty=!1}static register(e,t){const s=[...e];for(const r of s)r.on("change",t);return()=>{for(const r of s)r.off("change",t)}}get index(){return this._index}readDelta(e){this.read(e)}writeDelta(e){this.write(e)}resetDelta(){}changed(){var e;this.dirty=!0,(e=this.changeRequester)==null||e.change(this._index),this.emit("change",this.get())}onInit(){}toString(e){e.writeLine("???")}}class k extends h{constructor(e){super(),this.value=e}get(){return this.value}set(e){this.equals(this.value,e)||(this.value=e,this.changed())}read(e){this.readValue(e),this.emit("change",this.get())}write(e){e.writeJSON(this.value)}equals(e,t){return e===t}toString(e){switch(typeof this.value){case"function":e.writeLine("[Function]");break;case"object":e.write(JSON.stringify(this.value));break;default:e.writeLine(""+this.value);break}}}class D extends k{readValue(e){this.value=e.readBoolean()}writeValue(e){e.writeBoolean(this.value)}}function $(i){return function(e,t){const s="$"+t,r=Symbol(t);Object.defineProperty(e,t,{get(){return this[s].get()},set(n){this[s].set(n)}}),Object.defineProperty(e,s,{get(){let n=this[r];return n||(n=i(),this[r]=n),n},enumerable:!0})}}function j(i=!1){return $(()=>new D(i))}var E=Object.defineProperty,M=Object.getOwnPropertyDescriptor,q=(i,e,t,s)=>{for(var r=s>1?void 0:s?M(e,t):e,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=(s?o(e,t,r):o(r))||r);return s&&r&&E(e,t,r),r};class R extends g{constructor(e){super(),this.authority=m.All,this._fields=null,this._registerMap=new Map,this._onDeletedChange=()=>{this.deleted&&(this.emit("delete"),this.onDelete(),this.changeRequester.delete(),this.removeAllListeners())},this.id=e,this.register("deleted",this._onDeletedChange)}static __init(e,t){e.changeRequester=t.changeRequester,e.model=t.model;for(const s of e.fields())h.__init(s,t);e.onInit()}static toString(e){const t=new O;return this.writeString(e,t),t.toString()}static writeString(e,t){t.writeLine(`${e.constructor.name}: ${e.id} {`),t.startIndent();for(const s of e.fields())h.writeString(s,t);t.endIndent(),t.writeLine("}")}static write(e,t){e.write(t)}static read(e,t){e.read(t)}static isDirty(e){for(const t of e.fields())if(h.isDirty(t))return!0;return!1}static getDirtyFields(e){const t=[];for(const s of e.fields())h.isDirty(s)&&t.push(s);return t}fields(){return this._fields||(this._fields=this._initFields()),this._fields}read(e){for(const t of this.fields())h.read(t,e)}write(e){for(const t of this.fields())h.write(t,e)}send(){this.changeRequester.send()}registerAll(e){if(this._registerMap.has(e))return;const t=h.register(this.fields(),e);this._registerMap.set(e,t)}unregisterAll(e){this._registerMap.has(e)&&(this._registerMap.get(e)(),this._registerMap.delete(e))}register(e,t){const s=this[e];if(s&&s instanceof h){s.on("change",t);return}const r=`$${e}`,n=this[r];if(n&&n instanceof h){n.on("change",t);return}throw new Error(`Field ${e} does not exist on type ${this.constructor.name}`)}unregister(e,t){const s=this[e];if(s&&s instanceof h){s.off("change",t);return}const r=`$${e}`,n=this[r];if(n&&n instanceof h){n.off("change",t);return}throw new Error(`Field ${e} does not exist on type ${this.constructor.name}`)}delete(){this.deleted||(this.deleted=!0)}onInit(){}onDelete(){}_initFields(){const e=[];for(const t in this){const s=this[t];s instanceof h&&(h.setIndex(s,e.length),e.push(s))}return e}}q([j(!1)],R.prototype,"deleted",2);var I;(i=>{function e(t,s){return{id:t,args:s}}i.make=e})(I||(I={}));class A extends u{constructor(t,s){super(t);f(this,"_emitter",new g);f(this,"_socketIOEmitter",new g);f(this,"_socket");f(this,"_onMessage",(t,s)=>{if(typeof t=="number"&&typeof s=="string")try{const r=JSON.parse(s);if(!r)return;this._emitter.emit("message",{channel:t,message:r})}catch(r){console.error(`Error receiving network message (${this.id})`,r)}});this._socket=s,s.on("message",this._onMessage),s.on("disconnect",()=>{this.destroy(),this._socketIOEmitter.emit("disconnect")})}get socketIOEmitter(){return this._socketIOEmitter}send(t,s){this._socket.send(t,JSON.stringify(s))}addListener(t){this._emitter.on("message",t)}removeListener(t){this._emitter.off("message",t)}destroy(){this._socket.removeAllListeners()}}class z extends g{constructor(t){super();f(this,"_peers",new Map);f(this,"_identity");this._identity=new y("SERVER",(t==null?void 0:t.host)??!1)}identity(){return this._identity}peers(){return this._peers.values()}addSocket(t,s,r){if(this._peers.has(s))return;const n=new A(new y(s,r),t);n.socketIOEmitter.on("disconnect",()=>{this._peers.get(s)===n&&this._peers.delete(s)}),n.addListener(o=>{this.emit("message",{peerId:s,...o})}),this._peers.set(s,n)}}d.SocketIONetwork=z,Object.defineProperty(d,Symbol.toStringTag,{value:"Module"})});
