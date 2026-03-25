(function(global){

if(global.fetch) return;

function Headers(h){
  this.map = {};
  if(!h) return;
  for(var k in h){
    this.map[k.toLowerCase()] = h[k];
  }
}
Headers.prototype.get = function(k){
  return this.map[k.toLowerCase()] || null;
};

function Response(body, opts){
  opts = opts || {};
  this.status = opts.status || 200;
  this.statusText = opts.statusText || "OK";
  this.headers = new Headers(opts.headers);
  this.ok = this.status >= 200 && this.status < 300;
  this._body = body;
}

Response.prototype.text = function(){
  return Promise.resolve(this._body);
};

Response.prototype.json = function(){
  return Promise.resolve(JSON.parse(this._body));
};

Response.prototype.arrayBuffer = function(){
  if(this._body instanceof ArrayBuffer){
    return Promise.resolve(this._body);
  }

  var str = this._body;
  var buf = new ArrayBuffer(str.length);
  var view = new Uint8Array(buf);

  for(var i=0;i<str.length;i++){
    view[i] = str.charCodeAt(i) & 255;
  }

  return Promise.resolve(buf);
};

global.fetch = function(url,opt){

  opt = opt || {};

  return new Promise(function(resolve,reject){

    var xhr = new XMLHttpRequest();
    xhr.open(opt.method || "GET", url, true);
    xhr.responseType = "arraybuffer";

    if(opt.headers){
      for(var h in opt.headers){
        xhr.setRequestHeader(h,opt.headers[h]);
      }
    }

    xhr.onload = function(){

      var headers = {};
      var raw = xhr.getAllResponseHeaders().split("\n");

      for(var i=0;i<raw.length;i++){
        var p = raw[i].split(": ");
        if(p.length===2) headers[p[0]] = p[1];
      }

      resolve(new Response(xhr.response,{
        status:xhr.status,
        statusText:xhr.statusText,
        headers:headers
      }));

    };

    xhr.onerror = function(){
      reject(new TypeError("Network request failed"));
    };

    xhr.send(opt.body || null);

  });

};

})(typeof self !== "undefined" ? self : this);

(function () {
  var t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  var links = document.querySelectorAll('link[rel="modulepreload"]');
  for (var idx = 0; idx < links.length; idx++) {
    i(links[idx]);
  }
  new MutationObserver(function (s) {
    for (var idx2 = 0; idx2 < s.length; idx2++) {
      var n = s[idx2];
      if (n.type === "childList") {
        for (var idx3 = 0; idx3 < n.addedNodes.length; idx3++) {
          var r = n.addedNodes[idx3];
          if (r.tagName === "LINK" && r.rel === "modulepreload") i(r);
        }
      }
    }
  }).observe(document, { childList: true, subtree: true });

  function e(s) {
    var n = {};
    if (s.integrity) n.integrity = s.integrity;
    if (s.referrerPolicy) n.referrerPolicy = s.referrerPolicy;
    if (s.crossOrigin === "use-credentials") {
      n.credentials = "include";
    } else if (s.crossOrigin === "anonymous") {
      n.credentials = "omit";
    } else {
      n.credentials = "same-origin";
    }
    return n;
  }

  function i(s) {
    if (s.ep) return;
    s.ep = true;
    var n = e(s);
    fetch(s.href, n);
  }
})();

function mathTrunc(x) {
  return x < 0 ? Math.ceil(x) : Math.floor(x);
}

var lt = 2147483647,
  ct = -2147483648;

function Y(S) {
  return S | 0;
}

function $(S) {
  return S < 0 ? -S : S;
}

function a(S, t) {
  return Math.floor((S * t) / 65536) | 0;
}

function P(S, t) {
  return Math.floor((S * 65536) / t) | 0;
}

function ot(S) {
  var t = Math.round(Math.abs(S));
  return S < 0 ? -t : t;
}

function w() {}
w.PiHalfF16 = 102944;
w.PiF16 = 205887;
w.divideF16 = function (t, e) {
  return P(t, e);
};
w.atanF16 = function (t) {
  return ot(Math.atan(t / 65535) * 65536);
};
w.sinF16 = function (t) {
  return ot(Math.sin(t / 65535) * 65536);
};
w.cosF16 = function (t) {
  return w.sinF16(w.PiHalfF16 - t);
};
w.atan2F16 = function (t, e) {
  if ($(e) < 3) return (t > 0 ? 1 : -1) * w.PiHalfF16;
  var i = w.atanF16(w.divideF16(t, e));
  return t > 0 ? (e > 0 ? i : w.PiF16 + i) : e > 0 ? i : i - w.PiF16;
};

function O() {
  this.gameCanvas = null;
  this.levelLoader = null;
  this.gamePhysics = null;
  this.menuManager = null;
  this.isLoadingBlocked = false;
  this.numPhysicsLoops = 2;
  this.timeMs = 0;
  this.gameTimeMs = 0;
  this.crashRestartDeadlineMs = 0;
  this.isInited = false;
  this.isTimerRunning = false;
}
O.isGameVisible = false;
O.isInGameMenu = false;
O.gameLoadingStateStage = 0;
O.prototype.gameToMenu = function () {
  if (this.gameCanvas) {
    this.gameCanvas.hideMenuButton();
    this.gameCanvas.isDrawingTime = false;
    this.gameCanvas.hideBackButton();
  }
  O.isInGameMenu = true;
};
O.prototype.menuToGame = function () {
  O.isInGameMenu = false;
  if (this.gameCanvas) {
    this.gameCanvas.isDrawingTime = true;
    this.gameCanvas.hideBackButton();
    this.gameCanvas.showMenuButton();
  }
};

function it() {}
it.currentTimeMillis = function () {
  return Date.now();
};
it.sleep = function (t) {
  return new Promise(function (e) {
    window.setTimeout(e, t);
  });
};

function dt(t, e) {
  this.id = t;
  this.timeoutMs = e;
  this.startTimeMs = it.currentTimeMillis();
}
dt.prototype.ready = function () {
  return it.currentTimeMillis() - this.startTimeMs > this.timeoutMs;
};
dt.prototype.getId = function () {
  return this.id;
};

function v(t, e) {
  this.height = v.getRealFontSize(e);
  this.cssFont = t + " " + this.height + 'px "Trebuchet MS", "Segoe UI", sans-serif';
}
v.SIZE_SMALL = 8;
v.SIZE_MEDIUM = 0;
v.SIZE_LARGE = 16;
v.STYLE_PLAIN = "normal";
v.STYLE_BOLD = "bold";
v.STYLE_ITALIC = "italic";
v.FACE_SYSTEM = 0;
v.measureCanvas = null;
v.measureCtx = null;
v.prototype.getBaselinePosition = function () {
  return this.height;
};
v.prototype.getHeight = function () {
  return this.height;
};
v.prototype.getCssFont = function () {
  return this.cssFont;
};
v.prototype.charWidth = function (t) {
  return this.stringWidth(t.slice(0, 1));
};
v.prototype.stringWidth = function (t) {
  var e = v.getMeasureCtx();
  e.font = this.cssFont;
  return Math.ceil(e.measureText(t).width);
};
v.prototype.substringWidth = function (t, e, i) {
  return this.stringWidth(t.substring(e, e + i));
};
v.getMeasureCtx = function () {
  if (v.measureCtx !== null) return v.measureCtx;
  v.measureCanvas = document.createElement("canvas");
  v.measureCtx = v.measureCanvas.getContext("2d");
  if (v.measureCtx === null) throw new Error("Canvas 2D context is not available");
  return v.measureCtx;
};
v.getRealFontSize = function (t) {
  switch (t) {
    case v.SIZE_LARGE:
      return 32;
    case v.SIZE_MEDIUM:
      return 16;
    case v.SIZE_SMALL:
      return 12;
    default:
      throw new Error("unknown font size: " + t);
  }
};

function K() {}
K.fontsMap = {};
K.getFont = function (t, e) {
  var i = t + ":" + e;
  var s = K.fontsMap[i];
  if (s !== undefined) return s;
  var n = new v(t, e);
  K.fontsMap[i] = n;
  return n;
};
K.clearAll = function () {
  K.fontsMap = {};
};

function X(t) {
  this.image = t;
}
X.fromSrc = function (t) {
  var e = new window.Image();
  e.src = t;
  return new X(e);
};
X.load = function (t) {
  return new Promise(function (e, i) {
    var s = new window.Image();
    s.onload = function () {
      e(new X(s));
    };
    s.onerror = function () {
      i(new Error("Failed to load " + t));
    };
    s.src = t;
  });
};
X.prototype.getWidth = function () {
  return this.image.naturalWidth || this.image.width;
};
X.prototype.getHeight = function () {
  return this.image.naturalHeight || this.image.height;
};
X.prototype.getElement = function () {
  return this.image;
};

function u(t) {
  this.ctx = t;
  this.font = new v(v.STYLE_PLAIN, v.SIZE_MEDIUM);
  this.currentColor = "rgb(0 0 0)";
  this.clipRect = null;
  this.ctx.lineWidth = 1;
  this.ctx.textRendering = "geometricPrecision";
  this.ctx.imageSmoothingEnabled = false;
}
u.HCENTER = 1;
u.VCENTER = 2;
u.LEFT = 4;
u.RIGHT = 8;
u.TOP = 16;
u.BOTTOM = 32;
u.BASELINE = 64;
u.prototype.drawString = function (t, e, i, s) {
  var self = this;
  this.ctx.font = this.font.getCssFont();
  this.ctx.fillStyle = this.currentColor;
  var n = this.ctx.measureText(t);
  var r = Math.ceil(n.width);
  var o = Math.ceil(n.actualBoundingBoxAscent || 12);
  var l = Math.ceil(n.actualBoundingBoxDescent || 4);
  var c = u.getAnchorX(e, r, s);
  var d = u.getAnchorTextY(i, o, l, s);
  this.withClip(function () {
    self.ctx.fillText(t, c, d);
  });
};
u.prototype.setColor = function (t, e, i) {
  this.currentColor = "rgb(" + t + " " + e + " " + i + ")";
  this.ctx.fillStyle = this.currentColor;
  this.ctx.strokeStyle = this.currentColor;
};
u.prototype.setFont = function (t) {
  this.font = t;
};
u.prototype.getFont = function () {
  return this.font;
};
u.prototype.drawChar = function (t, e, i, s) {
  this.drawString(t.slice(0, 1), e, i, s);
};
u.prototype.setClip = function (t, e, i, s) {
  this.clipRect = { x: t, y: e, w: i, h: s };
};
u.prototype.fillRect = function (t, e, i, s) {
  var self = this;
  this.withClip(function () {
    self.ctx.fillRect(t, e, i, s);
  });
};
u.prototype.drawLine = function (t, e, i, s) {
  var self = this;
  this.withClip(function () {
    self.ctx.beginPath();
    self.ctx.moveTo(t, e);
    self.ctx.lineTo(i, s);
    self.ctx.stroke();
  });
};
u.prototype.drawArc = function (t, e, i, s, n, r) {
  var self = this;
  var o = mathTrunc(i / 2);
  var l = mathTrunc(s / 2);
  t += o;
  e += l;
  if (!(o === 0 && l === 0)) {
    this.withClip(function () {
      for (var c = n; c < n + r; ++c) {
        self.drawLine(
          t + mathTrunc(o * Math.cos((c * Math.PI) / 180)),
          e - mathTrunc(l * Math.sin((c * Math.PI) / 180)),
          t + mathTrunc(o * Math.cos(((c + 1) * Math.PI) / 180)),
          e - mathTrunc(l * Math.sin(((c + 1) * Math.PI) / 180))
        );
      }
    });
  }
};
u.prototype.drawImage = function (t, e, i, s) {
  var self = this;
  var n = t.getWidth();
  var r = t.getHeight();
  var o = u.getAnchorX(e, n, s);
  var l = u.getAnchorY(i, r, s);
  this.withClip(function () {
    self.ctx.drawImage(t.getElement(), o, l);
  });
};
u.prototype.withClip = function (t) {
  if (this.clipRect === null) {
    t();
    return;
  }
  this.ctx.save();
  this.ctx.beginPath();
  this.ctx.rect(this.clipRect.x, this.clipRect.y, this.clipRect.w, this.clipRect.h);
  this.ctx.clip();
  t();
  this.ctx.restore();
};
u.getAnchorX = function (t, e, i) {
  if ((i & u.LEFT) !== 0) return t;
  if ((i & u.RIGHT) !== 0) return t - e;
  if ((i & u.HCENTER) !== 0) return t - (e >> 1);
  throw new Error("unknown xanchor = " + i);
};
u.getAnchorY = function (t, e, i) {
  if ((i & u.TOP) !== 0) return t;
  if ((i & u.BOTTOM) !== 0) return t - e;
  if ((i & u.VCENTER) !== 0) return t - (e >> 1);
  if ((i & u.BASELINE) !== 0) return t - e;
  throw new Error("unknown yanchor = " + i);
};
u.getAnchorTextY = function (t, e, i, s) {
  if ((s & u.TOP) !== 0) return t + e;
  if ((s & u.BOTTOM) !== 0) return t - i;
  if ((s & u.VCENTER) !== 0) return t + ((e - i) >> 1);
  if ((s & u.BASELINE) !== 0) return t;
  throw new Error("unknown yanchor = " + s);
};

var ut = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAyBAMAAAA5A0HPAAAALVBMVEX+/v5BQUGAgIDR0dGRkZFxcXG7u7vh4eGxsbHx8fEvLy+hoaFgYGDDw8MAAADRLrZDAAAAAWJLR0QAiAUdSAAAAAlwSFlzAAALEgAACxIB0t1+/AAAAAd0SU1FB9UBEREuF87Se9oAAAQJSURBVHicjZXva1NXGMefNI1p+oucdKH0Jr2ksW6Q2ssNceuLrZJhX2i7lXS2ypwE36y0QiDYbW3pGipjcreiJLBRg5v0TnTjOi9RXyipLWYbFIOEaEoVJKXJdO1ukvs37JxE621yDXte5OQ+93O/53nOeZ5zALAhZCMDHBh5G6rZlwh5yDiFEPq0Gujk0e0gHocs7D1LNbAR8WgOYA9iQY+CVcAa3hw7PhHUmQzLcJOtAjagq2sImYdwiH5nNbCWQilCYWOrK/I8Zjw603tdhph+Etv0GxXNh5GpAc0Zvja50un10bFzKbWksCKPYugIsu5Df7pS6fTo6BjHPakEtQJF8XiJPoqht1yu3l6iOcpx31SI6nlMUohfnRrrcRXJIsgtV5Df8zwh23AaExMuMvkbSL2LDWGydQGTRPNVmNztyjjrsOiDaUz29JTCLJHjlZljxSPhaSy5gH/xGqXJ5PPz/jLuEhIoFMb28tkw8SrM3VytQDn4G4awIvgFsu6YnNsFRvmBmGDb/bHhZZjKzLXXJymBbytfi2KY3HcKV8gWEoYEa3mC+lKYCs/+YPS3qFmoqLCfi2Geeu04BHEbdSUeKQehl4R5XumJu4VfVUC9j0yunCnuid+PuytAmCVhKtPpvwZ1QvkuQCnzsXMKR4jvc/xSyWFJQirm1lKC8EAN1JKtVM797sO/1DicOCZ9pb9fre94DeWN0tTJkToqbmNUljd3/FkodSojyy1kDEh5UpssMNAgH/O5X0vUFEqgqUMmi7DhAdJC4xi8/A9+vuntFKUPI01WdEJCbG07MDZIePrloyKPLtLSskMWYeW+wTfOvHjmPygaG3OZaDbhbt4EZg42LPnPX9DWTP3zwZz0sYi/3SMXsMBF2vpvoD0T2mxeXLEBk4QN6lo6w3RnLgzfk7f9NAx6QFPwsk7J27XNpPP1i41bYhDoJHi9V+1dzPk8Y36YuMFmILCFQRrEU5fdeb4p22ysy+cBaH+THFjESfmyg4dcB688yYBO/sNb4EEKbyQTOQxuR8QtABGJOV0mvTcxmw08v3Uy35/BGcvSqhlWpLPsI6PWopMjXiO5J8xJcMiLQ1qLNiF30zlzcT/CuP9Ir4anSWOLd/DJUjwxiKVS69z80lIac0WkeOyQl++flPCekV4h75cGBvr67J+MjNgrq0BsKfeQA0n1XKV5VhcBTZKiSSE6gRxdqreKxvZs6UBnCEyaLvts58xTe+++oyrVj8GIwzn1iAHziZnHEvd4/2nq8N+qivXJz+qd1AVoL/yEsjDQ0vj75JaqYnOyTWP6wAmFjo61eKrbqIl/26oK1vhtM2fWZuCdM1/cndp7x6b7Ybi12hW5Y4Yfz67+P/DS8GTwP4JBrHdvAV/qAAAAAElFTkSuQmCC";
var gt = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD0AAAAuCAMAAACs/uHuAAAAM1BMVEX///////8AAABAQEDAwMAgICCAgIAQEBCgoKDg4ODQ0NBgYGCwsLAwMDCQkJBQUFBwcHBwYuuxAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxEAAAsRAX9kX5EAAAAHdElNRQfVARESFiUT3Cj4AAACqElEQVR4nLWW25arIAyGS4CEs7z/0+4/oK1TrXX2WuNFC4GPHEiiD3P1kHWX64+rReeJ7H/TxjCRhN/QMe1niYhWQbxDZ5JcXlMYX9WISnTEj7RAW3saYjETDADT0YUDHbFt0+IWnVDHMNBZAA+0bqtz5OkJD//lO40oU9ZBn2xe7diZ9IXmVRn5l6vq+CF1PtIO/8tObn9FqzLeyf1teuiMsru5eZHf6fAKLoytW+IVukWP4K7BCkJ+lWYVH/YeaXVwY0xY1WkM72TLcHze+NuRM22+0CM+P/FU6dTwM3oo35c1r1l3izZTE/zk4JjtOjtm+YfesuE/nnSy8bwzHXE5bY8f+lp/g+1JW/pMm5hlx35qjBc91fFi8XA41/uFvvH8AZ1OhzdptyvF85u6Sx9r+o0OzLAvMY97QW6Ggcy5lMbaYYprmBZmLDVsb07L95HEc3ZIj9y1BPGftYk4yizoa3gtde1UFttMl56RsT6j42a8N9wjj04QtQM2rOgJDNqiohoKQ/qUW6+boL4uhr1hIV1+2P50NZEb//qzlRWVITfWjgYj2mESJQkSagZdp+4wqKhtVP32azVLm6cpHWl9t3orJlvMHoWyC7BMQpGq/gX0QgfrWcXwG3OVa1OrEpyGEMFBk/Ua84Jcxpnd2qEuW9sssAAxdlqech4OYtMS9b0M/3T1DzL1+kPpmnbX30kn9CyGOJSy+pneTkj7T5+nbYOOMiJTawWTPLIK4UWCZTa1m1o05F6DTZo83ee6p9No3gFXUJsmuB6vup1PXsx4C7RFBaIXTsX5src8eKyx1Qva00aWXpdFjeOmAj0oETPHPV1YNFqtaaIOOnl1LlNsMwtLHrp1s1/c1iWn5TnrXpf7+BsB6poeqZnI03AtUDPGkZfto+If3gcanBp3vRAAAAAASUVORK5CYII=";
var mt = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAM1BMVEX///8CAgJJR0iilyjJycjn1B+lpJ7OvjKNi4J0bBTm5uZtaVq/riehlFgeHh6Qe062soPFMxsdAAAAAXRSTlMAQObYZgAAA75JREFUeNqNVQGSJCkItEQRBcX/v/YS7Yq92YibayNm6VVAzEyolIZISbHKNb+swvhnrCerhl3aZaSkOSvjRLISCby8W8f+EKJIqc+S1jysW+2sT6ZGlHTpJMSVpebwL9nbjGtUvTVmyYiLDPnRRthfj7+28ihI4FUYoWytdRyItzqRKavVtktai1ojP4G1O+ewFHdy9443FMLqDIuCqCXplTxKy2adrCgCep/xiiHnilTmSVD2Jt5INDdWSu503DLseOF6Af0V2PK6p+HX8sdffkaPvyOFjseYdo9o3n1gFiVxvItPGqEduHorkU2NQNJIUmeKx02gqbUkPJzxl4yTRYBkr3gXF3XjTjyytUleElCicPRKFjeQAa4dRHmt2BEQUzuVkmfYVFRq66hOZ22RuRv8JKSRmwF/eRYsioNEKrRT1po1qF8ooe6QhFi1EJ02+IX4vPHRQrd57Jp0xPZoBHJsHHhCmoe/C+tAqmuzn4288k4fmb5IX8jHh4jCP3h5af3DSwkwIsVloPR6IsSP/lOnkHcqQOb+f4wOjJEHqJ4dv57oHOcT0PsRKfXTQkazAr5CwgYrMqQ6jTIGV6oRuWutqH7QxRWmgeSw+DGGAe9aedM5EGbGj+7RAJXWigKYIkCCWFzpZq6oZVabaEMwXYGockd+tGM064MxgBvzwo+wQH7FNFAgj5Kk67Gzaw4bjOhBRx+9DZVzuQTdATSYx3eDaOz074DCB1+etndQz6WdzihQs54GIYqrCuQcpRSztQ6sZBX6tRZqk0Km0LGmSbkaHlXIaw7r1O6jN2CjnBxxDSkoQ5TPwwHrfJ5tHjYnAkxzndda5eeJngxHSIbgsNAH6D08n1wqqTKGjplGJ4FQDTwZE/NkQEAOTeAgR/eCyzzSjKrjGLRh/gZxICwUgOY+8EKTZyChOeXnePiPtV/UdaQfsh+iNyMG/LHomCPvD6Hg+XwXANVNwdWPFGhCClGJHomwQyoxjCCddcb6s07E6EATJyHG0ApjSOgKUdt0BLrNiS9O8VhB7ATOgteGHCdqClr4Yw01zRgvjm5oUD2hPzHMgVNMOFCF+bJj2kPuG8MjZI9EUA8Cc5WJITm843b0B/VSjsXUiiYvZ0aG7dHHYCPLq9dN44IWH79tO+YonPsd5DHeAtj5hwZ+Jzr/9l0Yb1fkLLd/hNM3Kxozn+/10vyFP2Mizungdcm0+UUAuqBZRfuhDc5X8f8WHGWAMaMAtfx/wHD/jNRO370azX2mQ+g/fRfBv9Hw1/oHcY8nUxXaQAQAAAAASUVORK5CYII=";
var pt = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADEAAAAoCAMAAABgm+J9AAACEFBMVEX///8CAgIuLi42giKuhhb+WjbG5r6qliY+Pj7+gmaGWhaqnkJKqs6azopKqi4uYiKWlpJOij42fpoiIiJSUlJ+fn6KmtL+rp6Cxm6urq5aik7i4uISEhKGpn5qkqJyRhK+qh7W6s7a1tKabi5+ks6Wptb+clL+nobu8ureziKWto7S0tJKfjoqXnKCgoKyqkq6wubCfiJCoip2wmJ6jspmllZSOiL2tqqyuuIyHg6qtqaGhob+hmqSqoqOioaSel5eXl76+vqertqmZh5etkqqmnZOTk7+Yj6uut6+mh5ubm6utt7Wuh5qamqenp7+jnL+fl6uehqyqo6qtt7+vq62trb+bk6SotKeknKOejYeHh7+ppK+vr6mpqb+dlYyMjIqKir+knbCwsLOqh5uShKujhbK0uqOWhpummaaptaqst6iop7e5vK6xuamstr+akb+tqZakkr+moZCQkKSntL+/v6udiq2wuKOntKWjoZiYmJqdmZqTh7+elr+ln5WhkaysrKGls7+xrqCfn5ycnKOjo7+ZkKuqqa+xube2tKeqtpuamby8vL+im7+qpbCyuZSikKWotb+Xjba2tqyvuK6trKaqtb+uqq2vuKioqKOmtJ+jsqirtr+ZkaCks6mst66wuL+Xjr+knr+el7i5vL+gmr+nor+dlqSotb+fmKGltL+jnb+loL+akr+inKaqtou/W5CAAAAAXRSTlMAQObYZgAABDJJREFUeNp1k49X01YUx+9NKrZ1KxRILZCKgPzoOspEy6ZsEDZAqTSOdhYogbjMMxlsHQoV7FDL+DGs3RRRjz0WJjK3o93mv7j3XvojunJPT/Ju+j75vvu9N9DerijtlcYrBK1XxjUo5x+4PKCHGK/JLwEqK2OxyveM15R1DIKmFN9f5ux8cLaNbuLMXk6Npz0HEIqVPD6i8M42p81m46fPekARkP3EdaJ1jO46ZryO1weDwfEx/lRZmY1G54cu5BT6U9fVuAx3lwcGlrVGrqKiWms8c/Nml3JlZGTs8PAw33/Kbp+edhEJciqB42RJrqOnamoyDQ13DF4evNfT03Wmq/7qVevIeOzIsLvcVSw2vSYl6vLJctPQN8Puy4OB1YrHFPjipNU03nbY7S7n7xi98hf45aGh425KrP+iUOLGSetxk4k84vsbnLbaDzTdK0Eyq4kYIwaoRMfqvdXZx3IvlbgBaRFRBt7ZQL2y8fban4hR6xJqXilBlGIDJlPH3RhFPH299dbexpgogIzbhGhghEsDVBU0e5DzcpyX6cyqiKjO0qXMpRUkd1VhXvW7lAb9VJxZMa8ruWKqEDkzhyjSnchJotfrjUjlLqXglbwmgSFEDFDn6gIUkdU04WUiWs5fc2lFr94C5PybmAog+mMCIvWq847OkLmqql6rqdHoq7sxUIAF1InqmESI95lXPsroc5UeRK46DRyyIzE6hSojIvMRQjjLmFed9s80MlSkcuRqhDoFkKNAd3f3NrmbqYikV8n3O2vtPt81n89FtgukuDV9UHCeXLSe7h6qPk+IOGKc/mH0Kr0WlxP5hB1km2h4dA1SQQ55N+Zydw5TFNEokBIjccSDkH8L/hi9EiSdUEsQr4r9SOdWCdoPhnAlgHBxieilB0uRrtFUKqkw9+OnAF/lM2L+fMAsYkRPpRIKrRvZOcvtYi4QBiMBODD+3Pv7aPhn4xP1gLPnY8cC564b8irdH6w6kPgHYONL4/CiKAmSqH8gJSObhb8OFTLyKfnZwl+6DSxI0XutRXP9uZWf2pstjczBflFCTEHfpclLfdAmEpGH/9ucaQ7R28cA38NMkkqQ4U6QSUyw5sEhaNnfOLpD/PmtpSVMJ8PxOhoKhTILbyi4wjoOMEmISTpXyDSmpl5ZWqk3G7rKtwW90Qt5DfJ9JNinQTUuhluut1heToRf7LFtW6cdC1tLz05vQuhpsY50oY7bU3ArDOc24GsL7JR0gYlAbgaBaOzfyr4Ay0WYCFt+1f/YWkmGkrtLhjmMs9llQ/ty/903Rjf/gBPJJ0+evd3zuDfX8wni5mYy9NFi8tHM7xfeAOw67hd2/hBaLKiw0Kc9NLqUWXr9eXPUMZrMkPx8ZmU3mcl851iY+SQTfVqsoDC7IWhudow6HNGlhUzu6I/uP3++eD4THaUd+Q9Iav6mXF4YAAAAAABJRU5ErkJggg==";
var ft = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAYCAMAAACLI47uAAAAM1BMVEU4AABDaZo/aqc+bKJGaaFIca9obW98gIOQlZeIl6qdoaGusK6uuMO+wb/N0dHe4N08XIdf9KV3AAAAAXRSTlMAQObYZgAAAT1JREFUeNrFU0t2xDAI45fYcYKd+5+2WLjt9L0s2i5aFqOZAdmyAKJfxL4N4CEnsPOeiVoSe1uVHZ+um+OLygFkY2AzQ8JFwOimOMm3JHRR3DCYa+ZNJ14icoGvVl4JpwiwMgMj73m+zfqqxhu9Eg6zVMScSg0XNdELfON8Io0tH32mQloXkCZ/tCvRP1waaRI5/XP0T0lHQQPG2WBLxIR2QmokgUU1Kb0YOlUt/JNB9xZxE8n8HT5F1kqUFjND/2b5NDxsFtunZ5MwSDgaYYOcOY1mNZ1G31ZgTysQFPZFQITXgiP9YDjsvDr1/fDxN/621eFS1xbwGnupj/U1h5fctH1Zh8Pk+SFr3MNX62u8R46pPE/XXBDPeda1OLlAulb2iQExNTfmfSFI1so+MGo+s6RoX4Rd2k/79PDfG8jtCWNpSo49AAAAAElFTkSuQmCC";
var St = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAAAkCAMAAAAdBYxUAAAAM1BMVEU4AABLc6dTcZ1ifp9VgLhNgspugJV5gISQlpmLmq2fp6+ssbOktMe+wsTT2Nnl6OdGcK0/f7mYAAAAAXRSTlMAQObYZgAAAd5JREFUeNrtVtt24zAItNDVIiD+/2uXxBEoaRv3dNO36uTBF2WYQcB42967xptwsKBjtsh2w9VfbEyn8Uqudk0iF7tpGRwnBEftrTkqWoSSiz29iJCBwhKhSrAXPaQw/0wJYEaoC1ATl6aEjARKCCtOn3sghcAfGY0Y44w1QIBdmLDhANxxWHEg0Sc54ijNSADYdQ0yyWFIMnEgJd/zwGjNdc0wY1EIlnbl0D2UJ+4R6LIAQXZyLmy01I1/p8c68nLh6OeKlqGN0YtrvCgn3v7Wb61B9JRsrHUe9WCi5+RfH82z6rV29r6py15uVeQoaMK9SJBymy3HwlvDSoz1KJqas1Y8WePYTOAmkiTfkHcFVBzZrwWVj1XGtZMV6R6MK+hTOJgwaC/fSTXJuuOIcGOz73RMu1iuv37VhF2bWcEOQQ0U696eTeMe3d/ENTPi12OQ0HLHvbqiRd1/LsK/zviJO461qPtStbyXU1dryU8PwzI6lwmpIzjQGVBdTQdC2z6Z2dpVi29+ZdjqUhNpuNOotOzX2gv7aZK6egG6b5qGARmG+x2cf2ooJ1OH6sDDIxilfXHg1+pMXDDnXL1ffeo7HYV+QOTfBOvXCH0j209mtXgYV5M2SnxTa46Xuf4HFEgStdbEXZ8AAAAASUVORK5CYII=";
var Mt = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAeCAMAAABHRo19AAAAM1BMVEU4AABEbaNWdaJfeKCFiYlujriIl6qCmbalq66XstWvt7+/wb3O0tPF1ejd4N/t8PBNUVMByFcIAAAAAXRSTlMAQObYZgAAAflJREFUeNq9VAGO4yAMzEBMMSbQ/792TYxJd6Vk76TTWVutSxlsxsNsm4ZI2yxa3Tyu7DFyCO+ZAkiWCZDn4r6yjcpCif0LxMER7GBQhBVPoLlYr7OTnx2ZyZc67AYZnWgeWKpBGqgBloHJdip4VgYfmP3pPm+ho3iWzzRrpvizMWKOc+PBDmnshTvBkmyZNl81mzyQV27adZqFu/1aUIuVwDilWvcM+HwiU5xXPgxSEa3cRostAhaDTpvGOwby1Xl53Vmcw0nmlsirSb/mXIus4bW/1Mh/iauXVL6tp+Dfm3xDpEUNrcvnRcjYHxAGUyJ5V0qxtXekPcaYT7HHmPIpEYVnE0vVv7MoBc06h6xPgYgrQ0TVrpKlKCr2rhLSser+fugQZPRQug2wBO6Vg86wgtuAQDgOMFMQVZOKt+uBo1k+jlMn2kIv5y20ZbiGtHYRbY20Z/28dVlSHPKYdyXTzlDomWW8qnN1N9yQfrJWPlX2p7Fmkeif6uDDwvIlVHlA7JBr+jMrIezzPAD36AyHCNYTD/iwNSq3YIKOsS0XsuwVeqjT9Fq8rzxsbZpZcstRSH0tX+MHYhXtmGF2adpxnaVVbHh6a+Bqw6/LAVvoeBl36qOPzrCMSk11cquMhQlmyKNu1ltdqoM/WlnG97tdtGVsa5a3k/oCxaQPSbJCZs4AAAAASUVORK5CYII";
var Ft = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAMAAAAOusbgAAAAM1BMVEX///9CQkKmW1uempqypqbqcnK9tbXicXHNy8vomZnvJCTeXV3k4uKHhIPcTk7dmJj9z89q1JRWAAAAAXRSTlMAQObYZgAACYlJREFUeNrtW+123LoKnbEkjL79/k97N/JMaoGSk5OTabvWjfujq1TWRkiCDXhut7/0YSuhYkRsRLfyb1C808O5Ghjn+VAYlTjMInJH3+c3C99ieAfYrRYTNQxzzgqGOSUFzF2JoF1q6T3DxqgtxrsezL2mQxtma6RFdZv2yTO7WnkJW92mUe510yj3et+0yJspK1lRre4d4GqAq693ZX/HvpoD50iLnAHh6mlp6CjISkSVvT4J3ek3D2pmKftujhJRiha2xLhpkBJDM2/3lLUsUAoWOJGBSHrfsLbMOSmjlt03A5x9NsDRNbMUHEGtTNmdOuq3mDLVTU0YG9emQTJXA8yhGgVLcC7ohXTHzNNqU2TWGxBTZ97VSnLGQGXCI/E837A0XiYljB3vXp1FElw17GhDGeUMoVwhM1+DB/FKKFqzOutDQ3e5ZS0CQQHHtMs6ZieaExbMfnZwBzAIt0cJCaurzgCTuwgdU/WuqhUz7p2fhRnTOXiGeW2YrmphEKFXwKEB111GQl38U0UIIuiipisBKlZnMeC5alHazBhPFbHgy4qr4Bpnixe10JMDhrrtld003XnQxajKaR4piKV/aVgFQTuoIq7VxElBMEIyuBJdZKTxPnCO9E8UwNHCoy/9fFnOpo/WQ3P3RUayZBZuJS3rpZXb//VT/pAFSOKVCiWlhBBfDQwe5raZaDB0aZsyAyid1eU4vg7sxqWbUDZ4PHX/S4ntrq/IkZK9Sh/qMi+m3tkpTljgvmkmv+Iv5/tUYt7u2vWEtNWnrr+U4Sc9q7PyPWgzAgTO9eqfRFTTlV6RxAcnQasUfjPCBkeYcUQE5BHJYBiPeBzEq7sJOeJ8aZv13GZtCvfYWqLyWDfDAPcKzgR+8AZSMDn5lLaOuPhYHqV6hyh1Cb9ApiuXr5umKp3qrslFIzmKz+2HAoxXEVWZ/AkCSkB3t+NdebWOaFtAYLFRvdYhQkwpl90aNIIVe0TUnwNeOUnDdPD4IRt8m8/hcRdqgUgmsYwLlCEKYZeBPMdLYQfarwtxkl25IvfGI9ReRxbhG06Fwf2kMCLkp20j9kmzLHmXVQCOZ+Ser1WKMm5WUQayn/buduzCnqAPXbLdEpC5zZxBzFA15QCdksVNwF14nKYhg6KpiwJh2m3WYan1ML7a5FR4OgrjfIk6SkPhgWRIrk0mFnExj+lUWhWwEL04qNg8ayFn/qLfjGFjbWlsSZcNfXVwLLQmRHx7+fMbIH6e31U3Y/e924l4ZWi+8UdFkot/JPQfcn3tKcqZBfFcytG5hIh85U9eMee8KtG5gcJTKuHGn6JGzc5b6k1gNbaKd2Odq0oeInqT0lsjj6Axo4ycb87h4XwlSFsXJw5YZV9QZazvwgSLl+ipUDwGzp66+BF62yyC7Fo0OjDtkcFUBjtwlyoN0WAqF8dMwl4EpFyPqpfQG+p0fIUbTJGoiCheKDLIWUFwGQWFNyomxdb0iNqXaguD6w3RxdJHGixnIt0sr/Y5TWCpY6T9El+BlvPgQzLj2PwMSgBm6IbikZ6rOFITWW+pXRN9bGYGyIVO761SSH2mcFDwWpzrHSBdnoHC5yLuzlOPe94xY3qWzKrbYhfU8KugRpyijznPZzU12nvRgZevo0CIeTDB0gCRzjMXA3Y7Yh9j3PenCWEZDlFVkKSGEYJJ/Juuk0twzzu/k6Mf+VFrPHgRhdN2N/4u5I1MWt43W9mQO6PcDrmVS+VVdZerqViCqRthqrYmctuqplBLh7ViHWVRhzjCQpiacURy9O/1i/GB1trY2aivtEn85eS/fNo2i+07On9zQFym+nWlTf1TzOqvY3TFaFTcJyps/7VexM4cE7YNKl/9J4qE/8ami8IxQHRrUcqlas1SFmWtsGFg75pFZvRzeZ+EqMy+Clm/czxXoSDxce7qIKOm3vpc9UXCGo5lVRaK7zSJsGCe2itCcCTwXpC92GAWFRnlU1N0i7NtTglL9E71RAcjnKcUbsRTTB0aK5FYT2l8e2i8cjXCXa4qlVE9mXtC0vDD+8d8NsCP9nmUIMc2+zfnCtk+2yBiPJuCPWjB3EGT4jl0US4TohzVZQANS5oSY2XW1sI9dKd4EKmoREITla3w6gSMHZFltKIq++BVFnhPjvWhA286dNEUPEkzGintBOWJYH0fpypVlR3xwdKS5AxXCc10B2/75rItYrior61rdb6cZXDYSHbF1G19phvT4ByYcQU0mMy7LXbzbgpmJVQXd6wt9iRnW7IGfTRCWtS2D5ABPztYHH9aeDOmRX7lrSf2tlUvN8ByBJLsqfgrSa13yy2qWwnpvnA/rlqhpFzepmcnm36zvjNRh1q1KpdtkVmX4dDU2HIfGGpP72Du1/C7p8VnM9KDNNIkTVtnhNlSX8mc9IrBSneVERRrrNt+sKVJPS+GxrBg4khCP0ESyqqTWJg+S+9+np/nb3oGQUrW9YfjxcAnj0oqxEpRw7hf+5XPVy6Xf7gzKaABuU8UQj7D018x8baIOCF9/KHgIm98VpHcYLb9OoHUuxjcLE+is0ql9imJY5wRj3ThCgZYqGt5kkKZs0dVDwRluDZRxiiimBQrg2WeJPHMQ4vUiVKTXEIaeycKlInHIa1gLPPBSaU2KTXBPhNo8LWDIk8imYfODwoLQEZeUeRAhEB8f7QhpWPHo3wlXc2eH1wBgQQkInrAPTdM0jUprPWJGgsrrBRYMrAx34mLv2J0d2k6jog9qKxzEYI6vhWlsSfSd8sZdjvPDkeCgoguOSENSpc6BnhT8pfShbRGsaO5MRjCGaMkrQOD2LdUR8m0jJxBuqQcKgJ6HZ+sSR/TjdapdJXr/eTwUhMVapwlGs/RSAqP8onSW9KJhI9Cap62R1Quw/4kBqt1O6nXWXKnfY9IPM5sZ2wJrN1zf2uZj6LyIP7HMi8f/1n1Iax5V8f2VrfngR9p3POk/Spxq5a+GMsjq+T3yknYEUs/0+KmXj8/KIsU35uMuX7UjegLzwmQbylzENb7ZxjED2/5ef6mgt8fQnG/pea66NXzb7n3iyytcD9ejotwpklVvbuWXw9czS8R6uLj7u82c+ysgcFe3H/qcX/4xBZbajH2HQH+UgiMOUp/8HWHC6g5gjKBD72VmY8M8hipvvsjku94chw0NV+DsbR5RyOWXugzxsfuYGdXDJcPoa30ym9C+cHOis6eHHt+Na7+Su3xPflrveX4ykF/ry3c7L1fCX2no9R94eLHiv8ITyqFf/jZdz7/AyccbyibIqTYAAAAAElFTkSuQmCC";
var Pt = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGwAAABsCAMAAAC4uKf/AAAAM1BMVEX///9vbW27u7udV1eUYGCkZGSioqL7vLz2kpLyLi7c2dmNi4v+zs6mWlrsZWWqWlryTk4+M15cAAAAAXRSTlMAQObYZgAABMRJREFUeNrtWtGS2yAMtDAGWRDC/39tIXfJGS0X09S+TjshDxkroEWCaIXwNL3bP9iYM5+NEfMDo8CtGzxff+LoX9XsPa95i8SWiKxs7PuC89GXxnljcHm4NY5bl6RcPtYwp7vYp3SdqTb+GroE54iC2QyVa1YzNOETzvMHiJhAc/h44JzKtzGmKrLpDuWNmNqNwn1C7KQ0I41qkXDRkjKKfSMRQzTnm5KHqKJVqLzenqfyuevm0lV6rq6j1E4xQqR2T1U9V5UbUbGvfHW2Wc7fLqwU1WtsRcUhaoC4EHqjE4qe7vICdokgcq/v96c/FxdFtPdlsJ3fjXsHuXf7V1qMaj9zds1fQ7Jt//KSmwj8jOqSigH50v7HfabQgPGFWrBM1AdLaxtzZLHtUC7cIUrQ6matm/tg8UptbLpx3rZnJB28SBk2XULr1snoHh9mUQjND7w4NXJ2ipY46GA2qx7T4hCLl/DJFA/wgtT2y1owZa2awYxgACxdjZ60BUWzxmLSihjsgPlMJf/QepLsD3tJkpDk1k7GN8BXWfYknAY0T6iZ/UAnJYloRcewHlgcAfN7ExyzdciyyHuZSi95iUOiEY/oOQ+Jsh/YIL0pTS/g+zjk7Pz7YJ35eXnVJwc1GZT93IEwHJaa7rbVqpDKpNHdYeirImAUJEAPr6KzptPUQTfPhwzb7kmtkd9FzzpDiHDe+WbdPbAgaRq6aL8u1JoSZz1BR31XW9njd6/hWYH5us6NJIc+2qqFEWxNbgRemkBFoefKFbMSne0JpiBaEudGufiaNCIcUhOGVCQ5niHEB8iJMPv2I1kIpip4QueVIepn72sd52mCgwy6ov3IaelWjWnJmgvipjzVyZQ6aKkj6tQfinnPeSX5EdWMxknqzGoviHQSqg6a50O4UMaI/6Dmp3d7t59J6Dq603G6414YT8dZBuFnjf2wHkYrMN+7BCIN2HGPaDORLl0Y88xHPkMs3g3h91iYS6JS6FS2lZTK73KnA74lSo8OScdiZYaUaK2zrEcXYQ5zcOb+ICVLK5mKqbWK+HltUS8FbjcBkh4E9nE1YBRbFqF2qsiiqlT5fv9xM2Zxy8L3x8/CUgh2zY+dUGvwzrmlMcvUa4erMlTM8pvbfl2DaY5jUtDJNpRc8QMpI8qE7J/vel6T2jgFi+ZWVi9lrDklaugK4g3f/txREJOtd+sE3CNzFEh4eI9K9BaJcZiF4JIVqANSVAhmaRhMh1i/L1inMTTQjUn5gEDGeBOchIebvDtG0jSEBpriPlhHt98/fQ1Ne78u2z008oAXOwdStAwkBsAMmCaiReJQkZaI2e8zidV3xHKBpQ4gcSAxC0waTtp6mKAZHcMEbpY7YCZ4EFmFdYEZomGmM2kH4+AOS9x2ko7gNlxcIK3ZBTsBPYLmQGAZbbIFKbkDI8lqkUORQVF9QQF7faXIjuYVh0CNPNCMYAssNVlY67A0L9LAwofMcBVmoerhCCv5nZcq5K/WpP/PIyj/pE/Va17leHFmuif6taB86ltmcBnUqe6diDadmTpfQfflNDQxSYA+TvNkjytnf5ppSI2O5DTTrgBmz1q3Qis6lDh4Ve6oZlCzIDke1QJwbDmCn7Yf32/Kvdh+Aah7LAscdzk8AAAAAElFTkSuQmCC";

