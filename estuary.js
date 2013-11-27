var estuary = (function () {

	var pos = 0;
	var c = {
			duration: 200,
			nav: null,
			script: [],
			skrollr: {},
			behaviors: {}
		};


	var setConfig = function (config) {
		if (c.pos) {
			pos = c.pos;
		}
		c = _.extend(c, config);
	};

	var init = function (config) {
		if (config !== null) {
			setConfig(config);
		}

		engage();

		var s = skrollr.init(skrollr);

	};

	// todo: needs to recalculate on resize
	var windowHeight = $(window).height(),
		windowWidth = $(window).width();

	// converts an object into a single line style string
	var toStyles = function (o) {

		var style = "";
		for (var i in o) {
			style += " " + i + ": " + o[i] + ";";
		}

		return style;

	};

	var behaviors = {
		'fade': {
			beginEnter: function (pos, duration) {
				return {
					pos: pos - duration,
					styles: "top: 0px; left: " + windowWidth + "px; opacity: 0;"
				};
			},
			endEnter: function (pos, duration) {
				return {
					pos: pos,
					styles: "top: 0px; left: 0px; opacity: 1;"
				};
			},
			beginExit: function (pos, duration) {
				return {
					pos: pos + duration,
					styles: "top: 0px; left: 0px; opacity: 1;"
				};
			},
			endExit: function (pos, duration) {
				return {
					pos: pos + (2 * duration),
					styles: "top: 0px; left: -" + windowWidth + "px; opacity: 0;"
				};
			},
			posIncrement: function (pos, duration) {
				return 2 * duration;
			}
		},
		'frame': {
			beginEnter: function (pos, duration) {
				return {
					pos: pos - duration,
					styles: "top: 100%; opacity: 0;"
				};
			},
			endEnter: function (pos, duration) {
				return {
					pos: pos,
					styles: "top: 0%; opacity: 1;"
				};
			},
			beginExit: function (pos, duration) {
				return {
					pos: pos + duration,
					styles: "top: 0px; opacity: 1;"
				};
			},
			endExit: function (pos, duration) {
				return {
					pos: pos + (2 * duration),
					styles: "top: -"+ $(window).height() + "px; opacity: 0;"
				};
			},
			posIncrement: function (pos, duration) {
				return 2 * duration;
			}
		},
		'bubble': {
			beginEnter: function (pos, duration) {
				return {
					pos: pos - Math.floor((Math.random() * duration)) - duration,
					styles: "top: 100%;"
				};
			},
			endEnter: function (pos, duration) {
				return {
					pos: pos-1,
					styles: "top: 50%;"
				};
			},
			beginExit: function (pos, duration) {
				return {
					pos: pos,
					styles: "top: " + Math.floor(($(window).height() / 2)) + "px;"
				};
			},
			endExit: function (pos, duration) {
				return {
					pos: pos + Math.floor((Math.random() * duration)) + duration,
					styles: "top: -"+ ($(window).height() + (Math.random()*1000)) + "px;"
				};
			},
			posIncrement: function (pos, duration) {
				return 0;
			}
		},
		'scatter': {
			beginEnter: function (pos, duration) {
				return {
					pos: pos,
					styles: ""
				};
			},
			endEnter: function (pos, duration) {
				return {
					pos: pos,
					styles: ""
				};
			},
			beginExit: function (pos, duration) {
				return {
					pos: pos,
					styles: ""
				};
			},
			endExit: function (pos, duration) {

				var top = ((Math.random()*10000) - 5000) + "px;",
					left = ((Math.random()*10000) - 5000) + "px;";

				return {
					pos: pos + 500,
					styles: toStyles({top: top, left: left})
				};
			},
			posIncrement: function (pos, duration) {
				return 0;
			}
		}
	};

	var behave = function (behavior, pos, duration, $e) {
		return {
			beginEnter: behavior.beginEnter(pos, duration, $e),
			endEnter: behavior.endEnter(pos, duration, $e),
			beginExit: behavior.beginExit(pos, duration, $e),
			endExit: behavior.endExit(pos, duration, $e),
			posIncrement: behavior.posIncrement(pos, duration, $e)
		};
	};

	var applyBehavior = function($e, b, i, l) {

		if (i !== 0) {
			$e.attr('data-' + b.beginEnter.pos, b.beginEnter.styles);
		}
		$e.attr('data-' + b.endEnter.pos, b.endEnter.styles);
		$e.attr('data-' + b.beginExit.pos, b.beginExit.styles);
		
		if (i !== (l - 1)) {
			$e.attr('data-' + b.endExit.pos, b.endExit.styles);
		}

	};

	var engage = function () {

		for (var i = 0, l = c.script.length; i < l; i++) {

			// behavior pointer
			var behavior = behaviors[c.script[i].type];

			// element pointer
			var $e = $("#" + c.script[i].id);
			if (! $e) {
				$e = $("<div></div>");
			}

			// attach anchor for nav
			if (c.nav) {
				$e.prepend($('<a name="' + c.script[i].id + '"/>'));
			}

			// got style(s)?
			if (c.script[i].css) {
				$e.css(c.script[i].css);
			}

			// compute behavior
			var b = behave(behavior, pos, c.duration, $e);

			// apply behavior
			applyBehavior($e, b, i, l);

			// increment position
			pos += b.posIncrement;

		}

	};

	return {
		init: init
	};

}());