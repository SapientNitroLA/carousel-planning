!function( componentName ) {
    
    function FeatureB( options, api ) {
        
        this.options = options;
        this.api = api;
        
        // console.log(this.options);
        // console.log(this.api);
        
        this.setup();
    }
    
    FeatureB.prototype = {
        
        // Default
        setup: function() {
            console.log( 'featureB execute setup' );
            
            // api.subscribe( 'afterInit', this.custom );
        },
    
        // Default
        destroy: function() {
            console.log( 'featureB execute destroy' );
        }
    }
    
    componentName.plugin( 'featureB', function( options, api ) {
        
        new FeatureB( options, api );
    });
    
}( window.componentName );