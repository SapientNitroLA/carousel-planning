define(
    
    [
        'carousel'
    ],
    
    function( carousel ) {
        
        'use strict';
        
        var defaults = {
            rotateInterval: 5000, //5 secs
            stopEvent: 'none'
        };

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
                        
                        var pluginAttr = self.api.getOption( 'autorotate' );
                        var pluginOn = ( ( typeof pluginAttr === 'boolean' && pluginAttr === true ) || typeof pluginAttr === 'object' ) ? true : false;
                        
                        if ( pluginOn ) {
                            
                            self.carousel = {
                                dom: self.api.getState( 'dom' ),
                                tilesPerFrame: self.api.getOption( 'tilesPerFrame' ),
                                curTileLength: self.api.getState( 'curTileLength' ),
                                autorotate: pluginOn
                            };
                            
                            self.startRotation.call( self );
                        }
                    }
                );
                
                // Subscribe to carousel nextFrame/after event
                this.api.subscribe(
                    this.api.ns + '/nextFrame/after',
                    this.rotateCarousel.bind( this )
                );
            },
        
            startRotation: function() {
                    
                this.rotateCarousel();
            
                this.funcs.stop = this.stopRotation.bind( this );
                
                if ( this.options.stopEvent === 'hover' ) {
                    
                    this.api.addEvent( this.carousel.dom.wrapper, 'mouseover', this.funcs.stop );
                    
                } else if ( this.options.stopEvent === 'click' ) {
                    
                    this.api.addEvent( this.carousel.dom.wrapper, 'click', this.funcs.stop );
                }
            },
        
            stopRotation: function() {

                clearTimeout( this.timer );
                
                this.carousel.autorotate = false;
                
                if ( this.options.stopEvent === 'hover' ) {
                                    
                    this.api.removeEvent( this.carousel.dom.wrapper, 'mouseover', this.funcs.stop );
                    
                } else if ( this.options.stopEvent === 'click' ) {
                    
                    this.api.removeEvent( this.carousel.dom.wrapper, 'click', this.funcs.stop );
                }
                
                //console.log('autorotate stopped');
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