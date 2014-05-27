define(
    
    [
        'carousel'
    ],
    
    function( carousel ) {
        
        'use strict';
        
        var defaults = {};
        var dataAttr = 'data-crsl-tile';
        var pluginOn = false;

        /**
         * Constructor
         */
        function Loop( api, options ) {
    
            this.api = api;
            this.options = this.api.extend( {}, defaults, options );
    
            this.setup();
        }

        Loop.prototype = {
                    
            setup: function() {

                var self = this;
                
                this.paginationArr = [];
                this.updatePosition = false;
                
                this.funcs = {
                    updatePagination: this.updatePagination.bind( this )
                };
                
                // Carousel subscribers
                this.api.subscribe(
                    
                    this.api.ns + '/buildFrames/before',
                    
                    function() {
                        
                        var pluginAttr = self.api.getOption( 'loop' );
                        pluginOn = ( ( typeof pluginAttr === 'boolean' && pluginAttr === true ) || typeof pluginAttr === 'object' ) ? true : false;

                        if ( pluginOn ) {
                            
                            self.carousel = {
                                index: 0,
                                dom: self.api.getState( 'dom' ),
                                tilesPerFrame: self.api.getOption( 'tilesPerFrame' ),
                                tileArr: self.api.getState( 'tileArr' ),
                                incrementMode: self.api.getOption( 'incrementMode' ),
                                loop: pluginOn
                            };
                
                            self.api.subscribe(
                                self.api.ns + '/syncState/after',
                                self.checkLoop.bind( self )
                            );

                            self.api.subscribe(
                                self.api.ns + '/animate/after',
                                self.reposition.bind( self )
                            );

                            // Plugin subscribers
                            self.api.subscribe(
                                'pagination/buildPagination/before',
                                self.loadPagination.bind( self )
                            );

                            self.api.subscribe(
                                'pagination/updatePagination/before',
                                self.funcs.updatePagination
                            );
                            
                            self.api.trigger( 'updateOptions', { preventNavDisable:true } ); //prevent disabling of prev/next buttons

                            self.createLoopDom.call( self );
                        }
                    }
                );
            },
        
            createLoopDom: function() {
                    
                var thisLi, newLi, updateObj, dataIndex;
                var clones = [];
                var tileHTMLColl = this.carousel.tileArr;
                var tileArr = Array.prototype.slice.call( tileHTMLColl );
                var origTiles = tileArr;
                var origTileLength = tileArr.length;
                var curTileLength = origTileLength;
                var carousel = this.carousel.dom.carousel;
                var tilesPerFrame = this.carousel.tilesPerFrame;
                var incrementMode = this.carousel.incrementMode;
                var paginationStart = ( incrementMode === 'frame' ) ? 1 : tilesPerFrame;
                var paginationLength = ( incrementMode === 'frame' ) ?
                                       Math.ceil( ( origTileLength + tilesPerFrame ) / tilesPerFrame ) : origTileLength + tilesPerFrame;
                
                // Tag tiles before cloning                       
                for ( var i = 0; i < tileArr.length; i++ ) {
                    
                    dataIndex = ( incrementMode === 'frame' ) ? Math.floor( i / tilesPerFrame ) : i;
                    tileArr[i].setAttribute( dataAttr, dataIndex );
                }
                
                // Add clones to create full chronological set of frames
                // This could be pretty heavy and could be changed to just fill out the incomplete frame instead
                while ( curTileLength % tilesPerFrame !== 0 ) {
                    
                    for ( i = 0; i < origTileLength; i++, curTileLength++ ) {
 
                        newLi = origTiles[i].cloneNode( true );
                        carousel.appendChild( newLi );
                        tileArr.push( newLi );
                    }
                }
                
                // Add a clone of the last frame to the beginning
                for ( var i = tilesPerFrame - 1, j = 0; i >= 0; i--, j++ ) {
                    
                    newLi = tileArr[ origTileLength - 1 - i ].cloneNode( true );
                    carousel.insertBefore( newLi, carousel.children[ 0 + j ] );
                    clones.push( newLi );
                }

                tileArr = clones.concat( tileArr );
                clones = [];
                               
                // Add a clone of the first frame to the end
                for ( i = 0; i < tilesPerFrame; i++ ) {
                    
                    newLi = origTiles[i].cloneNode( true );
                    carousel.appendChild( newLi );
                    tileArr.push( newLi );
                }
                
                // Load pagination array
                for ( i = paginationStart; i < paginationLength; i++ ) {
                    
                    this.paginationArr.push( i );
                }
                
                // Store first and last paginations indexes in local object
                this.firstPageIndex = ( incrementMode === 'frame' ) ? 1 : tilesPerFrame;
                this.lastPageIndex = ( incrementMode === 'frame' ) ?
                                     Math.ceil( ( tilesPerFrame + origTileLength ) / tilesPerFrame ) - 1 : i - 1;
                
                updateObj = {
                    index: tilesPerFrame,
                    tileArr: tileArr
                };

                this.api.trigger( 'updateState', updateObj );
            },
            
            checkLoop: function( origIndex, newIndex ) {
                
                var updateObj       = {},
                    tilesPerFrame   = this.carousel.tilesPerFrame,
                    prevFrameIndex  = this.api.getState( 'frameIndex' ),
                    prevFrame       = this.api.getState( 'prevFrame' ),
                    curFrame        = this.api.getState( 'curFrame' ),
                    curFrameLength  = this.api.getState( 'curFrameLength' ),
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
            },
            
            loadPagination: function() {
                
                this.api.trigger( 'cache', 'pagination/paginationArr', this.paginationArr );
            },
            
            updatePagination: function() {
                
                var newFrame, newFrameIndex;
                var thisIndex = this.api.getState( 'index' );

                newFrame = this.carousel.tileArr[ thisIndex ];
                
                if ( newFrame ) {

                    newFrameIndex = parseInt( newFrame.getAttribute( dataAttr ), 10 );
                    this.api.trigger( 'cache', 'pagination/newFrameIndex', newFrameIndex );
                }
                
                else {
                    // Reset any cached var value
                    this.api.trigger( 'cache', 'pagination/newFrameIndex', 'undefined' );
                }
            }
        };
    
        carousel.plugin( 'loop', function( options, api ) {

            new Loop( options, api );
        });
    }
);