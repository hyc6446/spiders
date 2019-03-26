"v0.4.6 Geetest Inc.";
function addAnimateCallback(a) {
    animate_callback.push(a)
}
function animate(a) {
    requestAnimFrame(animate),
    TWEEN.update(a);
    for (var b = 0, c = animate_callback.length; b < c; b++)
        animate_callback[b]()
}
function getProvinceName(a, b) {
    for (var c in city_list)
        if (b) {
            if (city_list[c].code == a)
                return {
                    name: city_list[c].name
                }
        } else {
            var d = city_list[c].city;
            if (d && d.length)
                for (var e in d)
                    if (d[e].area_code == a)
                        return {
                            name: d[e].name,
                            code: city_list[c].code,
                            province: city_list[c].name,
                            province_area_code: city_list[c].area_code
                        }
        }
    return ""
}
function getPositionNameById(a) {
    if (a && !(a.indexOf("P") < 0))
        for (var b in position_list) {
            var c = position_list[b];
            if (a === c.code)
                return c.name;
            if (0 === a.indexOf(c.code))
                for (var d in c.position) {
                    var e = c.position[d];
                    if (e.position_code === a)
                        return e.name
                }
        }
}
function getProvinceNameNew(a, b) {
    a = a.toString();
    for (var c in city_list_new)
        if (b) {
            if (city_list_new[c].code === a)
                return {
                    name: city_list_new[c].name
                }
        } else {
            var d = city_list_new[c].city;
            if (d && d.length)
                for (var e in d)
                    if (d[e].area_code === a)
                        return {
                            name: d[e].name,
                            code: city_list_new[c].code,
                            province: city_list_new[c].name
                        }
        }
    return ""
}
function getCityNameByAreaCode(a) {
    if (a = a.toString(),
    !a)
        return "";
    if ("all" === a)
        return "全部地区";
    var b = a.substr(0, 2);
    for (var c in city_list_new) {
        var d = city_list_new[c];
        if (b == d.area_code) {
            for (var e in d.city) {
                var f = d.city[e];
                if (a === f.area_code)
                    return f.name
            }
            a = a.substr(0, 4);
            for (var e in d.city) {
                var f = d.city[e];
                if (a === f.area_code)
                    return f.name
            }
            return d.name
        }
    }
}
function getProvinceCodeByAreaCode(a) {
    if (a = a.toString(),
    !a)
        return "";
    for (var b in city_list_new) {
        var c = city_list_new[b];
        for (var d in c.city) {
            var e = c.city[d];
            if ((a === e.area_code || 0 === e.area_code.indexOf(a)) && "" !== c.area_code)
                return c.area_code
        }
    }
}
function showContacts(a, b, c) {
    getUserInfo(function(d) {
        !d.is_login || config.is_camcard || config.is_weixin ? _showContacts(a, b, c, d, {
            is_claim: !1,
            claimed_or_checking: !1
        }, {
            company_id: "company_id"
        }, 0) : getClaimInfo(function(e) {
            getProfileInfo(function(f) {
                _showContacts(a, b, c, d, e, f, f.vip_flag)
            })
        })
    })
}
function _showContacts(a, b, c, d, e, f, g) {
    if (!(a.contact_list_count || a.contacts_mask && a.contacts_mask.length))
        return void errorNotice("联系方式为空");
    var h = $("#vm_contacts_dialog")
      , i = sg.router.getParam("id");
    h.length || (h = $('<div class="vm_contacts" id="vm_contacts_dialog"></div>').appendTo(sg.router.current.$dom)),
    a.isEmail = isEmail,
    a.config = config,
    a.stringify = JSON.stringify,
    a.company_id = b,
    a.claimed_or_checking = e.claimed_or_checking,
    a.is_mycompany = f.company_id == i,
    a.status = e.status,
    a.max = function(a) {
        return a > 99 ? "99+" : a
    }
    ,
    sg.View.require("vm_contacts").render($.extend(a, c), h, function() {
        h.show().height(),
        h.addClass("show"),
        fixTopBar(".vc_content", "vc_item", "vc_title", "", function(a) {
            $(a.target).hasClass("vc_filter") && (config.is_camcard || config.is_weixin ? guideDownload({
                text: "使用" + config.productName + "即可查看该公司全部员工。"
            }) : sg.router.redirect("/company/staff_list?id=" + b))
        }),
        h.bind("click", function(a) {
            var b = $(a.target);
            (b.hasClass("vc_inner") || b.hasClass("vc_mask") || b.hasClass("vc_contact_cancel")) && (h.removeClass("show"),
            setTimeout(function() {
                $(document.body).css("overflow", "visible"),
                h.hide()
            }, 400))
        }),
        h.find(".btn_goto_claim").bind("click", function(b) {
            return 3 == a.status || 1 == a.status || 5 == a.status ? (Log.trace("show_authing"),
            void sg.Component.Alert({
                title: "认证中",
                html: "正在认证，认证完成后您可以" + b.target.innerText,
                btnCancel: {
                    text: "好的"
                },
                btnConfirm: {
                    text: "查看认证状态",
                    callback: function() {
                        return sg.router.redirect("/claim/status"),
                        !0
                    }
                }
            })) : void sg.Component.Alert({
                title: "认证成为员工",
                html: "无法" + b.target.innerText + "，请先认证成为企业的员工",
                btnCancel: {
                    text: "取消"
                },
                btnConfirm: {
                    text: "前往认证",
                    callback: function() {
                        return sg.router.redirect("/qi/home"),
                        !0
                    }
                }
            })
        });
        var c = h.find(".vc_inner")
          , e = h.find(".vc_content")
          , f = c.height()
          , g = 0;
        c.bind("touchmove", function(a) {
            var b = $(a.target);
            g || (g = e[0].scrollHeight),
            (b.hasClass("vc_inner") || g <= f) && a.preventDefault()
        }),
        h.bind("touchmove", function(a) {
            var b = $(a.target);
            b.hasClass("vc_inner") || b.closest(".vc_inner").length || b.hasClass("vcp_inner") || b.closest(".vcp_inner").length || a.preventDefault()
        }),
        bindContactEvent(h, a, isAuthLogin(d))
    })
}
function bindContactEvent(a, b, c) {
    function d(a, b, c, d) {
        if (!a || !b || !c)
            return !1;
        m = getStorageArray(a);
        var e = "";
        m.length ? ($.each(m, function(a, b) {
            e += '<span class="vcp_history_item hide_long">' + b + "</span>"
        }),
        b.html(e),
        c.find("#vcp_history_box").html(e),
        !d && c.show()) : (b.hide(),
        c.hide())
    }
    function e(b, c, d, e, f, g) {
        var h = {
            company_id: b,
            phone: "" + c,
            reason: e
        };
        s || (a.loadingStart(),
        s = 1,
        "1" == d ? Log.action("click_btn_company_phone_useful", h, "search_home") : Log.action("click_btn_company_phone_useless", h, "search_home"),
        l.getData({
            type: "contact",
            id: b,
            mask_str: g,
            status: d,
            feedback_msg: e
        }, function(b) {
            return s = 0,
            a.loadingStop(),
            b.errno ? 267 == b.errno ? errorNotice("已反馈过") : errorNotice() : void (f && f.call())
        }))
    }
    function f(a) {
        var b = $(t.template.html);
        b.appendTo(sg.router.current.$dom).height(),
        b.addClass("show"),
        b.find(".feed_btn_cancel, .feed_mask").bind("click", function() {
            g(b)
        }),
        b.find(".feed_mask, .feed_inner").bind("touchmove", function(a) {
            a.preventDefault()
        }),
        b.find(".feed_item").bind("click", function() {
            var c = $(this);
            g(b),
            a && a.call(c, c.text())
        })
    }
    function g(a) {
        a.removeClass("show"),
        setTimeout(function() {
            a.remove()
        }, 400)
    }
    var h, i = b._id || b.company_id, j = sg.Model.get("/info/getContactDecode", !1, !0), k = config.is_camcard && b.claimed_company, l = sg.Model.get("/info/feedBack", !1, !0);
    a.find(".vc_item .vc_list_item").bind("click", function(b) {
        var d = $(b.target)
          , e = $(this)
          , f = e.data("phone")
          , g = e.data("email");
        if (g)
            return sg.Model.get("/info/Log", !1, !0).getData({
                url: "businessEnquiry",
                cid: i
            }),
            void (location.href = "mailto:" + g);
        if (d.hasClass("vc_unlock") || d.closest(".vc_unlock").length || d.closest(".vc_unlock").length && !d.closest(".vc_unlock").hasClass("unlock")) {
            if (!c)
                return void (1 == config.direct_type && "/company/detail" == location.pathname ? sg.Component.DownloadNotice({}) : sg.router.redirect("/user/login", {
                    redirect: location.href
                }));
            d = e.find(".vc_unlock");
            var l = d.data("str");
            return void (h || d.hasClass("unlock") || (h = 1,
            a.loadingStart(),
            Log.action("click_unlock_number"),
            j.getData({
                id: i,
                mask_str: l
            }, function(b) {
                if (h = 0,
                a.loadingStop(),
                !b.errno && b.data) {
                    sg.Model.get("/info/Log", !1, !0).getData({
                        url: "businessEnquiry",
                        cid: i
                    });
                    var c = b.data.del_mask_str;
                    d.closest(".vc_list_item").find(".vc_main_text").text(c),
                    d.closest(".vc_phone_list").attr("data-phone", c),
                    d.addClass("unlock")
                } else if ("256" == b.errno) {
                    if (config.is_camcard)
                        return void (k ? sg.Component.Alert({
                            title: "电话解锁额度已用完",
                            text: "您的电话解锁额度已用完，请明日再试。",
                            btnCancel: "",
                            btnConfirm: {
                                text: "确定",
                                callback: function() {
                                    return Log.action("cc_user_up"),
                                    !0
                                },
                                css: "confirm_vip_css"
                            }
                        }) : sg.Component.Alert({
                            title: "电话解锁额度已用完",
                            text: "认证职业身份即可获得每日50次解锁机会！",
                            btnConfirm: {
                                text: "立即认证",
                                callback: function() {
                                    return location.href = config.cc_host_name_qi,
                                    Log.action("cc_user_up"),
                                    !0
                                }
                            }
                        }));
                    sg.Component.Alert({
                        title: "电话解锁额度已用完",
                        text: "您的电话解锁额度已用完，完成" + config.productName + "奖励可获取更多额度。",
                        btnConfirm: {
                            text: "免费领取",
                            callback: function() {
                                sg.router.redirect("/reward/gain")
                            }
                        }
                    })
                } else
                    errorNotice(b.message)
            })))
        }
        f && (location.href = "tel:" + f)
    }),
    a.find(".feedback_inner").bind("click", function() {
        var a = $(this)
          , d = a.data("index")
          , g = a.data("num")
          , h = a.attr("data-status")
          , j = a.closest(".vc_unlock")
          , k = j.next().find(".vc_main_text").text();
        if (c)
            return 1 == b.contacts_mask[d].feedback_status || 0 === b.contacts_mask[d].feedback_status ? errorNotice("已反馈过") : "1" != h ? void f(function(c) {
                e(i, k, "0", c, function() {
                    a.parents(".vc_fixtel_feedback").addClass("already"),
                    b.contacts_mask[d].feedback_status = 1,
                    setTimeout(function() {
                        j.addClass("gone"),
                        a.find(".feedback_text").text(parseInt(g) + 1)
                    }, 1e3)
                }, j.data("str"))
            }) : void e(i, k, "1", "", function() {
                a.parents(".vc_fixtel_feedback").addClass("already"),
                b.contacts_mask[d].feedback_status = 1,
                setTimeout(function() {
                    j.addClass("gone"),
                    a.find(".feedback_text").text(parseInt(g) + 1)
                }, 1e3)
            }, j.data("str"))
    });
    var m, n = a.find("#vc_search_position"), o = n.find("#vcp_notice_input"), p = n.find("#vcp_original"), q = n.find(".vcp_input"), r = (n.find("#vcp_search_list"),
    "filter_position_word");
    a.find(".vc_filter").bind("click", function() {
        config.is_camcard || config.is_weixin ? guideDownload({
            text: "使用" + config.productName + "即可查看该公司全部员工"
        }) : sg.router.redirect("/company/staff_list?id=" + i)
    }),
    d(r, o, p),
    a.find(".vcp_result_wrapper").unbind().bind("click", function(a) {
        var b;
        return 1 != config.direct_type || c || "/company/detail" != location.pathname ? ($(a.target).hasClass("vc_send_msg") && (b = $(a.target)),
        void (b && b.closest("#vc_search_position").length && (setStorageArray(r, $.trim(q.val()), 5),
        d(r, o, p, 1)))) : void sg.Component.DownloadNotice({})
    });
    var s, t = sg.View.require("feed_back")
}
!function() {
    function a() {
        return /android/i.test(ISJSBridge.ua)
    }
    function b() {
        return /iphone|ipad|ios/i.test(ISJSBridge.ua)
    }
    function c(c) {
        if (b())
            window.ISIOSNative ? ISIOSNative.callApp(JSON.stringify({
                message: c
            })) : window.webkit && window.webkit.messageHandlers.ISIOSNative && window.webkit.messageHandlers.ISIOSNative.postMessage({
                message: c
            });
        else if (a()) {
            if (!window.ISANDNative || !ISANDNative.CallApp)
                return void f.push(c);
            ISANDNative.CallApp(JSON.stringify(c))
        }
    }
    function d() {
        if (g--,
        g <= 0)
            return void (window.log && log("timeout", "ZDJSAPI", !0));
        if (!window.ISANDNative || !ISANDNative.CallApp)
            return void setTimeout(d, 100);
        for (var a = 0, b = f.length; a < b; a++)
            ISANDNative.CallApp(JSON.stringify(f[a]));
        f = []
    }
    if (!window.ISJSBridge) {
        var e = {}
          , f = [];
        window.ISJSBridge = {},
        ISJSBridge.ua = navigator.userAgent,
        ISJSBridge.version = "1.0.0",
        ISJSBridge.CallApp = function(a, b, d) {
            if (a) {
                var f = {};
                if (f.action = a,
                d) {
                    var g = "func" + (new Date).getTime();
                    e[g] = d,
                    f.jsCallBackId = g
                }
                b && (f.params = b),
                c(f),
                window.log && log("ZDao." + a + "(" + (b ? JSON.stringify(b) : "") + ")", "ZDJSAPI")
            }
        }
        ,
        ISJSBridge.AppCallBack = function(a, b) {
            var c = a.jsCallBackId
              , d = a.params;
            if (c && c.length > 0) {
                var f = e[c];
                f && f(b, d)
            }
            window.log && log("ZDao.callBack(" + (b ? JSON.stringify(b) : "") + "," + (d ? JSON.stringify(d) : "") + ")", "ZDJSAPI")
        }
        ;
        var g = 30;
        return /zdao_android/i.test(navigator.userAgent) && d(),
        ISJSBridge
    }
}(),
function() {
    window.ISJSBridge && (window.ZDao || (window.ZDao = {},
    ZDao.config = function(a, b) {
        ISJSBridge.CallApp("config", a, b)
    }
    ,
    ZDao.jump = function(a, b) {
        ISJSBridge.CallApp("urlscheme", a, b)
    }
    ,
    ZDao.share = function(a, b) {
        ISJSBridge.CallApp("share", a, b)
    }
    ,
    ZDao.closeweb = function(a) {
        ISJSBridge.CallApp("closeweb", a, null)
    }
    ,
    ZDao.login = function(a, b) {
        ISJSBridge.CallApp("login", a, b)
    }
    ,
    ZDao.setNavBtn = function(a, b) {
        ISJSBridge.CallApp("setnavbtn", a, b)
    }
    ,
    ZDao.disableNavBtn = function(a, b) {
        ISJSBridge.CallApp("disablenavbtn", a, b)
    }
    ,
    ZDao.showMenuList = function(a, b) {
        ISJSBridge.CallApp("showmenulist", a, b)
    }
    ,
    ZDao.notification = function(a, b) {
        ISJSBridge.CallApp("notification", a, b)
    }
    ,
    ZDao.getShareData = function() {
        var a = document.querySelectorAll('meta[property="og:title"]')[0]
          , b = document.querySelectorAll('meta[property="og:description"]')[0]
          , c = document.querySelectorAll('meta[property="og:image"]')[0]
          , d = document.querySelectorAll('meta[property="description"]')[0]
          , e = {};
        if (e.title = a && a.getAttribute("content") || document.title,
        e.desp = b && b.getAttribute("content") || d,
        e.url = document.location.href,
        c)
            e.image = c.getAttribute("content");
        else if (c = document.querySelector('img[src^="http"],img[src^="//"]')) {
            var f = c.src;
            e.image = f
        }
        return e
    }
    ,
    ZDao.setCookie = function(a, b, c) {
        var d = new Date
          , e = c ? parseInt(c) : 0;
        d.setTime(e ? 1e3 * e : d.getTime() + 72e5),
        document.cookie = a + "=" + (b ? escape(b) : "") + ";path=/;expires=" + d.toGMTString()
    }
    ,
    ZDao.shareTo = function(a, b) {
        ISJSBridge.CallApp("shareto", a, b)
    }
    ,
    ZDao.uploadImage = function(a, b) {
        ISJSBridge.CallApp("uploadImage", a, b)
    }
    ,
    ZDao.getUserInfo = function(a) {
        ISJSBridge.CallApp("getUserInfo", null, a)
    }
    ,
    ZDao.back = function() {
        ISJSBridge.CallApp("back")
    }
    ,
    ZDao.sendMsg = function(a, b) {
        ISJSBridge.CallApp("sendmsg", a, b)
    }
    ,
    ZDao.pay = function(a, b) {
        ISJSBridge.CallApp("pay", a, b)
    }
    ,
    ZDao.setCloseBtn = function(a, b) {
        ISJSBridge.CallApp("setclosebtn", a, b)
    }
    ,
    ZDao.onPageActivated = function(a) {
        ISJSBridge.CallApp("onPageActivated", null, a)
    }
    ,
    ZDao.removePageActivated = function(a) {
        ISJSBridge.CallApp("removePageActivated", null, a)
    }
    ,
    ZDao.getScreenShot = function(a) {
        ISJSBridge.CallApp("getscreenshot", null, a)
    }
    ,
    ZDao.loginByQrCode = function(a, b) {
        ISJSBridge.CallApp("loginbyqrcode", a, b)
    }
    ,
    ZDao.getUserContacts = function(a, b) {
        ISJSBridge.CallApp("getUserContacts", a, b)
    }
    ,
    ZDao.getUserNotice = function(a, b) {
        ISJSBridge.CallApp("getUserNotice", a, b)
    }
    ,
    ZDao.setMoreBtn = function(a, b) {
        ISJSBridge.CallApp("setMoreBtn", a, b)
    }
    ,
    ZDao.saveLongPicture = function(a, b) {
        ISJSBridge.CallApp("saveLongPicture", a, b)
    }
    ))
}(),
!function(a, b) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = a.document ? b(a, !0) : function(a) {
        if (!a.document)
            throw new Error("jQuery requires a window with a document");
        return b(a)
    }
    : b(a)
}("undefined" != typeof window ? window : this, function(a, b) {
    function c(a) {
        var b = "length"in a && a.length
          , c = da.type(a);
        return "function" !== c && !da.isWindow(a) && (!(1 !== a.nodeType || !b) || "array" === c || 0 === b || "number" == typeof b && b > 0 && b - 1 in a)
    }
    function d(a, b, c) {
        if (da.isFunction(b))
            return da.grep(a, function(a, d) {
                return !!b.call(a, d, a) !== c
            });
        if (b.nodeType)
            return da.grep(a, function(a) {
                return a === b !== c
            });
        if ("string" == typeof b) {
            if (ia.test(b))
                return da.filter(b, a, c);
            b = da.filter(b, a)
        }
        return da.grep(a, function(a) {
            return da.inArray(a, b) >= 0 !== c
        })
    }
    function e(a, b) {
        do
            a = a[b];
        while (a && 1 !== a.nodeType);return a
    }
    function f(a) {
        var b = oa[a] = {};
        return da.each(a.match(/\S+/g) || [], function(a, c) {
            b[c] = !0
        }),
        b
    }
    function g() {
        ka.addEventListener ? (ka.removeEventListener("DOMContentLoaded", h, !1),
        a.removeEventListener("load", h, !1)) : (ka.detachEvent("onreadystatechange", h),
        a.detachEvent("onload", h))
    }
    function h() {
        (ka.addEventListener || "load" === event.type || "complete" === ka.readyState) && (g(),
        da.ready())
    }
    function i(a, b, c) {
        if (void 0 === c && 1 === a.nodeType) {
            var d = "data-" + b.replace(/([A-Z])/g, "-$1").toLowerCase();
            if (c = a.getAttribute(d),
            "string" == typeof c) {
                try {
                    c = "true" === c || "false" !== c && ("null" === c ? null : +c + "" === c ? +c : sa.test(c) ? da.parseJSON(c) : c)
                } catch (a) {}
                da.data(a, b, c)
            } else
                c = void 0
        }
        return c
    }
    function j(a) {
        var b;
        for (b in a)
            if (("data" !== b || !da.isEmptyObject(a[b])) && "toJSON" !== b)
                return !1;
        return !0
    }
    function k(a, b, c, d) {
        if (da.acceptData(a)) {
            var e, f, g = da.expando, h = a.nodeType, i = h ? da.cache : a, j = h ? a[g] : a[g] && g;
            if (j && i[j] && (d || i[j].data) || void 0 !== c || "string" != typeof b)
                return j || (j = h ? a[g] = W.pop() || da.guid++ : g),
                i[j] || (i[j] = h ? {} : {
                    toJSON: da.noop
                }),
                "object" != typeof b && "function" != typeof b || (d ? i[j] = da.extend(i[j], b) : i[j].data = da.extend(i[j].data, b)),
                f = i[j],
                d || (f.data || (f.data = {}),
                f = f.data),
                void 0 !== c && (f[da.camelCase(b)] = c),
                "string" == typeof b ? (e = f[b],
                null == e && (e = f[da.camelCase(b)])) : e = f,
                e
        }
    }
    function l(a, b, c) {
        if (da.acceptData(a)) {
            var d, e, f = a.nodeType, g = f ? da.cache : a, h = f ? a[da.expando] : da.expando;
            if (g[h]) {
                if (b && (d = c ? g[h] : g[h].data)) {
                    da.isArray(b) ? b = b.concat(da.map(b, da.camelCase)) : b in d ? b = [b] : (b = da.camelCase(b),
                    b = b in d ? [b] : b.split(" ")),
                    e = b.length;
                    for (; e--; )
                        delete d[b[e]];
                    if (c ? !j(d) : !da.isEmptyObject(d))
                        return
                }
                (c || (delete g[h].data,
                j(g[h]))) && (f ? da.cleanData([a], !0) : ca.deleteExpando || g != g.window ? delete g[h] : g[h] = null)
            }
        }
    }
    function m() {
        return !0
    }
    function n() {
        return !1
    }
    function o() {
        try {
            return ka.activeElement
        } catch (a) {}
    }
    function p(a) {
        var b = Da.split("|")
          , c = a.createDocumentFragment();
        if (c.createElement)
            for (; b.length; )
                c.createElement(b.pop());
        return c
    }
    function q(a, b) {
        var c, d, e = 0, f = typeof a.getElementsByTagName !== ra ? a.getElementsByTagName(b || "*") : typeof a.querySelectorAll !== ra ? a.querySelectorAll(b || "*") : void 0;
        if (!f)
            for (f = [],
            c = a.childNodes || a; null != (d = c[e]); e++)
                !b || da.nodeName(d, b) ? f.push(d) : da.merge(f, q(d, b));
        return void 0 === b || b && da.nodeName(a, b) ? da.merge([a], f) : f
    }
    function r(a) {
        xa.test(a.type) && (a.defaultChecked = a.checked)
    }
    function s(a, b) {
        return da.nodeName(a, "table") && da.nodeName(11 !== b.nodeType ? b : b.firstChild, "tr") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a
    }
    function t(a) {
        return a.type = (null !== da.find.attr(a, "type")) + "/" + a.type,
        a
    }
    function u(a) {
        var b = Na.exec(a.type);
        return b ? a.type = b[1] : a.removeAttribute("type"),
        a
    }
    function v(a, b) {
        for (var c, d = 0; null != (c = a[d]); d++)
            da._data(c, "globalEval", !b || da._data(b[d], "globalEval"))
    }
    function w(a, b) {
        if (1 === b.nodeType && da.hasData(a)) {
            var c, d, e, f = da._data(a), g = da._data(b, f), h = f.events;
            if (h) {
                delete g.handle,
                g.events = {};
                for (c in h)
                    for (d = 0,
                    e = h[c].length; d < e; d++)
                        da.event.add(b, c, h[c][d])
            }
            g.data && (g.data = da.extend({}, g.data))
        }
    }
    function x(a, b) {
        var c, d, e;
        if (1 === b.nodeType) {
            if (c = b.nodeName.toLowerCase(),
            !ca.noCloneEvent && b[da.expando]) {
                e = da._data(b);
                for (d in e.events)
                    da.removeEvent(b, d, e.handle);
                b.removeAttribute(da.expando)
            }
            "script" === c && b.text !== a.text ? (t(b).text = a.text,
            u(b)) : "object" === c ? (b.parentNode && (b.outerHTML = a.outerHTML),
            ca.html5Clone && a.innerHTML && !da.trim(b.innerHTML) && (b.innerHTML = a.innerHTML)) : "input" === c && xa.test(a.type) ? (b.defaultChecked = b.checked = a.checked,
            b.value !== a.value && (b.value = a.value)) : "option" === c ? b.defaultSelected = b.selected = a.defaultSelected : "input" !== c && "textarea" !== c || (b.defaultValue = a.defaultValue)
        }
    }
    function y(b, c) {
        var d, e = da(c.createElement(b)).appendTo(c.body), f = a.getDefaultComputedStyle && (d = a.getDefaultComputedStyle(e[0])) ? d.display : da.css(e[0], "display");
        return e.detach(),
        f
    }
    function z(a) {
        var b = ka
          , c = Sa[a];
        return c || (c = y(a, b),
        "none" !== c && c || (Ra = (Ra || da("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement),
        b = (Ra[0].contentWindow || Ra[0].contentDocument).document,
        b.write(),
        b.close(),
        c = y(a, b),
        Ra.detach()),
        Sa[a] = c),
        c
    }
    function A(a, b) {
        return {
            get: function() {
                var c = a();
                if (null != c)
                    return c ? void delete this.get : (this.get = b).apply(this, arguments)
            }
        }
    }
    function B(a, b) {
        if (b in a)
            return b;
        for (var c = b.charAt(0).toUpperCase() + b.slice(1), d = b, e = db.length; e--; )
            if (b = db[e] + c,
            b in a)
                return b;
        return d
    }
    function C(a, b) {
        for (var c, d, e, f = [], g = 0, h = a.length; g < h; g++)
            d = a[g],
            d.style && (f[g] = da._data(d, "olddisplay"),
            c = d.style.display,
            b ? (f[g] || "none" !== c || (d.style.display = ""),
            "" === d.style.display && va(d) && (f[g] = da._data(d, "olddisplay", z(d.nodeName)))) : (e = va(d),
            (c && "none" !== c || !e) && da._data(d, "olddisplay", e ? c : da.css(d, "display"))));
        for (g = 0; g < h; g++)
            d = a[g],
            d.style && (b && "none" !== d.style.display && "" !== d.style.display || (d.style.display = b ? f[g] || "" : "none"));
        return a
    }
    function D(a, b, c) {
        var d = _a.exec(b);
        return d ? Math.max(0, d[1] - (c || 0)) + (d[2] || "px") : b
    }
    function E(a, b, c, d, e) {
        for (var f = c === (d ? "border" : "content") ? 4 : "width" === b ? 1 : 0, g = 0; f < 4; f += 2)
            "margin" === c && (g += da.css(a, c + ua[f], !0, e)),
            d ? ("content" === c && (g -= da.css(a, "padding" + ua[f], !0, e)),
            "margin" !== c && (g -= da.css(a, "border" + ua[f] + "Width", !0, e))) : (g += da.css(a, "padding" + ua[f], !0, e),
            "padding" !== c && (g += da.css(a, "border" + ua[f] + "Width", !0, e)));
        return g
    }
    function F(a, b, c) {
        var d = !0
          , e = "width" === b ? a.offsetWidth : a.offsetHeight
          , f = Ta(a)
          , g = ca.boxSizing && "border-box" === da.css(a, "boxSizing", !1, f);
        if (e <= 0 || null == e) {
            if (e = Ua(a, b, f),
            (e < 0 || null == e) && (e = a.style[b]),
            Wa.test(e))
                return e;
            d = g && (ca.boxSizingReliable() || e === a.style[b]),
            e = parseFloat(e) || 0
        }
        return e + E(a, b, c || (g ? "border" : "content"), d, f) + "px"
    }
    function G(a, b, c, d, e) {
        return new G.prototype.init(a,b,c,d,e)
    }
    function H() {
        return setTimeout(function() {
            eb = void 0
        }),
        eb = da.now()
    }
    function I(a, b) {
        var c, d = {
            height: a
        }, e = 0;
        for (b = b ? 1 : 0; e < 4; e += 2 - b)
            c = ua[e],
            d["margin" + c] = d["padding" + c] = a;
        return b && (d.opacity = d.width = a),
        d
    }
    function J(a, b, c) {
        for (var d, e = (kb[b] || []).concat(kb["*"]), f = 0, g = e.length; f < g; f++)
            if (d = e[f].call(c, b, a))
                return d
    }
    function K(a, b, c) {
        var d, e, f, g, h, i, j, k, l = this, m = {}, n = a.style, o = a.nodeType && va(a), p = da._data(a, "fxshow");
        c.queue || (h = da._queueHooks(a, "fx"),
        null == h.unqueued && (h.unqueued = 0,
        i = h.empty.fire,
        h.empty.fire = function() {
            h.unqueued || i()
        }
        ),
        h.unqueued++,
        l.always(function() {
            l.always(function() {
                h.unqueued--,
                da.queue(a, "fx").length || h.empty.fire()
            })
        })),
        1 === a.nodeType && ("height"in b || "width"in b) && (c.overflow = [n.overflow, n.overflowX, n.overflowY],
        j = da.css(a, "display"),
        k = "none" === j ? da._data(a, "olddisplay") || z(a.nodeName) : j,
        "inline" === k && "none" === da.css(a, "float") && (ca.inlineBlockNeedsLayout && "inline" !== z(a.nodeName) ? n.zoom = 1 : n.display = "inline-block")),
        c.overflow && (n.overflow = "hidden",
        ca.shrinkWrapBlocks() || l.always(function() {
            n.overflow = c.overflow[0],
            n.overflowX = c.overflow[1],
            n.overflowY = c.overflow[2]
        }));
        for (d in b)
            if (e = b[d],
            gb.exec(e)) {
                if (delete b[d],
                f = f || "toggle" === e,
                e === (o ? "hide" : "show")) {
                    if ("show" !== e || !p || void 0 === p[d])
                        continue;
                    o = !0
                }
                m[d] = p && p[d] || da.style(a, d)
            } else
                j = void 0;
        if (da.isEmptyObject(m))
            "inline" === ("none" === j ? z(a.nodeName) : j) && (n.display = j);
        else {
            p ? "hidden"in p && (o = p.hidden) : p = da._data(a, "fxshow", {}),
            f && (p.hidden = !o),
            o ? da(a).show() : l.done(function() {
                da(a).hide()
            }),
            l.done(function() {
                var b;
                da._removeData(a, "fxshow");
                for (b in m)
                    da.style(a, b, m[b])
            });
            for (d in m)
                g = J(o ? p[d] : 0, d, l),
                d in p || (p[d] = g.start,
                o && (g.end = g.start,
                g.start = "width" === d || "height" === d ? 1 : 0))
        }
    }
    function L(a, b) {
        var c, d, e, f, g;
        for (c in a)
            if (d = da.camelCase(c),
            e = b[d],
            f = a[c],
            da.isArray(f) && (e = f[1],
            f = a[c] = f[0]),
            c !== d && (a[d] = f,
            delete a[c]),
            g = da.cssHooks[d],
            g && "expand"in g) {
                f = g.expand(f),
                delete a[d];
                for (c in f)
                    c in a || (a[c] = f[c],
                    b[c] = e)
            } else
                b[d] = e
    }
    function M(a, b, c) {
        var d, e, f = 0, g = jb.length, h = da.Deferred().always(function() {
            delete i.elem
        }), i = function() {
            if (e)
                return !1;
            for (var b = eb || H(), c = Math.max(0, j.startTime + j.duration - b), d = c / j.duration || 0, f = 1 - d, g = 0, i = j.tweens.length; g < i; g++)
                j.tweens[g].run(f);
            return h.notifyWith(a, [j, f, c]),
            f < 1 && i ? c : (h.resolveWith(a, [j]),
            !1)
        }, j = h.promise({
            elem: a,
            props: da.extend({}, b),
            opts: da.extend(!0, {
                specialEasing: {}
            }, c),
            originalProperties: b,
            originalOptions: c,
            startTime: eb || H(),
            duration: c.duration,
            tweens: [],
            createTween: function(b, c) {
                var d = da.Tween(a, j.opts, b, c, j.opts.specialEasing[b] || j.opts.easing);
                return j.tweens.push(d),
                d
            },
            stop: function(b) {
                var c = 0
                  , d = b ? j.tweens.length : 0;
                if (e)
                    return this;
                for (e = !0; c < d; c++)
                    j.tweens[c].run(1);
                return b ? h.resolveWith(a, [j, b]) : h.rejectWith(a, [j, b]),
                this
            }
        }), k = j.props;
        for (L(k, j.opts.specialEasing); f < g; f++)
            if (d = jb[f].call(j, a, k, j.opts))
                return d;
        return da.map(k, J, j),
        da.isFunction(j.opts.start) && j.opts.start.call(a, j),
        da.fx.timer(da.extend(i, {
            elem: a,
            anim: j,
            queue: j.opts.queue
        })),
        j.progress(j.opts.progress).done(j.opts.done, j.opts.complete).fail(j.opts.fail).always(j.opts.always)
    }
    function N(a) {
        return function(b, c) {
            "string" != typeof b && (c = b,
            b = "*");
            var d, e = 0, f = b.toLowerCase().match(/\S+/g) || [];
            if (da.isFunction(c))
                for (; d = f[e++]; )
                    "+" === d.charAt(0) ? (d = d.slice(1) || "*",
                    (a[d] = a[d] || []).unshift(c)) : (a[d] = a[d] || []).push(c)
        }
    }
    function O(a, b, c, d) {
        function e(h) {
            var i;
            return f[h] = !0,
            da.each(a[h] || [], function(a, h) {
                var j = h(b, c, d);
                return "string" != typeof j || g || f[j] ? g ? !(i = j) : void 0 : (b.dataTypes.unshift(j),
                e(j),
                !1)
            }),
            i
        }
        var f = {}
          , g = a === Db;
        return e(b.dataTypes[0]) || !f["*"] && e("*")
    }
    function P(a, b) {
        var c, d, e = da.ajaxSettings.flatOptions || {};
        for (d in b)
            void 0 !== b[d] && ((e[d] ? a : c || (c = {}))[d] = b[d]);
        return c && da.extend(!0, a, c),
        a
    }
    function Q(a, b, c) {
        for (var d, e, f, g, h = a.contents, i = a.dataTypes; "*" === i[0]; )
            i.shift(),
            void 0 === e && (e = a.mimeType || b.getResponseHeader("Content-Type"));
        if (e)
            for (g in h)
                if (h[g] && h[g].test(e)) {
                    i.unshift(g);
                    break
                }
        if (i[0]in c)
            f = i[0];
        else {
            for (g in c) {
                if (!i[0] || a.converters[g + " " + i[0]]) {
                    f = g;
                    break
                }
                d || (d = g)
            }
            f = f || d
        }
        if (f)
            return f !== i[0] && i.unshift(f),
            c[f]
    }
    function R(a, b, c, d) {
        var e, f, g, h, i, j = {}, k = a.dataTypes.slice();
        if (k[1])
            for (g in a.converters)
                j[g.toLowerCase()] = a.converters[g];
        for (f = k.shift(); f; )
            if (a.responseFields[f] && (c[a.responseFields[f]] = b),
            !i && d && a.dataFilter && (b = a.dataFilter(b, a.dataType)),
            i = f,
            f = k.shift())
                if ("*" === f)
                    f = i;
                else if ("*" !== i && i !== f) {
                    if (g = j[i + " " + f] || j["* " + f],
                    !g)
                        for (e in j)
                            if (h = e.split(" "),
                            h[1] === f && (g = j[i + " " + h[0]] || j["* " + h[0]])) {
                                g === !0 ? g = j[e] : j[e] !== !0 && (f = h[0],
                                k.unshift(h[1]));
                                break
                            }
                    if (g !== !0)
                        if (g && a.throws)
                            b = g(b);
                        else
                            try {
                                b = g(b)
                            } catch (a) {
                                return {
                                    state: "parsererror",
                                    error: g ? a : "No conversion from " + i + " to " + f
                                }
                            }
                }
        return {
            state: "success",
            data: b
        }
    }
    function S(a, b, c, d) {
        var e;
        if (da.isArray(b))
            da.each(b, function(b, e) {
                c || Fb.test(a) ? d(a, e) : S(a + "[" + ("object" == typeof e ? b : "") + "]", e, c, d)
            });
        else if (c || "object" !== da.type(b))
            d(a, b);
        else
            for (e in b)
                S(a + "[" + e + "]", b[e], c, d)
    }
    function T() {
        try {
            return new a.XMLHttpRequest
        } catch (a) {}
    }
    function U() {
        try {
            return new a.ActiveXObject("Microsoft.XMLHTTP")
        } catch (a) {}
    }
    function V(a) {
        return da.isWindow(a) ? a : 9 === a.nodeType && (a.defaultView || a.parentWindow)
    }
    var W = []
      , X = W.slice
      , Y = W.concat
      , Z = W.push
      , $ = W.indexOf
      , _ = {}
      , aa = _.toString
      , ba = _.hasOwnProperty
      , ca = {}
      , da = function(a, b) {
        return new da.fn.init(a,b)
    }
      , ea = function(a, b) {
        return b.toUpperCase()
    };
    da.fn = da.prototype = {
        jquery: "1.11.3",
        constructor: da,
        selector: "",
        length: 0,
        toArray: function() {
            return X.call(this)
        },
        get: function(a) {
            return null != a ? a < 0 ? this[a + this.length] : this[a] : X.call(this)
        },
        pushStack: function(a) {
            var b = da.merge(this.constructor(), a);
            return b.prevObject = this,
            b.context = this.context,
            b
        },
        each: function(a, b) {
            return da.each(this, a, b)
        },
        map: function(a) {
            return this.pushStack(da.map(this, function(b, c) {
                return a.call(b, c, b)
            }))
        },
        slice: function() {
            return this.pushStack(X.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        eq: function(a) {
            var b = this.length
              , c = +a + (a < 0 ? b : 0);
            return this.pushStack(c >= 0 && c < b ? [this[c]] : [])
        },
        end: function() {
            return this.prevObject || this.constructor(null)
        },
        push: Z,
        sort: W.sort,
        splice: W.splice
    },
    da.extend = da.fn.extend = function() {
        var a, b, c, d, e, f, g = arguments[0] || {}, h = 1, i = arguments.length, j = !1;
        for ("boolean" == typeof g && (j = g,
        g = arguments[h] || {},
        h++),
        "object" == typeof g || da.isFunction(g) || (g = {}),
        h === i && (g = this,
        h--); h < i; h++)
            if (null != (e = arguments[h]))
                for (d in e)
                    a = g[d],
                    c = e[d],
                    g !== c && (j && c && (da.isPlainObject(c) || (b = da.isArray(c))) ? (b ? (b = !1,
                    f = a && da.isArray(a) ? a : []) : f = a && da.isPlainObject(a) ? a : {},
                    g[d] = da.extend(j, f, c)) : void 0 !== c && (g[d] = c));
        return g
    }
    ,
    da.extend({
        expando: "jQuery" + ("1.11.3" + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function(a) {
            throw new Error(a)
        },
        noop: function() {},
        isFunction: function(a) {
            return "function" === da.type(a)
        },
        isArray: Array.isArray || function(a) {
            return "array" === da.type(a)
        }
        ,
        isWindow: function(a) {
            return null != a && a == a.window
        },
        isNumeric: function(a) {
            return !da.isArray(a) && a - parseFloat(a) + 1 >= 0
        },
        isEmptyObject: function(a) {
            var b;
            for (b in a)
                return !1;
            return !0
        },
        isPlainObject: function(a) {
            var b;
            if (!a || "object" !== da.type(a) || a.nodeType || da.isWindow(a))
                return !1;
            try {
                if (a.constructor && !ba.call(a, "constructor") && !ba.call(a.constructor.prototype, "isPrototypeOf"))
                    return !1
            } catch (a) {
                return !1
            }
            if (ca.ownLast)
                for (b in a)
                    return ba.call(a, b);
            for (b in a)
                ;
            return void 0 === b || ba.call(a, b)
        },
        type: function(a) {
            return null == a ? a + "" : "object" == typeof a || "function" == typeof a ? _[aa.call(a)] || "object" : typeof a
        },
        globalEval: function(b) {
            b && da.trim(b) && (a.execScript || function(b) {
                a.eval.call(a, b)
            }
            )(b)
        },
        camelCase: function(a) {
            return a.replace(/^-ms-/, "ms-").replace(/-([\da-z])/gi, ea)
        },
        nodeName: function(a, b) {
            return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase()
        },
        each: function(a, b, d) {
            var e, f = 0, g = a.length, h = c(a);
            if (d) {
                if (h)
                    for (; f < g && (e = b.apply(a[f], d),
                    e !== !1); f++)
                        ;
                else
                    for (f in a)
                        if (e = b.apply(a[f], d),
                        e === !1)
                            break
            } else if (h)
                for (; f < g && (e = b.call(a[f], f, a[f]),
                e !== !1); f++)
                    ;
            else
                for (f in a)
                    if (e = b.call(a[f], f, a[f]),
                    e === !1)
                        break;
            return a
        },
        trim: function(a) {
            return null == a ? "" : (a + "").replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "")
        },
        makeArray: function(a, b) {
            var d = b || [];
            return null != a && (c(Object(a)) ? da.merge(d, "string" == typeof a ? [a] : a) : Z.call(d, a)),
            d
        },
        inArray: function(a, b, c) {
            var d;
            if (b) {
                if ($)
                    return $.call(b, a, c);
                for (d = b.length,
                c = c ? c < 0 ? Math.max(0, d + c) : c : 0; c < d; c++)
                    if (c in b && b[c] === a)
                        return c
            }
            return -1
        },
        merge: function(a, b) {
            for (var c = +b.length, d = 0, e = a.length; d < c; )
                a[e++] = b[d++];
            if (c !== c)
                for (; void 0 !== b[d]; )
                    a[e++] = b[d++];
            return a.length = e,
            a
        },
        grep: function(a, b, c) {
            for (var d, e = [], f = 0, g = a.length, h = !c; f < g; f++)
                d = !b(a[f], f),
                d !== h && e.push(a[f]);
            return e
        },
        map: function(a, b, d) {
            var e, f = 0, g = a.length, h = c(a), i = [];
            if (h)
                for (; f < g; f++)
                    e = b(a[f], f, d),
                    null != e && i.push(e);
            else
                for (f in a)
                    e = b(a[f], f, d),
                    null != e && i.push(e);
            return Y.apply([], i)
        },
        guid: 1,
        proxy: function(a, b) {
            var c, d, e;
            if ("string" == typeof b && (e = a[b],
            b = a,
            a = e),
            da.isFunction(a))
                return c = X.call(arguments, 2),
                d = function() {
                    return a.apply(b || this, c.concat(X.call(arguments)))
                }
                ,
                d.guid = a.guid = a.guid || da.guid++,
                d
        },
        now: function() {
            return +new Date
        },
        support: ca
    }),
    da.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(a, b) {
        _["[object " + b + "]"] = b.toLowerCase()
    });
    var fa = function(a) {
        function b(a, b, c, d) {
            var e, f, g, h, i, j, l, n, o, p;
            if ((b ? b.ownerDocument || b : O) !== G && F(b),
            b = b || G,
            c = c || [],
            h = b.nodeType,
            "string" != typeof a || !a || 1 !== h && 9 !== h && 11 !== h)
                return c;
            if (!d && I) {
                if (11 !== h && (e = ra.exec(a)))
                    if (g = e[1]) {
                        if (9 === h) {
                            if (f = b.getElementById(g),
                            !f || !f.parentNode)
                                return c;
                            if (f.id === g)
                                return c.push(f),
                                c
                        } else if (b.ownerDocument && (f = b.ownerDocument.getElementById(g)) && M(b, f) && f.id === g)
                            return c.push(f),
                            c
                    } else {
                        if (e[2])
                            return Z.apply(c, b.getElementsByTagName(a)),
                            c;
                        if ((g = e[3]) && v.getElementsByClassName)
                            return Z.apply(c, b.getElementsByClassName(g)),
                            c
                    }
                if (v.qsa && (!J || !J.test(a))) {
                    if (n = l = N,
                    o = b,
                    p = 1 !== h && a,
                    1 === h && "object" !== b.nodeName.toLowerCase()) {
                        for (j = z(a),
                        (l = b.getAttribute("id")) ? n = l.replace(/'|\\/g, "\\$&") : b.setAttribute("id", n),
                        n = "[id='" + n + "'] ",
                        i = j.length; i--; )
                            j[i] = n + m(j[i]);
                        o = sa.test(a) && k(b.parentNode) || b,
                        p = j.join(",")
                    }
                    if (p)
                        try {
                            return Z.apply(c, o.querySelectorAll(p)),
                            c
                        } catch (a) {} finally {
                            l || b.removeAttribute("id")
                        }
                }
            }
            return B(a.replace(ha, "$1"), b, c, d)
        }
        function c() {
            function a(c, d) {
                return b.push(c + " ") > w.cacheLength && delete a[b.shift()],
                a[c + " "] = d
            }
            var b = [];
            return a
        }
        function d(a) {
            return a[N] = !0,
            a
        }
        function e(a) {
            var b = G.createElement("div");
            try {
                return !!a(b)
            } catch (a) {
                return !1
            } finally {
                b.parentNode && b.parentNode.removeChild(b),
                b = null
            }
        }
        function f(a, b) {
            for (var c = a.split("|"), d = a.length; d--; )
                w.attrHandle[c[d]] = b
        }
        function g(a, b) {
            var c = b && a
              , d = c && 1 === a.nodeType && 1 === b.nodeType && (~b.sourceIndex || 1 << 31) - (~a.sourceIndex || 1 << 31);
            if (d)
                return d;
            if (c)
                for (; c = c.nextSibling; )
                    if (c === b)
                        return -1;
            return a ? 1 : -1
        }
        function h(a) {
            return function(b) {
                return "input" === b.nodeName.toLowerCase() && b.type === a
            }
        }
        function i(a) {
            return function(b) {
                var c = b.nodeName.toLowerCase();
                return ("input" === c || "button" === c) && b.type === a
            }
        }
        function j(a) {
            return d(function(b) {
                return b = +b,
                d(function(c, d) {
                    for (var e, f = a([], c.length, b), g = f.length; g--; )
                        c[e = f[g]] && (c[e] = !(d[e] = c[e]))
                })
            })
        }
        function k(a) {
            return a && void 0 !== a.getElementsByTagName && a
        }
        function l() {}
        function m(a) {
            for (var b = 0, c = a.length, d = ""; b < c; b++)
                d += a[b].value;
            return d
        }
        function n(a, b, c) {
            var d = b.dir
              , e = c && "parentNode" === d
              , f = Q++;
            return b.first ? function(b, c, f) {
                for (; b = b[d]; )
                    if (1 === b.nodeType || e)
                        return a(b, c, f)
            }
            : function(b, c, g) {
                var h, i, j = [P, f];
                if (g) {
                    for (; b = b[d]; )
                        if ((1 === b.nodeType || e) && a(b, c, g))
                            return !0
                } else
                    for (; b = b[d]; )
                        if (1 === b.nodeType || e) {
                            if (i = b[N] || (b[N] = {}),
                            (h = i[d]) && h[0] === P && h[1] === f)
                                return j[2] = h[2];
                            if (i[d] = j,
                            j[2] = a(b, c, g))
                                return !0
                        }
            }
        }
        function o(a) {
            return a.length > 1 ? function(b, c, d) {
                for (var e = a.length; e--; )
                    if (!a[e](b, c, d))
                        return !1;
                return !0
            }
            : a[0]
        }
        function p(a, c, d) {
            for (var e = 0, f = c.length; e < f; e++)
                b(a, c[e], d);
            return d
        }
        function q(a, b, c, d, e) {
            for (var f, g = [], h = 0, i = a.length, j = null != b; h < i; h++)
                (f = a[h]) && (c && !c(f, d, e) || (g.push(f),
                j && b.push(h)));
            return g
        }
        function r(a, b, c, e, f, g) {
            return e && !e[N] && (e = r(e)),
            f && !f[N] && (f = r(f, g)),
            d(function(d, g, h, i) {
                var j, k, l, m = [], n = [], o = g.length, r = d || p(b || "*", h.nodeType ? [h] : h, []), s = !a || !d && b ? r : q(r, m, a, h, i), t = c ? f || (d ? a : o || e) ? [] : g : s;
                if (c && c(s, t, h, i),
                e)
                    for (j = q(t, n),
                    e(j, [], h, i),
                    k = j.length; k--; )
                        (l = j[k]) && (t[n[k]] = !(s[n[k]] = l));
                if (d) {
                    if (f || a) {
                        if (f) {
                            for (j = [],
                            k = t.length; k--; )
                                (l = t[k]) && j.push(s[k] = l);
                            f(null, t = [], j, i)
                        }
                        for (k = t.length; k--; )
                            (l = t[k]) && (j = f ? _(d, l) : m[k]) > -1 && (d[j] = !(g[j] = l))
                    }
                } else
                    t = q(t === g ? t.splice(o, t.length) : t),
                    f ? f(null, g, t, i) : Z.apply(g, t)
            })
        }
        function s(a) {
            for (var b, c, d, e = a.length, f = w.relative[a[0].type], g = f || w.relative[" "], h = f ? 1 : 0, i = n(function(a) {
                return a === b
            }, g, !0), j = n(function(a) {
                return _(b, a) > -1
            }, g, !0), k = [function(a, c, d) {
                var e = !f && (d || c !== C) || ((b = c).nodeType ? i(a, c, d) : j(a, c, d));
                return b = null,
                e
            }
            ]; h < e; h++)
                if (c = w.relative[a[h].type])
                    k = [n(o(k), c)];
                else {
                    if (c = w.filter[a[h].type].apply(null, a[h].matches),
                    c[N]) {
                        for (d = ++h; d < e && !w.relative[a[d].type]; d++)
                            ;
                        return r(h > 1 && o(k), h > 1 && m(a.slice(0, h - 1).concat({
                            value: " " === a[h - 2].type ? "*" : ""
                        })).replace(ha, "$1"), c, h < d && s(a.slice(h, d)), d < e && s(a = a.slice(d)), d < e && m(a))
                    }
                    k.push(c)
                }
            return o(k)
        }
        function t(a, c) {
            var e = c.length > 0
              , f = a.length > 0
              , g = function(d, g, h, i, j) {
                var k, l, m, n = 0, o = "0", p = d && [], r = [], s = C, t = d || f && w.find.TAG("*", j), u = P += null == s ? 1 : Math.random() || .1, v = t.length;
                for (j && (C = g !== G && g); o !== v && null != (k = t[o]); o++) {
                    if (f && k) {
                        for (l = 0; m = a[l++]; )
                            if (m(k, g, h)) {
                                i.push(k);
                                break
                            }
                        j && (P = u)
                    }
                    e && ((k = !m && k) && n--,
                    d && p.push(k))
                }
                if (n += o,
                e && o !== n) {
                    for (l = 0; m = c[l++]; )
                        m(p, r, g, h);
                    if (d) {
                        if (n > 0)
                            for (; o--; )
                                p[o] || r[o] || (r[o] = X.call(i));
                        r = q(r)
                    }
                    Z.apply(i, r),
                    j && !d && r.length > 0 && n + c.length > 1 && b.uniqueSort(i)
                }
                return j && (P = u,
                C = s),
                p
            };
            return e ? d(g) : g
        }
        var u, v, w, x, y, z, A, B, C, D, E, F, G, H, I, J, K, L, M, N = "sizzle" + 1 * new Date, O = a.document, P = 0, Q = 0, R = c(), S = c(), T = c(), U = function(a, b) {
            return a === b && (E = !0),
            0
        }, V = {}.hasOwnProperty, W = [], X = W.pop, Y = W.push, Z = W.push, $ = W.slice, _ = function(a, b) {
            for (var c = 0, d = a.length; c < d; c++)
                if (a[c] === b)
                    return c;
            return -1
        }, aa = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", ba = "[\\x20\\t\\r\\n\\f]", ca = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", da = ca.replace("w", "w#"), ea = "\\[" + ba + "*(" + ca + ")(?:" + ba + "*([*^$|!~]?=)" + ba + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + da + "))|)" + ba + "*\\]", fa = ":(" + ca + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + ea + ")*)|.*)\\)|)", ga = new RegExp(ba + "+","g"), ha = new RegExp("^" + ba + "+|((?:^|[^\\\\])(?:\\\\.)*)" + ba + "+$","g"), ia = new RegExp("^" + ba + "*," + ba + "*"), ja = new RegExp("^" + ba + "*([>+~]|" + ba + ")" + ba + "*"), ka = new RegExp("=" + ba + "*([^\\]'\"]*?)" + ba + "*\\]","g"), la = new RegExp(fa), ma = new RegExp("^" + da + "$"), na = {
            ID: new RegExp("^#(" + ca + ")"),
            CLASS: new RegExp("^\\.(" + ca + ")"),
            TAG: new RegExp("^(" + ca.replace("w", "w*") + ")"),
            ATTR: new RegExp("^" + ea),
            PSEUDO: new RegExp("^" + fa),
            CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + ba + "*(even|odd|(([+-]|)(\\d*)n|)" + ba + "*(?:([+-]|)" + ba + "*(\\d+)|))" + ba + "*\\)|)","i"),
            bool: new RegExp("^(?:" + aa + ")$","i"),
            needsContext: new RegExp("^" + ba + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + ba + "*((?:-\\d)?\\d*)" + ba + "*\\)|)(?=[^-]|$)","i")
        }, oa = /^(?:input|select|textarea|button)$/i, pa = /^h\d$/i, qa = /^[^{]+\{\s*\[native \w/, ra = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, sa = /[+~]/, ta = new RegExp("\\\\([\\da-f]{1,6}" + ba + "?|(" + ba + ")|.)","ig"), ua = function(a, b, c) {
            var d = "0x" + b - 65536;
            return d !== d || c ? b : d < 0 ? String.fromCharCode(d + 65536) : String.fromCharCode(d >> 10 | 55296, 1023 & d | 56320)
        }, va = function() {
            F()
        };
        try {
            Z.apply(W = $.call(O.childNodes), O.childNodes),
            W[O.childNodes.length].nodeType
        } catch (a) {
            Z = {
                apply: W.length ? function(a, b) {
                    Y.apply(a, $.call(b))
                }
                : function(a, b) {
                    for (var c = a.length, d = 0; a[c++] = b[d++]; )
                        ;
                    a.length = c - 1
                }
            }
        }
        v = b.support = {},
        y = b.isXML = function(a) {
            var b = a && (a.ownerDocument || a).documentElement;
            return !!b && "HTML" !== b.nodeName
        }
        ,
        F = b.setDocument = function(a) {
            var b, c, d = a ? a.ownerDocument || a : O;
            return d !== G && 9 === d.nodeType && d.documentElement ? (G = d,
            H = d.documentElement,
            c = d.defaultView,
            c && c !== c.top && (c.addEventListener ? c.addEventListener("unload", va, !1) : c.attachEvent && c.attachEvent("onunload", va)),
            I = !y(d),
            v.attributes = e(function(a) {
                return a.className = "i",
                !a.getAttribute("className")
            }),
            v.getElementsByTagName = e(function(a) {
                return a.appendChild(d.createComment("")),
                !a.getElementsByTagName("*").length
            }),
            v.getElementsByClassName = qa.test(d.getElementsByClassName),
            v.getById = e(function(a) {
                return H.appendChild(a).id = N,
                !d.getElementsByName || !d.getElementsByName(N).length
            }),
            v.getById ? (w.find.ID = function(a, b) {
                if (void 0 !== b.getElementById && I) {
                    var c = b.getElementById(a);
                    return c && c.parentNode ? [c] : []
                }
            }
            ,
            w.filter.ID = function(a) {
                var b = a.replace(ta, ua);
                return function(a) {
                    return a.getAttribute("id") === b
                }
            }
            ) : (delete w.find.ID,
            w.filter.ID = function(a) {
                var b = a.replace(ta, ua);
                return function(a) {
                    var c = void 0 !== a.getAttributeNode && a.getAttributeNode("id");
                    return c && c.value === b
                }
            }
            ),
            w.find.TAG = v.getElementsByTagName ? function(a, b) {
                return void 0 !== b.getElementsByTagName ? b.getElementsByTagName(a) : v.qsa ? b.querySelectorAll(a) : void 0
            }
            : function(a, b) {
                var c, d = [], e = 0, f = b.getElementsByTagName(a);
                if ("*" === a) {
                    for (; c = f[e++]; )
                        1 === c.nodeType && d.push(c);
                    return d
                }
                return f
            }
            ,
            w.find.CLASS = v.getElementsByClassName && function(a, b) {
                if (I)
                    return b.getElementsByClassName(a)
            }
            ,
            K = [],
            J = [],
            (v.qsa = qa.test(d.querySelectorAll)) && (e(function(a) {
                H.appendChild(a).innerHTML = "<a id='" + N + "'></a><select id='" + N + "-\f]' msallowcapture=''><option selected=''></option></select>",
                a.querySelectorAll("[msallowcapture^='']").length && J.push("[*^$]=" + ba + "*(?:''|\"\")"),
                a.querySelectorAll("[selected]").length || J.push("\\[" + ba + "*(?:value|" + aa + ")"),
                a.querySelectorAll("[id~=" + N + "-]").length || J.push("~="),
                a.querySelectorAll(":checked").length || J.push(":checked"),
                a.querySelectorAll("a#" + N + "+*").length || J.push(".#.+[+~]")
            }),
            e(function(a) {
                var b = d.createElement("input");
                b.setAttribute("type", "hidden"),
                a.appendChild(b).setAttribute("name", "D"),
                a.querySelectorAll("[name=d]").length && J.push("name" + ba + "*[*^$|!~]?="),
                a.querySelectorAll(":enabled").length || J.push(":enabled", ":disabled"),
                a.querySelectorAll("*,:x"),
                J.push(",.*:")
            })),
            (v.matchesSelector = qa.test(L = H.matches || H.webkitMatchesSelector || H.mozMatchesSelector || H.oMatchesSelector || H.msMatchesSelector)) && e(function(a) {
                v.disconnectedMatch = L.call(a, "div"),
                L.call(a, "[s!='']:x"),
                K.push("!=", fa)
            }),
            J = J.length && new RegExp(J.join("|")),
            K = K.length && new RegExp(K.join("|")),
            b = qa.test(H.compareDocumentPosition),
            M = b || qa.test(H.contains) ? function(a, b) {
                var c = 9 === a.nodeType ? a.documentElement : a
                  , d = b && b.parentNode;
                return a === d || !(!d || 1 !== d.nodeType || !(c.contains ? c.contains(d) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(d)))
            }
            : function(a, b) {
                if (b)
                    for (; b = b.parentNode; )
                        if (b === a)
                            return !0;
                return !1
            }
            ,
            U = b ? function(a, b) {
                if (a === b)
                    return E = !0,
                    0;
                var c = !a.compareDocumentPosition - !b.compareDocumentPosition;
                return c ? c : (c = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1,
                1 & c || !v.sortDetached && b.compareDocumentPosition(a) === c ? a === d || a.ownerDocument === O && M(O, a) ? -1 : b === d || b.ownerDocument === O && M(O, b) ? 1 : D ? _(D, a) - _(D, b) : 0 : 4 & c ? -1 : 1)
            }
            : function(a, b) {
                if (a === b)
                    return E = !0,
                    0;
                var c, e = 0, f = a.parentNode, h = b.parentNode, i = [a], j = [b];
                if (!f || !h)
                    return a === d ? -1 : b === d ? 1 : f ? -1 : h ? 1 : D ? _(D, a) - _(D, b) : 0;
                if (f === h)
                    return g(a, b);
                for (c = a; c = c.parentNode; )
                    i.unshift(c);
                for (c = b; c = c.parentNode; )
                    j.unshift(c);
                for (; i[e] === j[e]; )
                    e++;
                return e ? g(i[e], j[e]) : i[e] === O ? -1 : j[e] === O ? 1 : 0
            }
            ,
            d) : G
        }
        ,
        b.matches = function(a, c) {
            return b(a, null, null, c)
        }
        ,
        b.matchesSelector = function(a, c) {
            if ((a.ownerDocument || a) !== G && F(a),
            c = c.replace(ka, "='$1']"),
            v.matchesSelector && I && (!K || !K.test(c)) && (!J || !J.test(c)))
                try {
                    var d = L.call(a, c);
                    if (d || v.disconnectedMatch || a.document && 11 !== a.document.nodeType)
                        return d
                } catch (a) {}
            return b(c, G, null, [a]).length > 0
        }
        ,
        b.contains = function(a, b) {
            return (a.ownerDocument || a) !== G && F(a),
            M(a, b)
        }
        ,
        b.attr = function(a, b) {
            (a.ownerDocument || a) !== G && F(a);
            var c = w.attrHandle[b.toLowerCase()]
              , d = c && V.call(w.attrHandle, b.toLowerCase()) ? c(a, b, !I) : void 0;
            return void 0 !== d ? d : v.attributes || !I ? a.getAttribute(b) : (d = a.getAttributeNode(b)) && d.specified ? d.value : null
        }
        ,
        b.error = function(a) {
            throw new Error("Syntax error, unrecognized expression: " + a)
        }
        ,
        b.uniqueSort = function(a) {
            var b, c = [], d = 0, e = 0;
            if (E = !v.detectDuplicates,
            D = !v.sortStable && a.slice(0),
            a.sort(U),
            E) {
                for (; b = a[e++]; )
                    b === a[e] && (d = c.push(e));
                for (; d--; )
                    a.splice(c[d], 1)
            }
            return D = null,
            a
        }
        ,
        x = b.getText = function(a) {
            var b, c = "", d = 0, e = a.nodeType;
            if (e) {
                if (1 === e || 9 === e || 11 === e) {
                    if ("string" == typeof a.textContent)
                        return a.textContent;
                    for (a = a.firstChild; a; a = a.nextSibling)
                        c += x(a)
                } else if (3 === e || 4 === e)
                    return a.nodeValue
            } else
                for (; b = a[d++]; )
                    c += x(b);
            return c
        }
        ,
        w = b.selectors = {
            cacheLength: 50,
            createPseudo: d,
            match: na,
            attrHandle: {},
            find: {},
            relative: {
                ">": {
                    dir: "parentNode",
                    first: !0
                },
                " ": {
                    dir: "parentNode"
                },
                "+": {
                    dir: "previousSibling",
                    first: !0
                },
                "~": {
                    dir: "previousSibling"
                }
            },
            preFilter: {
                ATTR: function(a) {
                    return a[1] = a[1].replace(ta, ua),
                    a[3] = (a[3] || a[4] || a[5] || "").replace(ta, ua),
                    "~=" === a[2] && (a[3] = " " + a[3] + " "),
                    a.slice(0, 4)
                },
                CHILD: function(a) {
                    return a[1] = a[1].toLowerCase(),
                    "nth" === a[1].slice(0, 3) ? (a[3] || b.error(a[0]),
                    a[4] = +(a[4] ? a[5] + (a[6] || 1) : 2 * ("even" === a[3] || "odd" === a[3])),
                    a[5] = +(a[7] + a[8] || "odd" === a[3])) : a[3] && b.error(a[0]),
                    a
                },
                PSEUDO: function(a) {
                    var b, c = !a[6] && a[2];
                    return na.CHILD.test(a[0]) ? null : (a[3] ? a[2] = a[4] || a[5] || "" : c && la.test(c) && (b = z(c, !0)) && (b = c.indexOf(")", c.length - b) - c.length) && (a[0] = a[0].slice(0, b),
                    a[2] = c.slice(0, b)),
                    a.slice(0, 3))
                }
            },
            filter: {
                TAG: function(a) {
                    var b = a.replace(ta, ua).toLowerCase();
                    return "*" === a ? function() {
                        return !0
                    }
                    : function(a) {
                        return a.nodeName && a.nodeName.toLowerCase() === b
                    }
                },
                CLASS: function(a) {
                    var b = R[a + " "];
                    return b || (b = new RegExp("(^|" + ba + ")" + a + "(" + ba + "|$)")) && R(a, function(a) {
                        return b.test("string" == typeof a.className && a.className || void 0 !== a.getAttribute && a.getAttribute("class") || "")
                    })
                },
                ATTR: function(a, c, d) {
                    return function(e) {
                        var f = b.attr(e, a);
                        return null == f ? "!=" === c : !c || (f += "",
                        "=" === c ? f === d : "!=" === c ? f !== d : "^=" === c ? d && 0 === f.indexOf(d) : "*=" === c ? d && f.indexOf(d) > -1 : "$=" === c ? d && f.slice(-d.length) === d : "~=" === c ? (" " + f.replace(ga, " ") + " ").indexOf(d) > -1 : "|=" === c && (f === d || f.slice(0, d.length + 1) === d + "-"))
                    }
                },
                CHILD: function(a, b, c, d, e) {
                    var f = "nth" !== a.slice(0, 3)
                      , g = "last" !== a.slice(-4)
                      , h = "of-type" === b;
                    return 1 === d && 0 === e ? function(a) {
                        return !!a.parentNode
                    }
                    : function(b, c, i) {
                        var j, k, l, m, n, o, p = f !== g ? "nextSibling" : "previousSibling", q = b.parentNode, r = h && b.nodeName.toLowerCase(), s = !i && !h;
                        if (q) {
                            if (f) {
                                for (; p; ) {
                                    for (l = b; l = l[p]; )
                                        if (h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType)
                                            return !1;
                                    o = p = "only" === a && !o && "nextSibling"
                                }
                                return !0
                            }
                            if (o = [g ? q.firstChild : q.lastChild],
                            g && s) {
                                for (k = q[N] || (q[N] = {}),
                                j = k[a] || [],
                                n = j[0] === P && j[1],
                                m = j[0] === P && j[2],
                                l = n && q.childNodes[n]; l = ++n && l && l[p] || (m = n = 0) || o.pop(); )
                                    if (1 === l.nodeType && ++m && l === b) {
                                        k[a] = [P, n, m];
                                        break
                                    }
                            } else if (s && (j = (b[N] || (b[N] = {}))[a]) && j[0] === P)
                                m = j[1];
                            else
                                for (; (l = ++n && l && l[p] || (m = n = 0) || o.pop()) && ((h ? l.nodeName.toLowerCase() !== r : 1 !== l.nodeType) || !++m || (s && ((l[N] || (l[N] = {}))[a] = [P, m]),
                                l !== b)); )
                                    ;
                            return m -= e,
                            m === d || m % d === 0 && m / d >= 0
                        }
                    }
                },
                PSEUDO: function(a, c) {
                    var e, f = w.pseudos[a] || w.setFilters[a.toLowerCase()] || b.error("unsupported pseudo: " + a);
                    return f[N] ? f(c) : f.length > 1 ? (e = [a, a, "", c],
                    w.setFilters.hasOwnProperty(a.toLowerCase()) ? d(function(a, b) {
                        for (var d, e = f(a, c), g = e.length; g--; )
                            d = _(a, e[g]),
                            a[d] = !(b[d] = e[g])
                    }) : function(a) {
                        return f(a, 0, e)
                    }
                    ) : f
                }
            },
            pseudos: {
                not: d(function(a) {
                    var b = []
                      , c = []
                      , e = A(a.replace(ha, "$1"));
                    return e[N] ? d(function(a, b, c, d) {
                        for (var f, g = e(a, null, d, []), h = a.length; h--; )
                            (f = g[h]) && (a[h] = !(b[h] = f))
                    }) : function(a, d, f) {
                        return b[0] = a,
                        e(b, null, f, c),
                        b[0] = null,
                        !c.pop()
                    }
                }),
                has: d(function(a) {
                    return function(c) {
                        return b(a, c).length > 0
                    }
                }),
                contains: d(function(a) {
                    return a = a.replace(ta, ua),
                    function(b) {
                        return (b.textContent || b.innerText || x(b)).indexOf(a) > -1
                    }
                }),
                lang: d(function(a) {
                    return ma.test(a || "") || b.error("unsupported lang: " + a),
                    a = a.replace(ta, ua).toLowerCase(),
                    function(b) {
                        var c;
                        do
                            if (c = I ? b.lang : b.getAttribute("xml:lang") || b.getAttribute("lang"))
                                return c = c.toLowerCase(),
                                c === a || 0 === c.indexOf(a + "-");
                        while ((b = b.parentNode) && 1 === b.nodeType);return !1
                    }
                }),
                target: function(b) {
                    var c = a.location && a.location.hash;
                    return c && c.slice(1) === b.id
                },
                root: function(a) {
                    return a === H
                },
                focus: function(a) {
                    return a === G.activeElement && (!G.hasFocus || G.hasFocus()) && !!(a.type || a.href || ~a.tabIndex)
                },
                enabled: function(a) {
                    return a.disabled === !1
                },
                disabled: function(a) {
                    return a.disabled === !0
                },
                checked: function(a) {
                    var b = a.nodeName.toLowerCase();
                    return "input" === b && !!a.checked || "option" === b && !!a.selected
                },
                selected: function(a) {
                    return a.parentNode && a.parentNode.selectedIndex,
                    a.selected === !0
                },
                empty: function(a) {
                    for (a = a.firstChild; a; a = a.nextSibling)
                        if (a.nodeType < 6)
                            return !1;
                    return !0
                },
                parent: function(a) {
                    return !w.pseudos.empty(a)
                },
                header: function(a) {
                    return pa.test(a.nodeName)
                },
                input: function(a) {
                    return oa.test(a.nodeName)
                },
                button: function(a) {
                    var b = a.nodeName.toLowerCase();
                    return "input" === b && "button" === a.type || "button" === b
                },
                text: function(a) {
                    var b;
                    return "input" === a.nodeName.toLowerCase() && "text" === a.type && (null == (b = a.getAttribute("type")) || "text" === b.toLowerCase())
                },
                first: j(function() {
                    return [0]
                }),
                last: j(function(a, b) {
                    return [b - 1]
                }),
                eq: j(function(a, b, c) {
                    return [c < 0 ? c + b : c]
                }),
                even: j(function(a, b) {
                    for (var c = 0; c < b; c += 2)
                        a.push(c);
                    return a
                }),
                odd: j(function(a, b) {
                    for (var c = 1; c < b; c += 2)
                        a.push(c);
                    return a
                }),
                lt: j(function(a, b, c) {
                    for (var d = c < 0 ? c + b : c; --d >= 0; )
                        a.push(d);
                    return a
                }),
                gt: j(function(a, b, c) {
                    for (var d = c < 0 ? c + b : c; ++d < b; )
                        a.push(d);
                    return a
                })
            }
        },
        w.pseudos.nth = w.pseudos.eq;
        for (u in {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
        })
            w.pseudos[u] = h(u);
        for (u in {
            submit: !0,
            reset: !0
        })
            w.pseudos[u] = i(u);
        return l.prototype = w.filters = w.pseudos,
        w.setFilters = new l,
        z = b.tokenize = function(a, c) {
            var d, e, f, g, h, i, j, k = S[a + " "];
            if (k)
                return c ? 0 : k.slice(0);
            for (h = a,
            i = [],
            j = w.preFilter; h; ) {
                d && !(e = ia.exec(h)) || (e && (h = h.slice(e[0].length) || h),
                i.push(f = [])),
                d = !1,
                (e = ja.exec(h)) && (d = e.shift(),
                f.push({
                    value: d,
                    type: e[0].replace(ha, " ")
                }),
                h = h.slice(d.length));
                for (g in w.filter)
                    !(e = na[g].exec(h)) || j[g] && !(e = j[g](e)) || (d = e.shift(),
                    f.push({
                        value: d,
                        type: g,
                        matches: e
                    }),
                    h = h.slice(d.length));
                if (!d)
                    break
            }
            return c ? h.length : h ? b.error(a) : S(a, i).slice(0)
        }
        ,
        A = b.compile = function(a, b) {
            var c, d = [], e = [], f = T[a + " "];
            if (!f) {
                for (b || (b = z(a)),
                c = b.length; c--; )
                    f = s(b[c]),
                    f[N] ? d.push(f) : e.push(f);
                f = T(a, t(e, d)),
                f.selector = a
            }
            return f
        }
        ,
        B = b.select = function(a, b, c, d) {
            var e, f, g, h, i, j = "function" == typeof a && a, l = !d && z(a = j.selector || a);
            if (c = c || [],
            1 === l.length) {
                if (f = l[0] = l[0].slice(0),
                f.length > 2 && "ID" === (g = f[0]).type && v.getById && 9 === b.nodeType && I && w.relative[f[1].type]) {
                    if (b = (w.find.ID(g.matches[0].replace(ta, ua), b) || [])[0],
                    !b)
                        return c;
                    j && (b = b.parentNode),
                    a = a.slice(f.shift().value.length)
                }
                for (e = na.needsContext.test(a) ? 0 : f.length; e-- && (g = f[e],
                !w.relative[h = g.type]); )
                    if ((i = w.find[h]) && (d = i(g.matches[0].replace(ta, ua), sa.test(f[0].type) && k(b.parentNode) || b))) {
                        if (f.splice(e, 1),
                        a = d.length && m(f),
                        !a)
                            return Z.apply(c, d),
                            c;
                        break
                    }
            }
            return (j || A(a, l))(d, b, !I, c, sa.test(a) && k(b.parentNode) || b),
            c
        }
        ,
        v.sortStable = N.split("").sort(U).join("") === N,
        v.detectDuplicates = !!E,
        F(),
        v.sortDetached = e(function(a) {
            return 1 & a.compareDocumentPosition(G.createElement("div"))
        }),
        e(function(a) {
            return a.innerHTML = "<a href='#'></a>",
            "#" === a.firstChild.getAttribute("href")
        }) || f("type|href|height|width", function(a, b, c) {
            if (!c)
                return a.getAttribute(b, "type" === b.toLowerCase() ? 1 : 2)
        }),
        v.attributes && e(function(a) {
            return a.innerHTML = "<input/>",
            a.firstChild.setAttribute("value", ""),
            "" === a.firstChild.getAttribute("value")
        }) || f("value", function(a, b, c) {
            if (!c && "input" === a.nodeName.toLowerCase())
                return a.defaultValue
        }),
        e(function(a) {
            return null == a.getAttribute("disabled")
        }) || f(aa, function(a, b, c) {
            var d;
            if (!c)
                return a[b] === !0 ? b.toLowerCase() : (d = a.getAttributeNode(b)) && d.specified ? d.value : null
        }),
        b
    }(a);
    da.find = fa,
    da.expr = fa.selectors,
    da.expr[":"] = da.expr.pseudos,
    da.unique = fa.uniqueSort,
    da.text = fa.getText,
    da.isXMLDoc = fa.isXML,
    da.contains = fa.contains;
    var ga = da.expr.match.needsContext
      , ha = /^<(\w+)\s*\/?>(?:<\/\1>|)$/
      , ia = /^.[^:#\[\.,]*$/;
    da.filter = function(a, b, c) {
        var d = b[0];
        return c && (a = ":not(" + a + ")"),
        1 === b.length && 1 === d.nodeType ? da.find.matchesSelector(d, a) ? [d] : [] : da.find.matches(a, da.grep(b, function(a) {
            return 1 === a.nodeType
        }))
    }
    ,
    da.fn.extend({
        find: function(a) {
            var b, c = [], d = this, e = d.length;
            if ("string" != typeof a)
                return this.pushStack(da(a).filter(function() {
                    for (b = 0; b < e; b++)
                        if (da.contains(d[b], this))
                            return !0
                }));
            for (b = 0; b < e; b++)
                da.find(a, d[b], c);
            return c = this.pushStack(e > 1 ? da.unique(c) : c),
            c.selector = this.selector ? this.selector + " " + a : a,
            c
        },
        filter: function(a) {
            return this.pushStack(d(this, a || [], !1))
        },
        not: function(a) {
            return this.pushStack(d(this, a || [], !0))
        },
        is: function(a) {
            return !!d(this, "string" == typeof a && ga.test(a) ? da(a) : a || [], !1).length
        }
    });
    var ja, ka = a.document, la = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/;
    (da.fn.init = function(a, b) {
        var c, d;
        if (!a)
            return this;
        if ("string" == typeof a) {
            if (c = "<" === a.charAt(0) && ">" === a.charAt(a.length - 1) && a.length >= 3 ? [null, a, null] : la.exec(a),
            !c || !c[1] && b)
                return !b || b.jquery ? (b || ja).find(a) : this.constructor(b).find(a);
            if (c[1]) {
                if (b = b instanceof da ? b[0] : b,
                da.merge(this, da.parseHTML(c[1], b && b.nodeType ? b.ownerDocument || b : ka, !0)),
                ha.test(c[1]) && da.isPlainObject(b))
                    for (c in b)
                        da.isFunction(this[c]) ? this[c](b[c]) : this.attr(c, b[c]);
                return this
            }
            if (d = ka.getElementById(c[2]),
            d && d.parentNode) {
                if (d.id !== c[2])
                    return ja.find(a);
                this.length = 1,
                this[0] = d
            }
            return this.context = ka,
            this.selector = a,
            this
        }
        return a.nodeType ? (this.context = this[0] = a,
        this.length = 1,
        this) : da.isFunction(a) ? void 0 !== ja.ready ? ja.ready(a) : a(da) : (void 0 !== a.selector && (this.selector = a.selector,
        this.context = a.context),
        da.makeArray(a, this))
    }
    ).prototype = da.fn,
    ja = da(ka);
    var ma = /^(?:parents|prev(?:Until|All))/
      , na = {
        children: !0,
        contents: !0,
        next: !0,
        prev: !0
    };
    da.extend({
        dir: function(a, b, c) {
            for (var d = [], e = a[b]; e && 9 !== e.nodeType && (void 0 === c || 1 !== e.nodeType || !da(e).is(c)); )
                1 === e.nodeType && d.push(e),
                e = e[b];
            return d
        },
        sibling: function(a, b) {
            for (var c = []; a; a = a.nextSibling)
                1 === a.nodeType && a !== b && c.push(a);
            return c
        }
    }),
    da.fn.extend({
        has: function(a) {
            var b, c = da(a, this), d = c.length;
            return this.filter(function() {
                for (b = 0; b < d; b++)
                    if (da.contains(this, c[b]))
                        return !0
            })
        },
        closest: function(a, b) {
            for (var c, d = 0, e = this.length, f = [], g = ga.test(a) || "string" != typeof a ? da(a, b || this.context) : 0; d < e; d++)
                for (c = this[d]; c && c !== b; c = c.parentNode)
                    if (c.nodeType < 11 && (g ? g.index(c) > -1 : 1 === c.nodeType && da.find.matchesSelector(c, a))) {
                        f.push(c);
                        break
                    }
            return this.pushStack(f.length > 1 ? da.unique(f) : f)
        },
        index: function(a) {
            return a ? "string" == typeof a ? da.inArray(this[0], da(a)) : da.inArray(a.jquery ? a[0] : a, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function(a, b) {
            return this.pushStack(da.unique(da.merge(this.get(), da(a, b))))
        },
        addBack: function(a) {
            return this.add(null == a ? this.prevObject : this.prevObject.filter(a))
        }
    }),
    da.each({
        parent: function(a) {
            var b = a.parentNode;
            return b && 11 !== b.nodeType ? b : null
        },
        parents: function(a) {
            return da.dir(a, "parentNode")
        },
        parentsUntil: function(a, b, c) {
            return da.dir(a, "parentNode", c)
        },
        next: function(a) {
            return e(a, "nextSibling")
        },
        prev: function(a) {
            return e(a, "previousSibling")
        },
        nextAll: function(a) {
            return da.dir(a, "nextSibling")
        },
        prevAll: function(a) {
            return da.dir(a, "previousSibling")
        },
        nextUntil: function(a, b, c) {
            return da.dir(a, "nextSibling", c)
        },
        prevUntil: function(a, b, c) {
            return da.dir(a, "previousSibling", c)
        },
        siblings: function(a) {
            return da.sibling((a.parentNode || {}).firstChild, a)
        },
        children: function(a) {
            return da.sibling(a.firstChild)
        },
        contents: function(a) {
            return da.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : da.merge([], a.childNodes)
        }
    }, function(a, b) {
        da.fn[a] = function(c, d) {
            var e = da.map(this, b, c);
            return "Until" !== a.slice(-5) && (d = c),
            d && "string" == typeof d && (e = da.filter(d, e)),
            this.length > 1 && (na[a] || (e = da.unique(e)),
            ma.test(a) && (e = e.reverse())),
            this.pushStack(e)
        }
    });
    var oa = {};
    da.Callbacks = function(a) {
        a = "string" == typeof a ? oa[a] || f(a) : da.extend({}, a);
        var b, c, d, e, g, h, i = [], j = !a.once && [], k = function(f) {
            for (c = a.memory && f,
            d = !0,
            g = h || 0,
            h = 0,
            e = i.length,
            b = !0; i && g < e; g++)
                if (i[g].apply(f[0], f[1]) === !1 && a.stopOnFalse) {
                    c = !1;
                    break
                }
            b = !1,
            i && (j ? j.length && k(j.shift()) : c ? i = [] : l.disable())
        }, l = {
            add: function() {
                if (i) {
                    var d = i.length;
                    !function b(c) {
                        da.each(c, function(c, d) {
                            var e = da.type(d);
                            "function" === e ? a.unique && l.has(d) || i.push(d) : d && d.length && "string" !== e && b(d)
                        })
                    }(arguments),
                    b ? e = i.length : c && (h = d,
                    k(c))
                }
                return this
            },
            remove: function() {
                return i && da.each(arguments, function(a, c) {
                    for (var d; (d = da.inArray(c, i, d)) > -1; )
                        i.splice(d, 1),
                        b && (d <= e && e--,
                        d <= g && g--)
                }),
                this
            },
            has: function(a) {
                return a ? da.inArray(a, i) > -1 : !(!i || !i.length)
            },
            empty: function() {
                return i = [],
                e = 0,
                this
            },
            disable: function() {
                return i = j = c = void 0,
                this
            },
            disabled: function() {
                return !i
            },
            lock: function() {
                return j = void 0,
                c || l.disable(),
                this
            },
            locked: function() {
                return !j
            },
            fireWith: function(a, c) {
                return !i || d && !j || (c = c || [],
                c = [a, c.slice ? c.slice() : c],
                b ? j.push(c) : k(c)),
                this
            },
            fire: function() {
                return l.fireWith(this, arguments),
                this
            },
            fired: function() {
                return !!d
            }
        };
        return l
    }
    ,
    da.extend({
        Deferred: function(a) {
            var b = [["resolve", "done", da.Callbacks("once memory"), "resolved"], ["reject", "fail", da.Callbacks("once memory"), "rejected"], ["notify", "progress", da.Callbacks("memory")]]
              , c = "pending"
              , d = {
                state: function() {
                    return c
                },
                always: function() {
                    return e.done(arguments).fail(arguments),
                    this
                },
                then: function() {
                    var a = arguments;
                    return da.Deferred(function(c) {
                        da.each(b, function(b, f) {
                            var g = da.isFunction(a[b]) && a[b];
                            e[f[1]](function() {
                                var a = g && g.apply(this, arguments);
                                a && da.isFunction(a.promise) ? a.promise().done(c.resolve).fail(c.reject).progress(c.notify) : c[f[0] + "With"](this === d ? c.promise() : this, g ? [a] : arguments)
                            })
                        }),
                        a = null
                    }).promise()
                },
                promise: function(a) {
                    return null != a ? da.extend(a, d) : d
                }
            }
              , e = {};
            return d.pipe = d.then,
            da.each(b, function(a, f) {
                var g = f[2]
                  , h = f[3];
                d[f[1]] = g.add,
                h && g.add(function() {
                    c = h
                }, b[1 ^ a][2].disable, b[2][2].lock),
                e[f[0]] = function() {
                    return e[f[0] + "With"](this === e ? d : this, arguments),
                    this
                }
                ,
                e[f[0] + "With"] = g.fireWith
            }),
            d.promise(e),
            a && a.call(e, e),
            e
        },
        when: function(a) {
            var b, c, d, e = 0, f = X.call(arguments), g = f.length, h = 1 !== g || a && da.isFunction(a.promise) ? g : 0, i = 1 === h ? a : da.Deferred(), j = function(a, c, d) {
                return function(e) {
                    c[a] = this,
                    d[a] = arguments.length > 1 ? X.call(arguments) : e,
                    d === b ? i.notifyWith(c, d) : --h || i.resolveWith(c, d)
                }
            };
            if (g > 1)
                for (b = new Array(g),
                c = new Array(g),
                d = new Array(g); e < g; e++)
                    f[e] && da.isFunction(f[e].promise) ? f[e].promise().done(j(e, d, f)).fail(i.reject).progress(j(e, c, b)) : --h;
            return h || i.resolveWith(d, f),
            i.promise()
        }
    });
    var pa;
    da.fn.ready = function(a) {
        return da.ready.promise().done(a),
        this
    }
    ,
    da.extend({
        isReady: !1,
        readyWait: 1,
        holdReady: function(a) {
            a ? da.readyWait++ : da.ready(!0)
        },
        ready: function(a) {
            if (a === !0 ? !--da.readyWait : !da.isReady) {
                if (!ka.body)
                    return setTimeout(da.ready);
                da.isReady = !0,
                a !== !0 && --da.readyWait > 0 || (pa.resolveWith(ka, [da]),
                da.fn.triggerHandler && (da(ka).triggerHandler("ready"),
                da(ka).off("ready")))
            }
        }
    }),
    da.ready.promise = function(b) {
        if (!pa)
            if (pa = da.Deferred(),
            "complete" === ka.readyState)
                setTimeout(da.ready);
            else if (ka.addEventListener)
                ka.addEventListener("DOMContentLoaded", h, !1),
                a.addEventListener("load", h, !1);
            else {
                ka.attachEvent("onreadystatechange", h),
                a.attachEvent("onload", h);
                var c = !1;
                try {
                    c = null == a.frameElement && ka.documentElement
                } catch (a) {}
                c && c.doScroll && function a() {
                    if (!da.isReady) {
                        try {
                            c.doScroll("left")
                        } catch (b) {
                            return setTimeout(a, 50)
                        }
                        g(),
                        da.ready()
                    }
                }()
            }
        return pa.promise(b)
    }
    ;
    var qa, ra = "undefined";
    for (qa in da(ca))
        break;
    ca.ownLast = "0" !== qa,
    ca.inlineBlockNeedsLayout = !1,
    da(function() {
        var a, b, c, d;
        c = ka.getElementsByTagName("body")[0],
        c && c.style && (b = ka.createElement("div"),
        d = ka.createElement("div"),
        d.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px",
        c.appendChild(d).appendChild(b),
        void 0 !== b.style.zoom && (b.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1",
        ca.inlineBlockNeedsLayout = a = 3 === b.offsetWidth,
        a && (c.style.zoom = 1)),
        c.removeChild(d))
    }),
    function() {
        var a = ka.createElement("div");
        if (null == ca.deleteExpando) {
            ca.deleteExpando = !0;
            try {
                delete a.test
            } catch (a) {
                ca.deleteExpando = !1
            }
        }
        a = null
    }(),
    da.acceptData = function(a) {
        var b = da.noData[(a.nodeName + " ").toLowerCase()]
          , c = +a.nodeType || 1;
        return (1 === c || 9 === c) && (!b || b !== !0 && a.getAttribute("classid") === b)
    }
    ;
    var sa = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/;
    da.extend({
        cache: {},
        noData: {
            "applet ": !0,
            "embed ": !0,
            "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
        },
        hasData: function(a) {
            return a = a.nodeType ? da.cache[a[da.expando]] : a[da.expando],
            !!a && !j(a)
        },
        data: function(a, b, c) {
            return k(a, b, c)
        },
        removeData: function(a, b) {
            return l(a, b)
        },
        _data: function(a, b, c) {
            return k(a, b, c, !0)
        },
        _removeData: function(a, b) {
            return l(a, b, !0)
        }
    }),
    da.fn.extend({
        data: function(a, b) {
            var c, d, e, f = this[0], g = f && f.attributes;
            if (void 0 === a) {
                if (this.length && (e = da.data(f),
                1 === f.nodeType && !da._data(f, "parsedAttrs"))) {
                    for (c = g.length; c--; )
                        g[c] && (d = g[c].name,
                        0 === d.indexOf("data-") && (d = da.camelCase(d.slice(5)),
                        i(f, d, e[d])));
                    da._data(f, "parsedAttrs", !0)
                }
                return e
            }
            return "object" == typeof a ? this.each(function() {
                da.data(this, a)
            }) : arguments.length > 1 ? this.each(function() {
                da.data(this, a, b)
            }) : f ? i(f, a, da.data(f, a)) : void 0
        },
        removeData: function(a) {
            return this.each(function() {
                da.removeData(this, a)
            })
        }
    }),
    da.extend({
        queue: function(a, b, c) {
            var d;
            if (a)
                return b = (b || "fx") + "queue",
                d = da._data(a, b),
                c && (!d || da.isArray(c) ? d = da._data(a, b, da.makeArray(c)) : d.push(c)),
                d || []
        },
        dequeue: function(a, b) {
            b = b || "fx";
            var c = da.queue(a, b)
              , d = c.length
              , e = c.shift()
              , f = da._queueHooks(a, b)
              , g = function() {
                da.dequeue(a, b)
            };
            "inprogress" === e && (e = c.shift(),
            d--),
            e && ("fx" === b && c.unshift("inprogress"),
            delete f.stop,
            e.call(a, g, f)),
            !d && f && f.empty.fire()
        },
        _queueHooks: function(a, b) {
            var c = b + "queueHooks";
            return da._data(a, c) || da._data(a, c, {
                empty: da.Callbacks("once memory").add(function() {
                    da._removeData(a, b + "queue"),
                    da._removeData(a, c)
                })
            })
        }
    }),
    da.fn.extend({
        queue: function(a, b) {
            var c = 2;
            return "string" != typeof a && (b = a,
            a = "fx",
            c--),
            arguments.length < c ? da.queue(this[0], a) : void 0 === b ? this : this.each(function() {
                var c = da.queue(this, a, b);
                da._queueHooks(this, a),
                "fx" === a && "inprogress" !== c[0] && da.dequeue(this, a)
            })
        },
        dequeue: function(a) {
            return this.each(function() {
                da.dequeue(this, a)
            })
        },
        clearQueue: function(a) {
            return this.queue(a || "fx", [])
        },
        promise: function(a, b) {
            var c, d = 1, e = da.Deferred(), f = this, g = this.length, h = function() {
                --d || e.resolveWith(f, [f])
            };
            for ("string" != typeof a && (b = a,
            a = void 0),
            a = a || "fx"; g--; )
                c = da._data(f[g], a + "queueHooks"),
                c && c.empty && (d++,
                c.empty.add(h));
            return h(),
            e.promise(b)
        }
    });
    var ta = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source
      , ua = ["Top", "Right", "Bottom", "Left"]
      , va = function(a, b) {
        return a = b || a,
        "none" === da.css(a, "display") || !da.contains(a.ownerDocument, a)
    }
      , wa = da.access = function(a, b, c, d, e, f, g) {
        var h = 0
          , i = a.length
          , j = null == c;
        if ("object" === da.type(c)) {
            e = !0;
            for (h in c)
                da.access(a, b, h, c[h], !0, f, g)
        } else if (void 0 !== d && (e = !0,
        da.isFunction(d) || (g = !0),
        j && (g ? (b.call(a, d),
        b = null) : (j = b,
        b = function(a, b, c) {
            return j.call(da(a), c)
        }
        )),
        b))
            for (; h < i; h++)
                b(a[h], c, g ? d : d.call(a[h], h, b(a[h], c)));
        return e ? a : j ? b.call(a) : i ? b(a[0], c) : f
    }
      , xa = /^(?:checkbox|radio)$/i;
    !function() {
        var a = ka.createElement("input")
          , b = ka.createElement("div")
          , c = ka.createDocumentFragment();
        if (b.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",
        ca.leadingWhitespace = 3 === b.firstChild.nodeType,
        ca.tbody = !b.getElementsByTagName("tbody").length,
        ca.htmlSerialize = !!b.getElementsByTagName("link").length,
        ca.html5Clone = "<:nav></:nav>" !== ka.createElement("nav").cloneNode(!0).outerHTML,
        a.type = "checkbox",
        a.checked = !0,
        c.appendChild(a),
        ca.appendChecked = a.checked,
        b.innerHTML = "<textarea>x</textarea>",
        ca.noCloneChecked = !!b.cloneNode(!0).lastChild.defaultValue,
        c.appendChild(b),
        b.innerHTML = "<input type='radio' checked='checked' name='t'/>",
        ca.checkClone = b.cloneNode(!0).cloneNode(!0).lastChild.checked,
        ca.noCloneEvent = !0,
        b.attachEvent && (b.attachEvent("onclick", function() {
            ca.noCloneEvent = !1
        }),
        b.cloneNode(!0).click()),
        null == ca.deleteExpando) {
            ca.deleteExpando = !0;
            try {
                delete b.test
            } catch (a) {
                ca.deleteExpando = !1
            }
        }
    }(),
    function() {
        var b, c, d = ka.createElement("div");
        for (b in {
            submit: !0,
            change: !0,
            focusin: !0
        })
            c = "on" + b,
            (ca[b + "Bubbles"] = c in a) || (d.setAttribute(c, "t"),
            ca[b + "Bubbles"] = d.attributes[c].expando === !1);
        d = null
    }();
    var ya = /^(?:input|select|textarea)$/i
      , za = /^key/
      , Aa = /^(?:mouse|pointer|contextmenu)|click/
      , Ba = /^(?:focusinfocus|focusoutblur)$/
      , Ca = /^([^.]*)(?:\.(.+)|)$/;
    da.event = {
        global: {},
        add: function(a, b, c, d, e) {
            var f, g, h, i, j, k, l, m, n, o, p, q = da._data(a);
            if (q) {
                for (c.handler && (i = c,
                c = i.handler,
                e = i.selector),
                c.guid || (c.guid = da.guid++),
                (g = q.events) || (g = q.events = {}),
                (k = q.handle) || (k = q.handle = function(a) {
                    return void 0 === da || a && da.event.triggered === a.type ? void 0 : da.event.dispatch.apply(k.elem, arguments)
                }
                ,
                k.elem = a),
                b = (b || "").match(/\S+/g) || [""],
                h = b.length; h--; )
                    f = Ca.exec(b[h]) || [],
                    n = p = f[1],
                    o = (f[2] || "").split(".").sort(),
                    n && (j = da.event.special[n] || {},
                    n = (e ? j.delegateType : j.bindType) || n,
                    j = da.event.special[n] || {},
                    l = da.extend({
                        type: n,
                        origType: p,
                        data: d,
                        handler: c,
                        guid: c.guid,
                        selector: e,
                        needsContext: e && da.expr.match.needsContext.test(e),
                        namespace: o.join(".")
                    }, i),
                    (m = g[n]) || (m = g[n] = [],
                    m.delegateCount = 0,
                    j.setup && j.setup.call(a, d, o, k) !== !1 || (a.addEventListener ? a.addEventListener(n, k, !1) : a.attachEvent && a.attachEvent("on" + n, k))),
                    j.add && (j.add.call(a, l),
                    l.handler.guid || (l.handler.guid = c.guid)),
                    e ? m.splice(m.delegateCount++, 0, l) : m.push(l),
                    da.event.global[n] = !0);
                a = null
            }
        },
        remove: function(a, b, c, d, e) {
            var f, g, h, i, j, k, l, m, n, o, p, q = da.hasData(a) && da._data(a);
            if (q && (k = q.events)) {
                for (b = (b || "").match(/\S+/g) || [""],
                j = b.length; j--; )
                    if (h = Ca.exec(b[j]) || [],
                    n = p = h[1],
                    o = (h[2] || "").split(".").sort(),
                    n) {
                        for (l = da.event.special[n] || {},
                        n = (d ? l.delegateType : l.bindType) || n,
                        m = k[n] || [],
                        h = h[2] && new RegExp("(^|\\.)" + o.join("\\.(?:.*\\.|)") + "(\\.|$)"),
                        i = f = m.length; f--; )
                            g = m[f],
                            !e && p !== g.origType || c && c.guid !== g.guid || h && !h.test(g.namespace) || d && d !== g.selector && ("**" !== d || !g.selector) || (m.splice(f, 1),
                            g.selector && m.delegateCount--,
                            l.remove && l.remove.call(a, g));
                        i && !m.length && (l.teardown && l.teardown.call(a, o, q.handle) !== !1 || da.removeEvent(a, n, q.handle),
                        delete k[n])
                    } else
                        for (n in k)
                            da.event.remove(a, n + b[j], c, d, !0);
                da.isEmptyObject(k) && (delete q.handle,
                da._removeData(a, "events"))
            }
        },
        trigger: function(b, c, d, e) {
            var f, g, h, i, j, k, l, m = [d || ka], n = ba.call(b, "type") ? b.type : b, o = ba.call(b, "namespace") ? b.namespace.split(".") : [];
            if (h = k = d = d || ka,
            3 !== d.nodeType && 8 !== d.nodeType && !Ba.test(n + da.event.triggered) && (n.indexOf(".") >= 0 && (o = n.split("."),
            n = o.shift(),
            o.sort()),
            g = n.indexOf(":") < 0 && "on" + n,
            b = b[da.expando] ? b : new da.Event(n,"object" == typeof b && b),
            b.isTrigger = e ? 2 : 3,
            b.namespace = o.join("."),
            b.namespace_re = b.namespace ? new RegExp("(^|\\.)" + o.join("\\.(?:.*\\.|)") + "(\\.|$)") : null,
            b.result = void 0,
            b.target || (b.target = d),
            c = null == c ? [b] : da.makeArray(c, [b]),
            j = da.event.special[n] || {},
            e || !j.trigger || j.trigger.apply(d, c) !== !1)) {
                if (!e && !j.noBubble && !da.isWindow(d)) {
                    for (i = j.delegateType || n,
                    Ba.test(i + n) || (h = h.parentNode); h; h = h.parentNode)
                        m.push(h),
                        k = h;
                    k === (d.ownerDocument || ka) && m.push(k.defaultView || k.parentWindow || a)
                }
                for (l = 0; (h = m[l++]) && !b.isPropagationStopped(); )
                    b.type = l > 1 ? i : j.bindType || n,
                    f = (da._data(h, "events") || {})[b.type] && da._data(h, "handle"),
                    f && f.apply(h, c),
                    f = g && h[g],
                    f && f.apply && da.acceptData(h) && (b.result = f.apply(h, c),
                    b.result === !1 && b.preventDefault());
                if (b.type = n,
                !e && !b.isDefaultPrevented() && (!j._default || j._default.apply(m.pop(), c) === !1) && da.acceptData(d) && g && d[n] && !da.isWindow(d)) {
                    k = d[g],
                    k && (d[g] = null),
                    da.event.triggered = n;
                    try {
                        d[n]()
                    } catch (a) {}
                    da.event.triggered = void 0,
                    k && (d[g] = k)
                }
                return b.result
            }
        },
        dispatch: function(a) {
            a = da.event.fix(a);
            var b, c, d, e, f, g = [], h = X.call(arguments), i = (da._data(this, "events") || {})[a.type] || [], j = da.event.special[a.type] || {};
            if (h[0] = a,
            a.delegateTarget = this,
            !j.preDispatch || j.preDispatch.call(this, a) !== !1) {
                for (g = da.event.handlers.call(this, a, i),
                b = 0; (e = g[b++]) && !a.isPropagationStopped(); )
                    for (a.currentTarget = e.elem,
                    f = 0; (d = e.handlers[f++]) && !a.isImmediatePropagationStopped(); )
                        a.namespace_re && !a.namespace_re.test(d.namespace) || (a.handleObj = d,
                        a.data = d.data,
                        c = ((da.event.special[d.origType] || {}).handle || d.handler).apply(e.elem, h),
                        void 0 !== c && (a.result = c) === !1 && (a.preventDefault(),
                        a.stopPropagation()));
                return j.postDispatch && j.postDispatch.call(this, a),
                a.result
            }
        },
        handlers: function(a, b) {
            var c, d, e, f, g = [], h = b.delegateCount, i = a.target;
            if (h && i.nodeType && (!a.button || "click" !== a.type))
                for (; i != this; i = i.parentNode || this)
                    if (1 === i.nodeType && (i.disabled !== !0 || "click" !== a.type)) {
                        for (e = [],
                        f = 0; f < h; f++)
                            d = b[f],
                            c = d.selector + " ",
                            void 0 === e[c] && (e[c] = d.needsContext ? da(c, this).index(i) >= 0 : da.find(c, this, null, [i]).length),
                            e[c] && e.push(d);
                        e.length && g.push({
                            elem: i,
                            handlers: e
                        })
                    }
            return h < b.length && g.push({
                elem: this,
                handlers: b.slice(h)
            }),
            g
        },
        fix: function(a) {
            if (a[da.expando])
                return a;
            var b, c, d, e = a.type, f = a, g = this.fixHooks[e];
            for (g || (this.fixHooks[e] = g = Aa.test(e) ? this.mouseHooks : za.test(e) ? this.keyHooks : {}),
            d = g.props ? this.props.concat(g.props) : this.props,
            a = new da.Event(f),
            b = d.length; b--; )
                c = d[b],
                a[c] = f[c];
            return a.target || (a.target = f.srcElement || ka),
            3 === a.target.nodeType && (a.target = a.target.parentNode),
            a.metaKey = !!a.metaKey,
            g.filter ? g.filter(a, f) : a
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function(a, b) {
                return null == a.which && (a.which = null != b.charCode ? b.charCode : b.keyCode),
                a
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function(a, b) {
                var c, d, e, f = b.button, g = b.fromElement;
                return null == a.pageX && null != b.clientX && (d = a.target.ownerDocument || ka,
                e = d.documentElement,
                c = d.body,
                a.pageX = b.clientX + (e && e.scrollLeft || c && c.scrollLeft || 0) - (e && e.clientLeft || c && c.clientLeft || 0),
                a.pageY = b.clientY + (e && e.scrollTop || c && c.scrollTop || 0) - (e && e.clientTop || c && c.clientTop || 0)),
                !a.relatedTarget && g && (a.relatedTarget = g === a.target ? b.toElement : g),
                a.which || void 0 === f || (a.which = 1 & f ? 1 : 2 & f ? 3 : 4 & f ? 2 : 0),
                a
            }
        },
        special: {
            load: {
                noBubble: !0
            },
            focus: {
                trigger: function() {
                    if (this !== o() && this.focus)
                        try {
                            return this.focus(),
                            !1
                        } catch (a) {}
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function() {
                    if (this === o() && this.blur)
                        return this.blur(),
                        !1
                },
                delegateType: "focusout"
            },
            click: {
                trigger: function() {
                    if (da.nodeName(this, "input") && "checkbox" === this.type && this.click)
                        return this.click(),
                        !1
                },
                _default: function(a) {
                    return da.nodeName(a.target, "a")
                }
            },
            beforeunload: {
                postDispatch: function(a) {
                    void 0 !== a.result && a.originalEvent && (a.originalEvent.returnValue = a.result)
                }
            }
        },
        simulate: function(a, b, c, d) {
            var e = da.extend(new da.Event, c, {
                type: a,
                isSimulated: !0,
                originalEvent: {}
            });
            d ? da.event.trigger(e, null, b) : da.event.dispatch.call(b, e),
            e.isDefaultPrevented() && c.preventDefault()
        }
    },
    da.removeEvent = ka.removeEventListener ? function(a, b, c) {
        a.removeEventListener && a.removeEventListener(b, c, !1)
    }
    : function(a, b, c) {
        var d = "on" + b;
        a.detachEvent && (void 0 === a[d] && (a[d] = null),
        a.detachEvent(d, c))
    }
    ,
    da.Event = function(a, b) {
        return this instanceof da.Event ? (a && a.type ? (this.originalEvent = a,
        this.type = a.type,
        this.isDefaultPrevented = a.defaultPrevented || void 0 === a.defaultPrevented && a.returnValue === !1 ? m : n) : this.type = a,
        b && da.extend(this, b),
        this.timeStamp = a && a.timeStamp || da.now(),
        this[da.expando] = !0,
        void 0) : new da.Event(a,b)
    }
    ,
    da.Event.prototype = {
        isDefaultPrevented: n,
        isPropagationStopped: n,
        isImmediatePropagationStopped: n,
        preventDefault: function() {
            var a = this.originalEvent;
            this.isDefaultPrevented = m,
            a && (a.preventDefault ? a.preventDefault() : a.returnValue = !1)
        },
        stopPropagation: function() {
            var a = this.originalEvent;
            this.isPropagationStopped = m,
            a && (a.stopPropagation && a.stopPropagation(),
            a.cancelBubble = !0)
        },
        stopImmediatePropagation: function() {
            var a = this.originalEvent;
            this.isImmediatePropagationStopped = m,
            a && a.stopImmediatePropagation && a.stopImmediatePropagation(),
            this.stopPropagation()
        }
    },
    da.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function(a, b) {
        da.event.special[a] = {
            delegateType: b,
            bindType: b,
            handle: function(a) {
                var c, d = this, e = a.relatedTarget, f = a.handleObj;
                return e && (e === d || da.contains(d, e)) || (a.type = f.origType,
                c = f.handler.apply(this, arguments),
                a.type = b),
                c
            }
        }
    }),
    ca.submitBubbles || (da.event.special.submit = {
        setup: function() {
            return !da.nodeName(this, "form") && void da.event.add(this, "click._submit keypress._submit", function(a) {
                var b = a.target
                  , c = da.nodeName(b, "input") || da.nodeName(b, "button") ? b.form : void 0;
                c && !da._data(c, "submitBubbles") && (da.event.add(c, "submit._submit", function(a) {
                    a._submit_bubble = !0
                }),
                da._data(c, "submitBubbles", !0))
            })
        },
        postDispatch: function(a) {
            a._submit_bubble && (delete a._submit_bubble,
            this.parentNode && !a.isTrigger && da.event.simulate("submit", this.parentNode, a, !0))
        },
        teardown: function() {
            return !da.nodeName(this, "form") && void da.event.remove(this, "._submit")
        }
    }),
    ca.changeBubbles || (da.event.special.change = {
        setup: function() {
            return ya.test(this.nodeName) ? ("checkbox" !== this.type && "radio" !== this.type || (da.event.add(this, "propertychange._change", function(a) {
                "checked" === a.originalEvent.propertyName && (this._just_changed = !0)
            }),
            da.event.add(this, "click._change", function(a) {
                this._just_changed && !a.isTrigger && (this._just_changed = !1),
                da.event.simulate("change", this, a, !0)
            })),
            !1) : void da.event.add(this, "beforeactivate._change", function(a) {
                var b = a.target;
                ya.test(b.nodeName) && !da._data(b, "changeBubbles") && (da.event.add(b, "change._change", function(a) {
                    !this.parentNode || a.isSimulated || a.isTrigger || da.event.simulate("change", this.parentNode, a, !0)
                }),
                da._data(b, "changeBubbles", !0))
            })
        },
        handle: function(a) {
            var b = a.target;
            if (this !== b || a.isSimulated || a.isTrigger || "radio" !== b.type && "checkbox" !== b.type)
                return a.handleObj.handler.apply(this, arguments)
        },
        teardown: function() {
            return da.event.remove(this, "._change"),
            !ya.test(this.nodeName)
        }
    }),
    ca.focusinBubbles || da.each({
        focus: "focusin",
        blur: "focusout"
    }, function(a, b) {
        var c = function(a) {
            da.event.simulate(b, a.target, da.event.fix(a), !0)
        };
        da.event.special[b] = {
            setup: function() {
                var d = this.ownerDocument || this
                  , e = da._data(d, b);
                e || d.addEventListener(a, c, !0),
                da._data(d, b, (e || 0) + 1)
            },
            teardown: function() {
                var d = this.ownerDocument || this
                  , e = da._data(d, b) - 1;
                e ? da._data(d, b, e) : (d.removeEventListener(a, c, !0),
                da._removeData(d, b))
            }
        }
    }),
    da.fn.extend({
        on: function(a, b, c, d, e) {
            var f, g;
            if ("object" == typeof a) {
                "string" != typeof b && (c = c || b,
                b = void 0);
                for (f in a)
                    this.on(f, b, c, a[f], e);
                return this
            }
            if (null == c && null == d ? (d = b,
            c = b = void 0) : null == d && ("string" == typeof b ? (d = c,
            c = void 0) : (d = c,
            c = b,
            b = void 0)),
            d === !1)
                d = n;
            else if (!d)
                return this;
            return 1 === e && (g = d,
            d = function(a) {
                return da().off(a),
                g.apply(this, arguments)
            }
            ,
            d.guid = g.guid || (g.guid = da.guid++)),
            this.each(function() {
                da.event.add(this, a, d, c, b)
            })
        },
        one: function(a, b, c, d) {
            return this.on(a, b, c, d, 1)
        },
        off: function(a, b, c) {
            var d, e;
            if (a && a.preventDefault && a.handleObj)
                return d = a.handleObj,
                da(a.delegateTarget).off(d.namespace ? d.origType + "." + d.namespace : d.origType, d.selector, d.handler),
                this;
            if ("object" == typeof a) {
                for (e in a)
                    this.off(e, b, a[e]);
                return this
            }
            return b !== !1 && "function" != typeof b || (c = b,
            b = void 0),
            c === !1 && (c = n),
            this.each(function() {
                da.event.remove(this, a, c, b)
            })
        },
        trigger: function(a, b) {
            return this.each(function() {
                da.event.trigger(a, b, this)
            })
        },
        triggerHandler: function(a, b) {
            var c = this[0];
            if (c)
                return da.event.trigger(a, b, c, !0)
        }
    });
    var Da = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video"
      , Ea = new RegExp("<(?:" + Da + ")[\\s/>]","i")
      , Fa = /^\s+/
      , Ga = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi
      , Ha = /<([\w:]+)/
      , Ia = /<tbody/i
      , Ja = /<|&#?\w+;/
      , Ka = /<(?:script|style|link)/i
      , La = /checked\s*(?:[^=]|=\s*.checked.)/i
      , Ma = /^$|\/(?:java|ecma)script/i
      , Na = /^true\/(.*)/
      , Oa = {
        option: [1, "<select multiple='multiple'>", "</select>"],
        legend: [1, "<fieldset>", "</fieldset>"],
        area: [1, "<map>", "</map>"],
        param: [1, "<object>", "</object>"],
        thead: [1, "<table>", "</table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: ca.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
    }
      , Pa = p(ka)
      , Qa = Pa.appendChild(ka.createElement("div"));
    Oa.optgroup = Oa.option,
    Oa.tbody = Oa.tfoot = Oa.colgroup = Oa.caption = Oa.thead,
    Oa.th = Oa.td,
    da.extend({
        clone: function(a, b, c) {
            var d, e, f, g, h, i = da.contains(a.ownerDocument, a);
            if (ca.html5Clone || da.isXMLDoc(a) || !Ea.test("<" + a.nodeName + ">") ? f = a.cloneNode(!0) : (Qa.innerHTML = a.outerHTML,
            Qa.removeChild(f = Qa.firstChild)),
            !(ca.noCloneEvent && ca.noCloneChecked || 1 !== a.nodeType && 11 !== a.nodeType || da.isXMLDoc(a)))
                for (d = q(f),
                h = q(a),
                g = 0; null != (e = h[g]); ++g)
                    d[g] && x(e, d[g]);
            if (b)
                if (c)
                    for (h = h || q(a),
                    d = d || q(f),
                    g = 0; null != (e = h[g]); g++)
                        w(e, d[g]);
                else
                    w(a, f);
            return d = q(f, "script"),
            d.length > 0 && v(d, !i && q(a, "script")),
            d = h = e = null,
            f
        },
        buildFragment: function(a, b, c, d) {
            for (var e, f, g, h, i, j, k, l = a.length, m = p(b), n = [], o = 0; o < l; o++)
                if (f = a[o],
                f || 0 === f)
                    if ("object" === da.type(f))
                        da.merge(n, f.nodeType ? [f] : f);
                    else if (Ja.test(f)) {
                        for (h = h || m.appendChild(b.createElement("div")),
                        i = (Ha.exec(f) || ["", ""])[1].toLowerCase(),
                        k = Oa[i] || Oa._default,
                        h.innerHTML = k[1] + f.replace(Ga, "<$1></$2>") + k[2],
                        e = k[0]; e--; )
                            h = h.lastChild;
                        if (!ca.leadingWhitespace && Fa.test(f) && n.push(b.createTextNode(Fa.exec(f)[0])),
                        !ca.tbody)
                            for (f = "table" !== i || Ia.test(f) ? "<table>" !== k[1] || Ia.test(f) ? 0 : h : h.firstChild,
                            e = f && f.childNodes.length; e--; )
                                da.nodeName(j = f.childNodes[e], "tbody") && !j.childNodes.length && f.removeChild(j);
                        for (da.merge(n, h.childNodes),
                        h.textContent = ""; h.firstChild; )
                            h.removeChild(h.firstChild);
                        h = m.lastChild
                    } else
                        n.push(b.createTextNode(f));
            for (h && m.removeChild(h),
            ca.appendChecked || da.grep(q(n, "input"), r),
            o = 0; f = n[o++]; )
                if ((!d || da.inArray(f, d) === -1) && (g = da.contains(f.ownerDocument, f),
                h = q(m.appendChild(f), "script"),
                g && v(h),
                c))
                    for (e = 0; f = h[e++]; )
                        Ma.test(f.type || "") && c.push(f);
            return h = null,
            m
        },
        cleanData: function(a, b) {
            for (var c, d, e, f, g = 0, h = da.expando, i = da.cache, j = ca.deleteExpando, k = da.event.special; null != (c = a[g]); g++)
                if ((b || da.acceptData(c)) && (e = c[h],
                f = e && i[e])) {
                    if (f.events)
                        for (d in f.events)
                            k[d] ? da.event.remove(c, d) : da.removeEvent(c, d, f.handle);
                    i[e] && (delete i[e],
                    j ? delete c[h] : void 0 !== c.removeAttribute ? c.removeAttribute(h) : c[h] = null,
                    W.push(e))
                }
        }
    }),
    da.fn.extend({
        text: function(a) {
            return wa(this, function(a) {
                return void 0 === a ? da.text(this) : this.empty().append((this[0] && this[0].ownerDocument || ka).createTextNode(a))
            }, null, a, arguments.length)
        },
        append: function() {
            return this.domManip(arguments, function(a) {
                1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || s(this, a).appendChild(a)
            })
        },
        prepend: function() {
            return this.domManip(arguments, function(a) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var b = s(this, a);
                    b.insertBefore(a, b.firstChild)
                }
            })
        },
        before: function() {
            return this.domManip(arguments, function(a) {
                this.parentNode && this.parentNode.insertBefore(a, this)
            })
        },
        after: function() {
            return this.domManip(arguments, function(a) {
                this.parentNode && this.parentNode.insertBefore(a, this.nextSibling)
            })
        },
        remove: function(a, b) {
            for (var c, d = a ? da.filter(a, this) : this, e = 0; null != (c = d[e]); e++)
                b || 1 !== c.nodeType || da.cleanData(q(c)),
                c.parentNode && (b && da.contains(c.ownerDocument, c) && v(q(c, "script")),
                c.parentNode.removeChild(c));
            return this
        },
        empty: function() {
            for (var a, b = 0; null != (a = this[b]); b++) {
                for (1 === a.nodeType && da.cleanData(q(a, !1)); a.firstChild; )
                    a.removeChild(a.firstChild);
                a.options && da.nodeName(a, "select") && (a.options.length = 0)
            }
            return this
        },
        clone: function(a, b) {
            return a = null != a && a,
            b = null == b ? a : b,
            this.map(function() {
                return da.clone(this, a, b)
            })
        },
        html: function(a) {
            return wa(this, function(a) {
                var b = this[0] || {}
                  , c = 0
                  , d = this.length;
                if (void 0 === a)
                    return 1 === b.nodeType ? b.innerHTML.replace(/ jQuery\d+="(?:null|\d+)"/g, "") : void 0;
                if ("string" == typeof a && !Ka.test(a) && (ca.htmlSerialize || !Ea.test(a)) && (ca.leadingWhitespace || !Fa.test(a)) && !Oa[(Ha.exec(a) || ["", ""])[1].toLowerCase()]) {
                    a = a.replace(Ga, "<$1></$2>");
                    try {
                        for (; c < d; c++)
                            b = this[c] || {},
                            1 === b.nodeType && (da.cleanData(q(b, !1)),
                            b.innerHTML = a);
                        b = 0
                    } catch (a) {}
                }
                b && this.empty().append(a)
            }, null, a, arguments.length)
        },
        replaceWith: function() {
            var a = arguments[0];
            return this.domManip(arguments, function(b) {
                a = this.parentNode,
                da.cleanData(q(this)),
                a && a.replaceChild(b, this)
            }),
            a && (a.length || a.nodeType) ? this : this.remove()
        },
        detach: function(a) {
            return this.remove(a, !0)
        },
        domManip: function(a, b) {
            a = Y.apply([], a);
            var c, d, e, f, g, h, i = 0, j = this.length, k = this, l = j - 1, m = a[0], n = da.isFunction(m);
            if (n || j > 1 && "string" == typeof m && !ca.checkClone && La.test(m))
                return this.each(function(c) {
                    var d = k.eq(c);
                    n && (a[0] = m.call(this, c, d.html())),
                    d.domManip(a, b)
                });
            if (j && (h = da.buildFragment(a, this[0].ownerDocument, !1, this),
            c = h.firstChild,
            1 === h.childNodes.length && (h = c),
            c)) {
                for (f = da.map(q(h, "script"), t),
                e = f.length; i < j; i++)
                    d = h,
                    i !== l && (d = da.clone(d, !0, !0),
                    e && da.merge(f, q(d, "script"))),
                    b.call(this[i], d, i);
                if (e)
                    for (g = f[f.length - 1].ownerDocument,
                    da.map(f, u),
                    i = 0; i < e; i++)
                        d = f[i],
                        Ma.test(d.type || "") && !da._data(d, "globalEval") && da.contains(g, d) && (d.src ? da._evalUrl && da._evalUrl(d.src) : da.globalEval((d.text || d.textContent || d.innerHTML || "").replace(/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, "")));
                h = c = null
            }
            return this
        }
    }),
    da.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(a, b) {
        da.fn[a] = function(a) {
            for (var c, d = 0, e = [], f = da(a), g = f.length - 1; d <= g; d++)
                c = d === g ? this : this.clone(!0),
                da(f[d])[b](c),
                Z.apply(e, c.get());
            return this.pushStack(e)
        }
    });
    var Ra, Sa = {};
    !function() {
        var a;
        ca.shrinkWrapBlocks = function() {
            if (null != a)
                return a;
            a = !1;
            var b, c, d;
            return c = ka.getElementsByTagName("body")[0],
            c && c.style ? (b = ka.createElement("div"),
            d = ka.createElement("div"),
            d.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px",
            c.appendChild(d).appendChild(b),
            void 0 !== b.style.zoom && (b.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1",
            b.appendChild(ka.createElement("div")).style.width = "5px",
            a = 3 !== b.offsetWidth),
            c.removeChild(d),
            a) : void 0
        }
    }();
    var Ta, Ua, Va = /^margin/, Wa = new RegExp("^(" + ta + ")(?!px)[a-z%]+$","i"), Xa = /^(top|right|bottom|left)$/;
    a.getComputedStyle ? (Ta = function(b) {
        return b.ownerDocument.defaultView.opener ? b.ownerDocument.defaultView.getComputedStyle(b, null) : a.getComputedStyle(b, null)
    }
    ,
    Ua = function(a, b, c) {
        var d, e, f, g, h = a.style;
        return c = c || Ta(a),
        g = c ? c.getPropertyValue(b) || c[b] : void 0,
        c && ("" !== g || da.contains(a.ownerDocument, a) || (g = da.style(a, b)),
        Wa.test(g) && Va.test(b) && (d = h.width,
        e = h.minWidth,
        f = h.maxWidth,
        h.minWidth = h.maxWidth = h.width = g,
        g = c.width,
        h.width = d,
        h.minWidth = e,
        h.maxWidth = f)),
        void 0 === g ? g : g + ""
    }
    ) : ka.documentElement.currentStyle && (Ta = function(a) {
        return a.currentStyle
    }
    ,
    Ua = function(a, b, c) {
        var d, e, f, g, h = a.style;
        return c = c || Ta(a),
        g = c ? c[b] : void 0,
        null == g && h && h[b] && (g = h[b]),
        Wa.test(g) && !Xa.test(b) && (d = h.left,
        e = a.runtimeStyle,
        f = e && e.left,
        f && (e.left = a.currentStyle.left),
        h.left = "fontSize" === b ? "1em" : g,
        g = h.pixelLeft + "px",
        h.left = d,
        f && (e.left = f)),
        void 0 === g ? g : g + "" || "auto"
    }
    ),
    function() {
        function b() {
            var b, c, d, e;
            c = ka.getElementsByTagName("body")[0],
            c && c.style && (b = ka.createElement("div"),
            d = ka.createElement("div"),
            d.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px",
            c.appendChild(d).appendChild(b),
            b.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute",
            f = g = !1,
            i = !0,
            a.getComputedStyle && (f = "1%" !== (a.getComputedStyle(b, null) || {}).top,
            g = "4px" === (a.getComputedStyle(b, null) || {
                width: "4px"
            }).width,
            e = b.appendChild(ka.createElement("div")),
            e.style.cssText = b.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",
            e.style.marginRight = e.style.width = "0",
            b.style.width = "1px",
            i = !parseFloat((a.getComputedStyle(e, null) || {}).marginRight),
            b.removeChild(e)),
            b.innerHTML = "<table><tr><td></td><td>t</td></tr></table>",
            e = b.getElementsByTagName("td"),
            e[0].style.cssText = "margin:0;border:0;padding:0;display:none",
            h = 0 === e[0].offsetHeight,
            h && (e[0].style.display = "",
            e[1].style.display = "none",
            h = 0 === e[0].offsetHeight),
            c.removeChild(d))
        }
        var c, d, e, f, g, h, i;
        c = ka.createElement("div"),
        c.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",
        e = c.getElementsByTagName("a")[0],
        d = e && e.style,
        d && (d.cssText = "float:left;opacity:.5",
        ca.opacity = "0.5" === d.opacity,
        ca.cssFloat = !!d.cssFloat,
        c.style.backgroundClip = "content-box",
        c.cloneNode(!0).style.backgroundClip = "",
        ca.clearCloneStyle = "content-box" === c.style.backgroundClip,
        ca.boxSizing = "" === d.boxSizing || "" === d.MozBoxSizing || "" === d.WebkitBoxSizing,
        da.extend(ca, {
            reliableHiddenOffsets: function() {
                return null == h && b(),
                h
            },
            boxSizingReliable: function() {
                return null == g && b(),
                g
            },
            pixelPosition: function() {
                return null == f && b(),
                f
            },
            reliableMarginRight: function() {
                return null == i && b(),
                i
            }
        }))
    }(),
    da.swap = function(a, b, c, d) {
        var e, f, g = {};
        for (f in b)
            g[f] = a.style[f],
            a.style[f] = b[f];
        e = c.apply(a, d || []);
        for (f in b)
            a.style[f] = g[f];
        return e
    }
    ;
    var Ya = /alpha\([^)]*\)/i
      , Za = /opacity\s*=\s*([^)]*)/
      , $a = /^(none|table(?!-c[ea]).+)/
      , _a = new RegExp("^(" + ta + ")(.*)$","i")
      , ab = new RegExp("^([+-])=(" + ta + ")","i")
      , bb = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    }
      , cb = {
        letterSpacing: "0",
        fontWeight: "400"
    }
      , db = ["Webkit", "O", "Moz", "ms"];
    da.extend({
        cssHooks: {
            opacity: {
                get: function(a, b) {
                    if (b) {
                        var c = Ua(a, "opacity");
                        return "" === c ? "1" : c
                    }
                }
            }
        },
        cssNumber: {
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            float: ca.cssFloat ? "cssFloat" : "styleFloat"
        },
        style: function(a, b, c, d) {
            if (a && 3 !== a.nodeType && 8 !== a.nodeType && a.style) {
                var e, f, g, h = da.camelCase(b), i = a.style;
                if (b = da.cssProps[h] || (da.cssProps[h] = B(i, h)),
                g = da.cssHooks[b] || da.cssHooks[h],
                void 0 === c)
                    return g && "get"in g && void 0 !== (e = g.get(a, !1, d)) ? e : i[b];
                if (f = typeof c,
                "string" === f && (e = ab.exec(c)) && (c = (e[1] + 1) * e[2] + parseFloat(da.css(a, b)),
                f = "number"),
                null != c && c === c && ("number" !== f || da.cssNumber[h] || (c += "px"),
                ca.clearCloneStyle || "" !== c || 0 !== b.indexOf("background") || (i[b] = "inherit"),
                !(g && "set"in g && void 0 === (c = g.set(a, c, d)))))
                    try {
                        i[b] = c
                    } catch (a) {}
            }
        },
        css: function(a, b, c, d) {
            var e, f, g, h = da.camelCase(b);
            return b = da.cssProps[h] || (da.cssProps[h] = B(a.style, h)),
            g = da.cssHooks[b] || da.cssHooks[h],
            g && "get"in g && (f = g.get(a, !0, c)),
            void 0 === f && (f = Ua(a, b, d)),
            "normal" === f && b in cb && (f = cb[b]),
            "" === c || c ? (e = parseFloat(f),
            c === !0 || da.isNumeric(e) ? e || 0 : f) : f
        }
    }),
    da.each(["height", "width"], function(a, b) {
        da.cssHooks[b] = {
            get: function(a, c, d) {
                if (c)
                    return $a.test(da.css(a, "display")) && 0 === a.offsetWidth ? da.swap(a, bb, function() {
                        return F(a, b, d)
                    }) : F(a, b, d)
            },
            set: function(a, c, d) {
                var e = d && Ta(a);
                return D(a, c, d ? E(a, b, d, ca.boxSizing && "border-box" === da.css(a, "boxSizing", !1, e), e) : 0)
            }
        }
    }),
    ca.opacity || (da.cssHooks.opacity = {
        get: function(a, b) {
            return Za.test((b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : b ? "1" : ""
        },
        set: function(a, b) {
            var c = a.style
              , d = a.currentStyle
              , e = da.isNumeric(b) ? "alpha(opacity=" + 100 * b + ")" : ""
              , f = d && d.filter || c.filter || "";
            c.zoom = 1,
            (b >= 1 || "" === b) && "" === da.trim(f.replace(Ya, "")) && c.removeAttribute && (c.removeAttribute("filter"),
            "" === b || d && !d.filter) || (c.filter = Ya.test(f) ? f.replace(Ya, e) : f + " " + e)
        }
    }),
    da.cssHooks.marginRight = A(ca.reliableMarginRight, function(a, b) {
        if (b)
            return da.swap(a, {
                display: "inline-block"
            }, Ua, [a, "marginRight"])
    }),
    da.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(a, b) {
        da.cssHooks[a + b] = {
            expand: function(c) {
                for (var d = 0, e = {}, f = "string" == typeof c ? c.split(" ") : [c]; d < 4; d++)
                    e[a + ua[d] + b] = f[d] || f[d - 2] || f[0];
                return e
            }
        },
        Va.test(a) || (da.cssHooks[a + b].set = D)
    }),
    da.fn.extend({
        css: function(a, b) {
            return wa(this, function(a, b, c) {
                var d, e, f = {}, g = 0;
                if (da.isArray(b)) {
                    for (d = Ta(a),
                    e = b.length; g < e; g++)
                        f[b[g]] = da.css(a, b[g], !1, d);
                    return f
                }
                return void 0 !== c ? da.style(a, b, c) : da.css(a, b)
            }, a, b, arguments.length > 1)
        },
        show: function() {
            return C(this, !0)
        },
        hide: function() {
            return C(this)
        },
        toggle: function(a) {
            return "boolean" == typeof a ? a ? this.show() : this.hide() : this.each(function() {
                va(this) ? da(this).show() : da(this).hide()
            })
        }
    }),
    da.Tween = G,
    G.prototype = {
        constructor: G,
        init: function(a, b, c, d, e, f) {
            this.elem = a,
            this.prop = c,
            this.easing = e || "swing",
            this.options = b,
            this.start = this.now = this.cur(),
            this.end = d,
            this.unit = f || (da.cssNumber[c] ? "" : "px")
        },
        cur: function() {
            var a = G.propHooks[this.prop];
            return a && a.get ? a.get(this) : G.propHooks._default.get(this)
        },
        run: function(a) {
            var b, c = G.propHooks[this.prop];
            return this.options.duration ? this.pos = b = da.easing[this.easing](a, this.options.duration * a, 0, 1, this.options.duration) : this.pos = b = a,
            this.now = (this.end - this.start) * b + this.start,
            this.options.step && this.options.step.call(this.elem, this.now, this),
            c && c.set ? c.set(this) : G.propHooks._default.set(this),
            this
        }
    },
    G.prototype.init.prototype = G.prototype,
    G.propHooks = {
        _default: {
            get: function(a) {
                var b;
                return null == a.elem[a.prop] || a.elem.style && null != a.elem.style[a.prop] ? (b = da.css(a.elem, a.prop, ""),
                b && "auto" !== b ? b : 0) : a.elem[a.prop]
            },
            set: function(a) {
                da.fx.step[a.prop] ? da.fx.step[a.prop](a) : a.elem.style && (null != a.elem.style[da.cssProps[a.prop]] || da.cssHooks[a.prop]) ? da.style(a.elem, a.prop, a.now + a.unit) : a.elem[a.prop] = a.now
            }
        }
    },
    G.propHooks.scrollTop = G.propHooks.scrollLeft = {
        set: function(a) {
            a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now)
        }
    },
    da.easing = {
        linear: function(a) {
            return a
        },
        swing: function(a) {
            return .5 - Math.cos(a * Math.PI) / 2
        }
    },
    da.fx = G.prototype.init,
    da.fx.step = {};
    var eb, fb, gb = /^(?:toggle|show|hide)$/, hb = new RegExp("^(?:([+-])=|)(" + ta + ")([a-z%]*)$","i"), ib = /queueHooks$/, jb = [K], kb = {
        "*": [function(a, b) {
            var c = this.createTween(a, b)
              , d = c.cur()
              , e = hb.exec(b)
              , f = e && e[3] || (da.cssNumber[a] ? "" : "px")
              , g = (da.cssNumber[a] || "px" !== f && +d) && hb.exec(da.css(c.elem, a))
              , h = 1
              , i = 20;
            if (g && g[3] !== f) {
                f = f || g[3],
                e = e || [],
                g = +d || 1;
                do
                    h = h || ".5",
                    g /= h,
                    da.style(c.elem, a, g + f);
                while (h !== (h = c.cur() / d) && 1 !== h && --i)
            }
            return e && (g = c.start = +g || +d || 0,
            c.unit = f,
            c.end = e[1] ? g + (e[1] + 1) * e[2] : +e[2]),
            c
        }
        ]
    };
    da.Animation = da.extend(M, {
        tweener: function(a, b) {
            da.isFunction(a) ? (b = a,
            a = ["*"]) : a = a.split(" ");
            for (var c, d = 0, e = a.length; d < e; d++)
                c = a[d],
                kb[c] = kb[c] || [],
                kb[c].unshift(b)
        },
        prefilter: function(a, b) {
            b ? jb.unshift(a) : jb.push(a)
        }
    }),
    da.speed = function(a, b, c) {
        var d = a && "object" == typeof a ? da.extend({}, a) : {
            complete: c || !c && b || da.isFunction(a) && a,
            duration: a,
            easing: c && b || b && !da.isFunction(b) && b
        };
        return d.duration = da.fx.off ? 0 : "number" == typeof d.duration ? d.duration : d.duration in da.fx.speeds ? da.fx.speeds[d.duration] : da.fx.speeds._default,
        null != d.queue && d.queue !== !0 || (d.queue = "fx"),
        d.old = d.complete,
        d.complete = function() {
            da.isFunction(d.old) && d.old.call(this),
            d.queue && da.dequeue(this, d.queue)
        }
        ,
        d
    }
    ,
    da.fn.extend({
        fadeTo: function(a, b, c, d) {
            return this.filter(va).css("opacity", 0).show().end().animate({
                opacity: b
            }, a, c, d)
        },
        animate: function(a, b, c, d) {
            var e = da.isEmptyObject(a)
              , f = da.speed(b, c, d)
              , g = function() {
                var b = M(this, da.extend({}, a), f);
                (e || da._data(this, "finish")) && b.stop(!0)
            };
            return g.finish = g,
            e || f.queue === !1 ? this.each(g) : this.queue(f.queue, g)
        },
        stop: function(a, b, c) {
            var d = function(a) {
                var b = a.stop;
                delete a.stop,
                b(c)
            };
            return "string" != typeof a && (c = b,
            b = a,
            a = void 0),
            b && a !== !1 && this.queue(a || "fx", []),
            this.each(function() {
                var b = !0
                  , e = null != a && a + "queueHooks"
                  , f = da.timers
                  , g = da._data(this);
                if (e)
                    g[e] && g[e].stop && d(g[e]);
                else
                    for (e in g)
                        g[e] && g[e].stop && ib.test(e) && d(g[e]);
                for (e = f.length; e--; )
                    f[e].elem !== this || null != a && f[e].queue !== a || (f[e].anim.stop(c),
                    b = !1,
                    f.splice(e, 1));
                !b && c || da.dequeue(this, a)
            })
        },
        finish: function(a) {
            return a !== !1 && (a = a || "fx"),
            this.each(function() {
                var b, c = da._data(this), d = c[a + "queue"], e = c[a + "queueHooks"], f = da.timers, g = d ? d.length : 0;
                for (c.finish = !0,
                da.queue(this, a, []),
                e && e.stop && e.stop.call(this, !0),
                b = f.length; b--; )
                    f[b].elem === this && f[b].queue === a && (f[b].anim.stop(!0),
                    f.splice(b, 1));
                for (b = 0; b < g; b++)
                    d[b] && d[b].finish && d[b].finish.call(this);
                delete c.finish
            })
        }
    }),
    da.each(["toggle", "show", "hide"], function(a, b) {
        var c = da.fn[b];
        da.fn[b] = function(a, d, e) {
            return null == a || "boolean" == typeof a ? c.apply(this, arguments) : this.animate(I(b, !0), a, d, e)
        }
    }),
    da.each({
        slideDown: I("show"),
        slideUp: I("hide"),
        slideToggle: I("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(a, b) {
        da.fn[a] = function(a, c, d) {
            return this.animate(b, a, c, d)
        }
    }),
    da.timers = [],
    da.fx.tick = function() {
        var a, b = da.timers, c = 0;
        for (eb = da.now(); c < b.length; c++)
            a = b[c],
            a() || b[c] !== a || b.splice(c--, 1);
        b.length || da.fx.stop(),
        eb = void 0
    }
    ,
    da.fx.timer = function(a) {
        da.timers.push(a),
        a() ? da.fx.start() : da.timers.pop()
    }
    ,
    da.fx.interval = 13,
    da.fx.start = function() {
        fb || (fb = setInterval(da.fx.tick, da.fx.interval))
    }
    ,
    da.fx.stop = function() {
        clearInterval(fb),
        fb = null
    }
    ,
    da.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    },
    da.fn.delay = function(a, b) {
        return a = da.fx ? da.fx.speeds[a] || a : a,
        b = b || "fx",
        this.queue(b, function(b, c) {
            var d = setTimeout(b, a);
            c.stop = function() {
                clearTimeout(d)
            }
        })
    }
    ,
    function() {
        var a, b, c, d, e;
        b = ka.createElement("div"),
        b.setAttribute("className", "t"),
        b.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",
        d = b.getElementsByTagName("a")[0],
        c = ka.createElement("select"),
        e = c.appendChild(ka.createElement("option")),
        a = b.getElementsByTagName("input")[0],
        d.style.cssText = "top:1px",
        ca.getSetAttribute = "t" !== b.className,
        ca.style = /top/.test(d.getAttribute("style")),
        ca.hrefNormalized = "/a" === d.getAttribute("href"),
        ca.checkOn = !!a.value,
        ca.optSelected = e.selected,
        ca.enctype = !!ka.createElement("form").enctype,
        c.disabled = !0,
        ca.optDisabled = !e.disabled,
        a = ka.createElement("input"),
        a.setAttribute("value", ""),
        ca.input = "" === a.getAttribute("value"),
        a.value = "t",
        a.setAttribute("type", "radio"),
        ca.radioValue = "t" === a.value
    }(),
    da.fn.extend({
        val: function(a) {
            var b, c, d, e = this[0];
            return arguments.length ? (d = da.isFunction(a),
            this.each(function(c) {
                var e;
                1 === this.nodeType && (e = d ? a.call(this, c, da(this).val()) : a,
                null == e ? e = "" : "number" == typeof e ? e += "" : da.isArray(e) && (e = da.map(e, function(a) {
                    return null == a ? "" : a + ""
                })),
                b = da.valHooks[this.type] || da.valHooks[this.nodeName.toLowerCase()],
                b && "set"in b && void 0 !== b.set(this, e, "value") || (this.value = e))
            })) : e ? (b = da.valHooks[e.type] || da.valHooks[e.nodeName.toLowerCase()],
            b && "get"in b && void 0 !== (c = b.get(e, "value")) ? c : (c = e.value,
            "string" == typeof c ? c.replace(/\r/g, "") : null == c ? "" : c)) : void 0
        }
    }),
    da.extend({
        valHooks: {
            option: {
                get: function(a) {
                    var b = da.find.attr(a, "value");
                    return null != b ? b : da.trim(da.text(a))
                }
            },
            select: {
                get: function(a) {
                    for (var b, c, d = a.options, e = a.selectedIndex, f = "select-one" === a.type || e < 0, g = f ? null : [], h = f ? e + 1 : d.length, i = e < 0 ? h : f ? e : 0; i < h; i++)
                        if (c = d[i],
                        (c.selected || i === e) && (ca.optDisabled ? !c.disabled : null === c.getAttribute("disabled")) && (!c.parentNode.disabled || !da.nodeName(c.parentNode, "optgroup"))) {
                            if (b = da(c).val(),
                            f)
                                return b;
                            g.push(b)
                        }
                    return g
                },
                set: function(a, b) {
                    for (var c, d, e = a.options, f = da.makeArray(b), g = e.length; g--; )
                        if (d = e[g],
                        da.inArray(da.valHooks.option.get(d), f) >= 0)
                            try {
                                d.selected = c = !0
                            } catch (a) {
                                d.scrollHeight
                            }
                        else
                            d.selected = !1;
                    return c || (a.selectedIndex = -1),
                    e
                }
            }
        }
    }),
    da.each(["radio", "checkbox"], function() {
        da.valHooks[this] = {
            set: function(a, b) {
                if (da.isArray(b))
                    return a.checked = da.inArray(da(a).val(), b) >= 0
            }
        },
        ca.checkOn || (da.valHooks[this].get = function(a) {
            return null === a.getAttribute("value") ? "on" : a.value
        }
        )
    });
    var lb, mb, nb = da.expr.attrHandle, ob = /^(?:checked|selected)$/i, pb = ca.getSetAttribute, qb = ca.input;
    da.fn.extend({
        attr: function(a, b) {
            return wa(this, da.attr, a, b, arguments.length > 1)
        },
        removeAttr: function(a) {
            return this.each(function() {
                da.removeAttr(this, a)
            })
        }
    }),
    da.extend({
        attr: function(a, b, c) {
            var d, e, f = a.nodeType;
            if (a && 3 !== f && 8 !== f && 2 !== f)
                return void 0 === a.getAttribute ? da.prop(a, b, c) : (1 === f && da.isXMLDoc(a) || (b = b.toLowerCase(),
                d = da.attrHooks[b] || (da.expr.match.bool.test(b) ? mb : lb)),
                void 0 === c ? d && "get"in d && null !== (e = d.get(a, b)) ? e : (e = da.find.attr(a, b),
                null == e ? void 0 : e) : null !== c ? d && "set"in d && void 0 !== (e = d.set(a, c, b)) ? e : (a.setAttribute(b, c + ""),
                c) : void da.removeAttr(a, b))
        },
        removeAttr: function(a, b) {
            var c, d, e = 0, f = b && b.match(/\S+/g);
            if (f && 1 === a.nodeType)
                for (; c = f[e++]; )
                    d = da.propFix[c] || c,
                    da.expr.match.bool.test(c) ? qb && pb || !ob.test(c) ? a[d] = !1 : a[da.camelCase("default-" + c)] = a[d] = !1 : da.attr(a, c, ""),
                    a.removeAttribute(pb ? c : d)
        },
        attrHooks: {
            type: {
                set: function(a, b) {
                    if (!ca.radioValue && "radio" === b && da.nodeName(a, "input")) {
                        var c = a.value;
                        return a.setAttribute("type", b),
                        c && (a.value = c),
                        b
                    }
                }
            }
        }
    }),
    mb = {
        set: function(a, b, c) {
            return b === !1 ? da.removeAttr(a, c) : qb && pb || !ob.test(c) ? a.setAttribute(!pb && da.propFix[c] || c, c) : a[da.camelCase("default-" + c)] = a[c] = !0,
            c
        }
    },
    da.each(da.expr.match.bool.source.match(/\w+/g), function(a, b) {
        var c = nb[b] || da.find.attr;
        nb[b] = qb && pb || !ob.test(b) ? function(a, b, d) {
            var e, f;
            return d || (f = nb[b],
            nb[b] = e,
            e = null != c(a, b, d) ? b.toLowerCase() : null,
            nb[b] = f),
            e
        }
        : function(a, b, c) {
            if (!c)
                return a[da.camelCase("default-" + b)] ? b.toLowerCase() : null
        }
    }),
    qb && pb || (da.attrHooks.value = {
        set: function(a, b, c) {
            return da.nodeName(a, "input") ? void (a.defaultValue = b) : lb && lb.set(a, b, c)
        }
    }),
    pb || (lb = {
        set: function(a, b, c) {
            var d = a.getAttributeNode(c);
            if (d || a.setAttributeNode(d = a.ownerDocument.createAttribute(c)),
            d.value = b += "",
            "value" === c || b === a.getAttribute(c))
                return b
        }
    },
    nb.id = nb.name = nb.coords = function(a, b, c) {
        var d;
        if (!c)
            return (d = a.getAttributeNode(b)) && "" !== d.value ? d.value : null
    }
    ,
    da.valHooks.button = {
        get: function(a, b) {
            var c = a.getAttributeNode(b);
            if (c && c.specified)
                return c.value
        },
        set: lb.set
    },
    da.attrHooks.contenteditable = {
        set: function(a, b, c) {
            lb.set(a, "" !== b && b, c)
        }
    },
    da.each(["width", "height"], function(a, b) {
        da.attrHooks[b] = {
            set: function(a, c) {
                if ("" === c)
                    return a.setAttribute(b, "auto"),
                    c
            }
        }
    })),
    ca.style || (da.attrHooks.style = {
        get: function(a) {
            return a.style.cssText || void 0
        },
        set: function(a, b) {
            return a.style.cssText = b + ""
        }
    });
    var rb = /^(?:input|select|textarea|button|object)$/i
      , sb = /^(?:a|area)$/i;
    da.fn.extend({
        prop: function(a, b) {
            return wa(this, da.prop, a, b, arguments.length > 1)
        },
        removeProp: function(a) {
            return a = da.propFix[a] || a,
            this.each(function() {
                try {
                    this[a] = void 0,
                    delete this[a]
                } catch (a) {}
            })
        }
    }),
    da.extend({
        propFix: {
            for: "htmlFor",
            class: "className"
        },
        prop: function(a, b, c) {
            var d, e, f, g = a.nodeType;
            if (a && 3 !== g && 8 !== g && 2 !== g)
                return f = 1 !== g || !da.isXMLDoc(a),
                f && (b = da.propFix[b] || b,
                e = da.propHooks[b]),
                void 0 !== c ? e && "set"in e && void 0 !== (d = e.set(a, c, b)) ? d : a[b] = c : e && "get"in e && null !== (d = e.get(a, b)) ? d : a[b]
        },
        propHooks: {
            tabIndex: {
                get: function(a) {
                    var b = da.find.attr(a, "tabindex");
                    return b ? parseInt(b, 10) : rb.test(a.nodeName) || sb.test(a.nodeName) && a.href ? 0 : -1
                }
            }
        }
    }),
    ca.hrefNormalized || da.each(["href", "src"], function(a, b) {
        da.propHooks[b] = {
            get: function(a) {
                return a.getAttribute(b, 4)
            }
        }
    }),
    ca.optSelected || (da.propHooks.selected = {
        get: function(a) {
            var b = a.parentNode;
            return b && (b.selectedIndex,
            b.parentNode && b.parentNode.selectedIndex),
            null
        }
    }),
    da.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
        da.propFix[this.toLowerCase()] = this
    }),
    ca.enctype || (da.propFix.enctype = "encoding"),
    da.fn.extend({
        addClass: function(a) {
            var b, c, d, e, f, g, h = 0, i = this.length, j = "string" == typeof a && a;
            if (da.isFunction(a))
                return this.each(function(b) {
                    da(this).addClass(a.call(this, b, this.className))
                });
            if (j)
                for (b = (a || "").match(/\S+/g) || []; h < i; h++)
                    if (c = this[h],
                    d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(/[\t\r\n\f]/g, " ") : " ")) {
                        for (f = 0; e = b[f++]; )
                            d.indexOf(" " + e + " ") < 0 && (d += e + " ");
                        g = da.trim(d),
                        c.className !== g && (c.className = g)
                    }
            return this
        },
        removeClass: function(a) {
            var b, c, d, e, f, g, h = 0, i = this.length, j = 0 === arguments.length || "string" == typeof a && a;
            if (da.isFunction(a))
                return this.each(function(b) {
                    da(this).removeClass(a.call(this, b, this.className))
                });
            if (j)
                for (b = (a || "").match(/\S+/g) || []; h < i; h++)
                    if (c = this[h],
                    d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(/[\t\r\n\f]/g, " ") : "")) {
                        for (f = 0; e = b[f++]; )
                            for (; d.indexOf(" " + e + " ") >= 0; )
                                d = d.replace(" " + e + " ", " ");
                        g = a ? da.trim(d) : "",
                        c.className !== g && (c.className = g)
                    }
            return this
        },
        toggleClass: function(a, b) {
            var c = typeof a;
            return "boolean" == typeof b && "string" === c ? b ? this.addClass(a) : this.removeClass(a) : da.isFunction(a) ? this.each(function(c) {
                da(this).toggleClass(a.call(this, c, this.className, b), b)
            }) : this.each(function() {
                if ("string" === c)
                    for (var b, d = 0, e = da(this), f = a.match(/\S+/g) || []; b = f[d++]; )
                        e.hasClass(b) ? e.removeClass(b) : e.addClass(b);
                else
                    "undefined" !== c && "boolean" !== c || (this.className && da._data(this, "__className__", this.className),
                    this.className = this.className || a === !1 ? "" : da._data(this, "__className__") || "")
            })
        },
        hasClass: function(a) {
            for (var b = " " + a + " ", c = 0, d = this.length; c < d; c++)
                if (1 === this[c].nodeType && (" " + this[c].className + " ").replace(/[\t\r\n\f]/g, " ").indexOf(b) >= 0)
                    return !0;
            return !1
        }
    }),
    da.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(a, b) {
        da.fn[b] = function(a, c) {
            return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b)
        }
    }),
    da.fn.extend({
        hover: function(a, b) {
            return this.mouseenter(a).mouseleave(b || a)
        },
        bind: function(a, b, c) {
            return this.on(a, null, b, c)
        },
        unbind: function(a, b) {
            return this.off(a, null, b)
        },
        delegate: function(a, b, c, d) {
            return this.on(b, a, c, d)
        },
        undelegate: function(a, b, c) {
            return 1 === arguments.length ? this.off(a, "**") : this.off(b, a || "**", c)
        }
    });
    var tb = da.now()
      , ub = /\?/;
    da.parseJSON = function(b) {
        if (a.JSON && a.JSON.parse)
            return a.JSON.parse(b + "");
        var c, d = null, e = da.trim(b + "");
        return e && !da.trim(e.replace(/(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g, function(a, b, e, f) {
            return c && b && (d = 0),
            0 === d ? a : (c = e || b,
            d += !f - !e,
            "")
        })) ? Function("return " + e)() : da.error("Invalid JSON: " + b)
    }
    ,
    da.parseXML = function(b) {
        var c, d;
        if (!b || "string" != typeof b)
            return null;
        try {
            a.DOMParser ? (d = new DOMParser,
            c = d.parseFromString(b, "text/xml")) : (c = new ActiveXObject("Microsoft.XMLDOM"),
            c.async = "false",
            c.loadXML(b))
        } catch (a) {
            c = void 0
        }
        return c && c.documentElement && !c.getElementsByTagName("parsererror").length || da.error("Invalid XML: " + b),
        c
    }
    ;
    var vb, wb, xb = /([?&])_=[^&]*/, yb = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm, zb = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, Ab = /^(?:GET|HEAD)$/, Bb = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/, Cb = {}, Db = {}, Eb = "*/".concat("*");
    try {
        wb = location.href
    } catch (a) {
        wb = ka.createElement("a"),
        wb.href = "",
        wb = wb.href
    }
    vb = Bb.exec(wb.toLowerCase()) || [],
    da.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: wb,
            type: "GET",
            isLocal: zb.test(vb[1]),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": Eb,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": da.parseJSON,
                "text xml": da.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(a, b) {
            return b ? P(P(a, da.ajaxSettings), b) : P(da.ajaxSettings, a)
        },
        ajaxPrefilter: N(Cb),
        ajaxTransport: N(Db),
        ajax: function(a, b) {
            function c(a, b, c, d) {
                var e, k, r, s, u, w = b;
                2 !== t && (t = 2,
                h && clearTimeout(h),
                j = void 0,
                g = d || "",
                v.readyState = a > 0 ? 4 : 0,
                e = a >= 200 && a < 300 || 304 === a,
                c && (s = Q(l, v, c)),
                s = R(l, s, v, e),
                e ? (l.ifModified && (u = v.getResponseHeader("Last-Modified"),
                u && (da.lastModified[f] = u),
                u = v.getResponseHeader("etag"),
                u && (da.etag[f] = u)),
                204 === a || "HEAD" === l.type ? w = "nocontent" : 304 === a ? w = "notmodified" : (w = s.state,
                k = s.data,
                r = s.error,
                e = !r)) : (r = w,
                !a && w || (w = "error",
                a < 0 && (a = 0))),
                v.status = a,
                v.statusText = (b || w) + "",
                e ? o.resolveWith(m, [k, w, v]) : o.rejectWith(m, [v, w, r]),
                v.statusCode(q),
                q = void 0,
                i && n.trigger(e ? "ajaxSuccess" : "ajaxError", [v, l, e ? k : r]),
                p.fireWith(m, [v, w]),
                i && (n.trigger("ajaxComplete", [v, l]),
                --da.active || da.event.trigger("ajaxStop")))
            }
            "object" == typeof a && (b = a,
            a = void 0),
            b = b || {};
            var d, e, f, g, h, i, j, k, l = da.ajaxSetup({}, b), m = l.context || l, n = l.context && (m.nodeType || m.jquery) ? da(m) : da.event, o = da.Deferred(), p = da.Callbacks("once memory"), q = l.statusCode || {}, r = {}, s = {}, t = 0, u = "canceled", v = {
                readyState: 0,
                getResponseHeader: function(a) {
                    var b;
                    if (2 === t) {
                        if (!k)
                            for (k = {}; b = yb.exec(g); )
                                k[b[1].toLowerCase()] = b[2];
                        b = k[a.toLowerCase()]
                    }
                    return null == b ? null : b
                },
                getAllResponseHeaders: function() {
                    return 2 === t ? g : null
                },
                setRequestHeader: function(a, b) {
                    var c = a.toLowerCase();
                    return t || (a = s[c] = s[c] || a,
                    r[a] = b),
                    this
                },
                overrideMimeType: function(a) {
                    return t || (l.mimeType = a),
                    this
                },
                statusCode: function(a) {
                    var b;
                    if (a)
                        if (t < 2)
                            for (b in a)
                                q[b] = [q[b], a[b]];
                        else
                            v.always(a[v.status]);
                    return this
                },
                abort: function(a) {
                    var b = a || u;
                    return j && j.abort(b),
                    c(0, b),
                    this
                }
            };
            if (o.promise(v).complete = p.add,
            v.success = v.done,
            v.error = v.fail,
            l.url = ((a || l.url || wb) + "").replace(/#.*$/, "").replace(/^\/\//, vb[1] + "//"),
            l.type = b.method || b.type || l.method || l.type,
            l.dataTypes = da.trim(l.dataType || "*").toLowerCase().match(/\S+/g) || [""],
            null == l.crossDomain && (d = Bb.exec(l.url.toLowerCase()),
            l.crossDomain = !(!d || d[1] === vb[1] && d[2] === vb[2] && (d[3] || ("http:" === d[1] ? "80" : "443")) === (vb[3] || ("http:" === vb[1] ? "80" : "443")))),
            l.data && l.processData && "string" != typeof l.data && (l.data = da.param(l.data, l.traditional)),
            O(Cb, l, b, v),
            2 === t)
                return v;
            i = da.event && l.global,
            i && 0 === da.active++ && da.event.trigger("ajaxStart"),
            l.type = l.type.toUpperCase(),
            l.hasContent = !Ab.test(l.type),
            f = l.url,
            l.hasContent || (l.data && (f = l.url += (ub.test(f) ? "&" : "?") + l.data,
            delete l.data),
            l.cache === !1 && (l.url = xb.test(f) ? f.replace(xb, "$1_=" + tb++) : f + (ub.test(f) ? "&" : "?") + "_=" + tb++)),
            l.ifModified && (da.lastModified[f] && v.setRequestHeader("If-Modified-Since", da.lastModified[f]),
            da.etag[f] && v.setRequestHeader("If-None-Match", da.etag[f])),
            (l.data && l.hasContent && l.contentType !== !1 || b.contentType) && v.setRequestHeader("Content-Type", l.contentType),
            v.setRequestHeader("Accept", l.dataTypes[0] && l.accepts[l.dataTypes[0]] ? l.accepts[l.dataTypes[0]] + ("*" !== l.dataTypes[0] ? ", " + Eb + "; q=0.01" : "") : l.accepts["*"]);
            for (e in l.headers)
                v.setRequestHeader(e, l.headers[e]);
            if (l.beforeSend && (l.beforeSend.call(m, v, l) === !1 || 2 === t))
                return v.abort();
            u = "abort";
            for (e in {
                success: 1,
                error: 1,
                complete: 1
            })
                v[e](l[e]);
            if (j = O(Db, l, b, v)) {
                v.readyState = 1,
                i && n.trigger("ajaxSend", [v, l]),
                l.async && l.timeout > 0 && (h = setTimeout(function() {
                    v.abort("timeout")
                }, l.timeout));
                try {
                    t = 1,
                    j.send(r, c)
                } catch (a) {
                    if (!(t < 2))
                        throw a;
                    c(-1, a)
                }
            } else
                c(-1, "No Transport");
            return v
        },
        getJSON: function(a, b, c) {
            return da.get(a, b, c, "json")
        },
        getScript: function(a, b) {
            return da.get(a, void 0, b, "script")
        }
    }),
    da.each(["get", "post"], function(a, b) {
        da[b] = function(a, c, d, e) {
            return da.isFunction(c) && (e = e || d,
            d = c,
            c = void 0),
            da.ajax({
                url: a,
                type: b,
                dataType: e,
                data: c,
                success: d
            })
        }
    }),
    da._evalUrl = function(a) {
        return da.ajax({
            url: a,
            type: "GET",
            dataType: "script",
            async: !1,
            global: !1,
            throws: !0
        })
    }
    ,
    da.fn.extend({
        wrapAll: function(a) {
            if (da.isFunction(a))
                return this.each(function(b) {
                    da(this).wrapAll(a.call(this, b))
                });
            if (this[0]) {
                var b = da(a, this[0].ownerDocument).eq(0).clone(!0);
                this[0].parentNode && b.insertBefore(this[0]),
                b.map(function() {
                    for (var a = this; a.firstChild && 1 === a.firstChild.nodeType; )
                        a = a.firstChild;
                    return a
                }).append(this)
            }
            return this
        },
        wrapInner: function(a) {
            return da.isFunction(a) ? this.each(function(b) {
                da(this).wrapInner(a.call(this, b))
            }) : this.each(function() {
                var b = da(this)
                  , c = b.contents();
                c.length ? c.wrapAll(a) : b.append(a)
            })
        },
        wrap: function(a) {
            var b = da.isFunction(a);
            return this.each(function(c) {
                da(this).wrapAll(b ? a.call(this, c) : a)
            })
        },
        unwrap: function() {
            return this.parent().each(function() {
                da.nodeName(this, "body") || da(this).replaceWith(this.childNodes)
            }).end()
        }
    }),
    da.expr.filters.hidden = function(a) {
        return a.offsetWidth <= 0 && a.offsetHeight <= 0 || !ca.reliableHiddenOffsets() && "none" === (a.style && a.style.display || da.css(a, "display"))
    }
    ,
    da.expr.filters.visible = function(a) {
        return !da.expr.filters.hidden(a)
    }
    ;
    var Fb = /\[\]$/
      , Gb = /^(?:submit|button|image|reset|file)$/i
      , Hb = /^(?:input|select|textarea|keygen)/i;
    da.param = function(a, b) {
        var c, d = [], e = function(a, b) {
            b = da.isFunction(b) ? b() : null == b ? "" : b,
            d[d.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b)
        };
        if (void 0 === b && (b = da.ajaxSettings && da.ajaxSettings.traditional),
        da.isArray(a) || a.jquery && !da.isPlainObject(a))
            da.each(a, function() {
                e(this.name, this.value)
            });
        else
            for (c in a)
                S(c, a[c], b, e);
        return d.join("&").replace(/%20/g, "+")
    }
    ,
    da.fn.extend({
        serialize: function() {
            return da.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                var a = da.prop(this, "elements");
                return a ? da.makeArray(a) : this
            }).filter(function() {
                var a = this.type;
                return this.name && !da(this).is(":disabled") && Hb.test(this.nodeName) && !Gb.test(a) && (this.checked || !xa.test(a))
            }).map(function(a, b) {
                var c = da(this).val();
                return null == c ? null : da.isArray(c) ? da.map(c, function(a) {
                    return {
                        name: b.name,
                        value: a.replace(/\r?\n/g, "\r\n")
                    }
                }) : {
                    name: b.name,
                    value: c.replace(/\r?\n/g, "\r\n")
                }
            }).get()
        }
    }),
    da.ajaxSettings.xhr = void 0 !== a.ActiveXObject ? function() {
        return !this.isLocal && /^(get|post|head|put|delete|options)$/i.test(this.type) && T() || U()
    }
    : T;
    var Ib = 0
      , Jb = {}
      , Kb = da.ajaxSettings.xhr();
    a.attachEvent && a.attachEvent("onunload", function() {
        for (var a in Jb)
            Jb[a](void 0, !0)
    }),
    ca.cors = !!Kb && "withCredentials"in Kb,
    Kb = ca.ajax = !!Kb,
    Kb && da.ajaxTransport(function(a) {
        if (!a.crossDomain || ca.cors) {
            var b;
            return {
                send: function(c, d) {
                    var e, f = a.xhr(), g = ++Ib;
                    if (f.open(a.type, a.url, a.async, a.username, a.password),
                    a.xhrFields)
                        for (e in a.xhrFields)
                            f[e] = a.xhrFields[e];
                    a.mimeType && f.overrideMimeType && f.overrideMimeType(a.mimeType),
                    a.crossDomain || c["X-Requested-With"] || (c["X-Requested-With"] = "XMLHttpRequest");
                    for (e in c)
                        void 0 !== c[e] && f.setRequestHeader(e, c[e] + "");
                    f.send(a.hasContent && a.data || null),
                    b = function(c, e) {
                        var h, i, j;
                        if (b && (e || 4 === f.readyState))
                            if (delete Jb[g],
                            b = void 0,
                            f.onreadystatechange = da.noop,
                            e)
                                4 !== f.readyState && f.abort();
                            else {
                                j = {},
                                h = f.status,
                                "string" == typeof f.responseText && (j.text = f.responseText);
                                try {
                                    i = f.statusText
                                } catch (a) {
                                    i = ""
                                }
                                h || !a.isLocal || a.crossDomain ? 1223 === h && (h = 204) : h = j.text ? 200 : 404
                            }
                        j && d(h, i, j, f.getAllResponseHeaders())
                    }
                    ,
                    a.async ? 4 === f.readyState ? setTimeout(b) : f.onreadystatechange = Jb[g] = b : b()
                },
                abort: function() {
                    b && b(void 0, !0)
                }
            }
        }
    }),
    da.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /(?:java|ecma)script/
        },
        converters: {
            "text script": function(a) {
                return da.globalEval(a),
                a
            }
        }
    }),
    da.ajaxPrefilter("script", function(a) {
        void 0 === a.cache && (a.cache = !1),
        a.crossDomain && (a.type = "GET",
        a.global = !1)
    }),
    da.ajaxTransport("script", function(a) {
        if (a.crossDomain) {
            var b, c = ka.head || da("head")[0] || ka.documentElement;
            return {
                send: function(d, e) {
                    b = ka.createElement("script"),
                    b.async = !0,
                    a.scriptCharset && (b.charset = a.scriptCharset),
                    b.src = a.url,
                    b.onload = b.onreadystatechange = function(a, c) {
                        (c || !b.readyState || /loaded|complete/.test(b.readyState)) && (b.onload = b.onreadystatechange = null,
                        b.parentNode && b.parentNode.removeChild(b),
                        b = null,
                        c || e(200, "success"))
                    }
                    ,
                    c.insertBefore(b, c.firstChild)
                },
                abort: function() {
                    b && b.onload(void 0, !0)
                }
            }
        }
    });
    var Lb = []
      , Mb = /(=)\?(?=&|$)|\?\?/;
    da.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var a = Lb.pop() || da.expando + "_" + tb++;
            return this[a] = !0,
            a
        }
    }),
    da.ajaxPrefilter("json jsonp", function(b, c, d) {
        var e, f, g, h = b.jsonp !== !1 && (Mb.test(b.url) ? "url" : "string" == typeof b.data && !(b.contentType || "").indexOf("application/x-www-form-urlencoded") && Mb.test(b.data) && "data");
        if (h || "jsonp" === b.dataTypes[0])
            return e = b.jsonpCallback = da.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback,
            h ? b[h] = b[h].replace(Mb, "$1" + e) : b.jsonp !== !1 && (b.url += (ub.test(b.url) ? "&" : "?") + b.jsonp + "=" + e),
            b.converters["script json"] = function() {
                return g || da.error(e + " was not called"),
                g[0]
            }
            ,
            b.dataTypes[0] = "json",
            f = a[e],
            a[e] = function() {
                g = arguments
            }
            ,
            d.always(function() {
                a[e] = f,
                b[e] && (b.jsonpCallback = c.jsonpCallback,
                Lb.push(e)),
                g && da.isFunction(f) && f(g[0]),
                g = f = void 0
            }),
            "script"
    }),
    da.parseHTML = function(a, b, c) {
        if (!a || "string" != typeof a)
            return null;
        "boolean" == typeof b && (c = b,
        b = !1),
        b = b || ka;
        var d = ha.exec(a)
          , e = !c && [];
        return d ? [b.createElement(d[1])] : (d = da.buildFragment([a], b, e),
        e && e.length && da(e).remove(),
        da.merge([], d.childNodes))
    }
    ;
    var Nb = da.fn.load;
    da.fn.load = function(a, b, c) {
        if ("string" != typeof a && Nb)
            return Nb.apply(this, arguments);
        var d, e, f, g = this, h = a.indexOf(" ");
        return h >= 0 && (d = da.trim(a.slice(h, a.length)),
        a = a.slice(0, h)),
        da.isFunction(b) ? (c = b,
        b = void 0) : b && "object" == typeof b && (f = "POST"),
        g.length > 0 && da.ajax({
            url: a,
            type: f,
            dataType: "html",
            data: b
        }).done(function(a) {
            e = arguments,
            g.html(d ? da("<div>").append(da.parseHTML(a)).find(d) : a)
        }).complete(c && function(a, b) {
            g.each(c, e || [a.responseText, b, a])
        }
        ),
        this
    }
    ,
    da.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(a, b) {
        da.fn[b] = function(a) {
            return this.on(b, a)
        }
    }),
    da.expr.filters.animated = function(a) {
        return da.grep(da.timers, function(b) {
            return a === b.elem
        }).length
    }
    ;
    var Ob = a.document.documentElement;
    da.offset = {
        setOffset: function(a, b, c) {
            var d, e, f, g, h, i, j, k = da.css(a, "position"), l = da(a), m = {};
            "static" === k && (a.style.position = "relative"),
            h = l.offset(),
            f = da.css(a, "top"),
            i = da.css(a, "left"),
            j = ("absolute" === k || "fixed" === k) && da.inArray("auto", [f, i]) > -1,
            j ? (d = l.position(),
            g = d.top,
            e = d.left) : (g = parseFloat(f) || 0,
            e = parseFloat(i) || 0),
            da.isFunction(b) && (b = b.call(a, c, h)),
            null != b.top && (m.top = b.top - h.top + g),
            null != b.left && (m.left = b.left - h.left + e),
            "using"in b ? b.using.call(a, m) : l.css(m)
        }
    },
    da.fn.extend({
        offset: function(a) {
            if (arguments.length)
                return void 0 === a ? this : this.each(function(b) {
                    da.offset.setOffset(this, a, b)
                });
            var b, c, d = {
                top: 0,
                left: 0
            }, e = this[0], f = e && e.ownerDocument;
            return f ? (b = f.documentElement,
            da.contains(b, e) ? (void 0 !== e.getBoundingClientRect && (d = e.getBoundingClientRect()),
            c = V(f),
            {
                top: d.top + (c.pageYOffset || b.scrollTop) - (b.clientTop || 0),
                left: d.left + (c.pageXOffset || b.scrollLeft) - (b.clientLeft || 0)
            }) : d) : void 0
        },
        position: function() {
            if (this[0]) {
                var a, b, c = {
                    top: 0,
                    left: 0
                }, d = this[0];
                return "fixed" === da.css(d, "position") ? b = d.getBoundingClientRect() : (a = this.offsetParent(),
                b = this.offset(),
                da.nodeName(a[0], "html") || (c = a.offset()),
                c.top += da.css(a[0], "borderTopWidth", !0),
                c.left += da.css(a[0], "borderLeftWidth", !0)),
                {
                    top: b.top - c.top - da.css(d, "marginTop", !0),
                    left: b.left - c.left - da.css(d, "marginLeft", !0)
                }
            }
        },
        offsetParent: function() {
            return this.map(function() {
                for (var a = this.offsetParent || Ob; a && !da.nodeName(a, "html") && "static" === da.css(a, "position"); )
                    a = a.offsetParent;
                return a || Ob
            })
        }
    }),
    da.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(a, b) {
        var c = /Y/.test(b);
        da.fn[a] = function(d) {
            return wa(this, function(a, d, e) {
                var f = V(a);
                return void 0 === e ? f ? b in f ? f[b] : f.document.documentElement[d] : a[d] : void (f ? f.scrollTo(c ? da(f).scrollLeft() : e, c ? e : da(f).scrollTop()) : a[d] = e)
            }, a, d, arguments.length, null)
        }
    }),
    da.each(["top", "left"], function(a, b) {
        da.cssHooks[b] = A(ca.pixelPosition, function(a, c) {
            if (c)
                return c = Ua(a, b),
                Wa.test(c) ? da(a).position()[b] + "px" : c
        })
    }),
    da.each({
        Height: "height",
        Width: "width"
    }, function(a, b) {
        da.each({
            padding: "inner" + a,
            content: b,
            "": "outer" + a
        }, function(c, d) {
            da.fn[d] = function(d, e) {
                var f = arguments.length && (c || "boolean" != typeof d)
                  , g = c || (d === !0 || e === !0 ? "margin" : "border");
                return wa(this, function(b, c, d) {
                    var e;
                    return da.isWindow(b) ? b.document.documentElement["client" + a] : 9 === b.nodeType ? (e = b.documentElement,
                    Math.max(b.body["scroll" + a], e["scroll" + a], b.body["offset" + a], e["offset" + a], e["client" + a])) : void 0 === d ? da.css(b, c, g) : da.style(b, c, d, g)
                }, b, f ? d : void 0, f, null)
            }
        })
    }),
    da.fn.size = function() {
        return this.length
    }
    ,
    da.fn.andSelf = da.fn.addBack,
    "function" == typeof define && define.amd && define("jquery", [], function() {
        return da
    });
    var Pb = a.jQuery
      , Qb = a.$;
    return da.noConflict = function(b) {
        return a.$ === da && (a.$ = Qb),
        b && a.jQuery === da && (a.jQuery = Pb),
        da
    }
    ,
    void 0 === b && (a.jQuery = a.$ = da),
    da
}),
function(a, b, c, d) {
    "use strict";
    function e(a, b, c) {
        return setTimeout(j(a, c), b)
    }
    function f(a, b, c) {
        return !!Array.isArray(a) && (g(a, c[b], c),
        !0)
    }
    function g(a, b, c) {
        var d;
        if (a)
            if (a.forEach)
                a.forEach(b, c);
            else if (void 0 !== a.length)
                for (d = 0; d < a.length; )
                    b.call(c, a[d], d, a),
                    d++;
            else
                for (d in a)
                    a.hasOwnProperty(d) && b.call(c, a[d], d, a)
    }
    function h(b, c, d) {
        var e = "DEPRECATED METHOD: " + c + "\n" + d + " AT \n";
        return function() {
            var c = new Error("get-stack-trace")
              , d = c && c.stack ? c.stack.replace(/^[^\(]+?[\n$]/gm, "").replace(/^\s+at\s+/gm, "").replace(/^Object.<anonymous>\s*\(/gm, "{anonymous}()@") : "Unknown Stack Trace"
              , f = a.console && (a.console.warn || a.console.log);
            return f && f.call(a.console, e, d),
            b.apply(this, arguments)
        }
    }
    function i(a, b, c) {
        var d, e = b.prototype;
        d = a.prototype = Object.create(e),
        d.constructor = a,
        d._super = e,
        c && la(d, c)
    }
    function j(a, b) {
        return function() {
            return a.apply(b, arguments)
        }
    }
    function k(a, b) {
        return "function" == typeof a ? a.apply(b ? b[0] || void 0 : void 0, b) : a
    }
    function l(a, b) {
        return void 0 === a ? b : a
    }
    function m(a, b, c) {
        g(q(b), function(b) {
            a.addEventListener(b, c, !1)
        })
    }
    function n(a, b, c) {
        g(q(b), function(b) {
            a.removeEventListener(b, c, !1)
        })
    }
    function o(a, b) {
        for (; a; ) {
            if (a == b)
                return !0;
            a = a.parentNode
        }
        return !1
    }
    function p(a, b) {
        return a.indexOf(b) > -1
    }
    function q(a) {
        return a.trim().split(/\s+/g)
    }
    function r(a, b, c) {
        if (a.indexOf && !c)
            return a.indexOf(b);
        for (var d = 0; d < a.length; ) {
            if (c && a[d][c] == b || !c && a[d] === b)
                return d;
            d++
        }
        return -1
    }
    function s(a) {
        return Array.prototype.slice.call(a, 0)
    }
    function t(a, b, c) {
        for (var d = [], e = [], f = 0; f < a.length; ) {
            var g = b ? a[f][b] : a[f];
            r(e, g) < 0 && d.push(a[f]),
            e[f] = g,
            f++
        }
        return c && (d = b ? d.sort(function(a, c) {
            return a[b] > c[b]
        }) : d.sort()),
        d
    }
    function u(a, b) {
        for (var c, d, e = b[0].toUpperCase() + b.slice(1), f = 0; f < ma.length; ) {
            if (c = ma[f],
            d = c ? c + e : b,
            d in a)
                return d;
            f++
        }
    }
    function v() {
        return ta++
    }
    function w(b) {
        var c = b.ownerDocument || b;
        return c.defaultView || c.parentWindow || a
    }
    function x(a, b) {
        var c = this;
        this.manager = a,
        this.callback = b,
        this.element = a.element,
        this.target = a.options.inputTarget,
        this.domHandler = function(b) {
            k(a.options.enable, [a]) && c.handler(b)
        }
        ,
        this.init()
    }
    function y(a) {
        var b = a.options.inputClass;
        return new (b ? b : wa ? M : xa ? P : va ? R : L)(a,z)
    }
    function z(a, b, c) {
        var d = c.pointers.length
          , e = c.changedPointers.length
          , f = 1 & b && d - e === 0
          , g = 12 & b && d - e === 0;
        c.isFirst = !!f,
        c.isFinal = !!g,
        f && (a.session = {}),
        c.eventType = b,
        A(a, c),
        a.emit("hammer.input", c),
        a.recognize(c),
        a.session.prevInput = c
    }
    function A(a, b) {
        var c = a.session
          , d = b.pointers
          , e = d.length;
        c.firstInput || (c.firstInput = D(b)),
        e > 1 && !c.firstMultiple ? c.firstMultiple = D(b) : 1 === e && (c.firstMultiple = !1);
        var f = c.firstInput
          , g = c.firstMultiple
          , h = g ? g.center : f.center
          , i = b.center = E(d);
        b.timeStamp = qa(),
        b.deltaTime = b.timeStamp - f.timeStamp,
        b.angle = I(h, i),
        b.distance = H(h, i),
        B(c, b),
        b.offsetDirection = G(b.deltaX, b.deltaY);
        var j = F(b.deltaTime, b.deltaX, b.deltaY);
        b.overallVelocityX = j.x,
        b.overallVelocityY = j.y,
        b.overallVelocity = pa(j.x) > pa(j.y) ? j.x : j.y,
        b.scale = g ? K(g.pointers, d) : 1,
        b.rotation = g ? J(g.pointers, d) : 0,
        b.maxPointers = c.prevInput ? b.pointers.length > c.prevInput.maxPointers ? b.pointers.length : c.prevInput.maxPointers : b.pointers.length,
        C(c, b);
        var k = a.element;
        o(b.srcEvent.target, k) && (k = b.srcEvent.target),
        b.target = k
    }
    function B(a, b) {
        var c = b.center
          , d = a.offsetDelta || {}
          , e = a.prevDelta || {}
          , f = a.prevInput || {};
        1 !== b.eventType && 4 !== f.eventType || (e = a.prevDelta = {
            x: f.deltaX || 0,
            y: f.deltaY || 0
        },
        d = a.offsetDelta = {
            x: c.x,
            y: c.y
        }),
        b.deltaX = e.x + (c.x - d.x),
        b.deltaY = e.y + (c.y - d.y)
    }
    function C(a, b) {
        var c, d, e, f, g = a.lastInterval || b, h = b.timeStamp - g.timeStamp;
        if (8 != b.eventType && (h > 25 || void 0 === g.velocity)) {
            var i = b.deltaX - g.deltaX
              , j = b.deltaY - g.deltaY
              , k = F(h, i, j);
            d = k.x,
            e = k.y,
            c = pa(k.x) > pa(k.y) ? k.x : k.y,
            f = G(i, j),
            a.lastInterval = b
        } else
            c = g.velocity,
            d = g.velocityX,
            e = g.velocityY,
            f = g.direction;
        b.velocity = c,
        b.velocityX = d,
        b.velocityY = e,
        b.direction = f
    }
    function D(a) {
        for (var b = [], c = 0; c < a.pointers.length; )
            b[c] = {
                clientX: oa(a.pointers[c].clientX),
                clientY: oa(a.pointers[c].clientY)
            },
            c++;
        return {
            timeStamp: qa(),
            pointers: b,
            center: E(b),
            deltaX: a.deltaX,
            deltaY: a.deltaY
        }
    }
    function E(a) {
        var b = a.length;
        if (1 === b)
            return {
                x: oa(a[0].clientX),
                y: oa(a[0].clientY)
            };
        for (var c = 0, d = 0, e = 0; e < b; )
            c += a[e].clientX,
            d += a[e].clientY,
            e++;
        return {
            x: oa(c / b),
            y: oa(d / b)
        }
    }
    function F(a, b, c) {
        return {
            x: b / a || 0,
            y: c / a || 0
        }
    }
    function G(a, b) {
        return a === b ? 1 : pa(a) >= pa(b) ? a < 0 ? 2 : 4 : b < 0 ? 8 : 16
    }
    function H(a, b, c) {
        c || (c = ya);
        var d = b[c[0]] - a[c[0]]
          , e = b[c[1]] - a[c[1]];
        return Math.sqrt(d * d + e * e)
    }
    function I(a, b, c) {
        c || (c = ya);
        var d = b[c[0]] - a[c[0]]
          , e = b[c[1]] - a[c[1]];
        return 180 * Math.atan2(e, d) / Math.PI
    }
    function J(a, b) {
        return I(b[1], b[0], za) + I(a[1], a[0], za)
    }
    function K(a, b) {
        return H(b[0], b[1], za) / H(a[0], a[1], za)
    }
    function L() {
        this.evEl = "mousedown",
        this.evWin = "mousemove mouseup",
        this.pressed = !1,
        x.apply(this, arguments)
    }
    function M() {
        this.evEl = Da,
        this.evWin = Ea,
        x.apply(this, arguments),
        this.store = this.manager.session.pointerEvents = []
    }
    function N() {
        this.evTarget = "touchstart",
        this.evWin = "touchstart touchmove touchend touchcancel",
        this.started = !1,
        x.apply(this, arguments)
    }
    function O(a, b) {
        var c = s(a.touches)
          , d = s(a.changedTouches);
        return 12 & b && (c = t(c.concat(d), "identifier", !0)),
        [c, d]
    }
    function P() {
        this.evTarget = "touchstart touchmove touchend touchcancel",
        this.targetIds = {},
        x.apply(this, arguments)
    }
    function Q(a, b) {
        var c = s(a.touches)
          , d = this.targetIds;
        if (3 & b && 1 === c.length)
            return d[c[0].identifier] = !0,
            [c, c];
        var e, f, g = s(a.changedTouches), h = [], i = this.target;
        if (f = c.filter(function(a) {
            return o(a.target, i)
        }),
        1 === b)
            for (e = 0; e < f.length; )
                d[f[e].identifier] = !0,
                e++;
        for (e = 0; e < g.length; )
            d[g[e].identifier] && h.push(g[e]),
            12 & b && delete d[g[e].identifier],
            e++;
        return h.length ? [t(f.concat(h), "identifier", !0), h] : void 0
    }
    function R() {
        x.apply(this, arguments);
        var a = j(this.handler, this);
        this.touch = new P(this.manager,a),
        this.mouse = new L(this.manager,a),
        this.primaryTouch = null,
        this.lastTouches = []
    }
    function S(a, b) {
        1 & a ? (this.primaryTouch = b.changedPointers[0].identifier,
        T.call(this, b)) : 12 & a && T.call(this, b)
    }
    function T(a) {
        var b = a.changedPointers[0];
        if (b.identifier === this.primaryTouch) {
            var c = {
                x: b.clientX,
                y: b.clientY
            };
            this.lastTouches.push(c);
            var d = this.lastTouches
              , e = function() {
                var a = d.indexOf(c);
                a > -1 && d.splice(a, 1)
            };
            setTimeout(e, 2500)
        }
    }
    function U(a) {
        for (var b = a.srcEvent.clientX, c = a.srcEvent.clientY, d = 0; d < this.lastTouches.length; d++) {
            var e = this.lastTouches[d]
              , f = Math.abs(b - e.x)
              , g = Math.abs(c - e.y);
            if (f <= 25 && g <= 25)
                return !0
        }
        return !1
    }
    function V(a, b) {
        this.manager = a,
        this.set(b)
    }
    function W(a) {
        if (p(a, "none"))
            return "none";
        var b = p(a, "pan-x")
          , c = p(a, "pan-y");
        return b && c ? "none" : b || c ? b ? "pan-x" : "pan-y" : p(a, "manipulation") ? "manipulation" : "auto"
    }
    function X() {
        if (!Ia)
            return !1;
        var b = {}
          , c = a.CSS && a.CSS.supports;
        return ["auto", "manipulation", "pan-y", "pan-x", "pan-x pan-y", "none"].forEach(function(d) {
            b[d] = !c || a.CSS.supports("touch-action", d)
        }),
        b
    }
    function Y(a) {
        this.options = la({}, this.defaults, a || {}),
        this.id = v(),
        this.manager = null,
        this.options.enable = l(this.options.enable, !0),
        this.state = 1,
        this.simultaneous = {},
        this.requireFail = []
    }
    function Z(a) {
        return 16 & a ? "cancel" : 8 & a ? "end" : 4 & a ? "move" : 2 & a ? "start" : ""
    }
    function $(a) {
        return 16 == a ? "down" : 8 == a ? "up" : 2 == a ? "left" : 4 == a ? "right" : ""
    }
    function _(a, b) {
        var c = b.manager;
        return c ? c.get(a) : a
    }
    function aa() {
        Y.apply(this, arguments)
    }
    function ba() {
        aa.apply(this, arguments),
        this.pX = null,
        this.pY = null
    }
    function ca() {
        aa.apply(this, arguments)
    }
    function da() {
        Y.apply(this, arguments),
        this._timer = null,
        this._input = null
    }
    function ea() {
        aa.apply(this, arguments)
    }
    function fa() {
        aa.apply(this, arguments)
    }
    function ga() {
        Y.apply(this, arguments),
        this.pTime = !1,
        this.pCenter = !1,
        this._timer = null,
        this._input = null,
        this.count = 0
    }
    function ha(a, b) {
        return b = b || {},
        b.recognizers = l(b.recognizers, ha.defaults.preset),
        new ia(a,b)
    }
    function ia(a, b) {
        this.options = la({}, ha.defaults, b || {}),
        this.options.inputTarget = this.options.inputTarget || a,
        this.handlers = {},
        this.session = {},
        this.recognizers = [],
        this.oldCssProps = {},
        this.element = a,
        this.input = y(this),
        this.touchAction = new V(this,this.options.touchAction),
        ja(this, !0),
        g(this.options.recognizers, function(a) {
            var b = this.add(new a[0](a[1]));
            a[2] && b.recognizeWith(a[2]),
            a[3] && b.requireFailure(a[3])
        }, this)
    }
    function ja(a, b) {
        var c = a.element;
        if (c.style) {
            var d;
            g(a.options.cssProps, function(e, f) {
                d = u(c.style, f),
                b ? (a.oldCssProps[d] = c.style[d],
                c.style[d] = e) : c.style[d] = a.oldCssProps[d] || ""
            }),
            b || (a.oldCssProps = {})
        }
    }
    function ka(a, c) {
        var d = b.createEvent("Event");
        d.initEvent(a, !0, !0),
        d.gesture = c,
        c.target.dispatchEvent(d)
    }
    var la, ma = ["", "webkit", "Moz", "MS", "ms", "o"], na = b.createElement("div"), oa = Math.round, pa = Math.abs, qa = Date.now;
    la = "function" != typeof Object.assign ? function(a) {
        if (void 0 === a || null === a)
            throw new TypeError("Cannot convert undefined or null to object");
        for (var b = Object(a), c = 1; c < arguments.length; c++) {
            var d = arguments[c];
            if (void 0 !== d && null !== d)
                for (var e in d)
                    d.hasOwnProperty(e) && (b[e] = d[e])
        }
        return b
    }
    : Object.assign;
    var ra = h(function(a, b, c) {
        for (var d = Object.keys(b), e = 0; e < d.length; )
            (!c || c && void 0 === a[d[e]]) && (a[d[e]] = b[d[e]]),
            e++;
        return a
    }, "extend", "Use `assign`.")
      , sa = h(function(a, b) {
        return ra(a, b, !0)
    }, "merge", "Use `assign`.")
      , ta = 1
      , ua = /mobile|tablet|ip(ad|hone|od)|android/i
      , va = "ontouchstart"in a
      , wa = void 0 !== u(a, "PointerEvent")
      , xa = va && ua.test(navigator.userAgent)
      , ya = ["x", "y"]
      , za = ["clientX", "clientY"];
    x.prototype = {
        handler: function() {},
        init: function() {
            this.evEl && m(this.element, this.evEl, this.domHandler),
            this.evTarget && m(this.target, this.evTarget, this.domHandler),
            this.evWin && m(w(this.element), this.evWin, this.domHandler)
        },
        destroy: function() {
            this.evEl && n(this.element, this.evEl, this.domHandler),
            this.evTarget && n(this.target, this.evTarget, this.domHandler),
            this.evWin && n(w(this.element), this.evWin, this.domHandler)
        }
    };
    var Aa = {
        mousedown: 1,
        mousemove: 2,
        mouseup: 4
    };
    i(L, x, {
        handler: function(a) {
            var b = Aa[a.type];
            1 & b && 0 === a.button && (this.pressed = !0),
            2 & b && 1 !== a.which && (b = 4),
            this.pressed && (4 & b && (this.pressed = !1),
            this.callback(this.manager, b, {
                pointers: [a],
                changedPointers: [a],
                pointerType: "mouse",
                srcEvent: a
            }))
        }
    });
    var Ba = {
        pointerdown: 1,
        pointermove: 2,
        pointerup: 4,
        pointercancel: 8,
        pointerout: 8
    }
      , Ca = {
        2: "touch",
        3: "pen",
        4: "mouse",
        5: "kinect"
    }
      , Da = "pointerdown"
      , Ea = "pointermove pointerup pointercancel";
    a.MSPointerEvent && !a.PointerEvent && (Da = "MSPointerDown",
    Ea = "MSPointerMove MSPointerUp MSPointerCancel"),
    i(M, x, {
        handler: function(a) {
            var b = this.store
              , c = !1
              , d = a.type.toLowerCase().replace("ms", "")
              , e = Ba[d]
              , f = Ca[a.pointerType] || a.pointerType
              , g = "touch" == f
              , h = r(b, a.pointerId, "pointerId");
            1 & e && (0 === a.button || g) ? h < 0 && (b.push(a),
            h = b.length - 1) : 12 & e && (c = !0),
            h < 0 || (b[h] = a,
            this.callback(this.manager, e, {
                pointers: b,
                changedPointers: [a],
                pointerType: f,
                srcEvent: a
            }),
            c && b.splice(h, 1))
        }
    });
    var Fa = {
        touchstart: 1,
        touchmove: 2,
        touchend: 4,
        touchcancel: 8
    };
    i(N, x, {
        handler: function(a) {
            var b = Fa[a.type];
            if (1 === b && (this.started = !0),
            this.started) {
                var c = O.call(this, a, b);
                12 & b && c[0].length - c[1].length === 0 && (this.started = !1),
                this.callback(this.manager, b, {
                    pointers: c[0],
                    changedPointers: c[1],
                    pointerType: "touch",
                    srcEvent: a
                })
            }
        }
    });
    var Ga = {
        touchstart: 1,
        touchmove: 2,
        touchend: 4,
        touchcancel: 8
    };
    i(P, x, {
        handler: function(a) {
            var b = Ga[a.type]
              , c = Q.call(this, a, b);
            c && this.callback(this.manager, b, {
                pointers: c[0],
                changedPointers: c[1],
                pointerType: "touch",
                srcEvent: a
            })
        }
    }),
    i(R, x, {
        handler: function(a, b, c) {
            var d = "touch" == c.pointerType
              , e = "mouse" == c.pointerType;
            if (!(e && c.sourceCapabilities && c.sourceCapabilities.firesTouchEvents)) {
                if (d)
                    S.call(this, b, c);
                else if (e && U.call(this, c))
                    return;
                this.callback(a, b, c)
            }
        },
        destroy: function() {
            this.touch.destroy(),
            this.mouse.destroy()
        }
    });
    var Ha = u(na.style, "touchAction")
      , Ia = void 0 !== Ha
      , Ja = X();
    V.prototype = {
        set: function(a) {
            "compute" == a && (a = this.compute()),
            Ia && this.manager.element.style && Ja[a] && (this.manager.element.style[Ha] = a),
            this.actions = a.toLowerCase().trim()
        },
        update: function() {
            this.set(this.manager.options.touchAction)
        },
        compute: function() {
            var a = [];
            return g(this.manager.recognizers, function(b) {
                k(b.options.enable, [b]) && (a = a.concat(b.getTouchAction()))
            }),
            W(a.join(" "))
        },
        preventDefaults: function(a) {
            var b = a.srcEvent
              , c = a.offsetDirection;
            if (this.manager.session.prevented)
                return void b.preventDefault();
            var d = this.actions
              , e = p(d, "none") && !Ja.none
              , f = p(d, "pan-y") && !Ja["pan-y"]
              , g = p(d, "pan-x") && !Ja["pan-x"];
            if (e) {
                var h = 1 === a.pointers.length
                  , i = a.distance < 2
                  , j = a.deltaTime < 250;
                if (h && i && j)
                    return
            }
            return g && f ? void 0 : e || f && 6 & c || g && 24 & c ? this.preventSrc(b) : void 0
        },
        preventSrc: function(a) {
            this.manager.session.prevented = !0,
            a.preventDefault()
        }
    },
    Y.prototype = {
        defaults: {},
        set: function(a) {
            return la(this.options, a),
            this.manager && this.manager.touchAction.update(),
            this
        },
        recognizeWith: function(a) {
            if (f(a, "recognizeWith", this))
                return this;
            var b = this.simultaneous;
            return a = _(a, this),
            b[a.id] || (b[a.id] = a,
            a.recognizeWith(this)),
            this
        },
        dropRecognizeWith: function(a) {
            return f(a, "dropRecognizeWith", this) ? this : (a = _(a, this),
            delete this.simultaneous[a.id],
            this)
        },
        requireFailure: function(a) {
            if (f(a, "requireFailure", this))
                return this;
            var b = this.requireFail;
            return a = _(a, this),
            r(b, a) === -1 && (b.push(a),
            a.requireFailure(this)),
            this
        },
        dropRequireFailure: function(a) {
            if (f(a, "dropRequireFailure", this))
                return this;
            a = _(a, this);
            var b = r(this.requireFail, a);
            return b > -1 && this.requireFail.splice(b, 1),
            this
        },
        hasRequireFailures: function() {
            return this.requireFail.length > 0
        },
        canRecognizeWith: function(a) {
            return !!this.simultaneous[a.id]
        },
        emit: function(a) {
            function b(b) {
                c.manager.emit(b, a)
            }
            var c = this
              , d = this.state;
            d < 8 && b(c.options.event + Z(d)),
            b(c.options.event),
            a.additionalEvent && b(a.additionalEvent),
            d >= 8 && b(c.options.event + Z(d))
        },
        tryEmit: function(a) {
            return this.canEmit() ? this.emit(a) : void (this.state = 32)
        },
        canEmit: function() {
            for (var a = 0; a < this.requireFail.length; ) {
                if (!(33 & this.requireFail[a].state))
                    return !1;
                a++
            }
            return !0
        },
        recognize: function(a) {
            var b = la({}, a);
            return k(this.options.enable, [this, b]) ? (56 & this.state && (this.state = 1),
            this.state = this.process(b),
            30 & this.state && this.tryEmit(b),
            void 0) : (this.reset(),
            void (this.state = 32))
        },
        process: function(a) {},
        getTouchAction: function() {},
        reset: function() {}
    },
    i(aa, Y, {
        defaults: {
            pointers: 1
        },
        attrTest: function(a) {
            var b = this.options.pointers;
            return 0 === b || a.pointers.length === b
        },
        process: function(a) {
            var b = this.state
              , c = a.eventType
              , d = 6 & b
              , e = this.attrTest(a);
            return d && (8 & c || !e) ? 16 | b : d || e ? 4 & c ? 8 | b : 2 & b ? 4 | b : 2 : 32
        }
    }),
    i(ba, aa, {
        defaults: {
            event: "pan",
            threshold: 10,
            pointers: 1,
            direction: 30
        },
        getTouchAction: function() {
            var a = this.options.direction
              , b = [];
            return 6 & a && b.push("pan-y"),
            24 & a && b.push("pan-x"),
            b
        },
        directionTest: function(a) {
            var b = this.options
              , c = !0
              , d = a.distance
              , e = a.direction
              , f = a.deltaX
              , g = a.deltaY;
            return e & b.direction || (6 & b.direction ? (e = 0 === f ? 1 : f < 0 ? 2 : 4,
            c = f != this.pX,
            d = Math.abs(a.deltaX)) : (e = 0 === g ? 1 : g < 0 ? 8 : 16,
            c = g != this.pY,
            d = Math.abs(a.deltaY))),
            a.direction = e,
            c && d > b.threshold && e & b.direction
        },
        attrTest: function(a) {
            return aa.prototype.attrTest.call(this, a) && (2 & this.state || !(2 & this.state) && this.directionTest(a))
        },
        emit: function(a) {
            this.pX = a.deltaX,
            this.pY = a.deltaY;
            var b = $(a.direction);
            b && (a.additionalEvent = this.options.event + b),
            this._super.emit.call(this, a)
        }
    }),
    i(ca, aa, {
        defaults: {
            event: "pinch",
            threshold: 0,
            pointers: 2
        },
        getTouchAction: function() {
            return ["none"]
        },
        attrTest: function(a) {
            return this._super.attrTest.call(this, a) && (Math.abs(a.scale - 1) > this.options.threshold || 2 & this.state)
        },
        emit: function(a) {
            if (1 !== a.scale) {
                var b = a.scale < 1 ? "in" : "out";
                a.additionalEvent = this.options.event + b
            }
            this._super.emit.call(this, a)
        }
    }),
    i(da, Y, {
        defaults: {
            event: "press",
            pointers: 1,
            time: 251,
            threshold: 9
        },
        getTouchAction: function() {
            return ["auto"]
        },
        process: function(a) {
            var b = this.options
              , c = a.pointers.length === b.pointers
              , d = a.distance < b.threshold
              , f = a.deltaTime > b.time;
            if (this._input = a,
            !d || !c || 12 & a.eventType && !f)
                this.reset();
            else if (1 & a.eventType)
                this.reset(),
                this._timer = e(function() {
                    this.state = 8,
                    this.tryEmit()
                }, b.time, this);
            else if (4 & a.eventType)
                return 8;
            return 32
        },
        reset: function() {
            clearTimeout(this._timer)
        },
        emit: function(a) {
            8 === this.state && (a && 4 & a.eventType ? this.manager.emit(this.options.event + "up", a) : (this._input.timeStamp = qa(),
            this.manager.emit(this.options.event, this._input)))
        }
    }),
    i(ea, aa, {
        defaults: {
            event: "rotate",
            threshold: 0,
            pointers: 2
        },
        getTouchAction: function() {
            return ["none"]
        },
        attrTest: function(a) {
            return this._super.attrTest.call(this, a) && (Math.abs(a.rotation) > this.options.threshold || 2 & this.state)
        }
    }),
    i(fa, aa, {
        defaults: {
            event: "swipe",
            threshold: 10,
            velocity: .3,
            direction: 30,
            pointers: 1
        },
        getTouchAction: function() {
            return ba.prototype.getTouchAction.call(this)
        },
        attrTest: function(a) {
            var b, c = this.options.direction;
            return 30 & c ? b = a.overallVelocity : 6 & c ? b = a.overallVelocityX : 24 & c && (b = a.overallVelocityY),
            this._super.attrTest.call(this, a) && c & a.offsetDirection && a.distance > this.options.threshold && a.maxPointers == this.options.pointers && pa(b) > this.options.velocity && 4 & a.eventType
        },
        emit: function(a) {
            var b = $(a.offsetDirection);
            b && this.manager.emit(this.options.event + b, a),
            this.manager.emit(this.options.event, a)
        }
    }),
    i(ga, Y, {
        defaults: {
            event: "tap",
            pointers: 1,
            taps: 1,
            interval: 300,
            time: 250,
            threshold: 9,
            posThreshold: 10
        },
        getTouchAction: function() {
            return ["manipulation"]
        },
        process: function(a) {
            var b = this.options
              , c = a.pointers.length === b.pointers
              , d = a.distance < b.threshold
              , f = a.deltaTime < b.time;
            if (this.reset(),
            1 & a.eventType && 0 === this.count)
                return this.failTimeout();
            if (d && f && c) {
                if (4 != a.eventType)
                    return this.failTimeout();
                var g = !this.pTime || a.timeStamp - this.pTime < b.interval
                  , h = !this.pCenter || H(this.pCenter, a.center) < b.posThreshold;
                if (this.pTime = a.timeStamp,
                this.pCenter = a.center,
                h && g ? this.count += 1 : this.count = 1,
                this._input = a,
                0 === this.count % b.taps)
                    return this.hasRequireFailures() ? (this._timer = e(function() {
                        this.state = 8,
                        this.tryEmit()
                    }, b.interval, this),
                    2) : 8
            }
            return 32
        },
        failTimeout: function() {
            return this._timer = e(function() {
                this.state = 32
            }, this.options.interval, this),
            32
        },
        reset: function() {
            clearTimeout(this._timer)
        },
        emit: function() {
            8 == this.state && (this._input.tapCount = this.count,
            this.manager.emit(this.options.event, this._input))
        }
    }),
    ha.VERSION = "2.0.8",
    ha.defaults = {
        domEvents: !1,
        touchAction: "compute",
        enable: !0,
        inputTarget: null,
        inputClass: null,
        preset: [[ea, {
            enable: !1
        }], [ca, {
            enable: !1
        }, ["rotate"]], [fa, {
            direction: 6
        }], [ba, {
            direction: 6
        }, ["swipe"]], [ga], [ga, {
            event: "doubletap",
            taps: 2
        }, ["tap"]], [da]],
        cssProps: {
            userSelect: "none",
            touchSelect: "none",
            touchCallout: "none",
            contentZooming: "none",
            userDrag: "none",
            tapHighlightColor: "rgba(0,0,0,0)"
        }
    },
    ia.prototype = {
        set: function(a) {
            return la(this.options, a),
            a.touchAction && this.touchAction.update(),
            a.inputTarget && (this.input.destroy(),
            this.input.target = a.inputTarget,
            this.input.init()),
            this
        },
        stop: function(a) {
            this.session.stopped = a ? 2 : 1
        },
        recognize: function(a) {
            var b = this.session;
            if (!b.stopped) {
                this.touchAction.preventDefaults(a);
                var c, d = this.recognizers, e = b.curRecognizer;
                (!e || e && 8 & e.state) && (e = b.curRecognizer = null);
                for (var f = 0; f < d.length; )
                    c = d[f],
                    2 === b.stopped || e && c != e && !c.canRecognizeWith(e) ? c.reset() : c.recognize(a),
                    !e && 14 & c.state && (e = b.curRecognizer = c),
                    f++
            }
        },
        get: function(a) {
            if (a instanceof Y)
                return a;
            for (var b = this.recognizers, c = 0; c < b.length; c++)
                if (b[c].options.event == a)
                    return b[c];
            return null
        },
        add: function(a) {
            if (f(a, "add", this))
                return this;
            var b = this.get(a.options.event);
            return b && this.remove(b),
            this.recognizers.push(a),
            a.manager = this,
            this.touchAction.update(),
            a
        },
        remove: function(a) {
            if (f(a, "remove", this))
                return this;
            if (a = this.get(a)) {
                var b = this.recognizers
                  , c = r(b, a);
                c !== -1 && (b.splice(c, 1),
                this.touchAction.update())
            }
            return this
        },
        on: function(a, b) {
            if (void 0 !== a && void 0 !== b) {
                var c = this.handlers;
                return g(q(a), function(a) {
                    c[a] = c[a] || [],
                    c[a].push(b)
                }),
                this
            }
        },
        off: function(a, b) {
            if (void 0 !== a) {
                var c = this.handlers;
                return g(q(a), function(a) {
                    b ? c[a] && c[a].splice(r(c[a], b), 1) : delete c[a]
                }),
                this
            }
        },
        emit: function(a, b) {
            this.options.domEvents && ka(a, b);
            var c = this.handlers[a] && this.handlers[a].slice();
            if (c && c.length) {
                b.type = a,
                b.preventDefault = function() {
                    b.srcEvent.preventDefault()
                }
                ;
                for (var d = 0; d < c.length; )
                    c[d](b),
                    d++
            }
        },
        destroy: function() {
            this.element && ja(this, !1),
            this.handlers = {},
            this.session = {},
            this.input.destroy(),
            this.element = null
        }
    },
    la(ha, {
        INPUT_START: 1,
        INPUT_MOVE: 2,
        INPUT_END: 4,
        INPUT_CANCEL: 8,
        STATE_POSSIBLE: 1,
        STATE_BEGAN: 2,
        STATE_CHANGED: 4,
        STATE_ENDED: 8,
        STATE_RECOGNIZED: 8,
        STATE_CANCELLED: 16,
        STATE_FAILED: 32,
        DIRECTION_NONE: 1,
        DIRECTION_LEFT: 2,
        DIRECTION_RIGHT: 4,
        DIRECTION_UP: 8,
        DIRECTION_DOWN: 16,
        DIRECTION_HORIZONTAL: 6,
        DIRECTION_VERTICAL: 24,
        DIRECTION_ALL: 30,
        Manager: ia,
        Input: x,
        TouchAction: V,
        TouchInput: P,
        MouseInput: L,
        PointerEventInput: M,
        TouchMouseInput: R,
        SingleTouchInput: N,
        Recognizer: Y,
        AttrRecognizer: aa,
        Tap: ga,
        Pan: ba,
        Swipe: fa,
        Pinch: ca,
        Rotate: ea,
        Press: da,
        on: m,
        off: n,
        each: g,
        merge: sa,
        extend: ra,
        assign: la,
        inherit: i,
        bindFn: j,
        prefixed: u
    }),
    (void 0 !== a ? a : "undefined" != typeof self ? self : {}).Hammer = ha,
    "function" == typeof define && define.amd ? define(function() {
        return ha
    }) : "undefined" != typeof module && module.exports ? module.exports = ha : a.Hammer = ha
}(window, document, "Hammer"),
function() {
    function a(a) {
        var b = a.naturalWidth;
        if (b * a.naturalHeight > 1048576) {
            var c = document.createElement("canvas");
            c.width = c.height = 1;
            var d = c.getContext("2d");
            return d.drawImage(a, -b + 1, 0),
            0 === d.getImageData(0, 0, 1, 1).data[3]
        }
        return !1
    }
    function b(a, b, c) {
        var d = document.createElement("canvas");
        d.width = 1,
        d.height = c;
        var e = d.getContext("2d");
        e.drawImage(a, 0, 0);
        for (var f = e.getImageData(0, 0, 1, c).data, g = 0, h = c, i = c; i > g; )
            0 === f[4 * (i - 1) + 3] ? h = i : g = i,
            i = h + g >> 1;
        var j = i / c;
        return 0 === j ? 1 : j
    }
    function c(a, b, c) {
        var e = document.createElement("canvas");
        return d(a, e, b, c),
        e.toDataURL("image/jpeg", b.quality || .8)
    }
    function d(c, d, f, g) {
        var h = c.naturalWidth
          , i = c.naturalHeight;
        if (h + i) {
            var j = f.width
              , k = f.height
              , l = d.getContext("2d");
            l.save(),
            e(d, l, j, k, f.orientation),
            a(c) && (h /= 2,
            i /= 2);
            var m = 1024
              , n = document.createElement("canvas");
            n.width = n.height = m;
            for (var o = n.getContext("2d"), p = g ? b(c, h, i) : 1, q = Math.ceil(m * j / h), r = Math.ceil(m * k / i / p), s = 0, t = 0; s < i; ) {
                for (var u = 0, v = 0; u < h; )
                    o.clearRect(0, 0, m, m),
                    o.drawImage(c, -u, -s),
                    l.drawImage(n, 0, 0, m, m, v, t, q, r),
                    u += m,
                    v += q;
                s += m,
                t += r
            }
            l.restore(),
            n = o = null
        }
    }
    function e(a, b, c, d, e) {
        switch (e) {
        case 5:
        case 6:
        case 7:
        case 8:
            a.width = d,
            a.height = c;
            break;
        default:
            a.width = c,
            a.height = d
        }
        switch (e) {
        case 2:
            b.translate(c, 0),
            b.scale(-1, 1);
            break;
        case 3:
            b.translate(c, d),
            b.rotate(Math.PI);
            break;
        case 4:
            b.translate(0, d),
            b.scale(1, -1);
            break;
        case 5:
            b.rotate(.5 * Math.PI),
            b.scale(1, -1);
            break;
        case 6:
            b.rotate(.5 * Math.PI),
            b.translate(0, -d);
            break;
        case 7:
            b.rotate(.5 * Math.PI),
            b.translate(c, -d),
            b.scale(-1, 1);
            break;
        case 8:
            b.rotate(-.5 * Math.PI),
            b.translate(-c, 0)
        }
    }
    function f(a) {
        if (window.Blob && a instanceof Blob) {
            if (!g)
                throw Error("No createObjectURL function found to create blob url");
            var b = new Image;
            b.src = g.createObjectURL(a),
            this.blob = a,
            a = b
        }
        if (!a.naturalWidth && !a.naturalHeight) {
            var c = this;
            a.onload = a.onerror = function() {
                var a = c.imageLoadListeners;
                if (a) {
                    c.imageLoadListeners = null;
                    for (var b = 0, d = a.length; b < d; b++)
                        a[b]()
                }
            }
            ,
            this.imageLoadListeners = []
        }
        this.srcImage = a
    }
    var g = window.URL && window.URL.createObjectURL ? window.URL : window.webkitURL && window.webkitURL.createObjectURL ? window.webkitURL : null;
    f.prototype.render = function(a, b, e) {
        if (this.imageLoadListeners) {
            var f = this;
            return void this.imageLoadListeners.push(function() {
                f.render(a, b, e)
            })
        }
        b = b || {};
        var h = this.srcImage.naturalWidth
          , i = this.srcImage.naturalHeight
          , j = b.width
          , k = b.height
          , l = b.maxWidth
          , m = b.maxHeight
          , n = !this.blob || "image/jpeg" === this.blob.type;
        j && !k ? k = i * j / h << 0 : k && !j ? j = h * k / i << 0 : (j = h,
        k = i),
        l && j > l && (j = l,
        k = i * j / h << 0),
        m && k > m && (k = m,
        j = h * k / i << 0);
        var o = {
            width: j,
            height: k
        };
        for (var p in b)
            o[p] = b[p];
        var q = a.tagName.toLowerCase();
        "img" === q ? a.src = c(this.srcImage, o, n) : "canvas" === q && d(this.srcImage, a, o, n),
        "function" == typeof this.onrender && this.onrender(a),
        e && e(),
        this.blob && (this.blob = null,
        g.revokeObjectURL(this.srcImage.src))
    }
    ,
    window.MegaPixImage = f
}(),
function() {
    function a(a) {
        return !!a.exifdata
    }
    function b(a, b) {
        b = b || a.match(/^data\:([^\;]+)\;base64,/im)[1] || "",
        a = a.replace(/^data\:([^\;]+)\;base64,/gim, "");
        for (var c = atob(a), d = c.length, e = new ArrayBuffer(d), f = new Uint8Array(e), g = 0; g < d; g++)
            f[g] = c.charCodeAt(g);
        return e
    }
    function c(a, b) {
        var c = new XMLHttpRequest;
        c.open("GET", a, !0),
        c.responseType = "blob",
        c.onload = function(a) {
            200 != this.status && 0 !== this.status || b(this.response)
        }
        ,
        c.send()
    }
    function d(a, d) {
        function g(b) {
            var c = e(b)
              , g = f(b);
            a.exifdata = c || {},
            a.iptcdata = g || {},
            d && d.call(a)
        }
        if (a.src)
            if (/^data\:/i.test(a.src)) {
                var h = b(a.src);
                g(h)
            } else if (/^blob\:/i.test(a.src)) {
                var i = new FileReader;
                i.onload = function(a) {
                    g(a.target.result)
                }
                ,
                c(a.src, function(a) {
                    i.readAsArrayBuffer(a)
                })
            } else {
                var j = new XMLHttpRequest;
                j.onload = function() {
                    if (200 != this.status && 0 !== this.status)
                        throw "Could not load image";
                    g(j.response),
                    j = null
                }
                ,
                j.open("GET", a.src, !0),
                j.responseType = "arraybuffer",
                j.send(null)
            }
        else if (window.FileReader && (a instanceof window.Blob || a instanceof window.File)) {
            var i = new FileReader;
            i.onload = function(a) {
                g(a.target.result)
            }
            ,
            i.readAsArrayBuffer(a)
        }
    }
    function e(a) {
        var b = new DataView(a);
        if (255 != b.getUint8(0) || 216 != b.getUint8(1))
            return !1;
        for (var c, d = 2, e = a.byteLength; d < e; ) {
            if (255 != b.getUint8(d))
                return !1;
            if (c = b.getUint8(d + 1),
            225 == c)
                return k(b, d + 4, b.getUint16(d + 2) - 2);
            d += 2 + b.getUint16(d + 2)
        }
    }
    function f(a) {
        var b = new DataView(a);
        if (255 != b.getUint8(0) || 216 != b.getUint8(1))
            return !1;
        for (var c = 2, d = a.byteLength, e = function(a, b) {
            return 56 === a.getUint8(b) && 66 === a.getUint8(b + 1) && 73 === a.getUint8(b + 2) && 77 === a.getUint8(b + 3) && 4 === a.getUint8(b + 4) && 4 === a.getUint8(b + 5)
        }; c < d; ) {
            if (e(b, c)) {
                var f = b.getUint8(c + 7);
                return f % 2 !== 0 && (f += 1),
                0 === f && (f = 4),
                g(a, c + 8 + f, b.getUint16(c + 6 + f))
            }
            c++
        }
    }
    function g(a, b, c) {
        for (var d, e, f, g, h = new DataView(a), i = {}, k = b; k < b + c; )
            28 === h.getUint8(k) && 2 === h.getUint8(k + 1) && (g = h.getUint8(k + 2),
            g in s && (f = h.getInt16(k + 3),
            e = s[g],
            d = j(h, k + 5, f),
            i.hasOwnProperty(e) ? i[e]instanceof Array ? i[e].push(d) : i[e] = [i[e], d] : i[e] = d)),
            k++;
        return i
    }
    function h(a, b, c, d, e) {
        var f, g, h, j = a.getUint16(c, !e), k = {};
        for (h = 0; h < j; h++)
            f = c + 12 * h + 2,
            g = d[a.getUint16(f, !e)],
            k[g] = i(a, f, b, c, e);
        return k
    }
    function i(a, b, c, d, e) {
        var f, g, h, i, k, l, m = a.getUint16(b + 2, !e), n = a.getUint32(b + 4, !e), o = a.getUint32(b + 8, !e) + c;
        switch (m) {
        case 1:
        case 7:
            if (1 == n)
                return a.getUint8(b + 8, !e);
            for (f = n > 4 ? o : b + 8,
            g = [],
            i = 0; i < n; i++)
                g[i] = a.getUint8(f + i);
            return g;
        case 2:
            return f = n > 4 ? o : b + 8,
            j(a, f, n - 1);
        case 3:
            if (1 == n)
                return a.getUint16(b + 8, !e);
            for (f = n > 2 ? o : b + 8,
            g = [],
            i = 0; i < n; i++)
                g[i] = a.getUint16(f + 2 * i, !e);
            return g;
        case 4:
            if (1 == n)
                return a.getUint32(b + 8, !e);
            for (g = [],
            i = 0; i < n; i++)
                g[i] = a.getUint32(o + 4 * i, !e);
            return g;
        case 5:
            if (1 == n)
                return k = a.getUint32(o, !e),
                l = a.getUint32(o + 4, !e),
                h = new Number(k / l),
                h.numerator = k,
                h.denominator = l,
                h;
            for (g = [],
            i = 0; i < n; i++)
                k = a.getUint32(o + 8 * i, !e),
                l = a.getUint32(o + 4 + 8 * i, !e),
                g[i] = new Number(k / l),
                g[i].numerator = k,
                g[i].denominator = l;
            return g;
        case 9:
            if (1 == n)
                return a.getInt32(b + 8, !e);
            for (g = [],
            i = 0; i < n; i++)
                g[i] = a.getInt32(o + 4 * i, !e);
            return g;
        case 10:
            if (1 == n)
                return a.getInt32(o, !e) / a.getInt32(o + 4, !e);
            for (g = [],
            i = 0; i < n; i++)
                g[i] = a.getInt32(o + 8 * i, !e) / a.getInt32(o + 4 + 8 * i, !e);
            return g
        }
    }
    function j(a, b, c) {
        var d = "";
        for (n = b; n < b + c; n++)
            d += String.fromCharCode(a.getUint8(n));
        return d
    }
    function k(a, b) {
        if ("Exif" != j(a, b, 4))
            return !1;
        var c, d, e, f, g, i = b + 6;
        if (18761 == a.getUint16(i))
            c = !1;
        else {
            if (19789 != a.getUint16(i))
                return !1;
            c = !0
        }
        if (42 != a.getUint16(i + 2, !c))
            return !1;
        var k = a.getUint32(i + 4, !c);
        if (k < 8)
            return !1;
        if (d = h(a, i, i + k, p, c),
        d.ExifIFDPointer) {
            f = h(a, i, i + d.ExifIFDPointer, o, c);
            for (e in f) {
                switch (e) {
                case "LightSource":
                case "Flash":
                case "MeteringMode":
                case "ExposureProgram":
                case "SensingMethod":
                case "SceneCaptureType":
                case "SceneType":
                case "CustomRendered":
                case "WhiteBalance":
                case "GainControl":
                case "Contrast":
                case "Saturation":
                case "Sharpness":
                case "SubjectDistanceRange":
                case "FileSource":
                    f[e] = r[e][f[e]];
                    break;
                case "ExifVersion":
                case "FlashpixVersion":
                    f[e] = String.fromCharCode(f[e][0], f[e][1], f[e][2], f[e][3]);
                    break;
                case "ComponentsConfiguration":
                    f[e] = r.Components[f[e][0]] + r.Components[f[e][1]] + r.Components[f[e][2]] + r.Components[f[e][3]]
                }
                d[e] = f[e]
            }
        }
        if (d.GPSInfoIFDPointer) {
            g = h(a, i, i + d.GPSInfoIFDPointer, q, c);
            for (e in g) {
                switch (e) {
                case "GPSVersionID":
                    g[e] = g[e][0] + "." + g[e][1] + "." + g[e][2] + "." + g[e][3]
                }
                d[e] = g[e]
            }
        }
        return d
    }
    var l = this
      , m = function(a) {
        return a instanceof m ? a : this instanceof m ? void (this.EXIFwrapped = a) : new m(a)
    };
    "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = m),
    exports.EXIF = m) : l.EXIF = m;
    var o = m.Tags = {
        36864: "ExifVersion",
        40960: "FlashpixVersion",
        40961: "ColorSpace",
        40962: "PixelXDimension",
        40963: "PixelYDimension",
        37121: "ComponentsConfiguration",
        37122: "CompressedBitsPerPixel",
        37500: "MakerNote",
        37510: "UserComment",
        40964: "RelatedSoundFile",
        36867: "DateTimeOriginal",
        36868: "DateTimeDigitized",
        37520: "SubsecTime",
        37521: "SubsecTimeOriginal",
        37522: "SubsecTimeDigitized",
        33434: "ExposureTime",
        33437: "FNumber",
        34850: "ExposureProgram",
        34852: "SpectralSensitivity",
        34855: "ISOSpeedRatings",
        34856: "OECF",
        37377: "ShutterSpeedValue",
        37378: "ApertureValue",
        37379: "BrightnessValue",
        37380: "ExposureBias",
        37381: "MaxApertureValue",
        37382: "SubjectDistance",
        37383: "MeteringMode",
        37384: "LightSource",
        37385: "Flash",
        37396: "SubjectArea",
        37386: "FocalLength",
        41483: "FlashEnergy",
        41484: "SpatialFrequencyResponse",
        41486: "FocalPlaneXResolution",
        41487: "FocalPlaneYResolution",
        41488: "FocalPlaneResolutionUnit",
        41492: "SubjectLocation",
        41493: "ExposureIndex",
        41495: "SensingMethod",
        41728: "FileSource",
        41729: "SceneType",
        41730: "CFAPattern",
        41985: "CustomRendered",
        41986: "ExposureMode",
        41987: "WhiteBalance",
        41988: "DigitalZoomRation",
        41989: "FocalLengthIn35mmFilm",
        41990: "SceneCaptureType",
        41991: "GainControl",
        41992: "Contrast",
        41993: "Saturation",
        41994: "Sharpness",
        41995: "DeviceSettingDescription",
        41996: "SubjectDistanceRange",
        40965: "InteroperabilityIFDPointer",
        42016: "ImageUniqueID"
    }
      , p = m.TiffTags = {
        256: "ImageWidth",
        257: "ImageHeight",
        34665: "ExifIFDPointer",
        34853: "GPSInfoIFDPointer",
        40965: "InteroperabilityIFDPointer",
        258: "BitsPerSample",
        259: "Compression",
        262: "PhotometricInterpretation",
        274: "Orientation",
        277: "SamplesPerPixel",
        284: "PlanarConfiguration",
        530: "YCbCrSubSampling",
        531: "YCbCrPositioning",
        282: "XResolution",
        283: "YResolution",
        296: "ResolutionUnit",
        273: "StripOffsets",
        278: "RowsPerStrip",
        279: "StripByteCounts",
        513: "JPEGInterchangeFormat",
        514: "JPEGInterchangeFormatLength",
        301: "TransferFunction",
        318: "WhitePoint",
        319: "PrimaryChromaticities",
        529: "YCbCrCoefficients",
        532: "ReferenceBlackWhite",
        306: "DateTime",
        270: "ImageDescription",
        271: "Make",
        272: "Model",
        305: "Software",
        315: "Artist",
        33432: "Copyright"
    }
      , q = m.GPSTags = {
        0: "GPSVersionID",
        1: "GPSLatitudeRef",
        2: "GPSLatitude",
        3: "GPSLongitudeRef",
        4: "GPSLongitude",
        5: "GPSAltitudeRef",
        6: "GPSAltitude",
        7: "GPSTimeStamp",
        8: "GPSSatellites",
        9: "GPSStatus",
        10: "GPSMeasureMode",
        11: "GPSDOP",
        12: "GPSSpeedRef",
        13: "GPSSpeed",
        14: "GPSTrackRef",
        15: "GPSTrack",
        16: "GPSImgDirectionRef",
        17: "GPSImgDirection",
        18: "GPSMapDatum",
        19: "GPSDestLatitudeRef",
        20: "GPSDestLatitude",
        21: "GPSDestLongitudeRef",
        22: "GPSDestLongitude",
        23: "GPSDestBearingRef",
        24: "GPSDestBearing",
        25: "GPSDestDistanceRef",
        26: "GPSDestDistance",
        27: "GPSProcessingMethod",
        28: "GPSAreaInformation",
        29: "GPSDateStamp",
        30: "GPSDifferential"
    }
      , r = m.StringValues = {
        ExposureProgram: {
            0: "Not defined",
            1: "Manual",
            2: "Normal program",
            3: "Aperture priority",
            4: "Shutter priority",
            5: "Creative program",
            6: "Action program",
            7: "Portrait mode",
            8: "Landscape mode"
        },
        MeteringMode: {
            0: "Unknown",
            1: "Average",
            2: "CenterWeightedAverage",
            3: "Spot",
            4: "MultiSpot",
            5: "Pattern",
            6: "Partial",
            255: "Other"
        },
        LightSource: {
            0: "Unknown",
            1: "Daylight",
            2: "Fluorescent",
            3: "Tungsten (incandescent light)",
            4: "Flash",
            9: "Fine weather",
            10: "Cloudy weather",
            11: "Shade",
            12: "Daylight fluorescent (D 5700 - 7100K)",
            13: "Day white fluorescent (N 4600 - 5400K)",
            14: "Cool white fluorescent (W 3900 - 4500K)",
            15: "White fluorescent (WW 3200 - 3700K)",
            17: "Standard light A",
            18: "Standard light B",
            19: "Standard light C",
            20: "D55",
            21: "D65",
            22: "D75",
            23: "D50",
            24: "ISO studio tungsten",
            255: "Other"
        },
        Flash: {
            0: "Flash did not fire",
            1: "Flash fired",
            5: "Strobe return light not detected",
            7: "Strobe return light detected",
            9: "Flash fired, compulsory flash mode",
            13: "Flash fired, compulsory flash mode, return light not detected",
            15: "Flash fired, compulsory flash mode, return light detected",
            16: "Flash did not fire, compulsory flash mode",
            24: "Flash did not fire, auto mode",
            25: "Flash fired, auto mode",
            29: "Flash fired, auto mode, return light not detected",
            31: "Flash fired, auto mode, return light detected",
            32: "No flash function",
            65: "Flash fired, red-eye reduction mode",
            69: "Flash fired, red-eye reduction mode, return light not detected",
            71: "Flash fired, red-eye reduction mode, return light detected",
            73: "Flash fired, compulsory flash mode, red-eye reduction mode",
            77: "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
            79: "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
            89: "Flash fired, auto mode, red-eye reduction mode",
            93: "Flash fired, auto mode, return light not detected, red-eye reduction mode",
            95: "Flash fired, auto mode, return light detected, red-eye reduction mode"
        },
        SensingMethod: {
            1: "Not defined",
            2: "One-chip color area sensor",
            3: "Two-chip color area sensor",
            4: "Three-chip color area sensor",
            5: "Color sequential area sensor",
            7: "Trilinear sensor",
            8: "Color sequential linear sensor"
        },
        SceneCaptureType: {
            0: "Standard",
            1: "Landscape",
            2: "Portrait",
            3: "Night scene"
        },
        SceneType: {
            1: "Directly photographed"
        },
        CustomRendered: {
            0: "Normal process",
            1: "Custom process"
        },
        WhiteBalance: {
            0: "Auto white balance",
            1: "Manual white balance"
        },
        GainControl: {
            0: "None",
            1: "Low gain up",
            2: "High gain up",
            3: "Low gain down",
            4: "High gain down"
        },
        Contrast: {
            0: "Normal",
            1: "Soft",
            2: "Hard"
        },
        Saturation: {
            0: "Normal",
            1: "Low saturation",
            2: "High saturation"
        },
        Sharpness: {
            0: "Normal",
            1: "Soft",
            2: "Hard"
        },
        SubjectDistanceRange: {
            0: "Unknown",
            1: "Macro",
            2: "Close view",
            3: "Distant view"
        },
        FileSource: {
            3: "DSC"
        },
        Components: {
            0: "",
            1: "Y",
            2: "Cb",
            3: "Cr",
            4: "R",
            5: "G",
            6: "B"
        }
    }
      , s = {
        120: "caption",
        110: "credit",
        25: "keywords",
        55: "dateCreated",
        80: "byline",
        85: "bylineTitle",
        122: "captionWriter",
        105: "headline",
        116: "copyright",
        15: "category"
    };
    m.getData = function(b, c) {
        return !((b instanceof Image || b instanceof HTMLImageElement) && !b.complete || (a(b) ? c && c.call(b) : d(b, c),
        0))
    }
    ,
    m.getTag = function(b, c) {
        if (a(b))
            return b.exifdata[c]
    }
    ,
    m.getAllTags = function(b) {
        if (!a(b))
            return {};
        var c, d = b.exifdata, e = {};
        for (c in d)
            d.hasOwnProperty(c) && (e[c] = d[c]);
        return e
    }
    ,
    m.pretty = function(b) {
        if (!a(b))
            return "";
        var c, d = b.exifdata, e = "";
        for (c in d)
            d.hasOwnProperty(c) && (e += "object" == typeof d[c] ? d[c]instanceof Number ? c + " : " + d[c] + " [" + d[c].numerator + "/" + d[c].denominator + "]\r\n" : c + " : [" + d[c].length + " values]\r\n" : c + " : " + d[c] + "\r\n");
        return e
    }
    ,
    m.readFromBinaryFile = function(a) {
        return e(a)
    }
    ,
    "function" == typeof define && define.amd && define("exif-js", [], function() {
        return m
    })
}
.call(this),
function() {
    "use strict";
    function a(b, d) {
        function e(a, b) {
            return function() {
                return a.apply(b, arguments)
            }
        }
        var f;
        if (d = d || {},
        this.trackingClick = !1,
        this.trackingClickStart = 0,
        this.targetElement = null,
        this.touchStartX = 0,
        this.touchStartY = 0,
        this.lastTouchIdentifier = 0,
        this.touchBoundary = d.touchBoundary || 10,
        this.layer = b,
        this.tapDelay = d.tapDelay || 200,
        this.tapTimeout = d.tapTimeout || 700,
        !a.notNeeded(b)) {
            for (var g = ["onMouse", "onClick", "onTouchStart", "onTouchMove", "onTouchEnd", "onTouchCancel"], h = this, i = 0, j = g.length; i < j; i++)
                h[g[i]] = e(h[g[i]], h);
            c && (b.addEventListener("mouseover", this.onMouse, !0),
            b.addEventListener("mousedown", this.onMouse, !0),
            b.addEventListener("mouseup", this.onMouse, !0)),
            b.addEventListener("click", this.onClick, !0),
            b.addEventListener("touchstart", this.onTouchStart, !1),
            b.addEventListener("touchmove", this.onTouchMove, !1),
            b.addEventListener("touchend", this.onTouchEnd, !1),
            b.addEventListener("touchcancel", this.onTouchCancel, !1),
            Event.prototype.stopImmediatePropagation || (b.removeEventListener = function(a, c, d) {
                var e = Node.prototype.removeEventListener;
                "click" === a ? e.call(b, a, c.hijacked || c, d) : e.call(b, a, c, d)
            }
            ,
            b.addEventListener = function(a, c, d) {
                var e = Node.prototype.addEventListener;
                "click" === a ? e.call(b, a, c.hijacked || (c.hijacked = function(a) {
                    a.propagationStopped || c(a)
                }
                ), d) : e.call(b, a, c, d)
            }
            ),
            "function" == typeof b.onclick && (f = b.onclick,
            b.addEventListener("click", function(a) {
                f(a)
            }, !1),
            b.onclick = null)
        }
    }
    var b = navigator.userAgent.indexOf("Windows Phone") >= 0
      , c = navigator.userAgent.indexOf("Android") > 0 && !b
      , d = /iP(ad|hone|od)/.test(navigator.userAgent) && !b
      , e = d && /OS 4_\d(_\d)?/.test(navigator.userAgent)
      , f = d && /OS [6-7]_\d/.test(navigator.userAgent)
      , g = navigator.userAgent.indexOf("BB10") > 0;
    a.prototype.needsClick = function(a) {
        switch (a.nodeName.toLowerCase()) {
        case "button":
        case "select":
        case "textarea":
            return !0;
        case "input":
            return !0;
        case "label":
        case "iframe":
        case "video":
            return !0
        }
        return /\bneedsclick\b/.test(a.className)
    }
    ,
    a.prototype.needsFocus = function(a) {
        switch (a.nodeName.toLowerCase()) {
        case "textarea":
            return !1;
        case "select":
            return !c;
        case "input":
            return !1;
        default:
            return /\bneedsfocus\b/.test(a.className)
        }
    }
    ,
    a.prototype.sendClick = function(a, b) {
        var c, d;
        document.activeElement && document.activeElement !== a && document.activeElement.blur(),
        d = b.changedTouches[0],
        c = document.createEvent("MouseEvents"),
        c.initMouseEvent(this.determineEventType(a), !0, !0, window, 1, d.screenX, d.screenY, d.clientX, d.clientY, !1, !1, !1, !1, 0, null),
        c.forwardedTouchEvent = !0,
        a.dispatchEvent(c)
    }
    ,
    a.prototype.determineEventType = function(a) {
        return c && "select" === a.tagName.toLowerCase() ? "mousedown" : "click"
    }
    ,
    a.prototype.focus = function(a) {
        var b;
        d && a.setSelectionRange && 0 !== a.type.indexOf("date") && "time" !== a.type && "month" !== a.type ? (b = a.value.length,
        a.setSelectionRange(b, b)) : a.focus()
    }
    ,
    a.prototype.updateScrollParent = function(a) {
        var b, c;
        if (b = a.fastClickScrollParent,
        !b || !b.contains(a)) {
            c = a;
            do {
                if (c.scrollHeight > c.offsetHeight) {
                    b = c,
                    a.fastClickScrollParent = c;
                    break
                }
                c = c.parentElement
            } while (c)
        }
        b && (b.fastClickLastScrollTop = b.scrollTop)
    }
    ,
    a.prototype.getTargetElementFromEventTarget = function(a) {
        return a.nodeType === Node.TEXT_NODE ? a.parentNode : a
    }
    ,
    a.prototype.onTouchStart = function(a) {
        var b, c, f;
        if (a.targetTouches.length > 1)
            return !0;
        if (b = this.getTargetElementFromEventTarget(a.target),
        c = a.targetTouches[0],
        d) {
            if (f = window.getSelection(),
            f.rangeCount && !f.isCollapsed)
                return !0;
            if (!e) {
                if (c.identifier && c.identifier === this.lastTouchIdentifier)
                    return a.preventDefault(),
                    !1;
                this.lastTouchIdentifier = c.identifier,
                this.updateScrollParent(b)
            }
        }
        return this.trackingClick = !0,
        this.trackingClickStart = a.timeStamp,
        this.targetElement = b,
        this.touchStartX = c.pageX,
        this.touchStartY = c.pageY,
        a.timeStamp - this.lastClickTime < this.tapDelay && a.preventDefault(),
        !0
    }
    ,
    a.prototype.touchHasMoved = function(a) {
        var b = a.changedTouches[0]
          , c = this.touchBoundary;
        return Math.abs(b.pageX - this.touchStartX) > c || Math.abs(b.pageY - this.touchStartY) > c
    }
    ,
    a.prototype.onTouchMove = function(a) {
        return !this.trackingClick || ((this.targetElement !== this.getTargetElementFromEventTarget(a.target) || this.touchHasMoved(a)) && (this.trackingClick = !1,
        this.targetElement = null),
        !0)
    }
    ,
    a.prototype.findControl = function(a) {
        return void 0 !== a.control ? a.control : a.htmlFor ? document.getElementById(a.htmlFor) : a.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")
    }
    ,
    a.prototype.onTouchEnd = function(a) {
        var b, g, h, i, j, k = this.targetElement;
        if (!this.trackingClick)
            return !0;
        if (a.timeStamp - this.lastClickTime < this.tapDelay)
            return this.cancelNextClick = !0,
            !0;
        if (a.timeStamp - this.trackingClickStart > this.tapTimeout)
            return !0;
        if (this.cancelNextClick = !1,
        this.lastClickTime = a.timeStamp,
        g = this.trackingClickStart,
        this.trackingClick = !1,
        this.trackingClickStart = 0,
        f && (j = a.changedTouches[0],
        k = document.elementFromPoint(j.pageX - window.pageXOffset, j.pageY - window.pageYOffset) || k,
        k.fastClickScrollParent = this.targetElement.fastClickScrollParent),
        h = k.tagName.toLowerCase(),
        "label" === h) {
            if (b = this.findControl(k)) {
                if (this.focus(k),
                c)
                    return !1;
                k = b
            }
        } else if (this.needsFocus(k))
            return a.timeStamp - g > 100 || d && window.top !== window && "input" === h ? (this.targetElement = null,
            !1) : (this.focus(k),
            this.sendClick(k, a),
            d && "select" === h || (this.targetElement = null,
            a.preventDefault()),
            !1);
        return !(!d || e || (i = k.fastClickScrollParent,
        !i || i.fastClickLastScrollTop === i.scrollTop)) || (this.needsClick(k) || (a.preventDefault(),
        this.sendClick(k, a)),
        !1)
    }
    ,
    a.prototype.onTouchCancel = function() {
        this.trackingClick = !1,
        this.targetElement = null
    }
    ,
    a.prototype.onMouse = function(a) {
        return !(this.targetElement && !a.forwardedTouchEvent && a.cancelable && (!this.needsClick(this.targetElement) || this.cancelNextClick) && (a.stopImmediatePropagation ? a.stopImmediatePropagation() : a.propagationStopped = !0,
        a.stopPropagation(),
        a.preventDefault(),
        1))
    }
    ,
    a.prototype.onClick = function(a) {
        var b;
        return this.trackingClick ? (this.targetElement = null,
        this.trackingClick = !1,
        !0) : "submit" === a.target.type && 0 === a.detail || (b = this.onMouse(a),
        b || (this.targetElement = null),
        b)
    }
    ,
    a.prototype.destroy = function() {
        var a = this.layer;
        c && (a.removeEventListener("mouseover", this.onMouse, !0),
        a.removeEventListener("mousedown", this.onMouse, !0),
        a.removeEventListener("mouseup", this.onMouse, !0)),
        a.removeEventListener("click", this.onClick, !0),
        a.removeEventListener("touchstart", this.onTouchStart, !1),
        a.removeEventListener("touchmove", this.onTouchMove, !1),
        a.removeEventListener("touchend", this.onTouchEnd, !1),
        a.removeEventListener("touchcancel", this.onTouchCancel, !1)
    }
    ,
    a.notNeeded = function(a) {
        var b, d, e, f;
        if (void 0 === window.ontouchstart)
            return !0;
        if (d = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1]) {
            if (!c)
                return !0;
            if (b = document.querySelector("meta[name=viewport]")) {
                if (b.content.indexOf("user-scalable=no") !== -1)
                    return !0;
                if (d > 31 && document.documentElement.scrollWidth <= window.outerWidth)
                    return !0
            }
        }
        if (g && (e = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/),
        e[1] >= 10 && e[2] >= 3 && (b = document.querySelector("meta[name=viewport]")))) {
            if (b.content.indexOf("user-scalable=no") !== -1)
                return !0;
            if (document.documentElement.scrollWidth <= window.outerWidth)
                return !0
        }
        return "none" === a.style.msTouchAction || "manipulation" === a.style.touchAction || (f = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1],
        !!(f >= 27 && (b = document.querySelector("meta[name=viewport]"),
        b && (b.content.indexOf("user-scalable=no") !== -1 || document.documentElement.scrollWidth <= window.outerWidth))) || "none" === a.style.touchAction || "manipulation" === a.style.touchAction)
    }
    ,
    a.attach = function(b, c) {
        return new a(b,c)
    }
    ,
    "function" == typeof define && "object" == typeof define.amd && define.amd ? define("fastclick", [], function() {
        return a
    }) : "undefined" != typeof module && module.exports ? (module.exports = a.attach,
    module.exports.FastClick = a) : window.FastClick = a
}(),
Function.prototype.bind || (Function.prototype.bind = function(a) {
    if ("function" != typeof this)
        throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    var b = Array.prototype.slice.call(arguments, 1)
      , c = this
      , d = function() {}
      , e = function() {
        return c.apply(this instanceof d && a ? this : a, b.concat(Array.prototype.slice.call(arguments)))
    };
    return d.prototype = this.prototype,
    e.prototype = new d,
    e
}
);
var TWEEN = TWEEN || function() {
    var a = [];
    return {
        getAll: function() {
            return a
        },
        removeAll: function() {
            a = []
        },
        add: function(b) {
            a.push(b)
        },
        remove: function(b) {
            var c = a.indexOf(b);
            c !== -1 && a.splice(c, 1)
        },
        update: function(b, c) {
            if (0 === a.length)
                return !1;
            var d = 0;
            for (b = void 0 !== b ? b : TWEEN.now(); d < a.length; )
                a[d].update(b) || c ? d++ : a.splice(d, 1);
            return !0
        }
    }
}();
(function() {
    void 0 === this.window && void 0 !== this.process ? TWEEN.now = function() {
        var a = process.hrtime();
        return 1e3 * a[0] + a[1] / 1e3
    }
    : void 0 !== this.window && void 0 !== window.performance && void 0 !== window.performance.now ? TWEEN.now = window.performance.now.bind(window.performance) : void 0 !== Date.now ? TWEEN.now = Date.now : TWEEN.now = function() {
        return (new Date).getTime()
    }
}
).bind(this)(),
TWEEN.Tween = function(a) {
    var b, c = a, d = {}, e = {}, f = {}, g = 1e3, h = 0, i = !1, j = !1, k = !1, l = 0, m = null, n = TWEEN.Easing.Linear.None, o = TWEEN.Interpolation.Linear, p = [], q = null, r = !1, s = null, t = null, u = null;
    for (var v in a)
        d[v] = parseFloat(a[v], 10);
    this.to = function(a, b) {
        return void 0 !== b && (g = b),
        e = a,
        this
    }
    ,
    this.start = function(a) {
        TWEEN.add(this),
        j = !0,
        r = !1,
        m = void 0 !== a ? a : TWEEN.now(),
        m += l;
        for (var b in e) {
            if (e[b]instanceof Array) {
                if (0 === e[b].length)
                    continue;
                e[b] = [c[b]].concat(e[b])
            }
            void 0 !== d[b] && (d[b] = c[b],
            d[b]instanceof Array == 0 && (d[b] *= 1),
            f[b] = d[b] || 0)
        }
        return this
    }
    ,
    this.stop = function() {
        return j ? (TWEEN.remove(this),
        j = !1,
        null !== u && u.call(c),
        this.stopChainedTweens(),
        this) : this
    }
    ,
    this.end = function() {
        return this.update(m + g),
        this
    }
    ,
    this.stopChainedTweens = function() {
        for (var a = 0, b = p.length; a < b; a++)
            p[a].stop()
    }
    ,
    this.delay = function(a) {
        return l = a,
        this
    }
    ,
    this.repeat = function(a) {
        return h = a,
        this
    }
    ,
    this.repeatDelay = function(a) {
        return b = a,
        this
    }
    ,
    this.yoyo = function(a) {
        return i = a,
        this
    }
    ,
    this.easing = function(a) {
        return n = a,
        this
    }
    ,
    this.interpolation = function(a) {
        return o = a,
        this
    }
    ,
    this.chain = function() {
        return p = arguments,
        this
    }
    ,
    this.onStart = function(a) {
        return q = a,
        this
    }
    ,
    this.onUpdate = function(a) {
        return s = a,
        this
    }
    ,
    this.onComplete = function(a) {
        return t = a,
        this
    }
    ,
    this.onStop = function(a) {
        return u = a,
        this
    }
    ,
    this.update = function(a) {
        var j, u, v;
        if (a < m)
            return !0;
        r === !1 && (null !== q && q.call(c),
        r = !0),
        u = (a - m) / g,
        u = u > 1 ? 1 : u,
        v = n(u);
        for (j in e)
            if (void 0 !== d[j]) {
                var w = d[j] || 0
                  , x = e[j];
                x instanceof Array ? c[j] = o(x, v) : ("string" == typeof x && (x = "+" === x.charAt(0) || "-" === x.charAt(0) ? w + parseFloat(x, 10) : parseFloat(x, 10)),
                "number" == typeof x && (c[j] = w + (x - w) * v))
            }
        if (null !== s && s.call(c, v),
        1 === u) {
            if (h > 0) {
                isFinite(h) && h--;
                for (j in f) {
                    if ("string" == typeof e[j] && (f[j] = f[j] + parseFloat(e[j], 10)),
                    i) {
                        var y = f[j];
                        f[j] = e[j],
                        e[j] = y
                    }
                    d[j] = f[j]
                }
                return i && (k = !k),
                m = void 0 !== b ? a + b : a + l,
                !0
            }
            null !== t && t.call(c);
            for (var z = 0, A = p.length; z < A; z++)
                p[z].start(m + g);
            return !1
        }
        return !0
    }
}
,
TWEEN.Easing = {
    Linear: {
        None: function(a) {
            return a
        }
    },
    Quadratic: {
        In: function(a) {
            return a * a
        },
        Out: function(a) {
            return a * (2 - a)
        },
        InOut: function(a) {
            return (a *= 2) < 1 ? .5 * a * a : -.5 * (--a * (a - 2) - 1)
        }
    },
    Cubic: {
        In: function(a) {
            return a * a * a
        },
        Out: function(a) {
            return --a * a * a + 1
        },
        InOut: function(a) {
            return (a *= 2) < 1 ? .5 * a * a * a : .5 * ((a -= 2) * a * a + 2)
        }
    },
    Quartic: {
        In: function(a) {
            return a * a * a * a
        },
        Out: function(a) {
            return 1 - --a * a * a * a
        },
        InOut: function(a) {
            return (a *= 2) < 1 ? .5 * a * a * a * a : -.5 * ((a -= 2) * a * a * a - 2)
        }
    },
    Quintic: {
        In: function(a) {
            return a * a * a * a * a
        },
        Out: function(a) {
            return --a * a * a * a * a + 1
        },
        InOut: function(a) {
            return (a *= 2) < 1 ? .5 * a * a * a * a * a : .5 * ((a -= 2) * a * a * a * a + 2)
        }
    },
    Sinusoidal: {
        In: function(a) {
            return 1 - Math.cos(a * Math.PI / 2)
        },
        Out: function(a) {
            return Math.sin(a * Math.PI / 2)
        },
        InOut: function(a) {
            return .5 * (1 - Math.cos(Math.PI * a))
        }
    },
    Exponential: {
        In: function(a) {
            return 0 === a ? 0 : Math.pow(1024, a - 1)
        },
        Out: function(a) {
            return 1 === a ? 1 : 1 - Math.pow(2, -10 * a)
        },
        InOut: function(a) {
            return 0 === a ? 0 : 1 === a ? 1 : (a *= 2) < 1 ? .5 * Math.pow(1024, a - 1) : .5 * (-Math.pow(2, -10 * (a - 1)) + 2)
        }
    },
    Circular: {
        In: function(a) {
            return 1 - Math.sqrt(1 - a * a)
        },
        Out: function(a) {
            return Math.sqrt(1 - --a * a)
        },
        InOut: function(a) {
            return (a *= 2) < 1 ? -.5 * (Math.sqrt(1 - a * a) - 1) : .5 * (Math.sqrt(1 - (a -= 2) * a) + 1)
        }
    },
    Elastic: {
        In: function(a) {
            return 0 === a ? 0 : 1 === a ? 1 : -Math.pow(2, 10 * (a - 1)) * Math.sin(5 * (a - 1.1) * Math.PI)
        },
        Out: function(a) {
            return 0 === a ? 0 : 1 === a ? 1 : Math.pow(2, -10 * a) * Math.sin(5 * (a - .1) * Math.PI) + 1
        },
        InOut: function(a) {
            return 0 === a ? 0 : 1 === a ? 1 : (a *= 2,
            a < 1 ? -.5 * Math.pow(2, 10 * (a - 1)) * Math.sin(5 * (a - 1.1) * Math.PI) : .5 * Math.pow(2, -10 * (a - 1)) * Math.sin(5 * (a - 1.1) * Math.PI) + 1)
        }
    },
    Back: {
        In: function(a) {
            var b = 1.70158;
            return a * a * ((b + 1) * a - b)
        },
        Out: function(a) {
            var b = 1.70158;
            return --a * a * ((b + 1) * a + b) + 1
        },
        InOut: function(a) {
            var b = 2.5949095;
            return (a *= 2) < 1 ? .5 * (a * a * ((b + 1) * a - b)) : .5 * ((a -= 2) * a * ((b + 1) * a + b) + 2)
        }
    },
    Bounce: {
        In: function(a) {
            return 1 - TWEEN.Easing.Bounce.Out(1 - a)
        },
        Out: function(a) {
            return a < 1 / 2.75 ? 7.5625 * a * a : a < 2 / 2.75 ? 7.5625 * (a -= 1.5 / 2.75) * a + .75 : a < 2.5 / 2.75 ? 7.5625 * (a -= 2.25 / 2.75) * a + .9375 : 7.5625 * (a -= 2.625 / 2.75) * a + .984375
        },
        InOut: function(a) {
            return a < .5 ? .5 * TWEEN.Easing.Bounce.In(2 * a) : .5 * TWEEN.Easing.Bounce.Out(2 * a - 1) + .5
        }
    }
},
TWEEN.Interpolation = {
    Linear: function(a, b) {
        var c = a.length - 1
          , d = c * b
          , e = Math.floor(d)
          , f = TWEEN.Interpolation.Utils.Linear;
        return b < 0 ? f(a[0], a[1], d) : b > 1 ? f(a[c], a[c - 1], c - d) : f(a[e], a[e + 1 > c ? c : e + 1], d - e)
    },
    Bezier: function(a, b) {
        for (var c = 0, d = a.length - 1, e = Math.pow, f = TWEEN.Interpolation.Utils.Bernstein, g = 0; g <= d; g++)
            c += e(1 - b, d - g) * e(b, g) * a[g] * f(d, g);
        return c
    },
    CatmullRom: function(a, b) {
        var c = a.length - 1
          , d = c * b
          , e = Math.floor(d)
          , f = TWEEN.Interpolation.Utils.CatmullRom;
        return a[0] === a[c] ? (b < 0 && (e = Math.floor(d = c * (1 + b))),
        f(a[(e - 1 + c) % c], a[e], a[(e + 1) % c], a[(e + 2) % c], d - e)) : b < 0 ? a[0] - (f(a[0], a[0], a[1], a[1], -d) - a[0]) : b > 1 ? a[c] - (f(a[c], a[c], a[c - 1], a[c - 1], d - c) - a[c]) : f(a[e ? e - 1 : 0], a[e], a[c < e + 1 ? c : e + 1], a[c < e + 2 ? c : e + 2], d - e)
    },
    Utils: {
        Linear: function(a, b, c) {
            return (b - a) * c + a
        },
        Bernstein: function(a, b) {
            var c = TWEEN.Interpolation.Utils.Factorial;
            return c(a) / c(b) / c(a - b)
        },
        Factorial: function() {
            var a = [1];
            return function(b) {
                var c = 1;
                if (a[b])
                    return a[b];
                for (var d = b; d > 1; d--)
                    c *= d;
                return a[b] = c,
                c
            }
        }(),
        CatmullRom: function(a, b, c, d, e) {
            var f = .5 * (c - a)
              , g = .5 * (d - b)
              , h = e * e;
            return (2 * b - 2 * c + f + g) * (e * h) + (-3 * b + 3 * c - 2 * f - g) * h + f * e + b
        }
    }
},
function(a) {
    "function" == typeof define && define.amd ? define([], function() {
        return TWEEN
    }) : "undefined" != typeof module && "object" == typeof exports ? module.exports = TWEEN : void 0 !== a && (a.TWEEN = TWEEN)
}(this),
window.requestAnimFrame = function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(a) {
        window.setTimeout(a, 1e3 / 60)
    }
}(),
requestAnimFrame(animate);
var animate_callback = [], requirejs, require, define;
!function(ba) {
    function G(a) {
        return "[object Function]" === K.call(a)
    }
    function H(a) {
        return "[object Array]" === K.call(a)
    }
    function v(a, b) {
        if (a) {
            var c;
            for (c = 0; c < a.length && (!a[c] || !b(a[c], c, a)); c += 1)
                ;
        }
    }
    function T(a, b) {
        if (a) {
            var c;
            for (c = a.length - 1; -1 < c && (!a[c] || !b(a[c], c, a)); c -= 1)
                ;
        }
    }
    function t(a, b) {
        return fa.call(a, b)
    }
    function n(a, b) {
        return t(a, b) && a[b]
    }
    function A(a, b) {
        for (var c in a)
            if (t(a, c) && b(a[c], c))
                break
    }
    function U(a, b, c, d) {
        return b && A(b, function(b, e) {
            !c && t(a, e) || (!d || "object" != typeof b || !b || H(b) || G(b) || b instanceof RegExp ? a[e] = b : (a[e] || (a[e] = {}),
            U(a[e], b, c, d)))
        }),
        a
    }
    function u(a, b) {
        return function() {
            return b.apply(a, arguments)
        }
    }
    function ca(a) {
        throw a
    }
    function da(a) {
        if (!a)
            return a;
        var b = ba;
        return v(a.split("."), function(a) {
            b = b[a]
        }),
        b
    }
    function B(a, b, c, d) {
        return b = Error(b + "\nhttp://requirejs.org/docs/errors.html#" + a),
        b.requireType = a,
        b.requireModules = d,
        c && (b.originalError = c),
        b
    }
    function ga(a) {
        function b(a, b, c) {
            var d, e, f, g, h, i, j, k, b = b && b.split("/"), l = D.map, m = l && l["*"];
            if (a) {
                for (a = a.split("/"),
                e = a.length - 1,
                D.nodeIdCompat && Q.test(a[e]) && (a[e] = a[e].replace(Q, "")),
                "." === a[0].charAt(0) && b && (e = b.slice(0, b.length - 1),
                a = e.concat(a)),
                e = a,
                f = 0; f < e.length; f++)
                    g = e[f],
                    "." === g ? (e.splice(f, 1),
                    f -= 1) : ".." === g && 0 !== f && (1 !== f || ".." !== e[2]) && ".." !== e[f - 1] && 0 < f && (e.splice(f - 1, 2),
                    f -= 2);
                a = a.join("/")
            }
            if (c && l && (b || m)) {
                e = a.split("/"),
                f = e.length;
                a: for (; 0 < f; f -= 1) {
                    if (h = e.slice(0, f).join("/"),
                    b)
                        for (g = b.length; 0 < g; g -= 1)
                            if ((c = n(l, b.slice(0, g).join("/"))) && (c = n(c, h))) {
                                d = c,
                                i = f;
                                break a
                            }
                    !j && m && n(m, h) && (j = n(m, h),
                    k = f)
                }
                !d && j && (d = j,
                i = k),
                d && (e.splice(0, i, d),
                a = e.join("/"))
            }
            return (d = n(D.pkgs, a)) ? d : a
        }
        function c(a) {
            z && v(document.getElementsByTagName("script"), function(b) {
                if (b.getAttribute("data-requiremodule") === a && b.getAttribute("data-requirecontext") === x.contextName)
                    return b.parentNode.removeChild(b),
                    !0
            })
        }
        function d(a) {
            var b = n(D.paths, a);
            if (b && H(b) && 1 < b.length)
                return b.shift(),
                x.require.undef(a),
                x.makeRequire(null, {
                    skipMap: !0
                })([a]),
                !0
        }
        function f(a) {
            var b, c = a ? a.indexOf("!") : -1;
            return -1 < c && (b = a.substring(0, c),
            a = a.substring(c + 1, a.length)),
            [b, a]
        }
        function g(a, c, d, e) {
            var g, h, i = null, j = c ? c.name : null, k = a, l = !0, m = "";
            return a || (l = !1,
            a = "_@r" + (P += 1)),
            a = f(a),
            i = a[0],
            a = a[1],
            i && (i = b(i, j, e),
            h = n(K, i)),
            a && (i ? m = h && h.normalize ? h.normalize(a, function(a) {
                return b(a, j, e)
            }) : -1 === a.indexOf("!") ? b(a, j, e) : a : (m = b(a, j, e),
            a = f(m),
            i = a[0],
            m = a[1],
            d = !0,
            g = x.nameToUrl(m))),
            d = !i || h || d ? "" : "_unnormalized" + (S += 1),
            {
                prefix: i,
                name: m,
                parentMap: c,
                unnormalized: !!d,
                url: g,
                originalName: k,
                isDefine: l,
                id: (i ? i + "!" + m : m) + d
            }
        }
        function h(a) {
            var b = a.id
              , c = n(E, b);
            return c || (c = E[b] = new x.Module(a)),
            c
        }
        function i(a, b, c) {
            var d = a.id
              , e = n(E, d);
            !t(K, d) || e && !e.defineEmitComplete ? (e = h(a),
            e.error && "error" === b ? c(e.error) : e.on(b, c)) : "defined" === b && c(K[d])
        }
        function j(a, b) {
            var c = a.requireModules
              , d = !1;
            b ? b(a) : (v(c, function(b) {
                (b = n(E, b)) && (b.error = a,
                b.events.error && (d = !0,
                b.emit("error", a)))
            }),
            d || e.onError(a))
        }
        function k() {
            R.length && (v(R, function(a) {
                var b = a[0];
                "string" == typeof b && (x.defQueueMap[b] = !0),
                J.push(a)
            }),
            R = [])
        }
        function l(a) {
            delete E[a],
            delete F[a]
        }
        function m(a, b, c) {
            var d = a.map.id;
            a.error ? a.emit("error", a.error) : (b[d] = !0,
            v(a.depMaps, function(d, e) {
                var f = d.id
                  , g = n(E, f);
                g && !a.depMatched[e] && !c[f] && (n(b, f) ? (a.defineDep(e, K[f]),
                a.check()) : m(g, b, c))
            }),
            c[d] = !0)
        }
        function o() {
            var a, b, e = (a = 1e3 * D.waitSeconds) && x.startTime + a < (new Date).getTime(), f = [], g = [], h = !1, i = !0;
            if (!s) {
                if (s = !0,
                A(F, function(a) {
                    var j = a.map
                      , k = j.id;
                    if (a.enabled && (j.isDefine || g.push(a),
                    !a.error))
                        if (!a.inited && e)
                            d(k) ? h = b = !0 : (f.push(k),
                            c(k));
                        else if (!a.inited && a.fetched && j.isDefine && (h = !0,
                        !j.prefix))
                            return i = !1
                }),
                e && f.length)
                    return a = B("timeout", "Load timeout for modules: " + f, null, f),
                    a.contextName = x.contextName,
                    j(a);
                i && v(g, function(a) {
                    m(a, {}, {})
                }),
                e && !b || !h || !z && !ea || C || (C = setTimeout(function() {
                    C = 0,
                    o()
                }, 50)),
                s = !1
            }
        }
        function p(a) {
            t(K, a[0]) || h(g(a[0], null, !0)).init(a[1], a[2])
        }
        function q(a) {
            var a = a.currentTarget || a.srcElement
              , b = x.onScriptLoad;
            return a.detachEvent && !Y ? a.detachEvent("onreadystatechange", b) : a.removeEventListener("load", b, !1),
            b = x.onScriptError,
            (!a.detachEvent || Y) && a.removeEventListener("error", b, !1),
            {
                node: a,
                id: a && a.getAttribute("data-requiremodule")
            }
        }
        function r() {
            var a;
            for (k(); J.length; ) {
                if (a = J.shift(),
                null === a[0])
                    return j(B("mismatch", "Mismatched anonymous define() module: " + a[a.length - 1]));
                p(a)
            }
            x.defQueueMap = {}
        }
        var s, w, x, y, C, D = {
            waitSeconds: 7,
            baseUrl: "./",
            paths: {},
            bundles: {},
            pkgs: {},
            shim: {},
            config: {}
        }, E = {}, F = {}, I = {}, J = [], K = {}, L = {}, O = {}, P = 1, S = 1;
        return y = {
            require: function(a) {
                return a.require ? a.require : a.require = x.makeRequire(a.map)
            },
            exports: function(a) {
                if (a.usingExports = !0,
                a.map.isDefine)
                    return a.exports ? K[a.map.id] = a.exports : a.exports = K[a.map.id] = {}
            },
            module: function(a) {
                return a.module ? a.module : a.module = {
                    id: a.map.id,
                    uri: a.map.url,
                    config: function() {
                        return n(D.config, a.map.id) || {}
                    },
                    exports: a.exports || (a.exports = {})
                }
            }
        },
        w = function(a) {
            this.events = n(I, a.id) || {},
            this.map = a,
            this.shim = n(D.shim, a.id),
            this.depExports = [],
            this.depMaps = [],
            this.depMatched = [],
            this.pluginMaps = {},
            this.depCount = 0
        }
        ,
        w.prototype = {
            init: function(a, b, c, d) {
                d = d || {},
                this.inited || (this.factory = b,
                c ? this.on("error", c) : this.events.error && (c = u(this, function(a) {
                    this.emit("error", a)
                })),
                this.depMaps = a && a.slice(0),
                this.errback = c,
                this.inited = !0,
                this.ignore = d.ignore,
                d.enabled || this.enabled ? this.enable() : this.check())
            },
            defineDep: function(a, b) {
                this.depMatched[a] || (this.depMatched[a] = !0,
                this.depCount -= 1,
                this.depExports[a] = b)
            },
            fetch: function() {
                if (!this.fetched) {
                    this.fetched = !0,
                    x.startTime = (new Date).getTime();
                    var a = this.map;
                    if (!this.shim)
                        return a.prefix ? this.callPlugin() : this.load();
                    x.makeRequire(this.map, {
                        enableBuildCallback: !0
                    })(this.shim.deps || [], u(this, function() {
                        return a.prefix ? this.callPlugin() : this.load()
                    }))
                }
            },
            load: function() {
                var a = this.map.url;
                L[a] || (L[a] = !0,
                x.load(this.map.id, a))
            },
            check: function() {
                if (this.enabled && !this.enabling) {
                    var a, b, c = this.map.id;
                    b = this.depExports;
                    var d = this.exports
                      , f = this.factory;
                    if (this.inited) {
                        if (this.error)
                            this.emit("error", this.error);
                        else if (!this.defining) {
                            if (this.defining = !0,
                            1 > this.depCount && !this.defined) {
                                if (G(f)) {
                                    if (this.events.error && this.map.isDefine || e.onError !== ca)
                                        try {
                                            d = x.execCb(c, f, b, d)
                                        } catch (b) {
                                            a = b
                                        }
                                    else
                                        d = x.execCb(c, f, b, d);
                                    if (this.map.isDefine && void 0 === d && ((b = this.module) ? d = b.exports : this.usingExports && (d = this.exports)),
                                    a)
                                        return a.requireMap = this.map,
                                        a.requireModules = this.map.isDefine ? [this.map.id] : null,
                                        a.requireType = this.map.isDefine ? "define" : "require",
                                        j(this.error = a)
                                } else
                                    d = f;
                                this.exports = d,
                                this.map.isDefine && !this.ignore && (K[c] = d,
                                e.onResourceLoad) && e.onResourceLoad(x, this.map, this.depMaps),
                                l(c),
                                this.defined = !0
                            }
                            this.defining = !1,
                            this.defined && !this.defineEmitted && (this.defineEmitted = !0,
                            this.emit("defined", this.exports),
                            this.defineEmitComplete = !0)
                        }
                    } else
                        t(x.defQueueMap, c) || this.fetch()
                }
            },
            callPlugin: function() {
                var a = this.map
                  , c = a.id
                  , d = g(a.prefix);
                this.depMaps.push(d),
                i(d, "defined", u(this, function(d) {
                    var f, k;
                    k = n(O, this.map.id);
                    var m = this.map.name
                      , o = this.map.parentMap ? this.map.parentMap.name : null
                      , p = x.makeRequire(a.parentMap, {
                        enableBuildCallback: !0
                    });
                    this.map.unnormalized ? (d.normalize && (m = d.normalize(m, function(a) {
                        return b(a, o, !0)
                    }) || ""),
                    d = g(a.prefix + "!" + m, this.map.parentMap),
                    i(d, "defined", u(this, function(a) {
                        this.init([], function() {
                            return a
                        }, null, {
                            enabled: !0,
                            ignore: !0
                        })
                    })),
                    (k = n(E, d.id)) && (this.depMaps.push(d),
                    this.events.error && k.on("error", u(this, function(a) {
                        this.emit("error", a)
                    })),
                    k.enable())) : k ? (this.map.url = x.nameToUrl(k),
                    this.load()) : (f = u(this, function(a) {
                        this.init([], function() {
                            return a
                        }, null, {
                            enabled: !0
                        })
                    }),
                    f.error = u(this, function(a) {
                        this.inited = !0,
                        this.error = a,
                        a.requireModules = [c],
                        A(E, function(a) {
                            0 === a.map.id.indexOf(c + "_unnormalized") && l(a.map.id)
                        }),
                        j(a)
                    }),
                    f.fromText = u(this, function(b, d) {
                        var i = a.name
                          , k = g(i)
                          , l = M;
                        d && (b = d),
                        l && (M = !1),
                        h(k),
                        t(D.config, c) && (D.config[i] = D.config[c]);
                        try {
                            e.exec(b)
                        } catch (a) {
                            return j(B("fromtexteval", "fromText eval for " + c + " failed: " + a, a, [c]))
                        }
                        l && (M = !0),
                        this.depMaps.push(k),
                        x.completeLoad(i),
                        p([i], f)
                    }),
                    d.load(a.name, p, f, D))
                })),
                x.enable(d, this),
                this.pluginMaps[d.id] = d
            },
            enable: function() {
                F[this.map.id] = this,
                this.enabling = this.enabled = !0,
                v(this.depMaps, u(this, function(a, b) {
                    var c, d;
                    if ("string" == typeof a) {
                        if (a = g(a, this.map.isDefine ? this.map : this.map.parentMap, !1, !this.skipMap),
                        this.depMaps[b] = a,
                        c = n(y, a.id))
                            return void (this.depExports[b] = c(this));
                        this.depCount += 1,
                        i(a, "defined", u(this, function(a) {
                            this.undefed || (this.defineDep(b, a),
                            this.check())
                        })),
                        this.errback ? i(a, "error", u(this, this.errback)) : this.events.error && i(a, "error", u(this, function(a) {
                            this.emit("error", a)
                        }))
                    }
                    c = a.id,
                    d = E[c],
                    !t(y, c) && d && !d.enabled && x.enable(a, this)
                })),
                A(this.pluginMaps, u(this, function(a) {
                    var b = n(E, a.id);
                    b && !b.enabled && x.enable(a, this)
                })),
                this.enabling = !1,
                this.check()
            },
            on: function(a, b) {
                var c = this.events[a];
                c || (c = this.events[a] = []),
                c.push(b)
            },
            emit: function(a, b) {
                v(this.events[a], function(a) {
                    a(b)
                }),
                "error" === a && delete this.events[a]
            }
        },
        x = {
            config: D,
            contextName: a,
            registry: E,
            defined: K,
            urlFetched: L,
            defQueue: J,
            defQueueMap: {},
            Module: w,
            makeModuleMap: g,
            nextTick: e.nextTick,
            onError: j,
            configure: function(a) {
                a.baseUrl && "/" !== a.baseUrl.charAt(a.baseUrl.length - 1) && (a.baseUrl += "/");
                var b = D.shim
                  , c = {
                    paths: !0,
                    bundles: !0,
                    config: !0,
                    map: !0
                };
                A(a, function(a, b) {
                    c[b] ? (D[b] || (D[b] = {}),
                    U(D[b], a, !0, !0)) : D[b] = a
                }),
                a.bundles && A(a.bundles, function(a, b) {
                    v(a, function(a) {
                        a !== b && (O[a] = b)
                    })
                }),
                a.shim && (A(a.shim, function(a, c) {
                    H(a) && (a = {
                        deps: a
                    }),
                    !a.exports && !a.init || a.exportsFn || (a.exportsFn = x.makeShimExports(a)),
                    b[c] = a
                }),
                D.shim = b),
                a.packages && v(a.packages, function(a) {
                    var b, a = "string" == typeof a ? {
                        name: a
                    } : a;
                    b = a.name,
                    a.location && (D.paths[b] = a.location),
                    D.pkgs[b] = a.name + "/" + (a.main || "main").replace(ha, "").replace(Q, "")
                }),
                A(E, function(a, b) {
                    !a.inited && !a.map.unnormalized && (a.map = g(b, null, !0))
                }),
                (a.deps || a.callback) && x.require(a.deps || [], a.callback)
            },
            makeShimExports: function(a) {
                return function() {
                    var b;
                    return a.init && (b = a.init.apply(ba, arguments)),
                    b || a.exports && da(a.exports)
                }
            },
            makeRequire: function(d, f) {
                function i(b, c, k) {
                    var l, m;
                    return f.enableBuildCallback && c && G(c) && (c.__requireJsBuild = !0),
                    "string" == typeof b ? G(c) ? j(B("requireargs", "Invalid require call"), k) : d && t(y, b) ? y[b](E[d.id]) : e.get ? e.get(x, b, d, i) : (l = g(b, d, !1, !0),
                    l = l.id,
                    t(K, l) ? K[l] : j(B("notloaded", 'Module name "' + l + '" has not been loaded yet for context: ' + a + (d ? "" : ". Use require([])")))) : (r(),
                    x.nextTick(function() {
                        r(),
                        m = h(g(null, d)),
                        m.skipMap = f.skipMap,
                        m.init(b, c, k, {
                            enabled: !0
                        }),
                        o()
                    }),
                    i)
                }
                return f = f || {},
                U(i, {
                    isBrowser: z,
                    toUrl: function(a) {
                        var c, e = a.lastIndexOf("."), f = a.split("/")[0];
                        return -1 !== e && ("." !== f && ".." !== f || 1 < e) && (c = a.substring(e, a.length),
                        a = a.substring(0, e)),
                        x.nameToUrl(b(a, d && d.id, !0), c, !0)
                    },
                    defined: function(a) {
                        return t(K, g(a, d, !1, !0).id)
                    },
                    specified: function(a) {
                        return a = g(a, d, !1, !0).id,
                        t(K, a) || t(E, a)
                    }
                }),
                d || (i.undef = function(a) {
                    k();
                    var b = g(a, d, !0)
                      , e = n(E, a);
                    e.undefed = !0,
                    c(a),
                    delete K[a],
                    delete L[b.url],
                    delete I[a],
                    T(J, function(b, c) {
                        b[0] === a && J.splice(c, 1)
                    }),
                    delete x.defQueueMap[a],
                    e && (e.events.defined && (I[a] = e.events),
                    l(a))
                }
                ),
                i
            },
            enable: function(a) {
                n(E, a.id) && h(a).enable()
            },
            completeLoad: function(a) {
                var b, c, e = n(D.shim, a) || {}, f = e.exports;
                for (k(); J.length; ) {
                    if (c = J.shift(),
                    null === c[0]) {
                        if (c[0] = a,
                        b)
                            break;
                        b = !0
                    } else
                        c[0] === a && (b = !0);
                    p(c)
                }
                if (x.defQueueMap = {},
                c = n(E, a),
                !b && !t(K, a) && c && !c.inited) {
                    if (D.enforceDefine && (!f || !da(f)))
                        return d(a) ? void 0 : j(B("nodefine", "No define call for " + a, null, [a]));
                    p([a, e.deps || [], e.exportsFn])
                }
                o()
            },
            nameToUrl: function(a, b, c) {
                var d, f, g;
                if ((d = n(D.pkgs, a)) && (a = d),
                d = n(O, a))
                    return x.nameToUrl(d, b, c);
                if (e.jsExtRegExp.test(a))
                    d = a + (b || "");
                else {
                    for (d = D.paths,
                    a = a.split("/"),
                    f = a.length; 0 < f; f -= 1)
                        if (g = a.slice(0, f).join("/"),
                        g = n(d, g)) {
                            H(g) && (g = g[0]),
                            a.splice(0, f, g);
                            break
                        }
                    d = a.join("/"),
                    d += b || (/^data\:|\?/.test(d) || c ? "" : ".js"),
                    d = ("/" === d.charAt(0) || d.match(/^[\w\+\.\-]+:/) ? "" : D.baseUrl) + d
                }
                return D.urlArgs ? d + (-1 === d.indexOf("?") ? "?" : "&") + D.urlArgs : d
            },
            load: function(a, b) {
                e.load(x, a, b)
            },
            execCb: function(a, b, c, d) {
                return b.apply(d, c)
            },
            onScriptLoad: function(a) {
                ("load" === a.type || ia.test((a.currentTarget || a.srcElement).readyState)) && (N = null,
                a = q(a),
                x.completeLoad(a.id))
            },
            onScriptError: function(a) {
                var b = q(a);
                if (!d(b.id))
                    return j(B("scripterror", "Script error for: " + b.id, a, [b.id]))
            }
        },
        x.require = x.makeRequire(),
        x
    }
    var e, x, y, D, I, E, N, J, r, O, ja = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/gm, ka = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g, Q = /\.js$/, ha = /^\.\//;
    x = Object.prototype;
    var K = x.toString
      , fa = x.hasOwnProperty
      , z = !("undefined" == typeof window || "undefined" == typeof navigator || !window.document)
      , ea = !z && "undefined" != typeof importScripts
      , ia = z && "PLAYSTATION 3" === navigator.platform ? /^complete$/ : /^(complete|loaded)$/
      , Y = "undefined" != typeof opera && "[object Opera]" === opera.toString()
      , F = {}
      , s = {}
      , R = []
      , M = !1;
    if (void 0 === define) {
        if (void 0 !== requirejs) {
            if (G(requirejs))
                return;
            s = requirejs,
            requirejs = void 0
        }
        void 0 !== require && !G(require) && (s = require,
        require = void 0),
        e = requirejs = function(a, b, c, d) {
            var f, g = "_";
            return !H(a) && "string" != typeof a && (f = a,
            H(b) ? (a = b,
            b = c,
            c = d) : a = []),
            f && f.context && (g = f.context),
            (d = n(F, g)) || (d = F[g] = e.s.newContext(g)),
            f && d.configure(f),
            d.require(a, b, c)
        }
        ,
        e.config = function(a) {
            return e(a)
        }
        ,
        e.nextTick = "undefined" != typeof setTimeout ? function(a) {
            setTimeout(a, 4)
        }
        : function(a) {
            a()
        }
        ,
        require || (require = e),
        e.version = "2.1.20",
        e.jsExtRegExp = /^\/|:|\?|\.js$/,
        e.isBrowser = z,
        x = e.s = {
            contexts: F,
            newContext: ga
        },
        e({}),
        v(["toUrl", "undef", "defined", "specified"], function(a) {
            e[a] = function() {
                var b = F._;
                return b.require[a].apply(b, arguments)
            }
        }),
        z && (y = x.head = document.getElementsByTagName("head")[0],
        D = document.getElementsByTagName("base")[0]) && (y = x.head = D.parentNode),
        e.onError = ca,
        e.createNode = function(a) {
            var b = a.xhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "html:script") : document.createElement("script");
            return b.type = a.scriptType || "text/javascript",
            b.charset = "utf-8",
            b.async = !0,
            b
        }
        ,
        e.load = function(a, b, c) {
            var d, f = a && a.config || {};
            if (z)
                return d = e.createNode(f, b, c),
                f.onNodeCreated && f.onNodeCreated(d, f, b, c),
                d.setAttribute("data-requirecontext", a.contextName),
                d.setAttribute("data-requiremodule", b),
                !d.attachEvent || d.attachEvent.toString && 0 > d.attachEvent.toString().indexOf("[native code") || Y ? (d.addEventListener("load", a.onScriptLoad, !1),
                d.addEventListener("error", a.onScriptError, !1)) : (M = !0,
                d.attachEvent("onreadystatechange", a.onScriptLoad)),
                d.src = c,
                J = d,
                D ? y.insertBefore(d, D) : y.appendChild(d),
                J = null,
                d;
            if (ea)
                try {
                    importScripts(c),
                    a.completeLoad(b)
                } catch (d) {
                    a.onError(B("importscripts", "importScripts failed for " + b + " at " + c, d, [b]))
                }
        }
        ,
        z && !s.skipDataMain && T(document.getElementsByTagName("script"), function(a) {
            if (y || (y = a.parentNode),
            I = a.getAttribute("data-main"))
                return r = I,
                s.baseUrl || (E = r.split("/"),
                r = E.pop(),
                O = E.length ? E.join("/") + "/" : "./",
                s.baseUrl = O),
                r = r.replace(Q, ""),
                e.jsExtRegExp.test(r) && (r = I),
                s.deps = s.deps ? s.deps.concat(r) : [r],
                !0
        }),
        define = function(a, b, c) {
            var d, e;
            "string" != typeof a && (c = b,
            b = a,
            a = null),
            H(b) || (c = b,
            b = null),
            !b && G(c) && (b = [],
            c.length && (c.toString().replace(/(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/gm, "").replace(/[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g, function(a, c) {
                b.push(c)
            }),
            b = (1 === c.length ? ["require"] : ["require", "exports", "module"]).concat(b))),
            M && ((d = J) || (N && "interactive" === N.readyState || T(document.getElementsByTagName("script"), function(a) {
                if ("interactive" === a.readyState)
                    return N = a
            }),
            d = N),
            d && (a || (a = d.getAttribute("data-requiremodule")),
            e = F[d.getAttribute("data-requirecontext")])),
            e ? (e.defQueue.push([a, b, c]),
            e.defQueueMap[a] = !0) : R.push([a, b, c])
        }
        ,
        define.amd = {
            jQuery: !0
        },
        e.exec = function(b) {
            return eval(b)
        }
        ,
        e(s)
    }
}(this),
define("require_css", [], function() {
    if ("undefined" == typeof window)
        return {
            load: function(a, b, c) {
                c()
            }
        };
    var a = document.getElementsByTagName("head")[0]
      , b = window.navigator.userAgent.match(/Trident\/([^ ;]*)|AppleWebKit\/([^ ;]*)|Opera\/([^ ;]*)|rv\:([^ ;]*)(.*?)Gecko\/([^ ;]*)|MSIE\s([^ ;]*)|AndroidWebKit\/([^ ;]*)/) || 0
      , c = !1
      , d = !0;
    b[1] || b[7] ? c = parseInt(b[1]) < 6 || parseInt(b[7]) <= 9 : b[2] || b[8] ? d = !1 : b[4] && (c = parseInt(b[4]) < 18);
    var e = {};
    e.pluginBuilder = "./css-builder";
    var f, g, h, i = function() {
        f = document.createElement("style"),
        a.appendChild(f),
        g = f.styleSheet || f.sheet
    }, j = 0, k = [], l = function(a) {
        g.addImport(a),
        f.onload = function() {
            m()
        }
        ,
        j++,
        31 == j && (i(),
        j = 0)
    }, m = function() {
        h();
        var a = k.shift();
        return a ? (h = a[1],
        void l(a[0])) : void (h = null)
    }, n = function(a, b) {
        if (g && g.addImport || i(),
        g && g.addImport)
            h ? k.push([a, b]) : (l(a),
            h = b);
        else {
            f.textContent = '@import "' + a + '";';
            var c = setInterval(function() {
                try {
                    f.sheet.cssRules,
                    clearInterval(c),
                    b()
                } catch (a) {}
            }, 10)
        }
    }, o = function(b, c) {
        var e = document.createElement("link");
        if (e.type = "text/css",
        e.rel = "stylesheet",
        d)
            e.onload = function() {
                e.onload = function() {}
                ,
                setTimeout(c, 7)
            }
            ;
        else
            var f = setInterval(function() {
                for (var a = 0; a < document.styleSheets.length; a++)
                    if (document.styleSheets[a].href == e.href)
                        return clearInterval(f),
                        c()
            }, 10);
        e.href = b,
        a.appendChild(e)
    };
    return e.normalize = function(a, b) {
        return ".css" == a.substr(a.length - 4, 4) && (a = a.substr(0, a.length - 4)),
        b(a)
    }
    ,
    e.load = function(a, b, d, e) {
        (c ? n : o)(b.toUrl(a + ".css"), d)
    }
    ,
    e
}),
function(a) {
    function b(a) {
        if (!e.isReady) {
            a && $.extend(e.config, a);
            var b, d;
            for (b in e)
                e.hasOwnProperty(b) && c(e[b]);
            for (b = 0,
            d = f.length; b < d; b++)
                f[b]();
            e.isReady = !0
        }
    }
    function c(a) {
        if (a && a.init && !a.isReady) {
            if (a.deps)
                for (var b = 0, d = a.deps.length; b < d; b++)
                    c(e[a.deps[b]]);
            a.init.call(e),
            a.isReady = !0
        }
    }
    function d(a) {
        e.isReady ? a() : f.push(a)
    }
    var e = {
        isReady: !1
    }
      , f = [];
    Array.prototype.indexOf || (Array.prototype.indexOf = function(a) {
        var b = this.length >>> 0
          , c = Number(arguments[1]) || 0;
        for (c = c < 0 ? Math.ceil(c) : Math.floor(c),
        c < 0 && (c += b); c < b; c++)
            if (c in this && this[c] === a)
                return c;
        return -1
    }
    ),
    window.require && require.config({
        waitSeconds: 0
    }),
    window.FastClick && new FastClick.attach(document.body),
    e.init = b,
    e.ready = d,
    a.sg = e
}(window),
function(a) {
    a.config = {
        html4Mode: !1,
        timeOut: 3e4,
        parent: $("body"),
        routes: {},
        resource: {},
        error: {},
        debug: !1,
        animation: !1,
        templateApi: "",
        needCache: !0,
        fixDirection: !1,
        animationEnd: window.WebKitAnimationEvent ? "webkitAnimationEnd" : window.AnimationEvent ? "animationend" : "",
        transitionEnd: window.WebKitTransitionEvent ? "webkitTransitionEnd" : window.TransitionEvent ? "transitionend" : "",
        defaultScrollTop: 0
    }
}(window.sg),
function(a) {
    function b(b, c, d) {
        if (a.config.debug && window.console && console.log)
            if (c) {
                var e;
                switch (d) {
                case 1:
                    e = "background-color:black;color:white";
                    break;
                case 2:
                    e = "background-color:red;color:white";
                    break;
                default:
                    e = "background-color:green;color:white"
                }
                console.log("%c " + c + " ", e, b)
            } else
                console.log(b)
    }
    function c(a, b) {
        function c() {}
        var d = a.prototype;
        c.prototype = b.prototype,
        a.prototype = new c;
        for (var e in d)
            a.prototype[e] = d[e];
        a.prototype.constructor = a
    }
    function d(a, b) {
        b = b || "s",
        b = "\\" + b;
        var c = new RegExp("^" + b + "+")
          , d = new RegExp(b + "+$");
        return null == a ? "" : (a + "").replace(c, "").replace(d, "")
    }
    function e(a) {
        var b = /^[A-Za-z0-9!#$%&\'*+\/=?^_`{|}~-]+(\.[A-Za-z0-9!#$%&\'*+\/=?^_`{|}~-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.([A-Za-z]{2,})$/;
        return a ? b.test(a) ? 0 : 1 : 2
    }
    function f(a) {
        var b = /^[+]{0,1}\d+$/;
        return a ? b.test(a) ? 0 : 1 : 2
    }
    function g(a) {
        var b, c, d, e, f, g, h = {}, i = void 0 === a ? location.href : a;
        if (i = i.replace(/#.+$/, ""),
        b = i.indexOf("?"),
        b > -1 && (i = i.substring(b, i.length).replace(/\+/g, "%20")),
        "?" == i.substr(0, 1) && i.length > 1)
            for (e = i.substring(1, i.length),
            f = e.split("&"),
            c = 0,
            d = f.length; c < d; c++)
                g = f[c].split("="),
                2 == g.length && (h[g[0]] = decodeURIComponent(g[1]));
        return h
    }
    function h(a, b) {
        return g(b)[a] || ""
    }
    function i(a, b, c) {
        $.isArray(a) || (a = [a]),
        b && ($.isArray(b) || b.callee) || (b = [b]);
        for (var d = 0; d < a.length; d++)
            a[d] && a[d].apply(c, b)
    }
    function j(a, b) {
        return new Function("fn","return function " + a + "(){ return fn.apply(this,arguments)}")(b)
    }
    function k(a) {
        if (a) {
            document.title = a;
            var b = navigator.userAgent.toLowerCase();
            if (/iphone|ipad|ipod/.test(b)) {
                var c = $("body")
                  , d = $('<iframe src="/favicon.ico" style="display:none;"></iframe>');
                d.on("load", function() {
                    setTimeout(function() {
                        d.off("load").remove()
                    }, 0)
                }).appendTo(c)
            }
        }
    }
    function l(a) {
        try {
            return [].slice.call(a)
        } catch (d) {
            var b, c = [];
            for (b in a)
                $.hasOwnProperty.call(a, b) && c.push(a[b]);
            return c
        }
    }
    function m(a) {
        var b = {};
        return a.children("param").each(function() {
            var a = $(this)
              , c = a.attr("type") || "string";
            "string" == c ? b[a.attr("id")] = a.val() : "int" == c ? b[a.attr("id")] = parseInt(a.val()) : "float" == c ? b[a.attr("id")] = parseFloat(a.val()) : "json" == c && (b[a.attr("id")] = JSON.parse(a.val()) || {})
        }),
        b
    }
    function n(a, b, c) {
        function d(a, d) {
            var h = d;
            e++,
            g[a] = {
                width: h.width,
                height: h.height
            },
            b && b(a, g[a], d),
            e >= f && c && c(g)
        }
        $.isArray(a) || (a = [a]);
        for (var e = 0, f = a.length, g = {}, h = 0; h < f; h++) {
            var i = new Image;
            i.src = a[h],
            function(a) {
                i.complete ? d(a, i) : i.onload = i.onerror = function() {
                    d(a, this)
                }
            }(h)
        }
    }
    function o(a) {
        if (!a.length || "hidden" == a.css("scroll"))
            return 0;
        var b = a.get(0).style.overflowY
          , c = a.outerWidth(!0) - a.css("overflow-y", "hidden").outerWidth(!0);
        return a.css("overflow-y", b),
        -c
    }
    function p(a, b, c) {
        return a & Hammer.DIRECTION_HORIZONTAL ? b : c
    }
    function q(a, b, c, d) {
        this.container = a,
        this.direction = b,
        this.onLeave = d,
        this.panes = Array.prototype.slice.call(this.container.children, 0),
        this.containerSize = c,
        this.currentIndex = 0,
        this.hammer = new Hammer.Manager(this.container),
        this.hammer.add(new Hammer.Pan({
            direction: this.direction,
            threshold: 10
        })),
        this.hammer.on("panstart panmove panend pancancel", Hammer.bindFn(this.onPan, this)),
        this.show(this.currentIndex)
    }
    function r(a, b, c) {
        b || (b = a),
        c = c || {},
        c = $.extend({
            maxScale: 2,
            minScale: 1,
            boundary: {
                x1: 0,
                x2: window.innerWidth,
                y1: 0,
                y2: window.innerHeight
            },
            enablePanWithoutScale: !0
        }, c);
        var d = this;
        d.translate = {
            x: 0,
            y: 0
        },
        d.scale = 1,
        d.iniScale = 1,
        d.iniX = 0,
        d.iniY = 0,
        d.ticking = !1,
        d.target = a,
        d.handle = b,
        d.options = c;
        var e = new Hammer.Manager(b)
          , f = new Hammer.Pan({
            threshold: 0,
            pointers: 1,
            enable: c.enablePanWithoutScale
        })
          , g = new Hammer.Pinch({
            threshold: 0
        })
          , h = new Hammer.Tap({
            event: "doubletap",
            taps: 2
        });
        e.add(f),
        e.add(g),
        e.add(h),
        f.recognizeWith(g),
        e.on("doubletap", function(a) {
            d.scale == c.minScale ? (d.reset.call(d),
            d.scale = c.maxScale) : d.reset.call(d),
            c.enablePanWithoutScale || (d.scale == c.minScale ? f.set({
                enable: !1
            }) : f.set({
                enable: !0
            })),
            d.requestElementUpdate.call(d)
        }),
        e.on("hammer.input", function(b) {
            b.isFinal && ($(a).addClass("sg_transition_all"),
            c.enablePanWithoutScale ? d.fixBoundary.call(d, b) : d.scale == c.minScale ? f.set({
                enable: !1
            }) : (f.set({
                enable: !0
            }),
            d.fixBoundary.call(d, b)),
            d.requestElementUpdate.call(d))
        }),
        e.on("pinchstart", function() {
            d.iniScale = d.scale || 1,
            $(a).removeClass("sg_transition_all"),
            d.requestElementUpdate.call(d)
        }),
        e.on("pinchmove", function(a) {
            var b = d.iniScale * a.scale;
            b < .8 * c.minScale && b >= .4 * c.minScale ? b = .4 * c.minScale + d.iniScale * a.scale / 2 : b < .4 * c.minScale ? b = .5 * c.minScale + d.iniScale * a.scale / 4 : b > c.maxScale && b <= 1.5 * c.maxScale ? b = .5 * c.maxScale + d.iniScale * a.scale / 2 : b > 1.25 * c.maxScale && (b = c.maxScale + d.iniScale * a.scale / 5),
            d.scale = b,
            d.requestElementUpdate.call(d)
        }),
        e.on("panstart", function(b) {
            d.iniX = d.translate.x || 0,
            d.iniY = d.translate.y || 0,
            $(a).removeClass("sg_transition_all"),
            d.requestElementUpdate.call(d)
        }),
        e.on("panmove", function(a) {
            d.translate.x = d.iniX + a.deltaX,
            d.translate.y = d.iniY + a.deltaY,
            d.requestElementUpdate.call(d)
        }),
        d.hammer = e
    }
    function s(a, b, c, d) {
        var e, f, g, h;
        return a / b > c / d ? (e = a / b * d,
        f = d,
        g = 0,
        h = (c - a / b * d) / 2) : (f = c / (a / b),
        e = c,
        g = Math.min((d - b / a * c) / 2, 0),
        h = 0),
        {
            width: e,
            height: f,
            "margin-left": h,
            "margin-top": g
        }
    }
    function t(a, b, c, d) {
        return a / b > c / d ? (b *= c / a,
        a = c) : (a *= d / b,
        b = d),
        {
            marginLeft: (c - a) / 2,
            marginTop: (d - b) / 2,
            width: a,
            height: b
        }
    }
    function u(a) {
        for (var b = a.split(","), c = b[0].match(/:(.*?);/)[1], d = atob(b[1]), e = d.length, f = new Uint8Array(e), g = !1; e--; )
            f[e] = d.charCodeAt(e);
        try {
            g = new Blob([f],{
                type: c
            })
        } catch (a) {}
        return g
    }
    function v(a, b) {
        var c = new FileReader;
        c.onload = function(a) {
            b(a.target.result)
        }
        ,
        c.readAsDataURL(a)
    }
    function w(a, b) {
        var c = Math.max(window.devicePixelRatio || 1, 1)
          , d = document.createElement("canvas");
        return d.style.width = a + "px",
        d.style.height = b + "px",
        d.setAttribute("width", a * c),
        d.setAttribute("height", b * c),
        1 != c && d.getContext("2d").scale(c, c),
        d
    }
    function x(a) {
        var b, c, d = [], e = {
            image: "image/*",
            audio: "audio/*",
            video: "video/*",
            bmp: "image/bmp",
            gif: "image/gif",
            ico: "image/x-icon",
            jpg: "image/jpeg",
            png: "image/png",
            svg: "image/svg+xml",
            html: "text/html",
            apk: "application/vnd.android.package-archive",
            bin: "application/octet-stream",
            text: "text/plain",
            css: "text/css",
            mid: "audio/mid",
            mp4: "video/mp4",
            ogg: "audio/ogg",
            rar: "application/octet-stream",
            mp3: "audio/mpeg",
            ppt: "application/vnd.ms-powerpoint",
            pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            doc: "application/msword",
            docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            xls: "application/vnd.ms-excel",
            xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        };
        for (a = a ? a.split(",") : [],
        b = 0,
        c = a.length; b < c; b++) {
            var f = a[b];
            e.hasOwnProperty(f) && d.push(e[f])
        }
        return d
    }
    function y(a, b) {
        var c = $.param(b);
        return a += /\?/.test(a) ? "&" + c : "?" + c
    }
    function z(a, b, c, d, e) {
        var f, g, h, i = location.host;
        return void 0 === b ? (b = null,
        h = new RegExp("(^| )" + a + "=([^;]*)(;|$)"),
        (g = document.cookie.match(h)) && (b = unescape(g[2])),
        b) : void (null === b ? z(a, "", -1) : (f = new Date,
        f.setTime(f.getTime() + 36e5 * (c || 24)),
        d = void 0 == d ? i ? "." + i : null : d,
        null == d || (d = ";domain=" + d,
        e = void 0 == e ? ";path=/" : ";path=" + e,
        document.cookie = a + "=" + escape(b) + ";expires=" + f.toGMTString() + d + e)))
    }
    function A(a) {
        var b, c = $.type(a);
        switch (c) {
        case "object":
            b = $.extend(!0, {}, a);
            break;
        case "array":
            b = [];
            for (var d = 0, e = a.length; d < e; d++)
                b.push(A(a[d]));
            break;
        default:
            b = a
        }
        return b
    }
    function B(a) {
        return function(b, c) {
            var d = b[a]
              , e = c[a];
            return e < d ? 1 : e > d ? -1 : 0
        }
    }
    function C(a) {
        var b, c, d = [], e = "";
        for (b in a)
            a.hasOwnProperty(b) && d.push({
                key: b,
                value: a[b]
            });
        for (d.sort(B("key")),
        b = 0,
        c = d.length; b < c; b++)
            b > 0 && (e += "&"),
            "object" == typeof d[b].value && (d[b].value = JSON.stringify(d[b].value)),
            e += d[b].key + "=" + d[b].value;
        return e
    }
    function D(a) {
        var b = document.createElement("a");
        return b.href = a,
        b.params = g(b.search),
        b
    }
    function E() {
        document.body.offsetWidth = document.body.offsetWidth
    }
    function F(a, b, c) {
        for (; a.length < c; )
            a = a.length + b.length < c ? b + a : b.substring(0, c - a.length) + a;
        return a
    }
    function G(a, b, c) {
        for (; a.length < c; )
            a += a.length + b.length < c ? b : b.substring(0, c - a.length);
        return a
    }
    function H(a, b, c) {
        var d = b.maxWidth
          , e = b.maxHeight
          , f = b.quality || 1
          , g = new FileReader;
        g.onload = function() {
            h(g.result)
        }
        ,
        g.readAsDataURL(a);
        var h = function(b) {
            var g = new Image;
            g.onload = function() {
                var b, h = t(g.width, g.height, d, e), i = h.width, j = h.height, k = document.createElement("canvas"), l = k.getContext("2d");
                k.setAttribute("width", i),
                k.setAttribute("height", j),
                l.drawImage(g, 0, 0, g.width, g.height, 0, 0, i, j),
                b = u(k.toDataURL(a.type, f)),
                b.name = a.name,
                c(b)
            }
            ,
            g.src = b
        }
    }
    q.prototype = {
        show: function(a, b, c) {
            a = Math.max(0, Math.min(a, this.panes.length - 1)),
            b = b || 0;
            var d = this.container.className;
            c ? d.indexOf("animate") === -1 && (this.container.className += " animate") : d.indexOf("animate") !== -1 && (this.container.className = d.replace("animate", "").trim());
            var e, f, g;
            for (e = 0; e < this.panes.length; e++)
                f = this.containerSize / 100 * (100 * (e - a) + b),
                g = this.direction & Hammer.DIRECTION_HORIZONTAL ? "translate3d(" + f + "px, 0, 0)" : "translate3d(0, " + f + "px, 0)",
                this.panes[e].style.transform = g,
                this.panes[e].style.mozTransform = g,
                this.panes[e].style.webkitTransform = g;
            this.onLeave && this.onLeave(this.currentIndex, a),
            this.currentIndex = a
        },
        onPan: function(a) {
            var b = p(this.direction, a.deltaX, a.deltaY)
              , c = 100 / this.containerSize * b
              , d = !1;
            "panend" != a.type && "pancancel" != a.type || (Math.abs(c) > 20 && "panend" == a.type && (this.currentIndex += c < 0 ? 1 : -1),
            c = 0,
            d = !0),
            this.show(this.currentIndex, c, d)
        }
    },
    r.prototype = {
        requestElementUpdate: function() {
            var a = this;
            a.ticking || (requestAnimFrame(function() {
                a.updateElementTransform.call(a)
            }),
            a.ticking = !0)
        },
        updateElementTransform: function() {
            var a = this
              , b = a.target
              , c = ["translate3d(" + a.translate.x + "px, " + a.translate.y + "px, 0)", "scale(" + a.scale + ", " + a.scale + ")"];
            c = c.join(" "),
            b.style.webkitTransform = c,
            b.style.mozTransform = c,
            b.style.transform = c,
            a.ticking = !1
        },
        offset: function() {
            var a = this
              , b = a.target
              , c = b.getBoundingClientRect();
            return {
                left: c.left + window.pageXOffset - window.scrollX,
                top: c.top + window.pageYOffset - window.scrollY,
                width: Math.round(c.width),
                height: Math.round(c.height)
            }
        },
        fixBoundary: function(a) {
            var b = this
              , c = b.target
              , d = c.offsetWidth
              , e = c.offsetHeight
              , f = b.options
              , g = f.boundary
              , h = b.offset()
              , i = d * b.scale
              , j = e * b.scale;
            g && (f.maxScale && (b.scale = Math.min(f.maxScale, b.scale)),
            f.minScale && (b.scale = Math.max(f.minScale, b.scale)),
            i > g.x2 - g.x1 ? h.left > g.x1 && a.deltaX > 0 ? b.translate.x += g.x1 - h.left : h.left + i < g.x2 && a.deltaX < 0 && (b.translate.x -= h.left + i - g.x2) : h.left < g.x1 && a.deltaX < 0 ? b.translate.x += g.x1 - h.left : h.left + i > g.x2 && a.deltaX > 0 && (b.translate.x -= h.left + i - g.x2),
            j > g.y2 - g.y1 ? h.top > g.y1 && a.deltaY > 0 ? b.translate.y += g.y1 - h.top : h.top + j < g.y2 && a.deltaY < 0 && (b.translate.y -= h.top + j - g.y2) : h.top < g.y1 && a.deltaY < 0 ? b.translate.y += g.y1 - h.top : h.top + j > g.y2 && a.deltaY > 0 && (b.translate.y -= h.top + j - g.y2))
        },
        checkBoundary: function() {
            var a = {
                top: !1,
                left: !1,
                right: !1,
                bottom: !1
            }
              , b = this
              , c = b.options
              , d = c.boundary
              , e = b.offset();
            return e.top < d.y1 && (a.top = !0),
            e.top + e.height > d.y2 && (a.bottom = !0),
            e.left < d.x1 && (a.left = !0),
            e.left + e.width > d.x2 && (a.right = !0),
            a
        },
        reset: function() {
            var a = this
              , b = a.options;
            a.translate.x = 0,
            a.translate.y = 0,
            a.scale = b.minScale,
            a.iniX = 0,
            a.iniY = 0,
            a.iniScale = b.minScale,
            a.hammer.get("pan").set({
                enable: b.enablePanWithoutScale
            }),
            a.requestElementUpdate.call(a)
        }
    },
    a.keyCode = {
        BackSpace: 8,
        Tab: 9,
        Clear: 12,
        Enter: 13,
        Shift: 16,
        Control: 17,
        Alt: 18,
        CapeLock: 20,
        Esc: 27,
        SpaceBar: 32,
        PageUp: 33,
        PageDown: 34,
        End: 35,
        Home: 36,
        LeftArrow: 37,
        UpArrow: 38,
        RightArrow: 39,
        DownArrow: 40,
        Insert: 45,
        Delete: 46,
        NumLock: 144
    },
    a.utils = {
        log: b,
        inherits: c,
        trim: d,
        isEmail: e,
        isMobile: f,
        getUrlParams: g,
        getUrlParam: h,
        safeExec: i,
        createFunc: j,
        setTitle: k,
        makeArray: l,
        getTagParams: m,
        loadImage: n,
        getScrollBarWidth: o,
        HammerCarousel: q,
        HammerImage: r,
        resizeImageFull: s,
        resizeImage: t,
        getFileExt: x,
        addUrlParam: y,
        cookie: z,
        createCanvas: w,
        dataURLtoBlob: u,
        blobToDataURL: v,
        deepCopy: A,
        serializeObject: C,
        parseUrl: D,
        reflow: E,
        stringPadLeft: F,
        stringPadRight: G,
        compressImage: H
    }
}(window.sg),
function(a) {
    function b(a) {
        return a.replace(/\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|\s*\.\s*[$\w\.]+/g, "").replace(/[^\w$]+/g, ",").replace(u, "").replace(/^\d[^,]*|,\d[^,]*/g, "").replace(/^,+|,+$/g, "").split(/^$|,+/)
    }
    function c(a) {
        return "'" + a.replace(/('|\\)/g, "\\$1").replace(/\r/g, "\\r").replace(/\n/g, "\\n") + "'"
    }
    function d(a, d) {
        function e(a) {
            return m += a.split(/\n/).length - 1,
            k && (a = a.replace(/\s+/g, " ").replace(/<!--[\w\W]*?-->/g, "")),
            a && (a = r[1] + c(a) + r[2] + "\n"),
            a
        }
        function f(a) {
            var c = m;
            if (j ? a = j(a, d) : g && (a = a.replace(/\n/g, function() {
                return m++,
                "$line=" + m + ";"
            })),
            0 === a.indexOf("=")) {
                var e = l && !/^=[=#]/.test(a);
                if (a = a.replace(/^=[=#]?|[\s;]*$/g, ""),
                e) {
                    var f = a.replace(/\s*\([^\)]+\)/, "");
                    o[f] || /^(include|print)$/.test(f) || (a = "$escape(" + a + ")")
                } else
                    a = "$string(" + a + ")";
                a = r[1] + a + r[2]
            }
            return g && (a = "$line=" + c + ";" + a),
            s(b(a), function(a) {
                if (a && !n[a]) {
                    var b;
                    b = "print" === a ? u : "include" === a ? v : o[a] ? "$utils." + a : p[a] ? "$helpers." + a : "$data." + a,
                    w += a + "=" + b + ",",
                    n[a] = !0
                }
            }),
            a + "\n"
        }
        var g = d.debug
          , h = d.openTag
          , i = d.closeTag
          , j = d.parser
          , k = d.compress
          , l = d.escape
          , m = 1
          , n = {
            $data: 1,
            $filename: 1,
            $utils: 1,
            $helpers: 1,
            $out: 1,
            $line: 1
        }
          , q = "".trim
          , r = q ? ["$out='';", "$out+=", ";", "$out"] : ["$out=[];", "$out.push(", ");", "$out.join('')"]
          , t = q ? "$out+=text;return $out;" : "$out.push(text);"
          , u = "function(){var text=''.concat.apply('',arguments);" + t + "}"
          , v = "function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);" + t + "}"
          , w = "'use strict';var $utils=this,$helpers=$utils.$helpers," + (g ? "$line=0," : "")
          , x = r[0]
          , y = "return new String(" + r[3] + ");";
        s(a.split(h), function(a) {
            a = a.split(i);
            var b = a[0]
              , c = a[1];
            1 === a.length ? x += e(b) : (x += f(b),
            c && (x += e(c)))
        });
        var z = w + x + y;
        g && (z = "try{" + z + "}catch(e){throw {filename:$filename,name:'Render Error',message:e.message,line:$line,source:" + c(a) + ".split(/\\n/)[$line-1].replace(/^\\s+/,'')};}");
        try {
            var A = new Function("$data","$filename",z);
            return A.prototype = o,
            A
        } catch (a) {
            throw a.temp = "function anonymous($data,$filename) {" + z + "}",
            a
        }
    }
    var e = function(a, b) {
        return "string" == typeof b ? r(b, {
            filename: a
        }) : h(a, b)
    };
    e.version = "3.0.0",
    e.config = function(a, b) {
        f[a] = b
    }
    ;
    var f = e.defaults = {
        openTag: "<%",
        closeTag: "%>",
        escape: !0,
        cache: !0,
        compress: !1,
        parser: null
    }
      , g = e.cache = {};
    e.render = function(a, b) {
        return r(a, b)
    }
    ;
    var h = e.renderFile = function(a, b) {
        var c = e.get(a) || q({
            filename: a,
            name: "Render Error",
            message: "Template not found"
        });
        return b ? c(b) : c
    }
    ;
    e.get = function(a) {
        var b;
        if (g[a])
            b = g[a];
        else if ("object" == typeof document) {
            var c = document.getElementById(a);
            if (c) {
                var d = (c.value || c.innerHTML).replace(/^\s*|\s*$/g, "");
                b = r(d, {
                    filename: a
                })
            }
        }
        return b
    }
    ;
    var i = function(a, b) {
        return "string" != typeof a && (b = typeof a,
        "number" === b ? a += "" : a = "function" === b ? i(a.call(a)) : ""),
        a
    }
      , j = {
        "<": "&#60;",
        ">": "&#62;",
        '"': "&#34;",
        "'": "&#39;",
        "&": "&#38;"
    }
      , k = function(a) {
        return j[a]
    }
      , l = function(a) {
        return i(a).replace(/&(?![\w#]+;)|[<>"']/g, k)
    }
      , m = Array.isArray || function(a) {
        return "[object Array]" === {}.toString.call(a)
    }
      , n = function(a, b) {
        var c, d;
        if (m(a))
            for (c = 0,
            d = a.length; c < d; c++)
                b.call(a, a[c], c, a);
        else
            for (c in a)
                b.call(a, a[c], c)
    }
      , o = e.utils = {
        $helpers: {},
        $include: h,
        $string: i,
        $escape: l,
        $each: n
    };
    e.helper = function(a, b) {
        p[a] = b
    }
    ;
    var p = e.helpers = o.$helpers;
    e.onerror = function(a) {
        var b = "Template Error\n\n";
        for (var c in a)
            b += "<" + c + ">\n" + a[c] + "\n\n";
        "object" == typeof console && console.error(b)
    }
    ;
    var q = function(a) {
        return e.onerror(a),
        function() {
            return "{Template Error}"
        }
    }
      , r = e.compile = function(a, b) {
        function c(c) {
            try {
                return new i(c,h) + ""
            } catch (d) {
                return b.debug ? q(d)() : (b.debug = !0,
                r(a, b)(c))
            }
        }
        b = b || {};
        for (var e in f)
            void 0 === b[e] && (b[e] = f[e]);
        var h = b.filename;
        try {
            var i = d(a, b)
        } catch (a) {
            return a.filename = h || "anonymous",
            a.name = "Syntax Error",
            q(a)
        }
        return c.prototype = i.prototype,
        c.toString = function() {
            return i.toString()
        }
        ,
        h && b.cache && (g[h] = c),
        c
    }
      , s = o.$each
      , t = "break,case,catch,continue,debugger,default,delete,do,else,false,finally,for,function,if,in,instanceof,new,null,return,switch,this,throw,true,try,typeof,var,void,while,with,abstract,boolean,byte,char,class,const,double,enum,export,extends,final,float,goto,implements,import,int,interface,long,native,package,private,protected,public,short,static,super,synchronized,throws,transient,volatile,arguments,let,yield,undefined"
      , u = new RegExp(["\\b" + t.replace(/,/g, "\\b|\\b") + "\\b"].join("|"),"g");
    f.openTag = "{{",
    f.closeTag = "}}";
    var v = function(a, b) {
        var c = b.split(":")
          , d = c.shift()
          , e = c.join(":") || "";
        return e && (e = ", " + e),
        "$helpers." + d + "(" + a + e + ")"
    };
    f.parser = function(a, b) {
        a = a.replace(/^\s/, "");
        var c = a.split(" ")
          , d = c.shift()
          , f = c.join(" ");
        switch (d) {
        case "if":
            a = "if(" + f + "){";
            break;
        case "else":
            c = "if" === c.shift() ? " if(" + c.join(" ") + ")" : "",
            a = "}else" + c + "{";
            break;
        case "/if":
            a = "}";
            break;
        case "each":
            var g = c[0] || "$data"
              , h = c[1] || "as"
              , i = c[2] || "$value"
              , j = c[3] || "$index"
              , k = i + "," + j;
            "as" !== h && (g = "[]"),
            a = "$each(" + g + ",function(" + k + "){";
            break;
        case "/each":
            a = "});";
            break;
        case "echo":
            a = "print(" + f + ");";
            break;
        case "print":
        case "include":
            a = d + "(" + c.join(",") + ");";
            break;
        default:
            if (/^\s*\|\s*[\w\$]/.test(f)) {
                var l = !0;
                0 === a.indexOf("#") && (a = a.substr(1),
                l = !1);
                for (var m = 0, n = a.split("|"), o = n.length, p = n[m++]; m < o; m++)
                    p = v(p, n[m]);
                a = (l ? "=" : "=#") + p
            } else
                a = e.helpers[d] ? "=#" + d + "(" + c.join(",") + ");" : "=" + a
        }
        return a
    }
    ,
    a.template = e
}(window.sg),
function(a) {
    function b(a, b) {
        return b.f == a.f ? b.t - a.t : b.f - a.f
    }
    var c = {}.hasOwnProperty
      , d = function(a, b) {
        return a ? c.call(a, b) : a
    }
      , e = 0
      , f = function(a, b) {
        var c = this;
        return c.get ? (c.c = [],
        c.x = a || 20,
        c.b = c.x + (isNaN(b) ? 5 : b),
        void 0) : new f(a,b)
    };
    !function(a, b, c) {
        for (var e in b)
            c && d(c, e) || (a[e] = b[e]);
        return a
    }(f.prototype, {
        get: function(a) {
            var b, c = this, f = c.c;
            return d(f, a) && (b = f[a],
            b.f >= 1 && (b.f++,
            b.t = e++,
            b = b.v)),
            b
        },
        set: function(a, c) {
            var f = this
              , g = f.c
              , h = a
              , i = g[h];
            if (!d(g, h)) {
                if (g.length >= f.b) {
                    g.sort(b);
                    for (var j = f.b - f.x; j--; )
                        i = g.pop(),
                        delete g[i.k]
                }
                i = {},
                g.push(i),
                g[h] = i
            }
            return i.o = a,
            i.k = h,
            i.v = c,
            i.f = 1,
            i.t = e++,
            c
        },
        del: function(a) {
            var b = this.c
              , c = b[a];
            c && (c.f = -1e5,
            c.v = "",
            delete b[a])
        },
        has: function(a) {
            return d(this.c, a)
        },
        reset: function() {
            this.c = []
        }
    }, !1),
    a.Cache = f
}(window.sg),
function(a) {
    function b(b, e, f, g) {
        if (!n[b]) {
            var h = {
                url: b,
                needCache: !0,
                need_abort: !0,
                jsonp: !1,
                type: f ? "POST" : "GET",
                data: new a.Cache,
                getData: c,
                deleteCache: d
            }
              , i = a.utils.parseUrl(b);
            i.host && i.host != location.host && (h.jsonp = !0),
            n[b] = h
        }
        return n[b].needCache = e !== !1,
        n[b].need_abort = !!g,
        n[b]
    }
    function c(b, c, d) {
        "function" == $.type(b) ? (d = c,
        c = b,
        b = {}) : b = b || {};
        var e = this
          , f = a.utils.serializeObject(b)
          , g = e.data.get(f);
        if (e.needCache && g) {
            var h = !0;
            k && (h = k.call(window, a.utils.deepCopy(g))),
            c && h !== !1 && (h = c.call(window, a.utils.deepCopy(g))),
            l && h !== !1 && l.call(window, a.utils.deepCopy(g))
        } else {
            if (e.need_abort && e.current_ajax && (e.current_ajax.sg_abort = 1,
            e.current_ajax.abort()),
            m && !1 === m.call(window, e, b))
                return;
            var n = {};
            if (o) {
                var q = a.utils.cookie(o) || "";
                p ? b[o] = q : n[o] = q
            }
            e.current_ajax = $.ajax({
                url: e.url,
                headers: n,
                type: e.type,
                data: b,
                dataType: e.jsonp ? "jsonp" : "json",
                timeout: a.config.timeOut,
                success: function(b, d, g) {
                    if (g.sg_abort)
                        return !1;
                    e.needCache && e.data.set(f, b),
                    g.requestURL = e.url;
                    var h = !0;
                    k && (h = k.call(window, a.utils.deepCopy(b), g)),
                    c && h !== !1 && (h = c.call(window, a.utils.deepCopy(b), g)),
                    l && h !== !1 && l.call(window, a.utils.deepCopy(b), g)
                },
                error: function(b, c, g) {
                    if (b.sg_abort)
                        return !1;
                    0 != b.status && navigator.onLine || (c = "offline"),
                    a.config.debug && alert(e.url + f),
                    b.requestURL = e.url;
                    var h = !0;
                    i && (h = i.call(window, b, c, g)),
                    d && h !== !1 && (h = d.call(window, b, c, g)),
                    j && h !== !1 && j.call(window, b, c, g)
                }
            })
        }
        return e.current_ajax
    }
    function d(b) {
        var c = this;
        b ? c.data.del(a.utils.serializeObject(b)) : c.data.reset()
    }
    function e(a, b) {
        i = a,
        j = b
    }
    function f(a, b) {
        k = a,
        l = b
    }
    function g(a) {
        m = a
    }
    function h(a, b) {
        p = !1 !== b,
        o = a
    }
    var i, j, k, l, m, n = {}, o = "", p = !0;
    a.Model = {
        get: b,
        setErrorCallback: e,
        setSuccessCallback: f,
        setBeforeAjaxCallback: g,
        setCsrfKey: h
    }
}(window.sg),
function(a) {
    function b(a) {
        return "~" + a
    }
    function c(c, d, e, f) {
        var g = b(c)
          , h = this
          , i = h[g];
        if (i) {
            d || (d = {}),
            d.type || (d.type = c);
            for (var j, k, l = i.length, m = l - 1; l--; )
                j = f ? l : m - l,
                k = i[j],
                (k.d || k.r) && (i.splice(j, 1),
                m--),
                k.d || a.utils.safeExec(k.f, d, h)
        }
        e && delete h[g],
        a.utils.log(c, "EventFire")
    }
    function d(c, d, e) {
        var f = b(c)
          , g = this[f] || (this[f] = []);
        "number" == $.type(e) ? g.splice(e, 0, {
            f: d
        }) : g.push({
            f: d,
            r: e
        }),
        a.utils.log(c, "EventOn")
    }
    function e(c, d) {
        var e = b(c)
          , f = this[e];
        if (f)
            if (d) {
                for (var g, h = f.length - 1; h >= 0; h--)
                    if (g = f[h],
                    g.f == d && !g.d) {
                        g.d = 1;
                        break
                    }
            } else
                delete this[e];
        a.utils.log(c, "EventUn")
    }
    var f = {
        fire: c,
        on: d,
        un: e
    };
    a.Event = {
        init: function(b) {
            b = b || a,
            $.extend(b, f)
        }
    }
}(window.sg),
function(a) {
    function b() {
        c($('[type="text/template"]'));
        for (var a = 0, b = l.length; a < b; a++)
            j(l[a].name, l[a].options, !0)
    }
    function c(b) {
        b.each(function() {
            var b, c = $(this), d = c.attr("id"), e = c.attr("css"), f = c.attr("js"), g = c.attr("title");
            if (d && !m[d]) {
                b = {
                    html: c.html(),
                    css: c.attr("class")
                };
                var h = {};
                e && (h.css = e.split(",")),
                f && (h.js = f.split(",")),
                g && (h.title = g),
                a.config.resource[d] = $.extend({}, a.config.resource[d], h),
                n[d] = b
            }
        }),
        b.remove()
    }
    function d(b, c) {
        var d = a.utils.createFunc(b, i);
        return a.utils.inherits(d, i),
        $.extend(d.prototype, c),
        m[b] = d,
        d
    }
    function e(b, d) {
        return b ? void $.ajax({
            url: a.config.templateApi && !a.config.usePath ? a.config.templateApi + "?view_id=" + b : a.config.templateApi + b,
            type: "GET",
            dataType: "html",
            timeout: a.config.timeOut,
            success: function(a) {
                a.indexOf("<script") != -1 && c($(a)),
                d && d()
            },
            error: function() {
                a.utils.log(b, "TemplateLoadError", 2)
            }
        }) : void (d && d())
    }
    function f(a) {
        var b = m[a];
        try {
            var c = new b;
            if (c.vm_name = a,
            b.prototype.properties && $.extend(!0, c, b.prototype.properties),
            b.prototype.events) {
                var d = {};
                for (var e in b.prototype.events)
                    b.prototype.events.hasOwnProperty(e) && (d[e] = function(a) {
                        return function(b) {
                            return a.call(c, b, this)
                        }
                    }(b.prototype.events[e]));
                c.events = d
            }
            return c
        } catch (b) {
            console.error("Template init failed: " + a + "\n" + b.message)
        }
    }
    function g(b, c) {
        function d() {
            return q.length ? void require(q, function() {
                j(b),
                c && m[b] && (g = f(b),
                c(g))
            }) : (j(b),
            g = f(b),
            c && c(g),
            g)
        }
        if (!b && (b = a.config.error[404],
        !b))
            return void a.utils.log("sg.config.error['404']", "ViewError", 2);
        var g;
        if (m[b])
            return g = f(b),
            c && c(g),
            g;
        var h, i, k = a.config.resource[b] || {}, l = k.js || [], o = k.css || [], p = k.template, q = [];
        if (l && l.length)
            for (h = 0,
            i = l.length; h < i; h++)
                q.push(a.config.baseUrl + l[h]);
        if (o && o.length)
            for (h = 0,
            i = o.length; h < i; h++)
                q.push("require_css!" + a.config.baseUrl + o[h]);
        return n[b] ? d() : p ? void e(p, d) : (j(b),
        g = f(b),
        c && c(g),
        g)
    }
    function h() {
        return "sg_vm_" + o++
    }
    function i() {
        this._id = h()
    }
    function j(b, c, e) {
        return a.View.isReady || e ? m[b] ? m[b] : (c = c || {},
        c.template = c.template || n[b] || "",
        d(b, c)) : void l.push({
            name: b,
            options: c
        })
    }
    function k(a) {
        var b = m[a];
        return delete m[a],
        b
    }
    var l = []
      , m = {}
      , n = {}
      , o = 1;
    i.prototype = {
        preview: !1,
        needCache: !0,
        clearDomAfterDestroy: !1,
        getPreviewData: null,
        _render: function(b, c, d, e) {
            var f = this
              , g = 0;
            if (f.$parent = b,
            c = c || {},
            f.beforeRender) {
                if (f.preview) {
                    a.utils.log(f.constructor.name, "ViewPreviewStart");
                    var h = f.getPreviewData && f.getPreviewData() || {};
                    g = +new Date,
                    f.render($.extend({
                        sg_preview: 1
                    }, h, c), b, null, e, !0)
                }
                f.beforeRender(function(c, h) {
                    f.preview && (a.utils.log(f.constructor.name + " : " + (+new Date - g), "ViewPreviewEnd"),
                    a.Action.destroy(f),
                    f.$dom && (f.$dom.remove(),
                    f.$dom = null)),
                    f.render(c, b, d, e || h)
                }, c, b)
            } else
                f.render(c, b, d, e)
        },
        render: function(b, c, d, e, f) {
            var g, h = this, i = h.template;
            $.isPlainObject(i) && (g = i.css,
            i = i.html),
            b = b || {};
            var j = a.template.compile(i)(b);
            if (!c || !c.length)
                return j;
            var k = $(j);
            switch (c.addClass(g),
            e) {
            case -2:
                c.before(k);
                break;
            case -1:
                c.prepend(k);
                break;
            case 1:
                c.append(k);
                break;
            case 2:
                c.after(k);
                break;
            default:
                c.html(k)
            }
            return h.$dom = k,
            h.$parent = c,
            a.Action.init(h),
            f ? k : (d && d.call(h),
            h.afterRender && h.afterRender(b),
            k)
        },
        restart: null,
        _destroy: function(b) {
            var c = this
              , d = c.$dom;
            !b && a.config.needCache && c.needCache || (d && (a.Action.destroy(c),
            c.clearDomAfterDestroy && d.remove()),
            a.utils.log(this.constructor.name, "ViewDestroy"),
            c.destroy && c.destroy(),
            c.$dom = null,
            c.$parent = null)
        },
        destroy: null,
        refresh: function(a) {
            var b = this
              , c = b.$parent || b.$dom;
            b._destroy(!0),
            a ? b.render(a, c) : b._render(c)
        },
        apply: null
    },
    a.View = {
        require: g,
        init: b,
        define: j,
        remove: k
    }
}(window.sg),
sg.Router = function() {
    function a() {
        function a() {
            sg.fire("loadingStop", {
                $dom: f.$dom
            });
            var a = i.current.scrollTop || sg.config.defaultScrollTop;
            $(window).scrollTop(a),
            sg.utils.log("window : " + a, "ScrollRestore"),
            f.loaded = 1
        }
        function c() {
            var b, c;
            if (sg.utils.setTitle(f.title),
            f.$dom.appendTo(e).show().siblings(".sg_layout").detach(),
            g) {
                if (g.vm && (sg.utils.log(g.vm.constructor.name, "ViewLeave"),
                g.vm.leave && g.vm.leave(),
                sg.config.needCache && g.vm.needCache || (g.vm._destroy(),
                g.vm = null,
                g.loaded = 0)),
                b = f.scrollTop || sg.config.defaultScrollTop,
                $(window).scrollTop(b),
                sg.utils.log("window : " + b, "ScrollRestore"),
                sg.config.needCache && f.vm.needCache && f.loaded)
                    return f.$dom.hasClass(".sg_scroll_x") ? (c = f.$dom.data("scrollLeft") || 0,
                    f.$dom.scrollLeft(c),
                    sg.utils.log("sg_layout : " + scrollLeft, "ScrollRestore")) : f.$dom.hasClass(".sg_scroll_y") && (b = f.$dom.data("scrollTop") || 0,
                    f.$dom.scrollTop(b),
                    sg.utils.log("sg_layout : " + b, "ScrollRestore")),
                    f.$dom.find(".sg_scroll_x").each(function() {
                        var a = $(this)
                          , b = a.data("scrollLeft") || 0;
                        a.scrollLeft(b),
                        sg.utils.log("sg_scroll_x : " + b, "ScrollRestore")
                    }),
                    f.$dom.find(".sg_scroll_y").each(function() {
                        var a = $(this)
                          , b = a.data("scrollTop") || 0;
                        a.scrollTop(b),
                        sg.utils.log("sg_scroll_y : " + b, "ScrollRestore")
                    }),
                    sg.utils.log(f.vm.constructor.name, "ViewRestart"),
                    void (f.vm.restart && f.vm.restart());
                sg.utils.log("end", "ViewSwitch")
            }
            sg.fire("loadingStart", {
                $dom: f.$dom
            }),
            f.vm._render(f.$dom, f.params, a)
        }
        function d() {
            f.vm ? c() : (sg.fire("loadingStart", {
                $dom: e
            }),
            sg.View.require(f.vmName, function(a) {
                i.current.url == f.url && (sg.fire("loadingStop", {
                    $dom: e
                }),
                f.vm = a,
                c())
            }))
        }
        if (!1 !== i.update()) {
            if (sg.config.fixDirection && (!i.current || !i.current.tm))
                return void i.fixTm();
            sg.fire("routeChange");
            var e = sg.config.parent
              , f = i.current
              , g = i.last;
            if (g) {
                if (f.pathName == g.pathName && g.vm && g.vm.apply)
                    return f.vm = g.vm,
                    f.$dom = g.$dom,
                    f.loaded = g.loaded = 1,
                    void g.vm.apply(g, f);
                g.scrollTop = $(window).scrollTop(),
                sg.utils.log("window : " + g.scrollTop, "ScrollSave"),
                g.$dom.find(".sg_scroll_x").each(function() {
                    var a = $(this)
                      , b = a.scrollLeft();
                    a.data("scrollLeft", b),
                    sg.utils.log("sg_scroll_x : " + b, "ScrollSave")
                }),
                g.$dom.find(".sg_scroll_y").each(function() {
                    var a = $(this)
                      , b = a.scrollTop();
                    a.data("scrollTop", b),
                    sg.utils.log("sg_scroll_y : " + b, "ScrollSave")
                }),
                d()
            } else
                b(f.filters, f.pathName, f.params, !0, d)
        }
    }
    function b(a, b, c, d, e) {
        function f(h) {
            return h == g ? void (e && e.call(window)) : void (k[a[h]] ? k[a[h]].call(window, b, c, d, function() {
                f(h + 1)
            }) : f(h + 1))
        }
        if (!a)
            return e && e.call(window),
            !0;
        var g = a.length;
        f(0)
    }
    function c() {
        sg.router = d()
    }
    function d() {
        if (!i) {
            j = sg.config.html4Mode ? "hash" : history.pushState ? "history" : "hash",
            i = "history" == j ? new f : new g;
            var a = i.getPathName()
              , b = a.split("/");
            if (b.length > 1) {
                var c = {};
                for (var d in sg.config.routes)
                    c[d] = sg.config.routes[d],
                    d ? "/" != d[0] && (b[b.length - 1] = d,
                    c[b.join("/")] = sg.config.routes[d]) : (b[b.length - 1] = "",
                    c[b.join("/")] = sg.config.routes[d],
                    b[b.length - 1] = "index.html",
                    c[b.join("/")] = sg.config.routes[d],
                    b[b.length - 1] = "index.php",
                    c[b.join("/")] = sg.config.routes[d]);
                sg.config.routes = c
            }
        }
        return i
    }
    function e() {
        this.history = new sg.Cache(20),
        this.last = null,
        this.current = null
    }
    function f() {
        e.call(this)
    }
    function g() {
        e.call(this)
    }
    function h(a, b) {
        "string" == $.type(a) ? k[a] = b : "object" == $.type(a) && $.extend(k, a)
    }
    var i, j, k = {};
    return e.prototype = {
        start: function() {
            history.scrollRestoration && (history.scrollRestoration = "manual"),
            sg.on("sgComponentCreate", function(a) {
                sg.router.current && (a.instance.id || sg.router.current.componentInstances.push(a.instance))
            }),
            this._start()
        },
        update: function() {
            var a = this.getParams()
              , b = a.tm || 0;
            if (delete a.tm,
            !sg.config.fixDirection || b) {
                var c = location.href;
                if (this.current && this.current.url == c)
                    return !1;
                var d = this.history.get(c);
                if (d)
                    return this.last = this.current,
                    void (this.current = d);
                this.last = this.current;
                var e = $('<div class="sg_layout"></div>');
                this.current = {
                    tm: b,
                    params: a,
                    url: c,
                    queryString: this.getQueryString(),
                    requestUri: this.getRequestUri(),
                    pathName: this.getPathName(),
                    $dom: e,
                    componentInstances: []
                };
                var f = sg.config.routes[this.current.pathName]
                  , g = sg.config.resource[f]
                  , h = g && g.title || sg.config.title
                  , i = g && g.filters || sg.config.filters
                  , j = g && g.animation;
                this.current.vmName = f,
                this.current.title = h,
                this.current.filters = i,
                this.current.animation = j,
                this.history.set(c, this.current)
            }
        },
        getParams: function() {
            for (var a = this.getQueryString(), b = a.split("&"), c = {}, d = 0, e = b.length; d < e; d++) {
                var f = b[d].split("=");
                f[0] && void 0 != f[1] && (c[f[0]] = decodeURIComponent(f[1]))
            }
            return c
        },
        getParam: function(a) {
            return this.getParams()[a] || ""
        },
        getMode: function() {
            return j
        },
        getCleanUrl: function() {
            return this.removeParam("tm")
        },
        getCurrentHistory: function() {
            return this.current
        },
        getLastHistory: function() {
            return this.last
        }
    },
    f.prototype = {
        _start: function() {
            $(window).bind("popstate", a),
            setTimeout(function() {
                a()
            }, 0)
        },
        getQueryString: function() {
            return location.search.replace("?", "")
        },
        getRequestUri: function() {
            return location.pathname + location.search
        },
        getPathName: function() {
            return location.pathname
        },
        removeParam: function(a) {
            var b = new RegExp("&?" + a + "=[^&]*")
              , c = location.href.replace(b, "");
            return c = sg.utils.trim(c.replace("?&", "?"), "?")
        },
        redirect: function(c, d, e) {
            var f = c.replace(/\?.*/gi, "")
              , g = sg.config.routes[f]
              , h = sg.config.resource[g]
              , i = h && h.filters
              , j = sg.utils.getUrlParams(c);
            d = d || {},
            $.extend(j, d),
            b(i, f, j, e, function() {
                sg.config.fixDirection && (j.tm = +new Date);
                var b = $.param(j);
                b && (b = b.replace(/\+/gi, "%20")),
                b && (c = f + "?" + b),
                e ? history.replaceState(null, "", c) : history.pushState(null, "", c),
                a()
            })
        },
        fixTm: function() {
            var b = location.href;
            b += /\?/.test(b) ? "&tm=" + (new Date).getTime() : "?tm=" + (new Date).getTime(),
            history.replaceState(null, "", b),
            a()
        }
    },
    g.prototype = {
        _start: function() {
            $(window).bind("hashchange", a),
            setTimeout(function() {
                a()
            }, 0)
        },
        getQueryString: function() {
            return location.hash.replace(/#[^?]*\??/, "")
        },
        getRequestUri: function() {
            return location.hash.replace(/#!?/, "")
        },
        getPathName: function() {
            return this.getRequestUri().replace(/\?.*/, "")
        },
        removeParam: function(a) {
            var b = new RegExp("&?" + a + "=[^&]*")
              , c = location.hash.replace(b, "");
            return c = sg.utils.trim(c.replace("?&", "?"), "?"),
            location.protocol + "//" + location.host + location.pathname + location.search + c
        },
        redirect: function(a, c, d) {
            var e = a.replace(/\?.*/gi, "")
              , f = sg.config.routes[e]
              , g = sg.config.resource[f]
              , h = g && g.filters
              , i = sg.utils.getUrlParams(a);
            c = c || {},
            $.extend(i, c),
            b(h, e, i, d, function() {
                sg.config.fixDirection && (i.tm = +new Date);
                var b = $.param(i);
                b && (b = b.replace(/\+/gi, "%20")),
                b && (a = e + "?" + b),
                a && (a = "#!" + a),
                d ? location.replace(a) : location.href = a
            })
        },
        fixTm: function() {
            var a = location.hash;
            a ? a += /\?/.test(a) ? "&tm=" + (new Date).getTime() : "?tm=" + (new Date).getTime() : a = "#!?tm=" + (new Date).getTime(),
            location.replace(a)
        }
    },
    sg.utils.inherits(f, e),
    sg.utils.inherits(g, e),
    {
        HistoryRouter: f,
        HashRouter: g,
        init: c,
        addFilter: h,
        deps: ["View", "Event"]
    }
}(),
function(a) {
    function b(a, e) {
        return b.isReady ? void c(a, e) : void d.push({
            name: a,
            options: e
        })
    }
    function c(b, c) {
        if (e[b])
            return void a.utils.log(b, "ComponentExisted", 1);
        c.setOption || (c.setOption = function(a) {
            var b = this;
            $.extend(b.options, a),
            b.refresh()
        }
        );
        var d = c.destroy;
        c.destroy = function() {
            var a = this;
            a.$dom && f.remove(a.$dom, b),
            d && d.call(a),
            sg.utils.log(b, "ComponentDestroy")
        }
        ,
        c.needCache = !1,
        c.clearDomAfterDestroy = !0,
        a.View.define(b, c),
        e[b] = 1;
        var g = function(c, d) {
            var e;
            return !c || $.isPlainObject(c) ? (d = c || {},
            e = a.View.require(b),
            d && (e.options = $.extend({}, e.options, d)),
            e._render($("body")),
            a.fire("sgComponentCreate", {
                instance: e
            }),
            a.utils.log(b, "ComponentCreate")) : c && c.each && c.each(function() {
                var c = $(this);
                e = f.get(c, b),
                e || (e = a.View.require(b),
                d && (e.options = $.extend({}, e.options, d)),
                e.id = f.put(c, b, e),
                e._render(c),
                a.fire("sgComponentCreate", {
                    instance: e
                }),
                a.utils.log(b, "ComponentCreate"))
            }),
            e
        };
        g.toString = function() {
            var a, d, e = c.options, f = [];
            f.push("sg.Component." + b + "($dom, {");
            for (a in e)
                $.hasOwnProperty.call(e, a) && (d = e[a],
                d = "string" == $.type(d) ? '"' + d + '"' : "array" == $.type(d) ? "[" + d.join(",") + "]" : "object" == $.type(d) ? JSON.stringify(d) : "function" == $.type(d) ? "function() {}" : d,
                f.push("\t" + a + ": " + d + ","));
            return d = f.length - 1,
            d > 0 && (f[d] = f[d].slice(0, -1)),
            f.push("});"),
            f.join("\n")
        }
        ,
        a.Component[b] = g
    }
    var d = []
      , e = {}
      , f = {
        id: 1,
        get: function(a, b) {
            return f[b] || (f[b] = {}),
            f[b][a.data("sg_component_" + b + "_id")]
        },
        put: function(a, b, c) {
            var d = f.id++;
            return f[b] || (f[b] = {}),
            f[b][d] = c,
            a.data("sg_component_" + b + "_id", d),
            d
        },
        remove: function(a, b) {
            var c = a.data("sg_component_" + b + "_id");
            c && delete f[b][c]
        }
    };
    b.toString = function() {
        var a, b = [];
        for (a in e)
            b.push("sg.Component." + a);
        return b.join("\n")
    }
    ,
    b.init = function() {
        for (var a = 0, b = d.length; a < b; a++)
            c(d[a].name, d[a].options)
    }
    ,
    b.removeInstance = function(a, b) {
        f.remove(a, b)
    }
    ,
    b.getInstances = function(a) {
        return a ? f[a] : f
    }
    ,
    b.deps = ["View", "Event"],
    a.Component = b
}(window.sg),
function(a) {
    function b(b) {
        b || (b = {},
        a.Event.init(a.Action));
        var c = b.$dom || $(document.body);
        for (var d in f)
            c.each(function(a, c) {
                void 0 !== $(c).attr(d) && f[d].init.call(b, $(c))
            }),
            c.find("[" + d + "]").each(function(a, c) {
                f[d].init.call(b, $(c))
            })
    }
    function c(a) {
        var b = a.$dom;
        if (b)
            for (var c in f)
                f[c].destroy && (b.each(function(b, d) {
                    void 0 !== $(d).attr(c) && f[c].destroy.call(a, $(d))
                }),
                b.find("[" + c + "]").each(function(b, d) {
                    f[c].destroy.call(a, $(d))
                }))
    }
    function d(a) {
        return a ? f[a] || "" : f
    }
    function e(a) {
        $.extend(f, a)
    }
    var f = {
        "sg-view": {
            init: function(b) {
                var c = b.attr("sg-view");
                if (c) {
                    var d = a.utils.getTagParams(b);
                    setTimeout(function() {
                        a.View.require(c, function(a) {
                            a._render(b, d)
                        })
                    }, 0)
                }
            }
        },
        "sg-component": {
            init: function(b) {
                var c = b.attr("sg-component")
                  , d = a.utils.getTagParams(b);
                try {
                    a.Component[c](b, d)
                } catch (a) {
                    console.error("Component init failed: " + c + "\n" + a.message)
                }
            }
        },
        "sg-placeholder": {
            init: function(b) {
                a.Component.Placeholder(b, {
                    text: b.attr("sg-placeholder")
                })
            }
        },
        "sg-redirect": {
            init: function(a) {
                a.bind("click", function() {
                    var b = a.attr("sg-redirect")
                      , c = a.attr("sg-stop-propagation");
                    if ("-1" == b ? history.go(-1) : /^https?:\/\//gi.test(b) ? location.href = b : sg.router.redirect(b),
                    1 == c)
                        return !1
                })
            }
        },
        "sg-src": {
            init: function(a) {
                var b = a.attr("sg-src")
                  , c = a.attr("sg-src-type")
                  , d = a.parent()
                  , e = d.width()
                  , f = d.height();
                sg.utils.loadImage(b, function(d, g) {
                    var h;
                    switch (c) {
                    case "full":
                        h = sg.utils.resizeImageFull(g.width, g.height, e, f);
                        break;
                    default:
                        h = sg.utils.resizeImage(g.width, g.height, e, f)
                    }
                    a.css(h).attr("src", b)
                })
            }
        },
        "sg-list-wrapper-x": {
            init: function(a) {
                var b = a.children().eq(0)
                  , c = b.children()
                  , d = c.eq(0).outerWidth()
                  , e = parseInt(c.eq(1).css("margin-left"));
                b.width(d * c.length + e * (c.length - 1))
            }
        },
        "sg-bind": {
            init: function(b) {
                var c = this
                  , d = b.attr("sg-bind");
                if (Object.defineProperty && c._id && d) {
                    var e = c._id + "-sg-bind-" + d;
                    a.Action.on(e, function(a) {
                        b.text(a.text)
                    });
                    var f = Object.getOwnPropertyDescriptor(c, d);
                    if (f && f.hasOwnProperty("set"))
                        return void (c[d] = c[d]);
                    var g, h = c[d];
                    Object.defineProperty(c, d, {
                        configurable: !0,
                        enumerable: !0,
                        set: function(b) {
                            g = b,
                            a.Action.fire(e, {
                                text: b
                            })
                        },
                        get: function() {
                            return g
                        }
                    }),
                    f && setTimeout(function() {
                        c[d] = h
                    })
                }
            },
            destroy: function(b) {
                var c = this
                  , d = b.attr("sg-bind");
                if (Object.defineProperty && c._id && d) {
                    var e = c._id + "-sg-bind-" + d;
                    a.Action.un(e),
                    delete c[d]
                }
            }
        }
    };
    a.Action = {
        deps: ["View", "Component"],
        init: b,
        destroy: c,
        get: d,
        set: e
    }
}(window.sg),
$.fn.loadingStart = function(a) {
    a = a || {},
    this.each(function(b, c) {
        var d = $(c)
          , e = d.children(".sg_loading")
          , f = e.data("sg_loading_timer") || 0
          , g = e.data("sg_loading_start_time") || 0
          , h = a.delay || 500;
        f && clearTimeout(f),
        g || (e.length || (e = $('<div class="sg_loading"> <div class="sg_loading_spinner"> <div class="sg_loading_spinner_container"> <div class="sg_loading_spot"></div> <div class="sg_loading_spot"></div> <div class="sg_loading_spot"></div> <div class="sg_loading_spot"></div> </div> <div class="sg_loading_spinner_container"> <div class="sg_loading_spot"></div> <div class="sg_loading_spot"></div> <div class="sg_loading_spot"></div> <div class="sg_loading_spot"></div> </div> <div class="sg_loading_spinner_container"> <div class="sg_loading_spot"></div> <div class="sg_loading_spot"></div> <div class="sg_loading_spot"></div> <div class="sg_loading_spot"></div> </div> </div>数据加载中... </div>'),
        d.append(e)),
        a && $.isPlainObject(a) && e.css(a),
        e.data("sg_loading_timer", setTimeout(function() {
            e.show(),
            e.data("sg_loading_start_time", +new Date)
        }, h)))
    })
}
,
$.fn.loadingStop = function() {
    this.each(function(a, b) {
        var c, d = $(b), e = d.children(".sg_loading"), f = e.data("sg_loading_timer") || 0, g = e.data("sg_loading_start_time") || 0;
        if (f && clearTimeout(f),
        !g)
            return void e.hide();
        var h = +new Date - g;
        c = h > 500 ? 0 : 500 - h,
        e.data("sg_loading_start_time", 0),
        e.data("sg_loading_timer", setTimeout(function() {
            e.hide()
        }, c))
    })
}
,
sg.ready(function() {
    sg.on("loadingStart", function(a) {
        a.$dom.loadingStart({
            top: .2 * $(window).height() + "px"
        }, 100)
    }),
    sg.on("loadingStop", function(a) {
        a.$dom.loadingStop()
    })
}),
sg.Component("Popover", {
    template: '<div class="sg_popover_wrapper">{{if mask}}<div class="sg_popover_mask"></div>{{/if}}<div class="sg_popover"> {{if arrow}}<div class="sg_popover_triangle"></div>{{/if}}<div class="sg_popover_content"><ul class="sg_popover_list">{{each list as item}}<li class="sg_popover_item {{item.style}}"><a {{if item.link}}href="{{item.link}}"{{/if}} data-id="{{item.id}}">{{item.text}}</a></li>{{/each}}</ul></div><div class="sg_popover_triangle_bottom"></div></div></div>',
    render: function() {
        var a, b = this, c = b.options, d = b.template, e = $(c.target);
        if (!e.length || !c.list || !c.list.length)
            return !1;
        a = $(sg.template.compile(d)({
            list: c.list,
            mask: c.mask,
            arrow: c.arrow
        }));
        var f = a.find(".sg_popover_mask");
        e.on("click", function() {
            return b.$dom ? void b.$dom.show() : (a.find(".sg_popover_item").each(function(a) {
                var d = c.list[a]
                  , e = $(this);
                "function" == typeof d.click && e.click(function() {
                    var a = d.click();
                    return a !== !1 && b.hide(),
                    a
                })
            }),
            c.width && a.find(".sg_popover_content").width(c.width),
            $(document.body).append(a),
            b.$dom = a,
            b.ajust(),
            void 0)
        }),
        f.click(function() {
            b.$dom.hide()
        })
    },
    ajust: function() {
        var a, b = this, c = b.$dom, d = c.find(".sg_popover_triangle"), e = c.find(".sg_popover_triangle_bottom"), f = c.find(".sg_popover_list"), g = c.find(".sg_popover"), h = $(b.options.target), i = h.offset(), j = h.width(), k = h.height(), l = $(window).scrollTop(), m = i.top - l, n = $(window).width(), o = $(window).height(), p = f.width(), q = f.height(), r = (n - p) / 2, r = "right" != b.options.align ? (n - p) / 2 : i.left + j - p, s = i.left + j - p + 10, t = j / 2 + i.left - 10, r = r < s ? s : r, r = r > t ? t : r, u = i.left - r + j / 2;
        if (o > q) {
            var v = o - m - k;
            if ((v > m ? v : m) > q)
                if ("fixed" == h.css("position") ? (g.css("position", "fixed"),
                l = 0) : h.parents().each(function(a, b) {
                    if ("fixed" == $(b).css("position"))
                        return g.css("position", "fixed"),
                        l = 0,
                        !1
                }),
                v > i.top)
                    a = m + l + k + 2,
                    b.options.arrow || (a -= 15),
                    g.css({
                        left: r,
                        top: a
                    }),
                    d.css({
                        left: u
                    }),
                    d.show(),
                    e.hide();
                else {
                    var w = v + k - 3;
                    b.options.arrow || (w += 15),
                    g.css({
                        left: r,
                        bottom: w
                    }),
                    e.css({
                        left: u
                    }),
                    d.hide(),
                    e.show()
                }
            else
                d.hide(),
                e.hide(),
                a = (o - q) / 2 - 15,
                g.css({
                    left: r,
                    top: a,
                    position: "fixed"
                })
        } else {
            var x = Math.floor(o / 41) - 1
              , x = x > 10 ? 10 : x;
            d.hide(),
            e.hide(),
            f.find("li:gt(" + x + ")").hide(),
            q = f.height(),
            a = (o - q) / 2 - 15,
            g.css({
                left: r,
                top: a,
                position: "fixed"
            })
        }
    },
    destroy: function() {
        var a = this;
        a.$dom && (a.$dom.remove(),
        a.$dom = null)
    },
    show: function() {
        var a = this;
        a.$dom && (a.ajust(),
        a.$dom.show())
    },
    hide: function() {
        var a = this;
        a.$dom && a.$dom.hide()
    },
    options: {
        target: "",
        direction: "default",
        mask: !0,
        arrow: !0,
        width: null,
        list: []
    }
}),
sg.Component("Notice", {
    template: '<div class="sg_notice sg_animate move_y reverse in {{status[options.type]}}">{{if options.type == 1}}<i class="icon_success sg_notice_icon"></i> {{else}}<i class="icon_alert sg_notice_icon"></i>{{/if}}{{options.text}}</div>',
    beforeRender: function(a) {
        a({
            options: this.options,
            status: ["failed", "success", "alter"]
        }, 1)
    },
    afterRender: function() {
        var a = this
          , b = a.options
          , c = a.$dom;
        c.css({
            "min-width": b.minWidth,
            "margin-left": -c.outerWidth() / 2,
            "margin-top": -c.outerHeight() / 2
        }),
        c.outerWidth() > 500 && c.outerHeight() > 44 && c.css({
            "margin-top": -11
        }),
        setTimeout(function() {
            setTimeout(function() {
                c.remove(),
                b.noticeEndCallback && b.noticeEndCallback()
            }, 350),
            c.removeClass("in reverse").addClass("out")
        }, 1600)
    },
    options: {
        text: null,
        type: 0,
        minWidth: null,
        noticeEndCallback: ""
    }
}),
sg.Component("Switch", {
    properties: {
        value: 0
    },
    template: '<div class="sg_switch"><div class="sg_switch_handel"></div></div>',
    afterRender: function() {
        var a = this
          , b = a.options
          , c = a.$dom
          , d = a.$parent;
        c.css({
            width: parseInt(b.width),
            height: parseInt(b.height),
            "background-color": b.normal_color,
            "border-radius": "70px",
            border: "1px solid #E4E4E4",
            display: b.display
        }),
        c.find(".sg_switch_handel").css({
            height: b.height,
            width: b.height,
            "background-color": "white",
            "border-radius": b.height / 2,
            "box-shadow": "0 2px 4px rgba(0, 0, 0, .3)",
            "-webkit-transition": " -webkit-transform .2s"
        }),
        c.bind("click", function() {
            1 == a.value ? a.close() : a.open(),
            d.trigger("change", {
                switch: a
            })
        }),
        parseInt(b.value) && (a.value = 1,
        a.open())
    },
    open: function() {
        var a = this
          , b = a.options
          , c = a.$dom;
        a.value = 1,
        c.css({
            "background-color": b.select_color
        }),
        c.find(".sg_switch_handel").css({
            "-webkit-transform": "translateX(" + (b.width - b.height) + "px)",
            transform: "translateX(" + (b.width - b.height) + "px)"
        })
    },
    close: function() {
        var a = this
          , b = a.options
          , c = a.$dom;
        a.value = 0,
        c.css({
            "background-color": b.normal_color
        }),
        c.find(".sg_switch_handel").css({
            "-webkit-transform": "translateX(0)",
            transform: "translateX(0)"
        })
    },
    getValue: function() {
        return this.value
    },
    options: {
        width: 50,
        height: 30,
        normal_color: "white",
        select_color: "#18B8F5",
        display: "inline-block",
        value: 0
    }
}),
sg.Component("Page", {
    template: '<div class="sg_pagination ib" ><div class="sg_page_item sg_prev_page icon_chevron_left"></div> <div class="sg_page_item_wrapper ib">{{each page_array as i}} <div class="sg_page_item{{if (i == current)}} sg_page_current{{/if}}" page-id="{{i}}">{{i}}</div>{{/each}} </div> <div class="sg_next_page sg_page_item icon_chevron_right"> </div></div>',
    beforeRender: function(a) {
        var b = this
          , c = b.options
          , d = [];
        if (!(c.pageSum <= 1)) {
            c.setLimit && (c.pageSum = Math.min(c.setLimit, c.pageSum),
            c.pageCurrent = Math.min(c.setLimit, c.pageCurrent)),
            c.pageCurrent = Math.min(c.pageSum, c.pageCurrent);
            var e = b.getFirstPage(c.pageCurrent, c.pageShow, c.pageSum);
            c.pageShow = Math.min(c.pageShow, c.pageSum);
            for (var f = 0; f < c.pageShow; f++)
                d.push(e),
                e++;
            a({
                current: c.pageCurrent > c.pageSum ? c.pageSum : c.pageCurrent,
                page_array: d
            }, 1)
        }
    },
    afterRender: function() {
        var a = this
          , b = a.options
          , c = a.$dom
          , d = c.find(".sg_page_item");
        a.setDisabled(b.pageCurrent),
        b.isBindClick && d.bind("click", function() {
            var c = $(this)
              , d = b.pageCurrent;
            if (!c.hasClass("disabled") && !c.hasClass("sg_page_current")) {
                if (c.hasClass("sg_prev_page")) {
                    if (1 == d)
                        return;
                    d -= 1
                } else if (c.hasClass("sg_next_page")) {
                    if (d == b.pageSum)
                        return;
                    d += 1
                } else
                    d = parseInt($(this).attr("page-id"));
                b.beforeChangePageCallback && b.beforeChangePageCallback(d) === !1 || a.setPage(d)
            }
        })
    },
    setPage: function(a) {
        var b = this;
        b.setOption({
            pageCurrent: a
        }),
        b.options.changePageCallback && (b.options.changePageCallback(a),
        sg.fire("push"))
    },
    getFirstPage: function(a, b, c) {
        var d = Math.ceil((b - 1) / 2)
          , e = Math.max(a - d, 1);
        return a + d > c && (e = c >= b ? c - b + 1 : 1),
        e
    },
    getPage: function() {
        return this.options.pageCurrent
    },
    setDisabled: function(a) {
        var b = this
          , c = b.options
          , d = b.$dom;
        1 == a ? (d.find(".sg_prev_page").addClass("disabled"),
        d.find(".sg_next_page").removeClass("disabled")) : a == c.pageSum ? (d.find(".sg_next_page").addClass("disabled"),
        d.find(".sg_prev_page").removeClass("disabled")) : (d.find(".sg_prev_page").removeClass("disabled"),
        d.find(".sg_next_page").removeClass("disabled")),
        c.setLimit && (d.find(".sg_page_notice").remove(),
        a == c.setLimit && d.prepend('<div class="sg_page_notice">最多支持' + c.setLimit + "页，如果想看更多信息请联系客服</div>"))
    },
    options: {
        changePageCallback: null,
        pageSum: 0,
        pageCurrent: 1,
        pageShow: 5,
        isBindClick: !0,
        beforeChangePageCallback: null,
        setLimit: 1e3
    }
}),
sg.Component("Placeholder", {
    template: '<div class="sg_input_prompt" style="position: absolute;">{{#text}}</div>',
    beforeRender: function(a) {
        a({
            text: this.options.text
        }, 2)
    },
    afterRender: function() {
        var a = this
          , b = a.$dom
          , c = a.$parent
          , d = a.options
          , e = (parseInt(b.css("z-index")) || 0) + 1
          , f = function(a) {
            return parseFloat(c.css(a)) || 0
        }
          , g = c.position();
        b.css({
            color: d.color,
            fontSize: c.css("font-size"),
            lineHeight: (parseInt(d.lineHeight) || f("line-height")) + "px",
            "max-width": parseInt(c.css("width")) - d.left - d.right + "px",
            top: g.top + f("margin-top") + (parseInt(d.top) || 0),
            left: g.left + f("margin-left") + (parseInt(d.left) || 0),
            right: g.right + f("margin-right") + (parseInt(d.right) || 0),
            paddingTop: f("padding-top") + f("border-top-width"),
            paddingLeft: f("padding-left") + f("border-left-width"),
            zIndex: e,
            "font-weight": "normal"
        }).addClass("hide_long"),
        c.val() && b.hide(),
        c.bind("input keyup", function() {
            a.reflow()
        }).bind("click blur", function(b) {
            a.reflow()
        }),
        b.bind("mousedown", function(a) {
            c.focus()
        }).bind("mouseup", function(a) {
            3 == a.which && b.hide(),
            c.focus()
        })
    },
    reflow: function() {
        this.$parent.val() ? this.$dom.hide() : this.$dom.show()
    },
    options: {
        text: "请输入文本",
        color: "#999999",
        top: 0,
        left: 0,
        right: 0,
        lineHeight: null
    }
}),
sg.Component("AutoComplete", {
    template: '{{each list as i index}} <div class="sg_autocomplete_li">{{#i}}</div>{{/each}}{{if history}}<div class="clear_history"><a class="clear">清空历史</a></div>{{/if}}',
    render: function(a, b) {
        var c = this
          , d = c.options
          , e = d.updateList || c.updateList
          , f = (d.onSelect || c.onSelect,
        d.history || c.history)
          , g = b;
        b = $('<div class="sg_autocomplete hide_ele"></div>');
        var h = g.position()
          , i = parseInt(g.css("margin-left")) || 0
          , j = parseInt(g.css("margin-top")) || 0
          , k = g.outerWidth()
          , l = g.outerHeight()
          , m = h.top
          , n = h.left;
        b.css({
            top: m + l + j,
            left: n + i,
            width: k
        }),
        c.$dom = b,
        c.$input_dom = g,
        g.after(b),
        g.bind("input propertychange", function(a) {
            return "propertychange" == a.type && c.hasKeyDown ? void (c.hasKeyDown = !1) : void e.call(c, g.val(), function(a, b) {
                c.renderList(a, b)
            })
        }).bind("keydown", function(a) {
            var d = b.find(".sg_autocomplete_li.selected").index()
              , e = c.list || []
              , f = e.length;
            switch (a.which) {
            case sg.keyCode.DownArrow:
                if (!c.isVisible())
                    return;
                d++,
                d > f - 1 && (d = 0);
                break;
            case sg.keyCode.UpArrow:
                if (!c.isVisible())
                    return;
                d--,
                d < 0 && (d = f - 1);
                break;
            case sg.keyCode.Enter:
                if (d == -1) {
                    var h = g.val();
                    if (!h)
                        return;
                    c.onSelect.call(c, {
                        value: h,
                        text: h
                    }, "keydown")
                } else
                    c.onSelect.call(c, e[d], "keydown");
                return;
            default:
                return void (c.hasKeyDown = !1)
            }
            return c.hasKeyDown = !0,
            $.isPlainObject(e[d]) ? g.val(e[d].value) : g.val(e[d]),
            b.children().eq(d).addClass("selected").siblings(".sg_autocomplete_li").removeClass("selected"),
            !1
        }).bind("focus", function() {
            var a = $.trim(g.val());
            return b.show(),
            a ? void e.call(c, g.val(), function(a, b) {
                c.renderList(a, b)
            }) : void (f && e.call(c, g.val(), function(a, b) {
                c.renderList(a, b)
            }))
        }).bind("click", function() {
            return !1
        }),
        b.bind("mouseover", function(a) {
            var b = $(a.target).closest(".sg_autocomplete_li");
            b.length && b.addClass("selected").siblings(".sg_autocomplete_li").removeClass("selected")
        }).bind("click", function(a) {
            var b = $(a.target).closest(".sg_autocomplete_li");
            b.length && c.list[b.index()] && c.onSelect.call(c, c.list[b.index()], "click")
        }),
        $(document).bind("click", function(a) {
            var b = $(a.target).closest(".sg_autocomplete")
              , d = b.children().hasClass("clear_history");
            if (!$(a.target).closest(".input_wrapper").length)
                return f && d ? void c.hide() : void (b.length || c.hide())
        })
    },
    updateList: function(a, b) {
        var c, d, e = this, f = e.options.list, g = [];
        if (a = $.trim(a),
        !a && !history)
            return void b(g);
        for (c = 0,
        d = f.length; c < d; c++)
            f[c].indexOf(a) > -1 && g.push({
                value: f[c],
                text: f[c].replace(a, '<span class="sg_autocomplete_li_hl">' + a + "</span>")
            });
        b(g)
    },
    renderList: function(a, b) {
        var c = this
          , d = c.template
          , e = c.$dom
          , f = c.options
          , g = [];
        if (c.list = a,
        $.isPlainObject(d) && (d = d.html),
        a.length) {
            if ($.isPlainObject(a[0]))
                for (var h = 0, i = a.length; h < i; h++)
                    g.push(a[h].text);
            else
                g = a;
            e.html(sg.template.compile(d)({
                list: g,
                history: b
            })),
            b && f.clear_history && f.clear_history.call(c.$dom),
            c.show()
        } else
            c.hide(),
            f.emptyCallback && f.emptyCallback.call(c)
    },
    onSelect: function(a, b) {
        var c = this
          , d = c.options
          , e = c.$input_dom;
        c.hide(),
        e.blur(),
        c.hasKeyDown = !0,
        $.isPlainObject(a) ? e.val(a.value) : e.val(a),
        e.trigger("click"),
        d.onSelect && d.onSelect.call(c, a, b)
    },
    hide: function() {
        var a = this
          , b = a.$dom;
        b.hasClass("hide_ele") || b.addClass("hide_ele")
    },
    show: function() {
        var a = this
          , b = a.$dom
          , c = a.$input_dom
          , d = c.val();
        if (b.hasClass("hide_ele") && a.list && a.list.length) {
            if (1 == a.list.length && (a.list[0] == d || a.list[0].value == d))
                return;
            b.removeClass("hide_ele")
        }
    },
    isVisible: function() {
        return !this.$dom.hasClass("hide_ele")
    },
    options: {
        list: [],
        emptyCallback: null,
        updateList: null,
        onSelect: null,
        history: null,
        clear_history: null
    }
}),
sg.Component("Dialog", {
    template: '<div class="sg_dialog{{if dialogClass}} {{dialogClass}}{{/if}}"> <div class="sg_dialog_mask"></div> <div class="sg_dialog_content_wrapper{{if contentClass}} {{contentClass}}{{/if}}"> <div class="sg_dialog_content" sg-view="{{template}}">{{#content}}</div>{{if closeBtn}}<div class="icon_close sg_dialog_btn_close"></div>{{/if}}</div> </div>',
    beforeRender: function(a) {
        var b = this
          , c = b.options;
        a({
            template: c.template || "",
            content: c.content || "",
            closeBtn: c.closeBtn,
            dialogClass: c.dialogClass,
            contentClass: c.contentClass
        }, 1)
    },
    afterRender: function() {
        var a = this
          , b = a.options
          , c = a.$dom
          , d = c.find(".sg_dialog_content_wrapper")
          , e = c.find(".sg_dialog_content")
          , f = c.find(".sg_dialog_mask");
        if (c.find(".sg_dialog_btn_close").bind("click", function() {
            a.hide()
        }),
        b.vm && (b.vm.dialog = a,
        b.vm._render(e, b.vm_data)),
        b.persist || f.bind("click", function() {
            a.hide()
        }),
        b.needOutAnimation && sg.config.animationEnd && d.bind(sg.config.animationEnd, function() {
            var a = $(this);
            a.hasClass("out") && (a.removeClass("out"),
            c.hide())
        }),
        $.isPlainObject(b.mobileDefaultTemplate)) {
            b.closeBtn = !1,
            e.append(sg.template.compile('<div class="sg_dialog_content_inner {{title.css}}">{{=title.text}}</div><div class="btn_wrapper ib"><div class="dialog_btn {{btn_left.css}} first">{{btn_left.text}}</div><div class="dialog_btn {{btn_right.css}}">{{btn_right.text}}</div></div>')(b.mobileDefaultTemplate));
            var g = e.find(".close_btn");
            g && g.bind("click", function() {
                a.hide()
            }),
            b.mobileDefaultTemplate.btn_left && b.mobileDefaultTemplate.btn_left.callback && $(e.find(".dialog_btn").get(0)).bind("click", function() {
                b.mobileDefaultTemplate.btn_left.callback(a)
            }),
            b.mobileDefaultTemplate.btn_right && b.mobileDefaultTemplate.btn_right.callback && $(e.find(".dialog_btn").get(1)).bind("click", function() {
                b.mobileDefaultTemplate.btn_right.callback(a)
            })
        }
        c.hide()
    },
    resize: function() {
        var a = this
          , b = a.$dom
          , c = b.find(".sg_dialog_content_wrapper")
          , d = $(window).height()
          , e = c.height()
          , f = c.width()
          , g = d - e
          , h = a.options.verticalMiddle ? .5 * (d - e) : g / e < .618 ? g / 2 : .382 * d - e / 2
          , i = "-" + f / 2 + "px";
        c.css({
            top: h,
            "margin-left": i
        })
    },
    show: function(a) {
        var b = this
          , c = b.options;
        if (a && b.refresh(),
        b.$dom.show(),
        b.$dom.find(".sg_dialog_mask").show(),
        c.lockScroll) {
            var d = $("body")
              , e = sg.utils.getScrollBarWidth(d);
            d.get(0).style.marginRight,
            d.css("margin-right", e + (parseFloat(d.css("margin-right")) || 0)).css("overflow-y", "hidden")
        }
        b.resize()
    },
    hide: function() {
        var a, b = this, c = b.options, d = b.$dom;
        d && (a = d.find(".sg_dialog_content_wrapper"),
        c.lockScroll && $("body").css({
            "margin-right": 0,
            "overflow-y": "auto"
        }),
        c.needOutAnimation && sg.config.animationEnd && a.hasClass("sg_animate") && a.hasClass("in") ? (d.find(".sg_dialog_mask").hide(),
        a.addClass("out")) : d.hide(),
        c.afterHide.call(b))
    },
    options: {
        template: "",
        content: "",
        vm: "",
        vm_data: {},
        dialogClass: "",
        contentClass: "",
        persist: !1,
        closeBtn: !0,
        needOutAnimation: !1,
        verticalMiddle: !1,
        mobileDefaultTemplate: "",
        afterHide: function() {},
        lockScroll: !1,
        parent: null
    }
}),
sg.Component("Select", {
    template: '<div class="sg_mselect_button" style="width: {{width}}px"><span class="sg_mselect_text">{{#nonetext}}</span><span class="sg_mselect_triangle_down"></span></div><div class="sg_mselect_select" style="width: {{width-1}}px; max-height: {{select_height}}px">{{each contents as i index}}<div class="sg_mselect_option" style="height: {{row_height}}px; line-height: {{row_height}}px" key="{{i[0]}}" index="{{index++}}">{{#i[1]}}</div>{{/each}}</div>',
    beforeRender: function(a) {
        return a(this.options)
    },
    afterRender: function() {
        var a = this
          , b = a.$parent;
        if (a.$btn = b.find(".sg_mselect_button"),
        a.$slt = b.find(".sg_mselect_select"),
        a.$title = a.$btn.find(".sg_mselect_text"),
        a.$triangle = a.$btn.find(".sg_mselect_triangle_down"),
        b.css({
            position: "relative"
        }),
        null !== a.options.default_value)
            for (var c = 0, d = a.options.contents.length; c < d; c++)
                if (a.options.contents[c][0] == a.options.default_value) {
                    a.options.default_index = c;
                    break
                }
        null !== a.options.default_index && a.setSelection(a.options.default_index),
        $(document).unbind("click", a.event.click).bind("click", a.event.click),
        a.$slt.bind("mousemove", function(a) {
            var b = $(a.target);
            b.hasClass("sg_mselect_option") || (b = b.parents(".sg_mselect_option")),
            b.addClass("sg_mselect_option_hover").siblings().removeClass("sg_mselect_option_hover")
        })
    },
    getSelection: function() {
        return null === this.selected ? null : this.options.contents[this.selected]
    },
    setSelection: function(a) {
        var b = this;
        b.selected != a && null !== a && (b.selected = a,
        b.$title.html(b.options.contents[b.selected][1]),
        b.$slt.children().removeClass("sg_mselect_option_selected").eq(b.selected).addClass("sg_mselect_option_selected"))
    },
    open: function() {
        this.is_open || (this.$parent.addClass("sg_mselect_selected"),
        this.$btn.find(".sg_mselect_triangle_down").attr("class", "sg_mselect_triangle_up"),
        null !== this.selected && this.$slt.scrollTop(this.options.row_height * this.selected),
        sg.fire(this.$parent.attr("id") + "." + this.options.onopen),
        this.is_open = !0)
    },
    close: function() {
        this.is_open && (this.$parent.removeClass("sg_mselect_selected"),
        this.$btn.find(".sg_mselect_triangle_up").attr("class", "sg_mselect_triangle_down"),
        sg.fire(this.$parent.attr("id") + "." + this.options.onclose),
        this.is_open = !1)
    },
    event: {
        click: function(a) {
            var b = $(a.target)
              , c = b.closest(".sg_mselect_option")
              , d = b.closest(".sg_mselect_button");
            if (c.length || d.length) {
                var e, f;
                c.length ? (e = c.parent().parent(),
                f = sg.Component.Select(e),
                f.setSelection(parseInt(b.attr("index"))),
                sg.fire(f.$parent.attr("id") + "." + f.options.onchange),
                f.close()) : (e = d.parent(),
                f = sg.Component.Select(e),
                f.open())
            } else {
                var g = sg.Component.getInstances().Select;
                for (var h in g)
                    g.hasOwnProperty(h) && g[h].close()
            }
        }
    },
    options: {
        contents: [],
        default_index: null,
        default_value: null,
        nonetext: "please select",
        width: 80,
        row_height: 15,
        select_height: 200,
        onchange: "onchange",
        onclose: "onclose",
        onopen: "onopen"
    }
}),
sg.Component("ActionSheet", {
    template: '<div class="sg_actionsheet"><div class="sg_actionsheet_content_wrapper"><div class="sg_actionsheet_content"><div class="sg_actionsheet_group">{{if title}}<div class="sg_actionsheet_title">{{title}}</div>{{/if}}{{each actionList as action}}<div class="sg_actionsheet_btn">{{action.text}}</div>{{/each}}</div><div class="sg_actionsheet_group sg_actionsheet_group_cancel"><div class="sg_actionsheet_btn sg_actionsheet_btn_cancel">{{cancelText}}</div></div></div></div></div>',
    beforeRender: function(a) {
        var b = this
          , c = b.options;
        a({
            actionList: c.actionList,
            title: c.title,
            cancelText: c.cancelText || "取消"
        }, 1)
    },
    afterRender: function() {
        var a = this
          , b = a.$dom
          , c = a.options;
        b.bind(sg.config.transitionEnd, function() {
            $(this).hasClass("active") || a._destroy()
        }),
        b.bind("click", function(b) {
            $(b.target).closest(".sg_actionsheet_content_wrapper").length || a.hide()
        }),
        b.find(".sg_actionsheet_btn").bind("click", function() {
            var b = $(this)
              , d = b.index(".sg_actionsheet_btn");
            b.hasClass("sg_actionsheet_btn_cancel") ? c.onCancel && c.onCancel() : c.actionList[d].callback && c.actionList[d].callback(),
            a.hide()
        }),
        sg.utils.reflow(),
        b.addClass("active")
    },
    hide: function() {
        var a = this
          , b = a.$dom;
        b && b.removeClass("active")
    },
    options: {
        actionList: [],
        title: "",
        cancelText: "",
        onCancel: function() {}
    }
}),
sg.Component("ScrollItem", {
    template: '<div class="sg_scroll_content">{{each scroll_array as item}}<div class="sg_scroll_item">{{=item}}</div>{{/each}}<div class="sg_scroll_item">{{=scroll_array[0]}}</div></div>',
    beforeRender: function(a) {
        var b = this
          , c = b.options.scroll_array;
        !c || c.length < 2 || a({
            scroll_array: c
        })
    },
    afterRender: function() {
        var a = this
          , b = a.$dom
          , c = a.$parent
          , d = a.options
          , e = b.find(".sg_scroll_item").outerHeight();
        c.css({
            height: e,
            overflow: "hidden"
        }),
        a.scrollMsg(b, e, d.scroll_array.length, d.scroll_time, d.waite_time)
    },
    scrollMsg: function(a, b, c, d, e) {
        var f = e + d
          , g = 0;
        setInterval(function() {
            g == c - 1 && setTimeout(function() {
                g = 0,
                a.css({
                    "-webkit-transform": "translate3d(0,0, 0)",
                    transform: "translate3d(0,0, 0)",
                    "-webkit-transition": "none",
                    transition: "none"
                })
            }, d),
            g++,
            a.css({
                "-webkit-transform": "translate3d(0, -" + b * g + "px, 0)",
                transform: "translate3d(0, -" + b * g + "px, 0)",
                "-webkit-transition": "-webkit-transform " + d + "ms",
                transition: "transform " + d + "ms"
            })
        }, f)
    },
    options: {
        scroll_array: [],
        scroll_time: 600,
        waite_time: 2e3
    }
}),
sg.Component("ListView", {
    template: '{{each data as item}}<div class="sg_listview"><div sg-view="{{vm_name}}"><param id="item" type="json" value="{{item.replace(/&quot;/ig, \'\')}}"></div></div>{{/each}}',
    beforeRender: function(a) {
        if (!this.options.item_vm) {
            var b = "lack of sub view model";
            return sg.fire("list_view_error", b),
            void (this.options.onError && this.options.onError(b))
        }
        var c = this;
        if (this.options.url) {
            c.offset = c.options.start,
            c._request(c.options.limit, function(b, d) {
                a({
                    data: b,
                    vm_name: c.options.item_vm,
                    is_end: d
                })
            });
            var d = 0;
            sg.un(c.options.item_vm + "_afterrender"),
            sg.on(c.options.item_vm + "_afterrender", function(a) {
                d++,
                c.options.limit - c.is_end == d && (c.options.done(a.$dom, c.originData, c.is_end),
                sg.un(c.options.item_vm + "_afterrender"))
            })
        } else {
            if (!$.isArray(c.options.data))
                return b = "invalid data format",
                sg.fire("listview_error", b),
                void (c.options.onAjaxError && c.options.onAjaxError(b));
            a({
                data: c.options.data,
                vm_name: c.options.item_vm
            })
        }
    },
    afterRender: function(a) {
        var b = this
          , c = b.$parent;
        return a.data && !a.data.length ? void b.options.empty(c) : (b.is_end = a.is_end,
        sg.View.remove(b.options.item_vm),
        sg.View.define(b.options.item_vm, {
            beforeRender: function(a, c) {
                b.options.itemBeforeRender(c),
                a(c.item)
            },
            afterRender: function() {
                b.options.itemAfterRender(this.$parent),
                sg.fire(b.options.item_vm + "_afterrender", {
                    $dom: c
                })
            }
        }),
        void 0)
    },
    getOffset: function() {
        return this.offset || 0
    },
    getTotal: function() {
        return this.total || 0
    },
    append: function(a, b) {
        var c = this;
        b && (c.offset = b),
        c._request(c.options.limit, function(a, b) {
            $.each(a, function(a, d) {
                var e = $('<div class="sg_listview"></div>');
                sg.View.require(c.options.item_vm)._render(e, {
                    item: JSON.parse(d),
                    is_end: b
                }),
                c.$parent.append(e)
            }),
            c.options.done(c.$parent, c.originData, b)
        }, function(b) {
            "function" == typeof a && a(b)
        })
    },
    _request: function(a, b, c) {
        var d = this
          , e = d.options.format.start
          , f = d.options.format.limit
          , g = d.options.params;
        g[e] = d.offset,
        g[f] = a,
        sg.Model.get(d.options.url, !1, "POST" == d.options.method).getData(g, function(a) {
            return a.errno ? (sg.fire("listview_ajax_error", error),
            d.options.onAjaxError && d.options.onAjaxError(error),
            void (c && c(error))) : (d.originData = a.data,
            d.total = d.originData.total,
            a = d._findResponseArray(a),
            a = $.map(a, function(a) {
                return JSON.stringify(a)
            }),
            d.offset += a.length,
            d.total || (d.total = d.offset),
            b && b(a, g[f] - a.length),
            void 0)
        }, function(a) {
            sg.fire("listview_ajax_error", a),
            d.options.onAjaxError && d.options.onAjaxError(a),
            c && c(a)
        })
    },
    _findResponseArray: function(a) {
        var b = this
          , c = !1;
        if ($.isArray(a))
            c = a;
        else
            for (var d in a)
                if ("object" == typeof a[d] && (c = b._findResponseArray(a[d])),
                c)
                    break;
        return c || []
    },
    options: {
        item_vm: "",
        list_data: [],
        url: "",
        method: "GET",
        start: 0,
        limit: 10,
        params: {},
        format: {
            start: "start",
            limit: "len"
        },
        onError: function(a) {},
        onAjaxError: function(a) {},
        empty: function() {},
        itemBeforeRender: function(a) {},
        itemAfterRender: function(a) {},
        done: function() {}
    }
}),
sg.Component("PullRefresh", {
    template: '{{if refresh}}<div class="sg_loader sg_loader_top">{{if vm}}<div class="sg_loader_content" sg-view="{{vm}}"></div>{{else}}<div class="sg_loader_text">下拉刷新</div>{{/if}}</div>{{/if}}{{if pull}}<div class="sg_loader sg_loader_bottom">{{if vm}}<div class="sg_loader_content"></div>{{else}}<div class="sg_loader_text">上拉加载更多</div>{{/if}}</div>{{/if}}',
    render: function(a, b) {
        var c = this;
        c.winHeight = $(window).height(),
        c.parent = $('<div class="sg_loader_parent sg_scroll_y"></div>').insertAfter(b).append(b),
        c.$dom = c.parent.children(),
        c.parentHeight = c.parent.height(),
        c.$dom.css({
            "z-index": "10",
            position: "relative",
            "will-change": "transform",
            "-webkit-transition-property": "transform",
            "-webkit-transition-timing-function": "cubic-bezier(0.075, 0.82, 0.165, 1)",
            "transition-property": "transform",
            "transition-timing-function": "cubic-bezier(0.075, 0.82, 0.165, 1)"
        }),
        "refresh" != c.options.type && "both" != c.options.type || (c.refresh = $(sg.template.compile(c.template)({
            refresh: 1,
            vm: c.options.vm
        })).insertBefore(c.$dom)),
        "pull" != c.options.type && "both" != c.options.type || (c.pull = $(sg.template.compile(c.template)({
            pull: 1,
            vm: c.options.vm
        })).insertAfter(c.$dom),
        c.options.vm ? sg.View.require(c.options.vm).render({}, function() {
            c._resizePull()
        }) : c._resizePull()),
        c.$dom.bind("touchstart", c.events._touchStart),
        c.$dom.bind("touchmove", c.events._touchMove),
        c.$dom.bind("touchend", c.events._touchEnd),
        c.$dom.bind(sg.config.transitionEnd, c.events._transitionEnd),
        c.options.auto && c._auto()
    },
    _resizePull: function() {
        this.contentHeight = this.pull.height(),
        this.pull.css("top", this.$dom.height() - this.contentHeight)
    },
    events: {
        _touchStart: function(a) {
            var b = a.originalEvent
              , c = this;
            c.is_animate || c.is_draging || c.auto || ("pull" != c.options.type && "both" != c.options.type || c._resizePull(),
            c.is_start = 1,
            c.startX = b.touches[0].pageX,
            c.startY = b.touches[0].pageY)
        },
        _touchMove: function(a) {
            var b = a.originalEvent
              , c = this;
            if (c.is_animate || !c.is_start || a.originalEvent.touches.length > 1)
                return void b.preventDefault();
            c.moveX = b.touches[0].pageX,
            c.moveY = b.touches[0].pageY;
            var d = c.parent.scrollTop();
            if (("refresh" == c.options.type || "both" == c.options.type) && c.moveY - c.startY >= 0 && (c.refreshHeight || (c.refreshHeight = c.refresh.height()),
            !c.is_back && !d && c.moveY - c.startY >= 0 ? (b.preventDefault(),
            c.distance = c.moveY - c.startY,
            c.distance > c.refreshHeight ? ("holding" != c.status && c.options.statusChange.call(c.refresh, "holding", "refresh"),
            c.status = "holding",
            c.distance -= .5 * (c.distance - c.refreshHeight),
            c.is_load = 1,
            c.type = "refresh") : (c.is_load = 0,
            "init" != c.status && c.options.statusChange.call(c.refresh, "init", "refresh"),
            c.status = "init"),
            c._transform(c.distance),
            c.is_draging = 1) : (d && (c.is_back = 1),
            c._transform(0),
            c.is_draging = 0)),
            ("pull" == c.options.type || "both" == c.options.type) && c.startY - c.moveY >= 0 && (!c.type || "pull" == c.type)) {
                if (c.distance = c.distance || 0,
                c.$dom.height() < c.parentHeight)
                    return;
                !c.is_back && d == c.$dom.height() - c.winHeight + c.winHeight - c.parent.height() && c.startY - c.moveY >= 0 ? (c.pullHeight || (c.pullHeight = c.pull.height()),
                b.preventDefault(),
                c.distance = c.startY - c.moveY,
                c.distance > c.pullHeight ? ("holding" != c.status && c.options.statusChange.call(c.pull, "holding", "pull"),
                c.status = "holding",
                c.distance -= .5 * (c.distance - c.pullHeight),
                c.is_load = 1,
                c.type = "pull") : (c.is_load = 0,
                "init" != c.status && c.options.statusChange.call(c.pull, "init", "pull"),
                c.status = "init"),
                c._transform(-c.distance),
                c.is_draging = 1) : (d > c.$dom.height() + c.$dom.parent().offset().top - c.winHeight && (c.is_back = 1),
                c._transform(0),
                c.is_draging = 0)
            }
        },
        _touchEnd: function(a) {
            var b = this;
            if (b.is_back && !a.originalEvent.touches.length && (b.is_back = 0),
            b.is_animate || b.is_draging || b._transform(0),
            !(b.is_animate || !b.is_start || b.is_back || !b.is_draging || a.originalEvent.touches.length || b.distance < 0)) {
                var c = "refresh" == b.type ? b.refreshHeight : b.pullHeight;
                b.distance = b.distance > c ? c : 0,
                "pull" == b.type && (b.distance *= -1),
                b.is_back = b.is_draging = b.is_start = b.status = 0,
                b._transform(b.distance, 500),
                b.is_animate = 1,
                b.is_load && b.options.statusChange.call(b[b.type], "success", b.type),
                b.is_end = 1
            }
        },
        _transitionEnd: function() {
            var a = this;
            a.is_end && (a.is_end = 0,
            a.is_animate = 0,
            a.distance = 0,
            a.type = "",
            a.auto = 0)
        }
    },
    recovery: function() {
        this._transform(0, 500),
        this.is_end = 1
    },
    _transform: function(a, b) {
        this.$dom.css({
            "-webkit-transition-duration": (b || 0) + "ms",
            "transition-duration": (b || 0) + "ms",
            "-webkit-transform": "translate3d(0, " + a + "px, 0)",
            transform: "translate3d(0, " + a + "px, 0)"
        })
    },
    _auto: function() {
        var a = this;
        if ("both" == a.options.type || a.options.type == a.options.autoType) {
            var b = a.parent.find(".sg_loader").height();
            a.auto = 1,
            a._transform(b, 500),
            a.options.statusChange.call(a[a.options.autoType], "success", a.options.autoType),
            a.is_animate = 1
        }
    },
    options: {
        type: "refresh",
        vm: "",
        url: "",
        method: "get",
        params: {},
        autoType: "refresh",
        auto: !1,
        statusChange: function() {},
        success: function() {},
        error: function() {}
    }
}),
sg.Component("ImageClip", {
    template: '<div class="sg_image_clip"><div class="sg_image_clip_handle"><div class="sg_image_clip_mask sg_image_clip_mask_top"></div><div class="sg_image_clip_mask sg_image_clip_mask_top_left"></div><div class="sg_image_clip_mask sg_image_clip_mask_top_right"></div><div class="sg_image_clip_mask sg_image_clip_mask_bottom"></div><div class="sg_image_clip_mask sg_image_clip_mask_bottom_left"></div><div class="sg_image_clip_mask sg_image_clip_mask_bottom_right"></div><div class="sg_image_clip_mask sg_image_clip_mask_left"></div><div class="sg_image_clip_mask sg_image_clip_mask_right"></div><canvas class="sg_image_clip_img"></div><div class="sg_image_clip_btn sg_image_clip_btn_cancel">取消</div><div class="sg_image_clip_btn sg_image_clip_btn_finish">完成</div></div>',
    properties: {
        delta_x: 0,
        delta_y: 0,
        width: 0,
        height: 0
    },
    beforeRender: function(a) {
        a(null, 1)
    },
    afterRender: function() {
        var a, b, c, d, e = this, f = e.options, g = f.url, h = e.$dom, i = h.find(".sg_image_clip_handle"), j = h.find(".sg_image_clip_img"), k = h.width(), l = h.height();
        a = /\d+%/i.test(f.width) ? k * parseInt(f.width) / 100 : f.width,
        e.width = a,
        e.delta_x = c = (k - a) / 2,
        b = "auto" == f.height ? a : f.height,
        e.height = b,
        e.delta_y = d = (l - b) / 2,
        h.loadingStart(),
        sg.utils.loadImage(g, function(f, g, m) {
            EXIF.getData(m, function() {
                h.loadingStop();
                var f, n = EXIF.getTag(m, "Orientation") || 1;
                6 != n && 8 != n || (f = g.height,
                g.height = g.width,
                g.width = f);
                var o = {};
                g.width / g.height > a / b ? (o.height = b,
                o.width = g.width / g.height * b) : (o.width = a,
                o.height = g.height / g.width * a),
                o.top = (l - o.height) / 2,
                o.left = (k - o.width) / 2,
                new MegaPixImage(m).render(j[0], {
                    orientation: n
                }),
                j.data("offset", g).css(o),
                e.hammerimage = new sg.utils.HammerImage(j[0],i[0],{
                    maxScale: 2,
                    minScale: 1,
                    boundary: {
                        x1: c,
                        x2: $(window).width() - c,
                        y1: d,
                        y2: $(window).height() - d
                    },
                    enablePanWithoutScale: !0
                })
            })
        }),
        h.find(".sg_image_clip_mask_top, .sg_image_clip_mask_bottom").css({
            height: d,
            left: c,
            right: c
        }),
        h.find(".sg_image_clip_mask_left, .sg_image_clip_mask_right").css({
            width: c,
            top: d,
            bottom: d
        }),
        h.find(".sg_image_clip_mask_top_left, .sg_image_clip_mask_top_right, .sg_image_clip_mask_bottom_left, .sg_image_clip_mask_bottom_right").css({
            width: c,
            height: d
        }),
        h.find(".sg_image_clip_btn_cancel").bind("click", function() {
            f.onCancel && f.onCancel.call(e),
            e.hide()
        }),
        h.find(".sg_image_clip_btn_finish").bind("click", function() {
            !1 === e.getImage() ? f.onError && f.onError.call(e, "ErrorImageNotSupport") : f.onSuccess && f.onSuccess.call(e, e.getImage()),
            e.hide()
        })
    },
    hide: function() {
        this._destroy()
    },
    getImage: function() {
        var a = this
          , b = a.options
          , c = a.$dom.find(".sg_image_clip_img")
          , d = a.hammerimage
          , e = c.data("offset")
          , f = d.offset()
          , g = e.width / f.width
          , h = sg.utils.createCanvas(a.width, a.height)
          , i = h.getContext("2d")
          , j = sg.utils.getFileExt(b.type)[0] || "png"
          , k = !1;
        try {
            i.drawImage(c[0], parseInt((a.delta_x - f.left) * g), parseInt((a.delta_y - f.top) * g), parseInt(a.width * g), parseInt(a.height * g), 0, 0, a.width, a.height),
            k = h.toDataURL(j, b.quality)
        } catch (a) {}
        return k
    },
    options: {
        url: "",
        width: "90%",
        height: "auto",
        onCancel: null,
        onSuccess: null,
        onError: null,
        type: "png",
        quality: 1
    }
}),
sg.Component("FileUploader", {
    properties: {
        fileUrls: {},
        fileNames: {},
        files: []
    },
    template: '<input class="sg_file_uploader" name="sg_uploader_file" type="file" tabindex="-1" {{if multiple}}multiple{{/if}} {{if title}}title="{{title}}"{{/if}} accept="{{extension}}">',
    beforeRender: function(a) {
        var b, c = this, d = c.options, e = sg.utils.getFileExt(d.extension);
        b = e.length ? e.join(",") : "*/*",
        a({
            extension: b,
            multiple: d.multiple,
            title: d.title
        }, 1)
    },
    afterRender: function() {
        var a = this
          , b = a.$dom;
        window.File && b.bind("change", a.events.changeXhr)
    },
    getUploadUrl: function(a) {
        var b = this
          , c = b.options;
        return a = a || c.url,
        $.isFunction(a) && (a = a.call(b)),
        a
    },
    clear: function() {
        var a = this;
        a.$dom.val(""),
        a.files = []
    },
    submit: function(a) {
        var b = this;
        window.File ? b.submitXhr(a) : b.submitForm(a)
    },
    submitXhr: function(a) {
        var b = this;
        a = b.getUploadUrl(a);
        for (var c = 0; c < b.files.length; c++)
            b.submitXhrSingle(a, b.files[c]);
        b.clear()
    },
    submitXhrSingle: function(a, b) {
        var c = this
          , d = c.options
          , e = c.fileNames[b.name];
        if (d.needCache && e)
            return d.onComplete && d.onComplete.call(c, b, e),
            d.onSuccess && d.onSuccess.call(c, b, e.data),
            void (d.multiple || c.clear());
        var f = new XMLHttpRequest;
        f.onreadystatechange = function() {
            if (4 == f.readyState && f.status >= 200) {
                var a = {};
                try {
                    a = JSON.parse(f.responseText)
                } catch (a) {}
                d.onComplete && d.onComplete.call(c, b, a),
                a.data && d.onSuccess ? (c.fileNames[b.name] = a,
                d.onSuccess.call(c, b, a.data)) : !a.data && d.onError && (a.message = a.message || "上传失败!",
                d.onError.call(c, a, b)),
                d.multiple || c.clear()
            } else
                4 != f.readyState || 0 != f.status && navigator.onLine || d.onError.call(c, {
                    errno: "ErrorOffLine",
                    message: d.errorMap[error]
                }, b)
        }
        ,
        f.upload && d.onProgress && (f.upload.onprogress = function(a) {
            a.lengthComputable && d.onProgress.call(c, b, a.loaded, a.total)
        }
        ),
        a = sg.utils.addUrlParam(a, {
            sg_file_name: b.name
        }),
        f.open("POST", a, !0),
        f.setRequestHeader("X-Requested-With", "XMLHttpRequest"),
        f.setRequestHeader("Cache-Control", "no-cache"),
        f.setRequestHeader("Content-Type", "application/octet-stream"),
        f.send(b)
    },
    events: {
        changeXhr: function(a) {
            function b() {
                return i.onSelect && !1 === i.onSelect.call(h, k) ? void h.clear() : void (i.autoSubmit && h.submitXhr())
            }
            var c, d, e, f, g, h = this, i = h.options, j = h.$dom, k = j[0].files, l = [], m = sg.utils.getFileExt(i.extension);
            if (k.length) {
                for (e = 0,
                f = k.length; e < f; e++) {
                    if (c = k[e],
                    "image" == i.extension && !/image\//gi.test(c.type) || "audio" == i.extension && !/audio\//gi.test(c.type) || "video" == i.extension && !/video\//gi.test(c.type)) {
                        d = "ErrorType",
                        g = c;
                        break
                    }
                    if ("image" != i.extension && "audio" != i.extension && "video" != i.extension && m.length && $.inArray(c.type, m) == -1) {
                        d = "ErrorType",
                        g = c;
                        break
                    }
                    if (i.maxSize && c.size > i.maxSize) {
                        d = "ErrorMaxSize",
                        g = c;
                        break
                    }
                    if ("image" != i.extension && "audio" != i.extension && "video" != i.extension && m.length && $.inArray(c.type, m) == -1) {
                        d = "ErrorType";
                        break
                    }
                    if (i.maxSize && c.size > i.maxSize) {
                        d = "ErrorMaxSize";
                        break
                    }
                    l.push(c)
                }
                if (j.val(""),
                d)
                    return void (i.onError && i.onError.call(h, {
                        errno: d,
                        message: i.errorMap[d]
                    }, g));
                if (h.files = k = h.files.concat(l),
                i.preview)
                    if (window.URL) {
                        for (e in h.fileUrls)
                            h.fileUrls.hasOwnProperty(e) && URL.revokeObjectURL(h.fileUrls[e]);
                        for (h.fileUrls = [],
                        e = 0,
                        f = k.length; e < f; e++) {
                            k[e].url = URL.createObjectURL(k[e]);
                            var n = {};
                            n[k[e].name] = k[e].url,
                            h.fileUrls.push(n)
                        }
                        b()
                    } else if (window.FileReader) {
                        var o = 0;
                        for (f = k.length,
                        e = 0; e < f; e++)
                            !function(a) {
                                var c = new FileReader;
                                c.onload = function() {
                                    a.url = c.result,
                                    o++,
                                    o == f && b()
                                }
                                ,
                                c.readAsDataURL(a)
                            }(k[e])
                    } else
                        i.onError && (d = "ErrorNotSupportPreview",
                        i.onError.call(h, {
                            errno: d,
                            message: i.errorMap[d]
                        }));
                else
                    b()
            }
        }
    },
    options: {
        maxSize: 0,
        extension: "*",
        multiple: !1,
        preview: !1,
        autoSubmit: !0,
        needCache: !1,
        title: "",
        url: "",
        onError: null,
        onSelect: null,
        onSuccess: null,
        onComplete: null,
        errorMap: {
            ErrorMaxSize: "上传大小超出限制!",
            ErrorType: "上传格式不合法!",
            ErrorNotSupportPreview: "不支持图片预览，请在PC端上传",
            ErrorOffLine: "网络连接已断开"
        }
    }
}),
sg.Component("Player", {
    template: '<div class="sg_player_box {{css}}" style="{{player_style}}">{{if showTitle}}<div class="sg_player_title"><span class="sg_player_current_index">{{index}}</span>/{{list.length}}</div>{{/if}}<div class="sg_player_img_list">{{each list as i}}<div class="sg_player_img_box"><img class="sg_player_img"> </div>{{/each}}</div><div class="sg_player_btn_close icon_close"></div></div>',
    beforeRender: function(a) {
        var b = this
          , c = b.options
          , d = c.list;
        d.length && a({
            showTitle: c.showTitle,
            list: d,
            index: c.index + 1,
            css: c.css,
            player_style: "width:" + c.width + "px;height:" + c.height + "px"
        }, 1)
    },
    afterRender: function() {
        var a = this
          , b = a.options
          , c = b.list
          , d = (b.css,
        a.$dom)
          , e = d.find(".sg_player_img_list")
          , f = d.find(".sg_player_img_box")
          , g = d.find(".sg_player_btn_close")
          , h = d.find(".sg_player_current_index")
          , i = $(window).width()
          , j = $(window).height();
        a.children = [],
        a.hammerCarousel = new sg.utils.HammerCarousel(e[0],Hammer.DIRECTION_HORIZONTAL,i,function(b, c) {
            h.text(c + 1),
            a.children[b] && a.children[b].reset()
        }
        ),
        f.loadingStart(),
        sg.utils.loadImage(c, function(e, g) {
            var h, k = sg.utils.resizeImage(g.width, g.height, i, j), l = d.find(".sg_player_img_box").eq(e), m = l.find(".sg_player_img");
            m.css(k).attr("src", c[e]),
            h = new sg.utils.HammerImage(m[0],l[0],{
                maxScale: 2,
                minScale: 1,
                boundary: {
                    x1: 0,
                    x2: b.width,
                    y1: 0,
                    y2: b.height
                },
                enablePanWithoutScale: !1
            }),
            a.hammerCarousel.hammer.get("pan").requireFailure(h.hammer.get("pan")),
            a.children[e] = h,
            f.eq(e).loadingStop()
        }),
        g.bind("click", function() {
            a.hide()
        }),
        a.go(b.index)
    },
    go: function(a, b) {
        this.hammerCarousel.show(a, 0, b)
    },
    show: function() {
        $(document.body).css("overflow-y", "hidden"),
        this.$dom.show()
    },
    hide: function() {
        var a = this;
        $(document.body).css("overflow-y", "auto"),
        a.children[a.hammerCarousel.currentIndex] && a.children[a.hammerCarousel.currentIndex].reset(),
        a.$dom.hide()
    },
    options: {
        index: 0,
        list: [],
        width: 400,
        height: 400,
        showTitle: !1,
        css: ""
    }
}),
sg.Component("Datetime", {
    properties: {
        _yearLimit: null,
        _monthLimit: null,
        _dayLimit: null,
        _hourLimit: null,
        _minuteLimit: null
    },
    template: '<div class="sg_datetime_wrapper"><div class="sg_datetime_mask"></div><div class="sg_datetime"><div class="sg_datetime_header"><a class="sg_datetime_btn sg_datetime_btn_cancel">{{cancel}}</a><a class="sg_datetime_btn sg_datetime_btn_confirm">{{confirm}}</a>{{if isShowNow}}<a class="sg_datetime_btn sg_datetime_btn_now">至今</a>{{/if}}</div><div class="sg_datetime_title sg_datetime_row{{rows}}">{{if year.length}}<b data-type="y">年</b>{{/if}}{{if month.length}}<b data-type="m">月</b>{{/if}}{{if day.length}}<b data-type="y">日</b>{{/if}}{{if hour.length}}<b data-type="y">时</b>{{/if}}{{if minute.length}}<b data-type="m">分</b>{{/if}}</div><div class="sg_datetime_content sg_datetime_row{{rows}}"><div class="sg_datetime_focus"></div>{{if year.length}}<div class="sg_datetime_row_wrapper" data-type="y"><div class="sg_datetime_row" style="-webkit-transform: rotateX({{20*year[0].dev}}deg);transform: rotateX({{20*year[0].dev}}deg);">{{each year as val key}}<div class="sg_datetime_cell{{val.cls}}" style="-webkit-transform: rotateX({{-20*key}}deg) translateZ(90px);transform: rotateX({{-20*key}}deg) translateZ(90px);">{{val.val}}</div>{{/each}}</div></div>{{/if}}{{if month.length}}<div class="sg_datetime_row_wrapper" data-type="m"><div class="sg_datetime_row" style="-webkit-transform: rotateX({{20*month[0].dev}}deg);transform: rotateX({{20*month[0].dev}}deg);">{{each month as val key}}<div class="sg_datetime_cell{{val.cls}}" style="-webkit-transform: rotateX({{-20*key}}deg) translateZ(90px);transform: rotateX({{-20*key}}deg) translateZ(90px);">{{val.val}}</div>{{/each}}</div></div>{{/if}}{{if day.length}}<div class="sg_datetime_row_wrapper" data-type="d"><div class="sg_datetime_row" style="-webkit-transform: rotateX({{20*day[0].dev}}deg);transform: rotateX({{20*day[0].dev}}deg);">{{each day as val key}}<div class="sg_datetime_cell{{val.cls}}" style="-webkit-transform: rotateX({{-20*key}}deg) translateZ(90px);transform: rotateX({{-20*key}}deg) translateZ(90px);">{{val.val}}</div>{{/each}}</div></div>{{/if}}{{if hour.length}}<div class="sg_datetime_row_wrapper" data-type="h"><div class="sg_datetime_row" style="-webkit-transform: rotateX({{20*hour[0].dev}}deg);transform: rotateX({{20*hour[0].dev}}deg);">{{each hour as val key}}<div class="sg_datetime_cell{{val.cls}}" style="-webkit-transform: rotateX({{-20*key}}deg) translateZ(90px);transform: rotateX({{-20*key}}deg) translateZ(90px);">{{val.val}}</div>{{/each}}</div></div>{{/if}}{{if minute.length}}<div class="sg_datetime_row_wrapper" data-type="i"><div class="sg_datetime_row" style="-webkit-transform: rotateX({{20*minute[0].dev}}deg);transform: rotateX({{20*minute[0].dev}}deg);">{{each minute as val key}}<div class="sg_datetime_cell{{val.cls}}" style="-webkit-transform: rotateX({{-20*key}}deg) translateZ(90px);transform: rotateX({{-20*key}}deg) translateZ(90px);">{{val.val}}</div>{{/each}}</div></div>{{/if}}</div></div></div>',
    render: function() {
        var a, b, c, d, e = this, f = -1, g = e.options, h = e.template, i = $(g.target), j = [], k = [], l = [], m = [], n = [], o = new Date(g.value), p = (new Date,
        0);
        o = e._setLimit();
        var q;
        if ("date" == g.type || "datetime" == g.type || "month" == g.type) {
            for (q = e._yearLimit[0]; q <= e._yearLimit[1]; q++)
                d = o.getFullYear() - q,
                c = {
                    dev: d,
                    val: q
                },
                Math.abs(d) < 4 && (c.cls = " show_val" + (d ? "" : " current_line")),
                j.push(c);
            for (q = 1; q <= 12; q++)
                d = o.getMonth() + 1 - q,
                c = {
                    dev: d,
                    val: e._addZero(q)
                },
                Math.abs(d) < 4 && (c.cls = " show_val" + (d ? "" : " current_line")),
                k.push(c);
            p += 2
        }
        if ("date" == g.type || "datetime" == g.type) {
            for (q = 1; q <= 31; q++)
                d = o.getDate() - q,
                c = {
                    dev: d,
                    val: e._addZero(q)
                },
                Math.abs(d) < 4 && (c.cls = " show_val" + (d ? "" : " current_line")),
                l.push(c);
            p += 1
        }
        if ("datetime" == g.type || "time" == g.type) {
            for (q = 0; q <= 23; q++)
                d = o.getHours() - q,
                c = {
                    dev: d,
                    val: e._addZero(q)
                },
                Math.abs(d) < 4 && (c.cls = " show_val" + (d ? "" : " current_line")),
                m.push(c);
            for (q = 0; q <= 59; q++)
                d = o.getMinutes() - q,
                c = {
                    dev: d,
                    val: e._addZero(q)
                },
                Math.abs(d) < 4 && (c.cls = " show_val" + (d ? "" : " current_line")),
                n.push(c);
            p += 2
        }
        b = $(sg.template.compile(h)({
            year: j,
            month: k,
            day: l,
            hour: m,
            minute: n,
            cancel: g.cancelText,
            rows: p,
            confirm: g.confirmText,
            isShowNow: g.isShowNow
        })),
        e.$dom = "",
        i.unbind("click").bind("click", function() {
            if (e.$dom)
                return void e.show();
            var a = $(document.body);
            sg.router && sg.router.current && sg.router.current.$dom && (a = sg.router.current.$dom),
            a.append(b),
            e.$dom = b,
            e.show()
        }),
        b.find(".sg_datetime_mask, .sg_datetime_btn_cancel").click(function() {
            e.hide(),
            "function" == typeof g.cancel && g.cancel()
        }),
        b.find(".sg_datetime_btn_now").click(function() {
            e.hide(),
            "function" == typeof g.confirm && g.confirm("至今")
        }),
        b.find(".sg_datetime_btn_confirm").click(function() {
            e.hide();
            var a = {
                y: b.find("[data-type=y] .current_line").text(),
                m: b.find("[data-type=m] .current_line").text(),
                d: b.find("[data-type=d] .current_line").text(),
                h: b.find("[data-type=h] .current_line").text(),
                i: b.find("[data-type=i] .current_line").text()
            };
            "function" == typeof g.confirm && g.confirm(a)
        }),
        b.find(".sg_datetime_row_wrapper").on("touchstart", function(b) {
            f = b.originalEvent.targetTouches[0].pageY,
            a = parseInt($(this).find(".sg_datetime_row").css({
                transition: "0ms"
            }).attr("style").replace(/.*rotateX\((.*)deg\).*/, "$1"))
        }).on("touchmove", function(b) {
            var c = b.originalEvent.targetTouches[0].pageY
              , d = a - (c - f) / 2
              , g = $(this).data("type");
            b.preventDefault(),
            e._adjust(d, g, !0) !== !1 && $(this).find(".sg_datetime_row").css(e._setTransform("rotateX(" + d + "deg)"))
        }).on("touchend", function(b) {
            var c = b.originalEvent.changedTouches[0].pageY
              , d = $(this).data("type")
              , g = 20 * ((a - (c - f) / 2) / 20).toFixed();
            g = e._adjust(g, d),
            e._adjustView(),
            $(this).find(".sg_datetime_row").css(e._setTransform("rotateX(" + g + "deg)", "300ms ease-in-out"))
        }).on("mousedown", function(b) {
            f = void 0 === b.pageY ? b.originalEvent.targetTouches[0].pageY : b.pageY,
            a = parseInt($(this).find(".sg_datetime_row").css({
                transition: "0ms"
            }).attr("style").replace(/.*rotateX\((.*)deg\).*/, "$1"))
        }).on("mousemove", function(b) {
            if (!(f < 0)) {
                var c = void 0 === b.pageY ? b.originalEvent.targetTouches[0].pageY : b.pageY
                  , d = a - (c - f) / 2
                  , g = $(this).data("type");
                b.preventDefault(),
                e._adjust(d, g, !0) !== !1 && $(this).find(".sg_datetime_row").css(e._setTransform("rotateX(" + d + "deg)"))
            }
        }).on("mouseup", function(b) {
            var c = void 0 === b.pageY ? b.originalEvent.changedTouches[0].pageY : b.pageY
              , d = $(this).data("type")
              , g = 20 * ((a - (c - f) / 2) / 20).toFixed();
            f = -1,
            e._adjustView(),
            g = e._adjust(g, d),
            $(this).find(".sg_datetime_row").css(e._setTransform("rotateX(" + g + "deg)", "300ms ease-in-out"))
        })
    },
    _setLimit: function() {
        var a = this
          , b = this.options
          , c = new Date(b.beginDate)
          , d = new Date(b.endDate)
          , e = new Date(b.value);
        return isNaN(e.getFullYear()) && (e = new Date),
        a._yearLimit = [c.getFullYear(), d.getFullYear()],
        a._monthLimit = [c.getMonth() + 1, d.getMonth() + 1],
        a._dayLimit = [c.getDate(), d.getDate()],
        a._hourLimit = [c.getHours(), d.getHours()],
        a._minuteLimit = [c.getMinutes(), d.getMinutes()],
        isNaN(c.getFullYear()) ? (a._yearLimit[0] = e.getFullYear() - 5,
        a._monthLimit[0] = 1,
        a._dayLimit[0] = 1,
        a._hourLimit[0] = 0,
        a._minuteLimit[0] = 0) : +e < +c && (e = c),
        isNaN(d.getFullYear()) || +c > +d ? (a._yearLimit[1] = a._yearLimit[0] + 10,
        a._monthLimit[1] = 12,
        a._dayLimit[1] = 31,
        a._hourLimit[1] = 23,
        a._minuteLimit[1] = 59) : +e > +d && (e = d),
        "time" == a.options.type && (a._hourLimit[1] < a._hourLimit[0] || a._hourLimit[1] == a._hourLimit[0] && a._minuteLimit[1] < a._minuteLimit[0]) && (a._hourLimit = [0, 23],
        a._minuteLimit = [0, 59],
        e = new Date),
        e
    },
    _adjust: function(a, b, c) {
        var d, e = this.$dom.find("[data-type=" + b + "] .sg_datetime_cell").not(".disable_line"), f = $(e[0]).text() - this.$dom.find("[data-type=" + b + "] .sg_datetime_cell:first").text();
        if (20 * (e.length + f - 1) < a) {
            if (c)
                return !1;
            a = 20 * (e.length + f - 1)
        }
        if (a < 20 * f) {
            if (c)
                return !1;
            a = 20 * f
        }
        return d = parseInt((a / 20).toFixed()),
        e.each(function(a, b) {
            Math.abs(a + f - d) < 4 ? ($(b).addClass("show_val"),
            d == a + f ? $(b).addClass("current_line") : $(b).removeClass("current_line")) : $(b).removeClass("show_val").removeClass("current_line")
        }),
        a
    },
    _addZero: function(a) {
        return a = a.toString(),
        a < 10 && (a = "0" + a),
        a
    },
    _adjustView: function(a) {
        var b, c, d, e, f = this, g = this.$dom, h = parseInt(g.find("[data-type=y] .current_line").text()), i = parseInt(g.find("[data-type=m] .current_line").text()), j = parseInt(g.find("[data-type=d] .current_line").text()), k = parseInt(g.find("[data-type=h] .current_line").text()), l = parseInt(g.find("[data-type=i] .current_line").text()), m = 1;
        if (c = g.find("[data-type=m] .sg_datetime_row"),
        c.length && (e = 20 * (i - 1),
        this._yearLimit[0] == h ? (m = this._monthLimit[0],
        d = this._yearLimit[1] == h ? this._monthLimit[1] : 12,
        i < this._monthLimit[0] && (i = this._monthLimit[0],
        e = 20 * (this._monthLimit[0] - 1),
        c.css(f._setTransform("rotateX(" + e + "deg)", "300ms ease-in-out")))) : this._yearLimit[1] == h ? (m = this._yearLimit[0] == h ? this._monthLimit[0] : 1,
        d = this._monthLimit[1],
        i > this._monthLimit[1] && (i = this._monthLimit[1],
        e = 20 * (this._monthLimit[1] - 1),
        c.css(f._setTransform("rotateX(" + e + "deg)", "300ms ease-in-out")))) : (m = 1,
        d = 12),
        b = c.find(".sg_datetime_cell"),
        b.each(function(a, b) {
            var c = $(b)
              , e = parseInt(c.text());
            e < m || e > d ? c.attr("class", "sg_datetime_cell disable_line") : c.removeClass("disable_line")
        }),
        this._adjust(e, "m")),
        c = g.find("[data-type=d] .sg_datetime_row"),
        c.length) {
            switch (m = 1,
            b = c.find(".sg_datetime_cell"),
            i) {
            case 2:
                d = h % 400 && !(h % 4) ? 29 : 28;
                break;
            case 4:
            case 6:
            case 9:
            case 11:
                d = 30;
                break;
            default:
                d = 31
            }
            this._yearLimit[0] == h && this._monthLimit[0] == i && m < this._dayLimit[0] && (m = this._dayLimit[0]),
            this._yearLimit[1] == h && this._monthLimit[1] == i && d > this._dayLimit[1] && (d = this._dayLimit[1]),
            b.each(function(a, b) {
                var c = $(b)
                  , e = parseInt(c.text());
                e < m || e > d ? c.attr("class", "sg_datetime_cell disable_line") : c.removeClass("disable_line")
            }),
            j > d ? (e = 20 * (d - 1),
            j = d,
            c.css(f._setTransform("rotateX(" + e + "deg)", "300ms ease-in-out"))) : j < m ? (e = 20 * (m - 1),
            j = m,
            c.css(f._setTransform("rotateX(" + e + "deg)", "300ms ease-in-out"))) : e = 20 * (j - 1),
            this._adjust(e, "d")
        }
        c = g.find("[data-type=h] .sg_datetime_row"),
        c.length && (m = 0,
        d = 23,
        b = c.find(".sg_datetime_cell"),
        m < this._hourLimit[0] && (this._yearLimit[0] == h && this._monthLimit[0] == i && this._dayLimit[0] == j ? m = this._hourLimit[0] : "time" == this.options.type && (m = this._hourLimit[0])),
        d > this._hourLimit[1] && (this._yearLimit[1] == h && this._monthLimit[1] == i && this._dayLimit[1] == j ? d = this._hourLimit[1] : "time" == this.options.type && (d = this._hourLimit[1])),
        b.each(function(a, b) {
            var c = $(b)
              , e = parseInt(c.text());
            e < m || e > d ? c.attr("class", "sg_datetime_cell disable_line") : c.removeClass("disable_line")
        }),
        k > d ? (e = 20 * d,
        k = d,
        c.css(f._setTransform("rotateX(" + e + "deg)", "300ms ease-in-out"))) : k < m ? (e = 20 * m,
        k = m,
        c.css(f._setTransform("rotateX(" + e + "deg)", "300ms ease-in-out"))) : e = 20 * k,
        this._adjust(e, "h")),
        c = g.find("[data-type=i] .sg_datetime_row"),
        c.length && (m = 0,
        d = 59,
        b = c.find(".sg_datetime_cell"),
        this._hourLimit[0] == k && m < this._minuteLimit[0] && (this._yearLimit[0] == h && this._monthLimit[0] == i && this._dayLimit[0] == j ? m = this._minuteLimit[0] : "time" == this.options.type && (m = this._minuteLimit[0])),
        this._hourLimit[1] == k && d > this._minuteLimit[1] && (this._yearLimit[1] == h && this._monthLimit[1] == i && this._dayLimit[1] == j ? d = this._minuteLimit[1] : "time" == this.options.type && (d = this._minuteLimit[1])),
        b.each(function(a, b) {
            var c = $(b)
              , e = parseInt(c.text());
            e < m || e > d ? c.attr("class", "sg_datetime_cell disable_line") : c.removeClass("disable_line")
        }),
        l > d ? (e = 20 * d,
        c.css(f._setTransform("rotateX(" + e + "deg)", "300ms ease-in-out"))) : l < m ? (e = 20 * m,
        c.css(f._setTransform("rotateX(" + e + "deg)", "300ms ease-in-out"))) : e = 20 * l,
        this._adjust(e, "i"))
    },
    show: function() {
        var a = this
          , b = a.$dom.find(".sg_datetime_mask")
          , c = a.$dom.find(".sg_datetime");
        b.fadeIn(300),
        c.slideDown(300),
        a._adjustView()
    },
    hide: function() {
        var a = this;
        if (a.$dom) {
            var b = a.$dom.find(".sg_datetime_mask")
              , c = a.$dom.find(".sg_datetime");
            b.fadeOut(300),
            c.slideUp(300)
        }
    },
    _setTransform: function(a, b) {
        return {
            "-webkit-transform": a,
            transform: a,
            "-webkit-transition": b,
            transition: b
        }
    },
    options: {
        target: "",
        type: "date",
        beginDate: "",
        endDate: "",
        value: "",
        isShowNow: !1,
        cancelText: "取消",
        confirmText: "确定",
        cancel: null,
        confirm: null
    }
}),
sg.Component("UploaderPc", {
    template: '<div class="sg_uploader" style="position:absolute;top:0;left:0;width:100%;height:100%;overflow:hidden"><ul class="sg_uploader_queue" style="display:none"></ul></div>',
    render: function(a, b) {
        var c = this
          , d = c.template
          , e = c.options;
        "static" == b.css("position") && b.css("position", "relative"),
        $.isPlainObject(d) && (d = d.html),
        b.append($(d)),
        c.element = b,
        e.title && b.attr("title", e.title),
        c.uploader = b.find(".sg_uploader"),
        c._queue = c.uploader.find(".sg_uploader_queue"),
        c._extension = function() {
            if (e.extension && "*" != e.extension) {
                var a = {};
                return $.each(e.extension.split(","), function(b, c) {
                    a[c.toLowerCase()] = 1
                }),
                a
            }
        }();
        var f, g, h, i = "click,change,validate,submit,progress,cancel,queuestart,complete,queuecomplete,success,error".split(",");
        for (f = 0,
        g = i.length; f < g; f++)
            h = i[f],
            c["__" + h] = "function" == typeof e[h] ? e[h] : function() {}
            ;
        var j = {};
        for (var k in c.UPLOADER_DRAG)
            j[k] = function(a) {
                return "function" == typeof a ? function() {
                    return a.apply(c, arguments)
                }
                : a
            }(c.UPLOADER_DRAG[k]);
        c.drag = c.UPLOADER_DRAG = j,
        c._createButton()
    },
    destroy: function() {
        var a, b, c = this;
        (a = c._clone) && ((b = a.attr("data-id")) && a.attr("id", b).removeAttr("data-id"),
        (b = a.attr("data-position")) && a.css("position", b).removeAttr("data-position"),
        a.before(c.element).remove()),
        c.uploader && c.uploader.remove()
    },
    setOption: function(a, b) {
        if ("title" == a) {
            if (this._swf)
                return;
            this.uploader.attr("title", b),
            this._file.attr("title", b)
        }
    },
    upload: function(a) {
        var b, c, d, e = this;
        if (a)
            return void e._submitItem(a);
        if (b = e._queue.children(".uploader_todo"),
        c = [],
        e._swf)
            e._swf.startUpload();
        else if (e._form) {
            if (d = function(a) {
                var b, c, f, g;
                if (b = a.shift()) {
                    if (b = $(b),
                    c = b.attr("data-index"),
                    g = b.find(".uploader_file")[0],
                    f = c,
                    name = g.value.substr(g.value.lastIndexOf("\\") + 1),
                    !1 === e.__submit(f, name))
                        return !1;
                    e._submitForm(f, name, g, function(c) {
                        e.__complete(f, name, c),
                        b.removeClass("uploader_todo"),
                        d(a)
                    })
                } else
                    e.__queuecomplete()
            }
            ,
            b.find(".uploader_file").each(function() {
                c.push(this.value.substr(this.value.lastIndexOf("\\") + 1))
            }),
            0 == e.__queuestart(c))
                return void e.clearQueue();
            d(b.toArray())
        } else {
            if (d = function(a) {
                function b(h) {
                    var i, j, k;
                    if (i = h.shift()) {
                        if (j = f + "_" + g,
                        k = i.name,
                        g++,
                        !1 === e.__submit(j, k))
                            return !1;
                        e._submitXhr(j, k, i, function(a) {
                            e.__complete(j, k, a),
                            b(h)
                        })
                    } else
                        c.removeClass("uploader_todo"),
                        d(a)
                }
                var c, f, g, h;
                (c = a.shift()) ? (c = $(c),
                f = c.attr("data-index"),
                g = 0,
                h = c.find(".uploader_file")[0],
                b(e.toArray(h._dragFiles || h.files))) : e.__queuecomplete()
            }
            ,
            b.find(".uploader_file").each(function() {
                for (var a = 0, b = this.files.length; a < b; a++)
                    c.push(this.files[a].name)
            }),
            0 == e.__queuestart(c))
                return void e.clearQueue();
            d(b.toArray())
        }
    },
    toArray: function(a) {
        var b = [].slice
          , c = {}.hasOwnProperty;
        try {
            return b.call(a)
        } catch (b) {
            var d, e = [];
            for (d in a)
                c.call(a, d) && e.push(a[d]);
            return e
        }
    },
    cancel: function(a) {
        var b = this._submits[a];
        return !!b && (b.abort(),
        !0)
    },
    clearFile: function() {
        var a = this
          , b = a._file;
        b[0]._dragFiles && delete b[0]._dragFiles,
        b.unbind("click change").val(""),
        a._file = b.clone(!0).insertAfter(b).bind("click", a.events.click).bind("change", a.events.change),
        b.remove()
    },
    clearQueue: function() {
        this._queue.children().remove()
    },
    _submitItem: function(a) {
        var b, c, d, e, f, g, h, i = this;
        if (f = a.split("_"),
        g = f[0],
        h = f[1],
        !i._swf && (d = i._queue.children(),
        e = d.eq(g),
        e.length))
            if (c = e.find(".uploader_file")[0],
            i._form) {
                if (name = c.value.substr(c.value.lastIndexOf("\\") + 1),
                !1 === i.__submit(a, name))
                    return !1;
                i._submitForm(a, name, c, function(b) {
                    i.__complete(a, name, b),
                    e.removeClass("uploader_todo")
                })
            } else if (b = c._dragFiles || c.files,
            c = b[h]) {
                if (name = c.name,
                !1 === i.__submit(a, name))
                    return !1;
                i._submitXhr(a, name, c, function(c) {
                    i.__complete(a, name, c),
                    1 == b.length && e.removeClass("uploader_todo")
                })
            }
    },
    _submits: {},
    _submitForm: function(a, b, c, d) {
        var e, f, g, h = this, i = c.parentNode, j = h.options.url;
        "LI" == i.tagName && (i = $(i),
        g = "uploader_" + (new Date).getTime(),
        e = $('<form target="' + g + '" method="post" enctype="multipart/form-data"></form>'),
        f = $('<iframe name="' + g + '"></iframe>'),
        i.append(e).append(f),
        e.append(c).attr("action", j + (~j.indexOf("?") ? "&" : "?") + "extension=" + h.options.extension),
        f[0].attachEvent("onload", function() {
            h.options.progress && h.__progress(a, b, 1, 1, 1),
            d(f[0].contentWindow.document.body.innerHTML.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&"))
        })),
        e.submit()
    },
    _submitXhr: function(a, b, c, d) {
        var e, f, g, h = this, i = h.options, j = i.url, k = new XMLHttpRequest;
        i.progress && (f = +new Date,
        g = function(c, d) {
            var e = +new Date
              , g = parseInt(c / d * 100) / 100;
            (e - f > 99 || 1 == g) && (f = e,
            h.__progress(a, b, c, d, g))
        }
        ),
        j += (~j.indexOf("?") ? "&" : "?") + "uploader_file=" + encodeURIComponent(c.name) + "&extension=" + i.extension,
        k.onabort = function() {
            h.__cancel(a, b)
        }
        ,
        k.onreadystatechange = function() {
            4 == k.readyState && k.readyState != e && k.status >= 200 && (e = k.readyState,
            delete h._submits[a],
            d(k.responseText))
        }
        ,
        k.upload && g && (k.upload.onprogress = function(a) {
            a.lengthComputable && g(a.loaded, a.total)
        }
        ),
        k.open("POST", j, i.async),
        k.setRequestHeader("X-Requested-With", "XMLHttpRequest"),
        k.setRequestHeader("Cache-Control", "no-cache"),
        k.setRequestHeader("Content-Type", "application/octet-stream"),
        k.send(c),
        h._submits[a] = k
    },
    _drop: function(a) {
        var b = this;
        b._file[0]._dragFiles = a.dataTransfer.files,
        b.events.change(a)
    },
    _index: 0,
    _createButton: function() {
        function a(a) {
            var b, c, d = [], e = {
                323: "text/h323",
                "3gp": "video/3gpp",
                aab: "application/x-authoware-bin",
                aam: "application/x-authoware-map",
                aas: "application/x-authoware-seg",
                acx: "application/internet-property-stream",
                ai: "application/postscript",
                aif: "audio/x-aiff",
                aifc: "audio/x-aiff",
                aiff: "audio/x-aiff",
                als: "audio/X-Alpha5",
                amc: "application/x-mpeg",
                ani: "application/octet-stream",
                apk: "application/vnd.android.package-archive",
                asc: "text/plain",
                asd: "application/astound",
                asf: "video/x-ms-asf",
                asn: "application/astound",
                asp: "application/x-asap",
                asr: "video/x-ms-asf",
                asx: "video/x-ms-asf",
                au: "audio/basic",
                avb: "application/octet-stream",
                avi: "video/x-msvideo",
                awb: "audio/amr-wb",
                axs: "application/olescript",
                bas: "text/plain",
                bcpio: "application/x-bcpio",
                bin: "application/octet-stream",
                bld: "application/bld",
                bld2: "application/bld2",
                bmp: "image/bmp",
                bpk: "application/octet-stream",
                bz2: "application/x-bzip2",
                c: "text/plain",
                cal: "image/x-cals",
                cat: "application/vnd.ms-pkiseccat",
                ccn: "application/x-cnc",
                cco: "application/x-cocoa",
                cdf: "application/x-cdf",
                cer: "application/x-x509-ca-cert",
                cgi: "magnus-internal/cgi",
                chat: "application/x-chat",
                class: "application/octet-stream",
                clp: "application/x-msclip",
                cmx: "image/x-cmx",
                co: "application/x-cult3d-object",
                cod: "image/cis-cod",
                conf: "text/plain",
                cpio: "application/x-cpio",
                cpp: "text/plain",
                cpt: "application/mac-compactpro",
                crd: "application/x-mscardfile",
                crl: "application/pkix-crl",
                crt: "application/x-x509-ca-cert",
                csh: "application/x-csh",
                csm: "chemical/x-csml",
                csml: "chemical/x-csml",
                css: "text/css",
                cur: "application/octet-stream",
                dcm: "x-lml/x-evm",
                dcr: "application/x-director",
                dcx: "image/x-dcx",
                der: "application/x-x509-ca-cert",
                dhtml: "text/html",
                dir: "application/x-director",
                dll: "application/x-msdownload",
                dmg: "application/octet-stream",
                dms: "application/octet-stream",
                doc: "application/msword",
                docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                dot: "application/msword",
                dvi: "application/x-dvi",
                dwf: "drawing/x-dwf",
                dwg: "application/x-autocad",
                dxf: "application/x-autocad",
                dxr: "application/x-director",
                ebk: "application/x-expandedbook",
                emb: "chemical/x-embl-dl-nucleotide",
                embl: "chemical/x-embl-dl-nucleotide",
                eps: "application/postscript",
                epub: "application/epub+zip",
                eri: "image/x-eri",
                es: "audio/echospeech",
                esl: "audio/echospeech",
                etc: "application/x-earthtime",
                etx: "text/x-setext",
                evm: "x-lml/x-evm",
                evy: "application/envoy",
                exe: "application/octet-stream",
                fh4: "image/x-freehand",
                fh5: "image/x-freehand",
                fhc: "image/x-freehand",
                fif: "application/fractals",
                flr: "x-world/x-vrml",
                flv: "flv-application/octet-stream",
                fm: "application/x-maker",
                fpx: "image/x-fpx",
                fvi: "video/isivideo",
                gau: "chemical/x-gaussian-input",
                gca: "application/x-gca-compressed",
                gdb: "x-lml/x-gdb",
                gif: "image/gif",
                gps: "application/x-gps",
                gtar: "application/x-gtar",
                gz: "application/x-gzip",
                h: "text/plain",
                hdf: "application/x-hdf",
                hdm: "text/x-hdml",
                hdml: "text/x-hdml",
                hlp: "application/winhlp",
                hqx: "application/mac-binhex40",
                hta: "application/hta",
                htc: "text/x-component",
                htm: "text/html",
                html: "text/html",
                hts: "text/html",
                htt: "text/webviewhtml",
                ice: "x-conference/x-cooltalk",
                ico: "image/x-icon",
                ief: "image/ief",
                ifm: "image/gif",
                ifs: "image/ifs",
                iii: "application/x-iphone",
                imy: "audio/melody",
                ins: "application/x-internet-signup",
                ips: "application/x-ipscript",
                ipx: "application/x-ipix",
                isp: "application/x-internet-signup",
                it: "audio/x-mod",
                itz: "audio/x-mod",
                ivr: "i-world/i-vrml",
                j2k: "image/j2k",
                jad: "text/vnd.sun.j2me.app-descriptor",
                jam: "application/x-jam",
                jar: "application/java-archive",
                java: "text/plain",
                jfif: "image/pipeg",
                jnlp: "application/x-java-jnlp-file",
                jpe: "image/jpeg",
                jpeg: "image/jpeg",
                jpg: "image/jpeg",
                jpz: "image/jpeg",
                js: "application/x-javascript",
                jwc: "application/jwc",
                kjx: "application/x-kjx",
                lak: "x-lml/x-lak",
                latex: "application/x-latex",
                lcc: "application/fastman",
                lcl: "application/x-digitalloca",
                lcr: "application/x-digitalloca",
                lgh: "application/lgh",
                lha: "application/octet-stream",
                lml: "x-lml/x-lml",
                lmlpack: "x-lml/x-lmlpack",
                log: "text/plain",
                lsf: "video/x-la-asf",
                lsx: "video/x-la-asf",
                lzh: "application/octet-stream",
                m13: "application/x-msmediaview",
                m14: "application/x-msmediaview",
                m15: "audio/x-mod",
                m3u: "audio/x-mpegurl",
                m3url: "audio/x-mpegurl",
                m4a: "audio/mp4a-latm",
                m4b: "audio/mp4a-latm",
                m4p: "audio/mp4a-latm",
                m4u: "video/vnd.mpegurl",
                m4v: "video/x-m4v",
                ma1: "audio/ma1",
                ma2: "audio/ma2",
                ma3: "audio/ma3",
                ma5: "audio/ma5",
                man: "application/x-troff-man",
                map: "magnus-internal/imagemap",
                mbd: "application/mbedlet",
                mct: "application/x-mascot",
                mdb: "application/x-msaccess",
                mdz: "audio/x-mod",
                me: "application/x-troff-me",
                mel: "text/x-vmel",
                mht: "message/rfc822",
                mhtml: "message/rfc822",
                mi: "application/x-mif",
                mid: "audio/mid",
                midi: "audio/midi",
                mif: "application/x-mif",
                mil: "image/x-cals",
                mio: "audio/x-mio",
                mmf: "application/x-skt-lbs",
                mng: "video/x-mng",
                mny: "application/x-msmoney",
                moc: "application/x-mocha",
                mocha: "application/x-mocha",
                mod: "audio/x-mod",
                mof: "application/x-yumekara",
                mol: "chemical/x-mdl-molfile",
                mop: "chemical/x-mopac-input",
                mov: "video/quicktime",
                movie: "video/x-sgi-movie",
                mp2: "video/mpeg",
                mp3: "audio/mpeg",
                mp4: "video/mp4",
                mpa: "video/mpeg",
                mpc: "application/vnd.mpohun.certificate",
                mpe: "video/mpeg",
                mpeg: "video/mpeg",
                mpg: "video/mpeg",
                mpg4: "video/mp4",
                mpga: "audio/mpeg",
                mpn: "application/vnd.mophun.application",
                mpp: "application/vnd.ms-project",
                mps: "application/x-mapserver",
                mpv2: "video/mpeg",
                mrl: "text/x-mrml",
                mrm: "application/x-mrm",
                ms: "application/x-troff-ms",
                msg: "application/vnd.ms-outlook",
                mts: "application/metastream",
                mtx: "application/metastream",
                mtz: "application/metastream",
                mvb: "application/x-msmediaview",
                mzv: "application/metastream",
                nar: "application/zip",
                nbmp: "image/nbmp",
                nc: "application/x-netcdf",
                ndb: "x-lml/x-ndb",
                ndwn: "application/ndwn",
                nif: "application/x-nif",
                nmz: "application/x-scream",
                "nokia-op-logo": "image/vnd.nok-oplogo-color",
                npx: "application/x-netfpx",
                nsnd: "audio/nsnd",
                nva: "application/x-neva1",
                nws: "message/rfc822",
                oda: "application/oda",
                ogg: "audio/ogg",
                oom: "application/x-AtlasMate-Plugin",
                p10: "application/pkcs10",
                p12: "application/x-pkcs12",
                p7b: "application/x-pkcs7-certificates",
                p7c: "application/x-pkcs7-mime",
                p7m: "application/x-pkcs7-mime",
                p7r: "application/x-pkcs7-certreqresp",
                p7s: "application/x-pkcs7-signature",
                pac: "audio/x-pac",
                pae: "audio/x-epac",
                pan: "application/x-pan",
                pbm: "image/x-portable-bitmap",
                pcx: "image/x-pcx",
                pda: "image/x-pda",
                pdb: "chemical/x-pdb",
                pdf: "application/pdf",
                pfr: "application/font-tdpfr",
                pfx: "application/x-pkcs12",
                pgm: "image/x-portable-graymap",
                pict: "image/x-pict",
                pko: "application/ynd.ms-pkipko",
                pm: "application/x-perl",
                pma: "application/x-perfmon",
                pmc: "application/x-perfmon",
                pmd: "application/x-pmd",
                pml: "application/x-perfmon",
                pmr: "application/x-perfmon",
                pmw: "application/x-perfmon",
                png: "image/png",
                pnm: "image/x-portable-anymap",
                pnz: "image/png",
                "pot,": "application/vnd.ms-powerpoint",
                ppm: "image/x-portable-pixmap",
                pps: "application/vnd.ms-powerpoint",
                ppt: "application/vnd.ms-powerpoint",
                pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                pqf: "application/x-cprplayer",
                pqi: "application/cprplayer",
                prc: "application/x-prc",
                prf: "application/pics-rules",
                prop: "text/plain",
                proxy: "application/x-ns-proxy-autoconfig",
                ps: "application/postscript",
                ptlk: "application/listenup",
                pub: "application/x-mspublisher",
                pvx: "video/x-pv-pvx",
                qcp: "audio/vnd.qcelp",
                qt: "video/quicktime",
                qti: "image/x-quicktime",
                qtif: "image/x-quicktime",
                r3t: "text/vnd.rn-realtext3d",
                ra: "audio/x-pn-realaudio",
                ram: "audio/x-pn-realaudio",
                rar: "application/octet-stream",
                ras: "image/x-cmu-raster",
                rc: "text/plain",
                rdf: "application/rdf+xml",
                rf: "image/vnd.rn-realflash",
                rgb: "image/x-rgb",
                rlf: "application/x-richlink",
                rm: "audio/x-pn-realaudio",
                rmf: "audio/x-rmf",
                rmi: "audio/mid",
                rmm: "audio/x-pn-realaudio",
                rmvb: "audio/x-pn-realaudio",
                rnx: "application/vnd.rn-realplayer",
                roff: "application/x-troff",
                rp: "image/vnd.rn-realpix",
                rpm: "audio/x-pn-realaudio-plugin",
                rt: "text/vnd.rn-realtext",
                rte: "x-lml/x-gps",
                rtf: "application/rtf",
                rtg: "application/metastream",
                rtx: "text/richtext",
                rv: "video/vnd.rn-realvideo",
                rwc: "application/x-rogerwilco",
                s3m: "audio/x-mod",
                s3z: "audio/x-mod",
                sca: "application/x-supercard",
                scd: "application/x-msschedule",
                sct: "text/scriptlet",
                sdf: "application/e-score",
                sea: "application/x-stuffit",
                setpay: "application/set-payment-initiation",
                setreg: "application/set-registration-initiation",
                sgm: "text/x-sgml",
                sgml: "text/x-sgml",
                sh: "application/x-sh",
                shar: "application/x-shar",
                shtml: "magnus-internal/parsed-html",
                shw: "application/presentations",
                si6: "image/si6",
                si7: "image/vnd.stiwap.sis",
                si9: "image/vnd.lgtwap.sis",
                sis: "application/vnd.symbian.install",
                sit: "application/x-stuffit",
                skd: "application/x-Koan",
                skm: "application/x-Koan",
                skp: "application/x-Koan",
                skt: "application/x-Koan",
                slc: "application/x-salsa",
                smd: "audio/x-smd",
                smi: "application/smil",
                smil: "application/smil",
                smp: "application/studiom",
                smz: "audio/x-smd",
                snd: "audio/basic",
                spc: "application/x-pkcs7-certificates",
                spl: "application/futuresplash",
                spr: "application/x-sprite",
                sprite: "application/x-sprite",
                sdp: "application/sdp",
                spt: "application/x-spt",
                src: "application/x-wais-source",
                sst: "application/vnd.ms-pkicertstore",
                stk: "application/hyperstudio",
                stl: "application/vnd.ms-pkistl",
                stm: "text/html",
                sv4cpio: "application/x-sv4cpio",
                sv4crc: "application/x-sv4crc",
                svf: "image/vnd",
                svg: "image/svg+xml",
                svh: "image/svh",
                svr: "x-world/x-svr",
                swf: "application/x-shockwave-flash",
                swfl: "application/x-shockwave-flash",
                t: "application/x-troff",
                tad: "application/octet-stream",
                talk: "text/x-speech",
                tar: "application/x-tar",
                taz: "application/x-tar",
                tbp: "application/x-timbuktu",
                tbt: "application/x-timbuktu",
                tcl: "application/x-tcl",
                tex: "application/x-tex",
                texi: "application/x-texinfo",
                texinfo: "application/x-texinfo",
                tgz: "application/x-compressed",
                thm: "application/vnd.eri.thm",
                tif: "image/tiff",
                tiff: "image/tiff",
                tki: "application/x-tkined",
                tkined: "application/x-tkined",
                toc: "application/toc",
                toy: "image/toy",
                tr: "application/x-troff",
                trk: "x-lml/x-gps",
                trm: "application/x-msterminal",
                tsi: "audio/tsplayer",
                tsp: "application/dsptype",
                tsv: "text/tab-separated-values",
                ttf: "application/octet-stream",
                ttz: "application/t-time",
                txt: "text/plain",
                uls: "text/iuls",
                ult: "audio/x-mod",
                ustar: "application/x-ustar",
                uu: "application/x-uuencode",
                uue: "application/x-uuencode",
                vcd: "application/x-cdlink",
                vcf: "text/x-vcard",
                vdo: "video/vdo",
                vib: "audio/vib",
                viv: "video/vivo",
                vivo: "video/vivo",
                vmd: "application/vocaltec-media-desc",
                vmf: "application/vocaltec-media-file",
                vmi: "application/x-dreamcast-vms-info",
                vms: "application/x-dreamcast-vms",
                vox: "audio/voxware",
                vqe: "audio/x-twinvq-plugin",
                vqf: "audio/x-twinvq",
                vql: "audio/x-twinvq",
                vre: "x-world/x-vream",
                vrml: "x-world/x-vrml",
                vrt: "x-world/x-vrt",
                vrw: "x-world/x-vream",
                vts: "workbook/formulaone",
                wav: "audio/x-wav",
                wax: "audio/x-ms-wax",
                wbmp: "image/vnd.wap.wbmp",
                wcm: "application/vnd.ms-works",
                wdb: "application/vnd.ms-works",
                web: "application/vnd.xara",
                wi: "image/wavelet",
                wis: "application/x-InstallShield",
                wks: "application/vnd.ms-works",
                wm: "video/x-ms-wm",
                wma: "audio/x-ms-wma",
                wmd: "application/x-ms-wmd",
                wmf: "application/x-msmetafile",
                wml: "text/vnd.wap.wml",
                wmlc: "application/vnd.wap.wmlc",
                wmls: "text/vnd.wap.wmlscript",
                wmlsc: "application/vnd.wap.wmlscriptc",
                wmlscript: "text/vnd.wap.wmlscript",
                wmv: "audio/x-ms-wmv",
                wmx: "video/x-ms-wmx",
                wmz: "application/x-ms-wmz",
                wpng: "image/x-up-wpng",
                wps: "application/vnd.ms-works",
                wpt: "x-lml/x-gps",
                wri: "application/x-mswrite",
                wrl: "x-world/x-vrml",
                wrz: "x-world/x-vrml",
                ws: "text/vnd.wap.wmlscript",
                wsc: "application/vnd.wap.wmlscriptc",
                wv: "video/wavelet",
                wvx: "video/x-ms-wvx",
                wxl: "application/x-wxl",
                "x-gzip": "application/x-gzip",
                xaf: "x-world/x-vrml",
                xar: "application/vnd.xara",
                xbm: "image/x-xbitmap",
                xdm: "application/x-xdma",
                xdma: "application/x-xdma",
                xdw: "application/vnd.fujixerox.docuworks",
                xht: "application/xhtml+xml",
                xhtm: "application/xhtml+xml",
                xhtml: "application/xhtml+xml",
                xla: "application/vnd.ms-excel",
                xlc: "application/vnd.ms-excel",
                xll: "application/x-excel",
                xlm: "application/vnd.ms-excel",
                xls: "application/vnd.ms-excel",
                xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                xlt: "application/vnd.ms-excel",
                xlw: "application/vnd.ms-excel",
                xm: "audio/x-mod",
                xml: "text/plain",
                xmz: "audio/x-mod",
                xof: "x-world/x-vrml",
                xpi: "application/x-xpinstall",
                xpm: "image/x-xpixmap",
                xsit: "text/xml",
                xsl: "text/xml",
                xul: "text/xul",
                xwd: "image/x-xwindowdump",
                xyz: "chemical/x-pdb",
                yz1: "application/x-yz1",
                z: "application/x-compress",
                zac: "application/x-zaurus-zac",
                zip: "application/zip",
                json: "application/json"
            };
            for (a = a ? a.split(",") : [],
            b = 0,
            c = a.length; b < c; b++)
                e.hasOwnProperty(a[b]) && d.push(e[a[b]]);
            if (d.length)
                return d.join(",")
        }
        var b, c = this, d = c.options, e = c.element, f = e[0].style.position;
        f && e.attr("data-position", f),
        !window.File && d.multiple && d.swf && window.SWFUpload ? (c.uploader.remove(),
        c._createButtonSwf()) : (b = $('<input class="uploader_file" name="uploader_file" type="file" tabindex="-1" style="position:absolute;top:0;right:0;bottom:0;font-size:118px;margin:0;padding:0;opacity:0;filter:alpha(opacity=0);cursor:pointer"/>'),
        b.bind("click", c.events.click).bind("change", c.events.change).attr("accept", a(d.extension)),
        d.multiple && b.attr("multiple", "multiple"),
        d.title && b.attr("title", d.title),
        "static" == c.element.css("position") && c.element.css("position", "relative"),
        c.uploader.append(b),
        c._form = !window.File,
        c._file = b,
        !c._form && (d.dragenter || d.dragleave || d.drop) && c.drag.init(c))
    },
    _createButtonSwf: function() {
        function a(a) {
            return j.hasOwnProperty(a) && (j[a] = e._index + "_",
            e._index++),
            j[a]
        }
        var b, c, d, e = this, f = e.options, g = e.element, h = g.clone();
        if (e._clone = h,
        g.attr("id") ? (d = g.attr("id"),
        h.removeAttr("id").attr("data-id", d)) : (d = "uploader" + (new Date).getTime(),
        g.attr("id", d)),
        h.css("position", "absolute"),
        g.before(h),
        b = {
            flash_url: f.swf,
            upload_url: f.url,
            file_upload_limit: 100,
            file_queue_limit: 100,
            file_types: "*.*",
            button_placeholder_id: d,
            button_text: '<a class="uploader_swf_button"></a>',
            button_text_style: ".uploader_swf_button{}",
            button_width: g.outerWidth(),
            button_height: g.outerHeight(),
            button_cursor: "cursor",
            button_window_mode: "transparent",
            file_post_name: "uploader_file",
            file_queue_error_handler: function(b, c, d) {
                var f = b.name
                  , g = a(f);
                -110 == c ? e.__error(g, f, "maxSize") : -130 == c && e.__error(g, f, "extensionError")
            },
            file_dialog_complete_handler: function(a, b) {
                a && f.autoUpload && c.startUpload()
            },
            upload_start_handler: function(b) {
                var c = b.name
                  , d = a(c);
                return !1 === e.__validate(d, c) ? (e.__error(d, c, "validateError"),
                !1) : e.__submit(d, c)
            },
            upload_success_handler: function(b, d) {
                if (b) {
                    var f = b.name
                      , g = a(f);
                    e.__complete(g, f, d),
                    c.getStats().files_queued && c.startUpload()
                }
            },
            upload_error_handler: function(b, c, d) {
                if (b) {
                    var f = b.name
                      , g = a(f);
                    e.__error(g, f, "serverError", 500)
                }
            },
            queue_complete_handler: function(a) {
                e.__queuecomplete()
            },
            debug: !1
        },
        f.maxSize > 0 && (b.file_size_limit = f.maxSize + "b"),
        f.extension && (b.file_types = f.extension.replace(/,/g, ";").replace(/(\w+)/g, "*.$1").replace(/^\*$/, "*.*")),
        f.progress) {
            var i = +new Date;
            b.upload_progress_handler = function(b, c, d) {
                var f = b.name
                  , g = a(f)
                  , h = +new Date
                  , j = parseInt(c / d * 100) / 100;
                (h - i > 99 || 1 == j) && (i = h,
                e.__progress(g, f, c, d, j))
            }
        }
        var j = {};
        e._swf = c = new SWFUpload(b),
        e.uploader = $("#" + c.movieName)
    },
    _enQueue: function() {
        var a, b, c, d = this;
        d._swf || (a = d._file,
        b = d._queue,
        a.unbind("click,change").removeAttr("style"),
        c = $('<li data-index="' + d._index + '" id="uploader_item' + d._index + '" class="uploader_item uploader_todo"></li>'),
        b.append(c),
        c.append(a),
        d._index++,
        d._createButton())
    },
    _validateFile: function() {
        function a() {
            if (m._extension && (f = e.match(/\w+$/),
            f = f ? f[0].toLowerCase() : "",
            !m._extension.hasOwnProperty(f)))
                return "extensionError"
        }
        function b() {
            if (h = a())
                return h;
            if (o > 0 || p > 0) {
                if (g = k.size,
                0 == g)
                    return "emptyError";
                if (p > g)
                    return "minSizeError";
                if (o < g)
                    return "maxSizeError"
            }
            return !1 === m.__validate(d, e) ? "validateError" : void 0
        }
        var c, d, e, f, g, h, i, j, k, l, m = this, n = m.options, o = n.maxSize, p = n.minSize;
        if (m._swf)
            return !0;
        if (c = m._file[0],
        m._form) {
            if (d = m._index + "_",
            e = c.value.substr(c.value.lastIndexOf("\\") + 1),
            h = a())
                return m.__error(d, e, h),
                !1
        } else
            for (l = c._dragFiles || c.files,
            i = 0,
            j = l.length; i < j; i++)
                if (k = l[i],
                e = k.name,
                d = m._index + "_" + i,
                h = b())
                    return m.__error(d, e, h),
                    !1;
        return !0
    },
    events: {
        click: function(a) {
            return !1 !== this.__click(a) && void (this._file[0]._dragFiles && delete this._file[0]._dragFiles)
        },
        change: function(a) {
            var b = this;
            return !1 === b.__change(a) ? void b.clearFile() : void (!0 === b._validateFile() ? (b._enQueue(),
            b.options.autoUpload && b.upload()) : b.clearFile())
        }
    },
    options: {
        url: "",
        maxSize: 0,
        minSize: 0,
        extension: "*",
        multiple: !1,
        autoUpload: !1,
        async: !0,
        swf: null,
        title: null,
        click: null,
        change: null,
        validate: null,
        submit: null,
        progress: null,
        cancel: null,
        success: null,
        error: null,
        complete: function(a, b, c) {
            try {
                /\*\/$|-->$/.test(c) && (c = c.replace(/\n|\r/g, "##\\n##").replace(/\/\*.*?\*\/$|<!--.*?-->$/, "").replace(/##\\n##/g, "\n").replace(/^\s+/, "").replace(/\s+$/, "")),
                c = $.parseJSON(c) || "",
                c.data ? this.__success(a, b, c.data) : this.__error(a, b, c.msg || "serverError", c.errno || 500)
            } catch (a) {}
        },
        queuestart: null,
        queuecomplete: null,
        dragenter: null,
        dragleave: null,
        drop: null,
        dropSelector: null
    },
    UPLOADER_DRAG: {
        init: function(a) {
            var b = this.drag;
            a && (document.ondragenter = b.enter,
            document.ondragover = b.over,
            document.ondrop = b.drop,
            document.ondragleave = b.leave,
            b.list.push(a))
        },
        enter: function(a) {
            a.preventDefault(),
            document.ondragenter = null,
            window.attachEvent && $(document).bind("mouseover", this.drag.releaseCheck),
            this.drag.trigger(a, "dragenter")
        },
        over: function(a) {
            a.preventDefault(),
            a.dataTransfer.dropEffect = "move"
        },
        leave: function(a) {
            this.drag.isLeaveDocument(a) && this.drag.release(a, "dragleave")
        },
        drop: function(a) {
            a.preventDefault(),
            this.drag.release(a, "drop")
        },
        release: function(a, b) {
            document.ondragenter = this.drag.enter,
            this.drag.trigger(a, b || "mouseleave")
        },
        releaseCheck: function(a) {
            a.dataTransfer || ($(document).unbind("mouseover", this.drag.releaseCheck),
            this.drag.release(a, "dragleave"))
        },
        isLeaveDocument: window.mozRequestAnimationFrame ? function(a) {
            return !a.relatedTarget || !document.elementFromPoint(a.clientX, a.clientY)
        }
        : window.msIndexedDB ? function(a) {
            return 0 === a.x && 0 === a.y || !document.elementFromPoint(a.clientX, a.clientY)
        }
        : /Apple/.test(navigator.vendor) ? function(a) {
            return a.x < 0 || a.y < 0
        }
        : function(a) {
            return 0 === a.x && 0 === a.y
        }
        ,
        dropTarget: window.mozRequestAnimationFrame ? function(a) {
            return document.elementFromPoint(a.clientX, a.clientY) || a.target
        }
        : function(a) {
            return a.toElement || a.target
        }
        ,
        list: [],
        trigger: function(a, b) {
            var c, d, e, f, g, h = this.drag.list, i = h.length;
            if ("drop" == b)
                for (f = this.drag.dropTarget(a),
                d = 0; d < i; d++)
                    if (c = h[d],
                    e = c.options) {
                        if (e[b] && e[b].call(c, a),
                        g = e.dropSelector ? $(e.dropSelector) : c.element,
                        g[0] == f || g.find(f).length) {
                            c._drop(a);
                            break
                        }
                    } else
                        h = h.splice(d, 1),
                        d--;
            else
                for (d = 0; d < i; d++)
                    c = h[d],
                    (e = c.options) ? e[b] && e[b].call(c, a) : (h = h.splice(d, 1),
                    d--);
            0 == h.length && (document.ondragenter = null,
            document.ondragover = null,
            document.ondragleave = null,
            document.ondrop = null)
        }
    }
}),
function(a) {
    a.fn.qrcode = function(b) {
        function c(a) {
            this.mode = h,
            this.data = a
        }
        function d(a, b) {
            this.typeNumber = a,
            this.errorCorrectLevel = b,
            this.modules = null,
            this.moduleCount = 0,
            this.dataCache = null,
            this.dataList = []
        }
        function e(a, b) {
            if (void 0 == a.length)
                throw Error(a.length + "/" + b);
            for (var c = 0; c < a.length && 0 == a[c]; )
                c++;
            this.num = Array(a.length - c + b);
            for (var d = 0; d < a.length - c; d++)
                this.num[d] = a[d + c]
        }
        function f(a, b) {
            this.totalCount = a,
            this.dataCount = b
        }
        function g() {
            this.buffer = [],
            this.length = 0
        }
        var h;
        c.prototype = {
            getLength: function() {
                return this.data.length
            },
            write: function(a) {
                for (var b = 0; b < this.data.length; b++)
                    a.put(this.data.charCodeAt(b), 8)
            }
        },
        d.prototype = {
            addData: function(a) {
                this.dataList.push(new c(a)),
                this.dataCache = null
            },
            isDark: function(a, b) {
                if (0 > a || this.moduleCount <= a || 0 > b || this.moduleCount <= b)
                    throw Error(a + "," + b);
                return this.modules[a][b]
            },
            getModuleCount: function() {
                return this.moduleCount
            },
            make: function() {
                if (1 > this.typeNumber) {
                    for (var a = 1, a = 1; 40 > a; a++) {
                        for (var b = f.getRSBlocks(a, this.errorCorrectLevel), c = new g, d = 0, e = 0; e < b.length; e++)
                            d += b[e].dataCount;
                        for (e = 0; e < this.dataList.length; e++)
                            b = this.dataList[e],
                            c.put(b.mode, 4),
                            c.put(b.getLength(), i.getLengthInBits(b.mode, a)),
                            b.write(c);
                        if (c.getLengthInBits() <= 8 * d)
                            break
                    }
                    this.typeNumber = a
                }
                this.makeImpl(!1, this.getBestMaskPattern())
            },
            makeImpl: function(a, b) {
                this.moduleCount = 4 * this.typeNumber + 17,
                this.modules = Array(this.moduleCount);
                for (var c = 0; c < this.moduleCount; c++) {
                    this.modules[c] = Array(this.moduleCount);
                    for (var e = 0; e < this.moduleCount; e++)
                        this.modules[c][e] = null
                }
                this.setupPositionProbePattern(0, 0),
                this.setupPositionProbePattern(this.moduleCount - 7, 0),
                this.setupPositionProbePattern(0, this.moduleCount - 7),
                this.setupPositionAdjustPattern(),
                this.setupTimingPattern(),
                this.setupTypeInfo(a, b),
                7 <= this.typeNumber && this.setupTypeNumber(a),
                null == this.dataCache && (this.dataCache = d.createData(this.typeNumber, this.errorCorrectLevel, this.dataList)),
                this.mapData(this.dataCache, b)
            },
            setupPositionProbePattern: function(a, b) {
                for (var c = -1; 7 >= c; c++)
                    if (!(-1 >= a + c || this.moduleCount <= a + c))
                        for (var d = -1; 7 >= d; d++)
                            -1 >= b + d || this.moduleCount <= b + d || (this.modules[a + c][b + d] = 0 <= c && 6 >= c && (0 == d || 6 == d) || 0 <= d && 6 >= d && (0 == c || 6 == c) || 2 <= c && 4 >= c && 2 <= d && 4 >= d)
            },
            getBestMaskPattern: function() {
                for (var a = 0, b = 0, c = 0; 8 > c; c++) {
                    this.makeImpl(!0, c);
                    var d = i.getLostPoint(this);
                    (0 == c || a > d) && (a = d,
                    b = c)
                }
                return b
            },
            createMovieClip: function(a, b, c) {
                for (a = a.createEmptyMovieClip(b, c),
                this.make(),
                b = 0; b < this.modules.length; b++)
                    for (var c = 1 * b, d = 0; d < this.modules[b].length; d++) {
                        var e = 1 * d;
                        this.modules[b][d] && (a.beginFill(0, 100),
                        a.moveTo(e, c),
                        a.lineTo(e + 1, c),
                        a.lineTo(e + 1, c + 1),
                        a.lineTo(e, c + 1),
                        a.endFill())
                    }
                return a
            },
            setupTimingPattern: function() {
                for (var a = 8; a < this.moduleCount - 8; a++)
                    null == this.modules[a][6] && (this.modules[a][6] = 0 == a % 2);
                for (a = 8; a < this.moduleCount - 8; a++)
                    null == this.modules[6][a] && (this.modules[6][a] = 0 == a % 2)
            },
            setupPositionAdjustPattern: function() {
                for (var a = i.getPatternPosition(this.typeNumber), b = 0; b < a.length; b++)
                    for (var c = 0; c < a.length; c++) {
                        var d = a[b]
                          , e = a[c];
                        if (null == this.modules[d][e])
                            for (var f = -2; 2 >= f; f++)
                                for (var g = -2; 2 >= g; g++)
                                    this.modules[d + f][e + g] = -2 == f || 2 == f || -2 == g || 2 == g || 0 == f && 0 == g
                    }
            },
            setupTypeNumber: function(a) {
                for (var b = i.getBCHTypeNumber(this.typeNumber), c = 0; 18 > c; c++) {
                    var d = !a && 1 == (b >> c & 1);
                    this.modules[Math.floor(c / 3)][c % 3 + this.moduleCount - 8 - 3] = d
                }
                for (c = 0; 18 > c; c++)
                    d = !a && 1 == (b >> c & 1),
                    this.modules[c % 3 + this.moduleCount - 8 - 3][Math.floor(c / 3)] = d
            },
            setupTypeInfo: function(a, b) {
                for (var c = i.getBCHTypeInfo(this.errorCorrectLevel << 3 | b), d = 0; 15 > d; d++) {
                    var e = !a && 1 == (c >> d & 1);
                    6 > d ? this.modules[d][8] = e : 8 > d ? this.modules[d + 1][8] = e : this.modules[this.moduleCount - 15 + d][8] = e
                }
                for (d = 0; 15 > d; d++)
                    e = !a && 1 == (c >> d & 1),
                    8 > d ? this.modules[8][this.moduleCount - d - 1] = e : 9 > d ? this.modules[8][15 - d - 1 + 1] = e : this.modules[8][15 - d - 1] = e;
                this.modules[this.moduleCount - 8][8] = !a
            },
            mapData: function(a, b) {
                for (var c = -1, d = this.moduleCount - 1, e = 7, f = 0, g = this.moduleCount - 1; 0 < g; g -= 2)
                    for (6 == g && g--; ; ) {
                        for (var h = 0; 2 > h; h++)
                            if (null == this.modules[d][g - h]) {
                                var j = !1;
                                f < a.length && (j = 1 == (a[f] >>> e & 1)),
                                i.getMask(b, d, g - h) && (j = !j),
                                this.modules[d][g - h] = j,
                                e--,
                                -1 == e && (f++,
                                e = 7)
                            }
                        if (d += c,
                        0 > d || this.moduleCount <= d) {
                            d -= c,
                            c = -c;
                            break
                        }
                    }
            }
        },
        d.PAD0 = 236,
        d.PAD1 = 17,
        d.createData = function(a, b, c) {
            for (var b = f.getRSBlocks(a, b), e = new g, h = 0; h < c.length; h++) {
                var j = c[h];
                e.put(j.mode, 4),
                e.put(j.getLength(), i.getLengthInBits(j.mode, a)),
                j.write(e)
            }
            for (h = a = 0; h < b.length; h++)
                a += b[h].dataCount;
            if (e.getLengthInBits() > 8 * a)
                throw Error("code length overflow. (" + e.getLengthInBits() + ">" + 8 * a + ")");
            for (e.getLengthInBits() + 4 <= 8 * a && e.put(0, 4); 0 != e.getLengthInBits() % 8; )
                e.putBit(!1);
            for (; !(e.getLengthInBits() >= 8 * a) && (e.put(d.PAD0, 8),
            !(e.getLengthInBits() >= 8 * a)); )
                e.put(d.PAD1, 8);
            return d.createBytes(e, b)
        }
        ,
        d.createBytes = function(a, b) {
            for (var c = 0, d = 0, f = 0, g = Array(b.length), h = Array(b.length), j = 0; j < b.length; j++) {
                var k = b[j].dataCount
                  , l = b[j].totalCount - k
                  , d = Math.max(d, k)
                  , f = Math.max(f, l);
                g[j] = Array(k);
                for (var m = 0; m < g[j].length; m++)
                    g[j][m] = 255 & a.buffer[m + c];
                for (c += k,
                m = i.getErrorCorrectPolynomial(l),
                k = new e(g[j],m.getLength() - 1).mod(m),
                h[j] = Array(m.getLength() - 1),
                m = 0; m < h[j].length; m++)
                    l = m + k.getLength() - h[j].length,
                    h[j][m] = 0 <= l ? k.get(l) : 0
            }
            for (m = j = 0; m < b.length; m++)
                j += b[m].totalCount;
            for (c = Array(j),
            m = k = 0; m < d; m++)
                for (j = 0; j < b.length; j++)
                    m < g[j].length && (c[k++] = g[j][m]);
            for (m = 0; m < f; m++)
                for (j = 0; j < b.length; j++)
                    m < h[j].length && (c[k++] = h[j][m]);
            return c
        }
        ,
        h = 4;
        for (var i = {
            PATTERN_POSITION_TABLE: [[], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90], [6, 28, 50, 72, 94], [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114], [6, 34, 62, 90, 118], [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126], [6, 26, 52, 78, 104, 130], [6, 30, 56, 82, 108, 134], [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142], [6, 34, 62, 90, 118, 146], [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154], [6, 28, 54, 80, 106, 132, 158], [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170]],
            G15: 1335,
            G18: 7973,
            G15_MASK: 21522,
            getBCHTypeInfo: function(a) {
                for (var b = a << 10; 0 <= i.getBCHDigit(b) - i.getBCHDigit(i.G15); )
                    b ^= i.G15 << i.getBCHDigit(b) - i.getBCHDigit(i.G15);
                return (a << 10 | b) ^ i.G15_MASK
            },
            getBCHTypeNumber: function(a) {
                for (var b = a << 12; 0 <= i.getBCHDigit(b) - i.getBCHDigit(i.G18); )
                    b ^= i.G18 << i.getBCHDigit(b) - i.getBCHDigit(i.G18);
                return a << 12 | b
            },
            getBCHDigit: function(a) {
                for (var b = 0; 0 != a; )
                    b++,
                    a >>>= 1;
                return b
            },
            getPatternPosition: function(a) {
                return i.PATTERN_POSITION_TABLE[a - 1]
            },
            getMask: function(a, b, c) {
                switch (a) {
                case 0:
                    return 0 == (b + c) % 2;
                case 1:
                    return 0 == b % 2;
                case 2:
                    return 0 == c % 3;
                case 3:
                    return 0 == (b + c) % 3;
                case 4:
                    return 0 == (Math.floor(b / 2) + Math.floor(c / 3)) % 2;
                case 5:
                    return 0 == b * c % 2 + b * c % 3;
                case 6:
                    return 0 == (b * c % 2 + b * c % 3) % 2;
                case 7:
                    return 0 == (b * c % 3 + (b + c) % 2) % 2;
                default:
                    throw Error("bad maskPattern:" + a)
                }
            },
            getErrorCorrectPolynomial: function(a) {
                for (var b = new e([1],0), c = 0; c < a; c++)
                    b = b.multiply(new e([1, j.gexp(c)],0));
                return b
            },
            getLengthInBits: function(a, b) {
                if (1 <= b && 10 > b)
                    switch (a) {
                    case 1:
                        return 10;
                    case 2:
                        return 9;
                    case h:
                        return 8;
                    case 8:
                        return 8;
                    default:
                        throw Error("mode:" + a)
                    }
                else if (27 > b)
                    switch (a) {
                    case 1:
                        return 12;
                    case 2:
                        return 11;
                    case h:
                        return 16;
                    case 8:
                        return 10;
                    default:
                        throw Error("mode:" + a)
                    }
                else {
                    if (!(41 > b))
                        throw Error("type:" + b);
                    switch (a) {
                    case 1:
                        return 14;
                    case 2:
                        return 13;
                    case h:
                        return 16;
                    case 8:
                        return 12;
                    default:
                        throw Error("mode:" + a)
                    }
                }
            },
            getLostPoint: function(a) {
                for (var b = a.getModuleCount(), c = 0, d = 0; d < b; d++)
                    for (var e = 0; e < b; e++) {
                        for (var f = 0, g = a.isDark(d, e), h = -1; 1 >= h; h++)
                            if (!(0 > d + h || b <= d + h))
                                for (var i = -1; 1 >= i; i++)
                                    0 > e + i || b <= e + i || 0 == h && 0 == i || g == a.isDark(d + h, e + i) && f++;
                        5 < f && (c += 3 + f - 5)
                    }
                for (d = 0; d < b - 1; d++)
                    for (e = 0; e < b - 1; e++)
                        f = 0,
                        a.isDark(d, e) && f++,
                        a.isDark(d + 1, e) && f++,
                        a.isDark(d, e + 1) && f++,
                        a.isDark(d + 1, e + 1) && f++,
                        (0 == f || 4 == f) && (c += 3);
                for (d = 0; d < b; d++)
                    for (e = 0; e < b - 6; e++)
                        a.isDark(d, e) && !a.isDark(d, e + 1) && a.isDark(d, e + 2) && a.isDark(d, e + 3) && a.isDark(d, e + 4) && !a.isDark(d, e + 5) && a.isDark(d, e + 6) && (c += 40);
                for (e = 0; e < b; e++)
                    for (d = 0; d < b - 6; d++)
                        a.isDark(d, e) && !a.isDark(d + 1, e) && a.isDark(d + 2, e) && a.isDark(d + 3, e) && a.isDark(d + 4, e) && !a.isDark(d + 5, e) && a.isDark(d + 6, e) && (c += 40);
                for (e = f = 0; e < b; e++)
                    for (d = 0; d < b; d++)
                        a.isDark(d, e) && f++;
                return a = Math.abs(100 * f / b / b - 50) / 5,
                c + 10 * a
            }
        }, j = {
            glog: function(a) {
                if (1 > a)
                    throw Error("glog(" + a + ")");
                return j.LOG_TABLE[a]
            },
            gexp: function(a) {
                for (; 0 > a; )
                    a += 255;
                for (; 256 <= a; )
                    a -= 255;
                return j.EXP_TABLE[a]
            },
            EXP_TABLE: Array(256),
            LOG_TABLE: Array(256)
        }, k = 0; 8 > k; k++)
            j.EXP_TABLE[k] = 1 << k;
        for (k = 8; 256 > k; k++)
            j.EXP_TABLE[k] = j.EXP_TABLE[k - 4] ^ j.EXP_TABLE[k - 5] ^ j.EXP_TABLE[k - 6] ^ j.EXP_TABLE[k - 8];
        for (k = 0; 255 > k; k++)
            j.LOG_TABLE[j.EXP_TABLE[k]] = k;
        return e.prototype = {
            get: function(a) {
                return this.num[a]
            },
            getLength: function() {
                return this.num.length
            },
            multiply: function(a) {
                for (var b = Array(this.getLength() + a.getLength() - 1), c = 0; c < this.getLength(); c++)
                    for (var d = 0; d < a.getLength(); d++)
                        b[c + d] ^= j.gexp(j.glog(this.get(c)) + j.glog(a.get(d)));
                return new e(b,0)
            },
            mod: function(a) {
                if (0 > this.getLength() - a.getLength())
                    return this;
                for (var b = j.glog(this.get(0)) - j.glog(a.get(0)), c = Array(this.getLength()), d = 0; d < this.getLength(); d++)
                    c[d] = this.get(d);
                for (d = 0; d < a.getLength(); d++)
                    c[d] ^= j.gexp(j.glog(a.get(d)) + b);
                return new e(c,0).mod(a)
            }
        },
        f.RS_BLOCK_TABLE = [[1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9], [1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16], [1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13], [1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9], [1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12], [2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15], [2, 98, 78], [4, 49, 31], [2, 32, 14, 4, 33, 15], [4, 39, 13, 1, 40, 14], [2, 121, 97], [2, 60, 38, 2, 61, 39], [4, 40, 18, 2, 41, 19], [4, 40, 14, 2, 41, 15], [2, 146, 116], [3, 58, 36, 2, 59, 37], [4, 36, 16, 4, 37, 17], [4, 36, 12, 4, 37, 13], [2, 86, 68, 2, 87, 69], [4, 69, 43, 1, 70, 44], [6, 43, 19, 2, 44, 20], [6, 43, 15, 2, 44, 16], [4, 101, 81], [1, 80, 50, 4, 81, 51], [4, 50, 22, 4, 51, 23], [3, 36, 12, 8, 37, 13], [2, 116, 92, 2, 117, 93], [6, 58, 36, 2, 59, 37], [4, 46, 20, 6, 47, 21], [7, 42, 14, 4, 43, 15], [4, 133, 107], [8, 59, 37, 1, 60, 38], [8, 44, 20, 4, 45, 21], [12, 33, 11, 4, 34, 12], [3, 145, 115, 1, 146, 116], [4, 64, 40, 5, 65, 41], [11, 36, 16, 5, 37, 17], [11, 36, 12, 5, 37, 13], [5, 109, 87, 1, 110, 88], [5, 65, 41, 5, 66, 42], [5, 54, 24, 7, 55, 25], [11, 36, 12], [5, 122, 98, 1, 123, 99], [7, 73, 45, 3, 74, 46], [15, 43, 19, 2, 44, 20], [3, 45, 15, 13, 46, 16], [1, 135, 107, 5, 136, 108], [10, 74, 46, 1, 75, 47], [1, 50, 22, 15, 51, 23], [2, 42, 14, 17, 43, 15], [5, 150, 120, 1, 151, 121], [9, 69, 43, 4, 70, 44], [17, 50, 22, 1, 51, 23], [2, 42, 14, 19, 43, 15], [3, 141, 113, 4, 142, 114], [3, 70, 44, 11, 71, 45], [17, 47, 21, 4, 48, 22], [9, 39, 13, 16, 40, 14], [3, 135, 107, 5, 136, 108], [3, 67, 41, 13, 68, 42], [15, 54, 24, 5, 55, 25], [15, 43, 15, 10, 44, 16], [4, 144, 116, 4, 145, 117], [17, 68, 42], [17, 50, 22, 6, 51, 23], [19, 46, 16, 6, 47, 17], [2, 139, 111, 7, 140, 112], [17, 74, 46], [7, 54, 24, 16, 55, 25], [34, 37, 13], [4, 151, 121, 5, 152, 122], [4, 75, 47, 14, 76, 48], [11, 54, 24, 14, 55, 25], [16, 45, 15, 14, 46, 16], [6, 147, 117, 4, 148, 118], [6, 73, 45, 14, 74, 46], [11, 54, 24, 16, 55, 25], [30, 46, 16, 2, 47, 17], [8, 132, 106, 4, 133, 107], [8, 75, 47, 13, 76, 48], [7, 54, 24, 22, 55, 25], [22, 45, 15, 13, 46, 16], [10, 142, 114, 2, 143, 115], [19, 74, 46, 4, 75, 47], [28, 50, 22, 6, 51, 23], [33, 46, 16, 4, 47, 17], [8, 152, 122, 4, 153, 123], [22, 73, 45, 3, 74, 46], [8, 53, 23, 26, 54, 24], [12, 45, 15, 28, 46, 16], [3, 147, 117, 10, 148, 118], [3, 73, 45, 23, 74, 46], [4, 54, 24, 31, 55, 25], [11, 45, 15, 31, 46, 16], [7, 146, 116, 7, 147, 117], [21, 73, 45, 7, 74, 46], [1, 53, 23, 37, 54, 24], [19, 45, 15, 26, 46, 16], [5, 145, 115, 10, 146, 116], [19, 75, 47, 10, 76, 48], [15, 54, 24, 25, 55, 25], [23, 45, 15, 25, 46, 16], [13, 145, 115, 3, 146, 116], [2, 74, 46, 29, 75, 47], [42, 54, 24, 1, 55, 25], [23, 45, 15, 28, 46, 16], [17, 145, 115], [10, 74, 46, 23, 75, 47], [10, 54, 24, 35, 55, 25], [19, 45, 15, 35, 46, 16], [17, 145, 115, 1, 146, 116], [14, 74, 46, 21, 75, 47], [29, 54, 24, 19, 55, 25], [11, 45, 15, 46, 46, 16], [13, 145, 115, 6, 146, 116], [14, 74, 46, 23, 75, 47], [44, 54, 24, 7, 55, 25], [59, 46, 16, 1, 47, 17], [12, 151, 121, 7, 152, 122], [12, 75, 47, 26, 76, 48], [39, 54, 24, 14, 55, 25], [22, 45, 15, 41, 46, 16], [6, 151, 121, 14, 152, 122], [6, 75, 47, 34, 76, 48], [46, 54, 24, 10, 55, 25], [2, 45, 15, 64, 46, 16], [17, 152, 122, 4, 153, 123], [29, 74, 46, 14, 75, 47], [49, 54, 24, 10, 55, 25], [24, 45, 15, 46, 46, 16], [4, 152, 122, 18, 153, 123], [13, 74, 46, 32, 75, 47], [48, 54, 24, 14, 55, 25], [42, 45, 15, 32, 46, 16], [20, 147, 117, 4, 148, 118], [40, 75, 47, 7, 76, 48], [43, 54, 24, 22, 55, 25], [10, 45, 15, 67, 46, 16], [19, 148, 118, 6, 149, 119], [18, 75, 47, 31, 76, 48], [34, 54, 24, 34, 55, 25], [20, 45, 15, 61, 46, 16]],
        f.getRSBlocks = function(a, b) {
            var c = f.getRsBlockTable(a, b);
            if (void 0 == c)
                throw Error("bad rs block @ typeNumber:" + a + "/errorCorrectLevel:" + b);
            for (var d = c.length / 3, e = [], g = 0; g < d; g++)
                for (var h = c[3 * g + 0], i = c[3 * g + 1], j = c[3 * g + 2], k = 0; k < h; k++)
                    e.push(new f(i,j));
            return e
        }
        ,
        f.getRsBlockTable = function(a, b) {
            switch (b) {
            case 1:
                return f.RS_BLOCK_TABLE[4 * (a - 1) + 0];
            case 0:
                return f.RS_BLOCK_TABLE[4 * (a - 1) + 1];
            case 3:
                return f.RS_BLOCK_TABLE[4 * (a - 1) + 2];
            case 2:
                return f.RS_BLOCK_TABLE[4 * (a - 1) + 3]
            }
        }
        ,
        g.prototype = {
            get: function(a) {
                return 1 == (this.buffer[Math.floor(a / 8)] >>> 7 - a % 8 & 1)
            },
            put: function(a, b) {
                for (var c = 0; c < b; c++)
                    this.putBit(1 == (a >>> b - c - 1 & 1))
            },
            getLengthInBits: function() {
                return this.length
            },
            putBit: function(a) {
                var b = Math.floor(this.length / 8);
                this.buffer.length <= b && this.buffer.push(0),
                a && (this.buffer[b] |= 128 >>> this.length % 8),
                this.length++
            }
        },
        "string" == typeof b && (b = {
            text: b
        }),
        b = a.extend({}, {
            render: "canvas",
            width: 256,
            height: 256,
            typeNumber: -1,
            correctLevel: 2,
            background: "#ffffff",
            foreground: "#000000"
        }, b),
        this.each(function() {
            var c;
            if ("canvas" == b.render) {
                c = new d(b.typeNumber,b.correctLevel),
                c.addData(b.text),
                c.make();
                var e = document.createElement("canvas");
                e.width = b.width,
                e.height = b.height;
                for (var f = e.getContext("2d"), g = b.width / c.getModuleCount(), h = b.height / c.getModuleCount(), i = 0; i < c.getModuleCount(); i++)
                    for (var j = 0; j < c.getModuleCount(); j++) {
                        f.fillStyle = c.isDark(i, j) ? b.foreground : b.background;
                        var k = Math.ceil((j + 1) * g) - Math.floor(j * g)
                          , l = Math.ceil((i + 1) * g) - Math.floor(i * g);
                        f.fillRect(Math.round(j * g), Math.round(i * h), k, l)
                    }
            } else
                for (c = new d(b.typeNumber,b.correctLevel),
                c.addData(b.text),
                c.make(),
                e = a("<table></table>").css("width", b.width + "px").css("height", b.height + "px").css("border", "0px").css("border-collapse", "collapse").css("background-color", b.background),
                f = b.width / c.getModuleCount(),
                g = b.height / c.getModuleCount(),
                h = 0; h < c.getModuleCount(); h++)
                    for (i = a("<tr></tr>").css("height", g + "px").appendTo(e),
                    j = 0; j < c.getModuleCount(); j++)
                        a("<td></td>").css("width", f + "px").css("background-color", c.isDark(h, j) ? b.foreground : b.background).appendTo(i);
            c = e,
            jQuery(c).appendTo(this)
        })
    }
}(jQuery),
function(a) {
    function b(a) {
        if (config.is_weixin)
            require([g], function(b) {
                h.getData({
                    url: l
                }, function(c) {
                    c.errno || (c = c.data,
                    b.config($.extend(c, {
                        debug: !1,
                        jsApiList: ["onMenuShareAppMessage", "onMenuShareTimeline", "onMenuShareQQ", "onMenuShareQZone"]
                    })),
                    f = b,
                    a && a())
                })
            });
        else if (config.is_camcard) {
            if (m)
                return void (a && a());
            require([j], function() {
                i.getData(function(b) {
                    b.errno || (b = b.data,
                    CCJSAPI.config(b.timestamp, b.signature),
                    a && a(),
                    m = !0)
                })
            })
        } else
            a && a()
    }
    function c(a) {
        b(function() {
            e = a,
            config.is_weixin && f ? f.ready(function() {
                a = a || $.extend({}, k);
                var b = {
                    title: a.title,
                    link: delQueryParam(a.url, "code"),
                    imgUrl: a.image,
                    desc: a.desp
                };
                f.onMenuShareAppMessage($.extend({
                    success: function() {
                        Log.trace("show_share_wechat_friends_sucess")
                    },
                    cancel: function() {
                        Log.trace("show_share_wechat_friends_fail")
                    }
                }, b)),
                f.onMenuShareTimeline($.extend({
                    success: function() {
                        Log.trace("show_share_wechat_circle_sucess")
                    },
                    cancel: function() {
                        Log.trace("show_share_wechat_circle_fail")
                    }
                }, b)),
                f.onMenuShareQQ(b),
                f.onMenuShareQZone(b)
            }) : config.is_camcard && window.CCJSAPI ? CCJSAPI.ready(function() {
                a = a || $.extend({}, k),
                $('meta[property="og:title"]').attr("content", a.title),
                $('meta[property="og:description"]').attr("content", a.desp),
                $('meta[property="og:image"]').attr("content", a.image)
            }) : config.is_zdao && window.ZDao && a && ZDao.setNavBtn({
                icon: config.share_icon
            }, function() {
                ZDao.share(a)
            })
        })
    }
    function d() {
        return e || $.extend({}, k)
    }
    var e, f, g = (navigator.userAgent,
    "//res.wx.qq.com/open/js/jweixin-1.0.0.js"), h = a.Model.get("/weixin/jsconfig"), i = a.Model.get("/camcard/jsconfig"), j = config.static_api + "js/core/CCJSAPI.js?v=1.0.0", k = {
        title: "找到APP ，找到商业资源，发现职场伙伴",
        desp: "找生意、找合作、找人脉",
        image: config.static_api + "images/logo_180_new.png",
        url: location.protocol + "//" + location.host
    }, l = location.href.replace(/#.*/gi, ""), m = !1;
    a.share = {
        update: c,
        get: d
    }
}(sg),
$.fn.loadingStart = function(a, b) {
    a = a || {},
    this.each(function(b, c) {
        var d = $(c)
          , e = d.children(".zdao_loading")
          , f = e.data("sg_loading_timer") || 0
          , g = a.delay || 500
          , h = a.text || "加载中";
        f && clearTimeout(f),
        e.length || (e = $('<div class="zdao_loading"><div class="zdao_loading_icon"></div><div class="zdao_loading_text">' + h + "</div></div>"),
        d.append(e)),
        a && $.isPlainObject(a) && e.css(a),
        e.data("sg_loading_timer", setTimeout(function() {
            e.show(),
            e.data("sg_loading_start_time", +new Date)
        }, g))
    })
}
,
$.fn.loadingStop = function() {
    this.each(function(a, b) {
        var c, d = $(b), e = d.children(".zdao_loading"), f = e.data("sg_loading_timer") || 0, g = e.data("sg_loading_start_time") || 0, h = 500;
        if (f && clearTimeout(f),
        g) {
            var i = +new Date - g;
            c = i > h ? 0 : h - i
        } else
            c = 0;
        e.data("sg_loading_start_time", 0),
        e.data("sg_loading_timer", setTimeout(function() {
            e.hide()
        }, c))
    })
}
,
sg.ready(function() {
    sg.un("loadingStart"),
    sg.un("loadingStop"),
    sg.on("loadingStart", function(a) {
        a.$dom.loadingStart({
            position: "fixed",
            top: "50%"
        }, 100)
    }),
    sg.on("loadingStop", function(a) {
        a.$dom.loadingStop()
    })
}),
sg.Component("Alert", {
    template: '{{if title}}<div class="bs_dialog_title">{{title}}</div>{{/if}}<div class="bs_dialog_alert_text">{{if html}}{{#html}}{{else}}{{text}}{{/if}}</div><div class="btns border_top flex_h flex_hc">{{if btnCancel}}<a class="btn white border_right bs_btn_cancel flex_item {{btnCancel.css}}">{{btnCancel.text}}</a>{{/if}}{{if btnConfirm}}<a class="btn bs_btn_confirm flex_item {{btnConfirm.css}}">{{btnConfirm.text}}</a>{{/if}}</div>',
    render: function() {
        var a, b, c = this, d = c.template, e = c.options, f = "";
        $.isPlainObject(d) && (a = d.css,
        d = d.html),
        e.text && (f = sg.template.compile(d)({
            title: e.title || "",
            text: e.text,
            html: e.html,
            btnCancel: e.btnCancel,
            btnConfirm: e.btnConfirm
        }),
        b = sg.Component.Dialog({
            content: f,
            closeBtn: e.closeBtn,
            persist: e.persist,
            dialogClass: "bs_dialog " + e.css,
            contentClass: "sg_animate move_y in",
            afterHide: function() {
                this._destroy()
            },
            verticalMiddle: e.verticalMiddle
        }),
        b.$dom.find(".bs_btn_cancel").bind("click", function() {
            e.btnCancel.callback ? e.btnCancel.callback.call(b) && c.hide() : c.hide()
        }),
        b.$dom.find(".bs_btn_confirm").bind("click", function() {
            e.btnConfirm.callback ? e.btnConfirm.callback.call(b) && c.hide() : c.hide()
        }),
        b.show(),
        c.dialog = b)
    },
    hide: function() {
        var a = this;
        a.dialog && (a.dialog.hide(),
        a.dialog = null,
        a.destroy())
    },
    options: {
        title: "",
        text: "test",
        html: "",
        css: "",
        closeBtn: !1,
        btnCancel: {
            text: "取消",
            css: "",
            callback: ""
        },
        btnConfirm: {
            text: "确定",
            css: "",
            callback: ""
        },
        verticalMiddle: !1,
        persist: !1
    }
}),
sg.Component("Prompt", {
    template: '\t\t<div class="prompt">\t\t\t<input type="text" value="{{defaultText}}" id="tag_text">\t\t\t<div class="error"></div>\t\t</div>',
    render: function() {
        var a = this
          , b = sg.Component.Alert({
            title: a.options.title,
            html: sg.template.compile(a.template)(a.options),
            closeBtn: !1,
            contentClass: "sg_animate move_y in",
            afterHide: function() {
                this.destroy()
            },
            btnConfirm: {
                text: a.options.btnConfirm.text || "确定",
                callback: function() {
                    return !a.options.btnConfirm.callback || !$.isFunction(a.options.btnConfirm.callback) || a.options.btnConfirm.callback.call(a, a.$alert.dialog.$dom.find("input").val())
                }
            },
            btnCancel: {
                text: a.options.btnCancel.text || "取消",
                callback: function() {
                    return !a.options.btnCancel.callback || !$.isFunction(a.options.btnCancel.callback) || a.options.btnCancel.callback.call(a)
                }
            }
        });
        a.$alert = b,
        a.$dom = a.$alert.dialog.$dom,
        a.$dom.find("#tag_text").val("").focus().val(a.options.defaultText)
    },
    showError: function(a) {
        var b = this;
        b.$dom.find(".error").html(a).show()
    },
    hide: function() {
        var a = this;
        a.$alert.hide(),
        delete a.$dom,
        a.destroy()
    },
    options: {
        title: "",
        defaultText: "",
        btnConfirm: {
            text: "",
            callback: function(a) {
                return !0
            }
        },
        btnCancel: {
            text: "",
            callback: function() {}
        }
    }
}),
sg.Component("DownloadNotice", {
    template: '\t\t<div class="download_notice">\t\t\t<div class="content">\t\t\t\t<div class="logo"></div>\t\t\t\t<p class="notice_content">1分钟安装' + config.productName + '，更多信息尽收囊中</p>\t\t\t</div>\t\t\t<div class="footer">\t\t\t\t<a class="btn btn_blue btn_download" href="/download?channel=msitepage" data-stat-key="download_from_notice">免费下载</a>\t\t\t</div>\t\t</div>\t',
    render: function() {
        Log.trace("popup_download_notice");
        var a, b = this, c = b.template, d = b.options;
        a = sg.template.compile(c)();
        var e = sg.Component.Dialog({
            content: a,
            closeBtn: !1,
            contentClass: "sg_animate move_y in",
            afterHide: function() {
                this.destroy()
            },
            persist: d.persist
        });
        e.$dom.find(".btn_download").bind("click", function() {
            location.href = "/download",
            d.persist || e.hide(),
            Log.action("close_download_notice")
        }),
        e.show()
    },
    options: {
        persist: !1
    }
}),
sg.Component("LoginBanner", {
    template: '<div class="login_banner_wrapper flex_h">\t\t<div class="zdao_logo_wrapper"></div>\t\t<div class="guide_content flex_item">{{guide_content}}</div>\t<a class="login_banner " data-stat-key="download_immediatly">\t<span class="download">立即下载</span>\t<div class="vertical_line"></div>\t<span class="zip_size">安装包仅3M</span>\t</a>\t</div>',
    beforeRender: function(a) {
        var b = this
          , c = b.options;
        a({
            guide_content: c.guide_content,
            fromtypes: c.fromtypes
        }, 1)
    },
    afterRender: function(a) {
        var b = this.$parent
          , c = sg.utils.getUrlParam("from") || a.fromtypes;
        b.find(".login_banner").bind("click", function() {
            window.location.href = "/download_detail?channel=" + c
        })
    },
    options: {
        guide_content: "",
        fromtypes: ""
    }
}),
sg.Component("RewardDialog", {
    template: '<div class="sg_reward_dialog {{css}}"><div class="reward_top"></div><div class="reward_content"><div class="reward_title">{{title}}</div><div class="reward_inner ib">{{if msg}}<div class="reward_item"><img class="reward_icon" src="{{static_api}}images/reward/mail.png"><div class="reward_text">私信额度+{{msg}}</div> </div>{{/if}}{{if phone}}<div class="reward_item"><img class="reward_icon" src="{{static_api}}images/reward/phone.png"><div class="reward_text">查看号码+{{phone}}</div></div>{{/if}}</div><div class="reward_btn">确认</div></div></div>',
    render: function() {
        var a = this
          , b = a.options;
        b.static_api = config.static_api,
        a.reward_dialog = sg.Component.Dialog({
            content: sg.template.compile(a.template)(b),
            persist: !1,
            closeBtn: !1,
            contentClass: "sg_animate move_y in sg_scroll_y"
        }),
        a.reward_dialog.show(),
        a.reward_dialog.$dom.find(".reward_btn").bind("click", function() {
            a.reward_dialog.hide(),
            a.destroy(),
            b.callback && b.callback()
        })
    },
    destroy: function() {
        this.reward_dialog.destroy(),
        this.reward_dialog = null
    },
    options: {
        title: "额度获得提升",
        msg: "",
        phone: "",
        css: "",
        callback: ""
    }
}),
sg.Component("SendSmsVcode", {
    render: function(a, b) {
        var c = this;
        b.bind("click", c.events.click)
    },
    destroy: function() {
        var a = this
          , b = a.$parent;
        b.unbind("click", a.events.click)
    },
    events: {
        click: function() {
            var a = this
              , b = a.$parent
              , c = a.options
              , d = c.getMobile()
              , e = c.getImageVcode()
              , f = c.reason;
            if (Log.action("click_btn_get_vcode"),
            f && !b.hasClass("disable")) {
                if ("" === d)
                    return void (c.onError && c.onError(-1, "手机号不能为空"));
                if (!isPhone(d))
                    return void (c.onError && c.onError(-1, "请输入正确的手机号"));
                b.addClass("disable"),
                sg.Model.get("/user/sendvcode", !1, !0).getData({
                    type: "mobile",
                    contact: d,
                    image_vcode: e,
                    reason: f
                }, function(a) {
                    if (a.errno) {
                        var d = {
                            4: "请输入图片验证码",
                            5: "验证码错误",
                            101: "服务器暂时不可用,请稍后再试",
                            102: "该手机号未注册",
                            116: "请使用合法的手机号",
                            207: "该手机号未注册",
                            202: "该手机号已注册",
                            211: "发送验证码次数过多，暂时不可用"
                        };
                        return b.removeClass("disable"),
                        void (c.onError && c.onError(a.errno, d[a.errno] || d[101]))
                    }
                    sg.Component.CountDown({
                        count: 60,
                        onStop: function() {
                            b.text("重新获取"),
                            b.removeClass("disable")
                        },
                        onChange: function(a) {
                            b.text("已发送(" + a + "s)")
                        }
                    }),
                    sg.Component.Notice({
                        text: "验证码发送成功",
                        type: 1
                    }),
                    c.onSuccess && c.onSuccess()
                }, function() {
                    b.removeClass("disable")
                })
            }
        }
    },
    options: {
        reason: "login",
        getImageVcode: function() {
            return ""
        },
        getMobile: function() {
            return ""
        },
        onSuccess: null,
        onError: null
    }
}),
sg.Component("CountDown", {
    properties: {
        curCount: 0,
        timer: 0,
        isRunning: !1
    },
    render: function() {
        var a = this
          , b = a.options;
        b.reverse ? a.curCount = 0 : a.curCount = b.count,
        a.start()
    },
    next: function() {
        var a = this
          , b = a.options;
        if (b.reverse) {
            if (a.curCount++,
            a.curCount >= b.count)
                return !1
        } else if (a.curCount--,
        a.curCount <= 0)
            return !1;
        return !0
    },
    start: function() {
        var a = this
          , b = a.options;
        return a.timer ? void sg.utils.log("timer is running") : (a.timer = setInterval(function() {
            return a.next() ? void (b.onChange && b.onChange.call(a, a.curCount)) : void a.stop()
        }, b.deltaTime),
        b.onStart && b.onStart.call(a),
        b.onChange && b.onChange.call(a, a.curCount),
        void (a.isRunning = !0))
    },
    pause: function() {
        var a = this
          , b = a.options;
        a.timer && (clearInterval(a.timer),
        a.timer = 0),
        b.onPause && b.onPause.call(a),
        a.isRunning = !1
    },
    stop: function() {
        var a = this
          , b = a.options;
        b.reverse ? a.curCount = 0 : a.curCount = b.count,
        a.timer && (clearInterval(a.timer),
        a.timer = 0),
        b.onStop && b.onStop.call(a),
        a.isRunning = !1
    },
    restart: function() {
        var a = this;
        a.stop(),
        a.start()
    },
    options: {
        count: 60,
        reverse: !1,
        deltaTime: 1e3,
        onPause: null,
        onStop: null,
        onChange: function(a) {
            sg.utils.log(a)
        },
        onStart: null
    }
}),
sg.Component("HelpTip", {
    template: '{{if html}}{{#html}}{{else}}{{text}}{{/if}}<div class="sg_help_tip_arrow"></div>',
    render: function(a, b) {
        var c, d, e = this, f = e.template, g = e.options, h = "";
        if ($.isPlainObject(f) && (c = f.css,
        f = f.html),
        g.text) {
            h = sg.template.compile(f)({
                text: g.text,
                html: g.html
            }),
            d = sg.Component.Dialog({
                content: h,
                closeBtn: !1,
                persist: !1,
                lockScroll: !1,
                dialogClass: "sg_help_tip",
                contentClass: "sg_animate move_y in"
            });
            var i = new Hammer.Manager(d.$dom[0]);
            i.add(new Hammer.Pan),
            i.on("panmove", function() {
                d.hide()
            }),
            d.resize = function() {
                var a, c, d = this, e = d.$dom, f = e.find(".sg_dialog_content_wrapper"), h = f.find(".sg_help_tip_arrow"), i = g.width || f.width(), j = b.offset(), k = j.top - document.body.scrollTop + b.outerHeight() + 10, l = {};
                g.isArrowCenter ? (c = j.left + b.outerWidth() / 2 - $(window).width() / 2 - i / 2 + "px",
                a = i / 2) : (a = j.left + b.outerWidth() / 2 - ($(window).width() - i) / 2,
                c = "-" + i / 2 + "px"),
                l = {
                    top: k,
                    "margin-left": c
                },
                g.width && (l.width = g.width),
                f.css(l),
                h.css({
                    left: a
                })
            }
            ,
            e.dialog = d
        }
    },
    hide: function() {
        this.dialog.hide()
    },
    show: function() {
        this.dialog.show()
    },
    options: {
        text: "test",
        html: "",
        width: null,
        isArrowCenter: !1
    }
}),
sg.Component("Radio", {
    template: '<ul {{if id}}id="{{id}}"{{/if}} class="radio">{{each radio_items}}<li {{if $value.id}}id="{{$value.id}}"{{/if}} {{if $value.style}}style="{{$value.style}}"{{/if}} {{if $value.extend}}{{$value.extend}}{{/if}} class="radio_item{{if $value.class}} {{$value.class}}{{/if}} {{if $index != 0}}border_top{{/if}}">{{$value.text}}<i class="icon_success_nocyc radio_icon {{if choose != $index}}hide{{/if}}"></i> </li>{{/each}}</ul>',
    beforeRender: function(a) {
        return a(this.options)
    },
    afterRender: function() {
        var a = this
          , b = -1
          , c = a.$parent
          , d = c.find("#" + a.options.id)
          , e = d.find(".radio_icon");
        d.on("click", ".radio_item", {}, function(c) {
            var d = $(this).prevAll(".radio_item").length;
            b != d && (b = d,
            e.removeClass("hide"),
            e.addClass("hide"),
            e.eq(d).removeClass("hide"),
            a.value = d,
            $.isFunction(a.options.onchange) && a.options.onchange(c))
        })
    },
    options: {
        radio_items: [],
        id: "",
        choose: -1,
        onchange: function(a) {}
    },
    value: -1
}),
sg.Component("GuideOpenApp", {
    options: {
        fixBottom: !1,
        onBtnClick: !1
    },
    template: '<div class="guide_open_app flex_h flex_vc{{if fixBottom}} guide_open_app_fix_bottom border_top{{else}} border_bottom{{/if}}"><div class="guide_open_app_logo"></div><div class="guide_open_app_text flex_item">找到-让世界找到你</div><a class="guide_open_app_btn">打开</a></div>',
    beforeRender: function(a) {
        if (!config.is_zdao) {
            var b = this
              , c = b.options;
            a({
                fixBottom: c.fixBottom
            }, -1)
        }
    },
    afterRender: function() {
        var a = this
          , b = a.options
          , c = a.$parent
          , d = c.find(".guide_open_app_btn");
        d.on("click", function() {
            b.onBtnClick ? b.onBtnClick.call(a) : location.href = config.bs_url + "/app/download?url=" + encodeURIComponent(location.href)
        })
    }
}),
sg.Component("HistoryInfoDisclaimer", {
    properties: {
        cookie_hid_closed: "hid_closed"
    },
    template: '{{if !has_closed}}<div class="history_info_disclaimer">「找到」作为企业信息查询平台，致力于企业公开数据的收集、整理和保存，不对信息的真实性、有效性负责。信息查询过程中可能收取相应的企业数据保存服务费用。如有疑问请<a class="link hid_btn_contact_us">联系我们</a><a class="hid_btn_close icon_close"></a></div>{{/if}}',
    beforeRender: function(a) {
        var b = this
          , c = sg.utils.cookie(b.cookie_hid_closed)
          , d = sg.router.getParam("history") || /history_business_info/.test(sg.router.getPathName());
        d ? /历史/.test(document.title) || sg.utils.setTitle("历史" + document.title) : c = !0,
        a({
            has_closed: c
        }, -1)
    },
    afterRender: function(a) {
        var b = this
          , c = b.$dom
          , d = a.has_closed;
        if (!d) {
            var e = c.find(".hid_btn_close")
              , f = c.find(".hid_btn_contact_us");
            e.on("click", function() {
                sg.utils.cookie(b.cookie_hid_closed, 1),
                c.remove()
            }),
            f.on("click", function() {
                sg.Model.get("/info/getNameById", !1, !0).getData({
                    cid: sg.router.getParam("company_id") || sg.router.getParam("id")
                }, function(a) {
                    return a.errno ? void sg.Component.Notice({
                        text: a.message
                    }) : (a = a.data,
                    void ZDao.jump({
                        url: "zdao://zd/bugreport?company=" + encodeURIComponent(a.name) + "&module=" + encodeURIComponent(document.title) + "&last_page_id=" + Log.getCurrentPageId()
                    }))
                })
            })
        }
    }
}),
sg.Component("VipLimitTip", {
    options: {
        access_count: 0,
        total_limit: 0,
        access: 0
    },
    template: '{{if is_history && !is_vip}}  <div class="vip_limit_tip">  {{if total_limit == access_count && access != 1}}  <div class="vip_limit_tip_dialog">    <div class="mask"></div>    <div class="inner sg_animate move_y in">      <div class="inner_icon"></div>      <div class="normal_text">今日此模块免费查看额度已用完</div>      <div class="notice_text">普通用户最多查看{{total_limit}}次<br/>开通VIP可无限浏览</div>      <div class="btn btn_vip" sg-redirect="/qi/buy_product?type=vip">开通vip</div>    </div>  </div>  {{else}}  <div class="top_notice flex_h">   <div class="top_text flex_item">今日已免费查看<span class="number">{{access_count}}</span>次，剩余{{total_limit - access_count}}次</div> <div class="top_text" sg-redirect="/qi/buy_product?type=vip"><span class="become_vip">开通VIP可无限浏览</span><i class="icon_chevron_right"></i></div>   </div>  {{/if}}  </div>  {{/if}}',
    beforeRender: function(a) {
        var b = this;
        getProfileInfo(function(c) {
            a({
                is_history: sg.router.getParam("history") || /history_business_info/.test(sg.router.getPathName()),
                is_vip: c.vip_flag,
                access_count: b.options.access_count,
                total_limit: b.options.total_limit,
                access: b.options.access
            }, -1)
        })
    }
}),
function() {
    function a(a) {
        window.performance && performance.timing && setTimeout(function() {
            var b = performance.timing
              , c = {
                readyStart: b.fetchStart - b.navigationStart,
                redirectTime: b.redirectEnd - b.redirectStart,
                unloadEventTime: b.unloadEventEnd - b.unloadEventStart,
                lookupDomainTime: b.domainLookupEnd - b.domainLookupStart,
                connectTime: b.connectEnd - b.connectStart,
                requestTime: b.responseEnd - b.requestStart,
                initDomTreeTime: b.domInteractive - b.responseEnd,
                domReadyTime: b.domComplete - b.domInteractive,
                loadTime: b.loadEventEnd - b.navigationStart
            };
            l(a || "performance_timing", c)
        }, 0)
    }
    function b(a) {
        var b;
        if (a) {
            var c = document.createElement("a");
            if (c.href = a,
            c.host != location.host)
                return a;
            b = c.pathname
        } else
            b = location.pathname;
        return b.substr(1).replace("/", "_")
    }
    function c(a) {
        if (!A) {
            p = a.app_id || "",
            q = a.app_version || "",
            s = a.user_id || "",
            w = a.client_id || "",
            x = a.product_name || "",
            o = a.from || e("from") || "",
            y = a.env || "DEV",
            r = a.lc || "zh-cn",
            v = a.get_page_id || b,
            n = "online" == y || "pre" == y ? "https://logio.intsig.net/logapi/cc.gif" : "https://logio-sandbox.intsig.net/logapi/cc.gif",
            $(document).bind("click", function(a) {
                var b = $(a.target).closest("[data-stat-key]")
                  , c = b.attr("data-stat-key")
                  , d = b.attr("data-stat-data");
                if (c) {
                    var e = d ? JSON.parse(d) : null;
                    e ? k("click_" + c, e) : k("click_" + c)
                }
            });
            var c = "beforeunload";
            /iphone|ipad|ios/i.test(navigator.userAgent) && (window.onpagehide || null === window.onpagehide) && (c = "pagehide"),
            $(window).bind(c, function() {
                var a = +new Date;
                l("residence_time", {
                    time: a - z
                })
            }),
            A = !0,
            a.auto_page && j()
        }
    }
    function d(a, b) {
        for (var c in b)
            b.hasOwnProperty(c) && (a[c] = b[c]);
        return a
    }
    function e(a) {
        var b, c, d, e, f, g, h = "", i = location.href;
        if (i = i.replace(/#.+$/, ""),
        b = i.indexOf("?"),
        b > -1 ? i = i.substring(b, i.length) : "",
        "?" == i.substr(0, 1) && i.length > 1)
            for (e = i.substring(1, i.length),
            f = e.split("&"),
            c = 0,
            d = f.length; c < d; c++)
                if (g = f[c].split("="),
                g[0] == a && 2 == g.length) {
                    h = decodeURIComponent(g[1]);
                    break
                }
        return h
    }
    function f(a) {
        var b = !0
          , c = "";
        for (var d in a)
            a.hasOwnProperty(d) && (b ? (c += "?",
            b = !1) : c += "&",
            c += encodeURIComponent(d) + "=" + encodeURIComponent(a[d]));
        return c
    }
    function g() {
        return {
            appid: p,
            ui: s,
            pn: x,
            pv: q,
            ci: w,
            rf: o,
            lc: r,
            ul: location.href,
            sr: window.outerWidth + "*" + window.outerHeight,
            vp: window.innerWidth + "*" + window.innerHeight,
            t: +new Date
        }
    }
    function h(a) {
        window.console && window.console.log && window.console.log(a)
    }
    function i(a) {
        if (n && x && a && "object" == typeof a) {
            var b = n + f(d(g(), a));
            if (navigator.sendBeacon && !/ios|iphone|ipad/i.test(navigator.userAgent))
                try {
                    navigator.sendBeacon(b) || ((new Image).src = b)
                } catch (a) {
                    (new Image).src = b
                }
            else
                (new Image).src = b
        }
    }
    function j(a, b) {
        if (u = t) {
            var c = +new Date;
            l("residence_time", {
                time: c - z
            }),
            z = c
        }
        t = a || v() || "/",
        b = $.extend({
            last_page_id: u || e("last_page_id") || document.referrer && v && v(document.referrer)
        }, b);
        var d = e("channel");
        d && (b.channel = d),
        i({
            d: b ? JSON.stringify(b) : "",
            pi: t
        })
    }
    function k(a, b, c) {
        return a ? t || c ? (b = $.extend({
            last_page_id: u || e("last_page_id") || document.referrer && v(document.referrer)
        }, b),
        void i({
            d: b ? JSON.stringify(b) : "",
            pi: c || t,
            ai: a
        })) : void h("page_id not set") : void h("action_id not set")
    }
    function l(a, b) {
        return a ? t ? void i({
            d: b ? JSON.stringify(b) : "",
            pi: t,
            ti: a
        }) : void h("page_id not set") : void h("trace_id not set")
    }
    function m() {
        return t
    }
    var n, o, p = "", q = "", r = "", s = "", t = "", u = "", v = "", w = "", x = "", y = "DEV", z = +new Date, A = !1, B = document.getElementById("page_config");
    if (B)
        try {
            B = JSON.parse(B.textContent);
            var C = B.LOG_CONFIG;
            C && c(C)
        } catch (a) {}
    window.Log = {
        page: j,
        action: k,
        trace: l,
        tracePerformance: a,
        config: c,
        getCurrentPageId: m
    }
}(),
function() {
    function a(a) {
        if (!$.isArray(a))
            return {};
        for (var c = {}, d = 0, e = a.length; d < e; d++)
            c[id] = b(a[d]);
        return c
    }
    function b(a) {
        a = parseInt(a.substr(1), 10) || a;
        var b = "";
        return b = a % 100 == 99 ? f[parseInt(a / 100)] + "-其他" : f[a] || ""
    }
    function c(a) {
        return a ? a.replace(/B(0)*/, "") : ""
    }
    function d(a) {
        var b = {};
        if (a && a.length) {
            var c = a.length;
            for (var d in f)
                f.hasOwnProperty(d) && d.length === c + 2 && a === d.substr(0, c) && (b[d] = f[d]);
            return b
        }
        for (var e in f)
            if (f.hasOwnProperty(e)) {
                if (!(e.length < 3))
                    break;
                b[e] = f[e]
            }
        return b
    }
    function e() {
        var a = {};
        for (var b in f) {
            var c = b.length;
            c < 3 && (a[b] = {}),
            c >= 3 && c < 5 && (a[b.substr(0, c - 2)][b] = f[b],
            a[b] = {}),
            c >= 5 && c < 7 && (a[b.substr(0, c - 2)][b] = f[b])
        }
        return a
    }
    var f = {
        1: "金融业",
        2: "IT|通信|互联网",
        3: "机械机电|自动化",
        4: "专业服务",
        5: "冶金冶炼|五金|采掘",
        6: "化工行业",
        7: "纺织服装|皮革鞋帽",
        8: "电子电器|仪器仪表",
        9: "快消品|办公用品",
        10: "房产|建筑|城建|环保",
        11: "制药|医疗",
        12: "生活服务|娱乐休闲",
        13: "交通工具|运输物流",
        14: "批发|零售|贸易",
        15: "广告|媒体",
        16: "教育|科研|培训",
        17: "造纸|印刷",
        18: "包装|工艺礼品|奢侈品",
        19: "能源|资源",
        20: "农|林|牧|渔",
        21: "政府|非赢利机构|其他",
        101: "基金/证券/期货/投资",
        102: "银行",
        103: "保险",
        104: "信托/担保/拍卖/典当",
        105: "金融租赁",
        199: "其他",
        201: "互联网/电子商务",
        202: "计算机服务(系统/数据/维护)",
        203: "计算机软件",
        204: "计算机硬件",
        205: "网络游戏",
        206: "通信/电信/网络设备",
        207: "通信/电信运营、增值服务",
        208: "电子技术/半导体/集成电路",
        299: "其他",
        301: "机床及附件",
        302: "行业机械设备",
        303: "专用机械设备",
        304: "动力电力机电设备",
        305: "工业自动化",
        399: "其他",
        401: "会展及活动服务",
        402: "财务/审计/税务",
        403: "管理咨询",
        404: "人力资源",
        405: "法律服务",
        406: "技术服务",
        407: "检测认证",
        408: "租赁服务",
        409: "中介服务",
        410: "外包服务",
        411: "翻译服务",
        499: "其他",
        501: "冶金冶炼业",
        502: "五金工具",
        503: "不锈钢/铝合金/金属制品",
        504: "采掘业",
        599: "其他",
        601: "石油化工",
        602: "化工原料及产品",
        603: "涂料/油墨/颜料/染料",
        604: "橡胶塑料及制品",
        605: "玻璃/陶瓷",
        699: "其他",
        701: "纺织及成品",
        702: "印染、染整",
        703: "服装",
        704: "皮革、羊毛、羽绒制品",
        705: "鞋帽",
        799: "其他",
        801: "电气设备",
        802: "电子器件",
        803: "电工器材",
        804: "照明工业",
        805: "数码家电",
        806: "仪器仪表",
        899: "其他",
        901: "快速消费品",
        902: "办公用品及设备",
        999: "其他",
        1001: "房地产",
        1002: "建筑工程",
        1003: "建材装修",
        1004: "城市建设",
        1005: "环境保护",
        1099: "其他",
        1101: "制药/生物工程",
        1102: "医疗/护理/卫生",
        1103: "医疗设备/器械",
        1199: "其他",
        1201: "餐饮业",
        1202: "酒店/旅游",
        1203: "美容/保健",
        1204: "娱乐/休闲/体育",
        1299: "其他",
        1301: "汽车及零配件",
        1302: "船舶及零配件",
        1303: "航空铁路及轨道交通",
        1304: "摩托及非机动车",
        1305: "交通运输",
        1306: "城市公共交通",
        1307: "物流（邮政）、仓储",
        1399: "其他",
        1401: "批发",
        1402: "零售",
        1403: "贸易/进出口",
        1499: "其他",
        1501: "广告",
        1502: "公关/市场营销",
        1503: "广播/电视媒体",
        1504: "网络新媒体",
        1505: "影视艺术/文化传播",
        1506: "文字媒体/出版",
        1599: "其他",
        1601: "教育/院校",
        1602: "学术/科研",
        1603: "培训",
        1699: "其他",
        1701: "造纸/纸张/纸品",
        1702: "印刷/制版",
        1799: "其他",
        1801: "包装",
        1802: "钟表眼镜",
        1803: "工艺品",
        1804: "礼品",
        1805: "奢侈品、收藏品",
        1899: "其他",
        1901: "常规能源（煤、石油、天然气等）",
        1902: "新能源（风能、太阳能、地热能等）",
        1903: "电力、热力、水利",
        1904: "电池（生产）蓄电池",
        1999: "其他",
        2001: "农产品种植、采集",
        2002: "林木产品种植、采集",
        2003: "水产品养殖、捕捞",
        2004: "农林牧渔相关服务业(农产品加工、兽医、灌溉等)",
        2005: "牲畜、家禽饲养",
        2099: "其他",
        2101: "政府/公共事业",
        2102: "非盈利机构",
        2199: "其他",
        30101: "车床",
        30102: "钻床",
        30103: "铣床",
        30104: "其他机床",
        30105: "机床刀具",
        30106: "机床附件",
        30201: "汽摩检测设备",
        30202: "地矿勘测设备",
        30203: "化工实验设备",
        30204: "矿山施工设备",
        30205: "矿业输送、装卸设备",
        30206: "橡胶机械",
        30207: "酒店设备",
        30208: "金融专用设备",
        30209: "商超设备",
        30210: "商业专用设备",
        30211: "工控系统及装备",
        30212: "电子产品制造设备",
        30213: "冶炼设备",
        30214: "选矿设备",
        30215: "风机、排风设备",
        30216: "玩具加工设备",
        30217: "家电制造设备",
        30218: "工艺礼品加工设备",
        30219: "陶瓷生产加工机械",
        30220: "木工机械",
        30221: "服装机械设备",
        30222: "制鞋机械",
        30223: "皮革加工设备",
        30224: "纺织设备和器材",
        30225: "环保设备",
        30226: "餐饮行业设备",
        30227: "食品、饮料加工设备",
        30228: "农业机械",
        30229: "石油设备",
        30230: "塑料机械",
        30301: "铆接设备",
        30302: "制冷、换热设备",
        30303: "反应、分离设备",
        30304: "粉碎、干燥、混合、输送设备",
        30305: "铸造及热处理设备",
        30306: "金属成型设备",
        30307: "电焊、切割设备",
        30308: "压缩、过滤设备",
        30309: "液压机械及部件",
        30310: "整熨洗涤设备",
        30311: "涂装设备",
        30312: "脱硫除尘设备",
        30313: "清洗、清理设备",
        30314: "印刷设备",
        30401: "锅炉及锅炉辅机",
        30402: "燃烧设备",
        30403: "节能设备",
        30404: "泵及真空设备",
        30405: "通风设备",
        30406: "内燃机",
        30407: "发电、电机电力设备",
        30408: "热力热电热工",
        30501: "自动化控制设备",
        30502: "自动门",
        30503: "科技设备及仪器",
        30504: "条形码技术与设备",
        30505: "实验室设备",
        30506: "其他工业自动化设备",
        50101: "钢铁加工",
        50102: "钢铁销售",
        50103: "钢管、型钢、焊管",
        50104: "黑色金属材料冶炼、压延",
        50105: "有色金属材料冶炼、压延",
        50106: "粉末冶金",
        50107: "合金材料加工",
        50108: "铸造、铸件",
        50109: "锻造、锻件",
        50110: "工业窑炉及炉料",
        50201: "五金交电",
        50202: "橡胶五金",
        50203: "日用五金",
        50204: "建筑五金",
        50205: "厨卫/家具五金",
        50206: "锁具/工具/模具/磨料",
        50207: "通用零部件",
        50301: "不锈钢材料加工销售",
        50302: "不锈钢制品及器皿",
        50303: "铝合金材加工",
        50304: "金属制品、金属材料",
        50305: "金属作业工具",
        50306: "保险箱",
        50307: "金属结构件",
        50308: "金属丝（绳）、金属网",
        50309: "钣金加工",
        50310: "电镀、喷涂、热处理",
        50401: "天然气开采",
        50402: "煤炭开采",
        50403: "矿产开采",
        60101: "石油溶剂",
        60102: "润滑剂",
        60103: "石蜡",
        60104: "石油沥青",
        60105: "石油焦",
        60106: "其他石油化工产品",
        60201: "化工原料、防腐材料",
        60202: "复合材料、合成化工",
        60203: "化工轻工",
        60204: "精细化工",
        60205: "综合化工",
        60206: "化学气体",
        60207: "化学试剂、催化剂、助剂、干燥剂",
        60208: "胶、粘合剂及制品",
        60209: "香料香精",
        60210: "过滤、净水剂、活性炭",
        60301: "涂料、油漆",
        60302: "油墨",
        60303: "颜料化工",
        60304: "染料化工",
        60401: "橡胶制品及轮胎",
        60402: "工业皮带",
        60403: "胶木",
        60404: "橡塑制品",
        60405: "塑料",
        60406: "塑料制品",
        60407: "塑胶及制品",
        60408: "有机玻璃及制品",
        60409: "聚氨酯及制品",
        60410: "树脂",
        60411: "海绵及制品",
        60412: "塑料薄膜",
        60501: "玻璃生产及制品",
        60502: "搪瓷、陶瓷制品",
        70101: "棉纺织",
        70102: "毛麻纺织",
        70103: "灯芯绒、丝绸（娟）纺织",
        70104: "混纺",
        70105: "针织",
        70106: "化纤织造",
        70107: "工业用布",
        70108: "纺织原料",
        70109: "商标加工",
        70110: "纺织成品",
        70111: "针织成品",
        70301: "服装服饰生产、销售",
        70302: "服装服饰辅料",
        70303: "内衣",
        70304: "制衣",
        70305: "西装领带",
        70306: "羊毛衫",
        70401: "皮革制品、皮件、皮革服装",
        70402: "合成革",
        70403: "箱包、拉链、手袋",
        70501: "鞋帽",
        70502: "制鞋用品",
        80101: "稳压电源",
        80102: "高低压电气",
        80103: "电热器具及材料",
        80104: "电器元（器）件",
        80105: "汽车电器",
        80106: "变压器、电感器",
        80107: "电源、开关、整流器",
        80108: "电器配件、机箱",
        80109: "电炉、烘箱",
        80110: "电视监控报警系统",
        80111: "报警设备、器材",
        80201: "电子元件及组件",
        80202: "半导体器件",
        80203: "连接器",
        80204: "线路板",
        80205: "继电器",
        80206: "电容器",
        80207: "电子设备制造、修理",
        80208: "集成电路",
        80209: "防静电、防雷、防暴、弱电工程及设备",
        80301: "电线电缆、光缆",
        80302: "漆包线、电缆桥梁",
        80303: "磁性材料及旗舰",
        80304: "绝缘制品及材料",
        80401: "白炽灯",
        80402: "气体放电灯",
        80403: "冷光源",
        80404: "灯具配附件",
        80405: "电光源材料",
        80406: "插头、插座、绝缘材料",
        80407: "室外照明灯具",
        80408: "室内照明灯具",
        80409: "专门用途灯具",
        80410: "车灯、指示灯具",
        80411: "手电筒",
        80412: "照明灯具设计",
        80501: "手机通讯",
        80502: "电脑",
        80503: "数码产品",
        80504: "大家电",
        80505: "小家电",
        80601: "探测仪器",
        80602: "光学光电产品",
        80603: "超声波",
        80604: "玻璃仪器",
        80605: "其他仪表仪器",
        90101: "日化用品",
        90102: "食品、副食品、粮油",
        90103: "烟酒、饮料",
        90104: "其他快消品",
        90201: "办公文具",
        90202: "办公设备及耗材",
        90203: "办公家具",
        100101: "房地产开发经营",
        100102: "房地产销售与中介",
        100103: "物业管理/商业中心",
        100201: "建筑设计",
        100202: "建筑施工",
        100203: "房屋工程建筑",
        100204: "土木工程建筑（桥、路）",
        100301: "环境设计",
        100302: "装饰、装潢",
        100303: "建筑材料业",
        100401: "市政建设",
        100402: "市容市政环境卫生",
        100403: "城市景观造型设计制作",
        100404: "景观绿化、园林园艺",
        100501: "环境检测与治理",
        100502: "环境工程及设备",
        100503: "净化工程及设备",
        100504: "废物处理",
        130101: "汽车制造",
        130102: "汽车销售",
        130103: "汽车零配件",
        130104: "汽车修理、美容",
        130105: "二手车交易",
        130201: "船舶制造",
        130202: "船舶修理",
        130203: "船舶配件销售",
        130301: "铁路机车制造及配件",
        130302: "轨道交通设备制造",
        130303: "航天、航空设备及器材",
        130401: "摩托车及配件",
        130402: "摩托车销售维修 ",
        130403: "电动车及配件",
        130404: "自行车",
        130405: "三轮车及配件",
        130406: "童车",
        130501: "道路运输",
        130502: "航空运输",
        130503: "铁路运输",
        130504: "水上运输",
        130505: "管道运输",
        130601: "城市交通管理",
        130602: "公共交通",
        130603: "轮渡",
        130604: "客运出租车",
        130605: "拖车服务",
        130701: "物流",
        130702: "国际货运（代理）",
        130703: "报关业",
        130704: "联运、储运",
        130705: "装卸搬运",
        130706: "仓储",
        130707: "集装箱制造及运输",
        140101: "农畜产品批发",
        140102: "食品、饮料及烟草制品批发",
        140103: "纺织、服装及日用品批发",
        140104: "文化、体育用品及器材批发",
        140105: "医药及医疗器械批发",
        140106: "矿产品、建材及化工产品批发",
        140107: "机械设备、五金交电及电子产品批发",
        140108: "其他批发",
        140201: "综合零售",
        140202: "食品、饮料及烟草制品专门零售",
        140203: "纺织、服装及日用品专门零售",
        140204: "文化、体育用品及器材专门零售",
        140205: "医药及医疗器材专门零售",
        140206: "汽车、摩托车、燃料及零配件专卖零售",
        140207: "家用电器及电子产品专门零售",
        140208: "五金、家具及室内装修材料专门零售",
        140209: "无店铺及其他零售",
        140301: "国内贸易",
        140302: "国际贸易",
        180101: "包装原料",
        180102: "包装成品",
        180103: "包装辅料"
    };
    window.getIndustry = b,
    window.getMultiIndustry = a,
    window.getIdWithoutB = c,
    window.getIndustryClass = d,
    window.getClassifiedIndustry = e,
    window.industry_list = f
}();
var city_list = [{
    name: "热门城市",
    code: "",
    area_code: "",
    city: [{
        name: "北京",
        area_code: "BJ"
    }, {
        name: "上海",
        area_code: "SH"
    }, {
        name: "广州",
        area_code: "4401"
    }, {
        name: "深圳",
        area_code: "4403"
    }, {
        name: "天津",
        area_code: "TJ"
    }, {
        name: "重庆",
        area_code: "CQ"
    }, {
        name: "杭州",
        area_code: "3301"
    }, {
        name: "成都",
        area_code: "5101"
    }, {
        name: "南京",
        area_code: "3201"
    }, {
        name: "苏州",
        area_code: "3205"
    }, {
        name: "大连",
        area_code: "2102"
    }, {
        name: "武汉",
        area_code: "4201"
    }, {
        name: "台湾",
        area_code: "TW"
    }, {
        name: "香港",
        area_code: "HK"
    }, {
        name: "澳门",
        area_code: "MO"
    }]
}, {
    name: "安徽",
    code: "AH",
    area_code: "34",
    city: [{
        name: "合肥",
        area_code: "3401"
    }, {
        name: "芜湖",
        area_code: "3402"
    }, {
        name: "淮南",
        area_code: "3404"
    }, {
        name: "安庆",
        area_code: "3408"
    }, {
        name: "宿州",
        area_code: "3413"
    }, {
        name: "阜阳",
        area_code: "3412"
    }, {
        name: "亳州",
        area_code: "3416"
    }, {
        name: "黄山",
        area_code: "3410"
    }, {
        name: "滁州",
        area_code: "3411"
    }, {
        name: "淮北",
        area_code: "3406"
    }, {
        name: "铜陵",
        area_code: "3407"
    }, {
        name: "宣城",
        area_code: "3418"
    }, {
        name: "六安",
        area_code: "3415"
    }, {
        name: "巢湖",
        area_code: "3414"
    }, {
        name: "池州",
        area_code: "3417"
    }, {
        name: "蚌埠",
        area_code: "3403"
    }, {
        name: "马鞍山",
        area_code: "3405"
    }]
}, {
    name: "北京",
    code: "BJ",
    area_code: "11",
    city: [{
        name: "北京"
    }]
}, {
    name: "重庆",
    code: "CQ",
    area_code: "50",
    city: [{
        name: "重庆"
    }]
}, {
    name: "福建",
    code: "FJ",
    area_code: "35",
    city: [{
        name: "福州",
        area_code: "3501"
    }, {
        name: "泉州",
        area_code: "3505"
    }, {
        name: "漳州",
        area_code: "3506"
    }, {
        name: "龙岩",
        area_code: "3508"
    }, {
        name: "南平",
        area_code: "3507"
    }, {
        name: "厦门",
        area_code: "3502"
    }, {
        name: "宁德",
        area_code: "3509"
    }, {
        name: "莆田",
        area_code: "3503"
    }, {
        name: "三明",
        area_code: "3504"
    }]
}, {
    name: "广东",
    code: "GD",
    area_code: "44",
    city: [{
        name: "深圳",
        area_code: "4403"
    }, {
        name: "广州",
        area_code: "4401"
    }, {
        name: "惠州",
        area_code: "4413"
    }, {
        name: "梅州",
        area_code: "4414"
    }, {
        name: "汕头",
        area_code: "4405"
    }, {
        name: "珠海",
        area_code: "4404"
    }, {
        name: "佛山",
        area_code: "4406"
    }, {
        name: "肇庆",
        area_code: "4412"
    }, {
        name: "湛江",
        area_code: "4408"
    }, {
        name: "江门",
        area_code: "4407"
    }, {
        name: "河源",
        area_code: "4416"
    }, {
        name: "清远",
        area_code: "4418"
    }, {
        name: "云浮",
        area_code: "4453"
    }, {
        name: "东莞",
        area_code: "4419"
    }, {
        name: "中山",
        area_code: "4420"
    }, {
        name: "阳江",
        area_code: "4417"
    }, {
        name: "揭阳",
        area_code: "4452"
    }, {
        name: "茂名",
        area_code: "4409"
    }, {
        name: "汕尾",
        area_code: "4415"
    }, {
        name: "韶关",
        area_code: "4402"
    }, {
        name: "潮州",
        area_code: "4451"
    }]
}, {
    name: "广西",
    code: "GX",
    area_code: "45",
    city: [{
        name: "南宁",
        area_code: "4501"
    }, {
        name: "柳州",
        area_code: "4502"
    }, {
        name: "来宾",
        area_code: "4513"
    }, {
        name: "桂林",
        area_code: "4503"
    }, {
        name: "梧州",
        area_code: "4504"
    }, {
        name: "防城港",
        area_code: "4506"
    }, {
        name: "贵港",
        area_code: "4508"
    }, {
        name: "玉林",
        area_code: "4509"
    }, {
        name: "百色",
        area_code: "4510"
    }, {
        name: "钦州",
        area_code: "4507"
    }, {
        name: "河池",
        area_code: "4512"
    }, {
        name: "北海",
        area_code: "4505"
    }, {
        name: "崇左",
        area_code: "4514"
    }, {
        name: "贺州",
        area_code: "4511"
    }]
}, {
    name: "甘肃",
    code: "GS",
    area_code: "62",
    city: [{
        name: "兰州",
        area_code: "6201"
    }, {
        name: "平凉",
        area_code: "6208"
    }, {
        name: "庆阳",
        area_code: "6210"
    }, {
        name: "武威",
        area_code: "6206"
    }, {
        name: "金昌",
        area_code: "6203"
    }, {
        name: "酒泉",
        area_code: "6209"
    }, {
        name: "天水",
        area_code: "6205"
    }, {
        name: "陇南",
        area_code: "6212"
    }, {
        name: "临夏",
        area_code: "6229"
    }, {
        name: "合作",
        area_code: "6230"
    }, {
        name: "白银",
        area_code: "6204"
    }, {
        name: "定西",
        area_code: "6211"
    }, {
        name: "张掖",
        area_code: "6207"
    }, {
        name: "嘉峪关",
        area_code: "6202"
    }]
}, {
    name: "贵州",
    code: "GZ",
    area_code: "52",
    city: [{
        name: "贵阳",
        area_code: "5201"
    }, {
        name: "安顺",
        area_code: "5204"
    }, {
        name: "都匀",
        area_code: "5227"
    }, {
        name: "兴义",
        area_code: "5223"
    }, {
        name: "铜仁",
        area_code: "5206"
    }, {
        name: "毕节",
        area_code: "5205"
    }, {
        name: "六盘水",
        area_code: "5202"
    }, {
        name: "遵义",
        area_code: "5203"
    }, {
        name: "凯里",
        area_code: "5226"
    }]
}, {
    name: "河北",
    code: "HB",
    area_code: "13",
    city: [{
        name: "石家庄",
        area_code: "1301"
    }, {
        name: "张家口",
        area_code: "1307"
    }, {
        name: "秦皇岛",
        area_code: "1303"
    }, {
        name: "承德",
        area_code: "1308"
    }, {
        name: "唐山",
        area_code: "1302"
    }, {
        name: "沧州",
        area_code: "1309"
    }, {
        name: "衡水",
        area_code: "1311"
    }, {
        name: "邢台",
        area_code: "1305"
    }, {
        name: "邯郸",
        area_code: "1304"
    }, {
        name: "保定",
        area_code: "1306"
    }, {
        name: "廊坊",
        area_code: "1310"
    }]
}, {
    name: "河南",
    code: "HN",
    area_code: "41",
    city: [{
        name: "郑州",
        area_code: "4101"
    }, {
        name: "新乡",
        area_code: "4107"
    }, {
        name: "许昌",
        area_code: "4110"
    }, {
        name: "信阳",
        area_code: "4115"
    }, {
        name: "南阳",
        area_code: "4113"
    }, {
        name: "开封",
        area_code: "4102"
    }, {
        name: "洛阳",
        area_code: "4103"
    }, {
        name: "商丘",
        area_code: "4114"
    }, {
        name: "焦作",
        area_code: "4108"
    }, {
        name: "鹤壁",
        area_code: "4106"
    }, {
        name: "濮阳",
        area_code: "4109"
    }, {
        name: "周口",
        area_code: "4116"
    }, {
        name: "漯河",
        area_code: "4111"
    }, {
        name: "济源",
        area_code: "4190"
    }, {
        name: "安阳",
        area_code: "4105"
    }, {
        name: "平顶山",
        area_code: "4104"
    }, {
        name: "驻马店",
        area_code: "4117"
    }, {
        name: "三门峡",
        area_code: "4112"
    }]
}, {
    name: "湖北",
    code: "HUBEI",
    area_code: "42",
    city: [{
        name: "武汉",
        area_code: "4201"
    }, {
        name: "荆州",
        area_code: "4210"
    }, {
        name: "黄冈",
        area_code: "4211"
    }, {
        name: "宜昌",
        area_code: "4205"
    }, {
        name: "恩施",
        area_code: "4228"
    }, {
        name: "十堰",
        area_code: "4203"
    }, {
        name: "神农架",
        area_code: "429021"
    }, {
        name: "随州",
        area_code: "4213"
    }, {
        name: "荆门",
        area_code: "4208"
    }, {
        name: "天门",
        area_code: "429006"
    }, {
        name: "仙桃",
        area_code: "429004"
    }, {
        name: "潜江",
        area_code: "429005"
    }, {
        name: "襄阳",
        area_code: "4206"
    }, {
        name: "鄂州",
        area_code: "4207"
    }, {
        name: "孝感",
        area_code: "4209"
    }, {
        name: "黄石",
        area_code: "4202"
    }, {
        name: "咸宁",
        area_code: "4212"
    }]
}, {
    name: "湖南",
    code: "HUNAN",
    area_code: "43",
    city: [{
        name: "长沙",
        area_code: "4301"
    }, {
        name: "株洲",
        area_code: "4302"
    }, {
        name: "衡阳",
        area_code: "4304"
    }, {
        name: "郴州",
        area_code: "4310"
    }, {
        name: "常德",
        area_code: "4307"
    }, {
        name: "益阳",
        area_code: "4309"
    }, {
        name: "娄底",
        area_code: "4313"
    }, {
        name: "邵阳",
        area_code: "4305"
    }, {
        name: "岳阳",
        area_code: "4306"
    }, {
        name: "张家界",
        area_code: "4308"
    }, {
        name: "怀化",
        area_code: "4312"
    }, {
        name: "永州",
        area_code: "4311"
    }, {
        name: "吉首",
        area_code: "4331"
    }, {
        name: "湘潭",
        area_code: "4303"
    }]
}, {
    name: "黑龙江",
    code: "HLJ",
    area_code: "23",
    city: [{
        name: "哈尔滨",
        area_code: "2301"
    }, {
        name: "牡丹江",
        area_code: "2310"
    }, {
        name: "佳木斯",
        area_code: "2308"
    }, {
        name: "绥化",
        area_code: "2312"
    }, {
        name: "黑河",
        area_code: "2311"
    }, {
        name: "双鸭山",
        area_code: "2305"
    }, {
        name: "伊春",
        area_code: "2307"
    }, {
        name: "大庆",
        area_code: "2306"
    }, {
        name: "七台河",
        area_code: "2309"
    }, {
        name: "鸡西",
        area_code: "2303"
    }, {
        name: "鹤岗",
        area_code: "2304"
    }, {
        name: "齐齐哈尔",
        area_code: "2302"
    }, {
        name: "大兴安岭",
        area_code: "2327"
    }]
}, {
    name: "海南",
    code: "HAINAN",
    area_code: "46",
    city: [{
        name: "海口",
        area_code: "4601"
    }, {
        name: "三亚",
        area_code: "4602"
    }, {
        name: "东方",
        area_code: "469007"
    }, {
        name: "临高",
        area_code: "469024"
    }, {
        name: "澄迈",
        area_code: "469023"
    }, {
        name: "儋州",
        area_code: "469003"
    }, {
        name: "昌江",
        area_code: "469026"
    }, {
        name: "白沙",
        area_code: "469025"
    }, {
        name: "琼中",
        area_code: "469030"
    }, {
        name: "定安",
        area_code: "469021"
    }, {
        name: "屯昌",
        area_code: "469022"
    }, {
        name: "琼海",
        area_code: "469002"
    }, {
        name: "文昌",
        area_code: "469005"
    }, {
        name: "保亭",
        area_code: "469029"
    }, {
        name: "万宁",
        area_code: "469006"
    }, {
        name: "陵水",
        area_code: "469028"
    }, {
        name: "乐东",
        area_code: "469027"
    }, {
        name: "五指山",
        area_code: "469001"
    }]
}, {
    name: "江苏",
    code: "JS",
    area_code: "32",
    city: [{
        name: "苏州",
        area_code: "3205"
    }, {
        name: "无锡",
        area_code: "3202"
    }, {
        name: "南京",
        area_code: "3201"
    }, {
        name: "镇江",
        area_code: "3211"
    }, {
        name: "南通",
        area_code: "3206"
    }, {
        name: "扬州",
        area_code: "3210"
    }, {
        name: "宿迁",
        area_code: "3213"
    }, {
        name: "徐州",
        area_code: "3203"
    }, {
        name: "淮安",
        area_code: "3208"
    }, {
        name: "连云港",
        area_code: "3207"
    }, {
        name: "常州",
        area_code: "3204"
    }, {
        name: "泰州",
        area_code: "3212"
    }, {
        name: "盐城",
        area_code: "3209"
    }]
}, {
    name: "江西",
    code: "JX",
    area_code: "36",
    city: [{
        name: "南昌",
        area_code: "3601"
    }, {
        name: "上饶",
        area_code: "3611"
    }, {
        name: "抚州",
        area_code: "3610"
    }, {
        name: "宜春",
        area_code: "3609"
    }, {
        name: "鹰潭",
        area_code: "3606"
    }, {
        name: "赣州",
        area_code: "3607"
    }, {
        name: "景德镇",
        area_code: "3602"
    }, {
        name: "萍乡",
        area_code: "3603"
    }, {
        name: "新余",
        area_code: "3605"
    }, {
        name: "九江",
        area_code: "3604"
    }, {
        name: "吉安",
        area_code: "3608"
    }]
}, {
    name: "吉林",
    code: "JL",
    area_code: "22",
    city: [{
        name: "长春",
        area_code: "2201"
    }, {
        name: "延吉",
        area_code: "2224"
    }, {
        name: "四平",
        area_code: "2203"
    }, {
        name: "白山",
        area_code: "2206"
    }, {
        name: "白城",
        area_code: "2208"
    }, {
        name: "辽源",
        area_code: "2204"
    }, {
        name: "松原",
        area_code: "2207"
    }, {
        name: "吉林",
        area_code: "2202"
    }, {
        name: "通化",
        area_code: "2205"
    }]
}, {
    name: "辽宁",
    code: "LN",
    area_code: "21",
    city: [{
        name: "沈阳",
        area_code: "2101"
    }, {
        name: "鞍山",
        area_code: "2103"
    }, {
        name: "抚顺",
        area_code: "2104"
    }, {
        name: "本溪",
        area_code: "2105"
    }, {
        name: "丹东",
        area_code: "2106"
    }, {
        name: "葫芦岛",
        area_code: "2114"
    }, {
        name: "营口",
        area_code: "2108"
    }, {
        name: "阜新",
        area_code: "2109"
    }, {
        name: "辽阳",
        area_code: "2110"
    }, {
        name: "铁岭",
        area_code: "2112"
    }, {
        name: "朝阳",
        area_code: "2113"
    }, {
        name: "盘锦",
        area_code: "2111"
    }, {
        name: "大连",
        area_code: "2102"
    }, {
        name: "锦州",
        area_code: "2107"
    }]
}, {
    name: "内蒙古",
    code: "NMG",
    area_code: "15",
    city: [{
        name: "呼和浩特",
        area_code: "1501"
    }, {
        name: "乌海",
        area_code: "1503"
    }, {
        name: "集宁",
        area_code: "1509"
    }, {
        name: "通辽",
        area_code: "1505"
    }, {
        name: "阿拉善左旗",
        area_code: "1529"
    }, {
        name: "鄂尔多斯",
        area_code: "15060"
    }, {
        name: "临河",
        area_code: "1508"
    }, {
        name: "锡林浩特",
        area_code: "1525"
    }, {
        name: "呼伦贝尔",
        area_code: "1507"
    }, {
        name: "乌兰浩特",
        area_code: "1522"
    }, {
        name: "包头",
        area_code: "1502"
    }, {
        name: "赤峰",
        area_code: "1504"
    }]
}, {
    name: "宁夏",
    code: "NX",
    area_code: "64",
    city: [{
        name: "银川",
        area_code: "6401"
    }, {
        name: "中卫",
        area_code: "6405"
    }, {
        name: "固原",
        area_code: "6404"
    }, {
        name: "石嘴山",
        area_code: "6402"
    }, {
        name: "吴忠",
        area_code: "6403"
    }]
}, {
    name: "青海",
    code: "QH",
    area_code: "63",
    city: [{
        name: "西宁",
        area_code: "6301"
    }, {
        name: "黄南",
        area_code: "6323"
    }, {
        name: "海北",
        area_code: "6322"
    }, {
        name: "果洛",
        area_code: "6326"
    }, {
        name: "玉树",
        area_code: "6327"
    }, {
        name: "海西",
        area_code: "6328"
    }, {
        name: "海东",
        area_code: "6302"
    }, {
        name: "海南",
        area_code: "6325"
    }]
}, {
    name: "上海",
    code: "SH",
    area_code: "31",
    city: [{
        name: "上海"
    }]
}, {
    name: "山东",
    code: "SD",
    area_code: "37",
    city: [{
        name: "济南",
        area_code: "3701"
    }, {
        name: "潍坊",
        area_code: "3707"
    }, {
        name: "临沂",
        area_code: "3713"
    }, {
        name: "菏泽",
        area_code: "3717"
    }, {
        name: "滨州",
        area_code: "3716"
    }, {
        name: "东营",
        area_code: "3705"
    }, {
        name: "威海",
        area_code: "3710"
    }, {
        name: "枣庄",
        area_code: "3704"
    }, {
        name: "日照",
        area_code: "3711"
    }, {
        name: "莱芜",
        area_code: "3712"
    }, {
        name: "聊城",
        area_code: "3715"
    }, {
        name: "青岛",
        area_code: "3702"
    }, {
        name: "淄博",
        area_code: "3703"
    }, {
        name: "德州",
        area_code: "3714"
    }, {
        name: "烟台",
        area_code: "3706"
    }, {
        name: "济宁",
        area_code: "3708"
    }, {
        name: "泰安",
        area_code: "3709"
    }]
}, {
    name: "山西",
    code: "SX",
    area_code: "14",
    city: [{
        name: "太原",
        area_code: "1401"
    }, {
        name: "临汾",
        area_code: "1410"
    }, {
        name: "运城",
        area_code: "1408"
    }, {
        name: "朔州",
        area_code: "1406"
    }, {
        name: "忻州",
        area_code: "1409"
    }, {
        name: "长治",
        area_code: "1404"
    }, {
        name: "大同",
        area_code: "1402"
    }, {
        name: "阳泉",
        area_code: "1403"
    }, {
        name: "晋中",
        area_code: "1407"
    }, {
        name: "晋城",
        area_code: "1405"
    }, {
        name: "吕梁",
        area_code: "1411"
    }]
}, {
    name: "陕西",
    code: "SHANXI",
    area_code: "61",
    city: [{
        name: "西安",
        area_code: "6101"
    }, {
        name: "延安",
        area_code: "6106"
    }, {
        name: "榆林",
        area_code: "6108"
    }, {
        name: "铜川",
        area_code: "6102"
    }, {
        name: "商洛",
        area_code: "6110"
    }, {
        name: "安康",
        area_code: "6109"
    }, {
        name: "汉中",
        area_code: "6107"
    }, {
        name: "宝鸡",
        area_code: "6103"
    }, {
        name: "咸阳",
        area_code: "6104"
    }, {
        name: "渭南",
        area_code: "6105"
    }]
}, {
    name: "四川",
    code: "SC",
    area_code: "51",
    city: [{
        name: "成都",
        area_code: "5101"
    }, {
        name: "自贡",
        area_code: "5103"
    }, {
        name: "绵阳",
        area_code: "5107"
    }, {
        name: "南充",
        area_code: "5113"
    }, {
        name: "达州",
        area_code: "5117"
    }, {
        name: "遂宁",
        area_code: "5109"
    }, {
        name: "广安",
        area_code: "5116"
    }, {
        name: "巴中",
        area_code: "5119"
    }, {
        name: "泸州",
        area_code: "5105"
    }, {
        name: "宜宾",
        area_code: "5115"
    }, {
        name: "内江",
        area_code: "5110"
    }, {
        name: "资阳",
        area_code: "5120"
    }, {
        name: "乐山",
        area_code: "5111"
    }, {
        name: "眉山",
        area_code: "5114"
    }, {
        name: "凉山",
        area_code: "5134"
    }, {
        name: "雅安",
        area_code: "5118"
    }, {
        name: "甘孜",
        area_code: "5133"
    }, {
        name: "阿坝",
        area_code: "5132"
    }, {
        name: "德阳",
        area_code: "5106"
    }, {
        name: "广元",
        area_code: "5108"
    }, {
        name: "攀枝花",
        area_code: "5104"
    }]
}, {
    name: "天津",
    code: "TJ",
    area_code: "12",
    city: [{
        name: "天津"
    }]
}, {
    name: "新疆",
    code: "XJ",
    area_code: "65",
    city: [{
        name: "乌鲁木齐",
        area_code: "6501"
    }, {
        name: "石河子",
        area_code: "659001"
    }, {
        name: "图木舒克",
        area_code: "659003"
    }, {
        name: "五家渠",
        area_code: "659004"
    }, {
        name: "昌吉",
        area_code: "6523"
    }, {
        name: "吐鲁番",
        area_code: "6521"
    }, {
        name: "库尔勒",
        area_code: "6528"
    }, {
        name: "阿拉尔",
        area_code: "659002"
    }, {
        name: "阿克苏",
        area_code: "6529"
    }, {
        name: "喀什",
        area_code: "6531"
    }, {
        name: "伊宁",
        area_code: "6540"
    }, {
        name: "塔城",
        area_code: "6542"
    }, {
        name: "哈密",
        area_code: "6522"
    }, {
        name: "和田",
        area_code: "6532"
    }, {
        name: "阿勒泰",
        area_code: "6543"
    }, {
        name: "阿图什",
        area_code: "6530"
    }, {
        name: "博乐",
        area_code: "6527"
    }, {
        name: "克拉玛依",
        area_code: "6502"
    }]
}, {
    name: "西藏",
    code: "XZ",
    area_code: "54",
    city: [{
        name: "拉萨",
        area_code: "5401"
    }, {
        name: "山南",
        area_code: "5422"
    }, {
        name: "阿里",
        area_code: "5425"
    }, {
        name: "昌都",
        area_code: "5421"
    }, {
        name: "那曲",
        area_code: "5424"
    }, {
        name: "日喀则",
        area_code: "5402"
    }, {
        name: "林芝",
        area_code: "5426"
    }]
}, {
    name: "云南",
    code: "YN",
    area_code: "53",
    city: [{
        name: "昆明",
        area_code: "5301"
    }, {
        name: "红河",
        area_code: "5325"
    }, {
        name: "文山",
        area_code: "5326"
    }, {
        name: "玉溪",
        area_code: "5304"
    }, {
        name: "楚雄",
        area_code: "5323"
    }, {
        name: "普洱",
        area_code: "5308"
    }, {
        name: "昭通",
        area_code: "5306"
    }, {
        name: "临沧",
        area_code: "5309"
    }, {
        name: "怒江",
        area_code: "5333"
    }, {
        name: "香格里拉",
        area_code: "5334"
    }, {
        name: "丽江",
        area_code: "5307"
    }, {
        name: "德宏",
        area_code: "5331"
    }, {
        name: "景洪",
        area_code: "5328"
    }, {
        name: "大理",
        area_code: "5329"
    }, {
        name: "曲靖",
        area_code: "5303"
    }, {
        name: "保山",
        area_code: "5305"
    }]
}, {
    name: "浙江",
    code: "ZJ",
    area_code: "33",
    city: [{
        name: "杭州",
        area_code: "3301"
    }, {
        name: "舟山",
        area_code: "3309"
    }, {
        name: "湖州",
        area_code: "3305"
    }, {
        name: "嘉兴",
        area_code: "3304"
    }, {
        name: "金华",
        area_code: "3307"
    }, {
        name: "绍兴",
        area_code: "3306"
    }, {
        name: "台州",
        area_code: "3310"
    }, {
        name: "温州",
        area_code: "3303"
    }, {
        name: "丽水",
        area_code: "3311"
    }, {
        name: "衢州",
        area_code: "3308"
    }, {
        name: "宁波",
        area_code: "3302"
    }]
}, {
    name: "台湾",
    code: "TW",
    area_code: "710000",
    city: [{
        name: "台湾"
    }]
}, {
    name: "香港",
    code: "HK",
    area_code: "810000",
    city: [{
        name: "香港"
    }]
}, {
    name: "澳门",
    code: "MO",
    area_code: "820000",
    city: [{
        name: "澳门"
    }]
}]
  , position_list = [{
    name: "采购",
    code: "P01",
    position: [{
        name: "采购总监",
        position_code: "P01001"
    }, {
        name: "采购经理",
        position_code: "P01002"
    }, {
        name: "采购主管",
        position_code: "P01003"
    }, {
        name: "采购员",
        position_code: "P01004"
    }, {
        name: "采购助理 ",
        position_code: "P01005"
    }, {
        name: "买手",
        position_code: "P01006"
    }, {
        name: "供应商开发",
        position_code: "P01007"
    }]
}, {
    name: "高级管理",
    code: "P02",
    position: [{
        name: "首席执行官CEO",
        position_code: "P02001"
    }, {
        name: "总经理",
        position_code: "P02002"
    }, {
        name: "首席财务官 CFO",
        position_code: "P02003"
    }, {
        name: "首席运营官COO",
        position_code: "P02004"
    }, {
        name: "首席技术执行官CTO",
        position_code: "P02005"
    }, {
        name: "首席信息官CIO",
        position_code: "P02006"
    }, {
        name: "副总经理",
        position_code: "P02007"
    }, {
        name: "副总裁",
        position_code: "P02008"
    }, {
        name: "合伙人",
        position_code: "P02009"
    }, {
        name: "总监",
        position_code: "P02010"
    }, {
        name: "部门经理",
        position_code: "P02011"
    }, {
        name: "策略发展总监",
        position_code: "P02012"
    }, {
        name: "企业秘书",
        position_code: "P02013"
    }, {
        name: "董事会秘书",
        position_code: "P02014"
    }, {
        name: "投资者关系",
        position_code: "P02015"
    }, {
        name: "办事处首席代表",
        position_code: "P02016"
    }, {
        name: "办事处经理",
        position_code: "P02017"
    }, {
        name: "分公司经理",
        position_code: "P02018"
    }, {
        name: "分支机构经理",
        position_code: "P02019"
    }, {
        name: "总裁助理",
        position_code: "P02020"
    }, {
        name: "行长",
        position_code: "P02021"
    }, {
        name: "副行长",
        position_code: "P02022"
    }, {
        name: "厂长 ",
        position_code: "P02023"
    }]
}, {
    name: "法务",
    code: "P03",
    position: [{
        name: "合同管理",
        position_code: "P03001"
    }, {
        name: "律师",
        position_code: "P03002"
    }, {
        name: "法律顾问",
        position_code: "P03003"
    }, {
        name: "律师助理",
        position_code: "P03004"
    }, {
        name: "法务经理 ",
        position_code: "P03005"
    }, {
        name: "法务主管",
        position_code: "P03006"
    }, {
        name: "法务专员",
        position_code: "P03007"
    }, {
        name: "法务助理",
        position_code: "P03008"
    }, {
        name: "合规经理",
        position_code: "P03009"
    }, {
        name: "合规主管",
        position_code: "P03010"
    }, {
        name: "知识产权",
        position_code: "P03011"
    }]
}, {
    name: "市场",
    code: "P04",
    position: [{
        name: "市场营销",
        position_code: "P04001"
    }, {
        name: "市场拓展",
        position_code: "P04002"
    }, {
        name: "品牌助理",
        position_code: "P04003"
    }, {
        name: "品牌专员",
        position_code: "P04004"
    }, {
        name: "品牌主管",
        position_code: "P04005"
    }, {
        name: "品牌经理",
        position_code: "P04006"
    }, {
        name: "品牌总监 ",
        position_code: "P04007"
    }, {
        name: "市场企划专员",
        position_code: "P04008"
    }, {
        name: "市场企划主管",
        position_code: "P04009"
    }, {
        name: "市场企划经理",
        position_code: "P04010"
    }, {
        name: "网站营运专员",
        position_code: "P04011"
    }, {
        name: "网站营运主管",
        position_code: "P04012"
    }, {
        name: "网站营运经理",
        position_code: "P04013"
    }, {
        name: "网站营运总监",
        position_code: "P04014"
    }, {
        name: "网络推广专员",
        position_code: "P04015"
    }, {
        name: "网络推广主管",
        position_code: "P04016"
    }, {
        name: "网络推广经理",
        position_code: "P04017"
    }, {
        name: "网络推广总监",
        position_code: "P04018"
    }, {
        name: "电子商务专员",
        position_code: "P04019"
    }, {
        name: "电子商务主管",
        position_code: "P04020"
    }, {
        name: "电子商务经理",
        position_code: "P04021"
    }, {
        name: "电子商务总监",
        position_code: "P04022"
    }, {
        name: "市场分析调研人员",
        position_code: "P04023"
    }, {
        name: "选址拓展",
        position_code: "P04024"
    }, {
        name: "新店开发",
        position_code: "P04025"
    }, {
        name: "广告创意设计",
        position_code: "P04026"
    }, {
        name: "广告制作执行",
        position_code: "P04027"
    }, {
        name: "美术指导",
        position_code: "P04028"
    }, {
        name: "文案",
        position_code: "P04029"
    }, {
        name: "策划人员",
        position_code: "P04030"
    }]
}, {
    name: "销售",
    code: "P05",
    position: [{
        name: "金融产品销售",
        position_code: "P05001"
    }, {
        name: "银行客户总监",
        position_code: "P05002"
    }, {
        name: "个人业务客户经理",
        position_code: "P05003"
    }, {
        name: "公司业务客户经理",
        position_code: "P05004"
    }, {
        name: "高级客户经理",
        position_code: "P05005"
    }, {
        name: "客户经理",
        position_code: "P05006"
    }, {
        name: "客户专员",
        position_code: "P05007"
    }, {
        name: "营业部大堂经理",
        position_code: "P05008"
    }, {
        name: "信用卡销售",
        position_code: "P05009"
    }, {
        name: "保险产品开发",
        position_code: "P05010"
    }, {
        name: "保险业务经理",
        position_code: "P05011"
    }, {
        name: "保险经纪人",
        position_code: "P05012"
    }, {
        name: "保险代理",
        position_code: "P05013"
    }, {
        name: "理财顾问",
        position_code: "P05014"
    }, {
        name: "财务规划师",
        position_code: "P05015"
    }, {
        name: "储备经理人",
        position_code: "P05016"
    }, {
        name: "保险客户服务",
        position_code: "P05017"
    }, {
        name: "4S店经理",
        position_code: "P05018"
    }, {
        name: "汽车销售 ",
        position_code: "P05019"
    }, {
        name: "外贸经理 ",
        position_code: "P05020"
    }, {
        name: "外贸专员",
        position_code: "P05021"
    }, {
        name: "国内贸易人员 ",
        position_code: "P05022"
    }, {
        name: "业务跟单经理",
        position_code: "P05023"
    }, {
        name: "高级业务跟单",
        position_code: "P05024"
    }, {
        name: "货运代理",
        position_code: "P05025"
    }, {
        name: "房地产销售经理",
        position_code: "P05026"
    }, {
        name: "房地产销售",
        position_code: "P05027"
    }, {
        name: "房地产中介",
        position_code: "P05028"
    }, {
        name: "置业顾问 ",
        position_code: "P05030"
    }, {
        name: "高级物业顾问 ",
        position_code: "P05029"
    }, {
        name: "物业顾问 ",
        position_code: "P05031"
    }, {
        name: "广告客户专员",
        position_code: "P05032"
    }, {
        name: "广告客户经理",
        position_code: "P05033"
    }, {
        name: "卖场经理",
        position_code: "P05034"
    }, {
        name: "营业员",
        position_code: "P05035"
    }, {
        name: "导购",
        position_code: "P05036"
    }, {
        name: "销售顾问",
        position_code: "P05037"
    }, {
        name: "促销员",
        position_code: "P05038"
    }, {
        name: "收银员",
        position_code: "P05039"
    }, {
        name: "收银主管",
        position_code: "P05040"
    }, {
        name: "医药销售经理",
        position_code: "P05041"
    }, {
        name: "医药销售代表",
        position_code: "P05042"
    }, {
        name: "医疗器械销售经理",
        position_code: "P05043"
    }, {
        name: "医疗器械销售代表",
        position_code: "P05044"
    }, {
        name: "销售总监",
        position_code: "P05045"
    }, {
        name: "销售经理",
        position_code: "P05046"
    }, {
        name: "销售主管",
        position_code: "P05047"
    }, {
        name: "业务拓展经理",
        position_code: "P05048"
    }, {
        name: "渠道总监",
        position_code: "P05049"
    }, {
        name: "渠道经理",
        position_code: "P05050"
    }, {
        name: "大客户管理",
        position_code: "P05051"
    }, {
        name: "区域销售总监",
        position_code: "P05053"
    }, {
        name: "区域销售经理",
        position_code: "P05054"
    }, {
        name: "团购经理",
        position_code: "P05055"
    }, {
        name: "大客户销售",
        position_code: "P05056"
    }, {
        name: "销售代表",
        position_code: "P05057"
    }, {
        name: "客户代表",
        position_code: "P05058"
    }, {
        name: "销售工程师",
        position_code: "P05059"
    }, {
        name: "电话销售",
        position_code: "P05060"
    }, {
        name: "网络销售",
        position_code: "P05061"
    }, {
        name: "团购业务员",
        position_code: "P05062"
    }, {
        name: "经销商",
        position_code: "P05063"
    }, {
        name: "会籍顾问",
        position_code: "P05064"
    }, {
        name: "销售助理",
        position_code: "P05065"
    }, {
        name: "促销经理 ",
        position_code: "P05066"
    }, {
        name: "销售行政经理",
        position_code: "P05067"
    }, {
        name: "业务分析经理",
        position_code: "P05068"
    }, {
        name: "商务经理",
        position_code: "P05069"
    }, {
        name: "商务专员",
        position_code: "P05070"
    }, {
        name: "商务助理",
        position_code: "P05071"
    }]
}, {
    name: "生产",
    code: "P06",
    position: [{
        name: "生产总监",
        position_code: "P06001"
    }, {
        name: "生产经理",
        position_code: "P06002"
    }, {
        name: "车间主任 ",
        position_code: "P06003"
    }, {
        name: "生产主管",
        position_code: "P06004"
    }, {
        name: "生产领班",
        position_code: "P06005"
    }, {
        name: "生产计划",
        position_code: "P06006"
    }, {
        name: "物料管理(PMC)",
        position_code: "P06007"
    }, {
        name: "生产文员 ",
        position_code: "P06008"
    }, {
        name: "设备主管",
        position_code: "P06009"
    }, {
        name: "化验员",
        position_code: "P06010"
    }, {
        name: "技工",
        position_code: "P06011"
    }, {
        name: "普工",
        position_code: "P06012"
    }, {
        name: "服装工艺师",
        position_code: "P06013"
    }, {
        name: "纺织工艺师",
        position_code: "P06014"
    }, {
        name: "皮革工艺师 ",
        position_code: "P06015"
    }, {
        name: "质量管理",
        position_code: "P06016"
    }, {
        name: "验货员",
        position_code: "P06017"
    }, {
        name: "印刷工 ",
        position_code: "P06019"
    }, {
        name: "校对",
        position_code: "P06020"
    }, {
        name: "录入",
        position_code: "P06021"
    }, {
        name: "调色员 ",
        position_code: "P06022"
    }, {
        name: "烫金工",
        position_code: "P06023"
    }, {
        name: "晒版员 ",
        position_code: "P06024"
    }, {
        name: "装订工 ",
        position_code: "P06025"
    }, {
        name: "印刷机械机长 ",
        position_code: "P06026"
    }, {
        name: "调墨技师",
        position_code: "P06027"
    }, {
        name: "电分操作员 ",
        position_code: "P06028"
    }, {
        name: "打稿机操作员",
        position_code: "P06029"
    }, {
        name: "物流助理",
        position_code: "P06031"
    }, {
        name: "物流经理",
        position_code: "P06032"
    }, {
        name: "供应链助理",
        position_code: "P06033"
    }, {
        name: "供应链经理",
        position_code: "P06034"
    }, {
        name: "物料助理",
        position_code: "P06035"
    }, {
        name: "物料经理",
        position_code: "P06036"
    }, {
        name: "仓库管理员",
        position_code: "P06037"
    }, {
        name: "订单处理员",
        position_code: "P06038"
    }, {
        name: "运输经理",
        position_code: "P06039"
    }, {
        name: "工程监理",
        position_code: "P06040"
    }, {
        name: "安全员",
        position_code: "P06041"
    }, {
        name: "施工员",
        position_code: "P06042"
    }, {
        name: "医疗器械生产",
        position_code: "P06043"
    }, {
        name: "医疗器械维修人员",
        position_code: "P06044"
    }, {
        name: "药品生产",
        position_code: "P06045"
    }, {
        name: "养殖部场长",
        position_code: "P06046"
    }, {
        name: "农艺师",
        position_code: "P06047"
    }, {
        name: "畜牧师",
        position_code: "P06048"
    }, {
        name: "饲养员",
        position_code: "P06049"
    }]
}, {
    name: "工程技术",
    code: "P07",
    position: [{
        name: "产品工艺工程师",
        position_code: "P07001"
    }, {
        name: "制程工程师",
        position_code: "P07002"
    }, {
        name: "产品规划工程师",
        position_code: "P07003"
    }, {
        name: "实验室负责人",
        position_code: "P07004"
    }, {
        name: "工程经理",
        position_code: "P07005"
    }, {
        name: "工程工程师",
        position_code: "P07006"
    }, {
        name: "工程机械绘图员",
        position_code: "P07007"
    }, {
        name: "维修经理",
        position_code: "P07008"
    }, {
        name: "维修工程师",
        position_code: "P07009"
    }, {
        name: "维修技师",
        position_code: "P07010"
    }, {
        name: "机械师",
        position_code: "P07011"
    }, {
        name: "CNC工程师",
        position_code: "P07012"
    }, {
        name: "飞行器设计与制造",
        position_code: "P07013"
    }, {
        name: "总工程师",
        position_code: "P07014"
    }, {
        name: "副总工程师",
        position_code: "P07015"
    }, {
        name: "营运经理",
        position_code: "P07016"
    }, {
        name: "营运主管",
        position_code: "P07017"
    }, {
        name: "质量检验员",
        position_code: "P07018"
    }, {
        name: "可靠度工程师",
        position_code: "P07019"
    }, {
        name: "故障分析工程师 ",
        position_code: "P07020"
    }, {
        name: "认证工程师",
        position_code: "P07021"
    }, {
        name: "体系工程师",
        position_code: "P07022"
    }, {
        name: "环境工程师",
        position_code: "P07023"
    }, {
        name: "建筑制图",
        position_code: "P07024"
    }, {
        name: "建筑工程管理",
        position_code: "P07025"
    }, {
        name: "建筑工程验收",
        position_code: "P07026"
    }, {
        name: "房产项目配套工程师",
        position_code: "P07027"
    }, {
        name: "物业机电工程师",
        position_code: "P07028"
    }, {
        name: "化学分析测试员",
        position_code: "P07029"
    }, {
        name: "化工工程师",
        position_code: "P07030"
    }, {
        name: "涂料研发工程师",
        position_code: "P07031"
    }, {
        name: "配色技术员",
        position_code: "P07032"
    }, {
        name: "塑料工程师 ",
        position_code: "P07033"
    }, {
        name: "化妆品研发",
        position_code: "P07034"
    }, {
        name: "食品研发 ",
        position_code: "P07035"
    }, {
        name: "饮料研发",
        position_code: "P07036"
    }, {
        name: "造纸研发",
        position_code: "P07037"
    }, {
        name: "环保工程师",
        position_code: "P07038"
    }]
}, {
    name: "软件技术",
    code: "P08",
    position: [{
        name: "技术研发经理",
        position_code: "P08001"
    }, {
        name: "技术研发工程师",
        position_code: "P08002"
    }, {
        name: "项目管理",
        position_code: "P08003"
    }, {
        name: "项目总监",
        position_code: "P08004"
    }, {
        name: "项目经理",
        position_code: "P08005"
    }, {
        name: "项目工程师",
        position_code: "P08006"
    }, {
        name: "产品经理",
        position_code: "P08007"
    }, {
        name: "测试经理",
        position_code: "P08008"
    }, {
        name: "软件工程师",
        position_code: "P08009"
    }, {
        name: "硬件工程师",
        position_code: "P08010"
    }, {
        name: "UI设计师",
        position_code: "P08011"
    }, {
        name: "算法工程师",
        position_code: "P08012"
    }, {
        name: "仿真应用工程师",
        position_code: "P08013"
    }, {
        name: "ERP实施顾问",
        position_code: "P08014"
    }, {
        name: "ERP技术开发",
        position_code: "P08015"
    }, {
        name: "需求工程师",
        position_code: "P08016"
    }, {
        name: "系统集成工程师",
        position_code: "P08017"
    }, {
        name: "系统分析员",
        position_code: "P08018"
    }, {
        name: "系统工程师",
        position_code: "P08019"
    }, {
        name: "系统架构设计师",
        position_code: "P08020"
    }, {
        name: "数据库工程师",
        position_code: "P08021"
    }, {
        name: "数据库管理员",
        position_code: "P08022"
    }, {
        name: "SEO搜索引擎优化 ",
        position_code: "P08023"
    }, {
        name: "网络工程师",
        position_code: "P08024"
    }, {
        name: "UE设计师",
        position_code: "P08025"
    }, {
        name: "Web前端开发",
        position_code: "P08026"
    }, {
        name: "系统管理员",
        position_code: "P08027"
    }, {
        name: "网络管理员",
        position_code: "P08028"
    }, {
        name: "游戏策划师",
        position_code: "P08029"
    }, {
        name: "网页设计",
        position_code: "P08030"
    }, {
        name: "技术总监",
        position_code: "P08031"
    }, {
        name: "信息技术经理",
        position_code: "P08032"
    }, {
        name: "技术支持经理",
        position_code: "P08033"
    }, {
        name: "技术支持工程师",
        position_code: "P08034"
    }, {
        name: "网络管理(Helpdesk) ",
        position_code: "P08035"
    }, {
        name: "售前技术支持",
        osition_code: "P08036"
    }, {
        name: "售后技术支持",
        position_code: "P08037"
    }]
}, {
    name: "金融服务",
    code: "P09",
    position: [{
        name: "证券经纪人",
        position_code: "P09001"
    }, {
        name: "期货经纪人",
        position_code: "P09002"
    }, {
        name: "外汇经纪人",
        position_code: "P09003"
    }, {
        name: "证券分析师",
        position_code: "P09004"
    }, {
        name: "股票操盘手",
        position_code: "P09005"
    }, {
        name: "期货操盘手",
        position_code: "P09006"
    }, {
        name: "金融研究员",
        position_code: "P09007"
    }, {
        name: "经济研究员",
        position_code: "P09008"
    }, {
        name: "投资项目经理",
        position_code: "P09009"
    }, {
        name: "基金项目经理",
        position_code: "P09010"
    }, {
        name: "投资银行业务",
        position_code: "P09011"
    }, {
        name: "投资银行财务分析",
        position_code: "P09012"
    }, {
        name: "融资经理",
        position_code: "P09013"
    }, {
        name: "融资主管",
        position_code: "P09014"
    }, {
        name: "融资专员",
        position_code: "P09015"
    }, {
        name: "风险管理",
        position_code: "P09016"
    }, {
        name: "拍卖员",
        position_code: "P09017"
    }, {
        name: "资产评估",
        position_code: "P09018"
    }, {
        name: "资产分析",
        position_code: "P09019"
    }, {
        name: "风险控制",
        position_code: "P09020"
    }, {
        name: "信贷管理",
        position_code: "P09021"
    }, {
        name: "信审核查",
        position_code: "P09022"
    }, {
        name: "信用证结算",
        position_code: "P09023"
    }, {
        name: "外汇交易",
        position_code: "P09024"
    }, {
        name: "清算人员",
        position_code: "P09025"
    }, {
        name: "保险精算师",
        position_code: "P09026"
    }, {
        name: "保险核保",
        position_code: "P09027"
    }, {
        name: "保险理赔",
        position_code: "P09028"
    }, {
        name: "保险培训师",
        position_code: "P09029"
    }]
}, {
    name: "医疗服务",
    code: "P10",
    position: [{
        name: "医生",
        position_code: "P10001"
    }, {
        name: "医师",
        position_code: "P10002"
    }, {
        name: "营养师",
        position_code: "P10003"
    }, {
        name: "药剂师",
        position_code: "P10004"
    }, {
        name: "医药学检验",
        position_code: "P10005"
    }, {
        name: "公共卫生",
        position_code: "P10006"
    }, {
        name: "护理主任",
        position_code: "P10007"
    }, {
        name: "护士长",
        position_code: "P10008"
    }, {
        name: "护士",
        position_code: "P10009"
    }, {
        name: "护理人员",
        position_code: "P10010"
    }, {
        name: "兽医",
        position_code: "P10011"
    }, {
        name: "医药技术研发管理人员",
        position_code: "P10012"
    }, {
        name: "医药技术研发人员",
        position_code: "P10013"
    }, {
        name: "临床研究员",
        position_code: "P10014"
    }, {
        name: "临床协调员",
        position_code: "P10015"
    }, {
        name: "临床数据分析员",
        position_code: "P10016"
    }, {
        name: "医疗器械研发",
        position_code: "P10017"
    }]
}, {
    name: "其他专业服务",
    code: "P11",
    position: [{
        name: "检验员",
        position_code: "P11001"
    }, {
        name: "检测员",
        position_code: "P11002"
    }, {
        name: "二手车评估师",
        position_code: "P11003"
    }, {
        name: "服装设计总监",
        position_code: "P11004"
    }, {
        name: "纺织设计总监 ",
        position_code: "P11005"
    }, {
        name: "服装设计",
        osition_code: "P11006"
    }, {
        name: "纺织设计",
        position_code: "P11007"
    }, {
        name: "房地产投资分析 ",
        position_code: "P11008"
    }, {
        name: "房地产资产管理",
        position_code: "P11009"
    }, {
        name: "专业顾问",
        position_code: "P11010"
    }, {
        name: "咨询经理",
        position_code: "P11011"
    }, {
        name: "猎头",
        position_code: "P11012"
    }, {
        name: "人才中介",
        position_code: "P11013"
    }, {
        name: "情报信息分析人员",
        position_code: "P11014"
    }, {
        name: "校长",
        position_code: "P11015"
    }, {
        name: "教师",
        position_code: "P11016"
    }, {
        name: "院校教务管理人员",
        position_code: "P11017"
    }, {
        name: "培训讲师",
        position_code: "P11018"
    }, {
        name: "培训开发",
        position_code: "P11019"
    }, {
        name: "培训顾问",
        position_code: "P11020"
    }, {
        name: "科研管理人员",
        position_code: "P11021"
    }, {
        name: "科研人员",
        position_code: "P11022"
    }, {
        name: "教练",
        position_code: "P11023"
    }, {
        name: "救生员",
        position_code: "P11024"
    }, {
        name: "验光师",
        position_code: "P11025"
    }]
}]
  , city_list_new = [{
    name: "热门城市",
    code: "",
    area_code: "",
    city: [{
        name: "北京",
        area_code: "11"
    }, {
        name: "上海",
        area_code: "31"
    }, {
        name: "广州",
        area_code: "4401"
    }, {
        name: "深圳",
        area_code: "4403"
    }, {
        name: "天津",
        area_code: "12"
    }, {
        name: "重庆",
        area_code: "50"
    }, {
        name: "杭州",
        area_code: "3301"
    }, {
        name: "成都",
        area_code: "5101"
    }, {
        name: "南京",
        area_code: "3201"
    }, {
        name: "苏州",
        area_code: "3205"
    }, {
        name: "大连",
        area_code: "2102"
    }, {
        name: "武汉",
        area_code: "4201"
    }]
}, {
    name: "安徽",
    code: "AH",
    area_code: "34",
    city: [{
        name: "合肥",
        area_code: "3401"
    }, {
        name: "芜湖",
        area_code: "3402"
    }, {
        name: "淮南",
        area_code: "3404"
    }, {
        name: "安庆",
        area_code: "3408"
    }, {
        name: "宿州",
        area_code: "3413"
    }, {
        name: "阜阳",
        area_code: "3412"
    }, {
        name: "亳州",
        area_code: "3416"
    }, {
        name: "黄山",
        area_code: "3410"
    }, {
        name: "滁州",
        area_code: "3411"
    }, {
        name: "淮北",
        area_code: "3406"
    }, {
        name: "铜陵",
        area_code: "3407"
    }, {
        name: "宣城",
        area_code: "3418"
    }, {
        name: "六安",
        area_code: "3415"
    }, {
        name: "巢湖",
        area_code: "3414"
    }, {
        name: "池州",
        area_code: "3417"
    }, {
        name: "蚌埠",
        area_code: "3403"
    }, {
        name: "马鞍山",
        area_code: "3405"
    }]
}, {
    name: "北京",
    code: "BJ",
    area_code: "11",
    city: [{
        name: "北京",
        area_code: "11"
    }]
}, {
    name: "重庆",
    code: "CQ",
    area_code: "50",
    city: [{
        name: "重庆",
        area_code: "50"
    }]
}, {
    name: "福建",
    code: "FJ",
    area_code: "35",
    city: [{
        name: "福州",
        area_code: "3501"
    }, {
        name: "泉州",
        area_code: "3505"
    }, {
        name: "漳州",
        area_code: "3506"
    }, {
        name: "龙岩",
        area_code: "3508"
    }, {
        name: "南平",
        area_code: "3507"
    }, {
        name: "厦门",
        area_code: "3502"
    }, {
        name: "宁德",
        area_code: "3509"
    }, {
        name: "莆田",
        area_code: "3503"
    }, {
        name: "三明",
        area_code: "3504"
    }]
}, {
    name: "广东",
    code: "GD",
    area_code: "44",
    city: [{
        name: "深圳",
        area_code: "4403"
    }, {
        name: "广州",
        area_code: "4401"
    }, {
        name: "惠州",
        area_code: "4413"
    }, {
        name: "梅州",
        area_code: "4414"
    }, {
        name: "汕头",
        area_code: "4405"
    }, {
        name: "珠海",
        area_code: "4404"
    }, {
        name: "佛山",
        area_code: "4406"
    }, {
        name: "肇庆",
        area_code: "4412"
    }, {
        name: "湛江",
        area_code: "4408"
    }, {
        name: "江门",
        area_code: "4407"
    }, {
        name: "河源",
        area_code: "4416"
    }, {
        name: "清远",
        area_code: "4418"
    }, {
        name: "云浮",
        area_code: "4453"
    }, {
        name: "东莞",
        area_code: "4419"
    }, {
        name: "中山",
        area_code: "4420"
    }, {
        name: "阳江",
        area_code: "4417"
    }, {
        name: "揭阳",
        area_code: "4452"
    }, {
        name: "茂名",
        area_code: "4409"
    }, {
        name: "汕尾",
        area_code: "4415"
    }, {
        name: "韶关",
        area_code: "4402"
    }, {
        name: "潮州",
        area_code: "4451"
    }]
}, {
    name: "广西",
    code: "GX",
    area_code: "45",
    city: [{
        name: "南宁",
        area_code: "4501"
    }, {
        name: "柳州",
        area_code: "4502"
    }, {
        name: "来宾",
        area_code: "4513"
    }, {
        name: "桂林",
        area_code: "4503"
    }, {
        name: "梧州",
        area_code: "4504"
    }, {
        name: "防城港",
        area_code: "4506"
    }, {
        name: "贵港",
        area_code: "4508"
    }, {
        name: "玉林",
        area_code: "4509"
    }, {
        name: "百色",
        area_code: "4510"
    }, {
        name: "钦州",
        area_code: "4507"
    }, {
        name: "河池",
        area_code: "4512"
    }, {
        name: "北海",
        area_code: "4505"
    }, {
        name: "崇左",
        area_code: "4514"
    }, {
        name: "贺州",
        area_code: "4511"
    }]
}, {
    name: "甘肃",
    code: "GS",
    area_code: "62",
    city: [{
        name: "兰州",
        area_code: "6201"
    }, {
        name: "平凉",
        area_code: "6208"
    }, {
        name: "庆阳",
        area_code: "6210"
    }, {
        name: "武威",
        area_code: "6206"
    }, {
        name: "金昌",
        area_code: "6203"
    }, {
        name: "酒泉",
        area_code: "6209"
    }, {
        name: "天水",
        area_code: "6205"
    }, {
        name: "陇南",
        area_code: "6212"
    }, {
        name: "临夏",
        area_code: "6229"
    }, {
        name: "合作",
        area_code: "6230"
    }, {
        name: "白银",
        area_code: "6204"
    }, {
        name: "定西",
        area_code: "6211"
    }, {
        name: "张掖",
        area_code: "6207"
    }, {
        name: "嘉峪关",
        area_code: "6202"
    }]
}, {
    name: "贵州",
    code: "GZ",
    area_code: "52",
    city: [{
        name: "贵阳",
        area_code: "5201"
    }, {
        name: "安顺",
        area_code: "5204"
    }, {
        name: "都匀",
        area_code: "5227"
    }, {
        name: "兴义",
        area_code: "5223"
    }, {
        name: "铜仁",
        area_code: "5206"
    }, {
        name: "毕节",
        area_code: "5205"
    }, {
        name: "六盘水",
        area_code: "5202"
    }, {
        name: "遵义",
        area_code: "5203"
    }, {
        name: "凯里",
        area_code: "5226"
    }]
}, {
    name: "河北",
    code: "HB",
    area_code: "13",
    city: [{
        name: "石家庄",
        area_code: "1301"
    }, {
        name: "张家口",
        area_code: "1307"
    }, {
        name: "秦皇岛",
        area_code: "1303"
    }, {
        name: "承德",
        area_code: "1308"
    }, {
        name: "唐山",
        area_code: "1302"
    }, {
        name: "沧州",
        area_code: "1309"
    }, {
        name: "衡水",
        area_code: "1311"
    }, {
        name: "邢台",
        area_code: "1305"
    }, {
        name: "邯郸",
        area_code: "1304"
    }, {
        name: "保定",
        area_code: "1306"
    }, {
        name: "廊坊",
        area_code: "1310"
    }]
}, {
    name: "河南",
    code: "HN",
    area_code: "41",
    city: [{
        name: "郑州",
        area_code: "4101"
    }, {
        name: "新乡",
        area_code: "4107"
    }, {
        name: "许昌",
        area_code: "4110"
    }, {
        name: "信阳",
        area_code: "4115"
    }, {
        name: "南阳",
        area_code: "4113"
    }, {
        name: "开封",
        area_code: "4102"
    }, {
        name: "洛阳",
        area_code: "4103"
    }, {
        name: "商丘",
        area_code: "4114"
    }, {
        name: "焦作",
        area_code: "4108"
    }, {
        name: "鹤壁",
        area_code: "4106"
    }, {
        name: "濮阳",
        area_code: "4109"
    }, {
        name: "周口",
        area_code: "4116"
    }, {
        name: "漯河",
        area_code: "4111"
    }, {
        name: "济源",
        area_code: "4190"
    }, {
        name: "安阳",
        area_code: "4105"
    }, {
        name: "平顶山",
        area_code: "4104"
    }, {
        name: "驻马店",
        area_code: "4117"
    }, {
        name: "三门峡",
        area_code: "4112"
    }]
}, {
    name: "湖北",
    code: "HUBEI",
    area_code: "42",
    city: [{
        name: "武汉",
        area_code: "4201"
    }, {
        name: "荆州",
        area_code: "4210"
    }, {
        name: "黄冈",
        area_code: "4211"
    }, {
        name: "宜昌",
        area_code: "4205"
    }, {
        name: "恩施",
        area_code: "4228"
    }, {
        name: "十堰",
        area_code: "4203"
    }, {
        name: "神农架",
        area_code: "429021"
    }, {
        name: "随州",
        area_code: "4213"
    }, {
        name: "荆门",
        area_code: "4208"
    }, {
        name: "天门",
        area_code: "429006"
    }, {
        name: "仙桃",
        area_code: "429004"
    }, {
        name: "潜江",
        area_code: "429005"
    }, {
        name: "襄阳",
        area_code: "4206"
    }, {
        name: "鄂州",
        area_code: "4207"
    }, {
        name: "孝感",
        area_code: "4209"
    }, {
        name: "黄石",
        area_code: "4202"
    }, {
        name: "咸宁",
        area_code: "4212"
    }]
}, {
    name: "湖南",
    code: "HUNAN",
    area_code: "43",
    city: [{
        name: "长沙",
        area_code: "4301"
    }, {
        name: "株洲",
        area_code: "4302"
    }, {
        name: "衡阳",
        area_code: "4304"
    }, {
        name: "郴州",
        area_code: "4310"
    }, {
        name: "常德",
        area_code: "4307"
    }, {
        name: "益阳",
        area_code: "4309"
    }, {
        name: "娄底",
        area_code: "4313"
    }, {
        name: "邵阳",
        area_code: "4305"
    }, {
        name: "岳阳",
        area_code: "4306"
    }, {
        name: "张家界",
        area_code: "4308"
    }, {
        name: "怀化",
        area_code: "4312"
    }, {
        name: "永州",
        area_code: "4311"
    }, {
        name: "吉首",
        area_code: "4331"
    }, {
        name: "湘潭",
        area_code: "4303"
    }]
}, {
    name: "黑龙江",
    code: "HLJ",
    area_code: "23",
    city: [{
        name: "哈尔滨",
        area_code: "2301"
    }, {
        name: "牡丹江",
        area_code: "2310"
    }, {
        name: "佳木斯",
        area_code: "2308"
    }, {
        name: "绥化",
        area_code: "2312"
    }, {
        name: "黑河",
        area_code: "2311"
    }, {
        name: "双鸭山",
        area_code: "2305"
    }, {
        name: "伊春",
        area_code: "2307"
    }, {
        name: "大庆",
        area_code: "2306"
    }, {
        name: "七台河",
        area_code: "2309"
    }, {
        name: "鸡西",
        area_code: "2303"
    }, {
        name: "鹤岗",
        area_code: "2304"
    }, {
        name: "齐齐哈尔",
        area_code: "2302"
    }, {
        name: "大兴安岭",
        area_code: "2327"
    }]
}, {
    name: "海南",
    code: "HAINAN",
    area_code: "46",
    city: [{
        name: "海口",
        area_code: "4601"
    }, {
        name: "三亚",
        area_code: "4602"
    }, {
        name: "东方",
        area_code: "469007"
    }, {
        name: "临高",
        area_code: "469024"
    }, {
        name: "澄迈",
        area_code: "469023"
    }, {
        name: "儋州",
        area_code: "469003"
    }, {
        name: "昌江",
        area_code: "469026"
    }, {
        name: "白沙",
        area_code: "469025"
    }, {
        name: "琼中",
        area_code: "469030"
    }, {
        name: "定安",
        area_code: "469021"
    }, {
        name: "屯昌",
        area_code: "469022"
    }, {
        name: "琼海",
        area_code: "469002"
    }, {
        name: "文昌",
        area_code: "469005"
    }, {
        name: "保亭",
        area_code: "469029"
    }, {
        name: "万宁",
        area_code: "469006"
    }, {
        name: "陵水",
        area_code: "469028"
    }, {
        name: "乐东",
        area_code: "469027"
    }, {
        name: "五指山",
        area_code: "469001"
    }]
}, {
    name: "江苏",
    code: "JS",
    area_code: "32",
    city: [{
        name: "苏州",
        area_code: "3205"
    }, {
        name: "无锡",
        area_code: "3202"
    }, {
        name: "南京",
        area_code: "3201"
    }, {
        name: "镇江",
        area_code: "3211"
    }, {
        name: "南通",
        area_code: "3206"
    }, {
        name: "扬州",
        area_code: "3210"
    }, {
        name: "宿迁",
        area_code: "3213"
    }, {
        name: "徐州",
        area_code: "3203"
    }, {
        name: "淮安",
        area_code: "3208"
    }, {
        name: "连云港",
        area_code: "3207"
    }, {
        name: "常州",
        area_code: "3204"
    }, {
        name: "泰州",
        area_code: "3212"
    }, {
        name: "盐城",
        area_code: "3209"
    }]
}, {
    name: "江西",
    code: "JX",
    area_code: "36",
    city: [{
        name: "南昌",
        area_code: "3601"
    }, {
        name: "上饶",
        area_code: "3611"
    }, {
        name: "抚州",
        area_code: "3610"
    }, {
        name: "宜春",
        area_code: "3609"
    }, {
        name: "鹰潭",
        area_code: "3606"
    }, {
        name: "赣州",
        area_code: "3607"
    }, {
        name: "景德镇",
        area_code: "3602"
    }, {
        name: "萍乡",
        area_code: "3603"
    }, {
        name: "新余",
        area_code: "3605"
    }, {
        name: "九江",
        area_code: "3604"
    }, {
        name: "吉安",
        area_code: "3608"
    }]
}, {
    name: "吉林",
    code: "JL",
    area_code: "22",
    city: [{
        name: "长春",
        area_code: "2201"
    }, {
        name: "延吉",
        area_code: "2224"
    }, {
        name: "四平",
        area_code: "2203"
    }, {
        name: "白山",
        area_code: "2206"
    }, {
        name: "白城",
        area_code: "2208"
    }, {
        name: "辽源",
        area_code: "2204"
    }, {
        name: "松原",
        area_code: "2207"
    }, {
        name: "吉林",
        area_code: "2202"
    }, {
        name: "通化",
        area_code: "2205"
    }]
}, {
    name: "辽宁",
    code: "LN",
    area_code: "21",
    city: [{
        name: "沈阳",
        area_code: "2101"
    }, {
        name: "鞍山",
        area_code: "2103"
    }, {
        name: "抚顺",
        area_code: "2104"
    }, {
        name: "本溪",
        area_code: "2105"
    }, {
        name: "丹东",
        area_code: "2106"
    }, {
        name: "葫芦岛",
        area_code: "2114"
    }, {
        name: "营口",
        area_code: "2108"
    }, {
        name: "阜新",
        area_code: "2109"
    }, {
        name: "辽阳",
        area_code: "2110"
    }, {
        name: "铁岭",
        area_code: "2112"
    }, {
        name: "朝阳",
        area_code: "2113"
    }, {
        name: "盘锦",
        area_code: "2111"
    }, {
        name: "大连",
        area_code: "2102"
    }, {
        name: "锦州",
        area_code: "2107"
    }]
}, {
    name: "内蒙古",
    code: "NMG",
    area_code: "15",
    city: [{
        name: "乌海",
        area_code: "1503"
    }, {
        name: "集宁",
        area_code: "1509"
    }, {
        name: "通辽",
        area_code: "1505"
    }, {
        name: "包头",
        area_code: "1502"
    }, {
        name: "临河",
        area_code: "1508"
    }, {
        name: "赤峰",
        area_code: "1504"
    }, {
        name: "阿拉善左旗",
        area_code: "1529"
    }, {
        name: "鄂尔多斯",
        area_code: "15060"
    }, {
        name: "呼和浩特",
        area_code: "1501"
    }, {
        name: "锡林浩特",
        area_code: "1525"
    }, {
        name: "呼伦贝尔",
        area_code: "1507"
    }, {
        name: "乌兰浩特",
        area_code: "1522"
    }]
}, {
    name: "宁夏",
    code: "NX",
    area_code: "64",
    city: [{
        name: "银川",
        area_code: "6401"
    }, {
        name: "中卫",
        area_code: "6405"
    }, {
        name: "固原",
        area_code: "6404"
    }, {
        name: "石嘴山",
        area_code: "6402"
    }, {
        name: "吴忠",
        area_code: "6403"
    }]
}, {
    name: "青海",
    code: "QH",
    area_code: "63",
    city: [{
        name: "西宁",
        area_code: "6301"
    }, {
        name: "黄南",
        area_code: "6323"
    }, {
        name: "海北",
        area_code: "6322"
    }, {
        name: "果洛",
        area_code: "6326"
    }, {
        name: "玉树",
        area_code: "6327"
    }, {
        name: "海西",
        area_code: "6328"
    }, {
        name: "海东",
        area_code: "6302"
    }, {
        name: "海南",
        area_code: "6325"
    }]
}, {
    name: "上海",
    code: "SH",
    area_code: "31",
    city: [{
        name: "上海",
        area_code: "31"
    }]
}, {
    name: "山东",
    code: "SD",
    area_code: "37",
    city: [{
        name: "济南",
        area_code: "3701"
    }, {
        name: "潍坊",
        area_code: "3707"
    }, {
        name: "临沂",
        area_code: "3713"
    }, {
        name: "菏泽",
        area_code: "3717"
    }, {
        name: "滨州",
        area_code: "3716"
    }, {
        name: "东营",
        area_code: "3705"
    }, {
        name: "威海",
        area_code: "3710"
    }, {
        name: "枣庄",
        area_code: "3704"
    }, {
        name: "日照",
        area_code: "3711"
    }, {
        name: "莱芜",
        area_code: "3712"
    }, {
        name: "聊城",
        area_code: "3715"
    }, {
        name: "青岛",
        area_code: "3702"
    }, {
        name: "淄博",
        area_code: "3703"
    }, {
        name: "德州",
        area_code: "3714"
    }, {
        name: "烟台",
        area_code: "3706"
    }, {
        name: "济宁",
        area_code: "3708"
    }, {
        name: "泰安",
        area_code: "3709"
    }]
}, {
    name: "山西",
    code: "SX",
    area_code: "14",
    city: [{
        name: "太原",
        area_code: "1401"
    }, {
        name: "临汾",
        area_code: "1410"
    }, {
        name: "运城",
        area_code: "1408"
    }, {
        name: "朔州",
        area_code: "1406"
    }, {
        name: "忻州",
        area_code: "1409"
    }, {
        name: "长治",
        area_code: "1404"
    }, {
        name: "大同",
        area_code: "1402"
    }, {
        name: "阳泉",
        area_code: "1403"
    }, {
        name: "晋中",
        area_code: "1407"
    }, {
        name: "晋城",
        area_code: "1405"
    }, {
        name: "吕梁",
        area_code: "1411"
    }]
}, {
    name: "陕西",
    code: "SHANXI",
    area_code: "61",
    city: [{
        name: "西安",
        area_code: "6101"
    }, {
        name: "延安",
        area_code: "6106"
    }, {
        name: "榆林",
        area_code: "6108"
    }, {
        name: "铜川",
        area_code: "6102"
    }, {
        name: "商洛",
        area_code: "6110"
    }, {
        name: "安康",
        area_code: "6109"
    }, {
        name: "汉中",
        area_code: "6107"
    }, {
        name: "宝鸡",
        area_code: "6103"
    }, {
        name: "咸阳",
        area_code: "6104"
    }, {
        name: "渭南",
        area_code: "6105"
    }]
}, {
    name: "四川",
    code: "SC",
    area_code: "51",
    city: [{
        name: "成都",
        area_code: "5101"
    }, {
        name: "自贡",
        area_code: "5103"
    }, {
        name: "绵阳",
        area_code: "5107"
    }, {
        name: "南充",
        area_code: "5113"
    }, {
        name: "达州",
        area_code: "5117"
    }, {
        name: "遂宁",
        area_code: "5109"
    }, {
        name: "广安",
        area_code: "5116"
    }, {
        name: "巴中",
        area_code: "5119"
    }, {
        name: "泸州",
        area_code: "5105"
    }, {
        name: "宜宾",
        area_code: "5115"
    }, {
        name: "内江",
        area_code: "5110"
    }, {
        name: "资阳",
        area_code: "5120"
    }, {
        name: "乐山",
        area_code: "5111"
    }, {
        name: "眉山",
        area_code: "5114"
    }, {
        name: "凉山",
        area_code: "5134"
    }, {
        name: "雅安",
        area_code: "5118"
    }, {
        name: "甘孜",
        area_code: "5133"
    }, {
        name: "阿坝",
        area_code: "5132"
    }, {
        name: "德阳",
        area_code: "5106"
    }, {
        name: "广元",
        area_code: "5108"
    }, {
        name: "攀枝花",
        area_code: "5104"
    }]
}, {
    name: "天津",
    code: "TJ",
    area_code: "12",
    city: [{
        name: "天津",
        area_code: "12"
    }]
}, {
    name: "新疆",
    code: "XJ",
    area_code: "65",
    city: [{
        name: "乌鲁木齐",
        area_code: "6501"
    }, {
        name: "石河子",
        area_code: "659001"
    }, {
        name: "图木舒克",
        area_code: "659003"
    }, {
        name: "五家渠",
        area_code: "659004"
    }, {
        name: "昌吉",
        area_code: "6523"
    }, {
        name: "吐鲁番",
        area_code: "6521"
    }, {
        name: "库尔勒",
        area_code: "6528"
    }, {
        name: "阿拉尔",
        area_code: "659002"
    }, {
        name: "阿克苏",
        area_code: "6529"
    }, {
        name: "喀什",
        area_code: "6531"
    }, {
        name: "伊宁",
        area_code: "6540"
    }, {
        name: "塔城",
        area_code: "6542"
    }, {
        name: "哈密",
        area_code: "6522"
    }, {
        name: "和田",
        area_code: "6532"
    }, {
        name: "阿勒泰",
        area_code: "6543"
    }, {
        name: "阿图什",
        area_code: "6530"
    }, {
        name: "博乐",
        area_code: "6527"
    }, {
        name: "克拉玛依",
        area_code: "6502"
    }]
}, {
    name: "西藏",
    code: "XZ",
    area_code: "54",
    city: [{
        name: "拉萨",
        area_code: "5401"
    }, {
        name: "山南",
        area_code: "5422"
    }, {
        name: "阿里",
        area_code: "5425"
    }, {
        name: "昌都",
        area_code: "5421"
    }, {
        name: "那曲",
        area_code: "5424"
    }, {
        name: "日喀则",
        area_code: "5402"
    }, {
        name: "林芝",
        area_code: "5426"
    }]
}, {
    name: "云南",
    code: "YN",
    area_code: "53",
    city: [{
        name: "昆明",
        area_code: "5301"
    }, {
        name: "红河",
        area_code: "5325"
    }, {
        name: "文山",
        area_code: "5326"
    }, {
        name: "玉溪",
        area_code: "5304"
    }, {
        name: "楚雄",
        area_code: "5323"
    }, {
        name: "普洱",
        area_code: "5308"
    }, {
        name: "昭通",
        area_code: "5306"
    }, {
        name: "临沧",
        area_code: "5309"
    }, {
        name: "怒江",
        area_code: "5333"
    }, {
        name: "香格里拉",
        area_code: "5334"
    }, {
        name: "丽江",
        area_code: "5307"
    }, {
        name: "德宏",
        area_code: "5331"
    }, {
        name: "景洪",
        area_code: "5328"
    }, {
        name: "大理",
        area_code: "5329"
    }, {
        name: "曲靖",
        area_code: "5303"
    }, {
        name: "保山",
        area_code: "5305"
    }]
}, {
    name: "浙江",
    code: "ZJ",
    area_code: "33",
    city: [{
        name: "杭州",
        area_code: "3301"
    }, {
        name: "舟山",
        area_code: "3309"
    }, {
        name: "湖州",
        area_code: "3305"
    }, {
        name: "嘉兴",
        area_code: "3304"
    }, {
        name: "金华",
        area_code: "3307"
    }, {
        name: "绍兴",
        area_code: "3306"
    }, {
        name: "台州",
        area_code: "3310"
    }, {
        name: "温州",
        area_code: "3303"
    }, {
        name: "丽水",
        area_code: "3311"
    }, {
        name: "衢州",
        area_code: "3308"
    }, {
        name: "宁波",
        area_code: "3302"
    }]
}];
!function(a) {
    "use strict";
    function b(a) {
        this._obj = a
    }
    function c(a) {
        var c = this;
        new b(a)._each(function(a, b) {
            c[a] = b
        })
    }
    if ("undefined" == typeof a)
        throw new Error("Geetest requires browser environment");
    var d = a.document
      , e = a.Math
      , f = d.getElementsByTagName("head")[0];
    b.prototype = {
        _each: function(a) {
            var b = this._obj;
            for (var c in b)
                b.hasOwnProperty(c) && a(c, b[c]);
            return this
        }
    },
    c.prototype = {
        api_server: "api.geetest.com",
        protocol: "http://",
        typePath: "/gettype.php",
        fallback_config: {
            slide: {
                static_servers: ["static.geetest.com", "dn-staticdown.qbox.me"],
                type: "slide",
                slide: "/static/js/geetest.0.0.0.js"
            },
            fullpage: {
                static_servers: ["static.geetest.com", "dn-staticdown.qbox.me"],
                type: "fullpage",
                fullpage: "/static/js/fullpage.0.0.0.js"
            }
        },
        _get_fallback_config: function() {
            var a = this;
            return h(a.type) ? a.fallback_config[a.type] : a.new_captcha ? a.fallback_config.fullpage : a.fallback_config.slide
        },
        _extend: function(a) {
            var c = this;
            new b(a)._each(function(a, b) {
                c[a] = b
            })
        }
    };
    var g = function(a) {
        return "number" == typeof a
    }
      , h = function(a) {
        return "string" == typeof a
    }
      , i = function(a) {
        return "boolean" == typeof a
    }
      , j = function(a) {
        return "object" == typeof a && null !== a
    }
      , k = function(a) {
        return "function" == typeof a
    }
      , l = {}
      , m = {}
      , n = function() {
        return parseInt(1e4 * e.random()) + (new Date).valueOf()
    }
      , o = function(a, b) {
        var c = d.createElement("script");
        c.charset = "UTF-8",
        c.async = !0,
        c.onerror = function() {
            b(!0)
        }
        ;
        var e = !1;
        c.onload = c.onreadystatechange = function() {
            e || c.readyState && "loaded" !== c.readyState && "complete" !== c.readyState || (e = !0,
            setTimeout(function() {
                b(!1)
            }, 0))
        }
        ,
        c.src = a,
        f.appendChild(c)
    }
      , p = function(a) {
        return a.replace(/^https?:\/\/|\/$/g, "")
    }
      , q = function(a) {
        return a = a.replace(/\/+/g, "/"),
        0 !== a.indexOf("/") && (a = "/" + a),
        a
    }
      , r = function(a) {
        if (!a)
            return "";
        var c = "?";
        return new b(a)._each(function(a, b) {
            (h(b) || g(b) || i(b)) && (c = c + encodeURIComponent(a) + "=" + encodeURIComponent(b) + "&")
        }),
        "?" === c && (c = ""),
        c.replace(/&$/, "")
    }
      , s = function(a, b, c, d) {
        b = p(b);
        var e = q(c) + r(d);
        return b && (e = a + b + e),
        e
    }
      , t = function(a, b, c, d, e) {
        var f = function(g) {
            var h = s(a, b[g], c, d);
            o(h, function(a) {
                a ? g >= b.length - 1 ? e(!0) : f(g + 1) : e(!1)
            })
        };
        f(0)
    }
      , u = function(b, c, d, e) {
        if (j(d.getLib))
            return d._extend(d.getLib),
            void e(d);
        if (d.offline)
            return void e(d._get_fallback_config());
        var f = "geetest_" + n();
        a[f] = function(b) {
            e("success" == b.status ? b.data : b.status ? d._get_fallback_config() : b),
            a[f] = void 0;
            try {
                delete a[f]
            } catch (a) {}
        }
        ,
        t(d.protocol, b, c, {
            gt: d.gt,
            callback: f
        }, function(a) {
            a && e(d._get_fallback_config())
        })
    }
      , v = function(a, b) {
        var c = {
            networkError: "网络错误",
            gtTypeError: "gt字段不是字符串类型"
        };
        if ("function" != typeof b.onError)
            throw new Error(c[a]);
        b.onError(c[a])
    }
      , w = function() {
        return a.Geetest || d.getElementById("gt_lib")
    };
    w() && (m.slide = "loaded"),
    a.initGeetest = function(b, d) {
        var e = new c(b);
        b.https ? e.protocol = "https://" : b.protocol || (e.protocol = a.location.protocol + "//"),
        "050cffef4ae57b5d5e529fea9540b0d1" !== b.gt && "3bd38408ae4af923ed36e13819b14d42" !== b.gt || (e.apiserver = "yumchina.geetest.com/",
        e.api_server = "yumchina.geetest.com"),
        j(b.getType) && e._extend(b.getType),
        u([e.api_server || e.apiserver], e.typePath, e, function(b) {
            var c = b.type
              , f = function() {
                e._extend(b),
                d(new a.Geetest(e))
            };
            l[c] = l[c] || [];
            var g = m[c] || "init";
            "init" === g ? (m[c] = "loading",
            l[c].push(f),
            t(e.protocol, b.static_servers || b.domains, b[c] || b.path, null, function(a) {
                if (a)
                    m[c] = "fail",
                    v("networkError", e);
                else {
                    m[c] = "loaded";
                    for (var b = l[c], d = 0, f = b.length; d < f; d += 1) {
                        var g = b[d];
                        k(g) && g()
                    }
                    l[c] = []
                }
            })) : "loaded" === g ? f() : "fail" === g ? v("networkError", e) : "loading" === g && l[c].push(f)
        })
    }
}(window),
function(a) {
    function b(a) {
        for (var b = a, c = b.length - 1; c >= 0; c--) {
            var d = Math.floor(Math.random() * (c + 1))
              , e = b[d];
            b[d] = b[c],
            b[c] = e
        }
        return b
    }
    function c(a, b, c) {
        sg.Model.get("/log", !1, !0).getData({
            type: b || "js",
            value: a,
            result: c ? 0 : 1
        })
    }
    function d(a, b) {
        var c, d = [], e = !1, f = function(f) {
            function g(b, f) {
                sg.Model.get(a, !1, !0).getData({
                    token: b || "",
                    csrf_token: sg.utils.cookie("csrf_token")
                }, function(b) {
                    setTimeout(function() {
                        return e = !1,
                        b.errno ? void (b.errno != -1100 && sg.Component.Notice({
                            text: b.message
                        })) : (c = b.data,
                        "/user/getUserInfo" == a && config.is_camcard && sg.router.getParam("intsig_key") && c.user_id && da(),
                        f && (c.client_id = f),
                        d.forEach(function(a) {
                            a(c)
                        }),
                        void (d = []))
                    }, 0)
                })
            }
            if (c)
                return f && f(c),
                c;
            if (f && d.push(f),
            !e)
                if (e = !0,
                b)
                    if (config.is_zdao)
                        ZDao.getUserInfo(function(a, b) {
                            b ? g(b.token, b.clientid) : g()
                        });
                    else {
                        var h = sg.utils.getUrlParam("token");
                        h ? g(h) : g()
                    }
                else
                    g()
        };
        return f.clearCache = function() {
            c = null
        }
        ,
        f
    }
    function e(a, b, c, d) {
        var e = a.parent()
          , f = e.width()
          , g = e.height();
        a.data("loaded", 1),
        sg.utils.loadImage(c, function(e, h) {
            if (!h.width)
                return void a.css({
                    width: f,
                    height: g
                }).attr("src", config.static_api + "images/img_loading_failed.png");
            var i;
            switch (b) {
            case "full":
                i = sg.utils.resizeImageFull(h.width, h.height, f, g);
                break;
            default:
                i = sg.utils.resizeImage(h.width, h.height, f, g)
            }
            a.css(i).attr("src", c),
            d && d()
        })
    }
    function f(a) {
        var b = /^[A-Za-z0-9!#$%&\'*+\/=?^_`{|}~-]+(\.[A-Za-z0-9!#$%&\'*+\/=?^_`{|}~-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.([A-Za-z]{2,})$/;
        return b.test(a) ? 1 : 0
    }
    function g(a) {
        a = a || $("#isPhone").val();
        var b = /^(((\+?0?86)|\(\+?0?86\))?0?1(3|4|5|6|7|8|9)(\d){9}|201(\d){8})$/;
        return a ? b.test(a) ? 1 : 0 : 2
    }
    function h(a) {
        var b = /^[+]{0,1}[0-9\-()]+$/;
        return a ? b.test(a) ? 1 : 0 : 2
    }
    function i(a) {
        if (!a)
            return !1;
        var b = /^((0\d{2,3}-?\d{7,8})|((\+?0?86)|\(\+?0?86\))?0?(\d+))$/;
        return b.test(a)
    }
    function j(a) {
        return (a + "").length < 13 && (a = parseInt(a) * Math.pow(10, 13 - (a + "").length)),
        new Date(a).Format("yyyy-MM-dd hh:mm")
    }
    function k(a, b) {
        var c = 864e5;
        if (a == -1)
            return "有效期：永久";
        a = (a + "").length < 13 ? parseInt(a) * Math.pow(10, 13 - (a + "").length) : parseInt(a);
        var d = new Date(a);
        return d.setHours(24, 0, 0),
        d < b ? '<span class="fc_gray">有效期：' + new Date(a).Format("yyyy-MM-dd") + "</span>" : d - b < c ? '有效期：<span class="fc_red">不足一天</span>' : d - b < 8 * c ? '有效期：<span class="fc_red">' + Math.floor((d - b) / c) + "天</span>" : "有效期：" + new Date(a).Format("yyyy-MM-dd")
    }
    function l(a, b) {
        var c = new Date(a);
        return c.setDate(c.getDate() + b),
        c
    }
    function m(a, b, c, d, e) {
        var f = a.attr("data-src");
        f && n(f, function(e, g) {
            var h, i, j, k, l = b, m = c;
            e / g > l / m ? (h = Math.min(l, e),
            i = g / e * h,
            j = m - g / e * h,
            k = l - h) : (i = Math.min(m, g),
            h = e / g * i,
            j = m - i,
            k = l - e / g * i),
            a.css({
                width: h,
                height: i,
                "margin-left": Math.max(k / 2, 0),
                "margin-top": Math.max(j / 2, 0),
                visibility: "visible"
            }),
            a.attr("src", f),
            d && d(a)
        }, function() {
            e && e(a)
        })
    }
    function n(a, b, c) {
        if (a) {
            if (ja[a] && ja[a][status])
                return void (b && b(ja[a].width, ja[a].height));
            var d = new Image;
            d.src = a,
            d.onload = function() {
                b && b(d.width, d.height),
                ja[a] = {
                    status: 1,
                    width: d.width,
                    height: d.height
                }
            }
            ,
            d.onerror = function() {
                c ? c() : b && b(d.width, d.height),
                ja[a] = {
                    status: 0,
                    width: d.width,
                    height: d.height
                }
            }
        }
    }
    function o(a, b) {
        var c = location.protocol || "http:";
        return !1 === b && (c = "http:"),
        /http(s?):/i.test(a) ? a.replace(/http(s?):/i, c) : c + "//" + a
    }
    function p(a) {
        var b = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:[-;:&=\+\$,\w]+.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;
        return b.test(a) ? 1 : 0
    }
    function q(a, b) {
        return a += "",
        new Array(b - a.length + 1).join("0") + a
    }
    function r(a) {
        (a + "").length < 13 && (a = parseInt(a) * Math.pow(10, 13 - (a + "").length));
        var b = (new Date).getTime()
          , c = b - a;
        return Math.floor(c / 864e5) ? Math.floor(c / 864e5) + "天前" : Math.floor(c / 36e5) ? Math.floor(c / 36e5) + "小时前" : "刚刚"
    }
    function s(a) {
        function b(a, b, c) {
            for (; (a + "").length < b; )
                a = c + a;
            return a
        }
        (a + "").length < 13 && (a = parseInt(a) * Math.pow(10, 13 - (a + "").length));
        var c = new Date
          , d = c.getTime() - 36e5
          , e = c.getDay() - 1;
        c.setHours(0),
        c.setMinutes(0),
        c.setSeconds(0),
        c.setMilliseconds(0),
        e == -1 && (e = 6);
        var f = c.getTime()
          , g = f - 864e5
          , h = f - 864e5 * e;
        c.setMonth(0),
        c.setDate(1);
        var i = c.getTime();
        c.setTime(a);
        var j = b(c.getMonth() + 1, 2, "0")
          , k = b(c.getDate(), 2, "0")
          , l = b(c.getHours(), 2, "0")
          , m = b(c.getMinutes(), 2, "0");
        if (a >= d)
            return "刚刚";
        if (a >= f)
            return l + ":" + m;
        if (a >= g)
            return "昨天";
        if (!(a >= h))
            return a >= i ? j + "-" + k : c.getFullYear() + "-" + j + "-" + k;
        switch (c.getDay()) {
        case 0:
            return "星期天";
        case 1:
            return "星期一";
        case 2:
            return "星期二";
        case 3:
            return "星期三";
        case 4:
            return "星期四";
        case 5:
            return "星期五";
        case 6:
            return "星期六";
        default:
            return j + "-" + k
        }
    }
    function t(a) {
        if (!a)
            return "";
        a = parseInt(a),
        (a + "").length < 13 && (a = parseInt(a) * Math.pow(10, 13 - (a + "").length));
        var b = (new Date,
        new Date)
          , c = new Date(a)
          , d = "";
        b.setHours(24),
        b.setMinutes(0),
        b.setSeconds(0);
        var e = b.getTime() - 864e5 * (b.getDay() || 7)
          , f = b.getTime() - 864e5;
        if (a > f)
            d = q(c.getHours(), 2) + ":" + q(c.getMinutes(), 2);
        else if (a > e) {
            var g = c.getDay();
            switch (g) {
            case 0:
                d = "星期天";
                break;
            case 1:
                d = "星期一";
                break;
            case 2:
                d = "星期二";
                break;
            case 3:
                d = "星期三";
                break;
            case 4:
                d = "星期四";
                break;
            case 5:
                d = "星期五";
                break;
            case 6:
                d = "星期六"
            }
        } else
            d = c.getFullYear() + "-" + q(c.getMonth() + 1, 2) + "-" + q(c.getDate(), 2);
        return d
    }
    function u(a) {
        if (!a)
            return "";
        a = 1e3 * parseInt(a);
        var b = new Date(a)
          , c = "";
        return c = b.getFullYear() + "/" + q(b.getMonth() + 1, 2) + "/" + q(b.getDate(), 2)
    }
    function v(a, b, c, d, e) {
        if ($.isFunction(e) || (e = function(a, b) {
            sg.Component.Notice({
                text: b
            })
        }
        ),
        $.isFunction(d) || (d = function() {
            sg.Component.Notice({
                text: "验证成功",
                type: 1
            })
        }
        ),
        b) {
            if (!a || !g(a))
                return e(-1, "请输入正确的手机号");
            if (!c)
                return e(-2, "请输入验证码")
        } else
            b = "login";
        var f = sg.Model.get("/user/verifyvcode", !1, "POST", 1);
        f.getData({
            type: "mobile",
            contact: a,
            reason: b,
            vcode: c
        }, function(a) {
            if (a.data && a.data.token)
                return d(a.data.token);
            var b = {
                101: "服务器暂时不可用,请稍后再试",
                102: "该手机号未注册",
                107: "验证码不正确",
                113: "验证码输入次数太多,请稍后再试",
                207: "服务器暂时不可用，请稍后再试"
            };
            return a.msg = b[parseInt(a.errno)] || a.message || "服务器暂时不可用,请稍后再试",
            e(a.errno, a.msg)
        })
    }
    function w(a) {
        var b, c = {
            phone: {
                rex: /(([0-9]{2,4}-)?[0-9]{5,})/g,
                link: "tel:"
            },
            mail: {
                rex: /([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/g,
                link: "mailto:"
            },
            url: {
                rex: /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|\&|-)+)/g,
                link: ""
            }
        };
        for (b in c) {
            var d = a.match(c[b].rex);
            if (d)
                for (var e = 0, f = d.length; e < f; e++)
                    a = "phone" == b ? a.replace(d[e], '<a class="link ' + b + '" href="' + c[b].link + d[e].replace("-", "") + '" data-stat-key="link_phone">' + d[e] + "</a>") : a.replace(d[e], '<a class="link ' + b + '" href="' + c[b].link + d[e] + '" data-stat-key="link_mail">' + d[e] + "</a>")
        }
        return a
    }
    function x(a) {
        var b = [{
            name: "注册资本",
            field: "reg_capi",
            type: "select",
            mode: "102",
            items: [{
                key: "0.0001,9.9999",
                value: "少于10万元"
            }, {
                key: "10,50",
                value: "10-50万人民币"
            }, {
                key: "50,100",
                value: "50-100万人民币"
            }, {
                key: "100,500",
                value: "100-500万人民币"
            }, {
                key: "500,1000",
                value: "500-1000万人民币"
            }, {
                key: "1000.0001,",
                value: "超过1000万元"
            }]
        }, {
            name: "企业规模",
            field: "employee_count",
            type: "select",
            mode: "102",
            items: [{
                key: "1,4",
                value: "1-5人"
            }, {
                key: "5,10",
                value: "5-10人"
            }, {
                key: "10,50",
                value: "10-50人"
            }, {
                key: "50,100",
                value: "50-100人"
            }, {
                key: "100,200",
                value: "100-200人"
            }, {
                key: "200,300",
                value: "200-300人"
            }, {
                key: "300,500",
                value: "300-500人"
            }, {
                key: "500,1000",
                value: "500-1000人"
            }, {
                key: "1001,",
                value: "超过1000人"
            }]
        }, {
            name: "成立时间",
            field: "start_date",
            type: "select",
            mode: "102",
            items: [{
                key: "1",
                value: "少于1年"
            }, {
                key: "2",
                value: "1年"
            }, {
                key: "3",
                value: "2年"
            }, {
                key: "4",
                value: "3年"
            }, {
                key: "5",
                value: "4~5年"
            }, {
                key: "6",
                value: "5~10年"
            }, {
                key: "7",
                value: "10~15年"
            }, {
                key: "8",
                value: "超过15年"
            }]
        }, {
            name: "企业类型",
            field: "company_type",
            type: "select",
            mode: "101",
            items: ["国有、集体、联营、股份合作企业", "有限责任公司", "股份有限公司", "私营企业", "港、澳、台商投资企业", "外商投资企业", "其他企业"]
        }, {
            name: "公司人员扩张速度",
            field: "recruit_count",
            type: "select",
            mode: "102",
            items: [{
                key: "21,",
                value: "快"
            }, {
                key: "6,20",
                value: "一般"
            }, {
                key: "1,5",
                value: "慢"
            }]
        }, {
            name: "有商标",
            field: "trademark_switch",
            type: "switch",
            mode: "301"
        }, {
            name: "有域名",
            field: "domain_name_switch",
            type: "switch",
            mode: "301"
        }, {
            name: "有新闻",
            field: "news_switch",
            type: "switch",
            mode: "301"
        }, {
            name: "有专利",
            field: "patent_switch",
            type: "switch",
            mode: "301"
        }, {
            name: "有对外投资",
            field: "invest_switch",
            type: "switch",
            mode: "301"
        }, {
            name: "有著作权",
            field: "copyright_switch",
            type: "switch",
            mode: "301"
        }, {
            name: "可私信的公司",
            field: "pl_switch",
            type: "switch",
            mode: "303"
        }, {
            name: "有联系方式的公司",
            field: "tel_switch",
            type: "switch",
            mode: "303"
        }, {
            name: "未浏览过的公司",
            field: "viewed_switch",
            type: "switch",
            mode: "302"
        }];
        if (a)
            for (var c in b)
                if (a == b[c].field)
                    return b[c];
        return b
    }
    function y(a, b, c, d, e, f) {
        function g(a) {
            la = a.province || "",
            ma = a.cityCode || "",
            na = a.areaName || "";
            var b, c = "", d = 0, e = !la && !ma && !na, f = '<div class="select_normal border_bottom click_item ' + (e ? "checked" : "") + '">不限区域</div><div class="select_left_column scroll_y">';
            if (city_list) {
                for (var g in city_list) {
                    var h = "";
                    if (!(city_list[g].city.length <= 1) && (e ? "0" == g && (h = "selected") : b || !city_list[g].area_code || la != city_list[g].code && 0 != ("" + ma).indexOf(city_list[g].area_code) && city_list[g].name != na || (city_list[g].name == na && (la = city_list[g].code,
                    b = 1),
                    la == city_list[g].code && (na = city_list[g].name,
                    b = 1),
                    h = "selected"),
                    city_list[g].city.length)) {
                        var i = city_list[g].city
                          , j = !(la != city_list[g].code || ma || na && na != city_list[g].name)
                          , k = ""
                          , l = "";
                        0 != g && (l += '<div class="select_item click_item ' + (j ? "checked" : "") + '" data-code="">不限城市</div>');
                        for (var m in i) {
                            var n = i[m].area_code == ma || i[m].area_code == la || i[m].name == na;
                            n && !d && (na = i[m].name,
                            isNaN(i[m].area_code) && !city_list[g].code ? la = i[m].area_code : ma = i[m].area_code,
                            d++,
                            b = k = 1),
                            l += '<div class="select_item click_item ' + (n ? "checked" : "") + '" data-code="' + i[m].area_code + '">' + i[m].name + "</div>"
                        }
                        c += '<div class="select_item_wrapper ' + (j || k && "1" == d ? "selected" : "") + '" data-code="' + (city_list[g].code || "hot") + '" data-name="' + city_list[g].name + '">' + l + "</div>",
                        k && (h = "selected"),
                        f += '<div class="select_item click_item ' + h + '" data-code="' + (city_list[g].code || "hot") + '">' + city_list[g].name + "</div>"
                    }
                }
                return f += '</div><div class="select_right_column scroll_y">' + c + "</div>",
                {
                    str: f,
                    is_find: b
                }
            }
        }
        function h(a) {
            if (industry_list) {
                oa = a.industryCode || "",
                pa = a.industryName || "";
                var b, c = !oa && !pa, d = '<div class="select_left_column scroll_y">', e = "", f = "", g = {};
                for (var h in industry_list) {
                    var i = ""
                      , j = h.length % 2 == 1 ? "B0" + h : "B" + h;
                    if (c ? "1" == h && (i = "selected",
                    f = j) : !b && 0 == oa.indexOf(j) && h.length <= 2 && (i = "selected",
                    f = j),
                    h.length <= 2)
                        g[j] = {
                            name: industry_list[h],
                            check: ""
                        },
                        d += '<div class="select_item click_item ' + i + '"data-code="' + j + '">' + industry_list[h] + "</div>";
                    else {
                        if (!(h.length < 5))
                            break;
                        var k = ""
                          , l = f && 0 == j.indexOf(f)
                          , m = j.substr(0, 3);
                        g.hasOwnProperty(m) && !g[m].check && (m == oa && (k = "checked",
                        pa = g[m].name,
                        b = 1),
                        e += '<div class="select_item child_item click_item ' + (l ? "show " : "") + k + '" data-code="' + m + '" data-name="' + g[m].name + '">全部分类</div>',
                        g[m].check = 1,
                        k = ""),
                        j == oa && (pa = industry_list[h],
                        k = "checked",
                        b = 1),
                        e += '<div class="select_item child_item click_item ' + (l ? "show " : "") + k + '" data-code="' + j + '">' + industry_list[h] + "</div>"
                    }
                }
                return d = '<div class="select_normal border_bottom click_item ' + (c ? "checked" : "") + '">不限行业</div>' + d + '</div><div class="select_right_column scroll_y">' + e + "</div>",
                {
                    str: d,
                    is_find: b
                }
            }
        }
        function i() {
            var a = n.find(".click_item");
            a.bind("click", function() {
                var c = $(this)
                  , d = c.parent()
                  , e = c.attr("data-code");
                if (Log.trace("select_city_srea", {
                    city_name: $(this).text()
                }),
                c.hasClass("select_normal")) {
                    var f = n.find(".select_left_column").find(".click_item").first();
                    "city" == b ? na = ma = la = "" : oa = pa = "",
                    a.removeClass("checked"),
                    f.trigger("click"),
                    void 0 != typeof FastClick && FastClick.notNeeded(document.body) === !1 && f.trigger("click"),
                    c.addClass("checked"),
                    j("select")
                } else if (d.hasClass("select_item_wrapper") || d.hasClass("select_right_column")) {
                    if (a.removeClass("checked"),
                    "city" == b)
                        ma = la = "",
                        isNaN(e) ? la = e : ma = e,
                        na = c.text(),
                        ma || la || (la = c.parent().attr("data-code"),
                        na = c.parent().attr("data-name"));
                    else {
                        var g = c.attr("data-name");
                        pa = g ? g : c.text(),
                        oa = e || ""
                    }
                    c.addClass("checked"),
                    j("select")
                } else {
                    var h;
                    h = "city" == b ? n.find(".select_item_wrapper") : n.find(".child_item"),
                    n.find(".click_item").removeClass("selected"),
                    c.addClass("selected"),
                    h.each(function() {
                        var a = $(this);
                        "city" == b && a.attr("data-code") == e ? a.show() : 0 == a.attr("data-code").indexOf(e) ? a.show() : a.hide()
                    })
                }
            })
        }
        function j(b, c) {
            n.is(":visible") && (n.removeClass("show"),
            !c && f && f.call(n, b),
            setTimeout(function() {
                a && n.hide()
            }, 400))
        }
        function k() {
            $(".select_box").each(function() {
                var a = $(this);
                a.hasClass(m) || a.hide().removeClass("show")
            })
        }
        var l, b, m, n;
        return a && (l = a.attr("data-select-index"),
        b = a.attr("data-type") || b),
        l ? n = $(".select_box" + l) : (a && a.attr("data-select-index", ka),
        l = ka,
        ka++),
        m = "select_box" + l,
        config.show_download_banner && (m += " enlarge_district_bottom"),
        c ? (n = '<div class="select_box ' + m + '">',
        n += '<div class="select_mask"></div>') : n = '<div class="select_box select_fly ' + m + '">',
        "city" == b ? n += '<div class="select_content">' + g(d).str + "</div></div>" : "industry" == b ? n += '<div class="select_content">' + h(d).str + "</div></div>" : n = $(n + sg.View.require("template_advance_search").render({
            data: d,
            filter: x()
        }) + "</div>").addClass(m),
        n = $(n).appendTo(sg.router.current ? sg.router.current.$dom : $("body")),
        n = $.extend(n, {
            getData: function() {
                return {
                    cityCode: ma,
                    province: la,
                    industryCode: oa,
                    areaName: na,
                    industryName: pa
                }
            },
            closeSelect: j,
            updateSelect: function(a, c, d) {
                var e;
                return c && (n = $(".select_box" + c.attr("data-select-index")),
                b = c.attr("data-type")),
                "city" == b ? (e = g(a),
                n.find(".select_content").html(e.str)) : "industry" == b && (e = h(a),
                n.find(".select_content").html(e.str)),
                i(),
                e && !e.is_find && (n.find(".select_normal").trigger("click"),
                void 0 != typeof FastClick && FastClick.notNeeded(document.body) === !1 && n.find(".select_normal").trigger("click")),
                f && f.call(n, d || "select"),
                n
            }
        }),
        f && f.call(n, "ready"),
        a ? a.unbind("click").bind("click", function() {
            n.hasClass("show") ? j() : (k(),
            n.show().height(),
            n.addClass("show"),
            e && e.call(n))
        }) : n.removeClass("select_fly").show().addClass("show"),
        n.find(".select_mask").unbind().bind("click", function() {
            j()
        }),
        i(),
        n
    }
    function z(a, b, c, d, e) {
        function f() {
            var a = n.scrollTop();
            if (a == i) {
                var b = m.outerHeight();
                j.each(function(a) {
                    var d = $(this)
                      , e = d.offset().top
                      , f = d.outerHeight(!0)
                      , i = d.find("." + c);
                    if (0 == a && e - g >= 0)
                        return m.hide(),
                        !1;
                    if (e - g <= 0 && e - g + f > 0) {
                        var j = e - g + f - b;
                        return j < 0 && i.length ? (m[0].className = i[0].className + " fixed_title border_bottom",
                        m.css({
                            webkitTransform: "translate3d(0, " + j + "px ,0)",
                            transform: "translate3d(0, " + j + "px ,0)"
                        }).show().html(i.html()),
                        !1) : (i.length ? (m[0].className = i[0].className + " fixed_title border_bottom",
                        m.css({
                            webkitTransform: "translate3d(0, 0 ,0)",
                            transform: "translate3d(0, 0 ,0)"
                        }).show().html(i.html())) : m.hide(),
                        h = a,
                        !1)
                    }
                })
            }
            a < 0 && m.hide()
        }
        "string" == typeof a && (a = $(a));
        var g, h, i = a.scrollTop(), j = a.find("." + b), k = a.find("." + c), l = j.parent().offset().top;
        if (j.length && k.length) {
            var m = $('<div class="' + k.first()[0].className + ' fixed_title border_bottom"></div>');
            m.css($.extend({
                position: "absolute",
                top: 0,
                width: "100%",
                height: k.first().outerHeight() + 1,
                boxSizing: "border-box",
                zIndex: "10"
            }, d || {}));
            var n;
            "body" != a.selector ? (n = a,
            m.insertBefore(a).hide()) : (n = $(window),
            m.appendTo(sg.router.current.$dom).hide());
            var o;
            o = "undefined" == typeof requestAnimationFrame ? function(a) {
                setTimeout(function() {
                    a()
                }, 1e3 / 60)
            }
            : requestAnimationFrame,
            n.bind("scroll", function() {
                g = "body" != a.selector ? a.offset().top : n.scrollTop() + l,
                i = n.scrollTop(),
                o(f)
            }),
            m.bind("click", function(a) {
                if (void 0 != h) {
                    if ("function" == typeof e)
                        return void e.call($(this), a);
                    var b = j.eq(h)
                      , d = b.offset().top;
                    n.scrollTop(i - g + d),
                    b.find("." + c).trigger("click")
                }
            })
        }
    }
    function A(a) {
        sg.Component.Notice({
            text: a || "服务器繁忙，请稍后再试"
        })
    }
    function B(a, b) {
        J() && localStorage.setItem(a, b)
    }
    function C(a) {
        if (J())
            return localStorage.getItem(a)
    }
    function D(a, b, c) {
        if (J() && b) {
            c = c || 1;
            var d = E(a) || [];
            d.indexOf(b) != -1 && d.splice(d.indexOf(b), 1),
            d.unshift(b),
            d.length > c && d.pop(),
            localStorage.setItem(a, JSON.stringify(d))
        }
    }
    function E(a) {
        if (!J())
            return [];
        var b = localStorage.getItem(a);
        return b = b ? JSON.parse(b) : []
    }
    function F(a) {
        var b = document.createElement("div");
        return b.innerHTML = a,
        b.innerText
    }
    function G(a, b) {
        var c;
        return c = b ? /[\u4E00-\u9FA5]/ : /^[\u4E00-\u9FA5 || \u0030-\u0039 || \uff10-\uff19 || \u0029 || \u0028 || \uff09 || \uff08 || \uff1a || \u003a]+$/,
        c.test(a)
    }
    function H(a) {
        var b = "限时免费开通认证会员，即可使用该功能<br/>锁定对口部门，私信直达决策人";
        "edit" == a && (b = "认证职业身份，即可编辑企业信息！更享多项会员特权！"),
        sg.Component.Alert({
            title: "1分钟完成职业身份认证",
            html: b,
            btnCancel: {
                text: "更多特权",
                callback: function() {
                    return sg.router.redirect("/claim/benefits"),
                    !0
                }
            },
            btnConfirm: {
                text: "免费认证",
                callback: function() {
                    return sg.router.redirect("/claim/choose_method"),
                    !0
                }
            }
        })
    }
    function I(a, b, c, d, e) {
        !qa && a && (qa = !0,
        sg.Model.get("/im/checkMsgAble", !1, !0).getData(a, function(f) {
            function g() {
                var a = 0;
                if (0 != f.statue && 2 != f.statue || (a = 1),
                0 == f.whole_remainder && 0 == f.gcoin_remainder) {
                    Log.page("no_sixin", {
                        VIP: a,
                        from: "message_edit"
                    });
                    var b = sg.Component.Dialog({
                        vm: sg.View.require("dialog_primsg_limit"),
                        dialogClass: "bs_dialog",
                        contentClass: "sg_animate move_y in dialog_primsg_limit" + (a ? " is_vip" : ""),
                        verticalMiddle: !0
                    });
                    return b.$dom.find("#btn_buy_primsg").on("click", function() {
                        Log.action("click_buy_sixin"),
                        sg.router.redirect("/qi/buy_product", {
                            type: "primsg"
                        })
                    }),
                    b.$dom.find("#btn_buy_vip").on("click", function() {
                        Log.action("click_go2vip"),
                        sg.router.redirect("/qi/buy_product", {
                            type: "vip"
                        })
                    }),
                    b.$dom.find("#btn_share").on("click", function() {
                        Log.action("click_go2share"),
                        sg.router.redirect("/qi/daily_share")
                    }),
                    b.$dom.find("#btn_get_more").on("click", function() {
                        Log.action("click_more_coin"),
                        sg.router.redirect("/reward/earn_coin")
                    }),
                    b.show(),
                    e && e(),
                    !1
                }
                if ("0" == f.remainder) {
                    a ? Log.trace("sixin_daily_verify") : Log.trace("sixin_daily_VIP");
                    var b = sg.Component.Dialog({
                        vm: sg.View.require("dialog_today_primsg_limit"),
                        vm_data: $.extend({}, f, {
                            is_vip: a
                        }),
                        dialogClass: "bs_dialog",
                        contentClass: "sg_animate move_y in dialog_today_primsg_limit",
                        verticalMiddle: !0,
                        closeBtn: !1
                    });
                    return b.$dom.find(".btn_use_tomorrow, .btn_use_tomorrow_vip").on("click", function() {
                        b.hide()
                    }),
                    b.$dom.find(".btn_open_vip").on("click", function() {
                        Log.action("click_go2vip"),
                        sg.router.redirect("/qi/pay_privilege")
                    }),
                    b.show(),
                    e && e(),
                    !1
                }
                return !0
            }
            qa = !1;
            var h = {
                602: "当日操作量已达上限，无法发送请求",
                604: "你被对方设置到了黑名单, 无法发送请求",
                605: "你把对方设置到了黑名单, 无法发送请求",
                608: "当前用户已被举报，无法发送请求"
            };
            if (f.errno || !f.data) {
                if ("603" == f.errno)
                    return H(),
                    void (e && e());
                var i = h[f.errno] || f.message || "服务器繁忙，请稍后再试";
                return "2" == f.errno ? (sg.router.redirect("/user/login", {
                    redirect: location.pathname + location.search
                }),
                void (e && e())) : (sg.Component.Notice({
                    text: i
                }),
                void (e && e()))
            }
            f = f.data,
            b ? g() && c && c(f) : sg.Model.get("/im/getSessionId", !1, !0).getData({
                cp_id: a.to_cpid
            }, function(b) {
                if (b.errno || !b.data)
                    return e && e(),
                    A();
                var f = b.data.session_id;
                if (f)
                    return sg.router.redirect("/im/chat?session_id=" + f + "&cpid=" + a.to_cpid + "&type=1", {}, d);
                if ("/message/edit" !== sg.router.current.pathName) {
                    if (g())
                        return sg.router.redirect("/message/edit?cpid=" + a.to_cpid + "&utype=" + a.recver_type + "&uncheck=1", {}, d)
                } else
                    g() && c && c(b)
            })
        }))
    }
    function J() {
        if (void 0 !== ia)
            return ia;
        var a = "test"
          , b = window.localStorage;
        try {
            b.setItem(a, "testValue"),
            b.removeItem(a),
            ia = !0
        } catch (a) {
            ia = !1
        }
        return ia
    }
    function K(a, b) {
        ra.set(a, b)
    }
    function L(a) {
        return ra.get(a)
    }
    function M(a) {
        return !a.accounts || !a.accounts.filter(function(a) {
            return a.pwd_status && 1 == a.type
        }).length
    }
    function N(a) {
        return !!a && new Date(a).getFullYear() + "年"
    }
    function O(a) {
        return a ? (a = a.replace(/<em>/gi, "%em%").replace(/<\/em>/gi, "%/em%"),
        a = a.replace(/</gi, "&lt;").replace(/>/gi, "&gt;"),
        a = a.replace(/%em%/gi, "<em>").replace(/%\/em%/gi, "</em>")) : ""
    }
    function P() {
        var a = "https://www.mikecrm.com/8mkNhN";
        config.is_zdao ? ZDao.jump({
            url: "zdao://zdinter/report"
        }, function(b, c) {
            c || ZDao.jump({
                url: a
            })
        }) : window.open(a)
    }
    function Q(a) {
        for (var b = a.length, c = 0; b--; )
            (a.charCodeAt(b) > 127 || 94 == a.charCodeAt(b)) && c++,
            c++;
        return c
    }
    function R(a, b, c, d) {
        if (!config.is_zdao) {
            /^zdao:\/\//i.test(a) || (a = sg.utils.addUrlParam("zdao://zd/openweb", {
                url: window.encodeURIComponent(a || location.href),
                share_enable: b || 1,
                need_login: c || 1
            }));
            var e = navigator.userAgent;
            (/android/i.test(e) && /chrome/i.test(e) || /ios|iphone/i.test(e)) && (d = 1),
            d ? location.href = a : $('<iframe style="display:none"></iframe>').appendTo($("body")).attr("src", a)
        }
    }
    function S(a) {
        return a && parseInt(a) > 999 ? "999+" : a
    }
    function T(a, b) {
        sg.Component.Alert({
            title: a.title || "使用" + config.productName,
            html: a.text || "该功能现由" + config.productName + "APP提供，下载" + config.productName + "即可使用。",
            btnCancel: {
                text: "取消"
            },
            btnConfirm: {
                text: a.btn || "立即使用",
                callback: function() {
                    return a.title ? Log.action("click_show_private_msg_download_confirm") : Log.action("click_show_person_detail_download_confirm"),
                    config.is_camcard ? U(location.href + "&from=ccqipage&share_enable=1&need_login=1") : location.href = "/download?channel=ccqipage",
                    b && b(),
                    !0
                }
            }
        })
    }
    function U(a) {
        CCJSAPI.getVersion() && CCJSAPI.getVersion() >= 13 ? CCJSAPI.has_zdao({
            data: {},
            closeWeb: 0
        }, function(b) {
            b && 1 == b.ret ? a ? location.href = "zdao://zd/openweb?url=" + encodeURIComponent(a) : location.href = "zdao://zd/main" : location.href = "/download?channel=ccqipage"
        }) : location.href = "/download?channel=ccqipage"
    }
    function V() {
        return !!config.is_android && (ua >= 4 && ua < 6 && ea(config.zdao_version, "1.4.0") >= 0)
    }
    function W(a) {
        return a.is_login || (config.is_camcard || config.is_weixin) && a.user_id
    }
    function X(a) {
        a = a || 32;
        for (var b = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678", c = b.length, d = "", e = 0; e < a; e++)
            d += b.charAt(Math.floor(Math.random() * c));
        return d
    }
    function Y(a, b) {
        var c = new RegExp("&?" + b + "=[^&]*");
        return a = a.replace(c, ""),
        a = a.replace("?&", "?")
    }
    function Z() {
        $("img[sg-src]").each(function() {
            var a = $(this)
              , b = a.parent()
              , c = (b.height(),
            a.attr("sg-src"))
              , d = a.attr("sg-src-type");
            a.data("loaded") || $(window).scrollTop() > a.offset().top - $(window).height() && $(window).scrollTop() < a.offset().top + a.outerHeight() && e(a, d, c, function() {
                b.hasClass("default_cp_logo") && b.removeClass("default_cp_logo")
            })
        })
    }
    function _(a) {
        for (var b = a.length, c = "", d = 0, e = d + 4; e <= b; )
            c += a.slice(d, e) + " ",
            d = e,
            e = d + 4;
        return c += a.slice(d)
    }
    function aa(a, b) {
        sg.Model.get("/account/getComplainInfo", !1, "POST").getData(function(c) {
            if (c.data && c.data.limit_time) {
                var d = new Date(1e3 * parseInt(c.data.limit_time))
                  , e = d.getMonth() + 1
                  , f = d.getDate()
                  , g = d.getFullYear();
                2 != (e + "").length && (e = "0" + e),
                2 != (f + "").length && (f = "0" + f),
                g += "-" + e + "-" + f,
                sg.Component.Alert({
                    text: "你被其他用户多次举报，暂时无法使用该功能。功能恢复时间：" + g,
                    title: "功能受限",
                    btnCancel: !1,
                    btnConfirm: {
                        text: "我知道了"
                    }
                }),
                b && b()
            } else
                $.isFunction(a) && a()
        })
    }
    function ba(b) {
        a.verify_lock || (a.verify_lock = !0,
        $.post("/captcha/init", {
            csrf_token: sg.utils.cookie("csrf_token")
        }, function(c) {
            a.gee_dialog ? (a.gee_dialog.refresh(),
            $(".sg_dialog_mask").bind("click", function() {
                a.verify_lock = !1
            })) : (a.gee_dialog = sg.Component.Dialog({
                $parent: $("body"),
                vm: sg.View.require("geetest_dialog_template"),
                contentClass: "sg_animate move_y in",
                closeBtn: !1
            }),
            $(".sg_dialog_mask").bind("click", function() {
                a.verify_lock = !1
            })),
            initGeetest({
                gt: c.data.gt,
                challenge: c.data.challenge,
                product: "embed",
                https: !0,
                offline: !c.data.success
            }, function(c) {
                c.onSuccess(function() {
                    var d = c.getValidate();
                    b && b(JSON.stringify(d)),
                    a.verify_lock = !1
                }),
                c.appendTo(a.gee_dialog.$dom.find("#geetest_dialog")),
                a.gee_dialog.show()
            })
        }))
    }
    function ca(a, b) {
        ba(function(c) {
            sg.Model.get("/captcha/verify", !1, "POST").getData({
                vcode: c,
                csrf_token: sg.utils.cookie("csrf_token")
            }, function(c) {
                return c.data && 0 == c.errno ? void sg.Component.Notice({
                    text: "验证成功",
                    type: 1,
                    noticeEndCallback: a
                }) : void sg.Component.Notice({
                    text: c.msg,
                    noticeEndCallback: b
                })
            })
        })
    }
    function da() {
        config.is_zdao && ea(config.zdao_version, "2.4.0") >= 0 ? ZDao.back() : history.go(-1)
    }
    function ea(a, b) {
        a || (a = "0.0.0"),
        b || (b = "0.0.0");
        var c = a.split(".")
          , d = parseInt(c[0]) || 0
          , e = parseInt(c[1]) || 0
          , f = parseInt(c[2]) || 0
          , g = b.split(".")
          , h = parseInt(g[0]) || 0
          , i = parseInt(g[1]) || 0
          , j = parseInt(g[2]) || 0;
        return d > h ? 1 : d < h ? -1 : e > i ? 1 : e < i ? -1 : f > j ? 1 : f < j ? -1 : 0
    }
    function fa(a, b) {
        "/front_monitor" != a && sg.Model.get("/front_monitor", !1, !0).getData({
            api: a,
            errno: b
        })
    }
    function ga(a) {
        if ("string" != typeof a || !a.length)
            return a;
        var b = document.createElement("div");
        return b.innerHTML = a,
        b.innerText
    }
    function ha(a) {
        if (window.cmblsExecutor) {
            window.cmblsExecutor || {};
            window.cmblsExecutor.executeCmbls("1.0", a)
        } else
            document.addEventListener("CMBLSExecutorReady", function() {
                window.cmblsExecutor || {};
                window.cmblsExecutor.executeCmbls("1.0", a)
            }, !1)
    }
    var ia, ja = {}, ka = 1, la = "", ma = "", na = "", oa = "", pa = "", qa = !1, ra = new sg.Cache, sa = navigator.userAgent, ta = sa.indexOf("Android"), ua = parseFloat(sa.slice(ta + 8));
    a.verify_lock = !1,
    $.extend(window, {
        jumpZDao: R,
        getLength: Q,
        redirectFeedback: P,
        removeTagsWithoutEm: O,
        getYear: N,
        accountUnsafe: M,
        setCache: K,
        getCache: L,
        isStorageSupported: J,
        checkMsg: I,
        showClaimAlert: H,
        isChn: G,
        stripTags: F,
        setStorageArray: D,
        getStorageArray: E,
        setStorage: B,
        getStorage: C,
        errorNotice: A,
        fixTopBar: z,
        selectOptions: y,
        getFilterConfig: x,
        replaceContact: w,
        verifySmsVCode: v,
        parseImTime: t,
        converTime: r,
        addZero: q,
        isUrl: p,
        parseUrlFix: o,
        loadSingleImage: n,
        resetImgInBox: m,
        addDate: l,
        convertExpireTime: k,
        convertTime: j,
        isTel: i,
        isPhone: g,
        isSimplePhone: h,
        isEmail: f,
        shuffle: b,
        log: c,
        getUserInfo: d("/user/getUserInfo", !0),
        getAccountInfo: d("/account/accountinfo"),
        getClaimInfo: d("/claim/queryMemberStatus"),
        getProfileInfo: d("/user/queryProfile"),
        setImgSrc: e,
        setLimit: S,
        guideDownload: T,
        ccOpenZdao: U,
        checkAndroidUpload: V,
        parseToTime: u,
        isAuthLogin: W,
        randomString: X,
        delQueryParam: Y,
        autoLoadImage: Z,
        formStrAgain: _,
        checkComplain: aa,
        parseTime: s,
        geeVerify: ca,
        goBack: da,
        versionCompare: ea,
        monitor: fa,
        getTextFromHtml: ga,
        cmblsJSExecutor: ha
    })
}(window),
sg.View.define("vm_person_list", {
    beforeRender: function(a, b) {
        b.config = config,
        a(b)
    },
    afterRender: function(a) {
        var b = this.$parent
          , c = (b.find(".vc_main"),
        b.find(".vc_list_item"));
        getUserInfo(function(d) {
            (config.is_camcard || config.is_weixin) && (b.find(".vc_img_wrapper,.vc_item_inner").bind("click", function() {
                Log.action("click_show_person_detail_download_other"),
                guideDownload({
                    text: "使用" + config.productName + "即可查看该员工详细资料。"
                })
            }),
            b.find(".vc_send_msg").unbind().bind("click", function() {
                return !config.is_camcard && !config.is_weixin || "/company/detail" != location.pathname && "/product/detail" != location.pathname ? 1 != config.direct_type || d.is_login || "/company/detail" != location.pathname ? void 0 : void sg.Component.DownloadNotice({}) : (Log.action("click_show_private_msg_download_other"),
                void guideDownload({
                    title: "发送私信",
                    text: "私信功能现由" + config.productName + "APP提供，请使用" + config.productName + "私信联系该用户。"
                }))
            })),
            "job_seeker_list" != a.stat && c.bind("click", function(a) {
                var b = ($(a.target),
                $(this).data("cp_id"))
                  , c = $(this).data("utype");
                if (!config.is_camcard && !config.is_weixin) {
                    if (!d.is_login)
                        return void sg.router.redirect("/user/login", {
                            redirect: location.href
                        });
                    Log.action("click_" + ($(this).data("stat") || "person_contact")),
                    sg.router.redirect("/account/main?id=" + b + "&utype=" + c)
                }
            })
        })
    }
}),
sg.Component("GuideDownload", {
    properties: {
        guide_contents: shuffle(["1.8亿企业信息，千万级商业人脉", "每一家企业都能被<b>" + config.productName + "</b>", "新用户登录，立即享10条免费私信", "找客户，多达17个条件精确帮你找客户", "企业联系方式正确率，远高于行业平均水平"]),
        intervalimer: 0
    },
    template: '<div class="download_banner_wrapper flex_h {{if englarge_bottom}} englarge_bottom {{/if}}">\t\t\t\t<div class="zdao_logo_wrapper"></div>\t\t\t\t<div class="guide_content flex_item sg_animate enlarge_normal in">{{#guide_content}}</div>\t\t\t\t<a class="download_banner" data-stat-key="download_immediatly">立即下载\t\t\t\t</a>\t\t\t</div>',
    beforeRender: function(a) {
        var b = this
          , c = b.options
          , d = sg.router.current && sg.router.current.vmName
          , e = "msitepage";
        "home_index" == d && (e = "msitehome"),
        a({
            guide_content: b.guide_contents[0],
            englarge_bottom: c.englarge_bottom,
            channel: e
        }, 1)
    },
    afterRender: function() {
        var a = this
          , b = a.$parent
          , c = 0
          , d = b.find(".guide_content");
        b.find(".download_banner").bind("click", function() {
            Log.action("guide_download_content", {
                text: b.find(".guide_content").text()
            }),
            window.location.href = "/download?channel=ccseo2"
        }),
        a.intervalimer = setInterval(function() {
            c++,
            4 < c && (c = 0),
            d.html(a.guide_contents[c]),
            d.removeClass("enlarge_normal in").hide(),
            d.addClass("enlarge_normal in").show()
        }, 3e3)
    },
    destroy: function() {
        clearInterval(this.intervalimer)
    },
    options: {
        englarge_bottom: !1
    }
}),
$(function() {
    function a() {
        var a = sg.router.getParam("intsig_key") || sg.utils.cookie("auth_key")
          , b = sg.router.getParam("state");
        return a ? a : a || !b ? (location.replace(config.cc_host_name + "/internal/user/login?goback=1&back_url=" + encodeURIComponent(location.href + "&state=1")),
        !1) : void sg.Component.Notice({
            text: "App登陆失败，请稍后再试"
        })
    }
    function b() {
        var a = sg.router.getParam("code") || sg.utils.cookie("auth_key")
          , b = sg.router.getParam("state");
        if (a && !b)
            return a;
        if (a || !b) {
            if (a && b) {
                var c = delQueryParam(location.search, "state");
                return location.replace(config.hosts[b] + location.pathname + c),
                !1
            }
            return location.replace("https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd9331ee9b4f6784a&redirect_uri=" + encodeURIComponent(config.hosts.online + location.pathname + location.search) + "&response_type=code&scope=snsapi_base&state=" + config.app_info.env + "#wechat_redirect"),
            !1
        }
        sg.Component.Notice({
            text: "微信授权失败，请稍后再试"
        })
    }
    var c = {
        NOT_JOINED: 0,
        JOINED: 2,
        CHECKING: 3,
        JOIN_FAIL: 4,
        APPLIED: 1,
        COLLEAGUE_CHECKING: 5
    };
    window.CLAIM_STATUS = c;
    var d = sg.utils.getUrlParam("channel");
    d && sg.utils.cookie("channel", d);
    var e = sg.utils.getUrlParam("from")
      , f = sg.utils.getUrlParam("operate");
    +new Date;
    sg.utils.cookie("csrf_token") || sg.utils.cookie("csrf_token", randomString(24), 8760),
    sg.template.utils.productName = config.productName,
    sg.template.utils.seoProductName = config.seoProductName,
    config.is_android = /android/gi.test(navigator.userAgent),
    config.is_weixin = /micromessenger/gi.test(navigator.userAgent),
    config.is_zdao = /zdao/gi.test(navigator.userAgent),
    config.is_zdao_mj = /MJ/g.test(navigator.userAgent),
    config.is_camcard = /camcard/gi.test(navigator.userAgent),
    config.is_cmb = /cmblife/gi.test(navigator.userAgent),
    config.zdao_version = "";
    var g = navigator.userAgent.match(/zdao_(android|ios)\/(.*)/i);
    g && ("Android" == g[1] ? config.is_android_zdao = !0 : config.is_ios_zdao = !0,
    g[2] && (g = g[2].split("."),
    config.zdao_date = g.pop(),
    config.zdao_version = g.join("."))),
    config.is_android_zdao && versionCompare(config.zdao_version, "1.1.2") < 0 ? config.share_icon = "" : versionCompare(config.zdao_version, "2.0.0") < 0 ? config.share_icon = config.static_api + "images/share.png" : versionCompare(config.zdao_version, "3.4.6") < 0 ? config.share_icon = config.static_api + "images/share_20180704.png" : config.share_icon = config.static_api + "images/share_20180629.png",
    config.direct_type = 0,
    f && (config.direct_type = 2),
    config.from = e,
    config.operate = f,
    Date.prototype.Format = function(a) {
        var b = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            S: this.getMilliseconds()
        };
        /(y+)/.test(a) && (a = a.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length)));
        for (var c in b)
            new RegExp("(" + c + ")").test(a) && (a = a.replace(RegExp.$1, 1 == RegExp.$1.length ? b[c] : ("00" + b[c]).substr(("" + b[c]).length)));
        return a
    }
    ,
    String.prototype.httpHtml = function() {
        if (this.replace) {
            var a = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
            return this.replace(/</gi, "&lt;").replace(/>/gi, "&gt;").replace(a, '<a class="link" href="$1$2">$1$2</a>')
        }
    }
    ,
    $.fn.putCursorAtEnd = function() {
        return this.each(function() {
            var a = $(this)
              , b = this;
            if (b.setSelectionRange) {
                var c = 2 * a.val().length;
                setTimeout(function() {
                    b.setSelectionRange(c, c)
                }, 1)
            } else
                a.val(a.val());
            this.scrollTop = 999999
        })
    }
    ,
    window.onerror = function(a, b, c, d, e) {
        sg.router.getParam("_js_debug") || log("Url:" + location.href + ", Referrer:" + document.referrer + ", Msg:" + (a && a.replace(/\n/gi, "")) + ", Script:" + b + ", Line:" + c + ", Col:" + d + ", Stack:" + (e && e.stack && e.stack.replace(/\n/gi, "")), "js_error", !0)
    }
    ,
    config.is_zdao && $(document.body).addClass("zdao"),
    config.is_camcard && $(document.body).addClass("zdao camcard"),
    sg.Model.setSuccessCallback(function(a, b) {
        return a.errno == -8 ? (sg.Component.Notice({
            text: "页面已过期，请刷新页面!"
        }),
        !1) : a.errno === -1100 && "/captcha" !== location.pathname ? (window.noticeVerify || (window.noticeVerify = !0,
        sg.Component.Notice({
            text: "请输入验证码",
            noticeEndCallback: function() {
                geeVerify(function() {
                    window.noticeVerify = !1,
                    location.reload()
                })
            }
        })),
        !1) : void (a.errno && b && b.requestURL && monitor(b.requestURL, a.errno))
    }),
    sg.Model.setErrorCallback(function(a, b) {
        "timeout" == b ? sg.Component.Notice({
            text: "请求超时"
        }) : "offline" == b && sg.Component.Notice({
            text: "网络连接已断开"
        }),
        $("body").loadingStop(),
        $(".btn_loading_gif").removeClass("btn_loading_gif"),
        a && a.requestURL && monitor(a.requestURL, b)
    }),
    sg.Model.setCsrfKey("csrf_token"),
    require.config({
        onNodeCreated: function(a, b, c, d) {
            new RegExp("^" + config.static_api).test(d) && a.setAttribute("crossorigin", "anonymous")
        }
    }),
    sg.init(config.sg_config);
    var h = (config.is_weixin || config.is_camcard) && (location.href.indexOf("/company/") > -1 || location.href.indexOf("/product/") > -1);
    if (h) {
        if (config.is_weixin && b() === !1)
            return;
        if (config.is_camcard && a() === !1)
            return
    }
    sg.Action.set({
        "sg-redirect": {
            init: function(a) {
                a.bind("click", function() {
                    var b = a.attr("sg-redirect")
                      , c = a.attr("sg-stop-propagation")
                      , d = a.attr("data-stat-key")
                      , e = a.attr("data-stat-data");
                    if (d) {
                        var f = e ? JSON.parse(e) : null;
                        f ? Log.action("click_" + d, f) : Log.action("click_" + d)
                    }
                    if ("-1" == b ? history.length <= 1 ? sg.router.redirect("/") : goBack() : /^https?:\/\//gi.test(b) ? location.href = b : sg.router.redirect(b),
                    1 == c || d)
                        return !1
                })
            }
        },
        "sg-login": {
            init: function(a) {
                a.bind("click", function() {
                    sg.router.redirect("/user/login", {
                        redirect: location.href
                    }, !0)
                })
            }
        },
        "sg-src": {
            init: function(a) {
                autoLoadImage()
            }
        },
        "sg-list-wrapper-x": {
            init: function(a) {
                var b = a.children().eq(0)
                  , c = b.children()
                  , d = c.eq(0).outerWidth()
                  , e = parseInt(c.eq(1).css("margin-left"));
                b.width(d * c.length + e * c.length)
            }
        }
    }),
    sg.Router.addFilter({
        login: function(a, b, c, d) {
            getUserInfo(function(e) {
                return e.is_login ? void d() : h && isAuthLogin(e) ? void d() : ["/company/detail", "/"].indexOf(location.pathname) == -1 || ["account", "message"].indexOf(sg.utils.getUrlParam("type")) != -1 || 1 != config.direct_type || config.is_login ? void sg.router.redirect("/user/login", {
                    redirect: a + "?" + $.param(b).replace(/\+/gi, "%20")
                }, c) : void sg.Component.DownloadNotice({})
            })
        },
        no_force_app_login: function(a, b, c, d) {
            config.is_zdao ? getUserInfo(function() {
                d()
            }) : d()
        },
        claim: function(a, b, c, d) {
            getClaimInfo(function(e) {
                return e.is_claim ? void d() : void sg.router.redirect("/qi/home", {
                    redirect: a + (b ? "?" + $.param(b) : "")
                }, c)
            })
        },
        submit_claim: function(a, b, d, e) {
            getClaimInfo(function(f) {
                return f.status == c.JOINED || f.status == c.CHECKING || f.status == c.COLLEAGUE_CHECKING ? void e() : (a += b ? "?" + $.param(b) : "",
                void getProfileInfo(function(b) {
                    getAccountInfo(function(c) {
                        b.lack_profile || !c.phone ? sg.router.redirect("/user/profile", {
                            redirect: a,
                            claim: 1
                        }, d) : sg.router.redirect("/claim/choose_method", {
                            redirect: a
                        }, d)
                    })
                }))
            })
        },
        zdao_qiye: function(a, b, c) {
            var d = config.zdao_qiye_url;
            return /(\/qi$)|(\/claim\/choose_method)/.test(a) && (d += "/mo/status"),
            c ? location.replace(d) : void (location.href = d)
        },
        zdao_qiye_edit: function(a, b, c) {
            var d = config.zdao_qiye_url + "/mo/status";
            "/company/edit_contact" === a && (d = config.zdao_qiye_url + "/mo/edit_address?from=" + config.from),
            "/qi/edit" === a && (d = config.zdao_qiye_url + "/mo/edit_qiye?from=" + config.from),
            "/company/edit_client" === a && (d = config.zdao_qiye_url + "/mo/edit_qiye?add_client=1&from=" + config.from),
            getClaimInfo(function(a) {
                return [1, 3, 5].indexOf(a.status) > -1 && (d = config.zdao_qiye_url + "/mo"),
                c ? location.replace(d) : void (location.href = d)
            })
        },
        login_app: function(a, b, c, d) {
            if (!config.is_zdao)
                return void d();
            var e = sg.router.getParam("ccoauth_login");
            if (e && "fail" == e) {
                var f = "无法授权登录。\n如需帮助请联系kefu@zdao.com";
                ZDao.login({
                    message: f
                }),
                ZDao.closeweb()
            } else
                b.redirect && b.redirect != location.href && b.redirect != location.pathname + location.search ? ZDao.jump({
                    url: b.redirect,
                    need_login: 1
                }) : ZDao.jump({
                    url: "zdao://zd/login"
                })
        },
        improve_profile: function(a, b, c, d) {
            getProfileInfo(function(e) {
                return e.invoice_lack_profile ? void sg.router.redirect("/user/profile", {
                    redirect: a + "?" + $.param(b).replace(/\+/gi, "%20")
                }, c) : void d()
            })
        },
        msg_to_im: function(a, b, c) {
            sg.router.redirect("/im/chat", {
                session_id: b.msg_id
            }, c)
        },
        unclaim: function(a, b, c, d) {
            getClaimInfo(function(a) {
                return 0 === a.status || 4 === a.status ? void d() : void sg.router.redirect("/claim/status", {}, c)
            })
        },
        cmb: function(a, b, c, d) {
            if (config.is_cmb || config.is_zdao)
                return void d()
        },
        cmb_app: function(a, b, c, d) {
            return config.is_cmb_callback ? void d() : void sg.Model.get("/info/get_cmb_login_url", !1, !0).getData({
                path: sg.router.getPathName()
            }, function(a) {
                return a.errno ? void sg.Component.Notice({
                    text: a.message
                }) : void (location.href = a.data)
            })
        },
        zdao_qiye_product_edit: function(a, b) {
            var c = b.pid
              , a = config.zdao_qiye_url + "/mo/product_edit?from=zdao";
            c && (a += "&id=" + c),
            "/product/edit" == sg.router.current.pathName ? location.replace(a) : location.href = a
        },
        coin: function(a, b, c) {
            sg.router.redirect("/reward/earn_coin", {}, c)
        },
        support_pay: function(a, b, c, d) {
            return config.is_zdao ? config.is_zdao && versionCompare(config.zdao_version, "2.12.5") >= 0 ? void d() : void sg.router.redirect("/qi/pay_upgrade", {}, c) : void sg.Component.Alert({
                text: "请在" + config.productName + "App内操作",
                btnConfirm: {
                    text: "下载" + config.productName + "App",
                    callback: function() {
                        location.href = "/download"
                    }
                }
            })
        },
        vip_profile_limit: function(a, b, c, d) {
            "vip" == b.type ? getProfileInfo(function(a) {
                return a.name && a.company && a.position ? void d() : (Log.trace("show_need_complete"),
                void sg.Component.Alert({
                    title: "请先完善信息",
                    text: "为了更好的为你服务，请先完善你的个人信息",
                    btnCancel: {
                        text: "取消"
                    },
                    btnConfirm: {
                        text: "完善个人信息",
                        callback: function() {
                            Log.trace("click_go_profile"),
                            sg.router.redirect("/user/profile", {
                                redirect: "/qi/pay_privilege"
                            })
                        }
                    }
                }))
            }) : d()
        }
    });
    var i = sg.Router.HistoryRouter.prototype.redirect;
    sg.Router.HistoryRouter.prototype.redirect = function(a, b, c) {
        var d = a.replace(/\?.*/gi, "")
          , e = sg.utils.getUrlParams(a);
        if (b = b || {},
        $.extend(e, b),
        config.is_zdao && !b.force_web) {
            var f = !1
              , g = $.param(e).replace(/\+/gi, "%20");
            if (g && (g = "?" + g),
            /^\/user\/login/.test(d)) {
                var h = e.redirect;
                if (0 == h.indexOf("/") && (h = location.origin + h),
                h === location.href && (c = !0),
                h) {
                    var j = sg.utils.parseUrl(h);
                    ZDao.jump({
                        url: "zdao://zd/login?redirect=" + encodeURIComponent(j.href)
                    })
                } else
                    ZDao.jump({
                        url: "zdao://zd/login"
                    });
                f = !0
            } else if (/^\/company\/detail/.test(d)) {
                if (config.is_android_zdao && versionCompare(config.zdao_version, "1.9.0") >= 0 || config.is_ios_zdao && versionCompare(config.zdao_version, "1.8.0") >= 0) {
                    var k = e.id;
                    ZDao.jump({
                        url: "zdao://zd/companydetail?id=" + k
                    }),
                    f = !0
                }
            } else if (/^\/search$/.test(d))
                versionCompare(config.zdao_version, "1.7.0") >= 0 && (ZDao.jump({
                    url: "zdao://zd/search" + g
                }),
                f = !0);
            else if (/^\/im\/chat/.test(d))
                versionCompare(config.zdao_version, "2.3.1") >= 0 && (ZDao.jump({
                    url: "zdao://zd/chat" + g
                }),
                f = !0);
            else if (/^\/account\/main/.test(d)) {
                if (versionCompare(config.zdao_version, "2.4.0") >= 0) {
                    var l = "zdao://zd/profiledetail?cp_id=" + e.id;
                    e.isEdit && (l += "&isEdit=" + e.isEdit),
                    ZDao.jump({
                        url: l
                    }),
                    f = !0
                }
            } else
                /^\/product\/detail/.test(d) && versionCompare(config.zdao_version, "2.7.0") >= 0 && (ZDao.jump({
                    url: "zdao://zd/productdetail?cid=" + e.cid + "&pid=" + e.pid
                }),
                f = !0);
            if (f)
                return void (c && setTimeout(function() {
                    ZDao.closeweb()
                }, 100))
        }
        config.is_zdao && ZDao.setCloseBtn(),
        i(d, e, c)
    }
    ,
    sg.on("pageLoadingStart", function(a) {
        a.$dom.loadingStart({
            position: "fixed"
        })
    }),
    sg.on("pageLoadingStop", function(a) {
        a.$dom.loadingStop()
    }),
    sg.config.useRoute && sg.on("routeChange", function() {
        sg.router.last && (sg.router.last.componentInstances.forEach(function(a) {
            a.hide && a.hide()
        }),
        sg.router.last.vm && sg.router.last.vm.needCache || (sg.router.last.componentInstances = [])),
        config.is_zdao && ZDao.disableNavBtn(),
        sg.share.update()
    }),
    config.sg_config.useRoute && sg.router.start();
    var h = (config.is_weixin || config.is_camcard) && (location.href.indexOf("/company/") > -1 || location.href.indexOf("/product/") > -1);
    if (h) {
        if (config.is_weixin && b() === !1)
            return;
        if (config.is_camcard && a() === !1)
            return
    }
    if (getUserInfo(function(a) {
        var b = {
            app_id: config.app_info.log_id,
            user_id: a.user_id || "",
            product_name: config.is_camcard ? "camcard_zdao" : config.app_info.name,
            app_version: config.app_info.version,
            env: config.app_info.env,
            from: e,
            client_id: a.client_id
        };
        Log.config(b),
        Log.page("", sg.utils.getUrlParams()),
        Log.tracePerformance(),
        sg.config.useRoute && sg.on("routeChange", function() {
            Log.page("", sg.utils.getUrlParams())
        }),
        config.is_zdao || f || config.is_camcard || (config.direct_type = 1 + (1 & a.client_id.charCodeAt(0)))
    }),
    config.is_zdao && "success" == sg.router.getParam("ccoauth_login")) {
        var j = sg.router.getParam("token");
        history.pushState({}, "", location.origin + location.pathname),
        ZDao.login && ZDao.login({
            token: j
        })
    }
    require(["https://hm.baidu.com/hm.js?dd717aa780606579d5c95d7bf64d529c"]),
    document.addEventListener("scroll", function(a) {
        autoLoadImage()
    }, !0),
    autoLoadImage()
}),
"serviceWorker"in navigator && window.addEventListener("load", function() {
    sg.Model.get("/switch").getData(function(a) {
        a = a.data,
        a.sw ? setStorage("sw_disable", 0) : (setStorage("sw_disable", 1),
        navigator.serviceWorker.getRegistration().then(function(a) {
            a && a.unregister() && location.reload()
        }))
    });
    var a = getStorage("sw_disable");
    if (null !== a)
        return 1 == a ? void navigator.serviceWorker.getRegistration().then(function(a) {
            a && a.unregister()
        }) : void navigator.serviceWorker.register("/sw.js", {
            scope: "/"
        }).then(function(a) {
            a.onupdatefound = function() {
                var b = a.installing;
                b.onstatechange = function() {
                    switch (b.state) {
                    case "installed":
                        navigator.serviceWorker.controller ? (setTimeout(function() {
                            location.reload()
                        }, 1e3),
                        log("installed", "serviceWorker")) : log("installed(no controller)", "serviceWorker");
                        break;
                    case "redundant":
                        log("redundant", "serviceWorker")
                    }
                }
            }
        }).catch(function(a) {
            log("registration", "serviceWorker", !0)
        })
});
