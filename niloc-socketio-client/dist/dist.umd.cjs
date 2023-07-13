(function(a,h){typeof exports=="object"&&typeof module<"u"?h(exports):typeof define=="function"&&define.amd?define(["exports"],h):(a=typeof globalThis<"u"?globalThis:a||self,h(a.dist={}))})(this,function(a){"use strict";var z=Object.defineProperty;var F=(a,h,f)=>h in a?z(a,h,{enumerable:!0,configurable:!0,writable:!0,value:f}):a[h]=f;var _=(a,h,f)=>(F(a,typeof h!="symbol"?h+"":h,f),f);var h=Object.defineProperty,f=(i,e,t)=>e in i?h(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,o=(i,e,t)=>(f(i,typeof e!="symbol"?e+"":e,t),t),w;(i=>{const e={type:0},t={type:2};function s(){return e}i.broadcast=s;function n(){return t}i.host=n;function r(d){return{type:1,id:d}}i.to=r;function c(d,j){return d.type===0||j.address().type===0?!0:d.type===2?j.address().type===2:d.id===j.id()}i.match=c;function u(d){switch(d.type){case 0:return"*";case 1:return`:${d.id}`;case 2:return"host";default:return"?"}}i.toString=u;function g(d){return d==="*"?s():d==="host"?n():d.startsWith(":")?r(d.slice(1)):null}i.parse=g})(w||(w={}));var H=Object.defineProperty,k=(i,e,t)=>e in i?H(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,p=(i,e,t)=>(k(i,typeof e!="symbol"?e+"":e,t),t);class b{constructor(){p(this,"_listeners",{}),p(this,"_onceListeners",{})}on(e,t){this._listeners[e]||(this._listeners[e]=new Set),this._listeners[e].add(t)}off(e,t){this._listeners[e]&&(this._listeners[e].delete(t),this._listeners[e].size===0&&delete this._listeners[e])}once(e,t){this._onceListeners[e]||(this._onceListeners[e]=new Set),this._onceListeners[e].add(t)}offOnce(e,t){this._onceListeners[e]&&(this._onceListeners[e].delete(t),this._onceListeners[e].size===0&&delete this._onceListeners[e])}emit(e,t){if(this._listeners[e])for(const s of[...this._listeners[e]])s(t);if(this._onceListeners[e]){for(const s of[...this._onceListeners[e]])s(t);delete this._onceListeners[e]}}removeAllListeners(){this._listeners={},this._onceListeners={}}}var y;(i=>{function e(t,s){const n=[],r=new b;t.addListener(c=>{const[u,g]=c.data;r.emit(u.toString(),{...c,data:g})});for(let c=0;c<s;c++)n.push({post:(u,g)=>{t.post(u,[c,g])},addListener:u=>{r.on(c.toString(),u)},removeListener:u=>{r.off(c.toString(),u)}});return n}i.split=e})(y||(y={}));var v;(i=>{function e(){return(n,r)=>r.host}i.host=e;function t(){return(n,r)=>n.id()===r.userId}i.own=t;function s(n,r,c){return n===!0||n(r,c)}i.allows=s})(v||(v={}));class S{constructor(){o(this,"_string","")}write(e){this._string+=e}toString(e){return"  ".repeat(e)+this._string}}class I{constructor(){o(this,"_indent",0),o(this,"_string",""),o(this,"_line",new S)}write(e){this._line.write(e)}writeLine(e){this._line.write(e),this.nextLine()}nextLine(){this._string+=this._line.toString(this._indent)+`
`,this._line=new S}startIndent(){this._indent++}endIndent(){this._indent--}toString(){return this.nextLine(),this._string}}class l{constructor(){o(this,"_index",-1),o(this,"_changeRequester",null),o(this,"_emitter",new b)}static setIndex(e,t){e._index=t}static setChangeRequester(e,t){e._changeRequester=t,e.onChangeRequester(t)}static setModelHandle(e,t){e.onModelHandle(t)}static toString(e){const t=new I;return this.write(e,t),t.toString()}static write(e,t){e.toString(t)}index(){return this._index}emitter(){return this._emitter}readChange(e){this.read(e)}writeChange(e){this.write(e)}changed(){var e;(e=this._changeRequester)==null||e.change(this._index),this._emitter.emit("changed")}onChangeRequester(e){}onModelHandle(e){}toString(e){e.writeLine("???")}}class m{constructor(e,t){o(this,"_id"),o(this,"_type"),o(this,"_fields",null),this._id=e,this._type=t}static setChangeRequester(e,t){for(const s of e.fields())l.setChangeRequester(s,t)}static setModelHandle(e,t){for(const s of e.fields())l.setModelHandle(s,t)}static toString(e){const t=new I;return this.write(e,t),t.toString()}static write(e,t){t.writeLine(`${e.type()}: ${e.id()} {`),t.startIndent();for(const s of e.fields())l.write(s,t);t.endIndent(),t.writeLine("}")}id(){return this._id}type(){return this._type}fields(){return this._fields||(this._fields=this._initFields()),this._fields}read(e){for(const t of this.fields())t.read(e)}write(e){for(const t of this.fields())t.write(e)}_initFields(){const e=[];for(const t in this){const s=this[t];s instanceof l&&(l.setIndex(s,e.length),e.push(s))}return e}}var L;(i=>{function e(t){return{emitter(){return t.emitter},get:t.get,requestObject(s,n){return t.objectsEmitter.on(s,n),n(t.get(s)),{destroy(){t.objectsEmitter.off(s,n)}}}}}i.make=e})(L||(L={}));var O;(i=>{function e(t,s,n){return{type:t,create:r=>new s(r,t),authority:n??!0}}i.create=e})(O||(O={}));class C extends l{constructor(e){super(),o(this,"_value"),this._value=e}get(){return this._value}set(e){this._value=e,this.changed()}read(e){this._value=e.readJSON(),this.emitter().emit("changed")}write(e){e.writeJSON(this._value)}toString(e){switch(typeof this._value){case"function":e.writeLine("[Function]");break;case"object":e.write(JSON.stringify(this._value));break;default:e.writeLine(""+this._value);break}}}class M extends l{constructor(e,t){super(),o(this,"_object"),o(this,"_changes",[]),this._object=e.create(t??"sub")}get(){return this._object}read(e){this._object.read(e),this.emitter().emit("changed")}write(e){this._object.write(e)}readChange(e){const t=e.readInt();for(let s=0;s<t;s++){const n=e.readInt();this._object.fields()[n].readChange(e)}this.emitter().emit("changed")}writeChange(e){const t=this._changes.length;e.writeInt(t);for(const s of this._changes)e.writeInt(s),this._object.fields()[s].writeChange(e);this._changes=[]}onModelHandle(e){m.setModelHandle(this._object,e)}onChangeRequester(e){m.setChangeRequester(this._object,{change:t=>{this._changes.push(t),e.change(this.index()),this.emitter().emit("changed")}})}toString(e){m.write(this._object,e)}}class P extends l{constructor(e){super(),o(this,"_objectId"),o(this,"_object",null),o(this,"_modelHandle",null),o(this,"_objectRequest",null),this._objectId=e}read(e){const t=e.readJSON();t!==this._objectId&&(this._setObjectId(t),this.emitter().emit("changed"))}write(e){e.writeJSON(this._objectId)}set(e){const t=(e==null?void 0:e.id())??null;t!==this._objectId&&(this._setObjectId(t),this.changed())}get(){return this._object}_setObjectId(e){var t,s;(t=this._objectRequest)==null||t.destroy(),this._objectId=e,this._object=null,e?this._objectRequest=((s=this._modelHandle)==null?void 0:s.requestObject(e,n=>{this._object=n}))??null:this._objectRequest=null,this.emitter().emit("changed")}onModelHandle(e){this._modelHandle=e,this._objectId&&this._setObjectId(this._objectId)}toString(e){e.write("ref "),this._object?m.write(this._object,e):e.writeLine(`${this._objectId} (null)`)}}class N extends l{constructor(){super(...arguments),o(this,"_objects",new Map),o(this,"_modelHandle",null)}add(e){this._objects.set(e.id(),e),this.changed()}remove(e){this._objects.delete(e.id()),this.changed()}has(e){return this._objects.has(e.id())}*values(){for(const e of this._objects.values())e!==null&&(yield e)}read(e){var t;const s=e.readInt();this._objects.clear();for(let n=0;n<s;n++){const r=e.readString();this._objects.set(r,((t=this._modelHandle)==null?void 0:t.get(r))??null)}this.emitter().emit("changed")}write(e){e.writeInt(this._objects.size);for(const t of this._objects.keys())e.writeString(t)}onModelHandle(e){this._modelHandle=e,this._modelHandle.emitter().on("created",t=>{const s=t.id();this._objects.has(s)&&this._objects.set(s,t),this.emitter().emit("changed")})}}var q;(i=>{function e(r){return new C(r)}i.any=e;function t(r){return new P(r)}i.ref=t;function s(r){return new M(r)}i.object=s;function n(){return new N}i.refSet=n})(q||(q={}));var x;(i=>{function e(s){return{type:"connected",userId:s}}i.connected=e;function t(s){return{type:"disconnected",userId:s}}i.disconnected=t})(x||(x={}));var R;(i=>{function e(n,r,c){return{type:0,id:n,name:r,args:c}}i.request=e;function t(n,r){return{type:1,id:n,result:r}}i.response=t;function s(n,r){return{type:2,id:n,reason:r}}i.error=s})(R||(R={}));class J{constructor(e,t){_(this,"_id");_(this,"_address");_(this,"_emitter",new b);_(this,"_socket");_(this,"_onMessage",(e,t)=>{if(typeof e=="number"&&typeof t=="string")try{const s=JSON.parse(t);if(typeof s!="object")return;this._emitter.emit("message",{channel:e,message:s})}catch(s){console.error("Error while parsing message",s)}});this._id=e,this._socket=t,this._address=w.broadcast(),this._socket.on("message",this._onMessage)}id(){return this._id}address(){return this._address}emitter(){return this._emitter}send(e,t){this._socket.send(e,JSON.stringify(t))}}class E{constructor(e){_(this,"_emitter",new b);_(this,"_serverPeer");this._serverPeer=new J("SERVER",e),this._serverPeer.emitter().on("message",({channel:t,message:s})=>{this._emitter.emit("message",{peerId:this._serverPeer.id(),channel:t,message:s})})}emitter(){return this._emitter}*peers(){yield this._serverPeer}}a.SocketIONetwork=E,Object.defineProperty(a,Symbol.toStringTag,{value:"Module"})});
