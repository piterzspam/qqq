// ==UserScript==
// @name         WP usuwanie blura
// @match        *://*/*/*
// @include      /^https?:\/\/([a-z0-9_-]+\.)*((abczdrowie|allani|autokult|autocentrum|benchmark|dcwp|dobregry|dobreprogramy|domodi|easygo|echirurgia|extradom|finansowysupermarket|fotoblogia|gadzetomania|genialne|homebook|jastrzabpost|kafeteria|kardiolo|kazimierzdolny|kredytomat|komorkomania|last-minute|medycyna24|money|nocowanie|nowyosobowy|o2|parenting|parklot|polygamia|popularne|pudelek|pysznosci|smaczneblogi|so-magazyn|superauto|testwiedzy|totalmoney|vibez|wakacje|wp|wpext|money2money\.com)\.pl|(audioteka|nerwica|mazury|17bankow)\.com|(open)\.fm|(nocowanie)\.(sk|eu)|localhost)\/.*/
// @grant        none
// ==/UserScript==
(function() {
	const x = 5; // change this to the number of seconds you want between each run of function1
	const y = 30; // change this to the number of seconds you want function1 to run for
	let intervalId = null;
	let timeoutId = null;

	function function1() {
		const firstChild = document.querySelector('body > *:first-child');
		const filterStyle = getComputedStyle(firstChild).getPropertyValue('filter');
		if (filterStyle) {
			function2();
		}
	}

	function function2() {
		console.log("funkcja2");

		var list1 = [];
		var sheets = document.styleSheets;
		var regex = /\.(\w+) > \*, \[(\w+)\] \> \*/;
		for (var i = 0; i < sheets.length; i++) {
			var rules = sheets[i].rules || sheets[i].cssRules;
			for (var j = 0; j < rules.length; j++) {
				var rule = rules[j];
				if (rule.style && rule.style.filter && rule.style.filter === 'blur(8px)') {
					console.log("funkcja22");
					var selector = rule.selectorText;
					if (selector && regex.test(selector)) {
						console.log("funkcja22");
						var match = selector.match(regex);
						var class1 = match[1];
						var attribute1 = match[2];
						var mainElementSelector = "BODY" + "." + class1 + "[" + attribute1 + "]";
						var element = document.querySelector(mainElementSelector);
						if (element) {
							console.log("funkcja23");
							element.classList.remove(class1);
							element.removeAttribute(attribute1);
						}
						list1.push(mainElementSelector);
						list1.push("." + class1);
						list1.push("[" + attribute1 + "]");
					}
				}
			}
		}
	}

	function runFunction() {
		function1();
		intervalId = setInterval(function1, x * 1000);
		timeoutId = setTimeout(stopFunction, y * 1000);
	}

	function stopFunction() {
		clearInterval(intervalId);
		clearTimeout(timeoutId);
	}

	window.addEventListener('load', function() {
		runFunction();
	});
})();
