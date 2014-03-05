// Depends on x.js

!function() {
    
    var defaults
    
    function Core( x, options ) {
        console.log( 'new Core instance created' );
    
        this.x = x;
        x.state.init = false;
    }

    Core.prototype = {

        init: function() {
    
            if ( this.x.state.init ) return;
    
            this.x.publish( 'beforeInit' );
    
            this.x.state.init = true;
    
            this.x.publish( 'afterInit' );
        }
    }

    window.core = function( extensions, options ) {
    
        var x = new X;
    
        for ( var i = 0; i < extensions.length; i++ ) {
        
            x.extend( extensions[i] );
        }
    
        var c = new Core( x, options );
    
        return {
            init: x.proxy( c, c.init )
        }
    }
}();