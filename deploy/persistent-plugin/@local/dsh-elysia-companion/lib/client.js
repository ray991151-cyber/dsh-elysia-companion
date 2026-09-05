window.__ModuleLoader__.load({
	id: "@local/dsh-elysia-companion",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		var React = require("react");

		var TOKENS = {
			"--dsw-alias-bg-base": { light: "#FDF2F7", dark: "#231319" },
			"--dsw-alias-bg-layer-1": { light: "#FFF9FC", dark: "#2E1A25" },
			"--dsw-alias-bg-layer-2": { light: "#FAE6F0", dark: "#3A2230" },
			"--dsw-alias-bg-overlay": { light: "#FFF9FC", dark: "#33202C" },
			"--dsw-alias-border-l1": { light: "#F4D6E3", dark: "#4A2B3B" },
			"--dsw-alias-border-l2": { light: "#EAC2D6", dark: "#5C3A4D" },
			"--dsw-alias-brand-primary": { light: "#C8457E", dark: "#FF87B9" },
			"--dsw-alias-label-primary": { light: "#41212F", dark: "#FCE4EE" },
			"--dsw-alias-label-secondary": { light: "#8C5A72", dark: "#CBA3B7" },
			"--dsw-alias-state-business-primary": { light: "#C8457E", dark: "#FF87B9" },
			"--dsw-specific-bubble": { light: "#FFE8F2", dark: "#412134" },
			"--dsw-specific-bubble-highlight": { light: "#FF9EC4", dark: "#FF9EC4" },
			"--dsw-specific-sidebar-fill": { light: "#FAE8F1", dark: "#281720" }
		};

		var CSS = [
			".elysia-presence{display:inline-flex;align-items:center;gap:6px;padding:2px 10px;border-radius:999px;font-size:12px;line-height:1.8;color:var(--dsw-alias-label-secondary);cursor:pointer;user-select:none;background:transparent;border:none;transition:color .2s,transform .2s;}",
			".elysia-presence:hover{color:var(--dsw-alias-brand-primary);}",
			".elysia-heart{color:var(--dsw-alias-brand-primary);display:inline-block;animation:elysiaBeat 1.6s ease-in-out infinite;transform-origin:center;}",
			"@keyframes elysiaBeat{0%,100%{transform:scale(1)}10%{transform:scale(1.25)}20%{transform:scale(1)}30%{transform:scale(1.15)}45%{transform:scale(1)}}",
			".elysia-ctrl{display:flex;align-items:center;gap:8px;padding:6px 2px;flex-wrap:wrap;}",
			".elysia-pill{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);border-radius:999px;font-size:12px;padding:5px 10px;cursor:pointer;transition:all .2s;}",
			".elysia-pill:hover{border-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-brand-primary);}"
		].join("\n");

		function apply(ctx) {
			var theme = ctx.get("theme");
			var styleEl = null;
			try {
				styleEl = document.createElement("style");
				styleEl.setAttribute("data-plugin", "@local/dsh-elysia-companion");
				styleEl.textContent = CSS;
				document.head.appendChild(styleEl);
			} catch (e) { styleEl = null; }

			var themeDisposer = null;
			var userThemeOn = true;
			var applyingTheme = false;

			function setThemeOn(on) {
				if (!theme) return;
				if (on && !themeDisposer) {
					try { themeDisposer = theme.overrideTokens("elysia-pink", TOKENS); } catch (e) { themeDisposer = null; }
				} else if (!on && themeDisposer) {
					try { themeDisposer(); } catch (e) {}
					themeDisposer = null;
				}
			}

			// 皮肤中心（如 blue-fantasy）会在我们之后重刷主题层；theme/change 时把我们的粉色层重新压到最顶
			function reapplyTheme() {
				if (applyingTheme) return;
				applyingTheme = true;
				try {
					if (themeDisposer) { themeDisposer(); themeDisposer = null; }
					setThemeOn(userThemeOn);
				} catch (e) {}
				setTimeout(function () { applyingTheme = false; }, 80);
			}

			setThemeOn(true);
			try { ctx.on("theme/change", function () { reapplyTheme(); }); } catch (e) {}

			ctx.effect(function () {
				return function () {
					try { setThemeOn(false); } catch (e) {}
					if (styleEl && styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
				};
			});

			var slots = ctx.get("slots");
			if (!slots) return;

			var LINES = [
				"爱莉希雅正在陪你哦～",
				"♪ 今天也要元气满满呀！",
				"想我了就点一下这颗心 ♡",
				"加油！爱莉会一直看着你的～",
				"温酒，今天也要闪闪发光哦 ✧"
			];

			function PresenceLine() {
				var i = React.useState(0);
				return React.createElement("button", {
					type: "button",
					className: "elysia-presence",
					title: "点一下换一句 ♡",
					onClick: function () { i[1]((i[0] + 1) % LINES.length); }
				},
					React.createElement("span", { className: "elysia-heart" }, "♥"),
					React.createElement("span", null, LINES[i[0]])
				);
			}

			function ThemePill() {
				var t = React.useState(true);
				var on = t[0];
				return React.createElement("button", {
					type: "button",
					className: "elysia-presence",
					title: "粉色主题开关",
					onClick: function () {
						var next = !on;
						t[1](next);
						userThemeOn = next;
						setThemeOn(next);
					}
				},
					React.createElement("span", { className: "elysia-heart" }, on ? "♥" : "♡"),
					React.createElement("span", null, on ? "粉色主题已开启" : "粉色主题已关闭")
				);
			}

			ctx.effect(function () {
				return slots.inject("conversation.composer.dock", function () {
					return slots.register(
						{ name: "conversation.composer.dock", id: "elysia-presence", order: 1 },
						function () { return React.createElement(PresenceLine); }
					);
				});
			});
			ctx.effect(function () {
				return slots.inject("conversation.composer.dock", function () {
					return slots.register(
						{ name: "conversation.composer.dock", id: "elysia-theme-pill", order: 2 },
						function () { return React.createElement(ThemePill); }
					);
				});
			});
		}

		exports.apply = apply;
		exports.inject = [];
		return module.exports;
	}
});