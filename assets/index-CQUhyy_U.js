(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();function z(i,e,t,n){return new(t||(t=Promise))(function(r,s){function o(c){try{a(n.next(c))}catch(h){s(h)}}function l(c){try{a(n.throw(c))}catch(h){s(h)}}function a(c){var h;c.done?r(c.value):(h=c.value,h instanceof t?h:new t(function(d){d(h)})).then(o,l)}a((n=n.apply(i,e||[])).next())})}let ye=class{constructor(){this.listeners={}}on(e,t,n){if(this.listeners[e]||(this.listeners[e]=new Set),n==null?void 0:n.once){const r=(...s)=>{this.un(e,r),t(...s)};return this.listeners[e].add(r),()=>this.un(e,r)}return this.listeners[e].add(t),()=>this.un(e,t)}un(e,t){var n;(n=this.listeners[e])===null||n===void 0||n.delete(t)}once(e,t){return this.on(e,t,{once:!0})}unAll(){this.listeners={}}emit(e,...t){this.listeners[e]&&this.listeners[e].forEach(n=>n(...t))}};const Ce={decode:function(i,e){return z(this,void 0,void 0,function*(){const t=new AudioContext({sampleRate:e});try{return yield t.decodeAudioData(i)}finally{t.close()}})},createBuffer:function(i,e){if(!i||i.length===0)throw new Error("channelData must be a non-empty array");if(e<=0)throw new Error("duration must be greater than 0");if(typeof i[0]=="number"&&(i=[i]),!i[0]||i[0].length===0)throw new Error("channelData must contain non-empty channel arrays");(function(n){const r=n[0];if(r.some(s=>s>1||s<-1)){const s=r.length;let o=0;for(let l=0;l<s;l++){const a=Math.abs(r[l]);a>o&&(o=a)}for(const l of n)for(let a=0;a<s;a++)l[a]/=o}})(i);const t=i.map(n=>n instanceof Float32Array?n:Float32Array.from(n));return{duration:e,length:t[0].length,sampleRate:t[0].length/e,numberOfChannels:t.length,getChannelData:n=>{const r=t[n];if(!r)throw new Error(`Channel ${n} not found`);return r},copyFromChannel:AudioBuffer.prototype.copyFromChannel,copyToChannel:AudioBuffer.prototype.copyToChannel}}};function Wt(i,e){const t=e.xmlns?document.createElementNS(e.xmlns,i):document.createElement(i);for(const[n,r]of Object.entries(e))if(n==="children"&&r)for(const[s,o]of Object.entries(r))o instanceof Node?t.appendChild(o):typeof o=="string"?t.appendChild(document.createTextNode(o)):t.appendChild(Wt(s,o));else n==="style"?Object.assign(t.style,r):n==="textContent"?t.textContent=r:t.setAttribute(n,r.toString());return t}function ht(i,e,t){const n=Wt(i,e||{});return t==null||t.appendChild(n),n}function Ht(i){return i instanceof HTMLElement||typeof i=="object"&&i!==null&&i.nodeType===Node.ELEMENT_NODE&&typeof i.style=="object"}var gn=Object.freeze({__proto__:null,createElement:ht,default:ht,isHTMLElement:Ht});const vn={fetchBlob:function(i,e,t){return z(this,void 0,void 0,function*(){var n;const r=yield fetch(i,t);if(r.status>=400)throw new Error(`Failed to fetch ${i}: ${r.status} (${r.statusText})`);return function(s,o,l){z(this,void 0,void 0,function*(){var a;if(!s.body||!s.headers)return;const c=s.body.getReader(),h=Number(s.headers.get("Content-Length"))||0;let d=0;const u=()=>{c.cancel()};if(l){if(l.aborted)return void c.cancel();l.addEventListener("abort",u,{once:!0})}try{for(;;){const m=yield c.read();if(m.done)break;if(d+=((a=m.value)===null||a===void 0?void 0:a.length)||0,h>0){const p=Math.round(d/h*100);o(p)}}}catch(m){if(m instanceof DOMException&&m.name==="AbortError")return;console.warn("Progress tracking error:",m)}finally{l&&l.removeEventListener("abort",u)}})}(r.clone(),e,(n=t==null?void 0:t.signal)!==null&&n!==void 0?n:void 0),r.blob()})}};function M(i){let e=i;const t=new Set;return{get value(){return e},set(n){Object.is(e,n)||(e=n,t.forEach(r=>r(e)))},update(n){this.set(n(e))},subscribe:n=>(t.add(n),()=>t.delete(n))}}function re(i,e){const t=M(i());return e.forEach(n=>n.subscribe(()=>{const r=i();Object.is(t.value,r)||t.set(r)})),{get value(){return t.value},subscribe:n=>t.subscribe(n)}}function q(i,e){let t;const n=()=>{t&&(t(),t=void 0),t=i()},r=e.map(s=>s.subscribe(n));return n(),()=>{t&&(t(),t=void 0),r.forEach(s=>s())}}class bn extends ye{get isPlayingSignal(){return this._isPlaying}get currentTimeSignal(){return this._currentTime}get durationSignal(){return this._duration}get volumeSignal(){return this._volume}get mutedSignal(){return this._muted}get playbackRateSignal(){return this._playbackRate}get seekingSignal(){return this._seeking}constructor(e){super(),this.isExternalMedia=!1,this._ownBlobUrl=null,this.reactiveMediaEventCleanups=[],e.media?(this.media=e.media,this.isExternalMedia=!0):this.media=document.createElement("audio"),this._isPlaying=M(!1),this._currentTime=M(0),this._duration=M(0),this._volume=M(this.media.volume),this._muted=M(this.media.muted),this._playbackRate=M(this.media.playbackRate||1),this._seeking=M(!1),this.setupReactiveMediaEvents(),e.mediaControls&&(this.media.controls=!0),e.autoplay&&(this.media.autoplay=!0),e.playbackRate!=null&&this.onMediaEvent("canplay",()=>{e.playbackRate!=null&&(this.media.playbackRate=e.playbackRate)},{once:!0})}setupReactiveMediaEvents(){this.reactiveMediaEventCleanups.push(this.onMediaEvent("play",()=>{this._isPlaying.set(!0)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("pause",()=>{this._isPlaying.set(!1)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("ended",()=>{this._isPlaying.set(!1)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("timeupdate",()=>{this._currentTime.set(this.media.currentTime)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("durationchange",()=>{this._duration.set(this.media.duration||0)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("loadedmetadata",()=>{this._duration.set(this.media.duration||0)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("seeking",()=>{this._seeking.set(!0)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("seeked",()=>{this._seeking.set(!1)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("volumechange",()=>{this._volume.set(this.media.volume),this._muted.set(this.media.muted)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("ratechange",()=>{this._playbackRate.set(this.media.playbackRate)}))}onMediaEvent(e,t,n){return this.media.addEventListener(e,t,n),()=>this.media.removeEventListener(e,t,n)}getSrc(){return this.media.currentSrc||this.media.src||""}revokeSrc(){this._ownBlobUrl&&(URL.revokeObjectURL(this._ownBlobUrl),this._ownBlobUrl=null)}canPlayType(e){return this.media.canPlayType(e)!==""}setSrc(e,t){const n=this.getSrc();if(e&&n===e)return;this.revokeSrc();const r=t instanceof Blob&&(this.canPlayType(t.type)||!e)?URL.createObjectURL(t):e;if(r!==e&&(this._ownBlobUrl=r),n&&this.media.removeAttribute("src"),r||e)try{this.media.src=r}catch{this.media.src=e}}destroy(){this.reactiveMediaEventCleanups.forEach(e=>e()),this.reactiveMediaEventCleanups=[],this.revokeSrc(),this.unAll(),this.isExternalMedia||(this.media.pause(),this.media.removeAttribute("src"),this.media.load(),this.media.remove())}setMediaElement(e){this.reactiveMediaEventCleanups.forEach(t=>t()),this.reactiveMediaEventCleanups=[],this.media=e,this.setupReactiveMediaEvents()}play(){return z(this,void 0,void 0,function*(){try{return yield this.media.play()}catch(e){if(e instanceof DOMException&&e.name==="AbortError")return;throw e}})}pause(){this.media.pause()}isPlaying(){return!this.media.paused&&!this.media.ended}setTime(e){this.media.currentTime=Math.max(0,Math.min(e,this.getDuration()))}getDuration(){return this.media.duration}getCurrentTime(){return this.media.currentTime}getVolume(){return this.media.volume}setVolume(e){this.media.volume=e}getMuted(){return this.media.muted}setMuted(e){this.media.muted=e}getPlaybackRate(){return this.media.playbackRate}isSeeking(){return this.media.seeking}setPlaybackRate(e,t){t!=null&&(this.media.preservesPitch=t),this.media.playbackRate=e}getMediaElement(){return this.media}setSinkId(e){return this.media.setSinkId(e)}}function yn({maxTop:i,maxBottom:e,halfHeight:t,vScale:n,barMinHeight:r=0,barAlign:s}){let o=Math.round(i*t*n),l=o+Math.round(e*t*n)||1;return l<r&&(l=r,s||(o=l/2)),{topHeight:o,totalHeight:l}}function En({barAlign:i,halfHeight:e,topHeight:t,totalHeight:n,canvasHeight:r}){return i==="top"?0:i==="bottom"?r-n:e-t}function ut(i,e,t){const n=e-i.left,r=t-i.top;return[n/i.width,r/i.height]}function $t(i){return!!(i.barWidth||i.barGap||i.barAlign)}function pt(i,e){if(!$t(e))return i;const t=e.barWidth||.5,n=t+(e.barGap||t/2);return n===0?i:Math.floor(i/n)*n}function mt({scrollLeft:i,totalWidth:e,numCanvases:t}){if(e===0)return[0];const n=i/e,r=Math.floor(n*t);return[r-1,r,r+1]}function Ft(i){const e=i._cleanup;typeof e=="function"&&e()}function xn(i){const e=M({scrollLeft:i.scrollLeft,scrollWidth:i.scrollWidth,clientWidth:i.clientWidth}),t=re(()=>function(s){const{scrollLeft:o,scrollWidth:l,clientWidth:a}=s;if(l===0)return{startX:0,endX:1};const c=o/l,h=(o+a)/l;return{startX:Math.max(0,Math.min(1,c)),endX:Math.max(0,Math.min(1,h))}}(e.value),[e]),n=re(()=>function(s){return{left:s.scrollLeft,right:s.scrollLeft+s.clientWidth}}(e.value),[e]),r=()=>{e.set({scrollLeft:i.scrollLeft,scrollWidth:i.scrollWidth,clientWidth:i.clientWidth})};return i.addEventListener("scroll",r,{passive:!0}),{scrollData:e,percentages:t,bounds:n,cleanup:()=>{i.removeEventListener("scroll",r),Ft(e)}}}class Cn extends ye{constructor(e,t){super(),this.timeouts=[],this.isScrollable=!1,this.audioData=null,this.resizeObserver=null,this.lastContainerWidth=0,this.isDragging=!1,this.subscriptions=[],this.unsubscribeOnScroll=[],this.dragStream=null,this.scrollStream=null,this.containerInlinePadding=0,this.onClickWrapper=o=>{const l=this.wrapper.getBoundingClientRect(),[a,c]=ut(l,o.clientX,o.clientY);this.emit("click",a,c)},this.onDblClickWrapper=o=>{const l=this.wrapper.getBoundingClientRect(),[a,c]=ut(l,o.clientX,o.clientY);this.emit("dblclick",a,c)},this.subscriptions=[],this.options=e;const n=this.parentFromOptionsContainer(e.container);this.parent=n;const[r,s]=this.initHtml();n.appendChild(r),this.container=r,this.scrollContainer=s.querySelector(".scroll"),this.wrapper=s.querySelector(".wrapper"),this.canvasWrapper=s.querySelector(".canvases"),this.progressWrapper=s.querySelector(".progress"),this.cursor=s.querySelector(".cursor"),this.calculateInlinePadding(),t&&s.appendChild(t),this.initEvents()}parentFromOptionsContainer(e){let t;if(typeof e=="string"?t=document.querySelector(e):Ht(e)&&(t=e),!t)throw new Error("Container not found");return t}initEvents(){this.wrapper.addEventListener("click",this.onClickWrapper),this.wrapper.addEventListener("dblclick",this.onDblClickWrapper),this.options.dragToSeek!==!0&&typeof this.options.dragToSeek!="object"||this.initDrag(),this.scrollStream=xn(this.scrollContainer);const e=q(()=>{const{startX:t,endX:n}=this.scrollStream.percentages.value,{left:r,right:s}=this.scrollStream.bounds.value;this.emit("scroll",t,n,r,s)},[this.scrollStream.percentages,this.scrollStream.bounds]);if(this.subscriptions.push(e),typeof ResizeObserver=="function"){const t=this.createDelay(100);this.resizeObserver=new ResizeObserver(()=>{t().then(()=>this.onContainerResize()).catch(()=>{})}),this.resizeObserver.observe(this.scrollContainer)}}onContainerResize(){const e=this.parent.clientWidth;this.calculateInlinePadding(),e===this.lastContainerWidth&&this.options.height!=="auto"||(this.lastContainerWidth=e,this.reRender(),this.emit("resize"))}initDrag(){if(this.dragStream)return;this.dragStream=function(t,n={}){const{threshold:r=3,mouseButton:s=0,touchDelay:o=100}=n,l=M(null),a=new Map,c=matchMedia("(pointer: coarse)").matches;let h=()=>{};const d=u=>{if(u.button!==s||a.has(u.pointerId)||(a.set(u.pointerId,u),a.size>1))return;const m=u.pointerId;let p=u.clientX,f=u.clientY,g=!1;const v=Date.now(),C=t.getBoundingClientRect(),{left:S,top:L}=C,w=y=>{if(y.pointerId!==m||y.defaultPrevented||a.size>1||c&&Date.now()-v<o)return;const A=y.clientX,O=y.clientY,X=A-p,k=O-f;(g||Math.abs(X)>r||Math.abs(k)>r)&&(y.preventDefault(),y.stopPropagation(),g||(l.set({type:"start",x:p-S,y:f-L}),g=!0),l.set({type:"move",x:A-S,y:O-L,deltaX:X,deltaY:k}),p=A,f=O)},x=y=>{if(a.delete(y.pointerId)){if(y.pointerId===m&&g){const A=y.clientX,O=y.clientY;l.set({type:"end",x:A-S,y:O-L})}a.size===0&&h()}},D=y=>{y.relatedTarget&&y.relatedTarget!==document.documentElement||x(y)},b=y=>{g&&(y.stopPropagation(),y.preventDefault())},_=y=>{y.defaultPrevented||a.size>1||g&&y.preventDefault()};document.addEventListener("pointermove",w),document.addEventListener("pointerup",x),document.addEventListener("pointerout",D),document.addEventListener("pointercancel",D),document.addEventListener("touchmove",_,{passive:!1}),document.addEventListener("click",b,{capture:!0}),h=()=>{document.removeEventListener("pointermove",w),document.removeEventListener("pointerup",x),document.removeEventListener("pointerout",D),document.removeEventListener("pointercancel",D),document.removeEventListener("touchmove",_),setTimeout(()=>{document.removeEventListener("click",b,{capture:!0})},10)}};return t.addEventListener("pointerdown",d),{signal:l,cleanup:()=>{h(),t.removeEventListener("pointerdown",d),a.clear(),Ft(l)}}}(this.wrapper);const e=q(()=>{const t=this.dragStream.signal.value;if(!t)return;const n=this.wrapper.getBoundingClientRect().width,r=(s=t.x/n)<0?0:s>1?1:s;var s;t.type==="start"?(this.isDragging=!0,this.emit("dragstart",r)):t.type==="move"?this.emit("drag",r):t.type==="end"&&(this.isDragging=!1,this.emit("dragend",r))},[this.dragStream.signal]);this.subscriptions.push(e)}calculateInlinePadding(){const{paddingLeft:e,paddingRight:t}=getComputedStyle(this.scrollContainer),n=parseFloat(e)+parseFloat(t);this.containerInlinePadding=Number.isNaN(n)?0:n}initHtml(){const e=document.createElement("div"),t=e.attachShadow({mode:"open"}),n=this.options.cspNonce&&typeof this.options.cspNonce=="string"?this.options.cspNonce.replace(/"/g,""):"";return t.innerHTML=`
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
    `,[e,t]}setOptions(e){var t;if(this.options.container!==e.container){const n=this.parentFromOptionsContainer(e.container);n.appendChild(this.container),this.parent=n}e.dragToSeek===!0||typeof this.options.dragToSeek=="object"?this.initDrag():((t=this.dragStream)===null||t===void 0||t.cleanup(),this.dragStream=null),this.options=e,this.reRender()}getWrapper(){return this.wrapper}getWidth(){return this.scrollContainer.clientWidth-this.containerInlinePadding}getScroll(){return this.scrollContainer.scrollLeft}setScroll(e){this.scrollContainer.scrollLeft=e}setScrollPercentage(e){const{scrollWidth:t}=this.scrollContainer,n=t*e;this.setScroll(n)}destroy(){var e;this.wrapper.removeEventListener("click",this.onClickWrapper),this.wrapper.removeEventListener("dblclick",this.onDblClickWrapper),this.timeouts.forEach(t=>t()),this.timeouts=[],this.subscriptions.forEach(t=>t()),this.container.remove(),this.resizeObserver&&(this.resizeObserver.disconnect(),this.resizeObserver=null),(e=this.unsubscribeOnScroll)===null||e===void 0||e.forEach(t=>t()),this.unsubscribeOnScroll=[],this.dragStream&&(this.dragStream.cleanup(),this.dragStream=null),this.scrollStream&&(this.scrollStream.cleanup(),this.scrollStream=null)}createDelay(e=10){let t,n;const r=()=>{t&&(clearTimeout(t),t=void 0),n&&(n(),n=void 0)};return this.timeouts.push(r),()=>new Promise((s,o)=>{r(),n=o,t=setTimeout(()=>{t=void 0,n=void 0,s()},e)})}getHeight(e,t){var n;const r=((n=this.audioData)===null||n===void 0?void 0:n.numberOfChannels)||1;return function({optionsHeight:s,optionsSplitChannels:o,parentHeight:l,numberOfChannels:a,defaultHeight:c=128}){if(s==null)return c;const h=Number(s);if(!isNaN(h))return h;if(s==="auto"){const d=l||c;return o!=null&&o.every(u=>!u.overlay)?d/a:d}return c}({optionsHeight:e,optionsSplitChannels:t,parentHeight:this.parent.clientHeight,numberOfChannels:r,defaultHeight:128})}convertColorValues(e,t){return function(n,r,s){if(!Array.isArray(n))return n||"";if(n.length===0)return"#999";if(n.length<2)return n[0]||"";const o=document.createElement("canvas"),l=o.getContext("2d");if(!l)return n[0]||"";const a=s||o.height*r,c=l.createLinearGradient(0,0,0,a),h=1/(n.length-1);return n.forEach((d,u)=>{c.addColorStop(u*h,d)}),c}(e,this.getPixelRatio(),t==null?void 0:t.canvas.height)}getPixelRatio(){return e=window.devicePixelRatio,Math.max(1,e||1);var e}renderBarWaveform(e,t,n,r){const{width:s,height:o}=n.canvas,{halfHeight:l,barWidth:a,barRadius:c,barIndexScale:h,barSpacing:d,barMinHeight:u}=function({width:p,height:f,length:g,options:v,pixelRatio:C}){const S=f/2,L=v.barWidth?v.barWidth*C:1,w=v.barGap?v.barGap*C:v.barWidth?L/2:0,x=L+w||1;return{halfHeight:S,barWidth:L,barGap:w,barRadius:v.barRadius||0,barMinHeight:v.barMinHeight?v.barMinHeight*C:0,barIndexScale:g>0?p/x/g:0,barSpacing:x}}({width:s,height:o,length:(e[0]||[]).length,options:t,pixelRatio:this.getPixelRatio()}),m=function({channelData:p,barIndexScale:f,barSpacing:g,barWidth:v,halfHeight:C,vScale:S,canvasHeight:L,barAlign:w,barMinHeight:x}){const D=p[0]||[],b=p[1]||D,_=D.length,y=[];let A=0,O=0,X=0;for(let k=0;k<=_;k++){const ee=Math.round(k*f);if(ee>A){const{topHeight:mn,totalHeight:dt}=yn({maxTop:O,maxBottom:X,halfHeight:C,vScale:S,barMinHeight:x,barAlign:w}),fn=En({barAlign:w,halfHeight:C,topHeight:mn,totalHeight:dt,canvasHeight:L});y.push({x:A*g,y:fn,width:v,height:dt}),A=ee,O=0,X=0}const lt=Math.abs(D[k]||0),ct=Math.abs(b[k]||0);lt>O&&(O=lt),ct>X&&(X=ct)}return y}({channelData:e,barIndexScale:h,barSpacing:d,barWidth:a,halfHeight:l,vScale:r,canvasHeight:o,barAlign:t.barAlign,barMinHeight:u});n.beginPath();for(const p of m)c&&"roundRect"in n?n.roundRect(p.x,p.y,p.width,p.height,c):n.rect(p.x,p.y,p.width,p.height);n.fill(),n.closePath()}renderLineWaveform(e,t,n,r){const{width:s,height:o}=n.canvas,l=function({channelData:a,width:c,height:h,vScale:d}){const u=h/2,m=a[0]||[];return[m,a[1]||m].map((p,f)=>{const g=p.length,v=g?c/g:0,C=u,S=f===0?-1:1,L=[{x:0,y:C}];let w=0,x=0;for(let D=0;D<=g;D++){const b=Math.round(D*v);if(b>w){const y=C+(Math.round(x*u*d)||1)*S;L.push({x:w,y}),w=b,x=0}const _=Math.abs(p[D]||0);_>x&&(x=_)}return L.push({x:w,y:C}),L})}({channelData:e,width:s,height:o,vScale:r});n.beginPath();for(const a of l)if(a.length){n.moveTo(a[0].x,a[0].y);for(let c=1;c<a.length;c++){const h=a[c];n.lineTo(h.x,h.y)}}n.fill(),n.closePath()}renderWaveform(e,t,n){if(n.fillStyle=this.convertColorValues(t.waveColor,n),t.renderFunction)return void t.renderFunction(e,n);const r=function({channelData:s,barHeight:o,normalize:l,maxPeak:a}){var c;const h=o||1;if(!l)return h;const d=s[0];if(!d||d.length===0)return h;let u=a??0;if(!a)for(let m=0;m<d.length;m++){const p=(c=d[m])!==null&&c!==void 0?c:0,f=Math.abs(p);f>u&&(u=f)}return u?h/u:h}({channelData:e,barHeight:t.barHeight,normalize:t.normalize,maxPeak:t.maxPeak});$t(t)?this.renderBarWaveform(e,t,n,r):this.renderLineWaveform(e,t,n,r)}renderSingleCanvas(e,t,n,r,s,o,l){const a=this.getPixelRatio(),c=document.createElement("canvas");c.width=Math.round(n*a),c.height=Math.round(r*a),c.style.width=`${n}px`,c.style.height=`${r}px`,c.style.left=`${Math.round(s)}px`,o.appendChild(c);const h=c.getContext("2d");if(t.renderFunction?(h.fillStyle=this.convertColorValues(t.waveColor,h),t.renderFunction(e,h)):this.renderWaveform(e,t,h),c.width>0&&c.height>0){const d=c.cloneNode(),u=d.getContext("2d");u.drawImage(c,0,0),u.globalCompositeOperation="source-in",u.fillStyle=this.convertColorValues(t.progressColor,u),u.fillRect(0,0,c.width,c.height),l.appendChild(d)}}renderMultiCanvas(e,t,n,r,s,o){const l=this.getPixelRatio(),{clientWidth:a}=this.scrollContainer,c=n/l,h=function({clientWidth:p,totalWidth:f,options:g}){return pt(Math.min(8e3,p,f),g)}({clientWidth:a,totalWidth:c,options:t});let d={};if(h===0)return;const u=p=>{if(p<0||p>=m||d[p])return;d[p]=!0;const f=p*h;let g=Math.min(c-f,h);if(g=pt(g,t),g<=0)return;const v=function({channelData:C,offset:S,clampedWidth:L,totalWidth:w}){return C.map(x=>{const D=Math.floor(S/w*x.length),b=Math.floor((S+L)/w*x.length);return x.slice(D,b)})}({channelData:e,offset:f,clampedWidth:g,totalWidth:c});this.renderSingleCanvas(v,t,g,r,f,s,o)},m=Math.ceil(c/h);if(!this.isScrollable){for(let p=0;p<m;p++)u(p);return}if(mt({scrollLeft:this.scrollContainer.scrollLeft,totalWidth:c,numCanvases:m}).forEach(p=>u(p)),m>1){const p=this.on("scroll",()=>{const{scrollLeft:f}=this.scrollContainer;Object.keys(d).length>10&&(s.innerHTML="",o.innerHTML="",d={}),mt({scrollLeft:f,totalWidth:c,numCanvases:m}).forEach(g=>u(g))});this.unsubscribeOnScroll.push(p)}}renderChannel(e,t,n,r){var{overlay:s}=t,o=function(h,d){var u={};for(var m in h)Object.prototype.hasOwnProperty.call(h,m)&&d.indexOf(m)<0&&(u[m]=h[m]);if(h!=null&&typeof Object.getOwnPropertySymbols=="function"){var p=0;for(m=Object.getOwnPropertySymbols(h);p<m.length;p++)d.indexOf(m[p])<0&&Object.prototype.propertyIsEnumerable.call(h,m[p])&&(u[m[p]]=h[m[p]])}return u}(t,["overlay"]);const l=document.createElement("div"),a=this.getHeight(o.height,o.splitChannels);l.style.height=`${a}px`,s&&r>0&&(l.style.marginTop=`-${a}px`),this.canvasWrapper.style.minHeight=`${a}px`,this.canvasWrapper.appendChild(l);const c=l.cloneNode();this.progressWrapper.appendChild(c),this.renderMultiCanvas(e,o,n,a,l,c)}render(e){return z(this,void 0,void 0,function*(){var t;this.timeouts.forEach(c=>c()),this.timeouts=[],this.unsubscribeOnScroll.forEach(c=>c()),this.unsubscribeOnScroll=[],this.canvasWrapper.innerHTML="",this.progressWrapper.innerHTML="",this.options.width!=null&&(this.scrollContainer.style.width=typeof this.options.width=="number"?`${this.options.width}px`:this.options.width);const n=this.getPixelRatio(),r=this.scrollContainer.clientWidth-this.containerInlinePadding,{scrollWidth:s,isScrollable:o,useParentWidth:l,width:a}=function({duration:c,minPxPerSec:h=0,parentWidth:d,fillParent:u,pixelRatio:m}){const p=Math.ceil(c*h),f=p>d,g=!!(u&&!f);return{scrollWidth:p,isScrollable:f,useParentWidth:g,width:(g?d:p)*m}}({duration:e.duration,minPxPerSec:this.options.minPxPerSec||0,parentWidth:r,fillParent:this.options.fillParent,pixelRatio:n});if(this.isScrollable=o,this.wrapper.style.width=l?"100%":`${s}px`,this.scrollContainer.style.overflowX=this.isScrollable?"auto":"hidden",this.scrollContainer.classList.toggle("noScrollbar",!!this.options.hideScrollbar),this.cursor.style.backgroundColor=`${this.options.cursorColor||this.options.progressColor}`,this.cursor.style.width=`${this.options.cursorWidth}px`,this.audioData=e,this.emit("render"),this.options.splitChannels)for(let c=0;c<e.numberOfChannels;c++){const h=Object.assign(Object.assign({},this.options),(t=this.options.splitChannels)===null||t===void 0?void 0:t[c]);this.renderChannel([e.getChannelData(c)],h,a,c)}else{const c=[e.getChannelData(0)];e.numberOfChannels>1&&c.push(e.getChannelData(1)),this.renderChannel(c,this.options,a,0)}Promise.resolve().then(()=>this.emit("rendered"))})}reRender(){if(this.unsubscribeOnScroll.forEach(n=>n()),this.unsubscribeOnScroll=[],!this.audioData)return;const{scrollWidth:e}=this.scrollContainer,{right:t}=this.progressWrapper.getBoundingClientRect();if(this.render(this.audioData),!this.isScrollable&&this.scrollContainer.scrollLeft)this.scrollContainer.scrollLeft=0;else if(this.isScrollable&&e!==this.scrollContainer.scrollWidth){const{right:n}=this.progressWrapper.getBoundingClientRect(),r=function(s){const o=2*s;return(o<0?Math.floor(o):Math.ceil(o))/2}(n-t);this.scrollContainer.scrollLeft+=r}}zoom(e){this.options.minPxPerSec=e,this.reRender()}scrollIntoView(e,t=!1){var n;const{scrollLeft:r,scrollWidth:s,clientWidth:o}=this.scrollContainer,l=e*s,a=r,c=r+o,h=o/2;if(this.isDragging)l+30>c?this.scrollContainer.scrollLeft+=30:l-30<a&&(this.scrollContainer.scrollLeft-=30);else{(l<a||l>c)&&(this.scrollContainer.scrollLeft=l-(this.options.autoCenter?h:0));const d=l-r-h;if(t&&this.options.autoCenter&&d>0){const u=(n=this.audioData)===null||n===void 0?void 0:n.duration;if(u===void 0||u<=0)return void(this.scrollContainer.scrollLeft+=d);const m=s/u;this.scrollContainer.scrollLeft+=m<=600?Math.min(d,10):d}}}renderProgress(e,t){if(isNaN(e))return;const n=100*e;this.canvasWrapper.style.clipPath=`polygon(${n}% 0%, 100% 0%, 100% 100%, ${n}% 100%)`,this.progressWrapper.style.width=`${n}%`,this.cursor.style.left=`${n}%`,this.cursor.style.transform=this.options.cursorWidth?`translateX(-${e*this.options.cursorWidth}px)`:"",this.isScrollable&&this.options.autoScroll&&this.audioData&&this.audioData.duration>0&&this.scrollIntoView(e,t)}exportImage(e,t,n){return z(this,void 0,void 0,function*(){const r=this.canvasWrapper.querySelectorAll("canvas");if(!r.length)throw new Error("No waveform data");if(n==="dataURL"){const s=Array.from(r).map(o=>o.toDataURL(e,t));return Promise.resolve(s)}return Promise.all(Array.from(r).map(s=>new Promise((o,l)=>{s.toBlob(a=>{a?o(a):l(new Error("Could not export image"))},e,t)})))})}}class wn extends ye{constructor(){super(...arguments),this.animationFrameId=null,this.isRunning=!1}start(){if(this.isRunning)return;this.isRunning=!0;const e=()=>{this.isRunning&&(this.emit("tick"),this.animationFrameId=requestAnimationFrame(e))};e()}stop(){this.isRunning=!1,this.animationFrameId!==null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null)}destroy(){this.stop(),this.unAll()}}class Ve extends ye{constructor(e){super(),this.bufferNode=null,this.playStartTime=0,this.playbackPosition=0,this._muted=!1,this._playbackRate=1,this._duration=void 0,this.buffer=null,this.currentSrc="",this.paused=!0,this.crossOrigin=null,this.seeking=!1,this.autoplay=!1,this.addEventListener=this.on,this.removeEventListener=this.un,this._destroyed=!1,function(){const t=globalThis.navigator;if(t!=null&&t.audioSession)try{t.audioSession.type="playback"}catch(n){console.warn("Setting navigator.audioSession.type failed:",n)}}(),this.audioContext=e||new AudioContext,this.gainNode=this.audioContext.createGain(),this.gainNode.connect(this.audioContext.destination)}load(){return z(this,void 0,void 0,function*(){})}remove(){this.destroy()}destroy(){if(!this._destroyed){if(this._destroyed=!0,this.currentSrc="",this.bufferNode){this.bufferNode.onended=null;try{this.bufferNode.stop()}catch{}this.bufferNode.disconnect(),this.bufferNode=null}this.gainNode.disconnect(),typeof this.audioContext.close=="function"&&Promise.resolve(this.audioContext.close.call(this.audioContext)).catch(()=>{}),this.buffer=null,this.unAll()}}get src(){return this.currentSrc}set src(e){if(this.currentSrc=e,this._duration=void 0,!e)return this.buffer=null,void this.emit("emptied");fetch(e).then(t=>{if(t.status>=400)throw new Error(`Failed to fetch ${e}: ${t.status} (${t.statusText})`);return t.arrayBuffer()}).then(t=>this.currentSrc!==e?null:this.audioContext.decodeAudioData(t)).then(t=>{this.currentSrc===e&&(this.buffer=t,this.emit("loadedmetadata"),this.emit("canplay"),this.autoplay&&this.play())}).catch(t=>{console.error("WebAudioPlayer load error:",t)})}_play(){if(!this.paused)return;this.paused=!1,this.bufferNode&&(this.bufferNode.onended=null,this.bufferNode.disconnect()),this.bufferNode=this.audioContext.createBufferSource(),this.buffer&&(this.bufferNode.buffer=this.buffer),this.bufferNode.playbackRate.value=this._playbackRate,this.bufferNode.connect(this.gainNode);let e=this.playbackPosition;(e>=this.duration||e<0)&&(e=0,this.playbackPosition=0),this.bufferNode.start(this.audioContext.currentTime,e),this.playStartTime=this.audioContext.currentTime,this.bufferNode.onended=()=>{!this.paused&&this.duration-this.currentTime<.01&&(this.pause(),this.emit("ended"))}}_pause(){if(this.paused=!0,this.bufferNode){this.bufferNode.onended=null;try{this.bufferNode.stop()}catch{}}this.playbackPosition+=(this.audioContext.currentTime-this.playStartTime)*this._playbackRate}play(){return z(this,void 0,void 0,function*(){this.paused&&(this._play(),this.emit("play"))})}pause(){this.paused||(this._pause(),this.emit("pause"))}stopAt(e){const t=(e-this.currentTime)/this._playbackRate,n=this.bufferNode;n==null||n.stop(this.audioContext.currentTime+t),n==null||n.addEventListener("ended",()=>{n===this.bufferNode&&(this.bufferNode=null,this.pause(),this.playbackPosition=Math.min(e,this.duration),this.emit("timeupdate"))},{once:!0})}setSinkId(e){return z(this,void 0,void 0,function*(){return this.audioContext.setSinkId(e)})}get playbackRate(){return this._playbackRate}set playbackRate(e){const t=!this.paused;t&&this._pause(),this._playbackRate=e,t&&this._play(),this.bufferNode&&(this.bufferNode.playbackRate.value=e)}get currentTime(){return this.paused?this.playbackPosition:this.playbackPosition+(this.audioContext.currentTime-this.playStartTime)*this._playbackRate}set currentTime(e){const t=!this.paused;t&&this._pause(),this.playbackPosition=e,t&&this._play(),this.emit("seeking"),this.emit("timeupdate")}get duration(){var e,t;return(e=this._duration)!==null&&e!==void 0?e:((t=this.buffer)===null||t===void 0?void 0:t.duration)||0}set duration(e){this._duration=e}get volume(){return this.gainNode.gain.value}set volume(e){this.gainNode.gain.value=e,this.emit("volumechange")}get muted(){return this._muted}set muted(e){this._muted!==e&&(this._muted=e,this._muted?this.gainNode.disconnect():this.gainNode.connect(this.audioContext.destination))}canPlayType(e){return/^(audio|video)\//.test(e)}getGainNode(){return this.gainNode}getChannelData(){const e=[];if(!this.buffer)return e;const t=this.buffer.numberOfChannels;for(let n=0;n<t;n++)e.push(this.buffer.getChannelData(n));return e}removeAttribute(e){switch(e){case"src":this.src="";break;case"playbackRate":this.playbackRate=0;break;case"currentTime":this.currentTime=0;break;case"duration":this.duration=0;break;case"volume":this.volume=0;break;case"muted":this.muted=!1}}}const kn={waveColor:"#999",progressColor:"#555",cursorWidth:1,minPxPerSec:0,fillParent:!0,interact:!0,dragToSeek:!1,autoScroll:!0,autoCenter:!0,sampleRate:8e3};class be extends bn{static create(e){return new be(e)}getState(){return this.wavesurferState}getRenderer(){return this.renderer}constructor(e){const t=e.media||(e.backend==="WebAudio"?new Ve:void 0);super({media:t,mediaControls:e.mediaControls,autoplay:e.autoplay,playbackRate:e.audioRate}),this.plugins=[],this.decodedData=null,this.stopAtPosition=null,this.subscriptions=[],this.mediaSubscriptions=[],this.abortController=null,this._isDestroyed=!1,this._loadVersion=0,this.reactiveCleanups=[],this.options=Object.assign({},kn,e);const{state:n,actions:r}=function(l){var a,c,h,d,u,m;const p=(a=l==null?void 0:l.currentTime)!==null&&a!==void 0?a:M(0),f=(c=l==null?void 0:l.duration)!==null&&c!==void 0?c:M(0),g=(h=l==null?void 0:l.isPlaying)!==null&&h!==void 0?h:M(!1),v=(d=l==null?void 0:l.isSeeking)!==null&&d!==void 0?d:M(!1),C=(u=l==null?void 0:l.volume)!==null&&u!==void 0?u:M(1),S=(m=l==null?void 0:l.playbackRate)!==null&&m!==void 0?m:M(1),L=M(null),w=M(null),x=M(""),D=M(0),b=M(0),_=re(()=>!g.value,[g]),y=re(()=>L.value!==null,[L]),A=re(()=>y.value&&f.value>0,[y,f]),O=re(()=>p.value,[p]),X=re(()=>f.value>0?p.value/f.value:0,[p,f]);return{state:{currentTime:p,duration:f,isPlaying:g,isPaused:_,isSeeking:v,volume:C,playbackRate:S,audioBuffer:L,peaks:w,url:x,zoom:D,scrollPosition:b,canPlay:y,isReady:A,progress:O,progressPercent:X},actions:{setCurrentTime:k=>{const ee=Math.max(0,Math.min(f.value||1/0,k));p.set(ee)},setDuration:k=>{f.set(Math.max(0,k))},setPlaying:k=>{g.set(k)},setSeeking:k=>{v.set(k)},setVolume:k=>{const ee=Math.max(0,Math.min(1,k));C.set(ee)},setPlaybackRate:k=>{const ee=Math.max(.1,Math.min(16,k));S.set(ee)},setAudioBuffer:k=>{L.set(k),k&&f.set(k.duration)},setPeaks:k=>{w.set(k)},setUrl:k=>{x.set(k)},setZoom:k=>{D.set(Math.max(0,k))},setScrollPosition:k=>{b.set(Math.max(0,k))}}}}({isPlaying:this.isPlayingSignal,currentTime:this.currentTimeSignal,duration:this.durationSignal,volume:this.volumeSignal,playbackRate:this.playbackRateSignal,isSeeking:this.seekingSignal});this.wavesurferState=n,this.wavesurferActions=r,this.timer=new wn;const s=t?void 0:this.getMediaElement();this.renderer=new Cn(this.options,s),this.initPlayerEvents(),this.initRendererEvents(),this.initTimerEvents(),this.initReactiveState(),this.initPlugins();const o=this.options.url||this.getSrc()||"";Promise.resolve().then(()=>{this.emit("init");const{peaks:l,duration:a}=this.options;(o||l&&a)&&this.load(o,l,a).catch(()=>{})})}updateProgress(e=this.getCurrentTime()){return this.renderer.renderProgress(e/this.getDuration(),this.isPlaying()),e}initTimerEvents(){this.subscriptions.push(this.timer.on("tick",()=>{if(!this.isSeeking()){const e=this.updateProgress();if(this.emit("timeupdate",e),this.emit("audioprocess",e),this.stopAtPosition!=null&&this.isPlaying()&&e>=this.stopAtPosition){const t=this.stopAtPosition;this.pause(),this.setTime(t)}}}))}initReactiveState(){this.reactiveCleanups.push(function(e,t){const n=[];n.push(q(()=>{const o=e.isPlaying.value;t.emit(o?"play":"pause")},[e.isPlaying])),n.push(q(()=>{const o=e.currentTime.value;t.emit("timeupdate",o),e.isPlaying.value&&t.emit("audioprocess",o)},[e.currentTime,e.isPlaying])),n.push(q(()=>{e.isSeeking.value&&t.emit("seeking",e.currentTime.value)},[e.isSeeking,e.currentTime]));let r=!1;n.push(q(()=>{e.isReady.value&&!r&&(r=!0,t.emit("ready",e.duration.value))},[e.isReady,e.duration])),n.push(q(()=>{e.audioBuffer.value===null&&(r=!1)},[e.audioBuffer]));let s=!1;return n.push(q(()=>{const o=e.isPlaying.value,l=e.currentTime.value,a=e.duration.value,c=a>0&&l>=a;s&&!o&&c&&t.emit("finish"),s=o&&c},[e.isPlaying,e.currentTime,e.duration])),n.push(q(()=>{const o=e.zoom.value;o>0&&t.emit("zoom",o)},[e.zoom])),()=>{n.forEach(o=>o())}}(this.wavesurferState,{emit:this.emit.bind(this)}))}initPlayerEvents(){this.isPlaying()&&(this.emit("play"),this.timer.start()),this.mediaSubscriptions.push(this.onMediaEvent("timeupdate",()=>{const e=this.updateProgress();this.emit("timeupdate",e)}),this.onMediaEvent("play",()=>{this.emit("play"),this.timer.start()}),this.onMediaEvent("pause",()=>{this.emit("pause"),this.timer.stop(),this.stopAtPosition=null}),this.onMediaEvent("emptied",()=>{this.timer.stop(),this.stopAtPosition=null}),this.onMediaEvent("ended",()=>{this.emit("timeupdate",this.getDuration()),this.emit("finish"),this.stopAtPosition=null}),this.onMediaEvent("seeking",()=>{this.emit("seeking",this.getCurrentTime())}),this.onMediaEvent("error",()=>{var e;this.emit("error",(e=this.getMediaElement().error)!==null&&e!==void 0?e:new Error("Media error")),this.stopAtPosition=null}))}initRendererEvents(){this.subscriptions.push(this.renderer.on("click",(e,t)=>{this.options.interact&&(this.seekTo(e),this.emit("interaction",e*this.getDuration()),this.emit("click",e,t))}),this.renderer.on("dblclick",(e,t)=>{this.emit("dblclick",e,t)}),this.renderer.on("scroll",(e,t,n,r)=>{const s=this.getDuration();this.emit("scroll",e*s,t*s,n,r)}),this.renderer.on("render",()=>{this.emit("redraw")}),this.renderer.on("rendered",()=>{this.emit("redrawcomplete")}),this.renderer.on("dragstart",e=>{this.emit("dragstart",e)}),this.renderer.on("dragend",e=>{this.emit("dragend",e)}),this.renderer.on("resize",()=>{this.emit("resize")}));{let e;const t=this.renderer.on("drag",n=>{var r;if(!this.options.interact)return;this.renderer.renderProgress(n),clearTimeout(e);let s=0;const o=this.options.dragToSeek;this.isPlaying()?s=0:o===!0?s=200:o&&typeof o=="object"&&(s=(r=o.debounceTime)!==null&&r!==void 0?r:200),e=setTimeout(()=>{this.seekTo(n)},s),this.emit("interaction",n*this.getDuration()),this.emit("drag",n)});this.subscriptions.push(()=>{clearTimeout(e),t()})}}initPlugins(){var e;!((e=this.options.plugins)===null||e===void 0)&&e.length&&this.options.plugins.forEach(t=>{this.registerPlugin(t)})}unsubscribePlayerEvents(){this.mediaSubscriptions.forEach(e=>e()),this.mediaSubscriptions=[]}setOptions(e){this.options=Object.assign({},this.options,e),e.duration&&!e.peaks&&(this.decodedData=Ce.createBuffer(this.exportPeaks(),e.duration)),e.peaks&&e.duration&&(this.decodedData=Ce.createBuffer(e.peaks,e.duration)),this.renderer.setOptions(this.options),e.audioRate&&this.setPlaybackRate(e.audioRate),e.mediaControls!=null&&(this.getMediaElement().controls=e.mediaControls)}registerPlugin(e){if(this.plugins.includes(e))return e;e._init(this),this.plugins.push(e);const t=e.once("destroy",()=>{this.plugins=this.plugins.filter(n=>n!==e),this.subscriptions=this.subscriptions.filter(n=>n!==t)});return this.subscriptions.push(t),e}unregisterPlugin(e){this.plugins=this.plugins.filter(t=>t!==e),e.destroy()}getWrapper(){return this.renderer.getWrapper()}getWidth(){return this.renderer.getWidth()}getScroll(){return this.renderer.getScroll()}setScroll(e){return this.renderer.setScroll(e)}setScrollTime(e){const t=e/this.getDuration();this.renderer.setScrollPercentage(t)}getActivePlugins(){return this.plugins}loadAudio(e,t,n,r){return z(this,void 0,void 0,function*(){var s;const o=++this._loadVersion;if(this._isDestroyed=!1,this.emit("load",e),!this.options.media&&this.isPlaying()&&this.pause(),this.decodedData=null,this.stopAtPosition=null,(s=this.abortController)===null||s===void 0||s.abort(),this.abortController=null,!t&&!n){const a=this.options.fetchParams||{};window.AbortController&&!a.signal&&(this.abortController=new AbortController,a.signal=this.abortController.signal);const c=d=>this.emit("loading",d);if(t=yield vn.fetchBlob(e,c,a),this._isDestroyed||o!==this._loadVersion)return;const h=this.options.blobMimeType;h&&(t=new Blob([t],{type:h}))}if(this._isDestroyed||o!==this._loadVersion)return;this.setSrc(e,t);const l=yield new Promise(a=>{const c=r||this.getDuration();c?a(c):this.mediaSubscriptions.push(this.onMediaEvent("loadedmetadata",()=>a(this.getDuration()),{once:!0}))});if(!this._isDestroyed&&o===this._loadVersion){if(!e&&!t){const a=this.getMediaElement();a instanceof Ve&&(a.duration=l)}if(n)this.decodedData=Ce.createBuffer(n,l||0);else if(t){const a=yield t.arrayBuffer();if(this._isDestroyed||o!==this._loadVersion)return;this.decodedData=yield Ce.decode(a,this.options.sampleRate)}this._isDestroyed||o!==this._loadVersion||(this.decodedData&&(this.emit("decode",this.getDuration()),this.renderer.render(this.decodedData)),this.emit("ready",this.getDuration()))}})}load(e,t,n){return z(this,void 0,void 0,function*(){try{return yield this.loadAudio(e,void 0,t,n)}catch(r){throw this.emit("error",r),r}})}loadBlob(e,t,n){return z(this,void 0,void 0,function*(){try{return yield this.loadAudio("",e,t,n)}catch(r){throw this.emit("error",r),r}})}zoom(e){if(!this.decodedData)throw new Error("No audio loaded");this.renderer.zoom(e),this.emit("zoom",e)}getDecodedData(){return this.decodedData}exportPeaks({channels:e=2,maxLength:t=8e3,precision:n=1e4}={}){if(!this.decodedData)throw new Error("The audio has not been decoded yet");const r=Math.min(e,this.decodedData.numberOfChannels),s=[];for(let o=0;o<r;o++){const l=this.decodedData.getChannelData(o),a=[],c=l.length/t;for(let h=0;h<t;h++){const d=l.slice(Math.floor(h*c),Math.ceil((h+1)*c));let u=0;for(let m=0;m<d.length;m++){const p=d[m];Math.abs(p)>Math.abs(u)&&(u=p)}a.push(Math.round(u*n)/n)}s.push(a)}return s}getDuration(){let e=super.getDuration()||0;return e!==0&&e!==1/0||!this.decodedData||(e=this.decodedData.duration),e}toggleInteraction(e){this.options.interact=e}setTime(e){this.stopAtPosition=null,super.setTime(e),this.updateProgress(e),this.emit("timeupdate",e)}seekTo(e){const t=this.getDuration()*e;this.setTime(t)}play(e,t){const n=Object.create(null,{play:{get:()=>super.play}});return z(this,void 0,void 0,function*(){e!=null&&this.setTime(e);const r=yield n.play.call(this);return t!=null&&(this.media instanceof Ve?this.media.stopAt(t):this.stopAtPosition=t),r})}playPause(){return z(this,void 0,void 0,function*(){return this.isPlaying()?this.pause():this.play()})}stop(){this.pause(),this.setTime(0)}skip(e){this.setTime(this.getCurrentTime()+e)}empty(){this.load("",[[0]],.001)}setMediaElement(e){this.unsubscribePlayerEvents(),super.setMediaElement(e),this.initPlayerEvents()}exportImage(){return z(this,arguments,void 0,function*(e="image/png",t=1,n="dataURL"){return this.renderer.exportImage(e,t,n)})}destroy(){var e;this._isDestroyed=!0,this.emit("destroy"),(e=this.abortController)===null||e===void 0||e.abort(),this.plugins.forEach(t=>t.destroy()),this.subscriptions.forEach(t=>t()),this.unsubscribePlayerEvents(),this.reactiveCleanups.forEach(t=>t()),this.reactiveCleanups=[],this.timer.destroy(),this.renderer.destroy(),super.destroy()}}be.BasePlugin=class extends ye{constructor(i){super(),this.subscriptions=[],this.isDestroyed=!1,this.options=i}onInit(){}_init(i){this.isDestroyed&&(this.subscriptions=[],this.isDestroyed=!1),this.wavesurfer=i,this.onInit()}destroy(){this.emit("destroy"),this.subscriptions.forEach(i=>i()),this.subscriptions=[],this.isDestroyed=!0,this.wavesurfer=void 0}},be.dom=gn;class jt{constructor(){this.listeners={}}on(e,t,n){if(this.listeners[e]||(this.listeners[e]=new Set),n==null?void 0:n.once){const r=(...s)=>{this.un(e,r),t(...s)};return this.listeners[e].add(r),()=>this.un(e,r)}return this.listeners[e].add(t),()=>this.un(e,t)}un(e,t){var n;(n=this.listeners[e])===null||n===void 0||n.delete(t)}once(e,t){return this.on(e,t,{once:!0})}unAll(){this.listeners={}}emit(e,...t){this.listeners[e]&&this.listeners[e].forEach(n=>n(...t))}}class Ln extends jt{constructor(e){super(),this.subscriptions=[],this.isDestroyed=!1,this.options=e}onInit(){}_init(e){this.isDestroyed&&(this.subscriptions=[],this.isDestroyed=!1),this.wavesurfer=e,this.onInit()}destroy(){this.emit("destroy"),this.subscriptions.forEach(e=>e()),this.subscriptions=[],this.isDestroyed=!0,this.wavesurfer=void 0}}function Ut(i,e){const t=e.xmlns?document.createElementNS(e.xmlns,i):document.createElement(i);for(const[n,r]of Object.entries(e))if(n==="children"&&r)for(const[s,o]of Object.entries(r))o instanceof Node?t.appendChild(o):typeof o=="string"?t.appendChild(document.createTextNode(o)):t.appendChild(Ut(s,o));else n==="style"?Object.assign(t.style,r):n==="textContent"?t.textContent=r:t.setAttribute(n,r.toString());return t}function ge(i,e,t){const n=Ut(i,e||{});return t==null||t.appendChild(n),n}function Vt(i){let e=i;const t=new Set;return{get value(){return e},set(n){Object.is(e,n)||(e=n,t.forEach(r=>r(e)))},update(n){this.set(n(e))},subscribe:n=>(t.add(n),()=>t.delete(n))}}function Se(i,e){let t;const n=()=>{t&&(t(),t=void 0),t=i()},r=e.map(s=>s.subscribe(n));return n(),()=>{t&&(t(),t=void 0),r.forEach(s=>s())}}function de(i,e){const t=Vt(null),n=r=>{t.set(r)};return i.addEventListener(e,n),t._cleanup=()=>{i.removeEventListener(e,n)},t}function ie(i){const e=i._cleanup;typeof e=="function"&&e()}function Pe(i,e={}){const{threshold:t=3,mouseButton:n=0,touchDelay:r=100}=e,s=Vt(null),o=new Map,l=matchMedia("(pointer: coarse)").matches;let a=()=>{};const c=h=>{if(h.button!==n||o.has(h.pointerId)||(o.set(h.pointerId,h),o.size>1))return;const d=h.pointerId;let u=h.clientX,m=h.clientY,p=!1;const f=Date.now(),g=i.getBoundingClientRect(),{left:v,top:C}=g,S=b=>{if(b.pointerId!==d||b.defaultPrevented||o.size>1||l&&Date.now()-f<r)return;const _=b.clientX,y=b.clientY,A=_-u,O=y-m;(p||Math.abs(A)>t||Math.abs(O)>t)&&(b.preventDefault(),b.stopPropagation(),p||(s.set({type:"start",x:u-v,y:m-C}),p=!0),s.set({type:"move",x:_-v,y:y-C,deltaX:A,deltaY:O}),u=_,m=y)},L=b=>{if(o.delete(b.pointerId)){if(b.pointerId===d&&p){const _=b.clientX,y=b.clientY;s.set({type:"end",x:_-v,y:y-C})}o.size===0&&a()}},w=b=>{b.relatedTarget&&b.relatedTarget!==document.documentElement||L(b)},x=b=>{p&&(b.stopPropagation(),b.preventDefault())},D=b=>{b.defaultPrevented||o.size>1||p&&b.preventDefault()};document.addEventListener("pointermove",S),document.addEventListener("pointerup",L),document.addEventListener("pointerout",w),document.addEventListener("pointercancel",w),document.addEventListener("touchmove",D,{passive:!1}),document.addEventListener("click",x,{capture:!0}),a=()=>{document.removeEventListener("pointermove",S),document.removeEventListener("pointerup",L),document.removeEventListener("pointerout",w),document.removeEventListener("pointercancel",w),document.removeEventListener("touchmove",D),setTimeout(()=>{document.removeEventListener("click",x,{capture:!0})},10)}};return i.addEventListener("pointerdown",c),{signal:s,cleanup:()=>{a(),i.removeEventListener("pointerdown",c),o.clear(),ie(s)}}}class ft extends jt{constructor(e,t,n=0){var r,s,o,l,a,c,h,d,u,m;super(),this.totalDuration=t,this.numberOfChannels=n,this.element=null,this.minLength=0,this.maxLength=1/0,this.contentEditable=!1,this.subscriptions=[],this.updatingSide=void 0,this.isRemoved=!1,this.subscriptions=[],this.id=e.id||`region-${Math.random().toString(32).slice(2)}`,this.start=this.clampPosition(e.start),this.end=this.clampPosition((r=e.end)!==null&&r!==void 0?r:e.start),this.drag=(s=e.drag)===null||s===void 0||s,this.resize=(o=e.resize)===null||o===void 0||o,this.resizeStart=(l=e.resizeStart)===null||l===void 0||l,this.resizeEnd=(a=e.resizeEnd)===null||a===void 0||a,this.color=(c=e.color)!==null&&c!==void 0?c:"rgba(0, 0, 0, 0.1)",this.minLength=(h=e.minLength)!==null&&h!==void 0?h:this.minLength,this.maxLength=(d=e.maxLength)!==null&&d!==void 0?d:this.maxLength,this.channelIdx=(u=e.channelIdx)!==null&&u!==void 0?u:-1,this.contentEditable=(m=e.contentEditable)!==null&&m!==void 0?m:this.contentEditable,this.element=this.initElement(),this.setContent(e.content),this.setPart(),this.renderPosition(),this.initMouseEvents()}clampPosition(e){return Math.max(0,Math.min(this.totalDuration,e))}setPart(){var e;const t=this.start===this.end;(e=this.element)===null||e===void 0||e.setAttribute("part",`${t?"marker":"region"} ${this.id}`)}addResizeHandles(e){const t={position:"absolute",zIndex:"2",width:"6px",height:"100%",top:"0",cursor:"ew-resize",wordBreak:"keep-all"},n=ge("div",{part:"region-handle region-handle-left",style:Object.assign(Object.assign({},t),{left:"0",borderLeft:"2px solid rgba(0, 0, 0, 0.5)",borderRadius:"2px 0 0 2px"})},e),r=ge("div",{part:"region-handle region-handle-right",style:Object.assign(Object.assign({},t),{right:"0",borderRight:"2px solid rgba(0, 0, 0, 0.5)",borderRadius:"0 2px 2px 0"})},e),s=Pe(n,{threshold:1}),o=Pe(r,{threshold:1}),l=Se(()=>{const c=s.signal.value;c&&(c.type==="move"&&c.deltaX!==void 0?this.onResize(c.deltaX,"start"):c.type==="end"&&this.onEndResizing("start"))},[s.signal]),a=Se(()=>{const c=o.signal.value;c&&(c.type==="move"&&c.deltaX!==void 0?this.onResize(c.deltaX,"end"):c.type==="end"&&this.onEndResizing("end"))},[o.signal]);this.subscriptions.push(()=>{l(),a(),s.cleanup(),o.cleanup()})}removeResizeHandles(e){const t=e.querySelector('[part*="region-handle-left"]'),n=e.querySelector('[part*="region-handle-right"]');t&&e.removeChild(t),n&&e.removeChild(n)}initElement(){if(this.isRemoved)return null;const e=this.start===this.end;let t=0,n=100;this.channelIdx>=0&&this.numberOfChannels>0&&this.channelIdx<this.numberOfChannels&&(n=100/this.numberOfChannels,t=n*this.channelIdx);const r=ge("div",{style:{position:"absolute",top:`${t}%`,height:`${n}%`,backgroundColor:e?"none":this.color,borderLeft:e?"2px solid "+this.color:"none",borderRadius:"2px",boxSizing:"border-box",transition:"background-color 0.2s ease",cursor:this.drag?"grab":"default",pointerEvents:"all"}});return!e&&this.resize&&this.addResizeHandles(r),r}renderPosition(){if(!this.element)return;const e=this.start/this.totalDuration,t=(this.totalDuration-this.end)/this.totalDuration;this.element.style.left=100*e+"%",this.element.style.right=100*t+"%"}toggleCursor(e){var t;this.drag&&(!((t=this.element)===null||t===void 0)&&t.style)&&(this.element.style.cursor=e?"grabbing":"grab")}initMouseEvents(){const{element:e}=this;if(!e)return;const t=de(e,"click"),n=de(e,"mouseenter"),r=de(e,"mouseleave"),s=de(e,"dblclick"),o=de(e,"pointerdown"),l=de(e,"pointerup"),a=t.subscribe(g=>g&&this.emit("click",g)),c=n.subscribe(g=>g&&this.emit("over",g)),h=r.subscribe(g=>g&&this.emit("leave",g)),d=s.subscribe(g=>g&&this.emit("dblclick",g)),u=o.subscribe(g=>g&&this.toggleCursor(!0)),m=l.subscribe(g=>g&&this.toggleCursor(!1));this.subscriptions.push(()=>{a(),c(),h(),d(),u(),m(),ie(t),ie(n),ie(r),ie(s),ie(o),ie(l)});const p=Pe(e),f=Se(()=>{const g=p.signal.value;g&&(g.type==="start"?this.toggleCursor(!0):g.type==="move"&&g.deltaX!==void 0?this.onMove(g.deltaX):g.type==="end"&&(this.toggleCursor(!1),this.drag&&this.emit("update-end")))},[p.signal]);this.subscriptions.push(()=>{f(),p.cleanup()}),this.contentEditable&&this.content&&(this.contentClickListener=g=>this.onContentClick(g),this.contentBlurListener=()=>this.onContentBlur(),this.content.addEventListener("click",this.contentClickListener),this.content.addEventListener("blur",this.contentBlurListener))}_onUpdate(e,t,n){var r;if(!(!((r=this.element)===null||r===void 0)&&r.parentElement))return;const{width:s}=this.element.parentElement.getBoundingClientRect(),o=e/s*this.totalDuration;let l=t&&t!=="start"?this.start:this.start+o,a=t&&t!=="end"?this.end:this.end+o;const c=n!==void 0;c&&this.updatingSide&&this.updatingSide!==t&&(this.updatingSide==="start"?l=n:a=n),l=Math.max(0,l),a=Math.min(this.totalDuration,a);const h=a-l;this.updatingSide=t;const d=h>=this.minLength&&h<=this.maxLength;l<=a&&(d||c)&&(this.start=l,this.end=a,this.renderPosition(),this.emit("update",t))}onMove(e){this.drag&&this._onUpdate(e)}onResize(e,t){this.resize&&(this.resizeStart||t!=="start")&&(this.resizeEnd||t!=="end")&&this._onUpdate(e,t)}onEndResizing(e){this.resize&&(this.emit("update-end",e),this.updatingSide=void 0)}onContentClick(e){e.stopPropagation(),e.target.focus(),this.emit("click",e)}onContentBlur(){this.emit("update-end")}_setTotalDuration(e){this.totalDuration=e,this.renderPosition()}play(e){this.emit("play",e&&this.end!==this.start?this.end:void 0)}getContent(e=!1){var t;return e?this.content||void 0:this.element instanceof HTMLElement?((t=this.content)===null||t===void 0?void 0:t.innerHTML)||void 0:""}setContent(e){var t;if(this.element)if(this.content&&this.contentEditable&&(this.contentClickListener&&this.content.removeEventListener("click",this.contentClickListener),this.contentBlurListener&&this.content.removeEventListener("blur",this.contentBlurListener)),(t=this.content)===null||t===void 0||t.remove(),e){if(typeof e=="string"){const n=this.start===this.end;this.content=ge("div",{style:{padding:`0.2em ${n?.2:.4}em`,display:"inline-block"},textContent:e})}else this.content=e;this.contentEditable&&(this.content.contentEditable="true",this.contentClickListener=n=>this.onContentClick(n),this.contentBlurListener=()=>this.onContentBlur(),this.content.addEventListener("click",this.contentClickListener),this.content.addEventListener("blur",this.contentBlurListener)),this.content.setAttribute("part","region-content"),this.element.appendChild(this.content),this.emit("content-changed")}else this.content=void 0}setOptions(e){var t,n;if(this.element){if(e.color&&(this.color=e.color,this.element.style.backgroundColor=this.color),e.drag!==void 0&&(this.drag=e.drag,this.element.style.cursor=this.drag?"grab":"default"),e.start!==void 0||e.end!==void 0){const r=this.start===this.end;this.start=this.clampPosition((t=e.start)!==null&&t!==void 0?t:this.start),this.end=this.clampPosition((n=e.end)!==null&&n!==void 0?n:r?this.start:this.end),this.renderPosition(),this.setPart(),this.emit("render")}if(e.content&&this.setContent(e.content),e.id&&(this.id=e.id,this.setPart()),e.resize!==void 0&&e.resize!==this.resize){const r=this.start===this.end;this.resize=e.resize,this.resize&&!r?this.addResizeHandles(this.element):this.removeResizeHandles(this.element)}e.resizeStart!==void 0&&(this.resizeStart=e.resizeStart),e.resizeEnd!==void 0&&(this.resizeEnd=e.resizeEnd)}}remove(){this.isRemoved=!0,this.emit("remove"),this.subscriptions.forEach(e=>e()),this.subscriptions=[],this.content&&this.contentEditable&&(this.contentClickListener&&(this.content.removeEventListener("click",this.contentClickListener),this.contentClickListener=void 0),this.contentBlurListener&&(this.content.removeEventListener("blur",this.contentBlurListener),this.contentBlurListener=void 0)),this.element&&(this.element.remove(),this.element=null),this.unAll()}}class Je extends Ln{constructor(e){super(e),this.regions=[],this.regionsContainer=this.initRegionsContainer()}static create(e){return new Je(e)}onInit(){if(!this.wavesurfer)throw Error("WaveSurfer is not initialized");this.wavesurfer.getWrapper().appendChild(this.regionsContainer),this.subscriptions.push(this.wavesurfer.on("ready",t=>{this.regions.forEach(n=>n._setTotalDuration(t))}));let e=[];this.subscriptions.push(this.wavesurfer.on("timeupdate",t=>{const n=this.regions.filter(r=>r.start<=t&&(r.end===r.start?r.start+.05:r.end)>=t);n.forEach(r=>{e.includes(r)||this.emit("region-in",r)}),e.forEach(r=>{n.includes(r)||this.emit("region-out",r)}),e=n}))}initRegionsContainer(){return ge("div",{part:"regions-container",style:{position:"absolute",top:"0",left:"0",width:"100%",height:"100%",zIndex:"5",pointerEvents:"none"}})}getRegions(){return this.regions}avoidOverlapping(e){e.content&&!e.isRemoved&&setTimeout(()=>{if(!e.content)return;const t=e.content;t.style.marginTop="0";const n=t.getBoundingClientRect(),r=this.regions.indexOf(e);if(r<0)return;const s=this.regions.slice(0,r).filter(o=>!o.isRemoved).reduce((o,l)=>{if(l===e||!l.content)return o;const a=l.content.getBoundingClientRect();return n.left<a.right&&a.left<n.right&&o.push(a),o},[]).sort((o,l)=>o.top-l.top).reduce((o,l)=>{const a=n.top+o,c=a+n.height;return a<l.bottom&&l.top<c?l.bottom-n.top+2:o},0);t.style.marginTop=`${s}px`},10)}avoidOverlappingAll(){this.regions.forEach(e=>this.avoidOverlapping(e))}adjustScroll(e){var t,n;if(!e.element)return;const r=(n=(t=this.wavesurfer)===null||t===void 0?void 0:t.getWrapper())===null||n===void 0?void 0:n.parentElement;if(!r)return;const{clientWidth:s,scrollWidth:o}=r;if(o<=s)return;const l=r.getBoundingClientRect(),a=e.element.getBoundingClientRect(),c=a.left-l.left,h=a.right-l.left;c<0?r.scrollLeft+=c:h>s&&(r.scrollLeft+=h-s)}virtualAppend(e,t,n){const r=()=>{if(!this.wavesurfer)return;const s=this.wavesurfer.getWidth(),o=this.wavesurfer.getScroll(),l=t.clientWidth,a=this.wavesurfer.getDuration(),c=Math.round(e.start/a*l),h=c+(Math.round((e.end-e.start)/a*l)||1)>o&&c<o+s;h&&!n.parentElement?t.appendChild(n):!h&&n.parentElement&&n.remove()};setTimeout(()=>{if(!this.wavesurfer||!e.element)return;r();const s=this.wavesurfer.on("scroll",r),o=this.wavesurfer.on("zoom",r),l=this.wavesurfer.on("resize",r),a=e.on("render",r);this.subscriptions.push(s,o,l,a),e.once("remove",()=>{s(),o(),l(),a()})},0)}saveRegion(e){if(!e.element)return;this.virtualAppend(e,this.regionsContainer,e.element),this.avoidOverlapping(e),this.regions.push(e);const t=[e.on("update",n=>{n||this.adjustScroll(e),this.emit("region-update",e,n)}),e.on("update-end",n=>{this.avoidOverlappingAll(),this.emit("region-updated",e,n)}),e.on("play",n=>{var r;(r=this.wavesurfer)===null||r===void 0||r.play(e.start,n)}),e.on("click",n=>{this.emit("region-clicked",e,n)}),e.on("dblclick",n=>{this.emit("region-double-clicked",e,n)}),e.on("content-changed",()=>{this.emit("region-content-changed",e)}),e.once("remove",()=>{t.forEach(n=>n()),this.regions=this.regions.filter(n=>n!==e),this.emit("region-removed",e)})];this.subscriptions.push(...t),this.emit("region-created",e)}addRegion(e){var t,n;if(!this.wavesurfer)throw Error("WaveSurfer is not initialized");const r=this.wavesurfer.getDuration(),s=(n=(t=this.wavesurfer)===null||t===void 0?void 0:t.getDecodedData())===null||n===void 0?void 0:n.numberOfChannels,o=new ft(e,r,s);return this.emit("region-initialized",o),r?this.saveRegion(o):this.subscriptions.push(this.wavesurfer.once("ready",l=>{o._setTotalDuration(l),this.saveRegion(o)})),o}enableDragSelection(e,t=3){var n;const r=(n=this.wavesurfer)===null||n===void 0?void 0:n.getWrapper();if(!(r&&r instanceof HTMLElement))return()=>{};let s=null,o=0,l=0;const a=Pe(r,{threshold:t}),c=Se(()=>{var h,d;const u=a.signal.value;if(u)if(u.type==="start"){if(o=u.x,!this.wavesurfer)return;const m=this.wavesurfer.getDuration(),p=(d=(h=this.wavesurfer)===null||h===void 0?void 0:h.getDecodedData())===null||d===void 0?void 0:d.numberOfChannels,{width:f}=this.wavesurfer.getWrapper().getBoundingClientRect();l=o/f*m;const g=u.x/f*m,v=(u.x+5)/f*m;s=new ft(Object.assign(Object.assign({},e),{start:g,end:v}),m,p),this.emit("region-initialized",s),s.element&&this.regionsContainer.appendChild(s.element)}else u.type==="move"&&u.deltaX!==void 0?s&&s._onUpdate(u.deltaX,u.x>o?"end":"start",l):u.type==="end"&&s&&(this.saveRegion(s),s.updatingSide=void 0,s=null)},[a.signal]);return()=>{c(),a.cleanup()}}clearRegions(){this.regions.slice().forEach(e=>e.remove()),this.regions=[]}destroy(){this.clearRegions(),super.destroy(),this.regionsContainer.remove()}}const Xt={lead:"主角",supporting:"配角",mascot:"吉祥物"},Y={lead:"#3b82f6",supporting:"#64748b",mascot:"#ec4899"},gt=[{name:"迪迪",role:"lead"},{name:"克克",role:"lead"},{name:"林林",role:"lead"},{name:"泰泰",role:"lead"},{name:"怪氣流",role:"mascot"},{name:"田鼠先生",role:"mascot"},{name:"田鼠太太",role:"mascot"},{name:"吵鬧菇",role:"mascot"},{name:"穿山甲大叔",role:"supporting"},{name:"花福導遊",role:"supporting"},{name:"達東爸",role:"supporting"},{name:"達東媽",role:"supporting"},{name:"村長",role:"supporting"},{name:"卡爾博士",role:"supporting"},{name:"小達東",role:"supporting"},{name:"阿桂",role:"supporting"}];function qt(i,e){if(!i)return null;const t=e.find(n=>n.name===i);return t?Y[t.role]:null}const Kt="voicepicker.author",Gt="voicepicker.comments",Jt="voicepicker.characters";function Sn(){return localStorage.getItem(Kt)??""}function Pn(i){localStorage.setItem(Kt,i)}function Dn(i){const e=i??{};return{id:typeof e.id=="string"?e.id:Math.random().toString(36).slice(2),author:typeof e.author=="string"?e.author:"",text:typeof e.text=="string"?e.text:"",created:typeof e.created=="number"?e.created:Date.now()}}function We(i){const e=i??{},t=e.character;let n;Array.isArray(t)?n=t.filter(s=>typeof s=="string"):typeof t=="string"?n=[t]:n=[];const r=Array.isArray(e.replies)?e.replies.map(Dn):[];return{id:typeof e.id=="string"?e.id:Math.random().toString(36).slice(2),file:typeof e.file=="string"?e.file:"",time:typeof e.time=="number"?e.time:null,text:typeof e.text=="string"?e.text:"",author:typeof e.author=="string"?e.author:"",character:n,replies:r,rating:typeof e.rating=="number"?Math.min(5,Math.max(0,Math.round(e.rating))):0}}function Rn(){try{const i=localStorage.getItem(Gt);return i?JSON.parse(i).map(We):[]}catch{return[]}}function Ye(i){localStorage.setItem(Gt,JSON.stringify(i))}function Mn(){try{const i=localStorage.getItem(Jt);return i?JSON.parse(i):[...gt]}catch{return[...gt]}}function _e(i){localStorage.setItem(Jt,JSON.stringify(i))}const Tn=`<!DOCTYPE html>
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
`,Nn=new Set(["wav","mp3","m4a","aac","ogg","flac","wma","opus"]),vt=4,_n=1.5,On=.25,Ze="voicepicker.json";let N=[],U=-1,we=null,H="single",j=0,V=null,bt,De,Oe=null,te=Sn(),R=Rn(),T=Mn(),Qe=0,oe=!0,ae=[],I="text",me=null,J=null,Ie=null,B=[],W=0,Ee=null,Re="rating",he=!1,K="all",se=0;const E=i=>document.getElementById(i),yt=E("pick"),Et=E("exportBtn"),xt=E("importBtn"),Me=E("importFile"),Ct=E("editChars"),wt=E("roleViewBtn"),kt=E("filelist"),Yt=E("nowplaying"),et=E("status"),ze=E("playBtn"),In=E("appVer"),zn=E("sidebar"),An=E("player"),Te=E("grid"),$=E("roleview"),Bn=E("comments"),Wn=E("commentsHead"),Ne=E("commentlist"),tt=E("composer"),ue=E("composerToggle"),fe=E("composerText"),Zt=E("composerChars"),Lt=E("composerRatingEl"),He=E("nameModal"),Ae=E("nameInput"),nt=E("charModal"),St=E("charEditList"),Xe=E("newCharName"),Hn=E("newCharRole"),Qt=E("addCharBtn"),$n=E("closeCharBtn"),Pt=E("ratingsBtn"),Dt=E("shareBtn"),it=E("shareModal"),Fn=E("shareCancelBtn"),jn=E("shareConfirmBtn"),P=be.create({container:"#waveform",waveColor:"#7a8ba6",progressColor:"#3b82f6",cursorColor:"#ef4444",height:120}),qe=P.registerPlugin(Je.create());P.on("ready",()=>{et.textContent=`${Be(0)} / ${Be(P.getDuration())}`});P.on("timeupdate",i=>{et.textContent=`${Be(i)} / ${Be(P.getDuration())}`});P.on("play",()=>{ze.textContent="⏸ 暫停",H==="role"&&xe()});P.on("pause",()=>{ze.textContent="▶ 播放",H==="role"&&xe()});P.on("finish",()=>{H==="single"&&U<N.length-1?ne(U+1):H==="role"&&(Ee=null,xe())});qe.on("region-clicked",(i,e)=>{e.stopPropagation(),P.setTime(i.start),P.play()});ze.addEventListener("click",()=>{ze.blur(),P.playPause()});function rt(i){if(!isFinite(i))return"0:00";const e=Math.floor(i/60),t=Math.floor(i%60).toString().padStart(2,"0");return`${e}:${t}`}function Be(i){if(!isFinite(i))return"0:00.00";const e=Math.floor(i/60),t=Math.floor(i%60),n=Math.floor((i-Math.floor(i))*100);return`${e}:${t.toString().padStart(2,"0")}.${n.toString().padStart(2,"0")}`}function en(){return Math.random().toString(36).slice(2)+Date.now().toString(36)}function Ke(i){return i.code==="Enter"||i.code==="NumpadEnter"}function st(i,e){const t=i.indexOf(e);t>=0?i.splice(t,1):i.push(e)}function pe(i){return i.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}function $e(){return U>=0&&U<N.length?N[U].name:null}function Un(){return H==="grid"?j>=0&&j<N.length?N[j].name:null:$e()}function ot(i){return i?R.filter(e=>e.file===i).sort((e,t)=>(e.time??-1/0)-(t.time??-1/0)):[]}function tn(i){return R.filter(e=>e.file===i).length}function Vn(i){return(i.length?qt(i[0],T):null)??"#3b82f6"}function Z(){nn(),je(),Fe(),ce(),H==="role"&&le()}function Q(){var i;ce(),H==="role"&&le(),J&&((i=(H==="role"?$:Ne).querySelector(".creply-input input"))==null||i.focus())}function nn(){Ye(R),V&&(window.clearTimeout(bt),bt=window.setTimeout(()=>void Xn(),300))}async function Xn(){if(V)try{const e=await(await V.getFileHandle(Ze,{create:!0})).createWritable();await e.write(JSON.stringify({version:1,updated:new Date().toISOString(),comments:R},null,2)),await e.close()}catch{}}function rn(i){const e=new Map(R.map(t=>[t.id,t]));i.forEach(t=>e.set(t.id,t)),R=[...e.values()]}async function qn(){if(V)try{const e=await(await V.getFileHandle(Ze)).getFile(),t=JSON.parse(await e.text());Array.isArray(t==null?void 0:t.comments)&&(rn(t.comments.map(We)),Ye(R))}catch{}}function Kn(){const i=JSON.stringify({version:1,exported:new Date().toISOString(),comments:R,characters:T},null,2),e=new Blob([i],{type:"application/json"}),t=URL.createObjectURL(e),n=new Date,r=l=>String(l).padStart(2,"0"),s=`${n.getFullYear()}${r(n.getMonth()+1)}${r(n.getDate())}-${r(n.getHours())}${r(n.getMinutes())}`,o=document.createElement("a");o.href=t,o.download=`voicepicker-backup-${s}.json`,o.click(),URL.revokeObjectURL(t)}async function Gn(i){try{const e=JSON.parse(await i.text());Array.isArray(e==null?void 0:e.comments)&&rn(e.comments.map(We)),Array.isArray(e==null?void 0:e.characters)&&e.characters.length>0&&(T=e.characters,_e(T)),Z(),alert(`匯入完成：目前共 ${R.length} 則留言。`)}catch{alert("匯入失敗：檔案不是有效的 VoicePicker 備份。")}}Et.addEventListener("click",()=>{Et.blur(),Kn()});xt.addEventListener("click",()=>{xt.blur(),Me.click()});Me.addEventListener("change",()=>{var e;const i=(e=Me.files)==null?void 0:e[0];i&&Gn(i),Me.value=""});yt.addEventListener("click",async()=>{var e;yt.blur();const i=window.showDirectoryPicker;if(!i){alert("此瀏覽器不支援資料夾選取，請改用 Chrome / Edge。");return}try{V=await i({mode:"readwrite"})}catch{return}N=[];for await(const[t,n]of V.entries()){if(n.kind!=="file")continue;const r=((e=t.split(".").pop())==null?void 0:e.toLowerCase())??"";Nn.has(r)&&N.push({name:t,handle:n})}N.sort((t,n)=>t.name.localeCompare(n.name,"zh-Hant",{numeric:!0})),await qn(),Oe=Date.now(),hi(),pn(),Fe(),N.length>0?(j=0,ne(0)):Yt.textContent="此資料夾沒有音檔"});function Fe(){kt.innerHTML="",N.forEach((i,e)=>{const t=document.createElement("li");e===U&&(t.className="active");const n=document.createElement("span");n.textContent=i.name,n.style.overflow="hidden",n.style.textOverflow="ellipsis",t.appendChild(n);const r=tn(i.name);if(r>0){const s=document.createElement("span");s.className="badge",s.textContent=String(r),t.appendChild(s)}t.addEventListener("click",()=>void ne(e)),kt.appendChild(t)})}async function ne(i){if(i<0||i>=N.length)return;U=i,j=i,Fe();const e=N[i];Yt.textContent=e.name,et.textContent="載入中…";const t=await e.handle.getFile();we&&URL.revokeObjectURL(we),we=URL.createObjectURL(t),await P.load(we),je(),ce(),P.play()}function je(){qe.clearRegions(),ot($e()).filter(e=>e.time!==null).forEach((e,t)=>{qe.addRegion({start:e.time,content:String(t+1),color:Vn(e.character),drag:!1,resize:!1})})}function Jn(i,e){const t=document.createElement("div");t.className="c-rating";for(let n=1;n<=5;n++){const r=document.createElement("button");r.type="button",r.className="c-star"+(n<=i.rating?" filled":""),r.textContent="★",r.title=`${n} 分${i.rating===n?"（再按清除）":""}`,r.addEventListener("click",s=>{s.stopPropagation(),i.rating=i.rating===n?0:n,Z()}),t.appendChild(r)}e.appendChild(t)}function sn(i,e={}){const t=document.createElement("div");t.className="citem"+(e.role?" role":"")+(e.focused?" rolefocus":""),e.role&&e.ridx!==void 0&&(t.dataset.ridx=String(e.ridx));let n=t;if(e.role){const d=document.createElement("div");d.className="card-inner";const u=document.createElement("div");u.className="card-main";const m=document.createElement("button");m.className="cplay",m.dataset.cid=i.id,m.textContent=Ee===i.id&&P.isPlaying()?"⏸":"▶",m.addEventListener("click",p=>{p.stopPropagation(),ln(i,e.ridx)}),d.append(u,m),t.appendChild(d),n=u}const r=document.createElement("div");r.className="crow";const s=document.createElement("span");if(i.time===null?(s.className="ctime general",s.textContent="整體"):(s.className="ctime",s.textContent=rt(i.time),s.addEventListener("click",d=>{d.stopPropagation(),Ge(i)})),r.appendChild(s),e.role){const d=document.createElement("span");if(d.className="cfile",d.textContent=i.file,e.badge){const u=document.createElement("span");u.className="cfile-badge",u.textContent=e.badge,d.appendChild(u)}d.addEventListener("click",u=>{u.stopPropagation(),Ge(i)}),r.appendChild(d)}const o=document.createElement("span");o.className="cauthor",o.textContent=i.author,r.appendChild(o);const l=document.createElement("button");l.className="cdel",l.textContent="×",l.title="刪除",l.addEventListener("click",d=>{d.stopPropagation(),R=R.filter(u=>u.id!==i.id),Z()}),r.appendChild(l),n.appendChild(r),Jn(i,n);const a=document.createElement("div");a.className="ctext",a.textContent=i.text,a.addEventListener("dblclick",d=>{d.stopPropagation(),a.contentEditable="true",a.focus()}),a.addEventListener("keydown",d=>{d.isComposing||d.key==="Enter"&&!d.shiftKey&&(d.preventDefault(),a.blur())}),a.addEventListener("blur",()=>{a.contentEditable="false";const d=(a.innerText??"").trim();d?(i.text=d,Z()):a.textContent=i.text}),n.appendChild(a);const c=document.createElement("div");if(c.className="ctag-row",Yn(i,c),n.appendChild(c),i.replies.length){const d=document.createElement("div");d.className="creplies",i.replies.forEach(u=>{const m=document.createElement("div");m.className="creply";const p=document.createElement("span");p.className="crauthor",p.textContent=u.author+"：";const f=document.createElement("span");f.textContent=u.text;const g=document.createElement("button");g.className="crdel",g.textContent="×",g.addEventListener("click",v=>{v.stopPropagation(),i.replies=i.replies.filter(C=>C.id!==u.id),Z()}),m.append(p,f,g),d.appendChild(m)}),n.appendChild(d)}const h=document.createElement("div");if(h.className="creply-input",J===i.id){const d=document.createElement("input");d.type="text",d.placeholder="回覆…（Enter 送出 / Esc 取消）",d.addEventListener("keydown",m=>{m.stopPropagation(),!m.isComposing&&(m.key==="Enter"?(m.preventDefault(),Mt(i,d.value)):m.key==="Escape"&&(m.preventDefault(),J=null,Q()))});const u=document.createElement("button");u.textContent="送出",u.addEventListener("click",m=>{m.stopPropagation(),Mt(i,d.value)}),h.append(d,u)}else{const d=document.createElement("button");d.className="creply-toggle",d.textContent="＋ 回覆",d.addEventListener("click",u=>{if(u.stopPropagation(),!te){Ue(()=>{J=i.id,Q()});return}J=i.id,Q()}),h.appendChild(d)}return n.appendChild(h),t}function Yn(i,e){if(me===i.id){const t=document.createElement("div");t.className="char-picker",cn(t,i.character,r=>{st(i.character,r),Z()});const n=document.createElement("button");n.type="button",n.className="charchip done",n.textContent="完成",n.addEventListener("click",r=>{r.stopPropagation(),me=null,Q()}),t.appendChild(n),e.appendChild(t)}else if(i.character.length>0)i.character.forEach(t=>{const n=document.createElement("span");n.className="ctag",n.style.background=qt(t,T)??"#3b82f6",n.textContent=t,n.addEventListener("click",r=>{r.stopPropagation(),me=i.id,Q()}),e.appendChild(n)});else{const t=document.createElement("span");t.className="ctag empty",t.textContent="＋ 角色",t.addEventListener("click",n=>{n.stopPropagation(),me=i.id,Q()}),e.appendChild(t)}}function ce(){const i=Un();Wn.textContent=i?`留言 · ${i}`:"留言",Ne.innerHTML="";const e=ot(i);if(e.length===0){const t=document.createElement("li");t.style.color="var(--muted)",t.style.fontSize="13px",t.textContent=i?"尚無留言。播放時按 C 新增。":"尚未選擇檔案。",Ne.appendChild(t);return}e.forEach(t=>Ne.appendChild(sn(t)))}function on(i,e){const t=[...i];return e==="rating"?t.sort((n,r)=>r.rating-n.rating||n.file.localeCompare(r.file,"zh-Hant",{numeric:!0})||(n.time??-1/0)-(r.time??-1/0)):e==="file"?t.sort((n,r)=>n.file.localeCompare(r.file,"zh-Hant",{numeric:!0})||(n.time??-1/0)-(r.time??-1/0)):t.sort((n,r)=>n.author.localeCompare(r.author,"zh-Hant")||n.file.localeCompare(r.file,"zh-Hant",{numeric:!0})||(n.time??-1/0)-(r.time??-1/0)),t}function Zn(i){let e=R.filter(t=>t.character.includes(i));return K==="hide"?e=e.filter(t=>t.rating>0):K==="solo"&&(e=e.filter(t=>t.rating===0)),on(e,Re)}function le(){$.innerHTML="",B=[],$.classList.toggle("role-compact",he);const i=document.createElement("div");i.className="role-head";const e=document.createElement("h2");e.textContent="角色 Dashboard";const t=document.createElement("button");t.className="ghost",t.textContent="返回單檔",t.addEventListener("click",()=>G("single"));const n=document.createElement("span");n.className="role-hint",n.textContent="↑↓ 移動 · 空白鍵 就地播放 · Enter 進單檔 · Tab/Esc 返回";const r=document.createElement("div");r.className="role-sort-toggle",["rating","file","user"].forEach(f=>{const g=f==="rating"?"評分":f==="file"?"檔案":"使用者",v=document.createElement("button");v.className="role-sort-btn"+(Re===f?" active":""),v.textContent=g,v.addEventListener("click",()=>{Re=f,le()}),r.appendChild(v)});const s=document.createElement("button");s.className="role-compact-btn"+(he?" active":""),s.textContent="簡潔",s.title="隱藏回覆與角色標籤，雙欄顯示",s.addEventListener("click",()=>{he=!he,$.classList.toggle("role-compact",he),s.classList.toggle("active",he)});const o={all:"hide",hide:"solo",solo:"all"},l={all:"點擊隱藏 0 分評論",hide:"0 分已隱藏 · 再按 Solo",solo:"Solo 0 分 · 再按恢復"},a=document.createElement("button");a.className="role-zero-btn"+(K!=="all"?" "+K:""),a.textContent="👎",a.title=l[K],a.addEventListener("click",()=>{K=o[K],le()}),i.append(e,t,n,r,s,a),$.appendChild(i);const c=["lead","mascot","supporting"],h=R.filter(f=>f.character.length===0).length,d=document.createElement("div");d.className="role-stats-wrap";let u=null;if(c.forEach(f=>{const g=T.filter(S=>S.role===f);if(g.length===0)return;const v=document.createElement("div");v.className="role-stats-row",f==="supporting"&&(u=v);const C=document.createElement("span");C.className="role-stats-type",C.textContent=Xt[f],C.style.color=Y[f],v.appendChild(C),g.forEach(S=>{const L=R.filter(x=>x.character.includes(S.name)).length,w=document.createElement("button");w.className="role-stat"+(L===0?" zero":""),w.style.background=Y[S.role],w.textContent=`${S.name} ${L}`,w.addEventListener("click",()=>{var x;(x=$.querySelector(`[data-char="${S.name}"]`))==null||x.scrollIntoView({behavior:"smooth",block:"start"})}),v.appendChild(w)}),d.appendChild(v)}),h>0){const f=document.createElement("button");if(f.className="role-stat",f.style.background="#64748b",f.textContent=`未指定 ${h}`,f.addEventListener("click",()=>{var g;(g=$.querySelector('[data-char="__none__"]'))==null||g.scrollIntoView({behavior:"smooth",block:"start"})}),u)u.appendChild(f);else{const g=document.createElement("div");g.className="role-stats-row",g.appendChild(f),d.appendChild(g)}}$.appendChild(d);const m=(f,g,v)=>{if(v.length===0)return;const C=document.createElement("div");C.className="role-group",C.dataset.char=f;const S=document.createElement("div");S.className="role-group-label",S.style.background=g,S.textContent=f==="__none__"?"未指定":f,C.appendChild(S);const L=document.createElement("div");L.className="role-group-cards-wrap";const w=v.reduce((x,D)=>Math.max(x,D.rating),0);v.forEach(x=>{const D=B.length,b=x.rating===0?"👎":x.rating===w?"🏆":void 0;L.appendChild(sn(x,{role:!0,ridx:D,focused:D===W,badge:b})),B.push(x)}),C.appendChild(L),$.appendChild(C)};T.forEach(f=>m(f.name,Y[f.role],Zn(f.name)));let p=R.filter(f=>f.character.length===0);if(K==="hide"?p=p.filter(f=>f.rating>0):K==="solo"&&(p=p.filter(f=>f.rating===0)),m("__none__","#64748b",on(p,Re)),B.length===0){const f=document.createElement("div");f.style.color="var(--muted)",f.textContent="尚無留言。",$.appendChild(f)}W>=B.length&&(W=Math.max(0,B.length-1))}function xe(){$.querySelectorAll(".cplay").forEach(i=>{i.textContent=Ee===i.dataset.cid&&P.isPlaying()?"⏸":"▶"})}function an(){$.querySelectorAll(".citem").forEach(i=>{const e=i.dataset.ridx===String(W);i.classList.toggle("rolefocus",e),e&&i.scrollIntoView({block:"nearest"})})}function Rt(i){B.length!==0&&(W=Math.min(Math.max(0,W+i),B.length-1),an())}async function Qn(i,e){const t=N.findIndex(r=>r.name===i.file);if(t<0)return;t!==U&&await ne(t),P.setTime(i.time??0),P.play(),Ee=i.id;const n=e!==void 0?e:B.indexOf(i);n>=0&&(W=n,an()),xe()}function ln(i,e){if(Ee===i.id&&P.isPlaying()){P.pause(),xe();return}Qn(i,e)}async function Ge(i){const e=N.findIndex(t=>t.name===i.file);e<0||(H!=="single"&&G("single"),e!==U&&await ne(e),i.time!==null&&P.setTime(i.time),P.play())}function cn(i,e,t,n){i.innerHTML="",T.forEach((r,s)=>{const o=document.createElement("button");o.type="button",o.className="charchip"+(s===n?" focused":""),o.textContent=r.name,o.style.borderColor=Y[r.role],e.includes(r.name)&&(o.style.background=Y[r.role],o.style.color="#fff"),o.addEventListener("click",l=>{l.stopPropagation(),t(r.name)}),i.appendChild(o)})}function Mt(i,e){const t=e.trim();if(!t){J=null,Q();return}const n=()=>{i.replies.push({id:en(),author:te,text:t,created:Date.now()}),J=null,Z()};te?n():Ue(n)}function ei(){if(!(U<0)){if(!te){Ue(()=>Tt());return}Tt()}}function Tt(){P.pause(),Qe=P.getCurrentTime(),oe=!0,fe.value="",ae=[],se=0,I="text",F(),tt.classList.remove("hidden"),fe.focus()}function dn(){tt.classList.add("hidden"),I="text"}function at(){Lt.innerHTML="";for(let i=1;i<=5;i++){const e=document.createElement("button");e.type="button",e.className="c-star"+(i<=se?" filled":""),e.textContent="★",e.title=`${i} 分`,e.addEventListener("click",t=>{t.stopPropagation(),se=se===i?0:i,at()}),Lt.appendChild(e)}}function F(){ti(),hn(),at()}function ti(){oe?(ue.textContent=`對應秒數 ${rt(Qe)}`,ue.classList.remove("off")):(ue.textContent="整體留言（不對應秒數）",ue.classList.add("off")),ue.classList.toggle("focused",I==="toggle")}function hn(){cn(Zt,ae,e=>{st(ae,e),hn()},typeof I=="number"?I:void 0)}function Nt(){const i=fe.value.trim();if(dn(),!i)return;const e=$e();e&&(R.push({id:en(),file:e,time:oe?Qe:null,text:i,author:te,character:[...ae],replies:[],rating:se}),Z())}function _t(){I="toggle",fe.blur(),F()}function Ot(){I="text",F(),fe.focus()}function ni(){if(T.length===0)return;const i=ae.length?T.findIndex(e=>e.name===ae[0]):-1;I=i>=0?i:0,fe.blur(),F()}function ii(i){st(ae,T[i].name),F()}function ke(i,e){const t=Array.from(Zt.children);if(t.length===0)return i;const n=t.map(h=>h.getBoundingClientRect()),r=n[i],s=r.left+r.width/2,o=r.top+r.height/2,l=r.height/2;if(e==="left"||e==="right"){let h=-1,d=1/0;return n.forEach((u,m)=>{if(m===i||Math.abs(u.top+u.height/2-o)>l)return;const p=u.left+u.width/2;e==="left"&&p<s&&s-p<d&&(d=s-p,h=m),e==="right"&&p>s&&p-s<d&&(d=p-s,h=m)}),h>=0?h:i}let a=-1,c=1/0;return n.forEach((h,d)=>{if(d===i)return;const u=h.top+h.height/2;if(!(e==="up"?u<o-l:u>o+l))return;const p=Math.abs(u-o)*1e3+Math.abs(h.left+h.width/2-s);p<c&&(c=p,a=d)}),e==="up"&&a<0?"toggle":a>=0?a:i}function ri(i){if(i.isComposing)return;if(i.shiftKey&&/^Digit[0-5]$/.test(i.code)){i.preventDefault();const t=parseInt(i.code[5]);se=se===t?0:t,at();return}if(i.code==="Escape"){i.preventDefault(),dn();return}if(I==="text"){if(Ke(i)&&!i.shiftKey){i.preventDefault(),Nt();return}if(i.code==="ArrowDown"||i.code==="Tab"){i.preventDefault(),_t();return}return}if(Ke(i)){i.preventDefault(),Nt();return}if(I==="toggle"){switch(i.code){case"Space":i.preventDefault(),oe=!oe,F();break;case"ArrowUp":i.preventDefault(),Ot();break;case"ArrowDown":case"Tab":i.preventDefault(),ni();break}return}const e=I;switch(i.code){case"Space":i.preventDefault(),ii(e);break;case"ArrowRight":{i.preventDefault();const t=ke(e,"right");typeof t=="number"&&(I=t,F());break}case"ArrowLeft":{i.preventDefault();const t=ke(e,"left");typeof t=="number"&&(I=t,F());break}case"ArrowDown":{i.preventDefault();const t=ke(e,"down");typeof t=="number"&&(I=t,F());break}case"ArrowUp":{i.preventDefault();const t=ke(e,"up");t==="toggle"?_t():(I=t,F());break}case"Tab":i.preventDefault(),Ot();break}}ue.addEventListener("click",()=>{oe=!oe,F()});function Ue(i){Ie=i,Ae.value=te,He.classList.remove("hidden"),Ae.focus()}function si(){const i=Ae.value.trim();if(!i)return;te=i,Pn(i),He.classList.add("hidden");const e=Ie;Ie=null,e&&e()}Ae.addEventListener("keydown",i=>{i.stopPropagation(),!i.isComposing&&(i.key==="Enter"?(i.preventDefault(),si()):i.key==="Escape"&&(i.preventDefault(),He.classList.add("hidden"),Ie=null))});Ct.addEventListener("click",()=>{Ct.blur(),ve(),nt.classList.remove("hidden")});function ve(){St.innerHTML="",T.forEach((i,e)=>{const t=document.createElement("li"),n=document.createElement("span");n.className="dot",n.style.background=Y[i.role];const r=document.createElement("span");r.textContent=i.name,r.title="雙擊重命名",r.style.cursor="pointer",r.addEventListener("dblclick",()=>{const l=document.createElement("input");l.type="text",l.value=i.name,l.style.cssText="font-size:13px;width:120px;padding:2px 6px",t.replaceChild(l,r),l.focus(),l.select();const a=()=>{const c=l.value.trim();if(c&&c!==i.name){const h=i.name;i.name=c,R.forEach(d=>{const u=d.character.indexOf(h);u>=0&&(d.character[u]=c)}),_e(T),nn()}ve()};l.addEventListener("keydown",c=>{c.stopPropagation(),c.key==="Enter"?(c.preventDefault(),a()):c.key==="Escape"&&(c.preventDefault(),ve())}),l.addEventListener("blur",a)});const s=document.createElement("span");s.className="role",s.textContent=Xt[i.role];const o=document.createElement("button");o.className="rm",o.textContent="刪除",o.addEventListener("click",()=>{T.splice(e,1),_e(T),ve()}),t.append(n,r,s,o),St.appendChild(t)})}Qt.addEventListener("click",()=>{const i=Xe.value.trim();i&&(T.push({name:i,role:Hn.value}),_e(T),Xe.value="",ve())});Xe.addEventListener("keydown",i=>{i.stopPropagation(),!i.isComposing&&i.key==="Enter"&&(i.preventDefault(),Qt.click())});$n.addEventListener("click",()=>{nt.classList.add("hidden"),je(),ce(),H==="role"&&le()});function It(i){const e=P.getDuration();!isFinite(e)||e===0||P.setTime(Math.min(Math.max(0,P.getCurrentTime()+i),e))}function zt(i){const e=ot($e()).filter(r=>r.time!==null).map(r=>r.time);if(e.length===0)return;const t=P.getCurrentTime();let n;if(i<0){for(let r=e.length-1;r>=0;r--)if(e[r]<t-_n){n=e[r];break}n??(n=e[0])}else{for(let r=0;r<e.length;r++)if(e[r]>t+On){n=e[r];break}n??(n=e[e.length-1])}P.setTime(n)}function G(i){H=i;const e=i==="single",t=i==="grid",n=i==="role";(t||n)&&P.pause(),zn.classList.toggle("hidden",!e),An.classList.toggle("hidden",!e),Te.classList.toggle("hidden",!t),$.classList.toggle("hidden",!n),Bn.classList.toggle("hidden",n),t&&un(),n&&(W=0,le()),ce()}function un(){Te.innerHTML="";const i=document.createElement("div");i.className="gridhint",i.textContent="WASD／方向鍵 移動 · 空白鍵或 Enter 開啟 · Tab 返回單檔",Te.appendChild(i),N.forEach((e,t)=>{const n=document.createElement("div");n.className="gridcard"+(t===j?" selected":""),n.innerHTML=`<div class="gc-name">${pe(e.name)}</div><div class="gc-meta">${tn(e.name)} 則留言</div>`,n.addEventListener("click",()=>{j=t,G("single"),ne(t)}),Te.appendChild(n)})}function Le(i){const e=N.length;e!==0&&(j=Math.min(Math.max(0,j+i),e-1),un(),ce())}function oi(){const i=document.activeElement;return i?i.tagName==="INPUT"||i.tagName==="TEXTAREA"||i.isContentEditable:!1}function ai(){return!He.classList.contains("hidden")||!nt.classList.contains("hidden")}document.addEventListener("keydown",i=>{if(!tt.classList.contains("hidden")){ri(i);return}if(!i.isComposing){if(me!==null&&i.code==="Escape"){i.preventDefault(),me=null,Q();return}if(J!==null&&i.code==="Escape"){i.preventDefault(),J=null,Q();return}if(!(ai()||oi())){if(H==="role"){if(i.shiftKey&&/^Digit[0-5]$/.test(i.code)){i.preventDefault();const e=parseInt(i.code[5]),t=B[W];t&&(t.rating=t.rating===e?0:e,Z());return}if(i.code==="Tab"||i.code==="Escape"){i.preventDefault(),G("single");return}switch(i.code){case"ArrowUp":case"KeyW":i.preventDefault(),Rt(-1);break;case"ArrowDown":case"KeyS":i.preventDefault(),Rt(1);break;case"Space":i.preventDefault(),B[W]&&ln(B[W],W);break;case"Enter":case"NumpadEnter":i.preventDefault(),B[W]&&Ge(B[W]);break}return}if(H==="grid"){if(Ke(i)){i.preventDefault(),G("single"),ne(j);return}switch(i.code){case"KeyA":case"ArrowLeft":i.preventDefault(),Le(-1);break;case"KeyD":case"ArrowRight":i.preventDefault(),Le(1);break;case"KeyW":case"ArrowUp":i.preventDefault(),Le(-vt);break;case"KeyS":case"ArrowDown":i.preventDefault(),Le(vt);break;case"Space":i.preventDefault(),G("single"),ne(j);break;case"Tab":i.preventDefault(),G("single");break}return}switch(i.code){case"Space":i.preventDefault(),P.playPause();break;case"KeyA":case"ArrowLeft":i.preventDefault(),It(-5);break;case"KeyD":case"ArrowRight":i.preventDefault(),It(5);break;case"KeyW":case"ArrowUp":i.preventDefault(),zt(-1);break;case"KeyS":case"ArrowDown":i.preventDefault(),zt(1);break;case"KeyC":case"KeyX":i.preventDefault(),ei();break;case"Tab":i.preventDefault(),N.length&&G("grid");break}}}});function li(){let i="";const e=(s,o)=>o.rating-s.rating||s.file.localeCompare(o.file,"zh-Hant",{numeric:!0})||(s.time??-1/0)-(o.time??-1/0),t=(s,o,l)=>{if(l.length===0)return;const a=l.map(c=>{const h=c.rating>0?"★".repeat(c.rating)+"☆".repeat(5-c.rating):"",d=c.time!==null?rt(c.time):"整體";return`<tr>
        <td class="tc">${pe(d)}</td>
        <td class="fn">${pe(c.file)}</td>
        <td class="cm">${pe(c.text)}</td>
        <td class="sr">${h}</td>
        <td class="au">${pe(c.author)}</td>
      </tr>`}).join("");i+=`<div class="section">
  <div class="slabel" style="background:${o}">${pe(s==="__none__"?"未指定":s)}</div>
  <table><thead><tr>
    <th class="tc">時間</th><th class="fn">音檔</th><th class="cm">評語</th><th class="sr">評分</th><th class="au">留言者</th>
  </tr></thead><tbody>${a}</tbody></table>
</div>`};T.forEach(s=>t(s.name,Y[s.role],R.filter(o=>o.character.includes(s.name)).sort(e))),t("__none__","#64748b",R.filter(s=>s.character.length===0).sort(e));const n=`<!DOCTYPE html>
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
<div class="sub">產出時間：${new Date().toLocaleString("zh-Hant")} · 共 ${R.length} 則留言</div>
${i||'<p style="color:#9ca3af">尚無留言</p>'}
</body></html>`,r=window.open("","_blank","width=900,height=800");if(!r){alert("請允許開啟新分頁（檢查彈出視窗封鎖設定）");return}r.document.write(n),r.document.close(),setTimeout(()=>r.print(),600)}Pt.addEventListener("click",()=>{Pt.blur(),li()});const ci=1e4;function di(i){const e=new Set(R.map(n=>n.id)),t=i.map(We).filter(n=>!e.has(n.id));return t.length===0?0:(R=[...R,...t],t.length)}function hi(){At(),De=window.setInterval(async()=>{if(!V){At();return}try{const e=await(await V.getFileHandle(Ze)).getFile(),t=JSON.parse(await e.text());if(!Array.isArray(t==null?void 0:t.comments))return;const n=di(t.comments);Oe=Date.now(),pn(),n>0&&(Ye(R),je(),Fe(),ce(),H==="role"&&le(),ui(`已同步 ${n} 則新留言`))}catch{}},ci)}function At(){De!==void 0&&(window.clearInterval(De),De=void 0)}function pn(){const i=document.getElementById("syncStatus");if(!i)return;if(!V){i.textContent="";return}const e=Oe?new Date(Oe).toLocaleTimeString("zh-Hant",{hour:"2-digit",minute:"2-digit",second:"2-digit"}):"—";i.textContent=`↺ 協作同步中 · ${e}`}let Bt;function ui(i){const e=document.getElementById("syncToast");e&&(e.textContent=i,e.classList.remove("hidden"),window.clearTimeout(Bt),Bt=window.setTimeout(()=>e.classList.add("hidden"),3e3))}function pi(){const i=a=>JSON.stringify(a).replace(/</g,"\\u003c").replace(/>/g,"\\u003e").replace(/&/g,"\\u0026"),e=Tn.replace("{{DATA_JSON}}",()=>i({comments:R,characters:T,roleColors:Y})),t=new Blob([e],{type:"text/html;charset=utf-8"}),n=URL.createObjectURL(t),r=new Date,s=a=>String(a).padStart(2,"0"),o=`${r.getFullYear()}${s(r.getMonth()+1)}${s(r.getDate())}-${s(r.getHours())}${s(r.getMinutes())}`,l=document.createElement("a");l.href=n,l.download=`voicepicker-share-${o}.html`,l.click(),URL.revokeObjectURL(n)}Dt.addEventListener("click",()=>{Dt.blur(),it.classList.remove("hidden")});Fn.addEventListener("click",()=>it.classList.add("hidden"));jn.addEventListener("click",()=>{it.classList.add("hidden"),pi()});wt.addEventListener("click",()=>{wt.blur(),G("role")});In.textContent="v0.9.1";te||Ue(null);
