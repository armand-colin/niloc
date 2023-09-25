(function(r,l){typeof exports=="object"&&typeof module<"u"?l(exports):typeof define=="function"&&define.amd?define(["exports"],l):(r=typeof globalThis<"u"?globalThis:r||self,l(r.dist={}))})(this,function(r){"use strict";var V=Object.defineProperty;var K=(r,l,m)=>l in r?V(r,l,{enumerable:!0,configurable:!0,writable:!0,value:m}):r[l]=m;var i=(r,l,m)=>(K(r,typeof l!="symbol"?l+"":l,m),m);r.Address=void 0,(h=>{const e=Object.freeze({type:0}),t=Object.freeze({type:1}),s=Object.freeze({type:3});function n(){return e}h.all=n;function c(){return t}h.broadcast=c;function o(){return s}h.host=o;function a(d){return{type:2,id:d}}h.to=a;function f(d){return{type:4,get:d}}h.dynamic=f;function g(d,y,p){return p.address().type===1||p.address().type===0||y.type===0?!0:y.type===1?p.id()!==d:y.type===3?p.address().type===3:(y.type===4?y.get():y.id)===p.id()}h.match=g;function S(d){switch(d.type){case 0:return"*";case 1:return"#";case 2:return`:${d.id}`;case 4:return`:${d.get()}`;case 3:return"host";default:return"?"}}h.toString=S;function G(d){return d==="*"?n():d==="#"?c():d==="host"?o():d.startsWith(":")?a(d.slice(1)):null}h.parse=G})(r.Address||(r.Address={}));class l{constructor(){i(this,"_inputListener",null);i(this,"_outputListeners",new Set)}postOutput(...e){for(const t of this._outputListeners)t(...e)}addOutputListener(e){this._outputListeners.add(e)}removeOutputListener(e){this._outputListeners.delete(e)}postInput(...e){var t;(t=this._inputListener)==null||t.call(this,...e)}setInputListener(e){this._inputListener=e}}class m{constructor(e){i(this,"_channel");i(this,"_mpsc",new l);i(this,"_input");i(this,"_output");this._channel=e,this._input={post:(t,s)=>this._mpsc.postInput(t,s),addListener:t=>this._mpsc.addOutputListener(t),removeListener:t=>this._mpsc.removeOutputListener(t)},this._output={post:t=>this._mpsc.postOutput(t),setListener:t=>this._mpsc.setInputListener(t)}}channel(){return this._channel}input(){return this._input}output(){return this._output}}class O{constructor(e,t){i(this,"host");i(this,"userId");this.host=t,this.userId=e}}class N{constructor(e){i(this,"_id");i(this,"_relay");i(this,"_address");i(this,"_self");i(this,"_context");i(this,"_channels",{});i(this,"network");this._id=e.id,this._relay=e.relay??!1,this._address=e.host?r.Address.host():r.Address.to(e.id),this._context=new O(e.id,e.host??!1),this._self={id:()=>this._id,address:()=>this._address,send:(t,s)=>{this._onMessage(this._id,t,s)}},this.network=e.network,this.network.emitter().on("message",({peerId:t,channel:s,message:n})=>this._onMessage(t,s,n))}id(){return this._id}address(){return this._address}self(){return this._self}channel(e){return this._channels[e]||(this._channels[e]=this._createChannel(e)),this._channels[e].input()}context(){return this._context}_onMessage(e,t,s){if(r.Address.match(e,s.address,this._self)&&this._receive(t,s),!!this._relay)for(const n of this.network.peers())n.id()!==e&&r.Address.match(e,s.address,n)&&n.send(t,s)}_receive(e,t){this._channels[e]&&this._channels[e].output().post(t)}_createChannel(e){const t=new m(e);return t.output().setListener((s,n)=>{this._send(s,e,n)}),t}_send(e,t,s){const n={originId:this._id,address:e,data:s};for(const c of this.network.peers())r.Address.match(this._id,e,c)&&c.send(t,n);r.Address.match(this._id,e,this._self)&&this._receive(t,n)}}var P=Object.defineProperty,$=(h,e,t)=>e in h?P(h,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):h[e]=t,L=(h,e,t)=>($(h,typeof e!="symbol"?e+"":e,t),t);class b{constructor(){L(this,"_listeners",{}),L(this,"_onceListeners",{})}on(e,t){this._listeners[e]||(this._listeners[e]=new Set),this._listeners[e].add(t)}off(e,t){this._listeners[e]&&(this._listeners[e].delete(t),this._listeners[e].size===0&&delete this._listeners[e])}once(e,t){this._onceListeners[e]||(this._onceListeners[e]=new Set),this._onceListeners[e].add(t)}offOnce(e,t){this._onceListeners[e]&&(this._onceListeners[e].delete(t),this._onceListeners[e].size===0&&delete this._onceListeners[e])}emit(e,t){if(this._listeners[e])for(const s of[...this._listeners[e]])s(t);if(this._onceListeners[e]){for(const s of[...this._onceListeners[e]])s(t);delete this._onceListeners[e]}}removeAllListeners(){this._listeners={},this._onceListeners={}}}r.Channel=void 0,(h=>{function e(t,s){const n=[],c=new b;t.addListener(o=>{const[a,f]=o.data;c.emit(a.toString(),{...o,data:f})});for(let o=0;o<s;o++)n.push({post:(a,f)=>{t.post(a,[o,f])},addListener:a=>{c.on(o.toString(),a)},removeListener:a=>{c.off(o.toString(),a)}});return n}h.split=e})(r.Channel||(r.Channel={})),r.Authority=void 0,(h=>{function e(){return(n,c)=>c.host}h.host=e;function t(){return(n,c)=>n.id()===c.userId}h.own=t;function s(n,c,o){return n===!0||n(c,o)}h.allows=s})(r.Authority||(r.Authority={}));class v{constructor(){i(this,"_string","")}write(e){this._string+=e}toString(e){return"  ".repeat(e)+this._string}}class k{constructor(){i(this,"_indent",0);i(this,"_string","");i(this,"_line",new v)}write(e){this._line.write(e)}writeLine(e){this._line.write(e),this.nextLine()}nextLine(){this._string+=this._line.toString(this._indent)+`
`,this._line=new v}startIndent(){this._indent++}endIndent(){this._indent--}toString(){return this.nextLine(),this._string}}class _{constructor(){i(this,"_index",-1);i(this,"_changeRequester",null);i(this,"_emitter",new b)}static setIndex(e,t){e._index=t}static setChangeRequester(e,t){e._changeRequester=t,e.onChangeRequester(t)}static setModelHandle(e,t){e.onModelHandle(t)}static toString(e){const t=new k;return this.write(e,t),t.toString()}static write(e,t){e.toString(t)}static register(e,t){const s=[...e];for(const n of s)n.emitter().on("changed",t);return()=>{for(const n of s)n.emitter().off("changed",t)}}index(){return this._index}emitter(){return this._emitter}readChange(e){this.read(e)}writeChange(e){this.write(e)}clearChange(){}changed(){var e;(e=this._changeRequester)==null||e.change(this._index),this._emitter.emit("changed")}onChangeRequester(e){}onModelHandle(e){}toString(e){e.writeLine("???")}}class w{constructor(e,t){i(this,"_id");i(this,"_type");i(this,"_fields",null);i(this,"_changeRequester");this._id=e,this._type=t}static __setChangeRequester(e,t){e._changeRequester=t;for(const s of e.fields())_.setChangeRequester(s,t)}static __setModelHandle(e,t){for(const s of e.fields())_.setModelHandle(s,t)}static toString(e){const t=new k;return this.write(e,t),t.toString()}static write(e,t){t.writeLine(`${e.type()}: ${e.id()} {`),t.startIndent();for(const s of e.fields())_.write(s,t);t.endIndent(),t.writeLine("}")}id(){return this._id}type(){return this._type}fields(){return this._fields||(this._fields=this._initFields()),this._fields}read(e){for(const t of this.fields())t.read(e)}write(e){for(const t of this.fields())t.write(e)}send(){this._changeRequester.send()}register(e){return _.register(this.fields(),e)}_initFields(){const e=[];for(const t in this){const s=this[t];s instanceof _&&(_.setIndex(s,e.length),e.push(s))}return e}}let E=(h=21)=>crypto.getRandomValues(new Uint8Array(h)).reduce((e,t)=>(t&=63,t<36?e+=t.toString(36):t<62?e+=(t-26).toString(36).toUpperCase():t>62?e+="-":e+="_",e),"");var C;(h=>{function e(t){return{emitter(){return t.emitter},context(){return t.context},syncTo:t.syncTo,get:t.get,requestObject(n,c){return t.objectsEmitter.on(n,c),c(t.get(n)),{destroy(){t.objectsEmitter.off(n,c)}}}}}h.make=e})(C||(C={}));class z{constructor(){i(this,"_changes",new Map);i(this,"_syncs",new Set)}change(e,t){if(this._syncs.has(e))return;let s=this._changes.get(e);s||(s=[],this._changes.set(e,s)),!s.includes(t)&&s.push(t)}sync(e){this._syncs.add(e),this._changes.delete(e)}*changes(){const e={objectId:"",fields:[]};for(const[t,s]of this._changes)e.objectId=t,e.fields=s,yield e;this._changes.clear()}*syncs(){for(const e of this._syncs)yield e;this._syncs.clear()}changeForObject(e){const t=this._changes.get(e);return this._changes.delete(e),t??null}}class Q{constructor(){i(this,"_buffer",[]);i(this,"_cursor",0)}feed(e){this._buffer=e,this._cursor=0}cursor(){return this._cursor}setCursor(e){this._cursor=e}skip(e){this._cursor+=e}empty(){return this._cursor>=this._buffer.length}readJSON(){const e=this._buffer[this._cursor];this._cursor++;try{return JSON.parse(e)}catch(t){return console.error("Failed to parse JSON",t),null}}readString(){return this._buffer[this._cursor++]}readFloat(){return parseFloat(this._buffer[this._cursor++])}readInt(){return parseInt(this._buffer[this._cursor++],36)}readBoolean(){return this._buffer[this._cursor++]==="1"}}class D{constructor(){i(this,"_buffer",[]);i(this,"_cursor",-1)}collect(){const e=this._buffer;return this._buffer=[],e}cursor(){return this._cursor===-1?this._buffer.length:this._cursor}setCursor(e){e===this._buffer.length&&(e=-1),this._cursor=e}resume(){this.setCursor(-1)}_write(e){this._cursor===-1?this._buffer.push(e):this._buffer[this._cursor++]=e}writeJSON(e){this._write(JSON.stringify(e))}writeString(e){this._write(e)}writeInt(e){this._write(e.toString(36))}writeFloat(e){this._write(e.toString())}writeBoolean(e){this._write(e?"1":"0")}}class R{constructor(e){i(this,"_channel");i(this,"_context");i(this,"_emitter",new b);i(this,"_objectsEmitter",new b);i(this,"_templates",new Map);i(this,"_objects",new Map);i(this,"_handle");i(this,"_changeQueue",new z);i(this,"_reader",new Q);i(this,"_writer",new D);i(this,"_plugins",[]);i(this,"_onMessage",e=>{switch(e.data.type){case"sync":{this._onSync(e.data.changes);break}case"change":{this._onChange(e.data.changes);break}}});this._channel=e.channel,this._channel.addListener(this._onMessage),this._context=e.context,this._handle=C.make({emitter:this._emitter,objectsEmitter:this._objectsEmitter,context:this._context,syncTo:t=>this.syncTo(t),get:t=>this.get(t)})}emitter(){return this._emitter}plugin(e){var t;this._plugins.push(e),(t=e.init)==null||t.call(e,this._handle)}register(e){this._templates.set(e.type,e)}instantiate(e,t){const s=t??E(),n=this._create(e,s);return this._changeQueue.sync(s),n}send(){const e=this._collectSyncs(),t=this._collectChanges();e.length>0&&this._channel.post(r.Address.broadcast(),{type:"sync",changes:e}),t.length>0&&this._channel.post(r.Address.broadcast(),{type:"change",changes:t})}sendObject(e){const t=this._collectSyncsForObjects([e]),s=this._changeQueue.changeForObject(e),n=s?this._collectChangesForObjects([{objectId:e,fields:s}]):[];t.length>0&&this._channel.post(r.Address.broadcast(),{type:"sync",changes:t}),n.length>0&&this._channel.post(r.Address.broadcast(),{type:"change",changes:n})}syncTo(e){const t=this._collectGlobalSyncs();t.length>0&&this._channel.post(e,{type:"sync",changes:t})}get(e){return this._objects.get(e)??null}getAll(){return[...this._objects.values()]}_create(e,t){var n;const s=e.create(t);w.__setChangeRequester(s,this._makeChangeRequester(t)),w.__setModelHandle(s,this._handle),this._objects.set(t,s);for(const c of this._plugins)(n=c.beforeCreate)==null||n.call(c,s);return this._emitter.emit("created",s),this._objectsEmitter.emit(t,s),s}_makeChangeRequester(e){return{change:t=>this._onChangeRequest(e,t),send:()=>this.sendObject(e)}}_onChangeRequest(e,t){this._changeQueue.change(e,t)}_collectGlobalSyncs(){return this._collectSyncsForObjects(this._objects.keys())}_collectSyncs(){return this._collectSyncsForObjects(this._changeQueue.syncs())}_collectSyncsForObjects(e){const t=this._writer;for(const s of e){const n=this._objects.get(s);if(!n)continue;const c=this._templates.get(n.type());c&&r.Authority.allows(c.authority,n,this._context)&&(t.writeString(n.id()),t.writeString(n.type()),n.write(t))}return t.collect()}_collectChanges(){return this._collectChangesForObjects(this._changeQueue.changes())}_collectChangesForObjects(e){const t=this._writer;for(const{objectId:s,fields:n}of e){const c=this._objects.get(s);if(!c)continue;const o=this._templates.get(c.type());if(!o||!r.Authority.allows(o.authority,c,this._context))continue;t.writeString(s),t.writeInt(n.length);const a=t.cursor();t.writeInt(0);for(const g of n){const S=c.fields()[g];t.writeInt(g),S.writeChange(t),S.clearChange()}const f=t.cursor();t.setCursor(a),t.writeInt(f-a-1),t.resume()}return t.collect()}_onSync(e){const t=this._reader;for(t.feed(e);!t.empty();){const s=t.readString(),n=t.readString();let c=this._objects.get(s);if(c){c.read(t);continue}const o=this._templates.get(n);if(!o){console.error("Could not create object with type",n);return}c=this._create(o,s),c.read(t)}}_onChange(e){const t=this._reader;for(t.feed(e);!t.empty();){const s=t.readString(),n=t.readInt(),c=t.readInt(),o=this._objects.get(s);if(!o){t.skip(c);continue}for(let a=0;a<n;a++){const f=t.readInt();o.fields()[f].readChange(t)}}}}r.Template=void 0,(h=>{function e(t,s,n){return{type:t,create:c=>new s(c,t),authority:n??!0}}h.create=e})(r.Template||(r.Template={}));class A extends _{constructor(t){super();i(this,"_value");this._value=t}get(){return this._value}set(t){this._value=t,this.changed()}read(t){this._value=t.readJSON(),this.emitter().emit("changed")}write(t){t.writeJSON(this._value)}toString(t){switch(typeof this._value){case"function":t.writeLine("[Function]");break;case"object":t.write(JSON.stringify(this._value));break;default:t.writeLine(""+this._value);break}}}class U{constructor(){i(this,"_changes",[])}get last(){return this._changes[this._changes.length-1]}*_reverse(){for(let e=this._changes.length-1;e>-1;e--)yield this._changes[e]}push(...e){const t=this.last;if(t&&t.type===0){t.values.push(...e);return}this._changes.push({type:0,values:e})}pop(){const e=this.last;if(e){if(e.type===0){this._changes.pop();return}if(e.type===1){e.n++;return}}this._changes.push({type:1,n:1})}set(e,t){for(const s of this._reverse()){if(s.type!==2)break;if(s.index===e){s.value=t;return}}this._changes.push({type:2,index:e,value:t})}clear(){this._changes=[],this._changes.push({type:3})}write(e){e.writeInt(this._changes.length);for(const t of this._changes)switch(e.writeInt(t.type),t.type){case 0:e.writeInt(t.values.length);for(const s of t.values)e.writeJSON(s);break;case 1:e.writeInt(t.n);break;case 2:e.writeInt(t.index),e.writeJSON(t.value);break}}read(e,t){const s=e.readInt();for(let n=0;n<s;n++)switch(e.readInt()){case 0:const o=e.readInt();for(let g=0;g<o;g++)t.push(e.readJSON());break;case 1:const a=e.readInt();for(let g=0;g<a;g++)t.pop();break;case 2:const f=e.readInt();t[f]=e.readJSON();break;case 3:t.splice(0,t.length);break}}reset(){this._changes=[]}}class M extends _{constructor(t){super();i(this,"_value");i(this,"_changes",new U);this._value=t}get(){return this._value}push(...t){this._value.push(...t),this._changes.push(...t),this.changed()}pop(){const t=this._value.pop();return t&&(this._changes.pop(),this.changed()),t??null}set(t){this._value=t,this._changes.clear(),this._changes.push(...t),this.changed()}setAt(t,s){if(t<0||t>=this._value.length)throw new Error("Index out of range");this._value[t]=s,this._changes.set(t,s),this.changed()}clear(){this._value.length!==0&&(this._value=[],this._changes.clear(),this.changed())}read(t){this._value=t.readJSON(),this.emitter().emit("changed")}write(t){t.writeJSON(this._value)}readChange(t){this._changes.read(t,this._value),this.changed()}writeChange(t){this._changes.write(t)}clearChange(){this._changes.reset()}}class F extends _{constructor(t,s){super();i(this,"_object");i(this,"_changes",[]);this._object=t.create(s??"sub")}get(){return this._object}read(t){this._object.read(t),this.emitter().emit("changed")}write(t){this._object.write(t)}readChange(t){const s=t.readInt();for(let n=0;n<s;n++){const c=t.readInt();this._object.fields()[c].readChange(t)}this.emitter().emit("changed")}writeChange(t){const s=this._changes.length;t.writeInt(s);for(const n of this._changes)t.writeInt(n),this._object.fields()[n].writeChange(t)}clearChange(){for(const t of this._changes)this._object.fields()[t].clearChange();this._changes=[]}onModelHandle(t){w.__setModelHandle(this._object,t)}onChangeRequester(t){w.__setChangeRequester(this._object,{change:s=>{this._changes.push(s),t.change(this.index()),this.emitter().emit("changed")},send:()=>{t.send()}})}toString(t){w.write(this._object,t)}}class H extends _{constructor(t){super();i(this,"_objectId");i(this,"_object",null);i(this,"_modelHandle",null);i(this,"_objectRequest",null);this._objectId=t}read(t){const s=t.readJSON();s!==this._objectId&&(this._setObjectId(s),this.emitter().emit("changed"))}write(t){t.writeJSON(this._objectId)}set(t){const s=(t==null?void 0:t.id())??null;s!==this._objectId&&(this._setObjectId(s),this.changed())}get(){return this._object}_setObjectId(t){var s,n;(s=this._objectRequest)==null||s.destroy(),this._objectId=t,this._object=null,t?this._objectRequest=((n=this._modelHandle)==null?void 0:n.requestObject(t,c=>{this._object=c}))??null:this._objectRequest=null,this.emitter().emit("changed")}onModelHandle(t){this._modelHandle=t,this._objectId&&this._setObjectId(this._objectId)}toString(t){t.write("ref "),this._object?w.write(this._object,t):t.writeLine(`${this._objectId} (null)`)}}class q extends _{constructor(){super(...arguments);i(this,"_objects",new Map);i(this,"_modelHandle",null)}add(t){this._objects.set(t.id(),t),this.changed()}remove(t){this._objects.delete(t.id()),this.changed()}has(t){return this._objects.has(t.id())}*values(){for(const t of this._objects.values())t!==null&&(yield t)}read(t){var n;const s=t.readInt();this._objects.clear();for(let c=0;c<s;c++){const o=t.readString();this._objects.set(o,((n=this._modelHandle)==null?void 0:n.get(o))??null)}this.emitter().emit("changed")}write(t){t.writeInt(this._objects.size);for(const s of this._objects.keys())t.writeString(s)}onModelHandle(t){this._modelHandle=t,this._modelHandle.emitter().on("created",s=>{const n=s.id();this._objects.has(n)&&this._objects.set(n,s),this.emitter().emit("changed")})}}r.field=void 0,(h=>{function e(o){return new A(o)}h.any=e;function t(o){return new M(o)}h.array=t;function s(o){return new H(o)}h.ref=s;function n(o){return new F(o)}h.object=n;function c(){return new q}h.refSet=c})(r.field||(r.field={}));class T{constructor(e){i(this,"_model",null);i(this,"_onConnected",e=>{this._model&&this._model.syncTo(r.Address.to(e))});i(this,"_onSync",()=>{this._model&&this._model.syncTo(r.Address.broadcast())});e.emitter().on("connected",this._onConnected),e.emitter().on("sync",this._onSync)}init(e){this._model=e}}class B{constructor(e){i(this,"_connectionList");i(this,"_model");i(this,"_emitter",new b);i(this,"_user");i(this,"_others",[]);i(this,"_onUserCreated",e=>{this._connectionList.isConnected(e.id())&&!this._others.includes(e)&&(this._others.push(e),this._emitter.emit("changed",this.users()),this._emitter.emit("connected",e))});i(this,"_onConnected",e=>{if(e===this._user.id()||this._others.some(s=>s.id()===e))return;const t=this._model.get(e);t&&(this._others.push(t),this._emitter.emit("changed",this.users()),this._emitter.emit("connected",t))});i(this,"_onDisconnected",e=>{if(e===this._user.id())return;const t=this._others.findIndex(s=>s.id()===e);t<0||(this._others.splice(t,1),this._emitter.emit("changed",this.users()),this._emitter.emit("disconnected",e))});this._connectionList=e.connectionList,this._model=new R({channel:e.channel,context:e.context});const t=r.Template.create("user",e.factory,r.Authority.own());this._model.register(t),this._model.plugin(new T(e.connectionList)),this._user=this._model.instantiate(t,e.context.userId),e.connectionList.emitter().on("connected",this._onConnected),e.connectionList.emitter().on("disconnected",this._onDisconnected),this._model.emitter().on("created",s=>this._onUserCreated(s));for(const s of this._connectionList.users())this._onConnected(s)}user(){return this._user}users(){return[this._user,...this._others]}others(){return[...this._others]}emitter(){return this._emitter}send(){this._model.send()}register(e){const t={};for(const c of[this._user,...this._others])t[c.id()]=c.register(e);function s(c){t[c.id()]=c.register(e)}function n(c){const o=t[c];o&&(o(),delete t[c])}return this.emitter().on("connected",s),this.emitter().on("disconnected",n),()=>{this.emitter().off("connected",s),this.emitter().off("disconnected",n);for(const c of Object.values(t))c()}}}class j{constructor(e,t){i(this,"_isOwner");i(this,"_channel");i(this,"_users",new Set);i(this,"_emitter",new b);i(this,"_onMessage",e=>{switch(e.data.type){case"connected":{if(this._isOwner||this._users.has(e.data.userId))return;this._connected(e.data.userId);break}case"disconnected":{if(this._isOwner||!this._users.has(e.data.userId))return;this._disconnected(e.data.userId);break}case"sync":{if(this._isOwner)return;this._sync(e.data.userIds)}}});this._isOwner=e,this._channel=t,this._channel.addListener(this._onMessage)}static owner(e){return new j(!0,e)}static client(e){return new j(!1,e)}emitter(){return this._emitter}users(){return this._users.values()}isConnected(e){return this._users.has(e)}connected(e){this._users.has(e)||(this._connected(e),this._isOwner&&(this._channel.post(r.Address.broadcast(),{type:"connected",userId:e}),this._channel.post(r.Address.to(e),{type:"sync",userIds:[...this._users]})))}disconnected(e){this._users.has(e)&&(this._disconnected(e),this._isOwner&&this._channel.post(r.Address.broadcast(),{type:"disconnected",userId:e}))}_connected(e){this._users.add(e),this._emitter.emit("connected",e)}_disconnected(e){this._users.delete(e),this._emitter.emit("disconnected",e)}_sync(e){for(const t of[...this._users])e.includes(t)||this._disconnected(t);for(const t of e)this._users.has(t)||this._connected(t);this._emitter.emit("sync")}}class u{constructor(e,t){i(this,"_callback");i(this,"_callHandler",null);i(this,"address");this._callback=t,this.address=e}static setCallHandler(e,t){e._callHandler=t}static host(e){return new u(r.Address.host(),e)}static target(e,t){return new u(r.Address.to(e),t)}static broadcast(e){return new u(r.Address.broadcast(),e)}static all(e){return new u(r.Address.all(),e)}static dynamic(e,t){return new u(r.Address.dynamic(e),t)}static call(e,t){try{e._callback(...t)}catch(s){console.error("Error while executing RPC:",s)}}call(...e){if(this._callHandler===null)throw new Error("Trying to call RPC without initialization");return this._callHandler.call(this.address,e)}}var I;(h=>{function e(t,s){return{id:t,args:s}}h.make=e})(I||(I={}));class J{constructor(e,t){i(this,"_self");i(this,"_channel");i(this,"_rpcs",{});i(this,"_onMessage",e=>{const t=e.data,s=e.originId;r.Address.match(e.originId,e.address,this._self)&&this._onRequest(t,s)});this._self=e,this._channel=t,this._channel.addListener(this._onMessage)}register(e,t){if(this._rpcs[t]){console.error("Trying to register rpc twice:",t);return}this._rpcs[t]=e,u.setCallHandler(e,this._makeCallHandler(t))}infuse(e,t){for(const s in e)e[s]instanceof u&&this.register(e[s],`${t}.${s}`)}_makeCallHandler(e){return{call:(s,n)=>{const c=I.make(e,n);this._channel.post(s,c)}}}_onRequest(e,t){const{id:s,args:n}=e,c=this._rpcs[s];if(!c){console.error(`Received unhandled RPC request '${s}', originated from ${t}`);return}u.call(c,n)}}class W{constructor(e,t){i(this,"_handler");this._handler=new J(e,t)}beforeCreate(e){let t=0;for(const s in e){const n=e[s];n instanceof u&&this._handler.register(n,`${e.id()}.${t++}`)}}}r.AnyField=A,r.ArrayField=M,r.ConnectionList=j,r.ConnectionPlugin=T,r.Context=O,r.Emitter=b,r.Field=_,r.Model=R,r.Presence=B,r.RPC=u,r.RPCHandler=J,r.RPCPlugin=W,r.Router=N,r.SyncObject=w,r.SyncObjectField=F,r.SyncObjectRefField=H,r.SyncObjectRefSetField=q,Object.defineProperty(r,Symbol.toStringTag,{value:"Module"})});
