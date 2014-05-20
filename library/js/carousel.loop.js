define(
    
    [
        'carousel'
    ],
    
    function( carousel ) {
        
        'use strict';
        
        var defaults = {};

        /**
         * Constructor
         */
        function Loop( api, options ) {
    
            this.api = api;
            this.options = this.api.extend( {}, defaults, options );
    
            this.setup();
        }

        Loop.prototype = {
            
            updatePosition: false,
        
            setup: function() {

                var self = this;
                
                this.api.subscribe(
                    
                    this.api.ns + '/buildFrames/before',
                    
                    function() {
                        
                        var pluginAttr = self.api.getOption( 'loop' );
                        var pluginOn = ( ( typeof pluginAttr === 'boolean' && pluginAttr === true ) || typeof pluginAttr === 'object' ) ? true : false;

                        if ( pluginOn ) {
                            
                            self.carousel = {
                                index: 0,
                                dom: self.api.getState( 'dom' ),
                                tilesPerFrame: self.api.getOption( 'tilesPerFrame' ),
                                tileArr: self.api.getState( 'tileArr' ),
                                loop: pluginOn
                            };
                            
                            self.api.trigger( 'updateOptions', { preventNavDisable:true } ); //prevent disabling of prev/next buttons

                            self.createLoopDom.call( self );
                        }
                    }
                );
                
                this.api.subscribe(
                    this.api.ns + '/syncState/after',
                    this.checkLoop.bind( this )
                );
                
                this.api.subscribe(
                    this.api.ns + '/animate/after',
                    this.reposition.bind( this )
                );
            },
        
            createLoopDom: function() {
                    
                // Add clones to create full chronological set of frames.
                // This could be pretty heavy and could be changed to just
                // fill out the incomplete frame instead.
                var thisLi, newLi;
                var clones = [];
                var tileHTMLColl = this.carousel.tileArr;
                var tileArr = Array.prototype.slice.call( tileHTMLColl );
                var origTiles = tileArr;
                var origTileLength = tileArr.length;
                var curTileLength = origTileLength;
                var carousel = this.carousel.dom.carousel;
                var tilesPerFrame = this.carousel.tilesPerFrame;
                
                while ( curTileLength % tilesPerFrame !== 0 ) {
                    
                    for ( var i = 0; i < origTileLength; i++, curTileLength++ ) {
                        tileArr.push( origTiles[i].cloneNode(true) );
                    }
                }
                
                // Add a clone of the last frame to the beginning
                for ( var i = tilesPerFrame - 1, j = 0; i >= 0; i--, j++ ) {
                    
                    newLi = tileArr[ origTileLength - 1 - i ].cloneNode(true);
                    carousel.insertBefore( newLi, carousel.children[ 0 + j ] );
                    clones.push( newLi );
                }

                tileArr = clones.concat( tileArr );
                clones = [];
                               
                // Add a clone of the first frame to the end
                for ( var i = 0; i < tilesPerFrame; i++ ) {
                    
                    newLi = origTiles[i].cloneNode(true);
                    carousel.appendChild( newLi );
                    tileArr.push( newLi );
                }

                this.api.trigger( 'updateState', { index:tilesPerFrame, tileArr:tileArr } );
            },
            
            checkLoop: function( origIndex, newIndex ) {
                
                console.log(origIndex, newIndex);

                var updateObj       = {},
                    tilesPerFrame   = this.carousel.tilesPerFrame,
                    prevFrameIndex  = this.api.getState( 'frameIndex' ),
                    prevFrame       = this.api.getState( 'prevFrame' ),
                    curFrame        = this.api.getState( 'curFrame' ),
                    curFrameLength  = this.api.getState( 'curFrameLength' ),
                    //currIndex       = this.api.getState( 'index' ),
                    curTileLength   = this.api.getState( 'curTileLength' ),
                    frameLength     = Math.ceil( curTileLength / tilesPerFrame ),
                    index           = newIndex,
                    frameIndex      = Math.ceil( index / tilesPerFrame ),
                    isFirstFrame    = index === 0,
                    isLastFrame     = index === curTileLength - tilesPerFrame,
                    shouldLoopReset = ( isFirstFrame || isLastFrame );

                if ( shouldLoopReset ) {
                                    
                    if ( isFirstFrame ) {
                        console.log('isFirstFrame');
                        index = curTileLength - ( tilesPerFrame * 2 );
                    }
                    else if ( isLastFrame ) {
                        console.log('isLastFrame');
                        index = tilesPerFrame;
                    }
                    
                    updateObj = {
                        index: index,
                        frameIndex: Math.ceil( index / tilesPerFrame ),
                        prevFrameIndex: isFirstFrame ? 1 : curFrameLength - 1,
                        prevFrame: prevFrame
                    };
                    
                    this.carousel.index = index;
                    this.updatePosition = true;
 
                    this.api.trigger( 'updateState', updateObj );
                }
            },
            
            reposition: function() {
                
                if ( this.updatePosition ) {
                    this.api.trigger( 'syncState', this.carousel.index, false );
                    this.updatePosition = false;
                }
            }
        };
    
        carousel.plugin( 'loop', function( options, api ) {

            new Loop( options, api );
        });
});