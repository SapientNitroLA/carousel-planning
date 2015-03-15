define(

    [],

    function() {

        'use strict';

        // The X library's constructor
        function xApi( component ) {

            var xObj = {
                channels: {},
                tokenUid: -1,
                component: component
            };

            xObj.getState = function getState( key ) {
                return component.state[ key ];
            };

            xObj.getOption = function getOption( key ) {
                return component.options[ key ];
            };

            xObj.trigger = function trigger( method ) {

                var func = component[ method ];

                if ( !func ) { return; }

                return func.apply( component, [].slice.call( arguments, 1 ) );
            };

            xObj.subscribe = function subscribe( channel, method ) {

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

            xObj.unsubscribe = function unsubscribe( token ) {

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

            xObj.publish = function publish( channel ) {

                var subscribers = xObj.channels[ channel ]
                    , subsLength = subscribers ? subscribers.length : 0
                    ;

                if ( !subscribers ) { return false; }

                while ( subsLength-- ) {
                    subscribers[ subsLength ].method.apply( subscribers[ subsLength ], [].slice.call( arguments, 1 ) );
                }

                return xObj;
            };

            xObj.override = function override( name, func ) {

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

        xApi.define = function( namespace, spec ) {

            var plugins = {};

            // Component constructor
            var constructor = function( config ) {

                // Create interface for new instance
                var compInterface = {
                    state: {},
                    ns: namespace,
                    setupPlugins: function setupPlugins() { //inits instance-level plugin functionality

                        for ( var member in plugins ) {

                            if ( plugins.hasOwnProperty( member ) ) {

                                if ( !( member in compInterface.options ) ) continue;

                                plugins[ member ]( compInterface.x, compInterface.options[ member ] );
                            }
                        }
                    }
                };
                    
                // Provide an instance of X API to new interface
                compInterface.x = xApi( compInterface );
                compInterface.x.ns = namespace;

                // Copy spec into interface
                for ( var prop in spec ) {

                    if ( spec.hasOwnProperty( prop ) ) {

                        compInterface[ prop ] = spec[ prop ];
                    }
                }

                // Pass in config object to new instance's setup method
                compInterface.setup.apply( compInterface, config );

                return compInterface;
            };

            /*
             *  Provide static interface for component (non-instance)
             */
            constructor.plugin = function plugin( name, factory ) {

                plugins[ name ] = factory;
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