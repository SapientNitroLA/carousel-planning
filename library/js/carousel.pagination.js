!function( carousel ) {
    
    var tmplPagination = '<ul class="carousel-pagination"></ul>';
    
    function Pagination( options, api ) {
    
        this.options = options;
        this.api = api;
    
        this.setup();
    }

    Pagination.prototype = {
        
        setup: function() {
            
            // console.log( 'pagination execute setup' );
            // console.log( 'pagination execute setup', this.options, this.api );
            
            this.api.subscribe( this.api.ns + '/navigation/controls/insert/after', this.pagination.bind( this ) );
        },
        
        pagination: function( controls, prevBtn, nextBtn ) {

            prevBtn.insertAdjacentHTML( 'afterend', tmplPagination );
        }
    }
    
    carousel.plugin( 'pagination', function( options, api ) {

        new Pagination( options, api );
    });
    
}( window.carousel );