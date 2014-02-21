// Depends on x.js
!function( root, factory ) {
    if ( typeof define === 'function' && define.amd ) {
    	// AMD. Register as an anonymous module.
        define( [ 'libary/js/x', 'library/js/vendor/lodash.min' ], factory );
    } else {
        // Browser globals
        root.amdWeb = factory( root.X, root._ );
    }
}(
	this,
	function( x, _ ) {
	
	'use strict';
	
	var defaults = {
			prevText: 'Previous',
			nextText: 'Next',
			increment: 1,
			incrementMode: 'frame', // tile or frame
			encapsulateControls: false,
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
	test = null;
		
	
	// Compile templates
	var tmplWrapper = document.createElement( 'div' );
		tmplWrapper.setAttribute( 'class', 'carousel-container' );
		
	var tmplViewport = document.createElement( 'div' );
		tmplViewport.setAttribute( 'class', 'carousel-viewport' );
		
	var tmplPN = document.createElement( 'button' );
			
	var tmplPNDisabled = document.createElement( 'span' );
		tmplPNDisabled.setAttribute('class', 'disabled' );
	
	var tmplControls = document.createElement( 'div' );
		tmplControls.setAttribute('class', 'carousel-controls' );
		
	var tmplControlsParent = document.createElement( 'div' );
		tmplControlsParent.setAttribute('class', 'carousel-controls-wrapper' );
	
	var tmplPagination = document.createElement( 'ul' );
		tmplPagination.setAttribute('class', 'carousel-pagination' );
	
	var tmplCounter = document.createElement( 'div' );
		tmplCounter.setAttribute('class', 'carousel-display-counter' );
		
	var tmplSpacerTile = document.createElement( 'li' );
		tmplSpacerTile.setAttribute('class', 'carousel-panel-spacer state-hidden' );
	

	// - See more at: http:osric.com/chris/accidental-developer/2009/08/javascript-insertafter
	// Usage: nodeToInsertAfter.insertAfter(nodeToInsert);
	Object.prototype.insertAfter = function( newNode ) {
		this.parentNode.insertBefore( newNode, this.nextSibling );
	}
	
	
	
	
	var Core = function( x, options ) {
		console.log( 'new Core instance created' );
		
		var self = this;
		
		self.x = x;
		x.state.init = false;
	}

	Core.prototype = {
		
		cacheObj: {},
		elementNode: null,
		element: null,
		parentNode: null,
		options: {},
		state: {},
		
		init: function( options ) {
			
			var self = this;
			
			this.elementNode = options.parent;
			this.element = options.parent;
			this.options = _.defaults( defaults, options );
			
			// Make sure we have integers
			[ 'increment', 'speed', 'showTile', 'wrapperDelta', 'viewportDelta' ].forEach( function( el ) {
				self.options[ el ] = parseInt( self.options[ el ], 10 );
			});
			
			if (this.x.state.init) return;

			this.x.publish('beforeInit' );

			this.x.state.init = true;

			this.x.publish('afterInit' );
			
			this.setup();
			
		},

		setup: function() {
		
			var options			= this.options
				//, controlsWidth
				, self			= this
				, state			= self.state
				, carousel		= this.element
				, nextSibling	= this.elementNode.nextSibling
				, wrapper		= tmplWrapper
				, viewport		= tmplViewport
				, controls		= tmplControls
				, increment		= options.increment
				;
			
			// Make the main elements avaible to `this`
			this.parentNode = this.elementNode.parentNode;
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
			
			// !TODO: Add event listener to carousel items when focus changes
			// Get the element, add a click listener...


/*	
			carousel.delegate( '.carousel-panel', 'focusin focusout', function(e) {
				var action = e.type === 'focusin' ? 'add' : 'remove';
				$( e.currentTarget )[ action + 'Class' ]( 'state-focus' );
			});
*/

/*
			carousel.addEventListener( "click", function( e ) {
				// e.target is the clicked element!
				// If it was a list item
				if(e.target && e.target.nodeName == "button") {
					// List item found!  Output the ID!
					console.log("List item ",e.target.id.replace("post-")," was clicked!");
				}
			});
*/
			
			
			// Build out the frames and state object
			console.log( "state:", state );
			this.state = this.normalizeState();
			console.log( "state:", state );
			console.log( "state.tileWidth:", state.tileWidth );
			wrapper.style.width = state.tileWidth * options.increment + options.wrapperDelta + 'px';
			viewport.style.width = state.tileWidth * options.increment + options.viewportDelta + 'px';
			carousel.style.width = state.tileWidth * state.curTileLength + 'px';
			viewport.scrollLeft = state.offset;
			console.log(state.tileWidth * options.increment + options.wrapperDelta);
			console.log( "wrapper.innerWidth:", wrapper.innerWidth );
			
			this.buildNavigation();
			
			// Cache array for lazy loader
			this.lazyloadCache = new Array( state.curTileLength );
			
			// Lazy load images
			// load only the visible frame
			this.lazyloadImages( state.index, state.index + options.increment );
			
		},
		
		cache: function( key, value ) {
			
			var cache = this.cacheObj,
				query = cache[ key ] !== 'undefined' ? cache[ key ] : undefined;
			
			if ( !value ) return query;
				
			cache[ key ] = value;
			
			return cache;
			
		},
		
		normalizeState: function() {
			
			var index			= 0,
				state			= this.state,
				carousel		= this.carousel,
				tileArr			= carousel.children,
				origTiles		= tileArr,
				firstTile		= tileArr[ 0 ],
				tileWidth		= firstTile.offsetWidth,
				tileHeight		= firstTile.offsetHeight,
				options			= this.options,
				increment		= options.increment,
				origTileLength	= tileArr.length,
				curTileLength	= origTileLength,
				frameLength		= Math.ceil( curTileLength / increment ),
				state = {
					index: index,
					offset: 0,
					spacers: 0,
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
			
			console.log( "tileArr.offsetWidth:", tileArr[0].offsetWidth );
			
			this.toggleAria( tileArr, 'add', 'carousel-panel' );
			
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
			state.curTile			= state.tileObj[ state.index ];
			state.curTileLength		= state.tileArr.length;
			state.curFrameLength	= Math.ceil( state.curTileLength / increment );
			state.frameIndex		= Math.ceil( state.index / increment );
			state.prevFrameIndex	= state.frameIndex;
			state.curFrame			= state.frameArr[ state.frameIndex ];
			state.tileDelta			= ( increment * state.curFrameLength ) - state.curTileLength;
			
			this.toggleAria( state.curFrame, 'remove' );
			
			for ( var i = 0; i < tileArr.length; i++ ) {
				carousel.appendChild( tileArr[0] );
			}
			
			return state;
			
		},
		
		updateState: function( index, animate ) {

			var self			= this,
				state			= self.state,
				ops				= self.options,
				increment		= ops.increment,
				prevFrameIndex	= state.frameIndex,
				index			= index > state.curTileLength - increment ? state.curTileLength - increment
									: index < 0 ? 0
									: index,
				frameIndex		= Math.ceil( index / increment ),
				isFirstFrame	= index === 0,
				isLastFrame		= index === state.curTileLength - increment;
						
			_.extend( this.state, {
				index: index,
				offset: state.tileWidth * index,
				prevIndex: state.index,
				prevTile: state.curTile,
				curTile: isLastFrame && state.tileDelta && ops.incrementMode === 'frame'
							? state.tileArr[ index + state.tileDelta ]
							: state.tileArr[ index ],
				curFrame: Array.prototype.slice.call( state.tileArr, isLastFrame ? index : index, increment + index ),
				prevFrame: state.curFrame,
				frameIndex: frameIndex,
				prevFrameIndex: state.frameIndex
			});
				 
			animate && this.animate();
			
			return state;
		},
		
		animate: function() {
			
			var self = this,
				state = self.state,
				index = state.index,
				targetIndex = index,
				options = this.options,
				carousel = this.element,
				increment = options.increment,
				tileWidth = state.tileWidth,
				preFrameChange = options.preFrameChange,
				postFrameChange = options.postFrameChange,
				isFirst = index === 0,
				isLast = index === ( state.curTileLength - increment );
			
			
			
			// !TODO: Re-work extension event system
			//self.carousel.trigger( 'preFrameChange', [ state ] );
			//preFrameChange && preFrameChange.call( self, state );
			
			
			carousel.setAttribute( 'class', 'state-busy' );
			self.toggleAria( state.tileArr, 'remove' );
			self.updateNavigation();
			self.toggleAria( state.tileArr, 'add' );
			self.toggleAria( state.curFrame, 'remove' );
			state.curTile.focus();
			carousel.className.replace( /\bstate-busy\b/, '' );
			
			
			// !TODO: Re-work extension event system
			//self.carousel.trigger( 'postFrameChange', [ state ] );
			//postFrameChange && postFrameChange.call( self, state );
						
		},
		
		lazyloadImages: function( start, stop ) {
			var self = this,
				tiles = self.state.tileObj;

			if ( this.lazyloadCache[ start ] ) return;
			
			for ( var i = start; i < stop; i++ ) {
								
				self.lazyloadCache[ i ] = true;
				
				console.log(tiles);
				
				var imgs = tiles[ i ].getElementsByTagName( 'img' );
				console.log(imgs);
				
				$('img', tiles[ i ] ).each( function() {
					
					if ( !this.src ) this.src = $( this ).attr( 'original' );

				});
			}
		},
		
		buildNavigation: function() {
			
			var text,
				self			= this,
				state			= this.state,
				index			= state.index,
				wrapper			= self.wrapper,
				options			= self.options,
				increment		= options.increment,
				//number			= plural ? increment : '',
				controls		= tmplControls.cloneNode( true ),
				controlsParent	= tmplControlsParent.cloneNode( true ),
				controlsWrapper = options.encapsulateControls ? controls : wrapper,
				viewport		= self.viewport,
				viewportWidth	= state.tileWidth * options.increment + options.viewportDelta;
			
			text = options.prevText;
			self.prev = tmplPN.cloneNode( true );
			self.prev.setAttribute( 'class', 'prevFrame' );
			self.prev.innerHTML = text;
			
			text = options.nextText;
			self.next = tmplPN.cloneNode( true );
			self.next.setAttribute( 'class', 'nextFrame' );
			self.next.innerHTML = text;
			
			self.prevDisabled = tmplPNDisabled.cloneNode( true );
			self.prevDisabled.classList.add( 'prevFrame' );
			self.nextDisabled = tmplPNDisabled.cloneNode( true );
			self.nextDisabled.classList.add( 'nextFrame' );
			
			// Set original buttons
			self.prevBtn = self.prev;
			self.nextBtn = self.next;
				
			// Set click events buttons
			this.addEvent( this.parentNode, 'click', function( e ) {
				if ( e.target.nodeName == 'BUTTON' ) {
					var method = e.target.className;
					if ( method === 'prevFrame' || method === 'nextFrame' ) {
						self[ method ]();
					}
				}
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
				
				wrapper.parentNode.insertBefore( self.prevBtn, wrapper );
				wrapper.parentNode.insertBefore( self.nextBtn, wrapper );
			
			} else {
				
				controlsParent.append( controls );
				controls.append( self.prevBtn );
				controls.append( self.nextBtn );
				wrapper.append( controlsParent );

				// Center controls beneath carousel
				controlsWidth = self.prevBtn.outerWidth( true )
					+ self.nextBtn.outerWidth( true );
					
				controls.css({
					'position': 'relative',
					'width': controlsWidth + 'px',
					'left': ( ( viewportWidth / 2 ) - ( controlsWidth / 2 ) ) + 'px'
				});
				
			}
		},
		
		updateNavigation: function() {
			
			var prevDisabled,
				nextDisabled,
				self = this,
				state = this.state,
				index = state.index,
				options = self.options,
				isFirst = index === 0,
				isLast = index + this.options.increment >= state.curTileLength;
				
			prevDisabled = self.prevBtn !== self.prev;
			nextDisabled = self.nextBtn !== self.next;
										
			if ( isFirst ) this.toggleControl( 'prevBtn', 'prevDisabled', self );
			else if ( prevDisabled ) this.toggleControl( 'prevBtn', 'prev', self );

			if ( isLast ) this.toggleControl( 'nextBtn', 'nextDisabled', self );
			else if ( nextDisabled ) this.toggleControl( 'nextBtn', 'next', self );
		},
		
		prevFrame: function() {
			
			var index = this.state.index;
			
			if ( this.options.incrementMode === 'tile' ) index--;
			else index = index - this.options.increment;
			
			this.updateState( index, true );
			return this.carousel;
			
		},
		
		nextFrame: function() {
			
			var index = this.state.index;
			
			if ( this.options.incrementMode === 'tile' ) index++;
			else index = index + this.options.increment;
			
			this.updateState( index, true );
			return this.carousel;
			
		},
		
		reset: function() {
			
			var self = this,
				state = self.state,
				index = state.index,
				options = self.options;
			
			index = 0;
			
			self.updateState( index, true );
			
			return this.carousel;
			
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
				
				item = itemArray[ i ];
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
			
		},
		
		addEvent: function( obj, evt, fn, capture ) {
			if ( window.attachEvent ) {
				obj.attachEvent( 'on' + evt, fn );
			} else {
				if ( !capture ) capture = false;
				obj.addEventListener( evt, fn, capture )
			}
		},
		
		// Helper for updating buttons
		toggleControl: function( oldBtn, newBtn, obj ) {
			this.parentNode.replaceChild( obj[ newBtn ], obj[ oldBtn ])
			obj[ oldBtn ] = obj[ newBtn ];
		}
	}

	window.core = function(extensions, options) {
		
		var x = new X;

		for (var i = 0; i < arguments.length; i++) {

			x.extend(arguments[ i ]);
		}
		
		
		var c = new Core(x, options);

		return {
			init: x.proxy(c, c.init)
		}
	}
});