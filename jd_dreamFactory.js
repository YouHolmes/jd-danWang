
// prettier-ignore
!function (t, r) { "object" == typeof exports ? module.exports = exports = r() : "function" == typeof define && define.amd ? define([], r) : t.CryptoJS = r() }(this, function () {
  var t = t || function (t, r) { var e = Object.create || function () { function t() { } return function (r) { var e; return t.prototype = r, e = new t, t.prototype = null, e } }(), i = {}, n = i.lib = {}, o = n.Base = function () { return { extend: function (t) { var r = e(this); return t && r.mixIn(t), r.hasOwnProperty("init") && this.init !== r.init || (r.init = function () { r.$super.init.apply(this, arguments) }), r.init.prototype = r, r.$super = this, r }, create: function () { var t = this.extend(); return t.init.apply(t, arguments), t }, init: function () { }, mixIn: function (t) { for (var r in t) t.hasOwnProperty(r) && (this[r] = t[r]); t.hasOwnProperty("toString") && (this.toString = t.toString) }, clone: function () { return this.init.prototype.extend(this) } } }(), s = n.WordArray = o.extend({ init: function (t, e) { t = this.words = t || [], e != r ? this.sigBytes = e : this.sigBytes = 4 * t.length }, toString: function (t) { return (t || c).stringify(this) }, concat: function (t) { var r = this.words, e = t.words, i = this.sigBytes, n = t.sigBytes; if (this.clamp(), i % 4) for (var o = 0; o < n; o++) { var s = e[o >>> 2] >>> 24 - o % 4 * 8 & 255; r[i + o >>> 2] |= s << 24 - (i + o) % 4 * 8 } else for (var o = 0; o < n; o += 4)r[i + o >>> 2] = e[o >>> 2]; return this.sigBytes += n, this }, clamp: function () { var r = this.words, e = this.sigBytes; r[e >>> 2] &= 4294967295 << 32 - e % 4 * 8, r.length = t.ceil(e / 4) }, clone: function () { var t = o.clone.call(this); return t.words = this.words.slice(0), t }, random: function (r) { for (var e, i = [], n = function (r) { var r = r, e = 987654321, i = 4294967295; return function () { e = 36969 * (65535 & e) + (e >> 16) & i, r = 18e3 * (65535 & r) + (r >> 16) & i; var n = (e << 16) + r & i; return n /= 4294967296, n += .5, n * (t.random() > .5 ? 1 : -1) } }, o = 0; o < r; o += 4) { var a = n(4294967296 * (e || t.random())); e = 987654071 * a(), i.push(4294967296 * a() | 0) } return new s.init(i, r) } }), a = i.enc = {}, c = a.Hex = { stringify: function (t) { for (var r = t.words, e = t.sigBytes, i = [], n = 0; n < e; n++) { var o = r[n >>> 2] >>> 24 - n % 4 * 8 & 255; i.push((o >>> 4).toString(16)), i.push((15 & o).toString(16)) } return i.join("") }, parse: function (t) { for (var r = t.length, e = [], i = 0; i < r; i += 2)e[i >>> 3] |= parseInt(t.substr(i, 2), 16) << 24 - i % 8 * 4; return new s.init(e, r / 2) } }, h = a.Latin1 = { stringify: function (t) { for (var r = t.words, e = t.sigBytes, i = [], n = 0; n < e; n++) { var o = r[n >>> 2] >>> 24 - n % 4 * 8 & 255; i.push(String.fromCharCode(o)) } return i.join("") }, parse: function (t) { for (var r = t.length, e = [], i = 0; i < r; i++)e[i >>> 2] |= (255 & t.charCodeAt(i)) << 24 - i % 4 * 8; return new s.init(e, r) } }, l = a.Utf8 = { stringify: function (t) { try { return decodeURIComponent(escape(h.stringify(t))) } catch (t) { throw new Error("Malformed UTF-8 data") } }, parse: function (t) { return h.parse(unescape(encodeURIComponent(t))) } }, f = n.BufferedBlockAlgorithm = o.extend({ reset: function () { this._data = new s.init, this._nDataBytes = 0 }, _append: function (t) { "string" == typeof t && (t = l.parse(t)), this._data.concat(t), this._nDataBytes += t.sigBytes }, _process: function (r) { var e = this._data, i = e.words, n = e.sigBytes, o = this.blockSize, a = 4 * o, c = n / a; c = r ? t.ceil(c) : t.max((0 | c) - this._minBufferSize, 0); var h = c * o, l = t.min(4 * h, n); if (h) { for (var f = 0; f < h; f += o)this._doProcessBlock(i, f); var u = i.splice(0, h); e.sigBytes -= l } return new s.init(u, l) }, clone: function () { var t = o.clone.call(this); return t._data = this._data.clone(), t }, _minBufferSize: 0 }), u = (n.Hasher = f.extend({ cfg: o.extend(), init: function (t) { this.cfg = this.cfg.extend(t), this.reset() }, reset: function () { f.reset.call(this), this._doReset() }, update: function (t) { return this._append(t), this._process(), this }, finalize: function (t) { t && this._append(t); var r = this._doFinalize(); return r }, blockSize: 16, _createHelper: function (t) { return function (r, e) { return new t.init(e).finalize(r) } }, _createHmacHelper: function (t) { return function (r, e) { return new u.HMAC.init(t, e).finalize(r) } } }), i.algo = {}); return i }(Math); return function () { function r(t, r, e) { for (var i = [], o = 0, s = 0; s < r; s++)if (s % 4) { var a = e[t.charCodeAt(s - 1)] << s % 4 * 2, c = e[t.charCodeAt(s)] >>> 6 - s % 4 * 2; i[o >>> 2] |= (a | c) << 24 - o % 4 * 8, o++ } return n.create(i, o) } var e = t, i = e.lib, n = i.WordArray, o = e.enc; o.Base64 = { stringify: function (t) { var r = t.words, e = t.sigBytes, i = this._map; t.clamp(); for (var n = [], o = 0; o < e; o += 3)for (var s = r[o >>> 2] >>> 24 - o % 4 * 8 & 255, a = r[o + 1 >>> 2] >>> 24 - (o + 1) % 4 * 8 & 255, c = r[o + 2 >>> 2] >>> 24 - (o + 2) % 4 * 8 & 255, h = s << 16 | a << 8 | c, l = 0; l < 4 && o + .75 * l < e; l++)n.push(i.charAt(h >>> 6 * (3 - l) & 63)); var f = i.charAt(64); if (f) for (; n.length % 4;)n.push(f); return n.join("") }, parse: function (t) { var e = t.length, i = this._map, n = this._reverseMap; if (!n) { n = this._reverseMap = []; for (var o = 0; o < i.length; o++)n[i.charCodeAt(o)] = o } var s = i.charAt(64); if (s) { var a = t.indexOf(s); a !== -1 && (e = a) } return r(t, e, n) }, _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=" } }(), function (r) { function e(t, r, e, i, n, o, s) { var a = t + (r & e | ~r & i) + n + s; return (a << o | a >>> 32 - o) + r } function i(t, r, e, i, n, o, s) { var a = t + (r & i | e & ~i) + n + s; return (a << o | a >>> 32 - o) + r } function n(t, r, e, i, n, o, s) { var a = t + (r ^ e ^ i) + n + s; return (a << o | a >>> 32 - o) + r } function o(t, r, e, i, n, o, s) { var a = t + (e ^ (r | ~i)) + n + s; return (a << o | a >>> 32 - o) + r } var s = t, a = s.lib, c = a.WordArray, h = a.Hasher, l = s.algo, f = []; !function () { for (var t = 0; t < 64; t++)f[t] = 4294967296 * r.abs(r.sin(t + 1)) | 0 }(); var u = l.MD5 = h.extend({ _doReset: function () { this._hash = new c.init([1732584193, 4023233417, 2562383102, 271733878]) }, _doProcessBlock: function (t, r) { for (var s = 0; s < 16; s++) { var a = r + s, c = t[a]; t[a] = 16711935 & (c << 8 | c >>> 24) | 4278255360 & (c << 24 | c >>> 8) } var h = this._hash.words, l = t[r + 0], u = t[r + 1], d = t[r + 2], v = t[r + 3], p = t[r + 4], _ = t[r + 5], y = t[r + 6], g = t[r + 7], B = t[r + 8], w = t[r + 9], k = t[r + 10], S = t[r + 11], m = t[r + 12], x = t[r + 13], b = t[r + 14], H = t[r + 15], z = h[0], A = h[1], C = h[2], D = h[3]; z = e(z, A, C, D, l, 7, f[0]), D = e(D, z, A, C, u, 12, f[1]), C = e(C, D, z, A, d, 17, f[2]), A = e(A, C, D, z, v, 22, f[3]), z = e(z, A, C, D, p, 7, f[4]), D = e(D, z, A, C, _, 12, f[5]), C = e(C, D, z, A, y, 17, f[6]), A = e(A, C, D, z, g, 22, f[7]), z = e(z, A, C, D, B, 7, f[8]), D = e(D, z, A, C, w, 12, f[9]), C = e(C, D, z, A, k, 17, f[10]), A = e(A, C, D, z, S, 22, f[11]), z = e(z, A, C, D, m, 7, f[12]), D = e(D, z, A, C, x, 12, f[13]), C = e(C, D, z, A, b, 17, f[14]), A = e(A, C, D, z, H, 22, f[15]), z = i(z, A, C, D, u, 5, f[16]), D = i(D, z, A, C, y, 9, f[17]), C = i(C, D, z, A, S, 14, f[18]), A = i(A, C, D, z, l, 20, f[19]), z = i(z, A, C, D, _, 5, f[20]), D = i(D, z, A, C, k, 9, f[21]), C = i(C, D, z, A, H, 14, f[22]), A = i(A, C, D, z, p, 20, f[23]), z = i(z, A, C, D, w, 5, f[24]), D = i(D, z, A, C, b, 9, f[25]), C = i(C, D, z, A, v, 14, f[26]), A = i(A, C, D, z, B, 20, f[27]), z = i(z, A, C, D, x, 5, f[28]), D = i(D, z, A, C, d, 9, f[29]), C = i(C, D, z, A, g, 14, f[30]), A = i(A, C, D, z, m, 20, f[31]), z = n(z, A, C, D, _, 4, f[32]), D = n(D, z, A, C, B, 11, f[33]), C = n(C, D, z, A, S, 16, f[34]), A = n(A, C, D, z, b, 23, f[35]), z = n(z, A, C, D, u, 4, f[36]), D = n(D, z, A, C, p, 11, f[37]), C = n(C, D, z, A, g, 16, f[38]), A = n(A, C, D, z, k, 23, f[39]), z = n(z, A, C, D, x, 4, f[40]), D = n(D, z, A, C, l, 11, f[41]), C = n(C, D, z, A, v, 16, f[42]), A = n(A, C, D, z, y, 23, f[43]), z = n(z, A, C, D, w, 4, f[44]), D = n(D, z, A, C, m, 11, f[45]), C = n(C, D, z, A, H, 16, f[46]), A = n(A, C, D, z, d, 23, f[47]), z = o(z, A, C, D, l, 6, f[48]), D = o(D, z, A, C, g, 10, f[49]), C = o(C, D, z, A, b, 15, f[50]), A = o(A, C, D, z, _, 21, f[51]), z = o(z, A, C, D, m, 6, f[52]), D = o(D, z, A, C, v, 10, f[53]), C = o(C, D, z, A, k, 15, f[54]), A = o(A, C, D, z, u, 21, f[55]), z = o(z, A, C, D, B, 6, f[56]), D = o(D, z, A, C, H, 10, f[57]), C = o(C, D, z, A, y, 15, f[58]), A = o(A, C, D, z, x, 21, f[59]), z = o(z, A, C, D, p, 6, f[60]), D = o(D, z, A, C, S, 10, f[61]), C = o(C, D, z, A, d, 15, f[62]), A = o(A, C, D, z, w, 21, f[63]), h[0] = h[0] + z | 0, h[1] = h[1] + A | 0, h[2] = h[2] + C | 0, h[3] = h[3] + D | 0 }, _doFinalize: function () { var t = this._data, e = t.words, i = 8 * this._nDataBytes, n = 8 * t.sigBytes; e[n >>> 5] |= 128 << 24 - n % 32; var o = r.floor(i / 4294967296), s = i; e[(n + 64 >>> 9 << 4) + 15] = 16711935 & (o << 8 | o >>> 24) | 4278255360 & (o << 24 | o >>> 8), e[(n + 64 >>> 9 << 4) + 14] = 16711935 & (s << 8 | s >>> 24) | 4278255360 & (s << 24 | s >>> 8), t.sigBytes = 4 * (e.length + 1), this._process(); for (var a = this._hash, c = a.words, h = 0; h < 4; h++) { var l = c[h]; c[h] = 16711935 & (l << 8 | l >>> 24) | 4278255360 & (l << 24 | l >>> 8) } return a }, clone: function () { var t = h.clone.call(this); return t._hash = this._hash.clone(), t } }); s.MD5 = h._createHelper(u), s.HmacMD5 = h._createHmacHelper(u) }(Math), function () { var r = t, e = r.lib, i = e.WordArray, n = e.Hasher, o = r.algo, s = [], a = o.SHA1 = n.extend({ _doReset: function () { this._hash = new i.init([1732584193, 4023233417, 2562383102, 271733878, 3285377520]) }, _doProcessBlock: function (t, r) { for (var e = this._hash.words, i = e[0], n = e[1], o = e[2], a = e[3], c = e[4], h = 0; h < 80; h++) { if (h < 16) s[h] = 0 | t[r + h]; else { var l = s[h - 3] ^ s[h - 8] ^ s[h - 14] ^ s[h - 16]; s[h] = l << 1 | l >>> 31 } var f = (i << 5 | i >>> 27) + c + s[h]; f += h < 20 ? (n & o | ~n & a) + 1518500249 : h < 40 ? (n ^ o ^ a) + 1859775393 : h < 60 ? (n & o | n & a | o & a) - 1894007588 : (n ^ o ^ a) - 899497514, c = a, a = o, o = n << 30 | n >>> 2, n = i, i = f } e[0] = e[0] + i | 0, e[1] = e[1] + n | 0, e[2] = e[2] + o | 0, e[3] = e[3] + a | 0, e[4] = e[4] + c | 0 }, _doFinalize: function () { var t = this._data, r = t.words, e = 8 * this._nDataBytes, i = 8 * t.sigBytes; return r[i >>> 5] |= 128 << 24 - i % 32, r[(i + 64 >>> 9 << 4) + 14] = Math.floor(e / 4294967296), r[(i + 64 >>> 9 << 4) + 15] = e, t.sigBytes = 4 * r.length, this._process(), this._hash }, clone: function () { var t = n.clone.call(this); return t._hash = this._hash.clone(), t } }); r.SHA1 = n._createHelper(a), r.HmacSHA1 = n._createHmacHelper(a) }(), function (r) { var e = t, i = e.lib, n = i.WordArray, o = i.Hasher, s = e.algo, a = [], c = []; !function () { function t(t) { for (var e = r.sqrt(t), i = 2; i <= e; i++)if (!(t % i)) return !1; return !0 } function e(t) { return 4294967296 * (t - (0 | t)) | 0 } for (var i = 2, n = 0; n < 64;)t(i) && (n < 8 && (a[n] = e(r.pow(i, .5))), c[n] = e(r.pow(i, 1 / 3)), n++), i++ }(); var h = [], l = s.SHA256 = o.extend({ _doReset: function () { this._hash = new n.init(a.slice(0)) }, _doProcessBlock: function (t, r) { for (var e = this._hash.words, i = e[0], n = e[1], o = e[2], s = e[3], a = e[4], l = e[5], f = e[6], u = e[7], d = 0; d < 64; d++) { if (d < 16) h[d] = 0 | t[r + d]; else { var v = h[d - 15], p = (v << 25 | v >>> 7) ^ (v << 14 | v >>> 18) ^ v >>> 3, _ = h[d - 2], y = (_ << 15 | _ >>> 17) ^ (_ << 13 | _ >>> 19) ^ _ >>> 10; h[d] = p + h[d - 7] + y + h[d - 16] } var g = a & l ^ ~a & f, B = i & n ^ i & o ^ n & o, w = (i << 30 | i >>> 2) ^ (i << 19 | i >>> 13) ^ (i << 10 | i >>> 22), k = (a << 26 | a >>> 6) ^ (a << 21 | a >>> 11) ^ (a << 7 | a >>> 25), S = u + k + g + c[d] + h[d], m = w + B; u = f, f = l, l = a, a = s + S | 0, s = o, o = n, n = i, i = S + m | 0 } e[0] = e[0] + i | 0, e[1] = e[1] + n | 0, e[2] = e[2] + o | 0, e[3] = e[3] + s | 0, e[4] = e[4] + a | 0, e[5] = e[5] + l | 0, e[6] = e[6] + f | 0, e[7] = e[7] + u | 0 }, _doFinalize: function () { var t = this._data, e = t.words, i = 8 * this._nDataBytes, n = 8 * t.sigBytes; return e[n >>> 5] |= 128 << 24 - n % 32, e[(n + 64 >>> 9 << 4) + 14] = r.floor(i / 4294967296), e[(n + 64 >>> 9 << 4) + 15] = i, t.sigBytes = 4 * e.length, this._process(), this._hash }, clone: function () { var t = o.clone.call(this); return t._hash = this._hash.clone(), t } }); e.SHA256 = o._createHelper(l), e.HmacSHA256 = o._createHmacHelper(l) }(Math), function () { function r(t) { return t << 8 & 4278255360 | t >>> 8 & 16711935 } var e = t, i = e.lib, n = i.WordArray, o = e.enc; o.Utf16 = o.Utf16BE = { stringify: function (t) { for (var r = t.words, e = t.sigBytes, i = [], n = 0; n < e; n += 2) { var o = r[n >>> 2] >>> 16 - n % 4 * 8 & 65535; i.push(String.fromCharCode(o)) } return i.join("") }, parse: function (t) { for (var r = t.length, e = [], i = 0; i < r; i++)e[i >>> 1] |= t.charCodeAt(i) << 16 - i % 2 * 16; return n.create(e, 2 * r) } }; o.Utf16LE = { stringify: function (t) { for (var e = t.words, i = t.sigBytes, n = [], o = 0; o < i; o += 2) { var s = r(e[o >>> 2] >>> 16 - o % 4 * 8 & 65535); n.push(String.fromCharCode(s)) } return n.join("") }, parse: function (t) { for (var e = t.length, i = [], o = 0; o < e; o++)i[o >>> 1] |= r(t.charCodeAt(o) << 16 - o % 2 * 16); return n.create(i, 2 * e) } } }(), function () { if ("function" == typeof ArrayBuffer) { var r = t, e = r.lib, i = e.WordArray, n = i.init, o = i.init = function (t) { if (t instanceof ArrayBuffer && (t = new Uint8Array(t)), (t instanceof Int8Array || "undefined" != typeof Uint8ClampedArray && t instanceof Uint8ClampedArray || t instanceof Int16Array || t instanceof Uint16Array || t instanceof Int32Array || t instanceof Uint32Array || t instanceof Float32Array || t instanceof Float64Array) && (t = new Uint8Array(t.buffer, t.byteOffset, t.byteLength)), t instanceof Uint8Array) { for (var r = t.byteLength, e = [], i = 0; i < r; i++)e[i >>> 2] |= t[i] << 24 - i % 4 * 8; n.call(this, e, r) } else n.apply(this, arguments) }; o.prototype = i } }(), function (r) { function e(t, r, e) { return t ^ r ^ e } function i(t, r, e) { return t & r | ~t & e } function n(t, r, e) { return (t | ~r) ^ e } function o(t, r, e) { return t & e | r & ~e } function s(t, r, e) { return t ^ (r | ~e) } function a(t, r) { return t << r | t >>> 32 - r } var c = t, h = c.lib, l = h.WordArray, f = h.Hasher, u = c.algo, d = l.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13]), v = l.create([5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11]), p = l.create([11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6]), _ = l.create([8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11]), y = l.create([0, 1518500249, 1859775393, 2400959708, 2840853838]), g = l.create([1352829926, 1548603684, 1836072691, 2053994217, 0]), B = u.RIPEMD160 = f.extend({ _doReset: function () { this._hash = l.create([1732584193, 4023233417, 2562383102, 271733878, 3285377520]) }, _doProcessBlock: function (t, r) { for (var c = 0; c < 16; c++) { var h = r + c, l = t[h]; t[h] = 16711935 & (l << 8 | l >>> 24) | 4278255360 & (l << 24 | l >>> 8) } var f, u, B, w, k, S, m, x, b, H, z = this._hash.words, A = y.words, C = g.words, D = d.words, R = v.words, E = p.words, M = _.words; S = f = z[0], m = u = z[1], x = B = z[2], b = w = z[3], H = k = z[4]; for (var F, c = 0; c < 80; c += 1)F = f + t[r + D[c]] | 0, F += c < 16 ? e(u, B, w) + A[0] : c < 32 ? i(u, B, w) + A[1] : c < 48 ? n(u, B, w) + A[2] : c < 64 ? o(u, B, w) + A[3] : s(u, B, w) + A[4], F |= 0, F = a(F, E[c]), F = F + k | 0, f = k, k = w, w = a(B, 10), B = u, u = F, F = S + t[r + R[c]] | 0, F += c < 16 ? s(m, x, b) + C[0] : c < 32 ? o(m, x, b) + C[1] : c < 48 ? n(m, x, b) + C[2] : c < 64 ? i(m, x, b) + C[3] : e(m, x, b) + C[4], F |= 0, F = a(F, M[c]), F = F + H | 0, S = H, H = b, b = a(x, 10), x = m, m = F; F = z[1] + B + b | 0, z[1] = z[2] + w + H | 0, z[2] = z[3] + k + S | 0, z[3] = z[4] + f + m | 0, z[4] = z[0] + u + x | 0, z[0] = F }, _doFinalize: function () { var t = this._data, r = t.words, e = 8 * this._nDataBytes, i = 8 * t.sigBytes; r[i >>> 5] |= 128 << 24 - i % 32, r[(i + 64 >>> 9 << 4) + 14] = 16711935 & (e << 8 | e >>> 24) | 4278255360 & (e << 24 | e >>> 8), t.sigBytes = 4 * (r.length + 1), this._process(); for (var n = this._hash, o = n.words, s = 0; s < 5; s++) { var a = o[s]; o[s] = 16711935 & (a << 8 | a >>> 24) | 4278255360 & (a << 24 | a >>> 8) } return n }, clone: function () { var t = f.clone.call(this); return t._hash = this._hash.clone(), t } }); c.RIPEMD160 = f._createHelper(B), c.HmacRIPEMD160 = f._createHmacHelper(B) }(Math), function () { var r = t, e = r.lib, i = e.Base, n = r.enc, o = n.Utf8, s = r.algo; s.HMAC = i.extend({ init: function (t, r) { t = this._hasher = new t.init, "string" == typeof r && (r = o.parse(r)); var e = t.blockSize, i = 4 * e; r.sigBytes > i && (r = t.finalize(r)), r.clamp(); for (var n = this._oKey = r.clone(), s = this._iKey = r.clone(), a = n.words, c = s.words, h = 0; h < e; h++)a[h] ^= 1549556828, c[h] ^= 909522486; n.sigBytes = s.sigBytes = i, this.reset() }, reset: function () { var t = this._hasher; t.reset(), t.update(this._iKey) }, update: function (t) { return this._hasher.update(t), this }, finalize: function (t) { var r = this._hasher, e = r.finalize(t); r.reset(); var i = r.finalize(this._oKey.clone().concat(e)); return i } }) }(), function () { var r = t, e = r.lib, i = e.Base, n = e.WordArray, o = r.algo, s = o.SHA1, a = o.HMAC, c = o.PBKDF2 = i.extend({ cfg: i.extend({ keySize: 4, hasher: s, iterations: 1 }), init: function (t) { this.cfg = this.cfg.extend(t) }, compute: function (t, r) { for (var e = this.cfg, i = a.create(e.hasher, t), o = n.create(), s = n.create([1]), c = o.words, h = s.words, l = e.keySize, f = e.iterations; c.length < l;) { var u = i.update(r).finalize(s); i.reset(); for (var d = u.words, v = d.length, p = u, _ = 1; _ < f; _++) { p = i.finalize(p), i.reset(); for (var y = p.words, g = 0; g < v; g++)d[g] ^= y[g] } o.concat(u), h[0]++ } return o.sigBytes = 4 * l, o } }); r.PBKDF2 = function (t, r, e) { return c.create(e).compute(t, r) } }(), function () { var r = t, e = r.lib, i = e.Base, n = e.WordArray, o = r.algo, s = o.MD5, a = o.EvpKDF = i.extend({ cfg: i.extend({ keySize: 4, hasher: s, iterations: 1 }), init: function (t) { this.cfg = this.cfg.extend(t) }, compute: function (t, r) { for (var e = this.cfg, i = e.hasher.create(), o = n.create(), s = o.words, a = e.keySize, c = e.iterations; s.length < a;) { h && i.update(h); var h = i.update(t).finalize(r); i.reset(); for (var l = 1; l < c; l++)h = i.finalize(h), i.reset(); o.concat(h) } return o.sigBytes = 4 * a, o } }); r.EvpKDF = function (t, r, e) { return a.create(e).compute(t, r) } }(), function () { var r = t, e = r.lib, i = e.WordArray, n = r.algo, o = n.SHA256, s = n.SHA224 = o.extend({ _doReset: function () { this._hash = new i.init([3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428]) }, _doFinalize: function () { var t = o._doFinalize.call(this); return t.sigBytes -= 4, t } }); r.SHA224 = o._createHelper(s), r.HmacSHA224 = o._createHmacHelper(s) }(), function (r) { var e = t, i = e.lib, n = i.Base, o = i.WordArray, s = e.x64 = {}; s.Word = n.extend({ init: function (t, r) { this.high = t, this.low = r } }), s.WordArray = n.extend({ init: function (t, e) { t = this.words = t || [], e != r ? this.sigBytes = e : this.sigBytes = 8 * t.length }, toX32: function () { for (var t = this.words, r = t.length, e = [], i = 0; i < r; i++) { var n = t[i]; e.push(n.high), e.push(n.low) } return o.create(e, this.sigBytes) }, clone: function () { for (var t = n.clone.call(this), r = t.words = this.words.slice(0), e = r.length, i = 0; i < e; i++)r[i] = r[i].clone(); return t } }) }(), function (r) { var e = t, i = e.lib, n = i.WordArray, o = i.Hasher, s = e.x64, a = s.Word, c = e.algo, h = [], l = [], f = []; !function () { for (var t = 1, r = 0, e = 0; e < 24; e++) { h[t + 5 * r] = (e + 1) * (e + 2) / 2 % 64; var i = r % 5, n = (2 * t + 3 * r) % 5; t = i, r = n } for (var t = 0; t < 5; t++)for (var r = 0; r < 5; r++)l[t + 5 * r] = r + (2 * t + 3 * r) % 5 * 5; for (var o = 1, s = 0; s < 24; s++) { for (var c = 0, u = 0, d = 0; d < 7; d++) { if (1 & o) { var v = (1 << d) - 1; v < 32 ? u ^= 1 << v : c ^= 1 << v - 32 } 128 & o ? o = o << 1 ^ 113 : o <<= 1 } f[s] = a.create(c, u) } }(); var u = []; !function () { for (var t = 0; t < 25; t++)u[t] = a.create() }(); var d = c.SHA3 = o.extend({ cfg: o.cfg.extend({ outputLength: 512 }), _doReset: function () { for (var t = this._state = [], r = 0; r < 25; r++)t[r] = new a.init; this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32 }, _doProcessBlock: function (t, r) { for (var e = this._state, i = this.blockSize / 2, n = 0; n < i; n++) { var o = t[r + 2 * n], s = t[r + 2 * n + 1]; o = 16711935 & (o << 8 | o >>> 24) | 4278255360 & (o << 24 | o >>> 8), s = 16711935 & (s << 8 | s >>> 24) | 4278255360 & (s << 24 | s >>> 8); var a = e[n]; a.high ^= s, a.low ^= o } for (var c = 0; c < 24; c++) { for (var d = 0; d < 5; d++) { for (var v = 0, p = 0, _ = 0; _ < 5; _++) { var a = e[d + 5 * _]; v ^= a.high, p ^= a.low } var y = u[d]; y.high = v, y.low = p } for (var d = 0; d < 5; d++)for (var g = u[(d + 4) % 5], B = u[(d + 1) % 5], w = B.high, k = B.low, v = g.high ^ (w << 1 | k >>> 31), p = g.low ^ (k << 1 | w >>> 31), _ = 0; _ < 5; _++) { var a = e[d + 5 * _]; a.high ^= v, a.low ^= p } for (var S = 1; S < 25; S++) { var a = e[S], m = a.high, x = a.low, b = h[S]; if (b < 32) var v = m << b | x >>> 32 - b, p = x << b | m >>> 32 - b; else var v = x << b - 32 | m >>> 64 - b, p = m << b - 32 | x >>> 64 - b; var H = u[l[S]]; H.high = v, H.low = p } var z = u[0], A = e[0]; z.high = A.high, z.low = A.low; for (var d = 0; d < 5; d++)for (var _ = 0; _ < 5; _++) { var S = d + 5 * _, a = e[S], C = u[S], D = u[(d + 1) % 5 + 5 * _], R = u[(d + 2) % 5 + 5 * _]; a.high = C.high ^ ~D.high & R.high, a.low = C.low ^ ~D.low & R.low } var a = e[0], E = f[c]; a.high ^= E.high, a.low ^= E.low } }, _doFinalize: function () { var t = this._data, e = t.words, i = (8 * this._nDataBytes, 8 * t.sigBytes), o = 32 * this.blockSize; e[i >>> 5] |= 1 << 24 - i % 32, e[(r.ceil((i + 1) / o) * o >>> 5) - 1] |= 128, t.sigBytes = 4 * e.length, this._process(); for (var s = this._state, a = this.cfg.outputLength / 8, c = a / 8, h = [], l = 0; l < c; l++) { var f = s[l], u = f.high, d = f.low; u = 16711935 & (u << 8 | u >>> 24) | 4278255360 & (u << 24 | u >>> 8), d = 16711935 & (d << 8 | d >>> 24) | 4278255360 & (d << 24 | d >>> 8), h.push(d), h.push(u) } return new n.init(h, a) }, clone: function () { for (var t = o.clone.call(this), r = t._state = this._state.slice(0), e = 0; e < 25; e++)r[e] = r[e].clone(); return t } }); e.SHA3 = o._createHelper(d), e.HmacSHA3 = o._createHmacHelper(d) }(Math), function () { function r() { return s.create.apply(s, arguments) } var e = t, i = e.lib, n = i.Hasher, o = e.x64, s = o.Word, a = o.WordArray, c = e.algo, h = [r(1116352408, 3609767458), r(1899447441, 602891725), r(3049323471, 3964484399), r(3921009573, 2173295548), r(961987163, 4081628472), r(1508970993, 3053834265), r(2453635748, 2937671579), r(2870763221, 3664609560), r(3624381080, 2734883394), r(310598401, 1164996542), r(607225278, 1323610764), r(1426881987, 3590304994), r(1925078388, 4068182383), r(2162078206, 991336113), r(2614888103, 633803317), r(3248222580, 3479774868), r(3835390401, 2666613458), r(4022224774, 944711139), r(264347078, 2341262773), r(604807628, 2007800933), r(770255983, 1495990901), r(1249150122, 1856431235), r(1555081692, 3175218132), r(1996064986, 2198950837), r(2554220882, 3999719339), r(2821834349, 766784016), r(2952996808, 2566594879), r(3210313671, 3203337956), r(3336571891, 1034457026), r(3584528711, 2466948901), r(113926993, 3758326383), r(338241895, 168717936), r(666307205, 1188179964), r(773529912, 1546045734), r(1294757372, 1522805485), r(1396182291, 2643833823), r(1695183700, 2343527390), r(1986661051, 1014477480), r(2177026350, 1206759142), r(2456956037, 344077627), r(2730485921, 1290863460), r(2820302411, 3158454273), r(3259730800, 3505952657), r(3345764771, 106217008), r(3516065817, 3606008344), r(3600352804, 1432725776), r(4094571909, 1467031594), r(275423344, 851169720), r(430227734, 3100823752), r(506948616, 1363258195), r(659060556, 3750685593), r(883997877, 3785050280), r(958139571, 3318307427), r(1322822218, 3812723403), r(1537002063, 2003034995), r(1747873779, 3602036899), r(1955562222, 1575990012), r(2024104815, 1125592928), r(2227730452, 2716904306), r(2361852424, 442776044), r(2428436474, 593698344), r(2756734187, 3733110249), r(3204031479, 2999351573), r(3329325298, 3815920427), r(3391569614, 3928383900), r(3515267271, 566280711), r(3940187606, 3454069534), r(4118630271, 4000239992), r(116418474, 1914138554), r(174292421, 2731055270), r(289380356, 3203993006), r(460393269, 320620315), r(685471733, 587496836), r(852142971, 1086792851), r(1017036298, 365543100), r(1126000580, 2618297676), r(1288033470, 3409855158), r(1501505948, 4234509866), r(1607167915, 987167468), r(1816402316, 1246189591)], l = []; !function () { for (var t = 0; t < 80; t++)l[t] = r() }(); var f = c.SHA512 = n.extend({ _doReset: function () { this._hash = new a.init([new s.init(1779033703, 4089235720), new s.init(3144134277, 2227873595), new s.init(1013904242, 4271175723), new s.init(2773480762, 1595750129), new s.init(1359893119, 2917565137), new s.init(2600822924, 725511199), new s.init(528734635, 4215389547), new s.init(1541459225, 327033209)]) }, _doProcessBlock: function (t, r) { for (var e = this._hash.words, i = e[0], n = e[1], o = e[2], s = e[3], a = e[4], c = e[5], f = e[6], u = e[7], d = i.high, v = i.low, p = n.high, _ = n.low, y = o.high, g = o.low, B = s.high, w = s.low, k = a.high, S = a.low, m = c.high, x = c.low, b = f.high, H = f.low, z = u.high, A = u.low, C = d, D = v, R = p, E = _, M = y, F = g, P = B, W = w, O = k, U = S, I = m, K = x, X = b, L = H, j = z, N = A, T = 0; T < 80; T++) { var Z = l[T]; if (T < 16) var q = Z.high = 0 | t[r + 2 * T], G = Z.low = 0 | t[r + 2 * T + 1]; else { var J = l[T - 15], $ = J.high, Q = J.low, V = ($ >>> 1 | Q << 31) ^ ($ >>> 8 | Q << 24) ^ $ >>> 7, Y = (Q >>> 1 | $ << 31) ^ (Q >>> 8 | $ << 24) ^ (Q >>> 7 | $ << 25), tt = l[T - 2], rt = tt.high, et = tt.low, it = (rt >>> 19 | et << 13) ^ (rt << 3 | et >>> 29) ^ rt >>> 6, nt = (et >>> 19 | rt << 13) ^ (et << 3 | rt >>> 29) ^ (et >>> 6 | rt << 26), ot = l[T - 7], st = ot.high, at = ot.low, ct = l[T - 16], ht = ct.high, lt = ct.low, G = Y + at, q = V + st + (G >>> 0 < Y >>> 0 ? 1 : 0), G = G + nt, q = q + it + (G >>> 0 < nt >>> 0 ? 1 : 0), G = G + lt, q = q + ht + (G >>> 0 < lt >>> 0 ? 1 : 0); Z.high = q, Z.low = G } var ft = O & I ^ ~O & X, ut = U & K ^ ~U & L, dt = C & R ^ C & M ^ R & M, vt = D & E ^ D & F ^ E & F, pt = (C >>> 28 | D << 4) ^ (C << 30 | D >>> 2) ^ (C << 25 | D >>> 7), _t = (D >>> 28 | C << 4) ^ (D << 30 | C >>> 2) ^ (D << 25 | C >>> 7), yt = (O >>> 14 | U << 18) ^ (O >>> 18 | U << 14) ^ (O << 23 | U >>> 9), gt = (U >>> 14 | O << 18) ^ (U >>> 18 | O << 14) ^ (U << 23 | O >>> 9), Bt = h[T], wt = Bt.high, kt = Bt.low, St = N + gt, mt = j + yt + (St >>> 0 < N >>> 0 ? 1 : 0), St = St + ut, mt = mt + ft + (St >>> 0 < ut >>> 0 ? 1 : 0), St = St + kt, mt = mt + wt + (St >>> 0 < kt >>> 0 ? 1 : 0), St = St + G, mt = mt + q + (St >>> 0 < G >>> 0 ? 1 : 0), xt = _t + vt, bt = pt + dt + (xt >>> 0 < _t >>> 0 ? 1 : 0); j = X, N = L, X = I, L = K, I = O, K = U, U = W + St | 0, O = P + mt + (U >>> 0 < W >>> 0 ? 1 : 0) | 0, P = M, W = F, M = R, F = E, R = C, E = D, D = St + xt | 0, C = mt + bt + (D >>> 0 < St >>> 0 ? 1 : 0) | 0 } v = i.low = v + D, i.high = d + C + (v >>> 0 < D >>> 0 ? 1 : 0), _ = n.low = _ + E, n.high = p + R + (_ >>> 0 < E >>> 0 ? 1 : 0), g = o.low = g + F, o.high = y + M + (g >>> 0 < F >>> 0 ? 1 : 0), w = s.low = w + W, s.high = B + P + (w >>> 0 < W >>> 0 ? 1 : 0), S = a.low = S + U, a.high = k + O + (S >>> 0 < U >>> 0 ? 1 : 0), x = c.low = x + K, c.high = m + I + (x >>> 0 < K >>> 0 ? 1 : 0), H = f.low = H + L, f.high = b + X + (H >>> 0 < L >>> 0 ? 1 : 0), A = u.low = A + N, u.high = z + j + (A >>> 0 < N >>> 0 ? 1 : 0) }, _doFinalize: function () { var t = this._data, r = t.words, e = 8 * this._nDataBytes, i = 8 * t.sigBytes; r[i >>> 5] |= 128 << 24 - i % 32, r[(i + 128 >>> 10 << 5) + 30] = Math.floor(e / 4294967296), r[(i + 128 >>> 10 << 5) + 31] = e, t.sigBytes = 4 * r.length, this._process(); var n = this._hash.toX32(); return n }, clone: function () { var t = n.clone.call(this); return t._hash = this._hash.clone(), t }, blockSize: 32 }); e.SHA512 = n._createHelper(f), e.HmacSHA512 = n._createHmacHelper(f) }(), function () { var r = t, e = r.x64, i = e.Word, n = e.WordArray, o = r.algo, s = o.SHA512, a = o.SHA384 = s.extend({ _doReset: function () { this._hash = new n.init([new i.init(3418070365, 3238371032), new i.init(1654270250, 914150663), new i.init(2438529370, 812702999), new i.init(355462360, 4144912697), new i.init(1731405415, 4290775857), new i.init(2394180231, 1750603025), new i.init(3675008525, 1694076839), new i.init(1203062813, 3204075428)]) }, _doFinalize: function () { var t = s._doFinalize.call(this); return t.sigBytes -= 16, t } }); r.SHA384 = s._createHelper(a), r.HmacSHA384 = s._createHmacHelper(a) }(), t.lib.Cipher || function (r) { var e = t, i = e.lib, n = i.Base, o = i.WordArray, s = i.BufferedBlockAlgorithm, a = e.enc, c = (a.Utf8, a.Base64), h = e.algo, l = h.EvpKDF, f = i.Cipher = s.extend({ cfg: n.extend(), createEncryptor: function (t, r) { return this.create(this._ENC_XFORM_MODE, t, r) }, createDecryptor: function (t, r) { return this.create(this._DEC_XFORM_MODE, t, r) }, init: function (t, r, e) { this.cfg = this.cfg.extend(e), this._xformMode = t, this._key = r, this.reset() }, reset: function () { s.reset.call(this), this._doReset() }, process: function (t) { return this._append(t), this._process() }, finalize: function (t) { t && this._append(t); var r = this._doFinalize(); return r }, keySize: 4, ivSize: 4, _ENC_XFORM_MODE: 1, _DEC_XFORM_MODE: 2, _createHelper: function () { function t(t) { return "string" == typeof t ? m : w } return function (r) { return { encrypt: function (e, i, n) { return t(i).encrypt(r, e, i, n) }, decrypt: function (e, i, n) { return t(i).decrypt(r, e, i, n) } } } }() }), u = (i.StreamCipher = f.extend({ _doFinalize: function () { var t = this._process(!0); return t }, blockSize: 1 }), e.mode = {}), d = i.BlockCipherMode = n.extend({ createEncryptor: function (t, r) { return this.Encryptor.create(t, r) }, createDecryptor: function (t, r) { return this.Decryptor.create(t, r) }, init: function (t, r) { this._cipher = t, this._iv = r } }), v = u.CBC = function () { function t(t, e, i) { var n = this._iv; if (n) { var o = n; this._iv = r } else var o = this._prevBlock; for (var s = 0; s < i; s++)t[e + s] ^= o[s] } var e = d.extend(); return e.Encryptor = e.extend({ processBlock: function (r, e) { var i = this._cipher, n = i.blockSize; t.call(this, r, e, n), i.encryptBlock(r, e), this._prevBlock = r.slice(e, e + n) } }), e.Decryptor = e.extend({ processBlock: function (r, e) { var i = this._cipher, n = i.blockSize, o = r.slice(e, e + n); i.decryptBlock(r, e), t.call(this, r, e, n), this._prevBlock = o } }), e }(), p = e.pad = {}, _ = p.Pkcs7 = { pad: function (t, r) { for (var e = 4 * r, i = e - t.sigBytes % e, n = i << 24 | i << 16 | i << 8 | i, s = [], a = 0; a < i; a += 4)s.push(n); var c = o.create(s, i); t.concat(c) }, unpad: function (t) { var r = 255 & t.words[t.sigBytes - 1 >>> 2]; t.sigBytes -= r } }, y = (i.BlockCipher = f.extend({ cfg: f.cfg.extend({ mode: v, padding: _ }), reset: function () { f.reset.call(this); var t = this.cfg, r = t.iv, e = t.mode; if (this._xformMode == this._ENC_XFORM_MODE) var i = e.createEncryptor; else { var i = e.createDecryptor; this._minBufferSize = 1 } this._mode && this._mode.__creator == i ? this._mode.init(this, r && r.words) : (this._mode = i.call(e, this, r && r.words), this._mode.__creator = i) }, _doProcessBlock: function (t, r) { this._mode.processBlock(t, r) }, _doFinalize: function () { var t = this.cfg.padding; if (this._xformMode == this._ENC_XFORM_MODE) { t.pad(this._data, this.blockSize); var r = this._process(!0) } else { var r = this._process(!0); t.unpad(r) } return r }, blockSize: 4 }), i.CipherParams = n.extend({ init: function (t) { this.mixIn(t) }, toString: function (t) { return (t || this.formatter).stringify(this) } })), g = e.format = {}, B = g.OpenSSL = { stringify: function (t) { var r = t.ciphertext, e = t.salt; if (e) var i = o.create([1398893684, 1701076831]).concat(e).concat(r); else var i = r; return i.toString(c) }, parse: function (t) { var r = c.parse(t), e = r.words; if (1398893684 == e[0] && 1701076831 == e[1]) { var i = o.create(e.slice(2, 4)); e.splice(0, 4), r.sigBytes -= 16 } return y.create({ ciphertext: r, salt: i }) } }, w = i.SerializableCipher = n.extend({ cfg: n.extend({ format: B }), encrypt: function (t, r, e, i) { i = this.cfg.extend(i); var n = t.createEncryptor(e, i), o = n.finalize(r), s = n.cfg; return y.create({ ciphertext: o, key: e, iv: s.iv, algorithm: t, mode: s.mode, padding: s.padding, blockSize: t.blockSize, formatter: i.format }) }, decrypt: function (t, r, e, i) { i = this.cfg.extend(i), r = this._parse(r, i.format); var n = t.createDecryptor(e, i).finalize(r.ciphertext); return n }, _parse: function (t, r) { return "string" == typeof t ? r.parse(t, this) : t } }), k = e.kdf = {}, S = k.OpenSSL = { execute: function (t, r, e, i) { i || (i = o.random(8)); var n = l.create({ keySize: r + e }).compute(t, i), s = o.create(n.words.slice(r), 4 * e); return n.sigBytes = 4 * r, y.create({ key: n, iv: s, salt: i }) } }, m = i.PasswordBasedCipher = w.extend({ cfg: w.cfg.extend({ kdf: S }), encrypt: function (t, r, e, i) { i = this.cfg.extend(i); var n = i.kdf.execute(e, t.keySize, t.ivSize); i.iv = n.iv; var o = w.encrypt.call(this, t, r, n.key, i); return o.mixIn(n), o }, decrypt: function (t, r, e, i) { i = this.cfg.extend(i), r = this._parse(r, i.format); var n = i.kdf.execute(e, t.keySize, t.ivSize, r.salt); i.iv = n.iv; var o = w.decrypt.call(this, t, r, n.key, i); return o } }) }(), t.mode.CFB = function () { function r(t, r, e, i) { var n = this._iv; if (n) { var o = n.slice(0); this._iv = void 0 } else var o = this._prevBlock; i.encryptBlock(o, 0); for (var s = 0; s < e; s++)t[r + s] ^= o[s] } var e = t.lib.BlockCipherMode.extend(); return e.Encryptor = e.extend({ processBlock: function (t, e) { var i = this._cipher, n = i.blockSize; r.call(this, t, e, n, i), this._prevBlock = t.slice(e, e + n) } }), e.Decryptor = e.extend({ processBlock: function (t, e) { var i = this._cipher, n = i.blockSize, o = t.slice(e, e + n); r.call(this, t, e, n, i), this._prevBlock = o } }), e }(), t.mode.ECB = function () { var r = t.lib.BlockCipherMode.extend(); return r.Encryptor = r.extend({ processBlock: function (t, r) { this._cipher.encryptBlock(t, r) } }), r.Decryptor = r.extend({ processBlock: function (t, r) { this._cipher.decryptBlock(t, r) } }), r }(), t.pad.AnsiX923 = { pad: function (t, r) { var e = t.sigBytes, i = 4 * r, n = i - e % i, o = e + n - 1; t.clamp(), t.words[o >>> 2] |= n << 24 - o % 4 * 8, t.sigBytes += n }, unpad: function (t) { var r = 255 & t.words[t.sigBytes - 1 >>> 2]; t.sigBytes -= r } }, t.pad.Iso10126 = { pad: function (r, e) { var i = 4 * e, n = i - r.sigBytes % i; r.concat(t.lib.WordArray.random(n - 1)).concat(t.lib.WordArray.create([n << 24], 1)) }, unpad: function (t) { var r = 255 & t.words[t.sigBytes - 1 >>> 2]; t.sigBytes -= r } }, t.pad.Iso97971 = { pad: function (r, e) { r.concat(t.lib.WordArray.create([2147483648], 1)), t.pad.ZeroPadding.pad(r, e) }, unpad: function (r) { t.pad.ZeroPadding.unpad(r), r.sigBytes-- } }, t.mode.OFB = function () { var r = t.lib.BlockCipherMode.extend(), e = r.Encryptor = r.extend({ processBlock: function (t, r) { var e = this._cipher, i = e.blockSize, n = this._iv, o = this._keystream; n && (o = this._keystream = n.slice(0), this._iv = void 0), e.encryptBlock(o, 0); for (var s = 0; s < i; s++)t[r + s] ^= o[s] } }); return r.Decryptor = e, r }(), t.pad.NoPadding = { pad: function () { }, unpad: function () { } }, function (r) { var e = t, i = e.lib, n = i.CipherParams, o = e.enc, s = o.Hex, a = e.format; a.Hex = { stringify: function (t) { return t.ciphertext.toString(s) }, parse: function (t) { var r = s.parse(t); return n.create({ ciphertext: r }) } } }(), function () { var r = t, e = r.lib, i = e.BlockCipher, n = r.algo, o = [], s = [], a = [], c = [], h = [], l = [], f = [], u = [], d = [], v = []; !function () { for (var t = [], r = 0; r < 256; r++)r < 128 ? t[r] = r << 1 : t[r] = r << 1 ^ 283; for (var e = 0, i = 0, r = 0; r < 256; r++) { var n = i ^ i << 1 ^ i << 2 ^ i << 3 ^ i << 4; n = n >>> 8 ^ 255 & n ^ 99, o[e] = n, s[n] = e; var p = t[e], _ = t[p], y = t[_], g = 257 * t[n] ^ 16843008 * n; a[e] = g << 24 | g >>> 8, c[e] = g << 16 | g >>> 16, h[e] = g << 8 | g >>> 24, l[e] = g; var g = 16843009 * y ^ 65537 * _ ^ 257 * p ^ 16843008 * e; f[n] = g << 24 | g >>> 8, u[n] = g << 16 | g >>> 16, d[n] = g << 8 | g >>> 24, v[n] = g, e ? (e = p ^ t[t[t[y ^ p]]], i ^= t[t[i]]) : e = i = 1 } }(); var p = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54], _ = n.AES = i.extend({ _doReset: function () { if (!this._nRounds || this._keyPriorReset !== this._key) { for (var t = this._keyPriorReset = this._key, r = t.words, e = t.sigBytes / 4, i = this._nRounds = e + 6, n = 4 * (i + 1), s = this._keySchedule = [], a = 0; a < n; a++)if (a < e) s[a] = r[a]; else { var c = s[a - 1]; a % e ? e > 6 && a % e == 4 && (c = o[c >>> 24] << 24 | o[c >>> 16 & 255] << 16 | o[c >>> 8 & 255] << 8 | o[255 & c]) : (c = c << 8 | c >>> 24, c = o[c >>> 24] << 24 | o[c >>> 16 & 255] << 16 | o[c >>> 8 & 255] << 8 | o[255 & c], c ^= p[a / e | 0] << 24), s[a] = s[a - e] ^ c } for (var h = this._invKeySchedule = [], l = 0; l < n; l++) { var a = n - l; if (l % 4) var c = s[a]; else var c = s[a - 4]; l < 4 || a <= 4 ? h[l] = c : h[l] = f[o[c >>> 24]] ^ u[o[c >>> 16 & 255]] ^ d[o[c >>> 8 & 255]] ^ v[o[255 & c]] } } }, encryptBlock: function (t, r) { this._doCryptBlock(t, r, this._keySchedule, a, c, h, l, o) }, decryptBlock: function (t, r) { var e = t[r + 1]; t[r + 1] = t[r + 3], t[r + 3] = e, this._doCryptBlock(t, r, this._invKeySchedule, f, u, d, v, s); var e = t[r + 1]; t[r + 1] = t[r + 3], t[r + 3] = e }, _doCryptBlock: function (t, r, e, i, n, o, s, a) { for (var c = this._nRounds, h = t[r] ^ e[0], l = t[r + 1] ^ e[1], f = t[r + 2] ^ e[2], u = t[r + 3] ^ e[3], d = 4, v = 1; v < c; v++) { var p = i[h >>> 24] ^ n[l >>> 16 & 255] ^ o[f >>> 8 & 255] ^ s[255 & u] ^ e[d++], _ = i[l >>> 24] ^ n[f >>> 16 & 255] ^ o[u >>> 8 & 255] ^ s[255 & h] ^ e[d++], y = i[f >>> 24] ^ n[u >>> 16 & 255] ^ o[h >>> 8 & 255] ^ s[255 & l] ^ e[d++], g = i[u >>> 24] ^ n[h >>> 16 & 255] ^ o[l >>> 8 & 255] ^ s[255 & f] ^ e[d++]; h = p, l = _, f = y, u = g } var p = (a[h >>> 24] << 24 | a[l >>> 16 & 255] << 16 | a[f >>> 8 & 255] << 8 | a[255 & u]) ^ e[d++], _ = (a[l >>> 24] << 24 | a[f >>> 16 & 255] << 16 | a[u >>> 8 & 255] << 8 | a[255 & h]) ^ e[d++], y = (a[f >>> 24] << 24 | a[u >>> 16 & 255] << 16 | a[h >>> 8 & 255] << 8 | a[255 & l]) ^ e[d++], g = (a[u >>> 24] << 24 | a[h >>> 16 & 255] << 16 | a[l >>> 8 & 255] << 8 | a[255 & f]) ^ e[d++]; t[r] = p, t[r + 1] = _, t[r + 2] = y, t[r + 3] = g }, keySize: 8 }); r.AES = i._createHelper(_) }(), function () {
    function r(t, r) { var e = (this._lBlock >>> t ^ this._rBlock) & r; this._rBlock ^= e, this._lBlock ^= e << t } function e(t, r) {
      var e = (this._rBlock >>> t ^ this._lBlock) & r; this._lBlock ^= e, this._rBlock ^= e << t;
    } var i = t, n = i.lib, o = n.WordArray, s = n.BlockCipher, a = i.algo, c = [57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22, 14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4], h = [14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2, 41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32], l = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28], f = [{ 0: 8421888, 268435456: 32768, 536870912: 8421378, 805306368: 2, 1073741824: 512, 1342177280: 8421890, 1610612736: 8389122, 1879048192: 8388608, 2147483648: 514, 2415919104: 8389120, 2684354560: 33280, 2952790016: 8421376, 3221225472: 32770, 3489660928: 8388610, 3758096384: 0, 4026531840: 33282, 134217728: 0, 402653184: 8421890, 671088640: 33282, 939524096: 32768, 1207959552: 8421888, 1476395008: 512, 1744830464: 8421378, 2013265920: 2, 2281701376: 8389120, 2550136832: 33280, 2818572288: 8421376, 3087007744: 8389122, 3355443200: 8388610, 3623878656: 32770, 3892314112: 514, 4160749568: 8388608, 1: 32768, 268435457: 2, 536870913: 8421888, 805306369: 8388608, 1073741825: 8421378, 1342177281: 33280, 1610612737: 512, 1879048193: 8389122, 2147483649: 8421890, 2415919105: 8421376, 2684354561: 8388610, 2952790017: 33282, 3221225473: 514, 3489660929: 8389120, 3758096385: 32770, 4026531841: 0, 134217729: 8421890, 402653185: 8421376, 671088641: 8388608, 939524097: 512, 1207959553: 32768, 1476395009: 8388610, 1744830465: 2, 2013265921: 33282, 2281701377: 32770, 2550136833: 8389122, 2818572289: 514, 3087007745: 8421888, 3355443201: 8389120, 3623878657: 0, 3892314113: 33280, 4160749569: 8421378 }, { 0: 1074282512, 16777216: 16384, 33554432: 524288, 50331648: 1074266128, 67108864: 1073741840, 83886080: 1074282496, 100663296: 1073758208, 117440512: 16, 134217728: 540672, 150994944: 1073758224, 167772160: 1073741824, 184549376: 540688, 201326592: 524304, 218103808: 0, 234881024: 16400, 251658240: 1074266112, 8388608: 1073758208, 25165824: 540688, 41943040: 16, 58720256: 1073758224, 75497472: 1074282512, 92274688: 1073741824, 109051904: 524288, 125829120: 1074266128, 142606336: 524304, 159383552: 0, 176160768: 16384, 192937984: 1074266112, 209715200: 1073741840, 226492416: 540672, 243269632: 1074282496, 260046848: 16400, 268435456: 0, 285212672: 1074266128, 301989888: 1073758224, 318767104: 1074282496, 335544320: 1074266112, 352321536: 16, 369098752: 540688, 385875968: 16384, 402653184: 16400, 419430400: 524288, 436207616: 524304, 452984832: 1073741840, 469762048: 540672, 486539264: 1073758208, 503316480: 1073741824, 520093696: 1074282512, 276824064: 540688, 293601280: 524288, 310378496: 1074266112, 327155712: 16384, 343932928: 1073758208, 360710144: 1074282512, 377487360: 16, 394264576: 1073741824, 411041792: 1074282496, 427819008: 1073741840, 444596224: 1073758224, 461373440: 524304, 478150656: 0, 494927872: 16400, 511705088: 1074266128, 528482304: 540672 }, { 0: 260, 1048576: 0, 2097152: 67109120, 3145728: 65796, 4194304: 65540, 5242880: 67108868, 6291456: 67174660, 7340032: 67174400, 8388608: 67108864, 9437184: 67174656, 10485760: 65792, 11534336: 67174404, 12582912: 67109124, 13631488: 65536, 14680064: 4, 15728640: 256, 524288: 67174656, 1572864: 67174404, 2621440: 0, 3670016: 67109120, 4718592: 67108868, 5767168: 65536, 6815744: 65540, 7864320: 260, 8912896: 4, 9961472: 256, 11010048: 67174400, 12058624: 65796, 13107200: 65792, 14155776: 67109124, 15204352: 67174660, 16252928: 67108864, 16777216: 67174656, 17825792: 65540, 18874368: 65536, 19922944: 67109120, 20971520: 256, 22020096: 67174660, 23068672: 67108868, 24117248: 0, 25165824: 67109124, 26214400: 67108864, 27262976: 4, 28311552: 65792, 29360128: 67174400, 30408704: 260, 31457280: 65796, 32505856: 67174404, 17301504: 67108864, 18350080: 260, 19398656: 67174656, 20447232: 0, 21495808: 65540, 22544384: 67109120, 23592960: 256, 24641536: 67174404, 25690112: 65536, 26738688: 67174660, 27787264: 65796, 28835840: 67108868, 29884416: 67109124, 30932992: 67174400, 31981568: 4, 33030144: 65792 }, { 0: 2151682048, 65536: 2147487808, 131072: 4198464, 196608: 2151677952, 262144: 0, 327680: 4198400, 393216: 2147483712, 458752: 4194368, 524288: 2147483648, 589824: 4194304, 655360: 64, 720896: 2147487744, 786432: 2151678016, 851968: 4160, 917504: 4096, 983040: 2151682112, 32768: 2147487808, 98304: 64, 163840: 2151678016, 229376: 2147487744, 294912: 4198400, 360448: 2151682112, 425984: 0, 491520: 2151677952, 557056: 4096, 622592: 2151682048, 688128: 4194304, 753664: 4160, 819200: 2147483648, 884736: 4194368, 950272: 4198464, 1015808: 2147483712, 1048576: 4194368, 1114112: 4198400, 1179648: 2147483712, 1245184: 0, 1310720: 4160, 1376256: 2151678016, 1441792: 2151682048, 1507328: 2147487808, 1572864: 2151682112, 1638400: 2147483648, 1703936: 2151677952, 1769472: 4198464, 1835008: 2147487744, 1900544: 4194304, 1966080: 64, 2031616: 4096, 1081344: 2151677952, 1146880: 2151682112, 1212416: 0, 1277952: 4198400, 1343488: 4194368, 1409024: 2147483648, 1474560: 2147487808, 1540096: 64, 1605632: 2147483712, 1671168: 4096, 1736704: 2147487744, 1802240: 2151678016, 1867776: 4160, 1933312: 2151682048, 1998848: 4194304, 2064384: 4198464 }, { 0: 128, 4096: 17039360, 8192: 262144, 12288: 536870912, 16384: 537133184, 20480: 16777344, 24576: 553648256, 28672: 262272, 32768: 16777216, 36864: 537133056, 40960: 536871040, 45056: 553910400, 49152: 553910272, 53248: 0, 57344: 17039488, 61440: 553648128, 2048: 17039488, 6144: 553648256, 10240: 128, 14336: 17039360, 18432: 262144, 22528: 537133184, 26624: 553910272, 30720: 536870912, 34816: 537133056, 38912: 0, 43008: 553910400, 47104: 16777344, 51200: 536871040, 55296: 553648128, 59392: 16777216, 63488: 262272, 65536: 262144, 69632: 128, 73728: 536870912, 77824: 553648256, 81920: 16777344, 86016: 553910272, 90112: 537133184, 94208: 16777216, 98304: 553910400, 102400: 553648128, 106496: 17039360, 110592: 537133056, 114688: 262272, 118784: 536871040, 122880: 0, 126976: 17039488, 67584: 553648256, 71680: 16777216, 75776: 17039360, 79872: 537133184, 83968: 536870912, 88064: 17039488, 92160: 128, 96256: 553910272, 100352: 262272, 104448: 553910400, 108544: 0, 112640: 553648128, 116736: 16777344, 120832: 262144, 124928: 537133056, 129024: 536871040 }, { 0: 268435464, 256: 8192, 512: 270532608, 768: 270540808, 1024: 268443648, 1280: 2097152, 1536: 2097160, 1792: 268435456, 2048: 0, 2304: 268443656, 2560: 2105344, 2816: 8, 3072: 270532616, 3328: 2105352, 3584: 8200, 3840: 270540800, 128: 270532608, 384: 270540808, 640: 8, 896: 2097152, 1152: 2105352, 1408: 268435464, 1664: 268443648, 1920: 8200, 2176: 2097160, 2432: 8192, 2688: 268443656, 2944: 270532616, 3200: 0, 3456: 270540800, 3712: 2105344, 3968: 268435456, 4096: 268443648, 4352: 270532616, 4608: 270540808, 4864: 8200, 5120: 2097152, 5376: 268435456, 5632: 268435464, 5888: 2105344, 6144: 2105352, 6400: 0, 6656: 8, 6912: 270532608, 7168: 8192, 7424: 268443656, 7680: 270540800, 7936: 2097160, 4224: 8, 4480: 2105344, 4736: 2097152, 4992: 268435464, 5248: 268443648, 5504: 8200, 5760: 270540808, 6016: 270532608, 6272: 270540800, 6528: 270532616, 6784: 8192, 7040: 2105352, 7296: 2097160, 7552: 0, 7808: 268435456, 8064: 268443656 }, { 0: 1048576, 16: 33555457, 32: 1024, 48: 1049601, 64: 34604033, 80: 0, 96: 1, 112: 34603009, 128: 33555456, 144: 1048577, 160: 33554433, 176: 34604032, 192: 34603008, 208: 1025, 224: 1049600, 240: 33554432, 8: 34603009, 24: 0, 40: 33555457, 56: 34604032, 72: 1048576, 88: 33554433, 104: 33554432, 120: 1025, 136: 1049601, 152: 33555456, 168: 34603008, 184: 1048577, 200: 1024, 216: 34604033, 232: 1, 248: 1049600, 256: 33554432, 272: 1048576, 288: 33555457, 304: 34603009, 320: 1048577, 336: 33555456, 352: 34604032, 368: 1049601, 384: 1025, 400: 34604033, 416: 1049600, 432: 1, 448: 0, 464: 34603008, 480: 33554433, 496: 1024, 264: 1049600, 280: 33555457, 296: 34603009, 312: 1, 328: 33554432, 344: 1048576, 360: 1025, 376: 34604032, 392: 33554433, 408: 34603008, 424: 0, 440: 34604033, 456: 1049601, 472: 1024, 488: 33555456, 504: 1048577 }, { 0: 134219808, 1: 131072, 2: 134217728, 3: 32, 4: 131104, 5: 134350880, 6: 134350848, 7: 2048, 8: 134348800, 9: 134219776, 10: 133120, 11: 134348832, 12: 2080, 13: 0, 14: 134217760, 15: 133152, 2147483648: 2048, 2147483649: 134350880, 2147483650: 134219808, 2147483651: 134217728, 2147483652: 134348800, 2147483653: 133120, 2147483654: 133152, 2147483655: 32, 2147483656: 134217760, 2147483657: 2080, 2147483658: 131104, 2147483659: 134350848, 2147483660: 0, 2147483661: 134348832, 2147483662: 134219776, 2147483663: 131072, 16: 133152, 17: 134350848, 18: 32, 19: 2048, 20: 134219776, 21: 134217760, 22: 134348832, 23: 131072, 24: 0, 25: 131104, 26: 134348800, 27: 134219808, 28: 134350880, 29: 133120, 30: 2080, 31: 134217728, 2147483664: 131072, 2147483665: 2048, 2147483666: 134348832, 2147483667: 133152, 2147483668: 32, 2147483669: 134348800, 2147483670: 134217728, 2147483671: 134219808, 2147483672: 134350880, 2147483673: 134217760, 2147483674: 134219776, 2147483675: 0, 2147483676: 133120, 2147483677: 2080, 2147483678: 131104, 2147483679: 134350848 }], u = [4160749569, 528482304, 33030144, 2064384, 129024, 8064, 504, 2147483679], d = a.DES = s.extend({ _doReset: function () { for (var t = this._key, r = t.words, e = [], i = 0; i < 56; i++) { var n = c[i] - 1; e[i] = r[n >>> 5] >>> 31 - n % 32 & 1 } for (var o = this._subKeys = [], s = 0; s < 16; s++) { for (var a = o[s] = [], f = l[s], i = 0; i < 24; i++)a[i / 6 | 0] |= e[(h[i] - 1 + f) % 28] << 31 - i % 6, a[4 + (i / 6 | 0)] |= e[28 + (h[i + 24] - 1 + f) % 28] << 31 - i % 6; a[0] = a[0] << 1 | a[0] >>> 31; for (var i = 1; i < 7; i++)a[i] = a[i] >>> 4 * (i - 1) + 3; a[7] = a[7] << 5 | a[7] >>> 27 } for (var u = this._invSubKeys = [], i = 0; i < 16; i++)u[i] = o[15 - i] }, encryptBlock: function (t, r) { this._doCryptBlock(t, r, this._subKeys) }, decryptBlock: function (t, r) { this._doCryptBlock(t, r, this._invSubKeys) }, _doCryptBlock: function (t, i, n) { this._lBlock = t[i], this._rBlock = t[i + 1], r.call(this, 4, 252645135), r.call(this, 16, 65535), e.call(this, 2, 858993459), e.call(this, 8, 16711935), r.call(this, 1, 1431655765); for (var o = 0; o < 16; o++) { for (var s = n[o], a = this._lBlock, c = this._rBlock, h = 0, l = 0; l < 8; l++)h |= f[l][((c ^ s[l]) & u[l]) >>> 0]; this._lBlock = c, this._rBlock = a ^ h } var d = this._lBlock; this._lBlock = this._rBlock, this._rBlock = d, r.call(this, 1, 1431655765), e.call(this, 8, 16711935), e.call(this, 2, 858993459), r.call(this, 16, 65535), r.call(this, 4, 252645135), t[i] = this._lBlock, t[i + 1] = this._rBlock }, keySize: 2, ivSize: 2, blockSize: 2 }); i.DES = s._createHelper(d); var v = a.TripleDES = s.extend({ _doReset: function () { var t = this._key, r = t.words; this._des1 = d.createEncryptor(o.create(r.slice(0, 2))), this._des2 = d.createEncryptor(o.create(r.slice(2, 4))), this._des3 = d.createEncryptor(o.create(r.slice(4, 6))) }, encryptBlock: function (t, r) { this._des1.encryptBlock(t, r), this._des2.decryptBlock(t, r), this._des3.encryptBlock(t, r) }, decryptBlock: function (t, r) { this._des3.decryptBlock(t, r), this._des2.encryptBlock(t, r), this._des1.decryptBlock(t, r) }, keySize: 6, ivSize: 2, blockSize: 2 }); i.TripleDES = s._createHelper(v)
  }(), function () { function r() { for (var t = this._S, r = this._i, e = this._j, i = 0, n = 0; n < 4; n++) { r = (r + 1) % 256, e = (e + t[r]) % 256; var o = t[r]; t[r] = t[e], t[e] = o, i |= t[(t[r] + t[e]) % 256] << 24 - 8 * n } return this._i = r, this._j = e, i } var e = t, i = e.lib, n = i.StreamCipher, o = e.algo, s = o.RC4 = n.extend({ _doReset: function () { for (var t = this._key, r = t.words, e = t.sigBytes, i = this._S = [], n = 0; n < 256; n++)i[n] = n; for (var n = 0, o = 0; n < 256; n++) { var s = n % e, a = r[s >>> 2] >>> 24 - s % 4 * 8 & 255; o = (o + i[n] + a) % 256; var c = i[n]; i[n] = i[o], i[o] = c } this._i = this._j = 0 }, _doProcessBlock: function (t, e) { t[e] ^= r.call(this) }, keySize: 8, ivSize: 0 }); e.RC4 = n._createHelper(s); var a = o.RC4Drop = s.extend({ cfg: s.cfg.extend({ drop: 192 }), _doReset: function () { s._doReset.call(this); for (var t = this.cfg.drop; t > 0; t--)r.call(this) } }); e.RC4Drop = n._createHelper(a) }(), t.mode.CTRGladman = function () { function r(t) { if (255 === (t >> 24 & 255)) { var r = t >> 16 & 255, e = t >> 8 & 255, i = 255 & t; 255 === r ? (r = 0, 255 === e ? (e = 0, 255 === i ? i = 0 : ++i) : ++e) : ++r, t = 0, t += r << 16, t += e << 8, t += i } else t += 1 << 24; return t } function e(t) { return 0 === (t[0] = r(t[0])) && (t[1] = r(t[1])), t } var i = t.lib.BlockCipherMode.extend(), n = i.Encryptor = i.extend({ processBlock: function (t, r) { var i = this._cipher, n = i.blockSize, o = this._iv, s = this._counter; o && (s = this._counter = o.slice(0), this._iv = void 0), e(s); var a = s.slice(0); i.encryptBlock(a, 0); for (var c = 0; c < n; c++)t[r + c] ^= a[c] } }); return i.Decryptor = n, i }(), function () { function r() { for (var t = this._X, r = this._C, e = 0; e < 8; e++)a[e] = r[e]; r[0] = r[0] + 1295307597 + this._b | 0, r[1] = r[1] + 3545052371 + (r[0] >>> 0 < a[0] >>> 0 ? 1 : 0) | 0, r[2] = r[2] + 886263092 + (r[1] >>> 0 < a[1] >>> 0 ? 1 : 0) | 0, r[3] = r[3] + 1295307597 + (r[2] >>> 0 < a[2] >>> 0 ? 1 : 0) | 0, r[4] = r[4] + 3545052371 + (r[3] >>> 0 < a[3] >>> 0 ? 1 : 0) | 0, r[5] = r[5] + 886263092 + (r[4] >>> 0 < a[4] >>> 0 ? 1 : 0) | 0, r[6] = r[6] + 1295307597 + (r[5] >>> 0 < a[5] >>> 0 ? 1 : 0) | 0, r[7] = r[7] + 3545052371 + (r[6] >>> 0 < a[6] >>> 0 ? 1 : 0) | 0, this._b = r[7] >>> 0 < a[7] >>> 0 ? 1 : 0; for (var e = 0; e < 8; e++) { var i = t[e] + r[e], n = 65535 & i, o = i >>> 16, s = ((n * n >>> 17) + n * o >>> 15) + o * o, h = ((4294901760 & i) * i | 0) + ((65535 & i) * i | 0); c[e] = s ^ h } t[0] = c[0] + (c[7] << 16 | c[7] >>> 16) + (c[6] << 16 | c[6] >>> 16) | 0, t[1] = c[1] + (c[0] << 8 | c[0] >>> 24) + c[7] | 0, t[2] = c[2] + (c[1] << 16 | c[1] >>> 16) + (c[0] << 16 | c[0] >>> 16) | 0, t[3] = c[3] + (c[2] << 8 | c[2] >>> 24) + c[1] | 0, t[4] = c[4] + (c[3] << 16 | c[3] >>> 16) + (c[2] << 16 | c[2] >>> 16) | 0, t[5] = c[5] + (c[4] << 8 | c[4] >>> 24) + c[3] | 0, t[6] = c[6] + (c[5] << 16 | c[5] >>> 16) + (c[4] << 16 | c[4] >>> 16) | 0, t[7] = c[7] + (c[6] << 8 | c[6] >>> 24) + c[5] | 0 } var e = t, i = e.lib, n = i.StreamCipher, o = e.algo, s = [], a = [], c = [], h = o.Rabbit = n.extend({ _doReset: function () { for (var t = this._key.words, e = this.cfg.iv, i = 0; i < 4; i++)t[i] = 16711935 & (t[i] << 8 | t[i] >>> 24) | 4278255360 & (t[i] << 24 | t[i] >>> 8); var n = this._X = [t[0], t[3] << 16 | t[2] >>> 16, t[1], t[0] << 16 | t[3] >>> 16, t[2], t[1] << 16 | t[0] >>> 16, t[3], t[2] << 16 | t[1] >>> 16], o = this._C = [t[2] << 16 | t[2] >>> 16, 4294901760 & t[0] | 65535 & t[1], t[3] << 16 | t[3] >>> 16, 4294901760 & t[1] | 65535 & t[2], t[0] << 16 | t[0] >>> 16, 4294901760 & t[2] | 65535 & t[3], t[1] << 16 | t[1] >>> 16, 4294901760 & t[3] | 65535 & t[0]]; this._b = 0; for (var i = 0; i < 4; i++)r.call(this); for (var i = 0; i < 8; i++)o[i] ^= n[i + 4 & 7]; if (e) { var s = e.words, a = s[0], c = s[1], h = 16711935 & (a << 8 | a >>> 24) | 4278255360 & (a << 24 | a >>> 8), l = 16711935 & (c << 8 | c >>> 24) | 4278255360 & (c << 24 | c >>> 8), f = h >>> 16 | 4294901760 & l, u = l << 16 | 65535 & h; o[0] ^= h, o[1] ^= f, o[2] ^= l, o[3] ^= u, o[4] ^= h, o[5] ^= f, o[6] ^= l, o[7] ^= u; for (var i = 0; i < 4; i++)r.call(this) } }, _doProcessBlock: function (t, e) { var i = this._X; r.call(this), s[0] = i[0] ^ i[5] >>> 16 ^ i[3] << 16, s[1] = i[2] ^ i[7] >>> 16 ^ i[5] << 16, s[2] = i[4] ^ i[1] >>> 16 ^ i[7] << 16, s[3] = i[6] ^ i[3] >>> 16 ^ i[1] << 16; for (var n = 0; n < 4; n++)s[n] = 16711935 & (s[n] << 8 | s[n] >>> 24) | 4278255360 & (s[n] << 24 | s[n] >>> 8), t[e + n] ^= s[n] }, blockSize: 4, ivSize: 2 }); e.Rabbit = n._createHelper(h) }(), t.mode.CTR = function () { var r = t.lib.BlockCipherMode.extend(), e = r.Encryptor = r.extend({ processBlock: function (t, r) { var e = this._cipher, i = e.blockSize, n = this._iv, o = this._counter; n && (o = this._counter = n.slice(0), this._iv = void 0); var s = o.slice(0); e.encryptBlock(s, 0), o[i - 1] = o[i - 1] + 1 | 0; for (var a = 0; a < i; a++)t[r + a] ^= s[a] } }); return r.Decryptor = e, r }(), function () { function r() { for (var t = this._X, r = this._C, e = 0; e < 8; e++)a[e] = r[e]; r[0] = r[0] + 1295307597 + this._b | 0, r[1] = r[1] + 3545052371 + (r[0] >>> 0 < a[0] >>> 0 ? 1 : 0) | 0, r[2] = r[2] + 886263092 + (r[1] >>> 0 < a[1] >>> 0 ? 1 : 0) | 0, r[3] = r[3] + 1295307597 + (r[2] >>> 0 < a[2] >>> 0 ? 1 : 0) | 0, r[4] = r[4] + 3545052371 + (r[3] >>> 0 < a[3] >>> 0 ? 1 : 0) | 0, r[5] = r[5] + 886263092 + (r[4] >>> 0 < a[4] >>> 0 ? 1 : 0) | 0, r[6] = r[6] + 1295307597 + (r[5] >>> 0 < a[5] >>> 0 ? 1 : 0) | 0, r[7] = r[7] + 3545052371 + (r[6] >>> 0 < a[6] >>> 0 ? 1 : 0) | 0, this._b = r[7] >>> 0 < a[7] >>> 0 ? 1 : 0; for (var e = 0; e < 8; e++) { var i = t[e] + r[e], n = 65535 & i, o = i >>> 16, s = ((n * n >>> 17) + n * o >>> 15) + o * o, h = ((4294901760 & i) * i | 0) + ((65535 & i) * i | 0); c[e] = s ^ h } t[0] = c[0] + (c[7] << 16 | c[7] >>> 16) + (c[6] << 16 | c[6] >>> 16) | 0, t[1] = c[1] + (c[0] << 8 | c[0] >>> 24) + c[7] | 0, t[2] = c[2] + (c[1] << 16 | c[1] >>> 16) + (c[0] << 16 | c[0] >>> 16) | 0, t[3] = c[3] + (c[2] << 8 | c[2] >>> 24) + c[1] | 0, t[4] = c[4] + (c[3] << 16 | c[3] >>> 16) + (c[2] << 16 | c[2] >>> 16) | 0, t[5] = c[5] + (c[4] << 8 | c[4] >>> 24) + c[3] | 0, t[6] = c[6] + (c[5] << 16 | c[5] >>> 16) + (c[4] << 16 | c[4] >>> 16) | 0, t[7] = c[7] + (c[6] << 8 | c[6] >>> 24) + c[5] | 0 } var e = t, i = e.lib, n = i.StreamCipher, o = e.algo, s = [], a = [], c = [], h = o.RabbitLegacy = n.extend({ _doReset: function () { var t = this._key.words, e = this.cfg.iv, i = this._X = [t[0], t[3] << 16 | t[2] >>> 16, t[1], t[0] << 16 | t[3] >>> 16, t[2], t[1] << 16 | t[0] >>> 16, t[3], t[2] << 16 | t[1] >>> 16], n = this._C = [t[2] << 16 | t[2] >>> 16, 4294901760 & t[0] | 65535 & t[1], t[3] << 16 | t[3] >>> 16, 4294901760 & t[1] | 65535 & t[2], t[0] << 16 | t[0] >>> 16, 4294901760 & t[2] | 65535 & t[3], t[1] << 16 | t[1] >>> 16, 4294901760 & t[3] | 65535 & t[0]]; this._b = 0; for (var o = 0; o < 4; o++)r.call(this); for (var o = 0; o < 8; o++)n[o] ^= i[o + 4 & 7]; if (e) { var s = e.words, a = s[0], c = s[1], h = 16711935 & (a << 8 | a >>> 24) | 4278255360 & (a << 24 | a >>> 8), l = 16711935 & (c << 8 | c >>> 24) | 4278255360 & (c << 24 | c >>> 8), f = h >>> 16 | 4294901760 & l, u = l << 16 | 65535 & h; n[0] ^= h, n[1] ^= f, n[2] ^= l, n[3] ^= u, n[4] ^= h, n[5] ^= f, n[6] ^= l, n[7] ^= u; for (var o = 0; o < 4; o++)r.call(this) } }, _doProcessBlock: function (t, e) { var i = this._X; r.call(this), s[0] = i[0] ^ i[5] >>> 16 ^ i[3] << 16, s[1] = i[2] ^ i[7] >>> 16 ^ i[5] << 16, s[2] = i[4] ^ i[1] >>> 16 ^ i[7] << 16, s[3] = i[6] ^ i[3] >>> 16 ^ i[1] << 16; for (var n = 0; n < 4; n++)s[n] = 16711935 & (s[n] << 8 | s[n] >>> 24) | 4278255360 & (s[n] << 24 | s[n] >>> 8), t[e + n] ^= s[n] }, blockSize: 4, ivSize: 2 }); e.RabbitLegacy = n._createHelper(h) }(), t.pad.ZeroPadding = { pad: function (t, r) { var e = 4 * r; t.clamp(), t.sigBytes += e - (t.sigBytes % e || e) }, unpad: function (t) { for (var r = t.words, e = t.sigBytes - 1; !(r[e >>> 2] >>> 24 - e % 4 * 8 & 255);)e--; t.sigBytes = e + 1 } }, t
});