function f(t, e, i) {
  var s = t.getContext("2d");
  if (s === null) throw new Error("Canvas 2D context is not available");
  this.canvas = t;
  this.ctx = s;
  this.graphics = new u(s);
  this.micro = e;
  this.assetCaches = i;
  this.menuManager = null;
  this.dx = 0;
  this.dy = 0;
  this.engineSpriteWidth = 0;
  this.engineSpriteHeight = 0;
  this.fenderSpriteWidth = 0;
  this.fenderSpriteHeight = 0;
  this.gamePhysics = null;
  this.cameraOffsetX = 0;
  this.cameraOffsetY = 0;
  this.loadingScreenMode = 1;
  this.bodyPartsSpriteWidth = [0, 0, 0];
  this.bodyPartsSpriteHeight = [0, 0, 0];
  this.timerTriggered = false;
  this.screenFont = K.getFont(v.STYLE_BOLD, v.SIZE_MEDIUM);
  this.isUiOverlayEnabled = true;
  this.timerMessage = "";
  this.timerId = 0;
  this.timers = [];
  this.isMenuButtonVisible = false;
  this.isBackButtonVisible = false;
  this.repaintHandler = null;
  this.time10MsToStringCache = new Array(100);
  for (var k = 0; k < 100; k++) this.time10MsToStringCache[k] = "";
  this.timeInSeconds = -1;
  this.startFlagAnimationTimeToSpriteNo = [12, 10, 11, 10];
  this.finishFlagAnumationTimeToSpriteNo = [14, 13, 15, 13];
  this.actionInputDelta = [
    [0, 0],
    [1, 0],
    [0, -1],
    [0, 0],
    [0, 0],
    [0, 1],
    [-1, 0]
  ];
  this.keyInputDeltaByMode = [
    [
      [0, 0], [1, -1], [1, 0], [1, 1], [0, -1],
      [-1, 0], [0, 1], [-1, -1], [-1, 0], [-1, 1]
    ],
    [
      [0, 0], [1, 0], [0, 0], [0, 0], [-1, 0],
      [0, -1], [0, 1], [0, 0], [0, 0], [0, 0]
    ],
    [
      [0, 0], [0, 0], [0, 0], [1, 0], [0, -1],
      [0, 1], [-1, 0], [0, 0], [0, 0], [0, 0]
    ]
  ];
  this.inputMode = 2;
  this.activeActions = new Array(7);
  for (var m = 0; m < 7; m++) this.activeActions[m] = false;
  this.activeKeys = new Array(10);
  for (var n = 0; n < 10; n++) this.activeKeys[n] = false;
  this.isDrawingTime = true;
  this.bodyPartsImages = [null, null, null];
  this.engineImage = null;
  this.fenderImage = null;

  this.splashImage = i.splashImage;
  this.logoImage = i.logoImage;
  this.helmetImage = i.helmetImage;
  this.spritesImage = i.spritesImage;
  this.helmetSpriteWidth = this.helmetImage.getWidth() / 6;
  this.helmetSpriteHeight = this.helmetImage.getHeight() / 6;
  this.width = t.width;
  this.height = t.height;
  this.height2 = t.height;
  this.dy = this.height2;
  f.defaultFontWidth00 = 25;
}
f.spriteOffsetX = [0, 0, 15, 15, 15, 0, 6, 12, 18, 18, 25, 25, 25, 37, 37, 37, 15, 32];
f.spriteOffsetY = [10, 25, 16, 20, 10, 0, 0, 0, 8, 0, 0, 6, 12, 0, 6, 12, 29, 18];
f.spriteSizeX = [15, 15, 8, 8, 3, 6, 6, 6, 7, 7, 12, 12, 12, 12, 12, 12, 16, 17];
f.spriteSizeY = [15, 15, 4, 4, 3, 10, 10, 10, 8, 8, 6, 6, 6, 6, 6, 6, 11, 22];
f.defaultFontWidth00 = 25;
f.stringWithTime = "";
f.flagAnimationTime = 0;
f.flagAnimationPhase = 0;
f.create = function (t, e) {
  return Promise.all([
    X.load(ut),
    X.load(gt),
    X.load(mt),
    X.load(pt),
    X.load(ft),
    X.load(St),
    X.load(Mt),
    X.load(Ft),
    X.load(Pt)
  ]).then(function (res) {
    return new f(t, e, {
      splashImage: res[0],
      logoImage: res[1],
      helmetImage: res[2],
      spritesImage: res[3],
      bluearmImage: res[4],
      bluelegImage: res[5],
      bluebodyImage: res[6],
      engineImage: res[7],
      fenderImage: res[8]
    });
  });
};
f.prototype.resize = function (t, e) {
  this.canvas.width = t;
  this.canvas.height = e;
  this.width = t;
  this.height = e;
  this.height2 = e;
};
f.prototype.getWidth = function () {
  return this.width;
};
f.prototype.getHeight = function () {
  return this.height2;
};
f.prototype.getGraphics = function () {
  return this.graphics;
};
f.prototype.beginFrame = function () {
  this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.processTimers();
};
f.prototype.drawSprite = function (t, e, i, s) {
  t.setClip(i, s, f.spriteSizeX[e], f.spriteSizeY[e]);
  t.drawImage(
    this.spritesImage,
    i - f.spriteOffsetX[e],
    s - f.spriteOffsetY[e],
    u.LEFT | u.TOP
  );
  t.setClip(0, 0, this.getWidth(), this.getHeight());
};
f.prototype.requestRepaint = function (t) {
  this.loadingScreenMode = t;
  if (t === 0) {
    this.splashImage = null;
    this.logoImage = null;
  } else {
    this.repaint();
    this.serviceRepaints();
  }
};
f.prototype.setUiOverlayEnabled = function (t) {
  this.isUiOverlayEnabled = t;
  this.repaint();
};
f.prototype.init = function (t) {
  this.gamePhysics = t;
  t.setMinimalScreenWH(
    this.width < this.height2 ? this.width : this.height2
  );
};
f.prototype.loadSprites = function (t) {
  if ((t & 1) !== 0) {
    this.fenderImage = this.assetCaches.fenderImage;
    this.engineImage = this.assetCaches.engineImage;
    this.fenderSpriteWidth = this.fenderImage.getWidth() / 6;
    this.fenderSpriteHeight = this.fenderImage.getHeight() / 6;
    this.engineSpriteWidth = this.engineImage.getWidth() / 6;
    this.engineSpriteHeight = this.engineImage.getHeight() / 6;
  } else {
    this.fenderImage = null;
    this.engineImage = null;
  }
  if ((t & 2) !== 0) {
    this.bodyPartsImages[1] = this.assetCaches.bluelegImage;
    this.bodyPartsSpriteWidth[1] = this.bodyPartsImages[1].getWidth() / 6;
    this.bodyPartsSpriteHeight[1] = this.bodyPartsImages[1].getHeight() / 3;
    this.bodyPartsImages[0] = this.assetCaches.bluearmImage;
    this.bodyPartsSpriteWidth[0] = this.bodyPartsImages[0].getWidth() / 6;
    this.bodyPartsSpriteHeight[0] = this.bodyPartsImages[0].getHeight() / 3;
    this.bodyPartsImages[2] = this.assetCaches.bluebodyImage;
    this.bodyPartsSpriteWidth[2] = this.bodyPartsImages[2].getWidth() / 6;
    this.bodyPartsSpriteHeight[2] = this.bodyPartsImages[2].getHeight() / 3;
  } else {
    this.bodyPartsImages[0] = null;
    this.bodyPartsImages[1] = null;
    this.bodyPartsImages[2] = null;
  }
  return Promise.resolve(t);
};
f.prototype.resetInputState = function () {
  this.clearActiveInputs();
};
f.prototype.setViewPosition = function (t, e) {
  this.dx = t;
  this.dy = e;
  if (this.gamePhysics) {
    this.gamePhysics.setRenderMinMaxX(-t, -t + this.width);
  }
};
f.prototype.getDx = function () {
  return this.dx;
};
f.prototype.addDx = function (t) {
  return t + this.dx;
};
f.prototype.addDy = function (t) {
  return -t + this.dy;
};
f.prototype.drawLine = function (t, e, i, s) {
  this.graphics.drawLine(
    this.addDx(t),
    this.addDy(e),
    this.addDx(i),
    this.addDy(s)
  );
};
f.prototype.drawLineF16 = function (t, e, i, s) {
  this.graphics.drawLine(
    this.addDx((t << 2) >> 16),
    this.addDy((e << 2) >> 16),
    this.addDx((i << 2) >> 16),
    this.addDy((s << 2) >> 16)
  );
};
f.prototype.renderBodyPart = function (t, e, i, s, n, r) {
  if (r === undefined) r = 32768;
  var o = this.addDx((a(i, r) + a(t, 65536 - r)) >> 16);
  var l = this.addDy((a(s, r) + a(e, 65536 - r)) >> 16);
  var c = w.atan2F16(i - t, s - e);
  var d = this.calcSpriteNo(c, 0, 205887, 16, false);
  if (this.bodyPartsImages[n] !== null) {
    var g = o - mathTrunc(this.bodyPartsSpriteWidth[n] / 2);
    var F = l - mathTrunc(this.bodyPartsSpriteHeight[n] / 2);
    this.graphics.setClip(
      g,
      F,
      this.bodyPartsSpriteWidth[n],
      this.bodyPartsSpriteHeight[n]
    );
    this.graphics.drawImage(
      this.bodyPartsImages[n],
      g - this.bodyPartsSpriteWidth[n] * (d % 6),
      F - this.bodyPartsSpriteHeight[n] * mathTrunc(d / 6),
      u.LEFT | u.TOP
    );
    this.graphics.setClip(0, 0, this.width, this.getHeight());
  }
};
f.prototype.drawWheelArc = function (t, e, i, s) {
  ++i;
  var n = this.addDx(t - i);
  var r = this.addDy(e + i);
  var o = i << 1;
  var l = -P(a(s, 11796480), 205887);
  if (l < 0) l += 360;
  this.graphics.drawArc(n, r, o, o, (l >> 16) + 170, 90);
};
f.prototype.drawCircle = function (t, e, i) {
  var s = mathTrunc(i / 2);
  var n = this.addDx(t - s);
  var r = this.addDy(e + s);
  this.graphics.drawArc(n, r, i, i, 0, 360);
};
f.prototype.fillRect = function (t, e, i, s) {
  this.graphics.fillRect(this.addDx(t), this.addDy(e), i, s);
};
f.prototype.drawForthSpriteByCenter = function (t, e) {
  var i = mathTrunc(f.spriteSizeX[4] / 2);
  var s = mathTrunc(f.spriteSizeY[4] / 2);
  this.drawSprite(this.graphics, 4, this.addDx(t - i), this.addDy(e + s));
};
f.prototype.drawHelmet = function (t, e, i) {
  var s = this.calcSpriteNo(i, -102943, 411774, 32, true);
  var n = this.addDx(t) - mathTrunc(this.helmetSpriteWidth / 2);
  var r = this.addDy(e) - mathTrunc(this.helmetSpriteHeight / 2);
  this.graphics.setClip(n, r, this.helmetSpriteWidth, this.helmetSpriteHeight);
  this.graphics.drawImage(
    this.helmetImage,
    n - this.helmetSpriteWidth * (s % 6),
    r - this.helmetSpriteHeight * mathTrunc(s / 6),
    u.LEFT | u.TOP
  );
  this.graphics.setClip(0, 0, this.width, this.getHeight());
};
f.prototype.drawTime = function (t) {
  var e = mathTrunc(t / 100);
  var i = mathTrunc(t % 100);
  if (this.timeInSeconds !== e || f.stringWithTime.length === 0) {
    var s = e % 60 >= 10 ? "" : "0";
    f.stringWithTime = mathTrunc(e / 60) + ":" + s + (e % 60) + ".";
    this.timeInSeconds = e;
  }
  if (this.time10MsToStringCache[i].length === 0) {
    var s2 = i >= 10 ? "" : "0";
    this.time10MsToStringCache[i] = s2 + (t % 100);
  }
  this.setColor(0, 0, 0);
  this.graphics.setFont(K.getFont(v.STYLE_BOLD, v.SIZE_MEDIUM));
  if (t > 36e5) {
    this.graphics.drawString(
      "0:00.",
      this.width - f.defaultFontWidth00,
      this.height2 - 5,
      u.RIGHT | u.TOP
    );
    this.graphics.drawString(
      "00",
      this.width - f.defaultFontWidth00,
      this.height2 - 5,
      u.LEFT | u.TOP
    );
  } else {
    this.graphics.drawString(
      f.stringWithTime,
      this.width - f.defaultFontWidth00,
      this.height2 - 5,
      u.RIGHT | u.TOP
    );
    this.graphics.drawString(
      this.time10MsToStringCache[i],
      this.width - f.defaultFontWidth00,
      this.height2 - 5,
      u.LEFT | u.TOP
    );
  }
};
f.prototype.handleTimerFired = function (t) {
  if (this.timerId === t) this.timerTriggered = true;
};
f.advanceFlagAnimation = function () {
  f.flagAnimationPhase += 655;
  var t = w.sinF16(f.flagAnimationPhase);
  var e = 32768 + ((t < 0 ? -t : t) >> 1);
  f.flagAnimationTime += (6553 * e) >> 16;
};
f.prototype.renderStartFlag = function (t, e) {
  if (f.flagAnimationTime > 229376) f.flagAnimationTime = 0;
  this.setColor(0, 0, 0);
  this.drawLine(t, e, t, e + 32);
  this.drawSprite(
    this.graphics,
    this.startFlagAnimationTimeToSpriteNo[f.flagAnimationTime >> 16],
    this.addDx(t),
    this.addDy(e) - 32
  );
};
f.prototype.renderFinishFlag = function (t, e) {
  if (f.flagAnimationTime > 229376) f.flagAnimationTime = 0;
  this.setColor(0, 0, 0);
  this.drawLine(t, e, t, e + 32);
  this.drawSprite(
    this.graphics,
    this.finishFlagAnumationTimeToSpriteNo[f.flagAnimationTime >> 16],
    this.addDx(t),
    this.addDy(e) - 32
  );
};
f.prototype.drawWheelTires = function (t, e, i) {
  var s = i === 1 ? 0 : 1;
  var n = mathTrunc(f.spriteSizeX[s] / 2);
  var r = mathTrunc(f.spriteSizeY[s] / 2);
  this.drawSprite(this.graphics, s, this.addDx(t - n), this.addDy(e + r));
};
f.prototype.calcSpriteNo = function (t, e, i, s, n) {
  for (t += e; t < 0; t += i);
  for (; t >= i; ) t -= i;
  if (n) t = i - t;
  var r = a(P(t, i), s << 16);
  return r >> 16 < s - 1 ? r >> 16 : s - 1;
};
f.prototype.renderEngine = function (t, e, i) {
  if (this.engineImage === null) return;
  var s = this.calcSpriteNo(i, -247063, 411774, 32, true);
  var n = this.addDx(t) - mathTrunc(this.engineSpriteWidth / 2);
  var r = this.addDy(e) - mathTrunc(this.engineSpriteHeight / 2);
  this.graphics.setClip(n, r, this.engineSpriteWidth, this.engineSpriteHeight);
  this.graphics.drawImage(
    this.engineImage,
    n - this.engineSpriteWidth * (s % 6),
    r - this.engineSpriteHeight * mathTrunc(s / 6),
    u.LEFT | u.TOP
  );
  this.graphics.setClip(0, 0, this.width, this.getHeight());
};
f.prototype.renderFender = function (t, e, i) {
  if (this.fenderImage === null) return;
  var s = this.calcSpriteNo(i, -185297, 411774, 32, true);
  var n = this.addDx(t) - mathTrunc(this.fenderSpriteWidth / 2);
  var r = this.addDy(e) - mathTrunc(this.fenderSpriteHeight / 2);
  this.graphics.setClip(n, r, this.fenderSpriteWidth, this.fenderSpriteHeight);
  this.graphics.drawImage(
    this.fenderImage,
    n - this.fenderSpriteWidth * (s % 6),
    r - this.fenderSpriteHeight * mathTrunc(s / 6),
    u.LEFT | u.TOP
  );
  this.graphics.setClip(0, 0, this.width, this.getHeight());
};
f.prototype.clearScreenWithWhite = function () {
  this.graphics.setColor(255, 255, 255);
  this.graphics.fillRect(0, 0, this.width, this.height2);
};
f.prototype.setColor = function (t, e, i) {
  if (O.isInGameMenu) {
    t += 128;
    e += 128;
    i += 128;
    if (t > 240) t = 240;
    if (e > 240) e = 240;
    if (i > 240) i = 240;
  }
  this.graphics.setColor(t, e, i);
};
f.prototype.drawProgressBar = function (t, e) {
  var i = e ? this.height : this.height2;
  this.setColor(0, 0, 0);
  this.graphics.fillRect(1, i - 4, this.width - 2, 3);
  this.setColor(255, 255, 255);
  this.graphics.fillRect(
    2,
    i - 3,
    a((this.width - 4) << 16, t) >> 16,
    1
  );
};
f.prototype.drawTimerMessage = function () {
  if (this.timerMessage.length !== 0) {
    this.setColor(0, 0, 0);
    this.graphics.setFont(this.screenFont);
    if (this.height2 <= 128) {
      this.graphics.drawString(
        this.timerMessage,
        mathTrunc(this.width / 2),
        1,
        u.HCENTER | u.TOP
      );
    } else {
      this.graphics.drawString(
        this.timerMessage,
        mathTrunc(this.width / 2),
        mathTrunc(this.height2 / 4),
        u.HCENTER | u.VCENTER
      );
    }
    if (this.timerTriggered) {
      this.timerTriggered = false;
      this.timerMessage = "";
    }
  }
};
f.prototype.setInputMode = function (t) {
  this.inputMode = t;
};
f.prototype.drawGame = function (t) {
  if (!O.isGameVisible || this.micro.isLoadingBlocked || this.gamePhysics === null) return;

  if (this.loadingScreenMode !== 0) {
    t.setColor(255, 255, 255);
    t.fillRect(0, 0, this.getWidth(), this.getHeight());
    if (this.loadingScreenMode === 1) {
      if (this.logoImage !== null) {
        t.drawImage(
          this.logoImage,
          this.getWidth() >> 1,
          this.getHeight() >> 1,
          u.HCENTER | u.VCENTER
        );
      }
      this.drawSprite(
        t,
        16,
        this.getWidth() - f.spriteSizeX[16] - 5,
        this.getHeight() - f.spriteSizeY[16] - 7
      );
      this.drawSprite(
        t,
        17,
        this.getWidth() - f.spriteSizeX[17] - 4,
        this.getHeight() - f.spriteSizeY[17] - f.spriteSizeY[16] - 9
      );
    } else {
      if (this.splashImage !== null) {
        t.drawImage(
          this.splashImage,
          this.getWidth() >> 1,
          this.getHeight() >> 1,
          u.HCENTER | u.VCENTER
        );
      }
    }
    var e = P(O.gameLoadingStateStage << 16, 655360);
    this.drawProgressBar(e, true);
    return;
  }
  this.gamePhysics.setMotoComponents();
  this.setViewPosition(
    -this.gamePhysics.getCamPosX() + this.cameraOffsetX + (this.width >> 1),
    this.gamePhysics.getCamPosY() + this.cameraOffsetY + (this.height2 >> 1)
  );
  this.gamePhysics.renderGame(this);
  if (this.isDrawingTime) {
    this.drawTime(this.micro.gameTimeMs / 10);
  }
  this.drawTimerMessage();
  this.drawProgressBar(this.gamePhysics.getProgressF16(), false);
};
f.prototype.paint = function (t) {
  this.beginFrame();
  if (O.isInGameMenu && this.menuManager !== null) {
    this.menuManager.renderCurrentMenu(t);
    return;
  }
  this.drawGame(t);
};
f.prototype.clearActiveInputs = function () {
  for (var t = 0; t < 10; ++t) this.activeKeys[t] = false;
  for (var t2 = 0; t2 < 7; ++t2) this.activeActions[t2] = false;
};
f.prototype.handleUpdatedInput = function () {
  var t = 0;
  var e = 0;
  var i = this.inputMode;
  for (var s = 0; s < 10; ++s) {
    if (this.activeKeys[s]) {
      t += this.keyInputDeltaByMode[i][s][0];
      e += this.keyInputDeltaByMode[i][s][1];
    }
  }
  for (var s2 = 0; s2 < 7; ++s2) {
    if (this.activeActions[s2]) {
      t += this.actionInputDelta[s2][0];
      e += this.actionInputDelta[s2][1];
    }
  }
  if (this.gamePhysics) {
    this.gamePhysics.setInputDirection(t, e);
  }
};
f.prototype.processTimers = function () {
  for (var t = 0; t < this.timers.length; ) {
    if (this.timers[t].ready()) {
      this.handleTimerFired(this.timers[t].getId());
      this.timers.splice(t, 1);
    } else {
      ++t;
    }
  }
};
f.prototype.processKeyPressed = function (t) {
  var e = this.getGameAction(t);
  var i = t - 48;
  if (i >= 0 && i < 10) {
    this.activeKeys[i] = true;
  } else if (e >= 0 && e < 7) {
    this.activeActions[e] = true;
  }
  this.handleUpdatedInput();
};
f.prototype.processKeyReleased = function (t) {
  var e = this.getGameAction(t);
  var i = t - 48;
  if (i >= 0 && i < 10) {
    this.activeKeys[i] = false;
  } else if (e >= 0 && e < 7) {
    this.activeActions[e] = false;
  }
  this.handleUpdatedInput();
};
f.prototype.getGameAction = function (t) {
  switch (t) {
    case 1:
    case 2:
    case 5:
    case 6:
    case 8:
      return t;
    default:
      return -1;
  }
};
f.prototype.scheduleGameTimerTask = function (t, e) {
  this.timerTriggered = false;
  ++this.timerId;
  this.timerMessage = t;
  this.timers.push(new dt(this.timerId, e));
};
f.prototype.setMenuManager = function (t) {
  this.menuManager = t;
};
f.prototype.setRepaintHandler = function (t) {
  this.repaintHandler = t;
};
f.prototype.openPauseMenu = function () {
  if (this.menuManager !== null) {
    this.menuManager.isOpeningPauseMenu = true;
    this.micro.gameToMenu();
  }
};
f.prototype.handleBackAction = function () {
  if (O.isInGameMenu && this.menuManager) {
    this.menuManager.handleBackAction();
  }
};
f.prototype.keyPressed = function (t) {
  if (O.isInGameMenu && this.menuManager !== null) {
    this.menuManager.processKeyCode(t);
  }
  this.processKeyPressed(t);
};
f.prototype.keyReleased = function (t) {
  this.processKeyReleased(t);
};
f.prototype.showMenuButton = function () {
  this.isMenuButtonVisible = true;
};
f.prototype.hideMenuButton = function () {
  this.isMenuButtonVisible = false;
};
f.prototype.hasMenuButton = function () {
  return this.isMenuButtonVisible;
};
f.prototype.showBackButton = function () {
  this.isBackButtonVisible = true;
};
f.prototype.hideBackButton = function () {
  this.isBackButtonVisible = false;
};
f.prototype.hasBackButton = function () {
  return this.isBackButtonVisible;
};
f.prototype.repaint = function () {
  if (this.repaintHandler) this.repaintHandler();
};
f.prototype.serviceRepaints = function () {
  if (this.repaintHandler) this.repaintHandler();
};

