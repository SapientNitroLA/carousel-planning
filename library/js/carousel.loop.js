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
                    
            setup: function() {

                var self = this;
                
                this.paginationArr = [];
                this.updatePosition = false;
                
                // Carousel subscribers
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
                
                // Plugin subscribers
                this.api.subscribe(
                    'pagination/buildPagination/before',
                    this.loadPagination.bind( this )
                );
                
                this.api.subscribe(
                    'pagination/updatePagination/before',
                    this.updatePagination.bind( this )
                );
            },
        
            createLoopDom: function() {
                    
                // Add clones to create full chronological set of frames.
                // This could be pretty heavy and could be changed to just
                // fill out the incomplete frame instead.
                var thisLi, newLi, updateObj;
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
                
                for ( i = tilesPerFrame; i < origTileLength + tilesPerFrame; i++ ) {
                    
                    this.paginationArr.push( i );
                }
                
                // Store first and last paginations indexes in local object
                this.firstPageIndex = tilesPerFrame;
                this.lastPageIndex = i - 1;
                
                updateObj = {
                    index: tilesPerFrame,
                    tileArr: tileArr
                };

                this.api.trigger( 'updateState', updateObj );
            },
            
            checkLoop: function( origIndex, newIndex ) {
                
                //console.log(origIndex, newIndex);

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
            },
            
            loadPagination: function() {
                
                this.api.trigger( 'cache', 'pagination/paginationArr', this.paginationArr );
            },
            
            updatePagination: function() {
                
                var oldFrameIndex, newFrameIndex;
                var prevIndex = ( this.api.getOption( 'incrementMode' ) === 'frame' ) ?
                                this.api.getState( 'prevFrameIndex' ) : this.api.getState( 'prevIndex' );
                var thisIndex = ( this.api.getOption( 'incrementMode' ) === 'frame' ) ?
                                this.api.getState( 'frameIndex' ) : this.api.getState( 'index' );
                                
                console.log(prevIndex, thisIndex, this.firstPageIndex, this.lastPageIndex );
                
                if ( prevIndex < this.firstPageIndex ) {
                    
                    oldFrameIndex = this.firstPageIndex + prevIndex + this.carousel.tilesPerFrame;
                    this.api.trigger( 'cache', 'pagination/oldFrameIndex', oldFrameIndex );
                }
                
                else if ( prevIndex > this.lastPageIndex ) {
                    
                    oldFrameIndex = this.firstPageIndex + ( prevIndex - this.lastPageIndex - 1 );
                    this.api.trigger( 'cache', 'pagination/oldFrameIndex', oldFrameIndex );
                }
                
                else {
                    // Reset any cached var value
                    this.api.trigger( 'cache', 'pagination/oldFrameIndex', 'undefined' );
                }
                
                if ( thisIndex < this.firstPageIndex ) {
                    
                    newFrameIndex = this.firstPageIndex + thisIndex + this.carousel.tilesPerFrame;
                    this.api.trigger( 'cache', 'pagination/newFrameIndex', newFrameIndex );
                }
                
                else if ( thisIndex > this.lastPageIndex ) {
                    
                    newFrameIndex = this.firstPageIndex + ( thisIndex - this.lastPageIndex - 1 );
                    console.log('newFrameIndex2', newFrameIndex);
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
});