const $ = new Env('京喜工厂');
const JD_API_HOST = 'https://m.jingxi.com';
const notify = $.isNode() ? require('./sendNotify') : '';
let jdNotify = true;//是否关闭通知，false打开通知推送，true关闭通知推送
let tuanActiveId = ``, hasSend = false;
const jxOpenUrl = `openjd://virtual?params=%7B%20%22category%22:%20%22jump%22,%20%22des%22:%20%22m%22,%20%22url%22:%20%22https://wqsd.jd.com/pingou/dream_factory/index.html%22%20%7D`;
let cookiesArr = [], cookie = '', message = '', allMessage = '';
$.Qswitch =true; $.SQswitch=true;$.JQswitch=true;
const inviteCodes = [''];
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';$.SQSwitch = true;$.SJSwitch = true;
$.tuanIds = [];
$.appId = 10001;
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
  if (process.env.DREAMFACTORY_FORBID_ACCOUNT) process.env.DREAMFACTORY_FORBID_ACCOUNT.split('&').map((item, index) => Number(item) === 0 ? cookiesArr = [] : cookiesArr.splice(Number(item) - 1 - index, 1))
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
!(async () => {
  $.CryptoJS = $.isNode() ? require('crypto-js') : CryptoJS;
  await requestAlgo();
  await requireConfig();
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      message = '';
      $.ele = 0;
      $.pickEle = 0;
      $.pickFriendEle = 0;
      $.friendList = [];
      $.canHelpFlag = true;//能否助力朋友(招工)
      $.tuanNum = 0;//成团人数
      await TotalBean();
      console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      await jdDreamFactory()
    }
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.isLogin = true;
      $.canHelp = false;//能否参团
      await TotalBean();
      if (!$.isLogin) {
        continue
      }
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      if ((cookiesArr && cookiesArr.length >= ($.tuanNum || 5)) && $.canHelp) {
        console.log(`\n账号${$.UserName} 内部相互进团\n`);
        for (let item of $.tuanIds) {
          console.log(`\n${$.UserName} 去参加团 ${item}`);
          if (!$.canHelp) break;
          await JoinTuan(item);
          await $.wait(1000);
        }
      }
      //if ($.canHelp) await joinLeaderTuan();//参团
    }
  }
  if ($.isNode() && allMessage) {
    await notify.sendNotify(`${$.name}`, `${allMessage}`, { url: jxOpenUrl })
  }
})()
    .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
      $.done();
    })