function nt(t) {
  this.view = new DataView(t);
  this.bytes = new Uint8Array(t);
  this.pos = 0;
}
nt.fromUrl = function (t) {
  return fetch(t)
    .then(function (e) {
      if (!e.ok) throw new Error("Failed to load " + t + ": " + e.status + " " + e.statusText);
      return e.arrayBuffer();
    })
    .then(function (i) {
      if (i.byteLength === 0) throw new Error("Loaded empty resource from " + t);
      return new nt(i);
    });
};
nt.prototype.isOpen = function () {
  return true;
};
nt.prototype.setPos = function (t) {
  this.pos = t;
};
nt.prototype.getPos = function () {
  return this.pos;
};
nt.prototype.readInt8 = function () {
  var t = this.view.getInt8(this.pos);
  this.pos += 1;
  return t;
};
nt.prototype.readInt16 = function (t) {
  if (t === undefined) t = false;
  this.assertCanRead(2);
  var e = this.view.getInt16(this.pos, !t);
  this.pos += 2;
  return e;
};
nt.prototype.readInt32 = function (t) {
  if (t === undefined) t = false;
  this.assertCanRead(4);
  var e = this.view.getInt32(this.pos, !t);
  this.pos += 4;
  return e;
};
nt.prototype.readBytes = function (t) {
  this.assertCanRead(t);
  var e = this.bytes.subarray(this.pos, this.pos + t);
  this.pos += t;
  return e;
};
nt.prototype.assertCanRead = function (t) {
  if (this.pos + t > this.view.byteLength) {
    throw new Error(
      "Unexpected end of stream at " + this.pos + ", wanted " + t + " more bytes, size=" + this.view.byteLength
    );
  }
};

function At() {
  this.minX = 0;
  this.maxX = 0;
  this.shadowStartXF16 = 0;
  this.shadowEndXF16 = 0;
  this.shadowProjectionYF16 = 0;
  this.shadowBlendF16 = 0;
  this.startPosX = 0;
  this.startPosY = 0;
  this.finishPosX = 13107200;
  this.startFlagPoint = 0;
  this.finishFlagPoint = 0;
  this.finishPosY = 0;
  this.pointsCount = 0;
  this.unusedLevelFlag = 0;
  this.pointPositions = [];
  this.init();
}
At.prototype.init = function () {
  this.startPosX = 0;
  this.startPosY = 0;
  this.finishPosX = 13107200;
  this.pointsCount = 0;
  this.unusedLevelFlag = 0;
};
At.prototype.setStartAndFinishPositions = function (t, e, i, s) {
  this.startPosX = (t << 16) >> 3;
  this.startPosY = (e << 16) >> 3;
  this.finishPosX = (i << 16) >> 3;
  this.finishPosY = (s << 16) >> 3;
};
At.prototype.getStartPosX = function () {
  return (this.startPosX << 3) >> 16;
};
At.prototype.getStartPosY = function () {
  return (this.startPosY << 3) >> 16;
};
At.prototype.getFinishPosX = function () {
  return (this.finishPosX << 3) >> 16;
};
At.prototype.getFinishPosY = function () {
  return (this.finishPosY << 3) >> 16;
};
At.prototype.getPointX = function (t) {
  return (this.pointPositions[t][0] << 3) >> 16;
};
At.prototype.getPointY = function (t) {
  return (this.pointPositions[t][1] << 3) >> 16;
};
At.prototype.getProgressF16 = function (t) {
  var e = t - this.pointPositions[this.startFlagPoint][0];
  var i = this.pointPositions[this.finishFlagPoint][0] - this.pointPositions[this.startFlagPoint][0];
  return $(i) >= 3 && e <= i ? P(e, i) : 65536;
};
At.prototype.setMinMaxX = function (t, e) {
  this.minX = (t << 16) >> 3;
  this.maxX = (e << 16) >> 3;
};
At.prototype.setShadowProjectionRange = function (t, e) {
  this.shadowStartXF16 = t >> 1;
  this.shadowEndXF16 = e >> 1;
};
At.prototype.setShadowProjectionState = function (t, e, i) {
  this.shadowStartXF16 = t;
  this.shadowEndXF16 = e;
  this.shadowProjectionYF16 = i;
};
At.prototype.renderShadow = function (t, e, i) {
  if (i <= this.pointsCount - 1) {
    var s = this.shadowProjectionYF16 - ((this.pointPositions[e][1] + this.pointPositions[i + 1][1]) >> 1);
    s = s < 0 ? 0 : s;
    if (this.shadowProjectionYF16 <= this.pointPositions[e][1] || this.shadowProjectionYF16 <= this.pointPositions[i + 1][1]) {
      s = s < 327680 ? s : 327680;
    }
    this.shadowBlendF16 = a(this.shadowBlendF16, 49152) + a(s, 16384);
    if (this.shadowBlendF16 <= 557056) {
      var n = a(1638400, this.shadowBlendF16) >> 16;
      t.setColor(n, n, n);
      var r = this.pointPositions[e][0] - this.pointPositions[e + 1][0];
      var o = P(this.pointPositions[e][1] - this.pointPositions[e + 1][1], r);
      var l = this.pointPositions[e][1] - a(this.pointPositions[e][0], o);
      var c = a(this.shadowStartXF16, o) + l;
      r = this.pointPositions[i][0] - this.pointPositions[i + 1][0];
      o = P(this.pointPositions[i][1] - this.pointPositions[i + 1][1], r);
      l = this.pointPositions[i][1] - a(this.pointPositions[i][0], o);
      var d = a(this.shadowEndXF16, o) + l;
      if (e === i) {
        t.drawLine(
          (this.shadowStartXF16 << 3) >> 16,
          ((c + 65536) << 3) >> 16,
          (this.shadowEndXF16 << 3) >> 16,
          ((d + 65536) << 3) >> 16
        );
        return;
      }
      t.drawLine(
        (this.shadowStartXF16 << 3) >> 16,
        ((c + 65536) << 3) >> 16,
        (this.pointPositions[e + 1][0] << 3) >> 16,
        ((this.pointPositions[e + 1][1] + 65536) << 3) >> 16
      );
      for (var g = e + 1; g < i; ++g) {
        t.drawLine(
          (this.pointPositions[g][0] << 3) >> 16,
          ((this.pointPositions[g][1] + 65536) << 3) >> 16,
          (this.pointPositions[g + 1][0] << 3) >> 16,
          ((this.pointPositions[g + 1][1] + 65536) << 3) >> 16
        );
      }
      t.drawLine(
        (this.pointPositions[i][0] << 3) >> 16,
        ((this.pointPositions[i][1] + 65536) << 3) >> 16,
        (this.shadowEndXF16 << 3) >> 16,
        ((d + 65536) << 3) >> 16
      );
    }
  }
};
At.prototype.renderLevel3D = function (t, e, i) {
  var s = 0;
  var n = 0;
  var r = 0;
  for (r = 0; r < this.pointsCount - 1 && this.pointPositions[r][0] <= this.minX; ++r);
  if (r > 0) --r;
  var o = e - this.pointPositions[r][0];
  var l = i + 3276800 - this.pointPositions[r][1];
  var c = h.getSmthLikeMaxAbs(o, l);
  o = P(o, (c >> 1) >> 1);
  l = P(l, (c >> 1) >> 1);
  t.setColor(0, 170, 0);
  for (; r < this.pointsCount - 1;) {
    var d = o;
    var g = l;
    o = e - this.pointPositions[r + 1][0];
    l = i + 3276800 - this.pointPositions[r + 1][1];
    c = h.getSmthLikeMaxAbs(o, l);
    o = P(o, (c >> 1) >> 1);
    l = P(l, (c >> 1) >> 1);
    t.drawLine(
      ((this.pointPositions[r][0] + d) << 3) >> 16,
      ((this.pointPositions[r][1] + g) << 3) >> 16,
      ((this.pointPositions[r + 1][0] + o) << 3) >> 16,
      ((this.pointPositions[r + 1][1] + l) << 3) >> 16
    );
    t.drawLine(
      (this.pointPositions[r][0] << 3) >> 16,
      (this.pointPositions[r][1] << 3) >> 16,
      ((this.pointPositions[r][0] + d) << 3) >> 16,
      ((this.pointPositions[r][1] + g) << 3) >> 16
    );
    if (r > 1) {
      if (this.pointPositions[r][0] > this.shadowStartXF16 && s === 0) s = r - 1;
      if (this.pointPositions[r][0] > this.shadowEndXF16 && n === 0) n = r - 1;
    }
    if (this.startFlagPoint === r) {
      t.renderStartFlag(
        ((this.pointPositions[this.startFlagPoint][0] + d) << 3) >> 16,
        ((this.pointPositions[this.startFlagPoint][1] + g) << 3) >> 16
      );
      t.setColor(0, 170, 0);
    }
    if (this.finishFlagPoint === r) {
      t.renderFinishFlag(
        ((this.pointPositions[this.finishFlagPoint][0] + d) << 3) >> 16,
        ((this.pointPositions[this.finishFlagPoint][1] + g) << 3) >> 16
      );
      t.setColor(0, 170, 0);
    }
    if (this.pointPositions[r][0] > this.maxX) break;
    ++r;
  }
  t.drawLine(
    (this.pointPositions[this.pointsCount - 1][0] << 3) >> 16,
    (this.pointPositions[this.pointsCount - 1][1] << 3) >> 16,
    ((this.pointPositions[this.pointsCount - 1][0] + o) << 3) >> 16,
    ((this.pointPositions[this.pointsCount - 1][1] + l) << 3) >> 16
  );
  if (p.isEnabledShadows) this.renderShadow(t, s, n);
};
At.prototype.renderTrackNearestGreenLine = function (t) {
  var e = 0;
  for (e = 0; e < this.pointsCount - 1 && this.pointPositions[e][0] <= this.minX; ++e);
  if (e > 0) --e;
  for (; e < this.pointsCount - 1; ) {
    t.drawLine(
      (this.pointPositions[e][0] << 3) >> 16,
      (this.pointPositions[e][1] << 3) >> 16,
      (this.pointPositions[e + 1][0] << 3) >> 16,
      (this.pointPositions[e + 1][1] << 3) >> 16
    );
    if (this.startFlagPoint === e) {
      t.renderStartFlag(
        (this.pointPositions[this.startFlagPoint][0] << 3) >> 16,
        (this.pointPositions[this.startFlagPoint][1] << 3) >> 16
      );
      t.setColor(0, 255, 0);
    }
    if (this.finishFlagPoint === e) {
      t.renderFinishFlag(
        (this.pointPositions[this.finishFlagPoint][0] << 3) >> 16,
        (this.pointPositions[this.finishFlagPoint][1] << 3) >> 16
      );
      t.setColor(0, 255, 0);
    }
    if (this.pointPositions[e][0] > this.maxX) break;
    ++e;
  }
};
At.prototype.addPointSimple = function (t, e) {
  this.addPoint((t << 16) >> 3, (e << 16) >> 3);
};
At.prototype.addPoint = function (t, e) {
  if (this.pointPositions.length === 0 || this.pointPositions.length <= this.pointsCount) {
    var i = 100;
    if (this.pointPositions.length !== 0) {
      i = i < this.pointPositions.length + 30 ? this.pointPositions.length + 30 : i;
    }
    var s = new Array(i);
    for (var n = 0; n < i; ++n) {
      s[n] = n < this.pointPositions.length ? this.pointPositions[n] : [0, 0];
    }
    this.pointPositions = s;
  }
  if (this.pointsCount === 0 || this.pointPositions[this.pointsCount - 1][0] < t) {
    this.pointPositions[this.pointsCount][0] = t;
    this.pointPositions[this.pointsCount][1] = e;
    ++this.pointsCount;
  }
};
At.prototype.load = function (t) {
  this.init();
  if (t.readInt8() === 50) t.readBytes(20);
  this.finishFlagPoint = 0;
  this.startFlagPoint = 0;
  this.startPosX = t.readInt32(true);
  this.startPosY = t.readInt32(true);
  this.finishPosX = t.readInt32(true);
  this.finishPosY = t.readInt32(true);
  var i = t.readInt16(true);
  var s = t.readInt32(true);
  var n = t.readInt32(true);
  var r = s;
  var o = n;
  this.addPointSimple(s, n);
  for (var l = 1; l < i; ++l) {
    var c = t.readInt8();
    if (c === -1) {
      o = 0;
      r = 0;
      s = t.readInt32(true);
      n = t.readInt32(true);
    } else {
      s = c;
      n = t.readInt8();
    }
    r += s;
    o += n;
    this.addPointSimple(r, o);
  }
};

function B(t, e, i) {
  this.text = "";
  this.targetMenu = null;
  this.menuManager = null;
  this.xF16 = 0;
  this.yF16 = 0;
  this.angleF16 = 0;
  this.velocityXF16 = 0;
  this.velocityYF16 = 0;
  this.angularVelocityF16 = 0;
  this.forceXF16 = 0;
  this.forceYF16 = 0;
  this.torqueF16 = 0;
  this.timerNo = 0;
  this.micro = null;
  this.resetState();
  if (typeof t === "number") {
    this.micro = e;
    this.timerNo = t;
    return;
  }
  if (typeof t === "string") {
    this.text = t + ">";
    this.targetMenu = e !== undefined && e !== null ? e : null;
    this.menuManager = i !== undefined && i !== null ? i : null;
  }
}
B.prototype.resetState = function () {
  this.xF16 = 0;
  this.yF16 = 0;
  this.angleF16 = 0;
  this.velocityXF16 = 0;
  this.velocityYF16 = 0;
  this.angularVelocityF16 = 0;
  this.forceXF16 = 0;
  this.forceYF16 = 0;
  this.torqueF16 = 0;
};
B.prototype.setText = function (t) {
  this.text = t + ">";
};
B.prototype.getText = function () {
  return this.text;
};
B.prototype.isNotTextRender = function () {
  return true;
};
B.prototype.menuElemMethod = function (t) {
  switch (t) {
    case 1:
    case 2:
      if (this.menuManager) {
        this.menuManager.handleMenuSelection(this);
        if (this.targetMenu) {
          this.targetMenu.setParentMenu(this.menuManager.getCurrentMenu() || null);
        }
        this.menuManager.openMenu(this.targetMenu, false);
      }
      break;
  }
};
B.prototype.setParentMenu = function (t) {
  this.targetMenu = t;
};
B.prototype.render = function (t, e, i) {
  t.drawString(this.text, i, e, u.LEFT | u.TOP);
};

function p(t) {
  this.edgeNormalsF16 = [];
  this.outerCollisionRadiusSqByShape = [0, 0, 0];
  this.innerCollisionRadiusSqByShape = [0, 0, 0];
  this.edgeNormalsCapacity = 0;
  this.gameLevel = null;
  this.currentLeagueIndex = 0;
  this.currentTrackIndex = -1;
  this.levelNames = [[], [], []];
  this.startPosXF16 = 0;
  this.startPosYF16 = 0;
  this.maxTrackPointX = 0;
  this.collisionNormalXF16 = 0;
  this.collisionNormalYF16 = 0;

  for (var e = 0; e < 3; ++e) {
    var i = (h.const175_1_half[e] + 19660) >> 1;
    var s = (h.const175_1_half[e] - 19660) >> 1;
    this.outerCollisionRadiusSqByShape[e] = a(i, i);
    this.innerCollisionRadiusSqByShape[e] = a(s, s);
  }
  this.levelFileStream = t;
  this.loadLevels();
  this.loadNextLevel();
}
p.shapeIndex0 = 0;
p.shapeIndex1 = 1;
p.shapeIndex2 = 2;
p.collisionResult0 = 0;
p.collisionResult1 = 1;
p.isEnabledPerspective = true;
p.isEnabledShadows = true;
p.levelOffsetInFile = [[], [], []];
p.visibleStartPointIndex = 0;
p.visibleEndPointIndex = 0;
p.visibleStartPointX = 0;
p.visibleEndPointX = 0;
p.create = function (t) {
  return nt.fromUrl(t).then(function (e) {
    return new p(e);
  });
};
p.prototype.loadLevels = function () {
  var t = [0, 0, 0];
  for (var i = 0; i < 3; ++i) {
    t[i] = this.levelFileStream.readInt32(true);
    p.levelOffsetInFile[i] = new Array(t[i]);
    this.levelNames[i] = new Array(t[i]);
    for (var s = 0; s < t[i]; ++s) {
      var n = this.levelFileStream.readInt32(true);
      p.levelOffsetInFile[i][s] = n;
      var r = new Uint8Array(40);
      var o = 40;
      for (var c = 0; c < 40; ++c) {
        r[c] = this.levelFileStream.readInt8();
        if (r[c] === 0) {
          o = c;
          break;
        }
      }
      var str = "";
      for (var k = 0; k < o; k++) {
        str += String.fromCharCode(r[k]);
      }
      var l = str.replace(/_/g, " ");
      this.levelNames[i][s] = l;
    }
  }
};
p.prototype.getName = function (t, e) {
  if (t < 3 && e < this.levelNames[t].length) return this.levelNames[t][e];
  return "---";
};
p.prototype.loadNextLevel = function () {
  this.loadLevel(this.currentLeagueIndex, this.currentTrackIndex + 1);
};
p.prototype.loadLevel = function (t, e) {
  this.currentLeagueIndex = t;
  this.currentTrackIndex = e;
  if (this.currentTrackIndex >= this.levelNames[this.currentLeagueIndex].length) {
    this.currentTrackIndex = 0;
  }
  this.readLevelFromArchive(this.currentLeagueIndex + 1, this.currentTrackIndex + 1);
  return this.currentTrackIndex;
};
p.prototype.readLevelFromArchive = function (t, e) {
  this.levelFileStream.setPos(p.levelOffsetInFile[t - 1][e - 1]);
  if (this.gameLevel === null) this.gameLevel = new At();
  this.gameLevel.load(this.levelFileStream);
  this.prepareLevelGeometry(this.gameLevel);
};
p.prototype.cacheStartPosition = function (t) {
  if (this.gameLevel !== null) {
    this.startPosXF16 = this.gameLevel.startPosX << 1;
    this.startPosYF16 = this.gameLevel.startPosY << 1;
  }
};
p.prototype.getFinishX = function () {
  return this.gameLevel === null ? 0 : this.gameLevel.pointPositions[this.gameLevel.finishFlagPoint][0] << 1;
};
p.prototype.getStartX = function () {
  return this.gameLevel === null ? 0 : this.gameLevel.pointPositions[this.gameLevel.startFlagPoint][0] << 1;
};
p.prototype.getStartPosX = function () {
  return this.gameLevel === null ? 0 : this.gameLevel.startPosX << 1;
};
p.prototype.getStartPosY = function () {
  return this.gameLevel === null ? 0 : this.gameLevel.startPosY << 1;
};
p.prototype.getProgressF16 = function (t) {
  return this.gameLevel === null ? 0 : this.gameLevel.getProgressF16(t >> 1);
};
p.prototype.prepareLevelGeometry = function (t) {
  this.maxTrackPointX = ct;
  this.gameLevel = t;
  var e = t.pointsCount;
  if (this.edgeNormalsF16.length === 0 || this.edgeNormalsCapacity < e) {
    this.edgeNormalsCapacity = e < 100 ? 100 : e;
    this.edgeNormalsF16 = new Array(this.edgeNormalsCapacity);
    for (var i = 0; i < this.edgeNormalsCapacity; ++i) {
      this.edgeNormalsF16[i] = [0, 0];
    }
  }
  p.visibleStartPointIndex = 0;
  p.visibleEndPointIndex = 0;
  p.visibleStartPointX = t.pointPositions[p.visibleStartPointIndex][0];
  p.visibleEndPointX = t.pointPositions[p.visibleEndPointIndex][0];
  for (var sIdx = 0; sIdx < e; ++sIdx) {
    var s = t.pointPositions[(sIdx + 1) % e][0] - t.pointPositions[sIdx][0];
    var n = t.pointPositions[(sIdx + 1) % e][1] - t.pointPositions[sIdx][1];
    if (sIdx !== 0 && sIdx !== e - 1) {
      this.maxTrackPointX = this.maxTrackPointX < t.pointPositions[sIdx][0] ? t.pointPositions[sIdx][0] : this.maxTrackPointX;
    }
    var r = -n;
    var o = h.getSmthLikeMaxAbs(r, s);
    this.edgeNormalsF16[sIdx][0] = P(r, o);
    this.edgeNormalsF16[sIdx][1] = P(s, o);
    if (t.startFlagPoint === 0 && t.pointPositions[sIdx][0] > t.startPosX) {
      t.startFlagPoint = sIdx + 1;
    }
    if (t.finishFlagPoint === 0 && t.pointPositions[sIdx][0] > t.finishPosX) {
      t.finishFlagPoint = sIdx;
    }
  }
  p.visibleStartPointIndex = 0;
  p.visibleEndPointIndex = 0;
  p.visibleStartPointX = 0;
  p.visibleEndPointX = 0;
};
p.prototype.setMinMaxX = function (t, e) {
  if (this.gameLevel) this.gameLevel.setMinMaxX(t, e);
};
p.prototype.renderLevel3D = function (t, e, i) {
  if (this.gameLevel !== null) {
    t.setColor(0, 170, 0);
    e >>= 1;
    i >>= 1;
    this.gameLevel.renderLevel3D(t, e, i);
  }
};
p.prototype.renderTrackNearestLine = function (t) {
  if (this.gameLevel !== null) {
    t.setColor(0, 255, 0);
    this.gameLevel.renderTrackNearestGreenLine(t);
  }
};
p.prototype.updateVisiblePointRange = function (t, e, i) {
  if (this.gameLevel !== null) {
    this.gameLevel.setShadowProjectionState((t + 98304) >> 1, (e - 98304) >> 1, i >> 1);
    e >>= 1;
    t >>= 1;
    p.visibleEndPointIndex = p.visibleEndPointIndex < this.gameLevel.pointsCount - 1 ? p.visibleEndPointIndex : this.gameLevel.pointsCount - 1;
    p.visibleStartPointIndex = p.visibleStartPointIndex < 0 ? 0 : p.visibleStartPointIndex;
    if (e > p.visibleEndPointX) {
      for (; p.visibleEndPointIndex < this.gameLevel.pointsCount - 1 && e > this.gameLevel.pointPositions[++p.visibleEndPointIndex][0]; );
    } else if (t < p.visibleStartPointX) {
      for (; p.visibleStartPointIndex > 0 && t < this.gameLevel.pointPositions[--p.visibleStartPointIndex][0]; );
    } else {
      for (; p.visibleStartPointIndex < this.gameLevel.pointsCount && t > this.gameLevel.pointPositions[++p.visibleStartPointIndex][0]; );
      if (p.visibleStartPointIndex > 0) --p.visibleStartPointIndex;
      for (; p.visibleEndPointIndex > 0 && e < this.gameLevel.pointPositions[--p.visibleEndPointIndex][0]; );
      p.visibleEndPointIndex = p.visibleEndPointIndex + 1 < this.gameLevel.pointsCount - 1 ? p.visibleEndPointIndex + 1 : this.gameLevel.pointsCount - 1;
    }
    p.visibleStartPointX = this.gameLevel.pointPositions[p.visibleStartPointIndex][0];
    p.visibleEndPointX = this.gameLevel.pointPositions[p.visibleEndPointIndex][0];
  }
};
p.prototype.detectCollision = function (t, e) {
  if (this.gameLevel === null) return 2;
  var i = 0;
  var s = 2;
  var n = t.xF16 >> 1;
  var r = t.yF16 >> 1;
  if (p.isEnabledPerspective) r -= 65536;
  var o = 0;
  var l = 0;
  for (var c = p.visibleStartPointIndex; c < p.visibleEndPointIndex; ++c) {
    var d = this.gameLevel.pointPositions[c][0];
    var g = this.gameLevel.pointPositions[c][1];
    var F = this.gameLevel.pointPositions[c + 1][0];
    var T = this.gameLevel.pointPositions[c + 1][1];
    if (n - this.outerCollisionRadiusSqByShape[e] <= F && n + this.outerCollisionRadiusSqByShape[e] >= d) {
      var b = d - F;
      var I = g - T;
      var L = a(b, b) + a(I, I);
      var R = a(n - d, -b) + a(r - g, -I);
      var x;
      if ($(L) >= 3) {
        x = P(R, L);
      } else {
        x = (R > 0 ? 1 : -1) * (L > 0 ? 1 : -1) * lt;
      }
      if (x < 0) x = 0;
      if (x > 65536) x = 65536;
      var N = d + a(x, -b);
      var m = g + a(x, -I);
      b = n - N;
      I = r - m;
      var M;
      var k = a(b, b) + a(I, I);
      if (k < this.outerCollisionRadiusSqByShape[e]) {
        if (k >= this.innerCollisionRadiusSqByShape[e]) {
          M = 1;
        } else {
          M = 0;
        }
      } else {
        M = 2;
      }
      if (M === 0 && a(this.edgeNormalsF16[c][0], t.velocityXF16) + a(this.edgeNormalsF16[c][1], t.velocityYF16) < 0) {
        this.collisionNormalXF16 = this.edgeNormalsF16[c][0];
        this.collisionNormalYF16 = this.edgeNormalsF16[c][1];
        return 0;
      }
      if (M === 1 && a(this.edgeNormalsF16[c][0], t.velocityXF16) + a(this.edgeNormalsF16[c][1], t.velocityYF16) < 0) {
        ++i;
        s = 1;
        if (i === 1) {
          o = this.edgeNormalsF16[c][0];
          l = this.edgeNormalsF16[c][1];
        } else {
          o += this.edgeNormalsF16[c][0];
          l += this.edgeNormalsF16[c][1];
        }
      }
    }
  }
  if (s === 1) {
    if (a(o, t.velocityXF16) + a(l, t.velocityYF16) >= 0) return 2;
    this.collisionNormalXF16 = o;
    this.collisionNormalYF16 = l;
  }
  return s;
};

