define(

    [
        'carousel'
    ],

    function( carousel ) {

        'use strict';

        var doc = document
            , selected = ' selected'
            , rBusy = /\bstate-busy\b/
            , pluginName = 'pagination'
            ;

        var defaults = {
            center: true,
            frameText: 'Page {pageNumber} of {total}',
            frameCurrentText: 'Current Page'
        };

        var tmplPagination = doc.createElement( 'ul' )
            , tmplFrameLink = '<li><a class="carousel-frame{selected}" data-frame="{number}" href="#" title="{current}">{frameText}</a></li>'
            ;

        tmplPagination.setAttribute( 'class', 'carousel-pagination' );

        /**
         * Constructor
         */
        function Pagination( api, options ) {

            this.api = api;
            this.options = this.api.extend( {}, defaults, options );

            this.setup();
        }

        Pagination.prototype = {

            setup: function() {

                var self = this;

                this.funcs = {
                    updatePagination: this.updatePagination.bind( this )
                };
                
                this.pluginName = pluginName;

                this.api.subscribe(
                    this.api.ns + '/init/before',
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
                    this.funcs.updatePagination
                );

                this.api.subscribe(
                    this.api.ns + '/navigation/rebuild/after',
                    function() {
                        self.funcs.updatePagination();
                        self.centerControls.bind( self );
                    }
                );
            },

            handleOptions: function() {

                // Get the certian options passed to carousel and add them to the pagination options
                this.options.wrapControls = this.api.getOption( 'wrapControls' );
            },

            buildPagination: function( controls, btnPrev, btnNext ) {

                this.api.publish( this.pluginName + '/buildPagination/before' );
                
                var paginationArr = this.api.trigger( 'cache', this.pluginName + '/paginationArr', this.paginationArr );

                var current
                    , pageLinks
                    , isSelected
                    , pageLinkWidth
                    , paginationWidth
                    , controlsStyle
                    , frameText
                    , selectedClass
                    , paginationLength
                    , self              = this
                    , state             = this.state
                    , options           = this.options
                    , frameLinks        = []
                    , frameLink         = tmplFrameLink
                    , rNumber           = /\{number\}/
                    , rPageNumber       = /\{pageNumber\}/
                    , rTotal            = /\{total\}/
                    , rCurrent          = /\{current\}/
                    , selected          = ' selected'
                    , rSelected         = /\{selected\}/
                    , rFrameText        = /\{frameText\}/
                    , frameIndex        = ( this.api.getOption( 'incrementMode' ) === 'frame' ) ?
                                          this.api.getState( 'frameIndex' ) : this.api.getState( 'index' )
                    , pagination        = tmplPagination.cloneNode( true )
                    , controlsWrap      = controls.parentNode
                    , btnNextParent     = btnNext.parentNode
                    , curFrameLength    = this.api.getState( 'curFrameLength' )
                    , curTileLength     = this.api.getState( 'curTileLength' )
                    , viewportWidth     = this.api.outerWidth( this.dom.viewport )
                    ;

                if ( this.api.getObjType( paginationArr ) === '[object Array]' ) {
                    
                    paginationLength = paginationArr.length;
                }
                
                else {
                    
                    paginationLength  = ( this.api.getOption( 'incrementMode' ) === 'frame' ) ? curFrameLength : curTileLength;
                    
                    paginationArr = [];
                    
                    for ( var i = 0; i < paginationLength; i++ ) {
                        
                        paginationArr.push( i );
                    }
                }
                
                this.paginationArr = paginationArr;
                this.pagination = btnNextParent.insertBefore( pagination, btnNext );

                // build pagination links
                for ( var i = 0, p = 1; i < paginationLength; i++, p++ ) {
                    
                    isSelected = frameIndex === paginationArr[ i ];
                    selectedClass = isSelected ? selected : '';
                    current = isSelected ? options.frameCurrentText : '';
                    frameText = options.frameText.replace( rPageNumber, p ).replace( rTotal, paginationLength );

                    frameLinks.push(
                        frameLink.replace( rNumber, paginationArr[ i ] )
                            .replace( rCurrent, current )
                            .replace( rSelected, selectedClass )
                            .replace( rTotal, paginationLength )
                            .replace( rFrameText, frameText )
                    );
                }

                this.pagination.insertAdjacentHTML( 'afterbegin', frameLinks.join('') );
                this.paginationLinks = pagination.querySelectorAll( 'a' );

                this.centerControls();

                this.api.addEvent( this.pagination, 'click', this.handlePagination.bind( this ) );
                
                this.api.publish( this.pluginName + '/buildPagination/after' );
            },

            centerControls: function() {

                var controlsWidth
                    ;

                // Center controls beneath carousel
                if ( !( this.options.center && this.options.wrapControls ) ) return;

                controlsWidth = this.api.outerWidth( this.dom.controls );
                
                this.dom.controls.style.position = 'relative';
                this.dom.controls.style.left = '50%';
                //this.dom.controls.style.width = controlsWidth + 'px';
                this.dom.controls.style.marginLeft = '-' + controlsWidth / 2 + 'px';
            },

            handlePagination: function(e) {

                var element = e.target || e.srcElement // IE uses srcElement
                    , frame = parseInt( element.getAttribute( 'data-frame' ), 10 )
                    , currentFrameIndex = ( this.api.getOption( 'incrementMode' ) === 'frame' ) ?
                                          this.api.getState( 'frameIndex' ) : this.api.getState( 'index' )
                    , currentFrameNumber = ( this.api.getOption( 'incrementMode' ) === 'frame' ) ?
                                           this.api.getState( 'frameNumber' ) : this.api.getState( 'index' ) + 1
                    ;

                if ( isNaN( frame ) ) return;

                // Try both for IE8 support
                if ( 'preventDefault' in e ) e.preventDefault();
                if ( 'returnValue' in e ) e.returnValue = false;

                if ( currentFrameIndex === frame ) return false;
                if ( this.dom.carousel.className.match( rBusy ) ) return false;

                // loop && frame++;

                this.api.trigger( 'jumpToFrame', frame );

            },

            updatePagination: function() {
                
                this.api.publish( this.pluginName + '/updatePagination/before' );
                
                var newFrame, pageLink, linkClass;
                var rSelected = /\s?selected\b/;
                var newFrameIndex = this.api.trigger( 'cache', this.pluginName + '/newFrameIndex' );
                
                //console.log(newFrameIndex, this.api.getObjType( newFrameIndex ), this.api.getObjType( newFrameIndex ) === '[object Number]');
                
                // No cached new index value, so get current index from state object
                if ( this.api.getObjType( newFrameIndex ) !== '[object Number]' ) {
                    
                    newFrameIndex = ( this.api.getOption( 'incrementMode' ) === 'frame' ) ?
                                    this.api.getState( 'frameIndex' ) : this.api.getState( 'index' );
                }
                
                newFrame = this.paginationLinks[ newFrameIndex ];
                
                // Turn off all pagination links
                for ( var i = 0; i < this.paginationLinks.length; i++ ) {

                    pageLink = this.paginationLinks[ i ];
                    linkClass = pageLink.className;
                    
                    // If currently selected link, turn off and stop loop
                    if ( linkClass.match( rSelected ) ) {
                        
                        linkClass = linkClass.replace( rSelected, '' );
                        pageLink.className = linkClass;
                        pageLink.removeAttribute( 'title' );
                        break;
                    }
                }
                
                // Turn current pagination link on
                if ( newFrame ) {
                    
                    newFrame.className += selected;
                    newFrame.setAttribute( 'title', this.options.frameCurrentText );
                }
                
                this.api.publish( this.pluginName + '/updatePagination/after' );
            }
        };

        carousel.plugin( pluginName, function( options, api ) {

            new Pagination( options, api );
        });
    }
);
