!function(a){function e(b){var c=new a.XMLHttpRequest;return"withCredentials"in c?c.open(b.method,b.url,!0):a.XDomainRequest?(c=new a.XDomainRequest,c.open(b.method,b.url,!0)):c=null,c}function f(a){var c,b=[];for(c in a)a[c]&&b.push(c+"="+encodeURIComponent(a[c]));return b.join("&")}function g(b){return d&&(b["referer"]=a.location.href),b["resolution"]=a.screen.width+"*"+a.screen.height,b["from"]=a.document.referrer,b}var d,h,i,j,b=Object.prototype.toString,c=a.navigator.userAgent.match(/msie\s(\d+)/i);c=c&&c.length>0&&c[1],d=!!c&&9>=c,h={url:"http://127.0.0.1:3000/report",random:1,onReport:function(){},ignore:[/Script error/i],debug:!1},i=function(c){if("[object object]"==b.call(c).toLowerCase()){if(!c.url)throw new Error("xhr needs param [url]!");c.method=c.method&&c.method.toLowerCase()||"post";var d=e(c);if(!d)return a.console&&console.error("CORS not supported"),void 0;d.onload=function(){h&&"function"==typeof h.onReport&&h.onReport()},d.onerror=function(){a.console&&console.error(d)},d.ontimeout=function(){a.console&&console.error("report timeout")},"post"==c.method&&d.setRequestHeader&&d.setRequestHeader("Content-type","application/x-www-form-urlencoded"),d.timeout=c.timeout||3e3,setTimeout(function(){c.data=g(c.data),d.send(f(c.data)||null)},0)}},j={init:function(a){if("[object object]"==b.call(a).toLowerCase())for(var c in a)a[c]&&(h[c]=a[c]);j.bind()},report:function(a){h.debug||("[object object]"!=b.call(a).toLowerCase()&&(a={}),i({url:h.url,method:"POST",data:a}))},bind:function(){if(!h.debug){var b=function(a){for(var b=0,c=h.ignore.length;c>b;b++)if(h.ignore[b].test(a))return!0;return!1};a.onerror=function(c,d,e,f,g){return b(c)||!d?!0:(setTimeout(function(){var c,i,k,l,m,n,b={};if(f=f||a.event&&a.event.errorCharacter||0,b.src=d,b.row=e,b.col=f,g&&g.stack)b.msg=g.stack.toString();else if(arguments.callee){for(c=[],i=arguments.callee.caller,k=3;i&&--k&&(c.push(i.toString()),i!==i.caller);)i=i.caller;c=c.join(","),b.msg=g.stack.toString()}l=new Date,m=l.getSeconds()+1,n=parseInt(60*h.random),m>=1&&n>=m&&j.report(b)},0),!0)}}}},"object"==typeof exports?module.exports=j:"function"==typeof define&&define.amd?define([],function(){return j}):a["bugReport"]=j}(window);