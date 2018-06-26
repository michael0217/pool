"use strict";
define("open-ethereum-pool/app", ["exports", "ember", "open-ethereum-pool/resolver", "ember-load-initializers", "open-ethereum-pool/config/environment"],
function(e, t, a, n, r) {
    var l = void 0;
    t.
default.MODEL_FACTORY_INJECTIONS = !0,
    l = t.
default.Application.extend({
        modulePrefix:
        r.
    default.modulePrefix,
        podModulePrefix: r.
    default.podModulePrefix,
        Resolver: a.
    default
    }),
    (0, n.
default)(l, r.
default.modulePrefix),
    e.
default = l
}),
define("open-ethereum-pool/cldrs/en", ["exports"],
function(e) {
    e.
default = [{
        locale: "en-US",
        parentLocale: "en"
    },
    {
        locale: "en",
        pluralRuleFunction: function(e, t) {
            var a = String(e).split("."),
            n = !a[1],
            r = Number(a[0]) == e,
            l = r && a[0].slice( - 1),
            d = r && a[0].slice( - 2);
            return t ? 1 == l && 11 != d ? "one": 2 == l && 12 != d ? "two": 3 == l && 13 != d ? "few": "other": 1 == e && n ? "one": "other"
        },
        fields: {
            year: {
                displayName: "year",
                relative: {
                    0 : "this year",
                    1 : "next year",
                    "-1": "last year"
                },
                relativeTime: {
                    future: {
                        one: "in {0} year",
                        other: "in {0} years"
                    },
                    past: {
                        one: "{0} year ago",
                        other: "{0} years ago"
                    }
                }
            },
            month: {
                displayName: "month",
                relative: {
                    0 : "this month",
                    1 : "next month",
                    "-1": "last month"
                },
                relativeTime: {
                    future: {
                        one: "in {0} month",
                        other: "in {0} months"
                    },
                    past: {
                        one: "{0} month ago",
                        other: "{0} months ago"
                    }
                }
            },
            day: {
                displayName: "day",
                relative: {
                    0 : "today",
                    1 : "tomorrow",
                    "-1": "yesterday"
                },
                relativeTime: {
                    future: {
                        one: "in {0} day",
                        other: "in {0} days"
                    },
                    past: {
                        one: "{0} day ago",
                        other: "{0} days ago"
                    }
                }
            },
            hour: {
                displayName: "hour",
                relativeTime: {
                    future: {
                        one: "in {0} hour",
                        other: "in {0} hours"
                    },
                    past: {
                        one: "{0} hour ago",
                        other: "{0} hours ago"
                    }
                }
            },
            minute: {
                displayName: "minute",
                relativeTime: {
                    future: {
                        one: "in {0} minute",
                        other: "in {0} minutes"
                    },
                    past: {
                        one: "{0} minute ago",
                        other: "{0} minutes ago"
                    }
                }
            },
            second: {
                displayName: "second",
                relative: {
                    0 : "now"
                },
                relativeTime: {
                    future: {
                        one: "in {0} second",
                        other: "in {0} seconds"
                    },
                    past: {
                        one: "{0} second ago",
                        other: "{0} seconds ago"
                    }
                }
            }
        }
    }]
}),
define("open-ethereum-pool/components/active-li", ["exports", "ember"],
function(e, t) {
    var a = t.
default.getOwner;
    e.
default = t.
default.Component.extend({
        tagName:
        "li",
        classNameBindings: ["isActive:active:inactive"],
        router: function() {
            return a(this).lookup("router:main")
        }.property(),
        isActive: function() {
            var e = this.get("currentWhen");
            return this.get("router").isActive(e)
        }.property("router.url", "currentWhen")
    })
}),
define("open-ethereum-pool/controllers/account", ["exports", "ember"],
function(e, t) {
    e.
default = t.
default.Controller.extend({
        applicationController:
        t.
    default.inject.controller("application"),
        stats: t.
    default.computed.reads("applicationController.model.stats"),
        roundPercent: t.
    default.computed("stats", "model", {
            get: function() {
                var e = this.get("model.roundShares") / this.get("stats.roundShares");
                return e || 0
            }
        })
    })
}),
define("open-ethereum-pool/controllers/application", ["exports", "ember", "open-ethereum-pool/config/environment"],
function(e, t, a) {
    e.
default = t.
default.Controller.extend(Object.defineProperties({
        height:
        t.
    default.computed("model.nodes", {
            get: function() {
                var e = this.get("bestNode");
                return e ? e.height: 0
            }
        }),
        roundShares: t.
    default.computed("model.stats", {
            get: function() {
                return parseInt(this.get("model.stats.roundShares"))
            }
        }),
        difficulty: t.
    default.computed("model.nodes", {
            get: function() {
                var e = this.get("bestNode");
                return e ? e.difficulty: 0
            }
        }),
        hashrate: t.
    default.computed("difficulty", {
            get: function() {
                return this.getWithDefault("difficulty", 0) / a.
            default.APP.BlockTime
            }
        }),
        immatureTotal: t.
    default.computed("model", {
            get: function() {
                return this.getWithDefault("model.immatureTotal", 0) + this.getWithDefault("model.candidatesTotal", 0)
            }
        }),
        bestNode: t.
    default.computed("model.nodes", {
            get: function() {
                var e = null;
                return this.get("model.nodes").forEach(function(t) {
                    e || (e = t),
                    e.height < t.height && (e = t)
                }),
                e
            }
        }),
        lastBlockFound: t.
    default.computed("model", {
            get: function() {
                return parseInt(this.get("model.lastBlockFound")) || 0
            }
        }),
        roundVariance: t.
    default.computed("model", {
            get: function() {
                var e = this.get("model.stats.roundShares") / this.get("difficulty");
                return e ? e.toFixed(2) : 0
            }
        }),
        nextEpoch: t.
    default.computed("height", {
            get: function() {
                var e = 1e3 * (3e4 - this.getWithDefault("height", 1) % 3e4) * this.get("config").BlockTime;
                return Date.now() + e
            }
        })
    },
    {
        config: {
            get: function() {
                return a.
            default.APP
            },
            configurable: !0,
            enumerable: !0
        }
    }))
}),
define("open-ethereum-pool/controllers/help", ["exports", "ember"],
function(e, t) {
    e.
default = t.
default.Controller.extend({
        applicationController:
        t.
    default.inject.controller("application"),
        config: t.
    default.computed.reads("applicationController.config")
    })
}),
define("open-ethereum-pool/controllers/index", ["exports", "ember"],
function(e, t) {
    e.
default = t.
default.Controller.extend({
        applicationController:
        t.
    default.inject.controller("application"),
        stats: t.
    default.computed.reads("applicationController"),
        config: t.
    default.computed.reads("applicationController.config"),
        cachedLogin: t.
    default.computed("login", {
            get: function() {
                return this.get("login") || t.
            default.$.cookie("login")
            },
            set: function(e, a) {
                return t.
            default.$.cookie("login", a),
                this.set("model.login", a),
                a
            }
        })
    })
}),
define("open-ethereum-pool/formats", ["exports"],
function(e) {
    var t = {
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
    };
    e.
default = {
        time: {
            hhmmss: t
        },
        date: {
            hhmmss: t
        },
        number: {
            EUR: {
                style: "currency",
                currency: "EUR",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            },
            USD: {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        }
    }
}),
define("open-ethereum-pool/helpers/app-version", ["exports", "ember", "open-ethereum-pool/config/environment", "ember-cli-app-version/utils/regexp"],
function(e, t, a, n) {
    function r(e) {
        var t = arguments.length <= 1 || void 0 === arguments[1] ? {}: arguments[1];
        return t.hideSha ? l.match(n.versionRegExp)[0] : t.hideVersion ? l.match(n.shaRegExp)[0] : l
    }
    e.appVersion = r;
    var l = a.
default.APP.version;
    e.
default = t.
default.Helper.helper(r)
}),
define("open-ethereum-pool/helpers/format-balance", ["exports", "ember"],
function(e, t) {
    function a(e) {
        return e *= 1e-9,
        e.toFixed(8)
    }
    e.formatBalance = a,
    e.
default = t.
default.Helper.helper(a)
}),
define("open-ethereum-pool/helpers/format-date-locale", ["exports", "ember"],
function(e, t) {
    function a(e) {
        return new Date(1e3 * e).toLocaleString()
    }
    e.formatDateLocale = a,
    e.
default = t.
default.Helper.helper(a)
}),
define("open-ethereum-pool/helpers/format-date", ["exports", "ember-intl/helpers/format-date"],
function(e, t) {
    Object.defineProperty(e, "default", {
        enumerable: !0,
        get: function() {
            return t.
        default
        }
    })
}),
define("open-ethereum-pool/helpers/format-hashrate", ["exports", "ember"],
function(e, t) {
    function a(e) {
        for (var t = e[0], a = 0, n = ["H", "KH", "MH", "GH", "TH", "PH"]; t > 1e3;) t /= 1e3,
        a++;
        return t.toFixed(2) + " " + n[a]
    }
    e.formatHashrate = a,
    e.
default = t.
default.Helper.helper(a)
}),
define("open-ethereum-pool/helpers/format-html-message", ["exports", "ember-intl/helpers/format-html-message"],
function(e, t) {
    Object.defineProperty(e, "default", {
        enumerable: !0,
        get: function() {
            return t.
        default
        }
    })
}),
define("open-ethereum-pool/helpers/format-message", ["exports", "ember-intl/helpers/format-message"],
function(e, t) {
    Object.defineProperty(e, "default", {
        enumerable: !0,
        get: function() {
            return t.
        default
        }
    })
}),
define("open-ethereum-pool/helpers/format-number", ["exports", "ember-intl/helpers/format-number"],
function(e, t) {
    Object.defineProperty(e, "default", {
        enumerable: !0,
        get: function() {
            return t.
        default
        }
    })
}),
define("open-ethereum-pool/helpers/format-relative", ["exports", "ember-intl/helpers/format-relative"],
function(e, t) {
    Object.defineProperty(e, "default", {
        enumerable: !0,
        get: function() {
            return t.
        default
        }
    })
}),
define("open-ethereum-pool/helpers/format-time", ["exports", "ember-intl/helpers/format-time"],
function(e, t) {
    Object.defineProperty(e, "default", {
        enumerable: !0,
        get: function() {
            return t.
        default
        }
    })
}),
define("open-ethereum-pool/helpers/format-tx", ["exports", "ember"],
function(e, t) {
    function a(e) {
        return e[0].substring(2, 26) + "..." + e[0].substring(42)
    }
    e.formatTx = a,
    e.
default = t.
default.Helper.helper(a)
}),
define("open-ethereum-pool/helpers/intl-get", ["exports", "ember-intl/helpers/intl-get"],
function(e, t) {
    Object.defineProperty(e, "default", {
        enumerable: !0,
        get: function() {
            return t.
        default
        }
    })
}),
define("open-ethereum-pool/helpers/l", ["exports", "ember-intl/helpers/l"],
function(e, t) {
    Object.defineProperty(e, "default", {
        enumerable: !0,
        get: function() {
            return t.
        default
        }
    })
}),
define("open-ethereum-pool/helpers/seconds-to-ms", ["exports", "ember"],
function(e, t) {
    function a(e) {
        return 1e3 * e
    }
    e.secondsToMs = a,
    e.
default = t.
default.Helper.helper(a)
}),
define("open-ethereum-pool/helpers/string-to-int", ["exports", "ember"],
function(e, t) {
    function a(e) {
        return parseInt(e)
    }
    e.stringToInt = a,
    e.
default = t.
default.Helper.helper(a)
}),
define("open-ethereum-pool/helpers/t", ["exports", "ember-intl/helpers/t"],
function(e, t) {
    Object.defineProperty(e, "default", {
        enumerable: !0,
        get: function() {
            return t.
        default
        }
    })
}),
define("open-ethereum-pool/helpers/with-metric-prefix", ["exports", "ember"],
function(e, t) {
    function a(e) {
        var t = e[0];
        if (t < 1e3) return t;
        for (var a = 0,
        n = ["K", "M", "G", "T", "P"]; t > 1e3;) t /= 1e3,
        a++;
        return t.toFixed(3) + " " + n[a - 1]
    }
    e.withMetricPrefix = a,
    e.
default = t.
default.Helper.helper(a)
}),
define("open-ethereum-pool/initializers/app-version", ["exports", "ember-cli-app-version/initializer-factory", "open-ethereum-pool/config/environment"],
function(e, t, a) {
    var n = a.
default.APP,
    r = n.name,
    l = n.version;
    e.
default = {
        name: "App Version",
        initialize: (0, t.
    default)(r, l)
    }
}),
define("open-ethereum-pool/initializers/container-debug-adapter", ["exports", "ember-resolver/container-debug-adapter"],
function(e, t) {
    e.
default = {
        name: "container-debug-adapter",
        initialize: function() {
            var e = arguments[1] || arguments[0];
            e.register("container-debug-adapter:main", t.
        default),
            e.inject("container-debug-adapter:main", "namespace", "application:main")
        }
    }
}),
define("open-ethereum-pool/initializers/cookie", ["exports", "open-ethereum-pool/lib/cookie"],
function(e, t) {
    e.
default = {
        name: "cookie",
        initialize: function() { (arguments[1] || arguments[0]).register("cookie:main", t.
        default)
        }
    }
}),
define("open-ethereum-pool/initializers/export-application-global", ["exports", "ember", "open-ethereum-pool/config/environment"],
function(e, t, a) {
    function n() {
        var e = arguments[1] || arguments[0];
        if (!1 !== a.
    default.exportApplicationGlobal) {
            var n;
            if ("undefined" != typeof window) n = window;
            else if ("undefined" != typeof global) n = global;
            else {
                if ("undefined" == typeof self) return;
                n = self
            }
            var r, l = a.
        default.exportApplicationGlobal;
            r = "string" == typeof l ? l: t.
        default.String.classify(a.
        default.modulePrefix),
            n[r] || (n[r] = e, e.reopen({
                willDestroy: function() {
                    this._super.apply(this, arguments),
                    delete n[r]
                }
            }))
        }
    }
    e.initialize = n,
    e.
default = {
        name: "export-application-global",
        initialize: n
    }
}),
define("open-ethereum-pool/instance-initializers/ember-intl", ["exports", "ember", "open-ethereum-pool/config/environment", "ember-intl/utils/links"],
function(e, t, a, n) {
    function r(e) {
        return Object.keys(requirejs._eak_seen).filter(function(t) {
            return 0 === t.indexOf(a.
        default.modulePrefix + "/" + e + "/")
        })
    }
    function l(e) {
        var t = void 0;
        t = "function" == typeof e.lookup ? e.lookup("service:intl") : e.container.lookup("service:intl"),
        "undefined" == typeof Intl && d("[ember-intl] Intl API is unavailable in this environment.\nSee: " + n.
    default.polyfill, !1, {
            id: "ember-intl-undefined-intljs"
        });
        var a = r("cldrs");
        a.length ? a.map(function(e) {
            return requirejs(e, null, null, !0).
        default
        }).forEach(function(e) {
            return e.forEach(t.addLocaleData)
        }):
        d("[ember-intl] project is missing CLDR data\nIf you are asynchronously loading translation, see: ${links.asyncTranslations}.", !1, {
            id: "ember-intl-missing-cldr-data"
        }),
        r("translations").forEach(function(e) {
            var a = e.split("/"),
            n = a[a.length - 1];
            t.addTranslations(n, requirejs(e, null, null, !0).
        default)
        })
    }
    e.instanceInitializer = l;
    var d = t.
default.warn;
    e.
default = {
        name: "ember-intl",
        initialize: l
    }
}),
define("open-ethereum-pool/lib/cookie", ["exports", "ember"],
function(e, t) {
    e.
default = t.
default.Object.extend({
        setCookie:
        function(e, a, n) {
            return new t.
        default.RSVP.Promise(function(r, l) {
                try {
                    t.
                default.$.cookie(e, a, n),
                    t.
                default.run(null, r)
                } catch(e) {
                    t.
                default.run(null, l, e)
                }
            })
        },
        getCookie: function(e) {
            return t.
        default.$.cookie(e)
        },
        removeCookie: function(e, a) {
            return t.
        default.$.removeCookie(e, a)
        }
    })
}),
define("open-ethereum-pool/models/block", ["exports", "ember"],
function(e, t) {
    var a = t.
default.Object.extend({
        variance:
        t.
    default.computed("difficulty", "shares",
        function() {
            var e = this.get("shares") / this.get("difficulty");
            return e || 0
        }),
        isLucky: t.
    default.computed("variance",
        function() {
            return this.get("variance") <= 1
        }),
        isOk: t.
    default.computed("orphan", "uncle",
        function() {
            return ! this.get("orphan")
        }),
        formatReward: t.
    default.computed("reward",
        function() {
            return this.get("orphan") ? 0 : (1e-18 * parseInt(this.get("reward"))).toFixed(6)
        })
    });
    e.
default = a
}),
define("open-ethereum-pool/models/payment", ["exports", "ember"],
function(e, t) {
    var a = t.
default.Object.extend({
        formatAmount:
        t.
    default.computed("amount",
        function() {
            return (1e-9 * parseInt(this.get("amount"))).toFixed(8)
        })
    });
    e.
default = a
}),
define("open-ethereum-pool/resolver", ["exports", "ember-resolver"],
function(e, t) {
    e.
default = t.
default
}),
define("open-ethereum-pool/router", ["exports", "ember", "open-ethereum-pool/config/environment"],
function(e, t, a) {
    var n = t.
default.Router.extend({
        location:
        a.
    default.locationType
    });
    n.map(function() {
        this.route("account", {
            path: "/account/:login"
        },
        function() {
            this.route("payouts")
        }),
        this.route("not-found"),
        this.route("blocks",
        function() {
            this.route("immature"),
            this.route("pending")
        }),
        this.route("help"),
        this.route("payments"),
        this.route("miners"),
        this.route("about")
    }),
    e.
default = n
}),
define("open-ethereum-pool/routes/account", ["exports", "ember", "open-ethereum-pool/config/environment"],
function(e, t, a) {
    e.
default = t.
default.Route.extend({
        model:
        function(e) {
            var n = a.
        default.APP.ApiUrl + "api/accounts/" + e.login;
            return t.
        default.$.getJSON(n).then(function(a) {
                return a.login = e.login,
                t.
            default.Object.create(a)
            })
        },
        setupController: function(e, a) {
            this._super(e, a),
            t.
        default.run.later(this, this.refresh, 5e3)
        },
        actions: {
            error: function(e) {
                if (404 === e.status) return this.transitionTo("not-found")
            }
        }
    })
}),
define("open-ethereum-pool/routes/application", ["exports", "ember", "open-ethereum-pool/config/environment"],
function(e, t, a) {
    e.
default = t.
default.Route.extend({
        intl:
        t.
    default.inject.service(),
        beforeModel: function() {
            this.get("intl").setLocale("en-us")
        },
        model: function() {
            var e = a.
        default.APP.ApiUrl + "api/stats";
            return t.
        default.$.getJSON(e).then(function(e) {
                return t.
            default.Object.create(e)
            })
        },
        setupController: function(e, a) {
            this._super(e, a),
            t.
        default.run.later(this, this.refresh, 5e3)
        }
    })
}),
define("open-ethereum-pool/routes/blocks", ["exports", "ember", "open-ethereum-pool/models/block", "open-ethereum-pool/config/environment"],
function(e, t, a, n) {
    e.
default = t.
default.Route.extend({
        model:
        function() {
            var e = n.
        default.APP.ApiUrl + "api/blocks";
            return t.
        default.$.getJSON(e).then(function(e) {
                return e.candidates && (e.candidates = e.candidates.map(function(e) {
                    return a.
                default.create(e)
                })),
                e.immature && (e.immature = e.immature.map(function(e) {
                    return a.
                default.create(e)
                })),
                e.matured && (e.matured = e.matured.map(function(e) {
                    return a.
                default.create(e)
                })),
                e
            })
        },
        setupController: function(e, a) {
            this._super(e, a),
            t.
        default.run.later(this, this.refresh, 5e3)
        }
    })
}),
define("open-ethereum-pool/routes/index", ["exports", "ember"],
function(e, t) {
    e.
default = t.
default.Route.extend({
        actions:
        {
            lookup:
            function(e) {
                if (!t.
            default.isEmpty(e)) return this.transitionTo("account", e)
            }
        }
    })
}),
define("open-ethereum-pool/routes/miners", ["exports", "ember", "open-ethereum-pool/config/environment"],
function(e, t, a) {
    e.
default = t.
default.Route.extend({
        model:
        function() {
            var e = a.
        default.APP.ApiUrl + "api/miners";
            return t.
        default.$.getJSON(e).then(function(e) {
                return e.miners && (e.miners = Object.keys(e.miners).map(function(t) {
                    var a = e.miners[t];
                    return a.login = t,
                    a
                }), e.miners = e.miners.sort(function(e, t) {
                    return e.hr < t.hr ? 1 : e.hr > t.hr ? -1 : 0
                })),
                e
            })
        },
        setupController: function(e, a) {
            this._super(e, a),
            t.
        default.run.later(this, this.refresh, 5e3)
        }
    })
}),
define("open-ethereum-pool/routes/payments", ["exports", "ember", "open-ethereum-pool/models/payment", "open-ethereum-pool/config/environment"],
function(e, t, a, n) {
    e.
default = t.
default.Route.extend({
        model:
        function() {
            var e = n.
        default.APP.ApiUrl + "api/payments";
            return t.
        default.$.getJSON(e).then(function(e) {
                return e.payments && (e.payments = e.payments.map(function(e) {
                    return a.
                default.create(e)
                })),
                e
            })
        },
        setupController: function(e, a) {
            this._super(e, a),
            t.
        default.run.later(this, this.refresh, 5e3)
        }
    })
}),
define("open-ethereum-pool/services/ajax", ["exports", "ember-ajax/services/ajax"],
function(e, t) {
    Object.defineProperty(e, "default", {
        enumerable: !0,
        get: function() {
            return t.
        default
        }
    })
}),
define("open-ethereum-pool/services/intl", ["exports", "ember-intl/services/intl"],
function(e, t) {
    Object.defineProperty(e, "default", {
        enumerable: !0,
        get: function() {
            return t.
        default
        }
    })
}),
define("open-ethereum-pool/templates/about", ["exports"],
function(e) {
    e.
default = Ember.HTMLBars.template(function() {
        return {
            meta: {
                revision: "Ember@2.8.3+c4330341",
                loc: {
                    source: null,
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 18,
                        column: 0
                    }
                },
                moduleName: "open-ethereum-pool/templates/about.hbs"
            },
            isEmpty: !1,
            arity: 0,
            cachedFragment: null,
            hasRendered: !1,
            buildFragment: function(e) {
                var t = e.createDocumentFragment(),
                a = e.createElement("div");
                e.setAttribute(a, "class", "container");
                var n = e.createTextNode("\n  ");
                e.appendChild(a, n);
                var n = e.createElement("div");
                e.setAttribute(n, "class", "page-header");
                var r = e.createTextNode("\n    ");
                e.appendChild(n, r);
                var r = e.createElement("h1"),
                l = e.createTextNode("使用须知");
                e.appendChild(r, l),
                e.appendChild(n, r);
                var r = e.createTextNode("\n  ");
                e.appendChild(n, r),
                e.appendChild(a, n);
                var n = e.createTextNode("\n  ");
                e.appendChild(a, n);
                var n = e.createElement("h3"),
                r = e.createTextNode("用户许可协议");
                e.appendChild(n, r),
                e.appendChild(a, n);
                var n = e.createTextNode("\n  ");
                e.appendChild(a, n);
                var n = e.createElement("p"),
                r = e.createTextNode("用户在注册账号或使用矿池之前，必须同意用户许可协议。如果您对此许可协议中的内容有异议，请勿使用此矿池。");
                e.appendChild(n, r);
                var r = e.createElement("br");
                e.appendChild(n, r);
                var r = e.createTextNode("\n     本站可能随时修改本协议，本矿池享有此协议的最终解释权。");
                var r = e.createTextNode("\n  ");
                e.appendChild(n, r),
                e.appendChild(a, n);
                var n = e.createTextNode("\n  ");
                e.appendChild(a, n);
                var n = e.createElement("h3"),
                r = e.createTextNode("详情");
                e.appendChild(n, r),
                e.appendChild(a, n);
                var n = e.createTextNode("\n  ");
                e.appendChild(a, n);
                var n = e.createElement("p"),
                r = e.createTextNode("\n    ");
                e.appendChild(n, r);
                var r = e.createElement("ul"),
                l = e.createTextNode("\n      ");
                e.appendChild(r, l);
                var l = e.createElement("li"),
                d = e.createTextNode("本矿池的挖矿收益采用 PROP 分配模式，矿池收取一定的手续费。手续费可能随时调整，届时会在矿池首页进行公告。");
                e.appendChild(l, d),
                e.appendChild(r, l);
                var l = e.createTextNode("\n      ");
                e.appendChild(r, l);
                var l = e.createElement("li"),
                d = e.createTextNode("矿池每隔180分钟会检查您的余额，达到100OF时会将已确认的金额自动支付到您的钱包地址。");
                e.appendChild(l, d),
                e.appendChild(r, l);
                var l = e.createTextNode("\n      ");
                e.appendChild(r, l);
                var l = e.createElement("li"),
                d = e.createTextNode("本矿池将尽力维持服务器正常运转，但因成本所限，矿池可能无法做到全年365天24小时运转，请您在挖矿软件中设置好备用矿池。如果因服务器故障停机造成挖矿中断，矿池对您的损失不承担责任。");
                e.appendChild(l, d),
                e.appendChild(r, l);
                var l = e.createTextNode("\n    ");
                e.appendChild(r, l),
                e.appendChild(n, r);
                var r = e.createTextNode("\n  ");
                e.appendChild(n, r),
                e.appendChild(a, n);
                var n = e.createTextNode("\n");
                e.appendChild(a, n),
                e.appendChild(t, a);
                var a = e.createTextNode("\n");
                return e.appendChild(t, a),
                t
            },
            buildRenderNodes: function() {
                return []
            },
            statements: [],
            locals: [],
            templates: []
        }
    } ())
}),
define("open-ethereum-pool/templates/account", ["exports"],
function(e) {
    e.
default = Ember.HTMLBars.template(function() {
        var e = function() {
            return {
                meta: {
                    revision: "Ember@2.8.3+c4330341",
                    loc: {
                        source: null,
                        start: {
                            line: 14,
                            column: 8
                        },
                        end: {
                            line: 18,
                            column: 8
                        }
                    },
                    moduleName: "open-ethereum-pool/templates/account.hbs"
                },
                isEmpty: !1,
                arity: 0,
                cachedFragment: null,
                hasRendered: !1,
                buildFragment: function(e) {
                    var t = e.createDocumentFragment(),
                    a = e.createTextNode("        ");
                    e.appendChild(t, a);
                    var a = e.createElement("div");
                    e.setAttribute(a, "style", "display: block;");
                    var n = e.createTextNode("\n          ");
                    e.appendChild(a, n);
                    var n = e.createElement("i");
                    e.setAttribute(n, "class", "fa fa-clock-o"),
                    e.appendChild(a, n);
                    var n = e.createTextNode(" 最近一次支付: ");
                    e.appendChild(a, n);
                    var n = e.createElement("span"),
                    r = e.createComment("");
                    e.appendChild(n, r),
                    e.appendChild(a, n);
                    var n = e.createElement("br");
                    e.appendChild(a, n);
                    var n = e.createTextNode("\n        ");
                    e.appendChild(a, n),
                    e.appendChild(t, a);
                    var a = e.createTextNode("\n");
                    return e.appendChild(t, a),
                    t
                },
                buildRenderNodes: function(e, t, a) {
                    var n = new Array(1);
                    return n[0] = e.createMorphAt(e.childAt(t, [1, 3]), 0, 0),
                    n
                },
                statements: [["inline", "format-balance", [["get", "model.stats.pending", ["loc", [null, [16, 71], [16, 90]]], 0, 0, 0, 0]], [], ["loc", [null, [16, 54], [16, 92]]], 0, 0]],
                locals: [],
                templates: []
            }
        } (),
        t = function() {
            return {
                meta: {
                    revision: "Ember@2.8.3+c4330341",
                    loc: {
                        source: null,
                        start: {
                            line: 22,
                            column: 8
                        },
                        end: {
                            line: 26,
                            column: 8
                        }
                    },
                    moduleName: "open-ethereum-pool/templates/account.hbs"
                },
                isEmpty: !1,
                arity: 0,
                cachedFragment: null,
                hasRendered: !1,
                buildFragment: function(e) {
                    var t = e.createDocumentFragment(),
                    a = e.createTextNode("        ");
                    e.appendChild(t, a);
                    var a = e.createElement("div");
                    e.setAttribute(a, "style", "display: block;");
                    var n = e.createElement("i");
                    e.setAttribute(n, "class", "fa fa-clock-o"),
                    e.appendChild(a, n);
                    var n = e.createTextNode("\n          最近提交算力: ");
                    e.appendChild(a, n);
                    var n = e.createElement("span"),
                    r = e.createComment("");
                    e.appendChild(n, r),
                    e.appendChild(a, n);
                    var n = e.createTextNode("\n        ");
                    e.appendChild(a, n),
                    e.appendChild(t, a);
                    var a = e.createTextNode("\n");
                    return e.appendChild(t, a),
                    t
                },
                buildRenderNodes: function(e, t, a) {
                    var n = new Array(1);
                    return n[0] = e.createMorphAt(e.childAt(t, [1, 2]), 0, 0),
                    n
                },
                statements: [["inline", "format-relative", [["subexpr", "seconds-to-ms", [["subexpr", "string-to-int", [["get", "model.stats.lastShare", ["loc", [null, [24, 72], [24, 93]]], 0, 0, 0, 0]], [], ["loc", [null, [24, 57], [24, 94]]], 0, 0]], [], ["loc", [null, [24, 42], [24, 95]]], 0, 0]], [], ["loc", [null, [24, 24], [24, 97]]], 0, 0]],
                locals: [],
                templates: []
            }
        } (),
        a = function() {
            var e = function() {
                return {
                    meta: {
                        revision: "Ember@2.8.3+c4330341",
                        loc: {
                            source: null,
                            start: {
                                line: 50,
                                column: 6
                            },
                            end: {
                                line: 50,
                                column: 103
                            }
                        },
                        moduleName: "open-ethereum-pool/templates/account.hbs"
                    },
                    isEmpty: !1,
                    arity: 0,
                    cachedFragment: null,
                    hasRendered: !1,
                    buildFragment: function(e) {
                        var t = e.createDocumentFragment(),
                        a = e.createTextNode("矿机列表 ");
                        e.appendChild(t, a);
                        var a = e.createElement("span");
                        e.setAttribute(a, "class", "badge alert-danger");
                        var n = e.createComment("");
                        return e.appendChild(a, n),
                        e.appendChild(t, a),
                        t
                    },
                    buildRenderNodes: function(e, t, a) {
                        var n = new Array(1);
                        return n[0] = e.createMorphAt(e.childAt(t, [1]), 0, 0),
                        n
                    },
                    statements: [["content", "model.workersOffline", ["loc", [null, [50, 72], [50, 96]]], 0, 0, 0, 0]],
                    locals: [],
                    templates: []
                }
            } ();
            return {
                meta: {
                    revision: "Ember@2.8.3+c4330341",
                    loc: {
                        source: null,
                        start: {
                            line: 49,
                            column: 4
                        },
                        end: {
                            line: 51,
                            column: 4
                        }
                    },
                    moduleName: "open-ethereum-pool/templates/account.hbs"
                },
                isEmpty: !1,
                arity: 0,
                cachedFragment: null,
                hasRendered: !1,
                buildFragment: function(e) {
                    var t = e.createDocumentFragment(),
                    a = e.createTextNode("      ");
                    e.appendChild(t, a);
                    var a = e.createComment("");
                    e.appendChild(t, a);
                    var a = e.createTextNode("\n");
                    return e.appendChild(t, a),
                    t
                },
                buildRenderNodes: function(e, t, a) {
                    var n = new Array(1);
                    return n[0] = e.createMorphAt(t, 1, 1, a),
                    n
                },
                statements: [["block", "link-to", ["account.index"], [], 0, null, ["loc", [null, [50, 6], [50, 115]]]]],
                locals: [],
                templates: [e]
            }
        } (),
        n = function() {
            var e = function() {
                return {
                    meta: {
                        revision: "Ember@2.8.3+c4330341",
                        loc: {
                            source: null,
                            start: {
                                line: 53,
                                column: 6
                            },
                            end: {
                                line: 53,
                                column: 40
                            }
                        },
                        moduleName: "open-ethereum-pool/templates/account.hbs"
                    },
                    isEmpty: !1,
                    arity: 0,
                    cachedFragment: null,
                    hasRendered: !1,
                    buildFragment: function(e) {
                        var t = e.createDocumentFragment(),
                        a = e.createTextNode("支付记录");
                        return e.appendChild(t, a),
                        t
                    },
                    buildRenderNodes: function() {
                        return []
                    },
                    statements: [],
                    locals: [],
                    templates: []
                }
            } ();
            return {
                meta: {
                    revision: "Ember@2.8.3+c4330341",
                    loc: {
                        source: null,
                        start: {
                            line: 52,
                            column: 4
                        },
                        end: {
                            line: 54,
                            column: 4
                        }
                    },
                    moduleName: "open-ethereum-pool/templates/account.hbs"
                },
                isEmpty: !1,
                arity: 0,
                cachedFragment: null,
                hasRendered: !1,
                buildFragment: function(e) {
                    var t = e.createDocumentFragment(),
                    a = e.createTextNode("      ");
                    e.appendChild(t, a);
                    var a = e.createComment("");
                    e.appendChild(t, a);
                    var a = e.createTextNode("\n");
                    return e.appendChild(t, a),
                    t
                },
                buildRenderNodes: function(e, t, a) {
                    var n = new Array(1);
                    return n[0] = e.createMorphAt(t, 1, 1, a),
                    n
                },
                statements: [["block", "link-to", ["account.payouts"], [], 0, null, ["loc", [null, [53, 6], [53, 52]]]]],
                locals: [],
                templates: [e]
            }
        } ();
        return {
            meta: {
                revision: "Ember@2.8.3+c4330341",
                loc: {
                    source: null,
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 59,
                        column: 0
                    }
                },
                moduleName: "open-ethereum-pool/templates/account.hbs"
            },
            isEmpty: !1,
            arity: 0,
            cachedFragment: null,
            hasRendered: !1,
            buildFragment: function(e) {
                var t = e.createDocumentFragment(),
                a = e.createComment("");
                e.appendChild(t, a);
                var a = e.createTextNode("\n");
                e.appendChild(t, a);
                var a = e.createElement("div");
                e.setAttribute(a, "class", "jumbotron");
                var n = e.createTextNode("\n  ");
                e.appendChild(a, n);
                var n = e.createElement("div");
                e.setAttribute(n, "class", "container");
                var r = e.createTextNode("\n    ");
                e.appendChild(n, r);
                var r = e.createElement("div");
                e.setAttribute(r, "class", "row");
                var l = e.createTextNode("\n      ");
                e.appendChild(r, l);
                var l = e.createElement("div");
                e.setAttribute(l, "class", "col-md-4 stats");
                var d = e.createTextNode("\n        ");
                e.appendChild(l, d);
                var d = e.createElement("div");
                e.setAttribute(d, "style", "display: block;");
                var o = e.createTextNode("\n          ");
                e.appendChild(d, o);
                var o = e.createElement("i");
                e.setAttribute(o, "class", "fa fa-cloud"),
                e.appendChild(d, o);
                var o = e.createTextNode(" 正在成熟的余额: ");
                e.appendChild(d, o);
                var o = e.createElement("span"),
                i = e.createComment("");
                e.appendChild(o, i),
                e.appendChild(d, o);
                var o = e.createElement("br");
                e.appendChild(d, o);
                var o = e.createTextNode("\n          ");
                e.appendChild(d, o);
                var o = e.createElement("small"),
                i = e.createTextNode("需要再等一些区块才能成熟");
                e.appendChild(o, i),
                e.appendChild(d, o);
                var o = e.createTextNode("\n        ");
                e.appendChild(d, o),
                e.appendChild(l, d);
                var d = e.createTextNode("\n        ");
                e.appendChild(l, d);
                var d = e.createElement("div");
                e.setAttribute(d, "style", "display: block;");
                var o = e.createTextNode("\n          ");
                e.appendChild(d, o);
                var o = e.createElement("i");
                e.setAttribute(o, "class", "fa fa-bank"),
                e.appendChild(d, o);
                var o = e.createTextNode(" 已确认的余额: ");
                e.appendChild(d, o);
                var o = e.createElement("span"),
                i = e.createComment("");
                e.appendChild(o, i),
                e.appendChild(d, o);
                var o = e.createElement("br");
                e.appendChild(d, o);
                var o = e.createTextNode("\n          ");
                e.appendChild(d, o);
                var o = e.createElement("small"),
                i = e.createTextNode("已经成熟，待支付的的金额");
                e.appendChild(o, i),
                e.appendChild(d, o);
                var o = e.createTextNode("\n        ");
                e.appendChild(d, o),
                e.appendChild(l, d);
                var d = e.createTextNode("\n");
                e.appendChild(l, d);
                var d = e.createComment("");
                e.appendChild(l, d);
                var d = e.createTextNode("        ");
                e.appendChild(l, d);
                var d = e.createElement("div");
                e.setAttribute(d, "style", "display: block;");
                var o = e.createElement("i");
                e.setAttribute(o, "class", "fa fa-money"),
                e.appendChild(d, o);
                var o = e.createTextNode(" 累计已支付金额: ");
                e.appendChild(d, o);
                var o = e.createElement("span"),
                i = e.createComment("");
                e.appendChild(o, i),
                e.appendChild(d, o),
                e.appendChild(l, d);
                var d = e.createTextNode("\n      ");
                e.appendChild(l, d),
                e.appendChild(r, l);
                var l = e.createTextNode("\n      ");
                e.appendChild(r, l);
                var l = e.createElement("div");
                e.setAttribute(l, "class", "col-md-4 stats");
                var d = e.createTextNode("\n");
                e.appendChild(l, d);
                var d = e.createComment("");
                e.appendChild(l, d);
                var d = e.createTextNode("        ");
                e.appendChild(l, d);
                var d = e.createElement("div");
                e.setAttribute(d, "style", "display: block;");
                var o = e.createElement("i");
                e.setAttribute(o, "class", "fa fa-gears"),
                e.appendChild(d, o);
                var o = e.createTextNode(" 在线矿机数量: ");
                e.appendChild(d, o);
                var o = e.createElement("span"),
                i = e.createComment("");
                e.appendChild(o, i),
                e.appendChild(d, o),
                e.appendChild(l, d);
                var d = e.createTextNode("\n        ");
                e.appendChild(l, d);
                var d = e.createElement("div");
                e.setAttribute(d, "style", "display: block;");
                var o = e.createElement("i");
                e.setAttribute(o, "class", "fa fa-tachometer"),
                e.appendChild(d, o);
                var o = e.createTextNode(" 当前算力 (30分钟): ");
                e.appendChild(d, o);
                var o = e.createElement("span"),
                i = e.createComment("");
                e.appendChild(o, i),
                e.appendChild(d, o),
                e.appendChild(l, d);
                var d = e.createTextNode("\n        ");
                e.appendChild(l, d);
                var d = e.createElement("div");
                e.setAttribute(d, "style", "display: block;");
                var o = e.createElement("i");
                e.setAttribute(o, "class", "fa fa-tachometer"),
                e.appendChild(d, o);
                var o = e.createTextNode(" 当前算力 (3小时): ");
                e.appendChild(d, o);
                var o = e.createElement("span"),
                i = e.createComment("");
                e.appendChild(o, i),
                e.appendChild(d, o),
                e.appendChild(l, d);
                var d = e.createTextNode("\n      ");
                e.appendChild(l, d),
                e.appendChild(r, l);
                var l = e.createTextNode("\n      ");
                e.appendChild(r, l);
                var l = e.createElement("div");
                e.setAttribute(l, "class", "col-md-4 stats");
                var d = e.createTextNode("\n        ");
                e.appendChild(l, d);
                var d = e.createElement("div");
                e.setAttribute(d, "style", "display: block;");
                var o = e.createElement("i");
                e.setAttribute(o, "class", "fa fa-tachometer"),
                e.appendChild(d, o);
                var o = e.createTextNode(" 发现的区块数: ");
                e.appendChild(d, o);
                var o = e.createElement("span"),
                i = e.createComment("");
                e.appendChild(o, i),
                e.appendChild(d, o),
                e.appendChild(l, d);
                var d = e.createTextNode("\n        ");
                e.appendChild(l, d);
                var d = e.createElement("div");
                e.setAttribute(d, "style", "display: block;");
                var o = e.createElement("i");
                e.setAttribute(o, "class", "fa fa-paper-plane-o"),
                e.appendChild(d, o);
                var o = e.createTextNode(" 累计支付次数: ");
                e.appendChild(d, o);
                var o = e.createElement("span"),
                i = e.createComment("");
                e.appendChild(o, i),
                e.appendChild(d, o),
                e.appendChild(l, d);
                var d = e.createTextNode("\n        ");
                e.appendChild(l, d);
                var d = e.createElement("div");
                e.setAttribute(d, "style", "display: block;");
                var o = e.createTextNode("\n          ");
                e.appendChild(d, o);
                var o = e.createElement("i");
                e.setAttribute(o, "class", "fa fa-gears"),
                e.appendChild(d, o);
                var o = e.createTextNode(" 当前区块占比: ");
                e.appendChild(d, o);
                var o = e.createElement("span"),
                i = e.createComment("");
                e.appendChild(o, i),
                e.appendChild(d, o);
                var o = e.createElement("br");
                e.appendChild(d, o);
                var o = e.createTextNode("\n          ");
                e.appendChild(d, o);
                var o = e.createElement("small"),
                i = e.createTextNode("当前区块总份额中，您所占的比例");
                e.appendChild(o, i),
                e.appendChild(d, o);
                var o = e.createTextNode("\n        ");
                e.appendChild(d, o),
                e.appendChild(l, d);
                var d = e.createTextNode("\n        ");
                e.appendChild(l, d);
                var d = e.createElement("div");
                e.setAttribute(d, "style", "display: block;");
                var o = e.createTextNode("\n          ");
                e.appendChild(d, o);
                var o = e.createElement("i");
                e.setAttribute(o, "class", "fa fa-clock-o"),
                e.appendChild(d, o);
                var o = e.createTextNode("\n          下次Epoch切换: ");
                e.appendChild(d, o);
                var o = e.createElement("span"),
                i = e.createComment("");
                e.appendChild(o, i),
                e.appendChild(d, o);
                var o = e.createTextNode("\n        ");
                e.appendChild(d, o),
                e.appendChild(l, d);
                var d = e.createTextNode("\n      ");
                e.appendChild(l, d),
                e.appendChild(r, l);
                var l = e.createTextNode("\n    ");
                e.appendChild(r, l),
                e.appendChild(n, r);
                var r = e.createTextNode("\n  ");
                e.appendChild(n, r),
                e.appendChild(a, n);
                var n = e.createTextNode("\n");
                e.appendChild(a, n),
                e.appendChild(t, a);
                var a = e.createTextNode("\n\n");
                e.appendChild(t, a);
                var a = e.createElement("div");
                e.setAttribute(a, "class", "container");
                var n = e.createTextNode("\n  ");
                e.appendChild(a, n);
                var n = e.createElement("ul");
                e.setAttribute(n, "class", "nav nav-tabs");
                var r = e.createTextNode("\n");
                e.appendChild(n, r);
                var r = e.createComment("");
                e.appendChild(n, r);
                var r = e.createComment("");
                e.appendChild(n, r);
                var r = e.createTextNode("  ");
                e.appendChild(n, r),
                e.appendChild(a, n);
                var n = e.createTextNode("\n");
                e.appendChild(a, n),
                e.appendChild(t, a);
                var a = e.createTextNode("\n\n");
                e.appendChild(t, a);
                var a = e.createComment("");
                e.appendChild(t, a);
                var a = e.createTextNode("\n");
                return e.appendChild(t, a),
                t
            },
            buildRenderNodes: function(e, t, a) {
                var n = e.childAt(t, [2, 1, 1]),
                r = e.childAt(n, [1]),
                l = e.childAt(n, [3]),
                d = e.childAt(n, [5]),
                o = e.childAt(t, [4, 1]),
                i = new Array(16);
                return i[0] = e.createMorphAt(t, 0, 0, a),
                i[1] = e.createMorphAt(e.childAt(r, [1, 3]), 0, 0),
                i[2] = e.createMorphAt(e.childAt(r, [3, 3]), 0, 0),
                i[3] = e.createMorphAt(r, 5, 5),
                i[4] = e.createMorphAt(e.childAt(r, [7, 2]), 0, 0),
                i[5] = e.createMorphAt(l, 1, 1),
                i[6] = e.createMorphAt(e.childAt(l, [3, 2]), 0, 0),
                i[7] = e.createMorphAt(e.childAt(l, [5, 2]), 0, 0),
                i[8] = e.createMorphAt(e.childAt(l, [7, 2]), 0, 0),
                i[9] = e.createMorphAt(e.childAt(d, [1, 2]), 0, 0),
                i[10] = e.createMorphAt(e.childAt(d, [3, 2]), 0, 0),
                i[11] = e.createMorphAt(e.childAt(d, [5, 3]), 0, 0),
                i[12] = e.createMorphAt(e.childAt(d, [7, 3]), 0, 0),
                i[13] = e.createMorphAt(o, 1, 1),
                i[14] = e.createMorphAt(o, 2, 2),
                i[15] = e.createMorphAt(t, 6, 6, a),
                e.insertBoundary(t, 0),
                i
            },
            statements: [["inline", "outlet", ["error"], [], ["loc", [null, [1, 0], [1, 19]]], 0, 0], ["inline", "format-balance", [["get", "model.stats.immature", ["loc", [null, [7, 70], [7, 90]]], 0, 0, 0, 0]], [], ["loc", [null, [7, 53], [7, 92]]], 0, 0], ["inline", "format-balance", [["get", "model.stats.balance", ["loc", [null, [11, 68], [11, 87]]], 0, 0, 0, 0]], [], ["loc", [null, [11, 51], [11, 89]]], 0, 0], ["block", "if", [["get", "model.stats.pending", ["loc", [null, [14, 14], [14, 33]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [14, 8], [18, 15]]]], ["inline", "format-balance", [["get", "model.stats.paid", ["loc", [null, [19, 97], [19, 113]]], 0, 0, 0, 0]], [], ["loc", [null, [19, 80], [19, 115]]], 0, 0], ["block", "if", [["get", "model.stats.lastShare", ["loc", [null, [22, 14], [22, 35]]], 0, 0, 0, 0]], [], 1, null, ["loc", [null, [22, 8], [26, 15]]]], ["inline", "format-number", [["get", "model.workersOnline", ["loc", [null, [27, 95], [27, 114]]], 0, 0, 0, 0]], [], ["loc", [null, [27, 79], [27, 116]]], 0, 0], ["inline", "format-hashrate", [["get", "model.currentHashrate", ["loc", [null, [28, 107], [28, 128]]], 0, 0, 0, 0]], [], ["loc", [null, [28, 89], [28, 130]]], 0, 0], ["inline", "format-hashrate", [["get", "model.hashrate", ["loc", [null, [29, 106], [29, 120]]], 0, 0, 0, 0]], [], ["loc", [null, [29, 88], [29, 122]]], 0, 0], ["inline", "format-number", [["get", "model.stats.blocksFound", ["loc", [null, [32, 100], [32, 123]]], 0, 0, 0, 0]], ["fallback", "0"], ["loc", [null, [32, 84], [32, 138]]], 0, 0], ["inline", "format-number", [["get", "model.paymentsTotal", ["loc", [null, [33, 103], [33, 122]]], 0, 0, 0, 0]], [], ["loc", [null, [33, 87], [33, 124]]], 0, 0], ["inline", "format-number", [["get", "roundPercent", ["loc", [null, [35, 68], [35, 80]]], 0, 0, 0, 0]], ["style", "percent", "maximumFractionDigits", "6"], ["loc", [null, [35, 52], [35, 124]]], 0, 0], ["inline", "format-relative", [["get", "applicationController.nextEpoch", ["loc", [null, [40, 45], [40, 76]]], 0, 0, 0, 0]], ["units", "hour"], ["loc", [null, [40, 27], [40, 91]]], 0, 0], ["block", "active-li", [], ["currentWhen", "account.index", "role", "presentation"], 2, null, ["loc", [null, [49, 4], [51, 18]]]], ["block", "active-li", [], ["currentWhen", "account.payouts", "role", "presentation"], 3, null, ["loc", [null, [52, 4], [54, 18]]]], ["content", "outlet", ["loc", [null, [58, 0], [58, 10]]], 0, 0, 0, 0]],
            locals: [],
            templates: [e, t, a, n]
        }
    } ())
}),
define("open-ethereum-pool/templates/account/index", ["exports"],
function(e) {
    e.
default = Ember.HTMLBars.template(function() {
        var e = function() {
            var e = function() {
                return {
                    meta: {
                        revision: "Ember@2.8.3+c4330341",
                        loc: {
                            source: null,
                            start: {
                                line: 15,
                                column: 8
                            },
                            end: {
                                line: 22,
                                column: 8
                            }
                        },
                        moduleName: "open-ethereum-pool/templates/account/index.hbs"
                    },
                    isEmpty: !1,
                    arity: 2,
                    cachedFragment: null,
                    hasRendered: !1,
                    buildFragment: function(e) {
                        var t = e.createDocumentFragment(),
                        a = e.createTextNode("          ");
                        e.appendChild(t, a);
                        var a = e.createElement("tr"),
                        n = e.createTextNode("\n            ");
                        e.appendChild(a, n);
                        var n = e.createElement("td"),
                        r = e.createComment("");
                        e.appendChild(n, r),
                        e.appendChild(a, n);
                        var n = e.createTextNode("\n            ");
                        e.appendChild(a, n);
                        var n = e.createElement("td"),
                        r = e.createComment("");
                        e.appendChild(n, r),
                        e.appendChild(a, n);
                        var n = e.createTextNode("\n            ");
                        e.appendChild(a, n);
                        var n = e.createElement("td"),
                        r = e.createComment("");
                        e.appendChild(n, r),
                        e.appendChild(a, n);
                        var n = e.createTextNode("\n            ");
                        e.appendChild(a, n);
                        var n = e.createElement("td"),
                        r = e.createComment("");
                        e.appendChild(n, r),
                        e.appendChild(a, n);
                        var n = e.createTextNode("\n          ");
                        e.appendChild(a, n),
                        e.appendChild(t, a);
                        var a = e.createTextNode("\n");
                        return e.appendChild(t, a),
                        t
                    },
                    buildRenderNodes: function(e, t, a) {
                        var n = e.childAt(t, [1]),
                        r = new Array(5);
                        return r[0] = e.createAttrMorph(n, "class"),
                        r[1] = e.createMorphAt(e.childAt(n, [1]), 0, 0),
                        r[2] = e.createMorphAt(e.childAt(n, [3]), 0, 0),
                        r[3] = e.createMorphAt(e.childAt(n, [5]), 0, 0),
                        r[4] = e.createMorphAt(e.childAt(n, [7]), 0, 0),
                        r
                    },
                    statements: [["attribute", "class", ["concat", [["subexpr", "if", [["get", "v.offline", ["loc", [null, [16, 26], [16, 35]]], 0, 0, 0, 0], "warning", "success"], [], ["loc", [null, [16, 21], [16, 57]]], 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["content", "k", ["loc", [null, [17, 16], [17, 21]]], 0, 0, 0, 0], ["inline", "format-hashrate", [["get", "v.hr", ["loc", [null, [18, 34], [18, 38]]], 0, 0, 0, 0]], [], ["loc", [null, [18, 16], [18, 40]]], 0, 0], ["inline", "format-hashrate", [["get", "v.hr2", ["loc", [null, [19, 34], [19, 39]]], 0, 0, 0, 0]], [], ["loc", [null, [19, 16], [19, 41]]], 0, 0], ["inline", "format-relative", [["subexpr", "seconds-to-ms", [["get", "v.lastBeat", ["loc", [null, [20, 49], [20, 59]]], 0, 0, 0, 0]], [], ["loc", [null, [20, 34], [20, 60]]], 0, 0]], [], ["loc", [null, [20, 16], [20, 62]]], 0, 0]],
                    locals: ["k", "v"],
                    templates: []
                }
            } ();
            return {
                meta: {
                    revision: "Ember@2.8.3+c4330341",
                    loc: {
                        source: null,
                        start: {
                            line: 2,
                            column: 2
                        },
                        end: {
                            line: 26,
                            column: 2
                        }
                    },
                    moduleName: "open-ethereum-pool/templates/account/index.hbs"
                },
                isEmpty: !1,
                arity: 0,
                cachedFragment: null,
                hasRendered: !1,
                buildFragment: function(e) {
                    var t = e.createDocumentFragment(),
                    a = e.createTextNode("  ");
                    e.appendChild(t, a);
                    var a = e.createElement("h4"),
                    n = e.createTextNode("您的矿机");
                    e.appendChild(a, n),
                    e.appendChild(t, a);
                    var a = e.createTextNode("\n  ");
                    e.appendChild(t, a);
                    var a = e.createElement("div");
                    e.setAttribute(a, "class", "table-responsive");
                    var n = e.createTextNode("\n    ");
                    e.appendChild(a, n);
                    var n = e.createElement("table");
                    e.setAttribute(n, "class", "table table-condensed table-striped");
                    var r = e.createTextNode("\n      ");
                    e.appendChild(n, r);
                    var r = e.createElement("thead"),
                    l = e.createTextNode("\n        ");
                    e.appendChild(r, l);
                    var l = e.createElement("tr"),
                    d = e.createTextNode("\n          ");
                    e.appendChild(l, d);
                    var d = e.createElement("th"),
                    o = e.createTextNode("矿工号");
                    e.appendChild(d, o),
                    e.appendChild(l, d);
                    var d = e.createTextNode("\n          ");
                    e.appendChild(l, d);
                    var d = e.createElement("th"),
                    o = e.createTextNode("当前算力");
                    e.appendChild(d, o),
                    e.appendChild(l, d);
                    var d = e.createTextNode("\n          ");
                    e.appendChild(l, d);
                    var d = e.createElement("th"),
                    o = e.createTextNode("平均算力");
                    e.appendChild(d, o),
                    e.appendChild(l, d);
                    var d = e.createTextNode("\n          ");
                    e.appendChild(l, d);
                    var d = e.createElement("th"),
                    o = e.createTextNode("最后提交");
                    e.appendChild(d, o),
                    e.appendChild(l, d);
                    var d = e.createTextNode("\n        ");
                    e.appendChild(l, d),
                    e.appendChild(r, l);
                    var l = e.createTextNode("\n      ");
                    e.appendChild(r, l),
                    e.appendChild(n, r);
                    var r = e.createTextNode("\n      ");
                    e.appendChild(n, r);
                    var r = e.createElement("tbody"),
                    l = e.createTextNode("\n");
                    e.appendChild(r, l);
                    var l = e.createComment("");
                    e.appendChild(r, l);
                    var l = e.createTextNode("      ");
                    e.appendChild(r, l),
                    e.appendChild(n, r);
                    var r = e.createTextNode("\n    ");
                    e.appendChild(n, r),
                    e.appendChild(a, n);
                    var n = e.createTextNode("\n  ");
                    e.appendChild(a, n),
                    e.appendChild(t, a);
                    var a = e.createTextNode("\n");
                    return e.appendChild(t, a),
                    t
                },
                buildRenderNodes: function(e, t, a) {
                    var n = new Array(1);
                    return n[0] = e.createMorphAt(e.childAt(t, [3, 1, 3]), 1, 1),
                    n
                },
                statements: [["block", "each-in", [["get", "model.workers", ["loc", [null, [15, 19], [15, 32]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [15, 8], [22, 20]]]]],
                locals: [],
                templates: [e]
            }
        } (),
        t = function() {
            return {
                meta: {
                    revision: "Ember@2.8.3+c4330341",
                    loc: {
                        source: null,
                        start: {
                            line: 26,
                            column: 2
                        },
                        end: {
                            line: 28,
                            column: 2
                        }
                    },
                    moduleName: "open-ethereum-pool/templates/account/index.hbs"
                },
                isEmpty: !1,
                arity: 0,
                cachedFragment: null,
                hasRendered: !1,
                buildFragment: function(e) {
                    var t = e.createDocumentFragment(),
                    a = e.createTextNode("    ");
                    e.appendChild(t, a);
                    var a = e.createElement("h3"),
                    n = e.createTextNode("没有在线矿机");
                    e.appendChild(a, n),
                    e.appendChild(t, a);
                    var a = e.createTextNode("\n");
                    return e.appendChild(t, a),
                    t
                },
                buildRenderNodes: function() {
                    return []
                },
                statements: [],
                locals: [],
                templates: []
            }
        } ();
        return {
            meta: {
                revision: "Ember@2.8.3+c4330341",
                loc: {
                    source: null,
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 39,
                        column: 0
                    }
                },
                moduleName: "open-ethereum-pool/templates/account/index.hbs"
            },
            isEmpty: !1,
            arity: 0,
            cachedFragment: null,
            hasRendered: !1,
            buildFragment: function(e) {
                var t = e.createDocumentFragment(),
                a = e.createElement("div");
                e.setAttribute(a, "class", "container");
                var n = e.createTextNode("\n");
                e.appendChild(a, n);
                var n = e.createComment("");
                e.appendChild(a, n);
                var n = e.createTextNode("  ");
                e.appendChild(a, n);
                var n = e.createElement("div");
                e.setAttribute(n, "class", "alert alert-info"),
                e.setAttribute(n, "role", "alert");
                var r = e.createTextNode("\n    ");
                e.appendChild(n, r);
                var r = e.createElement("span");
                e.setAttribute(r, "class", "sr-only");
                var l = e.createTextNode("Notice:");
                e.appendChild(r, l),
                e.appendChild(n, r);
                var r = e.createTextNode("\n    您的算力是根据最近一段时间内提交的股份数量计算出来的，因此刚开始挖矿时，显示的算力值会偏低。");
                e.appendChild(n, r);
                var r = e.createElement("br");
                e.appendChild(n, r);
                var r = e.createTextNode("\n    需要多挖一段时间后，算力值才会接近实际速度。矿机列表中的两个算力值，分别是根据30分钟和3小时内提交的股份来计算的。");
                e.appendChild(n, r);
                var r = e.createElement("br");
                e.appendChild(n, r);
                var r = e.createTextNode("\n    如果您有掉线或者有问题的矿机，15分钟没提交有效股份的话，系统会高亮显示。请您尽快检查此矿机的工作状态。\n  ");
                e.appendChild(n, r),
                e.appendChild(a, n);
                var n = e.createTextNode("\n  ");
                e.appendChild(a, n);
                var n = e.createElement("div");
                e.setAttribute(n, "class", "alert alert-info"),
                e.setAttribute(n, "role", "alert");
                var r = e.createTextNode("\n    ");
                e.appendChild(n, r);
                var r = e.createElement("strong"),
                l = e.createTextNode("为便于管理，本矿池为您提供了JSON格式的API地址:");
                e.appendChild(r, l),
                e.appendChild(n, r);
                var r = e.createTextNode(" ");
                e.appendChild(n, r);
                var r = e.createElement("a"),
                l = e.createTextNode("/api/accounts/");
                e.appendChild(r, l);
                var l = e.createComment("");
                e.appendChild(r, l),
                e.appendChild(n, r);
                var r = e.createTextNode("\n  ");
                e.appendChild(n, r),
                e.appendChild(a, n);
                var n = e.createTextNode("\n");
                e.appendChild(a, n),
                e.appendChild(t, a);
                var a = e.createTextNode("\n");
                return e.appendChild(t, a),
                t
            },
            buildRenderNodes: function(e, t, a) {
                var n = e.childAt(t, [0]),
                r = e.childAt(n, [5, 3]),
                l = new Array(3);
                return l[0] = e.createMorphAt(n, 1, 1),
                l[1] = e.createAttrMorph(r, "href"),
                l[2] = e.createMorphAt(r, 1, 1),
                l
            },
            statements: [["block", "if", [["get", "model.workers", ["loc", [null, [2, 8], [2, 21]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [2, 2], [28, 9]]]], ["attribute", "href", ["concat", ["/api/accounts/", ["get", "model.login", ["loc", [null, [36, 74], [36, 85]]], 0, 0, 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["content", "model.login", ["loc", [null, [36, 103], [36, 118]]], 0, 0, 0, 0]],
            locals: [],
            templates: [e, t]
        }
    } ())
}),
define("open-ethereum-pool/templates/account/payouts", ["exports"],
function(e) {
    e.
default = Ember.HTMLBars.template(function() {
        var e = function() {
            var e = function() {
                return {
                    meta: {
                        revision: "Ember@2.8.3+c4330341",
                        loc: {
                            source: null,
                            start: {
                                line: 14,
                                column: 8
                            },
                            end: {
                                line: 22,
                                column: 8
                            }
                        },
                        moduleName: "open-ethereum-pool/templates/account/payouts.hbs"
                    },
                    isEmpty: !1,
                    arity: 1,
                    cachedFragment: null,
                    hasRendered: !1,
                    buildFragment: function(e) {
                        var t = e.createDocumentFragment(),
                        a = e.createTextNode("          ");
                        e.appendChild(t, a);
                        var a = e.createElement("tr"),
                        n = e.createTextNode("\n            ");
                        e.appendChild(a, n);
                        var n = e.createElement("td"),
                        r = e.createComment("");
                        e.appendChild(n, r),
                        e.appendChild(a, n);
                        var n = e.createTextNode("\n            ");
                        e.appendChild(a, n);
                        var n = e.createElement("td"),
                        r = e.createTextNode("\n              ");
                        e.appendChild(n, r);
                        var r = e.createElement("a");
                        e.setAttribute(r, "class", "hash"),
                        e.setAttribute(r, "rel", "nofollow"),
                        e.setAttribute(r, "target", "_blank");
                        var l = e.createComment("");
                        e.appendChild(r, l),
                        e.appendChild(n, r);
                        var r = e.createTextNode("\n            ");
                        e.appendChild(n, r),
                        e.appendChild(a, n);
                        var n = e.createTextNode("\n            ");
                        e.appendChild(a, n);
                        var n = e.createElement("td"),
                        r = e.createComment("");
                        e.appendChild(n, r),
                        e.appendChild(a, n);
                        var n = e.createTextNode("\n          ");
                        e.appendChild(a, n),
                        e.appendChild(t, a);
                        var a = e.createTextNode("\n");
                        return e.appendChild(t, a),
                        t
                    },
                    buildRenderNodes: function(e, t, a) {
                        var n = e.childAt(t, [1]),
                        r = e.childAt(n, [3, 1]),
                        l = new Array(4);
                        return l[0] = e.createMorphAt(e.childAt(n, [1]), 0, 0),
                        l[1] = e.createAttrMorph(r, "href"),
                        l[2] = e.createMorphAt(r, 0, 0),
                        l[3] = e.createMorphAt(e.childAt(n, [5]), 0, 0),
                        l
                    },
                    statements: [["inline", "format-date-locale", [["get", "tx.timestamp", ["loc", [null, [16, 37], [16, 49]]], 0, 0, 0, 0]], [], ["loc", [null, [16, 16], [16, 51]]], 0, 0], ["attribute", "href", ["concat", ["http://www.ofcoin.com/transaction.html?txHash=", ["get", "tx.tx", ["loc", [null, [18, 75], [18, 80]]], 0, 0, 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["content", "tx.tx", ["loc", [null, [18, 128], [18, 137]]], 0, 0, 0, 0], ["inline", "format-balance", [["get", "tx.amount", ["loc", [null, [20, 33], [20, 42]]], 0, 0, 0, 0]], [], ["loc", [null, [20, 16], [20, 44]]], 0, 0]],
                    locals: ["tx"],
                    templates: []
                }
            } ();
            return {
                meta: {
                    revision: "Ember@2.8.3+c4330341",
                    loc: {
                        source: null,
                        start: {
                            line: 2,
                            column: 2
                        },
                        end: {
                            line: 26,
                            column: 2
                        }
                    },
                    moduleName: "open-ethereum-pool/templates/account/payouts.hbs"
                },
                isEmpty: !1,
                arity: 0,
                cachedFragment: null,
                hasRendered: !1,
                buildFragment: function(e) {
                    var t = e.createDocumentFragment(),
                    a = e.createTextNode("  ");
                    e.appendChild(t, a);
                    var a = e.createElement("h4"),
                    n = e.createTextNode("您最近的支付记录");
                    e.appendChild(a, n),
                    e.appendChild(t, a);
                    var a = e.createTextNode("\n  ");
                    e.appendChild(t, a);
                    var a = e.createElement("div");
                    e.setAttribute(a, "class", "table-responsive");
                    var n = e.createTextNode("\n    ");
                    e.appendChild(a, n);
                    var n = e.createElement("table");
                    e.setAttribute(n, "class", "table table-condensed table-striped");
                    var r = e.createTextNode("\n      ");
                    e.appendChild(n, r);
                    var r = e.createElement("thead"),
                    l = e.createTextNode("\n        ");
                    e.appendChild(r, l);
                    var l = e.createElement("tr"),
                    d = e.createTextNode("\n          ");
                    e.appendChild(l, d);
                    var d = e.createElement("th"),
                    o = e.createTextNode("时间");
                    e.appendChild(d, o),
                    e.appendChild(l, d);
                    var d = e.createTextNode("\n          ");
                    e.appendChild(l, d);
                    var d = e.createElement("th"),
                    o = e.createTextNode("交易ID");
                    e.appendChild(d, o),
                    e.appendChild(l, d);
                    var d = e.createTextNode("\n          ");
                    e.appendChild(l, d);
                    var d = e.createElement("th"),
                    o = e.createTextNode("金额");
                    e.appendChild(d, o),
                    e.appendChild(l, d);
                    var d = e.createTextNode("\n        ");
                    e.appendChild(l, d),
                    e.appendChild(r, l);
                    var l = e.createTextNode("\n      ");
                    e.appendChild(r, l),
                    e.appendChild(n, r);
                    var r = e.createTextNode("\n      ");
                    e.appendChild(n, r);
                    var r = e.createElement("tbody"),
                    l = e.createTextNode("\n");
                    e.appendChild(r, l);
                    var l = e.createComment("");
                    e.appendChild(r, l);
                    var l = e.createTextNode("      ");
                    e.appendChild(r, l),
                    e.appendChild(n, r);
                    var r = e.createTextNode("\n    ");
                    e.appendChild(n, r),
                    e.appendChild(a, n);
                    var n = e.createTextNode("\n  ");
                    e.appendChild(a, n),
                    e.appendChild(t, a);
                    var a = e.createTextNode("\n");
                    return e.appendChild(t, a),
                    t
                },
                buildRenderNodes: function(e, t, a) {
                    var n = new Array(1);
                    return n[0] = e.createMorphAt(e.childAt(t, [3, 1, 3]), 1, 1),
                    n
                },
                statements: [["block", "each", [["get", "model.payments", ["loc", [null, [14, 16], [14, 30]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [14, 8], [22, 17]]]]],
                locals: [],
                templates: [e]
            }
        } (),
        t = function() {
            return {
                meta: {
                    revision: "Ember@2.8.3+c4330341",
                    loc: {
                        source: null,
                        start: {
                            line: 26,
                            column: 2
                        },
                        end: {
                            line: 28,
                            column: 2
                        }
                    },
                    moduleName: "open-ethereum-pool/templates/account/payouts.hbs"
                },
                isEmpty: !1,
                arity: 0,
                cachedFragment: null,
                hasRendered: !1,
                buildFragment: function(e) {
                    var t = e.createDocumentFragment(),
                    a = e.createTextNode("  ");
                    e.appendChild(t, a);
                    var a = e.createElement("h3"),
                    n = e.createTextNode("暂无支付记录");
                    e.appendChild(a, n),
                    e.appendChild(t, a);
                    var a = e.createTextNode("\n");
                    return e.appendChild(t, a),
                    t
                },
                buildRenderNodes: function() {
                    return []
                },
                statements: [],
                locals: [],
                templates: []
            }
        } ();
        return {
            meta: {
                revision: "Ember@2.8.3+c4330341",
                loc: {
                    source: null,
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 30,
                        column: 0
                    }
                },
                moduleName: "open-ethereum-pool/templates/account/payouts.hbs"
            },
            isEmpty: !1,
            arity: 0,
            cachedFragment: null,
            hasRendered: !1,
            buildFragment: function(e) {
                var t = e.createDocumentFragment(),
                a = e.createElement("div");
                e.setAttribute(a, "class", "container");
                var n = e.createTextNode("\n");
                e.appendChild(a, n);
                var n = e.createComment("");
                e.appendChild(a, n),
                e.appendChild(t, a);
                var a = e.createTextNode("\n");
                return e.appendChild(t, a),
                t
            },
            buildRenderNodes: function(e, t, a) {
                var n = new Array(1);
                return n[0] = e.createMorphAt(e.childAt(t, [0]), 1, 1),
                n
            },
            statements: [["block", "if", [["get", "model.payments", ["loc", [null, [2, 8], [2, 22]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [2, 2], [28, 9]]]]],
            locals: [],
            templates: [e, t]
        }
    } ())
}),
define("open-ethereum-pool/templates/application-error", ["exports"],
function(e) {
    e.
default = Ember.HTMLBars.template(function() {
        return {
            meta: {
                revision: "Ember@2.8.3+c4330341",
                loc: {
                    source: null,
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 7,
                        column: 0
                    }
                },
                moduleName: "open-ethereum-pool/templates/application-error.hbs"
            },
            isEmpty: !1,
            arity: 0,
            cachedFragment: null,
            hasRendered: !1,
            buildFragment: function(e) {
                var t = e.createDocumentFragment(),
                a = e.createElement("div");
                e.setAttribute(a, "class", "container");
                var n = e.createTextNode("\n  ");
                e.appendChild(a, n);
                var n = e.createElement("div");
                e.setAttribute(n, "class", "page-header");
                var r = e.createTextNode("\n    ");
                e.appendChild(n, r);
                var r = e.createElement("h1"),
                l = e.createTextNode("Stats API Temporarily Down");
                e.appendChild(r, l),
                e.appendChild(n, r);
                var r = e.createTextNode("\n    ");
                e.appendChild(n, r);
                var r = e.createElement("p"),
                l = e.createTextNode("Usually it's just a temporal issue and mining is not affected.");
                e.appendChild(r, l),
                e.appendChild(n, r);
                var r = e.createTextNode("\n  ");
                e.appendChild(n, r),
                e.appendChild(a, n);
                var n = e.createTextNode("\n");
                e.appendChild(a, n),
                e.appendChild(t, a);
                var a = e.createTextNode("\n");
                return e.appendChild(t, a),
                t
            },
            buildRenderNodes: function() {
                return []
            },
            statements: [],
            locals: [],
            templates: []
        }
    } ())
}),
define("open-ethereum-pool/templates/application", ["exports"],
function(e) {
    e.
default = Ember.HTMLBars.template(function() {
        var e = function() {
            var e = function() {
                return {
                    meta: {
                        revision: "Ember@2.8.3+c4330341",
                        loc: {
                            source: null,
                            start: {
                                line: 16,
                                column: 10
                            },
                            end: {
                                line: 18,
                                column: 10
                            }
                        },
                        moduleName: "open-ethereum-pool/templates/application.hbs"
                    },
                    isEmpty: !1,
                    arity: 0,
                    cachedFragment: null,
                    hasRendered: !1,
                    buildFragment: function(e) {
                        var t = e.createDocumentFragment(),
                        a = e.createTextNode("            ");
                        e.appendChild(t, a);
                        var a = e.createElement("i");
                        e.setAttribute(a, "class", "fa fa-home"),
                        e.appendChild(t, a);
                        var a = e.createTextNode(" 首页\n");
                        return e.appendChild(t, a),
                        t
                    },
                    buildRenderNodes: function() {
                        return []
                    },
                    statements: [],
                    locals: [],
                    templates: []
                }
            } ();
            return {
                meta: {
                    revision: "Ember@2.8.3+c4330341",
                    loc: {
                        source: null,
                        start: {
                            line: 15,
                            column: 8
                        },
                        end: {
                            line: 19,
                            column: 8
                        }
                    },
                    moduleName: "open-ethereum-pool/templates/application.hbs"
                },
                isEmpty: !1,
                arity: 0,
                cachedFragment: null,
                hasRendered: !1,
                buildFragment: function(e) {
                    var t = e.createDocumentFragment(),
                    a = e.createComment("");
                    return e.appendChild(t, a),
                    t
                },
                buildRenderNodes: function(e, t, a) {
                    var n = new Array(1);
                    return n[0] = e.createMorphAt(t, 0, 0, a),
                    e.insertBoundary(t, 0),
                    e.insertBoundary(t, null),
                    n
                },
                statements: [["block", "link-to", ["index"], [], 0, null, ["loc", [null, [16, 10], [18, 22]]]]],
                locals: [],
                templates: [e]
            }
        } (),
        t = function() {
            var e = function() {
                return {
                    meta: {
                        revision: "Ember@2.8.3+c4330341",
                        loc: {
                            source: null,
                            start: {
                                line: 21,
                                column: 10
                            },
                            end: {
                                line: 23,
                                column: 10
                            }
                        },
                        moduleName: "open-ethereum-pool/templates/application.hbs"
                    },
                    isEmpty: !1,
                    arity: 0,
                    cachedFragment: null,
                    hasRendered: !1,
                    buildFragment: function(e) {
                        var t = e.createDocumentFragment(),
                        a = e.createTextNode("            ");
                        e.appendChild(t, a);
                        var a = e.createElement("i");
                        e.setAttribute(a, "class", "fa fa-rocket"),
                        e.appendChild(t, a);
                        var a = e.createTextNode(" 帮助\n");
                        return e.appendChild(t, a),
                        t
                    },
                    buildRenderNodes: function() {
                        return []
                    },
                    statements: [],
                    locals: [],
                    templates: []
                }
            } ();
            return {
                meta: {
                    revision: "Ember@2.8.3+c4330341",
                    loc: {
                        source: null,
                        start: {
                            line: 20,
                            column: 8
                        },
                        end: {
                            line: 24,
                            column: 8
                        }
                    },
                    moduleName: "open-ethereum-pool/templates/application.hbs"
                },
                isEmpty: !1,
                arity: 0,
                cachedFragment: null,
                hasRendered: !1,
                buildFragment: function(e) {
                    var t = e.createDocumentFragment(),
                    a = e.createComment("");
                    return e.appendChild(t, a),
                    t
                },
                buildRenderNodes: function(e, t, a) {
                    var n = new Array(1);
                    return n[0] = e.createMorphAt(t, 0, 0, a),
                    e.insertBoundary(t, 0),
                    e.insertBoundary(t, null),
                    n
                },
                statements: [["block", "link-to", ["help"], [], 0, null, ["loc", [null, [21, 10], [23, 22]]]]],
                locals: [],
                templates: [e]
            }
        } (),
        a = function() {
            var e = function() {
                var e = function() {
                    return {
                        meta: {
                            revision: "Ember@2.8.3+c4330341",
                            loc: {
                                source: null,
                                start: {
                                    line: 28,
                                    column: 12
                                },
                                end: {
                                    line: 30,
                                    column: 12
                                }
                            },
                            moduleName: "open-ethereum-pool/templates/application.hbs"
                        },
                        isEmpty: !1,
                        arity: 0,
                        cachedFragment: null,
                        hasRendered: !1,
                        buildFragment: function(e) {
                            var t = e.createDocumentFragment(),
                            a = e.createTextNode("              ");
                            e.appendChild(t, a);
                            var a = e.createElement("span");
                            e.setAttribute(a, "class", "badge alert-success");
                            var n = e.createComment("");
                            e.appendChild(a, n),
                            e.appendChild(t, a);
                            var a = e.createTextNode("\n");
                            return e.appendChild(t, a),
                            t
                        },
                        buildRenderNodes: function(e, t, a) {
                            var n = new Array(1);
                            return n[0] = e.createMorphAt(e.childAt(t, [1]), 0, 0),
                            n
                        },
                        statements: [["content", "immatureTotal", ["loc", [null, [29, 48], [29, 65]]], 0, 0, 0, 0]],
                        locals: [],
                        templates: []
                    }
                } ();
                return {
                    meta: {
                        revision: "Ember@2.8.3+c4330341",
                        loc: {
                            source: null,
                            start: {
                                line: 26,
                                column: 10
                            },
                            end: {
                                line: 31,
                                column: 10
                            }
                        },
                        moduleName: "open-ethereum-pool/templates/application.hbs"
                    },
                    isEmpty: !1,
                    arity: 0,
                    cachedFragment: null,
                    hasRendered: !1,
                    buildFragment: function(e) {
                        var t = e.createDocumentFragment(),
                        a = e.createTextNode("            ");
                        e.appendChild(t, a);
                        var a = e.createElement("i");
                        e.setAttribute(a, "class", "fa fa-cubes"),
                        e.appendChild(t, a);
                        var a = e.createTextNode(" 出块统计\n");
                        e.appendChild(t, a);
                        var a = e.createComment("");
                        return e.appendChild(t, a),
                        t
                    },
                    buildRenderNodes: function(e, t, a) {
                        var n = new Array(1);
                        return n[0] = e.createMorphAt(t, 3, 3, a),
                        e.insertBoundary(t, null),
                        n
                    },
                    statements: [["block", "if", [["get", "immatureTotal", ["loc", [null, [28, 18], [28, 31]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [28, 12], [30, 19]]]]],
                    locals: [],
                    templates: [e]
                }
            } ();
            return {
                meta: {
                    revision: "Ember@2.8.3+c4330341",
                    loc: {
                        source: null,
                        start: {
                            line: 25,
                            column: 8
                        },
                        end: {
                            line: 32,
                            column: 8
                        }
                    },
                    moduleName: "open-ethereum-pool/templates/application.hbs"
                },
                isEmpty: !1,
                arity: 0,
                cachedFragment: null,
                hasRendered: !1,
                buildFragment: function(e) {
                    var t = e.createDocumentFragment(),
                    a = e.createComment("");
                    return e.appendChild(t, a),
                    t
                },
                buildRenderNodes: function(e, t, a) {
                    var n = new Array(1);
                    return n[0] = e.createMorphAt(t, 0, 0, a),
                    e.insertBoundary(t, 0),
                    e.insertBoundary(t, null),
                    n
                },
                statements: [["block", "link-to", ["blocks"], [], 0, null, ["loc", [null, [26, 10], [31, 22]]]]],
                locals: [],
                templates: [e]
            }
        } (),
        n = function() {
            var e = function() {
                return {
                    meta: {
                        revision: "Ember@2.8.3+c4330341",
                        loc: {
                            source: null,
                            start: {
                                line: 34,
                                column: 10
                            },
                            end: {
                                line: 36,
                                column: 10
                            }
                        },
                        moduleName: "open-ethereum-pool/templates/application.hbs"
                    },
                    isEmpty: !1,
                    arity: 0,
                    cachedFragment: null,
                    hasRendered: !1,
                    buildFragment: function(e) {
                        var t = e.createDocumentFragment(),
                        a = e.createTextNode("            ");
                        e.appendChild(t, a);
                        var a = e.createElement("i");
                        e.setAttribute(a, "class", "fa fa-paper-plane-o"),
                        e.appendChild(t, a);
                        var a = e.createTextNode(" 支付记录\n");
                        return e.appendChild(t, a),
                        t
                    },
                    buildRenderNodes: function() {
                        return []
                    },
                    statements: [],
                    locals: [],
                    templates: []
                }
            } ();
            return {
                meta: {
                    revision: "Ember@2.8.3+c4330341",
                    loc: {
                        source: null,
                        start: {
                            line: 33,
                            column: 8
                        },
                        end: {
                            line: 37,
                            column: 8
                        }
                    },
                    moduleName: "open-ethereum-pool/templates/application.hbs"
                },
                isEmpty: !1,
                arity: 0,
                cachedFragment: null,
                hasRendered: !1,
                buildFragment: function(e) {
                    var t = e.createDocumentFragment(),
                    a = e.createComment("");
                    return e.appendChild(t, a),
                    t
                },
                buildRenderNodes: function(e, t, a) {
                    var n = new Array(1);
                    return n[0] = e.createMorphAt(t, 0, 0, a),
                    e.insertBoundary(t, 0),
                    e.insertBoundary(t, null),
                    n
                },
                statements: [["block", "link-to", ["payments"], [], 0, null, ["loc", [null, [34, 10], [36, 22]]]]],
                locals: [],
                templates: [e]
            }
        } (),
        r = function() {
            var e = function() {
                return {
                    meta: {
                        revision: "Ember@2.8.3+c4330341",
                        loc: {
                            source: null,
                            start: {
                                line: 39,
                                column: 10
                            },
                            end: {
                                line: 41,
                                column: 10
                            }
                        },
                        moduleName: "open-ethereum-pool/templates/application.hbs"
                    },
                    isEmpty: !1,
                    arity: 0,
                    cachedFragment: null,
                    hasRendered: !1,
                    buildFragment: function(e) {
                        var t = e.createDocumentFragment(),
                        a = e.createTextNode("            ");
                        e.appendChild(t, a);
                        var a = e.createElement("i");
                        e.setAttribute(a, "class", "fa fa-users"),
                        e.appendChild(t, a);
                        var a = e.createTextNode(" 矿工列表\n");
                        return e.appendChild(t, a),
                        t
                    },
                    buildRenderNodes: function() {
                        return []
                    },
                    statements: [],
                    locals: [],
                    templates: []
                }
            } ();
            return {
                meta: {
                    revision: "Ember@2.8.3+c4330341",
                    loc: {
                        source: null,
                        start: {
                            line: 38,
                            column: 8
                        },
                        end: {
                            line: 42,
                            column: 8
                        }
                    },
                    moduleName: "open-ethereum-pool/templates/application.hbs"
                },
                isEmpty: !1,
                arity: 0,
                cachedFragment: null,
                hasRendered: !1,
                buildFragment: function(e) {
                    var t = e.createDocumentFragment(),
                    a = e.createComment("");
                    return e.appendChild(t, a),
                    t
                },
                buildRenderNodes: function(e, t, a) {
                    var n = new Array(1);
                    return n[0] = e.createMorphAt(t, 0, 0, a),
                    e.insertBoundary(t, 0),
                    e.insertBoundary(t, null),
                    n
                },
                statements: [["block", "link-to", ["miners"], [], 0, null, ["loc", [null, [39, 10], [41, 22]]]]],
                locals: [],
                templates: [e]
            }
        } (),
        l = function() {
            var e = function() {
                return {
                    meta: {
                        revision: "Ember@2.8.3+c4330341",
                        loc: {
                            source: null,
                            start: {
                                line: 44,
                                column: 10
                            },
                            end: {
                                line: 46,
                                column: 10
                            }
                        },
                        moduleName: "open-ethereum-pool/templates/application.hbs"
                    },
                    isEmpty: !1,
                    arity: 0,
                    cachedFragment: null,
                    hasRendered: !1,
                    buildFragment: function(e) {
                        var t = e.createDocumentFragment(),
                        a = e.createTextNode("            ");
                        e.appendChild(t, a);
                        var a = e.createElement("i");
                        e.setAttribute(a, "class", "fa fa-comments"),
                        e.appendChild(t, a);
                        var a = e.createTextNode(" 使用须知 ");
                        e.appendChild(t, a);
                        var a = e.createElement("span");
                        e.setAttribute(a, "class", "badge alert-success");
                        var n = e.createTextNode("✓");
                        e.appendChild(a, n),
                        e.appendChild(t, a);
                        var a = e.createTextNode("\n");
                        return e.appendChild(t, a),
                        t
                    },
                    buildRenderNodes: function() {
                        return []
                    },
                    statements: [],
                    locals: [],
                    templates: []
                }
            } ();
            return {
                meta: {
                    revision: "Ember@2.8.3+c4330341",
                    loc: {
                        source: null,
                        start: {
                            line: 43,
                            column: 8
                        },
                        end: {
                            line: 47,
                            column: 8
                        }
                    },
                    moduleName: "open-ethereum-pool/templates/application.hbs"
                },
                isEmpty: !1,
                arity: 0,
                cachedFragment: null,
                hasRendered: !1,
                buildFragment: function(e) {
                    var t = e.createDocumentFragment(),
                    a = e.createComment("");
                    return e.appendChild(t, a),
                    t
                },
                buildRenderNodes: function(e, t, a) {
                    var n = new Array(1);
                    return n[0] = e.createMorphAt(t, 0, 0, a),
                    e.insertBoundary(t, 0),
                    e.insertBoundary(t, null),
                    n
                },
                statements: [["block", "link-to", ["about"], [], 0, null, ["loc", [null, [44, 10], [46, 22]]]]],
                locals: [],
                templates: [e]
            }
        } ();
        return {
            meta: {
                revision: "Ember@2.8.3+c4330341",
                loc: {
                    source: null,
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 54,
                        column: 0
                    }
                },
                moduleName: "open-ethereum-pool/templates/application.hbs"
            },
            isEmpty: !1,
            arity: 0,
            cachedFragment: null,
            hasRendered: !1,
            buildFragment: function(e) {
                var t = e.createDocumentFragment(),
                a = e.createComment(" Fixed navbar ");
                e.appendChild(t, a);
                var a = e.createTextNode("\n");
                e.appendChild(t, a);
                var a = e.createElement("div");
                e.setAttribute(a, "class", "navbar navbar-default navbar-fixed-top"),
                e.setAttribute(a, "role", "navigation");
                var n = e.createTextNode("\n  ");
                e.appendChild(a, n);
                var n = e.createElement("div");
                e.setAttribute(n, "class", "container");
                var r = e.createTextNode("\n    ");
                e.appendChild(n, r);
                var r = e.createElement("div");
                e.setAttribute(r, "class", "navbar-header");
                var l = e.createTextNode("\n      ");
                e.appendChild(r, l);
                var l = e.createElement("button");
                e.setAttribute(l, "type", "button"),
                e.setAttribute(l, "class", "navbar-toggle"),
                e.setAttribute(l, "data-toggle", "collapse"),
                e.setAttribute(l, "data-target", ".navbar-collapse");
                var d = e.createTextNode("\n          ");
                e.appendChild(l, d);
                var d = e.createElement("span");
                e.setAttribute(d, "class", "sr-only");
                var o = e.createTextNode("Toggle navigation");
                e.appendChild(d, o),
                e.appendChild(l, d);
                var d = e.createTextNode("\n          ");
                e.appendChild(l, d);
                var d = e.createElement("span");
                e.setAttribute(d, "class", "icon-bar"),
                e.appendChild(l, d);
                var d = e.createTextNode("\n          ");
                e.appendChild(l, d);
                var d = e.createElement("span");
                e.setAttribute(d, "class", "icon-bar"),
                e.appendChild(l, d);
                var d = e.createTextNode("\n          ");
                e.appendChild(l, d);
                var d = e.createElement("span");
                e.setAttribute(d, "class", "icon-bar"),
                e.appendChild(l, d);
                var d = e.createTextNode("\n      ");
                e.appendChild(l, d),
                e.appendChild(r, l);
                var l = e.createTextNode("\n      ");
                e.appendChild(r, l);
                var l = e.createElement("a");
                e.setAttribute(l, "class", "navbar-brand");
                var d = e.createElement("span");
                e.setAttribute(d, "class", "logo-1");
                var o = e.createTextNode("OFcoin 矿池");
                e.appendChild(d, o),
                e.appendChild(l, d);
                var d = e.createElement("span");
                e.setAttribute(d, "class", "logo-2");
                var o = e.createTextNode("Pool");
                e.appendChild(d, o),
                e.appendChild(l, d),
                e.appendChild(r, l);
                var l = e.createTextNode("\n    ");
                e.appendChild(r, l),
                e.appendChild(n, r);
                var r = e.createTextNode("\n    ");
                e.appendChild(n, r);
                var r = e.createElement("div");
                e.setAttribute(r, "class", "collapse navbar-collapse");
                var l = e.createTextNode("\n      ");
                e.appendChild(r, l);
                var l = e.createElement("ul");
                e.setAttribute(l, "class", "nav navbar-nav");
                var d = e.createTextNode("\n");
                e.appendChild(l, d);
                var d = e.createComment("");
                e.appendChild(l, d);
                var d = e.createComment("");
                e.appendChild(l, d);
                var d = e.createComment("");
                e.appendChild(l, d);
                var d = e.createComment("");
                e.appendChild(l, d);
                var d = e.createComment("");
                e.appendChild(l, d);
                var d = e.createComment("");
                e.appendChild(l, d);
                var d = e.createTextNode("      ");
                e.appendChild(l, d),
                e.appendChild(r, l);
                var l = e.createTextNode("\n    ");
                e.appendChild(r, l),
                e.appendChild(n, r);
                var r = e.createTextNode("\n  ");
                e.appendChild(n, r),
                e.appendChild(a, n);
                var n = e.createTextNode("\n");
                e.appendChild(a, n),
                e.appendChild(t, a);
                var a = e.createTextNode("\n\n");
                e.appendChild(t, a);
                var a = e.createComment("");
                e.appendChild(t, a);
                var a = e.createTextNode("\n");
                return e.appendChild(t, a),
                t
            },
            buildRenderNodes: function(e, t, a) {
                var n = e.childAt(t, [2, 1, 3, 1]),
                r = new Array(7);
                return r[0] = e.createMorphAt(n, 1, 1),
                r[1] = e.createMorphAt(n, 2, 2),
                r[2] = e.createMorphAt(n, 3, 3),
                r[3] = e.createMorphAt(n, 4, 4),
                r[4] = e.createMorphAt(n, 5, 5),
                r[5] = e.createMorphAt(n, 6, 6),
                r[6] = e.createMorphAt(t, 4, 4, a),
                r
            },
            statements: [["block", "active-li", [], ["currentWhen", "index"], 0, null, ["loc", [null, [15, 8], [19, 22]]]], ["block", "active-li", [], ["currentWhen", "help"], 1, null, ["loc", [null, [20, 8], [24, 22]]]], ["block", "active-li", [], ["currentWhen", "blocks"], 2, null, ["loc", [null, [25, 8], [32, 22]]]], ["block", "active-li", [], ["currentWhen", "payments"], 3, null, ["loc", [null, [33, 8], [37, 22]]]], ["block", "active-li", [], ["currentWhen", "miners"], 4, null, ["loc", [null, [38, 8], [42, 22]]]], ["block", "active-li", [], ["currentWhen", "about"], 5, null, ["loc", [null, [43, 8], [47, 22]]]], ["content", "outlet", ["loc", [null, [53, 0], [53, 10]]], 0, 0, 0, 0]],
            locals: [],
            templates: [e, t, a, n, r, l]
        }
    } ())
}),
define("open-ethereum-pool/templates/blocks", ["exports"],
function(e) {
    e.
default = Ember.HTMLBars.template(function() {
        var e = function() {
            return {
                meta: {
                    revision: "Ember@2.8.3+c4330341",
                    loc: {
                        source: null,
                        start: {
                            line: 11,
                            column: 2
                        },
                        end: {
                            line: 13,
                            column: 2
                        }
                    },
                    moduleName: "open-ethereum-pool/templates/blocks.hbs"
                },
                isEmpty: !1,
                arity: 0,
                cachedFragment: null,
                hasRendered: !1,
                buildFragment: function(e) {
                    var t = e.createDocumentFragment(),
                    a = e.createTextNode("    ");
                    e.appendChild(t, a);
                    var a = e.createComment("");
                    e.appendChild(t, a);
                    var a = e.createTextNode("\n");
                    return e.appendChild(t, a),
                    t
                },
                buildRenderNodes: function(e, t, a) {
                    var n = new Array(1);
                    return n[0] = e.createMorphAt(t, 1, 1, a),
                    n
                },
                statements: [["inline", "partial", ["luck"], [], ["loc", [null, [12, 4], [12, 22]]], 0, 0]],
                locals: [],
                templates: []
            }
        } (),
        t = function() {
            var e = function() {
                return {
                    meta: {
                        revision: "Ember@2.8.3+c4330341",
                        loc: {
                            source: null,
                            start: {
                                line: 16,
                                column: 6
                            },
                            end: {
                                line: 16,
                                column: 117
                            }
                        },
                        moduleName: "open-ethereum-pool/templates/blocks.hbs"
                    },
                    isEmpty: !1,
                    arity: 0,
                    cachedFragment: null,
                    hasRendered: !1,
                    buildFragment: function(e) {
                        var t = e.createDocumentFragment(),
                        a = e.createTextNode("已成熟的区块 ");
                        e.appendChild(t, a);
                        var a = e.createElement("span");
                        e.setAttribute(a, "class", "badge alert-success");
                        var n = e.createComment("");
                        return e.appendChild(a, n),
                        e.appendChild(t, a),
                        t
                    },
                    buildRenderNodes: function(e, t, a) {
                        var n = new Array(1);
                        return n[0] = e.createMorphAt(e.childAt(t, [1]), 0, 0),
                        n
                    },
                    statements: [["inline", "format-number", [["get", "model.maturedTotal", ["loc", [null, [16, 90], [16, 108]]], 0, 0, 0, 0]], [], ["loc", [null, [16, 74], [16, 110]]], 0, 0]],
                    locals: [],
                    templates: []
                }
            } ();
            return {
                meta: {
                    revision: "Ember@2.8.3+c4330341",
                    loc: {
                        source: null,
                        start: {
                            line: 15,
                            column: 4
                        },
                        end: {
                            line: 17,
                            column: 4
                        }
                    },
                    moduleName: "open-ethereum-pool/templates/blocks.hbs"
                },
                isEmpty: !1,
                arity: 0,
                cachedFragment: null,
                hasRendered: !1,
                buildFragment: function(e) {
                    var t = e.createDocumentFragment(),
                    a = e.createTextNode("      ");
                    e.appendChild(t, a);
                    var a = e.createComment("");
                    e.appendChild(t, a);
                    var a = e.createTextNode("\n");
                    return e.appendChild(t, a),
                    t
                },
                buildRenderNodes: function(e, t, a) {
                    var n = new Array(1);
                    return n[0] = e.createMorphAt(t, 1, 1, a),
                    n
                },
                statements: [["block", "link-to", ["blocks.index"], [], 0, null, ["loc", [null, [16, 6], [16, 129]]]]],
                locals: [],
                templates: [e]
            }
        } (),
        a = function() {
            var e = function() {
                return {
                    meta: {
                        revision: "Ember@2.8.3+c4330341",
                        loc: {
                            source: null,
                            start: {
                                line: 19,
                                column: 6
                            },
                            end: {
                                line: 19,
                                column: 120
                            }
                        },
                        moduleName: "open-ethereum-pool/templates/blocks.hbs"
                    },
                    isEmpty: !1,
                    arity: 0,
                    cachedFragment: null,
                    hasRendered: !1,
                    buildFragment: function(e) {
                        var t = e.createDocumentFragment(),
                        a = e.createTextNode("待成熟区块 ");
                        e.appendChild(t, a);
                        var a = e.createElement("span");
                        e.setAttribute(a, "class", "badge alert-success");
                        var n = e.createComment("");
                        return e.appendChild(a, n),
                        e.appendChild(t, a),
                        t
                    },
                    buildRenderNodes: function(e, t, a) {
                        var n = new Array(1);
                        return n[0] = e.createMorphAt(e.childAt(t, [1]), 0, 0),
                        n
                    },
                    statements: [["inline", "format-number", [["get", "model.immatureTotal", ["loc", [null, [19, 92], [19, 111]]], 0, 0, 0, 0]], [], ["loc", [null, [19, 76], [19, 113]]], 0, 0]],
                    locals: [],
                    templates: []
                }
            } ();
            return {
                meta: {
                    revision: "Ember@2.8.3+c4330341",
                    loc: {
                        source: null,
                        start: {
                            line: 18,
                            column: 4
                        },
                        end: {
                            line: 20,
                            column: 4
                        }
                    },
                    moduleName: "open-ethereum-pool/templates/blocks.hbs"
                },
                isEmpty: !1,
                arity: 0,
                cachedFragment: null,
                hasRendered: !1,
                buildFragment: function(e) {
                    var t = e.createDocumentFragment(),
                    a = e.createTextNode("      ");
                    e.appendChild(t, a);
                    var a = e.createComment("");
                    e.appendChild(t, a);
                    var a = e.createTextNode("\n");
                    return e.appendChild(t, a),
                    t
                },
                buildRenderNodes: function(e, t, a) {
                    var n = new Array(1);
                    return n[0] = e.createMorphAt(t, 1, 1, a),
                    n
                },
                statements: [["block", "link-to", ["blocks.immature"], [], 0, null, ["loc", [null, [19, 6], [19, 132]]]]],
                locals: [],
                templates: [e]
            }
        } (),
        n = function() {
            var e = function() {
                return {
                    meta: {
                        revision: "Ember@2.8.3+c4330341",
                        loc: {
                            source: null,
                            start: {
                                line: 22,
                                column: 6
                            },
                            end: {
                                line: 22,
                                column: 118
                            }
                        },
                        moduleName: "open-ethereum-pool/templates/blocks.hbs"
                    },
                    isEmpty: !1,
                    arity: 0,
                    cachedFragment: null,
                    hasRendered: !1,
                    buildFragment: function(e) {
                        var t = e.createDocumentFragment(),
                        a = e.createTextNode("新挖到区块 ");
                        e.appendChild(t, a);
                        var a = e.createElement("span");
                        e.setAttribute(a, "class", "badge alert-info");
                        var n = e.createComment("");
                        return e.appendChild(a, n),
                        e.appendChild(t, a),
                        t
                    },
                    buildRenderNodes: function(e, t, a) {
                        var n = new Array(1);
                        return n[0] = e.createMorphAt(e.childAt(t, [1]), 0, 0),
                        n
                    },
                    statements: [["inline", "format-number", [["get", "model.candidatesTotal", ["loc", [null, [22, 88], [22, 109]]], 0, 0, 0, 0]], [], ["loc", [null, [22, 72], [22, 111]]], 0, 0]],
                    locals: [],
                    templates: []
                }
            } ();
            return {
                meta: {
                    revision: "Ember@2.8.3+c4330341",
                    loc: {
                        source: null,
                        start: {
                            line: 21,
                            column: 4
                        },
                        end: {
                            line: 23,
                            column: 4
                        }
                    },
                    moduleName: "open-ethereum-pool/templates/blocks.hbs"
                },
                isEmpty: !1,
                arity: 0,
                cachedFragment: null,
                hasRendered: !1,
                buildFragment: function(e) {
                    var t = e.createDocumentFragment(),
                    a = e.createTextNode("      ");
                    e.appendChild(t, a);
                    var a = e.createComment("");
                    e.appendChild(t, a);
                    var a = e.createTextNode("\n");
                    return e.appendChild(t, a),
                    t
                },
                buildRenderNodes: function(e, t, a) {
                    var n = new Array(1);
                    return n[0] = e.createMorphAt(t, 1, 1, a),
                    n
                },
                statements: [["block", "link-to", ["blocks.pending"], [], 0, null, ["loc", [null, [22, 6], [22, 130]]]]],
                locals: [],
                templates: [e]
            }
        } ();
        return {
            meta: {
                revision: "Ember@2.8.3+c4330341",
                loc: {
                    source: null,
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 27,
                        column: 0
                    }
                },
                moduleName: "open-ethereum-pool/templates/blocks.hbs"
            },
            isEmpty: !1,
            arity: 0,
            cachedFragment: null,
            hasRendered: !1,
            buildFragment: function(e) {
                var t = e.createDocumentFragment(),
                a = e.createElement("div");
                e.setAttribute(a, "class", "jumbotron");
                var n = e.createTextNode("\n  ");
                e.appendChild(a, n);
                var n = e.createElement("div");
                e.setAttribute(n, "class", "container");
                var r = e.createTextNode("\n    ");
                e.appendChild(n, r);
                var r = e.createElement("p");
                e.setAttribute(r, "class", "lead");
                var l = e.createTextNode("矿池负担转账手续费，并对叔块进行支付");
                e.appendChild(r, l),
                e.appendChild(n, r);
                var r = e.createTextNode("\n    ");
                e.appendChild(n, r);
                var r = e.createElement("strong"),
                l = e.createTextNode("\n      新挖到的区块需要 ");
                e.appendChild(r, l);
                var l = e.createElement("u"),
                d = e.createTextNode("大约");
                e.appendChild(l, d),
                e.appendChild(r, l);
                var l = e.createTextNode(" ");
                e.appendChild(r, l),
                e.appendChild(n, r);
                var r = e.createTextNode(" ");
                e.appendChild(n, r);
                var r = e.createElement("span");
                e.setAttribute(r, "class", "label label-success");
                var l = e.createTextNode("12");
                e.appendChild(r, l),
                e.appendChild(n, r);
                var r = e.createTextNode(" ");
                e.appendChild(n, r);
                var r = e.createElement("strong"),
                l = e.createTextNode("个确认才能成熟。\n      但是通常会少于这个数。\n    ");
                e.appendChild(r, l),
                e.appendChild(n, r);
                var r = e.createTextNode("\n  ");
                e.appendChild(n, r),
                e.appendChild(a, n);
                var n = e.createTextNode("\n");
                e.appendChild(a, n),
                e.appendChild(t, a);
                var a = e.createTextNode("\n");
                e.appendChild(t, a);
                var a = e.createElement("div");
                e.setAttribute(a, "class", "container");
                var n = e.createTextNode("\n");
                e.appendChild(a, n);
                var n = e.createComment("");
                e.appendChild(a, n);
                var n = e.createTextNode("  ");
                e.appendChild(a, n);
                var n = e.createElement("ul");
                e.setAttribute(n, "class", "nav nav-tabs");
                var r = e.createTextNode("\n");
                e.appendChild(n, r);
                var r = e.createComment("");
                e.appendChild(n, r);
                var r = e.createComment("");
                e.appendChild(n, r);
                var r = e.createComment("");
                e.appendChild(n, r);
                var r = e.createTextNode("  ");
                e.appendChild(n, r),
                e.appendChild(a, n);
                var n = e.createTextNode("\n  ");
                e.appendChild(a, n);
                var n = e.createComment("");
                e.appendChild(a, n);
                var n = e.createTextNode("\n");
                e.appendChild(a, n),
                e.appendChild(t, a);
                var a = e.createTextNode("\n");
                return e.appendChild(t, a),
                t
            },
            buildRenderNodes: function(e, t, a) {
                var n = e.childAt(t, [2]),
                r = e.childAt(n, [3]),
                l = new Array(5);
                return l[0] = e.createMorphAt(n, 1, 1),
                l[1] = e.createMorphAt(r, 1, 1),
                l[2] = e.createMorphAt(r, 2, 2),
                l[3] = e.createMorphAt(r, 3, 3),
                l[4] = e.createMorphAt(n, 5, 5),
                l
            },
            statements: [["block", "if", [["get", "model.luck", ["loc", [null, [11, 8], [11, 18]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [11, 2], [13, 9]]]], ["block", "active-li", [], ["currentWhen", "blocks.index", "role", "presentation"], 1, null, ["loc", [null, [15, 4], [17, 18]]]], ["block", "active-li", [], ["currentWhen", "blocks.immature", "role", "presentation"], 2, null, ["loc", [null, [18, 4], [20, 18]]]], ["block", "active-li", [], ["currentWhen", "blocks.pending", "role", "presentation"], 3, null, ["loc", [null, [21, 4], [23, 18]]]], ["content", "outlet", ["loc", [null, [25, 2], [25, 12]]], 0, 0, 0, 0]],
            locals: [],
            templates: [e, t, a, n]
        }
    } ())
}),
define("open-ethereum-pool/templates/blocks/block", ["exports"],
function(e) {
    e.
default = Ember.HTMLBars.template(function() {
        var e = function() {
            return {
                meta: {
                    revision: "Ember@2.8.3+c4330341",
                    loc: {
                        source: null,
                        start: {
                            line: 3,
                            column: 4
                        },
                        end: {
                            line: 5,
                            column: 4
                        }
                    },
                    moduleName: "open-ethereum-pool/templates/blocks/block.hbs"
                },
                isEmpty: !1,
                arity: 0,
                cachedFragment: null,
                hasRendered: !1,
                buildFragment: function(e) {
                    var t = e.createDocumentFragment(),
                    a = e.createTextNode("      ");
                    e.appendChild(t, a);
                    var a = e.createElement("a");
                    e.setAttribute(a, "rel", "nofollow"),
                    e.setAttribute(a, "target", "_blank");
                    var n = e.createComment("");
                    e.appendChild(a, n),
                    e.appendChild(t, a);
                    var a = e.createTextNode("\n");
                    return e.appendChild(t, a),
                    t
                },
                buildRenderNodes: function(e, t, a) {
                    var n = e.childAt(t, [1]),
                    r = new Array(2);
                    return r[0] = e.createAttrMorph(n, "href"),
                    r[1] = e.createMorphAt(n, 0, 0),
                    r
                },
                statements: [["attribute", "href", ["concat", ["http://www.ofcoin.com/block.html?block_height=", ["get", "block.uncleHeight", ["loc", [null, [4, 67], [4, 84]]], 0, 0, 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["inline", "format-number", [["get", "block.height", ["loc", [null, [4, 135], [4, 147]]], 0, 0, 0, 0]], [], ["loc", [null, [4, 119], [4, 149]]], 0, 0]],
                locals: [],
                templates: []
            }
        } (),
        t = function() {
            return {
                meta: {
                    revision: "Ember@2.8.3+c4330341",
                    loc: {
                        source: null,
                        start: {
                            line: 5,
                            column: 4
                        },
                        end: {
                            line: 7,
                            column: 4
                        }
                    },
                    moduleName: "open-ethereum-pool/templates/blocks/block.hbs"
                },
                isEmpty: !1,
                arity: 0,
                cachedFragment: null,
                hasRendered: !1,
                buildFragment: function(e) {
                    var t = e.createDocumentFragment(),
                    a = e.createTextNode("      ");
                    e.appendChild(t, a);
                    var a = e.createElement("a");
                    e.setAttribute(a, "rel", "nofollow"),
                    e.setAttribute(a, "target", "_blank");
                    var n = e.createComment("");
                    e.appendChild(a, n),
                    e.appendChild(t, a);
                    var a = e.createTextNode("\n");
                    return e.appendChild(t, a),
                    t
                },
                buildRenderNodes: function(e, t, a) {
                    var n = e.childAt(t, [1]),
                    r = new Array(2);
                    return r[0] = e.createAttrMorph(n, "href"),
                    r[1] = e.createMorphAt(n, 0, 0),
                    r
                },
                statements: [["attribute", "href", ["concat", ["http://www.ofcoin.com/block.html?block_height=", ["get", "block.height", ["loc", [null, [6, 67], [6, 79]]], 0, 0, 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["inline", "format-number", [["get", "block.height", ["loc", [null, [6, 130], [6, 142]]], 0, 0, 0, 0]], [], ["loc", [null, [6, 114], [6, 144]]], 0, 0]],
                locals: [],
                templates: []
            }
        } (),
        a = function() {
            return {
                meta: {
                    revision: "Ember@2.8.3+c4330341",
                    loc: {
                        source: null,
                        start: {
                            line: 10,
                            column: 4
                        },
                        end: {
                            line: 12,
                            column: 4
                        }
                    },
                    moduleName: "open-ethereum-pool/templates/blocks/block.hbs"
                },
                isEmpty: !1,
                arity: 0,
                cachedFragment: null,
                hasRendered: !1,
                buildFragment: function(e) {
                    var t = e.createDocumentFragment(),
                    a = e.createTextNode("      ");
                    e.appendChild(t, a);
                    var a = e.createElement("a");
                    e.setAttribute(a, "class", "hash"),
                    e.setAttribute(a, "rel", "nofollow"),
                    e.setAttribute(a, "target", "_blank");
                    var n = e.createComment("");
                    e.appendChild(a, n),
                    e.appendChild(t, a);
                    var a = e.createTextNode("\n");
                    return e.appendChild(t, a),
                    t
                },
                buildRenderNodes: function(e, t, a) {
                    var n = e.childAt(t, [1]),
                    r = new Array(2);
                    return r[0] = e.createAttrMorph(n, "href"),
                    r[1] = e.createMorphAt(n, 0, 0),
                    r
                },
                statements: [["attribute", "href", ["concat", ["http://www.ofcoin.com/block.html?block_height=", ["get", "block.uncleHeight", ["loc", [null, [11, 67], [11, 84]]], 0, 0, 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["content", "block.hash", ["loc", [null, [11, 132], [11, 146]]], 0, 0, 0, 0]],
                locals: [],
                templates: []
            }
        } (),
        n = function() {
            var e = function() {
                return {
                    meta: {
                        revision: "Ember@2.8.3+c4330341",
                        loc: {
                            source: null,
                            start: {
                                line: 12,
                                column: 4
                            },
                            end: {
                                line: 14,
                                column: 4
                            }
                        },
                        moduleName: "open-ethereum-pool/templates/blocks/block.hbs"
                    },
                    isEmpty: !1,
                    arity: 0,
                    cachedFragment: null,
                    hasRendered: !1,
                    buildFragment: function(e) {
                        var t = e.createDocumentFragment(),
                        a = e.createTextNode("      ");
                        e.appendChild(t, a);
                        var a = e.createElement("span");
                        e.setAttribute(a, "class", "label label-danger");
                        var n = e.createTextNode("孤块！无奖励");
                        e.appendChild(a, n),
                        e.appendChild(t, a);
                        var a = e.createTextNode("\n");
                        return e.appendChild(t, a),
                        t
                    },
                    buildRenderNodes: function() {
                        return []
                    },
                    statements: [],
                    locals: [],
                    templates: []
                }
            } (),
            t = function() {
                return {
                    meta: {
                        revision: "Ember@2.8.3+c4330341",
                        loc: {
                            source: null,
                            start: {
                                line: 14,
                                column: 4
                            },
                            end: {
                                line: 16,
                                column: 4
                            }
                        },
                        moduleName: "open-ethereum-pool/templates/blocks/block.hbs"
                    },
                    isEmpty: !1,
                    arity: 0,
                    cachedFragment: null,
                    hasRendered: !1,
                    buildFragment: function(e) {
                        var t = e.createDocumentFragment(),
                        a = e.createTextNode("      ");
                        e.appendChild(t, a);
                        var a = e.createElement("a");
                        e.setAttribute(a, "class", "hash"),
                        e.setAttribute(a, "rel", "nofollow"),
                        e.setAttribute(a, "target", "_blank");
                        var n = e.createComment("");
                        e.appendChild(a, n),
                        e.appendChild(t, a);
                        var a = e.createTextNode("\n    ");
                        return e.appendChild(t, a),
                        t
                    },
                    buildRenderNodes: function(e, t, a) {
                        var n = e.childAt(t, [1]),
                        r = new Array(2);
                        return r[0] = e.createAttrMorph(n, "href"),
                        r[1] = e.createMorphAt(n, 0, 0),
                        r
                    },
                    statements: [["attribute", "href", ["concat", ["http://www.ofcoin.com/block.html?block_height=", ["get", "block.height", ["loc", [null, [15, 67], [15, 79]]], 0, 0, 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["content", "block.hash", ["loc", [null, [15, 127], [15, 141]]], 0, 0, 0, 0]],
                    locals: [],
                    templates: []
                }
            } ();
            return {
                meta: {
                    revision: "Ember@2.8.3+c4330341",
                    loc: {
                        source: null,
                        start: {
                            line: 12,
                            column: 4
                        },
                        end: {
                            line: 16,
                            column: 4
                        }
                    },
                    moduleName: "open-ethereum-pool/templates/blocks/block.hbs"
                },
                isEmpty: !1,
                arity: 0,
                cachedFragment: null,
                hasRendered: !1,
                buildFragment: function(e) {
                    var t = e.createDocumentFragment(),
                    a = e.createComment("");
                    return e.appendChild(t, a),
                    t
                },
                buildRenderNodes: function(e, t, a) {
                    var n = new Array(1);
                    return n[0] = e.createMorphAt(t, 0, 0, a),
                    e.insertBoundary(t, 0),
                    e.insertBoundary(t, null),
                    n
                },
                statements: [["block", "if", [["get", "block.orphan", ["loc", [null, [12, 14], [12, 26]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [12, 4], [16, 4]]]]],
                locals: [],
                templates: [e, t]
            }
        } (),
        r = function() {
            return {
                meta: {
                    revision: "Ember@2.8.3+c4330341",
                    loc: {
                        source: null,
                        start: {
                            line: 20,
                            column: 4
                        },
                        end: {
                            line: 22,
                            column: 4
                        }
                    },
                    moduleName: "open-ethereum-pool/templates/blocks/block.hbs"
                },
                isEmpty: !1,
                arity: 0,
                cachedFragment: null,
                hasRendered: !1,
                buildFragment: function(e) {
                    var t = e.createDocumentFragment(),
                    a = e.createTextNode("      ");
                    e.appendChild(t, a);
                    var a = e.createElement("span");
                    e.setAttribute(a, "class", "label label-success");
                    var n = e.createComment("");
                    e.appendChild(a, n),
                    e.appendChild(t, a);
                    var a = e.createTextNode("\n");
                    return e.appendChild(t, a),
                    t
                },
                buildRenderNodes: function(e, t, a) {
                    var n = new Array(1);
                    return n[0] = e.createMorphAt(e.childAt(t, [1]), 0, 0),
                    n
                },
                statements: [["inline", "format-number", [["get", "block.variance", ["loc", [null, [21, 56], [21, 70]]], 0, 0, 0, 0]], ["style", "percent"], ["loc", [null, [21, 40], [21, 88]]], 0, 0]],
                locals: [],
                templates: []
            }
        } (),
        l = function() {
            return {
                meta: {
                    revision: "Ember@2.8.3+c4330341",
                    loc: {
                        source: null,
                        start: {
                            line: 22,
                            column: 4
                        },
                        end: {
                            line: 24,
                            column: 4
                        }
                    },
                    moduleName: "open-ethereum-pool/templates/blocks/block.hbs"
                },
                isEmpty: !1,
                arity: 0,
                cachedFragment: null,
                hasRendered: !1,
                buildFragment: function(e) {
                    var t = e.createDocumentFragment(),
                    a = e.createTextNode("      ");
                    e.appendChild(t, a);
                    var a = e.createElement("span");
                    e.setAttribute(a, "class", "label label-info");
                    var n = e.createComment("");
                    e.appendChild(a, n),
                    e.appendChild(t, a);
                    var a = e.createTextNode("\n");
                    return e.appendChild(t, a),
                    t
                },
                buildRenderNodes: function(e, t, a) {
                    var n = new Array(1);
                    return n[0] = e.createMorphAt(e.childAt(t, [1]), 0, 0),
                    n
                },
                statements: [["inline", "format-number", [["get", "block.variance", ["loc", [null, [23, 53], [23, 67]]], 0, 0, 0, 0]], ["style", "percent"], ["loc", [null, [23, 37], [23, 85]]], 0, 0]],
                locals: [],
                templates: []
            }
        } (),
        d = function() {
            return {
                meta: {
                    revision: "Ember@2.8.3+c4330341",
                    loc: {
                        source: null,
                        start: {
                            line: 27,
                            column: 4
                        },
                        end: {
                            line: 29,
                            column: 4
                        }
                    },
                    moduleName: "open-ethereum-pool/templates/blocks/block.hbs"
                },
                isEmpty: !1,
                arity: 0,
                cachedFragment: null,
                hasRendered: !1,
                buildFragment: function(e) {
                    var t = e.createDocumentFragment(),
                    a = e.createTextNode("    ");
                    e.appendChild(t, a);
                    var a = e.createElement("span");
                    e.setAttribute(a, "class", "label label-default");
                    var n = e.createComment("");
                    e.appendChild(a, n),
                    e.appendChild(t, a);
                    var a = e.createTextNode("\n");
                    return e.appendChild(t, a),
                    t
                },
                buildRenderNodes: function(e, t, a) {
                    var n = new Array(1);
                    return n[0] = e.createMorphAt(e.childAt(t, [1]), 0, 0),
                    n
                },
                statements: [["content", "block.formatReward", ["loc", [null, [28, 38], [28, 60]]], 0, 0, 0, 0]],
                locals: [],
                templates: []
            }
        } (),
        o = function() {
            var e = function() {
                return {
                    meta: {
                        revision: "Ember@2.8.3+c4330341",
                        loc: {
                            source: null,
                            start: {
                                line: 29,
                                column: 4
                            },
                            end: {
                                line: 31,
                                column: 4
                            }
                        },
                        moduleName: "open-ethereum-pool/templates/blocks/block.hbs"
                    },
                    isEmpty: !1,
                    arity: 0,
                    cachedFragment: null,
                    hasRendered: !1,
                    buildFragment: function(e) {
                        var t = e.createDocumentFragment(),
                        a = e.createTextNode("    ");
                        e.appendChild(t, a);
                        var a = e.createElement("span");
                        e.setAttribute(a, "class", "label label-primary");
                        var n = e.createComment("");
                        e.appendChild(a, n),
                        e.appendChild(t, a);
                        var a = e.createTextNode("\n    ");
                        return e.appendChild(t, a),
                        t
                    },
                    buildRenderNodes: function(e, t, a) {
                        var n = new Array(1);
                        return n[0] = e.createMorphAt(e.childAt(t, [1]), 0, 0),
                        n
                    },
                    statements: [["content", "block.formatReward", ["loc", [null, [30, 38], [30, 60]]], 0, 0, 0, 0]],
                    locals: [],
                    templates: []
                }
            } ();
            return {
                meta: {
                    revision: "Ember@2.8.3+c4330341",
                    loc: {
                        source: null,
                        start: {
                            line: 29,
                            column: 4
                        },
                        end: {
                            line: 31,
                            column: 4
                        }
                    },
                    moduleName: "open-ethereum-pool/templates/blocks/block.hbs"
                },
                isEmpty: !1,
                arity: 0,
                cachedFragment: null,
                hasRendered: !1,
                buildFragment: function(e) {
                    var t = e.createDocumentFragment(),
                    a = e.createComment("");
                    return e.appendChild(t, a),
                    t
                },
                buildRenderNodes: function(e, t, a) {
                    var n = new Array(1);
                    return n[0] = e.createMorphAt(t, 0, 0, a),
                    e.insertBoundary(t, 0),
                    e.insertBoundary(t, null),
                    n
                },
                statements: [["block", "if", [["get", "block.isOk", ["loc", [null, [29, 14], [29, 24]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [29, 4], [31, 4]]]]],
                locals: [],
                templates: [e]
            }
        } ();
        return {
            meta: {
                revision: "Ember@2.8.3+c4330341",
                loc: {
                    source: null,
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 34,
                        column: 0
                    }
                },
                moduleName: "open-ethereum-pool/templates/blocks/block.hbs"
            },
            isEmpty: !1,
            arity: 0,
            cachedFragment: null,
            hasRendered: !1,
            buildFragment: function(e) {
                var t = e.createDocumentFragment(),
                a = e.createElement("tr"),
                n = e.createTextNode("\n  ");
                e.appendChild(a, n);
                var n = e.createElement("td"),
                r = e.createTextNode("\n");
                e.appendChild(n, r);
                var r = e.createComment("");
                e.appendChild(n, r);
                var r = e.createTextNode("  ");
                e.appendChild(n, r),
                e.appendChild(a, n);
                var n = e.createTextNode("\n  ");
                e.appendChild(a, n);
                var n = e.createElement("td"),
                r = e.createTextNode("\n");
                e.appendChild(n, r);
                var r = e.createComment("");
                e.appendChild(n, r);
                var r = e.createTextNode("  ");
                e.appendChild(n, r),
                e.appendChild(a, n);
                var n = e.createTextNode("\n  ");
                e.appendChild(a, n);
                var n = e.createElement("td"),
                r = e.createComment("");
                e.appendChild(n, r),
                e.appendChild(a, n);
                var n = e.createTextNode("\n  ");
                e.appendChild(a, n);
                var n = e.createElement("td"),
                r = e.createTextNode("\n");
                e.appendChild(n, r);
                var r = e.createComment("");
                e.appendChild(n, r);
                var r = e.createTextNode("  ");
                e.appendChild(n, r),
                e.appendChild(a, n);
                var n = e.createTextNode("\n  ");
                e.appendChild(a, n);
                var n = e.createElement("td"),
                r = e.createTextNode("\n");
                e.appendChild(n, r);
                var r = e.createComment("");
                e.appendChild(n, r);
                var r = e.createTextNode("  ");
                e.appendChild(n, r),
                e.appendChild(a, n);
                var n = e.createTextNode("\n");
                e.appendChild(a, n),
                e.appendChild(t, a);
                var a = e.createTextNode("\n");
                return e.appendChild(t, a),
                t
            },
            buildRenderNodes: function(e, t, a) {
                var n = e.childAt(t, [0]),
                r = new Array(5);
                return r[0] = e.createMorphAt(e.childAt(n, [1]), 1, 1),
                r[1] = e.createMorphAt(e.childAt(n, [3]), 1, 1),
                r[2] = e.createMorphAt(e.childAt(n, [5]), 0, 0),
                r[3] = e.createMorphAt(e.childAt(n, [7]), 1, 1),
                r[4] = e.createMorphAt(e.childAt(n, [9]), 1, 1),
                r
            },
            statements: [["block", "if", [["get", "block.uncle", ["loc", [null, [3, 10], [3, 21]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [3, 4], [7, 11]]]], ["block", "if", [["get", "block.uncle", ["loc", [null, [10, 10], [10, 21]]], 0, 0, 0, 0]], [], 2, 3, ["loc", [null, [10, 4], [16, 11]]]], ["inline", "format-date-locale", [["get", "block.timestamp", ["loc", [null, [18, 27], [18, 42]]], 0, 0, 0, 0]], [], ["loc", [null, [18, 6], [18, 44]]], 0, 0], ["block", "if", [["get", "block.isLucky", ["loc", [null, [20, 10], [20, 23]]], 0, 0, 0, 0]], [], 4, 5, ["loc", [null, [20, 4], [24, 11]]]], ["block", "if", [["get", "block.uncle", ["loc", [null, [27, 10], [27, 21]]], 0, 0, 0, 0]], [], 6, 7, ["loc", [null, [27, 4], [31, 11]]]]],
            locals: [],
            templates: [e, t, a, n, r, l, d, o]
        }
    } ())
}),
define("open-ethereum-pool/templates/blocks/immature", ["exports"],
function(e) {
    e.
default = Ember.HTMLBars.template(function() {
        var e = function() {
            var e = function() {
                return {
                    meta: {
                        revision: "Ember@2.8.3+c4330341",
                        loc: {
                            source: null,
                            start: {
                                line: 16,
                                column: 6
                            },
                            end: {
                                line: 18,
                                column: 6
                            }
                        },
                        moduleName: "open-ethereum-pool/templates/blocks/immature.hbs"
                    },
                    isEmpty: !1,
                    arity: 1,
                    cachedFragment: null,
                    hasRendered: !1,
                    buildFragment: function(e) {
                        var t = e.createDocumentFragment(),
                        a = e.createTextNode("        ");
                        e.appendChild(t, a);
                        var a = e.createComment("");
                        e.appendChild(t, a);
                        var a = e.createTextNode("\n");
                        return e.appendChild(t, a),
                        t
                    },
                    buildRenderNodes: function(e, t, a) {
                        var n = new Array(1);
                        return n[0] = e.createMorphAt(t, 1, 1, a),
                        n
                    },
                    statements: [["inline", "partial", ["blocks/block"], [], ["loc", [null, [17, 8], [17, 34]]], 0, 0]],
                    locals: ["block"],
                    templates: []
                }
            } ();
            return {
                meta: {
                    revision: "Ember@2.8.3+c4330341",
                    loc: {
                        source: null,
                        start: {
                            line: 1,
                            column: 0
                        },
                        end: {
                            line: 22,
                            column: 0
                        }
                    },
                    moduleName: "open-ethereum-pool/templates/blocks/immature.hbs"
                },
                isEmpty: !1,
                arity: 0,
                cachedFragment: null,
                hasRendered: !1,
                buildFragment: function(e) {
                    var t = e.createDocumentFragment(),
                    a = e.createElement("h4"),
                    n = e.createTextNode("Immature Blocks");
                    e.appendChild(a, n),
                    e.appendChild(t, a);
                    var a = e.createTextNode("\n\n");
                    e.appendChild(t, a);
                    var a = e.createElement("div");
                    e.setAttribute(a, "class", "table-responsive");
                    var n = e.createTextNode("\n  ");
                    e.appendChild(a, n);
                    var n = e.createElement("table");
                    e.setAttribute(n, "class", "table table-condensed table-striped");
                    var r = e.createTextNode("\n    ");
                    e.appendChild(n, r);
                    var r = e.createElement("thead"),
                    l = e.createTextNode("\n      ");
                    e.appendChild(r, l);
                    var l = e.createElement("tr"),
                    d = e.createTextNode("\n        ");
                    e.appendChild(l, d);
                    var d = e.createElement("th"),
                    o = e.createTextNode("区块高度");
                    e.appendChild(d, o),
                    e.appendChild(l, d);
                    var d = e.createTextNode("\n        ");
                    e.appendChild(l, d);
                    var d = e.createElement("th"),
                    o = e.createTextNode("区块哈希");
                    e.appendChild(d, o),
                    e.appendChild(l, d);
                    var d = e.createTextNode("\n        ");
                    e.appendChild(l, d);
                    var d = e.createElement("th"),
                    o = e.createTextNode("发现时间");
                    e.appendChild(d, o),
                    e.appendChild(l, d);
                    var d = e.createTextNode("\n        ");
                    e.appendChild(l, d);
                    var d = e.createElement("th"),
                    o = e.createTextNode("幸运值");
                    e.appendChild(d, o),
                    e.appendChild(l, d);
                    var d = e.createTextNode("\n        ");
                    e.appendChild(l, d);
                    var d = e.createElement("th"),
                    o = e.createTextNode("区块奖励");
                    e.appendChild(d, o),
                    e.appendChild(l, d);
                    var d = e.createTextNode("\n      ");
                    e.appendChild(l, d),
                    e.appendChild(r, l);
                    var l = e.createTextNode("\n    ");
                    e.appendChild(r, l),
                    e.appendChild(n, r);
                    var r = e.createTextNode("\n    ");
                    e.appendChild(n, r);
                    var r = e.createElement("tbody"),
                    l = e.createTextNode("\n");
                    e.appendChild(r, l);
                    var l = e.createComment("");
                    e.appendChild(r, l);
                    var l = e.createTextNode("    ");
                    e.appendChild(r, l),
                    e.appendChild(n, r);
                    var r = e.createTextNode("\n  ");
                    e.appendChild(n, r),
                    e.appendChild(a, n);
                    var n = e.createTextNode("\n");
                    e.appendChild(a, n),
                    e.appendChild(t, a);
                    var a = e.createTextNode("\n");
                    return e.appendChild(t, a),
                    t
                },
                buildRenderNodes: function(e, t, a) {
                    var n = new Array(1);
                    return n[0] = e.createMorphAt(e.childAt(t, [2, 1, 3]), 1, 1),
                    n
                },
                statements: [["block", "each", [["get", "model.immature", ["loc", [null, [16, 14], [16, 28]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [16, 6], [18, 15]]]]],
                locals: [],
                templates: [e]
            }
        } (),
        t = function() {
            return {
                meta: {
                    revision: "Ember@2.8.3+c4330341",
                    loc: {
                        source: null,
                        start: {
                            line: 22,
                            column: 0
                        },
                        end: {
                            line: 24,
                            column: 0
                        }
                    },
                    moduleName: "open-ethereum-pool/templates/blocks/immature.hbs"
                },
                isEmpty: !1,
                arity: 0,
                cachedFragment: null,
                hasRendered: !1,
                buildFragment: function(e) {
                    var t = e.createDocumentFragment(),
                    a = e.createElement("h3"),
                    n = e.createTextNode("当前没有待成熟区块");
                    e.appendChild(a, n),
                    e.appendChild(t, a);
                    var a = e.createTextNode("\n");
                    return e.appendChild(t, a),
                    t
                },
                buildRenderNodes: function() {
                    return []
                },
                statements: [],
                locals: [],
                templates: []
            }
        } ();
        return {
            meta: {
                revision: "Ember@2.8.3+c4330341",
                loc: {
                    source: null,
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 25,
                        column: 0
                    }
                },
                moduleName: "open-ethereum-pool/templates/blocks/immature.hbs"
            },
            isEmpty: !1,
            arity: 0,
            cachedFragment: null,
            hasRendered: !1,
            buildFragment: function(e) {
                var t = e.createDocumentFragment(),
                a = e.createComment("");
                return e.appendChild(t, a),
                t
            },
            buildRenderNodes: function(e, t, a) {
                var n = new Array(1);
                return n[0] = e.createMorphAt(t, 0, 0, a),
                e.insertBoundary(t, 0),
                e.insertBoundary(t, null),
                n
            },
            statements: [["block", "if", [["get", "model.immature", ["loc", [null, [1, 6], [1, 20]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [1, 0], [24, 7]]]]],
            locals: [],
            templates: [e, t]
        }
    } ())
}),
define("open-ethereum-pool/templates/blocks/index", ["exports"],
function(e) {
    e.
default = Ember.HTMLBars.template(function() {
        var e = function() {
            var e = function() {
                return {
                    meta: {
                        revision: "Ember@2.8.3+c4330341",
                        loc: {
                            source: null,
                            start: {
                                line: 15,
                                column: 6
                            },
                            end: {
                                line: 17,
                                column: 6
                            }
                        },
                        moduleName: "open-ethereum-pool/templates/blocks/index.hbs"
                    },
                    isEmpty: !1,
                    arity: 1,
                    cachedFragment: null,
                    hasRendered: !1,
                    buildFragment: function(e) {
                        var t = e.createDocumentFragment(),
                        a = e.createTextNode("        ");
                        e.appendChild(t, a);
                        var a = e.createComment("");
                        e.appendChild(t, a);
                        var a = e.createTextNode("\n");
                        return e.appendChild(t, a),
                        t
                    },
                    buildRenderNodes: function(e, t, a) {
                        var n = new Array(1);
                        return n[0] = e.createMorphAt(t, 1, 1, a),
                        n
                    },
                    statements: [["inline", "partial", ["blocks/block"], [], ["loc", [null, [16, 8], [16, 34]]], 0, 0]],
                    locals: ["block"],
                    templates: []
                }
            } ();
            return {
                meta: {
                    revision: "Ember@2.8.3+c4330341",
                    loc: {
                        source: null,
                        start: {
                            line: 1,
                            column: 0
                        },
                        end: {
                            line: 21,
                            column: 0
                        }
                    },
                    moduleName: "open-ethereum-pool/templates/blocks/index.hbs"
                },
                isEmpty: !1,
                arity: 0,
                cachedFragment: null,
                hasRendered: !1,
                buildFragment: function(e) {
                    var t = e.createDocumentFragment(),
                    a = e.createElement("h4"),
                    n = e.createTextNode("已成熟区块");
                    e.appendChild(a, n),
                    e.appendChild(t, a);
                    var a = e.createTextNode("\n");
                    e.appendChild(t, a);
                    var a = e.createElement("div");
                    e.setAttribute(a, "class", "table-responsive");
                    var n = e.createTextNode("\n  ");
                    e.appendChild(a, n);
                    var n = e.createElement("table");
                    e.setAttribute(n, "class", "table table-condensed table-striped");
                    var r = e.createTextNode("\n    ");
                    e.appendChild(n, r);
                    var r = e.createElement("thead"),
                    l = e.createTextNode("\n      ");
                    e.appendChild(r, l);
                    var l = e.createElement("tr"),
                    d = e.createTextNode("\n        ");
                    e.appendChild(l, d);
                    var d = e.createElement("th"),
                    o = e.createTextNode("区块高度");
                    e.appendChild(d, o),
                    e.appendChild(l, d);
                    var d = e.createTextNode("\n        ");
                    e.appendChild(l, d);
                    var d = e.createElement("th"),
                    o = e.createTextNode("区块哈希值");
                    e.appendChild(d, o),
                    e.appendChild(l, d);
                    var d = e.createTextNode("\n        ");
                    e.appendChild(l, d);
                    var d = e.createElement("th"),
                    o = e.createTextNode("爆块时间");
                    e.appendChild(d, o),
                    e.appendChild(l, d);
                    var d = e.createTextNode("\n        ");
                    e.appendChild(l, d);
                    var d = e.createElement("th"),
                    o = e.createTextNode("幸运值");
                    e.appendChild(d, o),
                    e.appendChild(l, d);
                    var d = e.createTextNode("\n        ");
                    e.appendChild(l, d);
                    var d = e.createElement("th"),
                    o = e.createTextNode("区块奖励");
                    e.appendChild(d, o),
                    e.appendChild(l, d);
                    var d = e.createTextNode("\n      ");
                    e.appendChild(l, d),
                    e.appendChild(r, l);
                    var l = e.createTextNode("\n    ");
                    e.appendChild(r, l),
                    e.appendChild(n, r);
                    var r = e.createTextNode("\n    ");
                    e.appendChild(n, r);
                    var r = e.createElement("tbody"),
                    l = e.createTextNode("\n");
                    e.appendChild(r, l);
                    var l = e.createComment("");
                    e.appendChild(r, l);
                    var l = e.createTextNode("    ");
                    e.appendChild(r, l),
                    e.appendChild(n, r);
                    var r = e.createTextNode("\n  ");
                    e.appendChild(n, r),
                    e.appendChild(a, n);
                    var n = e.createTextNode("\n");
                    e.appendChild(a, n),
                    e.appendChild(t, a);
                    var a = e.createTextNode("\n");
                    return e.appendChild(t, a),
                    t
                },
                buildRenderNodes: function(e, t, a) {
                    var n = new Array(1);
                    return n[0] = e.createMorphAt(e.childAt(t, [2, 1, 3]), 1, 1),
                    n
                },
                statements: [["block", "each", [["get", "model.matured", ["loc", [null, [15, 14], [15, 27]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [15, 6], [17, 15]]]]],
                locals: [],
                templates: [e]
            }
        } (),
        t = function() {
            return {
                meta: {
                    revision: "Ember@2.8.3+c4330341",
                    loc: {
                        source: null,
                        start: {
                            line: 21,
                            column: 0
                        },
                        end: {
                            line: 23,
                            column: 0
                        }
                    },
                    moduleName: "open-ethereum-pool/templates/blocks/index.hbs"
                },
                isEmpty: !1,
                arity: 0,
                cachedFragment: null,
                hasRendered: !1,
                buildFragment: function(e) {
                    var t = e.createDocumentFragment(),
                    a = e.createElement("h3"),
                    n = e.createTextNode("当前没有成熟区块");
                    e.appendChild(a, n),
                    e.appendChild(t, a);
                    var a = e.createTextNode("\n");
                    return e.appendChild(t, a),
                    t
                },
                buildRenderNodes: function() {
                    return []
                },
                statements: [],
                locals: [],
                templates: []
            }
        } ();
        return {
            meta: {
                revision: "Ember@2.8.3+c4330341",
                loc: {
                    source: null,
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 24,
                        column: 0
                    }
                },
                moduleName: "open-ethereum-pool/templates/blocks/index.hbs"
            },
            isEmpty: !1,
            arity: 0,
            cachedFragment: null,
            hasRendered: !1,
            buildFragment: function(e) {
                var t = e.createDocumentFragment(),
                a = e.createComment("");
                return e.appendChild(t, a),
                t
            },
            buildRenderNodes: function(e, t, a) {
                var n = new Array(1);
                return n[0] = e.createMorphAt(t, 0, 0, a),
                e.insertBoundary(t, 0),
                e.insertBoundary(t, null),
                n
            },
            statements: [["block", "if", [["get", "model.matured", ["loc", [null, [1, 6], [1, 19]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [1, 0], [23, 7]]]]],
            locals: [],
            templates: [e, t]
        }
    } ())
}),
define("open-ethereum-pool/templates/blocks/pending", ["exports"],
function(e) {
    e.
default = Ember.HTMLBars.template(function() {
        var e = function() {
            var e = function() {
                var e = function() {
                    return {
                        meta: {
                            revision: "Ember@2.8.3+c4330341",
                            loc: {
                                source: null,
                                start: {
                                    line: 18,
                                    column: 10
                                },
                                end: {
                                    line: 20,
                                    column: 10
                                }
                            },
                            moduleName: "open-ethereum-pool/templates/blocks/pending.hbs"
                        },
                        isEmpty: !1,
                        arity: 0,
                        cachedFragment: null,
                        hasRendered: !1,
                        buildFragment: function(e) {
                            var t = e.createDocumentFragment(),
                            a = e.createTextNode("          ");
                            e.appendChild(t, a);
                            var a = e.createElement("span");
                            e.setAttribute(a, "class", "label label-success");
                            var n = e.createComment("");
                            e.appendChild(a, n),
                            e.appendChild(t, a);
                            var a = e.createTextNode("\n");
                            return e.appendChild(t, a),
                            t
                        },
                        buildRenderNodes: function(e, t, a) {
                            var n = new Array(1);
                            return n[0] = e.createMorphAt(e.childAt(t, [1]), 0, 0),
                            n
                        },
                        statements: [["inline", "format-number", [["get", "block.variance", ["loc", [null, [19, 60], [19, 74]]], 0, 0, 0, 0]], ["style", "percent"], ["loc", [null, [19, 44], [19, 92]]], 0, 0]],
                        locals: [],
                        templates: []
                    }
                } (),
                t = function() {
                    return {
                        meta: {
                            revision: "Ember@2.8.3+c4330341",
                            loc: {
                                source: null,
                                start: {
                                    line: 20,
                                    column: 10
                                },
                                end: {
                                    line: 22,
                                    column: 10
                                }
                            },
                            moduleName: "open-ethereum-pool/templates/blocks/pending.hbs"
                        },
                        isEmpty: !1,
                        arity: 0,
                        cachedFragment: null,
                        hasRendered: !1,
                        buildFragment: function(e) {
                            var t = e.createDocumentFragment(),
                            a = e.createTextNode("          ");
                            e.appendChild(t, a);
                            var a = e.createElement("span");
                            e.setAttribute(a, "class", "label label-info");
                            var n = e.createComment("");
                            e.appendChild(a, n),
                            e.appendChild(t, a);
                            var a = e.createTextNode("\n");
                            return e.appendChild(t, a),
                            t
                        },
                        buildRenderNodes: function(e, t, a) {
                            var n = new Array(1);
                            return n[0] = e.createMorphAt(e.childAt(t, [1]), 0, 0),
                            n
                        },
                        statements: [["inline", "format-number", [["get", "block.variance", ["loc", [null, [21, 57], [21, 71]]], 0, 0, 0, 0]], ["style", "percent"], ["loc", [null, [21, 41], [21, 89]]], 0, 0]],
                        locals: [],
                        templates: []
                    }
                } ();
                return {
                    meta: {
                        revision: "Ember@2.8.3+c4330341",
                        loc: {
                            source: null,
                            start: {
                                line: 13,
                                column: 6
                            },
                            end: {
                                line: 25,
                                column: 6
                            }
                        },
                        moduleName: "open-ethereum-pool/templates/blocks/pending.hbs"
                    },
                    isEmpty: !1,
                    arity: 1,
                    cachedFragment: null,
                    hasRendered: !1,
                    buildFragment: function(e) {
                        var t = e.createDocumentFragment(),
                        a = e.createTextNode("      ");
                        e.appendChild(t, a);
                        var a = e.createElement("tr"),
                        n = e.createTextNode("\n        ");
                        e.appendChild(a, n);
                        var n = e.createElement("td"),
                        r = e.createElement("a");
                        e.setAttribute(r, "rel", "nofollow"),
                        e.setAttribute(r, "target", "_blank");
                        var l = e.createComment("");
                        e.appendChild(r, l),
                        e.appendChild(n, r),
                        e.appendChild(a, n);
                        var n = e.createTextNode("\n        ");
                        e.appendChild(a, n);
                        var n = e.createElement("td"),
                        r = e.createComment("");
                        e.appendChild(n, r),
                        e.appendChild(a, n);
                        var n = e.createTextNode("\n        ");
                        e.appendChild(a, n);
                        var n = e.createElement("td"),
                        r = e.createTextNode("\n");
                        e.appendChild(n, r);
                        var r = e.createComment("");
                        e.appendChild(n, r);
                        var r = e.createTextNode("        ");
                        e.appendChild(n, r),
                        e.appendChild(a, n);
                        var n = e.createTextNode("\n      ");
                        e.appendChild(a, n),
                        e.appendChild(t, a);
                        var a = e.createTextNode("\n");
                        return e.appendChild(t, a),
                        t
                    },
                    buildRenderNodes: function(e, t, a) {
                        var n = e.childAt(t, [1]),
                        r = e.childAt(n, [1, 0]),
                        l = new Array(4);
                        return l[0] = e.createAttrMorph(r, "href"),
                        l[1] = e.createMorphAt(r, 0, 0),
                        l[2] = e.createMorphAt(e.childAt(n, [3]), 0, 0),
                        l[3] = e.createMorphAt(e.childAt(n, [5]), 1, 1),
                        l
                    },
                    statements: [["attribute", "href", ["concat", ["http://www.ofcoin.com/block.html?block_height=", ["get", "block.height", ["loc", [null, [15, 73], [15, 85]]], 0, 0, 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["inline", "format-number", [["get", "block.height", ["loc", [null, [15, 136], [15, 148]]], 0, 0, 0, 0]], [], ["loc", [null, [15, 120], [15, 150]]], 0, 0], ["inline", "format-date-locale", [["get", "block.timestamp", ["loc", [null, [16, 33], [16, 48]]], 0, 0, 0, 0]], [], ["loc", [null, [16, 12], [16, 50]]], 0, 0], ["block", "if", [["get", "block.isLucky", ["loc", [null, [18, 16], [18, 29]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [18, 10], [22, 17]]]]],
                    locals: ["block"],
                    templates: [e, t]
                }
            } ();
            return {
                meta: {
                    revision: "Ember@2.8.3+c4330341",
                    loc: {
                        source: null,
                        start: {
                            line: 1,
                            column: 0
                        },
                        end: {
                            line: 29,
                            column: 0
                        }
                    },
                    moduleName: "open-ethereum-pool/templates/blocks/pending.hbs"
                },
                isEmpty: !1,
                arity: 0,
                cachedFragment: null,
                hasRendered: !1,
                buildFragment: function(e) {
                    var t = e.createDocumentFragment(),
                    a = e.createElement("h4"),
                    n = e.createTextNode("Recently Found Blocks");
                    e.appendChild(a, n),
                    e.appendChild(t, a);
                    var a = e.createTextNode("\n");
                    e.appendChild(t, a);
                    var a = e.createElement("div");
                    e.setAttribute(a, "class", "table-responsive");
                    var n = e.createTextNode("\n  ");
                    e.appendChild(a, n);
                    var n = e.createElement("table");
                    e.setAttribute(n, "class", "table table-condensed table-striped");
                    var r = e.createTextNode("\n    ");
                    e.appendChild(n, r);
                    var r = e.createElement("thead"),
                    l = e.createTextNode("\n      ");
                    e.appendChild(r, l);
                    var l = e.createElement("tr"),
                    d = e.createTextNode("\n        ");
                    e.appendChild(l, d);
                    var d = e.createElement("th"),
                    o = e.createTextNode("区块高度");
                    e.appendChild(d, o),
                    e.appendChild(l, d);
                    var d = e.createTextNode("\n        ");
                    e.appendChild(l, d);
                    var d = e.createElement("th"),
                    o = e.createTextNode("爆块时间");
                    e.appendChild(d, o),
                    e.appendChild(l, d);
                    var d = e.createTextNode("\n        ");
                    e.appendChild(l, d);
                    var d = e.createElement("th"),
                    o = e.createTextNode("幸运值");
                    e.appendChild(d, o),
                    e.appendChild(l, d);
                    var d = e.createTextNode("\n      ");
                    e.appendChild(l, d),
                    e.appendChild(r, l);
                    var l = e.createTextNode("\n    ");
                    e.appendChild(r, l),
                    e.appendChild(n, r);
                    var r = e.createTextNode("\n    ");
                    e.appendChild(n, r);
                    var r = e.createElement("tbody"),
                    l = e.createTextNode("\n");
                    e.appendChild(r, l);
                    var l = e.createComment("");
                    e.appendChild(r, l);
                    var l = e.createTextNode("    ");
                    e.appendChild(r, l),
                    e.appendChild(n, r);
                    var r = e.createTextNode("\n  ");
                    e.appendChild(n, r),
                    e.appendChild(a, n);
                    var n = e.createTextNode("\n");
                    e.appendChild(a, n),
                    e.appendChild(t, a);
                    var a = e.createTextNode("\n");
                    return e.appendChild(t, a),
                    t
                },
                buildRenderNodes: function(e, t, a) {
                    var n = new Array(1);
                    return n[0] = e.createMorphAt(e.childAt(t, [2, 1, 3]), 1, 1),
                    n
                },
                statements: [["block", "each", [["get", "model.candidates", ["loc", [null, [13, 14], [13, 30]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [13, 6], [25, 15]]]]],
                locals: [],
                templates: [e]
            }
        } (),
        t = function() {
            return {
                meta: {
                    revision: "Ember@2.8.3+c4330341",
                    loc: {
                        source: null,
                        start: {
                            line: 29,
                            column: 0
                        },
                        end: {
                            line: 31,
                            column: 0
                        }
                    },
                    moduleName: "open-ethereum-pool/templates/blocks/pending.hbs"
                },
                isEmpty: !1,
                arity: 0,
                cachedFragment: null,
                hasRendered: !1,
                buildFragment: function(e) {
                    var t = e.createDocumentFragment(),
                    a = e.createElement("h3"),
                    n = e.createTextNode("当前暂无区块");
                    e.appendChild(a, n),
                    e.appendChild(t, a);
                    var a = e.createTextNode("\n");
                    return e.appendChild(t, a),
                    t
                },
                buildRenderNodes: function() {
                    return []
                },
                statements: [],
                locals: [],
                templates: []
            }
        } ();
        return {
            meta: {
                revision: "Ember@2.8.3+c4330341",
                loc: {
                    source: null,
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 32,
                        column: 0
                    }
                },
                moduleName: "open-ethereum-pool/templates/blocks/pending.hbs"
            },
            isEmpty: !1,
            arity: 0,
            cachedFragment: null,
            hasRendered: !1,
            buildFragment: function(e) {
                var t = e.createDocumentFragment(),
                a = e.createComment("");
                return e.appendChild(t, a),
                t
            },
            buildRenderNodes: function(e, t, a) {
                var n = new Array(1);
                return n[0] = e.createMorphAt(t, 0, 0, a),
                e.insertBoundary(t, 0),
                e.insertBoundary(t, null),
                n
            },
            statements: [["block", "if", [["get", "model.candidates", ["loc", [null, [1, 6], [1, 22]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [1, 0], [31, 7]]]]],
            locals: [],
            templates: [e, t]
        }
    } ())
}),
define("open-ethereum-pool/templates/components/active-li", ["exports"],
function(e) {
    e.
default = Ember.HTMLBars.template(function() {
        return {
            meta: {
                revision: "Ember@2.8.3+c4330341",
                loc: {
                    source: null,
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 2,
                        column: 0
                    }
                },
                moduleName: "open-ethereum-pool/templates/components/active-li.hbs"
            },
            isEmpty: !1,
            arity: 0,
            cachedFragment: null,
            hasRendered: !1,
            buildFragment: function(e) {
                var t = e.createDocumentFragment(),
                a = e.createComment("");
                e.appendChild(t, a);
                var a = e.createTextNode("\n");
                return e.appendChild(t, a),
                t
            },
            buildRenderNodes: function(e, t, a) {
                var n = new Array(1);
                return n[0] = e.createMorphAt(t, 0, 0, a),
                e.insertBoundary(t, 0),
                n
            },
            statements: [["content", "yield", ["loc", [null, [1, 0], [1, 9]]], 0, 0, 0, 0]],
            locals: [],
            templates: []
        }
    } ())
}),
define("open-ethereum-pool/templates/help", ["exports"],
function(e) {
    e.
default = Ember.HTMLBars.template(function() {
        return {
            meta: {
                revision: "Ember@2.8.3+c4330341",
                loc: {
                    source: null,
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 18,
                        column: 0
                    }
                },
                moduleName: "open-ethereum-pool/templates/help.hbs"
            },
            isEmpty: !1,
            arity: 0,
            cachedFragment: null,
            hasRendered: !1,
            buildFragment: function(e) {
                var t = e.createDocumentFragment(),
                a = e.createElement("div");
                e.setAttribute(a, "class", "container");
                var n = e.createTextNode("\n  ");
                e.appendChild(a, n);
                var n = e.createElement("div");
                e.setAttribute(n, "class", "page-header");
                var r = e.createTextNode("\n    ");
                e.appendChild(n, r);
                var r = e.createElement("h1"),
                l = e.createTextNode("使用教程");
                e.appendChild(r, l),
                e.appendChild(n, r);
                var r = e.createTextNode("\n  ");
                e.appendChild(n, r),
                e.appendChild(a, n);
                var n = e.createTextNode("\n  ");
                e.appendChild(a, n);
                var n = e.createElement("p");
                e.setAttribute(n, "class", "lead");
                var r = e.createTextNode("矿池地址");
                e.appendChild(n, r);
                var r = e.createElement("br");
                e.appendChild(n, r);
                var r = e.createElement("code"),
                l = e.createTextNode("stratum+tcp://www.ofpool.vip:8008");
                e.appendChild(r, l),
                e.appendChild(n, r);
                var r = e.createTextNode("\n  ");
                e.appendChild(n, r),
                e.appendChild(a, n);
                var n = e.createTextNode("\n  ");
                e.appendChild(a, n);
                var n = e.createElement("p");
                e.setAttribute(n, "class", "lead");
                var r = e.createTextNode("Claymore启动参数");
                e.appendChild(n, r);
                var r = e.createElement("br");
                e.appendChild(n, r);
                var r = e.createElement("code"),
                l = e.createTextNode("EthDcrMiner64 -epool stratum+tcp://www.ofpool.vip:8008 -ewal 你的OF地址 -eworker 矿机编号 -epsw x -allcoins 1");
                e.appendChild(r, l),
                e.appendChild(n, r);
                var r = e.createTextNode("\n  ");
                e.appendChild(n, r),
                e.appendChild(a, n);
                var n = e.createTextNode("\n  ");
                e.appendChild(a, n);
                var n = e.createElement("p"),
                r = e.createTextNode("\n    ");
                e.appendChild(n, r);
                var r = e.createElement("strong"),
                l = e.createTextNode("例如:");
                e.appendChild(r, l),
                e.appendChild(n, r);
                var r = e.createTextNode("\n    ");
                e.appendChild(n, r);
                var r = e.createElement("code"),
                l = e.createTextNode("EthDcrMiner64 -epool stratum+tcp://www.ofpool.vip:8008 -ewal 0x00007b007bf8b1e9c578286d93db66a2dda64ceb08a90404cd -eworker n1 -epsw x -allcoins 1");
                e.appendChild(r, l),
                e.appendChild(n, r);
                var r = e.createTextNode(".");
                e.appendChild(n, r);
                var r = e.createElement("br");
                e.appendChild(n, r);
                var r = e.createTextNode("\n  ");
                e.appendChild(n, r),
                e.appendChild(a, n);
                var n = e.createTextNode("\n  ");
                e.appendChild(a, n);
                var n = e.createElement("p"),
                r = e.createTextNode("\n\t");
                e.appendChild(n, r);
                var r = e.createElement("strong"),
                l = e.createTextNode("下载地址");
                e.appendChild(r, l),
                e.appendChild(n, r);
                var r = e.createTextNode("\n\t");
                e.appendChild(n, r);
                var r = e.createElement("a");
                e.setAttribute(r, "target", "_blank"),
                e.setAttribute(r, "href", "");
                var l = e.createTextNode("原版Claymore");
                e.appendChild(r, l),
                e.appendChild(n, r);
                var r = e.createTextNode("  |  ");
                e.appendChild(n, r);
                var r = e.createElement("a");
                e.setAttribute(r, "target", "_blank"),
                e.setAttribute(r, "href", "");
                var l = e.createTextNode("圣骑士2.86");
                e.appendChild(r, l),
                e.appendChild(n, r);
                var r = e.createTextNode("(已配置好挖of，需更换钱包地址、矿工名)\n  ");
                e.appendChild(n, r),
                e.appendChild(a, n);
                var n = e.createTextNode("\n");
                e.appendChild(a, n),
                e.appendChild(t, a);
                var a = e.createTextNode("\n");
                return e.appendChild(t, a),
                t
            },
            buildRenderNodes: function() {
                return []
            },
            statements: [],
            locals: [],
            templates: []
        }
    } ())
}),
define("open-ethereum-pool/templates/index", ["exports"],
function(e) {
    e.
default = Ember.HTMLBars.template(function() {
        var e = function() {
            return {
                meta: {
                    revision: "Ember@2.8.3+c4330341",
                    loc: {
                        source: null,
                        start: {
                            line: 22,
                            column: 8
                        },
                        end: {
                            line: 24,
                            column: 8
                        }
                    },
                    moduleName: "open-ethereum-pool/templates/index.hbs"
                },
                isEmpty: !1,
                arity: 0,
                cachedFragment: null,
                hasRendered: !1,
                buildFragment: function(e) {
                    var t = e.createDocumentFragment(),
                    a = e.createTextNode("        ");
                    e.appendChild(t, a);
                    var a = e.createElement("div"),
                    n = e.createElement("i");
                    e.setAttribute(n, "class", "fa fa-clock-o"),
                    e.appendChild(a, n);
                    var n = e.createTextNode(" 最后爆块: ");
                    e.appendChild(a, n);
                    var n = e.createElement("span"),
                    r = e.createComment("");
                    e.appendChild(n, r),
                    e.appendChild(a, n),
                    e.appendChild(t, a);
                    var a = e.createTextNode("\n");
                    return e.appendChild(t, a),
                    t
                },
                buildRenderNodes: function(e, t, a) {
                    var n = new Array(1);
                    return n[0] = e.createMorphAt(e.childAt(t, [1, 2]), 0, 0),
                    n
                },
                statements: [["inline", "format-relative", [["subexpr", "seconds-to-ms", [["get", "stats.model.stats.lastBlockFound", ["loc", [null, [23, 88], [23, 120]]], 0, 0, 0, 0]], [], ["loc", [null, [23, 73], [23, 121]]], 0, 0]], [], ["loc", [null, [23, 55], [23, 123]]], 0, 0]],
                locals: [],
                templates: []
            }
        } ();
        return {
            meta: {
                revision: "Ember@2.8.3+c4330341",
                loc: {
                    source: null,
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 64,
                        column: 0
                    }
                },
                moduleName: "open-ethereum-pool/templates/index.hbs"
            },
            isEmpty: !1,
            arity: 0,
            cachedFragment: null,
            hasRendered: !1,
            buildFragment: function(e) {
                var t = e.createDocumentFragment(),
                a = e.createElement("div");
                e.setAttribute(a, "class", "jumbotron");
                var n = e.createTextNode("\n  ");
                e.appendChild(a, n);
                var n = e.createElement("div");
                e.setAttribute(n, "class", "container");
                var r = e.createTextNode("\n    ");
                e.appendChild(n, r);
                var r = e.createElement("div");
                e.setAttribute(r, "class", "row");
                var l = e.createTextNode("\n      ");
                e.appendChild(r, l);
                var l = e.createElement("div");
                e.setAttribute(l, "class", "col-md-5");
                var d = e.createTextNode("\n        ");
                e.appendChild(l, d);
                var d = e.createElement("table");
                e.setAttribute(d, "border", "0");
                var o = e.createTextNode("\n\t\t\t");
                e.appendChild(d, o);
                var o = e.createElement("tr"),
                i = e.createTextNode("\n\t\t\t\t");
                e.appendChild(o, i);
                var i = e.createElement("td");
                e.setAttribute(i, "valign", "top");
                var c = e.createTextNode("\n\t\t\t\t\t");
                e.appendChild(i, c);
                var c = e.createTextNode("\n\t\t\t\t");
                e.appendChild(i, c),
                e.appendChild(o, i);
                var i = e.createTextNode("\n\t\t\t\t");
                e.appendChild(o, i);
                var i = e.createElement("td");
                e.setAttribute(i, "valign", "top");
                var c = e.createTextNode("\n\t\t\t\t\t");
                e.appendChild(i, c);
                var c = e.createElement("h3"),
                p = e.createTextNode("  ");
                e.appendChild(c, p);
                var p = e.createElement("b"),
                u = e.createTextNode("OFcoin矿池");
                e.appendChild(p, u),
                e.appendChild(c, p),
                e.appendChild(i, c);
                var c = e.createTextNode("\n\t\t\t\t");
                e.appendChild(i, c),
                e.appendChild(o, i);
                var i = e.createTextNode("\n\t\t\t");
                e.appendChild(o, i),
                e.appendChild(d, o);
                var o = e.createTextNode("\n\t\t");
                e.appendChild(d, o),
                e.appendChild(l, d);
                var d = e.createTextNode("\n        每180分钟自动支付,");
                e.appendChild(l, d);
                var d = e.createElement("strong"),
                o = e.createTextNode("账户余额满: ");
                e.appendChild(d, o);
                var o = e.createComment("");
                e.appendChild(d, o);
                var o = e.createTextNode("起付");
                e.appendChild(d, o),
                e.appendChild(l, d);
                var d = e.createElement("br");
                e.appendChild(l, d);
                var d = e.createTextNode("\n        矿池分成模式：");
                e.appendChild(l, d);
                var d = e.createElement("span");
                e.setAttribute(d, "class", "label label-success");
                var o = e.createTextNode("PROP");
                e.appendChild(d, o),
                e.appendChild(l, d);
                var d = e.createTextNode("\n      ");
                e.appendChild(l, d),
                e.appendChild(r, l);
                var l = e.createTextNode("\n      ");
                e.appendChild(r, l);
                var l = e.createElement("div");
                e.setAttribute(l, "class", "col-md-3 stats");
                var d = e.createTextNode("\n        ");
                e.appendChild(l, d);
                var d = e.createElement("div"),
                o = e.createElement("i");
                e.setAttribute(o, "class", "fa fa-users"),
                e.appendChild(d, o);
                var o = e.createTextNode(" 在线矿工: ");
                e.appendChild(d, o);
                var o = e.createElement("span");
                e.setAttribute(o, "id", "poolHashrate");
                var i = e.createComment("");
                e.appendChild(o, i),
                e.appendChild(d, o),
                e.appendChild(l, d);
                var d = e.createTextNode("\n        ");
                e.appendChild(l, d);
                var d = e.createElement("div"),
                o = e.createElement("i");
                e.setAttribute(o, "class", "fa fa-tachometer"),
                e.appendChild(d, o);
                var o = e.createTextNode(" 矿池总算力: ");
                e.appendChild(d, o);
                var o = e.createElement("span");
                e.setAttribute(o, "id", "poolHashrate");
                var i = e.createComment("");
                e.appendChild(o, i),
                e.appendChild(d, o),
                e.appendChild(l, d);
                var d = e.createTextNode("\n        ");
                e.appendChild(l, d);
                var d = e.createElement("div"),
                o = e.createElement("i");
                e.setAttribute(o, "class", "fa fa-money"),
                e.appendChild(d, o);
                var o = e.createTextNode(" 矿池费率: ");
                e.appendChild(d, o);
                var o = e.createElement("span");
                e.setAttribute(o, "id", "poolFee"),
                e.setAttribute(o, "class", "label label-success");
                var i = e.createComment("");
                e.appendChild(o, i),
                e.appendChild(d, o),
                e.appendChild(l, d);
                var d = e.createTextNode("\n");
                e.appendChild(l, d);
                var d = e.createComment("");
                e.appendChild(l, d);
                var d = e.createTextNode("      ");
                e.appendChild(l, d),
                e.appendChild(r, l);
                var l = e.createTextNode("\n      ");
                e.appendChild(r, l);
                var l = e.createElement("div");
                e.setAttribute(l, "class", "col-md-4 stats");
                var d = e.createTextNode("\n        ");
                e.appendChild(l, d);
                var d = e.createElement("div"),
                o = e.createElement("i");
                e.setAttribute(o, "class", "fa fa-unlock-alt"),
                e.appendChild(d, o);
                var o = e.createTextNode(" OF全网难度: ");
                e.appendChild(d, o);
                var o = e.createElement("span"),
                i = e.createComment("");
                e.appendChild(o, i),
                e.appendChild(d, o),
                e.appendChild(l, d);
                var d = e.createTextNode("\n        ");
                e.appendChild(l, d);
                var d = e.createElement("div"),
                o = e.createElement("i");
                e.setAttribute(o, "class", "fa fa-tachometer"),
                e.appendChild(d, o);
                var o = e.createTextNode(" OF全网算力: ");
                e.appendChild(d, o);
                var o = e.createElement("span"),
                i = e.createComment("");
                e.appendChild(o, i),
                e.appendChild(d, o),
                e.appendChild(l, d);
                var d = e.createTextNode("\n        ");
                e.appendChild(l, d);
                var d = e.createElement("div"),
                o = e.createElement("i");
                e.setAttribute(o, "class", "fa fa-bars"),
                e.appendChild(d, o);
                var o = e.createTextNode(" OF当前区块高度: ");
                e.appendChild(d, o);
                var o = e.createElement("span"),
                i = e.createComment("");
                e.appendChild(o, i),
                e.appendChild(d, o),
                e.appendChild(l, d);
                var d = e.createTextNode("\n        ");
                e.appendChild(l, d);
                var d = e.createElement("div"),
                o = e.createElement("i");
                e.setAttribute(o, "class", "fa fa-clock-o"),
                e.appendChild(d, o);
                var o = e.createTextNode(" 当前区块预期进度: ");
                e.appendChild(d, o);
                var o = e.createElement("span"),
                i = e.createComment("");
                e.appendChild(o, i),
                e.appendChild(d, o),
                e.appendChild(l, d);
                var d = e.createTextNode("\n      ");
                e.appendChild(l, d),
                e.appendChild(r, l);
                var l = e.createTextNode("\n    ");
                e.appendChild(r, l),
                e.appendChild(n, r);
                var r = e.createTextNode("\n  ");
                e.appendChild(n, r),
                e.appendChild(a, n);
                var n = e.createTextNode("\n");
                e.appendChild(a, n),
                e.appendChild(t, a);
                var a = e.createTextNode("\n\n");
                e.appendChild(t, a);
                var a = e.createElement("div");
                e.setAttribute(a, "class", "container");
                var n = e.createTextNode("\n  ");
                e.appendChild(a, n);
                var n = e.createElement("div");
                e.setAttribute(n, "class", "stats");
                var r = e.createTextNode("\n    ");
                e.appendChild(n, r);
                var r = e.createElement("h4"),
                l = e.createTextNode("查询统计和支付历史");
                e.appendChild(r, l),
                e.appendChild(n, r);
                var r = e.createTextNode("\n    ");
                e.appendChild(n, r);
                var r = e.createElement("div");
                e.setAttribute(r, "class", "input-group");
                var l = e.createTextNode("\n      ");
                e.appendChild(r, l);
                var l = e.createComment("");
                e.appendChild(r, l);
                var l = e.createTextNode("\n      ");
                e.appendChild(r, l);
                var l = e.createElement("span");
                e.setAttribute(l, "class", "input-group-btn");
                var d = e.createTextNode("\n        ");
                e.appendChild(l, d);
                var d = e.createElement("button");
                e.setAttribute(d, "class", "btn btn-primary"),
                e.setAttribute(d, "type", "button");
                var o = e.createTextNode("\n          ");
                e.appendChild(d, o);
                var o = e.createElement("span");
                e.setAttribute(o, "style", "display: inline;");
                var i = e.createElement("i");
                e.setAttribute(i, "class", "fa fa-search"),
                e.appendChild(o, i);
                var i = e.createTextNode(" 查询");
                e.appendChild(o, i),
                e.appendChild(d, o);
                var o = e.createTextNode("\n        ");
                e.appendChild(d, o),
                e.appendChild(l, d);
                var d = e.createTextNode("\n      ");
                e.appendChild(l, d),
                e.appendChild(r, l);
                var l = e.createTextNode("\n    ");
                e.appendChild(r, l),
                e.appendChild(n, r);
                var r = e.createTextNode("\n  ");
                e.appendChild(n, r),
                e.appendChild(a, n);
                var n = e.createTextNode("\n  ");
                e.appendChild(a, n);
                var n = e.createElement("div"),
                r = e.createTextNode("\n    ");
                e.appendChild(n, r);
                var r = e.createElement("hr");
                e.appendChild(n, r);
                var r = e.createTextNode("\n    ");
                e.appendChild(n, r);
                var r = e.createElement("h4");
                e.setAttribute(r, "class", "note note-info text-left");
                var l = e.createTextNode("\n    矿池地址：");
                e.appendChild(r, l);
                var l = e.createElement("br");
                e.appendChild(r, l);
                var l = e.createTextNode("\n    ");
                e.appendChild(r, l);
                var l = e.createElement("h4"),
                d = e.createElement("code"),
                o = e.createTextNode("stratum+tcp://www.ofpool.vip:8008");
                e.appendChild(d, o),
                e.appendChild(l, d),
                e.appendChild(r, l);
                var l = e.createTextNode("\n    OFcoin矿池无需注册，设置钱包地址和矿工号即可使用。");
                e.appendChild(r, l);
                var l = e.createElement("br");
                e.appendChild(r, l);
                var l = e.createTextNode("\n\t因OF与ETH算法相同，所以挖矿软件显示为挖ETH。");
                e.appendChild(r, l);
                var l = e.createElement("br");
                e.appendChild(r, l);
                var l = e.createTextNode("\n\t");
                e.appendChild(r, l);
                var l = e.createElement("b");
                e.setAttribute(l, "style", "color:red");
                var d = e.createTextNode("在对矿工进行支付时，手续费由矿池承担");
                e.appendChild(l, d),
                e.appendChild(r, l);
                var l = e.createElement("br");
                e.appendChild(r, l);
                e.appendChild(l, d),
                e.appendChild(r, l);
                var l = e.createTextNode("");
                e.appendChild(r, l);
                var l = e.createElement("br");
                e.appendChild(r, l);
                var l = e.createTextNode("\n    Claymore挖矿软件启动参数：");
                e.appendChild(r, l);
                var l = e.createElement("br");
                e.appendChild(r, l);
                var l = e.createTextNode("\n    ");
                e.appendChild(r, l);
                var l = e.createElement("h4"),
                d = e.createElement("code"),
                o = e.createTextNode("EthDcrMiner64 -epool stratum+tcp://www.ofpool.vip:8008 -ewal <您的OF钱包地址> -eworker <矿工号> -epsw x -allcoins 1");
                e.appendChild(d, o),
                e.appendChild(l, d),
                e.appendChild(r, l);
                var l = e.createTextNode("\n\t挖矿软件下载地址(windows系统)：");
                e.appendChild(r, l);
                var l = e.createElement("a");
                e.setAttribute(l, "target", "_blank"),
                e.setAttribute(l, "href", "");
                var d = e.createTextNode("原版Claymore");
                e.appendChild(l, d),
                e.appendChild(r, l);
                var l = e.createTextNode("  |  ");
                e.appendChild(r, l);
                var l = e.createElement("a");
                e.setAttribute(l, "target", "_blank"),
                e.setAttribute(l, "href", "");
                var d = e.createTextNode("圣骑士2.86");
                e.appendChild(l, d),
                e.appendChild(r, l);
                var l = e.createTextNode("(已配置好挖of，需更换钱包地址、矿工名)");
                e.appendChild(r, l);
                var l = e.createElement("br");
                e.appendChild(r, l);
                var l = e.createTextNode("\n\t圣骑士等软件设置方法：");
                e.appendChild(r, l);
                var l = e.createElement("a");
                e.setAttribute(l, "target", "_blank"),
                e.setAttribute(l, "href", "#");
                var d = e.createTextNode("点击查看");
                e.appendChild(l, d),
                e.appendChild(r, l);
                var l = e.createTextNode("\n    ");
                e.appendChild(r, l),
                e.appendChild(n, r);
                var r = e.createTextNode("\n  ");
                e.appendChild(n, r),
                e.appendChild(a, n);
                var n = e.createTextNode("\n");
                e.appendChild(a, n),
                e.appendChild(t, a);
                var a = e.createTextNode("\n");
                return e.appendChild(t, a),
                t
            },
            buildRenderNodes: function(e, t, a) {
                var n = e.childAt(t, [0, 1, 1]),
                r = e.childAt(n, [3]),
                l = e.childAt(n, [5]),
                d = e.childAt(t, [2, 1, 3]),
                o = e.childAt(d, [3, 1]),
                i = new Array(11);
                return i[0] = e.createMorphAt(e.childAt(n, [1, 3]), 1, 1),
                i[1] = e.createMorphAt(e.childAt(r, [1, 2]), 0, 0),
                i[2] = e.createMorphAt(e.childAt(r, [3, 2]), 0, 0),
                i[3] = e.createMorphAt(e.childAt(r, [5, 2]), 0, 0),
                i[4] = e.createMorphAt(r, 7, 7),
                i[5] = e.createMorphAt(e.childAt(l, [1, 2]), 0, 0),
                i[6] = e.createMorphAt(e.childAt(l, [3, 2]), 0, 0),
                i[7] = e.createMorphAt(e.childAt(l, [5, 2]), 0, 0),
                i[8] = e.createMorphAt(e.childAt(l, [7, 2]), 0, 0),
                i[9] = e.createMorphAt(d, 1, 1),
                i[10] = e.createElementMorph(o),
                i
            },
            statements: [["content", "config.PayoutThreshold", ["loc", [null, [15, 33], [15, 59]]], 0, 0, 0, 0], ["inline", "format-number", [["get", "stats.model.minersTotal", ["loc", [null, [19, 87], [19, 110]]], 0, 0, 0, 0]], [], ["loc", [null, [19, 71], [19, 112]]], 0, 0], ["inline", "format-hashrate", [["get", "stats.model.hashrate", ["loc", [null, [20, 95], [20, 115]]], 0, 0, 0, 0]], [], ["loc", [null, [20, 77], [20, 117]]], 0, 0], ["content", "config.PoolFee", ["loc", [null, [21, 94], [21, 112]]], 0, 0, 0, 0], ["block", "if", [["get", "stats.model.stats.lastBlockFound", ["loc", [null, [22, 14], [22, 46]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [22, 8], [24, 15]]]], ["inline", "with-metric-prefix", [["get", "stats.difficulty", ["loc", [null, [27, 81], [27, 97]]], 0, 0, 0, 0]], [], ["loc", [null, [27, 60], [27, 99]]], 0, 0], ["inline", "format-hashrate", [["get", "stats.hashrate", ["loc", [null, [28, 78], [28, 92]]], 0, 0, 0, 0]], [], ["loc", [null, [28, 60], [28, 94]]], 0, 0], ["inline", "format-number", [["get", "stats.height", ["loc", [null, [29, 72], [29, 84]]], 0, 0, 0, 0]], [], ["loc", [null, [29, 56], [29, 86]]], 0, 0], ["inline", "format-number", [["get", "stats.roundVariance", ["loc", [null, [30, 75], [30, 94]]], 0, 0, 0, 0]], ["style", "percent"], ["loc", [null, [30, 59], [30, 112]]], 0, 0], ["inline", "input", [], ["value", ["subexpr", "@mut", [["get", "cachedLogin", ["loc", [null, [40, 20], [40, 31]]], 0, 0, 0, 0]], [], [], 0, 0], "class", "form-control", "placeholder", "请输入OF钱包地址"], ["loc", [null, [40, 6], [40, 78]]], 0, 0], ["element", "action", ["lookup", ["get", "cachedLogin", ["loc", [null, [42, 72], [42, 83]]], 0, 0, 0, 0]], [], ["loc", [null, [42, 54], [42, 85]]], 0, 0]],
            locals: [],
            templates: [e]
        }
    } ())
}),
define("open-ethereum-pool/templates/luck", ["exports"],
function(e) {
    e.
default = Ember.HTMLBars.template(function() {
        var e = function() {
            return {
                meta: {
                    revision: "Ember@2.8.3+c4330341",
                    loc: {
                        source: null,
                        start: {
                            line: 12,
                            column: 4
                        },
                        end: {
                            line: 19,
                            column: 4
                        }
                    },
                    moduleName: "open-ethereum-pool/templates/luck.hbs"
                },
                isEmpty: !1,
                arity: 2,
                cachedFragment: null,
                hasRendered: !1,
                buildFragment: function(e) {
                    var t = e.createDocumentFragment(),
                    a = e.createTextNode("    ");
                    e.appendChild(t, a);
                    var a = e.createElement("tr"),
                    n = e.createTextNode("\n      ");
                    e.appendChild(a, n);
                    var n = e.createElement("td"),
                    r = e.createComment("");
                    e.appendChild(n, r),
                    e.appendChild(a, n);
                    var n = e.createTextNode("\n      ");
                    e.appendChild(a, n);
                    var n = e.createElement("td"),
                    r = e.createComment("");
                    e.appendChild(n, r),
                    e.appendChild(a, n);
                    var n = e.createTextNode("\n      ");
                    e.appendChild(a, n);
                    var n = e.createElement("td"),
                    r = e.createComment("");
                    e.appendChild(n, r),
                    e.appendChild(a, n);
                    var n = e.createTextNode("\n      ");
                    e.appendChild(a, n);
                    var n = e.createElement("td"),
                    r = e.createComment("");
                    e.appendChild(n, r),
                    e.appendChild(a, n);
                    var n = e.createTextNode("\n    ");
                    e.appendChild(a, n),
                    e.appendChild(t, a);
                    var a = e.createTextNode("\n");
                    return e.appendChild(t, a),
                    t
                },
                buildRenderNodes: function(e, t, a) {
                    var n = e.childAt(t, [1]),
                    r = new Array(4);
                    return r[0] = e.createMorphAt(e.childAt(n, [1]), 0, 0),
                    r[1] = e.createMorphAt(e.childAt(n, [3]), 0, 0),
                    r[2] = e.createMorphAt(e.childAt(n, [5]), 0, 0),
                    r[3] = e.createMorphAt(e.childAt(n, [7]), 0, 0),
                    r
                },
                statements: [["content", "total", ["loc", [null, [14, 10], [14, 19]]], 0, 0, 0, 0], ["inline", "format-number", [["get", "row.luck", ["loc", [null, [15, 26], [15, 34]]], 0, 0, 0, 0]], ["style", "percent"], ["loc", [null, [15, 10], [15, 52]]], 0, 0], ["inline", "format-number", [["get", "row.uncleRate", ["loc", [null, [16, 26], [16, 39]]], 0, 0, 0, 0]], ["style", "percent"], ["loc", [null, [16, 10], [16, 57]]], 0, 0], ["inline", "format-number", [["get", "row.orphanRate", ["loc", [null, [17, 26], [17, 40]]], 0, 0, 0, 0]], ["style", "percent"], ["loc", [null, [17, 10], [17, 58]]], 0, 0]],
                locals: ["total", "row"],
                templates: []
            }
        } ();
        return {
            meta: {
                revision: "Ember@2.8.3+c4330341",
                loc: {
                    source: null,
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 23,
                        column: 0
                    }
                },
                moduleName: "open-ethereum-pool/templates/luck.hbs"
            },
            isEmpty: !1,
            arity: 0,
            cachedFragment: null,
            hasRendered: !1,
            buildFragment: function(e) {
                var t = e.createDocumentFragment(),
                a = e.createElement("div");
                e.setAttribute(a, "class", "table-responsive");
                var n = e.createTextNode("\n  ");
                e.appendChild(a, n);
                var n = e.createElement("table");
                e.setAttribute(n, "class", "table table-condensed table-striped");
                var r = e.createTextNode("\n    ");
                e.appendChild(n, r);
                var r = e.createElement("thead"),
                l = e.createTextNode("\n      ");
                e.appendChild(r, l);
                var l = e.createElement("tr"),
                d = e.createTextNode("\n        ");
                e.appendChild(l, d);
                var d = e.createElement("th"),
                o = e.createTextNode("区块数量");
                e.appendChild(d, o),
                e.appendChild(l, d);
                var d = e.createTextNode("\n        ");
                e.appendChild(l, d);
                var d = e.createElement("th"),
                o = e.createTextNode("幸运值");
                e.appendChild(d, o),
                e.appendChild(l, d);
                var d = e.createTextNode("\n        ");
                e.appendChild(l, d);
                var d = e.createElement("th"),
                o = e.createTextNode("叔块率");
                e.appendChild(d, o),
                e.appendChild(l, d);
                var d = e.createTextNode("\n        ");
                e.appendChild(l, d);
                var d = e.createElement("th"),
                o = e.createTextNode("孤块率");
                e.appendChild(d, o),
                e.appendChild(l, d);
                var d = e.createTextNode("\n      ");
                e.appendChild(l, d),
                e.appendChild(r, l);
                var l = e.createTextNode("\n    ");
                e.appendChild(r, l),
                e.appendChild(n, r);
                var r = e.createTextNode("\n    ");
                e.appendChild(n, r);
                var r = e.createElement("tbody"),
                l = e.createTextNode("\n");
                e.appendChild(r, l);
                var l = e.createComment("");
                e.appendChild(r, l);
                var l = e.createTextNode("    ");
                e.appendChild(r, l),
                e.appendChild(n, r);
                var r = e.createTextNode("\n  ");
                e.appendChild(n, r),
                e.appendChild(a, n);
                var n = e.createTextNode("\n");
                e.appendChild(a, n),
                e.appendChild(t, a);
                var a = e.createTextNode("\n");
                return e.appendChild(t, a),
                t
            },
            buildRenderNodes: function(e, t, a) {
                var n = new Array(1);
                return n[0] = e.createMorphAt(e.childAt(t, [0, 1, 3]), 1, 1),
                n
            },
            statements: [["block", "each-in", [["get", "model.luck", ["loc", [null, [12, 15], [12, 25]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [12, 4], [19, 16]]]]],
            locals: [],
            templates: [e]
        }
    } ())
}),
define("open-ethereum-pool/templates/miners", ["exports"],
function(e) {
    e.
default = Ember.HTMLBars.template(function() {
        var e = function() {
            var e = function() {
                var e = function() {
                    return {
                        meta: {
                            revision: "Ember@2.8.3+c4330341",
                            loc: {
                                source: null,
                                start: {
                                    line: 22,
                                    column: 14
                                },
                                end: {
                                    line: 22,
                                    column: 68
                                }
                            },
                            moduleName: "open-ethereum-pool/templates/miners.hbs"
                        },
                        isEmpty: !1,
                        arity: 0,
                        cachedFragment: null,
                        hasRendered: !1,
                        buildFragment: function(e) {
                            var t = e.createDocumentFragment(),
                            a = e.createComment("");
                            return e.appendChild(t, a),
                            t
                        },
                        buildRenderNodes: function(e, t, a) {
                            var n = new Array(1);
                            return n[0] = e.createMorphAt(t, 0, 0, a),
                            e.insertBoundary(t, 0),
                            e.insertBoundary(t, null),
                            n
                        },
                        statements: [["content", "m.login", ["loc", [null, [22, 57], [22, 68]]], 0, 0, 0, 0]],
                        locals: [],
                        templates: []
                    }
                } ();
                return {
                    meta: {
                        revision: "Ember@2.8.3+c4330341",
                        loc: {
                            source: null,
                            start: {
                                line: 20,
                                column: 8
                            },
                            end: {
                                line: 26,
                                column: 8
                            }
                        },
                        moduleName: "open-ethereum-pool/templates/miners.hbs"
                    },
                    isEmpty: !1,
                    arity: 1,
                    cachedFragment: null,
                    hasRendered: !1,
                    buildFragment: function(e) {
                        var t = e.createDocumentFragment(),
                        a = e.createTextNode("        ");
                        e.appendChild(t, a);
                        var a = e.createElement("tr"),
                        n = e.createTextNode("\n          ");
                        e.appendChild(a, n);
                        var n = e.createElement("td"),
                        r = e.createComment("");
                        e.appendChild(n, r),
                        e.appendChild(a, n);
                        var n = e.createTextNode("\n          ");
                        e.appendChild(a, n);
                        var n = e.createElement("td"),
                        r = e.createComment("");
                        e.appendChild(n, r),
                        e.appendChild(a, n);
                        var n = e.createTextNode("\n          ");
                        e.appendChild(a, n);
                        var n = e.createElement("td"),
                        r = e.createComment("");
                        e.appendChild(n, r),
                        e.appendChild(a, n);
                        var n = e.createTextNode("\n        ");
                        e.appendChild(a, n),
                        e.appendChild(t, a);
                        var a = e.createTextNode("\n");
                        return e.appendChild(t, a),
                        t
                    },
                    buildRenderNodes: function(e, t, a) {
                        var n = e.childAt(t, [1]),
                        r = new Array(4);
                        return r[0] = e.createAttrMorph(n, "class"),
                        r[1] = e.createMorphAt(e.childAt(n, [1]), 0, 0),
                        r[2] = e.createMorphAt(e.childAt(n, [3]), 0, 0),
                        r[3] = e.createMorphAt(e.childAt(n, [5]), 0, 0),
                        r
                    },
                    statements: [["attribute", "class", ["concat", [["subexpr", "if", [["get", "m.offline", ["loc", [null, [21, 24], [21, 33]]], 0, 0, 0, 0], "warning"], [], ["loc", [null, [21, 19], [21, 45]]], 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["block", "link-to", ["account", ["get", "m.login", ["loc", [null, [22, 35], [22, 42]]], 0, 0, 0, 0]], ["class", "hash"], 0, null, ["loc", [null, [22, 14], [22, 80]]]], ["inline", "format-hashrate", [["get", "m.hr", ["loc", [null, [23, 32], [23, 36]]], 0, 0, 0, 0]], [], ["loc", [null, [23, 14], [23, 38]]], 0, 0], ["inline", "format-date-locale", [["get", "m.lastBeat", ["loc", [null, [24, 35], [24, 45]]], 0, 0, 0, 0]], [], ["loc", [null, [24, 14], [24, 47]]], 0, 0]],
                    locals: ["m"],
                    templates: [e]
                }
            } ();
            return {
                meta: {
                    revision: "Ember@2.8.3+c4330341",
                    loc: {
                        source: null,
                        start: {
                            line: 8,
                            column: 2
                        },
                        end: {
                            line: 30,
                            column: 2
                        }
                    },
                    moduleName: "open-ethereum-pool/templates/miners.hbs"
                },
                isEmpty: !1,
                arity: 0,
                cachedFragment: null,
                hasRendered: !1,
                buildFragment: function(e) {
                    var t = e.createDocumentFragment(),
                    a = e.createTextNode("  ");
                    e.appendChild(t, a);
                    var a = e.createElement("h4"),
                    n = e.createTextNode("Miners");
                    e.appendChild(a, n),
                    e.appendChild(t, a);
                    var a = e.createTextNode("\n  ");
                    e.appendChild(t, a);
                    var a = e.createElement("div");
                    e.setAttribute(a, "class", "table-responsive");
                    var n = e.createTextNode("\n    ");
                    e.appendChild(a, n);
                    var n = e.createElement("table");
                    e.setAttribute(n, "class", "table table-condensed table-striped");
                    var r = e.createTextNode("\n      ");
                    e.appendChild(n, r);
                    var r = e.createElement("thead"),
                    l = e.createTextNode("\n        ");
                    e.appendChild(r, l);
                    var l = e.createElement("tr"),
                    d = e.createTextNode("\n          ");
                    e.appendChild(l, d);
                    var d = e.createElement("th"),
                    o = e.createTextNode("地址");
                    e.appendChild(d, o),
                    e.appendChild(l, d);
                    var d = e.createTextNode("\n          ");
                    e.appendChild(l, d);
                    var d = e.createElement("th"),
                    o = e.createTextNode("当前算力");
                    e.appendChild(d, o),
                    e.appendChild(l, d);
                    var d = e.createTextNode("\n          ");
                    e.appendChild(l, d);
                    var d = e.createElement("th"),
                    o = e.createTextNode("最后提交");
                    e.appendChild(d, o),
                    e.appendChild(l, d);
                    var d = e.createTextNode("\n        ");
                    e.appendChild(l, d),
                    e.appendChild(r, l);
                    var l = e.createTextNode("\n      ");
                    e.appendChild(r, l),
                    e.appendChild(n, r);
                    var r = e.createTextNode("\n      ");
                    e.appendChild(n, r);
                    var r = e.createElement("tbody"),
                    l = e.createTextNode("\n");
                    e.appendChild(r, l);
                    var l = e.createComment("");
                    e.appendChild(r, l);
                    var l = e.createTextNode("      ");
                    e.appendChild(r, l),
                    e.appendChild(n, r);
                    var r = e.createTextNode("\n    ");
                    e.appendChild(n, r),
                    e.appendChild(a, n);
                    var n = e.createTextNode("\n  ");
                    e.appendChild(a, n),
                    e.appendChild(t, a);
                    var a = e.createTextNode("\n");
                    return e.appendChild(t, a),
                    t
                },
                buildRenderNodes: function(e, t, a) {
                    var n = new Array(1);
                    return n[0] = e.createMorphAt(e.childAt(t, [3, 1, 3]), 1, 1),
                    n
                },
                statements: [["block", "each", [["get", "model.miners", ["loc", [null, [20, 16], [20, 28]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [20, 8], [26, 17]]]]],
                locals: [],
                templates: [e]
            }
        } (),
        t = function() {
            return {
                meta: {
                    revision: "Ember@2.8.3+c4330341",
                    loc: {
                        source: null,
                        start: {
                            line: 30,
                            column: 2
                        },
                        end: {
                            line: 32,
                            column: 2
                        }
                    },
                    moduleName: "open-ethereum-pool/templates/miners.hbs"
                },
                isEmpty: !1,
                arity: 0,
                cachedFragment: null,
                hasRendered: !1,
                buildFragment: function(e) {
                    var t = e.createDocumentFragment(),
                    a = e.createTextNode("  ");
                    e.appendChild(t, a);
                    var a = e.createElement("h3"),
                    n = e.createTextNode("当前没有活跃矿工");
                    e.appendChild(a, n),
                    e.appendChild(t, a);
                    var a = e.createTextNode("\n");
                    return e.appendChild(t, a),
                    t
                },
                buildRenderNodes: function() {
                    return []
                },
                statements: [],
                locals: [],
                templates: []
            }
        } ();
        return {
            meta: {
                revision: "Ember@2.8.3+c4330341",
                loc: {
                    source: null,
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 34,
                        column: 0
                    }
                },
                moduleName: "open-ethereum-pool/templates/miners.hbs"
            },
            isEmpty: !1,
            arity: 0,
            cachedFragment: null,
            hasRendered: !1,
            buildFragment: function(e) {
                var t = e.createDocumentFragment(),
                a = e.createElement("div");
                e.setAttribute(a, "class", "jumbotron");
                var n = e.createTextNode("\n  ");
                e.appendChild(a, n);
                var n = e.createElement("div");
                e.setAttribute(n, "class", "container");
                var r = e.createTextNode("\n    ");
                e.appendChild(n, r);
                var r = e.createElement("p");
                e.setAttribute(r, "class", "lead");
                var l = e.createTextNode("矿池当前总算力: ");
                e.appendChild(r, l);
                var l = e.createComment("");
                e.appendChild(r, l);
                var l = e.createTextNode(".");
                e.appendChild(r, l),
                e.appendChild(n, r);
                var r = e.createTextNode("\n    ");
                e.appendChild(n, r);
                var r = e.createElement("strong"),
                l = e.createTextNode("矿工数:");
                e.appendChild(r, l),
                e.appendChild(n, r);
                var r = e.createTextNode(" ");
                e.appendChild(n, r);
                var r = e.createElement("span");
                e.setAttribute(r, "class", "label label-info");
                var l = e.createComment("");
                e.appendChild(r, l),
                e.appendChild(n, r);
                var r = e.createTextNode("\n  ");
                e.appendChild(n, r),
                e.appendChild(a, n);
                var n = e.createTextNode("\n");
                e.appendChild(a, n),
                e.appendChild(t, a);
                var a = e.createTextNode("\n");
                e.appendChild(t, a);
                var a = e.createElement("div");
                e.setAttribute(a, "class", "container");
                var n = e.createTextNode("\n");
                e.appendChild(a, n);
                var n = e.createComment("");
                e.appendChild(a, n),
                e.appendChild(t, a);
                var a = e.createTextNode("\n");
                return e.appendChild(t, a),
                t
            },
            buildRenderNodes: function(e, t, a) {
                var n = e.childAt(t, [0, 1]),
                r = new Array(3);
                return r[0] = e.createMorphAt(e.childAt(n, [1]), 1, 1),
                r[1] = e.createMorphAt(e.childAt(n, [5]), 0, 0),
                r[2] = e.createMorphAt(e.childAt(t, [2]), 1, 1),
                r
            },
            statements: [["inline", "format-hashrate", [["get", "model.hashrate", ["loc", [null, [3, 47], [3, 61]]], 0, 0, 0, 0]], [], ["loc", [null, [3, 29], [3, 63]]], 0, 0], ["content", "model.minersTotal", ["loc", [null, [4, 57], [4, 78]]], 0, 0, 0, 0], ["block", "if", [["get", "model.miners", ["loc", [null, [8, 8], [8, 20]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [8, 2], [32, 9]]]]],
            locals: [],
            templates: [e, t]
        }
    } ())
}),
define("open-ethereum-pool/templates/not-found", ["exports"],
function(e) {
    e.
default = Ember.HTMLBars.template(function() {
        return {
            meta: {
                revision: "Ember@2.8.3+c4330341",
                loc: {
                    source: null,
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 7,
                        column: 0
                    }
                },
                moduleName: "open-ethereum-pool/templates/not-found.hbs"
            },
            isEmpty: !1,
            arity: 0,
            cachedFragment: null,
            hasRendered: !1,
            buildFragment: function(e) {
                var t = e.createDocumentFragment(),
                a = e.createElement("div");
                e.setAttribute(a, "class", "container");
                var n = e.createTextNode("\n  ");
                e.appendChild(a, n);
                var n = e.createElement("div");
                e.setAttribute(n, "class", "page-header");
                var r = e.createTextNode("\n    ");
                e.appendChild(n, r);
                var r = e.createElement("h1"),
                l = e.createTextNode("No Account Data Available");
                e.appendChild(r, l),
                e.appendChild(n, r);
                var r = e.createTextNode("\n    ");
                e.appendChild(n, r);
                var r = e.createElement("p"),
                l = e.createTextNode("If you are looking for your account stats, you need to submit at least a single share.");
                e.appendChild(r, l),
                e.appendChild(n, r);
                var r = e.createTextNode("\n  ");
                e.appendChild(n, r),
                e.appendChild(a, n);
                var n = e.createTextNode("\n");
                e.appendChild(a, n),
                e.appendChild(t, a);
                var a = e.createTextNode("\n");
                return e.appendChild(t, a),
                t
            },
            buildRenderNodes: function() {
                return []
            },
            statements: [],
            locals: [],
            templates: []
        }
    } ())
}),
define("open-ethereum-pool/templates/payments", ["exports"],
function(e) {
    e.
default = Ember.HTMLBars.template(function() {
        var e = function() {
            var e = function() {
                return {
                    meta: {
                        revision: "Ember@2.8.3+c4330341",
                        loc: {
                            source: null,
                            start: {
                                line: 21,
                                column: 8
                            },
                            end: {
                                line: 32,
                                column: 8
                            }
                        },
                        moduleName: "open-ethereum-pool/templates/payments.hbs"
                    },
                    isEmpty: !1,
                    arity: 1,
                    cachedFragment: null,
                    hasRendered: !1,
                    buildFragment: function(e) {
                        var t = e.createDocumentFragment(),
                        a = e.createTextNode("          ");
                        e.appendChild(t, a);
                        var a = e.createElement("tr"),
                        n = e.createTextNode("\n            ");
                        e.appendChild(a, n);
                        var n = e.createElement("td"),
                        r = e.createComment("");
                        e.appendChild(n, r),
                        e.appendChild(a, n);
                        var n = e.createTextNode("\n            ");
                        e.appendChild(a, n);
                        var n = e.createElement("td"),
                        r = e.createComment("");
                        e.appendChild(n, r),
                        e.appendChild(a, n);
                        var n = e.createTextNode("\n            ");
                        e.appendChild(a, n);
                        var n = e.createElement("td"),
                        r = e.createTextNode("\n              ");
                        e.appendChild(n, r);
                        var r = e.createElement("a");
                        e.setAttribute(r, "class", "hash"),
                        e.setAttribute(r, "rel", "nofollow"),
                        e.setAttribute(r, "target", "_blank");
                        var l = e.createComment("");
                        e.appendChild(r, l),
                        e.appendChild(n, r);
                        var r = e.createTextNode("\n            ");
                        e.appendChild(n, r),
                        e.appendChild(a, n);
                        var n = e.createTextNode("\n            ");
                        e.appendChild(a, n);
                        var n = e.createElement("td"),
                        r = e.createTextNode("\n              ");
                        e.appendChild(n, r);
                        var r = e.createElement("a");
                        e.setAttribute(r, "class", "hash"),
                        e.setAttribute(r, "rel", "nofollow"),
                        e.setAttribute(r, "target", "_blank");
                        var l = e.createComment("");
                        e.appendChild(r, l),
                        e.appendChild(n, r);
                        var r = e.createTextNode("\n            ");
                        e.appendChild(n, r),
                        e.appendChild(a, n);
                        var n = e.createTextNode("\n          ");
                        e.appendChild(a, n),
                        e.appendChild(t, a);
                        var a = e.createTextNode("\n");
                        return e.appendChild(t, a),
                        t
                    },
                    buildRenderNodes: function(e, t, a) {
                        var n = e.childAt(t, [1]),
                        r = e.childAt(n, [5, 1]),
                        l = e.childAt(n, [7, 1]),
                        d = new Array(6);
                        return d[0] = e.createMorphAt(e.childAt(n, [1]), 0, 0),
                        d[1] = e.createMorphAt(e.childAt(n, [3]), 0, 0),
                        d[2] = e.createAttrMorph(r, "href"),
                        d[3] = e.createMorphAt(r, 0, 0),
                        d[4] = e.createAttrMorph(l, "href"),
                        d[5] = e.createMorphAt(l, 0, 0),
                        d
                    },
                    statements: [["inline", "format-date-locale", [["get", "tx.timestamp", ["loc", [null, [23, 37], [23, 49]]], 0, 0, 0, 0]], [], ["loc", [null, [23, 16], [23, 51]]], 0, 0], ["inline", "format-number", [["get", "tx.formatAmount", ["loc", [null, [24, 32], [24, 47]]], 0, 0, 0, 0]], [], ["loc", [null, [24, 16], [24, 49]]], 0, 0], ["attribute", "href", ["concat", ["http://www.ofcoin.com/address.html?address=", ["get", "tx.address", ["loc", [null, [26, 72], [26, 82]]], 0, 0, 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["content", "tx.address", ["loc", [null, [26, 130], [26, 144]]], 0, 0, 0, 0], ["attribute", "href", ["concat", ["http://www.ofcoin.com/transaction.html?txHash=", ["get", "tx.tx", ["loc", [null, [29, 75], [29, 80]]], 0, 0, 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["inline", "format-tx", [["get", "tx.tx", ["loc", [null, [29, 140], [29, 145]]], 0, 0, 0, 0]], [], ["loc", [null, [29, 128], [29, 147]]], 0, 0]],
                    locals: ["tx"],
                    templates: []
                }
            } ();
            return {
                meta: {
                    revision: "Ember@2.8.3+c4330341",
                    loc: {
                        source: null,
                        start: {
                            line: 8,
                            column: 2
                        },
                        end: {
                            line: 36,
                            column: 2
                        }
                    },
                    moduleName: "open-ethereum-pool/templates/payments.hbs"
                },
                isEmpty: !1,
                arity: 0,
                cachedFragment: null,
                hasRendered: !1,
                buildFragment: function(e) {
                    var t = e.createDocumentFragment(),
                    a = e.createTextNode("  ");
                    e.appendChild(t, a);
                    var a = e.createElement("h4"),
                    n = e.createTextNode("最近支付记录");
                    e.appendChild(a, n),
                    e.appendChild(t, a);
                    var a = e.createTextNode("\n  ");
                    e.appendChild(t, a);
                    var a = e.createElement("div");
                    e.setAttribute(a, "class", "table-responsive");
                    var n = e.createTextNode("\n    ");
                    e.appendChild(a, n);
                    var n = e.createElement("table");
                    e.setAttribute(n, "class", "table table-condensed table-striped");
                    var r = e.createTextNode("\n      ");
                    e.appendChild(n, r);
                    var r = e.createElement("thead"),
                    l = e.createTextNode("\n        ");
                    e.appendChild(r, l);
                    var l = e.createElement("tr"),
                    d = e.createTextNode("\n          ");
                    e.appendChild(l, d);
                    var d = e.createElement("th"),
                    o = e.createTextNode("支付时间");
                    e.appendChild(d, o),
                    e.appendChild(l, d);
                    var d = e.createTextNode("\n          ");
                    e.appendChild(l, d);
                    var d = e.createElement("th"),
                    o = e.createTextNode("金额");
                    e.appendChild(d, o),
                    e.appendChild(l, d);
                    var d = e.createTextNode("\n          ");
                    e.appendChild(l, d);
                    var d = e.createElement("th"),
                    o = e.createTextNode("地址");
                    e.appendChild(d, o),
                    e.appendChild(l, d);
                    var d = e.createTextNode("\n          ");
                    e.appendChild(l, d);
                    var d = e.createElement("th"),
                    o = e.createTextNode("交易ID");
                    e.appendChild(d, o),
                    e.appendChild(l, d);
                    var d = e.createTextNode("\n        ");
                    e.appendChild(l, d),
                    e.appendChild(r, l);
                    var l = e.createTextNode("\n      ");
                    e.appendChild(r, l),
                    e.appendChild(n, r);
                    var r = e.createTextNode("\n      ");
                    e.appendChild(n, r);
                    var r = e.createElement("tbody"),
                    l = e.createTextNode("\n");
                    e.appendChild(r, l);
                    var l = e.createComment("");
                    e.appendChild(r, l);
                    var l = e.createTextNode("      ");
                    e.appendChild(r, l),
                    e.appendChild(n, r);
                    var r = e.createTextNode("\n    ");
                    e.appendChild(n, r),
                    e.appendChild(a, n);
                    var n = e.createTextNode("\n  ");
                    e.appendChild(a, n),
                    e.appendChild(t, a);
                    var a = e.createTextNode("\n");
                    return e.appendChild(t, a),
                    t
                },
                buildRenderNodes: function(e, t, a) {
                    var n = new Array(1);
                    return n[0] = e.createMorphAt(e.childAt(t, [3, 1, 3]), 1, 1),
                    n
                },
                statements: [["block", "each", [["get", "model.payments", ["loc", [null, [21, 16], [21, 30]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [21, 8], [32, 17]]]]],
                locals: [],
                templates: [e]
            }
        } (),
        t = function() {
            return {
                meta: {
                    revision: "Ember@2.8.3+c4330341",
                    loc: {
                        source: null,
                        start: {
                            line: 36,
                            column: 2
                        },
                        end: {
                            line: 38,
                            column: 2
                        }
                    },
                    moduleName: "open-ethereum-pool/templates/payments.hbs"
                },
                isEmpty: !1,
                arity: 0,
                cachedFragment: null,
                hasRendered: !1,
                buildFragment: function(e) {
                    var t = e.createDocumentFragment(),
                    a = e.createTextNode("  ");
                    e.appendChild(t, a);
                    var a = e.createElement("h3"),
                    n = e.createTextNode("暂无支付");
                    e.appendChild(a, n),
                    e.appendChild(t, a);
                    var a = e.createTextNode("\n");
                    return e.appendChild(t, a),
                    t
                },
                buildRenderNodes: function() {
                    return []
                },
                statements: [],
                locals: [],
                templates: []
            }
        } ();
        return {
            meta: {
                revision: "Ember@2.8.3+c4330341",
                loc: {
                    source: null,
                    start: {
                        line: 1,
                        column: 0
                    },
                    end: {
                        line: 40,
                        column: 0
                    }
                },
                moduleName: "open-ethereum-pool/templates/payments.hbs"
            },
            isEmpty: !1,
            arity: 0,
            cachedFragment: null,
            hasRendered: !1,
            buildFragment: function(e) {
                var t = e.createDocumentFragment(),
                a = e.createElement("div");
                e.setAttribute(a, "class", "jumbotron");
                var n = e.createTextNode("\n  ");
                e.appendChild(a, n);
                var n = e.createElement("div");
                e.setAttribute(n, "class", "container");
                var r = e.createTextNode("\n    ");
                e.appendChild(n, r);
                var r = e.createElement("p");
                e.setAttribute(r, "class", "lead");
                var l = e.createTextNode("矿池支付给矿工报酬时产生的交易手续费，由矿池来承担");
                e.appendChild(r, l),
                e.appendChild(n, r);
                var r = e.createTextNode("\n    ");
                e.appendChild(n, r);
                var r = e.createElement("strong"),
                l = e.createTextNode("累计支付:");
                e.appendChild(r, l),
                e.appendChild(n, r);
                var r = e.createTextNode(" ");
                e.appendChild(n, r);
                var r = e.createElement("span");
                e.setAttribute(r, "class", "label label-info");
                var l = e.createComment("");
                e.appendChild(r, l),
                e.appendChild(n, r);
                var r = e.createTextNode("\n  ");
                e.appendChild(n, r),
                e.appendChild(a, n);
                var n = e.createTextNode("\n");
                e.appendChild(a, n),
                e.appendChild(t, a);
                var a = e.createTextNode("\n");
                e.appendChild(t, a);
                var a = e.createElement("div");
                e.setAttribute(a, "class", "container");
                var n = e.createTextNode("\n");
                e.appendChild(a, n);
                var n = e.createComment("");
                e.appendChild(a, n),
                e.appendChild(t, a);
                var a = e.createTextNode("\n");
                return e.appendChild(t, a),
                t
            },
            buildRenderNodes: function(e, t, a) {
                var n = new Array(2);
                return n[0] = e.createMorphAt(e.childAt(t, [0, 1, 5]), 0, 0),
                n[1] = e.createMorphAt(e.childAt(t, [2]), 1, 1),
                n
            },
            statements: [["content", "model.paymentsTotal", ["loc", [null, [4, 58], [4, 81]]], 0, 0, 0, 0], ["block", "if", [["get", "model.payments", ["loc", [null, [8, 8], [8, 22]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [8, 2], [38, 9]]]]],
            locals: [],
            templates: [e, t]
        }
    } ())
}),
define("open-ethereum-pool/translations/en-us", ["exports"],
function(e) {
    e.
default = {
        product: {
            html: {
                info: "<strong>{product}</strong> will cost <em>{price, number, USD}</em> if ordered by {deadline, date, time}"
            },
            info: "{product} will cost {price, number, USD} if ordered by {deadline, date, time}",
            title: "Hello world!"
        }
    }
}),
define("open-ethereum-pool/utils/intl/missing-message", ["exports", "ember", "ember-intl/utils/links"],
function(e, t, a) {
    function n(e, t) {
        return t ? r("[ember-intl] translation: '" + e + "' on locale: '" + t.join(", ") + "' was not found.", !1, {
            id: "ember-intl-missing-translation"
        }) : r("[ember-intl] no locale has been set. Documentation: " + a.
    default.unsetLocale, !1, {
            id: "ember-intl-no-locale-set"
        }),
        "Missing translation: " + e
    }
    e.
default = n;
    var r = t.
default.warn
}),
define("open-ethereum-pool/config/environment", ["ember"],
function(e) {
    try {
        var t = "open-ethereum-pool/config/environment",
        a = document.querySelector('meta[name="' + t + '"]').getAttribute("content"),
        n = JSON.parse(unescape(a)),
        r = {
        default:
            n
        };
        return Object.defineProperty(r, "__esModule", {
            value: !0
        }),
        r
    } catch(e) {
        throw new Error('Could not read config from meta tag with name "' + t + '".')
    }
}),
runningTests || require("open-ethereum-pool/app").
default.create({
        ApiUrl:
               "http://127.0.0.1:8080/",
        HttpHost: "127.0.0.1",
        HttpPort: 8080,
        StratumHost: "127.0.0.1",
        StratumPort: 8008,
        PoolFee: "0%",
        PayoutThreshold: "100 OF",
        BlockTime: 10.0,
        name: "open-ofbank-pool",
        version: "0.0.0+"
    });
