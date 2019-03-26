sg.View.define("company_detail", {
	preview: !0,
	properties: {
		time: 0,
		shareInfo: {
			desp: "找合作，查企业，就用" + config.productName + "。查看主营业务|企业员工|股权信息|产品资料|工商信息|企业年报|合作伙伴|知识产权|招聘信息|公司地址|股东资料|..."
		},
		guideDownload: "",
		refresh_guide: 0,
		links: {
			business_info: {
				path: "business_info"
			},
			employees: {
				path: "business_info",
				type: "employees"
			},
			change_records: {
				path: "business_info",
				type: "change_records"
			},
			annual_report_list: {
				path: "annual_report_list"
			},
			employee_hire: {
				path: "employee_hire"
			},
			domain: {
				path: "domain"
			},
			bid_tender: {
				path: "bid_tender"
			},
			certificate: {
				path: "certificate"
			},
			trademark: {
				path: "intellectual_property",
				type: "trademark"
			},
			patent: {
				path: "intellectual_property",
				type: "patent"
			},
			original_right: {
				path: "intellectual_property",
				type: "original_right"
			},
			soft_right: {
				path: "intellectual_property",
				type: "soft_right"
			},
			risk_warning: {
				path: "risk_warning"
			}
		},
		company_id: null
	},
	getPreviewData: function() {
		return {
			title: sg.router.current.title
		}
	},
	updateShare: function() {
		sg.share.update(this.shareInfo)
	},
	restart: function() {
		this.updateShare();
		var a = parseInt(getCache("product_list_reload")) || 0;
		a > this.time && (this.time = a, this.refresh_guide = 1, this.refresh()),
		$(window).bind("scroll", this.events.scroll),
		this.$parent.trigger("click")
	},
	beforeRender: function(a, b, c) {
		function d() {
			e.company_id && sg.Model.get("/info/getinfo", !1, !0).getData({
				type: "homepage",
				company_id: e.company_id
			},
			function(b) {
				if (b.errno || !b.data) {
					var d;
					if ("255" == b.errno || "256" == b.errno) {
						if (g.is_login || config.is_camcard || config.is_weixin) return h.is_claim || config.is_camcard || config.is_weixin ? void(!i.vip_flag && config.zdao_version && versionCompare(config.zdao_version, "1.4.0") >= 0 ? sg.Component.Alert({
							title: "查看企业次数超限",
							text: "您今日查看企业详情页额度已用完，您可以通过完成任务免费获得VIP会员提高查看企业上限",
							btnCancel: "",
							btnConfirm: {
								text: "做任务 免费领取VIP会员",
								callback: function() {
									sg.router.redirect("/account/free_get_vip"),
									Log.trace("do_task_crease_climit")
								},
								css: "confirm_vip_css"
							}
						}) : i.vip_flag ? sg.Component.Alert({
							title: "查看企业次数超限",
							html: '您已达到最高上限，如果想查看更多，请邮件至<a class="link" href="mailto:kefu@zdao.com">kefu@zdao.com</a>'
						}) : sg.Component.Alert({
							title: "查看企业次数超限",
							text: "您今日查看企业详情页额度已用完，您可以下载" + config.productName + "APP 完成任务赢取免费VIP会员资格，提高查企业上限",
							btnCancel: "",
							btnConfirm: {
								text: "马上去下载",
								callback: function() {
									config.is_camcard ? ccOpenZdao(location.href + "&from=ccqipage&share_enable=1&need_login=1") : location.href = "/download",
									Log.trace("download_crease_climit")
								},
								css: "confirm_vip_css"
							}
						})) : showClaimAlert();
						d = "访问超限，请登录后再查看",
						setTimeout(function() {
							sg.router.redirect("/user/login", {
								redirect: location.href
							},
							!0)
						},
						1e3)
					}
					return "265" == b.errno && (d = "该公司暂时无法查看详情"),
					c.loadingStop(),
					sg.Component.Notice({
						text: d || b.message
					})
				}
				b = b.data,
				b.tags && b.tags.length && $.each(b.tags,
				function(a, c) {
					if (6 == c.key) return b.has_stock = !0,
					!1
				}),
				config.is_camcard && (b.risk_count = parseInt(b.abnormals_count) + parseInt(b.notice_count) + parseInt(b.lawsuits_count) + parseInt(b.executions_count) + parseInt(b.executedpersons_count) + parseInt(b.auctions_count) + parseInt(b.overduetax_count) + parseInt(b.equity_qualitie_count) + parseInt(b.mortgage_count) + parseInt(b.courtnotice_count)),
				a({
					title: sg.router.current.title,
					data: b,
					status: h.status,
					is_claim: h.is_claim,
					is_camcard: config.is_camcard,
					is_zdao: config.is_zdao,
					claimed_or_checking: h.claimed_or_checking,
					image_api: config.image_api,
					static_api: config.static_api,
					getIndustry: getIndustry,
					trim: $.trim,
					json_encode: JSON.stringify,
					url_encode: encodeURIComponent,
					is_login: isAuthLogin(g),
					my_company: i.company || config.is_camcard && b.in_org_name,
					is_company_claim: b.extend_info && "1" == b.extend_info.auth_status,
					is_mycompany: i.company_id == b._id,
					is_mycompany_cc: config.is_camcard && b.in_org_name == b.name,
					is_claim_cc_user: config.is_camcard && b.claimed_company,
					is_show_search: !g.is_login && !config.is_zdao,
					company_revenue: {
						9 : "10万元以下",
						10 : "10万元以下",
						30 : "11~30万人民币",
						50 : "31~50万人民币",
						100 : "51~100万人民币",
						200 : "101~200万人民币",
						300 : "201~300万人民币",
						500 : "301~500万人民币",
						700 : "501~700万人民币",
						1000 : "701~1000万人民币",
						2000 : "1001~2000万人民币",
						3000 : "2001~3000万人民币",
						5000 : "3001~5000万人民币",
						10000 : "5001万~1亿人民币",
						20000 : "大于1亿人民币"
					},
					operate: f,
					encode: encodeURIComponent,
					setLimit: setLimit,
					cc_host_info: config.cc_host_name_info,
					cc_host_qi: config.cc_host_name_qi,
					parseUrlFix: parseUrlFix,
					max: function(a) {
						return a > 99 ? "99+": a
					}
				}),
				sg.Model.get("/info/Log", !1, !0).getData({
					url: "getSummary",
					cid: e.company_id
				})
			})
		}
		var e = this,
		f = sg.router.getParam("operate"),
		g = {},
		h = {},
		i = {};
		e.company_id = sg.router.getParam("id"),
		getUserInfo(function(a) {
			g = a,
			a.is_login ? getProfileInfo(function(a) {
				i = a,
				getClaimInfo(function(a) {
					h = a,
					d()
				})
			}) : d()
		})
	},
	afterRender: function(a) {
		var b, c = this,
		d = c.$parent,
		e = $("body"),
		f = d.find("#btn_contact"),
		g = a.data.extend_info,
		h = a.data ? a.data.name: "",
		i = sg.router.getParam("toast"),
		j = d.find("#toast_tip_wrapper"),
		k = d.find("#toast_tip"),
		l = "";
		if (sg.Component.GuideOpenApp({
			fixBottom: !0,
			onBtnClick: function() {
				location.href = config.bs_url + "/app/download?url=" + encodeURIComponent("zdao://zd/companydetail?id=" + c.company_id)
			}
		}), i) {
			switch (i) {
			case "1":
				l = "王总等人最近查看了您的企业，他们可能是您的潜在客户，快去看看吧",
				k.bind("click",
				function() {
					Log.action("click_toast_A1"),
					sg.router.redirect("/qi/report")
				});
				break;
			case "2":
				l = "一键查看附近公司列表和背景实力，不错过身边的商机，立即查看",
				k.bind("click",
				function() {
					Log.action("click_toast_A2"),
					location.href = "zdao://zd/nearbycompany"
				});
				break;
			case "3":
				l = "查1亿家企业联系电话，准确率高达90%，试搜一下",
				k.bind("click",
				function() {
					Log.action("click_toast_A2"),
					sg.router.redirect("/search/contacts")
				})
			}
			l && (k.text(l), j.show())
		}
		if (bindContactEvent($("#vm_contacts"), a.data, a.is_login), config.is_camcard && (window.CCJSAPI ? CCJSAPI.ready(function() {
			d.find("#btn_share").bind("click",
			function() {
				Log.action("click_rate_btn_share");
				var a = sg.share.get();
				CCJSAPI.share({
					data: {
						title: a.title,
						desc: a.desp,
						img: a.image,
						url: a.url
					}
				})
			})
		}) : d.find("#btn_share").remove(), d.find(".open_zdao").bind("click",
		function() {
			ccOpenZdao(location.href + "&from=ccqipage&share_enable=1&need_login=1")
		})), g && g.product_info && g.product_info.length && sg.View.require("vm_product_items").render({
			image_api: config.image_api,
			is_claim: a.is_claim,
			is_mycompany: a.is_mycompany,
			product_list: g.product_info,
			product_num: g.product_num,
			_id: a.data._id,
			setLimit: setLimit,
			is_login: !a.is_show_search,
			zdao_qiye_url: config.zdao_qiye_url,
			login_url: "/user/login?redirect=" + encodeURIComponent(location.href),
			encode: function(a) {
				return encodeURIComponent(a)
			}
		},
		d.find(".product_business")), d.find(".staff_list").bind("click",
		function() {
			return Log.action("staff_list"),
			config.is_camcard || config.is_weixin ? void guideDownload({
				text: "使用" + config.productName + "即可查看该公司全部员工。"
			}) : void sg.router.redirect("/company/staff_list?id=" + a.data._id)
		}), config.is_camcard || sg.router.last || jumpZDao("zdao://zd/companydetail?id=" + c.company_id), d.find(".financing_info .info_show_more").bind("click",
		function() {
			$(this).remove(),
			d.find(".financing_info .show_one_item").removeClass("show_one_item")
		}), c.company_id) {
			sg.Model.get("/info/getinfo", !0, !0).getData({
				type: "tender_count",
				company_id: c.company_id,
				name: a.data.name
			},
			function(a) {
				if (a.data) {
					var b = parseInt(a.data.bid_count) + parseInt(a.data.tender_count);
					if (b) {
						var c = d.find(".bid_tender");
						c.find(".content_number").text(setLimit(b)),
						c.find(".link_icon ").removeClass("disable")
					}
				}
			}),
			sg.un("get_link_number"),
			sg.on("get_link_number",
			function(b) {
				c.handlerUrlAnchor(),
				d.find(".content_number").each(function() {
					var a = $(this);
					a.text() <= 0 && (a.parent(".link_logo").addClass("disable"), a.remove())
				}),
				d.find(".link_logo").bind("click",
				function() {
					var b, d, e = $(this),
					f = e.attr("class").replace("link_logo flex_item ", "").replace(" disable", "");
					return Log.action("click_links_" + f),
					e.hasClass("disable") && !e.hasClass("risk_warning") ? errorNotice("暂未发现" + e.text()) : (b = c.properties.links[f].type, d = "bid_tender" == f ? "&name=" + a.data.name: "", void sg.router.redirect("/company/" + c.properties.links[f].path + "?id=" + a.data._id + (b ? "&type=" + b: "" + d)))
				}),
				b && b.data && b.data.partners_count && (b.data.company_id = b.id, sg.View.require("partner_list").render(b.data, $("#partner_info"),
				function() {
					c.handlerUrlAnchor.call(c)
				}))
			}),
			a.is_show_search && d.find(".top_form").bind("click",
			function() {
				Log.action("click_search_input"),
				sg.router.redirect("/search")
			}),
			d.find(".company_website").bind("click",
			function() {
				var a = $(this).data("url");
				config.is_zdao ? ZDao.jump({
					url: a
				}) : window.open(a)
			}),
			sg.on("no_foreign_investment",
			function() {
				d.find("[data-url=foreign_investment]").remove(),
				c.handlerUrlAnchor()
			});
			var m = d.find(".description");
			m.length && m.get(0).scrollHeight > m.height() && d.find(".des_show_more").show().bind("click",
			function() {
				$(this).hide(),
				m.removeClass("hide_long_lines"),
				Log.action("click_des_show_more")
			});
			var n = d.find(".company_keywords"),
			o = d.find(".company_keywords_text"),
			p = 2 * o.first().outerHeight(!0),
			q = !1;
			o.length && n[0].scrollHeight > p && (o.each(function(a, b) {
				if ($(b).position().top > p) return q = a - 1,
				!1
			}), q && (o.eq(q).width() < 58 && (q -= 1), o.slice(q).remove(), n.append('<div class="company_keywords_text get_more">查看全部</div>').find(".get_more").bind("click",
			function() {
				b || (b = sg.Component.Dialog({
					content: sg.View.require("vm_company_keywords").render($.extend(g, {
						is_camcard: config.is_camcard
					})),
					closeBtn: !0,
					dialogClass: "bs_dialog",
					contentClass: "sg_animate move_y in "
				})),
				b.show(),
				Log.action("click_business_get_more")
			})));
			var r = [];
			d.find(".anchor_info_box .anchor").each(function(a, b) {
				r.push($(b).data("url"))
			}),
			Log.trace("show_anchor", r);
			var s = d.find(".fix_wrapper");
			c.anchor_wrapper_offset_top = d.find(".anchor_wrapper").offset().top - (e.hasClass("zdao") ? 0 : parseInt(d.find(".head_nav").height())),
			s.html(d.find(".anchor_info_box").html()).addClass("anchor_info_box"),
			d.find(".anchor_show_more").bind("click",
			function() {
				$(this).parents(".anchor_info_box").addClass("anchor_show"),
				Log.action("click_anchor_list")
			}),
			d.find(".anchor_info_box .icon_close").bind("click",
			function() {
				$(this).parents(".anchor_info_box").removeClass("anchor_show"),
				Log.action("click_anchor_close")
			}),
			d.find(".anchor").bind("click",
			function() {
				var a = $(this),
				b = a.attr("data-url");
				c.scrollToAnchor(b, d)
			}),
			$(window).bind("scroll", c.events.scroll),
			sg.on("stock_info_finished",
			function() {
				c.handlerUrlAnchor.call(c)
			}),
			sg.on("foreign_investment_finished",
			function() {
				c.handlerUrlAnchor.call(c)
			}),
			sg.on("company_news_finished",
			function() {
				c.handlerUrlAnchor.call(c)
			}),
			sg.on("company_list_finished",
			function() {
				c.handlerUrlAnchor.call(c)
			}),
			d.find(".btn_goto_claim").bind("click",
			function(b) {
				return 3 == a.status || 1 == a.status || 5 == a.status ? (Log.trace("show_authing"), sg.Component.Alert({
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
			}),
			getUserInfo(function(b) {
				if (b.is_login) {
					var e = !1;
					f.bind("click",
					function() {
						e || (e = !0, d.loadingStart({
							position: "fixed"
						}), sg.Model.get("/info/getContactList", !1, !0).getData({
							id: c.company_id
						},
						function(a) {
							return e = !1,
							d.loadingStop(),
							a.errno || !a.data ? errorNotice(a.message) : (a.data.name = h, void showContacts(a.data, c.company_id, {
								showTitle: 1
							}))
						}))
					})
				} else f.bind("click",
				function() {
					showContacts(a.data, c.company_id, {
						showTitle: 1
					})
				})
			}),
			d.find("#btn_disclaimer").bind("click",
			function() {
				sg.Component.Alert({
					title: "免责声明",
					text: "企业信息的内容均由第三方提供，" + config.productName + "对该内容的准确性和真实性不做任何保证或承担任何责任，如果您发现该内容有任何错误，欢迎您向我们进行反馈。",
					closeBtn: !0,
					btnCancel: !1,
					btnConfirm: !1
				})
			}),
			c.shareInfo.title = a.data.name + "企业详情_" + config.productName,
			c.shareInfo.image = g && g.logo_url ? config.image_api + g.logo_url + ".t160u": config.static_api + "images/share_logo.png",
			c.shareInfo.url = location.href,
			c.updateShare(),
			$("#btn_feedback").bind("click",
			function() {
				redirectFeedback()
			});
			var t = getStorage("company_detail_scan_number") || 0;
			t > 5 || (5 == t && config.is_zdao && ZDao.notification({
				type: "comment"
			}), t = Number(t) + 1, setStorage("company_detail_scan_number", t))
		}
	},
	goto_login: function() {
		var a = getUserinfo();
		a.is_login || sg.Component.Alert({
			title: "需要登录",
			html: "该功能需要登录后才能使用",
			btnConfirm: {
				text: "登录",
				callback: function() {
					return sg.router.redirect("/user/login", {
						redirect: location.href
					}),
					!0
				}
			}
		})
	},
	handlerUrlAnchor: function() {
		var a = this,
		b = a.$parent,
		c = sg.router.getParam("anchor");
		c && a.scrollToAnchor(c, b)
	},
	scrollToAnchor: function(a, b) {
		var c = $(window),
		d = b.find(".fix_wrapper"),
		e = b.find(".anchor_info_box"),
		f = a,
		g = b.find("." + f).offset().top - 44,
		h = {
			state: e.hasClass("anchor_show") ? "on": "off"
		};
		c.scrollTop(g),
		d.find("[data-url=" + f + "]").addClass("active"),
		e.hasClass("fix_wrapper") ? Log.action("click_anchor_scroll_" + $(this).data("url"), h) : Log.action("click_anchor_top_" + $(this).data("url"), h),
		e.removeClass("anchor_show")
	},
	events: {
		scroll: function() {
			var a = this,
			b = a.$parent,
			c = b.find(".anchor_show"),
			d = b.find(".fix_wrapper");
			c.find(".icon_close").trigger("click"),
			d.find(".anchor").removeClass("active"),
			a.anchor_wrapper_offset_top && $(window).scrollTop() > a.anchor_wrapper_offset_top ? d.hasClass("transition_show") || (d.is(":visible") || (d.show(), sg.utils.reflow()), d.addClass("transition_show")) : d.hasClass("transition_show") && d.removeClass("transition_show")
		}
	},
	leave: function() {
		$(window).unbind("scroll", this.events.scroll)
	}
}),
sg.View.define("detail_company_news", {
	beforeRender: function(a) {
		var b = sg.router.getParam("id");
		b && sg.Model.get("/info/getpageinfo", !0, !0).getData({
			id: b,
			type: "news",
			pageSize: 3
		},
		function(c) { ! c.errno && c.data && c.data.items && c.data.items.length && (c.data.company_id = b, c.data.setLimit = setLimit, a(c.data))
		})
	},
	afterRender: function() {
		sg.fire("company_news_finished")
	}
}),
sg.View.define("vm_company_list", {
	beforeRender: function(a, b) {
		var c = sg.router.getParam("id");
		c && sg.Model.get("/info/getInfo", !0, !0).getData({
			company_id: c,
			idlist: b.company_list.join(","),
			type: "company_list"
		},
		function(c) {
			c.errno || a($.extend({
				company_list: c.data,
				image_api: config.image_api,
				getYear: getYear,
				type: b.type
			},
			config))
		})
	},
	afterRender: function(a) {
		var b = this.$parent;
		if (sg.fire("company_list_finished"), "rival_companies" == a.type && a.company_list && a.company_list.length) {
			var c = [];
			$.each(a.company_list,
			function(a, b) {
				c.push(b.id)
			}),
			Log.trace("show_rival_companies", {
				company_id: sg.router.getParam("id"),
				rival_companies: JSON.stringify(c)
			})
		}
		b.find(".btn_goto_claim").bind("click",
		function(a) {
			Log.action("click_fill_company_info", null, "company_bi_baseinfo"),
			sg.Component.Alert({
				title: "认证成为员工",
				html: "无法" + a.target.innerText + "，请先认证成为企业的员工",
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
		})
	}
}),
sg.View.define("partner_list", {
	beforeRender: function(a, b) {
		var c = sg.router.getParam("id");
		c && sg.Model.get("/info/getInfo", !0, !0).getData({
			company_id: c,
			type: "bs_base"
		},
		function(c) { ! c.errno && c.data && c && c.data && c.data.partners_count && (c.data.company_id = sg.router.getParam("id"), a($.extend(c.data, b)))
		})
	}
}),
sg.View.define("vm_foreign_investment", {
	beforeRender: function(a, b) {
		sg.Model.get("/info/getpageinfo", !0, !0).getData({
			id: sg.router.getParam("id"),
			type: "bs_outbound_investment",
			pageSize: 3
		},
		function(b) {
			if (!b.errno) {
				if (!b.data || !b.data.items || !b.data.items.length) return void sg.fire("no_foreign_investment");
				a($.extend(b.data, {
					image_api: config.image_api,
					getYear: getYear,
					company_id: sg.router.getParam("id")
				})),
				Log.trace("has_foreign_investment")
			}
		})
	},
	afterRender: function() {
		sg.fire("foreign_investment_finished")
	}
}),
sg.View.define("vm_stock", {
	properties: {
		getInfo: sg.Model.get("/info/getInfo", !1, !0),
		timer: ""
	},
	beforeRender: function(a) {
		var b = this;
		b.properties.getInfo.getData({
			type: "stock_info",
			company_id: sg.router.current.params.id
		},
		function(b) {
			b.data && a(b.data)
		})
	},
	afterRender: function(a) {
		var b = this,
		c = b.$parent,
		d = a;
		sg.fire("stock_info_finished"),
		d.is_fresh || (b.timer = setTimeout(function() {
			b.getInfo.getData({
				type: "update_stock_info",
				company_id: sg.router.current.params.id
			},
			function(a) {
				a.data && (a.data.is_fresh = !0, b.refresh($.extend(d, a.data)))
			})
		},
		5e3)),
		c.find(".stock_arrow").bind("click",
		function() {
			var a = $(this).parents(".info_title").next();
			$(this).toggleClass("icon_arrow_down").toggleClass("icon_arrow_up"),
			$(this).hasClass("icon_arrow_down") ? (a.hide(), Log.action("click_stock_hide")) : (a.show(), Log.action("click_stock_show"))
		})
	},
	destroy: function() {
		this.timer && clearTimeout(this.timer)
	}
}),
sg.View.define("vm_business_info", {
	beforeRender: function(a, b) {
		var c = sg.router.getParam("id");
		c && sg.Model.get("/info/getInfo", !0, !0).getData({
			company_id: c,
			type: "bs_base"
		},
		function(c) {
			return c.errno || !c.data ? void sg.fire("get_link_number") : void(c && c.data && a($.extend({
				data: c.data,
				today: "今天",
				today_num: (new Date).Format("yyyy-MM-dd"),
				id: sg.router.current.params.id,
				setLimit: setLimit
			},
			b)))
		})
	},
	afterRender: function(a) {
		function b(a, b, c) {
			a.length && a.get(0).scrollHeight > a.height() && (b.show(), b.bind("click",
			function() {
				$(this).hide(),
				a.removeClass("hide_long_lines"),
				c && c()
			}))
		}
		sg.fire("get_link_number", a);
		var c = this.$parent,
		d = c.find("#icon_update"),
		e = a.data.name,
		f = a.data.province,
		g = a.data.reg_no;
		b(c.find(".line_content_whole"), c.find(".scope_show_more")),
		getUserInfo(function(a) {
			c.find("#btn_update").bind("click",
			function() {
				return isAuthLogin(a) ? void(d.hasClass("animate_rotate") || sg.Model.get("/info/onlineUpdate", !1, !0).getData({
					company_name: e,
					province: f,
					regno: g
				},
				function(a) {
					if (a.errno) return errorNotice();
					a = a.data;
					var b = a.jobid,
					c = a.status,
					e = 30;
					1 == c ? (d.addClass("animate_rotate"), self.timer = setInterval(function() {
						e % 6 || sg.Model.get("/info/checkUpdate", !1, !0).getData({
							jobid: b
						},
						function(a) {
							return a.errno ? (d.removeClass("animate_rotate"), clearInterval(self.timer), sg.Component.Notice({
								text: a.message
							})) : (a = a.data, void(1 == a.result ? (d.removeClass("animate_rotate"), clearInterval(self.timer), sg.Component.Notice({
								text: "更新成功"
							}), location.reload()) : 2 == a.result && (d.removeClass("animate_rotate"), clearInterval(self.timer), sg.Component.Notice({
								text: "更新失败"
							}))))
						}),
						e--,
						e <= 0 && (d.removeClass("animate_rotate"), clearInterval(self.timer), errorNotice("更新已在后台处理中，请稍后刷新页面"))
					},
					1e3)) : 2 == c ? sg.Component.Notice({
						text: "更新已经处理中，请稍后刷新页面"
					}) : sg.Component.Notice({
						text: "更新次数超限，请明天再使用"
					})
				})) : void sg.Component.Alert({
					title: "需要登录",
					html: "该功能需要登录后才能使用",
					btnConfirm: {
						text: "登录",
						callback: function() {
							return sg.router.redirect("/user/login", {
								redirect: location.href
							}),
							!0
						}
					}
				})
			})
		})
	}
}),
sg.View.define("store_company", {
	properties: {
		checkStore: sg.Model.get("/collect/checkStore", !1, !0),
		store: sg.Model.get("/collect/store", !1, !0),
		unstore: sg.Model.get("/collect/unstore", !1, !0)
	},
	beforeRender: function(a, b) {
		var c = this;
		c.company_id = b.company_id,
		this.checkStore.getData({
			company_id: c.company_id
		},
		function(c) {
			c.errno || (b.has_store = parseInt(c.data.ret), a(b))
		})
	},
	afterRender: function(a) {
		var b = this,
		c = b.$parent;
		c.css("display", "inline-block"),
		a.has_store ? sg.Component.Popover({
			target: "#btn_store",
			list: [{
				text: "编辑标签",
				click: function() {
					return Log.action("click_edit_collect_tags"),
					b.editTags("edit")
				}
			},
			{
				text: "取消收藏",
				click: function() {
					return Log.action("click_cancel_collect_company"),
					b.cancelStore()
				}
			}]
		}) : c.bind("click",
		function() {
			b.store.getData({
				company_id: b.company_id
			},
			function(a) {
				return a.errno ? void sg.Component.Notice({
					text: a.message
				}) : (setCache("update_store_list", 1), b.editTags("new"), b.$parent.unbind(), void b.refresh({
					has_store: 1
				}))
			})
		})
	},
	cancelStore: function() {
		var a = this;
		a.unstore.getData({
			company_id: a.company_id
		},
		function(b) {
			return b.errno ? void sg.Component.Notice({
				text: b.message
			}) : (setCache("update_store_list", 1), a.$parent.unbind(), void a.refresh({
				has_store: 0
			}))
		})
	},
	editTags: function(a) {
		var b = this;
		sg.Component.ChooseTag({
			company_id: b.company_id,
			type: a
		})
	}
}),
sg.Component("ChooseTag", {
	properties: {
		getTagsOfCompany: sg.Model.get("/collect/getTagsOfCompany", !1, !0),
		setTagsOfCompany: sg.Model.get("/collect/setTagsOfCompany", !1, !0),
		addTag: sg.Model.get("/collect/addTag", !1, !0)
	},
	template: '\t  {{if type=="new"}}<div class="tag_mention">选择标签</div>{{/if}}\t\t<div class="tag_list_wrapper">\t\t\t<ul class="tag_ul">\t\t\t\t<li class="tag_li tag_new"><div class="icon_plus"></div>新建标签</li>\t\t\t\t{{each tag_list as tag index}}\t\t\t\t<li class="tag_li tag_item" data-id="{{tag.tag_id}}">\t\t\t\t\t<div class="tag_li_content hide_long">{{tag.tag_name}}</div>\t\t\t\t\t<div class="check_box">\t\t\t\t\t\t<i class="icon_checkcircle {{if tag.check && tag.check=="on"}}checked{{/if}}"></i>\t\t\t\t\t</div>\t\t\t\t</li>\t\t\t\t{{/each}}\t\t\t</ul>\t\t</div>\t',
	beforeRender: function(a) {
		var b = this;
		b.getTagsOfCompany.getData({
			company_id: b.options.company_id
		},
		function(b) {
			return b.errno ? void sg.Component.Notice({
				text: b.message
			}) : void a(b.data)
		})
	},
	render: function(a) {
		this.showChooseTagDialog(a)
	},
	showChooseTagDialog: function(a) {
		var b = this,
		c = sg.Component.Alert({
			title: "new" == b.options.type ? "收藏成功": "选择标签",
			css: "v_store_list",
			html: sg.template.compile(b.template)($.extend({
				tag_list: a
			},
			b.options)),
			closeBtn: !1,
			contentClass: "sg_animate move_y in",
			afterHide: function() {
				this.destroy()
			},
			btnConfirm: {
				text: "确定",
				callback: function() {
					Log.action("click_collect_confirm");
					for (var a = this.$dom.find(".checked").parents(".tag_item"), d = [], e = 0; e < a.length; e++) d.push($(a[e]).data("id"));
					b.setTagsOfCompany.getData({
						company_id: b.options.company_id,
						tags: JSON.stringify(d)
					},
					function(a) {
						return a.errno ? void sg.Component.Notice({
							text: a.message
						}) : ("new" == b.options.type && Log.trace("collect_tag_count", {
							count: d.length
						}), c.hide(), void setCache("update_store2tag", 1))
					})
				}
			},
			btnCancel: {
				text: "取消",
				callback: function() {
					Log.action("click_collect_cancel"),
					this.hide()
				}
			}
		}),
		d = c.dialog.$dom;
		d.find(".tag_new").bind("click",
		function() {
			Log.action("click_add_collect_tag"),
			b.showCreateTagDialog(a),
			c.hide()
		}),
		d.find(".tag_item").bind("click",
		function() {
			var a = $(this).find(".icon_checkcircle");
			a.hasClass("checked") ? a.removeClass("checked") : a.addClass("checked")
		})
	},
	showCreateTagDialog: function(a) {
		var b = this,
		c = sg.Component.Prompt({
			title: "新建标签",
			btnConfirm: {
				text: "确定",
				callback: function(d) {
					return Log.action("click_add_tag_confirm"),
					d ? (b.addTag.getData({
						tag_name: d
					},
					function(d) {
						if (d.errno) return c.showError(d.message),
						!1;
						var e;
						e = a.length ? a.filter(function(a) {
							return "on" == a.check
						}).map(function(a) {
							return a.tag_id
						}) : [],
						e.push(d.data.tag_id),
						b.setTagsOfCompany.getData({
							company_id: b.options.company_id,
							tags: JSON.stringify(e)
						},
						function(a) {
							a.errno && sg.Component.Notice({
								text: a.message
							}),
							c.hide(),
							b.refresh()
						})
					}), !1) : (c.showError("标签名不能为空"), !1)
				}
			},
			btnCancel: {
				text: "取消",
				callback: function() {
					Log.action("click_add_tag_cancel"),
					this.hide()
				}
			}
		})
	},
	options: {
		company_id: null,
		type: "new"
	}
}),
sg.View.define("company_top_rank", {
	properties: {
		loading: !1,
		ending: !1,
		offset: 0
	},
	beforeRender: function(a) {
		var b = sg.router.getParam("label"),
		c = {
			"2016年中国500强": "2016_top500",
			"2017年中国500强": "2017_top500",
			"2018年中国500强": "2018_top500",
			"2017年民营企业制造业500强": "2017_my_zz_top500",
			"2017年中国民营企业服务业100强": "2017_my_fw_top100",
			"2017中国轻工业装备制造企业30强": "2017_qg_zbzz_top30",
			"2017年中国轻工业自行车行业十强": "2017_qg_zxc_top10",
			"2017年中国轻工业食品行业50强": "2017_qg_sp_top50",
			"2017年中国轻工业发酵行业十强": "2017_qg_fj_top10",
			"2017年中国轻工业乐器行业十强": "2017_qg_yq_top10",
			"2017年中国轻工业酿酒行业十强": "2017_qg_lj_top10",
			"2017年中国轻工业皮革行业十强": "2017_qg_pg_top10",
			"2017年中国轻工业铅蓄电池行业十强": "2017_qxdc_yq_top10",
			"2017年中国轻工业塑料行业十强": "2017_qg_sl_top10",
			"2017年中国轻工业香料行业十强": "2017_qg_xl_top10",
			"2017年中国轻工业照明电器行业十强": "2017_qg_zm_top10",
			"2017年中国轻工业制笔行业十强": "2017_qg_zhibi_top10",
			"2017年中国轻工业钟表行业十强": "2017_qg_zb_top10",
			"2017中国民营企业500强": "2017_my_top500"
		};
		a({
			title: sg.router.current.title,
			static_api: config.static_api,
			label_src: c[b]
		})
	},
	afterRender: function(a) {
		var b = this,
		c = b.$parent.find(".rank_list");
		$(window).on("scroll", b.events.scroll).trigger("scroll"),
		c.on("click",
		function(a) {
			var b = $(a.target).closest(".rank_item").data("id"),
			c = $(a.target).closest(".rank_item").data("name");
			b ? sg.router.redirect("/company/detail", {
				id: b
			}) : sg.router.redirect("/search", {
				type: "company",
				keyword: c
			})
		})
	},
	events: {
		scroll: function(a) {
			var b = this,
			c = b.$parent.find(".rank_list"),
			d = $(document).height(),
			e = $(window).height(),
			f = sg.router.getParam("label"),
			g = b.$parent.find(".loading_box"),
			h = [];
			b.ending || d - $(window).scrollTop() - e < 30 && !b.loading && (b.loading = !0, sg.View.require("loading_text")._render(g, {
				ending: b.ending,
				loading: b.loading
			}), sg.Model.get("/info/getLabelCmps", !0, !0).getData({
				label: f,
				offset: 20 * b.offset
			},
			function(a) {
				if (b.loading = !1, !a.data.data) return b.ending = !0,
				void sg.View.require("loading_text")._render(g, {
					ending: b.ending,
					loading: b.loading
				});
				for (var d = 0; d < a.data.data.length; d++) h.push(a.data.data[d]),
				h[d].start_date && (h[d].start_date = h[d].start_date.split("-")[0]),
				h[d].business && (h[d].business = h[d].business.slice(0, 3));
				b.offset++,
				sg.View.require("loading_text")._render(g, {
					ending: b.ending,
					loading: b.loading
				}),
				sg.View.require("rank_list").render({
					cmp_list: h,
					static_api: config.static_api,
					image_api: config.image_api
				},
				c, null, 1)
			},
			function() {
				b.loading = !1
			}))
		}
	},
	leave: function() {
		$(window).off("scroll", this.events.scroll)
	},
	restart: function() {
		$(window).on("scroll", this.events.scroll)
	}
}),
sg.View.define("company_efficient_app_rank", {
	beforeRender: function(a) {
		var b = [{},
		{},
		{}];
		a({
			cmp_list: b,
			static_api: config.static_api
		})
	},
	afterRender: function(a) {
		var b = $(".rank_list");
		sg.View.require("e_rank_list")._render(b, {
			cmp_list: a.cmp_list,
			static_api: a.static_api
		}),
		console.log(a.static_api)
	}
}),
sg.View.define("company_dm_equity_pledged", {
	properties: {
		loading: !1,
		ending: !1,
		start: 0
	},
	beforeRender: function(a) {
		a({
			title: sg.router.current.title
		})
	},
	afterRender: function(a) {
		var b = this,
		c = b.$parent.find(".ep_list");
		sg.Component.HistoryInfoDisclaimer(b.$parent),
		sg.View.require("ep_item")._render(c, {
			equity_pledged_list: a.equity_pledged_list
		}),
		$(window).on("scroll", b.events.scroll).trigger("scroll"),
		b.$dom.on("click",
		function(a) {
			var b = $(a.target.closest(".ep_item")).data("id");
			b && sg.router.redirect("/company/equity_pledged_detail", {
				id: sg.router.getParam("id"),
				u_id: b
			})
		})
	},
	events: {
		scroll: function(a) {
			var b = this,
			c = b.$parent,
			d = c.find(".ep_list"),
			e = $(document).height(),
			f = $(window).height(),
			g = b.$parent.find(".loading_box");
			b.ending || e - $(window).scrollTop() - f < 30 && !b.loading && (b.loading = !0, sg.View.require("loading_text")._render(g, {
				ending: b.ending,
				loading: b.loading
			}), sg.Model.get("/info/getInfoList", !0, !0).getData({
				type: "equity_pledge",
				id: sg.router.getParam("id"),
				history: sg.router.getParam("history") || 0,
				start: 10 * b.start,
				pageSize: 10
			},
			function(a) {
				if (b.loading = !1, !a.data.list) return b.ending = !0,
				void sg.View.require("loading_text")._render(g, {
					ending: b.ending,
					loading: b.loading
				});
				var e = a.data;
				0 == b.start && sg.Component.VipLimitTip(c, {
					access_count: e.access_count,
					total_limit: e.total_limit,
					access: e.access
				}),
				sg.View.require("loading_text")._render(g, {
					ending: b.ending,
					loading: b.loading
				}),
				sg.View.require("ep_item").render({
					equity_pledged_list: e.list
				},
				d, null, 1),
				b.start++
			},
			function() {
				b.loading = !1
			}))
		}
	},
	leave: function() {
		$(window).off("scroll", this.events.scroll)
	},
	restart: function() {
		$(window).on("scroll", this.events.scroll)
	}
}),
sg.View.define("company_equity_pledged_detail", {
	beforeRender: function(a) {
		sg.Model.get("/info/getInfoDetail", !0, !0).getData({
			type: "equity_pledge",
			id: sg.router.getParam("id"),
			oid: sg.router.getParam("u_id")
		},
		function(b) {
			a({
				title: sg.router.current.title,
				ep_Info: b.data
			})
		})
	},
	afterRender: function() {}
}),
sg.View.define("company_dm_judicial_aid", {
	beforeRender: function(a) {
		sg.Model.get("/info/getInfoList", !0, !0).getData({
			type: "judicial_assistance",
			id: sg.router.getParam("id")
		},
		function(b) {
			for (var c = b.data.list,
			d = 0; d < c.length; d++) c[d] = $.extend(c[d], c[d].pc_freeze_detail);
			a({
				title: sg.router.current.title,
				ja_list: c
			})
		})
	},
	afterRender: function(a) {
		var b = this;
		b.$dom.on("click",
		function(a) {
			var b = $(a.target.closest(".ja_item")).data("uid");
			b && sg.router.redirect("/company/judicial_aid_detail", {
				id: sg.router.getParam("id"),
				u_id: b
			})
		})
	}
}),
sg.View.define("company_judicial_aid_detail", {
	beforeRender: function(a) {
		sg.Model.get("/info/getInfoDetail", !1, !0).getData({
			type: "judicial_assistance",
			id: sg.router.getParam("id"),
			oid: sg.router.getParam("u_id")
		},
		function(b) {
			a({
				title: sg.router.current.title,
				jad_info: $.extend(b.data, b.data.pc_freeze_detail)
			})
		})
	},
	afterRender: function(a) {}
}),
sg.View.define("company_dm_tax_info", {
	beforeRender: function(a) {
		var b = this,
		c = b.$parent;
		sg.Model.get("/info/getInfoList", !0, !0).getData({
			type: "tax_info",
			id: sg.router.getParam("id"),
			history: sg.router.getParam("history") || 0
		},
		function(b) {
			if (b.errno) return void sg.Component.Notice({
				text: b.message
			});
			var d = b.data;
			sg.Component.VipLimitTip(c, {
				access_count: d.access_count,
				total_limit: d.total_limit,
				access: d.access
			}),
			a({
				title: sg.router.current.title,
				abnoraml_list: d.abnoraml && d.abnoraml.list,
				huge_list: d.huge && d.huge.list,
				overdue_list: d.overdue && d.overdue.list
			})
		})
	},
	afterRender: function(a) {
		var b = this;
		b.$dom.on("click",
		function(a) {
			var b, c = $(a.target);
			c.hasClass("arrow") && (b = $(a.target.closest(".category_box")), b.toggleClass("active"))
		})
	}
}),
sg.View.define("company_business_info", {
	beforeRender: function(a) {
		a({
			title: sg.router.current.title
		})
	},
	afterRender: function() {
		var a = sg.View.require("template_business_info"),
		b = this.$parent,
		c = b.find(".business_list"),
		d = sg.router.getParam("id"),
		e = sg.router.getParam("type") || sg.router.getParam("section");
		return d ? (b.loadingStart({
			position: "fixed"
		}), void sg.Model.get("/info/getInfo", !0, !0).getData({
			company_id: d,
			type: "bs_base"
		},
		function(d) {
			if (b.loadingStop(), !d || d.errno || !d.data) return void sg.Component.Notice({
				text: d.message || "服务器繁忙，请稍后再试"
			});
			if (d = d.data, d.regist_capi = (d.regist_capi || "-").replace("&nbsp;", " ").replace("***", "-").replace(/^[0]+[.][0]*$/, "-"), "0万元美元" == d.regist_capi && (d.regist_capi = "-"), isNaN(d.regist_capi) || (d.regist_capi += "万"), d.regist_capi = d.regist_capi.replace("万人民币元", "万人民币"), d.regist_capi = d.regist_capi.replace("万元美元", "万美元"), a.render({
				data: d,
				encodeURIComponent: encodeURIComponent,
				trim: $.trim
			},
			c), c.find(".business_title").bind("click",
			function() {
				Log.action("click_title_" + $(this).parent(".business_item").data("id"));
				var a = $(this).siblings(".business_item_list");
				a.toggle(),
				$(this).find("i").toggleClass("icon_chevron_down").toggleClass("icon_chevron_up")
			}), b.find(".map_link").bind("click",
			function() {
				var a = $(this).data("url");
				a && (config.is_zdao ? ZDao.jump({
					url: a
				}) : window.open(a))
			}), fixTopBar("body", "business_item", "business_title", {
				position: "fixed",
				top: 45,
				zIndex: "10"
			}), e) {
				var f = b.find("[data-id=" + e + "]");
				f.find(".business_title").trigger("click"),
				window.scrollTo(0, f.offset().top - $(".head_nav").height())
			}
		})) : void sg.Component.Notice({
			text: "参数错误！"
		})
	}
}),
sg.View.define("company_history_business_info", {
	beforeRender: function(a) {
		var b = this;
		b.$parent;
		sg.Model.get("/info/get_middleware_info", !1, !0).getData({
			type: "ent_detail_list",
			company_id: sg.router.getParam("company_id"),
			history: 1
		},
		function(b) {
			return b.errno ? void sg.Component.Notice({
				text: b.message
			}) : (b = b.data, void a(b))
		})
	},
	afterRender: function(a) {
		var b = this,
		c = b.$parent;
		sg.Component.HistoryInfoDisclaimer(c),
		sg.Component.VipLimitTip(c, {
			access_count: a.access_count,
			total_limit: a.total_limit,
			access: a.access
		}),
		c.find(".desc").each(function() {
			var a = $(this);
			a.height() > 100 && (a.addClass("hide_more"), a.siblings(".btn_show_more").show())
		}),
		c.on("click", ".btn_show_more",
		function() {
			$(this).hide().siblings(".btn_hide_more").show().siblings(".desc").removeClass("hide_more")
		}).on("click", ".btn_hide_more",
		function() {
			$(this).hide().siblings(".btn_show_more").show().siblings(".desc").addClass("hide_more")
		}).on("click", ".title",
		function() {
			$(this).parents(".item").toggleClass("open")
		})
	}
}),
sg.View.define("company_risk_warning", {
	properties: {
		abnormal: {
			request: "rs_abnormal",
			template: "template_abnormal",
			log_id: "business_exception"
		},
		lawsuit: {
			request: "rs_lawsuit",
			template: "template_lawsuits",
			detail_path: "judge_detail",
			log_id: "court_judge"
		},
		executed_person: {
			request: "rs_executed_person_list",
			template: "template_executed_person_list",
			log_id: "executive_info"
		},
		execution: {
			request: "rs_execution",
			template: "template_execution",
			detail_path: "find_dishonest_detail",
			log_id: "dishonest_info"
		},
		sfpm: {
			request: "rs_sfpm",
			template: "template_sfpm",
			log_id: "judicial_auction"
		},
		overdue_tax_list: {
			request: "rs_overdue_tax_list",
			template: "template_overdue_tax_list",
			log_id: "overduetax"
		},
		mortgages: {
			request: "rs_mortgages",
			template: "template_mortgages",
			detail_path: "mortgage_detail",
			log_id: "mortgage"
		},
		equity_pledge: {
			request: "rs_equity_pledge",
			template: "template_equity_pledge",
			detail_path: "equity_pledge_detail",
			log_id: "equity_pledge"
		},
		court_notice: {
			request: "rs_court_notice",
			template: "template_court_notice",
			log_id: "court_notice"
		},
		notices: {
			request: "rs_notices",
			template: "template_notices",
			log_id: "court_announce"
		}
	},
	beforeRender: function(a) {
		sg.Model.get("/info/getinfo", !1, !0).getData({
			type: "homepage",
			company_id: sg.router.getParam("id")
		},
		function(b) {
			return b.errno || !b.data ? sg.Component.Notice({
				text: b.message
			}) : void a($.extend(b.data, {
				title: sg.router.current.title
			}))
		})
	},
	afterRender: function() {
		var a = sg.router.getParam("id"),
		b = this,
		c = b.$parent,
		d = c.find(".btn_list_more"),
		e = {};
		fixTopBar("body", "retract_expand_box", "business_title", {
			position: "fixed",
			top: $("body").hasClass("zdao") ? 0 : 45,
			zIndex: "10"
		}),
		c.find(".business_title").bind("click",
		function() {
			var d = $(this),
			f = d.data("id"),
			g = c.find("#" + f),
			h = g.siblings(".btn_list_more"),
			i = d.find(".business_count").hasClass("empty_content"),
			j = d.find("i");
			i || (!e[f] && b[f] && (Log.action(b[f].log_id), e[f] = sg.Component.ListView(g, {
				item_vm: b[f].template,
				method: "POST",
				url: "/info/getPageInfo",
				params: {
					id: a,
					type: b[f].request
				},
				limit: 10,
				format: {
					start: "start",
					limit: "pageSize"
				},
				done: function(a, b, d) {
					c.loadingStop(),
					d || !b.has_next_page ? h.hide() : h.show()
				},
				itemBeforeRender: function(a) {},
				onAjaxError: function(a) {
					c.loadingStop(),
					sg.Component.Notice({
						text: a.msg || "服务器繁忙，请稍后再试"
					})
				}
			})), g.parent().toggleClass("hide_ele"), j.toggleClass("icon_chevron_down").toggleClass("icon_chevron_up"))
		}),
		d.bind("click",
		function(a) {
			var b = $(this).parents(".retract_expand_box_list").siblings(".business_title").data("id");
			c.loadingStart({
				position: "fixed"
			}),
			e[b].append(),
			a.stopPropagation()
		}),
		c.find(".retract_expand_box_list").bind("click",
		function(c) {
			var d = $(c.target),
			e = $(this).siblings(".business_title").data("id"),
			f = d.hasClass("list_item") ? d: d.parents(".list_item"),
			g = d.hasClass("toggle_wrapper") ? d: d.parents(".toggle_wrapper");
			g && g.length ? (g.siblings(".hide_more").toggleClass("show"), g.children(".toggle").toggleClass("show")) : b[e] && f && f.length && f.data("id") && (sg.router.redirect("/company/" + b[e].detail_path + "?id=" + a + "&detail_id=" + f.data("id")), Log.action("click_btn_" + b[e].log_id))
		})
	}
}),
sg.View.define("company_equity_pledge_detail", {
	beforeRender: function(a) {
		sg.Model.get("/info/getPageInfo", !1, !0).getData({
			type: "epd_equity_pledge_detail",
			number: sg.router.getParam("detail_id"),
			id: sg.router.getParam("id")
		},
		function(b) {
			return b.errno || !b.data ? sg.Component.Notice({
				text: b.message
			}) : void a($.extend(b.data, {
				title: sg.router.current.title
			}))
		})
	}
}),
sg.View.define("company_judge_detail", {
	beforeRender: function(a) {
		sg.Model.get("/info/getPageInfo", !1, !0).getData({
			type: "jd_laws_detail",
			id: sg.router.getParam("detail_id")
		},
		function(b) {
			return b.errno || !b.data ? sg.Component.Notice({
				text: b.message
			}) : void a($.extend(b.data, {
				jd_title: sg.router.current.title
			}))
		})
	}
}),
sg.View.define("company_find_dishonest_detail", {
	beforeRender: function(a) {
		sg.Model.get("/info/getPageInfo", !1, !0).getData({
			type: "fdd_detail",
			id: sg.router.getParam("detail_id")
		},
		function(b) {
			return b.errno || !b.data ? sg.Component.Notice({
				text: b.message
			}) : void a($.extend(b.data, {
				title: sg.router.current.title
			}))
		})
	}
}),
sg.View.define("company_chattel_mortgage", {
	beforeRender: function(a) {
		var b = this;
		b.getData(0,
		function(b) {
			a({
				is_first: !0,
				list: b.list || [],
				title: sg.router.current.title,
				id: sg.router.getParam("id")
			})
		})
	},
	afterRender: function(a) {
		var b = this.$parent,
		c = this,
		d = 20,
		e = !a.list || a.list.length < d;
		sg.View.require("template_mortgages").render(a, b.find("#detail_content"));
		var f = $(window).height();
		$(window).bind("scroll",
		function() {
			if (!e) {
				var g = $(this);
				g.scrollTop() + 3 * f / 2 >= $("body").height() && c.getData(d,
				function(c) {
					e = !c.list || c.list.length < 20,
					e ? $("#loading_text").text("已加载全部") : $("#loading_text").remove(),
					d += 20,
					c.id = a.id,
					sg.View.require("template_mortgages").render(c, b.find("#detail_content"), null, 1)
				})
			}
		})
	},
	is_loading: !1,
	getData: function(a, b) {
		var c = this,
		d = c.$parent;
		c.is_loading || (c.is_loading = !0, sg.Model.get("/info/getInfoList", !0, !0).getData({
			type: "mortgages",
			start: a || 0,
			id: sg.router.getParam("id"),
			history: sg.router.getParam("history") || 0
		},
		function(e) {
			if (c.is_loading = !1, e.errno || !e.data) return void errorNotice(e.message);
			var f = e.data;
			0 == a && sg.Component.VipLimitTip(d, {
				access_count: f.access_count,
				total_limit: f.total_limit,
				access: f.access
			}),
			b(f)
		}))
	}
}),
sg.View.define("company_mortgage_detail", {
	beforeRender: function(a) {
		sg.Model.get("/info/getInfoDetail", !1, !0).getData({
			type: "mortgages",
			oid: sg.router.getParam("detail_id"),
			id: sg.router.getParam("id")
		},
		function(b) {
			return b.errno || !b.data ? sg.Component.Notice({
				text: b.message
			}) : void a($.extend(b.data, {
				title: sg.router.current.title
			}))
		})
	},
	afterRender: function() {
		$(".top_title").bind("click",
		function() {
			var a = $(this);
			a.next().toggleClass("hide_ele"),
			a.find(".normal_icon").toggleClass("icon_chevron_down").toggleClass("icon_chevron_up")
		})
	}
}),
sg.View.define("company_equity_freeze", {
	beforeRender: function(a) {
		var b = this;
		b.getData(0,
		function(b) {
			a({
				list: b.list,
				is_first: !0,
				title: sg.router.current.title,
				id: sg.router.getParam("id")
			})
		})
	},
	afterRender: function(a) {
		var b = this,
		c = b.$parent,
		d = 20,
		e = !a.list || a.list.length < d;
		sg.Component.HistoryInfoDisclaimer(c),
		sg.View.require("template_equity_freeze").render(a, c.find("#detail_content"));
		var f = $(window).height();
		$(window).bind("scroll",
		function() {
			if (!e) {
				var g = $(this);
				g.scrollTop() + 3 * f / 2 >= $("body").height() && b.getData(d,
				function(b) {
					e = !b.list || b.list.length < 20,
					e ? $("#loading_text").text("已加载全部") : $("#loading_text").remove(),
					d += 20,
					b.id = a.id,
					sg.View.require("template_equity_freeze").render(b, c.find("#detail_content"), null, 1)
				})
			}
		})
	},
	is_loading: !1,
	getData: function(a, b) {
		var c = this,
		d = c.$parent;
		c.is_loading || (c.is_loading = !0, sg.Model.get("/info/getInfoList", !0, !0).getData({
			type: "equity_freeze",
			start: a || 0,
			id: sg.router.getParam("id"),
			history: sg.router.getParam("history") || 0
		},
		function(e) {
			if (c.is_loading = !1, e.errno || !e.data) return void errorNotice(e.message);
			var f = e.data;
			0 == a && sg.Component.VipLimitTip(d, {
				access_count: f.access_count,
				total_limit: f.total_limit,
				access: f.access
			}),
			b(f)
		}))
	}
}),
sg.View.define("company_equity_freeze_detail", {
	beforeRender: function(a) {
		var b = this;
		sg.Model.get("/info/getInfoDetail", !0, !0).getData({
			type: "equity_freeze",
			oid: sg.router.getParam("detail_id"),
			id: sg.router.getParam("id")
		},
		function(c) {
			return b.is_loading = !1,
			c.errno || !c.data ? void errorNotice(c.message) : void a($.extend(c.data, {
				data: c.data,
				title: sg.router.current.title,
				id: sg.router.getParam("id")
			}))
		})
	},
	afterRender: function(a) {
		$(".top_title").bind("click",
		function() {
			var a = $(this);
			a.next().toggleClass("hide_ele"),
			a.find(".normal_icon").toggleClass("icon_chevron_down").toggleClass("icon_chevron_up")
		})
	}
}),
sg.View.define("company_doubtful_relation", {
	beforeRender: function(a) {
		var b = this;
		b.getData(0,
		function(b) {
			getProfileInfo(function(c) {
				a({
					profile_info: c,
					data: b,
					list: b.item,
					title: sg.router.current.title,
					static_api: config.static_api,
					image_api: config.image_api
				})
			})
		})
	},
	afterRender: function(a) {
		var b = this.$parent,
		c = this,
		d = 10,
		e = !a.list || a.list.length < d;
		if (a.list || a.data.total_limit != a.data.access_count) {
			sg.View.require("template_doubtful_relation").render(a, b.find("#list"));
			var f = $(window).height();
			$(window).bind("scroll",
			function() {
				if (!e) {
					var a = $(this);
					a.scrollTop() + 3 * f / 2 >= $("body").height() && c.getData(d,
					function(a) {
						e = !a.item || a.item.length < 10,
						d += 10,
						sg.View.require("template_doubtful_relation").render({
							data: a,
							list: a.item,
							static_api: config.static_api,
							image_api: config.image_api
						},
						b.find("#list"), null, 1)
					})
				}
			})
		}
	},
	is_loading: !1,
	getData: function(a, b) {
		var c = this;
		c.is_loading || (c.is_loading = !0, sg.Model.get("/info/getInfo", !0, !0).getData({
			type: "doubtful_relation",
			start: a || 0,
			pageSize: 10,
			company_id: sg.router.getParam("id")
		},
		function(a) {
			return c.is_loading = !1,
			a.errno || !a.data ? void errorNotice(a.message) : void b(a.data)
		}))
	}
}),
sg.View.define("company_beneficial_owner", {
	beforeRender: function(a) {
		var b = this;
		getProfileInfo(function(c) {
			return c.vip_flag ? void b.getData(0,
			function(b) {
				a({
					total: b.total,
					list: b.item,
					is_first: !0,
					title: sg.router.current.title,
					id: sg.router.getParam("id")
				})
			}) : a({
				no_vip: !0,
				title: sg.router.current.title
			})
		})
	},
	afterRender: function(a) {
		if (!a.no_vip) {
			var b = this.$parent;
			a.getTotal = function(a) {
				for (var b = 1,
				c = 0; c < a.length; c++) {
					var d = parseFloat(a[c]);
					isNaN(d) || (b *= d / 100)
				}
				return (100 * b).toFixed(2)
			},
			sg.View.require("template_beneficial_owner").render(a, b.find("#list")),
			$(".open_more").bind("click",
			function() {
				var a = $(this);
				a.parent().find(".path").removeClass("hide_ele"),
				a.remove()
			}),
			$(".reason_item").bind("click",
			function() {
				var b = $(this);
				sg.Component.Alert({
					title: "受益所有人说明",
					text: a.list[b.data("index")].reason,
					btnConfirm: {
						text: "我知道了"
					},
					btnCancel: !1
				})
			})
		}
	},
	is_loading: !1,
	getData: function(a, b) {
		var c = this;
		c.is_loading || (c.is_loading = !0, sg.Model.get("/info/getPageInfo", !0, !0).getData({
			type: "beneficiary_info",
			start: a || 0,
			id: sg.router.getParam("id")
		},
		function(a) {
			if (c.is_loading = !1, a.errno || !a.data) return void errorNotice(a.message);
			if (a = a.data, a.item && a.item.length) for (var d = 0; d < a.item.length; d++) {
				var e = a.item[d];
				e.path && $.each(e.path,
				function(b, c) {
					a.item[d].path[b] = c.replace(/-\(/g, "->").replace(/\)->/g, "->").split("->")
				})
			}
			b(a)
		}))
	}
}),
sg.View.define("company_visitor", {
	properties: {
		action_list: {
			view_company: "访问了你公司页面",
			view_product: "查看了你公司的",
			unlock_phone: "解锁了你公司的电话",
			dail_phone: "拨打了你公司的电话",
			find_by_addressbook: "在你的公司界面启用了通讯录雷达"
		}
	},
	beforeRender: function(a) {
		var b = this;
		b.getData(0,
		function(b) {
			a($.extend({
				is_first: !0,
				title: sg.router.current.title
			},
			b))
		})
	},
	formatTime: function(a, b) {
		return a *= 1e3,
		b ? new Date(a).Format("yyyy/MM/dd") : new Date(a).Format("hh:mm")
	},
	getActionText: function(a) {
		var b = [],
		c = this;
		for (var d in a) if (a.hasOwnProperty(d)) {
			var e = a[d],
			f = 1 == e.num ? "": '第<span class="num">' + e.num + "次</span>";
			"view_product" !== e.type ? b.push(f + c.action_list[e.type]) : b.push(f + c.action_list[e.type] + (e.product_name || "产品/服务"))
		}
		return b.join("，")
	},
	show_time: [],
	checkTime: function(a) {
		var b = this,
		c = Date.now(),
		d = !0;
		a *= 1e3;
		var e = "";
		return c - a > 6048e5 ? e = "更早之前": a < new Date((new Date).Format("yyyy/MM/dd 00:00:00")).getTime() ? e = "7天内": (d = !1, e = new Date(a).Format("yyyy/MM/dd")),
		b.show_time.indexOf(e) < 0 ? (b.show_time.push(e), {
			name: e,
			show_years: d
		}) : {
			name: "",
			show_years: d
		}
	},
	afterRender: function(a) {
		var b = this,
		c = $("#loading_text"),
		d = a.items && a.items.length ? a.items[a.items.length - 1].time: 0,
		e = !1;
		if (b.renderItem(a), 1 != a.auth_flag) return void Log.trace("show_unverified_list");
		Log.trace("show_verified_list");
		var f = $(window).height();
		$(window).bind("scroll",
		function() {
			if (!e) {
				var a = $(this);
				a.scrollTop() + 3 * f / 2 >= $("body").height() && b.getData(d,
				function(a) {
					e = !a.items || !a.items.length,
					e && c.text("已加载全部数据"),
					d = a.items && a.items.length ? a.items[a.items.length - 1].time: d,
					b.renderItem(a)
				})
			}
		})
	},
	renderItem: function(a) {
		var b = this;
		if (a.items) for (var c in a.items) {
			var d = b.checkTime(a.items[c].time);
			a.items[c].check_time = d.name,
			a.items[c].show_years = d.show_years
		}
		sg.View.require("template_company_visitor").render($.extend({
			getActionText: function(a) {
				return b.getActionText(a)
			},
			formatTime: b.formatTime,
			static_api: config.static_api,
			image_api: config.image_api
		},
		a), b.$parent.find("#list"), null, 1)
	},
	is_loading: !1,
	getData: function(a, b) {
		var c = this;
		c.is_loading || (c.is_loading = !0, sg.Model.get("/info/getCompanyVisitor", !0, !0).getData({
			last_timestamp: a
		},
		function(a) {
			return c.is_loading = !1,
			a.errno || !a.data ? void errorNotice(a.message) : void b(a.data)
		}))
	}
}),
sg.View.define("company_annual_report_list", {
	beforeRender: function(a) {
		a({
			title: sg.router.current.title
		})
	},
	afterRender: function(a) {
		var b = this,
		c = b.$parent,
		d = c.find(".report_list"),
		e = sg.router.getParam("id");
		sg.Component.ListView(d, {
			item_vm: "template_report_list",
			url: "/info/getinfo",
			params: {
				company_id: e,
				type: "bs_annual_list"
			},
			method: "POST",
			itemAfterRender: function(a) {
				a.find(".item").bind("click",
				function() {
					sg.router.redirect("/company/annual_report", {
						id: e,
						year: parseInt($(this).attr("data-year"))
					})
				})
			},
			onAjaxError: errorNotice,
			onError: errorNotice
		})
	}
}),
sg.View.define("company_annual_report", {
	props: {
		annual_model: sg.Model.get("/info/getinfo", !0, "POST")
	},
	beforeRender: function(a, b) {
		var c = this,
		d = sg.router.getParam("year"),
		e = sg.router.getParam("id");
		c.props.annual_model.getData({
			type: "bs_annual_report",
			company_id: e,
			year: d
		},
		function(b) {
			return b.errno ? (sg.Component.Notice({
				text: b.message
			}), a({
				data: {}
			})) : a({
				data: b.data,
				encodeURIComponent: window.encodeURIComponent,
				trim: $.trim,
				title: sg.router.current.title
			})
		})
	},
	afterRender: function() {
		var a = this.$parent;
		a.find(".report_title").bind("click",
		function() {
			if ($(this).hasClass("item")) {
				var a = $(this).siblings(".report_item_list");
				a.slideToggle(200);
				var b = $(this).find("i");
				b.toggleClass("rotation"),
				setTimeout(function() {
					b.toggleClass("icon_plus icon_minus rotation")
				},
				500)
			}
		}),
		a.find(".invest_item, .stock_company").bind("click",
		function() {
			var a = $(this).attr("data-id");
			a && sg.router.redirect("/company/detail", {
				id: a
			})
		}),
		a.find(".telephone").bind("click",
		function() {
			var a = $(this).attr("data-href");
			a && (location.href = a.replace("(", "").replace(")", "").replace("-", ""))
		}),
		a.find(".link").bind("click",
		function() {
			var a = $(this).attr("data-href");
			a && (/^http:\/\/|https:\/\/|tel:|mailto:\w/.test(a) || (a = "http://" + a), /^http:\/\/|https:\/\//.test(a) ? config.is_zdao ? ZDao.jump({
				url: a
			}) : window.open(a) : location.href = a)
		})
	}
}),
sg.View.define("company_client_list", {
	props: {
		data_model: sg.Model.get("/info/getinfo", !0, "POST")
	},
	beforeRender: function(a) {
		var b = this;
		b.props.data_model.getData({
			company_id: sg.router.getParam("id"),
			type: "homepage"
		},
		function(b) {
			return b.errno ? (sg.Component.Notice({
				text: b.message
			}), a({
				title: sg.router.current.title
			})) : void sg.fire("data_model_finished", b.data)
		}),
		sg.on("data_model_finished",
		function(b) {
			b.extend_info && b.extend_info.client_list && b.extend_info.client_list.length || sg.Component.Notice({
				text: "暂无主要客户"
			}),
			a({
				title: sg.router.current.title,
				json_encode: JSON.stringify,
				client_list: b.extend_info.client_list,
				image_api: config.image_api
			})
		})
	}
}),
sg.View.define("company_partner_list", {
	beforeRender: function(a, b) {
		a({
			title: sg.router.current.title
		})
	},
	afterRender: function() {
		var a = this.$parent;
		sg.View.require("partner_list")._render(a.find(".list"), {
			hide_title: !0,
			show_all: !0
		})
	}
}),
sg.View.define("company_foreign_investment", {
	beforeRender: function(a) {
		a({
			title: sg.router.current.title
		})
	},
	afterRender: function() {
		var a = this.$parent,
		b = a.find(".list"),
		c = a.find("#loading"),
		d = sg.router.getParam("id"),
		e = a.find("#btn_list_more"),
		f = {
			id: d,
			type: "bs_outbound_investment"
		};
		if (!d) return void sg.Component.Notice({
			text: "参数错误！"
		});
		c.show().loadingStart({
			position: "fixed"
		});
		var g = sg.Component.ListView(b, {
			item_vm: "foreign_investment_item",
			method: "POST",
			url: "/info/getPageInfo",
			params: f,
			limit: 10,
			format: {
				start: "start",
				limit: "pageSize"
			},
			itemBeforeRender: function(a) {
				a.item && (a.item = $.extend(a.item, {
					image_api: config.image_api,
					getYear: getYear
				}))
			},
			done: function(a, b, d) {
				c.hide().loadingStop(),
				d ? e.hide() : e.show()
			},
			onAjaxError: function(a) {
				c.hide().loadingStop(),
				sg.Component.Notice({
					text: "服务器繁忙，请稍后再试"
				})
			}
		});
		e.bind("click",
		function() {
			c.show().loadingStart(),
			g.append()
		})
	}
}),
sg.View.define("company_intellectual_property", {
	beforeRender: function(a) {
		a({
			title: sg.router.current.title
		})
	},
	afterRender: function() {
		function a(a) {
			var b;
			a && (b = e.find("[data-id=" + a + "]"), b.find(".top_title").trigger("click"))
		}
		function b(a, b, c) {
			var d = a.find(".list"),
			f = a.find(".btn_list_more");
			e.loadingStart();
			var g = sg.Component.ListView(d, {
				item_vm: c,
				method: "POST",
				url: "/info/getPageInfo",
				params: $.extend({},
				i, b),
				limit: 10,
				format: {
					start: "start",
					limit: "pageSize"
				},
				done: function(a, b, g) {
					e.loadingStop(),
					g ? f.hide().removeClass("more") : f.show().addClass("more"),
					h && (window.scrollTo(0, a.parents(".retract_expand_box").offset().top - $(".head_nav").height()), h = !1),
					"template_trademark" == c && e.find(".trademark_img").each(function() {
						setImgSrc($(this), "", $(this).data("src"))
					}),
					d.find(".domain_label").unbind("click").bind("click",
					function() {
						var a = $(this).data("url");
						config.is_zdao ? ZDao.jump({
							url: a
						}) : window.open(a)
					})
				},
				itemBeforeRender: function(a) {
					b.type == j.domain.type && ("http://" != a.item.home_url.substr(0, 7) && "https://" != a.item.home_url.substr(0, 8) ? a.item.home_href = "http://" + a.item.home_url: a.item.home_href = a.item.home_url)
				},
				onAjaxError: function(a) {
					e.loadingStop(),
					sg.Component.Notice({
						text: a && a.msg || "服务器繁忙，请稍后再试"
					})
				}
			});
			f.bind("click",
			function() {
				e.loadingStart(),
				g.append()
			})
		}
		var c = sg.Model.get("/info/getInfo", !0, !0),
		d = sg.View.require("template_ip_list"),
		e = this.$parent,
		f = e.find(".content_inner"),
		g = sg.router.getParam("id"),
		h = sg.router.current.params.type,
		i = {
			id: g
		};
		if (!g) return void sg.Component.Notice({
			text: "参数错误"
		});
		var j = {
			trademark: {
				type: "ip_trademark"
			},
			patent: {
				type: "ip_patent"
			},
			soft_right: {
				type: "ip_copyright",
				copy_right_type: "S"
			},
			original_right: {
				type: "ip_copyright",
				copy_right_type: "P"
			},
			domain: {
				type: "ip_domain"
			},
			certificate: {
				type: "ip_certify"
			}
		}; ! h && e.loadingStart(),
		c.getData({
			type: "homepage",
			company_id: g
		},
		function(c) {
			if (e.loadingStop(), !c || c.errno || !c.data) return "102" == c.errno || "256" == c.errno ? void getUserInfo(function(a) {
				a.is_login ? sg.Component.Notice({
					text: "查看次数已达上限"
				}) : location.href = "/user/login"
			}) : void sg.Component.Notice({
				text: c.message
			});
			var g = c.data;
			d.render({
				sum_data: g,
				is_camcard: config.is_camcard
			},
			f),
			e.find(".top_title").bind("click",
			function() {
				var a = $(this).parent(".retract_expand_box"),
				c = a.attr("data-id");
				parseInt(a.attr("data-count")) && (Log.action("click_title_" + c), a.hasClass("loaded") ? (a.find(".list").toggle(), a.find(".btn_list_more").hasClass("more") && a.find(".btn_list_more").toggle()) : (b(a, j[c], "template_" + c), a.addClass("loaded")), a.find(".top_title i").toggleClass("icon_chevron_down").toggleClass("icon_chevron_up"))
			}),
			fixTopBar("body", "retract_expand_box", "top_title", {
				position: "fixed",
				top: 45,
				zIndex: "10"
			}),
			h && a(h)
		})
	}
}),
sg.View.define("company_patent_info", {
	beforeRender: function(a) {
		a({
			title: sg.router.current.title
		})
	},
	afterRender: function() {
		var a = this.$parent,
		b = a.find("#patent_list"),
		c = sg.View.require("template_patent_info"),
		d = sg.router.getParam("id");
		return d ? void sg.Model.get("/info/getInfo", !0, !0).getData({
			id: d,
			type: "patent_detail"
		},
		function(d) {
			return d && !d.errno && d.data ? (c.render({
				data: d.data
			},
			b), void a.loadingStop()) : void sg.Component.Notice({
				text: "服务器繁忙，请稍后再试"
			})
		}) : void sg.Component.Notice({
			text: "参数错误"
		})
	}
}),
sg.View.define("company_employee_hire", {
	beforeRender: function(a) {
		a({
			title: sg.router.current.title
		})
	},
	afterRender: function() {
		var a = sg.router.getParam("id"),
		b = {
			id: a,
			type: "mg_recruit"
		};
		if (!a) return errorNotice("参数错误");
		var c = this.$parent,
		d = c.find("#btn_list_more"),
		e = sg.Component.ListView($("#list"), {
			item_vm: "employee_hire_item",
			method: "POST",
			url: "/info/getPageInfo",
			params: b,
			limit: 10,
			format: {
				start: "start",
				limit: "pageSize"
			},
			done: function(a, b, e) {
				c.loadingStop(),
				e > 0 ? d.hide() : d.show()
			},
			onAjaxError: function(a) {
				c.loadingStop(),
				sg.Component.Notice({
					text: a.msg || "服务器繁忙，请稍后再试"
				})
			}
		});
		d.bind("click",
		function() {
			c.loadingStart({
				position: "fixed"
			}),
			e.append()
		})
	}
}),
sg.View.define("company_news", {
	beforeRender: function(a) {
		a({
			title: sg.router.current.title
		})
	},
	afterRender: function() {
		var a = this.$parent,
		b = a.find(".list"),
		c = a.find("#loading"),
		d = sg.router.getParam("id"),
		e = a.find("#btn_list_more"),
		f = {
			id: d,
			type: "news"
		},
		g = this;
		if (!d) return void sg.Component.Notice({
			text: "参数错误！"
		});
		c.show().loadingStart({
			position: "fixed"
		});
		var h = sg.Component.ListView(b, {
			item_vm: "company_news_list",
			method: "POST",
			url: "/info/getPageInfo",
			params: f,
			limit: 10,
			format: {
				start: "start",
				limit: "pageSize"
			},
			done: function(a, b, d) {
				c.hide().loadingStop(),
				d ? e.hide() : e.show(),
				g.bindUrlRedirect()
			},
			onAjaxError: function(a) {
				c.hide().loadingStop(),
				sg.Component.Notice({
					text: "服务器繁忙，请稍后再试"
				})
			}
		});
		e.bind("click",
		function() {
			c.show().loadingStart(),
			h.append(),
			g.bindUrlRedirect()
		})
	},
	bindUrlRedirect: function() {
		var a = this.$parent;
		a.find(".item").unbind("click").bind("click",
		function() {
			var a = $(this).data("url");
			config.is_zdao ? ZDao.jump({
				url: a
			}) : window.open(a)
		})
	}
}),
sg.View.define("company_news_detail", {
	beforeRender: function(a) {
		sg.Model.get("/info/getNewsDetail", !0, !0).getData({
			id: sg.router.getParam("id"),
			cid: sg.router.getParam("cid")
		},
		function(b) {
			return b.errno || !b.data ? errorNotice() : void a($.extend({
				title1: sg.router.current.title,
				config: config,
				cid: sg.router.getParam("cid"),
				format: function(a) {
					return new Date(a).Format("yyyy-MM-dd")
				}
			},
			b.data))
		})
	},
	afterRender: function(a) {
		var b = this.$parent;
		b.find(".company").bind("click",
		function() {
			sg.router.redirect("/company/detail?id=" + $(this).data("id"))
		}),
		b.find(".related_news").bind("click",
		function() {
			sg.router.redirect("/company/news_detail?id=" + $(this).data("id"))
		})
	}
}),
sg.View.define("company_bid_tender", {
	beforeRender: function(a) {
		sg.Model.get("/info/getInfo", !0, "POST").getData({
			type: "tender_count",
			company_id: sg.router.getParam("id"),
			name: sg.router.getParam("name")
		},
		function(b) {
			return b.errno || !b.data ? errorNotice() : (b.data.title = sg.router.current.title, void a(b.data))
		})
	},
	afterRender: function() {
		var a = this.$parent,
		b = a.find(".bid_info"),
		c = a.find(".tender_info"),
		d = a.find("#bid_list"),
		e = a.find("#tender_list");
		b.bind("click",
		function() {
			b.addClass("active"),
			c.removeClass("active"),
			d.show(),
			e.hide()
		}),
		c.bind("click",
		function() {
			b.removeClass("active"),
			c.addClass("active"),
			d.hide(),
			e.show()
		}),
		c.trigger("click")
	}
}),
sg.View.define("tender_list", {
	afterRender: function(a) {
		if (a.count) {
			var b = this.$parent,
			c = b.find(".btn_list_more"),
			d = b.find(".tender_container"),
			e = sg.Component.ListView(d, {
				item_vm: "template_tender_item",
				url: "/info/getpageinfo",
				params: {
					name: sg.router.getParam("name"),
					type: "mg_tender",
					mtype: 1
				},
				format: {
					start: "start",
					limit: "pageSize"
				},
				method: "POST",
				onAjaxError: function(a) {
					errorNotice(a.message)
				},
				onError: function(a) {
					errorNotice(a.message)
				},
				done: function(a, b, e) {
					e ? c.hide() : c.show(),
					d.find(".item").unbind("click").bind("click",
					function() {
						var a = $(this).data("url");
						config.is_zdao ? ZDao.jump({
							url: a
						}) : window.open(a)
					})
				}
			});
			c.bind("click",
			function() {
				e.append()
			})
		}
	}
}),
sg.View.define("bid_list", {
	afterRender: function(a) {
		if (a.count) {
			var b = this.$parent,
			c = b.find(".btn_list_more"),
			d = b.find(".bid_container"),
			e = sg.Component.ListView(d, {
				item_vm: "template_bid_item",
				url: "/info/getpageinfo",
				params: {
					name: sg.router.getParam("name"),
					type: "mg_tender",
					mtype: 2
				},
				format: {
					start: "start",
					limit: "pageSize"
				},
				method: "POST",
				onAjaxError: errorNotice,
				onError: errorNotice,
				done: function(a, b, e) {
					e ? c.hide() : c.show(),
					d.find(".item").unbind("click").bind("click",
					function() {
						var a = $(this).data("url");
						config.is_zdao ? ZDao.jump({
							url: a
						}) : window.open(a)
					})
				}
			});
			c.bind("click",
			function() {
				e.append()
			})
		}
	}
}),
sg.View.define("company_staff_list", {
	beforeRender: function(a) {
		sg.Model.get("/info/getinfo", !0, !0).getData({
			type: "homepage",
			company_id: sg.router.getParam("id")
		},
		function(b) {
			return b.errno || !b.data ? (sg.Component.Notice({
				text: b.message
			}), void setTimeout(function() {
				goBack()
			},
			1e3)) : (b = b.data, void a({
				config: config,
				stringify: JSON.stringify,
				contact_list: b.contact_list,
				contact_list_count: b.contact_list_count,
				title: sg.router.current.title
			}))
		})
	},
	afterRender: function(a) {
		var b, c = sg.router.getParam("id"),
		d = sg.View.require("vm_person_list"),
		e = {
			102 : "今天搜索次数超限，请明天再试",
			101 : "搜索关键字不合法, 请更换关键字"
		},
		f = sg.Model.get("/info/searchPosts", !0, !0),
		g = this.$parent,
		h = g.find("#vp_input"),
		i = g.find("#pl_content");
		h.bind("input",
		function() {
			var j = $.trim(h.val());
			return j.length ? (b && clearTimeout(b), void(b = setTimeout(function() {
				g.loadingStart({
					position: "fixed"
				}),
				f.getData({
					id: c,
					keyword: j
				},
				function(a) {
					if (g.loadingStop(), j == $.trim(h.val())) return a.data ? void d.render({
						isFilter: 1,
						showSearch: 1,
						config: config,
						contact_list: a.data,
						str: a.data.length ? e[a.errno] : "筛选结果为空"
					},
					i) : (101 === a.errno ? errorNotice("搜索关键字不合法，请更换关键字") : errorNotice("服务器繁忙，请稍后再试"), !1)
				},
				function() {
					g.loadingStop()
				})
			},
			400))) : void d.refresh(a)
		}),
		g.find("#vp_form").bind("submit",
		function() {
			h.blur()
		})
	}
}),
sg.View.define("company_domain", {
	beforeRender: function(a) {
		a({
			title: sg.router.current.title
		})
	},
	afterRender: function() {
		var a = this.$parent,
		b = a.find(".list"),
		c = a.find(".btn_list_more");
		$("body").loadingStart();
		var d = sg.Component.ListView(b, {
			item_vm: "template_domain",
			method: "POST",
			url: "/info/getPageInfo",
			params: {
				type: "ip_domain",
				id: sg.router.getParam("id")
			},
			limit: 10,
			format: {
				start: "start",
				limit: "pageSize"
			},
			done: function(a, d, e) {
				$("body").loadingStop(),
				e ? c.hide().removeClass("more") : c.show().addClass("more"),
				b.find(".domain_label").unbind("click").bind("click",
				function() {
					var a = $(this).data("url");
					config.is_zdao ? ZDao.jump({
						url: a
					}) : window.open(a)
				})
			},
			itemBeforeRender: function(a) { / https ? :\ / \ //.test(a.item.home_url)?a.item.home_href=a.item.home_url:a.item.home_href="http://"+a.item.home_url},onAjaxError:function(a){$("body").loadingStop(),sg.Component.Notice({text:a.msg||"服务器繁忙，请稍后再试"})}});c.bind("click",function(){$("body").loadingStart(),d.append()})}}),sg.View.define("company_certificate",{beforeRender:function(a){a({title:sg.router.current.title})},afterRender:function(){var a=this.$parent,b=a.find(".list"),c=a.find(".btn_list_more");a.loadingStart();var d=sg.Component.ListView(b,{item_vm:"template_certificate",method:"POST",url:"/info/getPageInfo",params:{type:"ip_certify",id:sg.router.getParam("id")},limit:10,format:{start:"start",limit:"pageSize"},done:function(b,d,e){a.loadingStop(),e?c.hide().removeClass("more"):c.show().addClass("more")},onAjaxError:function(b){a.loadingStop(),errorNotice(b.msg)}});c.bind("click",function(){a.loadingStart(),d.append()})}}),sg.View.define("company_core_feature",{beforeRender:function(a){a({title:sg.router.current.title,static_api:config.static_api})},afterRender:function(){var a=this,b=a.$parent,c=sg.router.getParam("toast"),d=sg.router.getParam("id");b.find("#view_company").bind("click",function(){Log.action("click_shareholder"),sg.router.redirect("/company/detail",{id:d||"e8cdf5e0-97ad-4e1e-a8e4-29358f8a9866",toast:c,force_web:1})}),b.find("#search_company").bind("click",function(){Log.action("click_searchcorp"),sg.router.redirect("/search")}),b.find("#search_contact").bind("click",function(){Log.action("click_network"),sg.router.redirect("/search",{type:"person"})})}}),sg.View.define("company_want_contact_report",{beforeRender:function(a){var b=sg.router.getParam("cid");b?sg.Model.get("/info/getNameById",!1,!0).getData({cid:b},function(c){c=c.data,a(c&&c.name?{cid:b,name:c.name}:{cid:b})}):a()},afterRender:function(){var a,b=this,c=b.$parent,d=c.find("#btn_submit"),e=c.find("#title"),f=c.find("#company_name"),g=sg.router.getParam("cid");f.length?f.focus():e.focus(),g||sg.Component.AutoComplete(f,{updateList:function(b,c){var d=this;return b.length<2?void c.call(d,[]):(a&&clearTimeout(a),void(a=setTimeout(function(){sg.Model.get("/info/searchTip",!0,!0).getData({get_complete:1,keyword:b},function(a){if(!a.errno&&a.data&&$.trim(f.val())==b){var e=[];if(a.data.items&&a.data.items.length){e=a.data.items.slice(0,5);for(var g in e)e[g].text='<div class="recommend_item_company"> '+e[g].name+"</div>",e[g].value=$("<div></div>").html(e[g].name).text()}c.call(d,e)}})},300)))},onSelect:function(a){g=a.id}}),sg.Component.AutoComplete(e,{list:["销售代表","客户代表","销售工程师","渠道专员","区域销售专员","业务拓展专员","大客户销售代表","电话销售","在线销售","团购业务员","销售业务跟单","医药代表","经销商","招商经理","招商主管","招商专员","会籍顾问","其他","销售总监","销售经理","销售主管","客户总监","客户经理","客户主管","渠道总监","渠道销经理","区域销售经理","业务拓展经理","大客户销售经理","团购经理","医药销售经理","销售行政经理","销售行政专员","销售运营经理","销售运营专员","商务经理","商务专员","销售培训师","销售数据分析","客户服务总监","客户服务经理","客户服务主管","客户服务专员","投诉协调人员","客户咨询人员","在线服务","售前售后技术支持管理","售前售后技术支持工程师","呼叫中心客服","市场总监","市场经理","市场专员","市场营销经理","市场营销主管","市场营销专员","品牌经理","品牌主管","品牌专员","市场策划","文案策划","活动策划","活动执行","促销员","公关总监","公关经理","公关专员","媒介经理","媒介专员","媒介策划","政府事务管理","广告创意设计总监","广告创意设计经理","广告创意设计师","广告文案策划","广告美术指导","广告制作执行","广告客户总监","广告客户经理","广告客户主管","会展策划","会务经理","会务专员","广告会展项目管理","首席财务官CFO","财务总监","财务经理","财务主管","财务顾问","财务助理","财务分析","会计经理","会计师","会计助理","出纳员","审计经理","审计专员","税务经理","税务专员","成本经理","成本会计","资产管理","统计员","固定资产会计","成本管理员","人力资源总监","人力资源经理","人力资源主管","人力资源专员","培训经理","培训专员","招聘经理","招聘专员","企业培训师","猎头顾问","行政总监","行政经理","行政专员","助理/秘书/文员","前台/总机/接待","文档资料管理","打字/录入员","后勤人员","党工团干事","图书管理员","内勤人员","项目总监","项目经理","项目专员","广告/会展项目管理","IT项目总监","IT项目经理","通信项目管理","房地产项目配套工程师","房地产项目管理","证券/投资项目管理","保险项目经理","生产项目经理","生产项目工程师","汽车工程项目管理","电子电器项目管理","服装/纺织/皮革项目管理","咨询项目管理","能源/矿产项目管理","项目招投标","测试经理","测试工程师","化验/检验","认证/体系工程师/审核员","环境/健康/安全经理","供应商/采购质量管理","安全管理","安全消防","故障分析工程师","采购材料管理","首席执行官CEO","首席运营官COO","CTO/CIO","副总裁","分公司负责人","部门/事业部管理","总裁助理","总编/副总编","行长/副行长","校长/副校长","合伙人","办事处首席代表","投资人","策略发展总监","运营总监","董事长","总经理","总裁","副总经理","高级软件工程师","软件工程师","系统架构师","系统分析员","数据库开发工程师","ERP开发工程师","嵌入式开发工程师","WEB前端开发","语音/视频/图形开发","用户界面（UI）设计","用户体验（UE/UX）设计","网页设计","游戏设计/开发","游戏策划","游戏界面设计","系统集成工程师","算法工程师","仿真应用工程师","IOS开发工程师","Android开发工程师","Java开发工程师","PHP开发工程师","C语言工程师","脚本开发工程师","高级硬件工程师","硬件工程师","嵌入式硬件开发","互联网产品经理","互联网产品专员","互联网运营经理","互联网运营专员","网站编辑","SEO/SEM","产品总监","新媒体运营","网店店长","网店推广","网店客服","网店运营","产品运营","内容运营","数据运营","IT质量管理经理","IT质量管理工程师","系统测试","软件测试","硬件测试","配置管理工程师","信息技术标准化工程师","游戏测试","手机维修","信息技术经理","信息技术专员","IT技术支持","系统工程师","系统管理员","网络工程师","数据库管理员","计算机硬件维护工程师","ERP实施顾问","Helpdesk","通信技术工程师","通信研发工程师","数据通信工程师","移动通信工程师","电信网络工程师","电信交换工程师","有线传输工程师","无线通信工程师","通信电源工程师","通信标准化工程师","房地产项目策划","房地产项目招投标","房地产项目开发报建","房地产销售经理","房地产置业顾问","房地产评估","房地产中介","房地产资产管理","监察人员","高级建筑工程师","建筑工程师","建筑设计师","土木工程师","岩土工程","建筑制图","建筑工程测绘","道路/桥梁/隧道工程技术","水利/港口工程技术","架线管道工程技术","给排水/暖通/空调工程","室内装潢设计","幕墙工程师","园林景观设计","城市规划与设计","市政工程师","工程监理/质量管理","建筑施工现场管理","施工队长","建筑工程安全管理","软装设计师","工程总监","土建勘察","硬装设计师","橱柜设计师","物业经理","物业管理员","物业租赁/销售","物业维修","物业顾问","物业招商管理","监控维护","银行经理","银行大堂经理","银行客户总监","银行客户经理","银行客户代表","银行客户服务","综合业务经理","银行会计/柜员","公司业务","个人业务","信贷管理","外汇交易","清算人员","风险控制","个人业务部门经理","公司业务部门经理","高级客户经理","信用卡销售","银行柜员","证券总监","证券/期货/外汇经纪人","证券分析/金融研究","投资理财服务","投资银行业务","融资总监","融资经理","融资专员","股票/期货操盘手","资产评估","风险管理/控制/稽查","储备经理人","金融经济研究员","金融产品销售","基金项目经理","金融服务经理","投资经理","投资银行财务分析","保险业务管理","保险代理/经纪人/客户经理","保险顾问","保险产品策划","保险培训师","保险契约管理","核保理赔","汽车定损/车险理赔","保险精算师","客户服务","保险内勤","理财顾问","保险电销","信托服务","担保业务","拍卖师","典当业务","珠宝收藏品鉴定","采购总监","采购经理","采购专员","供应商开发","供应链管理","买手","外贸/贸易经理","贸易跟单","报关员","业务跟单经理","高级业务跟单","机动车司机","列车驾驶","船舶驾驶","飞机驾驶","公交/地铁乘务","列车乘务","船舶乘务","船员","航空乘务","地勤人员","安检员","驾驶教练","交通管理员","船长","代驾","物流总监","物流经理","物流专员","货运代理","运输经理","快递员","水运/空运/陆运操作","集装箱业务","单证员","仓库经理","物流调度","物流项目管理","搬运工","集装箱维护","物流销售","供应链总监","物料经理","海关事务管理","订单处理员","工厂厂长","生产总监","生成经理","车间主任","生产组长","生产运营管理","产品管理","生产计划","制造工程师","工艺工程师","工业工程师","生成设备管理","生成物料管理","包装工程师","总工程师","生产文员","设备主管","化验师","生产跟单","电子技术研发工程师","电子电器工程师","电器研发工程师","电路工程师","模拟电路设计","版图设计工程师","集成电路IC设计工程师","IC验证工程师","电子元器件工程师","射频工程师","无线电工程师","激光/光电子技术","光源/照明工程师","变压器与磁电工程师","电池电源开发","家用电器/数码产品研发","空调工程/设计","音频/视频工程师","安防系统工程师","电子电器设备工程师","电器工程师","电器设计","电器线路设计","线路结构设计","半导体设计","仪器/仪表/计量工程师","自动化工程师","现场应用工程师","电子工程师","音响工程师","汽车动力系统工程师","汽车总装工程师","车身设计工程师","汽车电子工程师","汽车机械工程师","汽车零部件设计师","汽车装配工艺工程师","安全性能工程师","汽车机构工程师","汽车电工","售后服务","加油站工作员","发动机工程师","汽车销售","汽车零配件销售","汽车售后服务","汽车维修保养","汽车质量管理","汽车装饰美容","二手车评估师","4S店管理","工程机械经理","机械设备经理","机械设备工程师","机械工程师","机械设计师","机械制图员","机械研发工程师","机械结构工程师","机械工艺/制程工程师","气动工程师","数控工程师","模具工程师","夹具工程师","注塑工程师","铸造/锻造工程师","机电工程师","材料工程师","机械维修保养","飞机设计与制造","列车设计与制造","列车维修保养","船舶设计与制造","维修经理","装配工程师","焊接工程师","冲压工程师","锅炉工程师","光伏系统工程师","汽车工程师","轨道交通工程师","数控编程","机修工","工装工程师","服装/纺织品设计","服装打样/制版","电脑放码员","裁床","样衣工","面料辅助开发/采购","服装/纺织品/皮革跟单","服装设计师","剪裁工","缝纫工","纺织工","配色工","印染工","漂染工","挡车工","鞋子设计","细纱工","车床/磨床/铣床/冲床工","模具工","钳工/机修工/钣金工","电焊工/铆焊工","电工","水工/木工/油漆工","铲车/叉车工","空调工/电梯工/锅炉工","汽车维修","普工/操作工","技工","组装工","包装工","电力线路工","拖压工","仪表工","电镀工","塑喷工","洗车工","洗碗工","瓦工","万能工","钢筋工","学徒工","药品市场推广","医疗器械销售","医药招商","医药项目管理","生物工程/生物制药","药品研发","医疗器械研发","临床研究员","药品注册","药品生产","医疗器械生产","医疗器械维修","医疗技术研发人员","化工工程师","化工研发工程师","化学分析","化学技术应用","化学操作","化学制剂研发","塑料工程师","配色技术员","橡胶工程师","化妆品研发","造纸研发","导演/编导","艺术指导","摄影师/摄像师","化妆师/造型师/服装/道具","主持人","演员/模特","配音员","音效师","后期制作","经纪人","放映管理","作家/编剧/撰稿人","文学编辑","美术编辑","记者/采编","电话采编","校对/录入","发行管理","排版设计","印刷排版","印刷操作","编辑出版","主笔设计师","放映员","灯光师","影视策划","调色员","烫金工","装订工","电分操作员","视频主播","设计管理员","艺术/设计总监","绘画","原画师","CAD设计","平面设计","3D设计","Flash设计/开发","特效设计","视觉设计","多媒体/动画设计","包装设计","家具设计","家居用品设计","工艺品/珠宝设计","玩具设计","店面/展览/陈列设计","工业设计","咨询总监","咨询经理","咨询顾问","专业顾问","调研员","数据分析师","情报信息分析","咨询师","幼教","小学教师","初中教师","高中教师","大学教师","职业技术教师","家教","大学教授","舞蹈老师","特殊教育","院士","辅导员","科学家","法务经理","法务专员","律师","律师助理","知识产权代理人","合同管理","合规管理","英语翻译","法语翻译","日语翻译","德语翻译","俄语翻译","西班牙语翻译","意大利语翻译","葡萄牙语翻译","阿拉伯语翻译","韩语翻译","其他语种翻译","店长","招商管理","大堂经理","酒店管理","客房管理","收银管理","收银员","店员/营业员/导购员","理货员","前台接待","行李员","服务员","门卫","试睡员","厨师/面点师","食品加工/处理","调酒师","营养师","厨工","食品研发","食品检验","行政主厨","点心师","送餐员","烧烤师","品酒师","发型师","化妆师","美容师","健身/舞蹈教练","按摩/足疗","救生员","游泳教练","医疗管理人员","内科医生","外科医生","儿科医生","牙科医生","中医","心理医生","理疗师","护士","院长","保安","家政人员","婚礼策划","宠物护理","保姆","保洁","钟点工","月嫂","家电维修","石油天然气技术人员","热能工程师","核力/火力工程师","水利工程师","电力工程师","地质勘探","能源项目管理","环保技术工程师","环境监测工程师","水处理工程师","废气处理工程师","环境管理/园林景区保护","插花设计师","农艺师","林业技术员","园艺师","畜牧师","动物养殖","镇长","区长","常委","巡视员","厅长","县长","委员","站长","科员","司长","所长","局长","市长"],
				updateList: function(a, b) {
					var c, d, e = this,
					f = e.options.list,
					g = [];
					if (a = $.trim(a), !a) return void b(g);
					for (c = 0, d = f.length; c < d && !(g.length >= 10); c++) f[c].toLowerCase().indexOf(a.toLowerCase()) > -1 && g.push({
						value: f[c],
						text: f[c].replace(a, '<span class="sg_autocomplete_li_hl">' + a + "</span>")
					});
					b(g)
				}
			}), d.on("click",
			function() {
				if (e.blur(), f.blur(), !g) return void sg.Component.Notice({
					text: "请从搜索建议中选择一家公司"
				});
				var a = e.val();
				return "" === a ? (sg.Component.Notice({
					text: "请填写职位"
				}), void e.focus()) : void sg.Model.get("/info/reportNeedContact", !1, !0).getData({
					cid: g,
					title: a
				},
				function(a) {
					return a.errno ? void sg.Component.Notice({
						text: a.message
					}) : (sg.Component.Notice({
						text: "反馈成功",
						type: 1
					}), void setTimeout(function() {
						goBack()
					},
					1e3))
				})
			})
		}
	}), sg.View.define("company_customs", {
		beforeRender: function(a) {
			var b = sg.router.getParam("cid");
			sg.Model.get("/info/getCreditIMData", !0, !0).getData({
				cid: b
			},
			function(b) {
				return b.errno ? void sg.Component.Notice({
					text: b.message
				}) : void a(b.data)
			})
		},
		afterRender: function() {
			var a = this,
			b = a.$parent;
			b.on("click", ".section_title",
			function() {
				$(this).parents(".section").toggleClass("open")
			})
		}
	}), sg.View.define("company_adm_licence", {
		beforeRender: function(a) {
			var b = sg.router.getParam("cid");
			sg.Model.get("/info/getAdmLicenseList", !0, !0).getData({
				cid: b
			},
			function(b) {
				return b.errno ? void sg.Component.Notice({
					text: b.message
				}) : void a({
					items: b.data
				})
			})
		},
		afterRender: function() {
			var a = this,
			b = a.$parent;
			b.on("click", ".section",
			function() {
				Log.action("click_licence_detail"),
				$(this).toggleClass("open")
			})
		}
	}), sg.View.define("company_partner_list_new", {
		afterRender: function() {
			var a = this,
			b = a.$parent,
			c = sg.router.getParam("id"),
			d = sg.router.getParam("type");
			b.find(".nav_item").on("click",
			function() {
				if (!$(this).hasClass("selected") && !$(this).hasClass("disabled")) {
					$(window).scrollTop(0);
					var a = $(this).data("value");
					b.find(".nav_item[data-value=" + a + "]").addClass("selected").siblings(".nav_item").removeClass("selected"),
					b.find("#" + a).show().siblings(".content").hide()
				}
			}),
			b.find(".content_list").on("click", ".person",
			function() {
				var a = $(this).data("pid"),
				b = $(this).data("eid");
				a && sg.router.redirect("/company/partner_detail", {
					pid: a
				}),
				b && sg.router.redirect("/company/detail", {
					id: b
				})
			}),
			sg.Model.get("/info/getInfo", !0, !0).getData({
				company_id: c,
				type: "partner_list"
			},
			function(a) {
				if (!a.errno) {
					if (a = a.data, a.manager_list) {
						var c = b.find("#member").is(":visible");
						c || b.find("#member").show(),
						sg.View.require("cpln_person_list")._render(b.find("#member"), {
							person_list: a.manager_list,
							static_api: config.static_api,
							block: "member"
						}),
						c || b.find("#member").hide(),
						b.find(".nav_item[data-value=" + (d || "member") + "]").trigger("click")
					} else b.find(".nav_item[data-value=member]").addClass("disabled");
					var c = b.find("#stock").is(":visible");
					c || b.find("#stock").show(),
					"NORMAL" == a.type ? a.stock_enti_list ? sg.View.require("cpln_person_list")._render(b.find("#stock"), {
						person_list: a.stock_enti_list,
						static_api: config.static_api,
						block: "stock"
					}) : b.find(".nav_item[data-value=stock]").addClass("disabled") : "XSB" == a.type ? a.stock_xsb_list ? sg.View.require("cpln_person_list")._render(b.find("#stock"), {
						person_list: a.stock_xsb_list,
						static_api: config.static_api,
						type: "XSB",
						block: "stock"
					}) : b.find(".nav_item[data-value=stock]").addClass("disabled") : "QUOTED" == a.type && (a.stock_top_ten_cir_list || a.stock_top_ten_list ? (a.stock_top_ten_cir_list && sg.View.require("cpln_person_list")._render(b.find("#stock"), {
						person_list: a.stock_top_ten_cir_list,
						static_api: config.static_api,
						type: "SDLT",
						block: "stock"
					},
					null, 1), a.stock_top_ten_list && sg.View.require("cpln_person_list")._render(b.find("#stock"), {
						person_list: a.stock_top_ten_list,
						static_api: config.static_api,
						type: "SD",
						block: "stock"
					},
					null, 1)) : b.find(".nav_item[data-value=stock]").addClass("disabled")),
					c || b.find("#stock").hide(),
					d ? b.find(".nav_item[data-value=" + d + "]").trigger("click") : a.stock_enti_list || a.stock_xsb_list || a.stock_top_ten_cir_list || a.stock_top_ten_list ? b.find(".nav_item[data-value=stock]").trigger("click") : a.manager_list && b.find(".nav_item[data-value=member]").trigger("click")
				}
			})
		}
	}), sg.View.define("company_partner_detail", {
		needCache: !1,
		properties: {
			cur_type: "",
			cur_start: 0,
			is_end: !1,
			is_ajax: !1,
			pid: ""
		},
		beforeRender: function(a) {
			var b = sg.router.getParam("pid"),
			c = this;
			c.pid = b,
			sg.Model.get("/user/testConfig", !1, !0).getData(function(c) {
				if (c.errno) return void sg.Component.Notice({
					text: c.message
				});
				c = c.data;
				var d = c.is_show_pay_entry;
				getProfileInfo(function(c) {
					var e = c.vip_flag;
					sg.Model.get("/info/getInfo", !1, !0).getData({
						pid: b,
						type: "partner_detail"
					},
					function(b) {
						return b.errno ? void(256 == b.errno ? (Log.trace("show_limit_daily"), a({
							is_over_limit: 1,
							is_android: config.is_android,
							is_show_pay_entry: d,
							is_zdao_mj: config.is_zdao_mj
						})) : sg.Component.Notice({
							text: b.message
						})) : (!e && (config.is_android || d && !config.is_zdao_mj) && Log.action("show_vip_guide"), b = b.data, b.is_vip = e, b.is_show_pay_entry = d, b.is_android = config.is_android, b.is_zdao_mj = config.is_zdao_mj, b.static_api = config.static_api, void a(b))
					})
				})
			})
		},
		afterRender: function(a) {
			var b = this,
			c = b.$parent,
			d = c.find("#company_list"),
			e = c.find("#btn_open_vip,#dvl_btn_open_vip");
			c.find(".nav_list").on("click", ".nav_item",
			function() {
				if (!$(this).hasClass("disabled")) {
					var a = $(this).data("type");
					"1" == a ? Log.action("click_tab_legalperson") : "2" == a ? Log.action("click_tab_shareholder") : Log.action("click_tab_executives"),
					b.is_end = !1,
					b.cur_start = 0,
					b.showRelateCompany(a)
				}
			});
			for (var f = 0,
			g = c.find(".nav_item").length; f < g; f++) if (!c.find(".nav_item").eq(f).hasClass("disabled")) {
				c.find(".nav_item").eq(f).trigger("click");
				break
			}
			$(window).bind("scroll", b.events.scroll),
			d.on("click", ".company_item",
			function() {
				var a = $(this).data("id");
				Log.action("click_company", {
					company_id: a
				}),
				sg.router.redirect("/company/detail", {
					id: a
				})
			}),
			e.on("click",
			function() {
				Log.action("click_buy_VIP"),
				sg.router.redirect("/qi/buy_product", {
					type: "vip"
				})
			});
			var h = c.find(".person_info"),
			i = c.find(".person_desc"),
			j = c.find(".btn_show_more"),
			k = c.find(".btn_hide_more");
			i.height() > 4 * parseInt(i.css("line-height")) && h.addClass("over_limit"),
			j.click(function() {
				h.removeClass("over_limit").addClass("show_more")
			}),
			k.click(function() {
				h.removeClass("show_more").addClass("over_limit")
			})
		},
		leave: function() {
			$(window).unbind("scroll", this.events.scroll)
		},
		restart: function() {
			$(window).bind("scroll", this.events.scroll)
		},
		events: {
			scroll: function() {
				var a = this;
				$(window).scrollTop() > $("body").outerHeight() - $(window).height() - 100 && a.showRelateCompany()
			}
		},
		showRelateCompany: function(a) {
			var b = this,
			c = b.pid,
			d = b.$parent,
			e = d.find("#company_list"),
			f = d.find("#loading_tip");
			b.is_ajax || b.is_end || (d.find(".nav_item[data-type=" + a + "]").addClass("selected").siblings(".nav_item").removeClass("selected"), a && (b.cur_type = a), b.is_ajax = !0, sg.Model.get("/info/getRelatedCompanyByPid", !1, !0).getData({
				pid: c,
				type: b.cur_type,
				start: b.cur_start
			},
			function(a) {
				if (b.is_ajax = !1, !a.errno) {
					a = a.data;
					var c = 0;
					b.cur_start && (c = 1),
					b.cur_start += a.items.length,
					sg.View.require("cpd_company_list")._render(e, {
						list: a.items,
						static_api: config.static_api
					},
					null, c),
					a.hasNextPage ? (b.is_end = !1, f.show()) : (b.is_end = !0, f.hide())
				}
			},
			function() {
				b.is_ajax = !1
			}))
		}
	}), sg.View.define("company_tax_rating", {
		beforeRender: function(a) {
			var b = sg.router.getParam("id");
			sg.Model.get("/info/getInfo", !0, !0).getData({
				company_id: b,
				type: "tax_rating"
			},
			function(b) {
				b.errno || (b = b.data, a(b))
			})
		}
	}), sg.View.define("company_judge_charts", {
		beforeRender: function(a) {
			sg.Model.get("/info/getLawSuitCount", !0, !0).getData({
				id: sg.utils.getUrlParam("id")
			},
			function(b) { ! b.errno && b.data || (errorNotice(b.message), b.data = {}),
				a({
					data: b.data,
					title: sg.router.current.title
				})
			})
		},
		afterRender: function(a) {
			var b = [" #27A5D3", "#9076EC", "#0082BF", "#73AC1A", "#F5B910", "#428CF1", "#6296BA", "#F5573E", "#B58E67", "#A5BBD1", " #32B7EA", "#2EB5A9", " #00A7CF", "#477DB2", " #FE8F12"];
			a = a.data,
			$("#btn_see_more").bind("click",
			function() {
				ZDao.jump({
					url: "zdao://zd/lawsuitlist?id=" + sg.utils.getUrlParam("id")
				})
			}),
			$("body").loadingStart(),
			require([config.static_api + "js/core/echarts.min.js"],
			function(c) {
				$("body").loadingStop();
				var d = [],
				e = $("#charts1"),
				f = {
					animation: !0,
					series: [{
						name: "访问来源",
						type: "pie",
						radius: [60, 80],
						center: ["50%", "50%"],
						data: d,
						silent: !0,
						label: {
							normal: {
								fontSize: 10,
								formatter: "{b} {c}次 \n({d}%)"
							}
						},
						itemStyle: {
							emphasis: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: "rgba(0, 0, 0, 0.5)"
							}
						}
					}],
					color: b
				};
				if (a.brief && a.brief.list && a.brief.list.length) {
					for (var g = c.init(e[0]), h = 0; h < a.brief.list.length; h++) {
						var i = a.brief.list[h];
						d.push({
							value: i["count(*)"],
							name: i.type || ""
						})
					}
					g.setOption(f),
					e.parent().scrollTop(120).scrollLeft(Math.abs(e.parent().width() - 600) / 2),
					d.length > 10 && e.parent().removeClass("hidden")
				} else e.remove();
				var j = [],
				k = $("#charts2"),
				l = {
					animation: !0,
					series: [{
						name: "访问来源",
						type: "pie",
						radius: [60, 80],
						center: ["50%", "50%"],
						data: j,
						silent: !0,
						label: {
							normal: {
								fontSize: 10,
								formatter: "{b} {c}次 \n({d}%)"
							}
						},
						itemStyle: {
							emphasis: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: "rgba(0, 0, 0, 0.5)"
							}
						}
					}],
					color: b
				};
				if (a.case_role && a.case_role.list && a.case_role.list.length) {
					for (var m = c.init(k[0]), h = 0; h < a.case_role.list.length; h++) {
						var i = a.case_role.list[h];
						j.push({
							value: i["count(*)"],
							name: i.role || ""
						})
					}
					m.setOption(l),
					k.parent().scrollTop(120).scrollLeft(Math.abs(k.parent().width() - 600) / 2),
					j.length > 10 && k.parent().removeClass("hidden")
				} else k.remove();
				var n = [],
				o = [],
				p = {
					animation: !0,
					title: {
						show: !1
					},
					grid: {
						left: "40px",
						top: "15px",
						right: "15px"
					},
					xAxis: {
						type: "category",
						data: n,
						splitLine: {
							show: !0,
							lineStyle: {
								color: "#e9e9e9"
							}
						},
						axisTick: {
							show: !1
						},
						axisLine: {
							lineStyle: {
								color: "#999"
							}
						}
					},
					yAxis: {
						type: "value",
						splitLine: {
							lineStyle: {
								color: "#e9e9e9"
							}
						},
						axisTick: {
							show: !1
						},
						axisLine: {
							lineStyle: {
								color: "#999"
							}
						}
					},
					series: [{
						data: o,
						type: "line",
						silent: !0,
						itemStyle: {
							normal: {
								color: "#4D87EE"
							}
						},
						symbol: "circle",
						symbolSize: 8
					}]
				};
				if (a.year_date && a.year_date.list && a.year_date.list.length) {
					for (var q = c.init($("#charts3")[0]), h = 0; h < a.year_date.list.length; h++) {
						var i = a.year_date.list[h];
						"1000" == i.year_date || isNaN(i.year_date) || (n.push(i.year_date), o.push(i["count(*)"] || 0))
					}
					q.setOption(p)
				} else $("#charts3").remove()
			})
		}
	}), sg.View.define("company_social_security_list", {
		beforeRender: function(a) {
			a({
				title: sg.router.current.title
			})
		},
		afterRender: function(a) {
			var b = this,
			c = b.$parent,
			d = c.find(".security_list"),
			e = sg.router.getParam("id");
			sg.Component.ListView(d, {
				item_vm: "template_security_list",
				url: "/info/getQixinbaoInfo",
				params: {
					company_id: e,
					type: "social_security_list"
				},
				method: "POST",
				itemAfterRender: function(a) {
					a.find(".item").bind("click",
					function() {
						$(this).attr("data-gongshang") && sg.router.redirect("/company/social_security_detail", {
							id: e,
							year: parseInt($(this).attr("data-year")),
							gongshang: $(this).attr("data-gongshang"),
							shengyu: $(this).attr("data-shengyu"),
							shiye: $(this).attr("data-shiye"),
							yanglao: $(this).attr("data-yanglao"),
							yiliao: $(this).attr("data-yiliao")
						})
					})
				},
				onAjaxError: errorNotice,
				onError: errorNotice
			})
		}
	}), sg.View.define("company_social_security_detail", {
		beforeRender: function(a) {
			var b = sg.router.getParam("year"),
			c = (sg.router.getParam("id"), sg.router.getParam("gongshang")),
			d = sg.router.getParam("shengyu"),
			e = sg.router.getParam("shiye"),
			f = sg.router.getParam("yanglao"),
			g = sg.router.getParam("yiliao"),
			h = b + "年度社保缴纳详情";
			sg.utils.setTitle(h),
			a({
				old_age_insurance: f,
				unemploy_insurance: e,
				medical_insurance: g,
				work_related_insurance: c,
				birth_insurance: d
			})
		}
	}), sg.View.define("company_official_accounts", {
		properties: {
			start: 0,
			pageSize: 10,
			isEnd: !1,
			isLoading: !1
		},
		beforeRender: function(a) {
			a({
				title: sg.router.current.title,
				static_api: config.static_api,
				image_api: config.image_api
			})
		},
		renderPage: function(a) {
			var b = this,
			c = b.$parent,
			d = c.find(".accounts_list"),
			e = b.start,
			f = sg.router.getParam("id");
			b.isEnd || b.isLoading || (b.isLoading = !0, 0 == e && c.loadingStart(), sg.Model.get("/info/getQixinbaoInfo", !1, !0).getData({
				start: e,
				pageSize: b.pageSize,
				company_id: f,
				type: "official_accounts"
			},
			function(f) {
				if (b.isLoading = !1, 0 == e && c.loadingStop(), f.errno) return void sg.Component.Notice({
					text: f.message
				});
				f = f.data,
				c.find(".loading").remove(),
				c.find(".inner_loading").remove();
				var g = !f.total || e + f.list.length == f.total,
				h = 1;
				b.isEnd = g,
				0 === e && (h = 0, d.scrollTop(0)),
				sg.View.require("template_accounts_list").render({
					list: f.list,
					is_end: g,
					start: e,
					static_api: config.static_api,
					image_api: config.image_api
				},
				d, null, h);
				var i = d.find(".company_description");
				i.each(function(a, b) {
					var c = ($(b).find(".btn_show_more"), $(b).find(".content"));
					c.height() > 2 * parseInt(c.css("line-height")) && $(b).addClass("over_limit")
				}),
				a && a(f)
			},
			function() {
				b.isLoading = !1
			}))
		},
		afterRender: function(a) {
			var b = this,
			c = b.$parent,
			d = c.find(".accounts_list"),
			e = $("#qrcode_mask"),
			f = $(".mask");
			sg.router.getParam("id");
			b.renderPage(),
			d.on("scroll",
			function() {
				b.isEnd || b.isLoading || d[0].scrollHeight - d.scrollTop() - d.height() < 50 && (b.start += b.pageSize, b.renderPage())
			}),
			d.on("click", ".btn_show_more",
			function() {
				Log.trace("click_wechat_detail");
				var a = $(this),
				b = a.parent(".company_description");
				b.removeClass("over_limit").addClass("show_more")
			}),
			d.on("click", ".icon_ic_qr_code",
			function() {
				Log.trace("click_wechat_QRcode");
				var a = $(this),
				b = a.data("qr-code"),
				c = a.data("company-name");
				e.show(),
				f.show(),
				sg.View.require("qrcode_mask").render({
					company_name: c,
					qr_code_url: b
				},
				e),
				e.on("click", ".qrcode_save_container",
				function(a) {
					a.stopPropagation()
				}).on("click",
				function() {
					$("#qrcode_mask").hide(),
					f.hide()
				})
			})
		}
	}), sg.View.define("company_land_information", {
		beforeRender: function(a) {
			a({
				title: sg.router.current.title
			})
		},
		afterRender: function() {
			var a = sg.View.require("template_land_info"),
			b = this.$parent,
			c = b.find(".business_list"),
			d = sg.router.getParam("id");
			return d ? (b.loadingStart({
				position: "fixed"
			}), void sg.Model.get("/info/getQixinbaoInfo", !0, !0).getData({
				company_id: d,
				type: "land_information"
			},
			function(e) {
				function f(a) {
					return a.split(" ")[0]
				}
				if (b.loadingStop(), !e || e.errno || !e.data) return void sg.Component.Notice({
					text: e.message || "服务器繁忙，请稍后再试"
				});
				e = e.data,
				a.render({
					data: e,
					encodeURIComponent: encodeURIComponent,
					trim: $.trim,
					trimReleaseTime: f
				},
				c);
				var g = c.find(".business_item_list");
				g.each(function(a, b) {
					var c = $(b).find(".btn_show_more"),
					e = $(b).find(".content"),
					f = $(e.find(".business_item_inner")[0]);
					e.height() > 3 * f.height() + 30 && ($(b).addClass("over_limit"), $(b).height(3 * f.height() + 80), c.css({
						top: 3 * f.height() + 30
					})),
					c.click(function() {
						var a = this,
						b = $(a),
						c = b.data("type");
						sg.router.redirect("/company/land_information_list", {
							id: d,
							type: c
						})
					})
				}),
				c.find(".business_title").bind("click",
				function() {
					var a = $(this).siblings(".business_item_list");
					a.toggle(),
					$(this).find("i").toggleClass("icon_chevron_down").toggleClass("icon_chevron_up")
				}),
				c.on("click", ".business_item_inner",
				function() {
					var a = this,
					b = $(a),
					c = b.data("index"),
					e = b.data("type");
					sg.router.redirect("/company/land_information_detail", {
						id: d,
						type: e,
						index: c
					})
				})
			})) : void sg.Component.Notice({
				text: "参数错误！"
			})
		}
	}), sg.View.define("company_land_information_list", {
		needCache: !1,
		properties: {
			start: 0,
			pageSize: 20,
			isEnd: !1,
			isLoading: !1
		},
		beforeRender: function(a) {
			var b = (sg.router.getParam("id"), sg.router.getParam("type")),
			c = ""; !
			function() {
				switch (b) {
				case "publicity":
					c = "地块公示";
					break;
				case "bulletin":
					c = "结果公示";
					break;
				case "transfer":
					c = "土地转让";
					break;
				case "mortgage":
					c = "土地抵押";
					break;
				case "land_purchase":
					c = "房地产大企业购地";
					break;
				case "sell":
					c = "房地产大地块出让"
				}
			} (),
			sg.utils.setTitle(c),
			a()
		},
		renderPage: function(a) {
			var b = this,
			c = b.$parent,
			d = c.find("#list"),
			e = b.start,
			f = b.pageSize,
			g = sg.router.getParam("id"),
			h = sg.router.getParam("type");
			return b.isEnd || b.isLoading ? (console.log($(".business_list")), void $(".business_list").css("bottom", "15px")) : (b.isLoading = !0, 0 == e && c.loadingStart(), void sg.Model.get("/info/getGoudiInfo", !0, !0).getData({
				company_id: g,
				type: h,
				start: e,
				pageSize: f
			},
			function(f) {
				if (b.isLoading = !1, 0 == e && c.loadingStop(), !f || f.errno || !f.data) return void sg.Component.Notice({
					text: f.message || "服务器繁忙，请稍后再试"
				});
				f = f.data,
				c.find(".loading").remove(),
				c.find(".inner_loading").remove();
				var g = !f[h].total || e + f[h].list.length == f[h].total,
				i = 1;
				b.isEnd = g,
				0 === e && (i = 0, d.scrollTop(0));
				var j = sg.View.require("template_business_info_list");
				j.render({
					data: f,
					is_end: g,
					start: e,
					encodeURIComponent: encodeURIComponent,
					trim: $.trim,
					trimReleaseTime: b.trimReleaseTime
				},
				d,
				function() {},
				i),
				a && a(f)
			},
			function() {
				b.isLoading = !1
			}))
		},
		trimReleaseTime: function(a) {
			return a.split(" ")[0]
		},
		afterRender: function() {
			var a = this,
			b = a.$parent,
			c = b.find("#list");
			a.renderPage(),
			c.bind("scroll",
			function() {
				a.isEnd || a.isLoading || c[0].scrollHeight - c.scrollTop() - c.height() < 20 && (a.start += a.pageSize, a.renderPage())
			}),
			c.on("click", ".business_item_inner",
			function() {
				var a = this,
				b = $(a),
				c = sg.router.getParam("id"),
				d = sg.router.getParam("type"),
				e = b.data("index");
				sg.router.redirect("/company/land_information_detail", {
					id: c,
					type: d,
					index: e
				})
			})
		}
	}), sg.View.define("company_land_information_detail", {
		beforeRender: function(a) {
			var b = sg.router.getParam("type"),
			c = ""; !
			function() {
				switch (b) {
				case "publicity":
					c = "地块公示";
					break;
				case "bulletin":
					c = "结果公示";
					break;
				case "transfer":
					c = "土地转让";
					break;
				case "mortgage":
					c = "土地抵押";
					break;
				case "land_purchase":
					c = "房地产大企业购地";
					break;
				case "sell":
					c = "房地产大地块出让"
				}
			} (),
			sg.utils.setTitle(c),
			a()
		},
		afterRender: function() {
			function a(a) {
				return a.split(" ")[0]
			}
			function b(a, b) {
				for (var c = a.split(","), d = b.split(","), e = {},
				f = 0; f < c.length; f++) {
					var g = {};
					g.company_name = c[f],
					g.company_cid = d[f],
					e[f] = g
				}
				return e
			}
			var c = sg.View.require("template_business_info_detail"),
			d = this.$parent,
			e = d.find(".business_detail"),
			f = sg.router.getParam("id"),
			g = sg.router.getParam("type"),
			h = sg.router.getParam("index");
			return f ? (d.loadingStart({
				position: "fixed"
			}), sg.Model.get("/info/getGoudiInfo", !0, !0).getData({
				company_id: f,
				type: g,
				start: h,
				pageSize: 1
			},
			function(f) {
				return d.loadingStop(),
				f && !f.errno && f.data ? (f = f.data, void c.render({
					data: f[g].list[0],
					company_before: b(f[g].list[0].name_before, f[g].list[0].eid_before),
					company_after: b(f[g].list[0].name_after, f[g].list[0].eid_after),
					type: g,
					encodeURIComponent: encodeURIComponent,
					trim: $.trim,
					trimReleaseTime: a,
					companySplit: b
				},
				e)) : void sg.Component.Notice({
					text: f.message || "服务器繁忙，请稍后再试"
				})
			}), void e.on("click", ".accept_unit",
			function() {
				var a = this,
				b = $(a),
				c = b.data("cid");
				console.log(1),
				sg.router.redirect("/company/detail", {
					id: c
				})
			})) : void sg.Component.Notice({
				text: "参数错误！"
			})
		}
	}), sg.View.define("company_company_pledgee", {
		properties: {
			start: 0,
			pageSize: 10,
			isEnd: !1,
			isLoading: !1
		},
		beforeRender: function(a) {
			a()
		},
		renderPage: function(a) {
			var b = this,
			c = b.$parent,
			d = c.find("#list"),
			e = b.start,
			f = sg.router.getParam("id");
			b.isEnd || b.isLoading || (b.isLoading = !0, 0 == e && c.loadingStart(), sg.Model.get("/info/getQixinbaoInfo", !1, !0).getData({
				start: e,
				pageSize: b.pageSize,
				company_id: f,
				type: "company_pledgee"
			},
			function(f) {
				if (b.isLoading = !1, 0 == e && c.loadingStop(), f.errno) return void sg.Component.Notice({
					text: f.message
				});
				f = f.data,
				c.find(".loading").remove(),
				c.find(".inner_loading").remove();
				var g = !f.total || e + f.list.length == f.total,
				h = 1;
				b.isEnd = g,
				0 === e && (h = 0, d.scrollTop(0)),
				sg.View.require("template_company_pledgee_list").render({
					list: f.list,
					is_end: g,
					start: e
				},
				d,
				function() {},
				h),
				a && a(f)
			},
			function() {
				b.isLoading = !1
			}))
		},
		afterRender: function() {
			var a = this,
			b = a.$parent,
			c = b.find(".company_pledgee_list"),
			d = sg.router.getParam("id");
			a.renderPage(),
			c.on("scroll",
			function() {
				a.isEnd || a.isLoading || c[0].scrollHeight - c.scrollTop() - c.height() < 50 && (a.start += a.pageSize, a.renderPage())
			}),
			c.on("click", ".business_item_inner",
			function() {
				var a = this,
				b = $(a),
				c = b.data("index");
				sg.router.redirect("/company/company_pledgee_detail", {
					id: d,
					index: c
				})
			})
		}
	}), sg.View.define("company_company_pledgee_detail", {
		beforeRender: function(a) {
			var b = sg.router.getParam("id"),
			c = sg.router.getParam("index");
			sg.Model.get("/info/getQixinbaoInfo", !1, !0).getData({
				company_id: b,
				type: "company_pledgee",
				start: c,
				pageSize: 1
			},
			function(b) {
				return b.errno ? void sg.Component.Notice({
					text: b.msg
				}) : (b = b.data.list, void a({
					data: b[0]
				}))
			})
		},
		afterRender: function() {
			var a = this,
			b = a.$parent;
			b.on("click", ".highlight",
			function() {
				var a = this,
				b = $(a),
				c = b.data("cid");
				sg.router.redirect("/company/detail", {
					id: c
				})
			})
		}
	}), sg.View.define("company_record_information", {
		properties: {
			start: 0,
			pageSize: 10,
			isEnd: !1,
			isLoading: !1
		},
		beforeRender: function(a) {
			a()
		},
		renderPage: function(a) {
			var b = this,
			c = b.$parent,
			d = c.find("#list"),
			e = b.start,
			f = sg.router.getParam("id");
			b.isEnd || b.isLoading || (b.isLoading = !0, 0 == e && c.loadingStart(), sg.Model.get("/info/getQixinbaoInfo", !1, !0).getData({
				start: e,
				pageSize: b.pageSize,
				company_id: f,
				type: "record_information"
			},
			function(g) {
				if (b.isLoading = !1, 0 == e && c.loadingStop(), g.errno) return void sg.Component.Notice({
					text: g.message
				});
				g = g.data,
				c.find(".loading").remove(),
				c.find(".inner_loading").remove();
				var h = !g.total || e + g.list.length == g.total,
				i = 1;
				b.isEnd = h,
				0 === e && (i = 0, d.scrollTop(0)),
				sg.View.require("template_record_list").render({
					list: g.list,
					is_end: h,
					start: e,
					company_id: f
				},
				d,
				function() {},
				i),
				a && a(g)
			},
			function() {
				b.isLoading = !1
			}))
		},
		afterRender: function() {
			var a = this,
			b = a.$parent,
			c = b.find(".record_list"),
			d = sg.router.getParam("id");
			a.renderPage(),
			c.on("scroll",
			function() {
				a.isEnd || a.isLoading || c[0].scrollHeight - c.scrollTop() - c.height() < 50 && (a.start += a.pageSize, a.renderPage())
			}),
			c.on("click", ".business_item_inner",
			function() {
				var a = this,
				b = $(a),
				c = b.data("index");
				sg.router.redirect("/company/record_information_detail", {
					id: d,
					index: c
				})
			})
		}
	}), sg.View.define("company_record_information_detail", {
		beforeRender: function(a) {
			var b = sg.router.getParam("id"),
			c = sg.router.getParam("index");
			sg.Model.get("/info/getQixinbaoInfo", !1, !0).getData({
				company_id: b,
				type: "record_information",
				start: c,
				pageSize: 1
			},
			function(b) {
				return b.errno ? void sg.Component.Notice({
					text: b.msg
				}) : (b = b.data.list, void a({
					data: b[0]
				}))
			})
		},
		afterRender: function() {
			var a = this,
			b = a.$parent;
			b.on("click", ".highlight",
			function() {
				var a = this,
				b = $(a),
				c = b.data("cid");
				sg.router.redirect("/company/detail", {
					id: c
				})
			})
		}
	}), sg.View.define("company_check_up_list", {
		properties: {
			start: 0,
			limit: 20,
			companyId: "",
			isEnd: !1,
			isLoading: !1
		},
		afterRender: function() {
			var a = this,
			b = a.$parent,
			c = b.find("#list");
			a.companyId = sg.router.getParam("company_id"),
			sg.Component.HistoryInfoDisclaimer(c),
			a.renderPage(),
			c.on("scroll",
			function() {
				a.isEnd || a.isLoading || c[0].scrollHeight - c.scrollTop() - c.height() < 50 && (a.start += a.limit, a.renderPage())
			})
		},
		renderPage: function(a) {
			var b = this;
			if (!b.isEnd && !b.isLoading) {
				var c = b.$parent,
				d = c.find("#list"),
				e = b.start;
				b.isLoading = !0,
				0 == e && c.loadingStart(),
				sg.Model.get("/info/get_middleware_info", !1, !0).getData({
					type: "check_up_list",
					company_id: b.companyId,
					start: e,
					pageSize: b.limit
				},
				function(f) {
					if (b.isLoading = !1, 0 == e && c.loadingStop(), f.errno) return void sg.Component.Notice({
						text: f.message
					});
					f = f.data,
					c.find(".loading").remove();
					var g = !f.total || e + f.list.length == f.total;
					b.isEnd = g,
					sg.View.require("template_ccul_list")._render(d, {
						list: f.list,
						is_end: g
					},
					null, 1),
					a && a(f)
				},
				function() {
					b.isLoading = !1
				})
			}
		}
	}), sg.View.define("company_recruit_info", {
		properties: {
			colorList: ["#5687ED", "#C2CEF2", "#F1BC03", "#EE9200", "#43BCA6", "#3595E3"],
			start: 0,
			limit: 20,
			companyId: "",
			isEnd: !1,
			isLoading: !1
		},
		beforeRender: function(a) {
			var b = this;
			b.companyId = sg.router.getParam("company_id"),
			sg.Model.get("/info/get_recruit_info", !1, !0).getData({
				company_id: b.companyId
			},
			function(b) {
				a(b.data)
			})
		},
		afterRender: function(a) {
			var b = this,
			c = b.$parent,
			d = c.find(".cri_list");
			$(window).on("scroll", b.events.scroll),
			b.renderPage(),
			d.on("click", ".item",
			function() {
				var a = $(this).data("job_id");
				a && ZDao.jump({
					url: config.zdao_zhaopin_url + "/job/detail?id=" + a
				})
			}),
			c.find(".btn_show_more").on("click",
			function() {
				Log.action("data_analysis"),
				c.find(".btn_show_more").remove(),
				c.find(".legend_item").show(),
				require([config.static_api + "js/core/echarts.min.js"],
				function(a) {
					c.find(".legend_content").each(function() {
						var b = a.getInstanceByDom(this);
						b && b.resize()
					})
				})
			}),
			require([config.static_api + "js/core/echarts.min.js"],
			function(c) {
				b._renderJobDistPerMonth(c, a.jobDistPerMonth),
				b._renderJobDistByArea(c, a.jobDistByArea),
				b._renderEduDemand(c, a.eduDemand),
				b._renderExpDemand(c, a.expDemand)
			})
		},
		renderPage: function(a) {
			var b = this;
			if (!b.isEnd && !b.isLoading) {
				var c = b.$parent,
				d = c.find(".cri_list"),
				e = b.start;
				b.isLoading = !0,
				0 == e && c.loadingStart({
					position: "fixed"
				}),
				sg.Model.get("/info/getInfo", !1, !0).getData({
					type: "job_list",
					company_id: b.companyId,
					start: e,
					pageSize: b.limit
				},
				function(f) {
					if (b.isLoading = !1, 0 == e && c.loadingStop(), f.errno) return void sg.Component.Notice({
						text: f.message
					});
					f = f.data,
					c.find(".loading").remove();
					var g = !f.total || e + f.items.length == f.total;
					b.isEnd = g;
					for (var h = f.items,
					i = 0,
					j = h.length; i < j; i++) {
						var k = [];
						h[i].location && k.push(h[i].location),
						h[i].education && k.push(h[i].education),
						h[i].years && k.push(h[i].years),
						h[i].desc = k.join(" | ")
					}
					sg.View.require("template_cri_list")._render(d, {
						list: f.items,
						is_end: g
					},
					null, 1),
					a && a(f)
				},
				function() {
					b.isLoading = !1
				})
			}
		},
		leave: function() {
			var a = this;
			$(window).off("scroll", a.events.scroll)
		},
		restart: function() {
			$(window).on("scroll", self.events.scroll)
		},
		events: {
			scroll: function() {
				var a = this;
				a.isEnd || a.isLoading || document.body.scrollHeight - $(window).scrollTop() - $(window).height() < 50 && (a.start += a.limit, a.renderPage())
			}
		},
		_renderExpDemand: function(a, b) {
			if (b) {
				for (var c = this,
				d = c.$parent,
				e = a.init(d.find("#exp_demand")[0]), f = [], g = [], h = 0, i = 0, j = b.value.data.length; i < j; i++) {
					var k = b.value.data[i],
					l = Math.ceil(parseFloat(k[1]));
					if (i === b.value.data.length - 1) g.push(100 - h);
					else {
						if (h + l >= 100) {
							g.push(100 - h),
							f.push(k[0].replace(/ /g, ""));
							break
						}
						g.push(l),
						h += l
					}
					f.push(k[0].replace(/ /g, ""))
				}
				e.setOption({
					xAxis: {
						type: "category",
						data: f,
						axisLine: {
							show: !1
						},
						axisTick: {
							show: !1
						},
						axisLabel: {
							color: "#333333",
							fontSize: 9,
							interval: 0
						}
					},
					yAxis: {
						type: "value",
						axisLine: {
							show: !1
						},
						axisTick: {
							show: !1
						},
						axisLabel: {
							show: !1
						},
						splitLine: {
							show: !1
						}
					},
					grid: {
						left: "0",
						right: "15px",
						bottom: "15px",
						top: "35px",
						containLabel: !0
					},
					series: [{
						data: g,
						type: "bar",
						label: {
							normal: {
								show: !0,
								position: "top",
								formatter: function(a) {
									return a.data + b.value.lable_y
								}
							}
						},
						itemStyle: {
							normal: {
								color: "#4D87EE",
								barBorderRadius: [9, 9, 0, 0]
							}
						},
						barWidth: 18
					}]
				})
			}
		},
		_renderEduDemand: function(a, b) {
			if (b) {
				for (var c = this,
				d = c.$parent,
				e = a.init(d.find("#edu_demand")[0]), f = [], g = [], h = 0, i = b.value.data.length; h < i; h++) {
					var j = b.value.data[h];
					f.push(j[0]),
					g.push({
						value: j[1],
						name: j[0],
						itemStyle: {
							normal: {
								color: c.colorList[h]
							}
						}
					})
				}
				e.setOption({
					grid: {
						left: "15px",
						right: "15px",
						bottom: "15px",
						top: "35px",
						containLabel: !0
					},
					label: {
						normal: {
							formatter: function(a) {
								return a.data.name + ": " + a.percent + "%"
							}
						}
					},
					series: [{
						data: g,
						type: "pie",
						radius: ["25%", "50%"],
						label: {
							normal: {
								show: !0
							}
						},
						labelLine: {
							normal: {
								show: !0
							}
						},
						itemStyle: {
							normal: {
								borderColor: "#ffffff",
								borderWidth: 2
							}
						},
						markPoint: {
							symbol: "none"
						}
					}]
				})
			}
		},
		_renderJobDistByArea: function(a, b) {
			if (b) {
				for (var c = this,
				d = c.$parent,
				e = a.init(d.find("#job_dist_by_area")[0]), f = [], g = [], h = 0, i = 0, j = b.value.data.length; i < j; i++) {
					var k = b.value.data[i],
					l = Math.ceil(parseFloat(k[1]));
					if (i === b.value.data.length - 1) g.push(100 - h);
					else {
						if (h + l >= 100) {
							g.push(100 - h),
							f.push(k[0].replace(/市|省|特别行政区/g, ""));
							break
						}
						g.push(l),
						h += l
					}
					f.push(k[0].replace(/市|省|特别行政区/g, ""))
				}
				e.setOption({
					xAxis: {
						type: "category",
						data: f,
						axisLine: {
							show: !1
						},
						axisTick: {
							show: !1
						},
						axisLabel: {
							color: "#333333",
							fontSize: 11,
							interval: 0
						}
					},
					yAxis: {
						type: "value",
						axisLine: {
							show: !1
						},
						axisTick: {
							show: !1
						},
						axisLabel: {
							show: !1
						},
						splitLine: {
							show: !1
						}
					},
					grid: {
						left: "0",
						right: "15px",
						bottom: "15px",
						top: "35px",
						containLabel: !0
					},
					series: [{
						data: g,
						type: "bar",
						label: {
							normal: {
								show: !0,
								position: "top",
								formatter: function(a) {
									return a.data + b.value.lable_y
								}
							}
						},
						itemStyle: {
							normal: {
								color: "#27BBA5",
								barBorderRadius: [9, 9, 0, 0]
							}
						},
						barWidth: 18
					}]
				})
			}
		},
		_renderJobDistPerMonth: function(a, b) {
			if (b) {
				for (var c = this,
				d = c.$parent,
				e = a.init(d.find("#job_dist_per_month")[0]), f = [], g = [], h = 0, i = b.value.data.length; h < i; h++) {
					var j = b.value.data[h];
					f.push(parseInt(j[0]) + b.value.lable_x),
					g.push(parseInt(j[1]))
				}
				e.setOption({
					xAxis: {
						type: "category",
						boundaryGap: !1,
						data: f,
						axisLine: {
							lineStyle: {
								color: "#E9E9E9",
								width: 1
							}
						},
						axisLabel: {
							color: "#333333",
							fontSize: 11,
							interval: 0
						},
						splitArea: {
							show: !0,
							areaStyle: {
								color: ["rgba(216,216,216,.2)", "rgba(216,216,216,.1)"]
							}
						}
					},
					yAxis: {
						type: "value",
						axisLine: {
							lineStyle: {
								color: "#E9E9E9",
								width: 1
							}
						},
						axisLabel: {
							color: "#999999",
							fontSize: 11
						},
						splitLine: {
							show: !1
						}
					},
					grid: {
						left: "15px",
						right: "15px",
						bottom: "15px",
						top: "35px",
						containLabel: !0
					},
					series: [{
						data: g,
						type: "line",
						label: {
							normal: {
								show: !0,
								position: "top",
								color: "#F49300",
								formatter: function(a) {
									return 0 === a.dataIndex ? "       " + a.data: a.data
								}
							}
						},
						lineStyle: {
							normal: {
								color: "#F49300",
								width: 3
							}
						},
						areaStyle: {
							normal: {
								color: {
									type: "linear",
									x: 0,
									y: 0,
									x2: 0,
									y2: 1,
									colorStops: [{
										offset: 0,
										color: "rgba(244,147,0,.5)"
									},
									{
										offset: 1,
										color: "rgba(244,147,0, 0)"
									}],
									globalCoord: !1
								}
							}
						}
					}]
				})
			}
		}
	}), sg.View.define("company_salary_dist", {
		beforeRender: function(a) {
			sg.Model.get("/info/get_salary_dist", !1, !0).getData({
				company_id: sg.router.getParam("company_id")
			},
			function(b) {
				a(b.data)
			})
		},
		afterRender: function(a) {
			var b = this;
			b.$parent;
			require([config.static_api + "js/core/echarts.min.js"],
			function(c) {
				b._renderSalaryDist(c, a.salaryDist)
			})
		},
		_renderSalaryDist: function(a, b) {
			for (var c = this,
			d = c.$parent,
			e = a.init(d.find("#salary_dist")[0]), f = [], g = [], h = 0, i = 0, j = b.value.data.length; i < j; i++) {
				var k = b.value.data[i],
				l = Math.ceil(parseFloat(k[1]));
				if (i === b.value.data.length - 1) g.push(100 - h);
				else {
					if (h + l >= 100) {
						g.push(100 - h),
						f.push(k[0].replace(/ /g, ""));
						break
					}
					g.push(l),
					h += l
				}
				f.push(k[0].replace(/ /g, ""))
			}
			e.setOption({
				xAxis: {
					type: "category",
					data: f,
					axisLine: {
						show: !1
					},
					axisTick: {
						show: !1
					},
					axisLabel: {
						color: "#333333",
						fontSize: 11,
						interval: 0
					}
				},
				yAxis: {
					type: "value",
					axisLine: {
						show: !1
					},
					axisTick: {
						show: !1
					},
					axisLabel: {
						show: !1
					},
					splitLine: {
						show: !1
					}
				},
				grid: {
					left: "0",
					right: "15px",
					bottom: "15px",
					top: "35px",
					containLabel: !0
				},
				series: [{
					data: g,
					type: "bar",
					label: {
						normal: {
							show: !0,
							position: "top",
							formatter: function(a) {
								return a.data + b.value.lable_y
							}
						}
					},
					itemStyle: {
						normal: {
							color: "#4D87EE",
							barBorderRadius: [9, 9, 0, 0]
						}
					},
					barWidth: 18
				}]
			})
		}
	}), sg.View.define("company_overview", {
		properties: {
			colorList: ["#5687ED", "#C2CEF2", "#F1BC03", "#EE9200", "#43BCA6", "#3595E3"],
			legendList: []
		},
		beforeRender: function(a) {
			sg.Model.get("/info/get_overview_info", !1, !0).getData({
				company_id: sg.router.getParam("company_id")
			},
			function(b) {
				if (b.errno) return void sg.Component.Notice({
					text: b.message
				});
				b = b.data;
				var c, d = 0;
				if (b.company_infos.start_date) for (var e = 0,
				f = b.company_infos.start_date.value.data.length; e < f; e++) {
					var g = b.company_infos.start_date.value.data[e];
					parseInt(g[1]) > d && (d = parseInt(g[1]), c = g[0])
				}
				var h = [];
				if (b.company_infos.industrial_distribution) for (var e = 0,
				f = b.company_infos.industrial_distribution.value.data.length; e < f && 3 !== h.length; e++) {
					var g = b.company_infos.industrial_distribution.value.data[e][0];
					"其它" != g && h.push(g)
				}
				"CN" == b.base_info.province && (b.base_info.province = ""),
				b.base_info.province || (b.company_infos.regist_capi_level.province = 0),
				a($.extend(b, {
					getIndustry: getIndustry,
					getProvinceName: getProvinceName,
					max_year: c,
					max_num: d,
					max_industry_distribution: h
				}))
			})
		},
		restart: function() {
			var a = this;
			ZDao.setNavBtn({
				icon: config.static_api + "images/icon_save_image_201811271733.png"
			},
			function() {
				Log.action("save_long_figure"),
				a.replaceCanvas(),
				setTimeout(function() {
					ZDao.saveLongPicture({
						page_id: Log.getCurrentPageId()
					})
				},
				300)
			})
		},
		replaceCanvas: function() {
			if (config.is_android) {
				for (var a = this,
				b = 0,
				c = a.legendList.length; b < c; b++) a.legendList[b][0].html('<img style="display: block;width:100%;" src="' + a.legendList[b][1] + '">');
				a.legendList = []
			}
		},
		afterRender: function(a) {
			var b = this;
			b.$parent;
			ZDao.setNavBtn({
				icon: config.static_api + "images/icon_save_image_201811271733.png"
			},
			function() {
				Log.action("save_long_figure"),
				b.replaceCanvas(),
				setTimeout(function() {
					ZDao.saveLongPicture({
						page_id: Log.getCurrentPageId()
					})
				},
				300)
			}),
			require([config.static_api + "js/core/echarts.min.js"],
			function(c) {
				b._renderRegistCapiLevel(c, a.company_infos.regist_capi_level),
				b._renderStartDate(c, a.company_infos.start_date),
				b._renderIndustrialDistribution(c, a.company_infos.industrial_distribution),
				b._renderShiyebxNum(c, a.company_infos.shiyebx_num),
				b._renderIncome(c, a.company_infos.income),
				b._renderPureProfit(c, a.company_infos.pure_profit)
			})
		},
		_renderRegistCapiLevel: function(a, b) {
			if (b) {
				var c = this,
				d = c.$parent,
				e = d.find("#regist_capi_level"),
				f = a.init(e[0]),
				g = ["全省", "全国"],
				h = [b.province || 0, 0 | b.country];
				b.province || (g = ["全国"], h = [0 | b.country]),
				f.setOption({
					yAxis: {
						type: "category",
						data: g,
						axisLine: {
							lineStyle: {
								color: "#E9E9E9",
								width: 1
							}
						},
						axisLabel: {
							color: "#333333",
							fontSize: 11
						},
						splitArea: {
							show: !0,
							areaStyle: {
								color: ["rgba(216,216,216,.2)", "rgba(216,216,216,.1)"]
							}
						}
					},
					xAxis: {
						type: "value",
						axisLine: {
							lineStyle: {
								color: "#E9E9E9",
								width: 1
							}
						},
						axisLabel: {
							color: "#999999",
							fontSize: 11
						},
						splitLine: {
							show: !1
						}
					},
					grid: {
						left: "0",
						right: "35px",
						bottom: "15px",
						top: "15px",
						containLabel: !0
					},
					series: [{
						data: h,
						type: "bar",
						label: {
							normal: {
								show: !0,
								position: "right",
								formatter: function(a) {
									return a.data + "%"
								}
							}
						},
						itemStyle: {
							normal: {
								color: "#4D87EE"
							}
						},
						barWidth: 18
					}]
				}),
				c.legendList.push([e, f.getDataURL({
					pixelRatio: window.devicePixelRatio
				})])
			}
		},
		_renderIndustrialDistribution: function(a, b) {
			if (b) {
				for (var c = this,
				d = c.$parent,
				e = d.find("#industrial_distribution"), f = a.init(e[0]), g = [], h = [], i = 0, j = 0, k = b.value.data.length; j < k; j++) {
					var l = b.value.data[j],
					m = Math.ceil(parseFloat(l[1]));
					if (j === b.value.data.length - 1) h.push(100 - i);
					else {
						if (i + m >= 100) {
							h.push(100 - i),
							g.push(l[0].replace(/市|省|特别行政区/g, ""));
							break
						}
						h.push(m),
						i += m
					}
					g.push(l[0].replace(/市|省|特别行政区/g, ""))
				}
				f.setOption({
					xAxis: {
						type: "category",
						data: g,
						axisLine: {
							show: !1
						},
						axisTick: {
							show: !1
						},
						axisLabel: {
							color: "#333333",
							fontSize: 11,
							interval: 0
						}
					},
					yAxis: {
						type: "value",
						axisLine: {
							show: !1
						},
						axisTick: {
							show: !1
						},
						axisLabel: {
							show: !1
						},
						splitLine: {
							show: !1
						}
					},
					grid: {
						left: "0",
						right: "15px",
						bottom: "15px",
						top: "35px",
						containLabel: !0
					},
					series: [{
						data: h,
						type: "bar",
						label: {
							normal: {
								show: !0,
								position: "top",
								formatter: function(a) {
									return a.data + "%"
								}
							}
						},
						itemStyle: {
							normal: {
								color: "#4D87EE",
								barBorderRadius: [9, 9, 0, 0]
							}
						},
						barWidth: 18
					}]
				}),
				c.legendList.push([e, f.getDataURL({
					pixelRatio: window.devicePixelRatio
				})])
			}
		},
		_renderStartDate: function(a, b) {
			if (b) {
				for (var c = this,
				d = c.$parent,
				e = d.find("#start_date"), f = a.init(e[0]), g = [], h = [], i = !1, j = 0, k = b.value.data.length; j < k; j++) {
					var l = b.value.data[j];
					if (!i) {
						if (!parseInt(l[1])) continue;
						i = !0
					}
					g.push(parseInt(l[0])),
					h.push(parseInt(l[1]))
				}
				f.setOption({
					animation: !1,
					xAxis: {
						type: "category",
						boundaryGap: !1,
						data: g,
						axisLine: {
							lineStyle: {
								color: "#E9E9E9",
								width: 1
							}
						},
						axisLabel: {
							color: "#333333",
							fontSize: 11
						},
						splitArea: {
							show: !0,
							areaStyle: {
								color: ["rgba(216,216,216,.2)", "rgba(216,216,216,.1)"]
							}
						}
					},
					yAxis: {
						name: "企业注册数量",
						nameTextStyle: {
							color: "#666666",
							fontSize: 11
						},
						type: "value",
						axisLine: {
							lineStyle: {
								color: "#E9E9E9",
								width: 1
							}
						},
						axisLabel: {
							color: "#999999",
							fontSize: 11
						},
						splitLine: {
							show: !1
						}
					},
					grid: {
						left: "15px",
						right: "15px",
						bottom: "15px",
						top: "35px",
						containLabel: !0
					},
					series: [{
						data: h,
						type: "line",
						symbol: "none",
						label: {
							normal: {
								show: !1,
								position: "top",
								color: "#F49300",
								formatter: function(a) {
									return 0 === a.dataIndex ? "       " + a.data: a.data
								}
							}
						},
						lineStyle: {
							normal: {
								color: "#F49300",
								width: 3
							}
						},
						areaStyle: {
							normal: {
								color: {
									type: "linear",
									x: 0,
									y: 0,
									x2: 0,
									y2: 1,
									colorStops: [{
										offset: 0,
										color: "rgba(244,147,0,.5)"
									},
									{
										offset: 1,
										color: "rgba(244,147,0, 0)"
									}],
									globalCoord: !1
								}
							}
						}
					}]
				}),
				c.legendList.push([e, f.getDataURL({
					pixelRatio: window.devicePixelRatio
				})])
			}
		},
		_renderShiyebxNum: function(a, b) {
			if (b) {
				for (var c = this,
				d = c.$parent,
				e = d.find("#shiyebx_num"), f = a.init(e[0]), g = [], h = [], i = 0, j = b.value.data.length; i < j; i++) {
					var k = b.value.data[i];
					g.push(parseInt(k[0])),
					h.push(parseInt(k[1]))
				}
				f.setOption({
					animation: !1,
					xAxis: {
						type: "category",
						boundaryGap: !1,
						data: g,
						axisLine: {
							lineStyle: {
								color: "#E9E9E9",
								width: 1
							}
						},
						axisLabel: {
							color: "#333333",
							fontSize: 11,
							interval: 0
						},
						splitArea: {
							show: !0,
							areaStyle: {
								color: ["rgba(216,216,216,.2)", "rgba(216,216,216,.1)"]
							}
						}
					},
					yAxis: {
						name: "单位：人",
						nameTextStyle: {
							color: "#666666",
							fontSize: 11
						},
						type: "value",
						minInterval: 1,
						axisLine: {
							lineStyle: {
								color: "#E9E9E9",
								width: 1
							}
						},
						axisLabel: {
							color: "#999999",
							fontSize: 11
						},
						splitLine: {
							show: !1
						}
					},
					grid: {
						left: "15px",
						right: "15px",
						bottom: "15px",
						top: "35px",
						containLabel: !0
					},
					series: [{
						data: h,
						type: "line",
						label: {
							normal: {
								show: !0,
								position: "top",
								color: "#27BBA5",
								formatter: function(a) {
									return 0 === a.dataIndex ? "           " + a.data: a.dataIndex === h.length - 1 ? a.data + "           ": a.data
								}
							}
						},
						lineStyle: {
							normal: {
								color: "#27BBA5",
								width: 3
							}
						},
						areaStyle: {
							normal: {
								color: {
									type: "linear",
									x: 0,
									y: 0,
									x2: 0,
									y2: 1,
									colorStops: [{
										offset: 0,
										color: "rgba(86,198,178, 1)"
									},
									{
										offset: 1,
										color: "rgba(86,198,178, 0)"
									}],
									globalCoord: !1
								}
							}
						}
					}]
				}),
				c.legendList.push([e, f.getDataURL({
					pixelRatio: window.devicePixelRatio
				})])
			}
		},
		_renderIncome: function(a, b) {
			if (b) {
				for (var c = this,
				d = c.$parent,
				e = d.find("#income"), f = a.init(e[0]), g = [], h = [], i = 0, j = b.value.data.length; i < j; i++) {
					var k = b.value.data[i];
					g.push(parseInt(k[0])),
					h.push(parseInt(k[1]))
				}
				f.setOption({
					xAxis: {
						type: "category",
						boundaryGap: !1,
						data: g,
						axisLine: {
							lineStyle: {
								color: "#E9E9E9",
								width: 1
							}
						},
						axisLabel: {
							color: "#333333",
							fontSize: 11,
							interval: 0
						},
						splitArea: {
							show: !0,
							areaStyle: {
								color: ["rgba(216,216,216,.2)", "rgba(216,216,216,.1)"]
							}
						}
					},
					yAxis: {
						name: "单位：亿元",
						nameTextStyle: {
							color: "#666666",
							fontSize: 11
						},
						type: "value",
						axisLine: {
							lineStyle: {
								color: "#E9E9E9",
								width: 1
							}
						},
						axisLabel: {
							color: "#999999",
							fontSize: 11
						},
						splitLine: {
							show: !1
						}
					},
					grid: {
						left: "15px",
						right: "15px",
						bottom: "15px",
						top: "35px",
						containLabel: !0
					},
					series: [{
						data: h,
						type: "line",
						label: {
							normal: {
								show: !0,
								position: "top",
								color: "#F49300",
								formatter: function(a) {
									return 0 === a.dataIndex ? "       " + a.data: a.data
								}
							}
						},
						lineStyle: {
							normal: {
								color: "#F49300",
								width: 3
							}
						},
						areaStyle: {
							normal: {
								color: {
									type: "linear",
									x: 0,
									y: 0,
									x2: 0,
									y2: 1,
									colorStops: [{
										offset: 0,
										color: "rgba(244,147,0,.5)"
									},
									{
										offset: 1,
										color: "rgba(244,147,0, 0)"
									}],
									globalCoord: !1
								}
							}
						}
					}]
				}),
				c.legendList.push([e, f.getDataURL({
					pixelRatio: window.devicePixelRatio
				})])
			}
		},
		_renderPureProfit: function(a, b) {
			if (b) {
				for (var c = this,
				d = c.$parent,
				e = d.find("#pure_profit"), f = a.init(e[0]), g = [], h = [], i = 0, j = b.value.data.length; i < j; i++) {
					var k = b.value.data[i];
					g.push(parseInt(k[0])),
					h.push(parseInt(k[1]))
				}
				f.setOption({
					xAxis: {
						type: "category",
						boundaryGap: !1,
						data: g,
						axisLine: {
							lineStyle: {
								color: "#E9E9E9",
								width: 1
							}
						},
						axisLabel: {
							color: "#333333",
							fontSize: 11,
							interval: 0
						},
						splitArea: {
							show: !0,
							areaStyle: {
								color: ["rgba(216,216,216,.2)", "rgba(216,216,216,.1)"]
							}
						}
					},
					yAxis: {
						name: "单位：亿元",
						nameTextStyle: {
							color: "#666666",
							fontSize: 11
						},
						type: "value",
						axisLine: {
							lineStyle: {
								color: "#E9E9E9",
								width: 1
							}
						},
						axisLabel: {
							color: "#999999",
							fontSize: 11
						},
						splitLine: {
							show: !1
						}
					},
					grid: {
						left: "15px",
						right: "15px",
						bottom: "15px",
						top: "35px",
						containLabel: !0
					},
					series: [{
						data: h,
						type: "line",
						label: {
							normal: {
								show: !0,
								position: "top",
								color: "#4D87EE",
								formatter: function(a) {
									return 0 === a.dataIndex ? "       " + a.data: a.data
								}
							}
						},
						lineStyle: {
							normal: {
								color: "#4D87EE",
								width: 3
							}
						},
						areaStyle: {
							normal: {
								color: {
									type: "linear",
									x: 0,
									y: 0,
									x2: 0,
									y2: 1,
									colorStops: [{
										offset: 0,
										color: "rgba(77,135,238,1)"
									},
									{
										offset: 1,
										color: "rgba(77,135,238, 0)"
									}],
									globalCoord: !1
								}
							}
						}
					}]
				}),
				c.legendList.push([e, f.getDataURL({
					pixelRatio: window.devicePixelRatio
				})])
			}
		}
	});