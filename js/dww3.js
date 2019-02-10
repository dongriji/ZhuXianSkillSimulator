/*!
 * FileName   : dww3.js
 * WebSite    : http://duowan.com
 * $Author    : Sa
 * $Date: 2017-05-17
 * */
(function($){
	$.fn.Switchable = function(options) {
		var opts = $.extend( {}, $.fn.Switchable.Default, options );
		var targetLi = $("." + opts.nav + " > li", $(this)),
			clickNext = $("." + opts.btnNext, $(this)),
			clickPrev = $("." + opts.btnPrev, $(this)),
			contentBox = $("." + opts.content, $(this));

		var index = 1,
			contentBoxNum = contentBox.children().size(),
			slideW = contentBox.children(":first").width(),
			slideH = contentBox.children(":first").height();

		var autoPlay, slideWH;
		if ( opts.effect == "scrollY" || opts.effect == "scrollLoopY" ) {
			slideWH = contentBox.children(":first").outerHeight(true);
		} else if ( opts.effect == "scrollX" || opts.effect == "scrollLoopX" ) {
			slideWH = contentBox.children(":first").outerWidth(true);
			contentBox.css("width" , contentBoxNum * slideWH);
			contentBox.children().css({"float" : "left"});
			contentBox.children().css({"width" : slideW});
		}

		return this.each(function() {
			// 滚动函数
			var doPlay = function() {
				$.fn.Switchable.Effect[opts.effect]( contentBox, targetLi, index, slideWH, opts );
				if ( ++index * opts.steps >= contentBoxNum ) index = 0;
			}

			// 点击左右滚动
			if ( !targetLi.size() ) {
				if (clickNext.size()) {
					clickNext.click(function(event){
						if ( autoPlay ) clearInterval( autoPlay );
						$.fn.Switchable.Effect[opts.effect]( contentBox, targetLi, index, slideWH, opts );
						if ( opts.autoPlay ) autoPlay = setInterval(doPlay, opts.timer);
						event.preventDefault();
					});
					clickPrev.click(function(event){
						if ( autoPlay ) clearInterval( autoPlay );
						$.fn.Switchable.Effect[opts.effect]( contentBox, targetLi, index, slideWH, opts, "prev" );
						if ( opts.autoPlay ) autoPlay = setInterval(doPlay, opts.timer);
						event.preventDefault();
					});
				}
			}

			// 导航事件
			if ( targetLi.size() ) {
				if (clickNext.size() && !opts.hasScroll) {
					var _length = targetLi.size();
					clickNext.click(function(event){
						for ( var i = 0; i < _length; i++ ) {
							if ( targetLi.eq(i).hasClass("hover") ) {
								index = (i + 1 == _length) ? 0 : i + 1;
								break;
							}
						}
						$.fn.Switchable.Effect[opts.effect]( contentBox, targetLi, index, slideWH, opts );

						if ( autoPlay ) clearInterval( autoPlay );
						if ( opts.autoPlay ) autoPlay = setInterval(doPlay, opts.timer);

						return false;
					});
					clickPrev.click(function(event){
						for ( var i = 0; i < _length; i++ ) {
							if ( targetLi.eq(i).hasClass("hover") ) {
								index = (i == 0) ? _length - 1 : i - 1;
								break;
							}
						}
						$.fn.Switchable.Effect[opts.effect]( contentBox, targetLi, index, slideWH, opts );

						if ( autoPlay ) clearInterval( autoPlay );
						if ( opts.autoPlay ) autoPlay = setInterval(doPlay, opts.timer);

						return false;
					});
				}

				if ( opts.event == "click" ) {
					targetLi.click(function(){
						if ( autoPlay ) {
							clearInterval(autoPlay);
						}
						index = targetLi.index(this);
						$.fn.Switchable.Effect[opts.effect]( contentBox, targetLi, index, slideWH, opts );
						targetLi.eq(index).addClass("selected").siblings().removeClass("selected");
					}).hover(function(){
						$(this).addClass("hover");
					}, function() {
						$(this).removeClass("hover");
					});
				} else if ( opts.event == "hover" ) {
					var hoverTimeout = null;
					targetLi.hover(function(){
						if ( autoPlay ) {
							clearInterval(autoPlay);
						}
						index = targetLi.index(this);
						if (!opts.hoverInterval) {
							$.fn.Switchable.Effect[opts.effect]( contentBox, targetLi, index, slideWH, opts );
						}
						// hover时延迟
						else {
							hoverTimeout = setTimeout(function(){
								$.fn.Switchable.Effect[opts.effect]( contentBox, targetLi, index, slideWH, opts )
							}, opts.hoverInterval);
						}
					}, function() {
						if ( hoverTimeout ) clearInterval( hoverTimeout );
						if ( autoPlay ) clearInterval( autoPlay );
						if ( opts.autoPlay ) autoPlay = setInterval(doPlay, opts.timer);
					});
				}
			}

			// 自动播放
			if ( opts.autoPlay ) {
				autoPlay = setInterval( doPlay, opts.timer );
				contentBox.hover(function(){
					if ( autoPlay ) clearInterval( autoPlay );
				}, function() {
					if ( autoPlay ) clearInterval( autoPlay );
					if ( opts.autoPlay ) autoPlay = setInterval( doPlay, opts.timer );
				});
			}
		});
	}

	// 默认属性
	$.fn.Switchable.Default = {
		event: "click",
		effect: "none",
		autoPlay: true,
		speed: "normal",
		timer: 2000,
		nav: "J_nav",
		content: "J_content",
		steps: 1,
		btnNext:"J_btnNext",
		btnPrev:"J_btnPrev"
	};

	// 方法实现
	$.fn.Switchable.Effect = {
		none: function( contentObj, navObj, i, slideW, opts ) {
			contentObj.children().eq(i).show().siblings().hide();
			if (navObj) {
				navObj.eq(i).addClass("hover").siblings().removeClass("hover");
				contentObj.children().eq(i).find("img").each(function(_index, e) {
					var _src = $(e).attr("data-original");
					if(_src) {
						$(e).attr("src", _src);
					}
				})
			}
		},
		fade: function( contentObj, navObj, i, slideW, opts ) {
			contentObj.children().eq(i).stop(true, true).fadeIn(opts.speed).siblings().hide();
			if (navObj) {
				navObj.eq(i).addClass("hover").siblings().removeClass("hover");
				contentObj.children().eq(i).find("img").each(function(_index, e) {
					var _src = $(e).attr("data-original");
					if(_src) {
						$(e).attr("src", _src);
					}
				})
			}
		},
		scrollX: function( contentObj, navObj, i, slideW, opts ) {
			contentObj.stop().animate({"margin-left" : -i * opts.steps * slideW}, opts.speed);
			if (navObj) {
				navObj.eq(i).addClass("hover").siblings().removeClass("hover");
			}
		},
		scrollY: function( contentObj, navObj, i, slideH, opts ) {
			contentObj.stop().animate({"margin-top" : -i * opts.steps * slideH}, opts.speed);
			if (navObj) {
				navObj.eq(i).addClass("hover").siblings().removeClass("hover");
			}
		},
		scrollLoopX: function( contentObj, navObj, i, slideW, opts, direction ) {
			direction = direction || "next";
			$.fn.Switchable.ScrollLoop[direction]( contentObj, navObj, i, slideW, opts, "X" );
		},
		scrollLoopY: function( contentObj, navObj, i, slideH, opts, direction ) {
			direction = direction || "next";
			$.fn.Switchable.ScrollLoop[direction]( contentObj, navObj, i, slideH, opts, "Y" );
		}
	};

	$.fn.Switchable.ScrollLoop = {
		prev: function( contentObj, navObj, i, slideWH, opts, xy ) {
			// 如果当前有移动效果，则屏蔽点击
			if (contentObj.is(":animated")) return;

			for ( var i = 0; i < opts.steps; i++ ) {
				contentObj.children(":last").prependTo(contentObj);
			}
			if ( xy == "X" ) {
				contentObj.css({"margin-left" : -opts.steps * slideWH});
				contentObj.stop().animate({"margin-left" : 0}, opts.speed);
			} else {
				contentObj.css({"margin-top" : -opts.steps * slideWH});
				contentObj.stop().animate({"margin-top" : 0}, opts.speed);
			}
		},
		next: function( contentObj, navObj, i, slideWH, opts, xy ) {
			// 如果有当前移动效果，则屏蔽点击
			if (contentObj.is(":animated")) return;

			if ( xy == "X" ) {
				contentObj.stop().animate({"margin-left" : -opts.steps * slideWH}, opts.speed, function(){
					for (var i = 0; i < opts.steps; i++) {
						contentObj.children(":first").appendTo(contentObj);
					}
					contentObj.css({"margin-left" : 0});
				});
			} else {
				contentObj.stop().animate({"margin-top" : -opts.steps * slideWH}, opts.speed, function(){
					for (var i = 0; i < opts.steps; i++) {
						contentObj.children(":first").appendTo(contentObj);
					}
					contentObj.css({"margin-top" : 0});
				});
			}
		}
	}
})(jQuery);