function vt() {
  this.motoComponents = new Array(6);
  for (var t = 0; t < 6; ++t) this.motoComponents[t] = new B();
  this.unusedBool = true;
  this.collisionRadiusF16 = 0;
  this.collisionShapeIndex = 0;
  this.inverseMassF16 = 0;
  this.angularForceFactorF16 = 0;
  this.reset();
}
vt.prototype.reset = function () {
  this.collisionRadiusF16 = 0;
  this.inverseMassF16 = 0;
  this.angularForceFactorF16 = 0;
  this.unusedBool = true;
  for (var t = 0; t < 6; ++t) this.motoComponents[t].resetState();
};

function kt(S, t, e) {
  return Math.max(S, t, e);
}

function Ct(S, t, e) {
  return Math.min(S, t, e);
}

function h(t) {
  this.index01 = 0;
  this.index10 = 1;
  this.collisionBodyIndex = -1;
  this.constraints = [];
  this.wheelTorqueF16 = 0;
  this.collisionNormalXF16 = 0;
  this.collisionNormalYF16 = 0;
  this.isCrashed = false;
  this.isRiderDown = false;
  this.riderPoseBlendF16 = 32768;
  this.leanStepF16 = 3276;
  this.rotationSpeedF16 = 0;
  this.unusedFlag42 = false;
  this.motoComponents = new Array(6);
  for (var e = 0; e < 6; ++e) this.motoComponents[e] = new B();
  this.unusedCounter44 = 0;
  this.isInputAcceleration = false;
  this.isInputBreak = false;
  this.isInputBack = false;
  this.isInputForward = false;
  this.isInputUp = false;
  this.isInputDown = false;
  this.isInputLeft = false;
  this.isInputRight = false;
  this.finishTriggerLatched = false;
  this.isEnableLookAhead = true;
  this.camShiftX = 0;
  this.camShiftY = 0;
  this.lookAheadClampF16 = 655360;
  this.hardcodedArr1 = [
    [183500, -52428], [262144, -163840], [406323, -65536], [445644, -39321],
    [235929, 39321], [16384, -144179], [13107, -78643], [288358, 81920]
  ];
  this.hardcodedArr2 = [
    [190054, -111411], [308019, -235929], [334233, -114688], [393216, -58982],
    [262144, 98304], [65536, -124518], [13107, -78643], [288358, 81920]
  ];
  this.hardcodedArr3 = [
    [157286, 13107], [294912, -13107], [367001, 91750], [406323, 190054],
    [347340, 72089], [39321, -98304], [13107, -52428], [294912, 81920]
  ];
  this.hardcodedArr4 = [
    [183500, -39321], [262144, -131072], [393216, -65536], [458752, -39321],
    [294912, 6553], [16384, -144179], [13107, -78643], [288358, 85196]
  ];
  this.hardcodedArr5 = [
    [190054, -91750], [255590, -235929], [334233, -114688], [393216, -42598],
    [301465, 6553], [65536, -78643], [13107, -78643], [288358, 85196]
  ];
  this.hardcodedArr6 = [
    [157286, 13107], [294912, -13107], [367001, 104857], [406323, 176947],
    [347340, 72089], [39321, -98304], [13107, -52428], [288358, 85196]
  ];
  this.riderPoseBlendTable = [[45875], [32768], [52428]];
  this.bikeParts = [];
  this.unusedFlag41 = false;
  this.mode = 0;
  this.isRenderDriverWithSprites = false;
  this.isRenderMotoWithSprites = false;
  this.isTrackFinished = false;
  this.isGenerateInputAI = false;

  this.levelLoader = t;
  this.resetSmth(true);
  this.isGenerateInputAI = false;
  this.syncRenderStateFromSimulation();
  this.isCrashed = false;
}
h.physicsStepCount = 0;
h.gravityForceF16 = 0;
h.tireGripF16 = 0;
h.tireDampingF16 = 0;
h.tireAngularDampingF16 = 0;
h.motoParam1 = 0;
h.motoParam2 = 0;
h.massScaleF16 = 0;
h.motoParam10 = 0;
h.constraintAngleF16 = 0;
h.const175_1_half = [114688, 65536, 32768];
h.motoParam3 = 0;
h.torqueDampingF16 = 0;
h.motoParam4 = 0;
h.motoParam5 = 0;
h.motoParam6 = 0;
h.motoParam7 = 0;
h.motoParam8 = 0;
h.motoParam9 = 0;
h.curentMotoLeague = 0;

