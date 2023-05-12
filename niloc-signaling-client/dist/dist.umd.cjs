(function(l,u){typeof exports=="object"&&typeof module<"u"?u(exports):typeof define=="function"&&define.amd?define(["exports"],u):(l=typeof globalThis<"u"?globalThis:l||self,u(l.dist={}))})(this,function(l){"use strict";var et=Object.defineProperty;var tt=(l,u,g)=>u in l?et(l,u,{enumerable:!0,configurable:!0,writable:!0,value:g}):l[u]=g;var O=(l,u,g)=>(tt(l,typeof u!="symbol"?u+"":u,g),g);var u=Object.defineProperty,g=(i,e,t)=>e in i?u(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,M=(i,e,t)=>(g(i,typeof e!="symbol"?e+"":e,t),t);class le{constructor(){M(this,"_listeners",{}),M(this,"_onceListeners",{})}on(e,t){this._listeners[e]||(this._listeners[e]=new Set),this._listeners[e].add(t)}off(e,t){this._listeners[e]&&(this._listeners[e].delete(t),this._listeners[e].size===0&&delete this._listeners[e])}once(e,t){this._onceListeners[e]||(this._onceListeners[e]=new Set),this._onceListeners[e].add(t)}offOnce(e,t){this._onceListeners[e]&&(this._onceListeners[e].delete(t),this._onceListeners[e].size===0&&delete this._onceListeners[e])}emit(e,t){if(this._listeners[e])for(const s of[...this._listeners[e]])s(t);if(this._onceListeners[e]){for(const s of[...this._onceListeners[e]])s(t);delete this._onceListeners[e]}}removeAllListeners(){this._listeners={},this._onceListeners={}}}const d=Object.create(null);d.open="0",d.close="1",d.ping="2",d.pong="3",d.message="4",d.upgrade="5",d.noop="6";const T=Object.create(null);Object.keys(d).forEach(i=>{T[d[i]]=i});const fe={type:"error",data:"parser error"},pe=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",de=typeof ArrayBuffer=="function",ye=i=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(i):i&&i.buffer instanceof ArrayBuffer,U=({type:i,data:e},t,s)=>pe&&e instanceof Blob?t?s(e):H(e,s):de&&(e instanceof ArrayBuffer||ye(e))?t?s(e):H(new Blob([e]),s):s(d[i]+(e||"")),H=(i,e)=>{const t=new FileReader;return t.onload=function(){const s=t.result.split(",")[1];e("b"+(s||""))},t.readAsDataURL(i)},K="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",k=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let i=0;i<K.length;i++)k[K.charCodeAt(i)]=i;const me=i=>{let e=i.length*.75,t=i.length,s,n=0,r,o,a,m;i[i.length-1]==="="&&(e--,i[i.length-2]==="="&&e--);const A=new ArrayBuffer(e),b=new Uint8Array(A);for(s=0;s<t;s+=4)r=k[i.charCodeAt(s)],o=k[i.charCodeAt(s+1)],a=k[i.charCodeAt(s+2)],m=k[i.charCodeAt(s+3)],b[n++]=r<<2|o>>4,b[n++]=(o&15)<<4|a>>2,b[n++]=(a&3)<<6|m&63;return A},ge=typeof ArrayBuffer=="function",z=(i,e)=>{if(typeof i!="string")return{type:"message",data:Y(i,e)};const t=i.charAt(0);return t==="b"?{type:"message",data:_e(i.substring(1),e)}:T[t]?i.length>1?{type:T[t],data:i.substring(1)}:{type:T[t]}:fe},_e=(i,e)=>{if(ge){const t=me(i);return Y(t,e)}else return{base64:!0,data:i}},Y=(i,e)=>{switch(e){case"blob":return i instanceof ArrayBuffer?new Blob([i]):i;case"arraybuffer":default:return i}},$=String.fromCharCode(30),be=(i,e)=>{const t=i.length,s=new Array(t);let n=0;i.forEach((r,o)=>{U(r,!1,a=>{s[o]=a,++n===t&&e(s.join($))})})},we=(i,e)=>{const t=i.split($),s=[];for(let n=0;n<t.length;n++){const r=z(t[n],e);if(s.push(r),r.type==="error")break}return s},W=4;function h(i){if(i)return ve(i)}function ve(i){for(var e in h.prototype)i[e]=h.prototype[e];return i}h.prototype.on=h.prototype.addEventListener=function(i,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+i]=this._callbacks["$"+i]||[]).push(e),this},h.prototype.once=function(i,e){function t(){this.off(i,t),e.apply(this,arguments)}return t.fn=e,this.on(i,t),this},h.prototype.off=h.prototype.removeListener=h.prototype.removeAllListeners=h.prototype.removeEventListener=function(i,e){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var t=this._callbacks["$"+i];if(!t)return this;if(arguments.length==1)return delete this._callbacks["$"+i],this;for(var s,n=0;n<t.length;n++)if(s=t[n],s===e||s.fn===e){t.splice(n,1);break}return t.length===0&&delete this._callbacks["$"+i],this},h.prototype.emit=function(i){this._callbacks=this._callbacks||{};for(var e=new Array(arguments.length-1),t=this._callbacks["$"+i],s=1;s<arguments.length;s++)e[s-1]=arguments[s];if(t){t=t.slice(0);for(var s=0,n=t.length;s<n;++s)t[s].apply(this,e)}return this},h.prototype.emitReserved=h.prototype.emit,h.prototype.listeners=function(i){return this._callbacks=this._callbacks||{},this._callbacks["$"+i]||[]},h.prototype.hasListeners=function(i){return!!this.listeners(i).length};const f=(()=>typeof self<"u"?self:typeof window<"u"?window:Function("return this")())();function Q(i,...e){return e.reduce((t,s)=>(i.hasOwnProperty(s)&&(t[s]=i[s]),t),{})}const ke=f.setTimeout,Ee=f.clearTimeout;function C(i,e){e.useNativeTimers?(i.setTimeoutFn=ke.bind(f),i.clearTimeoutFn=Ee.bind(f)):(i.setTimeoutFn=f.setTimeout.bind(f),i.clearTimeoutFn=f.clearTimeout.bind(f))}const Ae=1.33;function Re(i){return typeof i=="string"?Oe(i):Math.ceil((i.byteLength||i.size)*Ae)}function Oe(i){let e=0,t=0;for(let s=0,n=i.length;s<n;s++)e=i.charCodeAt(s),e<128?t+=1:e<2048?t+=2:e<55296||e>=57344?t+=3:(s++,t+=4);return t}class Te extends Error{constructor(e,t,s){super(e),this.description=t,this.context=s,this.type="TransportError"}}class J extends h{constructor(e){super(),this.writable=!1,C(this,e),this.opts=e,this.query=e.query,this.socket=e.socket}onError(e,t,s){return super.emitReserved("error",new Te(e,t,s)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(e){this.readyState==="open"&&this.write(e)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(e){const t=z(e,this.socket.binaryType);this.onPacket(t)}onPacket(e){super.emitReserved("packet",e)}onClose(e){this.readyState="closed",super.emitReserved("close",e)}pause(e){}}const X="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""),L=64,Ce={};let j=0,S=0,G;function Z(i){let e="";do e=X[i%L]+e,i=Math.floor(i/L);while(i>0);return e}function ee(){const i=Z(+new Date);return i!==G?(j=0,G=i):i+"."+Z(j++)}for(;S<L;S++)Ce[X[S]]=S;function te(i){let e="";for(let t in i)i.hasOwnProperty(t)&&(e.length&&(e+="&"),e+=encodeURIComponent(t)+"="+encodeURIComponent(i[t]));return e}function Se(i){let e={},t=i.split("&");for(let s=0,n=t.length;s<n;s++){let r=t[s].split("=");e[decodeURIComponent(r[0])]=decodeURIComponent(r[1])}return e}let se=!1;try{se=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const Be=se;function ie(i){const e=i.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!e||Be))return new XMLHttpRequest}catch{}if(!e)try{return new f[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}function Ne(){}const xe=function(){return new ie({xdomain:!1}).responseType!=null}();class Le extends J{constructor(e){if(super(e),this.polling=!1,typeof location<"u"){const s=location.protocol==="https:";let n=location.port;n||(n=s?"443":"80"),this.xd=typeof location<"u"&&e.hostname!==location.hostname||n!==e.port,this.xs=e.secure!==s}const t=e&&e.forceBase64;this.supportsBinary=xe&&!t}get name(){return"polling"}doOpen(){this.poll()}pause(e){this.readyState="pausing";const t=()=>{this.readyState="paused",e()};if(this.polling||!this.writable){let s=0;this.polling&&(s++,this.once("pollComplete",function(){--s||t()})),this.writable||(s++,this.once("drain",function(){--s||t()}))}else t()}poll(){this.polling=!0,this.doPoll(),this.emitReserved("poll")}onData(e){const t=s=>{if(this.readyState==="opening"&&s.type==="open"&&this.onOpen(),s.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(s)};we(e,this.socket.binaryType).forEach(t),this.readyState!=="closed"&&(this.polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this.poll())}doClose(){const e=()=>{this.write([{type:"close"}])};this.readyState==="open"?e():this.once("open",e)}write(e){this.writable=!1,be(e,t=>{this.doWrite(t,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){let e=this.query||{};const t=this.opts.secure?"https":"http";let s="";this.opts.timestampRequests!==!1&&(e[this.opts.timestampParam]=ee()),!this.supportsBinary&&!e.sid&&(e.b64=1),this.opts.port&&(t==="https"&&Number(this.opts.port)!==443||t==="http"&&Number(this.opts.port)!==80)&&(s=":"+this.opts.port);const n=te(e),r=this.opts.hostname.indexOf(":")!==-1;return t+"://"+(r?"["+this.opts.hostname+"]":this.opts.hostname)+s+this.opts.path+(n.length?"?"+n:"")}request(e={}){return Object.assign(e,{xd:this.xd,xs:this.xs},this.opts),new y(this.uri(),e)}doWrite(e,t){const s=this.request({method:"POST",data:e});s.on("success",t),s.on("error",(n,r)=>{this.onError("xhr post error",n,r)})}doPoll(){const e=this.request();e.on("data",this.onData.bind(this)),e.on("error",(t,s)=>{this.onError("xhr poll error",t,s)}),this.pollXhr=e}}class y extends h{constructor(e,t){super(),C(this,t),this.opts=t,this.method=t.method||"GET",this.uri=e,this.async=t.async!==!1,this.data=t.data!==void 0?t.data:null,this.create()}create(){const e=Q(this.opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");e.xdomain=!!this.opts.xd,e.xscheme=!!this.opts.xs;const t=this.xhr=new ie(e);try{t.open(this.method,this.uri,this.async);try{if(this.opts.extraHeaders){t.setDisableHeaderCheck&&t.setDisableHeaderCheck(!0);for(let s in this.opts.extraHeaders)this.opts.extraHeaders.hasOwnProperty(s)&&t.setRequestHeader(s,this.opts.extraHeaders[s])}}catch{}if(this.method==="POST")try{t.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{t.setRequestHeader("Accept","*/*")}catch{}"withCredentials"in t&&(t.withCredentials=this.opts.withCredentials),this.opts.requestTimeout&&(t.timeout=this.opts.requestTimeout),t.onreadystatechange=()=>{t.readyState===4&&(t.status===200||t.status===1223?this.onLoad():this.setTimeoutFn(()=>{this.onError(typeof t.status=="number"?t.status:0)},0))},t.send(this.data)}catch(s){this.setTimeoutFn(()=>{this.onError(s)},0);return}typeof document<"u"&&(this.index=y.requestsCount++,y.requests[this.index]=this)}onError(e){this.emitReserved("error",e,this.xhr),this.cleanup(!0)}cleanup(e){if(!(typeof this.xhr>"u"||this.xhr===null)){if(this.xhr.onreadystatechange=Ne,e)try{this.xhr.abort()}catch{}typeof document<"u"&&delete y.requests[this.index],this.xhr=null}}onLoad(){const e=this.xhr.responseText;e!==null&&(this.emitReserved("data",e),this.emitReserved("success"),this.cleanup())}abort(){this.cleanup()}}if(y.requestsCount=0,y.requests={},typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",ne);else if(typeof addEventListener=="function"){const i="onpagehide"in f?"pagehide":"unload";addEventListener(i,ne,!1)}}function ne(){for(let i in y.requests)y.requests.hasOwnProperty(i)&&y.requests[i].abort()}const re=(()=>typeof Promise=="function"&&typeof Promise.resolve=="function"?e=>Promise.resolve().then(e):(e,t)=>t(e,0))(),B=f.WebSocket||f.MozWebSocket,oe=!0,Pe="arraybuffer",ce=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class qe extends J{constructor(e){super(e),this.supportsBinary=!e.forceBase64}get name(){return"websocket"}doOpen(){if(!this.check())return;const e=this.uri(),t=this.opts.protocols,s=ce?{}:Q(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(s.headers=this.opts.extraHeaders);try{this.ws=oe&&!ce?t?new B(e,t):new B(e):new B(e,t,s)}catch(n){return this.emitReserved("error",n)}this.ws.binaryType=this.socket.binaryType||Pe,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=e=>this.onClose({description:"websocket connection closed",context:e}),this.ws.onmessage=e=>this.onData(e.data),this.ws.onerror=e=>this.onError("websocket error",e)}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const s=e[t],n=t===e.length-1;U(s,this.supportsBinary,r=>{const o={};try{oe&&this.ws.send(r)}catch{}n&&re(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.close(),this.ws=null)}uri(){let e=this.query||{};const t=this.opts.secure?"wss":"ws";let s="";this.opts.port&&(t==="wss"&&Number(this.opts.port)!==443||t==="ws"&&Number(this.opts.port)!==80)&&(s=":"+this.opts.port),this.opts.timestampRequests&&(e[this.opts.timestampParam]=ee()),this.supportsBinary||(e.b64=1);const n=te(e),r=this.opts.hostname.indexOf(":")!==-1;return t+"://"+(r?"["+this.opts.hostname+"]":this.opts.hostname)+s+this.opts.path+(n.length?"?"+n:"")}check(){return!!B}}const Ie={websocket:qe,polling:Le},De=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,Fe=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function P(i){const e=i,t=i.indexOf("["),s=i.indexOf("]");t!=-1&&s!=-1&&(i=i.substring(0,t)+i.substring(t,s).replace(/:/g,";")+i.substring(s,i.length));let n=De.exec(i||""),r={},o=14;for(;o--;)r[Fe[o]]=n[o]||"";return t!=-1&&s!=-1&&(r.source=e,r.host=r.host.substring(1,r.host.length-1).replace(/;/g,":"),r.authority=r.authority.replace("[","").replace("]","").replace(/;/g,":"),r.ipv6uri=!0),r.pathNames=Ve(r,r.path),r.queryKey=Me(r,r.query),r}function Ve(i,e){const t=/\/{2,9}/g,s=e.replace(t,"/").split("/");return(e.slice(0,1)=="/"||e.length===0)&&s.splice(0,1),e.slice(-1)=="/"&&s.splice(s.length-1,1),s}function Me(i,e){const t={};return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(s,n,r){n&&(t[n]=r)}),t}let he=class v extends h{constructor(e,t={}){super(),this.writeBuffer=[],e&&typeof e=="object"&&(t=e,e=null),e?(e=P(e),t.hostname=e.host,t.secure=e.protocol==="https"||e.protocol==="wss",t.port=e.port,e.query&&(t.query=e.query)):t.host&&(t.hostname=P(t.host).host),C(this,t),this.secure=t.secure!=null?t.secure:typeof location<"u"&&location.protocol==="https:",t.hostname&&!t.port&&(t.port=this.secure?"443":"80"),this.hostname=t.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=t.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=t.transports||["polling","websocket"],this.writeBuffer=[],this.prevBufferLen=0,this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!0},t),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=Se(this.opts.query)),this.id=null,this.upgrades=null,this.pingInterval=null,this.pingTimeout=null,this.pingTimeoutTimer=null,typeof addEventListener=="function"&&(this.opts.closeOnBeforeunload&&(this.beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this.beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this.offlineEventListener=()=>{this.onClose("transport close",{description:"network connection lost"})},addEventListener("offline",this.offlineEventListener,!1))),this.open()}createTransport(e){const t=Object.assign({},this.opts.query);t.EIO=W,t.transport=e,this.id&&(t.sid=this.id);const s=Object.assign({},this.opts.transportOptions[e],this.opts,{query:t,socket:this,hostname:this.hostname,secure:this.secure,port:this.port});return new Ie[e](s)}open(){let e;if(this.opts.rememberUpgrade&&v.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1)e="websocket";else if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}else e=this.transports[0];this.readyState="opening";try{e=this.createTransport(e)}catch{this.transports.shift(),this.open();return}e.open(),this.setTransport(e)}setTransport(e){this.transport&&this.transport.removeAllListeners(),this.transport=e,e.on("drain",this.onDrain.bind(this)).on("packet",this.onPacket.bind(this)).on("error",this.onError.bind(this)).on("close",t=>this.onClose("transport close",t))}probe(e){let t=this.createTransport(e),s=!1;v.priorWebsocketSuccess=!1;const n=()=>{s||(t.send([{type:"ping",data:"probe"}]),t.once("packet",w=>{if(!s)if(w.type==="pong"&&w.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",t),!t)return;v.priorWebsocketSuccess=t.name==="websocket",this.transport.pause(()=>{s||this.readyState!=="closed"&&(b(),this.setTransport(t),t.send([{type:"upgrade"}]),this.emitReserved("upgrade",t),t=null,this.upgrading=!1,this.flush())})}else{const R=new Error("probe error");R.transport=t.name,this.emitReserved("upgradeError",R)}}))};function r(){s||(s=!0,b(),t.close(),t=null)}const o=w=>{const R=new Error("probe error: "+w);R.transport=t.name,r(),this.emitReserved("upgradeError",R)};function a(){o("transport closed")}function m(){o("socket closed")}function A(w){t&&w.name!==t.name&&r()}const b=()=>{t.removeListener("open",n),t.removeListener("error",o),t.removeListener("close",a),this.off("close",m),this.off("upgrading",A)};t.once("open",n),t.once("error",o),t.once("close",a),this.once("close",m),this.once("upgrading",A),t.open()}onOpen(){if(this.readyState="open",v.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush(),this.readyState==="open"&&this.opts.upgrade){let e=0;const t=this.upgrades.length;for(;e<t;e++)this.probe(this.upgrades[e])}}onPacket(e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",e),this.emitReserved("heartbeat"),e.type){case"open":this.onHandshake(JSON.parse(e.data));break;case"ping":this.resetPingTimeout(),this.sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong");break;case"error":const t=new Error("server error");t.code=e.data,this.onError(t);break;case"message":this.emitReserved("data",e.data),this.emitReserved("message",e.data);break}}onHandshake(e){this.emitReserved("handshake",e),this.id=e.sid,this.transport.query.sid=e.sid,this.upgrades=this.filterUpgrades(e.upgrades),this.pingInterval=e.pingInterval,this.pingTimeout=e.pingTimeout,this.maxPayload=e.maxPayload,this.onOpen(),this.readyState!=="closed"&&this.resetPingTimeout()}resetPingTimeout(){this.clearTimeoutFn(this.pingTimeoutTimer),this.pingTimeoutTimer=this.setTimeoutFn(()=>{this.onClose("ping timeout")},this.pingInterval+this.pingTimeout),this.opts.autoUnref&&this.pingTimeoutTimer.unref()}onDrain(){this.writeBuffer.splice(0,this.prevBufferLen),this.prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const e=this.getWritablePackets();this.transport.send(e),this.prevBufferLen=e.length,this.emitReserved("flush")}}getWritablePackets(){if(!(this.maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let t=1;for(let s=0;s<this.writeBuffer.length;s++){const n=this.writeBuffer[s].data;if(n&&(t+=Re(n)),s>0&&t>this.maxPayload)return this.writeBuffer.slice(0,s);t+=2}return this.writeBuffer}write(e,t,s){return this.sendPacket("message",e,t,s),this}send(e,t,s){return this.sendPacket("message",e,t,s),this}sendPacket(e,t,s,n){if(typeof t=="function"&&(n=t,t=void 0),typeof s=="function"&&(n=s,s=null),this.readyState==="closing"||this.readyState==="closed")return;s=s||{},s.compress=s.compress!==!1;const r={type:e,data:t,options:s};this.emitReserved("packetCreate",r),this.writeBuffer.push(r),n&&this.once("flush",n),this.flush()}close(){const e=()=>{this.onClose("forced close"),this.transport.close()},t=()=>{this.off("upgrade",t),this.off("upgradeError",t),e()},s=()=>{this.once("upgrade",t),this.once("upgradeError",t)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?s():e()}):this.upgrading?s():e()),this}onError(e){v.priorWebsocketSuccess=!1,this.emitReserved("error",e),this.onClose("transport error",e)}onClose(e,t){(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")&&(this.clearTimeoutFn(this.pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),typeof removeEventListener=="function"&&(removeEventListener("beforeunload",this.beforeunloadEventListener,!1),removeEventListener("offline",this.offlineEventListener,!1)),this.readyState="closed",this.id=null,this.emitReserved("close",e,t),this.writeBuffer=[],this.prevBufferLen=0)}filterUpgrades(e){const t=[];let s=0;const n=e.length;for(;s<n;s++)~this.transports.indexOf(e[s])&&t.push(e[s]);return t}};he.protocol=W;function Ue(i,e="",t){let s=i;t=t||typeof location<"u"&&location,i==null&&(i=t.protocol+"//"+t.host),typeof i=="string"&&(i.charAt(0)==="/"&&(i.charAt(1)==="/"?i=t.protocol+i:i=t.host+i),/^(https?|wss?):\/\//.test(i)||(typeof t<"u"?i=t.protocol+"//"+i:i="https://"+i),s=P(i)),s.port||(/^(http|ws)$/.test(s.protocol)?s.port="80":/^(http|ws)s$/.test(s.protocol)&&(s.port="443")),s.path=s.path||"/";const r=s.host.indexOf(":")!==-1?"["+s.host+"]":s.host;return s.id=s.protocol+"://"+r+":"+s.port+e,s.href=s.protocol+"://"+r+(t&&t.port===s.port?"":":"+s.port),s}const He=typeof ArrayBuffer=="function",Ke=i=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(i):i.buffer instanceof ArrayBuffer,ae=Object.prototype.toString,ze=typeof Blob=="function"||typeof Blob<"u"&&ae.call(Blob)==="[object BlobConstructor]",Ye=typeof File=="function"||typeof File<"u"&&ae.call(File)==="[object FileConstructor]";function q(i){return He&&(i instanceof ArrayBuffer||Ke(i))||ze&&i instanceof Blob||Ye&&i instanceof File}function N(i,e){if(!i||typeof i!="object")return!1;if(Array.isArray(i)){for(let t=0,s=i.length;t<s;t++)if(N(i[t]))return!0;return!1}if(q(i))return!0;if(i.toJSON&&typeof i.toJSON=="function"&&arguments.length===1)return N(i.toJSON(),!0);for(const t in i)if(Object.prototype.hasOwnProperty.call(i,t)&&N(i[t]))return!0;return!1}function $e(i){const e=[],t=i.data,s=i;return s.data=I(t,e),s.attachments=e.length,{packet:s,buffers:e}}function I(i,e){if(!i)return i;if(q(i)){const t={_placeholder:!0,num:e.length};return e.push(i),t}else if(Array.isArray(i)){const t=new Array(i.length);for(let s=0;s<i.length;s++)t[s]=I(i[s],e);return t}else if(typeof i=="object"&&!(i instanceof Date)){const t={};for(const s in i)Object.prototype.hasOwnProperty.call(i,s)&&(t[s]=I(i[s],e));return t}return i}function We(i,e){return i.data=D(i.data,e),delete i.attachments,i}function D(i,e){if(!i)return i;if(i&&i._placeholder===!0){if(typeof i.num=="number"&&i.num>=0&&i.num<e.length)return e[i.num];throw new Error("illegal attachments")}else if(Array.isArray(i))for(let t=0;t<i.length;t++)i[t]=D(i[t],e);else if(typeof i=="object")for(const t in i)Object.prototype.hasOwnProperty.call(i,t)&&(i[t]=D(i[t],e));return i}const Qe=5;var c;(function(i){i[i.CONNECT=0]="CONNECT",i[i.DISCONNECT=1]="DISCONNECT",i[i.EVENT=2]="EVENT",i[i.ACK=3]="ACK",i[i.CONNECT_ERROR=4]="CONNECT_ERROR",i[i.BINARY_EVENT=5]="BINARY_EVENT",i[i.BINARY_ACK=6]="BINARY_ACK"})(c||(c={}));class Je{constructor(e){this.replacer=e}encode(e){return(e.type===c.EVENT||e.type===c.ACK)&&N(e)?this.encodeAsBinary({type:e.type===c.EVENT?c.BINARY_EVENT:c.BINARY_ACK,nsp:e.nsp,data:e.data,id:e.id}):[this.encodeAsString(e)]}encodeAsString(e){let t=""+e.type;return(e.type===c.BINARY_EVENT||e.type===c.BINARY_ACK)&&(t+=e.attachments+"-"),e.nsp&&e.nsp!=="/"&&(t+=e.nsp+","),e.id!=null&&(t+=e.id),e.data!=null&&(t+=JSON.stringify(e.data,this.replacer)),t}encodeAsBinary(e){const t=$e(e),s=this.encodeAsString(t.packet),n=t.buffers;return n.unshift(s),n}}class F extends h{constructor(e){super(),this.reviver=e}add(e){let t;if(typeof e=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");t=this.decodeString(e);const s=t.type===c.BINARY_EVENT;s||t.type===c.BINARY_ACK?(t.type=s?c.EVENT:c.ACK,this.reconstructor=new Xe(t),t.attachments===0&&super.emitReserved("decoded",t)):super.emitReserved("decoded",t)}else if(q(e)||e.base64)if(this.reconstructor)t=this.reconstructor.takeBinaryData(e),t&&(this.reconstructor=null,super.emitReserved("decoded",t));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+e)}decodeString(e){let t=0;const s={type:Number(e.charAt(0))};if(c[s.type]===void 0)throw new Error("unknown packet type "+s.type);if(s.type===c.BINARY_EVENT||s.type===c.BINARY_ACK){const r=t+1;for(;e.charAt(++t)!=="-"&&t!=e.length;);const o=e.substring(r,t);if(o!=Number(o)||e.charAt(t)!=="-")throw new Error("Illegal attachments");s.attachments=Number(o)}if(e.charAt(t+1)==="/"){const r=t+1;for(;++t&&!(e.charAt(t)===","||t===e.length););s.nsp=e.substring(r,t)}else s.nsp="/";const n=e.charAt(t+1);if(n!==""&&Number(n)==n){const r=t+1;for(;++t;){const o=e.charAt(t);if(o==null||Number(o)!=o){--t;break}if(t===e.length)break}s.id=Number(e.substring(r,t+1))}if(e.charAt(++t)){const r=this.tryParse(e.substr(t));if(F.isPayloadValid(s.type,r))s.data=r;else throw new Error("invalid payload")}return s}tryParse(e){try{return JSON.parse(e,this.reviver)}catch{return!1}}static isPayloadValid(e,t){switch(e){case c.CONNECT:return typeof t=="object";case c.DISCONNECT:return t===void 0;case c.CONNECT_ERROR:return typeof t=="string"||typeof t=="object";case c.EVENT:case c.BINARY_EVENT:return Array.isArray(t)&&t.length>0;case c.ACK:case c.BINARY_ACK:return Array.isArray(t)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class Xe{constructor(e){this.packet=e,this.buffers=[],this.reconPack=e}takeBinaryData(e){if(this.buffers.push(e),this.buffers.length===this.reconPack.attachments){const t=We(this.reconPack,this.buffers);return this.finishedReconstruction(),t}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}const je=Object.freeze(Object.defineProperty({__proto__:null,Decoder:F,Encoder:Je,get PacketType(){return c},protocol:Qe},Symbol.toStringTag,{value:"Module"}));function p(i,e,t){return i.on(e,t),function(){i.off(e,t)}}const Ge=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class ue extends h{constructor(e,t,s){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=e,this.nsp=t,s&&s.auth&&(this.auth=s.auth),this._opts=Object.assign({},s),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const e=this.io;this.subs=[p(e,"open",this.onopen.bind(this)),p(e,"packet",this.onpacket.bind(this)),p(e,"error",this.onerror.bind(this)),p(e,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...e){return e.unshift("message"),this.emit.apply(this,e),this}emit(e,...t){if(Ge.hasOwnProperty(e))throw new Error('"'+e.toString()+'" is a reserved event name');if(t.unshift(e),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(t),this;const s={type:c.EVENT,data:t};if(s.options={},s.options.compress=this.flags.compress!==!1,typeof t[t.length-1]=="function"){const o=this.ids++,a=t.pop();this._registerAckCallback(o,a),s.id=o}const n=this.io.engine&&this.io.engine.transport&&this.io.engine.transport.writable;return this.flags.volatile&&(!n||!this.connected)||(this.connected?(this.notifyOutgoingListeners(s),this.packet(s)):this.sendBuffer.push(s)),this.flags={},this}_registerAckCallback(e,t){var s;const n=(s=this.flags.timeout)!==null&&s!==void 0?s:this._opts.ackTimeout;if(n===void 0){this.acks[e]=t;return}const r=this.io.setTimeoutFn(()=>{delete this.acks[e];for(let o=0;o<this.sendBuffer.length;o++)this.sendBuffer[o].id===e&&this.sendBuffer.splice(o,1);t.call(this,new Error("operation has timed out"))},n);this.acks[e]=(...o)=>{this.io.clearTimeoutFn(r),t.apply(this,[null,...o])}}emitWithAck(e,...t){const s=this.flags.timeout!==void 0||this._opts.ackTimeout!==void 0;return new Promise((n,r)=>{t.push((o,a)=>s?o?r(o):n(a):n(o)),this.emit(e,...t)})}_addToQueue(e){let t;typeof e[e.length-1]=="function"&&(t=e.pop());const s={id:this._queueSeq++,tryCount:0,pending:!1,args:e,flags:Object.assign({fromQueue:!0},this.flags)};e.push((n,...r)=>s!==this._queue[0]?void 0:(n!==null?s.tryCount>this._opts.retries&&(this._queue.shift(),t&&t(n)):(this._queue.shift(),t&&t(null,...r)),s.pending=!1,this._drainQueue())),this._queue.push(s),this._drainQueue()}_drainQueue(e=!1){if(!this.connected||this._queue.length===0)return;const t=this._queue[0];t.pending&&!e||(t.pending=!0,t.tryCount++,this.flags=t.flags,this.emit.apply(this,t.args))}packet(e){e.nsp=this.nsp,this.io._packet(e)}onopen(){typeof this.auth=="function"?this.auth(e=>{this._sendConnectPacket(e)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(e){this.packet({type:c.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},e):e})}onerror(e){this.connected||this.emitReserved("connect_error",e)}onclose(e,t){this.connected=!1,delete this.id,this.emitReserved("disconnect",e,t)}onpacket(e){if(e.nsp===this.nsp)switch(e.type){case c.CONNECT:e.data&&e.data.sid?this.onconnect(e.data.sid,e.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case c.EVENT:case c.BINARY_EVENT:this.onevent(e);break;case c.ACK:case c.BINARY_ACK:this.onack(e);break;case c.DISCONNECT:this.ondisconnect();break;case c.CONNECT_ERROR:this.destroy();const s=new Error(e.data.message);s.data=e.data.data,this.emitReserved("connect_error",s);break}}onevent(e){const t=e.data||[];e.id!=null&&t.push(this.ack(e.id)),this.connected?this.emitEvent(t):this.receiveBuffer.push(Object.freeze(t))}emitEvent(e){if(this._anyListeners&&this._anyListeners.length){const t=this._anyListeners.slice();for(const s of t)s.apply(this,e)}super.emit.apply(this,e),this._pid&&e.length&&typeof e[e.length-1]=="string"&&(this._lastOffset=e[e.length-1])}ack(e){const t=this;let s=!1;return function(...n){s||(s=!0,t.packet({type:c.ACK,id:e,data:n}))}}onack(e){const t=this.acks[e.id];typeof t=="function"&&(t.apply(this,e.data),delete this.acks[e.id])}onconnect(e,t){this.id=e,this.recovered=t&&this._pid===t,this._pid=t,this.connected=!0,this.emitBuffered(),this.emitReserved("connect"),this._drainQueue(!0)}emitBuffered(){this.receiveBuffer.forEach(e=>this.emitEvent(e)),this.receiveBuffer=[],this.sendBuffer.forEach(e=>{this.notifyOutgoingListeners(e),this.packet(e)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(e=>e()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:c.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(e){return this.flags.compress=e,this}get volatile(){return this.flags.volatile=!0,this}timeout(e){return this.flags.timeout=e,this}onAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(e),this}prependAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(e),this}offAny(e){if(!this._anyListeners)return this;if(e){const t=this._anyListeners;for(let s=0;s<t.length;s++)if(e===t[s])return t.splice(s,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(e),this}prependAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(e),this}offAnyOutgoing(e){if(!this._anyOutgoingListeners)return this;if(e){const t=this._anyOutgoingListeners;for(let s=0;s<t.length;s++)if(e===t[s])return t.splice(s,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(e){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const t=this._anyOutgoingListeners.slice();for(const s of t)s.apply(this,e.data)}}}function _(i){i=i||{},this.ms=i.min||100,this.max=i.max||1e4,this.factor=i.factor||2,this.jitter=i.jitter>0&&i.jitter<=1?i.jitter:0,this.attempts=0}_.prototype.duration=function(){var i=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),t=Math.floor(e*this.jitter*i);i=Math.floor(e*10)&1?i+t:i-t}return Math.min(i,this.max)|0},_.prototype.reset=function(){this.attempts=0},_.prototype.setMin=function(i){this.ms=i},_.prototype.setMax=function(i){this.max=i},_.prototype.setJitter=function(i){this.jitter=i};class V extends h{constructor(e,t){var s;super(),this.nsps={},this.subs=[],e&&typeof e=="object"&&(t=e,e=void 0),t=t||{},t.path=t.path||"/socket.io",this.opts=t,C(this,t),this.reconnection(t.reconnection!==!1),this.reconnectionAttempts(t.reconnectionAttempts||1/0),this.reconnectionDelay(t.reconnectionDelay||1e3),this.reconnectionDelayMax(t.reconnectionDelayMax||5e3),this.randomizationFactor((s=t.randomizationFactor)!==null&&s!==void 0?s:.5),this.backoff=new _({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(t.timeout==null?2e4:t.timeout),this._readyState="closed",this.uri=e;const n=t.parser||je;this.encoder=new n.Encoder,this.decoder=new n.Decoder,this._autoConnect=t.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(e){return arguments.length?(this._reconnection=!!e,this):this._reconnection}reconnectionAttempts(e){return e===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=e,this)}reconnectionDelay(e){var t;return e===void 0?this._reconnectionDelay:(this._reconnectionDelay=e,(t=this.backoff)===null||t===void 0||t.setMin(e),this)}randomizationFactor(e){var t;return e===void 0?this._randomizationFactor:(this._randomizationFactor=e,(t=this.backoff)===null||t===void 0||t.setJitter(e),this)}reconnectionDelayMax(e){var t;return e===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=e,(t=this.backoff)===null||t===void 0||t.setMax(e),this)}timeout(e){return arguments.length?(this._timeout=e,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(e){if(~this._readyState.indexOf("open"))return this;this.engine=new he(this.uri,this.opts);const t=this.engine,s=this;this._readyState="opening",this.skipReconnect=!1;const n=p(t,"open",function(){s.onopen(),e&&e()}),r=p(t,"error",o=>{s.cleanup(),s._readyState="closed",this.emitReserved("error",o),e?e(o):s.maybeReconnectOnOpen()});if(this._timeout!==!1){const o=this._timeout;o===0&&n();const a=this.setTimeoutFn(()=>{n(),t.close(),t.emit("error",new Error("timeout"))},o);this.opts.autoUnref&&a.unref(),this.subs.push(function(){clearTimeout(a)})}return this.subs.push(n),this.subs.push(r),this}connect(e){return this.open(e)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const e=this.engine;this.subs.push(p(e,"ping",this.onping.bind(this)),p(e,"data",this.ondata.bind(this)),p(e,"error",this.onerror.bind(this)),p(e,"close",this.onclose.bind(this)),p(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(e){try{this.decoder.add(e)}catch(t){this.onclose("parse error",t)}}ondecoded(e){re(()=>{this.emitReserved("packet",e)},this.setTimeoutFn)}onerror(e){this.emitReserved("error",e)}socket(e,t){let s=this.nsps[e];return s?this._autoConnect&&!s.active&&s.connect():(s=new ue(this,e,t),this.nsps[e]=s),s}_destroy(e){const t=Object.keys(this.nsps);for(const s of t)if(this.nsps[s].active)return;this._close()}_packet(e){const t=this.encoder.encode(e);for(let s=0;s<t.length;s++)this.engine.write(t[s],e.options)}cleanup(){this.subs.forEach(e=>e()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close"),this.engine&&this.engine.close()}disconnect(){return this._close()}onclose(e,t){this.cleanup(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",e,t),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const e=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const t=this.backoff.duration();this._reconnecting=!0;const s=this.setTimeoutFn(()=>{e.skipReconnect||(this.emitReserved("reconnect_attempt",e.backoff.attempts),!e.skipReconnect&&e.open(n=>{n?(e._reconnecting=!1,e.reconnect(),this.emitReserved("reconnect_error",n)):e.onreconnect()}))},t);this.opts.autoUnref&&s.unref(),this.subs.push(function(){clearTimeout(s)})}}onreconnect(){const e=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",e)}}const E={};function x(i,e){typeof i=="object"&&(e=i,i=void 0),e=e||{};const t=Ue(i,e.path||"/socket.io"),s=t.source,n=t.id,r=t.path,o=E[n]&&r in E[n].nsps,a=e.forceNew||e["force new connection"]||e.multiplex===!1||o;let m;return a?m=new V(s,e):(E[n]||(E[n]=new V(s,e)),m=E[n]),t.query&&!e.query&&(e.query=t.queryKey),m.socket(t.path,e)}Object.assign(x,{Manager:V,Socket:ue,io:x,connect:x});class Ze{constructor(e,t){O(this,"_id");O(this,"_socket");O(this,"_opts");O(this,"_emitter",new le);this._id=e,this._opts=t,this._socket=this._createIO()}emitter(){return this._emitter}signal(e,t){this._socket.send("signal",{peerId:e,signal:t})}_createIO(){const e=x(this._opts.path,{query:{id:this._id,room:this._opts.room}});return console.log("create"),e.on("connect",()=>{console.log("connect sig"),this._emitter.emit("connected")}),e.on("disconnect",()=>{console.log("disc"),this._emitter.emit("disconnected")}),e.on("error",t=>{console.log("err",t),this._emitter.emit("error",t)}),e}}l.SignalingClient=Ze,Object.defineProperty(l,Symbol.toStringTag,{value:"Module"})});