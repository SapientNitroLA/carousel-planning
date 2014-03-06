!function( core ) {
    
    core.extend({
        
        id: 'featureB',
        
        // Default
        setup: function( api, options ) {
            console.log( '[' + this.id  + ']', 'execute setup' );
            
            api.subscribe( 'beforeInit', this.custom );
        },
        
        // Default
        destroy: function( api ) {
            console.log( '[' + this.id  + ']', 'execute destroy' );
        },
        
        custom: function( api ) {
            console.log( '[' + this.id  + ']', 'execute init' );
            
            api.data.hello = this.id;
            
            console.log( '[' + this.id  + ']', 'core.state.hello:', api.state( 'hello' ) );
            
            api.publish( 'update' );
        }
    });
    
}( window.core );