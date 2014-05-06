define(
    
    [
        'carousel'
    ],
    
    function( carousel ) {
        
        'use strict';
        
        var doc = document;
        var defaults = {
            rotateInterval: 5000, //5 secs
            stopEvent: 'none'
        };
    
        // Utilities
    
        // Using addEvent method for IE8 support
        // Polyfill created by John Resig: http://ejohn.org/projects/flexible-javascript-events
        function addEvent( obj, evt, fn, capture ) {
            
            if ( obj.attachEvent ) {
                obj[ "e" + evt + fn ] = fn;
                obj[ evt + fn ] = function() { obj[ 'e' + evt + fn ]( window.event ); };
                obj.attachEvent( 'on' + evt, obj[ evt + fn ] );
                
            } else if ( obj.addEventListener ) {
                if ( !capture ) capture = false;
                obj.addEventListener( evt, fn, capture );
            }
        }
	
        // Using removeEvent method for IE8 support
        // Polyfill created by John Resig: http://ejohn.org/projects/flexible-javascript-events
        function removeEvent( obj, evt, fn ) {
            
            if ( obj.detachEvent ) {
                obj.detachEvent( 'on' + evt, obj[ evt + fn ] );
                obj[ evt + fn ] = null;
                
            } else {
                obj.removeEventListener( evt, fn, false );
            }
        }

        /**
         * Constructor
         */
        function Autorotate( api, options ) {
    
            this.api = api;
            this.options = this.api.extend( {}, defaults, options );
    
            this.setup();
        }

        Autorotate.prototype = {
            
            timer: undefined,
            
            funcs: {},
        
            setup: function() {

                var self = this;
                
                // Subscribe to carousel init event
                this.api.subscribe(
                    this.api.ns + '/init/after',
                    function() {
                        
                        var isAr = ( ( typeof self.api.getOption( 'autorotate' ) === 'boolean' && self.api.getOption( 'autorotate' ) === true ) || typeof self.api.getOption( 'autorotate' ) === 'object' ) ? true : false;
                        
                        self.carousel = {
                            dom: self.api.getState( 'dom' ),
                            tilesPerFrame: self.api.getOption( 'tilesPerFrame' ),
                            curTileLength: self.api.getState( 'curTileLength' ),
                            autorotate: isAr
                        };
                        
                        self.startRotation.call( self );
                    }
                );
                
                // Subscribe to carousel nextFrame/after event
                this.api.subscribe(
                    this.api.ns + '/nextFrame/after',
                    this.rotateCarousel.bind( this )
                );
            },
        
            startRotation: function() {

                if ( this.carousel.autorotate ) {
                    
                    this.rotateCarousel();
                
                    this.funcs.stop = this.stopRotation.bind( this );
                    
                    if ( this.options.stopEvent === 'hover' ) {
                        
                        addEvent( this.carousel.dom.wrapper, 'mouseover', this.funcs.stop );
                        
                    } else if ( this.options.stopEvent === 'click' ) {
                        
                        addEvent( this.carousel.dom.wrapper, 'click', this.funcs.stop );
                    }
                }
            },
        
            stopRotation: function() {
                console.log(this);
                clearTimeout( this.timer );
                
                this.carousel.autorotate = false;
                
                if ( this.options.stopEvent === 'hover' ) {
                                    
                    removeEvent( this.carousel.dom.wrapper, 'mouseover', this.funcs.stop );
                    
                } else if ( this.options.stopEvent === 'click' ) {
                    
                    removeEvent( this.carousel.dom.wrapper, 'click', this.funcs.stop );
                }
                
                console.log('autorotate stopped');
            },
            
            rotateCarousel: function() {
                
                var self = this;
                var isLast = self.api.getState( 'index' ) + self.carousel.tilesPerFrame >= self.carousel.curTileLength;
                //console.log(self.api.getState( 'index' ), self.carousel.curTileLength, self.carousel.tilesPerFrame, isLast);
                
                clearTimeout( this.timer );
                
                if ( self.carousel.autorotate && !isLast ) {
                    
                    self.timer = setTimeout(function() {
                        
                        if ( self.carousel.autorotate ) {
                            
                            self.api.trigger( 'nextFrame' );
                        }
                        
                    }, self.options.rotateInterval );
                }
            }
        };
    
        carousel.plugin( 'autorotate', function( options, api ) {

            new Autorotate( options, api );
        });
});