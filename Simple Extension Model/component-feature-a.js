!function( componentName ) {
    
    function FeatureA( options, api ) {
    
        this.options = options;
        this.api = api;
    
        this.setup();
    }

    FeatureA.prototype = {
    
        // Default
        setup: function() {
            
            console.log( 'featureA execute setup' );
            console.log(this.api);
            this.initToken = this.api.subscribe( 'componentName/init', this.destroy.bind( this ) );
        },

        // Default
        destroy: function() {
            
            console.log( 'featureA execute destroy' );
            this.api.unsubscribe( this.initToken );
            this.api.trigger( 'custom', 'Hello!' );
            console.log( 'this.api.getState', this.api.getState( 'element' ) );
        }
    }
    
    componentName.plugin( 'featureA', function( options, api ) {
        
        new FeatureA( options, api );
    });
    
}( window.componentName );