!function( componentName ) {
    
    function FeatureA( options, api ) {
        
        this.options = options;
        this.api = api;
        
        // console.log(this.options);
        // console.log(this.api);
        
        this.setup();
    }
    
    FeatureA.prototype = {
        
        // Default
        setup: function() {
            console.log( 'featureA execute setup' );
            
            // api.subscribe( 'afterInit', this.custom );
        },
    
        // Default
        destroy: function() {
            console.log( 'featureA execute destroy' );
        }
    }
    
    componentName.plugin( 'featureA', function( options, api ) {
        
        new FeatureA( options, api );
    });
    
}( window.componentName );