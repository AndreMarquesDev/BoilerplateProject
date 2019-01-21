const project = project || {};

project.utils = (() => {

    return {

        init() {
            const view = this;

            view.polyfills();
        },

        polyfills() {
            // Matches polyfill
            Element.prototype.matches||(Element.prototype.matches=Element.prototype.matchesSelector||Element.prototype.mozMatchesSelector||Element.prototype.msMatchesSelector||Element.prototype.oMatchesSelector||Element.prototype.webkitMatchesSelector||function(a){const b=(this.document||this.ownerDocument).querySelectorAll(a),c=b.length;for(;0<=--c&&b.item(c)!==this;);return-1<c});

            // Includes polyfill
            Array.prototype.includes||Object.defineProperty(Array.prototype,'includes',{enumerable:!1,value:function(a){var b=this.filter(function(c){return c==a});return 0<b.length}});
            String.prototype.includes||(String.prototype.includes=function(a,b){return'number'!=typeof b&&(b=0),!(b+a.length>this.length)&&-1!==this.indexOf(a,b)});

            // Nodelist forEach polyfill
            window.NodeList&&!NodeList.prototype.forEach&&(NodeList.prototype.forEach=function(a,b){b=b||window;for(let c=0;c<this.length;c++)a.call(b,this[c],c,this)});

            // Closest polyfill
            Element.prototype.closest||(Element.prototype.closest=function(a){var b=this,c=this;if(!document.documentElement.contains(b))return null;do{if(c.matches(a))return c;c=c.parentElement}while(null!==c);return null});

			// Dataset polyfill
			if(!document.documentElement.dataset&&(!Object.getOwnPropertyDescriptor(HTMLElement.prototype,'dataset')||!Object.getOwnPropertyDescriptor(HTMLElement.prototype,'dataset').get)){const a={};a.enumerable=!0,a.get=function(){function c(j){return j.charAt(1).toUpperCase()}function d(){return this.value}function e(j,k){'undefined'==typeof k?this.removeAttribute(j):this.setAttribute(j,k)}const f=this,g={},h=this.attributes;for(let j=0;j<h.length;j++){const k=h[j];if(k&&k.name&&/^data-\w[\w-]*$/.test(k.name)){const l=k.name,m=k.value,n=l.substr(5).replace(/-./g,c);Object.defineProperty(g,n,{enumerable:a.enumerable,get:d.bind({value:m||''}),set:e.bind(f,l)})}}return g},Object.defineProperty(HTMLElement.prototype,'dataset',a)};

            // Remove polyfill
            'remove'in Element.prototype||(Element.prototype.remove=function(){this.parentNode&&this.parentNode.removeChild(this)});

            // Append After Prototype
            Element.prototype.appendAfter=function(a){NodeList.prototype.isPrototypeOf(a)?a.forEach(b=>b.parentNode.insertBefore(this,b.nextSibling)):a.parentNode.insertBefore(this,a.nextSibling)},!1;

            // Promise polyfill
            (function(a,b){'object'==typeof exports&&'undefined'!=typeof module?b():'function'==typeof define&&define.amd?define(b):b()})(this,function(){'use strict';function a(o){var p=this.constructor;return this.then(function(q){return p.resolve(o()).then(function(){return q})},function(q){return p.resolve(o()).then(function(){return p.reject(q)})})}function b(){}function c(o,p){return function(){o.apply(p,arguments)}}function d(o){if(!(this instanceof d))throw new TypeError('Promises must be constructed via new');if('function'!=typeof o)throw new TypeError('not a function');this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],l(o,this)}function f(o,p){for(;3===o._state;)o=o._value;return 0===o._state?void o._deferreds.push(p):void(o._handled=!0,d._immediateFn(function(){var q=1===o._state?p.onFulfilled:p.onRejected;if(null===q)return void(1===o._state?g:h)(p.promise,o._value);var r;try{r=q(o._value)}catch(s){return void h(p.promise,s)}g(p.promise,r)}))}function g(o,p){try{if(p===o)throw new TypeError('A promise cannot be resolved with itself.');if(p&&('object'==typeof p||'function'==typeof p)){var q=p.then;if(p instanceof d)return o._state=3,o._value=p,void j(o);if('function'==typeof q)return void l(c(q,p),o)}o._state=1,o._value=p,j(o)}catch(r){h(o,r)}}function h(o,p){o._state=2,o._value=p,j(o)}function j(o){2===o._state&&0===o._deferreds.length&&d._immediateFn(function(){o._handled||d._unhandledRejectionFn(o._value)});for(var p=0,q=o._deferreds.length;p<q;p++)f(o,o._deferreds[p]);o._deferreds=null}function k(o,p,q){this.onFulfilled='function'==typeof o?o:null,this.onRejected='function'==typeof p?p:null,this.promise=q}function l(o,p){var q=!1;try{o(function(r){q||(q=!0,g(p,r))},function(r){q||(q=!0,h(p,r))})}catch(r){if(q)return;q=!0,h(p,r)}}var m=setTimeout;d.prototype['catch']=function(o){return this.then(null,o)},d.prototype.then=function(o,p){var q=new this.constructor(b);return f(this,new k(o,p,q)),q},d.prototype['finally']=a,d.all=function(o){return new d(function(p,q){function r(v,w){try{if(w&&('object'==typeof w||'function'==typeof w)){var x=w.then;if('function'==typeof x)return void x.call(w,function(y){r(v,y)},q)}s[v]=w,0==--t&&p(s)}catch(y){q(y)}}if(!o||'undefined'==typeof o.length)throw new TypeError('Promise.all accepts an array');var s=Array.prototype.slice.call(o);if(0===s.length)return p([]);for(var t=s.length,u=0;u<s.length;u++)r(u,s[u])})},d.resolve=function(o){return o&&'object'==typeof o&&o.constructor===d?o:new d(function(p){p(o)})},d.reject=function(o){return new d(function(p,q){q(o)})},d.race=function(o){return new d(function(p,q){for(var r=0,s=o.length;r<s;r++)o[r].then(p,q)})},d._immediateFn='function'==typeof setImmediate&&function(o){setImmediate(o)}||function(o){m(o,0)},d._unhandledRejectionFn=function(p){'undefined'!=typeof console&&console&&console.warn('Possible Unhandled Promise Rejection:',p)};var n=function(){if('undefined'!=typeof self)return self;if('undefined'!=typeof window)return window;if('undefined'!=typeof global)return global;throw new Error('unable to locate global object')}();'Promise'in n?!n.Promise.prototype['finally']&&(n.Promise.prototype['finally']=a):n.Promise=d});

            // Fecth polyfill
            (function(a,b){'object'==typeof exports&&'undefined'!=typeof module?b(exports):'function'==typeof define&&define.amd?define(['exports'],b):b(a.WHATWGFetch={})})(this,function(a){'use strict';function b(A){return A&&DataView.prototype.isPrototypeOf(A)}function c(A){if('string'!=typeof A&&(A+=''),/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(A))throw new TypeError('Invalid character in header field name');return A.toLowerCase()}function d(A){return'string'!=typeof A&&(A+=''),A}function f(A){var B={next:function(){var C=A.shift();return{done:void 0===C,value:C}}};return v.iterable&&(B[Symbol.iterator]=function(){return B}),B}function g(A){this.map={},A instanceof g?A.forEach(function(B,C){this.append(C,B)},this):Array.isArray(A)?A.forEach(function(B){this.append(B[0],B[1])},this):A&&Object.getOwnPropertyNames(A).forEach(function(B){this.append(B,A[B])},this)}function h(A){return A.bodyUsed?Promise.reject(new TypeError('Already read')):void(A.bodyUsed=!0)}function j(A){return new Promise(function(B,C){A.onload=function(){B(A.result)},A.onerror=function(){C(A.error)}})}function k(A){var B=new FileReader,C=j(B);return B.readAsArrayBuffer(A),C}function l(A){var B=new FileReader,C=j(B);return B.readAsText(A),C}function m(A){for(var B=new Uint8Array(A),C=Array(B.length),D=0;D<B.length;D++)C[D]=String.fromCharCode(B[D]);return C.join('')}function n(A){if(A.slice)return A.slice(0);var B=new Uint8Array(A.byteLength);return B.set(new Uint8Array(A)),B.buffer}function o(){return this.bodyUsed=!1,this._initBody=function(A){this._bodyInit=A,A?'string'==typeof A?this._bodyText=A:v.blob&&Blob.prototype.isPrototypeOf(A)?this._bodyBlob=A:v.formData&&FormData.prototype.isPrototypeOf(A)?this._bodyFormData=A:v.searchParams&&URLSearchParams.prototype.isPrototypeOf(A)?this._bodyText=A.toString():v.arrayBuffer&&v.blob&&b(A)?(this._bodyArrayBuffer=n(A.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer])):v.arrayBuffer&&(ArrayBuffer.prototype.isPrototypeOf(A)||x(A))?this._bodyArrayBuffer=n(A):this._bodyText=A=Object.prototype.toString.call(A):this._bodyText='',this.headers.get('content-type')||('string'==typeof A?this.headers.set('content-type','text/plain;charset=UTF-8'):this._bodyBlob&&this._bodyBlob.type?this.headers.set('content-type',this._bodyBlob.type):v.searchParams&&URLSearchParams.prototype.isPrototypeOf(A)&&this.headers.set('content-type','application/x-www-form-urlencoded;charset=UTF-8'))},v.blob&&(this.blob=function(){var A=h(this);if(A)return A;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw new Error('could not read FormData body as blob');else return Promise.resolve(new Blob([this._bodyText]))},this.arrayBuffer=function(){return this._bodyArrayBuffer?h(this)||Promise.resolve(this._bodyArrayBuffer):this.blob().then(k)}),this.text=function(){var A=h(this);if(A)return A;if(this._bodyBlob)return l(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(m(this._bodyArrayBuffer));if(this._bodyFormData)throw new Error('could not read FormData body as text');else return Promise.resolve(this._bodyText)},v.formData&&(this.formData=function(){return this.text().then(r)}),this.json=function(){return this.text().then(JSON.parse)},this}function p(A){var B=A.toUpperCase();return-1<y.indexOf(B)?B:A}function q(A,B){B=B||{};var C=B.body;if(A instanceof q){if(A.bodyUsed)throw new TypeError('Already read');this.url=A.url,this.credentials=A.credentials,B.headers||(this.headers=new g(A.headers)),this.method=A.method,this.mode=A.mode,this.signal=A.signal,C||null==A._bodyInit||(C=A._bodyInit,A.bodyUsed=!0)}else this.url=A+'';if(this.credentials=B.credentials||this.credentials||'same-origin',(B.headers||!this.headers)&&(this.headers=new g(B.headers)),this.method=p(B.method||this.method||'GET'),this.mode=B.mode||this.mode||null,this.signal=B.signal||this.signal,this.referrer=null,('GET'===this.method||'HEAD'===this.method)&&C)throw new TypeError('Body not allowed for GET or HEAD requests');this._initBody(C)}function r(A){var B=new FormData;return A.trim().split('&').forEach(function(C){if(C){var D=C.split('='),E=D.shift().replace(/\+/g,' '),F=D.join('=').replace(/\+/g,' ');B.append(decodeURIComponent(E),decodeURIComponent(F))}}),B}function s(A){var B=new g,C=A.replace(/\r?\n[\t ]+/g,' ');return C.split(/\r?\n/).forEach(function(D){var E=D.split(':'),F=E.shift().trim();if(F){var G=E.join(':').trim();B.append(F,G)}}),B}function t(A,B){B||(B={}),this.type='default',this.status=B.status===void 0?200:B.status,this.ok=200<=this.status&&300>this.status,this.statusText='statusText'in B?B.statusText:'OK',this.headers=new g(B.headers),this.url=B.url||'',this._initBody(A)}function u(A,B){return new Promise(function(C,D){function E(){G.abort()}var F=new q(A,B);if(F.signal&&F.signal.aborted)return D(new a.DOMException('Aborted','AbortError'));var G=new XMLHttpRequest;G.onload=function(){var H={status:G.status,statusText:G.statusText,headers:s(G.getAllResponseHeaders()||'')};H.url='responseURL'in G?G.responseURL:H.headers.get('X-Request-URL');var I='response'in G?G.response:G.responseText;C(new t(I,H))},G.onerror=function(){D(new TypeError('Network request failed'))},G.ontimeout=function(){D(new TypeError('Network request failed'))},G.onabort=function(){D(new a.DOMException('Aborted','AbortError'))},G.open(F.method,F.url,!0),'include'===F.credentials?G.withCredentials=!0:'omit'===F.credentials&&(G.withCredentials=!1),'responseType'in G&&v.blob&&(G.responseType='blob'),F.headers.forEach(function(H,I){G.setRequestHeader(I,H)}),F.signal&&(F.signal.addEventListener('abort',E),G.onreadystatechange=function(){4===G.readyState&&F.signal.removeEventListener('abort',E)}),G.send('undefined'==typeof F._bodyInit?null:F._bodyInit)})}var v={searchParams:'URLSearchParams'in self,iterable:'Symbol'in self&&'iterator'in Symbol,blob:'FileReader'in self&&'Blob'in self&&function(){try{return new Blob,!0}catch(A){return!1}}(),formData:'FormData'in self,arrayBuffer:'ArrayBuffer'in self};if(v.arrayBuffer)var w=['[object Int8Array]','[object Uint8Array]','[object Uint8ClampedArray]','[object Int16Array]','[object Uint16Array]','[object Int32Array]','[object Uint32Array]','[object Float32Array]','[object Float64Array]'],x=ArrayBuffer.isView||function(A){return A&&-1<w.indexOf(Object.prototype.toString.call(A))};g.prototype.append=function(A,B){A=c(A),B=d(B);var C=this.map[A];this.map[A]=C?C+', '+B:B},g.prototype['delete']=function(A){delete this.map[c(A)]},g.prototype.get=function(A){return A=c(A),this.has(A)?this.map[A]:null},g.prototype.has=function(A){return this.map.hasOwnProperty(c(A))},g.prototype.set=function(A,B){this.map[c(A)]=d(B)},g.prototype.forEach=function(A,B){for(var C in this.map)this.map.hasOwnProperty(C)&&A.call(B,this.map[C],C,this)},g.prototype.keys=function(){var A=[];return this.forEach(function(B,C){A.push(C)}),f(A)},g.prototype.values=function(){var A=[];return this.forEach(function(B){A.push(B)}),f(A)},g.prototype.entries=function(){var A=[];return this.forEach(function(B,C){A.push([C,B])}),f(A)},v.iterable&&(g.prototype[Symbol.iterator]=g.prototype.entries);var y=['DELETE','GET','HEAD','OPTIONS','POST','PUT'];q.prototype.clone=function(){return new q(this,{body:this._bodyInit})},o.call(q.prototype),o.call(t.prototype),t.prototype.clone=function(){return new t(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new g(this.headers),url:this.url})},t.error=function(){var A=new t(null,{status:0,statusText:''});return A.type='error',A};var z=[301,302,303,307,308];t.redirect=function(A,B){if(-1===z.indexOf(B))throw new RangeError('Invalid status code');return new t(null,{status:B,headers:{location:A}})},a.DOMException=self.DOMException;try{new a.DOMException}catch(A){a.DOMException=function(B,C){this.message=B,this.name=C;var D=Error(B);this.stack=D.stack},a.DOMException.prototype=Object.create(Error.prototype),a.DOMException.prototype.constructor=a.DOMException}u.polyfill=!0,self.fetch||(self.fetch=u,self.Headers=g,self.Request=q,self.Response=t),a.Headers=g,a.Request=q,a.Response=t,a.fetch=u,Object.defineProperty(a,'__esModule',{value:!0})});
        },

        newElement(tag, text, classes) {
            tag = document.createElement(tag);

            !text && (text = '');
            tag.innerHTML = text;

            if (!classes) return tag;
            typeof(classes) === 'string'
                ? tag.classList.add(classes)
                : classes.forEach(classes => tag.classList.add(classes));
            return tag;
        },

        scrollPageTo(to, duration = 500, extraDistance = 0) {
            const easeInOutQuad = (currentTime, startValue, changeInValue, duration) => {
                currentTime /= duration / 2;
                if (currentTime < 1) return changeInValue / 2 * currentTime * currentTime + startValue;
                currentTime--;
                return -changeInValue / 2 * (currentTime * (currentTime - 2) - 1) + startValue;
            };

            return new Promise((resolve, reject) => {
                const element = document.scrollingElement || document.documentElement || document.body ;

                typeof to === 'string' && (to = document.querySelector(to) || reject());
                typeof to !== 'number' && (to = to.getBoundingClientRect().top + element.scrollTop);

                let start = element.scrollTop,
                    changeTo = to - start - extraDistance,
                    currentTime = 0,
                    increment = 20;

                const animateScroll = () => {
                    currentTime += increment;
                    element.scrollTop = easeInOutQuad(currentTime, start, changeTo, duration);

                    currentTime < duration
                        ? setTimeout(animateScroll, increment)
                        : resolve();
                };
                animateScroll();
            });
        },

        slideUp(element, duration = 500, easing) {
            return new Promise(resolve => {

                element.style.height = element.offsetHeight + 'px';
                element.style.transitionProperty = `height, margin, padding`;
                element.style.transitionDuration = duration + 'ms';
                element.style.transitionTimingFunction = easing;
                element.offsetHeight;
                element.style.overflow = 'hidden';
                element.style.height = 0;
                element.style.paddingTop = 0;
                element.style.paddingBottom = 0;
                element.style.marginTop = 0;
                element.style.marginBottom = 0;

                setTimeout(() => {
                    element.style.display = 'none';
                    element.style.removeProperty('height');
                    element.style.removeProperty('padding-top');
                    element.style.removeProperty('padding-bottom');
                    element.style.removeProperty('margin-top');
                    element.style.removeProperty('margin-bottom');
                    element.style.removeProperty('overflow');
                    element.style.removeProperty('transition-duration');
                    element.style.removeProperty('transition-property');
                    element.style.removeProperty('transition-timing-function');
                    resolve(false);
                }, duration);

            });
        },

        slideDown(element, duration = 500, easing) {
            return new Promise(() => {

                element.style.removeProperty('display');
                let display = getComputedStyle(element).display;
                if (display === 'none') display = 'block';
                element.style.display = display;

                let height = element.offsetHeight;

                element.style.overflow = 'hidden';
                element.style.height = 0;
                element.style.paddingTop = 0;
                element.style.paddingBottom = 0;
                element.style.marginTop = 0;
                element.style.marginBottom = 0;
                element.offsetHeight;
                element.style.transitionProperty = `height, margin, padding`;
                element.style.transitionDuration = duration + 'ms';
                element.style.transitionTimingFunction = easing;
                element.style.height = height + 'px';
                element.style.removeProperty('padding-top');
                element.style.removeProperty('padding-bottom');
                element.style.removeProperty('margin-top');
                element.style.removeProperty('margin-bottom');

                setTimeout(() => {
                    element.style.removeProperty('height');
                    element.style.removeProperty('overflow');
                    element.style.removeProperty('transition-duration');
                    element.style.removeProperty('transition-property');
                    element.style.removeProperty('transition-timing-function');
                }, duration);

            });
        },

        slideToggle(element, duration = 500, easing) {
            const view = this;

            if (getComputedStyle(element).display === 'none') return view.slideDown(element, duration, easing);
            else return view.slideUp(element, duration, easing);
        },

        initHover3D(container, inner) {
            // Setup

            // <div class="container">
            //     <div class="inner"></div>
            // </div>

            // .container {
            //     width: 500px;
            //     height: 500px;
            //     background: lightgreen;
            //     margin: auto auto 100px;
            //     position: relative;
            //     perspective: 40px;
            // }

            // .inner {
            //     width: 100%;
            //     height: 100%;
            //     background: rgb(42, 141, 173);
            //     box-shadow: $boxShadow;
            //     @include transition;
            //     perspective: 40px;
            // }

            // correr com project.utils().initHover3D(view.container, view.inner)

            const updateRate = 10;

            let centerX,
                centerY,
                x,
                y,
                counter = 0;

            const setOrigin = element => {
                centerX = element.offsetWidth / 2 + element.offsetLeft;
                centerY = element.offsetHeight / 2 + element.offsetTop;
            }

            const updateTransform = event => {
                event = event || window.event;
                x = event.clientX - centerX;
                y = -(event.clientY - centerY);
                inner.style.transform = `rotateX(${y / inner.offsetHeight / 2}deg) rotateY(${x / inner.offsetWidth / 2}deg)`;
            }

            const isTimeToUpdate = () => counter++ % updateRate === 0;

            // Allows to track the mouse position relatively to the center of the element
            setOrigin(container);

            container.addEventListener('mouseenter', event => isTimeToUpdate() && updateTransform(event));
            container.addEventListener('mousemove', event => updateTransform(event));
            container.addEventListener('mouseleave', () => inner.style = '');
        }

    }

});