var featureA = {
	
	// Default
	id: 'featureA',
	
	// Default
	setup: function( api ) {
		this.log.msg( '[' + this.id	+ ']', 'execute setup' );
		
		api.subscribe( 'afterInit', this.custom );
		api.subscribe( 'preFrameChange', this.preFrameChange );
		api.subscribe( 'postFrameChange', this.postFrameChange );
	},
	
	preFrameChange: function( api ) {
		this.log.msg( '[' + this.id	+ ']', 'pre-frame animation' );
	},
	
	postFrameChange: function( api ) {
		this.log.msg( '[' + this.id	+ ']', 'post-frame animation' );
	},
	
	// Default
	destroy: function( api ) {
		this.log.msg( '[' + this.id	+ ']', 'execute destroy' );
	},
	
	custom: function( api ) {
		this.log.msg( '[' + this.id	+ ']', 'execute custom' );
		
		api.data.init = true;
		
		this.log.msg( '[' + this.id	+ ']', 'core.state.init:', api.state( 'init' ) );
		api.publish( 'update' );
	},
	
	log: {
		enabled: true,
		msg: function( msg ) {
			if ( this.enabled ) {
				if ( arguments.length === 1 ) console.log( msg );
				else console.log( arguments );
			}
		}
	}
}