
define(
    
    [
        'carousel'
    ],
    
    function( carousel ) {
        
        'use strict';
        
        var defaults = {};
        var tilesByViewport = [
			[ '925px', 3 ],
			[ '745px', 2 ],
			[ '1px', 1 ]
        ];

        /**
         * Constructor
         */
        function Responsive( api, options ) {
    
            this.api = api;
            this.options = this.api.extend( {}, defaults, options );
    
            this.setup();
        }

        Responsive.prototype = {

			timer: undefined,
        
            setup: function() {

                var self = this;
                
                // Subscribe to carousel init event
                this.api.subscribe(
                    
                    this.api.ns + '/init/after',
                    
                    function() {
                        
                        var pluginAttr = self.api.getOption( 'responsive' );
                        var pluginOn = ( ( typeof pluginAttr === 'boolean' && pluginAttr === true ) || typeof pluginAttr === 'object' ) ? true : false;
                        var tilesPerFrame = self.api.getOption( 'tilesPerFrame' );
                        
                        if ( pluginOn ) {
                            
                            self.carousel = {
                                dom: self.api.getState( 'dom' ),
                                tilesPerFrame: tilesPerFrame,
                                currTilesPerFrame: tilesPerFrame,
                                responsive: pluginOn
                            };
                            
                            // Add resize event listener if carousel is not 1-up (stays same across breakpoints)
                            if ( self.carousel.tilesPerFrame > 1 ) {
                                
                                self.updateCarousel.call( self );
                                self.api.addEvent( window, 'resize', self.updateCarousel.bind( self ) );
                            }
                        }
                    }
                );
            },
            
            updateCarousel: function() {

				var mediaQuery;
				var self = this;

				clearTimeout( this.timer );

				this.timer = setTimeout(function() {

					for ( var i = 0; i < tilesByViewport.length; i++ ) {
						
						mediaQuery = '(min-width: ' + tilesByViewport[i][0] + ')';

						// Renormalize carousel if media query matches
						if ( window.matchMedia( mediaQuery ).matches ) {
							
							//console.log(mediaQuery, tilesByViewport[i][1], self.carousel.currTilesPerFrame);
							
							if ( tilesByViewport[i][1] !== self.carousel.currTilesPerFrame ) {
								
								self.api.trigger( 'updateOptions', { tilesPerFrame: tilesByViewport[i][1] } );
								self.api.trigger( 'buildNavigation', true );
								self.carousel.currTilesPerFrame = tilesByViewport[i][1];
							}
							
							break;
						}
					}
					
				}, 200 ); //throttle listener
			}
        };
    
        carousel.plugin( 'responsive', function( options, api ) {

            new Responsive( options, api );
        });
});