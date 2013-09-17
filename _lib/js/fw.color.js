var Color = function(){

	/* -------------------------------------------------------------------------- */
	//vars
	var REGEXP_RGB = /^rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)$/,
		REGEXP_HSL = /^hsl\((\d{1,3}),(\d{1,3})%,(\d{1,3})%\)$/,
		REGEXP_HEX = /^#?(\w{1,2})(\w{1,2})(\w{1,2})$/,
		REGEXP_WHITESPACE = /\s+/g;

	/* -------------------------------------------------------------------------- */
	//helpers
	function trim(str) {
		return str ? String(str).replace(REGEXP_WHITESPACE, '') : '';
	}

	function rgbToArray(rgb) {
		var match = trim(rgb).match(REGEXP_RGB);
		return match !== null ? match.slice(1) : null;
	}

	function hexToArray(hex) {
		var match = String(hex).toLowerCase().match(REGEXP_HEX);
		var arr = match !== null ? match.slice(1) : null;

		if (arr) {
			if (arr[0].length != arr[1].length || arr[0].length != arr[2].length) {
				arr = null;
			}
			else {
				if (isNaN(parseInt(arr[0], 16)) ||
					isNaN(parseInt(arr[1], 16)) ||
					isNaN(parseInt(arr[2], 16))) {
					arr = null;
				}
				else if (arr[0].length == 1) {
					arr = [String(arr[0]) + String(arr[0]),
						String(arr[1]) + String(arr[1]),
						String(arr[2]) + String(arr[2])];
				}
			}
		}

		return arr;
	}

	/* -------------------------------------------------------------------------- */
	//methods
	function mix(color1, color2, ratio) {
		var med = null,
			rgb1 = hexToRgb(color1, true),
			rgb2 = hexToRgb(color2, true);

		if (rgb1 !== null && rgb2 !== null) {
			var r = Math.floor((rgb1[0] + rgb2[0]) * ratio),
				g = Math.floor((rgb1[1] + rgb2[1]) * ratio),
				b = Math.floor((rgb1[2] + rgb2[2]) * ratio);

			med = rgbToHex('rgb(' + r + ', ' + g + ', ' + b + ')');
		}

		return med;
	};

	function hexToRgb(hex, array) {
		var tmp = hexToArray(hex),
			rgb = null;

		if (tmp && tmp.length == 3) {
			rgb = tmp.map(function(value){
				if (value.length == 1) value += value;
				return parseInt(value, 16);
			});
			rgb = (array) ? rgb : 'rgb(' + rgb + ')';
		}

		return rgb;
	}

	function rgbToHex(rgb, array) {
		var tmp = rgbToArray(rgb),
			hex = null;

		if (tmp && tmp.length == 3) {
			hex = [];
			for (var i=0; i<3; i++){
				var bit = (tmp[i] - 0).toString(16);
				hex.push((bit.length == 1) ? '0' + bit : bit);
			}
			hex = (array) ? hex : '#' + hex.join('');
		}

		return hex;
	}

	/* -------------------------------------------------------------------------- */
	//return API
	return {
		//methods
		mix			: mix,
		hexToRgb	: hexToRgb,
		rgbToHex	: rgbToHex
	};

}();
