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
var carousel = core( featureA );

carousel.init(options);