var KISSDW = {
	// 选项卡
	tabs: function( selector, options ) {
		var _default = {
			nav: "J_nav:eq(0)",
			content: "J_content:eq(0)",
			autoPlay: false
		};
		if ( options && !options.hoverInterval && options.event === "hover" ) {
			_default.hoverInterval = 300;
		}
		var opts = jQuery.extend( {}, _default, options );
		jQuery(selector).Switchable( opts );
	},

	// 头图幻灯片
	slide: function( selector, options ) {
		var _default = {
			event: "hover",
			effect: "fade",
			timer: 5000
		};
		var opts = jQuery.extend( {}, _default, options );
		jQuery(selector).Switchable( opts );
	},

	// 文章滚动
	textScroll: function( selector, options ) {
		var _default = {
			effect: "scrollLoopY",
			timer: 4000
		};
		var opts = jQuery.extend( {}, _default, options );
		jQuery(selector).Switchable( opts );
	},

	// 图片滚动
	imageScroll: function( selector, options ) {
		var _default = {
			effect: "scrollLoopX"
		};
		var opts = jQuery.extend( {}, _default, options );
		jQuery(selector).Switchable( opts );
	},

	/******************************* 以上部分运用了Switchable插件 *******************************/

	// 活动日历（默认日期）
	calendar: function( selector, options ) {
		var _default = {
			event: "click",
			fromSunday: false
		};
		var opts = jQuery.extend( {}, _default, options );

		var day = new Date().getDay(), dayNum = day;
		if ( !opts.fromSunday ) {
			dayNum = day == 0 ? 6 : day - 1;
		}

		var _eventStr = "selected";
		if ( opts.event == "hover" ) {
			_eventStr = "hover";
		}
		jQuery(selector).find(".J_nav > li").eq(dayNum).addClass(_eventStr);
		jQuery(selector).find(".J_content > div").eq(dayNum).removeClass("hide");
		// v2.1
		jQuery(selector).find(".J_content > li").eq(dayNum).removeClass("hide");

		this.tabs( selector, options );
	},

	// 输入flash代码
	embedSWF: function( selector, options ) {
		var flashBox = jQuery(selector)[0];
		if ( !flashBox ) return;

		var _default = {
			url: "",
			width: jQuery(flashBox).width(),
			height: jQuery(flashBox).height(),
			wmode: "transparent"
		};
		var opts = jQuery.extend( {}, _default, options );

		if ( opts.url === "" ) return;

		var str = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="' + opts.width + '" height="' + opts.height + '">';
		str += '<param name="movie" value="' + opts.url + '">';
		str += '<param name="wmode" value="' + opts.wmode + '">';
		str += '<!--[if !IE]>-->';
		str += '<object type="application/x-shockwave-flash" data="' + opts.url + '" width="' + opts.width + '" height="' + opts.height + '">';
		str += '<param name="wmode" value="' + opts.wmode + '">';
		str += '</object>';
		str += '<!--<![endif]-->';
		str += '</object>';

		flashBox.innerHTML = str;
	},

	// 预加载图片
	preLoadImg: function( urls ) {
		for ( var i = 0; i < urls.length; i++ ) {
			var img = new Image();
			img.src = urls[i];
		}
	},

	// 手风琴
	accordion: function( selector ) {
        //max
        if ( !jQuery(selector).is("div[class*='mod-accordion']") ) return false;
		var accord = jQuery(selector),
			accordHead = accord.children("div:even"),
			accordBody = accord.children("div:odd"),
			accordLength = accordHead.length;

		accordHead.click(function(){
			var _index = accordHead.index(this);
			var _ifSelf = accordHead.eq(_index).hasClass("active");

			accordHead.removeClass("active");
			accordBody.removeClass("show");

			if (_ifSelf) {
				_index = (accordLength != _index + 1) ? ++_index : --_index;
			}
			accordHead.eq(_index).addClass("active");
			accordBody.eq(_index).addClass("show");
			// accordBody.stop().slideUp("normal").eq(_index).slideDown("normal");
		});
	},

	// 遮罩弹出层（selector为"none"时，直接跳出弹出框）
	popupBox: function( selector, options ) {
		var el = jQuery(selector);
		if ( !el.length && selector !== "none" ) return;

		if ( !options || !options.boxSelector ) return;

		// 点击事件
		if ( el.length ) el.click(function(){
			popFun();
			return false;
		});

		function popFun() {
			var box = jQuery(options.boxSelector)[0];
			if ( !box ) return;

			var _default = {
				existMask: true
			};
			var opts = jQuery.extend( {}, _default, options );

			// 创建遮罩，显示弹出框
			this.open_popu = function(maskCss, boxCss) {
				this.box.style.cssText = boxCss;
				this.mask.style.cssText = maskCss;

				// 解决ie6 bug
				if(!window.XMLHttpRequest) {
					document.documentElement.scrollTop++;
					document.documentElement.scrollTop--;
				}

				if ( opts.existMask ) document.body.appendChild(this.mask);
			},

			// 关闭遮罩
			this.close_popu = function() {
				// ie6 清空css表达式
				this.box.style.cssText = "";
				this.box.style.display = "none";

				if ( opts.existMask ) document.body.removeChild(this.mask);
			}

			this.box = box;
			this.mask = document.createElement("div");

			// dom宽高
			this.box.style.display = "block";
			var boxWidth = this.box.clientWidth,
				boxHeight = this.box.clientHeight;

			// 创建遮罩，显示弹出框
			var maskCss = "position:fixed;left:0;top:0;z-index:32766;width:100%;height:100%;filter:alpha(opacity=70);-moz-opacity:0.7;opacity:0.7;background:#000;",
				boxCss = "display:block;position:fixed;left:50%;top:50%;z-index:32767;margin:-" + boxHeight / 2 + "px 0 0 -" + boxWidth / 2 + "px;";
			// ie6
			if(!window.XMLHttpRequest) {
				// ie6 css表达式
				maskCss += "position:absolute;top:expression(documentElement.scrollTop);height:expression(document.documentElement.clientHeight);";
				boxCss += "position:absolute;top:expression(documentElement.scrollTop + document.documentElement.clientHeight/2);";

				// 解决ie6 bug（没设置html背景的时候）
				if ( document.getElementsByTagName("html")[0].style.backgroundImage == "") {
					document.getElementsByTagName("html")[0].style.backgroundImage = "url(blank)";
				}
			}

			this.open_popu(maskCss, boxCss);

			// 关闭弹出框事件设置（约定关闭按钮classname为J_btnClose）
			var tags = this.box.getElementsByTagName("*");
			for (var i = 0; i < tags.length; i++) {
				if ( jQuery(tags[i]).hasClass("J_btnClose") ) {
					var self = this;
					tags[i].onclick = function() {
						self.close_popu();
						return false;
					}
				}
			}

			return false;
		}

		if ( selector === "none" ) popFun();
	},

	/////////////////////////////

	// 站内导航树
	navTree: function( selector, options ) {
		var _default = {
			showAll: false
		};
		var opts = jQuery.extend( {}, _default, options );

		if (jQuery(selector).length) {
			// ie
			if (!-[1, ]) {
				jQuery(selector + " ul").each(function(){
					jQuery(this).children("li:last-child").addClass("last-child");
				});
			}

			jQuery(selector + ">ul>li").each(function(){
				var ul = jQuery(this).find("ul:first");
				if (!ul.length) return;

				if ( opts.showAll ) {
					ul.attr("class", "show");
				}

				var span = jQuery("<span></span>");
				span.prependTo(ul.siblings("b"));
				span.height = ul.height();
				span.status = "visible";

				if (ul.attr("class") !== "show") {
					ul.css("height", "0");
					span.status = "hidden";
				}

				span.click(function(){
					if (span.status === "hidden") {
						span.status = "visible";
						ul.animate({height: span.height}, 500);
					}
					else {
						span.status = "hidden";
						ul.animate({height: 0}, 500);
					}
				});
			});
		}
	},

	// 站内导航树
	navTree2: function( selector, options ) {
		var _default = {
			showAll: false,
			effect: false,
			clickIcon: false,
			speed: "normal"
		};
		var opts = jQuery.extend( {}, _default, options );

		var navTree = jQuery(selector);

		navTree.find("ul").each(function(){
			jQuery(this).children("li:last-child").addClass("last");
		});

		function animate( div ) {
			var parentLi = div.parent(),			// div父元素
				siblingsUl = div.siblings("ul");	// div的兄弟元素

			// 是否动态效果
			if ( opts.effect ) {
				if ( siblingsUl.is(":visible") ) {
					siblingsUl.slideUp(opts.speed, function(){
						parentLi.toggleClass("close");
					});
				} else {
					if ( !siblingsUl.attr("noFirst") ) {
						siblingsUl.slideDown(opts.speed, function(){
							parentLi.toggleClass("close");
						});

					} else {
						parentLi.toggleClass("close");
						siblingsUl.slideDown(opts.speed);
					}
				}
				siblingsUl.attr("noFirst", true);		// 解决第一次打开close直接弹开的情况
			} else {
				parentLi.toggleClass("close");
			}
		}

		// 是否点击icon弹开
		if ( opts.clickIcon ) {
			navTree.find("li:has(ul)").children("div").prepend("<i></i>").children("i").click(function(){
				animate( jQuery(this).parent() );
			});
		} else {
			navTree.find("li:has(ul)").children("div").prepend("<i></i>").click(function(){
				animate( jQuery(this) );
			});
		}

		// 是否全部结构显示
		if ( !opts.showAll ) {
			navTree.find("li li:has(ul):not(.open)").addClass("close");
		}
	},

	toolTips: function( options ) {
		var _default = {
			imgSrc: "",
			style: 1,
			offset: {x: 15, y: 15}
		};
		var opts = jQuery.extend( {}, _default, options );

		// 样式一
		if ( opts.style === 1 ) {
			var cssImgText = "";
			if (opts.imgSrc != "") {
				cssImgText = '.data-tips-left, .data-tips-center, .data-tips-right{background-image:url(' + opts.imgSrc + ')}';
			}
			document.write('<style type="text/css">' + cssImgText + '</style>');
		}

		// 分配事件
		var aTags = document.getElementsByTagName("a");
		for (var i = 0; i < aTags.length; i++) {
			if (aTags[i].getAttribute("data-tips") != null) {
				aTags[i].onmouseover = mouseover;
				aTags[i].onmousemove = mousemove;
				aTags[i].onmouseout = mouseout;
			}
		}

		// 鼠标移上或离开
		function isMouseLeaveOrEnter(e, handler) {
			if (e.type != 'mouseout' && e.type != 'mouseover') return false;

			var reltg = e.relatedTarget ? e.relatedTarget : e.type == 'mouseout' ? e.toElement : e.fromElement;
			while (reltg && reltg != handler)
				reltg = reltg.parentNode;
			return (reltg != handler);
		}

		// 鼠标移上
		function mouseover() {
			var event = window.event || arguments[0],
				srcElement = event.srcElement || event.target;
			if(!isMouseLeaveOrEnter(event, this)) return;

			while (srcElement && !srcElement.getAttribute("data-tips")) srcElement = srcElement.parentNode;

			var html = "";
			switch (opts.style) {
				// 样式一
				case 1:
					html = '<div class="data-tips-top"><div class="data-tips-left"></div><div class="data-tips-center"></div><div class="data-tips-right"></div></div><div class="data-tips-middle"><div class="data-tips-left"></div><div class="data-tips-center">' + srcElement.getAttribute("data-tips") + '</div><div class="data-tips-right"></div></div><div class="data-tips-bottom"><div class="data-tips-left"></div><div class="data-tips-center"></div><div class="data-tips-right"></div></div>';
					break;
				// 样式二
				case 2:
					html = '<div id="data-tips-bd">' + srcElement.getAttribute("data-tips") + '</div>';
					break;
			}

			var tips = document.getElementById("data-tips");
			if (tips) {
				tips.innerHTML = html;
				tips.style.display = "block";
			} else {
				tips = document.createElement("div");
				tips.id = "data-tips";
				tips.innerHTML = html;
				document.body.appendChild(tips);
			}
		}

		// 鼠标移动（在目标上）
		function mousemove() {
			var tips = document.getElementById("data-tips");
			if (!tips) return;

			var event = window.event || arguments[0];
			var pos = mousecoords(event);
			tips.style.left = (pos.x + opts.offset.x) + "px";
			tips.style.top = (pos.y + opts.offset.y) + "px";
		}

		// 鼠标离开
		function mouseout() {
			var event = window.event || arguments[0];
			if (!isMouseLeaveOrEnter(event, this)) return;

			var tips = document.getElementById("data-tips");
			if (!tips) return;

			tips.style.display = "none";
		}

		// 鼠标位置
		function mousecoords(event) {
			if (event.pageX) {
				return {x : event.pageX, y : event.pageY};
			} else {
				return {
					x : event.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft),
					y : event.clientY + (document.documentElement.scrollTop || document.body.scrollTop)
				}
			}
		}
	},

	// 格式化图片（默认600宽？）
	formatPic: function( selector, options ) {
		// 图片头数据加载就绪事件 - 更快获取图片尺寸
		var imgReady = (function () {
			var list = [], intervalId = null,

			// 用来执行队列
			tick = function () {
				var i = 0;
				for (; i < list.length; i++) {
					list[i].end ? list.splice(i--, 1) : list[i]();
				};
				!list.length && stop();
			},

			// 停止所有定时器队列
			stop = function () {
				clearInterval(intervalId);
				intervalId = null;
			};

			return function (url, ready, load, error) {
				var onready, width, height, newWidth, newHeight,
					img = new Image();

				img.src = url;

				// 如果图片被缓存，则直接返回缓存数据
				if (img.complete) {
					ready.call(img);
					load && load.call(img);
					return;
				};

				width = img.width;
				height = img.height;

				// 加载错误后的事件
				img.onerror = function () {
					error && error.call(img);
					onready.end = true;
					img = img.onload = img.onerror = null;
				};

				// 图片尺寸就绪
				onready = function () {
					newWidth = img.width;
					newHeight = img.height;
					if (newWidth !== width || newHeight !== height ||
						// 如果图片已经在其他地方加载可使用面积检测
						newWidth * newHeight > 1024
					) {
						ready.call(img);
						onready.end = true;
					};
				};
				onready();

				// 完全加载完毕的事件
				img.onload = function () {
					// onload在定时器时间差范围内可能比onready快
					// 这里进行检查并保证onready优先执行
					!onready.end && onready();

					load && load.call(img);

					// IE gif动画会循环执行onload，置空onload即可
					img = img.onload = img.onerror = null;
				};

				// 加入队列中定期执行
				if (!onready.end) {
					list.push(onready);
					// 无论何时只允许出现一个定时器，减少浏览器性能损耗
					if (intervalId === null) intervalId = setInterval(tick, 40);
				};
			};
		})();

		var picBox = jQuery(selector)[0];
		if ( !picBox ) return;

		var _default = {
			width: 600,
			url: ""
		};
		var opts = jQuery.extend( {}, _default, options );

		var _imgs = picBox.getElementsByTagName("img"),
			_tabs = picBox.getElementsByTagName("table");

		for(var k = 0;k<_imgs.length;k++)
		{
			// 参数: 图片地址, 尺寸就绪事件, 完全加载事件, 加载错误事件
		    imgReady(_imgs[k].src, function () {
		        //statusReady.innerHTML = '耗时 ' + (time.stop() / 1000) +' 秒. 宽度: ' + this.width + '; 高度: ' + this.height;
		        format();
		    });
		}

		function format() {
			for ( var i = 0; i < _imgs.length; i++ ) {
				if ( _imgs[i].scrollWidth > opts.width ) {
					_imgs[i].width = opts.width;
					_imgs[i].onclick = showPic;
					_imgs[i].style.cursor = "pointer";
					_imgs[i].alt = "点击放大";
				}
			}

			for ( var i = 0; i < _tabs.length; i++ ) {
				if ( _tabs[i].width > opts.width ) {
					_tabs[i].width = opts.width;
				}
			}
		}

		function showPic() {
			if ( opts.url === "" ) {
				window.open(this.src);
			} else {
				window.open(opts.url + "?" + this.src);
				//window.open("/s/pic.html?" + this.src);
			}
		}

	},

	// 固定位置（参数?）
	fixedPosition: function( selector, options ) {
		var el = jQuery(selector)[0];
		if ( !el ) return;

		if ( isNaN(options.top) && isNaN(options.bottom) ) {
			return;
		}

		var _default = {
			obj: el
		};
		var opts = jQuery.extend( {}, _default, options );

		opts.objHeight = opts.obj.clientHeight;
		opts.closeObj = jQuery(el).find(".J_btnClose")[0];

		// then opts: obj objHeight closeObj top/bottom

		if ( !window.fixedPositionBox ) {
			window.fixedPositionBox = [];
		}
		window.fixedPositionBox.push(opts);

		// 关闭
		var _index = window.fixedPositionBox.length - 1;
		var _obj = window.fixedPositionBox[_index].obj;
		var _closeObj = window.fixedPositionBox[_index].closeObj;
		if (!!_closeObj) {
			_closeObj.onclick = function(){
				_obj.parentNode.removeChild(_obj);
				for ( var i = 0; i < window.fixedPositionBox.length; i++ ) {
					if ( window.fixedPositionBox[i].obj == _obj) {
						window.fixedPositionBox.splice(i, 1);
						break;
					}
				}
			}
		}

		// ie6
		if ( window.XMLHttpRequest ) return;

		// 多个固定框并存
		// 事件
		window.onresize = function(){setTop()}
		window.onscroll = function(){setTop()}

		var timer;
		function setTop() {
			if ( window.fixedPositionBox.length == 0 ) return;
			for (var i = 0; i < window.fixedPositionBox.length; i++) {
				var _fixedObj = window.fixedPositionBox[i];
				_fixedObj.obj.style.display = "none";
			}

			if ( timer ) clearTimeout(timer);
			timer = setTimeout(function(){
				for (var i = 0; i < window.fixedPositionBox.length; i++) {
					var _fixedObj = window.fixedPositionBox[i];
					_fixedObj.obj.style.top = getTop(_fixedObj);
					_fixedObj.obj.style.display = "block";
				}
			}, 400);
		}

		function getTop( fixedObj ) {
			var _t = document.documentElement.scrollTop || document.body.scrollTop;

			if ( !isNaN(fixedObj.top) ) {
				return _t + fixedObj.top;
			}  else if ( !isNaN(fixedObj.bottom) ) {
				var _h = document.documentElement.clientHeight || document.body.clientHeight;
				return _t + _h - fixedObj.objHeight - fixedObj.bottom;
			}
		}
	},

	// 三级菜单（只负责显示隐藏）
	showMenu: function( selector ) {
		var menu = jQuery(selector);

		jQuery("li", menu).hover(
			function () {
				jQuery(this).addClass("hover");
			},
			function () {
				jQuery(this).removeClass("hover");
			}
		);

		jQuery(selector).find("li li:has(ul)").addClass("parent");
	},

	// 多级导航

	// 按钮功能组件
	// 设为首页
	setHomePage: function( obj ) {
		var aUrls=document.URL.split("/");
	    var vDomainName="http://"+aUrls[2]+"/";
	    try{//IE
	        obj.style.behavior="url(#default#homepage)";
	        obj.setHomePage(vDomainName);
	    }catch(e){//other
	        if(window.netscape) {//ff
	            try {
	                    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
	            }
	            catch (e) {
	                    alert("此操作被浏览器拒绝！\n请在浏览器地址栏输入“about:config”并回车\n然后将[signed.applets.codebase_principal_support]设置为'true'");
	            }
	            var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
	            prefs.setCharPref('browser.startup.homepage',vDomainName);
	         };
	    };
		// ?
	    // if(window.netscape)alert("ff");
	},
	// 加入收藏
	addFavorite: function() {

        try{
            if ( window.sidebar && 'object' == typeof( window.sidebar ) && 'function' == typeof( window.sidebar.addPanel ) ){
                window.sidebar.addPanel(document.title, window.location.href , '');
            }
            else if ( document.all && 'object' == typeof( window.external ) ){
                window.external.addFavorite(window.location.href , document.title);
            }
            else {
                alert('您使用的浏览器不支持此功能，请按"Ctrl + D"键手工加入收藏');
            }
        }catch(e){
            alert('您使用的浏览器不支持此功能，请按"Ctrl + D"键手工加入收藏');
        }
        return false;

	},

	// 复制地址
	copyURL: function() {
		var myHerf=top.location.href;
		var title=document.title;
		if(window.clipboardData){
			var tempCurLink=title + "\n" + myHerf;
			var ok=window.clipboardData.setData("Text",tempCurLink);
			if(ok) alert("复制成功！按Ctrl + V，粘贴到QQ或微博上发给你的小伙伴们吧！");
		}else{prompt("按Ctrl+C复制当前网址", myHerf + " " + title);}
	},

	/******************************* 以下部分运用了解决dww2.js问题 *******************************/

	// 切换器（jquery）
	switchable: function( selector, options ) {
		if ( options.effect === "scrollTxt" ) {
			options.effect = "scrollLoopY";
		}

		// v2.1 prev to J_btnPrev
		else if ( options.effect === "scrollLoopX" ) {
			jQuery(selector).find("a.prev").addClass("J_btnPrev");
			jQuery(selector).find("a.next").addClass("J_btnNext");
		}

		jQuery(selector).Switchable( options );
	},

	tab: function( selector, eventType ) {
		var navLi = jQuery(selector).find(".J_nav > li"),
			contLi = jQuery(selector).find(".J_content > li");
		var classType = eventType == "hover" ? "hover" : "selected";

		if ( classType == "hover" ) {
			var timer;
			navLi.hover(function(){
				var i = navLi.index(this);
				timer = setTimeout(function(){navEvent(i, "hover");contEvent(i);}, 100);
			}, function() {
				if (timer) {
					clearTimeout(timer);
				}
			});
		} else {
			navLi.hover(function(){
				var i = navLi.index(this);
				navEvent(i, "hover");
			}, function(){
				jQuery(this).removeClass("hover");
			}).click(function(){
				var i = navLi.index(this);
				navEvent(i, "selected");
				contEvent(i);
			});
		}

		function navEvent(i, type) {
			navLi.eq(i).addClass(type).siblings().removeClass(type);
		}
		function contEvent(i) {
			contLi.eq(i).show().siblings().hide();
			contLi.eq(i).find("img").each(function(_index, e) {
				var _src = $(e).attr("data-original");
				if(_src) {
					$(e).attr("src", _src);
				}
			})
		}
	},

	// 导航树（jquery）
	navtree: function( showAll ) {
		if (jQuery(".sitenav").length) {
			// ie
			if (!-[1, ]) {
				jQuery(".sitenav ul").each(function(){
					jQuery(this).children("li:last-child").addClass("last-child");
				});
			}

			jQuery(".sitenav>ul>li").each(function(){
				var ul = jQuery(this).find("ul:first");
				if (!ul.length) return;

				if ( showAll ) {
					ul.attr("class", "show");
				}

				var span = jQuery("<span></span>");
				span.prependTo(ul.siblings("b"));
				span.height = ul.height();
				span.status = "visible";

				if (ul.attr("class") !== "show") {
					ul.css("height", "0");
					span.status = "hidden";
				}

				span.click(function(){
					if (span.status === "hidden") {
						span.status = "visible";
						ul.animate({height: span.height}, 500);
					}
					else {
						span.status = "hidden";
						ul.animate({height: 0}, 500);
					}
				});
			});
		}
	},

	// 弹框
	popupbox: function( id, options ) {
		var box = document.getElementById(id);
		if (!box) return;

		var _default = {
			existMask: true
		};
		var opts = jQuery.extend( {}, _default, options );

		// 创建遮罩，显示弹出框
		this.open = function(maskCss, boxCss) {
			this.box.style.cssText = boxCss;
			this.mask.style.cssText = maskCss;

			// 解决ie6 bug
			if(!window.XMLHttpRequest) {
				document.documentElement.scrollTop++;
				document.documentElement.scrollTop--;
			}

			if ( opts.existMask ) document.body.appendChild(this.mask);
		},

		// 关闭遮罩
		this.close = function() {
			document.getElementsByTagName("html")[0].style.backgroundImage = "";

			// ie6 清空css表达式
			this.box.style.cssText = "";
			this.box.style.display = "none";

			if ( opts.existMask ) document.body.removeChild(this.mask);
		}

		this.box = box;
		this.mask = document.createElement("div");

		// dom宽高
		this.box.style.display = "block";
		var boxWidth = this.box.clientWidth,
			boxHeight = this.box.clientHeight;

		// 创建遮罩，显示弹出框
		var maskCss = "position:fixed;left:0;top:0;z-index:32766;width:100%;height:100%;filter:alpha(opacity=70);-moz-opacity:0.7;opacity:0.7;background:#000;",
			boxCss = "display:block;position:fixed;left:50%;top:50%;z-index:32767;margin:-" + boxHeight / 2 + "px 0 0 -" + boxWidth / 2 + "px;";
		// ie6
		if(!window.XMLHttpRequest) {
			// ie6 css表达式
			maskCss += "position:absolute;top:expression(documentElement.scrollTop);height:expression(document.documentElement.clientHeight);";
			boxCss += "position:absolute;top:expression(documentElement.scrollTop + document.documentElement.clientHeight/2);";

			// 解决ie6 bug
			document.getElementsByTagName("html")[0].style.backgroundImage = "url(blank)";
		}
		this.open(maskCss, boxCss);

		// 关闭弹出框事件设置（约定关闭按钮classname为btn-close）
		var tags = this.box.getElementsByTagName("*");
		for (var i = 0; i < tags.length; i++) {
			if (tags[i].className == "btn-close") {
				var self = this;
				tags[i].onclick = function() {
					self.close();
					return false;
				}
				break;
			}
		}
	},

	// 特殊连接提示框
	datatip: function( imgsrc ) {
		if (imgsrc) {
			document.write('<style type="text/css">#data-tip b, #data-tip div{background-image:url(' + imgsrc + ')}</style>');
		}

		// 相对mouse位置
		var offset = {x : 15, y : 15};

		// 分配事件
		var aTags = document.getElementsByTagName("a");
		for (var i = 0; i < aTags.length; i++) {
			if (aTags[i].getAttribute("data-tip") != null) {
				aTags[i].onmouseover = mouseover;
				aTags[i].onmousemove = mousemove;
				aTags[i].onmouseout = mouseout;
			}
		}

		// 鼠标移上或离开
		function isMouseLeaveOrEnter(e, handler) {
			if (e.type != 'mouseout' && e.type != 'mouseover') return false;

			var reltg = e.relatedTarget ? e.relatedTarget : e.type == 'mouseout' ? e.toElement : e.fromElement;
			while (reltg && reltg != handler)
				reltg = reltg.parentNode;
			return (reltg != handler);
		}

		// 鼠标移上
		function mouseover() {
			var event = window.event || arguments[0],
				srcElement = event.srcElement || event.target;
			if(!isMouseLeaveOrEnter(event, this)) return;

			while (srcElement && !srcElement.getAttribute("data-tip")) srcElement = srcElement.parentNode;
			html = "<b></b><div>" + srcElement.getAttribute("data-tip") + "</div>";

			var tip = document.getElementById("data-tip");
			if (tip) {
				tip.innerHTML = html;
				tip.style.display = "block";
			} else {
				var tip = document.createElement("div");
				tip.id = "data-tip";
				tip.innerHTML = html;
				document.body.appendChild(tip);
			}
		}

		// 鼠标移动（在目标上）
		function mousemove() {
			var tip = document.getElementById("data-tip");
			if (!tip) return;

			var event = window.event || arguments[0];
			var pos = mousecoords(event);
			tip.style.left = (pos.x + offset.x) + "px";
			tip.style.top = (pos.y + offset.y) + "px";
		}

		// 鼠标离开
		function mouseout() {
			var event = window.event || arguments[0];
			if (!isMouseLeaveOrEnter(event, this)) return;

			var tip = document.getElementById("data-tip");
			if (!tip) return;

			tip.style.display = "none";
		}

		// 鼠标位置
		function mousecoords(event) {
			if (event.pageX) {
				return {x : event.pageX, y : event.pageY};
			} else {
				return {
					x : event.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft),
					y : event.clientY + (document.documentElement.scrollTop || document.body.scrollTop)
				}
			}
		}
	},

	// 三级菜单
	jsmenu: function( selector ) {
		var jsMenu = jQuery(selector);

		/* 二级菜单top */
		var height = jQuery(">ul>li", jsMenu).height();
		jQuery(">ul>li>ul", jsMenu).css({top: height});

		/* 二三级菜单水平对齐 */
		var width = jQuery("ul>li>ul", jsMenu).width();
		jQuery("ul ul ul", jsMenu).css({left: width}).siblings("a").addClass("expand");
		jQuery(">ul>li:last>ul", jsMenu).css({left: "auto",right: 0}).find("ul").css({left: "auto", right: width});

		jQuery("li", jsMenu).hover(
			function () {
				jQuery(this).addClass("hover");
			},
			function () {
				jQuery(this).removeClass("hover");
			}
		);
	}
}

