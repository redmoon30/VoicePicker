(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();function A(i,e,t,n){return new(t||(t=Promise))(function(r,s){function o(c){try{l(n.next(c))}catch(h){s(h)}}function a(c){try{l(n.throw(c))}catch(h){s(h)}}function l(c){var h;c.done?r(c.value):(h=c.value,h instanceof t?h:new t(function(d){d(h)})).then(o,a)}l((n=n.apply(i,e||[])).next())})}let be=class{constructor(){this.listeners={}}on(e,t,n){if(this.listeners[e]||(this.listeners[e]=new Set),n==null?void 0:n.once){const r=(...s)=>{this.un(e,r),t(...s)};return this.listeners[e].add(r),()=>this.un(e,r)}return this.listeners[e].add(t),()=>this.un(e,t)}un(e,t){var n;(n=this.listeners[e])===null||n===void 0||n.delete(t)}once(e,t){return this.on(e,t,{once:!0})}unAll(){this.listeners={}}emit(e,...t){this.listeners[e]&&this.listeners[e].forEach(n=>n(...t))}};const xe={decode:function(i,e){return A(this,void 0,void 0,function*(){const t=new AudioContext({sampleRate:e});try{return yield t.decodeAudioData(i)}finally{t.close()}})},createBuffer:function(i,e){if(!i||i.length===0)throw new Error("channelData must be a non-empty array");if(e<=0)throw new Error("duration must be greater than 0");if(typeof i[0]=="number"&&(i=[i]),!i[0]||i[0].length===0)throw new Error("channelData must contain non-empty channel arrays");(function(n){const r=n[0];if(r.some(s=>s>1||s<-1)){const s=r.length;let o=0;for(let a=0;a<s;a++){const l=Math.abs(r[a]);l>o&&(o=l)}for(const a of n)for(let l=0;l<s;l++)a[l]/=o}})(i);const t=i.map(n=>n instanceof Float32Array?n:Float32Array.from(n));return{duration:e,length:t[0].length,sampleRate:t[0].length/e,numberOfChannels:t.length,getChannelData:n=>{const r=t[n];if(!r)throw new Error(`Channel ${n} not found`);return r},copyFromChannel:AudioBuffer.prototype.copyFromChannel,copyToChannel:AudioBuffer.prototype.copyToChannel}}};function Bt(i,e){const t=e.xmlns?document.createElementNS(e.xmlns,i):document.createElement(i);for(const[n,r]of Object.entries(e))if(n==="children"&&r)for(const[s,o]of Object.entries(r))o instanceof Node?t.appendChild(o):typeof o=="string"?t.appendChild(document.createTextNode(o)):t.appendChild(Bt(s,o));else n==="style"?Object.assign(t.style,r):n==="textContent"?t.textContent=r:t.setAttribute(n,r.toString());return t}function dt(i,e,t){const n=Bt(i,e||{});return t==null||t.appendChild(n),n}function Wt(i){return i instanceof HTMLElement||typeof i=="object"&&i!==null&&i.nodeType===Node.ELEMENT_NODE&&typeof i.style=="object"}var fn=Object.freeze({__proto__:null,createElement:dt,default:dt,isHTMLElement:Wt});const gn={fetchBlob:function(i,e,t){return A(this,void 0,void 0,function*(){var n;const r=yield fetch(i,t);if(r.status>=400)throw new Error(`Failed to fetch ${i}: ${r.status} (${r.statusText})`);return function(s,o,a){A(this,void 0,void 0,function*(){var l;if(!s.body||!s.headers)return;const c=s.body.getReader(),h=Number(s.headers.get("Content-Length"))||0;let d=0;const u=()=>{c.cancel()};if(a){if(a.aborted)return void c.cancel();a.addEventListener("abort",u,{once:!0})}try{for(;;){const p=yield c.read();if(p.done)break;if(d+=((l=p.value)===null||l===void 0?void 0:l.length)||0,h>0){const m=Math.round(d/h*100);o(m)}}}catch(p){if(p instanceof DOMException&&p.name==="AbortError")return;console.warn("Progress tracking error:",p)}finally{a&&a.removeEventListener("abort",u)}})}(r.clone(),e,(n=t==null?void 0:t.signal)!==null&&n!==void 0?n:void 0),r.blob()})}};function M(i){let e=i;const t=new Set;return{get value(){return e},set(n){Object.is(e,n)||(e=n,t.forEach(r=>r(e)))},update(n){this.set(n(e))},subscribe:n=>(t.add(n),()=>t.delete(n))}}function ie(i,e){const t=M(i());return e.forEach(n=>n.subscribe(()=>{const r=i();Object.is(t.value,r)||t.set(r)})),{get value(){return t.value},subscribe:n=>t.subscribe(n)}}function q(i,e){let t;const n=()=>{t&&(t(),t=void 0),t=i()},r=e.map(s=>s.subscribe(n));return n(),()=>{t&&(t(),t=void 0),r.forEach(s=>s())}}class vn extends be{get isPlayingSignal(){return this._isPlaying}get currentTimeSignal(){return this._currentTime}get durationSignal(){return this._duration}get volumeSignal(){return this._volume}get mutedSignal(){return this._muted}get playbackRateSignal(){return this._playbackRate}get seekingSignal(){return this._seeking}constructor(e){super(),this.isExternalMedia=!1,this._ownBlobUrl=null,this.reactiveMediaEventCleanups=[],e.media?(this.media=e.media,this.isExternalMedia=!0):this.media=document.createElement("audio"),this._isPlaying=M(!1),this._currentTime=M(0),this._duration=M(0),this._volume=M(this.media.volume),this._muted=M(this.media.muted),this._playbackRate=M(this.media.playbackRate||1),this._seeking=M(!1),this.setupReactiveMediaEvents(),e.mediaControls&&(this.media.controls=!0),e.autoplay&&(this.media.autoplay=!0),e.playbackRate!=null&&this.onMediaEvent("canplay",()=>{e.playbackRate!=null&&(this.media.playbackRate=e.playbackRate)},{once:!0})}setupReactiveMediaEvents(){this.reactiveMediaEventCleanups.push(this.onMediaEvent("play",()=>{this._isPlaying.set(!0)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("pause",()=>{this._isPlaying.set(!1)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("ended",()=>{this._isPlaying.set(!1)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("timeupdate",()=>{this._currentTime.set(this.media.currentTime)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("durationchange",()=>{this._duration.set(this.media.duration||0)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("loadedmetadata",()=>{this._duration.set(this.media.duration||0)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("seeking",()=>{this._seeking.set(!0)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("seeked",()=>{this._seeking.set(!1)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("volumechange",()=>{this._volume.set(this.media.volume),this._muted.set(this.media.muted)})),this.reactiveMediaEventCleanups.push(this.onMediaEvent("ratechange",()=>{this._playbackRate.set(this.media.playbackRate)}))}onMediaEvent(e,t,n){return this.media.addEventListener(e,t,n),()=>this.media.removeEventListener(e,t,n)}getSrc(){return this.media.currentSrc||this.media.src||""}revokeSrc(){this._ownBlobUrl&&(URL.revokeObjectURL(this._ownBlobUrl),this._ownBlobUrl=null)}canPlayType(e){return this.media.canPlayType(e)!==""}setSrc(e,t){const n=this.getSrc();if(e&&n===e)return;this.revokeSrc();const r=t instanceof Blob&&(this.canPlayType(t.type)||!e)?URL.createObjectURL(t):e;if(r!==e&&(this._ownBlobUrl=r),n&&this.media.removeAttribute("src"),r||e)try{this.media.src=r}catch{this.media.src=e}}destroy(){this.reactiveMediaEventCleanups.forEach(e=>e()),this.reactiveMediaEventCleanups=[],this.revokeSrc(),this.unAll(),this.isExternalMedia||(this.media.pause(),this.media.removeAttribute("src"),this.media.load(),this.media.remove())}setMediaElement(e){this.reactiveMediaEventCleanups.forEach(t=>t()),this.reactiveMediaEventCleanups=[],this.media=e,this.setupReactiveMediaEvents()}play(){return A(this,void 0,void 0,function*(){try{return yield this.media.play()}catch(e){if(e instanceof DOMException&&e.name==="AbortError")return;throw e}})}pause(){this.media.pause()}isPlaying(){return!this.media.paused&&!this.media.ended}setTime(e){this.media.currentTime=Math.max(0,Math.min(e,this.getDuration()))}getDuration(){return this.media.duration}getCurrentTime(){return this.media.currentTime}getVolume(){return this.media.volume}setVolume(e){this.media.volume=e}getMuted(){return this.media.muted}setMuted(e){this.media.muted=e}getPlaybackRate(){return this.media.playbackRate}isSeeking(){return this.media.seeking}setPlaybackRate(e,t){t!=null&&(this.media.preservesPitch=t),this.media.playbackRate=e}getMediaElement(){return this.media}setSinkId(e){return this.media.setSinkId(e)}}function bn({maxTop:i,maxBottom:e,halfHeight:t,vScale:n,barMinHeight:r=0,barAlign:s}){let o=Math.round(i*t*n),a=o+Math.round(e*t*n)||1;return a<r&&(a=r,s||(o=a/2)),{topHeight:o,totalHeight:a}}function yn({barAlign:i,halfHeight:e,topHeight:t,totalHeight:n,canvasHeight:r}){return i==="top"?0:i==="bottom"?r-n:e-t}function ht(i,e,t){const n=e-i.left,r=t-i.top;return[n/i.width,r/i.height]}function Ht(i){return!!(i.barWidth||i.barGap||i.barAlign)}function ut(i,e){if(!Ht(e))return i;const t=e.barWidth||.5,n=t+(e.barGap||t/2);return n===0?i:Math.floor(i/n)*n}function pt({scrollLeft:i,totalWidth:e,numCanvases:t}){if(e===0)return[0];const n=i/e,r=Math.floor(n*t);return[r-1,r,r+1]}function $t(i){const e=i._cleanup;typeof e=="function"&&e()}function En(i){const e=M({scrollLeft:i.scrollLeft,scrollWidth:i.scrollWidth,clientWidth:i.clientWidth}),t=ie(()=>function(s){const{scrollLeft:o,scrollWidth:a,clientWidth:l}=s;if(a===0)return{startX:0,endX:1};const c=o/a,h=(o+l)/a;return{startX:Math.max(0,Math.min(1,c)),endX:Math.max(0,Math.min(1,h))}}(e.value),[e]),n=ie(()=>function(s){return{left:s.scrollLeft,right:s.scrollLeft+s.clientWidth}}(e.value),[e]),r=()=>{e.set({scrollLeft:i.scrollLeft,scrollWidth:i.scrollWidth,clientWidth:i.clientWidth})};return i.addEventListener("scroll",r,{passive:!0}),{scrollData:e,percentages:t,bounds:n,cleanup:()=>{i.removeEventListener("scroll",r),$t(e)}}}class xn extends be{constructor(e,t){super(),this.timeouts=[],this.isScrollable=!1,this.audioData=null,this.resizeObserver=null,this.lastContainerWidth=0,this.isDragging=!1,this.subscriptions=[],this.unsubscribeOnScroll=[],this.dragStream=null,this.scrollStream=null,this.containerInlinePadding=0,this.onClickWrapper=o=>{const a=this.wrapper.getBoundingClientRect(),[l,c]=ht(a,o.clientX,o.clientY);this.emit("click",l,c)},this.onDblClickWrapper=o=>{const a=this.wrapper.getBoundingClientRect(),[l,c]=ht(a,o.clientX,o.clientY);this.emit("dblclick",l,c)},this.subscriptions=[],this.options=e;const n=this.parentFromOptionsContainer(e.container);this.parent=n;const[r,s]=this.initHtml();n.appendChild(r),this.container=r,this.scrollContainer=s.querySelector(".scroll"),this.wrapper=s.querySelector(".wrapper"),this.canvasWrapper=s.querySelector(".canvases"),this.progressWrapper=s.querySelector(".progress"),this.cursor=s.querySelector(".cursor"),this.calculateInlinePadding(),t&&s.appendChild(t),this.initEvents()}parentFromOptionsContainer(e){let t;if(typeof e=="string"?t=document.querySelector(e):Wt(e)&&(t=e),!t)throw new Error("Container not found");return t}initEvents(){this.wrapper.addEventListener("click",this.onClickWrapper),this.wrapper.addEventListener("dblclick",this.onDblClickWrapper),this.options.dragToSeek!==!0&&typeof this.options.dragToSeek!="object"||this.initDrag(),this.scrollStream=En(this.scrollContainer);const e=q(()=>{const{startX:t,endX:n}=this.scrollStream.percentages.value,{left:r,right:s}=this.scrollStream.bounds.value;this.emit("scroll",t,n,r,s)},[this.scrollStream.percentages,this.scrollStream.bounds]);if(this.subscriptions.push(e),typeof ResizeObserver=="function"){const t=this.createDelay(100);this.resizeObserver=new ResizeObserver(()=>{t().then(()=>this.onContainerResize()).catch(()=>{})}),this.resizeObserver.observe(this.scrollContainer)}}onContainerResize(){const e=this.parent.clientWidth;this.calculateInlinePadding(),e===this.lastContainerWidth&&this.options.height!=="auto"||(this.lastContainerWidth=e,this.reRender(),this.emit("resize"))}initDrag(){if(this.dragStream)return;this.dragStream=function(t,n={}){const{threshold:r=3,mouseButton:s=0,touchDelay:o=100}=n,a=M(null),l=new Map,c=matchMedia("(pointer: coarse)").matches;let h=()=>{};const d=u=>{if(u.button!==s||l.has(u.pointerId)||(l.set(u.pointerId,u),l.size>1))return;const p=u.pointerId;let m=u.clientX,g=u.clientY,f=!1;const y=Date.now(),E=t.getBoundingClientRect(),{left:P,top:k}=E,S=v=>{if(v.pointerId!==p||v.defaultPrevented||l.size>1||c&&Date.now()-y<o)return;const z=v.clientX,O=v.clientY,X=z-m,C=O-g;(f||Math.abs(X)>r||Math.abs(C)>r)&&(v.preventDefault(),v.stopPropagation(),f||(a.set({type:"start",x:m-P,y:g-k}),f=!0),a.set({type:"move",x:z-P,y:O-k,deltaX:X,deltaY:C}),m=z,g=O)},D=v=>{if(l.delete(v.pointerId)){if(v.pointerId===p&&f){const z=v.clientX,O=v.clientY;a.set({type:"end",x:z-P,y:O-k})}l.size===0&&h()}},R=v=>{v.relatedTarget&&v.relatedTarget!==document.documentElement||D(v)},x=v=>{f&&(v.stopPropagation(),v.preventDefault())},_=v=>{v.defaultPrevented||l.size>1||f&&v.preventDefault()};document.addEventListener("pointermove",S),document.addEventListener("pointerup",D),document.addEventListener("pointerout",R),document.addEventListener("pointercancel",R),document.addEventListener("touchmove",_,{passive:!1}),document.addEventListener("click",x,{capture:!0}),h=()=>{document.removeEventListener("pointermove",S),document.removeEventListener("pointerup",D),document.removeEventListener("pointerout",R),document.removeEventListener("pointercancel",R),document.removeEventListener("touchmove",_),setTimeout(()=>{document.removeEventListener("click",x,{capture:!0})},10)}};return t.addEventListener("pointerdown",d),{signal:a,cleanup:()=>{h(),t.removeEventListener("pointerdown",d),l.clear(),$t(a)}}}(this.wrapper);const e=q(()=>{const t=this.dragStream.signal.value;if(!t)return;const n=this.wrapper.getBoundingClientRect().width,r=(s=t.x/n)<0?0:s>1?1:s;var s;t.type==="start"?(this.isDragging=!0,this.emit("dragstart",r)):t.type==="move"?this.emit("drag",r):t.type==="end"&&(this.isDragging=!1,this.emit("dragend",r))},[this.dragStream.signal]);this.subscriptions.push(e)}calculateInlinePadding(){const{paddingLeft:e,paddingRight:t}=getComputedStyle(this.scrollContainer),n=parseFloat(e)+parseFloat(t);this.containerInlinePadding=Number.isNaN(n)?0:n}initHtml(){const e=document.createElement("div"),t=e.attachShadow({mode:"open"}),n=this.options.cspNonce&&typeof this.options.cspNonce=="string"?this.options.cspNonce.replace(/"/g,""):"";return t.innerHTML=`
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
    `,[e,t]}setOptions(e){var t;if(this.options.container!==e.container){const n=this.parentFromOptionsContainer(e.container);n.appendChild(this.container),this.parent=n}e.dragToSeek===!0||typeof this.options.dragToSeek=="object"?this.initDrag():((t=this.dragStream)===null||t===void 0||t.cleanup(),this.dragStream=null),this.options=e,this.reRender()}getWrapper(){return this.wrapper}getWidth(){return this.scrollContainer.clientWidth-this.containerInlinePadding}getScroll(){return this.scrollContainer.scrollLeft}setScroll(e){this.scrollContainer.scrollLeft=e}setScrollPercentage(e){const{scrollWidth:t}=this.scrollContainer,n=t*e;this.setScroll(n)}destroy(){var e;this.wrapper.removeEventListener("click",this.onClickWrapper),this.wrapper.removeEventListener("dblclick",this.onDblClickWrapper),this.timeouts.forEach(t=>t()),this.timeouts=[],this.subscriptions.forEach(t=>t()),this.container.remove(),this.resizeObserver&&(this.resizeObserver.disconnect(),this.resizeObserver=null),(e=this.unsubscribeOnScroll)===null||e===void 0||e.forEach(t=>t()),this.unsubscribeOnScroll=[],this.dragStream&&(this.dragStream.cleanup(),this.dragStream=null),this.scrollStream&&(this.scrollStream.cleanup(),this.scrollStream=null)}createDelay(e=10){let t,n;const r=()=>{t&&(clearTimeout(t),t=void 0),n&&(n(),n=void 0)};return this.timeouts.push(r),()=>new Promise((s,o)=>{r(),n=o,t=setTimeout(()=>{t=void 0,n=void 0,s()},e)})}getHeight(e,t){var n;const r=((n=this.audioData)===null||n===void 0?void 0:n.numberOfChannels)||1;return function({optionsHeight:s,optionsSplitChannels:o,parentHeight:a,numberOfChannels:l,defaultHeight:c=128}){if(s==null)return c;const h=Number(s);if(!isNaN(h))return h;if(s==="auto"){const d=a||c;return o!=null&&o.every(u=>!u.overlay)?d/l:d}return c}({optionsHeight:e,optionsSplitChannels:t,parentHeight:this.parent.clientHeight,numberOfChannels:r,defaultHeight:128})}convertColorValues(e,t){return function(n,r,s){if(!Array.isArray(n))return n||"";if(n.length===0)return"#999";if(n.length<2)return n[0]||"";const o=document.createElement("canvas"),a=o.getContext("2d");if(!a)return n[0]||"";const l=s||o.height*r,c=a.createLinearGradient(0,0,0,l),h=1/(n.length-1);return n.forEach((d,u)=>{c.addColorStop(u*h,d)}),c}(e,this.getPixelRatio(),t==null?void 0:t.canvas.height)}getPixelRatio(){return e=window.devicePixelRatio,Math.max(1,e||1);var e}renderBarWaveform(e,t,n,r){const{width:s,height:o}=n.canvas,{halfHeight:a,barWidth:l,barRadius:c,barIndexScale:h,barSpacing:d,barMinHeight:u}=function({width:m,height:g,length:f,options:y,pixelRatio:E}){const P=g/2,k=y.barWidth?y.barWidth*E:1,S=y.barGap?y.barGap*E:y.barWidth?k/2:0,D=k+S||1;return{halfHeight:P,barWidth:k,barGap:S,barRadius:y.barRadius||0,barMinHeight:y.barMinHeight?y.barMinHeight*E:0,barIndexScale:f>0?m/D/f:0,barSpacing:D}}({width:s,height:o,length:(e[0]||[]).length,options:t,pixelRatio:this.getPixelRatio()}),p=function({channelData:m,barIndexScale:g,barSpacing:f,barWidth:y,halfHeight:E,vScale:P,canvasHeight:k,barAlign:S,barMinHeight:D}){const R=m[0]||[],x=m[1]||R,_=R.length,v=[];let z=0,O=0,X=0;for(let C=0;C<=_;C++){const Q=Math.round(C*g);if(Q>z){const{topHeight:pn,totalHeight:ct}=bn({maxTop:O,maxBottom:X,halfHeight:E,vScale:P,barMinHeight:D,barAlign:S}),mn=yn({barAlign:S,halfHeight:E,topHeight:pn,totalHeight:ct,canvasHeight:k});v.push({x:z*f,y:mn,width:y,height:ct}),z=Q,O=0,X=0}const at=Math.abs(R[C]||0),lt=Math.abs(x[C]||0);at>O&&(O=at),lt>X&&(X=lt)}return v}({channelData:e,barIndexScale:h,barSpacing:d,barWidth:l,halfHeight:a,vScale:r,canvasHeight:o,barAlign:t.barAlign,barMinHeight:u});n.beginPath();for(const m of p)c&&"roundRect"in n?n.roundRect(m.x,m.y,m.width,m.height,c):n.rect(m.x,m.y,m.width,m.height);n.fill(),n.closePath()}renderLineWaveform(e,t,n,r){const{width:s,height:o}=n.canvas,a=function({channelData:l,width:c,height:h,vScale:d}){const u=h/2,p=l[0]||[];return[p,l[1]||p].map((m,g)=>{const f=m.length,y=f?c/f:0,E=u,P=g===0?-1:1,k=[{x:0,y:E}];let S=0,D=0;for(let R=0;R<=f;R++){const x=Math.round(R*y);if(x>S){const v=E+(Math.round(D*u*d)||1)*P;k.push({x:S,y:v}),S=x,D=0}const _=Math.abs(m[R]||0);_>D&&(D=_)}return k.push({x:S,y:E}),k})}({channelData:e,width:s,height:o,vScale:r});n.beginPath();for(const l of a)if(l.length){n.moveTo(l[0].x,l[0].y);for(let c=1;c<l.length;c++){const h=l[c];n.lineTo(h.x,h.y)}}n.fill(),n.closePath()}renderWaveform(e,t,n){if(n.fillStyle=this.convertColorValues(t.waveColor,n),t.renderFunction)return void t.renderFunction(e,n);const r=function({channelData:s,barHeight:o,normalize:a,maxPeak:l}){var c;const h=o||1;if(!a)return h;const d=s[0];if(!d||d.length===0)return h;let u=l??0;if(!l)for(let p=0;p<d.length;p++){const m=(c=d[p])!==null&&c!==void 0?c:0,g=Math.abs(m);g>u&&(u=g)}return u?h/u:h}({channelData:e,barHeight:t.barHeight,normalize:t.normalize,maxPeak:t.maxPeak});Ht(t)?this.renderBarWaveform(e,t,n,r):this.renderLineWaveform(e,t,n,r)}renderSingleCanvas(e,t,n,r,s,o,a){const l=this.getPixelRatio(),c=document.createElement("canvas");c.width=Math.round(n*l),c.height=Math.round(r*l),c.style.width=`${n}px`,c.style.height=`${r}px`,c.style.left=`${Math.round(s)}px`,o.appendChild(c);const h=c.getContext("2d");if(t.renderFunction?(h.fillStyle=this.convertColorValues(t.waveColor,h),t.renderFunction(e,h)):this.renderWaveform(e,t,h),c.width>0&&c.height>0){const d=c.cloneNode(),u=d.getContext("2d");u.drawImage(c,0,0),u.globalCompositeOperation="source-in",u.fillStyle=this.convertColorValues(t.progressColor,u),u.fillRect(0,0,c.width,c.height),a.appendChild(d)}}renderMultiCanvas(e,t,n,r,s,o){const a=this.getPixelRatio(),{clientWidth:l}=this.scrollContainer,c=n/a,h=function({clientWidth:m,totalWidth:g,options:f}){return ut(Math.min(8e3,m,g),f)}({clientWidth:l,totalWidth:c,options:t});let d={};if(h===0)return;const u=m=>{if(m<0||m>=p||d[m])return;d[m]=!0;const g=m*h;let f=Math.min(c-g,h);if(f=ut(f,t),f<=0)return;const y=function({channelData:E,offset:P,clampedWidth:k,totalWidth:S}){return E.map(D=>{const R=Math.floor(P/S*D.length),x=Math.floor((P+k)/S*D.length);return D.slice(R,x)})}({channelData:e,offset:g,clampedWidth:f,totalWidth:c});this.renderSingleCanvas(y,t,f,r,g,s,o)},p=Math.ceil(c/h);if(!this.isScrollable){for(let m=0;m<p;m++)u(m);return}if(pt({scrollLeft:this.scrollContainer.scrollLeft,totalWidth:c,numCanvases:p}).forEach(m=>u(m)),p>1){const m=this.on("scroll",()=>{const{scrollLeft:g}=this.scrollContainer;Object.keys(d).length>10&&(s.innerHTML="",o.innerHTML="",d={}),pt({scrollLeft:g,totalWidth:c,numCanvases:p}).forEach(f=>u(f))});this.unsubscribeOnScroll.push(m)}}renderChannel(e,t,n,r){var{overlay:s}=t,o=function(h,d){var u={};for(var p in h)Object.prototype.hasOwnProperty.call(h,p)&&d.indexOf(p)<0&&(u[p]=h[p]);if(h!=null&&typeof Object.getOwnPropertySymbols=="function"){var m=0;for(p=Object.getOwnPropertySymbols(h);m<p.length;m++)d.indexOf(p[m])<0&&Object.prototype.propertyIsEnumerable.call(h,p[m])&&(u[p[m]]=h[p[m]])}return u}(t,["overlay"]);const a=document.createElement("div"),l=this.getHeight(o.height,o.splitChannels);a.style.height=`${l}px`,s&&r>0&&(a.style.marginTop=`-${l}px`),this.canvasWrapper.style.minHeight=`${l}px`,this.canvasWrapper.appendChild(a);const c=a.cloneNode();this.progressWrapper.appendChild(c),this.renderMultiCanvas(e,o,n,l,a,c)}render(e){return A(this,void 0,void 0,function*(){var t;this.timeouts.forEach(c=>c()),this.timeouts=[],this.unsubscribeOnScroll.forEach(c=>c()),this.unsubscribeOnScroll=[],this.canvasWrapper.innerHTML="",this.progressWrapper.innerHTML="",this.options.width!=null&&(this.scrollContainer.style.width=typeof this.options.width=="number"?`${this.options.width}px`:this.options.width);const n=this.getPixelRatio(),r=this.scrollContainer.clientWidth-this.containerInlinePadding,{scrollWidth:s,isScrollable:o,useParentWidth:a,width:l}=function({duration:c,minPxPerSec:h=0,parentWidth:d,fillParent:u,pixelRatio:p}){const m=Math.ceil(c*h),g=m>d,f=!!(u&&!g);return{scrollWidth:m,isScrollable:g,useParentWidth:f,width:(f?d:m)*p}}({duration:e.duration,minPxPerSec:this.options.minPxPerSec||0,parentWidth:r,fillParent:this.options.fillParent,pixelRatio:n});if(this.isScrollable=o,this.wrapper.style.width=a?"100%":`${s}px`,this.scrollContainer.style.overflowX=this.isScrollable?"auto":"hidden",this.scrollContainer.classList.toggle("noScrollbar",!!this.options.hideScrollbar),this.cursor.style.backgroundColor=`${this.options.cursorColor||this.options.progressColor}`,this.cursor.style.width=`${this.options.cursorWidth}px`,this.audioData=e,this.emit("render"),this.options.splitChannels)for(let c=0;c<e.numberOfChannels;c++){const h=Object.assign(Object.assign({},this.options),(t=this.options.splitChannels)===null||t===void 0?void 0:t[c]);this.renderChannel([e.getChannelData(c)],h,l,c)}else{const c=[e.getChannelData(0)];e.numberOfChannels>1&&c.push(e.getChannelData(1)),this.renderChannel(c,this.options,l,0)}Promise.resolve().then(()=>this.emit("rendered"))})}reRender(){if(this.unsubscribeOnScroll.forEach(n=>n()),this.unsubscribeOnScroll=[],!this.audioData)return;const{scrollWidth:e}=this.scrollContainer,{right:t}=this.progressWrapper.getBoundingClientRect();if(this.render(this.audioData),!this.isScrollable&&this.scrollContainer.scrollLeft)this.scrollContainer.scrollLeft=0;else if(this.isScrollable&&e!==this.scrollContainer.scrollWidth){const{right:n}=this.progressWrapper.getBoundingClientRect(),r=function(s){const o=2*s;return(o<0?Math.floor(o):Math.ceil(o))/2}(n-t);this.scrollContainer.scrollLeft+=r}}zoom(e){this.options.minPxPerSec=e,this.reRender()}scrollIntoView(e,t=!1){var n;const{scrollLeft:r,scrollWidth:s,clientWidth:o}=this.scrollContainer,a=e*s,l=r,c=r+o,h=o/2;if(this.isDragging)a+30>c?this.scrollContainer.scrollLeft+=30:a-30<l&&(this.scrollContainer.scrollLeft-=30);else{(a<l||a>c)&&(this.scrollContainer.scrollLeft=a-(this.options.autoCenter?h:0));const d=a-r-h;if(t&&this.options.autoCenter&&d>0){const u=(n=this.audioData)===null||n===void 0?void 0:n.duration;if(u===void 0||u<=0)return void(this.scrollContainer.scrollLeft+=d);const p=s/u;this.scrollContainer.scrollLeft+=p<=600?Math.min(d,10):d}}}renderProgress(e,t){if(isNaN(e))return;const n=100*e;this.canvasWrapper.style.clipPath=`polygon(${n}% 0%, 100% 0%, 100% 100%, ${n}% 100%)`,this.progressWrapper.style.width=`${n}%`,this.cursor.style.left=`${n}%`,this.cursor.style.transform=this.options.cursorWidth?`translateX(-${e*this.options.cursorWidth}px)`:"",this.isScrollable&&this.options.autoScroll&&this.audioData&&this.audioData.duration>0&&this.scrollIntoView(e,t)}exportImage(e,t,n){return A(this,void 0,void 0,function*(){const r=this.canvasWrapper.querySelectorAll("canvas");if(!r.length)throw new Error("No waveform data");if(n==="dataURL"){const s=Array.from(r).map(o=>o.toDataURL(e,t));return Promise.resolve(s)}return Promise.all(Array.from(r).map(s=>new Promise((o,a)=>{s.toBlob(l=>{l?o(l):a(new Error("Could not export image"))},e,t)})))})}}class Cn extends be{constructor(){super(...arguments),this.animationFrameId=null,this.isRunning=!1}start(){if(this.isRunning)return;this.isRunning=!0;const e=()=>{this.isRunning&&(this.emit("tick"),this.animationFrameId=requestAnimationFrame(e))};e()}stop(){this.isRunning=!1,this.animationFrameId!==null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null)}destroy(){this.stop(),this.unAll()}}class Ue extends be{constructor(e){super(),this.bufferNode=null,this.playStartTime=0,this.playbackPosition=0,this._muted=!1,this._playbackRate=1,this._duration=void 0,this.buffer=null,this.currentSrc="",this.paused=!0,this.crossOrigin=null,this.seeking=!1,this.autoplay=!1,this.addEventListener=this.on,this.removeEventListener=this.un,this._destroyed=!1,function(){const t=globalThis.navigator;if(t!=null&&t.audioSession)try{t.audioSession.type="playback"}catch(n){console.warn("Setting navigator.audioSession.type failed:",n)}}(),this.audioContext=e||new AudioContext,this.gainNode=this.audioContext.createGain(),this.gainNode.connect(this.audioContext.destination)}load(){return A(this,void 0,void 0,function*(){})}remove(){this.destroy()}destroy(){if(!this._destroyed){if(this._destroyed=!0,this.currentSrc="",this.bufferNode){this.bufferNode.onended=null;try{this.bufferNode.stop()}catch{}this.bufferNode.disconnect(),this.bufferNode=null}this.gainNode.disconnect(),typeof this.audioContext.close=="function"&&Promise.resolve(this.audioContext.close.call(this.audioContext)).catch(()=>{}),this.buffer=null,this.unAll()}}get src(){return this.currentSrc}set src(e){if(this.currentSrc=e,this._duration=void 0,!e)return this.buffer=null,void this.emit("emptied");fetch(e).then(t=>{if(t.status>=400)throw new Error(`Failed to fetch ${e}: ${t.status} (${t.statusText})`);return t.arrayBuffer()}).then(t=>this.currentSrc!==e?null:this.audioContext.decodeAudioData(t)).then(t=>{this.currentSrc===e&&(this.buffer=t,this.emit("loadedmetadata"),this.emit("canplay"),this.autoplay&&this.play())}).catch(t=>{console.error("WebAudioPlayer load error:",t)})}_play(){if(!this.paused)return;this.paused=!1,this.bufferNode&&(this.bufferNode.onended=null,this.bufferNode.disconnect()),this.bufferNode=this.audioContext.createBufferSource(),this.buffer&&(this.bufferNode.buffer=this.buffer),this.bufferNode.playbackRate.value=this._playbackRate,this.bufferNode.connect(this.gainNode);let e=this.playbackPosition;(e>=this.duration||e<0)&&(e=0,this.playbackPosition=0),this.bufferNode.start(this.audioContext.currentTime,e),this.playStartTime=this.audioContext.currentTime,this.bufferNode.onended=()=>{!this.paused&&this.duration-this.currentTime<.01&&(this.pause(),this.emit("ended"))}}_pause(){if(this.paused=!0,this.bufferNode){this.bufferNode.onended=null;try{this.bufferNode.stop()}catch{}}this.playbackPosition+=(this.audioContext.currentTime-this.playStartTime)*this._playbackRate}play(){return A(this,void 0,void 0,function*(){this.paused&&(this._play(),this.emit("play"))})}pause(){this.paused||(this._pause(),this.emit("pause"))}stopAt(e){const t=(e-this.currentTime)/this._playbackRate,n=this.bufferNode;n==null||n.stop(this.audioContext.currentTime+t),n==null||n.addEventListener("ended",()=>{n===this.bufferNode&&(this.bufferNode=null,this.pause(),this.playbackPosition=Math.min(e,this.duration),this.emit("timeupdate"))},{once:!0})}setSinkId(e){return A(this,void 0,void 0,function*(){return this.audioContext.setSinkId(e)})}get playbackRate(){return this._playbackRate}set playbackRate(e){const t=!this.paused;t&&this._pause(),this._playbackRate=e,t&&this._play(),this.bufferNode&&(this.bufferNode.playbackRate.value=e)}get currentTime(){return this.paused?this.playbackPosition:this.playbackPosition+(this.audioContext.currentTime-this.playStartTime)*this._playbackRate}set currentTime(e){const t=!this.paused;t&&this._pause(),this.playbackPosition=e,t&&this._play(),this.emit("seeking"),this.emit("timeupdate")}get duration(){var e,t;return(e=this._duration)!==null&&e!==void 0?e:((t=this.buffer)===null||t===void 0?void 0:t.duration)||0}set duration(e){this._duration=e}get volume(){return this.gainNode.gain.value}set volume(e){this.gainNode.gain.value=e,this.emit("volumechange")}get muted(){return this._muted}set muted(e){this._muted!==e&&(this._muted=e,this._muted?this.gainNode.disconnect():this.gainNode.connect(this.audioContext.destination))}canPlayType(e){return/^(audio|video)\//.test(e)}getGainNode(){return this.gainNode}getChannelData(){const e=[];if(!this.buffer)return e;const t=this.buffer.numberOfChannels;for(let n=0;n<t;n++)e.push(this.buffer.getChannelData(n));return e}removeAttribute(e){switch(e){case"src":this.src="";break;case"playbackRate":this.playbackRate=0;break;case"currentTime":this.currentTime=0;break;case"duration":this.duration=0;break;case"volume":this.volume=0;break;case"muted":this.muted=!1}}}const wn={waveColor:"#999",progressColor:"#555",cursorWidth:1,minPxPerSec:0,fillParent:!0,interact:!0,dragToSeek:!1,autoScroll:!0,autoCenter:!0,sampleRate:8e3};class ve extends vn{static create(e){return new ve(e)}getState(){return this.wavesurferState}getRenderer(){return this.renderer}constructor(e){const t=e.media||(e.backend==="WebAudio"?new Ue:void 0);super({media:t,mediaControls:e.mediaControls,autoplay:e.autoplay,playbackRate:e.audioRate}),this.plugins=[],this.decodedData=null,this.stopAtPosition=null,this.subscriptions=[],this.mediaSubscriptions=[],this.abortController=null,this._isDestroyed=!1,this._loadVersion=0,this.reactiveCleanups=[],this.options=Object.assign({},wn,e);const{state:n,actions:r}=function(a){var l,c,h,d,u,p;const m=(l=a==null?void 0:a.currentTime)!==null&&l!==void 0?l:M(0),g=(c=a==null?void 0:a.duration)!==null&&c!==void 0?c:M(0),f=(h=a==null?void 0:a.isPlaying)!==null&&h!==void 0?h:M(!1),y=(d=a==null?void 0:a.isSeeking)!==null&&d!==void 0?d:M(!1),E=(u=a==null?void 0:a.volume)!==null&&u!==void 0?u:M(1),P=(p=a==null?void 0:a.playbackRate)!==null&&p!==void 0?p:M(1),k=M(null),S=M(null),D=M(""),R=M(0),x=M(0),_=ie(()=>!f.value,[f]),v=ie(()=>k.value!==null,[k]),z=ie(()=>v.value&&g.value>0,[v,g]),O=ie(()=>m.value,[m]),X=ie(()=>g.value>0?m.value/g.value:0,[m,g]);return{state:{currentTime:m,duration:g,isPlaying:f,isPaused:_,isSeeking:y,volume:E,playbackRate:P,audioBuffer:k,peaks:S,url:D,zoom:R,scrollPosition:x,canPlay:v,isReady:z,progress:O,progressPercent:X},actions:{setCurrentTime:C=>{const Q=Math.max(0,Math.min(g.value||1/0,C));m.set(Q)},setDuration:C=>{g.set(Math.max(0,C))},setPlaying:C=>{f.set(C)},setSeeking:C=>{y.set(C)},setVolume:C=>{const Q=Math.max(0,Math.min(1,C));E.set(Q)},setPlaybackRate:C=>{const Q=Math.max(.1,Math.min(16,C));P.set(Q)},setAudioBuffer:C=>{k.set(C),C&&g.set(C.duration)},setPeaks:C=>{S.set(C)},setUrl:C=>{D.set(C)},setZoom:C=>{R.set(Math.max(0,C))},setScrollPosition:C=>{x.set(Math.max(0,C))}}}}({isPlaying:this.isPlayingSignal,currentTime:this.currentTimeSignal,duration:this.durationSignal,volume:this.volumeSignal,playbackRate:this.playbackRateSignal,isSeeking:this.seekingSignal});this.wavesurferState=n,this.wavesurferActions=r,this.timer=new Cn;const s=t?void 0:this.getMediaElement();this.renderer=new xn(this.options,s),this.initPlayerEvents(),this.initRendererEvents(),this.initTimerEvents(),this.initReactiveState(),this.initPlugins();const o=this.options.url||this.getSrc()||"";Promise.resolve().then(()=>{this.emit("init");const{peaks:a,duration:l}=this.options;(o||a&&l)&&this.load(o,a,l).catch(()=>{})})}updateProgress(e=this.getCurrentTime()){return this.renderer.renderProgress(e/this.getDuration(),this.isPlaying()),e}initTimerEvents(){this.subscriptions.push(this.timer.on("tick",()=>{if(!this.isSeeking()){const e=this.updateProgress();if(this.emit("timeupdate",e),this.emit("audioprocess",e),this.stopAtPosition!=null&&this.isPlaying()&&e>=this.stopAtPosition){const t=this.stopAtPosition;this.pause(),this.setTime(t)}}}))}initReactiveState(){this.reactiveCleanups.push(function(e,t){const n=[];n.push(q(()=>{const o=e.isPlaying.value;t.emit(o?"play":"pause")},[e.isPlaying])),n.push(q(()=>{const o=e.currentTime.value;t.emit("timeupdate",o),e.isPlaying.value&&t.emit("audioprocess",o)},[e.currentTime,e.isPlaying])),n.push(q(()=>{e.isSeeking.value&&t.emit("seeking",e.currentTime.value)},[e.isSeeking,e.currentTime]));let r=!1;n.push(q(()=>{e.isReady.value&&!r&&(r=!0,t.emit("ready",e.duration.value))},[e.isReady,e.duration])),n.push(q(()=>{e.audioBuffer.value===null&&(r=!1)},[e.audioBuffer]));let s=!1;return n.push(q(()=>{const o=e.isPlaying.value,a=e.currentTime.value,l=e.duration.value,c=l>0&&a>=l;s&&!o&&c&&t.emit("finish"),s=o&&c},[e.isPlaying,e.currentTime,e.duration])),n.push(q(()=>{const o=e.zoom.value;o>0&&t.emit("zoom",o)},[e.zoom])),()=>{n.forEach(o=>o())}}(this.wavesurferState,{emit:this.emit.bind(this)}))}initPlayerEvents(){this.isPlaying()&&(this.emit("play"),this.timer.start()),this.mediaSubscriptions.push(this.onMediaEvent("timeupdate",()=>{const e=this.updateProgress();this.emit("timeupdate",e)}),this.onMediaEvent("play",()=>{this.emit("play"),this.timer.start()}),this.onMediaEvent("pause",()=>{this.emit("pause"),this.timer.stop(),this.stopAtPosition=null}),this.onMediaEvent("emptied",()=>{this.timer.stop(),this.stopAtPosition=null}),this.onMediaEvent("ended",()=>{this.emit("timeupdate",this.getDuration()),this.emit("finish"),this.stopAtPosition=null}),this.onMediaEvent("seeking",()=>{this.emit("seeking",this.getCurrentTime())}),this.onMediaEvent("error",()=>{var e;this.emit("error",(e=this.getMediaElement().error)!==null&&e!==void 0?e:new Error("Media error")),this.stopAtPosition=null}))}initRendererEvents(){this.subscriptions.push(this.renderer.on("click",(e,t)=>{this.options.interact&&(this.seekTo(e),this.emit("interaction",e*this.getDuration()),this.emit("click",e,t))}),this.renderer.on("dblclick",(e,t)=>{this.emit("dblclick",e,t)}),this.renderer.on("scroll",(e,t,n,r)=>{const s=this.getDuration();this.emit("scroll",e*s,t*s,n,r)}),this.renderer.on("render",()=>{this.emit("redraw")}),this.renderer.on("rendered",()=>{this.emit("redrawcomplete")}),this.renderer.on("dragstart",e=>{this.emit("dragstart",e)}),this.renderer.on("dragend",e=>{this.emit("dragend",e)}),this.renderer.on("resize",()=>{this.emit("resize")}));{let e;const t=this.renderer.on("drag",n=>{var r;if(!this.options.interact)return;this.renderer.renderProgress(n),clearTimeout(e);let s=0;const o=this.options.dragToSeek;this.isPlaying()?s=0:o===!0?s=200:o&&typeof o=="object"&&(s=(r=o.debounceTime)!==null&&r!==void 0?r:200),e=setTimeout(()=>{this.seekTo(n)},s),this.emit("interaction",n*this.getDuration()),this.emit("drag",n)});this.subscriptions.push(()=>{clearTimeout(e),t()})}}initPlugins(){var e;!((e=this.options.plugins)===null||e===void 0)&&e.length&&this.options.plugins.forEach(t=>{this.registerPlugin(t)})}unsubscribePlayerEvents(){this.mediaSubscriptions.forEach(e=>e()),this.mediaSubscriptions=[]}setOptions(e){this.options=Object.assign({},this.options,e),e.duration&&!e.peaks&&(this.decodedData=xe.createBuffer(this.exportPeaks(),e.duration)),e.peaks&&e.duration&&(this.decodedData=xe.createBuffer(e.peaks,e.duration)),this.renderer.setOptions(this.options),e.audioRate&&this.setPlaybackRate(e.audioRate),e.mediaControls!=null&&(this.getMediaElement().controls=e.mediaControls)}registerPlugin(e){if(this.plugins.includes(e))return e;e._init(this),this.plugins.push(e);const t=e.once("destroy",()=>{this.plugins=this.plugins.filter(n=>n!==e),this.subscriptions=this.subscriptions.filter(n=>n!==t)});return this.subscriptions.push(t),e}unregisterPlugin(e){this.plugins=this.plugins.filter(t=>t!==e),e.destroy()}getWrapper(){return this.renderer.getWrapper()}getWidth(){return this.renderer.getWidth()}getScroll(){return this.renderer.getScroll()}setScroll(e){return this.renderer.setScroll(e)}setScrollTime(e){const t=e/this.getDuration();this.renderer.setScrollPercentage(t)}getActivePlugins(){return this.plugins}loadAudio(e,t,n,r){return A(this,void 0,void 0,function*(){var s;const o=++this._loadVersion;if(this._isDestroyed=!1,this.emit("load",e),!this.options.media&&this.isPlaying()&&this.pause(),this.decodedData=null,this.stopAtPosition=null,(s=this.abortController)===null||s===void 0||s.abort(),this.abortController=null,!t&&!n){const l=this.options.fetchParams||{};window.AbortController&&!l.signal&&(this.abortController=new AbortController,l.signal=this.abortController.signal);const c=d=>this.emit("loading",d);if(t=yield gn.fetchBlob(e,c,l),this._isDestroyed||o!==this._loadVersion)return;const h=this.options.blobMimeType;h&&(t=new Blob([t],{type:h}))}if(this._isDestroyed||o!==this._loadVersion)return;this.setSrc(e,t);const a=yield new Promise(l=>{const c=r||this.getDuration();c?l(c):this.mediaSubscriptions.push(this.onMediaEvent("loadedmetadata",()=>l(this.getDuration()),{once:!0}))});if(!this._isDestroyed&&o===this._loadVersion){if(!e&&!t){const l=this.getMediaElement();l instanceof Ue&&(l.duration=a)}if(n)this.decodedData=xe.createBuffer(n,a||0);else if(t){const l=yield t.arrayBuffer();if(this._isDestroyed||o!==this._loadVersion)return;this.decodedData=yield xe.decode(l,this.options.sampleRate)}this._isDestroyed||o!==this._loadVersion||(this.decodedData&&(this.emit("decode",this.getDuration()),this.renderer.render(this.decodedData)),this.emit("ready",this.getDuration()))}})}load(e,t,n){return A(this,void 0,void 0,function*(){try{return yield this.loadAudio(e,void 0,t,n)}catch(r){throw this.emit("error",r),r}})}loadBlob(e,t,n){return A(this,void 0,void 0,function*(){try{return yield this.loadAudio("",e,t,n)}catch(r){throw this.emit("error",r),r}})}zoom(e){if(!this.decodedData)throw new Error("No audio loaded");this.renderer.zoom(e),this.emit("zoom",e)}getDecodedData(){return this.decodedData}exportPeaks({channels:e=2,maxLength:t=8e3,precision:n=1e4}={}){if(!this.decodedData)throw new Error("The audio has not been decoded yet");const r=Math.min(e,this.decodedData.numberOfChannels),s=[];for(let o=0;o<r;o++){const a=this.decodedData.getChannelData(o),l=[],c=a.length/t;for(let h=0;h<t;h++){const d=a.slice(Math.floor(h*c),Math.ceil((h+1)*c));let u=0;for(let p=0;p<d.length;p++){const m=d[p];Math.abs(m)>Math.abs(u)&&(u=m)}l.push(Math.round(u*n)/n)}s.push(l)}return s}getDuration(){let e=super.getDuration()||0;return e!==0&&e!==1/0||!this.decodedData||(e=this.decodedData.duration),e}toggleInteraction(e){this.options.interact=e}setTime(e){this.stopAtPosition=null,super.setTime(e),this.updateProgress(e),this.emit("timeupdate",e)}seekTo(e){const t=this.getDuration()*e;this.setTime(t)}play(e,t){const n=Object.create(null,{play:{get:()=>super.play}});return A(this,void 0,void 0,function*(){e!=null&&this.setTime(e);const r=yield n.play.call(this);return t!=null&&(this.media instanceof Ue?this.media.stopAt(t):this.stopAtPosition=t),r})}playPause(){return A(this,void 0,void 0,function*(){return this.isPlaying()?this.pause():this.play()})}stop(){this.pause(),this.setTime(0)}skip(e){this.setTime(this.getCurrentTime()+e)}empty(){this.load("",[[0]],.001)}setMediaElement(e){this.unsubscribePlayerEvents(),super.setMediaElement(e),this.initPlayerEvents()}exportImage(){return A(this,arguments,void 0,function*(e="image/png",t=1,n="dataURL"){return this.renderer.exportImage(e,t,n)})}destroy(){var e;this._isDestroyed=!0,this.emit("destroy"),(e=this.abortController)===null||e===void 0||e.abort(),this.plugins.forEach(t=>t.destroy()),this.subscriptions.forEach(t=>t()),this.unsubscribePlayerEvents(),this.reactiveCleanups.forEach(t=>t()),this.reactiveCleanups=[],this.timer.destroy(),this.renderer.destroy(),super.destroy()}}ve.BasePlugin=class extends be{constructor(i){super(),this.subscriptions=[],this.isDestroyed=!1,this.options=i}onInit(){}_init(i){this.isDestroyed&&(this.subscriptions=[],this.isDestroyed=!1),this.wavesurfer=i,this.onInit()}destroy(){this.emit("destroy"),this.subscriptions.forEach(i=>i()),this.subscriptions=[],this.isDestroyed=!0,this.wavesurfer=void 0}},ve.dom=fn;class Ft{constructor(){this.listeners={}}on(e,t,n){if(this.listeners[e]||(this.listeners[e]=new Set),n==null?void 0:n.once){const r=(...s)=>{this.un(e,r),t(...s)};return this.listeners[e].add(r),()=>this.un(e,r)}return this.listeners[e].add(t),()=>this.un(e,t)}un(e,t){var n;(n=this.listeners[e])===null||n===void 0||n.delete(t)}once(e,t){return this.on(e,t,{once:!0})}unAll(){this.listeners={}}emit(e,...t){this.listeners[e]&&this.listeners[e].forEach(n=>n(...t))}}class kn extends Ft{constructor(e){super(),this.subscriptions=[],this.isDestroyed=!1,this.options=e}onInit(){}_init(e){this.isDestroyed&&(this.subscriptions=[],this.isDestroyed=!1),this.wavesurfer=e,this.onInit()}destroy(){this.emit("destroy"),this.subscriptions.forEach(e=>e()),this.subscriptions=[],this.isDestroyed=!0,this.wavesurfer=void 0}}function jt(i,e){const t=e.xmlns?document.createElementNS(e.xmlns,i):document.createElement(i);for(const[n,r]of Object.entries(e))if(n==="children"&&r)for(const[s,o]of Object.entries(r))o instanceof Node?t.appendChild(o):typeof o=="string"?t.appendChild(document.createTextNode(o)):t.appendChild(jt(s,o));else n==="style"?Object.assign(t.style,r):n==="textContent"?t.textContent=r:t.setAttribute(n,r.toString());return t}function fe(i,e,t){const n=jt(i,e||{});return t==null||t.appendChild(n),n}function Ut(i){let e=i;const t=new Set;return{get value(){return e},set(n){Object.is(e,n)||(e=n,t.forEach(r=>r(e)))},update(n){this.set(n(e))},subscribe:n=>(t.add(n),()=>t.delete(n))}}function Le(i,e){let t;const n=()=>{t&&(t(),t=void 0),t=i()},r=e.map(s=>s.subscribe(n));return n(),()=>{t&&(t(),t=void 0),r.forEach(s=>s())}}function le(i,e){const t=Ut(null),n=r=>{t.set(r)};return i.addEventListener(e,n),t._cleanup=()=>{i.removeEventListener(e,n)},t}function ne(i){const e=i._cleanup;typeof e=="function"&&e()}function Se(i,e={}){const{threshold:t=3,mouseButton:n=0,touchDelay:r=100}=e,s=Ut(null),o=new Map,a=matchMedia("(pointer: coarse)").matches;let l=()=>{};const c=h=>{if(h.button!==n||o.has(h.pointerId)||(o.set(h.pointerId,h),o.size>1))return;const d=h.pointerId;let u=h.clientX,p=h.clientY,m=!1;const g=Date.now(),f=i.getBoundingClientRect(),{left:y,top:E}=f,P=x=>{if(x.pointerId!==d||x.defaultPrevented||o.size>1||a&&Date.now()-g<r)return;const _=x.clientX,v=x.clientY,z=_-u,O=v-p;(m||Math.abs(z)>t||Math.abs(O)>t)&&(x.preventDefault(),x.stopPropagation(),m||(s.set({type:"start",x:u-y,y:p-E}),m=!0),s.set({type:"move",x:_-y,y:v-E,deltaX:z,deltaY:O}),u=_,p=v)},k=x=>{if(o.delete(x.pointerId)){if(x.pointerId===d&&m){const _=x.clientX,v=x.clientY;s.set({type:"end",x:_-y,y:v-E})}o.size===0&&l()}},S=x=>{x.relatedTarget&&x.relatedTarget!==document.documentElement||k(x)},D=x=>{m&&(x.stopPropagation(),x.preventDefault())},R=x=>{x.defaultPrevented||o.size>1||m&&x.preventDefault()};document.addEventListener("pointermove",P),document.addEventListener("pointerup",k),document.addEventListener("pointerout",S),document.addEventListener("pointercancel",S),document.addEventListener("touchmove",R,{passive:!1}),document.addEventListener("click",D,{capture:!0}),l=()=>{document.removeEventListener("pointermove",P),document.removeEventListener("pointerup",k),document.removeEventListener("pointerout",S),document.removeEventListener("pointercancel",S),document.removeEventListener("touchmove",R),setTimeout(()=>{document.removeEventListener("click",D,{capture:!0})},10)}};return i.addEventListener("pointerdown",c),{signal:s,cleanup:()=>{l(),i.removeEventListener("pointerdown",c),o.clear(),ne(s)}}}class mt extends Ft{constructor(e,t,n=0){var r,s,o,a,l,c,h,d,u,p;super(),this.totalDuration=t,this.numberOfChannels=n,this.element=null,this.minLength=0,this.maxLength=1/0,this.contentEditable=!1,this.subscriptions=[],this.updatingSide=void 0,this.isRemoved=!1,this.subscriptions=[],this.id=e.id||`region-${Math.random().toString(32).slice(2)}`,this.start=this.clampPosition(e.start),this.end=this.clampPosition((r=e.end)!==null&&r!==void 0?r:e.start),this.drag=(s=e.drag)===null||s===void 0||s,this.resize=(o=e.resize)===null||o===void 0||o,this.resizeStart=(a=e.resizeStart)===null||a===void 0||a,this.resizeEnd=(l=e.resizeEnd)===null||l===void 0||l,this.color=(c=e.color)!==null&&c!==void 0?c:"rgba(0, 0, 0, 0.1)",this.minLength=(h=e.minLength)!==null&&h!==void 0?h:this.minLength,this.maxLength=(d=e.maxLength)!==null&&d!==void 0?d:this.maxLength,this.channelIdx=(u=e.channelIdx)!==null&&u!==void 0?u:-1,this.contentEditable=(p=e.contentEditable)!==null&&p!==void 0?p:this.contentEditable,this.element=this.initElement(),this.setContent(e.content),this.setPart(),this.renderPosition(),this.initMouseEvents()}clampPosition(e){return Math.max(0,Math.min(this.totalDuration,e))}setPart(){var e;const t=this.start===this.end;(e=this.element)===null||e===void 0||e.setAttribute("part",`${t?"marker":"region"} ${this.id}`)}addResizeHandles(e){const t={position:"absolute",zIndex:"2",width:"6px",height:"100%",top:"0",cursor:"ew-resize",wordBreak:"keep-all"},n=fe("div",{part:"region-handle region-handle-left",style:Object.assign(Object.assign({},t),{left:"0",borderLeft:"2px solid rgba(0, 0, 0, 0.5)",borderRadius:"2px 0 0 2px"})},e),r=fe("div",{part:"region-handle region-handle-right",style:Object.assign(Object.assign({},t),{right:"0",borderRight:"2px solid rgba(0, 0, 0, 0.5)",borderRadius:"0 2px 2px 0"})},e),s=Se(n,{threshold:1}),o=Se(r,{threshold:1}),a=Le(()=>{const c=s.signal.value;c&&(c.type==="move"&&c.deltaX!==void 0?this.onResize(c.deltaX,"start"):c.type==="end"&&this.onEndResizing("start"))},[s.signal]),l=Le(()=>{const c=o.signal.value;c&&(c.type==="move"&&c.deltaX!==void 0?this.onResize(c.deltaX,"end"):c.type==="end"&&this.onEndResizing("end"))},[o.signal]);this.subscriptions.push(()=>{a(),l(),s.cleanup(),o.cleanup()})}removeResizeHandles(e){const t=e.querySelector('[part*="region-handle-left"]'),n=e.querySelector('[part*="region-handle-right"]');t&&e.removeChild(t),n&&e.removeChild(n)}initElement(){if(this.isRemoved)return null;const e=this.start===this.end;let t=0,n=100;this.channelIdx>=0&&this.numberOfChannels>0&&this.channelIdx<this.numberOfChannels&&(n=100/this.numberOfChannels,t=n*this.channelIdx);const r=fe("div",{style:{position:"absolute",top:`${t}%`,height:`${n}%`,backgroundColor:e?"none":this.color,borderLeft:e?"2px solid "+this.color:"none",borderRadius:"2px",boxSizing:"border-box",transition:"background-color 0.2s ease",cursor:this.drag?"grab":"default",pointerEvents:"all"}});return!e&&this.resize&&this.addResizeHandles(r),r}renderPosition(){if(!this.element)return;const e=this.start/this.totalDuration,t=(this.totalDuration-this.end)/this.totalDuration;this.element.style.left=100*e+"%",this.element.style.right=100*t+"%"}toggleCursor(e){var t;this.drag&&(!((t=this.element)===null||t===void 0)&&t.style)&&(this.element.style.cursor=e?"grabbing":"grab")}initMouseEvents(){const{element:e}=this;if(!e)return;const t=le(e,"click"),n=le(e,"mouseenter"),r=le(e,"mouseleave"),s=le(e,"dblclick"),o=le(e,"pointerdown"),a=le(e,"pointerup"),l=t.subscribe(f=>f&&this.emit("click",f)),c=n.subscribe(f=>f&&this.emit("over",f)),h=r.subscribe(f=>f&&this.emit("leave",f)),d=s.subscribe(f=>f&&this.emit("dblclick",f)),u=o.subscribe(f=>f&&this.toggleCursor(!0)),p=a.subscribe(f=>f&&this.toggleCursor(!1));this.subscriptions.push(()=>{l(),c(),h(),d(),u(),p(),ne(t),ne(n),ne(r),ne(s),ne(o),ne(a)});const m=Se(e),g=Le(()=>{const f=m.signal.value;f&&(f.type==="start"?this.toggleCursor(!0):f.type==="move"&&f.deltaX!==void 0?this.onMove(f.deltaX):f.type==="end"&&(this.toggleCursor(!1),this.drag&&this.emit("update-end")))},[m.signal]);this.subscriptions.push(()=>{g(),m.cleanup()}),this.contentEditable&&this.content&&(this.contentClickListener=f=>this.onContentClick(f),this.contentBlurListener=()=>this.onContentBlur(),this.content.addEventListener("click",this.contentClickListener),this.content.addEventListener("blur",this.contentBlurListener))}_onUpdate(e,t,n){var r;if(!(!((r=this.element)===null||r===void 0)&&r.parentElement))return;const{width:s}=this.element.parentElement.getBoundingClientRect(),o=e/s*this.totalDuration;let a=t&&t!=="start"?this.start:this.start+o,l=t&&t!=="end"?this.end:this.end+o;const c=n!==void 0;c&&this.updatingSide&&this.updatingSide!==t&&(this.updatingSide==="start"?a=n:l=n),a=Math.max(0,a),l=Math.min(this.totalDuration,l);const h=l-a;this.updatingSide=t;const d=h>=this.minLength&&h<=this.maxLength;a<=l&&(d||c)&&(this.start=a,this.end=l,this.renderPosition(),this.emit("update",t))}onMove(e){this.drag&&this._onUpdate(e)}onResize(e,t){this.resize&&(this.resizeStart||t!=="start")&&(this.resizeEnd||t!=="end")&&this._onUpdate(e,t)}onEndResizing(e){this.resize&&(this.emit("update-end",e),this.updatingSide=void 0)}onContentClick(e){e.stopPropagation(),e.target.focus(),this.emit("click",e)}onContentBlur(){this.emit("update-end")}_setTotalDuration(e){this.totalDuration=e,this.renderPosition()}play(e){this.emit("play",e&&this.end!==this.start?this.end:void 0)}getContent(e=!1){var t;return e?this.content||void 0:this.element instanceof HTMLElement?((t=this.content)===null||t===void 0?void 0:t.innerHTML)||void 0:""}setContent(e){var t;if(this.element)if(this.content&&this.contentEditable&&(this.contentClickListener&&this.content.removeEventListener("click",this.contentClickListener),this.contentBlurListener&&this.content.removeEventListener("blur",this.contentBlurListener)),(t=this.content)===null||t===void 0||t.remove(),e){if(typeof e=="string"){const n=this.start===this.end;this.content=fe("div",{style:{padding:`0.2em ${n?.2:.4}em`,display:"inline-block"},textContent:e})}else this.content=e;this.contentEditable&&(this.content.contentEditable="true",this.contentClickListener=n=>this.onContentClick(n),this.contentBlurListener=()=>this.onContentBlur(),this.content.addEventListener("click",this.contentClickListener),this.content.addEventListener("blur",this.contentBlurListener)),this.content.setAttribute("part","region-content"),this.element.appendChild(this.content),this.emit("content-changed")}else this.content=void 0}setOptions(e){var t,n;if(this.element){if(e.color&&(this.color=e.color,this.element.style.backgroundColor=this.color),e.drag!==void 0&&(this.drag=e.drag,this.element.style.cursor=this.drag?"grab":"default"),e.start!==void 0||e.end!==void 0){const r=this.start===this.end;this.start=this.clampPosition((t=e.start)!==null&&t!==void 0?t:this.start),this.end=this.clampPosition((n=e.end)!==null&&n!==void 0?n:r?this.start:this.end),this.renderPosition(),this.setPart(),this.emit("render")}if(e.content&&this.setContent(e.content),e.id&&(this.id=e.id,this.setPart()),e.resize!==void 0&&e.resize!==this.resize){const r=this.start===this.end;this.resize=e.resize,this.resize&&!r?this.addResizeHandles(this.element):this.removeResizeHandles(this.element)}e.resizeStart!==void 0&&(this.resizeStart=e.resizeStart),e.resizeEnd!==void 0&&(this.resizeEnd=e.resizeEnd)}}remove(){this.isRemoved=!0,this.emit("remove"),this.subscriptions.forEach(e=>e()),this.subscriptions=[],this.content&&this.contentEditable&&(this.contentClickListener&&(this.content.removeEventListener("click",this.contentClickListener),this.contentClickListener=void 0),this.contentBlurListener&&(this.content.removeEventListener("blur",this.contentBlurListener),this.contentBlurListener=void 0)),this.element&&(this.element.remove(),this.element=null),this.unAll()}}class Ge extends kn{constructor(e){super(e),this.regions=[],this.regionsContainer=this.initRegionsContainer()}static create(e){return new Ge(e)}onInit(){if(!this.wavesurfer)throw Error("WaveSurfer is not initialized");this.wavesurfer.getWrapper().appendChild(this.regionsContainer),this.subscriptions.push(this.wavesurfer.on("ready",t=>{this.regions.forEach(n=>n._setTotalDuration(t))}));let e=[];this.subscriptions.push(this.wavesurfer.on("timeupdate",t=>{const n=this.regions.filter(r=>r.start<=t&&(r.end===r.start?r.start+.05:r.end)>=t);n.forEach(r=>{e.includes(r)||this.emit("region-in",r)}),e.forEach(r=>{n.includes(r)||this.emit("region-out",r)}),e=n}))}initRegionsContainer(){return fe("div",{part:"regions-container",style:{position:"absolute",top:"0",left:"0",width:"100%",height:"100%",zIndex:"5",pointerEvents:"none"}})}getRegions(){return this.regions}avoidOverlapping(e){e.content&&!e.isRemoved&&setTimeout(()=>{if(!e.content)return;const t=e.content;t.style.marginTop="0";const n=t.getBoundingClientRect(),r=this.regions.indexOf(e);if(r<0)return;const s=this.regions.slice(0,r).filter(o=>!o.isRemoved).reduce((o,a)=>{if(a===e||!a.content)return o;const l=a.content.getBoundingClientRect();return n.left<l.right&&l.left<n.right&&o.push(l),o},[]).sort((o,a)=>o.top-a.top).reduce((o,a)=>{const l=n.top+o,c=l+n.height;return l<a.bottom&&a.top<c?a.bottom-n.top+2:o},0);t.style.marginTop=`${s}px`},10)}avoidOverlappingAll(){this.regions.forEach(e=>this.avoidOverlapping(e))}adjustScroll(e){var t,n;if(!e.element)return;const r=(n=(t=this.wavesurfer)===null||t===void 0?void 0:t.getWrapper())===null||n===void 0?void 0:n.parentElement;if(!r)return;const{clientWidth:s,scrollWidth:o}=r;if(o<=s)return;const a=r.getBoundingClientRect(),l=e.element.getBoundingClientRect(),c=l.left-a.left,h=l.right-a.left;c<0?r.scrollLeft+=c:h>s&&(r.scrollLeft+=h-s)}virtualAppend(e,t,n){const r=()=>{if(!this.wavesurfer)return;const s=this.wavesurfer.getWidth(),o=this.wavesurfer.getScroll(),a=t.clientWidth,l=this.wavesurfer.getDuration(),c=Math.round(e.start/l*a),h=c+(Math.round((e.end-e.start)/l*a)||1)>o&&c<o+s;h&&!n.parentElement?t.appendChild(n):!h&&n.parentElement&&n.remove()};setTimeout(()=>{if(!this.wavesurfer||!e.element)return;r();const s=this.wavesurfer.on("scroll",r),o=this.wavesurfer.on("zoom",r),a=this.wavesurfer.on("resize",r),l=e.on("render",r);this.subscriptions.push(s,o,a,l),e.once("remove",()=>{s(),o(),a(),l()})},0)}saveRegion(e){if(!e.element)return;this.virtualAppend(e,this.regionsContainer,e.element),this.avoidOverlapping(e),this.regions.push(e);const t=[e.on("update",n=>{n||this.adjustScroll(e),this.emit("region-update",e,n)}),e.on("update-end",n=>{this.avoidOverlappingAll(),this.emit("region-updated",e,n)}),e.on("play",n=>{var r;(r=this.wavesurfer)===null||r===void 0||r.play(e.start,n)}),e.on("click",n=>{this.emit("region-clicked",e,n)}),e.on("dblclick",n=>{this.emit("region-double-clicked",e,n)}),e.on("content-changed",()=>{this.emit("region-content-changed",e)}),e.once("remove",()=>{t.forEach(n=>n()),this.regions=this.regions.filter(n=>n!==e),this.emit("region-removed",e)})];this.subscriptions.push(...t),this.emit("region-created",e)}addRegion(e){var t,n;if(!this.wavesurfer)throw Error("WaveSurfer is not initialized");const r=this.wavesurfer.getDuration(),s=(n=(t=this.wavesurfer)===null||t===void 0?void 0:t.getDecodedData())===null||n===void 0?void 0:n.numberOfChannels,o=new mt(e,r,s);return this.emit("region-initialized",o),r?this.saveRegion(o):this.subscriptions.push(this.wavesurfer.once("ready",a=>{o._setTotalDuration(a),this.saveRegion(o)})),o}enableDragSelection(e,t=3){var n;const r=(n=this.wavesurfer)===null||n===void 0?void 0:n.getWrapper();if(!(r&&r instanceof HTMLElement))return()=>{};let s=null,o=0,a=0;const l=Se(r,{threshold:t}),c=Le(()=>{var h,d;const u=l.signal.value;if(u)if(u.type==="start"){if(o=u.x,!this.wavesurfer)return;const p=this.wavesurfer.getDuration(),m=(d=(h=this.wavesurfer)===null||h===void 0?void 0:h.getDecodedData())===null||d===void 0?void 0:d.numberOfChannels,{width:g}=this.wavesurfer.getWrapper().getBoundingClientRect();a=o/g*p;const f=u.x/g*p,y=(u.x+5)/g*p;s=new mt(Object.assign(Object.assign({},e),{start:f,end:y}),p,m),this.emit("region-initialized",s),s.element&&this.regionsContainer.appendChild(s.element)}else u.type==="move"&&u.deltaX!==void 0?s&&s._onUpdate(u.deltaX,u.x>o?"end":"start",a):u.type==="end"&&s&&(this.saveRegion(s),s.updatingSide=void 0,s=null)},[l.signal]);return()=>{c(),l.cleanup()}}clearRegions(){this.regions.slice().forEach(e=>e.remove()),this.regions=[]}destroy(){this.clearRegions(),super.destroy(),this.regionsContainer.remove()}}const Vt={lead:"主角",supporting:"配角",mascot:"吉祥物"},J={lead:"#3b82f6",supporting:"#64748b",mascot:"#ec4899"},ft=[{name:"迪迪",role:"lead"},{name:"克克",role:"lead"},{name:"林林",role:"lead"},{name:"泰泰",role:"lead"},{name:"怪氣流",role:"mascot"},{name:"田鼠先生",role:"mascot"},{name:"田鼠太太",role:"mascot"},{name:"吵鬧菇",role:"mascot"},{name:"穿山甲大叔",role:"supporting"},{name:"花福導遊",role:"supporting"},{name:"達東爸",role:"supporting"},{name:"達東媽",role:"supporting"},{name:"村長",role:"supporting"},{name:"卡爾博士",role:"supporting"},{name:"小達東",role:"supporting"},{name:"阿桂",role:"supporting"}];function Xt(i,e){if(!i)return null;const t=e.find(n=>n.name===i);return t?J[t.role]:null}const qt="voicepicker.author",Kt="voicepicker.comments",Gt="voicepicker.characters";function Ln(){return localStorage.getItem(qt)??""}function Sn(i){localStorage.setItem(qt,i)}function Pn(i){const e=i??{};return{id:typeof e.id=="string"?e.id:Math.random().toString(36).slice(2),author:typeof e.author=="string"?e.author:"",text:typeof e.text=="string"?e.text:"",created:typeof e.created=="number"?e.created:Date.now()}}function Be(i){const e=i??{},t=e.character;let n;Array.isArray(t)?n=t.filter(s=>typeof s=="string"):typeof t=="string"?n=[t]:n=[];const r=Array.isArray(e.replies)?e.replies.map(Pn):[];return{id:typeof e.id=="string"?e.id:Math.random().toString(36).slice(2),file:typeof e.file=="string"?e.file:"",time:typeof e.time=="number"?e.time:null,text:typeof e.text=="string"?e.text:"",author:typeof e.author=="string"?e.author:"",character:n,replies:r,rating:typeof e.rating=="number"?Math.min(5,Math.max(0,Math.round(e.rating))):0}}function Dn(){try{const i=localStorage.getItem(Kt);return i?JSON.parse(i).map(Be):[]}catch{return[]}}function Je(i){localStorage.setItem(Kt,JSON.stringify(i))}function Rn(){try{const i=localStorage.getItem(Gt);return i?JSON.parse(i):[...ft]}catch{return[...ft]}}function Ne(i){localStorage.setItem(Gt,JSON.stringify(i))}const Mn=`<!DOCTYPE html>
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
`,Tn=new Set(["wav","mp3","m4a","aac","ogg","flac","wma","opus"]),gt=4,Nn=1.5,_n=.25,Ye="voicepicker.json";let N=[],U=-1,Ce=null,H="single",j=0,V=null,vt,Pe,_e=null,ee=Ln(),L=Dn(),T=Rn(),Ze=0,se=!0,oe=[],I="text",ue=null,G=null,Oe=null,B=[],W=0,ye=null,De="rating",ce=!1,re=0;const b=i=>document.getElementById(i),bt=b("pick"),yt=b("exportBtn"),Et=b("importBtn"),Re=b("importFile"),xt=b("editChars"),Ct=b("roleViewBtn"),wt=b("filelist"),Jt=b("nowplaying"),Qe=b("status"),Ie=b("playBtn"),On=b("appVer"),In=b("sidebar"),An=b("player"),Me=b("grid"),$=b("roleview"),zn=b("comments"),Bn=b("commentsHead"),Te=b("commentlist"),et=b("composer"),de=b("composerToggle"),pe=b("composerText"),Yt=b("composerChars"),kt=b("composerRatingEl"),We=b("nameModal"),Ae=b("nameInput"),tt=b("charModal"),Lt=b("charEditList"),Ve=b("newCharName"),Wn=b("newCharRole"),Zt=b("addCharBtn"),Hn=b("closeCharBtn"),St=b("ratingsBtn"),Pt=b("shareBtn"),nt=b("shareModal"),$n=b("shareCancelBtn"),Fn=b("shareConfirmBtn"),w=ve.create({container:"#waveform",waveColor:"#7a8ba6",progressColor:"#3b82f6",cursorColor:"#ef4444",height:120}),Xe=w.registerPlugin(Ge.create());w.on("ready",()=>{Qe.textContent=`${ze(0)} / ${ze(w.getDuration())}`});w.on("timeupdate",i=>{Qe.textContent=`${ze(i)} / ${ze(w.getDuration())}`});w.on("play",()=>{Ie.textContent="⏸ 暫停",H==="role"&&Ee()});w.on("pause",()=>{Ie.textContent="▶ 播放",H==="role"&&Ee()});w.on("finish",()=>{H==="single"&&U<N.length-1?te(U+1):H==="role"&&(ye=null,Ee())});Xe.on("region-clicked",(i,e)=>{e.stopPropagation(),w.setTime(i.start),w.play()});Ie.addEventListener("click",()=>{Ie.blur(),w.playPause()});function it(i){if(!isFinite(i))return"0:00";const e=Math.floor(i/60),t=Math.floor(i%60).toString().padStart(2,"0");return`${e}:${t}`}function ze(i){if(!isFinite(i))return"0:00.00";const e=Math.floor(i/60),t=Math.floor(i%60),n=Math.floor((i-Math.floor(i))*100);return`${e}:${t.toString().padStart(2,"0")}.${n.toString().padStart(2,"0")}`}function Qt(){return Math.random().toString(36).slice(2)+Date.now().toString(36)}function qe(i){return i.code==="Enter"||i.code==="NumpadEnter"}function rt(i,e){const t=i.indexOf(e);t>=0?i.splice(t,1):i.push(e)}function he(i){return i.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}function He(){return U>=0&&U<N.length?N[U].name:null}function jn(){return H==="grid"?j>=0&&j<N.length?N[j].name:null:He()}function st(i){return i?L.filter(e=>e.file===i).sort((e,t)=>(e.time??-1/0)-(t.time??-1/0)):[]}function en(i){return L.filter(e=>e.file===i).length}function Un(i){return(i.length?Xt(i[0],T):null)??"#3b82f6"}function Y(){tn(),Fe(),$e(),ae(),H==="role"&&me()}function Z(){var i;ae(),H==="role"&&me(),G&&((i=(H==="role"?$:Te).querySelector(".creply-input input"))==null||i.focus())}function tn(){Je(L),V&&(window.clearTimeout(vt),vt=window.setTimeout(()=>void Vn(),300))}async function Vn(){if(V)try{const e=await(await V.getFileHandle(Ye,{create:!0})).createWritable();await e.write(JSON.stringify({version:1,updated:new Date().toISOString(),comments:L},null,2)),await e.close()}catch{}}function nn(i){const e=new Map(L.map(t=>[t.id,t]));i.forEach(t=>e.set(t.id,t)),L=[...e.values()]}async function Xn(){if(V)try{const e=await(await V.getFileHandle(Ye)).getFile(),t=JSON.parse(await e.text());Array.isArray(t==null?void 0:t.comments)&&(nn(t.comments.map(Be)),Je(L))}catch{}}function qn(){const i=JSON.stringify({version:1,exported:new Date().toISOString(),comments:L,characters:T},null,2),e=new Blob([i],{type:"application/json"}),t=URL.createObjectURL(e),n=new Date,r=a=>String(a).padStart(2,"0"),s=`${n.getFullYear()}${r(n.getMonth()+1)}${r(n.getDate())}-${r(n.getHours())}${r(n.getMinutes())}`,o=document.createElement("a");o.href=t,o.download=`voicepicker-backup-${s}.json`,o.click(),URL.revokeObjectURL(t)}async function Kn(i){try{const e=JSON.parse(await i.text());Array.isArray(e==null?void 0:e.comments)&&nn(e.comments.map(Be)),Array.isArray(e==null?void 0:e.characters)&&e.characters.length>0&&(T=e.characters,Ne(T)),Y(),alert(`匯入完成：目前共 ${L.length} 則留言。`)}catch{alert("匯入失敗：檔案不是有效的 VoicePicker 備份。")}}yt.addEventListener("click",()=>{yt.blur(),qn()});Et.addEventListener("click",()=>{Et.blur(),Re.click()});Re.addEventListener("change",()=>{var e;const i=(e=Re.files)==null?void 0:e[0];i&&Kn(i),Re.value=""});bt.addEventListener("click",async()=>{var e;bt.blur();const i=window.showDirectoryPicker;if(!i){alert("此瀏覽器不支援資料夾選取，請改用 Chrome / Edge。");return}try{V=await i({mode:"readwrite"})}catch{return}N=[];for await(const[t,n]of V.entries()){if(n.kind!=="file")continue;const r=((e=t.split(".").pop())==null?void 0:e.toLowerCase())??"";Tn.has(r)&&N.push({name:t,handle:n})}N.sort((t,n)=>t.name.localeCompare(n.name,"zh-Hant",{numeric:!0})),await Xn(),_e=Date.now(),di(),un(),$e(),N.length>0?(j=0,te(0)):Jt.textContent="此資料夾沒有音檔"});function $e(){wt.innerHTML="",N.forEach((i,e)=>{const t=document.createElement("li");e===U&&(t.className="active");const n=document.createElement("span");n.textContent=i.name,n.style.overflow="hidden",n.style.textOverflow="ellipsis",t.appendChild(n);const r=en(i.name);if(r>0){const s=document.createElement("span");s.className="badge",s.textContent=String(r),t.appendChild(s)}t.addEventListener("click",()=>void te(e)),wt.appendChild(t)})}async function te(i){if(i<0||i>=N.length)return;U=i,j=i,$e();const e=N[i];Jt.textContent=e.name,Qe.textContent="載入中…";const t=await e.handle.getFile();Ce&&URL.revokeObjectURL(Ce),Ce=URL.createObjectURL(t),await w.load(Ce),Fe(),ae(),w.play()}function Fe(){Xe.clearRegions(),st(He()).filter(e=>e.time!==null).forEach((e,t)=>{Xe.addRegion({start:e.time,content:String(t+1),color:Un(e.character),drag:!1,resize:!1})})}function Gn(i,e){const t=document.createElement("div");t.className="c-rating";for(let n=1;n<=5;n++){const r=document.createElement("button");r.type="button",r.className="c-star"+(n<=i.rating?" filled":""),r.textContent="★",r.title=`${n} 分${i.rating===n?"（再按清除）":""}`,r.addEventListener("click",s=>{s.stopPropagation(),i.rating=i.rating===n?0:n,Y()}),t.appendChild(r)}e.appendChild(t)}function rn(i,e={}){const t=document.createElement("div");t.className="citem"+(e.role?" role":"")+(e.focused?" rolefocus":""),e.role&&e.ridx!==void 0&&(t.dataset.ridx=String(e.ridx));let n=t;if(e.role){const d=document.createElement("div");d.className="card-inner";const u=document.createElement("div");u.className="card-main";const p=document.createElement("button");p.className="cplay",p.dataset.cid=i.id,p.textContent=ye===i.id&&w.isPlaying()?"⏸":"▶",p.addEventListener("click",m=>{m.stopPropagation(),an(i,e.ridx)}),d.append(u,p),t.appendChild(d),n=u}const r=document.createElement("div");r.className="crow";const s=document.createElement("span");if(i.time===null?(s.className="ctime general",s.textContent="整體"):(s.className="ctime",s.textContent=it(i.time),s.addEventListener("click",d=>{d.stopPropagation(),Ke(i)})),r.appendChild(s),e.role){const d=document.createElement("span");if(d.className="cfile",d.textContent=i.file,e.badge){const u=document.createElement("span");u.className="cfile-badge",u.textContent=e.badge,d.appendChild(u)}d.addEventListener("click",u=>{u.stopPropagation(),Ke(i)}),r.appendChild(d)}const o=document.createElement("span");o.className="cauthor",o.textContent=i.author,r.appendChild(o);const a=document.createElement("button");a.className="cdel",a.textContent="×",a.title="刪除",a.addEventListener("click",d=>{d.stopPropagation(),L=L.filter(u=>u.id!==i.id),Y()}),r.appendChild(a),n.appendChild(r),Gn(i,n);const l=document.createElement("div");l.className="ctext",l.textContent=i.text,l.addEventListener("dblclick",d=>{d.stopPropagation(),l.contentEditable="true",l.focus()}),l.addEventListener("keydown",d=>{d.isComposing||d.key==="Enter"&&!d.shiftKey&&(d.preventDefault(),l.blur())}),l.addEventListener("blur",()=>{l.contentEditable="false";const d=(l.innerText??"").trim();d?(i.text=d,Y()):l.textContent=i.text}),n.appendChild(l);const c=document.createElement("div");if(c.className="ctag-row",Jn(i,c),n.appendChild(c),i.replies.length){const d=document.createElement("div");d.className="creplies",i.replies.forEach(u=>{const p=document.createElement("div");p.className="creply";const m=document.createElement("span");m.className="crauthor",m.textContent=u.author+"：";const g=document.createElement("span");g.textContent=u.text;const f=document.createElement("button");f.className="crdel",f.textContent="×",f.addEventListener("click",y=>{y.stopPropagation(),i.replies=i.replies.filter(E=>E.id!==u.id),Y()}),p.append(m,g,f),d.appendChild(p)}),n.appendChild(d)}const h=document.createElement("div");if(h.className="creply-input",G===i.id){const d=document.createElement("input");d.type="text",d.placeholder="回覆…（Enter 送出 / Esc 取消）",d.addEventListener("keydown",p=>{p.stopPropagation(),!p.isComposing&&(p.key==="Enter"?(p.preventDefault(),Rt(i,d.value)):p.key==="Escape"&&(p.preventDefault(),G=null,Z()))});const u=document.createElement("button");u.textContent="送出",u.addEventListener("click",p=>{p.stopPropagation(),Rt(i,d.value)}),h.append(d,u)}else{const d=document.createElement("button");d.className="creply-toggle",d.textContent="＋ 回覆",d.addEventListener("click",u=>{if(u.stopPropagation(),!ee){je(()=>{G=i.id,Z()});return}G=i.id,Z()}),h.appendChild(d)}return n.appendChild(h),t}function Jn(i,e){if(ue===i.id){const t=document.createElement("div");t.className="char-picker",ln(t,i.character,r=>{rt(i.character,r),Y()});const n=document.createElement("button");n.type="button",n.className="charchip done",n.textContent="完成",n.addEventListener("click",r=>{r.stopPropagation(),ue=null,Z()}),t.appendChild(n),e.appendChild(t)}else if(i.character.length>0)i.character.forEach(t=>{const n=document.createElement("span");n.className="ctag",n.style.background=Xt(t,T)??"#3b82f6",n.textContent=t,n.addEventListener("click",r=>{r.stopPropagation(),ue=i.id,Z()}),e.appendChild(n)});else{const t=document.createElement("span");t.className="ctag empty",t.textContent="＋ 角色",t.addEventListener("click",n=>{n.stopPropagation(),ue=i.id,Z()}),e.appendChild(t)}}function ae(){const i=jn();Bn.textContent=i?`留言 · ${i}`:"留言",Te.innerHTML="";const e=st(i);if(e.length===0){const t=document.createElement("li");t.style.color="var(--muted)",t.style.fontSize="13px",t.textContent=i?"尚無留言。播放時按 C 新增。":"尚未選擇檔案。",Te.appendChild(t);return}e.forEach(t=>Te.appendChild(rn(t)))}function sn(i,e){const t=[...i];return e==="rating"?t.sort((n,r)=>r.rating-n.rating||n.file.localeCompare(r.file,"zh-Hant",{numeric:!0})||(n.time??-1/0)-(r.time??-1/0)):e==="file"?t.sort((n,r)=>n.file.localeCompare(r.file,"zh-Hant",{numeric:!0})||(n.time??-1/0)-(r.time??-1/0)):t.sort((n,r)=>n.author.localeCompare(r.author,"zh-Hant")||n.file.localeCompare(r.file,"zh-Hant",{numeric:!0})||(n.time??-1/0)-(r.time??-1/0)),t}function Yn(i){return sn(L.filter(e=>e.character.includes(i)),De)}function me(){$.innerHTML="",B=[],$.classList.toggle("role-compact",ce);const i=document.createElement("div");i.className="role-head";const e=document.createElement("h2");e.textContent="角色 Dashboard";const t=document.createElement("button");t.className="ghost",t.textContent="返回單檔",t.addEventListener("click",()=>K("single"));const n=document.createElement("span");n.className="role-hint",n.textContent="↑↓ 移動 · 空白鍵 就地播放 · Enter 進單檔 · Tab/Esc 返回";const r=document.createElement("div");r.className="role-sort-toggle",["rating","file","user"].forEach(d=>{const u=d==="rating"?"評分":d==="file"?"檔案":"使用者",p=document.createElement("button");p.className="role-sort-btn"+(De===d?" active":""),p.textContent=u,p.addEventListener("click",()=>{De=d,me()}),r.appendChild(p)});const s=document.createElement("button");s.className="role-compact-btn"+(ce?" active":""),s.textContent="簡潔",s.title="隱藏回覆與角色標籤，雙欄顯示",s.addEventListener("click",()=>{ce=!ce,$.classList.toggle("role-compact",ce),s.classList.toggle("active",ce)}),i.append(e,t,n,r,s),$.appendChild(i);const o=["lead","mascot","supporting"],a=L.filter(d=>d.character.length===0).length,l=document.createElement("div");l.className="role-stats-wrap";let c=null;if(o.forEach(d=>{const u=T.filter(g=>g.role===d);if(u.length===0)return;const p=document.createElement("div");p.className="role-stats-row",d==="supporting"&&(c=p);const m=document.createElement("span");m.className="role-stats-type",m.textContent=Vt[d],m.style.color=J[d],p.appendChild(m),u.forEach(g=>{const f=L.filter(E=>E.character.includes(g.name)).length,y=document.createElement("button");y.className="role-stat"+(f===0?" zero":""),y.style.background=J[g.role],y.textContent=`${g.name} ${f}`,y.addEventListener("click",()=>{var E;(E=$.querySelector(`[data-char="${g.name}"]`))==null||E.scrollIntoView({behavior:"smooth",block:"start"})}),p.appendChild(y)}),l.appendChild(p)}),a>0){const d=document.createElement("button");if(d.className="role-stat",d.style.background="#64748b",d.textContent=`未指定 ${a}`,d.addEventListener("click",()=>{var u;(u=$.querySelector('[data-char="__none__"]'))==null||u.scrollIntoView({behavior:"smooth",block:"start"})}),c)c.appendChild(d);else{const u=document.createElement("div");u.className="role-stats-row",u.appendChild(d),l.appendChild(u)}}$.appendChild(l);const h=(d,u,p)=>{if(p.length===0)return;const m=document.createElement("div");m.className="role-group",m.dataset.char=d;const g=document.createElement("div");g.className="role-group-label",g.style.background=u,g.textContent=d==="__none__"?"未指定":d,m.appendChild(g);const f=document.createElement("div");f.className="role-group-cards-wrap";const y=p.reduce((E,P)=>Math.max(E,P.rating),0);p.forEach(E=>{const P=B.length,k=E.rating===0?"👎":E.rating===y?"🏆":void 0;f.appendChild(rn(E,{role:!0,ridx:P,focused:P===W,badge:k})),B.push(E)}),m.appendChild(f),$.appendChild(m)};if(T.forEach(d=>h(d.name,J[d.role],Yn(d.name))),h("__none__","#64748b",sn(L.filter(d=>d.character.length===0),De)),B.length===0){const d=document.createElement("div");d.style.color="var(--muted)",d.textContent="尚無留言。",$.appendChild(d)}W>=B.length&&(W=Math.max(0,B.length-1))}function Ee(){$.querySelectorAll(".cplay").forEach(i=>{i.textContent=ye===i.dataset.cid&&w.isPlaying()?"⏸":"▶"})}function on(){$.querySelectorAll(".citem").forEach(i=>{const e=i.dataset.ridx===String(W);i.classList.toggle("rolefocus",e),e&&i.scrollIntoView({block:"nearest"})})}function Dt(i){B.length!==0&&(W=Math.min(Math.max(0,W+i),B.length-1),on())}async function Zn(i,e){const t=N.findIndex(r=>r.name===i.file);if(t<0)return;t!==U&&await te(t),w.setTime(i.time??0),w.play(),ye=i.id;const n=e!==void 0?e:B.indexOf(i);n>=0&&(W=n,on()),Ee()}function an(i,e){if(ye===i.id&&w.isPlaying()){w.pause(),Ee();return}Zn(i,e)}async function Ke(i){const e=N.findIndex(t=>t.name===i.file);e<0||(H!=="single"&&K("single"),e!==U&&await te(e),i.time!==null&&w.setTime(i.time),w.play())}function ln(i,e,t,n){i.innerHTML="",T.forEach((r,s)=>{const o=document.createElement("button");o.type="button",o.className="charchip"+(s===n?" focused":""),o.textContent=r.name,o.style.borderColor=J[r.role],e.includes(r.name)&&(o.style.background=J[r.role],o.style.color="#fff"),o.addEventListener("click",a=>{a.stopPropagation(),t(r.name)}),i.appendChild(o)})}function Rt(i,e){const t=e.trim();if(!t){G=null,Z();return}const n=()=>{i.replies.push({id:Qt(),author:ee,text:t,created:Date.now()}),G=null,Y()};ee?n():je(n)}function Qn(){if(!(U<0)){if(!ee){je(()=>Mt());return}Mt()}}function Mt(){w.pause(),Ze=w.getCurrentTime(),se=!0,pe.value="",oe=[],re=0,I="text",F(),et.classList.remove("hidden"),pe.focus()}function cn(){et.classList.add("hidden"),I="text"}function ot(){kt.innerHTML="";for(let i=1;i<=5;i++){const e=document.createElement("button");e.type="button",e.className="c-star"+(i<=re?" filled":""),e.textContent="★",e.title=`${i} 分`,e.addEventListener("click",t=>{t.stopPropagation(),re=re===i?0:i,ot()}),kt.appendChild(e)}}function F(){ei(),dn(),ot()}function ei(){se?(de.textContent=`對應秒數 ${it(Ze)}`,de.classList.remove("off")):(de.textContent="整體留言（不對應秒數）",de.classList.add("off")),de.classList.toggle("focused",I==="toggle")}function dn(){ln(Yt,oe,e=>{rt(oe,e),dn()},typeof I=="number"?I:void 0)}function Tt(){const i=pe.value.trim();if(cn(),!i)return;const e=He();e&&(L.push({id:Qt(),file:e,time:se?Ze:null,text:i,author:ee,character:[...oe],replies:[],rating:re}),Y())}function Nt(){I="toggle",pe.blur(),F()}function _t(){I="text",F(),pe.focus()}function ti(){if(T.length===0)return;const i=oe.length?T.findIndex(e=>e.name===oe[0]):-1;I=i>=0?i:0,pe.blur(),F()}function ni(i){rt(oe,T[i].name),F()}function we(i,e){const t=Array.from(Yt.children);if(t.length===0)return i;const n=t.map(h=>h.getBoundingClientRect()),r=n[i],s=r.left+r.width/2,o=r.top+r.height/2,a=r.height/2;if(e==="left"||e==="right"){let h=-1,d=1/0;return n.forEach((u,p)=>{if(p===i||Math.abs(u.top+u.height/2-o)>a)return;const m=u.left+u.width/2;e==="left"&&m<s&&s-m<d&&(d=s-m,h=p),e==="right"&&m>s&&m-s<d&&(d=m-s,h=p)}),h>=0?h:i}let l=-1,c=1/0;return n.forEach((h,d)=>{if(d===i)return;const u=h.top+h.height/2;if(!(e==="up"?u<o-a:u>o+a))return;const m=Math.abs(u-o)*1e3+Math.abs(h.left+h.width/2-s);m<c&&(c=m,l=d)}),e==="up"&&l<0?"toggle":l>=0?l:i}function ii(i){if(i.isComposing)return;if(i.shiftKey&&/^Digit[0-5]$/.test(i.code)){i.preventDefault();const t=parseInt(i.code[5]);re=re===t?0:t,ot();return}if(i.code==="Escape"){i.preventDefault(),cn();return}if(I==="text"){if(qe(i)&&!i.shiftKey){i.preventDefault(),Tt();return}if(i.code==="ArrowDown"||i.code==="Tab"){i.preventDefault(),Nt();return}return}if(qe(i)){i.preventDefault(),Tt();return}if(I==="toggle"){switch(i.code){case"Space":i.preventDefault(),se=!se,F();break;case"ArrowUp":i.preventDefault(),_t();break;case"ArrowDown":case"Tab":i.preventDefault(),ti();break}return}const e=I;switch(i.code){case"Space":i.preventDefault(),ni(e);break;case"ArrowRight":{i.preventDefault();const t=we(e,"right");typeof t=="number"&&(I=t,F());break}case"ArrowLeft":{i.preventDefault();const t=we(e,"left");typeof t=="number"&&(I=t,F());break}case"ArrowDown":{i.preventDefault();const t=we(e,"down");typeof t=="number"&&(I=t,F());break}case"ArrowUp":{i.preventDefault();const t=we(e,"up");t==="toggle"?Nt():(I=t,F());break}case"Tab":i.preventDefault(),_t();break}}de.addEventListener("click",()=>{se=!se,F()});function je(i){Oe=i,Ae.value=ee,We.classList.remove("hidden"),Ae.focus()}function ri(){const i=Ae.value.trim();if(!i)return;ee=i,Sn(i),We.classList.add("hidden");const e=Oe;Oe=null,e&&e()}Ae.addEventListener("keydown",i=>{i.stopPropagation(),!i.isComposing&&(i.key==="Enter"?(i.preventDefault(),ri()):i.key==="Escape"&&(i.preventDefault(),We.classList.add("hidden"),Oe=null))});xt.addEventListener("click",()=>{xt.blur(),ge(),tt.classList.remove("hidden")});function ge(){Lt.innerHTML="",T.forEach((i,e)=>{const t=document.createElement("li"),n=document.createElement("span");n.className="dot",n.style.background=J[i.role];const r=document.createElement("span");r.textContent=i.name,r.title="雙擊重命名",r.style.cursor="pointer",r.addEventListener("dblclick",()=>{const a=document.createElement("input");a.type="text",a.value=i.name,a.style.cssText="font-size:13px;width:120px;padding:2px 6px",t.replaceChild(a,r),a.focus(),a.select();const l=()=>{const c=a.value.trim();if(c&&c!==i.name){const h=i.name;i.name=c,L.forEach(d=>{const u=d.character.indexOf(h);u>=0&&(d.character[u]=c)}),Ne(T),tn()}ge()};a.addEventListener("keydown",c=>{c.stopPropagation(),c.key==="Enter"?(c.preventDefault(),l()):c.key==="Escape"&&(c.preventDefault(),ge())}),a.addEventListener("blur",l)});const s=document.createElement("span");s.className="role",s.textContent=Vt[i.role];const o=document.createElement("button");o.className="rm",o.textContent="刪除",o.addEventListener("click",()=>{T.splice(e,1),Ne(T),ge()}),t.append(n,r,s,o),Lt.appendChild(t)})}Zt.addEventListener("click",()=>{const i=Ve.value.trim();i&&(T.push({name:i,role:Wn.value}),Ne(T),Ve.value="",ge())});Ve.addEventListener("keydown",i=>{i.stopPropagation(),!i.isComposing&&i.key==="Enter"&&(i.preventDefault(),Zt.click())});Hn.addEventListener("click",()=>{tt.classList.add("hidden"),Fe(),ae(),H==="role"&&me()});function Ot(i){const e=w.getDuration();!isFinite(e)||e===0||w.setTime(Math.min(Math.max(0,w.getCurrentTime()+i),e))}function It(i){const e=st(He()).filter(r=>r.time!==null).map(r=>r.time);if(e.length===0)return;const t=w.getCurrentTime();let n;if(i<0){for(let r=e.length-1;r>=0;r--)if(e[r]<t-Nn){n=e[r];break}n??(n=e[0])}else{for(let r=0;r<e.length;r++)if(e[r]>t+_n){n=e[r];break}n??(n=e[e.length-1])}w.setTime(n)}function K(i){H=i;const e=i==="single",t=i==="grid",n=i==="role";(t||n)&&w.pause(),In.classList.toggle("hidden",!e),An.classList.toggle("hidden",!e),Me.classList.toggle("hidden",!t),$.classList.toggle("hidden",!n),zn.classList.toggle("hidden",n),t&&hn(),n&&(W=0,me()),ae()}function hn(){Me.innerHTML="";const i=document.createElement("div");i.className="gridhint",i.textContent="WASD／方向鍵 移動 · 空白鍵或 Enter 開啟 · Tab 返回單檔",Me.appendChild(i),N.forEach((e,t)=>{const n=document.createElement("div");n.className="gridcard"+(t===j?" selected":""),n.innerHTML=`<div class="gc-name">${he(e.name)}</div><div class="gc-meta">${en(e.name)} 則留言</div>`,n.addEventListener("click",()=>{j=t,K("single"),te(t)}),Me.appendChild(n)})}function ke(i){const e=N.length;e!==0&&(j=Math.min(Math.max(0,j+i),e-1),hn(),ae())}function si(){const i=document.activeElement;return i?i.tagName==="INPUT"||i.tagName==="TEXTAREA"||i.isContentEditable:!1}function oi(){return!We.classList.contains("hidden")||!tt.classList.contains("hidden")}document.addEventListener("keydown",i=>{if(!et.classList.contains("hidden")){ii(i);return}if(!i.isComposing){if(ue!==null&&i.code==="Escape"){i.preventDefault(),ue=null,Z();return}if(G!==null&&i.code==="Escape"){i.preventDefault(),G=null,Z();return}if(!(oi()||si())){if(H==="role"){if(i.shiftKey&&/^Digit[0-5]$/.test(i.code)){i.preventDefault();const e=parseInt(i.code[5]),t=B[W];t&&(t.rating=t.rating===e?0:e,Y());return}if(i.code==="Tab"||i.code==="Escape"){i.preventDefault(),K("single");return}switch(i.code){case"ArrowUp":case"KeyW":i.preventDefault(),Dt(-1);break;case"ArrowDown":case"KeyS":i.preventDefault(),Dt(1);break;case"Space":i.preventDefault(),B[W]&&an(B[W],W);break;case"Enter":case"NumpadEnter":i.preventDefault(),B[W]&&Ke(B[W]);break}return}if(H==="grid"){if(qe(i)){i.preventDefault(),K("single"),te(j);return}switch(i.code){case"KeyA":case"ArrowLeft":i.preventDefault(),ke(-1);break;case"KeyD":case"ArrowRight":i.preventDefault(),ke(1);break;case"KeyW":case"ArrowUp":i.preventDefault(),ke(-gt);break;case"KeyS":case"ArrowDown":i.preventDefault(),ke(gt);break;case"Space":i.preventDefault(),K("single"),te(j);break;case"Tab":i.preventDefault(),K("single");break}return}switch(i.code){case"Space":i.preventDefault(),w.playPause();break;case"KeyA":case"ArrowLeft":i.preventDefault(),Ot(-5);break;case"KeyD":case"ArrowRight":i.preventDefault(),Ot(5);break;case"KeyW":case"ArrowUp":i.preventDefault(),It(-1);break;case"KeyS":case"ArrowDown":i.preventDefault(),It(1);break;case"KeyC":case"KeyX":i.preventDefault(),Qn();break;case"Tab":i.preventDefault(),N.length&&K("grid");break}}}});function ai(){let i="";const e=(s,o)=>o.rating-s.rating||s.file.localeCompare(o.file,"zh-Hant",{numeric:!0})||(s.time??-1/0)-(o.time??-1/0),t=(s,o,a)=>{if(a.length===0)return;const l=a.map(c=>{const h=c.rating>0?"★".repeat(c.rating)+"☆".repeat(5-c.rating):"",d=c.time!==null?it(c.time):"整體";return`<tr>
        <td class="tc">${he(d)}</td>
        <td class="fn">${he(c.file)}</td>
        <td class="cm">${he(c.text)}</td>
        <td class="sr">${h}</td>
        <td class="au">${he(c.author)}</td>
      </tr>`}).join("");i+=`<div class="section">
  <div class="slabel" style="background:${o}">${he(s==="__none__"?"未指定":s)}</div>
  <table><thead><tr>
    <th class="tc">時間</th><th class="fn">音檔</th><th class="cm">評語</th><th class="sr">評分</th><th class="au">留言者</th>
  </tr></thead><tbody>${l}</tbody></table>
</div>`};T.forEach(s=>t(s.name,J[s.role],L.filter(o=>o.character.includes(s.name)).sort(e))),t("__none__","#64748b",L.filter(s=>s.character.length===0).sort(e));const n=`<!DOCTYPE html>
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
<div class="sub">產出時間：${new Date().toLocaleString("zh-Hant")} · 共 ${L.length} 則留言</div>
${i||'<p style="color:#9ca3af">尚無留言</p>'}
</body></html>`,r=window.open("","_blank","width=900,height=800");if(!r){alert("請允許開啟新分頁（檢查彈出視窗封鎖設定）");return}r.document.write(n),r.document.close(),setTimeout(()=>r.print(),600)}St.addEventListener("click",()=>{St.blur(),ai()});const li=1e4;function ci(i){const e=new Set(L.map(n=>n.id)),t=i.map(Be).filter(n=>!e.has(n.id));return t.length===0?0:(L=[...L,...t],t.length)}function di(){At(),Pe=window.setInterval(async()=>{if(!V){At();return}try{const e=await(await V.getFileHandle(Ye)).getFile(),t=JSON.parse(await e.text());if(!Array.isArray(t==null?void 0:t.comments))return;const n=ci(t.comments);_e=Date.now(),un(),n>0&&(Je(L),Fe(),$e(),ae(),H==="role"&&me(),hi(`已同步 ${n} 則新留言`))}catch{}},li)}function At(){Pe!==void 0&&(window.clearInterval(Pe),Pe=void 0)}function un(){const i=document.getElementById("syncStatus");if(!i)return;if(!V){i.textContent="";return}const e=_e?new Date(_e).toLocaleTimeString("zh-Hant",{hour:"2-digit",minute:"2-digit",second:"2-digit"}):"—";i.textContent=`↺ 協作同步中 · ${e}`}let zt;function hi(i){const e=document.getElementById("syncToast");e&&(e.textContent=i,e.classList.remove("hidden"),window.clearTimeout(zt),zt=window.setTimeout(()=>e.classList.add("hidden"),3e3))}function ui(){const i=l=>JSON.stringify(l).replace(/</g,"\\u003c").replace(/>/g,"\\u003e").replace(/&/g,"\\u0026"),e=Mn.replace("{{DATA_JSON}}",()=>i({comments:L,characters:T,roleColors:J})),t=new Blob([e],{type:"text/html;charset=utf-8"}),n=URL.createObjectURL(t),r=new Date,s=l=>String(l).padStart(2,"0"),o=`${r.getFullYear()}${s(r.getMonth()+1)}${s(r.getDate())}-${s(r.getHours())}${s(r.getMinutes())}`,a=document.createElement("a");a.href=n,a.download=`voicepicker-share-${o}.html`,a.click(),URL.revokeObjectURL(n)}Pt.addEventListener("click",()=>{Pt.blur(),nt.classList.remove("hidden")});$n.addEventListener("click",()=>nt.classList.add("hidden"));Fn.addEventListener("click",()=>{nt.classList.add("hidden"),ui()});Ct.addEventListener("click",()=>{Ct.blur(),K("role")});On.textContent="v0.9.0";ee||je(null);
