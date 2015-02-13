require(
    
	[
		'carousel',
        'carousel.pagination',
        'carousel.autorotate',
        'carousel.loop',
        'carousel.responsive'
	],
    
    function( carousel ) {
		
        var options = {
                element: document.getElementById( 'carousel-test' ),
                wrapperClass: 'test-1 test-2',
                tilesPerFrame: 3,
                incrementMode: 'tile',
                nextText: 'next',
                prevText: 'previous',
                wrapControls: true,
                pagination: {
                  center: true
                },
                // autorotate: {
                //     stopEvent: 'click'
                // },
                loop: true
                //responsive: true
            }
            , thisCarousel = carousel.create( options )
            ;

        window.testCarousel = thisCarousel; //functional test waiting for this global set
    }
);