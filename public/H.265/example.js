!function(e, t) {
    "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define("Mp4H265", [], t) : "object" == typeof exports ? exports.Mp4H265 = t() : e.Mp4H265 = t()
}(window, function() {
    return function(e) {
        var t = {};
        function r(n) {
            if (t[n])
                return t[n].exports;
            var o = t[n] = {
                i: n,
                l: !1,
                exports: {}
            };
            return e[n].call(o.exports, o, o.exports, r),
            o.l = !0,
            o.exports
        }
        return r.m = e,
        r.c = t,
        r.d = function(e, t, n) {
            r.o(e, t) || Object.defineProperty(e, t, {
                enumerable: !0,
                get: n
            })
        }
        ,
        r.r = function(e) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
                value: "Module"
            }),
            Object.defineProperty(e, "__esModule", {
                value: !0
            })
        }
        ,
        r.t = function(e, t) {
            if (1 & t && (e = r(e)),
            8 & t)
                return e;
            if (4 & t && "object" == typeof e && e && e.__esModule)
                return e;
            var n = Object.create(null);
            if (r.r(n),
            Object.defineProperty(n, "default", {
                enumerable: !0,
                value: e
            }),
            2 & t && "string" != typeof e)
                for (var o in e)
                    r.d(n, o, function(t) {
                        return e[t]
                    }
                    .bind(null, o));
            return n
        }
        ,
        r.n = function(e) {
            var t = e && e.__esModule ? function() {
                return e.default
            }
            : function() {
                return e
            }
            ;
            return r.d(t, "a", t),
            t
        }
        ,
        r.o = function(e, t) {
            return Object.prototype.hasOwnProperty.call(e, t)
        }
        ,
        r.p = "",
        r(r.s = 42)
    }([function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = function(e) {
            if (e && e.__esModule)
                return e;
            var t = {};
            if (null != e)
                for (var r in e)
                    Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]);
            return t.default = e,
            t
        }(r(2))
          , o = a(r(9))
          , i = a(r(16));
        function a(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }
        function s(e) {
            this.info = new l,
            this.bandTypes = new Int32Array(u),
            this.sectEnd = new Int32Array(u),
            this.data = new Float32Array(e.frameLength),
            this.scaleFactors = new Float32Array(u),
            this.randomState = 523124044,
            this.tns = new i.default(e),
            this.specBuf = new Int32Array(4)
        }
        s.ZERO_BT = 0,
        s.FIRST_PAIR_BT = 5,
        s.ESC_BT = 11,
        s.NOISE_BT = 13,
        s.INTENSITY_BT2 = 14,
        s.INTENSITY_BT = 15,
        s.ONLY_LONG_SEQUENCE = 0,
        s.LONG_START_SEQUENCE = 1,
        s.EIGHT_SHORT_SEQUENCE = 2,
        s.LONG_STOP_SEQUENCE = 3;
        var u = 120
          , c = 8;
        function l() {
            this.windowShape = new Int32Array(2),
            this.windowSequence = s.ONLY_LONG_SEQUENCE,
            this.groupLength = new Int32Array(c),
            this.ltpData1Present = !1,
            this.ltpData2Present = !1
        }
        s.prototype = {
            decode: function(e, t, r) {
                if (this.globalGain = e.read(8),
                r || this.info.decode(e, t, r),
                this.decodeBandTypes(e, t),
                this.decodeScaleFactors(e),
                this.pulsePresent = e.read(1)) {
                    if (this.info.windowSequence === s.EIGHT_SHORT_SEQUENCE)
                        throw new Error("Pulse tool not allowed in eight short sequence.");
                    this.decodePulseData(e)
                }
                if ((this.tnsPresent = e.read(1)) && this.tns.decode(e, this.info),
                this.gainPresent = e.read(1))
                    throw new Error("TODO: decode gain control/SSR");
                this.decodeSpectralData(e)
            },
            decodeBandTypes: function(e, t) {
                for (var r = this.info.windowSequence === s.EIGHT_SHORT_SEQUENCE ? 3 : 5, n = this.info.groupCount, o = this.info.maxSFB, i = this.bandTypes, a = this.sectEnd, u = 0, c = (1 << r) - 1, l = 0; l < n; l++)
                    for (var f = 0; f < o; ) {
                        var d = f
                          , h = e.read(4);
                        if (12 === h)
                            throw new Error("Invalid band type: 12");
                        for (var p = void 0; (p = e.read(r)) === c; )
                            d += p;
                        if (o < (d += p))
                            throw new Error("Too many bands (" + d + " > " + o + ")");
                        for (; f < d; f++)
                            i[u] = h,
                            a[u++] = d
                    }
            },
            decodeScaleFactors: function(e) {
                for (var t = this.info.groupCount, r = this.info.maxSFB, i = [this.globalGain, this.globalGain - 90, 0], a = 0, u = !0, c = this.scaleFactors, l = this.sectEnd, f = this.bandTypes, d = 0; d < t; d++)
                    for (var h = 0; h < r; ) {
                        var p = l[a];
                        switch (f[a]) {
                        case s.ZERO_BT:
                            for (; h < p; h++,
                            a++)
                                c[a] = 0;
                            break;
                        case s.INTENSITY_BT:
                        case s.INTENSITY_BT2:
                            for (; h < p; h++,
                            a++) {
                                i[2] += o.default.decodeScaleFactor(e) - 60;
                                var m = Math.min(Math.max(i[2], -155), 100);
                                c[a] = n.SCALEFACTOR_TABLE[200 - m]
                            }
                            break;
                        case s.NOISE_BT:
                            for (; h < p; h++,
                            a++) {
                                u ? (i[1] += e.read(9) - 256,
                                u = !1) : i[1] += o.default.decodeScaleFactor(e) - 60;
                                var v = Math.min(Math.max(i[1], -100), 155);
                                c[a] = -n.SCALEFACTOR_TABLE[v + 200]
                            }
                            break;
                        default:
                            for (; h < p; h++,
                            a++) {
                                if (i[0] += o.default.decodeScaleFactor(e) - 60,
                                255 < i[0])
                                    throw new Error("Scalefactor out of range: " + i[0]);
                                c[a] = n.SCALEFACTOR_TABLE[i[0] - 100 + 200]
                            }
                        }
                    }
            },
            decodePulseData: function(e) {
                var t = e.read(2) + 1
                  , r = e.read(6);
                if (r >= this.info.swbCount)
                    throw new Error("Pulse SWB out of range: " + r);
                if (this.pulseOffset && this.pulseOffset.length === t || (this.pulseOffset = new Int32Array(t),
                this.pulseAmp = new Int32Array(t)),
                this.pulseOffset[0] = this.info.swbOffsets[r] + e.read(5),
                this.pulseAmp[0] = e.read(4),
                1023 < this.pulseOffset[0])
                    throw new Error("Pulse offset out of range: " + this.pulseOffset[0]);
                for (var n = 1; n < t; n++) {
                    if (this.pulseOffset[n] = e.read(5) + this.pulseOffset[n - 1],
                    1023 < this.pulseOffset[n])
                        throw new Error("Pulse offset out of range: " + this.pulseOffset[n]);
                    this.pulseAmp[n] = e.read(4)
                }
            },
            decodeSpectralData: function(e) {
                for (var t = this.data, r = this.info, i = r.maxSFB, a = r.groupCount, u = r.swbOffsets, c = this.bandTypes, l = this.scaleFactors, f = this.specBuf, d = 0, h = 0, p = 0; p < a; p++) {
                    for (var m = r.groupLength[p], v = 0; v < i; v++,
                    h++) {
                        var y = c[h]
                          , g = d + u[v]
                          , w = u[v + 1] - u[v];
                        if (y === s.ZERO_BT || y === s.INTENSITY_BT || y === s.INTENSITY_BT2)
                            for (var E = 0; E < m; E++,
                            g += 128)
                                for (var _ = g; _ < g + w; _++)
                                    t[_] = 0;
                        else if (y === s.NOISE_BT)
                            for (var b = 0; b < m; b++,
                            g += 128) {
                                for (var N = 0, T = 0; T < w; T++)
                                    this.randomState = 1015568748 * this.randomState | 0,
                                    t[g + T] = this.randomState,
                                    N += t[g + T] * t[g + T];
                                for (var O = l[h] / Math.sqrt(N), k = 0; k < w; k++)
                                    t[g + k] *= O
                            }
                        else
                            for (var S = 0; S < m; S++,
                            g += 128)
                                for (var D = s.FIRST_PAIR_BT <= y ? 2 : 4, I = 0; I < w; I += D) {
                                    o.default.decodeSpectralData(e, y, f, 0);
                                    for (var A = 0; A < D; A++)
                                        t[g + I + A] = 0 < f[A] ? n.IQ_TABLE[f[A]] : -n.IQ_TABLE[-f[A]],
                                        t[g + I + A] *= l[h]
                                }
                    }
                    d += m << 7
                }
                if (this.pulsePresent)
                    throw new Error("TODO: add pulse data")
            }
        },
        l.prototype = {
            decode: function(e, t, r) {
                if (e.advance(1),
                this.windowSequence = e.read(2),
                this.windowShape[0] = this.windowShape[1],
                this.windowShape[1] = e.read(1),
                this.groupCount = 1,
                this.groupLength[0] = 1,
                this.windowSequence === s.EIGHT_SHORT_SEQUENCE) {
                    this.maxSFB = e.read(4);
                    for (var o = 0; o < 7; o++)
                        e.read(1) ? this.groupLength[this.groupCount - 1]++ : (this.groupCount++,
                        this.groupLength[this.groupCount - 1] = 1);
                    this.windowCount = 8,
                    this.swbOffsets = n.SWB_OFFSET_128[t.sampleIndex],
                    this.swbCount = n.SWB_SHORT_WINDOW_COUNT[t.sampleIndex],
                    this.predictorPresent = !1
                } else
                    this.maxSFB = e.read(6),
                    this.windowCount = 1,
                    this.swbOffsets = n.SWB_OFFSET_1024[t.sampleIndex],
                    this.swbCount = n.SWB_LONG_WINDOW_COUNT[t.sampleIndex],
                    this.predictorPresent = !!e.read(1),
                    this.predictorPresent && this.decodePrediction(e, t, r)
            },
            decodePrediction: function(e, t, r) {
                throw new Error("Prediction not implemented.")
            }
        },
        t.default = s,
        e.exports = t.default
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = {
            concat: function() {
                for (var e = arguments.length, t = Array(e), r = 0; r < e; r++)
                    t[r] = arguments[r];
                var n = t.reduce(function(e, t) {
                    return e + t.byteLength
                }, 0)
                  , o = new Uint8Array(n)
                  , i = 0;
                return t.forEach(function(e) {
                    o.set(new Uint8Array(e), i),
                    i += e.byteLength
                }),
                o.buffer
            },
            readUInt32BE: function(e, t) {
                var r = new Uint8Array(e);
                return r[t] << 24 | r[t + 1] << 16 | r[t + 2] << 8 | r[t + 3]
            },
            readUInt24BE: function(e, t) {
                var r = new Uint8Array(e);
                return r[t] << 16 | r[t + 1] << 8 | r[t + 2]
            },
            readUInt16BE: function(e, t) {
                var r = new Uint8Array(e);
                return r[t] << 8 | r[t + 1]
            },
            readUInt8: function(e, t) {
                return new Uint8Array(e)[t]
            },
            readToString: function(e) {
                var t = new Uint8Array(e)
                  , r = String.fromCharCode.apply(String, function(e) {
                    if (Array.isArray(e)) {
                        for (var t = 0, r = Array(e.length); t < e.length; t++)
                            r[t] = e[t];
                        return r
                    }
                    return Array.from(e)
                }(t));
                return decodeURIComponent(escape(r))
            },
            readDate: function(e, t) {
                return new Date(1e3 * n.readUInt32BE(e, t) - 20828448e5)
            },
            readFixed32: function(e, t) {
                return n.readUInt16BE(e, t) + n.readUInt16BE(e, t + 2) / 65536
            },
            readFixed16: function(e, t) {
                return n.readUInt8(e, t) + n.readUInt8(e, t + 1) / 256
            }
        };
        t.default = n,
        e.exports = t.default
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = new Uint16Array([0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 64, 72, 80, 88, 96, 108, 120, 132, 144, 156, 172, 188, 212, 240, 276, 320, 384, 448, 512, 576, 640, 704, 768, 832, 896, 960, 1024])
          , o = new Uint16Array([0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 92, 128])
          , i = new Uint16Array([0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 64, 72, 80, 88, 100, 112, 124, 140, 156, 172, 192, 216, 240, 268, 304, 344, 384, 424, 464, 504, 544, 584, 624, 664, 704, 744, 784, 824, 864, 904, 944, 984, 1024])
          , a = new Uint16Array([0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 92, 128])
          , s = new Uint16Array([0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80, 88, 96, 108, 120, 132, 144, 160, 176, 196, 216, 240, 264, 292, 320, 352, 384, 416, 448, 480, 512, 544, 576, 608, 640, 672, 704, 736, 768, 800, 832, 864, 896, 928, 1024])
          , u = new Uint16Array([0, 4, 8, 12, 16, 20, 28, 36, 44, 56, 68, 80, 96, 112, 128])
          , c = new Uint16Array([0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80, 88, 96, 108, 120, 132, 144, 160, 176, 196, 216, 240, 264, 292, 320, 352, 384, 416, 448, 480, 512, 544, 576, 608, 640, 672, 704, 736, 768, 800, 832, 864, 896, 928, 960, 992, 1024])
          , l = new Uint16Array([0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 52, 60, 68, 76, 84, 92, 100, 108, 116, 124, 136, 148, 160, 172, 188, 204, 220, 240, 260, 284, 308, 336, 364, 396, 432, 468, 508, 552, 600, 652, 704, 768, 832, 896, 960, 1024])
          , f = new Uint16Array([0, 4, 8, 12, 16, 20, 24, 28, 36, 44, 52, 64, 76, 92, 108, 128])
          , d = new Uint16Array([0, 8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 100, 112, 124, 136, 148, 160, 172, 184, 196, 212, 228, 244, 260, 280, 300, 320, 344, 368, 396, 424, 456, 492, 532, 572, 616, 664, 716, 772, 832, 896, 960, 1024])
          , h = new Uint16Array([0, 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 60, 72, 88, 108, 128])
          , p = new Uint16Array([0, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120, 132, 144, 156, 172, 188, 204, 220, 236, 252, 268, 288, 308, 328, 348, 372, 396, 420, 448, 476, 508, 544, 580, 620, 664, 712, 764, 820, 880, 944, 1024])
          , m = new Uint16Array([0, 4, 8, 12, 16, 20, 24, 28, 36, 44, 52, 60, 72, 88, 108, 128]);
        t.SWB_OFFSET_1024 = [n, n, i, s, s, c, l, l, d, d, d, p],
        t.SWB_OFFSET_128 = [o, o, a, u, u, u, f, f, h, h, h, m],
        t.SWB_SHORT_WINDOW_COUNT = new Uint8Array([12, 12, 12, 14, 14, 14, 15, 15, 15, 15, 15, 15]),
        t.SWB_LONG_WINDOW_COUNT = new Uint8Array([41, 41, 47, 49, 49, 51, 47, 47, 43, 43, 43, 40]),
        t.SCALEFACTOR_TABLE = function() {
            for (var e = new Float32Array(428), t = 0; t < 428; t++)
                e[t] = Math.pow(2, (t - 200) / 4);
            return e
        }(),
        t.IQ_TABLE = function() {
            for (var e = new Float32Array(8191), t = 0; t < 8191; t++)
                e[t] = Math.pow(t, 4 / 3);
            return e
        }(),
        t.SAMPLE_RATES = new Int32Array([96e3, 88200, 64e3, 48e3, 44100, 32e3, 24e3, 22050, 16e3, 12e3, 11025, 8e3, 7350])
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = function() {
            function e(e, t) {
                for (var r = 0; r < t.length; r++) {
                    var n = t[r];
                    n.enumerable = n.enumerable || !1,
                    n.configurable = !0,
                    "value"in n && (n.writable = !0),
                    Object.defineProperty(e, n.key, n)
                }
            }
            return function(t, r, n) {
                return r && e(t.prototype, r),
                n && e(t, n),
                t
            }
        }()
          , o = function() {
            function e() {
                !function(e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, e)
            }
            return n(e, [{
                key: "on",
                value: function(e, t) {
                    return this._events || (this._events = {}),
                    this._events[e] || (this._events[e] = []),
                    -1 !== !this._events[e].indexOf(t) && "function" == typeof t && this._events[e].push(t),
                    this
                }
            }, {
                key: "emit",
                value: function(e) {
                    if (this._events && this._events[e]) {
                        for (var t = Array.prototype.slice.call(arguments, 1) || [], r = this._events[e], n = 0, o = r.length; n < o; n++)
                            r[n].apply(this, t);
                        return this
                    }
                }
            }, {
                key: "off",
                value: function(e, t) {
                    if (e || t || (this._events = {}),
                    e && !t && delete this._events[e],
                    e && t) {
                        var r = this._events[e]
                          , n = r.indexOf(t);
                        r.splice(n, 1)
                    }
                    return this
                }
            }]),
            e
        }();
        t.default = o,
        e.exports = t.default
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = function() {
            function e(e, t) {
                for (var r = 0; r < t.length; r++) {
                    var n = t[r];
                    n.enumerable = n.enumerable || !1,
                    n.configurable = !0,
                    "value"in n && (n.writable = !0),
                    Object.defineProperty(e, n.key, n)
                }
            }
            return function(t, r, n) {
                return r && e(t.prototype, r),
                n && e(t, n),
                t
            }
        }()
          , o = function() {
            function e() {
                !function(e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, e)
            }
            return n(e, [{
                key: "on",
                value: function(e, t) {
                    null == this.events && (this.events = {}),
                    null == this.events[e] && (this.events[e] = []),
                    this.events[e].push(t)
                }
            }, {
                key: "off",
                value: function(e, t) {
                    if (this.events && this.events[e]) {
                        var r = this.events[e].indexOf(t);
                        ~r && this.events[e].splice(r, 1)
                    }
                }
            }, {
                key: "once",
                value: function(e, t) {
                    this.on(e, function r() {
                        this.off(e, r);
                        for (var n = arguments.length, o = Array(n), i = 0; i < n; i++)
                            o[i] = arguments[i];
                        t.apply(this, o)
                    })
                }
            }, {
                key: "emit",
                value: function(e) {
                    if (this.events && this.events[e]) {
                        for (var t = arguments.length, r = Array(1 < t ? t - 1 : 0), n = 1; n < t; n++)
                            r[n - 1] = arguments[n];
                        var o = !0
                          , i = !1
                          , a = void 0;
                        try {
                            for (var s, u = this.events[e].slice()[Symbol.iterator](); !(o = (s = u.next()).done); o = !0)
                                s.value.apply(this, r)
                        } catch (e) {
                            i = !0,
                            a = e
                        } finally {
                            try {
                                !o && u.return && u.return()
                            } finally {
                                if (i)
                                    throw a
                            }
                        }
                    }
                }
            }]),
            e
        }();
        t.default = o,
        e.exports = t.default
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = function() {
            function e(e, t) {
                for (var r = 0; r < t.length; r++) {
                    var n = t[r];
                    n.enumerable = n.enumerable || !1,
                    n.configurable = !0,
                    "value"in n && (n.writable = !0),
                    Object.defineProperty(e, n.key, n)
                }
            }
            return function(t, r, n) {
                return r && e(t.prototype, r),
                n && e(t, n),
                t
            }
        }()
          , o = function() {
            function e() {
                !function(e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, e)
            }
            return n(e, [{
                key: "on",
                value: function(e, t) {
                    null == this.events && (this.events = {}),
                    null == this.events[e] && (this.events[e] = []),
                    this.events[e].push(t)
                }
            }, {
                key: "off",
                value: function(e, t) {
                    if (this.events && this.events[e]) {
                        var r = this.events[e].indexOf(t);
                        ~r && this.events[e].splice(r, 1)
                    }
                }
            }, {
                key: "once",
                value: function(e, t) {
                    this.on(e, function r() {
                        this.off(e, r);
                        for (var n = arguments.length, o = Array(n), i = 0; i < n; i++)
                            o[i] = arguments[i];
                        t.apply(this, o)
                    })
                }
            }, {
                key: "emit",
                value: function(e) {
                    if (this.events && this.events[e]) {
                        for (var t = arguments.length, r = Array(1 < t ? t - 1 : 0), n = 1; n < t; n++)
                            r[n - 1] = arguments[n];
                        var o = !0
                          , i = !1
                          , a = void 0;
                        try {
                            for (var s, u = this.events[e].slice()[Symbol.iterator](); !(o = (s = u.next()).done); o = !0)
                                s.value.apply(this, r)
                        } catch (e) {
                            i = !0,
                            a = e
                        } finally {
                            try {
                                !o && u.return && u.return()
                            } finally {
                                if (i)
                                    throw a
                            }
                        }
                    }
                }
            }]),
            e
        }();
        t.default = o,
        e.exports = t.default
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = function() {
            function e(e, t) {
                for (var r = 0; r < t.length; r++) {
                    var n = t[r];
                    n.enumerable = n.enumerable || !1,
                    n.configurable = !0,
                    "value"in n && (n.writable = !0),
                    Object.defineProperty(e, n.key, n)
                }
            }
            return function(t, r, n) {
                return r && e(t.prototype, r),
                n && e(t, n),
                t
            }
        }()
          , o = function() {
            function e() {
                !function(e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, e),
                this.first = null,
                this.last = null,
                this.numBuffers = 0,
                this.availableBytes = 0,
                this.availableBuffers = 0
            }
            return n(e, [{
                key: "copy",
                value: function() {
                    var t = new e;
                    return t.first = this.first,
                    t.last = this.last,
                    t.numBuffers = this.numBuffers,
                    t.availableBytes = this.availableBytes,
                    t.availableBuffers = this.availableBuffers,
                    t
                }
            }, {
                key: "append",
                value: function(e) {
                    return e.prev = this.last,
                    this.last && (this.last.next = e),
                    this.last = e,
                    null == this.first && (this.first = e),
                    this.availableBytes += e.length,
                    this.availableBuffers++,
                    this.numBuffers++
                }
            }, {
                key: "advance",
                value: function() {
                    return !!this.first && (this.availableBytes -= this.first.length,
                    this.availableBuffers--,
                    this.first = this.first.next,
                    null != this.first)
                }
            }, {
                key: "rewind",
                value: function() {
                    return !(this.first && !this.first.prev) && (this.first = this.first ? this.first.prev : this.last,
                    this.first && (this.availableBytes += this.first.length,
                    this.availableBuffers++),
                    null != this.first)
                }
            }, {
                key: "reset",
                value: function() {
                    var e = this;
                    return function() {
                        for (; e.rewind(); )
                            ;
                        return []
                    }()
                }
            }]),
            e
        }();
        t.default = o,
        e.exports = t.default
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = function() {
            function e(e, t) {
                for (var r = 0; r < t.length; r++) {
                    var n = t[r];
                    n.enumerable = n.enumerable || !1,
                    n.configurable = !0,
                    "value"in n && (n.writable = !0),
                    Object.defineProperty(e, n.key, n)
                }
            }
            return function(t, r, n) {
                return r && e(t.prototype, r),
                n && e(t, n),
                t
            }
        }()
          , o = function() {
            function e(t) {
                if (function(t, r) {
                    if (!(t instanceof e))
                        throw new TypeError("Cannot call a class as a function")
                }(this),
                t instanceof Uint8Array)
                    this.data = t;
                else if (t instanceof ArrayBuffer || Array.isArray(t) || "number" == typeof t)
                    this.data = new Uint8Array(t);
                else if (t.buffer instanceof ArrayBuffer)
                    this.data = new Uint8Array(t.buffer,t.byteOffset,t.length * t.BYTES_PER_ELEMENT);
                else {
                    if (!(t instanceof e))
                        throw new Error("Constructing buffer with unknown type.");
                    this.data = t.data
                }
                this.length = this.data.length,
                this.next = null,
                this.prev = null
            }
            return n(e, [{
                key: "copy",
                value: function() {
                    return new e(new Uint8Array(this.data))
                }
            }, {
                key: "slice",
                value: function(t) {
                    var r = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : this.length;
                    return 0 === t && r >= this.length ? new e(this.data) : new e(this.data.subarray(t, t + r))
                }
            }, {
                key: "toBlob",
                value: function() {
                    return e.makeBlob(this.data.buffer)
                }
            }, {
                key: "toBlobURL",
                value: function() {
                    return e.makeBlobURL(this.data.buffer)
                }
            }], [{
                key: "allocate",
                value: function(t) {
                    return new e(t)
                }
            }, {
                key: "makeBlob",
                value: function(e) {
                    var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "application/octet-stream";
                    return new Blob([e],{
                        type: t
                    })
                }
            }, {
                key: "makeBlobURL",
                value: function(e, t) {
                    return URL.createObjectURL(this.makeBlob(e, t))
                }
            }, {
                key: "revokeBlobURL",
                value: function(e) {
                    URL.revokeObjectURL(e)
                }
            }]),
            e
        }();
        t.default = o,
        e.exports = t.default
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = function() {
            function e(e, t) {
                for (var r = 0; r < t.length; r++) {
                    var n = t[r];
                    n.enumerable = n.enumerable || !1,
                    n.configurable = !0,
                    "value"in n && (n.writable = !0),
                    Object.defineProperty(e, n.key, n)
                }
            }
            return function(t, r, n) {
                return r && e(t.prototype, r),
                n && e(t, n),
                t
            }
        }()
          , o = function() {
            function e(t) {
                !function(e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, e),
                this.stream = t,
                this.bitPosition = 0
            }
            return n(e, [{
                key: "copy",
                value: function() {
                    var t = new e(this.stream.copy());
                    return t.bitPosition = this.bitPosition,
                    t
                }
            }, {
                key: "offset",
                value: function() {
                    return 8 * this.stream.offset + this.bitPosition
                }
            }, {
                key: "available",
                value: function(e) {
                    return this.stream.available((e + 8 - this.bitPosition) / 8)
                }
            }, {
                key: "advance",
                value: function(e) {
                    var t = this.bitPosition + e;
                    this.stream.advance(t >> 3),
                    this.bitPosition = 7 & t
                }
            }, {
                key: "rewind",
                value: function(e) {
                    var t = this.bitPosition - e;
                    this.stream.rewind(Math.abs(t >> 3)),
                    this.bitPosition = 7 & t
                }
            }, {
                key: "seek",
                value: function(e) {
                    var t = this.offset();
                    t < e ? this.advance(e - t) : e < t && this.rewind(t - e)
                }
            }, {
                key: "align",
                value: function() {
                    0 !== this.bitPosition && (this.bitPosition = 0,
                    this.stream.advance(1))
                }
            }, {
                key: "read",
                value: function(e, t) {
                    var r = !(2 < arguments.length && void 0 !== arguments[2]) || arguments[2];
                    if (0 === e)
                        return 0;
                    var n = void 0
                      , o = e + this.bitPosition;
                    if (o <= 8)
                        n = (this.stream.peekUInt8() << this.bitPosition & 255) >>> 8 - e;
                    else if (o <= 16)
                        n = (this.stream.peekUInt16() << this.bitPosition & 65535) >>> 16 - e;
                    else if (o <= 24)
                        n = (this.stream.peekUInt24() << this.bitPosition & 16777215) >>> 24 - e;
                    else if (o <= 32)
                        n = this.stream.peekUInt32() << this.bitPosition >>> 32 - e;
                    else {
                        if (!(o <= 40))
                            throw new Error("Too many bits!");
                        n = 4294967296 * this.stream.peekUInt8(0) + (this.stream.peekUInt8(1) << 24 >>> 0) + (this.stream.peekUInt8(2) << 16) + (this.stream.peekUInt8(3) << 8) + this.stream.peekUInt8(4),
                        n %= Math.pow(2, 40 - this.bitPosition),
                        n = Math.floor(n / Math.pow(2, 40 - this.bitPosition - e))
                    }
                    return t && (o < 32 ? n >>> e - 1 && (n = -1 * ((1 << e >>> 0) - n)) : n / Math.pow(2, e - 1) | 0 && (n = -1 * (Math.pow(2, e) - n))),
                    r && this.advance(e),
                    n
                }
            }, {
                key: "peek",
                value: function(e, t) {
                    return this.read(e, t, !1)
                }
            }, {
                key: "readLSB",
                value: function(e, t) {
                    var r = !(2 < arguments.length && void 0 !== arguments[2]) || arguments[2];
                    if (0 === e)
                        return 0;
                    if (40 < e)
                        throw new Error("Too many bits!");
                    var n = e + this.bitPosition
                      , o = this.stream.peekUInt8(0) >>> this.bitPosition;
                    return 8 < n && (o |= this.stream.peekUInt8(1) << 8 - this.bitPosition),
                    16 < n && (o |= this.stream.peekUInt8(2) << 16 - this.bitPosition),
                    24 < n && (o += this.stream.peekUInt8(3) << 24 - this.bitPosition >>> 0),
                    32 < n && (o += this.stream.peekUInt8(4) * Math.pow(2, 32 - this.bitPosition)),
                    32 <= n ? o %= Math.pow(2, e) : o &= (1 << e) - 1,
                    t && (n < 32 ? o >>> e - 1 && (o = -1 * ((1 << e >>> 0) - o)) : o / Math.pow(2, e - 1) | 0 && (o = -1 * (Math.pow(2, e) - o))),
                    r && this.advance(e),
                    o
                }
            }, {
                key: "peekLSB",
                value: function(e, t) {
                    return this.readLSB(e, t, !1)
                }
            }]),
            e
        }();
        t.default = o,
        e.exports = t.default
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = [[1, 0, 60], [3, 4, 59], [4, 10, 61], [4, 11, 58], [4, 12, 62], [5, 26, 57], [5, 27, 63], [6, 56, 56], [6, 57, 64], [6, 58, 55], [6, 59, 65], [7, 120, 66], [7, 121, 54], [7, 122, 67], [8, 246, 53], [8, 247, 68], [8, 248, 52], [8, 249, 69], [8, 250, 51], [9, 502, 70], [9, 503, 50], [9, 504, 49], [9, 505, 71], [10, 1012, 72], [10, 1013, 48], [10, 1014, 73], [10, 1015, 47], [10, 1016, 74], [10, 1017, 46], [11, 2036, 76], [11, 2037, 75], [11, 2038, 77], [11, 2039, 78], [11, 2040, 45], [11, 2041, 43], [12, 4084, 44], [12, 4085, 79], [12, 4086, 42], [12, 4087, 41], [12, 4088, 80], [12, 4089, 40], [13, 8180, 81], [13, 8181, 39], [13, 8182, 82], [13, 8183, 38], [13, 8184, 83], [14, 16370, 37], [14, 16371, 35], [14, 16372, 85], [14, 16373, 33], [14, 16374, 36], [14, 16375, 34], [14, 16376, 84], [14, 16377, 32], [15, 32756, 87], [15, 32757, 89], [15, 32758, 30], [15, 32759, 31], [16, 65520, 86], [16, 65521, 29], [16, 65522, 26], [16, 65523, 27], [16, 65524, 28], [16, 65525, 24], [16, 65526, 88], [17, 131054, 25], [17, 131055, 22], [17, 131056, 23], [18, 262114, 90], [18, 262115, 21], [18, 262116, 19], [18, 262117, 3], [18, 262118, 1], [18, 262119, 2], [18, 262120, 0], [19, 524242, 98], [19, 524243, 99], [19, 524244, 100], [19, 524245, 101], [19, 524246, 102], [19, 524247, 117], [19, 524248, 97], [19, 524249, 91], [19, 524250, 92], [19, 524251, 93], [19, 524252, 94], [19, 524253, 95], [19, 524254, 96], [19, 524255, 104], [19, 524256, 111], [19, 524257, 112], [19, 524258, 113], [19, 524259, 114], [19, 524260, 115], [19, 524261, 116], [19, 524262, 110], [19, 524263, 105], [19, 524264, 106], [19, 524265, 107], [19, 524266, 108], [19, 524267, 109], [19, 524268, 118], [19, 524269, 6], [19, 524270, 8], [19, 524271, 9], [19, 524272, 10], [19, 524273, 5], [19, 524274, 103], [19, 524275, 120], [19, 524276, 119], [19, 524277, 4], [19, 524278, 7], [19, 524279, 15], [19, 524280, 16], [19, 524281, 18], [19, 524282, 20], [19, 524283, 17], [19, 524284, 11], [19, 524285, 12], [19, 524286, 14], [19, 524287, 13]]
          , o = [[[1, 0, 0, 0, 0, 0], [5, 16, 1, 0, 0, 0], [5, 17, -1, 0, 0, 0], [5, 18, 0, 0, 0, -1], [5, 19, 0, 1, 0, 0], [5, 20, 0, 0, 0, 1], [5, 21, 0, 0, -1, 0], [5, 22, 0, 0, 1, 0], [5, 23, 0, -1, 0, 0], [7, 96, 1, -1, 0, 0], [7, 97, -1, 1, 0, 0], [7, 98, 0, 0, -1, 1], [7, 99, 0, 1, -1, 0], [7, 100, 0, -1, 1, 0], [7, 101, 0, 0, 1, -1], [7, 102, 1, 1, 0, 0], [7, 103, 0, 0, -1, -1], [7, 104, -1, -1, 0, 0], [7, 105, 0, -1, -1, 0], [7, 106, 1, 0, -1, 0], [7, 107, 0, 1, 0, -1], [7, 108, -1, 0, 1, 0], [7, 109, 0, 0, 1, 1], [7, 110, 1, 0, 1, 0], [7, 111, 0, -1, 0, 1], [7, 112, 0, 1, 1, 0], [7, 113, 0, 1, 0, 1], [7, 114, -1, 0, -1, 0], [7, 115, 1, 0, 0, 1], [7, 116, -1, 0, 0, -1], [7, 117, 1, 0, 0, -1], [7, 118, -1, 0, 0, 1], [7, 119, 0, -1, 0, -1], [9, 480, 1, 1, -1, 0], [9, 481, -1, 1, -1, 0], [9, 482, 1, -1, 1, 0], [9, 483, 0, 1, 1, -1], [9, 484, 0, 1, -1, 1], [9, 485, 0, -1, 1, 1], [9, 486, 0, -1, 1, -1], [9, 487, 1, -1, -1, 0], [9, 488, 1, 0, -1, 1], [9, 489, 0, 1, -1, -1], [9, 490, -1, 1, 1, 0], [9, 491, -1, 0, 1, -1], [9, 492, -1, -1, 1, 0], [9, 493, 0, -1, -1, 1], [9, 494, 1, -1, 0, 1], [9, 495, 1, -1, 0, -1], [9, 496, -1, 1, 0, -1], [9, 497, -1, -1, -1, 0], [9, 498, 0, -1, -1, -1], [9, 499, 0, 1, 1, 1], [9, 500, 1, 0, 1, -1], [9, 501, 1, 1, 0, 1], [9, 502, -1, 1, 0, 1], [9, 503, 1, 1, 1, 0], [10, 1008, -1, -1, 0, 1], [10, 1009, -1, 0, -1, -1], [10, 1010, 1, 1, 0, -1], [10, 1011, 1, 0, -1, -1], [10, 1012, -1, 0, -1, 1], [10, 1013, -1, -1, 0, -1], [10, 1014, -1, 0, 1, 1], [10, 1015, 1, 0, 1, 1], [11, 2032, 1, -1, 1, -1], [11, 2033, -1, 1, -1, 1], [11, 2034, -1, 1, 1, -1], [11, 2035, 1, -1, -1, 1], [11, 2036, 1, 1, 1, 1], [11, 2037, -1, -1, 1, 1], [11, 2038, 1, 1, -1, -1], [11, 2039, -1, -1, 1, -1], [11, 2040, -1, -1, -1, -1], [11, 2041, 1, 1, -1, 1], [11, 2042, 1, -1, 1, 1], [11, 2043, -1, 1, 1, 1], [11, 2044, -1, 1, -1, -1], [11, 2045, -1, -1, -1, 1], [11, 2046, 1, -1, -1, -1], [11, 2047, 1, 1, 1, -1]], [[3, 0, 0, 0, 0, 0], [4, 2, 1, 0, 0, 0], [5, 6, -1, 0, 0, 0], [5, 7, 0, 0, 0, 1], [5, 8, 0, 0, -1, 0], [5, 9, 0, 0, 0, -1], [5, 10, 0, -1, 0, 0], [5, 11, 0, 0, 1, 0], [5, 12, 0, 1, 0, 0], [6, 26, 0, -1, 1, 0], [6, 27, -1, 1, 0, 0], [6, 28, 0, 1, -1, 0], [6, 29, 0, 0, 1, -1], [6, 30, 0, 1, 0, -1], [6, 31, 0, 0, -1, 1], [6, 32, -1, 0, 0, -1], [6, 33, 1, -1, 0, 0], [6, 34, 1, 0, -1, 0], [6, 35, -1, -1, 0, 0], [6, 36, 0, 0, -1, -1], [6, 37, 1, 0, 1, 0], [6, 38, 1, 0, 0, 1], [6, 39, 0, -1, 0, 1], [6, 40, -1, 0, 1, 0], [6, 41, 0, 1, 0, 1], [6, 42, 0, -1, -1, 0], [6, 43, -1, 0, 0, 1], [6, 44, 0, -1, 0, -1], [6, 45, -1, 0, -1, 0], [6, 46, 1, 1, 0, 0], [6, 47, 0, 1, 1, 0], [6, 48, 0, 0, 1, 1], [6, 49, 1, 0, 0, -1], [7, 100, 0, 1, -1, 1], [7, 101, 1, 0, -1, 1], [7, 102, -1, 1, -1, 0], [7, 103, 0, -1, 1, -1], [7, 104, 1, -1, 1, 0], [7, 105, 1, 1, 0, -1], [7, 106, 1, 0, 1, 1], [7, 107, -1, 1, 1, 0], [7, 108, 0, -1, -1, 1], [7, 109, 1, 1, 1, 0], [7, 110, -1, 0, 1, -1], [7, 111, -1, -1, -1, 0], [7, 112, -1, 0, -1, 1], [7, 113, 1, -1, -1, 0], [7, 114, 1, 1, -1, 0], [8, 230, 1, -1, 0, 1], [8, 231, -1, 1, 0, -1], [8, 232, -1, -1, 1, 0], [8, 233, -1, 0, 1, 1], [8, 234, -1, -1, 0, 1], [8, 235, -1, -1, 0, -1], [8, 236, 0, -1, -1, -1], [8, 237, 1, 0, 1, -1], [8, 238, 1, 0, -1, -1], [8, 239, 0, 1, -1, -1], [8, 240, 0, 1, 1, 1], [8, 241, -1, 1, 0, 1], [8, 242, -1, 0, -1, -1], [8, 243, 0, 1, 1, -1], [8, 244, 1, -1, 0, -1], [8, 245, 0, -1, 1, 1], [8, 246, 1, 1, 0, 1], [8, 247, 1, -1, 1, -1], [8, 248, -1, 1, -1, 1], [9, 498, 1, -1, -1, 1], [9, 499, -1, -1, -1, -1], [9, 500, -1, 1, 1, -1], [9, 501, -1, 1, 1, 1], [9, 502, 1, 1, 1, 1], [9, 503, -1, -1, 1, -1], [9, 504, 1, -1, 1, 1], [9, 505, -1, 1, -1, -1], [9, 506, -1, -1, 1, 1], [9, 507, 1, 1, -1, -1], [9, 508, 1, -1, -1, -1], [9, 509, -1, -1, -1, 1], [9, 510, 1, 1, -1, 1], [9, 511, 1, 1, 1, -1]], [[1, 0, 0, 0, 0, 0], [4, 8, 1, 0, 0, 0], [4, 9, 0, 0, 0, 1], [4, 10, 0, 1, 0, 0], [4, 11, 0, 0, 1, 0], [5, 24, 1, 1, 0, 0], [5, 25, 0, 0, 1, 1], [6, 52, 0, 1, 1, 0], [6, 53, 0, 1, 0, 1], [6, 54, 1, 0, 1, 0], [6, 55, 0, 1, 1, 1], [6, 56, 1, 0, 0, 1], [6, 57, 1, 1, 1, 0], [7, 116, 1, 1, 1, 1], [7, 117, 1, 0, 1, 1], [7, 118, 1, 1, 0, 1], [8, 238, 2, 0, 0, 0], [8, 239, 0, 0, 0, 2], [8, 240, 0, 0, 1, 2], [8, 241, 2, 1, 0, 0], [8, 242, 1, 2, 1, 0], [9, 486, 0, 0, 2, 1], [9, 487, 0, 1, 2, 1], [9, 488, 1, 2, 0, 0], [9, 489, 0, 1, 1, 2], [9, 490, 2, 1, 1, 0], [9, 491, 0, 0, 2, 0], [9, 492, 0, 2, 1, 0], [9, 493, 0, 1, 2, 0], [9, 494, 0, 2, 0, 0], [9, 495, 0, 1, 0, 2], [9, 496, 2, 0, 1, 0], [9, 497, 1, 2, 1, 1], [9, 498, 0, 2, 1, 1], [9, 499, 1, 1, 2, 0], [9, 500, 1, 1, 2, 1], [10, 1002, 1, 2, 0, 1], [10, 1003, 1, 0, 2, 0], [10, 1004, 1, 0, 2, 1], [10, 1005, 0, 2, 0, 1], [10, 1006, 2, 1, 1, 1], [10, 1007, 1, 1, 1, 2], [10, 1008, 2, 1, 0, 1], [10, 1009, 1, 0, 1, 2], [10, 1010, 0, 0, 2, 2], [10, 1011, 0, 1, 2, 2], [10, 1012, 2, 2, 1, 0], [10, 1013, 1, 2, 2, 0], [10, 1014, 1, 0, 0, 2], [10, 1015, 2, 0, 0, 1], [10, 1016, 0, 2, 2, 1], [11, 2034, 2, 2, 0, 0], [11, 2035, 1, 2, 2, 1], [11, 2036, 1, 1, 0, 2], [11, 2037, 2, 0, 1, 1], [11, 2038, 1, 1, 2, 2], [11, 2039, 2, 2, 1, 1], [11, 2040, 0, 2, 2, 0], [11, 2041, 0, 2, 1, 2], [12, 4084, 1, 0, 2, 2], [12, 4085, 2, 2, 0, 1], [12, 4086, 2, 1, 2, 0], [12, 4087, 2, 2, 2, 0], [12, 4088, 0, 2, 2, 2], [12, 4089, 2, 2, 2, 1], [12, 4090, 2, 1, 2, 1], [12, 4091, 1, 2, 1, 2], [12, 4092, 1, 2, 2, 2], [13, 8186, 0, 2, 0, 2], [13, 8187, 2, 0, 2, 0], [13, 8188, 1, 2, 0, 2], [14, 16378, 2, 0, 2, 1], [14, 16379, 2, 1, 1, 2], [14, 16380, 2, 1, 0, 2], [15, 32762, 2, 2, 2, 2], [15, 32763, 2, 2, 1, 2], [15, 32764, 2, 1, 2, 2], [15, 32765, 2, 0, 1, 2], [15, 32766, 2, 0, 0, 2], [16, 65534, 2, 2, 0, 2], [16, 65535, 2, 0, 2, 2]], [[4, 0, 1, 1, 1, 1], [4, 1, 0, 1, 1, 1], [4, 2, 1, 1, 0, 1], [4, 3, 1, 1, 1, 0], [4, 4, 1, 0, 1, 1], [4, 5, 1, 0, 0, 0], [4, 6, 1, 1, 0, 0], [4, 7, 0, 0, 0, 0], [4, 8, 0, 0, 1, 1], [4, 9, 1, 0, 1, 0], [5, 20, 1, 0, 0, 1], [5, 21, 0, 1, 1, 0], [5, 22, 0, 0, 0, 1], [5, 23, 0, 1, 0, 1], [5, 24, 0, 0, 1, 0], [5, 25, 0, 1, 0, 0], [7, 104, 2, 1, 1, 1], [7, 105, 1, 1, 2, 1], [7, 106, 1, 2, 1, 1], [7, 107, 1, 1, 1, 2], [7, 108, 2, 1, 1, 0], [7, 109, 2, 1, 0, 1], [7, 110, 1, 2, 1, 0], [7, 111, 2, 0, 1, 1], [7, 112, 0, 1, 2, 1], [8, 226, 0, 1, 1, 2], [8, 227, 1, 1, 2, 0], [8, 228, 0, 2, 1, 1], [8, 229, 1, 0, 1, 2], [8, 230, 1, 2, 0, 1], [8, 231, 1, 1, 0, 2], [8, 232, 1, 0, 2, 1], [8, 233, 2, 1, 0, 0], [8, 234, 2, 0, 1, 0], [8, 235, 1, 2, 0, 0], [8, 236, 2, 0, 0, 1], [8, 237, 0, 1, 0, 2], [8, 238, 0, 2, 1, 0], [8, 239, 0, 0, 1, 2], [8, 240, 0, 1, 2, 0], [8, 241, 0, 2, 0, 1], [8, 242, 1, 0, 0, 2], [8, 243, 0, 0, 2, 1], [8, 244, 1, 0, 2, 0], [8, 245, 2, 0, 0, 0], [8, 246, 0, 0, 0, 2], [9, 494, 0, 2, 0, 0], [9, 495, 0, 0, 2, 0], [9, 496, 1, 2, 2, 1], [9, 497, 2, 2, 1, 1], [9, 498, 2, 1, 2, 1], [9, 499, 1, 1, 2, 2], [9, 500, 1, 2, 1, 2], [9, 501, 2, 1, 1, 2], [10, 1004, 1, 2, 2, 0], [10, 1005, 2, 2, 1, 0], [10, 1006, 2, 1, 2, 0], [10, 1007, 0, 2, 2, 1], [10, 1008, 0, 1, 2, 2], [10, 1009, 2, 2, 0, 1], [10, 1010, 0, 2, 1, 2], [10, 1011, 2, 0, 2, 1], [10, 1012, 1, 0, 2, 2], [10, 1013, 2, 2, 2, 1], [10, 1014, 1, 2, 0, 2], [10, 1015, 2, 0, 1, 2], [10, 1016, 2, 1, 0, 2], [10, 1017, 1, 2, 2, 2], [11, 2036, 2, 1, 2, 2], [11, 2037, 2, 2, 1, 2], [11, 2038, 0, 2, 2, 0], [11, 2039, 2, 2, 0, 0], [11, 2040, 0, 0, 2, 2], [11, 2041, 2, 0, 2, 0], [11, 2042, 0, 2, 0, 2], [11, 2043, 2, 0, 0, 2], [11, 2044, 2, 2, 2, 2], [11, 2045, 0, 2, 2, 2], [11, 2046, 2, 2, 2, 0], [12, 4094, 2, 2, 0, 2], [12, 4095, 2, 0, 2, 2]], [[1, 0, 0, 0], [4, 8, -1, 0], [4, 9, 1, 0], [4, 10, 0, 1], [4, 11, 0, -1], [5, 24, 1, -1], [5, 25, -1, 1], [5, 26, -1, -1], [5, 27, 1, 1], [7, 112, -2, 0], [7, 113, 0, 2], [7, 114, 2, 0], [7, 115, 0, -2], [8, 232, -2, -1], [8, 233, 2, 1], [8, 234, -1, -2], [8, 235, 1, 2], [8, 236, -2, 1], [8, 237, 2, -1], [8, 238, -1, 2], [8, 239, 1, -2], [8, 240, -3, 0], [8, 241, 3, 0], [8, 242, 0, -3], [8, 243, 0, 3], [9, 488, -3, -1], [9, 489, 1, 3], [9, 490, 3, 1], [9, 491, -1, -3], [9, 492, -3, 1], [9, 493, 3, -1], [9, 494, 1, -3], [9, 495, -1, 3], [9, 496, -2, 2], [9, 497, 2, 2], [9, 498, -2, -2], [9, 499, 2, -2], [10, 1e3, -3, -2], [10, 1001, 3, -2], [10, 1002, -2, 3], [10, 1003, 2, -3], [10, 1004, 3, 2], [10, 1005, 2, 3], [10, 1006, -3, 2], [10, 1007, -2, -3], [10, 1008, 0, -4], [10, 1009, -4, 0], [10, 1010, 4, 1], [10, 1011, 4, 0], [11, 2024, -4, -1], [11, 2025, 0, 4], [11, 2026, 4, -1], [11, 2027, -1, -4], [11, 2028, 1, 4], [11, 2029, -1, 4], [11, 2030, -4, 1], [11, 2031, 1, -4], [11, 2032, 3, -3], [11, 2033, -3, -3], [11, 2034, -3, 3], [11, 2035, -2, 4], [11, 2036, -4, -2], [11, 2037, 4, 2], [11, 2038, 2, -4], [11, 2039, 2, 4], [11, 2040, 3, 3], [11, 2041, -4, 2], [12, 4084, -2, -4], [12, 4085, 4, -2], [12, 4086, 3, -4], [12, 4087, -4, -3], [12, 4088, -4, 3], [12, 4089, 3, 4], [12, 4090, -3, 4], [12, 4091, 4, 3], [12, 4092, 4, -3], [12, 4093, -3, -4], [13, 8188, 4, -4], [13, 8189, -4, 4], [13, 8190, 4, 4], [13, 8191, -4, -4]], [[4, 0, 0, 0], [4, 1, 1, 0], [4, 2, 0, -1], [4, 3, 0, 1], [4, 4, -1, 0], [4, 5, 1, 1], [4, 6, -1, 1], [4, 7, 1, -1], [4, 8, -1, -1], [6, 36, 2, -1], [6, 37, 2, 1], [6, 38, -2, 1], [6, 39, -2, -1], [6, 40, -2, 0], [6, 41, -1, 2], [6, 42, 2, 0], [6, 43, 1, -2], [6, 44, 1, 2], [6, 45, 0, -2], [6, 46, -1, -2], [6, 47, 0, 2], [6, 48, 2, -2], [6, 49, -2, 2], [6, 50, -2, -2], [6, 51, 2, 2], [7, 104, -3, 1], [7, 105, 3, 1], [7, 106, 3, -1], [7, 107, -1, 3], [7, 108, -3, -1], [7, 109, 1, 3], [7, 110, 1, -3], [7, 111, -1, -3], [7, 112, 3, 0], [7, 113, -3, 0], [7, 114, 0, -3], [7, 115, 0, 3], [7, 116, 3, 2], [8, 234, -3, -2], [8, 235, -2, 3], [8, 236, 2, 3], [8, 237, 3, -2], [8, 238, 2, -3], [8, 239, -2, -3], [8, 240, -3, 2], [8, 241, 3, 3], [9, 484, 3, -3], [9, 485, -3, -3], [9, 486, -3, 3], [9, 487, 1, -4], [9, 488, -1, -4], [9, 489, 4, 1], [9, 490, -4, 1], [9, 491, -4, -1], [9, 492, 1, 4], [9, 493, 4, -1], [9, 494, -1, 4], [9, 495, 0, -4], [9, 496, -4, 2], [9, 497, -4, -2], [9, 498, 2, 4], [9, 499, -2, -4], [9, 500, -4, 0], [9, 501, 4, 2], [9, 502, 4, -2], [9, 503, -2, 4], [9, 504, 4, 0], [9, 505, 2, -4], [9, 506, 0, 4], [10, 1014, -3, -4], [10, 1015, -3, 4], [10, 1016, 3, -4], [10, 1017, 4, -3], [10, 1018, 3, 4], [10, 1019, 4, 3], [10, 1020, -4, 3], [10, 1021, -4, -3], [11, 2044, 4, 4], [11, 2045, -4, 4], [11, 2046, -4, -4], [11, 2047, 4, -4]], [[1, 0, 0, 0], [3, 4, 1, 0], [3, 5, 0, 1], [4, 12, 1, 1], [6, 52, 2, 1], [6, 53, 1, 2], [6, 54, 2, 0], [6, 55, 0, 2], [7, 112, 3, 1], [7, 113, 1, 3], [7, 114, 2, 2], [7, 115, 3, 0], [7, 116, 0, 3], [8, 234, 2, 3], [8, 235, 3, 2], [8, 236, 1, 4], [8, 237, 4, 1], [8, 238, 1, 5], [8, 239, 5, 1], [8, 240, 3, 3], [8, 241, 2, 4], [8, 242, 0, 4], [8, 243, 4, 0], [9, 488, 4, 2], [9, 489, 2, 5], [9, 490, 5, 2], [9, 491, 0, 5], [9, 492, 6, 1], [9, 493, 5, 0], [9, 494, 1, 6], [9, 495, 4, 3], [9, 496, 3, 5], [9, 497, 3, 4], [9, 498, 5, 3], [9, 499, 2, 6], [9, 500, 6, 2], [9, 501, 1, 7], [10, 1004, 3, 6], [10, 1005, 0, 6], [10, 1006, 6, 0], [10, 1007, 4, 4], [10, 1008, 7, 1], [10, 1009, 4, 5], [10, 1010, 7, 2], [10, 1011, 5, 4], [10, 1012, 6, 3], [10, 1013, 2, 7], [10, 1014, 7, 3], [10, 1015, 6, 4], [10, 1016, 5, 5], [10, 1017, 4, 6], [10, 1018, 3, 7], [11, 2038, 7, 0], [11, 2039, 0, 7], [11, 2040, 6, 5], [11, 2041, 5, 6], [11, 2042, 7, 4], [11, 2043, 4, 7], [11, 2044, 5, 7], [11, 2045, 7, 5], [12, 4092, 7, 6], [12, 4093, 6, 6], [12, 4094, 6, 7], [12, 4095, 7, 7]], [[3, 0, 1, 1], [4, 2, 2, 1], [4, 3, 1, 0], [4, 4, 1, 2], [4, 5, 0, 1], [4, 6, 2, 2], [5, 14, 0, 0], [5, 15, 2, 0], [5, 16, 0, 2], [5, 17, 3, 1], [5, 18, 1, 3], [5, 19, 3, 2], [5, 20, 2, 3], [6, 42, 3, 3], [6, 43, 4, 1], [6, 44, 1, 4], [6, 45, 4, 2], [6, 46, 2, 4], [6, 47, 3, 0], [6, 48, 0, 3], [6, 49, 4, 3], [6, 50, 3, 4], [6, 51, 5, 2], [7, 104, 5, 1], [7, 105, 2, 5], [7, 106, 1, 5], [7, 107, 5, 3], [7, 108, 3, 5], [7, 109, 4, 4], [7, 110, 5, 4], [7, 111, 0, 4], [7, 112, 4, 5], [7, 113, 4, 0], [7, 114, 2, 6], [7, 115, 6, 2], [7, 116, 6, 1], [7, 117, 1, 6], [8, 236, 3, 6], [8, 237, 6, 3], [8, 238, 5, 5], [8, 239, 5, 0], [8, 240, 6, 4], [8, 241, 0, 5], [8, 242, 4, 6], [8, 243, 7, 1], [8, 244, 7, 2], [8, 245, 2, 7], [8, 246, 6, 5], [8, 247, 7, 3], [8, 248, 1, 7], [8, 249, 5, 6], [8, 250, 3, 7], [9, 502, 6, 6], [9, 503, 7, 4], [9, 504, 6, 0], [9, 505, 4, 7], [9, 506, 0, 6], [9, 507, 7, 5], [9, 508, 7, 6], [9, 509, 6, 7], [10, 1020, 5, 7], [10, 1021, 7, 0], [10, 1022, 0, 7], [10, 1023, 7, 7]], [[1, 0, 0, 0], [3, 4, 1, 0], [3, 5, 0, 1], [4, 12, 1, 1], [6, 52, 2, 1], [6, 53, 1, 2], [6, 54, 2, 0], [6, 55, 0, 2], [7, 112, 3, 1], [7, 113, 2, 2], [7, 114, 1, 3], [8, 230, 3, 0], [8, 231, 0, 3], [8, 232, 2, 3], [8, 233, 3, 2], [8, 234, 1, 4], [8, 235, 4, 1], [8, 236, 2, 4], [8, 237, 1, 5], [9, 476, 4, 2], [9, 477, 3, 3], [9, 478, 0, 4], [9, 479, 4, 0], [9, 480, 5, 1], [9, 481, 2, 5], [9, 482, 1, 6], [9, 483, 3, 4], [9, 484, 5, 2], [9, 485, 6, 1], [9, 486, 4, 3], [10, 974, 0, 5], [10, 975, 2, 6], [10, 976, 5, 0], [10, 977, 1, 7], [10, 978, 3, 5], [10, 979, 1, 8], [10, 980, 8, 1], [10, 981, 4, 4], [10, 982, 5, 3], [10, 983, 6, 2], [10, 984, 7, 1], [10, 985, 0, 6], [10, 986, 8, 2], [10, 987, 2, 8], [10, 988, 3, 6], [10, 989, 2, 7], [10, 990, 4, 5], [10, 991, 9, 1], [10, 992, 1, 9], [10, 993, 7, 2], [11, 1988, 6, 0], [11, 1989, 5, 4], [11, 1990, 6, 3], [11, 1991, 8, 3], [11, 1992, 0, 7], [11, 1993, 9, 2], [11, 1994, 3, 8], [11, 1995, 4, 6], [11, 1996, 3, 7], [11, 1997, 0, 8], [11, 1998, 10, 1], [11, 1999, 6, 4], [11, 2e3, 2, 9], [11, 2001, 5, 5], [11, 2002, 8, 0], [11, 2003, 7, 0], [11, 2004, 7, 3], [11, 2005, 10, 2], [11, 2006, 9, 3], [11, 2007, 8, 4], [11, 2008, 1, 10], [11, 2009, 7, 4], [11, 2010, 6, 5], [11, 2011, 5, 6], [11, 2012, 4, 8], [11, 2013, 4, 7], [11, 2014, 3, 9], [11, 2015, 11, 1], [11, 2016, 5, 8], [11, 2017, 9, 0], [11, 2018, 8, 5], [12, 4038, 10, 3], [12, 4039, 2, 10], [12, 4040, 0, 9], [12, 4041, 11, 2], [12, 4042, 9, 4], [12, 4043, 6, 6], [12, 4044, 12, 1], [12, 4045, 4, 9], [12, 4046, 8, 6], [12, 4047, 1, 11], [12, 4048, 9, 5], [12, 4049, 10, 4], [12, 4050, 5, 7], [12, 4051, 7, 5], [12, 4052, 2, 11], [12, 4053, 1, 12], [12, 4054, 12, 2], [12, 4055, 11, 3], [12, 4056, 3, 10], [12, 4057, 5, 9], [12, 4058, 6, 7], [12, 4059, 8, 7], [12, 4060, 11, 4], [12, 4061, 0, 10], [12, 4062, 7, 6], [12, 4063, 12, 3], [12, 4064, 10, 0], [12, 4065, 10, 5], [12, 4066, 4, 10], [12, 4067, 6, 8], [12, 4068, 2, 12], [12, 4069, 9, 6], [12, 4070, 9, 7], [12, 4071, 4, 11], [12, 4072, 11, 0], [12, 4073, 6, 9], [12, 4074, 3, 11], [12, 4075, 5, 10], [13, 8152, 8, 8], [13, 8153, 7, 8], [13, 8154, 12, 5], [13, 8155, 3, 12], [13, 8156, 11, 5], [13, 8157, 7, 7], [13, 8158, 12, 4], [13, 8159, 11, 6], [13, 8160, 10, 6], [13, 8161, 4, 12], [13, 8162, 7, 9], [13, 8163, 5, 11], [13, 8164, 0, 11], [13, 8165, 12, 6], [13, 8166, 6, 10], [13, 8167, 12, 0], [13, 8168, 10, 7], [13, 8169, 5, 12], [13, 8170, 7, 10], [13, 8171, 9, 8], [13, 8172, 0, 12], [13, 8173, 11, 7], [13, 8174, 8, 9], [13, 8175, 9, 9], [13, 8176, 10, 8], [13, 8177, 7, 11], [13, 8178, 12, 7], [13, 8179, 6, 11], [13, 8180, 8, 11], [13, 8181, 11, 8], [13, 8182, 7, 12], [13, 8183, 6, 12], [14, 16368, 8, 10], [14, 16369, 10, 9], [14, 16370, 8, 12], [14, 16371, 9, 10], [14, 16372, 9, 11], [14, 16373, 9, 12], [14, 16374, 10, 11], [14, 16375, 12, 9], [14, 16376, 10, 10], [14, 16377, 11, 9], [14, 16378, 12, 8], [14, 16379, 11, 10], [14, 16380, 12, 10], [14, 16381, 12, 11], [15, 32764, 10, 12], [15, 32765, 11, 11], [15, 32766, 11, 12], [15, 32767, 12, 12]], [[4, 0, 1, 1], [4, 1, 1, 2], [4, 2, 2, 1], [5, 6, 2, 2], [5, 7, 1, 0], [5, 8, 0, 1], [5, 9, 1, 3], [5, 10, 3, 2], [5, 11, 3, 1], [5, 12, 2, 3], [5, 13, 3, 3], [6, 28, 2, 0], [6, 29, 0, 2], [6, 30, 2, 4], [6, 31, 4, 2], [6, 32, 1, 4], [6, 33, 4, 1], [6, 34, 0, 0], [6, 35, 4, 3], [6, 36, 3, 4], [6, 37, 3, 0], [6, 38, 0, 3], [6, 39, 4, 4], [6, 40, 2, 5], [6, 41, 5, 2], [7, 84, 1, 5], [7, 85, 5, 1], [7, 86, 5, 3], [7, 87, 3, 5], [7, 88, 5, 4], [7, 89, 4, 5], [7, 90, 6, 2], [7, 91, 2, 6], [7, 92, 6, 3], [7, 93, 4, 0], [7, 94, 6, 1], [7, 95, 0, 4], [7, 96, 1, 6], [7, 97, 3, 6], [7, 98, 5, 5], [7, 99, 6, 4], [7, 100, 4, 6], [8, 202, 6, 5], [8, 203, 7, 2], [8, 204, 3, 7], [8, 205, 2, 7], [8, 206, 5, 6], [8, 207, 8, 2], [8, 208, 7, 3], [8, 209, 5, 0], [8, 210, 7, 1], [8, 211, 0, 5], [8, 212, 8, 1], [8, 213, 1, 7], [8, 214, 8, 3], [8, 215, 7, 4], [8, 216, 4, 7], [8, 217, 2, 8], [8, 218, 6, 6], [8, 219, 7, 5], [8, 220, 1, 8], [8, 221, 3, 8], [8, 222, 8, 4], [8, 223, 4, 8], [8, 224, 5, 7], [8, 225, 8, 5], [8, 226, 5, 8], [9, 454, 7, 6], [9, 455, 6, 7], [9, 456, 9, 2], [9, 457, 6, 0], [9, 458, 6, 8], [9, 459, 9, 3], [9, 460, 3, 9], [9, 461, 9, 1], [9, 462, 2, 9], [9, 463, 0, 6], [9, 464, 8, 6], [9, 465, 9, 4], [9, 466, 4, 9], [9, 467, 10, 2], [9, 468, 1, 9], [9, 469, 7, 7], [9, 470, 8, 7], [9, 471, 9, 5], [9, 472, 7, 8], [9, 473, 10, 3], [9, 474, 5, 9], [9, 475, 10, 4], [9, 476, 2, 10], [9, 477, 10, 1], [9, 478, 3, 10], [9, 479, 9, 6], [9, 480, 6, 9], [9, 481, 8, 0], [9, 482, 4, 10], [9, 483, 7, 0], [9, 484, 11, 2], [10, 970, 7, 9], [10, 971, 11, 3], [10, 972, 10, 6], [10, 973, 1, 10], [10, 974, 11, 1], [10, 975, 9, 7], [10, 976, 0, 7], [10, 977, 8, 8], [10, 978, 10, 5], [10, 979, 3, 11], [10, 980, 5, 10], [10, 981, 8, 9], [10, 982, 11, 5], [10, 983, 0, 8], [10, 984, 11, 4], [10, 985, 2, 11], [10, 986, 7, 10], [10, 987, 6, 10], [10, 988, 10, 7], [10, 989, 4, 11], [10, 990, 1, 11], [10, 991, 12, 2], [10, 992, 9, 8], [10, 993, 12, 3], [10, 994, 11, 6], [10, 995, 5, 11], [10, 996, 12, 4], [10, 997, 11, 7], [10, 998, 12, 5], [10, 999, 3, 12], [10, 1e3, 6, 11], [10, 1001, 9, 0], [10, 1002, 10, 8], [10, 1003, 10, 0], [10, 1004, 12, 1], [10, 1005, 0, 9], [10, 1006, 4, 12], [10, 1007, 9, 9], [10, 1008, 12, 6], [10, 1009, 2, 12], [10, 1010, 8, 10], [11, 2022, 9, 10], [11, 2023, 1, 12], [11, 2024, 11, 8], [11, 2025, 12, 7], [11, 2026, 7, 11], [11, 2027, 5, 12], [11, 2028, 6, 12], [11, 2029, 10, 9], [11, 2030, 8, 11], [11, 2031, 12, 8], [11, 2032, 0, 10], [11, 2033, 7, 12], [11, 2034, 11, 0], [11, 2035, 10, 10], [11, 2036, 11, 9], [11, 2037, 11, 10], [11, 2038, 0, 11], [11, 2039, 11, 11], [11, 2040, 9, 11], [11, 2041, 10, 11], [11, 2042, 12, 0], [11, 2043, 8, 12], [12, 4088, 12, 9], [12, 4089, 10, 12], [12, 4090, 9, 12], [12, 4091, 11, 12], [12, 4092, 12, 11], [12, 4093, 0, 12], [12, 4094, 12, 10], [12, 4095, 12, 12]], [[4, 0, 0, 0], [4, 1, 1, 1], [5, 4, 16, 16], [5, 5, 1, 0], [5, 6, 0, 1], [5, 7, 2, 1], [5, 8, 1, 2], [5, 9, 2, 2], [6, 20, 1, 3], [6, 21, 3, 1], [6, 22, 3, 2], [6, 23, 2, 0], [6, 24, 2, 3], [6, 25, 0, 2], [6, 26, 3, 3], [7, 54, 4, 1], [7, 55, 1, 4], [7, 56, 4, 2], [7, 57, 2, 4], [7, 58, 4, 3], [7, 59, 3, 4], [7, 60, 3, 0], [7, 61, 0, 3], [7, 62, 5, 1], [7, 63, 5, 2], [7, 64, 2, 5], [7, 65, 4, 4], [7, 66, 1, 5], [7, 67, 5, 3], [7, 68, 3, 5], [7, 69, 5, 4], [8, 140, 4, 5], [8, 141, 6, 2], [8, 142, 2, 6], [8, 143, 6, 1], [8, 144, 6, 3], [8, 145, 3, 6], [8, 146, 1, 6], [8, 147, 4, 16], [8, 148, 3, 16], [8, 149, 16, 5], [8, 150, 16, 3], [8, 151, 16, 4], [8, 152, 6, 4], [8, 153, 16, 6], [8, 154, 4, 0], [8, 155, 4, 6], [8, 156, 0, 4], [8, 157, 2, 16], [8, 158, 5, 5], [8, 159, 5, 16], [8, 160, 16, 7], [8, 161, 16, 2], [8, 162, 16, 8], [8, 163, 2, 7], [8, 164, 7, 2], [8, 165, 3, 7], [8, 166, 6, 5], [8, 167, 5, 6], [8, 168, 6, 16], [8, 169, 16, 10], [8, 170, 7, 3], [8, 171, 7, 1], [8, 172, 16, 9], [8, 173, 7, 16], [8, 174, 1, 16], [8, 175, 1, 7], [8, 176, 4, 7], [8, 177, 16, 11], [8, 178, 7, 4], [8, 179, 16, 12], [8, 180, 8, 16], [8, 181, 16, 1], [8, 182, 6, 6], [8, 183, 9, 16], [8, 184, 2, 8], [8, 185, 5, 7], [8, 186, 10, 16], [8, 187, 16, 13], [8, 188, 8, 3], [8, 189, 8, 2], [8, 190, 3, 8], [8, 191, 5, 0], [8, 192, 16, 14], [8, 193, 11, 16], [8, 194, 7, 5], [8, 195, 4, 8], [8, 196, 6, 7], [8, 197, 7, 6], [8, 198, 0, 5], [9, 398, 8, 4], [9, 399, 16, 15], [9, 400, 12, 16], [9, 401, 1, 8], [9, 402, 8, 1], [9, 403, 14, 16], [9, 404, 5, 8], [9, 405, 13, 16], [9, 406, 3, 9], [9, 407, 8, 5], [9, 408, 7, 7], [9, 409, 2, 9], [9, 410, 8, 6], [9, 411, 9, 2], [9, 412, 9, 3], [9, 413, 15, 16], [9, 414, 4, 9], [9, 415, 6, 8], [9, 416, 6, 0], [9, 417, 9, 4], [9, 418, 5, 9], [9, 419, 8, 7], [9, 420, 7, 8], [9, 421, 1, 9], [9, 422, 10, 3], [9, 423, 0, 6], [9, 424, 10, 2], [9, 425, 9, 1], [9, 426, 9, 5], [9, 427, 4, 10], [9, 428, 2, 10], [9, 429, 9, 6], [9, 430, 3, 10], [9, 431, 6, 9], [9, 432, 10, 4], [9, 433, 8, 8], [9, 434, 10, 5], [9, 435, 9, 7], [9, 436, 11, 3], [9, 437, 1, 10], [9, 438, 7, 0], [9, 439, 10, 6], [9, 440, 7, 9], [9, 441, 3, 11], [9, 442, 5, 10], [9, 443, 10, 1], [9, 444, 4, 11], [9, 445, 11, 2], [9, 446, 13, 2], [9, 447, 6, 10], [9, 448, 13, 3], [9, 449, 2, 11], [9, 450, 16, 0], [9, 451, 5, 11], [9, 452, 11, 5], [10, 906, 11, 4], [10, 907, 9, 8], [10, 908, 7, 10], [10, 909, 8, 9], [10, 910, 0, 16], [10, 911, 4, 13], [10, 912, 0, 7], [10, 913, 3, 13], [10, 914, 11, 6], [10, 915, 13, 1], [10, 916, 13, 4], [10, 917, 12, 3], [10, 918, 2, 13], [10, 919, 13, 5], [10, 920, 8, 10], [10, 921, 6, 11], [10, 922, 10, 8], [10, 923, 10, 7], [10, 924, 14, 2], [10, 925, 12, 4], [10, 926, 1, 11], [10, 927, 4, 12], [10, 928, 11, 1], [10, 929, 3, 12], [10, 930, 1, 13], [10, 931, 12, 2], [10, 932, 7, 11], [10, 933, 3, 14], [10, 934, 5, 12], [10, 935, 5, 13], [10, 936, 14, 4], [10, 937, 4, 14], [10, 938, 11, 7], [10, 939, 14, 3], [10, 940, 12, 5], [10, 941, 13, 6], [10, 942, 12, 6], [10, 943, 8, 0], [10, 944, 11, 8], [10, 945, 2, 12], [10, 946, 9, 9], [10, 947, 14, 5], [10, 948, 6, 13], [10, 949, 10, 10], [10, 950, 15, 2], [10, 951, 8, 11], [10, 952, 9, 10], [10, 953, 14, 6], [10, 954, 10, 9], [10, 955, 5, 14], [10, 956, 11, 9], [10, 957, 14, 1], [10, 958, 2, 14], [10, 959, 6, 12], [10, 960, 1, 12], [10, 961, 13, 8], [10, 962, 0, 8], [10, 963, 13, 7], [10, 964, 7, 12], [10, 965, 12, 7], [10, 966, 7, 13], [10, 967, 15, 3], [10, 968, 12, 1], [10, 969, 6, 14], [10, 970, 2, 15], [10, 971, 15, 5], [10, 972, 15, 4], [10, 973, 1, 14], [10, 974, 9, 11], [10, 975, 4, 15], [10, 976, 14, 7], [10, 977, 8, 13], [10, 978, 13, 9], [10, 979, 8, 12], [10, 980, 5, 15], [10, 981, 3, 15], [10, 982, 10, 11], [10, 983, 11, 10], [10, 984, 12, 8], [10, 985, 15, 6], [10, 986, 15, 7], [10, 987, 8, 14], [10, 988, 15, 1], [10, 989, 7, 14], [10, 990, 9, 0], [10, 991, 0, 9], [10, 992, 9, 13], [10, 993, 9, 12], [10, 994, 12, 9], [10, 995, 14, 8], [10, 996, 10, 13], [10, 997, 14, 9], [10, 998, 12, 10], [10, 999, 6, 15], [10, 1e3, 7, 15], [11, 2002, 9, 14], [11, 2003, 15, 8], [11, 2004, 11, 11], [11, 2005, 11, 14], [11, 2006, 1, 15], [11, 2007, 10, 12], [11, 2008, 10, 14], [11, 2009, 13, 11], [11, 2010, 13, 10], [11, 2011, 11, 13], [11, 2012, 11, 12], [11, 2013, 8, 15], [11, 2014, 14, 11], [11, 2015, 13, 12], [11, 2016, 12, 13], [11, 2017, 15, 9], [11, 2018, 14, 10], [11, 2019, 10, 0], [11, 2020, 12, 11], [11, 2021, 9, 15], [11, 2022, 0, 10], [11, 2023, 12, 12], [11, 2024, 11, 0], [11, 2025, 12, 14], [11, 2026, 10, 15], [11, 2027, 13, 13], [11, 2028, 0, 13], [11, 2029, 14, 12], [11, 2030, 15, 10], [11, 2031, 15, 11], [11, 2032, 11, 15], [11, 2033, 14, 13], [11, 2034, 13, 0], [11, 2035, 0, 11], [11, 2036, 13, 14], [11, 2037, 15, 12], [11, 2038, 15, 13], [11, 2039, 12, 15], [11, 2040, 14, 0], [11, 2041, 14, 14], [11, 2042, 13, 15], [11, 2043, 12, 0], [11, 2044, 14, 15], [12, 4090, 0, 14], [12, 4091, 0, 12], [12, 4092, 15, 14], [12, 4093, 15, 0], [12, 4094, 0, 15], [12, 4095, 15, 15]]]
          , i = [!1, !1, !0, !0, !1, !1, !0, !0, !0, !0, !0]
          , a = {
            findOffset: function(e, t) {
                for (var r = 0, n = t[r][0], o = e.read(n); o !== t[r][1]; ) {
                    var i = t[++r][0] - n;
                    n = t[r][0],
                    o <<= i,
                    o |= e.read(i)
                }
                return r
            },
            signValues: function(e, t, r, n) {
                for (var o = r; o < r + n; o++)
                    t[o] && e.read(1) && (t[o] = -t[o])
            },
            getEscape: function(e, t) {
                for (var r = 4; e.read(1); )
                    r++;
                var n = e.read(r) | 1 << r;
                return t < 0 ? -n : n
            },
            decodeScaleFactor: function(e) {
                var t = this.findOffset(e, n);
                return n[t][2]
            },
            decodeSpectralData: function(e, t, r, n) {
                var a = o[t - 1]
                  , s = this.findOffset(e, a);
                if (r[n] = a[s][2],
                r[n + 1] = a[s][3],
                t < 5 && (r[n + 2] = a[s][4],
                r[n + 3] = a[s][5]),
                t < 11)
                    i[t - 1] && this.signValues(e, r, n, t < 5 ? 4 : 2);
                else {
                    if (!(11 === t || 15 < t))
                        throw new Error("Huffman: unknown spectral codebook: " + t);
                    this.signValues(e, r, n, t < 5 ? 4 : 2),
                    16 === Math.abs(r[n]) && (r[n] = this.getEscape(e, r[n])),
                    16 === Math.abs(r[n + 1]) && (r[n + 1] = this.getEscape(e, r[n + 1]))
                }
            }
        };
        t.default = a,
        e.exports = t.default
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = Object.assign || function(e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = arguments[t];
                for (var n in r)
                    Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n])
            }
            return e
        }
          , o = function() {
            function e(e, t) {
                for (var r = 0; r < t.length; r++) {
                    var n = t[r];
                    n.enumerable = n.enumerable || !1,
                    n.configurable = !0,
                    "value"in n && (n.writable = !0),
                    Object.defineProperty(e, n.key, n)
                }
            }
            return function(t, r, n) {
                return r && e(t.prototype, r),
                n && e(t, n),
                t
            }
        }()
          , i = c(r(3))
          , a = c(r(1))
          , s = c(r(30))
          , u = r(32);
        function c(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }
        var l = function(e) {
            function t() {
                return function(e, r) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this),
                function(e, t) {
                    if (!e)
                        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return !t || "object" != typeof t && "function" != typeof t ? e : t
                }(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this))
            }
            return function(e, t) {
                if ("function" != typeof t && null !== t)
                    throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }),
                t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }(t, i.default),
            o(t, null, [{
                key: "MIN_LENGTH",
                get: function() {
                    return 8
                }
            }, {
                key: "MIN_FULL_LENGTH",
                get: function() {
                    return 16
                }
            }]),
            o(t, [{
                key: "decode",
                value: function(e) {
                    var r = this
                      , n = 0;
                    if (e.byteLength < t.MIN_LENGTH)
                        return !1;
                    if (this.boxSize = a.default.readUInt32BE(e, 0),
                    this.boxType = a.default.readToString(e.slice(4, 8)),
                    n += 8,
                    1 === this.boxSize)
                        throw new Error("浏览器不支持uint64");
                    if (-1 < u.FULL_BOX_TYPES.indexOf(this.boxType)) {
                        if (this.version = a.default.readUInt8(e, n),
                        1 === this.version)
                            throw new Error("浏览器不支持uint64");
                        this.flags = 16777215 & a.default.readUInt32BE(e, n),
                        n += 4
                    }
                    if (this.headerLen = n,
                    this.contentLen = this.boxSize - n,
                    e = e.slice(this.headerLen),
                    u.CONTAINERS[this.boxType]) {
                        var o = e.byteLength;
                        if (this.boxs = [],
                        e.byteLength < this.contentLen)
                            return !1;
                        for (; !(o - e.byteLength >= this.contentLen); ) {
                            var i = new t;
                            i.on("data", function(e) {
                                r.emit("data", e)
                            });
                            var c = i.decode(e);
                            if (!c)
                                return e;
                            e = c,
                            this.boxs.push(i.toJSON())
                        }
                        return this.emit("data", this.toJSON()),
                        e
                    }
                    return -1 < u.BOX_TYPES.indexOf(this.boxType) ? !(e.byteLength < this.contentLen) && (this.boxData = new s.default(this.boxType,this.contentLen),
                    this.boxData.on("data", function(e) {
                        r.emit("data", e)
                    }),
                    e = this.boxData.decode(e),
                    this.emit("data", this.toJSON()),
                    e) : (this.buffer = e.slice(0, this.contentLen),
                    this.emit("data", this.toJSON()),
                    e.slice(this.contentLen))
                }
            }, {
                key: "toJSON",
                value: function() {
                    var e = {
                        length: this.boxSize,
                        headerLen: this.headerLen,
                        contentLen: this.contentLen,
                        type: this.boxType
                    };
                    if (this.boxs) {
                        for (var t = this.boxs, r = {}, o = 0; o < t.length; o++) {
                            var i = t[o]
                              , a = r[i.type];
                            Array.isArray(a) ? r.push(i) : r[i.type] = a ? [a, i] : i
                        }
                        Object.assign(e, r)
                    }
                    if (this.buffer && (e.buffer = this.buffer),
                    this.version && (e.version = this.version),
                    this.flags && (e.flags = this.flags),
                    this.boxData) {
                        var s = this.boxData.toJSON();
                        e = n({}, e, s)
                    }
                    return e
                }
            }]),
            t
        }();
        t.default = l,
        e.exports = t.default
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = function() {
            function e(e, t) {
                for (var r = 0; r < t.length; r++) {
                    var n = t[r];
                    n.enumerable = n.enumerable || !1,
                    n.configurable = !0,
                    "value"in n && (n.writable = !0),
                    Object.defineProperty(e, n.key, n)
                }
            }
            return function(t, r, n) {
                return r && e(t.prototype, r),
                n && e(t, n),
                t
            }
        }()
          , o = p(r(12))
          , i = p(r(23))
          , a = p(r(27))
          , s = p(r(36))
          , u = p(r(37))
          , c = p(r(38))
          , l = p(r(4))
          , f = p(r(39))
          , d = p(r(40))
          , h = p(r(41));
        function p(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }
        var m = function(e) {
            function t() {
                var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {};
                !function(e, r) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this);
                var r = function(e, t) {
                    if (!e)
                        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return !t || "object" != typeof t && "function" != typeof t ? e : t
                }(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
                return r._visibilityChangeHandler = function(e) {
                    document[c.default.VISIBILITY_HIDDEN] ? r.pause() : r.status.play && r.play()
                }
                ,
                r.config = {
                    url: e.url,
                    width: 0,
                    height: 0,
                    sampleRate: 0,
                    movieTimescale: 0,
                    audioTimescale: 0,
                    channelCount: 0,
                    iframeRate: 0,
                    volume: 1,
                    canvas: document.createElement("canvas"),
                    video: e.video,
                    size: e.size || "contain"
                },
                e.video && r._proxyVideoElment(e.video),
                r.status = {
                    play: !1,
                    canplay: !1,
                    playing: !1,
                    audioSuspended: !1
                },
                r.mediaInfo = null,
                r._actionCache = [],
                r.loader = new d.default,
                r.demuxer = new a.default,
                r.videoDecoder = new i.default,
                r.audioDecoder = new o.default,
                r.videoDevice = new h.default(e.video),
                r.audioDevice = new u.default,
                r.fbSpeedSampler = new f.default,
                r._bindDeviceEvent(),
                r._bindDecoderEvent(),
                r._bindDemuxerEvent(),
                r._bindLoaderEvent(),
                r._bindPlayerEvent(),
                r.audioDevice.init(),
                r.updateIframeId = null,
                r.timeUpdateId = null,
                r._updateIframe = r._updateIframe.bind(r),
                r._updateTime = r._updateTime.bind(r),
                r
            }
            return function(e, t) {
                if ("function" != typeof t && null !== t)
                    throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }),
                t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }(t, l.default),
            n(t, [{
                key: "play",
                value: function() {
                    this.status.play || (this.status.audioSuspended ? this.status.audioSuspended = !1 : (this.loader.open(this.config.url),
                    this.status.play = !0,
                    this.updateIframeId = requestAnimationFrame(this._updateIframe),
                    this.timeUpdateId = setTimeout(this._updateTime, 1e3),
                    this.emit("play")))
                }
            }, {
                key: "pause",
                value: function() {
                    this.status.play && (cancelAnimationFrame(this.updateIframeId),
                    clearTimeout(this.timeUpdateId),
                    this.status.play = !1,
                    this.status.playing = !1,
                    this.audioDevice.reset(),
                    this.videoDevice.reset(),
                    this.loader.pause(),
                    this.audioDecoder.reset(),
                    this.videoDecoder.reset(),
                    this.fbSpeedSampler.reset())
                }
            }, {
                key: "destroy",
                value: function() {
                    this.pause(),
                    this._unBindPlayerEvent(),
                    this.videoDecoder.destroy(),
                    this.audioDevice.destroy(),
                    this.videoDevice.destroy(),
                    this.videoDecoder.destroy()
                }
            }, {
                key: "_bindPlayerEvent",
                value: function() {
                    document.addEventListener(c.default.VISIBILITY_CHANGE, this._visibilityChangeHandler, !1)
                }
            }, {
                key: "_unBindPlayerEvent",
                value: function() {
                    document.removeEventListener(c.default.VISIBILITY_CHANGE, this._visibilityChangeHandler, !1)
                }
            }, {
                key: "_bindLoaderEvent",
                value: function() {
                    var e = this;
                    this.loader.on("dataArrival", function(t) {
                        e.fbSpeedSampler.addBytes(t.chunk.byteLength),
                        e.videoDecoder.appendBuffer(t.chunk),
                        e.demuxer.decode(t.chunk)
                    })
                }
            }, {
                key: "_bindDemuxerEvent",
                value: function() {
                    var e = this;
                    this.demuxer.on("mediaInfo", function(t) {
                        s.default.v(t),
                        e.mediaInfo = t,
                        e.config.channelCount = t.audioTrack.audio.channelCount,
                        e.config.sampleRate = t.audioTrack.audio.sampleRate,
                        e.config.audioTimescale = t.audioTrack.timeScale,
                        e.config.width = t.videoTrack.trackWidth,
                        e.config.height = t.videoTrack.trackHeight,
                        e.videoDevice.setOptions(e.config),
                        e.audioDevice.setOptions(e.config),
                        e.status.canplay = !0,
                        e.emit("canplay"),
                        e._excuteCacheActions(),
                        e.emit("loadedmetadata", t)
                    }),
                    this.demuxer.on("box:esds", function(t) {
                        e.audioDecoder.setCookie(t.dsi.buffer)
                    }),
                    this.demuxer.on("audio:sample", function(t) {
                        e.audioDecoder.appendBuffer(t.data, t.dts / e.config.audioTimescale, t.number)
                    })
                }
            }, {
                key: "_bindDecoderEvent",
                value: function() {
                    var e = this;
                    this.audioDecoder.on("data", function(t) {
                        e.audioDevice.play(t)
                    }),
                    this.videoDecoder.on("data", function(t) {
                        e.status.playing || (e.status.playing = !0,
                        e.emit("playing")),
                        e.videoDevice.render(t.data)
                    }),
                    this.videoDecoder.on("waiting", function() {
                        e.status.playing && (e.status.playing = !1,
                        e.emit("waiting"))
                    }),
                    this.videoDecoder.on("statistics", function(t) {
                        t.averageKBps = e.fbSpeedSampler.averageKBps,
                        t.lastSecondKBps = e.fbSpeedSampler.lastSecondKBps,
                        t.totalBytes = e.fbSpeedSampler.totalBytes,
                        e.emit("statistics", t)
                    }),
                    this.videoDecoder.on("innerError", function(t) {
                        e.emit("innerError", t)
                    }),
                    this.videoDecoder.on("error", function(t) {
                        e.emit("error", t)
                    })
                }
            }, {
                key: "_bindDeviceEvent",
                value: function() {
                    var e = this;
                    this.audioDevice.on("suspendChange", function(t) {
                        e.status.audioSuspended = t
                    })
                }
            }, {
                key: "_updateIframe",
                value: function() {
                    if (this.updateIframeId = requestAnimationFrame(this._updateIframe),
                    this.mediaInfo && this.getAudioCurrentTime() >= this.mediaInfo.duration / this.mediaInfo.timescale)
                        this.pause();
                    else {
                        this.audioDecoder.canPlay && this.videoDecoder.canPlay && this.status.canplay && this.audioDevice.enqueuedTime < .25 && this.audioDecoder.decode();
                        var e = this.getAudioCurrentTime();
                        this.getVideoCurrentTime() < e && this.videoDecoder.canPlay && this.status.canplay && this.videoDecoder.getImageData(e)
                    }
                }
            }, {
                key: "_updateTime",
                value: function() {
                    this.emit("timeupdate", this.getAudioCurrentTime()),
                    this.timeUpdateId = setTimeout(this._updateTime, 1e3)
                }
            }, {
                key: "_proxyVideoElment",
                value: function(e) {
                    var t = this;
                    e.volume && (this.config.volume = e.volume),
                    e.muted && (this.config.volume = 0);
                    var r = this.emit;
                    this.emit = function() {
                        for (var n = arguments.length, o = Array(n), i = 0; i < n; i++)
                            o[i] = arguments[i];
                        if (r.apply(t, o),
                        document.createEvent) {
                            var a = document.createEvent("Events");
                            a.initEvent(o[0], !0, !1),
                            e.dispatchEvent(a)
                        } else
                            e.fireEvent(o[0])
                    }
                    ,
                    Object.defineProperties(e, {
                        play: {
                            value: function() {
                                t.play()
                            },
                            configurable: !0
                        },
                        pause: {
                            value: function() {
                                t.pause()
                            },
                            configurable: !0
                        },
                        currentTime: {
                            get: function() {
                                return t.getAudioCurrentTime()
                            },
                            configurable: !0
                        },
                        videoHeight: {
                            get: function() {
                                return t.getAudioCurrentTime()
                            },
                            configurable: !0
                        },
                        videoWidth: {
                            get: function() {
                                return t.config.videoWidth
                            },
                            configurable: !0
                        },
                        volume: {
                            set: function(e) {
                                t.config.volume = e,
                                t.emit("volumechange", e)
                            },
                            get: function() {
                                return t.config.volume
                            },
                            configurable: !0
                        },
                        muted: {
                            set: function(e) {
                                t.config.volume = e ? 0 : 1,
                                t.emit("volumechange", t.config.volume)
                            },
                            configurable: !0
                        }
                    }),
                    this._proxyVideoStyleElment(e, ["position", "left", "top", "height", "width"])
                }
            }, {
                key: "_proxyVideoStyleElment",
                value: function(e, t) {
                    var r = this;
                    t.forEach(function(t) {
                        Object.defineProperty(e.style, t, {
                            set: function(e) {
                                r.config.canvas.style[t] = e
                            }
                        })
                    })
                }
            }, {
                key: "_cacheAction",
                value: function(e) {
                    this._actionCache.push(e)
                }
            }, {
                key: "_excuteCacheActions",
                value: function() {
                    var e = this;
                    this._actionCache.forEach(function(t) {
                        e[t.cmd].apply(e, function(e) {
                            if (Array.isArray(e)) {
                                for (var t = 0, r = Array(e.length); t < e.length; t++)
                                    r[t] = e[t];
                                return r
                            }
                            return Array.from(e)
                        }(t.param))
                    })
                }
            }, {
                key: "getAudioCurrentTime",
                value: function() {
                    return this.audioDecoder.decodedTime - this.audioDevice.enqueuedTime
                }
            }, {
                key: "getVideoCurrentTime",
                value: function() {
                    return this.videoDecoder.currentTime
                }
            }]),
            t
        }();
        t.default = m,
        e.exports = t.default
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = function() {
            function e(e, t) {
                for (var r = 0; r < t.length; r++) {
                    var n = t[r];
                    n.enumerable = n.enumerable || !1,
                    n.configurable = !0,
                    "value"in n && (n.writable = !0),
                    Object.defineProperty(e, n.key, n)
                }
            }
            return function(t, r, n) {
                return r && e(t.prototype, r),
                n && e(t, n),
                t
            }
        }()
          , o = m(r(5))
          , i = m(r(6))
          , a = m(r(7))
          , s = m(r(13))
          , u = m(r(8))
          , c = m(r(15))
          , l = m(r(0))
          , f = m(r(17))
          , d = m(r(18))
          , h = m(r(19))
          , p = function(e) {
            if (e && e.__esModule)
                return e;
            var t = {};
            if (null != e)
                for (var r in e)
                    Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]);
            return t.default = e,
            t
        }(r(2));
        function m(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }
        var v = function(e) {
            function t() {
                !function(e, r) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this);
                var e = function(e, t) {
                    if (!e)
                        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return !t || "object" != typeof t && "function" != typeof t ? e : t
                }(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
                e.format = {
                    floatingPoint: !0
                };
                var r = e.list = new i.default;
                return e.stream = new s.default(r),
                e.bitstream = new u.default(e.stream),
                e.receivedFinalBuffer = !1,
                e.canPlay = !1,
                e.timestamps = [],
                e.timestampIndex = 0,
                e.decodedTime = 0,
                e
            }
            return function(e, t) {
                if ("function" != typeof t && null !== t)
                    throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }),
                t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }(t, o.default),
            n(t, [{
                key: "appendBuffer",
                value: function(e, t, r) {
                    this.list.append(new a.default(e)),
                    0 === this.timestamps.length && (this.decodedTime = t || 0),
                    this.timestamps.push({
                        number: r,
                        time: t
                    }),
                    this.canPlay = !0
                }
            }, {
                key: "decode",
                value: function() {
                    var e = void 0
                      , t = this.bitstream.offset();
                    try {
                        e = this.readChunk()
                    } catch (e) {
                        return !1
                    }
                    return e ? (this.emit("data", e),
                    this.advanceDecodedTime(e.length / this.config.chanConfig / this.config.sampleRate),
                    !0) : (this.receivedFinalBuffer ? this.emit("end") : this.bitstream.seek(t),
                    !1)
                }
            }, {
                key: "setCookie",
                value: function(e) {
                    var t = s.default.fromBuffer(e)
                      , r = new u.default(t);
                    if (this.config = {},
                    this.config.profile = r.read(5),
                    31 === this.config.profile && (this.config.profile = 32 + r.read(6)),
                    this.config.sampleIndex = r.read(4),
                    15 === this.config.sampleIndex) {
                        this.config.sampleRate = r.read(24);
                        for (var n = 0; n < p.SAMPLE_RATES.length; n++)
                            if (p.SAMPLE_RATES[n] === this.config.sampleRate) {
                                this.config.sampleIndex = n;
                                break
                            }
                    } else
                        this.config.sampleRate = p.SAMPLE_RATES[this.config.sampleIndex];
                    switch (this.config.chanConfig = r.read(4),
                    this.format.channelsPerFrame = this.config.chanConfig,
                    this.config.profile) {
                    case 1:
                    case 2:
                    case 4:
                        if (r.read(1))
                            throw new Error("frameLengthFlag not supported");
                        if (this.config.frameLength = 1024,
                        r.read(1) && r.advance(14),
                        r.read(1) && (16 < this.config.profile && (this.config.sectionDataResilience = r.read(1),
                        this.config.scalefactorResilience = r.read(1),
                        this.config.spectralDataResilience = r.read(1)),
                        r.advance(1)),
                        0 === this.config.chanConfig)
                            throw r.advance(4),
                            new Error("PCE unimplemented");
                        break;
                    default:
                        throw new Error("AAC profile " + this.config.profile + " not supported.")
                    }
                    this.filter_bank = new h.default(!1,this.config.chanConfig)
                }
            }, {
                key: "reset",
                value: function() {
                    this.format = {
                        floatingPoint: !0
                    };
                    var e = this.list = new i.default;
                    this.stream = new s.default(e),
                    this.bitstream = new u.default(this.stream),
                    this.receivedFinalBuffer = !1,
                    this.canPlay = !1,
                    this.timestamps = [],
                    this.timestampIndex = 0,
                    this.decodedTime = 0
                }
            }, {
                key: "readChunk",
                value: function() {
                    var e = this.bitstream;
                    4095 === e.peek(12) && c.default.readHeader(e),
                    this.cces = [];
                    for (var t = [], r = this.config, n = r.frameLength, o = null; 7 !== (o = e.read(3)); ) {
                        var i = e.read(4);
                        switch (o) {
                        case 0:
                        case 3:
                            var a = new l.default(this.config);
                            a.id = i,
                            t.push(a),
                            a.decode(e, r, !1);
                            break;
                        case 1:
                            var s = new f.default(this.config);
                            s.id = i,
                            t.push(s),
                            s.decode(e, r);
                            break;
                        case 2:
                            var u = new d.default(this.config);
                            this.cces.push(u),
                            u.decode(e, r);
                            break;
                        case 4:
                            var h = e.read(1)
                              , p = e.read(8);
                            255 === p && (p += e.read(8)),
                            h && e.align(),
                            e.advance(8 * p);
                            break;
                        case 5:
                            throw new Error("TODO: PCE_ELEMENT");
                        case 6:
                            15 === i && (i += e.read(8) - 1),
                            e.advance(8 * i);
                            break;
                        default:
                            throw new Error("Unknown element")
                        }
                    }
                    e.align(),
                    this.process(t);
                    for (var m = this.data, v = m.length, y = new Float32Array(n * v), g = 0, w = 0; w < n; w++)
                        for (var E = 0; E < v; E++)
                            y[g++] = m[E][w] / 32768;
                    return y
                }
            }, {
                key: "process",
                value: function(e) {
                    for (var t = this.config.chanConfig, r = 1 * this.config.frameLength, n = this.data = [], o = 0; o < t; o++)
                        n[o] = new Float32Array(r);
                    for (var i = 0, a = 0; a < e.length && i < t; a++) {
                        var s = e[a];
                        if (s instanceof l.default)
                            i += this.processSingle(s, i);
                        else if (s instanceof f.default)
                            this.processPair(s, i),
                            i += 2;
                        else {
                            if (!(s instanceof d.default))
                                throw new Error("Unknown element found.");
                            i++
                        }
                    }
                }
            }, {
                key: "processSingle",
                value: function(e, t) {
                    var r = this.config.profile
                      , n = e.info
                      , o = e.data;
                    if (1 === r)
                        throw new Error("Main prediction unimplemented");
                    if (4 === r)
                        throw new Error("LTP prediction unimplemented");
                    if (this.applyChannelCoupling(e, d.default.BEFORE_TNS, o, null),
                    e.tnsPresent && e.tns.process(e, o, !1),
                    this.applyChannelCoupling(e, d.default.AFTER_TNS, o, null),
                    this.filter_bank.process(n, o, this.data[t], t),
                    4 === r)
                        throw new Error("LTP prediction unimplemented");
                    if (this.applyChannelCoupling(e, d.default.AFTER_IMDCT, this.data[t], null),
                    e.gainPresent)
                        throw new Error("Gain control not implemented");
                    if (this.sbrPresent)
                        throw new Error("SBR not implemented");
                    return 1
                }
            }, {
                key: "processPair",
                value: function(e, t) {
                    var r = this.config.profile
                      , n = e.left
                      , o = e.right
                      , i = n.info
                      , a = o.info
                      , s = n.data
                      , u = o.data;
                    if (e.commonWindow && e.maskPresent && this.processMS(e, s, u),
                    1 === r)
                        throw new Error("Main prediction unimplemented");
                    if (this.processIS(e, s, u),
                    4 === r)
                        throw new Error("LTP prediction unimplemented");
                    if (this.applyChannelCoupling(e, d.default.BEFORE_TNS, s, u),
                    n.tnsPresent && n.tns.process(n, s, !1),
                    o.tnsPresent && o.tns.process(o, u, !1),
                    this.applyChannelCoupling(e, d.default.AFTER_TNS, s, u),
                    this.filter_bank.process(i, s, this.data[t], t),
                    this.filter_bank.process(a, u, this.data[t + 1], t + 1),
                    4 === r)
                        throw new Error("LTP prediction unimplemented");
                    if (this.applyChannelCoupling(e, d.default.AFTER_IMDCT, this.data[t], this.data[t + 1]),
                    n.gainPresent)
                        throw new Error("Gain control not implemented");
                    if (o.gainPresent)
                        throw new Error("Gain control not implemented");
                    if (this.sbrPresent)
                        throw new Error("SBR not implemented")
                }
            }, {
                key: "processIS",
                value: function(e, t, r) {
                    for (var n = e.right, o = n.info, i = o.swbOffsets, a = o.groupCount, s = o.maxSFB, u = n.bandTypes, c = n.sectEnd, f = n.scaleFactors, d = 0, h = 0, p = 0; p < a; p++) {
                        for (var m = 0; m < s; ) {
                            var v = c[d];
                            if (u[d] === l.default.INTENSITY_BT || u[d] === l.default.INTENSITY_BT2)
                                for (; m < v; m++,
                                d++) {
                                    var y = u[d] === l.default.INTENSITY_BT ? 1 : -1;
                                    e.maskPresent && (y *= e.ms_used[d] ? -1 : 1);
                                    for (var g = y * f[d], w = 0; w < o.groupLength[p]; w++)
                                        for (var E = h + 128 * w + i[m], _ = i[m + 1] - i[m], b = 0; b < _; b++)
                                            r[E + b] = t[E + b] * g
                                }
                            else
                                d += v - m,
                                m = v
                        }
                        h += 128 * o.groupLength[p]
                    }
                }
            }, {
                key: "processMS",
                value: function(e, t, r) {
                    for (var n = e.left, o = n.info, i = o.swbOffsets, a = o.groupCount, s = o.maxSFB, u = n.bandTypes, c = e.right.bandTypes, f = 0, d = 0, h = 0; h < a; h++) {
                        for (var p = 0; p < s; p++,
                        d++)
                            if (e.ms_used[d] && u[d] < l.default.NOISE_BT && c[d] < l.default.NOISE_BT)
                                for (var m = 0; m < o.groupLength[h]; m++)
                                    for (var v = f + 128 * m + i[p], y = 0; y < i[p + 1] - i[p]; y++) {
                                        var g = t[v + y] - r[v + y];
                                        t[v + y] += r[v + y],
                                        r[v + y] = g
                                    }
                        f += 128 * o.groupLength[h]
                    }
                }
            }, {
                key: "applyChannelCoupling",
                value: function(e, t, r, n) {
                    for (var o = this.cces, i = e instanceof f.default, a = t === d.default.AFTER_IMDCT ? "applyIndependentCoupling" : "applyDependentCoupling", s = 0; s < o.length; s++) {
                        var u = o[s]
                          , c = 0;
                        if (u.couplingPoint === t)
                            for (var l = 0; l < u.coupledCount; l++) {
                                var h = u.chSelect[l];
                                u.channelPair[l] === i && u.idSelect[l] === e.id ? (1 !== h && (u[a](c, r),
                                h && c++),
                                2 !== h && u[a](c++, n)) : c += 1 + (3 === h ? 1 : 0)
                            }
                    }
                }
            }, {
                key: "advanceDecodedTime",
                value: function(e) {
                    this.decodedTime = this.timestamps[this.timestampIndex].time,
                    this.timestampIndex++,
                    this.decodedTime += e
                }
            }]),
            t
        }();
        t.default = v,
        e.exports = t.default
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }),
        t.default = void 0;
        var n = function() {
            function e(e, t) {
                for (var r = 0; r < t.length; r++) {
                    var n = t[r];
                    n.enumerable = n.enumerable || !1,
                    n.configurable = !0,
                    "value"in n && (n.writable = !0),
                    Object.defineProperty(e, n.key, n)
                }
            }
            return function(t, r, n) {
                return r && e(t.prototype, r),
                n && e(t, n),
                t
            }
        }()
          , o = s(r(7))
          , i = s(r(6))
          , a = s(r(14));
        function s(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }
        var u = function() {
            function e(t) {
                !function(t, r) {
                    if (!(t instanceof e))
                        throw new TypeError("Cannot call a class as a function")
                }(this),
                this.buf = new ArrayBuffer(16),
                this.uint8 = new Uint8Array(this.buf),
                this.int8 = new Int8Array(this.buf),
                this.uint16 = new Uint16Array(this.buf),
                this.int16 = new Int16Array(this.buf),
                this.uint32 = new Uint32Array(this.buf),
                this.int32 = new Int32Array(this.buf),
                this.float32 = new Float32Array(this.buf),
                this.float64 = new Float64Array(this.buf),
                this.nativeEndian = 13330 === new Uint16Array(new Uint8Array([18, 52]).buffer)[0],
                this.list = t,
                this.localOffset = 0,
                this.offset = 0
            }
            return n(e, [{
                key: "copy",
                value: function() {
                    var t = new e(this.list.copy());
                    return t.localOffset = this.localOffset,
                    t.offset = this.offset,
                    t
                }
            }, {
                key: "available",
                value: function(e) {
                    return e <= this.list.availableBytes - this.localOffset
                }
            }, {
                key: "remainingBytes",
                value: function() {
                    return this.list.availableBytes - this.localOffset
                }
            }, {
                key: "advance",
                value: function(e) {
                    if (!this.available(e))
                        throw new a.default;
                    for (this.localOffset += e,
                    this.offset += e; this.list.first && this.localOffset >= this.list.first.length; )
                        this.localOffset -= this.list.first.length,
                        this.list.advance();
                    return this
                }
            }, {
                key: "rewind",
                value: function(e) {
                    if (e > this.offset)
                        throw new a.default;
                    for (this.list.first || (this.list.rewind(),
                    this.localOffset = this.list.first.length),
                    this.localOffset -= e,
                    this.offset -= e; this.list.first.prev && this.localOffset < 0; )
                        this.list.rewind(),
                        this.localOffset += this.list.first.length;
                    return this
                }
            }, {
                key: "seek",
                value: function(e) {
                    var t = this;
                    return e > this.offset ? t = this.advance(e - this.offset) : e < this.offset && (t = this.rewind(this.offset - e)),
                    t
                }
            }, {
                key: "readUInt8",
                value: function() {
                    if (!this.available(1))
                        throw new a.default;
                    var e = this.list.first.data[this.localOffset];
                    return this.localOffset += 1,
                    this.offset += 1,
                    this.localOffset === this.list.first.length && (this.localOffset = 0,
                    this.list.advance()),
                    e
                }
            }, {
                key: "peekUInt8",
                value: function() {
                    var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0;
                    if (!this.available(e + 1))
                        throw new a.default;
                    e = this.localOffset + e;
                    for (var t = this.list.first; t; ) {
                        if (t.length > e)
                            return t.data[e];
                        e -= t.length,
                        t = t.next
                    }
                    return 0
                }
            }, {
                key: "read",
                value: function(e) {
                    if ((1 < arguments.length && void 0 !== arguments[1] && arguments[1]) === this.nativeEndian)
                        for (var t = 0; t < e; t++)
                            this.uint8[t] = this.readUInt8();
                    else
                        for (var r = e - 1; 0 <= r; r--)
                            this.uint8[r] = this.readUInt8()
                }
            }, {
                key: "peek",
                value: function(e, t, r) {
                    if (null == r && (r = !1),
                    r === this.nativeEndian)
                        for (var n = 0; n < e; n++)
                            this.uint8[n] = this.peekUInt8(t + n);
                    else
                        for (var o = 0; o < e; o++)
                            this.uint8[e - o - 1] = this.peekUInt8(t + o)
                }
            }, {
                key: "readInt8",
                value: function() {
                    return this.read(1),
                    this.int8[0]
                }
            }, {
                key: "peekInt8",
                value: function() {
                    var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0;
                    return this.peek(1, e),
                    this.int8[0]
                }
            }, {
                key: "readUInt16",
                value: function(e) {
                    return this.read(2, e),
                    this.uint16[0]
                }
            }, {
                key: "peekUInt16",
                value: function() {
                    var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0
                      , t = arguments[1];
                    return this.peek(2, e, t),
                    this.uint16[0]
                }
            }, {
                key: "readInt16",
                value: function(e) {
                    return this.read(2, e),
                    this.int16[0]
                }
            }, {
                key: "peekInt16",
                value: function() {
                    var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0
                      , t = arguments[1];
                    return this.peek(2, e, t),
                    this.int16[0]
                }
            }, {
                key: "readUInt24",
                value: function(e) {
                    return e ? this.readUInt16(!0) + (this.readUInt8() << 16) : (this.readUInt16() << 8) + this.readUInt8()
                }
            }, {
                key: "peekUInt24",
                value: function() {
                    var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0;
                    return arguments[1] ? this.peekUInt16(e, !0) + (this.peekUInt8(e + 2) << 16) : (this.peekUInt16(e) << 8) + this.peekUInt8(e + 2)
                }
            }, {
                key: "readInt24",
                value: function(e) {
                    return e ? this.readUInt16(!0) + (this.readInt8() << 16) : (this.readInt16() << 8) + this.readUInt8()
                }
            }, {
                key: "peekInt24",
                value: function() {
                    var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0;
                    return arguments[1] ? this.peekUInt16(e, !0) + (this.peekInt8(e + 2) << 16) : (this.peekInt16(e) << 8) + this.peekUInt8(e + 2)
                }
            }, {
                key: "readUInt32",
                value: function(e) {
                    return this.read(4, e),
                    this.uint32[0]
                }
            }, {
                key: "peekUInt32",
                value: function() {
                    var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0
                      , t = arguments[1];
                    return this.peek(4, e, t),
                    this.uint32[0]
                }
            }, {
                key: "readInt32",
                value: function(e) {
                    return this.read(4, e),
                    this.int32[0]
                }
            }, {
                key: "peekInt32",
                value: function() {
                    var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0
                      , t = arguments[1];
                    return this.peek(4, e, t),
                    this.int32[0]
                }
            }, {
                key: "readFloat32",
                value: function(e) {
                    return this.read(4, e),
                    this.float32[0]
                }
            }, {
                key: "peekFloat32",
                value: function() {
                    var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0
                      , t = arguments[1];
                    return this.peek(4, e, t),
                    this.float32[0]
                }
            }, {
                key: "readFloat64",
                value: function(e) {
                    return this.read(8, e),
                    this.float64[0]
                }
            }, {
                key: "peekFloat64",
                value: function() {
                    var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0
                      , t = arguments[1];
                    return this.peek(8, e, t),
                    this.float64[0]
                }
            }, {
                key: "readFloat80",
                value: function(e) {
                    return this.read(10, e),
                    this.float80()
                }
            }, {
                key: "peekFloat80",
                value: function() {
                    var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0
                      , t = arguments[1];
                    return this.peek(10, e, t),
                    this.float80()
                }
            }, {
                key: "readBuffer",
                value: function(e) {
                    for (var t = o.default.allocate(e), r = t.data, n = 0; n < e; n++)
                        r[n] = this.readUInt8();
                    return t
                }
            }, {
                key: "peekBuffer",
                value: function() {
                    for (var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0, t = arguments[1], r = o.default.allocate(t), n = r.data, i = 0; i < t; i++)
                        n[i] = this.peekUInt8(e + i);
                    return r
                }
            }, {
                key: "readSingleBuffer",
                value: function(e) {
                    var t = this.list.first.slice(this.localOffset, e);
                    return this.advance(t.length),
                    t
                }
            }, {
                key: "peekSingleBuffer",
                value: function(e, t) {
                    return this.list.first.slice(this.localOffset + e, t)
                }
            }, {
                key: "readString",
                value: function(e) {
                    var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "ascii";
                    return this.decodeString(0, e, t, !0)
                }
            }, {
                key: "peekString",
                value: function() {
                    var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0
                      , t = arguments[1]
                      , r = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : "ascii";
                    return this.decodeString(e, t, r, !1)
                }
            }, {
                key: "float80",
                value: function() {
                    var e = function(e, t) {
                        if (Array.isArray(e))
                            return e;
                        if (Symbol.iterator in Object(e))
                            return function(e, t) {
                                var r = []
                                  , n = !0
                                  , o = !1
                                  , i = void 0;
                                try {
                                    for (var a, s = e[Symbol.iterator](); !(n = (a = s.next()).done) && (r.push(a.value),
                                    !t || r.length !== t); n = !0)
                                        ;
                                } catch (e) {
                                    o = !0,
                                    i = e
                                } finally {
                                    try {
                                        !n && s.return && s.return()
                                    } finally {
                                        if (o)
                                            throw i
                                    }
                                }
                                return r
                            }(e, t);
                        throw new TypeError("Invalid attempt to destructure non-iterable instance")
                    }(Array.from(this.uint32), 2)
                      , t = e[0]
                      , r = e[1]
                      , n = this.uint8[9]
                      , o = 1 - 2 * (n >>> 7)
                      , i = (127 & n) << 8 | this.uint8[8];
                    return 0 === i && 0 === r && 0 === t ? 0 : 32767 === i ? 0 === r && 0 === t ? o * (1 / 0) : NaN : (i -= 16383,
                    o * (r * Math.pow(2, i - 31) + t * Math.pow(2, i - 63)))
                }
            }, {
                key: "decodeString",
                value: function(e, t, r, n) {
                    var o = null === t ? 0 : -1;
                    null == t && (t = 1 / 0);
                    var i = e + t
                      , a = "";
                    switch (r = r.toLowerCase()) {
                    case "ascii":
                    case "latin1":
                        for (var s = void 0; e < i && (s = this.peekUInt8(e++)) !== o; )
                            a += String.fromCharCode(s);
                        break;
                    case "utf8":
                    case "utf-8":
                        for (var u = void 0; e < i && (u = this.peekUInt8(e++)) !== o; ) {
                            var c = void 0
                              , l = void 0;
                            if (0 == (128 & u))
                                a += String.fromCharCode(u);
                            else if (192 == (224 & u))
                                c = 63 & this.peekUInt8(e++),
                                a += String.fromCharCode((31 & u) << 6 | c);
                            else if (224 == (240 & u))
                                c = 63 & this.peekUInt8(e++),
                                l = 63 & this.peekUInt8(e++),
                                a += String.fromCharCode((15 & u) << 12 | c << 6 | l);
                            else if (240 == (248 & u)) {
                                var f = ((15 & u) << 18 | (c = 63 & this.peekUInt8(e++)) << 12 | (l = 63 & this.peekUInt8(e++)) << 6 | 63 & this.peekUInt8(e++)) - 65536;
                                a += String.fromCharCode(55296 + (f >> 10), 56320 + (1023 & f))
                            }
                        }
                        break;
                    case "utf16-be":
                    case "utf16be":
                    case "utf16le":
                    case "utf16-le":
                    case "utf16bom":
                    case "utf16-bom":
                        var d = void 0
                          , h = void 0;
                        switch (r) {
                        case "utf16be":
                        case "utf16-be":
                            h = !1;
                            break;
                        case "utf16le":
                        case "utf16-le":
                            h = !0;
                            break;
                        case "utf16bom":
                        case "utf16-bom":
                        default:
                            if (t < 2 || (d = this.peekUInt16(e)) === o)
                                return n && this.advance(e += 2),
                                a;
                            h = 65534 === d,
                            e += 2
                        }
                        for (var p = void 0; e < i && (p = this.peekUInt16(e, h)) !== o; )
                            if (e += 2,
                            p < 55296 || 57343 < p)
                                a += String.fromCharCode(p);
                            else {
                                var m = this.peekUInt16(e, h);
                                if (m < 56320 || 57343 < m)
                                    throw new Error("Invalid utf16 sequence.");
                                a += String.fromCharCode(p, m),
                                e += 2
                            }
                        p === o && (e += 2);
                        break;
                    default:
                        throw new Error("Unknown encoding: " + r)
                    }
                    return n && this.advance(e),
                    a
                }
            }], [{
                key: "fromBuffer",
                value: function(t) {
                    t = new o.default(t);
                    var r = new i.default;
                    return r.append(t),
                    new e(r)
                }
            }]),
            e
        }();
        t.default = u,
        e.exports = t.default
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = function(e) {
            function t(e) {
                !function(e, r) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this);
                var r = function(e, t) {
                    if (!e)
                        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return !t || "object" != typeof t && "function" != typeof t ? e : t
                }(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                return r.name = "UnderflowError",
                r.stack = new Error(e).stack,
                "function" == typeof Error.captureStackTrace && Error.captureStackTrace(r, r.constructor),
                r
            }
            return function(e, t) {
                if ("function" != typeof t && null !== t)
                    throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }),
                t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }(t, Error),
            t
        }();
        t.default = n,
        e.exports = t.default
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = function() {
            function e(e, t) {
                for (var r = 0; r < t.length; r++) {
                    var n = t[r];
                    n.enumerable = n.enumerable || !1,
                    n.configurable = !0,
                    "value"in n && (n.writable = !0),
                    Object.defineProperty(e, n.key, n)
                }
            }
            return function(t, r, n) {
                return r && e(t.prototype, r),
                n && e(t, n),
                t
            }
        }()
          , o = s(r(5))
          , i = s(r(8))
          , a = function(e) {
            if (e && e.__esModule)
                return e;
            var t = {};
            if (null != e)
                for (var r in e)
                    Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]);
            return t.default = e,
            t
        }(r(2));
        function s(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }
        var u = function(e) {
            function t() {
                return function(e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, t),
                function(e, t) {
                    if (!e)
                        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return !t || "object" != typeof t && "function" != typeof t ? e : t
                }(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
            }
            return function(e, t) {
                if ("function" != typeof t && null !== t)
                    throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }),
                t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }(t, o.default),
            n(t, [{
                key: "probe",
                value: function(e) {
                    for (var t = e.offset; e.available(2); )
                        if (65520 == (65526 & e.readUInt16()))
                            return e.seek(t),
                            !0;
                    return e.seek(t),
                    !1
                }
            }, {
                key: "init",
                value: function() {
                    this.bitstream = new i.default(this.stream)
                }
            }, {
                key: "readChunk",
                value: function() {
                    if (!this.sentHeader) {
                        var e = this.stream.offset
                          , t = this.readHeader(this.bitstream);
                        this.emit("format", {
                            formatID: "aac ",
                            sampleRate: a.SAMPLE_RATES[t.samplingIndex],
                            channelsPerFrame: t.chanConfig,
                            bitsPerChannel: 16
                        }),
                        this.stream.seek(e),
                        this.sentHeader = !0
                    }
                    for (; this.stream.available(1); ) {
                        var r = this.stream.readSingleBuffer(this.stream.remainingBytes());
                        this.emit("data", r)
                    }
                }
            }], [{
                key: "readHeader",
                value: function(e) {
                    if (4095 !== e.read(12))
                        throw new Error("Invalid ADTS header.");
                    var t = {};
                    e.advance(3);
                    var r = !!e.read(1);
                    return t.profile = e.read(2) + 1,
                    t.samplingIndex = e.read(4),
                    e.advance(1),
                    t.chanConfig = e.read(3),
                    e.advance(4),
                    t.frameLength = e.read(13),
                    e.advance(11),
                    t.numFrames = e.read(2) + 1,
                    r || e.advance(16),
                    t
                }
            }]),
            t
        }();
        t.default = u,
        e.exports = t.default
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = function() {
            function e(e, t) {
                for (var r = 0; r < t.length; r++) {
                    var n = t[r];
                    n.enumerable = n.enumerable || !1,
                    n.configurable = !0,
                    "value"in n && (n.writable = !0),
                    Object.defineProperty(e, n.key, n)
                }
            }
            return function(t, r, n) {
                return r && e(t.prototype, r),
                n && e(t, n),
                t
            }
        }()
          , o = [1, 4, 3]
          , i = [2, 6, 5]
          , a = [[0, -.43388373, -.7818315, -.9749279, .98480773, .86602539, .64278758, .34202015], [0, -.2079117, -.40673664, -.58778524, -.74314481, -.86602539, -.95105654, -.99452192, .99573416, .96182561, .8951633, .7980172, .67369562, .52643216, .36124167, .18374951], [0, -.43388373, .64278758, .34202015], [0, -.2079117, -.40673664, -.58778524, .67369562, .52643216, .36124167, .18374951]]
          , s = [31, 31, 34, 40, 42, 51, 46, 46, 42, 42, 42, 39, 39]
          , u = function() {
            function e(t) {
                !function(t, r) {
                    if (!(t instanceof e))
                        throw new TypeError("Cannot call a class as a function")
                }(this),
                this.maxBands = s[t.sampleIndex],
                this.nFilt = new Int32Array(8),
                this.length = new Array(8),
                this.direction = new Array(8),
                this.order = new Array(8),
                this.coef = new Array(8);
                for (var r = 0; r < 8; r++) {
                    this.length[r] = new Int32Array(4),
                    this.direction[r] = new Array(4),
                    this.order[r] = new Int32Array(4),
                    this.coef[r] = new Array(4);
                    for (var n = 0; n < 4; n++)
                        this.coef[r][n] = new Float32Array(20)
                }
                this.lpc = new Float32Array(20),
                this.tmp = new Float32Array(20)
            }
            return n(e, [{
                key: "decode",
                value: function(e, t) {
                    for (var r = t.windowCount, n = 2 === t.windowSequence ? o : i, s = 0; s < r; s++)
                        if (this.nFilt[s] = e.read(n[0]))
                            for (var u = e.read(1), c = this.nFilt[s], l = this.length[s], f = this.order[s], d = this.direction[s], h = this.coef[s], p = 0; p < c; p++) {
                                if (l[p] = e.read(n[1]),
                                20 < (f[p] = e.read(n[2])))
                                    throw new Error("TNS filter out of range: " + f[p]);
                                if (f[p]) {
                                    d[p] = !!e.read(1);
                                    for (var m = e.read(1), v = u + 3 - m, y = a[2 * m + u], g = f[p], w = h[p], E = 0; E < g; E++)
                                        w[E] = y[e.read(v)]
                                }
                            }
                }
            }, {
                key: "process",
                value: function(e, t, r) {
                    for (var n = Math.min(this.maxBands, e.maxSFB), o = this.lpc, i = this.tmp, a = e.info, s = a.windowCount, u = 0; u < s; u++) {
                        a.swbCount;
                        for (var c = this.nFilt[u], l = this.length[u], f = this.order[u], d = this.coef[u], h = this.direction[u], p = 0; p < c; p++) {
                            var m = v
                              , v = Math.max(0, i - l[p])
                              , y = f[p];
                            if (0 !== y) {
                                for (var g = d[p], w = 0; w < y; w++) {
                                    var E = -g[w];
                                    o[w] = E;
                                    for (var _ = 0, b = w + 1 >> 1; _ < b; _++) {
                                        var N = o[_]
                                          , T = o[w - 1 - _];
                                        o[_] = N + E * T,
                                        o[w - 1 - _] = T + E * N
                                    }
                                }
                                var O, k = a.swbOffsets[Math.min(v, n)], S = a.swbOffsets[Math.min(m, n)], D = 1;
                                if (!((O = S - k) <= 0))
                                    if (h[p] && (D = -1,
                                    k = S - 1),
                                    k += 128 * u,
                                    r)
                                        for (var I = 0; I < O; I++,
                                        k += D)
                                            for (var A = 1; A <= Math.min(I, y); A++)
                                                t[k] -= t[k - A * D] * o[A - 1];
                                    else
                                        for (var R = 0; R < O; R++,
                                        k += D) {
                                            i[0] = t[k];
                                            for (var M = 1; M <= Math.min(R, y); M++)
                                                t[k] += i[M] * o[M - 1];
                                            for (var x = y; 0 < x; x--)
                                                i[x] = i[x - 1]
                                        }
                            }
                        }
                    }
                }
            }]),
            e
        }();
        t.default = u,
        e.exports = t.default
    }
    , function(e, t, r) {
        "use strict";
        var n, o = (n = r(0)) && n.__esModule ? n : {
            default: n
        };
        function i(e) {
            this.ms_used = [],
            this.left = new o.default(e),
            this.right = new o.default(e)
        }
        i.prototype.decode = function(e, t) {
            var r = this.left
              , n = this.right
              , o = this.ms_used;
            if (this.commonWindow = !!e.read(1)) {
                r.info.decode(e, t, !0),
                n.info = r.info;
                var i = e.read(2);
                switch (this.maskPresent = !!i,
                i) {
                case 1:
                    for (var a = r.info.groupCount * r.info.maxSFB, s = 0; s < a; s++)
                        o[s] = !!e.read(1);
                    break;
                case 0:
                case 2:
                    for (var u = !!i, c = 0; c < 128; c++)
                        o[c] = u;
                    break;
                default:
                    throw new Error("Reserved ms mask type: " + i)
                }
            } else
                for (var l = 0; l < 128; l++)
                    o[l] = !1;
            r.decode(e, t, this.commonWindow),
            n.decode(e, t, this.commonWindow)
        }
        ,
        e.exports = i
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = i(r(0))
          , o = i(r(9));
        function i(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }
        function a(e) {
            this.ics = new n.default(e),
            this.channelPair = new Array(8),
            this.idSelect = new Int32Array(8),
            this.chSelect = new Int32Array(8),
            this.gain = new Array(16)
        }
        a.BEFORE_TNS = 0,
        a.AFTER_TNS = 1,
        a.AFTER_IMDCT = 2;
        var s = new Float32Array([1.0905077326652577, 1.189207115002721, 1.4142135623730951, 2]);
        a.prototype = {
            decode: function(e, t) {
                var r = this.channelPair
                  , i = this.idSelect
                  , u = this.chSelect;
                this.couplingPoint = 2 * e.read(1),
                this.coupledCount = e.read(3);
                for (var c = 0, l = 0; l <= this.coupledCount; l++)
                    c++,
                    r[l] = e.read(1),
                    i[l] = e.read(4),
                    r[l] ? (u[l] = e.read(2),
                    3 === u[l] && c++) : u[l] = 2;
                this.couplingPoint += e.read(1),
                this.couplingPoint |= this.couplingPoint >>> 1;
                var f = e.read(1)
                  , d = s[e.read(2)];
                this.ics.decode(e, t, !1);
                for (var h = this.ics.info.groupCount, p = this.ics.info.maxSFB, m = this.ics.bandTypes, v = 0; v < c; v++) {
                    var y = 0
                      , g = 1
                      , w = 0
                      , E = 1;
                    0 < v && (w = (g = this.couplingPoint === a.AFTER_IMDCT ? 1 : e.read(1)) ? o.default.decodeScaleFactor(e) - 60 : 0,
                    E = Math.pow(d, -w));
                    var _ = this.gain[v] = new Float32Array(120);
                    if (this.couplingPoint === a.AFTER_IMDCT)
                        _[0] = E;
                    else
                        for (var b = 0; b < h; b++)
                            for (var N = 0; N < p; N++)
                                if (m[y] !== n.default.ZERO_BT) {
                                    if (0 === g) {
                                        var T = o.default.decodeScaleFactor(e) - 60;
                                        if (0 !== T) {
                                            var O = 1;
                                            T = w += T,
                                            f || (O -= 2 * (1 & T),
                                            T >>>= 1),
                                            E = Math.pow(d, -T) * O
                                        }
                                    }
                                    _[y++] = E
                                }
                }
            },
            applyIndependentCoupling: function(e, t) {
                for (var r = this.gain[e][0], n = this.ics.data, o = 0; o < t.length; o++)
                    t[o] += r * n[o]
            },
            applyDependentCoupling: function(e, t) {
                for (var r = this.ics.info, o = r.swbOffsets, i = r.groupCount, a = r.maxSFB, s = this.ics.bandTypes, u = this.ics.data, c = 0, l = 0, f = this.gain[e], d = 0; d < i; d++) {
                    for (var h = r.groupLength[d], p = 0; p < a; p++,
                    c++)
                        if (s[c] !== n.default.ZERO_BT)
                            for (var m = f[c], v = 0; v < h; v++)
                                for (var y = o[p]; y < o[p + 1]; y++)
                                    t[l + 128 * v + y] += m * u[l + 128 * v + y];
                    l += 128 * h
                }
            }
        },
        t.default = a,
        e.exports = t.default
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = i(r(0))
          , o = i(r(20));
        function i(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }
        function a(e, t) {
            if (e)
                throw new Error("WHA?? No small frames allowed.");
            this.length = 1024,
            this.shortLength = 128,
            this.mid = (this.length - this.shortLength) / 2,
            this.trans = this.shortLength / 2,
            this.mdctShort = new o.default(2 * this.shortLength),
            this.mdctLong = new o.default(2 * this.length),
            this.overlaps = new Array(t);
            for (var r = 0; r < t; r++)
                this.overlaps[r] = new Float32Array(this.length);
            this.buf = new Float32Array(2 * this.length)
        }
        function s(e) {
            for (var t = new Float32Array(e), r = 0; r < e; r++)
                t[r] = Math.sin((r + .5) * (Math.PI / (2 * e)));
            return t
        }
        function u(e, t) {
            for (var r = Math.PI / t, n = new Float32Array(t), o = 0, i = new Float32Array(t), a = e * r * (e * r), s = 0; s < t; s++) {
                for (var u = s * (t - s) * a, c = 1, l = 50; 0 < l; l--)
                    c = c * u / (l * l) + 1;
                o += c,
                i[s] = o
            }
            o++;
            for (var f = 0; f < t; f++)
                n[f] = Math.sqrt(i[f] / o);
            return n
        }
        var c = s(1024)
          , l = s(128)
          , f = u(4, 1024)
          , d = u(6, 128)
          , h = [c, f]
          , p = [l, d];
        a.prototype.process = function(e, t, r, o) {
            var i = this.overlaps[o]
              , a = e.windowShape[1]
              , s = e.windowShape[0]
              , u = h[a]
              , c = p[a]
              , l = h[s]
              , f = p[s]
              , d = this.length
              , m = this.shortLength
              , v = this.mid
              , y = this.trans
              , g = this.buf
              , w = this.mdctLong
              , E = this.mdctShort;
            switch (e.windowSequence) {
            case n.default.ONLY_LONG_SEQUENCE:
                w.process(t, 0, g, 0);
                for (var _ = 0; _ < d; _++)
                    r[_] = i[_] + g[_] * l[_];
                for (var b = 0; b < d; b++)
                    i[b] = g[d + b] * u[d - 1 - b];
                break;
            case n.default.LONG_START_SEQUENCE:
                w.process(t, 0, g, 0);
                for (var N = 0; N < d; N++)
                    r[N] = i[N] + g[N] * l[N];
                for (var T = 0; T < v; T++)
                    i[T] = g[d + T];
                for (var O = 0; O < m; O++)
                    i[v + O] = g[d + v + O] * c[m - O - 1];
                for (var k = 0; k < v; k++)
                    i[v + m + k] = 0;
                break;
            case n.default.EIGHT_SHORT_SEQUENCE:
                for (var S = 0; S < 8; S++)
                    E.process(t, S * m, g, 2 * S * m);
                for (var D = 0; D < v; D++)
                    r[D] = i[D];
                for (var I = 0; I < m; I++)
                    r[v + I] = i[v + I] + g[I] * f[I],
                    r[v + 1 * m + I] = i[v + 1 * m + I] + g[1 * m + I] * c[m - 1 - I] + g[2 * m + I] * c[I],
                    r[v + 2 * m + I] = i[v + 2 * m + I] + g[3 * m + I] * c[m - 1 - I] + g[4 * m + I] * c[I],
                    r[v + 3 * m + I] = i[v + 3 * m + I] + g[5 * m + I] * c[m - 1 - I] + g[6 * m + I] * c[I],
                    I < y && (r[v + 4 * m + I] = i[v + 4 * m + I] + g[7 * m + I] * c[m - 1 - I] + g[8 * m + I] * c[I]);
                for (var A = 0; A < m; A++)
                    y <= A && (i[v + 4 * m + A - d] = g[7 * m + A] * c[m - 1 - A] + g[8 * m + A] * c[A]),
                    i[v + 5 * m + A - d] = g[9 * m + A] * c[m - 1 - A] + g[10 * m + A] * c[A],
                    i[v + 6 * m + A - d] = g[11 * m + A] * c[m - 1 - A] + g[12 * m + A] * c[A],
                    i[v + 7 * m + A - d] = g[13 * m + A] * c[m - 1 - A] + g[14 * m + A] * c[A],
                    i[v + 8 * m + A - d] = g[15 * m + A] * c[m - 1 - A];
                for (var R = 0; R < v; R++)
                    i[v + m + R] = 0;
                break;
            case n.default.LONG_STOP_SEQUENCE:
                w.process(t, 0, g, 0);
                for (var M = 0; M < v; M++)
                    r[M] = i[M];
                for (var x = 0; x < m; x++)
                    r[v + x] = i[v + x] + g[v + x] * f[x];
                for (var P = 0; P < v; P++)
                    r[v + m + P] = i[v + m + P] + g[v + m + P];
                for (var F = 0; F < d; F++)
                    i[F] = g[d + F] * u[d - 1 - F]
            }
        }
        ,
        t.default = a,
        e.exports = t.default
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n, o = function() {
            function e(e, t) {
                for (var r = 0; r < t.length; r++) {
                    var n = t[r];
                    n.enumerable = n.enumerable || !1,
                    n.configurable = !0,
                    "value"in n && (n.writable = !0),
                    Object.defineProperty(e, n.key, n)
                }
            }
            return function(t, r, n) {
                return r && e(t.prototype, r),
                n && e(t, n),
                t
            }
        }(), i = r(21), a = (n = r(22)) && n.__esModule ? n : {
            default: n
        }, s = function() {
            function e(t) {
                switch (function(t, r) {
                    if (!(t instanceof e))
                        throw new TypeError("Cannot call a class as a function")
                }(this),
                this.N = t,
                this.N2 = t >>> 1,
                this.N4 = t >>> 2,
                this.N8 = t >>> 3,
                t) {
                case 2048:
                    this.sincos = i.MDCT_TABLE_2048;
                    break;
                case 256:
                    this.sincos = i.MDCT_TABLE_256;
                    break;
                case 1920:
                    this.sincos = i.MDCT_TABLE_1920;
                    break;
                case 240:
                    this.sincos = i.MDCT_TABLE_240;
                    break;
                default:
                    throw new Error("unsupported MDCT length: " + t)
                }
                this.fft = new a.default(this.N4),
                this.buf = new Array(this.N4);
                for (var r = 0; r < this.N4; r++)
                    this.buf[r] = new Float32Array(2);
                this.tmp = new Float32Array(2)
            }
            return o(e, [{
                key: "process",
                value: function(e, t, r, n) {
                    for (var o = this.N2, i = this.N4, a = this.N8, s = this.buf, u = this.tmp, c = this.sincos, l = this.fft, f = 0; f < i; f++)
                        s[f][1] = e[t + 2 * f] * c[f][0] + e[t + o - 1 - 2 * f] * c[f][1],
                        s[f][0] = e[t + o - 1 - 2 * f] * c[f][0] - e[t + 2 * f] * c[f][1];
                    l.process(s, !1);
                    for (var d = 0; d < i; d++)
                        u[0] = s[d][0],
                        u[1] = s[d][1],
                        s[d][1] = u[1] * c[d][0] + u[0] * c[d][1],
                        s[d][0] = u[0] * c[d][0] - u[1] * c[d][1];
                    for (var h = 0; h < a; h += 2)
                        r[n + 2 * h] = s[a + h][1],
                        r[n + 2 + 2 * h] = s[a + 1 + h][1],
                        r[n + 1 + 2 * h] = -s[a - 1 - h][0],
                        r[n + 3 + 2 * h] = -s[a - 2 - h][0],
                        r[n + i + 2 * h] = s[h][0],
                        r[n + i + 2 + 2 * h] = s[1 + h][0],
                        r[n + i + 1 + 2 * h] = -s[i - 1 - h][1],
                        r[n + i + 3 + 2 * h] = -s[i - 2 - h][1],
                        r[n + o + 2 * h] = s[a + h][0],
                        r[n + o + 2 + 2 * h] = s[a + 1 + h][0],
                        r[n + o + 1 + 2 * h] = -s[a - 1 - h][1],
                        r[n + o + 3 + 2 * h] = -s[a - 2 - h][1],
                        r[n + o + i + 2 * h] = -s[h][1],
                        r[n + o + i + 2 + 2 * h] = -s[1 + h][1],
                        r[n + o + i + 1 + 2 * h] = s[i - 1 - h][0],
                        r[n + o + i + 3 + 2 * h] = s[i - 2 - h][0]
                }
            }]),
            e
        }();
        t.default = s,
        e.exports = t.default
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }),
        t.MDCT_TABLE_2048 = [[.031249997702054, 11984224612e-15], [.031249813866531, .000107857810004], [.031249335895858, .000203730380198], [.031248563794535, .000299601032804], [.031247497569829, .000395468865451], [.031246137231775, .000491332975794], [.031244482793177, .000587192461525], [.031242534269608, .000683046420376], [.031240291679407, .000778893950134], [.031237755043684, .000874734148645], [.031234924386313, .000970566113826], [.031231799733938, .001066388943669], [.03122838111597, .001162201736253], [.031224668564585, .001258003589751], [.031220662114728, .001353793602441], [.031216361804108, .00144957087271], [.031211767673203, .001545334499065], [.031206879765253, .001641083580144], [.031201698126266, .001736817214719], [.031196222805014, .001832534501709], [.031190453853031, .001928234540186], [.031184391324617, .002023916429386], [.031178035276836, .002119579268713], [.031171385769513, .002215222157753], [.031164442865236, .002310844196278], [.031157206629353, .002406444484258], [.031149677129975, .002502022121865], [.031141854437973, .002597576209488], [.031133738626977, .002693105847734], [.031125329773375, .002788610137442], [.031116627956316, .002884088179689], [.031107633257703, .002979539075801], [.0310983457622, .003074961927355], [.031088765557222, .003170355836197], [.031078892732942, .003265719904442], [.031068727382288, .003361053234488], [.031058269600939, .003456354929021], [.031047519487329, .003551624091024], [.03103647714264, .00364685982379], [.031025142670809, .003742061230921], [.031013516178519, .003837227416347], [.031001597775203, .003932357484328], [.030989387573042, .004027450539462], [.030976885686963, .004122505686697], [.030964092234638, .00421752203134], [.030951007336485, .004312498679058], [.030937631115663, .004407434735897], [.030923963698074, .004502329308281], [.030910005212362, .004597181503027], [.030895755789908, .00469199042735], [.030881215564835, .004786755188872], [.030866384674, .004881474895632], [.030851263256996, .00497614865609], [.030835851456154, .005070775579142], [.030820149416533, .005165354774124], [.030804157285929, .005259885350819], [.030787875214864, .005354366419469], [.030771303356593, .005448797090784], [.030754441867095, .005543176475946], [.030737290905077, .005637503686619], [.030719850631972, .005731777834961], [.030702121211932, .005825998033626], [.030684102811835, .00592016339578], [.030665795601276, .006014273035101], [.03064719975257, .006108326065793], [.030628315440748, .006202321602594], [.030609142843557, .006296258760782], [.030589682141455, .006390136656185], [.030569933517616, .006483954405188], [.030549897157919, .006577711124743], [.030529573250956, .006671405932375], [.030508961988022, .006765037946194], [.030488063563118, .0068586062849], [.030466878172949, .006952110067791], [.030445406016919, .007045548414774], [.030423647297133, .007138920446372], [.030401602218392, .007232225283733], [.030379270988192, .007325462048634], [.030356653816724, .007418629863497], [.030333750916869, .00751172785139], [.030310562504198, .00760475513604], [.030287088796968, .007697710841838], [.030263330016124, .007790594093851], [.030239286385293, .007883404017824], [.030214958130781, .007976139740197], [.030190345481576, .008068800388104], [.030165448669342, .00816138508939], [.030140267928416, .00825389297261], [.030114803495809, .008346323167047], [.030089055611203, .008438674802711], [.030063024516947, .008530947010354], [.030036710458054, .008623138921475], [.030010113682202, .008715249668328], [.029983234439732, .008807278383932], [.02995607298364, .008899224202078], [.02992862956958, .008991086257336], [.02990090445586, .009082863685067], [.029872897903441, .009174555621425], [.029844610175929, .009266161203371], [.029816041539579, .009357679568679], [.029787192263292, .009449109855944], [.029758062618606, .009540451204587], [.029728652879702, .009631702754871], [.029698963323395, .0097228636479], [.029668994229134, .009813933025633], [.029638745879, .009904910030891], [.029608218557702, .009995793807363], [.029577412552575, .010086583499618], [.029546328153577, .010177278253107], [.029514965653285, .010267877214177], [.029483325346896, .010358379530076], [.02945140753222, .010448784348962], [.029419212509679, .010539090819911], [.029386740582307, .010629298092923], [.02935399205574, .010719405318933], [.02932096723822, .010809411649818], [.02928766644059, .010899316238403], [.02925408997629, .010989118238474], [.029220238161353, .011078816804778], [.029186111314406, .011168411093039], [.029151709756664, .011257900259961], [.029117033811927, .011347283463239], [.029082083806579, .011436559861563], [.029046860069582, .01152572861463], [.029011362932476, .01161478888315], [.028975592729373, .011703739828853], [.028939549796957, .0117925806145], [.028903234474475, .011881310403886], [.028866647103744, .011969928361855], [.028829788029135, .012058433654299], [.028792657597583, .012146825448172], [.028755256158571, .012235102911499], [.028717584064137, .012323265213377], [.028679641668864, .01241131152399], [.028641429329882, .012499241014612], [.028602947406859, .012587052857618], [.028564196262001, .012674746226488], [.02852517626005, .012762320295819], [.028485887768276, .012849774241331], [.028446331156478, .012937107239875], [.028406506796976, .013024318469437], [.028366415064615, .013111407109155], [.028326056336751, .013198372339315], [.028285430993258, .013285213341368], [.028244539416515, .013371929297933], [.028203381991411, .013458519392807], [.028161959105334, .013544982810971], [.028120271148172, .013631318738598], [.028078318512309, .013717526363062], [.028036101592619, .013803604872943], [.027993620786463, .013889553458039], [.027950876493687, .013975371309367], [.027907869116616, .014061057619178], [.027864599060052, .014146611580959], [.02782106673127, .014232032389445], [.027777272540012, .014317319240622], [.027733216898487, .014402471331737], [.027688900221361, .014487487861307], [.027644322925762, .014572368029123], [.027599485431266, .014657111036262], [.027554388159903, .01474171608509], [.027509031536144, .014826182379271], [.027463415986904, .014910509123778], [.027417541941533, .014994695524894], [.027371409831816, .015078740790225], [.027325020091965, .015162644128704], [.027278373158618, .015246404750603], [.027231469470833, .015330021867534], [.027184309470088, .01541349469246], [.027136893600268, .015496822439704], [.027089222307671, .015580004324954], [.027041296040997, .015663039565269], [.026993115251345, .015745927379091], [.026944680392213, .015828666986247], [.026895991919487, .015911257607961], [.026847050291442, .015993698466859], [.026797855968734, .016075988786976], [.026748409414401, .016158127793763], [.026698711093851, .016240114714099], [.026648761474864, .016321948776289], [.026598561027585, .016403629210082], [.026548110224519, .016485155246669], [.02649740954053, .016566526118696], [.02644645945283, .016647741060271], [.026395260440982, .016728799306966], [.02634381298689, .016809700095831], [.026292117574797, .016890442665397], [.02624017469128, .016971026255683], [.026187984825246, .017051450108208], [.026135548467924, .01713171346599], [.026082866112867, .01721181557356], [.026029938255941, .017291755676967], [.025976765395322, .017371533023784], [.025923348031494, .017451146863116], [.025869686667242, .017530596445607], [.025815781807646, .017609881023449], [.02576163396008, .017688999850383], [.025707243634204, .017767952181715], [.02565261134196, .017846737274313], [.025597737597568, .017925354386623], [.025542622917522, .018003802778671], [.025487267820581, .018082081712071], [.025431672827768, .018160190450031], [.025375838462365, .018238128257362], [.025319765249906, .018315894400484], [.025263453718173, .018393488147432], [.025206904397193, .018470908767865], [.025150117819228, .01854815553307], [.025093094518776, .018625227715971], [.025035835032562, .018702124591135], [.024978339899534, .01877884543478], [.024920609660858, .01885538952478], [.024862644859912, .018931756140672], [.024804446042284, .019007944563666], [.024746013755764, .019083954076646], [.024687348550337, .019159783964183], [.024628450978184, .019235433512536], [.02456932159367, .019310902009663], [.024509960953345, .019386188745225], [.024450369615932, .019461293010596], [.024390548142329, .019536214098866], [.024330497095598, .019610951304848], [.024270217040961, .019685503925087], [.024209708545799, .019759871257867], [.024148972179639, .019834052603212], [.024088008514157, .019908047262901], [.024026818123164, .019981854540467], [.023965401582609, .020055473741208], [.023903759470567, .020128904172192], [.023841892367236, .020202145142264], [.023779800854935, .020275195962052], [.023717485518092, .020348055943974], [.023654946943242, .020420724402244], [.023592185719023, .020493200652878], [.023529202436167, .020565484013703], [.023465997687496, .020637573804361], [.023402572067918, .020709469346314], [.023338926174419, .020781169962854], [.023275060606058, .020852674979108], [.023210975963963, .020923983722044], [.023146672851322, .020995095520475], [.02308215187338, .021066009705072], [.023017413637435, .021136725608363], [.022952458752826, .021207242564742], [.022887287830934, .021277559910478], [.022821901485173, .021347676983716], [.022756300330983, .021417593124488], [.022690484985827, .021487307674717], [.022624456069185, .021556819978223], [.022558214202547, .021626129380729], [.022491760009405, .021695235229869], [.022425094115252, .021764136875192], [.022358217147572, .021832833668171], [.022291129735838, .021901324962204], [.022223832511501, .021969610112625], [.022156326107988, .022037688476709], [.022088611160696, .022105559413676], [.022020688306983, .022173222284699], [.021952558186166, .022240676452909], [.02188422143951, .022307921283403], [.021815678710228, .022374956143245], [.021746930643469, .022441780401478], [.021677977886316, .022508393429127], [.02160882108778, .022574794599206], [.02153946089879, .022640983286719], [.02146989797219, .022706958868676], [.021400132962735, .022772720724087], [.021330166527077, .022838268233979], [.021259999323769, .022903600781391], [.02118963201325, .022968717751391], [.021119065257845, .023033618531071], [.021048299721754, .023098302509561], [.02097733607105, .023162769078031], [.02090617497367, .023227017629698], [.020834817099409, .023291047559828], [.020763263119915, .023354858265748], [.02069151370868, .023418449146848], [.020619569541038, .023481819604585], [.020547431294155, .023544969042494], [.020475099647023, .023607896866186], [.020402575280455, .023670602483363], [.020329858877078, .023733085303813], [.020256951121327, .023795344739427], [.020183852699437, .023857380204193], [.020110564299439, .023919191114211], [.02003708661115, .023980776887692], [.019963420326171, .024042136944968], [.019889566137877, .024103270708495], [.019815524741412, .024164177602859], [.019741296833681, .024224857054779], [.019666883113346, .02428530849312], [.019592284280817, .024345531348888], [.019517501038246, .024405525055242], [.019442534089523, .0244652890475], [.019367384140264, .024524822763141], [.019292051897809, .024584125641809], [.019216538071215, .024643197125323], [.019140843371246, .024702036657681], [.019064968510369, .024760643685063], [.018988914202748, .024819017655836], [.018912681164234, .024877158020562], [.018836270112363, .024935064232003], [.018759681766343, .024992735745123], [.018682916847054, .025050172017095], [.018605976077037, .025107372507308], [.018528860180486, .025164336677369], [.018451569883247, .02522106399111], [.018374105912805, .025277553914591], [.01829646899828, .025333805916107], [.018218659870421, .025389819466194], [.018140679261596, .02544559403763], [.01806252790579, .025501129105445], [.017984206538592, .02555642414692], [.017905715897192, .025611478641598], [.017827056720375, .025666292071285], [.017748229748511, .025720863920056], [.01766923572355, .02577519367426], [.017590075389012, .025829280822525], [.017510749489986, .025883124855762], [.017431258773116, .02593672526717], [.0173516039866, .025990081552242], [.01727178588018, .026043193208768], [.017191805205132, .026096059736841], [.017111662714267, .026148680638861], [.017031359161915, .026201055419541], [.016950895303924, .026253183585908], [.016870271897651, .026305064647313], [.016789489701954, .026356698115431], [.016708549477186, .026408083504269], [.016627451985187, .026459220330167], [.016546197989277, .026510108111806], [.01646478825425, .026560746370212], [.016383223546365, .026611134628757], [.016301504633341, .026661272413168], [.016219632284346, .02671115925153], [.016137607269996, .026760794674288], [.01605543036234, .026810178214254], [.015973102334858, .026859309406613], [.015890623962454, .026908187788922], [.015807996021446, .026956812901119], [.015725219289558, .027005184285527], [.015642294545918, .027053301486856], [.015559222571044, .027101164052208], [.015476004146842, .027148771531083], [.015392640056594, .02719612347538], [.015309131084956, .027243219439406], [.015225478017946, .027290058979875], [.015141681642938, .027336641655915], [.015057742748656, .027382967029073], [.014973662125164, .027429034663317], [.014889440563862, .02747484412504], [.014805078857474, .027520394983066], [.014720577800046, .027565686808654], [.014635938186934, .027610719175499], [.014551160814797, .02765549165974], [.014466246481592, .02770000383996], [.014381195986567, .027744255297195], [.014296010130247, .027788245614933], [.014210689714436, .02783197437912], [.014125235542201, .027875441178165], [.01403964841787, .027918645602941], [.01395392914702, .027961587246792], [.013868078536476, .028004265705534], [.013782097394294, .028046680577462], [.013695986529763, .028088831463351], [.01360974675339, .028130717966461], [.013523378876898, .02817233969254], [.013436883713214, .028213696249828], [.013350262076462, .028254787249062], [.01326351478196, .028295612303478], [.013176642646205, .028336171028814], [.013089646486871, .028376463043317], [.013002527122799, .028416487967743], [.01291528537399, .028456245425361], [.012827922061597, .02849573504196], [.012740438007915, .028534956445849], [.012652834036379, .028573909267859], [.01256511097155, .028612593141354], [.012477269639111, .028651007702224], [.012389310865858, .028689152588899], [.012301235479693, .028727027442343], [.012213044309615, .028764631906065], [.012124738185712, .028801965626115], [.012036317939156, .028839028251097], [.011947784402191, .028875819432161], [.01185913840813, .028912338823015], [.011770380791341, .028948586079925], [.011681512387245, .028984560861718], [.011592534032306, .029020262829785], [.011503446564022, .029055691648087], [.011414250820918, .029090846983152], [.011324947642537, .029125728504087], [.011235537869437, .029160335882573], [.011146022343175, .029194668792871], [.011056401906305, .029228726911828], [.010966677402371, .029262509918876], [.010876849675891, .029296017496036], [.010786919572361, .029329249327922], [.010696887938235, .029362205101743], [.010606755620926, .029394884507308], [.010516523468793, .029427287237024], [.010426192331137, .029459412985906], [.010335763058187, .029491261451573], [.010245236501099, .029522832334255], [.010154613511943, .029554125336796], [.010063894943698, .029585140164654], [.00997308165024, .029615876525905], [.00988217448634, .029646334131247], [.00979117430765, .029676512694001], [.009700081970699, .029706411930116], [.009608898332881, .029736031558168], [.009517624252453, .029765371299366], [.009426260588521, .029794430877553], [.009334808201034, .02982321001921], [.009243267950778, .029851708453456], [.009151640699363, .029879925912053], [.00905992730922, .029907862129408], [.008968128643591, .029935516842573], [.00887624556652, .029962889791254], [.008784278942845, .029989980717805], [.008692229638191, .030016789367235], [.008600098518961, .030043315487212], [.008507886452329, .030069558828062], [.00841559430623, .030095519142772], [.008323222949351, .030121196186994], [.008230773251129, .030146589719046], [.008138246081733, .030171699499915], [.008045642312067, .030196525293257], [.00795296281375, .030221066865402], [.007860208459119, .030245323985357], [.007767380121212, .030269296424803], [.007674478673766, .030292983958103], [.007581504991203, .030316386362302], [.007488459948628, .030339503417126], [.007395344421816, .030362334904989], [.007302159287206, .030384880610993], [.007208905421891, .030407140322928], [.007115583703613, .030429113831278], [.007022195010752, .03045080092922], [.006928740222316, .030472201412626], [.006835220217939, .030493315080068], [.006741635877866, .030514141732814], [.006647988082948, .030534681174838], [.006554277714635, .030554933212813], [.006460505654964, .030574897656119], [.006366672786553, .030594574316845], [.006272779992593, .030613963009786], [.006178828156839, .030633063552447], [.006084818163601, .030651875765048], [.005990750897737, .03067039947052], [.005896627244644, .030688634494512], [.00580244809025, .030706580665388], [.005708214321004, .030724237814232], [.005613926823871, .030741605774849], [.005519586486321, .030758684383764], [.005425194196321, .030775473480228], [.005330750842327, .030791972906214], [.005236257313276, .030808182506425], [.005141714498576, .030824102128288], [.005047123288102, .030839731621963], [.004952484572181, .030855070840339], [.004857799241589, .030870119639036], [.004763068187541, .030884877876411], [.004668292301681, .030899345413553], [.004573472476075, .030913522114288], [.004478609603205, .03092740784518], [.004383704575956, .03094100247553], [.00428875828761, .030954305877381], [.004193771631837, .030967317925516], [.004098745502689, .030980038497461], [.004003680794587, .030992467473486], [.003908578402316, .031004604736602], [.003813439221017, .031016450172571], [.003718264146176, .031028003669899], [.003623054073616, .031039265119839], [.003527809899492, .031050234416394], [.003432532520278, .031060911456318], [.00333722283276, .031071296139114], [.003241881734029, .031081388367037], [.003146510121474, .031091188045095], [.003051108892766, .031100695081051], [.00295567894586, .031109909385419], [.002860221178978, .031118830871473], [.002764736490604, .031127459455239], [.002669225779478, .031135795055501], [.002573689944583, .031143837593803], [.002478129885137, .031151586994444], [.002382546500589, .031159043184484], [.002286940690606, .031166206093743], [.002191313355067, .0311730756548], [.002095665394051, .031179651802998], [.001999997707835, .031185934476438], [.001904311196878, .031191923615985], [.00180860676182, .031197619165268], [.001712885303465, .031203021070678], [.001617147722782, .03120812928137], [.001521394920889, .031212943749264], [.001425627799047, .031217464429043], [.001329847258653, .031221691278159], [.001234054201231, .031225624256825], [.00113824952842, .031229263328024], [.001042434141971, .031232608457502], [.000946608943736, .031235659613775], [.000850774835656, .031238416768124], [.000754932719759, .031240879894597], [.000659083498149, .03124304897001], [.000563228072993, .031244923973948], [.00046736734652, .031246504888762], [.000371502221008, .031247791699571], [.000275633598775, .031248784394264], [.000179762382174, .031249482963498], [83889473581e-15, .031249887400697]],
        t.MDCT_TABLE_256 = [[.088387931675923, .000271171628935], [.088354655998507, .002440238387037], [.08826815878011, .00460783523678], [.088128492123423, .006772656498875], [.087935740158418, .008933398165942], [.08769001899167, .011088758687994], [.087391476636423, .013237439756448], [.087040292923427, .015378147086172], [.086636679392621, .017509591195118], [.086180879165703, .019630488181053], [.085673166799686, .02173956049494], [.085113848121515, .023835537710479], [.084503260043847, .025917157289369], [.08384177036211, .027983165341813], [.083129777532952, .030032317381813], [.08236771043423, .032063379076803], [.081556028106671, .034075126991164], [.080695219477356, .036066349323177], [.079785803065216, .038035846634965], [.078828326668693, .039982432574992], [.077823367035766, .041904934592675], [.07677152951654, .043802194644686], [.075673447698606, .045673069892513], [.07452978302539, .047516433390863], [.073341224397728, .049331174766491], [.072108487758894, .051116200887052], [.070832315663343, .052870436519557], [.069513476829429, .054592824978055], [.068152765676348, .056282328760143], [.06675100184562, .057937930171918], [.065309029707361, .059558631940996], [.063827717851668, .061143457817234], [.062307958565413, .062691453160784], [.060750667294763, .064201685517134], [.059156782093749, .065673245178784], [.057527263059216, .06710524573322], [.055863091752499, .068496824596852], [.054165270608165, .069847143534609], [.052434822330188, .071155389164853], [.050672789275903, .072420773449336], [.048880232828135, .073642534167879], [.047058232755862, .074819935377512], [.045207886563797, .075952267855771], [.043330308831298, .077038849527912], [.041426630540984, .078079025877766], [.039497998397473, .079072170341994], [.037545574136653, .080017684687506], [.035570533825892, .080914999371817], [.033574067155622, .081763573886112], [.031557376722714, .082562897080836], [.029521677306074, .083312487473584], [.027468195134911, .084011893539132], [.025398167150101, .084660693981419], [.023312840259098, .08525849798732], [.021213470584847, .085804945462053], [.019101322709138, .086299707246093], [.016977668910873, .086742485313442], [.014843788399692, .087133012951149], [.012700966545425, .087471054919968], [.01055049410383, .087756407596056], [.008393666439096, .087988899093631], [.006231782743558, .08816838936851], [.004066145255116, .088294770302461], [.001898058472816, .088367965768336]],
        t.MDCT_TABLE_1920 = [[.032274858518097, 13202404176e-15], [.032274642494505, .000118821372483], [.032274080835421, .000224439068308], [.03227317354686, .000330054360572], [.032271920638538, .000435666118218], [.032270322123873, .000541273210231], [.032268378019984, .000646874505642], [.032266088347691, .000752468873546], [.032263453131514, .000858055183114], [.032260472399674, .0009636323036], [.032257146184092, .001069199104358], [.03225347452039, .001174754454853], [.032249457447888, .001280297224671], [.032245095009606, .001385826283535], [.032240387252262, .001491340501313], [.032235334226272, .001596838748031], [.03222993598575, .00170231989389], [.032224192588507, .001807782809271], [.03221810409605, .001913226364749], [.032211670573582, .002018649431111], [.03220489209, .002124050879359], [.032197768717898, .002229429580728], [.03219030053356, .002334784406698], [.032182487616965, .002440114229003], [.032174330051782, .002545417919644], [.032165827925374, .002650694350905], [.03215698132879, .002755942395358], [.032147790356771, .002861160925883], [.032138255107744, .002966348815672], [.032128375683825, .00307150493825], [.032118152190814, .003176628167476], [.032107584738196, .003281717377568], [.032096673439141, .003386771443102], [.0320854184105, .003491789239036], [.032073819772804, .003596769640711], [.032061877650267, .003701711523874], [.032049592170778, .00380661376468], [.032036963465906, .003911475239711], [.032023991670893, .004016294825985], [.032010676924657, .004121071400967], [.031997019369789, .004225803842586], [.031983019152549, .004330491029241], [.031968676422869, .004435131839816], [.031953991334348, .004539725153692], [.031938964044252, .004644269850758], [.03192359471351, .004748764811426], [.031907883506716, .004853208916638], [.031891830592124, .004957601047881], [.031875436141648, .0050619400872], [.031858700330859, .005166224917208], [.031841623338985, .005270454421097], [.031824205348907, .005374627482653], [.031806446547156, .005478742986267], [.031788347123916, .005582799816945], [.031769907273017, .005686796860323], [.031751127191935, .005790733002674], [.031732007081789, .005894607130928], [.03171254714734, .005998418132675], [.031692747596989, .006102164896182], [.031672608642773, .006205846310406], [.031652130500364, .006309461265002], [.031631313389067, .006413008650337], [.031610157531816, .006516487357501], [.031588663155172, .006619896278321], [.031566830489325, .00672323430537], [.031544659768083, .006826500331981], [.031522151228878, .006929693252258], [.031499305112758, .007032811961088], [.031476121664387, .007135855354151], [.03145260113204, .007238822327937], [.031428743767604, .007341711779751], [.031404549826572, .00744452260773], [.031380019568042, .007547253710853], [.031355153254712, .007649903988952], [.031329951152882, .007752472342725], [.031304413532445, .007854957673748], [.031278540666888, .007957358884484], [.03125233283329, .0080596748783], [.031225790312316, .008161904559473], [.031198913388214, .008264046833205], [.031171702348814, .008366100605636], [.031144157485525, .008468064783849], [.031116279093331, .008569938275893], [.031088067470786, .008671719990782], [.031059522920014, .008773408838517], [.031030645746705, .008875003730092], [.03100143626011, .008976503577507], [.030971894773039, .00907790729378], [.030942021601857, .009179213792959], [.030911817066483, .009280421990133], [.030881281490382, .009381530801444], [.030850415200566, .009482539144097], [.030819218527589, .009583445936373], [.030787691805541, .009684250097643], [.030755835372048, .009784950548375], [.030723649568268, .009885546210147], [.030691134738883, .009986036005661], [.030658291232103, .010086418858753], [.030625119399655, .010186693694402], [.030591619596781, .010286859438745], [.030557792182239, .010386915019088], [.030523637518292, .010486859363916], [.03048915597071, .010586691402906], [.030454347908763, .010686410066936], [.030419213705216, .010786014288099], [.030383753736329, .010885502999714], [.030347968381849, .010984875136338], [.03031185802501, .011084129633775], [.030275423052523, .011183265429088], [.030238663854579, .011282281460612], [.030201580824838, .011381176667967], [.03016417436043, .011479949992062], [.030126444861948, .011578600375117], [.030088392733446, .011677126760663], [.03005001838243, .011775528093563], [.030011322219859, .011873803320018], [.029972304660138, .011971951387578], [.029932966121114, .012069971245157], [.02989330702407, .012167861843041], [.029853327793724, .012265622132901], [.029813028858222, .012363251067801], [.029772410649132, .012460747602215], [.029731473601443, .012558110692033], [.029690218153558, .012655339294575], [.029648644747289, .0127524323686], [.029606753827855, .01284938887432], [.029564545843872, .012946207773407], [.029522021247356, .013042888029011], [.02947918049371, .013139428605762], [.029436024041725, .013235828469789], [.02939255235357, .013332086588727], [.029348765894794, .013428201931728], [.029304665134313, .013524173469475], [.029260250544412, .013620000174189], [.029215522600735, .013715681019643], [.029170481782283, .013811214981173], [.029125128571406, .013906601035686], [.029079463453801, .014001838161674], [.029033486918505, .014096925339225], [.028987199457889, .014191861550031], [.028940601567655, .014286645777401], [.028893693746829, .014381277006273], [.028846476497755, .014475754223221], [.028798950326094, .014570076416472], [.028751115740811, .01466424257591], [.028702973254178, .014758251693091], [.02865452338176, .014852102761253], [.028605766642418, .014945794775326], [.028556703558297, .015039326731945], [.028507334654823, .015132697629457], [.028457660460698, .015225906467935], [.028407681507891, .015318952249187], [.028357398331639, .015411833976768], [.028306811470432, .015504550655988], [.028255921466016, .015597101293927], [.028204728863381, .015689484899442], [.02815323421076, .015781700483179], [.028101438059619, .015873747057582], [.028049340964652, .015965623636907], [.027996943483779, .016057329237229], [.027944246178133, .016148862876456], [.027891249612061, .016240223574335], [.027837954353113, .016331410352467], [.027784360972039, .016422422234315], [.02773047004278, .016513258245214], [.027676282142466, .016603917412384], [.027621797851405, .016694398764938], [.02756701775308, .016784701333894], [.027511942434143, .016874824152183], [.027456572484404, .016964766254662], [.027400908496833, .017054526678124], [.027344951067546, .017144104461307], [.027288700795801, .017233498644904], [.027232158283994, .017322708271577], [.027175324137651, .01741173238596], [.027118198965418, .017500570034678], [.02706078337906, .017589220266351], [.027003077993454, .017677682131607], [.026945083426576, .017765954683088], [.026886800299502, .017854036975468], [.026828229236397, .017941928065456], [.026769370864511, .018029627011808], [.02671022581417, .01811713287534], [.026650794718768, .018204444718934], [.026591078214767, .018291561607551], [.02653107694168, .018378482608238], [.026470791542075, .018465206790142], [.026410222661558, .018551733224515], [.026349370948775, .01863806098473], [.026288237055398, .018724189146286], [.026226821636121, .018810116786819], [.026165125348656, .018895842986112], [.026103148853718, .018981366826109], [.026040892815028, .019066687390916], [.025978357899296, .019151803766819], [.025915544776223, .01923671504229], [.025852454118485, .019321420307998], [.025789086601733, .019405918656817], [.025725442904582, .019490209183837], [.025661523708606, .019574290986376], [.025597329698327, .019658163163984], [.025532861561211, .019741824818458], [.025468119987662, .019825275053848], [.025403105671008, .01990851297647], [.025337819307501, .019991537694913], [.025272261596305, .020074348320047], [.025206433239491, .020156943965039], [.025140334942028, .020239323745355], [.025073967411776, .020321486778774], [.025007331359476, .020403432185395], [.024940427498748, .02048515908765], [.024873256546079, .020566666610309], [.024805819220816, .020647953880491], [.024738116245157, .020729020027676], [.024670148344147, .020809864183709], [.024601916245669, .020890485482816], [.024533420680433, .020970883061607], [.024464662381971, .021051056059087], [.02439564208663, .02113100361667], [.024326360533561, .021210724878181], [.024256818464715, .021290218989868], [.02418701662483, .021369485100415], [.02411695576143, .021448522360944], [.024046636624808, .02152732992503], [.023976059968027, .021605906948708], [.023905226546906, .02168425259048], [.023834137120014, .021762366011328], [.023762792448662, .02184024637472], [.023691193296893, .02191789284662], [.023619340431478, .021995304595495], [.023547234621902, .02207248079233], [.023474876640361, .022149420610628], [.023402267261751, .022226123226426], [.023329407263659, .0223025878183], [.023256297426359, .022378813567377], [.023182938532797, .022454799657339], [.023109331368588, .022530545274437], [.023035476722006, .022606049607496], [.022961375383975, .022681311847926], [.022887028148061, .022756331189727], [.022812435810462, .022831106829504], [.022737599170003, .022905637966469], [.022662519028125, .022979923802453], [.022587196188874, .023053963541915], [.022511631458899, .02312775639195], [.022435825647437, .023201301562294], [.022359779566306, .023274598265338], [.0222834940299, .023347645716133], [.022206969855176, .0234204431324], [.022130207861645, .023492989734537], [.022053208871367, .023565284745628], [.02197597370894, .023637327391451], [.021898503201489, .023709116900488], [.021820798178663, .023780652503931], [.021742859472618, .023851933435691], [.021664687918017, .023922958932406], [.021586284352013, .023993728233451], [.021507649614247, .024064240580942], [.021428784546832, .02413449521975], [.02134968999435, .024204491397504], [.02127036680384, .0242742283646], [.021190815824791, .024343705374213], [.021111037909128, .024412921682298], [.02103103391121, .024481876547605], [.020950804687815, .024550569231683], [.020870351098134, .024618998998889], [.020789674003759, .024687165116394], [.020708774268678, .024755066854194], [.020627652759262, .024822703485116], [.020546310344257, .024890074284826], [.020464747894775, .024957178531837], [.020382966284284, .025024015507516], [.0203009663886, .025090584496093], [.020218749085876, .025156884784668], [.020136315256592, .025222915663218], [.020053665783549, .025288676424605], [.019970801551857, .025354166364584], [.019887723448925, .025419384781811], [.019804432364452, .025484330977848], [.019720929190419, .025549004257175], [.019637214821078, .025613403927192], [.019553290152943, .02567752929823], [.019469156084779, .025741379683559], [.019384813517595, .025804954399392], [.019300263354632, .025868252764895], [.019215506501354, .025931274102193], [.019130543865439, .025994017736379], [.019045376356769, .026056482995518], [.018960004887419, .026118669210657], [.018874430371648, .026180575715833], [.018788653725892, .026242201848076], [.01870267586875, .026303546947421], [.018616497720974, .026364610356909], [.018530120205464, .026425391422602], [.018443544247254, .026485889493583], [.018356770773502, .026546103921965], [.018269800713483, .026606034062902], [.018182634998576, .026665679274589], [.018095274562256, .026725038918274], [.018007720340083, .026784112358263], [.017919973269692, .026842898961926], [.017832034290785, .026901398099707], [.017743904345116, .026959609145127], [.017655584376488, .027017531474792], [.017567075330734, .027075164468401], [.017478378155718, .02713250750875], [.017389493801313, .027189559981742], [.017300423219401, .027246321276391], [.017211167363854, .027302790784828], [.017121727190533, .02735896790231], [.017032103657269, .027414852027226], [.016942297723858, .027470442561102], [.01685231035205, .027525738908608], [.016762142505537, .027580740477564], [.016671795149944, .027635446678948], [.016581269252819, .0276898569269], [.016490565783622, .02774397063873], [.016399685713714, .027797787234924], [.016308630016347, .027851306139149], [.016217399666655, .02790452677826], [.016125995641641, .027957448582309], [.01603441892017, .028010070984544], [.015942670482954, .028062393421421], [.015850751312545, .02811441533261], [.015758662393324, .028166136160998], [.015666404711489, .028217555352697], [.015573979255046, .028268672357047], [.015481387013797, .028319486626627], [.015388628979331, .028369997617257], [.015295706145012, .028420204788004], [.015202619505968, .028470107601191], [.015109370059084, .028519705522399], [.015015958802984, .028568998020472], [.01492238673803, .028617984567529], [.014828654866302, .028666664638963], [.014734764191593, .028715037713449], [.014640715719398, .028763103272951], [.0145465104569, .028810860802724], [.014452149412962, .028858309791325], [.014357633598114, .028905449730613], [.014262964024545, .028952280115756], [.01416814170609, .02899880044524], [.01407316765822, .029045010220868], [.01397804289803, .029090908947771], [.013882768444231, .029136496134411], [.013787345317136, .029181771292585], [.013691774538648, .029226733937433], [.013596057132255, .029271383587441], [.013500194123014, .029315719764447], [.013404186537539, .029359741993647], [.013308035403995, .029403449803598], [.013211741752084, .029446842726223], [.013115306613032, .02948992029682], [.013018731019584, .029532682054063], [.012922016005985, .029575127540008], [.012825162607977, .029617256300097], [.012728171862781, .029659067883165], [.012631044809089, .029700561841444], [.012533782487056, .029741737730567], [.012436385938281, .029782595109573], [.012338856205805, .029823133540913], [.012241194334091, .029863352590452], [.012143401369021, .029903251827477], [.012045478357878, .029942830824699], [.011947426349339, .029982089158259], [.011849246393462, .030021026407731], [.011750939541676, .030059642156129], [.011652506846768, .030097935989909], [.011553949362874, .030135907498976], [.011455268145464, .030173556276684], [.011356464251335, .030210881919845], [.011257538738598, .030247884028732], [.011158492666665, .030284562207083], [.01105932709624, .030320916062102], [.010960043089307, .03035694520447], [.010860641709118, .030392649248343], [.010761124020182, .030428027811361], [.010661491088253, .030463080514646], [.010561743980319, .030497806982812], [.010461883764593, .030532206843968], [.010361911510496, .030566279729717], [.010261828288652, .030600025275167], [.010161635170872, .030633443118931], [.010061333230142, .030666532903129], [.009960923540617, .030699294273397], [.009860407177603, .030731726878888], [.00975978521755, .030763830372273], [.009659058738038, .03079560440975], [.009558228817767, .030827048651045], [.009457296536545, .030858162759415], [.009356262975275, .030888946401653], [.009255129215945, .030919399248091], [.009153896341616, .030949520972603], [.009052565436412, .030979311252611], [.008951137585505, .031008769769084], [.008849613875105, .031037896206544], [.008747995392451, .031066690253072], [.008646283225794, .031095151600306], [.00854447846439, .031123279943448], [.008442582198486, .031151074981266], [.00834059551931, .031178536416098], [.008238519519057, .031205663953853], [.008136355290878, .031232457304017], [.008034103928871, .031258916179656], [.007931766528065, .031285040297416], [.007829344184412, .031310829377528], [.007726837994772, .031336283143813], [.007624249056906, .03136140132368], [.007521578469457, .031386183648135], [.007418827331946, .031410629851778], [.007315996744755, .031434739672811], [.007213087809115, .031458512853036], [.007110101627101, .031481949137863], [.00700703930161, .031505048276306], [.006903901936357, .031527810020993], [.006800690635862, .031550234128164], [.006697406505433, .031572320357675], [.006594050651161, .031594068473], [.006490624179905, .031615478241233], [.006387128199278, .031636549433095], [.006283563817639, .031657281822929], [.00617993214408, .031677675188707], [.006076234288412, .031697729312034], [.005972471361157, .031717443978146], [.005868644473532, .031736818975914], [.00576475473744, .031755854097848], [.005660803265456, .031774549140098], [.005556791170816, .031792903902453], [.005452719567407, .03181091818835], [.005348589569753, .031828591804869], [.005244402293001, .031845924562742], [.005140158852914, .031862916276347], [.005035860365855, .031879566763717], [.004931507948778, .031895875846539], [.004827102719212, .031911843350155], [.004722645795254, .031927469103567], [.004618138295554, .031942752939435], [.004513581339303, .031957694694082], [.004408976046222, .031972294207493], [.004304323536549, .03198655132332], [.00419962493103, .032000465888879], [.004094881350902, .032014037755158], [.003990093917884, .032027266776813], [.003885263754166, .03204015281217], [.003780391982394, .032052695723232], [.003675479725661, .032064895375674], [.003570528107494, .032076751638847], [.003465538251839, .03208826438578], [.003360511283053, .032099433493181], [.003255448325892, .032110258841438], [.003150350505494, .032120740314619], [.003045218947373, .032130877800478], [.002940054777404, .032140671190449], [.00283485912181, .032150120379653], [.002729633107153, .032159225266897], [.002624377860318, .032167985754674], [.002519094508504, .032176401749168], [.002413784179212, .03218447316025], [.002308448000231, .032192199901481], [.002203087099626, .032199581890114], [.002097702605728, .032206619047093], [.001992295647121, .032213311297057], [.001886867352628, .032219658568338], [.001781418851302, .03222566079296], [.00167595127241, .032231317906644], [.001570465745428, .032236629848809], [.001464963400018, .032241596562566], [.001359445366028, .032246217994727], [.00125391277347, .032250494095799], [.001148366752513, .03225442481999], [.001042808433471, .032258010125204], [.000937238946789, .032261249973045], [.00083165942303, .032264144328817], [.000726070992868, .032266693161525], [.000620474787068, .032268896443871], [.000514871936481, .032270754152261], [.00040926357203, .032272266266801], [.000303650824695, .032273432771295], [.000198034825504, .032274253653254], [92416705518e-15, .032274728903884]],
        t.MDCT_TABLE_240 = [[.091286604111815, .000298735779793], [.091247502481454, .002688238127538], [.091145864370807, .005075898091152], [.090981759437558, .00746007928776], [.09075530015103, .009839147718664], [.090466641715108, .012211472889198], [.090115981961863, .014575428926191], [.089703561215976, .016929395692256], [.089229662130024, .019271759896156], [.088694609490769, .02160091619847], [.088098769996564, .02391526831181], [.087442552006035, .026213230094844], [.086726405258214, .028493226639351], [.085950820564309, .030753695349588], [.085116329471329, .032993087013213], [.084223503897785, .035209866863042], [.083272955741727, .037402515628894], [.082265336461381, .039569530578832], [.08120133662867, .041709426549053], [.08008168545593, .043820736961749], [.078907150296148, .045902014830227], [.077678536117054, .047951833750597], [.076396684949434, .049968788879362], [.07506247531005, .051951497896226], [.073676821599542, .053898601951466], [.072240673475749, .055808766597225], [.070755015202858, .057680682702068], [.06922086497684, .059513067348201], [.067639274227625, .061304664710718], [.066011326898512, .063054246918278], [.064338138703282, .06476061489463], [.062620856361546, .066422599180399], [.060860656812842, .068039060734572], [.059058746410016, .069608891715145], [.05721636009245, .071131016238378], [.055334760539699, .072604391116154], [.053415237306106, .07402800657093], [.051459105937014, .075400886927784], [.049467707067153, .076722091283096], [.047442405501835, .077990714149396], [.045384589281588, .079205886075941], [.043295668730857, .080366774244592], [.041177075491445, .081472583040586], [.039030261541332, .08252255459781], [.036856698199564, .083515969318206], [.034657875117883, .084452146364948], [.032435299259796, .085330444129049], [.030190493867775, .086150260669096], [.027924997419306, .086911034123781], [.025640362572491, .087612243096981], [.023338155101933, .088253407015092], [.021019952825636, .08883408645639], [.018687344523641, .089353883452193], [.016341928849164, .089812441759604], [.013985313232951, .090209447105664], [.011619112781631, .09054462740274], [.009244949170797, .090817752935], [.006864449533597, .091028636515846], [.004479245345574, .091177133616206], [.002090971306534, .091263142463585]]
    }
    , function(e, t, r) {
        "use strict";
        function n(e) {
            switch (this.length = e) {
            case 64:
                this.roots = o(64);
                break;
            case 512:
                this.roots = i(512);
                break;
            case 60:
                this.roots = o(60);
                break;
            case 480:
                this.roots = i(480);
                break;
            default:
                throw new Error("unexpected FFT length: " + e)
            }
            this.rev = new Array(e);
            for (var t = 0; t < e; t++)
                this.rev[t] = new Float32Array(2);
            this.a = new Float32Array(2),
            this.b = new Float32Array(2),
            this.c = new Float32Array(2),
            this.d = new Float32Array(2),
            this.e1 = new Float32Array(2),
            this.e2 = new Float32Array(2)
        }
        function o(e) {
            for (var t = 2 * Math.PI / e, r = Math.cos(t), n = Math.sin(t), o = new Array(e), i = 0; i < e; i++)
                o[i] = new Float32Array(2);
            o[0][0] = 1;
            for (var a = o[0][1] = 0, s = 1; s < e; s++)
                o[s][0] = o[s - 1][0] * r + a * n,
                a = a * r - o[s - 1][0] * n,
                o[s][1] = -a;
            return o
        }
        function i(e) {
            for (var t = 2 * Math.PI / e, r = Math.cos(t), n = Math.sin(t), o = new Array(e), i = 0; i < e; i++)
                o[i] = new Float32Array(3);
            o[0][0] = 1,
            o[0][1] = 0,
            o[0][2] = 0;
            for (var a = 1; a < e; a++)
                o[a][0] = o[a - 1][0] * r + o[a - 1][2] * n,
                o[a][2] = o[a - 1][2] * r - o[a - 1][0] * n,
                o[a][1] = -o[a][2];
            return o
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }),
        n.prototype.process = function(e, t) {
            for (var r = this.length, n = t ? 2 : 1, o = t ? r : 1, i = this.rev, a = this.roots, s = 0, u = 0; u < r; u++) {
                i[u][0] = e[s][0],
                i[u][1] = e[s][1];
                for (var c = r >>> 1; c <= s && 0 < c; )
                    s -= c,
                    c >>= 1;
                s += c
            }
            for (var l = this.a, f = this.b, d = this.c, h = this.d, p = this.e1, m = this.e2, v = 0; v < r; v++)
                e[v][0] = i[v][0],
                e[v][1] = i[v][1];
            for (var y = 0; y < r; y += 4)
                l[0] = e[y][0] + e[y + 1][0],
                l[1] = e[y][1] + e[y + 1][1],
                f[0] = e[y + 2][0] + e[y + 3][0],
                f[1] = e[y + 2][1] + e[y + 3][1],
                d[0] = e[y][0] - e[y + 1][0],
                d[1] = e[y][1] - e[y + 1][1],
                h[0] = e[y + 2][0] - e[y + 3][0],
                h[1] = e[y + 2][1] - e[y + 3][1],
                e[y][0] = l[0] + f[0],
                e[y][1] = l[1] + f[1],
                e[y + 2][0] = l[0] - f[0],
                e[y + 2][1] = l[1] - f[1],
                p[0] = d[0] - h[1],
                p[1] = d[1] + h[0],
                m[0] = d[0] + h[1],
                m[1] = d[1] - h[0],
                e[y + 3][1] = t ? (e[y + 1][0] = m[0],
                e[y + 1][1] = m[1],
                e[y + 3][0] = p[0],
                p[1]) : (e[y + 1][0] = p[0],
                e[y + 1][1] = p[1],
                e[y + 3][0] = m[0],
                m[1]);
            for (var g = 4; g < r; g <<= 1)
                for (var w = g << 1, E = r / w, _ = 0; _ < r; _ += w)
                    for (var b = 0; b < g; b++) {
                        var N = b * E
                          , T = a[N][0]
                          , O = a[N][n]
                          , k = e[g + _ + b][0] * T - e[g + _ + b][1] * O
                          , S = e[g + _ + b][0] * O + e[g + _ + b][1] * T;
                        e[g + _ + b][0] = (e[_ + b][0] - k) * o,
                        e[g + _ + b][1] = (e[_ + b][1] - S) * o,
                        e[_ + b][0] = (e[_ + b][0] + k) * o,
                        e[_ + b][1] = (e[_ + b][1] + S) * o
                    }
        }
        ,
        t.default = n,
        e.exports = t.default
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = function() {
            function e(e, t) {
                for (var r = 0; r < t.length; r++) {
                    var n = t[r];
                    n.enumerable = n.enumerable || !1,
                    n.configurable = !0,
                    "value"in n && (n.writable = !0),
                    Object.defineProperty(e, n.key, n)
                }
            }
            return function(t, r, n) {
                return r && e(t.prototype, r),
                n && e(t, n),
                t
            }
        }()
          , o = a(r(24))
          , i = a(r(25));
        function a(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }
        var s = function(e) {
            function t(e) {
                !function(e, r) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this);
                var r = function(e, t) {
                    if (!e)
                        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return !t || "object" != typeof t && "function" != typeof t ? e : t
                }(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
                return r._webWorkerCallbackHandler = function(e) {
                    r._parseWebWorkerCallback.call(r, e.data)
                }
                ,
                r.options = e,
                r._actionCache = [],
                r.currentPts = 0,
                r.canPlay = !0,
                r.workerLoaded = !1,
                r.worker = new i.default,
                r.worker.addEventListener("message", r._webWorkerCallbackHandler),
                r
            }
            return function(e, t) {
                if ("function" != typeof t && null !== t)
                    throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }),
                t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }(t, o.default),
            n(t, [{
                key: "appendBuffer",
                value: function(e) {
                    this.workerLoaded ? this._postMessage("appendBuffer", e) : this._cacheAction({
                        cmd: "appendBuffer",
                        param: [e]
                    })
                }
            }, {
                key: "reset",
                value: function() {
                    this.currentPts = 0,
                    this.workerLoaded = !1,
                    this._actionCache = [],
                    this.destroy(),
                    this.worker = new i.default,
                    this.worker.addEventListener("message", this._webWorkerCallbackHandler)
                }
            }, {
                key: "decode",
                value: function(e) {
                    this.workerLoaded ? this._postMessage("decode", e) : this._cacheAction({
                        cmd: "decode",
                        param: [e]
                    })
                }
            }, {
                key: "getImageData",
                value: function(e) {
                    this._postMessage("getImageData", e)
                }
            }, {
                key: "destroy",
                value: function() {
                    this._postMessage("destroy"),
                    this.worker.removeEventListener("message", this._webWorkerCallbackHandler),
                    this.worker.terminate()
                }
            }, {
                key: "_postMessage",
                value: function(e, t) {
                    this.worker.postMessage({
                        cmd: e,
                        data: t
                    })
                }
            }, {
                key: "_cacheAction",
                value: function(e) {
                    this._actionCache.push(e)
                }
            }, {
                key: "_excuteCacheActions",
                value: function() {
                    var e = this;
                    this._actionCache.forEach(function(t) {
                        e[t.cmd].apply(e, function(e) {
                            if (Array.isArray(e)) {
                                for (var t = 0, r = Array(e.length); t < e.length; t++)
                                    r[t] = e[t];
                                return r
                            }
                            return Array.from(e)
                        }(t.param))
                    }),
                    this._actionCache = []
                }
            }, {
                key: "_parseWebWorkerCallback",
                value: function(e) {
                    switch (e.cmd) {
                    case "loaded":
                        this.workerLoaded = !0,
                        this._postMessage("init"),
                        this._excuteCacheActions();
                        break;
                    case "imageData":
                        this.currentPts = e.source.pts,
                        this.emit("data", e.source);
                        break;
                    case "statistics":
                        this.emit("statistics", e.source);
                        break;
                    case "bufferEmty":
                        this.canPlay = !1,
                        this.emit("waiting"),
                        this.emit("bufferEmty");
                        break;
                    case "bufferFull":
                        this.canPlay = !0,
                        this.emit("bufferFull");
                        break;
                    case "error":
                        this.emit("error", e.source);
                        break;
                    case "innerError":
                        this.emit("innerError", e.source)
                    }
                }
            }, {
                key: "currentTime",
                get: function() {
                    return this.currentPts
                }
            }]),
            t
        }();
        t.default = s,
        e.exports = t.default
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = function() {
            function e(e, t) {
                for (var r = 0; r < t.length; r++) {
                    var n = t[r];
                    n.enumerable = n.enumerable || !1,
                    n.configurable = !0,
                    "value"in n && (n.writable = !0),
                    Object.defineProperty(e, n.key, n)
                }
            }
            return function(t, r, n) {
                return r && e(t.prototype, r),
                n && e(t, n),
                t
            }
        }()
          , o = function() {
            function e() {
                !function(e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, e)
            }
            return n(e, [{
                key: "on",
                value: function(e, t) {
                    null == this.events && (this.events = {}),
                    null == this.events[e] && (this.events[e] = []),
                    this.events[e].push(t)
                }
            }, {
                key: "off",
                value: function(e, t) {
                    if (this.events && this.events[e]) {
                        var r = this.events[e].indexOf(t);
                        ~r && this.events[e].splice(r, 1)
                    }
                }
            }, {
                key: "once",
                value: function(e, t) {
                    this.on(e, function r() {
                        this.off(e, r);
                        for (var n = arguments.length, o = Array(n), i = 0; i < n; i++)
                            o[i] = arguments[i];
                        t.apply(this, o)
                    })
                }
            }, {
                key: "emit",
                value: function(e) {
                    if (this.events && this.events[e]) {
                        for (var t = arguments.length, r = Array(1 < t ? t - 1 : 0), n = 1; n < t; n++)
                            r[n - 1] = arguments[n];
                        var o = !0
                          , i = !1
                          , a = void 0;
                        try {
                            for (var s, u = this.events[e].slice()[Symbol.iterator](); !(o = (s = u.next()).done); o = !0)
                                s.value.apply(this, r)
                        } catch (e) {
                            i = !0,
                            a = e
                        } finally {
                            try {
                                !o && u.return && u.return()
                            } finally {
                                if (i)
                                    throw a
                            }
                        }
                    }
                }
            }]),
            e
        }();
        t.default = o,
        e.exports = t.default
    }
    , function(e, t, r) {
        e.exports = function() {
            return r(26)('!function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=3)}([function(e,t){},function(e,t){var r,n,o=e.exports={};function i(){throw new Error("setTimeout has not been defined")}function a(){throw new Error("clearTimeout has not been defined")}function s(e){if(r===setTimeout)return setTimeout(e,0);if((r===i||!r)&&setTimeout)return r=setTimeout,setTimeout(e,0);try{return r(e,0)}catch(t){try{return r.call(null,e,0)}catch(t){return r.call(this,e,0)}}}!function(){try{r="function"==typeof setTimeout?setTimeout:i}catch(e){r=i}try{n="function"==typeof clearTimeout?clearTimeout:a}catch(e){n=a}}();var u,c=[],l=!1,d=-1;function f(){l&&u&&(l=!1,u.length?c=u.concat(c):d=-1,c.length&&h())}function h(){if(!l){var e=s(f);l=!0;for(var t=c.length;t;){for(u=c,c=[];++d<t;)u&&u[d].run();d=-1,t=c.length}u=null,l=!1,function(e){if(n===clearTimeout)return clearTimeout(e);if((n===a||!n)&&clearTimeout)return n=clearTimeout,clearTimeout(e);try{n(e)}catch(t){try{return n.call(null,e)}catch(t){return n.call(this,e)}}}(e)}}function m(e,t){this.fun=e,this.array=t}function p(){}o.nextTick=function(e){var t=new Array(arguments.length-1);if(1<arguments.length)for(var r=1;r<arguments.length;r++)t[r-1]=arguments[r];c.push(new m(e,t)),1!==c.length||l||s(h)},m.prototype.run=function(){this.fun.apply(null,this.array)},o.title="browser",o.browser=!0,o.env={},o.argv=[],o.version="",o.versions={},o.on=p,o.addListener=p,o.once=p,o.off=p,o.removeListener=p,o.removeAllListeners=p,o.emit=p,o.prependListener=p,o.prependOnceListener=p,o.listeners=function(e){return[]},o.binding=function(e){throw new Error("process.binding is not supported")},o.cwd=function(){return"/"},o.chdir=function(e){throw new Error("process.chdir is not supported")},o.umask=function(){return 0}},function(e,t,r){(function(e){function r(e,t){for(var r=0,n=e.length-1;0<=n;n--){var o=e[n];"."===o?e.splice(n,1):".."===o?(e.splice(n,1),r++):r&&(e.splice(n,1),r--)}if(t)for(;r--;r)e.unshift("..");return e}var n=/^(\\/?|)([\\s\\S]*?)((?:\\.{1,2}|[^\\/]+?|)(\\.[^.\\/]*|))(?:[\\/]*)$/,o=function(e){return n.exec(e).slice(1)};function i(e,t){if(e.filter)return e.filter(t);for(var r=[],n=0;n<e.length;n++)t(e[n],n,e)&&r.push(e[n]);return r}t.resolve=function(){for(var t="",n=!1,o=arguments.length-1;-1<=o&&!n;o--){var a=0<=o?arguments[o]:e.cwd();if("string"!=typeof a)throw new TypeError("Arguments to path.resolve must be strings");a&&(t=a+"/"+t,n="/"===a.charAt(0))}return(n?"/":"")+(t=r(i(t.split("/"),function(e){return!!e}),!n).join("/"))||"."},t.normalize=function(e){var n=t.isAbsolute(e),o="/"===a(e,-1);return(e=r(i(e.split("/"),function(e){return!!e}),!n).join("/"))||n||(e="."),e&&o&&(e+="/"),(n?"/":"")+e},t.isAbsolute=function(e){return"/"===e.charAt(0)},t.join=function(){var e=Array.prototype.slice.call(arguments,0);return t.normalize(i(e,function(e,t){if("string"!=typeof e)throw new TypeError("Arguments to path.join must be strings");return e}).join("/"))},t.relative=function(e,r){function n(e){for(var t=0;t<e.length&&""===e[t];t++);for(var r=e.length-1;0<=r&&""===e[r];r--);return r<t?[]:e.slice(t,r-t+1)}e=t.resolve(e).substr(1),r=t.resolve(r).substr(1);for(var o=n(e.split("/")),i=n(r.split("/")),a=Math.min(o.length,i.length),s=a,u=0;u<a;u++)if(o[u]!==i[u]){s=u;break}var c=[];for(u=s;u<o.length;u++)c.push("..");return(c=c.concat(i.slice(s))).join("/")},t.sep="/",t.delimiter=":",t.dirname=function(e){var t=o(e),r=t[0],n=t[1];return r||n?(n&&(n=n.substr(0,n.length-1)),r+n):"."},t.basename=function(e,t){var r=o(e)[2];return t&&r.substr(-1*t.length)===t&&(r=r.substr(0,r.length-t.length)),r},t.extname=function(e){return o(e)[3]};var a="b"==="ab".substr(-1)?function(e,t,r){return e.substr(t,r)}:function(e,t,r){return t<0&&(t=e.length+t),e.substr(t,r)}}).call(this,r(1))},function(e,t,r){(function(t,n){var o=void 0!==o?o:{};o.locateFile=function(){return"https://g.alicdn.com/videox/mp4-h265/1.0.1/libffmpeg_worker.wasm"},o.printErr=function(e){self.postMessage({cmd:"innerError",source:e})},o.onRuntimeInitialized=function(){self.postMessage({cmd:"loaded"})};var i,a={};for(i in o)o.hasOwnProperty(i)&&(a[i]=o[i]);o.arguments=[],o.thisProgram="./this.program",o.quit=function(e,t){throw t},o.preRun=[];var s,u,c=!(o.postRun=[]),l=!1;if(c="object"==typeof window,l="function"==typeof importScripts,u="object"==typeof t&&!c&&!l,s=!c&&!u&&!l,o.ENVIRONMENT)throw new Error("Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -s ENVIRONMENT=web or -s ENVIRONMENT=node)");var d,f,h="";if(u)h=n+"/",o.read=function(e,t){var n;return d||(d=r(0)),f||(f=r(2)),e=f.normalize(e),n=d.readFileSync(e),t?n:n.toString()},o.readBinary=function(e){var t=o.read(e,!0);return t.buffer||(t=new Uint8Array(t)),g(t.buffer),t},1<t.argv.length&&(o.thisProgram=t.argv[1].replace(/\\\\/g,"/")),o.arguments=t.argv.slice(2),e.exports=o,t.on("uncaughtException",function(e){if(!(e instanceof Nt))throw e}),t.on("unhandledRejection",Dt),o.quit=function(e){t.exit(e)},o.inspect=function(){return"[Emscripten Module object]"};else if(s)"undefined"!=typeof read&&(o.read=function(e){return read(e)}),o.readBinary=function(e){var t;return"function"==typeof readbuffer?new Uint8Array(readbuffer(e)):(g("object"==typeof(t=read(e,"binary"))),t)},"undefined"!=typeof scriptArgs?o.arguments=scriptArgs:void 0!==arguments&&(o.arguments=arguments),"function"==typeof quit&&(o.quit=function(e){quit(e)});else{if(!c&&!l)throw new Error("environment detection error");l?h=self.location.href:document.currentScript&&(h=document.currentScript.src),h=0!==h.indexOf("blob:")?h.substr(0,h.lastIndexOf("/")+1):"",o.read=function(e){var t=new XMLHttpRequest;return t.open("GET",e,!1),t.send(null),t.responseText},l&&(o.readBinary=function(e){var t=new XMLHttpRequest;return t.open("GET",e,!1),t.responseType="arraybuffer",t.send(null),new Uint8Array(t.response)}),o.readAsync=function(e,t,r){var n=new XMLHttpRequest;n.open("GET",e,!0),n.responseType="arraybuffer",n.onload=function(){200==n.status||0==n.status&&n.response?t(n.response):r()},n.onerror=r,n.send(null)},o.setWindowTitle=function(e){document.title=e}}var m=o.print||("undefined"!=typeof console?console.log.bind(console):"undefined"!=typeof print?print:null),p=o.printErr||("undefined"!=typeof printErr?printErr:"undefined"!=typeof console&&console.warn.bind(console)||m);for(i in a)a.hasOwnProperty(i)&&(o[i]=a[i]);function w(e){w.shown||(w.shown={}),w.shown[e]||(w.shown[e]=1,p(e))}g((a=void 0)===o.memoryInitializerPrefixURL,"Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead"),g(void 0===o.pthreadMainPrefixURL,"Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead"),g(void 0===o.cdInitializerPrefixURL,"Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead"),g(void 0===o.filePackagePrefixURL,"Module.filePackagePrefixURL option was removed, use Module.locateFile instead"),Ot=bt=Tt=function(){Dt("cannot use the stack before compiled code is ready to run, and has provided stack access")};var E={"f64-rem":function(e,t){return e%t},debugger:function(){}},y=(new Array(0),!1);function g(e,t){e||Dt("Assertion failed: "+t)}var _={stackSave:function(){Ot()},stackRestore:function(){bt()},arrayToC:function(e){var t=Tt(e.length);return $(e,t),t},stringToC:function(e){var t=0;if(null!=e&&0!==e){var r=1+(e.length<<2);x(e,t=Tt(r),r)}return t}},v={string:_.stringToC,array:_.arrayToC};function T(e,t,r,n){return function(){return function(e,t,r,n,i){var a,s,u=(g(s=o["_"+(a=e)],"Cannot call unknown function "+a+", make sure it is exported"),s),c=[],l=0;if(g("array"!==t,\'Return type should not be "array".\'),n)for(var d=0;d<n.length;d++){var f=v[r[d]];c[d]=f?(0===l&&(l=Ot()),f(n[d])):n[d]}var h,m=u.apply(null,c);return h=m,m="string"===t?function(e,t){if(0===t||!e)return"";for(var r,n=0,o=0;g(e+o<Q),n|=r=R[e+o>>0],(0!=r||t)&&(o++,!t||o!=t););t||(t=o);var i="";if(n<128){for(var a;0<t;)a=String.fromCharCode.apply(String,R.subarray(e,e+Math.min(t,1024))),i=i?i+a:a,e+=1024,t-=1024;return i}return k(e)}(h):"boolean"===t?Boolean(h):h,0!==l&&bt(l),m}(e,t,r,arguments)}}function b(e){return Z?vt(e):function(e){g(z);var t=D[z>>2],r=t+e+15&-16;if(r<=Fe())D[z>>2]=r;else if(!xe(r))return 0;return t}(e)}var O,N,R,S,D,A,M="undefined"!=typeof TextDecoder?new TextDecoder("utf8"):void 0;function I(e,t){for(var r=t;e[r];)++r;if(16<r-t&&e.subarray&&M)return M.decode(e.subarray(t,r));for(var n="";;){var o=e[t++];if(!o)return n;if(128&o){var i=63&e[t++];if(192!=(224&o)){var a=63&e[t++];if((o=224==(240&o)?(15&o)<<12|i<<6|a:(240!=(248&o)&&w("Invalid UTF-8 leading byte 0x"+o.toString(16)+" encountered when deserializing a UTF-8 string on the asm.js/wasm heap to a JS string!"),(7&o)<<18|i<<12|a<<6|63&e[t++]))<65536)n+=String.fromCharCode(o);else{var s=o-65536;n+=String.fromCharCode(55296|s>>10,56320|1023&s)}}else n+=String.fromCharCode((31&o)<<6|i)}else n+=String.fromCharCode(o)}}function k(e){return I(R,e)}function F(e,t,r,n){if(!(0<n))return 0;for(var o=r,i=r+n-1,a=0;a<e.length;++a){var s=e.charCodeAt(a);if(55296<=s&&s<=57343&&(s=65536+((1023&s)<<10)|1023&e.charCodeAt(++a)),s<=127){if(i<=r)break;t[r++]=s}else if(s<=2047){if(i<=r+1)break;t[r++]=192|s>>6,t[r++]=128|63&s}else if(s<=65535){if(i<=r+2)break;t[r++]=224|s>>12,t[r++]=128|s>>6&63,t[r++]=128|63&s}else{if(i<=r+3)break;2097152<=s&&w("Invalid Unicode code point 0x"+s.toString(16)+" encountered when serializing a JS string to an UTF-8 string on the asm.js/wasm heap! (Valid unicode code points should be in range 0-0x1FFFFF)."),t[r++]=240|s>>18,t[r++]=128|s>>12&63,t[r++]=128|s>>6&63,t[r++]=128|63&s}}return t[r]=0,r-o}function x(e,t,r){return g("number"==typeof r,"stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!"),F(e,R,t,r)}function P(e){for(var t=0,r=0;r<e.length;++r){var n=e.charCodeAt(r);55296<=n&&n<=57343&&(n=65536+((1023&n)<<10)|1023&e.charCodeAt(++r)),n<=127?++t:t+=n<=2047?2:n<=65535?3:n<=2097151?4:n<=67108863?5:6}return t}function U(e){return e.replace(/__Z[\\w\\d_]+/g,function(e){var t,r=(t=e,w("warning: build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling"),t);return e===r?e:r+" ["+e+"]"})}function L(){var e=function(){var e=new Error;if(!e.stack){try{throw new Error(0)}catch(t){e=t}if(!e.stack)return"(no stack trace available)"}return e.stack.toString()}();return o.extraStackTrace&&(e+="\\n"+o.extraStackTrace()),U(e)}function X(e,t){return 0<e%t&&(e+=t-e%t),e}function C(e){o.buffer=O=e}function B(){o.HEAP8=N=new Int8Array(O),o.HEAP16=S=new Int16Array(O),o.HEAP32=D=new Int32Array(O),o.HEAPU8=R=new Uint8Array(O),o.HEAPU16=new Uint16Array(O),o.HEAPU32=A=new Uint32Array(O),o.HEAPF32=new Float32Array(O),o.HEAPF64=new Float64Array(O)}"undefined"!=typeof TextDecoder&&new TextDecoder("utf-16le");var H=5470800,z=227664;function j(){if(34821223==A[(H>>2)-1]&&2310721022==A[(H>>2)-2]||Dt("Stack overflow! Stack cookie has been overwritten, expected hex dwords 0x89BACDFE and 0x02135467, but received 0x"+A[(H>>2)-2].toString(16)+" "+A[(H>>2)-1].toString(16)),1668509029!==D[0])throw"Runtime error: The application has corrupted its heap memory area (address zero)!"}g(!0,"stack must start aligned"),g(!0,"heap must start aligned");try{Function.prototype.call.bind(Object.getOwnPropertyDescriptor(ArrayBuffer.prototype,"byteLength").get)(new ArrayBuffer(4))}catch(n){}var W=5242880;o.TOTAL_STACK&&g(W===o.TOTAL_STACK,"the stack size can no longer be determined at runtime");var Q=o.TOTAL_MEMORY||134217728;if(Q<W&&p("TOTAL_MEMORY should be larger than TOTAL_STACK, was "+Q+"! (TOTAL_STACK="+W+")"),g("undefined"!=typeof Int32Array&&"undefined"!=typeof Float64Array&&void 0!==Int32Array.prototype.subarray&&void 0!==Int32Array.prototype.set,"JS engine does not provide full typed array support"),o.buffer?g((O=o.buffer).byteLength===Q,"provided buffer should be "+Q+" bytes, but it is "+O.byteLength):(g((O="object"==typeof WebAssembly&&"function"==typeof WebAssembly.Memory?(g(Q%65536==0),o.wasmMemory=new WebAssembly.Memory({initial:Q/65536}),o.wasmMemory.buffer):new ArrayBuffer(Q)).byteLength===Q),o.buffer=O),B(),D[z>>2]=5470800,D[0]=1668509029,S[1]=25459,115!==R[2]||99!==R[3])throw"Runtime error: expected the system to be little-endian!";function Y(e){for(;0<e.length;){var t=e.shift();if("function"!=typeof t){var r=t.func;"number"==typeof r?void 0===t.arg?o.dynCall_v(r):o.dynCall_vi(r,t.arg):r(void 0===t.arg?null:t.arg)}else t()}}var V=[],G=[],q=[],K=[],J=[],Z=!1;function $(e,t){g(0<=e.length,"writeArrayToMemory array must have a length (should be an array or typed array)"),N.set(e,t)}function ee(e,t,r){for(var n=0;n<e.length;++n)g(e.charCodeAt(n)==e.charCodeAt(n)&255),N[t++>>0]=e.charCodeAt(n);r||(N[t>>0]=0)}g(Math.imul,"This browser does not support Math.imul(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill"),g(Math.fround,"This browser does not support Math.fround(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill"),g(Math.clz32,"This browser does not support Math.clz32(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill"),g(Math.trunc,"This browser does not support Math.trunc(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");var te=Math.abs,re=Math.trunc,ne=0,oe=null,ie=null,ae={};function se(e){ne++,o.monitorRunDependencies&&o.monitorRunDependencies(ne),e?(g(!ae[e]),ae[e]=1,null===oe&&"undefined"!=typeof setInterval&&(oe=setInterval(function(){if(y)return clearInterval(oe),void(oe=null);var e=!1;for(var t in ae)e||(e=!0,p("still waiting on run dependencies:")),p("dependency: "+t);e&&p("(end of list)")},1e4))):p("warning: run dependency added without ID")}function ue(e){if(ne--,o.monitorRunDependencies&&o.monitorRunDependencies(ne),e?(g(ae[e]),delete ae[e]):p("warning: run dependency removed without ID"),0==ne&&(null!==oe&&(clearInterval(oe),oe=null),ie)){var t=ie;ie=null,t()}}o.preloadedImages={},o.preloadedAudios={};var ce="data:application/octet-stream;base64,";function le(e){return String.prototype.startsWith?e.startsWith(ce):0===e.indexOf(ce)}var de,fe="libffmpeg_worker.wasm";function he(){try{if(o.wasmBinary)return new Uint8Array(o.wasmBinary);if(o.readBinary)return o.readBinary(fe);throw"both async and sync fetching of the wasm failed"}catch(e){Dt(e)}}le(fe)||(de=fe,fe=o.locateFile?o.locateFile(de,h):h+de),o.reallocBuffer=function(e){return function(e){e=X(e,65536);var t=o.buffer.byteLength;try{return-1!==o.wasmMemory.grow((e-t)/65536)?o.buffer=o.wasmMemory.buffer:null}catch(r){return console.error("Module.reallocBuffer: Attempted to grow from "+t+" bytes to "+e+" bytes, but got error: "+r),null}}(e)},o.asm=function(e,t,r){if(!t.table){g(void 0!==o.wasmTableSize);var n=o.wasmTableSize,i=o.wasmMaxTableSize;"object"==typeof WebAssembly&&"function"==typeof WebAssembly.Table?t.table=void 0!==i?new WebAssembly.Table({initial:n,maximum:i,element:"anyfunc"}):new WebAssembly.Table({initial:n,element:"anyfunc"}):t.table=new Array(n),o.wasmTable=t.table}t.__memory_base||(t.__memory_base=o.STATIC_BASE),t.__table_base||(t.__table_base=0);var a=function(e){if("object"!=typeof WebAssembly)return Dt("No WebAssembly support found. Build with -s WASM=0 to target JavaScript instead."),p("no native wasm support detected"),!1;if(!(o.wasmMemory instanceof WebAssembly.Memory))return p("no native wasm Memory in use"),!1;e.memory=o.wasmMemory;var t={global:{NaN:NaN,Infinity:1/0},"global.Math":Math,env:e,asm2wasm:E,parent:o};function r(e,t){var r=e.exports;r.memory&&function(e){var t=o.buffer;e.byteLength<t.byteLength&&p("the new buffer in mergeMemory is smaller than the previous one. in native wasm, we should grow memory here");var r=new Int8Array(t);new Int8Array(e).set(r),C(e),B()}(r.memory),o.asm=r,ue("wasm-instantiate")}if(se("wasm-instantiate"),o.instantiateWasm)try{return o.instantiateWasm(t,r)}catch(e){return p("Module.instantiateWasm callback failed with error: "+e),!1}var n=o;function i(e){g(o===n,"the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?"),n=null,r(e.instance)}function a(e){(o.wasmBinary||!c&&!l||"function"!=typeof fetch?new Promise(function(e,t){e(he())}):fetch(fe,{credentials:"same-origin"}).then(function(e){if(!e.ok)throw"failed to load wasm binary file at \'"+fe+"\'";return e.arrayBuffer()}).catch(function(){return he()})).then(function(e){return WebAssembly.instantiate(e,t)}).then(e,function(e){p("failed to asynchronously prepare wasm: "+e),Dt(e)})}return o.wasmBinary||"function"!=typeof WebAssembly.instantiateStreaming||le(fe)||"function"!=typeof fetch?a(i):WebAssembly.instantiateStreaming(fetch(fe,{credentials:"same-origin"}),t).then(i,function(e){p("wasm streaming compile failed: "+e),p("falling back to ArrayBuffer instantiation"),a(i)}),{}}(t);return g(a,"binaryen setup failed (no wasm support?)"),a};var me=[function(e,t,r,n,o){self.imageDataCallback(e,t,r,n,o)}];G.push({func:function(){gt()}}),o.STATIC_BASE=1024,o.STATIC_BUMP=226896,g(!0);var pe={};function we(e){return o.___errno_location?D[o.___errno_location()>>2]=e:p("failed to set errno from JS"),e}var Ee={splitPath:function(e){return/^(\\/?|)([\\s\\S]*?)((?:\\.{1,2}|[^\\/]+?|)(\\.[^.\\/]*|))(?:[\\/]*)$/.exec(e).slice(1)},normalizeArray:function(e,t){for(var r=0,n=e.length-1;0<=n;n--){var o=e[n];"."===o?e.splice(n,1):".."===o?(e.splice(n,1),r++):r&&(e.splice(n,1),r--)}if(t)for(;r;r--)e.unshift("..");return e},normalize:function(e){var t="/"===e.charAt(0),r="/"===e.substr(-1);return(e=Ee.normalizeArray(e.split("/").filter(function(e){return!!e}),!t).join("/"))||t||(e="."),e&&r&&(e+="/"),(t?"/":"")+e},dirname:function(e){var t=Ee.splitPath(e),r=t[0],n=t[1];return r||n?(n&&(n=n.substr(0,n.length-1)),r+n):"."},basename:function(e){if("/"===e)return"/";var t=e.lastIndexOf("/");return-1===t?e:e.substr(t+1)},extname:function(e){return Ee.splitPath(e)[3]},join:function(){var e=Array.prototype.slice.call(arguments,0);return Ee.normalize(e.join("/"))},join2:function(e,t){return Ee.normalize(e+"/"+t)},resolve:function(){for(var e="",t=!1,r=arguments.length-1;-1<=r&&!t;r--){var n=0<=r?arguments[r]:Ne.cwd();if("string"!=typeof n)throw new TypeError("Arguments to path.resolve must be strings");if(!n)return"";e=n+"/"+e,t="/"===n.charAt(0)}return(t?"/":"")+(e=Ee.normalizeArray(e.split("/").filter(function(e){return!!e}),!t).join("/"))||"."},relative:function(e,t){function r(e){for(var t=0;t<e.length&&""===e[t];t++);for(var r=e.length-1;0<=r&&""===e[r];r--);return r<t?[]:e.slice(t,r-t+1)}e=Ee.resolve(e).substr(1),t=Ee.resolve(t).substr(1);for(var n=r(e.split("/")),o=r(t.split("/")),i=Math.min(n.length,o.length),a=i,s=0;s<i;s++)if(n[s]!==o[s]){a=s;break}var u=[];for(s=a;s<n.length;s++)u.push("..");return(u=u.concat(o.slice(a))).join("/")}},ye={ttys:[],init:function(){},shutdown:function(){},register:function(e,t){ye.ttys[e]={input:[],output:[],ops:t},Ne.registerDevice(e,ye.stream_ops)},stream_ops:{open:function(e){var t=ye.ttys[e.node.rdev];if(!t)throw new Ne.ErrnoError(Oe.ENODEV);e.tty=t,e.seekable=!1},close:function(e){e.tty.ops.flush(e.tty)},flush:function(e){e.tty.ops.flush(e.tty)},read:function(e,t,r,n,o){if(!e.tty||!e.tty.ops.get_char)throw new Ne.ErrnoError(Oe.ENXIO);for(var i=0,a=0;a<n;a++){var s;try{s=e.tty.ops.get_char(e.tty)}catch(e){throw new Ne.ErrnoError(Oe.EIO)}if(void 0===s&&0===i)throw new Ne.ErrnoError(Oe.EAGAIN);if(null==s)break;i++,t[r+a]=s}return i&&(e.node.timestamp=Date.now()),i},write:function(e,t,r,n,o){if(!e.tty||!e.tty.ops.put_char)throw new Ne.ErrnoError(Oe.ENXIO);try{for(var i=0;i<n;i++)e.tty.ops.put_char(e.tty,t[r+i])}catch(e){throw new Ne.ErrnoError(Oe.EIO)}return n&&(e.node.timestamp=Date.now()),i}},default_tty_ops:{get_char:function(e){if(!e.input.length){var r=null;if(u){var n=new Buffer(256),o=0,i="win32"!=t.platform,a=t.stdin.fd;if(i){var s=!1;try{a=Be.openSync("/dev/stdin","r"),s=!0}catch(e){}}try{o=Be.readSync(a,n,0,256,null)}catch(e){if(-1==e.toString().indexOf("EOF"))throw e;o=0}s&&Be.closeSync(a),r=0<o?n.slice(0,o).toString("utf-8"):null}else"undefined"!=typeof window&&"function"==typeof window.prompt?null!==(r=window.prompt("Input: "))&&(r+="\\n"):"function"==typeof readline&&null!==(r=readline())&&(r+="\\n");if(!r)return null;e.input=ze(r,!0)}return e.input.shift()},put_char:function(e,t){null===t||10===t?(m(I(e.output,0)),e.output=[]):0!=t&&e.output.push(t)},flush:function(e){e.output&&0<e.output.length&&(m(I(e.output,0)),e.output=[])}},default_tty1_ops:{put_char:function(e,t){null===t||10===t?(p(I(e.output,0)),e.output=[]):0!=t&&e.output.push(t)},flush:function(e){e.output&&0<e.output.length&&(p(I(e.output,0)),e.output=[])}}},ge={ops_table:null,mount:function(e){return ge.createNode(null,"/",16895,0)},createNode:function(e,t,r,n){if(Ne.isBlkdev(r)||Ne.isFIFO(r))throw new Ne.ErrnoError(Oe.EPERM);ge.ops_table||(ge.ops_table={dir:{node:{getattr:ge.node_ops.getattr,setattr:ge.node_ops.setattr,lookup:ge.node_ops.lookup,mknod:ge.node_ops.mknod,rename:ge.node_ops.rename,unlink:ge.node_ops.unlink,rmdir:ge.node_ops.rmdir,readdir:ge.node_ops.readdir,symlink:ge.node_ops.symlink},stream:{llseek:ge.stream_ops.llseek}},file:{node:{getattr:ge.node_ops.getattr,setattr:ge.node_ops.setattr},stream:{llseek:ge.stream_ops.llseek,read:ge.stream_ops.read,write:ge.stream_ops.write,allocate:ge.stream_ops.allocate,mmap:ge.stream_ops.mmap,msync:ge.stream_ops.msync}},link:{node:{getattr:ge.node_ops.getattr,setattr:ge.node_ops.setattr,readlink:ge.node_ops.readlink},stream:{}},chrdev:{node:{getattr:ge.node_ops.getattr,setattr:ge.node_ops.setattr},stream:Ne.chrdev_stream_ops}});var o=Ne.createNode(e,t,r,n);return Ne.isDir(o.mode)?(o.node_ops=ge.ops_table.dir.node,o.stream_ops=ge.ops_table.dir.stream,o.contents={}):Ne.isFile(o.mode)?(o.node_ops=ge.ops_table.file.node,o.stream_ops=ge.ops_table.file.stream,o.usedBytes=0,o.contents=null):Ne.isLink(o.mode)?(o.node_ops=ge.ops_table.link.node,o.stream_ops=ge.ops_table.link.stream):Ne.isChrdev(o.mode)&&(o.node_ops=ge.ops_table.chrdev.node,o.stream_ops=ge.ops_table.chrdev.stream),o.timestamp=Date.now(),e&&(e.contents[t]=o),o},getFileDataAsRegularArray:function(e){if(e.contents&&e.contents.subarray){for(var t=[],r=0;r<e.usedBytes;++r)t.push(e.contents[r]);return t}return e.contents},getFileDataAsTypedArray:function(e){return e.contents?e.contents.subarray?e.contents.subarray(0,e.usedBytes):new Uint8Array(e.contents):new Uint8Array},expandFileStorage:function(e,t){if(e.contents&&e.contents.subarray&&t>e.contents.length&&(e.contents=ge.getFileDataAsRegularArray(e),e.usedBytes=e.contents.length),!e.contents||e.contents.subarray){var r=e.contents?e.contents.length:0;if(t<=r)return;t=Math.max(t,r*(r<1048576?2:1.125)|0),0!=r&&(t=Math.max(t,256));var n=e.contents;return e.contents=new Uint8Array(t),void(0<e.usedBytes&&e.contents.set(n.subarray(0,e.usedBytes),0))}for(!e.contents&&0<t&&(e.contents=[]);e.contents.length<t;)e.contents.push(0)},resizeFileStorage:function(e,t){if(e.usedBytes!=t){if(0==t)return e.contents=null,void(e.usedBytes=0);if(!e.contents||e.contents.subarray){var r=e.contents;return e.contents=new Uint8Array(new ArrayBuffer(t)),r&&e.contents.set(r.subarray(0,Math.min(t,e.usedBytes))),void(e.usedBytes=t)}if(e.contents||(e.contents=[]),e.contents.length>t)e.contents.length=t;else for(;e.contents.length<t;)e.contents.push(0);e.usedBytes=t}},node_ops:{getattr:function(e){var t={};return t.dev=Ne.isChrdev(e.mode)?e.id:1,t.ino=e.id,t.mode=e.mode,t.nlink=1,t.uid=0,t.gid=0,t.rdev=e.rdev,Ne.isDir(e.mode)?t.size=4096:Ne.isFile(e.mode)?t.size=e.usedBytes:Ne.isLink(e.mode)?t.size=e.link.length:t.size=0,t.atime=new Date(e.timestamp),t.mtime=new Date(e.timestamp),t.ctime=new Date(e.timestamp),t.blksize=4096,t.blocks=Math.ceil(t.size/t.blksize),t},setattr:function(e,t){void 0!==t.mode&&(e.mode=t.mode),void 0!==t.timestamp&&(e.timestamp=t.timestamp),void 0!==t.size&&ge.resizeFileStorage(e,t.size)},lookup:function(e,t){throw Ne.genericErrors[Oe.ENOENT]},mknod:function(e,t,r,n){return ge.createNode(e,t,r,n)},rename:function(e,t,r){if(Ne.isDir(e.mode)){var n;try{n=Ne.lookupNode(t,r)}catch(e){}if(n)for(var o in n.contents)throw new Ne.ErrnoError(Oe.ENOTEMPTY)}delete e.parent.contents[e.name],e.name=r,(t.contents[r]=e).parent=t},unlink:function(e,t){delete e.contents[t]},rmdir:function(e,t){var r=Ne.lookupNode(e,t);for(var n in r.contents)throw new Ne.ErrnoError(Oe.ENOTEMPTY);delete e.contents[t]},readdir:function(e){var t=[".",".."];for(var r in e.contents)e.contents.hasOwnProperty(r)&&t.push(r);return t},symlink:function(e,t,r){var n=ge.createNode(e,t,41471,0);return n.link=r,n},readlink:function(e){if(!Ne.isLink(e.mode))throw new Ne.ErrnoError(Oe.EINVAL);return e.link}},stream_ops:{read:function(e,t,r,n,o){var i=e.node.contents;if(o>=e.node.usedBytes)return 0;var a=Math.min(e.node.usedBytes-o,n);if(g(0<=a),8<a&&i.subarray)t.set(i.subarray(o,o+a),r);else for(var s=0;s<a;s++)t[r+s]=i[o+s];return a},write:function(e,t,r,n,o,i){if(i&&w("file packager has copied file data into memory, but in memory growth we are forced to copy it again (see --no-heap-copy)"),i=!1,!n)return 0;var a=e.node;if(a.timestamp=Date.now(),t.subarray&&(!a.contents||a.contents.subarray)){if(i)return g(0===o,"canOwn must imply no weird position inside the file"),a.contents=t.subarray(r,r+n),a.usedBytes=n;if(0===a.usedBytes&&0===o)return a.contents=new Uint8Array(t.subarray(r,r+n)),a.usedBytes=n;if(o+n<=a.usedBytes)return a.contents.set(t.subarray(r,r+n),o),n}if(ge.expandFileStorage(a,o+n),a.contents.subarray&&t.subarray)a.contents.set(t.subarray(r,r+n),o);else for(var s=0;s<n;s++)a.contents[o+s]=t[r+s];return a.usedBytes=Math.max(a.usedBytes,o+n),n},llseek:function(e,t,r){var n=t;if(1===r?n+=e.position:2===r&&Ne.isFile(e.node.mode)&&(n+=e.node.usedBytes),n<0)throw new Ne.ErrnoError(Oe.EINVAL);return n},allocate:function(e,t,r){ge.expandFileStorage(e.node,t+r),e.node.usedBytes=Math.max(e.node.usedBytes,t+r)},mmap:function(e,t,r,n,o,i,a){if(!Ne.isFile(e.node.mode))throw new Ne.ErrnoError(Oe.ENODEV);var s,u,c=e.node.contents;if(2&a||c.buffer!==t&&c.buffer!==t.buffer){if((0<o||o+n<e.node.usedBytes)&&(c=c.subarray?c.subarray(o,o+n):Array.prototype.slice.call(c,o,o+n)),u=!0,!(s=vt(n)))throw new Ne.ErrnoError(Oe.ENOMEM);t.set(c,s)}else u=!1,s=c.byteOffset;return{ptr:s,allocated:u}},msync:function(e,t,r,n,o){if(!Ne.isFile(e.node.mode))throw new Ne.ErrnoError(Oe.ENODEV);return 2&o?0:(ge.stream_ops.write(e,t,0,n,r,!1),0)}}},_e={dbs:{},indexedDB:function(){if("undefined"!=typeof indexedDB)return indexedDB;var e=null;return"object"==typeof window&&(e=window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB),g(e,"IDBFS used, but indexedDB not supported"),e},DB_VERSION:21,DB_STORE_NAME:"FILE_DATA",mount:function(e){return ge.mount.apply(null,arguments)},syncfs:function(e,t,r){_e.getLocalSet(e,function(n,o){if(n)return r(n);_e.getRemoteSet(e,function(e,n){if(e)return r(e);var i=t?n:o,a=t?o:n;_e.reconcile(i,a,r)})})},getDB:function(e,t){var r,n=_e.dbs[e];if(n)return t(null,n);try{r=_e.indexedDB().open(e,_e.DB_VERSION)}catch(e){return t(e)}if(!r)return t("Unable to connect to IndexedDB");r.onupgradeneeded=function(e){var t,r=e.target.result,n=e.target.transaction;(t=r.objectStoreNames.contains(_e.DB_STORE_NAME)?n.objectStore(_e.DB_STORE_NAME):r.createObjectStore(_e.DB_STORE_NAME)).indexNames.contains("timestamp")||t.createIndex("timestamp","timestamp",{unique:!1})},r.onsuccess=function(){n=r.result,_e.dbs[e]=n,t(null,n)},r.onerror=function(e){t(this.error),e.preventDefault()}},getLocalSet:function(e,t){var r={};function n(e){return"."!==e&&".."!==e}function o(e){return function(t){return Ee.join2(e,t)}}for(var i=Ne.readdir(e.mountpoint).filter(n).map(o(e.mountpoint));i.length;){var a,s=i.pop();try{a=Ne.stat(s)}catch(e){return t(e)}Ne.isDir(a.mode)&&i.push.apply(i,Ne.readdir(s).filter(n).map(o(s))),r[s]={timestamp:a.mtime}}return t(null,{type:"local",entries:r})},getRemoteSet:function(e,t){var r={};_e.getDB(e.mountpoint,function(e,n){if(e)return t(e);try{var o=n.transaction([_e.DB_STORE_NAME],"readonly");o.onerror=function(e){t(this.error),e.preventDefault()},o.objectStore(_e.DB_STORE_NAME).index("timestamp").openKeyCursor().onsuccess=function(e){var o=e.target.result;if(!o)return t(null,{type:"remote",db:n,entries:r});r[o.primaryKey]={timestamp:o.key},o.continue()}}catch(e){return t(e)}})},loadLocalEntry:function(e,t){var r,n;try{n=Ne.lookupPath(e).node,r=Ne.stat(e)}catch(e){return t(e)}return Ne.isDir(r.mode)?t(null,{timestamp:r.mtime,mode:r.mode}):Ne.isFile(r.mode)?(n.contents=ge.getFileDataAsTypedArray(n),t(null,{timestamp:r.mtime,mode:r.mode,contents:n.contents})):t(new Error("node type not supported"))},storeLocalEntry:function(e,t,r){try{if(Ne.isDir(t.mode))Ne.mkdir(e,t.mode);else{if(!Ne.isFile(t.mode))return r(new Error("node type not supported"));Ne.writeFile(e,t.contents,{canOwn:!0})}Ne.chmod(e,t.mode),Ne.utime(e,t.timestamp,t.timestamp)}catch(e){return r(e)}r(null)},removeLocalEntry:function(e,t){try{Ne.lookupPath(e);var r=Ne.stat(e);Ne.isDir(r.mode)?Ne.rmdir(e):Ne.isFile(r.mode)&&Ne.unlink(e)}catch(e){return t(e)}t(null)},loadRemoteEntry:function(e,t,r){var n=e.get(t);n.onsuccess=function(e){r(null,e.target.result)},n.onerror=function(e){r(this.error),e.preventDefault()}},storeRemoteEntry:function(e,t,r,n){var o=e.put(r,t);o.onsuccess=function(){n(null)},o.onerror=function(e){n(this.error),e.preventDefault()}},removeRemoteEntry:function(e,t,r){var n=e.delete(t);n.onsuccess=function(){r(null)},n.onerror=function(e){r(this.error),e.preventDefault()}},reconcile:function(e,t,r){var n=0,o=[];Object.keys(e.entries).forEach(function(r){var i=e.entries[r],a=t.entries[r];(!a||i.timestamp>a.timestamp)&&(o.push(r),n++)});var i=[];if(Object.keys(t.entries).forEach(function(r){t.entries[r],e.entries[r]||(i.push(r),n++)}),!n)return r(null);var a=0,s=("remote"===e.type?e.db:t.db).transaction([_e.DB_STORE_NAME],"readwrite"),u=s.objectStore(_e.DB_STORE_NAME);function c(e){return e?c.errored?void 0:(c.errored=!0,r(e)):++a>=n?r(null):void 0}s.onerror=function(e){c(this.error),e.preventDefault()},o.sort().forEach(function(e){"local"===t.type?_e.loadRemoteEntry(u,e,function(t,r){if(t)return c(t);_e.storeLocalEntry(e,r,c)}):_e.loadLocalEntry(e,function(t,r){if(t)return c(t);_e.storeRemoteEntry(u,e,r,c)})}),i.sort().reverse().forEach(function(e){"local"===t.type?_e.removeLocalEntry(e,c):_e.removeRemoteEntry(u,e,c)})}},ve={isWindows:!1,staticInit:function(){ve.isWindows=!!t.platform.match(/^win/);var e=t.binding("constants");e.fs&&(e=e.fs),ve.flagsForNodeMap={1024:e.O_APPEND,64:e.O_CREAT,128:e.O_EXCL,0:e.O_RDONLY,2:e.O_RDWR,4096:e.O_SYNC,512:e.O_TRUNC,1:e.O_WRONLY}},bufferFrom:function(e){return Buffer.alloc?Buffer.from(e):new Buffer(e)},mount:function(e){return g(u),ve.createNode(null,"/",ve.getMode(e.opts.root),0)},createNode:function(e,t,r,n){if(!Ne.isDir(r)&&!Ne.isFile(r)&&!Ne.isLink(r))throw new Ne.ErrnoError(Oe.EINVAL);var o=Ne.createNode(e,t,r);return o.node_ops=ve.node_ops,o.stream_ops=ve.stream_ops,o},getMode:function(e){var t;try{t=Be.lstatSync(e),ve.isWindows&&(t.mode=t.mode|(292&t.mode)>>2)}catch(e){if(!e.code)throw e;throw new Ne.ErrnoError(Oe[e.code])}return t.mode},realPath:function(e){for(var t=[];e.parent!==e;)t.push(e.name),e=e.parent;return t.push(e.mount.opts.root),t.reverse(),Ee.join.apply(null,t)},flagsForNode:function(e){e&=-2097153,e&=-2049,e&=-32769,e&=-524289;var t=0;for(var r in ve.flagsForNodeMap)e&r&&(t|=ve.flagsForNodeMap[r],e^=r);if(e)throw new Ne.ErrnoError(Oe.EINVAL);return t},node_ops:{getattr:function(e){var t,r=ve.realPath(e);try{t=Be.lstatSync(r)}catch(e){if(!e.code)throw e;throw new Ne.ErrnoError(Oe[e.code])}return ve.isWindows&&!t.blksize&&(t.blksize=4096),ve.isWindows&&!t.blocks&&(t.blocks=(t.size+t.blksize-1)/t.blksize|0),{dev:t.dev,ino:t.ino,mode:t.mode,nlink:t.nlink,uid:t.uid,gid:t.gid,rdev:t.rdev,size:t.size,atime:t.atime,mtime:t.mtime,ctime:t.ctime,blksize:t.blksize,blocks:t.blocks}},setattr:function(e,t){var r=ve.realPath(e);try{if(void 0!==t.mode&&(Be.chmodSync(r,t.mode),e.mode=t.mode),void 0!==t.timestamp){var n=new Date(t.timestamp);Be.utimesSync(r,n,n)}void 0!==t.size&&Be.truncateSync(r,t.size)}catch(e){if(!e.code)throw e;throw new Ne.ErrnoError(Oe[e.code])}},lookup:function(e,t){var r=Ee.join2(ve.realPath(e),t),n=ve.getMode(r);return ve.createNode(e,t,n)},mknod:function(e,t,r,n){var o=ve.createNode(e,t,r,n),i=ve.realPath(o);try{Ne.isDir(o.mode)?Be.mkdirSync(i,o.mode):Be.writeFileSync(i,"",{mode:o.mode})}catch(e){if(!e.code)throw e;throw new Ne.ErrnoError(Oe[e.code])}return o},rename:function(e,t,r){var n=ve.realPath(e),o=Ee.join2(ve.realPath(t),r);try{Be.renameSync(n,o)}catch(e){if(!e.code)throw e;throw new Ne.ErrnoError(Oe[e.code])}},unlink:function(e,t){var r=Ee.join2(ve.realPath(e),t);try{Be.unlinkSync(r)}catch(e){if(!e.code)throw e;throw new Ne.ErrnoError(Oe[e.code])}},rmdir:function(e,t){var r=Ee.join2(ve.realPath(e),t);try{Be.rmdirSync(r)}catch(e){if(!e.code)throw e;throw new Ne.ErrnoError(Oe[e.code])}},readdir:function(e){var t=ve.realPath(e);try{return Be.readdirSync(t)}catch(e){if(!e.code)throw e;throw new Ne.ErrnoError(Oe[e.code])}},symlink:function(e,t,r){var n=Ee.join2(ve.realPath(e),t);try{Be.symlinkSync(r,n)}catch(e){if(!e.code)throw e;throw new Ne.ErrnoError(Oe[e.code])}},readlink:function(e){var t=ve.realPath(e);try{return t=Be.readlinkSync(t),t=He.relative(He.resolve(e.mount.opts.root),t)}catch(e){if(!e.code)throw e;throw new Ne.ErrnoError(Oe[e.code])}}},stream_ops:{open:function(e){var t=ve.realPath(e.node);try{Ne.isFile(e.node.mode)&&(e.nfd=Be.openSync(t,ve.flagsForNode(e.flags)))}catch(e){if(!e.code)throw e;throw new Ne.ErrnoError(Oe[e.code])}},close:function(e){try{Ne.isFile(e.node.mode)&&e.nfd&&Be.closeSync(e.nfd)}catch(e){if(!e.code)throw e;throw new Ne.ErrnoError(Oe[e.code])}},read:function(e,t,r,n,o){if(0===n)return 0;try{return Be.readSync(e.nfd,ve.bufferFrom(t.buffer),r,n,o)}catch(e){throw new Ne.ErrnoError(Oe[e.code])}},write:function(e,t,r,n,o){try{return Be.writeSync(e.nfd,ve.bufferFrom(t.buffer),r,n,o)}catch(e){throw new Ne.ErrnoError(Oe[e.code])}},llseek:function(e,t,r){var n=t;if(1===r)n+=e.position;else if(2===r&&Ne.isFile(e.node.mode))try{n+=Be.fstatSync(e.nfd).size}catch(e){throw new Ne.ErrnoError(Oe[e.code])}if(n<0)throw new Ne.ErrnoError(Oe.EINVAL);return n}}},Te={DIR_MODE:16895,FILE_MODE:33279,reader:null,mount:function(e){g(l),Te.reader||(Te.reader=new FileReaderSync);var t=Te.createNode(null,"/",Te.DIR_MODE,0),r={};function n(e){for(var n=e.split("/"),o=t,i=0;i<n.length-1;i++){var a=n.slice(0,i+1).join("/");r[a]||(r[a]=Te.createNode(o,n[i],Te.DIR_MODE,0)),o=r[a]}return o}function o(e){var t=e.split("/");return t[t.length-1]}return Array.prototype.forEach.call(e.opts.files||[],function(e){Te.createNode(n(e.name),o(e.name),Te.FILE_MODE,0,e,e.lastModifiedDate)}),(e.opts.blobs||[]).forEach(function(e){Te.createNode(n(e.name),o(e.name),Te.FILE_MODE,0,e.data)}),(e.opts.packages||[]).forEach(function(e){e.metadata.files.forEach(function(t){var r=t.filename.substr(1);Te.createNode(n(r),o(r),Te.FILE_MODE,0,e.blob.slice(t.start,t.end))})}),t},createNode:function(e,t,r,n,o,i){var a=Ne.createNode(e,t,r);return a.mode=r,a.node_ops=Te.node_ops,a.stream_ops=Te.stream_ops,a.timestamp=(i||new Date).getTime(),g(Te.FILE_MODE!==Te.DIR_MODE),r===Te.FILE_MODE?(a.size=o.size,a.contents=o):(a.size=4096,a.contents={}),e&&(e.contents[t]=a),a},node_ops:{getattr:function(e){return{dev:1,ino:void 0,mode:e.mode,nlink:1,uid:0,gid:0,rdev:void 0,size:e.size,atime:new Date(e.timestamp),mtime:new Date(e.timestamp),ctime:new Date(e.timestamp),blksize:4096,blocks:Math.ceil(e.size/4096)}},setattr:function(e,t){void 0!==t.mode&&(e.mode=t.mode),void 0!==t.timestamp&&(e.timestamp=t.timestamp)},lookup:function(e,t){throw new Ne.ErrnoError(Oe.ENOENT)},mknod:function(e,t,r,n){throw new Ne.ErrnoError(Oe.EPERM)},rename:function(e,t,r){throw new Ne.ErrnoError(Oe.EPERM)},unlink:function(e,t){throw new Ne.ErrnoError(Oe.EPERM)},rmdir:function(e,t){throw new Ne.ErrnoError(Oe.EPERM)},readdir:function(e){var t=[".",".."];for(var r in e.contents)e.contents.hasOwnProperty(r)&&t.push(r);return t},symlink:function(e,t,r){throw new Ne.ErrnoError(Oe.EPERM)},readlink:function(e){throw new Ne.ErrnoError(Oe.EPERM)}},stream_ops:{read:function(e,t,r,n,o){if(o>=e.node.size)return 0;var i=e.node.contents.slice(o,o+n),a=Te.reader.readAsArrayBuffer(i);return t.set(new Uint8Array(a),r),i.size},write:function(e,t,r,n,o){throw new Ne.ErrnoError(Oe.EIO)},llseek:function(e,t,r){var n=t;if(1===r?n+=e.position:2===r&&Ne.isFile(e.node.mode)&&(n+=e.node.size),n<0)throw new Ne.ErrnoError(Oe.EINVAL);return n}}},be={0:"Success",1:"Not super-user",2:"No such file or directory",3:"No such process",4:"Interrupted system call",5:"I/O error",6:"No such device or address",7:"Arg list too long",8:"Exec format error",9:"Bad file number",10:"No children",11:"No more processes",12:"Not enough core",13:"Permission denied",14:"Bad address",15:"Block device required",16:"Mount device busy",17:"File exists",18:"Cross-device link",19:"No such device",20:"Not a directory",21:"Is a directory",22:"Invalid argument",23:"Too many open files in system",24:"Too many open files",25:"Not a typewriter",26:"Text file busy",27:"File too large",28:"No space left on device",29:"Illegal seek",30:"Read only file system",31:"Too many links",32:"Broken pipe",33:"Math arg out of domain of func",34:"Math result not representable",35:"File locking deadlock error",36:"File or path name too long",37:"No record locks available",38:"Function not implemented",39:"Directory not empty",40:"Too many symbolic links",42:"No message of desired type",43:"Identifier removed",44:"Channel number out of range",45:"Level 2 not synchronized",46:"Level 3 halted",47:"Level 3 reset",48:"Link number out of range",49:"Protocol driver not attached",50:"No CSI structure available",51:"Level 2 halted",52:"Invalid exchange",53:"Invalid request descriptor",54:"Exchange full",55:"No anode",56:"Invalid request code",57:"Invalid slot",59:"Bad font file fmt",60:"Device not a stream",61:"No data (for no delay io)",62:"Timer expired",63:"Out of streams resources",64:"Machine is not on the network",65:"Package not installed",66:"The object is remote",67:"The link has been severed",68:"Advertise error",69:"Srmount error",70:"Communication error on send",71:"Protocol error",72:"Multihop attempted",73:"Cross mount point (not really error)",74:"Trying to read unreadable message",75:"Value too large for defined data type",76:"Given log. name not unique",77:"f.d. invalid for this operation",78:"Remote address changed",79:"Can   access a needed shared lib",80:"Accessing a corrupted shared lib",81:".lib section in a.out corrupted",82:"Attempting to link in too many libs",83:"Attempting to exec a shared library",84:"Illegal byte sequence",86:"Streams pipe error",87:"Too many users",88:"Socket operation on non-socket",89:"Destination address required",90:"Message too long",91:"Protocol wrong type for socket",92:"Protocol not available",93:"Unknown protocol",94:"Socket type not supported",95:"Not supported",96:"Protocol family not supported",97:"Address family not supported by protocol family",98:"Address already in use",99:"Address not available",100:"Network interface is not configured",101:"Network is unreachable",102:"Connection reset by network",103:"Connection aborted",104:"Connection reset by peer",105:"No buffer space available",106:"Socket is already connected",107:"Socket is not connected",108:"Can\'t send after socket shutdown",109:"Too many references",110:"Connection timed out",111:"Connection refused",112:"Host is down",113:"Host is unreachable",114:"Socket already connected",115:"Connection already in progress",116:"Stale file handle",122:"Quota exceeded",123:"No medium (in tape drive)",125:"Operation canceled",130:"Previous owner died",131:"State not recoverable"},Oe={EPERM:1,ENOENT:2,ESRCH:3,EINTR:4,EIO:5,ENXIO:6,E2BIG:7,ENOEXEC:8,EBADF:9,ECHILD:10,EAGAIN:11,EWOULDBLOCK:11,ENOMEM:12,EACCES:13,EFAULT:14,ENOTBLK:15,EBUSY:16,EEXIST:17,EXDEV:18,ENODEV:19,ENOTDIR:20,EISDIR:21,EINVAL:22,ENFILE:23,EMFILE:24,ENOTTY:25,ETXTBSY:26,EFBIG:27,ENOSPC:28,ESPIPE:29,EROFS:30,EMLINK:31,EPIPE:32,EDOM:33,ERANGE:34,ENOMSG:42,EIDRM:43,ECHRNG:44,EL2NSYNC:45,EL3HLT:46,EL3RST:47,ELNRNG:48,EUNATCH:49,ENOCSI:50,EL2HLT:51,EDEADLK:35,ENOLCK:37,EBADE:52,EBADR:53,EXFULL:54,ENOANO:55,EBADRQC:56,EBADSLT:57,EDEADLOCK:35,EBFONT:59,ENOSTR:60,ENODATA:61,ETIME:62,ENOSR:63,ENONET:64,ENOPKG:65,EREMOTE:66,ENOLINK:67,EADV:68,ESRMNT:69,ECOMM:70,EPROTO:71,EMULTIHOP:72,EDOTDOT:73,EBADMSG:74,ENOTUNIQ:76,EBADFD:77,EREMCHG:78,ELIBACC:79,ELIBBAD:80,ELIBSCN:81,ELIBMAX:82,ELIBEXEC:83,ENOSYS:38,ENOTEMPTY:39,ENAMETOOLONG:36,ELOOP:40,EOPNOTSUPP:95,EPFNOSUPPORT:96,ECONNRESET:104,ENOBUFS:105,EAFNOSUPPORT:97,EPROTOTYPE:91,ENOTSOCK:88,ENOPROTOOPT:92,ESHUTDOWN:108,ECONNREFUSED:111,EADDRINUSE:98,ECONNABORTED:103,ENETUNREACH:101,ENETDOWN:100,ETIMEDOUT:110,EHOSTDOWN:112,EHOSTUNREACH:113,EINPROGRESS:115,EALREADY:114,EDESTADDRREQ:89,EMSGSIZE:90,EPROTONOSUPPORT:93,ESOCKTNOSUPPORT:94,EADDRNOTAVAIL:99,ENETRESET:102,EISCONN:106,ENOTCONN:107,ETOOMANYREFS:109,EUSERS:87,EDQUOT:122,ESTALE:116,ENOTSUP:95,ENOMEDIUM:123,EILSEQ:84,EOVERFLOW:75,ECANCELED:125,ENOTRECOVERABLE:131,EOWNERDEAD:130,ESTRPIPE:86},Ne={root:null,mounts:[],devices:{},streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:!1,ignorePermissions:!0,trackingDelegate:{},tracking:{openFlags:{READ:1,WRITE:2}},ErrnoError:null,genericErrors:{},filesystems:null,syncFSRequests:0,handleFSError:function(e){if(!(e instanceof Ne.ErrnoError))throw e+" : "+L();return we(e.errno)},lookupPath:function(e,t){if(t=t||{},!(e=Ee.resolve(Ne.cwd(),e)))return{path:"",node:null};var r={follow_mount:!0,recurse_count:0};for(var n in r)void 0===t[n]&&(t[n]=r[n]);if(8<t.recurse_count)throw new Ne.ErrnoError(40);for(var o=Ee.normalizeArray(e.split("/").filter(function(e){return!!e}),!1),i=Ne.root,a="/",s=0;s<o.length;s++){var u=s===o.length-1;if(u&&t.parent)break;if(i=Ne.lookupNode(i,o[s]),a=Ee.join2(a,o[s]),Ne.isMountpoint(i)&&(!u||u&&t.follow_mount)&&(i=i.mounted.root),!u||t.follow)for(var c=0;Ne.isLink(i.mode);){var l=Ne.readlink(a);if(a=Ee.resolve(Ee.dirname(a),l),i=Ne.lookupPath(a,{recurse_count:t.recurse_count}).node,40<c++)throw new Ne.ErrnoError(40)}}return{path:a,node:i}},getPath:function(e){for(var t;;){if(Ne.isRoot(e)){var r=e.mount.mountpoint;return t?"/"!==r[r.length-1]?r+"/"+t:r+t:r}t=t?e.name+"/"+t:e.name,e=e.parent}},hashName:function(e,t){for(var r=0,n=0;n<t.length;n++)r=(r<<5)-r+t.charCodeAt(n)|0;return(e+r>>>0)%Ne.nameTable.length},hashAddNode:function(e){var t=Ne.hashName(e.parent.id,e.name);e.name_next=Ne.nameTable[t],Ne.nameTable[t]=e},hashRemoveNode:function(e){var t=Ne.hashName(e.parent.id,e.name);if(Ne.nameTable[t]===e)Ne.nameTable[t]=e.name_next;else for(var r=Ne.nameTable[t];r;){if(r.name_next===e){r.name_next=e.name_next;break}r=r.name_next}},lookupNode:function(e,t){var r=Ne.mayLookup(e);if(r)throw new Ne.ErrnoError(r,e);for(var n=Ne.hashName(e.id,t),o=Ne.nameTable[n];o;o=o.name_next){var i=o.name;if(o.parent.id===e.id&&i===t)return o}return Ne.lookup(e,t)},createNode:function(e,t,r,n){Ne.FSNode||(Ne.FSNode=function(e,t,r,n){e||(e=this),this.parent=e,this.mount=e.mount,this.mounted=null,this.id=Ne.nextInode++,this.name=t,this.mode=r,this.node_ops={},this.stream_ops={},this.rdev=n},Ne.FSNode.prototype={},Object.defineProperties(Ne.FSNode.prototype,{read:{get:function(){return 365==(365&this.mode)},set:function(e){e?this.mode|=365:this.mode&=-366}},write:{get:function(){return 146==(146&this.mode)},set:function(e){e?this.mode|=146:this.mode&=-147}},isFolder:{get:function(){return Ne.isDir(this.mode)}},isDevice:{get:function(){return Ne.isChrdev(this.mode)}}}));var o=new Ne.FSNode(e,t,r,n);return Ne.hashAddNode(o),o},destroyNode:function(e){Ne.hashRemoveNode(e)},isRoot:function(e){return e===e.parent},isMountpoint:function(e){return!!e.mounted},isFile:function(e){return 32768==(61440&e)},isDir:function(e){return 16384==(61440&e)},isLink:function(e){return 40960==(61440&e)},isChrdev:function(e){return 8192==(61440&e)},isBlkdev:function(e){return 24576==(61440&e)},isFIFO:function(e){return 4096==(61440&e)},isSocket:function(e){return 49152==(49152&e)},flagModes:{r:0,rs:1052672,"r+":2,w:577,wx:705,xw:705,"w+":578,"wx+":706,"xw+":706,a:1089,ax:1217,xa:1217,"a+":1090,"ax+":1218,"xa+":1218},modeStringToFlags:function(e){var t=Ne.flagModes[e];if(void 0===t)throw new Error("Unknown file open mode: "+e);return t},flagsToPermissionString:function(e){var t=["r","w","rw"][3&e];return 512&e&&(t+="w"),t},nodePermissions:function(e,t){return Ne.ignorePermissions?0:(-1===t.indexOf("r")||292&e.mode)&&(-1===t.indexOf("w")||146&e.mode)&&(-1===t.indexOf("x")||73&e.mode)?0:13},mayLookup:function(e){return Ne.nodePermissions(e,"x")||(e.node_ops.lookup?0:13)},mayCreate:function(e,t){try{return Ne.lookupNode(e,t),17}catch(e){}return Ne.nodePermissions(e,"wx")},mayDelete:function(e,t,r){var n;try{n=Ne.lookupNode(e,t)}catch(e){return e.errno}var o=Ne.nodePermissions(e,"wx");if(o)return o;if(r){if(!Ne.isDir(n.mode))return 20;if(Ne.isRoot(n)||Ne.getPath(n)===Ne.cwd())return 16}else if(Ne.isDir(n.mode))return 21;return 0},mayOpen:function(e,t){return e?Ne.isLink(e.mode)?40:Ne.isDir(e.mode)&&("r"!==Ne.flagsToPermissionString(t)||512&t)?21:Ne.nodePermissions(e,Ne.flagsToPermissionString(t)):2},MAX_OPEN_FDS:4096,nextfd:function(e,t){e=e||0,t=t||Ne.MAX_OPEN_FDS;for(var r=e;r<=t;r++)if(!Ne.streams[r])return r;throw new Ne.ErrnoError(24)},getStream:function(e){return Ne.streams[e]},createStream:function(e,t,r){Ne.FSStream||(Ne.FSStream=function(){},Ne.FSStream.prototype={},Object.defineProperties(Ne.FSStream.prototype,{object:{get:function(){return this.node},set:function(e){this.node=e}},isRead:{get:function(){return 1!=(2097155&this.flags)}},isWrite:{get:function(){return 0!=(2097155&this.flags)}},isAppend:{get:function(){return 1024&this.flags}}}));var n=new Ne.FSStream;for(var o in e)n[o]=e[o];e=n;var i=Ne.nextfd(t,r);return e.fd=i,Ne.streams[i]=e},closeStream:function(e){Ne.streams[e]=null},chrdev_stream_ops:{open:function(e){var t=Ne.getDevice(e.node.rdev);e.stream_ops=t.stream_ops,e.stream_ops.open&&e.stream_ops.open(e)},llseek:function(){throw new Ne.ErrnoError(29)}},major:function(e){return e>>8},minor:function(e){return 255&e},makedev:function(e,t){return e<<8|t},registerDevice:function(e,t){Ne.devices[e]={stream_ops:t}},getDevice:function(e){return Ne.devices[e]},getMounts:function(e){for(var t=[],r=[e];r.length;){var n=r.pop();t.push(n),r.push.apply(r,n.mounts)}return t},syncfs:function(e,t){"function"==typeof e&&(t=e,e=!1),Ne.syncFSRequests++,1<Ne.syncFSRequests&&Ne.syncFSRequests;var r=Ne.getMounts(Ne.root.mount),n=0;function o(e){return g(0<Ne.syncFSRequests),Ne.syncFSRequests--,t(e)}function i(e){if(e)return i.errored?void 0:(i.errored=!0,o(e));++n>=r.length&&o(null)}r.forEach(function(t){if(!t.type.syncfs)return i(null);t.type.syncfs(t,e,i)})},mount:function(e,t,r){var n,o="/"===r,i=!r;if(o&&Ne.root)throw new Ne.ErrnoError(16);if(!o&&!i){var a=Ne.lookupPath(r,{follow_mount:!1});if(r=a.path,n=a.node,Ne.isMountpoint(n))throw new Ne.ErrnoError(16);if(!Ne.isDir(n.mode))throw new Ne.ErrnoError(20)}var s={type:e,opts:t,mountpoint:r,mounts:[]},u=e.mount(s);return(u.mount=s).root=u,o?Ne.root=u:n&&(n.mounted=s,n.mount&&n.mount.mounts.push(s)),u},unmount:function(e){var t=Ne.lookupPath(e,{follow_mount:!1});if(!Ne.isMountpoint(t.node))throw new Ne.ErrnoError(22);var r=t.node,n=r.mounted,o=Ne.getMounts(n);Object.keys(Ne.nameTable).forEach(function(e){for(var t=Ne.nameTable[e];t;){var r=t.name_next;-1!==o.indexOf(t.mount)&&Ne.destroyNode(t),t=r}}),r.mounted=null;var i=r.mount.mounts.indexOf(n);g(-1!==i),r.mount.mounts.splice(i,1)},lookup:function(e,t){return e.node_ops.lookup(e,t)},mknod:function(e,t,r){var n=Ne.lookupPath(e,{parent:!0}).node,o=Ee.basename(e);if(!o||"."===o||".."===o)throw new Ne.ErrnoError(22);var i=Ne.mayCreate(n,o);if(i)throw new Ne.ErrnoError(i);if(!n.node_ops.mknod)throw new Ne.ErrnoError(1);return n.node_ops.mknod(n,o,t,r)},create:function(e,t){return t=void 0!==t?t:438,t&=4095,t|=32768,Ne.mknod(e,t,0)},mkdir:function(e,t){return t=void 0!==t?t:511,t&=1023,t|=16384,Ne.mknod(e,t,0)},mkdirTree:function(e,t){for(var r=e.split("/"),n="",o=0;o<r.length;++o)if(r[o]){n+="/"+r[o];try{Ne.mkdir(n,t)}catch(e){if(17!=e.errno)throw e}}},mkdev:function(e,t,r){return void 0===r&&(r=t,t=438),t|=8192,Ne.mknod(e,t,r)},symlink:function(e,t){if(!Ee.resolve(e))throw new Ne.ErrnoError(2);var r=Ne.lookupPath(t,{parent:!0}).node;if(!r)throw new Ne.ErrnoError(2);var n=Ee.basename(t),o=Ne.mayCreate(r,n);if(o)throw new Ne.ErrnoError(o);if(!r.node_ops.symlink)throw new Ne.ErrnoError(1);return r.node_ops.symlink(r,n,e)},rename:function(e,t){var r,n,o=Ee.dirname(e),i=Ee.dirname(t),a=Ee.basename(e),s=Ee.basename(t);try{r=Ne.lookupPath(e,{parent:!0}).node,n=Ne.lookupPath(t,{parent:!0}).node}catch(e){throw new Ne.ErrnoError(16)}if(!r||!n)throw new Ne.ErrnoError(2);if(r.mount!==n.mount)throw new Ne.ErrnoError(18);var u,c=Ne.lookupNode(r,a),l=Ee.relative(e,i);if("."!==l.charAt(0))throw new Ne.ErrnoError(22);if("."!==(l=Ee.relative(t,o)).charAt(0))throw new Ne.ErrnoError(39);try{u=Ne.lookupNode(n,s)}catch(e){}if(c!==u){var d=Ne.isDir(c.mode),f=Ne.mayDelete(r,a,d);if(f)throw new Ne.ErrnoError(f);if(f=u?Ne.mayDelete(n,s,d):Ne.mayCreate(n,s))throw new Ne.ErrnoError(f);if(!r.node_ops.rename)throw new Ne.ErrnoError(1);if(Ne.isMountpoint(c)||u&&Ne.isMountpoint(u))throw new Ne.ErrnoError(16);if(n!==r&&(f=Ne.nodePermissions(r,"w")))throw new Ne.ErrnoError(f);try{Ne.trackingDelegate.willMovePath&&Ne.trackingDelegate.willMovePath(e,t)}catch(e){e.message}Ne.hashRemoveNode(c);try{r.node_ops.rename(c,n,s)}catch(e){throw e}finally{Ne.hashAddNode(c)}try{Ne.trackingDelegate.onMovePath&&Ne.trackingDelegate.onMovePath(e,t)}catch(e){e.message}}},rmdir:function(e){var t=Ne.lookupPath(e,{parent:!0}).node,r=Ee.basename(e),n=Ne.lookupNode(t,r),o=Ne.mayDelete(t,r,!0);if(o)throw new Ne.ErrnoError(o);if(!t.node_ops.rmdir)throw new Ne.ErrnoError(1);if(Ne.isMountpoint(n))throw new Ne.ErrnoError(16);try{Ne.trackingDelegate.willDeletePath&&Ne.trackingDelegate.willDeletePath(e)}catch(e){e.message}t.node_ops.rmdir(t,r),Ne.destroyNode(n);try{Ne.trackingDelegate.onDeletePath&&Ne.trackingDelegate.onDeletePath(e)}catch(e){e.message}},readdir:function(e){var t=Ne.lookupPath(e,{follow:!0}).node;if(!t.node_ops.readdir)throw new Ne.ErrnoError(20);return t.node_ops.readdir(t)},unlink:function(e){var t=Ne.lookupPath(e,{parent:!0}).node,r=Ee.basename(e),n=Ne.lookupNode(t,r),o=Ne.mayDelete(t,r,!1);if(o)throw new Ne.ErrnoError(o);if(!t.node_ops.unlink)throw new Ne.ErrnoError(1);if(Ne.isMountpoint(n))throw new Ne.ErrnoError(16);try{Ne.trackingDelegate.willDeletePath&&Ne.trackingDelegate.willDeletePath(e)}catch(e){e.message}t.node_ops.unlink(t,r),Ne.destroyNode(n);try{Ne.trackingDelegate.onDeletePath&&Ne.trackingDelegate.onDeletePath(e)}catch(e){e.message}},readlink:function(e){var t=Ne.lookupPath(e).node;if(!t)throw new Ne.ErrnoError(2);if(!t.node_ops.readlink)throw new Ne.ErrnoError(22);return Ee.resolve(Ne.getPath(t.parent),t.node_ops.readlink(t))},stat:function(e,t){var r=Ne.lookupPath(e,{follow:!t}).node;if(!r)throw new Ne.ErrnoError(2);if(!r.node_ops.getattr)throw new Ne.ErrnoError(1);return r.node_ops.getattr(r)},lstat:function(e){return Ne.stat(e,!0)},chmod:function(e,t,r){var n;if(!(n="string"==typeof e?Ne.lookupPath(e,{follow:!r}).node:e).node_ops.setattr)throw new Ne.ErrnoError(1);n.node_ops.setattr(n,{mode:4095&t|-4096&n.mode,timestamp:Date.now()})},lchmod:function(e,t){Ne.chmod(e,t,!0)},fchmod:function(e,t){var r=Ne.getStream(e);if(!r)throw new Ne.ErrnoError(9);Ne.chmod(r.node,t)},chown:function(e,t,r,n){var o;if(!(o="string"==typeof e?Ne.lookupPath(e,{follow:!n}).node:e).node_ops.setattr)throw new Ne.ErrnoError(1);o.node_ops.setattr(o,{timestamp:Date.now()})},lchown:function(e,t,r){Ne.chown(e,t,r,!0)},fchown:function(e,t,r){var n=Ne.getStream(e);if(!n)throw new Ne.ErrnoError(9);Ne.chown(n.node,t,r)},truncate:function(e,t){if(t<0)throw new Ne.ErrnoError(22);var r;if(!(r="string"==typeof e?Ne.lookupPath(e,{follow:!0}).node:e).node_ops.setattr)throw new Ne.ErrnoError(1);if(Ne.isDir(r.mode))throw new Ne.ErrnoError(21);if(!Ne.isFile(r.mode))throw new Ne.ErrnoError(22);var n=Ne.nodePermissions(r,"w");if(n)throw new Ne.ErrnoError(n);r.node_ops.setattr(r,{size:t,timestamp:Date.now()})},ftruncate:function(e,t){var r=Ne.getStream(e);if(!r)throw new Ne.ErrnoError(9);if(0==(2097155&r.flags))throw new Ne.ErrnoError(22);Ne.truncate(r.node,t)},utime:function(e,t,r){var n=Ne.lookupPath(e,{follow:!0}).node;n.node_ops.setattr(n,{timestamp:Math.max(t,r)})},open:function(e,t,r,n,i){if(""===e)throw new Ne.ErrnoError(2);var a;if(r=void 0===r?438:r,r=64&(t="string"==typeof t?Ne.modeStringToFlags(t):t)?4095&r|32768:0,"object"==typeof e)a=e;else{e=Ee.normalize(e);try{a=Ne.lookupPath(e,{follow:!(131072&t)}).node}catch(e){}}var s=!1;if(64&t)if(a){if(128&t)throw new Ne.ErrnoError(17)}else a=Ne.mknod(e,r,0),s=!0;if(!a)throw new Ne.ErrnoError(2);if(Ne.isChrdev(a.mode)&&(t&=-513),65536&t&&!Ne.isDir(a.mode))throw new Ne.ErrnoError(20);if(!s){var u=Ne.mayOpen(a,t);if(u)throw new Ne.ErrnoError(u)}512&t&&Ne.truncate(a,0),t&=-641;var c=Ne.createStream({node:a,path:Ne.getPath(a),flags:t,seekable:!0,position:0,stream_ops:a.stream_ops,ungotten:[],error:!1},n,i);c.stream_ops.open&&c.stream_ops.open(c),!o.logReadFiles||1&t||(Ne.readFiles||(Ne.readFiles={}),e in Ne.readFiles||(Ne.readFiles[e]=1));try{if(Ne.trackingDelegate.onOpenFile){var l=0;1!=(2097155&t)&&(l|=Ne.tracking.openFlags.READ),0!=(2097155&t)&&(l|=Ne.tracking.openFlags.WRITE),Ne.trackingDelegate.onOpenFile(e,l)}}catch(e){e.message}return c},close:function(e){if(Ne.isClosed(e))throw new Ne.ErrnoError(9);e.getdents&&(e.getdents=null);try{e.stream_ops.close&&e.stream_ops.close(e)}catch(e){throw e}finally{Ne.closeStream(e.fd)}e.fd=null},isClosed:function(e){return null===e.fd},llseek:function(e,t,r){if(Ne.isClosed(e))throw new Ne.ErrnoError(9);if(!e.seekable||!e.stream_ops.llseek)throw new Ne.ErrnoError(29);return e.position=e.stream_ops.llseek(e,t,r),e.ungotten=[],e.position},read:function(e,t,r,n,o){if(n<0||o<0)throw new Ne.ErrnoError(22);if(Ne.isClosed(e))throw new Ne.ErrnoError(9);if(1==(2097155&e.flags))throw new Ne.ErrnoError(9);if(Ne.isDir(e.node.mode))throw new Ne.ErrnoError(21);if(!e.stream_ops.read)throw new Ne.ErrnoError(22);var i=void 0!==o;if(i){if(!e.seekable)throw new Ne.ErrnoError(29)}else o=e.position;var a=e.stream_ops.read(e,t,r,n,o);return i||(e.position+=a),a},write:function(e,t,r,n,o,i){if(n<0||o<0)throw new Ne.ErrnoError(22);if(Ne.isClosed(e))throw new Ne.ErrnoError(9);if(0==(2097155&e.flags))throw new Ne.ErrnoError(9);if(Ne.isDir(e.node.mode))throw new Ne.ErrnoError(21);if(!e.stream_ops.write)throw new Ne.ErrnoError(22);1024&e.flags&&Ne.llseek(e,0,2);var a=void 0!==o;if(a){if(!e.seekable)throw new Ne.ErrnoError(29)}else o=e.position;var s=e.stream_ops.write(e,t,r,n,o,i);a||(e.position+=s);try{e.path&&Ne.trackingDelegate.onWriteToFile&&Ne.trackingDelegate.onWriteToFile(e.path)}catch(e){path,e.message}return s},allocate:function(e,t,r){if(Ne.isClosed(e))throw new Ne.ErrnoError(9);if(t<0||r<=0)throw new Ne.ErrnoError(22);if(0==(2097155&e.flags))throw new Ne.ErrnoError(9);if(!Ne.isFile(e.node.mode)&&!Ne.isDir(e.node.mode))throw new Ne.ErrnoError(19);if(!e.stream_ops.allocate)throw new Ne.ErrnoError(95);e.stream_ops.allocate(e,t,r)},mmap:function(e,t,r,n,o,i,a){if(1==(2097155&e.flags))throw new Ne.ErrnoError(13);if(!e.stream_ops.mmap)throw new Ne.ErrnoError(19);return e.stream_ops.mmap(e,t,r,n,o,i,a)},msync:function(e,t,r,n,o){return e&&e.stream_ops.msync?e.stream_ops.msync(e,t,r,n,o):0},munmap:function(e){return 0},ioctl:function(e,t,r){if(!e.stream_ops.ioctl)throw new Ne.ErrnoError(25);return e.stream_ops.ioctl(e,t,r)},readFile:function(e,t){if((t=t||{}).flags=t.flags||"r",t.encoding=t.encoding||"binary","utf8"!==t.encoding&&"binary"!==t.encoding)throw new Error(\'Invalid encoding type "\'+t.encoding+\'"\');var r,n=Ne.open(e,t.flags),o=Ne.stat(e).size,i=new Uint8Array(o);return Ne.read(n,i,0,o,0),"utf8"===t.encoding?r=I(i,0):"binary"===t.encoding&&(r=i),Ne.close(n),r},writeFile:function(e,t,r){(r=r||{}).flags=r.flags||"w";var n=Ne.open(e,r.flags,r.mode);if("string"==typeof t){var o=new Uint8Array(P(t)+1),i=F(t,o,0,o.length);Ne.write(n,o,0,i,void 0,r.canOwn)}else{if(!ArrayBuffer.isView(t))throw new Error("Unsupported data type");Ne.write(n,t,0,t.byteLength,void 0,r.canOwn)}Ne.close(n)},cwd:function(){return Ne.currentPath},chdir:function(e){var t=Ne.lookupPath(e,{follow:!0});if(null===t.node)throw new Ne.ErrnoError(2);if(!Ne.isDir(t.node.mode))throw new Ne.ErrnoError(20);var r=Ne.nodePermissions(t.node,"x");if(r)throw new Ne.ErrnoError(r);Ne.currentPath=t.path},createDefaultDirectories:function(){Ne.mkdir("/tmp"),Ne.mkdir("/home"),Ne.mkdir("/home/web_user")},createDefaultDevices:function(){var e;if(Ne.mkdir("/dev"),Ne.registerDevice(Ne.makedev(1,3),{read:function(){return 0},write:function(e,t,r,n,o){return n}}),Ne.mkdev("/dev/null",Ne.makedev(1,3)),ye.register(Ne.makedev(5,0),ye.default_tty_ops),ye.register(Ne.makedev(6,0),ye.default_tty1_ops),Ne.mkdev("/dev/tty",Ne.makedev(5,0)),Ne.mkdev("/dev/tty1",Ne.makedev(6,0)),"undefined"!=typeof crypto){var t=new Uint8Array(1);e=function(){return crypto.getRandomValues(t),t[0]}}else e=u?function(){return r(0).randomBytes(1)[0]}:function(){Dt("random_device")};Ne.createDevice("/dev","random",e),Ne.createDevice("/dev","urandom",e),Ne.mkdir("/dev/shm"),Ne.mkdir("/dev/shm/tmp")},createSpecialDirectories:function(){Ne.mkdir("/proc"),Ne.mkdir("/proc/self"),Ne.mkdir("/proc/self/fd"),Ne.mount({mount:function(){var e=Ne.createNode("/proc/self","fd",16895,73);return e.node_ops={lookup:function(e,t){var r=+t,n=Ne.getStream(r);if(!n)throw new Ne.ErrnoError(9);var o={parent:null,mount:{mountpoint:"fake"},node_ops:{readlink:function(){return n.path}}};return o.parent=o}},e}},{},"/proc/self/fd")},createStandardStreams:function(){o.stdin?Ne.createDevice("/dev","stdin",o.stdin):Ne.symlink("/dev/tty","/dev/stdin"),o.stdout?Ne.createDevice("/dev","stdout",null,o.stdout):Ne.symlink("/dev/tty","/dev/stdout"),o.stderr?Ne.createDevice("/dev","stderr",null,o.stderr):Ne.symlink("/dev/tty1","/dev/stderr");var e=Ne.open("/dev/stdin","r");g(0===e.fd,"invalid handle for stdin ("+e.fd+")");var t=Ne.open("/dev/stdout","w");g(1===t.fd,"invalid handle for stdout ("+t.fd+")");var r=Ne.open("/dev/stderr","w");g(2===r.fd,"invalid handle for stderr ("+r.fd+")")},ensureErrnoError:function(){Ne.ErrnoError||(Ne.ErrnoError=function(e,t){this.node=t,this.setErrno=function(e){for(var t in this.errno=e,Oe)if(Oe[t]===e){this.code=t;break}},this.setErrno(e),this.message=be[e],this.stack&&Object.defineProperty(this,"stack",{value:(new Error).stack,writable:!0}),this.stack&&(this.stack=U(this.stack))},Ne.ErrnoError.prototype=new Error,Ne.ErrnoError.prototype.constructor=Ne.ErrnoError,[2].forEach(function(e){Ne.genericErrors[e]=new Ne.ErrnoError(e),Ne.genericErrors[e].stack="<generic error, no stack>"}))},staticInit:function(){Ne.ensureErrnoError(),Ne.nameTable=new Array(4096),Ne.mount(ge,{},"/"),Ne.createDefaultDirectories(),Ne.createDefaultDevices(),Ne.createSpecialDirectories(),Ne.filesystems={MEMFS:ge,IDBFS:_e,NODEFS:ve,WORKERFS:Te}},init:function(e,t,r){g(!Ne.init.initialized,"FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)"),Ne.init.initialized=!0,Ne.ensureErrnoError(),o.stdin=e||o.stdin,o.stdout=t||o.stdout,o.stderr=r||o.stderr,Ne.createStandardStreams()},quit:function(){Ne.init.initialized=!1;var e=o._fflush;e&&e(0);for(var t=0;t<Ne.streams.length;t++){var r=Ne.streams[t];r&&Ne.close(r)}},getMode:function(e,t){var r=0;return e&&(r|=365),t&&(r|=146),r},joinPath:function(e,t){var r=Ee.join.apply(null,e);return t&&"/"==r[0]&&(r=r.substr(1)),r},absolutePath:function(e,t){return Ee.resolve(t,e)},standardizePath:function(e){return Ee.normalize(e)},findObject:function(e,t){var r=Ne.analyzePath(e,t);return r.exists?r.object:(we(r.error),null)},analyzePath:function(e,t){try{e=(n=Ne.lookupPath(e,{follow:!t})).path}catch(e){}var r={isRoot:!1,exists:!1,error:0,name:null,path:null,object:null,parentExists:!1,parentPath:null,parentObject:null};try{var n=Ne.lookupPath(e,{parent:!0});r.parentExists=!0,r.parentPath=n.path,r.parentObject=n.node,r.name=Ee.basename(e),n=Ne.lookupPath(e,{follow:!t}),r.exists=!0,r.path=n.path,r.object=n.node,r.name=n.node.name,r.isRoot="/"===n.path}catch(e){r.error=e.errno}return r},createFolder:function(e,t,r,n){var o=Ee.join2("string"==typeof e?e:Ne.getPath(e),t),i=Ne.getMode(r,n);return Ne.mkdir(o,i)},createPath:function(e,t,r,n){e="string"==typeof e?e:Ne.getPath(e);for(var o=t.split("/").reverse();o.length;){var i=o.pop();if(i){var a=Ee.join2(e,i);try{Ne.mkdir(a)}catch(e){}e=a}}return a},createFile:function(e,t,r,n,o){var i=Ee.join2("string"==typeof e?e:Ne.getPath(e),t),a=Ne.getMode(n,o);return Ne.create(i,a)},createDataFile:function(e,t,r,n,o,i){var a=t?Ee.join2("string"==typeof e?e:Ne.getPath(e),t):e,s=Ne.getMode(n,o),u=Ne.create(a,s);if(r){if("string"==typeof r){for(var c=new Array(r.length),l=0,d=r.length;l<d;++l)c[l]=r.charCodeAt(l);r=c}Ne.chmod(u,146|s);var f=Ne.open(u,"w");Ne.write(f,r,0,r.length,0,i),Ne.close(f),Ne.chmod(u,s)}return u},createDevice:function(e,t,r,n){var o=Ee.join2("string"==typeof e?e:Ne.getPath(e),t),i=Ne.getMode(!!r,!!n);Ne.createDevice.major||(Ne.createDevice.major=64);var a=Ne.makedev(Ne.createDevice.major++,0);return Ne.registerDevice(a,{open:function(e){e.seekable=!1},close:function(e){n&&n.buffer&&n.buffer.length&&n(10)},read:function(e,t,n,o,i){for(var a=0,s=0;s<o;s++){var u;try{u=r()}catch(e){throw new Ne.ErrnoError(5)}if(void 0===u&&0===a)throw new Ne.ErrnoError(11);if(null==u)break;a++,t[n+s]=u}return a&&(e.node.timestamp=Date.now()),a},write:function(e,t,r,o,i){for(var a=0;a<o;a++)try{n(t[r+a])}catch(e){throw new Ne.ErrnoError(5)}return o&&(e.node.timestamp=Date.now()),a}}),Ne.mkdev(o,i,a)},createLink:function(e,t,r,n,o){var i=Ee.join2("string"==typeof e?e:Ne.getPath(e),t);return Ne.symlink(r,i)},forceLoadFile:function(e){if(e.isDevice||e.isFolder||e.link||e.contents)return!0;var t=!0;if("undefined"!=typeof XMLHttpRequest)throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");if(!o.read)throw new Error("Cannot load without read() or XMLHttpRequest.");try{e.contents=ze(o.read(e.url),!0),e.usedBytes=e.contents.length}catch(e){t=!1}return t||we(5),t},createLazyFile:function(e,t,r,n,o){function i(){this.lengthKnown=!1,this.chunks=[]}if(i.prototype.get=function(e){if(!(e>this.length-1||e<0)){var t=e%this.chunkSize,r=e/this.chunkSize|0;return this.getter(r)[t]}},i.prototype.setDataGetter=function(e){this.getter=e},i.prototype.cacheLength=function(){var e=new XMLHttpRequest;if(e.open("HEAD",r,!1),e.send(null),!(200<=e.status&&e.status<300||304===e.status))throw new Error("Couldn\'t load "+r+". Status: "+e.status);var t,n=Number(e.getResponseHeader("Content-length")),o=(t=e.getResponseHeader("Accept-Ranges"))&&"bytes"===t,i=(t=e.getResponseHeader("Content-Encoding"))&&"gzip"===t,a=1048576;o||(a=n);var s=this;s.setDataGetter(function(e){var t=e*a,o=(e+1)*a-1;if(o=Math.min(o,n-1),void 0===s.chunks[e]&&(s.chunks[e]=function(e,t){if(t<e)throw new Error("invalid range ("+e+", "+t+") or no bytes requested!");if(n-1<t)throw new Error("only "+n+" bytes available! programmer error!");var o=new XMLHttpRequest;if(o.open("GET",r,!1),n!==a&&o.setRequestHeader("Range","bytes="+e+"-"+t),"undefined"!=typeof Uint8Array&&(o.responseType="arraybuffer"),o.overrideMimeType&&o.overrideMimeType("text/plain; charset=x-user-defined"),o.send(null),!(200<=o.status&&o.status<300||304===o.status))throw new Error("Couldn\'t load "+r+". Status: "+o.status);return void 0!==o.response?new Uint8Array(o.response||[]):ze(o.responseText||"",!0)}(t,o)),void 0===s.chunks[e])throw new Error("doXHR failed!");return s.chunks[e]}),!i&&n||(a=n=1,n=this.getter(0).length,a=n),this._length=n,this._chunkSize=a,this.lengthKnown=!0},"undefined"!=typeof XMLHttpRequest){if(!l)throw"Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";var a=new i;Object.defineProperties(a,{length:{get:function(){return this.lengthKnown||this.cacheLength(),this._length}},chunkSize:{get:function(){return this.lengthKnown||this.cacheLength(),this._chunkSize}}});var s={isDevice:!1,contents:a}}else s={isDevice:!1,url:r};var u=Ne.createFile(e,t,s,n,o);s.contents?u.contents=s.contents:s.url&&(u.contents=null,u.url=s.url),Object.defineProperties(u,{usedBytes:{get:function(){return this.contents.length}}});var c={};return Object.keys(u.stream_ops).forEach(function(e){var t=u.stream_ops[e];c[e]=function(){if(!Ne.forceLoadFile(u))throw new Ne.ErrnoError(5);return t.apply(null,arguments)}}),c.read=function(e,t,r,n,o){if(!Ne.forceLoadFile(u))throw new Ne.ErrnoError(5);var i=e.node.contents;if(o>=i.length)return 0;var a=Math.min(i.length-o,n);if(g(0<=a),i.slice)for(var s=0;s<a;s++)t[r+s]=i[o+s];else for(s=0;s<a;s++)t[r+s]=i.get(o+s);return a},u.stream_ops=c,u},createPreloadedFile:function(e,t,r,n,i,a,s,u,c,l){Browser.init();var d=t?Ee.resolve(Ee.join2(e,t)):e,f=function(e){for(var t=e;;){if(!ae[e])return e;e=t+Math.random()}return e}("cp "+d);function h(r){function h(r){l&&l(),u||Ne.createDataFile(e,t,r,n,i,c),a&&a(),ue(f)}var m=!1;o.preloadPlugins.forEach(function(e){m||e.canHandle(d)&&(e.handle(r,d,h,function(){s&&s(),ue(f)}),m=!0)}),m||h(r)}se(f),"string"==typeof r?Browser.asyncLoad(r,function(e){h(e)},s):h(r)},indexedDB:function(){return window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB},DB_NAME:function(){return"EM_FS_"+window.location.pathname},DB_VERSION:20,DB_STORE_NAME:"FILE_DATA",saveFilesToDB:function(e,t,r){t=t||function(){},r=r||function(){};var n=Ne.indexedDB();try{var o=n.open(Ne.DB_NAME(),Ne.DB_VERSION)}catch(n){return r(n)}o.onupgradeneeded=function(){o.result.createObjectStore(Ne.DB_STORE_NAME)},o.onsuccess=function(){var n=o.result.transaction([Ne.DB_STORE_NAME],"readwrite"),i=n.objectStore(Ne.DB_STORE_NAME),a=0,s=0,u=e.length;function c(){0==s?t():r()}e.forEach(function(e){var t=i.put(Ne.analyzePath(e).object.contents,e);t.onsuccess=function(){++a+s==u&&c()},t.onerror=function(){a+ ++s==u&&c()}}),n.onerror=r},o.onerror=r},loadFilesFromDB:function(e,t,r){t=t||function(){},r=r||function(){};var n=Ne.indexedDB();try{var o=n.open(Ne.DB_NAME(),Ne.DB_VERSION)}catch(n){return r(n)}o.onupgradeneeded=r,o.onsuccess=function(){var n=o.result;try{var i=n.transaction([Ne.DB_STORE_NAME],"readonly")}catch(n){return void r(n)}var a=i.objectStore(Ne.DB_STORE_NAME),s=0,u=0,c=e.length;function l(){0==u?t():r()}e.forEach(function(e){var t=a.get(e);t.onsuccess=function(){Ne.analyzePath(e).exists&&Ne.unlink(e),Ne.createDataFile(Ee.dirname(e),Ee.basename(e),t.result,!0,!0,!0),++s+u==c&&l()},t.onerror=function(){s+ ++u==c&&l()}}),i.onerror=r},o.onerror=r}},Re={DEFAULT_POLLMASK:5,mappings:{},umask:511,calculateAt:function(e,t){if("/"!==t[0]){var r;if(-100===e)r=Ne.cwd();else{var n=Ne.getStream(e);if(!n)throw new Ne.ErrnoError(Oe.EBADF);r=n.path}t=Ee.join2(r,t)}return t},doStat:function(e,t,r){try{var n=e(t)}catch(e){if(e&&e.node&&Ee.normalize(t)!==Ee.normalize(Ne.getPath(e.node)))return-Oe.ENOTDIR;throw e}return D[r>>2]=n.dev,D[r+4>>2]=0,D[r+8>>2]=n.ino,D[r+12>>2]=n.mode,D[r+16>>2]=n.nlink,D[r+20>>2]=n.uid,D[r+24>>2]=n.gid,D[r+28>>2]=n.rdev,D[r+32>>2]=0,D[r+36>>2]=n.size,D[r+40>>2]=4096,D[r+44>>2]=n.blocks,D[r+48>>2]=n.atime.getTime()/1e3|0,D[r+52>>2]=0,D[r+56>>2]=n.mtime.getTime()/1e3|0,D[r+60>>2]=0,D[r+64>>2]=n.ctime.getTime()/1e3|0,D[r+68>>2]=0,D[r+72>>2]=n.ino,0},doMsync:function(e,t,r,n){var o=new Uint8Array(R.subarray(e,e+r));Ne.msync(t,o,0,r,n)},doMkdir:function(e,t){return"/"===(e=Ee.normalize(e))[e.length-1]&&(e=e.substr(0,e.length-1)),Ne.mkdir(e,t,0),0},doMknod:function(e,t,r){switch(61440&t){case 32768:case 8192:case 24576:case 4096:case 49152:break;default:return-Oe.EINVAL}return Ne.mknod(e,t,r),0},doReadlink:function(e,t,r){if(r<=0)return-Oe.EINVAL;var n=Ne.readlink(e),o=Math.min(r,P(n)),i=N[t+o];return x(n,t,r+1),N[t+o]=i,o},doAccess:function(e,t){if(-8&t)return-Oe.EINVAL;var r;r=Ne.lookupPath(e,{follow:!0}).node;var n="";return 4&t&&(n+="r"),2&t&&(n+="w"),1&t&&(n+="x"),n&&Ne.nodePermissions(r,n)?-Oe.EACCES:0},doDup:function(e,t,r){var n=Ne.getStream(r);return n&&Ne.close(n),Ne.open(e,t,0,r,r).fd},doReadv:function(e,t,r,n){for(var o=0,i=0;i<r;i++){var a=D[t+8*i>>2],s=D[t+(8*i+4)>>2],u=Ne.read(e,N,a,s,n);if(u<0)return-1;if(o+=u,u<s)break}return o},doWritev:function(e,t,r,n){for(var o=0,i=0;i<r;i++){var a=D[t+8*i>>2],s=D[t+(8*i+4)>>2],u=Ne.write(e,N,a,s,n);if(u<0)return-1;o+=u}return o},varargs:0,get:function(e){return Re.varargs+=4,D[Re.varargs-4>>2]},getStr:function(){return k(Re.get())},getStreamFromFD:function(){var e=Ne.getStream(Re.get());if(!e)throw new Ne.ErrnoError(Oe.EBADF);return e},getSocketFromFD:function(){var e=SOCKFS.getSocket(Re.get());if(!e)throw new Ne.ErrnoError(Oe.EBADF);return e},getSocketAddress:function(e){var t=Re.get(),r=Re.get();if(e&&0===t)return null;var n=__read_sockaddr(t,r);if(n.errno)throw new Ne.ErrnoError(n.errno);return n.addr=DNS.lookup_addr(n.addr)||n.addr,n},get64:function(){var e=Re.get(),t=Re.get();return g(0<=e?0===t:-1===t),e},getZero:function(){g(0===Re.get())}};function Se(){Dt()}var De=te,Ae=(x("GMT",227808,4),227808),Me=re,Ie={},ke=1;function Fe(){return Q}function xe(e){var t=Fe();g(t<e);var r=2147418112;if(r<e)return p("Cannot enlarge memory, asked to go up to "+e+" bytes, but the limit is "+r+" bytes!"),!1;for(var n=Math.max(t,16777216);n<e;)n<=536870912?n=X(2*n,65536):(n=Math.min(X((3*n+2147483648)/4,65536),r))===t&&w("Cannot ask for more memory since we reached the practical limit in browsers (which is just below 2GB), so the request would have failed. Requesting only "+Q);Date.now();var i=o.reallocBuffer(n);return i&&i.byteLength==n?(C(i),B(),Q=n,A[z>>2]=e,!0):(p("Failed to grow the heap from "+t+" bytes to "+n+" bytes, not enough memory!"),i&&p("Expected to get back a buffer of size "+n+" bytes, but instead got back a buffer of size "+i.byteLength),!1)}function Pe(e){return e%4==0&&(e%100!=0||e%400==0)}function Ue(e,t){for(var r=0,n=0;n<=t;r+=e[n++]);return r}var Le=[31,29,31,30,31,30,31,31,30,31,30,31],Xe=[31,28,31,30,31,30,31,31,30,31,30,31];function Ce(e,t){for(var r=new Date(e.getTime());0<t;){var n=Pe(r.getFullYear()),o=r.getMonth(),i=(n?Le:Xe)[o];if(!(t>i-r.getDate()))return r.setDate(r.getDate()+t),r;t-=i-r.getDate()+1,r.setDate(1),o<11?r.setMonth(o+1):(r.setMonth(0),r.setFullYear(r.getFullYear()+1))}return r}if(Ne.staticInit(),G.unshift(function(){o.noFSInit||Ne.init.initialized||Ne.init()}),q.push(function(){Ne.ignorePermissions=!1}),K.push(function(){Ne.quit()}),G.unshift(function(){ye.init()}),K.push(function(){ye.shutdown()}),u){var Be=r(0),He=r(2);ve.staticInit()}function ze(e,t,r){var n=0<r?r:P(e)+1,o=new Array(n),i=F(e,o,0,o.length);return t&&(o.length=i),o}Se=u?function(){var e=t.hrtime();return 1e3*e[0]+e[1]/1e6}:"undefined"!=typeof dateNow?dateNow:"object"==typeof self&&self.performance&&"function"==typeof self.performance.now?function(){return self.performance.now()}:"object"==typeof performance&&"function"==typeof performance.now?function(){return performance.now()}:Date.now,o.wasmTableSize=1367,o.wasmMaxTableSize=1367,o.asmLibraryArg={ga:function(){Dt("Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value "+Q+", (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ")},c:function(e){Dt("Stack overflow! Attempted to allocate "+e+" bytes on the stack, but stack has only "+(H-Ot()+e)+" bytes available!")},X:function(e){p("Invalid function pointer called with signature \'dd\'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)"),p("Build with ASSERTIONS=2 for more info."),Dt(e)},M:function(e){p("Invalid function pointer called with signature \'did\'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)"),p("Build with ASSERTIONS=2 for more info."),Dt(e)},G:function(e){p("Invalid function pointer called with signature \'didd\'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)"),p("Build with ASSERTIONS=2 for more info."),Dt(e)},x:function(e){p("Invalid function pointer called with signature \'ii\'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)"),p("Build with ASSERTIONS=2 for more info."),Dt(e)},o:function(e){p("Invalid function pointer called with signature \'iii\'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)"),p("Build with ASSERTIONS=2 for more info."),Dt(e)},n:function(e){p("Invalid function pointer called with signature \'iiii\'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)"),p("Build with ASSERTIONS=2 for more info."),Dt(e)},m:function(e){p("Invalid function pointer called with signature \'iiiii\'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)"),p("Build with ASSERTIONS=2 for more info."),Dt(e)},l:function(e){p("Invalid function pointer called with signature \'iiiiii\'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)"),p("Build with ASSERTIONS=2 for more info."),Dt(e)},fa:function(e){p("Invalid function pointer called with signature \'iiiiiii\'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)"),p("Build with ASSERTIONS=2 for more info."),Dt(e)},ea:function(e){p("Invalid function pointer called with signature \'iiiiiiii\'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)"),p("Build with ASSERTIONS=2 for more info."),Dt(e)},da:function(e){p("Invalid function pointer called with signature \'iiiiij\'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)"),p("Build with ASSERTIONS=2 for more info."),Dt(e)},ca:function(e){p("Invalid function pointer called with signature \'iiiji\'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)"),p("Build with ASSERTIONS=2 for more info."),Dt(e)},ba:function(e){p("Invalid function pointer called with signature \'jiiji\'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)"),p("Build with ASSERTIONS=2 for more info."),Dt(e)},aa:function(e){p("Invalid function pointer called with signature \'jiji\'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)"),p("Build with ASSERTIONS=2 for more info."),Dt(e)},$:function(e){p("Invalid function pointer called with signature \'v\'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)"),p("Build with ASSERTIONS=2 for more info."),Dt(e)},_:function(e){p("Invalid function pointer called with signature \'vi\'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)"),p("Build with ASSERTIONS=2 for more info."),Dt(e)},Z:function(e){p("Invalid function pointer called with signature \'vii\'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)"),p("Build with ASSERTIONS=2 for more info."),Dt(e)},Y:function(e){p("Invalid function pointer called with signature \'viii\'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)"),p("Build with ASSERTIONS=2 for more info."),Dt(e)},W:function(e){p("Invalid function pointer called with signature \'viiii\'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)"),p("Build with ASSERTIONS=2 for more info."),Dt(e)},V:function(e){p("Invalid function pointer called with signature \'viiiii\'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)"),p("Build with ASSERTIONS=2 for more info."),Dt(e)},U:function(e){p("Invalid function pointer called with signature \'viiiiii\'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)"),p("Build with ASSERTIONS=2 for more info."),Dt(e)},T:function(e){p("Invalid function pointer called with signature \'viiiiiii\'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)"),p("Build with ASSERTIONS=2 for more info."),Dt(e)},S:function(e){p("Invalid function pointer called with signature \'viiiiiiii\'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)"),p("Build with ASSERTIONS=2 for more info."),Dt(e)},R:function(e){p("Invalid function pointer called with signature \'viiiiiiiii\'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)"),p("Build with ASSERTIONS=2 for more info."),Dt(e)},Q:function(e){p("Invalid function pointer called with signature \'viiiiiiiiii\'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)"),p("Build with ASSERTIONS=2 for more info."),Dt(e)},P:function(e){p("Invalid function pointer called with signature \'viiiiiiiiiii\'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)"),p("Build with ASSERTIONS=2 for more info."),Dt(e)},O:function(e){p("Invalid function pointer called with signature \'viiiiiiiiiiii\'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)"),p("Build with ASSERTIONS=2 for more info."),Dt(e)},N:function(e){p("Invalid function pointer called with signature \'viiiiiiiiiiiiii\'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)"),p("Build with ASSERTIONS=2 for more info."),Dt(e)},L:function e(t){var r,n;e.called?(n=D[t>>2],r=D[n>>2]):(e.called=!0,pe.USER=pe.LOGNAME="web_user",pe.PATH="/",pe.PWD="/",pe.HOME="/home/web_user",pe.LANG="C.UTF-8",pe._=o.thisProgram,r=b(1024),n=b(256),D[n>>2]=r,D[t>>2]=n);var i=[],a=0;for(var s in pe)if("string"==typeof pe[s]){var u=s+"="+pe[s];i.push(u),a+=u.length}if(1024<a)throw new Error("Environment size exceeded TOTAL_ENV_SIZE!");for(var c=0;c<i.length;c++)ee(u=i[c],r),D[n+4*c>>2]=r,r+=u.length+1;D[n+4*i.length>>2]=0},K:function(){},k:we,J:function(e,t){Re.varargs=t;try{var r=Re.getStreamFromFD(),n=(Re.get(),Re.get()),o=Re.get(),i=Re.get(),a=n;return Ne.llseek(r,a,i),D[o>>2]=r.position,r.getdents&&0===a&&0===i&&(r.getdents=null),0}catch(e){return void 0!==Ne&&e instanceof Ne.ErrnoError||Dt(e),-e.errno}},j:function(e,t){Re.varargs=t;try{var r=Re.getStreamFromFD(),n=Re.get(),o=Re.get();return Re.doWritev(r,n,o)}catch(e){return void 0!==Ne&&e instanceof Ne.ErrnoError||Dt(e),-e.errno}},i:function(e,t){Re.varargs=t;try{var r=Re.getStreamFromFD();switch(Re.get()){case 0:return(n=Re.get())<0?-Oe.EINVAL:Ne.open(r.path,r.flags,0,n).fd;case 1:case 2:return 0;case 3:return r.flags;case 4:var n=Re.get();return r.flags|=n,0;case 12:case 12:return n=Re.get(),S[n+0>>1]=2,0;case 13:case 14:case 13:case 14:return 0;case 16:case 8:return-Oe.EINVAL;case 9:return we(Oe.EINVAL),-1;default:return-Oe.EINVAL}}catch(e){return void 0!==Ne&&e instanceof Ne.ErrnoError||Dt(e),-e.errno}},I:function(e,t){Re.varargs=t;try{var r=Re.getStreamFromFD(),n=Re.get(),o=Re.get();return Ne.read(r,N,n,o)}catch(e){return void 0!==Ne&&e instanceof Ne.ErrnoError||Dt(e),-e.errno}},H:function(e,t){Re.varargs=t;try{var r=Re.getStr(),n=Re.get(),o=Re.get();return Ne.open(r,n,o).fd}catch(e){return void 0!==Ne&&e instanceof Ne.ErrnoError||Dt(e),-e.errno}},h:function(e,t){Re.varargs=t;try{var r=Re.getStreamFromFD(),n=Re.get();switch(n){case 21509:case 21505:return r.tty?0:-Oe.ENOTTY;case 21510:case 21511:case 21512:case 21506:case 21507:case 21508:return r.tty?0:-Oe.ENOTTY;case 21519:if(!r.tty)return-Oe.ENOTTY;var o=Re.get();return D[o>>2]=0;case 21520:return r.tty?-Oe.EINVAL:-Oe.ENOTTY;case 21531:return o=Re.get(),Ne.ioctl(r,n,o);case 21523:case 21524:return r.tty?0:-Oe.ENOTTY;default:Dt("bad ioctl syscall "+n)}}catch(e){return void 0!==Ne&&e instanceof Ne.ErrnoError||Dt(e),-e.errno}},g:function(e,t){Re.varargs=t;try{var r=Re.getStreamFromFD();return Ne.close(r),0}catch(e){return void 0!==Ne&&e instanceof Ne.ErrnoError||Dt(e),-e.errno}},F:function(){},b:function(){o.abort()},E:function e(){return void 0===e.start&&(e.start=Date.now()),1e3*(Date.now()-e.start)|0},D:function(e,t){var r;if(0===e)r=Date.now();else{if(1!==e||!(u||"undefined"!=typeof dateNow||(c||l)&&self.performance&&self.performance.now))return we(22),-1;r=Se()}return D[t>>2]=r/1e3|0,D[t+4>>2]=r%1e3*1e3*1e3|0,0},C:function(e,t,r,n,o,i){return me[e](t,r,n,o,i)},B:Fe,A:function(e,t,r){R.set(R.subarray(t,t+r),e)},z:xe,y:De,d:function e(t){return 0===t?0:(t=k(t),pe.hasOwnProperty(t)?(e.ret&&_t(e.ret),e.ret=(n=P(r=pe[t])+1,(o=vt(n))&&F(r,N,o,n),o)):0);var r,n,o},w:function(e){var t=Date.now();return D[e>>2]=t/1e3|0,D[e+4>>2]=t%1e3*1e3|0,0},v:function(e,t){var r=new Date(1e3*D[e>>2]);D[t>>2]=r.getUTCSeconds(),D[t+4>>2]=r.getUTCMinutes(),D[t+8>>2]=r.getUTCHours(),D[t+12>>2]=r.getUTCDate(),D[t+16>>2]=r.getUTCMonth(),D[t+20>>2]=r.getUTCFullYear()-1900,D[t+24>>2]=r.getUTCDay(),D[t+36>>2]=0,D[t+32>>2]=0;var n=Date.UTC(r.getUTCFullYear(),0,1,0,0,0,0),o=(r.getTime()-n)/864e5|0;return D[t+28>>2]=o,D[t+40>>2]=Ae,t},f:function(){return function(e){return Math.pow(2,e)}.apply(null,arguments)},u:Me,e:function(e,t){var r=D[e>>2],n=D[e+4>>2];return 0!==t&&(D[t>>2]=0,D[t+4>>2]=0),function(e){var t=e/1e3;if((c||l)&&self.performance&&self.performance.now)for(var r=self.performance.now();self.performance.now()-r<t;);else for(r=Date.now();Date.now()-r<t;);return 0}(1e6*r+n/1e3)},t:function(e){return Ie[e]||0},s:function(e,t){return 0==e?Oe.EINVAL:(D[e>>2]=ke,Ie[ke]=0,ke++,0)},r:function e(t,r){e.seen||(e.seen={}),t in e.seen||(o.dynCall_v(r),e.seen[t]=1)},q:function(e,t){return e in Ie?(Ie[e]=t,0):Oe.EINVAL},p:function(e,t,r,n){var o=D[n+40>>2],i={tm_sec:D[n>>2],tm_min:D[n+4>>2],tm_hour:D[n+8>>2],tm_mday:D[n+12>>2],tm_mon:D[n+16>>2],tm_year:D[n+20>>2],tm_wday:D[n+24>>2],tm_yday:D[n+28>>2],tm_isdst:D[n+32>>2],tm_gmtoff:D[n+36>>2],tm_zone:o?k(o):""},a=k(r),s={"%c":"%a %b %d %H:%M:%S %Y","%D":"%m/%d/%y","%F":"%Y-%m-%d","%h":"%b","%r":"%I:%M:%S %p","%R":"%H:%M","%T":"%H:%M:%S","%x":"%m/%d/%y","%X":"%H:%M:%S"};for(var u in s)a=a.replace(new RegExp(u,"g"),s[u]);var c=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],l=["January","February","March","April","May","June","July","August","September","October","November","December"];function d(e,t,r){for(var n="number"==typeof e?e.toString():e||"";n.length<t;)n=r[0]+n;return n}function f(e,t){return d(e,t,"0")}function h(e,t){function r(e){return e<0?-1:0<e?1:0}var n;return 0===(n=r(e.getFullYear()-t.getFullYear()))&&0===(n=r(e.getMonth()-t.getMonth()))&&(n=r(e.getDate()-t.getDate())),n}function m(e){switch(e.getDay()){case 0:return new Date(e.getFullYear()-1,11,29);case 1:return e;case 2:return new Date(e.getFullYear(),0,3);case 3:return new Date(e.getFullYear(),0,2);case 4:return new Date(e.getFullYear(),0,1);case 5:return new Date(e.getFullYear()-1,11,31);case 6:return new Date(e.getFullYear()-1,11,30)}}function p(e){var t=Ce(new Date(e.tm_year+1900,0,1),e.tm_yday),r=new Date(t.getFullYear(),0,4),n=new Date(t.getFullYear()+1,0,4),o=m(r),i=m(n);return h(o,t)<=0?h(i,t)<=0?t.getFullYear()+1:t.getFullYear():t.getFullYear()-1}var w={"%a":function(e){return c[e.tm_wday].substring(0,3)},"%A":function(e){return c[e.tm_wday]},"%b":function(e){return l[e.tm_mon].substring(0,3)},"%B":function(e){return l[e.tm_mon]},"%C":function(e){return f((e.tm_year+1900)/100|0,2)},"%d":function(e){return f(e.tm_mday,2)},"%e":function(e){return d(e.tm_mday,2," ")},"%g":function(e){return p(e).toString().substring(2)},"%G":function(e){return p(e)},"%H":function(e){return f(e.tm_hour,2)},"%I":function(e){var t=e.tm_hour;return 0==t?t=12:12<t&&(t-=12),f(t,2)},"%j":function(e){return f(e.tm_mday+Ue(Pe(e.tm_year+1900)?Le:Xe,e.tm_mon-1),3)},"%m":function(e){return f(e.tm_mon+1,2)},"%M":function(e){return f(e.tm_min,2)},"%n":function(){return"\\n"},"%p":function(e){return 0<=e.tm_hour&&e.tm_hour<12?"AM":"PM"},"%S":function(e){return f(e.tm_sec,2)},"%t":function(){return"\\t"},"%u":function(e){return new Date(e.tm_year+1900,e.tm_mon+1,e.tm_mday,0,0,0,0).getDay()||7},"%U":function(e){var t=new Date(e.tm_year+1900,0,1),r=0===t.getDay()?t:Ce(t,7-t.getDay()),n=new Date(e.tm_year+1900,e.tm_mon,e.tm_mday);if(h(r,n)<0){var o=Ue(Pe(n.getFullYear())?Le:Xe,n.getMonth()-1)-31,i=31-r.getDate()+o+n.getDate();return f(Math.ceil(i/7),2)}return 0===h(r,t)?"01":"00"},"%V":function(e){var t,r=new Date(e.tm_year+1900,0,4),n=new Date(e.tm_year+1901,0,4),o=m(r),i=m(n),a=Ce(new Date(e.tm_year+1900,0,1),e.tm_yday);return h(a,o)<0?"53":h(i,a)<=0?"01":(t=o.getFullYear()<e.tm_year+1900?e.tm_yday+32-o.getDate():e.tm_yday+1-o.getDate(),f(Math.ceil(t/7),2))},"%w":function(e){return new Date(e.tm_year+1900,e.tm_mon+1,e.tm_mday,0,0,0,0).getDay()},"%W":function(e){var t=new Date(e.tm_year,0,1),r=1===t.getDay()?t:Ce(t,0===t.getDay()?1:7-t.getDay()+1),n=new Date(e.tm_year+1900,e.tm_mon,e.tm_mday);if(h(r,n)<0){var o=Ue(Pe(n.getFullYear())?Le:Xe,n.getMonth()-1)-31,i=31-r.getDate()+o+n.getDate();return f(Math.ceil(i/7),2)}return 0===h(r,t)?"01":"00"},"%y":function(e){return(e.tm_year+1900).toString().substring(2)},"%Y":function(e){return e.tm_year+1900},"%z":function(e){var t=e.tm_gmtoff,r=0<=t;return t=(t=Math.abs(t)/60)/60*100+t%60,(r?"+":"-")+String("0000"+t).slice(-4)},"%Z":function(e){return e.tm_zone},"%%":function(){return"%"}};for(var u in w)0<=a.indexOf(u)&&(a=a.replace(new RegExp(u,"g"),w[u](i)));var E=ze(a,!1);return E.length>t?0:($(E,e),E.length-1)},a:z};var je=o.asm({},o.asmLibraryArg,O),We=je.___cxa_can_catch;je.___cxa_can_catch=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),We.apply(null,arguments)};var Qe=je.___cxa_is_pointer_type;je.___cxa_is_pointer_type=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),Qe.apply(null,arguments)};var Ye=je.___emscripten_environ_constructor;je.___emscripten_environ_constructor=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),Ye.apply(null,arguments)};var Ve=je.___errno_location;je.___errno_location=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),Ve.apply(null,arguments)};var Ge=je.__get_daylight;je.__get_daylight=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),Ge.apply(null,arguments)};var qe=je.__get_environ;je.__get_environ=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),qe.apply(null,arguments)};var Ke=je.__get_timezone;je.__get_timezone=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),Ke.apply(null,arguments)};var Je=je.__get_tzname;je.__get_tzname=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),Je.apply(null,arguments)};var Ze=je._fflush;je._fflush=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),Ze.apply(null,arguments)};var $e=je._free;je._free=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),$e.apply(null,arguments)};var et=je._libffmpeg_decode;je._libffmpeg_decode=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),et.apply(null,arguments)};var tt=je._libffmpeg_free_decoder;je._libffmpeg_free_decoder=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),tt.apply(null,arguments)};var rt=je._libffmpeg_get_heap_cycle_used_size;je._libffmpeg_get_heap_cycle_used_size=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),rt.apply(null,arguments)};var nt=je._libffmpeg_init_context;je._libffmpeg_init_context=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),nt.apply(null,arguments)};var ot=je._libffmpeg_new_decoder;je._libffmpeg_new_decoder=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),ot.apply(null,arguments)};var it=je._libffmpeg_push_data;je._libffmpeg_push_data=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),it.apply(null,arguments)};var at=je._llvm_bswap_i16;je._llvm_bswap_i16=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),at.apply(null,arguments)};var st=je._llvm_bswap_i32;je._llvm_bswap_i32=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),st.apply(null,arguments)};var ut=je._llvm_round_f64;je._llvm_round_f64=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),ut.apply(null,arguments)};var ct=je._malloc;je._malloc=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),ct.apply(null,arguments)};var lt=je._memalign;je._memalign=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),lt.apply(null,arguments)};var dt=je._memmove;je._memmove=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),dt.apply(null,arguments)};var ft=je._rintf;je._rintf=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),ft.apply(null,arguments)};var ht=je._sbrk;je._sbrk=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),ht.apply(null,arguments)};var mt=je.establishStackSpace;je.establishStackSpace=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),mt.apply(null,arguments)};var pt=je.setThrew;je.setThrew=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),pt.apply(null,arguments)};var wt=je.stackAlloc;je.stackAlloc=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),wt.apply(null,arguments)};var Et=je.stackRestore;je.stackRestore=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),Et.apply(null,arguments)};var yt=je.stackSave;je.stackSave=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),yt.apply(null,arguments)},o.asm=je,o.___cxa_can_catch=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),o.asm.ha.apply(null,arguments)},o.___cxa_is_pointer_type=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),o.asm.ia.apply(null,arguments)};var gt=o.___emscripten_environ_constructor=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),o.asm.ja.apply(null,arguments)},_t=(o.___errno_location=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),o.asm.ka.apply(null,arguments)},o.__get_daylight=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),o.asm.la.apply(null,arguments)},o.__get_environ=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),o.asm.ma.apply(null,arguments)},o.__get_timezone=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),o.asm.na.apply(null,arguments)},o.__get_tzname=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),o.asm.oa.apply(null,arguments)},o._fflush=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),o.asm.pa.apply(null,arguments)},o._free=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),o.asm.qa.apply(null,arguments)}),vt=(o._libffmpeg_decode=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),o.asm.ra.apply(null,arguments)},o._libffmpeg_free_decoder=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),o.asm.sa.apply(null,arguments)},o._libffmpeg_get_heap_cycle_used_size=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),o.asm.ta.apply(null,arguments)},o._libffmpeg_init_context=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),o.asm.ua.apply(null,arguments)},o._libffmpeg_new_decoder=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),o.asm.va.apply(null,arguments)},o._libffmpeg_push_data=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),o.asm.wa.apply(null,arguments)},o._llvm_bswap_i16=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),o.asm.xa.apply(null,arguments)},o._llvm_bswap_i32=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),o.asm.ya.apply(null,arguments)},o._llvm_round_f64=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),o.asm.za.apply(null,arguments)},o._malloc=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),o.asm.Aa.apply(null,arguments)}),Tt=(o._memalign=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),o.asm.Ba.apply(null,arguments)},o._memmove=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),o.asm.Ca.apply(null,arguments)},o._rintf=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),o.asm.Da.apply(null,arguments)},o._sbrk=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),o.asm.Ea.apply(null,arguments)},o.establishStackSpace=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),o.asm.Ha.apply(null,arguments)},o.setThrew=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),o.asm.Ia.apply(null,arguments)},o.stackAlloc=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),o.asm.Ja.apply(null,arguments)}),bt=o.stackRestore=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),o.asm.Ka.apply(null,arguments)},Ot=o.stackSave=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),o.asm.La.apply(null,arguments)};function Nt(e){this.name="ExitStatus",this.message="Program terminated with exit("+e+")",this.status=e}function Rt(e){function t(){o.calledRun||(o.calledRun=!0,y||(j(),Z||(Z=!0,Y(G)),j(),Y(q),o.onRuntimeInitialized&&o.onRuntimeInitialized(),g(!o._main,\'compiled without a main, but one is present. if you added it from JS, use Module["onRuntimeInitialized"]\'),function(){if(j(),o.postRun)for("function"==typeof o.postRun&&(o.postRun=[o.postRun]);o.postRun.length;)e=o.postRun.shift(),J.unshift(e);var e;Y(J)}()))}e=e||o.arguments,0<ne||(g(0==(3&H)),A[(H>>2)-1]=34821223,A[(H>>2)-2]=2310721022,function(){if(o.preRun)for("function"==typeof o.preRun&&(o.preRun=[o.preRun]);o.preRun.length;)e=o.preRun.shift(),V.unshift(e);var e;Y(V)}(),0<ne||o.calledRun||(o.setStatus?(o.setStatus("Running..."),setTimeout(function(){setTimeout(function(){o.setStatus("")},1),t()},1)):t(),j()))}o.dynCall_v=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),o.asm.Fa.apply(null,arguments)},o.dynCall_vi=function(){return g(Z,"you need to wait for the runtime to be ready (e.g. wait for main() to be called)"),g(!0,"the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)"),o.asm.Ga.apply(null,arguments)},o.asm=je,o.intArrayFromString||(o.intArrayFromString=function(){Dt("\'intArrayFromString\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.intArrayToString||(o.intArrayToString=function(){Dt("\'intArrayToString\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.ccall||(o.ccall=function(){Dt("\'ccall\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.cwrap||(o.cwrap=function(){Dt("\'cwrap\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.setValue||(o.setValue=function(){Dt("\'setValue\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.getValue||(o.getValue=function(){Dt("\'getValue\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.allocate||(o.allocate=function(){Dt("\'allocate\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.getMemory||(o.getMemory=function(){Dt("\'getMemory\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you")}),o.Pointer_stringify||(o.Pointer_stringify=function(){Dt("\'Pointer_stringify\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.AsciiToString||(o.AsciiToString=function(){Dt("\'AsciiToString\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.stringToAscii||(o.stringToAscii=function(){Dt("\'stringToAscii\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.UTF8ArrayToString||(o.UTF8ArrayToString=function(){Dt("\'UTF8ArrayToString\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.UTF8ToString||(o.UTF8ToString=function(){Dt("\'UTF8ToString\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.stringToUTF8Array||(o.stringToUTF8Array=function(){Dt("\'stringToUTF8Array\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.stringToUTF8||(o.stringToUTF8=function(){Dt("\'stringToUTF8\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.lengthBytesUTF8||(o.lengthBytesUTF8=function(){Dt("\'lengthBytesUTF8\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.UTF16ToString||(o.UTF16ToString=function(){Dt("\'UTF16ToString\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.stringToUTF16||(o.stringToUTF16=function(){Dt("\'stringToUTF16\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.lengthBytesUTF16||(o.lengthBytesUTF16=function(){Dt("\'lengthBytesUTF16\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.UTF32ToString||(o.UTF32ToString=function(){Dt("\'UTF32ToString\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.stringToUTF32||(o.stringToUTF32=function(){Dt("\'stringToUTF32\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.lengthBytesUTF32||(o.lengthBytesUTF32=function(){Dt("\'lengthBytesUTF32\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.allocateUTF8||(o.allocateUTF8=function(){Dt("\'allocateUTF8\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.stackTrace||(o.stackTrace=function(){Dt("\'stackTrace\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.addOnPreRun||(o.addOnPreRun=function(){Dt("\'addOnPreRun\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.addOnInit||(o.addOnInit=function(){Dt("\'addOnInit\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.addOnPreMain||(o.addOnPreMain=function(){Dt("\'addOnPreMain\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.addOnExit||(o.addOnExit=function(){Dt("\'addOnExit\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.addOnPostRun||(o.addOnPostRun=function(){Dt("\'addOnPostRun\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.writeStringToMemory||(o.writeStringToMemory=function(){Dt("\'writeStringToMemory\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.writeArrayToMemory||(o.writeArrayToMemory=function(){Dt("\'writeArrayToMemory\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.writeAsciiToMemory||(o.writeAsciiToMemory=function(){Dt("\'writeAsciiToMemory\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.addRunDependency||(o.addRunDependency=function(){Dt("\'addRunDependency\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you")}),o.removeRunDependency||(o.removeRunDependency=function(){Dt("\'removeRunDependency\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you")}),o.ENV||(o.ENV=function(){Dt("\'ENV\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.FS||(o.FS=function(){Dt("\'FS\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.FS_createFolder||(o.FS_createFolder=function(){Dt("\'FS_createFolder\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you")}),o.FS_createPath||(o.FS_createPath=function(){Dt("\'FS_createPath\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you")}),o.FS_createDataFile||(o.FS_createDataFile=function(){Dt("\'FS_createDataFile\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you")}),o.FS_createPreloadedFile||(o.FS_createPreloadedFile=function(){Dt("\'FS_createPreloadedFile\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you")}),o.FS_createLazyFile||(o.FS_createLazyFile=function(){Dt("\'FS_createLazyFile\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you")}),o.FS_createLink||(o.FS_createLink=function(){Dt("\'FS_createLink\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you")}),o.FS_createDevice||(o.FS_createDevice=function(){Dt("\'FS_createDevice\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you")}),o.FS_unlink||(o.FS_unlink=function(){Dt("\'FS_unlink\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you")}),o.GL||(o.GL=function(){Dt("\'GL\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.dynamicAlloc||(o.dynamicAlloc=function(){Dt("\'dynamicAlloc\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.warnOnce||(o.warnOnce=function(){Dt("\'warnOnce\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.loadDynamicLibrary||(o.loadDynamicLibrary=function(){Dt("\'loadDynamicLibrary\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.loadWebAssemblyModule||(o.loadWebAssemblyModule=function(){Dt("\'loadWebAssemblyModule\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.getLEB||(o.getLEB=function(){Dt("\'getLEB\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.getFunctionTables||(o.getFunctionTables=function(){Dt("\'getFunctionTables\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.alignFunctionTables||(o.alignFunctionTables=function(){Dt("\'alignFunctionTables\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.registerFunctions||(o.registerFunctions=function(){Dt("\'registerFunctions\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.addFunction||(o.addFunction=function(){Dt("\'addFunction\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.removeFunction||(o.removeFunction=function(){Dt("\'removeFunction\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.getFuncWrapper||(o.getFuncWrapper=function(){Dt("\'getFuncWrapper\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.prettyPrint||(o.prettyPrint=function(){Dt("\'prettyPrint\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.makeBigInt||(o.makeBigInt=function(){Dt("\'makeBigInt\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.dynCall||(o.dynCall=function(){Dt("\'dynCall\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.getCompilerSetting||(o.getCompilerSetting=function(){Dt("\'getCompilerSetting\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.stackSave||(o.stackSave=function(){Dt("\'stackSave\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.stackRestore||(o.stackRestore=function(){Dt("\'stackRestore\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.stackAlloc||(o.stackAlloc=function(){Dt("\'stackAlloc\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.establishStackSpace||(o.establishStackSpace=function(){Dt("\'establishStackSpace\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.print||(o.print=function(){Dt("\'print\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.printErr||(o.printErr=function(){Dt("\'printErr\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.getTempRet0||(o.getTempRet0=function(){Dt("\'getTempRet0\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.setTempRet0||(o.setTempRet0=function(){Dt("\'setTempRet0\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}),o.ALLOC_NORMAL||Object.defineProperty(o,"ALLOC_NORMAL",{get:function(){Dt("\'ALLOC_NORMAL\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}}),o.ALLOC_STACK||Object.defineProperty(o,"ALLOC_STACK",{get:function(){Dt("\'ALLOC_STACK\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}}),o.ALLOC_DYNAMIC||Object.defineProperty(o,"ALLOC_DYNAMIC",{get:function(){Dt("\'ALLOC_DYNAMIC\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}}),o.ALLOC_NONE||Object.defineProperty(o,"ALLOC_NONE",{get:function(){Dt("\'ALLOC_NONE\' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")}}),(Nt.prototype=new Error).constructor=Nt,ie=function e(){o.calledRun||Rt(),o.calledRun||(ie=e)},o.run=Rt;var St=[];function Dt(e){o.onAbort&&o.onAbort(e),e=void 0!==e?(m(e),p(e),JSON.stringify(e)):"",y=!0;var t="abort("+e+") at "+L();throw St&&St.forEach(function(r){t=r(t,e)}),t}if(o.abort=Dt,o.preInit)for("function"==typeof o.preInit&&(o.preInit=[o.preInit]);0<o.preInit.length;)o.preInit.pop()();o.noExitRuntime=!0,Rt();var At=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),Mt={libffmpeg_new_decoder:T("libffmpeg_new_decoder","number",[]),libffmpeg_free_decoder:T("libffmpeg_free_decoder","void",["number"]),libffmpeg_init_context:T("libffmpeg_init_context","void",["number"]),libffmpeg_push_data:T("libffmpeg_push_data","void",["number","number","number"]),libffmpeg_decode:T("libffmpeg_decode","number",["number","number"]),libffmpeg_get_heap_cycle_used_size:T("libffmpeg_get_heap_cycle_used_size","number",["number"])},It=function(){this.ctx=Mt.libffmpeg_new_decoder()};It.prototype.initContext=function(){Mt.libffmpeg_init_context(this.ctx)},It.prototype.free=function(){Mt.libffmpeg_free_decoder(this.ctx),this.ctx=null},It.prototype.push_data=function(e){var t=new Uint8Array(e),r=t.length,n=vt(r),o=new Uint8Array(R.buffer,n,r);o.set(t),Mt.libffmpeg_push_data(this.ctx,o.byteOffset,r),_t(o.byteOffset)},It.prototype.get_heap_cycle_used_size=function(){return Mt.libffmpeg_get_heap_cycle_used_size(this.ctx)},It.prototype.decode=function(e){return Mt.libffmpeg_decode(this.ctx,e)},new(function(){function e(t){var r=this;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.appendBuffer=function(e){r.decoder.push_data(e),r.decoder.get_heap_cycle_used_size()>r.initBufferSize&&!r.formatContextParsed&&(r.formatContextParsed=!0,r.decoder.initContext())},this.decode=function(e){var t=performance.now(),n=r.decoder.decode(e),o=performance.now();r.totalDecodedFrameNum+=n,r.totalDecodedTime+=o-t},this.startDecode=function(){r._cancelDecodeId=self.setTimeout(function e(){r._cancelDecodeId=self.setTimeout(e,0),r.decoder.get_heap_cycle_used_size()<r.canDecodedHeapCycleSize||r.imageDataCache.length<r.imageDataMaxCacheLen&&r.formatContextParsed&&r.decode(r.imageDataMaxCacheLen-r.imageDataCache.length)},0)},this.endDecode=function(){self.clearTimeout(r._cancelDecodeId)},this.getImageData=function(e){if(0===r.imageDataCache.length)return console.warn("编码速度或网络速度缓慢，imageDataCache缓存为空"),r.postMessage("bufferEmty"),void(r.imageDataIsEmty=!0);for(var t=0,n=0;n<r.imageDataCache.length;n++){var o=r.imageDataCache[n];if(o.pts>e){t=n;break}r.postMessage("dropRenderFrame",{pts:o.pts})}var i=r.imageDataCache.splice(0,t+1)[t];r.dropFrameNum+=t,r.showFrameNum+=t+1,r.postMessage("imageData",i)},this._messageHandler=function(e){var t=e.data;switch(t.cmd){case"init":r.init();break;case"appendBuffer":r.appendBuffer(t.data);break;case"decode":r.decode(t.data);break;case"getImageData":r.getImageData(t.data);break;case"destroy":r.destroy()}},this.worker=t,this.formatContextParsed=!1,this.initBufferSize=409600,this.canDecodedHeapCycleSize=409600,this.imageDataCache=[],this.imageDataMaxCacheLen=15,this.imageDataIsEmty=!1,this.dropFrameNum=0,this.showFrameNum=0,this.totalDecodedFrameNum=0,this.totalDecodedTime=0,this._cancelDecodeId=null,this.worker.addEventListener("message",this._messageHandler)}return At(e,[{key:"init",value:function(){var e=this;this.decoder=new It,this.startDecode(),this.statistics(),self.imageDataCallback=function(t,r,n,o,i){var a=new Uint8Array(R.buffer,t,r*n*4).slice(0,r*n*4),s=new Uint8ClampedArray(a.buffer),u=new ImageData(s,r,n);e.imageDataCache.push({data:u,pts:o,originPts:i}),e.imageDataCache.length>=e.imageDataMaxCacheLen&&e.imageDataIsEmty&&(e.postMessage("bufferFull"),e.imageDataIsEmty=!1)}}},{key:"statistics",value:function(){var e=this;setInterval(function(){e.postMessage("statistics",{totalDecodedFrameNum:e.totalDecodedFrameNum,totalDecodedTime:e._getFixedNumber(e.totalDecodedTime/1e3),avgDecodeDuration:e._getFixedNumber(e.totalDecodedTime/e.totalDecodedFrameNum),dropFrameNum:e.dropFrameNum,showFrameNum:e.showFrameNum,dropRate:e._getFixedNumber(e.dropFrameNum/e.showFrameNum*100)+"%",heapCycleUsedSize:e.decoder.get_heap_cycle_used_size()})},3e3)}},{key:"destroy",value:function(){this.endDecode(),self.imageDataCallback=null,this.decoder.free(),this.decoder=null}},{key:"postMessage",value:function(e,t,r){this.worker.postMessage({cmd:e,source:t,status:r})}},{key:"_getFixedNumber",value:function(e){return Math.round(100*e)/100}}]),e}())(self)}).call(this,r(1),"node_modules/_@ali_ffmpeg-video@1.0.11@@ali/ffmpeg-video/dist")}]);', r.p + "libffmpeg_worker.js")
        }
    }
    , function(e, t, r) {
        "use strict";
        var n = window.URL || window.webkitURL;
        e.exports = function(e, t) {
            try {
                try {
                    var r;
                    try {
                        (r = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder)).append(e),
                        r = r.getBlob()
                    } catch (t) {
                        r = new Blob([e])
                    }
                    return new Worker(n.createObjectURL(r))
                } catch (t) {
                    return new Worker("data:application/javascript," + encodeURIComponent(e))
                }
            } catch (e) {
                if (!t)
                    throw Error("Inline worker is not supported");
                return new Worker(t)
            }
        }
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = function() {
            function e(e, t) {
                for (var r = 0; r < t.length; r++) {
                    var n = t[r];
                    n.enumerable = n.enumerable || !1,
                    n.configurable = !0,
                    "value"in n && (n.writable = !0),
                    Object.defineProperty(e, n.key, n)
                }
            }
            return function(t, r, n) {
                return r && e(t.prototype, r),
                n && e(t, n),
                t
            }
        }()
          , o = u(r(28))
          , i = u(r(29))
          , a = u(r(33))
          , s = u(r(34));
        function u(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }
        var c = function(e) {
            function t() {
                !function(e, r) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this);
                var e = function(e, t) {
                    if (!e)
                        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return !t || "object" != typeof t && "function" != typeof t ? e : t
                }(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
                return e._bindMp4ParserEvent = function() {
                    e.mp4Parser.on("box", e._parseBoxHandler)
                }
                ,
                e._parseBoxHandler = function(t) {
                    switch (t.type) {
                    case "moof":
                        e.moofs.push(t);
                        break;
                    default:
                        e.mp4[t.type] = t
                    }
                    e.emit("box:" + t.type, t)
                }
                ,
                e.mp4Parser = new i.default,
                e.sampleSteam = new s.default,
                e.moofs = [],
                e.mp4 = {},
                e.sampleListBuilt = !1,
                e._bindMp4ParserEvent(),
                e
            }
            return function(e, t) {
                if ("function" != typeof t && null !== t)
                    throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }),
                t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }(t, o.default),
            n(t, [{
                key: "decode",
                value: function(e) {
                    this.mp4Parser.decode(e),
                    this.sampleSteam.write(e),
                    this.mp4.moov && (this.sampleListBuilt || (this._buildSampleLists(),
                    this.sampleListBuilt = !0),
                    this.readySent || (this.readySent = !0,
                    this.emit("mediaInfo", this._getMediaInfo())),
                    this._processSamples())
                }
            }, {
                key: "_getMediaInfo",
                value: function() {
                    var e = void 0
                      , t = {}
                      , r = void 0
                      , n = void 0
                      , o = void 0
                      , i = (new Date(4,0,1,0,0,0,0).getTime(),
                    this.mp4);
                    if (i.moov)
                        for (t.hasMoov = !0,
                        t.duration = i.moov.mvhd.duration,
                        t.timescale = i.moov.mvhd.timeScale,
                        t.isFragmented = null != i.moov.mvex,
                        t.isFragmented && i.moov.mvex.mehd && (t.fragmentDuration = i.moov.mvex.mehd.fragmentDuration),
                        t.brands = {
                            brand: i.ftyp.brand,
                            brandVersion: i.ftyp.brandVersion,
                            compatibleBrands: i.ftyp.compatibleBrands
                        },
                        t.created = i.mvhd.ctime,
                        t.modified = i.mvhd.mtime,
                        t.tracks = [],
                        t.audioTrack = null,
                        t.videoTrack = null,
                        e = 0; e < i.moov.trak.length; e++) {
                            o = (r = i.moov.trak[e]).mdia.minf.stbl.stsd.entries[0],
                            n = {},
                            t.tracks.push(n),
                            n.id = r.tkhd.trackId,
                            n.name = r.mdia.hdlr.name,
                            n.references = [],
                            r.edts && (n.edits = r.edts.elst.entries),
                            n.created = r.tkhd.ctime,
                            n.modified = r.tkhd.mtime,
                            n.movieDuration = r.tkhd.duration,
                            n.movieTimescale = t.timescale,
                            n.trackWidth = r.tkhd.trackWidth / 65536,
                            n.trackHeight = r.tkhd.trackHeight / 65536,
                            n.timeScale = r.mdia.mdhd.timeScale,
                            n.duration = r.mdia.mdhd.duration,
                            n.samplesDuration = r.samplesDuration,
                            n.codec = (0,
                            a.default)(o),
                            n.kind = r.udta && r.udta.kinds.length ? r.udta.kinds[0] : {
                                schemeURI: "",
                                value: ""
                            },
                            n.nbsamples = r.samples.length,
                            n.size = r.samplesSize,
                            n.bitrate = 8 * n.size * n.timeScale / n.samplesDuration;
                            var s = "soun" === r.mdia.hdlr.handlerType
                              , u = "vide" === r.mdia.hdlr.handlerType;
                            s ? (n.type = "audio",
                            (t.audioTrack = n).audio = {},
                            n.audio.sampleRate = o.sampleRate,
                            n.audio.channelCount = o.channelCount,
                            n.audio.sampleSize = o.sampleSize) : u && (n.type = "video",
                            (t.videoTrack = n).video = {},
                            n.video.width = o.width,
                            n.video.height = o.height)
                        }
                    else
                        t.hasMoov = !1;
                    for (t.mime = "",
                    t.videoTrack ? t.mime += 'video/mp4; codecs="' : t.audioTrack ? t.mime += 'audio/mp4; codecs="' : t.mime += 'application/mp4; codecs="',
                    e = 0; e < t.tracks.length; e++)
                        0 !== e && (t.mime += ","),
                        t.mime += t.tracks[e].codec;
                    return t.mime += '"; profiles="',
                    t.mime += i.ftyp.compatibleBrands.join(),
                    t.mime += '"',
                    t
                }
            }, {
                key: "_processSamples",
                value: function() {
                    for (var e = this.mp4, t = 0; t < e.moov.trak.length; t++) {
                        for (var r = e.moov.trak[t], n = "soun" === r.mdia.hdlr.handlerType, o = "vide" === r.mdia.hdlr.handlerType, i = [], a = [], s = []; r.nextSample < r.samples.length; ) {
                            var u = this._getSample(r, r.nextSample);
                            if (!u)
                                break;
                            i.push(u),
                            r.nextSample++,
                            n ? (a.push(u),
                            this.emit("audio:sample", u)) : o && (s.push(u),
                            this.emit("video:sample", u)),
                            this.emit("sample", u)
                        }
                        a.length && this.emit("audio:samples", a),
                        s.length && this.emit("video:samples", s),
                        this.emit("samples", i)
                    }
                }
            }, {
                key: "_getSample",
                value: function(e, t) {
                    var r = e.samples[t];
                    if (!r)
                        return null;
                    if (r.data)
                        return r;
                    var n = this.sampleSteam.read(r.offset, r.size);
                    return n ? (r.data = n,
                    r) : null
                }
            }, {
                key: "_buildSampleLists",
                value: function() {
                    for (var e = 0; e < this.mp4.moov.trak.length; e++) {
                        var t = this.mp4.moov.trak[e];
                        this._buildTrakSampleLists(t)
                    }
                }
            }, {
                key: "_buildTrakSampleLists",
                value: function(e) {
                    e.samples = [],
                    e.samplesDuration = 0,
                    e.samplesSize = 0,
                    e.nextSample = 0;
                    var t = e.mdia.minf.stbl.stco || e.mdia.minf.stbl.co64
                      , r = e.mdia.minf.stbl.stsc
                      , n = e.mdia.minf.stbl.stsz || e.mdia.minf.stbl.stz2
                      , o = e.mdia.minf.stbl.stts
                      , i = e.mdia.minf.stbl.ctts
                      , a = e.mdia.minf.stbl.stss
                      , s = e.mdia.minf.stbl.stsd
                      , u = (e.mdia.minf.stbl.subs,
                    void e.mdia.minf.stbl.stdp)
                      , c = void 0
                      , l = void 0
                      , f = void 0
                      , d = void 0
                      , h = -1
                      , p = -1
                      , m = -1
                      , v = -1
                      , y = 0;
                    if (this._initSampleGroups(e),
                    void 0 !== n) {
                        var g = void 0;
                        for (g = 0; g < n.entries.length; g++) {
                            var w = {};
                            w.number = g,
                            w.trackId = e.tkhd.trackId,
                            w.timescale = e.mdia.mdhd.timeScale,
                            (e.samples[g] = w).size = n.entries[g],
                            e.samplesSize += w.size,
                            0 === g ? (u = 1,
                            c = 0,
                            w.chunkIndex = u,
                            w.chunkRunIndex = c,
                            l = r.entries[c].samplesPerChunk,
                            f = 0,
                            d = c + 1 < r.entries.length ? r.entries[c + 1].firstChunk - 1 : 1 / 0) : g < l ? (w.chunkIndex = u,
                            w.chunkRunIndex = c) : (u++,
                            f = 0,
                            (w.chunkIndex = u) <= d || (d = ++c + 1 < r.entries.length ? r.entries[c + 1].firstChunk - 1 : 1 / 0),
                            w.chunkRunIndex = c,
                            l += r.entries[c].samplesPerChunk),
                            w.descriptionIndex = r.entries[w.chunkRunIndex].sampleDescriptionId - 1,
                            w.description = s.entries[w.descriptionIndex],
                            w.offset = t.entries[w.chunkIndex - 1] + f,
                            f += w.size,
                            h < g && (p++,
                            h < 0 && (h = 0),
                            h += o.entries[p].count),
                            w.dts = 0 < g ? (e.samples[g - 1].duration = o.entries[p].duration,
                            e.samplesDuration += e.samples[g - 1].duration,
                            e.samples[g - 1].dts + e.samples[g - 1].duration) : 0,
                            w.cts = i ? (m <= g && (v++,
                            m < 0 && (m = 0),
                            m += i.entries[v].count),
                            e.samples[g].dts + i.entries[v].duration) : w.dts,
                            a ? g == (a.entries[y] && a.entries[y].sampleNumber - 1) ? (w.isSync = !0,
                            y++) : (w.isSync = !1,
                            w.degradationPriority = 0) : w.isSync = !0,
                            w.flags = {
                                isLeading: 0,
                                dependsOn: 1,
                                isDependedOn: 0,
                                hasRedundancy: 0
                            }
                        }
                        0 < g && (e.samples[g - 1].duration = Math.max(e.mdia.mdhd.duration - e.samples[g - 1].dts, 0),
                        e.samplesDuration += e.samples[g - 1].duration)
                    }
                }
            }, {
                key: "_initSampleGroups",
                value: function(e, t) {
                    t && (t.sampleGroupsInfo = []),
                    e.sampleGroupsInfo || (e.sampleGroupsInfo = [])
                }
            }]),
            t
        }();
        t.default = c,
        e.exports = t.default
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = function() {
            function e(e, t) {
                for (var r = 0; r < t.length; r++) {
                    var n = t[r];
                    n.enumerable = n.enumerable || !1,
                    n.configurable = !0,
                    "value"in n && (n.writable = !0),
                    Object.defineProperty(e, n.key, n)
                }
            }
            return function(t, r, n) {
                return r && e(t.prototype, r),
                n && e(t, n),
                t
            }
        }()
          , o = function() {
            function e() {
                !function(e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, e)
            }
            return n(e, [{
                key: "on",
                value: function(e, t) {
                    return this._events || (this._events = {}),
                    this._events[e] || (this._events[e] = []),
                    -1 !== !this._events[e].indexOf(t) && "function" == typeof t && this._events[e].push(t),
                    this
                }
            }, {
                key: "emit",
                value: function(e) {
                    if (this._events && this._events[e]) {
                        for (var t = Array.prototype.slice.call(arguments, 1) || [], r = this._events[e], n = 0, o = r.length; n < o; n++)
                            r[n].apply(this, t);
                        return this
                    }
                }
            }, {
                key: "off",
                value: function(e, t) {
                    if (e || t || (this._events = {}),
                    e && !t && delete this._events[e],
                    e && t) {
                        var r = this._events[e]
                          , n = r.indexOf(t);
                        r.splice(n, 1)
                    }
                    return this
                }
            }]),
            e
        }();
        t.default = o,
        e.exports = t.default
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = function() {
            function e(e, t) {
                for (var r = 0; r < t.length; r++) {
                    var n = t[r];
                    n.enumerable = n.enumerable || !1,
                    n.configurable = !0,
                    "value"in n && (n.writable = !0),
                    Object.defineProperty(e, n.key, n)
                }
            }
            return function(t, r, n) {
                return r && e(t.prototype, r),
                n && e(t, n),
                t
            }
        }()
          , o = s(r(3))
          , i = s(r(1))
          , a = s(r(10));
        function s(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }
        var u = function(e) {
            function t() {
                !function(e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, t);
                var e = function(e, t) {
                    if (!e)
                        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return !t || "object" != typeof t && "function" != typeof t ? e : t
                }(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
                return e._buffer = null,
                e
            }
            return function(e, t) {
                if ("function" != typeof t && null !== t)
                    throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }),
                t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }(t, o.default),
            n(t, [{
                key: "decode",
                value: function(e) {
                    var t = this;
                    for (this._buffer ? this._buffer = i.default.concat(this._buffer, e) : this._buffer = e.slice(); ; ) {
                        var r = new a.default;
                        r.on("data", function(e) {
                            t.emit("box", e)
                        });
                        var n = r.decode(this._buffer);
                        if (!n)
                            return;
                        this._buffer = n
                    }
                }
            }]),
            t
        }();
        t.default = u,
        e.exports = t.default
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = function() {
            function e(e, t) {
                for (var r = 0; r < t.length; r++) {
                    var n = t[r];
                    n.enumerable = n.enumerable || !1,
                    n.configurable = !0,
                    "value"in n && (n.writable = !0),
                    Object.defineProperty(e, n.key, n)
                }
            }
            return function(t, r, n) {
                return r && e(t.prototype, r),
                n && e(t, n),
                t
            }
        }()
          , o = u(r(1))
          , i = u(r(3))
          , a = u(r(10))
          , s = u(r(31));
        function u(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }
        var c = function(e) {
            function t(e, r) {
                !function(e, r) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this);
                var n = function(e, t) {
                    if (!e)
                        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return !t || "object" != typeof t && "function" != typeof t ? e : t
                }(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
                return n.type = e,
                n.length = r,
                n.info = null,
                n
            }
            return function(e, t) {
                if ("function" != typeof t && null !== t)
                    throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }),
                t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }(t, i.default),
            n(t, [{
                key: "decode",
                value: function(e) {
                    if (this[this.type]) {
                        var t = this[this.type](e);
                        return this.info = t,
                        e.slice(this.length)
                    }
                }
            }, {
                key: "ftyp",
                value: function(e) {
                    for (var t = {
                        brand: o.default.readToString(e.slice(0, 4)),
                        brandVersion: o.default.readUInt32BE(e, 4),
                        compatibleBrands: []
                    }, r = 8; r < this.length; r += 4)
                        t.compatibleBrands.push(o.default.readToString(e.slice(r, r + 4)));
                    return t
                }
            }, {
                key: "mvhd",
                value: function(e) {
                    return {
                        ctime: o.default.readDate(e, 0),
                        mtime: o.default.readDate(e, 4),
                        timeScale: o.default.readUInt32BE(e, 8),
                        duration: o.default.readUInt32BE(e, 12),
                        preferredRate: o.default.readFixed32(e, 16),
                        preferredVolume: o.default.readFixed16(e, 20),
                        nextTrackId: o.default.readUInt32BE(e, 92)
                    }
                }
            }, {
                key: "tkhd",
                value: function(e) {
                    return {
                        ctime: o.default.readDate(e, 0),
                        mtime: o.default.readDate(e, 4),
                        trackId: o.default.readUInt32BE(e, 8),
                        duration: o.default.readUInt32BE(e, 16),
                        trackWidth: o.default.readUInt32BE(e, 72),
                        trackHeight: o.default.readUInt32BE(e, 76)
                    }
                }
            }, {
                key: "mdhd",
                value: function(e) {
                    return {
                        ctime: o.default.readDate(e, 0),
                        mtime: o.default.readDate(e, 4),
                        timeScale: o.default.readUInt32BE(e, 8),
                        duration: o.default.readUInt32BE(e, 12)
                    }
                }
            }, {
                key: "vmhd",
                value: function(e) {
                    return {
                        graphicsMode: o.default.readUInt16BE(e, 0),
                        opcolor: [o.default.readUInt16BE(e, 2), o.default.readUInt16BE(e, 4), o.default.readUInt16BE(e, 6)]
                    }
                }
            }, {
                key: "smhd",
                value: function(e) {
                    return {
                        balance: o.default.readUInt16BE(e, 0)
                    }
                }
            }, {
                key: "stsd",
                value: function(e) {
                    var t = this
                      , r = o.default.readUInt32BE(e, 0)
                      , n = [];
                    e = e.slice(4);
                    for (var i = 0; i < r; i++) {
                        var s = new a.default;
                        s.on("data", function(e) {
                            t.emit("data", e)
                        }),
                        e = s.decode(e),
                        n.push(s.toJSON())
                    }
                    return {
                        entries: n
                    }
                }
            }, {
                key: "avc1",
                value: function(e) {
                    var t = this
                      , r = Math.min(o.default.readUInt8(e, 42), 31)
                      , n = {
                        dataReferenceIndex: o.default.readUInt16BE(e, 6),
                        width: o.default.readUInt16BE(e, 24),
                        height: o.default.readUInt16BE(e, 26),
                        hResolution: o.default.readUInt32BE(e, 28),
                        vResolution: o.default.readUInt32BE(e, 32),
                        frameCount: o.default.readUInt16BE(40),
                        compressorName: o.default.readToString(e.slice(43, 43 + r)),
                        depth: e.readUInt16BE(e, 74)
                    }
                      , i = {};
                    e = e.slice(78);
                    for (var s = 78; 8 <= this.length - s; ) {
                        var u = new a.default;
                        u.on("data", function(e) {
                            t.emit("data", e)
                        }),
                        e = u.decode(e);
                        var c = i[u.boxType];
                        Array.isArray(c) ? i.push(u.toJSON()) : i[u.boxType] = c ? [c, u.toJSON()] : u.toJSON(),
                        s += u.boxSize
                    }
                    return Object.assign(n, i),
                    n
                }
            }, {
                key: "avcC",
                value: function(e) {
                    return {
                        mimeCodec: o.default.readToString(e.slice(1, 4)),
                        buffer: e.slice(0, this.length)
                    }
                }
            }, {
                key: "hev1",
                value: function(e) {
                    var t = this
                      , r = {
                        dataReferenceIndex: o.default.readUInt16BE(e, 7),
                        width: o.default.readUInt16BE(e, 24),
                        height: o.default.readUInt16BE(e, 26),
                        horizresolution: o.default.readUInt32BE(e, 29),
                        vertresolution: o.default.readUInt32BE(e, 33),
                        frameCount: o.default.readUInt16BE(e, 41)
                    }
                      , n = Math.min(31, o.default.readUInt8(e, 42));
                    r.compressorName = o.default.readToString(e.slice(41, n)),
                    r.depth = o.default.readUInt16BE(e, 76);
                    var i = {};
                    e = e.slice(78);
                    for (var s = 78; 8 <= this.length - s; ) {
                        var u = new a.default;
                        u.on("data", function(e) {
                            t.emit("data", e)
                        }),
                        e = u.decode(e);
                        var c = i[u.boxType];
                        Array.isArray(c) ? i.push(u.toJSON()) : i[u.boxType] = c ? [c, u.toJSON()] : u.toJSON(),
                        s += u.boxSize
                    }
                    return Object.assign(r, i),
                    r
                }
            }, {
                key: "mp4a",
                value: function(e) {
                    var t = this
                      , r = (Math.min(o.default.readUInt8(e, 42), 31),
                    {
                        dataReferenceIndex: o.default.readUInt16BE(e, 6),
                        channelCount: o.default.readUInt16BE(e, 16),
                        sampleSize: o.default.readUInt16BE(e, 18),
                        sampleRate: o.default.readUInt16BE(e, 24)
                    })
                      , n = {}
                      , i = 28;
                    for (e = e.slice(i); 8 <= this.length - i; ) {
                        var s = new a.default;
                        s.on("data", function(e) {
                            t.emit("data", e)
                        }),
                        e = s.decode(e);
                        var u = n[s.boxType];
                        Array.isArray(u) ? n.push(s.toJSON()) : n[s.boxType] = u ? [u, s.toJSON()] : s.toJSON(),
                        i += s.boxSize
                    }
                    return Object.assign(r, n),
                    r
                }
            }, {
                key: "hvcC",
                value: function(e) {
                    var t = o.default.readUInt8(e, 1)
                      , r = {
                        configurationVersion: o.default.readUInt8(e, 0),
                        generalProfileSpace: t >> 6,
                        generalTierFlag: (32 & t) >> 5,
                        generalProfileIdc: 31 & t,
                        generalProfileCompatibility: o.default.readUInt32BE(e, 2),
                        generalConstraintIndicator: e.slice(6, 12),
                        generalLevelIdc: o.default.readUInt8(e, 12),
                        minSpatialSegmentationIdc: 255 & o.default.readUInt16BE(e, 13),
                        parallelismType: 3 & o.default.readUInt8(e, 15),
                        chromaFormatIdc: 3 & o.default.readUInt8(e, 16),
                        bitDepthLumaMinus8: 7 & o.default.readUInt8(e, 17),
                        bitDepthChromaMinus8: 7 & o.default.readUInt8(e, 18),
                        avgFrameRate: o.default.readUInt16BE(e, 19)
                    };
                    t = o.default.readUInt8(e, 21),
                    r.constantFrameRate = t >> 6,
                    r.numTemporalLayers = (13 & t) >> 3,
                    r.temporalIdNested = (4 & t) >> 2,
                    r.lengthSizeMinusOne = 3 & t,
                    r.naluArrays = [];
                    for (var n = o.default.readUInt8(e, 22), i = 23, a = 0; a < n; a++) {
                        var s = [];
                        r.naluArrays.push(s),
                        t = o.default.readUInt8(e, i),
                        s.completeness = (128 & t) >> 7,
                        s.naluType = 63 & t;
                        var u = o.default.readUInt16BE(e, i + 1);
                        i += 3;
                        for (var c = 0; c < u; c++) {
                            var l = {};
                            s.push(l);
                            var f = o.default.readUInt16BE(e, i);
                            l.data = e.slice(i + 2, i + 2 + f),
                            i += 2 + f
                        }
                    }
                    return r
                }
            }, {
                key: "hvc1",
                value: function(e) {
                    return this.hev1(e)
                }
            }, {
                key: "esds",
                value: function(e) {
                    var t = s.default.decode(e, 0, this.length)
                      , r = ("ESDescriptor" === t.tagName ? t : {}).DecoderConfigDescriptor || {}
                      , n = r.oti || 0
                      , i = r.DecoderSpecificInfo
                      , a = i ? (248 & o.default.readUInt8(i.buffer, 0)) >> 3 : 0
                      , u = null;
                    return n && (u = n.toString(16),
                    a && (u += "." + a)),
                    {
                        mimeCodec: u,
                        dsi: i,
                        oti: n,
                        buffer: e.slice(0, this.length)
                    }
                }
            }, {
                key: "stsz",
                value: function(e) {
                    for (var t = o.default.readUInt32BE(e, 0), r = o.default.readUInt32BE(e, 4), n = [], i = 0; i < r; i++)
                        0 === t ? n.push(o.default.readUInt32BE(e, 4 * i + 8)) : n.push(t);
                    return {
                        entries: n
                    }
                }
            }, {
                key: "stco",
                value: function(e) {
                    for (var t = o.default.readUInt32BE(e, 0), r = [], n = 0; n < t; n++)
                        r.push(o.default.readUInt32BE(e, 4 * n + 4));
                    return {
                        entries: r
                    }
                }
            }, {
                key: "stts",
                value: function(e) {
                    for (var t = o.default.readUInt32BE(e, 0), r = [], n = 0; n < t; n++) {
                        var i = 8 * n + 4;
                        r[n] = {
                            count: o.default.readUInt32BE(e, i),
                            duration: o.default.readUInt32BE(e, i + 4)
                        }
                    }
                    return {
                        entries: r
                    }
                }
            }, {
                key: "ctts",
                value: function(e) {
                    for (var t = o.default.readUInt32BE(e, 0), r = [], n = 0; n < t; n++) {
                        var i = 8 * n + 4;
                        r[n] = {
                            count: o.default.readUInt32BE(e, i),
                            duration: o.default.readUInt32BE(e, i + 4)
                        }
                    }
                    return {
                        entries: r
                    }
                }
            }, {
                key: "stsc",
                value: function(e) {
                    for (var t = o.default.readUInt32BE(e, 0), r = [], n = 0; n < t; n++) {
                        var i = 12 * n + 4;
                        r[n] = {
                            firstChunk: o.default.readUInt32BE(e, i),
                            samplesPerChunk: o.default.readUInt32BE(e, i + 4),
                            sampleDescriptionId: o.default.readUInt32BE(e, i + 8)
                        }
                    }
                    return {
                        entries: r
                    }
                }
            }, {
                key: "stss",
                value: function(e) {
                    for (var t = o.default.readUInt32BE(e, 0), r = [], n = 0; n < t; n++) {
                        var i = 4 * n + 4;
                        r[n] = {
                            sampleNumber: o.default.readUInt32BE(e, i)
                        }
                    }
                    return {
                        entries: r
                    }
                }
            }, {
                key: "dref",
                value: function(e) {
                    for (var t = o.default.readUInt32BE(e, 0), r = [], n = 4, i = 0; i < t; i++) {
                        var a = o.default.readUInt32BE(e, n)
                          , s = o.default.readToString(e.slice(n + 4, n + 8))
                          , u = e.slice(n + 8, n + a);
                        n += a,
                        r[i] = {
                            type: s,
                            buf: u
                        }
                    }
                    return {
                        entries: r
                    }
                }
            }, {
                key: "elst",
                value: function(e) {
                    for (var t = o.default.readUInt32BE(e, 0), r = [], n = 0; n < t; n++) {
                        var i = 12 * n + 4;
                        r[n] = {
                            trackDuration: o.default.readUInt32BE(e, i),
                            mediaTime: o.default.readUInt32BE(e, i + 4),
                            mediaRate: o.default.readFixed32(e, i + 8)
                        }
                    }
                    return {
                        entries: r
                    }
                }
            }, {
                key: "hdlr",
                value: function(e) {
                    return {
                        handlerType: o.default.readToString(e.slice(4, 8)),
                        name: o.default.readToString(e.slice(20, this.length))
                    }
                }
            }, {
                key: "mehd",
                value: function(e) {
                    return {
                        fragmentDuration: o.default.readUInt32BE(e, 0)
                    }
                }
            }, {
                key: "trex",
                value: function(e) {
                    return {
                        trackId: o.default.readUInt32BE(e, 0),
                        defaultSampleDescriptionIndex: o.default.readUInt32BE(e, 4),
                        defaultSampleDuration: o.default.readUInt32BE(e, 8),
                        defaultSampleSize: o.default.readUInt32BE(e, 12),
                        defaultSampleFlags: o.default.readUInt32BE(e, 16)
                    }
                }
            }, {
                key: "mfhd",
                value: function(e) {
                    return {
                        sequenceNumber: o.default.readUInt32BE(e, 0)
                    }
                }
            }, {
                key: "mdat",
                value: function(e) {
                    return {
                        buffer: e.slice(0, this.length)
                    }
                }
            }, {
                key: "toJSON",
                value: function() {
                    return this.info
                }
            }]),
            t
        }();
        t.default = c,
        e.exports = t.default
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n, o = (n = r(1)) && n.__esModule ? n : {
            default: n
        }, i = {
            3: "ESDescriptor",
            4: "DecoderConfigDescriptor",
            5: "DecoderSpecificInfo",
            6: "SLConfigDescriptor"
        }, a = {
            decode: function(e, t, r) {
                for (var n = o.default.readUInt8(e, t), s = t + 1, u = void 0, c = 0; c = c << 7 | 127 & (u = o.default.readUInt8(e, s++)),
                128 & u; )
                    ;
                var l = void 0
                  , f = i[n];
                return (l = a["_decode" + f] ? a["_decode" + f](e, s, r) : {
                    buffer: e.slice(s, s + c)
                }).tag = n,
                l.tagName = f,
                l.length = s - t + c,
                l.contentsLen = c,
                l
            },
            _decodeESDescriptor: function(e, t, r) {
                var n = o.default.readUInt8(e, t + 2)
                  , i = t + 3;
                return 128 & n && (i += 2),
                64 & n && (i += o.default.readUInt8(e, i) + 1),
                32 & n && (i += 2),
                a._decodeDescriptorArray(e, i, r)
            },
            _decodeDescriptorArray: function(e, t, r) {
                for (var n = t, o = {}; n + 2 <= r; ) {
                    var s = a.decode(e, n, r);
                    n += s.length,
                    o[i[s.tag] || "Descriptor" + s.tag] = s
                }
                return o
            },
            _decodeDecoderConfigDescriptor: function(e, t, r) {
                var n = o.default.readUInt8(e, t)
                  , i = a._decodeDescriptorArray(e, t + 13, r);
                return i.oti = n,
                i
            }
        };
        t.default = a,
        e.exports = t.default
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }),
        t.CONTAINERS = {
            moov: ["mvhd", "meta", "traks", "mvex"],
            trak: ["tkhd", "tref", "trgr", "edts", "meta", "mdia", "udta"],
            edts: ["elst"],
            mdia: ["mdhd", "hdlr", "elng", "minf"],
            minf: ["vmhd", "smhd", "hmhd", "sthd", "nmhd", "dinf", "stbl"],
            dinf: ["dref"],
            stbl: ["stsd", "stts", "ctts", "cslg", "stsc", "stsz", "stz2", "stco", "co64", "stss", "stsh", "padb", "stdp", "sdtp", "sbgps", "sgpds", "subss", "saizs", "saios"],
            mvex: ["mehd", "trexs", "leva"],
            moof: ["mfhd", "meta", "trafs"],
            traf: ["tfhd", "tfdt", "trun", "sbgps", "sgpds", "subss", "saizs", "saios", "meta"]
        },
        t.FULL_BOX_TYPES = ["mvhd", "tkhd", "mdhd", "vmhd", "smhd", "stsd", "esds", "stsz", "stco", "co64", "stss", "stts", "ctts", "stsc", "dref", "elst", "hdlr", "mehd", "trex", "mfhd", "tfhd", "tfdt", "trun"],
        t.BOX_TYPES = ["avc1", "avcC", "btrt", "hvcC", "hvc1", "dinf", "co64", "dref", "elst", "esds", "mehd", "ftyp", "hdlr", "mdat", "ctts", "stss", "mdhd", "mdia", "mfhd", "minf", "moof", "moov", "mp4a", "hev1", "mvex", "mvhd", "sdtp", "stbl", "stco", "stsc", "stsd", "stsz", "stts", "tfdt", "tfhd", "traf", "trak", "trun", "trex", "tkhd", "vmhd", "smhd"]
    }
    , function(e, t, r) {
        "use strict";
        function n(e, t) {
            var r = Number(e).toString(16);
            for (t = null == t ? t = 2 : t; r.length < t; )
                r = "0" + r;
            return r
        }
        function o(e) {
            return e.type.replace(".", "")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }),
        t.default = function(e) {
            var t, r, i = "";
            switch (e.type) {
            case "mp4a":
                r = o(t = e),
                i = t.esds && t.esds.mimeCodec ? r + "." + t.esds.mimeCodec : r;
                break;
            case "hev1":
                i = function(e) {
                    var t = o(e);
                    if (t += ".",
                    !e.hvcC)
                        return t;
                    switch (e.hvcC.hvgeneralProfileSpace) {
                    case 0:
                        t += "";
                        break;
                    case 1:
                        t += "A";
                        break;
                    case 2:
                        t += "B";
                        break;
                    case 3:
                        t += "C"
                    }
                    t += e.hvcC.generalProfileIdc,
                    t += ".";
                    for (var r = e.hvcC.generalProfileCompatibility, i = 0, a = 0; a < 32 && (i |= 1 & r,
                    31 != a); a++)
                        i <<= 1,
                        r >>= 1;
                    t += n(i, 0),
                    t += ".",
                    0 === e.hvcC.generalTierFlag ? t += "L" : t += "H",
                    t += e.hvcC.generalLevelIdc;
                    for (var s = !1, u = "", c = 5; 0 <= c; c--)
                        (e.hvcC.generalConstraintIndicator[c] || s) && (u = "." + n(e.hvcC.generalConstraintIndicator[c], 0) + u,
                        s = !0);
                    return t + u
                }(e)
            }
            return i
        }
        ,
        e.exports = t.default
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n, o = function() {
            function e(e, t) {
                for (var r = 0; r < t.length; r++) {
                    var n = t[r];
                    n.enumerable = n.enumerable || !1,
                    n.configurable = !0,
                    "value"in n && (n.writable = !0),
                    Object.defineProperty(e, n.key, n)
                }
            }
            return function(t, r, n) {
                return r && e(t.prototype, r),
                n && e(t, n),
                t
            }
        }(), i = (n = r(35)) && n.__esModule ? n : {
            default: n
        }, a = function() {
            function e() {
                var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {
                    isLive: !1
                };
                !function(e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, e),
                this.buffer = new ArrayBuffer(0),
                this.startPosition = 0,
                this.isLive = t.isLive
            }
            return o(e, [{
                key: "write",
                value: function(e) {
                    this.buffer = i.default.concat(this.buffer, e)
                }
            }, {
                key: "read",
                value: function(e, t) {
                    var r = e - this.startPosition
                      , n = r + t;
                    if (n > this.buffer.byteLength)
                        return !1;
                    var o = this.buffer.slice(r, n);
                    return this.isLive && (this.buffer = this.buffer.slice(n),
                    this.startPosition = e + t),
                    o
                }
            }]),
            e
        }();
        t.default = a,
        e.exports = t.default
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = {
            concat: function() {
                for (var e = arguments.length, t = Array(e), r = 0; r < e; r++)
                    t[r] = arguments[r];
                var n = t.reduce(function(e, t) {
                    return e + t.byteLength
                }, 0)
                  , o = new Uint8Array(n)
                  , i = 0;
                return t.forEach(function(e) {
                    o.set(new Uint8Array(e), i),
                    i += e.byteLength
                }),
                o.buffer
            },
            readUInt32BE: function(e, t) {
                var r = new Uint8Array(e);
                return r[t] << 24 | r[t + 1] << 16 | r[t + 2] << 8 | r[t + 3]
            },
            readUInt24BE: function(e, t) {
                var r = new Uint8Array(e);
                return r[t] << 16 | r[t + 1] << 8 | r[t + 2]
            },
            readUInt16BE: function(e, t) {
                var r = new Uint8Array(e);
                return r[t] << 8 | r[t + 1]
            },
            readUInt8: function(e, t) {
                return new Uint8Array(e)[t]
            },
            readToString: function(e) {
                var t = new Uint8Array(e)
                  , r = String.fromCharCode.apply(String, function(e) {
                    if (Array.isArray(e)) {
                        for (var t = 0, r = Array(e.length); t < e.length; t++)
                            r[t] = e[t];
                        return r
                    }
                    return Array.from(e)
                }(t));
                return decodeURIComponent(escape(r))
            },
            readDate: function(e, t) {
                return new Date(1e3 * n.readUInt32BE(e, t) - 20828448e5)
            },
            readFixed32: function(e, t) {
                return n.readUInt16BE(e, t) + n.readUInt16BE(e, t + 2) / 65536
            },
            readFixed16: function(e, t) {
                return n.readUInt8(e, t) + n.readUInt8(e, t + 1) / 256
            }
        };
        t.default = n,
        e.exports = t.default
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e
        }
        : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        }
          , o = {
            v: function(e, t) {
                1 === arguments.length && (t = e,
                e = o.GLOBAL_TAG),
                e && !o.FORCE_GLOBAL_TAG || (e = o.GLOBAL_TAG),
                "object" === (void 0 === t ? "undefined" : n(t)) && (t = JSON.stringify(t, null, 2));
                var r = "[" + e + "] > " + t;
                this.fire("info", r),
                o.ENABLE_VERBOSE
            },
            err: function(e, t) {
                1 === arguments.length && (t = e,
                e = o.GLOBAL_TAG),
                e && !o.FORCE_GLOBAL_TAG || (e = o.GLOBAL_TAG),
                "object" === (void 0 === t ? "undefined" : n(t)) && (t = JSON.stringify(t, null, 2));
                var r = "[" + e + "] > " + t;
                this.fire("error", r),
                o.ENABLE_VERBOSE && console.error(r)
            },
            on: function(e, t) {
                return this._events || (this._events = {}),
                this._events[e] || (this._events[e] = []),
                -1 !== !this._events[e].indexOf(t) && "function" == typeof t && this._events[e].push(t),
                this
            },
            fire: function(e) {
                var t = Array.prototype.slice.call(arguments, 1) || [];
                if (this._events && this._events[e]) {
                    for (var r = this._events[e], n = 0, o = r.length; n < o; n++)
                        r[n].apply(this, t);
                    return this
                }
            },
            ENABLE_VERBOSE: !0,
            GLOBAL_TAG: "hevc",
            FORCE_GLOBAL_TAG: !1
        };
        window.PLAYER_HEVC = o,
        t.default = o,
        e.exports = t.default
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n, o = function() {
            function e(e, t) {
                for (var r = 0; r < t.length; r++) {
                    var n = t[r];
                    n.enumerable = n.enumerable || !1,
                    n.configurable = !0,
                    "value"in n && (n.writable = !0),
                    Object.defineProperty(e, n.key, n)
                }
            }
            return function(t, r, n) {
                return r && e(t.prototype, r),
                n && e(t, n),
                t
            }
        }(), i = (n = r(4)) && n.__esModule ? n : {
            default: n
        }, a = function(e) {
            function t() {
                return function(e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, t),
                function(e, t) {
                    if (!e)
                        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return !t || "object" != typeof t && "function" != typeof t ? e : t
                }(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
            }
            return function(e, t) {
                if ("function" != typeof t && null !== t)
                    throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }),
                t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }(t, i.default),
            o(t, [{
                key: "init",
                value: function() {
                    this.context = t.CachedContext = t.CachedContext || new (window.AudioContext || window.webkitAudioContext),
                    "suspended" === this.context.state && this.emit("suspendChange", !0),
                    this.gain = this.context.createGain(),
                    this.destination = this.gain,
                    this.gain.connect(this.context.destination),
                    this.context._connections = (this.context._connections || 0) + 1,
                    this.startTime = 0,
                    this.buffer = null,
                    this.wallclockStartTime = 0,
                    this.enabled = !0,
                    Object.defineProperty(this, "enqueuedTime", {
                        get: this.getEnqueuedTime
                    })
                }
            }, {
                key: "setOptions",
                value: function(e) {
                    this.options = e
                }
            }, {
                key: "destroy",
                value: function() {
                    this.gain.disconnect(),
                    this.context._connections--,
                    0 === this.context._connections && (this.context.close(),
                    t.CachedContext = null)
                }
            }, {
                key: "play",
                value: function(e) {
                    var t = this.options
                      , r = t.sampleRate
                      , n = t.channelCount
                      , o = t.volume;
                    if (this.enabled) {
                        this.gain.gain.value = o;
                        for (var i = this.context.createBuffer(2, e.length / 2, r), a = new Array(n), s = 0; s < n; s++)
                            a[s] = i.getChannelData(s);
                        for (var u = 0; u < i.length; u++)
                            for (var c = 0; c < n; c++)
                                a[c][u] = e[u * n + c];
                        var l = this.context.createBufferSource();
                        l.buffer = i,
                        l.connect(this.destination);
                        var f = this.context.currentTime
                          , d = i.duration;
                        this.startTime < f && (this.startTime = f,
                        this.wallclockStartTime = performance.now() / 1e3),
                        l.start(this.startTime),
                        this.startTime += d,
                        this.wallclockStartTime += d
                    }
                }
            }, {
                key: "reset",
                value: function() {
                    this.resetEnqueuedTime()
                }
            }, {
                key: "getEnqueuedTime",
                value: function() {
                    return Math.max(this.wallclockStartTime - performance.now() / 1e3, 0)
                }
            }, {
                key: "resetEnqueuedTime",
                value: function() {
                    this.startTime = this.context.currentTime,
                    this.wallclockStartTime = performance.now() / 1e3
                }
            }]),
            t
        }();
        a.IsSupported = function() {
            return window.AudioContext || window.webkitAudioContext
        }
        ,
        t.default = a,
        e.exports = t.default
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = void 0
          , o = void 0;
        void 0 !== document.hidden ? (n = "hidden",
        o = "visibilitychange") : void 0 !== document.msHidden ? (n = "msHidden",
        o = "msvisibilitychange") : void 0 !== document.webkitHidden && (n = "webkitHidden",
        o = "webkitvisibilitychange"),
        t.default = {
            VISIBILITY_CHANGE: o,
            VISIBILITY_HIDDEN: n
        },
        e.exports = t.default
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = function() {
            function e(e, t) {
                for (var r = 0; r < t.length; r++) {
                    var n = t[r];
                    n.enumerable = n.enumerable || !1,
                    n.configurable = !0,
                    "value"in n && (n.writable = !0),
                    Object.defineProperty(e, n.key, n)
                }
            }
            return function(t, r, n) {
                return r && e(t.prototype, r),
                n && e(t, n),
                t
            }
        }()
          , o = function() {
            function e() {
                !function(e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, e),
                this._firstCheckpoint = 0,
                this._lastCheckpoint = 0,
                this._intervalBytes = 0,
                this._totalBytes = 0,
                this._lastSecondBytes = 0,
                self.performance && self.performance.now ? this._now = self.performance.now.bind(self.performance) : this._now = Date.now
            }
            return n(e, [{
                key: "reset",
                value: function() {
                    this._firstCheckpoint = this._lastCheckpoint = 0,
                    this._totalBytes = this._intervalBytes = 0,
                    this._lastSecondBytes = 0
                }
            }, {
                key: "addBytes",
                value: function(e) {
                    0 === this._firstCheckpoint ? (this._firstCheckpoint = this._now(),
                    this._lastCheckpoint = this._firstCheckpoint,
                    this._intervalBytes += e,
                    this._totalBytes += e) : this._now() - this._lastCheckpoint < 1e3 ? (this._intervalBytes += e,
                    this._totalBytes += e) : (this._lastSecondBytes = this._intervalBytes,
                    this._intervalBytes = e,
                    this._totalBytes += e,
                    this._lastCheckpoint = this._now())
                }
            }, {
                key: "totalBytes",
                get: function() {
                    return this._totalBytes
                }
            }, {
                key: "currentKBps",
                get: function() {
                    this.addBytes(0);
                    var e = (this._now() - this._lastCheckpoint) / 1e3;
                    return 0 == e && (e = 1),
                    this._intervalBytes / e / 1024
                }
            }, {
                key: "lastSecondKBps",
                get: function() {
                    return this.addBytes(0),
                    0 !== this._lastSecondBytes ? this._lastSecondBytes / 1024 : 500 <= this._now() - this._lastCheckpoint ? this.currentKBps : 0
                }
            }, {
                key: "averageKBps",
                get: function() {
                    var e = (this._now() - this._firstCheckpoint) / 1e3;
                    return this._totalBytes / 1024 / e
                }
            }]),
            e
        }();
        t.default = o,
        e.exports = t.default
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n, o = function() {
            function e(e, t) {
                for (var r = 0; r < t.length; r++) {
                    var n = t[r];
                    n.enumerable = n.enumerable || !1,
                    n.configurable = !0,
                    "value"in n && (n.writable = !0),
                    Object.defineProperty(e, n.key, n)
                }
            }
            return function(t, r, n) {
                return r && e(t.prototype, r),
                n && e(t, n),
                t
            }
        }(), i = (n = r(4)) && n.__esModule ? n : {
            default: n
        }, a = 0, s = function(e) {
            function t() {
                !function(e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, t);
                var e = function(e, t) {
                    if (!e)
                        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return !t || "object" != typeof t && "function" != typeof t ? e : t
                }(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
                return e._url = "",
                e._receivedLength = 0,
                e._status = a,
                e.requestAbort = !1,
                e._cacheBufferList = [],
                e
            }
            return function(e, t) {
                if ("function" != typeof t && null !== t)
                    throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }),
                t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }(t, i.default),
            o(t, [{
                key: "open",
                value: function(e) {
                    var t = this;
                    this._url = e,
                    this._status = 1,
                    window.fetch(this._url).then(function(e) {
                        if (e.ok && 200 <= e.status && e.status <= 299)
                            return t._pump.call(t, e.body.getReader());
                        t._status = 3
                    }).catch(function(e) {
                        t._status = 3
                    })
                }
            }, {
                key: "pause",
                value: function() {
                    this.requestAbort = !0
                }
            }, {
                key: "_pump",
                value: function(e) {
                    var t = this;
                    return e.read().then(function(r) {
                        if (r.done)
                            t.emit("end");
                        else {
                            if (!0 === t.requestAbort)
                                return t.requestAbort = !1,
                                e.cancel();
                            t._status = 2;
                            var n = r.value.buffer
                              , o = t._receivedLength;
                            t._receivedLength += n.byteLength,
                            t._cacheBufferList.push(n),
                            t.emit("dataArrival", {
                                chunk: n,
                                byteStart: o,
                                byteLength: n.byteLength
                            }),
                            t._pump(e)
                        }
                    }).catch(function(e) {
                        console.error(e)
                    })
                }
            }]),
            t
        }();
        t.default = s,
        e.exports = t.default
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = function() {
            function e(e, t) {
                for (var r = 0; r < t.length; r++) {
                    var n = t[r];
                    n.enumerable = n.enumerable || !1,
                    n.configurable = !0,
                    "value"in n && (n.writable = !0),
                    Object.defineProperty(e, n.key, n)
                }
            }
            return function(t, r, n) {
                return r && e(t.prototype, r),
                n && e(t, n),
                t
            }
        }()
          , o = function() {
            function e(t) {
                var r = this;
                !function(t, r) {
                    if (!(t instanceof e))
                        throw new TypeError("Cannot call a class as a function")
                }(this),
                this._fullscreenchangeCallback = function() {
                    !1 === document.webkitIsFullScreen || !1 === document.mozFullScreen || !1 === document.fullscreen ? r._fullscreenChange(!1) : r._fullscreenChange(!0)
                }
                ,
                this._fullscreenChange = function(e) {
                    r.resize(r.options.size)
                }
                ,
                t.style.cssText = "\n      display: block;\n      width: 100%;\n      height: 100%;\n    "
            }
            return n(e, [{
                key: "setOptions",
                value: function(e) {
                    this.options = e,
                    this.canvas = e.canvas,
                    this.context = this.canvas.getContext("2d"),
                    this.canvas.width = e.width,
                    this.canvas.height = e.height,
                    e.video.appendChild(this.canvas),
                    this.resize(e.size),
                    this._bindFullScreenEvent()
                }
            }, {
                key: "_bindFullScreenEvent",
                value: function() {
                    this.options.video.addEventListener("webkitbeginfullscreen", this._fullscreenChange),
                    this.options.video.addEventListener("webkitendfullscreen", this._fullscreenChange),
                    document.addEventListener("webkitfullscreenchange", this._fullscreenchangeCallback),
                    document.addEventListener("mozfullscreenchange", this._fullscreenchangeCallback),
                    document.addEventListener("fullscreenchange", this._fullscreenchangeCallback)
                }
            }, {
                key: "_unBindFullScreenEvent",
                value: function() {
                    this.options && this.options.video && (this.options.video.removeEventListener("webkitbeginfullscreen", this._fullscreenChange),
                    this.options.video.removeEventListener("webkitendfullscreen", this._fullscreenChange)),
                    document.removeEventListener("webkitfullscreenchange", this._fullscreenchangeCallback),
                    document.removeEventListener("mozfullscreenchange", this._fullscreenchangeCallback),
                    document.removeEventListener("fullscreenchange", this._fullscreenchangeCallback)
                }
            }, {
                key: "reset",
                value: function() {
                    this._unBindFullScreenEvent()
                }
            }, {
                key: "resize",
                value: function(e) {
                    var t = this.options.video.parentElement.getBoundingClientRect()
                      , r = this.options.width / this.options.height
                      , n = t.width
                      , o = t.height
                      , i = 0
                      , a = 0;
                    "cover" === e ? n / o < r ? a = (i = o) * r : i = (a = n) / r : "contain" === e ? r < n / o ? a = (i = o) * r : i = (a = n) / r : (a = n,
                    i = o);
                    var s = {
                        position: "absolute",
                        left: (n - a) / 2 + "px",
                        top: (o - i) / 2 + "px",
                        height: i + "px",
                        width: a + "px"
                    };
                    for (var u in s)
                        this.canvas.style[u] = s[u]
                }
            }, {
                key: "render",
                value: function(e) {
                    this.context.putImageData(e, 0, 0)
                }
            }, {
                key: "destroy",
                value: function() {
                    this._unBindFullScreenEvent()
                }
            }]),
            e
        }();
        t.default = o,
        e.exports = t.default
    }
    , function(e, t, r) {
        "use strict";
        var n, o = (n = r(11)) && n.__esModule ? n : {
            default: n
        };
        window.PLAYER_HEVC.ENABLE_VERBOSE = !1;
        var i = void 0
          , a = void 0
          , s = void 0
          , u = void 0
          , c = void 0;
        a = document.getElementById("videoElement"),
        s = document.getElementById("log"),
        u = document.getElementById("info"),
        a.addEventListener("loadedmetadata", function() {}),
        a.addEventListener("playing", function() {
            c || (c = (new Date).getTime())
        }),
        a.addEventListener("waiting", function() {}),
        a.addEventListener("canplay", function() {}),
        a.addEventListener("pause", function() {}),
        a.addEventListener("volumechange", function() {}),
        window.load = function() {
            i && i.destroy();
            var e = document.getElementById("input").value;
            (i = new o.default({
                url: e,
                video: a
            })).play(),
            i.on("loadedmetadata", function(e) {
                var t = e.videoTrack;
                u.innerHTML = "\n      <h3>视频信息</h3>\n      <p>width: " + t.trackWidth + "</p>\n      <p>height: " + t.trackHeight + "</p>\n    "
            }),
            i.on("statistics", function(e) {
                var t = e.averageKBps
                  , r = e.avgDecodeDuration
                  , n = e.totalDecodedFrameNum
                  , o = e.totalDecodedTime
                  , i = e.showFrameNum
                  , a = e.dropFrameNum
                  , u = e.totalBytes;
                s.innerHTML = "\n      <h3>性能数据</h3>\n      <p>平均网速：" + t.toFixed(2) + "KBps</p>\n      <p>总接收数据：" + (u / 1024 / 1024).toFixed(2) + "M</p>\n      <p>总解码视频帧数：" + n + "帧</p>\n      <p>总解码时长：" + o + "秒</p>\n      <p>平均每帧解码时长：" + r + "ms</p>\n      <p>总渲染帧数：" + i + "帧</p>\n      <p>总丢弃帧数：" + a + "帧</p>\n      <p>播放时长：" + ((new Date).getTime() - c) / 1e3 + "秒</p>\n    "
            }),
            i.on("innerError", function(e) {
                console.warn(e)
            })
        }
        ,
        window.play = function() {
            a.play()
        }
        ,
        window.pause = function() {
            a.pause()
        }
        ,
        window.muted = function() {
            a.muted = !0
        }
        ,
        window.destroy = function() {
            i.destroy(),
            i = null
        }
    }
    ])
});