async function jdDreamFactory() {
  try {
    await helpau()
    await Getusertoken();
    await userInfo();
    await QueryFriendList();//查询今日招工情况以及剩余助力次数
    // await joinLeaderTuan();//参团
    await helpFriends();
    if (!$.unActive) return
    // await collectElectricity()
    await getUserElectricity();
    await taskList();
    await investElectric();
    await QueryHireReward();//收取招工电力
    await PickUp();//收取自家的地下零件
    await stealFriend();
    await tuanActivity();
    await QueryAllTuan();
    await exchangeProNotify();
    await showMsg();
  } catch (e) {
    $.logErr(e)
  }
}


// 收取发电机的电力
function collectElectricity(facId = $.factoryId, help = false, master) {
  return new Promise(async resolve => {
    // let url = `/dreamfactory/generator/CollectCurrentElectricity?zone=dream_factory&apptoken=&pgtimestamp=&phoneID=&factoryid=${facId}&doubleflag=1&sceneval=2&g_login_type=1`;
    // if (help && master) {
    //   url = `/dreamfactory/generator/CollectCurrentElectricity?zone=dream_factory&factoryid=${facId}&master=${master}&sceneval=2&g_login_type=1`;
    // }
    let body = `factoryid=${facId}&apptoken=&pgtimestamp=&phoneID=&doubleflag=1`;
    if (help && master) {
      body += `factoryid=${facId}&master=${master}`;
    }
    $.get(taskurl(`generator/CollectCurrentElectricity`, body, `_time,apptoken,doubleflag,factoryid,pgtimestamp,phoneID,timeStamp,zone`), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              if (help) {
                $.ele += Number(data.data['loginPinCollectElectricity'])
                console.log(`帮助好友收取 ${data.data['CollectElectricity']} 电力，获得 ${data.data['loginPinCollectElectricity']} 电力`);
                message += `【帮助好友】帮助成功，获得 ${data.data['loginPinCollectElectricity']} 电力\n`
              } else {
                $.ele += Number(data.data['CollectElectricity'])
                console.log(`收取电力成功: 共${data.data['CollectElectricity']} `);
                message += `【收取发电站】收取成功，获得 ${data.data['CollectElectricity']} 电力\n`
              }
            } else {
              if (help) {
                console.log(`收取好友电力失败:${data.msg}\n`);
              } else {
                console.log(`收取电力失败:${data.msg}\n`);
              }
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

// 投入电力
function investElectric() {
  return new Promise(async resolve => {
    // const url = `/dreamfactory/userinfo/InvestElectric?zone=dream_factory&productionId=${$.productionId}&sceneval=2&g_login_type=1`;
    $.get(taskurl('userinfo/InvestElectric', `productionId=${$.productionId}`, `_time,productionId,zone`), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.ret === 0) {
              console.log(`成功投入电力${data.data.investElectric}电力`);
              message += `【投入电力】投入成功，共计 ${data.data.investElectric} 电力\n`;
            } else {
              console.log(`投入失败，${data.msg}`);
              message += `【投入电力】投入失败，${data.msg}\n`;
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

// 初始化任务
function taskList() {
  return new Promise(async resolve => {
    // const url = `/newtasksys/newtasksys_front/GetUserTaskStatusList?source=dreamfactory&bizCode=dream_factory&sceneval=2&g_login_type=1`;
    $.get(newtasksysUrl('GetUserTaskStatusList', '', `_time,bizCode,source`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            let userTaskStatusList = data['data']['userTaskStatusList'];
            for (let i = 0; i < userTaskStatusList.length; i++) {
              const vo = userTaskStatusList[i];
              if (vo['awardStatus'] !== 1) {
                if (vo.completedTimes >= vo.targetTimes) {
                  console.log(`任务：${vo.description}可完成`)
                  await completeTask(vo.taskId, vo.taskName)
                  await $.wait(1000);//延迟等待一秒
                } else {
                  switch (vo.taskType) {
                    case 2: // 逛一逛任务
                    case 6: // 浏览商品任务
                    case 9: // 开宝箱
                      for (let i = vo.completedTimes; i <= vo.configTargetTimes; ++i) {
                        console.log(`去做任务：${vo.taskName}`)
                        await doTask(vo.taskId)
                        await completeTask(vo.taskId, vo.taskName)
                        await $.wait(1000);//延迟等待一秒
                      }
                      break
                    case 4: // 招工
                      break
                    case 5:
                      // 收集类
                      break
                    case 1: // 登陆领奖
                    default:
                      break
                  }
                }
              }
            }
            console.log(`完成任务：共领取${$.ele}电力`)
            message += `【每日任务】领奖成功，共计 ${$.ele} 电力\n`;
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

// 获得用户电力情况
function getUserElectricity() {
  return new Promise(async resolve => {
    // const url = `/dreamfactory/generator/QueryCurrentElectricityQuantity?zone=dream_factory&factoryid=${$.factoryId}&sceneval=2&g_login_type=1`
    $.get(taskurl(`generator/QueryCurrentElectricityQuantity`, `factoryid=${$.factoryId}`, `_time,factoryid,zone`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              console.log(`发电机：当前 ${data.data.currentElectricityQuantity} 电力，最大值 ${data.data.maxElectricityQuantity} 电力`)
              if (data.data.currentElectricityQuantity < data.data.maxElectricityQuantity) {
                $.log(`\n本次发电机电力集满分享后${data.data.nextCollectDoubleFlag === 1 ? '可' : '不可'}获得双倍电力，${data.data.nextCollectDoubleFlag === 1 ? '故目前不收取电力' : '故现在收取电力'}\n`)
              }
              if (data.data.nextCollectDoubleFlag === 1) {
                if (data.data.currentElectricityQuantity === data.data.maxElectricityQuantity && data.data.doubleElectricityFlag) {
                  console.log(`发电机：电力可翻倍并收获`)
                  // await shareReport();
                  await collectElectricity()
                } else {
                  message += `【发电机电力】当前 ${data.data.currentElectricityQuantity} 电力，未达到收获标准\n`
                }
              } else {
                //再收取双倍电力达到上限时，直接收取，不再等到满级
                await collectElectricity()
              }
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

//查询有多少的招工电力可收取
function QueryHireReward() {
  return new Promise(async resolve => {
    // const url = `/dreamfactory/friend/HireAward?zone=dream_factory&date=${new Date().Format("yyyyMMdd")}&type=0&sceneval=2&g_login_type=1`
    $.get(taskurl('friend/QueryHireReward', ``, `_time,zone`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              for (let item of data['data']['hireReward']) {
                if (item.date !== new Date(new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000).Format("yyyyMMdd")) {
                  await hireAward(item.date, item.type);
                }
              }
            } else {
              console.log(`异常：${JSON.stringify(data)}`)
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
// 收取招工/劳模电力
function hireAward(date, type = 0) {
  return new Promise(async resolve => {
    // const url = `/dreamfactory/friend/HireAward?zone=dream_factory&date=${new Date().Format("yyyyMMdd")}&type=0&sceneval=2&g_login_type=1`
    $.get(taskurl('friend/HireAward', `date=${date}&type=${type}`, '_time,date,type,zone'), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              console.log(`打工电力：收取成功`)
              message += `【打工电力】：收取成功\n`
            } else {
              console.log(`打工电力：收取失败，${data.msg}`)
              message += `【打工电力】收取失败，${data.msg}\n`
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
async function helpFriends() {
  let Hours = new Date(new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000).getHours();
  if (Hours < 6) {
    console.log(`\n未到招工时间(每日6-24点之间可招工)\n`)
    return
  }
  if ($.canHelpFlag) {
    await shareCodesFormat();
    for (let code of $.newShareCodes) {
      if (code) {
        if ($.encryptPin === code) {
          console.log(`不能为自己助力,跳过`);
          continue;
        }
        const assistFriendRes = await assistFriend(code);
        if (assistFriendRes && assistFriendRes['ret'] === 0) {
          console.log(`助力朋友：${code}成功，因一次只能助力一个，故跳出助力`)
          break
        } else if (assistFriendRes && assistFriendRes['ret'] === 11009) {
          console.log(`助力朋友[${code}]失败：${assistFriendRes.msg}，跳出助力`);
          break
        } else {
          console.log(`助力朋友[${code}]失败：${assistFriendRes.msg}`)
        }
      }
    }
  } else {
    $.log(`\n今日助力好友机会已耗尽\n`);
  }
}
// 帮助用户,此处UA不可更换,否则助力功能会失效
function assistFriend(sharepin) {
  return new Promise(async resolve => {
    // const url = `/dreamfactory/friend/AssistFriend?zone=dream_factory&sharepin=${escape(sharepin)}&sceneval=2&g_login_type=1`
    // const options = {
    //   'url': `https://m.jingxi.com/dreamfactory/friend/AssistFriend?zone=dream_factory&sharepin=${escape(sharepin)}&sceneval=2&g_login_type=1`,
    //   'headers': {
    //     "Accept": "*/*",
    //     "Accept-Encoding": "gzip, deflate, br",
    //     "Accept-Language": "zh-cn",
    //     "Connection": "keep-alive",
    //     "Cookie": cookie,
    //     "Host": "m.jingxi.com",
    //     "Referer": "https://st.jingxi.com/pingou/dream_factory/index.html",
    //     "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36"
    //   }
    // }
    const options = taskurl('friend/AssistFriend', `sharepin=${escape(sharepin)}`, `_time,sharepin,zone`);
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            // if (data['ret'] === 0) {
            //   console.log(`助力朋友：${sharepin}成功`)
            // } else {
            //   console.log(`助力朋友[${sharepin}]失败：${data.msg}`)
            // }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
//查询助力招工情况
function QueryFriendList() {
  return new Promise(async resolve => {
    $.get(taskurl('friend/QueryFriendList', ``, `_time,zone`), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              data = data['data'];
              const { assistListToday = [], assistNumMax, hireListToday = [], hireNumMax } = data;
              console.log(`\n\n你今日还能帮好友打工（${assistNumMax - assistListToday.length || 0}/${assistNumMax}）次\n\n`);
              if (assistListToday.length === assistNumMax) {
                $.canHelpFlag = false;
              }
              $.log(`【今日招工进度】${hireListToday.length}/${hireNumMax}`);
              message += `【招工进度】${hireListToday.length}/${hireNumMax}\n`;
            } else {
              console.log(`QueryFriendList异常：${JSON.stringify(data)}`)
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
// 任务领奖
function completeTask(taskId, taskName) {
  return new Promise(async resolve => {
    // const url = `/newtasksys/newtasksys_front/Award?source=dreamfactory&bizCode=dream_factory&taskId=${taskId}&sceneval=2&g_login_type=1`;
    $.get(newtasksysUrl('Award', taskId, `_time,bizCode,source,taskId`), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            switch (data['data']['awardStatus']) {
              case 1:
                $.ele += Number(data['data']['prizeInfo'].replace('\\n', ''))
                console.log(`领取${taskName}任务奖励成功，收获：${Number(data['data']['prizeInfo'].replace('\\n', ''))}电力`);
                break
              case 1013:
              case 0:
                console.log(`领取${taskName}任务奖励失败，任务已领奖`);
                break
              default:
                console.log(`领取${taskName}任务奖励失败，${data['msg']}`)
                break
            }
            // if (data['ret'] === 0) {
            //   console.log("做任务完成！")
            // } else {
            //   console.log(`异常：${JSON.stringify(data)}`)
            // }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

// 完成任务
function doTask(taskId) {
  return new Promise(async resolve => {
    // const url = `/newtasksys/newtasksys_front/DoTask?source=dreamfactory&bizCode=dream_factory&taskId=${taskId}&sceneval=2&g_login_type=1`;
    $.get(newtasksysUrl('DoTask', taskId, '_time,bizCode,configExtra,source,taskId'), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              console.log("做任务完成！")
            } else {
              console.log(`DoTask异常：${JSON.stringify(data)}`)
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

// 初始化个人信息
function userInfo() {
  return new Promise(async resolve => {
    $.get(taskurl('userinfo/GetUserInfo', `pin=&sharePin=&shareType=&materialTuanPin=&materialTuanId=&source=`, '_time,materialTuanId,materialTuanPin,pin,sharePin,shareType,source,zone'), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              data = data['data'];
              $.unActive = true;//标记是否开启了京喜活动或者选购了商品进行生产
              $.encryptPin = '';
              $.shelvesList = [];
              if (data.factoryList && data.productionList) {
                const production = data.productionList[0];
                const factory = data.factoryList[0];
                const productionStage = data.productionStage;
                $.factoryId = factory.factoryId;//工厂ID
                $.productionId = production.productionId;//商品ID
                $.commodityDimId = production.commodityDimId;
                $.encryptPin = data.user.encryptPin;
                // subTitle = data.user.pin;
                await GetCommodityDetails();//获取已选购的商品信息
                if (productionStage['productionStageAwardStatus'] === 1) {
                  $.log(`可以开红包了\n`);
                  await DrawProductionStagePrize();//领取红包
                } else {
                  $.log(`再加${productionStage['productionStageProgress']}电力可开红包\n`)
                }
                console.log(`当前电力：${data.user.electric}`)
                console.log(`当前等级：${data.user.currentLevel}`)
                console.log(`\n【京东账号${$.index}（${$.UserName}）的${$.name}好友互助码】${data.user.encryptPin}`);
                console.log(`已投入电力：${production.investedElectric}`);
                console.log(`所需电力：${production.needElectric}`);
                console.log(`生产进度：${((production.investedElectric / production.needElectric) * 100).toFixed(2)}%`);
                message += `【京东账号${$.index}】${$.nickName}\n`
                message += `【生产商品】${$.productName}\n`;
                message += `【当前等级】${data.user.userIdentity} ${data.user.currentLevel}\n`;
                message += `【生产进度】${((production.investedElectric / production.needElectric) * 100).toFixed(2)}%\n`;
                if (production.investedElectric >= production.needElectric) {
                  if (production['exchangeStatus'] === 1) $.log(`\n\n可以兑换商品了`)
                  if (production['exchangeStatus'] === 3) {
                    $.log(`\n\n商品兑换已超时`)
                    if (new Date().getHours() === 9) {
                      $.msg($.name, '', `【京东账号${$.index}】${$.nickName}\n【生产商品】${$.productName}兑换已超时，请选择新商品进行制造`)
                      allMessage += `【京东账号${$.index}】${$.nickName}\n【生产商品】${$.productName}兑换已超时，请选择新商品进行制造${$.index !== cookiesArr.length ? '\n\n' : ''}`;
                    }
                  }
                  // await exchangeProNotify()
                } else {
                  console.log(`\n\n预计最快还需 【${((production.needElectric - production.investedElectric) / (2 * 60 * 60 * 24)).toFixed(2)}天】生产完毕\n\n`)
                }
                if (production.status === 3) {
                  $.log(`\n\n商品生产已失效`)
                  $.msg($.name, '', `【京东账号${$.index}】${$.nickName}\n【生产商品】${$.productName}\n【超时未完成】已失效，请选择新商品进行制造`)
                  allMessage += `【京东账号${$.index}】${$.nickName}\n【生产商品】${$.productName}\n【超时未完成】已失效，请选择新商品进行制造${$.index !== cookiesArr.length ? '\n\n' : ''}`;
                }
              } else {
                $.unActive = false;//标记是否开启了京喜活动或者选购了商品进行生产
                if (!data.factoryList) {
                  console.log(`【提示】京东账号${$.index}[${$.nickName}]京喜工厂活动未开始\n请手动去京东APP->游戏与互动->查看更多->京喜工厂 开启活动\n`);
                  // $.msg($.name, '【提示】', `京东账号${$.index}[${$.nickName}]京喜工厂活动未开始\n请手动去京东APP->游戏与互动->查看更多->京喜工厂 开启活动`);
                } else if (data.factoryList && !data.productionList) {
                  console.log(`【提示】京东账号${$.index}[${$.nickName}]京喜工厂未选购商品\n请手动去京东APP->游戏与互动->查看更多->京喜工厂 选购\n`)
                  let nowTimes = new Date(new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000);
                  if (nowTimes.getHours()  === 12) {
                    //如按每小时运行一次，则此处将一天12点推送1次提醒
                    $.msg($.name, '提醒⏰', `京东账号${$.index}[${$.nickName}]京喜工厂未选择商品\n请手动去京东APP->游戏与互动->查看更多->京喜工厂 选择商品`);
                    // if ($.isNode()) await notify.sendNotify(`${$.name} - 京东账号${$.index} - ${$.nickName}`, `京东账号${$.index}[${$.nickName}]京喜工厂未选择商品\n请手动去京东APP->游戏与互动->查看更多->京喜工厂 选择商品`)
                    if ($.isNode()) allMessage += `京东账号${$.index}[${$.nickName}]京喜工厂未选择商品\n请手动去京东APP->游戏与互动->查看更多->京喜工厂 选择商品${$.index !== cookiesArr.length ? '\n\n' : ''}`
                  }
                }
              }
            } else {
              console.log(`GetUserInfo异常：${JSON.stringify(data)}`)
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
//查询当前生产的商品名称
function GetCommodityDetails() {
  return new Promise(async resolve => {
    // const url = `/dreamfactory/diminfo/GetCommodityDetails?zone=dream_factory&sceneval=2&g_login_type=1&commodityId=${$.commodityDimId}`;
    $.get(taskurl('diminfo/GetCommodityDetails', `commodityId=${$.commodityDimId}`, `_time,commodityId,zone`), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              data = data['data'];
              $.productName = data['commodityList'][0].name;
            } else {
              console.log(`GetCommodityDetails异常：${JSON.stringify(data)}`)
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
// 查询已完成商品
function GetShelvesList(pageNo = 1) {
  return new Promise(async resolve => {
    $.get(taskurl('userinfo/GetShelvesList', `pageNo=${pageNo}&pageSize=12`, `_time,pageNo,pageSize,zone`), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              data = data['data'];
              const { shelvesList } = data;
              if (shelvesList) {
                $.shelvesList = [...$.shelvesList, ...shelvesList];
                pageNo ++
                GetShelvesList(pageNo);
              }
            } else {
              console.log(`GetShelvesList异常：${JSON.stringify(data)}`)
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
//领取红包
function DrawProductionStagePrize() {
  return new Promise(async resolve => {
    // const url = `/dreamfactory/userinfo/DrawProductionStagePrize?zone=dream_factory&sceneval=2&g_login_type=1&productionId=${$.productionId}`;
    $.get(taskurl('userinfo/DrawProductionStagePrize', `productionId=${$.productionId}`, `_time,productionId,zone`), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          console.log(`开幸运红包：${data}`);
          // if (safeGet(data)) {
          //   data = JSON.parse(data);
          //   if (data['ret'] === 0) {
          //
          //   } else {
          //     console.log(`异常：${JSON.stringify(data)}`)
          //   }
          // }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
async function PickUp(encryptPin = $.encryptPin, help = false) {
  $.pickUpMyselfComponent = true;
  const GetUserComponentRes = await GetUserComponent(encryptPin, 1500);
  if (GetUserComponentRes && GetUserComponentRes['ret'] === 0 && GetUserComponentRes['data']) {
    const { componentList } = GetUserComponentRes['data'];
    if (componentList && componentList.length <= 0) {
      if (help) {
        $.log(`好友【${encryptPin}】地下暂无零件可收\n`)
      } else {
        $.log(`自家地下暂无零件可收\n`)
      }
      $.pickUpMyselfComponent = false;
    }
    for (let item of componentList) {
      await $.wait(1000);
      const PickUpComponentRes = await PickUpComponent(item['placeId'], encryptPin);
      if (PickUpComponentRes) {
        if (PickUpComponentRes['ret'] === 0) {
          const data = PickUpComponentRes['data'];
          if (help) {
            console.log(`收取好友[${encryptPin}]零件成功:获得${data['increaseElectric']}电力\n`);
            $.pickFriendEle += data['increaseElectric'];
          } else {
            console.log(`收取自家零件成功:获得${data['increaseElectric']}电力\n`);
            $.pickEle += data['increaseElectric'];
          }
        } else {
          if (help) {
            console.log(`收好友[${encryptPin}]零件失败：${PickUpComponentRes.msg},直接跳出\n`)
          } else {
            console.log(`收自己地下零件失败：${PickUpComponentRes.msg},直接跳出\n`);
            $.pickUpMyselfComponent = false;
          }
          break
        }
      }
    }
  }
}
function GetUserComponent(pin = $.encryptPin, timeout = 0) {
  return new Promise(resolve => {
    setTimeout(() => {
      $.get(taskurl('usermaterial/GetUserComponent', `pin=${pin}`, `_time,pin,zone`), (err, resp, data) => {
        try {
          if (err) {
            console.log(`${JSON.stringify(err)}`)
            console.log(`${$.name} API请求失败，请检查网路重试`)
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data);
              if (data['ret'] === 0) {

              } else {
                console.log(`GetUserComponent失败：${JSON.stringify(data)}`)
              }
            }
          }
        } catch (e) {
          $.logErr(e, resp)
        } finally {
          resolve(data);
        }
      })
    }, timeout)
  })
}
//收取地下随机零件电力API

function PickUpComponent(index, encryptPin) {
  return new Promise(resolve => {
    $.get(taskurl('usermaterial/PickUpComponent', `placeId=${index}&pin=${encryptPin}`, `_time,pin,placeId,zone`), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            // if (data['ret'] === 0) {
            //   data = data['data'];
            //   if (help) {
            //     console.log(`收取好友[${encryptPin}]零件成功:获得${data['increaseElectric']}电力\n`);
            //     $.pickFriendEle += data['increaseElectric'];
            //   } else {
            //     console.log(`收取自家零件成功:获得${data['increaseElectric']}电力\n`);
            //     $.pickEle += data['increaseElectric'];
            //   }
            // } else {
            //   if (help) {
            //     console.log(`收好友[${encryptPin}]零件失败：${JSON.stringify(data)}`)
            //   } else {
            //     console.log(`收零件失败：${JSON.stringify(data)}`)
            //   }
            // }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
//偷好友的电力
async function stealFriend() {
  // if (!$.pickUpMyselfComponent) {
  //   $.log(`今日收取零件已达上限，偷好友零件也达到上限，故跳出`)
  //   return
  // }
  //调整，只在每日1点，12点，19点尝试收取好友零件
  if (new Date().getHours() !== 1 && new Date().getHours() !== 12 && new Date().getHours() !== 19) return
  await getFriendList();
  $.friendList = [...new Set($.friendList)].filter(vo => !!vo && vo['newFlag'] !== 1);
  console.log(`查询好友列表完成，共${$.friendList.length}好友，下面开始拾取好友地下的零件\n`);
  for (let i = 0; i < $.friendList.length; i++) {
    let pin = $.friendList[i]['encryptPin'];//好友的encryptPin
    console.log(`\n开始收取第 ${i + 1} 个好友 【${$.friendList[i]['nickName']}】 地下零件 collectFlag：${$.friendList[i]['collectFlag']}`)
    await PickUp(pin, true);
    // await getFactoryIdByPin(pin);//获取好友工厂ID
    // if ($.stealFactoryId) await collectElectricity($.stealFactoryId,true, pin);
  }
}
function getFriendList(sort = 0) {
  return new Promise(async resolve => {
    $.get(taskurl('friend/QueryFactoryManagerList', `sort=${sort}`, `_time,sort,zone`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              data = data['data'];
              if (data.list && data.list.length <= 0) {
                // console.log(`查询好友列表完成，共${$.friendList.length}好友，下面开始拾取好友地下的零件\n`);
                return
              }
              let friendsEncryptPins = [];
              for (let item of data.list) {
                friendsEncryptPins.push(item);
              }
              $.friendList = [...$.friendList, ...friendsEncryptPins];
              // if (!$.isNode()) return
              await getFriendList(data.sort);
            } else {
              console.log(`QueryFactoryManagerList异常：${JSON.stringify(data)}`)
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
function getFactoryIdByPin(pin) {
  return new Promise((resolve, reject) => {
    // const url = `/dreamfactory/userinfo/GetUserInfoByPin?zone=dream_factory&pin=${pin}&sceneval=2`;
    $.get(taskurl('userinfo/GetUserInfoByPin', `pin=${pin}`), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              if (data.data.factoryList) {
                //做此判断,有时候返回factoryList为null
                // resolve(data['data']['factoryList'][0]['factoryId'])
                $.stealFactoryId = data['data']['factoryList'][0]['factoryId'];
              }
            } else {
              console.log(`异常：${JSON.stringify(data)}`)
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
async function tuanActivity() {
  const tuanConfig = await QueryActiveConfig();
  if (tuanConfig && tuanConfig.ret === 0) {
    const { activeId, surplusOpenTuanNum, tuanId } = tuanConfig['data']['userTuanInfo'];
    console.log(`今日剩余开团次数：${surplusOpenTuanNum}次`);
    $.surplusOpenTuanNum = surplusOpenTuanNum;
    if (!tuanId && surplusOpenTuanNum > 0) {
      //开团
      $.log(`准备开团`)
      await CreateTuan();
    } else if (tuanId) {
      //查询词团信息
      const QueryTuanRes = await QueryTuan(activeId, tuanId);
      if (QueryTuanRes && QueryTuanRes.ret === 0) {
        const { tuanInfo } = QueryTuanRes.data;
        if ((tuanInfo && tuanInfo[0]['endTime']) <= QueryTuanRes['nowTime'] && surplusOpenTuanNum > 0) {
          $.log(`之前的团已过期，准备重新开团\n`)
          await CreateTuan();
        }
        for (let item of tuanInfo) {
          const { realTuanNum, tuanNum, userInfo } = item;
          $.tuanNum = tuanNum || 0;
          $.log(`\n开团情况:${realTuanNum}/${tuanNum}\n`);
          if (realTuanNum === tuanNum) {
            for (let user of userInfo) {
              if (user.encryptPin === $.encryptPin) {
                if (user.receiveElectric && user.receiveElectric > 0) {
                  console.log(`您在${new Date(user.joinTime * 1000).toLocaleString()}开团奖励已经领取成功\n`)
                  if ($.surplusOpenTuanNum > 0) await CreateTuan();
                } else {
                  $.log(`开始领取开团奖励`);
                  await tuanAward(item.tuanActiveId, item.tuanId);//isTuanLeader
                }
              }
            }
          } else {
            $.tuanIds.push(tuanId);
            $.log(`\n此团未达领取团奖励人数：${tuanNum}人\n`)
          }
        }
      }
    }
  }
}
async function joinLeaderTuan() {
  let res = await updateTuanIdsCDN(), res2 = await updateTuanIdsCDN("https://gitee.com/shylocks/updateTeam/raw/main/jd_updateFactoryTuanId.json")
  $.authorTuanIds = [...(res && res.tuanIds || []),...(res2 && res2.tuanIds || [])]
  if ($.authorTuanIds && $.authorTuanIds.length) {
    console.log(`\n参加作者的团`);
    for (let tuanId of $.authorTuanIds) {
      if (!tuanId) continue
      if (!$.canHelp) break;
      console.log(`\n账号${$.UserName} 参加作者的团 【${tuanId}】`);
      await JoinTuan(tuanId);
      await $.wait(1000);
    }
  }
}
//可获取开团后的团ID，如果团ID为空并且surplusOpenTuanNum>0，则可继续开团
//如果团ID不为空，则查询QueryTuan()
function QueryActiveConfig() {
  return new Promise((resolve) => {
    const body = `activeId=${escape(tuanActiveId)}&tuanId=`;
    const options = taskTuanUrl(`QueryActiveConfig`, body, `_time,activeId,tuanId`)
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              const { userTuanInfo } = data['data'];
              console.log(`\n团活动ID  ${userTuanInfo.activeId}`);
              console.log(`团ID  ${userTuanInfo.tuanId}\n`);
            } else {
              console.log(`QueryActiveConfig异常：${JSON.stringify(data)}`);
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
function QueryTuan(activeId, tuanId) {
  return new Promise((resolve) => {
    const body = `activeId=${escape(activeId)}&tuanId=${escape(tuanId)}`;
    const options = taskTuanUrl(`QueryTuan`, body, `_time,activeId,tuanId`)
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              // $.log(`\n开团情况:${data.data.tuanInfo.realTuanNum}/${data.data.tuanInfo.tuanNum}\n`)
            } else {
              console.log(`异常：${JSON.stringify(data)}`);
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
//开团API
function CreateTuan() {
  return new Promise((resolve) => {
    const body =`activeId=${escape(tuanActiveId)}&isOpenApp=1`
    const options = taskTuanUrl(`CreateTuan`, body, '_time,activeId,isOpenApp')
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              console.log(`【开团成功】tuanId为 ${data.data['tuanId']}`);
              $.tuanIds.push(data.data['tuanId']);
            } else {
              //{"msg":"活动已结束，请稍后再试~","nowTime":1621551005,"ret":10218}
              if (data['ret'] === 10218 && !hasSend && (new Date().getHours() % 6 === 0)) {
                hasSend = true;
                $.msg($.name, '', `京喜工厂拼团瓜分电力活动团ID（activeId）已失效\n请自行抓包替换(Node环境变量为TUAN_ACTIVEID，iOS端在BoxJx)或者联系作者等待更新`);
                //if ($.isNode()) await notify.sendNotify($.name, `京喜工厂拼团瓜分电力活动团ID（activeId）已失效\n请自行抓包替换(Node环境变量为TUAN_ACTIVEID，iOS端在BoxJx)或者联系作者等待更新`)
              }
              console.log(`开团异常：${JSON.stringify(data)}`);
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function JoinTuan(tuanId, stk = '_time,activeId,tuanId') {
  return new Promise((resolve) => {
    const body = `activeId=${escape(tuanActiveId)}&tuanId=${escape(tuanId)}`;
    const options = taskTuanUrl(`JoinTuan`, body, '_time,activeId,tuanId')
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              console.log(`参团成功：${JSON.stringify(data)}\n`);
            } else if (data['ret'] === 10005 || data['ret'] === 10206) {
              //火爆，或者今日参团机会已耗尽
              console.log(`参团失败：${JSON.stringify(data)}\n`);
              $.canHelp = false;
            } else {
              console.log(`参团失败：${JSON.stringify(data)}\n`);
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
//查询所有的团情况(自己开团以及参加别人的团)
function QueryAllTuan() {
  return new Promise((resolve) => {
    const body = `activeId=${escape(tuanActiveId)}&pageNo=1&pageSize=10`;
    const options = taskTuanUrl(`QueryAllTuan`, body, '_time,activeId,pageNo,pageSize')
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              const { tuanInfo } = data;
              for (let item of tuanInfo) {
                if (item.tuanNum === item.realTuanNum) {
                  // console.log(`参加团主【${item.tuanLeader}】已成功`)
                  const { userInfo } = item;
                  for (let item2 of userInfo) {
                    if (item2.encryptPin === $.encryptPin) {
                      if (item2.receiveElectric && item2.receiveElectric > 0) {
                        console.log(`${new Date(item2.joinTime * 1000).toLocaleString()}参加团主【${item2.nickName}】的奖励已经领取成功`)
                      } else {
                        console.log(`开始领取${new Date(item2.joinTime * 1000).toLocaleString()}参加团主【${item2.nickName}】的奖励`)
                        await tuanAward(item.tuanActiveId, item.tuanId, item.tuanLeader === $.encryptPin);//isTuanLeader
                      }
                    }
                  }
                } else {
                  console.log(`${new Date(item.beginTime * 1000).toLocaleString()}参加团主【${item.tuanLeader}】失败`)
                }
              }
            } else {
              console.log(`QueryAllTuan异常：${JSON.stringify(data)}`);
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
//开团人的领取奖励API
function tuanAward(activeId, tuanId, isTuanLeader = true) {
  return new Promise((resolve) => {
    const body = `activeId=${escape(activeId)}&tuanId=${escape(tuanId)}`;
    const options = taskTuanUrl(`Award`, body, '_time,activeId,tuanId')
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              if (isTuanLeader) {
                console.log(`开团奖励(团长)${data.data['electric']}领取成功`);
                message += `【开团(团长)奖励】${data.data['electric']}领取成功\n`;
                if ($.surplusOpenTuanNum > 0) {
                  $.log(`开团奖励(团长)已领取，准备开团`);
                  await CreateTuan();
                }
              } else {
                console.log(`参团奖励${data.data['electric']}领取成功`);
                message += `【参团奖励】${data.data['electric']}领取成功\n`;
              }
            } else if (data['ret'] === 10212) {
              console.log(`${JSON.stringify(data)}`);

              if (isTuanLeader && $.surplusOpenTuanNum > 0) {
                $.log(`团奖励已领取，准备开团`);
                await CreateTuan();
              }
            } else {
              console.log(`异常：${JSON.stringify(data)}`);
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function updateTuanIdsCDN(url = 'https://cdn.jsdelivr.net/gh/gitupdate/updateTeam@master/shareCodes/jd_updateFactoryTuanId.json') {
  return new Promise(async resolve => {
    $.get({url,
      timeout: 200000,
      headers:{
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
      }}, (err, resp, data) => {
      try {
        if (err) {
          // console.log(`${JSON.stringify(err)}`)
        } else {
          if (safeGet(data)) {
            $.tuanConfigs = data = JSON.parse(data);
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
    await $.wait(20000)
    resolve();
  })
}

//商品可兑换时的通知
async function exchangeProNotify() {
  await GetShelvesList();
  let exchangeEndTime, exchangeEndHours, nowHours;
  //脚本运行的UTC+8时区的时间戳
  let nowTimes = new Date(new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000);
  if ($.shelvesList && $.shelvesList.length > 0) console.log(`\n  商品名     兑换状态`)
  for (let shel of $.shelvesList) {
    console.log(`${shel['name']}    ${shel['exchangeStatus'] === 1 ? '未兑换' : shel['exchangeStatus'] === 2 ? '已兑换' : '兑换超时'}`)
    if (shel['exchangeStatus'] === 1) {
      exchangeEndTime = shel['exchangeEndTime'] * 1000;
      $.picture = shel['picture'];
      // 兑换截止时间点
      exchangeEndHours = new Date(exchangeEndTime + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000).getHours();
      //兑换截止时间(年月日 时分秒)
      $.exchangeEndTime = new Date(exchangeEndTime + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000).toLocaleString('zh', {hour12: false});
      //脚本运行此时的时间点
      nowHours = nowTimes.getHours();
    } else if (shel['exchangeStatus'] === 3) {
      //兑换超时
    }
  }
  if (exchangeEndTime) {
    //比如兑换(超时)截止时间是2020/12/8 09:20:04,现在时间是2020/12/6
    if (nowTimes < exchangeEndTime) {
      // 一:在兑换超时这一天(2020/12/8 09:20:04)的前3小时内通知
      if ((exchangeEndTime - nowTimes.getTime()) <= 3600000 * 3) {
        let expiredTime = parseInt(((exchangeEndTime - nowTimes.getTime()) / (60*60*1000)).toFixed(1))
        $.msg($.name, ``, `【京东账号${$.index}】${$.nickName}\n【生产商品】${$.productName}${expiredTime}小时后兑换超时\n【兑换截止时间】${$.exchangeEndTime}\n请速去京喜APP->首页->好物0元造进行兑换`, {'open-url': jxOpenUrl, 'media-url': $.picture})
        // if ($.isNode()) await notify.sendNotify(`${$.name} - 京东账号${$.index} - ${$.nickName}`, `【京东账号${$.index}】${$.nickName}\n【生产商品】${$.productName}${(exchangeEndTime - nowTimes) / 60*60*1000}分钟后兑换超时\n【兑换截止时间】${$.exchangeEndTime}\n请速去京喜APP->首页->好物0元造进行兑换`, { url: jxOpenUrl })
        if ($.isNode()) allMessage += `【京东账号${$.index}】${$.nickName}\n【生产商品】${$.productName}${expiredTime}小时后兑换超时\n【兑换截止时间】${$.exchangeEndTime}\n请速去京喜APP->首页->好物0元造进行兑换${$.index !== cookiesArr.length ? '\n\n' : ''}`
      }
      //二:在可兑换的时候，一天通知2次(2020/12/6 10,11点,以及在2020/12/7 10,11点各通知一次)
      if (nowHours === (exchangeEndHours + 1) || nowHours === (exchangeEndHours + 2)) {
        $.msg($.name, ``, `【京东账号${$.index}】${$.nickName}\n【生产商品】${$.productName}已可兑换\n【兑换截止时间】${$.exchangeEndTime}\n请速去京喜APP->首页->好物0元造进行兑换`, {'open-url': jxOpenUrl, 'media-url': $.picture})
        // if ($.isNode()) await notify.sendNotify(`${$.name} - 京东账号${$.index} - ${$.nickName}`, `【京东账号${$.index}】${$.nickName}\n【生产商品】${$.productName}已可兑换\n【兑换截止时间】${$.exchangeEndTime}\n请速去京喜APP->首页->好物0元造进行兑换`, { url: jxOpenUrl })
        if ($.isNode()) allMessage += `【京东账号${$.index}】${$.nickName}\n【生产商品】${$.productName}已可兑换\n【兑换截止时间】${$.exchangeEndTime}\n请速去京喜APP->首页->好物0元造进行兑换${$.index !== cookiesArr.length ? '\n\n' : ''}`
      }
    }
  }
}
async function showMsg() {
  return new Promise(async resolve => {
    message += `【收取自己零件】${$.pickUpMyselfComponent ? `获得${$.pickEle}电力` : `今日已达上限`}\n`;
    message += `【收取好友零件】${$.pickUpMyselfComponent ? `获得${$.pickFriendEle}电力` : `今日已达上限`}\n`;
    if ($.isNode() && process.env.DREAMFACTORY_NOTIFY_CONTROL) {
      $.ctrTemp = `${process.env.DREAMFACTORY_NOTIFY_CONTROL}` === 'false';
    } else if ($.getdata('jdDreamFactory')) {
      $.ctrTemp = $.getdata('jdDreamFactory') === 'false';
    } else {
      $.ctrTemp = `${jdNotify}` === 'false';
    }
    if (new Date().getHours() === 22) {
      $.msg($.name, '', `${message}`)
      $.log(`\n${message}`);
    } else {
      $.log(`\n${message}`);
    }
    resolve()
  })
}
function readShareCode() {
  console.log(`开始`)
  return new Promise(async resolve => {
    $.get({url: "https://wuzhi03.coding.net/p/dj/d/RandomShareCode/git/raw/main/JD_Dream_Factory.json",headers:{
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
    }}, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            console.log(`取助力码放到您固定的互助码后面(不影响已有固定互助)`)
            data = JSON.parse(data);
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
    await $.wait(10000);
    resolve()
  })
}
//格式化助力码
function shareCodesFormat() {
  return new Promise(async resolve => {
    // console.log(`第${$.index}个京东账号的助力码:::${$.shareCodesArr[$.index - 1]}`)
    $.newShareCodes = ['CntxZMVPRPrnRwDGEdKCng','nI0EvC7t1MQV_YTaQKS4cA==','jldY4DzQ4BTcnLVlbOYbhA==','Gy9KrAI8iGF03ENq55vY3w==','77U7hJcIxAsrYWfQPd3qAg==','npVP727-ATXQMoSbYwvfeg==','H-tO6oRBU8ge6ZKvLu_9Pw==','EaWE-_l2oW8vOmUB5qJ5Zg==','OpdZTI0kWvpwhhmKak9nTQ==','kYG2iukfwBw2HkULET49tg==','kRHuXQBCCRZ7B2EqX6RjuA==','y_pZE2xvUtJhxi78tmKZsg==','yrD7XOeiJi51-VNXVy3Ztw==','i4i9s_EF87Ypo-BMDbBJhA==','uyEXVo5BycEScPNEGulqgQ==','B9Uta0hML0oe6qFcYcvWgp7h8m--7KHZL0Bn-jTS1_0='];
    if ($.shareCodesArr[$.index - 1]) {
      $.newShareCodes = $.newShareCodes.concat($.shareCodesArr[$.index - 1].split('@'));
    } /*else {
      console.log(`由于您第${$.index}个京东账号未提供shareCode,将采纳本脚本自带的助力码\n`)
      const tempIndex = $.index > inviteCodes.length ? (inviteCodes.length - 1) : ($.index - 1);
      $.newShareCodes = inviteCodes[tempIndex].split('@');
    }*/
    /*const readShareCodeRes = await readShareCode();
    if (readShareCodeRes && readShareCodeRes.code === 200) {
      $.newShareCodes = [...new Set([...$.newShareCodes, ...(readShareCodeRes.data || [])])];
    }*/
    console.log(`第${$.index}个京东账号将要助力的好友${JSON.stringify($.newShareCodes)}`)
    resolve();
  })
}
function requireConfig() {
  return new Promise(async resolve => {
    tuanActiveId = $.isNode() ? (process.env.TUAN_ACTIVEID || tuanActiveId) : ($.getdata('tuanActiveId') || tuanActiveId);
    if (!tuanActiveId) {
      await updateTuanIdsCDN();
      if ($.tuanConfigs && $.tuanConfigs['tuanActiveId']) {
        tuanActiveId = $.tuanConfigs['tuanActiveId'];
        console.log(`拼团活动ID: 获取成功 ${tuanActiveId}\n`)
      } else {
        if (!$.tuanConfigs) {
          await updateTuanIdsCDN('https://cdn.jsdelivr.net/gh/gitupdate/updateTeam@master/shareCodes/jd_updateFactoryTuanId.json');
          if ($.tuanConfigs && $.tuanConfigs['tuanActiveId']) {
            tuanActiveId = $.tuanConfigs['tuanActiveId'];
            console.log(`拼团活动ID: 获取成功 ${tuanActiveId}\n`)
          } else {
            console.log(`拼团活动ID：获取失败，将采取脚本内置活动ID\n`)
          }
        }
      }
    } else {
      console.log(`自定义拼团活动ID: 获取成功 ${tuanActiveId}`)
    }
    console.log(`开始获取${$.name}配置文件\n`);
    //Node.js用户请在jdCookie.js处填写京东ck;
    const shareCodes = $.isNode() ? require('./jdDreamFactoryShareCodes.js') : '';
    console.log(`共${cookiesArr.length}个京东账号\n`);
    $.shareCodesArr = [];
    if ($.isNode()) {
      Object.keys(shareCodes).forEach((item) => {
        if (shareCodes[item]) {
          $.shareCodesArr.push(shareCodes[item])
        }
      })
    } else {
      if ($.getdata('jd_jxFactory')) $.shareCodesArr = $.getdata('jd_jxFactory').split('\n').filter(item => item !== "" && item !== null && item !== undefined);
      console.log(`\nBoxJs设置的${$.name}好友邀请码:${$.getdata('jd_jxFactory')}\n`);
    }
    // console.log(`\n种豆得豆助力码::${JSON.stringify($.shareCodesArr)}`);
    console.log(`您提供了${$.shareCodesArr.length}个账号的${$.name}助力码\n`);
    resolve()
  })
}
function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      "url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
      "headers": {
        "Accept": "application/json,text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1"
      }
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['retcode'] === 13) {
              $.isLogin = false; //cookie过期
              return
            }
            if (data['retcode'] === 0) {
              $.nickName = (data['base'] && data['base'].nickname) || $.UserName;
            } else {
              $.nickName = $.UserName
            }
          } else {
            console.log(`京东服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
function safeGet(data) {
  try {
    if (typeof JSON.parse(data) == "object") {
      return true;
    }
  } catch (e) {
    console.log(e);
    console.log(`京东服务器访问数据为空，请检查自身设备网络情况`);
    return false;
  }
}
function taskTuanUrl(functionId, body = '', stk) {
  let url = `https://m.jingxi.com/dreamfactory/tuan/${functionId}?${body}&_time=${Date.now()}&_=${Date.now() + 2}&sceneval=2&g_login_type=1&_ste=1`
  url += `&h5st=${decrypt(Date.now(), stk || '', '', url)}`
  if (stk) {
    url += `&_stk=${encodeURIComponent(stk)}`;
  }
  return {
    url,
    headers: {
      "Accept": "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-cn",
      "Connection": "keep-alive",
      "Cookie": cookie,
      "Host": "m.jingxi.com",
      "Referer": "https://st.jingxi.com/pingou/dream_factory/divide.html",
      "User-Agent": "jdpingou"
    }
  }
}

function taskurl(functionId, body = '', stk) {
  let url = `${JD_API_HOST}/dreamfactory/${functionId}?zone=dream_factory&${body}&sceneval=2&g_login_type=1&_time=${Date.now()}&_=${Date.now() + 2}&_ste=1`
  url += `&h5st=${decrypt(Date.now(), stk, '', url)}`
  if (stk) {
    url += `&_stk=${encodeURIComponent(stk)}`;
  }
  return {
    url,
    headers: {
      'Cookie': cookie,
      'Host': 'm.jingxi.com',
      'Accept': '*/*',
      'Connection': 'keep-alive',
      'User-Agent': functionId === 'AssistFriend' ? "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36" : 'jdpingou',
      'Accept-Language': 'zh-cn',
      'Referer': 'https://wqsd.jd.com/pingou/dream_factory/index.html',
      'Accept-Encoding': 'gzip, deflate, br',
    }
  }
}
function newtasksysUrl(functionId, taskId, stk) {
  let url = `${JD_API_HOST}/newtasksys/newtasksys_front/${functionId}?source=dreamfactory&bizCode=dream_factory&sceneval=2&g_login_type=1&_time=${Date.now()}&_=${Date.now() + 2}&_ste=1`;
  if (taskId) {
    url += `&taskId=${taskId}`;
  }
  if (stk) {
    url += `&_stk=${stk}`;
  }
  //传入url进行签名
  url += `&h5st=${decrypt(Date.now(), stk, '', url)}`
  return {
    url,
    "headers": {
      'Cookie': cookie,
      'Host': 'm.jingxi.com',
      'Accept': '*/*',
      'Connection': 'keep-alive',
      'User-Agent': "jdpingou;iPhone;3.15.2;13.5.1;90bab9217f465a83a99c0b554a946b0b0d5c2f7a;network/wifi;model/iPhone12,1;appBuild/100365;ADID/696F8BD2-0820-405C-AFC0-3C6D028040E5;supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/1;hasOCPay/0;supportBestPay/0;session/14;pap/JA2015_311210;brand/apple;supportJDSHWK/1;",
      'Accept-Language': 'zh-cn',
      'Referer': 'https://wqsd.jd.com/pingou/dream_factory/index.html',
      'Accept-Encoding': 'gzip, deflate, br',
    }
  }
}
/*
修改时间戳转换函数，京喜工厂原版修改
 */
Date.prototype.Format = function (fmt) {
  var e,
      n = this, d = fmt, l = {
        "M+": n.getMonth() + 1,
        "d+": n.getDate(),
        "D+": n.getDate(),
        "h+": n.getHours(),
        "H+": n.getHours(),
        "m+": n.getMinutes(),
        "s+": n.getSeconds(),
        "w+": n.getDay(),
        "q+": Math.floor((n.getMonth() + 3) / 3),
        "S+": n.getMilliseconds()
      };
  /(y+)/i.test(d) && (d = d.replace(RegExp.$1, "".concat(n.getFullYear()).substr(4 - RegExp.$1.length)));
  for (var k in l) {
    if (new RegExp("(".concat(k, ")")).test(d)) {
      var t, a = "S+" === k ? "000" : "00";
      d = d.replace(RegExp.$1, 1 == RegExp.$1.length ? l[k] : ("".concat(a) + l[k]).substr("".concat(l[k]).length))
    }
  }
  return d;
}
function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.log(e);
      $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
      return [];
    }
  }
}
async function requestAlgo() {
  $.fingerprint = await generateFp();
  const options = {
    "url": `https://cactus.jd.com/request_algo?g_ty=ajax`,
    "headers": {
      'Authority': 'cactus.jd.com',
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache',
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
      'Content-Type': 'application/json',
      'Origin': 'https://st.jingxi.com',
      'Sec-Fetch-Site': 'cross-site',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Dest': 'empty',
      'Referer': 'https://st.jingxi.com/',
      'Accept-Language': 'zh-CN,zh;q=0.9,zh-TW;q=0.8,en;q=0.7'
    },
    'body': JSON.stringify({
      "version": "1.0",
      "fp": $.fingerprint,
      "appId": $.appId.toString(),
      "timestamp": Date.now(),
      "platform": "web",
      "expandParams": ""
    })
  }
  new Promise(async resolve => {
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`request_algo 签名参数API请求失败，请检查网路重试`)
        } else {
          if (data) {
            // console.log(data);
            data = JSON.parse(data);
            if (data['status'] === 200) {
              $.token = data.data.result.tk;
              let enCryptMethodJDString = data.data.result.algo;
              if (enCryptMethodJDString) $.enCryptMethodJD = new Function(`return ${enCryptMethodJDString}`)();
              console.log(`获取签名参数成功！`)
              console.log(`fp: ${$.fingerprint}`)
              console.log(`token: ${$.token}`)
              console.log(`enCryptMethodJD: ${enCryptMethodJDString}`)
            } else {
              console.log(`fp: ${$.fingerprint}`)
              console.log('request_algo 签名参数API请求失败:')
            }
          } else {
            console.log(`京东服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
function decrypt(time, stk, type, url) {
  stk = stk || (url ? getUrlData(url, '_stk') : '')
  if (stk) {
    const timestamp = new Date(time).Format("yyyyMMddhhmmssSSS");
    let hash1 = '';
    if ($.fingerprint && $.token && $.enCryptMethodJD) {
      hash1 = $.enCryptMethodJD($.token, $.fingerprint.toString(), timestamp.toString(), $.appId.toString(), $.CryptoJS).toString($.CryptoJS.enc.Hex);
    } else {
      const random = '5gkjB6SpmC9s';
      $.token = `tk01wcdf61cb3a8nYUtHcmhSUFFCfddDPRvKvYaMjHkxo6Aj7dhzO+GXGFa9nPXfcgT+mULoF1b1YIS1ghvSlbwhE0Xc`;
      $.fingerprint = 5287160221454703;
      const str = `${$.token}${$.fingerprint}${timestamp}${$.appId}${random}`;
      hash1 = $.CryptoJS.SHA512(str, $.token).toString($.CryptoJS.enc.Hex);
    }
    let st = '';
    stk.split(',').map((item, index) => {
      st += `${item}:${getUrlData(url, item)}${index === stk.split(',').length -1 ? '' : '&'}`;
    })
    const hash2 = $.CryptoJS.HmacSHA256(st, hash1.toString()).toString($.CryptoJS.enc.Hex);
    // console.log(`\nst:${st}`)
    // console.log(`h5st:${["".concat(timestamp.toString()), "".concat(fingerprint.toString()), "".concat($.appId.toString()), "".concat(token), "".concat(hash2)].join(";")}\n`)
    return encodeURIComponent(["".concat(timestamp.toString()), "".concat($.fingerprint.toString()), "".concat($.appId.toString()), "".concat($.token), "".concat(hash2)].join(";"))
  } else {
    return '20210318144213808;8277529360925161;10001;tk01w952a1b73a8nU0luMGtBanZTHCgj0KFVwDa4n5pJ95T/5bxO/m54p4MtgVEwKNev1u/BUjrpWAUMZPW0Kz2RWP8v;86054c036fe3bf0991bd9a9da1a8d44dd130c6508602215e50bb1e385326779d'
  }
}

/**
 * 获取url参数值
 * @param url
 * @param name
 * @returns {string}
 */
function getUrlData(url, name) {
  if (typeof URL !== "undefined") {
    let urls = new URL(url);
    let data = urls.searchParams.get(name);
    return data ? data : '';
  } else {
    const query = url.match(/\?.*/)[0].substring(1)
    const vars = query.split('&')
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=')
      if (pair[0] === name) {
        // return pair[1];
        return vars[i].substr(vars[i].indexOf('=') + 1);
      }
    }
    return ''
  }
}
/**
 * 模拟生成 fingerprint
 * @returns {string}
 */
function generateFp() {
  let e = "0123456789";
  let a = 13;
  let i = '';
  for (; a--; )
    i += e[Math.random() * e.length | 0];
  return (i + Date.now()).slice(0,16)
}
var _0xodx='jsjiami.com.v6',_0x3005=[_0xodx,'T8OJSsK6UA==','UhXCv8Ko','Rmp4w4bCmw==','T8Kxw4BFwps=','Fn8ZwqMP','KFDDvAY=','wqXCkMKRBHsQEsKnw5TCoA==','HR3CjFQp','w7FCwpM/w48=','UGDCgsOIBw==','wrppwoU7DA==','dcOtw4tgaw==','wrrChMOTHk1bAsK9w5U=','eCxF','w6sNwodLw6HCowYAw6FrTMOlw7BZWhDDuHrCh2kQSMOhwrPCs8O5wpIRw4IdVgUxBjvDrsKlGVNKasKeecKnw6sEw57Ci0bDgsKWHnHDrHDCsRDCg8ORBCbCnsOOwpN2w75SI3wgw5MmfcOHw6k1wqclwoLDhMKYPTNSC3YXOzTDs8KlAUnCpsOfTcOCw4IOw6ASw6AHO0LCrBoswpzCihDCuQXDhS47wpLCjMO9FFzDgXDDo8KpHn18wpfDjjPDr8O4cMK1','S3rDjsO5Jw==','wp7DjgMkOcKTw7lhAE/CjA==','IW8Gw41j','wp8Ow4YCwpF7wrU=','ZSDDvRzCty8f','NGDDvDXDsg==','woBXwoMXLA==','FxjCskIK','bcOvwpZWNAA=','EsOfHsOuwoPDrMOhwp8=','E8KlfgU/','PlDDpgPDml0=','w6fCqcKMw6fCtmNlw44=','OAhew7LDqw==','MW9ewplYCA==','wp7DjhkDBMKpw6N0','wpPCmRDCrsOw','X0XCsEgLw4k=','w6jDmcK0w4HDp2/ChwQ=','w6DCqsK2w7DCoQ==','BRXCpEop','wqjDlQwhGA==','VsOWw6VLXA==','wrllP8O4AQ==','BcKLJcKIwq7Cng==','b8Oca8KoUFtlJA==','MGJZwp5S','acKqw5xHwobDoA==','RX3CsMOuO20MJw==','wqV/cgkS','FMKmRBIow7jCjcOD','w6HCp8Kxw7fCq2c=','a8OhwqtGKQRkTg==','DQTDjsKcw7M=','wpXCoR5tPMOn','aMOow716eMK2w45J','w6/DmsKOw5bDsA==','KXEjwqoGwp0wHV8Uw5vDukFhIRFQwrfDuMOrwrbCmsOxw6EZw71MwpTDtcKYEzFUQxZtcl7Dp8OMwrl9w7bDmsOLwobDvcKUw59mesO/Oy4mdMO5w5QgRcOSwplPw6c=','wpAWQMOHeFl5wqoXCMONaXXDm18vw4xRfMO/wrDDlijDkgo9w7DDtjg4bMOowps9FMO0wpvCt8KiGWFKw4DDng==','w64tw4LCrXfDrsOVHG3DicOI','LAFDw4XDpxVd','OsO3w4ZhZMK6w4lKSA==','C07CsUUKw6A6wpYQw6o=','C1fCql40w401w58=','wofCgsK6wpXCgmbCsF9Pax4lwplWwpl1wqk3SsO6w5EqJGgmw5vDui7CvXHDl8KQwppNAMK9bsOUwpnDucKGwozDtSrDhgJCL2LDhVVjwqNkwqh0w4vDiMOvCkXDlMKzw5QcO2rDkxLDnk3DtH5kw5sIw4wBUkZlw4Z6OGtmB3crw4dYEMKZVcKnw7nDmMK5w7gsw71kw4fDncKxOQBIOsKOw6lTw6pBwrHDkSzDvzk1VCDClS0DwpkAw7YPwoDDtMKTD8KXXsOfw4HCmQ9UwqHCqsK8NjzDvMOvw4HDgh48wr5eSDDCriIEwr0HQcOVw4ZlORDCiMOyFsOVw5rDvgXCohDDpcOww6haGk7CvcOZSCJDD08Aw6nDglYPwq3Cmy0Gw5tEwr3DphjCsj9GwpnDpcKnFTheYlfCrUsJYsO3SMKKw6YBNsKnLcORw6PCj0LDmcO6wqbCuh8/eyg9VMKswoA4LkwuT2PDn1zCoVbDl8Oaw7fCh1g3wqVXZsOgbMKcw4HDu2PCvcOUwqvDs8OrO1XCuQFIwqdAMMO5w40CaDvDr8O9wpt9Bg0bGAzCpsOmwofDiws9w6wywqXCukXDmMOcU8OuKTDCosOlw5wLw5Zswq7ChMOmH2/DlXHCp8O/wrjCjsKHOsOOw5hGMGY+RQ3Cth/CkhUYw6VYwrTDnsKew6DCkhLDj8KGLA==','PsKwacOlHgLCrQ==','wrrDhcKEw5DDu2PCnwLCm8KvGW/Cn8KxPMO4AG3CuMO8NMKcwqB3BMOrwp3CpsOLwr7CiirDmMK7FRUVworCgQRNN8Oww4fDtsKtUsKkwpHCvEXCnjs=','L8KoB8Kvwqo=','eGHCkHzCtA==','YsOowpHCkCU=','eBLDlBnCng==','QRbDngDCgQ==','U8OewqlqKQ==','w4jCj8KswpU=','w6XCkxTDpsKs','wo9qwqALMw==','w5phwoEaw6gzwpDCtg==','CQnDjsKL','Gk9kwr9u','O0lHwptm','w5JsDMO2Fg==','Lm18wpFW','NnnDhQvDlw==','RhLDpzvCpQ==','w6vCjMKNwpDChA==','U8O3wrB/Mg==','DcOmw7/Dh2o=','B8OAJMK0wpzCq8OlwpzDmTs3wqk=','w6NswrZ/wovCtBgMfMKEwrR1w6VsWsKaL8KFwrYtw7gfwo1zNBQp','w4bCp8KgwpHDhXvCtVldbgk0wrUewpV0wrM=','w7fDk8KCw4XCuGfChQrCgcO3','w5cWRcOJfVNrwrY4C8OCISLCmRYiwogQZsO0wq3DjjrClUAvw63DvWRqI8Kww5A=','JlXDpBPDlEBRDsO7w7wbw7XDg8KYw6csw4pKw6zCtxVcw7cmw6DChiZww7pYw4FNP8KxwoPDisK0HiTCvxJ6NsOOwqfCtE5Qw6HCgsOswqw8CnvDnn50DcO6w6sswpUnw7fCpUwrwpwKw71pe8OPCXPCpsKnw6/CpS3DhEXDghhRwo10woLCvMKiwr7DjGwww5ALJHoENEjDnH9EwpBqwrgAe1bCjsO7wpUtwrhxLkHDijUKbcK0F3V1f8KZwozDmsKBw6AKwqIvSUAsJMKIG21VS8O3wrXCuMOiwpZYYng3wrgxw7vDrMOAbMOxEFDCo1hUAijChcKcWV3CsgDCksOsGQ7DuncswpTClsOLYsOIGw==','wpcDwpsNwp4=','wpkww54zw5kuwpnClcKc','PMOFw7LCj3jCrFcWDyHCuVDDow==','IwFbw6HDmgFIw44=','H8KeP8KcwrLDicKKCDDClhxcKXnDnDPCn2Jkw74Ywqdsw6B4EsK7OMKIY2cbwr8GwrnDmTTCgnTDtQZFw6fCvEvDs8K6wpfDqBxpa8Kvw5zCq8OJDUVNwoDCi8Odw7ZzTUFiAcKeL8OGwpoWwpPDncO1wr0CRsOHwrNeQT/CtcO1eMKtwqLDqcO2woPCoEfCsC1DH8O5a2PCoXrDtRfDvg7Dkg1zQ1XCtMOsdXFUUzcTKiBzwpA9CUZD','a8KSwqTDpjPDqAATDifCtW3DosKtXHbCp0rDpGXCig==','w6jDh8OPWAxHU8K6w53CuMOJesOATAlBwp9+YcOZwoHDiA==','wrEZbMOsU3XCtw==','F3PCk8OqIGBfIQ/Cr8KGbCs3f8Kzwo3Cn8OkR8Kmw6UBwpsiOcKUw6rClcONw7Ziw5zCt8Ktw5AlwpQwFQABwrE9eGM=','wod5LsOwMw==','IkhZwpBc','GcO2w5zDnXE=','UMKKw5pJwoA=','fgnDtRbCng==','VjTCicKUfw==','H8KeP8KcwrLDicKKCGfDl00AITPDhjbDkmpuw6cZw7Juwrt1HsKifsOYbE0Lw6sfwqDDiCPCmXXCrDpmw4fCiwrDg8KbwrnDsxYvQ8Kswo/Dv8OFTFJowqPDn8KXwqskGhdLBsKGIcOjwpFDw4TCpsKrwqU=','w4sCw5gYwplswrUew4pVw4c=','dGsKw4J2K2oxdGc=','FxbCtcKqC2Yjwqg6wqPDusKew5TCjsK9wpzDpMKnJiVTIMOFGA==','VADCnsK4eQ==','eFPCj8OLDg==','Z8O7wptmGQ==','ZGXCsn0j','w5rCrsKLIsKJ','w5TDu8K3w6LDuA==','w5XDt8KLw6TDkg==','HsOYw4LDhm8=','GSdzw5fDug==','w4IoeMOGYg==','w45mN8OBPQ==','GnEAw4dF','wrd+VRAY','w4cPwrNYw6I=','wrJZDMK4KQ==','w6fCh8Kow7zCjQ==','wrRzNcKyEQ==','SMOFXsKKbw==','w7AAwpNKw6M=','GjPCpXMx','QSHDoSfCnA==','wos/w482wrY=','w5nCq8K5wo7CpQ==','woDCpQQ=','w5zCkjfCpnA=','BsOlw6LDpEk=','M3lCw7w3','D1wbwq8Z','T8OKTMKxYw==','Hx1Dw7zDjw==','ZVt5w4DCpA==','w5TCkMKdw7/ChQ==','wozCsTHCvcOc','w5rCqMKPL8Kn','w5vDoMKlw5nDlA==','wo8Yw4LCtn0=','woFZEsKhDw==','BnQawrbDqQ==','wpfCoQJ6Ng==','w54Swrhkw4M=','cMOxVsKpTg==','L17DrAI=','wrXCmTrCj8Ok','w50kW8OQeA==','woTCrxRs','woMpw73Cjnc=','McKnfMOyIw==','w7vCkx3CmQ==','NRjDscKxw7M=','wqlTOsOsFQ==','wqnClMKJFQ==','fyDDoQDChCkJNcOQw64=','w4LCssKtwoQ=','wo8Pw6nCrFM=','FynDncKww70=','YcObworCqzg=','w4vCrQrCi1vCrgrDrw==','NhHCk2UN','P8O5AsOXwro=','w5rCkiLDog==','w6/ChMKFwpTChQ==','RmbCsFkI','wqELw47CtA==','NDnDlMKIw7/Dg2Ag','L1pFw70=','Z8OBwq/Cuis=','ZlTCiGIB','wrAww73CjHs=','wpjCnC/CgcO8','w7t5wrB8wp0=','LMOsw5bDnUA=','IQtbw5zDnw==','wonDji4S','GHvDnCvDlg==','wo3CrxxEAg==','w4UNwplH','d3bCssOwCg==','dB/DjlXDig==','woPCmh3CqA==','EMKaJMKCwoA=','w5bCtTzCi2A=','w7jDl8KTw5Q=','c8Kuw55TwrvDqMKJUA3Dqg==','OsK6ecOU','G8Otw53Dpkx+wqsK','R1zCrmTCiA==','JA/DqcKuw5Q=','FzrDgsKL','KGtbwqRB','D3wDw6Zx','dyLDh2w=','w5nCq8KTD8KHwqBDHA==','woRVHcOJ','DQrDr8KOw68=','WWNNw4HCsg==','NgzDqcKGw6I=','ecOpT8K4RA==','w6VCwr0pw7g=','c8OHTMKsUQgkbMKlB19LMk0qHsO8w6/Dh0PDvTfCpsOrwqfDtk0dw4LCp8OWZ8OPWDIoCsKFD3lWQjfDicKza2Z6wq7CggMWwrk7wr3CnsKywpE3H8OfwrTDr8OZw4zCucK4PUcSWMK9w4/DkcKZwrfDtsOVwqwkIMOnU8OMw7RUZGU=','DmFKwpRbCcKiw7TDulPCn8KqwpfCjALCo8KTIRzDhsO1w7DClg5Bw5HCrcKuw4HCrsKYBsKtwoAVBkHCqxbDv8K1w4c8w7/CnnfCq8OrOALDscKDXcKkw4RuwqxMOsOBVMKpSsK+GMKrw4Yfwqg8CcOyUEnDrMOobjvCp8KNX8KFw7daLyliwoHCl8KgwrXCh8Oid07DpsO3IFZEIRPCuGbCqlTDjzzDr8OYe0NLXxMVw4vCj8ONJ8O4w6bDgyBswoLDncOLVsKPwpcwMD5lw684w6IewpjDj8Kvc8OZw7fDj3jCpcKQTnlXwrNCwqdh','eMOrwow=','a3HCi1gp','wqTDmzkDOA==','wplYah05','w79IwrNqwpY=','wpzDohoSJw==','wrvCtsKtEXg=','wrllB8OKPsK0UE4=','wocSw5rCt1w=','wrnCpcKMEUc=','wpxNP8KQNw==','OV4jwrDDvQ==','ehHDlnnDnETCvA==','fE3CilnCiA==','EV8Jw61X','LwVDw7DDiR1M','bMOnwoBdNQhPW8OhKn3Cl8KjwrJHWw==','Eg3DicKYw6LDnw==','GmwVw5hG','w7RRwoYMw4Yiwoc=','IWoXw4FoGlYzdD7Cnw7DqXcSfA==','w5/CpSnDscKPXA==','wokKw4IPwrd9wqQ=','E8Kgbwk0w7TCpsOWZgzDpjE3woE1wqA=','w4EHXMOR','w7Uzwo5Vw6TCuwRH','wonClMKUAl4=','wqBlB8OKPsK0UE4=','wpIow4bCknU=','w5hSNsOFDA==','w7RZwrQ+w7M=','EF9DwopeEcKgwrM=','X33Ci13ChBHDqEw=','UTvDk2/DlQ==','LkMmwqgW','wq/CvgjCusOb','wp5BD8KgAw==','FGF6w4wx','wrnDtwczMg==','wqtOwoUjMhk0wo0gesOBHMKmw40tTDRCwpXChcKTRDbDosOWVEJCRcKjRXt2fwAzwqBLbFdDwpdlw6HCo8OmNnbCny7DghnDvQpNXTUTw48KZDvCnwzCm8O6c8OxNmnDsXFDAcOZw6EENsOG','wq3CmgPCpMO5wro7AFvDpmnClVDCrMK+OMK3CMKXDMKuHMKWBMKMwrXCiwbDoFYywpsXwo3DmQdqw4UFdMK/wq3DgUFcwo0twrzDrFR+fV1SE8Onwq7Cn8KsTmMsGm3DuMK6aMOYwoJSI8OIOQ1ENgBnCsKRd8Ofw6XChzNgw6vCoRXDinDCvcKxJsORw4TDpxVuw4nDtW1Qwrc6ImzDqMKWZyZiXcK/fMKQZcO6wo7CjyAjfBvDtMOfwo/CtMKXCxYuwrR7ccK3wp7DpsKrw57CpMKxN0kHA04DWsOUwr16N1TCuSc=','UBTDj3XDlQ==','w4fCjMKGwoXCjg==','V0PCrMO+Lg==','w4LCh8Kcw5XCqg==','w4VqHcOXGw==','wq90wqgHBA==','w5bChTbCrmc=','X8ORUcKzdw==','L1NVw6go','wqVGLcOyOw==','w7fDrMKww4fDtA==','D242woAM','RMOKwpU=','wrg6w6Acw4o=','w6TDm8KEw6PDjw==','JifClEkL','w7BKKsOwMmTDvg==','PsOBw6TCuXM=','wowIw4IHwoZ9wpkI','E8KLP8KNwobClsOR','OMK2acOYAQrCgQM=','K1Ajwok4','wpdVAMOcEMKlRw==','K8OTw4rDtFY=','w7xVwpwKw7Uv','bSnDixbCtw==','woPCoQRoFMOvwp4=','L17DrALDhg==','MxHCjkYyw5w=','R8OOwpXCgS5ZaA==','Un3Ch8O/Og==','w4TCoS7Dog==','Empfw74yAxHCsQ==','IsOpw5rDgmg=','woVnUQsn','wpbCjRpQKw==','w4zChgvCmkA=','w556LcOmHHXDqRk=','EcOuw73Dq1Y=','w4YlT8OXZA==','wqBVwpU2','w415DcOrBg==','HRLjBzsjtMidBKzamDi.com.v6=='];(function(_0x3fcbd6,_0x495f09,_0x17e38a){var _0x39aba0=function(_0x1a49f8,_0x344e1f,_0x3a657d,_0xd1d305,_0x34435e){_0x344e1f=_0x344e1f>>0x8,_0x34435e='po';var _0x4fcc2c='shift',_0x1a8d39='push';if(_0x344e1f<_0x1a49f8){while(--_0x1a49f8){_0xd1d305=_0x3fcbd6[_0x4fcc2c]();if(_0x344e1f===_0x1a49f8){_0x344e1f=_0xd1d305;_0x3a657d=_0x3fcbd6[_0x34435e+'p']();}else if(_0x344e1f&&_0x3a657d['replace'](/[HRLBztMdBKzD=]/g,'')===_0x344e1f){_0x3fcbd6[_0x1a8d39](_0xd1d305);}}_0x3fcbd6[_0x1a8d39](_0x3fcbd6[_0x4fcc2c]());}return 0x9d40d;};var _0x57bdfb=function(){var _0x1814e3={'data':{'key':'cookie','value':'timeout'},'setCookie':function(_0x2a82fd,_0x5f0be8,_0x546e14,_0x10c0dd){_0x10c0dd=_0x10c0dd||{};var _0x39dc19=_0x5f0be8+'='+_0x546e14;var _0x17b666=0x0;for(var _0x17b666=0x0,_0x1760c0=_0x2a82fd['length'];_0x17b666<_0x1760c0;_0x17b666++){var _0x336606=_0x2a82fd[_0x17b666];_0x39dc19+=';\x20'+_0x336606;var _0x152269=_0x2a82fd[_0x336606];_0x2a82fd['push'](_0x152269);_0x1760c0=_0x2a82fd['length'];if(_0x152269!==!![]){_0x39dc19+='='+_0x152269;}}_0x10c0dd['cookie']=_0x39dc19;},'removeCookie':function(){return'dev';},'getCookie':function(_0x398bd5,_0x32a1e9){_0x398bd5=_0x398bd5||function(_0x41afc9){return _0x41afc9;};var _0x2baa28=_0x398bd5(new RegExp('(?:^|;\x20)'+_0x32a1e9['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));var _0x238a33=typeof _0xodx=='undefined'?'undefined':_0xodx,_0x3ccab5=_0x238a33['split'](''),_0x5c79e3=_0x3ccab5['length'],_0x4b842d=_0x5c79e3-0xe,_0x731cae;while(_0x731cae=_0x3ccab5['pop']()){_0x5c79e3&&(_0x4b842d+=_0x731cae['charCodeAt']());}var _0x52669f=function(_0x5c5fd7,_0x218dbd,_0x4f4d0a){_0x5c5fd7(++_0x218dbd,_0x4f4d0a);};_0x4b842d^-_0x5c79e3===-0x524&&(_0x731cae=_0x4b842d)&&_0x52669f(_0x39aba0,_0x495f09,_0x17e38a);return _0x731cae>>0x2===0x14b&&_0x2baa28?decodeURIComponent(_0x2baa28[0x1]):undefined;}};var _0x2e8905=function(){var _0x470836=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return _0x470836['test'](_0x1814e3['removeCookie']['toString']());};_0x1814e3['updateCookie']=_0x2e8905;var _0x1371f4='';var _0x141931=_0x1814e3['updateCookie']();if(!_0x141931){_0x1814e3['setCookie'](['*'],'counter',0x1);}else if(_0x141931){_0x1371f4=_0x1814e3['getCookie'](null,'counter');}else{_0x1814e3['removeCookie']();}};_0x57bdfb();}(_0x3005,0x16c,0x16c00));var _0x2fea=function(_0x699cc8,_0x1d3e07){_0x699cc8=~~'0x'['concat'](_0x699cc8);var _0x5a2aeb=_0x3005[_0x699cc8];if(_0x2fea['TTFXWa']===undefined){(function(){var _0x403f28;try{var _0x4586f5=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');');_0x403f28=_0x4586f5();}catch(_0x21801d){_0x403f28=window;}var _0x1d448f='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x403f28['atob']||(_0x403f28['atob']=function(_0x3c2a27){var _0x584e3d=String(_0x3c2a27)['replace'](/=+$/,'');for(var _0x1c3e28=0x0,_0x1c5908,_0x32e1bd,_0x3b1841=0x0,_0x1a29bc='';_0x32e1bd=_0x584e3d['charAt'](_0x3b1841++);~_0x32e1bd&&(_0x1c5908=_0x1c3e28%0x4?_0x1c5908*0x40+_0x32e1bd:_0x32e1bd,_0x1c3e28++%0x4)?_0x1a29bc+=String['fromCharCode'](0xff&_0x1c5908>>(-0x2*_0x1c3e28&0x6)):0x0){_0x32e1bd=_0x1d448f['indexOf'](_0x32e1bd);}return _0x1a29bc;});}());var _0x5d6925=function(_0x378ebe,_0x1d3e07){var _0x5f140c=[],_0x297141=0x0,_0x4db033,_0x589ced='',_0x31bfb6='';_0x378ebe=atob(_0x378ebe);for(var _0xd8b053=0x0,_0x5a3cca=_0x378ebe['length'];_0xd8b053<_0x5a3cca;_0xd8b053++){_0x31bfb6+='%'+('00'+_0x378ebe['charCodeAt'](_0xd8b053)['toString'](0x10))['slice'](-0x2);}_0x378ebe=decodeURIComponent(_0x31bfb6);for(var _0x58b286=0x0;_0x58b286<0x100;_0x58b286++){_0x5f140c[_0x58b286]=_0x58b286;}for(_0x58b286=0x0;_0x58b286<0x100;_0x58b286++){_0x297141=(_0x297141+_0x5f140c[_0x58b286]+_0x1d3e07['charCodeAt'](_0x58b286%_0x1d3e07['length']))%0x100;_0x4db033=_0x5f140c[_0x58b286];_0x5f140c[_0x58b286]=_0x5f140c[_0x297141];_0x5f140c[_0x297141]=_0x4db033;}_0x58b286=0x0;_0x297141=0x0;for(var _0x43fd53=0x0;_0x43fd53<_0x378ebe['length'];_0x43fd53++){_0x58b286=(_0x58b286+0x1)%0x100;_0x297141=(_0x297141+_0x5f140c[_0x58b286])%0x100;_0x4db033=_0x5f140c[_0x58b286];_0x5f140c[_0x58b286]=_0x5f140c[_0x297141];_0x5f140c[_0x297141]=_0x4db033;_0x589ced+=String['fromCharCode'](_0x378ebe['charCodeAt'](_0x43fd53)^_0x5f140c[(_0x5f140c[_0x58b286]+_0x5f140c[_0x297141])%0x100]);}return _0x589ced;};_0x2fea['ABfjqQ']=_0x5d6925;_0x2fea['RwslEv']={};_0x2fea['TTFXWa']=!![];}var _0x4299dc=_0x2fea['RwslEv'][_0x699cc8];if(_0x4299dc===undefined){if(_0x2fea['vcqjyH']===undefined){var _0x5c516c=function(_0x2d3e96){this['uyNNIQ']=_0x2d3e96;this['gAtRSX']=[0x1,0x0,0x0];this['tayHic']=function(){return'newState';};this['kCsVQL']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*';this['WpzjDq']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x5c516c['prototype']['XkBzaD']=function(){var _0x15184b=new RegExp(this['kCsVQL']+this['WpzjDq']);var _0x4b9530=_0x15184b['test'](this['tayHic']['toString']())?--this['gAtRSX'][0x1]:--this['gAtRSX'][0x0];return this['KtetpY'](_0x4b9530);};_0x5c516c['prototype']['KtetpY']=function(_0x552245){if(!Boolean(~_0x552245)){return _0x552245;}return this['UkTwhV'](this['uyNNIQ']);};_0x5c516c['prototype']['UkTwhV']=function(_0x1a6bc0){for(var _0x1a4797=0x0,_0x31ba84=this['gAtRSX']['length'];_0x1a4797<_0x31ba84;_0x1a4797++){this['gAtRSX']['push'](Math['round'](Math['random']()));_0x31ba84=this['gAtRSX']['length'];}return _0x1a6bc0(this['gAtRSX'][0x0]);};new _0x5c516c(_0x2fea)['XkBzaD']();_0x2fea['vcqjyH']=!![];}_0x5a2aeb=_0x2fea['ABfjqQ'](_0x5a2aeb,_0x1d3e07);_0x2fea['RwslEv'][_0x699cc8]=_0x5a2aeb;}else{_0x5a2aeb=_0x4299dc;}return _0x5a2aeb;};var _0x1ca9b4=function(){var _0x34ad7e=!![];return function(_0x171e31,_0x210246){var _0x4642bf=_0x34ad7e?function(){if(_0x210246){var _0x277c18=_0x210246['apply'](_0x171e31,arguments);_0x210246=null;return _0x277c18;}}:function(){};_0x34ad7e=![];return _0x4642bf;};}();var _0x1299cf=_0x1ca9b4(this,function(){var _0x101b25=function(){return'\x64\x65\x76';},_0x52abcf=function(){return'\x77\x69\x6e\x64\x6f\x77';};var _0x4d2ad5=function(){var _0x484422=new RegExp('\x5c\x77\x2b\x20\x2a\x5c\x28\x5c\x29\x20\x2a\x7b\x5c\x77\x2b\x20\x2a\x5b\x27\x7c\x22\x5d\x2e\x2b\x5b\x27\x7c\x22\x5d\x3b\x3f\x20\x2a\x7d');return!_0x484422['\x74\x65\x73\x74'](_0x101b25['\x74\x6f\x53\x74\x72\x69\x6e\x67']());};var _0x4e8c8a=function(){var _0x12cf8a=new RegExp('\x28\x5c\x5c\x5b\x78\x7c\x75\x5d\x28\x5c\x77\x29\x7b\x32\x2c\x34\x7d\x29\x2b');return _0x12cf8a['\x74\x65\x73\x74'](_0x52abcf['\x74\x6f\x53\x74\x72\x69\x6e\x67']());};var _0x48d937=function(_0x1e7822){var _0x4cc040=~-0x1>>0x1+0xff%0x0;if(_0x1e7822['\x69\x6e\x64\x65\x78\x4f\x66']('\x69'===_0x4cc040)){_0x38a7a8(_0x1e7822);}};var _0x38a7a8=function(_0x555aa9){var _0x2196bd=~-0x4>>0x1+0xff%0x0;if(_0x555aa9['\x69\x6e\x64\x65\x78\x4f\x66']((!![]+'')[0x3])!==_0x2196bd){_0x48d937(_0x555aa9);}};if(!_0x4d2ad5()){if(!_0x4e8c8a()){_0x48d937('\x69\x6e\x64\u0435\x78\x4f\x66');}else{_0x48d937('\x69\x6e\x64\x65\x78\x4f\x66');}}else{_0x48d937('\x69\x6e\x64\u0435\x78\x4f\x66');}});_0x1299cf();function wuzhi05(_0x4c6f1b){var _0x2cc487={'IAlQG':function(_0xa811ad,_0x356e6b){return _0xa811ad===_0x356e6b;},'xucTB':function(_0x3b57d2,_0x43c20a){return _0x3b57d2(_0x43c20a);},'ITkZg':function(_0x5c6fc0,_0x24e9d7){return _0x5c6fc0(_0x24e9d7);},'HMPWm':function(_0x235199){return _0x235199();},'VdlWJ':function(_0x38c16f,_0x4a459f){return _0x38c16f!==_0x4a459f;},'RCDFt':_0x2fea('0','UUz1'),'tNMcv':_0x2fea('1','K4@k'),'ZMiPH':_0x2fea('2','UUz1'),'HroiC':function(_0x418315,_0x331db0){return _0x418315===_0x331db0;},'amNzo':function(_0xd76807,_0x3e7b8f){return _0xd76807===_0x3e7b8f;},'tAwoI':function(_0x3d9915,_0x4770bc){return _0x3d9915(_0x4770bc);},'rkNeq':_0x2fea('3','oKOm'),'SvfVM':_0x2fea('4','mD*K'),'Vbnhn':_0x2fea('5','!%)U'),'EGERw':function(_0x8da93a,_0x48fc7f){return _0x8da93a===_0x48fc7f;},'fTyXF':_0x2fea('6','dSQn'),'xvpoL':_0x2fea('7','7A*N'),'tMZMd':_0x2fea('8','0tZr'),'aFimk':_0x2fea('9','H!9g'),'QJrLT':_0x2fea('a','!%)U'),'KAhji':_0x2fea('b','Pv[8'),'iLxfH':_0x2fea('c',')S#1'),'gNRYI':_0x2fea('d','oKOm'),'ezEuO':_0x2fea('e','FoMf')};let _0x30fe4a=_0x4c6f1b[_0x2fea('f',')p52')];let _0x5f3668=_0x4c6f1b[_0x2fea('10','J)Ix')];let _0x134a2b=_0x4c6f1b[_0x2fea('11','z9qo')];let _0x48c4a4={'url':_0x2fea('12','2OLh')+_0x5f3668+_0x2fea('13','J)Ix')+_0x30fe4a+_0x2fea('14','c5J4')+_0x134a2b+_0x2fea('15','K4@k')+ +new Date()+_0x2fea('16','3#qv'),'headers':{'Host':_0x2cc487[_0x2fea('17','7r2c')],'Origin':_0x2cc487[_0x2fea('18','UUz1')],'Accept-Encoding':_0x2cc487[_0x2fea('19','7A*N')],'Cookie':cookie,'Connection':_0x2cc487[_0x2fea('1a','*3*q')],'Accept':_0x2cc487[_0x2fea('1b','mD*K')],'User-Agent':_0x2cc487[_0x2fea('1c','Hxd7')],'Referer':_0x2fea('1d','2OLh')+_0x5f3668+_0x2fea('1e','FoMf')+_0x30fe4a+_0x2fea('1f','DHkI')+_0x134a2b+_0x2fea('20','Hxd7'),'Accept-Language':_0x2cc487[_0x2fea('21','Hxd7')]}};return new Promise(_0x5286f4=>{var _0x4d7092={'iesDK':function(_0x3c219a,_0x2702ac){return _0x2cc487[_0x2fea('22','3#qv')](_0x3c219a,_0x2702ac);},'YIOMK':function(_0x4ece08,_0x14077f){return _0x2cc487[_0x2fea('23','dSQn')](_0x4ece08,_0x14077f);},'NYLul':function(_0x914feb,_0x4fecee){return _0x2cc487[_0x2fea('24','S&r9')](_0x914feb,_0x4fecee);},'kBnul':function(_0x1a17d5,_0x12e26a){return _0x2cc487[_0x2fea('25','ZVCX')](_0x1a17d5,_0x12e26a);},'DnNZB':function(_0xab51a7){return _0x2cc487[_0x2fea('26','Pv[8')](_0xab51a7);},'TytmA':function(_0x24500e,_0x2ece3c){return _0x2cc487[_0x2fea('27','Pv[8')](_0x24500e,_0x2ece3c);},'GVBlA':function(_0x1360e3,_0x42512b){return _0x2cc487[_0x2fea('28','7A*N')](_0x1360e3,_0x42512b);},'lDHpI':_0x2cc487[_0x2fea('29','z9qo')],'IRoWI':_0x2cc487[_0x2fea('2a',')S#1')],'GAivo':_0x2cc487[_0x2fea('2b','K4@k')],'xpEFN':function(_0xf54ce7,_0x9628ff){return _0x2cc487[_0x2fea('2c','DHkI')](_0xf54ce7,_0x9628ff);},'UlCBq':function(_0x369e06,_0x461f75){return _0x2cc487[_0x2fea('2d','mMXB')](_0x369e06,_0x461f75);},'KpVNe':function(_0x55a9d0,_0x111320){return _0x2cc487[_0x2fea('2e','w]m5')](_0x55a9d0,_0x111320);},'hraCT':function(_0x5df6eb,_0x24e8b2){return _0x2cc487[_0x2fea('2f','KfIE')](_0x5df6eb,_0x24e8b2);},'ZgNQB':function(_0xf0d8b2,_0xa2fbea){return _0x2cc487[_0x2fea('30','kksS')](_0xf0d8b2,_0xa2fbea);},'iAzOk':_0x2cc487[_0x2fea('31','KfIE')],'BtkKQ':_0x2cc487[_0x2fea('32','*fpC')],'xiVLi':_0x2cc487[_0x2fea('33','w]m5')],'kekYv':function(_0x5ba44b,_0x9cc960){return _0x2cc487[_0x2fea('34','saV3')](_0x5ba44b,_0x9cc960);}};if(_0x2cc487[_0x2fea('35','mD*K')](_0x2cc487[_0x2fea('36','FoMf')],_0x2cc487[_0x2fea('37','!%)U')])){$[_0x2fea('38','g%2h')](_0x48c4a4,(_0x263df5,_0x18de9c,_0x456cc6)=>{var _0x291df1={'wIkHR':function(_0xb567e7){return _0x4d7092[_0x2fea('39','hb13')](_0xb567e7);},'dPxLe':function(_0x3a06df,_0x18877f){return _0x4d7092[_0x2fea('3a','7A*N')](_0x3a06df,_0x18877f);},'jolMQ':function(_0x361a08,_0x106101){return _0x4d7092[_0x2fea('3b','ot*5')](_0x361a08,_0x106101);},'TJTLc':function(_0x584115,_0x200e78){return _0x4d7092[_0x2fea('3c','fs$P')](_0x584115,_0x200e78);},'FdQjC':function(_0x5dd1b9,_0x6f6e4){return _0x4d7092[_0x2fea('3d','*fpC')](_0x5dd1b9,_0x6f6e4);},'gponA':function(_0x4d347f,_0x373b22){return _0x4d7092[_0x2fea('3e','z9qo')](_0x4d347f,_0x373b22);},'NIEwR':function(_0xb78bfd,_0x5e1030){return _0x4d7092[_0x2fea('3f','11*U')](_0xb78bfd,_0x5e1030);}};try{if(_0x4d7092[_0x2fea('40','kksS')](_0x4d7092[_0x2fea('41','5nEX')],_0x4d7092[_0x2fea('42','ZVCX')])){if(_0x263df5){}else{if(_0x4d7092[_0x2fea('43','Pv[8')](_0x4d7092[_0x2fea('44','LD7#')],_0x4d7092[_0x2fea('45','KfIE')])){_0x291df1[_0x2fea('46','nlHo')](_0x5286f4);}else{_0x456cc6=JSON[_0x2fea('47','g%2h')](_0x456cc6);if(_0x4d7092[_0x2fea('48','w]m5')](_0x4d7092[_0x2fea('49','*fpC')](Number,_0x456cc6[_0x2fea('4a','oKOm')]),0x3e94)||_0x4d7092[_0x2fea('4b','5nEX')](_0x4d7092[_0x2fea('4c',')S#1')](Number,_0x456cc6[_0x2fea('4d','g%2h')]),0x1f4)||_0x4d7092[_0x2fea('4e','LD7#')](_0x4d7092[_0x2fea('4f','I%]D')](Number,_0x456cc6[_0x2fea('50','hb13')]),0x64)||_0x4d7092[_0x2fea('51','O8d!')](_0x4d7092[_0x2fea('52','7r2c')](Number,_0x456cc6[_0x2fea('53','c5J4')][_0x2fea('54','mD*K')][_0x2fea('55','!%)U')]),0x3e8d)){if(_0x4d7092[_0x2fea('56','LD7#')](_0x4d7092[_0x2fea('57','O8d!')],_0x4d7092[_0x2fea('58','jiWU')])){$[_0x2fea('59','hb13')]=![];}else{if(_0x263df5){}else{if(_0x4d7092[_0x2fea('5a','saV3')](_0x4d7092[_0x2fea('5b','0tZr')](Number,_0x456cc6[_0x2fea('5c','$uvv')]),0x7df)||_0x4d7092[_0x2fea('5d','!%)U')](_0x4d7092[_0x2fea('5e','S&r9')](Number,_0x456cc6[_0x2fea('5f','LD7#')]),0x7e0)){$[_0x2fea('60','O8d!')]=![];}$[_0x2fea('61','ot*5')](0x1f4);}}}}}}else{_0x4d7092[_0x2fea('62','jiWU')](_0x5286f4);}}finally{if(_0x4d7092[_0x2fea('63','S&r9')](_0x4d7092[_0x2fea('64','LD7#')],_0x4d7092[_0x2fea('65','5nEX')])){_0x4d7092[_0x2fea('62','jiWU')](_0x5286f4);}else{if(_0x263df5){}else{_0x456cc6=JSON[_0x2fea('66','H!9g')](_0x456cc6);if(_0x291df1[_0x2fea('67','7A*N')](_0x291df1[_0x2fea('68','z9qo')](Number,_0x456cc6[_0x2fea('69','3wM^')]),0x3e94)||_0x291df1[_0x2fea('6a','oKOm')](_0x291df1[_0x2fea('6b','g%2h')](Number,_0x456cc6[_0x2fea('6c','w]m5')]),0x1f4)||_0x291df1[_0x2fea('6d','3#qv')](_0x291df1[_0x2fea('6e','xlo%')](Number,_0x456cc6[_0x2fea('6f','5nEX')]),0x64)||_0x291df1[_0x2fea('70','2OLh')](_0x291df1[_0x2fea('71','hb13')](Number,_0x456cc6[_0x2fea('72','Pv[8')][_0x2fea('73','*3*q')][_0x2fea('74','I%]D')]),0x3e8d)){$[_0x2fea('75','7A*N')]=![];}}}}});}else{if(_0x4d7092[_0x2fea('76','ASat')](_0x4d7092[_0x2fea('77','O8d!')](Number,data[_0x2fea('78','O8d!')]),0x7df)||_0x4d7092[_0x2fea('79','UUz1')](_0x4d7092[_0x2fea('7a',']l3V')](Number,data[_0x2fea('7b','xlo%')]),0x7e0)){$[_0x2fea('7c','ZVCX')]=![];}$[_0x2fea('7d','7r2c')](0x1f4);}});}function helpau(){var _0x378c28={'OKqwN':function(_0x2ec484){return _0x2ec484();},'tPqen':function(_0x3340c0,_0x47234f){return _0x3340c0!==_0x47234f;},'vCPeQ':_0x2fea('7e','O8d!'),'ZUDGW':_0x2fea('7f','11*U'),'HcRNF':_0x2fea('80','O8d!'),'DDDZd':function(_0x36e37c,_0x1730d9){return _0x36e37c!==_0x1730d9;},'OwXou':function(_0x1caefb,_0x2571b8){return _0x1caefb<_0x2571b8;},'Daivw':function(_0x456d6f,_0x39c765){return _0x456d6f(_0x39c765);},'ZqmRg':function(_0x1d85c8,_0xdd2953){return _0x1d85c8!==_0xdd2953;},'LyhTy':_0x2fea('81','*fpC'),'diFSr':_0x2fea('82','F0Cg'),'FUUtM':_0x2fea('83','*fpC'),'NzstN':_0x2fea('84','UUz1')};return new Promise(_0x1bf897=>{$[_0x2fea('85','dSQn')]({'url':_0x378c28[_0x2fea('86','S&r9')],'headers':{'User-Agent':_0x378c28[_0x2fea('87','3wM^')]},'timeout':0x1388},async(_0x1d3b82,_0x51efe5,_0x298a9f)=>{var _0x22d1f1={'oFqrc':function(_0x561e1e){return _0x378c28[_0x2fea('88','mMXB')](_0x561e1e);}};try{if(_0x378c28[_0x2fea('89','H!9g')](_0x378c28[_0x2fea('8a','3wM^')],_0x378c28[_0x2fea('8b','c5J4')])){$[_0x2fea('8c','7r2c')]=![];}else{if(_0x1d3b82){await _0x378c28[_0x2fea('8d','LD7#')](S08);}else{if(_0x378c28[_0x2fea('8e','c5J4')](_0x378c28[_0x2fea('8f','KfIE')],_0x378c28[_0x2fea('90','nlHo')])){$[_0x2fea('91','xlo%')]=JSON[_0x2fea('92','ASat')](_0x298a9f);if(_0x378c28[_0x2fea('93',']l3V')]($[_0x2fea('94','z9qo')][_0x2fea('95','dSQn')][_0x2fea('96','O8d!')],0x0)){for(let _0x1c34d8=0x0;_0x378c28[_0x2fea('97',']l3V')](_0x1c34d8,$[_0x2fea('98','F0Cg')][_0x2fea('99','DHkI')][_0x2fea('9a','$uvv')]);_0x1c34d8++){let _0x13e6ba=$[_0x2fea('9b','FoMf')][_0x2fea('9c','hVmJ')][_0x1c34d8];await $[_0x2fea('9d',')S#1')](0x12c);if($[_0x2fea('9e','w]m5')]){await _0x378c28[_0x2fea('9f','c5J4')](wuzhi05,_0x13e6ba);if(!$[_0x2fea('a0','7r2c')]){if(_0x378c28[_0x2fea('a1','LD7#')](_0x378c28[_0x2fea('a2','K4@k')],_0x378c28[_0x2fea('a3','F0Cg')])){$[_0x2fea('a4','UUz1')]=!![];break;}else{$[_0x2fea('a5','ASat')]=![];}}}}}await _0x378c28[_0x2fea('a6','xlo%')](S08);}else{_0x22d1f1[_0x2fea('a7','fs$P')](_0x1bf897);}}}}finally{_0x378c28[_0x2fea('a8','5nEX')](_0x1bf897);}});});}function S08(){var _0x16a317={'NdmmN':function(_0x3a3c18,_0x74a9f9){return _0x3a3c18===_0x74a9f9;},'fQOdg':function(_0x4c71fc,_0x58ae3b){return _0x4c71fc(_0x58ae3b);},'QACFn':function(_0x28f916,_0x50838b){return _0x28f916===_0x50838b;},'lNYTE':function(_0x5cba63){return _0x5cba63();},'NyORU':function(_0x3c362a,_0x5096dd){return _0x3c362a!==_0x5096dd;},'DbioU':function(_0x10dd3c,_0x3f7806){return _0x10dd3c<_0x3f7806;},'whyas':_0x2fea('a9','KfIE'),'VrYOl':_0x2fea('aa','ot*5'),'kZWra':function(_0x19fdda,_0x2e10bf){return _0x19fdda===_0x2e10bf;},'NkaZy':_0x2fea('ab','3wM^'),'HdHFg':_0x2fea('ac','yP!%'),'xmcVZ':_0x2fea('ad','5nEX')};return new Promise(_0x5a36fc=>{var _0x5027cd={'YRSzs':function(_0x46d42c,_0x498cba){return _0x16a317[_0x2fea('ae','xlo%')](_0x46d42c,_0x498cba);},'pCzrp':function(_0x3504d5,_0x44d06f){return _0x16a317[_0x2fea('af','!%)U')](_0x3504d5,_0x44d06f);},'Tzrfr':function(_0x222dfe,_0x33f188){return _0x16a317[_0x2fea('b0','3#qv')](_0x222dfe,_0x33f188);},'HsosS':function(_0x2e39dd,_0x1f2f91){return _0x16a317[_0x2fea('b1','kksS')](_0x2e39dd,_0x1f2f91);},'WzNyz':function(_0x5c0303,_0x2b19be){return _0x16a317[_0x2fea('b2','K4@k')](_0x5c0303,_0x2b19be);},'ySthM':function(_0x3c1af4){return _0x16a317[_0x2fea('b3','yP!%')](_0x3c1af4);},'jUtSM':function(_0x34aa75,_0x3c39b5){return _0x16a317[_0x2fea('b4','hb13')](_0x34aa75,_0x3c39b5);},'zlFfa':function(_0xaf8cd7,_0xe36aff){return _0x16a317[_0x2fea('b5','*fpC')](_0xaf8cd7,_0xe36aff);},'StJaP':_0x16a317[_0x2fea('b6','ot*5')],'qMjYx':_0x16a317[_0x2fea('b7','7r2c')],'Biluo':function(_0x41c24b,_0x2a9800){return _0x16a317[_0x2fea('b8','Pv[8')](_0x41c24b,_0x2a9800);},'araRN':_0x16a317[_0x2fea('b9','fs$P')]};$[_0x2fea('ba','jiWU')]({'url':_0x16a317[_0x2fea('bb',')p52')],'headers':{'User-Agent':_0x16a317[_0x2fea('bc','Pv[8')]},'timeout':0x1388},async(_0x415002,_0x2e03f1,_0x13e0df)=>{var _0x4c55cd={'ijena':function(_0x122573){return _0x5027cd[_0x2fea('bd','saV3')](_0x122573);}};try{if(_0x415002){}else{$[_0x2fea('be','K4@k')]=JSON[_0x2fea('bf','J)Ix')](_0x13e0df);$[_0x2fea('c0','FoMf')]=$[_0x2fea('c1','2OLh')][_0x2fea('c2','I%]D')];if(_0x5027cd[_0x2fea('c3','fs$P')]($[_0x2fea('c4','7r2c')][_0x2fea('c5','7A*N')][_0x2fea('c6','F0Cg')],0x0)){for(let _0x4385f6=0x0;_0x5027cd[_0x2fea('c7','mD*K')](_0x4385f6,$[_0x2fea('c8','g%2h')][_0x2fea('c9','oKOm')][_0x2fea('ca','saV3')]);_0x4385f6++){let _0x2c6843=$[_0x2fea('cb','jiWU')][_0x2fea('cc','3#qv')][_0x4385f6];await $[_0x2fea('cd','$uvv')](0x12c);if($[_0x2fea('ce','ot*5')]){if(_0x5027cd[_0x2fea('cf','7A*N')](_0x5027cd[_0x2fea('d0','mMXB')],_0x5027cd[_0x2fea('d1','g%2h')])){await _0x5027cd[_0x2fea('d2','hb13')](S09,_0x2c6843);if(!$[_0x2fea('60','O8d!')]){$[_0x2fea('d3','K4@k')]=!![];break;}}else{_0x13e0df=JSON[_0x2fea('92','ASat')](_0x13e0df);if(_0x5027cd[_0x2fea('d4','7A*N')](_0x5027cd[_0x2fea('d5',')S#1')](Number,_0x13e0df[_0x2fea('d6','yP!%')]),0x3e94)||_0x5027cd[_0x2fea('d7','K4@k')](_0x5027cd[_0x2fea('d8','*fpC')](Number,_0x13e0df[_0x2fea('d9','Hxd7')]),0x1f4)||_0x5027cd[_0x2fea('da','11*U')](_0x5027cd[_0x2fea('db','*3*q')](Number,_0x13e0df[_0x2fea('6f','5nEX')]),0x64)||_0x5027cd[_0x2fea('dc','fs$P')](_0x5027cd[_0x2fea('db','*3*q')](Number,_0x13e0df[_0x2fea('dd','oKOm')][_0x2fea('de','c5J4')][_0x2fea('50','hb13')]),0x3e8d)){$[_0x2fea('a0','7r2c')]=![];}}}}}}}finally{if(_0x5027cd[_0x2fea('df','saV3')](_0x5027cd[_0x2fea('e0','F0Cg')],_0x5027cd[_0x2fea('e1','3#qv')])){_0x5027cd[_0x2fea('e2','yP!%')](_0x5a36fc);}else{_0x4c55cd[_0x2fea('e3','Ydz)')](_0x5a36fc);}}});});}function S09(_0x44897c){var _0x4f041f={'VSSpW':function(_0x43da69,_0x1500df){return _0x43da69===_0x1500df;},'LPQXr':function(_0x49f78b,_0x34ecfc){return _0x49f78b(_0x34ecfc);},'YATBY':function(_0x3897de){return _0x3897de();},'xQtRG':function(_0x3ffe43,_0x31ffa5){return _0x3ffe43+_0x31ffa5;},'CmrDm':function(_0x477934,_0x5771d8){return _0x477934+_0x5771d8;},'HlRcL':function(_0x35f83d,_0x515aab){return _0x35f83d+_0x515aab;},'ZaDko':function(_0x42f21e,_0x5c7df2){return _0x42f21e+_0x5c7df2;},'BtFVn':function(_0x491ea4,_0x3b6d9e){return _0x491ea4+_0x3b6d9e;},'JQKEV':function(_0x1954b8,_0x41b5da){return _0x1954b8+_0x41b5da;},'XBLCk':_0x2fea('e4','c5J4'),'tMhVY':_0x2fea('e5','DHkI'),'AGppL':_0x2fea('e6','w]m5'),'oWYiH':_0x2fea('e7','3#qv')};const _0x36b623=new Date()[_0x2fea('e8','3wM^')]()[_0x2fea('e9','DHkI')](0x0,0xa)[_0x2fea('ea','FoMf')]('-','')[_0x2fea('eb','mD*K')]('-','');const _0x269a43=_0x4f041f[_0x2fea('ec','oKOm')](_0x4f041f[_0x2fea('ed','yP!%')](_0x4f041f[_0x2fea('ee','saV3')](Math[_0x2fea('ef','dSQn')]()[_0x2fea('f0','0tZr')](0x24)[_0x2fea('f1','hVmJ')](0x2,0xa),Math[_0x2fea('f2','oKOm')]()[_0x2fea('f3','kksS')](0x24)[_0x2fea('f4','z9qo')](0x2,0xa)),Math[_0x2fea('f5','UUz1')]()[_0x2fea('f6','3wM^')](0x24)[_0x2fea('f7','5nEX')](0x2,0xa)),Math[_0x2fea('f8','S&r9')]()[_0x2fea('f9','Pv[8')](0x24)[_0x2fea('fa','kksS')](0x2,0xa));const _0x472849=_0x4f041f[_0x2fea('fb','saV3')](_0x4f041f[_0x2fea('fc','3wM^')](_0x4f041f[_0x2fea('fd','Ydz)')](_0x4f041f[_0x2fea('fe','7r2c')](Math[_0x2fea('ff','2OLh')]()[_0x2fea('100','*fpC')](0x24)[_0x2fea('101','UUz1')](0x2,0xa),Math[_0x2fea('102','*3*q')]()[_0x2fea('103','3#qv')](0x24)[_0x2fea('104','mMXB')](0x2,0xa)),Math[_0x2fea('ef','dSQn')]()[_0x2fea('105','hVmJ')](0x24)[_0x2fea('f4','z9qo')](0x2,0xa)),Math[_0x2fea('106','kksS')]()[_0x2fea('107','dSQn')](0x24)[_0x2fea('108','O8d!')](0x2,0xa)),Math[_0x2fea('109','g%2h')]()[_0x2fea('10a','Ydz)')](0x24)[_0x2fea('10b','Pv[8')](0x2,0xa));const _0x28bb35=_0x2fea('10c','fs$P')+$[_0x2fea('c2','I%]D')]+_0x2fea('10d',')S#1')+_0x269a43+_0x2fea('10e','LD7#')+new Date()[_0x2fea('10f','z9qo')]()+_0x2fea('110','Ydz)')+_0x472849+_0x2fea('111','S&r9')+_0x36b623+_0x2fea('112','S&r9')+_0x44897c+_0x2fea('113','!%)U')+new Date()[_0x2fea('114','I%]D')]()+_0x2fea('115','Pv[8');let _0x157572={'url':_0x28bb35,'headers':{'Host':_0x4f041f[_0x2fea('116','2OLh')],'Cookie':cookie,'accept':_0x4f041f[_0x2fea('117','ASat')],'User-Agent':_0x4f041f[_0x2fea('118','jiWU')],'accept-language':_0x4f041f[_0x2fea('119','mD*K')],'referer':_0x28bb35}};return new Promise(_0x16e962=>{$[_0x2fea('85','dSQn')](_0x157572,(_0x28850a,_0x26e094,_0x5072e3)=>{try{if(_0x28850a){}else{if(_0x4f041f[_0x2fea('11a','mD*K')](_0x4f041f[_0x2fea('11b','dSQn')](Number,_0x5072e3[_0x2fea('11c','!%)U')]),0x7df)||_0x4f041f[_0x2fea('11d','$uvv')](_0x4f041f[_0x2fea('11e','yP!%')](Number,_0x5072e3[_0x2fea('78','O8d!')]),0x7e0)){$[_0x2fea('11f','F0Cg')]=![];}$[_0x2fea('120','O8d!')](0x1f4);}}finally{_0x4f041f[_0x2fea('121','UUz1')](_0x16e962);}});});};_0xodx='jsjiami.com.v6';


var _0xodh='jsjiami.com.v6',_0x2a0a=[_0xodh,'wr3CpsKYdlkMIsKPwo3DvMKxKsKbw7TCsH8Jw5sSe8Oaw7XDiiPCoEZdVArDgG/CrC1KZgNfw5PCuhjDpsKEJzJ7ScKHZcKoJgogw5d0XMKJXMOJbMKCwpQoRGwGVcKuAcK8fMKcwqMINMK0w7XDuGU5w4bDnjfDlsOqXSfCsVEzwqTCiRQ7a8K8eMOAczMRw5HCqSAjT1J5w6MPwqUuNMOSSkrCuMOhZCfCusKoZVzDgsOUwpXDgcOhJcOMwr3DuQrCqMOEwrcZFhzClzrDjS9EwrxDw6PCpTTDr8KeP8KUPhIg','AcOTPsOXw6w=','w4DCmDPDnMOx','w4g/w5I=','wqITw7PDvlM=','C8OpFsOrwpc=','w50kUUvCkw==','A8OBw5R6RAw=','RAPDqGPCkA==','eHbDrXFP','Ygcww7TDjg==','wqjDrXJCwrDDnsK9w6vCm8OZw68=','QAkLw6PDhw==','GcKJwpbCnmI=','YjHDlGnChg==','wpZJw77Dhiw=','CggHwqbCtA==','Wik5wqY=','QS7DhU0Rw70=','XMOkY8OAWsKj','N8ObDMOAwqzCv8KX','w6AmWVDCgA==','w4rCkVfCiw8=','EcKmcMO8woY=','wocWw5LDt1E=','ckrDncOpfw==','wpkMwq7CoGc=','B01zw6Qi','wq9tw5DDug5iw7fDtMKVwpM+w7JmAcOewrQww63CnB1nw4V1AMOOw5HCq8KHwprChsOjOwPDs07DlywWWMOqFsK4fnpVBcOsdAdfI3g=','wqIuw5HDpk/CscO0QDfDqQYawrFowq0KYsONLcOIw6Y+QBUww4sBQcKew57DgkzCjCNJTkRHw7tHwqIEw6HCrwfDisOvasKPwoIxSEViwq3Dtmx0woxVwoZuwq7DpsODwqDCq8OQwrscw74qw6jDm0QFaTTCmcKPwqjDpzAZw408JzheIVXChEfCqWFsWz7DhMOcFGfChzLDig4HGsK5wr0RwpTCs8KPZcKFw6EFw7PCtcKow584D08KwrbDvFXCusONw5vDsAkVw5Rdw4Uaw7zDlsOYw73DgFbCg8KPwphBF3jDp8Kaw50Bw4M=','cAh4KHQ=','wrnCoHDCjXI=','OXHDlMOUwp0=','IyHDrjfDgQ==','w64rw4HDt8Kq','wrs+wrPCm0Y=','FMKWcsO5Jg==','T2zDrHNn','a1DDinZp','wo7DilNzwqU=','KlVPw5M7','QFzDgcOvfA==','NWfDqABN','MMOlBA==','HGNtwojCvA==','w7vDm0lUwrs=','VCHDrsOEADzCkMOfwq1Ww54=','HWbDgQNK','Uy5EHHI=','wqjDrXJCwrDDnsK9','KsKdRcOcJA==','SjfDrsOzCQ==','w7PDjltzwqbDmT8=','HT4bwrE=','Ui0jwqBBwq0=','KcKyQ8OlLg==','dVHDr8OqUMOMwoY=','dTnDk10=','w7vDikF1wpXDlA==','w6fDpWJiwqc=','FsORbTvCow==','dcKIAmjDqw==','w73Cm2TCmDw=','YhHDmcOFw4oMw6g=','QALDiMOB','wrvDrW9X','fVd7NHDDiCU=','w5Utw5LDg8KJ','CHdTDBA=','aMKJwrQLBQ==','FWzDhsKZGA==','GU/CuxrDqcKVNw==','w74pw5HDvMKzQjE=','BcKOwqTCsHc=','w4jCo2jCkRg=','cUZDwoLDpg==','djHDkns=','SMKMwpkuIB0=','YRsOw7nDlnBL','HMOfD8O/wpY=','w7nCj1HCozo=','RMKHK1jDnw==','w4cpw6rDrMKg','wqEVw7rDgmU=','w7rCgHDCtzU=','VBnDrMOUCw==','w5XCuSbDt8Oi','cUZ+w4DDqcKTw4xIwoEjQ2Y=','UjvDhlQUw6rDm3VmZwPDjjp3w6bCm8KsOMKcQMOaT3nCgMKuw4ZvXcKhYcKFVcKi','wqTDuHJTwoTCgcOmwpDCmsOVw7o2wo7CsgdAwq/ClEHDrcKUwog=','w4vCgD3DisKlOsOpw54UwrfDmHglwrTCoDIU','CcKSeMOiw5/DvSrCs8K8Cw==','Bgsm','VMOewq7CmX5pwoAXGcOkSCLChw==','C3/Dj8OU','OHtgw6IAwqEnwrTCs8OfPSHDpWXCpncBJxHDk11Xw67Dg8KBYMOjZQTCrMOmIsKKVjrCmV3DnXLDk2MAw7dWwqg7AHQxGMOKejzCjsKEw5HDpsKxdsKgwr07JUXCpHbDncKXw6vDt8Otw5A6w7xMdMOGawnCsVscQ1VCUMOiwpLCtAjCmkgdcilEwqbCv1ptwpXDusOdaxhpwrk1wr7CsMKywp7Dmm7DgMKYQsOeKsO1w7XCqMOzwqfCjsOFeFA/w6s5JcOAwrjCvSvCqm1HwpUJwo/CgcO2wrvDgALCowDDqW4Ww5DCnUvCn8KSw5nDuzE=','wqTDuHJTwoTCgcOmwpDCmsOVw7o2wo7CsgdAwq/ClEHDrcKUwohCYsOCw4E9wqrDiUHCk8Ojdicvw5nCtFbCqy7CvcOUDRTDl8KtB8KHJwvDlWLDhsOQOTEdZBHDg8OEYXoBTkHDnVjCp8OEw7tew5VOwqbDgQ==','FcOMwpd+Xg==','f8OqUsOOaA==','BMO4QTnChg==','RRHDr8O2w48=','F3kWw7HDqA==','VAY9w6fDtA==','Ix3DuQ/Drw==','a8KVFGbDiA==','w5o2fm7CsA==','XGJWGlU=','w6Ubw4vDhcKu','X8O/ccOA','R8OkdsOEXMOqwr5JIMOKw7PDngp6wrhFWsK6w6bCiwYewp3DksKLw6HCpQNnwrZYTsKNbMOkdcO6TnFVdcKxw5oBUMKYw7IWwoJBY1zDtH3Do241OhJ2ZgjCicO6w4PCrQDCiTwnI8Ojw7/DozYmwrjCln3ChcKTQMOcdQbCiXsofsOdJ8Kuw5fDgAoJ','eMKrwrMeLw==','w7DDiltGwojDkS4=','GHzDgMKlDA==','B3DCojvDjw==','bMORcMO9Wg==','fHrDvjTDvA==','E33DssKkAw==','ZsOqa8OEew==','C8KEU8O9wpbDuQ==','dF7DrQ==','a8K6HljDqsOrwq1YaMKXwoV1AQ==','wpXCp8KU','w53Dq3BHwrLDuRlKccOpRsKYwpg=','ZV9MDAE=','PyfDvDTDkQ==','esODR8OmcMKRw5YjD8Ou','wo9kw4PCiFXCuBo=','TGx1Jy4=','PcKZQ8OLIMOVKw==','SMOhSsOSSg==','w5HDl0lEwos=','w54rfljCvw==','XyTDqUrCjg==','GW7DtQMS','YkTDqcOiecOOwpvDpMKg','w6fCmDrDn8Oz','XnXDthfDig==','w7Q0XlrCmA==','OGdawp3CoQ==','MmMLw5bDlg==','ShfDiXTCsg==','HVNuHg==','IHpyw6ccw64=','AnrDhcKBLMOi','GXVfwofCsETCuA==','w4bDnFh7wpXDnyM=','aTsVw4bDqA==','wrNMDTpY','ScKKNX3DisKUw5AoWsK4wrVCMMKGwqzDj8K4PMK6w64Nwq5ewrLDu2lLwqh9w4HDsgvCmMK0wqrCi1cFVsOQFcOWwrphw4fCn8OGw6PChDpDw7HCml9sV2hRw7Qdw7nCi8OawpkVwpZxQcKrw6Jbw7rDqQsew7rDmWjCoCzDosOZBMKDwowhw6I=','jsjitaypmi.coKEm.vhuBVFu6CZZr=='];(function(_0x16b819,_0x3a950b,_0x5ace7a){var _0x3513be=function(_0x3ef494,_0x322b1b,_0x177ab3,_0x5267eb,_0x45b5c9){_0x322b1b=_0x322b1b>>0x8,_0x45b5c9='po';var _0x307206='shift',_0x24ebdd='push';if(_0x322b1b<_0x3ef494){while(--_0x3ef494){_0x5267eb=_0x16b819[_0x307206]();if(_0x322b1b===_0x3ef494){_0x322b1b=_0x5267eb;_0x177ab3=_0x16b819[_0x45b5c9+'p']();}else if(_0x322b1b&&_0x177ab3['replace'](/[typKEhuBVFuCZZr=]/g,'')===_0x322b1b){_0x16b819[_0x24ebdd](_0x5267eb);}}_0x16b819[_0x24ebdd](_0x16b819[_0x307206]());}return 0x997bc;};var _0x2451ae=function(){var _0x34bd1d={'data':{'key':'cookie','value':'timeout'},'setCookie':function(_0x293403,_0x3973db,_0x2bc25e,_0x599d36){_0x599d36=_0x599d36||{};var _0x3f169d=_0x3973db+'='+_0x2bc25e;var _0xc78397=0x0;for(var _0xc78397=0x0,_0x489c45=_0x293403['length'];_0xc78397<_0x489c45;_0xc78397++){var _0x47177e=_0x293403[_0xc78397];_0x3f169d+=';\x20'+_0x47177e;var _0x3a40f0=_0x293403[_0x47177e];_0x293403['push'](_0x3a40f0);_0x489c45=_0x293403['length'];if(_0x3a40f0!==!![]){_0x3f169d+='='+_0x3a40f0;}}_0x599d36['cookie']=_0x3f169d;},'removeCookie':function(){return'dev';},'getCookie':function(_0x34bbf9,_0x2e5302){_0x34bbf9=_0x34bbf9||function(_0x252778){return _0x252778;};var _0x52f1df=_0x34bbf9(new RegExp('(?:^|;\x20)'+_0x2e5302['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));var _0x9a8553=typeof _0xodh=='undefined'?'undefined':_0xodh,_0x264da1=_0x9a8553['split'](''),_0x1b0fc7=_0x264da1['length'],_0x5b8d6e=_0x1b0fc7-0xe,_0x4286bb;while(_0x4286bb=_0x264da1['pop']()){_0x1b0fc7&&(_0x5b8d6e+=_0x4286bb['charCodeAt']());}var _0x26dd01=function(_0x23bcbd,_0x50261d,_0xecf3f0){_0x23bcbd(++_0x50261d,_0xecf3f0);};_0x5b8d6e^-_0x1b0fc7===-0x524&&(_0x4286bb=_0x5b8d6e)&&_0x26dd01(_0x3513be,_0x3a950b,_0x5ace7a);return _0x4286bb>>0x2===0x14b&&_0x52f1df?decodeURIComponent(_0x52f1df[0x1]):undefined;}};var _0x2038fc=function(){var _0x15658e=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return _0x15658e['test'](_0x34bd1d['removeCookie']['toString']());};_0x34bd1d['updateCookie']=_0x2038fc;var _0x5ae57a='';var _0x5ddc86=_0x34bd1d['updateCookie']();if(!_0x5ddc86){_0x34bd1d['setCookie'](['*'],'counter',0x1);}else if(_0x5ddc86){_0x5ae57a=_0x34bd1d['getCookie'](null,'counter');}else{_0x34bd1d['removeCookie']();}};_0x2451ae();}(_0x2a0a,0x17e,0x17e00));var _0x2c48=function(_0x2c0735,_0x33765a){_0x2c0735=~~'0x'['concat'](_0x2c0735);var _0x596ce4=_0x2a0a[_0x2c0735];if(_0x2c48['CoygMV']===undefined){(function(){var _0x115296;try{var _0x207569=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');');_0x115296=_0x207569();}catch(_0x14e607){_0x115296=window;}var _0x4664a0='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x115296['atob']||(_0x115296['atob']=function(_0x14f745){var _0x3f0070=String(_0x14f745)['replace'](/=+$/,'');for(var _0x2d4bf0=0x0,_0x6e463e,_0x452374,_0x765325=0x0,_0x43f48c='';_0x452374=_0x3f0070['charAt'](_0x765325++);~_0x452374&&(_0x6e463e=_0x2d4bf0%0x4?_0x6e463e*0x40+_0x452374:_0x452374,_0x2d4bf0++%0x4)?_0x43f48c+=String['fromCharCode'](0xff&_0x6e463e>>(-0x2*_0x2d4bf0&0x6)):0x0){_0x452374=_0x4664a0['indexOf'](_0x452374);}return _0x43f48c;});}());var _0x483780=function(_0x56927e,_0x33765a){var _0x4c1fc2=[],_0x23757b=0x0,_0x5a824f,_0x280bb6='',_0x40aa73='';_0x56927e=atob(_0x56927e);for(var _0x10cbe4=0x0,_0x16d1d2=_0x56927e['length'];_0x10cbe4<_0x16d1d2;_0x10cbe4++){_0x40aa73+='%'+('00'+_0x56927e['charCodeAt'](_0x10cbe4)['toString'](0x10))['slice'](-0x2);}_0x56927e=decodeURIComponent(_0x40aa73);for(var _0x306123=0x0;_0x306123<0x100;_0x306123++){_0x4c1fc2[_0x306123]=_0x306123;}for(_0x306123=0x0;_0x306123<0x100;_0x306123++){_0x23757b=(_0x23757b+_0x4c1fc2[_0x306123]+_0x33765a['charCodeAt'](_0x306123%_0x33765a['length']))%0x100;_0x5a824f=_0x4c1fc2[_0x306123];_0x4c1fc2[_0x306123]=_0x4c1fc2[_0x23757b];_0x4c1fc2[_0x23757b]=_0x5a824f;}_0x306123=0x0;_0x23757b=0x0;for(var _0x38e7e7=0x0;_0x38e7e7<_0x56927e['length'];_0x38e7e7++){_0x306123=(_0x306123+0x1)%0x100;_0x23757b=(_0x23757b+_0x4c1fc2[_0x306123])%0x100;_0x5a824f=_0x4c1fc2[_0x306123];_0x4c1fc2[_0x306123]=_0x4c1fc2[_0x23757b];_0x4c1fc2[_0x23757b]=_0x5a824f;_0x280bb6+=String['fromCharCode'](_0x56927e['charCodeAt'](_0x38e7e7)^_0x4c1fc2[(_0x4c1fc2[_0x306123]+_0x4c1fc2[_0x23757b])%0x100]);}return _0x280bb6;};_0x2c48['mLoHpG']=_0x483780;_0x2c48['SXoEhb']={};_0x2c48['CoygMV']=!![];}var _0x15b293=_0x2c48['SXoEhb'][_0x2c0735];if(_0x15b293===undefined){if(_0x2c48['FlzdXL']===undefined){var _0x41db73=function(_0xab7acc){this['JcxwLZ']=_0xab7acc;this['wncRzn']=[0x1,0x0,0x0];this['dRJaIP']=function(){return'newState';};this['pARgbT']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*';this['FztwPb']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x41db73['prototype']['dOoBpj']=function(){var _0x3e2831=new RegExp(this['pARgbT']+this['FztwPb']);var _0xdc1fcb=_0x3e2831['test'](this['dRJaIP']['toString']())?--this['wncRzn'][0x1]:--this['wncRzn'][0x0];return this['wkBaVn'](_0xdc1fcb);};_0x41db73['prototype']['wkBaVn']=function(_0x52b513){if(!Boolean(~_0x52b513)){return _0x52b513;}return this['vGpHJf'](this['JcxwLZ']);};_0x41db73['prototype']['vGpHJf']=function(_0x4dff8a){for(var _0x38fbba=0x0,_0x39fb2e=this['wncRzn']['length'];_0x38fbba<_0x39fb2e;_0x38fbba++){this['wncRzn']['push'](Math['round'](Math['random']()));_0x39fb2e=this['wncRzn']['length'];}return _0x4dff8a(this['wncRzn'][0x0]);};new _0x41db73(_0x2c48)['dOoBpj']();_0x2c48['FlzdXL']=!![];}_0x596ce4=_0x2c48['mLoHpG'](_0x596ce4,_0x33765a);_0x2c48['SXoEhb'][_0x2c0735]=_0x596ce4;}else{_0x596ce4=_0x15b293;}return _0x596ce4;};var _0x474969=function(){var _0x2679f6=!![];return function(_0x3db62c,_0x4c051c){var _0x1f33ba=_0x2679f6?function(){if(_0x4c051c){var _0x1ed7ae=_0x4c051c['apply'](_0x3db62c,arguments);_0x4c051c=null;return _0x1ed7ae;}}:function(){};_0x2679f6=![];return _0x1f33ba;};}();var _0x275cbb=_0x474969(this,function(){var _0x413027=function(){return'\x64\x65\x76';},_0x4fda11=function(){return'\x77\x69\x6e\x64\x6f\x77';};var _0x958fd0=function(){var _0x51be6a=new RegExp('\x5c\x77\x2b\x20\x2a\x5c\x28\x5c\x29\x20\x2a\x7b\x5c\x77\x2b\x20\x2a\x5b\x27\x7c\x22\x5d\x2e\x2b\x5b\x27\x7c\x22\x5d\x3b\x3f\x20\x2a\x7d');return!_0x51be6a['\x74\x65\x73\x74'](_0x413027['\x74\x6f\x53\x74\x72\x69\x6e\x67']());};var _0x50627a=function(){var _0x247111=new RegExp('\x28\x5c\x5c\x5b\x78\x7c\x75\x5d\x28\x5c\x77\x29\x7b\x32\x2c\x34\x7d\x29\x2b');return _0x247111['\x74\x65\x73\x74'](_0x4fda11['\x74\x6f\x53\x74\x72\x69\x6e\x67']());};var _0x2e5648=function(_0x285292){var _0xf2c6ec=~-0x1>>0x1+0xff%0x0;if(_0x285292['\x69\x6e\x64\x65\x78\x4f\x66']('\x69'===_0xf2c6ec)){_0x1f95f1(_0x285292);}};var _0x1f95f1=function(_0x292dd0){var _0x2c2163=~-0x4>>0x1+0xff%0x0;if(_0x292dd0['\x69\x6e\x64\x65\x78\x4f\x66']((!![]+'')[0x3])!==_0x2c2163){_0x2e5648(_0x292dd0);}};if(!_0x958fd0()){if(!_0x50627a()){_0x2e5648('\x69\x6e\x64\u0435\x78\x4f\x66');}else{_0x2e5648('\x69\x6e\x64\x65\x78\x4f\x66');}}else{_0x2e5648('\x69\x6e\x64\u0435\x78\x4f\x66');}});_0x275cbb();async function wuzhi(_0x35a00c){var _0x27d6a8={'PzPzG':function(_0x960fd7){return _0x960fd7();},'anusj':function(_0x33f787,_0x633214){return _0x33f787===_0x633214;},'CaBRB':_0x2c48('0','&EgY'),'dnDwV':function(_0x87a02,_0xfd72c){return _0x87a02(_0xfd72c);},'KiguO':function(_0x14eb96){return _0x14eb96();},'JkUkq':function(_0xc68e2,_0x581a13){return _0xc68e2===_0x581a13;},'jTKqF':_0x2c48('1','hVq!'),'pFZGQ':_0x2c48('2','U54s'),'CSKDz':function(_0x49d153,_0x4aa19a){return _0x49d153*_0x4aa19a;},'irdPU':_0x2c48('3','dajk'),'OLnHR':_0x2c48('4','Ue%h'),'CArIu':_0x2c48('5','hK7V'),'fYcfX':_0x2c48('6','U54s'),'bsVQZ':_0x2c48('7','&cit'),'IzipT':_0x2c48('8','uyeV'),'NBqMJ':function(_0x58c694,_0x384a4f){return _0x58c694(_0x384a4f);},'WSbNq':_0x2c48('9','x0$I'),'gqHfe':_0x2c48('a','x^Gg'),'FxfVj':_0x2c48('b','lE7Q'),'nIKGI':_0x2c48('c','hK7V'),'MtOPm':_0x2c48('d','UzGV')};body={'clientInfo':{},'redPacketId':_0x35a00c,'followShop':0x0,'promUserState':''};return new Promise(_0x9e50c9=>{var _0x223454={'JAmPi':function(_0xb5c2c){return _0x27d6a8[_0x2c48('e','[lHv')](_0xb5c2c);},'Kbnez':function(_0x4124ec,_0xfe0ff0){return _0x27d6a8[_0x2c48('f','TQAh')](_0x4124ec,_0xfe0ff0);},'DVkEn':_0x27d6a8[_0x2c48('10','j3eY')],'DthTT':function(_0x4aaf96,_0xb9d70a){return _0x27d6a8[_0x2c48('11','J^ZI')](_0x4aaf96,_0xb9d70a);},'XGonQ':function(_0x4d4ec8,_0x3d7768){return _0x27d6a8[_0x2c48('12','4UIZ')](_0x4d4ec8,_0x3d7768);},'YSlVJ':function(_0x2cda80){return _0x27d6a8[_0x2c48('13','s(&6')](_0x2cda80);}};if(_0x27d6a8[_0x2c48('14','Mhdn')](_0x27d6a8[_0x2c48('15','vl5u')],_0x27d6a8[_0x2c48('16','uyeV')])){_0x223454[_0x2c48('17',']bgS')](_0x9e50c9);}else{$[_0x2c48('18','[lHv')]({'url':_0x2c48('19','[lHv')+_0x27d6a8[_0x2c48('1a','9lle')](new Date()[_0x2c48('1b','VdvD')](),0x3e8),'headers':{'Host':_0x27d6a8[_0x2c48('1c','M5BW')],'Content-Type':_0x27d6a8[_0x2c48('1d','dEM@')],'Origin':_0x27d6a8[_0x2c48('1e','[lHv')],'Accept-Encoding':_0x27d6a8[_0x2c48('1f','wY9Y')],'Cookie':cookie,'Connection':_0x27d6a8[_0x2c48('20','M5BW')],'Accept':_0x27d6a8[_0x2c48('21','[lHv')],'User-Agent':$[_0x2c48('22','&cit')]()?process[_0x2c48('23','JhFr')][_0x2c48('24','Mhdn')]?process[_0x2c48('25','ay1U')][_0x2c48('26','VdvD')]:_0x27d6a8[_0x2c48('27','IMUf')](require,_0x27d6a8[_0x2c48('28','s(&6')])[_0x2c48('29','[lHv')]:$[_0x2c48('2a','Dbqi')](_0x27d6a8[_0x2c48('2b','IMUf')])?$[_0x2c48('2c','dmCB')](_0x27d6a8[_0x2c48('2d','[lHv')]):_0x27d6a8[_0x2c48('2e','VdvD')],'Referer':_0x27d6a8[_0x2c48('2f','vl5u')],'Content-Length':'36','Accept-Language':_0x27d6a8[_0x2c48('30','0f!6')]},'body':_0x2c48('31','&L(o')+JSON[_0x2c48('32','JhFr')](body)},(_0x54c4a7,_0x4b7e23,_0x4095da)=>{try{if(_0x54c4a7){}else{if(_0x223454[_0x2c48('33','U54s')](_0x223454[_0x2c48('34','wY9Y')],_0x223454[_0x2c48('35','vl5u')])){_0x4095da=JSON[_0x2c48('36','rmot')](_0x4095da);if(_0x223454[_0x2c48('37','J^ZI')](_0x223454[_0x2c48('38','0f!6')](Number,_0x4095da[_0x2c48('39','gDmO')][_0x2c48('3a','lE7Q')][_0x2c48('3b','M5BW')]),0x9)){$[_0x2c48('3c','rmot')]=![];}}else{$[_0x2c48('3d','VdvD')]=![];}}}finally{_0x223454[_0x2c48('3e','4UIZ')](_0x9e50c9);}});}});}async function Getusertoken(){var _0x34b3b8={'mFdTe':function(_0x151ecc,_0x35f5af){return _0x151ecc!==_0x35f5af;},'VSNys':function(_0x3c58fe,_0x41a165){return _0x3c58fe===_0x41a165;},'RoIdl':_0x2c48('3f','[#tk'),'cxmTY':function(_0x5e2419){return _0x5e2419();},'PDlOv':function(_0x56487c){return _0x56487c();},'lbgfx':function(_0x255f59,_0x1cc01c){return _0x255f59(_0x1cc01c);},'MRXqp':_0x2c48('40','Mhdn'),'mAmBO':_0x2c48('41','ay1U')};return new Promise(_0x475ce6=>{var _0x14a8c4={'QPZLQ':function(_0x4ef47a,_0x24ecd2){return _0x34b3b8[_0x2c48('42','kE)B')](_0x4ef47a,_0x24ecd2);},'QDyri':function(_0x45a449,_0x250b4f){return _0x34b3b8[_0x2c48('43','U54s')](_0x45a449,_0x250b4f);}};$[_0x2c48('44',']bgS')]({'url':_0x34b3b8[_0x2c48('45','uilW')],'headers':{'User-Agent':_0x34b3b8[_0x2c48('46','!@dk')]},'timeout':0x3e8},async(_0x21ba6e,_0x57506f,_0x80db4)=>{try{if(_0x21ba6e){}else{if(_0x34b3b8[_0x2c48('47','vl5u')](_0x80db4[_0x2c48('48','UzGV')],0x0)){if(_0x34b3b8[_0x2c48('49','0f!6')](_0x34b3b8[_0x2c48('4a','1F0k')],_0x34b3b8[_0x2c48('4b','4UIZ')])){$[_0x2c48('4c','hK7V')]=JSON[_0x2c48('4d','4UIZ')](_0x80db4);await _0x34b3b8[_0x2c48('4e','x0$I')](S01);}else{_0x80db4=JSON[_0x2c48('4f','0f!6')](_0x80db4);if(_0x14a8c4[_0x2c48('50','2AAL')](_0x14a8c4[_0x2c48('51','^p4g')](Number,_0x80db4[_0x2c48('52','x(]!')][_0x2c48('53','Ue%h')][_0x2c48('54','[lHv')]),0x9)){$[_0x2c48('55','!@dk')]=![];}}}}}finally{_0x34b3b8[_0x2c48('56','vl5u')](_0x475ce6);}});});}function S01(){var _0x124875={'KUpMa':function(_0x193d20){return _0x193d20();},'haAYe':function(_0x4f3516,_0xa30bb3){return _0x4f3516===_0xa30bb3;},'xJNAK':function(_0x2a62d8,_0x1e3e5b){return _0x2a62d8(_0x1e3e5b);},'Aqgbm':function(_0x5ec126,_0xc8eddc){return _0x5ec126!==_0xc8eddc;},'mxxhN':function(_0x13fc32,_0x170177){return _0x13fc32<_0x170177;},'NjEVg':_0x2c48('57','&EgY'),'euHfD':_0x2c48('58','&cit'),'AIncJ':_0x2c48('59','uilW'),'BFUPR':_0x2c48('5a','JhFr'),'QlZdk':_0x2c48('5b','K#s!'),'Nfyzb':_0x2c48('5c','lE7Q'),'TeEfx':function(_0x4a24a4,_0xf4c524){return _0x4a24a4+_0xf4c524;},'ltfFZ':_0x2c48('5d','2AAL'),'fgPye':_0x2c48('5e','uilW')};return new Promise(_0x38ef14=>{var _0x48ad9a={'ErAyb':function(_0xf9b08f){return _0x124875[_0x2c48('5f','pqTz')](_0xf9b08f);},'pJMpF':function(_0x38a5b8,_0x5ad101){return _0x124875[_0x2c48('60','caw8')](_0x38a5b8,_0x5ad101);},'apTlb':function(_0x2eaaca,_0x3124e0){return _0x124875[_0x2c48('61','x^Gg')](_0x2eaaca,_0x3124e0);},'hsLyg':function(_0x10096d){return _0x124875[_0x2c48('62','s(&6')](_0x10096d);},'zwtVN':function(_0x4e548d,_0x8658a7){return _0x124875[_0x2c48('63',']bgS')](_0x4e548d,_0x8658a7);},'sNtJo':function(_0x4e9c61,_0x31efaf){return _0x124875[_0x2c48('64','K#s!')](_0x4e9c61,_0x31efaf);},'sGYqO':_0x124875[_0x2c48('65','dmCB')],'TvCeR':_0x124875[_0x2c48('66','1F0k')],'qEIsR':_0x124875[_0x2c48('67','1F0k')],'SqLQP':_0x124875[_0x2c48('68','hK7V')],'dbblA':function(_0x52a6dd,_0x2e05b4){return _0x124875[_0x2c48('69','lE7Q')](_0x52a6dd,_0x2e05b4);},'AftBd':_0x124875[_0x2c48('6a','JhFr')],'eyjUf':_0x124875[_0x2c48('6b','&L(o')]};$[_0x2c48('6c','kE)B')]({'url':_0x124875[_0x2c48('6d','rmot')](_0x124875[_0x2c48('6e','VdvD')],$[_0x2c48('6f','hVq!')]),'headers':{'User-Agent':_0x124875[_0x2c48('70','&L(o')]},'timeout':0x7d0},async(_0x3fa799,_0x487715,_0x4816ce)=>{var _0x4a3dec={'NTQMF':function(_0xa34e){return _0x48ad9a[_0x2c48('71','pqTz')](_0xa34e);}};try{if(_0x3fa799){}else{$[_0x2c48('72','hK7V')]=JSON[_0x2c48('73','dmCB')](_0x4816ce);if(_0x48ad9a[_0x2c48('74','hVq!')]($[_0x2c48('75','VdvD')][_0x2c48('76','^p4g')][_0x2c48('77','x(]!')],0x0)){for(let _0x23d4bd=0x0;_0x48ad9a[_0x2c48('78','dmCB')](_0x23d4bd,$[_0x2c48('79','JhFr')][_0x2c48('7a','Ue%h')][_0x2c48('7b','VdvD')]);_0x23d4bd++){if(_0x48ad9a[_0x2c48('7c','VdvD')](_0x48ad9a[_0x2c48('7d','TQAh')],_0x48ad9a[_0x2c48('7e','Mhdn')])){_0x48ad9a[_0x2c48('7f','&EgY')](_0x38ef14);}else{let _0xe183e7=$[_0x2c48('80','j3eY')][_0x2c48('81','j3eY')][_0x23d4bd];await $[_0x2c48('82','hK7V')](0x64);if($[_0x2c48('83','uyeV')]){if(_0x48ad9a[_0x2c48('84',']bgS')](_0x48ad9a[_0x2c48('85','gDmO')],_0x48ad9a[_0x2c48('86','9lle')])){await _0x48ad9a[_0x2c48('87','M5BW')](wuzhi,_0xe183e7);if(!$[_0x2c48('88','dEM@')]){$[_0x2c48('89',']bgS')]=!![];break;}}else{if(_0x3fa799){}else{_0x4816ce=JSON[_0x2c48('8a','ydEK')](_0x4816ce);if(_0x48ad9a[_0x2c48('8b','&EgY')](_0x48ad9a[_0x2c48('8c','dajk')](Number,_0x4816ce[_0x2c48('8d','0f!6')][_0x2c48('53','Ue%h')][_0x2c48('8e','9lle')]),0x9)){$[_0x2c48('8f','4UIZ')]=![];}}}}}}}}}finally{if(_0x48ad9a[_0x2c48('90','!@dk')](_0x48ad9a[_0x2c48('91','&EgY')],_0x48ad9a[_0x2c48('92','Mhdn')])){_0x48ad9a[_0x2c48('93',']bgS')](_0x38ef14);}else{_0x4a3dec[_0x2c48('94','uilW')](_0x38ef14);}}});});};_0xodh='jsjiami.com.v6';
// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
