var featureA = {
	
	// Default
	id: 'featureA',
	
	// Default
	setup: function( api ) {
		console.log( '[' + this.id	+ ']', 'execute setup' );
		
		api.subscribe( 'afterInit', this.custom );
		api.subscribe( 'preFrameChange', this.preFrameChange );
		api.subscribe( 'postFrameChange', this.postFrameChange );
	},
	
	preFrameChange: function( api ) {
		console.log( '[' + this.id	+ ']', 'pre-frame animation' );
	},
	
	postFrameChange: function( api ) {
		console.log( '[' + this.id	+ ']', 'post-frame animation' );
	},
	
	// Default
	destroy: function( api ) {
		console.log( '[' + this.id	+ ']', 'execute destroy' );
	},
	
	custom: function( api ) {
		console.log( '[' + this.id	+ ']', 'execute custom' );
		
		api.data.init = true;
		
		console.log( '[' + this.id	+ ']', 'core.state.init:', api.state( 'init' ) );
		api.publish( 'update' );
	}
}