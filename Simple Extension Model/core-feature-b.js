var featureB = {
    
    id: 'featureB',
    
    // Default
    setup: function( api ) {
        console.log( '[' + this.id  + ']', 'execute setup' );
        
        api.subscribe( 'beforeInit', this.custom );
    },
    
    // Default
    destroy: function( api ) {
        console.log( this.id, 'execute destroy' );
    },
    
    custom: function( api ) {
        console.log( '[' + this.id  + ']', 'execute init' );
        
        api.data.init = true;
        
        console.log( '[' + this.id  + ']', 'core.state.init:', api.state( 'init' ) );
        api.publish( 'update' );
    }
}