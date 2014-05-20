require(
    
	[
		'carousel',
        'carousel.pagination',
        'carousel.autorotate',
        'carousel.loop',
        'carousel.responsive'
	],
    
    function( carousel ) {
		
        var myCarousel = carousel.create({
            element: document.getElementById( 'example-carousel' ),
            wrapperClass: 'test-1 test-2',
            tilesPerFrame: 3,
            incrementMode: 'tile',
            nextText: 'next',
            prevText: 'previous',
            wrapControls: true,
            pagination: {
              center: true // TODO handle centering when wrapControls is false. Should it simply not be done? Should wrapControls be forced to true?
            },
            autorotate: {
                stopEvent: 'hover'
            },
            loop: true,
            //responsive: true
        });
    
        // var myCarousel2 = carousel.create({
        //     element: document.getElementById( 'example-carousel-2' ),
        //     wrapperClass: 'test-3 test-4',
        //     tilesPerFrame: 2,
        //     incrementMode: 'frame',
        //     wrapControls: true,
        //     prevText: '<',
        //     nextText: '>',
        // });
        
        // var myCarousel3 = carousel.create({
        //     element: document.getElementById( 'example-carousel-3' ),
        //     wrapperClass: 'test-5 test-6',
        //     tilesPerFrame: 1,
        //     incrementMode: 'frame',
        //     wrapControls: true,
        //     prevText: '<',
        //     nextText: '>',
        //     pagination: {
        //         center:true
        //     },
        //     autorotate: {
        //         rotateInterval: 2000,
        //         stopEvent: 'click'
        //     },
        //     loop: false
        // });
	}
);