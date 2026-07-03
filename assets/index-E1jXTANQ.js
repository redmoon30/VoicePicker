(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(r){if(r.ep)return;r.ep=!0;const o=t(r);fetch(r.href,o)}})();function A(i,e,t,n){return new(t||(t=Promise))(function(r,o){function a(s){try{c(n.next(s))}catch(u){o(u)}}function l(s){try{c(n.throw(s))}catch(u){o(u)}}function c(s){var u;s.done?r(s.value):(u=s.value,u instanceof t?u:new t(function(m){m(u)})).then(a,l)}c((n=n.apply(i,e||[])).next())})}let xe=class{constructor(){this.listeners={}}on(e,t,n){if(this.listeners[e]||(this.listeners[e]=new Set),n==null?void 0:n.once){const r=(...o)=>{this.un(e,r),t(...o)};return this.listeners[e].add(r),()=>this.un(e,r)}return this.listeners[e].add(t),()=>this.un(e,t)}un(e,t){var n;(n=this.listeners[e])===null||n===void 0||n.delete(t)}once(e,t){return this.on(e,t,{once:!0})}unAll(){this.listeners={}}emit(e,...t){this.listeners[e]&&this.listeners[e].forEach(n=>n(...t))}};const Ce={decode:function(i,e){return A(this,void 0,void 0,function*(){const t=new AudioContext({sampleRate:e});try{return yield t.decodeAudioData(i)}finally{t.close()}})},createBuffer:function(i,e){if(!i||i.length===0)throw new Error("channelData must be a non-empty array");if(e<=0)throw new Error("duration must be greater than 0");if(typeof i[0]=="number"&&(i=[i]),!i[0]||i[0].length===0)throw new Error("channelData must contain non-empty channel arrays");(function(n){const r=n[0];if(r.some(o=>o>1||o<-1)){const o=r.length;let a=0;for(let l=0;l<o;l++){const c=Math.abs(r[l]);c>a&&(a=c)}for(const l of n)for(let c=0;c<o;c++)l[c]/=a}})(i);const t=i.map(n=>n instanceof Float32Array?n:Float32Array.from(n));return{duration:e,length:t[0].length,sampleRate:t[0].length/e,numberOfChannels:t.length,getChannelData:n=>{const r=t[n];if(!r)throw new Error(`Channel ${n} not found`);return r},copyFromChannel:AudioBuffer.prototype.copyFromChannel,copyToChannel:AudioBuffer.prototype.copyToChannel}}};function Ht(i,e){const t=e.xmlns?document.createElementNS(e.xmlns,i):document.createElement(i);for(const[n,r]of Object.entries(e))if(n==="children"&&r)for(const[o,a]of Object.entries(r))a instanceof Node?t.appendChild(a):typeof a=="string"?t.appendChild(document.createTextNode(a)):t.appendChild(Ht(o,a));else n==="style"?Object.assign(t.style,r):n==="textContent"?t.textContent=r:t.setAttribute(n,r.toString());return t}function ht(i,e,t){const n=Ht(i,e||{});return t==null||t.appendChild(n),n}function Ft(i){return i instanceof HTMLElement||typeof i=="object"&&i!==null&&i.nodeType===Node.ELEMENT_NODE&&typeof i.style=="object"}var vn=Object.freeze({__proto__:null,createElement:ht,default:ht,isHTMLElement:Ft});const bn={fetchBlob:function(i,e,t){return A(this,void 0,void 0,function*(){var n;const r=yield fetch(i,t);if(r.status>=400)throw new Error(`Failed to fetch ${i}: ${r.status} (${r.statusText})`);return function(o,a,l){A(this,void 0,void 0,function*(){var c;if(!o.body||!o.headers)return;const s=o.body.getReader(),u=Number(o.headers.get("Content-Length"))||0;let m=0;const d=()=>{s.cancel()};if(l){if(l.aborted)return void s.cancel();l.addEventListener("abort",d,{once:!0})}try{for(;;){const f=yield s.read();if(f.done)break;if(m+=((c=f.value)===null||c===void 0?void 0:c.length)||0,u>0){const h=Math.round(m/u*100);a(h)}}}catch(f){if(f instanceof DOMException&&f.name==="AbortError")return;console.warn("Progress tracking error:",f)}finally{l&&l.removeEventListener("abort",d)}})}(r.clone(),e,(n=t==null?void 0:t.signal)!==null&&n!==void 0?n:void 0),r.blob()})}};function M(i){let e=i;const t=new Set;return{get value(){return e},set(n){Object.is(e,n)||(e=n,t.forEach(r=>r(e)))},update(n){this.set(n(e))},subscribe:n=>(t.add(n),()=>t.delete(n))}}function re(i,e){const t=M(i());return e.forEach(n=>n.subscribe(()=>{const r=i();Object.is(t.value,r)||t.set(r)})),{get value(){return t.value},subscribe:n=>t.subscribe(n)}}function K(i,e){let t;const n=()=>{t&&(t(),t=void 0),t=i()},r=e.map(o=>o.subscribe(n));return n(),()=>{t&&(t(),t=void 0),r.forEach(o=>o())}}class yn extends xe{get isPlayingSignal(){return this._isPlaying}get currentTimeSignal(){return this._currentTime}get durationSignal(){return this._duration}get volumeSignal(){return this._volume}get mutedSignal(){return this._muted}get playbackRateSignal(){return this._playbackRate}get seekingSignal(){return this._seeking}constructor(e){super(),this.isExternalMedia=!1,this._ownBlobUrl=null,this.reactiveMediaEventCleanups=[],e.media?(this.media=e.media,this.isExternalMedia=!0):this.media=document.createElement("audio"),this._isPlaying=M(!1),this._currentTime=M(0),this._duration=M(0),this._volume=M(this.media.volume),this._muted=M(this.media.muted),this._playbackRate=M(this.media.playbackRate||1),this._seeking=M(!1),this.setupReactiveMediaEvents(),e.mediaControls&&(this.media.controls=!0),e.autoplay&&(this.media.autoplay=!0),e.playbackRate!=null&&this.onMediaEvent("canplay",()=>{e.playbackRate!=null&&(this.media.playbackRate=e.playbackRate)},{once:!0})}setupReactiveMediaEvents(){this.reactiveMediaEventCleanups.push(this.onMediaEvent("play",()=>{this._isPlaying.set(!0)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("pause",()=>{this._isPlaying.set(!1)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("ended",()=>{this._isPlaying.set(!1)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("timeupdate",()=>{this._currentTime.set(this.media.currentTime)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("durationchange",()=>{this._duration.set(this.media.duration||0)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("loadedmetadata",()=>{this._duration.set(this.media.duration||0)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("seeking",()=>{this._seeking.set(!0)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("seeked",()=>{this._seeking.set(!1)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("volumechange",()=>{this._volume.set(this.media.volume),this._muted.set(this.media.muted)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("ratechange",()=>{this._playbackRate.set(this.media.playbackRate)}))}onMediaEvent(e,t,n){return this.media.addEventListener(e,t,n),()=>this.media.removeEventListener(e,t,n)}getSrc(){return this.media.currentSrc||this.media.src||""}revokeSrc(){this._ownBlobUrl&&(URL.revokeObjectURL(this._ownBlobUrl),this._ownBlobUrl=null)}canPlayType(e){return this.media.canPlayType(e)!==""}setSrc(e,t){const n=this.getSrc();if(e&&n===e)return;this.revokeSrc();const r=t instanceof Blob&&(this.canPlayType(t.type)||!e)?URL.createObjectURL(t):e;if(r!==e&&(this._ownBlobUrl=r),n&&this.media.removeAttribute("src"),r||e)try{this.media.src=r}catch{this.media.src=e}}destroy(){this.reactiveMediaEventCleanups.forEach(e=>e()),this.reactiveMediaEventCleanups=[],this.revokeSrc(),this.unAll(),this.isExternalMedia||(this.media.pause(),this.media.removeAttribute("src"),this.media.load(),this.media.remove())}setMediaElement(e){this.reactiveMediaEventCleanups.forEach(t=>t()),this.reactiveMediaEventCleanups=[],this.media=e,this.setupReactiveMediaEvents()}play(){return A(this,void 0,void 0,function*(){try{return yield this.media.play()}catch(e){if(e instanceof DOMException&&e.name==="AbortError")return;throw e}})}pause(){this.media.pause()}isPlaying(){return!this.media.paused&&!this.media.ended}setTime(e){this.media.currentTime=Math.max(0,Math.min(e,this.getDuration()))}getDuration(){return this.media.duration}getCurrentTime(){return this.media.currentTime}getVolume(){return this.media.volume}setVolume(e){this.media.volume=e}getMuted(){return this.media.muted}setMuted(e){this.media.muted=e}getPlaybackRate(){return this.media.playbackRate}isSeeking(){return this.media.seeking}setPlaybackRate(e,t){t!=null&&(this.media.preservesPitch=t),this.media.playbackRate=e}getMediaElement(){return this.media}setSinkId(e){return this.media.setSinkId(e)}}function xn({maxTop:i,maxBottom:e,halfHeight:t,vScale:n,barMinHeight:r=0,barAlign:o}){let a=Math.round(i*t*n),l=a+Math.round(e*t*n)||1;return l<r&&(l=r,o||(a=l/2)),{topHeight:a,totalHeight:l}}function En({barAlign:i,halfHeight:e,topHeight:t,totalHeight:n,canvasHeight:r}){return i==="top"?0:i==="bottom"?r-n:e-t}function pt(i,e,t){const n=e-i.left,r=t-i.top;return[n/i.width,r/i.height]}function $t(i){return!!(i.barWidth||i.barGap||i.barAlign)}function mt(i,e){if(!$t(e))return i;const t=e.barWidth||.5,n=t+(e.barGap||t/2);return n===0?i:Math.floor(i/n)*n}function ft({scrollLeft:i,totalWidth:e,numCanvases:t}){if(e===0)return[0];const n=i/e,r=Math.floor(n*t);return[r-1,r,r+1]}function Ut(i){const e=i._cleanup;typeof e=="function"&&e()}function wn(i){const e=M({scrollLeft:i.scrollLeft,scrollWidth:i.scrollWidth,clientWidth:i.clientWidth}),t=re(()=>function(o){const{scrollLeft:a,scrollWidth:l,clientWidth:c}=o;if(l===0)return{startX:0,endX:1};const s=a/l,u=(a+c)/l;return{startX:Math.max(0,Math.min(1,s)),endX:Math.max(0,Math.min(1,u))}}(e.value),[e]),n=re(()=>function(o){return{left:o.scrollLeft,right:o.scrollLeft+o.clientWidth}}(e.value),[e]),r=()=>{e.set({scrollLeft:i.scrollLeft,scrollWidth:i.scrollWidth,clientWidth:i.clientWidth})};return i.addEventListener("scroll",r,{passive:!0}),{scrollData:e,percentages:t,bounds:n,cleanup:()=>{i.removeEventListener("scroll",r),Ut(e)}}}class Cn extends xe{constructor(e,t){super(),this.timeouts=[],this.isScrollable=!1,this.audioData=null,this.resizeObserver=null,this.lastContainerWidth=0,this.isDragging=!1,this.subscriptions=[],this.unsubscribeOnScroll=[],this.dragStream=null,this.scrollStream=null,this.containerInlinePadding=0,this.onClickWrapper=a=>{const l=this.wrapper.getBoundingClientRect(),[c,s]=pt(l,a.clientX,a.clientY);this.emit("click",c,s)},this.onDblClickWrapper=a=>{const l=this.wrapper.getBoundingClientRect(),[c,s]=pt(l,a.clientX,a.clientY);this.emit("dblclick",c,s)},this.subscriptions=[],this.options=e;const n=this.parentFromOptionsContainer(e.container);this.parent=n;const[r,o]=this.initHtml();n.appendChild(r),this.container=r,this.scrollContainer=o.querySelector(".scroll"),this.wrapper=o.querySelector(".wrapper"),this.canvasWrapper=o.querySelector(".canvases"),this.progressWrapper=o.querySelector(".progress"),this.cursor=o.querySelector(".cursor"),this.calculateInlinePadding(),t&&o.appendChild(t),this.initEvents()}parentFromOptionsContainer(e){let t;if(typeof e=="string"?t=document.querySelector(e):Ft(e)&&(t=e),!t)throw new Error("Container not found");return t}initEvents(){this.wrapper.addEventListener("click",this.onClickWrapper),this.wrapper.addEventListener("dblclick",this.onDblClickWrapper),this.options.dragToSeek!==!0&&typeof this.options.dragToSeek!="object"||this.initDrag(),this.scrollStream=wn(this.scrollContainer);const e=K(()=>{const{startX:t,endX:n}=this.scrollStream.percentages.value,{left:r,right:o}=this.scrollStream.bounds.value;this.emit("scroll",t,n,r,o)},[this.scrollStream.percentages,this.scrollStream.bounds]);if(this.subscriptions.push(e),typeof ResizeObserver=="function"){const t=this.createDelay(100);this.resizeObserver=new ResizeObserver(()=>{t().then(()=>this.onContainerResize()).catch(()=>{})}),this.resizeObserver.observe(this.scrollContainer)}}onContainerResize(){const e=this.parent.clientWidth;this.calculateInlinePadding(),e===this.lastContainerWidth&&this.options.height!=="auto"||(this.lastContainerWidth=e,this.reRender(),this.emit("resize"))}initDrag(){if(this.dragStream)return;this.dragStream=function(t,n={}){const{threshold:r=3,mouseButton:o=0,touchDelay:a=100}=n,l=M(null),c=new Map,s=matchMedia("(pointer: coarse)").matches;let u=()=>{};const m=d=>{if(d.button!==o||c.has(d.pointerId)||(c.set(d.pointerId,d),c.size>1))return;const f=d.pointerId;let h=d.clientX,g=d.clientY,p=!1;const v=Date.now(),y=t.getBoundingClientRect(),{left:S,top:x}=y,R=E=>{if(E.pointerId!==f||E.defaultPrevented||c.size>1||s&&Date.now()-v<a)return;const I=E.clientX,O=E.clientY,q=I-h,L=O-g;(p||Math.abs(q)>r||Math.abs(L)>r)&&(E.preventDefault(),E.stopPropagation(),p||(l.set({type:"start",x:h-S,y:g-x}),p=!0),l.set({type:"move",x:I-S,y:O-x,deltaX:q,deltaY:L}),h=I,g=O)},k=E=>{if(c.delete(E.pointerId)){if(E.pointerId===f&&p){const I=E.clientX,O=E.clientY;l.set({type:"end",x:I-S,y:O-x})}c.size===0&&u()}},C=E=>{E.relatedTarget&&E.relatedTarget!==document.documentElement||k(E)},b=E=>{p&&(E.stopPropagation(),E.preventDefault())},z=E=>{E.defaultPrevented||c.size>1||p&&E.preventDefault()};document.addEventListener("pointermove",R),document.addEventListener("pointerup",k),document.addEventListener("pointerout",C),document.addEventListener("pointercancel",C),document.addEventListener("touchmove",z,{passive:!1}),document.addEventListener("click",b,{capture:!0}),u=()=>{document.removeEventListener("pointermove",R),document.removeEventListener("pointerup",k),document.removeEventListener("pointerout",C),document.removeEventListener("pointercancel",C),document.removeEventListener("touchmove",z),setTimeout(()=>{document.removeEventListener("click",b,{capture:!0})},10)}};return t.addEventListener("pointerdown",m),{signal:l,cleanup:()=>{u(),t.removeEventListener("pointerdown",m),c.clear(),Ut(l)}}}(this.wrapper);const e=K(()=>{const t=this.dragStream.signal.value;if(!t)return;const n=this.wrapper.getBoundingClientRect().width,r=(o=t.x/n)<0?0:o>1?1:o;var o;t.type==="start"?(this.isDragging=!0,this.emit("dragstart",r)):t.type==="move"?this.emit("drag",r):t.type==="end"&&(this.isDragging=!1,this.emit("dragend",r))},[this.dragStream.signal]);this.subscriptions.push(e)}calculateInlinePadding(){const{paddingLeft:e,paddingRight:t}=getComputedStyle(this.scrollContainer),n=parseFloat(e)+parseFloat(t);this.containerInlinePadding=Number.isNaN(n)?0:n}initHtml(){const e=document.createElement("div"),t=e.attachShadow({mode:"open"}),n=this.options.cspNonce&&typeof this.options.cspNonce=="string"?this.options.cspNonce.replace(/"/g,""):"";return t.innerHTML=`
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
    `,[e,t]}setOptions(e){var t;if(this.options.container!==e.container){const n=this.parentFromOptionsContainer(e.container);n.appendChild(this.container),this.parent=n}e.dragToSeek===!0||typeof this.options.dragToSeek=="object"?this.initDrag():((t=this.dragStream)===null||t===void 0||t.cleanup(),this.dragStream=null),this.options=e,this.reRender()}getWrapper(){return this.wrapper}getWidth(){return this.scrollContainer.clientWidth-this.containerInlinePadding}getScroll(){return this.scrollContainer.scrollLeft}setScroll(e){this.scrollContainer.scrollLeft=e}setScrollPercentage(e){const{scrollWidth:t}=this.scrollContainer,n=t*e;this.setScroll(n)}destroy(){var e;this.wrapper.removeEventListener("click",this.onClickWrapper),this.wrapper.removeEventListener("dblclick",this.onDblClickWrapper),this.timeouts.forEach(t=>t()),this.timeouts=[],this.subscriptions.forEach(t=>t()),this.container.remove(),this.resizeObserver&&(this.resizeObserver.disconnect(),this.resizeObserver=null),(e=this.unsubscribeOnScroll)===null||e===void 0||e.forEach(t=>t()),this.unsubscribeOnScroll=[],this.dragStream&&(this.dragStream.cleanup(),this.dragStream=null),this.scrollStream&&(this.scrollStream.cleanup(),this.scrollStream=null)}createDelay(e=10){let t,n;const r=()=>{t&&(clearTimeout(t),t=void 0),n&&(n(),n=void 0)};return this.timeouts.push(r),()=>new Promise((o,a)=>{r(),n=a,t=setTimeout(()=>{t=void 0,n=void 0,o()},e)})}getHeight(e,t){var n;const r=((n=this.audioData)===null||n===void 0?void 0:n.numberOfChannels)||1;return function({optionsHeight:o,optionsSplitChannels:a,parentHeight:l,numberOfChannels:c,defaultHeight:s=128}){if(o==null)return s;const u=Number(o);if(!isNaN(u))return u;if(o==="auto"){const m=l||s;return a!=null&&a.every(d=>!d.overlay)?m/c:m}return s}({optionsHeight:e,optionsSplitChannels:t,parentHeight:this.parent.clientHeight,numberOfChannels:r,defaultHeight:128})}convertColorValues(e,t){return function(n,r,o){if(!Array.isArray(n))return n||"";if(n.length===0)return"#999";if(n.length<2)return n[0]||"";const a=document.createElement("canvas"),l=a.getContext("2d");if(!l)return n[0]||"";const c=o||a.height*r,s=l.createLinearGradient(0,0,0,c),u=1/(n.length-1);return n.forEach((m,d)=>{s.addColorStop(d*u,m)}),s}(e,this.getPixelRatio(),t==null?void 0:t.canvas.height)}getPixelRatio(){return e=window.devicePixelRatio,Math.max(1,e||1);var e}renderBarWaveform(e,t,n,r){const{width:o,height:a}=n.canvas,{halfHeight:l,barWidth:c,barRadius:s,barIndexScale:u,barSpacing:m,barMinHeight:d}=function({width:h,height:g,length:p,options:v,pixelRatio:y}){const S=g/2,x=v.barWidth?v.barWidth*y:1,R=v.barGap?v.barGap*y:v.barWidth?x/2:0,k=x+R||1;return{halfHeight:S,barWidth:x,barGap:R,barRadius:v.barRadius||0,barMinHeight:v.barMinHeight?v.barMinHeight*y:0,barIndexScale:p>0?h/k/p:0,barSpacing:k}}({width:o,height:a,length:(e[0]||[]).length,options:t,pixelRatio:this.getPixelRatio()}),f=function({channelData:h,barIndexScale:g,barSpacing:p,barWidth:v,halfHeight:y,vScale:S,canvasHeight:x,barAlign:R,barMinHeight:k}){const C=h[0]||[],b=h[1]||C,z=C.length,E=[];let I=0,O=0,q=0;for(let L=0;L<=z;L++){const ee=Math.round(L*g);if(ee>I){const{topHeight:fn,totalHeight:ut}=xn({maxTop:O,maxBottom:q,halfHeight:y,vScale:S,barMinHeight:k,barAlign:R}),gn=En({barAlign:R,halfHeight:y,topHeight:fn,totalHeight:ut,canvasHeight:x});E.push({x:I*p,y:gn,width:v,height:ut}),I=ee,O=0,q=0}const ct=Math.abs(C[L]||0),dt=Math.abs(b[L]||0);ct>O&&(O=ct),dt>q&&(q=dt)}return E}({channelData:e,barIndexScale:u,barSpacing:m,barWidth:c,halfHeight:l,vScale:r,canvasHeight:a,barAlign:t.barAlign,barMinHeight:d});n.beginPath();for(const h of f)s&&"roundRect"in n?n.roundRect(h.x,h.y,h.width,h.height,s):n.rect(h.x,h.y,h.width,h.height);n.fill(),n.closePath()}renderLineWaveform(e,t,n,r){const{width:o,height:a}=n.canvas,l=function({channelData:c,width:s,height:u,vScale:m}){const d=u/2,f=c[0]||[];return[f,c[1]||f].map((h,g)=>{const p=h.length,v=p?s/p:0,y=d,S=g===0?-1:1,x=[{x:0,y}];let R=0,k=0;for(let C=0;C<=p;C++){const b=Math.round(C*v);if(b>R){const E=y+(Math.round(k*d*m)||1)*S;x.push({x:R,y:E}),R=b,k=0}const z=Math.abs(h[C]||0);z>k&&(k=z)}return x.push({x:R,y}),x})}({channelData:e,width:o,height:a,vScale:r});n.beginPath();for(const c of l)if(c.length){n.moveTo(c[0].x,c[0].y);for(let s=1;s<c.length;s++){const u=c[s];n.lineTo(u.x,u.y)}}n.fill(),n.closePath()}renderWaveform(e,t,n){if(n.fillStyle=this.convertColorValues(t.waveColor,n),t.renderFunction)return void t.renderFunction(e,n);const r=function({channelData:o,barHeight:a,normalize:l,maxPeak:c}){var s;const u=a||1;if(!l)return u;const m=o[0];if(!m||m.length===0)return u;let d=c??0;if(!c)for(let f=0;f<m.length;f++){const h=(s=m[f])!==null&&s!==void 0?s:0,g=Math.abs(h);g>d&&(d=g)}return d?u/d:u}({channelData:e,barHeight:t.barHeight,normalize:t.normalize,maxPeak:t.maxPeak});$t(t)?this.renderBarWaveform(e,t,n,r):this.renderLineWaveform(e,t,n,r)}renderSingleCanvas(e,t,n,r,o,a,l){const c=this.getPixelRatio(),s=document.createElement("canvas");s.width=Math.round(n*c),s.height=Math.round(r*c),s.style.width=`${n}px`,s.style.height=`${r}px`,s.style.left=`${Math.round(o)}px`,a.appendChild(s);const u=s.getContext("2d");if(t.renderFunction?(u.fillStyle=this.convertColorValues(t.waveColor,u),t.renderFunction(e,u)):this.renderWaveform(e,t,u),s.width>0&&s.height>0){const m=s.cloneNode(),d=m.getContext("2d");d.drawImage(s,0,0),d.globalCompositeOperation="source-in",d.fillStyle=this.convertColorValues(t.progressColor,d),d.fillRect(0,0,s.width,s.height),l.appendChild(m)}}renderMultiCanvas(e,t,n,r,o,a){const l=this.getPixelRatio(),{clientWidth:c}=this.scrollContainer,s=n/l,u=function({clientWidth:h,totalWidth:g,options:p}){return mt(Math.min(8e3,h,g),p)}({clientWidth:c,totalWidth:s,options:t});let m={};if(u===0)return;const d=h=>{if(h<0||h>=f||m[h])return;m[h]=!0;const g=h*u;let p=Math.min(s-g,u);if(p=mt(p,t),p<=0)return;const v=function({channelData:y,offset:S,clampedWidth:x,totalWidth:R}){return y.map(k=>{const C=Math.floor(S/R*k.length),b=Math.floor((S+x)/R*k.length);return k.slice(C,b)})}({channelData:e,offset:g,clampedWidth:p,totalWidth:s});this.renderSingleCanvas(v,t,p,r,g,o,a)},f=Math.ceil(s/u);if(!this.isScrollable){for(let h=0;h<f;h++)d(h);return}if(ft({scrollLeft:this.scrollContainer.scrollLeft,totalWidth:s,numCanvases:f}).forEach(h=>d(h)),f>1){const h=this.on("scroll",()=>{const{scrollLeft:g}=this.scrollContainer;Object.keys(m).length>10&&(o.innerHTML="",a.innerHTML="",m={}),ft({scrollLeft:g,totalWidth:s,numCanvases:f}).forEach(p=>d(p))});this.unsubscribeOnScroll.push(h)}}renderChannel(e,t,n,r){var{overlay:o}=t,a=function(u,m){var d={};for(var f in u)Object.prototype.hasOwnProperty.call(u,f)&&m.indexOf(f)<0&&(d[f]=u[f]);if(u!=null&&typeof Object.getOwnPropertySymbols=="function"){var h=0;for(f=Object.getOwnPropertySymbols(u);h<f.length;h++)m.indexOf(f[h])<0&&Object.prototype.propertyIsEnumerable.call(u,f[h])&&(d[f[h]]=u[f[h]])}return d}(t,["overlay"]);const l=document.createElement("div"),c=this.getHeight(a.height,a.splitChannels);l.style.height=`${c}px`,o&&r>0&&(l.style.marginTop=`-${c}px`),this.canvasWrapper.style.minHeight=`${c}px`,this.canvasWrapper.appendChild(l);const s=l.cloneNode();this.progressWrapper.appendChild(s),this.renderMultiCanvas(e,a,n,c,l,s)}render(e){return A(this,void 0,void 0,function*(){var t;this.timeouts.forEach(s=>s()),this.timeouts=[],this.unsubscribeOnScroll.forEach(s=>s()),this.unsubscribeOnScroll=[],this.canvasWrapper.innerHTML="",this.progressWrapper.innerHTML="",this.options.width!=null&&(this.scrollContainer.style.width=typeof this.options.width=="number"?`${this.options.width}px`:this.options.width);const n=this.getPixelRatio(),r=this.scrollContainer.clientWidth-this.containerInlinePadding,{scrollWidth:o,isScrollable:a,useParentWidth:l,width:c}=function({duration:s,minPxPerSec:u=0,parentWidth:m,fillParent:d,pixelRatio:f}){const h=Math.ceil(s*u),g=h>m,p=!!(d&&!g);return{scrollWidth:h,isScrollable:g,useParentWidth:p,width:(p?m:h)*f}}({duration:e.duration,minPxPerSec:this.options.minPxPerSec||0,parentWidth:r,fillParent:this.options.fillParent,pixelRatio:n});if(this.isScrollable=a,this.wrapper.style.width=l?"100%":`${o}px`,this.scrollContainer.style.overflowX=this.isScrollable?"auto":"hidden",this.scrollContainer.classList.toggle("noScrollbar",!!this.options.hideScrollbar),this.cursor.style.backgroundColor=`${this.options.cursorColor||this.options.progressColor}`,this.cursor.style.width=`${this.options.cursorWidth}px`,this.audioData=e,this.emit("render"),this.options.splitChannels)for(let s=0;s<e.numberOfChannels;s++){const u=Object.assign(Object.assign({},this.options),(t=this.options.splitChannels)===null||t===void 0?void 0:t[s]);this.renderChannel([e.getChannelData(s)],u,c,s)}else{const s=[e.getChannelData(0)];e.numberOfChannels>1&&s.push(e.getChannelData(1)),this.renderChannel(s,this.options,c,0)}Promise.resolve().then(()=>this.emit("rendered"))})}reRender(){if(this.unsubscribeOnScroll.forEach(n=>n()),this.unsubscribeOnScroll=[],!this.audioData)return;const{scrollWidth:e}=this.scrollContainer,{right:t}=this.progressWrapper.getBoundingClientRect();if(this.render(this.audioData),!this.isScrollable&&this.scrollContainer.scrollLeft)this.scrollContainer.scrollLeft=0;else if(this.isScrollable&&e!==this.scrollContainer.scrollWidth){const{right:n}=this.progressWrapper.getBoundingClientRect(),r=function(o){const a=2*o;return(a<0?Math.floor(a):Math.ceil(a))/2}(n-t);this.scrollContainer.scrollLeft+=r}}zoom(e){this.options.minPxPerSec=e,this.reRender()}scrollIntoView(e,t=!1){var n;const{scrollLeft:r,scrollWidth:o,clientWidth:a}=this.scrollContainer,l=e*o,c=r,s=r+a,u=a/2;if(this.isDragging)l+30>s?this.scrollContainer.scrollLeft+=30:l-30<c&&(this.scrollContainer.scrollLeft-=30);else{(l<c||l>s)&&(this.scrollContainer.scrollLeft=l-(this.options.autoCenter?u:0));const m=l-r-u;if(t&&this.options.autoCenter&&m>0){const d=(n=this.audioData)===null||n===void 0?void 0:n.duration;if(d===void 0||d<=0)return void(this.scrollContainer.scrollLeft+=m);const f=o/d;this.scrollContainer.scrollLeft+=f<=600?Math.min(m,10):m}}}renderProgress(e,t){if(isNaN(e))return;const n=100*e;this.canvasWrapper.style.clipPath=`polygon(${n}% 0%, 100% 0%, 100% 100%, ${n}% 100%)`,this.progressWrapper.style.width=`${n}%`,this.cursor.style.left=`${n}%`,this.cursor.style.transform=this.options.cursorWidth?`translateX(-${e*this.options.cursorWidth}px)`:"",this.isScrollable&&this.options.autoScroll&&this.audioData&&this.audioData.duration>0&&this.scrollIntoView(e,t)}exportImage(e,t,n){return A(this,void 0,void 0,function*(){const r=this.canvasWrapper.querySelectorAll("canvas");if(!r.length)throw new Error("No waveform data");if(n==="dataURL"){const o=Array.from(r).map(a=>a.toDataURL(e,t));return Promise.resolve(o)}return Promise.all(Array.from(r).map(o=>new Promise((a,l)=>{o.toBlob(c=>{c?a(c):l(new Error("Could not export image"))},e,t)})))})}}class kn extends xe{constructor(){super(...arguments),this.animationFrameId=null,this.isRunning=!1}start(){if(this.isRunning)return;this.isRunning=!0;const e=()=>{this.isRunning&&(this.emit("tick"),this.animationFrameId=requestAnimationFrame(e))};e()}stop(){this.isRunning=!1,this.animationFrameId!==null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null)}destroy(){this.stop(),this.unAll()}}class qe extends xe{constructor(e){super(),this.bufferNode=null,this.playStartTime=0,this.playbackPosition=0,this._muted=!1,this._playbackRate=1,this._duration=void 0,this.buffer=null,this.currentSrc="",this.paused=!0,this.crossOrigin=null,this.seeking=!1,this.autoplay=!1,this.addEventListener=this.on,this.removeEventListener=this.un,this._destroyed=!1,function(){const t=globalThis.navigator;if(t!=null&&t.audioSession)try{t.audioSession.type="playback"}catch(n){console.warn("Setting navigator.audioSession.type failed:",n)}}(),this.audioContext=e||new AudioContext,this.gainNode=this.audioContext.createGain(),this.gainNode.connect(this.audioContext.destination)}load(){return A(this,void 0,void 0,function*(){})}remove(){this.destroy()}destroy(){if(!this._destroyed){if(this._destroyed=!0,this.currentSrc="",this.bufferNode){this.bufferNode.onended=null;try{this.bufferNode.stop()}catch{}this.bufferNode.disconnect(),this.bufferNode=null}this.gainNode.disconnect(),typeof this.audioContext.close=="function"&&Promise.resolve(this.audioContext.close.call(this.audioContext)).catch(()=>{}),this.buffer=null,this.unAll()}}get src(){return this.currentSrc}set src(e){if(this.currentSrc=e,this._duration=void 0,!e)return this.buffer=null,void this.emit("emptied");fetch(e).then(t=>{if(t.status>=400)throw new Error(`Failed to fetch ${e}: ${t.status} (${t.statusText})`);return t.arrayBuffer()}).then(t=>this.currentSrc!==e?null:this.audioContext.decodeAudioData(t)).then(t=>{this.currentSrc===e&&(this.buffer=t,this.emit("loadedmetadata"),this.emit("canplay"),this.autoplay&&this.play())}).catch(t=>{console.error("WebAudioPlayer load error:",t)})}_play(){if(!this.paused)return;this.paused=!1,this.bufferNode&&(this.bufferNode.onended=null,this.bufferNode.disconnect()),this.bufferNode=this.audioContext.createBufferSource(),this.buffer&&(this.bufferNode.buffer=this.buffer),this.bufferNode.playbackRate.value=this._playbackRate,this.bufferNode.connect(this.gainNode);let e=this.playbackPosition;(e>=this.duration||e<0)&&(e=0,this.playbackPosition=0),this.bufferNode.start(this.audioContext.currentTime,e),this.playStartTime=this.audioContext.currentTime,this.bufferNode.onended=()=>{!this.paused&&this.duration-this.currentTime<.01&&(this.pause(),this.emit("ended"))}}_pause(){if(this.paused=!0,this.bufferNode){this.bufferNode.onended=null;try{this.bufferNode.stop()}catch{}}this.playbackPosition+=(this.audioContext.currentTime-this.playStartTime)*this._playbackRate}play(){return A(this,void 0,void 0,function*(){this.paused&&(this._play(),this.emit("play"))})}pause(){this.paused||(this._pause(),this.emit("pause"))}stopAt(e){const t=(e-this.currentTime)/this._playbackRate,n=this.bufferNode;n==null||n.stop(this.audioContext.currentTime+t),n==null||n.addEventListener("ended",()=>{n===this.bufferNode&&(this.bufferNode=null,this.pause(),this.playbackPosition=Math.min(e,this.duration),this.emit("timeupdate"))},{once:!0})}setSinkId(e){return A(this,void 0,void 0,function*(){return this.audioContext.setSinkId(e)})}get playbackRate(){return this._playbackRate}set playbackRate(e){const t=!this.paused;t&&this._pause(),this._playbackRate=e,t&&this._play(),this.bufferNode&&(this.bufferNode.playbackRate.value=e)}get currentTime(){return this.paused?this.playbackPosition:this.playbackPosition+(this.audioContext.currentTime-this.playStartTime)*this._playbackRate}set currentTime(e){const t=!this.paused;t&&this._pause(),this.playbackPosition=e,t&&this._play(),this.emit("seeking"),this.emit("timeupdate")}get duration(){var e,t;return(e=this._duration)!==null&&e!==void 0?e:((t=this.buffer)===null||t===void 0?void 0:t.duration)||0}set duration(e){this._duration=e}get volume(){return this.gainNode.gain.value}set volume(e){this.gainNode.gain.value=e,this.emit("volumechange")}get muted(){return this._muted}set muted(e){this._muted!==e&&(this._muted=e,this._muted?this.gainNode.disconnect():this.gainNode.connect(this.audioContext.destination))}canPlayType(e){return/^(audio|video)\//.test(e)}getGainNode(){return this.gainNode}getChannelData(){const e=[];if(!this.buffer)return e;const t=this.buffer.numberOfChannels;for(let n=0;n<t;n++)e.push(this.buffer.getChannelData(n));return e}removeAttribute(e){switch(e){case"src":this.src="";break;case"playbackRate":this.playbackRate=0;break;case"currentTime":this.currentTime=0;break;case"duration":this.duration=0;break;case"volume":this.volume=0;break;case"muted":this.muted=!1}}}const Ln={waveColor:"#999",progressColor:"#555",cursorWidth:1,minPxPerSec:0,fillParent:!0,interact:!0,dragToSeek:!1,autoScroll:!0,autoCenter:!0,sampleRate:8e3};class ye extends yn{static create(e){return new ye(e)}getState(){return this.wavesurferState}getRenderer(){return this.renderer}constructor(e){const t=e.media||(e.backend==="WebAudio"?new qe:void 0);super({media:t,mediaControls:e.mediaControls,autoplay:e.autoplay,playbackRate:e.audioRate}),this.plugins=[],this.decodedData=null,this.stopAtPosition=null,this.subscriptions=[],this.mediaSubscriptions=[],this.abortController=null,this._isDestroyed=!1,this._loadVersion=0,this.reactiveCleanups=[],this.options=Object.assign({},Ln,e);const{state:n,actions:r}=function(l){var c,s,u,m,d,f;const h=(c=l==null?void 0:l.currentTime)!==null&&c!==void 0?c:M(0),g=(s=l==null?void 0:l.duration)!==null&&s!==void 0?s:M(0),p=(u=l==null?void 0:l.isPlaying)!==null&&u!==void 0?u:M(!1),v=(m=l==null?void 0:l.isSeeking)!==null&&m!==void 0?m:M(!1),y=(d=l==null?void 0:l.volume)!==null&&d!==void 0?d:M(1),S=(f=l==null?void 0:l.playbackRate)!==null&&f!==void 0?f:M(1),x=M(null),R=M(null),k=M(""),C=M(0),b=M(0),z=re(()=>!p.value,[p]),E=re(()=>x.value!==null,[x]),I=re(()=>E.value&&g.value>0,[E,g]),O=re(()=>h.value,[h]),q=re(()=>g.value>0?h.value/g.value:0,[h,g]);return{state:{currentTime:h,duration:g,isPlaying:p,isPaused:z,isSeeking:v,volume:y,playbackRate:S,audioBuffer:x,peaks:R,url:k,zoom:C,scrollPosition:b,canPlay:E,isReady:I,progress:O,progressPercent:q},actions:{setCurrentTime:L=>{const ee=Math.max(0,Math.min(g.value||1/0,L));h.set(ee)},setDuration:L=>{g.set(Math.max(0,L))},setPlaying:L=>{p.set(L)},setSeeking:L=>{v.set(L)},setVolume:L=>{const ee=Math.max(0,Math.min(1,L));y.set(ee)},setPlaybackRate:L=>{const ee=Math.max(.1,Math.min(16,L));S.set(ee)},setAudioBuffer:L=>{x.set(L),L&&g.set(L.duration)},setPeaks:L=>{R.set(L)},setUrl:L=>{k.set(L)},setZoom:L=>{C.set(Math.max(0,L))},setScrollPosition:L=>{b.set(Math.max(0,L))}}}}({isPlaying:this.isPlayingSignal,currentTime:this.currentTimeSignal,duration:this.durationSignal,volume:this.volumeSignal,playbackRate:this.playbackRateSignal,isSeeking:this.seekingSignal});this.wavesurferState=n,this.wavesurferActions=r,this.timer=new kn;const o=t?void 0:this.getMediaElement();this.renderer=new Cn(this.options,o),this.initPlayerEvents(),this.initRendererEvents(),this.initTimerEvents(),this.initReactiveState(),this.initPlugins();const a=this.options.url||this.getSrc()||"";Promise.resolve().then(()=>{this.emit("init");const{peaks:l,duration:c}=this.options;(a||l&&c)&&this.load(a,l,c).catch(()=>{})})}updateProgress(e=this.getCurrentTime()){return this.renderer.renderProgress(e/this.getDuration(),this.isPlaying()),e}initTimerEvents(){this.subscriptions.push(this.timer.on("tick",()=>{if(!this.isSeeking()){const e=this.updateProgress();if(this.emit("timeupdate",e),this.emit("audioprocess",e),this.stopAtPosition!=null&&this.isPlaying()&&e>=this.stopAtPosition){const t=this.stopAtPosition;this.pause(),this.setTime(t)}}}))}initReactiveState(){this.reactiveCleanups.push(function(e,t){const n=[];n.push(K(()=>{const a=e.isPlaying.value;t.emit(a?"play":"pause")},[e.isPlaying])),n.push(K(()=>{const a=e.currentTime.value;t.emit("timeupdate",a),e.isPlaying.value&&t.emit("audioprocess",a)},[e.currentTime,e.isPlaying])),n.push(K(()=>{e.isSeeking.value&&t.emit("seeking",e.currentTime.value)},[e.isSeeking,e.currentTime]));let r=!1;n.push(K(()=>{e.isReady.value&&!r&&(r=!0,t.emit("ready",e.duration.value))},[e.isReady,e.duration])),n.push(K(()=>{e.audioBuffer.value===null&&(r=!1)},[e.audioBuffer]));let o=!1;return n.push(K(()=>{const a=e.isPlaying.value,l=e.currentTime.value,c=e.duration.value,s=c>0&&l>=c;o&&!a&&s&&t.emit("finish"),o=a&&s},[e.isPlaying,e.currentTime,e.duration])),n.push(K(()=>{const a=e.zoom.value;a>0&&t.emit("zoom",a)},[e.zoom])),()=>{n.forEach(a=>a())}}(this.wavesurferState,{emit:this.emit.bind(this)}))}initPlayerEvents(){this.isPlaying()&&(this.emit("play"),this.timer.start()),this.mediaSubscriptions.push(this.onMediaEvent("timeupdate",()=>{const e=this.updateProgress();this.emit("timeupdate",e)}),this.onMediaEvent("play",()=>{this.emit("play"),this.timer.start()}),this.onMediaEvent("pause",()=>{this.emit("pause"),this.timer.stop(),this.stopAtPosition=null}),this.onMediaEvent("emptied",()=>{this.timer.stop(),this.stopAtPosition=null}),this.onMediaEvent("ended",()=>{this.emit("timeupdate",this.getDuration()),this.emit("finish"),this.stopAtPosition=null}),this.onMediaEvent("seeking",()=>{this.emit("seeking",this.getCurrentTime())}),this.onMediaEvent("error",()=>{var e;this.emit("error",(e=this.getMediaElement().error)!==null&&e!==void 0?e:new Error("Media error")),this.stopAtPosition=null}))}initRendererEvents(){this.subscriptions.push(this.renderer.on("click",(e,t)=>{this.options.interact&&(this.seekTo(e),this.emit("interaction",e*this.getDuration()),this.emit("click",e,t))}),this.renderer.on("dblclick",(e,t)=>{this.emit("dblclick",e,t)}),this.renderer.on("scroll",(e,t,n,r)=>{const o=this.getDuration();this.emit("scroll",e*o,t*o,n,r)}),this.renderer.on("render",()=>{this.emit("redraw")}),this.renderer.on("rendered",()=>{this.emit("redrawcomplete")}),this.renderer.on("dragstart",e=>{this.emit("dragstart",e)}),this.renderer.on("dragend",e=>{this.emit("dragend",e)}),this.renderer.on("resize",()=>{this.emit("resize")}));{let e;const t=this.renderer.on("drag",n=>{var r;if(!this.options.interact)return;this.renderer.renderProgress(n),clearTimeout(e);let o=0;const a=this.options.dragToSeek;this.isPlaying()?o=0:a===!0?o=200:a&&typeof a=="object"&&(o=(r=a.debounceTime)!==null&&r!==void 0?r:200),e=setTimeout(()=>{this.seekTo(n)},o),this.emit("interaction",n*this.getDuration()),this.emit("drag",n)});this.subscriptions.push(()=>{clearTimeout(e),t()})}}initPlugins(){var e;!((e=this.options.plugins)===null||e===void 0)&&e.length&&this.options.plugins.forEach(t=>{this.registerPlugin(t)})}unsubscribePlayerEvents(){this.mediaSubscriptions.forEach(e=>e()),this.mediaSubscriptions=[]}setOptions(e){this.options=Object.assign({},this.options,e),e.duration&&!e.peaks&&(this.decodedData=Ce.createBuffer(this.exportPeaks(),e.duration)),e.peaks&&e.duration&&(this.decodedData=Ce.createBuffer(e.peaks,e.duration)),this.renderer.setOptions(this.options),e.audioRate&&this.setPlaybackRate(e.audioRate),e.mediaControls!=null&&(this.getMediaElement().controls=e.mediaControls)}registerPlugin(e){if(this.plugins.includes(e))return e;e._init(this),this.plugins.push(e);const t=e.once("destroy",()=>{this.plugins=this.plugins.filter(n=>n!==e),this.subscriptions=this.subscriptions.filter(n=>n!==t)});return this.subscriptions.push(t),e}unregisterPlugin(e){this.plugins=this.plugins.filter(t=>t!==e),e.destroy()}getWrapper(){return this.renderer.getWrapper()}getWidth(){return this.renderer.getWidth()}getScroll(){return this.renderer.getScroll()}setScroll(e){return this.renderer.setScroll(e)}setScrollTime(e){const t=e/this.getDuration();this.renderer.setScrollPercentage(t)}getActivePlugins(){return this.plugins}loadAudio(e,t,n,r){return A(this,void 0,void 0,function*(){var o;const a=++this._loadVersion;if(this._isDestroyed=!1,this.emit("load",e),!this.options.media&&this.isPlaying()&&this.pause(),this.decodedData=null,this.stopAtPosition=null,(o=this.abortController)===null||o===void 0||o.abort(),this.abortController=null,!t&&!n){const c=this.options.fetchParams||{};window.AbortController&&!c.signal&&(this.abortController=new AbortController,c.signal=this.abortController.signal);const s=m=>this.emit("loading",m);if(t=yield bn.fetchBlob(e,s,c),this._isDestroyed||a!==this._loadVersion)return;const u=this.options.blobMimeType;u&&(t=new Blob([t],{type:u}))}if(this._isDestroyed||a!==this._loadVersion)return;this.setSrc(e,t);const l=yield new Promise(c=>{const s=r||this.getDuration();s?c(s):this.mediaSubscriptions.push(this.onMediaEvent("loadedmetadata",()=>c(this.getDuration()),{once:!0}))});if(!this._isDestroyed&&a===this._loadVersion){if(!e&&!t){const c=this.getMediaElement();c instanceof qe&&(c.duration=l)}if(n)this.decodedData=Ce.createBuffer(n,l||0);else if(t){const c=yield t.arrayBuffer();if(this._isDestroyed||a!==this._loadVersion)return;this.decodedData=yield Ce.decode(c,this.options.sampleRate)}this._isDestroyed||a!==this._loadVersion||(this.decodedData&&(this.emit("decode",this.getDuration()),this.renderer.render(this.decodedData)),this.emit("ready",this.getDuration()))}})}load(e,t,n){return A(this,void 0,void 0,function*(){try{return yield this.loadAudio(e,void 0,t,n)}catch(r){throw this.emit("error",r),r}})}loadBlob(e,t,n){return A(this,void 0,void 0,function*(){try{return yield this.loadAudio("",e,t,n)}catch(r){throw this.emit("error",r),r}})}zoom(e){if(!this.decodedData)throw new Error("No audio loaded");this.renderer.zoom(e),this.emit("zoom",e)}getDecodedData(){return this.decodedData}exportPeaks({channels:e=2,maxLength:t=8e3,precision:n=1e4}={}){if(!this.decodedData)throw new Error("The audio has not been decoded yet");const r=Math.min(e,this.decodedData.numberOfChannels),o=[];for(let a=0;a<r;a++){const l=this.decodedData.getChannelData(a),c=[],s=l.length/t;for(let u=0;u<t;u++){const m=l.slice(Math.floor(u*s),Math.ceil((u+1)*s));let d=0;for(let f=0;f<m.length;f++){const h=m[f];Math.abs(h)>Math.abs(d)&&(d=h)}c.push(Math.round(d*n)/n)}o.push(c)}return o}getDuration(){let e=super.getDuration()||0;return e!==0&&e!==1/0||!this.decodedData||(e=this.decodedData.duration),e}toggleInteraction(e){this.options.interact=e}setTime(e){this.stopAtPosition=null,super.setTime(e),this.updateProgress(e),this.emit("timeupdate",e)}seekTo(e){const t=this.getDuration()*e;this.setTime(t)}play(e,t){const n=Object.create(null,{play:{get:()=>super.play}});return A(this,void 0,void 0,function*(){e!=null&&this.setTime(e);const r=yield n.play.call(this);return t!=null&&(this.media instanceof qe?this.media.stopAt(t):this.stopAtPosition=t),r})}playPause(){return A(this,void 0,void 0,function*(){return this.isPlaying()?this.pause():this.play()})}stop(){this.pause(),this.setTime(0)}skip(e){this.setTime(this.getCurrentTime()+e)}empty(){this.load("",[[0]],.001)}setMediaElement(e){this.unsubscribePlayerEvents(),super.setMediaElement(e),this.initPlayerEvents()}exportImage(){return A(this,arguments,void 0,function*(e="image/png",t=1,n="dataURL"){return this.renderer.exportImage(e,t,n)})}destroy(){var e;this._isDestroyed=!0,this.emit("destroy"),(e=this.abortController)===null||e===void 0||e.abort(),this.plugins.forEach(t=>t.destroy()),this.subscriptions.forEach(t=>t()),this.unsubscribePlayerEvents(),this.reactiveCleanups.forEach(t=>t()),this.reactiveCleanups=[],this.timer.destroy(),this.renderer.destroy(),super.destroy()}}ye.BasePlugin=class extends xe{constructor(i){super(),this.subscriptions=[],this.isDestroyed=!1,this.options=i}onInit(){}_init(i){this.isDestroyed&&(this.subscriptions=[],this.isDestroyed=!1),this.wavesurfer=i,this.onInit()}destroy(){this.emit("destroy"),this.subscriptions.forEach(i=>i()),this.subscriptions=[],this.isDestroyed=!0,this.wavesurfer=void 0}},ye.dom=vn;class jt{constructor(){this.listeners={}}on(e,t,n){if(this.listeners[e]||(this.listeners[e]=new Set),n==null?void 0:n.once){const r=(...o)=>{this.un(e,r),t(...o)};return this.listeners[e].add(r),()=>this.un(e,r)}return this.listeners[e].add(t),()=>this.un(e,t)}un(e,t){var n;(n=this.listeners[e])===null||n===void 0||n.delete(t)}once(e,t){return this.on(e,t,{once:!0})}unAll(){this.listeners={}}emit(e,...t){this.listeners[e]&&this.listeners[e].forEach(n=>n(...t))}}class Sn extends jt{constructor(e){super(),this.subscriptions=[],this.isDestroyed=!1,this.options=e}onInit(){}_init(e){this.isDestroyed&&(this.subscriptions=[],this.isDestroyed=!1),this.wavesurfer=e,this.onInit()}destroy(){this.emit("destroy"),this.subscriptions.forEach(e=>e()),this.subscriptions=[],this.isDestroyed=!0,this.wavesurfer=void 0}}function Vt(i,e){const t=e.xmlns?document.createElementNS(e.xmlns,i):document.createElement(i);for(const[n,r]of Object.entries(e))if(n==="children"&&r)for(const[o,a]of Object.entries(r))a instanceof Node?t.appendChild(a):typeof a=="string"?t.appendChild(document.createTextNode(a)):t.appendChild(Vt(o,a));else n==="style"?Object.assign(t.style,r):n==="textContent"?t.textContent=r:t.setAttribute(n,r.toString());return t}function ve(i,e,t){const n=Vt(i,e||{});return t==null||t.appendChild(n),n}function Xt(i){let e=i;const t=new Set;return{get value(){return e},set(n){Object.is(e,n)||(e=n,t.forEach(r=>r(e)))},update(n){this.set(n(e))},subscribe:n=>(t.add(n),()=>t.delete(n))}}function Re(i,e){let t;const n=()=>{t&&(t(),t=void 0),t=i()},r=e.map(o=>o.subscribe(n));return n(),()=>{t&&(t(),t=void 0),r.forEach(o=>o())}}function de(i,e){const t=Xt(null),n=r=>{t.set(r)};return i.addEventListener(e,n),t._cleanup=()=>{i.removeEventListener(e,n)},t}function ie(i){const e=i._cleanup;typeof e=="function"&&e()}function De(i,e={}){const{threshold:t=3,mouseButton:n=0,touchDelay:r=100}=e,o=Xt(null),a=new Map,l=matchMedia("(pointer: coarse)").matches;let c=()=>{};const s=u=>{if(u.button!==n||a.has(u.pointerId)||(a.set(u.pointerId,u),a.size>1))return;const m=u.pointerId;let d=u.clientX,f=u.clientY,h=!1;const g=Date.now(),p=i.getBoundingClientRect(),{left:v,top:y}=p,S=b=>{if(b.pointerId!==m||b.defaultPrevented||a.size>1||l&&Date.now()-g<r)return;const z=b.clientX,E=b.clientY,I=z-d,O=E-f;(h||Math.abs(I)>t||Math.abs(O)>t)&&(b.preventDefault(),b.stopPropagation(),h||(o.set({type:"start",x:d-v,y:f-y}),h=!0),o.set({type:"move",x:z-v,y:E-y,deltaX:I,deltaY:O}),d=z,f=E)},x=b=>{if(a.delete(b.pointerId)){if(b.pointerId===m&&h){const z=b.clientX,E=b.clientY;o.set({type:"end",x:z-v,y:E-y})}a.size===0&&c()}},R=b=>{b.relatedTarget&&b.relatedTarget!==document.documentElement||x(b)},k=b=>{h&&(b.stopPropagation(),b.preventDefault())},C=b=>{b.defaultPrevented||a.size>1||h&&b.preventDefault()};document.addEventListener("pointermove",S),document.addEventListener("pointerup",x),document.addEventListener("pointerout",R),document.addEventListener("pointercancel",R),document.addEventListener("touchmove",C,{passive:!1}),document.addEventListener("click",k,{capture:!0}),c=()=>{document.removeEventListener("pointermove",S),document.removeEventListener("pointerup",x),document.removeEventListener("pointerout",R),document.removeEventListener("pointercancel",R),document.removeEventListener("touchmove",C),setTimeout(()=>{document.removeEventListener("click",k,{capture:!0})},10)}};return i.addEventListener("pointerdown",s),{signal:o,cleanup:()=>{c(),i.removeEventListener("pointerdown",s),a.clear(),ie(o)}}}class gt extends jt{constructor(e,t,n=0){var r,o,a,l,c,s,u,m,d,f;super(),this.totalDuration=t,this.numberOfChannels=n,this.element=null,this.minLength=0,this.maxLength=1/0,this.contentEditable=!1,this.subscriptions=[],this.updatingSide=void 0,this.isRemoved=!1,this.subscriptions=[],this.id=e.id||`region-${Math.random().toString(32).slice(2)}`,this.start=this.clampPosition(e.start),this.end=this.clampPosition((r=e.end)!==null&&r!==void 0?r:e.start),this.drag=(o=e.drag)===null||o===void 0||o,this.resize=(a=e.resize)===null||a===void 0||a,this.resizeStart=(l=e.resizeStart)===null||l===void 0||l,this.resizeEnd=(c=e.resizeEnd)===null||c===void 0||c,this.color=(s=e.color)!==null&&s!==void 0?s:"rgba(0, 0, 0, 0.1)",this.minLength=(u=e.minLength)!==null&&u!==void 0?u:this.minLength,this.maxLength=(m=e.maxLength)!==null&&m!==void 0?m:this.maxLength,this.channelIdx=(d=e.channelIdx)!==null&&d!==void 0?d:-1,this.contentEditable=(f=e.contentEditable)!==null&&f!==void 0?f:this.contentEditable,this.element=this.initElement(),this.setContent(e.content),this.setPart(),this.renderPosition(),this.initMouseEvents()}clampPosition(e){return Math.max(0,Math.min(this.totalDuration,e))}setPart(){var e;const t=this.start===this.end;(e=this.element)===null||e===void 0||e.setAttribute("part",`${t?"marker":"region"} ${this.id}`)}addResizeHandles(e){const t={position:"absolute",zIndex:"2",width:"6px",height:"100%",top:"0",cursor:"ew-resize",wordBreak:"keep-all"},n=ve("div",{part:"region-handle region-handle-left",style:Object.assign(Object.assign({},t),{left:"0",borderLeft:"2px solid rgba(0, 0, 0, 0.5)",borderRadius:"2px 0 0 2px"})},e),r=ve("div",{part:"region-handle region-handle-right",style:Object.assign(Object.assign({},t),{right:"0",borderRight:"2px solid rgba(0, 0, 0, 0.5)",borderRadius:"0 2px 2px 0"})},e),o=De(n,{threshold:1}),a=De(r,{threshold:1}),l=Re(()=>{const s=o.signal.value;s&&(s.type==="move"&&s.deltaX!==void 0?this.onResize(s.deltaX,"start"):s.type==="end"&&this.onEndResizing("start"))},[o.signal]),c=Re(()=>{const s=a.signal.value;s&&(s.type==="move"&&s.deltaX!==void 0?this.onResize(s.deltaX,"end"):s.type==="end"&&this.onEndResizing("end"))},[a.signal]);this.subscriptions.push(()=>{l(),c(),o.cleanup(),a.cleanup()})}removeResizeHandles(e){const t=e.querySelector('[part*="region-handle-left"]'),n=e.querySelector('[part*="region-handle-right"]');t&&e.removeChild(t),n&&e.removeChild(n)}initElement(){if(this.isRemoved)return null;const e=this.start===this.end;let t=0,n=100;this.channelIdx>=0&&this.numberOfChannels>0&&this.channelIdx<this.numberOfChannels&&(n=100/this.numberOfChannels,t=n*this.channelIdx);const r=ve("div",{style:{position:"absolute",top:`${t}%`,height:`${n}%`,backgroundColor:e?"none":this.color,borderLeft:e?"2px solid "+this.color:"none",borderRadius:"2px",boxSizing:"border-box",transition:"background-color 0.2s ease",cursor:this.drag?"grab":"default",pointerEvents:"all"}});return!e&&this.resize&&this.addResizeHandles(r),r}renderPosition(){if(!this.element)return;const e=this.start/this.totalDuration,t=(this.totalDuration-this.end)/this.totalDuration;this.element.style.left=100*e+"%",this.element.style.right=100*t+"%"}toggleCursor(e){var t;this.drag&&(!((t=this.element)===null||t===void 0)&&t.style)&&(this.element.style.cursor=e?"grabbing":"grab")}initMouseEvents(){const{element:e}=this;if(!e)return;const t=de(e,"click"),n=de(e,"mouseenter"),r=de(e,"mouseleave"),o=de(e,"dblclick"),a=de(e,"pointerdown"),l=de(e,"pointerup"),c=t.subscribe(p=>p&&this.emit("click",p)),s=n.subscribe(p=>p&&this.emit("over",p)),u=r.subscribe(p=>p&&this.emit("leave",p)),m=o.subscribe(p=>p&&this.emit("dblclick",p)),d=a.subscribe(p=>p&&this.toggleCursor(!0)),f=l.subscribe(p=>p&&this.toggleCursor(!1));this.subscriptions.push(()=>{c(),s(),u(),m(),d(),f(),ie(t),ie(n),ie(r),ie(o),ie(a),ie(l)});const h=De(e),g=Re(()=>{const p=h.signal.value;p&&(p.type==="start"?this.toggleCursor(!0):p.type==="move"&&p.deltaX!==void 0?this.onMove(p.deltaX):p.type==="end"&&(this.toggleCursor(!1),this.drag&&this.emit("update-end")))},[h.signal]);this.subscriptions.push(()=>{g(),h.cleanup()}),this.contentEditable&&this.content&&(this.contentClickListener=p=>this.onContentClick(p),this.contentBlurListener=()=>this.onContentBlur(),this.content.addEventListener("click",this.contentClickListener),this.content.addEventListener("blur",this.contentBlurListener))}_onUpdate(e,t,n){var r;if(!(!((r=this.element)===null||r===void 0)&&r.parentElement))return;const{width:o}=this.element.parentElement.getBoundingClientRect(),a=e/o*this.totalDuration;let l=t&&t!=="start"?this.start:this.start+a,c=t&&t!=="end"?this.end:this.end+a;const s=n!==void 0;s&&this.updatingSide&&this.updatingSide!==t&&(this.updatingSide==="start"?l=n:c=n),l=Math.max(0,l),c=Math.min(this.totalDuration,c);const u=c-l;this.updatingSide=t;const m=u>=this.minLength&&u<=this.maxLength;l<=c&&(m||s)&&(this.start=l,this.end=c,this.renderPosition(),this.emit("update",t))}onMove(e){this.drag&&this._onUpdate(e)}onResize(e,t){this.resize&&(this.resizeStart||t!=="start")&&(this.resizeEnd||t!=="end")&&this._onUpdate(e,t)}onEndResizing(e){this.resize&&(this.emit("update-end",e),this.updatingSide=void 0)}onContentClick(e){e.stopPropagation(),e.target.focus(),this.emit("click",e)}onContentBlur(){this.emit("update-end")}_setTotalDuration(e){this.totalDuration=e,this.renderPosition()}play(e){this.emit("play",e&&this.end!==this.start?this.end:void 0)}getContent(e=!1){var t;return e?this.content||void 0:this.element instanceof HTMLElement?((t=this.content)===null||t===void 0?void 0:t.innerHTML)||void 0:""}setContent(e){var t;if(this.element)if(this.content&&this.contentEditable&&(this.contentClickListener&&this.content.removeEventListener("click",this.contentClickListener),this.contentBlurListener&&this.content.removeEventListener("blur",this.contentBlurListener)),(t=this.content)===null||t===void 0||t.remove(),e){if(typeof e=="string"){const n=this.start===this.end;this.content=ve("div",{style:{padding:`0.2em ${n?.2:.4}em`,display:"inline-block"},textContent:e})}else this.content=e;this.contentEditable&&(this.content.contentEditable="true",this.contentClickListener=n=>this.onContentClick(n),this.contentBlurListener=()=>this.onContentBlur(),this.content.addEventListener("click",this.contentClickListener),this.content.addEventListener("blur",this.contentBlurListener)),this.content.setAttribute("part","region-content"),this.element.appendChild(this.content),this.emit("content-changed")}else this.content=void 0}setOptions(e){var t,n;if(this.element){if(e.color&&(this.color=e.color,this.element.style.backgroundColor=this.color),e.drag!==void 0&&(this.drag=e.drag,this.element.style.cursor=this.drag?"grab":"default"),e.start!==void 0||e.end!==void 0){const r=this.start===this.end;this.start=this.clampPosition((t=e.start)!==null&&t!==void 0?t:this.start),this.end=this.clampPosition((n=e.end)!==null&&n!==void 0?n:r?this.start:this.end),this.renderPosition(),this.setPart(),this.emit("render")}if(e.content&&this.setContent(e.content),e.id&&(this.id=e.id,this.setPart()),e.resize!==void 0&&e.resize!==this.resize){const r=this.start===this.end;this.resize=e.resize,this.resize&&!r?this.addResizeHandles(this.element):this.removeResizeHandles(this.element)}e.resizeStart!==void 0&&(this.resizeStart=e.resizeStart),e.resizeEnd!==void 0&&(this.resizeEnd=e.resizeEnd)}}remove(){this.isRemoved=!0,this.emit("remove"),this.subscriptions.forEach(e=>e()),this.subscriptions=[],this.content&&this.contentEditable&&(this.contentClickListener&&(this.content.removeEventListener("click",this.contentClickListener),this.contentClickListener=void 0),this.contentBlurListener&&(this.content.removeEventListener("blur",this.contentBlurListener),this.contentBlurListener=void 0)),this.element&&(this.element.remove(),this.element=null),this.unAll()}}class Ze extends Sn{constructor(e){super(e),this.regions=[],this.regionsContainer=this.initRegionsContainer()}static create(e){return new Ze(e)}onInit(){if(!this.wavesurfer)throw Error("WaveSurfer is not initialized");this.wavesurfer.getWrapper().appendChild(this.regionsContainer),this.subscriptions.push(this.wavesurfer.on("ready",t=>{this.regions.forEach(n=>n._setTotalDuration(t))}));let e=[];this.subscriptions.push(this.wavesurfer.on("timeupdate",t=>{const n=this.regions.filter(r=>r.start<=t&&(r.end===r.start?r.start+.05:r.end)>=t);n.forEach(r=>{e.includes(r)||this.emit("region-in",r)}),e.forEach(r=>{n.includes(r)||this.emit("region-out",r)}),e=n}))}initRegionsContainer(){return ve("div",{part:"regions-container",style:{position:"absolute",top:"0",left:"0",width:"100%",height:"100%",zIndex:"5",pointerEvents:"none"}})}getRegions(){return this.regions}avoidOverlapping(e){e.content&&!e.isRemoved&&setTimeout(()=>{if(!e.content)return;const t=e.content;t.style.marginTop="0";const n=t.getBoundingClientRect(),r=this.regions.indexOf(e);if(r<0)return;const o=this.regions.slice(0,r).filter(a=>!a.isRemoved).reduce((a,l)=>{if(l===e||!l.content)return a;const c=l.content.getBoundingClientRect();return n.left<c.right&&c.left<n.right&&a.push(c),a},[]).sort((a,l)=>a.top-l.top).reduce((a,l)=>{const c=n.top+a,s=c+n.height;return c<l.bottom&&l.top<s?l.bottom-n.top+2:a},0);t.style.marginTop=`${o}px`},10)}avoidOverlappingAll(){this.regions.forEach(e=>this.avoidOverlapping(e))}adjustScroll(e){var t,n;if(!e.element)return;const r=(n=(t=this.wavesurfer)===null||t===void 0?void 0:t.getWrapper())===null||n===void 0?void 0:n.parentElement;if(!r)return;const{clientWidth:o,scrollWidth:a}=r;if(a<=o)return;const l=r.getBoundingClientRect(),c=e.element.getBoundingClientRect(),s=c.left-l.left,u=c.right-l.left;s<0?r.scrollLeft+=s:u>o&&(r.scrollLeft+=u-o)}virtualAppend(e,t,n){const r=()=>{if(!this.wavesurfer)return;const o=this.wavesurfer.getWidth(),a=this.wavesurfer.getScroll(),l=t.clientWidth,c=this.wavesurfer.getDuration(),s=Math.round(e.start/c*l),u=s+(Math.round((e.end-e.start)/c*l)||1)>a&&s<a+o;u&&!n.parentElement?t.appendChild(n):!u&&n.parentElement&&n.remove()};setTimeout(()=>{if(!this.wavesurfer||!e.element)return;r();const o=this.wavesurfer.on("scroll",r),a=this.wavesurfer.on("zoom",r),l=this.wavesurfer.on("resize",r),c=e.on("render",r);this.subscriptions.push(o,a,l,c),e.once("remove",()=>{o(),a(),l(),c()})},0)}saveRegion(e){if(!e.element)return;this.virtualAppend(e,this.regionsContainer,e.element),this.avoidOverlapping(e),this.regions.push(e);const t=[e.on("update",n=>{n||this.adjustScroll(e),this.emit("region-update",e,n)}),e.on("update-end",n=>{this.avoidOverlappingAll(),this.emit("region-updated",e,n)}),e.on("play",n=>{var r;(r=this.wavesurfer)===null||r===void 0||r.play(e.start,n)}),e.on("click",n=>{this.emit("region-clicked",e,n)}),e.on("dblclick",n=>{this.emit("region-double-clicked",e,n)}),e.on("content-changed",()=>{this.emit("region-content-changed",e)}),e.once("remove",()=>{t.forEach(n=>n()),this.regions=this.regions.filter(n=>n!==e),this.emit("region-removed",e)})];this.subscriptions.push(...t),this.emit("region-created",e)}addRegion(e){var t,n;if(!this.wavesurfer)throw Error("WaveSurfer is not initialized");const r=this.wavesurfer.getDuration(),o=(n=(t=this.wavesurfer)===null||t===void 0?void 0:t.getDecodedData())===null||n===void 0?void 0:n.numberOfChannels,a=new gt(e,r,o);return this.emit("region-initialized",a),r?this.saveRegion(a):this.subscriptions.push(this.wavesurfer.once("ready",l=>{a._setTotalDuration(l),this.saveRegion(a)})),a}enableDragSelection(e,t=3){var n;const r=(n=this.wavesurfer)===null||n===void 0?void 0:n.getWrapper();if(!(r&&r instanceof HTMLElement))return()=>{};let o=null,a=0,l=0;const c=De(r,{threshold:t}),s=Re(()=>{var u,m;const d=c.signal.value;if(d)if(d.type==="start"){if(a=d.x,!this.wavesurfer)return;const f=this.wavesurfer.getDuration(),h=(m=(u=this.wavesurfer)===null||u===void 0?void 0:u.getDecodedData())===null||m===void 0?void 0:m.numberOfChannels,{width:g}=this.wavesurfer.getWrapper().getBoundingClientRect();l=a/g*f;const p=d.x/g*f,v=(d.x+5)/g*f;o=new gt(Object.assign(Object.assign({},e),{start:p,end:v}),f,h),this.emit("region-initialized",o),o.element&&this.regionsContainer.appendChild(o.element)}else d.type==="move"&&d.deltaX!==void 0?o&&o._onUpdate(d.deltaX,d.x>a?"end":"start",l):d.type==="end"&&o&&(this.saveRegion(o),o.updatingSide=void 0,o=null)},[c.signal]);return()=>{s(),c.cleanup()}}clearRegions(){this.regions.slice().forEach(e=>e.remove()),this.regions=[]}destroy(){this.clearRegions(),super.destroy(),this.regionsContainer.remove()}}const qt={lead:"主角",supporting:"配角",mascot:"吉祥物"},j={lead:"#3b82f6",supporting:"#64748b",mascot:"#ec4899"},vt=[{name:"迪迪",role:"lead"},{name:"克克",role:"lead"},{name:"林林",role:"lead"},{name:"泰泰",role:"lead"},{name:"怪氣流",role:"mascot"},{name:"田鼠先生",role:"mascot"},{name:"田鼠太太",role:"mascot"},{name:"吵鬧菇",role:"mascot"},{name:"穿山甲大叔",role:"supporting"},{name:"花福導遊",role:"supporting"},{name:"達東爸",role:"supporting"},{name:"達東媽",role:"supporting"},{name:"村長",role:"supporting"},{name:"卡爾博士",role:"supporting"},{name:"小達東",role:"supporting"},{name:"阿桂",role:"supporting"}];function Kt(i,e){if(!i)return null;const t=e.find(n=>n.name===i);return t?j[t.role]:null}const Jt="voicepicker.author",Gt="voicepicker.comments",Yt="voicepicker.characters";function Rn(){return localStorage.getItem(Jt)??""}function Dn(i){localStorage.setItem(Jt,i)}function Pn(i){const e=i??{};return{id:typeof e.id=="string"?e.id:Math.random().toString(36).slice(2),author:typeof e.author=="string"?e.author:"",text:typeof e.text=="string"?e.text:"",created:typeof e.created=="number"?e.created:Date.now()}}function Fe(i){const e=i??{},t=e.character;let n;Array.isArray(t)?n=t.filter(o=>typeof o=="string"):typeof t=="string"?n=[t]:n=[];const r=Array.isArray(e.replies)?e.replies.map(Pn):[];return{id:typeof e.id=="string"?e.id:Math.random().toString(36).slice(2),file:typeof e.file=="string"?e.file:"",time:typeof e.time=="number"?e.time:null,text:typeof e.text=="string"?e.text:"",author:typeof e.author=="string"?e.author:"",character:n,replies:r,rating:typeof e.rating=="number"?Math.min(5,Math.max(0,Math.round(e.rating))):0}}function Mn(){try{const i=localStorage.getItem(Gt);return i?JSON.parse(i).map(Fe):[]}catch{return[]}}function Qe(i){localStorage.setItem(Gt,JSON.stringify(i))}function Nn(){try{const i=localStorage.getItem(Yt);return i?JSON.parse(i):[...vt]}catch{return[...vt]}}function Oe(i){localStorage.setItem(Yt,JSON.stringify(i))}const Tn=`<!DOCTYPE html>
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
`,zn=`<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>VoicePicker 外部試聽版</title>
<style>
:root {
  --bg: #1e2430; --panel: #262e3d; --line: #38445a;
  --text: #e6ebf2; --muted: #8a97ad; --accent: #3b82f6; --time: #60a5fa;
  font-family: system-ui,"Microsoft JhengHei",sans-serif;
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--text); }
.hidden { display: none !important; }

/* ── 頂部播放列 ── */
#player-bar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  background: var(--panel); border-bottom: 1px solid var(--line);
  height: 52px; padding: 0 18px;
  display: flex; align-items: center; gap: 12px;
}
#bar-logo { font-size: 13px; font-weight: 700; white-space: nowrap; }
.badge-ro {
  font-size: 11px; font-weight: 500; padding: 2px 8px;
  background: #374151; border-radius: 999px; color: var(--muted);
  vertical-align: middle; margin-left: 4px;
}
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
.cplay:disabled { opacity: 0.3; cursor: default; }
.cplay:disabled:hover { background: transparent; color: var(--accent); }

/* 回覆討論串（唯讀） */
.creplies {
  border-top: 1px solid var(--line);
  margin-top: 8px; padding-top: 6px;
  display: flex; flex-direction: column; gap: 3px;
}
.creply { display: flex; align-items: flex-start; gap: 5px; font-size: 12px; padding: 2px 0; }
.crauthor { color: var(--accent); font-weight: 500; white-space: nowrap; flex-shrink: 0; }

/* ── 留言卡底色 ── */
.citem.trophy { background: rgba(245, 158, 11, 0.10); border-color: rgba(245, 158, 11, 0.40); }
.citem.bad    { background: rgba(100, 116, 139, 0.12); border-color: rgba(100, 116, 139, 0.30); color: rgba(230, 235, 242, 0.30); }

/* 篩選工具列 */
.view-title { position: sticky; top: 52px; z-index: 10; background: var(--bg); padding: 12px 0 10px; border-bottom: 1px solid var(--line); margin-bottom: 16px; }
.view-tools { display: flex; align-items: center; gap: 8px; margin-left: auto; }
.tool-btn {
  padding: 3px 10px; border: none; background: var(--line); border-radius: 4px;
  font-size: 12px; color: var(--muted); cursor: pointer;
}
.tool-btn:hover { filter: brightness(1.1); }
.tool-btn.hide { background: #78350f; color: #fde68a; }
.tool-btn.solo { background: var(--accent); color: #fff; }
</style>
</head>
<body>

<div id="player-bar">
  <span id="bar-logo">VoicePicker <span class="badge-ro">外部試聽版</span></span>
  <span id="bar-file">—</span>
  <input id="bar-seek" type="range" min="0" max="100" step="0.1" value="0">
  <span id="bar-time">0:00 / 0:00</span>
  <input id="bar-vol" type="range" min="0" max="1" step="0.01" value="0.8" title="音量">
  <span id="bar-err"></span>
</div>

<div id="main">
  <div class="view-title">
    <h2>角色 Dashboard</h2>
    <div class="view-tools">
      <button id="zeroFilterBtn" class="tool-btn">全部留言</button>
    </div>
  </div>
  <div id="roleview"></div>
</div>

<audio id="audio" preload="none"></audio>

<script>
const RAW = {{DATA_JSON}};
const AUDIO_RAW = {{AUDIO_JSON}};
const { comments, characters, roleColors } = RAW;

// ── DOM ──
const audio      = document.getElementById('audio');
const barFile    = document.getElementById('bar-file');
const barSeek    = document.getElementById('bar-seek');
const barTime    = document.getElementById('bar-time');
const barVol     = document.getElementById('bar-vol');
const barErrEl   = document.getElementById('bar-err');
const roleviewEl = document.getElementById('roleview');

// ── 狀態 ──
const blobUrls = new Map(); // filename → blob URL (lazy convert)
let loadedFile  = null;
let activeCard  = null;
let activeId    = null;
let zeroFilter  = 'all'; // 'all' | 'hide' | 'solo'

audio.volume = 0.8;

// ── Base64 → Blob URL（lazy，點播時轉換）──
function getAudioUrl(filename) {
  if (blobUrls.has(filename)) return blobUrls.get(filename);
  const dataUrl = AUDIO_RAW[filename];
  if (!dataUrl) return null;
  const [header, b64] = dataUrl.split(',');
  const mime = (header.match(/:(.*?);/) || [])[1] || 'audio/wav';
  const raw = atob(b64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  const url = URL.createObjectURL(new Blob([arr], { type: mime }));
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
  activeCard = null; activeId = null;
}
async function togglePlay(c, card) {
  if (activeId === c.id && !audio.paused) {
    audio.pause();
    card.querySelector('.cplay').textContent = '▶';
    card.querySelector('.cplay').classList.remove('active');
    return;
  }
  if (activeCard && activeCard !== card) deactivate();
  barErrEl.textContent = '';
  if (!AUDIO_RAW[c.file]) {
    barErrEl.textContent = '⚠ 此音檔未包含於分享版';
    return;
  }
  if (loadedFile !== c.file) {
    const url = getAudioUrl(c.file);
    if (!url) { barErrEl.textContent = '⚠ 無法解析：' + c.file; return; }
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
  activeCard = card; activeId = c.id;
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

// ── 篩選 ──
function applyZeroFilter(list) {
  if (zeroFilter === 'hide') return list.filter(c => (c.rating || 0) > 0);
  if (zeroFilter === 'solo') return list.filter(c => (c.rating || 0) === 0);
  return list;
}

// ── 排序 ──
function sortByRating(list) {
  return [...list].sort((a, b) =>
    ((b.rating || 0) - (a.rating || 0)) ||
    String(a.file).localeCompare(String(b.file), 'zh-Hant', { numeric: true }) ||
    ((a.time ?? -Infinity) - (b.time ?? -Infinity)));
}

// ── 建留言卡（唯讀）──
function buildCard(c, maxRating) {
  const card  = document.createElement('div');
  const isTrophy = maxRating > 0 && c.rating === maxRating;
  const ratingHighlight = isTrophy ? ' trophy' : c.rating === 0 ? ' bad' : '';
  card.className = 'citem' + ratingHighlight;
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
  if (!AUDIO_RAW[c.file]) play.disabled = true;
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
  const noneList    = applyZeroFilter(comments.filter(c => !c.character || c.character.length === 0));

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

  const totalNone = comments.filter(c => !c.character || c.character.length === 0).length;
  if (totalNone > 0) {
    const s = document.createElement('button');
    s.className = 'role-stat';
    s.style.background = '#64748b';
    s.textContent = '未指定 ' + totalNone;
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
    const maxRating = list.reduce((m, c) => Math.max(m, c.rating || 0), 0);
    sortByRating(list).forEach(c => wrap.appendChild(buildCard(c, maxRating)));
    group.appendChild(wrap);
    roleviewEl.appendChild(group);
  };

  characters.forEach(ch =>
    renderGroup(ch.name, roleColors[ch.role] || '#64748b',
      applyZeroFilter(comments.filter(c => c.character && c.character.includes(ch.name)))));
  if (noneList.length) renderGroup('__none__', '#64748b', noneList);
}

// ── 👎 篩選按鈕 ──
const ZERO_NEXT = { all: 'hide', hide: 'solo', solo: 'all' };
const ZERO_LABELS = { all: '隱藏 👎', hide: 'solo 👎', solo: '全部留言' };
const zeroFilterBtn = document.getElementById('zeroFilterBtn');
zeroFilterBtn.textContent = ZERO_LABELS[zeroFilter];
zeroFilterBtn.addEventListener('click', () => {
  zeroFilter = ZERO_NEXT[zeroFilter];
  zeroFilterBtn.className = 'tool-btn' + (zeroFilter !== 'all' ? ' ' + zeroFilter : '');
  zeroFilterBtn.textContent = ZERO_LABELS[zeroFilter];
  renderRoleView();
});

// ── 啟動 ──
renderRoleView();
<\/script>
</body>
</html>
`,On=new Set(["wav","mp3","m4a","aac","ogg","flac","wma","opus"]),bt=4,_n=1.5,An=.25,et="voicepicker.json";let T=[],V=-1,ke=null,H="single",U=0,X=null,yt,Pe,_e=null,te=Rn(),P=Mn(),N=Nn(),tt=0,ae=!0,se=[],_="text",fe=null,Y=null,Ae=null,B=[],W=0,Ee=null,Me="rating",ue=!1,J="all",oe=0;const w=i=>document.getElementById(i),xt=w("pick"),Et=w("exportBtn"),wt=w("importBtn"),Ne=w("importFile"),Ct=w("editChars"),kt=w("roleViewBtn"),Lt=w("filelist"),Zt=w("nowplaying"),nt=w("status"),Ie=w("playBtn"),In=w("appVer"),Bn=w("sidebar"),Wn=w("player"),Te=w("grid"),F=w("roleview"),Hn=w("comments"),Fn=w("commentsHead"),ze=w("commentlist"),it=w("composer"),he=w("composerToggle"),ge=w("composerText"),Qt=w("composerChars"),St=w("composerRatingEl"),$e=w("nameModal"),Be=w("nameInput"),rt=w("charModal"),Rt=w("charEditList"),Ke=w("newCharName"),$n=w("newCharRole"),en=w("addCharBtn"),Un=w("closeCharBtn"),Dt=w("ratingsBtn"),Pt=w("shareBtn"),We=w("shareModal"),jn=w("shareCancelBtn"),pe=w("shareConfirmBtn"),D=ye.create({container:"#waveform",waveColor:"#7a8ba6",progressColor:"#3b82f6",cursorColor:"#ef4444",height:120}),Je=D.registerPlugin(Ze.create());D.on("ready",()=>{nt.textContent=`${He(0)} / ${He(D.getDuration())}`});D.on("timeupdate",i=>{nt.textContent=`${He(i)} / ${He(D.getDuration())}`});D.on("play",()=>{Ie.textContent="⏸ 暫停",H==="role"&&we()});D.on("pause",()=>{Ie.textContent="▶ 播放",H==="role"&&we()});D.on("finish",()=>{H==="single"&&V<T.length-1?ne(V+1):H==="role"&&(Ee=null,we())});Je.on("region-clicked",(i,e)=>{e.stopPropagation(),D.setTime(i.start),D.play()});Ie.addEventListener("click",()=>{Ie.blur(),D.playPause()});function ot(i){if(!isFinite(i))return"0:00";const e=Math.floor(i/60),t=Math.floor(i%60).toString().padStart(2,"0");return`${e}:${t}`}function He(i){if(!isFinite(i))return"0:00.00";const e=Math.floor(i/60),t=Math.floor(i%60),n=Math.floor((i-Math.floor(i))*100);return`${e}:${t.toString().padStart(2,"0")}.${n.toString().padStart(2,"0")}`}function tn(){return Math.random().toString(36).slice(2)+Date.now().toString(36)}function Ge(i){return i.code==="Enter"||i.code==="NumpadEnter"}function at(i,e){const t=i.indexOf(e);t>=0?i.splice(t,1):i.push(e)}function me(i){return i.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}function Ue(){return V>=0&&V<T.length?T[V].name:null}function Vn(){return H==="grid"?U>=0&&U<T.length?T[U].name:null:Ue()}function st(i){return i?P.filter(e=>e.file===i).sort((e,t)=>(e.time??-1/0)-(t.time??-1/0)):[]}function nn(i){return P.filter(e=>e.file===i).length}function Xn(i){return(i.length?Kt(i[0],N):null)??"#3b82f6"}function Z(){rn(),Ve(),je(),ce(),H==="role"&&le()}function Q(){var i;ce(),H==="role"&&le(),Y&&((i=(H==="role"?F:ze).querySelector(".creply-input input"))==null||i.focus())}function rn(){Qe(P),X&&(window.clearTimeout(yt),yt=window.setTimeout(()=>void qn(),300))}async function qn(){if(X)try{const e=await(await X.getFileHandle(et,{create:!0})).createWritable();await e.write(JSON.stringify({version:1,updated:new Date().toISOString(),comments:P},null,2)),await e.close()}catch{}}function on(i){const e=new Map(P.map(t=>[t.id,t]));i.forEach(t=>e.set(t.id,t)),P=[...e.values()]}async function Kn(){if(X)try{const e=await(await X.getFileHandle(et)).getFile(),t=JSON.parse(await e.text());Array.isArray(t==null?void 0:t.comments)&&(on(t.comments.map(Fe)),Qe(P))}catch{}}function Jn(){const i=JSON.stringify({version:1,exported:new Date().toISOString(),comments:P,characters:N},null,2),e=new Blob([i],{type:"application/json"}),t=URL.createObjectURL(e),n=new Date,r=l=>String(l).padStart(2,"0"),o=`${n.getFullYear()}${r(n.getMonth()+1)}${r(n.getDate())}-${r(n.getHours())}${r(n.getMinutes())}`,a=document.createElement("a");a.href=t,a.download=`voicepicker-backup-${o}.json`,a.click(),URL.revokeObjectURL(t)}async function Gn(i){try{const e=JSON.parse(await i.text());Array.isArray(e==null?void 0:e.comments)&&on(e.comments.map(Fe)),Array.isArray(e==null?void 0:e.characters)&&e.characters.length>0&&(N=e.characters,Oe(N)),Z(),alert(`匯入完成：目前共 ${P.length} 則留言。`)}catch{alert("匯入失敗：檔案不是有效的 VoicePicker 備份。")}}Et.addEventListener("click",()=>{Et.blur(),Jn()});wt.addEventListener("click",()=>{wt.blur(),Ne.click()});Ne.addEventListener("change",()=>{var e;const i=(e=Ne.files)==null?void 0:e[0];i&&Gn(i),Ne.value=""});xt.addEventListener("click",async()=>{var e;xt.blur();const i=window.showDirectoryPicker;if(!i){alert("此瀏覽器不支援資料夾選取，請改用 Chrome / Edge。");return}try{X=await i({mode:"readwrite"})}catch{return}T=[];for await(const[t,n]of X.entries()){if(n.kind!=="file")continue;const r=((e=t.split(".").pop())==null?void 0:e.toLowerCase())??"";On.has(r)&&T.push({name:t,handle:n})}T.sort((t,n)=>t.name.localeCompare(n.name,"zh-Hant",{numeric:!0})),await Kn(),_e=Date.now(),hi(),mn(),je(),T.length>0?(U=0,ne(0)):Zt.textContent="此資料夾沒有音檔"});function je(){Lt.innerHTML="",T.forEach((i,e)=>{const t=document.createElement("li");e===V&&(t.className="active");const n=document.createElement("span");n.textContent=i.name,n.style.overflow="hidden",n.style.textOverflow="ellipsis",t.appendChild(n);const r=nn(i.name);if(r>0){const o=document.createElement("span");o.className="badge",o.textContent=String(r),t.appendChild(o)}t.addEventListener("click",()=>void ne(e)),Lt.appendChild(t)})}async function ne(i){if(i<0||i>=T.length)return;V=i,U=i,je();const e=T[i];Zt.textContent=e.name,nt.textContent="載入中…";const t=await e.handle.getFile();ke&&URL.revokeObjectURL(ke),ke=URL.createObjectURL(t),await D.load(ke),Ve(),ce(),D.play()}function Ve(){Je.clearRegions(),st(Ue()).filter(e=>e.time!==null).forEach((e,t)=>{Je.addRegion({start:e.time,content:String(t+1),color:Xn(e.character),drag:!1,resize:!1})})}function Yn(i,e){const t=document.createElement("div");t.className="c-rating";for(let n=1;n<=5;n++){const r=document.createElement("button");r.type="button",r.className="c-star"+(n<=i.rating?" filled":""),r.textContent="★",r.title=`${n} 分${i.rating===n?"（再按清除）":""}`,r.addEventListener("click",o=>{o.stopPropagation(),i.rating=i.rating===n?0:n,Z()}),t.appendChild(r)}e.appendChild(t)}function an(i,e={}){const t=document.createElement("div"),n=e.badge==="🏆"?" trophy":e.badge==="👎"?" bad":"";t.className="citem"+(e.role?" role":"")+(e.focused?" rolefocus":"")+n,e.role&&e.ridx!==void 0&&(t.dataset.ridx=String(e.ridx));let r=t;if(e.role){const d=document.createElement("div");d.className="card-inner";const f=document.createElement("div");f.className="card-main";const h=document.createElement("button");h.className="cplay",h.dataset.cid=i.id,h.textContent=Ee===i.id&&D.isPlaying()?"⏸":"▶",h.addEventListener("click",g=>{g.stopPropagation(),cn(i,e.ridx)}),d.append(f,h),t.appendChild(d),r=f}const o=document.createElement("div");o.className="crow";const a=document.createElement("span");if(i.time===null?(a.className="ctime general",a.textContent="整體"):(a.className="ctime",a.textContent=ot(i.time),a.addEventListener("click",d=>{d.stopPropagation(),Ye(i)})),o.appendChild(a),e.role){const d=document.createElement("span");if(d.className="cfile",d.textContent=i.file,e.badge){const f=document.createElement("span");f.className="cfile-badge",f.textContent=e.badge,d.appendChild(f)}d.addEventListener("click",f=>{f.stopPropagation(),Ye(i)}),o.appendChild(d)}const l=document.createElement("span");l.className="cauthor",l.textContent=i.author,o.appendChild(l);const c=document.createElement("button");c.className="cdel",c.textContent="×",c.title="刪除",c.addEventListener("click",d=>{d.stopPropagation(),P=P.filter(f=>f.id!==i.id),Z()}),o.appendChild(c),r.appendChild(o),Yn(i,r);const s=document.createElement("div");s.className="ctext",s.textContent=i.text,s.addEventListener("dblclick",d=>{d.stopPropagation(),s.contentEditable="true",s.focus()}),s.addEventListener("keydown",d=>{d.isComposing||d.key==="Enter"&&!d.shiftKey&&(d.preventDefault(),s.blur())}),s.addEventListener("blur",()=>{s.contentEditable="false";const d=(s.innerText??"").trim();d?(i.text=d,Z()):s.textContent=i.text}),r.appendChild(s);const u=document.createElement("div");if(u.className="ctag-row",Zn(i,u),r.appendChild(u),i.replies.length){const d=document.createElement("div");d.className="creplies",i.replies.forEach(f=>{const h=document.createElement("div");h.className="creply";const g=document.createElement("span");g.className="crauthor",g.textContent=f.author+"：";const p=document.createElement("span");p.textContent=f.text;const v=document.createElement("button");v.className="crdel",v.textContent="×",v.addEventListener("click",y=>{y.stopPropagation(),i.replies=i.replies.filter(S=>S.id!==f.id),Z()}),h.append(g,p,v),d.appendChild(h)}),r.appendChild(d)}const m=document.createElement("div");if(m.className="creply-input",Y===i.id){const d=document.createElement("input");d.type="text",d.placeholder="回覆…（Enter 送出 / Esc 取消）",d.addEventListener("keydown",h=>{h.stopPropagation(),!h.isComposing&&(h.key==="Enter"?(h.preventDefault(),Nt(i,d.value)):h.key==="Escape"&&(h.preventDefault(),Y=null,Q()))});const f=document.createElement("button");f.textContent="送出",f.addEventListener("click",h=>{h.stopPropagation(),Nt(i,d.value)}),m.append(d,f)}else{const d=document.createElement("button");d.className="creply-toggle",d.textContent="＋ 回覆",d.addEventListener("click",f=>{if(f.stopPropagation(),!te){Xe(()=>{Y=i.id,Q()});return}Y=i.id,Q()}),m.appendChild(d)}return r.appendChild(m),t}function Zn(i,e){if(fe===i.id){const t=document.createElement("div");t.className="char-picker",dn(t,i.character,r=>{at(i.character,r),Z()});const n=document.createElement("button");n.type="button",n.className="charchip done",n.textContent="完成",n.addEventListener("click",r=>{r.stopPropagation(),fe=null,Q()}),t.appendChild(n),e.appendChild(t)}else if(i.character.length>0)i.character.forEach(t=>{const n=document.createElement("span");n.className="ctag",n.style.background=Kt(t,N)??"#3b82f6",n.textContent=t,n.addEventListener("click",r=>{r.stopPropagation(),fe=i.id,Q()}),e.appendChild(n)});else{const t=document.createElement("span");t.className="ctag empty",t.textContent="＋ 角色",t.addEventListener("click",n=>{n.stopPropagation(),fe=i.id,Q()}),e.appendChild(t)}}function ce(){const i=Vn();Fn.textContent=i?`留言 · ${i}`:"留言",ze.innerHTML="";const e=st(i);if(e.length===0){const t=document.createElement("li");t.style.color="var(--muted)",t.style.fontSize="13px",t.textContent=i?"尚無留言。播放時按 C 新增。":"尚未選擇檔案。",ze.appendChild(t);return}e.forEach(t=>ze.appendChild(an(t)))}function sn(i,e){const t=[...i];return e==="rating"?t.sort((n,r)=>r.rating-n.rating||n.file.localeCompare(r.file,"zh-Hant",{numeric:!0})||(n.time??-1/0)-(r.time??-1/0)):e==="file"?t.sort((n,r)=>n.file.localeCompare(r.file,"zh-Hant",{numeric:!0})||(n.time??-1/0)-(r.time??-1/0)):t.sort((n,r)=>n.author.localeCompare(r.author,"zh-Hant")||n.file.localeCompare(r.file,"zh-Hant",{numeric:!0})||(n.time??-1/0)-(r.time??-1/0)),t}function Qn(i){let e=P.filter(t=>t.character.includes(i));return J==="hide"?e=e.filter(t=>t.rating>0):J==="solo"&&(e=e.filter(t=>t.rating===0)),sn(e,Me)}function le(){F.innerHTML="",B=[],F.classList.toggle("role-compact",ue);const i=document.createElement("div");i.className="role-head";const e=document.createElement("h2");e.textContent="角色 Dashboard";const t=document.createElement("button");t.className="ghost",t.textContent="返回單檔",t.addEventListener("click",()=>G("single"));const n=document.createElement("span");n.className="role-hint",n.textContent="↑↓ 移動 · 空白鍵 就地播放 · Enter 進單檔 · Tab/Esc 返回";const r=document.createElement("div");r.className="role-sort-toggle",["rating","file","user"].forEach(p=>{const v=p==="rating"?"評分":p==="file"?"檔案":"使用者",y=document.createElement("button");y.className="role-sort-btn"+(Me===p?" active":""),y.textContent=v,y.addEventListener("click",()=>{Me=p,le()}),r.appendChild(y)});const o=document.createElement("button");o.className="role-compact-btn"+(ue?" active":""),o.textContent="簡潔",o.title="隱藏回覆與角色標籤，雙欄顯示",o.addEventListener("click",()=>{ue=!ue,F.classList.toggle("role-compact",ue),o.classList.toggle("active",ue)});const a={all:"hide",hide:"solo",solo:"all"},l={all:"隱藏 👎",hide:"solo 👎",solo:"全部留言"},c=document.createElement("button");c.className="role-zero-btn"+(J!=="all"?" "+J:""),c.textContent=l[J],c.addEventListener("click",()=>{J=a[J],le()}),i.append(e,t,n,r,o,c);const s=document.createElement("div");s.className="role-sticky",s.appendChild(i);const u=["lead","mascot","supporting"],m=P.filter(p=>p.character.length===0).length,d=document.createElement("div");d.className="role-stats-wrap";let f=null;if(u.forEach(p=>{const v=N.filter(x=>x.role===p);if(v.length===0)return;const y=document.createElement("div");y.className="role-stats-row",p==="supporting"&&(f=y);const S=document.createElement("span");S.className="role-stats-type",S.textContent=qt[p],S.style.color=j[p],y.appendChild(S),v.forEach(x=>{const R=P.filter(C=>C.character.includes(x.name)).length,k=document.createElement("button");k.className="role-stat"+(R===0?" zero":""),k.style.background=j[x.role],k.textContent=`${x.name} ${R}`,k.addEventListener("click",()=>{var C;(C=F.querySelector(`[data-char="${x.name}"]`))==null||C.scrollIntoView({behavior:"smooth",block:"start"})}),y.appendChild(k)}),d.appendChild(y)}),m>0){const p=document.createElement("button");if(p.className="role-stat",p.style.background="#64748b",p.textContent=`未指定 ${m}`,p.addEventListener("click",()=>{var v;(v=F.querySelector('[data-char="__none__"]'))==null||v.scrollIntoView({behavior:"smooth",block:"start"})}),f)f.appendChild(p);else{const v=document.createElement("div");v.className="role-stats-row",v.appendChild(p),d.appendChild(v)}}s.appendChild(d),F.appendChild(s);const h=(p,v,y)=>{if(y.length===0)return;const S=document.createElement("div");S.className="role-group",S.dataset.char=p;const x=document.createElement("div");x.className="role-group-label",x.style.background=v,x.textContent=p==="__none__"?"未指定":p,S.appendChild(x);const R=document.createElement("div");R.className="role-group-cards-wrap";const k=y.reduce((C,b)=>Math.max(C,b.rating),0);y.forEach(C=>{const b=B.length,z=C.rating===0?"👎":k>0&&C.rating===k?"🏆":void 0;R.appendChild(an(C,{role:!0,ridx:b,focused:b===W,badge:z})),B.push(C)}),S.appendChild(R),F.appendChild(S)};N.forEach(p=>h(p.name,j[p.role],Qn(p.name)));let g=P.filter(p=>p.character.length===0);if(J==="hide"?g=g.filter(p=>p.rating>0):J==="solo"&&(g=g.filter(p=>p.rating===0)),h("__none__","#64748b",sn(g,Me)),B.length===0){const p=document.createElement("div");p.style.color="var(--muted)",p.textContent="尚無留言。",F.appendChild(p)}W>=B.length&&(W=Math.max(0,B.length-1))}function we(){F.querySelectorAll(".cplay").forEach(i=>{i.textContent=Ee===i.dataset.cid&&D.isPlaying()?"⏸":"▶"})}function ln(){F.querySelectorAll(".citem").forEach(i=>{const e=i.dataset.ridx===String(W);i.classList.toggle("rolefocus",e),e&&i.scrollIntoView({block:"nearest"})})}function Mt(i){B.length!==0&&(W=Math.min(Math.max(0,W+i),B.length-1),ln())}async function ei(i,e){const t=T.findIndex(r=>r.name===i.file);if(t<0)return;t!==V&&await ne(t),D.setTime(i.time??0),D.play(),Ee=i.id;const n=e!==void 0?e:B.indexOf(i);n>=0&&(W=n,ln()),we()}function cn(i,e){if(Ee===i.id&&D.isPlaying()){D.pause(),we();return}ei(i,e)}async function Ye(i){const e=T.findIndex(t=>t.name===i.file);e<0||(H!=="single"&&G("single"),e!==V&&await ne(e),i.time!==null&&D.setTime(i.time),D.play())}function dn(i,e,t,n){i.innerHTML="",N.forEach((r,o)=>{const a=document.createElement("button");a.type="button",a.className="charchip"+(o===n?" focused":""),a.textContent=r.name,a.style.borderColor=j[r.role],e.includes(r.name)&&(a.style.background=j[r.role],a.style.color="#fff"),a.addEventListener("click",l=>{l.stopPropagation(),t(r.name)}),i.appendChild(a)})}function Nt(i,e){const t=e.trim();if(!t){Y=null,Q();return}const n=()=>{i.replies.push({id:tn(),author:te,text:t,created:Date.now()}),Y=null,Z()};te?n():Xe(n)}function ti(){if(!(V<0)){if(!te){Xe(()=>Tt());return}Tt()}}function Tt(){D.pause(),tt=D.getCurrentTime(),ae=!0,ge.value="",se=[],oe=0,_="text",$(),it.classList.remove("hidden"),ge.focus()}function un(){it.classList.add("hidden"),_="text"}function lt(){St.innerHTML="";for(let i=1;i<=5;i++){const e=document.createElement("button");e.type="button",e.className="c-star"+(i<=oe?" filled":""),e.textContent="★",e.title=`${i} 分`,e.addEventListener("click",t=>{t.stopPropagation(),oe=oe===i?0:i,lt()}),St.appendChild(e)}}function $(){ni(),hn(),lt()}function ni(){ae?(he.textContent=`對應秒數 ${ot(tt)}`,he.classList.remove("off")):(he.textContent="整體留言（不對應秒數）",he.classList.add("off")),he.classList.toggle("focused",_==="toggle")}function hn(){dn(Qt,se,e=>{at(se,e),hn()},typeof _=="number"?_:void 0)}function zt(){const i=ge.value.trim();if(un(),!i)return;const e=Ue();e&&(P.push({id:tn(),file:e,time:ae?tt:null,text:i,author:te,character:[...se],replies:[],rating:oe}),Z())}function Ot(){_="toggle",ge.blur(),$()}function _t(){_="text",$(),ge.focus()}function ii(){if(N.length===0)return;const i=se.length?N.findIndex(e=>e.name===se[0]):-1;_=i>=0?i:0,ge.blur(),$()}function ri(i){at(se,N[i].name),$()}function Le(i,e){const t=Array.from(Qt.children);if(t.length===0)return i;const n=t.map(u=>u.getBoundingClientRect()),r=n[i],o=r.left+r.width/2,a=r.top+r.height/2,l=r.height/2;if(e==="left"||e==="right"){let u=-1,m=1/0;return n.forEach((d,f)=>{if(f===i||Math.abs(d.top+d.height/2-a)>l)return;const h=d.left+d.width/2;e==="left"&&h<o&&o-h<m&&(m=o-h,u=f),e==="right"&&h>o&&h-o<m&&(m=h-o,u=f)}),u>=0?u:i}let c=-1,s=1/0;return n.forEach((u,m)=>{if(m===i)return;const d=u.top+u.height/2;if(!(e==="up"?d<a-l:d>a+l))return;const h=Math.abs(d-a)*1e3+Math.abs(u.left+u.width/2-o);h<s&&(s=h,c=m)}),e==="up"&&c<0?"toggle":c>=0?c:i}function oi(i){if(i.isComposing)return;if(i.shiftKey&&/^Digit[0-5]$/.test(i.code)){i.preventDefault();const t=parseInt(i.code[5]);oe=oe===t?0:t,lt();return}if(i.code==="Escape"){i.preventDefault(),un();return}if(_==="text"){if(Ge(i)&&!i.shiftKey){i.preventDefault(),zt();return}if(i.code==="ArrowDown"||i.code==="Tab"){i.preventDefault(),Ot();return}return}if(Ge(i)){i.preventDefault(),zt();return}if(_==="toggle"){switch(i.code){case"Space":i.preventDefault(),ae=!ae,$();break;case"ArrowUp":i.preventDefault(),_t();break;case"ArrowDown":case"Tab":i.preventDefault(),ii();break}return}const e=_;switch(i.code){case"Space":i.preventDefault(),ri(e);break;case"ArrowRight":{i.preventDefault();const t=Le(e,"right");typeof t=="number"&&(_=t,$());break}case"ArrowLeft":{i.preventDefault();const t=Le(e,"left");typeof t=="number"&&(_=t,$());break}case"ArrowDown":{i.preventDefault();const t=Le(e,"down");typeof t=="number"&&(_=t,$());break}case"ArrowUp":{i.preventDefault();const t=Le(e,"up");t==="toggle"?Ot():(_=t,$());break}case"Tab":i.preventDefault(),_t();break}}he.addEventListener("click",()=>{ae=!ae,$()});function Xe(i){Ae=i,Be.value=te,$e.classList.remove("hidden"),Be.focus()}function ai(){const i=Be.value.trim();if(!i)return;te=i,Dn(i),$e.classList.add("hidden");const e=Ae;Ae=null,e&&e()}Be.addEventListener("keydown",i=>{i.stopPropagation(),!i.isComposing&&(i.key==="Enter"?(i.preventDefault(),ai()):i.key==="Escape"&&(i.preventDefault(),$e.classList.add("hidden"),Ae=null))});Ct.addEventListener("click",()=>{Ct.blur(),be(),rt.classList.remove("hidden")});function be(){Rt.innerHTML="",N.forEach((i,e)=>{const t=document.createElement("li"),n=document.createElement("span");n.className="dot",n.style.background=j[i.role];const r=document.createElement("span");r.textContent=i.name,r.title="雙擊重命名",r.style.cursor="pointer",r.addEventListener("dblclick",()=>{const l=document.createElement("input");l.type="text",l.value=i.name,l.style.cssText="font-size:13px;width:120px;padding:2px 6px",t.replaceChild(l,r),l.focus(),l.select();const c=()=>{const s=l.value.trim();if(s&&s!==i.name){const u=i.name;i.name=s,P.forEach(m=>{const d=m.character.indexOf(u);d>=0&&(m.character[d]=s)}),Oe(N),rn()}be()};l.addEventListener("keydown",s=>{s.stopPropagation(),s.key==="Enter"?(s.preventDefault(),c()):s.key==="Escape"&&(s.preventDefault(),be())}),l.addEventListener("blur",c)});const o=document.createElement("span");o.className="role",o.textContent=qt[i.role];const a=document.createElement("button");a.className="rm",a.textContent="刪除",a.addEventListener("click",()=>{N.splice(e,1),Oe(N),be()}),t.append(n,r,o,a),Rt.appendChild(t)})}en.addEventListener("click",()=>{const i=Ke.value.trim();i&&(N.push({name:i,role:$n.value}),Oe(N),Ke.value="",be())});Ke.addEventListener("keydown",i=>{i.stopPropagation(),!i.isComposing&&i.key==="Enter"&&(i.preventDefault(),en.click())});Un.addEventListener("click",()=>{rt.classList.add("hidden"),Ve(),ce(),H==="role"&&le()});function At(i){const e=D.getDuration();!isFinite(e)||e===0||D.setTime(Math.min(Math.max(0,D.getCurrentTime()+i),e))}function It(i){const e=st(Ue()).filter(r=>r.time!==null).map(r=>r.time);if(e.length===0)return;const t=D.getCurrentTime();let n;if(i<0){for(let r=e.length-1;r>=0;r--)if(e[r]<t-_n){n=e[r];break}n??(n=e[0])}else{for(let r=0;r<e.length;r++)if(e[r]>t+An){n=e[r];break}n??(n=e[e.length-1])}D.setTime(n)}function G(i){H=i;const e=i==="single",t=i==="grid",n=i==="role";(t||n)&&D.pause(),Bn.classList.toggle("hidden",!e),Wn.classList.toggle("hidden",!e),Te.classList.toggle("hidden",!t),F.classList.toggle("hidden",!n),Hn.classList.toggle("hidden",n),t&&pn(),n&&(W=0,le()),ce()}function pn(){Te.innerHTML="";const i=document.createElement("div");i.className="gridhint",i.textContent="WASD／方向鍵 移動 · 空白鍵或 Enter 開啟 · Tab 返回單檔",Te.appendChild(i),T.forEach((e,t)=>{const n=document.createElement("div");n.className="gridcard"+(t===U?" selected":""),n.innerHTML=`<div class="gc-name">${me(e.name)}</div><div class="gc-meta">${nn(e.name)} 則留言</div>`,n.addEventListener("click",()=>{U=t,G("single"),ne(t)}),Te.appendChild(n)})}function Se(i){const e=T.length;e!==0&&(U=Math.min(Math.max(0,U+i),e-1),pn(),ce())}function si(){const i=document.activeElement;return i?i.tagName==="INPUT"||i.tagName==="TEXTAREA"||i.isContentEditable:!1}function li(){return!$e.classList.contains("hidden")||!rt.classList.contains("hidden")}document.addEventListener("keydown",i=>{if(!it.classList.contains("hidden")){oi(i);return}if(!i.isComposing){if(fe!==null&&i.code==="Escape"){i.preventDefault(),fe=null,Q();return}if(Y!==null&&i.code==="Escape"){i.preventDefault(),Y=null,Q();return}if(!(li()||si())){if(H==="role"){if(i.shiftKey&&/^Digit[0-5]$/.test(i.code)){i.preventDefault();const e=parseInt(i.code[5]),t=B[W];t&&(t.rating=t.rating===e?0:e,Z());return}if(i.code==="Tab"||i.code==="Escape"){i.preventDefault(),G("single");return}switch(i.code){case"ArrowUp":case"KeyW":i.preventDefault(),Mt(-1);break;case"ArrowDown":case"KeyS":i.preventDefault(),Mt(1);break;case"Space":i.preventDefault(),B[W]&&cn(B[W],W);break;case"Enter":case"NumpadEnter":i.preventDefault(),B[W]&&Ye(B[W]);break}return}if(H==="grid"){if(Ge(i)){i.preventDefault(),G("single"),ne(U);return}switch(i.code){case"KeyA":case"ArrowLeft":i.preventDefault(),Se(-1);break;case"KeyD":case"ArrowRight":i.preventDefault(),Se(1);break;case"KeyW":case"ArrowUp":i.preventDefault(),Se(-bt);break;case"KeyS":case"ArrowDown":i.preventDefault(),Se(bt);break;case"Space":i.preventDefault(),G("single"),ne(U);break;case"Tab":i.preventDefault(),G("single");break}return}switch(i.code){case"Space":i.preventDefault(),D.playPause();break;case"KeyA":case"ArrowLeft":i.preventDefault(),At(-5);break;case"KeyD":case"ArrowRight":i.preventDefault(),At(5);break;case"KeyW":case"ArrowUp":i.preventDefault(),It(-1);break;case"KeyS":case"ArrowDown":i.preventDefault(),It(1);break;case"KeyC":case"KeyX":!i.ctrlKey&&!i.metaKey&&(i.preventDefault(),ti());break;case"Tab":i.preventDefault(),T.length&&G("grid");break}}}});function ci(){let i="";const e=(o,a)=>a.rating-o.rating||o.file.localeCompare(a.file,"zh-Hant",{numeric:!0})||(o.time??-1/0)-(a.time??-1/0),t=(o,a,l)=>{if(l.length===0)return;const c=l.map(s=>{const u=s.rating>0?"★".repeat(s.rating)+"☆".repeat(5-s.rating):"",m=s.time!==null?ot(s.time):"整體";return`<tr>
        <td class="tc">${me(m)}</td>
        <td class="fn">${me(s.file)}</td>
        <td class="cm">${me(s.text)}</td>
        <td class="sr">${u}</td>
        <td class="au">${me(s.author)}</td>
      </tr>`}).join("");i+=`<div class="section">
  <div class="slabel" style="background:${a}">${me(o==="__none__"?"未指定":o)}</div>
  <table><thead><tr>
    <th class="tc">時間</th><th class="fn">音檔</th><th class="cm">評語</th><th class="sr">評分</th><th class="au">留言者</th>
  </tr></thead><tbody>${c}</tbody></table>
</div>`};N.forEach(o=>t(o.name,j[o.role],P.filter(a=>a.character.includes(o.name)).sort(e))),t("__none__","#64748b",P.filter(o=>o.character.length===0).sort(e));const n=`<!DOCTYPE html>
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
<div class="sub">產出時間：${new Date().toLocaleString("zh-Hant")} · 共 ${P.length} 則留言</div>
${i||'<p style="color:#9ca3af">尚無留言</p>'}
</body></html>`,r=window.open("","_blank","width=900,height=800");if(!r){alert("請允許開啟新分頁（檢查彈出視窗封鎖設定）");return}r.document.write(n),r.document.close(),setTimeout(()=>r.print(),600)}Dt.addEventListener("click",()=>{Dt.blur(),ci()});const di=1e4;function ui(i){const e=new Set(P.map(n=>n.id)),t=i.map(Fe).filter(n=>!e.has(n.id));return t.length===0?0:(P=[...P,...t],t.length)}function hi(){Bt(),Pe=window.setInterval(async()=>{if(!X){Bt();return}try{const e=await(await X.getFileHandle(et)).getFile(),t=JSON.parse(await e.text());if(!Array.isArray(t==null?void 0:t.comments))return;const n=ui(t.comments);_e=Date.now(),mn(),n>0&&(Qe(P),Ve(),je(),ce(),H==="role"&&le(),pi(`已同步 ${n} 則新留言`))}catch{}},di)}function Bt(){Pe!==void 0&&(window.clearInterval(Pe),Pe=void 0)}function mn(){const i=document.getElementById("syncStatus");if(!i)return;if(!X){i.textContent="";return}const e=_e?new Date(_e).toLocaleTimeString("zh-Hant",{hour:"2-digit",minute:"2-digit",second:"2-digit"}):"—";i.textContent=`↺ 協作同步中 · ${e}`}let Wt;function pi(i){const e=document.getElementById("syncToast");e&&(e.textContent=i,e.classList.remove("hidden"),window.clearTimeout(Wt),Wt=window.setTimeout(()=>e.classList.add("hidden"),3e3))}function mi(){const i=c=>JSON.stringify(c).replace(/</g,"\\u003c").replace(/>/g,"\\u003e").replace(/&/g,"\\u0026"),e=Tn.replace("{{DATA_JSON}}",()=>i({comments:P,characters:N,roleColors:j})),t=new Blob([e],{type:"text/html;charset=utf-8"}),n=URL.createObjectURL(t),r=new Date,o=c=>String(c).padStart(2,"0"),a=`${r.getFullYear()}${o(r.getMonth()+1)}${o(r.getDate())}-${o(r.getHours())}${o(r.getMinutes())}`,l=document.createElement("a");l.href=n,l.download=`voicepicker-share-${a}.html`,l.click(),URL.revokeObjectURL(n)}async function fi(){if(T.length===0){alert("請先選擇音檔資料夾後再匯出外部分享版。");return}const i=new Set(P.map(m=>m.file)),e=T.filter(m=>i.has(m.name));if(e.length===0){alert("目前沒有任何留言，無法產生分享版。");return}pe.disabled=!0,pe.textContent=`處理中 0/${e.length}…`;const t={};for(let m=0;m<e.length;m++){const d=e[m];pe.textContent=`處理中 ${m+1}/${e.length}…`;try{const f=await d.handle.getFile(),h=await new Promise((g,p)=>{const v=new FileReader;v.onload=()=>g(v.result),v.onerror=p,v.readAsDataURL(f)});t[d.name]=h}catch{}}pe.disabled=!1,pe.textContent="匯出";const n=m=>JSON.stringify(m).replace(/</g,"\\u003c").replace(/>/g,"\\u003e").replace(/&/g,"\\u0026"),r=zn.replace("{{DATA_JSON}}",()=>n({comments:P,characters:N,roleColors:j})).replace("{{AUDIO_JSON}}",()=>n(t)),o=new Blob([r],{type:"text/html;charset=utf-8"}),a=URL.createObjectURL(o),l=new Date,c=m=>String(m).padStart(2,"0"),s=`${l.getFullYear()}${c(l.getMonth()+1)}${c(l.getDate())}-${c(l.getHours())}${c(l.getMinutes())}`,u=document.createElement("a");u.href=a,u.download=`voicepicker-external-${s}.html`,u.click(),URL.revokeObjectURL(a)}Pt.addEventListener("click",()=>{Pt.blur(),We.classList.remove("hidden")});jn.addEventListener("click",()=>We.classList.add("hidden"));pe.addEventListener("click",()=>{var e;const i=(e=We.querySelector('input[name="shareMode"]:checked'))==null?void 0:e.value;We.classList.add("hidden"),i==="external"?fi():mi()});kt.addEventListener("click",()=>{kt.blur(),G("role")});In.textContent="v0.9.5";te||Xe(null);
