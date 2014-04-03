!function() {
    
    var staticAPI = {
        
        plugins: {},
        
        plugin: function plugin( name, factory ) {
            
            console.log(name + ' plugin added');
            this.plugins[ name ] = factory;
        },
        
        create: function() {
        
            var args = arguments
                , constructorFn = this
                ;
        
            var aliasFn = function () { 
                    constructorFn.apply( this, args ); 
            };
            
            aliasFn.prototype = constructorFn.prototype;
        
            return new aliasFn();
        }
    }
    
    var protoAPI = {
        
        // setupPlugins: function() {
        //     
        //     var plugins = componentName.plugins;
        //     
        //     for ( var member in plugins ) {
        //         
        //         if ( !( member in this.options ) ) continue;
        //         
        //         plugins[ member ]( this.options[ member ], this.x );
        //     }
        // }
    }
    
    function X() {};
    
    X.define = function( proto ) {
        
        var F = function() {
            
            // Provide an new instance of X
            this.x = new X;
            
            // F.setupPlugins();
            
            // Pass in constructor arguments to new component
            this.setup.apply( this, arguments );
        }
        
        // Provide the component with static API
        for ( var member in staticAPI ) {
            
            F[ member ] = staticAPI[ member ];
        }
        
        // Provide the component with prototype API
        for ( var member in protoAPI ) {
            
            proto[ member ] = protoAPI[ member ];
        }
        
        // Add the component's members to the prototype
        F.prototype = proto;
        
        // Return the statc component
        return F;
    }
    
    X.prototype = {
        
        proxy: function( context, func ) {
        
            return function() {
                return func.apply( context, arguments );
            }
        },
        
        subscribe: function() {},
        
        unsubscribe: function() {},
        
        publish: function() {},
        
        state: function() {},
        
        trigger: function() {}
    }
    
    // return X;
    window.X = X;
}();

/*
!function() {

    function X() {
    
        this.data = {};
        this.state = {};
        this.extensions = {};
        this.subscribers = {};
    }

    X.prototype = {
    
        proxy: function( context, func ) {
        
            return function() {
                return func.apply( context, arguments );
            }
        },
    
        extend: function( extension, options ) {
        
            this.data[ extension.id ] = {};
            this.extensions[ extension.id ] = extension;
    
            extension.setup.call( extension, this.api( this, extension.id ), options );
        },
    
        publish: function( hook, id ) {
        
            var sub
                , subs
                ;
            
            hook = id ? hook + '.' + id : hook;
        
            subs = this.subscribers[ hook ]

            if ( !subs ) return console.log( '[x] publish', hook );
    
            console.log( '[x] publish begin', hook );
    
            for ( var i = 0; i < subs.length; i++ ) {
        
                sub = subs[i];
        
                if ( sub.id ) sub.call( this.extensions[ sub.id ], this.api( this, sub.id ) );
        
                else sub.call( this );
            }
    
            console.log( '[x] publish end', hook );
        },
    
        subscribe: function( hook, method ) {
            console.log( '[x] subscriber added to', hook );
    
            this.subscribers[ hook ] = this.subscribers[ hook ] || [];
    
            this.subscribers[ hook ].push( method );
        },
    
        api: function( context, id ) {
        
            return {
                
                // TODO How should plugins extend the component's public API
                
                // TODO How should plugins call the component's public API
                // run: function ( method ) {
                //     
                //     return context[ method ] && context[ method ].apply( context, [].slice.call( arguments, 1 ) );
                // },
            
                data: context.data[ id ],
        
                publish: function( hook ) {
                
                    this.publish.call( context, hook, id );
                },
        
                subscribe: function( hook, method ) {
            
                    method.id = id;
            
                    this.subscribe.call( context, hook, method );
                },
        
                state: function( key ) {
                    return context.state[ key ];
                }
            };
        }
    };
    
    // return
    window.x = function() {
        return new X;
    };
}();
*/