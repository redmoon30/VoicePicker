(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();function A(i,e,t,n){return new(t||(t=Promise))(function(r,s){function o(c){try{l(n.next(c))}catch(d){s(d)}}function a(c){try{l(n.throw(c))}catch(d){s(d)}}function l(c){var d;c.done?r(c.value):(d=c.value,d instanceof t?d:new t(function(h){h(d)})).then(o,a)}l((n=n.apply(i,e||[])).next())})}let ve=class{constructor(){this.listeners={}}on(e,t,n){if(this.listeners[e]||(this.listeners[e]=new Set),n==null?void 0:n.once){const r=(...s)=>{this.un(e,r),t(...s)};return this.listeners[e].add(r),()=>this.un(e,r)}return this.listeners[e].add(t),()=>this.un(e,t)}un(e,t){var n;(n=this.listeners[e])===null||n===void 0||n.delete(t)}once(e,t){return this.on(e,t,{once:!0})}unAll(){this.listeners={}}emit(e,...t){this.listeners[e]&&this.listeners[e].forEach(n=>n(...t))}};const Ee={decode:function(i,e){return A(this,void 0,void 0,function*(){const t=new AudioContext({sampleRate:e});try{return yield t.decodeAudioData(i)}finally{t.close()}})},createBuffer:function(i,e){if(!i||i.length===0)throw new Error("channelData must be a non-empty array");if(e<=0)throw new Error("duration must be greater than 0");if(typeof i[0]=="number"&&(i=[i]),!i[0]||i[0].length===0)throw new Error("channelData must contain non-empty channel arrays");(function(n){const r=n[0];if(r.some(s=>s>1||s<-1)){const s=r.length;let o=0;for(let a=0;a<s;a++){const l=Math.abs(r[a]);l>o&&(o=l)}for(const a of n)for(let l=0;l<s;l++)a[l]/=o}})(i);const t=i.map(n=>n instanceof Float32Array?n:Float32Array.from(n));return{duration:e,length:t[0].length,sampleRate:t[0].length/e,numberOfChannels:t.length,getChannelData:n=>{const r=t[n];if(!r)throw new Error(`Channel ${n} not found`);return r},copyFromChannel:AudioBuffer.prototype.copyFromChannel,copyToChannel:AudioBuffer.prototype.copyToChannel}}};function zt(i,e){const t=e.xmlns?document.createElementNS(e.xmlns,i):document.createElement(i);for(const[n,r]of Object.entries(e))if(n==="children"&&r)for(const[s,o]of Object.entries(r))o instanceof Node?t.appendChild(o):typeof o=="string"?t.appendChild(document.createTextNode(o)):t.appendChild(zt(s,o));else n==="style"?Object.assign(t.style,r):n==="textContent"?t.textContent=r:t.setAttribute(n,r.toString());return t}function ct(i,e,t){const n=zt(i,e||{});return t==null||t.appendChild(n),n}function Bt(i){return i instanceof HTMLElement||typeof i=="object"&&i!==null&&i.nodeType===Node.ELEMENT_NODE&&typeof i.style=="object"}var mn=Object.freeze({__proto__:null,createElement:ct,default:ct,isHTMLElement:Bt});const fn={fetchBlob:function(i,e,t){return A(this,void 0,void 0,function*(){var n;const r=yield fetch(i,t);if(r.status>=400)throw new Error(`Failed to fetch ${i}: ${r.status} (${r.statusText})`);return function(s,o,a){A(this,void 0,void 0,function*(){var l;if(!s.body||!s.headers)return;const c=s.body.getReader(),d=Number(s.headers.get("Content-Length"))||0;let h=0;const u=()=>{c.cancel()};if(a){if(a.aborted)return void c.cancel();a.addEventListener("abort",u,{once:!0})}try{for(;;){const m=yield c.read();if(m.done)break;if(h+=((l=m.value)===null||l===void 0?void 0:l.length)||0,d>0){const p=Math.round(h/d*100);o(p)}}}catch(m){if(m instanceof DOMException&&m.name==="AbortError")return;console.warn("Progress tracking error:",m)}finally{a&&a.removeEventListener("abort",u)}})}(r.clone(),e,(n=t==null?void 0:t.signal)!==null&&n!==void 0?n:void 0),r.blob()})}};function R(i){let e=i;const t=new Set;return{get value(){return e},set(n){Object.is(e,n)||(e=n,t.forEach(r=>r(e)))},update(n){this.set(n(e))},subscribe:n=>(t.add(n),()=>t.delete(n))}}function ie(i,e){const t=R(i());return e.forEach(n=>n.subscribe(()=>{const r=i();Object.is(t.value,r)||t.set(r)})),{get value(){return t.value},subscribe:n=>t.subscribe(n)}}function q(i,e){let t;const n=()=>{t&&(t(),t=void 0),t=i()},r=e.map(s=>s.subscribe(n));return n(),()=>{t&&(t(),t=void 0),r.forEach(s=>s())}}class gn extends ve{get isPlayingSignal(){return this._isPlaying}get currentTimeSignal(){return this._currentTime}get durationSignal(){return this._duration}get volumeSignal(){return this._volume}get mutedSignal(){return this._muted}get playbackRateSignal(){return this._playbackRate}get seekingSignal(){return this._seeking}constructor(e){super(),this.isExternalMedia=!1,this._ownBlobUrl=null,this.reactiveMediaEventCleanups=[],e.media?(this.media=e.media,this.isExternalMedia=!0):this.media=document.createElement("audio"),this._isPlaying=R(!1),this._currentTime=R(0),this._duration=R(0),this._volume=R(this.media.volume),this._muted=R(this.media.muted),this._playbackRate=R(this.media.playbackRate||1),this._seeking=R(!1),this.setupReactiveMediaEvents(),e.mediaControls&&(this.media.controls=!0),e.autoplay&&(this.media.autoplay=!0),e.playbackRate!=null&&this.onMediaEvent("canplay",()=>{e.playbackRate!=null&&(this.media.playbackRate=e.playbackRate)},{once:!0})}setupReactiveMediaEvents(){this.reactiveMediaEventCleanups.push(this.onMediaEvent("play",()=>{this._isPlaying.set(!0)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("pause",()=>{this._isPlaying.set(!1)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("ended",()=>{this._isPlaying.set(!1)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("timeupdate",()=>{this._currentTime.set(this.media.currentTime)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("durationchange",()=>{this._duration.set(this.media.duration||0)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("loadedmetadata",()=>{this._duration.set(this.media.duration||0)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("seeking",()=>{this._seeking.set(!0)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("seeked",()=>{this._seeking.set(!1)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("volumechange",()=>{this._volume.set(this.media.volume),this._muted.set(this.media.muted)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("ratechange",()=>{this._playbackRate.set(this.media.playbackRate)}))}onMediaEvent(e,t,n){return this.media.addEventListener(e,t,n),()=>this.media.removeEventListener(e,t,n)}getSrc(){return this.media.currentSrc||this.media.src||""}revokeSrc(){this._ownBlobUrl&&(URL.revokeObjectURL(this._ownBlobUrl),this._ownBlobUrl=null)}canPlayType(e){return this.media.canPlayType(e)!==""}setSrc(e,t){const n=this.getSrc();if(e&&n===e)return;this.revokeSrc();const r=t instanceof Blob&&(this.canPlayType(t.type)||!e)?URL.createObjectURL(t):e;if(r!==e&&(this._ownBlobUrl=r),n&&this.media.removeAttribute("src"),r||e)try{this.media.src=r}catch{this.media.src=e}}destroy(){this.reactiveMediaEventCleanups.forEach(e=>e()),this.reactiveMediaEventCleanups=[],this.revokeSrc(),this.unAll(),this.isExternalMedia||(this.media.pause(),this.media.removeAttribute("src"),this.media.load(),this.media.remove())}setMediaElement(e){this.reactiveMediaEventCleanups.forEach(t=>t()),this.reactiveMediaEventCleanups=[],this.media=e,this.setupReactiveMediaEvents()}play(){return A(this,void 0,void 0,function*(){try{return yield this.media.play()}catch(e){if(e instanceof DOMException&&e.name==="AbortError")return;throw e}})}pause(){this.media.pause()}isPlaying(){return!this.media.paused&&!this.media.ended}setTime(e){this.media.currentTime=Math.max(0,Math.min(e,this.getDuration()))}getDuration(){return this.media.duration}getCurrentTime(){return this.media.currentTime}getVolume(){return this.media.volume}setVolume(e){this.media.volume=e}getMuted(){return this.media.muted}setMuted(e){this.media.muted=e}getPlaybackRate(){return this.media.playbackRate}isSeeking(){return this.media.seeking}setPlaybackRate(e,t){t!=null&&(this.media.preservesPitch=t),this.media.playbackRate=e}getMediaElement(){return this.media}setSinkId(e){return this.media.setSinkId(e)}}function vn({maxTop:i,maxBottom:e,halfHeight:t,vScale:n,barMinHeight:r=0,barAlign:s}){let o=Math.round(i*t*n),a=o+Math.round(e*t*n)||1;return a<r&&(a=r,s||(o=a/2)),{topHeight:o,totalHeight:a}}function bn({barAlign:i,halfHeight:e,topHeight:t,totalHeight:n,canvasHeight:r}){return i==="top"?0:i==="bottom"?r-n:e-t}function dt(i,e,t){const n=e-i.left,r=t-i.top;return[n/i.width,r/i.height]}function Wt(i){return!!(i.barWidth||i.barGap||i.barAlign)}function ht(i,e){if(!Wt(e))return i;const t=e.barWidth||.5,n=t+(e.barGap||t/2);return n===0?i:Math.floor(i/n)*n}function ut({scrollLeft:i,totalWidth:e,numCanvases:t}){if(e===0)return[0];const n=i/e,r=Math.floor(n*t);return[r-1,r,r+1]}function Ht(i){const e=i._cleanup;typeof e=="function"&&e()}function yn(i){const e=R({scrollLeft:i.scrollLeft,scrollWidth:i.scrollWidth,clientWidth:i.clientWidth}),t=ie(()=>function(s){const{scrollLeft:o,scrollWidth:a,clientWidth:l}=s;if(a===0)return{startX:0,endX:1};const c=o/a,d=(o+l)/a;return{startX:Math.max(0,Math.min(1,c)),endX:Math.max(0,Math.min(1,d))}}(e.value),[e]),n=ie(()=>function(s){return{left:s.scrollLeft,right:s.scrollLeft+s.clientWidth}}(e.value),[e]),r=()=>{e.set({scrollLeft:i.scrollLeft,scrollWidth:i.scrollWidth,clientWidth:i.clientWidth})};return i.addEventListener("scroll",r,{passive:!0}),{scrollData:e,percentages:t,bounds:n,cleanup:()=>{i.removeEventListener("scroll",r),Ht(e)}}}class En extends ve{constructor(e,t){super(),this.timeouts=[],this.isScrollable=!1,this.audioData=null,this.resizeObserver=null,this.lastContainerWidth=0,this.isDragging=!1,this.subscriptions=[],this.unsubscribeOnScroll=[],this.dragStream=null,this.scrollStream=null,this.containerInlinePadding=0,this.onClickWrapper=o=>{const a=this.wrapper.getBoundingClientRect(),[l,c]=dt(a,o.clientX,o.clientY);this.emit("click",l,c)},this.onDblClickWrapper=o=>{const a=this.wrapper.getBoundingClientRect(),[l,c]=dt(a,o.clientX,o.clientY);this.emit("dblclick",l,c)},this.subscriptions=[],this.options=e;const n=this.parentFromOptionsContainer(e.container);this.parent=n;const[r,s]=this.initHtml();n.appendChild(r),this.container=r,this.scrollContainer=s.querySelector(".scroll"),this.wrapper=s.querySelector(".wrapper"),this.canvasWrapper=s.querySelector(".canvases"),this.progressWrapper=s.querySelector(".progress"),this.cursor=s.querySelector(".cursor"),this.calculateInlinePadding(),t&&s.appendChild(t),this.initEvents()}parentFromOptionsContainer(e){let t;if(typeof e=="string"?t=document.querySelector(e):Bt(e)&&(t=e),!t)throw new Error("Container not found");return t}initEvents(){this.wrapper.addEventListener("click",this.onClickWrapper),this.wrapper.addEventListener("dblclick",this.onDblClickWrapper),this.options.dragToSeek!==!0&&typeof this.options.dragToSeek!="object"||this.initDrag(),this.scrollStream=yn(this.scrollContainer);const e=q(()=>{const{startX:t,endX:n}=this.scrollStream.percentages.value,{left:r,right:s}=this.scrollStream.bounds.value;this.emit("scroll",t,n,r,s)},[this.scrollStream.percentages,this.scrollStream.bounds]);if(this.subscriptions.push(e),typeof ResizeObserver=="function"){const t=this.createDelay(100);this.resizeObserver=new ResizeObserver(()=>{t().then(()=>this.onContainerResize()).catch(()=>{})}),this.resizeObserver.observe(this.scrollContainer)}}onContainerResize(){const e=this.parent.clientWidth;this.calculateInlinePadding(),e===this.lastContainerWidth&&this.options.height!=="auto"||(this.lastContainerWidth=e,this.reRender(),this.emit("resize"))}initDrag(){if(this.dragStream)return;this.dragStream=function(t,n={}){const{threshold:r=3,mouseButton:s=0,touchDelay:o=100}=n,a=R(null),l=new Map,c=matchMedia("(pointer: coarse)").matches;let d=()=>{};const h=u=>{if(u.button!==s||l.has(u.pointerId)||(l.set(u.pointerId,u),l.size>1))return;const m=u.pointerId;let p=u.clientX,g=u.clientY,f=!1;const v=Date.now(),w=t.getBoundingClientRect(),{left:M,top:L}=w,S=b=>{if(b.pointerId!==m||b.defaultPrevented||l.size>1||c&&Date.now()-v<o)return;const z=b.clientX,O=b.clientY,X=z-p,x=O-g;(f||Math.abs(X)>r||Math.abs(x)>r)&&(b.preventDefault(),b.stopPropagation(),f||(a.set({type:"start",x:p-M,y:g-L}),f=!0),a.set({type:"move",x:z-M,y:O-L,deltaX:X,deltaY:x}),p=z,g=O)},D=b=>{if(l.delete(b.pointerId)){if(b.pointerId===m&&f){const z=b.clientX,O=b.clientY;a.set({type:"end",x:z-M,y:O-L})}l.size===0&&d()}},P=b=>{b.relatedTarget&&b.relatedTarget!==document.documentElement||D(b)},E=b=>{f&&(b.stopPropagation(),b.preventDefault())},_=b=>{b.defaultPrevented||l.size>1||f&&b.preventDefault()};document.addEventListener("pointermove",S),document.addEventListener("pointerup",D),document.addEventListener("pointerout",P),document.addEventListener("pointercancel",P),document.addEventListener("touchmove",_,{passive:!1}),document.addEventListener("click",E,{capture:!0}),d=()=>{document.removeEventListener("pointermove",S),document.removeEventListener("pointerup",D),document.removeEventListener("pointerout",P),document.removeEventListener("pointercancel",P),document.removeEventListener("touchmove",_),setTimeout(()=>{document.removeEventListener("click",E,{capture:!0})},10)}};return t.addEventListener("pointerdown",h),{signal:a,cleanup:()=>{d(),t.removeEventListener("pointerdown",h),l.clear(),Ht(a)}}}(this.wrapper);const e=q(()=>{const t=this.dragStream.signal.value;if(!t)return;const n=this.wrapper.getBoundingClientRect().width,r=(s=t.x/n)<0?0:s>1?1:s;var s;t.type==="start"?(this.isDragging=!0,this.emit("dragstart",r)):t.type==="move"?this.emit("drag",r):t.type==="end"&&(this.isDragging=!1,this.emit("dragend",r))},[this.dragStream.signal]);this.subscriptions.push(e)}calculateInlinePadding(){const{paddingLeft:e,paddingRight:t}=getComputedStyle(this.scrollContainer),n=parseFloat(e)+parseFloat(t);this.containerInlinePadding=Number.isNaN(n)?0:n}initHtml(){const e=document.createElement("div"),t=e.attachShadow({mode:"open"}),n=this.options.cspNonce&&typeof this.options.cspNonce=="string"?this.options.cspNonce.replace(/"/g,""):"";return t.innerHTML=`
      <style${n?` nonce="${n}"`:""}>
        :host {
          user-select: none;
          min-width: 1px;
        }
        :host audio {
          display: block;
          width: 100%;
        }
        :host .scroll {
          overflow-x: auto;
          overflow-y: hidden;
          width: 100%;
          position: relative;
        }
        :host .noScrollbar {
          scrollbar-color: transparent;
          scrollbar-width: none;
        }
        :host .noScrollbar::-webkit-scrollbar {
          display: none;
          -webkit-appearance: none;
        }
        :host .wrapper {
          position: relative;
          overflow: visible;
          z-index: 2;
        }
        :host .canvases {
          min-height: ${this.getHeight(this.options.height,this.options.splitChannels)}px;
          pointer-events: none;
        }
        :host .canvases > div {
          position: relative;
        }
        :host canvas {
          display: block;
          position: absolute;
          top: 0;
          image-rendering: pixelated;
        }
        :host .progress {
          pointer-events: none;
          position: absolute;
          z-index: 2;
          top: 0;
          left: 0;
          width: 0;
          height: 100%;
          overflow: hidden;
        }
        :host .progress > div {
          position: relative;
        }
        :host .cursor {
          pointer-events: none;
          position: absolute;
          z-index: 5;
          top: 0;
          left: 0;
          height: 100%;
          border-radius: 2px;
        }
      </style>

      <div class="scroll" part="scroll">
        <div class="wrapper" part="wrapper">
          <div class="canvases" part="canvases"></div>
          <div class="progress" part="progress"></div>
          <div class="cursor" part="cursor"></div>
        </div>
      </div>
    `,[e,t]}setOptions(e){var t;if(this.options.container!==e.container){const n=this.parentFromOptionsContainer(e.container);n.appendChild(this.container),this.parent=n}e.dragToSeek===!0||typeof this.options.dragToSeek=="object"?this.initDrag():((t=this.dragStream)===null||t===void 0||t.cleanup(),this.dragStream=null),this.options=e,this.reRender()}getWrapper(){return this.wrapper}getWidth(){return this.scrollContainer.clientWidth-this.containerInlinePadding}getScroll(){return this.scrollContainer.scrollLeft}setScroll(e){this.scrollContainer.scrollLeft=e}setScrollPercentage(e){const{scrollWidth:t}=this.scrollContainer,n=t*e;this.setScroll(n)}destroy(){var e;this.wrapper.removeEventListener("click",this.onClickWrapper),this.wrapper.removeEventListener("dblclick",this.onDblClickWrapper),this.timeouts.forEach(t=>t()),this.timeouts=[],this.subscriptions.forEach(t=>t()),this.container.remove(),this.resizeObserver&&(this.resizeObserver.disconnect(),this.resizeObserver=null),(e=this.unsubscribeOnScroll)===null||e===void 0||e.forEach(t=>t()),this.unsubscribeOnScroll=[],this.dragStream&&(this.dragStream.cleanup(),this.dragStream=null),this.scrollStream&&(this.scrollStream.cleanup(),this.scrollStream=null)}createDelay(e=10){let t,n;const r=()=>{t&&(clearTimeout(t),t=void 0),n&&(n(),n=void 0)};return this.timeouts.push(r),()=>new Promise((s,o)=>{r(),n=o,t=setTimeout(()=>{t=void 0,n=void 0,s()},e)})}getHeight(e,t){var n;const r=((n=this.audioData)===null||n===void 0?void 0:n.numberOfChannels)||1;return function({optionsHeight:s,optionsSplitChannels:o,parentHeight:a,numberOfChannels:l,defaultHeight:c=128}){if(s==null)return c;const d=Number(s);if(!isNaN(d))return d;if(s==="auto"){const h=a||c;return o!=null&&o.every(u=>!u.overlay)?h/l:h}return c}({optionsHeight:e,optionsSplitChannels:t,parentHeight:this.parent.clientHeight,numberOfChannels:r,defaultHeight:128})}convertColorValues(e,t){return function(n,r,s){if(!Array.isArray(n))return n||"";if(n.length===0)return"#999";if(n.length<2)return n[0]||"";const o=document.createElement("canvas"),a=o.getContext("2d");if(!a)return n[0]||"";const l=s||o.height*r,c=a.createLinearGradient(0,0,0,l),d=1/(n.length-1);return n.forEach((h,u)=>{c.addColorStop(u*d,h)}),c}(e,this.getPixelRatio(),t==null?void 0:t.canvas.height)}getPixelRatio(){return e=window.devicePixelRatio,Math.max(1,e||1);var e}renderBarWaveform(e,t,n,r){const{width:s,height:o}=n.canvas,{halfHeight:a,barWidth:l,barRadius:c,barIndexScale:d,barSpacing:h,barMinHeight:u}=function({width:p,height:g,length:f,options:v,pixelRatio:w}){const M=g/2,L=v.barWidth?v.barWidth*w:1,S=v.barGap?v.barGap*w:v.barWidth?L/2:0,D=L+S||1;return{halfHeight:M,barWidth:L,barGap:S,barRadius:v.barRadius||0,barMinHeight:v.barMinHeight?v.barMinHeight*w:0,barIndexScale:f>0?p/D/f:0,barSpacing:D}}({width:s,height:o,length:(e[0]||[]).length,options:t,pixelRatio:this.getPixelRatio()}),m=function({channelData:p,barIndexScale:g,barSpacing:f,barWidth:v,halfHeight:w,vScale:M,canvasHeight:L,barAlign:S,barMinHeight:D}){const P=p[0]||[],E=p[1]||P,_=P.length,b=[];let z=0,O=0,X=0;for(let x=0;x<=_;x++){const Q=Math.round(x*g);if(Q>z){const{topHeight:un,totalHeight:lt}=vn({maxTop:O,maxBottom:X,halfHeight:w,vScale:M,barMinHeight:D,barAlign:S}),pn=bn({barAlign:S,halfHeight:w,topHeight:un,totalHeight:lt,canvasHeight:L});b.push({x:z*f,y:pn,width:v,height:lt}),z=Q,O=0,X=0}const ot=Math.abs(P[x]||0),at=Math.abs(E[x]||0);ot>O&&(O=ot),at>X&&(X=at)}return b}({channelData:e,barIndexScale:d,barSpacing:h,barWidth:l,halfHeight:a,vScale:r,canvasHeight:o,barAlign:t.barAlign,barMinHeight:u});n.beginPath();for(const p of m)c&&"roundRect"in n?n.roundRect(p.x,p.y,p.width,p.height,c):n.rect(p.x,p.y,p.width,p.height);n.fill(),n.closePath()}renderLineWaveform(e,t,n,r){const{width:s,height:o}=n.canvas,a=function({channelData:l,width:c,height:d,vScale:h}){const u=d/2,m=l[0]||[];return[m,l[1]||m].map((p,g)=>{const f=p.length,v=f?c/f:0,w=u,M=g===0?-1:1,L=[{x:0,y:w}];let S=0,D=0;for(let P=0;P<=f;P++){const E=Math.round(P*v);if(E>S){const b=w+(Math.round(D*u*h)||1)*M;L.push({x:S,y:b}),S=E,D=0}const _=Math.abs(p[P]||0);_>D&&(D=_)}return L.push({x:S,y:w}),L})}({channelData:e,width:s,height:o,vScale:r});n.beginPath();for(const l of a)if(l.length){n.moveTo(l[0].x,l[0].y);for(let c=1;c<l.length;c++){const d=l[c];n.lineTo(d.x,d.y)}}n.fill(),n.closePath()}renderWaveform(e,t,n){if(n.fillStyle=this.convertColorValues(t.waveColor,n),t.renderFunction)return void t.renderFunction(e,n);const r=function({channelData:s,barHeight:o,normalize:a,maxPeak:l}){var c;const d=o||1;if(!a)return d;const h=s[0];if(!h||h.length===0)return d;let u=l??0;if(!l)for(let m=0;m<h.length;m++){const p=(c=h[m])!==null&&c!==void 0?c:0,g=Math.abs(p);g>u&&(u=g)}return u?d/u:d}({channelData:e,barHeight:t.barHeight,normalize:t.normalize,maxPeak:t.maxPeak});Wt(t)?this.renderBarWaveform(e,t,n,r):this.renderLineWaveform(e,t,n,r)}renderSingleCanvas(e,t,n,r,s,o,a){const l=this.getPixelRatio(),c=document.createElement("canvas");c.width=Math.round(n*l),c.height=Math.round(r*l),c.style.width=`${n}px`,c.style.height=`${r}px`,c.style.left=`${Math.round(s)}px`,o.appendChild(c);const d=c.getContext("2d");if(t.renderFunction?(d.fillStyle=this.convertColorValues(t.waveColor,d),t.renderFunction(e,d)):this.renderWaveform(e,t,d),c.width>0&&c.height>0){const h=c.cloneNode(),u=h.getContext("2d");u.drawImage(c,0,0),u.globalCompositeOperation="source-in",u.fillStyle=this.convertColorValues(t.progressColor,u),u.fillRect(0,0,c.width,c.height),a.appendChild(h)}}renderMultiCanvas(e,t,n,r,s,o){const a=this.getPixelRatio(),{clientWidth:l}=this.scrollContainer,c=n/a,d=function({clientWidth:p,totalWidth:g,options:f}){return ht(Math.min(8e3,p,g),f)}({clientWidth:l,totalWidth:c,options:t});let h={};if(d===0)return;const u=p=>{if(p<0||p>=m||h[p])return;h[p]=!0;const g=p*d;let f=Math.min(c-g,d);if(f=ht(f,t),f<=0)return;const v=function({channelData:w,offset:M,clampedWidth:L,totalWidth:S}){return w.map(D=>{const P=Math.floor(M/S*D.length),E=Math.floor((M+L)/S*D.length);return D.slice(P,E)})}({channelData:e,offset:g,clampedWidth:f,totalWidth:c});this.renderSingleCanvas(v,t,f,r,g,s,o)},m=Math.ceil(c/d);if(!this.isScrollable){for(let p=0;p<m;p++)u(p);return}if(ut({scrollLeft:this.scrollContainer.scrollLeft,totalWidth:c,numCanvases:m}).forEach(p=>u(p)),m>1){const p=this.on("scroll",()=>{const{scrollLeft:g}=this.scrollContainer;Object.keys(h).length>10&&(s.innerHTML="",o.innerHTML="",h={}),ut({scrollLeft:g,totalWidth:c,numCanvases:m}).forEach(f=>u(f))});this.unsubscribeOnScroll.push(p)}}renderChannel(e,t,n,r){var{overlay:s}=t,o=function(d,h){var u={};for(var m in d)Object.prototype.hasOwnProperty.call(d,m)&&h.indexOf(m)<0&&(u[m]=d[m]);if(d!=null&&typeof Object.getOwnPropertySymbols=="function"){var p=0;for(m=Object.getOwnPropertySymbols(d);p<m.length;p++)h.indexOf(m[p])<0&&Object.prototype.propertyIsEnumerable.call(d,m[p])&&(u[m[p]]=d[m[p]])}return u}(t,["overlay"]);const a=document.createElement("div"),l=this.getHeight(o.height,o.splitChannels);a.style.height=`${l}px`,s&&r>0&&(a.style.marginTop=`-${l}px`),this.canvasWrapper.style.minHeight=`${l}px`,this.canvasWrapper.appendChild(a);const c=a.cloneNode();this.progressWrapper.appendChild(c),this.renderMultiCanvas(e,o,n,l,a,c)}render(e){return A(this,void 0,void 0,function*(){var t;this.timeouts.forEach(c=>c()),this.timeouts=[],this.unsubscribeOnScroll.forEach(c=>c()),this.unsubscribeOnScroll=[],this.canvasWrapper.innerHTML="",this.progressWrapper.innerHTML="",this.options.width!=null&&(this.scrollContainer.style.width=typeof this.options.width=="number"?`${this.options.width}px`:this.options.width);const n=this.getPixelRatio(),r=this.scrollContainer.clientWidth-this.containerInlinePadding,{scrollWidth:s,isScrollable:o,useParentWidth:a,width:l}=function({duration:c,minPxPerSec:d=0,parentWidth:h,fillParent:u,pixelRatio:m}){const p=Math.ceil(c*d),g=p>h,f=!!(u&&!g);return{scrollWidth:p,isScrollable:g,useParentWidth:f,width:(f?h:p)*m}}({duration:e.duration,minPxPerSec:this.options.minPxPerSec||0,parentWidth:r,fillParent:this.options.fillParent,pixelRatio:n});if(this.isScrollable=o,this.wrapper.style.width=a?"100%":`${s}px`,this.scrollContainer.style.overflowX=this.isScrollable?"auto":"hidden",this.scrollContainer.classList.toggle("noScrollbar",!!this.options.hideScrollbar),this.cursor.style.backgroundColor=`${this.options.cursorColor||this.options.progressColor}`,this.cursor.style.width=`${this.options.cursorWidth}px`,this.audioData=e,this.emit("render"),this.options.splitChannels)for(let c=0;c<e.numberOfChannels;c++){const d=Object.assign(Object.assign({},this.options),(t=this.options.splitChannels)===null||t===void 0?void 0:t[c]);this.renderChannel([e.getChannelData(c)],d,l,c)}else{const c=[e.getChannelData(0)];e.numberOfChannels>1&&c.push(e.getChannelData(1)),this.renderChannel(c,this.options,l,0)}Promise.resolve().then(()=>this.emit("rendered"))})}reRender(){if(this.unsubscribeOnScroll.forEach(n=>n()),this.unsubscribeOnScroll=[],!this.audioData)return;const{scrollWidth:e}=this.scrollContainer,{right:t}=this.progressWrapper.getBoundingClientRect();if(this.render(this.audioData),!this.isScrollable&&this.scrollContainer.scrollLeft)this.scrollContainer.scrollLeft=0;else if(this.isScrollable&&e!==this.scrollContainer.scrollWidth){const{right:n}=this.progressWrapper.getBoundingClientRect(),r=function(s){const o=2*s;return(o<0?Math.floor(o):Math.ceil(o))/2}(n-t);this.scrollContainer.scrollLeft+=r}}zoom(e){this.options.minPxPerSec=e,this.reRender()}scrollIntoView(e,t=!1){var n;const{scrollLeft:r,scrollWidth:s,clientWidth:o}=this.scrollContainer,a=e*s,l=r,c=r+o,d=o/2;if(this.isDragging)a+30>c?this.scrollContainer.scrollLeft+=30:a-30<l&&(this.scrollContainer.scrollLeft-=30);else{(a<l||a>c)&&(this.scrollContainer.scrollLeft=a-(this.options.autoCenter?d:0));const h=a-r-d;if(t&&this.options.autoCenter&&h>0){const u=(n=this.audioData)===null||n===void 0?void 0:n.duration;if(u===void 0||u<=0)return void(this.scrollContainer.scrollLeft+=h);const m=s/u;this.scrollContainer.scrollLeft+=m<=600?Math.min(h,10):h}}}renderProgress(e,t){if(isNaN(e))return;const n=100*e;this.canvasWrapper.style.clipPath=`polygon(${n}% 0%, 100% 0%, 100% 100%, ${n}% 100%)`,this.progressWrapper.style.width=`${n}%`,this.cursor.style.left=`${n}%`,this.cursor.style.transform=this.options.cursorWidth?`translateX(-${e*this.options.cursorWidth}px)`:"",this.isScrollable&&this.options.autoScroll&&this.audioData&&this.audioData.duration>0&&this.scrollIntoView(e,t)}exportImage(e,t,n){return A(this,void 0,void 0,function*(){const r=this.canvasWrapper.querySelectorAll("canvas");if(!r.length)throw new Error("No waveform data");if(n==="dataURL"){const s=Array.from(r).map(o=>o.toDataURL(e,t));return Promise.resolve(s)}return Promise.all(Array.from(r).map(s=>new Promise((o,a)=>{s.toBlob(l=>{l?o(l):a(new Error("Could not export image"))},e,t)})))})}}class xn extends ve{constructor(){super(...arguments),this.animationFrameId=null,this.isRunning=!1}start(){if(this.isRunning)return;this.isRunning=!0;const e=()=>{this.isRunning&&(this.emit("tick"),this.animationFrameId=requestAnimationFrame(e))};e()}stop(){this.isRunning=!1,this.animationFrameId!==null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null)}destroy(){this.stop(),this.unAll()}}class je extends ve{constructor(e){super(),this.bufferNode=null,this.playStartTime=0,this.playbackPosition=0,this._muted=!1,this._playbackRate=1,this._duration=void 0,this.buffer=null,this.currentSrc="",this.paused=!0,this.crossOrigin=null,this.seeking=!1,this.autoplay=!1,this.addEventListener=this.on,this.removeEventListener=this.un,this._destroyed=!1,function(){const t=globalThis.navigator;if(t!=null&&t.audioSession)try{t.audioSession.type="playback"}catch(n){console.warn("Setting navigator.audioSession.type failed:",n)}}(),this.audioContext=e||new AudioContext,this.gainNode=this.audioContext.createGain(),this.gainNode.connect(this.audioContext.destination)}load(){return A(this,void 0,void 0,function*(){})}remove(){this.destroy()}destroy(){if(!this._destroyed){if(this._destroyed=!0,this.currentSrc="",this.bufferNode){this.bufferNode.onended=null;try{this.bufferNode.stop()}catch{}this.bufferNode.disconnect(),this.bufferNode=null}this.gainNode.disconnect(),typeof this.audioContext.close=="function"&&Promise.resolve(this.audioContext.close.call(this.audioContext)).catch(()=>{}),this.buffer=null,this.unAll()}}get src(){return this.currentSrc}set src(e){if(this.currentSrc=e,this._duration=void 0,!e)return this.buffer=null,void this.emit("emptied");fetch(e).then(t=>{if(t.status>=400)throw new Error(`Failed to fetch ${e}: ${t.status} (${t.statusText})`);return t.arrayBuffer()}).then(t=>this.currentSrc!==e?null:this.audioContext.decodeAudioData(t)).then(t=>{this.currentSrc===e&&(this.buffer=t,this.emit("loadedmetadata"),this.emit("canplay"),this.autoplay&&this.play())}).catch(t=>{console.error("WebAudioPlayer load error:",t)})}_play(){if(!this.paused)return;this.paused=!1,this.bufferNode&&(this.bufferNode.onended=null,this.bufferNode.disconnect()),this.bufferNode=this.audioContext.createBufferSource(),this.buffer&&(this.bufferNode.buffer=this.buffer),this.bufferNode.playbackRate.value=this._playbackRate,this.bufferNode.connect(this.gainNode);let e=this.playbackPosition;(e>=this.duration||e<0)&&(e=0,this.playbackPosition=0),this.bufferNode.start(this.audioContext.currentTime,e),this.playStartTime=this.audioContext.currentTime,this.bufferNode.onended=()=>{!this.paused&&this.duration-this.currentTime<.01&&(this.pause(),this.emit("ended"))}}_pause(){if(this.paused=!0,this.bufferNode){this.bufferNode.onended=null;try{this.bufferNode.stop()}catch{}}this.playbackPosition+=(this.audioContext.currentTime-this.playStartTime)*this._playbackRate}play(){return A(this,void 0,void 0,function*(){this.paused&&(this._play(),this.emit("play"))})}pause(){this.paused||(this._pause(),this.emit("pause"))}stopAt(e){const t=(e-this.currentTime)/this._playbackRate,n=this.bufferNode;n==null||n.stop(this.audioContext.currentTime+t),n==null||n.addEventListener("ended",()=>{n===this.bufferNode&&(this.bufferNode=null,this.pause(),this.playbackPosition=Math.min(e,this.duration),this.emit("timeupdate"))},{once:!0})}setSinkId(e){return A(this,void 0,void 0,function*(){return this.audioContext.setSinkId(e)})}get playbackRate(){return this._playbackRate}set playbackRate(e){const t=!this.paused;t&&this._pause(),this._playbackRate=e,t&&this._play(),this.bufferNode&&(this.bufferNode.playbackRate.value=e)}get currentTime(){return this.paused?this.playbackPosition:this.playbackPosition+(this.audioContext.currentTime-this.playStartTime)*this._playbackRate}set currentTime(e){const t=!this.paused;t&&this._pause(),this.playbackPosition=e,t&&this._play(),this.emit("seeking"),this.emit("timeupdate")}get duration(){var e,t;return(e=this._duration)!==null&&e!==void 0?e:((t=this.buffer)===null||t===void 0?void 0:t.duration)||0}set duration(e){this._duration=e}get volume(){return this.gainNode.gain.value}set volume(e){this.gainNode.gain.value=e,this.emit("volumechange")}get muted(){return this._muted}set muted(e){this._muted!==e&&(this._muted=e,this._muted?this.gainNode.disconnect():this.gainNode.connect(this.audioContext.destination))}canPlayType(e){return/^(audio|video)\//.test(e)}getGainNode(){return this.gainNode}getChannelData(){const e=[];if(!this.buffer)return e;const t=this.buffer.numberOfChannels;for(let n=0;n<t;n++)e.push(this.buffer.getChannelData(n));return e}removeAttribute(e){switch(e){case"src":this.src="";break;case"playbackRate":this.playbackRate=0;break;case"currentTime":this.currentTime=0;break;case"duration":this.duration=0;break;case"volume":this.volume=0;break;case"muted":this.muted=!1}}}const Cn={waveColor:"#999",progressColor:"#555",cursorWidth:1,minPxPerSec:0,fillParent:!0,interact:!0,dragToSeek:!1,autoScroll:!0,autoCenter:!0,sampleRate:8e3};class ge extends gn{static create(e){return new ge(e)}getState(){return this.wavesurferState}getRenderer(){return this.renderer}constructor(e){const t=e.media||(e.backend==="WebAudio"?new je:void 0);super({media:t,mediaControls:e.mediaControls,autoplay:e.autoplay,playbackRate:e.audioRate}),this.plugins=[],this.decodedData=null,this.stopAtPosition=null,this.subscriptions=[],this.mediaSubscriptions=[],this.abortController=null,this._isDestroyed=!1,this._loadVersion=0,this.reactiveCleanups=[],this.options=Object.assign({},Cn,e);const{state:n,actions:r}=function(a){var l,c,d,h,u,m;const p=(l=a==null?void 0:a.currentTime)!==null&&l!==void 0?l:R(0),g=(c=a==null?void 0:a.duration)!==null&&c!==void 0?c:R(0),f=(d=a==null?void 0:a.isPlaying)!==null&&d!==void 0?d:R(!1),v=(h=a==null?void 0:a.isSeeking)!==null&&h!==void 0?h:R(!1),w=(u=a==null?void 0:a.volume)!==null&&u!==void 0?u:R(1),M=(m=a==null?void 0:a.playbackRate)!==null&&m!==void 0?m:R(1),L=R(null),S=R(null),D=R(""),P=R(0),E=R(0),_=ie(()=>!f.value,[f]),b=ie(()=>L.value!==null,[L]),z=ie(()=>b.value&&g.value>0,[b,g]),O=ie(()=>p.value,[p]),X=ie(()=>g.value>0?p.value/g.value:0,[p,g]);return{state:{currentTime:p,duration:g,isPlaying:f,isPaused:_,isSeeking:v,volume:w,playbackRate:M,audioBuffer:L,peaks:S,url:D,zoom:P,scrollPosition:E,canPlay:b,isReady:z,progress:O,progressPercent:X},actions:{setCurrentTime:x=>{const Q=Math.max(0,Math.min(g.value||1/0,x));p.set(Q)},setDuration:x=>{g.set(Math.max(0,x))},setPlaying:x=>{f.set(x)},setSeeking:x=>{v.set(x)},setVolume:x=>{const Q=Math.max(0,Math.min(1,x));w.set(Q)},setPlaybackRate:x=>{const Q=Math.max(.1,Math.min(16,x));M.set(Q)},setAudioBuffer:x=>{L.set(x),x&&g.set(x.duration)},setPeaks:x=>{S.set(x)},setUrl:x=>{D.set(x)},setZoom:x=>{P.set(Math.max(0,x))},setScrollPosition:x=>{E.set(Math.max(0,x))}}}}({isPlaying:this.isPlayingSignal,currentTime:this.currentTimeSignal,duration:this.durationSignal,volume:this.volumeSignal,playbackRate:this.playbackRateSignal,isSeeking:this.seekingSignal});this.wavesurferState=n,this.wavesurferActions=r,this.timer=new xn;const s=t?void 0:this.getMediaElement();this.renderer=new En(this.options,s),this.initPlayerEvents(),this.initRendererEvents(),this.initTimerEvents(),this.initReactiveState(),this.initPlugins();const o=this.options.url||this.getSrc()||"";Promise.resolve().then(()=>{this.emit("init");const{peaks:a,duration:l}=this.options;(o||a&&l)&&this.load(o,a,l).catch(()=>{})})}updateProgress(e=this.getCurrentTime()){return this.renderer.renderProgress(e/this.getDuration(),this.isPlaying()),e}initTimerEvents(){this.subscriptions.push(this.timer.on("tick",()=>{if(!this.isSeeking()){const e=this.updateProgress();if(this.emit("timeupdate",e),this.emit("audioprocess",e),this.stopAtPosition!=null&&this.isPlaying()&&e>=this.stopAtPosition){const t=this.stopAtPosition;this.pause(),this.setTime(t)}}}))}initReactiveState(){this.reactiveCleanups.push(function(e,t){const n=[];n.push(q(()=>{const o=e.isPlaying.value;t.emit(o?"play":"pause")},[e.isPlaying])),n.push(q(()=>{const o=e.currentTime.value;t.emit("timeupdate",o),e.isPlaying.value&&t.emit("audioprocess",o)},[e.currentTime,e.isPlaying])),n.push(q(()=>{e.isSeeking.value&&t.emit("seeking",e.currentTime.value)},[e.isSeeking,e.currentTime]));let r=!1;n.push(q(()=>{e.isReady.value&&!r&&(r=!0,t.emit("ready",e.duration.value))},[e.isReady,e.duration])),n.push(q(()=>{e.audioBuffer.value===null&&(r=!1)},[e.audioBuffer]));let s=!1;return n.push(q(()=>{const o=e.isPlaying.value,a=e.currentTime.value,l=e.duration.value,c=l>0&&a>=l;s&&!o&&c&&t.emit("finish"),s=o&&c},[e.isPlaying,e.currentTime,e.duration])),n.push(q(()=>{const o=e.zoom.value;o>0&&t.emit("zoom",o)},[e.zoom])),()=>{n.forEach(o=>o())}}(this.wavesurferState,{emit:this.emit.bind(this)}))}initPlayerEvents(){this.isPlaying()&&(this.emit("play"),this.timer.start()),this.mediaSubscriptions.push(this.onMediaEvent("timeupdate",()=>{const e=this.updateProgress();this.emit("timeupdate",e)}),this.onMediaEvent("play",()=>{this.emit("play"),this.timer.start()}),this.onMediaEvent("pause",()=>{this.emit("pause"),this.timer.stop(),this.stopAtPosition=null}),this.onMediaEvent("emptied",()=>{this.timer.stop(),this.stopAtPosition=null}),this.onMediaEvent("ended",()=>{this.emit("timeupdate",this.getDuration()),this.emit("finish"),this.stopAtPosition=null}),this.onMediaEvent("seeking",()=>{this.emit("seeking",this.getCurrentTime())}),this.onMediaEvent("error",()=>{var e;this.emit("error",(e=this.getMediaElement().error)!==null&&e!==void 0?e:new Error("Media error")),this.stopAtPosition=null}))}initRendererEvents(){this.subscriptions.push(this.renderer.on("click",(e,t)=>{this.options.interact&&(this.seekTo(e),this.emit("interaction",e*this.getDuration()),this.emit("click",e,t))}),this.renderer.on("dblclick",(e,t)=>{this.emit("dblclick",e,t)}),this.renderer.on("scroll",(e,t,n,r)=>{const s=this.getDuration();this.emit("scroll",e*s,t*s,n,r)}),this.renderer.on("render",()=>{this.emit("redraw")}),this.renderer.on("rendered",()=>{this.emit("redrawcomplete")}),this.renderer.on("dragstart",e=>{this.emit("dragstart",e)}),this.renderer.on("dragend",e=>{this.emit("dragend",e)}),this.renderer.on("resize",()=>{this.emit("resize")}));{let e;const t=this.renderer.on("drag",n=>{var r;if(!this.options.interact)return;this.renderer.renderProgress(n),clearTimeout(e);let s=0;const o=this.options.dragToSeek;this.isPlaying()?s=0:o===!0?s=200:o&&typeof o=="object"&&(s=(r=o.debounceTime)!==null&&r!==void 0?r:200),e=setTimeout(()=>{this.seekTo(n)},s),this.emit("interaction",n*this.getDuration()),this.emit("drag",n)});this.subscriptions.push(()=>{clearTimeout(e),t()})}}initPlugins(){var e;!((e=this.options.plugins)===null||e===void 0)&&e.length&&this.options.plugins.forEach(t=>{this.registerPlugin(t)})}unsubscribePlayerEvents(){this.mediaSubscriptions.forEach(e=>e()),this.mediaSubscriptions=[]}setOptions(e){this.options=Object.assign({},this.options,e),e.duration&&!e.peaks&&(this.decodedData=Ee.createBuffer(this.exportPeaks(),e.duration)),e.peaks&&e.duration&&(this.decodedData=Ee.createBuffer(e.peaks,e.duration)),this.renderer.setOptions(this.options),e.audioRate&&this.setPlaybackRate(e.audioRate),e.mediaControls!=null&&(this.getMediaElement().controls=e.mediaControls)}registerPlugin(e){if(this.plugins.includes(e))return e;e._init(this),this.plugins.push(e);const t=e.once("destroy",()=>{this.plugins=this.plugins.filter(n=>n!==e),this.subscriptions=this.subscriptions.filter(n=>n!==t)});return this.subscriptions.push(t),e}unregisterPlugin(e){this.plugins=this.plugins.filter(t=>t!==e),e.destroy()}getWrapper(){return this.renderer.getWrapper()}getWidth(){return this.renderer.getWidth()}getScroll(){return this.renderer.getScroll()}setScroll(e){return this.renderer.setScroll(e)}setScrollTime(e){const t=e/this.getDuration();this.renderer.setScrollPercentage(t)}getActivePlugins(){return this.plugins}loadAudio(e,t,n,r){return A(this,void 0,void 0,function*(){var s;const o=++this._loadVersion;if(this._isDestroyed=!1,this.emit("load",e),!this.options.media&&this.isPlaying()&&this.pause(),this.decodedData=null,this.stopAtPosition=null,(s=this.abortController)===null||s===void 0||s.abort(),this.abortController=null,!t&&!n){const l=this.options.fetchParams||{};window.AbortController&&!l.signal&&(this.abortController=new AbortController,l.signal=this.abortController.signal);const c=h=>this.emit("loading",h);if(t=yield fn.fetchBlob(e,c,l),this._isDestroyed||o!==this._loadVersion)return;const d=this.options.blobMimeType;d&&(t=new Blob([t],{type:d}))}if(this._isDestroyed||o!==this._loadVersion)return;this.setSrc(e,t);const a=yield new Promise(l=>{const c=r||this.getDuration();c?l(c):this.mediaSubscriptions.push(this.onMediaEvent("loadedmetadata",()=>l(this.getDuration()),{once:!0}))});if(!this._isDestroyed&&o===this._loadVersion){if(!e&&!t){const l=this.getMediaElement();l instanceof je&&(l.duration=a)}if(n)this.decodedData=Ee.createBuffer(n,a||0);else if(t){const l=yield t.arrayBuffer();if(this._isDestroyed||o!==this._loadVersion)return;this.decodedData=yield Ee.decode(l,this.options.sampleRate)}this._isDestroyed||o!==this._loadVersion||(this.decodedData&&(this.emit("decode",this.getDuration()),this.renderer.render(this.decodedData)),this.emit("ready",this.getDuration()))}})}load(e,t,n){return A(this,void 0,void 0,function*(){try{return yield this.loadAudio(e,void 0,t,n)}catch(r){throw this.emit("error",r),r}})}loadBlob(e,t,n){return A(this,void 0,void 0,function*(){try{return yield this.loadAudio("",e,t,n)}catch(r){throw this.emit("error",r),r}})}zoom(e){if(!this.decodedData)throw new Error("No audio loaded");this.renderer.zoom(e),this.emit("zoom",e)}getDecodedData(){return this.decodedData}exportPeaks({channels:e=2,maxLength:t=8e3,precision:n=1e4}={}){if(!this.decodedData)throw new Error("The audio has not been decoded yet");const r=Math.min(e,this.decodedData.numberOfChannels),s=[];for(let o=0;o<r;o++){const a=this.decodedData.getChannelData(o),l=[],c=a.length/t;for(let d=0;d<t;d++){const h=a.slice(Math.floor(d*c),Math.ceil((d+1)*c));let u=0;for(let m=0;m<h.length;m++){const p=h[m];Math.abs(p)>Math.abs(u)&&(u=p)}l.push(Math.round(u*n)/n)}s.push(l)}return s}getDuration(){let e=super.getDuration()||0;return e!==0&&e!==1/0||!this.decodedData||(e=this.decodedData.duration),e}toggleInteraction(e){this.options.interact=e}setTime(e){this.stopAtPosition=null,super.setTime(e),this.updateProgress(e),this.emit("timeupdate",e)}seekTo(e){const t=this.getDuration()*e;this.setTime(t)}play(e,t){const n=Object.create(null,{play:{get:()=>super.play}});return A(this,void 0,void 0,function*(){e!=null&&this.setTime(e);const r=yield n.play.call(this);return t!=null&&(this.media instanceof je?this.media.stopAt(t):this.stopAtPosition=t),r})}playPause(){return A(this,void 0,void 0,function*(){return this.isPlaying()?this.pause():this.play()})}stop(){this.pause(),this.setTime(0)}skip(e){this.setTime(this.getCurrentTime()+e)}empty(){this.load("",[[0]],.001)}setMediaElement(e){this.unsubscribePlayerEvents(),super.setMediaElement(e),this.initPlayerEvents()}exportImage(){return A(this,arguments,void 0,function*(e="image/png",t=1,n="dataURL"){return this.renderer.exportImage(e,t,n)})}destroy(){var e;this._isDestroyed=!0,this.emit("destroy"),(e=this.abortController)===null||e===void 0||e.abort(),this.plugins.forEach(t=>t.destroy()),this.subscriptions.forEach(t=>t()),this.unsubscribePlayerEvents(),this.reactiveCleanups.forEach(t=>t()),this.reactiveCleanups=[],this.timer.destroy(),this.renderer.destroy(),super.destroy()}}ge.BasePlugin=class extends ve{constructor(i){super(),this.subscriptions=[],this.isDestroyed=!1,this.options=i}onInit(){}_init(i){this.isDestroyed&&(this.subscriptions=[],this.isDestroyed=!1),this.wavesurfer=i,this.onInit()}destroy(){this.emit("destroy"),this.subscriptions.forEach(i=>i()),this.subscriptions=[],this.isDestroyed=!0,this.wavesurfer=void 0}},ge.dom=mn;class $t{constructor(){this.listeners={}}on(e,t,n){if(this.listeners[e]||(this.listeners[e]=new Set),n==null?void 0:n.once){const r=(...s)=>{this.un(e,r),t(...s)};return this.listeners[e].add(r),()=>this.un(e,r)}return this.listeners[e].add(t),()=>this.un(e,t)}un(e,t){var n;(n=this.listeners[e])===null||n===void 0||n.delete(t)}once(e,t){return this.on(e,t,{once:!0})}unAll(){this.listeners={}}emit(e,...t){this.listeners[e]&&this.listeners[e].forEach(n=>n(...t))}}class wn extends $t{constructor(e){super(),this.subscriptions=[],this.isDestroyed=!1,this.options=e}onInit(){}_init(e){this.isDestroyed&&(this.subscriptions=[],this.isDestroyed=!1),this.wavesurfer=e,this.onInit()}destroy(){this.emit("destroy"),this.subscriptions.forEach(e=>e()),this.subscriptions=[],this.isDestroyed=!0,this.wavesurfer=void 0}}function Ft(i,e){const t=e.xmlns?document.createElementNS(e.xmlns,i):document.createElement(i);for(const[n,r]of Object.entries(e))if(n==="children"&&r)for(const[s,o]of Object.entries(r))o instanceof Node?t.appendChild(o):typeof o=="string"?t.appendChild(document.createTextNode(o)):t.appendChild(Ft(s,o));else n==="style"?Object.assign(t.style,r):n==="textContent"?t.textContent=r:t.setAttribute(n,r.toString());return t}function me(i,e,t){const n=Ft(i,e||{});return t==null||t.appendChild(n),n}function jt(i){let e=i;const t=new Set;return{get value(){return e},set(n){Object.is(e,n)||(e=n,t.forEach(r=>r(e)))},update(n){this.set(n(e))},subscribe:n=>(t.add(n),()=>t.delete(n))}}function ke(i,e){let t;const n=()=>{t&&(t(),t=void 0),t=i()},r=e.map(s=>s.subscribe(n));return n(),()=>{t&&(t(),t=void 0),r.forEach(s=>s())}}function le(i,e){const t=jt(null),n=r=>{t.set(r)};return i.addEventListener(e,n),t._cleanup=()=>{i.removeEventListener(e,n)},t}function ne(i){const e=i._cleanup;typeof e=="function"&&e()}function Le(i,e={}){const{threshold:t=3,mouseButton:n=0,touchDelay:r=100}=e,s=jt(null),o=new Map,a=matchMedia("(pointer: coarse)").matches;let l=()=>{};const c=d=>{if(d.button!==n||o.has(d.pointerId)||(o.set(d.pointerId,d),o.size>1))return;const h=d.pointerId;let u=d.clientX,m=d.clientY,p=!1;const g=Date.now(),f=i.getBoundingClientRect(),{left:v,top:w}=f,M=E=>{if(E.pointerId!==h||E.defaultPrevented||o.size>1||a&&Date.now()-g<r)return;const _=E.clientX,b=E.clientY,z=_-u,O=b-m;(p||Math.abs(z)>t||Math.abs(O)>t)&&(E.preventDefault(),E.stopPropagation(),p||(s.set({type:"start",x:u-v,y:m-w}),p=!0),s.set({type:"move",x:_-v,y:b-w,deltaX:z,deltaY:O}),u=_,m=b)},L=E=>{if(o.delete(E.pointerId)){if(E.pointerId===h&&p){const _=E.clientX,b=E.clientY;s.set({type:"end",x:_-v,y:b-w})}o.size===0&&l()}},S=E=>{E.relatedTarget&&E.relatedTarget!==document.documentElement||L(E)},D=E=>{p&&(E.stopPropagation(),E.preventDefault())},P=E=>{E.defaultPrevented||o.size>1||p&&E.preventDefault()};document.addEventListener("pointermove",M),document.addEventListener("pointerup",L),document.addEventListener("pointerout",S),document.addEventListener("pointercancel",S),document.addEventListener("touchmove",P,{passive:!1}),document.addEventListener("click",D,{capture:!0}),l=()=>{document.removeEventListener("pointermove",M),document.removeEventListener("pointerup",L),document.removeEventListener("pointerout",S),document.removeEventListener("pointercancel",S),document.removeEventListener("touchmove",P),setTimeout(()=>{document.removeEventListener("click",D,{capture:!0})},10)}};return i.addEventListener("pointerdown",c),{signal:s,cleanup:()=>{l(),i.removeEventListener("pointerdown",c),o.clear(),ne(s)}}}class pt extends $t{constructor(e,t,n=0){var r,s,o,a,l,c,d,h,u,m;super(),this.totalDuration=t,this.numberOfChannels=n,this.element=null,this.minLength=0,this.maxLength=1/0,this.contentEditable=!1,this.subscriptions=[],this.updatingSide=void 0,this.isRemoved=!1,this.subscriptions=[],this.id=e.id||`region-${Math.random().toString(32).slice(2)}`,this.start=this.clampPosition(e.start),this.end=this.clampPosition((r=e.end)!==null&&r!==void 0?r:e.start),this.drag=(s=e.drag)===null||s===void 0||s,this.resize=(o=e.resize)===null||o===void 0||o,this.resizeStart=(a=e.resizeStart)===null||a===void 0||a,this.resizeEnd=(l=e.resizeEnd)===null||l===void 0||l,this.color=(c=e.color)!==null&&c!==void 0?c:"rgba(0, 0, 0, 0.1)",this.minLength=(d=e.minLength)!==null&&d!==void 0?d:this.minLength,this.maxLength=(h=e.maxLength)!==null&&h!==void 0?h:this.maxLength,this.channelIdx=(u=e.channelIdx)!==null&&u!==void 0?u:-1,this.contentEditable=(m=e.contentEditable)!==null&&m!==void 0?m:this.contentEditable,this.element=this.initElement(),this.setContent(e.content),this.setPart(),this.renderPosition(),this.initMouseEvents()}clampPosition(e){return Math.max(0,Math.min(this.totalDuration,e))}setPart(){var e;const t=this.start===this.end;(e=this.element)===null||e===void 0||e.setAttribute("part",`${t?"marker":"region"} ${this.id}`)}addResizeHandles(e){const t={position:"absolute",zIndex:"2",width:"6px",height:"100%",top:"0",cursor:"ew-resize",wordBreak:"keep-all"},n=me("div",{part:"region-handle region-handle-left",style:Object.assign(Object.assign({},t),{left:"0",borderLeft:"2px solid rgba(0, 0, 0, 0.5)",borderRadius:"2px 0 0 2px"})},e),r=me("div",{part:"region-handle region-handle-right",style:Object.assign(Object.assign({},t),{right:"0",borderRight:"2px solid rgba(0, 0, 0, 0.5)",borderRadius:"0 2px 2px 0"})},e),s=Le(n,{threshold:1}),o=Le(r,{threshold:1}),a=ke(()=>{const c=s.signal.value;c&&(c.type==="move"&&c.deltaX!==void 0?this.onResize(c.deltaX,"start"):c.type==="end"&&this.onEndResizing("start"))},[s.signal]),l=ke(()=>{const c=o.signal.value;c&&(c.type==="move"&&c.deltaX!==void 0?this.onResize(c.deltaX,"end"):c.type==="end"&&this.onEndResizing("end"))},[o.signal]);this.subscriptions.push(()=>{a(),l(),s.cleanup(),o.cleanup()})}removeResizeHandles(e){const t=e.querySelector('[part*="region-handle-left"]'),n=e.querySelector('[part*="region-handle-right"]');t&&e.removeChild(t),n&&e.removeChild(n)}initElement(){if(this.isRemoved)return null;const e=this.start===this.end;let t=0,n=100;this.channelIdx>=0&&this.numberOfChannels>0&&this.channelIdx<this.numberOfChannels&&(n=100/this.numberOfChannels,t=n*this.channelIdx);const r=me("div",{style:{position:"absolute",top:`${t}%`,height:`${n}%`,backgroundColor:e?"none":this.color,borderLeft:e?"2px solid "+this.color:"none",borderRadius:"2px",boxSizing:"border-box",transition:"background-color 0.2s ease",cursor:this.drag?"grab":"default",pointerEvents:"all"}});return!e&&this.resize&&this.addResizeHandles(r),r}renderPosition(){if(!this.element)return;const e=this.start/this.totalDuration,t=(this.totalDuration-this.end)/this.totalDuration;this.element.style.left=100*e+"%",this.element.style.right=100*t+"%"}toggleCursor(e){var t;this.drag&&(!((t=this.element)===null||t===void 0)&&t.style)&&(this.element.style.cursor=e?"grabbing":"grab")}initMouseEvents(){const{element:e}=this;if(!e)return;const t=le(e,"click"),n=le(e,"mouseenter"),r=le(e,"mouseleave"),s=le(e,"dblclick"),o=le(e,"pointerdown"),a=le(e,"pointerup"),l=t.subscribe(f=>f&&this.emit("click",f)),c=n.subscribe(f=>f&&this.emit("over",f)),d=r.subscribe(f=>f&&this.emit("leave",f)),h=s.subscribe(f=>f&&this.emit("dblclick",f)),u=o.subscribe(f=>f&&this.toggleCursor(!0)),m=a.subscribe(f=>f&&this.toggleCursor(!1));this.subscriptions.push(()=>{l(),c(),d(),h(),u(),m(),ne(t),ne(n),ne(r),ne(s),ne(o),ne(a)});const p=Le(e),g=ke(()=>{const f=p.signal.value;f&&(f.type==="start"?this.toggleCursor(!0):f.type==="move"&&f.deltaX!==void 0?this.onMove(f.deltaX):f.type==="end"&&(this.toggleCursor(!1),this.drag&&this.emit("update-end")))},[p.signal]);this.subscriptions.push(()=>{g(),p.cleanup()}),this.contentEditable&&this.content&&(this.contentClickListener=f=>this.onContentClick(f),this.contentBlurListener=()=>this.onContentBlur(),this.content.addEventListener("click",this.contentClickListener),this.content.addEventListener("blur",this.contentBlurListener))}_onUpdate(e,t,n){var r;if(!(!((r=this.element)===null||r===void 0)&&r.parentElement))return;const{width:s}=this.element.parentElement.getBoundingClientRect(),o=e/s*this.totalDuration;let a=t&&t!=="start"?this.start:this.start+o,l=t&&t!=="end"?this.end:this.end+o;const c=n!==void 0;c&&this.updatingSide&&this.updatingSide!==t&&(this.updatingSide==="start"?a=n:l=n),a=Math.max(0,a),l=Math.min(this.totalDuration,l);const d=l-a;this.updatingSide=t;const h=d>=this.minLength&&d<=this.maxLength;a<=l&&(h||c)&&(this.start=a,this.end=l,this.renderPosition(),this.emit("update",t))}onMove(e){this.drag&&this._onUpdate(e)}onResize(e,t){this.resize&&(this.resizeStart||t!=="start")&&(this.resizeEnd||t!=="end")&&this._onUpdate(e,t)}onEndResizing(e){this.resize&&(this.emit("update-end",e),this.updatingSide=void 0)}onContentClick(e){e.stopPropagation(),e.target.focus(),this.emit("click",e)}onContentBlur(){this.emit("update-end")}_setTotalDuration(e){this.totalDuration=e,this.renderPosition()}play(e){this.emit("play",e&&this.end!==this.start?this.end:void 0)}getContent(e=!1){var t;return e?this.content||void 0:this.element instanceof HTMLElement?((t=this.content)===null||t===void 0?void 0:t.innerHTML)||void 0:""}setContent(e){var t;if(this.element)if(this.content&&this.contentEditable&&(this.contentClickListener&&this.content.removeEventListener("click",this.contentClickListener),this.contentBlurListener&&this.content.removeEventListener("blur",this.contentBlurListener)),(t=this.content)===null||t===void 0||t.remove(),e){if(typeof e=="string"){const n=this.start===this.end;this.content=me("div",{style:{padding:`0.2em ${n?.2:.4}em`,display:"inline-block"},textContent:e})}else this.content=e;this.contentEditable&&(this.content.contentEditable="true",this.contentClickListener=n=>this.onContentClick(n),this.contentBlurListener=()=>this.onContentBlur(),this.content.addEventListener("click",this.contentClickListener),this.content.addEventListener("blur",this.contentBlurListener)),this.content.setAttribute("part","region-content"),this.element.appendChild(this.content),this.emit("content-changed")}else this.content=void 0}setOptions(e){var t,n;if(this.element){if(e.color&&(this.color=e.color,this.element.style.backgroundColor=this.color),e.drag!==void 0&&(this.drag=e.drag,this.element.style.cursor=this.drag?"grab":"default"),e.start!==void 0||e.end!==void 0){const r=this.start===this.end;this.start=this.clampPosition((t=e.start)!==null&&t!==void 0?t:this.start),this.end=this.clampPosition((n=e.end)!==null&&n!==void 0?n:r?this.start:this.end),this.renderPosition(),this.setPart(),this.emit("render")}if(e.content&&this.setContent(e.content),e.id&&(this.id=e.id,this.setPart()),e.resize!==void 0&&e.resize!==this.resize){const r=this.start===this.end;this.resize=e.resize,this.resize&&!r?this.addResizeHandles(this.element):this.removeResizeHandles(this.element)}e.resizeStart!==void 0&&(this.resizeStart=e.resizeStart),e.resizeEnd!==void 0&&(this.resizeEnd=e.resizeEnd)}}remove(){this.isRemoved=!0,this.emit("remove"),this.subscriptions.forEach(e=>e()),this.subscriptions=[],this.content&&this.contentEditable&&(this.contentClickListener&&(this.content.removeEventListener("click",this.contentClickListener),this.contentClickListener=void 0),this.contentBlurListener&&(this.content.removeEventListener("blur",this.contentBlurListener),this.contentBlurListener=void 0)),this.element&&(this.element.remove(),this.element=null),this.unAll()}}class Ke extends wn{constructor(e){super(e),this.regions=[],this.regionsContainer=this.initRegionsContainer()}static create(e){return new Ke(e)}onInit(){if(!this.wavesurfer)throw Error("WaveSurfer is not initialized");this.wavesurfer.getWrapper().appendChild(this.regionsContainer),this.subscriptions.push(this.wavesurfer.on("ready",t=>{this.regions.forEach(n=>n._setTotalDuration(t))}));let e=[];this.subscriptions.push(this.wavesurfer.on("timeupdate",t=>{const n=this.regions.filter(r=>r.start<=t&&(r.end===r.start?r.start+.05:r.end)>=t);n.forEach(r=>{e.includes(r)||this.emit("region-in",r)}),e.forEach(r=>{n.includes(r)||this.emit("region-out",r)}),e=n}))}initRegionsContainer(){return me("div",{part:"regions-container",style:{position:"absolute",top:"0",left:"0",width:"100%",height:"100%",zIndex:"5",pointerEvents:"none"}})}getRegions(){return this.regions}avoidOverlapping(e){e.content&&!e.isRemoved&&setTimeout(()=>{if(!e.content)return;const t=e.content;t.style.marginTop="0";const n=t.getBoundingClientRect(),r=this.regions.indexOf(e);if(r<0)return;const s=this.regions.slice(0,r).filter(o=>!o.isRemoved).reduce((o,a)=>{if(a===e||!a.content)return o;const l=a.content.getBoundingClientRect();return n.left<l.right&&l.left<n.right&&o.push(l),o},[]).sort((o,a)=>o.top-a.top).reduce((o,a)=>{const l=n.top+o,c=l+n.height;return l<a.bottom&&a.top<c?a.bottom-n.top+2:o},0);t.style.marginTop=`${s}px`},10)}avoidOverlappingAll(){this.regions.forEach(e=>this.avoidOverlapping(e))}adjustScroll(e){var t,n;if(!e.element)return;const r=(n=(t=this.wavesurfer)===null||t===void 0?void 0:t.getWrapper())===null||n===void 0?void 0:n.parentElement;if(!r)return;const{clientWidth:s,scrollWidth:o}=r;if(o<=s)return;const a=r.getBoundingClientRect(),l=e.element.getBoundingClientRect(),c=l.left-a.left,d=l.right-a.left;c<0?r.scrollLeft+=c:d>s&&(r.scrollLeft+=d-s)}virtualAppend(e,t,n){const r=()=>{if(!this.wavesurfer)return;const s=this.wavesurfer.getWidth(),o=this.wavesurfer.getScroll(),a=t.clientWidth,l=this.wavesurfer.getDuration(),c=Math.round(e.start/l*a),d=c+(Math.round((e.end-e.start)/l*a)||1)>o&&c<o+s;d&&!n.parentElement?t.appendChild(n):!d&&n.parentElement&&n.remove()};setTimeout(()=>{if(!this.wavesurfer||!e.element)return;r();const s=this.wavesurfer.on("scroll",r),o=this.wavesurfer.on("zoom",r),a=this.wavesurfer.on("resize",r),l=e.on("render",r);this.subscriptions.push(s,o,a,l),e.once("remove",()=>{s(),o(),a(),l()})},0)}saveRegion(e){if(!e.element)return;this.virtualAppend(e,this.regionsContainer,e.element),this.avoidOverlapping(e),this.regions.push(e);const t=[e.on("update",n=>{n||this.adjustScroll(e),this.emit("region-update",e,n)}),e.on("update-end",n=>{this.avoidOverlappingAll(),this.emit("region-updated",e,n)}),e.on("play",n=>{var r;(r=this.wavesurfer)===null||r===void 0||r.play(e.start,n)}),e.on("click",n=>{this.emit("region-clicked",e,n)}),e.on("dblclick",n=>{this.emit("region-double-clicked",e,n)}),e.on("content-changed",()=>{this.emit("region-content-changed",e)}),e.once("remove",()=>{t.forEach(n=>n()),this.regions=this.regions.filter(n=>n!==e),this.emit("region-removed",e)})];this.subscriptions.push(...t),this.emit("region-created",e)}addRegion(e){var t,n;if(!this.wavesurfer)throw Error("WaveSurfer is not initialized");const r=this.wavesurfer.getDuration(),s=(n=(t=this.wavesurfer)===null||t===void 0?void 0:t.getDecodedData())===null||n===void 0?void 0:n.numberOfChannels,o=new pt(e,r,s);return this.emit("region-initialized",o),r?this.saveRegion(o):this.subscriptions.push(this.wavesurfer.once("ready",a=>{o._setTotalDuration(a),this.saveRegion(o)})),o}enableDragSelection(e,t=3){var n;const r=(n=this.wavesurfer)===null||n===void 0?void 0:n.getWrapper();if(!(r&&r instanceof HTMLElement))return()=>{};let s=null,o=0,a=0;const l=Le(r,{threshold:t}),c=ke(()=>{var d,h;const u=l.signal.value;if(u)if(u.type==="start"){if(o=u.x,!this.wavesurfer)return;const m=this.wavesurfer.getDuration(),p=(h=(d=this.wavesurfer)===null||d===void 0?void 0:d.getDecodedData())===null||h===void 0?void 0:h.numberOfChannels,{width:g}=this.wavesurfer.getWrapper().getBoundingClientRect();a=o/g*m;const f=u.x/g*m,v=(u.x+5)/g*m;s=new pt(Object.assign(Object.assign({},e),{start:f,end:v}),m,p),this.emit("region-initialized",s),s.element&&this.regionsContainer.appendChild(s.element)}else u.type==="move"&&u.deltaX!==void 0?s&&s._onUpdate(u.deltaX,u.x>o?"end":"start",a):u.type==="end"&&s&&(this.saveRegion(s),s.updatingSide=void 0,s=null)},[l.signal]);return()=>{c(),l.cleanup()}}clearRegions(){this.regions.slice().forEach(e=>e.remove()),this.regions=[]}destroy(){this.clearRegions(),super.destroy(),this.regionsContainer.remove()}}const Ut={lead:"主角",supporting:"配角",mascot:"吉祥物"},J={lead:"#3b82f6",supporting:"#64748b",mascot:"#ec4899"},mt=[{name:"迪迪",role:"lead"},{name:"克克",role:"lead"},{name:"林林",role:"lead"},{name:"泰泰",role:"lead"},{name:"怪氣流",role:"mascot"},{name:"田鼠先生",role:"mascot"},{name:"田鼠太太",role:"mascot"},{name:"吵鬧菇",role:"mascot"},{name:"穿山甲大叔",role:"supporting"},{name:"花福導遊",role:"supporting"},{name:"達東爸",role:"supporting"},{name:"達東媽",role:"supporting"},{name:"村長",role:"supporting"},{name:"卡爾博士",role:"supporting"},{name:"小達東",role:"supporting"},{name:"阿桂",role:"supporting"}];function Vt(i,e){if(!i)return null;const t=e.find(n=>n.name===i);return t?J[t.role]:null}const Xt="voicepicker.author",qt="voicepicker.comments",Kt="voicepicker.characters";function kn(){return localStorage.getItem(Xt)??""}function Ln(i){localStorage.setItem(Xt,i)}function Sn(i){const e=i??{};return{id:typeof e.id=="string"?e.id:Math.random().toString(36).slice(2),author:typeof e.author=="string"?e.author:"",text:typeof e.text=="string"?e.text:"",created:typeof e.created=="number"?e.created:Date.now()}}function ze(i){const e=i??{},t=e.character;let n;Array.isArray(t)?n=t.filter(s=>typeof s=="string"):typeof t=="string"?n=[t]:n=[];const r=Array.isArray(e.replies)?e.replies.map(Sn):[];return{id:typeof e.id=="string"?e.id:Math.random().toString(36).slice(2),file:typeof e.file=="string"?e.file:"",time:typeof e.time=="number"?e.time:null,text:typeof e.text=="string"?e.text:"",author:typeof e.author=="string"?e.author:"",character:n,replies:r,rating:typeof e.rating=="number"?Math.min(5,Math.max(0,Math.round(e.rating))):0}}function Dn(){try{const i=localStorage.getItem(qt);return i?JSON.parse(i).map(ze):[]}catch{return[]}}function Ge(i){localStorage.setItem(qt,JSON.stringify(i))}function Pn(){try{const i=localStorage.getItem(Kt);return i?JSON.parse(i):[...mt]}catch{return[...mt]}}function Te(i){localStorage.setItem(Kt,JSON.stringify(i))}const Rn=`<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>VoicePicker 試聽版</title>
<style>
:root {
  --bg: #1e2430; --panel: #262e3d; --line: #38445a;
  --text: #e6ebf2; --muted: #8a97ad; --accent: #3b82f6; --time: #60a5fa;
  font-family: system-ui,"Microsoft JhengHei",sans-serif;
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--text); }
.hidden { display: none !important; }

/* ── 選資料夾畫面 ── */
#pick-screen {
  min-height: 100vh;
  display: flex; align-items: center; justify-content: center;
}
.pick-box {
  background: var(--panel); border: 1px solid var(--line);
  border-radius: 12px; padding: 40px 48px;
  display: flex; flex-direction: column; align-items: center; gap: 16px;
  max-width: 420px; text-align: center;
}
.pick-logo { font-size: 20px; font-weight: 700; }
.badge-ro {
  font-size: 11px; font-weight: 500; padding: 2px 8px;
  background: #374151; border-radius: 999px; color: var(--muted);
  vertical-align: middle; margin-left: 4px;
}
.pick-desc { font-size: 14px; color: var(--muted); line-height: 1.6; margin: 0; }
#pickBtn {
  padding: 11px 28px; background: var(--accent); color: #fff;
  border: none; border-radius: 8px; font-size: 15px; font-weight: 600;
  cursor: pointer; margin-top: 6px;
}
#pickBtn:hover { filter: brightness(1.1); }
.pick-sub { font-size: 12px; color: var(--muted); margin: 0; }
#pick-err { font-size: 13px; color: #f87171; min-height: 18px; }

/* ── 頂部播放列 ── */
#player-bar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  background: var(--panel); border-bottom: 1px solid var(--line);
  height: 52px; padding: 0 18px;
  display: flex; align-items: center; gap: 12px;
}
#bar-logo { font-size: 13px; font-weight: 700; white-space: nowrap; }
#bar-file {
  font-size: 12px; color: var(--muted); white-space: nowrap;
  overflow: hidden; text-overflow: ellipsis; max-width: 220px;
}
#bar-seek { flex: 1; accent-color: var(--accent); cursor: pointer; min-width: 60px; }
#bar-time { font-size: 12px; color: var(--muted); white-space: nowrap; font-variant-numeric: tabular-nums; min-width: 88px; }
#bar-vol { width: 72px; accent-color: var(--accent); }
#bar-err { font-size: 11px; color: #f87171; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 240px; }

/* ── 主內容 ── */
#main { padding: 68px 24px 40px; max-width: 1100px; margin: 0 auto; }
.view-title { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
.view-title h2 { margin: 0; font-size: 18px; }

/* 角色快捷列 */
.role-stats-wrap { display: flex; flex-direction: column; gap: 7px; margin-bottom: 20px; }
.role-stats-row { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; }
.role-stats-type { font-size: 11px; color: var(--muted); white-space: nowrap; flex-shrink: 0; }
.role-stat {
  font-size: 12px; padding: 3px 10px; border-radius: 999px;
  color: #fff; border: none; cursor: pointer;
}
.role-stat:hover { filter: brightness(1.15); }
.role-stat.zero { opacity: 0.35; }

/* 角色群組 */
.role-group { display: flex; margin-bottom: 14px; border-radius: 8px; overflow: hidden; border: 1px solid var(--line); }
.role-group-label {
  width: 68px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 600; color: #fff;
  padding: 12px 6px; word-break: break-all; text-align: center; line-height: 1.4;
}
.role-group-cards-wrap { flex: 1; min-width: 0; padding: 8px; display: flex; flex-direction: column; gap: 6px; }

/* 留言卡 */
.citem { border: 1px solid var(--line); border-radius: 6px; padding: 8px 10px; }
.citem.playing { border-color: var(--accent); }
.card-inner { display: flex; align-items: center; gap: 10px; }
.card-main { flex: 1; min-width: 0; }
.crow { display: flex; align-items: center; gap: 8px; }
.ctime { color: var(--time); font-variant-numeric: tabular-nums; font-size: 13px; white-space: nowrap; }
.cfile { font-size: 11px; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 200px; }
.cauthor { color: var(--muted); font-size: 11px; margin-left: auto; white-space: nowrap; }
.c-rating { display: flex; margin-top: 4px; }
.c-star { color: var(--line); font-size: 14px; padding: 0 1px; }
.c-star.filled { color: #f59e0b; }
.ctext { font-size: 13px; margin-top: 5px; white-space: pre-wrap; line-height: 1.5; }
.ctag-row { margin-top: 6px; display: flex; flex-wrap: wrap; gap: 5px; }
.ctag { display: inline-block; font-size: 11px; padding: 2px 9px; border-radius: 999px; color: #fff; }

/* 播放鈕 */
.cplay {
  flex-shrink: 0; width: 46px; height: 46px;
  border-radius: 50%; border: 2px solid var(--accent);
  color: var(--accent); background: transparent; font-size: 17px;
  cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0;
}
.cplay:hover { background: var(--accent); color: #fff; filter: none; }
.cplay.active { background: var(--accent); color: #fff; }

/* 回覆討論串（唯讀） */
.creplies {
  border-top: 1px solid var(--line);
  margin-top: 8px; padding-top: 6px;
  display: flex; flex-direction: column; gap: 3px;
}
.creply { display: flex; align-items: flex-start; gap: 5px; font-size: 12px; padding: 2px 0; }
.crauthor { color: var(--accent); font-weight: 500; white-space: nowrap; flex-shrink: 0; }
</style>
</head>
<body>

<!-- 選資料夾畫面 -->
<div id="pick-screen">
  <div class="pick-box">
    <div class="pick-logo">VoicePicker <span class="badge-ro">試聽版</span></div>
    <p class="pick-desc">選擇 NAS 上對應的音檔資料夾，即可在角色 Dashboard 中試聽所有評語。<br>此版本僅供試聽，無法修改留言。</p>
    <button id="pickBtn">選擇音檔資料夾</button>
    <p class="pick-sub">需要 Chrome 或 Edge · 選擇後不會上傳任何檔案</p>
    <div id="pick-err"></div>
  </div>
</div>

<!-- 主介面（選資料夾後顯示）-->
<div id="player-bar" class="hidden">
  <span id="bar-logo">VoicePicker <span class="badge-ro">試聽版</span></span>
  <span id="bar-file">—</span>
  <input id="bar-seek" type="range" min="0" max="100" step="0.1" value="0">
  <span id="bar-time">0:00 / 0:00</span>
  <input id="bar-vol" type="range" min="0" max="1" step="0.01" value="0.8" title="音量">
  <span id="bar-err"></span>
</div>
<div id="main" class="hidden">
  <div class="view-title">
    <h2>角色 Dashboard</h2>
  </div>
  <div id="roleview"></div>
</div>

<audio id="audio" preload="none"></audio>

<script>
const RAW = {{DATA_JSON}};
const { comments, characters, roleColors } = RAW;

// ── DOM ──
const pickScreen  = document.getElementById('pick-screen');
const pickBtn     = document.getElementById('pickBtn');
const pickErrEl   = document.getElementById('pick-err');
const playerBar   = document.getElementById('player-bar');
const mainEl      = document.getElementById('main');
const audio       = document.getElementById('audio');
const barFile     = document.getElementById('bar-file');
const barSeek     = document.getElementById('bar-seek');
const barTime     = document.getElementById('bar-time');
const barVol      = document.getElementById('bar-vol');
const barErrEl    = document.getElementById('bar-err');
const roleviewEl  = document.getElementById('roleview');

const AUDIO_EXT = new Set(['wav','mp3','m4a','aac','ogg','flac','wma','opus']);
let fileHandles = new Map(); // filename → FileSystemFileHandle
let blobUrls    = new Map(); // filename → blob URL (快取)
let loadedFile  = null;
let activeCard  = null;
let activeId    = null;

audio.volume = 0.8;

// ── 選資料夾 ──
pickBtn.addEventListener('click', async () => {
  const picker = window.showDirectoryPicker;
  if (!picker) {
    pickErrEl.textContent = '此瀏覽器不支援資料夾選取，請改用 Chrome 或 Edge。';
    return;
  }
  try {
    const dir = await window.showDirectoryPicker({ mode: 'read' });
    for await (const [name, handle] of dir.entries()) {
      if (handle.kind !== 'file') continue;
      const ext = name.split('.').pop().toLowerCase();
      if (AUDIO_EXT.has(ext)) fileHandles.set(name, handle);
    }
    pickScreen.classList.add('hidden');
    playerBar.classList.remove('hidden');
    mainEl.classList.remove('hidden');
    renderRoleView();
  } catch (e) {
    if (e && e.name !== 'AbortError')
      pickErrEl.textContent = '無法開啟資料夾：' + (e.message || e);
  }
});

// ── 音檔 URL（透過 File System Access API 建 blob URL）──
async function getAudioUrl(filename) {
  if (blobUrls.has(filename)) return blobUrls.get(filename);
  const handle = fileHandles.get(filename);
  if (!handle) return null;
  const file = await handle.getFile();
  const url  = URL.createObjectURL(file);
  blobUrls.set(filename, url);
  return url;
}

// ── 播放器事件 ──
audio.addEventListener('timeupdate', () => {
  if (!isFinite(audio.duration) || audio.duration === 0) return;
  barSeek.value = (audio.currentTime / audio.duration) * 100;
  barTime.textContent = ft(audio.currentTime) + ' / ' + ft(audio.duration);
});
audio.addEventListener('loadedmetadata', () => {
  barTime.textContent = '0:00 / ' + ft(audio.duration);
  barSeek.value = 0;
});
audio.addEventListener('ended', deactivate);
audio.addEventListener('error', () => {
  barErrEl.textContent = '⚠ 無法載入 ' + (loadedFile || '音檔');
  deactivate();
});

barSeek.addEventListener('input', () => {
  if (isFinite(audio.duration) && audio.duration > 0)
    audio.currentTime = (parseFloat(barSeek.value) / 100) * audio.duration;
});
barVol.addEventListener('input', () => { audio.volume = parseFloat(barVol.value); });

function ft(s) {
  if (!isFinite(s) || s < 0) return '0:00';
  return Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
}

function deactivate() {
  if (!activeCard) return;
  const btn = activeCard.querySelector('.cplay');
  if (btn) { btn.textContent = '▶'; btn.classList.remove('active'); }
  activeCard.classList.remove('playing');
  activeCard = null;
  activeId   = null;
}

async function togglePlay(c, card) {
  // 同一張卡正在播 → 暫停
  if (activeId === c.id && !audio.paused) {
    audio.pause();
    card.querySelector('.cplay').textContent = '▶';
    card.querySelector('.cplay').classList.remove('active');
    return;
  }
  if (activeCard && activeCard !== card) deactivate();
  barErrEl.textContent = '';

  if (!fileHandles.has(c.file)) {
    barErrEl.textContent = '⚠ 找不到音檔：' + c.file + '（資料夾是否選對？）';
    return;
  }

  if (loadedFile !== c.file) {
    const url = await getAudioUrl(c.file);
    if (!url) { barErrEl.textContent = '⚠ 無法讀取：' + c.file; return; }
    audio.src = url;
    loadedFile = c.file;
    barFile.textContent = c.file;
    await new Promise((res, rej) => {
      audio.addEventListener('loadedmetadata', res, { once: true });
      audio.addEventListener('error', rej, { once: true });
      audio.load();
    }).catch(() => null);
    if (audio.error) return;
  }

  audio.currentTime = (c.time !== null && c.time !== undefined) ? c.time : 0;
  activeCard = card;
  activeId   = c.id;
  card.querySelector('.cplay').textContent = '⏸';
  card.querySelector('.cplay').classList.add('active');
  card.classList.add('playing');
  await audio.play().catch(() => {});
}

// ── 角色顏色 ──
function colorByName(name) {
  const ch = characters.find(c => c.name === name);
  return (ch && roleColors[ch.role]) ? roleColors[ch.role] : '#3b82f6';
}

// ── 排序 ──
function sortByRating(list) {
  return [...list].sort((a, b) =>
    ((b.rating || 0) - (a.rating || 0)) ||
    String(a.file).localeCompare(String(b.file), 'zh-Hant', { numeric: true }) ||
    ((a.time ?? -Infinity) - (b.time ?? -Infinity)));
}

// ── 建留言卡（唯讀）──
function buildCard(c) {
  const card  = document.createElement('div');
  card.className = 'citem';
  const inner = document.createElement('div');
  inner.className = 'card-inner';
  const main  = document.createElement('div');
  main.className = 'card-main';

  const row   = document.createElement('div');
  row.className = 'crow';
  const timeEl = document.createElement('span');
  timeEl.className = 'ctime';
  timeEl.textContent = (c.time !== null && c.time !== undefined) ? ft(c.time) : '整體';
  const fileEl = document.createElement('span');
  fileEl.className = 'cfile';
  fileEl.title = c.file;
  fileEl.textContent = c.file;
  const authEl = document.createElement('span');
  authEl.className = 'cauthor';
  authEl.textContent = c.author;
  row.append(timeEl, fileEl, authEl);
  main.appendChild(row);

  if (c.rating > 0) {
    const rEl = document.createElement('div');
    rEl.className = 'c-rating';
    for (let i = 1; i <= 5; i++) {
      const s = document.createElement('span');
      s.className = 'c-star' + (i <= c.rating ? ' filled' : '');
      s.textContent = '★';
      rEl.appendChild(s);
    }
    main.appendChild(rEl);
  }

  const textEl = document.createElement('div');
  textEl.className = 'ctext';
  textEl.textContent = c.text;
  main.appendChild(textEl);

  if (c.character && c.character.length > 0) {
    const tagRow = document.createElement('div');
    tagRow.className = 'ctag-row';
    c.character.forEach(nm => {
      const tag = document.createElement('span');
      tag.className = 'ctag';
      tag.style.background = colorByName(nm);
      tag.textContent = nm;
      tagRow.appendChild(tag);
    });
    main.appendChild(tagRow);
  }

  if (c.replies && c.replies.length > 0) {
    const rep = document.createElement('div');
    rep.className = 'creplies';
    c.replies.forEach(r => {
      const rr = document.createElement('div');
      rr.className = 'creply';
      const ra = document.createElement('span');
      ra.className = 'crauthor';
      ra.textContent = r.author + '：';
      const rt = document.createElement('span');
      rt.textContent = r.text;
      rr.append(ra, rt);
      rep.appendChild(rr);
    });
    main.appendChild(rep);
  }

  const play = document.createElement('button');
  play.className = 'cplay';
  play.textContent = '▶';
  play.addEventListener('click', e => { e.stopPropagation(); togglePlay(c, card).catch(() => {}); });

  inner.append(main, play);
  card.appendChild(inner);
  return card;
}

// ── 角色 Dashboard 渲染 ──
function renderRoleView() {
  roleviewEl.innerHTML = '';
  const ROLE_LABELS = { lead: '主角', supporting: '配角', mascot: '吉祥物' };
  const ROLE_ORDER  = ['lead', 'mascot', 'supporting'];
  const noneList    = comments.filter(c => !c.character || c.character.length === 0);

  const statsWrap = document.createElement('div');
  statsWrap.className = 'role-stats-wrap';
  let supportingRow = null;

  ROLE_ORDER.forEach(role => {
    const charsOfRole = characters.filter(ch => ch.role === role);
    if (!charsOfRole.length) return;
    const rowEl = document.createElement('div');
    rowEl.className = 'role-stats-row';
    if (role === 'supporting') supportingRow = rowEl;

    const typeLabel = document.createElement('span');
    typeLabel.className = 'role-stats-type';
    typeLabel.textContent = ROLE_LABELS[role] || role;
    typeLabel.style.color = roleColors[role] || '#8a97ad';
    rowEl.appendChild(typeLabel);

    charsOfRole.forEach(ch => {
      const n = comments.filter(c => c.character && c.character.includes(ch.name)).length;
      const s = document.createElement('button');
      s.className = 'role-stat' + (n === 0 ? ' zero' : '');
      s.style.background = roleColors[ch.role] || '#64748b';
      s.textContent = ch.name + ' ' + n;
      s.addEventListener('click', () => {
        roleviewEl.querySelector('[data-char="' + ch.name + '"]')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      rowEl.appendChild(s);
    });
    statsWrap.appendChild(rowEl);
  });

  if (noneList.length > 0) {
    const s = document.createElement('button');
    s.className = 'role-stat';
    s.style.background = '#64748b';
    s.textContent = '未指定 ' + noneList.length;
    s.addEventListener('click', () => {
      roleviewEl.querySelector('[data-char="__none__"]')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    if (supportingRow) supportingRow.appendChild(s);
    else {
      const r = document.createElement('div');
      r.className = 'role-stats-row';
      r.appendChild(s);
      statsWrap.appendChild(r);
    }
  }
  roleviewEl.appendChild(statsWrap);

  const renderGroup = (charName, color, list) => {
    if (!list.length) return;
    const group = document.createElement('div');
    group.className = 'role-group';
    group.dataset.char = charName;
    const lbl = document.createElement('div');
    lbl.className = 'role-group-label';
    lbl.style.background = color;
    lbl.textContent = charName === '__none__' ? '未指定' : charName;
    group.appendChild(lbl);
    const wrap = document.createElement('div');
    wrap.className = 'role-group-cards-wrap';
    sortByRating(list).forEach(c => wrap.appendChild(buildCard(c)));
    group.appendChild(wrap);
    roleviewEl.appendChild(group);
  };

  characters.forEach(ch =>
    renderGroup(ch.name, roleColors[ch.role] || '#64748b',
      comments.filter(c => c.character && c.character.includes(ch.name))));
  if (noneList.length) renderGroup('__none__', '#64748b', noneList);
}
<\/script>
</body>
</html>
`,Mn=new Set(["wav","mp3","m4a","aac","ogg","flac","wma","opus"]),ft=4,Tn=1.5,Nn=.25,Je="voicepicker.json";let N=[],U=-1,xe=null,H="single",j=0,V=null,gt,Se,Ne=null,ee=kn(),k=Dn(),T=Pn(),Ye=0,se=!0,oe=[],I="text",he=null,G=null,_e=null,B=[],W=0,be=null,De="rating",re=0;const y=i=>document.getElementById(i),vt=y("pick"),bt=y("exportBtn"),yt=y("importBtn"),Pe=y("importFile"),Et=y("editChars"),xt=y("roleViewBtn"),Ct=y("filelist"),Gt=y("nowplaying"),Ze=y("status"),Oe=y("playBtn"),_n=y("appVer"),On=y("sidebar"),In=y("player"),Re=y("grid"),$=y("roleview"),An=y("comments"),zn=y("commentsHead"),Me=y("commentlist"),Qe=y("composer"),ce=y("composerToggle"),ue=y("composerText"),Jt=y("composerChars"),wt=y("composerRatingEl"),Be=y("nameModal"),Ie=y("nameInput"),et=y("charModal"),kt=y("charEditList"),Ue=y("newCharName"),Bn=y("newCharRole"),Yt=y("addCharBtn"),Wn=y("closeCharBtn"),Lt=y("ratingsBtn"),St=y("shareBtn"),tt=y("shareModal"),Hn=y("shareCancelBtn"),$n=y("shareConfirmBtn"),C=ge.create({container:"#waveform",waveColor:"#7a8ba6",progressColor:"#3b82f6",cursorColor:"#ef4444",height:120}),Ve=C.registerPlugin(Ke.create());C.on("ready",()=>{Ze.textContent=`${Ae(0)} / ${Ae(C.getDuration())}`});C.on("timeupdate",i=>{Ze.textContent=`${Ae(i)} / ${Ae(C.getDuration())}`});C.on("play",()=>{Oe.textContent="⏸ 暫停",H==="role"&&ye()});C.on("pause",()=>{Oe.textContent="▶ 播放",H==="role"&&ye()});C.on("finish",()=>{H==="single"&&U<N.length-1?te(U+1):H==="role"&&(be=null,ye())});Ve.on("region-clicked",(i,e)=>{e.stopPropagation(),C.setTime(i.start),C.play()});Oe.addEventListener("click",()=>{Oe.blur(),C.playPause()});function nt(i){if(!isFinite(i))return"0:00";const e=Math.floor(i/60),t=Math.floor(i%60).toString().padStart(2,"0");return`${e}:${t}`}function Ae(i){if(!isFinite(i))return"0:00.00";const e=Math.floor(i/60),t=Math.floor(i%60),n=Math.floor((i-Math.floor(i))*100);return`${e}:${t.toString().padStart(2,"0")}.${n.toString().padStart(2,"0")}`}function Zt(){return Math.random().toString(36).slice(2)+Date.now().toString(36)}function Xe(i){return i.code==="Enter"||i.code==="NumpadEnter"}function it(i,e){const t=i.indexOf(e);t>=0?i.splice(t,1):i.push(e)}function de(i){return i.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}function We(){return U>=0&&U<N.length?N[U].name:null}function Fn(){return H==="grid"?j>=0&&j<N.length?N[j].name:null:We()}function rt(i){return i?k.filter(e=>e.file===i).sort((e,t)=>(e.time??-1/0)-(t.time??-1/0)):[]}function Qt(i){return k.filter(e=>e.file===i).length}function jn(i){return(i.length?Vt(i[0],T):null)??"#3b82f6"}function Y(){en(),$e(),He(),ae(),H==="role"&&pe()}function Z(){var i;ae(),H==="role"&&pe(),G&&((i=(H==="role"?$:Me).querySelector(".creply-input input"))==null||i.focus())}function en(){Ge(k),V&&(window.clearTimeout(gt),gt=window.setTimeout(()=>void Un(),300))}async function Un(){if(V)try{const e=await(await V.getFileHandle(Je,{create:!0})).createWritable();await e.write(JSON.stringify({version:1,updated:new Date().toISOString(),comments:k},null,2)),await e.close()}catch{}}function tn(i){const e=new Map(k.map(t=>[t.id,t]));i.forEach(t=>e.set(t.id,t)),k=[...e.values()]}async function Vn(){if(V)try{const e=await(await V.getFileHandle(Je)).getFile(),t=JSON.parse(await e.text());Array.isArray(t==null?void 0:t.comments)&&(tn(t.comments.map(ze)),Ge(k))}catch{}}function Xn(){const i=JSON.stringify({version:1,exported:new Date().toISOString(),comments:k,characters:T},null,2),e=new Blob([i],{type:"application/json"}),t=URL.createObjectURL(e),n=new Date,r=a=>String(a).padStart(2,"0"),s=`${n.getFullYear()}${r(n.getMonth()+1)}${r(n.getDate())}-${r(n.getHours())}${r(n.getMinutes())}`,o=document.createElement("a");o.href=t,o.download=`voicepicker-backup-${s}.json`,o.click(),URL.revokeObjectURL(t)}async function qn(i){try{const e=JSON.parse(await i.text());Array.isArray(e==null?void 0:e.comments)&&tn(e.comments.map(ze)),Array.isArray(e==null?void 0:e.characters)&&e.characters.length>0&&(T=e.characters,Te(T)),Y(),alert(`匯入完成：目前共 ${k.length} 則留言。`)}catch{alert("匯入失敗：檔案不是有效的 VoicePicker 備份。")}}bt.addEventListener("click",()=>{bt.blur(),Xn()});yt.addEventListener("click",()=>{yt.blur(),Pe.click()});Pe.addEventListener("change",()=>{var e;const i=(e=Pe.files)==null?void 0:e[0];i&&qn(i),Pe.value=""});vt.addEventListener("click",async()=>{var e;vt.blur();const i=window.showDirectoryPicker;if(!i){alert("此瀏覽器不支援資料夾選取，請改用 Chrome / Edge。");return}try{V=await i({mode:"readwrite"})}catch{return}N=[];for await(const[t,n]of V.entries()){if(n.kind!=="file")continue;const r=((e=t.split(".").pop())==null?void 0:e.toLowerCase())??"";Mn.has(r)&&N.push({name:t,handle:n})}N.sort((t,n)=>t.name.localeCompare(n.name,"zh-Hant",{numeric:!0})),await Vn(),Ne=Date.now(),ci(),hn(),He(),N.length>0?(j=0,te(0)):Gt.textContent="此資料夾沒有音檔"});function He(){Ct.innerHTML="",N.forEach((i,e)=>{const t=document.createElement("li");e===U&&(t.className="active");const n=document.createElement("span");n.textContent=i.name,n.style.overflow="hidden",n.style.textOverflow="ellipsis",t.appendChild(n);const r=Qt(i.name);if(r>0){const s=document.createElement("span");s.className="badge",s.textContent=String(r),t.appendChild(s)}t.addEventListener("click",()=>void te(e)),Ct.appendChild(t)})}async function te(i){if(i<0||i>=N.length)return;U=i,j=i,He();const e=N[i];Gt.textContent=e.name,Ze.textContent="載入中…";const t=await e.handle.getFile();xe&&URL.revokeObjectURL(xe),xe=URL.createObjectURL(t),await C.load(xe),$e(),ae(),C.play()}function $e(){Ve.clearRegions(),rt(We()).filter(e=>e.time!==null).forEach((e,t)=>{Ve.addRegion({start:e.time,content:String(t+1),color:jn(e.character),drag:!1,resize:!1})})}function Kn(i,e){const t=document.createElement("div");t.className="c-rating";for(let n=1;n<=5;n++){const r=document.createElement("button");r.type="button",r.className="c-star"+(n<=i.rating?" filled":""),r.textContent="★",r.title=`${n} 分${i.rating===n?"（再按清除）":""}`,r.addEventListener("click",s=>{s.stopPropagation(),i.rating=i.rating===n?0:n,Y()}),t.appendChild(r)}e.appendChild(t)}function nn(i,e={}){const t=document.createElement("div");t.className="citem"+(e.role?" role":"")+(e.focused?" rolefocus":""),e.role&&e.ridx!==void 0&&(t.dataset.ridx=String(e.ridx));let n=t;if(e.role){const h=document.createElement("div");h.className="card-inner";const u=document.createElement("div");u.className="card-main";const m=document.createElement("button");m.className="cplay",m.dataset.cid=i.id,m.textContent=be===i.id&&C.isPlaying()?"⏸":"▶",m.addEventListener("click",p=>{p.stopPropagation(),on(i,e.ridx)}),h.append(u,m),t.appendChild(h),n=u}const r=document.createElement("div");r.className="crow";const s=document.createElement("span");if(i.time===null?(s.className="ctime general",s.textContent="整體"):(s.className="ctime",s.textContent=nt(i.time),s.addEventListener("click",h=>{h.stopPropagation(),qe(i)})),r.appendChild(s),e.role){const h=document.createElement("span");if(h.className="cfile",h.textContent=i.file,e.badge){const u=document.createElement("span");u.className="cfile-badge",u.textContent=e.badge,h.appendChild(u)}r.appendChild(h)}const o=document.createElement("span");o.className="cauthor",o.textContent=i.author,r.appendChild(o);const a=document.createElement("button");a.className="cdel",a.textContent="×",a.title="刪除",a.addEventListener("click",h=>{h.stopPropagation(),k=k.filter(u=>u.id!==i.id),Y()}),r.appendChild(a),n.appendChild(r),Kn(i,n);const l=document.createElement("div");l.className="ctext",l.textContent=i.text,l.addEventListener("dblclick",h=>{h.stopPropagation(),l.contentEditable="true",l.focus()}),l.addEventListener("keydown",h=>{h.isComposing||h.key==="Enter"&&!h.shiftKey&&(h.preventDefault(),l.blur())}),l.addEventListener("blur",()=>{l.contentEditable="false";const h=(l.innerText??"").trim();h?(i.text=h,Y()):l.textContent=i.text}),n.appendChild(l);const c=document.createElement("div");if(c.className="ctag-row",Gn(i,c),n.appendChild(c),i.replies.length){const h=document.createElement("div");h.className="creplies",i.replies.forEach(u=>{const m=document.createElement("div");m.className="creply";const p=document.createElement("span");p.className="crauthor",p.textContent=u.author+"：";const g=document.createElement("span");g.textContent=u.text;const f=document.createElement("button");f.className="crdel",f.textContent="×",f.addEventListener("click",v=>{v.stopPropagation(),i.replies=i.replies.filter(w=>w.id!==u.id),Y()}),m.append(p,g,f),h.appendChild(m)}),n.appendChild(h)}const d=document.createElement("div");if(d.className="creply-input",G===i.id){const h=document.createElement("input");h.type="text",h.placeholder="回覆…（Enter 送出 / Esc 取消）",h.addEventListener("keydown",m=>{m.stopPropagation(),!m.isComposing&&(m.key==="Enter"?(m.preventDefault(),Pt(i,h.value)):m.key==="Escape"&&(m.preventDefault(),G=null,Z()))});const u=document.createElement("button");u.textContent="送出",u.addEventListener("click",m=>{m.stopPropagation(),Pt(i,h.value)}),d.append(h,u)}else{const h=document.createElement("button");h.className="creply-toggle",h.textContent="＋ 回覆",h.addEventListener("click",u=>{if(u.stopPropagation(),!ee){Fe(()=>{G=i.id,Z()});return}G=i.id,Z()}),d.appendChild(h)}return n.appendChild(d),e.role&&t.addEventListener("click",h=>{const u=h.target;u.closest("button, input, textarea, .ctag, .charchip, .ctext, .c-rating")||u.classList.contains("ctime")||u.isContentEditable||qe(i)}),t}function Gn(i,e){if(he===i.id){const t=document.createElement("div");t.className="char-picker",an(t,i.character,r=>{it(i.character,r),Y()});const n=document.createElement("button");n.type="button",n.className="charchip done",n.textContent="完成",n.addEventListener("click",r=>{r.stopPropagation(),he=null,Z()}),t.appendChild(n),e.appendChild(t)}else if(i.character.length>0)i.character.forEach(t=>{const n=document.createElement("span");n.className="ctag",n.style.background=Vt(t,T)??"#3b82f6",n.textContent=t,n.addEventListener("click",r=>{r.stopPropagation(),he=i.id,Z()}),e.appendChild(n)});else{const t=document.createElement("span");t.className="ctag empty",t.textContent="＋ 角色",t.addEventListener("click",n=>{n.stopPropagation(),he=i.id,Z()}),e.appendChild(t)}}function ae(){const i=Fn();zn.textContent=i?`留言 · ${i}`:"留言",Me.innerHTML="";const e=rt(i);if(e.length===0){const t=document.createElement("li");t.style.color="var(--muted)",t.style.fontSize="13px",t.textContent=i?"尚無留言。播放時按 C 新增。":"尚未選擇檔案。",Me.appendChild(t);return}e.forEach(t=>Me.appendChild(nn(t)))}function rn(i,e){const t=[...i];return e==="rating"?t.sort((n,r)=>r.rating-n.rating||n.file.localeCompare(r.file,"zh-Hant",{numeric:!0})||(n.time??-1/0)-(r.time??-1/0)):e==="file"?t.sort((n,r)=>n.file.localeCompare(r.file,"zh-Hant",{numeric:!0})||(n.time??-1/0)-(r.time??-1/0)):t.sort((n,r)=>n.author.localeCompare(r.author,"zh-Hant")||n.file.localeCompare(r.file,"zh-Hant",{numeric:!0})||(n.time??-1/0)-(r.time??-1/0)),t}function Jn(i){return rn(k.filter(e=>e.character.includes(i)),De)}function pe(){$.innerHTML="",B=[];const i=document.createElement("div");i.className="role-head";const e=document.createElement("h2");e.textContent="角色 Dashboard";const t=document.createElement("button");t.className="ghost",t.textContent="返回單檔",t.addEventListener("click",()=>K("single"));const n=document.createElement("span");n.className="role-hint",n.textContent="↑↓ 移動 · 空白鍵 就地播放 · Enter 進單檔 · Tab/Esc 返回";const r=document.createElement("div");r.className="role-sort-toggle",["rating","file","user"].forEach(d=>{const h=d==="rating"?"評分":d==="file"?"檔案":"使用者",u=document.createElement("button");u.className="role-sort-btn"+(De===d?" active":""),u.textContent=h,u.addEventListener("click",()=>{De=d,pe()}),r.appendChild(u)}),i.append(e,t,n,r),$.appendChild(i);const s=["lead","mascot","supporting"],o=k.filter(d=>d.character.length===0).length,a=document.createElement("div");a.className="role-stats-wrap";let l=null;if(s.forEach(d=>{const h=T.filter(p=>p.role===d);if(h.length===0)return;const u=document.createElement("div");u.className="role-stats-row",d==="supporting"&&(l=u);const m=document.createElement("span");m.className="role-stats-type",m.textContent=Ut[d],m.style.color=J[d],u.appendChild(m),h.forEach(p=>{const g=k.filter(v=>v.character.includes(p.name)).length,f=document.createElement("button");f.className="role-stat"+(g===0?" zero":""),f.style.background=J[p.role],f.textContent=`${p.name} ${g}`,f.addEventListener("click",()=>{var v;(v=$.querySelector(`[data-char="${p.name}"]`))==null||v.scrollIntoView({behavior:"smooth",block:"start"})}),u.appendChild(f)}),a.appendChild(u)}),o>0){const d=document.createElement("button");if(d.className="role-stat",d.style.background="#64748b",d.textContent=`未指定 ${o}`,d.addEventListener("click",()=>{var h;(h=$.querySelector('[data-char="__none__"]'))==null||h.scrollIntoView({behavior:"smooth",block:"start"})}),l)l.appendChild(d);else{const h=document.createElement("div");h.className="role-stats-row",h.appendChild(d),a.appendChild(h)}}$.appendChild(a);const c=(d,h,u)=>{if(u.length===0)return;const m=document.createElement("div");m.className="role-group",m.dataset.char=d;const p=document.createElement("div");p.className="role-group-label",p.style.background=h,p.textContent=d==="__none__"?"未指定":d,m.appendChild(p);const g=document.createElement("div");g.className="role-group-cards-wrap";const f=u.reduce((v,w)=>Math.max(v,w.rating),0);u.forEach(v=>{const w=B.length,M=v.rating===0?"👎":v.rating===f?"🏆":void 0;g.appendChild(nn(v,{role:!0,ridx:w,focused:w===W,badge:M})),B.push(v)}),m.appendChild(g),$.appendChild(m)};if(T.forEach(d=>c(d.name,J[d.role],Jn(d.name))),c("__none__","#64748b",rn(k.filter(d=>d.character.length===0),De)),B.length===0){const d=document.createElement("div");d.style.color="var(--muted)",d.textContent="尚無留言。",$.appendChild(d)}W>=B.length&&(W=Math.max(0,B.length-1))}function ye(){$.querySelectorAll(".cplay").forEach(i=>{i.textContent=be===i.dataset.cid&&C.isPlaying()?"⏸":"▶"})}function sn(){$.querySelectorAll(".citem").forEach(i=>{const e=i.dataset.ridx===String(W);i.classList.toggle("rolefocus",e),e&&i.scrollIntoView({block:"nearest"})})}function Dt(i){B.length!==0&&(W=Math.min(Math.max(0,W+i),B.length-1),sn())}async function Yn(i,e){const t=N.findIndex(r=>r.name===i.file);if(t<0)return;t!==U&&await te(t),C.setTime(i.time??0),C.play(),be=i.id;const n=e!==void 0?e:B.indexOf(i);n>=0&&(W=n,sn()),ye()}function on(i,e){if(be===i.id&&C.isPlaying()){C.pause(),ye();return}Yn(i,e)}async function qe(i){const e=N.findIndex(t=>t.name===i.file);e<0||(H!=="single"&&K("single"),e!==U&&await te(e),i.time!==null&&C.setTime(i.time),C.play())}function an(i,e,t,n){i.innerHTML="",T.forEach((r,s)=>{const o=document.createElement("button");o.type="button",o.className="charchip"+(s===n?" focused":""),o.textContent=r.name,o.style.borderColor=J[r.role],e.includes(r.name)&&(o.style.background=J[r.role],o.style.color="#fff"),o.addEventListener("click",a=>{a.stopPropagation(),t(r.name)}),i.appendChild(o)})}function Pt(i,e){const t=e.trim();if(!t){G=null,Z();return}const n=()=>{i.replies.push({id:Zt(),author:ee,text:t,created:Date.now()}),G=null,Y()};ee?n():Fe(n)}function Zn(){if(!(U<0)){if(!ee){Fe(()=>Rt());return}Rt()}}function Rt(){C.pause(),Ye=C.getCurrentTime(),se=!0,ue.value="",oe=[],re=0,I="text",F(),Qe.classList.remove("hidden"),ue.focus()}function ln(){Qe.classList.add("hidden"),I="text"}function st(){wt.innerHTML="";for(let i=1;i<=5;i++){const e=document.createElement("button");e.type="button",e.className="c-star"+(i<=re?" filled":""),e.textContent="★",e.title=`${i} 分`,e.addEventListener("click",t=>{t.stopPropagation(),re=re===i?0:i,st()}),wt.appendChild(e)}}function F(){Qn(),cn(),st()}function Qn(){se?(ce.textContent=`對應秒數 ${nt(Ye)}`,ce.classList.remove("off")):(ce.textContent="整體留言（不對應秒數）",ce.classList.add("off")),ce.classList.toggle("focused",I==="toggle")}function cn(){an(Jt,oe,e=>{it(oe,e),cn()},typeof I=="number"?I:void 0)}function Mt(){const i=ue.value.trim();if(ln(),!i)return;const e=We();e&&(k.push({id:Zt(),file:e,time:se?Ye:null,text:i,author:ee,character:[...oe],replies:[],rating:re}),Y())}function Tt(){I="toggle",ue.blur(),F()}function Nt(){I="text",F(),ue.focus()}function ei(){if(T.length===0)return;const i=oe.length?T.findIndex(e=>e.name===oe[0]):-1;I=i>=0?i:0,ue.blur(),F()}function ti(i){it(oe,T[i].name),F()}function Ce(i,e){const t=Array.from(Jt.children);if(t.length===0)return i;const n=t.map(d=>d.getBoundingClientRect()),r=n[i],s=r.left+r.width/2,o=r.top+r.height/2,a=r.height/2;if(e==="left"||e==="right"){let d=-1,h=1/0;return n.forEach((u,m)=>{if(m===i||Math.abs(u.top+u.height/2-o)>a)return;const p=u.left+u.width/2;e==="left"&&p<s&&s-p<h&&(h=s-p,d=m),e==="right"&&p>s&&p-s<h&&(h=p-s,d=m)}),d>=0?d:i}let l=-1,c=1/0;return n.forEach((d,h)=>{if(h===i)return;const u=d.top+d.height/2;if(!(e==="up"?u<o-a:u>o+a))return;const p=Math.abs(u-o)*1e3+Math.abs(d.left+d.width/2-s);p<c&&(c=p,l=h)}),e==="up"&&l<0?"toggle":l>=0?l:i}function ni(i){if(i.isComposing)return;if(i.shiftKey&&/^Digit[0-5]$/.test(i.code)){i.preventDefault();const t=parseInt(i.code[5]);re=re===t?0:t,st();return}if(i.code==="Escape"){i.preventDefault(),ln();return}if(I==="text"){if(Xe(i)&&!i.shiftKey){i.preventDefault(),Mt();return}if(i.code==="ArrowDown"||i.code==="Tab"){i.preventDefault(),Tt();return}return}if(Xe(i)){i.preventDefault(),Mt();return}if(I==="toggle"){switch(i.code){case"Space":i.preventDefault(),se=!se,F();break;case"ArrowUp":i.preventDefault(),Nt();break;case"ArrowDown":case"Tab":i.preventDefault(),ei();break}return}const e=I;switch(i.code){case"Space":i.preventDefault(),ti(e);break;case"ArrowRight":{i.preventDefault();const t=Ce(e,"right");typeof t=="number"&&(I=t,F());break}case"ArrowLeft":{i.preventDefault();const t=Ce(e,"left");typeof t=="number"&&(I=t,F());break}case"ArrowDown":{i.preventDefault();const t=Ce(e,"down");typeof t=="number"&&(I=t,F());break}case"ArrowUp":{i.preventDefault();const t=Ce(e,"up");t==="toggle"?Tt():(I=t,F());break}case"Tab":i.preventDefault(),Nt();break}}ce.addEventListener("click",()=>{se=!se,F()});function Fe(i){_e=i,Ie.value=ee,Be.classList.remove("hidden"),Ie.focus()}function ii(){const i=Ie.value.trim();if(!i)return;ee=i,Ln(i),Be.classList.add("hidden");const e=_e;_e=null,e&&e()}Ie.addEventListener("keydown",i=>{i.stopPropagation(),!i.isComposing&&(i.key==="Enter"?(i.preventDefault(),ii()):i.key==="Escape"&&(i.preventDefault(),Be.classList.add("hidden"),_e=null))});Et.addEventListener("click",()=>{Et.blur(),fe(),et.classList.remove("hidden")});function fe(){kt.innerHTML="",T.forEach((i,e)=>{const t=document.createElement("li"),n=document.createElement("span");n.className="dot",n.style.background=J[i.role];const r=document.createElement("span");r.textContent=i.name,r.title="雙擊重命名",r.style.cursor="pointer",r.addEventListener("dblclick",()=>{const a=document.createElement("input");a.type="text",a.value=i.name,a.style.cssText="font-size:13px;width:120px;padding:2px 6px",t.replaceChild(a,r),a.focus(),a.select();const l=()=>{const c=a.value.trim();if(c&&c!==i.name){const d=i.name;i.name=c,k.forEach(h=>{const u=h.character.indexOf(d);u>=0&&(h.character[u]=c)}),Te(T),en()}fe()};a.addEventListener("keydown",c=>{c.stopPropagation(),c.key==="Enter"?(c.preventDefault(),l()):c.key==="Escape"&&(c.preventDefault(),fe())}),a.addEventListener("blur",l)});const s=document.createElement("span");s.className="role",s.textContent=Ut[i.role];const o=document.createElement("button");o.className="rm",o.textContent="刪除",o.addEventListener("click",()=>{T.splice(e,1),Te(T),fe()}),t.append(n,r,s,o),kt.appendChild(t)})}Yt.addEventListener("click",()=>{const i=Ue.value.trim();i&&(T.push({name:i,role:Bn.value}),Te(T),Ue.value="",fe())});Ue.addEventListener("keydown",i=>{i.stopPropagation(),!i.isComposing&&i.key==="Enter"&&(i.preventDefault(),Yt.click())});Wn.addEventListener("click",()=>{et.classList.add("hidden"),$e(),ae(),H==="role"&&pe()});function _t(i){const e=C.getDuration();!isFinite(e)||e===0||C.setTime(Math.min(Math.max(0,C.getCurrentTime()+i),e))}function Ot(i){const e=rt(We()).filter(r=>r.time!==null).map(r=>r.time);if(e.length===0)return;const t=C.getCurrentTime();let n;if(i<0){for(let r=e.length-1;r>=0;r--)if(e[r]<t-Tn){n=e[r];break}n??(n=e[0])}else{for(let r=0;r<e.length;r++)if(e[r]>t+Nn){n=e[r];break}n??(n=e[e.length-1])}C.setTime(n)}function K(i){H=i;const e=i==="single",t=i==="grid",n=i==="role";(t||n)&&C.pause(),On.classList.toggle("hidden",!e),In.classList.toggle("hidden",!e),Re.classList.toggle("hidden",!t),$.classList.toggle("hidden",!n),An.classList.toggle("hidden",n),t&&dn(),n&&(W=0,pe()),ae()}function dn(){Re.innerHTML="";const i=document.createElement("div");i.className="gridhint",i.textContent="WASD／方向鍵 移動 · 空白鍵或 Enter 開啟 · Tab 返回單檔",Re.appendChild(i),N.forEach((e,t)=>{const n=document.createElement("div");n.className="gridcard"+(t===j?" selected":""),n.innerHTML=`<div class="gc-name">${de(e.name)}</div><div class="gc-meta">${Qt(e.name)} 則留言</div>`,n.addEventListener("click",()=>{j=t,K("single"),te(t)}),Re.appendChild(n)})}function we(i){const e=N.length;e!==0&&(j=Math.min(Math.max(0,j+i),e-1),dn(),ae())}function ri(){const i=document.activeElement;return i?i.tagName==="INPUT"||i.tagName==="TEXTAREA"||i.isContentEditable:!1}function si(){return!Be.classList.contains("hidden")||!et.classList.contains("hidden")}document.addEventListener("keydown",i=>{if(!Qe.classList.contains("hidden")){ni(i);return}if(!i.isComposing){if(he!==null&&i.code==="Escape"){i.preventDefault(),he=null,Z();return}if(G!==null&&i.code==="Escape"){i.preventDefault(),G=null,Z();return}if(!(si()||ri())){if(H==="role"){if(i.shiftKey&&/^Digit[0-5]$/.test(i.code)){i.preventDefault();const e=parseInt(i.code[5]),t=B[W];t&&(t.rating=t.rating===e?0:e,Y());return}if(i.code==="Tab"||i.code==="Escape"){i.preventDefault(),K("single");return}switch(i.code){case"ArrowUp":case"KeyW":i.preventDefault(),Dt(-1);break;case"ArrowDown":case"KeyS":i.preventDefault(),Dt(1);break;case"Space":i.preventDefault(),B[W]&&on(B[W],W);break;case"Enter":case"NumpadEnter":i.preventDefault(),B[W]&&qe(B[W]);break}return}if(H==="grid"){if(Xe(i)){i.preventDefault(),K("single"),te(j);return}switch(i.code){case"KeyA":case"ArrowLeft":i.preventDefault(),we(-1);break;case"KeyD":case"ArrowRight":i.preventDefault(),we(1);break;case"KeyW":case"ArrowUp":i.preventDefault(),we(-ft);break;case"KeyS":case"ArrowDown":i.preventDefault(),we(ft);break;case"Space":i.preventDefault(),K("single"),te(j);break;case"Tab":i.preventDefault(),K("single");break}return}switch(i.code){case"Space":i.preventDefault(),C.playPause();break;case"KeyA":case"ArrowLeft":i.preventDefault(),_t(-5);break;case"KeyD":case"ArrowRight":i.preventDefault(),_t(5);break;case"KeyW":case"ArrowUp":i.preventDefault(),Ot(-1);break;case"KeyS":case"ArrowDown":i.preventDefault(),Ot(1);break;case"KeyC":case"KeyX":i.preventDefault(),Zn();break;case"Tab":i.preventDefault(),N.length&&K("grid");break}}}});function oi(){let i="";const e=(s,o)=>o.rating-s.rating||s.file.localeCompare(o.file,"zh-Hant",{numeric:!0})||(s.time??-1/0)-(o.time??-1/0),t=(s,o,a)=>{if(a.length===0)return;const l=a.map(c=>{const d=c.rating>0?"★".repeat(c.rating)+"☆".repeat(5-c.rating):"",h=c.time!==null?nt(c.time):"整體";return`<tr>
        <td class="tc">${de(h)}</td>
        <td class="fn">${de(c.file)}</td>
        <td class="cm">${de(c.text)}</td>
        <td class="sr">${d}</td>
        <td class="au">${de(c.author)}</td>
      </tr>`}).join("");i+=`<div class="section">
  <div class="slabel" style="background:${o}">${de(s==="__none__"?"未指定":s)}</div>
  <table><thead><tr>
    <th class="tc">時間</th><th class="fn">音檔</th><th class="cm">評語</th><th class="sr">評分</th><th class="au">留言者</th>
  </tr></thead><tbody>${l}</tbody></table>
</div>`};T.forEach(s=>t(s.name,J[s.role],k.filter(o=>o.character.includes(s.name)).sort(e))),t("__none__","#64748b",k.filter(s=>s.character.length===0).sort(e));const n=`<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<title>VoicePicker 評語報告</title>
<style>
  body{font-family:system-ui,"Microsoft JhengHei",sans-serif;padding:40px;color:#111;max-width:1000px;margin:0 auto}
  h1{font-size:22px;margin-bottom:4px}
  .sub{color:#6b7280;font-size:13px;margin-bottom:28px}
  .section{margin-bottom:32px}
  .slabel{display:inline-block;padding:3px 14px;border-radius:999px;color:#fff;font-size:13px;font-weight:600;margin-bottom:8px}
  table{width:100%;border-collapse:collapse;font-size:13px}
  th{text-align:left;font-size:11px;color:#6b7280;padding:5px 8px;border-bottom:2px solid #e5e7eb}
  td{padding:8px;border-bottom:1px solid #f3f4f6;vertical-align:top}
  td.tc{white-space:nowrap;color:#3b82f6;font-variant-numeric:tabular-nums;width:54px}
  td.fn{color:#6b7280;width:200px;word-break:break-all;font-size:11px}
  td.cm{white-space:pre-wrap;line-height:1.5}
  td.sr{color:#d97706;white-space:nowrap;width:68px;font-size:12px}
  td.au{color:#9ca3af;white-space:nowrap;width:60px;font-size:11px}
  tr:last-child td{border-bottom:none}
  @media print{body{padding:20px}}
</style>
</head>
<body>
<h1>VoicePicker — 評語報告</h1>
<div class="sub">產出時間：${new Date().toLocaleString("zh-Hant")} · 共 ${k.length} 則留言</div>
${i||'<p style="color:#9ca3af">尚無留言</p>'}
</body></html>`,r=window.open("","_blank","width=900,height=800");if(!r){alert("請允許開啟新分頁（檢查彈出視窗封鎖設定）");return}r.document.write(n),r.document.close(),setTimeout(()=>r.print(),600)}Lt.addEventListener("click",()=>{Lt.blur(),oi()});const ai=1e4;function li(i){const e=new Set(k.map(n=>n.id)),t=i.map(ze).filter(n=>!e.has(n.id));return t.length===0?0:(k=[...k,...t],t.length)}function ci(){It(),Se=window.setInterval(async()=>{if(!V){It();return}try{const e=await(await V.getFileHandle(Je)).getFile(),t=JSON.parse(await e.text());if(!Array.isArray(t==null?void 0:t.comments))return;const n=li(t.comments);Ne=Date.now(),hn(),n>0&&(Ge(k),$e(),He(),ae(),H==="role"&&pe(),di(`已同步 ${n} 則新留言`))}catch{}},ai)}function It(){Se!==void 0&&(window.clearInterval(Se),Se=void 0)}function hn(){const i=document.getElementById("syncStatus");if(!i)return;if(!V){i.textContent="";return}const e=Ne?new Date(Ne).toLocaleTimeString("zh-Hant",{hour:"2-digit",minute:"2-digit",second:"2-digit"}):"—";i.textContent=`↺ 協作同步中 · ${e}`}let At;function di(i){const e=document.getElementById("syncToast");e&&(e.textContent=i,e.classList.remove("hidden"),window.clearTimeout(At),At=window.setTimeout(()=>e.classList.add("hidden"),3e3))}function hi(){const i=l=>JSON.stringify(l).replace(/</g,"\\u003c").replace(/>/g,"\\u003e").replace(/&/g,"\\u0026"),e=Rn.replace("{{DATA_JSON}}",()=>i({comments:k,characters:T,roleColors:J})),t=new Blob([e],{type:"text/html;charset=utf-8"}),n=URL.createObjectURL(t),r=new Date,s=l=>String(l).padStart(2,"0"),o=`${r.getFullYear()}${s(r.getMonth()+1)}${s(r.getDate())}-${s(r.getHours())}${s(r.getMinutes())}`,a=document.createElement("a");a.href=n,a.download=`voicepicker-share-${o}.html`,a.click(),URL.revokeObjectURL(n)}St.addEventListener("click",()=>{St.blur(),tt.classList.remove("hidden")});Hn.addEventListener("click",()=>tt.classList.add("hidden"));$n.addEventListener("click",()=>{tt.classList.add("hidden"),hi()});xt.addEventListener("click",()=>{xt.blur(),K("role")});_n.textContent="v0.8.0";ee||Fe(null);
