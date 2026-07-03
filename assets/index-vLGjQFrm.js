(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(r){if(r.ep)return;r.ep=!0;const o=t(r);fetch(r.href,o)}})();function I(i,e,t,n){return new(t||(t=Promise))(function(r,o){function a(c){try{l(n.next(c))}catch(u){o(u)}}function s(c){try{l(n.throw(c))}catch(u){o(u)}}function l(c){var u;c.done?r(c.value):(u=c.value,u instanceof t?u:new t(function(d){d(u)})).then(a,s)}l((n=n.apply(i,e||[])).next())})}let Ee=class{constructor(){this.listeners={}}on(e,t,n){if(this.listeners[e]||(this.listeners[e]=new Set),n==null?void 0:n.once){const r=(...o)=>{this.un(e,r),t(...o)};return this.listeners[e].add(r),()=>this.un(e,r)}return this.listeners[e].add(t),()=>this.un(e,t)}un(e,t){var n;(n=this.listeners[e])===null||n===void 0||n.delete(t)}once(e,t){return this.on(e,t,{once:!0})}unAll(){this.listeners={}}emit(e,...t){this.listeners[e]&&this.listeners[e].forEach(n=>n(...t))}};const Ce={decode:function(i,e){return I(this,void 0,void 0,function*(){const t=new AudioContext({sampleRate:e});try{return yield t.decodeAudioData(i)}finally{t.close()}})},createBuffer:function(i,e){if(!i||i.length===0)throw new Error("channelData must be a non-empty array");if(e<=0)throw new Error("duration must be greater than 0");if(typeof i[0]=="number"&&(i=[i]),!i[0]||i[0].length===0)throw new Error("channelData must contain non-empty channel arrays");(function(n){const r=n[0];if(r.some(o=>o>1||o<-1)){const o=r.length;let a=0;for(let s=0;s<o;s++){const l=Math.abs(r[s]);l>a&&(a=l)}for(const s of n)for(let l=0;l<o;l++)s[l]/=a}})(i);const t=i.map(n=>n instanceof Float32Array?n:Float32Array.from(n));return{duration:e,length:t[0].length,sampleRate:t[0].length/e,numberOfChannels:t.length,getChannelData:n=>{const r=t[n];if(!r)throw new Error(`Channel ${n} not found`);return r},copyFromChannel:AudioBuffer.prototype.copyFromChannel,copyToChannel:AudioBuffer.prototype.copyToChannel}}};function Ht(i,e){const t=e.xmlns?document.createElementNS(e.xmlns,i):document.createElement(i);for(const[n,r]of Object.entries(e))if(n==="children"&&r)for(const[o,a]of Object.entries(r))a instanceof Node?t.appendChild(a):typeof a=="string"?t.appendChild(document.createTextNode(a)):t.appendChild(Ht(o,a));else n==="style"?Object.assign(t.style,r):n==="textContent"?t.textContent=r:t.setAttribute(n,r.toString());return t}function ht(i,e,t){const n=Ht(i,e||{});return t==null||t.appendChild(n),n}function Ft(i){return i instanceof HTMLElement||typeof i=="object"&&i!==null&&i.nodeType===Node.ELEMENT_NODE&&typeof i.style=="object"}var vn=Object.freeze({__proto__:null,createElement:ht,default:ht,isHTMLElement:Ft});const bn={fetchBlob:function(i,e,t){return I(this,void 0,void 0,function*(){var n;const r=yield fetch(i,t);if(r.status>=400)throw new Error(`Failed to fetch ${i}: ${r.status} (${r.statusText})`);return function(o,a,s){I(this,void 0,void 0,function*(){var l;if(!o.body||!o.headers)return;const c=o.body.getReader(),u=Number(o.headers.get("Content-Length"))||0;let d=0;const h=()=>{c.cancel()};if(s){if(s.aborted)return void c.cancel();s.addEventListener("abort",h,{once:!0})}try{for(;;){const m=yield c.read();if(m.done)break;if(d+=((l=m.value)===null||l===void 0?void 0:l.length)||0,u>0){const p=Math.round(d/u*100);a(p)}}}catch(m){if(m instanceof DOMException&&m.name==="AbortError")return;console.warn("Progress tracking error:",m)}finally{s&&s.removeEventListener("abort",h)}})}(r.clone(),e,(n=t==null?void 0:t.signal)!==null&&n!==void 0?n:void 0),r.blob()})}};function M(i){let e=i;const t=new Set;return{get value(){return e},set(n){Object.is(e,n)||(e=n,t.forEach(r=>r(e)))},update(n){this.set(n(e))},subscribe:n=>(t.add(n),()=>t.delete(n))}}function re(i,e){const t=M(i());return e.forEach(n=>n.subscribe(()=>{const r=i();Object.is(t.value,r)||t.set(r)})),{get value(){return t.value},subscribe:n=>t.subscribe(n)}}function K(i,e){let t;const n=()=>{t&&(t(),t=void 0),t=i()},r=e.map(o=>o.subscribe(n));return n(),()=>{t&&(t(),t=void 0),r.forEach(o=>o())}}class yn extends Ee{get isPlayingSignal(){return this._isPlaying}get currentTimeSignal(){return this._currentTime}get durationSignal(){return this._duration}get volumeSignal(){return this._volume}get mutedSignal(){return this._muted}get playbackRateSignal(){return this._playbackRate}get seekingSignal(){return this._seeking}constructor(e){super(),this.isExternalMedia=!1,this._ownBlobUrl=null,this.reactiveMediaEventCleanups=[],e.media?(this.media=e.media,this.isExternalMedia=!0):this.media=document.createElement("audio"),this._isPlaying=M(!1),this._currentTime=M(0),this._duration=M(0),this._volume=M(this.media.volume),this._muted=M(this.media.muted),this._playbackRate=M(this.media.playbackRate||1),this._seeking=M(!1),this.setupReactiveMediaEvents(),e.mediaControls&&(this.media.controls=!0),e.autoplay&&(this.media.autoplay=!0),e.playbackRate!=null&&this.onMediaEvent("canplay",()=>{e.playbackRate!=null&&(this.media.playbackRate=e.playbackRate)},{once:!0})}setupReactiveMediaEvents(){this.reactiveMediaEventCleanups.push(this.onMediaEvent("play",()=>{this._isPlaying.set(!0)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("pause",()=>{this._isPlaying.set(!1)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("ended",()=>{this._isPlaying.set(!1)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("timeupdate",()=>{this._currentTime.set(this.media.currentTime)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("durationchange",()=>{this._duration.set(this.media.duration||0)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("loadedmetadata",()=>{this._duration.set(this.media.duration||0)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("seeking",()=>{this._seeking.set(!0)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("seeked",()=>{this._seeking.set(!1)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("volumechange",()=>{this._volume.set(this.media.volume),this._muted.set(this.media.muted)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("ratechange",()=>{this._playbackRate.set(this.media.playbackRate)}))}onMediaEvent(e,t,n){return this.media.addEventListener(e,t,n),()=>this.media.removeEventListener(e,t,n)}getSrc(){return this.media.currentSrc||this.media.src||""}revokeSrc(){this._ownBlobUrl&&(URL.revokeObjectURL(this._ownBlobUrl),this._ownBlobUrl=null)}canPlayType(e){return this.media.canPlayType(e)!==""}setSrc(e,t){const n=this.getSrc();if(e&&n===e)return;this.revokeSrc();const r=t instanceof Blob&&(this.canPlayType(t.type)||!e)?URL.createObjectURL(t):e;if(r!==e&&(this._ownBlobUrl=r),n&&this.media.removeAttribute("src"),r||e)try{this.media.src=r}catch{this.media.src=e}}destroy(){this.reactiveMediaEventCleanups.forEach(e=>e()),this.reactiveMediaEventCleanups=[],this.revokeSrc(),this.unAll(),this.isExternalMedia||(this.media.pause(),this.media.removeAttribute("src"),this.media.load(),this.media.remove())}setMediaElement(e){this.reactiveMediaEventCleanups.forEach(t=>t()),this.reactiveMediaEventCleanups=[],this.media=e,this.setupReactiveMediaEvents()}play(){return I(this,void 0,void 0,function*(){try{return yield this.media.play()}catch(e){if(e instanceof DOMException&&e.name==="AbortError")return;throw e}})}pause(){this.media.pause()}isPlaying(){return!this.media.paused&&!this.media.ended}setTime(e){this.media.currentTime=Math.max(0,Math.min(e,this.getDuration()))}getDuration(){return this.media.duration}getCurrentTime(){return this.media.currentTime}getVolume(){return this.media.volume}setVolume(e){this.media.volume=e}getMuted(){return this.media.muted}setMuted(e){this.media.muted=e}getPlaybackRate(){return this.media.playbackRate}isSeeking(){return this.media.seeking}setPlaybackRate(e,t){t!=null&&(this.media.preservesPitch=t),this.media.playbackRate=e}getMediaElement(){return this.media}setSinkId(e){return this.media.setSinkId(e)}}function En({maxTop:i,maxBottom:e,halfHeight:t,vScale:n,barMinHeight:r=0,barAlign:o}){let a=Math.round(i*t*n),s=a+Math.round(e*t*n)||1;return s<r&&(s=r,o||(a=s/2)),{topHeight:a,totalHeight:s}}function xn({barAlign:i,halfHeight:e,topHeight:t,totalHeight:n,canvasHeight:r}){return i==="top"?0:i==="bottom"?r-n:e-t}function pt(i,e,t){const n=e-i.left,r=t-i.top;return[n/i.width,r/i.height]}function $t(i){return!!(i.barWidth||i.barGap||i.barAlign)}function mt(i,e){if(!$t(e))return i;const t=e.barWidth||.5,n=t+(e.barGap||t/2);return n===0?i:Math.floor(i/n)*n}function ft({scrollLeft:i,totalWidth:e,numCanvases:t}){if(e===0)return[0];const n=i/e,r=Math.floor(n*t);return[r-1,r,r+1]}function Ut(i){const e=i._cleanup;typeof e=="function"&&e()}function wn(i){const e=M({scrollLeft:i.scrollLeft,scrollWidth:i.scrollWidth,clientWidth:i.clientWidth}),t=re(()=>function(o){const{scrollLeft:a,scrollWidth:s,clientWidth:l}=o;if(s===0)return{startX:0,endX:1};const c=a/s,u=(a+l)/s;return{startX:Math.max(0,Math.min(1,c)),endX:Math.max(0,Math.min(1,u))}}(e.value),[e]),n=re(()=>function(o){return{left:o.scrollLeft,right:o.scrollLeft+o.clientWidth}}(e.value),[e]),r=()=>{e.set({scrollLeft:i.scrollLeft,scrollWidth:i.scrollWidth,clientWidth:i.clientWidth})};return i.addEventListener("scroll",r,{passive:!0}),{scrollData:e,percentages:t,bounds:n,cleanup:()=>{i.removeEventListener("scroll",r),Ut(e)}}}class Cn extends Ee{constructor(e,t){super(),this.timeouts=[],this.isScrollable=!1,this.audioData=null,this.resizeObserver=null,this.lastContainerWidth=0,this.isDragging=!1,this.subscriptions=[],this.unsubscribeOnScroll=[],this.dragStream=null,this.scrollStream=null,this.containerInlinePadding=0,this.onClickWrapper=a=>{const s=this.wrapper.getBoundingClientRect(),[l,c]=pt(s,a.clientX,a.clientY);this.emit("click",l,c)},this.onDblClickWrapper=a=>{const s=this.wrapper.getBoundingClientRect(),[l,c]=pt(s,a.clientX,a.clientY);this.emit("dblclick",l,c)},this.subscriptions=[],this.options=e;const n=this.parentFromOptionsContainer(e.container);this.parent=n;const[r,o]=this.initHtml();n.appendChild(r),this.container=r,this.scrollContainer=o.querySelector(".scroll"),this.wrapper=o.querySelector(".wrapper"),this.canvasWrapper=o.querySelector(".canvases"),this.progressWrapper=o.querySelector(".progress"),this.cursor=o.querySelector(".cursor"),this.calculateInlinePadding(),t&&o.appendChild(t),this.initEvents()}parentFromOptionsContainer(e){let t;if(typeof e=="string"?t=document.querySelector(e):Ft(e)&&(t=e),!t)throw new Error("Container not found");return t}initEvents(){this.wrapper.addEventListener("click",this.onClickWrapper),this.wrapper.addEventListener("dblclick",this.onDblClickWrapper),this.options.dragToSeek!==!0&&typeof this.options.dragToSeek!="object"||this.initDrag(),this.scrollStream=wn(this.scrollContainer);const e=K(()=>{const{startX:t,endX:n}=this.scrollStream.percentages.value,{left:r,right:o}=this.scrollStream.bounds.value;this.emit("scroll",t,n,r,o)},[this.scrollStream.percentages,this.scrollStream.bounds]);if(this.subscriptions.push(e),typeof ResizeObserver=="function"){const t=this.createDelay(100);this.resizeObserver=new ResizeObserver(()=>{t().then(()=>this.onContainerResize()).catch(()=>{})}),this.resizeObserver.observe(this.scrollContainer)}}onContainerResize(){const e=this.parent.clientWidth;this.calculateInlinePadding(),e===this.lastContainerWidth&&this.options.height!=="auto"||(this.lastContainerWidth=e,this.reRender(),this.emit("resize"))}initDrag(){if(this.dragStream)return;this.dragStream=function(t,n={}){const{threshold:r=3,mouseButton:o=0,touchDelay:a=100}=n,s=M(null),l=new Map,c=matchMedia("(pointer: coarse)").matches;let u=()=>{};const d=h=>{if(h.button!==o||l.has(h.pointerId)||(l.set(h.pointerId,h),l.size>1))return;const m=h.pointerId;let p=h.clientX,f=h.clientY,g=!1;const v=Date.now(),w=t.getBoundingClientRect(),{left:S,top:L}=w,C=y=>{if(y.pointerId!==m||y.defaultPrevented||l.size>1||c&&Date.now()-v<a)return;const A=y.clientX,O=y.clientY,q=A-p,k=O-f;(g||Math.abs(q)>r||Math.abs(k)>r)&&(y.preventDefault(),y.stopPropagation(),g||(s.set({type:"start",x:p-S,y:f-L}),g=!0),s.set({type:"move",x:A-S,y:O-L,deltaX:q,deltaY:k}),p=A,f=O)},x=y=>{if(l.delete(y.pointerId)){if(y.pointerId===m&&g){const A=y.clientX,O=y.clientY;s.set({type:"end",x:A-S,y:O-L})}l.size===0&&u()}},P=y=>{y.relatedTarget&&y.relatedTarget!==document.documentElement||x(y)},b=y=>{g&&(y.stopPropagation(),y.preventDefault())},z=y=>{y.defaultPrevented||l.size>1||g&&y.preventDefault()};document.addEventListener("pointermove",C),document.addEventListener("pointerup",x),document.addEventListener("pointerout",P),document.addEventListener("pointercancel",P),document.addEventListener("touchmove",z,{passive:!1}),document.addEventListener("click",b,{capture:!0}),u=()=>{document.removeEventListener("pointermove",C),document.removeEventListener("pointerup",x),document.removeEventListener("pointerout",P),document.removeEventListener("pointercancel",P),document.removeEventListener("touchmove",z),setTimeout(()=>{document.removeEventListener("click",b,{capture:!0})},10)}};return t.addEventListener("pointerdown",d),{signal:s,cleanup:()=>{u(),t.removeEventListener("pointerdown",d),l.clear(),Ut(s)}}}(this.wrapper);const e=K(()=>{const t=this.dragStream.signal.value;if(!t)return;const n=this.wrapper.getBoundingClientRect().width,r=(o=t.x/n)<0?0:o>1?1:o;var o;t.type==="start"?(this.isDragging=!0,this.emit("dragstart",r)):t.type==="move"?this.emit("drag",r):t.type==="end"&&(this.isDragging=!1,this.emit("dragend",r))},[this.dragStream.signal]);this.subscriptions.push(e)}calculateInlinePadding(){const{paddingLeft:e,paddingRight:t}=getComputedStyle(this.scrollContainer),n=parseFloat(e)+parseFloat(t);this.containerInlinePadding=Number.isNaN(n)?0:n}initHtml(){const e=document.createElement("div"),t=e.attachShadow({mode:"open"}),n=this.options.cspNonce&&typeof this.options.cspNonce=="string"?this.options.cspNonce.replace(/"/g,""):"";return t.innerHTML=`
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
    `,[e,t]}setOptions(e){var t;if(this.options.container!==e.container){const n=this.parentFromOptionsContainer(e.container);n.appendChild(this.container),this.parent=n}e.dragToSeek===!0||typeof this.options.dragToSeek=="object"?this.initDrag():((t=this.dragStream)===null||t===void 0||t.cleanup(),this.dragStream=null),this.options=e,this.reRender()}getWrapper(){return this.wrapper}getWidth(){return this.scrollContainer.clientWidth-this.containerInlinePadding}getScroll(){return this.scrollContainer.scrollLeft}setScroll(e){this.scrollContainer.scrollLeft=e}setScrollPercentage(e){const{scrollWidth:t}=this.scrollContainer,n=t*e;this.setScroll(n)}destroy(){var e;this.wrapper.removeEventListener("click",this.onClickWrapper),this.wrapper.removeEventListener("dblclick",this.onDblClickWrapper),this.timeouts.forEach(t=>t()),this.timeouts=[],this.subscriptions.forEach(t=>t()),this.container.remove(),this.resizeObserver&&(this.resizeObserver.disconnect(),this.resizeObserver=null),(e=this.unsubscribeOnScroll)===null||e===void 0||e.forEach(t=>t()),this.unsubscribeOnScroll=[],this.dragStream&&(this.dragStream.cleanup(),this.dragStream=null),this.scrollStream&&(this.scrollStream.cleanup(),this.scrollStream=null)}createDelay(e=10){let t,n;const r=()=>{t&&(clearTimeout(t),t=void 0),n&&(n(),n=void 0)};return this.timeouts.push(r),()=>new Promise((o,a)=>{r(),n=a,t=setTimeout(()=>{t=void 0,n=void 0,o()},e)})}getHeight(e,t){var n;const r=((n=this.audioData)===null||n===void 0?void 0:n.numberOfChannels)||1;return function({optionsHeight:o,optionsSplitChannels:a,parentHeight:s,numberOfChannels:l,defaultHeight:c=128}){if(o==null)return c;const u=Number(o);if(!isNaN(u))return u;if(o==="auto"){const d=s||c;return a!=null&&a.every(h=>!h.overlay)?d/l:d}return c}({optionsHeight:e,optionsSplitChannels:t,parentHeight:this.parent.clientHeight,numberOfChannels:r,defaultHeight:128})}convertColorValues(e,t){return function(n,r,o){if(!Array.isArray(n))return n||"";if(n.length===0)return"#999";if(n.length<2)return n[0]||"";const a=document.createElement("canvas"),s=a.getContext("2d");if(!s)return n[0]||"";const l=o||a.height*r,c=s.createLinearGradient(0,0,0,l),u=1/(n.length-1);return n.forEach((d,h)=>{c.addColorStop(h*u,d)}),c}(e,this.getPixelRatio(),t==null?void 0:t.canvas.height)}getPixelRatio(){return e=window.devicePixelRatio,Math.max(1,e||1);var e}renderBarWaveform(e,t,n,r){const{width:o,height:a}=n.canvas,{halfHeight:s,barWidth:l,barRadius:c,barIndexScale:u,barSpacing:d,barMinHeight:h}=function({width:p,height:f,length:g,options:v,pixelRatio:w}){const S=f/2,L=v.barWidth?v.barWidth*w:1,C=v.barGap?v.barGap*w:v.barWidth?L/2:0,x=L+C||1;return{halfHeight:S,barWidth:L,barGap:C,barRadius:v.barRadius||0,barMinHeight:v.barMinHeight?v.barMinHeight*w:0,barIndexScale:g>0?p/x/g:0,barSpacing:x}}({width:o,height:a,length:(e[0]||[]).length,options:t,pixelRatio:this.getPixelRatio()}),m=function({channelData:p,barIndexScale:f,barSpacing:g,barWidth:v,halfHeight:w,vScale:S,canvasHeight:L,barAlign:C,barMinHeight:x}){const P=p[0]||[],b=p[1]||P,z=P.length,y=[];let A=0,O=0,q=0;for(let k=0;k<=z;k++){const ee=Math.round(k*f);if(ee>A){const{topHeight:fn,totalHeight:ut}=En({maxTop:O,maxBottom:q,halfHeight:w,vScale:S,barMinHeight:x,barAlign:C}),gn=xn({barAlign:C,halfHeight:w,topHeight:fn,totalHeight:ut,canvasHeight:L});y.push({x:A*g,y:gn,width:v,height:ut}),A=ee,O=0,q=0}const ct=Math.abs(P[k]||0),dt=Math.abs(b[k]||0);ct>O&&(O=ct),dt>q&&(q=dt)}return y}({channelData:e,barIndexScale:u,barSpacing:d,barWidth:l,halfHeight:s,vScale:r,canvasHeight:a,barAlign:t.barAlign,barMinHeight:h});n.beginPath();for(const p of m)c&&"roundRect"in n?n.roundRect(p.x,p.y,p.width,p.height,c):n.rect(p.x,p.y,p.width,p.height);n.fill(),n.closePath()}renderLineWaveform(e,t,n,r){const{width:o,height:a}=n.canvas,s=function({channelData:l,width:c,height:u,vScale:d}){const h=u/2,m=l[0]||[];return[m,l[1]||m].map((p,f)=>{const g=p.length,v=g?c/g:0,w=h,S=f===0?-1:1,L=[{x:0,y:w}];let C=0,x=0;for(let P=0;P<=g;P++){const b=Math.round(P*v);if(b>C){const y=w+(Math.round(x*h*d)||1)*S;L.push({x:C,y}),C=b,x=0}const z=Math.abs(p[P]||0);z>x&&(x=z)}return L.push({x:C,y:w}),L})}({channelData:e,width:o,height:a,vScale:r});n.beginPath();for(const l of s)if(l.length){n.moveTo(l[0].x,l[0].y);for(let c=1;c<l.length;c++){const u=l[c];n.lineTo(u.x,u.y)}}n.fill(),n.closePath()}renderWaveform(e,t,n){if(n.fillStyle=this.convertColorValues(t.waveColor,n),t.renderFunction)return void t.renderFunction(e,n);const r=function({channelData:o,barHeight:a,normalize:s,maxPeak:l}){var c;const u=a||1;if(!s)return u;const d=o[0];if(!d||d.length===0)return u;let h=l??0;if(!l)for(let m=0;m<d.length;m++){const p=(c=d[m])!==null&&c!==void 0?c:0,f=Math.abs(p);f>h&&(h=f)}return h?u/h:u}({channelData:e,barHeight:t.barHeight,normalize:t.normalize,maxPeak:t.maxPeak});$t(t)?this.renderBarWaveform(e,t,n,r):this.renderLineWaveform(e,t,n,r)}renderSingleCanvas(e,t,n,r,o,a,s){const l=this.getPixelRatio(),c=document.createElement("canvas");c.width=Math.round(n*l),c.height=Math.round(r*l),c.style.width=`${n}px`,c.style.height=`${r}px`,c.style.left=`${Math.round(o)}px`,a.appendChild(c);const u=c.getContext("2d");if(t.renderFunction?(u.fillStyle=this.convertColorValues(t.waveColor,u),t.renderFunction(e,u)):this.renderWaveform(e,t,u),c.width>0&&c.height>0){const d=c.cloneNode(),h=d.getContext("2d");h.drawImage(c,0,0),h.globalCompositeOperation="source-in",h.fillStyle=this.convertColorValues(t.progressColor,h),h.fillRect(0,0,c.width,c.height),s.appendChild(d)}}renderMultiCanvas(e,t,n,r,o,a){const s=this.getPixelRatio(),{clientWidth:l}=this.scrollContainer,c=n/s,u=function({clientWidth:p,totalWidth:f,options:g}){return mt(Math.min(8e3,p,f),g)}({clientWidth:l,totalWidth:c,options:t});let d={};if(u===0)return;const h=p=>{if(p<0||p>=m||d[p])return;d[p]=!0;const f=p*u;let g=Math.min(c-f,u);if(g=mt(g,t),g<=0)return;const v=function({channelData:w,offset:S,clampedWidth:L,totalWidth:C}){return w.map(x=>{const P=Math.floor(S/C*x.length),b=Math.floor((S+L)/C*x.length);return x.slice(P,b)})}({channelData:e,offset:f,clampedWidth:g,totalWidth:c});this.renderSingleCanvas(v,t,g,r,f,o,a)},m=Math.ceil(c/u);if(!this.isScrollable){for(let p=0;p<m;p++)h(p);return}if(ft({scrollLeft:this.scrollContainer.scrollLeft,totalWidth:c,numCanvases:m}).forEach(p=>h(p)),m>1){const p=this.on("scroll",()=>{const{scrollLeft:f}=this.scrollContainer;Object.keys(d).length>10&&(o.innerHTML="",a.innerHTML="",d={}),ft({scrollLeft:f,totalWidth:c,numCanvases:m}).forEach(g=>h(g))});this.unsubscribeOnScroll.push(p)}}renderChannel(e,t,n,r){var{overlay:o}=t,a=function(u,d){var h={};for(var m in u)Object.prototype.hasOwnProperty.call(u,m)&&d.indexOf(m)<0&&(h[m]=u[m]);if(u!=null&&typeof Object.getOwnPropertySymbols=="function"){var p=0;for(m=Object.getOwnPropertySymbols(u);p<m.length;p++)d.indexOf(m[p])<0&&Object.prototype.propertyIsEnumerable.call(u,m[p])&&(h[m[p]]=u[m[p]])}return h}(t,["overlay"]);const s=document.createElement("div"),l=this.getHeight(a.height,a.splitChannels);s.style.height=`${l}px`,o&&r>0&&(s.style.marginTop=`-${l}px`),this.canvasWrapper.style.minHeight=`${l}px`,this.canvasWrapper.appendChild(s);const c=s.cloneNode();this.progressWrapper.appendChild(c),this.renderMultiCanvas(e,a,n,l,s,c)}render(e){return I(this,void 0,void 0,function*(){var t;this.timeouts.forEach(c=>c()),this.timeouts=[],this.unsubscribeOnScroll.forEach(c=>c()),this.unsubscribeOnScroll=[],this.canvasWrapper.innerHTML="",this.progressWrapper.innerHTML="",this.options.width!=null&&(this.scrollContainer.style.width=typeof this.options.width=="number"?`${this.options.width}px`:this.options.width);const n=this.getPixelRatio(),r=this.scrollContainer.clientWidth-this.containerInlinePadding,{scrollWidth:o,isScrollable:a,useParentWidth:s,width:l}=function({duration:c,minPxPerSec:u=0,parentWidth:d,fillParent:h,pixelRatio:m}){const p=Math.ceil(c*u),f=p>d,g=!!(h&&!f);return{scrollWidth:p,isScrollable:f,useParentWidth:g,width:(g?d:p)*m}}({duration:e.duration,minPxPerSec:this.options.minPxPerSec||0,parentWidth:r,fillParent:this.options.fillParent,pixelRatio:n});if(this.isScrollable=a,this.wrapper.style.width=s?"100%":`${o}px`,this.scrollContainer.style.overflowX=this.isScrollable?"auto":"hidden",this.scrollContainer.classList.toggle("noScrollbar",!!this.options.hideScrollbar),this.cursor.style.backgroundColor=`${this.options.cursorColor||this.options.progressColor}`,this.cursor.style.width=`${this.options.cursorWidth}px`,this.audioData=e,this.emit("render"),this.options.splitChannels)for(let c=0;c<e.numberOfChannels;c++){const u=Object.assign(Object.assign({},this.options),(t=this.options.splitChannels)===null||t===void 0?void 0:t[c]);this.renderChannel([e.getChannelData(c)],u,l,c)}else{const c=[e.getChannelData(0)];e.numberOfChannels>1&&c.push(e.getChannelData(1)),this.renderChannel(c,this.options,l,0)}Promise.resolve().then(()=>this.emit("rendered"))})}reRender(){if(this.unsubscribeOnScroll.forEach(n=>n()),this.unsubscribeOnScroll=[],!this.audioData)return;const{scrollWidth:e}=this.scrollContainer,{right:t}=this.progressWrapper.getBoundingClientRect();if(this.render(this.audioData),!this.isScrollable&&this.scrollContainer.scrollLeft)this.scrollContainer.scrollLeft=0;else if(this.isScrollable&&e!==this.scrollContainer.scrollWidth){const{right:n}=this.progressWrapper.getBoundingClientRect(),r=function(o){const a=2*o;return(a<0?Math.floor(a):Math.ceil(a))/2}(n-t);this.scrollContainer.scrollLeft+=r}}zoom(e){this.options.minPxPerSec=e,this.reRender()}scrollIntoView(e,t=!1){var n;const{scrollLeft:r,scrollWidth:o,clientWidth:a}=this.scrollContainer,s=e*o,l=r,c=r+a,u=a/2;if(this.isDragging)s+30>c?this.scrollContainer.scrollLeft+=30:s-30<l&&(this.scrollContainer.scrollLeft-=30);else{(s<l||s>c)&&(this.scrollContainer.scrollLeft=s-(this.options.autoCenter?u:0));const d=s-r-u;if(t&&this.options.autoCenter&&d>0){const h=(n=this.audioData)===null||n===void 0?void 0:n.duration;if(h===void 0||h<=0)return void(this.scrollContainer.scrollLeft+=d);const m=o/h;this.scrollContainer.scrollLeft+=m<=600?Math.min(d,10):d}}}renderProgress(e,t){if(isNaN(e))return;const n=100*e;this.canvasWrapper.style.clipPath=`polygon(${n}% 0%, 100% 0%, 100% 100%, ${n}% 100%)`,this.progressWrapper.style.width=`${n}%`,this.cursor.style.left=`${n}%`,this.cursor.style.transform=this.options.cursorWidth?`translateX(-${e*this.options.cursorWidth}px)`:"",this.isScrollable&&this.options.autoScroll&&this.audioData&&this.audioData.duration>0&&this.scrollIntoView(e,t)}exportImage(e,t,n){return I(this,void 0,void 0,function*(){const r=this.canvasWrapper.querySelectorAll("canvas");if(!r.length)throw new Error("No waveform data");if(n==="dataURL"){const o=Array.from(r).map(a=>a.toDataURL(e,t));return Promise.resolve(o)}return Promise.all(Array.from(r).map(o=>new Promise((a,s)=>{o.toBlob(l=>{l?a(l):s(new Error("Could not export image"))},e,t)})))})}}class kn extends Ee{constructor(){super(...arguments),this.animationFrameId=null,this.isRunning=!1}start(){if(this.isRunning)return;this.isRunning=!0;const e=()=>{this.isRunning&&(this.emit("tick"),this.animationFrameId=requestAnimationFrame(e))};e()}stop(){this.isRunning=!1,this.animationFrameId!==null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null)}destroy(){this.stop(),this.unAll()}}class qe extends Ee{constructor(e){super(),this.bufferNode=null,this.playStartTime=0,this.playbackPosition=0,this._muted=!1,this._playbackRate=1,this._duration=void 0,this.buffer=null,this.currentSrc="",this.paused=!0,this.crossOrigin=null,this.seeking=!1,this.autoplay=!1,this.addEventListener=this.on,this.removeEventListener=this.un,this._destroyed=!1,function(){const t=globalThis.navigator;if(t!=null&&t.audioSession)try{t.audioSession.type="playback"}catch(n){console.warn("Setting navigator.audioSession.type failed:",n)}}(),this.audioContext=e||new AudioContext,this.gainNode=this.audioContext.createGain(),this.gainNode.connect(this.audioContext.destination)}load(){return I(this,void 0,void 0,function*(){})}remove(){this.destroy()}destroy(){if(!this._destroyed){if(this._destroyed=!0,this.currentSrc="",this.bufferNode){this.bufferNode.onended=null;try{this.bufferNode.stop()}catch{}this.bufferNode.disconnect(),this.bufferNode=null}this.gainNode.disconnect(),typeof this.audioContext.close=="function"&&Promise.resolve(this.audioContext.close.call(this.audioContext)).catch(()=>{}),this.buffer=null,this.unAll()}}get src(){return this.currentSrc}set src(e){if(this.currentSrc=e,this._duration=void 0,!e)return this.buffer=null,void this.emit("emptied");fetch(e).then(t=>{if(t.status>=400)throw new Error(`Failed to fetch ${e}: ${t.status} (${t.statusText})`);return t.arrayBuffer()}).then(t=>this.currentSrc!==e?null:this.audioContext.decodeAudioData(t)).then(t=>{this.currentSrc===e&&(this.buffer=t,this.emit("loadedmetadata"),this.emit("canplay"),this.autoplay&&this.play())}).catch(t=>{console.error("WebAudioPlayer load error:",t)})}_play(){if(!this.paused)return;this.paused=!1,this.bufferNode&&(this.bufferNode.onended=null,this.bufferNode.disconnect()),this.bufferNode=this.audioContext.createBufferSource(),this.buffer&&(this.bufferNode.buffer=this.buffer),this.bufferNode.playbackRate.value=this._playbackRate,this.bufferNode.connect(this.gainNode);let e=this.playbackPosition;(e>=this.duration||e<0)&&(e=0,this.playbackPosition=0),this.bufferNode.start(this.audioContext.currentTime,e),this.playStartTime=this.audioContext.currentTime,this.bufferNode.onended=()=>{!this.paused&&this.duration-this.currentTime<.01&&(this.pause(),this.emit("ended"))}}_pause(){if(this.paused=!0,this.bufferNode){this.bufferNode.onended=null;try{this.bufferNode.stop()}catch{}}this.playbackPosition+=(this.audioContext.currentTime-this.playStartTime)*this._playbackRate}play(){return I(this,void 0,void 0,function*(){this.paused&&(this._play(),this.emit("play"))})}pause(){this.paused||(this._pause(),this.emit("pause"))}stopAt(e){const t=(e-this.currentTime)/this._playbackRate,n=this.bufferNode;n==null||n.stop(this.audioContext.currentTime+t),n==null||n.addEventListener("ended",()=>{n===this.bufferNode&&(this.bufferNode=null,this.pause(),this.playbackPosition=Math.min(e,this.duration),this.emit("timeupdate"))},{once:!0})}setSinkId(e){return I(this,void 0,void 0,function*(){return this.audioContext.setSinkId(e)})}get playbackRate(){return this._playbackRate}set playbackRate(e){const t=!this.paused;t&&this._pause(),this._playbackRate=e,t&&this._play(),this.bufferNode&&(this.bufferNode.playbackRate.value=e)}get currentTime(){return this.paused?this.playbackPosition:this.playbackPosition+(this.audioContext.currentTime-this.playStartTime)*this._playbackRate}set currentTime(e){const t=!this.paused;t&&this._pause(),this.playbackPosition=e,t&&this._play(),this.emit("seeking"),this.emit("timeupdate")}get duration(){var e,t;return(e=this._duration)!==null&&e!==void 0?e:((t=this.buffer)===null||t===void 0?void 0:t.duration)||0}set duration(e){this._duration=e}get volume(){return this.gainNode.gain.value}set volume(e){this.gainNode.gain.value=e,this.emit("volumechange")}get muted(){return this._muted}set muted(e){this._muted!==e&&(this._muted=e,this._muted?this.gainNode.disconnect():this.gainNode.connect(this.audioContext.destination))}canPlayType(e){return/^(audio|video)\//.test(e)}getGainNode(){return this.gainNode}getChannelData(){const e=[];if(!this.buffer)return e;const t=this.buffer.numberOfChannels;for(let n=0;n<t;n++)e.push(this.buffer.getChannelData(n));return e}removeAttribute(e){switch(e){case"src":this.src="";break;case"playbackRate":this.playbackRate=0;break;case"currentTime":this.currentTime=0;break;case"duration":this.duration=0;break;case"volume":this.volume=0;break;case"muted":this.muted=!1}}}const Ln={waveColor:"#999",progressColor:"#555",cursorWidth:1,minPxPerSec:0,fillParent:!0,interact:!0,dragToSeek:!1,autoScroll:!0,autoCenter:!0,sampleRate:8e3};class ye extends yn{static create(e){return new ye(e)}getState(){return this.wavesurferState}getRenderer(){return this.renderer}constructor(e){const t=e.media||(e.backend==="WebAudio"?new qe:void 0);super({media:t,mediaControls:e.mediaControls,autoplay:e.autoplay,playbackRate:e.audioRate}),this.plugins=[],this.decodedData=null,this.stopAtPosition=null,this.subscriptions=[],this.mediaSubscriptions=[],this.abortController=null,this._isDestroyed=!1,this._loadVersion=0,this.reactiveCleanups=[],this.options=Object.assign({},Ln,e);const{state:n,actions:r}=function(s){var l,c,u,d,h,m;const p=(l=s==null?void 0:s.currentTime)!==null&&l!==void 0?l:M(0),f=(c=s==null?void 0:s.duration)!==null&&c!==void 0?c:M(0),g=(u=s==null?void 0:s.isPlaying)!==null&&u!==void 0?u:M(!1),v=(d=s==null?void 0:s.isSeeking)!==null&&d!==void 0?d:M(!1),w=(h=s==null?void 0:s.volume)!==null&&h!==void 0?h:M(1),S=(m=s==null?void 0:s.playbackRate)!==null&&m!==void 0?m:M(1),L=M(null),C=M(null),x=M(""),P=M(0),b=M(0),z=re(()=>!g.value,[g]),y=re(()=>L.value!==null,[L]),A=re(()=>y.value&&f.value>0,[y,f]),O=re(()=>p.value,[p]),q=re(()=>f.value>0?p.value/f.value:0,[p,f]);return{state:{currentTime:p,duration:f,isPlaying:g,isPaused:z,isSeeking:v,volume:w,playbackRate:S,audioBuffer:L,peaks:C,url:x,zoom:P,scrollPosition:b,canPlay:y,isReady:A,progress:O,progressPercent:q},actions:{setCurrentTime:k=>{const ee=Math.max(0,Math.min(f.value||1/0,k));p.set(ee)},setDuration:k=>{f.set(Math.max(0,k))},setPlaying:k=>{g.set(k)},setSeeking:k=>{v.set(k)},setVolume:k=>{const ee=Math.max(0,Math.min(1,k));w.set(ee)},setPlaybackRate:k=>{const ee=Math.max(.1,Math.min(16,k));S.set(ee)},setAudioBuffer:k=>{L.set(k),k&&f.set(k.duration)},setPeaks:k=>{C.set(k)},setUrl:k=>{x.set(k)},setZoom:k=>{P.set(Math.max(0,k))},setScrollPosition:k=>{b.set(Math.max(0,k))}}}}({isPlaying:this.isPlayingSignal,currentTime:this.currentTimeSignal,duration:this.durationSignal,volume:this.volumeSignal,playbackRate:this.playbackRateSignal,isSeeking:this.seekingSignal});this.wavesurferState=n,this.wavesurferActions=r,this.timer=new kn;const o=t?void 0:this.getMediaElement();this.renderer=new Cn(this.options,o),this.initPlayerEvents(),this.initRendererEvents(),this.initTimerEvents(),this.initReactiveState(),this.initPlugins();const a=this.options.url||this.getSrc()||"";Promise.resolve().then(()=>{this.emit("init");const{peaks:s,duration:l}=this.options;(a||s&&l)&&this.load(a,s,l).catch(()=>{})})}updateProgress(e=this.getCurrentTime()){return this.renderer.renderProgress(e/this.getDuration(),this.isPlaying()),e}initTimerEvents(){this.subscriptions.push(this.timer.on("tick",()=>{if(!this.isSeeking()){const e=this.updateProgress();if(this.emit("timeupdate",e),this.emit("audioprocess",e),this.stopAtPosition!=null&&this.isPlaying()&&e>=this.stopAtPosition){const t=this.stopAtPosition;this.pause(),this.setTime(t)}}}))}initReactiveState(){this.reactiveCleanups.push(function(e,t){const n=[];n.push(K(()=>{const a=e.isPlaying.value;t.emit(a?"play":"pause")},[e.isPlaying])),n.push(K(()=>{const a=e.currentTime.value;t.emit("timeupdate",a),e.isPlaying.value&&t.emit("audioprocess",a)},[e.currentTime,e.isPlaying])),n.push(K(()=>{e.isSeeking.value&&t.emit("seeking",e.currentTime.value)},[e.isSeeking,e.currentTime]));let r=!1;n.push(K(()=>{e.isReady.value&&!r&&(r=!0,t.emit("ready",e.duration.value))},[e.isReady,e.duration])),n.push(K(()=>{e.audioBuffer.value===null&&(r=!1)},[e.audioBuffer]));let o=!1;return n.push(K(()=>{const a=e.isPlaying.value,s=e.currentTime.value,l=e.duration.value,c=l>0&&s>=l;o&&!a&&c&&t.emit("finish"),o=a&&c},[e.isPlaying,e.currentTime,e.duration])),n.push(K(()=>{const a=e.zoom.value;a>0&&t.emit("zoom",a)},[e.zoom])),()=>{n.forEach(a=>a())}}(this.wavesurferState,{emit:this.emit.bind(this)}))}initPlayerEvents(){this.isPlaying()&&(this.emit("play"),this.timer.start()),this.mediaSubscriptions.push(this.onMediaEvent("timeupdate",()=>{const e=this.updateProgress();this.emit("timeupdate",e)}),this.onMediaEvent("play",()=>{this.emit("play"),this.timer.start()}),this.onMediaEvent("pause",()=>{this.emit("pause"),this.timer.stop(),this.stopAtPosition=null}),this.onMediaEvent("emptied",()=>{this.timer.stop(),this.stopAtPosition=null}),this.onMediaEvent("ended",()=>{this.emit("timeupdate",this.getDuration()),this.emit("finish"),this.stopAtPosition=null}),this.onMediaEvent("seeking",()=>{this.emit("seeking",this.getCurrentTime())}),this.onMediaEvent("error",()=>{var e;this.emit("error",(e=this.getMediaElement().error)!==null&&e!==void 0?e:new Error("Media error")),this.stopAtPosition=null}))}initRendererEvents(){this.subscriptions.push(this.renderer.on("click",(e,t)=>{this.options.interact&&(this.seekTo(e),this.emit("interaction",e*this.getDuration()),this.emit("click",e,t))}),this.renderer.on("dblclick",(e,t)=>{this.emit("dblclick",e,t)}),this.renderer.on("scroll",(e,t,n,r)=>{const o=this.getDuration();this.emit("scroll",e*o,t*o,n,r)}),this.renderer.on("render",()=>{this.emit("redraw")}),this.renderer.on("rendered",()=>{this.emit("redrawcomplete")}),this.renderer.on("dragstart",e=>{this.emit("dragstart",e)}),this.renderer.on("dragend",e=>{this.emit("dragend",e)}),this.renderer.on("resize",()=>{this.emit("resize")}));{let e;const t=this.renderer.on("drag",n=>{var r;if(!this.options.interact)return;this.renderer.renderProgress(n),clearTimeout(e);let o=0;const a=this.options.dragToSeek;this.isPlaying()?o=0:a===!0?o=200:a&&typeof a=="object"&&(o=(r=a.debounceTime)!==null&&r!==void 0?r:200),e=setTimeout(()=>{this.seekTo(n)},o),this.emit("interaction",n*this.getDuration()),this.emit("drag",n)});this.subscriptions.push(()=>{clearTimeout(e),t()})}}initPlugins(){var e;!((e=this.options.plugins)===null||e===void 0)&&e.length&&this.options.plugins.forEach(t=>{this.registerPlugin(t)})}unsubscribePlayerEvents(){this.mediaSubscriptions.forEach(e=>e()),this.mediaSubscriptions=[]}setOptions(e){this.options=Object.assign({},this.options,e),e.duration&&!e.peaks&&(this.decodedData=Ce.createBuffer(this.exportPeaks(),e.duration)),e.peaks&&e.duration&&(this.decodedData=Ce.createBuffer(e.peaks,e.duration)),this.renderer.setOptions(this.options),e.audioRate&&this.setPlaybackRate(e.audioRate),e.mediaControls!=null&&(this.getMediaElement().controls=e.mediaControls)}registerPlugin(e){if(this.plugins.includes(e))return e;e._init(this),this.plugins.push(e);const t=e.once("destroy",()=>{this.plugins=this.plugins.filter(n=>n!==e),this.subscriptions=this.subscriptions.filter(n=>n!==t)});return this.subscriptions.push(t),e}unregisterPlugin(e){this.plugins=this.plugins.filter(t=>t!==e),e.destroy()}getWrapper(){return this.renderer.getWrapper()}getWidth(){return this.renderer.getWidth()}getScroll(){return this.renderer.getScroll()}setScroll(e){return this.renderer.setScroll(e)}setScrollTime(e){const t=e/this.getDuration();this.renderer.setScrollPercentage(t)}getActivePlugins(){return this.plugins}loadAudio(e,t,n,r){return I(this,void 0,void 0,function*(){var o;const a=++this._loadVersion;if(this._isDestroyed=!1,this.emit("load",e),!this.options.media&&this.isPlaying()&&this.pause(),this.decodedData=null,this.stopAtPosition=null,(o=this.abortController)===null||o===void 0||o.abort(),this.abortController=null,!t&&!n){const l=this.options.fetchParams||{};window.AbortController&&!l.signal&&(this.abortController=new AbortController,l.signal=this.abortController.signal);const c=d=>this.emit("loading",d);if(t=yield bn.fetchBlob(e,c,l),this._isDestroyed||a!==this._loadVersion)return;const u=this.options.blobMimeType;u&&(t=new Blob([t],{type:u}))}if(this._isDestroyed||a!==this._loadVersion)return;this.setSrc(e,t);const s=yield new Promise(l=>{const c=r||this.getDuration();c?l(c):this.mediaSubscriptions.push(this.onMediaEvent("loadedmetadata",()=>l(this.getDuration()),{once:!0}))});if(!this._isDestroyed&&a===this._loadVersion){if(!e&&!t){const l=this.getMediaElement();l instanceof qe&&(l.duration=s)}if(n)this.decodedData=Ce.createBuffer(n,s||0);else if(t){const l=yield t.arrayBuffer();if(this._isDestroyed||a!==this._loadVersion)return;this.decodedData=yield Ce.decode(l,this.options.sampleRate)}this._isDestroyed||a!==this._loadVersion||(this.decodedData&&(this.emit("decode",this.getDuration()),this.renderer.render(this.decodedData)),this.emit("ready",this.getDuration()))}})}load(e,t,n){return I(this,void 0,void 0,function*(){try{return yield this.loadAudio(e,void 0,t,n)}catch(r){throw this.emit("error",r),r}})}loadBlob(e,t,n){return I(this,void 0,void 0,function*(){try{return yield this.loadAudio("",e,t,n)}catch(r){throw this.emit("error",r),r}})}zoom(e){if(!this.decodedData)throw new Error("No audio loaded");this.renderer.zoom(e),this.emit("zoom",e)}getDecodedData(){return this.decodedData}exportPeaks({channels:e=2,maxLength:t=8e3,precision:n=1e4}={}){if(!this.decodedData)throw new Error("The audio has not been decoded yet");const r=Math.min(e,this.decodedData.numberOfChannels),o=[];for(let a=0;a<r;a++){const s=this.decodedData.getChannelData(a),l=[],c=s.length/t;for(let u=0;u<t;u++){const d=s.slice(Math.floor(u*c),Math.ceil((u+1)*c));let h=0;for(let m=0;m<d.length;m++){const p=d[m];Math.abs(p)>Math.abs(h)&&(h=p)}l.push(Math.round(h*n)/n)}o.push(l)}return o}getDuration(){let e=super.getDuration()||0;return e!==0&&e!==1/0||!this.decodedData||(e=this.decodedData.duration),e}toggleInteraction(e){this.options.interact=e}setTime(e){this.stopAtPosition=null,super.setTime(e),this.updateProgress(e),this.emit("timeupdate",e)}seekTo(e){const t=this.getDuration()*e;this.setTime(t)}play(e,t){const n=Object.create(null,{play:{get:()=>super.play}});return I(this,void 0,void 0,function*(){e!=null&&this.setTime(e);const r=yield n.play.call(this);return t!=null&&(this.media instanceof qe?this.media.stopAt(t):this.stopAtPosition=t),r})}playPause(){return I(this,void 0,void 0,function*(){return this.isPlaying()?this.pause():this.play()})}stop(){this.pause(),this.setTime(0)}skip(e){this.setTime(this.getCurrentTime()+e)}empty(){this.load("",[[0]],.001)}setMediaElement(e){this.unsubscribePlayerEvents(),super.setMediaElement(e),this.initPlayerEvents()}exportImage(){return I(this,arguments,void 0,function*(e="image/png",t=1,n="dataURL"){return this.renderer.exportImage(e,t,n)})}destroy(){var e;this._isDestroyed=!0,this.emit("destroy"),(e=this.abortController)===null||e===void 0||e.abort(),this.plugins.forEach(t=>t.destroy()),this.subscriptions.forEach(t=>t()),this.unsubscribePlayerEvents(),this.reactiveCleanups.forEach(t=>t()),this.reactiveCleanups=[],this.timer.destroy(),this.renderer.destroy(),super.destroy()}}ye.BasePlugin=class extends Ee{constructor(i){super(),this.subscriptions=[],this.isDestroyed=!1,this.options=i}onInit(){}_init(i){this.isDestroyed&&(this.subscriptions=[],this.isDestroyed=!1),this.wavesurfer=i,this.onInit()}destroy(){this.emit("destroy"),this.subscriptions.forEach(i=>i()),this.subscriptions=[],this.isDestroyed=!0,this.wavesurfer=void 0}},ye.dom=vn;class jt{constructor(){this.listeners={}}on(e,t,n){if(this.listeners[e]||(this.listeners[e]=new Set),n==null?void 0:n.once){const r=(...o)=>{this.un(e,r),t(...o)};return this.listeners[e].add(r),()=>this.un(e,r)}return this.listeners[e].add(t),()=>this.un(e,t)}un(e,t){var n;(n=this.listeners[e])===null||n===void 0||n.delete(t)}once(e,t){return this.on(e,t,{once:!0})}unAll(){this.listeners={}}emit(e,...t){this.listeners[e]&&this.listeners[e].forEach(n=>n(...t))}}class Sn extends jt{constructor(e){super(),this.subscriptions=[],this.isDestroyed=!1,this.options=e}onInit(){}_init(e){this.isDestroyed&&(this.subscriptions=[],this.isDestroyed=!1),this.wavesurfer=e,this.onInit()}destroy(){this.emit("destroy"),this.subscriptions.forEach(e=>e()),this.subscriptions=[],this.isDestroyed=!0,this.wavesurfer=void 0}}function Vt(i,e){const t=e.xmlns?document.createElementNS(e.xmlns,i):document.createElement(i);for(const[n,r]of Object.entries(e))if(n==="children"&&r)for(const[o,a]of Object.entries(r))a instanceof Node?t.appendChild(a):typeof a=="string"?t.appendChild(document.createTextNode(a)):t.appendChild(Vt(o,a));else n==="style"?Object.assign(t.style,r):n==="textContent"?t.textContent=r:t.setAttribute(n,r.toString());return t}function ve(i,e,t){const n=Vt(i,e||{});return t==null||t.appendChild(n),n}function Xt(i){let e=i;const t=new Set;return{get value(){return e},set(n){Object.is(e,n)||(e=n,t.forEach(r=>r(e)))},update(n){this.set(n(e))},subscribe:n=>(t.add(n),()=>t.delete(n))}}function Re(i,e){let t;const n=()=>{t&&(t(),t=void 0),t=i()},r=e.map(o=>o.subscribe(n));return n(),()=>{t&&(t(),t=void 0),r.forEach(o=>o())}}function de(i,e){const t=Xt(null),n=r=>{t.set(r)};return i.addEventListener(e,n),t._cleanup=()=>{i.removeEventListener(e,n)},t}function ie(i){const e=i._cleanup;typeof e=="function"&&e()}function De(i,e={}){const{threshold:t=3,mouseButton:n=0,touchDelay:r=100}=e,o=Xt(null),a=new Map,s=matchMedia("(pointer: coarse)").matches;let l=()=>{};const c=u=>{if(u.button!==n||a.has(u.pointerId)||(a.set(u.pointerId,u),a.size>1))return;const d=u.pointerId;let h=u.clientX,m=u.clientY,p=!1;const f=Date.now(),g=i.getBoundingClientRect(),{left:v,top:w}=g,S=b=>{if(b.pointerId!==d||b.defaultPrevented||a.size>1||s&&Date.now()-f<r)return;const z=b.clientX,y=b.clientY,A=z-h,O=y-m;(p||Math.abs(A)>t||Math.abs(O)>t)&&(b.preventDefault(),b.stopPropagation(),p||(o.set({type:"start",x:h-v,y:m-w}),p=!0),o.set({type:"move",x:z-v,y:y-w,deltaX:A,deltaY:O}),h=z,m=y)},L=b=>{if(a.delete(b.pointerId)){if(b.pointerId===d&&p){const z=b.clientX,y=b.clientY;o.set({type:"end",x:z-v,y:y-w})}a.size===0&&l()}},C=b=>{b.relatedTarget&&b.relatedTarget!==document.documentElement||L(b)},x=b=>{p&&(b.stopPropagation(),b.preventDefault())},P=b=>{b.defaultPrevented||a.size>1||p&&b.preventDefault()};document.addEventListener("pointermove",S),document.addEventListener("pointerup",L),document.addEventListener("pointerout",C),document.addEventListener("pointercancel",C),document.addEventListener("touchmove",P,{passive:!1}),document.addEventListener("click",x,{capture:!0}),l=()=>{document.removeEventListener("pointermove",S),document.removeEventListener("pointerup",L),document.removeEventListener("pointerout",C),document.removeEventListener("pointercancel",C),document.removeEventListener("touchmove",P),setTimeout(()=>{document.removeEventListener("click",x,{capture:!0})},10)}};return i.addEventListener("pointerdown",c),{signal:o,cleanup:()=>{l(),i.removeEventListener("pointerdown",c),a.clear(),ie(o)}}}class gt extends jt{constructor(e,t,n=0){var r,o,a,s,l,c,u,d,h,m;super(),this.totalDuration=t,this.numberOfChannels=n,this.element=null,this.minLength=0,this.maxLength=1/0,this.contentEditable=!1,this.subscriptions=[],this.updatingSide=void 0,this.isRemoved=!1,this.subscriptions=[],this.id=e.id||`region-${Math.random().toString(32).slice(2)}`,this.start=this.clampPosition(e.start),this.end=this.clampPosition((r=e.end)!==null&&r!==void 0?r:e.start),this.drag=(o=e.drag)===null||o===void 0||o,this.resize=(a=e.resize)===null||a===void 0||a,this.resizeStart=(s=e.resizeStart)===null||s===void 0||s,this.resizeEnd=(l=e.resizeEnd)===null||l===void 0||l,this.color=(c=e.color)!==null&&c!==void 0?c:"rgba(0, 0, 0, 0.1)",this.minLength=(u=e.minLength)!==null&&u!==void 0?u:this.minLength,this.maxLength=(d=e.maxLength)!==null&&d!==void 0?d:this.maxLength,this.channelIdx=(h=e.channelIdx)!==null&&h!==void 0?h:-1,this.contentEditable=(m=e.contentEditable)!==null&&m!==void 0?m:this.contentEditable,this.element=this.initElement(),this.setContent(e.content),this.setPart(),this.renderPosition(),this.initMouseEvents()}clampPosition(e){return Math.max(0,Math.min(this.totalDuration,e))}setPart(){var e;const t=this.start===this.end;(e=this.element)===null||e===void 0||e.setAttribute("part",`${t?"marker":"region"} ${this.id}`)}addResizeHandles(e){const t={position:"absolute",zIndex:"2",width:"6px",height:"100%",top:"0",cursor:"ew-resize",wordBreak:"keep-all"},n=ve("div",{part:"region-handle region-handle-left",style:Object.assign(Object.assign({},t),{left:"0",borderLeft:"2px solid rgba(0, 0, 0, 0.5)",borderRadius:"2px 0 0 2px"})},e),r=ve("div",{part:"region-handle region-handle-right",style:Object.assign(Object.assign({},t),{right:"0",borderRight:"2px solid rgba(0, 0, 0, 0.5)",borderRadius:"0 2px 2px 0"})},e),o=De(n,{threshold:1}),a=De(r,{threshold:1}),s=Re(()=>{const c=o.signal.value;c&&(c.type==="move"&&c.deltaX!==void 0?this.onResize(c.deltaX,"start"):c.type==="end"&&this.onEndResizing("start"))},[o.signal]),l=Re(()=>{const c=a.signal.value;c&&(c.type==="move"&&c.deltaX!==void 0?this.onResize(c.deltaX,"end"):c.type==="end"&&this.onEndResizing("end"))},[a.signal]);this.subscriptions.push(()=>{s(),l(),o.cleanup(),a.cleanup()})}removeResizeHandles(e){const t=e.querySelector('[part*="region-handle-left"]'),n=e.querySelector('[part*="region-handle-right"]');t&&e.removeChild(t),n&&e.removeChild(n)}initElement(){if(this.isRemoved)return null;const e=this.start===this.end;let t=0,n=100;this.channelIdx>=0&&this.numberOfChannels>0&&this.channelIdx<this.numberOfChannels&&(n=100/this.numberOfChannels,t=n*this.channelIdx);const r=ve("div",{style:{position:"absolute",top:`${t}%`,height:`${n}%`,backgroundColor:e?"none":this.color,borderLeft:e?"2px solid "+this.color:"none",borderRadius:"2px",boxSizing:"border-box",transition:"background-color 0.2s ease",cursor:this.drag?"grab":"default",pointerEvents:"all"}});return!e&&this.resize&&this.addResizeHandles(r),r}renderPosition(){if(!this.element)return;const e=this.start/this.totalDuration,t=(this.totalDuration-this.end)/this.totalDuration;this.element.style.left=100*e+"%",this.element.style.right=100*t+"%"}toggleCursor(e){var t;this.drag&&(!((t=this.element)===null||t===void 0)&&t.style)&&(this.element.style.cursor=e?"grabbing":"grab")}initMouseEvents(){const{element:e}=this;if(!e)return;const t=de(e,"click"),n=de(e,"mouseenter"),r=de(e,"mouseleave"),o=de(e,"dblclick"),a=de(e,"pointerdown"),s=de(e,"pointerup"),l=t.subscribe(g=>g&&this.emit("click",g)),c=n.subscribe(g=>g&&this.emit("over",g)),u=r.subscribe(g=>g&&this.emit("leave",g)),d=o.subscribe(g=>g&&this.emit("dblclick",g)),h=a.subscribe(g=>g&&this.toggleCursor(!0)),m=s.subscribe(g=>g&&this.toggleCursor(!1));this.subscriptions.push(()=>{l(),c(),u(),d(),h(),m(),ie(t),ie(n),ie(r),ie(o),ie(a),ie(s)});const p=De(e),f=Re(()=>{const g=p.signal.value;g&&(g.type==="start"?this.toggleCursor(!0):g.type==="move"&&g.deltaX!==void 0?this.onMove(g.deltaX):g.type==="end"&&(this.toggleCursor(!1),this.drag&&this.emit("update-end")))},[p.signal]);this.subscriptions.push(()=>{f(),p.cleanup()}),this.contentEditable&&this.content&&(this.contentClickListener=g=>this.onContentClick(g),this.contentBlurListener=()=>this.onContentBlur(),this.content.addEventListener("click",this.contentClickListener),this.content.addEventListener("blur",this.contentBlurListener))}_onUpdate(e,t,n){var r;if(!(!((r=this.element)===null||r===void 0)&&r.parentElement))return;const{width:o}=this.element.parentElement.getBoundingClientRect(),a=e/o*this.totalDuration;let s=t&&t!=="start"?this.start:this.start+a,l=t&&t!=="end"?this.end:this.end+a;const c=n!==void 0;c&&this.updatingSide&&this.updatingSide!==t&&(this.updatingSide==="start"?s=n:l=n),s=Math.max(0,s),l=Math.min(this.totalDuration,l);const u=l-s;this.updatingSide=t;const d=u>=this.minLength&&u<=this.maxLength;s<=l&&(d||c)&&(this.start=s,this.end=l,this.renderPosition(),this.emit("update",t))}onMove(e){this.drag&&this._onUpdate(e)}onResize(e,t){this.resize&&(this.resizeStart||t!=="start")&&(this.resizeEnd||t!=="end")&&this._onUpdate(e,t)}onEndResizing(e){this.resize&&(this.emit("update-end",e),this.updatingSide=void 0)}onContentClick(e){e.stopPropagation(),e.target.focus(),this.emit("click",e)}onContentBlur(){this.emit("update-end")}_setTotalDuration(e){this.totalDuration=e,this.renderPosition()}play(e){this.emit("play",e&&this.end!==this.start?this.end:void 0)}getContent(e=!1){var t;return e?this.content||void 0:this.element instanceof HTMLElement?((t=this.content)===null||t===void 0?void 0:t.innerHTML)||void 0:""}setContent(e){var t;if(this.element)if(this.content&&this.contentEditable&&(this.contentClickListener&&this.content.removeEventListener("click",this.contentClickListener),this.contentBlurListener&&this.content.removeEventListener("blur",this.contentBlurListener)),(t=this.content)===null||t===void 0||t.remove(),e){if(typeof e=="string"){const n=this.start===this.end;this.content=ve("div",{style:{padding:`0.2em ${n?.2:.4}em`,display:"inline-block"},textContent:e})}else this.content=e;this.contentEditable&&(this.content.contentEditable="true",this.contentClickListener=n=>this.onContentClick(n),this.contentBlurListener=()=>this.onContentBlur(),this.content.addEventListener("click",this.contentClickListener),this.content.addEventListener("blur",this.contentBlurListener)),this.content.setAttribute("part","region-content"),this.element.appendChild(this.content),this.emit("content-changed")}else this.content=void 0}setOptions(e){var t,n;if(this.element){if(e.color&&(this.color=e.color,this.element.style.backgroundColor=this.color),e.drag!==void 0&&(this.drag=e.drag,this.element.style.cursor=this.drag?"grab":"default"),e.start!==void 0||e.end!==void 0){const r=this.start===this.end;this.start=this.clampPosition((t=e.start)!==null&&t!==void 0?t:this.start),this.end=this.clampPosition((n=e.end)!==null&&n!==void 0?n:r?this.start:this.end),this.renderPosition(),this.setPart(),this.emit("render")}if(e.content&&this.setContent(e.content),e.id&&(this.id=e.id,this.setPart()),e.resize!==void 0&&e.resize!==this.resize){const r=this.start===this.end;this.resize=e.resize,this.resize&&!r?this.addResizeHandles(this.element):this.removeResizeHandles(this.element)}e.resizeStart!==void 0&&(this.resizeStart=e.resizeStart),e.resizeEnd!==void 0&&(this.resizeEnd=e.resizeEnd)}}remove(){this.isRemoved=!0,this.emit("remove"),this.subscriptions.forEach(e=>e()),this.subscriptions=[],this.content&&this.contentEditable&&(this.contentClickListener&&(this.content.removeEventListener("click",this.contentClickListener),this.contentClickListener=void 0),this.contentBlurListener&&(this.content.removeEventListener("blur",this.contentBlurListener),this.contentBlurListener=void 0)),this.element&&(this.element.remove(),this.element=null),this.unAll()}}class Ze extends Sn{constructor(e){super(e),this.regions=[],this.regionsContainer=this.initRegionsContainer()}static create(e){return new Ze(e)}onInit(){if(!this.wavesurfer)throw Error("WaveSurfer is not initialized");this.wavesurfer.getWrapper().appendChild(this.regionsContainer),this.subscriptions.push(this.wavesurfer.on("ready",t=>{this.regions.forEach(n=>n._setTotalDuration(t))}));let e=[];this.subscriptions.push(this.wavesurfer.on("timeupdate",t=>{const n=this.regions.filter(r=>r.start<=t&&(r.end===r.start?r.start+.05:r.end)>=t);n.forEach(r=>{e.includes(r)||this.emit("region-in",r)}),e.forEach(r=>{n.includes(r)||this.emit("region-out",r)}),e=n}))}initRegionsContainer(){return ve("div",{part:"regions-container",style:{position:"absolute",top:"0",left:"0",width:"100%",height:"100%",zIndex:"5",pointerEvents:"none"}})}getRegions(){return this.regions}avoidOverlapping(e){e.content&&!e.isRemoved&&setTimeout(()=>{if(!e.content)return;const t=e.content;t.style.marginTop="0";const n=t.getBoundingClientRect(),r=this.regions.indexOf(e);if(r<0)return;const o=this.regions.slice(0,r).filter(a=>!a.isRemoved).reduce((a,s)=>{if(s===e||!s.content)return a;const l=s.content.getBoundingClientRect();return n.left<l.right&&l.left<n.right&&a.push(l),a},[]).sort((a,s)=>a.top-s.top).reduce((a,s)=>{const l=n.top+a,c=l+n.height;return l<s.bottom&&s.top<c?s.bottom-n.top+2:a},0);t.style.marginTop=`${o}px`},10)}avoidOverlappingAll(){this.regions.forEach(e=>this.avoidOverlapping(e))}adjustScroll(e){var t,n;if(!e.element)return;const r=(n=(t=this.wavesurfer)===null||t===void 0?void 0:t.getWrapper())===null||n===void 0?void 0:n.parentElement;if(!r)return;const{clientWidth:o,scrollWidth:a}=r;if(a<=o)return;const s=r.getBoundingClientRect(),l=e.element.getBoundingClientRect(),c=l.left-s.left,u=l.right-s.left;c<0?r.scrollLeft+=c:u>o&&(r.scrollLeft+=u-o)}virtualAppend(e,t,n){const r=()=>{if(!this.wavesurfer)return;const o=this.wavesurfer.getWidth(),a=this.wavesurfer.getScroll(),s=t.clientWidth,l=this.wavesurfer.getDuration(),c=Math.round(e.start/l*s),u=c+(Math.round((e.end-e.start)/l*s)||1)>a&&c<a+o;u&&!n.parentElement?t.appendChild(n):!u&&n.parentElement&&n.remove()};setTimeout(()=>{if(!this.wavesurfer||!e.element)return;r();const o=this.wavesurfer.on("scroll",r),a=this.wavesurfer.on("zoom",r),s=this.wavesurfer.on("resize",r),l=e.on("render",r);this.subscriptions.push(o,a,s,l),e.once("remove",()=>{o(),a(),s(),l()})},0)}saveRegion(e){if(!e.element)return;this.virtualAppend(e,this.regionsContainer,e.element),this.avoidOverlapping(e),this.regions.push(e);const t=[e.on("update",n=>{n||this.adjustScroll(e),this.emit("region-update",e,n)}),e.on("update-end",n=>{this.avoidOverlappingAll(),this.emit("region-updated",e,n)}),e.on("play",n=>{var r;(r=this.wavesurfer)===null||r===void 0||r.play(e.start,n)}),e.on("click",n=>{this.emit("region-clicked",e,n)}),e.on("dblclick",n=>{this.emit("region-double-clicked",e,n)}),e.on("content-changed",()=>{this.emit("region-content-changed",e)}),e.once("remove",()=>{t.forEach(n=>n()),this.regions=this.regions.filter(n=>n!==e),this.emit("region-removed",e)})];this.subscriptions.push(...t),this.emit("region-created",e)}addRegion(e){var t,n;if(!this.wavesurfer)throw Error("WaveSurfer is not initialized");const r=this.wavesurfer.getDuration(),o=(n=(t=this.wavesurfer)===null||t===void 0?void 0:t.getDecodedData())===null||n===void 0?void 0:n.numberOfChannels,a=new gt(e,r,o);return this.emit("region-initialized",a),r?this.saveRegion(a):this.subscriptions.push(this.wavesurfer.once("ready",s=>{a._setTotalDuration(s),this.saveRegion(a)})),a}enableDragSelection(e,t=3){var n;const r=(n=this.wavesurfer)===null||n===void 0?void 0:n.getWrapper();if(!(r&&r instanceof HTMLElement))return()=>{};let o=null,a=0,s=0;const l=De(r,{threshold:t}),c=Re(()=>{var u,d;const h=l.signal.value;if(h)if(h.type==="start"){if(a=h.x,!this.wavesurfer)return;const m=this.wavesurfer.getDuration(),p=(d=(u=this.wavesurfer)===null||u===void 0?void 0:u.getDecodedData())===null||d===void 0?void 0:d.numberOfChannels,{width:f}=this.wavesurfer.getWrapper().getBoundingClientRect();s=a/f*m;const g=h.x/f*m,v=(h.x+5)/f*m;o=new gt(Object.assign(Object.assign({},e),{start:g,end:v}),m,p),this.emit("region-initialized",o),o.element&&this.regionsContainer.appendChild(o.element)}else h.type==="move"&&h.deltaX!==void 0?o&&o._onUpdate(h.deltaX,h.x>a?"end":"start",s):h.type==="end"&&o&&(this.saveRegion(o),o.updatingSide=void 0,o=null)},[l.signal]);return()=>{c(),l.cleanup()}}clearRegions(){this.regions.slice().forEach(e=>e.remove()),this.regions=[]}destroy(){this.clearRegions(),super.destroy(),this.regionsContainer.remove()}}const qt={lead:"主角",supporting:"配角",mascot:"吉祥物"},j={lead:"#3b82f6",supporting:"#64748b",mascot:"#ec4899"},vt=[{name:"迪迪",role:"lead"},{name:"克克",role:"lead"},{name:"林林",role:"lead"},{name:"泰泰",role:"lead"},{name:"怪氣流",role:"mascot"},{name:"田鼠先生",role:"mascot"},{name:"田鼠太太",role:"mascot"},{name:"吵鬧菇",role:"mascot"},{name:"穿山甲大叔",role:"supporting"},{name:"花福導遊",role:"supporting"},{name:"達東爸",role:"supporting"},{name:"達東媽",role:"supporting"},{name:"村長",role:"supporting"},{name:"卡爾博士",role:"supporting"},{name:"小達東",role:"supporting"},{name:"阿桂",role:"supporting"}];function Kt(i,e){if(!i)return null;const t=e.find(n=>n.name===i);return t?j[t.role]:null}const Jt="voicepicker.author",Gt="voicepicker.comments",Yt="voicepicker.characters";function Rn(){return localStorage.getItem(Jt)??""}function Dn(i){localStorage.setItem(Jt,i)}function Pn(i){const e=i??{};return{id:typeof e.id=="string"?e.id:Math.random().toString(36).slice(2),author:typeof e.author=="string"?e.author:"",text:typeof e.text=="string"?e.text:"",created:typeof e.created=="number"?e.created:Date.now()}}function Fe(i){const e=i??{},t=e.character;let n;Array.isArray(t)?n=t.filter(o=>typeof o=="string"):typeof t=="string"?n=[t]:n=[];const r=Array.isArray(e.replies)?e.replies.map(Pn):[];return{id:typeof e.id=="string"?e.id:Math.random().toString(36).slice(2),file:typeof e.file=="string"?e.file:"",time:typeof e.time=="number"?e.time:null,text:typeof e.text=="string"?e.text:"",author:typeof e.author=="string"?e.author:"",character:n,replies:r,rating:typeof e.rating=="number"?Math.min(5,Math.max(0,Math.round(e.rating))):0}}function Mn(){try{const i=localStorage.getItem(Gt);return i?JSON.parse(i).map(Fe):[]}catch{return[]}}function Qe(i){localStorage.setItem(Gt,JSON.stringify(i))}function Nn(){try{const i=localStorage.getItem(Yt);return i?JSON.parse(i):[...vt]}catch{return[...vt]}}function Oe(i){localStorage.setItem(Yt,JSON.stringify(i))}const Tn=`<!DOCTYPE html>
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

/* 篩選工具列 */
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
      <button id="zeroFilterBtn" class="tool-btn" title="點擊隱藏 0 分評論">👎</button>
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
    sortByRating(list).forEach(c => wrap.appendChild(buildCard(c)));
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
const ZERO_TITLES = { all: '點擊隱藏 0 分評論', hide: '0 分已隱藏 · 再按 Solo', solo: 'Solo 0 分 · 再按恢復' };
const zeroFilterBtn = document.getElementById('zeroFilterBtn');
zeroFilterBtn.addEventListener('click', () => {
  zeroFilter = ZERO_NEXT[zeroFilter];
  zeroFilterBtn.className = 'tool-btn' + (zeroFilter !== 'all' ? ' ' + zeroFilter : '');
  zeroFilterBtn.title = ZERO_TITLES[zeroFilter];
  renderRoleView();
});

// ── 啟動 ──
renderRoleView();
<\/script>
</body>
</html>
`,On=new Set(["wav","mp3","m4a","aac","ogg","flac","wma","opus"]),bt=4,_n=1.5,In=.25,et="voicepicker.json";let T=[],V=-1,ke=null,H="single",U=0,X=null,yt,Pe,_e=null,te=Rn(),D=Mn(),N=Nn(),tt=0,ae=!0,se=[],_="text",fe=null,Y=null,Ie=null,B=[],W=0,xe=null,Me="rating",ue=!1,J="all",oe=0;const E=i=>document.getElementById(i),Et=E("pick"),xt=E("exportBtn"),wt=E("importBtn"),Ne=E("importFile"),Ct=E("editChars"),kt=E("roleViewBtn"),Lt=E("filelist"),Zt=E("nowplaying"),nt=E("status"),Ae=E("playBtn"),An=E("appVer"),Bn=E("sidebar"),Wn=E("player"),Te=E("grid"),F=E("roleview"),Hn=E("comments"),Fn=E("commentsHead"),ze=E("commentlist"),it=E("composer"),he=E("composerToggle"),ge=E("composerText"),Qt=E("composerChars"),St=E("composerRatingEl"),$e=E("nameModal"),Be=E("nameInput"),rt=E("charModal"),Rt=E("charEditList"),Ke=E("newCharName"),$n=E("newCharRole"),en=E("addCharBtn"),Un=E("closeCharBtn"),Dt=E("ratingsBtn"),Pt=E("shareBtn"),We=E("shareModal"),jn=E("shareCancelBtn"),pe=E("shareConfirmBtn"),R=ye.create({container:"#waveform",waveColor:"#7a8ba6",progressColor:"#3b82f6",cursorColor:"#ef4444",height:120}),Je=R.registerPlugin(Ze.create());R.on("ready",()=>{nt.textContent=`${He(0)} / ${He(R.getDuration())}`});R.on("timeupdate",i=>{nt.textContent=`${He(i)} / ${He(R.getDuration())}`});R.on("play",()=>{Ae.textContent="⏸ 暫停",H==="role"&&we()});R.on("pause",()=>{Ae.textContent="▶ 播放",H==="role"&&we()});R.on("finish",()=>{H==="single"&&V<T.length-1?ne(V+1):H==="role"&&(xe=null,we())});Je.on("region-clicked",(i,e)=>{e.stopPropagation(),R.setTime(i.start),R.play()});Ae.addEventListener("click",()=>{Ae.blur(),R.playPause()});function ot(i){if(!isFinite(i))return"0:00";const e=Math.floor(i/60),t=Math.floor(i%60).toString().padStart(2,"0");return`${e}:${t}`}function He(i){if(!isFinite(i))return"0:00.00";const e=Math.floor(i/60),t=Math.floor(i%60),n=Math.floor((i-Math.floor(i))*100);return`${e}:${t.toString().padStart(2,"0")}.${n.toString().padStart(2,"0")}`}function tn(){return Math.random().toString(36).slice(2)+Date.now().toString(36)}function Ge(i){return i.code==="Enter"||i.code==="NumpadEnter"}function at(i,e){const t=i.indexOf(e);t>=0?i.splice(t,1):i.push(e)}function me(i){return i.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}function Ue(){return V>=0&&V<T.length?T[V].name:null}function Vn(){return H==="grid"?U>=0&&U<T.length?T[U].name:null:Ue()}function st(i){return i?D.filter(e=>e.file===i).sort((e,t)=>(e.time??-1/0)-(t.time??-1/0)):[]}function nn(i){return D.filter(e=>e.file===i).length}function Xn(i){return(i.length?Kt(i[0],N):null)??"#3b82f6"}function Z(){rn(),Ve(),je(),ce(),H==="role"&&le()}function Q(){var i;ce(),H==="role"&&le(),Y&&((i=(H==="role"?F:ze).querySelector(".creply-input input"))==null||i.focus())}function rn(){Qe(D),X&&(window.clearTimeout(yt),yt=window.setTimeout(()=>void qn(),300))}async function qn(){if(X)try{const e=await(await X.getFileHandle(et,{create:!0})).createWritable();await e.write(JSON.stringify({version:1,updated:new Date().toISOString(),comments:D},null,2)),await e.close()}catch{}}function on(i){const e=new Map(D.map(t=>[t.id,t]));i.forEach(t=>e.set(t.id,t)),D=[...e.values()]}async function Kn(){if(X)try{const e=await(await X.getFileHandle(et)).getFile(),t=JSON.parse(await e.text());Array.isArray(t==null?void 0:t.comments)&&(on(t.comments.map(Fe)),Qe(D))}catch{}}function Jn(){const i=JSON.stringify({version:1,exported:new Date().toISOString(),comments:D,characters:N},null,2),e=new Blob([i],{type:"application/json"}),t=URL.createObjectURL(e),n=new Date,r=s=>String(s).padStart(2,"0"),o=`${n.getFullYear()}${r(n.getMonth()+1)}${r(n.getDate())}-${r(n.getHours())}${r(n.getMinutes())}`,a=document.createElement("a");a.href=t,a.download=`voicepicker-backup-${o}.json`,a.click(),URL.revokeObjectURL(t)}async function Gn(i){try{const e=JSON.parse(await i.text());Array.isArray(e==null?void 0:e.comments)&&on(e.comments.map(Fe)),Array.isArray(e==null?void 0:e.characters)&&e.characters.length>0&&(N=e.characters,Oe(N)),Z(),alert(`匯入完成：目前共 ${D.length} 則留言。`)}catch{alert("匯入失敗：檔案不是有效的 VoicePicker 備份。")}}xt.addEventListener("click",()=>{xt.blur(),Jn()});wt.addEventListener("click",()=>{wt.blur(),Ne.click()});Ne.addEventListener("change",()=>{var e;const i=(e=Ne.files)==null?void 0:e[0];i&&Gn(i),Ne.value=""});Et.addEventListener("click",async()=>{var e;Et.blur();const i=window.showDirectoryPicker;if(!i){alert("此瀏覽器不支援資料夾選取，請改用 Chrome / Edge。");return}try{X=await i({mode:"readwrite"})}catch{return}T=[];for await(const[t,n]of X.entries()){if(n.kind!=="file")continue;const r=((e=t.split(".").pop())==null?void 0:e.toLowerCase())??"";On.has(r)&&T.push({name:t,handle:n})}T.sort((t,n)=>t.name.localeCompare(n.name,"zh-Hant",{numeric:!0})),await Kn(),_e=Date.now(),hi(),mn(),je(),T.length>0?(U=0,ne(0)):Zt.textContent="此資料夾沒有音檔"});function je(){Lt.innerHTML="",T.forEach((i,e)=>{const t=document.createElement("li");e===V&&(t.className="active");const n=document.createElement("span");n.textContent=i.name,n.style.overflow="hidden",n.style.textOverflow="ellipsis",t.appendChild(n);const r=nn(i.name);if(r>0){const o=document.createElement("span");o.className="badge",o.textContent=String(r),t.appendChild(o)}t.addEventListener("click",()=>void ne(e)),Lt.appendChild(t)})}async function ne(i){if(i<0||i>=T.length)return;V=i,U=i,je();const e=T[i];Zt.textContent=e.name,nt.textContent="載入中…";const t=await e.handle.getFile();ke&&URL.revokeObjectURL(ke),ke=URL.createObjectURL(t),await R.load(ke),Ve(),ce(),R.play()}function Ve(){Je.clearRegions(),st(Ue()).filter(e=>e.time!==null).forEach((e,t)=>{Je.addRegion({start:e.time,content:String(t+1),color:Xn(e.character),drag:!1,resize:!1})})}function Yn(i,e){const t=document.createElement("div");t.className="c-rating";for(let n=1;n<=5;n++){const r=document.createElement("button");r.type="button",r.className="c-star"+(n<=i.rating?" filled":""),r.textContent="★",r.title=`${n} 分${i.rating===n?"（再按清除）":""}`,r.addEventListener("click",o=>{o.stopPropagation(),i.rating=i.rating===n?0:n,Z()}),t.appendChild(r)}e.appendChild(t)}function an(i,e={}){const t=document.createElement("div");t.className="citem"+(e.role?" role":"")+(e.focused?" rolefocus":""),e.role&&e.ridx!==void 0&&(t.dataset.ridx=String(e.ridx));let n=t;if(e.role){const d=document.createElement("div");d.className="card-inner";const h=document.createElement("div");h.className="card-main";const m=document.createElement("button");m.className="cplay",m.dataset.cid=i.id,m.textContent=xe===i.id&&R.isPlaying()?"⏸":"▶",m.addEventListener("click",p=>{p.stopPropagation(),cn(i,e.ridx)}),d.append(h,m),t.appendChild(d),n=h}const r=document.createElement("div");r.className="crow";const o=document.createElement("span");if(i.time===null?(o.className="ctime general",o.textContent="整體"):(o.className="ctime",o.textContent=ot(i.time),o.addEventListener("click",d=>{d.stopPropagation(),Ye(i)})),r.appendChild(o),e.role){const d=document.createElement("span");if(d.className="cfile",d.textContent=i.file,e.badge){const h=document.createElement("span");h.className="cfile-badge",h.textContent=e.badge,d.appendChild(h)}d.addEventListener("click",h=>{h.stopPropagation(),Ye(i)}),r.appendChild(d)}const a=document.createElement("span");a.className="cauthor",a.textContent=i.author,r.appendChild(a);const s=document.createElement("button");s.className="cdel",s.textContent="×",s.title="刪除",s.addEventListener("click",d=>{d.stopPropagation(),D=D.filter(h=>h.id!==i.id),Z()}),r.appendChild(s),n.appendChild(r),Yn(i,n);const l=document.createElement("div");l.className="ctext",l.textContent=i.text,l.addEventListener("dblclick",d=>{d.stopPropagation(),l.contentEditable="true",l.focus()}),l.addEventListener("keydown",d=>{d.isComposing||d.key==="Enter"&&!d.shiftKey&&(d.preventDefault(),l.blur())}),l.addEventListener("blur",()=>{l.contentEditable="false";const d=(l.innerText??"").trim();d?(i.text=d,Z()):l.textContent=i.text}),n.appendChild(l);const c=document.createElement("div");if(c.className="ctag-row",Zn(i,c),n.appendChild(c),i.replies.length){const d=document.createElement("div");d.className="creplies",i.replies.forEach(h=>{const m=document.createElement("div");m.className="creply";const p=document.createElement("span");p.className="crauthor",p.textContent=h.author+"：";const f=document.createElement("span");f.textContent=h.text;const g=document.createElement("button");g.className="crdel",g.textContent="×",g.addEventListener("click",v=>{v.stopPropagation(),i.replies=i.replies.filter(w=>w.id!==h.id),Z()}),m.append(p,f,g),d.appendChild(m)}),n.appendChild(d)}const u=document.createElement("div");if(u.className="creply-input",Y===i.id){const d=document.createElement("input");d.type="text",d.placeholder="回覆…（Enter 送出 / Esc 取消）",d.addEventListener("keydown",m=>{m.stopPropagation(),!m.isComposing&&(m.key==="Enter"?(m.preventDefault(),Nt(i,d.value)):m.key==="Escape"&&(m.preventDefault(),Y=null,Q()))});const h=document.createElement("button");h.textContent="送出",h.addEventListener("click",m=>{m.stopPropagation(),Nt(i,d.value)}),u.append(d,h)}else{const d=document.createElement("button");d.className="creply-toggle",d.textContent="＋ 回覆",d.addEventListener("click",h=>{if(h.stopPropagation(),!te){Xe(()=>{Y=i.id,Q()});return}Y=i.id,Q()}),u.appendChild(d)}return n.appendChild(u),t}function Zn(i,e){if(fe===i.id){const t=document.createElement("div");t.className="char-picker",dn(t,i.character,r=>{at(i.character,r),Z()});const n=document.createElement("button");n.type="button",n.className="charchip done",n.textContent="完成",n.addEventListener("click",r=>{r.stopPropagation(),fe=null,Q()}),t.appendChild(n),e.appendChild(t)}else if(i.character.length>0)i.character.forEach(t=>{const n=document.createElement("span");n.className="ctag",n.style.background=Kt(t,N)??"#3b82f6",n.textContent=t,n.addEventListener("click",r=>{r.stopPropagation(),fe=i.id,Q()}),e.appendChild(n)});else{const t=document.createElement("span");t.className="ctag empty",t.textContent="＋ 角色",t.addEventListener("click",n=>{n.stopPropagation(),fe=i.id,Q()}),e.appendChild(t)}}function ce(){const i=Vn();Fn.textContent=i?`留言 · ${i}`:"留言",ze.innerHTML="";const e=st(i);if(e.length===0){const t=document.createElement("li");t.style.color="var(--muted)",t.style.fontSize="13px",t.textContent=i?"尚無留言。播放時按 C 新增。":"尚未選擇檔案。",ze.appendChild(t);return}e.forEach(t=>ze.appendChild(an(t)))}function sn(i,e){const t=[...i];return e==="rating"?t.sort((n,r)=>r.rating-n.rating||n.file.localeCompare(r.file,"zh-Hant",{numeric:!0})||(n.time??-1/0)-(r.time??-1/0)):e==="file"?t.sort((n,r)=>n.file.localeCompare(r.file,"zh-Hant",{numeric:!0})||(n.time??-1/0)-(r.time??-1/0)):t.sort((n,r)=>n.author.localeCompare(r.author,"zh-Hant")||n.file.localeCompare(r.file,"zh-Hant",{numeric:!0})||(n.time??-1/0)-(r.time??-1/0)),t}function Qn(i){let e=D.filter(t=>t.character.includes(i));return J==="hide"?e=e.filter(t=>t.rating>0):J==="solo"&&(e=e.filter(t=>t.rating===0)),sn(e,Me)}function le(){F.innerHTML="",B=[],F.classList.toggle("role-compact",ue);const i=document.createElement("div");i.className="role-head";const e=document.createElement("h2");e.textContent="角色 Dashboard";const t=document.createElement("button");t.className="ghost",t.textContent="返回單檔",t.addEventListener("click",()=>G("single"));const n=document.createElement("span");n.className="role-hint",n.textContent="↑↓ 移動 · 空白鍵 就地播放 · Enter 進單檔 · Tab/Esc 返回";const r=document.createElement("div");r.className="role-sort-toggle",["rating","file","user"].forEach(f=>{const g=f==="rating"?"評分":f==="file"?"檔案":"使用者",v=document.createElement("button");v.className="role-sort-btn"+(Me===f?" active":""),v.textContent=g,v.addEventListener("click",()=>{Me=f,le()}),r.appendChild(v)});const o=document.createElement("button");o.className="role-compact-btn"+(ue?" active":""),o.textContent="簡潔",o.title="隱藏回覆與角色標籤，雙欄顯示",o.addEventListener("click",()=>{ue=!ue,F.classList.toggle("role-compact",ue),o.classList.toggle("active",ue)});const a={all:"hide",hide:"solo",solo:"all"},s={all:"點擊隱藏 0 分評論",hide:"0 分已隱藏 · 再按 Solo",solo:"Solo 0 分 · 再按恢復"},l=document.createElement("button");l.className="role-zero-btn"+(J!=="all"?" "+J:""),l.textContent="👎",l.title=s[J],l.addEventListener("click",()=>{J=a[J],le()}),i.append(e,t,n,r,o,l),F.appendChild(i);const c=["lead","mascot","supporting"],u=D.filter(f=>f.character.length===0).length,d=document.createElement("div");d.className="role-stats-wrap";let h=null;if(c.forEach(f=>{const g=N.filter(S=>S.role===f);if(g.length===0)return;const v=document.createElement("div");v.className="role-stats-row",f==="supporting"&&(h=v);const w=document.createElement("span");w.className="role-stats-type",w.textContent=qt[f],w.style.color=j[f],v.appendChild(w),g.forEach(S=>{const L=D.filter(x=>x.character.includes(S.name)).length,C=document.createElement("button");C.className="role-stat"+(L===0?" zero":""),C.style.background=j[S.role],C.textContent=`${S.name} ${L}`,C.addEventListener("click",()=>{var x;(x=F.querySelector(`[data-char="${S.name}"]`))==null||x.scrollIntoView({behavior:"smooth",block:"start"})}),v.appendChild(C)}),d.appendChild(v)}),u>0){const f=document.createElement("button");if(f.className="role-stat",f.style.background="#64748b",f.textContent=`未指定 ${u}`,f.addEventListener("click",()=>{var g;(g=F.querySelector('[data-char="__none__"]'))==null||g.scrollIntoView({behavior:"smooth",block:"start"})}),h)h.appendChild(f);else{const g=document.createElement("div");g.className="role-stats-row",g.appendChild(f),d.appendChild(g)}}F.appendChild(d);const m=(f,g,v)=>{if(v.length===0)return;const w=document.createElement("div");w.className="role-group",w.dataset.char=f;const S=document.createElement("div");S.className="role-group-label",S.style.background=g,S.textContent=f==="__none__"?"未指定":f,w.appendChild(S);const L=document.createElement("div");L.className="role-group-cards-wrap";const C=v.reduce((x,P)=>Math.max(x,P.rating),0);v.forEach(x=>{const P=B.length,b=x.rating===0?"👎":x.rating===C?"🏆":void 0;L.appendChild(an(x,{role:!0,ridx:P,focused:P===W,badge:b})),B.push(x)}),w.appendChild(L),F.appendChild(w)};N.forEach(f=>m(f.name,j[f.role],Qn(f.name)));let p=D.filter(f=>f.character.length===0);if(J==="hide"?p=p.filter(f=>f.rating>0):J==="solo"&&(p=p.filter(f=>f.rating===0)),m("__none__","#64748b",sn(p,Me)),B.length===0){const f=document.createElement("div");f.style.color="var(--muted)",f.textContent="尚無留言。",F.appendChild(f)}W>=B.length&&(W=Math.max(0,B.length-1))}function we(){F.querySelectorAll(".cplay").forEach(i=>{i.textContent=xe===i.dataset.cid&&R.isPlaying()?"⏸":"▶"})}function ln(){F.querySelectorAll(".citem").forEach(i=>{const e=i.dataset.ridx===String(W);i.classList.toggle("rolefocus",e),e&&i.scrollIntoView({block:"nearest"})})}function Mt(i){B.length!==0&&(W=Math.min(Math.max(0,W+i),B.length-1),ln())}async function ei(i,e){const t=T.findIndex(r=>r.name===i.file);if(t<0)return;t!==V&&await ne(t),R.setTime(i.time??0),R.play(),xe=i.id;const n=e!==void 0?e:B.indexOf(i);n>=0&&(W=n,ln()),we()}function cn(i,e){if(xe===i.id&&R.isPlaying()){R.pause(),we();return}ei(i,e)}async function Ye(i){const e=T.findIndex(t=>t.name===i.file);e<0||(H!=="single"&&G("single"),e!==V&&await ne(e),i.time!==null&&R.setTime(i.time),R.play())}function dn(i,e,t,n){i.innerHTML="",N.forEach((r,o)=>{const a=document.createElement("button");a.type="button",a.className="charchip"+(o===n?" focused":""),a.textContent=r.name,a.style.borderColor=j[r.role],e.includes(r.name)&&(a.style.background=j[r.role],a.style.color="#fff"),a.addEventListener("click",s=>{s.stopPropagation(),t(r.name)}),i.appendChild(a)})}function Nt(i,e){const t=e.trim();if(!t){Y=null,Q();return}const n=()=>{i.replies.push({id:tn(),author:te,text:t,created:Date.now()}),Y=null,Z()};te?n():Xe(n)}function ti(){if(!(V<0)){if(!te){Xe(()=>Tt());return}Tt()}}function Tt(){R.pause(),tt=R.getCurrentTime(),ae=!0,ge.value="",se=[],oe=0,_="text",$(),it.classList.remove("hidden"),ge.focus()}function un(){it.classList.add("hidden"),_="text"}function lt(){St.innerHTML="";for(let i=1;i<=5;i++){const e=document.createElement("button");e.type="button",e.className="c-star"+(i<=oe?" filled":""),e.textContent="★",e.title=`${i} 分`,e.addEventListener("click",t=>{t.stopPropagation(),oe=oe===i?0:i,lt()}),St.appendChild(e)}}function $(){ni(),hn(),lt()}function ni(){ae?(he.textContent=`對應秒數 ${ot(tt)}`,he.classList.remove("off")):(he.textContent="整體留言（不對應秒數）",he.classList.add("off")),he.classList.toggle("focused",_==="toggle")}function hn(){dn(Qt,se,e=>{at(se,e),hn()},typeof _=="number"?_:void 0)}function zt(){const i=ge.value.trim();if(un(),!i)return;const e=Ue();e&&(D.push({id:tn(),file:e,time:ae?tt:null,text:i,author:te,character:[...se],replies:[],rating:oe}),Z())}function Ot(){_="toggle",ge.blur(),$()}function _t(){_="text",$(),ge.focus()}function ii(){if(N.length===0)return;const i=se.length?N.findIndex(e=>e.name===se[0]):-1;_=i>=0?i:0,ge.blur(),$()}function ri(i){at(se,N[i].name),$()}function Le(i,e){const t=Array.from(Qt.children);if(t.length===0)return i;const n=t.map(u=>u.getBoundingClientRect()),r=n[i],o=r.left+r.width/2,a=r.top+r.height/2,s=r.height/2;if(e==="left"||e==="right"){let u=-1,d=1/0;return n.forEach((h,m)=>{if(m===i||Math.abs(h.top+h.height/2-a)>s)return;const p=h.left+h.width/2;e==="left"&&p<o&&o-p<d&&(d=o-p,u=m),e==="right"&&p>o&&p-o<d&&(d=p-o,u=m)}),u>=0?u:i}let l=-1,c=1/0;return n.forEach((u,d)=>{if(d===i)return;const h=u.top+u.height/2;if(!(e==="up"?h<a-s:h>a+s))return;const p=Math.abs(h-a)*1e3+Math.abs(u.left+u.width/2-o);p<c&&(c=p,l=d)}),e==="up"&&l<0?"toggle":l>=0?l:i}function oi(i){if(i.isComposing)return;if(i.shiftKey&&/^Digit[0-5]$/.test(i.code)){i.preventDefault();const t=parseInt(i.code[5]);oe=oe===t?0:t,lt();return}if(i.code==="Escape"){i.preventDefault(),un();return}if(_==="text"){if(Ge(i)&&!i.shiftKey){i.preventDefault(),zt();return}if(i.code==="ArrowDown"||i.code==="Tab"){i.preventDefault(),Ot();return}return}if(Ge(i)){i.preventDefault(),zt();return}if(_==="toggle"){switch(i.code){case"Space":i.preventDefault(),ae=!ae,$();break;case"ArrowUp":i.preventDefault(),_t();break;case"ArrowDown":case"Tab":i.preventDefault(),ii();break}return}const e=_;switch(i.code){case"Space":i.preventDefault(),ri(e);break;case"ArrowRight":{i.preventDefault();const t=Le(e,"right");typeof t=="number"&&(_=t,$());break}case"ArrowLeft":{i.preventDefault();const t=Le(e,"left");typeof t=="number"&&(_=t,$());break}case"ArrowDown":{i.preventDefault();const t=Le(e,"down");typeof t=="number"&&(_=t,$());break}case"ArrowUp":{i.preventDefault();const t=Le(e,"up");t==="toggle"?Ot():(_=t,$());break}case"Tab":i.preventDefault(),_t();break}}he.addEventListener("click",()=>{ae=!ae,$()});function Xe(i){Ie=i,Be.value=te,$e.classList.remove("hidden"),Be.focus()}function ai(){const i=Be.value.trim();if(!i)return;te=i,Dn(i),$e.classList.add("hidden");const e=Ie;Ie=null,e&&e()}Be.addEventListener("keydown",i=>{i.stopPropagation(),!i.isComposing&&(i.key==="Enter"?(i.preventDefault(),ai()):i.key==="Escape"&&(i.preventDefault(),$e.classList.add("hidden"),Ie=null))});Ct.addEventListener("click",()=>{Ct.blur(),be(),rt.classList.remove("hidden")});function be(){Rt.innerHTML="",N.forEach((i,e)=>{const t=document.createElement("li"),n=document.createElement("span");n.className="dot",n.style.background=j[i.role];const r=document.createElement("span");r.textContent=i.name,r.title="雙擊重命名",r.style.cursor="pointer",r.addEventListener("dblclick",()=>{const s=document.createElement("input");s.type="text",s.value=i.name,s.style.cssText="font-size:13px;width:120px;padding:2px 6px",t.replaceChild(s,r),s.focus(),s.select();const l=()=>{const c=s.value.trim();if(c&&c!==i.name){const u=i.name;i.name=c,D.forEach(d=>{const h=d.character.indexOf(u);h>=0&&(d.character[h]=c)}),Oe(N),rn()}be()};s.addEventListener("keydown",c=>{c.stopPropagation(),c.key==="Enter"?(c.preventDefault(),l()):c.key==="Escape"&&(c.preventDefault(),be())}),s.addEventListener("blur",l)});const o=document.createElement("span");o.className="role",o.textContent=qt[i.role];const a=document.createElement("button");a.className="rm",a.textContent="刪除",a.addEventListener("click",()=>{N.splice(e,1),Oe(N),be()}),t.append(n,r,o,a),Rt.appendChild(t)})}en.addEventListener("click",()=>{const i=Ke.value.trim();i&&(N.push({name:i,role:$n.value}),Oe(N),Ke.value="",be())});Ke.addEventListener("keydown",i=>{i.stopPropagation(),!i.isComposing&&i.key==="Enter"&&(i.preventDefault(),en.click())});Un.addEventListener("click",()=>{rt.classList.add("hidden"),Ve(),ce(),H==="role"&&le()});function It(i){const e=R.getDuration();!isFinite(e)||e===0||R.setTime(Math.min(Math.max(0,R.getCurrentTime()+i),e))}function At(i){const e=st(Ue()).filter(r=>r.time!==null).map(r=>r.time);if(e.length===0)return;const t=R.getCurrentTime();let n;if(i<0){for(let r=e.length-1;r>=0;r--)if(e[r]<t-_n){n=e[r];break}n??(n=e[0])}else{for(let r=0;r<e.length;r++)if(e[r]>t+In){n=e[r];break}n??(n=e[e.length-1])}R.setTime(n)}function G(i){H=i;const e=i==="single",t=i==="grid",n=i==="role";(t||n)&&R.pause(),Bn.classList.toggle("hidden",!e),Wn.classList.toggle("hidden",!e),Te.classList.toggle("hidden",!t),F.classList.toggle("hidden",!n),Hn.classList.toggle("hidden",n),t&&pn(),n&&(W=0,le()),ce()}function pn(){Te.innerHTML="";const i=document.createElement("div");i.className="gridhint",i.textContent="WASD／方向鍵 移動 · 空白鍵或 Enter 開啟 · Tab 返回單檔",Te.appendChild(i),T.forEach((e,t)=>{const n=document.createElement("div");n.className="gridcard"+(t===U?" selected":""),n.innerHTML=`<div class="gc-name">${me(e.name)}</div><div class="gc-meta">${nn(e.name)} 則留言</div>`,n.addEventListener("click",()=>{U=t,G("single"),ne(t)}),Te.appendChild(n)})}function Se(i){const e=T.length;e!==0&&(U=Math.min(Math.max(0,U+i),e-1),pn(),ce())}function si(){const i=document.activeElement;return i?i.tagName==="INPUT"||i.tagName==="TEXTAREA"||i.isContentEditable:!1}function li(){return!$e.classList.contains("hidden")||!rt.classList.contains("hidden")}document.addEventListener("keydown",i=>{if(!it.classList.contains("hidden")){oi(i);return}if(!i.isComposing){if(fe!==null&&i.code==="Escape"){i.preventDefault(),fe=null,Q();return}if(Y!==null&&i.code==="Escape"){i.preventDefault(),Y=null,Q();return}if(!(li()||si())){if(H==="role"){if(i.shiftKey&&/^Digit[0-5]$/.test(i.code)){i.preventDefault();const e=parseInt(i.code[5]),t=B[W];t&&(t.rating=t.rating===e?0:e,Z());return}if(i.code==="Tab"||i.code==="Escape"){i.preventDefault(),G("single");return}switch(i.code){case"ArrowUp":case"KeyW":i.preventDefault(),Mt(-1);break;case"ArrowDown":case"KeyS":i.preventDefault(),Mt(1);break;case"Space":i.preventDefault(),B[W]&&cn(B[W],W);break;case"Enter":case"NumpadEnter":i.preventDefault(),B[W]&&Ye(B[W]);break}return}if(H==="grid"){if(Ge(i)){i.preventDefault(),G("single"),ne(U);return}switch(i.code){case"KeyA":case"ArrowLeft":i.preventDefault(),Se(-1);break;case"KeyD":case"ArrowRight":i.preventDefault(),Se(1);break;case"KeyW":case"ArrowUp":i.preventDefault(),Se(-bt);break;case"KeyS":case"ArrowDown":i.preventDefault(),Se(bt);break;case"Space":i.preventDefault(),G("single"),ne(U);break;case"Tab":i.preventDefault(),G("single");break}return}switch(i.code){case"Space":i.preventDefault(),R.playPause();break;case"KeyA":case"ArrowLeft":i.preventDefault(),It(-5);break;case"KeyD":case"ArrowRight":i.preventDefault(),It(5);break;case"KeyW":case"ArrowUp":i.preventDefault(),At(-1);break;case"KeyS":case"ArrowDown":i.preventDefault(),At(1);break;case"KeyC":case"KeyX":i.preventDefault(),ti();break;case"Tab":i.preventDefault(),T.length&&G("grid");break}}}});function ci(){let i="";const e=(o,a)=>a.rating-o.rating||o.file.localeCompare(a.file,"zh-Hant",{numeric:!0})||(o.time??-1/0)-(a.time??-1/0),t=(o,a,s)=>{if(s.length===0)return;const l=s.map(c=>{const u=c.rating>0?"★".repeat(c.rating)+"☆".repeat(5-c.rating):"",d=c.time!==null?ot(c.time):"整體";return`<tr>
        <td class="tc">${me(d)}</td>
        <td class="fn">${me(c.file)}</td>
        <td class="cm">${me(c.text)}</td>
        <td class="sr">${u}</td>
        <td class="au">${me(c.author)}</td>
      </tr>`}).join("");i+=`<div class="section">
  <div class="slabel" style="background:${a}">${me(o==="__none__"?"未指定":o)}</div>
  <table><thead><tr>
    <th class="tc">時間</th><th class="fn">音檔</th><th class="cm">評語</th><th class="sr">評分</th><th class="au">留言者</th>
  </tr></thead><tbody>${l}</tbody></table>
</div>`};N.forEach(o=>t(o.name,j[o.role],D.filter(a=>a.character.includes(o.name)).sort(e))),t("__none__","#64748b",D.filter(o=>o.character.length===0).sort(e));const n=`<!DOCTYPE html>
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
<div class="sub">產出時間：${new Date().toLocaleString("zh-Hant")} · 共 ${D.length} 則留言</div>
${i||'<p style="color:#9ca3af">尚無留言</p>'}
</body></html>`,r=window.open("","_blank","width=900,height=800");if(!r){alert("請允許開啟新分頁（檢查彈出視窗封鎖設定）");return}r.document.write(n),r.document.close(),setTimeout(()=>r.print(),600)}Dt.addEventListener("click",()=>{Dt.blur(),ci()});const di=1e4;function ui(i){const e=new Set(D.map(n=>n.id)),t=i.map(Fe).filter(n=>!e.has(n.id));return t.length===0?0:(D=[...D,...t],t.length)}function hi(){Bt(),Pe=window.setInterval(async()=>{if(!X){Bt();return}try{const e=await(await X.getFileHandle(et)).getFile(),t=JSON.parse(await e.text());if(!Array.isArray(t==null?void 0:t.comments))return;const n=ui(t.comments);_e=Date.now(),mn(),n>0&&(Qe(D),Ve(),je(),ce(),H==="role"&&le(),pi(`已同步 ${n} 則新留言`))}catch{}},di)}function Bt(){Pe!==void 0&&(window.clearInterval(Pe),Pe=void 0)}function mn(){const i=document.getElementById("syncStatus");if(!i)return;if(!X){i.textContent="";return}const e=_e?new Date(_e).toLocaleTimeString("zh-Hant",{hour:"2-digit",minute:"2-digit",second:"2-digit"}):"—";i.textContent=`↺ 協作同步中 · ${e}`}let Wt;function pi(i){const e=document.getElementById("syncToast");e&&(e.textContent=i,e.classList.remove("hidden"),window.clearTimeout(Wt),Wt=window.setTimeout(()=>e.classList.add("hidden"),3e3))}function mi(){const i=l=>JSON.stringify(l).replace(/</g,"\\u003c").replace(/>/g,"\\u003e").replace(/&/g,"\\u0026"),e=Tn.replace("{{DATA_JSON}}",()=>i({comments:D,characters:N,roleColors:j})),t=new Blob([e],{type:"text/html;charset=utf-8"}),n=URL.createObjectURL(t),r=new Date,o=l=>String(l).padStart(2,"0"),a=`${r.getFullYear()}${o(r.getMonth()+1)}${o(r.getDate())}-${o(r.getHours())}${o(r.getMinutes())}`,s=document.createElement("a");s.href=n,s.download=`voicepicker-share-${a}.html`,s.click(),URL.revokeObjectURL(n)}async function fi(){if(T.length===0){alert("請先選擇音檔資料夾後再匯出外部分享版。");return}const i=new Set(D.map(d=>d.file)),e=T.filter(d=>i.has(d.name));if(e.length===0){alert("目前沒有任何留言，無法產生分享版。");return}pe.disabled=!0,pe.textContent=`處理中 0/${e.length}…`;const t={};for(let d=0;d<e.length;d++){const h=e[d];pe.textContent=`處理中 ${d+1}/${e.length}…`;try{const m=await h.handle.getFile(),p=await new Promise((f,g)=>{const v=new FileReader;v.onload=()=>f(v.result),v.onerror=g,v.readAsDataURL(m)});t[h.name]=p}catch{}}pe.disabled=!1,pe.textContent="匯出";const n=d=>JSON.stringify(d).replace(/</g,"\\u003c").replace(/>/g,"\\u003e").replace(/&/g,"\\u0026"),r=zn.replace("{{DATA_JSON}}",()=>n({comments:D,characters:N,roleColors:j})).replace("{{AUDIO_JSON}}",()=>n(t)),o=new Blob([r],{type:"text/html;charset=utf-8"}),a=URL.createObjectURL(o),s=new Date,l=d=>String(d).padStart(2,"0"),c=`${s.getFullYear()}${l(s.getMonth()+1)}${l(s.getDate())}-${l(s.getHours())}${l(s.getMinutes())}`,u=document.createElement("a");u.href=a,u.download=`voicepicker-external-${c}.html`,u.click(),URL.revokeObjectURL(a)}Pt.addEventListener("click",()=>{Pt.blur(),We.classList.remove("hidden")});jn.addEventListener("click",()=>We.classList.add("hidden"));pe.addEventListener("click",()=>{var e;const i=(e=We.querySelector('input[name="shareMode"]:checked'))==null?void 0:e.value;We.classList.add("hidden"),i==="external"?fi():mi()});kt.addEventListener("click",()=>{kt.blur(),G("role")});An.textContent="v0.9.2";te||Xe(null);
