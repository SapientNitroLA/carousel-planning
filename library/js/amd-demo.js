require.config({
	//baseUrl: "library/js",
	paths: {
		'core': 'core',
		'x': 'x',
		'lodash': 'vendor/lodash'
	}
});
require(
	[
		'core'
	]
	, function( core ) {
		var options = {
			parent: document.getElementById("example-carousel"),
			increment: 4,
			incrementMode: 'tile',
			encapsulateControls: true,
			wrapperDelta: 10,
			viewportDelta: 10,
			prevText: '<',
			nextText: '>',
			preFrameChange: function() {
				//console.log("options: preFrameChange()");
			},
			postFrameChange: function() {
				//console.log("options: postFrameChange()");
			}
		}
		var carousel = core();
		
		carousel.init(options);
	}
);