// 回到顶部
jQuery(function(){
	jQuery('#J_BackToTop,#J_backToTop').click(function(){
		jQuery('html,body').animate({scrollTop:0},0);
		return false;
	});
});

// 按钮
jQuery(function(){
    jQuery('.ui-button:not(".ui-button-disabled")').hover(function(){
        jQuery(this).addClass('ui-button-hover');
    },function(){
        jQuery(this).removeClass('ui-button-hover');
    });
    jQuery('.ui-button-disabled').click(function(){
        return false;
    });
});

// Massage
jQuery(function(){
    jQuery('.mod-msg .J_btnClose').click(function(){
        jQuery(this).parent('.mod-msg').fadeOut('fast');
    });
});

//设为首页
//onclick="setHomePage(this);"
function setHomePage(obj){
    var aUrls=document.URL.split("/");
    var vDomainName="http://"+aUrls[2]+"/";
    try{//IE
        obj.style.behavior="url(#default#homepage)";
        obj.setHomePage(vDomainName);
    }catch(e){//other
        if(window.netscape) {//ff
            try {
                    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
            }
            catch (e) {
                    alert("此操作被浏览器拒绝！\n请在浏览器地址栏输入“about:config”并回车\n然后将[signed.applets.codebase_principal_support]设置为'true'");
            }
            var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
            prefs.setCharPref('browser.startup.homepage',vDomainName);
         };
    };
};

//加入收藏
//onclick="addFavorite();"
function addFavorite(){
    try{
        if ( window.sidebar && 'object' == typeof( window.sidebar ) && 'function' == typeof( window.sidebar.addPanel ) ){
            window.sidebar.addPanel(document.title, window.location.href , '');
        }
        else if ( document.all && 'object' == typeof( window.external ) ){
            window.external.addFavorite(window.location.href , document.title);
        }
        else {
            alert('您使用的浏览器不支持此功能，请按"Ctrl + D"键手工加入收藏');
        }
    }catch(e){
        alert('您使用的浏览器不支持此功能，请按"Ctrl + D"键手工加入收藏');
    }
    return false;
};

//复制地址
//onclick="copyURL();"
function copyURL(){
    var myHerf=top.location.href;
    var title=document.title;
    if(window.clipboardData){
        var tempCurLink=title + "\n" + myHerf;
        var ok=window.clipboardData.setData("Text",tempCurLink);
        if(ok) alert("复制成功！按Ctrl+V ,粘贴到QQ或微博上发给你的好友们吧！");
    }else{prompt("按Ctrl+C复制当前网址", myHerf + " " + title);}
};
