!function( carousel ) {
    
    var doc = document;
    
    var tmplPagination = doc.createElement( 'ul' );
    tmplPagination.setAttribute( 'class', 'carousel-pagination' );
    
    var tmplFrameLink = '<li><a class="carousel-frame{selected}" data-carousel-frame="{number}" href="#" title="{current}">{frameText}</a></li>';
    
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
    
    function Pagination( api, options ) {
    
        this.api = api;
        this.options = options;
    
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
                this.pagination.bind( this )
            );
        },
        
        handleOptions: function() {
            
            this.options.wrapControls = this.api.getOption( 'wrapControls' );
            console.log( this.options );
        },
        
        buildPagination: function( wrapper ) {
            
            var current,
                isSelected,
                pageLink,
                pageLinks,
                pageLinkWidth,
                paginationWidth,
                self        = this,
                state       = this.state,
                options     = this.options,
                frameLinks  = [],
                frameLink   = tmplFrameLink,
                rNumber     = /\{number\}/g,
                rTotal      = /\{total\}/,
                rCurrent    = /\{current\}/,
                selected    = ' selected',
                rSelected   = /\{selected\}/,
                rFrameText  = /\{frameText\}/,
                // loop        = this.options.loop,
                frameIndex  = this.api.getState( 'frameIndex' ),
                pagination  = tmplPagination.cloneNode( true ),
                curFrameLength  = this.api.getState( 'curFrameLength' );

            // wrapper.append( pagination );
                        
            // build pagination links
            // for ( var i = 0, p = 1; i < curFrameLength; i++, p++ ) {
            //     
            //     isSelected = frameIndex === i;
            //     selected = isSelected ? selected : '';
            //     current = isSelected ? options.frameCurrentText : '';
            //     frameText = options.frameText.replace( rNumber, p ).replace( rTotal, curFrameLength );
            //     
            //     frameLinks.push(
            //         frameLink.replace( rNumber, p )
            //             .replace( rCurrent, current )
            //             .replace( rSelected, selected )
            //             .replace( rTotal, curFrameLength )
            //             .replace( rFrameText, frameText )
            //     );
            // }
                        
            // this.pagination = pagination.append( frameLinks.join('') );
            // this.paginationLinks = pagination.find( 'a' );
            // pageLink = this.paginationLinks.get(0);
                        
            // if ( this.options.centerPagination ) {
            //     
            //     // calculate width of pagination wrapper and center beneath carousel
            //     pageLinkWidth = pageLink.outerWidth(true);
            //     paginationWidth = pageLinkWidth * curFrameLength;
            //     
            //     pagination.css({
            //         'width': ( pageLinkWidth * curFrameLength ) + 'px',
            //         'left': ( ( self.viewportWidth / 2 ) - ( paginationWidth / 2 ) ) + 'px'
            //     });
            // }
            
            // pagination.delegate( '.carousel-frame', 'click', function(e) {
            //     
            //     var element = $( this ),
            //         frame = element.attr( 'data-carousel-frame' );
            //                     
            //     e.preventDefault();
            //     
            //     if ( self.carousel.hasClass( 'state-busy' )
            //         || element.hasClass( 'selected' ) ) return false;
            //                     
            //     loop && frame++;
            //     
            //     self.jumpToFrame( frame );
            // });
            
        },
        
        pagination: function( controls, prevBtn, nextBtn ) {

            prevBtn.insertAdjacentHTML( 'afterend', nodeStringify( tmplPagination ) );
        }
    }
    
    carousel.plugin( 'pagination', function( options, api ) {

        new Pagination( options, api );
    });
    
}( window.carousel );