h.prototype.getLoadedSpriteFlags = function () {
  return this.isRenderDriverWithSprites && this.isRenderMotoWithSprites ? 3 : this.isRenderMotoWithSprites ? 1 : this.isRenderDriverWithSprites ? 2 : 0;
};
h.prototype.applyLoadedSpriteFlags = function (t) {
  this.isRenderDriverWithSprites = false;
  this.isRenderMotoWithSprites = false;
  if ((t & 2) !== 0) this.isRenderDriverWithSprites = true;
  if ((t & 1) !== 0) this.isRenderMotoWithSprites = true;
};
h.prototype.setMode = function (t) {
  this.mode = t;
  h.physicsStepCount = 1310;
  h.gravityForceF16 = 1638400;
  this.setMotoLeague(1);
  this.resetSmth(true);
};
h.prototype.setMotoLeague = function (t) {
  h.curentMotoLeague = t;
  h.tireGripF16 = 45875;
  h.tireDampingF16 = 13107;
  h.tireAngularDampingF16 = 39321;
  h.massScaleF16 = 1310720;
  h.constraintAngleF16 = 262144;
  h.torqueDampingF16 = 6553;
  switch (t) {
    case 0:
    default:
      h.motoParam1 = 19660;
      h.motoParam2 = 19660;
      h.motoParam3 = 1114112;
      h.motoParam4 = 52428800;
      h.motoParam5 = 3276800;
      h.motoParam6 = 327;
      h.motoParam7 = 0;
      h.motoParam8 = 32768;
      h.motoParam9 = 327680;
      h.motoParam10 = 19660800;
      break;
    case 1:
      h.motoParam1 = 32768;
      h.motoParam2 = 32768;
      h.motoParam3 = 1114112;
      h.motoParam4 = 65536e3;
      h.motoParam5 = 3276800;
      h.motoParam6 = 6553;
      h.motoParam7 = 26214;
      h.motoParam8 = 26214;
      h.motoParam9 = 327680;
      h.motoParam10 = 19660800;
      break;
    case 2:
      h.motoParam1 = 32768;
      h.motoParam2 = 32768;
      h.motoParam3 = 1310720;
      h.motoParam4 = 75366400;
      h.motoParam5 = 3473408;
      h.motoParam6 = 6553;
      h.motoParam7 = 26214;
      h.motoParam8 = 39321;
      h.motoParam9 = 327680;
      h.motoParam10 = 21626880;
      break;
    case 3:
      h.motoParam1 = 32768;
      h.motoParam2 = 32768;
      h.motoParam3 = 1441792;
      h.motoParam4 = 78643200;
      h.motoParam5 = 3538944;
      h.motoParam6 = 6553;
      h.motoParam7 = 26214;
      h.motoParam8 = 65536;
      h.motoParam9 = 1310720;
      h.motoParam10 = 21626880;
  }
  this.resetSmth(true);
};
h.prototype.resetSmth = function (t) {
  this.unusedCounter44 = 0;
  this.initializeBikeState(this.levelLoader.getStartPosX(), this.levelLoader.getStartPosY());
  this.wheelTorqueF16 = 0;
  this.rotationSpeedF16 = 0;
  this.isCrashed = false;
  this.isRiderDown = false;
  this.finishTriggerLatched = false;
  this.isTrackFinished = false;
  this.isGenerateInputAI = false;
  this.unusedFlag41 = false;
  this.unusedFlag42 = false;
  if (this.levelLoader.gameLevel) {
    this.levelLoader.gameLevel.setShadowProjectionRange(
      this.bikeParts[2].motoComponents[5].xF16 + 98304 - h.const175_1_half[0],
      this.bikeParts[1].motoComponents[5].xF16 - 98304 + h.const175_1_half[0]
    );
  }
};
h.prototype.applyPerspectiveOffset = function (t) {
  var e = (t ? 65536 : -65536) << 1;
  for (var i = 0; i < 6; ++i) {
    for (var s = 0; s < 6; ++s) {
      this.bikeParts[i].motoComponents[s].yF16 += e;
    }
  }
};
h.prototype.initializeBikeState = function (t, e) {
  if (this.bikeParts.length === 0) this.bikeParts = new Array(6);
  if (this.constraints.length === 0) this.constraints = new Array(10);
  var i = 0;
  var s = 0;
  var n = 0;
  var r = 0;
  for (var o = 0; o < 6; ++o) {
    var l = 0;
    switch (o) {
      case 0:
        s = 1; i = 360448; n = 0; r = 0;
        break;
      case 1:
        s = 0; i = 98304; n = 229376; r = 0;
        break;
      case 2:
        s = 0; i = 360448; n = -229376; r = 0; l = 21626;
        break;
      case 3:
        s = 1; i = 229376; n = 131072; r = 196608;
        break;
      case 4:
        s = 1; i = 229376; n = -131072; r = 196608;
        break;
      case 5:
        s = 2; i = 294912; n = 0; r = 327680;
    }
    if (!this.bikeParts[o]) this.bikeParts[o] = new vt();
    this.bikeParts[o].reset();
    this.bikeParts[o].collisionRadiusF16 = h.const175_1_half[s];
    this.bikeParts[o].collisionShapeIndex = s;
    this.bikeParts[o].inverseMassF16 = a(P(65536, i), h.massScaleF16);
    this.bikeParts[o].motoComponents[this.index01].xF16 = t + n;
    this.bikeParts[o].motoComponents[this.index01].yF16 = e + r;
    this.bikeParts[o].motoComponents[5].xF16 = t + n;
    this.bikeParts[o].motoComponents[5].yF16 = e + r;
    this.bikeParts[o].angularForceFactorF16 = l;
  }
  for (var o2 = 0; o2 < 10; ++o2) {
    if (!this.constraints[o2]) this.constraints[o2] = new B();
    this.constraints[o2].resetState();
    this.constraints[o2].xF16 = h.motoParam10;
    this.constraints[o2].angleF16 = h.constraintAngleF16;
  }
  this.constraints[0].yF16 = 229376;
  this.constraints[1].yF16 = 229376;
  this.constraints[2].yF16 = 236293;
  this.constraints[3].yF16 = 236293;
  this.constraints[4].yF16 = 262144;
  this.constraints[5].yF16 = 219814;
  this.constraints[6].yF16 = 219814;
  this.constraints[7].yF16 = 185363;
  this.constraints[8].yF16 = 185363;
  this.constraints[9].yF16 = 327680;
  this.constraints[5].angleF16 = a(h.constraintAngleF16, 45875);
  this.constraints[6].xF16 = a(6553, h.motoParam10);
  this.constraints[5].xF16 = a(6553, h.motoParam10);
  this.constraints[9].xF16 = a(72089, h.motoParam10);
  this.constraints[8].xF16 = a(72089, h.motoParam10);
  this.constraints[7].xF16 = a(72089, h.motoParam10);
};
h.prototype.setRenderMinMaxX = function (t, e) {
  this.levelLoader.setMinMaxX(t, e);
};
h.prototype.processPointerReleased = function () {
  this.isInputUp = false;
  this.isInputDown = false;
  this.isInputRight = false;
  this.isInputLeft = false;
};
h.prototype.setInputDirection = function (t, e) {
  if (!this.isGenerateInputAI) {
    this.isInputUp = false;
    this.isInputDown = false;
    this.isInputRight = false;
    this.isInputLeft = false;
    if (t > 0) {
      this.isInputUp = true;
    } else if (t < 0) {
      this.isInputDown = true;
    }
    if (e > 0) {
      this.isInputRight = true;
      return;
    }
    if (e < 0) this.isInputLeft = true;
  }
};
h.prototype.enableGenerateInputAI = function () {
  this.resetSmth(true);
  this.isGenerateInputAI = true;
};
h.prototype.disableGenerateInputAI = function () {
  this.isGenerateInputAI = false;
};
h.prototype.setInputFromAI = function () {
  var t = this.bikeParts[1].motoComponents[this.index01].xF16 - this.bikeParts[2].motoComponents[this.index01].xF16;
  var e = this.bikeParts[1].motoComponents[this.index01].yF16 - this.bikeParts[2].motoComponents[this.index01].yF16;
  var i = h.getSmthLikeMaxAbs(t, e);
  e = P(e, i);
  this.isInputBreak = false;
  if (e < 0) {
    this.isInputBack = true;
    this.isInputForward = false;
  } else if (e > 0) {
    this.isInputForward = true;
    this.isInputBack = false;
  }
  var s = (this.bikeParts[2].motoComponents[this.index01].yF16 - this.bikeParts[0].motoComponents[this.index01].yF16 > 0 ? 1 : -1) *
          (this.bikeParts[2].motoComponents[this.index01].velocityXF16 - this.bikeParts[0].motoComponents[this.index01].velocityXF16 > 0 ? 1 : -1) > 0;
  if ((!s || !this.isInputForward) && (s || !this.isInputBack)) {
    this.isInputAcceleration = false;
  } else {
    this.isInputAcceleration = true;
  }
};
h.prototype.updateBikeControl = function () {
  if (!this.isCrashed) {
    var t = this.bikeParts[1].motoComponents[this.index01].xF16 - this.bikeParts[2].motoComponents[this.index01].xF16;
    var e = this.bikeParts[1].motoComponents[this.index01].yF16 - this.bikeParts[2].motoComponents[this.index01].yF16;
    var i = h.getSmthLikeMaxAbs(t, e);
    t = P(t, i);
    e = P(e, i);
    if (this.isInputAcceleration && this.wheelTorqueF16 >= -h.motoParam4) {
      this.wheelTorqueF16 -= h.motoParam5;
    }
    if (this.isInputBreak) {
      this.wheelTorqueF16 = 0;
      this.bikeParts[1].motoComponents[this.index01].angularVelocityF16 = a(this.bikeParts[1].motoComponents[this.index01].angularVelocityF16, 65536 - h.motoParam6);
      this.bikeParts[2].motoComponents[this.index01].angularVelocityF16 = a(this.bikeParts[2].motoComponents[this.index01].angularVelocityF16, 65536 - h.motoParam6);
      if (this.bikeParts[1].motoComponents[this.index01].angularVelocityF16 < 6553) {
        this.bikeParts[1].motoComponents[this.index01].angularVelocityF16 = 0;
      }
      if (this.bikeParts[2].motoComponents[this.index01].angularVelocityF16 < 6553) {
        this.bikeParts[2].motoComponents[this.index01].angularVelocityF16 = 0;
      }
    }
    this.bikeParts[0].inverseMassF16 = a(11915, h.massScaleF16);
    this.bikeParts[4].inverseMassF16 = a(18724, h.massScaleF16);
    this.bikeParts[3].inverseMassF16 = a(18724, h.massScaleF16);
    this.bikeParts[1].inverseMassF16 = a(43690, h.massScaleF16);
    this.bikeParts[2].inverseMassF16 = a(11915, h.massScaleF16);
    this.bikeParts[5].inverseMassF16 = a(14563, h.massScaleF16);
    if (this.isInputBack) {
      this.bikeParts[0].inverseMassF16 = a(18724, h.massScaleF16);
      this.bikeParts[4].inverseMassF16 = a(14563, h.massScaleF16);
      this.bikeParts[3].inverseMassF16 = a(18724, h.massScaleF16);
      this.bikeParts[1].inverseMassF16 = a(43690, h.massScaleF16);
      this.bikeParts[2].inverseMassF16 = a(10082, h.massScaleF16);
    } else if (this.isInputForward) {
      this.bikeParts[0].inverseMassF16 = a(18724, h.massScaleF16);
      this.bikeParts[4].inverseMassF16 = a(18724, h.massScaleF16);
      this.bikeParts[3].inverseMassF16 = a(14563, h.massScaleF16);
      this.bikeParts[1].inverseMassF16 = a(26214, h.massScaleF16);
      this.bikeParts[2].inverseMassF16 = a(11915, h.massScaleF16);
    }
    if (this.isInputBack || this.isInputForward) {
      var s = -e;
      var n, r, o, l, c, d;
      if (this.isInputBack && this.rotationSpeedF16 > -h.motoParam9) {
        n = 65536;
        if (this.rotationSpeedF16 < 0) n = P(h.motoParam9 - $(this.rotationSpeedF16), h.motoParam9);
        r = a(h.motoParam8, n);
        o = a(s, r);
        l = a(t, r);
        c = a(t, r);
        d = a(e, r);
        if (this.riderPoseBlendF16 > 32768) {
          this.riderPoseBlendF16 = this.riderPoseBlendF16 - 1638 < 0 ? 0 : this.riderPoseBlendF16 - 1638;
        } else {
          this.riderPoseBlendF16 = this.riderPoseBlendF16 - 3276 < 0 ? 0 : this.riderPoseBlendF16 - 3276;
        }
        this.bikeParts[4].motoComponents[this.index01].velocityXF16 -= o;
        this.bikeParts[4].motoComponents[this.index01].velocityYF16 -= l;
        this.bikeParts[3].motoComponents[this.index01].velocityXF16 += o;
        this.bikeParts[3].motoComponents[this.index01].velocityYF16 += l;
        this.bikeParts[5].motoComponents[this.index01].velocityXF16 -= c;
        this.bikeParts[5].motoComponents[this.index01].velocityYF16 -= d;
      }
      if (this.isInputForward && this.rotationSpeedF16 < h.motoParam9) {
        n = 65536;
        if (this.rotationSpeedF16 > 0) n = P(h.motoParam9 - this.rotationSpeedF16, h.motoParam9);
        r = a(h.motoParam8, n);
        o = a(s, r);
        l = a(t, r);
        c = a(t, r);
        d = a(e, r);
        if (this.riderPoseBlendF16 > 32768) {
          this.riderPoseBlendF16 = this.riderPoseBlendF16 + 1638 < 65536 ? this.riderPoseBlendF16 + 1638 : 65536;
        } else {
          this.riderPoseBlendF16 = this.riderPoseBlendF16 + 3276 < 65536 ? this.riderPoseBlendF16 + 3276 : 65536;
        }
        this.bikeParts[4].motoComponents[this.index01].velocityXF16 += o;
        this.bikeParts[4].motoComponents[this.index01].velocityYF16 += l;
        this.bikeParts[3].motoComponents[this.index01].velocityXF16 -= o;
        this.bikeParts[3].motoComponents[this.index01].velocityYF16 -= l;
        this.bikeParts[5].motoComponents[this.index01].velocityXF16 += c;
        this.bikeParts[5].motoComponents[this.index01].velocityYF16 += d;
      }
      return;
    }
    if (this.riderPoseBlendF16 < 26214) {
      this.riderPoseBlendF16 += 3276;
      return;
    }
    if (this.riderPoseBlendF16 > 39321) {
      this.riderPoseBlendF16 -= 3276;
      return;
    }
    this.riderPoseBlendF16 = 32768;
  }
};
h.prototype.updatePhysics = function () {
  this.isInputAcceleration = this.isInputUp;
  this.isInputBreak = this.isInputDown;
  this.isInputBack = this.isInputLeft;
  this.isInputForward = this.isInputRight;
  if (this.isGenerateInputAI) this.setInputFromAI();
  f.advanceFlagAnimation();
  this.updateBikeControl();
  var t = this.solvePhysicsStep(h.physicsStepCount);
  if (t !== 5 && !this.isRiderDown) {
    if (this.isCrashed) return 3;
    if (this.isTrackStarted()) {
      this.isTrackFinished = false;
      return 4;
    }
    return t;
  }
  return 5;
};
h.prototype.isTrackStarted = function () {
  return this.bikeParts[1].motoComponents[this.index01].xF16 < this.levelLoader.getStartX();
};
h.prototype.hasPassedFinishLine = function () {
  return (
    this.bikeParts[1].motoComponents[this.index10].xF16 > this.levelLoader.getFinishX() ||
    this.bikeParts[2].motoComponents[this.index10].xF16 > this.levelLoader.getFinishX()
  );
};
h.prototype.solvePhysicsStep = function (t) {
  var e = this.finishTriggerLatched;
  var i = 0;
  var s = t;
  for (;;) {
    for (; i < t; ) {
      this.stepSimulation(s - i);
      var r = !e && this.hasPassedFinishLine() ? 3 : this.detectCollisionForStep(this.index10);
      if (!e && this.finishTriggerLatched) return r !== 3 ? 2 : 1;
      if (r === 0) {
        s = (i + s) >> 1;
        continue;
      }
      if (r === 3) {
        this.finishTriggerLatched = true;
        s = (i + s) >> 1;
      } else {
        if (r === 1) {
          var o = 0;
          do {
            this.resolveCollision(this.index10);
            o = this.detectCollisionForStep(this.index10);
            if (o === 0) return 5;
          } while (o !== 2);
        }
        i = s;
        s = t;
        this.index01 = this.index01 === 1 ? 0 : 1;
        this.index10 = this.index10 === 1 ? 0 : 1;
      }
    }
    var n = a(
      this.bikeParts[1].motoComponents[this.index01].xF16 - this.bikeParts[2].motoComponents[this.index01].xF16,
      this.bikeParts[1].motoComponents[this.index01].xF16 - this.bikeParts[2].motoComponents[this.index01].xF16
    ) + a(
      this.bikeParts[1].motoComponents[this.index01].yF16 - this.bikeParts[2].motoComponents[this.index01].yF16,
      this.bikeParts[1].motoComponents[this.index01].yF16 - this.bikeParts[2].motoComponents[this.index01].yF16
    );
    if (n < 983040) this.isCrashed = true;
    if (n > 4587520) this.isCrashed = true;
    return 0;
  }
};
h.prototype.accumulateForces = function (t) {
  for (var l = 0; l < 6; ++l) {
    var c = this.bikeParts[l];
    var d = c.motoComponents[t];
    d.forceXF16 = 0;
    d.forceYF16 = 0;
    d.torqueF16 = 0;
    d.forceYF16 -= P(h.gravityForceF16, c.inverseMassF16);
  }
  if (!this.isCrashed) {
    this.solveConstraint(this.bikeParts[0], this.constraints[1], this.bikeParts[2], t, 65536);
    this.solveConstraint(this.bikeParts[0], this.constraints[0], this.bikeParts[1], t, 65536);
    this.solveConstraint(this.bikeParts[2], this.constraints[6], this.bikeParts[4], t, 131072);
    this.solveConstraint(this.bikeParts[1], this.constraints[5], this.bikeParts[3], t, 131072);
  }
  this.solveConstraint(this.bikeParts[0], this.constraints[2], this.bikeParts[3], t, 65536);
  this.solveConstraint(this.bikeParts[0], this.constraints[3], this.bikeParts[4], t, 65536);
  this.solveConstraint(this.bikeParts[3], this.constraints[4], this.bikeParts[4], t, 65536);
  this.solveConstraint(this.bikeParts[5], this.constraints[8], this.bikeParts[3], t, 65536);
  this.solveConstraint(this.bikeParts[5], this.constraints[7], this.bikeParts[4], t, 65536);
  this.solveConstraint(this.bikeParts[5], this.constraints[9], this.bikeParts[0], t, 65536);
  var e = this.bikeParts[2].motoComponents[t];
  this.wheelTorqueF16 = a(this.wheelTorqueF16, 65536 - h.torqueDampingF16);
  e.torqueF16 = this.wheelTorqueF16;
  if (e.angularVelocityF16 > h.motoParam3) e.angularVelocityF16 = h.motoParam3;
  if (e.angularVelocityF16 < -h.motoParam3) e.angularVelocityF16 = -h.motoParam3;
  var i = 0;
  var s = 0;
  for (var l2 = 0; l2 < 6; ++l2) {
    i += this.bikeParts[l2].motoComponents[t].velocityXF16;
    s += this.bikeParts[l2].motoComponents[t].velocityYF16;
  }
  i = P(i, 393216);
  s = P(s, 393216);
  var n = 0;
  for (var l3 = 0; l3 < 6; ++l3) {
    var c2 = this.bikeParts[l3].motoComponents[t].velocityXF16 - i;
    var d2 = this.bikeParts[l3].motoComponents[t].velocityYF16 - s;
    n = h.getSmthLikeMaxAbs(c2, d2);
    if (n > 1966080) {
      var g = P(c2, n);
      var F = P(d2, n);
      this.bikeParts[l3].motoComponents[t].velocityXF16 -= g;
      this.bikeParts[l3].motoComponents[t].velocityYF16 -= F;
    }
  }
  var r = this.bikeParts[2].motoComponents[t].yF16 - this.bikeParts[0].motoComponents[t].yF16 >= 0 ? 1 : -1;
  var o = this.bikeParts[2].motoComponents[t].velocityXF16 - this.bikeParts[0].motoComponents[t].velocityXF16 >= 0 ? 1 : -1;
  this.rotationSpeedF16 = r * o > 0 ? n : -n;
};
h.getSmthLikeMaxAbs = function (t, e) {
  var i = $(t);
  var s = $(e);
  var n, r;
  if (s >= i) {
    n = s;
    r = i;
  } else {
    n = i;
    r = s;
  }
  return a(64448, n) + a(28224, r);
};
h.prototype.solveConstraint = function (t, e, i, s, n) {
  var r = t.motoComponents[s];
  var o = i.motoComponents[s];
  var l = r.xF16 - o.xF16;
  var c = r.yF16 - o.yF16;
  var d = h.getSmthLikeMaxAbs(l, c);
  if ($(d) >= 3) {
    l = P(l, d);
    c = P(c, d);
    var g = d - e.yF16;
    var F = a(l, a(g, e.xF16));
    var T = a(c, a(g, e.xF16));
    var b = r.velocityXF16 - o.velocityXF16;
    var I = r.velocityYF16 - o.velocityYF16;
    var L = a(a(l, b) + a(c, I), e.angleF16);
    F += a(l, L);
    T += a(c, L);
    F = a(F, n);
    T = a(T, n);
    r.forceXF16 -= F;
    r.forceYF16 -= T;
    o.forceXF16 += F;
    o.forceYF16 += T;
  }
};
h.prototype.integrateVelocities = function (t, e, i) {
  for (var s = 0; s < 6; ++s) {
    var n = this.bikeParts[s].motoComponents[t];
    var r = this.bikeParts[s].motoComponents[e];
    r.xF16 = a(n.velocityXF16, i);
    r.yF16 = a(n.velocityYF16, i);
    var o = a(i, this.bikeParts[s].inverseMassF16);
    r.velocityXF16 = a(n.forceXF16, o);
    r.velocityYF16 = a(n.forceYF16, o);
  }
};
h.prototype.blendState = function (t, e, i) {
  for (var s = 0; s < 6; ++s) {
    var n = this.bikeParts[s].motoComponents[t];
    var r = this.bikeParts[s].motoComponents[e];
    var o = this.bikeParts[s].motoComponents[i];
    n.xF16 = r.xF16 + (o.xF16 >> 1);
    n.yF16 = r.yF16 + (o.yF16 >> 1);
    n.velocityXF16 = r.velocityXF16 + (o.velocityXF16 >> 1);
    n.velocityYF16 = r.velocityYF16 + (o.velocityYF16 >> 1);
  }
};
h.prototype.stepSimulation = function (t) {
  this.accumulateForces(this.index01);
  this.integrateVelocities(this.index01, 2, t);
  this.blendState(4, this.index01, 2);
  this.accumulateForces(4);
  this.integrateVelocities(4, 3, t >> 1);
  this.blendState(4, this.index01, 3);
  this.blendState(this.index10, this.index01, 2);
  this.blendState(this.index10, this.index10, 3);
  for (var e = 1; e <= 2; ++e) {
    var i = this.bikeParts[e].motoComponents[this.index01];
    var s = this.bikeParts[e].motoComponents[this.index10];
    s.angleF16 = i.angleF16 + a(t, i.angularVelocityF16);
    s.angularVelocityF16 = i.angularVelocityF16 + a(t, a(this.bikeParts[e].angularForceFactorF16, i.torqueF16));
  }
};
h.prototype.detectCollisionForStep = function (t) {
  var e = 2;
  var i = kt(
    this.bikeParts[1].motoComponents[t].xF16,
    this.bikeParts[2].motoComponents[t].xF16,
    this.bikeParts[5].motoComponents[t].xF16
  );
  var s = Ct(
    this.bikeParts[1].motoComponents[t].xF16,
    this.bikeParts[2].motoComponents[t].xF16,
    this.bikeParts[5].motoComponents[t].xF16
  );
  this.levelLoader.updateVisiblePointRange(
    s - h.const175_1_half[0],
    i + h.const175_1_half[0],
    this.bikeParts[5].motoComponents[t].yF16
  );
  var n = this.bikeParts[1].motoComponents[t].xF16 - this.bikeParts[2].motoComponents[t].xF16;
  var r = this.bikeParts[1].motoComponents[t].yF16 - this.bikeParts[2].motoComponents[t].yF16;
  var o = h.getSmthLikeMaxAbs(n, r);
  n = P(n, o);
  var l = -P(r, o);
  var c = n;
  for (var d = 0; d < 6; ++d) {
    if (d !== 4 && d !== 3) {
      var g = this.bikeParts[d].motoComponents[t];
      if (d === 0) {
        g.xF16 += l;
        g.yF16 += c;
      }
      var F = this.levelLoader.detectCollision(g, this.bikeParts[d].collisionShapeIndex);
      if (d === 0) {
        g.xF16 -= l;
        g.yF16 -= c;
      }
      this.collisionNormalXF16 = this.levelLoader.collisionNormalXF16;
      this.collisionNormalYF16 = this.levelLoader.collisionNormalYF16;
      if (d === 5 && F !== 2) this.isRiderDown = true;
      if (d === 1 && F !== 2) this.isTrackFinished = true;
      if (F === 1) {
        this.collisionBodyIndex = d;
        e = 1;
      } else if (F === 0) {
        this.collisionBodyIndex = d;
        e = 0;
        break;
      }
    }
  }
  return e;
};
h.prototype.resolveCollision = function (t) {
  var e = this.bikeParts[this.collisionBodyIndex];
  var i = e.motoComponents[t];
  i.xF16 += a(this.collisionNormalXF16, 3276);
  i.yF16 += a(this.collisionNormalYF16, 3276);
  var s, n, r, o, l;
  if (this.isInputBreak && (this.collisionBodyIndex === 2 || this.collisionBodyIndex === 1) && i.angularVelocityF16 < 6553) {
    s = h.tireGripF16 - h.motoParam7;
    n = 13107;
    r = 39321;
    o = 26214 - h.motoParam7;
    l = 26214 - h.motoParam7;
  } else {
    s = h.tireGripF16;
    n = h.tireDampingF16;
    r = h.tireAngularDampingF16;
    o = h.motoParam1;
    l = h.motoParam2;
  }
  var c = h.getSmthLikeMaxAbs(this.collisionNormalXF16, this.collisionNormalYF16);
  this.collisionNormalXF16 = P(this.collisionNormalXF16, c);
  this.collisionNormalYF16 = P(this.collisionNormalYF16, c);
  var d = i.velocityXF16;
  var g = i.velocityYF16;
  var F = -(a(d, this.collisionNormalXF16) + a(g, this.collisionNormalYF16));
  var T = -(a(d, -this.collisionNormalYF16) + a(g, this.collisionNormalXF16));
  var b = a(s, i.angularVelocityF16) - a(n, P(T, e.collisionRadiusF16));
  var I = a(o, T) - a(r, a(i.angularVelocityF16, e.collisionRadiusF16));
  var L = -a(l, F);
  var R = a(-I, -this.collisionNormalYF16);
  var x = a(-I, this.collisionNormalXF16);
  var N = a(-L, this.collisionNormalXF16);
  var m = a(-L, this.collisionNormalYF16);
  i.angularVelocityF16 = b;
  i.velocityXF16 = R + N;
  i.velocityYF16 = x + m;
};
h.prototype.setEnableLookAhead = function (t) {
  this.isEnableLookAhead = t;
};
h.prototype.setMinimalScreenWH = function (t) {
  this.lookAheadClampF16 = P(a(655360, t << 16), 8388608);
};
h.prototype.getCamPosX = function () {
  if (this.isEnableLookAhead) {
    this.camShiftX = P(this.motoComponents[0].velocityXF16, 1572864) + a(this.camShiftX, 57344);
  } else {
    this.camShiftX = 0;
  }
  if (this.camShiftX >= this.lookAheadClampF16) this.camShiftX = this.lookAheadClampF16;
  if (this.camShiftX <= -this.lookAheadClampF16) this.camShiftX = -this.lookAheadClampF16;
  return ((this.motoComponents[0].xF16 + this.camShiftX) << 2) >> 16;
};
h.prototype.getCamPosY = function () {
  if (this.isEnableLookAhead) {
    this.camShiftY = P(this.motoComponents[0].velocityYF16, 1572864) + a(this.camShiftY, 57344);
  } else {
    this.camShiftY = 0;
  }
  if (this.camShiftY >= this.lookAheadClampF16) this.camShiftY = this.lookAheadClampF16;
  if (this.camShiftY <= -this.lookAheadClampF16) this.camShiftY = -this.lookAheadClampF16;
  return ((this.motoComponents[0].yF16 + this.camShiftY) << 2) >> 16;
};
h.prototype.getProgressF16 = function () {
  var t = this.motoComponents[1].xF16 < this.motoComponents[2].xF16 ? this.motoComponents[2].xF16 : this.motoComponents[1].xF16;
  if (this.isCrashed) {
    return this.levelLoader.getProgressF16(this.motoComponents[0].xF16);
  }
  return this.levelLoader.getProgressF16(t);
};
h.prototype.syncRenderStateFromSimulation = function () {
  for (var t = 0; t < 6; ++t) {
    this.bikeParts[t].motoComponents[5].xF16 = this.bikeParts[t].motoComponents[this.index01].xF16;
    this.bikeParts[t].motoComponents[5].yF16 = this.bikeParts[t].motoComponents[this.index01].yF16;
    this.bikeParts[t].motoComponents[5].angleF16 = this.bikeParts[t].motoComponents[this.index01].angleF16;
  }
  this.bikeParts[0].motoComponents[5].velocityXF16 = this.bikeParts[0].motoComponents[this.index01].velocityXF16;
  this.bikeParts[0].motoComponents[5].velocityYF16 = this.bikeParts[0].motoComponents[this.index01].velocityYF16;
  this.bikeParts[2].motoComponents[5].angularVelocityF16 = this.bikeParts[2].motoComponents[this.index01].angularVelocityF16;
};
h.prototype.setMotoComponents = function () {
  for (var t = 0; t < 6; ++t) {
    this.motoComponents[t].xF16 = this.bikeParts[t].motoComponents[5].xF16;
    this.motoComponents[t].yF16 = this.bikeParts[t].motoComponents[5].yF16;
    this.motoComponents[t].angleF16 = this.bikeParts[t].motoComponents[5].angleF16;
  }
  this.motoComponents[0].velocityXF16 = this.bikeParts[0].motoComponents[5].velocityXF16;
  this.motoComponents[0].velocityYF16 = this.bikeParts[0].motoComponents[5].velocityYF16;
  this.motoComponents[2].angularVelocityF16 = this.bikeParts[2].motoComponents[5].angularVelocityF16;
};
h.prototype.renderEngine = function (t, e, i) {
  var s = w.atan2F16(this.motoComponents[0].xF16 - this.motoComponents[3].xF16, this.motoComponents[0].yF16 - this.motoComponents[3].yF16);
  var n = w.atan2F16(this.motoComponents[0].xF16 - this.motoComponents[4].xF16, this.motoComponents[0].yF16 - this.motoComponents[4].yF16);
  var r = (this.motoComponents[0].xF16 >> 1) + (this.motoComponents[3].xF16 >> 1);
  var o = (this.motoComponents[0].yF16 >> 1) + (this.motoComponents[3].yF16 >> 1);
  var l = (this.motoComponents[0].xF16 >> 1) + (this.motoComponents[4].xF16 >> 1);
  var c = (this.motoComponents[0].yF16 >> 1) + (this.motoComponents[4].yF16 >> 1);
  var d = -i;
  r += a(d, 65536) - a(e, 32768);
  o += a(e, 65536) - a(i, 32768);
  l += a(d, 65536) - a(e, 117964);
  c += a(e, 65536) - a(i, 131072);
  t.renderFender((l << 2) >> 16, (c << 2) >> 16, n);
  t.renderEngine((r << 2) >> 16, (o << 2) >> 16, s);
};
h.prototype.renderMotoFork = function (t) {
  t.setColor(128, 128, 128);
  t.drawLineF16(this.motoComponents[3].xF16, this.motoComponents[3].yF16, this.motoComponents[1].xF16, this.motoComponents[1].yF16);
};
h.prototype.renderWheelTires = function (t) {
  var e = 1;
  var i = 1;
  switch (h.curentMotoLeague) {
    case 1:
      e = 0;
      break;
    case 2:
    case 3:
      i = 0; e = 0;
  }
  t.drawWheelTires((this.motoComponents[2].xF16 << 2) >> 16, (this.motoComponents[2].yF16 << 2) >> 16, e);
  t.drawWheelTires((this.motoComponents[1].xF16 << 2) >> 16, (this.motoComponents[1].yF16 << 2) >> 16, i);
};
h.prototype.renderWheelSpokes = function (t) {
  var e = this.bikeParts[1].collisionRadiusF16;
  var i = a(e, 58982);
  var s = a(e, 45875);
  t.setColor(0, 0, 0);
  if (O.isInGameMenu) {
    t.drawCircle((this.motoComponents[1].xF16 << 2) >> 16, (this.motoComponents[1].yF16 << 2) >> 16, ((e + e) << 2) >> 16);
    t.drawCircle((this.motoComponents[1].xF16 << 2) >> 16, (this.motoComponents[1].yF16 << 2) >> 16, ((i + i) << 2) >> 16);
    t.drawCircle((this.motoComponents[2].xF16 << 2) >> 16, (this.motoComponents[2].yF16 << 2) >> 16, ((e + e) << 2) >> 16);
    t.drawCircle((this.motoComponents[2].xF16 << 2) >> 16, (this.motoComponents[2].yF16 << 2) >> 16, ((s + s) << 2) >> 16);
  }
  var n = 0;
  var r = this.motoComponents[1].angleF16;
  var o = w.cosF16(r);
  var l = w.sinF16(r);
  var c = a(o, i) + a(-l, n);
  var d = a(l, i) + a(o, n);
  r = 82354;
  o = w.cosF16(82354);
  l = w.sinF16(r);
  for (var g = 0; g < 5; ++g) {
    t.drawLineF16(this.motoComponents[1].xF16, this.motoComponents[1].yF16, this.motoComponents[1].xF16 + c, this.motoComponents[1].yF16 + d);
    var F = c;
    c = a(o, c) + a(-l, d);
    d = a(l, F) + a(o, d);
  }
  n = 0;
  r = this.motoComponents[2].angleF16;
  o = w.cosF16(r);
  l = w.sinF16(r);
  c = a(o, i) + a(-l, n);
  d = a(l, i) + a(o, n);
  r = 82354;
  o = w.cosF16(82354);
  l = w.sinF16(r);
  for (var g2 = 0; g2 < 5; ++g2) {
    t.drawLineF16(this.motoComponents[2].xF16, this.motoComponents[2].yF16, this.motoComponents[2].xF16 + c, this.motoComponents[2].yF16 + d);
    var F2 = c;
    c = a(o, c) + a(-l, d);
    d = a(l, F2) + a(o, d);
  }
  if (h.curentMotoLeague > 0) {
    t.setColor(255, 0, 0);
    if (h.curentMotoLeague > 2) t.setColor(100, 100, 255);
    t.drawCircle((this.motoComponents[2].xF16 << 2) >> 16, (this.motoComponents[2].yF16 << 2) >> 16, 4);
    t.drawCircle((this.motoComponents[1].xF16 << 2) >> 16, (this.motoComponents[1].yF16 << 2) >> 16, 4);
  }
};
h.prototype.renderSmth = function (t, e, i, s, n) {
  var r = 0;
  var o = 65536;
  var l = this.motoComponents[0].xF16;
  var c = this.motoComponents[0].yF16;
  var d = 0, g = 0, F = 0, T = 0, b = 0, I = 0, L = 0, R = 0, x = 0, N = 0, m = 0, M = 0, k = 0, V = 0, j = 0, z = 0;
  var Q = [], U = [], J = [];
  if (this.isRenderDriverWithSprites) {
    if (this.riderPoseBlendF16 < 32768) {
      U = this.hardcodedArr2;
      J = this.hardcodedArr1;
      o = a(this.riderPoseBlendF16, 131072);
    } else if (this.riderPoseBlendF16 > 32768) {
      r = 1;
      U = this.hardcodedArr1;
      J = this.hardcodedArr3;
      o = a(this.riderPoseBlendF16 - 32768, 131072);
    } else {
      Q = this.hardcodedArr1;
    }
  } else {
    if (this.riderPoseBlendF16 < 32768) {
      U = this.hardcodedArr5;
      J = this.hardcodedArr4;
      o = a(this.riderPoseBlendF16, 131072);
    } else if (this.riderPoseBlendF16 > 32768) {
      r = 1;
      U = this.hardcodedArr4;
      J = this.hardcodedArr6;
      o = a(this.riderPoseBlendF16 - 32768, 131072);
    } else {
      Q = this.hardcodedArr4;
    }
  }
  for (var y = 0; y < this.hardcodedArr1.length; ++y) {
    var Z, G;
    if (U.length !== 0) {
      G = a(U[y][0], 65536 - o) + a(J[y][0], o);
      Z = a(U[y][1], 65536 - o) + a(J[y][1], o);
    } else {
      G = Q[y][0];
      Z = Q[y][1];
    }
    var W = l + a(s, G) + a(e, Z);
    var q = c + a(n, G) + a(i, Z);
    switch (y) {
      case 0:
        L = W; R = q; break;
      case 1:
        x = W; N = q; break;
      case 2:
        m = W; M = q; break;
      case 3:
        k = W; V = q; break;
      case 4:
        j = W; z = q; break;
      case 5:
        F = W; T = q; break;
      case 6:
        b = W; I = q; break;
      case 7:
        d = W; g = q; break;
    }
  }
  var tt = a(this.riderPoseBlendTable[r][0], 65536 - o) + a(this.riderPoseBlendTable[r + 1][0], o);
  if (this.isRenderDriverWithSprites) {
    t.renderBodyPart(F << 2, T << 2, L << 2, R << 2, 1);
    t.renderBodyPart(L << 2, R << 2, x << 2, N << 2, 1);
    t.renderBodyPart(x << 2, N << 2, m << 2, M << 2, 2, tt);
    t.renderBodyPart(m << 2, M << 2, j << 2, z << 2, 0);
    var y2 = w.atan2F16(e, i);
    if (this.riderPoseBlendF16 > 32768) y2 += 20588;
    t.drawHelmet((k << 2) >> 16, (V << 2) >> 16, y2);
  } else {
    t.setColor(0, 0, 0);
    t.drawLineF16(F, T, L, R);
    t.drawLineF16(L, R, x, N);
    t.setColor(0, 0, 128);
    t.drawLineF16(x, N, m, M);
    t.drawLineF16(m, M, j, z);
    t.drawLineF16(j, z, d, g);
    var y3 = 65536;
    t.setColor(156, 0, 0);
    t.drawCircle((k << 2) >> 16, (V << 2) >> 16, ((y3 + y3) << 2) >> 16);
  }
  t.setColor(0, 0, 0);
  t.drawForthSpriteByCenter((d << 2) >> 16, (g << 2) >> 16);
  t.drawForthSpriteByCenter((b << 2) >> 16, (I << 2) >> 16);
};
h.prototype.renderMotoAsLines = function (t, e, i, s, n) {
  var r = this.motoComponents[2].xF16;
  var o = this.motoComponents[2].yF16;
  var l = r + a(s, 32768);
  var c = o + a(n, 32768);
  var d = r - a(s, 32768);
  var g = o - a(n, 32768);
  var F = this.motoComponents[0].xF16 + a(e, 32768);
  var T = this.motoComponents[0].yF16 + a(i, 32768);
  var b = F - a(e, 131072);
  var I = T - a(i, 131072);
  var L = b + a(s, 65536);
  var R = I + a(n, 65536);
  var x = b + a(e, 49152) + a(s, 49152);
  var N = I + a(i, 49152) + a(n, 49152);
  var m = b + a(s, 32768);
  var M = I + a(n, 32768);
  var k = this.motoComponents[1].xF16;
  var V = this.motoComponents[1].yF16;
  var j = this.motoComponents[4].xF16 - a(e, 49152);
  var z = this.motoComponents[4].yF16 - a(i, 49152);
  var Q = j - a(s, 32768);
  var U = z - a(n, 32768);
  var J = j - a(e, 131072) + a(s, 16384);
  var tt = z - a(i, 131072) + a(n, 16384);
  var y = this.motoComponents[3].xF16;
  var Z = this.motoComponents[3].yF16;
  var G = y + a(s, 32768);
  var W = Z + a(n, 32768);
  var q = y + a(s, 114688) - a(e, 32768);
  var rt = Z + a(n, 114688) - a(i, 32768);
  t.setColor(50, 50, 50);
  t.drawCircle((m << 2) >> 16, (M << 2) >> 16, 4);
  if (!this.isCrashed) {
    t.drawLineF16(l, c, L, R);
    t.drawLineF16(d, g, b, I);
  }
  t.drawLineF16(F, T, b, I);
  t.drawLineF16(F, T, y, Z);
  t.drawLineF16(x, N, G, W);
  t.drawLineF16(G, W, q, rt);
  if (!this.isCrashed) {
    t.drawLineF16(y, Z, k, V);
    t.drawLineF16(q, rt, k, V);
  }
  t.drawLineF16(L, R, Q, U);
  t.drawLineF16(x, N, j, z);
  t.drawLineF16(j, z, J, tt);
  t.drawLineF16(Q, U, J, tt);
};
h.prototype.renderGame = function (t) {
  t.clearScreenWithWhite();
  var e = this.motoComponents[3].xF16 - this.motoComponents[4].xF16;
  var i = this.motoComponents[3].yF16 - this.motoComponents[4].yF16;
  var s = h.getSmthLikeMaxAbs(e, i);
  if (s !== 0) {
    e = P(e, s);
    i = P(i, s);
  }
  var n = -i;
  if (this.isCrashed) {
    var r = this.motoComponents[4].xF16;
    var o = this.motoComponents[3].xF16;
    if (o >= r) {
      var l = o;
      o = r;
      r = l;
    }
    if (this.levelLoader.gameLevel) {
      this.levelLoader.gameLevel.setShadowProjectionRange(o, r);
    }
  }
  if (p.isEnabledPerspective) {
    this.levelLoader.renderLevel3D(t, this.motoComponents[0].xF16, this.motoComponents[0].yF16);
  }
  if (this.isRenderMotoWithSprites) this.renderEngine(t, e, i);
  if (!O.isInGameMenu) this.renderWheelTires(t);
  this.renderWheelSpokes(t);
  if (this.isRenderMotoWithSprites) {
    t.setColor(170, 0, 0);
  } else {
    t.setColor(50, 50, 50);
  }
  t.drawWheelArc((this.motoComponents[1].xF16 << 2) >> 16, (this.motoComponents[1].yF16 << 2) >> 16, (h.const175_1_half[0] << 2) >> 16, w.atan2F16(e, i));
  if (!this.isCrashed) this.renderMotoFork(t);
  this.renderSmth(t, e, i, n, e);
  if (!this.isRenderMotoWithSprites) this.renderMotoAsLines(t, e, i, n, e);
  this.levelLoader.renderTrackNearestLine(t);
};

function A(t, e) {
  this.text = t;
  this.micro = e;
  this.font = null;
  this.dx = 0;
  this.isDrawSprite = false;
  this.spriteNo = 0;
}
A.fieldMaxWidth = 100;
A.fieldMaxHeightUnused = 100;
A.defaultFont = null;
A.getBaselinePosition = function () {
  return A.defaultFont.getBaselinePosition();
};
A.prototype.setFont = function (t) {
  this.font = t;
};
A.setDefaultFont = function (t) {
  A.defaultFont = t;
};
A.setMaxArea = function (t, e) {
  A.fieldMaxWidth = t;
  A.fieldMaxHeightUnused = e;
};
A.prototype.setText = function (t) {
  this.text = t;
};
A.prototype.isNotTextRender = function () {
  return false;
};
A.prototype.menuElemMethod = function (t) {};
A.prototype.render = function (t, e, i) {
  var s = t.getFont();
  t.setFont(A.defaultFont);
  if (this.font !== null) t.setFont(this.font);
  t.drawString(this.text, i + this.dx, e, u.LEFT | u.TOP);
  if (this.isDrawSprite && this.micro.gameCanvas !== null) {
    this.micro.gameCanvas.drawSprite(t, this.spriteNo, i, e);
  }
  t.setFont(s);
};
A.makeMultilineTextRenders = function (t, e) {
  var i = 0;
  var s = 0;
  var n = 25;
  var r = [];
  for (; s < t.length; ) {
    var o = t.indexOf(" ", i);
    if (o === -1) {
      s = t.length;
      o = t.length;
    }
    for (; s < t.length && A.defaultFont.substringWidth(t, i, o - i) < A.fieldMaxWidth - n; ) {
      s = o + 1;
      o = t.indexOf(" ", o + 1);
      if (o === -1) {
        if (A.defaultFont.substringWidth(t, i, t.length - 1 - i) <= A.fieldMaxWidth - n) {
          s = t.length;
        }
        break;
      }
    }
    r.push(new A(t.substring(i, s), e));
    i = ++s - 1;
  }
  return r;
};
A.prototype.setDx = function (t) {
  this.dx = t;
};
A.prototype.setDrawSprite = function (t, e) {
  this.isDrawSprite = t;
  this.spriteNo = e;
};

