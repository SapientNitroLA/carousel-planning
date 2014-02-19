// Depends on x.js

! function(w,d) {
	
	'use strict';
	
	var self = this
		, defaults = {
			prevText: 'Previous item{plural} in list',
			nextText: 'Next item{plural} in list',
			frameText: 'Page {number} of {total}',
			frameCurrentText: 'Current Page',
			counterText: '{number} of {total}',
			increment: 1,
			incrementMode: 'frame', // tile or frame
			speed: 750,
			easing: 'swing',
			loop: false,
			pagination: false,
			centerPagination: true,
			encapsulateControls: false,
			displayCount: false,
			accessible: true,
			showTile: 0,
			wrapperDelta: 0,
			viewportDelta: 0,
			preFrameChange: null,
			postFrameChange: null
		};
	
	 // Make sure to use the correct case for IE
    var test = document.createElement( 'li' ).getAttributeNode( 'tabindex' ),
        tabindex = test ? 'tabIndex' : 'tabindex';
    test = null
	
	// Compile templates
	var tmplWrapper = d.createElement('div');
		tmplWrapper.setAttribute( 'class', 'carousel-container' );
		
	var tmplViewport = d.createElement('div');
		tmplViewport.setAttribute( 'class', 'carousel-viewport' );
		
	var tmplPN = d.createElement('a');
		tmplPN.setAttribute('href', '#');
	
	var tmplControls = d.createElement('div');
		tmplControls.setAttribute('class', 'carousel-controls');
		
	var tmplControlsParent = d.createElement('div');
		tmplControlsParent.setAttribute('class', 'carousel-controls-wrapper');
	
	var tmplPagination = d.createElement('ul');
		tmplPagination.setAttribute('class', 'carousel-pagination');
	
	var tmplCounter = d.createElement('div');
		tmplCounter.setAttribute('class', 'carousel-display-counter');
		
	var tmplSpacerTile = d.createElement('li');
		tmplSpacerTile.setAttribute('class', 'carousel-panel-spacer state-hidden');
	
	var tmplFrameLink = '<li><a class="carousel-frame{selected}" data-carousel-frame="{number}" href="#" title="{current}">{frameText}</a></li>';
	

	// - See more at: http:osric.com/chris/accidental-developer/2009/08/javascript-insertafter
	// Usage: nodeToInsertAfter.insertAfter(nodeToInsert);
	Object.prototype.insertAfter = function (newNode) {
		this.parentNode.insertBefore(newNode, this.nextSibling);
	}
	
	Object.prototype.toArray = function ( nodes ) {
		console.log("nodes",nodes);
		return
	}
	
	
	
	
	var Core = function(x, options) {
		console.log('new Core instance created');
		
		var self = this;
		
		self.x = x;
		x.state.init = false;
	}

	Core.prototype = {

		init: function(options) {
			
			var self = this;
			
			self.cacheObj = {};
			self.elementNode = options.parent;
			self.element = options.parent;
			self.options = _.defaults( defaults, options );
			
			// Make sure we have integers
			['increment', 'speed', 'showTile', 'wrapperDelta', 'viewportDelta'].forEach( function(el, i, arr) {
				self.options[ el ] = parseInt( self.options[ el ], 10 );
			});
			
			if (this.x.state.init) return;

			this.x.publish('beforeInit');

			this.x.state.init = true;

			this.x.publish('afterInit');
			
			this.setup();
			
		},

		setup: function() {
		
			var state
				, options		= this.options
				//, controlsWidth
				, self			= this
				, carousel		= this.element
				, parentNode	= this.elementNode.parentNode
				, nextSibling 	= this.elementNode.nextSibling
				, wrapper		= tmplWrapper
				, viewport		= tmplViewport
				, controls		= tmplControls
				, increment		= options.increment
				//, counter		= tmplCounter
				//, loop			= options.loop
				//, showTile		= options.showTile
				;
			
			// Make the main elements avaible to `this`
			this.wrapper = wrapper;
			this.carousel = carousel;
			this.viewport = viewport;
			//this.counter = counter;
			
			// Remove and build the carousel
			carousel.parentNode.removeChild(carousel);
			wrapper.appendChild( viewport );
			viewport.appendChild( carousel );
			
			// Replace the carousel
			if ( nextSibling ) nextSibling.insertAfter( wrapper );
			else parentNode.appendChild( wrapper );
			
			// Listen for focus on tiles
/*	
			carousel.delegate( '.carousel-panel', 'focusin focusout', function(e) {
				var action = e.type === 'focusin' ? 'add' : 'remove';
				$( e.currentTarget )[ action + 'Class' ]( 'state-focus' );
			});
*/

			// Build out the frames and state object
			state = this.normalizeState();
			
			wrapper.css( 'width', state.tileWidth * options.increment + options.wrapperDelta + 'px' );
			viewport.css( 'width', state.tileWidth * options.increment + options.viewportDelta + 'px' );
			carousel.css( 'width',	( state.tileWidth * state.curTileLength ) + 'px' );
			viewport[0].scrollLeft = state.offset;
			
			this.buildNavigation();
			
			// Add counter wrapper
			if ( options.displayCount ) this.wrapper.append( counter ) && this.updateDisplayCount();
						
			// Cache array for lazy loader
			this.lazyloadCache = new Array( state.curTileLength );
			
			// Lazy load images
			// load only the visible frame
			this.lazyloadImages( state.index, state.index + options.increment );
			
		},
		
		cache: function( key, value ) {
            
            var cache = this.cacheObj,
                query = cache[ key ] !== 'undefined' ? cache[ key ] : undefined;
            
            console.log("cache",cache);
            if ( !value ) return query;
                
            cache[ key ] = value;
            
            return cache;
            
        },
		
		normalizeState: function() {
			console.log(this.carousel);
			var clones			= [],
				index			= 0,
				state			= this.state,
				carousel		= this.carousel,
				tileArr			= carousel.children,
				origTiles		= tileArr,
				firstTile		= tileArr[0],
				tileWidth		= firstTile.offsetWidth,
				tileHeight		= firstTile.offsetHeight,
				options			= this.options,
				loop			= options.loop,
				increment		= options.increment,
				origTileLength	= tileArr.length,
				curTileLength	= origTileLength,
				frameLength		= Math.ceil( curTileLength / increment ),
				state = {
					index: index,
					offset: 0,
					spacers: 0,
					loopReset: false,
					prevIndex: false,
					tileObj: tileArr,
					tileArr: tileArr,
					origTileLength: origTileLength,
					curTileLength: curTileLength,
					tileWidth: tileWidth,
					tileHeight: tileHeight,
					curTile: false,
					prevTile: false,
					frameArr: [],
					origFrameLength: frameLength,
					curFrameLength: frameLength,
					frameWidth: increment * tileWidth,
					curFrame: [],
					prevFrame: [],
					frameIndex: 0,
					prevFrameIndex: 0
				};
			
			this.toggleAria( tileArr, 'add', 'carousel-panel' );
			
			// Pad final frame with blank panels
			if ( options.pagination ) {
				while ( curTileLength % increment !== 0 ) {
					tileArr.push( tmplSpacerTile[0].cloneNode(true) );
					state.spacers++;
					curTileLength++;
				}
			}
/*

			if ( loop ) {
									
				// Add clones to create full chronological set of frames.
				// This could be pretty heavy and could be changed to just
				// fill out the incomplete frame intead.
				while ( curTileLength % increment !== 0 ) {
					
					for ( var i = 0; i < origTileLength; i++, curTileLength++ ) {
						tileArr.push( origTiles[i].cloneNode(true) );
					}
				}
				
				// Add a clone of the last frame to the beginning
				for ( var i = increment - 1; i >= 0; i--, state.spacers++ ) {
					clones.push( tileArr[ origTileLength - 1 - i ].cloneNode(true) );
				}
				tileArr = clones.concat( tileArr );
				clones = [];
							   
				// Add a clone of the first frame to the end
				for ( var i = 0; i < increment; i++, state.spacers++ ) {
					tileArr.push( origTiles[i].cloneNode(true) );
				}
				
				index = increment;
			}
*/

			
			// Build the normalized frames array
			for ( var sec = 0, len = tileArr.length / increment, count = 1; 
					sec < len; 
					sec++, count++ ) {
				var tile = Array.prototype.slice.call( tileArr, increment * sec, increment * count );
				state.frameArr.push( tile );
			};
			
			state.index				= index;
			state.offset			= state.index ? state.frameWidth : state.offset;
			state.tileArr			= tileArr;						
			state.tileObj			= state.tileArr;
			state.curTile			= state.tileObj[state.index];
			state.curTileLength		= state.tileArr.length;
			state.curFrameLength	= Math.ceil( state.curTileLength / increment );
			state.frameIndex		= Math.ceil( state.index / increment );
			state.prevFrameIndex	= state.frameIndex;
			state.curFrame			= state.frameArr[ state.frameIndex ];
			state.tileDelta			= ( increment * state.curFrameLength ) - state.curTileLength;
			
			this.toggleAria( state.curFrame, 'remove' );
			
			console.log(tileArr);
			carousel.html( tileArr );
			
			return state;
			
		},
		
		buildNavigation: function() {
            
            var text,
                self            = this,
                state           = self.state,
                index           = state.index,
                wrapper         = self.wrapper,
                options         = self.options,
                increment       = options.increment,
                plural          = increment > 1 ? 's' : '',
                number          = plural ? increment : '',
                controls        = tmplControls.clone(),
                controlsParent  = tmplControlsParent.clone(),
                controlsWrapper = options.encapsulateControls ? controls : wrapper,
                viewport        = self.viewport,
                viewportWidth   = state.tileWidth * options.increment + options.viewportDelta;
            
            text = options.prevText.replace( '{number}', number ).replace( '{plural}', plural );
            self.prev = tmplPN.clone().attr( 'class', 'prevFrame' ).text( text );
            
            text = options.nextText.replace( '{number}', number ).replace( '{plural}', plural );
            self.next = tmplPN.clone().attr( 'class', 'nextFrame' ).text( text );
            
            self.prevDisabled = tmplPNDisabled.clone().addClass( 'prevFrame' );
            self.nextDisabled = tmplPNDisabled.clone().addClass( 'nextFrame' );
            
            // Set original buttons
            self.prevBtn = self.prev;
            self.nextBtn = self.next;
                
            // Set click events buttons
            wrapper.delegate( '.prevFrame, .nextFrame', 'click', function( e ) {
                
                var element = $( this ),
                    method = element.attr( 'class' );
                                
                e.preventDefault();
                
                if ( self.carousel.hasClass( 'aria-busy' )
                    || element.hasClass( 'disabled' ) ) return false;
                
                self[ method ]();

            });
                
            // Disable buttons if there is only one frame
            if ( state.curTileLength <= options.increment ) {
                self.prevBtn = self.prevDisabled;
                self.nextBtn = self.nextDisabled;
            }
            
            // Disable prev button
            if ( index === 0 ) self.prevBtn = self.prevDisabled;
            
            // Insert controls
            if ( !options.encapsulateControls ) {
                
                wrapper.prepend( self.prevBtn );
                options.pagination && self.buildPagination( wrapper );
                wrapper.append( self.nextBtn );
            
            } else {
                
                controlsParent.append( controls );
                controls.append( self.prevBtn );
                options.pagination && self.buildPagination( controls );
                controls.append( self.nextBtn );
                wrapper.append( controlsParent );

                // Center controls beneath carousel
                controlsWidth = self.prevBtn.outerWidth( true )
                    + self.pagination.outerWidth( true )
                    + self.nextBtn.outerWidth( true );
                    
                controls.css({
                    'position': 'relative',
                    'width': controlsWidth + 'px',
                    'left': ( ( viewportWidth / 2 ) - ( controlsWidth / 2 ) ) + 'px'
                });
                
            }
            
        },
		
		toggleAria: function( itemArray, operation, initClass ) {
            
            var item,
                classes,
                i = 0,
                self = this,
                state = self.state,
                length = itemArray.length,
                ariaHClass = ' state-hidden',
                ariaVClass = ' state-visible',
                rAriaHClass = /\sstate-hidden/,
                rAriaVClass = /\sstate-visible/,
                rSpacerClass = /carousel-panel-spacer/,
                add = operation === 'add' ? true : false,
                initClass = initClass ? ' ' + initClass : '',
                hasAriaInited = this.cache( 'hasAriaInited' );
                        
            for ( ; i < length; i++ ) {
                
                item = itemArray[i];
                classes = item.className + initClass;
                
                if ( rSpacerClass.test( classes ) ) continue;
                
                if ( add ) classes = classes.replace( rAriaVClass, ariaHClass );
                else classes = classes.replace( rAriaHClass, ariaVClass );
                
                item.className = classes.replace( /^\s/, '' );
                
                if ( !hasAriaInited ) {
                    item.className = item.className + ariaHClass;
                    item.setAttribute( tabindex, '-1' );
                }
                                                                
                classes = null;
            }
                        
            this.cache( 'hasAriaInited', true );
            
        }
	}

	window.core = function(extensions, options) {
		
		var x = new X;

		for (var i = 0; i < arguments.length; i++) {

			x.extend(arguments[i]);
		}
		
		
		var c = new Core(x, options);

		return {
			init: x.proxy(c, c.init)
		}
	}
}(window,document);