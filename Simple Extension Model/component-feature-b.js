!function( componentName ) {
    
    function FeatureB( options, api ) {
        
        this.options = options;
        this.api = api;
        
        this.setup();
    }
    
    FeatureB.prototype = {
        
        // Default
        setup: function() {
            console.log( 'featureB execute setup' );
            
            this.initToken = this.api.subscribe( 'componentName/init', this.destroy.bind( this ) );
        },
    
        // Default
        destroy: function() {
            console.log( 'featureB execute destroy' );
            this.api.unsubscribe( this.initToken );
        }
    }
    
    componentName.plugin( 'featureB', function( options, api ) {
        
        new FeatureB( options, api );
    });
    
}( window.componentName );