function E(t, e, i, s) {
  this.title = t;
  this.selectedIndex = -1;
  this.micro = e;
  this.parentMenu = i;
  this.vector = [];
  this.canvasWidth = e.gameCanvas ? e.gameCanvas.getWidth() : 0;
  this.canvasHeight = e.gameCanvas ? e.gameCanvas.getHeight() : 0;
  this.font = K.getFont(v.STYLE_BOLD, v.SIZE_LARGE);
  this.font3 = K.getFont(v.STYLE_PLAIN, v.SIZE_SMALL);
  if (this.canvasWidth >= 128) {
    this.font2 = K.getFont(v.STYLE_BOLD, v.SIZE_MEDIUM);
  } else {
    this.font2 = this.font3;
  }
  A.setDefaultFont(this.font3);
  A.setMaxArea(this.canvasWidth, this.canvasHeight);
  this.topPadding = 1;
  this.xPos = this.canvasWidth <= 100 ? 6 : 9;
  if (this.canvasHeight <= 100) this.title = "";
  this.contentX = this.xPos + 7;
  this.rowSpacing = 2;
  this.cursorAnimationFrame = 0;
  if (this.title !== "") {
    this.visibleItemCount = mathTrunc((this.canvasHeight - (this.topPadding << 1) - 10 - this.font.getBaselinePosition()) / (this.font2.getBaselinePosition() + this.rowSpacing));
  } else {
    this.visibleItemCount = mathTrunc((this.canvasHeight - (this.topPadding << 1) - 10) / (this.font2.getBaselinePosition() + this.rowSpacing));
  }
  if (s != null) {
    this.isNameEntryMenu = true;
    this.nameCursorPos = 0;
    this.xPos = 8;
    this.strArr = s;
  } else {
    this.isNameEntryMenu = false;
    this.strArr = null;
  }
  if (this.visibleItemCount > 13) this.visibleItemCount = 13;
  this.firstVisibleIndex = 0;
  this.lastVisibleIndex = 0;
}
E.prototype.setRowSpacing = function (t) {
  this.rowSpacing = t;
};
E.prototype.setTitle = function (t) {
  this.title = t;
};
E.prototype.selectFirstMenuItem = function () {
  if (this.isNameEntryMenu) {
    this.nameCursorPos = 0;
  } else if (this.vector.length !== 0) {
    this.selectedIndex = 0;
    for (var t = 0; t < this.vector.length && t < this.visibleItemCount; ++t) {
      if (this.vector[t].isNotTextRender()) {
        this.selectedIndex = t;
        break;
      }
    }
    this.firstVisibleIndex = 0;
    this.lastVisibleIndex = this.vector.length - 1;
    if (this.lastVisibleIndex > this.visibleItemCount - 1) {
      this.lastVisibleIndex = this.visibleItemCount - 1;
    }
  }
};
E.prototype.selectLastMenuItem = function () {
  this.selectedIndex = this.vector.length - 1;
  for (var t = this.vector.length - 1; t > 0; --t) {
    if (this.vector[t].isNotTextRender()) {
      this.selectedIndex = t;
      break;
    }
  }
  this.firstVisibleIndex = this.vector.length - this.visibleItemCount;
  if (this.firstVisibleIndex < 0) this.firstVisibleIndex = 0;
  this.lastVisibleIndex = this.vector.length - 1;
  if (this.lastVisibleIndex > this.selectedIndex + this.visibleItemCount) {
    this.lastVisibleIndex = this.selectedIndex + this.visibleItemCount;
  }
};
E.prototype.addMenuElement = function (t) {
  var e = this.topPadding;
  this.visibleItemCount = 1;
  this.vector.push(t);
  if (this.title !== "") {
    e = this.font.getBaselinePosition() + 2;
  }
  if (this.canvasHeight < 100) {
    ++e;
  } else {
    e += 4;
  }
  for (var i = 0; i < this.vector.length - 1; ++i) {
    if (this.vector[i].isNotTextRender()) {
      e += this.font2.getBaselinePosition() + this.rowSpacing;
    } else {
      e += Math.max(A.getBaselinePosition(), f.spriteSizeY[5]) + this.rowSpacing;
    }
    if (e > this.canvasHeight - (this.topPadding << 1) - 10) break;
    ++this.visibleItemCount;
  }
  if (this.visibleItemCount > 13) this.visibleItemCount = 13;
  this.selectFirstMenuItem();
};
E.prototype.processGameActionDown = function () {
  if (this.isNameEntryMenu && this.strArr !== null) {
    if (this.strArr[this.nameCursorPos] === 32) {
      this.strArr[this.nameCursorPos] = 90;
      return;
    }
    --this.strArr[this.nameCursorPos];
    if (this.strArr[this.nameCursorPos] < 65) {
      this.strArr[this.nameCursorPos] = 32;
    }
    return;
  }
  if (this.vector.length === 0) return;
  if (!this.vector[this.selectedIndex].isNotTextRender()) {
    ++this.lastVisibleIndex;
    this.selectedIndex = this.lastVisibleIndex;
    ++this.firstVisibleIndex;
    return;
  }
  ++this.selectedIndex;
  if (this.selectedIndex > this.vector.length - 1) {
    this.selectFirstMenuItem();
    return;
  }
  var t = false;
  var e = this.selectedIndex;
  for (e = this.selectedIndex; e <= this.lastVisibleIndex + 1 && e < this.vector.length; ++e) {
    if (this.vector[e].isNotTextRender()) {
      t = true;
      break;
    }
  }
  if (t) {
    this.selectedIndex = e;
  } else {
    if (this.lastVisibleIndex < this.vector.length - 1) {
      ++this.lastVisibleIndex;
      ++this.firstVisibleIndex;
    } else {
      --this.selectedIndex;
    }
  }
  if (this.selectedIndex > this.lastVisibleIndex) {
    ++this.firstVisibleIndex;
    ++this.lastVisibleIndex;
    if (this.lastVisibleIndex > this.vector.length - 1) {
      this.lastVisibleIndex = this.vector.length - 1;
    }
    this.selectedIndex = this.lastVisibleIndex;
  }
};
E.prototype.processGameActionUp = function () {
  if (this.isNameEntryMenu && this.strArr !== null) {
    if (this.strArr[this.nameCursorPos] === 32) {
      this.strArr[this.nameCursorPos] = 65;
      return;
    }
    ++this.strArr[this.nameCursorPos];
    if (this.strArr[this.nameCursorPos] > 90) {
      this.strArr[this.nameCursorPos] = 32;
    }
    return;
  }
  if (this.vector.length === 0) return;
  --this.selectedIndex;
  if (this.selectedIndex < 0) {
    this.selectLastMenuItem();
    return;
  }
  var t = false;
  var e = this.selectedIndex;
  for (e = this.selectedIndex; e >= this.firstVisibleIndex; --e) {
    if (this.vector[e].isNotTextRender()) {
      t = true;
      break;
    }
  }
  if (!t) {
    if (this.firstVisibleIndex > 0) {
      --this.firstVisibleIndex;
      if (this.vector.length > this.visibleItemCount - 1) {
        --this.lastVisibleIndex;
        return;
      }
    } else {
      this.selectLastMenuItem();
    }
    return;
  }
  this.selectedIndex = e;
  if (this.selectedIndex < this.firstVisibleIndex) {
    --this.firstVisibleIndex;
    if (this.firstVisibleIndex < 0) {
      this.selectedIndex = 0;
      this.firstVisibleIndex = 0;
    }
    if (this.vector.length > this.visibleItemCount - 1) {
      --this.lastVisibleIndex;
    }
  }
};
E.prototype.processGameActionUpd = function (t) {
  if (this.isNameEntryMenu) {
    switch (t) {
      case 1:
        if (this.nameCursorPos === 2) {
          if (this.micro.menuManager) {
            this.micro.menuManager.openMenu(this.parentMenu, false);
          }
          return;
        }
        ++this.nameCursorPos;
        return;
      case 2:
        ++this.nameCursorPos;
        if (this.nameCursorPos > 2) this.nameCursorPos = 2;
        return;
      case 3:
        --this.nameCursorPos;
        if (this.nameCursorPos < 0) this.nameCursorPos = 0;
        return;
      default:
        return;
    }
  }
  if (this.selectedIndex !== -1) {
    for (var e = this.selectedIndex; e < this.vector.length; ++e) {
      var i = this.vector[e];
      if (i !== null && i.isNotTextRender()) {
        i.menuElemMethod(t);
        return;
      }
    }
  }
};
E.prototype.render = function (t) {
  if (this.isNameEntryMenu && this.strArr !== null) {
    t.setColor(0, 0, 20);
    t.setFont(this.font);
    var i = 1;
    t.drawString("Enter Name", this.xPos, i, u.LEFT | u.TOP);
    var s = i + this.font.getHeight() + (this.rowSpacing << 2);
    t.setFont(this.font2);
    for (var n = 0; n < 3; ++n) {
      t.drawChar(
        String.fromCharCode(this.strArr[n]),
        this.xPos + n * this.font2.charWidth("W") + 1,
        s,
        u.HCENTER | u.TOP
      );
      if (n === this.nameCursorPos) {
        t.drawChar(
          "^",
          this.xPos + n * this.font2.charWidth("W") + 1,
          s + this.font2.getHeight(),
          u.HCENTER | u.TOP
        );
      }
    }
    return;
  }
  t.setColor(0, 0, 0);
  var e = this.topPadding;
  if (this.title !== "") {
    t.setFont(this.font);
    t.drawString(this.title, this.xPos, e, u.LEFT | u.TOP);
    e += this.font.getBaselinePosition() + 2;
  }
  if (this.firstVisibleIndex > 0 && this.micro.gameCanvas !== null) {
    this.micro.gameCanvas.drawSprite(t, 2, this.xPos - 3, e);
  }
  if (this.canvasHeight < 100) {
    ++e;
  } else {
    e += 4;
  }
  t.setFont(this.font2);
  for (var i2 = this.firstVisibleIndex; i2 < this.lastVisibleIndex + 1; ++i2) {
    var s2 = this.vector[i2];
    t.setColor(0, 0, 0);
    s2.render(t, e, this.contentX);
    if (i2 === this.selectedIndex && s2.isNotTextRender() && this.micro.gameCanvas !== null) {
      var n2 = this.xPos - mathTrunc(this.micro.gameCanvas.helmetSpriteWidth / 2);
      var r = e + mathTrunc(this.font2.getBaselinePosition() / 2) - mathTrunc(this.micro.gameCanvas.helmetSpriteHeight / 2);
      t.setClip(n2, r, this.micro.gameCanvas.helmetSpriteWidth, this.micro.gameCanvas.helmetSpriteHeight);
      t.drawImage(
        this.micro.gameCanvas.helmetImage,
        n2 - this.micro.gameCanvas.helmetSpriteWidth * (this.cursorAnimationFrame % 6),
        r - this.micro.gameCanvas.helmetSpriteHeight * mathTrunc(this.cursorAnimationFrame / 6),
        u.LEFT | u.TOP
      );
      t.setClip(0, 0, this.canvasWidth, this.canvasHeight);
      ++this.cursorAnimationFrame;
      if (this.cursorAnimationFrame > 30) this.cursorAnimationFrame = 0;
    }
    if (s2.isNotTextRender()) {
      e += this.font2.getBaselinePosition() + this.rowSpacing;
    } else {
      e += Math.max(A.getBaselinePosition(), f.spriteSizeY[5]) + this.rowSpacing;
    }
  }
  if (this.vector.length > this.lastVisibleIndex && this.lastVisibleIndex !== this.vector.length - 1 && this.micro.gameCanvas !== null) {
    if (f.spriteSizeY[3] + e > this.canvasHeight) {
      this.micro.gameCanvas.drawSprite(t, 3, this.xPos - 3, this.canvasHeight - f.spriteSizeY[3]);
      return;
    }
    this.micro.gameCanvas.drawSprite(t, 3, this.xPos - 3, e - 2);
  }
};
E.prototype.setParentMenu = function (t) {
  this.parentMenu = t;
};
E.prototype.getParentMenu = function () {
  return this.parentMenu;
};
E.prototype.getSelectedIndex = function () {
  return this.selectedIndex;
};
E.prototype.clearVector = function () {
  this.vector.length = 0;
  this.firstVisibleIndex = 0;
  this.lastVisibleIndex = 0;
  this.selectedIndex = -1;
};
E.prototype.makeString = function () {
  return this.strArr === null ? "" : String.fromCharCode.apply(null, this.strArr);
};
E.prototype.getStrArr = function () {
  return this.strArr;
};
E.prototype.scrollToSelection = function (t) {
  this.selectedIndex = t;
  this.firstVisibleIndex = t - mathTrunc(this.visibleItemCount / 2);
  if (this.firstVisibleIndex < 0) this.firstVisibleIndex = 0;
  this.lastVisibleIndex = this.firstVisibleIndex + this.visibleItemCount - 1;
  if (this.lastVisibleIndex > this.vector.length - 1) {
    this.lastVisibleIndex = this.vector.length - 1;
    this.firstVisibleIndex = this.lastVisibleIndex - this.visibleItemCount + 1;
    if (this.firstVisibleIndex < 0) this.firstVisibleIndex = 0;
  }
};

function at(t) {
  this.currentPos = 0;
  this.data = t !== undefined ? t : [];
}
at.prototype.numRecords = function () {
  return this.data.length;
};
at.prototype.nextRecord = function () {
  return this.data[this.currentPos++];
};
at.prototype.addRecord = function (t) {
  this.data.push(t);
  return this.data.length - 1;
};
at.prototype.setRecord = function (t, e) {
  if (this.data.length <= t) throw new Error("RecordStoreException");
  this.data[t] = e;
};
at.prototype.reset = function () {
  this.currentPos = 0;
};
at.prototype.nextRecordId = function () {
  if (this.currentPos >= this.data.length) throw new Error("RecordStoreException");
  return this.currentPos;
};
at.prototype.destroy = function () {};

function et(S) {
  return "gravity_defied_record_store:" + S;
}

function H(t, e) {
  this.name = t;
  this.records = e;
}
H.opened = {};
H.setRecordStoreDir = function (t) {};
H.openRecordStore = function (t, e) {
  var i = H.opened[t];
  if (i !== undefined) return i;
  var s = window.localStorage.getItem(et(t));
  if (s === null) {
    if (!e) throw new Error("RecordStoreException");
    var l = new H(t, new at());
    l.save();
    H.opened[t] = l;
    return l;
  }
  var n = JSON.parse(s);
  var arr = [];
  for (var k = 0; k < n.length; k++) {
    arr.push(new Int8Array(n[k]));
  }
  var r = new at(arr);
  var o = new H(t, r);
  H.opened[t] = o;
  return o;
};
H.prototype.closeRecordStore = function () {};
H.deleteRecordStore = function (t) {
  window.localStorage.removeItem(et(t));
  delete H.opened[t];
};
H.listRecordStores = function () {
  var t = [];
  for (var e = 0; e < window.localStorage.length; ++e) {
    var i = window.localStorage.key(e);
    if (i !== null && i.indexOf("gravity_defied_record_store:") === 0) {
      t.push(i.substring(28));
    }
  }
  return t;
};
H.prototype.enumerateRecords = function (t, e, i) {
  return this.records;
};
H.prototype.addRecord = function (t, e, i) {
  if (e !== 0) throw new Error("RecordStoreException");
  var arr = Array.prototype.slice.call(t, 0, i);
  var s = new Int8Array(arr);
  var n = this.records.addRecord(s);
  this.save();
  return n;
};
H.prototype.setRecord = function (t, e, i, s) {
  var arr = Array.prototype.slice.call(e, 0, s);
  var n = new Int8Array(arr);
  this.records.setRecord(t, n);
  this.save();
};
H.prototype.save = function () {
  var mapArr = [];
  for (var k = 0; k < this.records.data.length; k++) {
    mapArr.push(Array.prototype.slice.call(this.records.data[k]));
  }
  var t = JSON.stringify(mapArr);
  window.localStorage.setItem(et(this.name), t);
};

function D() {
  this.recordTimeMs = new Array(4);
  for (var i = 0; i < 4; i++) {
    this.recordTimeMs[i] = [0, 0, 0];
  }
  this.recordName = new Array(D.LEAGUES_MAX);
  for (var j = 0; j < D.LEAGUES_MAX; j++) {
    this.recordName[j] = new Array(D.RECORD_NO_MAX);
    for (var k = 0; k < D.RECORD_NO_MAX; k++) {
      this.recordName[j][k] = new Uint8Array(D.PLAYER_NAME_MAX + 1);
    }
  }
  this.recordStore = null;
  this.packedRecordInfoRecordId = -1;
  this.packedRecordInfo = new Int8Array(96);
  this.str = "";
}
D.LEAGUES_MAX = 4;
D.RECORD_NO_MAX = 3;
D.PLAYER_NAME_MAX = 3;
D.unused = 3;
D.prototype.openRecordStoreForTrack = function (t, e) {
  this.resetRecordsTime();
  this.str = "" + t + e;
  this.recordStore = H.openRecordStore(this.str, true);
  this.packedRecordInfoRecordId = -1;
  var i = this.recordStore.enumerateRecords(null, null, false);
  if (i.numRecords() > 0) {
    var s = i.nextRecord();
    i.reset();
    this.packedRecordInfoRecordId = i.nextRecordId();
    this.loadRecordInfo(s);
    i.destroy();
  }
};
D.prototype.load5BytesAsLong = function (t, e) {
  var i = 0;
  var s = 1;
  for (var n = e; n < 5 + e; ++n) {
    var r = (t[n] + 256) % 256;
    i += s * r;
    s *= 256;
  }
  return i;
};
D.prototype.pushLongAs5Bytes = function (t, e, i) {
  for (var s = e; s < 5 + e; ++s) {
    t[s] = i % 256;
    i = mathTrunc(i / 256);
  }
};
D.prototype.loadRecordInfo = function (t) {
  var e = 0;
  for (var i = 0; i < 4; ++i) {
    for (var s = 0; s < 3; ++s) {
      this.recordTimeMs[i][s] = this.load5BytesAsLong(t, e);
      e += 5;
    }
  }
  for (var i2 = 0; i2 < D.LEAGUES_MAX; ++i2) {
    for (var s2 = 0; s2 < D.RECORD_NO_MAX; ++s2) {
      for (var n = 0; n < D.PLAYER_NAME_MAX; ++n) {
        this.recordName[i2][s2][n] = t[e++];
      }
    }
  }
};
D.prototype.getLevelInfo = function (t) {
  var e = 0;
  for (var i = 0; i < 4; ++i) {
    for (var s = 0; s < 3; ++s) {
      this.pushLongAs5Bytes(t, e, this.recordTimeMs[i][s]);
      e += 5;
    }
  }
  for (var i2 = 0; i2 < D.LEAGUES_MAX; ++i2) {
    for (var s2 = 0; s2 < D.RECORD_NO_MAX; ++s2) {
      for (var n = 0; n < D.PLAYER_NAME_MAX; ++n) {
        t[e++] = this.recordName[i2][s2][n];
      }
    }
  }
};
D.prototype.resetRecordsTime = function () {
  for (var t = 0; t < 4; ++t) {
    for (var e = 0; e < 3; ++e) {
      this.recordTimeMs[t][e] = 0;
    }
  }
};
D.prototype.getRecordDescription = function (t) {
  var e = ["", "", ""];
  for (var i = 0; i < 3; ++i) {
    if (this.recordTimeMs[t][i] !== 0) {
      var s = mathTrunc(this.recordTimeMs[t][i] / 100);
      var n = this.recordTimeMs[t][i] % 100;
      var arr = Array.prototype.slice.call(this.recordName[t][i], 0, 3);
      var r = String.fromCharCode.apply(null, arr).replace(/\0/g, "");
      e[i] = r + " ";
      if (mathTrunc(s / 60) < 10) {
        e[i] += " 0" + mathTrunc(s / 60);
      } else {
        e[i] += " " + mathTrunc(s / 60);
      }
      if (s % 60 < 10) {
        e[i] += ":0" + (s % 60);
      } else {
        e[i] += ":" + (s % 60);
      }
      if (n < 10) {
        e[i] += ".0" + n;
      } else {
        e[i] += "." + n;
      }
    } else {
      e[i] = "";
    }
  }
  return e;
};
D.prototype.writeRecordInfo = function () {
  this.getLevelInfo(this.packedRecordInfo);
  if (this.recordStore !== null) {
    if (this.packedRecordInfoRecordId === -1) {
      this.packedRecordInfoRecordId = this.recordStore.addRecord(this.packedRecordInfo, 0, 96);
    } else {
      this.recordStore.setRecord(this.packedRecordInfoRecordId, this.packedRecordInfo, 0, 96);
    }
  }
};
D.prototype.getPosOfNewRecord = function (t, e) {
  for (var i = 0; i < 3; ++i) {
    if (this.recordTimeMs[t][i] > e || this.recordTimeMs[t][i] === 0) return i;
  }
  return 3;
};
D.prototype.addRecordIfNeeded = function (t, e, i) {
  var s = this.getPosOfNewRecord(t, i);
  if (s !== 3) {
    if (i > 16777e3) i = 16777e3;
    this.addNewRecord(t, s);
    this.recordTimeMs[t][s] = i;
    for (var n = 0; n < D.PLAYER_NAME_MAX; ++n) {
      this.recordName[t][s][n] = e[n];
    }
  }
};
D.prototype.addNewRecord = function (t, e) {
  for (var i = 2; i > e; --i) {
    this.recordTimeMs[t][i] = this.recordTimeMs[t][i - 1];
    for (var s = 0; s < D.PLAYER_NAME_MAX; ++s) {
      this.recordName[t][i][s] = this.recordName[t][i - 1][s];
    }
  }
};
D.prototype.deleteRecordStores = function () {
  var t = H.listRecordStores();
  for (var i = 0; i < t.length; i++) {
    var e = t[i];
    if (e !== "GWTRStates") H.deleteRecordStore(e);
  }
};
D.prototype.closeRecordStore = function () {
  if (this.recordStore) this.recordStore.closeRecordStore();
};

function C(t, e, i, s, n, r, o, l) {
  this.optionsList = [];
  this.currentOptionPos = 0;
  this.maxAvailableOption = 0;
  this.currentGameMenu = null;
  this.parentGameMenu = null;
  this.selectionMenuRequested = false;
  this.selectedOptionName = "";
  this.settingsStringRenders = [];
  this.hasSprite = false;
  this.isDrawSprite8 = false;

  this.micro = r;
  this.menuManager = i;
  this.useColon = l;
  this.isToggleSetting = n;
  this.parentGameMenu = o;
  if (l) {
    this.text = t;
    this.isDrawSprite8 = true;
    return;
  }
  this.text = t + ":";
  this.currentOptionPos = e;
  this.optionsList = s.length === 0 ? [""] : s;
  this.maxAvailableOption = s.length - 1;
  this.setCurrentOptionPos(e);
  if (n) {
    this.selectedOptionName = e === 1 ? "Off" : "On";
  } else {
    this.selectCurrentOptionName();
    this.init();
  }
}
C.prototype.setFlags = function (t, e) {
  this.hasSprite = t;
  this.isDrawSprite8 = e;
};
C.prototype.setOptionsList = function (t) {
  this.optionsList = t;
  if (this.currentOptionPos > this.optionsList.length - 1) {
    this.currentOptionPos = this.optionsList.length - 1;
  }
  if (this.maxAvailableOption > this.optionsList.length - 1) {
    this.maxAvailableOption = this.optionsList.length - 1;
  }
  this.selectCurrentOptionName();
  this.init();
};
C.prototype.init = function () {
  this.currentGameMenu = new E(this.text, this.micro, this.parentGameMenu);
  this.settingsStringRenders = new Array(this.optionsList.length);
  for (var t = 0; t < this.settingsStringRenders.length; ++t) {
    this.settingsStringRenders[t] = new C(
      this.optionsList[t], 0, this, [], false, this.micro, this.parentGameMenu, true
    );
    if (t > this.maxAvailableOption) {
      this.settingsStringRenders[t].setFlags(true, true);
    }
    this.currentGameMenu.addMenuElement(this.settingsStringRenders[t]);
  }
};
C.prototype.setParentGameMenu = function (t) {
  this.parentGameMenu = t;
};
C.prototype.setText = function (t) {
  this.text = this.useColon ? t : t + ":";
};
C.prototype.isNotTextRender = function () {
  return true;
};
C.prototype.menuElemMethod = function (t) {
  if (this.useColon) {
    if (t === 1) this.menuManager.handleMenuSelection(this);
    return;
  }
  switch (t) {
    case 1:
      if (this.isToggleSetting) {
        ++this.currentOptionPos;
        if (this.currentOptionPos > 1) this.currentOptionPos = 0;
        this.selectedOptionName = this.currentOptionPos === 1 ? "Off" : "On";
        this.menuManager.handleMenuSelection(this);
        return;
      }
      this.selectionMenuRequested = true;
      this.menuManager.handleMenuSelection(this);
      return;
    case 2:
      if (this.isToggleSetting) {
        if (this.currentOptionPos === 1) {
          this.currentOptionPos = 0;
          this.selectedOptionName = "On";
          this.menuManager.handleMenuSelection(this);
        }
        return;
      }
      ++this.currentOptionPos;
      if (this.currentOptionPos > this.optionsList.length - 1) {
        this.currentOptionPos = this.optionsList.length - 1;
      } else {
        this.menuManager.handleMenuSelection(this);
      }
      this.selectCurrentOptionName();
      return;
    case 3:
      if (this.isToggleSetting) {
        if (this.currentOptionPos === 0) {
          this.currentOptionPos = 1;
          this.selectedOptionName = "Off";
          this.menuManager.handleMenuSelection(this);
        }
        return;
      }
      --this.currentOptionPos;
      if (this.currentOptionPos < 0) {
        this.currentOptionPos = 0;
      } else {
        this.selectCurrentOptionName();
        this.menuManager.handleMenuSelection(this);
      }
      this.selectCurrentOptionName();
  }
};
C.prototype.selectCurrentOptionName = function () {
  this.selectedOptionName = this.optionsList[this.currentOptionPos];
};
C.prototype.render = function (t, e, i) {
  if (this.useColon) {
    if (this.hasSprite) {
      if (this.micro.gameCanvas !== null) {
        t.drawString(this.text, i + f.spriteSizeX[8] + 3, e, u.LEFT | u.TOP);
        this.micro.gameCanvas.drawSprite(
          t,
          this.isDrawSprite8 ? 8 : 9,
          i,
          e - mathTrunc(f.spriteSizeY[this.isDrawSprite8 ? 8 : 9] / 2) + mathTrunc(t.getFont().getHeight() / 2)
        );
      }
    } else {
      t.drawString(this.text, i, e, u.LEFT | u.TOP);
    }
    return;
  }
  t.drawString(this.text, i, e, u.LEFT | u.TOP);
  var s = i + t.getFont().stringWidth(this.text);
  if (this.currentOptionPos > this.maxAvailableOption && !this.isToggleSetting && this.micro.gameCanvas !== null) {
    this.micro.gameCanvas.drawSprite(
      t,
      8,
      s + 1,
      e - mathTrunc(f.spriteSizeY[8] / 2) + mathTrunc(t.getFont().getHeight() / 2)
    );
    s += f.spriteSizeX[9] + 1;
  }
  s += 2;
  t.drawString(this.selectedOptionName, s, e, u.LEFT | u.TOP);
};
C.prototype.setAvailableOptions = function (t) {
  this.maxAvailableOption = t;
  if (t > this.optionsList.length - 1) t = this.optionsList.length - 1;
  if (this.currentGameMenu !== null) {
    for (var e = 0; e < this.settingsStringRenders.length; ++e) {
      this.settingsStringRenders[e].setFlags(e > t, e > t);
    }
  }
};
C.prototype.getMaxAvailableOptionPos = function () {
  return this.maxAvailableOption;
};
C.prototype.getMaxOptionPos = function () {
  return this.optionsList.length - 1;
};
C.prototype.getOptionsList = function () {
  return this.optionsList;
};
C.prototype.setCurrentOptionPos = function (t) {
  this.currentOptionPos = t;
  if (this.currentOptionPos > this.optionsList.length - 1) this.currentOptionPos = 0;
  if (this.currentOptionPos < 0) this.currentOptionPos = this.optionsList.length - 1;
  this.selectCurrentOptionName();
};
C.prototype.getCurrentOptionPos = function () {
  return this.currentOptionPos;
};
C.prototype.getCurrentMenu = function () {
  return this.currentGameMenu;
};
C.prototype.openMenu = function (t, e) {
  this.menuManager.openMenu(t, e);
};
C.prototype.saveAndClose = function () {
  this.menuManager.saveAndClose();
};
C.prototype.handleMenuSelection = function (t) {
  for (var e = 0; e < this.settingsStringRenders.length; ++e) {
    if (t === this.settingsStringRenders[e]) {
      this.currentOptionPos = e;
      this.selectCurrentOptionName();
      break;
    }
  }
  this.menuManager.openMenu(this.parentGameMenu, true);
  this.menuManager.handleMenuSelection(this);
};
C.prototype.getSettingsStringRenders = function () {
  return this.settingsStringRenders;
};
C.prototype.consumeSelectionMenuRequested = function () {
  var t = this.selectionMenuRequested;
  this.selectionMenuRequested = false;
  return t;
};

var It = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABAAgMAAADXB5lNAAAACVBMVEX///8AAADIyMh3cXlhAAAAAXRSTlMAQObYZgAAABtJREFUeNpj6EADDEpogGFUxaiKURWjKrCqAAB091QQhuUBjAAAAABJRU5ErkJggg==";

