(function(c,a){typeof exports=="object"&&typeof module<"u"?a(exports):typeof define=="function"&&define.amd?define(["exports"],a):(c=typeof globalThis<"u"?globalThis:c||self,a(c.dist={}))})(this,function(c){"use strict";var k=Object.defineProperty;var H=(c,a,u)=>a in c?k(c,a,{enumerable:!0,configurable:!0,writable:!0,value:u}):c[a]=u;var i=(c,a,u)=>(H(c,typeof a!="symbol"?a+"":a,u),u);c.Address=void 0,(r=>{const t={type:0};function e(){return t}r.broadcast=e;function s(h){return{type:1,id:h}}r.to=s;function n(h,f){return h.type===0||f.type===0?!0:h.id===f.id}r.match=n;function o(h){switch(h.type){case 0:return"*";case 1:return`:${h.id}`;default:return"?"}}r.toString=o;function _(h){return h==="*"?e():h.startsWith(":")?s(h.slice(1)):null}r.parse=_})(c.Address||(c.Address={}));class a{constructor(){i(this,"_inputListener",null);i(this,"_outputListeners",new Set)}postOutput(...t){for(const e of this._outputListeners)e(...t)}addOutputListener(t){this._outputListeners.add(t)}removeOutputListener(t){this._outputListeners.delete(t)}postInput(...t){var e;(e=this._inputListener)==null||e.call(this,...t)}setInputListener(t){this._inputListener=t}}class u{constructor(t){i(this,"_channel");i(this,"_mpsc",new a);i(this,"_input");i(this,"_output");this._channel=t,this._input={post:(e,s)=>this._mpsc.postInput(e,s),addListener:e=>this._mpsc.addOutputListener(e),removeListener:e=>this._mpsc.removeOutputListener(e)},this._output={post:e=>this._mpsc.postOutput(e),setListener:e=>this._mpsc.setInputListener(e)}}channel(){return this._channel}input(){return this._input}output(){return this._output}}class m{constructor(t,e){i(this,"_id");i(this,"_address");i(this,"_channels",{});this.network=e,this._id=t,this._address=c.Address.to(t),e.emitter().on("message",({peerId:s,channel:n,message:o})=>this._onMessage(s,n,o))}id(){return this._id}channel(t){return this._channels[t]||(this._channels[t]=this._createChannel(t)),this._channels[t].input()}_onMessage(t,e,s){c.Address.match(s.address,this._address)&&this._channels[e]&&this._channels[e].output().post(s);for(const n of this.network.peers())n.id()!==t&&c.Address.match(s.address,n.address())&&n.send(e,s)}_createChannel(t){const e=new u(t);return e.output().setListener((s,n)=>{this._send(s,t,n)}),e}_send(t,e,s){const n={originId:this._id,address:t,data:s};for(const o of this.network.peers())c.Address.match(t,o.address())&&o.send(e,n)}}class p{constructor(){i(this,"_string","")}write(t){this._string+=t}toString(t){return"  ".repeat(t)+this._string}}class j{constructor(){i(this,"_indent",0);i(this,"_string","");i(this,"_line",new p)}write(t){this._line.write(t)}writeLine(t){this._line.write(t),this.nextLine()}nextLine(){this._string+=this._line.toString(this._indent)+`
`,this._line=new p}startIndent(){this._indent++}endIndent(){this._indent--}toString(){return this.nextLine(),this._string}}var y=Object.defineProperty,S=(r,t,e)=>t in r?y(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e,w=(r,t,e)=>(S(r,typeof t!="symbol"?t+"":t,e),e);class g{constructor(){w(this,"_listeners",{}),w(this,"_onceListeners",{})}on(t,e){this._listeners[t]||(this._listeners[t]=new Set),this._listeners[t].add(e)}off(t,e){this._listeners[t]&&(this._listeners[t].delete(e),this._listeners[t].size===0&&delete this._listeners[t])}once(t,e){this._onceListeners[t]||(this._onceListeners[t]=new Set),this._onceListeners[t].add(e)}offOnce(t,e){this._onceListeners[t]&&(this._onceListeners[t].delete(e),this._onceListeners[t].size===0&&delete this._onceListeners[t])}emit(t,e){if(this._listeners[t])for(const s of[...this._listeners[t]])s(e);if(this._onceListeners[t]){for(const s of[...this._onceListeners[t]])s(e);delete this._onceListeners[t]}}removeAllListeners(){this._listeners={},this._onceListeners={}}}class d{constructor(){i(this,"_index",-1);i(this,"_changeRequester",null);i(this,"_emitter",new g)}static setIndex(t,e){t._index=e}static setChangeRequester(t,e){t._changeRequester=e,t.onChangeRequester(e)}static setModelHandle(t,e){t.onModelHandle(e)}static toString(t){const e=new j;return this.write(t,e),e.toString()}static write(t,e){t.toString(e)}index(){return this._index}emitter(){return this._emitter}readChange(t){this.read(t)}writeChange(t){this.write(t)}changed(){var t;(t=this._changeRequester)==null||t.change(this._index),this._emitter.emit("changed")}onChangeRequester(t){}onModelHandle(t){}toString(t){t.writeLine("???")}}class l{constructor(t,e){i(this,"_id");i(this,"_type");i(this,"_fields",null);this._id=t,this._type=e}static setChangeRequester(t,e){for(const s of t.fields())d.setChangeRequester(s,e)}static setModelHandle(t,e){for(const s of t.fields())d.setModelHandle(s,e)}static toString(t){const e=new j;return this.write(t,e),e.toString()}static write(t,e){e.writeLine(`${t.type()}: ${t.id()} {`),e.startIndent();for(const s of t.fields())d.write(s,e);e.endIndent(),e.writeLine("}")}id(){return this._id}type(){return this._type}fields(){return this._fields||(this._fields=this._initFields()),this._fields}read(t){for(const e of this.fields())e.read(t)}write(t){for(const e of this.fields())e.write(t)}_initFields(){const t=[];for(const e in this){const s=this[e];s instanceof d&&(d.setIndex(s,t.length),t.push(s))}return t}}let I=(r=21)=>crypto.getRandomValues(new Uint8Array(r)).reduce((t,e)=>(e&=63,e<36?t+=e.toString(36):e<62?t+=(e-26).toString(36).toUpperCase():e>62?t+="-":t+="_",t),"");var b;(r=>{function t(e){return{emitter(){return e.emitter},get:e.get,requestObject(n,o){return e.objectsEmitter.on(n,o),o(e.get(n)),{destroy(){e.objectsEmitter.off(n,o)}}}}}r.make=t})(b||(b={}));class L{constructor(){i(this,"_changes",new Map);i(this,"_syncs",new Set)}change(t,e){if(this._syncs.has(t))return;let s=this._changes.get(t);s||(s=[],this._changes.set(t,s)),!s.includes(e)&&s.push(e)}sync(t){this._syncs.add(t),this._changes.delete(t)}*changes(){const t={objectId:"",fields:[]};for(const[e,s]of this._changes)t.objectId=e,t.fields=s,yield t;this._changes.clear()}*syncs(){for(const t of this._syncs)yield t;this._syncs.clear()}}class C{constructor(){i(this,"_buffer",[]);i(this,"_cursor",0)}feed(t){this._buffer=t,this._cursor=0}cursor(){return this._cursor}setCursor(t){this._cursor=t}skip(t){this._cursor+=t}empty(){return this._cursor>=this._buffer.length}readJSON(){const t=this._buffer[this._cursor];this._cursor++;try{return JSON.parse(t)}catch(e){return console.error("Failed to parse JSON",e),null}}readString(){return this._buffer[this._cursor++]}readFloat(){return parseFloat(this._buffer[this._cursor++])}readInt(){return parseInt(this._buffer[this._cursor++],36)}readBoolean(){return this._buffer[this._cursor++]==="1"}}class O{constructor(){i(this,"_buffer",[]);i(this,"_cursor",-1)}collect(){const t=this._buffer;return this._buffer=[],t}cursor(){return this._cursor===-1?this._buffer.length:this._cursor}setCursor(t){t===this._buffer.length&&(t=-1),this._cursor=t}resume(){this.setCursor(-1)}_write(t){this._cursor===-1?this._buffer.push(t):this._buffer[this._cursor++]=t}writeJSON(t){this._write(JSON.stringify(t))}writeString(t){this._write(t)}writeInt(t){this._write(t.toString(36))}writeFloat(t){this._write(t.toString())}writeBoolean(t){this._write(t?"1":"0")}}class R{constructor(t){i(this,"_channel");i(this,"_emitter",new g);i(this,"_objectsEmitter",new g);i(this,"_templates",new Map);i(this,"_objects",new Map);i(this,"_handle");i(this,"_changeQueue",new L);i(this,"_reader",new C);i(this,"_writer",new O);i(this,"_plugins",[]);i(this,"_onMessage",t=>{switch(t.data.type){case"sync":{this._onSync(t.data.changes);break}case"change":{this._onChange(t.data.changes);break}}});this._channel=t.channel,this._channel.addListener(this._onMessage),this._handle=b.make({emitter:this._emitter,objectsEmitter:this._objectsEmitter,get:e=>this.get(e)})}emitter(){return this._emitter}plugin(t){this._plugins.push(t)}register(t){this._templates.set(t.type,t)}instantiate(t,e){const s=e??I(),n=this._create(t,s);return this._changeQueue.sync(s),n}tick(){const t=this._collectSyncs(),e=this._collectChanges();t.length>0&&this._channel.post(c.Address.broadcast(),{type:"sync",changes:t}),e.length>0&&this._channel.post(c.Address.broadcast(),{type:"change",changes:e})}syncTo(t){const e=this._collectGlobalSyncs();e.length>0&&this._channel.post(t,{type:"sync",changes:e})}get(t){return this._objects.get(t)??null}getAll(){return[...this._objects.values()]}_create(t,e){var n;const s=t.create(e);l.setChangeRequester(s,this._makeChangeRequester(e)),l.setModelHandle(s,this._handle),this._objects.set(e,s);for(const o of this._plugins)(n=o.beforeCreate)==null||n.call(o,s);return this._emitter.emit("created",s),this._objectsEmitter.emit(e,s),s}_makeChangeRequester(t){return{change:e=>this._onChangeRequest(t,e)}}_onChangeRequest(t,e){this._changeQueue.change(t,e)}_collectGlobalSyncs(){return this._connectSyncsForObjects(this._objects.keys())}_collectSyncs(){return this._connectSyncsForObjects(this._changeQueue.syncs())}_connectSyncsForObjects(t){const e=this._writer;for(const s of t){const n=this._objects.get(s);n&&(e.writeString(n.id()),e.writeString(n.type()),n.write(e))}return e.collect()}_collectChanges(){const t=this._writer;for(const{objectId:e,fields:s}of this._changeQueue.changes()){const n=this._objects.get(e);if(!n)continue;t.writeString(e),t.writeInt(s.length);const o=t.cursor();t.writeInt(0);for(const h of s){const f=n.fields()[h];t.writeInt(h),f.writeChange(t)}const _=t.cursor();t.setCursor(o),t.writeInt(_-o-1),t.resume()}return t.collect()}_onSync(t){const e=this._reader;for(e.feed(t);!e.empty();){const s=e.readString(),n=e.readString();let o=this._objects.get(s);if(o){o.read(e);continue}const _=this._templates.get(n);if(!_){console.error("Could not create object with type",n);return}o=this._create(_,s),o.read(e)}}_onChange(t){const e=this._reader;for(e.feed(t);!e.empty();){const s=e.readString(),n=e.readInt(),o=e.readInt(),_=this._objects.get(s);if(!_){e.skip(o);continue}for(let h=0;h<n;h++){const f=e.readInt();_.fields()[f].readChange(e)}}}}c.Template=void 0,(r=>{function t(e,s){return{type:e,create:n=>new s(n,e)}}r.create=t})(c.Template||(c.Template={}));class v extends d{constructor(e){super();i(this,"_value");this._value=e}get(){return this._value}set(e){this._value=e,this.changed()}read(e){this._value=e.readJSON(),this.emitter().emit("changed")}write(e){e.writeJSON(this._value)}toString(e){switch(typeof this._value){case"function":e.writeLine("[Function]");break;case"object":e.write(JSON.stringify(this._value));break;default:e.writeLine(""+this._value);break}}}class q extends d{constructor(e,s){super();i(this,"_object");i(this,"_changes",[]);this._object=e.create(s??"sub")}get(){return this._object}read(e){this._object.read(e),this.emitter().emit("changed")}write(e){this._object.write(e)}readChange(e){const s=e.readInt();for(let n=0;n<s;n++){const o=e.readInt();this._object.fields()[o].readChange(e)}this.emitter().emit("changed")}writeChange(e){const s=this._changes.length;e.writeInt(s);for(const n of this._changes)e.writeInt(n),this._object.fields()[n].writeChange(e);this._changes=[]}onModelHandle(e){l.setModelHandle(this._object,e)}onChangeRequester(e){l.setChangeRequester(this._object,{change:s=>{this._changes.push(s),e.change(this.index()),this.emitter().emit("changed")}})}toString(e){l.write(this._object,e)}}class M extends d{constructor(e){super();i(this,"_objectId");i(this,"_object",null);i(this,"_modelHandle",null);i(this,"_objectRequest",null);this._objectId=e}read(e){const s=e.readJSON();s!==this._objectId&&(this._setObjectId(s),this.emitter().emit("changed"))}write(e){e.writeJSON(this._objectId)}set(e){const s=(e==null?void 0:e.id())??null;s!==this._objectId&&(this._setObjectId(s),this.changed())}get(){return this._object}_setObjectId(e){var s,n;(s=this._objectRequest)==null||s.destroy(),this._objectId=e,this._object=null,e?this._objectRequest=((n=this._modelHandle)==null?void 0:n.requestObject(e,o=>{this._object=o}))??null:this._objectRequest=null,this.emitter().emit("changed")}onModelHandle(e){this._modelHandle=e,this._objectId&&this._setObjectId(this._objectId)}toString(e){e.write("ref "),this._object?l.write(this._object,e):e.writeLine(`${this._objectId} (null)`)}}class F extends d{constructor(){super(...arguments);i(this,"_objects",new Map);i(this,"_modelHandle",null)}add(e){this._objects.set(e.id(),e),this.changed()}remove(e){this._objects.delete(e.id()),this.changed()}has(e){return this._objects.has(e.id())}*values(){for(const e of this._objects.values())e!==null&&(yield e)}read(e){var n;const s=e.readInt();this._objects.clear();for(let o=0;o<s;o++){const _=e.readString();this._objects.set(_,((n=this._modelHandle)==null?void 0:n.get(_))??null)}this.emitter().emit("changed")}write(e){e.writeInt(this._objects.size);for(const s of this._objects.keys())e.writeString(s)}onModelHandle(e){this._modelHandle=e,this._modelHandle.emitter().on("created",s=>{const n=s.id();this._objects.has(n)&&this._objects.set(n,s),this.emitter().emit("changed")})}}c.AnyField=v,c.Field=d,c.Model=R,c.Router=m,c.SyncObject=l,c.SyncObjectField=q,c.SyncObjectRefField=M,c.SyncObjectRefSetField=F,Object.defineProperty(c,Symbol.toStringTag,{value:"Module"})});