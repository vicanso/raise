!function(a){var b=!1,c={},d=0,e={},f=!1,g=[],h=(new Date,{on:function(a,d){return"deviceReady"===a&&b?void(d&&setTimeout(d,0)):(c[a]||(c[a]=[]),void(d&&c[a].push(d)))},off:function(a,b){var d=c[a];if(b){if(d){var e=d.indexOf(b);~e&&d.splice(e,1)}}else delete c[a]},once:function(a,b){if(b){var c=b;b=function(){c.apply(null,arguments),h.off(a,c)},h.on(a,b)}},emit:function(){var a=Array.prototype.slice.call(arguments),d=a.shift(),e=c[d];"deviceReady"===d&&(b=!0,this._getCallAlready()),e&&e.forEach(function(b){b.apply(null,a)})},call:function(){var a=Array.prototype.slice.call(arguments);if(!b||f)return void g.push(a);f=!0;var c=a.pop();e[++d]=c,a.push(d),window.location.href="app:"+a.join("::")},reply:function(){var a=Array.prototype.slice.call(arguments),b=a.shift(),c=e[b];c&&window.setTimeout(function(){c.apply(null,a)},0),delete e[b]},_getCallAlready:function(){if(f=!1,g.length){var a=g.shift();this.call.apply(this,a)}}});a.JT_BRIDGE=h}(window);