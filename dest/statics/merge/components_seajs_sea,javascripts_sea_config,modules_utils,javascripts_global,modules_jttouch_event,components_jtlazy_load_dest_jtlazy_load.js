!function(a,b){function c(a){return function(b){return{}.toString.call(b)=="[object "+a+"]"}}function d(){return A++}function e(a){return a.match(D)[0]}function f(a){for(a=a.replace(E,"/");a.match(F);)a=a.replace(F,"/");return a=a.replace(G,"$1/")}function g(a){var b=a.length-1,c=a.charAt(b);return"#"===c?a.substring(0,b):".js"===a.substring(b-2)||a.indexOf("?")>0||".css"===a.substring(b-3)||"/"===c?a:a+".js"}function h(a){var b=v.alias;return b&&x(b[a])?b[a]:a}function i(a){var b,c=v.paths;return c&&(b=a.match(H))&&x(c[b[1]])&&(a=c[b[1]]+b[2]),a}function j(a){var b=v.vars;return b&&a.indexOf("{")>-1&&(a=a.replace(I,function(a,c){return x(b[c])?b[c]:a})),a}function k(a){var b=v.map,c=a;if(b)for(var d=0,e=b.length;e>d;d++){var f=b[d];if(c=z(f)?f(a)||a:a.replace(f[0],f[1]),c!==a)break}return c}function l(a,b){var c,d=a.charAt(0);if(J.test(a))c=a;else if("."===d)c=f((b?e(b):v.cwd)+a);else if("/"===d){var g=v.cwd.match(K);c=g?g[0]+a.substring(1):a}else c=v.base+a;return 0===c.indexOf("//")&&(c=location.protocol+c),c}function m(a,b){if(!a)return"";a=h(a),a=i(a),a=j(a),a=g(a);var c=l(a,b);return c=k(c)}function n(a){return a.hasAttribute?a.src:a.getAttribute("src",4)}function o(a,b,c){var d=U.test(a),e=L.createElement(d?"link":"script");if(c){var f=z(c)?c(a):c;f&&(e.charset=f)}p(e,b,d,a),d?(e.rel="stylesheet",e.href=a):(e.async=!0,e.src=a),Q=e,T?S.insertBefore(e,T):S.appendChild(e),Q=null}function p(a,b,c,d){function e(){a.onload=a.onerror=a.onreadystatechange=null,c||v.debug||S.removeChild(a),a=null,b()}var f="onload"in a;return!c||!V&&f?void(f?(a.onload=e,a.onerror=function(){C("error",{uri:d,node:a}),e()}):a.onreadystatechange=function(){/loaded|complete/.test(a.readyState)&&e()}):void setTimeout(function(){q(a,b)},1)}function q(a,b){var c,d=a.sheet;if(V)d&&(c=!0);else if(d)try{d.cssRules&&(c=!0)}catch(e){"NS_ERROR_DOM_SECURITY_ERR"===e.name&&(c=!0)}setTimeout(function(){c?b():q(a,b)},20)}function r(){if(Q)return Q;if(R&&"interactive"===R.readyState)return R;for(var a=S.getElementsByTagName("script"),b=a.length-1;b>=0;b--){var c=a[b];if("interactive"===c.readyState)return R=c}}function s(a){var b=[];return a.replace(Y,"").replace(X,function(a,c,d){d&&b.push(d)}),b}function t(a,b){this.uri=a,this.dependencies=b||[],this.exports=null,this.status=0,this._waitings={},this._remain=0}if(!a.seajs){var u=a.seajs={version:"2.2.0"},v=u.data={},w=c("Object"),x=c("String"),y=Array.isArray||c("Array"),z=c("Function"),A=0,B=v.events={};u.on=function(a,b){var c=B[a]||(B[a]=[]);return c.push(b),u},u.off=function(a,b){if(!a&&!b)return B=v.events={},u;var c=B[a];if(c)if(b)for(var d=c.length-1;d>=0;d--)c[d]===b&&c.splice(d,1);else delete B[a];return u};var C=u.emit=function(a,b){var c,d=B[a];if(d)for(d=d.slice();c=d.shift();)c(b);return u},D=/[^?#]*\//,E=/\/\.\//g,F=/\/[^/]+\/\.\.\//,G=/([^:/])\/\//g,H=/^([^/:]+)(\/.+)$/,I=/{([^{]+)}/g,J=/^\/\/.|:\//,K=/^.*?\/\/.*?\//,L=document,M=e(L.URL),N=L.scripts,O=L.getElementById("seajsnode")||N[N.length-1],P=e(n(O)||M);u.resolve=m;var Q,R,S=L.getElementsByTagName("head")[0]||L.documentElement,T=S.getElementsByTagName("base")[0],U=/\.css(?:\?|$)/i,V=+navigator.userAgent.replace(/.*AppleWebKit\/(\d+)\..*/,"$1")<536;u.request=o;var W,X=/"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^\/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*require|(?:^|[^$])\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g,Y=/\\\\/g,Z=u.cache={},$={},_={},ab={},bb=t.STATUS={FETCHING:1,SAVED:2,LOADING:3,LOADED:4,EXECUTING:5,EXECUTED:6};t.prototype.resolve=function(){for(var a=this,b=a.dependencies,c=[],d=0,e=b.length;e>d;d++)c[d]=t.resolve(b[d],a.uri);return c},t.prototype.load=function(){var a=this;if(!(a.status>=bb.LOADING)){a.status=bb.LOADING;var b=a.resolve();C("load",b);for(var c,d=a._remain=b.length,e=0;d>e;e++)c=t.get(b[e]),c.status<bb.LOADED?c._waitings[a.uri]=(c._waitings[a.uri]||0)+1:a._remain--;if(0===a._remain)return void a.onload();var f={};for(e=0;d>e;e++)c=Z[b[e]],c.status<bb.FETCHING?c.fetch(f):c.status===bb.SAVED&&c.load();for(var g in f)f.hasOwnProperty(g)&&f[g]()}},t.prototype.onload=function(){var a=this;a.status=bb.LOADED,a.callback&&a.callback();var b,c,d=a._waitings;for(b in d)d.hasOwnProperty(b)&&(c=Z[b],c._remain-=d[b],0===c._remain&&c.onload());delete a._waitings,delete a._remain},t.prototype.fetch=function(a){function b(){u.request(f.requestUri,f.onRequest,f.charset)}function c(){delete $[g],_[g]=!0,W&&(t.save(e,W),W=null);var a,b=ab[g];for(delete ab[g];a=b.shift();)a.load()}var d=this,e=d.uri;d.status=bb.FETCHING;var f={uri:e};C("fetch",f);var g=f.requestUri||e;return!g||_[g]?void d.load():$[g]?void ab[g].push(d):($[g]=!0,ab[g]=[d],C("request",f={uri:e,requestUri:g,onRequest:c,charset:v.charset}),void(f.requested||(a?a[f.requestUri]=b:b())))},t.prototype.exec=function(){function a(b){return t.get(a.resolve(b)).exec()}var c=this;if(c.status>=bb.EXECUTING)return c.exports;c.status=bb.EXECUTING;var e=c.uri;a.resolve=function(a){return t.resolve(a,e)},a.async=function(b,c){return t.use(b,c,e+"_async_"+d()),a};var f=c.factory,g=z(f)?f(a,c.exports={},c):f;return g===b&&(g=c.exports),delete c.factory,c.exports=g,c.status=bb.EXECUTED,C("exec",c),g},t.resolve=function(a,b){var c={id:a,refUri:b};return C("resolve",c),c.uri||u.resolve(c.id,b)},t.define=function(a,c,d){var e=arguments.length;1===e?(d=a,a=b):2===e&&(d=c,y(a)?(c=a,a=b):c=b),!y(c)&&z(d)&&(c=s(d.toString()));var f={id:a,uri:t.resolve(a),deps:c,factory:d};if(!f.uri&&L.attachEvent){var g=r();g&&(f.uri=g.src)}C("define",f),f.uri?t.save(f.uri,f):W=f},t.save=function(a,b){var c=t.get(a);c.status<bb.SAVED&&(c.id=b.id||a,c.dependencies=b.deps||[],c.factory=b.factory,c.status=bb.SAVED)},t.get=function(a,b){return Z[a]||(Z[a]=new t(a,b))},t.use=function(b,c,d){var e=t.get(d,y(b)?b:[b]);e.callback=function(){for(var b=[],d=e.resolve(),f=0,g=d.length;g>f;f++)b[f]=Z[d[f]].exec();c&&c.apply(a,b),delete e.callback},e.load()},t.preload=function(a){var b=v.preload,c=b.length;c?t.use(b,function(){b.splice(0,c),t.preload(a)},v.cwd+"_preload_"+d()):a()},u.use=function(a,b){return t.preload(function(){t.use(a,b,v.cwd+"_use_"+d())}),u},t.define.cmd={},a.define=t.define,u.Module=t,v.fetchedList=_,v.cid=d,u.require=function(a){var b=t.get(t.resolve(a));return b.status<bb.EXECUTING&&b.exec(),b.exports};var cb=/^(.+?\/)(\?\?)?(seajs\/)+/;v.base=(P.match(cb)||["",P])[1],v.dir=P,v.cwd=M,v.charset="utf-8",v.preload=function(){var a=[],b=location.search.replace(/(seajs-\w+)(&|$)/g,"$1=1$2");return b+=" "+L.cookie,b.replace(/(seajs-\w+)=1/g,function(b,c){a.push(c)}),a}(),u.config=function(a){for(var b in a){var c=a[b],d=v[b];if(d&&w(d))for(var e in c)d[e]=c[e];else y(d)?c=d.concat(c):"base"===b&&("/"!==c.slice(-1)&&(c+="/"),c=l(c)),v[b]=c}return C("config",a),u}}}(this);
(function(){seajs.config({base:CONFIG.staticUrlPrefix,alias:{jtLazyLoad:"components/jtlazy_load/dest/jtlazy_load.js?v=4049108271",jtTouchEvent:"modules/jttouch_event.js?v=2357274723",utils:"modules/utils.js?v=2394207133"}}),define("jquery",function(){return window.jQuery}),define("underscore",function(){return window._&&(window._.templateSettings={interpolate:/\{\{(.+?)\}\}/g}),window._}),define("Backbone",function(){return window.Backbone})}).call(this);
(function(){define("utils",["jquery","underscore"],function(a,b){var c,d;c=a("jquery"),d=a("underscore"),b.loading=d.debounce(function(a){var b;return b=c(".loadingContainer"),a?b.removeClass("hidden"):b.addClass("hidden")},5),b.showDialog=function(a,b,e){var f,g;return f="warning"===e?"iWarning":"iOK",g=c('<div class="popUpDialog '+f+'">'+a+"</div>"),g.appendTo("body"),d.delay(function(){return g.remove()},b)},b.alert=function(a,b){return null==b&&(b=2e3),this.showDialog(a,b,"warning")},b.prompt=function(a,b){return null==b&&(b=2e3),this.showDialog(a,b)}})}).call(this);
(function(){seajs.use(["jquery","underscore","jtTouchEvent","utils"],function(a,b,c,d){var e,f;return e=function(){},document.addEventListener("touchstart",e,!1),f=window.TIME_LINE,f&&console.dir(f.getLogs()),JT_BRIDGE.on("memoryUsage",function(b){return a("#DEBUG_CONTAINER .memory").text(""+b+"MB")}),JT_BRIDGE.on("changeView",function(a){return d.loading("loading"===a?!0:!1)})})}).call(this);
(function(){define("jtTouchEvent",["jquery","underscore"],function(a,b,c){var d,e,f;d=a("jquery"),f=a("underscore"),e=function(){function a(a,b,c){var e;f.isObject(b)&&(c=b,b=null),this._eventList=[],this._jqObj=a,this._cbfList=c||{},e={x:0,y:0},this._touchMove=function(b){return function(c){var d;d=b._cbfList.move,e=b._getOffset(c),d&&d.call(a,c,e)}}(this),this._touchEnd=function(b){return function(c){var f;a.off("touchmove",b._touchMove),d(document).off("touchend",b._touchEnd),f=b._cbfList.end,f&&f.call(a,c,e),Math.abs(e.x)<20&&Math.abs(e.y)<20&&(c.type="vclick",a.trigger(c))}}(this),this._touchStart=function(c){return function(e){var f,g;return b?a.on("touchmove",b,c._touchMove):a.on("touchmove",c._touchMove),d(document).on("touchend",c._touchEnd),f=c._cbfList.start,g=e.originalEvent.touches[0],c._startPos={x:g.pageX,y:g.pageY},f?f.call(a,e):void 0}}(this),b?a.on("touchstart",b,this._touchStart):a.on("touchstart",this._touchStart)}return a.prototype.on=function(a,b){return this._jqObj.on(a,b),this._eventList.push([a,b]),this},a.prototype.setEventCallback=function(a,b){return this._jqObj.on(a,b),this},a.prototype.destroy=function(){var a;return a=this._jqObj,f.each(this._eventList,function(b){return a.off(b[0],b[1])}),a.off("touchstart",this._touchStart),this},a.prototype._getOffset=function(a){var b,c,d;return c=this._startPos,d=a.originalEvent.touches[0],b={x:d.pageX-c.x,y:d.pageY-c.y}},a}(),c.exports=e})}).call(this);
(function(){define("jtLazyLoad",["jquery","underscore"],function(a,b){var c;c=function(b,c){var d,e,f,g,h,i,j;return d=a("jquery"),j=a("underscore"),i=d(window).height(),e=c||d(window),f=function(){var a;return c&&(a=c.scrollTop()),j.compact(j.map(b,function(b){var c;return b=d(b),b.find("img.hidden").length?(c=a?b.position().top+a:b.offset().top,{top:c,obj:b}):null}))},g=f(),h=j.debounce(function(){var a,b,f;return a=c||d(document),f=a.scrollTop()-300,b=f+i+600,g=j.filter(g,function(a){var c;return c=a.top,c>f&&b>c?(a.obj.find("img").each(function(){var a,b,c;return c=d(this),a=new Image,b=c.attr("data-src"),a.onload=function(){return c.removeClass("hidden")},a.src=b,c.attr("src",b)}),!1):!0}),g.length?void 0:e.off("scroll",h)},300),e.scroll(h)},c($(".directive-lazyload")),b.load=c})}).call(this);