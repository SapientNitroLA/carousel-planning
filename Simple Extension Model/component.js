!function( x ) {
    
    var defaults = {};
    
    var extensions = {};
    
    function Component( utils, options ) {
        console.log( '[component] new Component instance created' );
        
        // TODO reconcile options with defaults
    
        this.utils = utils;
        this.utils.state.hello = 'component';
        
        this.init();
    }

    Component.prototype = {

        init: function() {
    
            this.utils.publish( 'beforeInit' );
    
            this.utils.publish( 'afterInit' );
        },
        
        log: function( msg ) {
            console.log( '[component] ' + msg );
        }
    }
    
    function create( options ) {
    
        var c
            , api = {}
            , utils = x()
            ;

        for ( var extension in extensions ) {
        
            utils.extend( extensions[ extension ], options[ extension ] );
        }
    
        c = new Component( utils, options );
        
        api = {
            log: utils.proxy( c, c.log )
        }
    
        return api;
    }
    
    function plugin( extension ) {
        
        // Make sure there are no naming conflicts
        if ( extension.id in defaults ) {
            throw new Error( 'The extension id "' + extension.id + '" conflicts with the Component options.' )
        }
        
        extensions[ extension.id ] = extension;
    }

    window.component = create;
    window.component.plugin = plugin;
    
}( window.x );