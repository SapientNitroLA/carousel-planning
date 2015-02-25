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

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
if (typeof Object.create != 'function') {
    (function () {
        var F = function () {};
        Object.create = function (o) {
            if (arguments.length > 1) { throw Error('Second argument not supported');}
            if (o === null) { throw Error('Cannot set a null [[Prototype]]');}
            if (typeof o != 'object') { throw TypeError('Argument must be an object');}
            F.prototype = o;
            return new F;
        };
    })();
}

define(

    [],

    function() {

        // Provide component's static API
        var staticAPI = {

            plugin: function plugin( name, factory ) {

                this.prototype.plugins[ name ] = factory;
            },

            /**
             * Provide a way to abstract away the use of the `new` keyword to instantiate a component.
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
        };

        // Provide component's prototype API
        var protoAPI = {

            plugins: {},

            setupPlugins: function setupPlugins() {

                var plugins = this.plugins;

                for ( var member in plugins ) {

                    if ( !( member in this.options ) ) continue;

                    this.x.nsPlugin = member;

                    plugins[ member ]( this.x, this.options[ member ] );
                }
            }
        };

        // The X library's constructor
        function X( component ) {

            this.channels = {};
            this.tokenUid = -1;
            this.component = component;

            this.getState = function( key ) {
                return component.state[ key ];
            };

            this.getOption = function( key ) {
                return component.options[ key ];
            };

            this.trigger = function ( method ) {

                var func = component[ method ];

                if ( !func ) { return; }

                return func.apply( component, [].slice.call( arguments, 1 ) );
            };
        }

        X.define = function( namespace, proto ) {

            // Component constructor
            var F = function() {

                this.state = {};
                this.ns = namespace;

                // Provide an new instance of X
                // Pass in the component
                this.x = new X( this );
                this.x.ns = namespace;

                // Pass in constructor arguments to new component
                this.setup.apply( this, arguments );
            };

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
        };

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
                    subscribers[ subsLength ].method.apply( subscribers[ subsLength ], [].slice.call( arguments, 1 ) );
                }

                return this;
            },

            override: function ( name, func ) {

                if ( !this.component.override ) { return; }

                this.component.override.call( this.component, name, func );
            },

            /**
             * Simple method for extending multiple objects into one.
             *
             * @source http://stackoverflow.com/questions/11197247/javascript-equivalent-of-jquerys-extend-method/11197343#11197343
             */
            extend: function extend() {

                var length = arguments.length;

                for( var i = 1; i < length; i++ ) {

                    for( var key in arguments[i] ) {

                        if( arguments[i].hasOwnProperty( key ) ) {

                            arguments[0][key] = arguments[i][key];
                        }
                    }
                }

                return arguments[0];
            }
        };

        return X;
    }
);