function xt(t) {
  this.persistedStateBuffer = new Int8Array(19);
  this.recordManager = null;
  this.gameMenuMain = null;
  this.gameMenuPlay = null;
  this.gameMenuOptions = null;
  this.gameMenuAbout = null;
  this.gameMenuHelp = null;
  this.gameMenuConfirmClear = null;
  this.gameMenuConfirmReset = null;
  this.gameMenuFinished = null;
  this.gameMenuIngame = null;
  this.taskPlayMenu = null;
  this.taskOptions = null;
  this.taskHelp = null;
  this.settingStringLevel = null;
  this.gameMenuStringLevel = null;
  this.settingsStringTrack = null;
  this.trackSelectionMenu = null;
  this.settingsStringLeague = null;
  this.gameMenuLeague = null;
  this.gameMenuHighscore = null;
  this.gameTimerTaskHighscore = null;
  this.taskStart = null;
  this.perspectiveSetting = null;
  this.shadowsSetting = null;
  this.driverSpriteSetting = null;
  this.bikeSpriteSetting = null;
  this.inputSetting = null;
  this.lookAheadSetting = null;
  this.clearHighscoreSetting = null;
  this.fullResetItem = null;
  this.confirmYes = null;
  this.confirmNo = null;
  this.taskAbout = null;
  this.objectiveMenu = null;
  this.objectiveItem = null;
  this.keysMenu = null;
  this.keysItem = null;
  this.unlockingMenu = null;
  this.unlockingItem = null;
  this.gameMenuOptionsHighscoreDescription = null;
  this.taskHighscore = null;
  this.gameMenuOptions2 = null;
  this.optionsHelpItem = null;
  this.gameMenuEnterName = null;
  this.settingStringBack = null;
  this.settingStringPlayMenu = null;
  this.settingStringContinue = null;
  this.settingStringGoToMain = null;
  this.settingStringExitGame = null;
  this.restartTrackAction = null;
  this.nextTrackAction = null;
  this.finishOkAction = null;
  this.finishNameAction = null;
  this.lastFinishTime = -1;
  this.lastFinishSeconds = -1;
  this.lastFinishCentiseconds = -1;
  this.lastFinishTimeString = "";
  this.playerNameBytes = new Uint8Array([65, 65, 65]);
  this.unlockedTracksByLevel = new Int8Array(4);
  this.defaultInputString = new Uint8Array([65, 65, 65]);
  this.availableLeagues = 0;
  this.maxAvailableLevel = 0;
  this.selectedTrackByLevel = [0, 0, 0];
  this.levelNames = [];
  this.leagueNames = new Array(3);
  this.leagueNamesAll4 = [];
  this.recordStore = null;
  this.recordStoreRecordId = -1;
  this.isRecordStoreOpened = false;
  this.rasterImage = null;
  this.textRenderCodeBrewLink = null;
  this.resumeLevelIndex = 0;
  this.resumeTrackIndex = 0;
  this.completedLastTrack = false;
  this.restartRequested = false;
  this.levelDifficultyNames = ["Easy", "Medium", "Pro"];
  this.finishMenuOpenedAt = 0;
  this.isDisablePerspective = 0;
  this.isDisabledShadows = 0;
  this.isDisabledDriverSprite = 0;
  this.isDisabledBikeSprite = 0;
  this.inputMode = 0;
  this.isDisableLookAhead = 0;
  this.selectedTrackIndex = 0;
  this.selectedLevelIndex = 0;
  this.selectedLeagueIndex = 0;
  this.uiOverlayMode = 0;
  this.reservedSetting15 = 0;
  this.toggleOptionNames = [];
  this.inputModeNames = [];
  this.currentGameMenu = null;
  this.highscoreLeagueIndex = 0;
  this.isOpeningPauseMenu = false;

  this.micro = t;
  this.spacerTextRender = new A("", t);
}
xt.prototype.initPart = function (t) {
  var e = 0;
  switch (t) {
    case 1:
      this.playerNameBytes = this.defaultInputString;
      this.toggleOptionNames = ["On", "Off"];
      this.inputModeNames = ["Keyset 1", "Keyset 2", "Keyset 3"];
      this.recordManager = new D();
      this.lastFinishTime = -1;
      this.lastFinishSeconds = -1;
      this.lastFinishCentiseconds = -1;
      this.lastFinishTimeString = "";
      this.isRecordStoreOpened = false;
      for (var i = 0; i < 19; ++i) this.persistedStateBuffer[i] = -127;
      try {
        this.recordStore = H.openRecordStore("GWTRStates", true);
        this.isRecordStoreOpened = true;
      } catch (err) {
        this.isRecordStoreOpened = false;
      }
      return;
    case 2:
      if (this.recordStoreRecordId === -1 && this.recordStore === null) return;
      var iStore;
      try {
        iStore = this.recordStore.enumerateRecords(null, null, false);
      } catch (err) {
        return;
      }
      if (iStore.numRecords() > 0) {
        try {
          var n = iStore.nextRecord();
          iStore.reset();
          this.recordStoreRecordId = iStore.nextRecordId();
          if (n.length <= 19) {
            for (var r = 0; r < n.length; ++r) {
              this.persistedStateBuffer[r] = n[r];
            }
          }
        } catch (err) {
          return;
        }
        iStore.destroy();
      }
      var s = this.readStoredNameBytes(16, -1);
      if (s.length !== 0 && s[0] !== -1) {
        for (e = 0; e < 3; ++e) this.playerNameBytes[e] = s[e];
      }
      if (this.playerNameBytes[0] === 82 && this.playerNameBytes[1] === 75 && this.playerNameBytes[2] === 69) {
        this.availableLeagues = 3;
        this.maxAvailableLevel = 2;
        if (this.micro.levelLoader !== null) {
          this.unlockedTracksByLevel[0] = this.micro.levelLoader.levelNames[0].length - 1;
          this.unlockedTracksByLevel[1] = this.micro.levelLoader.levelNames[1].length - 1;
          this.unlockedTracksByLevel[2] = this.micro.levelLoader.levelNames[2].length - 1;
        }
        return;
      }
      this.availableLeagues = 0;
      this.maxAvailableLevel = 1;
      this.unlockedTracksByLevel[0] = 0;
      this.unlockedTracksByLevel[1] = 0;
      this.unlockedTracksByLevel[2] = -1;
      return;
    case 3:
      this.isDisablePerspective = this.readStoredValue(0, this.isDisablePerspective);
      this.isDisabledShadows = this.readStoredValue(1, this.isDisabledShadows);
      this.isDisabledDriverSprite = this.readStoredValue(2, this.isDisabledDriverSprite);
      this.isDisabledBikeSprite = this.readStoredValue(3, this.isDisabledBikeSprite);
      this.inputMode = this.readStoredValue(14, this.inputMode);
      this.isDisableLookAhead = this.readStoredValue(4, this.isDisableLookAhead);
      this.selectedTrackIndex = this.readStoredValue(11, this.selectedTrackIndex);
      this.selectedLevelIndex = this.readStoredValue(10, this.selectedLevelIndex);
      this.selectedLeagueIndex = this.readStoredValue(12, this.selectedLeagueIndex);
      this.reservedSetting15 = this.readStoredValue(15, this.reservedSetting15);
      this.resumeLevelIndex = this.selectedLevelIndex;
      this.resumeTrackIndex = this.selectedTrackIndex;
      if (this.playerNameBytes[0] !== 82 || this.playerNameBytes[1] !== 75 || this.playerNameBytes[2] !== 69) {
        this.availableLeagues = this.readStoredValue(5, this.availableLeagues);
        this.maxAvailableLevel = this.readStoredValue(6, this.maxAvailableLevel);
        for (e = 0; e < 3; ++e) {
          this.unlockedTracksByLevel[e] = this.readStoredValue(7 + e, this.unlockedTracksByLevel[e]);
        }
      }
      try {
        this.selectedTrackByLevel[this.selectedLevelIndex] = this.selectedTrackIndex;
      } catch (err) {
        this.selectedLevelIndex = 0;
        this.selectedTrackIndex = 0;
        this.selectedTrackByLevel[this.selectedLevelIndex] = this.selectedTrackIndex;
      }
      p.isEnabledPerspective = this.isDisablePerspective === 0;
      p.isEnabledShadows = this.isDisabledShadows === 0;
      if (this.micro.gamePhysics !== null) {
        this.micro.gamePhysics.setEnableLookAhead(this.isDisableLookAhead === 0);
      }
      if (this.micro.gameCanvas !== null) {
        this.micro.gameCanvas.setInputMode(this.inputMode);
        this.micro.gameCanvas.setUiOverlayEnabled(this.uiOverlayMode === 0);
      }
      this.leagueNamesAll4 = ["100cc", "175cc", "220cc", "325cc"];
      this.levelNames = this.micro.levelLoader ? this.micro.levelLoader.levelNames : [];
      if (this.availableLeagues < 3) {
        this.leagueNames = ["100cc", "175cc", "220cc"];
      } else {
        this.leagueNames = this.leagueNamesAll4;
      }
      this.highscoreLeagueIndex = this.selectedLeagueIndex;
      return;
    case 4:
      this.gameMenuMain = new E("Main", this.micro, null);
      this.gameMenuPlay = new E("Play", this.micro, this.gameMenuMain);
      this.gameMenuOptions = new E("Options", this.micro, this.gameMenuMain);
      this.gameMenuAbout = new E("About", this.micro, this.gameMenuMain);
      this.gameMenuHelp = new E("Help", this.micro, this.gameMenuMain);
      this.settingStringBack = new C("Back", 0, this, [], false, this.micro, this.gameMenuMain, true);
      this.settingStringGoToMain = new C("Go to Main", 0, this, [], false, this.micro, this.gameMenuMain, true);
      this.settingStringContinue = new C("Continue", 0, this, [], false, this.micro, this.gameMenuMain, true);
      this.settingStringPlayMenu = new C("Play Menu", 0, this, [], false, this.micro, this.gameMenuMain, true);
      var iFont = K.getFont(v.STYLE_BOLD, v.SIZE_SMALL);
      var pos = this.gameMenuAbout ? this.gameMenuAbout.xPos : 0;
      if (pos + iFont.stringWidth("http://www.codebrew.se/") >= this.getCanvasWidth()) {
        this.textRenderCodeBrewLink = new A("www.codebrew.se", this.micro);
      } else {
        this.textRenderCodeBrewLink = new A("http://www.codebrew.se/", this.micro);
      }
      this.textRenderCodeBrewLink.setFont(iFont);
      this.gameMenuHighscore = new E("Highscore", this.micro, this.gameMenuPlay);
      this.gameMenuFinished = new E("Finished!", this.micro, this.gameMenuPlay);
      return;
    case 5:
      this.gameMenuIngame = new E("Ingame", this.micro, this.gameMenuPlay);
      this.gameMenuEnterName = new E("Enter Name", this.micro, this.gameMenuFinished, this.playerNameBytes);
      this.gameMenuConfirmClear = new E("Confirm Clear", this.micro, this.gameMenuOptions);
      this.gameMenuConfirmReset = new E("Confirm Reset", this.micro, this.gameMenuConfirmClear);
      this.taskPlayMenu = new B("Play Menu", this.gameMenuPlay, this);
      this.taskOptions = new B("Options", this.gameMenuOptions, this);
      this.taskHelp = new B("Help", this.gameMenuHelp, this);
      this.taskAbout = new B("About", this.gameMenuAbout, this);
      this.settingStringExitGame = new C("Exit Game", 0, this, [], false, this.micro, this.gameMenuMain, true);
      if (this.gameMenuMain) {
        this.gameMenuMain.addMenuElement(this.taskPlayMenu);
        this.gameMenuMain.addMenuElement(this.taskOptions);
        this.gameMenuMain.addMenuElement(this.taskHelp);
        this.gameMenuMain.addMenuElement(this.taskAbout);
        this.gameMenuMain.addMenuElement(this.settingStringExitGame);
      }
      this.settingStringLevel = new C("Level", this.selectedLevelIndex, this, this.levelDifficultyNames, false, this.micro, this.gameMenuPlay, false);
      this.settingsStringTrack = new C("Track", this.selectedTrackByLevel[this.selectedLevelIndex], this, this.levelNames[this.selectedLevelIndex], false, this.micro, this.gameMenuPlay, false);
      this.settingsStringLeague = new C("League", this.selectedLeagueIndex, this, this.leagueNames, false, this.micro, this.gameMenuPlay, false);
      try {
        this.settingsStringTrack.setAvailableOptions(this.unlockedTracksByLevel[this.selectedLevelIndex]);
      } catch (err) {
        this.settingsStringTrack.setAvailableOptions(0);
      }
      this.settingStringLevel.setAvailableOptions(this.maxAvailableLevel);
      this.settingsStringLeague.setAvailableOptions(this.availableLeagues);
      this.gameTimerTaskHighscore = new B("Highscore", this.gameMenuHighscore, this);
      if (this.gameMenuHighscore) this.gameMenuHighscore.addMenuElement(this.settingStringBack);
      this.taskStart = new C("Start>", 0, this, [], false, this.micro, this.gameMenuMain, true);
      if (this.gameMenuPlay) {
        this.gameMenuPlay.addMenuElement(this.taskStart);
        this.gameMenuPlay.addMenuElement(this.settingStringLevel);
        this.gameMenuPlay.addMenuElement(this.settingsStringTrack);
        this.gameMenuPlay.addMenuElement(this.settingsStringLeague);
        this.gameMenuPlay.addMenuElement(this.gameTimerTaskHighscore);
        this.gameMenuPlay.addMenuElement(this.settingStringGoToMain);
      }
      this.perspectiveSetting = new C("Perspective", this.isDisablePerspective, this, this.toggleOptionNames, true, this.micro, this.gameMenuOptions, false);
      this.shadowsSetting = new C("Shadows", this.isDisabledShadows, this, this.toggleOptionNames, true, this.micro, this.gameMenuOptions, false);
      this.driverSpriteSetting = new C("Driver sprite", this.isDisabledDriverSprite, this, this.toggleOptionNames, true, this.micro, this.gameMenuOptions, false);
      this.bikeSpriteSetting = new C("Bike sprite", this.isDisabledBikeSprite, this, this.toggleOptionNames, true, this.micro, this.gameMenuOptions, false);
      this.inputSetting = new C("Input", this.inputMode, this, this.inputModeNames, false, this.micro, this.gameMenuOptions, false);
      this.lookAheadSetting = new C("Look ahead", this.isDisableLookAhead, this, this.toggleOptionNames, true, this.micro, this.gameMenuOptions, false);
      this.clearHighscoreSetting = new B("Clear highscore", this.gameMenuConfirmClear, this);
      return;
    case 6:
      if (this.gameMenuOptions) {
        this.gameMenuOptions.addMenuElement(this.perspectiveSetting);
        this.gameMenuOptions.addMenuElement(this.shadowsSetting);
        this.gameMenuOptions.addMenuElement(this.driverSpriteSetting);
        this.gameMenuOptions.addMenuElement(this.bikeSpriteSetting);
        this.gameMenuOptions.addMenuElement(this.inputSetting);
        this.gameMenuOptions.addMenuElement(this.lookAheadSetting);
        this.gameMenuOptions.addMenuElement(this.clearHighscoreSetting);
        this.gameMenuOptions.addMenuElement(this.settingStringBack);
      }
      this.confirmNo = new C("No", 0, this, [], false, this.micro, this.gameMenuMain, true);
      this.confirmYes = new C("Yes", 0, this, [], false, this.micro, this.gameMenuMain, true);
      this.fullResetItem = new B("Full Reset", this.gameMenuConfirmReset, this);
      this.addTextRender(this.gameMenuConfirmClear, "Clearing the highscores can not be undone. It will remove all the registered times on all tracks.");
      this.addTextRender(this.gameMenuConfirmClear, "Would you like to clear the highscores?");
      if (this.gameMenuConfirmClear) {
        this.gameMenuConfirmClear.addMenuElement(this.confirmNo);
        this.gameMenuConfirmClear.addMenuElement(this.confirmYes);
        this.gameMenuConfirmClear.addMenuElement(this.fullResetItem);
      }
      this.addTextRender(this.gameMenuConfirmReset, "A full reset can not be undone. It will relock all tracks and leagues and clear back all settings to default. A full reset will exit the application.");
      this.addTextRender(this.gameMenuConfirmReset, "Would you like to do a full reset?");
      if (this.gameMenuConfirmReset) {
        this.gameMenuConfirmReset.addMenuElement(this.confirmNo);
        this.gameMenuConfirmReset.addMenuElement(this.confirmYes);
      }
      this.objectiveMenu = new E("Objective", this.micro, this.gameMenuHelp);
      this.objectiveItem = new B("Objective", this.objectiveMenu, this);
      this.addTextRender(this.objectiveMenu, "Race to the finish line as fast as you can without crashing. By leaning forward and backward you can adjust the rotation of your bike. By landing on both wheels after jumping, your bike won't crash as easily. Beware, the levels tend to get harder and harder...");
      this.objectiveMenu.addMenuElement(this.settingStringBack);
      if (this.gameMenuHelp) this.gameMenuHelp.addMenuElement(this.objectiveItem);
      this.keysMenu = new E("Keys", this.micro, this.gameMenuHelp);
      this.keysItem = new B("Keys", this.keysMenu, this);
      this.addTextRender(this.keysMenu, "- " + this.inputModeNames[0] + " -");
      this.addTextRender(this.keysMenu, "UP accelerates, DOWN brakes, RIGHT leans forward and LEFT leans backward. 1 accelerates and leans backward. 3 accelerates and leans forward. 7 brakes and leans backward. 9 brakes and leans forward.");
      this.keysMenu.addMenuElement(this.spacerTextRender);
      this.addTextRender(this.keysMenu, "- " + this.inputModeNames[1] + " -");
      this.addTextRender(this.keysMenu, "1 accelerates, 4 brakes, 6 leans forward and 5 leans backward.");
      this.keysMenu.addMenuElement(this.spacerTextRender);
      this.addTextRender(this.keysMenu, "- " + this.inputModeNames[2] + " -");
      this.addTextRender(this.keysMenu, "3 accelerates, 6 brakes, 5 leans forward and 4 leans backward.");
      this.keysMenu.addMenuElement(this.settingStringBack);
      if (this.gameMenuHelp) this.gameMenuHelp.addMenuElement(this.keysItem);
      this.unlockingMenu = new E("Unlocking", this.micro, this.gameMenuHelp);
      this.unlockingItem = new B("Unlocking", this.unlockingMenu, this);
      this.addTextRender(this.unlockingMenu, "By completing the easier levels, new levels will be unlocked. You will also gain access to higher leagues where more advanced bikes with different characteristics are available.");
      this.unlockingMenu.addMenuElement(this.settingStringBack);
      if (this.gameMenuHelp) this.gameMenuHelp.addMenuElement(this.unlockingItem);
      this.gameMenuOptionsHighscoreDescription = new E("Highscore", this.micro, this.gameMenuHelp);
      this.taskHighscore = new B("Highscore", this.gameMenuOptionsHighscoreDescription, this);
      this.addTextRender(this.gameMenuOptionsHighscoreDescription, "The three best times on every track are saved for each league. When beating a time on a track you will be asked to enter your name. The highscores can be viewed from the Play Menu. By pressing left and right in the highscore view you can view the highscore for a specific league. The highscore can be cleared from the options menu.");
      this.gameMenuOptionsHighscoreDescription.addMenuElement(this.settingStringBack);
      if (this.gameMenuHelp) this.gameMenuHelp.addMenuElement(this.taskHighscore);
      return;
    case 7:
      this.gameMenuOptions2 = new E("Options", this.micro, this.gameMenuHelp);
      this.optionsHelpItem = new B("Options", this.gameMenuOptions2, this);
      this.addTextRender(this.gameMenuOptions2, "Perspective: On/Off");
      this.addTextRender(this.gameMenuOptions2, "Default: <On>. Turns on and off the perspective view of the tracks.");
      this.gameMenuOptions2.addMenuElement(this.spacerTextRender);
      this.addTextRender(this.gameMenuOptions2, "Shadows: On/Off");
      this.addTextRender(this.gameMenuOptions2, "Default: <On>. Turns on and off the shadows.");
      this.gameMenuOptions2.addMenuElement(this.spacerTextRender);
      this.addTextRender(this.gameMenuOptions2, "Driver Sprite: On / Off");
      this.addTextRender(this.gameMenuOptions2, "Default: <On>. <On> uses a texture for the driver. <Off> uses line graphics.");
      this.gameMenuOptions2.addMenuElement(this.spacerTextRender);
      this.addTextRender(this.gameMenuOptions2, "Bike Sprite: On / Off");
      this.addTextRender(this.gameMenuOptions2, "Default: <On>. <On> uses a texture for the bike. <Off> uses line graphics.");
      this.gameMenuOptions2.addMenuElement(this.spacerTextRender);
      this.addTextRender(this.gameMenuOptions2, "Input: Keyset 1,2,3 ");
      this.addTextRender(this.gameMenuOptions2, 'Default: <1>. Determines which type of input should be used when playing. See "Keys" in the help menu for more info.');
      this.gameMenuOptions2.addMenuElement(this.spacerTextRender);
      this.addTextRender(this.gameMenuOptions2, "Look ahead: On/Off");
      this.addTextRender(this.gameMenuOptions2, "Default: <On>. Turns on and off smart camera movement.");
      this.gameMenuOptions2.addMenuElement(this.spacerTextRender);
      this.addTextRender(this.gameMenuOptions2, "Clear highscore");
      this.addTextRender(this.gameMenuOptions2, 'Lets you clear the highscores. Here you can also do a "Full Reset" which will reset the game to original state (clear settings, highscores, unlocked levels and leagues).');
      this.gameMenuOptions2.addMenuElement(this.spacerTextRender);
      this.gameMenuOptions2.addMenuElement(this.settingStringBack);
      if (this.gameMenuHelp) {
        this.gameMenuHelp.addMenuElement(this.optionsHelpItem);
        this.gameMenuHelp.addMenuElement(this.settingStringBack);
      }
      this.addTextRender(this.gameMenuAbout, '"Gravity Defied"');
      this.addTextRender(this.gameMenuAbout, "brought 2 you by pascha.                For information visit:");
      if (this.textRenderCodeBrewLink !== null && this.gameMenuAbout) {
        this.gameMenuAbout.addMenuElement(this.textRenderCodeBrewLink);
      }
      if (this.gameMenuAbout) this.gameMenuAbout.addMenuElement(this.settingStringBack);
      if (this.micro.levelLoader !== null) {
        this.nextTrackAction = new C("Track: " + this.micro.levelLoader.getName(0, 1), 0, this, [], false, this.micro, this.gameMenuMain, true);
        this.restartTrackAction = new C("Restart: " + this.micro.levelLoader.getName(0, 0), 0, this, [], false, this.micro, this.gameMenuMain, true);
      } else {
        this.nextTrackAction = new C("Track", 0, this, [], false, this.micro, this.gameMenuMain, true);
        this.restartTrackAction = new C("Restart", 0, this, [], false, this.micro, this.gameMenuMain, true);
      }
      if (this.gameMenuIngame) {
        this.gameMenuIngame.addMenuElement(this.settingStringContinue);
        this.gameMenuIngame.addMenuElement(this.restartTrackAction);
        this.gameMenuIngame.addMenuElement(this.taskOptions);
        this.gameMenuIngame.addMenuElement(this.taskHelp);
        this.gameMenuIngame.addMenuElement(this.settingStringPlayMenu);
      }
      this.finishOkAction = new C("Ok", 0, this, [], false, this.micro, this.gameMenuMain, true);
      this.finishNameAction = new C("Name - " + this.makeString(this.playerNameBytes), 0, this, [], false, this.micro, this.gameMenuMain, true);
      this.openMenu(this.gameMenuMain, false);
      this.rasterImage = X.fromSrc(It);
      return;
    default:
      return;
  }
};
xt.prototype.addTextRender = function (t, e) {
  var i = A.makeMultilineTextRenders(e, this.micro);
  for (var s = 0; s < i.length; ++s) t.addMenuElement(i[s]);
};
xt.prototype.getCurrentLevel = function () {
  return this.settingStringLevel ? this.settingStringLevel.getCurrentOptionPos() : 0;
};
xt.prototype.getCurrentTrack = function () {
  return this.settingsStringTrack ? this.settingsStringTrack.getCurrentOptionPos() : 0;
};
xt.prototype.consumeRestartRequested = function () {
  if (this.restartRequested) {
    this.restartRequested = false;
    return true;
  }
  return false;
};
xt.prototype.finalizeFinishedMenu = function () {
  if (
    this.recordManager === null ||
    this.gameMenuFinished === null ||
    this.settingsStringLeague === null ||
    this.settingsStringTrack === null ||
    this.settingStringLevel === null ||
    this.restartTrackAction === null ||
    this.settingStringPlayMenu === null ||
    this.micro.levelLoader === null
  ) return;
  this.recordManager.addRecordIfNeeded(
    this.settingsStringLeague.getCurrentOptionPos(),
    this.playerNameBytes,
    this.lastFinishTime
  );
  this.recordManager.writeRecordInfo();
  this.completedLastTrack = false;
  this.gameMenuFinished.clearVector();
  this.gameMenuFinished.addMenuElement(new A("Time: " + this.lastFinishTimeString, this.micro));
  var t = this.recordManager.getRecordDescription(this.settingsStringLeague.getCurrentOptionPos());
  for (var s = 0; s < t.length; ++s) {
    if (t[s] !== "") {
      this.gameMenuFinished.addMenuElement(new A("" + (s + 1) + "." + t[s], this.micro));
    }
  }
  this.recordManager.closeRecordStore();
  var e = -1;
  if (this.settingsStringTrack.getMaxAvailableOptionPos() >= this.settingsStringTrack.getCurrentOptionPos()) {
    var av = this.settingsStringTrack.getCurrentOptionPos() + 1 < this.unlockedTracksByLevel[this.settingStringLevel.getCurrentOptionPos()] ? this.unlockedTracksByLevel[this.settingStringLevel.getCurrentOptionPos()] : this.settingsStringTrack.getCurrentOptionPos() + 1;
    this.settingsStringTrack.setAvailableOptions(av);
    this.unlockedTracksByLevel[this.settingStringLevel.getCurrentOptionPos()] = this.settingsStringTrack.getMaxAvailableOptionPos() < this.unlockedTracksByLevel[this.settingStringLevel.getCurrentOptionPos()] ? this.unlockedTracksByLevel[this.settingStringLevel.getCurrentOptionPos()] : this.settingsStringTrack.getMaxAvailableOptionPos();
  }
  if (this.settingsStringTrack.getCurrentOptionPos() === this.settingsStringTrack.getMaxOptionPos()) {
    this.completedLastTrack = true;
    switch (this.settingStringLevel.getCurrentOptionPos()) {
      case 0:
        if (e < 1) {
          e = 1;
          this.settingsStringLeague.setAvailableOptions(e);
        }
        break;
      case 1:
        if (e < 2) {
          e = 2;
          this.settingsStringLeague.setAvailableOptions(e);
        }
        break;
      case 2:
        if (e < 3) {
          e = 3;
          this.settingsStringLeague.setOptionsList(this.leagueNamesAll4);
          this.leagueNames = this.leagueNamesAll4;
          this.settingsStringLeague.setAvailableOptions(e);
        }
    }
    this.settingStringLevel.setAvailableOptions(this.settingStringLevel.getMaxAvailableOptionPos() + 1);
    if (this.unlockedTracksByLevel[this.settingStringLevel.getMaxAvailableOptionPos()] === -1) {
      this.unlockedTracksByLevel[this.settingStringLevel.getMaxAvailableOptionPos()] = 0;
    }
  }
  var i = this.getCountOfRecordStoresWithPrefix(this.settingStringLevel.getCurrentOptionPos());
  this.addTextRender(this.gameMenuFinished, "" + i + " of " + this.levelNames[this.settingStringLevel.getCurrentOptionPos()].length + " tracks in " + this.levelDifficultyNames[this.settingStringLevel.getCurrentOptionPos()] + " completed.");
  if (!this.completedLastTrack) {
    this.restartTrackAction.setText("Restart: " + this.micro.levelLoader.getName(this.settingStringLevel.getCurrentOptionPos(), this.settingsStringTrack.getCurrentOptionPos()));
    if (this.nextTrackAction !== null) {
      this.nextTrackAction.setText("Next: " + this.micro.levelLoader.getName(this.resumeLevelIndex, this.resumeTrackIndex + 1));
    }
  } else if (this.settingStringLevel.getCurrentOptionPos() < this.settingStringLevel.getMaxOptionPos()) {
    this.settingStringLevel.setCurrentOptionPos(this.settingStringLevel.getCurrentOptionPos() + 1);
    this.settingsStringTrack.setCurrentOptionPos(0);
    this.settingsStringTrack.setAvailableOptions(this.unlockedTracksByLevel[this.settingStringLevel.getCurrentOptionPos()]);
  }
  if (e !== -1) {
    this.addTextRender(this.gameMenuFinished, "Congratultions! You have successfully unlocked a new league: " + this.leagueNames[e]);
    if (e === 3) this.gameMenuFinished.addMenuElement(new A("Enjoy...", this.micro));
    this.showAlert("League unlocked", "You have successfully unlocked a new league: " + this.leagueNames[e], null);
  } else if (this.completedLastTrack) {
    var s2 = true;
    if (this.micro.levelLoader !== null) {
      for (var n = 0; n < 3; ++n) {
        if (this.unlockedTracksByLevel[n] !== this.micro.levelLoader.levelNames[n].length - 1) s2 = false;
      }
    }
    if (!s2) {
      this.addTextRender(this.gameMenuFinished, "You have completed all tracks at this level.");
    }
  }
  if (!this.completedLastTrack && this.nextTrackAction !== null) {
    this.gameMenuFinished.addMenuElement(this.nextTrackAction);
  }
  this.restartTrackAction.setText("Restart: " + this.micro.levelLoader.getName(this.resumeLevelIndex, this.resumeTrackIndex));
  this.gameMenuFinished.addMenuElement(this.restartTrackAction);
  this.gameMenuFinished.addMenuElement(this.settingStringPlayMenu);
  this.openMenu(this.gameMenuFinished, false);
};
xt.prototype.repaint = function () {
  if (this.micro.gameCanvas) this.micro.gameCanvas.repaint();
};
xt.prototype.getCanvasHeight = function () {
  return this.micro.gameCanvas ? this.micro.gameCanvas.getHeight() : 0;
};
xt.prototype.getCanvasWidth = function () {
  return this.micro.gameCanvas ? this.micro.gameCanvas.getWidth() : 0;
};
xt.prototype.showMenuScreen = function (t) {
  this.finishMenuOpenedAt = 0;
  this.isOpeningPauseMenu = false;
  switch (t) {
    case 0:
      this.openMenu(this.gameMenuMain, false);
      if (this.micro.gamePhysics) this.micro.gamePhysics.enableGenerateInputAI();
      break;
    case 1:
      if (this.settingStringLevel !== null && this.settingsStringTrack !== null && this.restartTrackAction !== null && this.micro.levelLoader !== null) {
        this.resumeLevelIndex = this.settingStringLevel.getCurrentOptionPos();
        this.resumeTrackIndex = this.settingsStringTrack.getCurrentOptionPos();
        this.restartTrackAction.setText("Restart: " + this.micro.levelLoader.getName(this.resumeLevelIndex, this.resumeTrackIndex));
      }
      this.restartRequested = false;
      this.openMenu(this.gameMenuIngame, false);
      break;
    case 2:
      this.finishMenuOpenedAt = it.currentTimeMillis();
      if (this.gameMenuFinished) this.gameMenuFinished.clearVector();
      if (
        this.settingStringLevel === null ||
        this.settingsStringTrack === null ||
        this.recordManager === null ||
        this.settingsStringLeague === null ||
        this.gameMenuFinished === null ||
        this.finishOkAction === null ||
        this.finishNameAction === null
      ) break;
      this.resumeLevelIndex = this.settingStringLevel.getCurrentOptionPos();
      this.resumeTrackIndex = this.settingsStringTrack.getCurrentOptionPos();
      this.recordManager.openRecordStoreForTrack(
        this.settingStringLevel.getCurrentOptionPos(),
        this.settingsStringTrack.getCurrentOptionPos()
      );
      var e = this.recordManager.getPosOfNewRecord(
        this.settingsStringLeague.getCurrentOptionPos(),
        this.lastFinishTime
      );
      this.lastFinishTimeString = this.timeToString(this.lastFinishTime);
      if (e >= 0 && e <= 2) {
        var i = new A("", this.micro);
        i.setDx(f.spriteSizeX[5] + 1);
        switch (e) {
          case 0:
            i.setText("First place!"); i.setDrawSprite(true, 5); break;
          case 1:
            i.setText("Second place!"); i.setDrawSprite(true, 6); break;
          case 2:
            i.setText("Third place!"); i.setDrawSprite(true, 7);
        }
        this.gameMenuFinished.addMenuElement(i);
        var s = new A("" + this.lastFinishTimeString, this.micro);
        s.setDx(f.spriteSizeX[5] + 1);
        this.gameMenuFinished.addMenuElement(s);
        this.gameMenuFinished.addMenuElement(this.finishOkAction);
        this.gameMenuFinished.addMenuElement(this.finishNameAction);
        this.openMenu(this.gameMenuFinished, false);
        this.isOpeningPauseMenu = false;
      } else {
        this.finalizeFinishedMenu();
      }
      break;
    default:
      this.openMenu(this.gameMenuMain, false);
  }
  if (this.micro.gameCanvas) this.micro.gameCanvas.isDrawingTime = false;
  if (this.micro.gamePhysics) this.micro.gamePhysics.syncRenderStateFromSimulation();
  this.micro.gameToMenu();
};
xt.prototype.renderCurrentMenu = function (t) {
  if (this.currentGameMenu !== null && !this.isOpeningPauseMenu) {
    if (this.micro.gameCanvas) this.micro.gameCanvas.drawGame(t);
    this.fillCanvasWithImage(t);
    this.currentGameMenu.render(t);
  }
};
xt.prototype.fillCanvasWithImage = function (t) {
  if (this.rasterImage !== null) {
    for (var e = 0; e < this.getCanvasHeight(); e += this.rasterImage.getHeight()) {
      for (var i = 0; i < this.getCanvasWidth(); i += this.rasterImage.getWidth()) {
        t.drawImage(this.rasterImage, i, e, u.LEFT | u.TOP);
      }
    }
  }
};
xt.prototype.processKeyCode = function (t) {
  if (this.currentGameMenu !== null && this.micro.gameCanvas !== null) {
    switch (this.micro.gameCanvas.getGameAction(t)) {
      case 1:
        this.currentGameMenu.processGameActionUp();
        return;
      case 2:
        this.currentGameMenu.processGameActionUpd(3);
        if (this.currentGameMenu === this.gameMenuHighscore && this.settingsStringLeague !== null) {
          --this.highscoreLeagueIndex;
          if (this.highscoreLeagueIndex < 0) this.highscoreLeagueIndex = 0;
          this.rebuildHighscoreMenu(this.highscoreLeagueIndex);
        }
        return;
      case 5:
        this.currentGameMenu.processGameActionUpd(2);
        if (this.currentGameMenu === this.gameMenuHighscore && this.settingsStringLeague !== null) {
          ++this.highscoreLeagueIndex;
          if (this.highscoreLeagueIndex > this.settingsStringLeague.getMaxAvailableOptionPos()) {
            this.highscoreLeagueIndex = this.settingsStringLeague.getMaxAvailableOptionPos();
          }
          this.rebuildHighscoreMenu(this.highscoreLeagueIndex);
        }
        return;
      case 6:
        this.currentGameMenu.processGameActionDown();
        return;
      case 8:
        this.currentGameMenu.processGameActionUpd(1);
        return;
      default:
        return;
    }
  }
};
xt.prototype.handleBackAction = function () {
  if (this.currentGameMenu !== null) {
    if (this.currentGameMenu === this.gameMenuIngame) {
      this.micro.menuToGame();
      return;
    }
    this.openMenu(this.currentGameMenu.getParentMenu(), true);
  }
};
xt.prototype.getCurrentMenu = function () {
  return this.currentGameMenu;
};
xt.prototype.openMenu = function (t, e) {
  if (this.micro.gameCanvas) {
    this.micro.gameCanvas.hideBackButton();
    if (t !== this.gameMenuMain && t !== this.gameMenuFinished && t !== null) {
      this.micro.gameCanvas.showBackButton();
    }
  }
  if (t === this.gameMenuHighscore) {
    if (this.settingsStringLeague !== null) {
      this.highscoreLeagueIndex = this.settingsStringLeague.getCurrentOptionPos();
      this.rebuildHighscoreMenu(this.highscoreLeagueIndex);
    }
  } else if (t === this.gameMenuFinished) {
    this.playerNameBytes = this.gameMenuEnterName ? this.gameMenuEnterName.getStrArr() : this.playerNameBytes;
    if (this.finishNameAction) this.finishNameAction.setText("Name - " + this.makeString(this.playerNameBytes));
  } else if (t === this.gameMenuPlay && this.settingStringLevel !== null && this.settingsStringTrack !== null && this.micro.levelLoader !== null) {
    this.settingsStringTrack.setOptionsList(this.micro.levelLoader.levelNames[this.settingStringLevel.getCurrentOptionPos()]);
    if (this.currentGameMenu === this.trackSelectionMenu) {
      this.selectedTrackByLevel[this.settingStringLevel.getCurrentOptionPos()] = this.settingsStringTrack.getCurrentOptionPos();
    }
    this.settingsStringTrack.setAvailableOptions(this.unlockedTracksByLevel[this.settingStringLevel.getCurrentOptionPos()]);
    this.settingsStringTrack.setCurrentOptionPos(this.selectedTrackByLevel[this.settingStringLevel.getCurrentOptionPos()]);
  }
  if (t === this.gameMenuMain || t === this.gameMenuPlay) {
    if (this.micro.gamePhysics) this.micro.gamePhysics.enableGenerateInputAI();
  }
  this.currentGameMenu = t;
  if (this.currentGameMenu !== null && !e) {
    this.currentGameMenu.selectFirstMenuItem();
  }
  this.isOpeningPauseMenu = false;
};
xt.prototype.rebuildHighscoreMenu = function (t) {
  if (
    this.gameMenuHighscore === null ||
    this.recordManager === null ||
    this.settingStringLevel === null ||
    this.settingsStringTrack === null ||
    this.settingsStringLeague === null ||
    this.micro.levelLoader === null ||
    this.settingStringBack === null
  ) return;
  this.gameMenuHighscore.clearVector();
  this.recordManager.openRecordStoreForTrack(this.settingStringLevel.getCurrentOptionPos(), this.settingsStringTrack.getCurrentOptionPos());
  this.gameMenuHighscore.addMenuElement(new A(this.micro.levelLoader.getName(this.settingStringLevel.getCurrentOptionPos(), this.settingsStringTrack.getCurrentOptionPos()), this.micro));
  this.gameMenuHighscore.addMenuElement(new A("LEAGUE: " + this.settingsStringLeague.getOptionsList()[t], this.micro));
  var e = this.recordManager.getRecordDescription(t);
  for (var i = 0; i < e.length; ++i) {
    if (e[i] !== "") {
      var s = new A("" + (i + 1) + "." + e[i], this.micro);
      s.setDx(f.spriteSizeX[5] + 1);
      if (i === 0) {
        s.setDrawSprite(true, 5);
      } else if (i === 1) {
        s.setDrawSprite(true, 6);
      } else if (i === 2) {
        s.setDrawSprite(true, 7);
      }
      this.gameMenuHighscore.addMenuElement(s);
    }
  }
  this.recordManager.closeRecordStore();
  if (e[0] === "") {
    this.gameMenuHighscore.addMenuElement(new A("No Highscores", this.micro));
  }
  this.gameMenuHighscore.addMenuElement(this.settingStringBack);
};
xt.prototype.saveAndClose = function () {
  if (this.isRecordStoreOpened) {
    this.persistState();
    try {
      if (this.recordStore) this.recordStore.closeRecordStore();
      this.isRecordStoreOpened = false;
    } catch (err) {}
  }
  this.currentGameMenu = null;
};
xt.prototype.persistState = function () {
  this.copyThreeBytesFromArr(16, this.playerNameBytes);
  this.setValue(0, this.perspectiveSetting ? this.perspectiveSetting.getCurrentOptionPos() : 0);
  this.setValue(1, this.shadowsSetting ? this.shadowsSetting.getCurrentOptionPos() : 0);
  this.setValue(2, this.driverSpriteSetting ? this.driverSpriteSetting.getCurrentOptionPos() : 0);
  this.setValue(3, this.bikeSpriteSetting ? this.bikeSpriteSetting.getCurrentOptionPos() : 0);
  this.setValue(14, this.inputSetting ? this.inputSetting.getCurrentOptionPos() : 0);
  this.setValue(4, this.lookAheadSetting ? this.lookAheadSetting.getCurrentOptionPos() : 0);
  this.setValue(5, this.settingsStringLeague ? this.settingsStringLeague.getMaxAvailableOptionPos() : 0);
  this.setValue(6, this.settingStringLevel ? this.settingStringLevel.getMaxAvailableOptionPos() : 0);
  this.setValue(10, this.settingStringLevel ? this.settingStringLevel.getCurrentOptionPos() : 0);
  this.setValue(11, this.settingsStringTrack ? this.settingsStringTrack.getCurrentOptionPos() : 0);
  this.setValue(12, this.settingsStringLeague ? this.settingsStringLeague.getCurrentOptionPos() : 0);
  for (var t = 0; t < 3; ++t) {
    this.setValue(7 + t, this.unlockedTracksByLevel[t]);
  }
  if (this.recordStore !== null) {
    if (this.recordStoreRecordId === -1) {
      try {
        this.recordStoreRecordId = this.recordStore.addRecord(this.persistedStateBuffer, 0, 19);
      } catch (err) {}
    } else {
      try {
        this.recordStore.setRecord(this.recordStoreRecordId, this.persistedStateBuffer, 0, 19);
      } catch (err) {}
    }
  }
};
xt.prototype.run = function () {};
xt.prototype.showAlert = function (t, e, i) {
  if (t !== "" && this.micro.gameCanvas) this.micro.gameCanvas.scheduleGameTimerTask(t, 2e3);
  if (window.console && console.info) console.info(e);
};
xt.prototype.handleMenuSelection = function (t) {
  if (t === this.taskStart) {
    if (
      this.settingStringLevel !== null &&
      this.settingsStringTrack !== null &&
      this.settingsStringLeague !== null &&
      this.settingStringLevel.getCurrentOptionPos() <= this.settingStringLevel.getMaxAvailableOptionPos() &&
      this.settingsStringTrack.getCurrentOptionPos() <= this.settingsStringTrack.getMaxAvailableOptionPos() &&
      this.settingsStringLeague.getCurrentOptionPos() <= this.settingsStringLeague.getMaxAvailableOptionPos()
    ) {
      if (this.micro.gamePhysics) this.micro.gamePhysics.disableGenerateInputAI();
      if (this.micro.levelLoader) this.micro.levelLoader.loadLevel(this.settingStringLevel.getCurrentOptionPos(), this.settingsStringTrack.getCurrentOptionPos());
      if (this.micro.gamePhysics) this.micro.gamePhysics.setMotoLeague(this.settingsStringLeague.getCurrentOptionPos());
      this.restartRequested = true;
      this.micro.menuToGame();
    } else {
      this.showAlert("GWTR", "Complete more tracks to unlock this track/league combo.", null);
    }
    return;
  }
  if (t === this.perspectiveSetting) {
    if (this.micro.gamePhysics) this.micro.gamePhysics.applyPerspectiveOffset(this.perspectiveSetting.getCurrentOptionPos() === 0);
    p.isEnabledPerspective = this.perspectiveSetting.getCurrentOptionPos() === 0;
    return;
  }
  if (t === this.shadowsSetting) {
    p.isEnabledShadows = this.shadowsSetting.getCurrentOptionPos() === 0;
    return;
  }
  if (t === this.driverSpriteSetting) {
    if (this.driverSpriteSetting.consumeSelectionMenuRequested()) {
      this.driverSpriteSetting.setCurrentOptionPos(this.driverSpriteSetting.getCurrentOptionPos() + 1);
    }
    return;
  }
  if (t === this.bikeSpriteSetting) {
    if (this.bikeSpriteSetting.consumeSelectionMenuRequested()) {
      this.bikeSpriteSetting.setCurrentOptionPos(this.bikeSpriteSetting.getCurrentOptionPos() + 1);
    }
    return;
  }
  if (t === this.inputSetting) {
    if (this.inputSetting.consumeSelectionMenuRequested()) {
      this.inputSetting.setCurrentOptionPos(this.inputSetting.getCurrentOptionPos() + 1);
    }
    if (this.micro.gameCanvas) this.micro.gameCanvas.setInputMode(this.inputSetting.getCurrentOptionPos());
    return;
  }
  if (t === this.lookAheadSetting) {
    if (this.micro.gamePhysics) this.micro.gamePhysics.setEnableLookAhead(this.lookAheadSetting.getCurrentOptionPos() === 0);
    return;
  }
  if (t === this.confirmYes) {
    if (this.currentGameMenu === this.gameMenuConfirmClear) {
      if (this.recordManager) this.recordManager.deleteRecordStores();
      this.showAlert("Cleared", "Highscores have been cleared", null);
    } else if (this.currentGameMenu === this.gameMenuConfirmReset) {
      this.exit();
      this.showAlert("Reset", "Master reset. Application will be closed.", null);
    }
    this.openMenu(this.currentGameMenu ? this.currentGameMenu.getParentMenu() : null, false);
    return;
  }
  if (t === this.confirmNo) {
    this.openMenu(this.currentGameMenu ? this.currentGameMenu.getParentMenu() : null, false);
    return;
  }
  if (t === this.settingStringBack) {
    this.openMenu(this.currentGameMenu ? this.currentGameMenu.getParentMenu() : null, true);
    return;
  }
  if (t === this.settingStringPlayMenu) {
    if (this.settingStringLevel !== null && this.settingsStringTrack !== null) {
      this.settingStringLevel.setCurrentOptionPos(this.resumeLevelIndex);
      this.settingsStringTrack.setAvailableOptions(this.unlockedTracksByLevel[this.resumeLevelIndex]);
      this.settingsStringTrack.setCurrentOptionPos(this.resumeTrackIndex);
    }
    this.openMenu(this.currentGameMenu ? this.currentGameMenu.getParentMenu() : null, false);
    return;
  }
  if (t === this.settingStringGoToMain) {
    this.openMenu(this.gameMenuMain, false);
    return;
  }
  if (t === this.settingStringExitGame) {
    this.openMenu(this.currentGameMenu ? this.currentGameMenu.getParentMenu() : null, false);
    return;
  }
  if (t === this.restartTrackAction) {
    if (
      this.settingsStringLeague !== null &&
      this.settingStringLevel !== null &&
      this.settingsStringTrack !== null &&
      this.settingsStringLeague.getCurrentOptionPos() <= this.settingsStringLeague.getMaxAvailableOptionPos()
    ) {
      this.settingStringLevel.setCurrentOptionPos(this.resumeLevelIndex);
      this.settingsStringTrack.setAvailableOptions(this.unlockedTracksByLevel[this.resumeLevelIndex]);
      this.settingsStringTrack.setCurrentOptionPos(this.resumeTrackIndex);
      if (this.micro.gamePhysics) this.micro.gamePhysics.setMotoLeague(this.settingsStringLeague.getCurrentOptionPos());
      this.restartRequested = true;
      this.micro.menuToGame();
    }
    return;
  }
  if (t === this.nextTrackAction) {
    if (!this.completedLastTrack && this.settingsStringTrack) {
      this.settingsStringTrack.menuElemMethod(2);
    }
    if (this.settingStringLevel !== null && this.settingsStringTrack !== null && this.settingsStringLeague !== null) {
      if (this.micro.levelLoader) this.micro.levelLoader.loadLevel(this.settingStringLevel.getCurrentOptionPos(), this.settingsStringTrack.getCurrentOptionPos());
      if (this.micro.gamePhysics) this.micro.gamePhysics.setMotoLeague(this.settingsStringLeague.getCurrentOptionPos());
      this.persistState();
      this.restartRequested = true;
      this.micro.menuToGame();
    }
    return;
  }
  if (t === this.settingStringContinue) {
    this.repaint();
    this.micro.menuToGame();
    return;
  }
  if (t === this.finishNameAction) {
    if (this.gameMenuEnterName) this.gameMenuEnterName.selectFirstMenuItem();
    this.openMenu(this.gameMenuEnterName, false);
    return;
  }
  if (t === this.finishOkAction) {
    this.finalizeFinishedMenu();
    return;
  }
  if (t === this.settingsStringTrack) {
    if (this.settingsStringTrack.consumeSelectionMenuRequested()) {
      this.settingsStringTrack.setAvailableOptions(this.unlockedTracksByLevel[this.settingStringLevel ? this.settingStringLevel.getCurrentOptionPos() : 0]);
      this.settingsStringTrack.init();
      this.trackSelectionMenu = this.settingsStringTrack.getCurrentMenu();
      this.openMenu(this.trackSelectionMenu, false);
      if (this.trackSelectionMenu) this.trackSelectionMenu.scrollToSelection(this.settingsStringTrack.getCurrentOptionPos());
    }
    if (this.settingStringLevel !== null) {
      this.selectedTrackByLevel[this.settingStringLevel.getCurrentOptionPos()] = this.settingsStringTrack.getCurrentOptionPos();
    }
    return;
  }
  if (t === this.settingStringLevel) {
    if (this.settingStringLevel.consumeSelectionMenuRequested()) {
      this.gameMenuStringLevel = this.settingStringLevel.getCurrentMenu();
      this.openMenu(this.gameMenuStringLevel, false);
      if (this.gameMenuStringLevel) this.gameMenuStringLevel.scrollToSelection(this.settingStringLevel.getCurrentOptionPos());
    }
    if (this.micro.levelLoader !== null && this.settingsStringTrack !== null) {
      this.settingsStringTrack.setOptionsList(this.micro.levelLoader.levelNames[this.settingStringLevel.getCurrentOptionPos()]);
      this.settingsStringTrack.setAvailableOptions(this.unlockedTracksByLevel[this.settingStringLevel.getCurrentOptionPos()]);
      this.settingsStringTrack.setCurrentOptionPos(this.selectedTrackByLevel[this.settingStringLevel.getCurrentOptionPos()]);
      this.settingsStringTrack.init();
    }
    return;
  }
  if (t === this.settingsStringLeague && this.settingsStringLeague.consumeSelectionMenuRequested()) {
    this.gameMenuLeague = this.settingsStringLeague.getCurrentMenu();
    this.settingsStringLeague.setParentGameMenu(this.currentGameMenu);
    this.openMenu(this.gameMenuLeague, false);
    if (this.gameMenuLeague) this.gameMenuLeague.scrollToSelection(this.settingsStringLeague.getCurrentOptionPos());
  }
};
xt.prototype.getLoadedSpriteFlags = function () {
  var t = 0;
  if ((this.driverSpriteSetting ? this.driverSpriteSetting.getCurrentOptionPos() : 1) === 0) t |= 2;
  if ((this.bikeSpriteSetting ? this.bikeSpriteSetting.getCurrentOptionPos() : 1) === 0) t |= 1;
  return t;
};
xt.prototype.applyLoadedSpriteFlags = function (t) {
  if (this.bikeSpriteSetting) this.bikeSpriteSetting.setCurrentOptionPos(1);
  if (this.driverSpriteSetting) this.driverSpriteSetting.setCurrentOptionPos(1);
  if ((t & 1) > 0 && this.bikeSpriteSetting) this.bikeSpriteSetting.setCurrentOptionPos(0);
  if ((t & 2) > 0 && this.driverSpriteSetting) this.driverSpriteSetting.setCurrentOptionPos(0);
};
xt.prototype.getSelectedLevel = function () {
  return this.settingStringLevel ? this.settingStringLevel.getCurrentOptionPos() : 0;
};
xt.prototype.getSelectedTrack = function () {
  return this.settingsStringTrack ? this.settingsStringTrack.getCurrentOptionPos() : 0;
};
xt.prototype.getSelectedLeague = function () {
  return this.settingsStringLeague ? this.settingsStringLeague.getCurrentOptionPos() : 0;
};
xt.prototype.setFinishTime = function (t) {
  this.lastFinishTime = t;
};
xt.prototype.readStoredNameBytes = function (t, e) {
  switch (t) {
    case 16:
      var i = new Int8Array(3);
      for (var s = 0; s < 3; ++s) i[s] = this.persistedStateBuffer[16 + s];
      if (i[0] === -127) i[0] = e;
      return i;
    default:
      return new Int8Array(0);
  }
};
xt.prototype.readStoredValue = function (t, e) {
  return this.persistedStateBuffer[t] === -127 ? e : this.persistedStateBuffer[t];
};
xt.prototype.copyThreeBytesFromArr = function (t, e) {
  if (this.isRecordStoreOpened && t === 16) {
    for (var i = 0; i < 3; ++i) this.persistedStateBuffer[16 + i] = e[i];
  }
};
xt.prototype.timeToString = function (t) {
  this.lastFinishSeconds = mathTrunc(t / 100);
  this.lastFinishCentiseconds = mathTrunc(t % 100);
  var e = this.lastFinishSeconds / 60 < 10 ? " 0" + mathTrunc(this.lastFinishSeconds / 60) : " " + mathTrunc(this.lastFinishSeconds / 60);
  if (this.lastFinishSeconds % 60 < 10) {
    e += ":0" + (this.lastFinishSeconds % 60);
  } else {
    e += ":" + (this.lastFinishSeconds % 60);
  }
  if (this.lastFinishCentiseconds < 10) {
    e += ".0" + this.lastFinishCentiseconds;
  } else {
    e += "." + this.lastFinishCentiseconds;
  }
  return e;
};
xt.prototype.setValue = function (t, e) {
  if (this.isRecordStoreOpened) this.persistedStateBuffer[t] = e;
};
xt.prototype.exit = function () {
  if (this.perspectiveSetting) this.perspectiveSetting.setCurrentOptionPos(0);
  if (this.shadowsSetting) this.shadowsSetting.setCurrentOptionPos(0);
  if (this.driverSpriteSetting) this.driverSpriteSetting.setCurrentOptionPos(0);
  if (this.bikeSpriteSetting) this.bikeSpriteSetting.setCurrentOptionPos(0);
  if (this.lookAheadSetting) this.lookAheadSetting.setCurrentOptionPos(0);
  if (this.settingsStringLeague) {
    this.settingsStringLeague.setCurrentOptionPos(0);
    this.settingsStringLeague.setAvailableOptions(0);
  }
  if (this.settingStringLevel) {
    this.settingStringLevel.setCurrentOptionPos(0);
    this.settingStringLevel.setAvailableOptions(1);
  }
  if (this.settingsStringTrack) this.settingsStringTrack.setCurrentOptionPos(0);
  this.playerNameBytes[0] = 65;
  this.playerNameBytes[1] = 65;
  this.playerNameBytes[2] = 65;
  if (this.inputSetting) this.inputSetting.setCurrentOptionPos(0);
  this.unlockedTracksByLevel[0] = 0;
  this.unlockedTracksByLevel[1] = 0;
  this.unlockedTracksByLevel[2] = -1;
  this.availableLeagues = 0;
  this.persistState();
  if (this.recordManager) this.recordManager.deleteRecordStores();
};
xt.prototype.getCountOfRecordStoresWithPrefix = function (t) {
  var e = H.listRecordStores();
  if (this.recordManager !== null && e.length !== 0) {
    var i = 0;
    for (var s = 0; s < e.length; ++s) {
      if (e[s].indexOf(String(t)) === 0) ++i;
    }
    return i;
  }
  return 0;
};
xt.prototype.makeString = function (t) {
  return String.fromCharCode(t[0], t[1], t[2]);
};

