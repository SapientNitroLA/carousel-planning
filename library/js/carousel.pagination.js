!function( carousel ) {
    
    var doc = document;
    
    var defaults = {
        center: true,
        frameText: 'Page {number} of {total}',
        frameCurrentText: 'Current Page'
    }
    
    var tmplPagination = doc.createElement( 'ul' );
    tmplPagination.setAttribute( 'class', 'carousel-pagination' );
    
    // var tmplPagination = '<ul style="height:20px;background:red;clear:left;" class="carousel-pagination"></ul>';
    var tmplFrameLink = '<li><a class="carousel-frame{selected}" data-frame="{number}" href="#" title="{current}">{frameText}</a></li>';
    
    // Utilities
    function outerWidth( element ){
      
      var width = element.offsetWidth
          , style = element.currentStyle || getComputedStyle( element ); // element.currentStyle is for IE8
          ;

      width += parseInt( style.marginLeft ) + parseInt( style.marginRight );
      
      return width;
    }
    
	// Using addEvent method for IE8 support
	// Polyfill created by John Resig: http://ejohn.org/projects/flexible-javascript-events
	function addEvent( obj, evt, fn, capture ) {
		if ( obj.attachEvent ) {
			obj[ "e" + evt + fn ] = fn;
			obj[ evt + fn ] = function() { obj[ 'e' + evt + fn ]( window.event ); }
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
    /*
    var nodeStringify = (function( element ) {

        var wrapper = document.createElement( 'div' );
        
        return function( element ) {
            
            var string;
            
            wrapper.appendChild( element );
            string = wrapper.innerHTML;
            wrapper.innerHTML = '';
            
            return string;
        }
    })();
    */
    
    function Pagination( api, options ) {
    
        this.api = api;
        this.options = this.api.extend( {}, defaults, options );;
    
        this.setup();
    }

    Pagination.prototype = {
        
        setup: function() {

            this.api.subscribe(
                this.api.ns + '/setup/after',
                this.handleOptions.bind( this )
            );
            
            this.api.subscribe(
                this.api.ns + '/navigation/controls/insert/after',
                this.buildPagination.bind( this )
            );
        },
        
        handleOptions: function() {
            
            // Get the certian options passed to carousel and add them to the pagination options
            this.options.wrapControls = this.api.getOption( 'wrapControls' );
        },
        
        buildPagination: function( controls, btnPrev, btnNext ) {
            
            var current
                , pageLink
                , pageLinks
                , isSelected
                , controlsWidth
                , pageLinkWidth
                , paginationWidth
                , controlsStyle
                , self        = this
                , state       = this.state
                , options     = this.options
                , frameLinks  = []
                , frameLink   = tmplFrameLink
                , rNumber     = /\{number\}/g
                , rTotal      = /\{total\}/
                , rCurrent    = /\{current\}/
                , selected    = ' selected'
                , rSelected   = /\{selected\}/
                , rFrameText  = /\{frameText\}/
                // , loop        = this.options.loop
                , frameIndex  = this.api.getState( 'frameIndex' )
                , pagination  = tmplPagination.cloneNode( true )
                , controlsWrap      = controls.parentNode
                , btnNextParent     = btnNext.parentNode
                , curFrameLength    = this.api.getState( 'curFrameLength' )
                , viewportWidth     = outerWidth( this.api.getState( 'dom' ).viewport )
                ;

            this.pagination = btnNextParent.insertBefore( pagination, btnNext );
                        
            // build pagination links
            for ( var i = 0, p = 1; i < curFrameLength; i++, p++ ) {
                
                isSelected = frameIndex === i;
                selected = isSelected ? selected : '';
                current = isSelected ? options.frameCurrentText : '';
                frameText = options.frameText.replace( rNumber, p ).replace( rTotal, curFrameLength );
                
                frameLinks.push(
                    frameLink.replace( rNumber, p )
                        .replace( rCurrent, current )
                        .replace( rSelected, selected )
                        .replace( rTotal, curFrameLength )
                        .replace( rFrameText, frameText )
                );
            }
                        
            this.pagination.insertAdjacentHTML( 'afterbegin', frameLinks.join('') );
            this.paginationLinks = pagination.querySelectorAll( 'a' );
            pageLink = this.paginationLinks[0];
            
            // Center controls beneath carousel
            if ( this.options.center && this.options.wrapControls ) {

                controlsWidth = outerWidth( btnPrev ) + outerWidth( this.pagination ) + outerWidth( btnNext );
                controlsStyle = 'position:relative;';
                controlsStyle += 'width:' + controlsWidth + 'px;';
                controlsStyle += 'left:' + ( viewportWidth - controlsWidth ) / 2 + 'px;'
                controls.setAttribute( 'style', controlsStyle );
            }
            
            addEvent( this.pagination, 'click', function(e) {
                
                var element = e.target
                    , frame = parseInt( element.getAttribute( 'data-frame' ), 10 )
                    ;
                
                if ( isNaN( frame ) ) return;
                
                // Try both for IE8 support
                if ( 'returnValue' in e ) e.returnValue = false;
                else e.preventDefault();
                
                // if ( self.carousel.hasClass( 'state-busy' ) || element.hasClass( 'selected' ) ) return false;

                // loop && frame++;

                self.api.trigger( 'jumpToFrame', frame );
                
            });
        }
    }
    
    carousel.plugin( 'pagination', function( options, api ) {

        new Pagination( options, api );
    });
    
}( window.carousel );