var Gradient = function(){

	/* -------------------------------------------------------------------------- */
	//vars
	var //properties
		vendor_prefixes = [' ', '-o-', '-moz-', '-webkit-', '-ms-', ' '],
		gradientProps = {
			'type'   : 'linear',
			'xStart' : 'left',
			'yStart' : 'bottom',
			'xEnd'   : 'left',
			'yEnd'   : 'top'
		},
		gradients = [
			{hex:'#ff0000', pos:0},
			{hex:'#00ff00', pos:100}
		];

	/* -------------------------------------------------------------------------- */
	/* utils */

	//fetchGradientStart
	function fetchGradientStart() {
		return gradientProps.xStart + ' ' + gradientProps.yStart;
	}

	//fetchGradientEnd
	function fetchGradientEnd() {
		return gradientProps.xEnd + ' ' + gradientProps.yEnd;
	}

	function updateSettings(settings) {
		gradientProps = $.extend(gradientProps, settings.gradientProps);
		gradients = settings.gradients.slice(0);
		//console.log(gradientProps, gradients);
	}

	/* -------------------------------------------------------------------------- */
	/* generators */

	//generateLinearGradient
	function generateLinearGradient() {

		var gradientString = gradientProps.type + '-gradient(',
			gradientData = '';
			gCount = gradients.length;

		if (gradientProps.xStart !== gradientProps.xEnd) {
			gradientString = gradientString + gradientProps.xStart + ' ';
		}

		if (gradientProps.yStart !== gradientProps.yEnd) {
			gradientString = gradientString + gradientProps.yStart;
		}

		gradientString = gradientString + ', ';

		$.each(gradients, function (index, obj) {
			if (index > 0) {
				gradientData = gradientData + ' ';
			}

			gradientData = gradientData + obj.hex + ' ' + obj.pos + '%,';
		});

		gradientString = gradientString + gradientData;
		gradientString = gradientString.substr(0, gradientString.length - 1) + ')';

		return gradientString;
	}

	//generateWebkitGradient
	function generateWebkitGradient(settings) {

		if (settings) updateSettings(settings);

		gradientString = '-webkit-gradient(' + gradientProps.type + ',' + fetchGradientStart() + ',' + fetchGradientEnd() + ',',
		gradientData = '';

		var	pLength = gradients.length,
			percent, obj;

		for(var i=0; i<pLength; i++) {
			obj = gradients[i];
			percent = (obj.pos);
			gradientData = gradientData + 'color-stop(' + percent + '%, ' + obj.hex + '),';
		}

		gradientString = gradientString + gradientData;
		gradientString = gradientString.substr(0, gradientString.length - 1) + ');';

		return gradientString;
	}

	//generateAll
	function generateAll(settings) {

		if (settings) updateSettings(settings);
		var gProps = gradientProps,
			linear_gradient = generateLinearGradient(),
			prefix = 'background-image: ',
			gradientString = 'background-image:' + vendor_prefixes.join(linear_gradient + ";\n" + prefix);

		gradientString = gradientString.slice(0, - (prefix.length + 1));
		gradientString = gradientString + prefix + "-webkit-gradient(\n\t";
		gradientString = gradientString + gProps.type + ",\n\t";
		gradientString = gradientString + fetchGradientStart() + ",\n\t";
		gradientString = gradientString + fetchGradientEnd() + ",\n\t";

		var pLength = gradients.length,
			cStop, i,
			delimiter;
		for (i = 0; i < pLength; i++) {
			delimiter = (i === pLength - 1) ? "\n" : ",\n\t";
			cStop = gradients[i];
			gradientString = gradientString + "color-stop(" + cStop.pos + "%, " + cStop.hex + ")" + delimiter;
		}
		gradientString = gradientString + ");";

		return (gradientString);
	}

	/* -------------------------------------------------------------------------- */
	//return API
	return {
		//methods
		generateAll				: generateAll,
		generateLinearGradient	: generateLinearGradient,
		generateWebkitGradient	: generateWebkitGradient
	};

}();
