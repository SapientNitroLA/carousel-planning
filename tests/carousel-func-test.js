define(
    
    [
        'intern!object',
        'intern/chai!assert',
        'intern/dojo/node!leadfoot/helpers/pollUntil',
        'require'
    ],
    
    function ( registerSuite, assert, pollUntil, require ) {

        var url = 'test.html';
        
        registerSuite({
            
            name: 'carousel functional',
            
            create: function() {

                // var url = 'test.html';

                return this.remote
                    .get( require.toUrl( url ) )
                    .then( pollUntil( 'return window.testCarousel;', 5000 ) )
                    .execute( function(){

                        return window.testCarousel;
                    })
                    .then( function( thisCarousel ) {

                        // console.log(thisCarousel);

                        assert.isObject(
                            thisCarousel,
                            'carousel should return an object.'
                        );

                        assert.isObject(
                            thisCarousel.options,
                            'carousel.options should return an object.'
                        );

                        assert.isObject(
                            thisCarousel.state,
                            'carousel.state should return an object.'
                        );
                    });
            },

            navigate: function() {

                // var url = 'test.html';

                var thisCarousel;

                return this.remote
                    .get( require.toUrl( url ) )
                    .then( pollUntil( 'return window.testCarousel;', 5000 ) )
                    .execute( function(){

                        return window.testCarousel;
                    })
                    .then( function( tc ) {

                        thisCarousel = tc;
                    })
                    .findByClassName( 'nextFrame' )
                        .click()
                    .then( function() {

                        assert.strictEqual(
                            thisCarousel.state.index,
                            1, 
                            'carousel tile index should be 1 after clicking next button.'
                        );
                    })
                    .findByClassName( 'prevFrame' )
                        .click()
                    .then( function() {

                        assert.strictEqual(
                            thisCarousel.state.index,
                            0, 
                            'carousel tile index should be 0 after clicking previous button.'
                        );
                    });
            }
        });
    }
);