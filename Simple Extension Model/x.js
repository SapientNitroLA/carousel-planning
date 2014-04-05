// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }
        
        var aArgs = Array.prototype.slice.call(arguments, 1), 
            fToBind = this, 
            fNOP = function () {},
            fBound = function () {
              return fToBind.apply(this instanceof fNOP && oThis
                                     ? this
                                     : oThis,
                                   aArgs.concat(Array.prototype.slice.call(arguments)));
            };
        
        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();
        
        return fBound;
    };
}

!function() {
    
    var staticAPI = {
        
        plugin: function plugin( name, factory ) {
            
            // console.log(name + ' plugin added');
            this.prototype.plugins[ name ] = factory;
        },
        
        /**
         * Provide a way to abstract away the use of the `new` keyword to instantiate component.
         */
        create: function create() {
        
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
        
        plugins: {},
        
        setupPlugins: function setupPlugins() {
            
            var plugins = this.plugins;

            for ( var member in plugins ) {
                
                if ( !( member in this.options ) ) continue;
                
                plugins[ member ]( this.options[ member ], this.x );
            }
        }
    }
    
    function X( component ) {
        
        this.channels = {}
        this.tokenUid = -1
        
        this.getState = function( key ) {
            return component.state[ key ];
        };
        
        this.trigger = function ( method ) {
            
            var func = component[ method ]
            
            if ( !func ) { return; };
            
            return func.apply( component, [].slice.call( arguments, 1 ) );
        }
    };
    
    X.define = function( namespace, proto ) {
        
        var F = function() {
            
            this.state = {};
            this.namespace = namespace;
            
            // Provide an new instance of X
            // Pass in the component
            this.x = new X( this );
            
            // Pass in constructor arguments to new component
            this.setup.apply( this, arguments );
        }
        
        // Provide the component with static API
        for ( var member in staticAPI ) {
            
            F[ member ] = staticAPI[ member ];
        }
        
        // Provide the component's prototype with an API
        for ( var member in protoAPI ) {
            
            proto[ member ] = protoAPI[ member ];
        }
        
        // Add the component's members to the prototype
        F.prototype = proto;
        
        // Return the statc component
        return F;
    }
    
    X.prototype = {
        
        subscribe: function( channel, method ) {
            
            var subscribers;
            
            this.tokenUid = this.tokenUid + 1;
            
            if ( !this.channels[ channel ] ) {
                this.channels[ channel ] = [];
            }
            
            subscribers = this.channels[ channel ];
            
            subscribers.push({
                token: this.tokenUid,
                method: method
            });

            return this.tokenUid;
        },
        
        unsubscribe: function( token ) {
            
            var subscribers;

            for ( var channel in this.channels ) {
                
                subscribers = this.channels[ channel ];
                
                if ( !subscribers ) { continue; }
                
                for ( var i = 0, len = subscribers.length; i < len; i++ ) {

                    if ( !( subscribers[i].token === token ) ) { continue; }
                    
                    subscribers.splice( i, 1 );
                    
                    return token;
                }
            }
            
            return this;
        },
        
        publish: function( channel, data ) {
 
            var subscribers = this.channels[ channel ]
                , subsLength = subscribers ? subscribers.length : 0
                ;

            if ( !subscribers ) { return false; }
 
            while ( subsLength-- ) {
                subscribers[ subsLength ].method( data );
            }
 
            return this;
        }
    }
    
    // return X;
    window.x = X;
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