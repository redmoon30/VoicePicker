(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();function A(i,e,t,n){return new(t||(t=Promise))(function(r,s){function o(a){try{c(n.next(a))}catch(h){s(h)}}function l(a){try{c(n.throw(a))}catch(h){s(h)}}function c(a){var h;a.done?r(a.value):(h=a.value,h instanceof t?h:new t(function(m){m(h)})).then(o,l)}c((n=n.apply(i,e||[])).next())})}let xe=class{constructor(){this.listeners={}}on(e,t,n){if(this.listeners[e]||(this.listeners[e]=new Set),n==null?void 0:n.once){const r=(...s)=>{this.un(e,r),t(...s)};return this.listeners[e].add(r),()=>this.un(e,r)}return this.listeners[e].add(t),()=>this.un(e,t)}un(e,t){var n;(n=this.listeners[e])===null||n===void 0||n.delete(t)}once(e,t){return this.on(e,t,{once:!0})}unAll(){this.listeners={}}emit(e,...t){this.listeners[e]&&this.listeners[e].forEach(n=>n(...t))}};const ke={decode:function(i,e){return A(this,void 0,void 0,function*(){const t=new AudioContext({sampleRate:e});try{return yield t.decodeAudioData(i)}finally{t.close()}})},createBuffer:function(i,e){if(!i||i.length===0)throw new Error("channelData must be a non-empty array");if(e<=0)throw new Error("duration must be greater than 0");if(typeof i[0]=="number"&&(i=[i]),!i[0]||i[0].length===0)throw new Error("channelData must contain non-empty channel arrays");(function(n){const r=n[0];if(r.some(s=>s>1||s<-1)){const s=r.length;let o=0;for(let l=0;l<s;l++){const c=Math.abs(r[l]);c>o&&(o=c)}for(const l of n)for(let c=0;c<s;c++)l[c]/=o}})(i);const t=i.map(n=>n instanceof Float32Array?n:Float32Array.from(n));return{duration:e,length:t[0].length,sampleRate:t[0].length/e,numberOfChannels:t.length,getChannelData:n=>{const r=t[n];if(!r)throw new Error(`Channel ${n} not found`);return r},copyFromChannel:AudioBuffer.prototype.copyFromChannel,copyToChannel:AudioBuffer.prototype.copyToChannel}}};function Ut(i,e){const t=e.xmlns?document.createElementNS(e.xmlns,i):document.createElement(i);for(const[n,r]of Object.entries(e))if(n==="children"&&r)for(const[s,o]of Object.entries(r))o instanceof Node?t.appendChild(o):typeof o=="string"?t.appendChild(document.createTextNode(o)):t.appendChild(Ut(s,o));else n==="style"?Object.assign(t.style,r):n==="textContent"?t.textContent=r:t.setAttribute(n,r.toString());return t}function mt(i,e,t){const n=Ut(i,e||{});return t==null||t.appendChild(n),n}function jt(i){return i instanceof HTMLElement||typeof i=="object"&&i!==null&&i.nodeType===Node.ELEMENT_NODE&&typeof i.style=="object"}var En=Object.freeze({__proto__:null,createElement:mt,default:mt,isHTMLElement:jt});const xn={fetchBlob:function(i,e,t){return A(this,void 0,void 0,function*(){var n;const r=yield fetch(i,t);if(r.status>=400)throw new Error(`Failed to fetch ${i}: ${r.status} (${r.statusText})`);return function(s,o,l){A(this,void 0,void 0,function*(){var c;if(!s.body||!s.headers)return;const a=s.body.getReader(),h=Number(s.headers.get("Content-Length"))||0;let m=0;const d=()=>{a.cancel()};if(l){if(l.aborted)return void a.cancel();l.addEventListener("abort",d,{once:!0})}try{for(;;){const f=yield a.read();if(f.done)break;if(m+=((c=f.value)===null||c===void 0?void 0:c.length)||0,h>0){const u=Math.round(m/h*100);o(u)}}}catch(f){if(f instanceof DOMException&&f.name==="AbortError")return;console.warn("Progress tracking error:",f)}finally{l&&l.removeEventListener("abort",d)}})}(r.clone(),e,(n=t==null?void 0:t.signal)!==null&&n!==void 0?n:void 0),r.blob()})}};function M(i){let e=i;const t=new Set;return{get value(){return e},set(n){Object.is(e,n)||(e=n,t.forEach(r=>r(e)))},update(n){this.set(n(e))},subscribe:n=>(t.add(n),()=>t.delete(n))}}function re(i,e){const t=M(i());return e.forEach(n=>n.subscribe(()=>{const r=i();Object.is(t.value,r)||t.set(r)})),{get value(){return t.value},subscribe:n=>t.subscribe(n)}}function q(i,e){let t;const n=()=>{t&&(t(),t=void 0),t=i()},r=e.map(s=>s.subscribe(n));return n(),()=>{t&&(t(),t=void 0),r.forEach(s=>s())}}class Cn extends xe{get isPlayingSignal(){return this._isPlaying}get currentTimeSignal(){return this._currentTime}get durationSignal(){return this._duration}get volumeSignal(){return this._volume}get mutedSignal(){return this._muted}get playbackRateSignal(){return this._playbackRate}get seekingSignal(){return this._seeking}constructor(e){super(),this.isExternalMedia=!1,this._ownBlobUrl=null,this.reactiveMediaEventCleanups=[],e.media?(this.media=e.media,this.isExternalMedia=!0):this.media=document.createElement("audio"),this._isPlaying=M(!1),this._currentTime=M(0),this._duration=M(0),this._volume=M(this.media.volume),this._muted=M(this.media.muted),this._playbackRate=M(this.media.playbackRate||1),this._seeking=M(!1),this.setupReactiveMediaEvents(),e.mediaControls&&(this.media.controls=!0),e.autoplay&&(this.media.autoplay=!0),e.playbackRate!=null&&this.onMediaEvent("canplay",()=>{e.playbackRate!=null&&(this.media.playbackRate=e.playbackRate)},{once:!0})}setupReactiveMediaEvents(){this.reactiveMediaEventCleanups.push(this.onMediaEvent("play",()=>{this._isPlaying.set(!0)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("pause",()=>{this._isPlaying.set(!1)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("ended",()=>{this._isPlaying.set(!1)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("timeupdate",()=>{this._currentTime.set(this.media.currentTime)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("durationchange",()=>{this._duration.set(this.media.duration||0)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("loadedmetadata",()=>{this._duration.set(this.media.duration||0)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("seeking",()=>{this._seeking.set(!0)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("seeked",()=>{this._seeking.set(!1)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("volumechange",()=>{this._volume.set(this.media.volume),this._muted.set(this.media.muted)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("ratechange",()=>{this._playbackRate.set(this.media.playbackRate)}))}onMediaEvent(e,t,n){return this.media.addEventListener(e,t,n),()=>this.media.removeEventListener(e,t,n)}getSrc(){return this.media.currentSrc||this.media.src||""}revokeSrc(){this._ownBlobUrl&&(URL.revokeObjectURL(this._ownBlobUrl),this._ownBlobUrl=null)}canPlayType(e){return this.media.canPlayType(e)!==""}setSrc(e,t){const n=this.getSrc();if(e&&n===e)return;this.revokeSrc();const r=t instanceof Blob&&(this.canPlayType(t.type)||!e)?URL.createObjectURL(t):e;if(r!==e&&(this._ownBlobUrl=r),n&&this.media.removeAttribute("src"),r||e)try{this.media.src=r}catch{this.media.src=e}}destroy(){this.reactiveMediaEventCleanups.forEach(e=>e()),this.reactiveMediaEventCleanups=[],this.revokeSrc(),this.unAll(),this.isExternalMedia||(this.media.pause(),this.media.removeAttribute("src"),this.media.load(),this.media.remove())}setMediaElement(e){this.reactiveMediaEventCleanups.forEach(t=>t()),this.reactiveMediaEventCleanups=[],this.media=e,this.setupReactiveMediaEvents()}play(){return A(this,void 0,void 0,function*(){try{return yield this.media.play()}catch(e){if(e instanceof DOMException&&e.name==="AbortError")return;throw e}})}pause(){this.media.pause()}isPlaying(){return!this.media.paused&&!this.media.ended}setTime(e){this.media.currentTime=Math.max(0,Math.min(e,this.getDuration()))}getDuration(){return this.media.duration}getCurrentTime(){return this.media.currentTime}getVolume(){return this.media.volume}setVolume(e){this.media.volume=e}getMuted(){return this.media.muted}setMuted(e){this.media.muted=e}getPlaybackRate(){return this.media.playbackRate}isSeeking(){return this.media.seeking}setPlaybackRate(e,t){t!=null&&(this.media.preservesPitch=t),this.media.playbackRate=e}getMediaElement(){return this.media}setSinkId(e){return this.media.setSinkId(e)}}function wn({maxTop:i,maxBottom:e,halfHeight:t,vScale:n,barMinHeight:r=0,barAlign:s}){let o=Math.round(i*t*n),l=o+Math.round(e*t*n)||1;return l<r&&(l=r,s||(o=l/2)),{topHeight:o,totalHeight:l}}function kn({barAlign:i,halfHeight:e,topHeight:t,totalHeight:n,canvasHeight:r}){return i==="top"?0:i==="bottom"?r-n:e-t}function ft(i,e,t){const n=e-i.left,r=t-i.top;return[n/i.width,r/i.height]}function Vt(i){return!!(i.barWidth||i.barGap||i.barAlign)}function gt(i,e){if(!Vt(e))return i;const t=e.barWidth||.5,n=t+(e.barGap||t/2);return n===0?i:Math.floor(i/n)*n}function vt({scrollLeft:i,totalWidth:e,numCanvases:t}){if(e===0)return[0];const n=i/e,r=Math.floor(n*t);return[r-1,r,r+1]}function Xt(i){const e=i._cleanup;typeof e=="function"&&e()}function Ln(i){const e=M({scrollLeft:i.scrollLeft,scrollWidth:i.scrollWidth,clientWidth:i.clientWidth}),t=re(()=>function(s){const{scrollLeft:o,scrollWidth:l,clientWidth:c}=s;if(l===0)return{startX:0,endX:1};const a=o/l,h=(o+c)/l;return{startX:Math.max(0,Math.min(1,a)),endX:Math.max(0,Math.min(1,h))}}(e.value),[e]),n=re(()=>function(s){return{left:s.scrollLeft,right:s.scrollLeft+s.clientWidth}}(e.value),[e]),r=()=>{e.set({scrollLeft:i.scrollLeft,scrollWidth:i.scrollWidth,clientWidth:i.clientWidth})};return i.addEventListener("scroll",r,{passive:!0}),{scrollData:e,percentages:t,bounds:n,cleanup:()=>{i.removeEventListener("scroll",r),Xt(e)}}}class Sn extends xe{constructor(e,t){super(),this.timeouts=[],this.isScrollable=!1,this.audioData=null,this.resizeObserver=null,this.lastContainerWidth=0,this.isDragging=!1,this.subscriptions=[],this.unsubscribeOnScroll=[],this.dragStream=null,this.scrollStream=null,this.containerInlinePadding=0,this.onClickWrapper=o=>{const l=this.wrapper.getBoundingClientRect(),[c,a]=ft(l,o.clientX,o.clientY);this.emit("click",c,a)},this.onDblClickWrapper=o=>{const l=this.wrapper.getBoundingClientRect(),[c,a]=ft(l,o.clientX,o.clientY);this.emit("dblclick",c,a)},this.subscriptions=[],this.options=e;const n=this.parentFromOptionsContainer(e.container);this.parent=n;const[r,s]=this.initHtml();n.appendChild(r),this.container=r,this.scrollContainer=s.querySelector(".scroll"),this.wrapper=s.querySelector(".wrapper"),this.canvasWrapper=s.querySelector(".canvases"),this.progressWrapper=s.querySelector(".progress"),this.cursor=s.querySelector(".cursor"),this.calculateInlinePadding(),t&&s.appendChild(t),this.initEvents()}parentFromOptionsContainer(e){let t;if(typeof e=="string"?t=document.querySelector(e):jt(e)&&(t=e),!t)throw new Error("Container not found");return t}initEvents(){this.wrapper.addEventListener("click",this.onClickWrapper),this.wrapper.addEventListener("dblclick",this.onDblClickWrapper),this.options.dragToSeek!==!0&&typeof this.options.dragToSeek!="object"||this.initDrag(),this.scrollStream=Ln(this.scrollContainer);const e=q(()=>{const{startX:t,endX:n}=this.scrollStream.percentages.value,{left:r,right:s}=this.scrollStream.bounds.value;this.emit("scroll",t,n,r,s)},[this.scrollStream.percentages,this.scrollStream.bounds]);if(this.subscriptions.push(e),typeof ResizeObserver=="function"){const t=this.createDelay(100);this.resizeObserver=new ResizeObserver(()=>{t().then(()=>this.onContainerResize()).catch(()=>{})}),this.resizeObserver.observe(this.scrollContainer)}}onContainerResize(){const e=this.parent.clientWidth;this.calculateInlinePadding(),e===this.lastContainerWidth&&this.options.height!=="auto"||(this.lastContainerWidth=e,this.reRender(),this.emit("resize"))}initDrag(){if(this.dragStream)return;this.dragStream=function(t,n={}){const{threshold:r=3,mouseButton:s=0,touchDelay:o=100}=n,l=M(null),c=new Map,a=matchMedia("(pointer: coarse)").matches;let h=()=>{};const m=d=>{if(d.button!==s||c.has(d.pointerId)||(c.set(d.pointerId,d),c.size>1))return;const f=d.pointerId;let u=d.clientX,g=d.clientY,p=!1;const v=Date.now(),E=t.getBoundingClientRect(),{left:S,top:x}=E,R=b=>{if(b.pointerId!==f||b.defaultPrevented||c.size>1||a&&Date.now()-v<o)return;const I=b.clientX,_=b.clientY,K=I-u,L=_-g;(p||Math.abs(K)>r||Math.abs(L)>r)&&(b.preventDefault(),b.stopPropagation(),p||(l.set({type:"start",x:u-S,y:g-x}),p=!0),l.set({type:"move",x:I-S,y:_-x,deltaX:K,deltaY:L}),u=I,g=_)},k=b=>{if(c.delete(b.pointerId)){if(b.pointerId===f&&p){const I=b.clientX,_=b.clientY;l.set({type:"end",x:I-S,y:_-x})}c.size===0&&h()}},C=b=>{b.relatedTarget&&b.relatedTarget!==document.documentElement||k(b)},y=b=>{p&&(b.stopPropagation(),b.preventDefault())},T=b=>{b.defaultPrevented||c.size>1||p&&b.preventDefault()};document.addEventListener("pointermove",R),document.addEventListener("pointerup",k),document.addEventListener("pointerout",C),document.addEventListener("pointercancel",C),document.addEventListener("touchmove",T,{passive:!1}),document.addEventListener("click",y,{capture:!0}),h=()=>{document.removeEventListener("pointermove",R),document.removeEventListener("pointerup",k),document.removeEventListener("pointerout",C),document.removeEventListener("pointercancel",C),document.removeEventListener("touchmove",T),setTimeout(()=>{document.removeEventListener("click",y,{capture:!0})},10)}};return t.addEventListener("pointerdown",m),{signal:l,cleanup:()=>{h(),t.removeEventListener("pointerdown",m),c.clear(),Xt(l)}}}(this.wrapper);const e=q(()=>{const t=this.dragStream.signal.value;if(!t)return;const n=this.wrapper.getBoundingClientRect().width,r=(s=t.x/n)<0?0:s>1?1:s;var s;t.type==="start"?(this.isDragging=!0,this.emit("dragstart",r)):t.type==="move"?this.emit("drag",r):t.type==="end"&&(this.isDragging=!1,this.emit("dragend",r))},[this.dragStream.signal]);this.subscriptions.push(e)}calculateInlinePadding(){const{paddingLeft:e,paddingRight:t}=getComputedStyle(this.scrollContainer),n=parseFloat(e)+parseFloat(t);this.containerInlinePadding=Number.isNaN(n)?0:n}initHtml(){const e=document.createElement("div"),t=e.attachShadow({mode:"open"}),n=this.options.cspNonce&&typeof this.options.cspNonce=="string"?this.options.cspNonce.replace(/"/g,""):"";return t.innerHTML=`
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
    `,[e,t]}setOptions(e){var t;if(this.options.container!==e.container){const n=this.parentFromOptionsContainer(e.container);n.appendChild(this.container),this.parent=n}e.dragToSeek===!0||typeof this.options.dragToSeek=="object"?this.initDrag():((t=this.dragStream)===null||t===void 0||t.cleanup(),this.dragStream=null),this.options=e,this.reRender()}getWrapper(){return this.wrapper}getWidth(){return this.scrollContainer.clientWidth-this.containerInlinePadding}getScroll(){return this.scrollContainer.scrollLeft}setScroll(e){this.scrollContainer.scrollLeft=e}setScrollPercentage(e){const{scrollWidth:t}=this.scrollContainer,n=t*e;this.setScroll(n)}destroy(){var e;this.wrapper.removeEventListener("click",this.onClickWrapper),this.wrapper.removeEventListener("dblclick",this.onDblClickWrapper),this.timeouts.forEach(t=>t()),this.timeouts=[],this.subscriptions.forEach(t=>t()),this.container.remove(),this.resizeObserver&&(this.resizeObserver.disconnect(),this.resizeObserver=null),(e=this.unsubscribeOnScroll)===null||e===void 0||e.forEach(t=>t()),this.unsubscribeOnScroll=[],this.dragStream&&(this.dragStream.cleanup(),this.dragStream=null),this.scrollStream&&(this.scrollStream.cleanup(),this.scrollStream=null)}createDelay(e=10){let t,n;const r=()=>{t&&(clearTimeout(t),t=void 0),n&&(n(),n=void 0)};return this.timeouts.push(r),()=>new Promise((s,o)=>{r(),n=o,t=setTimeout(()=>{t=void 0,n=void 0,s()},e)})}getHeight(e,t){var n;const r=((n=this.audioData)===null||n===void 0?void 0:n.numberOfChannels)||1;return function({optionsHeight:s,optionsSplitChannels:o,parentHeight:l,numberOfChannels:c,defaultHeight:a=128}){if(s==null)return a;const h=Number(s);if(!isNaN(h))return h;if(s==="auto"){const m=l||a;return o!=null&&o.every(d=>!d.overlay)?m/c:m}return a}({optionsHeight:e,optionsSplitChannels:t,parentHeight:this.parent.clientHeight,numberOfChannels:r,defaultHeight:128})}convertColorValues(e,t){return function(n,r,s){if(!Array.isArray(n))return n||"";if(n.length===0)return"#999";if(n.length<2)return n[0]||"";const o=document.createElement("canvas"),l=o.getContext("2d");if(!l)return n[0]||"";const c=s||o.height*r,a=l.createLinearGradient(0,0,0,c),h=1/(n.length-1);return n.forEach((m,d)=>{a.addColorStop(d*h,m)}),a}(e,this.getPixelRatio(),t==null?void 0:t.canvas.height)}getPixelRatio(){return e=window.devicePixelRatio,Math.max(1,e||1);var e}renderBarWaveform(e,t,n,r){const{width:s,height:o}=n.canvas,{halfHeight:l,barWidth:c,barRadius:a,barIndexScale:h,barSpacing:m,barMinHeight:d}=function({width:u,height:g,length:p,options:v,pixelRatio:E}){const S=g/2,x=v.barWidth?v.barWidth*E:1,R=v.barGap?v.barGap*E:v.barWidth?x/2:0,k=x+R||1;return{halfHeight:S,barWidth:x,barGap:R,barRadius:v.barRadius||0,barMinHeight:v.barMinHeight?v.barMinHeight*E:0,barIndexScale:p>0?u/k/p:0,barSpacing:k}}({width:s,height:o,length:(e[0]||[]).length,options:t,pixelRatio:this.getPixelRatio()}),f=function({channelData:u,barIndexScale:g,barSpacing:p,barWidth:v,halfHeight:E,vScale:S,canvasHeight:x,barAlign:R,barMinHeight:k}){const C=u[0]||[],y=u[1]||C,T=C.length,b=[];let I=0,_=0,K=0;for(let L=0;L<=T;L++){const ee=Math.round(L*g);if(ee>I){const{topHeight:bn,totalHeight:pt}=wn({maxTop:_,maxBottom:K,halfHeight:E,vScale:S,barMinHeight:k,barAlign:R}),yn=kn({barAlign:R,halfHeight:E,topHeight:bn,totalHeight:pt,canvasHeight:x});b.push({x:I*p,y:yn,width:v,height:pt}),I=ee,_=0,K=0}const ht=Math.abs(C[L]||0),ut=Math.abs(y[L]||0);ht>_&&(_=ht),ut>K&&(K=ut)}return b}({channelData:e,barIndexScale:h,barSpacing:m,barWidth:c,halfHeight:l,vScale:r,canvasHeight:o,barAlign:t.barAlign,barMinHeight:d});n.beginPath();for(const u of f)a&&"roundRect"in n?n.roundRect(u.x,u.y,u.width,u.height,a):n.rect(u.x,u.y,u.width,u.height);n.fill(),n.closePath()}renderLineWaveform(e,t,n,r){const{width:s,height:o}=n.canvas,l=function({channelData:c,width:a,height:h,vScale:m}){const d=h/2,f=c[0]||[];return[f,c[1]||f].map((u,g)=>{const p=u.length,v=p?a/p:0,E=d,S=g===0?-1:1,x=[{x:0,y:E}];let R=0,k=0;for(let C=0;C<=p;C++){const y=Math.round(C*v);if(y>R){const b=E+(Math.round(k*d*m)||1)*S;x.push({x:R,y:b}),R=y,k=0}const T=Math.abs(u[C]||0);T>k&&(k=T)}return x.push({x:R,y:E}),x})}({channelData:e,width:s,height:o,vScale:r});n.beginPath();for(const c of l)if(c.length){n.moveTo(c[0].x,c[0].y);for(let a=1;a<c.length;a++){const h=c[a];n.lineTo(h.x,h.y)}}n.fill(),n.closePath()}renderWaveform(e,t,n){if(n.fillStyle=this.convertColorValues(t.waveColor,n),t.renderFunction)return void t.renderFunction(e,n);const r=function({channelData:s,barHeight:o,normalize:l,maxPeak:c}){var a;const h=o||1;if(!l)return h;const m=s[0];if(!m||m.length===0)return h;let d=c??0;if(!c)for(let f=0;f<m.length;f++){const u=(a=m[f])!==null&&a!==void 0?a:0,g=Math.abs(u);g>d&&(d=g)}return d?h/d:h}({channelData:e,barHeight:t.barHeight,normalize:t.normalize,maxPeak:t.maxPeak});Vt(t)?this.renderBarWaveform(e,t,n,r):this.renderLineWaveform(e,t,n,r)}renderSingleCanvas(e,t,n,r,s,o,l){const c=this.getPixelRatio(),a=document.createElement("canvas");a.width=Math.round(n*c),a.height=Math.round(r*c),a.style.width=`${n}px`,a.style.height=`${r}px`,a.style.left=`${Math.round(s)}px`,o.appendChild(a);const h=a.getContext("2d");if(t.renderFunction?(h.fillStyle=this.convertColorValues(t.waveColor,h),t.renderFunction(e,h)):this.renderWaveform(e,t,h),a.width>0&&a.height>0){const m=a.cloneNode(),d=m.getContext("2d");d.drawImage(a,0,0),d.globalCompositeOperation="source-in",d.fillStyle=this.convertColorValues(t.progressColor,d),d.fillRect(0,0,a.width,a.height),l.appendChild(m)}}renderMultiCanvas(e,t,n,r,s,o){const l=this.getPixelRatio(),{clientWidth:c}=this.scrollContainer,a=n/l,h=function({clientWidth:u,totalWidth:g,options:p}){return gt(Math.min(8e3,u,g),p)}({clientWidth:c,totalWidth:a,options:t});let m={};if(h===0)return;const d=u=>{if(u<0||u>=f||m[u])return;m[u]=!0;const g=u*h;let p=Math.min(a-g,h);if(p=gt(p,t),p<=0)return;const v=function({channelData:E,offset:S,clampedWidth:x,totalWidth:R}){return E.map(k=>{const C=Math.floor(S/R*k.length),y=Math.floor((S+x)/R*k.length);return k.slice(C,y)})}({channelData:e,offset:g,clampedWidth:p,totalWidth:a});this.renderSingleCanvas(v,t,p,r,g,s,o)},f=Math.ceil(a/h);if(!this.isScrollable){for(let u=0;u<f;u++)d(u);return}if(vt({scrollLeft:this.scrollContainer.scrollLeft,totalWidth:a,numCanvases:f}).forEach(u=>d(u)),f>1){const u=this.on("scroll",()=>{const{scrollLeft:g}=this.scrollContainer;Object.keys(m).length>10&&(s.innerHTML="",o.innerHTML="",m={}),vt({scrollLeft:g,totalWidth:a,numCanvases:f}).forEach(p=>d(p))});this.unsubscribeOnScroll.push(u)}}renderChannel(e,t,n,r){var{overlay:s}=t,o=function(h,m){var d={};for(var f in h)Object.prototype.hasOwnProperty.call(h,f)&&m.indexOf(f)<0&&(d[f]=h[f]);if(h!=null&&typeof Object.getOwnPropertySymbols=="function"){var u=0;for(f=Object.getOwnPropertySymbols(h);u<f.length;u++)m.indexOf(f[u])<0&&Object.prototype.propertyIsEnumerable.call(h,f[u])&&(d[f[u]]=h[f[u]])}return d}(t,["overlay"]);const l=document.createElement("div"),c=this.getHeight(o.height,o.splitChannels);l.style.height=`${c}px`,s&&r>0&&(l.style.marginTop=`-${c}px`),this.canvasWrapper.style.minHeight=`${c}px`,this.canvasWrapper.appendChild(l);const a=l.cloneNode();this.progressWrapper.appendChild(a),this.renderMultiCanvas(e,o,n,c,l,a)}render(e){return A(this,void 0,void 0,function*(){var t;this.timeouts.forEach(a=>a()),this.timeouts=[],this.unsubscribeOnScroll.forEach(a=>a()),this.unsubscribeOnScroll=[],this.canvasWrapper.innerHTML="",this.progressWrapper.innerHTML="",this.options.width!=null&&(this.scrollContainer.style.width=typeof this.options.width=="number"?`${this.options.width}px`:this.options.width);const n=this.getPixelRatio(),r=this.scrollContainer.clientWidth-this.containerInlinePadding,{scrollWidth:s,isScrollable:o,useParentWidth:l,width:c}=function({duration:a,minPxPerSec:h=0,parentWidth:m,fillParent:d,pixelRatio:f}){const u=Math.ceil(a*h),g=u>m,p=!!(d&&!g);return{scrollWidth:u,isScrollable:g,useParentWidth:p,width:(p?m:u)*f}}({duration:e.duration,minPxPerSec:this.options.minPxPerSec||0,parentWidth:r,fillParent:this.options.fillParent,pixelRatio:n});if(this.isScrollable=o,this.wrapper.style.width=l?"100%":`${s}px`,this.scrollContainer.style.overflowX=this.isScrollable?"auto":"hidden",this.scrollContainer.classList.toggle("noScrollbar",!!this.options.hideScrollbar),this.cursor.style.backgroundColor=`${this.options.cursorColor||this.options.progressColor}`,this.cursor.style.width=`${this.options.cursorWidth}px`,this.audioData=e,this.emit("render"),this.options.splitChannels)for(let a=0;a<e.numberOfChannels;a++){const h=Object.assign(Object.assign({},this.options),(t=this.options.splitChannels)===null||t===void 0?void 0:t[a]);this.renderChannel([e.getChannelData(a)],h,c,a)}else{const a=[e.getChannelData(0)];e.numberOfChannels>1&&a.push(e.getChannelData(1)),this.renderChannel(a,this.options,c,0)}Promise.resolve().then(()=>this.emit("rendered"))})}reRender(){if(this.unsubscribeOnScroll.forEach(n=>n()),this.unsubscribeOnScroll=[],!this.audioData)return;const{scrollWidth:e}=this.scrollContainer,{right:t}=this.progressWrapper.getBoundingClientRect();if(this.render(this.audioData),!this.isScrollable&&this.scrollContainer.scrollLeft)this.scrollContainer.scrollLeft=0;else if(this.isScrollable&&e!==this.scrollContainer.scrollWidth){const{right:n}=this.progressWrapper.getBoundingClientRect(),r=function(s){const o=2*s;return(o<0?Math.floor(o):Math.ceil(o))/2}(n-t);this.scrollContainer.scrollLeft+=r}}zoom(e){this.options.minPxPerSec=e,this.reRender()}scrollIntoView(e,t=!1){var n;const{scrollLeft:r,scrollWidth:s,clientWidth:o}=this.scrollContainer,l=e*s,c=r,a=r+o,h=o/2;if(this.isDragging)l+30>a?this.scrollContainer.scrollLeft+=30:l-30<c&&(this.scrollContainer.scrollLeft-=30);else{(l<c||l>a)&&(this.scrollContainer.scrollLeft=l-(this.options.autoCenter?h:0));const m=l-r-h;if(t&&this.options.autoCenter&&m>0){const d=(n=this.audioData)===null||n===void 0?void 0:n.duration;if(d===void 0||d<=0)return void(this.scrollContainer.scrollLeft+=m);const f=s/d;this.scrollContainer.scrollLeft+=f<=600?Math.min(m,10):m}}}renderProgress(e,t){if(isNaN(e))return;const n=100*e;this.canvasWrapper.style.clipPath=`polygon(${n}% 0%, 100% 0%, 100% 100%, ${n}% 100%)`,this.progressWrapper.style.width=`${n}%`,this.cursor.style.left=`${n}%`,this.cursor.style.transform=this.options.cursorWidth?`translateX(-${e*this.options.cursorWidth}px)`:"",this.isScrollable&&this.options.autoScroll&&this.audioData&&this.audioData.duration>0&&this.scrollIntoView(e,t)}exportImage(e,t,n){return A(this,void 0,void 0,function*(){const r=this.canvasWrapper.querySelectorAll("canvas");if(!r.length)throw new Error("No waveform data");if(n==="dataURL"){const s=Array.from(r).map(o=>o.toDataURL(e,t));return Promise.resolve(s)}return Promise.all(Array.from(r).map(s=>new Promise((o,l)=>{s.toBlob(c=>{c?o(c):l(new Error("Could not export image"))},e,t)})))})}}class Rn extends xe{constructor(){super(...arguments),this.animationFrameId=null,this.isRunning=!1}start(){if(this.isRunning)return;this.isRunning=!0;const e=()=>{this.isRunning&&(this.emit("tick"),this.animationFrameId=requestAnimationFrame(e))};e()}stop(){this.isRunning=!1,this.animationFrameId!==null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null)}destroy(){this.stop(),this.unAll()}}class qe extends xe{constructor(e){super(),this.bufferNode=null,this.playStartTime=0,this.playbackPosition=0,this._muted=!1,this._playbackRate=1,this._duration=void 0,this.buffer=null,this.currentSrc="",this.paused=!0,this.crossOrigin=null,this.seeking=!1,this.autoplay=!1,this.addEventListener=this.on,this.removeEventListener=this.un,this._destroyed=!1,function(){const t=globalThis.navigator;if(t!=null&&t.audioSession)try{t.audioSession.type="playback"}catch(n){console.warn("Setting navigator.audioSession.type failed:",n)}}(),this.audioContext=e||new AudioContext,this.gainNode=this.audioContext.createGain(),this.gainNode.connect(this.audioContext.destination)}load(){return A(this,void 0,void 0,function*(){})}remove(){this.destroy()}destroy(){if(!this._destroyed){if(this._destroyed=!0,this.currentSrc="",this.bufferNode){this.bufferNode.onended=null;try{this.bufferNode.stop()}catch{}this.bufferNode.disconnect(),this.bufferNode=null}this.gainNode.disconnect(),typeof this.audioContext.close=="function"&&Promise.resolve(this.audioContext.close.call(this.audioContext)).catch(()=>{}),this.buffer=null,this.unAll()}}get src(){return this.currentSrc}set src(e){if(this.currentSrc=e,this._duration=void 0,!e)return this.buffer=null,void this.emit("emptied");fetch(e).then(t=>{if(t.status>=400)throw new Error(`Failed to fetch ${e}: ${t.status} (${t.statusText})`);return t.arrayBuffer()}).then(t=>this.currentSrc!==e?null:this.audioContext.decodeAudioData(t)).then(t=>{this.currentSrc===e&&(this.buffer=t,this.emit("loadedmetadata"),this.emit("canplay"),this.autoplay&&this.play())}).catch(t=>{console.error("WebAudioPlayer load error:",t)})}_play(){if(!this.paused)return;this.paused=!1,this.bufferNode&&(this.bufferNode.onended=null,this.bufferNode.disconnect()),this.bufferNode=this.audioContext.createBufferSource(),this.buffer&&(this.bufferNode.buffer=this.buffer),this.bufferNode.playbackRate.value=this._playbackRate,this.bufferNode.connect(this.gainNode);let e=this.playbackPosition;(e>=this.duration||e<0)&&(e=0,this.playbackPosition=0),this.bufferNode.start(this.audioContext.currentTime,e),this.playStartTime=this.audioContext.currentTime,this.bufferNode.onended=()=>{!this.paused&&this.duration-this.currentTime<.01&&(this.pause(),this.emit("ended"))}}_pause(){if(this.paused=!0,this.bufferNode){this.bufferNode.onended=null;try{this.bufferNode.stop()}catch{}}this.playbackPosition+=(this.audioContext.currentTime-this.playStartTime)*this._playbackRate}play(){return A(this,void 0,void 0,function*(){this.paused&&(this._play(),this.emit("play"))})}pause(){this.paused||(this._pause(),this.emit("pause"))}stopAt(e){const t=(e-this.currentTime)/this._playbackRate,n=this.bufferNode;n==null||n.stop(this.audioContext.currentTime+t),n==null||n.addEventListener("ended",()=>{n===this.bufferNode&&(this.bufferNode=null,this.pause(),this.playbackPosition=Math.min(e,this.duration),this.emit("timeupdate"))},{once:!0})}setSinkId(e){return A(this,void 0,void 0,function*(){return this.audioContext.setSinkId(e)})}get playbackRate(){return this._playbackRate}set playbackRate(e){const t=!this.paused;t&&this._pause(),this._playbackRate=e,t&&this._play(),this.bufferNode&&(this.bufferNode.playbackRate.value=e)}get currentTime(){return this.paused?this.playbackPosition:this.playbackPosition+(this.audioContext.currentTime-this.playStartTime)*this._playbackRate}set currentTime(e){const t=!this.paused;t&&this._pause(),this.playbackPosition=e,t&&this._play(),this.emit("seeking"),this.emit("timeupdate")}get duration(){var e,t;return(e=this._duration)!==null&&e!==void 0?e:((t=this.buffer)===null||t===void 0?void 0:t.duration)||0}set duration(e){this._duration=e}get volume(){return this.gainNode.gain.value}set volume(e){this.gainNode.gain.value=e,this.emit("volumechange")}get muted(){return this._muted}set muted(e){this._muted!==e&&(this._muted=e,this._muted?this.gainNode.disconnect():this.gainNode.connect(this.audioContext.destination))}canPlayType(e){return/^(audio|video)\//.test(e)}getGainNode(){return this.gainNode}getChannelData(){const e=[];if(!this.buffer)return e;const t=this.buffer.numberOfChannels;for(let n=0;n<t;n++)e.push(this.buffer.getChannelData(n));return e}removeAttribute(e){switch(e){case"src":this.src="";break;case"playbackRate":this.playbackRate=0;break;case"currentTime":this.currentTime=0;break;case"duration":this.duration=0;break;case"volume":this.volume=0;break;case"muted":this.muted=!1}}}const Dn={waveColor:"#999",progressColor:"#555",cursorWidth:1,minPxPerSec:0,fillParent:!0,interact:!0,dragToSeek:!1,autoScroll:!0,autoCenter:!0,sampleRate:8e3};class Ee extends Cn{static create(e){return new Ee(e)}getState(){return this.wavesurferState}getRenderer(){return this.renderer}constructor(e){const t=e.media||(e.backend==="WebAudio"?new qe:void 0);super({media:t,mediaControls:e.mediaControls,autoplay:e.autoplay,playbackRate:e.audioRate}),this.plugins=[],this.decodedData=null,this.stopAtPosition=null,this.subscriptions=[],this.mediaSubscriptions=[],this.abortController=null,this._isDestroyed=!1,this._loadVersion=0,this.reactiveCleanups=[],this.options=Object.assign({},Dn,e);const{state:n,actions:r}=function(l){var c,a,h,m,d,f;const u=(c=l==null?void 0:l.currentTime)!==null&&c!==void 0?c:M(0),g=(a=l==null?void 0:l.duration)!==null&&a!==void 0?a:M(0),p=(h=l==null?void 0:l.isPlaying)!==null&&h!==void 0?h:M(!1),v=(m=l==null?void 0:l.isSeeking)!==null&&m!==void 0?m:M(!1),E=(d=l==null?void 0:l.volume)!==null&&d!==void 0?d:M(1),S=(f=l==null?void 0:l.playbackRate)!==null&&f!==void 0?f:M(1),x=M(null),R=M(null),k=M(""),C=M(0),y=M(0),T=re(()=>!p.value,[p]),b=re(()=>x.value!==null,[x]),I=re(()=>b.value&&g.value>0,[b,g]),_=re(()=>u.value,[u]),K=re(()=>g.value>0?u.value/g.value:0,[u,g]);return{state:{currentTime:u,duration:g,isPlaying:p,isPaused:T,isSeeking:v,volume:E,playbackRate:S,audioBuffer:x,peaks:R,url:k,zoom:C,scrollPosition:y,canPlay:b,isReady:I,progress:_,progressPercent:K},actions:{setCurrentTime:L=>{const ee=Math.max(0,Math.min(g.value||1/0,L));u.set(ee)},setDuration:L=>{g.set(Math.max(0,L))},setPlaying:L=>{p.set(L)},setSeeking:L=>{v.set(L)},setVolume:L=>{const ee=Math.max(0,Math.min(1,L));E.set(ee)},setPlaybackRate:L=>{const ee=Math.max(.1,Math.min(16,L));S.set(ee)},setAudioBuffer:L=>{x.set(L),L&&g.set(L.duration)},setPeaks:L=>{R.set(L)},setUrl:L=>{k.set(L)},setZoom:L=>{C.set(Math.max(0,L))},setScrollPosition:L=>{y.set(Math.max(0,L))}}}}({isPlaying:this.isPlayingSignal,currentTime:this.currentTimeSignal,duration:this.durationSignal,volume:this.volumeSignal,playbackRate:this.playbackRateSignal,isSeeking:this.seekingSignal});this.wavesurferState=n,this.wavesurferActions=r,this.timer=new Rn;const s=t?void 0:this.getMediaElement();this.renderer=new Sn(this.options,s),this.initPlayerEvents(),this.initRendererEvents(),this.initTimerEvents(),this.initReactiveState(),this.initPlugins();const o=this.options.url||this.getSrc()||"";Promise.resolve().then(()=>{this.emit("init");const{peaks:l,duration:c}=this.options;(o||l&&c)&&this.load(o,l,c).catch(()=>{})})}updateProgress(e=this.getCurrentTime()){return this.renderer.renderProgress(e/this.getDuration(),this.isPlaying()),e}initTimerEvents(){this.subscriptions.push(this.timer.on("tick",()=>{if(!this.isSeeking()){const e=this.updateProgress();if(this.emit("timeupdate",e),this.emit("audioprocess",e),this.stopAtPosition!=null&&this.isPlaying()&&e>=this.stopAtPosition){const t=this.stopAtPosition;this.pause(),this.setTime(t)}}}))}initReactiveState(){this.reactiveCleanups.push(function(e,t){const n=[];n.push(q(()=>{const o=e.isPlaying.value;t.emit(o?"play":"pause")},[e.isPlaying])),n.push(q(()=>{const o=e.currentTime.value;t.emit("timeupdate",o),e.isPlaying.value&&t.emit("audioprocess",o)},[e.currentTime,e.isPlaying])),n.push(q(()=>{e.isSeeking.value&&t.emit("seeking",e.currentTime.value)},[e.isSeeking,e.currentTime]));let r=!1;n.push(q(()=>{e.isReady.value&&!r&&(r=!0,t.emit("ready",e.duration.value))},[e.isReady,e.duration])),n.push(q(()=>{e.audioBuffer.value===null&&(r=!1)},[e.audioBuffer]));let s=!1;return n.push(q(()=>{const o=e.isPlaying.value,l=e.currentTime.value,c=e.duration.value,a=c>0&&l>=c;s&&!o&&a&&t.emit("finish"),s=o&&a},[e.isPlaying,e.currentTime,e.duration])),n.push(q(()=>{const o=e.zoom.value;o>0&&t.emit("zoom",o)},[e.zoom])),()=>{n.forEach(o=>o())}}(this.wavesurferState,{emit:this.emit.bind(this)}))}initPlayerEvents(){this.isPlaying()&&(this.emit("play"),this.timer.start()),this.mediaSubscriptions.push(this.onMediaEvent("timeupdate",()=>{const e=this.updateProgress();this.emit("timeupdate",e)}),this.onMediaEvent("play",()=>{this.emit("play"),this.timer.start()}),this.onMediaEvent("pause",()=>{this.emit("pause"),this.timer.stop(),this.stopAtPosition=null}),this.onMediaEvent("emptied",()=>{this.timer.stop(),this.stopAtPosition=null}),this.onMediaEvent("ended",()=>{this.emit("timeupdate",this.getDuration()),this.emit("finish"),this.stopAtPosition=null}),this.onMediaEvent("seeking",()=>{this.emit("seeking",this.getCurrentTime())}),this.onMediaEvent("error",()=>{var e;this.emit("error",(e=this.getMediaElement().error)!==null&&e!==void 0?e:new Error("Media error")),this.stopAtPosition=null}))}initRendererEvents(){this.subscriptions.push(this.renderer.on("click",(e,t)=>{this.options.interact&&(this.seekTo(e),this.emit("interaction",e*this.getDuration()),this.emit("click",e,t))}),this.renderer.on("dblclick",(e,t)=>{this.emit("dblclick",e,t)}),this.renderer.on("scroll",(e,t,n,r)=>{const s=this.getDuration();this.emit("scroll",e*s,t*s,n,r)}),this.renderer.on("render",()=>{this.emit("redraw")}),this.renderer.on("rendered",()=>{this.emit("redrawcomplete")}),this.renderer.on("dragstart",e=>{this.emit("dragstart",e)}),this.renderer.on("dragend",e=>{this.emit("dragend",e)}),this.renderer.on("resize",()=>{this.emit("resize")}));{let e;const t=this.renderer.on("drag",n=>{var r;if(!this.options.interact)return;this.renderer.renderProgress(n),clearTimeout(e);let s=0;const o=this.options.dragToSeek;this.isPlaying()?s=0:o===!0?s=200:o&&typeof o=="object"&&(s=(r=o.debounceTime)!==null&&r!==void 0?r:200),e=setTimeout(()=>{this.seekTo(n)},s),this.emit("interaction",n*this.getDuration()),this.emit("drag",n)});this.subscriptions.push(()=>{clearTimeout(e),t()})}}initPlugins(){var e;!((e=this.options.plugins)===null||e===void 0)&&e.length&&this.options.plugins.forEach(t=>{this.registerPlugin(t)})}unsubscribePlayerEvents(){this.mediaSubscriptions.forEach(e=>e()),this.mediaSubscriptions=[]}setOptions(e){this.options=Object.assign({},this.options,e),e.duration&&!e.peaks&&(this.decodedData=ke.createBuffer(this.exportPeaks(),e.duration)),e.peaks&&e.duration&&(this.decodedData=ke.createBuffer(e.peaks,e.duration)),this.renderer.setOptions(this.options),e.audioRate&&this.setPlaybackRate(e.audioRate),e.mediaControls!=null&&(this.getMediaElement().controls=e.mediaControls)}registerPlugin(e){if(this.plugins.includes(e))return e;e._init(this),this.plugins.push(e);const t=e.once("destroy",()=>{this.plugins=this.plugins.filter(n=>n!==e),this.subscriptions=this.subscriptions.filter(n=>n!==t)});return this.subscriptions.push(t),e}unregisterPlugin(e){this.plugins=this.plugins.filter(t=>t!==e),e.destroy()}getWrapper(){return this.renderer.getWrapper()}getWidth(){return this.renderer.getWidth()}getScroll(){return this.renderer.getScroll()}setScroll(e){return this.renderer.setScroll(e)}setScrollTime(e){const t=e/this.getDuration();this.renderer.setScrollPercentage(t)}getActivePlugins(){return this.plugins}loadAudio(e,t,n,r){return A(this,void 0,void 0,function*(){var s;const o=++this._loadVersion;if(this._isDestroyed=!1,this.emit("load",e),!this.options.media&&this.isPlaying()&&this.pause(),this.decodedData=null,this.stopAtPosition=null,(s=this.abortController)===null||s===void 0||s.abort(),this.abortController=null,!t&&!n){const c=this.options.fetchParams||{};window.AbortController&&!c.signal&&(this.abortController=new AbortController,c.signal=this.abortController.signal);const a=m=>this.emit("loading",m);if(t=yield xn.fetchBlob(e,a,c),this._isDestroyed||o!==this._loadVersion)return;const h=this.options.blobMimeType;h&&(t=new Blob([t],{type:h}))}if(this._isDestroyed||o!==this._loadVersion)return;this.setSrc(e,t);const l=yield new Promise(c=>{const a=r||this.getDuration();a?c(a):this.mediaSubscriptions.push(this.onMediaEvent("loadedmetadata",()=>c(this.getDuration()),{once:!0}))});if(!this._isDestroyed&&o===this._loadVersion){if(!e&&!t){const c=this.getMediaElement();c instanceof qe&&(c.duration=l)}if(n)this.decodedData=ke.createBuffer(n,l||0);else if(t){const c=yield t.arrayBuffer();if(this._isDestroyed||o!==this._loadVersion)return;this.decodedData=yield ke.decode(c,this.options.sampleRate)}this._isDestroyed||o!==this._loadVersion||(this.decodedData&&(this.emit("decode",this.getDuration()),this.renderer.render(this.decodedData)),this.emit("ready",this.getDuration()))}})}load(e,t,n){return A(this,void 0,void 0,function*(){try{return yield this.loadAudio(e,void 0,t,n)}catch(r){throw this.emit("error",r),r}})}loadBlob(e,t,n){return A(this,void 0,void 0,function*(){try{return yield this.loadAudio("",e,t,n)}catch(r){throw this.emit("error",r),r}})}zoom(e){if(!this.decodedData)throw new Error("No audio loaded");this.renderer.zoom(e),this.emit("zoom",e)}getDecodedData(){return this.decodedData}exportPeaks({channels:e=2,maxLength:t=8e3,precision:n=1e4}={}){if(!this.decodedData)throw new Error("The audio has not been decoded yet");const r=Math.min(e,this.decodedData.numberOfChannels),s=[];for(let o=0;o<r;o++){const l=this.decodedData.getChannelData(o),c=[],a=l.length/t;for(let h=0;h<t;h++){const m=l.slice(Math.floor(h*a),Math.ceil((h+1)*a));let d=0;for(let f=0;f<m.length;f++){const u=m[f];Math.abs(u)>Math.abs(d)&&(d=u)}c.push(Math.round(d*n)/n)}s.push(c)}return s}getDuration(){let e=super.getDuration()||0;return e!==0&&e!==1/0||!this.decodedData||(e=this.decodedData.duration),e}toggleInteraction(e){this.options.interact=e}setTime(e){this.stopAtPosition=null,super.setTime(e),this.updateProgress(e),this.emit("timeupdate",e)}seekTo(e){const t=this.getDuration()*e;this.setTime(t)}play(e,t){const n=Object.create(null,{play:{get:()=>super.play}});return A(this,void 0,void 0,function*(){e!=null&&this.setTime(e);const r=yield n.play.call(this);return t!=null&&(this.media instanceof qe?this.media.stopAt(t):this.stopAtPosition=t),r})}playPause(){return A(this,void 0,void 0,function*(){return this.isPlaying()?this.pause():this.play()})}stop(){this.pause(),this.setTime(0)}skip(e){this.setTime(this.getCurrentTime()+e)}empty(){this.load("",[[0]],.001)}setMediaElement(e){this.unsubscribePlayerEvents(),super.setMediaElement(e),this.initPlayerEvents()}exportImage(){return A(this,arguments,void 0,function*(e="image/png",t=1,n="dataURL"){return this.renderer.exportImage(e,t,n)})}destroy(){var e;this._isDestroyed=!0,this.emit("destroy"),(e=this.abortController)===null||e===void 0||e.abort(),this.plugins.forEach(t=>t.destroy()),this.subscriptions.forEach(t=>t()),this.unsubscribePlayerEvents(),this.reactiveCleanups.forEach(t=>t()),this.reactiveCleanups=[],this.timer.destroy(),this.renderer.destroy(),super.destroy()}}Ee.BasePlugin=class extends xe{constructor(i){super(),this.subscriptions=[],this.isDestroyed=!1,this.options=i}onInit(){}_init(i){this.isDestroyed&&(this.subscriptions=[],this.isDestroyed=!1),this.wavesurfer=i,this.onInit()}destroy(){this.emit("destroy"),this.subscriptions.forEach(i=>i()),this.subscriptions=[],this.isDestroyed=!0,this.wavesurfer=void 0}},Ee.dom=En;class Kt{constructor(){this.listeners={}}on(e,t,n){if(this.listeners[e]||(this.listeners[e]=new Set),n==null?void 0:n.once){const r=(...s)=>{this.un(e,r),t(...s)};return this.listeners[e].add(r),()=>this.un(e,r)}return this.listeners[e].add(t),()=>this.un(e,t)}un(e,t){var n;(n=this.listeners[e])===null||n===void 0||n.delete(t)}once(e,t){return this.on(e,t,{once:!0})}unAll(){this.listeners={}}emit(e,...t){this.listeners[e]&&this.listeners[e].forEach(n=>n(...t))}}class Pn extends Kt{constructor(e){super(),this.subscriptions=[],this.isDestroyed=!1,this.options=e}onInit(){}_init(e){this.isDestroyed&&(this.subscriptions=[],this.isDestroyed=!1),this.wavesurfer=e,this.onInit()}destroy(){this.emit("destroy"),this.subscriptions.forEach(e=>e()),this.subscriptions=[],this.isDestroyed=!0,this.wavesurfer=void 0}}function qt(i,e){const t=e.xmlns?document.createElementNS(e.xmlns,i):document.createElement(i);for(const[n,r]of Object.entries(e))if(n==="children"&&r)for(const[s,o]of Object.entries(r))o instanceof Node?t.appendChild(o):typeof o=="string"?t.appendChild(document.createTextNode(o)):t.appendChild(qt(s,o));else n==="style"?Object.assign(t.style,r):n==="textContent"?t.textContent=r:t.setAttribute(n,r.toString());return t}function be(i,e,t){const n=qt(i,e||{});return t==null||t.appendChild(n),n}function Jt(i){let e=i;const t=new Set;return{get value(){return e},set(n){Object.is(e,n)||(e=n,t.forEach(r=>r(e)))},update(n){this.set(n(e))},subscribe:n=>(t.add(n),()=>t.delete(n))}}function De(i,e){let t;const n=()=>{t&&(t(),t=void 0),t=i()},r=e.map(s=>s.subscribe(n));return n(),()=>{t&&(t(),t=void 0),r.forEach(s=>s())}}function he(i,e){const t=Jt(null),n=r=>{t.set(r)};return i.addEventListener(e,n),t._cleanup=()=>{i.removeEventListener(e,n)},t}function ie(i){const e=i._cleanup;typeof e=="function"&&e()}function Pe(i,e={}){const{threshold:t=3,mouseButton:n=0,touchDelay:r=100}=e,s=Jt(null),o=new Map,l=matchMedia("(pointer: coarse)").matches;let c=()=>{};const a=h=>{if(h.button!==n||o.has(h.pointerId)||(o.set(h.pointerId,h),o.size>1))return;const m=h.pointerId;let d=h.clientX,f=h.clientY,u=!1;const g=Date.now(),p=i.getBoundingClientRect(),{left:v,top:E}=p,S=y=>{if(y.pointerId!==m||y.defaultPrevented||o.size>1||l&&Date.now()-g<r)return;const T=y.clientX,b=y.clientY,I=T-d,_=b-f;(u||Math.abs(I)>t||Math.abs(_)>t)&&(y.preventDefault(),y.stopPropagation(),u||(s.set({type:"start",x:d-v,y:f-E}),u=!0),s.set({type:"move",x:T-v,y:b-E,deltaX:I,deltaY:_}),d=T,f=b)},x=y=>{if(o.delete(y.pointerId)){if(y.pointerId===m&&u){const T=y.clientX,b=y.clientY;s.set({type:"end",x:T-v,y:b-E})}o.size===0&&c()}},R=y=>{y.relatedTarget&&y.relatedTarget!==document.documentElement||x(y)},k=y=>{u&&(y.stopPropagation(),y.preventDefault())},C=y=>{y.defaultPrevented||o.size>1||u&&y.preventDefault()};document.addEventListener("pointermove",S),document.addEventListener("pointerup",x),document.addEventListener("pointerout",R),document.addEventListener("pointercancel",R),document.addEventListener("touchmove",C,{passive:!1}),document.addEventListener("click",k,{capture:!0}),c=()=>{document.removeEventListener("pointermove",S),document.removeEventListener("pointerup",x),document.removeEventListener("pointerout",R),document.removeEventListener("pointercancel",R),document.removeEventListener("touchmove",C),setTimeout(()=>{document.removeEventListener("click",k,{capture:!0})},10)}};return i.addEventListener("pointerdown",a),{signal:s,cleanup:()=>{c(),i.removeEventListener("pointerdown",a),o.clear(),ie(s)}}}class bt extends Kt{constructor(e,t,n=0){var r,s,o,l,c,a,h,m,d,f;super(),this.totalDuration=t,this.numberOfChannels=n,this.element=null,this.minLength=0,this.maxLength=1/0,this.contentEditable=!1,this.subscriptions=[],this.updatingSide=void 0,this.isRemoved=!1,this.subscriptions=[],this.id=e.id||`region-${Math.random().toString(32).slice(2)}`,this.start=this.clampPosition(e.start),this.end=this.clampPosition((r=e.end)!==null&&r!==void 0?r:e.start),this.drag=(s=e.drag)===null||s===void 0||s,this.resize=(o=e.resize)===null||o===void 0||o,this.resizeStart=(l=e.resizeStart)===null||l===void 0||l,this.resizeEnd=(c=e.resizeEnd)===null||c===void 0||c,this.color=(a=e.color)!==null&&a!==void 0?a:"rgba(0, 0, 0, 0.1)",this.minLength=(h=e.minLength)!==null&&h!==void 0?h:this.minLength,this.maxLength=(m=e.maxLength)!==null&&m!==void 0?m:this.maxLength,this.channelIdx=(d=e.channelIdx)!==null&&d!==void 0?d:-1,this.contentEditable=(f=e.contentEditable)!==null&&f!==void 0?f:this.contentEditable,this.element=this.initElement(),this.setContent(e.content),this.setPart(),this.renderPosition(),this.initMouseEvents()}clampPosition(e){return Math.max(0,Math.min(this.totalDuration,e))}setPart(){var e;const t=this.start===this.end;(e=this.element)===null||e===void 0||e.setAttribute("part",`${t?"marker":"region"} ${this.id}`)}addResizeHandles(e){const t={position:"absolute",zIndex:"2",width:"6px",height:"100%",top:"0",cursor:"ew-resize",wordBreak:"keep-all"},n=be("div",{part:"region-handle region-handle-left",style:Object.assign(Object.assign({},t),{left:"0",borderLeft:"2px solid rgba(0, 0, 0, 0.5)",borderRadius:"2px 0 0 2px"})},e),r=be("div",{part:"region-handle region-handle-right",style:Object.assign(Object.assign({},t),{right:"0",borderRight:"2px solid rgba(0, 0, 0, 0.5)",borderRadius:"0 2px 2px 0"})},e),s=Pe(n,{threshold:1}),o=Pe(r,{threshold:1}),l=De(()=>{const a=s.signal.value;a&&(a.type==="move"&&a.deltaX!==void 0?this.onResize(a.deltaX,"start"):a.type==="end"&&this.onEndResizing("start"))},[s.signal]),c=De(()=>{const a=o.signal.value;a&&(a.type==="move"&&a.deltaX!==void 0?this.onResize(a.deltaX,"end"):a.type==="end"&&this.onEndResizing("end"))},[o.signal]);this.subscriptions.push(()=>{l(),c(),s.cleanup(),o.cleanup()})}removeResizeHandles(e){const t=e.querySelector('[part*="region-handle-left"]'),n=e.querySelector('[part*="region-handle-right"]');t&&e.removeChild(t),n&&e.removeChild(n)}initElement(){if(this.isRemoved)return null;const e=this.start===this.end;let t=0,n=100;this.channelIdx>=0&&this.numberOfChannels>0&&this.channelIdx<this.numberOfChannels&&(n=100/this.numberOfChannels,t=n*this.channelIdx);const r=be("div",{style:{position:"absolute",top:`${t}%`,height:`${n}%`,backgroundColor:e?"none":this.color,borderLeft:e?"2px solid "+this.color:"none",borderRadius:"2px",boxSizing:"border-box",transition:"background-color 0.2s ease",cursor:this.drag?"grab":"default",pointerEvents:"all"}});return!e&&this.resize&&this.addResizeHandles(r),r}renderPosition(){if(!this.element)return;const e=this.start/this.totalDuration,t=(this.totalDuration-this.end)/this.totalDuration;this.element.style.left=100*e+"%",this.element.style.right=100*t+"%"}toggleCursor(e){var t;this.drag&&(!((t=this.element)===null||t===void 0)&&t.style)&&(this.element.style.cursor=e?"grabbing":"grab")}initMouseEvents(){const{element:e}=this;if(!e)return;const t=he(e,"click"),n=he(e,"mouseenter"),r=he(e,"mouseleave"),s=he(e,"dblclick"),o=he(e,"pointerdown"),l=he(e,"pointerup"),c=t.subscribe(p=>p&&this.emit("click",p)),a=n.subscribe(p=>p&&this.emit("over",p)),h=r.subscribe(p=>p&&this.emit("leave",p)),m=s.subscribe(p=>p&&this.emit("dblclick",p)),d=o.subscribe(p=>p&&this.toggleCursor(!0)),f=l.subscribe(p=>p&&this.toggleCursor(!1));this.subscriptions.push(()=>{c(),a(),h(),m(),d(),f(),ie(t),ie(n),ie(r),ie(s),ie(o),ie(l)});const u=Pe(e),g=De(()=>{const p=u.signal.value;p&&(p.type==="start"?this.toggleCursor(!0):p.type==="move"&&p.deltaX!==void 0?this.onMove(p.deltaX):p.type==="end"&&(this.toggleCursor(!1),this.drag&&this.emit("update-end")))},[u.signal]);this.subscriptions.push(()=>{g(),u.cleanup()}),this.contentEditable&&this.content&&(this.contentClickListener=p=>this.onContentClick(p),this.contentBlurListener=()=>this.onContentBlur(),this.content.addEventListener("click",this.contentClickListener),this.content.addEventListener("blur",this.contentBlurListener))}_onUpdate(e,t,n){var r;if(!(!((r=this.element)===null||r===void 0)&&r.parentElement))return;const{width:s}=this.element.parentElement.getBoundingClientRect(),o=e/s*this.totalDuration;let l=t&&t!=="start"?this.start:this.start+o,c=t&&t!=="end"?this.end:this.end+o;const a=n!==void 0;a&&this.updatingSide&&this.updatingSide!==t&&(this.updatingSide==="start"?l=n:c=n),l=Math.max(0,l),c=Math.min(this.totalDuration,c);const h=c-l;this.updatingSide=t;const m=h>=this.minLength&&h<=this.maxLength;l<=c&&(m||a)&&(this.start=l,this.end=c,this.renderPosition(),this.emit("update",t))}onMove(e){this.drag&&this._onUpdate(e)}onResize(e,t){this.resize&&(this.resizeStart||t!=="start")&&(this.resizeEnd||t!=="end")&&this._onUpdate(e,t)}onEndResizing(e){this.resize&&(this.emit("update-end",e),this.updatingSide=void 0)}onContentClick(e){e.stopPropagation(),e.target.focus(),this.emit("click",e)}onContentBlur(){this.emit("update-end")}_setTotalDuration(e){this.totalDuration=e,this.renderPosition()}play(e){this.emit("play",e&&this.end!==this.start?this.end:void 0)}getContent(e=!1){var t;return e?this.content||void 0:this.element instanceof HTMLElement?((t=this.content)===null||t===void 0?void 0:t.innerHTML)||void 0:""}setContent(e){var t;if(this.element)if(this.content&&this.contentEditable&&(this.contentClickListener&&this.content.removeEventListener("click",this.contentClickListener),this.contentBlurListener&&this.content.removeEventListener("blur",this.contentBlurListener)),(t=this.content)===null||t===void 0||t.remove(),e){if(typeof e=="string"){const n=this.start===this.end;this.content=be("div",{style:{padding:`0.2em ${n?.2:.4}em`,display:"inline-block"},textContent:e})}else this.content=e;this.contentEditable&&(this.content.contentEditable="true",this.contentClickListener=n=>this.onContentClick(n),this.contentBlurListener=()=>this.onContentBlur(),this.content.addEventListener("click",this.contentClickListener),this.content.addEventListener("blur",this.contentBlurListener)),this.content.setAttribute("part","region-content"),this.element.appendChild(this.content),this.emit("content-changed")}else this.content=void 0}setOptions(e){var t,n;if(this.element){if(e.color&&(this.color=e.color,this.element.style.backgroundColor=this.color),e.drag!==void 0&&(this.drag=e.drag,this.element.style.cursor=this.drag?"grab":"default"),e.start!==void 0||e.end!==void 0){const r=this.start===this.end;this.start=this.clampPosition((t=e.start)!==null&&t!==void 0?t:this.start),this.end=this.clampPosition((n=e.end)!==null&&n!==void 0?n:r?this.start:this.end),this.renderPosition(),this.setPart(),this.emit("render")}if(e.content&&this.setContent(e.content),e.id&&(this.id=e.id,this.setPart()),e.resize!==void 0&&e.resize!==this.resize){const r=this.start===this.end;this.resize=e.resize,this.resize&&!r?this.addResizeHandles(this.element):this.removeResizeHandles(this.element)}e.resizeStart!==void 0&&(this.resizeStart=e.resizeStart),e.resizeEnd!==void 0&&(this.resizeEnd=e.resizeEnd)}}remove(){this.isRemoved=!0,this.emit("remove"),this.subscriptions.forEach(e=>e()),this.subscriptions=[],this.content&&this.contentEditable&&(this.contentClickListener&&(this.content.removeEventListener("click",this.contentClickListener),this.contentClickListener=void 0),this.contentBlurListener&&(this.content.removeEventListener("blur",this.contentBlurListener),this.contentBlurListener=void 0)),this.element&&(this.element.remove(),this.element=null),this.unAll()}}class et extends Pn{constructor(e){super(e),this.regions=[],this.regionsContainer=this.initRegionsContainer()}static create(e){return new et(e)}onInit(){if(!this.wavesurfer)throw Error("WaveSurfer is not initialized");this.wavesurfer.getWrapper().appendChild(this.regionsContainer),this.subscriptions.push(this.wavesurfer.on("ready",t=>{this.regions.forEach(n=>n._setTotalDuration(t))}));let e=[];this.subscriptions.push(this.wavesurfer.on("timeupdate",t=>{const n=this.regions.filter(r=>r.start<=t&&(r.end===r.start?r.start+.05:r.end)>=t);n.forEach(r=>{e.includes(r)||this.emit("region-in",r)}),e.forEach(r=>{n.includes(r)||this.emit("region-out",r)}),e=n}))}initRegionsContainer(){return be("div",{part:"regions-container",style:{position:"absolute",top:"0",left:"0",width:"100%",height:"100%",zIndex:"5",pointerEvents:"none"}})}getRegions(){return this.regions}avoidOverlapping(e){e.content&&!e.isRemoved&&setTimeout(()=>{if(!e.content)return;const t=e.content;t.style.marginTop="0";const n=t.getBoundingClientRect(),r=this.regions.indexOf(e);if(r<0)return;const s=this.regions.slice(0,r).filter(o=>!o.isRemoved).reduce((o,l)=>{if(l===e||!l.content)return o;const c=l.content.getBoundingClientRect();return n.left<c.right&&c.left<n.right&&o.push(c),o},[]).sort((o,l)=>o.top-l.top).reduce((o,l)=>{const c=n.top+o,a=c+n.height;return c<l.bottom&&l.top<a?l.bottom-n.top+2:o},0);t.style.marginTop=`${s}px`},10)}avoidOverlappingAll(){this.regions.forEach(e=>this.avoidOverlapping(e))}adjustScroll(e){var t,n;if(!e.element)return;const r=(n=(t=this.wavesurfer)===null||t===void 0?void 0:t.getWrapper())===null||n===void 0?void 0:n.parentElement;if(!r)return;const{clientWidth:s,scrollWidth:o}=r;if(o<=s)return;const l=r.getBoundingClientRect(),c=e.element.getBoundingClientRect(),a=c.left-l.left,h=c.right-l.left;a<0?r.scrollLeft+=a:h>s&&(r.scrollLeft+=h-s)}virtualAppend(e,t,n){const r=()=>{if(!this.wavesurfer)return;const s=this.wavesurfer.getWidth(),o=this.wavesurfer.getScroll(),l=t.clientWidth,c=this.wavesurfer.getDuration(),a=Math.round(e.start/c*l),h=a+(Math.round((e.end-e.start)/c*l)||1)>o&&a<o+s;h&&!n.parentElement?t.appendChild(n):!h&&n.parentElement&&n.remove()};setTimeout(()=>{if(!this.wavesurfer||!e.element)return;r();const s=this.wavesurfer.on("scroll",r),o=this.wavesurfer.on("zoom",r),l=this.wavesurfer.on("resize",r),c=e.on("render",r);this.subscriptions.push(s,o,l,c),e.once("remove",()=>{s(),o(),l(),c()})},0)}saveRegion(e){if(!e.element)return;this.virtualAppend(e,this.regionsContainer,e.element),this.avoidOverlapping(e),this.regions.push(e);const t=[e.on("update",n=>{n||this.adjustScroll(e),this.emit("region-update",e,n)}),e.on("update-end",n=>{this.avoidOverlappingAll(),this.emit("region-updated",e,n)}),e.on("play",n=>{var r;(r=this.wavesurfer)===null||r===void 0||r.play(e.start,n)}),e.on("click",n=>{this.emit("region-clicked",e,n)}),e.on("dblclick",n=>{this.emit("region-double-clicked",e,n)}),e.on("content-changed",()=>{this.emit("region-content-changed",e)}),e.once("remove",()=>{t.forEach(n=>n()),this.regions=this.regions.filter(n=>n!==e),this.emit("region-removed",e)})];this.subscriptions.push(...t),this.emit("region-created",e)}addRegion(e){var t,n;if(!this.wavesurfer)throw Error("WaveSurfer is not initialized");const r=this.wavesurfer.getDuration(),s=(n=(t=this.wavesurfer)===null||t===void 0?void 0:t.getDecodedData())===null||n===void 0?void 0:n.numberOfChannels,o=new bt(e,r,s);return this.emit("region-initialized",o),r?this.saveRegion(o):this.subscriptions.push(this.wavesurfer.once("ready",l=>{o._setTotalDuration(l),this.saveRegion(o)})),o}enableDragSelection(e,t=3){var n;const r=(n=this.wavesurfer)===null||n===void 0?void 0:n.getWrapper();if(!(r&&r instanceof HTMLElement))return()=>{};let s=null,o=0,l=0;const c=Pe(r,{threshold:t}),a=De(()=>{var h,m;const d=c.signal.value;if(d)if(d.type==="start"){if(o=d.x,!this.wavesurfer)return;const f=this.wavesurfer.getDuration(),u=(m=(h=this.wavesurfer)===null||h===void 0?void 0:h.getDecodedData())===null||m===void 0?void 0:m.numberOfChannels,{width:g}=this.wavesurfer.getWrapper().getBoundingClientRect();l=o/g*f;const p=d.x/g*f,v=(d.x+5)/g*f;s=new bt(Object.assign(Object.assign({},e),{start:p,end:v}),f,u),this.emit("region-initialized",s),s.element&&this.regionsContainer.appendChild(s.element)}else d.type==="move"&&d.deltaX!==void 0?s&&s._onUpdate(d.deltaX,d.x>o?"end":"start",l):d.type==="end"&&s&&(this.saveRegion(s),s.updatingSide=void 0,s=null)},[c.signal]);return()=>{a(),c.cleanup()}}clearRegions(){this.regions.slice().forEach(e=>e.remove()),this.regions=[]}destroy(){this.clearRegions(),super.destroy(),this.regionsContainer.remove()}}const Gt={lead:"主角",supporting:"配角",mascot:"吉祥物"},Z={lead:"#3b82f6",supporting:"#64748b",mascot:"#ec4899"},yt=[{name:"迪迪",role:"lead"},{name:"克克",role:"lead"},{name:"林林",role:"lead"},{name:"泰泰",role:"lead"},{name:"怪氣流",role:"mascot"},{name:"田鼠先生",role:"mascot"},{name:"田鼠太太",role:"mascot"},{name:"吵鬧菇",role:"mascot"},{name:"穿山甲大叔",role:"supporting"},{name:"花福導遊",role:"supporting"},{name:"達東爸",role:"supporting"},{name:"達東媽",role:"supporting"},{name:"村長",role:"supporting"},{name:"卡爾博士",role:"supporting"},{name:"小達東",role:"supporting"},{name:"阿桂",role:"supporting"}];function Yt(i,e){if(!i)return null;const t=e.find(n=>n.name===i);return t?Z[t.role]:null}const Zt="voicepicker.author",Qt="voicepicker.comments",en="voicepicker.characters";function Mn(){return localStorage.getItem(Zt)??""}function Tn(i){localStorage.setItem(Zt,i)}function Nn(i){const e=i??{};return{id:typeof e.id=="string"?e.id:Math.random().toString(36).slice(2),author:typeof e.author=="string"?e.author:"",text:typeof e.text=="string"?e.text:"",created:typeof e.created=="number"?e.created:Date.now()}}function Fe(i){const e=i??{},t=e.character;let n;Array.isArray(t)?n=t.filter(s=>typeof s=="string"):typeof t=="string"?n=[t]:n=[];const r=Array.isArray(e.replies)?e.replies.map(Nn):[];return{id:typeof e.id=="string"?e.id:Math.random().toString(36).slice(2),file:typeof e.file=="string"?e.file:"",time:typeof e.time=="number"?e.time:null,text:typeof e.text=="string"?e.text:"",author:typeof e.author=="string"?e.author:"",character:n,replies:r,rating:typeof e.rating=="number"?Math.min(5,Math.max(0,Math.round(e.rating))):0}}function On(){try{const i=localStorage.getItem(Qt);return i?JSON.parse(i).map(Fe):[]}catch{return[]}}function tt(i){localStorage.setItem(Qt,JSON.stringify(i))}function _n(){try{const i=localStorage.getItem(en);return i?JSON.parse(i):[...yt]}catch{return[...yt]}}function Ae(i){localStorage.setItem(en,JSON.stringify(i))}const zn=`<!DOCTYPE html>
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
.cfile-badge { margin-left: 3px; font-size: 12px; }
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
  const isBad = c.rating === 0;
  const ratingHighlight = isTrophy ? ' trophy' : isBad ? ' bad' : '';
  card.className = 'citem' + ratingHighlight;
  if (isTrophy) card.classList.add('trophy');
  else if (isBad) card.classList.add('bad');
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
  if (isTrophy || isBad) {
    const badgeEl = document.createElement('span');
    badgeEl.className = 'cfile-badge';
    badgeEl.textContent = isTrophy ? '🏆' : '👎';
    fileEl.appendChild(badgeEl);
  }
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
`,An=new Set(["wav","mp3","m4a","aac","ogg","flac","wma","opus"]),Et=4,In=1.5,Bn=.25,nt="voicepicker.json";let N=[],j=-1,Le=null,H="single",U=0,X=null,xt,Me,Ie=null,te=Mn(),P=On(),O=_n(),it=0,ae=!0,le=[],z="text",fe=null,Y=null,Be=null,B=[],W=0,Ce=null,Te="rating",ue=!1,J="all",oe=0;const Wn=50,Ne=[];function ge(){Ne.push(JSON.parse(JSON.stringify(P))),Ne.length>Wn&&Ne.shift()}const w=i=>document.getElementById(i),Ct=w("pick"),wt=w("exportBtn"),kt=w("importBtn"),Oe=w("importFile"),Lt=w("editChars"),St=w("roleViewBtn"),Rt=w("filelist"),tn=w("nowplaying"),rt=w("status"),We=w("playBtn"),Hn=w("appVer"),$n=w("sidebar"),Fn=w("player"),_e=w("grid"),$=w("roleview"),Un=w("comments"),jn=w("commentsHead"),ze=w("commentlist"),st=w("composer"),pe=w("composerToggle"),ve=w("composerText"),nn=w("composerChars"),Dt=w("composerRatingEl"),Ue=w("nameModal"),He=w("nameInput"),ot=w("charModal"),Pt=w("charEditList"),Je=w("newCharName"),Vn=w("newCharRole"),rn=w("addCharBtn"),Xn=w("closeCharBtn"),Mt=w("ratingsBtn"),se=w("shareBtn"),D=Ee.create({container:"#waveform",waveColor:"#7a8ba6",progressColor:"#3b82f6",cursorColor:"#ef4444",height:120}),Ge=D.registerPlugin(et.create());D.on("ready",()=>{rt.textContent=`${$e(0)} / ${$e(D.getDuration())}`});D.on("timeupdate",i=>{rt.textContent=`${$e(i)} / ${$e(D.getDuration())}`});D.on("play",()=>{We.textContent="⏸ 暫停",H==="role"&&we()});D.on("pause",()=>{We.textContent="▶ 播放",H==="role"&&we()});D.on("finish",()=>{H==="single"&&j<N.length-1?ne(j+1):H==="role"&&(Ce=null,we())});Ge.on("region-clicked",(i,e)=>{e.stopPropagation(),D.setTime(i.start),D.play()});We.addEventListener("click",()=>{We.blur(),D.playPause()});function at(i){if(!isFinite(i))return"0:00";const e=Math.floor(i/60),t=Math.floor(i%60).toString().padStart(2,"0");return`${e}:${t}`}function $e(i){if(!isFinite(i))return"0:00.00";const e=Math.floor(i/60),t=Math.floor(i%60),n=Math.floor((i-Math.floor(i))*100);return`${e}:${t.toString().padStart(2,"0")}.${n.toString().padStart(2,"0")}`}function sn(){return Math.random().toString(36).slice(2)+Date.now().toString(36)}function Ye(i){return i.code==="Enter"||i.code==="NumpadEnter"}function lt(i,e){const t=i.indexOf(e);t>=0?i.splice(t,1):i.push(e)}function me(i){return i.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}function je(){return j>=0&&j<N.length?N[j].name:null}function Kn(){return H==="grid"?U>=0&&U<N.length?N[U].name:null:je()}function ct(i){return i?P.filter(e=>e.file===i).sort((e,t)=>(e.time??-1/0)-(t.time??-1/0)):[]}function on(i){return P.filter(e=>e.file===i).length}function qn(i){return(i.length?Yt(i[0],O):null)??"#3b82f6"}function Jn(){const i=Ne.pop();if(!i){Qe("沒有可還原的操作");return}P=i,V(),Qe("已還原")}function V(){an(),Xe(),Ve(),de(),H==="role"&&ce()}function Q(){var i;de(),H==="role"&&ce(),Y&&((i=(H==="role"?$:ze).querySelector(".creply-input input"))==null||i.focus())}function an(){tt(P),X&&(window.clearTimeout(xt),xt=window.setTimeout(()=>void Gn(),300))}async function Gn(){if(X)try{const e=await(await X.getFileHandle(nt,{create:!0})).createWritable();await e.write(JSON.stringify({version:1,updated:new Date().toISOString(),comments:P},null,2)),await e.close()}catch{}}function ln(i){const e=new Map(P.map(t=>[t.id,t]));i.forEach(t=>e.set(t.id,t)),P=[...e.values()]}async function Yn(){if(X)try{const e=await(await X.getFileHandle(nt)).getFile(),t=JSON.parse(await e.text());Array.isArray(t==null?void 0:t.comments)&&(ln(t.comments.map(Fe)),tt(P))}catch{}}function Zn(){const i=JSON.stringify({version:1,exported:new Date().toISOString(),comments:P,characters:O},null,2),e=new Blob([i],{type:"application/json"}),t=URL.createObjectURL(e),n=new Date,r=l=>String(l).padStart(2,"0"),s=`${n.getFullYear()}${r(n.getMonth()+1)}${r(n.getDate())}-${r(n.getHours())}${r(n.getMinutes())}`,o=document.createElement("a");o.href=t,o.download=`voicepicker-backup-${s}.json`,o.click(),URL.revokeObjectURL(t)}async function Qn(i){try{const e=JSON.parse(await i.text());Array.isArray(e==null?void 0:e.comments)&&ln(e.comments.map(Fe)),Array.isArray(e==null?void 0:e.characters)&&e.characters.length>0&&(O=e.characters,Ae(O)),V(),alert(`匯入完成：目前共 ${P.length} 則留言。`)}catch{alert("匯入失敗：檔案不是有效的 VoicePicker 備份。")}}wt.addEventListener("click",()=>{wt.blur(),Zn()});kt.addEventListener("click",()=>{kt.blur(),Oe.click()});Oe.addEventListener("change",()=>{var e;const i=(e=Oe.files)==null?void 0:e[0];i&&Qn(i),Oe.value=""});Ct.addEventListener("click",async()=>{var e;Ct.blur();const i=window.showDirectoryPicker;if(!i){alert("此瀏覽器不支援資料夾選取，請改用 Chrome / Edge。");return}try{X=await i({mode:"readwrite"})}catch{return}N=[];for await(const[t,n]of X.entries()){if(n.kind!=="file")continue;const r=((e=t.split(".").pop())==null?void 0:e.toLowerCase())??"";An.has(r)&&N.push({name:t,handle:n})}N.sort((t,n)=>t.name.localeCompare(n.name,"zh-Hant",{numeric:!0})),await Yn(),Ie=Date.now(),pi(),vn(),Ve(),N.length>0?(U=0,ne(0)):tn.textContent="此資料夾沒有音檔"});function Ve(){Rt.innerHTML="",N.forEach((i,e)=>{const t=document.createElement("li");e===j&&(t.className="active");const n=document.createElement("span");n.textContent=i.name,n.style.overflow="hidden",n.style.textOverflow="ellipsis",t.appendChild(n);const r=on(i.name);if(r>0){const s=document.createElement("span");s.className="badge",s.textContent=String(r),t.appendChild(s)}t.addEventListener("click",()=>void ne(e)),Rt.appendChild(t)})}async function ne(i){if(i<0||i>=N.length)return;j=i,U=i,Ve();const e=N[i];tn.textContent=e.name,rt.textContent="載入中…";const t=await e.handle.getFile();Le&&URL.revokeObjectURL(Le),Le=URL.createObjectURL(t),await D.load(Le),Xe(),de(),D.play()}function Xe(){Ge.clearRegions(),ct(je()).filter(e=>e.time!==null).forEach((e,t)=>{Ge.addRegion({start:e.time,content:String(t+1),color:qn(e.character),drag:!1,resize:!1})})}function ei(i,e){const t=document.createElement("div");t.className="c-rating";for(let n=1;n<=5;n++){const r=document.createElement("button");r.type="button",r.className="c-star"+(n<=i.rating?" filled":""),r.textContent="★",r.title=`${n} 分${n===1?"（1星再按清除）":""}`,r.addEventListener("click",s=>{s.stopPropagation(),ge(),i.rating=n===1&&i.rating===1?0:n,V()}),t.appendChild(r)}e.appendChild(t)}function cn(i,e={}){const t=document.createElement("div"),n=e.badge==="🏆"?" trophy":e.badge==="👎"?" bad":"";t.className="citem"+(e.role?" role":"")+(e.focused?" rolefocus":"")+n,e.role&&e.ridx!==void 0&&(t.dataset.ridx=String(e.ridx));let r=t;if(e.role){const d=document.createElement("div");d.className="card-inner";const f=document.createElement("div");f.className="card-main";const u=document.createElement("button");u.className="cplay",u.dataset.cid=i.id,u.textContent=Ce===i.id&&D.isPlaying()?"⏸":"▶",u.addEventListener("click",g=>{g.stopPropagation(),un(i,e.ridx)}),d.append(f,u),t.appendChild(d),r=f}const s=document.createElement("div");s.className="crow";const o=document.createElement("span");if(i.time===null?(o.className="ctime general",o.textContent="整體"):(o.className="ctime",o.textContent=at(i.time),o.addEventListener("click",d=>{d.stopPropagation(),Ze(i)})),s.appendChild(o),e.role){const d=document.createElement("span");if(d.className="cfile",d.textContent=i.file,e.badge){const f=document.createElement("span");f.className="cfile-badge",f.textContent=e.badge,d.appendChild(f)}d.addEventListener("click",f=>{f.stopPropagation(),Ze(i)}),s.appendChild(d)}const l=document.createElement("span");l.className="cauthor",l.textContent=i.author,s.appendChild(l);const c=document.createElement("button");c.className="cdel",c.textContent="×",c.title="刪除",c.addEventListener("click",d=>{d.stopPropagation(),ge(),P=P.filter(f=>f.id!==i.id),V()}),s.appendChild(c),r.appendChild(s),ei(i,r);const a=document.createElement("div");a.className="ctext",a.textContent=i.text,a.addEventListener("dblclick",d=>{d.stopPropagation(),a.contentEditable="true",a.focus()}),a.addEventListener("keydown",d=>{d.isComposing||d.key==="Enter"&&!d.shiftKey&&(d.preventDefault(),a.blur())}),a.addEventListener("blur",()=>{a.contentEditable="false";const d=(a.innerText??"").trim();d&&d!==i.text?(ge(),i.text=d,V()):a.textContent=i.text}),r.appendChild(a);const h=document.createElement("div");if(h.className="ctag-row",ti(i,h),r.appendChild(h),i.replies.length){const d=document.createElement("div");d.className="creplies",i.replies.forEach(f=>{const u=document.createElement("div");u.className="creply";const g=document.createElement("span");g.className="crauthor",g.textContent=f.author+"：";const p=document.createElement("span");p.textContent=f.text;const v=document.createElement("button");v.className="crdel",v.textContent="×",v.addEventListener("click",E=>{E.stopPropagation(),ge(),i.replies=i.replies.filter(S=>S.id!==f.id),V()}),u.append(g,p,v),d.appendChild(u)}),r.appendChild(d)}const m=document.createElement("div");if(m.className="creply-input",Y===i.id){const d=document.createElement("input");d.type="text",d.placeholder="回覆…（Enter 送出 / Esc 取消）",d.addEventListener("keydown",u=>{u.stopPropagation(),!u.isComposing&&(u.key==="Enter"?(u.preventDefault(),Nt(i,d.value)):u.key==="Escape"&&(u.preventDefault(),Y=null,Q()))});const f=document.createElement("button");f.textContent="送出",f.addEventListener("click",u=>{u.stopPropagation(),Nt(i,d.value)}),m.append(d,f)}else{const d=document.createElement("button");d.className="creply-toggle",d.textContent="＋ 回覆",d.addEventListener("click",f=>{if(f.stopPropagation(),!te){Ke(()=>{Y=i.id,Q()});return}Y=i.id,Q()}),m.appendChild(d)}return r.appendChild(m),t}function ti(i,e){if(fe===i.id){const t=document.createElement("div");t.className="char-picker",pn(t,i.character,r=>{ge(),lt(i.character,r),V()});const n=document.createElement("button");n.type="button",n.className="charchip done",n.textContent="完成",n.addEventListener("click",r=>{r.stopPropagation(),fe=null,Q()}),t.appendChild(n),e.appendChild(t)}else if(i.character.length>0)i.character.forEach(t=>{const n=document.createElement("span");n.className="ctag",n.style.background=Yt(t,O)??"#3b82f6",n.textContent=t,n.addEventListener("click",r=>{r.stopPropagation(),fe=i.id,Q()}),e.appendChild(n)});else{const t=document.createElement("span");t.className="ctag empty",t.textContent="＋ 角色",t.addEventListener("click",n=>{n.stopPropagation(),fe=i.id,Q()}),e.appendChild(t)}}function de(){const i=Kn();jn.textContent=i?`留言 · ${i}`:"留言",ze.innerHTML="";const e=ct(i);if(e.length===0){const t=document.createElement("li");t.style.color="var(--muted)",t.style.fontSize="13px",t.textContent=i?"尚無留言。播放時按 C 新增。":"尚未選擇檔案。",ze.appendChild(t);return}e.forEach(t=>ze.appendChild(cn(t)))}function dn(i,e){const t=[...i];return e==="rating"?t.sort((n,r)=>r.rating-n.rating||n.file.localeCompare(r.file,"zh-Hant",{numeric:!0})||(n.time??-1/0)-(r.time??-1/0)):e==="file"?t.sort((n,r)=>n.file.localeCompare(r.file,"zh-Hant",{numeric:!0})||(n.time??-1/0)-(r.time??-1/0)):t.sort((n,r)=>n.author.localeCompare(r.author,"zh-Hant")||n.file.localeCompare(r.file,"zh-Hant",{numeric:!0})||(n.time??-1/0)-(r.time??-1/0)),t}function ni(i){let e=P.filter(t=>t.character.includes(i));return J==="hide"?e=e.filter(t=>t.rating>0):J==="solo"&&(e=e.filter(t=>t.rating===0)),dn(e,Te)}function ce(){$.innerHTML="",B=[],$.classList.toggle("role-compact",ue);const i=document.createElement("div");i.className="role-head";const e=document.createElement("h2");e.textContent="角色 Dashboard";const t=document.createElement("button");t.className="ghost",t.textContent="返回單檔",t.addEventListener("click",()=>G("single"));const n=document.createElement("span");n.className="role-hint",n.textContent="↑↓ 移動 · 空白鍵 就地播放 · Enter 進單檔 · Tab/Esc 返回";const r=document.createElement("div");r.className="role-sort-toggle",["rating","file","user"].forEach(p=>{const v=p==="rating"?"評分":p==="file"?"檔案":"使用者",E=document.createElement("button");E.className="role-sort-btn"+(Te===p?" active":""),E.textContent=v,E.addEventListener("click",()=>{Te=p,ce()}),r.appendChild(E)});const s=document.createElement("button");s.className="role-compact-btn"+(ue?" active":""),s.textContent="簡潔",s.title="隱藏回覆與角色標籤，雙欄顯示",s.addEventListener("click",()=>{ue=!ue,$.classList.toggle("role-compact",ue),s.classList.toggle("active",ue)});const o={all:"hide",hide:"solo",solo:"all"},l={all:"隱藏 👎",hide:"solo 👎",solo:"全部留言"},c=document.createElement("button");c.className="role-zero-btn"+(J!=="all"?" "+J:""),c.textContent=l[J],c.addEventListener("click",()=>{J=o[J],ce()}),i.append(e,t,n,r,s,c);const a=document.createElement("div");a.className="role-sticky",a.appendChild(i);const h=["lead","mascot","supporting"],m=P.filter(p=>p.character.length===0).length,d=document.createElement("div");d.className="role-stats-wrap";let f=null;if(h.forEach(p=>{const v=O.filter(x=>x.role===p);if(v.length===0)return;const E=document.createElement("div");E.className="role-stats-row",p==="supporting"&&(f=E);const S=document.createElement("span");S.className="role-stats-type",S.textContent=Gt[p],S.style.color=Z[p],E.appendChild(S),v.forEach(x=>{const R=P.filter(C=>C.character.includes(x.name)).length,k=document.createElement("button");k.className="role-stat"+(R===0?" zero":""),k.style.background=Z[x.role],k.textContent=`${x.name} ${R}`,k.addEventListener("click",()=>{var C;(C=$.querySelector(`[data-char="${x.name}"]`))==null||C.scrollIntoView({behavior:"smooth",block:"start"})}),E.appendChild(k)}),d.appendChild(E)}),m>0){const p=document.createElement("button");if(p.className="role-stat",p.style.background="#64748b",p.textContent=`未指定 ${m}`,p.addEventListener("click",()=>{var v;(v=$.querySelector('[data-char="__none__"]'))==null||v.scrollIntoView({behavior:"smooth",block:"start"})}),f)f.appendChild(p);else{const v=document.createElement("div");v.className="role-stats-row",v.appendChild(p),d.appendChild(v)}}a.appendChild(d),$.appendChild(a);const u=(p,v,E)=>{if(E.length===0)return;const S=document.createElement("div");S.className="role-group",S.dataset.char=p;const x=document.createElement("div");x.className="role-group-label",x.style.background=v,x.textContent=p==="__none__"?"未指定":p,S.appendChild(x);const R=document.createElement("div");R.className="role-group-cards-wrap";const k=E.reduce((C,y)=>Math.max(C,y.rating),0);E.forEach(C=>{const y=B.length,T=C.rating===0?"👎":k>0&&C.rating===k?"🏆":void 0,b=cn(C,{role:!0,ridx:y,focused:y===W,badge:T});T==="🏆"?b.classList.add("trophy"):T==="👎"&&b.classList.add("bad"),R.appendChild(b),B.push(C)}),S.appendChild(R),$.appendChild(S)};O.forEach(p=>u(p.name,Z[p.role],ni(p.name)));let g=P.filter(p=>p.character.length===0);if(J==="hide"?g=g.filter(p=>p.rating>0):J==="solo"&&(g=g.filter(p=>p.rating===0)),u("__none__","#64748b",dn(g,Te)),B.length===0){const p=document.createElement("div");p.style.color="var(--muted)",p.textContent="尚無留言。",$.appendChild(p)}W>=B.length&&(W=Math.max(0,B.length-1))}function we(){$.querySelectorAll(".cplay").forEach(i=>{i.textContent=Ce===i.dataset.cid&&D.isPlaying()?"⏸":"▶"})}function hn(){$.querySelectorAll(".citem").forEach(i=>{const e=i.dataset.ridx===String(W);i.classList.toggle("rolefocus",e),e&&i.scrollIntoView({block:"nearest"})})}function Tt(i){B.length!==0&&(W=Math.min(Math.max(0,W+i),B.length-1),hn())}async function ii(i,e){const t=N.findIndex(r=>r.name===i.file);if(t<0)return;t!==j&&await ne(t),D.setTime(i.time??0),D.play(),Ce=i.id;const n=e!==void 0?e:B.indexOf(i);n>=0&&(W=n,hn()),we()}function un(i,e){if(Ce===i.id&&D.isPlaying()){D.pause(),we();return}ii(i,e)}async function Ze(i){const e=N.findIndex(t=>t.name===i.file);e<0||(H!=="single"&&G("single"),e!==j&&await ne(e),i.time!==null&&D.setTime(i.time),D.play())}function pn(i,e,t,n){i.innerHTML="",O.forEach((r,s)=>{const o=document.createElement("button");o.type="button",o.className="charchip"+(s===n?" focused":""),o.textContent=r.name,o.style.borderColor=Z[r.role],e.includes(r.name)&&(o.style.background=Z[r.role],o.style.color="#fff"),o.addEventListener("click",l=>{l.stopPropagation(),t(r.name)}),i.appendChild(o)})}function Nt(i,e){const t=e.trim();if(!t){Y=null,Q();return}const n=()=>{i.replies.push({id:sn(),author:te,text:t,created:Date.now()}),Y=null,V()};te?n():Ke(n)}function ri(){if(!(j<0)){if(!te){Ke(()=>Ot());return}Ot()}}function Ot(){D.pause(),it=D.getCurrentTime(),ae=!0,ve.value="",le=[],oe=0,z="text",F(),st.classList.remove("hidden"),ve.focus()}function mn(){st.classList.add("hidden"),z="text"}function dt(){Dt.innerHTML="";for(let i=1;i<=5;i++){const e=document.createElement("button");e.type="button",e.className="c-star"+(i<=oe?" filled":""),e.textContent="★",e.title=`${i} 分`,e.addEventListener("click",t=>{t.stopPropagation(),oe=i===1&&oe===1?0:i,dt()}),Dt.appendChild(e)}}function F(){si(),fn(),dt()}function si(){ae?(pe.textContent=`對應秒數 ${at(it)}`,pe.classList.remove("off")):(pe.textContent="整體留言（不對應秒數）",pe.classList.add("off")),pe.classList.toggle("focused",z==="toggle")}function fn(){pn(nn,le,e=>{lt(le,e),fn()},typeof z=="number"?z:void 0)}function _t(){const i=ve.value.trim();if(mn(),!i)return;const e=je();e&&(P.push({id:sn(),file:e,time:ae?it:null,text:i,author:te,character:[...le],replies:[],rating:oe}),V())}function zt(){z="toggle",ve.blur(),F()}function At(){z="text",F(),ve.focus()}function oi(){if(O.length===0)return;const i=le.length?O.findIndex(e=>e.name===le[0]):-1;z=i>=0?i:0,ve.blur(),F()}function ai(i){lt(le,O[i].name),F()}function Se(i,e){const t=Array.from(nn.children);if(t.length===0)return i;const n=t.map(h=>h.getBoundingClientRect()),r=n[i],s=r.left+r.width/2,o=r.top+r.height/2,l=r.height/2;if(e==="left"||e==="right"){let h=-1,m=1/0;return n.forEach((d,f)=>{if(f===i||Math.abs(d.top+d.height/2-o)>l)return;const u=d.left+d.width/2;e==="left"&&u<s&&s-u<m&&(m=s-u,h=f),e==="right"&&u>s&&u-s<m&&(m=u-s,h=f)}),h>=0?h:i}let c=-1,a=1/0;return n.forEach((h,m)=>{if(m===i)return;const d=h.top+h.height/2;if(!(e==="up"?d<o-l:d>o+l))return;const u=Math.abs(d-o)*1e3+Math.abs(h.left+h.width/2-s);u<a&&(a=u,c=m)}),e==="up"&&c<0?"toggle":c>=0?c:i}function li(i){if(i.isComposing)return;if(i.shiftKey&&/^Digit[0-5]$/.test(i.code)){i.preventDefault();const t=parseInt(i.code[5]);oe=t===0||t===1&&oe===1?0:t,dt();return}if(i.code==="Escape"){i.preventDefault(),mn();return}if(z==="text"){if(Ye(i)&&!i.shiftKey){i.preventDefault(),_t();return}if(i.code==="ArrowDown"||i.code==="Tab"){i.preventDefault(),zt();return}return}if(Ye(i)){i.preventDefault(),_t();return}if(z==="toggle"){switch(i.code){case"Space":i.preventDefault(),ae=!ae,F();break;case"ArrowUp":i.preventDefault(),At();break;case"ArrowDown":case"Tab":i.preventDefault(),oi();break}return}const e=z;switch(i.code){case"Space":i.preventDefault(),ai(e);break;case"ArrowRight":{i.preventDefault();const t=Se(e,"right");typeof t=="number"&&(z=t,F());break}case"ArrowLeft":{i.preventDefault();const t=Se(e,"left");typeof t=="number"&&(z=t,F());break}case"ArrowDown":{i.preventDefault();const t=Se(e,"down");typeof t=="number"&&(z=t,F());break}case"ArrowUp":{i.preventDefault();const t=Se(e,"up");t==="toggle"?zt():(z=t,F());break}case"Tab":i.preventDefault(),At();break}}pe.addEventListener("click",()=>{ae=!ae,F()});function Ke(i){Be=i,He.value=te,Ue.classList.remove("hidden"),He.focus()}function ci(){const i=He.value.trim();if(!i)return;te=i,Tn(i),Ue.classList.add("hidden");const e=Be;Be=null,e&&e()}He.addEventListener("keydown",i=>{i.stopPropagation(),!i.isComposing&&(i.key==="Enter"?(i.preventDefault(),ci()):i.key==="Escape"&&(i.preventDefault(),Ue.classList.add("hidden"),Be=null))});Lt.addEventListener("click",()=>{Lt.blur(),ye(),ot.classList.remove("hidden")});function ye(){Pt.innerHTML="",O.forEach((i,e)=>{const t=document.createElement("li"),n=document.createElement("span");n.className="dot",n.style.background=Z[i.role];const r=document.createElement("span");r.textContent=i.name,r.title="雙擊重命名",r.style.cursor="pointer",r.addEventListener("dblclick",()=>{const l=document.createElement("input");l.type="text",l.value=i.name,l.style.cssText="font-size:13px;width:120px;padding:2px 6px",t.replaceChild(l,r),l.focus(),l.select();const c=()=>{const a=l.value.trim();if(a&&a!==i.name){const h=i.name;i.name=a,P.forEach(m=>{const d=m.character.indexOf(h);d>=0&&(m.character[d]=a)}),Ae(O),an()}ye()};l.addEventListener("keydown",a=>{a.stopPropagation(),a.key==="Enter"?(a.preventDefault(),c()):a.key==="Escape"&&(a.preventDefault(),ye())}),l.addEventListener("blur",c)});const s=document.createElement("span");s.className="role",s.textContent=Gt[i.role];const o=document.createElement("button");o.className="rm",o.textContent="刪除",o.addEventListener("click",()=>{O.splice(e,1),Ae(O),ye()}),t.append(n,r,s,o),Pt.appendChild(t)})}rn.addEventListener("click",()=>{const i=Je.value.trim();i&&(O.push({name:i,role:Vn.value}),Ae(O),Je.value="",ye())});Je.addEventListener("keydown",i=>{i.stopPropagation(),!i.isComposing&&i.key==="Enter"&&(i.preventDefault(),rn.click())});Xn.addEventListener("click",()=>{ot.classList.add("hidden"),Xe(),de(),H==="role"&&ce()});function It(i){const e=D.getDuration();!isFinite(e)||e===0||D.setTime(Math.min(Math.max(0,D.getCurrentTime()+i),e))}function Bt(i){const e=ct(je()).filter(r=>r.time!==null).map(r=>r.time);if(e.length===0)return;const t=D.getCurrentTime();let n;if(i<0){for(let r=e.length-1;r>=0;r--)if(e[r]<t-In){n=e[r];break}n??(n=e[0])}else{for(let r=0;r<e.length;r++)if(e[r]>t+Bn){n=e[r];break}n??(n=e[e.length-1])}D.setTime(n)}function G(i){H=i;const e=i==="single",t=i==="grid",n=i==="role";(t||n)&&D.pause(),$n.classList.toggle("hidden",!e),Fn.classList.toggle("hidden",!e),_e.classList.toggle("hidden",!t),$.classList.toggle("hidden",!n),Un.classList.toggle("hidden",n),t&&gn(),n&&(W=0,ce()),de()}function gn(){_e.innerHTML="";const i=document.createElement("div");i.className="gridhint",i.textContent="WASD／方向鍵 移動 · 空白鍵或 Enter 開啟 · Tab 返回單檔",_e.appendChild(i),N.forEach((e,t)=>{const n=document.createElement("div");n.className="gridcard"+(t===U?" selected":""),n.innerHTML=`<div class="gc-name">${me(e.name)}</div><div class="gc-meta">${on(e.name)} 則留言</div>`,n.addEventListener("click",()=>{U=t,G("single"),ne(t)}),_e.appendChild(n)})}function Re(i){const e=N.length;e!==0&&(U=Math.min(Math.max(0,U+i),e-1),gn(),de())}function Wt(){const i=document.activeElement;return i?i.tagName==="INPUT"||i.tagName==="TEXTAREA"||i.isContentEditable:!1}function Ht(){return!Ue.classList.contains("hidden")||!ot.classList.contains("hidden")}document.addEventListener("keydown",i=>{if(!st.classList.contains("hidden")){li(i);return}if(!i.isComposing){if(fe!==null&&i.code==="Escape"){i.preventDefault(),fe=null,Q();return}if(Y!==null&&i.code==="Escape"){i.preventDefault(),Y=null,Q();return}if((i.ctrlKey||i.metaKey)&&i.code==="KeyZ"&&!i.shiftKey){!Ht()&&!Wt()&&(i.preventDefault(),Jn());return}if(!(Ht()||Wt())){if(H==="role"){if(i.shiftKey&&/^Digit[0-5]$/.test(i.code)){i.preventDefault();const e=parseInt(i.code[5]),t=B[W];t&&(ge(),t.rating=e===0||e===1&&t.rating===1?0:e,V());return}if(i.code==="Tab"||i.code==="Escape"){i.preventDefault(),G("single");return}switch(i.code){case"ArrowUp":case"KeyW":i.preventDefault(),Tt(-1);break;case"ArrowDown":case"KeyS":i.preventDefault(),Tt(1);break;case"Space":i.preventDefault(),B[W]&&un(B[W],W);break;case"Enter":case"NumpadEnter":i.preventDefault(),B[W]&&Ze(B[W]);break}return}if(H==="grid"){if(Ye(i)){i.preventDefault(),G("single"),ne(U);return}switch(i.code){case"KeyA":case"ArrowLeft":i.preventDefault(),Re(-1);break;case"KeyD":case"ArrowRight":i.preventDefault(),Re(1);break;case"KeyW":case"ArrowUp":i.preventDefault(),Re(-Et);break;case"KeyS":case"ArrowDown":i.preventDefault(),Re(Et);break;case"Space":i.preventDefault(),G("single"),ne(U);break;case"Tab":i.preventDefault(),G("single");break}return}switch(i.code){case"Space":i.preventDefault(),D.playPause();break;case"KeyA":case"ArrowLeft":i.preventDefault(),It(-5);break;case"KeyD":case"ArrowRight":i.preventDefault(),It(5);break;case"KeyW":case"ArrowUp":i.preventDefault(),Bt(-1);break;case"KeyS":case"ArrowDown":i.preventDefault(),Bt(1);break;case"KeyC":case"KeyX":!i.ctrlKey&&!i.metaKey&&(i.preventDefault(),ri());break;case"Tab":i.preventDefault(),N.length&&G("grid");break}}}});function di(){let i="";const e=(s,o)=>o.rating-s.rating||s.file.localeCompare(o.file,"zh-Hant",{numeric:!0})||(s.time??-1/0)-(o.time??-1/0),t=(s,o,l)=>{if(l.length===0)return;const c=l.map(a=>{const h=a.rating>0?"★".repeat(a.rating)+"☆".repeat(5-a.rating):"",m=a.time!==null?at(a.time):"整體";return`<tr>
        <td class="tc">${me(m)}</td>
        <td class="fn">${me(a.file)}</td>
        <td class="cm">${me(a.text)}</td>
        <td class="sr">${h}</td>
        <td class="au">${me(a.author)}</td>
      </tr>`}).join("");i+=`<div class="section">
  <div class="slabel" style="background:${o}">${me(s==="__none__"?"未指定":s)}</div>
  <table><thead><tr>
    <th class="tc">時間</th><th class="fn">音檔</th><th class="cm">評語</th><th class="sr">評分</th><th class="au">留言者</th>
  </tr></thead><tbody>${c}</tbody></table>
</div>`};O.forEach(s=>t(s.name,Z[s.role],P.filter(o=>o.character.includes(s.name)).sort(e))),t("__none__","#64748b",P.filter(s=>s.character.length===0).sort(e));const n=`<!DOCTYPE html>
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
</body></html>`,r=window.open("","_blank","width=900,height=800");if(!r){alert("請允許開啟新分頁（檢查彈出視窗封鎖設定）");return}r.document.write(n),r.document.close(),setTimeout(()=>r.print(),600)}Mt.addEventListener("click",()=>{Mt.blur(),di()});const hi=1e4;function ui(i){const e=new Set(P.map(n=>n.id)),t=i.map(Fe).filter(n=>!e.has(n.id));return t.length===0?0:(P=[...P,...t],t.length)}function pi(){$t(),Me=window.setInterval(async()=>{if(!X){$t();return}try{const e=await(await X.getFileHandle(nt)).getFile(),t=JSON.parse(await e.text());if(!Array.isArray(t==null?void 0:t.comments))return;const n=ui(t.comments);Ie=Date.now(),vn(),n>0&&(tt(P),Xe(),Ve(),de(),H==="role"&&ce(),Qe(`已同步 ${n} 則新留言`))}catch{}},hi)}function $t(){Me!==void 0&&(window.clearInterval(Me),Me=void 0)}function vn(){const i=document.getElementById("syncStatus");if(!i)return;if(!X){i.textContent="";return}const e=Ie?new Date(Ie).toLocaleTimeString("zh-Hant",{hour:"2-digit",minute:"2-digit",second:"2-digit"}):"—";i.textContent=`↺ 協作同步中 · ${e}`}let Ft;function Qe(i){const e=document.getElementById("syncToast");e&&(e.textContent=i,e.classList.remove("hidden"),window.clearTimeout(Ft),Ft=window.setTimeout(()=>e.classList.add("hidden"),3e3))}async function mi(){if(N.length===0){alert("請先選擇音檔資料夾後再匯出外部分享版。");return}const i=new Set(P.map(m=>m.file)),e=N.filter(m=>i.has(m.name));if(e.length===0){alert("目前沒有任何留言，無法產生分享版。");return}se.disabled=!0,se.textContent=`處理中 0/${e.length}…`;const t={};for(let m=0;m<e.length;m++){const d=e[m];se.textContent=`處理中 ${m+1}/${e.length}…`;try{const f=await d.handle.getFile(),u=await new Promise((g,p)=>{const v=new FileReader;v.onload=()=>g(v.result),v.onerror=p,v.readAsDataURL(f)});t[d.name]=u}catch{}}se.disabled=!1,se.textContent="匯出分享版";const n=m=>JSON.stringify(m).replace(/</g,"\\u003c").replace(/>/g,"\\u003e").replace(/&/g,"\\u0026"),r=zn.replace("{{DATA_JSON}}",()=>n({comments:P,characters:O,roleColors:Z})).replace("{{AUDIO_JSON}}",()=>n(t)),s=new Blob([r],{type:"text/html;charset=utf-8"}),o=URL.createObjectURL(s),l=new Date,c=m=>String(m).padStart(2,"0"),a=`${l.getFullYear()}${c(l.getMonth()+1)}${c(l.getDate())}-${c(l.getHours())}${c(l.getMinutes())}`,h=document.createElement("a");h.href=o,h.download=`voicepicker-external-${a}.html`,h.click(),URL.revokeObjectURL(o)}se.addEventListener("click",()=>{se.blur(),mi()});St.addEventListener("click",()=>{St.blur(),G("role")});Hn.textContent="v0.9.8";te||Ke(null);