var bt = "assets/levels-BRYBkAPq.mrg";

function wt(S) {
  S.className = "app-root";
  var t = document.createElement("canvas");
  t.className = "game-canvas";
  while (S.firstChild) {
    S.removeChild(S.firstChild);
  }
  S.appendChild(t);
  var e = new O();
  O.isGameVisible = true;
  
  return p.create(bt).then(function (i) {
    var s = new h(i);
    return f.create(t, e).then(function (n) {
      var r = new xt(e);
      e.levelLoader = i;
      e.gamePhysics = s;
      e.gameCanvas = n;
      e.menuManager = r;
      n.init(s);
      for (var m = 1; m <= 7; ++m) {
        r.initPart(m);
      }
      n.setMenuManager(r);
      return n.loadSprites(r.getLoadedSpriteFlags()).then(function (loadedSpriteFlags) {
        var o = {
          loadedSpriteFlags: loadedSpriteFlags,
          lastOuterStepMs: window.performance && window.performance.now ? window.performance.now() : Date.now(),
          outerAccumulatorMs: 0,
          lastMenuStepMs: window.performance && window.performance.now ? window.performance.now() : Date.now(),
          isGoalLoopActive: false,
          goalLoopEndMs: 0,
          lastGoalLoopStepMs: 0,
          forcedRestartMs: 0,
          wasInGameMenu: false
        };
        s.applyLoadedSpriteFlags(o.loadedSpriteFlags);
        r.applyLoadedSpriteFlags(o.loadedSpriteFlags);
        s.setMode(1);
        
        function l() {
          var rect = S.getBoundingClientRect();
          var M = Math.floor(rect.width);
          var k = Math.floor(rect.height);
          if (M <= 0 || k <= 0) {
            M = window.innerWidth;
            k = window.innerHeight;
          }
          if (window.visualViewport !== undefined && window.visualViewport !== null) {
            M = Math.max(M, Math.floor(window.visualViewport.width));
            k = Math.max(k, Math.floor(window.visualViewport.height));
          }
          n.resize(M, k);
          s.setMinimalScreenWH(M < k ? M : k);
        }
        
        function c() {
          n.paint(n.getGraphics());
        }
        n.setRepaintHandler(c);
        
        function d(m) {
          s.resetSmth(true);
          e.timeMs = 0;
          e.gameTimeMs = 0;
          e.crashRestartDeadlineMs = 0;
          e.isTimerRunning = false;
          o.goalLoopEndMs = 0;
          o.isGoalLoopActive = false;
          o.lastGoalLoopStepMs = 0;
          o.forcedRestartMs = 0;
          if (m) {
            n.scheduleGameTimerTask(i.getName(r.getCurrentLevel(), r.getCurrentTrack()), 3e3);
          }
          n.resetInputState();
        }
        
        function g() {
          r.setFinishTime(e.gameTimeMs / 10);
          r.showMenuScreen(2);
        }
        
        function F(m) {
          o.goalLoopEndMs = m + 1e3;
          o.isGoalLoopActive = true;
          o.lastGoalLoopStepMs = m;
          n.scheduleGameTimerTask(s.isTrackFinished ? "Finished" : "Wheelie!", 1e3);
        }
        
        function T() {
          var m = r.getLoadedSpriteFlags();
          if (s.getLoadedSpriteFlags() !== m) {
            n.loadSprites(m).then(function (M) {
              s.applyLoadedSpriteFlags(M);
              r.applyLoadedSpriteFlags(M);
              o.loadedSpriteFlags = M;
            });
          }
        }
        
        function b(m) {
          T();
          if (o.forcedRestartMs !== 0) {
            if (m >= o.forcedRestartMs) d(true);
            return;
          }
          for (var M = e.numPhysicsLoops; M > 0; --M) {
            if (e.isTimerRunning) e.gameTimeMs += 20;
            if (e.timeMs === 0) e.timeMs = Date.now();
            var k = s.updatePhysics();
            if (k === 3 && e.crashRestartDeadlineMs === 0) {
              e.crashRestartDeadlineMs = Date.now() + 3e3;
              n.scheduleGameTimerTask("Crashed", 3e3);
              n.repaint();
              n.serviceRepaints();
            }
            if (e.crashRestartDeadlineMs !== 0 && e.crashRestartDeadlineMs < Date.now()) {
              d(true);
              return;
            }
            if (k === 5) {
              n.scheduleGameTimerTask("Crashed", 3e3);
              n.repaint();
              n.serviceRepaints();
              var V = 1e3;
              if (e.crashRestartDeadlineMs > 0) {
                V = Math.min(e.crashRestartDeadlineMs - Date.now(), 1e3);
              }
              if (V < 0) V = 0;
              o.forcedRestartMs = m + V;
              return;
            }
            if (k === 4) {
              e.timeMs = 0;
              e.gameTimeMs = 0;
            } else if (k === 1 || k === 2) {
              if (k === 2) e.gameTimeMs -= 10;
              F(m);
              e.isTimerRunning = true;
              return;
            }
            e.isTimerRunning = k !== 4;
          }
          s.syncRenderStateFromSimulation();
        }
        
        function I(m) {
          if (o.isGoalLoopActive) {
            if (m >= o.goalLoopEndMs) {
              o.isGoalLoopActive = false;
              g();
              return;
            }
            for (; m - o.lastGoalLoopStepMs >= 30; ) {
              for (var M = e.numPhysicsLoops; M > 0; --M) {
                if (s.updatePhysics() === 5) {
                  o.isGoalLoopActive = false;
                  o.goalLoopEndMs = m;
                  g();
                  return;
                }
              }
              s.syncRenderStateFromSimulation();
              o.lastGoalLoopStepMs += 30;
            }
          }
        }
        
        function L(m) {
          if (O.isInGameMenu) {
            for (; m - o.lastMenuStepMs >= 50; ) {
              if (s.isGenerateInputAI) {
                var M = s.updatePhysics();
                if (M !== 0 && M !== 4) s.resetSmth(true);
                s.syncRenderStateFromSimulation();
              }
              o.lastMenuStepMs += 50;
              if (!s.isGenerateInputAI) break;
            }
          }
        }
        
        l();
        n.requestRepaint(0);
        d(false);
        r.showMenuScreen(0);
        
        function R(m) {
          if (O.isInGameMenu && !o.wasInGameMenu) {
            o.lastMenuStepMs = m;
          }
          if (O.isInGameMenu && !o.wasInGameMenu && r.isOpeningPauseMenu) {
            r.showMenuScreen(1);
          }
          if (O.isInGameMenu) {
            L(m);
            c();
            o.wasInGameMenu = true;
            requestAnimationFrame(R);
            return;
          }
          if (o.wasInGameMenu) {
            o.lastOuterStepMs = m;
            o.outerAccumulatorMs = 0;
          }
          o.wasInGameMenu = false;
          if (r.consumeRestartRequested()) d(true);
          if (o.isGoalLoopActive) {
            I(m);
            c();
            requestAnimationFrame(R);
            return;
          }
          o.outerAccumulatorMs += m - o.lastOuterStepMs;
          o.lastOuterStepMs = m;
          for (; o.outerAccumulatorMs >= 30; ) {
            b(m);
            o.outerAccumulatorMs -= 30;
            if (O.isInGameMenu || o.isGoalLoopActive) break;
          }
          if (r.consumeRestartRequested()) d(true);
          c();
          requestAnimationFrame(R);
        }
        
        var x = function () {
          l();
          c();
        };
        
        if (typeof ResizeObserver !== "undefined") {
          new ResizeObserver(function () {
            x();
          }).observe(S);
        }
        window.addEventListener("resize", x);
        if (window.visualViewport) window.visualViewport.addEventListener("resize", x);
        
        window.addEventListener("keydown", function (m) {
          var M = false;
          var k = ht(m.code);
          if (m.code === "Escape") {
            if (O.isInGameMenu) {
              n.handleBackAction();
              M = true;
            } else if (n.hasMenuButton()) {
              n.openPauseMenu();
              M = true;
            }
          }
          if (k !== null) {
            n.keyPressed(k);
            M = true;
          }
          if (M) {
            m.preventDefault();
            c();
          }
        });
        
        window.addEventListener("keyup", function (m) {
          var M = ht(m.code);
          if (M !== null) {
            n.keyReleased(M);
            m.preventDefault();
          }
        });
        
        requestAnimationFrame(R);
      });
    });
  });
}

function ht(S) {
  switch (S) {
    case "ArrowUp": return 1;
    case "ArrowLeft": return 2;
    case "ArrowRight": return 5;
    case "ArrowDown": return 6;
    case "Space":
    case "Enter":
    case "NumpadEnter": return 8;
    case "Digit0": return 48;
    case "Digit1": return 49;
    case "Digit2": return 50;
    case "Digit3": return 51;
    case "Digit4": return 52;
    case "Digit5": return 53;
    case "Digit6": return 54;
    case "Digit7": return 55;
    case "Digit8": return 56;
    case "Digit9": return 57;
    default: return null;
  }
}

var st = document.getElementById("root");
if (!st) throw new Error("Missing #root container");

wt(st)["catch"](function (S) {
  var t = document.createElement("pre");
  t.className = "error-view";
  t.textContent = S instanceof Error ? (S.stack ? S.stack : S.message) : String(S);
  while (st.firstChild) {
    st.removeChild(st.firstChild);
  }
  st.appendChild(t);
});