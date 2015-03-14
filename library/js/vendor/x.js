// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
if ( !Function.prototype.bind ) {
    Function.prototype.bind = function ( oThis ) {
        if ( typeof this !== 'function' ) {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError( 'Function.prototype.bind - what is trying to be bound is not callable' );
        }

        var aArgs = Array.prototype.slice.call( arguments, 1 ),
            fToBind = this,
            fNOP = function () {},
            fBound = function () {
              return fToBind.apply( this instanceof fNOP && oThis
                                     ? this
                                     : oThis,
                                   aArgs.concat( Array.prototype.slice.call( arguments ) ) );
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
if ( typeof Object.create !== 'function' ) {
    ( function () {
        var F = function () {};
        Object.create = function ( o ) {
            if ( arguments.length > 1 ) { throw Error( 'Second argument not supported' ); }
            if ( o === null ) { throw Error( 'Cannot set a null [[Prototype]]' ); }
            if ( typeof o !== 'object' ) { throw TypeError( 'Argument must be an object' ); }
            F.prototype = o;
            return new Fx;
        };
    })();
}

define(

    [],

    function() {

        'use strict';

        // The X library's constructor
        function xApi( component ) {

            var xObj = {};

            xObj.channels = {};
            xObj.tokenUid = -1;
            xObj.component = component;

            xObj.getState = function( key ) {
                return component.state[ key ];
            };

            xObj.getOption = function( key ) {
                return component.options[ key ];
            };

            xObj.trigger = function ( method ) {

                var func = component[ method ];

                if ( !func ) { return; }

                return func.apply( component, [].slice.call( arguments, 1 ) );
            };

            xObj.subscribe = function( channel, method ) {

                var subscribers;

                xObj.tokenUid = xObj.tokenUid + 1;

                if ( !xObj.channels[ channel ] ) {

                    xObj.channels[ channel ] = [];
                }

                subscribers = xObj.channels[ channel ];

                subscribers.push({
                    token: xObj.tokenUid,
                    method: method
                });

                return xObj.tokenUid;
            };

            xObj.unsubscribe = function( token ) {

                var subscribers;

                for ( var channel in xObj.channels ) {

                    if ( xObj.channels.hasOwnProperty( channel ) ) {

                        subscribers = xObj.channels[ channel ];

                        if ( !subscribers ) { continue; }

                        for ( var i = 0, len = subscribers.length; i < len; i++ ) {

                            if ( subscribers[ i ].token !== token ) { continue; }

                            subscribers.splice( i, 1 );

                            return token;
                        }
                    }
                }

                return xObj;
            };

            xObj.publish = function( channel ) {

                var subscribers = xObj.channels[ channel ]
                    , subsLength = subscribers ? subscribers.length : 0
                    ;

                if ( !subscribers ) { return false; }

                while ( subsLength-- ) {
                    subscribers[ subsLength ].method.apply( subscribers[ subsLength ], [].slice.call( arguments, 1 ) );
                }

                return xObj;
            };

            xObj.override = function ( name, func ) {

                if ( !xObj.component.override ) { return; }

                return xObj.component.override.call( xObj.component, name, func );
            };

            /**
             * Simple method for extending multiple objects into one.
             *
             * @source http://stackoverflow.com/questions/11197247/javascript-equivalent-of-jquerys-extend-method/11197343#11197343
             */
            xObj.extend = function extend() {

                var length = arguments.length;

                for ( var i = 1; i < length; i++ ) {

                    for ( var key in arguments[i] ) {

                        if( arguments[ i ].hasOwnProperty( key ) ) {

                            arguments[ 0 ][ key ] = arguments[ i ][ key ];
                        }
                    }
                }

                return arguments[ 0 ];
            };

            return xObj;
        }

        xApi.define = function( namespace, inter ) {

            // Component constructor
            var constructor = function( args ) {

                var compInterface = {};

                compInterface.state = {};
                compInterface.ns = namespace;

                // Provide an new instance of X
                // Pass in the component
                compInterface.x = xApi( compInterface );
                compInterface.x.ns = namespace;
                
                /*
                 *  Provide interface for instance
                 */
                inter.setupPlugins = function setupPlugins() {

                    compInterface.plugins = constructor.plugins;

                    for ( var member in compInterface.plugins ) {

                        if ( compInterface.plugins.hasOwnProperty( member ) ) {

                            if ( !( member in compInterface.options ) ) continue;

                            compInterface.x.nsPlugin = member;

                            compInterface.plugins[ member ]( compInterface.x, compInterface.options[ member ] );
                        }
                    }
                };

                // Copy provided component core object into instance interface
                for ( var member in inter ) {

                    if ( inter.hasOwnProperty( member ) ) {

                        compInterface[ member ] = inter[ member ];
                    }
                }

                // Pass in constructor arguments to new component instance
                compInterface.setup.apply( compInterface, args );

                return compInterface;
            };

            constructor.plugins = {};

            /*
             *  Provide static interface for component (non-instance)
             */
            constructor.plugin = function plugin( name, factory ) {

                constructor.plugins[ name ] = factory;
            };

            constructor.create = function create() {

                return constructor( arguments );
            };

            // Return static interface
            return constructor;
        };

        return xApi;
    }
);