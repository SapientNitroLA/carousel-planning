define(

    [
        'vendor/carousel'
    ],

    function( carousel ) {

        var doc = document
            , selected = ' selected'
            , rBusy = /\bstate-busy\b/
            ;

        var defaults = {
            center: true,
            frameText: 'Page {number} of {total}',
            frameCurrentText: 'Current Page'
        }

        var tmplPagination = doc.createElement( 'ul' )
            , tmplFrameLink = '<li><a class="carousel-frame{selected}" data-frame="{number}" href="#" title="{current}">{frameText}</a></li>'
            ;

        tmplPagination.setAttribute( 'class', 'carousel-pagination' );

        /**
         * Constructor
         */
        function Pagination( api, options ) {

            this.api = api;
            this.options = this.api.extend( {}, defaults, options );;

            this.setup();
        }

        Pagination.prototype = {

            setup: function() {

                var self = this;

                this.api.subscribe(
                    this.api.ns + '/setup/after',
                    this.handleOptions.bind( this )
                );

                this.api.subscribe(
                    this.api.ns + '/navigation/controls/insert/before',
                    function() {
                        self.dom = self.api.getState( 'dom' );
                    }
                );

                this.api.subscribe(
                    this.api.ns + '/navigation/controls/insert/after',
                    this.buildPagination.bind( this )
                );

                this.api.subscribe(
                    this.api.ns + '/animate/before',
                    this.updatePagination.bind( this )
                );
            },

            handleOptions: function() {

                // Get the certian options passed to carousel and add them to the pagination options
                this.options.wrapControls = this.api.getOption( 'wrapControls' );
            },

            buildPagination: function( controls, btnPrev, btnNext ) {

                var current
                    , pageLinks
                    , isSelected
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
                    , viewportWidth     = this.api.outerWidth( this.dom.viewport )
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

                this.updateCSS();

                this.api.addEvent( this.pagination, 'click', this.handlePagination.bind( this ) );
            },

            updateCSS: function() {

                var controlsWidth
                    , controlsStyle
                    ;

                // Center controls beneath carousel
                if ( !( this.options.center && this.options.wrapControls ) ) return;

                controlsWidth = this.api.outerWidth( this.dom.controls );

                controlsStyle = 'position:relative; left:50%;';
                controlsStyle += 'width:' + controlsWidth + 'px;';
                controlsStyle += 'margin-left:-' + controlsWidth / 2 + 'px;'
                this.dom.controls.setAttribute( 'style', controlsStyle );
            },

            handlePagination: function(e) {

                var element = e.target || e.srcElement // IE uses srcElement
                    , frame = parseInt( element.getAttribute( 'data-frame' ), 10 )
                    , currentFrameIndex = this.api.getState( 'frameIndex' )
                    , currentFrameNumber = this.api.getState( 'frameNumber' )
                    ;

                if ( isNaN( frame ) ) return;

                // Try both for IE8 support
                if ( 'preventDefault' in e ) e.preventDefault();
                if ( 'returnValue' in e ) e.returnValue = false;

                if ( currentFrameNumber === frame ) return false;
                if ( this.dom.carousel.className.match( rBusy ) ) return false;

                // loop && frame++;

                this.api.trigger( 'jumpToFrame', frame );

            },

            updatePagination: function() {

                var rSelected = /\sselected\b/
                    , newFrameIndex = this.api.getState( 'frameIndex' )
                    , oldFrameIndex = this.api.getState( 'prevFrameIndex' )
                    , newFrame = this.paginationLinks[ newFrameIndex ]
                    , oldFrame = this.paginationLinks[ oldFrameIndex ]
                    ;

                oldFrame.className = oldFrame.className.replace( rSelected, '' );
                oldFrame.removeAttribute( 'title', '' );

                newFrame.className += selected;
                newFrame.setAttribute( 'title', this.options.frameCurrentText );
            }
        }

        carousel.plugin( 'pagination', function( options, api ) {

            new Pagination( options, api );
        });
});