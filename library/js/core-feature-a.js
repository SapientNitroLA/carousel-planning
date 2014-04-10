!function( carousel ) {
    
    function FeatureA( options, api ) {
    
        this.options = options;
        this.api = api;
    
        this.setup();
    }

    FeatureA.prototype = {
        
        setup: function() {
            
            console.log( 'featureA execute setup', this.options, this.api );
            
            this.api.subscribe( this.api.ns + '/prevFrame/after', this.prev.bind( this ) );
            this.api.subscribe( this.api.ns + '/nextFrame/after', this.next.bind( this ) );
        },
        
        next: function() {
            
            var self = this;
            
            console.log( 'this.api.getState', this.api.getState( 'frameIndex' ) );
        },

        prev: function() {
            
            console.log( 'this.api.getState', this.api.getState( 'frameIndex' ) );
        }
    }
    
    carousel.plugin( 'featureA', function( options, api ) {

        new FeatureA( options, api );
    });
    
}( window.carousel );