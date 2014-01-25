var featureA = {
    
    // Default
    id: 'featureA',
    
    // Default
    setup: function( api ) {
        console.log( '[' + this.id  + ']', 'execute setup' );
        
        api.subscribe( 'afterInit', this.custom );
    },
    
    // Default
    destroy: function( api ) {
        console.log( this.id, 'execute destroy' );
    },
    
    custom: function( api ) {
        console.log( '[' + this.id  + ']', 'execute custom' );
        
        api.data.init = true;
        
        console.log( '[' + this.id  + ']', 'core.state.init:', api.state( 'init' ) );
        api.publish( 'update' );
    }
}