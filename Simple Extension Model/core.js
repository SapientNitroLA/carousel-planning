// Depends on x.js

!function() {
    
    var defaults = {};
    
    var extensions = {};
    
    function Core( x, options ) {
        console.log( '[core] new Core instance created' );
        
        // reconcile options with defaults
    
        this.x = x;
        x.state.hello = 'core';
        
        this.init();
    }

    Core.prototype = {

        init: function() {
    
            this.x.publish( 'beforeInit' );
    
            this.x.publish( 'afterInit' );
        },
        
        log: function( msg ) {
            console.log( '[core] ' + msg );
        }
    }
    
    function create( options ) {
    
        var x = new X;

        for ( var extension in extensions ) {
        
            x.extend( extensions[ extension ], options[ extension ] );
        }
    
        var c = new Core( x, options );
    
        return {
            log: x.proxy( c, c.log )
        }
    }
    
    function extend( extension ) {
        
        // Make sure there are no naming conflicts
        if ( extension.id in defaults ) {
            throw new Error( 'The extension id "' + extension.id + '" conflicts with the core options.' )
        }
        
        extensions[ extension.id ] = extension;
    }

    window.core = create;
    window.core.extend = extend;
}();