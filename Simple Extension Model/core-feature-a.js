!function( core ) {
    
    core.extend({
        
        // Default
        id: 'featureA',
        
        // Default
        setup: function( api, options ) {
            console.log( '[' + this.id  + ']', 'execute setup' );
            
            api.subscribe( 'afterInit', this.custom );
        },
        
        // Default
        destroy: function( api ) {
            console.log( '[' + this.id  + ']', 'execute destroy' );
        },
        
        custom: function( api ) {
            console.log( '[' + this.id  + ']', 'execute custom' );
            
            api.data.hello = this.id;
            
            console.log( '[' + this.id  + ']', 'core.state.hello:', api.state( 'hello' ) );
            
            api.publish( 'update' );
        }
    });
    
}( window.core );